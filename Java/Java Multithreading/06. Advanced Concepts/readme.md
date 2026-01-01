# 📝 Advanced Concepts - Quick Interview Notes

## 🧵 ThreadLocal

**What is ThreadLocal?**
- Provides thread-local variables
- Each thread has its own independent copy
- No synchronization needed
- Data isolation between threads

**Basic Usage:**
```java
private static ThreadLocal<Integer> threadLocal = new ThreadLocal<>();

// Set value
threadLocal.set(100);

// Get value
Integer value = threadLocal.get();

// Remove value
threadLocal.remove(); // IMPORTANT: Prevent memory leaks
```

**With Initial Value:**
```java
private static ThreadLocal<Integer> threadLocal = ThreadLocal.withInitial(() -> 0);
// OR
private static ThreadLocal<Integer> threadLocal = new ThreadLocal<>() {
    @Override
    protected Integer initialValue() {
        return 0;
    }
};
```

**Use Cases:**
- **User context** - Store user session/authentication info
- **Database connections** - Per-thread connection
- **Date formatters** - SimpleDateFormat is not thread-safe
- **Request context** - Web request data
- **Transaction context** - Current transaction info

**Example - SimpleDateFormat:**
```java
private static ThreadLocal<SimpleDateFormat> dateFormat = 
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

String formatted = dateFormat.get().format(new Date());
```

**Memory Leak Prevention:**
```java
try {
    threadLocal.set(value);
    // Use value
} finally {
    threadLocal.remove(); // Always remove to prevent leaks!
}
```

**InheritableThreadLocal:**
```java
ThreadLocal<String> inheritableThreadLocal = new InheritableThreadLocal<>();
// Child threads inherit value from parent thread
```

**Advantages:**
- ✅ No synchronization overhead
- ✅ Thread isolation
- ✅ Simple API

**Disadvantages:**
- ❌ Memory leaks if not removed (especially in thread pools)
- ❌ Hidden dependencies
- ❌ Testing difficulties

---

## ☠️ Deadlock

**What is Deadlock?**
- Two or more threads blocked forever, waiting for each other
- Circular dependency in resource acquisition
- Program hangs indefinitely

**Coffman Conditions (all 4 required for deadlock):**
1. **Mutual Exclusion** - Resources cannot be shared
2. **Hold and Wait** - Thread holds resources while waiting for others
3. **No Preemption** - Resources cannot be forcibly taken
4. **Circular Wait** - Circular chain of threads waiting for resources

**Classic Deadlock Example:**
```java
Object lock1 = new Object();
Object lock2 = new Object();

// Thread 1
synchronized(lock1) {
    synchronized(lock2) { } // Waits for lock2
}

// Thread 2
synchronized(lock2) {
    synchronized(lock1) { } // Waits for lock1
}
// DEADLOCK: T1 holds lock1 waits for lock2, T2 holds lock2 waits for lock1
```

**Prevention Strategies:**

### 1. Lock Ordering
Always acquire locks in same order
```java
// Both threads acquire in same order
synchronized(lock1) {
    synchronized(lock2) {
        // Safe!
    }
}
```

### 2. Lock Timeout (ReentrantLock)
```java
if(lock.tryLock(1, TimeUnit.SECONDS)) {
    try {
        // Critical section
    } finally {
        lock.unlock();
    }
} else {
    // Handle timeout
}
```

### 3. Deadlock Detection
- Use `jstack` or JConsole to detect deadlocks
- Monitor thread dumps

### 4. Avoid Nested Locks
- Minimize lock nesting
- Use single lock when possible

### 5. Use Higher-Level Constructs
- Use concurrent collections
- Use ExecutorService
- Avoid manual locking

**Detection:**
```bash
jstack <pid>  # Thread dump showing deadlock
jconsole      # GUI tool to detect deadlocks
```

---

## 🔄 Livelock & Starvation

### Livelock

**What is Livelock?**
- Threads are active but making no progress
- Continuously changing state in response to each other
- Like two people trying to pass each other in hallway

