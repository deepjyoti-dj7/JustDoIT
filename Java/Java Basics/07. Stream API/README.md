# 📝 Stream API - Quick Interview Notes

## 🌊 Introduction to Streams

**What is a Stream?**
- Sequence of elements supporting sequential and parallel operations
- NOT a data structure, doesn't store data
- Functional-style operations on collections
- Introduced in Java 8

**Stream Characteristics:**
- **Lazy evaluation** - Intermediate operations not executed until terminal operation
- **Consumable** - Can be traversed only once
- **Pipelined** - Operations return stream for chaining
- **Internal iteration** - Stream handles iteration

**Stream vs Collection:**
| Stream | Collection |
|--------|------------|
| For computation | For storage |
| Lazy | Eager |
| Consumable (once) | Reusable |
| External iteration optional | External iteration needed |

**Stream Pipeline:**
```
Source → Intermediate Operations → Terminal Operation
```

---

## 🔨 Creating Streams

**From Collections:**
```java
List<String> list = Arrays.asList("A", "B", "C");
Stream<String> stream = list.stream();
Stream<String> parallelStream = list.parallelStream();
```

**From Arrays:**
```java
String[] array = {"A", "B", "C"};
Stream<String> stream = Arrays.stream(array);
Stream<String> stream = Stream.of("A", "B", "C");
```

**From Values:**
```java
Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5);
Stream<String> empty = Stream.empty();
```

**Generate/Iterate:**
```java
// Infinite stream - generate
Stream<Double> randoms = Stream.generate(Math::random);

// Infinite stream - iterate
Stream<Integer> numbers = Stream.iterate(0, n -> n + 1);

// Finite iterate (Java 9+)
Stream<Integer> numbers = Stream.iterate(0, n -> n < 10, n -> n + 1);
```

**From Files:**
```java
Stream<String> lines = Files.lines(Paths.get("file.txt"));
```

**Numeric Streams:**
```java
IntStream intStream = IntStream.range(1, 5);      // 1,2,3,4
IntStream intStream = IntStream.rangeClosed(1, 5); // 1,2,3,4,5
```

---

## 🔄 Intermediate Operations

**Intermediate operations are lazy - executed only when terminal operation called**

**filter() - Filter elements:**
```java
list.stream()
    .filter(s -> s.startsWith("A"))
    .collect(Collectors.toList());
```

**map() - Transform elements:**
```java
list.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

**flatMap() - Flatten nested structures:**
```java
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4)
);
List<Integer> flat = nested.stream()
                           .flatMap(List::stream)
                           .collect(Collectors.toList());
// [1, 2, 3, 4]
```

**distinct() - Remove duplicates:**
```java
list.stream()
    .distinct()
    .collect(Collectors.toList());
```

**sorted() - Sort elements:**
```java
list.stream()
    .sorted()
    .collect(Collectors.toList());

list.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());
```

**limit() - Limit size:**
```java
list.stream()
    .limit(5)
    .collect(Collectors.toList());
```

**skip() - Skip first n elements:**
```java
list.stream()
    .skip(2)
    .collect(Collectors.toList());
```

**peek() - Perform action (debugging):**
```java
list.stream()
    .peek(System.out::println)
    .collect(Collectors.toList());
```

---

## 🎯 Terminal Operations

**Terminal operations trigger execution and close stream**

**collect() - Collect to collection:**
```java
List<String> list = stream.collect(Collectors.toList());
Set<String> set = stream.collect(Collectors.toSet());
Map<String, Integer> map = stream.collect(
    Collectors.toMap(s -> s, String::length)
);
```

**forEach() - Iterate elements:**
```java
stream.forEach(System.out::println);
stream.forEachOrdered(System.out::println);  // Maintains order
```

**count() - Count elements:**
```java
long count = stream.count();
```

**reduce() - Reduce to single value:**
```java
// Sum
int sum = numbers.stream()
                 .reduce(0, (a, b) -> a + b);

// Max
Optional<Integer> max = numbers.stream()
                               .reduce(Integer::max);

// String concatenation
String result = strings.stream()
                      .reduce("", (a, b) -> a + b);
