# Asynchronous JavaScript - Quick Summary & Interview Guide

## 📋 Quick Notes

### 1. Callbacks

**Basic Pattern:**
```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: 'John' };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log(data);  // { id: 1, name: 'John' }
});

// Error handling with callbacks
function fetchDataWithError(callback) {
  setTimeout(() => {
    const error = null;
    const data = { id: 1, name: 'John' };
    callback(error, data);  // Node.js convention: error-first
  }, 1000);
}

fetchDataWithError((err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

**Callback Hell:**
```javascript
// Nested callbacks - hard to read and maintain
getUser(userId, (user) => {
  getOrders(user.id, (orders) => {
    getOrderDetails(orders[0].id, (details) => {
      getPaymentInfo(details.paymentId, (payment) => {
        console.log(payment);  // 😱 Pyramid of doom
      });
    });
  });
});
```

---

### 2. Promises

**Creating Promises:**
```javascript
const promise = new Promise((resolve, reject) => {
  // Async operation
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('Success!');  // Fulfilled
    } else {
      reject('Failed!');    // Rejected
    }
  }, 1000);
});

// Consuming promises
promise
  .then(result => console.log(result))   // "Success!"
  .catch(error => console.error(error))  // If rejected
  .finally(() => console.log('Done'));   // Always runs
```

**Promise States:**
```javascript
// 1. Pending - initial state
const pending = new Promise((resolve, reject) => {
  // Not resolved or rejected yet
});

// 2. Fulfilled - successful
const fulfilled = Promise.resolve('Success');

// 3. Rejected - failed
const rejected = Promise.reject('Error');

// Once settled (fulfilled/rejected), state is immutable
```

**Chaining:**
```javascript
fetch('/api/user')
  .then(response => response.json())      // Transform
  .then(user => fetch(`/api/orders/${user.id}`))
  .then(response => response.json())
  .then(orders => {
    console.log(orders);
  })
  .catch(error => {
    console.error('Error:', error);  // Catches any error in chain
  });

// Return values
function getUser(id) {
  return fetch(`/api/user/${id}`)
    .then(res => res.json());
}

getUser(1)
  .then(user => {
    console.log(user);
    return user.name;  // Pass to next then
  })
  .then(name => {
    console.log(name);
  });
```

---

### 3. Async/Await

**Basic Syntax:**
```javascript
// async function always returns a Promise
async function fetchUser(id) {
  const response = await fetch(`/api/user/${id}`);
  const user = await response.json();
  return user;  // Wrapped in Promise.resolve()
}

// Calling async function
fetchUser(1)
  .then(user => console.log(user))
  .catch(error => console.error(error));

// Or with await (inside async function)
async function main() {
  try {
    const user = await fetchUser(1);
    console.log(user);
  } catch (error) {
    console.error(error);
  }
}
```

**Error Handling:**
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;  // Re-throw if needed
  } finally {
    console.log('Cleanup');
  }
}

// Multiple awaits
async function getUserWithOrders(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    const details = await fetchOrderDetails(orders[0].id);
    return { user, orders, details };
  } catch (error) {
    console.error(error);
  }
}
```

---

### 4. Promise Combinators

**Promise.all() - All or nothing:**
```javascript
// Waits for all promises to resolve, or rejects if any fails
const promise1 = fetch('/api/users');
const promise2 = fetch('/api/products');
const promise3 = fetch('/api/orders');

Promise.all([promise1, promise2, promise3])
  .then(responses => {
    // All succeeded - array of results
    console.log(responses);
  })
  .catch(error => {
    // Any failed - stops immediately
    console.error(error);
  });

// With async/await
async function fetchAll() {
  try {
    const [users, products, orders] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
      fetch('/api/orders').then(r => r.json())
    ]);
    
    return { users, products, orders };
  } catch (error) {
    console.error('One or more requests failed:', error);
  }
}
```

