# 📝 Concurrent Collections - Quick Interview Notes

## 🗺️ ConcurrentHashMap

**What is ConcurrentHashMap?**
- Thread-safe HashMap without locking entire map
- Better concurrency than Hashtable or synchronized Map
- Allows concurrent reads and writes

**Key Features:**
- ✅ Thread-safe without full map lock
- ✅ Better performance than Hashtable
- ✅ Null keys/values NOT allowed
- ✅ Segment-based locking (Java 7) / CAS operations (Java 8+)

**Basic Operations:**
```java
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

map.put("key", 100);
map.putIfAbsent("key", 200);     // Atomic: only if key absent
map.remove("key", 100);           // Atomic: only if value matches
map.replace("key", 100, 200);     // Atomic: replace if current value matches
```

**Atomic Operations:**
```java
// Atomic compute
map.compute("key", (k, v) -> v == null ? 1 : v + 1);

// Compute if absent
map.computeIfAbsent("key", k -> computeValue());

// Compute if present
map.computeIfPresent("key", (k, v) -> v + 1);

// Merge
map.merge("key", 1, (oldVal, newVal) -> oldVal + newVal);
```

**Bulk Operations (Java 8+):**
```java
map.forEach((k, v) -> System.out.println(k + "=" + v));
map.search((k, v) -> v > 100 ? k : null);
map.reduce(1, (k, v) -> v, (v1, v2) -> v1 + v2);
```

**ConcurrentHashMap vs Hashtable:**
| Feature | ConcurrentHashMap | Hashtable |
|---------|------------------|-----------|
| Locking | Segment/CAS | Entire map |
| Null Keys/Values | ❌ | ❌ |
| Performance | High | Low |
| Concurrency | High | Low |
| Iterator | Weakly consistent | Fail-fast |

**When to Use:**
- High concurrency scenarios
- Read-heavy workloads
- Shared caches
- Session management

---

## 📋 CopyOnWriteArrayList

**What is CopyOnWriteArrayList?**
- Thread-safe ArrayList variant
- Creates new copy of array on every write operation
- Optimized for read-heavy scenarios

**Key Features:**
- ✅ Thread-safe reads without locking
- ✅ Iterator never throws ConcurrentModificationException
- ✅ Snapshot iterators (see data at creation time)
- ❌ Expensive writes (copies entire array)
- ❌ Memory overhead

**Operations:**
```java
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();

list.add("A");           // Creates new array copy
list.add("B");           // Creates another copy
list.remove("A");        // Creates another copy

// Iterator is snapshot - won't see concurrent modifications
Iterator<String> it = list.iterator();
list.add("C");           // Iterator won't see "C"
while(it.hasNext()) {
    System.out.println(it.next()); // Prints A, B (not C)
}
```

**When to Use:**
- **Read >> Write** operations (event listeners, observers)
- Event notification lists
- Observable/Observer pattern
- Configuration lists
- Subscriber lists

**When NOT to Use:**
- Frequent writes
- Large lists
- Memory-constrained environments

**Alternative for Sets:**
```java
CopyOnWriteArraySet<String> set = new CopyOnWriteArraySet<>();
// Same characteristics as CopyOnWriteArrayList
```

---

## 🚦 BlockingQueue

**What is BlockingQueue?**
- Thread-safe queue with blocking operations
- Blocks when queue is full (put) or empty (take)
- Core of Producer-Consumer pattern

**Key Operations:**
```java
BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);

// Blocking operations
queue.put(item);         // Blocks if queue full
String item = queue.take(); // Blocks if queue empty

// Timeout operations
queue.offer(item, 5, TimeUnit.SECONDS);  // Wait max 5 seconds
String item = queue.poll(5, TimeUnit.SECONDS);

// Non-blocking operations
queue.offer(item);       // Returns false if full
String item = queue.poll(); // Returns null if empty
queue.add(item);         // Throws exception if full
String item = queue.remove(); // Throws exception if empty
```

**BlockingQueue Implementations:**

### 1. ArrayBlockingQueue
```java
BlockingQueue<String> queue = new ArrayBlockingQueue<>(100); // Fixed capacity
```
- Fixed capacity (bounded)
- Backed by array
- FIFO ordering
- Optionally fair

### 2. LinkedBlockingQueue
```java
BlockingQueue<String> queue = new LinkedBlockingQueue<>();      // Unbounded
BlockingQueue<String> queue = new LinkedBlockingQueue<>(100);  // Bounded
```
- Optionally bounded
- Backed by linked nodes
- FIFO ordering
- Better throughput than ArrayBlockingQueue

### 3. PriorityBlockingQueue
```java
BlockingQueue<Integer> queue = new PriorityBlockingQueue<>();
```
- Unbounded
- Natural ordering or Comparator
- Head is minimum element
- Not FIFO

### 4. SynchronousQueue
```java
BlockingQueue<String> queue = new SynchronousQueue<>();
```
- No capacity (0 elements)
- Direct handoff between threads
- Producer waits for consumer

### 5. DelayQueue
```java
BlockingQueue<Delayed> queue = new DelayQueue<>();
```
- Unbounded
- Elements with delay
- Elements available after delay expires

### 6. LinkedTransferQueue
```java
TransferQueue<String> queue = new LinkedTransferQueue<>();
```
- Unbounded
- Producer can wait for consumer (transfer)
- Faster than LinkedBlockingQueue

