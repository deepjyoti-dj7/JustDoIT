# Caching Module - README

---

## Overview

This module provides comprehensive coverage of caching in Spring Boot applications, from fundamental concepts to production-ready implementations. Learn how to dramatically improve application performance using in-memory and distributed caching solutions.

### What You'll Learn

- **Caching fundamentals** - Concepts, patterns, eviction policies
- **Spring Cache abstraction** - Annotations and configuration
- **Cache providers** - Caffeine, Redis, EhCache, Hazelcast
- **Distributed caching** - Redis clustering, session management
- **Cache strategies** - Cache-aside, read-through, write-through, write-behind
- **Production best practices** - Monitoring, testing, security

---

## Module Structure

### 1. Caching Concepts
**File:** `01. Caching Concepts.md`

**Topics Covered:**
- Introduction to caching (what, why, how)
- Cache hit/miss/ratio calculations
- Types of caching: in-memory, distributed, database, web, application-level
- Cache levels: L1 (local), L2 (distributed), L3 (disk), multi-level architecture
- Eviction policies: LRU, LFU, FIFO, TTL, hybrid strategies
- Invalidation strategies: time-based, event-based, manual, write-through, write-behind
- Cache patterns: cache-aside, read-through, write-through, write-behind, refresh-ahead
- Cache key design: simple, composite, SpEL expressions, custom generators
- Consistency models: strong vs eventual consistency
- Cache stampede prevention
- Cache warming and metrics
- Common challenges: penetration, avalanche, hot key
- When to use/avoid caching

**Key Concepts:**
```
Cache Hit Ratio = Hits / (Hits + Misses)

Cache-Aside Pattern:
1. Check cache
2. If miss, load from DB
3. Store in cache
4. Return data
```

---

### 2. Cache Annotations
**File:** `02. Cache Annotations.md`

**Topics Covered:**
- Spring Cache abstraction overview
- `@EnableCaching` - Enable caching support
- `@Cacheable` - Cache method results (basic, keys, composite keys, conditional, sync mode)
- `@CachePut` - Update cache without skipping method execution
- `@CacheEvict` - Remove entries (single, all, before/after invocation)
- `@Caching` - Combine multiple cache operations
- `@CacheConfig` - Class-level cache configuration
- SpEL expressions: `#root`, `#result`, parameters, complex expressions
- Custom `KeyGenerator` - Custom cache key generation logic
- Custom `CacheResolver` - Dynamic cache selection
- Programmatic cache access via `CacheManager`
- Cache statistics and monitoring
- Best practices and common pitfalls (self-invocation, mutable objects)

**Example:**
```java
@Cacheable(value = "products", key = "#id", unless = "#result == null")
public Product getProduct(Long id) {
    return repository.findById(id).orElseThrow();
}

@CacheEvict(value = "products", key = "#product.id")
public Product updateProduct(Product product) {
    return repository.save(product);
}
```

---

### 3. Cache Providers
**File:** `03. Cache Providers.md`

**Topics Covered:**
- Cache provider overview and selection
- **Simple** (ConcurrentHashMap) - Default, for development
- **Caffeine** - High-performance local cache, recommended for single instance
- **Redis** - Distributed in-memory store, recommended for microservices
- **EhCache** - Enterprise caching with disk support, JCache compliant
- **Hazelcast** - Distributed data grid with automatic clustering
- Provider comparison: features, performance, use cases
- Configuration: properties, Java config, custom settings
- Multi-level caching (L1 + L2)
- Cache metrics and monitoring per provider

**Comparison:**

| Provider  | Distributed | Persistence | Use Case                |
|-----------|-------------|-------------|-------------------------|
| Caffeine  | ❌          | ❌          | Single instance, speed  |
| Redis     | ✅          | ✅          | Microservices, sharing  |
| EhCache   | ✅          | ✅          | Enterprise, policies    |
| Hazelcast | ✅          | ✅          | Data grid, clustering   |

---

### 4. Cache Configuration
**File:** `04. Cache Configuration.md`

**Topics Covered:**
- Spring Boot auto-configuration and detection order
- Common properties: cache type, cache names
- **Caffeine configuration**: properties, Java config, per-cache settings
- **Redis configuration**: connection, serialization, custom TTL per cache
- TTL configuration: global, per-cache, per-entry
- Cache size limits: maximum size, weighted eviction
- Eviction policies: LRU, LFU, TTL configuration
- Profile-specific configuration (dev vs prod)
- Multiple cache managers
- Custom key generators and cache resolvers
- Cache condition configuration (conditional caching)
- Transaction-aware caching
- Cache statistics and metrics configuration

**Example:**
```yaml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 600000  # 10 minutes
      key-prefix: "myapp::"
  data:
    redis:
      host: redis-server.com
      port: 6379
      password: ${REDIS_PASSWORD}
```

