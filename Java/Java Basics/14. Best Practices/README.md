# 📝 Best Practices - Quick Interview Notes

## 📛 Naming Conventions

**Classes:**
```java
// ✅ Good - PascalCase, nouns
class UserAccount {}
class PaymentProcessor {}

// ❌ Bad
class userAccount {}  // lowercase
class processPayment {}  // verb
```

**Interfaces:**
```java
// ✅ Good - PascalCase, adjectives or nouns
interface Serializable {}
interface Comparable {}
interface PaymentGateway {}

// ❌ Bad
interface IPayment {}  // Don't use I prefix (C# style)
```

**Methods:**
```java
// ✅ Good - camelCase, verbs
public void calculateTotal() {}
public String getName() {}
public boolean isActive() {}
public boolean hasPermission() {}

// ❌ Bad
public void CalculateTotal() {}  // PascalCase
public void total() {}  // Not descriptive
```

**Variables:**
```java
// ✅ Good - camelCase, meaningful
int studentCount;
String firstName;
boolean isValid;

// ❌ Bad
int sc;  // Too short
int student_count;  // snake_case
```

**Constants:**
```java
// ✅ Good - UPPER_SNAKE_CASE
public static final int MAX_SIZE = 100;
public static final String DEFAULT_NAME = "Unknown";

// ❌ Bad
public static final int maxSize = 100;  // camelCase
```

**Packages:**
```java
// ✅ Good - lowercase, reverse domain
package com.company.project.module;

// ❌ Bad
package Com.Company.Project;  // capitals
```

**Enums:**
```java
// ✅ Good - PascalCase for enum, UPPER for constants
enum Status {
    ACTIVE,
    INACTIVE,
    PENDING
}

// ❌ Bad
enum status {}  // lowercase
enum Status {
    Active,  // PascalCase
    inactive  // lowercase
}
```

---

## 📂 Code Organization

### Package Structure

**Layer-based (Traditional):**
```
com.company.project
├── controller
│   ├── UserController
│   └── ProductController
├── service
│   ├── UserService
│   └── ProductService
├── repository
│   ├── UserRepository
│   └── ProductRepository
└── model
    ├── User
    └── Product
```

**Feature-based (Preferred):**
```
com.company.project
├── user
│   ├── UserController
│   ├── UserService
│   ├── UserRepository
│   └── User
└── product
    ├── ProductController
    ├── ProductService
    ├── ProductRepository
    └── Product
```

### Class Organization

**Order:**
```java
public class MyClass {
    // 1. Static variables
    private static final int CONSTANT = 10;
    private static int staticField;
    
    // 2. Instance variables
    private int instanceField;
    private String name;
    
    // 3. Constructors
    public MyClass() {}
    public MyClass(String name) {}
    
    // 4. Static methods
    public static void staticMethod() {}
    
    // 5. Public methods
    public void publicMethod() {}
    
    // 6. Protected methods
    protected void protectedMethod() {}
    
    // 7. Private methods
    private void privateMethod() {}
    
    // 8. Getters/Setters (at end)
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    // 9. Inner classes
    private static class InnerClass {}
}
```

---

## 🎯 SOLID Principles

### **S - Single Responsibility Principle**

**A class should have only one reason to change**

```java
// ❌ Bad - Multiple responsibilities
class User {
    private String name;
    
    public void saveToDatabase() {}  // Database responsibility
    public void sendEmail() {}       // Email responsibility
    public void generateReport() {}  // Reporting responsibility
}

// ✅ Good - Single responsibility
class User {
    private String name;
    // Only user data
}

class UserRepository {
    public void save(User user) {}  // Database only
}

class EmailService {
    public void sendEmail(User user) {}  // Email only
}

class ReportGenerator {
    public void generate(User user) {}  // Reporting only
}
```

### **O - Open/Closed Principle**

**Open for extension, closed for modification**

```java
// ❌ Bad - Need to modify for new shapes
class AreaCalculator {
    public double calculate(Object shape) {
        if(shape instanceof Circle) {
            Circle c = (Circle) shape;
            return Math.PI * c.radius * c.radius;
        } else if(shape instanceof Rectangle) {
            Rectangle r = (Rectangle) shape;
            return r.width * r.height;
        }
        return 0;
    }
}

// ✅ Good - Open for extension
interface Shape {
    double calculateArea();
}

class Circle implements Shape {
    private double radius;
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
}

class Rectangle implements Shape {
    private double width, height;
    public double calculateArea() {
        return width * height;
    }
}

class AreaCalculator {
    public double calculate(Shape shape) {
        return shape.calculateArea();  // No modification needed for new shapes
    }
}
```

