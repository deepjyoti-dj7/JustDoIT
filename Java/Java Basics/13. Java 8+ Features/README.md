# 📝 Java 8+ Features - Quick Interview Notes

## 🎯 Java 8 Features Overview

**Major Features:**
1. Lambda Expressions
2. Functional Interfaces
3. Stream API
4. Default Methods
5. Method References
6. Optional Class
7. Date Time API
8. Nashorn JavaScript Engine
9. CompletableFuture

---

## 🔄 Default Methods

**What are Default Methods?**
- **Methods with implementation** in interfaces
- **Backward compatibility** - Add methods without breaking implementations
- **Multiple inheritance** of behavior

**Syntax:**
```java
interface Vehicle {
    // Abstract method
    void start();
    
    // Default method
    default void honk() {
        System.out.println("Beep beep!");
    }
    
    // Static method
    static void service() {
        System.out.println("Vehicle serviced");
    }
}

class Car implements Vehicle {
    public void start() {
        System.out.println("Car started");
    }
    
    // Can override default method (optional)
    @Override
    public void honk() {
        System.out.println("Car horn!");
    }
}
```

**Diamond Problem:**
```java
interface A {
    default void method() {
        System.out.println("A");
    }
}

interface B {
    default void method() {
        System.out.println("B");
    }
}

class C implements A, B {
    // MUST override to resolve conflict
    @Override
    public void method() {
        A.super.method();  // Call A's method
        // or B.super.method();
        // or custom implementation
    }
}
```

**Use Cases:**
- Backward compatibility (add methods to existing interfaces)
- Optional behavior
- Utility methods

---

## 📅 Date Time API (java.time)

**Problems with Old Date/Time (java.util.Date):**
- ❌ Not thread-safe
- ❌ Poor API design
- ❌ Month starts from 0
- ❌ Mutable

**New Date Time API (java.time):**
- ✅ Thread-safe (immutable)
- ✅ Clear API
- ✅ Better design
- ✅ ISO-8601 standard

### Main Classes:

**1️⃣ LocalDate** - Date without time
```java
LocalDate today = LocalDate.now();
LocalDate date = LocalDate.of(2025, 12, 18);
LocalDate parsed = LocalDate.parse("2025-12-18");

// Operations
LocalDate tomorrow = today.plusDays(1);
LocalDate nextWeek = today.plusWeeks(1);
LocalDate lastMonth = today.minusMonths(1);

// Get components
int year = today.getYear();
Month month = today.getMonth();
int day = today.getDayOfMonth();
DayOfWeek dayOfWeek = today.getDayOfWeek();

// Comparison
boolean isBefore = date.isBefore(today);
boolean isAfter = date.isAfter(today);
```

**2️⃣ LocalTime** - Time without date
```java
LocalTime now = LocalTime.now();
LocalTime time = LocalTime.of(14, 30, 45);
LocalTime parsed = LocalTime.parse("14:30:45");

// Operations
LocalTime later = now.plusHours(2);
LocalTime earlier = now.minusMinutes(30);

// Get components
int hour = now.getHour();
int minute = now.getMinute();
int second = now.getSecond();
```

**3️⃣ LocalDateTime** - Date + Time (no timezone)
```java
LocalDateTime now = LocalDateTime.now();
LocalDateTime dt = LocalDateTime.of(2025, 12, 18, 14, 30);
LocalDateTime parsed = LocalDateTime.parse("2025-12-18T14:30:45");

// Combine date and time
LocalDate date = LocalDate.now();
LocalTime time = LocalTime.now();
LocalDateTime combined = LocalDateTime.of(date, time);

// Convert
LocalDate dateOnly = dt.toLocalDate();
LocalTime timeOnly = dt.toLocalTime();
```

**4️⃣ ZonedDateTime** - Date + Time + Timezone
```java
ZonedDateTime now = ZonedDateTime.now();
ZonedDateTime nyTime = ZonedDateTime.now(ZoneId.of("America/New_York"));
ZonedDateTime parsed = ZonedDateTime.parse("2025-12-18T14:30:45+05:30[Asia/Kolkata]");

// Convert timezone
ZonedDateTime tokyoTime = nyTime.withZoneSameInstant(ZoneId.of("Asia/Tokyo"));
```

