# Event Loop & Concurrency - Quick Summary & Interview Guide

## 📋 Quick Notes

### 1. Call Stack

**How It Works:**
```javascript
function first() {
  console.log('First');
  second();
  console.log('First again');
}

function second() {
  console.log('Second');
  third();
}

function third() {
  console.log('Third');
}

first();

// Call Stack Visualization:
// Step 1: [first]
// Step 2: [first, second]
// Step 3: [first, second, third]
// Step 4: [first, second]  (third returns)
// Step 5: [first]  (second returns)
// Step 6: []  (first returns)

// Output:
// First
// Second
// Third
// First again
```

**Stack Overflow:**
```javascript
// Infinite recursion
function recursion() {
  recursion();  // No base case
}

recursion();  // RangeError: Maximum call stack size exceeded

// Proper recursion
function countdown(n) {
  if (n === 0) return;  // Base case
  console.log(n);
  countdown(n - 1);
}

countdown(5);  // 5, 4, 3, 2, 1

// Tail call optimization (limited browser support)
function tailRecursion(n, acc = 0) {
  if (n === 0) return acc;
  return tailRecursion(n - 1, acc + n);  // Last operation is return
}
```

---

### 2. Event Loop Phases

**Architecture:**
```
Call Stack (Sync code)
     ↓
Microtask Queue (Promises, queueMicrotask)
     ↓
Macrotask Queue (setTimeout, setInterval)
     ↓
Render (if needed)
     ↓
(Repeat)
```

**Execution Order:**
```javascript
console.log('1: Sync');

setTimeout(() => console.log('2: Macro'), 0);

Promise.resolve()
  .then(() => console.log('3: Micro'))
  .then(() => console.log('4: Micro'));

queueMicrotask(() => console.log('5: Micro'));

setTimeout(() => console.log('6: Macro'), 0);

console.log('7: Sync');

// Output:
// 1: Sync
// 7: Sync
// 3: Micro
// 5: Micro
// 4: Micro  (chained promise)
// 2: Macro
// 6: Macro

// Explanation:
// 1. Run all synchronous code: 1, 7
// 2. Run ALL microtasks: 3, 5, 4
// 3. Run ONE macrotask: 2
// 4. Check microtasks (none)
// 5. Run next macrotask: 6
```

---

### 3. Microtasks vs Macrotasks

**Microtasks (Higher Priority):**
```javascript
// Promise callbacks
Promise.resolve().then(() => console.log('Promise'));

// queueMicrotask
queueMicrotask(() => console.log('Microtask'));

// MutationObserver
const observer = new MutationObserver(() => {
  console.log('DOM changed');
});
observer.observe(document.body, { childList: true });

// process.nextTick (Node.js only - highest priority)
process.nextTick(() => console.log('Next tick'));
```

**Macrotasks (Lower Priority):**
```javascript
// setTimeout
setTimeout(() => console.log('Timeout'), 0);

// setInterval
const interval = setInterval(() => console.log('Interval'), 1000);

// setImmediate (Node.js only)
setImmediate(() => console.log('Immediate'));

// I/O operations
fs.readFile('file.txt', () => console.log('File read'));

// UI rendering events
requestAnimationFrame(() => console.log('Animation frame'));
```

**Complete Example:**
```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout 1');
  Promise.resolve().then(() => console.log('Promise in Timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    setTimeout(() => console.log('Timeout in Promise'), 0);
  })
  .then(() => console.log('Promise 2'));

queueMicrotask(() => console.log('Microtask'));

setTimeout(() => console.log('Timeout 2'), 0);

console.log('End');

// Output:
// Start
// End
// Promise 1
// Microtask
// Promise 2
// Timeout 1
// Promise in Timeout  (microtask runs after current macrotask)
// Timeout in Promise
// Timeout 2
```

---

### 4. Async Execution Patterns

**Sequential (one after another):**
```javascript
async function sequential() {
  console.time('sequential');
  
  const user = await fetchUser();      // 1 second
  const posts = await fetchPosts();    // 1 second
  const comments = await fetchComments(); // 1 second
  
  console.timeEnd('sequential');  // ~3 seconds
  return { user, posts, comments };
}
```

