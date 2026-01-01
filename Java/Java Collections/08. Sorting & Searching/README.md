# 📝 Sorting & Searching - Quick Interview Notes

## 🎯 Comparable Interface

**Purpose:**
- Define **natural ordering** for a class
- Single sorting sequence
- Implemented by class itself

**Interface:**
```java
public interface Comparable<T> {
    int compareTo(T o);
}
```

**compareTo() Contract:**
- Returns **negative** if this < other
- Returns **zero** if this == other
- Returns **positive** if this > other

**Implementation:**
```java
class Student implements Comparable<Student> {
    String name;
    int age;
    
    @Override
    public int compareTo(Student other) {
        // Natural ordering by age
        return Integer.compare(this.age, other.age);
        
        // Alternative implementations:
        // return this.age - other.age;  // Watch for overflow!
        // return this.name.compareTo(other.name);  // By name
    }
}

// Usage
List<Student> students = new ArrayList<>();
Collections.sort(students);  // Uses natural ordering
TreeSet<Student> set = new TreeSet<>();  // Auto-sorted
```

**Common Comparable Implementations:**
- String: Lexicographic order
- Integer, Long, Double: Numeric order
- Date: Chronological order
- File: Pathname lexicographic order

**Best Practices:**
```java
// GOOD - Safe from overflow
return Integer.compare(this.age, other.age);

// BAD - Can overflow
return this.age - other.age;  // If age difference > Integer.MAX_VALUE

// Multi-field comparison
@Override
public int compareTo(Student other) {
    int nameComp = this.name.compareTo(other.name);
    if(nameComp != 0) return nameComp;
    return Integer.compare(this.age, other.age);
}
```

**When to Use:**
- ✅ Single, natural ordering
- ✅ Class has obvious default sort
- ❌ Multiple sorting criteria needed
- ❌ Can't modify class (use Comparator)

---

## ⚖️ Comparator Interface

**Purpose:**
- Define **custom ordering** for a class
- Multiple sorting sequences
- External to class

**Interface:**
```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
    
    // Default methods (Java 8+)
    default Comparator<T> reversed();
    default Comparator<T> thenComparing(Comparator<? super T> other);
    // ... more default methods
    
    // Static methods
    static <T> Comparator<T> naturalOrder();
    static <T> Comparator<T> reverseOrder();
    static <T> Comparator<T> nullsFirst(Comparator<? super T> comparator);
    static <T> Comparator<T> nullsLast(Comparator<? super T> comparator);
    static <T, U> Comparator<T> comparing(Function<? super T, ? extends U> keyExtractor);
    // ... more static methods
}
```

**Implementation:**

### 1️⃣ Traditional Anonymous Class
```java
Comparator<Student> byAge = new Comparator<Student>() {
    @Override
    public int compare(Student s1, Student s2) {
        return Integer.compare(s1.age, s2.age);
    }
};
Collections.sort(students, byAge);
```

### 2️⃣ Lambda Expression (Java 8+)
```java
Comparator<Student> byAge = (s1, s2) -> Integer.compare(s1.age, s2.age);
Collections.sort(students, byAge);

// Inline
Collections.sort(students, (s1, s2) -> s1.name.compareTo(s2.name));
```

### 3️⃣ Method Reference (Java 8+)
```java
students.sort(Comparator.comparing(Student::getAge));
students.sort(Comparator.comparing(Student::getName));
```

### 4️⃣ Multiple Comparators
```java
// Traditional chaining
Comparator<Student> comp = new Comparator<Student>() {
    public int compare(Student s1, Student s2) {
        int nameComp = s1.name.compareTo(s2.name);
        if(nameComp != 0) return nameComp;
        return Integer.compare(s1.age, s2.age);
    }
};

// Java 8+ - thenComparing
Comparator<Student> comp = Comparator
    .comparing(Student::getName)
    .thenComparing(Student::getAge);

// Reversed
Comparator<Student> reversed = Comparator
    .comparing(Student::getAge)
    .reversed();

// Natural order
Collections.sort(list, Comparator.naturalOrder());
Collections.sort(list, Comparator.reverseOrder());

// Null handling
Comparator<Student> comp = Comparator
    .nullsFirst(Comparator.comparing(Student::getName));
```