**5️⃣ Instant** - Timestamp (epoch seconds)
```java
Instant now = Instant.now();
Instant epoch = Instant.ofEpochSecond(0);
Instant fromMilli = Instant.ofEpochMilli(System.currentTimeMillis());

// Convert to/from ZonedDateTime
ZonedDateTime zdt = now.atZone(ZoneId.systemDefault());
Instant instant = zdt.toInstant();
```

**6️⃣ Period** - Date-based duration
```java
Period period = Period.of(1, 2, 3);  // 1 year, 2 months, 3 days
Period betweenDates = Period.between(date1, date2);

LocalDate future = LocalDate.now().plus(period);

int years = period.getYears();
int months = period.getMonths();
int days = period.getDays();
```

**7️⃣ Duration** - Time-based duration
```java
Duration duration = Duration.ofHours(5);
Duration between = Duration.between(time1, time2);

LocalTime later = LocalTime.now().plus(duration);

long seconds = duration.getSeconds();
long minutes = duration.toMinutes();
long hours = duration.toHours();
```

**8️⃣ DateTimeFormatter** - Formatting and Parsing
```java
LocalDateTime now = LocalDateTime.now();

// Predefined formatters
String iso = now.format(DateTimeFormatter.ISO_DATE_TIME);
String basic = now.format(DateTimeFormatter.BASIC_ISO_DATE);

// Custom formatter
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
String formatted = now.format(formatter);

// Parse
LocalDateTime parsed = LocalDateTime.parse("18-12-2025 14:30:45", formatter);
```

**Common Patterns:**
```java
"yyyy-MM-dd"              // 2025-12-18
"dd/MM/yyyy"              // 18/12/2025
"MMM dd, yyyy"            // Dec 18, 2025
"dd-MM-yyyy HH:mm:ss"     // 18-12-2025 14:30:45
"E, MMM dd yyyy"          // Wed, Dec 18 2025
```

---

## 🎭 Nashorn JavaScript Engine

**What is Nashorn?**
- **JavaScript engine** for JVM (Java 8)
- **Replacement** for Rhino
- **Deprecated** in Java 11
- **Removed** in Java 15

**Usage:**
```java
import javax.script.*;

ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

// Execute JavaScript
engine.eval("print('Hello from JavaScript')");

// Get result
Object result = engine.eval("10 + 20");
System.out.println(result);  // 30

// Invoke Java from JavaScript
engine.eval("var ArrayList = Java.type('java.util.ArrayList')");
engine.eval("var list = new ArrayList()");
engine.eval("list.add('Hello')");

// Bind Java objects
engine.put("name", "John");
engine.eval("print('Hello ' + name)");
```

**jjs Command Line:**
```bash
jjs script.js
jjs -scripting  # Enable shell scripting features
```

**Note:** Use GraalVM or other alternatives for JavaScript on JVM now.

---

## ⚡ CompletableFuture

**What is CompletableFuture?**
- **Asynchronous programming** made easy
- **Combination of Future and CompletionStage**
- **Non-blocking** operations
- **Composable** async tasks

**Creating CompletableFuture:**
```java
// 1. Completed future
CompletableFuture<String> cf = CompletableFuture.completedFuture("Result");

// 2. Run asynchronously (no return)
CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
    System.out.println("Running in: " + Thread.currentThread().getName());
});

// 3. Supply asynchronously (with return)
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    return "Hello";
});

// 4. With custom executor
ExecutorService executor = Executors.newFixedThreadPool(10);
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello", executor);
```