**Parallel (all at once):**
```javascript
async function parallel() {
  console.time('parallel');
  
  const [user, posts, comments] = await Promise.all([
    fetchUser(),      // All start together
    fetchPosts(),
    fetchComments()
  ]);
  
  console.timeEnd('parallel');  // ~1 second (longest task)
  return { user, posts, comments };
}
```

**Concurrent (controlled parallelism):**
```javascript
async function concurrent(urls, limit = 3) {
  const results = [];
  const executing = [];
  
  for (const url of urls) {
    const promise = fetch(url).then(r => r.json());
    results.push(promise);
    
    if (limit <= urls.length) {
      const executing_promise = promise.then(() => {
        executing.splice(executing.indexOf(executing_promise), 1);
      });
      
      executing.push(executing_promise);
      
      if (executing.length >= limit) {
        await Promise.race(executing);  // Wait for one to finish
      }
    }
  }
  
  return Promise.all(results);
}

// Fetches max 3 at a time
concurrent([...Array(10)].map((_, i) => `/api/item/${i}`), 3);
```

---

### 5. Task Scheduling

**setTimeout vs setImmediate vs process.nextTick:**
```javascript
// Node.js execution order
console.log('Start');

setTimeout(() => console.log('setTimeout'), 0);

setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick'));

Promise.resolve().then(() => console.log('Promise'));

console.log('End');

// Output (Node.js):
// Start
// End
// nextTick  (highest priority)
// Promise   (microtask)
// setTimeout (macrotask)
// setImmediate (macrotask, after setTimeout)

// Browser (no setImmediate or nextTick):
// Start
// End
// Promise
// setTimeout
```

**requestAnimationFrame:**
```javascript
// Runs before next repaint (60fps = ~16.67ms)
function animate() {
  // Update DOM
  element.style.left = position + 'px';
  
  requestAnimationFrame(animate);  // Next frame
}

requestAnimationFrame(animate);

// Better than setTimeout for animations
// setTimeout - not synced with refresh rate
setTimeout(() => {
  element.style.left = position + 'px';
}, 16);  // May cause jank

// requestIdleCallback - runs when browser is idle
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    doWork(tasks.pop());
  }
});
```

---

### 6. Blocking vs Non-Blocking

**Blocking Code:**
```javascript
// ❌ Blocks entire thread
function blockingLoop() {
  const start = Date.now();
  
  while (Date.now() - start < 3000) {
    // UI freezes, no events processed
  }
  
  console.log('Done');  // After 3 seconds
}

blockingLoop();
console.log('Never runs until above completes');

// Synchronous file read (Node.js)
const data = fs.readFileSync('large-file.txt');  // Blocks
console.log('File read');
```

**Non-Blocking Code:**
```javascript
// ✅ Doesn't block
function nonBlocking() {
  setTimeout(() => {
    console.log('Done');
  }, 3000);
  
  console.log('Continues immediately');
}

nonBlocking();  // Returns immediately

// Async file read (Node.js)
fs.readFile('large-file.txt', (err, data) => {
  console.log('File read');
});
console.log('Continues');  // Runs before file read

// Breaking up long tasks
function processLargeArray(array) {
  let index = 0;
  
  function chunk() {
    const endIndex = Math.min(index + 100, array.length);
    
    for (; index < endIndex; index++) {
      processItem(array[index]);
    }
    
    if (index < array.length) {
      setTimeout(chunk, 0);  // Yield to browser
    }
  }
  
  chunk();
}
```

---

### 7. Race Conditions

**Problem:**
```javascript
let count = 0;

async function increment() {
  const current = count;  // Read
  await delay(10);        // Async operation
  count = current + 1;    // Write
}

// Race condition
Promise.all([increment(), increment(), increment()]);
// Expected: count = 3
// Actual: count = 1 (all read 0, all write 1)
```

**Solution with Locks:**
```javascript
class Mutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }
  
  async lock() {
    if (!this.locked) {
      this.locked = true;
      return;
    }
    
    await new Promise(resolve => this.queue.push(resolve));
  }
  
  unlock() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.locked = false;
    }
  }
}

const mutex = new Mutex();
let count = 0;

async function safeIncrement() {
  await mutex.lock();
  
  try {
    const current = count;
    await delay(10);
    count = current + 1;
  } finally {
    mutex.unlock();
  }
}

// Now safe
Promise.all([safeIncrement(), safeIncrement(), safeIncrement()]);
// count = 3 ✓
```