```

**min/max() - Find min/max:**
```java
Optional<Integer> min = stream.min(Comparator.naturalOrder());
Optional<Integer> max = stream.max(Comparator.naturalOrder());
```

**findFirst/findAny() - Find element:**
```java
Optional<String> first = stream.findFirst();
Optional<String> any = stream.findAny();  // Non-deterministic in parallel
```

**anyMatch/allMatch/noneMatch() - Match predicates:**
```java
boolean anyMatch = stream.anyMatch(s -> s.startsWith("A"));
boolean allMatch = stream.allMatch(s -> s.length() > 2);
boolean noneMatch = stream.noneMatch(String::isEmpty);
```

**toArray() - Convert to array:**
```java
String[] array = stream.toArray(String[]::new);
```

---

## 📦 Collectors

**toList/toSet:**
```java
List<String> list = stream.collect(Collectors.toList());
Set<String> set = stream.collect(Collectors.toSet());
```

**toMap:**
```java
Map<String, Integer> map = stream.collect(
    Collectors.toMap(
        s -> s,              // Key
        String::length       // Value
    )
);
```

**joining:**
```java
String result = stream.collect(Collectors.joining());           // "ABC"
String result = stream.collect(Collectors.joining(", "));       // "A, B, C"
String result = stream.collect(Collectors.joining(", ", "[", "]")); // "[A, B, C]"
```

**groupingBy:**
```java
Map<Integer, List<String>> grouped = stream.collect(
    Collectors.groupingBy(String::length)
);
// {1=[A, B], 2=[AB, CD], 3=[ABC]}
```

**partitioningBy:**
```java
Map<Boolean, List<String>> partitioned = stream.collect(
    Collectors.partitioningBy(s -> s.length() > 2)
);
// {false=[A, B], true=[ABC, ABCD]}
```

**counting:**
```java
Long count = stream.collect(Collectors.counting());
```

**summingInt/averagingInt:**
```java
Integer sum = stream.collect(Collectors.summingInt(String::length));
Double avg = stream.collect(Collectors.averagingInt(String::length));
```

**maxBy/minBy:**
```java
Optional<String> max = stream.collect(
    Collectors.maxBy(Comparator.comparing(String::length))
);
```

**summarizingInt:**
```java
IntSummaryStatistics stats = stream.collect(
    Collectors.summarizingInt(String::length)
);
// Gets count, sum, min, max, average
```

---

## ⚡ Parallel Streams

**Creating Parallel Stream:**
```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
Stream<Integer> parallelStream = list.parallelStream();
Stream<Integer> parallelStream = list.stream().parallel();
```

**When to Use:**
- ✅ Large datasets
- ✅ CPU-intensive operations
- ✅ Independent operations
- ✅ No shared mutable state

**When NOT to Use:**
- ❌ Small datasets (overhead > benefit)
- ❌ I/O operations
- ❌ Shared mutable state
- ❌ Order-dependent operations

**Sequential vs Parallel:**
```java
// Sequential
long count = list.stream()
                 .filter(n -> n % 2 == 0)
                 .count();

// Parallel
long count = list.parallelStream()
                 .filter(n -> n % 2 == 0)
                 .count();
```

**Performance Considerations:**
- ForkJoinPool with parallelism = CPU cores
- Overhead for small datasets
- Not always faster

---

## 📊 Stream Performance

**Best Practices:**

**1. Use Primitive Streams:**
```java
// ❌ Bad - Boxing overhead
Stream<Integer> stream = list.stream();

// ✅ Good - No boxing
IntStream stream = list.stream().mapToInt(Integer::intValue);
```

**2. Avoid Unnecessary Operations:**
```java
// ❌ Bad
list.stream().filter(...).collect(Collectors.toList()).stream().map(...)

// ✅ Good
list.stream().filter(...).map(...)
```

**3. Short-Circuit Operations:**
```java
// Stops early with anyMatch
boolean found = list.stream()
                    .filter(expensive)
                    .anyMatch(condition);
```

**4. Use Method References:**
```java
// ✅ Cleaner
list.stream().map(String::toUpperCase)
```

**5. Avoid Stateful Operations:**
```java
// ❌ Bad - Stateful
list.stream().map(s -> list.indexOf(s))

// ✅ Good - Stateless
list.stream().map(String::length)
```

---

## 🎨 Common Patterns

**Filter and Map:**
```java
List<String> result = list.stream()
    .filter(s -> s.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

**FlatMap for Nested Lists:**
```java
List<Integer> flat = listOfLists.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());
```

**Group By:**
```java
Map<String, List<Person>> byCity = people.stream()
    .collect(Collectors.groupingBy(Person::getCity));
```

**Sum/Average:**
```java
int sum = numbers.stream().mapToInt(Integer::intValue).sum();
double avg = numbers.stream().mapToInt(Integer::intValue).average().orElse(0);
```

**Find Max/Min:**
```java
Optional<Integer> max = numbers.stream().max(Integer::compareTo);
```

**String Join:**
```java
String result = strings.stream().collect(Collectors.joining(", "));
```

**Partition:**
```java
Map<Boolean, List<Integer>> partitioned = numbers.stream()
    .collect(Collectors.partitioningBy(n -> n % 2 == 0));
```

---

## 🎯 Quick Interview Points

1. **Stream definition?** - Sequence of elements supporting operations
2. **Stream vs Collection?** - Stream for computation, Collection for storage
3. **Stream consumable?** - Yes, can traverse only once
4. **Intermediate operations?** - filter, map, flatMap, sorted, distinct, limit, skip
5. **Terminal operations?** - collect, forEach, reduce, count, min, max, anyMatch
6. **Lazy evaluation?** - Intermediate operations executed only when terminal operation called
7. **flatMap use case?** - Flatten nested structures
8. **reduce() purpose?** - Reduce stream to single value
9. **groupingBy() result?** - Map<Key, List<Value>>
10. **partitioningBy() result?** - Map<Boolean, List<Value>>
11. **Parallel stream?** - parallelStream() or parallel()
12. **When use parallel stream?** - Large datasets, CPU-intensive, independent operations
13. **Primitive streams?** - IntStream, LongStream, DoubleStream (avoid boxing)
14. **Stream.of() vs Arrays.stream()?** - Both create stream from values/array
15. **findFirst() vs findAny()?** - findFirst maintains order, findAny non-deterministic in parallel
16. **Can reuse stream?** - No, stream is consumable
17. **peek() purpose?** - Debugging, side effects
18. **limit() vs skip()?** - limit takes first n, skip removes first n
19. **collect() purpose?** - Accumulate elements into collection
20. **Short-circuit operations?** - anyMatch, allMatch, noneMatch, findFirst, findAny
