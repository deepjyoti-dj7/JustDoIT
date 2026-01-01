# 📝 Advanced OOP Concepts - Quick Interview Notes

## ⚡ Static Keyword

**What is Static?**
- Belongs to class, not instance
- Shared among all objects
- Loaded when class is loaded

**Static Variable:**
```java
class Counter {
    static int count = 0;  // Shared by all objects
    
    Counter() {
        count++;
    }
}
```

**Static Method:**
```java
class MathUtil {
    static int add(int a, int b) {
        return a + b;
    }
}
MathUtil.add(5, 3);  // Called with class name
```

**Static Block:**
```java
class MyClass {
    static int x;
    
    static {
        x = 10;  // Executed once when class loads
        System.out.println("Static block");
    }
}
```

**Static Rules:**
- ✅ Can access static members directly
- ❌ Cannot access non-static members directly
- ❌ Cannot use `this` or `super`
- Static methods can be overloaded but NOT overridden

**Static vs Instance:**
| Static | Instance |
|--------|----------|
| Class level | Object level |
| One copy | Copy per object |
| ClassName.member | object.member |
| Memory efficient | More memory |

---

## 🔒 Final Keyword

**Final Variable:**
- Cannot be changed (constant)
```java
final int MAX = 100;
MAX = 200;  // ❌ Compile error
```

**Blank Final Variable:**
```java
class MyClass {
    final int x;
    MyClass(int x) {
        this.x = x;  // Must initialize in constructor
    }
}
```

**Final Method:**
- Cannot be overridden
```java
class Parent {
    final void display() {
        System.out.println("Final method");
    }
}
class Child extends Parent {
    void display() { }  // ❌ Cannot override
}
```

**Final Class:**
- Cannot be inherited
```java
final class MyClass {
    // Cannot be extended
}
class Child extends MyClass { }  // ❌ Error
```

**Final with Objects:**
```java
final StringBuilder sb = new StringBuilder("Hello");
sb.append(" World");  // ✅ OK - object content can change
sb = new StringBuilder();  // ❌ Error - reference cannot change
```

**Examples:**
- `String` class is final
- Wrapper classes are final
- `Math` class is final

---

## 📦 Inner Classes

**Types of Inner Classes:**

### 1. Member Inner Class
```java
class Outer {
    private int x = 10;
    
    class Inner {
        void display() {
            System.out.println(x);  // Can access outer members
        }
    }
}

Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();
```

### 2. Static Nested Class
```java
class Outer {
    static class StaticNested {
        void display() {
            // Cannot access non-static outer members
        }
    }
}

Outer.StaticNested nested = new Outer.StaticNested();
```

### 3. Local Inner Class
```java
class Outer {
    void method() {
        class LocalInner {
            void display() { }
        }
        LocalInner inner = new LocalInner();
    }
}
```

### 4. Anonymous Inner Class
```java
interface MyInterface {
    void display();
}

MyInterface obj = new MyInterface() {
    @Override
    public void display() {
        System.out.println("Anonymous");
    }
};
```

**Inner Class Access:**
- Member inner can access all outer members (including private)
- Static nested can only access static outer members
- Local inner can access final/effectively final local variables

**Use Cases:**
- Event handling (GUI)
- Callbacks
- Helper classes
- One-time use classes

---

## 👻 Anonymous Classes

**What is Anonymous Class?**
- Class without name
- Declared and instantiated in single expression
- Used for one-time use

**Syntax:**
```java
// Anonymous class implementing interface
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Running");
    }
};

// Anonymous class extending class
Thread t = new Thread() {
    @Override
    public void run() {
        System.out.println("Thread running");
    }
};
```

**Characteristics:**
- No name
- Declared and instantiated together
- Can extend class OR implement interface
- Cannot have constructors
- Cannot access non-final local variables (before Java 8)

**Use Cases:**
- Event listeners
- One-time implementations
- Short callbacks
- Comparators

**Anonymous vs Lambda (Java 8+):**
```java
// Anonymous class
Runnable r1 = new Runnable() {
    public void run() {
        System.out.println("Hello");
    }
};

// Lambda (simpler)
Runnable r2 = () -> System.out.println("Hello");
```

---

## 📚 Packages

**What is Package?**
- Container for grouping related classes/interfaces
- Namespace management
- Access protection

**Package Types:**
1. **Built-in Packages**: java.lang, java.util, java.io
2. **User-defined Packages**: Custom packages

**Creating Package:**
```java
package com.mycompany.myapp;

public class MyClass {
    // class code
}
```

**Importing Packages:**
```java
import java.util.ArrayList;        // Specific class
import java.util.*;                // All classes (not subpackages)
import static java.lang.Math.PI;   // Static import
```

