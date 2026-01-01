# 📝 Lambda & Functional Programming - Quick Interview Notes

## λ Lambda Expressions

**What are Lambda Expressions?**
- Anonymous functions (methods without name)
- Concise way to represent functional interfaces
- Introduced in Java 8

**Syntax:**
```java
(parameters) -> expression
(parameters) -> { statements; }
```

**Examples:**
```java
// No parameters
() -> System.out.println("Hello")

// One parameter (parentheses optional)
x -> x * x
(x) -> x * x

// Multiple parameters
(x, y) -> x + y

// Multiple statements
(x, y) -> {
    int sum = x + y;
    return sum;
}
```

**Before Lambda:**
```java
Runnable r = new Runnable() {
    public void run() {
        System.out.println("Hello");
    }
};
```

**With Lambda:**
```java
Runnable r = () -> System.out.println("Hello");
```

**Benefits:**
- ✅ Less boilerplate code
- ✅ Readable and concise
- ✅ Enables functional programming
- ✅ Better support for parallel operations

---

## 🔌 Functional Interfaces

**What is Functional Interface?**
- Interface with exactly ONE abstract method
- Can have multiple default/static methods
- Annotated with `@FunctionalInterface` (optional)

**Example:**
```java
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);  // Single abstract method
    
    // Default and static methods allowed
    default void print() {
        System.out.println("Calculator");
    }
    
    static void info() {
        System.out.println("Performs calculations");
    }
}

// Usage
Calculator add = (a, b) -> a + b;
Calculator multiply = (a, b) -> a * b;
```

**Built-in Functional Interfaces (java.util.function):**
- `Predicate<T>` - Test condition, returns boolean
- `Function<T, R>` - Transform T to R
- `Consumer<T>` - Consumes T, no return
- `Supplier<T>` - Supplies T, no input
- `UnaryOperator<T>` - T → T
- `BinaryOperator<T>` - (T, T) → T

---

## 🔗 Method References

**What are Method References?**
- Shorthand for lambda expressions
- Refer to methods by name

**Types:**

### 1. Static Method Reference
```java
// Lambda
Function<String, Integer> parser = s -> Integer.parseInt(s);

// Method reference
Function<String, Integer> parser = Integer::parseInt;
```

### 2. Instance Method Reference (Object)
```java
String str = "Hello";
// Lambda
Supplier<String> supplier = () -> str.toUpperCase();

// Method reference
Supplier<String> supplier = str::toUpperCase;
```

### 3. Instance Method Reference (Class)
```java
// Lambda
Function<String, String> upper = s -> s.toUpperCase();

// Method reference
Function<String, String> upper = String::toUpperCase;
```

### 4. Constructor Reference
```java
// Lambda
Supplier<List<String>> listSupplier = () -> new ArrayList<>();

// Method reference
Supplier<List<String>> listSupplier = ArrayList::new;

// With parameters
Function<Integer, List<String>> listFunc = ArrayList::new;
```

**Syntax:**
- `ClassName::staticMethod`
- `object::instanceMethod`
- `ClassName::instanceMethod`
- `ClassName::new`

---

## ✅ Predicate Interface

**Predicate<T>:**
- Represents boolean-valued function
- Method: `boolean test(T t)`

**Basic Usage:**
```java
Predicate<Integer> isEven = n -> n % 2 == 0;
System.out.println(isEven.test(4));  // true
System.out.println(isEven.test(5));  // false
```

**Predicate Methods:**
```java
Predicate<Integer> isEven = n -> n % 2 == 0;
Predicate<Integer> isPositive = n -> n > 0;

// and - both must be true
Predicate<Integer> isEvenAndPositive = isEven.and(isPositive);

// or - at least one must be true
Predicate<Integer> isEvenOrPositive = isEven.or(isPositive);

// negate - opposite
Predicate<Integer> isOdd = isEven.negate();

// isEqual - static method
Predicate<String> isHello = Predicate.isEqual("Hello");
```

**Common Use Cases:**
```java
// Filtering
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
List<Integer> evens = numbers.stream()
                             .filter(n -> n % 2 == 0)
                             .collect(Collectors.toList());

// Validation
Predicate<String> isNotEmpty = s -> !s.isEmpty();
Predicate<String> isEmail = s -> s.contains("@");
```

**Primitive Predicates:**
- `IntPredicate`
- `LongPredicate`
- `DoublePredicate`

---

## 🔄 Function Interface

**Function<T, R>:**
- Transforms input T to output R
- Method: `R apply(T t)`

**Basic Usage:**
```java
Function<String, Integer> length = s -> s.length();
System.out.println(length.apply("Hello"));  // 5

Function<Integer, Integer> square = x -> x * x;
System.out.println(square.apply(5));  // 25
```

**Function Methods:**
```java
Function<Integer, Integer> multiplyBy2 = x -> x * 2;
Function<Integer, Integer> add3 = x -> x + 3;

// andThen - execute in sequence (first then second)
Function<Integer, Integer> combined1 = multiplyBy2.andThen(add3);
System.out.println(combined1.apply(5));  // (5*2)+3 = 13

// compose - execute in reverse (second then first)
Function<Integer, Integer> combined2 = multiplyBy2.compose(add3);
System.out.println(combined2.apply(5));  // (5+3)*2 = 16

// identity - returns input unchanged
Function<String, String> identity = Function.identity();
```

**Common Use Cases:**
```java
// Mapping
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
List<Integer> lengths = names.stream()
                             .map(String::length)
                             .collect(Collectors.toList());

// Transformation
Function<String, Integer> parser = Integer::parseInt;
```