---

### 5. Distributed Caching
**File:** `05. Distributed Caching.md`

**Topics Covered:**
- Introduction to distributed caching (why, when, benefits)
- **Redis distributed caching**: setup, configuration, best practices
- **Redis Cluster**: sharding, hash slots, automatic failover
- **Redis Sentinel**: high availability, monitoring, automatic failover
- **Hazelcast**: embedded mode, client-server, peer-to-peer replication
- Cache consistency models: strong vs eventual
- Invalidation strategies: time-based, event-based, pub/sub
- Write-through pattern for consistency
- **Session management**: Spring Session with Redis
- Multi-level caching (local L1 + distributed L2)
- Replication strategies: master-replica, peer-to-peer
- Partition tolerance and failure handling
- Circuit breaker pattern for resilience

**Architecture:**
```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  App 1  │────>│  Redis  │<────│  App 2  │
│(Caffeine)│     │ Cluster │     │(Caffeine)│
└─────────┘     └─────────┘     └─────────┘
    L1              L2              L1
```

---

### 6. Cache Strategies
**File:** `06. Cache Strategies.md`

**Topics Covered:**
- Cache strategy selection criteria
- **Cache-Aside (Lazy Loading)**: most common, app manages cache
- **Read-Through**: cache automatically loads from DB
- **Write-Through**: write to cache and DB simultaneously
- **Write-Behind (Write-Back)**: write to cache, DB asynchronously (batched)
- **Refresh-Ahead**: proactive refresh before expiration
- Strategy comparison: pros, cons, use cases
- Invalidation strategies: time-based TTL, event-based, pub/sub, manual
- Cache warming: on startup, scheduled, selective
- Cache stampede prevention: sync loading, locks, probabilistic expiration
- Monitoring and metrics: hit ratio, evictions, latency
- Best practices per strategy

**Pattern Comparison:**

| Strategy      | Read Latency | Write Latency | Consistency | Complexity |
|---------------|--------------|---------------|-------------|------------|
| Cache-Aside   | Medium       | Low           | Eventual    | Low        |
| Read-Through  | Medium       | Low           | Eventual    | Medium     |
| Write-Through | Low          | High          | Strong      | Medium     |
| Write-Behind  | Low          | Low           | Eventual    | High       |
| Refresh-Ahead | Low          | Low           | Eventual    | High       |

---

### 7. Best Practices
**File:** `07. Best Practices.md`

**Topics Covered:**
- What to cache (good candidates vs poor candidates)
- Cache key design: simple, consistent, avoid complex keys
- TTL configuration: appropriate values based on volatility
- Cache size management: limits, eviction, memory
- Error handling: graceful degradation, circuit breaker, timeouts
- Cache invalidation: proactive, scheduled cleanup
- Monitoring and metrics: hit ratio, alerts, custom metrics
- Testing: unit tests, integration tests, cache behavior verification
- Security: secure connections, no sensitive data, key sanitization
- Performance optimization: multi-level caching, async operations, batching
- Common pitfalls: mutable objects, self-invocation, null values
- Documentation: cache strategy, configuration

**Checklist:**
```
✅ Cache only necessary data
✅ Set appropriate TTL
✅ Configure size limits
✅ Handle failures gracefully
✅ Monitor hit ratio (>80%)
✅ Test cache behavior
✅ Document strategy
✅ Never cache sensitive data
```

---

## Technology Stack

### Core Technologies
- **Spring Boot** 3.x
- **Spring Cache** abstraction
- **Java** 17+

### Cache Providers
- **Caffeine** - High-performance local cache
- **Redis** - Distributed in-memory store
- **Spring Data Redis** - Redis integration
- **Lettuce** - Redis client
- **EhCache** - Enterprise caching
- **Hazelcast** - Distributed data grid

### Monitoring & Metrics
- **Spring Boot Actuator** - Metrics endpoints
- **Micrometer** - Metrics collection
- **Prometheus** - Metrics storage
- **Grafana** - Metrics visualization

---

## Cache Provider Comparison

### When to Use Each Provider

**Caffeine (Local In-Memory)**
```java
✅ Use when:
- Single application instance
- Maximum performance needed
- Simple deployment
- Development/testing

❌ Avoid when:
- Multiple instances need to share cache
- Distributed system
- Need persistence
```

**Redis (Distributed)**
```java
✅ Use when:
- Microservices architecture
- Multiple application instances
- Session sharing required
- Need persistence
- Pub/sub messaging

❌ Avoid when:
- Single instance app
- Maximum performance critical (network overhead)
```

