# 📝 Performance & Best Practices - Quick Interview Notes

## ⏱️ Time Complexity

**Common Operations:**

| Collection | get | add | remove | contains | Iteration |
|------------|-----|-----|--------|----------|-----------|
| **ArrayList** | O(1) | O(1)* | O(n) | O(n) | O(n) |
| **LinkedList** | O(n) | O(1) | O(1)** | O(n) | O(n) |
| **HashSet** | - | O(1)* | O(1)* | O(1)* | O(n) |
| **LinkedHashSet** | - | O(1)* | O(1)* | O(1)* | O(n) |
| **TreeSet** | - | O(log n) | O(log n) | O(log n) | O(n) |
| **HashMap** | O(1)* | O(1)* | O(1)* | O(1)* | O(n) |
| **LinkedHashMap** | O(1)* | O(1)* | O(1)* | O(1)* | O(n) |
| **TreeMap** | O(log n) | O(log n) | O(log n) | O(log n) | O(n) |
| **PriorityQueue** | - | O(log n) | O(log n) | O(n) | O(n) |
| **ArrayDeque** | O(1) | O(1)* | O(1)* | O(n) | O(n) |

\* Amortized time complexity  
\** O(1) if position known (e.g., head/tail)

**Worst Case Notes:**
- HashMap/HashSet: O(n) if all elements hash to same bucket (before Java 8)
- HashMap/HashSet Java 8+: O(log n) worst case (tree in bucket)
- ArrayList add: O(n) if resizing needed

---

## 💾 Space Complexity

**Memory Overhead:**

| Collection | Space Complexity | Notes |
|------------|-----------------|-------|
| **ArrayList** | O(n) | Contiguous array, wasted capacity |
| **LinkedList** | O(n) | Node overhead (prev/next pointers) |
| **HashSet** | O(n) | Backed by HashMap |
| **TreeSet** | O(n) | Tree node overhead |
| **HashMap** | O(n) | Array + linked nodes/trees |
| **TreeMap** | O(n) | Tree node overhead |

**Key Points:**
- ArrayList: Less overhead than LinkedList (contiguous memory)
- HashMap: Load factor 0.75 = 25% wasted space
- LinkedList: ~3x memory of ArrayList (object overhead + pointers)
- TreeSet/TreeMap: More overhead than Hash-based (tree nodes)

---

## 🎯 When to Use Which Collection

**List:**
```java
// ArrayList - Default choice for lists
✅ Random access, iteration, append
❌ Insert/delete in middle, memory-constrained

// LinkedList
✅ Frequent insert/delete, queue/deque operations
❌ Random access, memory-constrained

// CopyOnWriteArrayList
✅ Read-heavy, thread-safe, event listeners
❌ Frequent modifications, large lists
```

**Set:**
```java
// HashSet - Default choice for sets
✅ Fast lookup, uniqueness, no order needed
❌ Sorted order, insertion order

// LinkedHashSet
✅ Uniqueness + insertion order
❌ Sorted order, memory-constrained

// TreeSet
✅ Sorted order, range queries
❌ Fastest operations

// EnumSet
✅ Enum values only (best performance)
❌ Non-enum types
```

**Queue:**
```java
// ArrayDeque - Default choice for queue/stack
✅ Stack, queue, deque operations
❌ Null elements, thread-safety

// LinkedList
✅ Queue with null elements
❌ Performance (slower than ArrayDeque)

// PriorityQueue
✅ Priority-based processing
❌ FIFO order

// Blocking queues
✅ Producer-consumer, thread-safe
❌ Non-blocking needed
```

**Map:**
```java
// HashMap - Default choice for maps
✅ Fast lookup, no order needed
❌ Sorted keys, insertion order, thread-safety

// LinkedHashMap
✅ Insertion/access order, LRU cache
❌ Sorted order

// TreeMap
✅ Sorted keys, range queries
❌ Fastest operations

// ConcurrentHashMap
✅ Thread-safe, high concurrency
❌ Null keys/values
```

---

## ⚠️ Common Pitfalls

