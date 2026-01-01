# 📝 Memory Management - Quick Interview Notes

## 🏗️ Memory Structure

**JVM Memory Areas:**

```
┌─────────────────────────────────────────┐
│         JVM Memory Architecture         │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐ │
│  │          Method Area              │ │
│  │  (Class metadata, static vars)    │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │             Heap                  │ │
│  │  ┌──────────┬──────────────────┐ │ │
│  │  │  Young   │   Old (Tenured)  │ │ │
│  │  │  Gen     │   Generation     │ │ │
│  │  │ ┌─────┐  │                  │ │ │
│  │  │ │Eden │  │                  │ │ │
│  │  │ ├─────┤  │                  │ │ │
│  │  │ │S0│S1│  │                  │ │ │
│  │  │ └─────┘  │                  │ │ │
│  │  └──────────┴──────────────────┘ │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │          Stack (per thread)       │ │
│  │  - Local variables                │ │
│  │  - Method calls                   │ │
│  │  - References                     │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │          PC Register              │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │        Native Method Stack        │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Memory Areas:**

### 1️⃣ **Heap**
- **Shared** - All threads
- **Objects** - All objects and arrays
- **Garbage collected** - Yes
- **Size** - `-Xms` (initial), `-Xmx` (maximum)
- **OutOfMemoryError** - If full

### 2️⃣ **Stack**
- **Per thread** - Each thread has own stack
- **Local variables** - Primitive values, object references
- **Method frames** - Method calls
- **LIFO** - Last In First Out
- **Size** - `-Xss` (stack size)
- **StackOverflowError** - If too deep recursion

### 3️⃣ **Method Area (Metaspace in Java 8+)**
- **Class metadata** - Class structure, methods, fields
- **Static variables** - Class-level static data
- **Constant pool** - String literals, constants
- **Shared** - All threads
- **PermGen** (Java 7) - Fixed size, `-XX:MaxPermSize`
- **Metaspace** (Java 8+) - Native memory, auto-grows

### 4️⃣ **Program Counter (PC) Register**
- **Per thread** - Current instruction address
- **Native methods** - Undefined

### 5️⃣ **Native Method Stack**
- **Native methods** - C/C++ code via JNI
- **Per thread**

---

## ⚖️ Heap vs Stack

**Comparison Table:**

| Feature | Heap | Stack |
|---------|------|-------|
| **Storage** | Objects, arrays | Primitives, references, method calls |
| **Scope** | Global (all threads) | Local (per thread) |
| **Size** | Large (GB) | Small (MB) |
| **Speed** | Slower | Faster |
| **Lifetime** | Until GC | Until method returns |
| **Access** | Random | LIFO |
| **Managed By** | Garbage Collector | Automatic (scope-based) |
| **Error** | OutOfMemoryError | StackOverflowError |
| **Fragmentation** | Yes | No |

**Example:**
```java
public void method() {
    int x = 10;              // Stack: primitive
    int y = 20;              // Stack: primitive
    Person p = new Person(); // Stack: reference, Heap: object
    
    // Stack: x, y, p (reference)
    // Heap: Person object
}
// After method: Stack cleared, Heap object eligible for GC
```

**Memory Layout:**
```
Stack (Thread-1)          Heap
┌─────────────┐          ┌────────────────┐
│ method()    │          │ Person object  │
│ ┌─────────┐ │          │ - name         │
│ │ x = 10  │ │          │ - age          │
│ │ y = 20  │ │          └────────────────┘
│ │ p ──────┼─┼──────────> Person@1a2b
│ └─────────┘ │
└─────────────┘
```

---

## 🗑️ Garbage Collection (GC)

**What is GC?**
- **Automatic memory management** - Reclaim unused memory
- **Identifies garbage** - Objects no longer reachable
- **Frees memory** - Returns to heap
- **Prevents memory leaks** - (mostly)

**GC Roots:**
Objects reachable from:
- Local variables (stack)
- Static variables (method area)
- Active threads
- JNI references

**Mark and Sweep (Basic Algorithm):**
1. **Mark** - Mark all reachable objects
2. **Sweep** - Delete unreachable objects
3. **Compact** - Defragment memory (optional)

**Reachability:**
```java
Person p1 = new Person("A");  // Reachable
Person p2 = new Person("B");  // Reachable
p1 = null;                    // Person("A") now unreachable → GC eligible
p2 = new Person("C");         // Person("B") now unreachable → GC eligible
```

**Making Object GC Eligible:**
```java
// 1. Nulling reference
Person p = new Person();
p = null;  // GC eligible

// 2. Reassigning reference
p = new Person("A");
p = new Person("B");  // A is GC eligible

// 3. Object out of scope
public void method() {
    Person p = new Person();
}  // p is GC eligible after method

