---
title: Data Structures
description: All eight Redis data structures — Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, HyperLogLogs, and Streams — with commands, internals, and production use cases.
---

# Data Structures

Redis is not just a cache — it is a data structure server. Choosing the right structure for a problem often reduces a complex application-layer operation to a single atomic Redis command. This page covers all eight native data structures with their commands, internal encoding details, and the production patterns they enable.

---

## Strings

Strings are the simplest and most versatile structure. Despite the name, a Redis string is a binary-safe byte sequence — it can hold text, serialised JSON, integers, or raw binary data up to 512 MB.

### Core commands

```redis
SET  key value [EX seconds] [PX ms] [NX|XX]
GET  key
MSET key1 val1 key2 val2       -- atomic multi-set
MGET key1 key2                 -- atomic multi-get
INCR key                       -- atomic integer increment
INCRBY key delta
DECR key
DECRBY key delta
EXPIRE key seconds
TTL key                        -- returns seconds remaining; -1 = no TTL; -2 = not found
SETNX key value                -- set only if not exists (legacy; prefer SET ... NX)
GETSET key newval              -- return old, set new (atomic)
GETDEL key                     -- return and delete (Redis 6.2+)
```

### Internal encoding

| Value | Encoding | Why |
|---|---|---|
| Integer ≤ 2^63 | `int` | Stored as actual integer, no serialisation overhead |
| String ≤ 44 bytes | `embstr` | Single allocation, CPU cache-friendly |
| String > 44 bytes | `raw` | Standard dynamic string |

### Use cases

- **Application cache:** `SET user:123:profile <json> EX 300` — cache a serialised object for 5 minutes
- **Counter:** `INCR page:home:views` — atomic, no lost updates under concurrency
- **Rate-limit token:** `SET rl:user:123 1 NX EX 60` — set-if-not-exists as a one-per-minute guard
- **Distributed flag:** `SET feature:dark-mode:enabled 1` — toggle a feature without a database write

---

## Hashes

A Hash maps string field names to string values inside one key. It is ideal for representing objects where you need to read or write individual fields without serialising and deserialising the whole object.

### Core commands

```redis
HSET   key field value [field value ...]
HGET   key field
HMGET  key field1 field2
HGETALL key                    -- returns all field-value pairs
HDEL   key field [field ...]
HEXISTS key field
HINCRBY key field delta
HLEN   key
HKEYS  key
HVALS  key
```

### Internal encoding

| Size | Encoding |
|---|---|
| ≤ 128 fields AND all values ≤ 64 bytes | `listpack` (compact sequential layout) |
| Larger | `hashtable` |

The `listpack` encoding gives significant memory savings for small objects. A hash with 10 fields uses roughly 10× less memory than 10 separate string keys.

### Use cases

- **Session storage:** one key per session, fields for user_id, role, last_seen, cart_id — `HSET session:abc123 user_id 42 role admin`
- **Object cache with partial updates:** update only `last_seen` without re-serialising the entire object — `HSET user:42 last_seen 1750000000`
- **Counters per entity:** `HINCRBY stats:2026-06-20 page_views 1` — multiple metrics under one key

> **Hashes vs Strings for objects:** use a Hash when you need to read or write individual fields. Use a String (JSON/protobuf) when you always read the whole object — deserialisation on the client is cheaper than multiple HGET round-trips.

---

## Lists

A List is a doubly-linked list of strings, supporting O(1) push and pop at either end. It is the natural Redis structure for queues, stacks, and recent-activity feeds.

### Core commands

```redis
LPUSH  key value [value ...]   -- push to head (left)
RPUSH  key value [value ...]   -- push to tail (right)
LPOP   key [count]             -- pop from head
RPOP   key [count]             -- pop from tail
LRANGE key start stop          -- range query (0 -1 = entire list)
LLEN   key
LINDEX key index
LSET   key index value
LINSERT key BEFORE|AFTER pivot value
LTRIM  key start stop          -- trim in place
BRPOP  key [key ...] timeout   -- blocking pop (queue consumer)
LMOVE  src dst LEFT|RIGHT LEFT|RIGHT  -- atomic move between lists (reliable queue)
```