**Package Naming Convention:**
- Lowercase letters
- Reverse domain name: com.company.project

**Advantages:**
- ✅ Namespace management (avoid name conflicts)
- ✅ Access protection
- ✅ Code organization
- ✅ Reusability

**Package Hierarchy:**
```
com
 └── mycompany
      └── myapp
           ├── model
           ├── service
           └── controller
```

---

## 🔐 Access Modifiers

**4 Access Levels:**

| Modifier | Class | Package | Subclass | World |
|----------|-------|---------|----------|-------|
| **public** | ✅ | ✅ | ✅ | ✅ |
| **protected** | ✅ | ✅ | ✅ | ❌ |
| **default** | ✅ | ✅ | ❌ | ❌ |
| **private** | ✅ | ❌ | ❌ | ❌ |

### 1. Public
- Accessible everywhere
```java
public class MyClass {
    public int x;
}
```

### 2. Private
- Accessible only within same class
```java
class MyClass {
    private int x;
}
```

### 3. Protected
- Accessible within package and subclasses
```java
class MyClass {
    protected int x;
}
```

### 4. Default (Package-Private)
- Accessible within same package only
```java
class MyClass {
    int x;  // No modifier = default
}
```

**Class Level:**
- Can be `public` or default
- Cannot be `private` or `protected` (except inner classes)

**Method/Field Level:**
- Can be any of the four

**Best Practices:**
- Use most restrictive access level
- Fields: private
- Methods: public (API), private (internal)
- Classes: public (API), default (internal)

---

## 🎯 this & super Keywords

### this Keyword

**Uses of this:**

1. **Refer to current object**
```java
class Employee {
    int id;
    void setId(int id) {
        this.id = id;  // Distinguish parameter from field
    }
}
```

2. **Call current class method**
```java
class MyClass {
    void method1() { }
    void method2() {
        this.method1();  // Call method1
    }
}
```

3. **Call current class constructor**
```java
class MyClass {
    MyClass() {
        this(10);  // Call parameterized constructor
    }
    MyClass(int x) { }
}
```

4. **Return current object**
```java
class MyClass {
    MyClass getObject() {
        return this;
    }
}
```

5. **Pass as argument**
```java
class MyClass {
    void method(MyClass obj) { }
    void callMethod() {
        method(this);
    }
}
```

### super Keyword

**Uses of super:**

1. **Refer to parent class variable**
```java
class Parent {
    int x = 10;
}
class Child extends Parent {
    int x = 20;
    void display() {
        System.out.println(super.x);  // 10
        System.out.println(this.x);   // 20
    }
}
```

2. **Call parent class method**
```java
class Parent {
    void display() {
        System.out.println("Parent");
    }
}
class Child extends Parent {
    void display() {
        super.display();  // Call parent method
        System.out.println("Child");
    }
}
```

3. **Call parent class constructor**
```java
class Parent {
    Parent(int x) { }
}
class Child extends Parent {
    Child() {
        super(10);  // Must be first statement
    }
}
```

**Important Rules:**
- `this()` and `super()` must be first statement
- Cannot use both in same constructor
- `super()` implicitly called if not specified
- Can use `this` and `super` to access members

---

## 🎯 Quick Interview Points

1. **Static variable memory?** - Method area (class area), shared by all objects
2. **Can static method be overridden?** - No, it's method hiding not overriding
3. **Static block execution?** - Once, when class is loaded
4. **Can we override static method?** - No, can only hide
5. **Final variable?** - Constant, cannot be reassigned
6. **Final class examples?** - String, Integer, Math, System
7. **Final method?** - Cannot be overridden
8. **Blank final variable?** - Final variable without initialization, must initialize in constructor
9. **Inner class types?** - Member, Static nested, Local, Anonymous
10. **Static nested class access?** - Can access only static members of outer class
11. **Anonymous class?** - Class without name, one-time use
12. **Package purpose?** - Grouping, namespace management, access control
13. **Access modifiers?** - public, protected, default, private
14. **Most restrictive?** - private
15. **Protected access?** - Within package and subclasses
16. **Default access?** - Within package only
17. **this keyword?** - Refers to current object
18. **super keyword?** - Refers to parent class
19. **this() vs super()?** - this() calls current class constructor, super() calls parent
20. **this() or super() position?** - Must be first statement in constructor
21. **Can class be private?** - Only inner classes
22. **Static import?** - Import static members directly
23. **Multiple packages import?** - Yes, but not subpackages with *
24. **java.lang import?** - Imported by default
25. **Final with reference?** - Reference cannot change, but object content can
