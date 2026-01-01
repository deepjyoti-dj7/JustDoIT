# 📝 Interview Problems - Quick Interview Notes

## 🔢 Print Numbers Sequentially

**Problem:**
Multiple threads print numbers in sequence. For 3 threads printing 1-15:
- Thread-1: 1, 4, 7, 10, 13
- Thread-2: 2, 5, 8, 11, 14
- Thread-3: 3, 6, 9, 12, 15

**Output:** 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15

### Solution 1: Using wait() and notifyAll()
```java
class SequentialPrinter {
    private int number = 1;
    private int maxNumber;
    private int numberOfThreads;
    private int currentThread = 0;
    private final Object lock = new Object();
    
    public SequentialPrinter(int max, int threads) {
        this.maxNumber = max;
        this.numberOfThreads = threads;
    }
    
    public void printNumber(int threadId) {
        synchronized(lock) {
            while(number <= maxNumber) {
                while(currentThread != threadId && number <= maxNumber) {
                    try {
                        lock.wait();
                    } catch(InterruptedException e) {
                        return;
                    }
                }
                if(number <= maxNumber) {
                    System.out.print(number + " ");
                    number++;
                    currentThread = (currentThread + 1) % numberOfThreads;
                    lock.notifyAll();
                }
            }
        }
    }
}

// Usage
SequentialPrinter printer = new SequentialPrinter(15, 3);
for(int i = 0; i < 3; i++) {
    int threadId = i;
    new Thread(() -> printer.printNumber(threadId)).start();
}
```

### Solution 2: Using Semaphore
```java
class SequentialPrinterSemaphore {
    private int number = 1;
    private int maxNumber;
    private Semaphore[] semaphores;
    
    public SequentialPrinterSemaphore(int max, int threads) {
        this.maxNumber = max;
        semaphores = new Semaphore[threads];
        for(int i = 0; i < threads; i++) {
            semaphores[i] = new Semaphore(i == 0 ? 1 : 0);
        }
    }
    
    public void printNumber(int threadId) {
        while(number <= maxNumber) {
            try {
                semaphores[threadId].acquire();
                if(number <= maxNumber) {
                    System.out.print(number + " ");
                    number++;
                }
                semaphores[(threadId + 1) % semaphores.length].release();
            } catch(InterruptedException e) {
                break;
            }
        }
    }
}
```

**Key Concepts:**
- Thread coordination
- Turn-based execution
- wait/notify pattern
- Modulo arithmetic for rotation

---

## 🔄 Print Odd Even

**Problem:**
Two threads - one prints odd numbers, other prints even numbers in sequence.

**Output:** 1 2 3 4 5 6 7 8 9 10

### Solution 1: Using wait() and notify()
```java
class OddEvenPrinter {
    private int number = 1;
    private int maxNumber;
    private final Object lock = new Object();
    
    public OddEvenPrinter(int max) {
        this.maxNumber = max;
    }
    
    public void printOdd() {
        synchronized(lock) {
            while(number <= maxNumber) {
                while(number % 2 == 0 && number <= maxNumber) {
                    try {
                        lock.wait();
                    } catch(InterruptedException e) {
                        return;
                    }
                }
                if(number <= maxNumber) {
                    System.out.print(number + " ");
                    number++;
                    lock.notify();
                }
            }
        }
    }
    
    public void printEven() {
        synchronized(lock) {
            while(number <= maxNumber) {
                while(number % 2 == 1 && number <= maxNumber) {
                    try {
                        lock.wait();
                    } catch(InterruptedException e) {
                        return;
                    }
                }
                if(number <= maxNumber) {
                    System.out.print(number + " ");
                    number++;
                    lock.notify();
                }
            }
        }
    }
}

// Usage
OddEvenPrinter printer = new OddEvenPrinter(10);
new Thread(() -> printer.printOdd()).start();
new Thread(() -> printer.printEven()).start();
```

### Solution 2: Using Semaphore
```java
class OddEvenPrinterSemaphore {
    private int number = 1;
    private int maxNumber;
    private Semaphore oddSem = new Semaphore(1);
    private Semaphore evenSem = new Semaphore(0);
    
    public OddEvenPrinterSemaphore(int max) {
        this.maxNumber = max;
    }
    
    public void printOdd() {
        while(number <= maxNumber) {
            try {
                oddSem.acquire();
                if(number <= maxNumber) {
                    System.out.print(number + " ");
                    number++;
                }
                evenSem.release();
            } catch(InterruptedException e) {
                break;
            }
        }
    }
    
    public void printEven() {
        while(number <= maxNumber) {
            try {
                evenSem.acquire();
                if(number <= maxNumber) {
                    System.out.print(number + " ");
                    number++;
                }
                oddSem.release();
            } catch(InterruptedException e) {
                break;
            }
        }
    }
}
```

**Key Concepts:**
- Binary synchronization (two threads)
- Condition-based waiting
- Semaphore signaling

---

## 📦 Bounded Buffer (Producer-Consumer)

