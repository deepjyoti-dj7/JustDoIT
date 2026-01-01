# 📝 Special Purpose Collections - Quick Interview Notes

## 🛠️ Collections Utility Class

**Overview:**
- **Static utility methods** - For collection operations
- **Factory methods** - Create special collections
- **Algorithms** - Sort, search, shuffle, etc.
- **Wrappers** - Synchronized, unmodifiable, etc.

**Key Categories:**
1. Sorting & Searching
2. Shuffling & Reversing
3. Min/Max/Frequency
4. Synchronized wrappers
5. Unmodifiable wrappers
6. Checked collections
7. Empty/Singleton collections

---

## 🎲 Collections Class - Common Methods

```java
// Sorting
Collections.sort(list);
Collections.sort(list, comparator);

// Searching (list must be sorted)
int index = Collections.binarySearch(list, key);
int index = Collections.binarySearch(list, key, comparator);

// Shuffling
Collections.shuffle(list);
Collections.shuffle(list, random);

// Reversing
Collections.reverse(list);

// Copying
Collections.copy(dest, src);  // dest must be >= src size

// Min/Max
T min = Collections.min(collection);
T max = Collections.max(collection);

// Frequency
int count = Collections.frequency(collection, object);

// Disjoint (no common elements)
boolean disjoint = Collections.disjoint(c1, c2);

// Fill
Collections.fill(list, object);

// Replace all
Collections.replaceAll(list, oldVal, newVal);

// Rotate
Collections.rotate(list, distance);

// Swap
Collections.swap(list, i, j);

// Add all
Collections.addAll(collection, elements...);
```

---

## 🔐 Synchronized Collections

**Purpose:**
- Make non-thread-safe collections thread-safe
- **Legacy approach** - Before concurrent collections
- **Coarse-grained locking** - Entire collection locked

**Creation:**
```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());
Set<String> syncSet = Collections.synchronizedSet(new HashSet<>());
Map<String, Integer> syncMap = Collections.synchronizedMap(new HashMap<>());
Collection<String> syncColl = Collections.synchronizedCollection(new ArrayList<>());
SortedSet<String> syncSortedSet = Collections.synchronizedSortedSet(new TreeSet<>());
SortedMap<String, Integer> syncSortedMap = Collections.synchronizedSortedMap(new TreeMap<>());
```

**Critical - Manual Synchronization for Iteration:**
```java
List<String> syncList = Collections.synchronizedList(new ArrayList<>());

// WRONG - Not thread-safe
for(String s : syncList) {
    // ...
}

// CORRECT - Must manually synchronize
synchronized(syncList) {
    for(String s : syncList) {
        // ...
    }
}
```

**When to Use:**
- ⚠️ Generally avoid - Use concurrent collections instead
- ✅ Legacy code compatibility
- ❌ High concurrency (poor performance)

**Characteristics:**
- Every method synchronized
- Iterator requires external synchronization
- Lower concurrency than concurrent collections

---

## 🔒 Unmodifiable Collections

**Purpose:**
- Create **read-only views** of collections
- **Cannot modify** - Throws UnsupportedOperationException
- **Not immutable** - Backed by original collection

**Creation:**
```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
List<String> unmodList = Collections.unmodifiableList(list);

Set<String> unmodSet = Collections.unmodifiableSet(set);
Map<String, Integer> unmodMap = Collections.unmodifiableMap(map);
Collection<String> unmodColl = Collections.unmodifiableCollection(coll);
SortedSet<String> unmodSortedSet = Collections.unmodifiableSortedSet(sortedSet);
SortedMap<String, Integer> unmodSortedMap = Collections.unmodifiableSortedMap(sortedMap);

// Java 9+ - Truly immutable factory methods
List<String> immutableList = List.of("A", "B", "C");
Set<String> immutableSet = Set.of("A", "B", "C");
Map<String, Integer> immutableMap = Map.of("A", 1, "B", 2);
```

