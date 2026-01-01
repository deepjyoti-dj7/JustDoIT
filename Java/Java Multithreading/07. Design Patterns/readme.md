# 📝 Design Patterns - Quick Interview Notes

## ⚡ Producer-Consumer Pattern

**What is Producer-Consumer?**
- Classic concurrency pattern
- Producers create data → shared buffer → Consumers process data
- Decouples production from consumption
- Handles different processing speeds

**Components:**
1. **Producer** - Creates/generates data
2. **Consumer** - Processes data
3. **Bounded Buffer** - Shared queue between them

**Implementations:**

### 1. Using wait() and notify()
```java
class ProducerConsumer {
    private Queue<Integer> queue = new LinkedList<>();
    private final int CAPACITY = 5;
    private final Object lock = new Object();
    
    public void produce() throws InterruptedException {
        int value = 0;
        while(true) {
            synchronized(lock) {
                while(queue.size() == CAPACITY) {
                    lock.wait(); // Queue full, wait
                }
                queue.add(value++);
                lock.notifyAll(); // Notify consumers
            }
        }
    }
    
    public void consume() throws InterruptedException {
        while(true) {
            synchronized(lock) {
                while(queue.isEmpty()) {
                    lock.wait(); // Queue empty, wait
                }
                int value = queue.poll();
                lock.notifyAll(); // Notify producers
            }
        }
    }
}
```

### 2. Using BlockingQueue (Recommended)
```java
class ProducerConsumer {
    private BlockingQueue<Integer> queue = new ArrayBlockingQueue<>(5);
    
    public void produce() throws InterruptedException {
        int value = 0;
        while(true) {
            queue.put(value++); // Blocks if full
        }
    }
    
    public void consume() throws InterruptedException {
        while(true) {
            int value = queue.take(); // Blocks if empty
            // Process value
        }
    }
}
```

### 3. Using Semaphore
```java
class ProducerConsumer {
    private Queue<Integer> queue = new LinkedList<>();
    private Semaphore empty = new Semaphore(5);  // Empty slots
    private Semaphore full = new Semaphore(0);   // Full slots
    private Semaphore mutex = new Semaphore(1);  // Mutual exclusion
    
    public void produce() throws InterruptedException {
        int value = 0;
        while(true) {
            empty.acquire();     // Acquire empty slot
            mutex.acquire();     // Lock
            queue.add(value++);
            mutex.release();     // Unlock
            full.release();      // Signal full slot
        }
    }
    
    public void consume() throws InterruptedException {
        while(true) {
            full.acquire();      // Acquire full slot
            mutex.acquire();     // Lock
            int value = queue.poll();
            mutex.release();     // Unlock
            empty.release();     // Signal empty slot
        }
    }
}
```

**Use Cases:**
- Task processing systems
- Message queues (Kafka, RabbitMQ)
- Logging systems
- ETL pipelines
- Web server request handling

---

## 📖 Reader-Writer Pattern

**What is Reader-Writer?**
- Multiple readers OR single writer can access resource
- Optimizes for read-heavy scenarios
- Prevents data inconsistency

**Rules:**
- Multiple readers can read simultaneously
- Only one writer can write (exclusive access)
- No readers allowed when writer is writing
- No writer allowed when readers are reading

**Implementation using ReadWriteLock:**
```java
class ReadWriteCache {
    private final Map<String, String> cache = new HashMap<>();
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final Lock readLock = rwLock.readLock();
    private final Lock writeLock = rwLock.writeLock();
    
    public String read(String key) {
        readLock.lock();
        try {
            return cache.get(key);
        } finally {
            readLock.unlock();
        }
    }
    
    public void write(String key, String value) {
        writeLock.lock();
        try {
            cache.put(key, value);
        } finally {
            writeLock.unlock();
        }
    }
}
```