---

### 8. Debouncing and Throttling

**Debouncing (delay until inactivity):**
```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage: Search on typing
const searchInput = document.querySelector('#search');

const debouncedSearch = debounce((value) => {
  console.log('Searching for:', value);
  fetchResults(value);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Types "hello" → waits 300ms after last keystroke → searches once
```

**Throttling (limit frequency):**
```javascript
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage: Scroll event
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 200);

window.addEventListener('scroll', throttledScroll);

// Scrolling → logs at most every 200ms
```

**Advanced: Leading and Trailing:**
```javascript
function debounceAdvanced(func, delay, options = {}) {
  let timeoutId;
  let lastArgs;
  
  return function(...args) {
    lastArgs = args;
    
    const callNow = options.leading && !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      if (options.trailing !== false) {
        func.apply(this, lastArgs);
      }
      timeoutId = null;
    }, delay);
    
    if (callNow) {
      func.apply(this, args);
    }
  };
}
```

---

## 🎯 Interview Questions & Answers

### Q1: Explain the Event Loop in detail.

**Answer:**

The Event Loop is JavaScript's concurrency model that handles asynchronous operations.

**How it works:**
```javascript
// 1. Execute synchronous code (call stack)
console.log('1: Sync');

// 2. Queue async callbacks
setTimeout(() => console.log('2: Macro'), 0);
Promise.resolve().then(() => console.log('3: Micro'));

console.log('4: Sync');

// Event Loop Steps:
// Step 1: Execute all sync code (call stack)
//   → console.log('1')
//   → setTimeout (queues callback)
//   → Promise.then (queues callback)
//   → console.log('4')
//   Call stack is now empty

// Step 2: Process ALL microtasks
//   → Promise callback runs
//   → console.log('3')
//   No more microtasks

// Step 3: Process ONE macrotask
//   → setTimeout callback runs
//   → console.log('2')

// Step 4: Repeat from Step 2

// Output: 1, 4, 3, 2
```

**Visual Flow:**
```
┌─────────────────────┐
│    Call Stack       │  ← Sync code executes
└─────────────────────┘
         ↓
    (Stack empty?)
         ↓
┌─────────────────────┐
│  Microtask Queue    │  ← Process ALL
│  - Promises         │
│  - queueMicrotask   │
└─────────────────────┘
         ↓
    (Queue empty?)
         ↓
┌─────────────────────┐
│  Macrotask Queue    │  ← Process ONE
│  - setTimeout       │
│  - setInterval      │
└─────────────────────┘
         ↓
    Render (if needed)
         ↓
    (Loop continues)
```

**Key Points:**
- Single-threaded execution
- Microtasks have priority over macrotasks
- All microtasks run before next macrotask
- One macrotask per loop iteration

---

### Q2: What's the difference between microtasks and macrotasks?

**Answer:**

```javascript
console.log('Start');

// Macrotasks
setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout 2'), 0);

// Microtasks
Promise.resolve().then(() => console.log('Promise 1'));
Promise.resolve().then(() => console.log('Promise 2'));
queueMicrotask(() => console.log('Microtask'));

console.log('End');

// Output:
// Start
// End
// Promise 1       ← All microtasks first
// Promise 2
// Microtask
// Timeout 1       ← Then macrotasks (one per iteration)
// Timeout 2
```

**Comparison Table:**

| Feature | Microtasks | Macrotasks |
|---------|-----------|------------|
| **Priority** | Higher | Lower |
| **When** | After current task | After microtasks |
| **How many** | ALL in queue | ONE per loop |
| **Examples** | Promises, queueMicrotask | setTimeout, I/O |
| **Use case** | State updates, cleanup | Scheduled tasks |

**Starving Example:**
```javascript
// ❌ Infinite microtasks block macrotasks
function infiniteMicro() {
  Promise.resolve().then(infiniteMicro);
}

infiniteMicro();

setTimeout(() => {
  console.log('Never runs');  // Blocked forever
}, 0);

// ✅ Macrotasks don't block each other
function safeLoop() {
  setTimeout(safeLoop, 0);
}

safeLoop();  // Browser can process other events
```

---

### Q3: What causes the call stack to overflow?

