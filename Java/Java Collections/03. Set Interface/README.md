# 📝 Set Interface - Quick Interview Notes

## 📋 Set Interface Basics

**What is Set?**
- Unordered collection (no guaranteed order)
- **No duplicates** - Core characteristic
- Models mathematical set
- Extends Collection interface

**Key Characteristics:**
- **No duplicates** - Rejects duplicate elements
- **At most one null** - Can contain at most one null element
- **No index access** - No get(index) method
- **Uniqueness** - Determined by equals() and hashCode()

**Set Methods:**
```java
boolean add(E e)           // Returns false if duplicate
boolean remove(Object o)
boolean contains(Object o)
int size()
boolean isEmpty()
void clear()
Iterator<E> iterator()
```

---

## 🗂️ HashSet

**Characteristics:**
- **Hash table** - Backed by HashMap
- **No order** - Elements not ordered
- **Fast operations** - O(1) add, remove, contains
- **Allows null** - Can have one null element
- **Not synchronized** - Not thread-safe

**Internal:**
- Backed by HashMap<E, Object>
- Elements stored as keys, dummy Object as value
- Uses hashCode() and equals() for uniqueness

**Usage:**
```java
Set<String> set = new HashSet<>();
set.add("A");
set.add("B");
set.add("A");  // Ignored (duplicate)
System.out.println(set.size());  // 2

boolean contains = set.contains("A");
set.remove("A");
```

**When to Use:**
- ✅ Fast lookup/insert/delete
- ✅ Uniqueness enforcement
- ✅ Don't care about order
- ❌ Need sorted elements
- ❌ Need insertion order

**Time Complexity:**
- add: O(1) average
- remove: O(1) average
- contains: O(1) average
- iteration: O(capacity + size)

---

## 🔗 LinkedHashSet

**Characteristics:**
- **Hash table + doubly-linked list** - Ordered HashSet
- **Maintains insertion order** - Predictable iteration
- **Fast operations** - O(1) add, remove, contains
- **Allows null** - Can have one null element
- **Not synchronized** - Not thread-safe

**Internal:**
- Extends HashSet
- Backed by LinkedHashMap
- Doubly-linked list maintains order

**Usage:**
```java
Set<String> set = new LinkedHashSet<>();
set.add("C");
set.add("A");
set.add("B");
// Iteration order: C, A, B (insertion order)

for(String s : set) {
    System.out.println(s);  // C, A, B
}
```

**When to Use:**
- ✅ Need uniqueness + insertion order
- ✅ Predictable iteration order
- ✅ Fast operations
- ❌ Need sorted order

**Time Complexity:**
- add: O(1)
- remove: O(1)
- contains: O(1)
- Slightly slower than HashSet (overhead of maintaining links)

---

## 🌲 TreeSet

**Characteristics:**
- **Red-Black tree** - Balanced BST (NavigableSet)
- **Sorted order** - Natural ordering or Comparator
- **Slower operations** - O(log n)
- **No null** - Doesn't allow null (throws NullPointerException)
- **Not synchronized** - Not thread-safe

**Internal:**
- Backed by TreeMap
- Red-Black tree (self-balancing BST)
- Elements must be Comparable or provide Comparator

**Usage:**
```java
// Natural ordering
Set<Integer> set = new TreeSet<>();
set.add(3);
set.add(1);
set.add(2);
// Iteration: 1, 2, 3 (sorted)

// Custom comparator
Set<String> set2 = new TreeSet<>(Comparator.reverseOrder());
set2.add("A");
set2.add("C");
set2.add("B");
// Iteration: C, B, A

// NavigableSet methods
TreeSet<Integer> ts = new TreeSet<>();
ts.add(10); ts.add(20); ts.add(30);
Integer lower = ts.lower(20);     // 10
Integer higher = ts.higher(20);   // 30
Integer floor = ts.floor(25);     // 20
Integer ceiling = ts.ceiling(25); // 30
Set<Integer> head = ts.headSet(20);    // [10]
Set<Integer> tail = ts.tailSet(20);    // [20, 30]
Set<Integer> sub = ts.subSet(10, 30);  // [10, 20]
```

**When to Use:**
- ✅ Need sorted elements
- ✅ Need range operations (NavigableSet)
- ✅ Elements naturally comparable
- ❌ Need fastest operations
- ❌ Have null elements

