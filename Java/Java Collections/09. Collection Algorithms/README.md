# 📝 Collection Algorithms - Quick Interview Notes

## 🎲 Sorting Algorithms

**Collections.sort():**
- **Algorithm**: Tim Sort
- **Stable**: Yes
- **Time**: O(n log n)
- **Space**: O(n)
- **Best for**: Lists, objects

```java
List<Integer> list = Arrays.asList(5, 2, 8, 1);
Collections.sort(list);  // [1, 2, 5, 8]
```

**Arrays.sort():**
- **Primitives**: Dual-Pivot QuickSort (not stable)
- **Objects**: Tim Sort (stable)
- **Time**: O(n log n) average
- **Space**: O(log n) for QuickSort, O(n) for TimSort

```java
int[] nums = {5, 2, 8, 1};
Arrays.sort(nums);  // [1, 2, 5, 8]
```

---

## 🔍 Searching Algorithms

**Binary Search:**
- **Requirement**: Sorted collection
- **Algorithm**: Divide and conquer
- **Time**: O(log n)
- **Space**: O(1)

```java
List<Integer> list = Arrays.asList(1, 3, 5, 7, 9);
int index = Collections.binarySearch(list, 5);  // 2

int[] nums = {1, 3, 5, 7, 9};
int idx = Arrays.binarySearch(nums, 5);  // 2
```

**Linear Search:**
- **Time**: O(n)
- **Space**: O(1)
- **Best for**: Unsorted collections

```java
boolean found = list.contains(5);  // O(n)
int index = list.indexOf(5);       // O(n)
```

---

## 🔀 Shuffling

**Purpose**: Randomize collection order

**Collections.shuffle():**
```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
Collections.shuffle(list);  // Random order

// With custom random
Random random = new Random(42);  // Seed for reproducibility
Collections.shuffle(list, random);
```

**Algorithm**: Fisher-Yates shuffle
**Time**: O(n)
**Space**: O(1)

**Use Cases:**
- Card shuffling
- Random sampling
- Testing

---

## 🔄 Reversing

**Collections.reverse():**
```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
Collections.reverse(list);  // [5, 4, 3, 2, 1]
```

**Comparator.reverseOrder():**
```java
List<Integer> list = Arrays.asList(5, 2, 8, 1);
Collections.sort(list, Comparator.reverseOrder());  // [8, 5, 2, 1]
```

**Time**: O(n)
**Space**: O(1) (in-place)

---

## 📊 Frequency & Disjoint

**Collections.frequency():**
```java
List<String> list = Arrays.asList("A", "B", "A", "C", "A");
int count = Collections.frequency(list, "A");  // 3
```
**Time**: O(n)

**Collections.disjoint():**
```java
Set<Integer> set1 = new HashSet<>(Arrays.asList(1, 2, 3));
Set<Integer> set2 = new HashSet<>(Arrays.asList(4, 5, 6));
boolean noCommon = Collections.disjoint(set1, set2);  // true

Set<Integer> set3 = new HashSet<>(Arrays.asList(3, 4, 5));
boolean hasCommon = Collections.disjoint(set1, set3);  // false (3 is common)
```
**Time**: O(n)

---

## 🎯 Min & Max

**Collections.min() / max():**
```java
List<Integer> list = Arrays.asList(5, 2, 8, 1, 9);

Integer min = Collections.min(list);  // 1
Integer max = Collections.max(list);  // 9

// With Comparator
String longest = Collections.max(names, Comparator.comparing(String::length));
```

**Time**: O(n)
**Space**: O(1)

**Stream Alternative:**
```java
Optional<Integer> min = list.stream().min(Integer::compareTo);
Optional<Integer> max = list.stream().max(Integer::compareTo);
```

---

## 📝 Other Useful Algorithms

### 1️⃣ Fill
```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
Collections.fill(list, "X");  // [X, X, X]
```
**Time**: O(n)

### 2️⃣ Copy
```java
List<String> dest = new ArrayList<>(Arrays.asList("1", "2", "3", "4"));
List<String> src = Arrays.asList("A", "B");
Collections.copy(dest, src);  // [A, B, 3, 4]
// Note: dest.size() must be >= src.size()
```
**Time**: O(n)

### 3️⃣ Replace All
```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "A", "C"));
Collections.replaceAll(list, "A", "X");  // [X, B, X, C]
```
**Time**: O(n)

### 4️⃣ Rotate
```java
List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));
Collections.rotate(list, 2);   // [4, 5, 1, 2, 3]
Collections.rotate(list, -1);  // [5, 1, 2, 3, 4]
```
**Time**: O(n)

### 5️⃣ Swap
```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
Collections.swap(list, 0, 2);  // [C, B, A]
```
**Time**: O(1)

### 6️⃣ Add All
```java
List<String> list = new ArrayList<>();
Collections.addAll(list, "A", "B", "C");  // [A, B, C]

// More efficient than:
list.add("A");
list.add("B");
list.add("C");
```
**Time**: O(n)

