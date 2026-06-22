---
title: Production Patterns
description: Caching strategies, session storage, rate limiting, distributed locking, performance tuning, and security hardening for Redis in production.
---

# Production Patterns

This page covers how Redis is actually used at scale — the patterns that appear in almost every production codebase. Each section includes the implementation, the tradeoffs, and the failure modes to watch for.

---

## Caching Patterns

### Cache-aside (lazy loading)

The most common pattern. The application checks the cache first and populates it on a miss.

```java
@Service
public class UserService {

    @Autowired private StringRedisTemplate redisTemplate;
    @Autowired private UserRepository userRepository;
    @Autowired private ObjectMapper objectMapper;

    public User getUser(Long userId) throws JsonProcessingException {
        String cacheKey = "user:" + userId;
        String cached = redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return objectMapper.readValue(cached, User.class);  // cache hit
        }

        User user = userRepository.findById(userId).orElseThrow();
        redisTemplate.opsForValue().set(
            cacheKey,
            objectMapper.writeValueAsString(user),
            Duration.ofSeconds(300)                             // TTL 5 min
        );
        return user;
    }
}
```

Or using Spring's `@Cacheable` abstraction (simpler):

```java
@Cacheable(value = "users", key = "#userId")
public User getUser(Long userId) {
    return userRepository.findById(userId).orElseThrow();
}

@CacheEvict(value = "users", key = "#userId")
public void evictUser(Long userId) {}
```

| Property | Detail |
|---|---|
| **Read miss penalty** | Database hit on first access per key per TTL window |
| **Write behaviour** | Cache is populated lazily on read, not on write |
| **Stale data risk** | Data can be stale up to the TTL duration |
| **Cache stampede** | Many concurrent misses for the same key all hit the database |

**Cache stampede prevention:** use a short lock or probabilistic early recomputation:

```java
public User getUserSafe(Long userId) throws Exception {
    String cacheKey = "user:" + userId;
    String cached = redisTemplate.opsForValue().get(cacheKey);
    if (cached != null) {
        return objectMapper.readValue(cached, User.class);
    }

    String lockKey = "lock:user:" + userId;
    Boolean acquired = redisTemplate.opsForValue()
        .setIfAbsent(lockKey, "1", Duration.ofSeconds(5));
    if (Boolean.TRUE.equals(acquired)) {
        try {
            User user = userRepository.findById(userId).orElseThrow();
            redisTemplate.opsForValue().set(
                cacheKey, objectMapper.writeValueAsString(user),
                Duration.ofSeconds(300)
            );
            return user;
        } finally {
            redisTemplate.delete(lockKey);
        }
    } else {
        Thread.sleep(100);            // brief wait for lock holder
        return getUserSafe(userId);   // retry
    }
}
```

### Read-through

The cache layer itself fetches from the database on a miss, transparent to the application. Common in ORM-integrated caches (Spring Cache, Hibernate L2).

### Write-through

Every write goes to the cache and the database synchronously.

```java
@Transactional
public User updateUser(Long userId, UserUpdateRequest request)
        throws JsonProcessingException {
    User user = userRepository.findById(userId).orElseThrow();
    user.setName(request.getName());
    userRepository.save(user);                          // write to DB
    redisTemplate.opsForValue().set(                    // update cache
        "user:" + userId,
        objectMapper.writeValueAsString(user),
        Duration.ofSeconds(300)
    );
    return user;
}
```

- **Pro:** cache is always consistent with the database
- **Con:** write latency increases; cache filled with data that may not be read

### Write-behind (write-back)

Write to the cache immediately, flush to the database asynchronously. Highest write performance, highest risk.

- **Pro:** writes return immediately
- **Con:** if Redis crashes before the flush, data is lost — only suitable for non-critical metrics or logs

### Refresh-ahead

Proactively refresh a cache entry before it expires, avoiding the miss penalty for frequently accessed hot keys.

