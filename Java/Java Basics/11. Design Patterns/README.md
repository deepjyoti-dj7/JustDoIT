# 📝 Design Patterns - Quick Interview Notes

## 🎯 What are Design Patterns?

**Definition:**
- Reusable solutions to common software design problems
- Best practices evolved over time
- Language-agnostic concepts

**Benefits:**
- **Proven solutions** - Battle-tested approaches
- **Communication** - Common vocabulary for developers
- **Code quality** - Better maintainability, flexibility
- **Faster development** - Don't reinvent the wheel

**Categories:**
1. **Creational** - Object creation (Singleton, Factory, Builder)
2. **Structural** - Object composition (Adapter, Decorator, Proxy)
3. **Behavioral** - Object interaction (Observer, Strategy, Template Method)

---

## 1️⃣ Singleton Pattern

**Intent:** Ensure a class has only one instance and provide global access to it

**When to Use:**
- ✅ Database connections
- ✅ Configuration managers
- ✅ Logger instances
- ✅ Thread pools
- ❌ When you need multiple instances

**Eager Initialization:**
```java
public class EagerSingleton {
    private static final EagerSingleton INSTANCE = new EagerSingleton();
    
    private EagerSingleton() {}
    
    public static EagerSingleton getInstance() {
        return INSTANCE;
    }
}
```

**Lazy Initialization (Thread-Safe):**
```java
public class LazySingleton {
    private static volatile LazySingleton instance;
    
    private LazySingleton() {}
    
    public static LazySingleton getInstance() {
        if(instance == null) {
            synchronized(LazySingleton.class) {
                if(instance == null) {  // Double-checked locking
                    instance = new LazySingleton();
                }
            }
        }
        return instance;
    }
}
```

**Bill Pugh Singleton (Best Approach):**
```java
public class BillPughSingleton {
    private BillPughSingleton() {}
    
    private static class SingletonHelper {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }
    
    public static BillPughSingleton getInstance() {
        return SingletonHelper.INSTANCE;
    }
}
```

**Enum Singleton (Safest):**
```java
public enum EnumSingleton {
    INSTANCE;
    
    public void doSomething() {
        // Business logic
    }
}

// Usage
EnumSingleton.INSTANCE.doSomething();
```

**Breaking Singleton:**
```java
// Reflection
Constructor<Singleton> constructor = Singleton.class.getDeclaredConstructor();
constructor.setAccessible(true);
Singleton instance2 = constructor.newInstance();  // Breaks singleton!

// Serialization
// Solution: Implement readResolve()
protected Object readResolve() {
    return getInstance();
}
```

---

## 2️⃣ Factory Pattern

**Intent:** Create objects without specifying exact class

**Types:**
1. **Simple Factory** - Single factory method
2. **Factory Method** - Subclasses decide which class to instantiate
3. **Abstract Factory** - Family of related objects

### Simple Factory
```java
interface Shape {
    void draw();
}

class Circle implements Shape {
    public void draw() { System.out.println("Circle"); }
}

class Rectangle implements Shape {
    public void draw() { System.out.println("Rectangle"); }
}

class ShapeFactory {
    public static Shape getShape(String type) {
        switch(type.toLowerCase()) {
            case "circle": return new Circle();
            case "rectangle": return new Rectangle();
            default: throw new IllegalArgumentException("Unknown shape");
        }
    }
}

// Usage
Shape shape = ShapeFactory.getShape("circle");
shape.draw();
```

### Factory Method Pattern
```java
abstract class VehicleFactory {
    public Vehicle orderVehicle() {
        Vehicle vehicle = createVehicle();
        vehicle.manufacture();
        vehicle.test();
        return vehicle;
    }
    
    protected abstract Vehicle createVehicle();  // Factory method
}

class CarFactory extends VehicleFactory {
    protected Vehicle createVehicle() {
        return new Car();
    }
}

class BikeFactory extends VehicleFactory {
    protected Vehicle createVehicle() {
        return new Bike();
    }
}
```

**When to Use:**
- ✅ Object creation is complex
- ✅ Need to decouple creation from usage
- ✅ Subclasses decide which class to instantiate

---

## 3️⃣ Builder Pattern

**Intent:** Construct complex objects step by step

**When to Use:**
- ✅ Many constructor parameters
- ✅ Optional parameters
- ✅ Immutable objects
- ✅ Complex object construction

