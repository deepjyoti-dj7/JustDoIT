# Modules & Imports - Quick Summary & Interview Guide

## 📚 Quick Notes

### 1. ES6 Modules (ESM)

**Named Exports:**
```javascript
// math.js
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// Alternative syntax - export at end
function subtract(a, b) {
  return a - b;
}

function divide(a, b) {
  return a / b;
}

export { subtract, divide };

// Importing named exports
import { PI, add, multiply } from './math.js';

console.log(PI);        // 3.14159
console.log(add(2, 3)); // 5

// Import with alias
import { multiply as mult } from './math.js';

// Import everything as namespace
import * as math from './math.js';
console.log(math.PI);         // 3.14159
console.log(math.add(2, 3));  // 5
```

**Default Exports:**
```javascript
// user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

// Importing default export
import User from './user.js';

const john = new User('John');
console.log(john.greet());  // "Hello, I'm John"

// Default export with named exports
// config.js
export const API_URL = 'https://api.example.com';
export const TIMEOUT = 5000;

export default {
  apiUrl: API_URL,
  timeout: TIMEOUT,
  retries: 3
};

// Import both
import config, { API_URL, TIMEOUT } from './config.js';
```

**Re-exports:**
```javascript
// utils/index.js
export { add, subtract } from './math.js';
export { formatDate, formatTime } from './date.js';
export { validateEmail } from './validation.js';

// Re-export with rename
export { default as Logger } from './logger.js';

// Re-export everything
export * from './helpers.js';

// Re-export default as named
export { default as User } from './user.js';

// Usage
import { add, formatDate, validateEmail, Logger } from './utils/index.js';
```

---

### 2. CommonJS (Node.js)

**Module.exports:**
```javascript
// math.js
const PI = 3.14159;

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Export single value
module.exports = {
  PI,
  add,
  multiply
};

// Alternative: exports shorthand
exports.subtract = function(a, b) {
  return a - b;
};

// Importing with require
const math = require('./math.js');
console.log(math.PI);        // 3.14159
console.log(math.add(2, 3)); // 5

// Destructuring import
const { add, multiply } = require('./math.js');
```

**Default Export Pattern:**
```javascript
// user.js
class User {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

module.exports = User;

// Import
const User = require('./user.js');
const john = new User('John');
```

**Mixed Exports:**
```javascript
// logger.js
class Logger {
  log(message) {
    console.log(`[LOG] ${message}`);
  }
}

const instance = new Logger();

module.exports = instance;
module.exports.Logger = Logger;  // Also export class

// Usage
const logger = require('./logger.js');
logger.log('Hello');  // Use instance

const { Logger } = require('./logger.js');
const customLogger = new Logger();  // Create new instance
```

---

### 3. Dynamic Imports

**ES6 Dynamic Import:**
```javascript
// Conditional loading
async function loadModule() {
  if (condition) {
    const module = await import('./heavy-module.js');
    module.doSomething();
  }
}

// Lazy loading
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart-library.js');
  new Chart(data).render();
});

// Load based on environment
async function loadConfig() {
  const env = process.env.NODE_ENV;
  
  if (env === 'production') {
    return await import('./config.prod.js');
  } else {
    return await import('./config.dev.js');
  }
}

// Error handling
try {
  const module = await import('./module.js');
  module.init();
} catch (error) {
  console.error('Failed to load module:', error);
}
```

**CommonJS Dynamic Require:**
```javascript
// Conditional require
let config;
if (process.env.NODE_ENV === 'production') {
  config = require('./config.prod.js');
} else {
  config = require('./config.dev.js');
}

// Dynamic module loading
function loadPlugin(name) {
  try {
    return require(`./plugins/${name}.js`);
  } catch (error) {
    console.error(`Plugin ${name} not found`);
    return null;
  }
}

const plugin = loadPlugin('analytics');
```

---

### 4. Module Patterns

**Singleton Pattern:**
```javascript
// database.js
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    
    this.connection = null;
    Database.instance = this;
  }
  
  connect() {
    this.connection = 'Connected';
    return this;
  }
}

export default new Database();

// Usage - same instance everywhere
import db from './database.js';
db.connect();
```