**Important Difference:**
```java
List<String> original = new ArrayList<>(Arrays.asList("A", "B"));
List<String> unmod = Collections.unmodifiableList(original);

// Cannot modify through unmodifiable view
unmod.add("C");  // UnsupportedOperationException

// Can still modify original (affects unmodifiable view)
original.add("C");  // OK
System.out.println(unmod);  // [A, B, C] - changed!

// Java 9+ List.of() is truly immutable
List<String> immutable = List.of("A", "B");
// No way to modify - not backed by mutable collection
```

**When to Use:**
- ✅ Defensive copying - prevent modification
- ✅ API design - return unmodifiable views
- ✅ Thread-safety for reads

---

## 📭 Empty Collections

**Purpose:**
- Return **empty collections** instead of null
- **Singleton pattern** - Single instance
- **Immutable** - Cannot be modified

**Creation:**
```java
List<String> emptyList = Collections.emptyList();
Set<String> emptySet = Collections.emptySet();
Map<String, Integer> emptyMap = Collections.emptyMap();
Iterator<String> emptyIterator = Collections.emptyIterator();
ListIterator<String> emptyListIterator = Collections.emptyListIterator();
Enumeration<String> emptyEnumeration = Collections.emptyEnumeration();

// Java 9+ - Similar but different instances
List<String> emptyList2 = List.of();
Set<String> emptySet2 = Set.of();
Map<String, Integer> emptyMap2 = Map.of();
```

**When to Use:**
- ✅ Avoid null returns
- ✅ Default empty values
- ✅ Null-safety

**Example:**
```java
public List<String> getResults() {
    // BAD
    if(results.isEmpty()) {
        return null;  // Caller must null check
    }
    return results;
    
    // GOOD
    if(results.isEmpty()) {
        return Collections.emptyList();  // Safe to iterate
    }
    return results;
}
```

---

## 1️⃣ Singleton Collections

**Purpose:**
- Create **immutable single-element** collections
- **Efficient** - Less memory than regular collections

**Creation:**
```java
Set<String> singleton = Collections.singleton("A");
List<String> singletonList = Collections.singletonList("A");
Map<String, Integer> singletonMap = Collections.singletonMap("A", 1);
```

**Characteristics:**
- Immutable - Cannot add/remove
- Single element only
- More efficient than creating regular collection with one element

**When to Use:**
- ✅ Need single-element immutable collection
- ✅ API compatibility (expects collection)
- ✅ Memory efficiency

**Example:**
```java
// Remove all occurrences of "A"
list.removeAll(Collections.singleton("A"));

// Check if contains "A"
boolean contains = !Collections.disjoint(list, Collections.singleton("A"));
```

---

## ✅ Checked Collections

**Purpose:**
- **Type-safety at runtime** - Prevent ClassCastException
- Useful with **legacy code** (raw types)

**Creation:**
```java
List<String> checkedList = Collections.checkedList(new ArrayList<>(), String.class);
Set<String> checkedSet = Collections.checkedSet(new HashSet<>(), String.class);
Map<String, Integer> checkedMap = Collections.checkedMap(new HashMap<>(), String.class, Integer.class);
```

**Example:**
```java
// Without checked collection
List<String> list = new ArrayList<>();
List rawList = list;  // Raw type
rawList.add(123);     // No compile error, but wrong type
String s = list.get(0);  // ClassCastException at runtime!

// With checked collection
List<String> checkedList = Collections.checkedList(new ArrayList<>(), String.class);
List rawChecked = checkedList;
rawChecked.add(123);  // ClassCastException immediately at add!
```

**When to Use:**
- ✅ Interop with legacy code (raw types)
- ✅ Debug generic type issues
- ❌ Modern code (generics handle this)

---

## 🔁 Arrays Utility Class