### 1️⃣ ConcurrentModificationException
```java
// WRONG
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
for(String s : list) {
    if(s.equals("B")) {
        list.remove(s);  // ConcurrentModificationException!
    }
}

// CORRECT - Use Iterator
Iterator<String> it = list.iterator();
while(it.hasNext()) {
    String s = it.next();
    if(s.equals("B")) {
        it.remove();  // OK
    }
}

// CORRECT - removeIf (Java 8+)
list.removeIf(s -> s.equals("B"));

// CORRECT - Stream filter
list = list.stream()
    .filter(s -> !s.equals("B"))
    .collect(Collectors.toList());
```

### 2️⃣ ArrayList Capacity
```java
// BAD - Multiple resizes
List<Integer> list = new ArrayList<>();  // Capacity 10
for(int i = 0; i < 100000; i++) {
    list.add(i);  // Resizes multiple times
}

// GOOD - Pre-size if known
List<Integer> list = new ArrayList<>(100000);
for(int i = 0; i < 100000; i++) {
    list.add(i);  // No resizes
}
```

### 3️⃣ HashMap Initial Capacity
```java
// BAD
Map<String, Integer> map = new HashMap<>();  // Default 16
// Adding 1000 elements → multiple resizes

// GOOD - Calculate capacity
int expectedSize = 1000;
int capacity = (int) (expectedSize / 0.75 + 1);  // ~1334
Map<String, Integer> map = new HashMap<>(capacity);
```

### 4️⃣ Wrong Collection for Use Case
```java
// BAD - Using List for membership test
List<String> list = new ArrayList<>();
// ... add 10000 elements
boolean contains = list.contains("X");  // O(n)

// GOOD - Use Set
Set<String> set = new HashSet<>(list);
boolean contains = set.contains("X");  // O(1)

// BAD - Frequent insert/delete in ArrayList
List<Integer> list = new ArrayList<>();
for(int i = 0; i < 1000; i++) {
    list.add(0, i);  // O(n) each time = O(n²) total
}

// GOOD - Use LinkedList or add at end
LinkedList<Integer> list = new LinkedList<>();
for(int i = 0; i < 1000; i++) {
    list.addFirst(i);  // O(1) each
}
```

### 5️⃣ Null Keys/Values
```java
// HashMap - one null key, multiple null values OK
Map<String, Integer> map = new HashMap<>();
map.put(null, 1);      // OK
map.put("A", null);    // OK

// TreeMap - no null keys
Map<String, Integer> treeMap = new TreeMap<>();
treeMap.put(null, 1);  // NullPointerException!

// ConcurrentHashMap - no null keys or values
Map<String, Integer> concurrent = new ConcurrentHashMap<>();
concurrent.put(null, 1);   // NullPointerException!
concurrent.put("A", null); // NullPointerException!

// Hashtable - no null keys or values
Hashtable<String, Integer> table = new Hashtable<>();
table.put(null, 1);   // NullPointerException!
```

### 6️⃣ equals() and hashCode()
```java
// WRONG - Override equals() but not hashCode()
class Person {
    String name;
    
    @Override
    public boolean equals(Object o) {
        if(!(o instanceof Person)) return false;
        return this.name.equals(((Person) o).name);
    }
    // hashCode() not overridden!
}

Person p1 = new Person("Alice");
Person p2 = new Person("Alice");

Set<Person> set = new HashSet<>();
set.add(p1);
set.contains(p2);  // false! Different hashCodes

// CORRECT - Override both
class Person {
    String name;
    
    @Override
    public boolean equals(Object o) {
        if(!(o instanceof Person)) return false;
        return this.name.equals(((Person) o).name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
```

### 7️⃣ Comparing Primitives
```java
// WRONG - Reference comparison
Integer a = 200;
Integer b = 200;
if(a == b) {  // false! Different objects

// CORRECT - Use equals()
if(a.equals(b)) {  // true

// Note: -128 to 127 cached (Integer cache)
Integer x = 100;
Integer y = 100;
if(x == y) {  // true (cached)
```