```java
public Product getHotProduct(Long productId) throws JsonProcessingException {
    String key = "product:" + productId;
    String data = redisTemplate.opsForValue().get(key);
    Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);

    if (ttl != null && ttl < 30) {
        String refreshGuard = "refresh:" + key;
        Boolean notRefreshing = redisTemplate.opsForValue()
            .setIfAbsent(refreshGuard, "1", Duration.ofSeconds(30));
        if (Boolean.TRUE.equals(notRefreshing)) {
            taskExecutor.execute(() -> refreshProduct(productId));  // async refresh
        }
    }

    if (data != null) {
        return objectMapper.readValue(data, Product.class);
    }
    return loadFromDb(productId);
}
```

---

## Session Storage

Redis is the standard distributed session store. It replaces sticky sessions (which break horizontal scaling) with a shared, fast, TTL-aware session layer.

```java
// Spring Session with Redis handles this automatically:
// spring.session.store-type=redis  (in application.properties)
// HttpSession is then transparently backed by Redis.

// Or manage sessions manually with HashOperations:
@Service
public class SessionService {

    @Autowired private StringRedisTemplate redisTemplate;

    public String createSession(Long userId, String role) {
        String sessionId = UUID.randomUUID().toString().replace("-", "");
        String key = "session:" + sessionId;
        Map<String, String> fields = Map.of(
            "user_id", String.valueOf(userId),
            "role",    role,
            "created", String.valueOf(Instant.now().getEpochSecond())
        );
        redisTemplate.opsForHash().putAll(key, fields);
        redisTemplate.expire(key, Duration.ofSeconds(3600));   // 1-hour TTL
        return sessionId;                                       // return to client as cookie
    }

    public Map<Object, Object> validateSession(String sessionId) {
        String key = "session:" + sessionId;
        Map<Object, Object> data = redisTemplate.opsForHash().entries(key);
        if (data.isEmpty()) return null;                        // expired or invalid
        redisTemplate.expire(key, Duration.ofSeconds(3600));   // sliding TTL
        return data;
    }
}
```

### Sessions vs JWT

| | Redis sessions | JWT (stateless tokens) |
|---|---|---|
| **Revocation** | Instant — delete the Redis key | Not possible without a blocklist |
| **Latency** | One Redis read per request | Zero network call (local verify) |
| **Horizontal scaling** | All app servers share Redis | No shared state needed |
| **Data size** | Server-side — cookie only holds session ID | Token carries all claims (can be large) |
| **Best for** | When revocation matters (logout, password change) | Stateless microservices, mobile APIs |

> **Hybrid approach:** use short-lived JWTs (5–15 minutes) validated locally + a Redis blocklist only for forced-revocation events (logout, admin action). This combines JWT performance with revocation capability.

---

## Rate Limiting

### Fixed window

```java
public boolean isRateLimited(String userId, int limit, int windowSeconds) {
    long windowSlot = Instant.now().getEpochSecond() / windowSeconds;
    String key = "rl:" + userId + ":" + windowSlot;
    Long count = redisTemplate.opsForValue().increment(key);
    if (Long.valueOf(1).equals(count)) {
        redisTemplate.expire(key, Duration.ofSeconds(windowSeconds));
    }
    return count != null && count > limit;
}
```

**Problem:** boundary bursts — a user can send `limit` requests at 00:59 and `limit` again at 01:01, effectively 2× the limit in 2 seconds.

### Sliding window with sorted sets

```java
public boolean isRateLimitedSliding(String userId, int limit, int windowSeconds) {
    String key = "rl:sliding:" + userId;
    double now = Instant.now().toEpochMilli() / 1000.0;
    double windowStart = now - windowSeconds;
    String member = userId + ":" + now + ":" + Math.random();

    List<Object> results = redisTemplate.executePipelined(
        (RedisCallback<Object>) conn -> {
            byte[] keyBytes = key.getBytes();
            conn.zSetCommands().zRemRangeByScore(
                keyBytes, Range.closed(0.0, windowStart));   // remove expired
            conn.zSetCommands().zAdd(keyBytes, now, member.getBytes());  // add request
            conn.zSetCommands().zCard(keyBytes);              // count in window
            conn.keyCommands().expire(keyBytes, windowSeconds);
            return null;
        }
    );
    Long count = (Long) results.get(2);
    return count != null && count > limit;
}
```