**Promise.allSettled() - All results (success or failure):**
```javascript
// Waits for all promises to settle (resolve or reject)
const promises = [
  fetch('/api/users'),
  fetch('/api/products'),
  fetch('/api/invalid')  // This will fail
];

Promise.allSettled(promises)
  .then(results => {
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`Promise ${index} succeeded:`, result.value);
      } else {
        console.log(`Promise ${index} failed:`, result.reason);
      }
    });
  });

// Output:
// { status: 'fulfilled', value: Response }
// { status: 'fulfilled', value: Response }
// { status: 'rejected', reason: Error }
```

**Promise.race() - First to finish:**
```javascript
// Returns first promise to settle (resolve or reject)
const timeout = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Timeout')), 5000)
);

const fetchData = fetch('/api/data');

Promise.race([fetchData, timeout])
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Failed or timed out:', error));

// Use case: timeout for slow requests
function fetchWithTimeout(url, ms) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}
```

**Promise.any() - First success:**
```javascript
// Returns first promise to fulfill (ignores rejections unless all fail)
const promises = [
  fetch('/api/server1/data'),
  fetch('/api/server2/data'),
  fetch('/api/server3/data')
];

Promise.any(promises)
  .then(data => console.log('First success:', data))
  .catch(error => console.error('All failed:', error));  // AggregateError
```

---

### 5. Event Loop

**Execution Order:**
```javascript
console.log('1: Synchronous');

setTimeout(() => {
  console.log('2: setTimeout (macrotask)');
}, 0);

Promise.resolve()
  .then(() => console.log('3: Promise (microtask)'));

console.log('4: Synchronous');

// Output:
// 1: Synchronous
// 4: Synchronous
// 3: Promise (microtask)
// 2: setTimeout (macrotask)

// Explanation:
// 1. Synchronous code runs first (1, 4)
// 2. Microtasks run (Promises) (3)
// 3. Macrotasks run (setTimeout, setInterval) (2)
```

**Microtasks vs Macrotasks:**
```javascript
// Microtasks (higher priority):
// - Promise callbacks (.then, .catch, .finally)
// - queueMicrotask()
// - MutationObserver

// Macrotasks (lower priority):
// - setTimeout
// - setInterval
// - setImmediate (Node.js)
// - I/O operations

// Example
console.log('Start');

setTimeout(() => console.log('Timeout 1'), 0);

Promise.resolve()
  .then(() => console.log('Promise 1'))
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
// Timeout 2
```

---

### 6. Async Patterns

**Sequential Execution:**
```javascript
async function sequential() {
  const user = await fetchUser(1);      // Wait
  const orders = await fetchOrders(user.id);  // Then wait
  const details = await fetchDetails(orders[0].id);  // Then wait
  return { user, orders, details };
}
// Total time: sum of all requests
```

**Parallel Execution:**
```javascript
async function parallel() {
  // Start all requests simultaneously
  const [user, products, settings] = await Promise.all([
    fetchUser(1),
    fetchProducts(),
    fetchSettings()
  ]);
  
  return { user, products, settings };
}
// Total time: longest request
```

**Conditional Parallel:**
```javascript
async function conditionalParallel(userId) {
  // First request
  const user = await fetchUser(userId);
  
  // Parallel requests based on first result
  const [orders, preferences] = await Promise.all([
    fetchOrders(user.id),
    fetchPreferences(user.id)
  ]);
  
  return { user, orders, preferences };
}
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between callbacks and Promises?

**Answer:**
Callbacks and Promises both handle async operations, but Promises provide better syntax and error handling.

**Callbacks:**
```javascript
// Callback style
function fetchUser(id, callback) {
  setTimeout(() => {
    callback(null, { id, name: 'John' });
  }, 1000);
}

fetchUser(1, (err, user) => {
  if (err) return console.error(err);
  
  fetchOrders(user.id, (err, orders) => {
    if (err) return console.error(err);
    
    fetchDetails(orders[0].id, (err, details) => {
      if (err) return console.error(err);
      
      console.log(details);  // Callback hell 😱
    });
  });
});
```

**Promises:**
```javascript
// Promise style
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id, name: 'John' });
    }, 1000);
  });
}

fetchUser(1)
  .then(user => fetchOrders(user.id))
  .then(orders => fetchDetails(orders[0].id))
  .then(details => console.log(details))
  .catch(error => console.error(error));  // Single error handler ✨