**Answer:**

**Stack overflow occurs with excessive recursion:**

```javascript
// ❌ No base case
function recursive() {
  recursive();  // Keeps adding to stack
}

recursive();  // RangeError: Maximum call stack size exceeded

// ❌ Base case never reached
function countdown(n) {
  if (n === 0) return;
  countdown(n + 1);  // Goes up instead of down
}

countdown(1);  // Stack overflow

// ✅ Proper recursion
function factorial(n) {
  if (n <= 1) return 1;  // Base case
  return n * factorial(n - 1);
}

factorial(5);  // 120

// ✅ Convert to iteration
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// ✅ Tail call optimization (limited support)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc);  // Tail position
}

// ✅ Trampoline pattern
function trampoline(fn) {
  while (typeof fn === 'function') {
    fn = fn();
  }
  return fn;
}

function factorialTrampoline(n, acc = 1) {
  if (n <= 1) return acc;
  return () => factorialTrampoline(n - 1, n * acc);
}

trampoline(() => factorialTrampoline(100000));  // No overflow
```

---

### Q4: How do you handle race conditions in async code?

**Answer:**

```javascript
// Problem: Race condition
let data = null;

async function fetchData() {
  const response = await fetch('/api/data');
  data = await response.json();  // Multiple calls overwrite each other
}

fetchData();
fetchData();  // Which one wins?

// Solution 1: Request deduplication
const requestCache = new Map();

async function fetchDataOnce(url) {
  if (requestCache.has(url)) {
    return requestCache.get(url);  // Return existing promise
  }
  
  const promise = fetch(url).then(r => r.json());
  requestCache.set(url, promise);
  
  try {
    const data = await promise;
    return data;
  } finally {
    requestCache.delete(url);  // Clean up after completion
  }
}

// Solution 2: Cancel previous requests
let currentController = null;

async function fetchWithCancellation(url) {
  if (currentController) {
    currentController.abort();  // Cancel previous
  }
  
  currentController = new AbortController();
  
  try {
    const response = await fetch(url, {
      signal: currentController.signal
    });
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request cancelled');
    }
    throw error;
  }
}

// Solution 3: Use sequence number
let requestId = 0;

async function fetchWithSequence(url) {
  const myId = ++requestId;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (myId === requestId) {  // Only process latest
    return data;
  }
  
  return null;  // Discard old response
}

// Solution 4: Mutex lock
class Mutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }
  
  async lock() {
    while (this.locked) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    this.locked = true;
  }
  
  unlock() {
    const resolve = this.queue.shift();
    if (resolve) {
      resolve();
    } else {
      this.locked = false;
    }
  }
}

const mutex = new Mutex();

async function criticalSection() {
  await mutex.lock();
  try {
    // Only one execution at a time
    await doWork();
  } finally {
    mutex.unlock();
  }
}
```

---

### Q5: What's the output of this code?

```javascript
async function test() {
  console.log('1');
  
  setTimeout(() => console.log('2'), 0);
  
  await Promise.resolve();
  
  console.log('3');
  
  setTimeout(() => console.log('4'), 0);
}

console.log('5');

test();

Promise.resolve().then(() => console.log('6'));

console.log('7');
```

**Answer:**

```javascript
// Output: 5, 1, 7, 3, 6, 2, 4

// Step-by-step execution:

// 1. Sync code
console.log('5');  // → "5"

// 2. Call test()
console.log('1');  // → "1"
// Queue setTimeout('2') in macrotask queue
// Encounter await - pause function, queue continuation as microtask

// 3. Back to main sync code
// Queue Promise.then('6') in microtask queue
console.log('7');  // → "7"

// 4. Call stack empty - process microtasks
// Resume test() from await
console.log('3');  // → "3"
// Queue setTimeout('4') in macrotask queue
// test() completes

// Process queued Promise
console.log('6');  // → "6"

// 5. Microtasks done - process macrotasks (one at a time)
console.log('2');  // → "2"

// 6. Next macrotask
console.log('4');  // → "4"

// Final output: 5, 1, 7, 3, 6, 2, 4
```

---

### Q6: Explain debouncing vs throttling with examples.

**Answer:**

