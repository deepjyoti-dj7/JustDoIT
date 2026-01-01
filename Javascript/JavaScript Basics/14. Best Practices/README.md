# Best Practices - Quick Summary & Interview Guide

## 📋 Quick Notes

### 1. Code Quality

**Naming Conventions:**
```javascript
// ❌ Bad - unclear, inconsistent
const d = new Date();
const x = users.filter(u => u.a);
function calc(a, b) { return a + b; }

// ✅ Good - clear, descriptive
const currentDate = new Date();
const activeUsers = users.filter(user => user.isActive);
function calculateTotal(price, taxRate) {
  return price * (1 + taxRate);
}

// Constants - UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';

// Classes - PascalCase
class UserAccount {
  constructor(name) {
    this.name = name;
  }
}

// Private fields - # prefix
class User {
  #password = '';
  
  setPassword(pwd) {
    this.#password = pwd;
  }
}

// Boolean variables - is/has/can prefix
const isActive = true;
const hasPermission = user.role === 'admin';
const canDelete = hasPermission && isOwner;
```

**Single Responsibility:**
```javascript
// ❌ Bad - function does too much
function processUserData(user) {
  // Validate
  if (!user.email) throw new Error('Invalid email');
  
  // Transform
  user.email = user.email.toLowerCase();
  
  // Save to DB
  database.save(user);
  
  // Send email
  sendWelcomeEmail(user.email);
  
  // Log
  console.log('User processed:', user.id);
}

// ✅ Good - separate concerns
function validateUser(user) {
  if (!user.email) throw new Error('Invalid email');
  return true;
}

function normalizeEmail(email) {
  return email.toLowerCase();
}

function saveUser(user) {
  return database.save(user);
}

function processUser(user) {
  validateUser(user);
  user.email = normalizeEmail(user.email);
  saveUser(user);
  sendWelcomeEmail(user.email);
  logUserProcessed(user.id);
}
```

**DRY (Don't Repeat Yourself):**
```javascript
// ❌ Bad - repetitive code
function getUserFullName(user) {
  return user.firstName + ' ' + user.lastName;
}

function getEmployeeFullName(employee) {
  return employee.firstName + ' ' + employee.lastName;
}

function getCustomerFullName(customer) {
  return customer.firstName + ' ' + customer.lastName;
}

// ✅ Good - reusable function
function getFullName(person) {
  return `${person.firstName} ${person.lastName}`;
}

const userName = getFullName(user);
const employeeName = getFullName(employee);
const customerName = getFullName(customer);
```

---

### 2. Error Handling

**Try-Catch Properly:**
```javascript
// ❌ Bad - swallowing errors
try {
  riskyOperation();
} catch (error) {
  // Silent failure
}

// ❌ Bad - catching too broadly
try {
  const user = await fetchUser();
  const posts = await fetchPosts();
  const comments = await fetchComments();
} catch (error) {
  console.error(error);  // Which operation failed?
}

// ✅ Good - specific error handling
async function loadUserData(userId) {
  let user;
  try {
    user = await fetchUser(userId);
  } catch (error) {
    throw new Error(`Failed to fetch user ${userId}: ${error.message}`);
  }
  
  let posts;
  try {
    posts = await fetchPosts(user.id);
  } catch (error) {
    console.warn('Posts unavailable:', error);
    posts = [];  // Graceful degradation
  }
  
  return { user, posts };
}

// Custom errors
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

try {
  validateEmail('invalid');
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Validation failed on ${error.field}:`, error.message);
  } else {
    throw error;  // Re-throw unknown errors
  }
}
```

**Input Validation:**
```javascript
// ❌ Bad - no validation
function divide(a, b) {
  return a / b;
}

divide(10, 0);  // Infinity
divide('10', '2');  // '102' (string concatenation)

// ✅ Good - validate inputs
function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  
  if (b === 0) {
    throw new Error('Division by zero');
  }
  
  return a / b;
}