### **L - Liskov Substitution Principle**

**Subclasses should be substitutable for base classes**

```java
// ❌ Bad - Violates LSP
class Bird {
    public void fly() {
        // Flying logic
    }
}

class Penguin extends Bird {
    @Override
    public void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}

// ✅ Good - Follows LSP
abstract class Bird {
    abstract void move();
}

class Sparrow extends Bird {
    @Override
    void move() {
        fly();
    }
    private void fly() { /* Flying logic */ }
}

class Penguin extends Bird {
    @Override
    void move() {
        swim();
    }
    private void swim() { /* Swimming logic */ }
}
```

### **I - Interface Segregation Principle**

**Clients should not depend on interfaces they don't use**

```java
// ❌ Bad - Fat interface
interface Worker {
    void work();
    void eat();
    void sleep();
}

class Robot implements Worker {
    public void work() { /* work */ }
    public void eat() { throw new UnsupportedOperationException(); }  // Robots don't eat!
    public void sleep() { throw new UnsupportedOperationException(); }
}

// ✅ Good - Segregated interfaces
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class Human implements Workable, Eatable, Sleepable {
    public void work() { /* work */ }
    public void eat() { /* eat */ }
    public void sleep() { /* sleep */ }
}

class Robot implements Workable {
    public void work() { /* work */ }
}
```

### **D - Dependency Inversion Principle**

**Depend on abstractions, not concretions**

```java
// ❌ Bad - Depends on concrete class
class EmailService {
    public void sendEmail(String message) { /* send */ }
}

class NotificationService {
    private EmailService emailService = new EmailService();  // Tight coupling
    
    public void notify(String message) {
        emailService.sendEmail(message);
    }
}

// ✅ Good - Depends on abstraction
interface MessageService {
    void send(String message);
}

class EmailService implements MessageService {
    public void send(String message) { /* email */ }
}

class SMSService implements MessageService {
    public void send(String message) { /* SMS */ }
}

class NotificationService {
    private MessageService messageService;  // Depends on abstraction
    
    public NotificationService(MessageService messageService) {
        this.messageService = messageService;
    }
    
    public void notify(String message) {
        messageService.send(message);
    }
}
```

---

## 🧹 Clean Code Principles

### **1. Meaningful Names**
```java
// ❌ Bad
int d;  // elapsed time in days
List<int[]> list1;

// ✅ Good
int elapsedTimeInDays;
List<Account> accounts;
```

### **2. Small Functions**
```java
// ❌ Bad - Long function
public void processOrder(Order order) {
    // Validate (20 lines)
    // Calculate price (30 lines)
    // Apply discount (15 lines)
    // Save to database (10 lines)
    // Send email (20 lines)
}

// ✅ Good - Small functions
public void processOrder(Order order) {
    validate(order);
    double price = calculatePrice(order);
    applyDiscount(order, price);
    save(order);
    sendConfirmation(order);
}

private void validate(Order order) { /* ... */ }
private double calculatePrice(Order order) { /* ... */ }
// ... other small functions
```

### **3. Avoid Magic Numbers**
```java
// ❌ Bad
if(status == 1) {  // What is 1?
    // ...
}

// ✅ Good
private static final int STATUS_ACTIVE = 1;
if(status == STATUS_ACTIVE) {
    // ...
}

// Even better - Use enum
enum Status { ACTIVE, INACTIVE, PENDING }
if(status == Status.ACTIVE) {
    // ...
}
```

### **4. Comments Wisely**
```java
// ❌ Bad - Obvious comment
// Check if age is greater than 18
if(age > 18) {}

// Commented-out code
// oldMethod();

// ✅ Good - Explain why, not what
// Business rule: Only adults can register
if(age > 18) {}

// TODO: Optimize this algorithm for large datasets
```

### **5. Error Handling**
```java
// ❌ Bad
try {
    processData();
} catch(Exception e) {
    e.printStackTrace();  // Swallow exception
}

// ✅ Good
try {
    processData();
} catch(DataException e) {
    logger.error("Failed to process data", e);
    throw new ProcessingException("Unable to process", e);
}
```

### **6. Use Exceptions, Not Error Codes**
```java
// ❌ Bad
public int divide(int a, int b) {
    if(b == 0) return -1;  // Error code
    return a / b;
}

// ✅ Good
public int divide(int a, int b) {
    if(b == 0) throw new IllegalArgumentException("Divisor cannot be zero");
    return a / b;
}
```

---

## ⚠️ Common Mistakes

### **1. Comparing Objects with ==**
```java
// ❌ Bad
String s1 = new String("hello");
String s2 = new String("hello");
if(s1 == s2) {}  // false (compares references)

// ✅ Good
if(s1.equals(s2)) {}  // true (compares values)
```

