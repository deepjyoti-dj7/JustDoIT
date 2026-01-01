# 📝 Stream Operations on Collections - Quick Interview Notes

## 🌊 Collection to Stream

**Creating Streams:**
```java
List<String> list = Arrays.asList("A", "B", "C");

// From Collection
Stream<String> stream = list.stream();
Stream<String> parallelStream = list.parallelStream();

// From Array
String[] array = {"A", "B", "C"};
Stream<String> stream = Arrays.stream(array);

// From values
Stream<String> stream = Stream.of("A", "B", "C");

// From Map
Map<String, Integer> map = new HashMap<>();
Stream<String> keys = map.keySet().stream();
Stream<Integer> values = map.values().stream();
Stream<Map.Entry<String, Integer>> entries = map.entrySet().stream();
```

**Stream Characteristics:**
- **Lazy evaluation** - Operations deferred until terminal operation
- **Functional style** - Immutable operations
- **Can be parallel** - Easy parallelization
- **One-time use** - Cannot reuse stream

---

## 🔍 Filtering Collections

**filter():**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

// Filter even numbers
List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());  // [2, 4, 6]

// Multiple filters (chained)
List<Integer> result = numbers.stream()
    .filter(n -> n > 2)
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());  // [4, 6]

// Filter null values
List<String> names = Arrays.asList("Alice", null, "Bob", null);
List<String> nonNull = names.stream()
    .filter(Objects::nonNull)
    .collect(Collectors.toList());  // [Alice, Bob]
```

**distinct():**
```java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 4);
List<Integer> unique = numbers.stream()
    .distinct()
    .collect(Collectors.toList());  // [1, 2, 3, 4]
```

**limit() & skip():**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

// First 3
List<Integer> first3 = numbers.stream()
    .limit(3)
    .collect(Collectors.toList());  // [1, 2, 3]

// Skip first 2
List<Integer> skipFirst2 = numbers.stream()
    .skip(2)
    .collect(Collectors.toList());  // [3, 4, 5, 6]

// Pagination: skip(page * size).limit(size)
List<Integer> page2 = numbers.stream()
    .skip(2)
    .limit(2)
    .collect(Collectors.toList());  // [3, 4]
```

---

## 🗺️ Mapping Collections

**map():**
```java
List<String> names = Arrays.asList("alice", "bob", "charlie");

// Transform to uppercase
List<String> upper = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());  // [ALICE, BOB, CHARLIE]

// Extract lengths
List<Integer> lengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());  // [5, 3, 7]

// Object transformation
class Person {
    String name;
    int age;
}
List<Person> people = Arrays.asList(/* ... */);
List<String> names = people.stream()
    .map(Person::getName)
    .collect(Collectors.toList());
```

**flatMap():**
```java
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4),
    Arrays.asList(5, 6)
);

// Flatten nested lists
List<Integer> flat = nested.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());  // [1, 2, 3, 4, 5, 6]

// Words to characters
List<String> words = Arrays.asList("Hello", "World");
List<String> chars = words.stream()
    .flatMap(word -> Arrays.stream(word.split("")))
    .collect(Collectors.toList());  // [H, e, l, l, o, W, o, r, l, d]
```

**mapToInt/mapToDouble/mapToLong:**
```java
List<String> numbers = Arrays.asList("1", "2", "3");

// Convert to primitive stream
int sum = numbers.stream()
    .mapToInt(Integer::parseInt)
    .sum();  // 6

double avg = numbers.stream()
    .mapToDouble(Double::parseDouble)
    .average()
    .orElse(0.0);
```

---

## 📉 Reducing Collections

**reduce():**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Sum
int sum = numbers.stream()
    .reduce(0, (a, b) -> a + b);  // 15

// Using method reference
int sum2 = numbers.stream()
    .reduce(0, Integer::sum);

// Product
int product = numbers.stream()
    .reduce(1, (a, b) -> a * b);  // 120

// Max
Optional<Integer> max = numbers.stream()
    .reduce(Integer::max);  // Optional[5]

// String concatenation
List<String> words = Arrays.asList("Hello", "World");
String concat = words.stream()
    .reduce("", (a, b) -> a + " " + b)
    .trim();  // "Hello World"
