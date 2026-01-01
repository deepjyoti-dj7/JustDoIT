# 📝 Fundamentals - Quick Interview Notes

## 🧵 Thread Basics

**What is a Thread?**

- Smallest unit of execution within a process
- Lightweight subprocess sharing same memory space
- Has its own stack but shares heap memory

**Why Use Threads?**

- **Concurrency**: Execute multiple tasks simultaneously
- **Responsiveness**: Keep UI responsive during background tasks
- **Performance**: Better CPU utilization on multi-core systems
- **Resource Sharing**: Easy communication through shared memory

**Thread vs Process**
| Feature | Thread | Process |
|---------|--------|---------|
| Memory | Shared within process | Separate memory space |
| Communication | Easy (shared memory) | Complex (IPC needed) |
| Creation Time | Fast | Slow |
| Context Switching | Lightweight | Heavyweight |

---

## 🔄 Thread Lifecycle

**6 Thread States (Thread.State enum):**

1. **NEW** - Thread created but not started
2. **RUNNABLE** - Executing or ready to execute
3. **BLOCKED** - Waiting to acquire a monitor lock
4. **WAITING** - Waiting indefinitely for another thread (wait(), join(), park())
5. **TIMED_WAITING** - Waiting for specified time (sleep(), wait(time), join(time))
6. **TERMINATED** - Execution completed

**State Transitions:**

```
NEW → start() → RUNNABLE
RUNNABLE → synchronized block → BLOCKED → lock acquired → RUNNABLE
RUNNABLE → wait()/join() → WAITING → notify()/notifyAll() → RUNNABLE
RUNNABLE → sleep(time) → TIMED_WAITING → timeout → RUNNABLE
RUNNABLE → task completion → TERMINATED
```

**Key Methods:**

- `getState()` - Returns current thread state
- `isAlive()` - Checks if thread is alive
- `join()` - Wait for thread to complete

---

## 🛠️ Thread Creation Methods

**4 Ways to Create Threads:**

### 1. Extending Thread Class

```java
class MyThread extends Thread {
    public void run() { /* task */ }
}
MyThread t = new MyThread();
t.start();
```

- ❌ Can't extend another class
- ❌ Tight coupling with Thread

### 2. Implementing Runnable Interface ✅ **RECOMMENDED**

```java
class MyTask implements Runnable {
    public void run() { /* task */ }
}
Thread t = new Thread(new MyTask());
t.start();
```

- ✅ Can extend other classes
- ✅ Separation of concerns
- ✅ Reusable task

### 3. Implementing Callable Interface

```java
class MyCallable implements Callable<Integer> {
    public Integer call() { return result; }
}
Future<Integer> future = executor.submit(new MyCallable());
```

- Returns a result
- Can throw checked exceptions
- Used with ExecutorService

### 4. Lambda Expressions

```java
Thread t = new Thread(() -> { /* task */ });
t.start();
```

- Clean and concise
- Functional programming style

---

## ⚔️ Thread vs Runnable

**Key Differences:**

| Aspect               | Thread Class                | Runnable Interface          |
| -------------------- | --------------------------- | --------------------------- |
| Inheritance          | Extends Thread              | Implements Runnable         |
| Multiple Inheritance | ❌ Can't extend other class | ✅ Can extend another class |
| Reusability          | ❌ Less reusable            | ✅ Highly reusable          |
| Coupling             | Tight coupling              | Loose coupling              |
| Design               | Represents a thread         | Represents a task           |
| Object Creation      | One object                  | Two objects (thread+task)   |
| Best Practice        | ❌ Not recommended          | ✅ **Recommended**          |

**Why Runnable is Better:**

1. **Separation of Concerns** - Task logic separate from thread mechanism
2. **Composition over Inheritance** - Can extend another class
3. **Thread Pool Friendly** - Same Runnable can be submitted to executor
4. **Code Reusability** - Same task can run on multiple threads
5. **Better OOP Design** - Follows Single Responsibility Principle

**Example: Sharing Same Runnable**

```java
Runnable task = () -> { /* logic */ };
Thread t1 = new Thread(task);
Thread t2 = new Thread(task);
// OR
executor.submit(task); // Thread pool
```

---

## 🎯 Important Methods

**Thread Control:**

- `start()` - Begins thread execution
- `run()` - Contains code to be executed (don't call directly!)
- `sleep(ms)` - Pauses current thread
- `join()` - Waits for thread to complete
- `interrupt()` - Interrupts a thread
- `isInterrupted()` - Checks interrupt status

**Thread Information:**

- `getName()` / `setName()` - Thread name
- `getId()` - Unique thread ID
- `getPriority()` / `setPriority()` - Thread priority (1-10, default 5)
- `currentThread()` - Returns current thread reference
- `isAlive()` - Check if thread is running

**Thread Priority:**

- `MIN_PRIORITY` = 1
- `NORM_PRIORITY` = 5 (default)
- `MAX_PRIORITY` = 10

---

## ⚡ Quick Interview Points

1. **Thread vs Runnable?** - Always prefer Runnable (separation of concerns, can extend other classes)
2. **Thread lifecycle?** - NEW → RUNNABLE → BLOCKED/WAITING/TIMED_WAITING → TERMINATED
3. **start() vs run()?** - start() creates new thread, run() executes in same thread
4. **Can we start a thread twice?** - No, throws IllegalThreadStateException
5. **Thread creation methods?** - Extend Thread, Implement Runnable, Callable, Lambda
6. **Why threads are lightweight?** - Share same memory space, faster context switching
7. **Default thread priority?** - 5 (NORM_PRIORITY)
8. **Main thread name?** - "main"
