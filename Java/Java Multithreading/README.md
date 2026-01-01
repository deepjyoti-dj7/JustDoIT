# ☕ Java Multithreading & Concurrency

## 📚 Complete Guide for Interview Preparation

This folder contains comprehensive coverage of Java multithreading concepts with theory, examples, and best practices.

---

## 📖 Table of Contents

### 1. Fundamentals
- [01. Thread Basics](01.%20Fundamentals/01.%20Thread%20Basics.md)
- [02. Thread Lifecycle](01.%20Fundamentals/02.%20Thread%20Lifecycle.md)
- [03. Thread Creation Methods](01.%20Fundamentals/03.%20Thread%20Creation%20Methods.md)
- [04. Thread vs Runnable](01.%20Fundamentals/04.%20Thread%20vs%20Runnable.md)

### 2. Synchronization
- [01. Race Conditions](02.%20Synchronization/01.%20Race%20Conditions.md)
- [02. Synchronized Keyword](02.%20Synchronization/02.%20Synchronized%20Keyword.md)
- [03. Volatile Keyword](02.%20Synchronization/03.%20Volatile%20Keyword.md)
- [04. Atomic Variables](02.%20Synchronization/04.%20Atomic%20Variables.md)
- [05. Locks & ReentrantLock](02.%20Synchronization/05.%20Locks%20%26%20ReentrantLock.md)
- [06. ReadWriteLock](02.%20Synchronization/06.%20ReadWriteLock.md)

### 3. Thread Communication
- [01. Wait Notify NotifyAll](03.%20Thread%20Communication/01.%20Wait%20Notify%20NotifyAll.md)
- [02. Join Method](03.%20Thread%20Communication/02.%20Join%20Method.md)
- [03. CountDownLatch](03.%20Thread%20Communication/03.%20CountDownLatch.md)
- [04. CyclicBarrier](03.%20Thread%20Communication/04.%20CyclicBarrier.md)
- [05. Semaphore](03.%20Thread%20Communication/05.%20Semaphore.md)
- [06. Exchanger](03.%20Thread%20Communication/06.%20Exchanger.md)
- [07. Phaser](03.%20Thread%20Communication/07.%20Phaser.md)

### 4. Executor Framework
- [01. ExecutorService](04.%20Executor%20Framework/01.%20ExecutorService.md)
- [02. Thread Pools](04.%20Executor%20Framework/02.%20Thread%20Pools.md)
- [03. Callable & Future](04.%20Executor%20Framework/03.%20Callable%20%26%20Future.md)
- [04. CompletableFuture](04.%20Executor%20Framework/04.%20CompletableFuture.md)
- [05. ScheduledExecutorService](04.%20Executor%20Framework/05.%20ScheduledExecutorService.md)
- [06. ForkJoinPool](04.%20Executor%20Framework/06.%20ForkJoinPool.md)

### 5. Concurrent Collections
- [01. ConcurrentHashMap](05.%20Concurrent%20Collections/01.%20ConcurrentHashMap.md)
- [02. CopyOnWriteArrayList](05.%20Concurrent%20Collections/02.%20CopyOnWriteArrayList.md)
- [03. BlockingQueue](05.%20Concurrent%20Collections/03.%20BlockingQueue.md)
- [04. ConcurrentLinkedQueue](05.%20Concurrent%20Collections/04.%20ConcurrentLinkedQueue.md)
- [05. Collections Synchronization](05.%20Concurrent%20Collections/05.%20Collections%20Synchronization.md)

### 6. Advanced Concepts
- [01. ThreadLocal](06.%20Advanced%20Concepts/01.%20ThreadLocal.md)
- [02. Deadlock](06.%20Advanced%20Concepts/02.%20Deadlock.md)
- [03. Livelock & Starvation](06.%20Advanced%20Concepts/03.%20Livelock%20%26%20Starvation.md)
- [04. Thread Safety](06.%20Advanced%20Concepts/04.%20Thread%20Safety.md)
- [05. Happens-Before](06.%20Advanced%20Concepts/05.%20Happens-Before.md)
- [06. Memory Model](06.%20Advanced%20Concepts/06.%20Memory%20Model.md)
- [07. Daemon Threads](06.%20Advanced%20Concepts/07.%20Daemon%20Threads.md)

### 7. Design Patterns
- [01. Producer Consumer](07.%20Design%20Patterns/01.%20Producer%20Consumer.md)
- [02. Reader Writer](07.%20Design%20Patterns/02.%20Reader%20Writer.md)
- [03. Thread Pool Pattern](07.%20Design%20Patterns/03.%20Thread%20Pool%20Pattern.md)
- [04. Future Pattern](07.%20Design%20Patterns/04.%20Future%20Pattern.md)
- [05. Double-Checked Locking](07.%20Design%20Patterns/05.%20Double-Checked%20Locking.md)
- [06. Thread-Safe Singleton](07.%20Design%20Patterns/06.%20Thread-Safe%20Singleton.md)

