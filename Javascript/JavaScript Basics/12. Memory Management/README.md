# Memory Management - Quick Summary & Interview Guide

## 📋 Quick Notes

### 1. Garbage Collection Basics

**How it Works:**
```javascript
// Memory allocation
let user = { name: 'John', age: 30 };  // Object created in heap

// Memory in use
console.log(user.name);

// Memory eligible for GC
user = null;  // No references left → can be collected

// Automatic garbage collection
// JavaScript uses mark-and-sweep algorithm
// 1. Mark: Start from roots (global, stack), mark reachable objects
// 2. Sweep: Delete unmarked (unreachable) objects

// Example: Unreachable object
function createObject() {
  const temp = { data: new Array(1000) };  // Created
  // Function ends, temp goes out of scope
  // Object becomes unreachable → GC eligible
}

createObject();  // After execution, object is collected
```

**Reference Counting (old method):**
```javascript
// Problem: Circular references
function createCircular() {
  const obj1 = {};
  const obj2 = {};
  
  obj1.ref = obj2;  // obj1 → obj2
  obj2.ref = obj1;  // obj2 → obj1
  
  return 'done';
}

createCircular();
// Objects reference each other
// Reference counting can't collect them
// Modern engines use mark-and-sweep (handles this)
```

---

### 2. Memory Leaks

**Common Causes:**

**1. Global Variables:**
```javascript
// ❌ Accidental global (memory leak)
function createUser() {
  user = { name: 'John' };  // No var/let/const → global!
}

createUser();
// 'user' persists in global scope forever

// ✅ Proper scoping
function createUser() {
  const user = { name: 'John' };  // Local variable
  return user;
}
```

**2. Forgotten Timers:**
```javascript
// ❌ Memory leak
function startTimer() {
  const data = new Array(1000000);
  
  setInterval(() => {
    console.log(data.length);  // Keeps 'data' in memory
  }, 1000);
}

startTimer();
// Timer runs forever, 'data' never released

// ✅ Clean up timers
function startTimer() {
  const data = new Array(1000000);
  
  const timerId = setInterval(() => {
    console.log(data.length);
  }, 1000);
  
  // Clear when done
  setTimeout(() => clearInterval(timerId), 10000);
  
  return timerId;  // Allow external cleanup
}
```

**3. Detached DOM Nodes:**
```javascript
// ❌ Memory leak
const elements = [];

function addElement() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  elements.push(div);  // Store reference
}

function removeElement() {
  const div = elements[0];
  document.body.removeChild(div);  // Removed from DOM
  // But elements[0] still holds reference → leak
}

// ✅ Clean up references
function removeElement() {
  const div = elements.shift();  // Remove from array
  document.body.removeChild(div);
  // No references left → can be GC'd
}
```

**4. Closures:**
```javascript
// ❌ Unintentional retention
function outer() {
  const largeData = new Array(1000000).fill('data');
  
  return function inner() {
    console.log('Hello');  // Doesn't use largeData
    // But closure keeps entire outer scope in memory
  };
}

const fn = outer();
// largeData stays in memory even though unused

// ✅ Careful with closures
function outer() {
  const largeData = new Array(1000000).fill('data');
  const needed = largeData.length;  // Extract what's needed
  
  return function inner() {
    console.log(needed);  // Only keeps 'needed', not largeData
  };
}
```

**5. Event Listeners:**
```javascript
// ❌ Memory leak
class Component {
  constructor(element) {
    this.element = element;
    this.data = new Array(1000000);
    
    this.element.addEventListener('click', () => {
      console.log(this.data.length);  // Keeps 'this' in memory
    });
  }
}

const comp = new Component(element);
element.remove();  // Element removed, but listener persists
// Component and data stay in memory

// ✅ Remove listeners
class Component {
  constructor(element) {
    this.element = element;
    this.data = new Array(1000000);
    
    this.handleClick = () => {
      console.log(this.data.length);
    };
    
    this.element.addEventListener('click', this.handleClick);
  }
  
  destroy() {
    this.element.removeEventListener('click', this.handleClick);
    this.element = null;
    this.data = null;
  }
}
```