No boundary burst problem. Slightly more memory (one sorted set member per request).

### Token bucket with Lua (atomic)

```lua
-- KEYS[1] = bucket key
-- ARGV[1] = max_tokens, ARGV[2] = refill_rate/sec, ARGV[3] = now (float), ARGV[4] = cost
local tokens = tonumber(redis.call('HGET', KEYS[1], 'tokens') or ARGV[1])
local last    = tonumber(redis.call('HGET', KEYS[1], 'last')   or ARGV[3])
local now     = tonumber(ARGV[3])
local refill  = (now - last) * tonumber(ARGV[2])

tokens = math.min(tonumber(ARGV[1]), tokens + refill)
if tokens < tonumber(ARGV[4]) then
    redis.call('HSET', KEYS[1], 'tokens', tokens, 'last', now)
    return 0    -- rejected
end
redis.call('HSET', KEYS[1], 'tokens', tokens - tonumber(ARGV[4]), 'last', now)
return 1        -- allowed
```

---

## Distributed Locking

### Basic lock with SET NX EX

```java
private static final String RELEASE_SCRIPT =
    "if redis.call('GET', KEYS[1]) == ARGV[1] then " +
    "    return redis.call('DEL', KEYS[1]) " +
    "else return 0 end";

public String acquireLock(String resource, int ttlSeconds) {
    String lockKey = "lock:" + resource;
    String token = UUID.randomUUID().toString();
    Boolean acquired = redisTemplate.opsForValue()
        .setIfAbsent(lockKey, token, Duration.ofSeconds(ttlSeconds));
    return Boolean.TRUE.equals(acquired) ? token : null;
}

public void releaseLock(String resource, String token) {
    String lockKey = "lock:" + resource;
    RedisScript<Long> script = RedisScript.of(RELEASE_SCRIPT, Long.class);
    redisTemplate.execute(script, List.of(lockKey), token);
}
```

The `NX` flag makes acquisition atomic. The `EX` TTL prevents deadlocks if the lock holder crashes. The Lua release script prevents releasing another holder's lock.

### Lock renewal

For long operations, renew the lock's TTL before it expires:

```java
private static final String RENEW_SCRIPT =
    "if redis.call('GET', KEYS[1]) == ARGV[1] then " +
    "    return redis.call('EXPIRE', KEYS[1], ARGV[2]) " +
    "else return 0 end";

public boolean renewLock(String resource, String token, int ttlSeconds) {
    String lockKey = "lock:" + resource;
    RedisScript<Long> script = RedisScript.of(RENEW_SCRIPT, Long.class);
    Long result = redisTemplate.execute(
        script, List.of(lockKey), token, String.valueOf(ttlSeconds));
    return Long.valueOf(1).equals(result);
}
```

### Redlock

Redlock is an algorithm for distributed locking across **multiple independent Redis instances** (not replicas — truly separate instances). The client acquires the lock on a majority (N/2 + 1) of instances.

```java
// Add Redisson dependency: io.github.redisson:redisson-spring-boot-starter

@Configuration
public class RedissonConfig {

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useClusterServers()
            .addNodeAddress(
                "redis://redis1:6379",
                "redis://redis2:6379",
                "redis://redis3:6379");
        return Redisson.create(config);
    }
}

@Autowired private RedissonClient redissonClient;

public void criticalSection() throws InterruptedException {
    RLock lock = redissonClient.getLock("my-resource");
    lock.lock(10, TimeUnit.SECONDS);   // acquire with 10s TTL
    try {
        performCriticalSection();
    } finally {
        lock.unlock();
    }
}
```