**Specialized Functions:**
- `UnaryOperator<T>` - T → T
- `BinaryOperator<T>` - (T, T) → T
- `IntFunction<R>` - int → R
- `ToIntFunction<T>` - T → int

---

## 📥📤 Consumer & Supplier

### Consumer<T>
- Consumes input, no return
- Method: `void accept(T t)`

```java
Consumer<String> printer = s -> System.out.println(s);
printer.accept("Hello");  // Prints: Hello

Consumer<Integer> logger = n -> System.out.println("Value: " + n);
logger.accept(42);  // Prints: Value: 42
```

**Consumer Methods:**
```java
Consumer<String> c1 = s -> System.out.println("C1: " + s);
Consumer<String> c2 = s -> System.out.println("C2: " + s);

// andThen - chain consumers
Consumer<String> combined = c1.andThen(c2);
combined.accept("Hello");
// C1: Hello
// C2: Hello
```

**Use Cases:**
```java
// forEach
List<String> names = Arrays.asList("Alice", "Bob");
names.forEach(name -> System.out.println(name));
names.forEach(System.out::println);  // Method reference
```

**Specialized Consumers:**
- `BiConsumer<T, U>` - Accepts two arguments
- `IntConsumer`, `LongConsumer`, `DoubleConsumer`

### Supplier<T>
- Supplies value, no input
- Method: `T get()`

```java
Supplier<Double> randomSupplier = () -> Math.random();
System.out.println(randomSupplier.get());  // Random number

Supplier<String> stringSupplier = () -> "Hello";
System.out.println(stringSupplier.get());  // Hello
```

**Use Cases:**
```java
// Lazy initialization
Supplier<List<String>> listSupplier = ArrayList::new;
List<String> list = listSupplier.get();

// Factory pattern
Supplier<User> userFactory = () -> new User("Default");
User user = userFactory.get();
```

**Specialized Suppliers:**
- `BooleanSupplier` - Supplies boolean
- `IntSupplier`, `LongSupplier`, `DoubleSupplier`

---

## 📦 Optional Class

**What is Optional?**
- Container that may or may not contain value
- Avoids null pointer exceptions
- Introduced in Java 8

**Creating Optional:**
```java
Optional<String> empty = Optional.empty();
Optional<String> value = Optional.of("Hello");  // Throws NPE if null
Optional<String> nullable = Optional.ofNullable(null);  // Safe
```

**Checking Value:**
```java
Optional<String> opt = Optional.of("Hello");

opt.isPresent();   // true
opt.isEmpty();     // false (Java 11+)
```

**Getting Value:**
```java
Optional<String> opt = Optional.of("Hello");

// get() - throws NoSuchElementException if empty
String value = opt.get();

// orElse() - default value if empty
String value = opt.orElse("Default");

// orElseGet() - supplier for default value
String value = opt.orElseGet(() -> "Default");

// orElseThrow() - throw exception if empty
String value = opt.orElseThrow(() -> new RuntimeException("Not found"));
```

**Conditional Actions:**
```java
Optional<String> opt = Optional.of("Hello");

// ifPresent() - execute if value present
opt.ifPresent(s -> System.out.println(s));

// ifPresentOrElse() - execute based on presence (Java 9+)
opt.ifPresentOrElse(
    s -> System.out.println(s),
    () -> System.out.println("Empty")
);
```

**Transformations:**
```java
Optional<String> opt = Optional.of("hello");

// map() - transform value
Optional<Integer> length = opt.map(String::length);

// flatMap() - avoid nested Optional
Optional<String> upper = opt.flatMap(s -> Optional.of(s.toUpperCase()));

// filter() - conditional filtering
Optional<String> filtered = opt.filter(s -> s.length() > 3);
```

**Chaining:**
```java
String result = Optional.ofNullable(user)
                        .map(User::getAddress)
                        .map(Address::getCity)
                        .orElse("Unknown");
```

**Best Practices:**
- ✅ Use for return types (not parameters)
- ✅ Avoid Optional in fields
- ✅ Don't use Optional.get() without isPresent()
- ✅ Use orElse/orElseGet for defaults
- ❌ Don't use Optional.of(null)
- ❌ Don't use Optional for collections (use empty collection instead)

---

## 🎯 Quick Interview Points

1. **Lambda syntax?** - (parameters) -> expression or { statements }
2. **Functional interface?** - Interface with single abstract method
3. **@FunctionalInterface?** - Optional annotation for functional interfaces
4. **Method reference types?** - Static, instance (object), instance (class), constructor
5. **Predicate?** - Boolean-valued function, test(T t)
6. **Function?** - Transform T to R, apply(T t)
7. **Consumer?** - Consumes T, no return, accept(T t)
8. **Supplier?** - Supplies T, no input, get()
9. **Optional purpose?** - Avoid null pointer exceptions
10. **Optional.of() vs ofNullable()?** - of() throws NPE for null, ofNullable() is safe
11. **get() vs orElse()?** - get() throws exception if empty, orElse() provides default
12. **map() vs flatMap()?** - map() wraps in Optional, flatMap() doesn't
13. **Lambda benefits?** - Less code, readable, functional programming
14. **Can lambda access local variables?** - Yes, if final or effectively final
15. **Method reference syntax?** - ClassName::methodName
16. **BiFunction?** - Takes two arguments, returns result
17. **UnaryOperator?** - Function where input and output are same type
18. **BinaryOperator?** - BiFunction where all types are same
19. **Predicate chaining?** - and(), or(), negate()
20. **When to use Optional?** - Return types that may be absent, avoid null checks