**Factory Pattern:**
```javascript
// user-factory.js
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
}

class Admin extends User {
  constructor(name) {
    super(name, 'admin');
  }
}

class Guest extends User {
  constructor(name) {
    super(name, 'guest');
  }
}

export function createUser(name, isAdmin = false) {
  return isAdmin ? new Admin(name) : new Guest(name);
}

// Usage
import { createUser } from './user-factory.js';
const user = createUser('John', true);
```

**Revealing Module Pattern:**
```javascript
// counter.js
const Counter = (() => {
  let count = 0;  // Private variable
  
  function increment() {
    count++;
  }
  
  function decrement() {
    count--;
  }
  
  function getCount() {
    return count;
  }
  
  // Reveal public API
  return {
    increment,
    decrement,
    getCount
  };
})();

export default Counter;
```

---

### 5. Module Resolution

**Relative Imports:**
```javascript
// Same directory
import { helper } from './helper.js';

// Parent directory
import { utils } from '../utils.js';

// Nested directory
import { config } from './config/prod.js';
```

**Absolute Imports (with configuration):**
```javascript
// jsconfig.json or tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}

// Usage
import { Button } from '@components/Button.js';
import { formatDate } from '@utils/date.js';
```

**Node.js Module Resolution:**
```javascript
// Built-in modules
import fs from 'fs';
import path from 'path';

// node_modules
import express from 'express';
import lodash from 'lodash';

// Local modules
import { config } from './config.js';
```

---

### 6. Circular Dependencies

**Problem:**
```javascript
// a.js
import { b } from './b.js';

export const a = 'A';

console.log('A:', b);  // undefined (b not initialized yet)

// b.js
import { a } from './a.js';

export const b = 'B';

console.log('B:', a);  // undefined
```

**Solution 1: Restructure:**
```javascript
// shared.js
export const shared = {
  a: null,
  b: null
};

// a.js
import { shared } from './shared.js';

shared.a = 'A';

// b.js
import { shared } from './shared.js';

shared.b = 'B';
```

**Solution 2: Lazy Loading:**
```javascript
// a.js
export const a = 'A';

export function getB() {
  const { b } = require('./b.js');  // Lazy require
  return b;
}

// b.js
export const b = 'B';

export function getA() {
  const { a } = require('./a.js');
  return a;
}
```

---

### 7. Tree Shaking

**Optimized for Tree Shaking:**
```javascript
// utils.js - Named exports (good for tree shaking)
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

// Import only what you need
import { add } from './utils.js';  // Only 'add' bundled

// Bad for tree shaking
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b
};

import utils from './utils.js';  // Entire object bundled
utils.add(2, 3);
```

**Side Effects:**
```javascript
// package.json
{
  "name": "my-library",
  "sideEffects": false  // No side effects - safe to tree shake
}

// Or specify files with side effects
{
  "sideEffects": [
    "*.css",
    "./src/polyfills.js"
  ]
}

// Side effect in module
import './styles.css';  // Side effect - always included

export function myFunction() {
  return 'Hello';
}
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between ES6 modules and CommonJS?

**Answer:**

**ES6 Modules (ESM):**
```javascript
// Named exports
export const name = 'John';
export function greet() {
  return 'Hello';
}

// Default export
export default class User {}

// Import
import User, { name, greet } from './user.js';

// Static - resolved at compile time
// Cannot use conditionally
import module from './module.js';  // Always executes
```

**CommonJS:**
```javascript
// Exports
const name = 'John';
function greet() {
  return 'Hello';
}

module.exports = { name, greet };

// Import
const { name, greet } = require('./user.js');