**Debouncing - Wait for inactivity:**
```javascript
function debounce(func, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);  // Reset timer
    
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Use case: Search input
const search = debounce((query) => {
  console.log('Searching:', query);
}, 300);

input.addEventListener('input', (e) => search(e.target.value));

// User types "hello":
// h → wait 300ms → e (timer reset)
// e → wait 300ms → l (timer reset)
// l → wait 300ms → l (timer reset)
// l → wait 300ms → o (timer reset)
// o → wait 300ms → SEARCH "hello" ✓
// Only one API call made
```

**Throttling - Limit frequency:**
```javascript
function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Use case: Scroll event
const handleScroll = throttle(() => {
  console.log('Scrolling:', window.scrollY);
}, 200);

window.addEventListener('scroll', handleScroll);

// User scrolls continuously for 1 second:
// 0ms → Log ✓
// 50ms → Ignored
// 100ms → Ignored
// 200ms → Log ✓
// 300ms → Ignored
// 400ms → Log ✓
// ...
// Logs every 200ms maximum
```

**Comparison:**

| Feature | Debounce | Throttle |
|---------|----------|----------|
| **When** | After inactivity | At regular intervals |
| **Fires** | Once at end | Multiple times |
| **Use case** | Search input | Scroll/resize events |
| **Example** | Wait for user to stop typing | Update scroll position |

---

### Q7: How does requestAnimationFrame differ from setTimeout?

**Answer:**

```javascript
// setTimeout - Not synced with display refresh
let position = 0;

function animateSetTimeout() {
  position += 5;
  element.style.left = position + 'px';
  
  setTimeout(animateSetTimeout, 16);  // Try to match 60fps
}

// Problems:
// - Not synced with screen refresh
// - Runs even when tab is hidden (wastes CPU)
// - Can cause frame skipping or jank

// requestAnimationFrame - Synced with browser paint
function animateRAF() {
  position += 5;
  element.style.left = position + 'px';
  
  requestAnimationFrame(animateRAF);
}

requestAnimationFrame(animateRAF);

// Benefits:
// ✅ Runs before next repaint (smooth 60fps)
// ✅ Pauses when tab hidden (saves CPU)
// ✅ Browser optimized
// ✅ Automatically matches display refresh rate

// Advanced: Delta time for smooth animation
let lastTime = 0;

function animate(currentTime) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  
  position += speed * deltaTime * 0.001;  // Frame-rate independent
  element.style.left = position + 'px';
  
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// Cancel animation
const animationId = requestAnimationFrame(animate);
cancelAnimationFrame(animationId);
```

**Comparison:**

| Feature | setTimeout | requestAnimationFrame |
|---------|-----------|----------------------|
| **Timing** | Fixed delay | Synced with refresh |
| **Rate** | May not match display | ~60fps (or display rate) |
| **Hidden tab** | Runs | Pauses |
| **Use case** | Delays, scheduling | Animations |

---

### Q8: What is the difference between process.nextTick and setImmediate in Node.js?

**Answer:**

```javascript
// Node.js execution order
console.log('Start');

setTimeout(() => console.log('setTimeout'), 0);

setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick'));

Promise.resolve().then(() => console.log('Promise'));

console.log('End');

// Output:
// Start
// End
// nextTick      ← Runs before microtasks
// Promise       ← Microtask
// setTimeout    ← Macrotask
// setImmediate  ← Macrotask (after setTimeout)

// Priority order in Node.js:
// 1. Synchronous code
// 2. process.nextTick
// 3. Microtasks (Promises)
// 4. Macrotasks (setTimeout, setInterval)
// 5. setImmediate
```

**When to use:**

```javascript
// process.nextTick - High priority, before I/O
// Use for: Error handling, cleanup
process.nextTick(() => {
  // Runs before any I/O
  console.log('Critical cleanup');
});

// setImmediate - After I/O
// Use for: Breaking up CPU-intensive tasks
setImmediate(() => {
  // Allows I/O to happen first
  console.log('Less urgent work');
});

// Example: Breaking up work
function processLargeArray(array, callback) {
  let index = 0;
  
  function processChunk() {
    const end = Math.min(index + 1000, array.length);
    
    while (index < end) {
      processItem(array[index++]);
    }
    
    if (index < array.length) {
      setImmediate(processChunk);  // Allow I/O between chunks
    } else {
      callback();
    }
  }
  
  processChunk();
}
```

