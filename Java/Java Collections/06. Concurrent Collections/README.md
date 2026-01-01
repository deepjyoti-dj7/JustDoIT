# 📝 Concurrent Collections - Quick Interview Notes

## 🔒 Concurrent Collections Overview

**Why Concurrent Collections?**
- **Thread-safe** - Safe for concurrent access
- **High performance** - Better than synchronized wrappers
- **Lock-free algorithms** - CAS (Compare-And-Swap)
- **No ConcurrentModificationException** - Weakly consistent iterators

**Common Concurrent Collections:**
- ConcurrentHashMap
- ConcurrentLinkedQueue
- ConcurrentLinkedDeque
- ConcurrentSkipListMap
- ConcurrentSkipListSet
- CopyOnWriteArrayList
- CopyOnWriteArraySet
- BlockingQueue implementations

---

## 🗂️ ConcurrentHashMap (Detailed)

**Characteristics:**
- **Thread-safe Map** - High concurrency
- **No null key/value** - Throws NullPointerException
- **Segment locking (Java 7)** - 16 segments by default
- **CAS + synchronized (Java 8+)** - Per-bin locking
- **Atomic operations** - putIfAbsent, compute, merge

**Java 7 Implementation:**
```
ConcurrentHashMap
├── Segment 0 (lock)
│   └── HashEntry chain
├── Segment 1 (lock)
│   └── HashEntry chain
└── ...
```
- Array of Segments (default 16)
- Each segment has its own lock
- Concurrency level = 16 concurrent writes

**Java 8+ Implementation:**
- Array of Nodes (like HashMap)
- CAS for updates when no collision
- Synchronized block for collision handling
- TreeBin when bucket size > 8
- Better concurrency (no segment concept)

**Key Methods:**
```java
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// Basic operations (thread-safe)
map.put("A", 1);
Integer val = map.get("A");
map.remove("A");

// Atomic operations
map.putIfAbsent("B", 2);
map.remove("A", 1);  // Remove only if matches value
map.replace("B", 2, 3);  // Replace only if old value matches
map.replace("B", 4);

// Compute operations (atomic)
map.compute("A", (k, v) -> (v == null) ? 1 : v + 1);
map.computeIfAbsent("C", k -> 3);
map.computeIfPresent("A", (k, v) -> v * 2);
map.merge("A", 1, Integer::sum);

// Bulk operations (parallelThreshold = 1 for demo)
map.forEach(1, (k, v) -> System.out.println(k + "=" + v));
map.forEachKey(1, System.out::println);
map.forEachValue(1, System.out::println);
map.forEachEntry(1, entry -> System.out.println(entry));

// Search
String result = map.search(1, (k, v) -> v > 5 ? k : null);

// Reduction
int sum = map.reduce(1, (k, v) -> v, Integer::sum);
int valueSum = map.reduceValues(1, Integer::sum);
```

**When to Use:**
- ✅ Multi-threaded access
- ✅ Read-heavy workloads
- ✅ High concurrency
- ❌ Need null keys/values

**Time Complexity:**
- get: O(1) average
- put: O(1) average with CAS
- remove: O(1) average

---

## 🔗 ConcurrentLinkedQueue

**Characteristics:**
- **Unbounded thread-safe queue** - FIFO
- **Lock-free** - CAS-based
- **Non-blocking** - Wait-free reads
- **Weakly consistent iterator** - No ConcurrentModificationException
- **No null elements**

**Internal:**
- Linked nodes
- CAS operations for updates
- Michael-Scott non-blocking queue algorithm

**Usage:**
```java
ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<>();

// Thread-safe operations
queue.offer("A");
queue.offer("B");
String item = queue.poll();  // "A"
String peek = queue.peek();  // "B"

// Size is NOT constant time (O(n))
int size = queue.size();  // Expensive!
boolean empty = queue.isEmpty();
```

**When to Use:**
- ✅ Concurrent queue operations
- ✅ Multiple producers/consumers
- ✅ Non-blocking required
- ❌ Need blocking behavior (use BlockingQueue)
- ❌ Frequent size() calls

**Time Complexity:**
- offer/poll/peek: O(1) average
- size: O(n) - iterates through all nodes

---

## 🔄 ConcurrentLinkedDeque

**Characteristics:**
- **Unbounded thread-safe deque** - Double-ended queue
- **Lock-free** - CAS-based
- **Weakly consistent iterator**
- **No null elements**

**Usage:**
```java
ConcurrentLinkedDeque<String> deque = new ConcurrentLinkedDeque<>();

// Add at both ends
deque.offerFirst("A");
deque.offerLast("B");

// Remove from both ends
String first = deque.pollFirst();
String last = deque.pollLast();

// Peek at both ends
String peekFirst = deque.peekFirst();
String peekLast = deque.peekLast();
```

**When to Use:**
- ✅ Concurrent deque operations
- ✅ Work-stealing queues
- ✅ Both-end access needed

**Time Complexity:**
- All operations: O(1) average

---

## 🌲 ConcurrentSkipListMap

**Characteristics:**
- **Thread-safe sorted map** - NavigableMap
- **Skip list** - Probabilistic data structure
- **Sorted by keys** - Natural order or Comparator
- **Lock-free** - CAS-based
- **No null key** (null values allowed)

**Internal:**
- Skip list with multiple levels
- Average O(log n) operations
- More space than TreeMap