**When to Use:**
- ✅ Multiple sorting criteria
- ✅ Can't modify class
- ✅ Different orderings needed
- ✅ Ad-hoc sorting

---

## 📊 Comparable vs Comparator

| Aspect | Comparable | Comparator |
|--------|-----------|------------|
| **Package** | java.lang | java.util |
| **Method** | `compareTo(T o)` | `compare(T o1, T o2)` |
| **Location** | Inside class | External |
| **Sorting Criteria** | Single (natural) | Multiple (custom) |
| **Modification** | Must modify class | No class modification |
| **Usage** | Collections.sort(list) | Collections.sort(list, comparator) |
| **Example** | String, Integer | Custom sorting |

---

## 🔍 Collections.sort()

**Signatures:**
```java
static <T extends Comparable<? super T>> void sort(List<T> list)
static <T> void sort(List<T> list, Comparator<? super T> c)
```

**Usage:**
```java
List<Integer> numbers = Arrays.asList(5, 2, 8, 1, 9);

// Natural ordering (requires Comparable)
Collections.sort(numbers);  // [1, 2, 5, 8, 9]

// Custom comparator
Collections.sort(numbers, Comparator.reverseOrder());  // [9, 8, 5, 2, 1]

// Java 8+ - List.sort()
numbers.sort(Comparator.naturalOrder());
numbers.sort(Comparator.reverseOrder());
numbers.sort((a, b) -> Integer.compare(b, a));  // Reverse
```

**Algorithm:**
- **Tim Sort** - Hybrid (merge sort + insertion sort)
- **Stable** - Preserves order of equal elements
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)

**Characteristics:**
- Stable sort
- Adaptive (faster on partially sorted data)
- Efficient for real-world data

---

## 📐 Arrays.sort()

**Signatures:**
```java
static void sort(int[] a)
static void sort(int[] a, int fromIndex, int toIndex)
static <T> void sort(T[] a, Comparator<? super T> c)
static void parallelSort(int[] a)  // Java 8+
```

**Usage:**
```java
int[] nums = {5, 2, 8, 1, 9};

// Primitive arrays
Arrays.sort(nums);  // [1, 2, 5, 8, 9]

// Range sorting
Arrays.sort(nums, 1, 4);  // Sort from index 1 to 3

// Object arrays
String[] names = {"Charlie", "Alice", "Bob"};
Arrays.sort(names);  // Natural order
Arrays.sort(names, Comparator.reverseOrder());

// Parallel sort (Java 8+)
int[] large = new int[1000000];
Arrays.parallelSort(large);  // Uses ForkJoinPool
```

**Algorithm:**
- **Dual-Pivot QuickSort** (primitives) - Not stable, O(n log n)
- **Tim Sort** (objects) - Stable, O(n log n)
- **Parallel Sort** (Java 8+) - Uses multiple threads

**Arrays.sort() vs Collections.sort():**
```java
// Arrays
int[] primitives = {5, 2, 8};
Arrays.sort(primitives);

// Collections
List<Integer> list = Arrays.asList(5, 2, 8);
Collections.sort(list);
```

---

## 🔎 Binary Search

**Requirements:**
- **Collection must be sorted**
- Uses divide-and-conquer
- **Time Complexity**: O(log n)

**Collections.binarySearch():**
```java
List<Integer> list = Arrays.asList(1, 3, 5, 7, 9);
Collections.sort(list);  // Must be sorted!

int index = Collections.binarySearch(list, 5);  // 2
int notFound = Collections.binarySearch(list, 4);  // -(insertion point) - 1 = -3

// With Comparator
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
Collections.sort(names, Comparator.reverseOrder());
int idx = Collections.binarySearch(names, "Bob", Comparator.reverseOrder());
```

**Return Value:**
- **≥ 0**: Index of element (if found)
- **< 0**: `-(insertion point) - 1` (if not found)

**Calculate Insertion Point:**
```java
int index = Collections.binarySearch(list, key);
if(index < 0) {
    int insertionPoint = -(index + 1);
}
```

**Arrays.binarySearch():**
```java
int[] nums = {1, 3, 5, 7, 9};
Arrays.sort(nums);

int index = Arrays.binarySearch(nums, 5);  // 2
int notFound = Arrays.binarySearch(nums, 4);  // -3

// Range search
int rangeIdx = Arrays.binarySearch(nums, 1, 4, 5);  // Search from index 1 to 3
```