**Implementation using Semaphore:**
```java
class ReaderWriter {
    private Semaphore resourceAccess = new Semaphore(1);
    private Semaphore readerCountAccess = new Semaphore(1);
    private int readerCount = 0;
    
    public void startRead() throws InterruptedException {
        readerCountAccess.acquire();
        readerCount++;
        if(readerCount == 1) {
            resourceAccess.acquire(); // First reader locks
        }
        readerCountAccess.release();
    }
    
    public void endRead() throws InterruptedException {
        readerCountAccess.acquire();
        readerCount--;
        if(readerCount == 0) {
            resourceAccess.release(); // Last reader unlocks
        }
        readerCountAccess.release();
    }
    
    public void startWrite() throws InterruptedException {
        resourceAccess.acquire(); // Exclusive access
    }
    
    public void endWrite() {
        resourceAccess.release();
    }
}
```

**Variants:**
- **Reader Preference** - Readers prioritized (may starve writers)
- **Writer Preference** - Writers prioritized (may starve readers)
- **Fair** - FIFO order

**Use Cases:**
- Caching systems
- Configuration management
- Database systems
- Shared resources with frequent reads

---

## 🏊 Thread Pool Pattern

**What is Thread Pool?**
- Pool of reusable worker threads
- Tasks submitted to queue
- Workers pick and execute tasks
- Avoids thread creation overhead

**Components:**
1. **Thread Pool** - Fixed number of worker threads
2. **Task Queue** - Holds pending tasks
3. **Worker Threads** - Execute tasks from queue

**Implementation:**
```java
class SimpleThreadPool {
    private final BlockingQueue<Runnable> taskQueue;
    private final List<WorkerThread> workers;
    private volatile boolean shutdown = false;
    
    public SimpleThreadPool(int numThreads, int queueSize) {
        taskQueue = new ArrayBlockingQueue<>(queueSize);
        workers = new ArrayList<>();
        
        for(int i = 0; i < numThreads; i++) {
            WorkerThread worker = new WorkerThread();
            workers.add(worker);
            worker.start();
        }
    }
    
    public void submit(Runnable task) throws InterruptedException {
        if(shutdown) throw new IllegalStateException("Pool is shutdown");
        taskQueue.put(task);
    }
    
    public void shutdown() {
        shutdown = true;
        for(WorkerThread worker : workers) {
            worker.interrupt();
        }
    }
    
    private class WorkerThread extends Thread {
        public void run() {
            while(!shutdown) {
                try {
                    Runnable task = taskQueue.take();
                    task.run();
                } catch(InterruptedException e) {
                    break;
                }
            }
        }
    }
}
```

**Using ExecutorService (Recommended):**
```java
ExecutorService pool = Executors.newFixedThreadPool(10);
pool.submit(() -> { /* task */ });
pool.shutdown();
```

**Benefits:**
- ✅ Thread reuse (no creation overhead)
- ✅ Resource control (limit concurrent threads)
- ✅ Task queue management
- ✅ Better performance

---

## 🔮 Future Pattern

**What is Future Pattern?**
- Placeholder for result of asynchronous computation
- Get result when ready
- Non-blocking submission, blocking retrieval

**Implementation:**
```java
// Using Callable and Future
ExecutorService executor = Executors.newFixedThreadPool(3);

Callable<Integer> task = () -> {
    Thread.sleep(2000);
    return 42;
};

Future<Integer> future = executor.submit(task);

// Do other work while task executes
System.out.println("Doing other work...");

// Get result (blocks if not ready)
Integer result = future.get();
System.out.println("Result: " + result);

executor.shutdown();
```

**CompletableFuture (Advanced):**
```java
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    // Async computation
    return "Result";
});

// Non-blocking callbacks
future.thenAccept(result -> System.out.println(result));
future.thenApply(s -> s.toUpperCase());
future.exceptionally(ex -> "Error: " + ex.getMessage());
```

**Use Cases:**
- Asynchronous API calls
- Parallel computations
- Long-running operations
- Non-blocking I/O

---

## 🔒 Double-Checked Locking

**What is Double-Checked Locking?**
- Optimization for lazy initialization in singleton
- Reduces synchronization overhead
- Checks instance twice (before and inside synchronized)

**Correct Implementation:**
```java
class Singleton {
    private static volatile Singleton instance; // MUST be volatile
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        if(instance == null) {               // First check (no lock)
            synchronized(Singleton.class) {
                if(instance == null) {       // Second check (with lock)
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

**Why volatile is Essential:**
Without volatile, another thread may see partially constructed object due to instruction reordering
```java
instance = new Singleton();
// Can be reordered to:
// 1. Allocate memory
// 2. instance points to memory (not yet initialized!)
// 3. Initialize object
// Another thread sees instance != null but not initialized!
```

**Common Mistakes:**
```java
// ❌ WRONG - Missing volatile
private static Singleton instance; // BUG!

