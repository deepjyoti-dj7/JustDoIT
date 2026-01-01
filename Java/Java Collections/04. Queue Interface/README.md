# 📝 Queue Interface - Quick Interview Notes

## 📋 Queue Interface Basics

**What is Queue?**
- **FIFO** - First-In-First-Out (typically)
- Collection for holding elements before processing
- Extends Collection interface
- Two forms of methods: throws exception vs returns special value

**Key Characteristics:**
- **Head** - Element to be removed
- **Tail** - Where elements added
- **Offer/Poll/Peek** - Null-safe operations
- **Add/Remove/Element** - Exception-throwing operations

**Queue Methods:**

| Operation | Throws Exception | Returns Special Value |
|-----------|-----------------|----------------------|
| **Insert** | `add(e)` | `offer(e)` - returns false |
| **Remove** | `remove()` | `poll()` - returns null |
| **Examine** | `element()` | `peek()` - returns null |

```java
Queue<String> queue = new LinkedList<>();

// Add elements
queue.add("A");      // throws IllegalStateException if full
queue.offer("B");    // returns false if full

// Remove elements
String item = queue.remove();  // throws NoSuchElementException if empty
String item2 = queue.poll();   // returns null if empty

// Examine head
String head = queue.element(); // throws NoSuchElementException if empty
String head2 = queue.peek();   // returns null if empty
```

---

## 🔗 LinkedList (as Queue)

**Characteristics:**
- **Implements Queue and Deque**
- **Unbounded** - No fixed capacity
- **Allows null** - Can add null elements
- **Not thread-safe**

**Usage:**
```java
Queue<String> queue = new LinkedList<>();
queue.offer("A");
queue.offer("B");
queue.offer("C");

while(!queue.isEmpty()) {
    String item = queue.poll();  // FIFO: A, B, C
}
```

**When to Use:**
- ✅ Simple FIFO queue
- ✅ Unbounded queue
- ❌ Thread-safe needed
- ❌ Priority ordering needed

---

## 🎯 PriorityQueue

**Characteristics:**
- **Heap-based** - Min heap by default
- **Priority ordering** - Natural order or Comparator
- **Unbounded** - Grows dynamically
- **No null** - Doesn't allow null
- **Not thread-safe**
- **Not FIFO** - Orders by priority

**Internal:**
- Binary heap (array-based)
- Default: min heap (smallest element at head)
- Can use Comparator for custom ordering

**Usage:**
```java
// Natural ordering (min heap)
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(5);
pq.offer(2);
pq.offer(8);
pq.offer(1);
System.out.println(pq.poll());  // 1 (smallest)

// Custom comparator (max heap)
PriorityQueue<Integer> maxHeap = 
    new PriorityQueue<>(Comparator.reverseOrder());
maxHeap.offer(5);
maxHeap.offer(2);
maxHeap.offer(8);
System.out.println(maxHeap.poll());  // 8 (largest)

// Custom objects
class Task implements Comparable<Task> {
    String name;
    int priority;
    
    public int compareTo(Task other) {
        return Integer.compare(this.priority, other.priority);
    }
}

PriorityQueue<Task> tasks = new PriorityQueue<>();
```

**When to Use:**
- ✅ Need priority-based processing
- ✅ Find min/max efficiently
- ✅ Scheduling tasks
- ❌ Need FIFO order
- ❌ Thread-safe needed

**Time Complexity:**
- offer: O(log n)
- poll: O(log n)
- peek: O(1)
- remove(Object): O(n)
- contains: O(n)

---

## 🔄 Deque Interface

**What is Deque?**
- **Double-Ended Queue** - Insert/remove at both ends
- Can be used as **Queue (FIFO)** or **Stack (LIFO)**
- Extends Queue interface

**Deque Methods:**

| Operation | Head (First) | Tail (Last) |
|-----------|-------------|-------------|
| **Insert** | `addFirst(e)` / `offerFirst(e)` | `addLast(e)` / `offerLast(e)` |
| **Remove** | `removeFirst()` / `pollFirst()` | `removeLast()` / `pollLast()` |
| **Examine** | `getFirst()` / `peekFirst()` | `getLast()` / `peekLast()` |

**Queue equivalent methods:**
```java
offer(e)  → offerLast(e)
poll()    → pollFirst()
peek()    → peekFirst()
```

**Stack equivalent methods:**
```java
push(e)   → addFirst(e)
pop()     → removeFirst()
peek()    → peekFirst()
```

---

## 📦 ArrayDeque

**Characteristics:**
- **Resizable array** - Circular array implementation
- **Faster than LinkedList** - Better cache locality
- **No null** - Doesn't allow null elements
- **Not thread-safe**
- **Preferred over Stack** - For stack operations

**Internal:**
- Circular array
- Maintains head and tail pointers
- Grows by doubling when full

**Usage as Queue (FIFO):**
```java
Deque<String> queue = new ArrayDeque<>();
queue.offerLast("A");   // or offer()
queue.offerLast("B");
queue.offerLast("C");
String item = queue.pollFirst();  // or poll() → "A"
```

**Usage as Stack (LIFO):**
```java
Deque<String> stack = new ArrayDeque<>();
stack.push("A");  // or addFirst()
stack.push("B");
stack.push("C");
String item = stack.pop();  // or removeFirst() → "C"
String top = stack.peek();  // "B"
```

**When to Use:**
- ✅ Stack operations (instead of Stack class)
- ✅ Queue operations (faster than LinkedList)
- ✅ Deque operations
- ❌ Need null elements
- ❌ Thread-safe needed

**Time Complexity:**
- All operations: O(1) amortized

---

## 🔒 BlockingQueue Interface