### 8️⃣ Iterating Map
```java
Map<String, Integer> map = new HashMap<>();

// SLOW - Get value in loop
for(String key : map.keySet()) {
    Integer value = map.get(key);  // Extra lookup
}

// FAST - Use entrySet()
for(Map.Entry<String, Integer> entry : map.entrySet()) {
    String key = entry.getKey();
    Integer value = entry.getValue();
}

// Java 8+
map.forEach((k, v) -> System.out.println(k + "=" + v));
```

---

## 🚀 Memory Optimization

### 1️⃣ Right Sizing
```java
// Pre-size collections if size known
List<Integer> list = new ArrayList<>(expectedSize);
Map<String, Integer> map = new HashMap<>(expectedSize / 0.75);
Set<String> set = new HashSet<>(expectedSize / 0.75);
```

### 2️⃣ Trim to Size
```java
ArrayList<String> list = new ArrayList<>(1000);
// ... use list, now has 100 elements
list.trimToSize();  // Reduce capacity to size
```

### 3️⃣ Use Primitives
```java
// BAD - Boxing overhead
List<Integer> list = new ArrayList<>();

// BETTER - Use primitive array or library
int[] array = new int[size];

// Or use specialized collections (Trove, FastUtil)
TIntArrayList list = new TIntArrayList();  // External library
```

### 4️⃣ EnumSet/EnumMap
```java
// For enums - use specialized collections
enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }

// Regular set - more memory
Set<Day> set = new HashSet<>();

// EnumSet - bit vector, very efficient
EnumSet<Day> enumSet = EnumSet.allOf(Day.class);

// EnumMap - array-based
Map<Day, String> enumMap = new EnumMap<>(Day.class);
```

### 5️⃣ Immutable Collections
```java
// Java 9+ - Compact internal representation
List<String> list = List.of("A", "B", "C");  // Immutable, less memory
Set<String> set = Set.of("A", "B", "C");
Map<String, Integer> map = Map.of("A", 1, "B", 2);
```

---

## 🔒 Thread Safety

**Thread-Safe Collections:**
```java
// Legacy - synchronized wrappers (slow)
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());

// Modern - concurrent collections (fast)
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<>();

// Blocking queues
BlockingQueue<String> queue = new ArrayBlockingQueue<>(100);
```

**Best Practices:**
```java
// 1. Use concurrent collections over synchronized wrappers
// 2. Use CopyOnWriteArrayList for read-heavy scenarios
// 3. Use ConcurrentHashMap for maps
// 4. Use BlockingQueue for producer-consumer
// 5. Avoid locking entire collection if possible
```

---

## 🎯 Quick Interview Points

1. **ArrayList get time?** - O(1)
2. **LinkedList get time?** - O(n)
3. **HashMap get time?** - O(1) average
4. **TreeMap get time?** - O(log n)
5. **ArrayList vs LinkedList memory?** - ArrayList less (contiguous)
6. **When use ArrayList?** - Random access, iteration
7. **When use LinkedList?** - Frequent insert/delete
8. **When use HashSet?** - Fast lookup, no order
9. **When use TreeSet?** - Sorted, range queries
10. **When use HashMap?** - Fast lookup, no order
11. **When use TreeMap?** - Sorted keys
12. **ConcurrentModificationException cause?** - Modifying during iteration
13. **How to avoid CME?** - Use Iterator.remove() or removeIf()
14. **HashMap initial capacity formula?** - size / 0.75 + 1
15. **ArrayList default capacity?** - 10
16. **HashMap default capacity?** - 16
17. **HashMap load factor?** - 0.75
18. **Must override with equals()?** - hashCode()
19. **Integer cache range?** - -128 to 127
20. **Fastest way iterate Map?** - entrySet()
21. **Thread-safe List?** - CopyOnWriteArrayList or Collections.synchronizedList()
22. **Thread-safe Map?** - ConcurrentHashMap
23. **Which allows null - HashMap or ConcurrentHashMap?** - HashMap
24. **EnumSet benefit?** - Very fast, bit vector
25. **When use CopyOnWriteArrayList?** - Read-heavy, thread-safe
