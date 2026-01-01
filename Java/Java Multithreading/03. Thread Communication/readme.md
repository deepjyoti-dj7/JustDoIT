# 📝 Thread Communication - Quick Interview Notes

## ⏳ wait(), notify(), notifyAll()

**What are these methods?**
- Methods for inter-thread communication
- Allow threads to coordinate and signal each other
- Part of `Object` class (not Thread class)

**Methods:**
- `wait()` - Release lock and wait for notification
- `notify()` - Wake up ONE waiting thread
- `notifyAll()` - Wake up ALL waiting threads

**Rules:**
- ⚠️ **MUST** be called inside synchronized block/method
- ⚠️ **MUST** be called on the same object used for synchronization
- Releases the lock when waiting
- Reacquires lock before returning from wait()

**Pattern:**
```java
synchronized(object) {
    while(condition) {
        object.wait(); // Release lock and wait
    }
    // Do work
    object.notifyAll(); // Wake up waiting threads
}
```

**Why use while (not if) with wait()?**
- Prevents spurious wakeups
- Rechecks condition after being notified
- Handles multiple threads waiting

**notify() vs notifyAll():**
| Method | Behavior | When to Use |
|--------|----------|-------------|
| notify() | Wakes ONE thread | Single waiter scenario |
| notifyAll() | Wakes ALL threads | Multiple waiters, safer |

**Common Use Cases:**
- Producer-Consumer pattern
- Thread coordination
- Resource availability signaling

---

## 🔗 Join Method

**What is join()?**
- Makes current thread wait for another thread to complete
- Ensures sequential execution when needed

**Methods:**
```java
thread.join()              // Wait indefinitely
thread.join(millis)        // Wait max millis
thread.join(millis, nanos) // Wait max time with nanosecond precision
```

**Use Cases:**
```java
Thread t1 = new Thread(() -> { /* task */ });
t1.start();
t1.join(); // Main thread waits for t1 to complete
System.out.println("t1 completed");
```

**Common Scenarios:**
- Waiting for all tasks to complete
- Ensuring execution order
- Collecting results from multiple threads
- Cleanup operations

**Example - Wait for Multiple Threads:**
```java
Thread[] threads = new Thread[5];
for(int i = 0; i < 5; i++) {
    threads[i] = new Thread(() -> { /* work */ });
    threads[i].start();
}
for(Thread t : threads) {
    t.join(); // Wait for all
}
```

---

## 🔢 CountDownLatch

**What is CountDownLatch?**
- Synchronization aid that allows threads to wait until a set of operations complete
- One-time use (cannot be reset)
- Count decrements to zero

**Key Methods:**
```java
CountDownLatch latch = new CountDownLatch(3); // Count = 3

latch.countDown()    // Decrement count by 1
latch.await()        // Wait until count reaches 0
latch.await(timeout) // Wait with timeout
latch.getCount()     // Get current count
```

**Pattern:**
```java
int tasks = 3;
CountDownLatch latch = new CountDownLatch(tasks);

// Worker threads
for(int i = 0; i < tasks; i++) {
    new Thread(() -> {
        // Do work
        latch.countDown(); // Decrement
    }).start();
}

// Main thread
latch.await(); // Wait for all tasks to complete
```

**Use Cases:**
- Wait for multiple services to initialize
- Coordinate start of multiple threads
- Wait for batch processing completion
- Testing parallel operations

**Key Points:**
- ✅ Thread-safe
- ✅ Can have multiple waiters
- ❌ Cannot be reset (one-time use)
- ❌ Count cannot increase

---

## 🔄 CyclicBarrier

**What is CyclicBarrier?**
- Synchronization point where threads wait for each other
- All threads must reach barrier before any can proceed
- **Reusable** (unlike CountDownLatch)

**Key Methods:**
```java
CyclicBarrier barrier = new CyclicBarrier(3); // 3 parties
CyclicBarrier barrier = new CyclicBarrier(3, action); // With barrier action

barrier.await()        // Wait at barrier
barrier.await(timeout) // Wait with timeout
barrier.reset()        // Reset barrier
barrier.getParties()   // Get number of parties
```

**Pattern:**
```java
int threads = 3;
CyclicBarrier barrier = new CyclicBarrier(threads, () -> {
    System.out.println("All threads reached barrier!");
});

for(int i = 0; i < threads; i++) {
    new Thread(() -> {
        // Phase 1
        System.out.println("Phase 1 done");
        barrier.await(); // Wait for all
        
        // Phase 2
        System.out.println("Phase 2 done");
        barrier.await(); // Wait for all again
    }).start();
}
```

**CyclicBarrier vs CountDownLatch:**
| Feature | CyclicBarrier | CountDownLatch |
|---------|--------------|----------------|
| Reusable | ✅ Yes | ❌ No |
| Parties | Threads wait for each other | Threads wait for count=0 |
| Reset | Can reset | Cannot reset |
| Action | Can run action when reached | No action |
| Use Case | Iterative algorithms | One-time coordination |

**Use Cases:**
- Parallel algorithms with phases
- Multi-step simulations
- Game synchronization
- Iterative computations

---

## 🚦 Semaphore