// Or with async/await (even cleaner)
async function getDetails(userId) {
  try {
    const user = await fetchUser(userId);
    const orders = await fetchOrders(user.id);
    const details = await fetchDetails(orders[0].id);
    return details;
  } catch (error) {
    console.error(error);
  }
}
```

**Key Differences:**

| Feature | Callbacks | Promises |
|---------|-----------|----------|
| Error handling | Each callback | Single `.catch()` |
| Nesting | Callback hell | Flat chaining |
| Composition | Hard | `Promise.all()`, etc. |
| Control flow | Complex | Sequential/parallel easy |
| Readability | Poor (nested) | Good (chain/async-await) |

---

### Q2: How does async/await work under the hood?

**Answer:**
`async/await` is syntactic sugar over Promises.

```javascript
// This async function...
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// ...is equivalent to:
function fetchData() {
  return fetch('/api/data')
    .then(response => response.json())
    .then(data => data);
}

// async always returns a Promise
async function test() {
  return 42;
}

test();  // Promise { 42 }
test().then(val => console.log(val));  // 42

// await pauses execution until Promise settles
async function demo() {
  console.log('1');
  const result = await Promise.resolve('2');  // Pauses here
  console.log(result);
  console.log('3');
}

demo();
console.log('4');

// Output:
// 1
// 4
// 2
// 3

// Error handling
async function withError() {
  throw new Error('Oops');
}

withError();  // Unhandled Promise rejection

// Caught:
withError().catch(err => console.error(err));  // Error: Oops

// Or with try-catch
async function handleError() {
  try {
    await withError();
  } catch (err) {
    console.error(err);  // Error: Oops
  }
}

// await only works in async functions (or top-level in modules)
const data = await fetch('/api');  // SyntaxError (unless top-level)

async function wrapper() {
  const data = await fetch('/api');  // ✓ Works
}
```

**Key points:**
- `async` function always returns a Promise
- `await` pauses execution until Promise settles
- `await` can only be used in `async` functions (or top-level modules)
- Errors become rejections (handle with try-catch or .catch)

---

### Q3: Explain the Event Loop and task queues.

**Answer:**
The Event Loop manages async operations using task queues.

**Architecture:**
```
┌───────────────────────────┐
│      Call Stack           │  ← Synchronous code
└───────────────────────────┘
           ↓
┌───────────────────────────┐
│   Microtask Queue         │  ← Promises, queueMicrotask
│   (Higher Priority)       │
└───────────────────────────┘
           ↓
┌───────────────────────────┐
│   Macrotask Queue         │  ← setTimeout, setInterval
│   (Lower Priority)        │
└───────────────────────────┘
```

**Execution Order:**
1. Execute all **synchronous** code (call stack)
2. Execute all **microtasks** (Promise callbacks)
3. Execute **one macrotask** (setTimeout)
4. Repeat from step 2

```javascript
console.log('1: Sync');

setTimeout(() => console.log('2: Macro'), 0);

Promise.resolve()
  .then(() => console.log('3: Micro 1'))
  .then(() => console.log('4: Micro 2'));

setTimeout(() => console.log('5: Macro'), 0);

Promise.resolve()
  .then(() => console.log('6: Micro 3'));

console.log('7: Sync');

// Output:
// 1: Sync
// 7: Sync
// 3: Micro 1
// 6: Micro 3
// 4: Micro 2
// 2: Macro
// 5: Macro

// Step by step:
// 1. Run all sync code: 1, 7
// 2. Run all microtasks: 3, 6, 4 (4 is from chained .then)
// 3. Run one macrotask: 2
// 4. Check microtasks (none)
// 5. Run next macrotask: 5
```

**Microtasks vs Macrotasks:**

| Microtasks | Macrotasks |
|------------|------------|
| Promise callbacks | setTimeout |
| queueMicrotask() | setInterval |
| MutationObserver | setImmediate (Node) |
| process.nextTick (Node) | I/O operations |
| Higher priority | Lower priority |
| All run before next macrotask | One per event loop cycle |

**Starving the Event Loop:**
```javascript
// Bad: Infinite microtasks block macrotasks
function infiniteMicrotasks() {
  Promise.resolve().then(infiniteMicrotasks);
}