> **Redlock controversies:** Martin Kleppmann argued Redlock is unsafe in systems relying on lock validity time (clock skew, GC pauses). The counter-argument is that most lock use cases do not require that level of safety. Use a fencing token (monotonically increasing number returned with the lock) for the highest-correctness requirements.

---

## Performance Tuning

### Memory optimisation

```redis
# Check how a key is stored internally
OBJECT ENCODING user:42
# Returns: ziplist, listpack, hashtable, quicklist, skiplist, embstr, raw, int

# Check memory usage of a specific key
MEMORY USAGE user:42

# Check overall memory breakdown
MEMORY DOCTOR
INFO memory
```

**Use hashes for small objects instead of separate string keys:**

```redis
-- Expensive: 4 separate keys, 4 separate metadata blocks
SET user:42:name "Alice"
SET user:42:email "alice@example.com"
SET user:42:role "admin"
SET user:42:score "950"

-- Efficient: 1 hash key, 4 fields in a compact listpack
HSET user:42 name "Alice" email "alice@example.com" role "admin" score 950
```

### Slowlog

```redis
SLOWLOG GET 10      -- last 10 slow commands
SLOWLOG LEN
SLOWLOG RESET
```

```conf
slowlog-log-slower-than 10000  # microseconds — 10ms default
slowlog-max-len 128
```

### Latency monitor

```redis
LATENCY LATEST                 -- recent latency spikes by event type
LATENCY HISTORY event          -- history for a specific event
LATENCY RESET
```

```conf
latency-monitor-threshold 100  # track events slower than 100ms
```

### Hotkey detection

When a single key receives disproportionate traffic it can saturate one shard in a cluster or the single Redis thread.

```bash
# Redis 4.0+ keyspace sampling
redis-cli --hotkeys -u redis://localhost:6379

# Monitor in real time (careful — impacts performance)
redis-cli MONITOR | grep "user:42"
```

**Mitigations for hot keys:**
- Add a small random suffix to distribute a hot key across multiple keys: `product:42:<random 1-10>`, then aggregate reads
- Use client-side caching (Redis 6+ Tracking mode) to cache values locally in the application
- Cache at the application layer with a shorter TTL than Redis

---

## Security

### Authentication: AUTH and ACLs

```conf
# redis.conf
requirepass <strong-password>   # legacy single-user auth
```

Redis 6+ introduced ACL (Access Control Lists) — per-user authentication and command permissions:

```redis
-- Create a limited read-only user
ACL SETUSER readonly on >read-only-password ~* &* +GET +MGET +HGET +HGETALL +LRANGE +SMEMBERS +ZRANGE

-- Create an app user with write access to specific key patterns
ACL SETUSER app-user on >app-password ~user:* ~session:* +@all -@dangerous

-- List all users
ACL LIST

-- Check current user
ACL WHOAMI
```

### TLS

Redis 6.0+ supports native TLS without a stunnel proxy:

```conf
tls-port 6380
tls-cert-file /etc/redis/tls/redis.crt
tls-key-file  /etc/redis/tls/redis.key
tls-ca-cert-file /etc/redis/tls/ca.crt
tls-auth-clients yes            # require client certificates
```

### Network isolation

```conf
bind 10.0.1.5                   # bind only to the private network interface, not 0.0.0.0
protected-mode yes              # refuse unauthenticated connections from non-localhost
```

In production, Redis should never be reachable from the public internet. Place it inside a VPC private subnet, use security groups to allow only application server IPs, and disable any public-facing listener.

### Disable dangerous commands

```conf
rename-command FLUSHALL ""      # disable entirely
rename-command FLUSHDB ""
rename-command CONFIG ""
rename-command DEBUG ""
rename-command KEYS ""          # KEYS blocks the event loop for large keyspaces; use SCAN instead
```

> **SCAN vs KEYS:** never use `KEYS *` in production on a large Redis instance. It blocks the entire server while scanning all keys. Use `SCAN 0 MATCH pattern COUNT 100` which iterates in small chunks without blocking.
