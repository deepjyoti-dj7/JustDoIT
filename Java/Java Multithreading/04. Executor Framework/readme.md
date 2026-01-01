# 📝 Executor Framework - Quick Interview Notes

## 🏊 ExecutorService & Thread Pools

**What is ExecutorService?**
- High-level API for managing thread pools and executing tasks
- Replaces manual thread creation
- Better resource management and performance

**Benefits:**
- ✅ Thread reuse (no creation overhead)
- ✅ Controls concurrent threads
- ✅ Task queue management
- ✅ Lifecycle management (shutdown)
- ✅ Better than manual thread management

**Creating ExecutorService:**
```java
// 1. Fixed Thread Pool - Fixed number of threads
ExecutorService executor = Executors.newFixedThreadPool(5);

// 2. Cached Thread Pool - Creates threads as needed, reuses idle
ExecutorService executor = Executors.newCachedThreadPool();

// 3. Single Thread Executor - Single worker thread
ExecutorService executor = Executors.newSingleThreadExecutor();

// 4. Scheduled Thread Pool - For delayed/periodic tasks
ScheduledExecutorService executor = Executors.newScheduledThreadPool(3);

// 5. Work Stealing Pool - Uses ForkJoinPool (Java 8+)
ExecutorService executor = Executors.newWorkStealingPool();
```

**Task Submission:**
```java
executor.execute(runnable);           // Fire and forget
Future<?> future = executor.submit(runnable);    // Returns Future
Future<T> future = executor.submit(callable);    // Returns Future with result
```

**Shutdown:**
```java
executor.shutdown();                  // Graceful shutdown (waits for tasks)
executor.shutdownNow();              // Immediate shutdown (interrupts tasks)
executor.awaitTermination(timeout);  // Wait for termination
```

**Best Practice Pattern:**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);
try {
    executor.submit(() -> { /* task */ });
} finally {
    executor.shutdown();
    executor.awaitTermination(60, TimeUnit.SECONDS);
}
```

---

## 🔧 Thread Pools

**What is a Thread Pool?**
- Collection of pre-initialized threads ready to execute tasks
- Reuses threads instead of creating new ones
- Manages task queue

**Thread Pool Parameters (ThreadPoolExecutor):**
```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    corePoolSize,        // Min threads to keep alive
    maximumPoolSize,     // Max threads allowed
    keepAliveTime,       // Time to keep idle threads alive
    TimeUnit.SECONDS,    // Time unit
    workQueue,           // Task queue
    threadFactory,       // Creates threads (optional)
    rejectionHandler     // Handles rejected tasks (optional)
);
```

**Core Parameters:**
- **corePoolSize** - Minimum threads always kept alive
- **maximumPoolSize** - Maximum threads in pool
- **keepAliveTime** - How long idle threads wait before termination
- **workQueue** - Queue to hold tasks before execution

**Work Queue Types:**
```java
new LinkedBlockingQueue<>()        // Unbounded queue
new ArrayBlockingQueue<>(100)      // Bounded queue
new SynchronousQueue<>()           // Direct handoff
new PriorityBlockingQueue<>()      // Priority-based
```

**Rejection Policies:**
```java
new ThreadPoolExecutor.AbortPolicy()         // Throws exception (default)
new ThreadPoolExecutor.CallerRunsPolicy()    // Caller runs task
new ThreadPoolExecutor.DiscardPolicy()       // Silently discards
new ThreadPoolExecutor.DiscardOldestPolicy() // Discards oldest
```

**Pool Size Guidelines:**
- **CPU-intensive tasks**: Pool size = Number of cores + 1
- **I/O-intensive tasks**: Pool size = Number of cores * (1 + Wait time / Service time)

**Thread Pool Types:**
| Type | Core | Max | Queue | Use Case |
|------|------|-----|-------|----------|
| FixedThreadPool | n | n | Unbounded | Known workload |
| CachedThreadPool | 0 | Integer.MAX | SynchronousQueue | Many short tasks |
| SingleThreadExecutor | 1 | 1 | Unbounded | Sequential execution |
| ScheduledThreadPool | n | Integer.MAX | DelayedWorkQueue | Scheduled tasks |

---

## 📞 Callable & Future

**Callable vs Runnable:**
| Feature | Runnable | Callable |
|---------|----------|----------|
| Return Value | ❌ void | ✅ Generic type |
| Exception | ❌ Can't throw checked | ✅ Can throw Exception |
| Method | run() | call() |

**Callable Interface:**
```java
Callable<Integer> task = () -> {
    Thread.sleep(1000);
    return 42; // Returns result
};
```

**Future Interface:**
- Represents result of asynchronous computation
- Get result when available
- Can cancel task

**Future Methods:**
```java
Future<Integer> future = executor.submit(callable);