// ❌ WRONG - Synchronizing entire method (performance issue)
public static synchronized Singleton getInstance() {
    if(instance == null) instance = new Singleton();
    return instance;
}
```

**Why Double-Check?**
- First check avoids synchronization overhead after initialization
- Second check ensures only one thread creates instance
- volatile ensures visibility

---

## 🎯 Thread-Safe Singleton

**Singleton Pattern Implementations:**

### 1. Eager Initialization
```java
class Singleton {
    private static final Singleton INSTANCE = new Singleton();
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```
- ✅ Thread-safe (static initialization)
- ❌ Not lazy (created even if not used)

### 2. Lazy Synchronized
```java
class Singleton {
    private static Singleton instance;
    
    private Singleton() {}
    
    public static synchronized Singleton getInstance() {
        if(instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```
- ✅ Thread-safe
- ✅ Lazy initialization
- ❌ Performance overhead (synchronized every call)

### 3. Double-Checked Locking
```java
class Singleton {
    private static volatile Singleton instance;
    
    private Singleton() {}
    
    public static Singleton getInstance() {
        if(instance == null) {
            synchronized(Singleton.class) {
                if(instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```
- ✅ Thread-safe
- ✅ Lazy initialization
- ✅ Good performance

### 4. Bill Pugh Singleton (Best Practice)
```java
class Singleton {
    private Singleton() {}
    
    private static class SingletonHelper {
        private static final Singleton INSTANCE = new Singleton();
    }
    
    public static Singleton getInstance() {
        return SingletonHelper.INSTANCE;
    }
}
```
- ✅ Thread-safe (static initialization)
- ✅ Lazy initialization
- ✅ No synchronization overhead
- ✅ **RECOMMENDED**

### 5. Enum Singleton (Most Robust)
```java
enum Singleton {
    INSTANCE;
    
    public void doSomething() {
        // Methods here
    }
}

// Usage: Singleton.INSTANCE.doSomething();
```
- ✅ Thread-safe
- ✅ Serialization-safe
- ✅ Reflection-proof
- ✅ Simple
- ❌ Cannot extend class

**Comparison:**
| Implementation | Thread-Safe | Lazy | Performance | Recommended |
|---------------|-------------|------|-------------|-------------|
| Eager | ✅ | ❌ | High | ⚠️ |
| Synchronized | ✅ | ✅ | Low | ❌ |
| Double-Checked | ✅ | ✅ | High | ✅ |
| Bill Pugh | ✅ | ✅ | High | ✅✅ |
| Enum | ✅ | ❌ | High | ✅✅ |

---

## 🎯 Quick Interview Points

1. **Producer-Consumer best implementation?** - BlockingQueue (simplest, most reliable)
2. **Reader-Writer use case?** - Read-heavy scenarios (cache, config)
3. **Thread pool benefit?** - Thread reuse, resource control, better performance
4. **Future pattern purpose?** - Async computation, get result later
5. **Why volatile in double-checked locking?** - Prevents seeing partially constructed object
6. **Best singleton implementation?** - Bill Pugh (lazy, thread-safe, fast) or Enum (most robust)
7. **Double-checked locking mistake?** - Forgetting volatile keyword
8. **Thread pool vs manual threads?** - Pool reuses threads, better resource management
9. **When use Reader-Writer?** - Multiple readers, infrequent writes
10. **CompletableFuture vs Future?** - CompletableFuture supports callbacks, chaining

---

## 📊 Pattern Selection Guide

| Pattern | When to Use | Key Benefit |
|---------|-------------|-------------|
| Producer-Consumer | Different processing speeds | Decouples production/consumption |
| Reader-Writer | Read-heavy workload | Concurrent reads |
| Thread Pool | Many short tasks | Thread reuse |
| Future | Async results | Non-blocking submission |
| Double-Checked Locking | Lazy singleton | Performance optimization |
| Thread-Safe Singleton | Single instance needed | Global access point |