**Problem:**
Implement fixed-size buffer with multiple producers and consumers.

### Solution: Using BlockingQueue
```java
class BoundedBuffer<T> {
    private final BlockingQueue<T> buffer;
    
    public BoundedBuffer(int capacity) {
        buffer = new ArrayBlockingQueue<>(capacity);
    }
    
    public void produce(T item) throws InterruptedException {
        buffer.put(item); // Blocks if full
    }
    
    public T consume() throws InterruptedException {
        return buffer.take(); // Blocks if empty
    }
}
```

### Solution: Using wait() and notify()
```java
class BoundedBuffer<T> {
    private final Queue<T> buffer = new LinkedList<>();
    private final int capacity;
    private final Object lock = new Object();
    
    public BoundedBuffer(int capacity) {
        this.capacity = capacity;
    }
    
    public void produce(T item) throws InterruptedException {
        synchronized(lock) {
            while(buffer.size() == capacity) {
                lock.wait(); // Buffer full
            }
            buffer.add(item);
            lock.notifyAll(); // Notify consumers
        }
    }
    
    public T consume() throws InterruptedException {
        synchronized(lock) {
            while(buffer.isEmpty()) {
                lock.wait(); // Buffer empty
            }
            T item = buffer.remove();
            lock.notifyAll(); // Notify producers
            return item;
        }
    }
}
```

**Key Concepts:**
- Bounded capacity
- Blocking when full/empty
- Producer-consumer coordination

---

## ⏱️ Rate Limiter

**Problem:**
Limit number of requests/operations per time window.

### Solution 1: Token Bucket (Semaphore)
```java
class RateLimiter {
    private final Semaphore semaphore;
    private final int maxPermits;
    private final long refillInterval;
    
    public RateLimiter(int permitsPerSecond) {
        this.maxPermits = permitsPerSecond;
        this.semaphore = new Semaphore(permitsPerSecond);
        this.refillInterval = 1000; // 1 second
        
        // Refill thread
        new Thread(() -> {
            while(true) {
                try {
                    Thread.sleep(refillInterval);
                    int available = semaphore.availablePermits();
                    if(available < maxPermits) {
                        semaphore.release(maxPermits - available);
                    }
                } catch(InterruptedException e) {
                    break;
                }
            }
        }).start();
    }
    
    public boolean tryAcquire() {
        return semaphore.tryAcquire();
    }
    
    public void acquire() throws InterruptedException {
        semaphore.acquire();
    }
}

// Usage
RateLimiter limiter = new RateLimiter(10); // 10 requests/second
if(limiter.tryAcquire()) {
    // Process request
}
```

### Solution 2: Sliding Window
```java
class RateLimiterSlidingWindow {
    private final Queue<Long> requestTimestamps = new LinkedList<>();
    private final int maxRequests;
    private final long windowMs;
    
    public RateLimiterSlidingWindow(int maxRequests, long windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
    }
    
    public synchronized boolean allowRequest() {
        long now = System.currentTimeMillis();
        long windowStart = now - windowMs;
        
        // Remove old timestamps
        while(!requestTimestamps.isEmpty() && 
              requestTimestamps.peek() <= windowStart) {
            requestTimestamps.poll();
        }
        
        if(requestTimestamps.size() < maxRequests) {
            requestTimestamps.offer(now);
            return true;
        }
        return false;
    }
}

// Usage
RateLimiterSlidingWindow limiter = new RateLimiterSlidingWindow(100, 60000); // 100/min
if(limiter.allowRequest()) {
    // Process request
}
```

**Key Concepts:**
- Token bucket algorithm
- Sliding window
- Request throttling
- Time-based permits

---

## 💾 Thread-Safe Cache

**Problem:**
Implement thread-safe LRU cache with get/put operations.

### Solution: Using ConcurrentHashMap + LinkedHashMap
```java
class ThreadSafeCache<K, V> {
    private final int capacity;
    private final Map<K, V> cache;
    
    public ThreadSafeCache(int capacity) {
        this.capacity = capacity;
        this.cache = Collections.synchronizedMap(
            new LinkedHashMap<K, V>(capacity, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                    return size() > capacity;
                }
            }
        );
    }
    
    public V get(K key) {
        synchronized(cache) {
            return cache.get(key);
        }
    }
    
    public void put(K key, V value) {
        synchronized(cache) {
            cache.put(key, value);
        }
    }
}
```

### Solution: Using ReadWriteLock
```java
class ThreadSafeLRUCache<K, V> {
    private final int capacity;
    private final LinkedHashMap<K, V> cache;
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    
    public ThreadSafeLRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new LinkedHashMap<K, V>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                return size() > capacity;
            }
        };
    }
    
    public V get(K key) {
        lock.readLock().lock();
        try {
            return cache.get(key);
        } finally {
            lock.readLock().unlock();
        }
    }
    
    public void put(K key, V value) {
        lock.writeLock().lock();
        try {
            cache.put(key, value);
        } finally {
            lock.writeLock().unlock();
        }
    }
}
```

