# 📝 Interview Questions - Quick Reference

## 🎯 Core Java Questions

### **Q1: What is Java?**
**Answer:** Object-oriented, platform-independent, compiled to bytecode, runs on JVM

### **Q2: JDK vs JRE vs JVM?**
**Answer:**
- **JDK** - Development Kit (JRE + dev tools)
- **JRE** - Runtime Environment (JVM + libraries)
- **JVM** - Virtual Machine (executes bytecode)

### **Q3: How does Java achieve platform independence?**
**Answer:** Java code → Bytecode → JVM interprets for each platform

### **Q4: Why is Java not 100% OOP?**
**Answer:** Primitive types (int, boolean, etc.) are not objects

### **Q5: Can main() be overloaded?**
**Answer:** Yes, but JVM only calls `public static void main(String[] args)`

### **Q6: Why String is immutable?**
**Answer:** Security, String Pool, thread-safety, hashCode caching

### **Q7: String vs StringBuffer vs StringBuilder?**
**Answer:**
- **String** - Immutable
- **StringBuffer** - Mutable, thread-safe (synchronized)
- **StringBuilder** - Mutable, not thread-safe (faster)

### **Q8: == vs equals()?**
**Answer:**
- **==** - Reference comparison
- **equals()** - Value comparison

### **Q9: What is String Pool?**
**Answer:** Special memory area in heap for String literals to save memory

```java
String s1 = "hello";  // Pool
String s2 = "hello";  // Same pool reference
String s3 = new String("hello");  // Heap (not pool)

s1 == s2  // true
s1 == s3  // false
s1.equals(s3)  // true
```

### **Q10: What is final keyword?**
**Answer:**
- **final variable** - Constant
- **final method** - Cannot override
- **final class** - Cannot extend

---

## 💡 OOP Questions

### **Q11: Four Pillars of OOP?**
**Answer:**
1. **Encapsulation** - Data hiding
2. **Inheritance** - Code reuse
3. **Polymorphism** - Many forms
4. **Abstraction** - Hide complexity

### **Q12: Abstraction vs Encapsulation?**
**Answer:**
- **Abstraction** - Hide implementation details (what to do)
- **Encapsulation** - Hide data (how to do)

### **Q13: Interface vs Abstract Class?**
**Answer:**

| Feature | Interface | Abstract Class |
|---------|-----------|----------------|
| **Methods** | Only abstract (before Java 8) | Both abstract and concrete |
| **Variables** | public static final | Any access modifier |
| **Inheritance** | Multiple | Single |
| **Constructor** | No | Yes |
| **When** | Contract/capability | IS-A relationship |

### **Q14: Can interface have constructor?**
**Answer:** No

### **Q15: Can abstract class have constructor?**
**Answer:** Yes, called when subclass instantiated

### **Q16: Multiple inheritance in Java?**
**Answer:** Not through classes (diamond problem), but through interfaces

### **Q17: Method Overloading vs Overriding?**
**Answer:**

| Feature | Overloading | Overriding |
|---------|------------|------------|
| **Definition** | Same name, different params | Same signature in subclass |
| **When** | Compile-time | Runtime |
| **Polymorphism** | Static/Compile-time | Dynamic/Runtime |
| **Return type** | Can differ | Must be same or covariant |
| **Access** | Can differ | Cannot be more restrictive |

### **Q18: Can we override static method?**
**Answer:** No, it's method hiding (not overriding)

### **Q19: Can we override private method?**
**Answer:** No, private methods not inherited

### **Q20: super vs this?**
**Answer:**
- **this** - Current object reference
- **super** - Parent class reference

---

## ⚠️ Exception Handling Questions

### **Q21: Exception Hierarchy?**
**Answer:**
```
Throwable
├── Error (OutOfMemoryError, StackOverflowError)
└── Exception
    ├── RuntimeException (Unchecked)
    └── Other Exceptions (Checked)
```

### **Q22: Checked vs Unchecked Exception?**
**Answer:**
- **Checked** - Compile-time, must handle (IOException, SQLException)
- **Unchecked** - Runtime (NullPointerException, ArrayIndexOutOfBoundsException)

### **Q23: throw vs throws?**
**Answer:**
- **throw** - Throw exception explicitly
- **throws** - Declare exception in method signature

### **Q24: final, finally, finalize?**
**Answer:**
- **final** - Keyword (constant, no override, no extend)
- **finally** - Block (always executes)
- **finalize()** - Method (called before GC, deprecated)