### 8. Interview Problems
- [01. Print Numbers Sequentially](08.%20Interview%20Problems/01.%20Print%20Numbers%20Sequentially.md)
- [02. Print Odd Even](08.%20Interview%20Problems/02.%20Print%20Odd%20Even.md)
- [03. Bounded Buffer](08.%20Interview%20Problems/03.%20Bounded%20Buffer.md)
- [04. Rate Limiter](08.%20Interview%20Problems/04.%20Rate%20Limiter.md)
- [05. Thread-Safe Cache](08.%20Interview%20Problems/05.%20Thread-Safe%20Cache.md)
- [06. Dining Philosophers](08.%20Interview%20Problems/06.%20Dining%20Philosophers.md)

---

## 🎯 Interview Tips

### Key Areas to Focus
1. **Synchronization mechanisms** (synchronized, locks, volatile)
2. **Thread communication** (wait/notify, latches, barriers)
3. **Executor framework** (thread pools, futures)
4. **Concurrent collections** usage and internals
5. **Common problems** (deadlock, race conditions)
6. **Design patterns** (producer-consumer, singleton)

### Common Interview Questions
- Difference between `synchronized` and `ReentrantLock`
- How does `ConcurrentHashMap` work internally?
- What is the difference between `wait()` and `sleep()`?
- Explain thread lifecycle and states
- What is deadlock and how to prevent it?
- When to use `CountDownLatch` vs `CyclicBarrier`?
- Difference between `Callable` and `Runnable`
- How does `volatile` keyword work?

---

## 🚀 Best Practices

1. ✅ Always prefer higher-level concurrency utilities over `wait()` and `notify()`
2. ✅ Use `ExecutorService` instead of creating threads manually
3. ✅ Minimize the scope of synchronization
4. ✅ Prefer immutable objects for thread safety
5. ✅ Use concurrent collections instead of synchronized collections
6. ✅ Always catch `InterruptedException` properly
7. ✅ Use `try-finally` with locks to ensure unlock
8. ✅ Avoid nested locks to prevent deadlock

---

## 📊 Learning Path

**Beginner** → Fundamentals → Synchronization
**Intermediate** → Thread Communication → Executor Framework
**Advanced** → Concurrent Collections → Advanced Concepts → Design Patterns
**Expert** → Interview Problems → Real-world Applications

---

## 🔗 Quick Reference

- **Creating Threads**: `Thread`, `Runnable`, `Callable`, `ExecutorService`
- **Synchronization**: `synchronized`, `volatile`, `Lock`, `ReadWriteLock`
- **Communication**: `wait()`, `notify()`, `CountDownLatch`, `CyclicBarrier`, `Semaphore`
- **Collections**: `ConcurrentHashMap`, `BlockingQueue`, `CopyOnWriteArrayList`
- **Utilities**: `Atomic*`, `ThreadLocal`, `CompletableFuture`

---

## 📋 Study Guide - Recommended Learning Path

### Phase 1: Fundamentals (Week 1)
**Goal**: Understand basic threading concepts

1. **Thread Basics** - What are threads, properties, basic methods
2. **Thread Lifecycle** - 6 states, transitions, complete lifecycle
3. **Thread Creation Methods** - Extending Thread, Runnable, Callable, Lambda
4. **Thread vs Runnable** - Design differences, when to use which

**Practice**: Create basic multi-threaded programs, experiment with thread states

---

### Phase 2: Synchronization (Week 2)
**Goal**: Master thread safety and synchronization

1. **Race Conditions** - Causes, examples, detection
2. **Synchronized Keyword** - Methods, blocks, lock rules
3. **Volatile Keyword** - Visibility, happens-before, vs synchronized
4. **Atomic Variables** - AtomicInteger, CAS, performance
5. **Locks & ReentrantLock** - Lock/unlock, tryLock, fair locks

**Practice**: Fix race conditions, implement thread-safe counters, bank transfers

---

### Phase 3: Thread Communication (Week 3)
**Goal**: Coordinate between threads

1. **Wait, Notify, NotifyAll** - Producer-consumer, spurious wakeups
2. **Join Method** - Waiting for completion
3. **CountDownLatch** - One-time synchronization
4. **CyclicBarrier** - Reusable barrier
5. **Semaphore** - Resource pool management
6. **Exchanger** - Two-thread data exchange
7. **Phaser** - Dynamic parties, multi-phase coordination

**Practice**: Implement producer-consumer, parallel task coordination

---

### Phase 4: Executor Framework (Week 4)
**Goal**: Manage thread pools efficiently

