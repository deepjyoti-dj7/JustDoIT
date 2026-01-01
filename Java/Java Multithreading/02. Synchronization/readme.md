# 📝 Synchronization - Quick Interview Notes

## 🏁 Race Conditions

**What is a Race Condition?**
- Occurs when multiple threads access shared data concurrently
- At least one thread modifies the data
- Final outcome depends on unpredictable thread timing/order

**Why Race Conditions Happen:**
1. **Non-atomic operations** - Operations with multiple steps (read-modify-write)
2. **Shared mutable state** - Multiple threads accessing same data
3. **No synchronization** - Lack of thread coordination
4. **Interleaved execution** - Thread scheduler switches between threads

**Classic Example:**
```java
count++; // NOT atomic! (read count, increment, write count)
// Thread 1 reads 0, Thread 2 reads 0
// Both increment to 1 and write 1
// Result: 1 (expected 2!)
```

**Solutions:**
- synchronized keyword
- volatile keyword
- Atomic variables
- Locks (ReentrantLock)

---

## 🔒 Synchronized Keyword

**What is Synchronized?**
- Provides mutual exclusion (only one thread executes at a time)
- Prevents race conditions
- Ensures visibility of changes across threads

**Types of Synchronization:**

### 1. Synchronized Instance Method
```java
public synchronized void method() { }
// Lock acquired on 'this' object
```

### 2. Synchronized Static Method
```java
public static synchronized void method() { }
// Lock acquired on Class object (ClassName.class)
```

### 3. Synchronized Block (Instance)
```java
synchronized(this) { }
synchronized(someObject) { }
// Lock on specific object
```

### 4. Synchronized Block (Class level)
```java
synchronized(ClassName.class) { }
// Lock on Class object
```

**Key Points:**
- Only one thread can execute synchronized method/block at a time
- Other threads wait (BLOCKED state)
- Automatic lock release on exception
- Reentrant (same thread can acquire same lock multiple times)

**Advantages:**
- ✅ Simple to use
- ✅ Automatic lock management
- ✅ Built into language