**Comparison:**
| Type | Bounded | Ordering | Use Case |
|------|---------|----------|----------|
| ArrayBlockingQueue | ✅ | FIFO | Fixed size buffer |
| LinkedBlockingQueue | Optional | FIFO | Variable workload |
| PriorityBlockingQueue | ❌ | Priority | Task prioritization |
| SynchronousQueue | ✅ (0) | - | Direct handoff |
| DelayQueue | ❌ | Delay | Delayed tasks |

**Use Cases:**
- Producer-Consumer pattern
- Task queues
- Thread pools
- Message passing
- Work queues

---

## 🔗 ConcurrentLinkedQueue

**What is ConcurrentLinkedQueue?**
- Thread-safe unbounded queue
- Non-blocking (wait-free using CAS)
- FIFO ordering
- No size() in constant time

**Operations:**
```java
ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<>();

queue.offer("A");        // Add to tail
String item = queue.poll(); // Remove from head (returns null if empty)
String item = queue.peek(); // View head without removing

// Not constant time!
int size = queue.size();
boolean empty = queue.isEmpty();
```

**ConcurrentLinkedQueue vs LinkedBlockingQueue:**
| Feature | ConcurrentLinkedQueue | LinkedBlockingQueue |
|---------|----------------------|---------------------|
| Blocking | ❌ Non-blocking | ✅ Blocking |
| Bounded | ❌ Unbounded | Optional |
| Performance | Higher | Moderate |
| Use Case | Non-blocking needed | Producer-Consumer |

**When to Use:**
- Non-blocking operations required
- High throughput needed
- Don't need blocking semantics
- Message passing without waiting

---

## 🔄 Collections Synchronization

**Synchronized Wrappers:**
```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Set<String> syncSet = Collections.synchronizedSet(new HashSet<>());
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());
```

**Key Points:**
- ⚠️ Entire collection locked on each operation
- ⚠️ Must manually synchronize during iteration:
```java
synchronized(syncList) {
    for(String item : syncList) {
        // Process item
    }
}
```
- ❌ Poor performance under high concurrency
- ❌ Iterator is fail-fast

**Synchronized vs Concurrent Collections:**
| Feature | Synchronized Collections | Concurrent Collections |
|---------|-------------------------|------------------------|
| Locking | Entire collection | Fine-grained/Lock-free |
| Performance | Low (high contention) | High |
| Iterator | Fail-fast | Weakly consistent |
| Null | Usually allowed | Usually not allowed |
| Recommendation | ❌ Avoid | ✅ Use instead |

---

## 🎯 Collection Selection Guide

**Choose based on requirements:**

### For Maps:
- **ConcurrentHashMap** - Default choice for concurrent map
- **ConcurrentSkipListMap** - Sorted concurrent map

### For Lists:
- **CopyOnWriteArrayList** - Read-heavy, infrequent writes
- **Vector/synchronized List** - ❌ Avoid, use CopyOnWriteArrayList instead

### For Sets:
- **CopyOnWriteArraySet** - Read-heavy, small set
- **ConcurrentSkipListSet** - Sorted concurrent set
- **Collections.newSetFromMap(new ConcurrentHashMap<>())** - Large set

### For Queues:
- **ArrayBlockingQueue** - Bounded producer-consumer
- **LinkedBlockingQueue** - Unbounded/bounded, better throughput
- **ConcurrentLinkedQueue** - Non-blocking, high throughput
- **PriorityBlockingQueue** - Priority-based processing
- **SynchronousQueue** - Direct handoff, no storage

---

## 🎯 Quick Interview Points

1. **ConcurrentHashMap vs Hashtable?** - ConcurrentHashMap has better concurrency (segment locks/CAS), Hashtable locks entire map
2. **CopyOnWriteArrayList when?** - Read-heavy, infrequent writes (event listeners)
3. **BlockingQueue use case?** - Producer-Consumer pattern
4. **put() vs offer()?** - put() blocks, offer() returns false
5. **take() vs poll()?** - take() blocks, poll() returns null
6. **ArrayBlockingQueue vs LinkedBlockingQueue?** - Array is bounded, Linked is optionally bounded with better throughput
7. **SynchronousQueue capacity?** - 0 (direct handoff)
8. **ConcurrentLinkedQueue blocking?** - No, non-blocking
9. **Null in ConcurrentHashMap?** - Not allowed (keys or values)
10. **Synchronized collection iteration?** - Must manually synchronize the iteration block
11. **CopyOnWriteArrayList iterator?** - Snapshot, never throws ConcurrentModificationException
12. **Best concurrent map?** - ConcurrentHashMap for most cases

---

## 📊 Performance Characteristics

| Collection | Read | Write | Space | Best For |
|------------|------|-------|-------|----------|
| ConcurrentHashMap | Fast | Fast | Moderate | General concurrent map |
| CopyOnWriteArrayList | Very Fast | Slow | High | Read-heavy |
| ArrayBlockingQueue | Fast | Fast | Fixed | Bounded buffer |
| LinkedBlockingQueue | Fast | Fast | Variable | Unbounded buffer |
| ConcurrentLinkedQueue | Very Fast | Very Fast | Variable | Non-blocking queue |
| Collections.synchronized | Slow | Slow | Low | ❌ Avoid |