// 4. Island of isolation
class Node {
    Node next;
}
Node n1 = new Node();
Node n2 = new Node();
n1.next = n2;
n2.next = n1;
n1 = null;
n2 = null;  // Both eligible (circular reference OK)
```

**Requesting GC:**
```java
System.gc();           // Request GC (not guaranteed)
Runtime.getRuntime().gc();  // Same as above

// finalize() - Called before GC (deprecated)
@Override
protected void finalize() throws Throwable {
    // Cleanup code (avoid using)
}
```

---

## 🔄 GC Algorithms

### 1️⃣ **Serial GC** (`-XX:+UseSerialGC`)
- **Single thread** - Stop-the-world
- **Mark-Sweep-Compact**
- **Use case** - Small applications, single-core
- **Pause time** - Long

### 2️⃣ **Parallel GC** (`-XX:+UseParallelGC`)
- **Multiple threads** - Parallel mark & sweep
- **Throughput focused** - Maximize work, minimize GC time
- **Use case** - Batch processing, background tasks
- **Pause time** - Long but faster than Serial

### 3️⃣ **CMS (Concurrent Mark Sweep)** (`-XX:+UseConcMarkSweepGC`)
- **Low pause time** - GC runs concurrently
- **No compaction** - Fragmentation issue
- **Use case** - Interactive applications
- **Deprecated** - Java 9+

### 4️⃣ **G1 GC (Garbage First)** (`-XX:+UseG1GC`)
- **Default** - Java 9+
- **Regions** - Heap divided into regions
- **Predictable pauses** - Target pause time
- **Concurrent** - Most work concurrent
- **Use case** - Large heaps, balanced throughput/latency

### 5️⃣ **ZGC** (`-XX:+UseZGC`)
- **Ultra-low latency** - < 10ms pauses
- **Scalable** - TB heaps
- **Concurrent** - All phases concurrent
- **Use case** - Large heaps, ultra-low latency
- **Java 11+**

### 6️⃣ **Shenandoah** (`-XX:+UseShenandoahGC`)
- **Low pause time** - Concurrent compaction
- **Use case** - Low latency applications
- **Java 12+**

**GC Comparison:**

| GC | Pause Time | Throughput | Heap Size | Use Case |
|----|------------|------------|-----------|----------|
| **Serial** | Long | Low | Small | Single-core apps |
| **Parallel** | Medium | High | Medium-Large | Batch processing |
| **G1** | Short | Medium | Large | Balanced |
| **ZGC** | Very Short | Medium | Very Large | Ultra-low latency |
| **Shenandoah** | Very Short | Medium | Large | Low latency |

---

## 🔍 Generational GC

**Concept:** Most objects die young (weak generational hypothesis)

**Generations:**

### **Young Generation**
- **Eden** - New objects created here
- **Survivor Spaces (S0, S1)** - Objects that survive minor GC
- **Minor GC** - Frequent, fast, short pauses

### **Old Generation (Tenured)**
- Long-lived objects
- **Major GC (Full GC)** - Infrequent, slow, long pauses

**Object Lifecycle:**
```
new Object() → Eden → S0 → S1 → S0 → ... → Old Gen
              (Minor GC cycles)
```

**Age Threshold:** After surviving N minor GCs (default 15), promoted to Old Gen

**GC Process:**
```
1. New objects → Eden
2. Eden full → Minor GC
3. Live objects → Survivor Space (S0)
4. Next Minor GC → Live objects → Other Survivor (S1)
5. Flip S0 ↔ S1
6. After age threshold → Old Gen
7. Old Gen full → Major GC
```

**JVM Flags:**
```bash
-Xms2g              # Initial heap size
-Xmx4g              # Maximum heap size
-Xmn1g              # Young generation size
-XX:NewRatio=2      # Old:Young ratio
-XX:SurvivorRatio=8 # Eden:Survivor ratio
-XX:MaxTenuringThreshold=15  # Age before promotion
```

---

## 💧 Memory Leaks

**What is Memory Leak?**
- Objects no longer used but **still referenced**
- Cannot be garbage collected
- Heap memory **gradually fills up**
- Eventually **OutOfMemoryError**

**Common Causes:**

### 1️⃣ **Unclosed Resources**
```java
// BAD
public void readFile() {
    FileInputStream fis = new FileInputStream("file.txt");
    // ... use fis
    // fis not closed → leak
}

// GOOD
public void readFile() {
    try (FileInputStream fis = new FileInputStream("file.txt")) {
        // ... use fis
    }  // Auto-closed
}
```

### 2️⃣ **Static Collections**
```java
// BAD
public class Cache {
    private static List<Object> cache = new ArrayList<>();
    
    public void add(Object obj) {
        cache.add(obj);  // Never removed → leak
    }
}

// GOOD - Use WeakHashMap or size limit
private static Map<Key, Value> cache = new WeakHashMap<>();
```

### 3️⃣ **Inner Classes**
```java
// BAD
public class Outer {
    private byte[] data = new byte[1000000];
    