**Disadvantages:**
- ❌ No timeout option
- ❌ Can't interrupt waiting thread
- ❌ No fairness guarantee
- ❌ All-or-nothing (can't try to acquire)

---

## ⚡ Volatile Keyword

**What is Volatile?**
- Ensures variable is stored in main memory (not CPU cache)
- Guarantees visibility across threads
- Prevents instruction reordering

**When to Use:**
- **Flag variables** for thread communication
- **Status indicators** (running, stopped)
- **Double-checked locking** pattern

**What Volatile Does:**
- ✅ Guarantees visibility of changes
- ✅ Prevents caching in thread-local memory
- ✅ Establishes happens-before relationship

**What Volatile DOESN'T Do:**
- ❌ NOT atomic for compound operations (i++, check-then-act)
- ❌ NOT a replacement for synchronization

**Classic Use Case - Stop Flag:**
```java
private volatile boolean running = true;

public void run() {
    while(running) { /* work */ }
}

public void stop() {
    running = false; // Immediately visible to other threads
}
```

**Volatile vs Synchronized:**
| Feature | Volatile | Synchronized |
|---------|----------|--------------|
| Atomicity | ❌ Only reads/writes | ✅ All operations |
| Visibility | ✅ Yes | ✅ Yes |
| Performance | Faster | Slower |
| Blocking | Non-blocking | Blocking |
| Use Case | Simple flags | Compound operations |

---

## ⚛️ Atomic Variables

**What are Atomic Variables?**
- Lock-free, thread-safe operations using CAS (Compare-And-Swap)
- Part of `java.util.concurrent.atomic` package
- Better performance than synchronized

**Common Classes:**
- `AtomicInteger` - int values
- `AtomicLong` - long values
- `AtomicBoolean` - boolean values
- `AtomicReference` - object references
- `AtomicIntegerArray`, `AtomicLongArray`, `AtomicReferenceArray`

**Key Methods (AtomicInteger example):**
```java
AtomicInteger count = new AtomicInteger(0);

count.get()                    // Get current value
count.set(10)                  // Set value
count.incrementAndGet()        // ++count (returns new value)
count.getAndIncrement()        // count++ (returns old value)
count.decrementAndGet()        // --count
count.getAndDecrement()        // count--
count.addAndGet(5)             // count += 5
count.compareAndSet(0, 1)      // CAS: if current==0, set to 1
count.getAndUpdate(x -> x * 2) // Update with function
count.updateAndGet(x -> x * 2) // Update with function
```

**Advantages:**
- ✅ Thread-safe without locks
- ✅ Non-blocking (no lock contention)
- ✅ Better performance than synchronized
- ✅ Atomic compound operations

**When to Use:**
- Counters, sequence generators
- Flags that need atomic updates
- Single variable operations
- High-contention scenarios

---

## 🔐 Locks & ReentrantLock

**What is ReentrantLock?**
- More flexible alternative to synchronized
- Explicit lock/unlock control
- Part of `java.util.concurrent.locks` package

**Key Features:**
```java
Lock lock = new ReentrantLock();

lock.lock()                        // Acquire lock
lock.unlock()                      // Release lock
lock.tryLock()                     // Try to acquire (non-blocking)
lock.tryLock(timeout, TimeUnit)    // Try with timeout
lock.lockInterruptibly()           // Interruptible lock
lock.newCondition()                // Condition variable
```

**Basic Pattern:**
```java
Lock lock = new ReentrantLock();

lock.lock();
try {
    // Critical section
} finally {
    lock.unlock(); // ALWAYS unlock in finally!
}
```

**ReentrantLock vs Synchronized:**
| Feature | ReentrantLock | Synchronized |
|---------|---------------|--------------|
| Lock/Unlock | Explicit | Implicit |
| Try Lock | ✅ Yes | ❌ No |
| Timeout | ✅ Yes | ❌ No |
| Interruptible | ✅ Yes | ❌ No |
| Fairness | ✅ Yes | ❌ No |
| Multiple Conditions | ✅ Yes | ❌ No |
| Flexibility | High | Low |

**Fairness:**
```java
Lock fairLock = new ReentrantLock(true); // FIFO order
Lock unfairLock = new ReentrantLock();   // Default, better performance
```

**When to Use ReentrantLock:**
- Need timeout for lock acquisition
- Need to interrupt waiting threads
- Need fair lock ordering
- Need multiple condition variables
- Need to check if lock is held

---

## 📖 ReadWriteLock

**What is ReadWriteLock?**
- Allows multiple concurrent readers OR single writer
- Optimizes for read-heavy scenarios
- `ReadWriteLock` interface, `ReentrantReadWriteLock` implementation

**Key Concept:**
- **Read Lock** - Multiple threads can hold simultaneously
- **Write Lock** - Exclusive, blocks all other threads

**Usage:**
```java
ReadWriteLock rwLock = new ReentrantReadWriteLock();
Lock readLock = rwLock.readLock();
Lock writeLock = rwLock.writeLock();

// Reading
readLock.lock();
try {
    // Read data (multiple threads allowed)
} finally {
    readLock.unlock();
}

// Writing
writeLock.lock();
try {
    // Write data (exclusive access)
} finally {
    writeLock.unlock();
}
```

**Rules:**
- Multiple readers can acquire read lock simultaneously
- Only one writer can acquire write lock
- If write lock is held, no read locks allowed
- If read locks are held, write lock must wait

**When to Use:**
- Read operations >> Write operations
- Shared cache implementations
- Configuration management
- Resource pools

**Performance:**
- Better than synchronized for read-heavy workloads
- Overhead for write-heavy workloads

---

## 🎯 Quick Interview Points

1. **What is a race condition?** - Multiple threads accessing shared data, at least one writes, unpredictable results
2. **synchronized vs volatile?** - synchronized for compound ops, volatile for visibility only
3. **Is count++ thread-safe?** - No! It's read-modify-write (3 operations)
4. **AtomicInteger vs synchronized?** - AtomicInteger is lock-free, better performance for single variables
5. **ReentrantLock vs synchronized?** - ReentrantLock offers tryLock, timeout, fairness, but needs explicit unlock
6. **When to use volatile?** - Simple flags/status variables, not for compound operations
7. **ReadWriteLock benefit?** - Multiple concurrent readers, ideal for read-heavy scenarios
8. **What is CAS?** - Compare-And-Swap, atomic CPU operation used by Atomic classes
9. **Fairness in locks?** - FIFO ordering, prevents starvation but slower performance
10. **Always unlock in finally?** - Yes! Prevents deadlock if exception occurs

---

## 🔄 Comparison Table

| Mechanism | Atomicity | Visibility | Performance | Use Case |
|-----------|-----------|------------|-------------|----------|
| synchronized | ✅ | ✅ | Moderate | Compound operations |
| volatile | ❌ | ✅ | Fast | Simple flags |
| AtomicInteger | ✅ | ✅ | Fast | Counters, single var |
| ReentrantLock | ✅ | ✅ | Moderate | Complex scenarios |
| ReadWriteLock | ✅ | ✅ | Fast (reads) | Read-heavy workloads |