### Internal encoding

| Size | Encoding |
|---|---|
| ≤ 512 elements AND all values ≤ 64 bytes | `listpack` |
| Larger | `quicklist` (linked list of listpacks) |

### Use cases

- **FIFO queue:** producers `RPUSH queue:email <job>`, consumers `BRPOP queue:email 0` (blocking, no polling loop)
- **Recent activity feed:** `LPUSH user:42:activity <event>` + `LTRIM user:42:activity 0 99` — always keep the last 100 events, O(1) trimming
- **Reliable queue with acknowledgement:** `LMOVE queue:pending queue:processing LEFT LEFT` — atomically move a job to a processing list; on completion `LREM queue:processing 1 <job>`

---

## Sets

A Set is an unordered collection of unique strings. It supports O(1) membership testing and set-algebra operations (union, intersection, difference) that are efficient even across large sets.

### Core commands

```redis
SADD     key member [member ...]
SREM     key member [member ...]
SISMEMBER key member
SMEMBERS key                   -- all members (avoid on large sets in production)
SCARD    key                   -- count
SUNION   key [key ...]
SINTER   key [key ...]
SDIFF    key [key ...]
SUNIONSTORE dest key [key ...]
SINTERSTORE dest key [key ...]
SRANDMEMBER key [count]        -- random sampling
SPOP     key [count]           -- random remove and return
```

### Use cases

- **Deduplication:** `SADD seen:emails <address>` + `SISMEMBER seen:emails <address>` — process-once guarantees
- **Tagging:** `SADD article:42:tags redis caching performance` — tag assignment and lookup
- **Social graph:** `SINTER user:alice:friends user:bob:friends` — mutual friends in one command
- **Unique visitors per day:** `SADD visitors:2026-06-20 <user_id>` + `SCARD` — exact count (use HyperLogLog for approximate at scale)

---

## Sorted Sets

A Sorted Set (ZSet) stores unique members each associated with a floating-point **score**. Members are always ordered by score, enabling O(log N) rank queries, range scans by score, and sliding-window operations.

### Core commands

```redis
ZADD    key [NX|XX] [GT|LT] [CH] score member [score member ...]
ZSCORE  key member
ZRANK   key member              -- 0-based rank (lowest score = 0)
ZREVRANK key member
ZRANGE  key start stop [BYSCORE] [WITHSCORES] [REV] [LIMIT offset count]
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]
ZRANGEBYLEX key min max
ZREM    key member [member ...]
ZINCRBY key delta member
ZCARD   key
ZCOUNT  key min max
ZPOPMIN key [count]
ZPOPMAX key [count]
ZUNIONSTORE dest numkeys key [key ...] [WEIGHTS ...]
ZINTERSTORE dest numkeys key [key ...] [AGGREGATE MIN|MAX|SUM]
```

### Internal encoding

| Size | Encoding |
|---|---|
| ≤ 128 members AND all values ≤ 64 bytes | `listpack` |
| Larger | `skiplist` + `hashtable` |

The skiplist gives O(log N) for rank and range queries. The hashtable gives O(1) for score lookups by member name.

### Use cases

- **Leaderboard:** `ZADD leaderboard <score> <user_id>` — `ZREVRANK` for rank, `ZREVRANGE ... WITHSCORES` for top-N
- **Sliding-window rate limiting:** score = timestamp, member = request_id — `ZREMRANGEBYSCORE key 0 (now - window)` + `ZCARD` to count recent requests
- **Priority queue:** score = priority — `ZPOPMAX` to dequeue highest-priority task
- **Expiring set:** score = expire_timestamp — a background job can `ZRANGEBYSCORE key 0 now` to find expired members

---

## Bitmaps

Bitmaps are not a separate data type — they are bit-level operations on top of Strings. Each key holds up to $2^{32}$ bits (512 MB), allowing extremely compact representations of binary per-user or per-entity states.

### Core commands