### 7️⃣ Index of SubList
```java
List<String> list = Arrays.asList("A", "B", "C", "D", "E");
List<String> target = Arrays.asList("C", "D");
int index = Collections.indexOfSubList(list, target);  // 2
int lastIndex = Collections.lastIndexOfSubList(list, target);
```
**Time**: O(n*m)

### 8️⃣ New Set From Map
```java
Set<String> set = Collections.newSetFromMap(new ConcurrentHashMap<>());
// Creates thread-safe Set backed by ConcurrentHashMap
```

---

## 🔁 Set Operations (Using Collections)

**Union:**
```java
Set<Integer> set1 = new HashSet<>(Arrays.asList(1, 2, 3));
Set<Integer> set2 = new HashSet<>(Arrays.asList(3, 4, 5));

Set<Integer> union = new HashSet<>(set1);
union.addAll(set2);  // [1, 2, 3, 4, 5]
```

**Intersection:**
```java
Set<Integer> intersection = new HashSet<>(set1);
intersection.retainAll(set2);  // [3]
```

**Difference:**
```java
Set<Integer> difference = new HashSet<>(set1);
difference.removeAll(set2);  // [1, 2]
```

**Symmetric Difference:**
```java
Set<Integer> symDiff = new HashSet<>(union);
symDiff.removeAll(intersection);  // [1, 2, 4, 5]
```

---

## 📈 Time Complexity Summary

| Algorithm | Time Complexity | Space | Stable |
|-----------|----------------|-------|--------|
| **Tim Sort** | O(n log n) | O(n) | Yes |
| **QuickSort** | O(n log n) avg | O(log n) | No |
| **Binary Search** | O(log n) | O(1) | N/A |
| **Shuffle** | O(n) | O(1) | N/A |
| **Reverse** | O(n) | O(1) | N/A |
| **Frequency** | O(n) | O(1) | N/A |
| **Min/Max** | O(n) | O(1) | N/A |
| **Fill** | O(n) | O(1) | N/A |
| **Copy** | O(n) | O(1) | N/A |
| **Rotate** | O(n) | O(1) | N/A |

---

## ⚡ Performance Tips

**1. Choose Right Algorithm:**
```java
// For searching
// Unsorted → Linear search O(n)
// Sorted → Binary search O(log n)

// For finding min/max
// Unsorted → Collections.min/max O(n)
// Sorted → list.get(0), list.get(size-1) O(1)
```

**2. Sort Once, Search Many:**
```java
List<Integer> list = new ArrayList<>(Arrays.asList(5, 2, 8, 1, 9));
Collections.sort(list);  // Sort once

// Multiple searches
int idx1 = Collections.binarySearch(list, 5);  // O(log n)
int idx2 = Collections.binarySearch(list, 8);  // O(log n)
```

**3. Use Right Data Structure:**
```java
// Frequent contains() → Use Set (O(1)) instead of List (O(n))
Set<String> set = new HashSet<>(list);
boolean contains = set.contains("A");  // O(1)

// Need sorted + frequent access → TreeSet
TreeSet<Integer> sorted = new TreeSet<>();  // Always sorted
```

---

## 🎯 Quick Interview Points

1. **Collections.sort() algorithm?** - Tim Sort
2. **Arrays.sort() algorithm?** - QuickSort (primitives), TimSort (objects)
3. **Tim Sort stable?** - Yes
4. **QuickSort stable?** - No
5. **Binary search requirement?** - Sorted collection
6. **Binary search time complexity?** - O(log n)
7. **Collections.shuffle() algorithm?** - Fisher-Yates shuffle
8. **Collections.reverse() time?** - O(n)
9. **Collections.frequency() time?** - O(n)
10. **Collections.disjoint() check?** - No common elements
11. **Collections.min/max() time?** - O(n)
12. **Collections.fill() use?** - Replace all elements with value
13. **Collections.copy() requirement?** - dest.size() >= src.size()
14. **Collections.rotate() use?** - Shift elements by distance
15. **Collections.swap() time?** - O(1)
16. **Set union operation?** - addAll()
17. **Set intersection operation?** - retainAll()
18. **Set difference operation?** - removeAll()
19. **indexOfSubList() time?** - O(n*m)
20. **When use binarySearch() vs contains()?** - binarySearch for sorted (O(log n)), contains for any (O(n))
21. **Shuffle use cases?** - Randomization, card games, testing
22. **Reverse in-place?** - Yes, Collections.reverse() modifies original
23. **How to sort in reverse?** - Collections.sort() then reverse(), or use Comparator.reverseOrder()
24. **Frequency of null?** - Yes, Collections.frequency(list, null)
25. **Most efficient min/max?** - Collections.min/max O(n) unsorted, get(0)/get(size-1) O(1) sorted