infiniteMicrotasks();

setTimeout(() => {
  console.log('Never runs!');  // Blocked by microtasks
}, 0);

// Macrotasks allow other tasks to run
function betterApproach() {
  setTimeout(betterApproach, 0);  // Allows other tasks
}
```

---

### Q4: What's the difference between `Promise.all()` and `Promise.allSettled()`?

**Answer:**

**Promise.all() - Fails fast:**
```javascript
const promises = [
  Promise.resolve(1),
  Promise.reject('Error'),
  Promise.resolve(3)
];

Promise.all(promises)
  .then(results => console.log(results))
  .catch(error => console.log('Failed:', error));

// Output: "Failed: Error"
// Stops at first rejection, others ignored
```

**Promise.allSettled() - Waits for all:**
```javascript
Promise.allSettled(promises)
  .then(results => {
    console.log(results);
  });

// Output:
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'Error' },
//   { status: 'fulfilled', value: 3 }
// ]
// All results, regardless of success/failure
```

**Use cases:**

```javascript
// Promise.all - When you need ALL to succeed
async function criticalOperations() {
  try {
    const [users, products, orders] = await Promise.all([
      fetchUsers(),
      fetchProducts(),
      fetchOrders()
    ]);
    
    // Only proceeds if all succeed
    return { users, products, orders };
  } catch (error) {
    // One failed - abort everything
    console.error('Critical failure:', error);
  }
}

// Promise.allSettled - When some can fail
async function nonCriticalOperations() {
  const results = await Promise.allSettled([
    fetchRecommendations(),  // Nice to have
    fetchAds(),              // Nice to have
    fetchUserData()          // Critical
  ]);
  
  // Process what succeeded
  const data = {};
  
  if (results[0].status === 'fulfilled') {
    data.recommendations = results[0].value;
  }
  
  if (results[1].status === 'fulfilled') {
    data.ads = results[1].value;
  }
  
  if (results[2].status === 'fulfilled') {
    data.user = results[2].value;
  } else {
    throw new Error('Critical: User data failed');
  }
  
  return data;
}
```

**Summary:**
- `Promise.all()`: All must succeed, fails fast
- `Promise.allSettled()`: Wait for all, get all results

---

### Q5: How do you handle errors in async/await?

**Answer:**
Multiple approaches for error handling:

**1. Try-Catch (most common):**
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error.message);
    throw error;  // Re-throw or handle
  }
}

// Multiple operations
async function multipleOperations() {
  try {
    const user = await fetchUser();
    const orders = await fetchOrders(user.id);
    const details = await fetchDetails(orders[0].id);
    return { user, orders, details };
  } catch (error) {
    // Catches any error in the chain
    console.error('Operation failed:', error);
    return null;
  }
}
```

**2. .catch() on Promise:**
```javascript
async function fetchWithCatch() {
  const data = await fetch('/api/data')
    .then(res => res.json())
    .catch(error => {
      console.error('Fetch error:', error);
      return null;  // Fallback value
    });
  
  if (!data) {
    console.log('Using fallback');
  }
  
  return data;
}
```

**3. Wrapper Function:**
```javascript
// Utility to handle errors without try-catch
async function to(promise) {
  return promise
    .then(data => [null, data])
    .catch(error => [error, null]);
}

// Usage
async function example() {
  const [error, user] = await to(fetchUser(1));
  
  if (error) {
    console.error('User fetch failed:', error);
    return;
  }
  
  console.log(user);
}
```

**4. Specific Error Handling:**
```javascript
class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

async function robustFetch() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new NetworkError(`Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.id) {
      throw new ValidationError('Missing ID');
    }
    
    return data;
  } catch (error) {
    if (error instanceof NetworkError) {
      console.error('Network issue:', error.message);
      // Retry logic
    } else if (error instanceof ValidationError) {
      console.error('Data invalid:', error.message);
      // Use defaults
    } else {
      console.error('Unknown error:', error);
    }
    
    throw error;
  }
}
```

**5. Finally for Cleanup:**
```javascript
async function fetchWithCleanup() {
  let loading = true;
  
  try {
    const data = await fetch('/api/data').then(r => r.json());
    return data;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    loading = false;  // Always runs
    console.log('Cleanup complete');
  }
}
```

---

### Q6: What happens if you don't await a Promise?

**Answer:**
Not awaiting means you get a Promise, not the value:

```javascript
async function fetchUser() {
  return { id: 1, name: 'John' };
}