**Transformations:**
```java
// thenApply - Transform result
CompletableFuture<Integer> future = CompletableFuture
    .supplyAsync(() -> "Hello")
    .thenApply(s -> s.length());  // 5

// thenAccept - Consume result
CompletableFuture<Void> future = CompletableFuture
    .supplyAsync(() -> "Hello")
    .thenAccept(s -> System.out.println(s));

// thenRun - Run after completion
CompletableFuture<Void> future = CompletableFuture
    .supplyAsync(() -> "Hello")
    .thenRun(() -> System.out.println("Done"));
```

**Combining Futures:**
```java
// thenCompose - Chain dependent futures
CompletableFuture<String> future = CompletableFuture
    .supplyAsync(() -> "Hello")
    .thenCompose(s -> CompletableFuture.supplyAsync(() -> s + " World"));

// thenCombine - Combine independent futures
CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> "Hello");
CompletableFuture<String> cf2 = CompletableFuture.supplyAsync(() -> "World");
CompletableFuture<String> combined = cf1.thenCombine(cf2, (s1, s2) -> s1 + " " + s2);

// allOf - Wait for all
CompletableFuture<Void> all = CompletableFuture.allOf(cf1, cf2, cf3);

// anyOf - First to complete
CompletableFuture<Object> any = CompletableFuture.anyOf(cf1, cf2, cf3);
```

**Exception Handling:**
```java
CompletableFuture<String> future = CompletableFuture
    .supplyAsync(() -> {
        if(Math.random() > 0.5) throw new RuntimeException("Error");
        return "Success";
    })
    .exceptionally(ex -> {
        System.out.println("Exception: " + ex.getMessage());
        return "Default";
    })
    .handle((result, ex) -> {
        if(ex != null) return "Error: " + ex.getMessage();
        return result;
    });
```

**Getting Results:**
```java
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> "Hello");

// Blocking
String result = future.get();  // Throws checked exceptions
String result = future.join(); // Throws unchecked exceptions

// With timeout
String result = future.get(5, TimeUnit.SECONDS);

// Non-blocking check
if(future.isDone()) {
    String result = future.getNow("default");
}
```

**Async Variants:**
```java
// Async variants use ForkJoinPool.commonPool()
future.thenApplyAsync(s -> s.toUpperCase());
future.thenAcceptAsync(s -> System.out.println(s));
future.thenRunAsync(() -> System.out.println("Done"));

// With custom executor
future.thenApplyAsync(s -> s.toUpperCase(), executor);
```

---

## 🚀 Java 9 Features

### 1️⃣ **Module System (Project Jigsaw)**
```java
// module-info.java
module com.example.myapp {
    requires java.sql;
    exports com.example.myapp.api;
}
```

### 2️⃣ **JShell (REPL)**
```bash
jshell
jshell> int x = 10
jshell> System.out.println(x)
```

### 3️⃣ **Factory Methods for Collections**
```java
List<String> list = List.of("A", "B", "C");
Set<String> set = Set.of("A", "B", "C");
Map<String, Integer> map = Map.of("A", 1, "B", 2);
```

### 4️⃣ **Private Methods in Interfaces**
```java
interface MyInterface {
    default void publicMethod() {
        privateHelper();
    }
    
    private void privateHelper() {
        // Helper logic
    }
}
```

### 5️⃣ **Stream API Enhancements**
```java
// takeWhile
Stream.of(1, 2, 3, 4, 5)
    .takeWhile(n -> n < 4)  // [1, 2, 3]
    
// dropWhile
Stream.of(1, 2, 3, 4, 5)
    .dropWhile(n -> n < 4)  // [4, 5]

// ofNullable
Stream<String> stream = Stream.ofNullable(getNullableValue());
```

### 6️⃣ **Optional Enhancements**
```java
Optional<String> opt = Optional.of("value");

// ifPresentOrElse
opt.ifPresentOrElse(
    v -> System.out.println(v),
    () -> System.out.println("Empty")
);

// or
Optional<String> result = opt.or(() -> Optional.of("default"));

// stream
Stream<String> stream = opt.stream();
```

---

## 📦 Java 10-11 Features

### Java 10