// Dynamic - resolved at runtime
// Can use conditionally
if (condition) {
  const module = require('./module.js');  // Only if condition true
}
```

**Key Differences:**

| Feature | ES6 Modules | CommonJS |
|---------|-------------|----------|
| Syntax | `import/export` | `require/module.exports` |
| Loading | Static (compile-time) | Dynamic (runtime) |
| Async | Yes | No (synchronous) |
| Tree shaking | Yes | No |
| Browser support | Native | Needs bundler |
| Top-level await | Yes | No |
| `this` value | `undefined` | `exports` object |

```javascript
// ES6: Static imports (hoisted)
import { add } from './math.js';
console.log(add(2, 3));

// CommonJS: Dynamic imports (not hoisted)
const { add } = require('./math.js');
console.log(add(2, 3));

// ES6: Can't import conditionally (syntax error)
if (condition) {
  import { module } from './module.js';  // SyntaxError
}

// CommonJS: Can import conditionally
if (condition) {
  const module = require('./module.js');  // Works
}
```

---

### Q2: How do named exports differ from default exports?

**Answer:**

**Named Exports:**
```javascript
// Can have multiple named exports
// math.js
export const PI = 3.14;
export function add(a, b) {
  return a + b;
}
export function multiply(a, b) {
  return a * b;
}

// Import specific names (must match export names)
import { PI, add, multiply } from './math.js';

// Import with alias
import { add as sum } from './math.js';

// Import all as namespace
import * as math from './math.js';
math.add(2, 3);
```

**Default Exports:**
```javascript
// Only one default export per module
// user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// Import with any name
import User from './user.js';
import MyUser from './user.js';  // Same thing
import AnyName from './user.js';  // Still works

// Can combine default + named
// config.js
export const API_URL = 'https://api.com';
export default {
  url: API_URL,
  timeout: 5000
};

// Import both
import config, { API_URL } from './config.js';
```

**When to use:**
```javascript
// Named exports - multiple utilities
// utils.js
export function formatDate() {}
export function formatCurrency() {}
export function validateEmail() {}

import { formatDate, validateEmail } from './utils.js';

// Default export - single main export
// Button.js (React component)
export default function Button({ children }) {
  return <button>{children}</button>;
}

import Button from './Button.js';

// Mixed - main export + utilities
// logger.js
class Logger {}

export default Logger;
export const LOG_LEVELS = { ERROR: 0, WARN: 1, INFO: 2 };

import Logger, { LOG_LEVELS } from './logger.js';
```

---

### Q3: What are dynamic imports and when should you use them?

**Answer:**
Dynamic imports load modules at runtime using `import()` which returns a Promise.

**Basic Usage:**
```javascript
// Static import - always loaded
import { Chart } from './chart.js';

// Dynamic import - loaded on demand
async function showChart() {
  const { Chart } = await import('./chart.js');
  const chart = new Chart(data);
  chart.render();
}

// With then/catch
import('./module.js')
  .then(module => {
    module.init();
  })
  .catch(error => {
    console.error('Failed to load module:', error);
  });