// Without await
async function example1() {
  const user = fetchUser();
  console.log(user);  // Promise { <pending> } ⚠️
  console.log(user.name);  // undefined
}

// With await
async function example2() {
  const user = await fetchUser();
  console.log(user);  // { id: 1, name: 'John' } ✓
  console.log(user.name);  // 'John'
}

// Errors are unhandled
async function throwError() {
  throw new Error('Oops');
}

async function noAwait() {
  throwError();  // Unhandled Promise rejection! ⚠️
  console.log('Continues');  // This still runs
}

async function withAwait() {
  try {
    await throwError();  // Caught! ✓
  } catch (error) {
    console.error(error);
  }
}

// Fire and forget (intentional)
async function logAnalytics(event) {
  // Don't wait - fire and forget
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(event)
  });  // Not awaited - continues immediately
  
  console.log('Analytics sent (maybe)');
}

// Better: Handle errors even if not awaited
async function logAnalyticsBetter(event) {
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(event)
  }).catch(error => {
    console.error('Analytics failed:', error);
  });
}
```

**Key points:**
- Not awaiting returns a Promise
- Errors become unhandled rejections
- Intentional for "fire and forget" operations
- Always handle errors, even if not awaited

---

### Q7: Can you use async/await with forEach?

**Answer:**
**No, `forEach` doesn't work with `async/await`!**

```javascript
const ids = [1, 2, 3];

// ❌ WRONG - forEach doesn't wait
async function wrongWay() {
  ids.forEach(async (id) => {
    const user = await fetchUser(id);
    console.log(user);
  });
  
  console.log('Done');  // Prints BEFORE users! ⚠️
}

// ✅ CORRECT - Use for...of (sequential)
async function correctWaySequential() {
  for (const id of ids) {
    const user = await fetchUser(id);
    console.log(user);
  }
  
  console.log('Done');  // Prints AFTER all users ✓
}

// ✅ CORRECT - Use Promise.all (parallel)
async function correctWayParallel() {
  const users = await Promise.all(
    ids.map(id => fetchUser(id))
  );
  
  users.forEach(user => console.log(user));
  console.log('Done');
}

// ✅ CORRECT - map + Promise.all
async function mapApproach() {
  const promises = ids.map(async (id) => {
    const user = await fetchUser(id);
    return user;
  });
  
  const users = await Promise.all(promises);
  console.log(users);
}

// Comparison

// Sequential (one at a time)
async function sequential() {
  for (const id of [1, 2, 3]) {
    await fetchUser(id);  // Wait for each
  }
  // Total time: 3 seconds (1+1+1)
}

// Parallel (all at once)
async function parallel() {
  await Promise.all([
    fetchUser(1),
    fetchUser(2),
    fetchUser(3)
  ]);
  // Total time: 1 second (max of all)
}
```

**Why forEach doesn't work:**
```javascript
// forEach implementation (simplified)
Array.prototype.forEach = function(callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this);  // Doesn't await!
  }
};

// Your async callback returns Promise, but forEach ignores it
```

**Solutions:**
- **Sequential:** `for...of` loop
- **Parallel:** `Promise.all()` with `map()`
- **Never:** `forEach` with `async`

---

### Q8: What's the difference between Promise.race() and Promise.any()?

**Answer:**

**Promise.race() - First to settle (resolve OR reject):**
```javascript
const promises = [
  new Promise(resolve => setTimeout(() => resolve('Fast'), 100)),
  new Promise((_, reject) => setTimeout(() => reject('Error'), 50)),
  new Promise(resolve => setTimeout(() => resolve('Slow'), 1000))
];

Promise.race(promises)
  .then(result => console.log('Won:', result))
  .catch(error => console.log('Lost:', error));

// Output: "Lost: Error" (first to finish, even though it's a reject)
```

**Promise.any() - First to fulfill (resolve only):**
```javascript
Promise.any(promises)
  .then(result => console.log('Won:', result))
  .catch(error => console.log('All failed:', error));