### **Q25: Can we have try without catch?**
**Answer:** Yes, try-finally or try-with-resources

### **Q26: Can finally block be skipped?**
**Answer:** Yes, if System.exit() or JVM crash

### **Q27: throw exception from finally?**
**Answer:** Yes, but overrides exception from try/catch

---

## 🧵 String Questions

### **Q28: How to create immutable class?**
**Answer:**
1. Declare class final
2. Make fields private final
3. No setter methods
4. Initialize via constructor
5. Return copy of mutable objects

```java
public final class ImmutablePerson {
    private final String name;
    private final List<String> hobbies;
    
    public ImmutablePerson(String name, List<String> hobbies) {
        this.name = name;
        this.hobbies = new ArrayList<>(hobbies);  // Copy
    }
    
    public String getName() { return name; }
    
    public List<String> getHobbies() {
        return new ArrayList<>(hobbies);  // Return copy
    }
}
```

### **Q29: How does HashMap work internally?**
**Answer:**
- Array of buckets (Node[])
- Hash key → bucket index
- Collisions → Linked list (or tree if > 8)
- Load factor 0.75 → resize (double capacity)
- Java 8+: Tree for large buckets (O(log n) worst case)

### **Q30: How does HashSet work?**
**Answer:** Backed by HashMap, elements as keys, dummy Object as value

### **Q31: HashMap vs Hashtable?**
**Answer:**

| Feature | HashMap | Hashtable |
|---------|---------|-----------|
| **Synchronized** | No | Yes |
| **Null key** | One | No |
| **Null value** | Yes | No |
| **Performance** | Faster | Slower |
| **Legacy** | No | Yes |

### **Q32: ArrayList vs LinkedList?**
**Answer:**

| Operation | ArrayList | LinkedList |
|-----------|-----------|------------|
| **get()** | O(1) | O(n) |
| **add()** | O(1) amortized | O(1) |
| **add(index)** | O(n) | O(n) |
| **remove()** | O(n) | O(1) if position known |
| **Memory** | Less | More (node overhead) |

### **Q33: Comparable vs Comparator?**
**Answer:**
- **Comparable** - Natural ordering, compareTo(), in class
- **Comparator** - Custom ordering, compare(), external

### **Q34: Fail-fast vs Fail-safe?**
**Answer:**
- **Fail-fast** - ConcurrentModificationException (ArrayList, HashMap)
- **Fail-safe** - Copy data, no exception (CopyOnWriteArrayList)

### **Q35: Why override hashCode() with equals()?**
**Answer:** HashMap/HashSet use hashCode() for bucketing; equal objects must have same hashCode

---

## 🔧 Tricky Questions

### **Q36: Can constructor be private?**
**Answer:** Yes, for Singleton pattern

```java
class Singleton {
    private static Singleton instance;
    
    private Singleton() {}  // Private constructor
    
    public static Singleton getInstance() {
        if(instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

### **Q37: Can interface extend class?**
**Answer:** No, but interface can extend another interface

### **Q38: Can class extend interface?**
**Answer:** No, use `implements` not `extends`

### **Q39: Static block vs instance block?**
**Answer:**
- **Static block** - Executes once when class loaded
- **Instance block** - Executes before each constructor

```java
class Example {
    static {
        System.out.println("Static block");  // Once
    }
    
    {
        System.out.println("Instance block");  // Before each constructor
    }
    
    public Example() {
        System.out.println("Constructor");
    }
}
```

### **Q40: What happens if main() throws exception?**
**Answer:** Stack trace printed, program terminates

### **Q41: Can we serialize static variables?**
**Answer:** No, serialization is for object state, not class state

### **Q42: transient keyword?**
**Answer:** Exclude field from serialization

```java
class User implements Serializable {
    String username;
    transient String password;  // Not serialized
}
```

### **Q43: Marker interface?**
**Answer:** Empty interface to mark class (Serializable, Cloneable)

### **Q44: Functional interface?**
**Answer:** Interface with single abstract method (Runnable, Callable, Comparator)

### **Q45: What is Lambda?**
**Answer:** Anonymous function, concise syntax for functional interface

```java
// Anonymous class
Runnable r = new Runnable() {
    public void run() { System.out.println("Running"); }
};