**What is BlockingQueue?**
- **Thread-safe queue** - Concurrent operations
- **Blocking operations** - Waits if queue full/empty
- Used in **producer-consumer** patterns
- Extends Queue interface

**BlockingQueue Methods:**

| Operation | Throws Exception | Special Value | Blocks | Times Out |
|-----------|-----------------|---------------|---------|-----------|
| **Insert** | `add(e)` | `offer(e)` | `put(e)` | `offer(e, time, unit)` |
| **Remove** | `remove()` | `poll()` | `take()` | `poll(time, unit)` |
| **Examine** | `element()` | `peek()` | N/A | N/A |

**Common Implementations:**

### 1️⃣ ArrayBlockingQueue
```java
// Bounded, FIFO queue
BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);

// Producer
queue.put("item");  // Blocks if full

// Consumer
String item = queue.take();  // Blocks if empty
```

**Characteristics:**
- **Bounded** - Fixed capacity
- **FIFO** - Array-based
- **Fairness option** - Fair/unfair locking

### 2️⃣ LinkedBlockingQueue
```java
// Optionally bounded, FIFO queue
BlockingQueue<String> queue = new LinkedBlockingQueue<>(); // Unbounded
BlockingQueue<String> bounded = new LinkedBlockingQueue<>(100); // Bounded
```

**Characteristics:**
- **Optionally bounded** - Can be bounded or unbounded
- **FIFO** - Linked node based
- **Higher throughput** - Separate locks for put/take

### 3️⃣ PriorityBlockingQueue
```java
// Unbounded, priority-ordered queue
BlockingQueue<Integer> queue = new PriorityBlockingQueue<>();
queue.put(5);
queue.put(2);
queue.put(8);
Integer min = queue.take();  // 2 (priority order)
```

**Characteristics:**
- **Unbounded** - No capacity limit
- **Priority ordering** - Natural or Comparator
- **Blocking take** - put() never blocks

### 4️⃣ DelayQueue
```java
// Unbounded queue of Delayed elements
class DelayedTask implements Delayed {
    long startTime;
    
    public long getDelay(TimeUnit unit) {
        return unit.convert(startTime - System.currentTimeMillis(), 
                           TimeUnit.MILLISECONDS);
    }
    
    public int compareTo(Delayed other) {
        return Long.compare(this.getDelay(TimeUnit.MILLISECONDS),
                           other.getDelay(TimeUnit.MILLISECONDS));
    }
}

DelayQueue<DelayedTask> queue = new DelayQueue<>();
```

**Characteristics:**
- **Delayed elements** - Elements available after delay
- **Unbounded**
- **Scheduling** - Task scheduling

### 5️⃣ SynchronousQueue
```java
// Zero-capacity queue
BlockingQueue<String> queue = new SynchronousQueue<>();

// Each put() waits for take()
new Thread(() -> queue.put("item")).start();
String item = queue.take();  // Handoff
```

**Characteristics:**
- **Zero capacity** - No storage
- **Direct handoff** - put() waits for take()
- **Fairness option**

---

## ⚖️ Queue Implementations Comparison

| Queue Type | Thread-Safe | Bounded | Null | Order | Use Case |
|------------|-------------|---------|------|-------|----------|
| **LinkedList** | No | No | Yes | FIFO | Simple queue |
| **PriorityQueue** | No | No | No | Priority | Priority processing |
| **ArrayDeque** | No | No | No | FIFO/LIFO | Stack/Queue |
| **ArrayBlockingQueue** | Yes | Yes | No | FIFO | Bounded producer-consumer |
| **LinkedBlockingQueue** | Yes | Optional | No | FIFO | Unbounded producer-consumer |
| **PriorityBlockingQueue** | Yes | No | No | Priority | Priority + concurrent |
| **SynchronousQueue** | Yes | Yes (0) | No | N/A | Direct handoff |
| **DelayQueue** | Yes | No | No | Delay | Scheduled tasks |

---

## 🎯 Quick Interview Points

1. **Queue order?** - FIFO (typically)
2. **Queue vs Deque?** - Deque is double-ended (both ends)
3. **offer() vs add()?** - offer() returns false, add() throws exception
4. **poll() vs remove()?** - poll() returns null, remove() throws exception
5. **peek() vs element()?** - peek() returns null, element() throws exception
6. **PriorityQueue order?** - Priority (min heap default)
7. **PriorityQueue allows null?** - No
8. **PriorityQueue time complexity?** - O(log n) offer/poll, O(1) peek
9. **ArrayDeque vs LinkedList?** - ArrayDeque faster, no null
10. **ArrayDeque vs Stack?** - ArrayDeque preferred for stack operations
11. **BlockingQueue use?** - Producer-consumer pattern
12. **put() vs offer()?** - put() blocks, offer() returns false
13. **take() vs poll()?** - take() blocks, poll() returns null
14. **ArrayBlockingQueue bounded?** - Yes, fixed capacity
15. **LinkedBlockingQueue bounded?** - Optionally bounded
16. **PriorityBlockingQueue bounded?** - No, unbounded
17. **SynchronousQueue capacity?** - Zero
18. **DelayQueue use?** - Delayed elements, scheduling
19. **Which queue for stack?** - ArrayDeque (Deque)
20. **Thread-safe queue?** - BlockingQueue implementations
21. **Deque as stack methods?** - push(), pop(), peek()
22. **Deque as queue methods?** - offer(), poll(), peek()
23. **Fairness in blocking queues?** - ArrayBlockingQueue, SynchronousQueue
24. **LinkedBlockingQueue throughput?** - Higher (separate put/take locks)
25. **When use SynchronousQueue?** - Direct handoff, task delegation