```

**Terminal Operations:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// count
long count = numbers.stream().count();  // 5

// sum (IntStream)
int sum = numbers.stream().mapToInt(Integer::intValue).sum();

// average
double avg = numbers.stream()
    .mapToInt(Integer::intValue)
    .average()
    .orElse(0.0);

// min/max
Optional<Integer> min = numbers.stream().min(Integer::compareTo);
Optional<Integer> max = numbers.stream().max(Integer::compareTo);

// anyMatch, allMatch, noneMatch
boolean hasEven = numbers.stream().anyMatch(n -> n % 2 == 0);  // true
boolean allEven = numbers.stream().allMatch(n -> n % 2 == 0);  // false
boolean noneNegative = numbers.stream().noneMatch(n -> n < 0); // true

// findFirst, findAny
Optional<Integer> first = numbers.stream().findFirst();
Optional<Integer> any = numbers.stream().findAny();

// forEach
numbers.stream().forEach(System.out::println);

// collect
List<Integer> list = numbers.stream().collect(Collectors.toList());
Set<Integer> set = numbers.stream().collect(Collectors.toSet());
```

---

## 📊 Grouping & Partitioning

**Grouping:**
```java
class Person {
    String name;
    String city;
    int age;
}

List<Person> people = Arrays.asList(/* ... */);

// Group by city
Map<String, List<Person>> byCity = people.stream()
    .collect(Collectors.groupingBy(Person::getCity));

// Group by age
Map<Integer, List<Person>> byAge = people.stream()
    .collect(Collectors.groupingBy(Person::getAge));

// Group and count
Map<String, Long> cityCount = people.stream()
    .collect(Collectors.groupingBy(
        Person::getCity,
        Collectors.counting()
    ));

// Group and get names
Map<String, List<String>> namesByCity = people.stream()
    .collect(Collectors.groupingBy(
        Person::getCity,
        Collectors.mapping(Person::getName, Collectors.toList())
    ));

// Multi-level grouping
Map<String, Map<Integer, List<Person>>> byCityAndAge = people.stream()
    .collect(Collectors.groupingBy(
        Person::getCity,
        Collectors.groupingBy(Person::getAge)
    ));
```

**Partitioning:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

// Partition by even/odd
Map<Boolean, List<Integer>> partitioned = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
// {false=[1, 3, 5], true=[2, 4, 6]}

// Partition people by age > 18
Map<Boolean, List<Person>> adults = people.stream()
    .collect(Collectors.partitioningBy(p -> p.getAge() >= 18));

// Partition and count
Map<Boolean, Long> evenCount = numbers.stream()
    .collect(Collectors.partitioningBy(
        n -> n % 2 == 0,
        Collectors.counting()
    ));
```

---

## 🎯 Collectors

**Common Collectors:**

### 1️⃣ To Collection
```java
List<String> list = stream.collect(Collectors.toList());
Set<String> set = stream.collect(Collectors.toSet());
Collection<String> coll = stream.collect(Collectors.toCollection(ArrayList::new));
TreeSet<String> treeSet = stream.collect(Collectors.toCollection(TreeSet::new));
```

### 2️⃣ To Map
```java
// toMap(keyMapper, valueMapper)
Map<String, Integer> map = people.stream()
    .collect(Collectors.toMap(
        Person::getName,
        Person::getAge
    ));

// Handle duplicates
Map<String, Integer> map2 = people.stream()
    .collect(Collectors.toMap(
        Person::getName,
        Person::getAge,
        (existing, replacement) -> existing  // Keep existing
    ));

// Custom map type
TreeMap<String, Integer> treeMap = people.stream()
    .collect(Collectors.toMap(
        Person::getName,
        Person::getAge,
        (e, r) -> e,
        TreeMap::new
    ));
```

### 3️⃣ Joining
```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

String joined = names.stream()
    .collect(Collectors.joining());  // "AliceBobCharlie"

String commaSep = names.stream()
    .collect(Collectors.joining(", "));  // "Alice, Bob, Charlie"

