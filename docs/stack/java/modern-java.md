---
title: Modern Java
description: Java 8–21 — lambdas, functional interfaces, Optional, java.time API, records, sealed classes, pattern matching, text blocks, var, immutable collections, HttpClient, Files, switch expressions, and more.
---

# Modern Java

Java has transformed dramatically from Java 8 through Java 21. This page covers the features that define idiomatic modern Java — the ones you encounter daily in any contemporary codebase.

---

## Lambdas and Functional Interfaces (Java 8)

A lambda is an anonymous function — a value you can pass around:

```java
// Syntax: (params) -> expression  or  (params) -> { statements; }
Runnable  r  = () -> System.out.println("Hello");
Comparator<String> byLen = (a, b) -> Integer.compare(a.length(), b.length());
Function<String, Integer> parse = s -> Integer.parseInt(s);

// Method references — shorthand when lambda just calls an existing method
Function<String, Integer> parse2  = Integer::parseInt;          // Type::staticMethod
Consumer<String>  print           = System.out::println;        // instance::method
Function<String, String> upper    = String::toUpperCase;        // Type::instanceMethod
Supplier<ArrayList<String>> maker = ArrayList::new;             // Type::new (constructor ref)
```

### Built-in Functional Interfaces (`java.util.function`)

```java
// Function<T,R>: T → R
Function<String, Integer> length = String::length;
length.apply("hello");  // 5
Function<Integer, Integer> doubler   = n -> n * 2;
Function<Integer, Integer> addThenDouble = doubler.compose(n -> n + 1);  // n+1 then *2
Function<Integer, Integer> doubleThenAdd = doubler.andThen(n -> n + 1);  // *2 then +1

// BiFunction<T,U,R>: (T,U) → R
BiFunction<String, Integer, String> repeat = (s, n) -> s.repeat(n);

// Consumer<T>: T → void
Consumer<String> print   = System.out::println;
Consumer<String> trimPrint = print.compose(String::trim); // hmm: compose not on Consumer
Consumer<String> thenLog   = print.andThen(s -> log.info(s));

// BiConsumer<T,U>
BiConsumer<String, Integer> printWithIndex = (s, i) -> System.out.println(i + ": " + s);

// Supplier<T>: () → T
Supplier<UUID> newId = UUID::randomUUID;
Supplier<List<String>> listMaker = ArrayList::new;

// Predicate<T>: T → boolean
Predicate<String> nonEmpty = s -> !s.isEmpty();
Predicate<String> shortStr  = s -> s.length() < 5;
Predicate<String> combined  = nonEmpty.and(shortStr);         // AND
Predicate<String> either    = nonEmpty.or(shortStr);          // OR
Predicate<String> notEmpty  = Predicate.not(String::isEmpty); // Java 11+: static not()
nonEmpty.test("hello");  // true

// UnaryOperator<T>: T → T (specialisation of Function)
UnaryOperator<String> trim = String::trim;
UnaryOperator<Integer> negate = n -> -n;

// BinaryOperator<T>: (T,T) → T
BinaryOperator<Integer> add = Integer::sum;
BinaryOperator<Integer> max = Integer::max;

// Primitive specialisations (avoid boxing)
IntFunction<String>   intToStr  = Integer::toString;
IntUnaryOperator      doubleInt = n -> n * 2;
IntBinaryOperator     sumInts   = Integer::sum;
IntPredicate          positive  = n -> n > 0;
IntConsumer           printInt  = System.out::println;
IntSupplier           zero      = () -> 0;
ToIntFunction<String> strLen    = String::length;
// Also: Long*, Double* variants
```

---

## `Optional` — Explicit Nullable Values (Java 8)

```java
Optional<String> present  = Optional.of("value");        // throws NullPointerException if null
Optional<String> nullable = Optional.ofNullable(maybe);  // empty if null
Optional<String> empty    = Optional.empty();

// Getting values
optional.get();                           // throws NoSuchElementException if empty
optional.orElse("default");              // return default if empty
optional.orElseGet(() -> compute());     // lazy: only called if empty
optional.orElseThrow(() -> new NotFoundException(id));

// Conditional actions
optional.ifPresent(s -> process(s));
optional.ifPresentOrElse(               // Java 9+
    s -> process(s),
    () -> log.warn("Missing value")
);

// Transforming (these return Optional — enable chaining)
optional.map(String::length)            // Optional<Integer>
        .filter(n -> n > 5)
        .orElse(0);

Optional<User> user = findEmail(email).flatMap(this::findUser); // avoids Optional<Optional<>>
optional.stream()   // Java 9+: Optional → Stream of 0 or 1 elements

// Checking
optional.isPresent();  // true if value
optional.isEmpty();    // true if empty (Java 11+)
```