---

### 3. WeakMap and WeakSet

**WeakMap - Weak References:**
```javascript
// Regular Map - prevents GC
const map = new Map();
let obj = { data: 'value' };

map.set(obj, 'metadata');
obj = null;  // Object still in Map → not collected

// WeakMap - allows GC
const weakMap = new WeakMap();
let obj2 = { data: 'value' };

weakMap.set(obj2, 'metadata');
obj2 = null;  // Object can be collected, entry auto-removed

// Use case: Private data
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { secret: 'password123' });
    this.name = name;
  }
  
  getSecret() {
    return privateData.get(this).secret;
  }
}

const user = new User('John');
user.getSecret();  // 'password123'
user.secret;  // undefined (not accessible)

// When user is deleted, privateData entry is auto-removed
```

**WeakSet:**
```javascript
// Track objects without preventing GC
const tracked = new WeakSet();

class Component {
  constructor() {
    tracked.add(this);  // Track instance
  }
}

let comp = new Component();
tracked.has(comp);  // true

comp = null;  // Component can be GC'd, auto-removed from WeakSet
```

**Limitations:**
```javascript
// WeakMap keys must be objects
const weakMap = new WeakMap();
weakMap.set('string', 'value');  // ❌ TypeError
weakMap.set(123, 'value');       // ❌ TypeError
weakMap.set({}, 'value');        // ✅ Works

// Not iterable
weakMap.forEach();   // ❌ TypeError
weakMap.keys();      // ❌ TypeError
weakMap.size;        // ❌ undefined

// Only methods: get, set, has, delete
```

---

### 4. Memory Profiling

**Chrome DevTools:**
```javascript
// Take heap snapshots
// DevTools → Memory → Heap snapshot

// Example: Find memory leaks
const leaks = [];

function createLeak() {
  const data = new Array(100000).fill('leak');
  leaks.push(data);
}

// Take snapshot 1
createLeak();
createLeak();
createLeak();
// Take snapshot 2

// Compare snapshots to see growth

// Performance timeline
// Shows memory over time
performance.memory.usedJSHeapSize;    // Bytes used
performance.memory.totalJSHeapSize;   // Total heap
performance.memory.jsHeapSizeLimit;   // Max heap
```

**Manual Profiling:**
```javascript
// Measure memory usage
function measureMemory(fn) {
  if (performance.memory) {
    const before = performance.memory.usedJSHeapSize;
    
    fn();
    
    // Force GC in Chrome (--expose-gc flag)
    if (global.gc) {
      global.gc();
    }
    
    const after = performance.memory.usedJSHeapSize;
    const diff = after - before;
    
    console.log(`Memory used: ${(diff / 1024 / 1024).toFixed(2)} MB`);
  }
}

// Usage
measureMemory(() => {
  const arr = new Array(1000000).fill('data');
});
```

---

### 5. Optimization Techniques

**Object Pooling:**
```javascript
// Instead of creating/destroying objects
class ObjectPool {
  constructor(createFn, resetFn) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
  }
  
  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();  // Reuse
    }
    return this.createFn();  // Create new
  }
  
  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);  // Return to pool
  }
}

// Usage: Particle system
const particlePool = new ObjectPool(
  () => ({ x: 0, y: 0, vx: 0, vy: 0 }),
  (p) => { p.x = 0; p.y = 0; p.vx = 0; p.vy = 0; }
);

function createParticle(x, y) {
  const particle = particlePool.acquire();
  particle.x = x;
  particle.y = y;
  return particle;
}

function destroyParticle(particle) {
  particlePool.release(particle);  // Reuse instead of GC
}
```