```

**Use Cases:**

**1. Code Splitting:**
```javascript
// Load heavy module only when needed
button.addEventListener('click', async () => {
  const { VideoPlayer } = await import('./video-player.js');
  new VideoPlayer(videoUrl).play();
});
```

**2. Conditional Loading:**
```javascript
async function loadEditor() {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    const { MobileEditor } = await import('./mobile-editor.js');
    return new MobileEditor();
  } else {
    const { DesktopEditor } = await import('./desktop-editor.js');
    return new DesktopEditor();
  }
}
```

**3. Environment-Based:**
```javascript
async function getConfig() {
  const env = process.env.NODE_ENV;
  
  if (env === 'production') {
    return (await import('./config.prod.js')).default;
  } else {
    return (await import('./config.dev.js')).default;
  }
}
```

**4. Route-Based (React):**
```javascript
// React lazy loading
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home.js'));
const About = lazy(() => import('./pages/About.js'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

---

### Q4: How do you handle circular dependencies?

**Answer:**
Circular dependencies occur when module A imports module B, and B imports A.

**Problem:**
```javascript
// user.js
import { Post } from './post.js';

export class User {
  constructor(name) {
    this.name = name;
    this.posts = [];
  }
  
  createPost(content) {
    const post = new Post(content, this);  // Uses Post
    this.posts.push(post);
  }
}

// post.js
import { User } from './user.js';

export class Post {
  constructor(content, author) {
    this.content = content;
    this.author = author;  // Uses User
  }
  
  getAuthorName() {
    return this.author.name;
  }
}

// One of these will be undefined!
```

**Solution 1: Restructure to Remove Cycle:**
```javascript
// user.js
export class User {
  constructor(name) {
    this.name = name;
    this.posts = [];
  }
  
  addPost(post) {
    this.posts.push(post);
  }
}

// post.js
export class Post {
  constructor(content, author) {
    this.content = content;
    this.author = author;
  }
  
  getAuthorName() {
    return this.author.name;
  }
}

// main.js - orchestrates both
import { User } from './user.js';
import { Post } from './post.js';

const user = new User('John');
const post = new Post('Hello', user);
user.addPost(post);
```

**Solution 2: Lazy Import:**
```javascript
// user.js
export class User {
  constructor(name) {
    this.name = name;
    this.posts = [];
  }
  
  async createPost(content) {
    // Import only when needed
    const { Post } = await import('./post.js');
    const post = new Post(content, this);
    this.posts.push(post);
  }
}

// post.js - no circular dependency
export class Post {
  constructor(content, author) {
    this.content = content;
    this.author = author;
  }
}
```

**Solution 3: Dependency Injection:**
```javascript
// user.js
export class User {
  constructor(name, PostClass) {
    this.name = name;
    this.posts = [];
    this.PostClass = PostClass;
  }
  
  createPost(content) {
    const post = new this.PostClass(content, this);
    this.posts.push(post);
  }
}

// main.js
import { User } from './user.js';
import { Post } from './post.js';

const user = new User('John', Post);
```

---

### Q5: What is tree shaking and how does it work?

**Answer:**
Tree shaking removes unused code from the final bundle. It works with ES6 modules because they're statically analyzable.

**Optimized for Tree Shaking:**
```javascript
// utils.js - Use named exports
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

// main.js - Import only what you need
import { add } from './utils.js';

console.log(add(2, 3));

// Bundle only includes 'add', not 'subtract' or 'multiply'
```

**Not Optimized:**
```javascript
// utils.js - Default export of object
export default {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b
};

// main.js
import utils from './utils.js';

console.log(utils.add(2, 3));

// Bundle includes entire object (all functions)
```

**Pure Functions:**
```javascript
// Mark pure functions with /*#__PURE__*/
export const calculator = /*#__PURE__*/ createCalculator();

// Or in package.json
{
  "sideEffects": false  // No side effects in any module
}

// Or specify files with side effects
{
  "sideEffects": [
    "*.css",
    "./src/polyfills.js"
  ]
}
```

**Side Effects Prevent Tree Shaking:**
```javascript
// With side effect - always included
console.log('Module loaded');  // Side effect

export function unused() {
  return 'This is not tree-shaken because of console.log above';
}

// Without side effects - can be tree-shaken
export function add(a, b) {
  return a + b;
}

export function unused() {
  return 'This will be removed if not imported';
}
```

---

### Q6: How do you import JSON or other non-JavaScript files?

**Answer:**

**JSON Imports:**
```javascript
// ES6 Modules (with assertion)
import data from './data.json' assert { type: 'json' };

console.log(data.name);

// Node.js CommonJS
const data = require('./data.json');

// Dynamic import
const data = await import('./data.json', {
  assert: { type: 'json' }
});

// Fetch (browser)
const response = await fetch('./data.json');
const data = await response.json();
```

**CSS Imports:**
```javascript
// In JavaScript (with bundler)
import './styles.css';

// CSS Modules
import styles from './Button.module.css';

<div className={styles.button}>Click me</div>

// Dynamic CSS import
async function loadTheme(theme) {
  if (theme === 'dark') {
    await import('./dark-theme.css');
  } else {
    await import('./light-theme.css');
  }
}
```

**Images and Assets:**
```javascript
// With bundler (Webpack, Vite, etc.)
import logo from './logo.png';

<img src={logo} alt="Logo" />

// URL import
import logoUrl from './logo.png?url';

// Dynamic import
const { default: logo } = await import('./logo.png');
```

**WebAssembly:**
```javascript
// ES6 Module (with assertion)
import wasm from './module.wasm';

// Dynamic import
const wasmModule = await import('./module.wasm');

// WebAssembly.instantiateStreaming
const { instance } = await WebAssembly.instantiateStreaming(
  fetch('./module.wasm')
);

instance.exports.add(1, 2);
```

---

### Q7: What are barrel exports and when should you use them?

**Answer:**
Barrel exports re-export multiple modules from a single index file.

**Creating Barrel:**
```javascript
// components/Button.js
export default function Button() {}

// components/Input.js
export default function Input() {}

// components/Select.js
export default function Select() {}

// components/index.js (barrel)
export { default as Button } from './Button.js';
export { default as Input } from './Input.js';
export { default as Select } from './Select.js';

// Can also re-export all
export * from './utils.js';
```

**Usage:**
```javascript
// Without barrel - multiple imports
import Button from './components/Button.js';
import Input from './components/Input.js';
import Select from './components/Select.js';

// With barrel - single import
import { Button, Input, Select } from './components/index.js';

// Even shorter (if index.js)
import { Button, Input, Select } from './components';
```

**Benefits:**
- Cleaner imports
- Single entry point
- Easier refactoring
- Better organization

**Drawbacks:**
- Can hurt tree shaking
- Increases initial bundle size
- May import more than needed

**Best Practices:**
```javascript
// ✅ Good - Named re-exports (tree-shakeable)
export { Button } from './Button.js';
export { Input } from './Input.js';

// ❌ Bad - Import all then export (not tree-shakeable)
import * as components from './components.js';
export default components;

// ✅ Good - Selective barrel
// components/forms/index.js
export { Input } from './Input.js';
export { TextArea } from './TextArea.js';

// components/buttons/index.js
export { Button } from './Button.js';
export { IconButton } from './IconButton.js';
```

---

### Q8: How does module caching work?

**Answer:**
Modules are cached after first load - subsequent imports return the cached version.

**CommonJS Caching:**
```javascript
// counter.js
let count = 0;

module.exports = {
  increment() {
    count++;
  },
  getCount() {
    return count;
  }
};

// a.js
const counter = require('./counter.js');
counter.increment();
console.log(counter.getCount());  // 1

// b.js
const counter = require('./counter.js');  // Same cached instance
console.log(counter.getCount());  // 1 (not 0!)

// Cache location
console.log(require.cache);  // Object with all cached modules

// Clear cache (rarely needed)
delete require.cache[require.resolve('./counter.js')];
```

**ES6 Module Caching:**
```javascript
// counter.js
let count = 0;

export function increment() {
  count++;
}

export function getCount() {
  return count;
}

// a.js
import { increment, getCount } from './counter.js';
increment();
console.log(getCount());  // 1

// b.js
import { getCount } from './counter.js';  // Same cached module
console.log(getCount());  // 1

// ES6 modules are singletons by default
```

**Singleton Pattern:**
```javascript
// database.js
class Database {
  constructor() {
    this.connection = null;
  }
  
  connect() {
    if (!this.connection) {
      this.connection = 'Connected';
    }
    return this;
  }
}

// Export single instance
export default new Database();

// All imports get same instance
import db from './database.js';
db.connect();
```

---

### Q9: What is the difference between `require()` and `import()`?

**Answer:**

**`require()` - CommonJS (synchronous):**
```javascript
// Synchronous - blocks until loaded
const module = require('./module.js');

// Can be called anywhere
function loadModule() {
  const module = require('./module.js');
  return module;
}

// Conditional
if (condition) {
  const module = require('./conditional.js');
}

// Returns the exported value directly
const { add } = require('./math.js');

// Not hoisted
console.log(add(2, 3));
const { add } = require('./math.js');  // Can come after usage
```

**`import()` - Dynamic ES6 (asynchronous):**
```javascript
// Asynchronous - returns Promise
const module = await import('./module.js');

// Or with .then()
import('./module.js').then(module => {
  module.init();
});

// Can be called anywhere
async function loadModule() {
  const module = await import('./module.js');
  return module;
}

// Conditional
if (condition) {
  const module = await import('./conditional.js');
}

// Returns module object (need .default for default export)
const math = await import('./math.js');
math.add(2, 3);

// Or destructure
const { add } = await import('./math.js');
```

**Static `import` - ES6 (compile-time):**
```javascript
// Must be at top level
import { add } from './math.js';

// Hoisted
console.log(add(2, 3));  // Works
import { add } from './math.js';  // Hoisted to top

// Cannot be conditional (syntax error)
if (condition) {
  import { module } from './module.js';  // SyntaxError
}
```

**Comparison:**

| Feature | `require()` | `import()` | `import` |
|---------|------------|-----------|----------|
| Type | CommonJS | ES6 dynamic | ES6 static |
| Loading | Sync | Async | Compile-time |
| Returns | Value | Promise | Value |
| Hoisted | No | No | Yes |
| Top-level only | No | No | Yes |
| Conditional | Yes | Yes | No |

---

### Q10: How do you optimize module loading?

**Answer:**

**1. Code Splitting:**
```javascript
// Route-based splitting
const Home = lazy(() => import('./pages/Home.js'));
const About = lazy(() => import('./pages/About.js'));
const Contact = lazy(() => import('./pages/Contact.js'));

// Feature-based splitting
button.addEventListener('click', async () => {
  const { AdvancedFeature } = await import('./advanced-feature.js');
  new AdvancedFeature().init();
});
```

**2. Lazy Loading:**
```javascript
// Load on demand
async function showModal() {
  const { Modal } = await import('./Modal.js');
  const modal = new Modal();
  modal.show();
}

// Preload for better UX
link.addEventListener('mouseenter', () => {
  import('./next-page.js');  // Preload on hover
});
```

**3. Tree Shaking:**
```javascript
// Use named exports
export function used() {}
export function unused() {}  // Removed if not imported

// Import only what you need
import { used } from './utils.js';

// Avoid side effects
// package.json
{
  "sideEffects": false
}
```

**4. Module Bundling:**
```javascript
// Webpack configuration
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

**5. Preloading & Prefetching:**
```javascript
// Webpack magic comments
const Chart = () => import(
  /* webpackPrefetch: true */
  './Chart.js'
);

const HeavyComponent = () => import(
  /* webpackPreload: true */
  './HeavyComponent.js'
);

// HTML preload
<link rel="preload" href="./critical.js" as="script">
<link rel="prefetch" href="./future.js" as="script">
```

**6. Parallel Loading:**
```javascript
// Load multiple modules in parallel
const [moduleA, moduleB, moduleC] = await Promise.all([
  import('./moduleA.js'),
  import('./moduleB.js'),
  import('./moduleC.js')
]);

// Use all modules
moduleA.init();
moduleB.start();
moduleC.render();
```

---

## 🎓 Key Takeaways

✅ **ES6 modules** - Static, tree-shakeable, async-capable  
✅ **CommonJS** - Dynamic, synchronous, Node.js standard  
✅ **Named exports** - Multiple exports per module  
✅ **Default exports** - Single main export  
✅ **Dynamic imports** - Load modules on demand  
✅ **Tree shaking** - Remove unused code  
✅ **Barrel exports** - Single entry point for multiple modules  
✅ **Module caching** - Modules load once, cached thereafter  
✅ **Circular dependencies** - Avoid or handle carefully  
✅ **Code splitting** - Optimize bundle size and loading

---

## 📚 Practice Tips

1. Convert CommonJS modules to ES6 modules
2. Practice dynamic imports for code splitting
3. Set up barrel exports for better organization
4. Implement lazy loading for heavy components
5. Configure tree shaking in bundler
6. Understand module resolution algorithms
7. Handle circular dependencies properly

---

**Previous Topic:** Error Handling  
**Next Topic:** Regular Expressions