> **Only use `Optional` as a return type**, not as a field or parameter. `Optional` is not `Serializable`. Use it to make it explicit at the API level that a value may be absent.

---

## `java.time` API (Java 8)

The `java.time` package replaced the broken `Date` and `Calendar` API. All types are **immutable and thread-safe**.

```java
// Date types
LocalDate     date  = LocalDate.now();           // 2026-06-20 — date only, no time, no timezone
LocalTime     time  = LocalTime.now();           // 14:30:00.123 — time only
LocalDateTime ldt   = LocalDateTime.now();       // 2026-06-20T14:30:00 — no timezone
ZonedDateTime zdt   = ZonedDateTime.now(ZoneId.of("Asia/Kolkata")); // with timezone
Instant       inst  = Instant.now();             // machine time: nanoseconds since epoch

// Construction
LocalDate d   = LocalDate.of(2026, 6, 20);
LocalDate d2  = LocalDate.of(2026, Month.JUNE, 20);
LocalDate d3  = LocalDate.parse("2026-06-20");         // ISO-8601 format
LocalDate d4  = LocalDate.parse("20/06/2026",
                    DateTimeFormatter.ofPattern("dd/MM/yyyy"));
LocalTime t   = LocalTime.of(14, 30, 0);
LocalTime t2  = LocalTime.parse("14:30:00");

// Arithmetic — all return new instances (immutable)
LocalDate tomorrow   = date.plusDays(1);
LocalDate lastMonth  = date.minusMonths(1);
LocalDate nextYear   = date.plusYears(1);
LocalDate adjusted   = date.with(DayOfWeek.MONDAY); // this week's Monday
LocalDate firstDay   = date.withDayOfMonth(1);       // first of month

// Querying
date.getDayOfWeek();    // FRIDAY
date.getDayOfMonth();   // 20
date.getMonthValue();   // 6
date.getYear();         // 2026
date.isLeapYear();      // false
date.lengthOfMonth();   // 30
date.isBefore(tomorrow);
date.isAfter(lastMonth);

// Duration and Period
Duration duration = Duration.between(t1, t2); // time-based
duration.toHours();
duration.toMinutes();
duration.toSeconds();

Period period = Period.between(d1, d2);        // date-based
period.getDays();
period.getMonths();
period.getYears();

Duration twoHours = Duration.ofHours(2);
Period   threeMonths = Period.ofMonths(3);

// Conversion
ZonedDateTime utc   = ldt.atZone(ZoneId.of("UTC"));
Instant inst2       = utc.toInstant();
long epochMilli     = inst2.toEpochMilli();
Instant fromMillis  = Instant.ofEpochMilli(epochMilli);
LocalDate fromInst  = inst.atZone(ZoneId.systemDefault()).toLocalDate();
```

### `DateTimeFormatter`

```java
// Predefined formatters
DateTimeFormatter.ISO_LOCAL_DATE;       // "2026-06-20"
DateTimeFormatter.ISO_LOCAL_DATE_TIME;  // "2026-06-20T14:30:00"
DateTimeFormatter.ISO_ZONED_DATE_TIME;  // "2026-06-20T14:30:00+05:30[Asia/Kolkata]"

// Custom formatters
DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
String formatted = LocalDateTime.now().format(fmt);   // "20/06/2026 14:30"
LocalDateTime parsed = LocalDateTime.parse("20/06/2026 14:30", fmt);

// Locale-sensitive
DateTimeFormatter localFmt = DateTimeFormatter
    .ofLocalizedDate(FormatStyle.LONG)
    .withLocale(Locale.UK);
String ukDate = LocalDate.now().format(localFmt);  // "20 June 2026"
```

---

## Records (Java 16)

Records are immutable data classes. The compiler generates constructor, accessors, `equals`, `hashCode`, and `toString`:

```java
public record Point(double x, double y) {}
Point p = new Point(3.0, 4.0);
p.x(); p.y();                           // accessors
p.equals(new Point(3.0, 4.0));          // true — structural equality
p.toString();                           // "Point[x=3.0, y=4.0]"

// Custom compact constructor — validate inputs
public record Order(UUID id, String customerId, BigDecimal total) {
    public Order {
        Objects.requireNonNull(id);
        if (total.signum() < 0) throw new IllegalArgumentException("Negative total");
    }

    // Additional methods OK — but no mutable state
    public boolean isHighValue() { return total.compareTo(BigDecimal.valueOf(500)) > 0; }

    // "Wither" pattern: return modified copy
    public Order withTotal(BigDecimal newTotal) {
        return new Order(id, customerId, newTotal);
    }
}
```

---

## Sealed Classes (Java 17)

Sealed classes restrict which classes can extend them — enabling exhaustive pattern matching:

```java
public sealed interface Result<T>
        permits Result.Success, Result.Failure {

    record Success<T>(T value)          implements Result<T> {}
    record Failure<T>(String error, int code) implements Result<T> {}
}

// Exhaustive switch — no default needed
String message = switch (result) {
    case Result.Success<Order> s -> "Order placed: " + s.value().getId();
    case Result.Failure<Order> f -> "Failed: " + f.error();
};
```

---

## Pattern Matching (Java 16–21)

```java
// instanceof pattern matching (Java 16)
if (obj instanceof String s && s.length() > 10) {
    System.out.println("Long string: " + s);  // s is already String, no cast needed
}

// Switch pattern matching (Java 21)
String describe(Object obj) {
    return switch (obj) {
        case Integer i when i < 0  -> "negative int: " + i;
        case Integer i             -> "positive int: " + i;
        case String  s when s.isEmpty() -> "empty string";
        case String  s             -> "string[" + s.length() + "]";
        case null                  -> "null";
        default                    -> obj.getClass().getSimpleName();
    };
}

// Record patterns (Java 21) — deconstruct record components directly
record Point(int x, int y) {}

String quadrant(Object obj) {
    return switch (obj) {
        case Point(int x, int y) when x > 0 && y > 0 -> "Q1";
        case Point(int x, int y) when x < 0 && y > 0 -> "Q2";
        case Point(int x, int y) when x < 0 && y < 0 -> "Q3";
        case Point(int x, int y) -> "Q4 or axes";
        default -> "not a point";
    };
}
```

---

## Switch Expressions (Java 14)

```java
// Yields a value, no fall-through, must be exhaustive
String label = switch (status) {
    case PENDING   -> "Awaiting";
    case CONFIRMED -> "Confirmed";
    case CANCELLED -> "Cancelled";
    // Compiler error if not exhaustive for enums
};

// Multi-line with yield
int score = switch (grade) {
    case "A" -> 4;
    case "B" -> 3;
    case "C" -> {
        log.info("Average grade");
        yield 2;             // yield: return from a block inside switch expression
    }
    default -> 0;
};
```

---

## Text Blocks (Java 15)

```java
// JSON
String json = """
        {
          "id": "%s",
          "status": "confirmed",
          "total": %.2f
        }
        """.formatted(order.getId(), order.getTotal());

// SQL (leading whitespace stripped based on closing """)
String sql = """
        SELECT o.id, o.total, c.email
        FROM orders o
        JOIN customers c ON o.customer_id = c.id
        WHERE o.status = 'confirmed'
        ORDER BY o.created_at DESC
        """;

// HTML
String html = """
        <div class="card">
          <h2>%s</h2>
          <p>%s</p>
        </div>
        """.formatted(title, body);
```

---

## Immutable Collection Factories (Java 9)

```java
List<String>         list = List.of("a", "b", "c");          // no nulls, immutable
Set<String>          set  = Set.of("x", "y", "z");           // no nulls, no duplicates
Map<String, Integer> map  = Map.of("one", 1, "two", 2);      // up to 10 entries
Map<String, Integer> bigMap = Map.ofEntries(                  // unlimited entries
    Map.entry("a", 1),
    Map.entry("b", 2)
);

// Unmodifiable copies (snapshot of existing collection)
List<String>  listCopy = List.copyOf(existingList);
Set<String>   setCopy  = Set.copyOf(existingSet);
Map<K,V>      mapCopy  = Map.copyOf(existingMap);
```

---

## `var` (Java 10)

```java
var list    = new ArrayList<String>();        // type is ArrayList<String>
var entries = map.entrySet();
for (var entry : map.entrySet()) { }          // clear from context

// Do NOT use when type is not obvious
var result = someMethod();  // what type? Use explicit type instead
```

---

## String Methods (Java 9–21)