**Avoiding Memory Allocation:**
```javascript
// ❌ Creates new array every call
function getCoordinates(x, y) {
  return [x, y];  // New array allocation
}

// ✅ Reuse object
const coords = { x: 0, y: 0 };

function getCoordinates(x, y, out = coords) {
  out.x = x;
  out.y = y;
  return out;
}

// ❌ String concatenation in loop
let result = '';
for (let i = 0; i < 10000; i++) {
  result += i;  // Creates new string each time
}

// ✅ Use array join
const parts = [];
for (let i = 0; i < 10000; i++) {
  parts.push(i);
}
const result = parts.join('');
```

**Lazy Loading:**
```javascript
// Load only when needed
class DataManager {
  constructor() {
    this._largeData = null;
  }
  
  get largeData() {
    if (!this._largeData) {
      this._largeData = this.loadLargeData();
    }
    return this._largeData;
  }
  
  loadLargeData() {
    return new Array(1000000).fill('data');
  }
  
  cleanup() {
    this._largeData = null;  // Release when done
  }
}
```

---

### 6. Memory-Efficient Data Structures

**Typed Arrays:**
```javascript
// Regular array (variable types)
const arr = [1, 2, 3, 4, 5];  // Each element can be any type

// Typed array (fixed type, less memory)
const int32 = new Int32Array(5);
int32[0] = 1;
int32[1] = 2;

// Memory comparison
const regularArray = new Array(1000000).fill(1);
// ~8-16 bytes per element (depends on engine)

const typedArray = new Int32Array(1000000);
// Exactly 4 bytes per element

// Use cases: Graphics, audio, binary data
const buffer = new ArrayBuffer(16);  // 16 bytes
const view = new DataView(buffer);
view.setInt32(0, 42);
view.getInt32(0);  // 42
```

**Strings:**
```javascript
// Strings are immutable and can share memory
const str1 = 'hello';
const str2 = 'hello';  // May point to same memory (interning)

// Template literals create new strings
const str3 = `hello`;  // New string

// Large string manipulation
// ❌ Inefficient
let result = '';
for (let i = 0; i < 100000; i++) {
  result += 'a';  // Creates 100,000 intermediate strings
}

// ✅ Efficient
const chars = [];
for (let i = 0; i < 100000; i++) {
  chars.push('a');
}
const result = chars.join('');  // Single concatenation
```

---

### 7. Monitoring and Detection

**Detecting Leaks:**
```javascript
// Simple leak detector
class LeakDetector {
  constructor() {
    this.objects = new WeakSet();
  }
  
  track(obj) {
    this.objects.add(obj);
  }
  
  // Check if object is still alive
  isAlive(obj) {
    return this.objects.has(obj);
  }
}

// Usage
const detector = new LeakDetector();

function test() {
  const obj = { data: 'test' };
  detector.track(obj);
  // obj should be GC'd after this function
}

test();

// Later: Check if leaked (requires manual testing)
// If object still exists, it's a leak
```

**Memory Monitoring:**
```javascript
// Monitor memory over time
class MemoryMonitor {
  constructor(interval = 1000) {
    this.samples = [];
    this.interval = interval;
    this.timerId = null;
  }
  
  start() {
    this.timerId = setInterval(() => {
      if (performance.memory) {
        this.samples.push({
          timestamp: Date.now(),
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize
        });
      }
    }, this.interval);
  }
  
  stop() {
    clearInterval(this.timerId);
  }
  
  getReport() {
    if (this.samples.length === 0) return null;
    
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const growth = last.used - first.used;
    
    return {
      duration: last.timestamp - first.timestamp,
      growth: (growth / 1024 / 1024).toFixed(2) + ' MB',
      samples: this.samples.length,
      average: (last.used / 1024 / 1024).toFixed(2) + ' MB'
    };
  }
}

// Usage
const monitor = new MemoryMonitor(1000);
monitor.start();

// ... run your code ...

setTimeout(() => {
  monitor.stop();
  console.log(monitor.getReport());
}, 10000);
```

---

### 8. Best Practices