**What is Semaphore?**
- Controls access to a resource pool
- Maintains a set of permits
- Thread acquires permit to access, releases when done

**Types:**
- **Binary Semaphore** - Permits = 1 (like mutex)
- **Counting Semaphore** - Permits > 1 (resource pool)

**Key Methods:**
```java
Semaphore sem = new Semaphore(3); // 3 permits
Semaphore sem = new Semaphore(3, true); // Fair ordering

sem.acquire()        // Acquire 1 permit (blocks if unavailable)
sem.acquire(n)       // Acquire n permits
sem.release()        // Release 1 permit
sem.release(n)       // Release n permits
sem.tryAcquire()     // Try to acquire (non-blocking)
sem.availablePermits() // Get available permits
```

**Pattern:**
```java
Semaphore sem = new Semaphore(3); // Max 3 threads

sem.acquire();
try {
    // Access limited resource
} finally {
    sem.release(); // ALWAYS release
}
```

**Use Cases:**
- **Connection pool** - Limit concurrent DB connections
- **Rate limiting** - Limit requests per second
- **Resource pool** - Limit access to resources
- **Thread pool** - Control concurrent threads

**Example - Database Connections:**
```java
Semaphore dbConnections = new Semaphore(10); // Max 10 connections

dbConnections.acquire();
try {
    // Use database connection
} finally {
    dbConnections.release();
}
```

---

## 🔀 Exchanger

**What is Exchanger?**
- Synchronization point where two threads exchange objects
- Useful for pipeline designs
- Thread-safe handoff between threads

**Key Method:**
```java
Exchanger<String> exchanger = new Exchanger<>();

String data = exchanger.exchange(myData); // Exchange data with other thread
```

**Pattern:**
```java
Exchanger<String> exchanger = new Exchanger<>();

// Thread 1 - Producer
new Thread(() -> {
    String produced = "Data from Producer";
    String received = exchanger.exchange(produced);
    System.out.println("Producer received: " + received);
}).start();

// Thread 2 - Consumer
new Thread(() -> {
    String produced = "Data from Consumer";
    String received = exchanger.exchange(produced);
    System.out.println("Consumer received: " + received);
}).start();
```

**Use Cases:**
- Producer-Consumer with bidirectional data flow
- Pipeline stages
- Data validation (compare results)
- Genetic algorithms (crossover)

**Key Points:**
- Blocks until both threads call exchange()
- Exactly 2 threads participate
- Thread-safe

---

## 📊 Phaser

**What is Phaser?**
- More flexible alternative to CyclicBarrier
- Supports dynamic registration/deregistration of parties
- Multiple phases of execution

**Key Methods:**
```java
Phaser phaser = new Phaser(3); // 3 parties

phaser.arriveAndAwaitAdvance() // Arrive and wait for others
phaser.arrive()                // Arrive but don't wait
phaser.arriveAndDeregister()   // Arrive and leave
phaser.register()              // Add a party
phaser.getPhase()              // Get current phase number
```

**Pattern:**
```java
Phaser phaser = new Phaser(3);

for(int i = 0; i < 3; i++) {
    new Thread(() -> {
        // Phase 0
        phaser.arriveAndAwaitAdvance();
        
        // Phase 1
        phaser.arriveAndAwaitAdvance();
        
        // Phase 2
        phaser.arriveAndAwaitAdvance();
    }).start();
}
```

**Phaser vs CyclicBarrier:**
| Feature | Phaser | CyclicBarrier |
|---------|--------|---------------|
| Parties | Dynamic | Fixed |
| Phases | Multiple | Single |
| Termination | Can terminate | Always reusable |
| Flexibility | High | Low |

**Use Cases:**
- Variable number of participants
- Multi-phase computations
- Complex synchronization scenarios
- Hierarchical phasers (tree structure)

---

## 🎯 Quick Comparison Table

| Mechanism | Purpose | Reusable | Parties |
|-----------|---------|----------|---------|
| wait/notify | Basic coordination | ✅ | Any |
| join() | Wait for completion | ❌ | 1-to-1 |
| CountDownLatch | Wait for N events | ❌ | Fixed |
| CyclicBarrier | Wait at sync point | ✅ | Fixed |
| Semaphore | Limit concurrent access | ✅ | Any |
| Exchanger | Exchange data | ✅ | 2 |
| Phaser | Multi-phase sync | ✅ | Dynamic |

---

## 🎯 Quick Interview Points

1. **wait() vs sleep()?** - wait() releases lock, sleep() doesn't. wait() needs synchronized, sleep() doesn't
2. **notify() vs notifyAll()?** - notify() wakes one, notifyAll() wakes all (safer)
3. **Why wait() in while loop?** - Prevents spurious wakeups, rechecks condition
4. **CountDownLatch vs CyclicBarrier?** - Latch is one-time, Barrier is reusable
5. **Semaphore use case?** - Resource pool (connection pool, rate limiting)
6. **join() purpose?** - Wait for thread to complete
7. **Exchanger threads?** - Exactly 2 threads exchange data
8. **Phaser advantage?** - Dynamic parties, multiple phases
9. **When use CyclicBarrier?** - Iterative parallel algorithms with phases
10. **Semaphore fairness?** - new Semaphore(n, true) for FIFO ordering