**Common Methods:**
```java
// Sorting
Arrays.sort(array);
Arrays.sort(array, comparator);
Arrays.parallelSort(array);  // Java 8+ parallel sort

// Searching (array must be sorted)
int index = Arrays.binarySearch(array, key);

// Filling
Arrays.fill(array, value);
Arrays.fill(array, fromIndex, toIndex, value);

// Copying
int[] copy = Arrays.copyOf(original, newLength);
int[] rangeCopy = Arrays.copyOfRange(original, from, to);

// Equality
boolean equal = Arrays.equals(array1, array2);
boolean deepEqual = Arrays.deepEquals(array1, array2);  // For multi-dimensional

// To String
String str = Arrays.toString(array);
String deepStr = Arrays.deepToString(array);  // For multi-dimensional

// To List (fixed-size)
List<String> list = Arrays.asList("A", "B", "C");

// Stream (Java 8+)
Stream<String> stream = Arrays.stream(array);
IntStream intStream = Arrays.stream(intArray);

// Compare (Java 9+)
int result = Arrays.compare(array1, array2);
int mismatch = Arrays.mismatch(array1, array2);
```

**Arrays.asList() Gotchas:**
```java
// Fixed-size list (cannot add/remove)
List<String> list = Arrays.asList("A", "B", "C");
list.add("D");     // UnsupportedOperationException
list.remove(0);    // UnsupportedOperationException
list.set(0, "X");  // OK - can modify elements

// Backed by array
String[] array = {"A", "B", "C"};
List<String> list = Arrays.asList(array);
array[0] = "X";
System.out.println(list);  // [X, B, C] - changed!

// Primitive arrays
int[] nums = {1, 2, 3};
List<int[]> wrong = Arrays.asList(nums);  // Single element list!
System.out.println(wrong.size());  // 1 (not 3)

// Correct for primitives - use Streams
List<Integer> correct = Arrays.stream(nums).boxed().collect(Collectors.toList());
```

---

## ⚖️ Comparison: Special Collections

| Type | Mutable | Thread-Safe | Backed by Original | Use Case |
|------|---------|-------------|-------------------|----------|
| **Synchronized** | Yes | Yes | Yes | Legacy thread-safety |
| **Unmodifiable** | No | No | Yes | Read-only view |
| **Empty** | No | N/A | No | Avoid null |
| **Singleton** | No | N/A | No | Single element |
| **Checked** | Yes | No | Yes | Runtime type-safety |
| **Java 9 Immutable** | No | Yes | No | Truly immutable |

---

## 🎯 Quick Interview Points

1. **Collections class?** - Utility class with static methods
2. **Collections.sort() stability?** - Stable (preserves equal element order)
3. **Collections.binarySearch() requirement?** - List must be sorted
4. **Collections.synchronizedList() thread-safe?** - Yes, but iteration needs manual sync
5. **Synchronized collection iteration?** - Must manually synchronize on collection
6. **Collections.unmodifiableList() immutable?** - No, backed by original (read-only view)
7. **Java 9 List.of() vs Collections.unmodifiableList()?** - List.of() truly immutable
8. **Collections.emptyList() purpose?** - Avoid returning null
9. **Collections.singleton() characteristics?** - Immutable, single element
10. **Collections.checkedList() purpose?** - Runtime type checking
11. **Arrays.asList() modifiable?** - Fixed-size (can't add/remove, can set)
12. **Arrays.asList() backed by array?** - Yes
13. **Arrays.sort() vs Collections.sort()?** - Arrays for arrays, Collections for lists
14. **parallelSort() requirement?** - Large array for performance benefit
15. **Difference synchronized vs concurrent?** - Synchronized: coarse lock, Concurrent: fine-grained/lock-free
16. **Can modify original through unmodifiable?** - Can't modify through unmod, but can modify original
17. **emptyList() same instance?** - Yes, singleton
18. **When use checkedCollection()?** - Legacy code with raw types
19. **Arrays.toString() vs deepToString()?** - deepToString() for multi-dimensional
20. **List.of() null elements?** - No, throws NullPointerException