**Resource Cleanup:**
```javascript
// Pattern: Explicit cleanup
class Resource {
  constructor() {
    this.data = new Array(1000000);
    this.timerId = setInterval(() => {}, 1000);
    this.element = document.createElement('div');
    
    this.handleClick = this.onClick.bind(this);
    this.element.addEventListener('click', this.handleClick);
  }
  
  onClick() {
    console.log('Clicked');
  }
  
  dispose() {
    // Clear timer
    clearInterval(this.timerId);
    
    // Remove listener
    this.element.removeEventListener('click', this.handleClick);
    
    // Clear references
    this.data = null;
    this.element = null;
  }
}

// Usage
const resource = new Resource();
// ... use resource ...
resource.dispose();  // Clean up
```

**AbortController for Cleanup:**
```javascript
// Modern pattern for cancellation
class Component {
  constructor() {
    this.controller = new AbortController();
    this.signal = this.controller.signal;
  }
  
  async fetchData() {
    const response = await fetch('/api/data', {
      signal: this.signal  // Tied to component lifecycle
    });
    return response.json();
  }
  
  attachListeners() {
    document.addEventListener('click', this.handleClick, {
      signal: this.signal  // Auto-removed when aborted
    });
  }
  
  handleClick = () => {
    console.log('Clicked');
  }
  
  destroy() {
    this.controller.abort();  // Cancels fetch, removes listeners
  }
}
```

---

## 🎯 Interview Questions & Answers

### Q1: How does garbage collection work in JavaScript?

**Answer:**

JavaScript uses **mark-and-sweep** algorithm for garbage collection.

```javascript
// Mark-and-sweep phases:

// 1. MARK PHASE: Start from roots, mark reachable objects
const root = {
  child: { grandchild: {} }
};
// root → marked
// child → marked (reachable from root)
// grandchild → marked (reachable from child)

// 2. SWEEP PHASE: Delete unmarked objects
let orphan = { data: 'isolated' };
orphan = null;  // No references → unmarked → swept

// Roots include:
// - Global variables
// - Currently executing function stack
// - Active closures

// Example: Unreachable object
function example() {
  const temp = { data: new Array(1000) };
  // temp is reachable while function executes
}
example();
// After function ends, temp is unreachable → GC'd

// Circular references are handled
const obj1 = {};
const obj2 = {};
obj1.ref = obj2;
obj2.ref = obj1;

obj1 = null;
obj2 = null;
// Both unreachable → both collected (mark-and-sweep handles this)
```

**Generational GC:**
```javascript
// Modern engines use generational GC
// Objects are categorized by age:

// Young generation (frequently collected):
// - Short-lived objects
// - Collected often, quickly

function createTemp() {
  const temp = { data: 'temporary' };  // Young generation
  return temp.data;
}  // temp is collected quickly

// Old generation (rarely collected):
// - Long-lived objects
// - Collected less often

const global = { data: 'persistent' };  // Eventually moves to old gen
// Survives multiple GC cycles → promoted to old generation
```

---

### Q2: What are common causes of memory leaks?

**Answer:**

**1. Global Variables:**
```javascript
// ❌ Accidental global
function leak() {
  data = new Array(1000000);  // Missing var/let/const
}
leak();  // 'data' is now global → persists forever

// ✅ Proper scoping
function noLeak() {
  const data = new Array(1000000);
}
```

**2. Forgotten Timers:**
```javascript
// ❌ Leak
const data = new Array(1000000);
setInterval(() => {
  console.log(data[0]);  // Keeps data in memory
}, 1000);  // Runs forever

// ✅ Clear timers
const timerId = setInterval(() => {}, 1000);
clearInterval(timerId);
```

**3. Event Listeners:**
```javascript
// ❌ Leak
function addListener() {
  const element = document.getElementById('btn');
  const data = new Array(1000000);
  
  element.addEventListener('click', () => {
    console.log(data.length);  // Closure keeps data
  });
}
addListener();
// Listener persists → data persists

// ✅ Remove listeners
function addListener() {
  const element = document.getElementById('btn');
  const handler = () => {};
  
  element.addEventListener('click', handler);
  
  return () => {
    element.removeEventListener('click', handler);
  };
}

const cleanup = addListener();
cleanup();  // Remove listener
```