**Warning: nextTick can starve I/O:**
```javascript
// ❌ Bad: Blocks I/O
function recurseNextTick() {
  process.nextTick(recurseNextTick);
}

recurseNextTick();
// I/O never happens - event loop stuck

// ✅ Good: Allows I/O
function recurseImmediate() {
  setImmediate(recurseImmediate);
}

recurseImmediate();
// I/O can happen between calls
```

---

### Q9: How do you prevent blocking the main thread?

**Answer:**

```javascript
// ❌ Problem: Long synchronous task blocks UI
function processLargeData(data) {
  for (let i = 0; i < data.length; i++) {
    heavyComputation(data[i]);  // UI frozen
  }
}

processLargeData(millionItems);  // Browser freezes

// ✅ Solution 1: Break into chunks with setTimeout
function processInChunks(data, chunkSize = 100) {
  let index = 0;
  
  function processChunk() {
    const end = Math.min(index + chunkSize, data.length);
    
    for (; index < end; index++) {
      heavyComputation(data[index]);
    }
    
    if (index < data.length) {
      setTimeout(processChunk, 0);  // Yield to browser
    } else {
      console.log('Done');
    }
  }
  
  processChunk();
}

// ✅ Solution 2: Web Workers (separate thread)
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ data: largeArray });

worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

// worker.js
self.onmessage = (e) => {
  const result = heavyComputation(e.data.data);
  self.postMessage(result);
};

// ✅ Solution 3: requestIdleCallback
function processDuringIdle(data) {
  let index = 0;
  
  function workDuringIdle(deadline) {
    while (deadline.timeRemaining() > 0 && index < data.length) {
      heavyComputation(data[index++]);
    }
    
    if (index < data.length) {
      requestIdleCallback(workDuringIdle);
    }
  }
  
  requestIdleCallback(workDuringIdle);
}

// ✅ Solution 4: Async/await with yields
async function processAsync(data) {
  for (let i = 0; i < data.length; i++) {
    heavyComputation(data[i]);
    
    if (i % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
```

---

### Q10: Implement a task scheduler that limits concurrent operations.

**Answer:**

```javascript
class TaskScheduler {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  async add(task) {
    while (this.running >= this.concurrency) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    
    try {
      return await task();
    } finally {
      this.running--;
      
      const resolve = this.queue.shift();
      if (resolve) {
        resolve();
      }
    }
  }
}

// Usage
const scheduler = new TaskScheduler(3);  // Max 3 concurrent

const tasks = Array.from({ length: 10 }, (_, i) => 
  () => fetch(`/api/item/${i}`).then(r => r.json())
);

const results = await Promise.all(
  tasks.map(task => scheduler.add(task))
);

// Advanced: With priority queue
class PriorityScheduler {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  async add(task, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.process();
    });
  }
  
  async process() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { task, resolve, reject } = this.queue.shift();
      this.running++;
      
      task()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this.running--;
          this.process();
        });
    }
  }
}

// Usage with priority
const priorityScheduler = new PriorityScheduler(3);

priorityScheduler.add(lowPriorityTask, 1);
priorityScheduler.add(highPriorityTask, 10);  // Runs first
priorityScheduler.add(mediumPriorityTask, 5);
```

---

## 🎓 Key Takeaways

✅ Event loop processes: Sync → Microtasks → One Macrotask → Repeat  
✅ Microtasks (Promises) have higher priority than macrotasks  
✅ All microtasks run before the next macrotask  
✅ Stack overflow from infinite/excessive recursion  
✅ Debounce delays until inactivity, throttle limits frequency  
✅ requestAnimationFrame syncs with browser refresh (better than setTimeout)  
✅ Web Workers for CPU-intensive tasks (separate thread)  
✅ Break long tasks into chunks to prevent blocking  
✅ Race conditions need synchronization (locks, deduplication)  
✅ Task schedulers limit concurrent operations

---

## 📚 Practice Tips

1. Trace execution order for complex event loop scenarios
2. Implement debounce and throttle from scratch
3. Build a task queue with concurrency control
4. Create animations with requestAnimationFrame
5. Practice identifying and fixing race conditions

---

**Next Topic:** Memory Management (Garbage Collection, Memory Leaks, Optimization)