**Classic Builder:**
```java
class Person {
    private final String firstName;      // Required
    private final String lastName;       // Required
    private final int age;               // Optional
    private final String phone;          // Optional
    private final String address;        // Optional
    
    private Person(Builder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.age = builder.age;
        this.phone = builder.phone;
        this.address = builder.address;
    }
    
    public static class Builder {
        // Required parameters
        private final String firstName;
        private final String lastName;
        
        // Optional parameters
        private int age;
        private String phone;
        private String address;
        
        public Builder(String firstName, String lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }
        
        public Builder age(int age) {
            this.age = age;
            return this;
        }
        
        public Builder phone(String phone) {
            this.phone = phone;
            return this;
        }
        
        public Builder address(String address) {
            this.address = address;
            return this;
        }
        
        public Person build() {
            return new Person(this);
        }
    }
    
    // Getters only (immutable)
}

// Usage
Person person = new Person.Builder("John", "Doe")
    .age(30)
    .phone("123-456-7890")
    .address("123 Main St")
    .build();
```

**Lombok @Builder:**
```java
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
class Person {
    private String firstName;
    private String lastName;
    private int age;
    private String phone;
    private String address;
}

// Usage
Person person = Person.builder()
    .firstName("John")
    .lastName("Doe")
    .age(30)
    .build();
```

---

## 4️⃣ Observer Pattern

**Intent:** Define one-to-many dependency; when one object changes, dependents are notified

**When to Use:**
- ✅ Event handling systems
- ✅ Model-View pattern
- ✅ Pub-Sub messaging
- ✅ Monitoring systems

**Implementation:**
```java
interface Observer {
    void update(String message);
}

interface Subject {
    void attach(Observer observer);
    void detach(Observer observer);
    void notifyObservers();
}

class NewsAgency implements Subject {
    private List<Observer> observers = new ArrayList<>();
    private String news;
    
    public void attach(Observer observer) {
        observers.add(observer);
    }
    
    public void detach(Observer observer) {
        observers.remove(observer);
    }
    
    public void notifyObservers() {
        for(Observer observer : observers) {
            observer.update(news);
        }
    }
    
    public void setNews(String news) {
        this.news = news;
        notifyObservers();
    }
}

class NewsChannel implements Observer {
    private String name;
    
    public NewsChannel(String name) {
        this.name = name;
    }
    
    public void update(String news) {
        System.out.println(name + " received: " + news);
    }
}

// Usage
NewsAgency agency = new NewsAgency();
NewsChannel cnn = new NewsChannel("CNN");
NewsChannel bbc = new NewsChannel("BBC");

agency.attach(cnn);
agency.attach(bbc);
agency.setNews("Breaking News!");  // Both notified
```

**Java Built-in (Legacy):**
```java
import java.util.Observable;
import java.util.Observer;

class NewsAgency extends Observable {
    public void setNews(String news) {
        setChanged();
        notifyObservers(news);
    }
}

class NewsChannel implements Observer {
    public void update(Observable o, Object news) {
        System.out.println("News: " + news);
    }
}
```

---

## 5️⃣ Strategy Pattern

**Intent:** Define family of algorithms, encapsulate each, make them interchangeable

**When to Use:**
- ✅ Multiple algorithms for same task
- ✅ Avoid conditional statements
- ✅ Runtime algorithm selection
- ✅ Payment methods, sorting algorithms

**Implementation:**
```java
interface PaymentStrategy {
    void pay(int amount);
}

class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;
    
    public CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    public void pay(int amount) {
        System.out.println("Paid " + amount + " using Credit Card " + cardNumber);
    }
}

class PayPalPayment implements PaymentStrategy {
    private String email;
    
    public PayPalPayment(String email) {
        this.email = email;
    }
    
    public void pay(int amount) {
        System.out.println("Paid " + amount + " using PayPal " + email);
    }
}

class ShoppingCart {
    private PaymentStrategy paymentStrategy;
    
    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }
    
    public void checkout(int amount) {
        paymentStrategy.pay(amount);
    }
}

// Usage
ShoppingCart cart = new ShoppingCart();
cart.setPaymentStrategy(new CreditCardPayment("1234-5678"));
cart.checkout(100);

cart.setPaymentStrategy(new PayPalPayment("user@email.com"));
cart.checkout(50);
```

**With Lambda (Java 8+):**
```java
@FunctionalInterface
interface PaymentStrategy {
    void pay(int amount);
}

ShoppingCart cart = new ShoppingCart();
cart.setPaymentStrategy(amount -> 
    System.out.println("Paid " + amount + " with Credit Card"));
cart.checkout(100);
```

---

## 6️⃣ Decorator Pattern

**Intent:** Attach additional responsibilities to object dynamically

**When to Use:**
- ✅ Add functionality without inheritance
- ✅ Flexible alternative to subclassing
- ✅ I/O streams (BufferedReader wrapping FileReader)
- ✅ UI components