**Example:**
```java
// Both threads keep backing off and retrying
while(!lock.tryLock()) {
    // Back off, then retry
    Thread.sleep(random.nextInt(100));
}
```

**Prevention:**
- Random delays/backoff
- Different priorities
- Proper coordination

### Starvation

**What is Starvation?**
- Thread unable to gain access to resources
- Continuously denied by other threads
- Usually due to thread priority or unfair scheduling

**Causes:**
- Low-priority threads never scheduled
- Unfair locks (some threads always win)
- Long-running high-priority threads

**Prevention:**
- Fair locks: `new ReentrantLock(true)`
- Avoid extreme priority differences
- Time limits on resource holding
- Use fair scheduling

**Comparison:**
| Issue | Threads Active? | Progress? | Solution |
|-------|----------------|-----------|----------|
| Deadlock | ❌ Blocked | ❌ No | Lock ordering |
| Livelock | ✅ Running | ❌ No | Random backoff |
| Starvation | ⚠️ Some active | ⚠️ Some make progress | Fair locks |

---

## 🔒 Thread Safety

**What is Thread Safety?**
- Code behaves correctly when accessed by multiple threads
- No race conditions or data corruption
- Proper synchronization

**Levels of Thread Safety:**

### 1. Immutable
- Cannot be modified after creation
- Inherently thread-safe
```java
final class ImmutableClass {
    private final int value;
    public ImmutableClass(int value) { this.value = value; }
    public int getValue() { return value; }
}
```

### 2. Thread-Safe
- Safe for concurrent access
- Internal synchronization
```java
ConcurrentHashMap, AtomicInteger, StringBuffer
```

### 3. Conditionally Thread-Safe
- Thread-safe for individual operations
- Need external sync for compound operations
```java
Collections.synchronizedMap() // Need sync for iteration
```

### 4. Not Thread-Safe
- No synchronization
- Need external synchronization
```java
ArrayList, HashMap, SimpleDateFormat
```

**Making Code Thread-Safe:**

### 1. Synchronization
```java
public synchronized void method() { }
```

### 2. Volatile
```java
private volatile boolean flag;
```

### 3. Atomic Variables
```java
private AtomicInteger count = new AtomicInteger();
```

### 4. Concurrent Collections
```java
Map<K,V> map = new ConcurrentHashMap<>();
```

### 5. Immutability
```java
final class Immutable { /* no setters */ }
```

### 6. ThreadLocal
```java
ThreadLocal<SimpleDateFormat> dateFormat = ThreadLocal.withInitial(...);
```

**Best Practices:**
- Prefer immutability
- Minimize shared mutable state
- Use concurrent collections
- Synchronize compound operations
- Document thread safety guarantees

---

## ⚡ Happens-Before Relationship

**What is Happens-Before?**
- Guarantee that memory writes by one thread are visible to other threads
- Establishes ordering between operations
- Prevents instruction reordering

**Happens-Before Rules:**

### 1. Program Order Rule
Within a thread, each action happens-before every subsequent action

### 2. Monitor Lock Rule
Unlock on a monitor happens-before every subsequent lock on that monitor
```java
synchronized(obj) { x = 1; } // Write
synchronized(obj) { int y = x; } // Read sees x = 1
```

### 3. Volatile Variable Rule
Write to volatile happens-before every subsequent read
```java
volatile int x = 0;
x = 1;           // Write
int y = x;       // Read sees x = 1
```

### 4. Thread Start Rule
Thread.start() happens-before any action in started thread
```java
int x = 1;
thread.start();  // Thread sees x = 1
```

### 5. Thread Join Rule
All actions in thread happen-before thread.join() returns
```java
thread.start();
thread.join();   // Sees all changes made by thread
```

### 6. Transitivity
If A happens-before B, and B happens-before C, then A happens-before C

**Why Important?**
- Ensures visibility guarantees
- Prevents unexpected behavior
- Foundation of Java Memory Model

---

