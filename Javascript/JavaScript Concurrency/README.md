# JavaScript Concurrency - Complete Study Guide

Comprehensive guide to JavaScript concurrency, asynchronous programming, Web Workers, parallel processing, and synchronization with in-depth explanations, practical examples, and interview preparation.

---

## 📋 Table of Contents

1. [Event Loop & Async Basics](#1-event-loop--async-basics)
2. [Promises](#2-promises)
3. [Async/Await](#3-asyncawait)
4. [Web Workers](#4-web-workers)
5. [SharedArrayBuffer & Atomics](#5-sharedarraybuffer--atomics)
6. [Race Conditions & Solutions](#6-race-conditions--solutions)
7. [Parallel Processing](#7-parallel-processing)
8. [Concurrency Patterns](#8-concurrency-patterns)
9. [Performance & Best Practices](#9-performance--best-practices)
10. [Interview Questions & Answers](#-interview-questions--answers)

---

## 📚 Detailed Topics

### 1. Event Loop & Async Basics

#### **Event Loop**
**Core Concepts:**
- **Call Stack**: LIFO structure for function execution, synchronous operations
- **Task Queue (Macrotask)**: setTimeout, setInterval, I/O operations
- **Microtask Queue**: Promises, queueMicrotask, MutationObserver
- **Execution Order**: Call stack → Microtasks → Macrotasks → Render

**How It Works:**
```javascript
console.log('1')                    // Call stack
setTimeout(() => console.log('2'), 0)  // Macrotask queue
Promise.resolve().then(() => console.log('3'))  // Microtask queue
console.log('4')                    // Call stack
// Output: 1, 4, 3, 2
```

**Common Patterns:**
```javascript
// Defer execution
queueMicrotask(() => doSomething())  // After current script
setTimeout(() => doSomething(), 0)    // After microtasks

// Break long tasks
function processLargeArray(arr) {
  const chunk = arr.splice(0, 100)
  processChunk(chunk)
  if (arr.length > 0) {
    setTimeout(() => processLargeArray(arr), 0)  // Yield to browser
  }
}
```

---

#### **Callbacks**
**Basic Pattern:**
```javascript
function fetchData(url, callback) {
  // Async operation
  setTimeout(() => {
    const data = { id: 1, name: 'John' }
    callback(null, data)  // Convention: error first
  }, 1000)
}

// Usage
fetchData('/api/user', (error, data) => {
  if (error) return console.error(error)
  console.log(data)
})
```

**Callback Hell:**
```javascript
// ❌ Anti-pattern: Pyramid of doom
getData(url1, (err1, data1) => {
  if (err1) return handleError(err1)
  getData(url2, (err2, data2) => {
    if (err2) return handleError(err2)
    getData(url3, (err3, data3) => {
      if (err3) return handleError(err3)
      // Finally use all data
    })
  })
})

// ✅ Better: Use Promises or async/await
const data1 = await getData(url1)
const data2 = await getData(url2)
const data3 = await getData(url3)
```

**Error Handling:**
- **Error-first callback**: `callback(error, result)` - Node.js convention
- **Try-catch**: Cannot catch async errors in callbacks
- **Domain/EventEmitter**: For complex error handling scenarios

---

### 2. Promises

#### **Promise Basics**
**States:**
- **Pending**: Initial state, not fulfilled or rejected
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

**Creation:**
```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true
    if (success) {
      resolve('Success!')  // Fulfill
    } else {
      reject(new Error('Failed'))  // Reject
    }
  }, 1000)
})
```

**Static Methods:**
```javascript
// Create resolved/rejected promises
Promise.resolve(value)           // Immediately resolved
Promise.reject(error)            // Immediately rejected

// Array operations
Promise.all([p1, p2, p3])       // All must resolve, fails fast
Promise.allSettled([p1, p2])    // Waits for all (ES2020)
Promise.race([p1, p2])          // First to settle wins
Promise.any([p1, p2])           // First to resolve wins (ES2021)
```

---

#### **Promise Chaining**
**Then/Catch:**
```javascript
fetch('/api/data')
  .then(response => response.json())
  .then(data => processData(data))
  .then(result => saveResult(result))
  .catch(error => console.error(error))
  .finally(() => cleanup())
```

**Common Patterns:**
```javascript
// Sequential execution
const result1 = await promise1()
const result2 = await promise2(result1)
const result3 = await promise3(result2)

// Parallel execution
const [result1, result2, result3] = await Promise.all([
  promise1(),
  promise2(),
  promise3()
])

// Retry logic
async function retry(fn, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxAttempts - 1) throw error
      await sleep(Math.pow(2, i) * 1000)  // Exponential backoff
    }
  }
}

// Timeout wrapper
function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ])
}
```

---

### 3. Async/Await

#### **Async Functions**
**Syntax:**
```javascript
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  const data = await response.json()
  return data  // Automatically wrapped in Promise
}

// Arrow function
const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

**Error Handling:**
```javascript
// Try-catch
async function getData() {
  try {
    const data = await fetchData()
    return data
  } catch (error) {
    console.error('Failed:', error)
    return null  // Fallback
  }
}

// Higher-order function wrapper
const asyncHandler = (fn) => async (...args) => {
  try {
    return await fn(...args)
  } catch (error) {
    console.error(error)
    throw error
  }
}

const safeFunction = asyncHandler(async (id) => {
  return await fetchUser(id)
})
```

**Await Patterns:**
```javascript
// ❌ Sequential (slow)
const user = await fetchUser(1)
const posts = await fetchPosts(1)
const comments = await fetchComments(1)
// Total: 3 seconds (1+1+1)

// ✅ Parallel (fast)
const [user, posts, comments] = await Promise.all([
  fetchUser(1),
  fetchPosts(1),
  fetchComments(1)
])
// Total: 1 second (max of all)

// ✅ Sequential when dependent
const user = await fetchUser(1)
const posts = await fetchPosts(user.id)  // Needs user.id
```

**Top-Level Await (ES2022):**
```javascript
// In modules only
const data = await fetch('/api/config')
const config = await data.json()
```

---

### 4. Web Workers

#### **Worker Basics**
**Creating Workers:**
```javascript
// main.js
const worker = new Worker('worker.js')

worker.onmessage = (event) => {
  console.log('Result:', event.data)
}

worker.onerror = (error) => {
  console.error('Worker error:', error)
}

worker.postMessage({ task: 'compute', value: 42 })

// worker.js
self.onmessage = (event) => {
  const { task, value } = event.data
  
  if (task === 'compute') {
    const result = expensiveComputation(value)
    self.postMessage(result)
  }
}
```

**Worker Types:**
- **Dedicated Worker**: One-to-one with creator
- **Shared Worker**: Multiple scripts can connect
- **Service Worker**: Network proxy, PWA support

**Limitations:**
- No DOM access
- No window object (use `self`)
- Cannot access parent scope
- Limited APIs (no localStorage, limited fetch)

---

#### **Worker Pools**
**Basic Pool:**
```javascript
class WorkerPool {
  constructor(workerScript, size = 4) {
    this.workers = Array.from({ length: size }, () => ({
      worker: new Worker(workerScript),
      busy: false
    }))
  }
  
  async execute(data) {
    const workerInfo = await this.getAvailableWorker()
    
    try {
      return await this.runTask(workerInfo, data)
    } finally {
      workerInfo.busy = false
    }
  }
  
  async getAvailableWorker() {
    while (true) {
      const worker = this.workers.find(w => !w.busy)
      if (worker) {
        worker.busy = true
        return worker
      }
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }
  
  runTask(workerInfo, data) {
    return new Promise((resolve, reject) => {
      workerInfo.worker.onmessage = (e) => resolve(e.data)
      workerInfo.worker.onerror = (e) => reject(e)
      workerInfo.worker.postMessage(data)
    })
  }
  
  terminate() {
    this.workers.forEach(w => w.worker.terminate())
  }
}

// Usage
const pool = new WorkerPool('compute-worker.js', 4)
const result = await pool.execute({ value: 100 })
```

---

### 5. SharedArrayBuffer & Atomics

#### **SharedArrayBuffer**
**Creating Shared Memory:**
```javascript
// Main thread
const sharedBuffer = new SharedArrayBuffer(1024)
const sharedArray = new Int32Array(sharedBuffer)

// Share with worker
worker.postMessage({ buffer: sharedBuffer })

// Worker
self.onmessage = (e) => {
  const sharedArray = new Int32Array(e.data.buffer)
  sharedArray[0] = 42  // Both threads see this change
}
```

**Security Requirements:**
- **COOP**: `Cross-Origin-Opener-Policy: same-origin`
- **COEP**: `Cross-Origin-Embedder-Policy: require-corp`
- Required for SharedArrayBuffer availability

---

#### **Atomics**
**Atomic Operations:**
```javascript
// Thread-safe counter
const counter = new Int32Array(sharedBuffer)

// Atomic increment
Atomics.add(counter, 0, 1)     // counter[0] += 1

// Atomic operations
Atomics.load(arr, index)       // Read
Atomics.store(arr, index, val) // Write
Atomics.add(arr, index, val)   // Add
Atomics.sub(arr, index, val)   // Subtract
Atomics.and(arr, index, val)   // Bitwise AND
Atomics.or(arr, index, val)    // Bitwise OR
Atomics.xor(arr, index, val)   // Bitwise XOR
```

**Compare-and-Exchange:**
```javascript
// Only update if expected value matches
const success = Atomics.compareExchange(
  array,
  index,
  expectedValue,
  newValue
)

// Lock-free update pattern
function atomicUpdate(array, index, updateFn) {
  while (true) {
    const old = Atomics.load(array, index)
    const updated = updateFn(old)
    const result = Atomics.compareExchange(array, index, old, updated)
    if (result === old) break  // Success
  }
}
```

**Wait/Notify:**
```javascript
// Worker 1: Wait for value change
Atomics.wait(sharedArray, 0, 0)  // Blocks until notified
console.log('Woken up!')

// Worker 2: Notify waiting threads
Atomics.store(sharedArray, 0, 42)
Atomics.notify(sharedArray, 0, 1)  // Wake 1 waiter
```

---

### 6. Race Conditions & Solutions

#### **Race Conditions**
**Common Scenarios:**
```javascript
// ❌ Race condition: Read-modify-write
let counter = 0

worker1: counter = counter + 1  // Read 0, write 1
worker2: counter = counter + 1  // Read 0, write 1
// Result: counter = 1 (expected 2)

// ✅ Solution: Atomic operations
const counter = new Int32Array(sharedBuffer)
Atomics.add(counter, 0, 1)  // Thread-safe
```

**Critical Sections:**
```javascript
// ❌ Problem: Non-atomic check-then-act
if (!resourceInUse) {
  resourceInUse = true  // Race condition!
  useResource()
}

// ✅ Solution: Mutex
class Mutex {
  constructor(sharedBuffer, index = 0) {
    this.lock = new Int32Array(sharedBuffer)
    this.index = index
  }
  
  async acquire() {
    while (Atomics.compareExchange(this.lock, this.index, 0, 1) !== 0) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }
  
  release() {
    Atomics.store(this.lock, this.index, 0)
  }
}

// Usage
const mutex = new Mutex(sharedBuffer)
await mutex.acquire()
try {
  // Critical section
  useResource()
} finally {
  mutex.release()
}
```

---

### 7. Parallel Processing

#### **Task Parallelism**
**Different tasks run in parallel:**
```javascript
// Parallel API requests
const pool = new WorkerPool('api-worker.js', 5)
const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const users = await Promise.all(
  userIds.map(id => pool.execute({ endpoint: `/users/${id}` }))
)
```

**Worker Pool with Priorities:**
```javascript
class PriorityWorkerPool {
  constructor(workerScript, size) {
    this.pool = new WorkerPool(workerScript, size)
    this.highPriorityQueue = []
    this.normalPriorityQueue = []
  }
  
  execute(data, priority = 'normal') {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject }
      
      if (priority === 'high') {
        this.highPriorityQueue.push(task)
      } else {
        this.normalPriorityQueue.push(task)
      }
      
      this.processQueue()
    })
  }
  
  async processQueue() {
    const task = this.highPriorityQueue.shift() || 
                 this.normalPriorityQueue.shift()
    
    if (task) {
      try {
        const result = await this.pool.execute(task.data)
        task.resolve(result)
      } catch (error) {
        task.reject(error)
      }
      this.processQueue()
    }
  }
}
```

---

#### **Data Parallelism**
**Same operation on different data:**
```javascript
// Parallel map
async function parallelMap(array, fn, workerCount = 4) {
  const chunkSize = Math.ceil(array.length / workerCount)
  const chunks = []
  
  for (let i = 0; i < workerCount; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, array.length)
    chunks.push(array.slice(start, end))
  }
  
  const workers = chunks.map((chunk) => {
    return new Promise((resolve) => {
      const worker = new Worker('map-worker.js')
      worker.onmessage = (e) => {
        resolve(e.data)
        worker.terminate()
      }
      worker.postMessage({ chunk, fn: fn.toString() })
    })
  })
  
  const results = await Promise.all(workers)
  return results.flat()
}

// Usage
const data = Array.from({ length: 10000 }, (_, i) => i)
const squared = await parallelMap(data, x => x * x)
```

**Map-Reduce:**
```javascript
class MapReduce {
  constructor(workerCount = 4) {
    this.workerCount = workerCount
  }
  
  async execute(data, mapFn, reduceFn, initialValue) {
    // Map phase (parallel)
    const mapResults = await this.parallelMap(data, mapFn)
    
    // Reduce phase
    return this.parallelReduce(mapResults, reduceFn, initialValue)
  }
}

// Word count example
const wordCount = await mapReduce.execute(
  documents,
  (doc) => doc.split(' ').map(word => ({ word, count: 1 })),
  (acc, item) => {
    acc[item.word] = (acc[item.word] || 0) + item.count
    return acc
  },
  {}
)
```

---

### 8. Concurrency Patterns

#### **Producer-Consumer**
**Queue-based decoupling:**
```javascript
class BlockingQueue {
  constructor(capacity = 100) {
    this.capacity = capacity
    this.items = []
    this.waitingPut = []
    this.waitingGet = []
  }
  
  async put(item) {
    while (this.items.length >= this.capacity) {
      await new Promise(resolve => this.waitingPut.push(resolve))
    }
    
    this.items.push(item)
    
    if (this.waitingGet.length > 0) {
      const resolve = this.waitingGet.shift()
      resolve()
    }
  }
  
  async get() {
    while (this.items.length === 0) {
      await new Promise(resolve => this.waitingGet.push(resolve))
    }
    
    const item = this.items.shift()
    
    if (this.waitingPut.length > 0) {
      const resolve = this.waitingPut.shift()
      resolve()
    }
    
    return item
  }
}

// Usage
const queue = new BlockingQueue(10)

// Producer
async function producer() {
  for (let i = 0; i < 100; i++) {
    await queue.put({ id: i, data: `Item ${i}` })
  }
}

// Consumer
async function consumer() {
  while (true) {
    const item = await queue.get()
    await processItem(item)
  }
}
```

---

#### **Debouncing & Throttling**
**Debounce**: Wait for quiet period
```javascript
function debounce(func, delay) {
  let timeoutId
  
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// Usage: Search input
const debouncedSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`)
}, 300)

input.addEventListener('input', (e) => {
  debouncedSearch(e.target.value)
})
```

**Throttle**: Limit execution rate
```javascript
function throttle(func, limit) {
  let inThrottle
  
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

// Usage: Scroll handler
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY)
}, 100)

window.addEventListener('scroll', throttledScroll)
```

---

### 9. Performance & Best Practices

#### **Performance Optimization**
**Worker Overhead:**
```javascript
// ❌ Bad: Create worker for each task
for (const item of data) {
  const worker = new Worker('process.js')
  worker.postMessage(item)  // Expensive!
}

// ✅ Good: Reuse worker pool
const pool = new WorkerPool('process.js', 4)
for (const item of data) {
  pool.execute(item)
}
```

**Message Passing:**
```javascript
// ❌ Bad: Copy large array
const largeArray = new Float64Array(1000000)
worker.postMessage({ array: largeArray })  // 8MB copy!

// ✅ Good: Transfer ownership
worker.postMessage({ array: largeArray }, [largeArray.buffer])

// ✅ Good: Use SharedArrayBuffer
const sharedBuffer = new SharedArrayBuffer(8000000)
const sharedArray = new Float64Array(sharedBuffer)
worker.postMessage({ buffer: sharedBuffer })  // Shared, no copy
```

**Optimal Worker Count:**
```javascript
// Use hardware concurrency
const workerCount = navigator.hardwareConcurrency || 4

// Or calculate based on workload
function getOptimalWorkerCount(dataSize, overhead = 1000) {
  const maxWorkers = navigator.hardwareConcurrency || 4
  const minWorkPerWorker = overhead
  return Math.min(
    maxWorkers,
    Math.max(1, Math.floor(dataSize / minWorkPerWorker))
  )
}
```

---

#### **Best Practices**

**1. Start Simple:**
```javascript
// ❌ Don't start with complex concurrency
const workers = Array.from({ length: 100 }, () => new Worker('...'))

// ✅ Start with async/await
async function processData(data) {
  const result = await fetch('/api/process', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return result.json()
}

// ✅ Add workers only when needed
const pool = new WorkerPool('process.js', 4)
```

**2. Handle Errors:**
```javascript
// ✅ Worker error handling
worker.onerror = (error) => {
  console.error('Worker error:', error)
  worker.terminate()
  createNewWorker()  // Recreate
}

// ✅ Async error handling
async function robustFetch(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url)
    } catch (error) {
      if (i === retries - 1) throw error
      await sleep(Math.pow(2, i) * 1000)  // Exponential backoff
    }
  }
}
```

**3. Clean Up Resources:**
```javascript
// ✅ Terminate workers
window.addEventListener('beforeunload', () => {
  workerPool.terminate()
})

// ✅ React cleanup
useEffect(() => {
  const pool = new WorkerPool('process.js', 4)
  
  return () => {
    pool.terminate()  // Cleanup on unmount
  }
}, [])
```

**4. Profile Before Optimizing:**
```javascript
// Measure performance
console.time('sequential')
await sequentialProcess(data)
console.timeEnd('sequential')

console.time('parallel')
await parallelProcess(data)
console.timeEnd('parallel')

// Only parallelize if actually faster!
```

---

## 🎯 Common Use Cases

### Image Processing
```javascript
const pool = new WorkerPool('image-processor.js', 4)

async function processImages(images) {
  return Promise.all(
    images.map(image => pool.execute({ 
      operation: 'resize',
      image,
      width: 800,
      height: 600
    }))
  )
}
```

### API Rate Limiting
```javascript
class RateLimitedQueue {
  constructor(requestsPerSecond = 10) {
    this.queue = []
    this.requestsPerSecond = requestsPerSecond
    this.requestsThisSecond = 0
    this.lastReset = Date.now()
  }
  
  async request(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
      this.process()
    })
  }
  
  async process() {
    const now = Date.now()
    
    if (now - this.lastReset >= 1000) {
      this.lastReset = now
      this.requestsThisSecond = 0
    }
    
    if (this.requestsThisSecond < this.requestsPerSecond && this.queue.length > 0) {
      const task = this.queue.shift()
      this.requestsThisSecond++
      
      try {
        const result = await task.fn()
        task.resolve(result)
      } catch (error) {
        task.reject(error)
      }
    }
    
    if (this.queue.length > 0) {
      setTimeout(() => this.process(), 100)
    }
  }
}
```

### Background Data Sync
```javascript
class BackgroundSync {
  constructor() {
    this.queue = new RecurringTaskQueue()
  }
  
  start() {
    this.queue.addRecurring(async () => {
      const changes = await getLocalChanges()
      if (changes.length > 0) {
        await syncToServer(changes)
      }
    }, 60000)  // Every minute
  }
}
```

---

## 📊 Quick Reference Tables

### Async Patterns Comparison

| Pattern | Use Case | Error Handling | Complexity |
|---------|----------|----------------|------------|
| **Callbacks** | Legacy code, Node.js | Error-first callback | Low |
| **Promises** | Modern async | .catch() chaining | Medium |
| **Async/Await** | Sequential async code | try-catch | Low |
| **Web Workers** | CPU-intensive tasks | onerror, message-based | High |
| **SharedArrayBuffer** | Shared memory, lock-free | Race conditions! | Very High |

### Promise Combinators

| Method | Resolves When | Rejects When | Use Case |
|--------|---------------|--------------|----------|
| **Promise.all()** | All resolve | Any rejects | All must succeed |
| **Promise.allSettled()** | All settle | Never | Want all results |
| **Promise.race()** | First settles | First rejects | Timeout, fallback |
| **Promise.any()** | First resolves | All reject | First success wins |

### Worker Types

| Type | Scope | Use Case | Shared? |
|------|-------|----------|---------|
| **Dedicated Worker** | One page | CPU tasks | No |
| **Shared Worker** | Multiple pages | Shared state | Yes |
| **Service Worker** | Network layer | PWA, caching | Yes |

### Atomic Operations

| Operation | Purpose | Returns |
|-----------|---------|---------|
| **Atomics.add()** | Increment | Old value |
| **Atomics.sub()** | Decrement | Old value |
| **Atomics.load()** | Read | Current value |
| **Atomics.store()** | Write | Stored value |
| **Atomics.compareExchange()** | Conditional update | Old value |
| **Atomics.wait()** | Block thread | "ok", "not-equal", "timed-out" |
| **Atomics.notify()** | Wake threads | Count woken |

---

## ⚡ Performance Tips

### Do's ✅
- Use worker pools for task reuse
- Transfer ArrayBuffers when possible
- Batch small operations
- Match worker count to CPU cores
- Profile before optimizing
- Handle errors comprehensively
- Clean up workers on unmount

### Don'ts ❌
- Don't create workers in loops
- Don't copy large data unnecessarily
- Don't use workers for tiny tasks
- Don't block main thread in callbacks
- Don't ignore race conditions
- Don't over-parallelize
- Don't forget error handling

---

## 🔧 Debugging Tools

### Chrome DevTools
```javascript
// Performance profiling
performance.mark('worker-start')
const result = await workerPool.execute(data)
performance.mark('worker-end')
performance.measure('worker-execution', 'worker-start', 'worker-end')

// Named workers for debugging
const worker = new Worker('process.js', { name: 'data-processor-1' })
```

### Console Timing
```javascript
console.time('parallel-processing')
await processInParallel(data)
console.timeEnd('parallel-processing')
```

### Performance Monitoring
```javascript
class PerformanceMonitor {
  async measure(name, fn) {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start
    console.log(`${name}: ${duration.toFixed(2)}ms`)
    return result
  }
}
```

---

## 📖 Further Reading

---

## 🎯 Interview Questions & Answers

### Event Loop & Fundamentals

#### Q1: Explain the JavaScript event loop in detail.

**Answer:**

The JavaScript event loop is a mechanism that handles asynchronous operations in JavaScript's single-threaded environment.

**Components:**
1. **Call Stack**: Executes synchronous code (LIFO)
2. **Web APIs**: Browser-provided APIs (setTimeout, fetch, DOM events)
3. **Task Queue (Macrotask Queue)**: Callbacks from setTimeout, setInterval, I/O
4. **Microtask Queue**: Promise callbacks, queueMicrotask, MutationObserver
5. **Event Loop**: Monitors stack and queues

**Execution Flow:**
```javascript
// Step-by-step execution example
console.log('1')                              // Stack: execute immediately

setTimeout(() => console.log('2'), 0)         // Web API → Macrotask Queue

Promise.resolve().then(() => console.log('3')) // Microtask Queue

console.log('4')                              // Stack: execute immediately

// Output: 1, 4, 3, 2
```

**Process:**
1. Execute all synchronous code (call stack)
2. Execute ALL microtasks (until microtask queue is empty)
3. Execute ONE macrotask
4. Repeat steps 2-3
5. Render if needed

**Key Points:**
- Microtasks have higher priority than macrotasks
- New microtasks created during microtask execution are executed immediately
- Each macrotask gets one turn before checking microtasks again
- Long-running tasks block the main thread

---

#### Q2: What's the difference between microtasks and macrotasks?

**Answer:**

**Macrotasks (Task Queue):**
- setTimeout, setInterval
- I/O operations
- UI rendering
- requestAnimationFrame
- Executed ONE at a time per loop iteration

**Microtasks (Job Queue):**
- Promise callbacks (.then, .catch, .finally)
- queueMicrotask()
- MutationObserver
- Executed ALL before next macrotask

**Example:**
```javascript
console.log('Start')

setTimeout(() => console.log('Macro 1'), 0)
setTimeout(() => console.log('Macro 2'), 0)

Promise.resolve()
  .then(() => console.log('Micro 1'))
  .then(() => console.log('Micro 2'))

console.log('End')

/* Output:
Start
End
Micro 1
Micro 2
Macro 1
Macro 2
*/
```

**Why it matters:**
```javascript
// Microtasks can starve macrotasks
function recursiveMicrotask() {
  Promise.resolve().then(recursiveMicrotask)
}
recursiveMicrotask()  // setTimeout callbacks will never run!

// Macrotasks allow breathing room
function recursiveMacrotask() {
  setTimeout(recursiveMacrotask, 0)
}
recursiveMacrotask()  // UI can still update between iterations
```

---

#### Q3: How do Promises differ from callbacks?

**Answer:**

**Callbacks:**
```javascript
// ❌ Callback Hell
getData(url, (err, data) => {
  if (err) return handleError(err)
  processData(data, (err, result) => {
    if (err) return handleError(err)
    saveResult(result, (err, saved) => {
      if (err) return handleError(err)
      console.log('Done!')
    })
  })
})

// Issues:
// - Pyramid of doom (deeply nested)
// - Error handling duplicated
// - Hard to compose
// - No guarantee callback is called once
// - Inversion of control (caller controls when callback runs)
```

**Promises:**
```javascript
// ✅ Promise Chain
getData(url)
  .then(data => processData(data))
  .then(result => saveResult(result))
  .then(() => console.log('Done!'))
  .catch(handleError)  // Single error handler

// Benefits:
// - Flat structure
// - Centralized error handling
// - Composable (Promise.all, Promise.race)
// - Guaranteed to be called exactly once
// - Immutable once settled
```

**Key Differences:**

| Feature | Callbacks | Promises |
|---------|-----------|----------|
| **Syntax** | Nested | Chainable |
| **Error Handling** | Each callback | Single .catch() |
| **Composition** | Difficult | Easy (all, race, any) |
| **Guarantee** | No guarantee | Called once |
| **Control** | Inverted | You control |
| **Return Value** | None | Promise object |

**Advanced Promise Features:**
```javascript
// Parallel execution
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])

// Race for fastest
const fastest = await Promise.race([
  fetchFromCDN(),
  fetchFromBackup()
])

// All settled (even on errors)
const results = await Promise.allSettled([
  promise1,
  promise2,
  promise3
])
// [{status: 'fulfilled', value: ...}, {status: 'rejected', reason: ...}]
```

---

### Promises & Async/Await

#### Q4: Explain Promise.all(), Promise.race(), Promise.allSettled(), and Promise.any().

**Answer:**

**1. Promise.all() - All must succeed:**
```javascript
const promise1 = Promise.resolve(1)
const promise2 = Promise.resolve(2)
const promise3 = Promise.resolve(3)

Promise.all([promise1, promise2, promise3])
  .then(results => console.log(results))  // [1, 2, 3]

// ❌ Fails fast - rejects immediately if any promise rejects
const promises = [
  Promise.resolve(1),
  Promise.reject('Error'),  // This triggers rejection
  Promise.resolve(3)        // Never evaluated
]

Promise.all(promises)
  .catch(error => console.log(error))  // 'Error'

// Use case: All operations must succeed
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id)
])
```

**2. Promise.race() - First to settle wins:**
```javascript
const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 1000))
const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 100))

Promise.race([slow, fast])
  .then(result => console.log(result))  // 'fast'

// Rejects if first promise rejects
Promise.race([
  new Promise((_, reject) => setTimeout(() => reject('error'), 100)),
  new Promise(resolve => setTimeout(() => resolve('success'), 200))
])
  .catch(error => console.log(error))  // 'error'

// Use case: Timeout implementation
function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ])
}

await timeout(fetch('/api/data'), 5000)  // Fails if >5 seconds
```

**3. Promise.allSettled() - Wait for all, ignore errors (ES2020):**
```javascript
const promises = [
  Promise.resolve(1),
  Promise.reject('Error'),
  Promise.resolve(3)
]

const results = await Promise.allSettled(promises)
console.log(results)
/* [
  { status: 'fulfilled', value: 1 },
  { status: 'rejected', reason: 'Error' },
  { status: 'fulfilled', value: 3 }
] */

// Use case: Try multiple operations, need all results
const results = await Promise.allSettled([
  uploadToS3(file),
  uploadToAzure(file),
  uploadToGCS(file)
])

const succeeded = results.filter(r => r.status === 'fulfilled')
console.log(`${succeeded.length}/3 uploads succeeded`)
```

**4. Promise.any() - First fulfillment wins, all must fail to reject (ES2021):**
```javascript
const promises = [
  Promise.reject('Error 1'),
  Promise.resolve('Success'),  // This wins
  Promise.reject('Error 2')
]

Promise.any(promises)
  .then(result => console.log(result))  // 'Success'

// Only rejects if ALL promises reject
Promise.any([
  Promise.reject('Error 1'),
  Promise.reject('Error 2'),
  Promise.reject('Error 3')
])
  .catch(error => console.log(error))  // AggregateError

// Use case: Try multiple sources, use first success
const data = await Promise.any([
  fetch('https://api1.com/data'),
  fetch('https://api2.com/data'),
  fetch('https://api3.com/data')
])
```

**Comparison Table:**

| Method | Resolves When | Rejects When | Use Case |
|--------|---------------|--------------|----------|
| **all()** | All fulfill | Any rejects | All must succeed |
| **race()** | First settles | First rejects | Timeout, fastest wins |
| **allSettled()** | All settle | Never | Need all results |
| **any()** | First fulfills | All reject | First success wins |

---

#### Q5: What are common Promise anti-patterns and how to avoid them?

**Answer:**

**1. The Nested Promise Anti-pattern:**
```javascript
// ❌ Bad: Nested promises (callback hell v2)
fetchUser()
  .then(user => {
    return fetchPosts(user.id)
      .then(posts => {
        return fetchComments(posts[0].id)
          .then(comments => {
            return { user, posts, comments }
          })
      })
  })

// ✅ Good: Flat chain
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => ({ comments }))

// ✅ Better: async/await
const user = await fetchUser()
const posts = await fetchPosts(user.id)
const comments = await fetchComments(posts[0].id)
```

**2. The Forgotten Return:**
```javascript
// ❌ Bad: Forgetting to return promise
fetchUser()
  .then(user => {
    fetchPosts(user.id)  // Missing return!
  })
  .then(posts => {
    console.log(posts)  // undefined!
  })

// ✅ Good: Always return
fetchUser()
  .then(user => {
    return fetchPosts(user.id)  // Return the promise
  })
  .then(posts => {
    console.log(posts)  // Works!
  })
```

**3. The Ghost Promise:**
```javascript
// ❌ Bad: Creating unnecessary wrapper
function getUserData() {
  return new Promise((resolve, reject) => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => resolve(data))  // Unnecessary!
      .catch(err => reject(err))
  })
}

// ✅ Good: Just return the promise
function getUserData() {
  return fetch('/api/user')
    .then(res => res.json())
}

// ✅ Better: async/await
async function getUserData() {
  const res = await fetch('/api/user')
  return res.json()
}
```

**4. The Swallowed Error:**
```javascript
// ❌ Bad: Error handling without propagation
fetchData()
  .then(data => processData(data))
  .catch(error => {
    console.error(error)  // Logged but swallowed!
  })
  .then(() => {
    // This runs even if error occurred!
  })

// ✅ Good: Re-throw or return rejected promise
fetchData()
  .then(data => processData(data))
  .catch(error => {
    console.error(error)
    throw error  // Propagate the error
  })
  .then(() => {
    // Only runs if no error
  })
```

**5. The Parallel Mistake:**
```javascript
// ❌ Bad: Sequential when could be parallel (slow)
async function getUsers(ids) {
  const users = []
  for (const id of ids) {
    const user = await fetchUser(id)  // Waits for each!
    users.push(user)
  }
  return users
}

// ✅ Good: Parallel execution (fast)
async function getUsers(ids) {
  return Promise.all(ids.map(id => fetchUser(id)))
}

// Or with error handling per user:
async function getUsers(ids) {
  const results = await Promise.allSettled(
    ids.map(id => fetchUser(id))
  )
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
}
```

**6. The Async Function Trap:**
```javascript
// ❌ Bad: Async function always returns promise
async function getValue() {
  return 42  // Returns Promise<42>, not 42!
}

const value = getValue()
console.log(value)  // Promise, not 42!

// ✅ Good: Always await async functions
const value = await getValue()
console.log(value)  // 42
```

---

### Web Workers

#### Q6: When should you use Web Workers? What are their limitations?

**Answer:**

**When to Use Web Workers:**

**1. CPU-Intensive Computations:**
```javascript
// Heavy computation blocks UI
function fibonacci(n) {
  if (n <= 1) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// ❌ Main thread: UI freezes
const result = fibonacci(45)  // Takes seconds, UI frozen

// ✅ Worker thread: UI stays responsive
// worker.js
self.onmessage = (e) => {
  const result = fibonacci(e.data)
  self.postMessage(result)
}

// main.js
const worker = new Worker('worker.js')
worker.postMessage(45)  // UI remains responsive
worker.onmessage = (e) => console.log(e.data)
```

**2. Data Processing:**
```javascript
// Parse large JSON
// Filter/sort massive datasets
// Image/video processing
// Encryption/decryption

const worker = new Worker('data-processor.js')
worker.postMessage({ data: largeDataset, operation: 'filter' })
```

**3. Background Tasks:**
```javascript
// Periodic data sync
// Real-time data processing
// WebSocket message handling

const syncWorker = new Worker('sync-worker.js')
// Worker runs in background, syncing data every 30 seconds
```

**Limitations:**

**1. No DOM Access:**
```javascript
// ❌ Worker cannot do:
document.getElementById('el')  // Error: document not defined
window.alert('Hello')          // Error: window not defined
localStorage.setItem()         // Error: localStorage not defined

// ✅ Workarounds:
// - Send data back to main thread for DOM manipulation
// - Use OffscreenCanvas for canvas operations in worker
```

**2. Communication Overhead:**
```javascript
// Structured clone algorithm has cost
const data = { /* 10MB object */ }
worker.postMessage(data)  // Copies 10MB (slow!)

// ✅ Better: Use Transferables
const buffer = new ArrayBuffer(10 * 1024 * 1024)
worker.postMessage(buffer, [buffer])  // Transfers ownership (fast!)
```

**3. Creation Cost:**
```javascript
// ❌ Creating workers is expensive (~10-50ms each)
for (let i = 0; i < 100; i++) {
  const worker = new Worker('task.js')  // Very slow!
}

// ✅ Use worker pool
const pool = new WorkerPool('task.js', 4)
```

**4. Limited APIs:**
```javascript
// Available in Workers:
// - fetch, XMLHttpRequest
// - IndexedDB
// - WebSockets
// - setTimeout, setInterval
// - Crypto API
// - Cache API

// NOT available:
// - DOM (document, window)
// - localStorage, sessionStorage
// - Parent page variables
```

**Decision Tree:**

```
Is task CPU-intensive (>50ms)?
  ├─ Yes → Consider Web Worker
  │   └─ Does it need DOM access?
  │       ├─ Yes → Keep on main thread or send results back
  │       └─ No → Use Web Worker ✅
  └─ No → Keep on main thread
```

---

#### Q7: Implement a robust Worker Pool with error handling and retries.

**Answer:**

```javascript
class RobustWorkerPool {
  constructor(workerScript, size = 4, options = {}) {
    this.workerScript = workerScript
    this.size = size
    this.maxRetries = options.maxRetries || 3
    this.taskTimeout = options.taskTimeout || 30000
    this.workers = []
    this.taskQueue = []
    
    this.initializeWorkers()
  }
  
  initializeWorkers() {
    for (let i = 0; i < this.size; i++) {
      this.createWorker(i)
    }
  }
  
  createWorker(id) {
    const worker = new Worker(this.workerScript)
    
    const workerInfo = {
      id,
      worker,
      busy: false,
      currentTask: null,
      tasksCompleted: 0,
      errors: 0
    }
    
    worker.onerror = (error) => {
      console.error(`Worker ${id} error:`, error)
      workerInfo.errors++
      
      // Recreate worker if too many errors
      if (workerInfo.errors > 5) {
        console.warn(`Worker ${id} has too many errors, recreating...`)
        worker.terminate()
        this.createWorker(id)
      }
      
      // Reject current task
      if (workerInfo.currentTask) {
        workerInfo.currentTask.reject(error)
        workerInfo.currentTask = null
      }
      
      workerInfo.busy = false
      this.processQueue()
    }
    
    worker.onmessage = (event) => {
      const { taskId, result, error } = event.data
      
      if (workerInfo.currentTask && workerInfo.currentTask.id === taskId) {
        clearTimeout(workerInfo.currentTask.timeoutId)
        
        if (error) {
          workerInfo.currentTask.reject(new Error(error))
        } else {
          workerInfo.currentTask.resolve(result)
          workerInfo.tasksCompleted++
        }
        
        workerInfo.currentTask = null
      }
      
      workerInfo.busy = false
      this.processQueue()
    }
    
    this.workers[id] = workerInfo
  }
  
  async execute(data, priority = 0) {
    return this.executeWithRetry(data, priority, 0)
  }
  
  async executeWithRetry(data, priority, attempt) {
    try {
      return await this.executeOnce(data, priority, attempt)
    } catch (error) {
      if (attempt < this.maxRetries) {
        console.warn(`Task failed (attempt ${attempt + 1}/${this.maxRetries + 1}), retrying...`)
        
        // Exponential backoff
        await this.sleep(Math.pow(2, attempt) * 1000)
        
        return this.executeWithRetry(data, priority, attempt + 1)
      }
      
      throw new Error(`Task failed after ${this.maxRetries + 1} attempts: ${error.message}`)
    }
  }
  
  executeOnce(data, priority, attempt) {
    return new Promise((resolve, reject) => {
      const taskId = Math.random().toString(36)
      
      const task = {
        id: taskId,
        data,
        priority,
        attempt,
        resolve,
        reject,
        timeoutId: null
      }
      
      // Try to execute immediately
      const availableWorker = this.workers.find(w => !w.busy)
      
      if (availableWorker) {
        this.executeTask(availableWorker, task)
      } else {
        // Add to queue (sorted by priority)
        this.taskQueue.push(task)
        this.taskQueue.sort((a, b) => b.priority - a.priority)
      }
    })
  }
  
  executeTask(workerInfo, task) {
    workerInfo.busy = true
    workerInfo.currentTask = task
    
    // Set timeout
    task.timeoutId = setTimeout(() => {
      console.warn(`Task ${task.id} timed out`)
      task.reject(new Error('Task timeout'))
      workerInfo.currentTask = null
      workerInfo.busy = false
      
      // Recreate worker (might be stuck)
      workerInfo.worker.terminate()
      this.createWorker(workerInfo.id)
      
      this.processQueue()
    }, this.taskTimeout)
    
    // Send task to worker
    workerInfo.worker.postMessage({
      taskId: task.id,
      data: task.data,
      attempt: task.attempt
    })
  }
  
  processQueue() {
    if (this.taskQueue.length === 0) return
    
    const availableWorker = this.workers.find(w => !w.busy)
    if (!availableWorker) return
    
    const task = this.taskQueue.shift()
    this.executeTask(availableWorker, task)
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  getStats() {
    return {
      poolSize: this.workers.length,
      busyWorkers: this.workers.filter(w => w.busy).length,
      queuedTasks: this.taskQueue.length,
      totalCompleted: this.workers.reduce((sum, w) => sum + w.tasksCompleted, 0),
      totalErrors: this.workers.reduce((sum, w) => sum + w.errors, 0)
    }
  }
  
  terminate() {
    this.workers.forEach(w => w.worker.terminate())
    this.workers = []
    this.taskQueue = []
  }
}

// Worker file: robust-worker.js
self.onmessage = async (event) => {
  const { taskId, data, attempt } = event.data
  
  try {
    // Simulate processing
    const result = await processData(data)
    
    self.postMessage({ taskId, result })
  } catch (error) {
    self.postMessage({ 
      taskId, 
      error: error.message 
    })
  }
}

async function processData(data) {
  // Heavy computation here
  return data * 2
}

// Usage:
const pool = new RobustWorkerPool('robust-worker.js', 4, {
  maxRetries: 3,
  taskTimeout: 30000
})

try {
  const result = await pool.execute({ value: 100 }, 1)  // priority 1
  console.log('Result:', result)
} catch (error) {
  console.error('Task failed:', error)
}

// Monitor stats
setInterval(() => {
  console.log('Pool stats:', pool.getStats())
}, 5000)

// Cleanup
window.addEventListener('beforeunload', () => {
  pool.terminate()
})
```

---

### SharedArrayBuffer & Atomics

#### Q8: Explain race conditions and how to prevent them using Atomics.

**Answer:**

**What is a Race Condition?**

A race condition occurs when multiple threads access shared data simultaneously, and the outcome depends on the timing of their execution.

**Classic Example - Counter Race Condition:**

```javascript
// Shared memory
const sharedBuffer = new SharedArrayBuffer(4)
const counter = new Int32Array(sharedBuffer)
counter[0] = 0

// Worker 1
function incrementCounter() {
  const current = counter[0]  // Read: 0
  // ⚠️ Context switch happens here!
  counter[0] = current + 1    // Write: 1
}

// Worker 2 (runs simultaneously)
function incrementCounter() {
  const current = counter[0]  // Read: 0 (same value!)
  counter[0] = current + 1    // Write: 1 (overwrites!)
}

// Expected: counter[0] = 2
// Actual: counter[0] = 1 (LOST UPDATE!)
```

**Why This Happens:**

```
Timeline:
T0: Worker 1 reads counter[0] = 0
T1: Worker 2 reads counter[0] = 0
T2: Worker 1 writes counter[0] = 1
T3: Worker 2 writes counter[0] = 1  ← Overwrites Worker 1's update!

Result: counter = 1 (should be 2)
```

**Solution 1: Atomic Operations**

```javascript
// ✅ Using Atomics.add() - atomic increment
const sharedBuffer = new SharedArrayBuffer(4)
const counter = new Int32Array(sharedBuffer)

// Worker 1
Atomics.add(counter, 0, 1)  // Atomic: read-modify-write

// Worker 2
Atomics.add(counter, 0, 1)  // Atomic: read-modify-write

// Result: counter[0] = 2 ✅ (correct!)
```

**All Atomic Operations:**

```javascript
const buffer = new SharedArrayBuffer(16)
const arr = new Int32Array(buffer)

// Read/Write
const value = Atomics.load(arr, 0)        // Atomic read
Atomics.store(arr, 0, 42)                 // Atomic write

// Arithmetic
Atomics.add(arr, 0, 5)                    // arr[0] += 5
Atomics.sub(arr, 0, 3)                    // arr[0] -= 3

// Bitwise
Atomics.and(arr, 0, 0b1111)               // arr[0] &= 0b1111
Atomics.or(arr, 0, 0b1000)                // arr[0] |= 0b1000
Atomics.xor(arr, 0, 0b0101)               // arr[0] ^= 0b0101

// Compare-and-exchange (CAS)
const old = Atomics.compareExchange(arr, 0, expectedValue, newValue)
// Only updates if arr[0] === expectedValue

// Exchange
const old = Atomics.exchange(arr, 0, newValue)  // Swap and return old
```

**Solution 2: Mutex (Lock) Using Atomics**

```javascript
class Mutex {
  constructor(sharedBuffer, index = 0) {
    this.lock = new Int32Array(sharedBuffer)
    this.index = index
    Atomics.store(this.lock, index, 0)  // 0 = unlocked, 1 = locked
  }
  
  async acquire() {
    // Spin until we can acquire the lock
    while (true) {
      // Try to change 0 → 1 atomically
      const old = Atomics.compareExchange(this.lock, this.index, 0, 1)
      
      if (old === 0) {
        // Successfully acquired lock!
        return
      }
      
      // Lock is held by someone else, wait a bit
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }
  
  release() {
    // Release the lock: 1 → 0
    Atomics.store(this.lock, this.index, 0)
  }
}

// Usage in worker:
const mutex = new Mutex(sharedBuffer, 0)

async function safeIncrement() {
  await mutex.acquire()
  try {
    // Critical section - only one worker at a time
    const current = counter[0]
    await simulateWork()  // Even with async work
    counter[0] = current + 1
  } finally {
    mutex.release()  // Always release!
  }
}
```

**Solution 3: Lock-Free Algorithm with CAS**

```javascript
// Lock-free counter increment
function atomicIncrement(array, index) {
  while (true) {
    const current = Atomics.load(array, index)
    const updated = current + 1
    
    // Try to update if value hasn't changed
    const result = Atomics.compareExchange(array, index, current, updated)
    
    if (result === current) {
      // Success! Value updated
      return updated
    }
    
    // Someone else modified it, try again
  }
}

// Lock-free stack push
function atomicPush(array, stackPointerIndex, valueIndex, value) {
  while (true) {
    const currentTop = Atomics.load(array, stackPointerIndex)
    
    // Store value at next position
    Atomics.store(array, valueIndex, value)
    
    // Try to update stack pointer
    const result = Atomics.compareExchange(
      array, 
      stackPointerIndex, 
      currentTop, 
      currentTop + 1
    )
    
    if (result === currentTop) {
      return  // Success!
    }
    // Retry if someone else pushed
  }
}
```

**Real-World Example: Thread-Safe Counter**

```javascript
// main.js
const sharedBuffer = new SharedArrayBuffer(1024)
const counter = new Int32Array(sharedBuffer)

const workers = Array.from({ length: 4 }, () => new Worker('counter-worker.js'))

workers.forEach((worker, i) => {
  worker.postMessage({ 
    buffer: sharedBuffer, 
    iterations: 1000,
    workerId: i 
  })
})

Promise.all(workers.map(w => 
  new Promise(resolve => w.onmessage = resolve)
)).then(() => {
  console.log(`Final counter: ${counter[0]}`)  // Should be 4000
  console.log(`Expected: ${4 * 1000}`)
  workers.forEach(w => w.terminate())
})

// counter-worker.js
self.onmessage = (event) => {
  const { buffer, iterations, workerId } = event.data
  const counter = new Int32Array(buffer)
  
  for (let i = 0; i < iterations; i++) {
    // ✅ Atomic increment - no race condition
    Atomics.add(counter, 0, 1)
  }
  
  self.postMessage({ workerId, done: true })
}
```

**Common Race Condition Patterns:**

**1. Read-Modify-Write:**
```javascript
// ❌ Not atomic
const value = array[index]
array[index] = value + 1

// ✅ Atomic
Atomics.add(array, index, 1)
```

**2. Check-Then-Act:**
```javascript
// ❌ Not atomic
if (array[index] === 0) {
  array[index] = 1  // Race condition!
}

// ✅ Atomic
Atomics.compareExchange(array, index, 0, 1)
```

**3. Lost Update:**
```javascript
// ❌ Both workers read same value, one update lost
Worker1: read 5 → write 6
Worker2: read 5 → write 6
Result: 6 (should be 7)

// ✅ Atomic operations prevent this
Atomics.add(array, index, 1)  // Always correct
```

---

### Performance & Optimization

#### Q9: How do you optimize Web Worker performance?

**Answer:**

**1. Minimize Worker Creation Overhead:**

```javascript
// ❌ BAD: Create new worker for each task (very slow!)
async function processItems(items) {
  for (const item of items) {
    const worker = new Worker('process.js')  // ~10-50ms each!
    worker.postMessage(item)
    await new Promise(resolve => worker.onmessage = resolve)
    worker.terminate()
  }
}
// Time: 100 items × 50ms = 5 seconds just creating workers!

// ✅ GOOD: Reuse workers via pool
class WorkerPool {
  constructor(script, size) {
    this.workers = Array.from({ length: size }, () => new Worker(script))
    this.available = [...this.workers]
  }
  
  async execute(data) {
    const worker = await this.getWorker()
    try {
      return await this.runTask(worker, data)
    } finally {
      this.available.push(worker)
    }
  }
  
  async getWorker() {
    while (this.available.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    return this.available.pop()
  }
  
  runTask(worker, data) {
    return new Promise(resolve => {
      worker.onmessage = (e) => resolve(e.data)
      worker.postMessage(data)
    })
  }
}

const pool = new WorkerPool('process.js', 4)
await Promise.all(items.map(item => pool.execute(item)))
```

**2. Optimize Message Passing:**

```javascript
// ❌ BAD: Copying large data (slow!)
const largeArray = new Float64Array(1000000)  // 8MB
worker.postMessage({ data: largeArray })  // Copies 8MB! (~50ms)

// ✅ GOOD: Transfer ownership (zero-copy!)
const largeArray = new Float64Array(1000000)
worker.postMessage(
  { data: largeArray }, 
  [largeArray.buffer]  // Transfer list
)
// Time: ~0.1ms (1000x faster!)
// Note: largeArray becomes unusable in main thread

// ✅ BETTER: Use SharedArrayBuffer (shared memory!)
const sharedBuffer = new SharedArrayBuffer(8000000)
const sharedArray = new Float64Array(sharedBuffer)
worker.postMessage({ buffer: sharedBuffer })  // Just share reference
// Time: ~0.01ms (5000x faster!)
// Note: Both threads can access simultaneously
```

**3. Batch Small Operations:**

```javascript
// ❌ BAD: Send each item separately
for (let i = 0; i < 1000; i++) {
  worker.postMessage({ value: i })  // 1000 messages!
}
// Overhead: ~1000ms (1ms per message)

// ✅ GOOD: Batch items
const batch = []
for (let i = 0; i < 1000; i++) {
  batch.push({ value: i })
}
worker.postMessage({ batch })  // 1 message!
// Overhead: ~1ms
```

**4. Choose Optimal Worker Count:**

```javascript
// ❌ BAD: Too many workers
const workerCount = 100  // CPU has only 8 cores!
// Result: Context switching overhead, wasted memory

// ✅ GOOD: Match CPU cores
const optimalCount = navigator.hardwareConcurrency || 4
// Typically: 4-8 workers for CPU-bound tasks

// ✅ BETTER: Calculate based on workload
function calculateOptimalWorkers(taskCount, taskDuration, overhead = 50) {
  const maxWorkers = navigator.hardwareConcurrency || 4
  
  // Only use workers if task duration >> overhead
  if (taskDuration < overhead * 5) {
    return 0  // Not worth it, use main thread
  }
  
  // Don't create more workers than tasks
  return Math.min(maxWorkers, taskCount)
}

const workerCount = calculateOptimalWorkers(
  items.length,   // 100 tasks
  200            // 200ms each
)  // Returns: min(4-8, 100) = 4-8 workers
```

**5. Minimize Transferable Object Overhead:**

```javascript
// ❌ BAD: Transferring back and forth repeatedly
for (let i = 0; i < 10; i++) {
  worker.postMessage({ buffer }, [buffer])  // Transfer to worker
  buffer = await getResult()  // Transfer back
}
// Each transfer has overhead!

// ✅ GOOD: Transfer once, keep processing
worker.postMessage({ buffer, iterations: 10 }, [buffer])
// Worker processes all 10 iterations
const result = await getResult()  // Transfer back once
```

**6. Avoid Main Thread Blocking:**

```javascript
// ❌ BAD: Heavy processing in message handler
worker.onmessage = (event) => {
  const result = heavyProcessing(event.data)  // Blocks UI!
  updateDOM(result)
}

// ✅ GOOD: Defer heavy work
worker.onmessage = (event) => {
  requestIdleCallback(() => {
    const result = heavyProcessing(event.data)
    updateDOM(result)
  })
}

// ✅ BETTER: Do ALL heavy work in worker
worker.onmessage = (event) => {
  updateDOM(event.data)  // Just update UI
}
```

**7. Profile and Measure:**

```javascript
class PerformanceMonitor {
  async measureWorkerTask(pool, data) {
    const start = performance.now()
    
    performance.mark('worker-start')
    const result = await pool.execute(data)
    performance.mark('worker-end')
    
    performance.measure('worker-execution', 'worker-start', 'worker-end')
    
    const duration = performance.now() - start
    console.log(`Task took ${duration.toFixed(2)}ms`)
    
    return result
  }
}

// Compare sequential vs parallel
console.time('sequential')
for (const item of items) {
  await processItem(item)
}
console.timeEnd('sequential')  // e.g., 5000ms

console.time('parallel')
await Promise.all(items.map(item => pool.execute(item)))
console.timeEnd('parallel')  // e.g., 800ms (6x faster!)
```

**Performance Checklist:**

| Optimization | Impact | When to Use |
|--------------|--------|-------------|
| Worker pooling | High | Always |
| Transferables | Very High | Large data (>1MB) |
| SharedArrayBuffer | Very High | Frequent access |
| Batching | Medium | Many small messages |
| Optimal worker count | High | CPU-bound tasks |
| Avoid main thread blocking | High | Always |

---

### Advanced Topics

#### Q10: Implement a parallel Map-Reduce system with workers.

**Answer:**

```javascript
class ParallelMapReduce {
  constructor(workerScript, workerCount = navigator.hardwareConcurrency || 4) {
    this.workerScript = workerScript
    this.workerCount = workerCount
    this.workers = []
    
    this.initWorkers()
  }
  
  initWorkers() {
    for (let i = 0; i < this.workerCount; i++) {
      const worker = new Worker(this.workerScript)
      this.workers.push({
        worker,
        busy: false,
        id: i
      })
    }
  }
  
  /**
   * Parallel Map-Reduce
   * @param {Array} data - Input data
   * @param {Function} mapFn - Map function (transforms each item)
   * @param {Function} reduceFn - Reduce function (combines results)
   * @param {*} initialValue - Initial value for reduce
   */
  async execute(data, mapFn, reduceFn, initialValue) {
    console.time('Total MapReduce')
    
    // Phase 1: Parallel Map
    console.time('Map Phase')
    const mapped = await this.parallelMap(data, mapFn)
    console.timeEnd('Map Phase')
    
    // Phase 2: Parallel Reduce
    console.time('Reduce Phase')
    const result = await this.parallelReduce(mapped, reduceFn, initialValue)
    console.timeEnd('Reduce Phase')
    
    console.timeEnd('Total MapReduce')
    return result
  }
  
  async parallelMap(data, mapFn) {
    // Partition data across workers
    const chunkSize = Math.ceil(data.length / this.workerCount)
    const chunks = []
    
    for (let i = 0; i < this.workerCount; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, data.length)
      if (start < data.length) {
        chunks.push(data.slice(start, end))
      }
    }
    
    // Execute map on each chunk
    const promises = chunks.map((chunk, index) => {
      return this.executeOnWorker(this.workers[index % this.workers.length], {
        operation: 'map',
        data: chunk,
        fn: mapFn.toString()
      })
    })
    
    const results = await Promise.all(promises)
    
    // Flatten results
    return results.flat()
  }
  
  async parallelReduce(data, reduceFn, initialValue) {
    if (data.length === 0) return initialValue
    if (data.length === 1) return data[0]
    
    // Partition data
    const chunkSize = Math.ceil(data.length / this.workerCount)
    const chunks = []
    
    for (let i = 0; i < this.workerCount; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, data.length)
      if (start < data.length) {
        chunks.push(data.slice(start, end))
      }
    }
    
    // Parallel reduce on each chunk
    const promises = chunks.map((chunk, index) => {
      return this.executeOnWorker(this.workers[index % this.workers.length], {
        operation: 'reduce',
        data: chunk,
        fn: reduceFn.toString(),
        initialValue
      })
    })
    
    const partialResults = await Promise.all(promises)
    
    // Final sequential reduce on partial results
    return partialResults.reduce(reduceFn, initialValue)
  }
  
  executeOnWorker(workerInfo, task) {
    return new Promise((resolve, reject) => {
      workerInfo.busy = true
      
      const timeoutId = setTimeout(() => {
        reject(new Error('Worker task timeout'))
      }, 30000)
      
      workerInfo.worker.onmessage = (event) => {
        clearTimeout(timeoutId)
        workerInfo.busy = false
        
        if (event.data.error) {
          reject(new Error(event.data.error))
        } else {
          resolve(event.data.result)
        }
      }
      
      workerInfo.worker.onerror = (error) => {
        clearTimeout(timeoutId)
        workerInfo.busy = false
        reject(error)
      }
      
      workerInfo.worker.postMessage(task)
    })
  }
  
  terminate() {
    this.workers.forEach(w => w.worker.terminate())
    this.workers = []
  }
}

// Worker file: mapreduce-worker.js
self.onmessage = (event) => {
  const { operation, data, fn, initialValue } = event.data
  
  try {
    let result
    
    if (operation === 'map') {
      // Execute map function on data
      const mapFn = eval(`(${fn})`)
      result = data.map(mapFn)
    } else if (operation === 'reduce') {
      // Execute reduce function on data
      const reduceFn = eval(`(${fn})`)
      result = data.reduce(reduceFn, initialValue)
    }
    
    self.postMessage({ result })
  } catch (error) {
    self.postMessage({ error: error.message })
  }
}

// Usage Examples:

// Example 1: Word Count
const documents = [
  'hello world hello',
  'world of javascript',
  'hello javascript world',
  'concurrent programming in javascript'
]

const mapReduce = new ParallelMapReduce('mapreduce-worker.js', 4)

const wordCount = await mapReduce.execute(
  documents,
  // Map: Split into words with count
  (doc) => {
    return doc.split(' ').map(word => ({ word, count: 1 }))
  },
  // Reduce: Sum counts by word
  (acc, item) => {
    const word = item.word
    acc[word] = (acc[word] || 0) + item.count
    return acc
  },
  {}
)

console.log('Word Count:', wordCount)
/* Output:
{
  hello: 3,
  world: 3,
  javascript: 3,
  of: 1,
  concurrent: 1,
  programming: 1,
  in: 1
}
*/

// Example 2: Sum of Squares
const numbers = Array.from({ length: 1000000 }, (_, i) => i + 1)

const sumOfSquares = await mapReduce.execute(
  numbers,
  // Map: Square each number
  (n) => n * n,
  // Reduce: Sum all squares
  (sum, n) => sum + n,
  0
)

console.log('Sum of squares:', sumOfSquares)

// Example 3: Group by Category
const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 1000 },
  { id: 2, name: 'Phone', category: 'Electronics', price: 500 },
  { id: 3, name: 'Shirt', category: 'Clothing', price: 50 },
  { id: 4, name: 'TV', category: 'Electronics', price: 800 },
  { id: 5, name: 'Pants', category: 'Clothing', price: 60 }
]

const groupedByCategory = await mapReduce.execute(
  products,
  // Map: Extract category and product
  (product) => ({ category: product.category, product }),
  // Reduce: Group by category
  (acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item.product)
    return acc
  },
  {}
)

console.log('Grouped:', groupedByCategory)
/* Output:
{
  Electronics: [
    { id: 1, name: 'Laptop', ... },
    { id: 2, name: 'Phone', ... },
    { id: 4, name: 'TV', ... }
  ],
  Clothing: [
    { id: 3, name: 'Shirt', ... },
    { id: 5, name: 'Pants', ... }
  ]
}
*/

// Example 4: Average Calculation
const scores = [85, 92, 78, 95, 88, 91, 77, 84, 89, 93]

const avgScore = await mapReduce.execute(
  scores,
  // Map: Each score contributes to sum and count
  (score) => ({ sum: score, count: 1 }),
  // Reduce: Sum totals and counts
  (acc, item) => ({
    sum: acc.sum + item.sum,
    count: acc.count + item.count
  }),
  { sum: 0, count: 0 }
)

const average = avgScore.sum / avgScore.count
console.log('Average score:', average)  // 87.2

// Cleanup
mapReduce.terminate()
```

**Performance Comparison:**

```javascript
// Benchmark: Sequential vs Parallel MapReduce
const largeDataset = Array.from({ length: 10000000 }, (_, i) => i)

// Sequential
console.time('Sequential')
const seqResult = largeDataset
  .map(n => n * 2)
  .reduce((sum, n) => sum + n, 0)
console.timeEnd('Sequential')  // ~500ms

// Parallel
console.time('Parallel')
const parResult = await mapReduce.execute(
  largeDataset,
  n => n * 2,
  (sum, n) => sum + n,
  0
)
console.timeEnd('Parallel')  // ~150ms (3x faster!)

console.log('Results match:', seqResult === parResult)  // true
```

---

## 📖 Further Reading

### MDN Resources
- [Concurrency model and Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Using Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)
- [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)
- [Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)
- [Promise Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### Books & Courses
- "You Don't Know JS: Async & Performance" by Kyle Simpson
- "JavaScript: The Good Parts" by Douglas Crockford
- "Concurrency in JavaScript" by Adam Boduch

### Key Concepts to Master
- Event Loop internals and phases
- Promise state transitions and chaining
- Worker communication patterns
- Memory models and synchronization
- Lock-free algorithms
- Performance profiling and optimization

---

**Happy Concurrent Coding! 🚀**

*Master these concepts through practice, experimentation, and building real projects. Concurrency is complex, but extremely powerful when used correctly.*
