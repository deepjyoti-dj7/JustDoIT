# 📝 Generics - Quick Interview Notes

## 🎯 Introduction to Generics

**What are Generics?**
- Parameterized types (type as parameter)
- Type safety at compile-time
- Avoid type casting
- Introduced in Java 5

**Without Generics:**
```java
List list = new ArrayList();
list.add("Hello");
list.add(10);
String s = (String) list.get(0);  // Manual casting
String s2 = (String) list.get(1); // ClassCastException at runtime!
```

**With Generics:**
```java
List<String> list = new ArrayList<>();
list.add("Hello");
list.add(10);  // ❌ Compile error - type safe!
String s = list.get(0);  // No casting needed
```

**Benefits:**
- ✅ Type safety (compile-time checking)
- ✅ No type casting
- ✅ Code reusability
- ✅ Compile-time errors vs runtime errors

**Generic Naming Conventions:**
- `E` - Element
- `K` - Key
- `V` - Value
- `N` - Number
- `T` - Type
- `S, U, V` - 2nd, 3rd, 4th types

---

## 📦 Generic Classes

**Creating Generic Class:**
```java
class Box<T> {
    private T value;
    
    public void set(T value) {
        this.value = value;
    }
    
    public T get() {
        return value;
    }
}

// Usage
Box<Integer> intBox = new Box<>();
intBox.set(10);
Integer value = intBox.get();  // No casting

Box<String> strBox = new Box<>();
strBox.set("Hello");
```

**Multiple Type Parameters:**
```java
class Pair<K, V> {
    private K key;
    private V value;
    
    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }
    
    public K getKey() { return key; }
    public V getValue() { return value; }
}

// Usage
Pair<String, Integer> pair = new Pair<>("Age", 25);
```

**Generic Interface:**
```java
interface Container<T> {
    void add(T item);
    T get();
}

class StringContainer implements Container<String> {
    private String item;
    
    public void add(String item) {
        this.item = item;
    }
    
    public String get() {
        return item;
    }
}
```

---

## 🔧 Generic Methods

**Generic Method Syntax:**
```java
class Util {
    // Generic static method
    public static <T> void printArray(T[] array) {
        for (T element : array) {
            System.out.println(element);
        }
    }
    
    // Generic instance method
    public <T> T getFirst(List<T> list) {
        return list.get(0);
    }
}

// Usage
Integer[] intArray = {1, 2, 3};
String[] strArray = {"A", "B", "C"};
Util.printArray(intArray);  // Works with Integer[]
Util.printArray(strArray);  // Works with String[]
```

**Generic Constructor:**
```java
class GenericClass<T> {
    private T value;
    
    <U> GenericClass(U arg) {
        value = (T) arg;
    }
}
```

**Method with Multiple Type Parameters:**
```java
class Util {
    public static <K, V> void printPair(K key, V value) {
        System.out.println(key + " = " + value);
    }
}

Util.printPair("Name", "John");
Util.printPair(1, "One");
```

---

## 🔒 Bounded Type Parameters

**Upper Bounded (extends):**
```java
// T must be Number or its subclass
class NumberBox<T extends Number> {
    private T value;
    
    public void set(T value) {
        this.value = value;
    }
    
    public double getDouble() {
        return value.doubleValue();  // Can call Number methods
    }
}

// Usage
NumberBox<Integer> intBox = new NumberBox<>();  // ✅ OK
NumberBox<Double> doubleBox = new NumberBox<>(); // ✅ OK
NumberBox<String> strBox = new NumberBox<>();   // ❌ Error
```

**Multiple Bounds:**
```java
// T must extend Number AND implement Comparable
class MyClass<T extends Number & Comparable<T>> {
    // Can use Number and Comparable methods
}
```

**Bounded Methods:**
```java
class Util {
    // Only Number and subclasses
    public static <T extends Number> double sum(T a, T b) {
        return a.doubleValue() + b.doubleValue();
    }
}

Util.sum(10, 20);        // ✅ OK
Util.sum(10.5, 20.5);   // ✅ OK
Util.sum("A", "B");     // ❌ Error
```

**Lower Bounded (super) - Only in wildcards:**
```java
List<? super Integer> list = new ArrayList<Number>();
```

---

## 🃏 Wildcards

**Types of Wildcards:**

### 1. Unbounded Wildcard (?)
```java
public static void printList(List<?> list) {
    for (Object obj : list) {
        System.out.println(obj);
    }
}

printList(new ArrayList<Integer>());
printList(new ArrayList<String>());
```

### 2. Upper Bounded Wildcard (? extends Type)
```java
// Can read as Number, cannot add
public static double sum(List<? extends Number> list) {
    double sum = 0;
    for (Number n : list) {
        sum += n.doubleValue();
    }
    return sum;
}

sum(Arrays.asList(1, 2, 3));        // ✅ List<Integer>
sum(Arrays.asList(1.5, 2.5));      // ✅ List<Double>
```

