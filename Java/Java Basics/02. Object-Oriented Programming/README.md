# 📝 Object-Oriented Programming - Quick Interview Notes

## 🎯 Classes & Objects

**Class:**
- Blueprint/template for creating objects
- Defines properties (fields) and behaviors (methods)

**Object:**
- Instance of a class
- Has state (fields) and behavior (methods)

**Syntax:**
```java
class ClassName {
    // Fields (instance variables)
    dataType fieldName;
    
    // Constructor
    ClassName() { }
    
    // Methods
    returnType methodName() { }
}

// Creating object
ClassName obj = new ClassName();
```

**Key Concepts:**
- Class is logical entity, object is physical
- Multiple objects can be created from one class
- Objects stored in heap memory
- Reference variables stored in stack

---

## 🏗️ Constructors

**What is Constructor?**
- Special method to initialize objects
- Same name as class
- No return type (not even void)
- Called automatically when object created

**Types:**

### 1. Default Constructor
```java
class MyClass {
    MyClass() {  // No parameters
        // initialization
    }
}
```

### 2. Parameterized Constructor
```java
class MyClass {
    int x;
    MyClass(int x) {
        this.x = x;
    }
}
```

### 3. Copy Constructor
```java
class MyClass {
    int x;
    MyClass(MyClass obj) {
        this.x = obj.x;
    }
}
```

**Constructor Overloading:**
```java
class MyClass {
    MyClass() { }
    MyClass(int x) { }
    MyClass(int x, int y) { }
}
```

**Constructor Chaining:**
```java
class MyClass {
    MyClass() {
        this(10);  // Calls parameterized constructor
    }
    MyClass(int x) {
        // initialization
    }
}
```

**Important Points:**
- If no constructor defined, Java provides default constructor
- Constructor cannot be inherited
- Constructor cannot be static, final, or abstract
- `this()` must be first statement

---

## 🔧 Methods & Method Overloading

**Method Structure:**
```java
accessModifier returnType methodName(parameters) {
    // method body
    return value;
}
```

**Method Components:**
- **Access Modifier** - public, private, protected, default
- **Return Type** - Data type of return value or void
- **Method Name** - Identifier
- **Parameters** - Input values
- **Method Body** - Code to execute

**Method Overloading:**
- Same method name, different parameters
- **Compile-time polymorphism**

**Overloading Rules:**
```java
// Different number of parameters
void method(int a) { }
void method(int a, int b) { }

// Different types of parameters
void method(int a) { }
void method(double a) { }

// Different order of parameters
void method(int a, String b) { }
void method(String a, int b) { }
```

**Cannot Overload By:**
- ❌ Return type alone
- ❌ Access modifier alone

**Varargs:**
```java
void method(int... numbers) {
    // numbers is treated as array
}
method(1, 2, 3, 4, 5);  // Any number of args
```

---

## 👪 Inheritance

**What is Inheritance?**
- Mechanism to acquire properties of another class
- Promotes code reusability
- IS-A relationship

**Syntax:**
```java
class Parent {
    // parent members
}

class Child extends Parent {
    // child members + inherited members
}
```

**Types of Inheritance:**

### 1. Single Inheritance
```java
class A { }
class B extends A { }
```

### 2. Multilevel Inheritance
```java
class A { }
class B extends A { }
class C extends B { }
```

### 3. Hierarchical Inheritance
```java
class A { }
class B extends A { }
class C extends A { }
```

**❌ Multiple Inheritance NOT Supported (via classes)**
- Diamond problem
- Use interfaces instead

**Constructor in Inheritance:**
- Parent constructor called first (implicit `super()`)
- Use `super()` to call specific parent constructor

**Method Overriding:**
```java
class Parent {
    void display() { }
}
class Child extends Parent {
    @Override
    void display() {  // Same signature
        // child implementation
    }
}
```

**Important:**
- `private` members not inherited
- `final` methods cannot be overridden
- `static` methods are hidden, not overridden

---

## 🎭 Polymorphism

**What is Polymorphism?**
- "Many forms" - Same entity behaves differently
- Two types: Compile-time and Runtime

### 1. Compile-Time Polymorphism (Static Binding)
- **Method Overloading**
- **Operator Overloading** (not in Java, except + for String)
- Resolved at compile time

### 2. Runtime Polymorphism (Dynamic Binding)
- **Method Overriding**
- Resolved at runtime

**Method Overriding Rules:**
```java
class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {  // Same signature
        System.out.println("Bark");
    }
}

Animal a = new Dog();  // Upcasting
a.sound();  // Calls Dog's sound() - Runtime polymorphism
```

**Overriding Rules:**
- Same method signature
- IS-A relationship required
- Cannot reduce access modifier visibility
- Cannot override `static`, `final`, `private` methods
- Can override with covariant return types

**Dynamic Method Dispatch:**
- JVM decides which method to call at runtime
- Based on object type, not reference type

**Upcasting vs Downcasting:**
```java
Animal a = new Dog();     // Upcasting (implicit)
Dog d = (Dog) a;          // Downcasting (explicit)
```

---

## 🔐 Encapsulation

**What is Encapsulation?**
- Wrapping data and methods together
- Data hiding using access modifiers
- Provides controlled access via getters/setters