**4. Closures:**
```javascript
// ❌ Unintentional retention
function outer() {
  const huge = new Array(1000000);
  
  return function inner() {
    console.log('hello');  // Doesn't use 'huge'
  };
}

const fn = outer();  // 'huge' stays in memory

// ✅ Don't capture unnecessarily
function outer() {
  const huge = new Array(1000000);
  const small = huge.length;
  
  return function inner() {
    console.log(small);  // Only captures 'small'
  };
}
```

**5. Detached DOM Nodes:**
```javascript
// ❌ Leak
const cache = [];

function createNode() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  cache.push(div);  // Store reference
}

function removeNode() {
  const div = cache[0];
  div.remove();  // Removed from DOM
  // But cache[0] still references it → leak
}

// ✅ Clear references
function removeNode() {
  const div = cache.shift();  // Remove from cache
  div.remove();  // Now can be GC'd
}
```

---

### Q3: What's the difference between WeakMap and Map?

**Answer:**

```javascript
// Map - Strong references (prevents GC)
const map = new Map();
let obj = { data: 'value' };

map.set(obj, 'metadata');
obj = null;  // Object still in Map → not collected

console.log(map.size);  // 1 (object persists)

// WeakMap - Weak references (allows GC)
const weakMap = new WeakMap();
let obj2 = { data: 'value' };

weakMap.set(obj2, 'metadata');
obj2 = null;  // Object can be collected

// After GC, entry is automatically removed from WeakMap
```

**Comparison:**

| Feature | Map | WeakMap |
|---------|-----|---------|
| **Keys** | Any type | Objects only |
| **GC** | Prevents collection | Allows collection |
| **Iterable** | Yes (.forEach, .keys) | No |
| **Size** | .size property | No size |
| **Use case** | General mapping | Private data, caching |

**Use Cases:**

```javascript
// Map - Counting, general storage
const counts = new Map();
counts.set('apple', 5);
counts.set('banana', 3);

// WeakMap - Private data
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { password: '123' });
    this.name = name;
  }
  
  getPassword() {
    return privateData.get(this).password;
  }
}

const user = new User('John');
user.getPassword();  // '123'
user.password;  // undefined (private)

// WeakMap - DOM node metadata
const metadata = new WeakMap();

function attachData(element, data) {
  metadata.set(element, data);
}

const div = document.createElement('div');
attachData(div, { clicks: 0 });

div.remove();  // Element GC'd → metadata auto-removed
```

---

### Q4: How do you detect and fix memory leaks?

**Answer:**

**Detection:**

```javascript
// 1. Chrome DevTools Heap Snapshot
// - Take snapshot before operation
// - Perform operation multiple times
// - Take snapshot after
// - Compare snapshots for growth

// 2. Performance Timeline
// Monitor memory over time
const monitor = setInterval(() => {
  if (performance.memory) {
    console.log({
      used: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB',
      total: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + ' MB'
    });
  }
}, 1000);

// 3. Three-snapshot technique
// Snapshot 1 → Action → Snapshot 2 → Action → Snapshot 3
// Compare 2 and 3: Objects in both = leaked

// Fixing leaks:

// ❌ Problem: Forgotten listener
function setupComponent() {
  const data = new Array(1000000);
  
  button.addEventListener('click', () => {
    console.log(data[0]);
  });
}

// ✅ Fix: Remove listener
function setupComponent() {
  const data = new Array(1000000);
  
  const handler = () => console.log(data[0]);
  button.addEventListener('click', handler);
  
  return () => {
    button.removeEventListener('click', handler);
  };
}

const cleanup = setupComponent();
cleanup();  // Call when done

// ✅ Better: AbortController
function setupComponent() {
  const controller = new AbortController();
  
  button.addEventListener('click', () => {}, {
    signal: controller.signal
  });
  
  return () => controller.abort();
}
```