// Output: "Won: Fast" (ignores the reject, waits for first resolve)
```

**Use Cases:**

```javascript
// Promise.race - Timeout implementation
function fetchWithTimeout(url, timeout) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

fetchWithTimeout('/api/data', 5000)
  .then(data => console.log(data))
  .catch(error => console.log('Timed out or failed'));

// Promise.any - Fallback servers
async function fetchFromFastest() {
  try {
    const data = await Promise.any([
      fetch('https://api1.example.com/data'),
      fetch('https://api2.example.com/data'),
      fetch('https://api3.example.com/data')
    ]);
    
    return data.json();
  } catch (error) {
    // All servers failed
    throw new Error('All servers unavailable');
  }
}
```

**Summary:**

| Feature | Promise.race() | Promise.any() |
|---------|---------------|---------------|
| Returns | First to settle | First to fulfill |
| Rejects | If first is reject | If all reject |
| Use case | Timeout, fastest response | Fallback servers |

---

### Q9: What's the output?

```javascript
async function test() {
  console.log('1');
  
  await Promise.resolve();
  
  console.log('2');
}

console.log('3');

test();

console.log('4');
```

**Answer:**
```javascript
// Output:
// 3
// 1
// 4
// 2

// Explanation:

// Step 1: Sync code runs
console.log('3');  // ← Prints "3"

// Step 2: test() is called
// - Enters function
console.log('1');  // ← Prints "1"
// - Encounters await, yields control
await Promise.resolve();  // Pauses here, adds callback to microtask queue

// Step 3: Back to sync code
console.log('4');  // ← Prints "4"

// Step 4: Call stack empty, run microtasks
console.log('2');  // ← Prints "2" (from awaited Promise)

// Key concept: await yields control until next microtask
```

---

### Q10: How do you implement retry logic with exponential backoff?

**Answer:**
```javascript
async function fetchWithRetry(url, options = {}) {
  const { maxRetries = 3, baseDelay = 1000 } = options;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      
      if (isLastAttempt) {
        throw error;  // Give up
      }
      
      // Exponential backoff: 1s, 2s, 4s, 8s...
      const delay = baseDelay * Math.pow(2, attempt);
      
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
try {
  const data = await fetchWithRetry('/api/data', {
    maxRetries: 3,
    baseDelay: 1000
  });
  console.log(data);
} catch (error) {
  console.error('Failed after retries:', error);
}

// Advanced: with jitter (randomness to avoid thundering herd)
function getDelayWithJitter(baseDelay, attempt, jitter = 0.1) {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitterAmount = exponentialDelay * jitter;
  const randomJitter = (Math.random() - 0.5) * 2 * jitterAmount;
  
  return exponentialDelay + randomJitter;
}

async function fetchWithRetryAndJitter(url, options = {}) {
  const { maxRetries = 3, baseDelay = 1000 } = options;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = getDelayWithJitter(baseDelay, attempt);
      
      console.log(`Retry ${attempt + 1} in ${delay.toFixed(0)}ms`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

---

## 🎓 Key Takeaways

✅ Promises provide better async flow than callbacks  
✅ `async/await` is syntactic sugar over Promises  
✅ Always handle Promise rejections (try-catch or .catch)  
✅ Microtasks (Promises) run before macrotasks (setTimeout)  
✅ `Promise.all()` for parallel operations (fails fast)  
✅ `Promise.allSettled()` when some can fail  
✅ Don't use `forEach` with async/await - use `for...of`  
✅ Not awaiting a Promise gives you a Promise, not the value  
✅ `await` only works in `async` functions  
✅ Event loop: Sync → Microtasks → Macrotask → Repeat

---

## 📚 Practice Tips

1. Convert callback-based code to Promises, then async/await
2. Practice with `Promise.all()`, `race()`, `any()`, `allSettled()`
3. Trace event loop execution order for complex examples
4. Implement retry logic and timeout wrappers
5. Handle errors with try-catch and .catch() patterns

---

**Next Topic:** Functions & Closures (Higher-Order Functions, Scope, Closures)
