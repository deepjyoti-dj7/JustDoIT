# 📝 Map Interface - Quick Interview Notes

## 📋 Map Interface Basics

**What is Map?**
- **Key-value pairs** - Each key maps to exactly one value
- **No duplicate keys** - Keys must be unique
- **One value per key** - One key → one value
- **Not a Collection** - Separate interface hierarchy

**Key Characteristics:**
- **Keys unique** - No duplicate keys allowed
- **Values can duplicate** - Multiple keys can map to same value
- **No order** (HashMap) - Order not guaranteed
- **At most one null key** - Most implementations allow one null key

**Map Methods:**
```java
V put(K key, V value)              // Add/update
V get(Object key)                  // Retrieve
V remove(Object key)               // Remove
boolean containsKey(Object key)
boolean containsValue(Object value)
int size()
boolean isEmpty()
void clear()

// Default methods (Java 8+)
V getOrDefault(K key, V defaultValue)
V putIfAbsent(K key, V value)
boolean remove(K key, V value)
boolean replace(K key, V oldValue, V newValue)
V replace(K key, V value)
void forEach(BiConsumer<K,V> action)
V compute(K key, BiFunction<K,V,V> remappingFunction)
V computeIfAbsent(K key, Function<K,V> mappingFunction)
V computeIfPresent(K key, BiFunction<K,V,V> remappingFunction)
V merge(K key, V value, BiFunction<V,V,V> remappingFunction)

// Views
Set<K> keySet()
Collection<V> values()
Set<Map.Entry<K,V>> entrySet()
```

---

## 🗂️ HashMap

**Characteristics:**
- **Hash table** - Array of buckets
- **No order** - No guaranteed iteration order
- **Fast operations** - O(1) average
- **One null key, multiple null values**
- **Not synchronized** - Not thread-safe

**Internal Structure:**
- Array of `Node<K,V>` (buckets)
- Default initial capacity: 16
- Default load factor: 0.75
- Uses hashCode() and equals()

**Hash Collision Handling:**
- **Separate chaining** - Linked list (or tree if > 8 entries)
- **Treeify threshold** - 8 (converts list to tree)
- **Untreeify threshold** - 6 (converts tree to list)
- **Java 8+**: Red-Black tree for large buckets

**Usage:**
```java
Map<String, Integer> map = new HashMap<>();

// Put
map.put("A", 1);
map.put("B", 2);
map.put("C", 3);

// Get
Integer value = map.get("A");  // 1
Integer def = map.getOrDefault("D", 0);  // 0

// Check
boolean hasKey = map.containsKey("A");
boolean hasValue = map.containsValue(1);

// Update
map.put("A", 10);  // Updates existing
map.putIfAbsent("D", 4);  // Only if absent

// Remove
map.remove("A");
map.remove("B", 2);  // Only if key maps to value

// Iteration
for(Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + "=" + entry.getValue());
}

map.forEach((k, v) -> System.out.println(k + "=" + v));

// Compute
map.compute("A", (k, v) -> (v == null) ? 1 : v + 1);
map.computeIfAbsent("E", k -> 5);
map.computeIfPresent("A", (k, v) -> v * 2);
map.merge("A", 1, (oldVal, newVal) -> oldVal + newVal);
```

**When to Use:**
- ✅ Fast lookup/insert/delete
- ✅ Don't care about order
- ✅ Single-threaded
- ❌ Need sorted keys
- ❌ Need insertion order
- ❌ Thread-safe needed

**Time Complexity:**
- get/put/remove: O(1) average, O(n) worst case (all in one bucket)
- containsKey: O(1) average
- Java 8+: O(log n) worst case (tree in bucket)

---

## 🔗 LinkedHashMap

**Characteristics:**
- **Hash table + doubly-linked list**
- **Maintains insertion order** (or access order)
- **Predictable iteration**
- **One null key, multiple null values**
- **Not synchronized**

**Internal:**
- Extends HashMap
- Each entry has before/after pointers
- Doubly-linked list maintains order