**Implementation:**
```java
interface Coffee {
    String getDescription();
    double getCost();
}

class SimpleCoffee implements Coffee {
    public String getDescription() {
        return "Simple Coffee";
    }
    
    public double getCost() {
        return 2.0;
    }
}

abstract class CoffeeDecorator implements Coffee {
    protected Coffee coffee;
    
    public CoffeeDecorator(Coffee coffee) {
        this.coffee = coffee;
    }
}

class MilkDecorator extends CoffeeDecorator {
    public MilkDecorator(Coffee coffee) {
        super(coffee);
    }
    
    public String getDescription() {
        return coffee.getDescription() + ", Milk";
    }
    
    public double getCost() {
        return coffee.getCost() + 0.5;
    }
}

class SugarDecorator extends CoffeeDecorator {
    public SugarDecorator(Coffee coffee) {
        super(coffee);
    }
    
    public String getDescription() {
        return coffee.getDescription() + ", Sugar";
    }
    
    public double getCost() {
        return coffee.getCost() + 0.3;
    }
}

// Usage
Coffee coffee = new SimpleCoffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);

System.out.println(coffee.getDescription());  // Simple Coffee, Milk, Sugar
System.out.println(coffee.getCost());         // 2.8
```

**Real-world Example:**
```java
// Java I/O uses Decorator pattern
BufferedReader reader = new BufferedReader(
    new InputStreamReader(
        new FileInputStream("file.txt")
    )
);
```

---

## 7️⃣ Adapter Pattern

**Intent:** Convert interface of class into another interface clients expect

**When to Use:**
- ✅ Use existing class with incompatible interface
- ✅ Legacy system integration
- ✅ Third-party library integration

**Class Adapter (Inheritance):**
```java
class LegacyRectangle {
    public void draw(int x1, int y1, int x2, int y2) {
        System.out.println("Rectangle: (" + x1 + "," + y1 + ") to (" + x2 + "," + y2 + ")");
    }
}

interface Shape {
    void draw(int x, int y, int width, int height);
}

class RectangleAdapter extends LegacyRectangle implements Shape {
    public void draw(int x, int y, int width, int height) {
        super.draw(x, y, x + width, y + height);
    }
}
```

**Object Adapter (Composition - Preferred):**
```java
class RectangleAdapter implements Shape {
    private LegacyRectangle rectangle;
    
    public RectangleAdapter(LegacyRectangle rectangle) {
        this.rectangle = rectangle;
    }
    
    public void draw(int x, int y, int width, int height) {
        rectangle.draw(x, y, x + width, y + height);
    }
}

// Usage
Shape shape = new RectangleAdapter(new LegacyRectangle());
shape.draw(10, 20, 30, 40);
```

**Real-world Example:**
```java
// Arrays.asList() adapts array to List interface
String[] array = {"A", "B", "C"};
List<String> list = Arrays.asList(array);
```

---

## 🔄 Pattern Comparison

| Pattern | Purpose | Example |
|---------|---------|---------|
| **Singleton** | One instance only | Logger, Config |
| **Factory** | Object creation | ShapeFactory |
| **Builder** | Complex object construction | Person builder |
| **Observer** | One-to-many notification | Event listeners |
| **Strategy** | Interchangeable algorithms | Payment methods |
| **Decorator** | Add responsibilities dynamically | I/O streams |
| **Adapter** | Convert interface | Legacy integration |

---

## 🎯 Quick Interview Points

1. **What are design patterns?** - Reusable solutions to common problems
2. **Pattern categories?** - Creational, Structural, Behavioral
3. **Singleton use case?** - Database connection, logger
4. **Thread-safe singleton?** - Double-checked locking, Bill Pugh, Enum
5. **Best singleton approach?** - Enum (serialization-safe, reflection-safe)
6. **Factory pattern benefit?** - Decouple object creation
7. **Factory vs Abstract Factory?** - Factory: single product, Abstract: family of products
8. **Builder pattern when?** - Many optional parameters, complex construction
9. **Builder benefit?** - Immutable objects, readable construction
10. **Observer pattern use?** - Event handling, pub-sub
11. **Observer built-in?** - Observable class, Observer interface (deprecated)
12. **Strategy pattern when?** - Multiple algorithms, avoid conditionals
13. **Strategy vs State?** - Strategy: algorithm choice, State: behavior based on state
14. **Decorator pattern use?** - Add functionality without inheritance
15. **Decorator real example?** - Java I/O (BufferedReader, InputStreamReader)
16. **Adapter pattern purpose?** - Interface conversion
17. **Adapter types?** - Class adapter (inheritance), Object adapter (composition)
18. **Which adapter preferred?** - Object adapter (composition over inheritance)
19. **Singleton problems?** - Global state, testing difficulty, tight coupling
20. **Factory Method vs Simple Factory?** - Factory Method uses inheritance, Simple Factory static method
21. **Observer push vs pull?** - Push: send data, Pull: observers query
22. **Decorator vs Inheritance?** - Decorator: runtime, flexible; Inheritance: compile-time, rigid
23. **When avoid Singleton?** - Testability issues, need multiple instances
24. **Builder vs Constructor?** - Builder: many optional params, Constructor: few required params
25. **Strategy with Lambda?** - Yes, strategy as functional interface