// Validate user input
function createUser(data) {
  const errors = {};
  
  if (!data.email || !data.email.includes('@')) {
    errors.email = 'Valid email required';
  }
  
  if (!data.password || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  if (Object.keys(errors).length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  
  return { email: data.email, password: hashPassword(data.password) };
}
```

---

### 3. Performance

**Avoid Unnecessary Computation:**
```javascript
// ❌ Bad - computing in loop
for (let i = 0; i < users.length; i++) {
  const user = users[i];
  user.fullName = user.firstName + ' ' + user.lastName;
}

// ✅ Good - compute once when needed
const usersWithFullNames = users.map(user => ({
  ...user,
  fullName: `${user.firstName} ${user.lastName}`
}));

// Memoization for expensive operations
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

const fibonacci = memoize((n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
```

**Debounce/Throttle:**
```javascript
// Debounce - wait for inactivity
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Search as user types
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Throttle - limit frequency
function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Scroll handler
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 200);

window.addEventListener('scroll', throttledScroll);
```

**Lazy Loading:**
```javascript
// Load resources when needed
class ImageGallery {
  constructor() {
    this.images = null;
  }
  
  async loadImages() {
    if (!this.images) {
      this.images = await fetch('/api/images').then(r => r.json());
    }
    return this.images;
  }
}

// Dynamic imports
async function loadFeature() {
  if (userHasPermission) {
    const module = await import('./advanced-feature.js');
    module.initialize();
  }
}
```

---

### 4. Security

**Sanitize User Input:**
```javascript
// ❌ Bad - XSS vulnerability
function displayMessage(message) {
  document.getElementById('output').innerHTML = message;
}

displayMessage(userInput);  // Could contain <script> tags!

// ✅ Good - use textContent or sanitize
function displayMessage(message) {
  document.getElementById('output').textContent = message;
}

// Or use DOMPurify library
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean;

// Escape HTML manually
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

**Avoid eval():**
```javascript
// ❌ Bad - dangerous
const userCode = getUserInput();
eval(userCode);  // Can execute arbitrary code!

// ✅ Good - use safer alternatives
// For JSON parsing
const data = JSON.parse(jsonString);

// For dynamic property access
const value = obj[propertyName];

// For calculations (with validation)
function safeCalculate(expression) {
  // Validate expression only contains numbers and operators
  if (!/^[\d\s\+\-\*\/\(\)\.]+$/.test(expression)) {
    throw new Error('Invalid expression');
  }
  return Function(`'use strict'; return (${expression})`)();
}
```

**Environment Variables:**
```javascript
// ❌ Bad - hardcoded secrets
const apiKey = 'sk-1234567890abcdef';
const dbPassword = 'mypassword123';

// ✅ Good - use environment variables
const apiKey = process.env.API_KEY;
const dbPassword = process.env.DB_PASSWORD;

// Client-side (prefixed with VITE_, REACT_APP_, etc.)
const apiUrl = import.meta.env.VITE_API_URL;

// Never expose secrets in client code
// ❌ Bad
const secretKey = process.env.SECRET_KEY;  // Exposed to browser!

// ✅ Good - keep secrets server-side only
```

---

### 5. Async Patterns

**Promise Best Practices:**
```javascript
// ❌ Bad - mixing callbacks and promises
function fetchData(callback) {
  return fetch('/api/data')
    .then(res => res.json())
    .then(data => callback(null, data))
    .catch(err => callback(err));
}

// ✅ Good - use promises consistently
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// Parallel execution when possible
// ❌ Bad - sequential when independent
async function loadData() {
  const users = await fetchUsers();      // 1 second
  const products = await fetchProducts(); // 1 second
  const orders = await fetchOrders();    // 1 second
  return { users, products, orders };    // Total: 3 seconds
}

// ✅ Good - parallel execution
async function loadData() {
  const [users, products, orders] = await Promise.all([
    fetchUsers(),
    fetchProducts(),
    fetchOrders()
  ]);
  return { users, products, orders };  // Total: 1 second
}
```

**Error Boundaries:**
```javascript
// Always handle promise rejections
// ❌ Bad - unhandled rejection
fetch('/api/data').then(res => res.json());

// ✅ Good - handle errors
fetch('/api/data')
  .then(res => res.json())
  .catch(err => console.error('Fetch failed:', err));

// With async/await
async function loadData() {
  try {
    const response = await fetch('/api/data');
    return await response.json();
  } catch (error) {
    console.error('Failed to load data:', error);
    return null;  // Fallback
  }
}
```

---

### 6. Code Organization

**Module Pattern:**
```javascript
// ❌ Bad - everything in global scope
var counter = 0;
function increment() {
  counter++;
}

// ✅ Good - encapsulated module
const CounterModule = (function() {
  let counter = 0;  // Private
  
  return {
    increment() {
      counter++;
    },
    
    getCount() {
      return counter;
    }
  };
})();

// ES6 modules
// counter.js
let counter = 0;

export function increment() {
  counter++;
}

export function getCount() {
  return counter;
}

// main.js
import { increment, getCount } from './counter.js';
```

**Composition Over Inheritance:**
```javascript
// ❌ Inheritance can be rigid
class Animal {
  eat() { console.log('Eating'); }
}

class Bird extends Animal {
  fly() { console.log('Flying'); }
}

class Penguin extends Bird {
  fly() { throw new Error("Penguins can't fly!"); }
}

// ✅ Composition is flexible
const canEat = (state) => ({
  eat() {
    console.log(`${state.name} is eating`);
  }
});

const canFly = (state) => ({
  fly() {
    console.log(`${state.name} is flying`);
  }
});

const createBird = (name) => {
  const state = { name };
  return Object.assign({}, canEat(state), canFly(state));
};

const createPenguin = (name) => {
  const state = { name };
  return Object.assign({}, canEat(state));  // No fly ability
};
```

---

### 7. Testing Considerations

**Pure Functions:**
```javascript
// ❌ Bad - impure (depends on external state)
let tax = 0.1;
function calculateTotal(price) {
  return price * (1 + tax);
}

// ✅ Good - pure (predictable, testable)
function calculateTotal(price, taxRate) {
  return price * (1 + taxRate);
}

// Pure functions are easier to test
test('calculateTotal', () => {
  expect(calculateTotal(100, 0.1)).toBe(110);
  expect(calculateTotal(50, 0.2)).toBe(60);
});
```

**Dependency Injection:**
```javascript
// ❌ Bad - hard to test
class UserService {
  constructor() {
    this.db = new Database();  // Tight coupling
  }
  
  async getUser(id) {
    return this.db.findUser(id);
  }
}

// ✅ Good - dependency injection
class UserService {
  constructor(database) {
    this.db = database;  // Injected dependency
  }
  
  async getUser(id) {
    return this.db.findUser(id);
  }
}

// Easy to test with mock
const mockDb = {
  findUser: jest.fn().mockResolvedValue({ id: 1, name: 'Test' })
};
const service = new UserService(mockDb);
```

---

### 8. Documentation

**JSDoc Comments:**
```javascript
/**
 * Calculates the total price including tax
 * @param {number} price - Base price
 * @param {number} taxRate - Tax rate (e.g., 0.1 for 10%)
 * @returns {number} Total price with tax
 * @throws {TypeError} If arguments are not numbers
 * @example
 * calculateTotal(100, 0.1); // Returns 110
 */
function calculateTotal(price, taxRate) {
  if (typeof price !== 'number' || typeof taxRate !== 'number') {
    throw new TypeError('Arguments must be numbers');
  }
  return price * (1 + taxRate);
}

/**
 * User class representing a system user
 * @class
 */
class User {
  /**
   * Create a user
   * @param {string} name - User's name
   * @param {string} email - User's email
   */
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}
```

**Meaningful Comments:**
```javascript
// ❌ Bad - stating the obvious
let count = 0;  // Initialize count to 0
count++;  // Increment count

// ✅ Good - explaining why, not what
// Reset count at midnight to start daily tracking
if (isNewDay()) {
  count = 0;
}

// Use binary search for performance on large sorted arrays
const index = binarySearch(sortedArray, target);

// Workaround for Safari bug #12345
if (isSafari) {
  // ...
}
```

---

## 🎯 Interview Questions & Answers

### Q1: What are the SOLID principles in JavaScript?

**Answer:**

**S - Single Responsibility Principle:**
```javascript
// ❌ Bad - multiple responsibilities
class UserManager {
  saveUser(user) { /* save to DB */ }
  sendEmail(user) { /* send email */ }
  generateReport(user) { /* create report */ }
}

// ✅ Good - single responsibility
class UserRepository {
  saveUser(user) { /* save to DB */ }
}

class EmailService {
  sendEmail(user) { /* send email */ }
}

class ReportGenerator {
  generateReport(user) { /* create report */ }
}
```

**O - Open/Closed Principle:**
```javascript
// Open for extension, closed for modification
class ShapeCalculator {
  calculateArea(shape) {
    return shape.area();  // Polymorphic
  }
}

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  
  area() {
    return this.width * this.height;
  }
}

class Circle {
  constructor(radius) {
    this.radius = radius;
  }
  
  area() {
    return Math.PI * this.radius ** 2;
  }
}

// Add new shapes without modifying ShapeCalculator
```

**L - Liskov Substitution Principle:**
```javascript
// Subtypes must be substitutable for base types
class Bird {
  fly() {
    return 'Flying';
  }
}

// ❌ Bad - violates LSP
class Penguin extends Bird {
  fly() {
    throw new Error("Can't fly");  // Breaks contract
  }
}

// ✅ Good - don't inherit if behavior differs fundamentally
class FlyingBird {
  fly() {
    return 'Flying';
  }
}

class Sparrow extends FlyingBird {}
class Penguin {}  // Separate hierarchy
```

**I - Interface Segregation:**
```javascript
// Clients shouldn't depend on interfaces they don't use

// ❌ Bad - fat interface
class Worker {
  work() {}
  eat() {}
  sleep() {}
}

class Robot extends Worker {
  work() { /* ... */ }
  eat() { throw new Error('Robots don't eat'); }
  sleep() { throw new Error('Robots don't sleep'); }
}

// ✅ Good - segregated interfaces
const Workable = {
  work() { /* ... */ }
};

const Eatable = {
  eat() { /* ... */ }
};

const human = Object.assign({}, Workable, Eatable);
const robot = Object.assign({}, Workable);
```

**D - Dependency Inversion:**
```javascript
// Depend on abstractions, not concretions

// ❌ Bad - depends on concrete implementation
class EmailNotification {
  send(message) {
    console.log('Email:', message);
  }
}

class UserService {
  constructor() {
    this.notification = new EmailNotification();
  }
  
  notify(message) {
    this.notification.send(message);
  }
}

// ✅ Good - depends on abstraction
class UserService {
  constructor(notificationService) {
    this.notification = notificationService;
  }
  
  notify(message) {
    this.notification.send(message);
  }
}

// Can inject any notification service
const emailService = new EmailNotification();
const smsService = new SMSNotification();
const userService = new UserService(emailService);
```

---

### Q2: How do you prevent memory leaks?

**Answer:**

```javascript
// 1. Remove event listeners
// ❌ Bad - listener persists
function setupButton() {
  const button = document.querySelector('#btn');
  button.addEventListener('click', () => {
    console.log('Clicked');
  });
}

// ✅ Good - clean up
class Component {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
    this.button = document.querySelector('#btn');
    this.button.addEventListener('click', this.handleClick);
  }
  
  handleClick() {
    console.log('Clicked');
  }
  
  destroy() {
    this.button.removeEventListener('click', this.handleClick);
  }
}

// 2. Clear timers
// ❌ Bad - timer runs forever
setInterval(() => {
  console.log('Tick');
}, 1000);

// ✅ Good - clear when done
const timerId = setInterval(() => {
  console.log('Tick');
}, 1000);

setTimeout(() => {
  clearInterval(timerId);
}, 10000);

// 3. Use WeakMap for private data
const privateData = new WeakMap();

class User {
  constructor(name) {
    privateData.set(this, { password: 'secret' });
    this.name = name;
  }
}

// When user is GC'd, privateData entry is auto-removed

// 4. Break circular references
// ❌ Bad
const obj1 = {};
const obj2 = {};
obj1.ref = obj2;
obj2.ref = obj1;

// ✅ Good - break references when done
obj1.ref = null;
obj2.ref = null;
```

---

### Q3: What are common security vulnerabilities and how to prevent them?

**Answer:**

**XSS (Cross-Site Scripting):**
```javascript
// ❌ Vulnerable
function displayComment(comment) {
  document.getElementById('comments').innerHTML = comment;
}
displayComment(userInput);  // Could contain <script>alert('XSS')</script>

// ✅ Safe - use textContent
function displayComment(comment) {
  document.getElementById('comments').textContent = comment;
}

// Or sanitize HTML
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean;
```

**Injection Attacks:**
```javascript
// ❌ SQL Injection vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;
// userId could be: "1 OR 1=1"

// ✅ Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// ❌ Command injection
exec(`convert ${userFileName} output.png`);

// ✅ Validate and sanitize
const safeFileName = path.basename(userFileName);
exec(`convert ${safeFileName} output.png`);
```

**CSRF (Cross-Site Request Forgery):**
```javascript
// Use CSRF tokens
app.post('/transfer', (req, res) => {
  // Verify CSRF token
  if (req.body.csrfToken !== req.session.csrfToken) {
    return res.status(403).send('Invalid token');
  }
  
  // Process request
  transferMoney(req.body.amount);
});
```

**Sensitive Data Exposure:**
```javascript
// ❌ Bad - exposing secrets
const config = {
  apiKey: 'sk-1234567890',
  dbPassword: 'password123'
};
res.json(config);  // Sent to client!

// ✅ Good - separate public/private config
const publicConfig = {
  apiUrl: process.env.API_URL,
  appName: 'MyApp'
};

const privateConfig = {
  apiKey: process.env.API_KEY,  // Server-side only
  dbPassword: process.env.DB_PASSWORD
};

res.json(publicConfig);  // Only public data
```

---

### Q4: How do you optimize JavaScript performance?

**Answer:**

```javascript
// 1. Minimize DOM manipulation
// ❌ Bad - multiple reflows
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  document.body.appendChild(div);  // Reflow each time
}

// ✅ Good - batch updates
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
document.body.appendChild(fragment);  // Single reflow

// 2. Debounce expensive operations
const expensiveSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

// 3. Use efficient loops
// ❌ Slower
const filtered = [];
array.forEach(item => {
  if (item.active) filtered.push(item);
});

// ✅ Faster
const filtered = array.filter(item => item.active);

// 4. Cache computed values
class User {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this._fullName = null;
  }
  
  get fullName() {
    if (!this._fullName) {
      this._fullName = `${this.firstName} ${this.lastName}`;
    }
    return this._fullName;
  }
}

// 5. Lazy load modules
async function loadFeature() {
  const module = await import('./heavy-feature.js');
  module.initialize();
}

// 6. Use Web Workers for heavy computation
const worker = new Worker('worker.js');
worker.postMessage({ data: largeArray });
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};
```

---

### Q5: What is the difference between functional and object-oriented programming in JavaScript?

**Answer:**

**Object-Oriented (OOP):**
```javascript
class ShoppingCart {
  constructor() {
    this.items = [];
  }
  
  addItem(item) {
    this.items.push(item);
  }
  
  getTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }
  
  checkout() {
    const total = this.getTotal();
    this.items = [];
    return total;
  }
}

const cart = new ShoppingCart();
cart.addItem({ name: 'Book', price: 10 });
cart.getTotal();  // 10
```

**Functional (FP):**
```javascript
// Pure functions, immutable data
const addItem = (cart, item) => {
  return {
    ...cart,
    items: [...cart.items, item]
  };
};

const getTotal = (cart) => {
  return cart.items.reduce((sum, item) => sum + item.price, 0);
};

const checkout = (cart) => {
  const total = getTotal(cart);
  return {
    total,
    cart: { ...cart, items: [] }
  };
};

let cart = { items: [] };
cart = addItem(cart, { name: 'Book', price: 10 });
getTotal(cart);  // 10
```

**Comparison:**

| Feature | OOP | FP |
|---------|-----|-----|
| **State** | Encapsulated, mutable | Immutable |
| **Data** | Objects with methods | Separate from functions |
| **Reusability** | Inheritance | Composition |
| **Side effects** | Methods can modify state | Pure functions avoid |
| **Testing** | Mock objects | Test pure functions easily |

**Hybrid Approach (common in JS):**
```javascript
// Use both paradigms where appropriate
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  // Functional method (pure)
  withUpdatedEmail(newEmail) {
    return new User(this.name, newEmail);
  }
}

// Pure utility functions
const validateEmail = (email) => email.includes('@');
const normalizeEmail = (email) => email.toLowerCase().trim();
```

---

### Q6: How do you handle async errors properly?

**Answer:**

```javascript
// 1. Try-catch with async/await
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;  // Re-throw or return fallback
  }
}

// 2. Promise.catch()
fetchUser(1)
  .then(user => console.log(user))
  .catch(error => console.error('Error:', error));

// 3. Global error handlers
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Log to error tracking service
  errorTracker.log(event.reason);
});

// 4. Error boundaries for React-like frameworks
class ErrorBoundary {
  static async handle(promise) {
    try {
      return [null, await promise];
    } catch (error) {
      return [error, null];
    }
  }
}

// Usage
const [error, data] = await ErrorBoundary.handle(fetchUser(1));
if (error) {
  // Handle error
} else {
  // Use data
}

// 5. Retry logic
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (i === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** i));
    }
  }
}
```

---

### Q7: What are code smells and how do you refactor them?

**Answer:**

**Long Function:**
```javascript
// ❌ Code smell
function processOrder(order) {
  // Validate (20 lines)
  // Calculate totals (15 lines)
  // Apply discounts (25 lines)
  // Save to database (10 lines)
  // Send emails (15 lines)
}

// ✅ Refactored
function processOrder(order) {
  validateOrder(order);
  const total = calculateTotal(order);
  const finalTotal = applyDiscounts(total, order.customer);
  saveOrder(order, finalTotal);
  sendOrderConfirmation(order);
}
```

**Duplicate Code:**
```javascript
// ❌ Code smell
function calculateEmployeeSalary(employee) {
  return employee.baseSalary + employee.baseSalary * 0.1;
}

function calculateContractorPay(contractor) {
  return contractor.basePay + contractor.basePay * 0.1;
}

// ✅ Refactored
function calculatePay(person, bonusRate = 0.1) {
  return person.basePay * (1 + bonusRate);
}
```

**Magic Numbers:**
```javascript
// ❌ Code smell
if (user.age >= 18 && user.age <= 65) {
  // ...
}

// ✅ Refactored
const MIN_WORKING_AGE = 18;
const MAX_WORKING_AGE = 65;

if (user.age >= MIN_WORKING_AGE && user.age <= MAX_WORKING_AGE) {
  // ...
}
```

---

### Q8: How do you write testable code?

**Answer:**

```javascript
// 1. Pure functions (no side effects)
// ❌ Hard to test
let total = 0;
function addToTotal(amount) {
  total += amount;  // Modifies external state
}

// ✅ Easy to test
function add(a, b) {
  return a + b;  // Pure, predictable
}

// 2. Dependency injection
// ❌ Hard to test
class UserService {
  getUser(id) {
    return fetch(`/api/users/${id}`);  // Hard-coded dependency
  }
}

// ✅ Easy to test
class UserService {
  constructor(httpClient) {
    this.http = httpClient;
  }
  
  getUser(id) {
    return this.http.get(`/api/users/${id}`);
  }
}

// Test with mock
const mockHttp = { get: jest.fn().mockResolvedValue({ id: 1 }) };
const service = new UserService(mockHttp);

// 3. Small, focused functions
// ❌ Hard to test
function processUserDataAndSendEmail(user) {
  // Validation, transformation, DB save, email sending
}

// ✅ Easy to test
function validateUser(user) { /* ... */ }
function normalizeUser(user) { /* ... */ }
function saveUser(user) { /* ... */ }
function sendWelcomeEmail(user) { /* ... */ }

// 4. Avoid global state
// ❌ Hard to test
const config = { apiUrl: 'https://api.com' };

function fetchData() {
  return fetch(config.apiUrl);
}

// ✅ Easy to test
function fetchData(apiUrl) {
  return fetch(apiUrl);
}
```

---

### Q9: What are design patterns you commonly use in JavaScript?

**Answer:**

**1. Module Pattern:**
```javascript
const Calculator = (function() {
  // Private
  let result = 0;
  
  // Public API
  return {
    add(n) {
      result += n;
      return this;
    },
    
    subtract(n) {
      result -= n;
      return this;
    },
    
    getResult() {
      return result;
    }
  };
})();

Calculator.add(5).subtract(2).getResult();  // 3
```

**2. Singleton:**
```javascript
const Database = (function() {
  let instance;
  
  function createInstance() {
    return {
      connect() { /* ... */ },
      query() { /* ... */ }
    };
  }
  
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2);  // true
```

**3. Observer:**
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    const callbacks = this.events[event];
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

const emitter = new EventEmitter();
emitter.on('data', (data) => console.log('Received:', data));
emitter.emit('data', { value: 42 });
```

**4. Factory:**
```javascript
class UserFactory {
  createUser(type) {
    switch(type) {
      case 'admin':
        return new AdminUser();
      case 'guest':
        return new GuestUser();
      default:
        return new RegularUser();
    }
  }
}
```

---

### Q10: How do you approach refactoring legacy code?

**Answer:**

```javascript
// 1. Add tests first (if none exist)
// 2. Make small, incremental changes
// 3. Refactor one thing at a time

// Before refactoring
function calc(a, b, op) {
  if (op == 'add') {
    return a + b;
  } else if (op == 'sub') {
    return a - b;
  } else if (op == 'mul') {
    return a * b;
  }
}

// Step 1: Add tests
test('calc adds', () => {
  expect(calc(2, 3, 'add')).toBe(5);
});

// Step 2: Extract functions
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }

// Step 3: Use lookup table
const operations = {
  add,
  subtract,
  multiply
};

function calculate(a, b, operation) {
  const fn = operations[operation];
  if (!fn) {
    throw new Error(`Unknown operation: ${operation}`);
  }
  return fn(a, b);
}

// Step 4: Run tests - all pass!

// Strategies:
// - Boy Scout Rule: Leave code better than you found it
// - Strangler Fig: Gradually replace old code
// - Feature flags: Deploy new code alongside old
// - Code coverage: Ensure tests before refactoring
```

---

## 🎓 Key Takeaways

✅ Write clean, readable code with descriptive names  
✅ Follow SOLID principles for maintainable code  
✅ Always validate and sanitize user input  
✅ Handle errors explicitly, don't swallow them  
✅ Optimize performance: debounce, memoize, lazy load  
✅ Prevent XSS, injection attacks, and other vulnerabilities  
✅ Write testable code: pure functions, dependency injection  
✅ Use design patterns appropriately  
✅ Document complex logic with meaningful comments  
✅ Refactor incrementally with tests

---

## 📚 Practice Tips

1. Review and refactor your old code regularly
2. Use linters (ESLint) and formatters (Prettier)
3. Write unit tests for critical functions
4. Practice code reviews with peers
5. Learn from open-source projects

---

**Next Topic:** Interview Questions (Common JavaScript Interview Questions)