// Lambda
Runnable r = () -> System.out.println("Running");
```

### **Q46: Stream vs Collection?**
**Answer:**
- **Collection** - Data storage
- **Stream** - Data processing pipeline

### **Q47: What is Optional?**
**Answer:** Container for nullable values, avoid NullPointerException

```java
Optional<String> opt = Optional.ofNullable(getName());
String name = opt.orElse("Default");
```

### **Q48: Shallow copy vs Deep copy?**
**Answer:**
- **Shallow** - Copy object, references shared
- **Deep** - Copy object and referenced objects

### **Q49: How to create thread?**
**Answer:**
1. Extend Thread class
2. Implement Runnable interface
3. Use Callable with ExecutorService
4. Lambda with Runnable

### **Q50: synchronized keyword?**
**Answer:** Ensures only one thread accesses method/block at a time

```java
// Synchronized method
public synchronized void method() {}

// Synchronized block
public void method() {
    synchronized(this) {
        // Critical section
    }
}
```

---

## 💻 Coding Problems

### **Q51: Reverse String**
```java
// Approach 1: StringBuilder
String reversed = new StringBuilder(str).reverse().toString();

// Approach 2: Manual
char[] chars = str.toCharArray();
int left = 0, right = chars.length - 1;
while(left < right) {
    char temp = chars[left];
    chars[left++] = chars[right];
    chars[right--] = temp;
}
return new String(chars);
```

### **Q52: Check Palindrome**
```java
public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while(left < right) {
        if(s.charAt(left++) != s.charAt(right--)) {
            return false;
        }
    }
    return true;
}
```

### **Q53: Find Duplicates in Array**
```java
// Using Set
Set<Integer> seen = new HashSet<>();
Set<Integer> duplicates = new HashSet<>();
for(int num : arr) {
    if(!seen.add(num)) {
        duplicates.add(num);
    }
}
```

### **Q54: Fibonacci**
```java
// Recursive
public int fib(int n) {
    if(n <= 1) return n;
    return fib(n-1) + fib(n-2);
}

// Iterative
public int fib(int n) {
    if(n <= 1) return n;
    int a = 0, b = 1;
    for(int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}
```

### **Q55: Remove Duplicates from Sorted Array**
```java
public int removeDuplicates(int[] nums) {
    if(nums.length == 0) return 0;
    int j = 0;
    for(int i = 1; i < nums.length; i++) {
        if(nums[i] != nums[j]) {
            nums[++j] = nums[i];
        }
    }
    return j + 1;
}
```

### **Q56: Two Sum**
```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for(int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if(map.containsKey(complement)) {
            return new int[] { map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[] {};
}
```

### **Q57: Anagram Check**
```java
public boolean isAnagram(String s, String t) {
    if(s.length() != t.length()) return false;
    
    char[] s1 = s.toCharArray();
    char[] s2 = t.toCharArray();
    Arrays.sort(s1);
    Arrays.sort(s2);
    return Arrays.equals(s1, s2);
}
```

### **Q58: Count Character Occurrences**
```java
public Map<Character, Integer> countChars(String s) {
    Map<Character, Integer> map = new HashMap<>();
    for(char c : s.toCharArray()) {
        map.put(c, map.getOrDefault(c, 0) + 1);
    }
    return map;
}
```

### **Q59: Find Missing Number (1 to N)**
```java
public int findMissing(int[] nums, int n) {
    int expectedSum = n * (n + 1) / 2;
    int actualSum = 0;
    for(int num : nums) {
        actualSum += num;
    }
    return expectedSum - actualSum;
}
```

### **Q60: Singleton Implementation**
```java
// Bill Pugh Singleton (Best)
public class Singleton {
    private Singleton() {}
    
    private static class SingletonHelper {
        private static final Singleton INSTANCE = new Singleton();
    }
    
    public static Singleton getInstance() {
        return SingletonHelper.INSTANCE;
    }
}

// Enum Singleton (Safest)
public enum Singleton {
    INSTANCE;
    
    public void doSomething() {
        // Business logic
    }
}
```

---

## 🎯 Quick Preparation Checklist

- [ ] OOP concepts (4 pillars)
- [ ] String, StringBuilder, StringBuffer
- [ ] Collections (List, Set, Map)
- [ ] HashMap internals
- [ ] Exception handling
- [ ] Multithreading basics
- [ ] Java 8 features (Lambda, Stream)
- [ ] SOLID principles
- [ ] Design patterns (Singleton, Factory)
- [ ] Common coding problems

**Remember:** Practice coding problems, explain your thinking process, and discuss trade-offs!