**EhCache (Enterprise)**
```java
✅ Use when:
- Complex eviction policies needed
- Disk overflow required
- JCache (JSR-107) compliance
- Enterprise applications

❌ Avoid when:
- Simple caching needs
- Cloud-native deployments
```

**Hazelcast (Data Grid)**
```java
✅ Use when:
- Distributed computing
- In-memory data grid
- Need complex data structures
- No external dependency

❌ Avoid when:
- Simple key-value caching
- Need established tooling (Redis mature)
```

---

## Common Cache Patterns

### 1. Cache-Aside (Lazy Loading)
```java
@Cacheable("products")
public Product getProduct(Long id) {
    return repository.findById(id).orElseThrow();
}

@CacheEvict(value = "products", key = "#id")
public void deleteProduct(Long id) {
    repository.deleteById(id);
}
```

### 2. Multi-Level Caching
```java
L1 (Caffeine - Local)
    ↓ miss
L2 (Redis - Distributed)
    ↓ miss
Database
```

### 3. Distributed Session Management
```java
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 1800)
public class SessionConfig {
}
```

### 4. Cache Stampede Prevention
```java
@Cacheable(value = "products", sync = true)
public Product getProduct(Long id) {
    // Only one thread loads on cache miss
    return repository.findById(id).orElseThrow();
}
```

---

## Configuration Examples

### Development (Simple)
```yaml
spring:
  cache:
    type: simple  # ConcurrentHashMap
```

### Production (Caffeine)
```yaml
spring:
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=10000,expireAfterWrite=10m,recordStats
    cache-names: products, users, orders
```

### Production (Redis)
```yaml
spring:
  cache:
    type: redis
    redis:
      time-to-live: 600000
      cache-null-values: false
  data:
    redis:
      host: redis-cluster.example.com
      port: 6379
      password: ${REDIS_PASSWORD}
      cluster:
        nodes:
          - node1:6379
          - node2:6379
          - node3:6379
```

### Multi-Level (Caffeine + Redis)
```java
@Bean
public CacheManager cacheManager(RedisConnectionFactory factory) {
    // L1: Caffeine (local, fast)
    CaffeineCacheManager l1 = new CaffeineCacheManager();
    l1.setCaffeine(Caffeine.newBuilder()
        .maximumSize(100)
        .expireAfterWrite(1, TimeUnit.MINUTES));
    
    // L2: Redis (distributed, shared)
    RedisCacheManager l2 = RedisCacheManager.builder(factory)
        .cacheDefaults(RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(10)))
        .build();
    
    return new CompositeCacheManager(l1, l2);
}
```

---

## Monitoring and Metrics

### Key Metrics to Track

1. **Hit Ratio**
   - Formula: `Hits / (Hits + Misses)`
   - Target: >80%
   - Action: If <70%, review cache strategy

2. **Eviction Rate**
   - High rate → increase cache size or reduce TTL
   - Monitor for memory pressure

3. **Memory Usage**
   - Track cache memory consumption
   - Alert on high usage

4. **Latency**
   - Cache operations should be <10ms
   - Database fallback latency

5. **Miss Rate**
   - High rate → poor cache key design or low TTL

### Actuator Endpoints

```yaml
management:
  endpoints:
    web:
      exposure:
        include: metrics, caches
  metrics:
    cache:
      instrument-cache: true
```

**Endpoints:**
- `GET /actuator/caches` - All caches
- `GET /actuator/caches/{cacheName}` - Specific cache
- `GET /actuator/metrics/cache.size` - Cache size
- `GET /actuator/metrics/cache.gets` - Get operations

---

## Common Challenges and Solutions

### 1. Cache Stampede
**Problem:** Multiple requests load same data on cache miss

**Solution:**
```java
@Cacheable(value = "products", sync = true)
public Product getProduct(Long id) {
    return repository.findById(id).orElseThrow();
}
```

### 2. Cache Penetration
**Problem:** Requests for non-existent data bypass cache

**Solution:**
```java
@Cacheable(value = "products")
public Optional<Product> getProduct(Long id) {
    return repository.findById(id);  // Cache empty Optional
}
```

### 3. Cache Avalanche
**Problem:** Many entries expire simultaneously

**Solution:**
```java
// Randomize TTL
Duration ttl = Duration.ofMinutes(10 + random.nextInt(5));
```

### 4. Hot Key Problem
**Problem:** Single key accessed very frequently

**Solution:**
```java
// Use local cache (L1) for hot keys
// Or replicate hot keys across nodes
```

### 5. Stale Data
**Problem:** Cache contains outdated data

**Solution:**
```java
@CacheEvict(value = "products", key = "#product.id")
public Product updateProduct(Product product) {
    return repository.save(product);
}
```

---

## Learning Path

### Beginner
1. Read **Caching Concepts** - Understand fundamentals
2. Read **Cache Annotations** - Learn Spring Cache abstraction
3. Practice with **Caffeine** - Local caching
4. Implement cache-aside pattern