---

## 🎨 Custom Sorting Examples

### Example 1: Sort by Multiple Fields
```java
class Employee {
    String name;
    int age;
    double salary;
}

// Sort by salary (desc), then by age (asc)
Comparator<Employee> comp = Comparator
    .comparing(Employee::getSalary, Comparator.reverseOrder())
    .thenComparing(Employee::getAge);

employees.sort(comp);
```

### Example 2: Sort with Null Handling
```java
Comparator<String> comp = Comparator
    .nullsLast(Comparator.naturalOrder());

List<String> list = Arrays.asList("A", null, "B", null, "C");
Collections.sort(list, comp);  // [A, B, C, null, null]
```

### Example 3: Custom Comparator for Complex Logic
```java
Comparator<String> lengthThenAlpha = (s1, s2) -> {
    int lenComp = Integer.compare(s1.length(), s2.length());
    if(lenComp != 0) return lenComp;
    return s1.compareTo(s2);
};

List<String> words = Arrays.asList("cat", "dog", "elephant", "ant");
Collections.sort(words, lengthThenAlpha);
// [ant, cat, dog, elephant]
```

### Example 4: Case-Insensitive Sort
```java
List<String> names = Arrays.asList("Alice", "bob", "Charlie");
Collections.sort(names, String.CASE_INSENSITIVE_ORDER);
// [Alice, bob, Charlie]
```

---

## ⚡ Performance Tips

**1. Choose Right Sort:**
```java
// Small list (< 100) - any sort fine
// Large list - Collections.sort() or Arrays.parallelSort()

// Primitive arrays - Arrays.sort() (QuickSort)
// Objects - Collections.sort() or Arrays.sort() (TimSort - stable)
```

**2. Pre-sort when Possible:**
```java
// If using TreeSet/TreeMap - auto-sorted
TreeSet<Integer> set = new TreeSet<>();  // Always sorted

// If need both sorted and fast access - use ArrayList + sort once
List<Integer> list = new ArrayList<>(set);
Collections.sort(list);
```

**3. Binary Search Only on Sorted:**
```java
// WRONG
List<Integer> list = Arrays.asList(5, 2, 8, 1);
Collections.binarySearch(list, 5);  // Wrong results!

// CORRECT
Collections.sort(list);
Collections.binarySearch(list, 5);
```

---

## 🎯 Quick Interview Points

1. **Comparable interface method?** - compareTo(T o)
2. **Comparator interface method?** - compare(T o1, T o2)
3. **Comparable package?** - java.lang
4. **Comparator package?** - java.util
5. **compareTo() return values?** - negative, zero, positive
6. **Collections.sort() algorithm?** - Tim Sort
7. **Arrays.sort() algorithm (primitives)?** - Dual-Pivot QuickSort
8. **Arrays.sort() algorithm (objects)?** - Tim Sort
9. **Is Collections.sort() stable?** - Yes
10. **Is Arrays.sort() (primitives) stable?** - No
11. **Binary search requirement?** - List must be sorted
12. **Binary search time complexity?** - O(log n)
13. **Binary search return value?** - Index if found, -(insertion point)-1 if not
14. **Comparable vs Comparator?** - Comparable: natural order in class, Comparator: external custom order
15. **Can class implement both?** - Yes, Comparable for natural, Comparator for custom
16. **Comparator.naturalOrder()?** - Natural ordering comparator
17. **Comparator.reverseOrder()?** - Reverse natural ordering
18. **Comparator.comparing()?** - Extract key for comparison
19. **thenComparing()?** - Chain comparators
20. **nullsFirst/nullsLast()?** - Handle null values
21. **Tim Sort characteristics?** - Stable, adaptive, O(n log n)
22. **parallelSort() benefit?** - Faster for large arrays using multiple threads
23. **When use Arrays.sort() vs Collections.sort()?** - Arrays for arrays, Collections for Lists
24. **How to sort in reverse?** - Comparator.reverseOrder() or reversed()
25. **Case-insensitive string sort?** - String.CASE_INSENSITIVE_ORDER