## 🧠 Java Memory Model

**What is Java Memory Model (JMM)?**
- Defines how threads interact through memory
- Specifies visibility guarantees
- Rules for reordering operations

**Memory Architecture:**
```
Thread 1          Thread 2
[Local Cache]     [Local Cache]
      ↓                ↓
      [Main Memory (Heap)]
```

**Key Concepts:**

### 1. Visibility
Changes made by one thread may not be visible to others
```java
// Without volatile
private boolean flag = false;
// Thread 2 may never see flag = true
```

### 2. Atomicity
Operations may not be atomic
```java
long x = 0;  // NOT atomic on 32-bit JVM
x++;         // NOT atomic (read-modify-write)
```

### 3. Ordering
JVM may reorder instructions for optimization
```java
int x = 0, y = 0;
// Thread 1
x = 1;
y = 1;
// May be reordered to: y = 1; x = 1;
```

**Guarantees:**
- `volatile` ensures visibility and ordering
- `synchronized` ensures visibility, atomicity, ordering
- `final` fields visible after construction

**Safe Publication:**
```java
// Safe publication patterns
1. Static initializer
2. volatile field
3. final field
4. Properly synchronized
```

---

## 👻 Daemon Threads

**What are Daemon Threads?**
- Background service threads
- JVM exits when only daemon threads remain
- Don't prevent JVM shutdown

**Creating Daemon Thread:**
```java
Thread thread = new Thread(() -> {
    while(true) {
        // Background work
    }
});
thread.setDaemon(true); // MUST set before start()
thread.start();
```

**Characteristics:**
- JVM doesn't wait for daemon threads to finish
- Used for background tasks
- Low priority, service threads

**Common Daemon Threads:**
- Garbage Collector
- Finalizer thread
- Signal dispatcher
- Reference handler

**User Thread vs Daemon Thread:**
| Feature | User Thread | Daemon Thread |
|---------|-------------|---------------|
| JVM Exit | Waits | Doesn't wait |
| Priority | Normal | Low |
| Purpose | Main work | Background service |
| Default | User | User (unless parent is daemon) |

**Use Cases:**
- Background monitoring
- Periodic cleanup
- Logging
- Cache management
- Health checks

**Important:**
```java
thread.setDaemon(true); // Must be before start()
// After start() throws IllegalThreadStateException
```

---

## 🎯 Quick Interview Points

1. **ThreadLocal use case?** - Per-thread context (user session, DB connection, SimpleDateFormat)
2. **ThreadLocal memory leak?** - Yes, if not removed in thread pools. Always call remove()
3. **Deadlock conditions?** - Mutual exclusion, Hold & wait, No preemption, Circular wait (all 4 needed)
4. **Prevent deadlock?** - Lock ordering, timeout, avoid nested locks
5. **Livelock vs Deadlock?** - Livelock threads are active but no progress, Deadlock threads blocked
6. **Starvation cause?** - Unfair scheduling, low priority, never gets resources
7. **Thread safety levels?** - Immutable, Thread-safe, Conditionally safe, Not safe
8. **Happens-before?** - Memory visibility guarantee, prevents reordering
9. **Volatile guarantee?** - Visibility and ordering, NOT atomicity
10. **Daemon thread?** - Background service thread, JVM exits without waiting
11. **When setDaemon()?** - Before start(), else IllegalThreadStateException
12. **Java Memory Model?** - Defines thread interaction through memory, visibility rules

---

## 📊 Quick Reference

| Concept | Purpose | Key Point |
|---------|---------|-----------|
| ThreadLocal | Per-thread data | Always remove() to prevent leaks |
| Deadlock | Circular waiting | Use lock ordering |
| Livelock | Active but no progress | Random backoff |
| Starvation | Never gets resources | Fair locks |
| Happens-Before | Visibility guarantee | Ensures memory consistency |
| JMM | Memory interaction rules | Visibility, atomicity, ordering |
| Daemon Thread | Background service | JVM doesn't wait for them |