**Usage:**
```java
// Insertion order (default)
Map<String, Integer> map = new LinkedHashMap<>();
map.put("C", 3);
map.put("A", 1);
map.put("B", 2);
// Iteration order: C, A, B

// Access order (LRU cache)
Map<String, Integer> lru = new LinkedHashMap<>(16, 0.75f, true);
lru.put("A", 1);
lru.put("B", 2);
lru.get("A");  // A accessed, moves to end
// Order: B, A (A is most recently used)

// LRU Cache implementation
class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private int capacity;
    
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);  // access-order
        this.capacity = capacity;
    }
    
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}
```

**When to Use:**
- ✅ Need insertion/access order
- ✅ LRU cache
- ✅ Predictable iteration
- ❌ Need sorted order

**Time Complexity:**
- get/put/remove: O(1)
- Slightly slower than HashMap (overhead of maintaining links)

---

## 🌲 TreeMap

**Characteristics:**
- **Red-Black tree** - Balanced BST (NavigableMap)
- **Sorted order** - Natural ordering or Comparator
- **Slower operations** - O(log n)
- **No null keys** (throws NullPointerException)
- **Not synchronized**

**Internal:**
- Red-Black tree (self-balancing BST)
- Keys must be Comparable or provide Comparator

**Usage:**
```java
// Natural ordering
Map<Integer, String> map = new TreeMap<>();
map.put(3, "C");
map.put(1, "A");
map.put(2, "B");
// Iteration order: 1, 2, 3 (sorted)

// Custom comparator
Map<String, Integer> revMap = new TreeMap<>(Comparator.reverseOrder());
revMap.put("A", 1);
revMap.put("C", 3);
revMap.put("B", 2);
// Iteration order: C, B, A

// NavigableMap methods
TreeMap<Integer, String> tm = new TreeMap<>();
tm.put(10, "A");
tm.put(20, "B");
tm.put(30, "C");

// Ceiling/Floor
Map.Entry<Integer, String> ceil = tm.ceilingEntry(15);  // 20=B
Map.Entry<Integer, String> floor = tm.floorEntry(15);   // 10=A

// Higher/Lower
Map.Entry<Integer, String> higher = tm.higherEntry(20);  // 30=C
Map.Entry<Integer, String> lower = tm.lowerEntry(20);    // 10=A

// First/Last
Map.Entry<Integer, String> first = tm.firstEntry();  // 10=A
Map.Entry<Integer, String> last = tm.lastEntry();    // 30=C
Integer firstKey = tm.firstKey();  // 10
Integer lastKey = tm.lastKey();    // 30

// SubMaps
SortedMap<Integer, String> head = tm.headMap(20);      // [10]
SortedMap<Integer, String> tail = tm.tailMap(20);      // [20, 30]
SortedMap<Integer, String> sub = tm.subMap(10, 30);    // [10, 20]

// Descending
NavigableMap<Integer, String> desc = tm.descendingMap();
```

**When to Use:**
- ✅ Need sorted keys
- ✅ Range queries (NavigableMap)
- ✅ Keys naturally comparable
- ❌ Need fastest operations
- ❌ Have null keys

**Time Complexity:**
- get/put/remove: O(log n)
- firstKey/lastKey: O(log n)

---

## 📚 Hashtable

**Characteristics:**
- **Legacy class** - Before Collections Framework
- **Synchronized** - Thread-safe (all methods synchronized)
- **Slower** - Due to synchronization overhead
- **No null key or value** - Throws NullPointerException
- **Not recommended** - Use ConcurrentHashMap instead

**Usage:**
```java
Hashtable<String, Integer> table = new Hashtable<>();
table.put("A", 1);  // Synchronized
Integer val = table.get("A");  // Synchronized
```

**When to Use:**
- ❌ Generally avoid - Use ConcurrentHashMap
- ⚠️ Legacy code only

---

## 🔒 ConcurrentHashMap

**Characteristics:**
- **Thread-safe** - Concurrent access
- **High concurrency** - Segment locking (Java 7), CAS (Java 8+)
- **No null key or value** - Throws NullPointerException
- **Atomic operations** - putIfAbsent, remove, replace
- **Better than Hashtable** - Higher throughput

**Internal:**
- **Java 7**: Segment-based locking (16 segments)
- **Java 8+**: CAS + synchronized (per-bin locking)