---

### Q5: Explain object pooling and when to use it.

**Answer:**

Object pooling reuses objects instead of creating/destroying them.

```javascript
// Without pooling (GC pressure)
function createParticles() {
  const particles = [];
  
  for (let i = 0; i < 1000; i++) {
    particles.push({ x: 0, y: 0, vx: 0, vy: 0 });  // 1000 allocations
  }
  
  // Later: destroy particles
  particles.length = 0;  // All GC'd → GC pressure
}

// With pooling (reuse)
class ParticlePool {
  constructor(size) {
    this.pool = [];
    this.active = [];
    
    for (let i = 0; i < size; i++) {
      this.pool.push({ x: 0, y: 0, vx: 0, vy: 0 });
    }
  }
  
  acquire() {
    if (this.pool.length > 0) {
      const particle = this.pool.pop();
      this.active.push(particle);
      return particle;  // Reuse
    }
    
    const particle = { x: 0, y: 0, vx: 0, vy: 0 };
    this.active.push(particle);
    return particle;  // Create if needed
  }
  
  release(particle) {
    const index = this.active.indexOf(particle);
    if (index > -1) {
      this.active.splice(index, 1);
      
      // Reset state
      particle.x = 0;
      particle.y = 0;
      particle.vx = 0;
      particle.vy = 0;
      
      this.pool.push(particle);  // Return to pool
    }
  }
}

// Usage
const pool = new ParticlePool(100);

// Create particle
const p = pool.acquire();
p.x = 10;
p.y = 20;

// Destroy particle
pool.release(p);  // Reused, not GC'd
```

**When to use:**
- Frequently created/destroyed objects
- Game development (particles, bullets)
- High-performance scenarios
- Avoiding GC pauses

---

### Q6: How do closures affect memory?

**Answer:**

Closures capture variables from outer scope, keeping them in memory.

```javascript
// Simple closure
function outer() {
  const data = 'hello';
  
  return function inner() {
    console.log(data);  // Captures 'data'
  };
}

const fn = outer();
// 'data' stays in memory as long as fn exists

// ❌ Problem: Unintentional capture
function createHandlers() {
  const largeArray = new Array(1000000).fill('data');
  
  return {
    handler1: () => console.log('Hello'),  // Doesn't use largeArray
    handler2: () => console.log(largeArray[0])  // Uses largeArray
  };
}

const handlers = createHandlers();
// Both handlers share same closure scope
// largeArray stays in memory for both (even handler1 doesn't use it)

// ✅ Fix: Separate scopes
function createHandlers() {
  const largeArray = new Array(1000000).fill('data');
  
  const handler1 = (() => {
    // Separate scope, doesn't capture largeArray
    return () => console.log('Hello');
  })();
  
  const handler2 = () => console.log(largeArray[0]);
  
  return { handler1, handler2 };
}

// ✅ Better: Only capture what's needed
function createHandlers() {
  const largeArray = new Array(1000000).fill('data');
  const firstElement = largeArray[0];  // Extract needed data
  
  return {
    handler1: () => console.log('Hello'),
    handler2: () => console.log(firstElement)  // Captures only firstElement
  };
}
// largeArray can be GC'd after function returns
```

---

### Q7: What are Typed Arrays and when should you use them?

**Answer:**

Typed Arrays store data in fixed-type buffers, more memory-efficient than regular arrays.