```java
// Java 11
"  hello  ".strip();           // Unicode-aware trim
"  ".isBlank();                // true (empty or only whitespace)
"a\nb\nc".lines().toList();    // ["a", "b", "c"]
"ha".repeat(3);                // "hahaha"

// Java 12
"hello".indent(4);             // adds 4 spaces of indentation per line
"  hello  ".stripIndent();     // removes common leading whitespace

// Java 15+ (effectively available in strings)
"Order %s costs $%.2f".formatted("A1", 29.99);  // cleaner than String.format()

// Java 21
"hello world".splitWithDelimiters(" ", 3);  // splits AND includes delimiters
```

---

## Stream Enhancements (Java 9–16)

```java
// takeWhile / dropWhile (Java 9)
Stream.of(1,2,3,4,5).takeWhile(n -> n < 4).toList();   // [1,2,3]
Stream.of(1,2,3,4,5).dropWhile(n -> n < 4).toList();   // [4,5]

// Stream.ofNullable (Java 9)
Stream<String> s = Stream.ofNullable(maybeNull);  // empty if null, else [value]

// Stream.iterate with predicate (Java 9)
Stream.iterate(0, n -> n < 100, n -> n + 3).forEach(System.out::println);

// .toList() shorthand (Java 16) — returns unmodifiable list
List<Order> confirmed = orders.stream().filter(...).toList();

// Collectors.teeing (Java 12): two collectors, one merge function
var stats = stream.collect(Collectors.teeing(
    Collectors.counting(),
    Collectors.summingDouble(Item::getPrice),
    (count, sum) -> new Stats(count, sum)
));
```

---

## HTTP Client (Java 11)

Built-in HTTP/1.1 and HTTP/2 client — no external dependencies needed:

```java
HttpClient client = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(10))
    .followRedirects(HttpClient.Redirect.NORMAL)
    .build();

// Synchronous request
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/orders"))
    .header("Authorization", "Bearer " + token)
    .GET()
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.statusCode());  // 200
System.out.println(response.body());

// POST with body
HttpRequest post = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/orders"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(json))
    .build();

// Asynchronous request
CompletableFuture<HttpResponse<String>> future = client.sendAsync(request,
    HttpResponse.BodyHandlers.ofString());
future.thenApply(HttpResponse::body).thenAccept(System.out::println);
```

---

## `Files` Utility (Java 11)

```java
Path path = Path.of("/data/orders.json");

// Read/write entire file as string (Java 11+)
String content = Files.readString(path);
Files.writeString(path, json, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

// Read all lines
List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

// Stream lines lazily (good for large files)
try (Stream<String> stream = Files.lines(path)) {
    long errors = stream.filter(l -> l.contains("ERROR")).count();
}

// Walk directory tree
try (Stream<Path> files = Files.walk(Path.of("/logs"))) {
    files.filter(p -> p.toString().endsWith(".log"))
         .forEach(System.out::println);
}

// Copy, move, delete
Files.copy(src, dst, StandardCopyOption.REPLACE_EXISTING);
Files.move(src, dst, StandardCopyOption.ATOMIC_MOVE);
Files.delete(path);
Files.deleteIfExists(path);

// Create
Files.createFile(path);
Files.createDirectory(path);
Files.createDirectories(path);  // creates all missing parent dirs

// Query
Files.exists(path);
Files.isReadable(path);
Files.size(path);
Files.isDirectory(path);
Files.getLastModifiedTime(path);
```

---

## Key Java Versions Timeline

| Version | LTS | Key features |
|---|---|---|
| **Java 8** (2014) | Yes | Lambdas, Streams, Optional, `java.time`, default interface methods, `CompletableFuture` |
| **Java 9** (2017) | No | Module system, `List.of`/`Set.of`/`Map.of`, `Stream.takeWhile/dropWhile/ofNullable`, private interface methods |
| **Java 10** (2018) | No | `var`, `List.copyOf` |
| **Java 11** (2018) | Yes | `String.strip/isBlank/lines`, `Files.readString/writeString`, HTTP Client, `Predicate.not` |
| **Java 14** (2020) | No | Switch expressions (stable), helpful NullPointerExceptions |
| **Java 15** (2020) | No | Text blocks (stable) |
| **Java 16** (2021) | No | Records (stable), `instanceof` pattern matching (stable), `Stream.toList()` |
| **Java 17** (2021) | Yes | Sealed classes (stable), removal of Security Manager |
| **Java 21** (2023) | Yes | Virtual threads, sequenced collections, pattern matching in switch (stable), record patterns |