### **2. Not Overriding equals() and hashCode()**
```java
// ❌ Bad
class Person {
    String name;
    // equals() and hashCode() not overridden
}

Set<Person> set = new HashSet<>();
set.add(new Person("John"));
set.contains(new Person("John"));  // false!

// ✅ Good
class Person {
    String name;
    
    @Override
    public boolean equals(Object o) {
        if(this == o) return true;
        if(!(o instanceof Person)) return false;
        Person person = (Person) o;
        return Objects.equals(name, person.name);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
```

### **3. Ignoring Exceptions**
```java
// ❌ Bad
try {
    riskyOperation();
} catch(Exception e) {
    // Ignore
}

// ✅ Good
try {
    riskyOperation();
} catch(SpecificException e) {
    logger.error("Operation failed", e);
    // Handle or rethrow
}
```

### **4. Resource Leaks**
```java
// ❌ Bad
FileInputStream fis = new FileInputStream("file.txt");
// ... use fis
// fis not closed → resource leak

// ✅ Good
try (FileInputStream fis = new FileInputStream("file.txt")) {
    // ... use fis
}  // Auto-closed
```

### **5. Mutable Static Fields**
```java
// ❌ Bad
public class Config {
    public static List<String> settings = new ArrayList<>();  // Mutable!
}

// ✅ Good
public class Config {
    private static final List<String> SETTINGS = 
        Collections.unmodifiableList(Arrays.asList("A", "B"));
}
```

### **6. String Concatenation in Loops**
```java
// ❌ Bad - O(n²)
String result = "";
for(int i = 0; i < 1000; i++) {
    result += i;  // Creates new String each time
}

// ✅ Good - O(n)
StringBuilder sb = new StringBuilder();
for(int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString();
```

---

## ⚡ Performance Tips

### **1. Use Appropriate Collections**
```java
// ❌ Bad - Using List for lookup
List<String> list = new ArrayList<>();
list.contains("item");  // O(n)

// ✅ Good - Use Set
Set<String> set = new HashSet<>();
set.contains("item");  // O(1)
```

### **2. Lazy Initialization**
```java
// ❌ Bad - Always creates
private HeavyObject obj = new HeavyObject();

// ✅ Good - Create when needed
private HeavyObject obj;
public HeavyObject getObj() {
    if(obj == null) {
        obj = new HeavyObject();
    }
    return obj;
}
```

### **3. Use Primitives When Possible**
```java
// ❌ Bad - Boxing overhead
List<Integer> list = new ArrayList<>();

// ✅ Good - If possible, use primitive array
int[] array = new int[size];
```

### **4. Avoid Premature Optimization**
```java
// First: Make it work
// Then: Make it right
// Finally: Make it fast (if needed)
```

### **5. Profile Before Optimizing**
```java
// Use profilers: JProfiler, VisualVM, YourKit
// Measure, don't guess!
```

---

## 🎯 Quick Interview Points

1. **Class naming?** - PascalCase, nouns
2. **Method naming?** - camelCase, verbs
3. **Constant naming?** - UPPER_SNAKE_CASE
4. **Package naming?** - lowercase, reverse domain
5. **SRP?** - Single Responsibility Principle - one reason to change
6. **OCP?** - Open/Closed - open for extension, closed for modification
7. **LSP?** - Liskov Substitution - subclasses substitutable for base
8. **ISP?** - Interface Segregation - no fat interfaces
9. **DIP?** - Dependency Inversion - depend on abstractions
10. **Clean code?** - Meaningful names, small functions, no magic numbers
11. **Magic number?** - Hard-coded value without explanation
12. **equals() and hashCode()?** - Must override both together
13. **String comparison?** - Use equals(), not ==
14. **Resource leak prevention?** - try-with-resources
15. **StringBuilder vs String?** - StringBuilder for loops/concatenation
16. **List vs Set lookup?** - Set O(1), List O(n)
17. **Checked vs unchecked exception?** - Checked: must handle, Unchecked: runtime
18. **When use ArrayList vs LinkedList?** - ArrayList: random access, LinkedList: insert/delete
19. **Immutable class benefits?** - Thread-safe, hashable, simple
20. **Static variable issues?** - Shared across instances, memory leak risk
21. **Try-catch-finally?** - Finally always executes
22. **Package by layer vs feature?** - Feature preferred (high cohesion)
23. **Class organization order?** - Variables → Constructors → Methods → Getters/Setters
24. **Comment best practice?** - Explain why, not what
25. **Premature optimization?** - Don't optimize before measuring