String formatted = names.stream()
    .collect(Collectors.joining(", ", "[", "]"));  // "[Alice, Bob, Charlie]"
```

### 4️⃣ Statistics
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

IntSummaryStatistics stats = numbers.stream()
    .collect(Collectors.summarizingInt(Integer::intValue));

System.out.println(stats.getCount());    // 5
System.out.println(stats.getSum());      // 15
System.out.println(stats.getMin());      // 1
System.out.println(stats.getMax());      // 5
System.out.println(stats.getAverage());  // 3.0
```

### 5️⃣ Reducing
```java
// Sum
int sum = numbers.stream()
    .collect(Collectors.reducing(0, Integer::sum));

// Max
Optional<Integer> max = numbers.stream()
    .collect(Collectors.reducing(Integer::max));

// Custom reduction
String concat = names.stream()
    .collect(Collectors.reducing("", (a, b) -> a + b));
```

### 6️⃣ Custom Collector
```java
// Example: Collecting to custom object
class Stats {
    int sum;
    int count;
    double avg() { return (double) sum / count; }
}

Stats stats = numbers.stream()
    .collect(
        Stats::new,                              // Supplier
        (s, n) -> { s.sum += n; s.count++; },   // Accumulator
        (s1, s2) -> {                           // Combiner
            s1.sum += s2.sum;
            s1.count += s2.count;
        }
    );
```

---

## ⚡ Parallel Streams

**Creating Parallel Streams:**
```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

// From collection
Stream<Integer> parallel = list.parallelStream();

// Convert to parallel
Stream<Integer> parallel2 = list.stream().parallel();

// Back to sequential
Stream<Integer> sequential = parallel.sequential();
```

**When to Use:**
- ✅ Large datasets (> 10,000 elements)
- ✅ CPU-intensive operations
- ✅ Independent operations (no shared state)
- ❌ Small datasets (overhead > benefit)
- ❌ I/O operations
- ❌ Stateful operations

**Example:**
```java
List<Integer> numbers = IntStream.range(1, 1000000)
    .boxed()
    .collect(Collectors.toList());

// Sequential
long sum = numbers.stream()
    .mapToInt(Integer::intValue)
    .sum();

// Parallel (faster for large datasets)
long sumParallel = numbers.parallelStream()
    .mapToInt(Integer::intValue)
    .sum();
```

---

## 🎯 Quick Interview Points

1. **Stream characteristics?** - Lazy evaluation, functional, one-time use
2. **Stream vs Collection?** - Stream for processing, Collection for storage
3. **Intermediate vs Terminal?** - Intermediate returns stream, terminal produces result
4. **Intermediate operations?** - filter, map, flatMap, distinct, sorted, limit, skip
5. **Terminal operations?** - collect, forEach, reduce, count, anyMatch, findFirst
6. **filter() use?** - Keep elements matching predicate
7. **map() use?** - Transform elements
8. **flatMap() use?** - Flatten nested structures
9. **reduce() use?** - Aggregate elements to single value
10. **collect() use?** - Gather elements to collection
11. **Collectors.toList() vs toSet()?** - toList preserves order/duplicates, toSet removes duplicates
12. **groupingBy() use?** - Group elements by classifier
13. **partitioningBy() use?** - Divide into two groups (true/false)
14. **Collectors.joining() use?** - Concatenate strings
15. **parallelStream() when?** - Large datasets, CPU-intensive, independent operations
16. **Stream reusable?** - No, can only use once
17. **Lazy evaluation benefit?** - Doesn't process until terminal operation
18. **distinct() based on?** - equals() and hashCode()
19. **sorted() requirement?** - Elements Comparable or provide Comparator
20. **peek() use?** - Debug/logging (intermediate operation)
21. **findFirst() vs findAny()?** - findFirst deterministic, findAny faster in parallel
22. **anyMatch() vs allMatch()?** - anyMatch: at least one, allMatch: all
23. **Short-circuit operations?** - anyMatch, allMatch, noneMatch, findFirst, findAny, limit
24. **reduce() identity?** - Initial value (0 for sum, 1 for product)
25. **Stream null handling?** - Use filter(Objects::nonNull)