**Usage:**
```java
ConcurrentSkipListMap<Integer, String> map = new ConcurrentSkipListMap<>();

// Thread-safe operations
map.put(3, "C");
map.put(1, "A");
map.put(2, "B");
// Iteration: 1, 2, 3 (sorted)

// NavigableMap methods (thread-safe)
Map.Entry<Integer, String> first = map.firstEntry();
Map.Entry<Integer, String> last = map.lastEntry();
Map.Entry<Integer, String> ceil = map.ceilingEntry(2);
Map.Entry<Integer, String> floor = map.floorEntry(2);

// SubMaps (live views)
ConcurrentNavigableMap<Integer, String> subMap = map.subMap(1, 3);
```

**When to Use:**
- ✅ Concurrent sorted map
- ✅ NavigableMap operations with concurrency
- ✅ Range queries with concurrency
- ❌ Don't need sorting (use ConcurrentHashMap)

**Time Complexity:**
- get/put/remove: O(log n) average
- firstKey/lastKey: O(log n)

---

## 🎯 ConcurrentSkipListSet

**Characteristics:**
- **Thread-safe sorted set** - NavigableSet
- **Skip list** - Backed by ConcurrentSkipListMap
- **Sorted** - Natural order or Comparator
- **Lock-free** - CAS-based
- **No null elements**

**Usage:**
```java
ConcurrentSkipListSet<Integer> set = new ConcurrentSkipListSet<>();

set.add(3);
set.add(1);
set.add(2);
// Iteration: 1, 2, 3 (sorted)

// NavigableSet methods
Integer first = set.first();
Integer last = set.last();
Integer lower = set.lower(2);
Integer higher = set.higher(2);

// SubSets
Set<Integer> headSet = set.headSet(2);
Set<Integer> tailSet = set.tailSet(2);
```

**When to Use:**
- ✅ Concurrent sorted set
- ✅ NavigableSet with concurrency
- ❌ Don't need sorting (use CopyOnWriteArraySet or ConcurrentHashMap.newKeySet())

**Time Complexity:**
- add/remove/contains: O(log n) average

---

## 📋 CopyOnWriteArrayList (Recap)

**When to Use:**
- ✅ Read-heavy, write-rare
- ✅ Event listeners, observers
- ✅ Iteration much more than modification

**Time Complexity:**
- get: O(1)
- add/remove: O(n) - copies array

---

## 📦 CopyOnWriteArraySet (Recap)

**Internal:**
- Backed by CopyOnWriteArrayList
- Uses equals() for uniqueness

**When to Use:**
- ✅ Read-heavy, small sets
- ✅ Event listeners

---

## ⚖️ Concurrent Collections Comparison

| Collection | Thread-Safe | Blocking | Sorted | Null | Use Case |
|------------|-------------|----------|--------|------|----------|
| **ConcurrentHashMap** | Yes | No | No | No | General concurrent map |
| **ConcurrentLinkedQueue** | Yes | No | No | No | Non-blocking queue |
| **ConcurrentLinkedDeque** | Yes | No | No | No | Non-blocking deque |
| **ConcurrentSkipListMap** | Yes | No | Yes | No key | Concurrent sorted map |
| **ConcurrentSkipListSet** | Yes | No | Yes | No | Concurrent sorted set |
| **CopyOnWriteArrayList** | Yes | No | No | Yes | Read-heavy list |
| **CopyOnWriteArraySet** | Yes | No | No | Yes | Read-heavy set |
| **ArrayBlockingQueue** | Yes | Yes | No | No | Bounded blocking queue |
| **LinkedBlockingQueue** | Yes | Yes | No | No | Optionally bounded queue |
| **PriorityBlockingQueue** | Yes | Yes | Yes | No | Priority + blocking |

---

## 🎯 Quick Interview Points

1. **ConcurrentHashMap thread-safe?** - Yes
2. **ConcurrentHashMap allows null?** - No key or value
3. **ConcurrentHashMap Java 7 vs 8?** - Segments vs CAS+synchronized
4. **ConcurrentHashMap segments?** - 16 (Java 7)
5. **ConcurrentHashMap Java 8 uses?** - CAS and synchronized per-bin
6. **ConcurrentLinkedQueue blocking?** - No, non-blocking
7. **ConcurrentLinkedQueue algorithm?** - Michael-Scott lock-free
8. **ConcurrentLinkedQueue size()?** - O(n) - expensive
9. **ConcurrentSkipListMap structure?** - Skip list
10. **ConcurrentSkipListMap time complexity?** - O(log n)
11. **ConcurrentSkipListMap vs TreeMap?** - ConcurrentSkipListMap thread-safe
12. **Skip list vs balanced tree?** - Skip list probabilistic, easier concurrent impl
13. **CopyOnWriteArrayList modification?** - Creates new array
14. **CopyOnWriteArrayList when?** - Read-heavy scenarios
15. **Weakly consistent iterator?** - May not reflect concurrent modifications
16. **ConcurrentModificationException in concurrent collections?** - No
17. **CAS stands for?** - Compare-And-Swap
18. **Why ConcurrentHashMap better than Hashtable?** - Finer-grained locking, higher concurrency
19. **Why ConcurrentHashMap better than synchronized HashMap?** - Lock-free reads, better concurrency
20. **BlockingQueue vs ConcurrentLinkedQueue?** - Blocking vs non-blocking
21. **putIfAbsent atomic?** - Yes
22. **compute() atomic?** - Yes
23. **merge() atomic?** - Yes
24. **ConcurrentHashMap bulk operations?** - forEach, search, reduce (parallelThreshold)
25. **When use ConcurrentSkipListMap?** - Need sorted + concurrent access