**Time Complexity:**
- add: O(log n)
- remove: O(log n)
- contains: O(log n)

---

## 📊 EnumSet

**Characteristics:**
- **Specialized for enums** - High-performance
- **Bit vector** - Internally uses bit flags
- **Very fast** - All operations O(1)
- **Type-safe** - Only enum values
- **No null** - Doesn't allow null

**Usage:**
```java
enum Day { MON, TUE, WED, THU, FRI, SAT, SUN }

// Create
EnumSet<Day> weekdays = EnumSet.range(Day.MON, Day.FRI);
EnumSet<Day> weekend = EnumSet.of(Day.SAT, Day.SUN);
EnumSet<Day> all = EnumSet.allOf(Day.class);
EnumSet<Day> none = EnumSet.noneOf(Day.class);
EnumSet<Day> complement = EnumSet.complementOf(weekdays);

// Operations
weekdays.add(Day.SAT);
boolean contains = weekdays.contains(Day.MON);
```

**When to Use:**
- ✅ Working with enum types
- ✅ Need high performance
- ✅ Set operations on enums

**Time Complexity:**
- All operations: O(1)
- Much faster than HashSet for enums

---

## ⚖️ HashSet vs LinkedHashSet vs TreeSet

| Feature | HashSet | LinkedHashSet | TreeSet |
|---------|---------|---------------|---------|
| **Data Structure** | Hash table | Hash table + Linked list | Red-Black tree |
| **Order** | No order | Insertion order | Sorted (natural/custom) |
| **Null** | One null allowed | One null allowed | No null |
| **Performance** | O(1) | O(1) | O(log n) |
| **Memory** | Less | More (links) | More (tree nodes) |
| **Synchronized** | No | No | No |
| **Use Case** | Fast lookup | Insertion order needed | Sorted elements |
| **Interface** | Set | Set | NavigableSet |

---

## 🔍 Set Operations

```java
Set<Integer> set1 = new HashSet<>(Arrays.asList(1, 2, 3, 4));
Set<Integer> set2 = new HashSet<>(Arrays.asList(3, 4, 5, 6));

// Union
Set<Integer> union = new HashSet<>(set1);
union.addAll(set2);  // [1, 2, 3, 4, 5, 6]

// Intersection
Set<Integer> intersection = new HashSet<>(set1);
intersection.retainAll(set2);  // [3, 4]

// Difference
Set<Integer> difference = new HashSet<>(set1);
difference.removeAll(set2);  // [1, 2]

// Symmetric Difference
Set<Integer> symDiff = new HashSet<>(union);
symDiff.removeAll(intersection);  // [1, 2, 5, 6]

// Subset check
boolean isSubset = set1.containsAll(set2);
```

---

## 🎯 Quick Interview Points

1. **Set main characteristic?** - No duplicates
2. **HashSet backed by?** - HashMap
3. **HashSet time complexity?** - O(1) average for add/remove/contains
4. **HashSet order?** - No guaranteed order
5. **LinkedHashSet order?** - Insertion order
6. **LinkedHashSet backed by?** - LinkedHashMap
7. **TreeSet backed by?** - TreeMap (Red-Black tree)
8. **TreeSet time complexity?** - O(log n)
9. **TreeSet order?** - Sorted (natural or comparator)
10. **TreeSet allows null?** - No
11. **HashSet allows null?** - Yes, one null
12. **EnumSet performance?** - Very fast, O(1) all operations
13. **EnumSet internal?** - Bit vector
14. **Which Set fastest?** - EnumSet (for enums), HashSet (general)
15. **Which Set for sorting?** - TreeSet
16. **Which Set for insertion order?** - LinkedHashSet
17. **TreeSet implements?** - NavigableSet
18. **Set uses equals()?** - Yes, for uniqueness check
19. **Set uses hashCode()?** - Yes (for HashSet/LinkedHashSet)
20. **How to get synchronized Set?** - Collections.synchronizedSet()
21. **Union operation?** - set1.addAll(set2)
22. **Intersection operation?** - set1.retainAll(set2)
23. **Difference operation?** - set1.removeAll(set2)
24. **Can Set have duplicates?** - No, add() returns false for duplicates
25. **NavigableSet methods?** - lower(), floor(), ceiling(), higher(), headSet(), tailSet(), subSet()