**1️⃣ Local Variable Type Inference (var)**
```java
var list = new ArrayList<String>();  // Type inferred
var map = new HashMap<String, Integer>();
var stream = list.stream();

// Cannot use:
// var x;  // Error: cannot infer
// var x = null;  // Error: cannot infer
// var add(int a, int b) { }  // Error: method return type
```

**2️⃣ Unmodifiable Collections**
```java
List<String> list = List.of("A", "B");
List<String> copy = List.copyOf(list);  // Unmodifiable copy
```

### Java 11

**1️⃣ String Methods**
```java
String str = "  Hello  ";
str.isBlank();           // true if blank
str.lines();             // Stream<String> of lines
str.strip();             // Trim (Unicode-aware)
str.stripLeading();
str.stripTrailing();
str.repeat(3);           // Repeat string
```

**2️⃣ Files Methods**
```java
String content = Files.readString(Path.of("file.txt"));
Files.writeString(Path.of("file.txt"), "content");
```

**3️⃣ Lambda Parameter Inference**
```java
(var x, var y) -> x + y  // var in lambda
```

**4️⃣ HTTP Client (Standard)**
```java
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com"))
    .build();
HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
```

---

## 🎁 Java 12-17 Features

### Java 12
- **Switch Expressions (Preview)**
- **Compact Number Formatting**

### Java 13
- **Text Blocks (Preview)**
```java
String json = """
    {
        "name": "John",
        "age": 30
    }
    """;
```

### Java 14
- **Switch Expressions (Standard)**
```java
int numLetters = switch(day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;
    case TUESDAY -> 7;
    default -> 8;
};
```
- **Records (Preview)**
- **Pattern Matching for instanceof (Preview)**

### Java 15
- **Text Blocks (Standard)**
- **Sealed Classes (Preview)**

### Java 16
- **Records (Standard)**
```java
record Person(String name, int age) {}

Person p = new Person("John", 30);
String name = p.name();
int age = p.age();
```
- **Pattern Matching for instanceof (Standard)**
```java
if(obj instanceof String s) {
    System.out.println(s.toUpperCase());  // s in scope
}
```

### Java 17 (LTS)
- **Sealed Classes (Standard)**
```java
sealed interface Shape permits Circle, Rectangle {}
final class Circle implements Shape {}
final class Rectangle implements Shape {}
```
- **Pattern Matching for switch (Preview)**

---

## 🎯 Quick Interview Points

1. **Java 8 major features?** - Lambdas, Streams, Default methods, Date Time API
2. **Default method purpose?** - Add methods to interfaces without breaking implementations
3. **Diamond problem in Java?** - Multiple default methods, must override to resolve
4. **Date Time API package?** - java.time
5. **LocalDate vs LocalDateTime?** - LocalDate: date only, LocalDateTime: date + time
6. **ZonedDateTime vs LocalDateTime?** - ZonedDateTime has timezone
7. **Period vs Duration?** - Period: date-based, Duration: time-based
8. **Nashorn status?** - Deprecated Java 11, removed Java 15
9. **CompletableFuture benefit?** - Easy async programming, composable
10. **supplyAsync vs runAsync?** - supplyAsync returns value, runAsync void
11. **thenApply vs thenCompose?** - thenApply: transform, thenCompose: chain futures
12. **allOf vs anyOf?** - allOf: all complete, anyOf: first complete
13. **Java 9 main feature?** - Module system (Jigsaw)
14. **JShell?** - REPL for Java (Java 9+)
15. **List.of() modifiable?** - No, immutable
16. **Java 10 var?** - Local variable type inference
17. **var limitations?** - Cannot infer null, must have initializer
18. **Java 11 String methods?** - isBlank(), lines(), strip(), repeat()
19. **Java 14 switch?** - Switch expressions (return value)
20. **Java 16 records?** - Compact data classes
21. **Records mutable?** - No, immutable by default
22. **Pattern matching instanceof?** - Auto-cast in if block (Java 16+)
23. **Sealed classes?** - Restrict which classes can extend/implement (Java 17)
24. **Latest LTS?** - Java 17
25. **Text blocks?** - Multi-line strings (Java 15+)