### 3. Lower Bounded Wildcard (? super Type)
```java
// Can add Integer, can only read as Object
public static void addNumbers(List<? super Integer> list) {
    list.add(10);     // ✅ Can add Integer
    list.add(20);     // ✅ Can add Integer
    // Integer n = list.get(0);  // ❌ Cannot guarantee type
    Object obj = list.get(0);    // ✅ Can read as Object
}

addNumbers(new ArrayList<Integer>());
addNumbers(new ArrayList<Number>());
addNumbers(new ArrayList<Object>());
```

**PECS Principle:**
- **Producer Extends** - Use `? extends T` when you only read
- **Consumer Super** - Use `? super T` when you only write

```java
// Producer - read from source
public void copy(List<? extends Number> source, 
                 List<? super Number> destination) {
    for (Number n : source) {
        destination.add(n);
    }
}
```

---

## 🗑️ Type Erasure

**What is Type Erasure?**
- Generics removed at runtime
- Replaced with Object or bound
- Ensures backward compatibility

**Before Compilation:**
```java
List<String> list = new ArrayList<>();
list.add("Hello");
String s = list.get(0);
```

**After Type Erasure:**
```java
List list = new ArrayList();
list.add("Hello");
String s = (String) list.get(0);  // Compiler adds cast
```

**Bounded Type Erasure:**
```java
// Before
class Box<T extends Number> {
    private T value;
}

// After erasure
class Box {
    private Number value;  // Replaced with bound
}
```

**Implications:**
1. **No runtime type information**
```java
List<String> list1 = new ArrayList<>();
List<Integer> list2 = new ArrayList<>();
list1.getClass() == list2.getClass();  // true (same class)
```

2. **Cannot create generic arrays**
```java
List<String>[] array = new List<String>[10];  // ❌ Error
```

3. **Cannot use instanceof with generics**
```java
if (list instanceof List<String>) { }  // ❌ Error
if (list instanceof List<?>) { }       // ✅ OK
```

---

## ⚠️ Generic Restrictions

**1. Cannot Instantiate Type Parameter:**
```java
class MyClass<T> {
    T obj = new T();  // ❌ Error
}
```

**2. Cannot Create Generic Array:**
```java
T[] array = new T[10];  // ❌ Error
List<String>[] array = new List<String>[10];  // ❌ Error
```

**3. Cannot Use with Primitives:**
```java
List<int> list = new ArrayList<>();  // ❌ Error
List<Integer> list = new ArrayList<>();  // ✅ Use wrapper
```

**4. Cannot Create Static Generic Fields:**
```java
class MyClass<T> {
    static T value;  // ❌ Error
}
```

**5. Cannot Use instanceof:**
```java
if (obj instanceof List<String>) { }  // ❌ Error
if (obj instanceof List<?>) { }       // ✅ OK
```

**6. Cannot Overload with Different Generic Types:**
```java
void method(List<String> list) { }
void method(List<Integer> list) { }  // ❌ Error - same erasure
```

**7. Cannot Throw or Catch Generic Exception:**
```java
class MyException<T> extends Exception { }  // ❌ Error
```

**8. Cannot Have Static Method with Class Type Parameter:**
```java
class MyClass<T> {
    static void method(T param) { }  // ❌ Error
    static <U> void method(U param) { }  // ✅ OK - method's own type
}
```

---

## 🎯 Quick Interview Points

1. **What are generics?** - Parameterized types for type safety
2. **Benefits of generics?** - Type safety, no casting, reusability, compile-time errors
3. **Type erasure?** - Generics removed at runtime, replaced with Object/bound
4. **Generic naming conventions?** - T (Type), E (Element), K (Key), V (Value)
5. **Can use primitives?** - No, use wrapper classes
6. **Upper bound syntax?** - `<T extends Type>`
7. **Lower bound syntax?** - `<? super Type>` (wildcards only)
8. **Unbounded wildcard?** - `<?>`
9. **PECS principle?** - Producer Extends, Consumer Super
10. **When to use `? extends`?** - Reading from structure (producer)
11. **When to use `? super`?** - Writing to structure (consumer)
12. **Can create generic array?** - No
13. **Can use instanceof with generics?** - Only with unbounded wildcard
14. **Multiple bounds syntax?** - `<T extends Class & Interface>`
15. **Class bound position?** - Must be first in multiple bounds
16. **Generic method declaration?** - `<T>` before return type
17. **Static generic method?** - Yes, with method's own type parameter
18. **Generic exception?** - Cannot create
19. **Runtime type info?** - No, due to type erasure
20. **List<?> vs List<Object>?** - List<?> is read-only, List<Object> can add Object