**Usage:**
```java
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// Basic operations (thread-safe)
map.put("A", 1);
Integer val = map.get("A");

// Atomic operations
map.putIfAbsent("B", 2);
map.remove("A", 1);  // Remove only if key maps to value
map.replace("B", 2, 3);  // Replace only if old value matches

// Compute operations (atomic)
map.compute("A", (k, v) -> (v == null) ? 1 : v + 1);
map.computeIfAbsent("C", k -> 3);
map.computeIfPresent("A", (k, v) -> v * 2);
map.merge("A", 1, (oldVal, newVal) -> oldVal + newVal);

// Bulk operations (Java 8+)
map.forEach((k, v) -> System.out.println(k + "=" + v));
map.forEach(10, (k, v) -> System.out.println(k));  // Parallel if > threshold

// Reduction
int sum = map.reduceValues(1, v -> v, Integer::sum);
```

**When to Use:**
- ✅ Multi-threaded environment
- ✅ High concurrency needed
- ✅ Better than synchronized HashMap or Hashtable
- ❌ Have null keys/values

**Time Complexity:**
- get: O(1) average
- put/remove: O(1) average (with CAS)

---

## ⚖️ HashMap vs LinkedHashMap vs TreeMap vs ConcurrentHashMap

| Feature | HashMap | LinkedHashMap | TreeMap | ConcurrentHashMap |
|---------|---------|---------------|---------|-------------------|
| **Structure** | Hash table | Hash table + List | Red-Black tree | Hash table (CAS) |
| **Order** | No order | Insertion/Access | Sorted | No order |
| **Null Key** | One null | One null | No null | No null |
| **Null Value** | Yes | Yes | Yes | No null |
| **Performance** | O(1) | O(1) | O(log n) | O(1) |
| **Thread-Safe** | No | No | No | Yes |
| **Use Case** | General | Order needed | Sorted | Concurrent |
| **Interface** | Map | Map | NavigableMap | ConcurrentMap |

---

## 🔍 HashMap Internals (Important for Interviews)

**Hash Function:**
```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

**Index Calculation:**
```java
index = (n - 1) & hash  // n = capacity (power of 2)
```

**Node Structure:**
```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
}
```

**Resizing:**
- Happens when size > capacity * loadFactor
- Default: size > 16 * 0.75 = 12
- New capacity = oldCapacity * 2
- All entries rehashed

**Treeification (Java 8+):**
- When bucket size > 8 and capacity ≥ 64
- Linked list → Red-Black tree
- Improves worst case from O(n) to O(log n)

---

## 🎯 Quick Interview Points

1. **Map stores?** - Key-value pairs
2. **Map allows duplicate keys?** - No
3. **Map allows duplicate values?** - Yes
4. **HashMap backed by?** - Hash table (array + linked list/tree)
5. **HashMap time complexity?** - O(1) average
6. **HashMap default capacity?** - 16
7. **HashMap default load factor?** - 0.75
8. **When does HashMap resize?** - size > capacity * loadFactor
9. **HashMap new capacity?** - oldCapacity * 2
10. **HashMap allows null key?** - Yes, one null key
11. **LinkedHashMap order?** - Insertion order (or access order)
12. **LinkedHashMap use case?** - LRU cache
13. **TreeMap backed by?** - Red-Black tree
14. **TreeMap time complexity?** - O(log n)
15. **TreeMap allows null key?** - No
16. **TreeMap order?** - Sorted (natural or comparator)
17. **Hashtable vs HashMap?** - Hashtable synchronized, no null key/value
18. **ConcurrentHashMap thread-safe?** - Yes
19. **ConcurrentHashMap allows null?** - No null key or value
20. **ConcurrentHashMap vs Hashtable?** - ConcurrentHashMap faster (finer-grained locking)
21. **HashMap treeification threshold?** - 8 (bucket size)
22. **HashMap untreeify threshold?** - 6
23. **Which Map for sorting?** - TreeMap
24. **Which Map for insertion order?** - LinkedHashMap
25. **Which Map for concurrency?** - ConcurrentHashMap
26. **putIfAbsent returns?** - Existing value or null
27. **compute() use?** - Atomic update based on key-value
28. **merge() use?** - Combine old and new values
29. **HashMap bucket?** - Array index where entries stored
30. **NavigableMap methods?** - ceilingEntry, floorEntry, higherEntry, lowerEntry, firstEntry, lastEntry