**Key Concepts:**
- LRU eviction policy
- Thread-safe access
- Read-write locks for performance
- LinkedHashMap for access order

---

## 🍴 Dining Philosophers

**Problem:**
N philosophers sit at table, need 2 forks to eat. Prevent deadlock and starvation.

### Solution 1: Resource Ordering (Prevent Deadlock)
```java
class DiningPhilosophers {
    private final Object[] forks;
    
    public DiningPhilosophers(int numPhilosophers) {
        forks = new Object[numPhilosophers];
        for(int i = 0; i < numPhilosophers; i++) {
            forks[i] = new Object();
        }
    }
    
    public void philosopher(int id) throws InterruptedException {
        int leftFork = id;
        int rightFork = (id + 1) % forks.length;
        
        // Always acquire lower-numbered fork first
        int firstFork = Math.min(leftFork, rightFork);
        int secondFork = Math.max(leftFork, rightFork);
        
        while(true) {
            // Think
            Thread.sleep(100);
            
            // Pick up forks (ordered to prevent deadlock)
            synchronized(forks[firstFork]) {
                synchronized(forks[secondFork]) {
                    // Eat
                    System.out.println("Philosopher " + id + " eating");
                    Thread.sleep(100);
                }
            }
        }
    }
}
```

### Solution 2: Using Semaphore (Limit Concurrent Diners)
```java
class DiningPhilosophersSemaphore {
    private final Semaphore[] forks;
    private final Semaphore maxDiners;
    
    public DiningPhilosophersSemaphore(int numPhilosophers) {
        forks = new Semaphore[numPhilosophers];
        for(int i = 0; i < numPhilosophers; i++) {
            forks[i] = new Semaphore(1);
        }
        // Only allow N-1 philosophers to dine simultaneously
        maxDiners = new Semaphore(numPhilosophers - 1);
    }
    
    public void philosopher(int id) throws InterruptedException {
        int leftFork = id;
        int rightFork = (id + 1) % forks.length;
        
        while(true) {
            // Think
            Thread.sleep(100);
            
            maxDiners.acquire(); // Limit concurrent diners
            
            // Pick up forks
            forks[leftFork].acquire();
            forks[rightFork].acquire();
            
            // Eat
            System.out.println("Philosopher " + id + " eating");
            Thread.sleep(100);
            
            // Put down forks
            forks[leftFork].release();
            forks[rightFork].release();
            
            maxDiners.release();
        }
    }
}
```

**Key Concepts:**
- Deadlock prevention (resource ordering)
- Limiting concurrent access
- Circular wait breaking
- Symmetry breaking

---

## 🎯 Quick Problem-Solving Tips

### Pattern Recognition:
1. **Sequential/Turn-based** → Semaphore or wait/notify with turn counter
2. **Producer-Consumer** → BlockingQueue or wait/notify
3. **Rate Limiting** → Semaphore with refill or sliding window
4. **Odd-Even** → Two semaphores or wait/notify with condition
5. **Resource Ordering** → Prevent deadlock (Dining Philosophers)
6. **LRU Cache** → LinkedHashMap + synchronization
7. **Bounded Buffer** → BlockingQueue or wait/notify

### Common Approaches:
- **Coordination**: wait/notify, Semaphore, CountDownLatch
- **Mutual Exclusion**: synchronized, Lock, Semaphore(1)
- **Ordering**: Turn counter, multiple semaphores
- **Throttling**: Rate limiter, semaphore with refill
- **Read-Heavy**: ReadWriteLock, ConcurrentHashMap

### Interview Strategy:
1. **Clarify requirements** (number of threads, ordering, capacity)
2. **Identify pattern** (producer-consumer, coordination, etc.)
3. **Choose mechanism** (BlockingQueue, semaphore, wait/notify)
4. **Consider edge cases** (empty, full, deadlock, starvation)
5. **Discuss trade-offs** (simplicity vs performance)

---

## 📊 Quick Reference Table

| Problem | Key Approach | Primary Tool |
|---------|-------------|--------------|
| Sequential Print | Turn tracking | Semaphore/wait-notify |
| Odd-Even Print | Condition check | Two Semaphores |
| Bounded Buffer | Producer-Consumer | BlockingQueue |
| Rate Limiter | Token bucket | Semaphore + Refill |
| Thread-Safe Cache | Concurrent access | ReadWriteLock |
| Dining Philosophers | Resource ordering | Lock ordering |

---

## 🎯 Key Interview Points

1. **Prefer BlockingQueue** for producer-consumer (simpler, cleaner)
2. **Use Semaphore** for limiting concurrent access or signaling
3. **wait/notify** for custom coordination (more control)
4. **Resource ordering** prevents deadlock
5. **Limit concurrent access** (N-1 for N resources) prevents deadlock
6. **ReadWriteLock** for read-heavy caches
7. **LinkedHashMap** for LRU with access order
8. **Always check conditions in while loop** (not if) with wait()
9. **Consider fairness** in locks/semaphores to prevent starvation
10. **Test edge cases**: empty, full, single thread, many threads