```redis
SETBIT  key offset value        -- offset is 0-based bit position
GETBIT  key offset
BITCOUNT key [start end]        -- count set bits (optionally in byte range)
BITPOS  key bit [start [end]]   -- first set or clear bit
BITOP   AND|OR|XOR|NOT dest key [key ...]
```

### Use cases

- **Daily active users (DAU):** `SETBIT dau:2026-06-20 <user_id> 1` — after 1M users, key is only 125 KB; `BITCOUNT` gives exact DAU
- **Feature flags per user:** `SETBIT flag:dark-mode <user_id> 1` — check with `GETBIT`
- **Presence / login tracking:** `SETBIT present:2026-06-20 <user_id> 1` — did this user log in today?
- **Cohort analysis:** `BITOP AND result flag:dark-mode dau:2026-06-20` — users with dark mode who were active today

> **Memory:** 1 million users in a Bitmap = 125 KB. 1 million users as a Set of strings = several MB. Bitmaps win for binary attributes at scale.

---

## HyperLogLogs

A HyperLogLog (HLL) is a probabilistic data structure for estimating the cardinality (count of unique elements) of a set. It uses at most **12 KB of memory** regardless of dataset size and has a standard error of **0.81%**.

### Core commands

```redis
PFADD    key element [element ...]    -- add elements
PFCOUNT  key [key ...]                -- estimate unique count (or union of keys)
PFMERGE  dest key [key ...]           -- merge HLLs into one
```

### Use cases

- **Unique visitors per page:** `PFADD visitors:homepage <user_id>` per request — `PFCOUNT` gives approximate daily unique visitors in 12 KB
- **Unique search queries:** count distinct queries without storing them all
- **A/B test exposure count:** track how many unique users saw each variant

> **HyperLogLog vs Set:** if you need exact counts or need to check membership, use a Set. If you only need an approximate count and memory matters (millions of unique values), use HyperLogLog. You cannot retrieve individual elements from an HLL.

---

## Streams

Streams (added in Redis 5.0) are an append-only log with consumer group semantics. They are Redis's closest equivalent to Kafka partitions — but within a single Redis instance.

### Core commands

```redis
XADD    key [MAXLEN [~] count] * field value [field value ...]
        -- * auto-generates ID as millseconds-sequence
XREAD   COUNT n STREAMS key id         -- read from an ID onwards
XRANGE  key start end [COUNT n]        -- range by ID
XREVRANGE key end start [COUNT n]
XLEN    key
XTRIM   key MAXLEN [~] count

-- Consumer groups
XGROUP  CREATE key groupname id [MKSTREAM]
XREADGROUP GROUP groupname consumer COUNT n STREAMS key >   -- > = new messages
XACK    key groupname id [id ...]      -- acknowledge processing
XPENDING key groupname [start end count consumer]   -- pending messages
XCLAIM  key groupname consumer min-idle-time id     -- re-assign stuck messages
XDEL    key id [id ...]
```

### Stream IDs

Each message gets an ID of the form `milliseconds-sequence` (e.g., `1750000000000-0`). IDs are always monotonically increasing — Streams are an immutable ordered log.

### Consumer groups vs Pub/Sub

| | Streams + Consumer Groups | Pub/Sub |
|---|---|---|
| **Durability** | Persistent — messages survive restarts | At-most-once — messages lost if no subscriber |
| **Multiple consumers** | Each group gets all messages; within a group, messages fan out to members | All subscribers get all messages |
| **Replay** | Yes — read from any past ID | No |
| **Acknowledgement** | Explicit XACK | None |
| **Best for** | Reliable async job processing, event log | Real-time notifications where loss is acceptable |

### Use cases

- **Real-time event log:** `XADD events * type order_placed user_id 42 amount 150`
- **Reliable task queue with ack:** producer `XADD`, consumer group reads with `XREADGROUP`, processes, then `XACK` — dead letters via `XPENDING` + `XCLAIM`
- **Activity feed aggregation:** multiple services write to a stream, one aggregator consumer group processes all events in order