### Intermediate
5. Read **Cache Providers** - Compare options
6. Read **Cache Configuration** - Advanced settings
7. Implement **Redis** - Distributed caching
8. Learn invalidation strategies

### Advanced
9. Read **Distributed Caching** - Redis clustering, Hazelcast
10. Read **Cache Strategies** - Write-through, write-behind, refresh-ahead
11. Read **Best Practices** - Production-ready patterns
12. Implement multi-level caching
13. Monitor and tune cache performance

---

## Interview Questions Summary

### Fundamentals (15 Questions)
1. What is caching and why use it?
2. What is cache hit ratio? How to calculate?
3. Explain LRU vs LFU eviction policies
4. What is TTL? TTL vs TTI?
5. What is cache-aside pattern?
6. What is distributed caching?
7. When to use caching?
8. What is cache invalidation?
9. Explain cache levels (L1, L2, L3)
10. What is cache penetration?
11. What is cache avalanche?
12. What is cache stampede?
13. What is hot key problem?
14. Strong vs eventual consistency?
15. What is cache warming?

### Spring Boot (15 Questions)
16. What is @Cacheable annotation?
17. @Cacheable vs @CachePut?
18. How to evict cache in Spring?
19. What is @CacheConfig?
20. Explain SpEL in cache keys
21. What is custom KeyGenerator?
22. How to configure cache TTL?
23. How to enable caching in Spring Boot?
24. What is sync parameter in @Cacheable?
25. How to handle null values in cache?
26. What is self-invocation problem?
27. How to configure multiple cache managers?
28. What is CacheManager?
29. How to access cache programmatically?
30. How to test caching?

### Providers & Configuration (15 Questions)
31. Caffeine vs Redis?
32. When to use EhCache?
33. What is Hazelcast?
34. How to configure Redis connection pool?
35. What is Redis Cluster?
36. What is Redis Sentinel?
37. How does Redis shard data?
38. What is JCache (JSR-107)?
39. Redis vs Memcached?
40. How to serialize objects in Redis?
41. What is multi-level caching?
42. How to configure per-cache TTL?
43. What is cache eviction policy in Redis?
44. How to monitor cache performance?
45. How to secure Redis connection?

### Advanced Patterns (15 Questions)
46. Explain write-through caching
47. What is write-behind caching?
48. Read-through vs cache-aside?
49. What is refresh-ahead strategy?
50. How to prevent cache stampede?
51. Pub/sub for cache invalidation?
52. How to implement distributed sessions?
53. What is cache replication?
54. How to handle cache failures?
55. What is circuit breaker for caching?
56. Best practices for cache key design?
57. How to implement cache warming?
58. What is probabilistic early expiration?
59. How to batch cache operations?
60. When to avoid caching?

---

## Resources

### Documentation
- [Spring Cache Abstraction](https://docs.spring.io/spring-framework/reference/integration/cache.html)
- [Caffeine Cache](https://github.com/ben-manes/caffeine)
- [Redis Documentation](https://redis.io/docs/)
- [Spring Data Redis](https://spring.io/projects/spring-data-redis)
- [Hazelcast Documentation](https://docs.hazelcast.com/)

### Tools
- **Redis CLI** - Redis command-line interface
- **RedisInsight** - Redis GUI tool
- **Hazelcast Management Center** - Hazelcast monitoring
- **Spring Boot Actuator** - Metrics and monitoring
- **Prometheus + Grafana** - Metrics visualization

### Best Practices
- Monitor cache hit ratio (>80%)
- Set appropriate TTL based on data volatility
- Use distributed caching for microservices
- Implement graceful degradation
- Never cache sensitive data
- Test cache behavior
- Document cache strategy

---

## Summary

This module covers comprehensive caching in Spring Boot: from fundamental concepts (cache-aside, eviction policies, TTL) to production-ready implementations with Caffeine (local) and Redis (distributed). Master cache annotations (@Cacheable, @CacheEvict), configuration (TTL, size, providers), distributed patterns (clustering, sessions), and strategies (write-through, write-behind, refresh-ahead). Follow best practices: monitor hit ratio, handle failures, test thoroughly, secure connections.

**Key Takeaways:**
- Caching improves performance by 10-100x for read-heavy workloads
- Use Caffeine for single instance, Redis for distributed systems
- Target >80% cache hit ratio
- Always set TTL and size limits
- Handle cache failures gracefully
- Monitor and tune based on metrics

---

**Next Module:** Logging & Monitoring →

---

**Module Status:** Complete ✅
**Total Files:** 7 + README
**Estimated Study Time:** 12-16 hours
**Difficulty:** Intermediate to Advanced