Integer result = future.get();              // Blocking - wait for result
Integer result = future.get(5, TimeUnit.SECONDS); // With timeout
boolean isDone = future.isDone();           // Check if completed
boolean cancelled = future.cancel(true);    // Cancel task
boolean isCancelled = future.isCancelled(); // Check if cancelled
```

**Pattern:**
```java
ExecutorService executor = Executors.newFixedThreadPool(3);

Callable<String> task = () -> {
    Thread.sleep(2000);
    return "Result";
};

Future<String> future = executor.submit(task);

// Do other work while task executes

String result = future.get(); // Blocks until ready
System.out.println(result);

executor.shutdown();
```

**Multiple Futures:**
```java
List<Future<Integer>> futures = new ArrayList<>();
for(int i = 0; i < 5; i++) {
    Future<Integer> future = executor.submit(callable);
    futures.add(future);
}

// Collect results
for(Future<Integer> future : futures) {
    Integer result = future.get();
}
```

---

## ⚡ CompletableFuture

**What is CompletableFuture?**
- Enhanced Future with completion callbacks
- Non-blocking asynchronous programming
- Supports chaining, combining, exception handling
- Java 8+ feature

**Creating CompletableFuture:**
```java
// Already completed
CompletableFuture<String> cf = CompletableFuture.completedFuture("result");

// Run async (returns CompletableFuture<Void>)
CompletableFuture<Void> cf = CompletableFuture.runAsync(() -> {
    // Runnable task
});

// Supply async (returns CompletableFuture<T>)
CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> {
    return "result"; // Supplier
});

// With custom executor
CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> "result", executor);
```

**Chaining Operations:**
```java
CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> "Hello")
    .thenApply(s -> s + " World")           // Transform result
    .thenApply(String::toUpperCase)         // Chain transformations
    .thenAccept(System.out::println)        // Consume result
    .thenRun(() -> System.out.println("Done")); // Run after completion
```

**Combining Futures:**
```java
CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> "Hello");
CompletableFuture<String> cf2 = CompletableFuture.supplyAsync(() -> "World");

// Combine both results
CompletableFuture<String> combined = cf1.thenCombine(cf2, (s1, s2) -> s1 + " " + s2);

// Run after both complete
CompletableFuture<Void> both = CompletableFuture.allOf(cf1, cf2);

// Complete when any finishes
CompletableFuture<Object> any = CompletableFuture.anyOf(cf1, cf2);
```

**Exception Handling:**
```java
CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> {
    if(true) throw new RuntimeException("Error!");
    return "result";
})
.exceptionally(ex -> "Error: " + ex.getMessage())  // Handle exception
.handle((result, ex) -> {                          // Handle both result and exception
    if(ex != null) return "Error";
    return result;
});
```

**Key Methods:**
- `thenApply()` - Transform result
- `thenAccept()` - Consume result
- `thenRun()` - Run after completion
- `thenCompose()` - Flat map (async)
- `thenCombine()` - Combine two futures
- `allOf()` - Wait for all
- `anyOf()` - Wait for any
- `exceptionally()` - Handle exception
- `handle()` - Handle result or exception

---

## ⏰ ScheduledExecutorService

**What is ScheduledExecutorService?**
- Executes tasks with delay or periodically
- Alternative to Timer (more flexible, uses thread pool)

**Creating:**
```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(3);
```

**Methods:**
```java
// Execute once after delay
scheduler.schedule(runnable, 5, TimeUnit.SECONDS);
scheduler.schedule(callable, 5, TimeUnit.SECONDS);