    public Inner getInner() {
        return new Inner();  // Holds reference to Outer
    }
    
    class Inner {  // Non-static inner class
        // Implicitly holds reference to Outer
    }
}

// GOOD - Use static
static class Inner {
    // No reference to Outer
}
```

### 4️⃣ **Listeners Not Removed**
```java
// BAD
button.addActionListener(new ActionListener() {
    public void actionPerformed(ActionEvent e) {
        // ...
    }
});
// Listener not removed → leak

// GOOD
ActionListener listener = new ActionListener() { ... };
button.addActionListener(listener);
// ...
button.removeActionListener(listener);
```

### 5️⃣ **ThreadLocal**
```java
// BAD
ThreadLocal<Connection> threadLocal = new ThreadLocal<>();
threadLocal.set(connection);
// Not removed → leak in thread pool

// GOOD
try {
    threadLocal.set(connection);
    // ... use
} finally {
    threadLocal.remove();  // Clean up
}
```

**Detecting Memory Leaks:**
```bash
# Heap dump
jmap -dump:live,format=b,file=heap.bin <pid>

# Memory analysis
jvisualvm
jconsole
Eclipse MAT (Memory Analyzer Tool)
```

---

## 🔗 Reference Types

**Reference Hierarchy:**
```
Strong → Soft → Weak → Phantom
(Strong)   (GC if memory low)   (GC anytime)   (After finalization)
```

### 1️⃣ **Strong Reference** (Default)
```java
Person p = new Person();  // Strong reference
// Object NOT GC'd while reference exists
```

### 2️⃣ **Soft Reference** (`java.lang.ref.SoftReference`)
```java
SoftReference<Person> softRef = new SoftReference<>(new Person());
Person p = softRef.get();  // May be null if GC'd

// GC'd only if memory low
// Use case: Caches
```

### 3️⃣ **Weak Reference** (`java.lang.ref.WeakReference`)
```java
WeakReference<Person> weakRef = new WeakReference<>(new Person());
Person p = weakRef.get();  // May be null

// GC'd in next GC cycle (if no strong ref)
// Use case: WeakHashMap
```

### 4️⃣ **Phantom Reference** (`java.lang.ref.PhantomReference`)
```java
ReferenceQueue<Person> queue = new ReferenceQueue<>();
PhantomReference<Person> phantomRef = new PhantomReference<>(new Person(), queue);
Person p = phantomRef.get();  // Always null

// GC'd after finalization
// Use case: Post-GC cleanup
```

**WeakHashMap Example:**
```java
Map<Key, Value> cache = new WeakHashMap<>();
Key key = new Key();
cache.put(key, value);

key = null;  // Key is GC eligible
// Entry automatically removed from map after GC
```

**Use Cases:**

| Type | Use Case | GC Behavior |
|------|----------|-------------|
| **Strong** | Normal objects | Never (while referenced) |
| **Soft** | Caches | If memory low |
| **Weak** | Canonicalizing mappings | Next GC (if no strong ref) |
| **Phantom** | Post-GC cleanup | After finalization |

---

## 🎯 Quick Interview Points

1. **JVM memory areas?** - Heap, Stack, Method Area, PC Register, Native Method Stack
2. **Heap shared?** - Yes, all threads
3. **Stack shared?** - No, per thread
4. **Where objects stored?** - Heap
5. **Where local variables?** - Stack
6. **Where static variables?** - Method Area (Metaspace)
7. **Heap size flags?** - -Xms (initial), -Xmx (maximum)
8. **Stack size flag?** - -Xss
9. **PermGen vs Metaspace?** - PermGen: Java 7 (fixed), Metaspace: Java 8+ (auto-grows, native)
10. **OutOfMemoryError when?** - Heap full
11. **StackOverflowError when?** - Stack full (deep recursion)
12. **What is GC?** - Automatic memory management
13. **GC roots?** - Local variables, static variables, active threads, JNI refs
14. **Mark and Sweep?** - Mark reachable, sweep unreachable
15. **System.gc() guaranteed?** - No, just a request
16. **finalize() use?** - Cleanup before GC (deprecated, avoid)
17. **Generational hypothesis?** - Most objects die young
18. **Young generation parts?** - Eden, S0, S1
19. **Minor vs Major GC?** - Minor: Young Gen (fast), Major: Old Gen (slow)
20. **Default GC Java 9+?** - G1 GC
21. **Memory leak definition?** - Referenced but unused objects
22. **Common leak causes?** - Unclosed resources, static collections, listeners
23. **Strong reference?** - Normal reference, never GC'd while referenced
24. **Weak reference?** - GC'd in next cycle if no strong ref
25. **WeakHashMap use?** - Cache with automatic cleanup