**Implementation:**
```java
class Employee {
    private int id;        // Private field
    private String name;
    
    // Public getter
    public int getId() {
        return id;
    }
    
    // Public setter
    public void setId(int id) {
        if(id > 0) {  // Validation
            this.id = id;
        }
    }
}
```

**Benefits:**
- ✅ Data hiding and security
- ✅ Flexibility (change implementation without affecting users)
- ✅ Reusability
- ✅ Easy to test and maintain
- ✅ Control over data (validation)

**Fully Encapsulated Class:**
- All fields are private
- Public getters/setters for access

---

## 🎨 Abstraction

**What is Abstraction?**
- Hiding implementation details
- Showing only essential features
- Focus on WHAT rather than HOW

**Ways to Achieve:**
1. Abstract Classes (0-100% abstraction)
2. Interfaces (100% abstraction)

**Abstract Class:**
```java
abstract class Animal {
    abstract void sound();  // Abstract method (no body)
    
    void sleep() {          // Concrete method
        System.out.println("Sleeping");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Bark");
    }
}
```

**Abstract Class Rules:**
- Cannot be instantiated
- Can have abstract and concrete methods
- Can have constructors
- Can have static methods
- Can have final methods
- May have 0 or more abstract methods

**Abstraction vs Encapsulation:**
| Abstraction | Encapsulation |
|-------------|---------------|
| Hides complexity | Hides data |
| Design level | Implementation level |
| Abstract class/Interface | Access modifiers |
| WHAT to do | HOW to protect |

---

## 🔌 Interfaces

**What is Interface?**
- Blueprint of class
- 100% abstraction (until Java 8)
- All methods are public and abstract by default

**Syntax:**
```java
interface Animal {
    void sound();  // public abstract by default
    
    // Java 8+: Default method
    default void sleep() {
        System.out.println("Sleeping");
    }
    
    // Java 8+: Static method
    static void info() {
        System.out.println("Animal info");
    }
    
    // Java 9+: Private method
    private void helper() { }
}

class Dog implements Animal {
    @Override
    public void sound() {
        System.out.println("Bark");
    }
}
```

**Interface Rules:**
- All methods `public abstract` by default (before Java 8)
- All fields `public static final` (constants)
- Cannot have constructors
- Cannot be instantiated
- Class can implement multiple interfaces

**Multiple Inheritance via Interfaces:**
```java
interface A { }
interface B { }
class C implements A, B { }  // Multiple interfaces
```

**Interface Inheritance:**
```java
interface A { }
interface B extends A { }  // Interface extends interface
```

**Marker Interface:**
- Empty interface (no methods)
- Examples: Serializable, Cloneable, Remote

---

## ⚖️ Abstract Classes vs Interfaces

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| **Keyword** | abstract | interface |
| **Methods** | Abstract + Concrete | Abstract (default/static in Java 8+) |
| **Variables** | Any type | public static final only |
| **Constructors** | ✅ Yes | ❌ No |
| **Access Modifiers** | Any | public only (methods) |
| **Multiple Inheritance** | ❌ No | ✅ Yes |
| **Instantiation** | ❌ Cannot | ❌ Cannot |
| **Extends/Implements** | extends | implements |
| **Use Case** | IS-A (inheritance) | CAN-DO (capability) |
| **When to Use** | Common base with shared code | Contract/behavior definition |

**When to Use Abstract Class:**
- Common functionality to share
- Non-public members needed
- Want to provide default behavior
- Related classes in hierarchy

**When to Use Interface:**
- Multiple inheritance needed
- Unrelated classes implementing same behavior
- Define contract/capability
- Want complete abstraction

**Java 8+ Changes:**
- Interfaces can have default and static methods
- Reduces difference between abstract class and interface

**Real-World Examples:**
- Abstract Class: `HttpServlet`, `InputStream`
- Interface: `List`, `Set`, `Map`, `Runnable`

---

## 🎯 Quick Interview Points

1. **Class vs Object?** - Class is blueprint, object is instance
2. **Constructor characteristics?** - Same name as class, no return type, called automatically
3. **Constructor overloading?** - Multiple constructors with different parameters
4. **this vs super?** - this refers to current object, super refers to parent
5. **Method overloading vs overriding?** - Overloading: same name different params (compile-time), Overriding: same signature (runtime)
6. **Types of polymorphism?** - Compile-time (overloading) and Runtime (overriding)
7. **Inheritance types in Java?** - Single, Multilevel, Hierarchical (Multiple NOT supported for classes)
8. **Why multiple inheritance not allowed?** - Diamond problem
9. **Encapsulation benefit?** - Data hiding, controlled access, flexibility
10. **Abstraction ways?** - Abstract classes and Interfaces
11. **Abstract class instantiation?** - Cannot instantiate
12. **Interface methods default access?** - public abstract
13. **Can interface have constructors?** - No
14. **Multiple interfaces?** - Yes, class can implement multiple
15. **When abstract class vs interface?** - Abstract for IS-A with shared code, Interface for capability/contract
16. **Marker interface?** - Empty interface (Serializable, Cloneable)
17. **Covariant return type?** - Overriding method can return subtype
18. **Can override static method?** - No, it's method hiding not overriding
19. **Final method?** - Cannot be overridden
20. **Abstract method in abstract class?** - Must be overridden in concrete subclass