// Execute periodically with fixed rate
scheduler.scheduleAtFixedRate(
    runnable,
    initialDelay,
    period,
    TimeUnit.SECONDS
); // Runs every 'period' seconds (ignores execution time)

// Execute periodically with fixed delay
scheduler.scheduleWithFixedDelay(
    runnable,
    initialDelay,
    delay,
    TimeUnit.SECONDS
); // Waits 'delay' after previous execution completes
```

**Fixed Rate vs Fixed Delay:**
```
Fixed Rate (scheduleAtFixedRate):
|--Task--|  |--Task--|  |--Task--|
0s      2s 4s       6s 8s       10s
Period = 4s (start to start)

Fixed Delay (scheduleWithFixedDelay):
|--Task--|    |--Task--|    |--Task--|
0s      2s    6s      8s    12s      14s
Delay = 4s (end to start)
```

**Use Cases:**
- Periodic health checks
- Cache cleanup
- Data synchronization
- Scheduled reports
- Heartbeat mechanisms

---

## 🍴 ForkJoinPool

**What is ForkJoinPool?**
- Designed for parallel recursive algorithms
- Uses work-stealing algorithm
- Ideal for divide-and-conquer tasks
- Powers parallel streams (Java 8+)

**Key Concepts:**
- **Fork** - Split task into subtasks
- **Join** - Wait for subtasks to complete
- **Work Stealing** - Idle threads steal work from busy threads

**ForkJoinTask Types:**
```java
// RecursiveTask<V> - Returns result
class MyTask extends RecursiveTask<Integer> {
    protected Integer compute() {
        if(taskIsSmall) {
            return computeDirectly();
        }
        MyTask subtask1 = new MyTask(...);
        MyTask subtask2 = new MyTask(...);
        subtask1.fork();  // Async execute
        int result2 = subtask2.compute();
        int result1 = subtask1.join();  // Wait
        return result1 + result2;
    }
}

// RecursiveAction - No result
class MyAction extends RecursiveAction {
    protected void compute() { /* ... */ }
}
```

**Creating and Using:**
```java
ForkJoinPool pool = new ForkJoinPool();
// OR
ForkJoinPool pool = ForkJoinPool.commonPool(); // Shared pool

MyTask task = new MyTask(data);
Integer result = pool.invoke(task); // Execute and wait for result
```

**When to Use:**
- Parallel array processing
- Merge sort, quick sort
- Tree traversal
- Matrix operations
- Recursive algorithms

**Common Pool:**
```java
// Default pool size = Runtime.getRuntime().availableProcessors() - 1
ForkJoinPool.commonPool().invoke(task);
```

---

## 🎯 Quick Interview Points

1. **Why use ExecutorService?** - Thread reuse, resource management, better than manual threads
2. **Fixed vs Cached Thread Pool?** - Fixed has constant threads, Cached grows dynamically
3. **Callable vs Runnable?** - Callable returns value and can throw exceptions
4. **Future.get() blocking?** - Yes, blocks until result is available
5. **CompletableFuture advantage?** - Non-blocking callbacks, chaining, combining
6. **shutdown() vs shutdownNow()?** - shutdown waits for tasks, shutdownNow interrupts
7. **Fixed rate vs Fixed delay?** - Rate is start-to-start, Delay is end-to-start
8. **ForkJoinPool use case?** - Recursive parallel algorithms, divide-and-conquer
9. **Thread pool size for CPU tasks?** - cores + 1
10. **Thread pool size for I/O tasks?** - cores * (1 + waitTime/serviceTime)

---

## 🔄 Comparison Table

| Feature | ExecutorService | CompletableFuture | ForkJoinPool |
|---------|----------------|-------------------|--------------|
| Purpose | General tasks | Async pipelines | Recursive tasks |
| Blocking | Can block | Non-blocking | Can block |
| Chaining | ❌ | ✅ | ❌ |
| Result | Future | CompletableFuture | ForkJoinTask |
| Use Case | Any async task | Async workflows | Divide-conquer |