1. **ExecutorService** - Thread pools, submit vs execute, shutdown
2. **Thread Pools** - Fixed, Cached, Single, Scheduled, Custom
3. **Callable & Future** - Async results, timeout handling
4. **CompletableFuture** - Async programming, chaining, combining
5. **ScheduledExecutorService** - Delayed and periodic execution
6. **ForkJoinPool** - Work stealing, parallel streams

**Practice**: Build batch processors, task schedulers, async APIs

---

### Phase 5: Concurrent Collections (Week 5)
**Goal**: Use thread-safe collections

1. **ConcurrentHashMap** - Internal structure, compute operations
2. **CopyOnWriteArrayList** - Copy-on-write mechanism
3. **BlockingQueue** - Array, Linked, Priority implementations
4. **ConcurrentLinkedQueue** - Non-blocking queue
5. **Collections Synchronization** - When to use which

**Practice**: Implement thread-safe caches, message queues

---

### Phase 6: Advanced Concepts (Week 6)
**Goal**: Deep understanding of concurrency

1. **ThreadLocal** - Per-thread variables, use cases, memory leaks
2. **Deadlock** - Conditions, detection, prevention strategies
3. **Livelock & Starvation** - Differences, examples, prevention
4. **Thread Safety** - Levels, immutability, stateless design
5. **Happens-Before** - Memory visibility, synchronization guarantees
6. **Java Memory Model** - CPU cache, visibility, ordering
7. **Daemon Threads** - vs user threads, use cases

**Practice**: Analyze thread safety, identify potential issues

---

### Phase 7: Design Patterns (Week 7)
**Goal**: Apply concurrency patterns

1. **Producer-Consumer** - wait/notify, BlockingQueue approaches
2. **Reader-Writer** - ReadWriteLock, many readers pattern
3. **Thread Pool Pattern** - Custom implementation
4. **Future Pattern** - Async computation
5. **Double-Checked Locking** - Lazy initialization with volatile
6. **Thread-Safe Singleton** - Eager, lazy, holder, enum approaches

**Practice**: Implement patterns in real scenarios

---

### Phase 8: Interview Problems (Week 8)
**Goal**: Master common interview questions

1. **Print Numbers Sequentially** - N threads printing in order
2. **Print Odd-Even** - Two threads coordination
3. **Bounded Buffer** - Producer-consumer with capacity
4. **Rate Limiter** - Token bucket, sliding window
5. **Thread-Safe Cache** - LRU with locks, eviction policies
6. **Dining Philosophers** - Deadlock prevention strategies

**Practice**: Solve on whiteboard, explain approach, discuss trade-offs

---

## 🎯 Interview Focus Areas

### Must Know ⭐⭐⭐
1. Thread lifecycle and states
2. Synchronized vs volatile vs atomic
3. wait() vs sleep() vs yield()
4. Deadlock and prevention
5. ExecutorService and thread pools
6. Producer-consumer problem
7. Thread-safe singleton
8. ConcurrentHashMap internals
9. Future and CompletableFuture
10. Race conditions and fixes

### Should Know ⭐⭐
1. ReentrantLock vs synchronized
2. CountDownLatch vs CyclicBarrier
3. BlockingQueue implementations
4. ThreadLocal usage
5. Happens-before relationship
6. Fork-Join framework
7. Semaphore usage
8. Memory model basics

### Good to Know ⭐
1. Phaser, Exchanger
2. StampedLock, LongAdder
3. Thread interruption details
4. Concurrent skip list

---

## 💡 Study Tips

1. **Build Projects**: Multi-threaded web server, task scheduler, batch processor
2. **Debug**: Use debugger to see thread states in real-time
3. **Visualize**: Draw diagrams of thread interactions
4. **Practice**: Solve LeetCode concurrency problems
5. **Read Code**: Study java.util.concurrent source code
6. **Write Tests**: Create multi-threaded test scenarios
7. **Performance**: Measure and compare different approaches
8. **Review**: Revisit completed topics weekly

---

## 📚 Additional Resources

**Books**: 
- Java Concurrency in Practice (Brian Goetz)
- Effective Java (Joshua Bloch - Items 78-84)

**Practice**:
- LeetCode Concurrency section
- HackerRank Java challenges

**Tools**:
- JConsole, VisualVM (deadlock detection)
- IntelliJ Thread Dump analyzer

**Documentation**:
- Official Java Concurrency Tutorial
- java.util.concurrent JavaDoc

---

## ✅ Pre-Interview Checklist

**Week before:**
- [ ] Review all synchronization mechanisms
- [ ] Practice 10+ coding problems
- [ ] Explain concepts without notes
- [ ] Draw thread state diagrams
- [ ] List pros/cons of each approach
- [ ] Prepare real-world examples
- [ ] Review past mistakes

**Day before:**
- [ ] Quick review of key topics
- [ ] Read this guide again
- [ ] Practice 2-3 problems
- [ ] Rest well!

---

Happy Learning! 🚀