```javascript
// Regular Array (flexible but larger)
const regularArray = [1, 2, 3, 4, 5];
// Each element: variable size (8-16 bytes typically)

// Typed Array (fixed type, smaller)
const int32Array = new Int32Array([1, 2, 3, 4, 5]);
// Each element: exactly 4 bytes

// Types available:
Int8Array      // 1 byte per element, -128 to 127
Uint8Array     // 1 byte per element, 0 to 255
Int16Array     // 2 bytes, -32768 to 32767
Uint16Array    // 2 bytes, 0 to 65535
Int32Array     // 4 bytes
Uint32Array    // 4 bytes
Float32Array   // 4 bytes
Float64Array   // 8 bytes

// Creating Typed Arrays
const arr1 = new Int32Array(10);  // 10 elements, initialized to 0
const arr2 = new Int32Array([1, 2, 3]);  // From array
const buffer = new ArrayBuffer(16);  // 16 bytes
const arr3 = new Int32Array(buffer);  // 4 elements (16 / 4)

// Memory usage comparison
const regular = new Array(1000000).fill(42);
// ~8-16 MB (depends on engine)

const typed = new Int32Array(1000000).fill(42);
// Exactly 4 MB (1,000,000 * 4 bytes)

// Use cases:
// 1. Binary data
const data = new Uint8Array([72, 101, 108, 108, 111]);
const text = String.fromCharCode(...data);  // "Hello"

// 2. Graphics/WebGL
const vertices = new Float32Array([
  0.0, 0.5, 0.0,
  -0.5, -0.5, 0.0,
  0.5, -0.5, 0.0
]);

// 3. Audio processing
const audioBuffer = new Float32Array(44100);  // 1 second at 44.1kHz

// 4. Network protocols
const packet = new Uint8Array(1024);
```

**When to use:**
- Large numeric datasets
- Binary data processing
- Graphics/audio/video
- Network protocols
- Memory-constrained environments

---

### Q8: How do you prevent memory leaks with event listeners?

**Answer:**

```javascript
// ❌ Problem 1: Anonymous functions can't be removed
element.addEventListener('click', () => {
  console.log('Clicked');
});

// Can't remove:
// element.removeEventListener('click', ???);  // No reference

// ✅ Solution 1: Named function
function handleClick() {
  console.log('Clicked');
}

element.addEventListener('click', handleClick);
element.removeEventListener('click', handleClick);  // Can remove

// ❌ Problem 2: Closure captures large data
function setup() {
  const largeData = new Array(1000000);
  
  element.addEventListener('click', () => {
    console.log(largeData[0]);  // Keeps largeData in memory
  });
}

// ✅ Solution 2: Extract needed data
function setup() {
  const largeData = new Array(1000000);
  const firstItem = largeData[0];
  
  element.addEventListener('click', () => {
    console.log(firstItem);  // Only captures firstItem
  });
}

// ✅ Solution 3: AbortController (modern)
function setup() {
  const controller = new AbortController();
  
  element.addEventListener('click', handleClick, {
    signal: controller.signal
  });
  
  // Later: Remove all listeners
  controller.abort();
}

// ✅ Solution 4: Event delegation
// Instead of adding listener to each item
items.forEach(item => {
  item.addEventListener('click', handleClick);  // N listeners
});

// Add one listener to parent
parent.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e);  // 1 listener
  }
});

// ✅ Solution 5: Cleanup pattern
class Component {
  constructor(element) {
    this.element = element;
    this.listeners = [];
  }
  
  addEventListener(event, handler) {
    this.element.addEventListener(event, handler);
    this.listeners.push({ event, handler });
  }
  
  destroy() {
    this.listeners.forEach(({ event, handler }) => {
      this.element.removeEventListener(event, handler);
    });
    this.listeners = [];
  }
}
```

---

### Q9: What's the difference between shallow and deep cloning in terms of memory?

**Answer:**

```javascript
// Original object
const original = {
  name: 'John',
  address: { city: 'NYC', zip: '10001' },
  hobbies: ['reading', 'gaming']
};

// Shallow clone - copies references
const shallow = { ...original };
// OR: Object.assign({}, original)

shallow.name = 'Jane';  // ✓ New string
console.log(original.name);  // 'John' (unchanged)

shallow.address.city = 'LA';  // ✗ Modifies shared reference
console.log(original.address.city);  // 'LA' (changed!)

// Memory: Nested objects are shared
// original.address === shallow.address  // true (same reference)

// Deep clone - copies everything
const deep = JSON.parse(JSON.stringify(original));
// OR: structuredClone(original) (modern)

deep.address.city = 'Chicago';
console.log(original.address.city);  // 'LA' (unchanged)

// Memory: Complete copy, more memory used
// original.address !== deep.address  // false (different references)

// Comparison:
// Shallow Clone:
// - Less memory (shares nested objects)
// - Faster
// - Changes to nested objects affect original
// - Use when: Objects are shallow or won't be mutated

// Deep Clone:
// - More memory (duplicates everything)
// - Slower
// - Completely independent copy
// - Use when: Need independent copy, will mutate nested data

// Custom deep clone (handles circular refs)
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  
  // Handle circular references
  if (hash.has(obj)) return hash.get(obj);
  
  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], hash);
    }
  }
  
  return clone;
}
```

---

### Q10: How do you optimize memory in a large-scale application?

**Answer:**

```javascript
// 1. Lazy Loading - Load data when needed
class DataManager {
  constructor() {
    this._data = null;
  }
  
  getData() {
    if (!this._data) {
      this._data = this.loadData();  // Load on first access
    }
    return this._data;
  }
  
  cleanup() {
    this._data = null;  // Release when done
  }
}

// 2. Pagination - Don't load everything
async function loadUsers(page = 1, pageSize = 50) {
  const response = await fetch(`/api/users?page=${page}&size=${pageSize}`);
  return response.json();  // Only load current page
}

// 3. Virtual Scrolling - Render only visible items
class VirtualList {
  constructor(items, containerHeight, itemHeight) {
    this.items = items;
    this.containerHeight = containerHeight;
    this.itemHeight = itemHeight;
  }
  
  getVisibleItems(scrollTop) {
    const startIndex = Math.floor(scrollTop / this.itemHeight);
    const endIndex = Math.ceil((scrollTop + this.containerHeight) / this.itemHeight);
    
    return this.items.slice(startIndex, endIndex);
    // Only render visible items, not all 10,000
  }
}

// 4. Memoization - Cache expensive computations
const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);  // Return cached result
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const expensiveOperation = memoize((n) => {
  // Heavy computation
  return n * n;
});

// 5. Debouncing - Reduce function calls
function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Only call search after user stops typing
const search = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

// 6. Clear references
class Component {
  constructor() {
    this.data = new Array(1000000);
    this.timerId = setInterval(() => {}, 1000);
  }
  
  destroy() {
    this.data = null;  // Clear data
    clearInterval(this.timerId);  // Clear timer
  }
}

// 7. Use WeakMap for caching
const cache = new WeakMap();

function process(obj) {
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  const result = heavyComputation(obj);
  cache.set(obj, result);  // Auto-removed when obj is GC'd
  return result;
}

// 8. Batch DOM updates
const updates = [];

function scheduleUpdate(element, value) {
  updates.push({ element, value });
}

requestAnimationFrame(() => {
  updates.forEach(({ element, value }) => {
    element.textContent = value;  // Single reflow
  });
  updates.length = 0;
});
```

---

## 🎓 Key Takeaways

✅ JavaScript uses mark-and-sweep garbage collection  
✅ Common leaks: globals, timers, listeners, closures, detached DOM  
✅ WeakMap/WeakSet allow garbage collection of keys  
✅ Use object pooling for frequently created/destroyed objects  
✅ Typed Arrays are more memory-efficient for numeric data  
✅ Remove event listeners when components are destroyed  
✅ Use Chrome DevTools to profile and detect memory leaks  
✅ Closures capture entire scope (be careful with large data)  
✅ Lazy loading and pagination reduce memory usage  
✅ Always clean up: timers, listeners, references

---

## 📚 Practice Tips

1. Profile your application with Chrome DevTools heap snapshots
2. Identify memory leaks using the three-snapshot technique
3. Practice implementing object pools for games/animations
4. Use WeakMap for private data and caching
5. Monitor memory growth over time in long-running apps

---

**Next Topic:** ES2015-2024 Features (Modern JavaScript Features)
