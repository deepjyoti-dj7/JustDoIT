# Error Handling - Quick Summary & Interview Guide

## 📚 Quick Notes

### 1. Error Types

**Built-in Error Types:**
```javascript
// Error - Base error type
throw new Error('Something went wrong');

// SyntaxError - Invalid syntax
eval('function {');  // SyntaxError

// ReferenceError - Invalid reference
console.log(undefinedVar);  // ReferenceError

// TypeError - Invalid type operation
null.toString();  // TypeError

// RangeError - Value out of range
const arr = new Array(-1);  // RangeError

// URIError - Invalid URI handling
decodeURIComponent('%');  // URIError

// EvalError - Error in eval() (rarely used)
```

**Error Properties:**
```javascript
try {
  throw new Error('Custom error message');
} catch (error) {
  console.log(error.name);     // "Error"
  console.log(error.message);  // "Custom error message"
  console.log(error.stack);    // Stack trace
}
```

---

### 2. Try-Catch-Finally

**Basic Try-Catch:**
```javascript
try {
  // Code that might throw an error
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  // Handle the error
  console.error('Operation failed:', error.message);
}

// Multiple operations
try {
  const data = JSON.parse('{"name": "John"}');
  console.log(data.name);  // "John"
  
  const invalid = JSON.parse('invalid json');  // Throws error
  console.log('This never runs');
} catch (error) {
  console.error('JSON parsing failed:', error.message);
}
```

**Finally Block:**
```javascript
// Finally always executes
function fetchData() {
  let connection = null;
  
  try {
    connection = openConnection();
    return getData(connection);
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return null;
  } finally {
    // Always runs, even with return in try/catch
    if (connection) {
      connection.close();
      console.log('Connection closed');
    }
  }
}

// Finally runs before return
function example() {
  try {
    return 'try block';
  } finally {
    console.log('Finally runs first');
  }
}

console.log(example());
// Output:
// Finally runs first
// try block
```

**Nested Try-Catch:**
```javascript
try {
  try {
    throw new Error('Inner error');
  } catch (innerError) {
    console.log('Inner catch:', innerError.message);
    throw new Error('Outer error');  // Re-throw
  }
} catch (outerError) {
  console.log('Outer catch:', outerError.message);
}

// Output:
// Inner catch: Inner error
// Outer catch: Outer error
```

---

### 3. Custom Errors

**Creating Custom Errors:**
```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NetworkError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

// Usage
function validateAge(age) {
  if (typeof age !== 'number') {
    throw new ValidationError('Age must be a number');
  }
  
  if (age < 0 || age > 150) {
    throw new ValidationError('Age must be between 0 and 150');
  }
  
  return true;
}

try {
  validateAge('25');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed:', error.message);
  } else {
    console.log('Unknown error:', error);
  }
}
```

**Enhanced Custom Errors:**
```javascript
class DatabaseError extends Error {
  constructor(message, query, code) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
    this.code = code;
    this.timestamp = new Date();
  }
  
  toString() {
    return `${this.name} [${this.code}]: ${this.message} at ${this.timestamp}`;
  }
}

// Usage
try {
  throw new DatabaseError(
    'Connection failed',
    'SELECT * FROM users',
    'CONN_TIMEOUT'
  );
} catch (error) {
  console.log(error.toString());
  console.log('Query:', error.query);
  console.log('Code:', error.code);
}
```

---

### 4. Error Handling Patterns

**Guard Clauses:**
```javascript
function processUser(user) {
  if (!user) {
    throw new Error('User is required');
  }
  
  if (!user.name) {
    throw new ValidationError('User name is required');
  }
  
  if (!user.email) {
    throw new ValidationError('User email is required');
  }
  
  // Process valid user
  return {
    name: user.name.trim(),
    email: user.email.toLowerCase()
  };
}
```

**Error Wrapper:**
```javascript
function tryCatch(fn) {
  try {
    return [null, fn()];
  } catch (error) {
    return [error, null];
  }
}

// Usage
const [error, data] = tryCatch(() => JSON.parse('{"name": "John"}'));

if (error) {
  console.error('Parsing failed:', error);
} else {
  console.log(data.name);
}
```

**Safe Function Execution:**
```javascript
function safely(fn, fallback) {
  try {
    return fn();
  } catch (error) {
    console.error('Error caught:', error.message);
    return fallback;
  }
}

// Usage
const data = safely(
  () => JSON.parse(userInput),
  { name: 'Default' }
);
```

---

### 5. Async Error Handling

**Async/Await with Try-Catch:**
```javascript
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      throw new NetworkError(
        'Failed to fetch user',
        response.status
      );
    }
    
    const user = await response.json();
    return user;
  } catch (error) {
    if (error instanceof NetworkError) {
      console.error('Network error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    
    throw error;  // Re-throw or return default
  }
}
```

**Promise Error Handling:**
```javascript
fetch('/api/data')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Request failed:', error.message);
  })
  .finally(() => {
    console.log('Request completed');
  });
```

**Multiple Async Operations:**
```javascript
async function processData() {
  try {
    const user = await fetchUser(1);
    const orders = await fetchOrders(user.id);
    const details = await fetchDetails(orders[0].id);
    
    return { user, orders, details };
  } catch (error) {
    // Catches error from any await
    console.error('Processing failed:', error);
    return null;
  }
}
```

---

### 6. Error Boundaries (React)

**Class Component Error Boundary:**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error);
    console.error('Error info:', errorInfo);
    // Log to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error.message}</p>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

### 7. Defensive Programming

**Input Validation:**
```javascript
function divide(a, b) {
  // Validate inputs
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both arguments must be numbers');
  }
  
  if (b === 0) {
    throw new RangeError('Cannot divide by zero');
  }
  
  if (!isFinite(a) || !isFinite(b)) {
    throw new RangeError('Arguments must be finite numbers');
  }
  
  return a / b;
}

// Safe usage
try {
  const result = divide(10, 2);
  console.log(result);  // 5
  
  divide(10, 0);  // Throws RangeError
} catch (error) {
  console.error(error.message);
}
```

**Null Checks:**
```javascript
function getUserName(user) {
  // Optional chaining
  return user?.profile?.name ?? 'Anonymous';
}

// Traditional null checks
function getAddress(user) {
  if (!user || !user.address || !user.address.street) {
    return 'No address';
  }
  
  return user.address.street;
}
```

**Default Values:**
```javascript
function createUser(options = {}) {
  const {
    name = 'Anonymous',
    age = 0,
    role = 'user'
  } = options;
  
  return { name, age, role };
}

console.log(createUser());  // { name: 'Anonymous', age: 0, role: 'user' }
console.log(createUser({ name: 'John' }));  // { name: 'John', age: 0, role: 'user' }
```

---

### 8. Error Logging

**Console Methods:**
```javascript
console.error('Error:', error);        // Red error message
console.warn('Warning:', warning);     // Yellow warning
console.info('Info:', information);    // Blue info
console.debug('Debug:', debugInfo);    // Debug level

// Styled console
console.log('%c Error!', 'color: red; font-size: 20px');

// Group logging
console.group('User Errors');
console.error('Name is required');
console.error('Email is invalid');
console.groupEnd();
```

**Custom Logger:**
```javascript
class Logger {
  constructor(context) {
    this.context = context;
  }
  
  log(level, message, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      data
    };
    
    console.log(JSON.stringify(logEntry));
    
    // Send to logging service
    this.sendToServer(logEntry);
  }
  
  error(message, data) {
    this.log('ERROR', message, data);
  }
  
  warn(message, data) {
    this.log('WARN', message, data);
  }
  
  info(message, data) {
    this.log('INFO', message, data);
  }
  
  sendToServer(logEntry) {
    // Send to logging service (e.g., Sentry, LogRocket)
  }
}

// Usage
const logger = new Logger('UserService');
logger.error('Failed to fetch user', { userId: 123 });
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between throw and return?

**Answer:**
`throw` stops execution and jumps to the nearest catch block, while `return` exits the function normally.

```javascript
// Using return
function checkAgeReturn(age) {
  if (age < 0) {
    return null;  // Caller must check for null
  }
  return age;
}

const result = checkAgeReturn(-5);
if (result === null) {
  console.log('Invalid age');
}

// Using throw
function checkAgeThrow(age) {
  if (age < 0) {
    throw new Error('Age cannot be negative');  // Stops execution
  }
  return age;
}

try {
  const result = checkAgeThrow(-5);
  console.log('Valid age:', result);  // Never reached
} catch (error) {
  console.error('Error:', error.message);  // "Age cannot be negative"
}

// Key differences:
// 1. Control flow: throw exits immediately, return continues
// 2. Error handling: throw requires try-catch, return needs null checks
// 3. Clarity: throw makes errors explicit
```

**When to use each:**
```javascript
// Use return for expected cases
function findUser(id) {
  const user = database.find(id);
  if (!user) {
    return null;  // Expected: user might not exist
  }
  return user;
}

// Use throw for unexpected/exceptional cases
function validatePassword(password) {
  if (password.length < 8) {
    throw new Error('Password too short');  // Validation error
  }
  return true;
}
```

---

### Q2: How do you handle errors in async/await?

**Answer:**
Use try-catch blocks or .catch() on the Promise.

**Try-Catch Method:**
```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error.message);
    return null;  // Return fallback or re-throw
  }
}

// Multiple async operations
async function loadUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    const comments = await fetchComments(posts[0].id);
    
    return { user, posts, comments };
  } catch (error) {
    // Catches error from any await
    console.error('Failed to load data:', error);
    throw error;
  }
}
```

**Promise .catch() Method:**
```javascript
async function fetchWithCatch() {
  const data = await fetch('/api/data')
    .then(res => res.json())
    .catch(error => {
      console.error('Request failed:', error);
      return { default: true };  // Fallback
    });
  
  return data;
}
```

**Wrapper Function:**
```javascript
async function to(promise) {
  return promise
    .then(data => [null, data])
    .catch(error => [error, null]);
}

async function example() {
  const [error, user] = await to(fetchUser(1));
  
  if (error) {
    console.error('Failed:', error);
    return;
  }
  
  console.log('Success:', user);
}
```

---

### Q3: What happens if you don't catch a rejected Promise?

**Answer:**
Unhandled Promise rejections trigger warnings and can crash Node.js applications.

```javascript
// Unhandled rejection (BAD)
async function throwError() {
  throw new Error('Oops');
}

throwError();  // UnhandledPromiseRejectionWarning

// Browser: Warning in console
// Node.js: Process may terminate (future versions)

// Proper handling (GOOD)
throwError().catch(error => {
  console.error('Caught:', error);
});

// Or with async/await
async function main() {
  try {
    await throwError();
  } catch (error) {
    console.error('Caught:', error);
  }
}

// Global handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Log to error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  event.preventDefault();  // Prevent default handling
});
```

**Common mistakes:**
```javascript
// Mistake 1: Forgetting await
async function bad1() {
  fetchUser(1);  // Returns unhandled Promise!
}

// Fix:
async function good1() {
  try {
    await fetchUser(1);
  } catch (error) {
    console.error(error);
  }
}

// Mistake 2: forEach with async
async function bad2() {
  [1, 2, 3].forEach(async (id) => {
    await fetchUser(id);  // Unhandled if throws
  });
}

// Fix:
async function good2() {
  for (const id of [1, 2, 3]) {
    try {
      await fetchUser(id);
    } catch (error) {
      console.error(error);
    }
  }
}
```

---

### Q4: How do you create custom error classes?

**Answer:**
Extend the built-in Error class and set the name property.

```javascript
// Basic custom error
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Enhanced custom error with metadata
class APIError extends Error {
  constructor(message, statusCode, endpoint) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.timestamp = new Date();
  }
}

// Usage
function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }
  return true;
}

async function callAPI(endpoint) {
  const response = await fetch(endpoint);
  
  if (!response.ok) {
    throw new APIError(
      'API request failed',
      response.status,
      endpoint
    );
  }
  
  return response.json();
}

// Handling custom errors
try {
  validateEmail('invalid');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed:', error.message);
  } else {
    console.log('Unknown error:', error);
  }
}

try {
  await callAPI('/api/users');
} catch (error) {
  if (error instanceof APIError) {
    console.log(`API Error [${error.statusCode}]: ${error.message}`);
    console.log(`Endpoint: ${error.endpoint}`);
    console.log(`Time: ${error.timestamp}`);
  }
}
```

**Error hierarchy:**
```javascript
class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ApplicationError';
  }
}

class DatabaseError extends ApplicationError {
  constructor(message, query) {
    super(message);
    this.name = 'DatabaseError';
    this.query = query;
  }
}

class NetworkError extends ApplicationError {
  constructor(message, url) {
    super(message);
    this.name = 'NetworkError';
    this.url = url;
  }
}

// Catch hierarchy
try {
  // operations
} catch (error) {
  if (error instanceof DatabaseError) {
    console.log('Database issue:', error.query);
  } else if (error instanceof NetworkError) {
    console.log('Network issue:', error.url);
  } else if (error instanceof ApplicationError) {
    console.log('App error:', error.message);
  } else {
    console.log('Unknown error:', error);
  }
}
```

---

### Q5: What's the purpose of finally blocks?

**Answer:**
`finally` executes cleanup code regardless of whether an error occurred, even with return statements.

```javascript
// Resource cleanup
function processFile(filename) {
  let file = null;
  
  try {
    file = openFile(filename);
    const data = readFile(file);
    return processData(data);
  } catch (error) {
    console.error('Processing failed:', error);
    return null;
  } finally {
    // Always executes, even with return above
    if (file) {
      file.close();
      console.log('File closed');
    }
  }
}

// Finally with Promise
async function fetchWithCleanup() {
  let loading = true;
  
  try {
    const data = await fetch('/api/data').then(r => r.json());
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    loading = false;  // Always runs
    console.log('Loading finished');
  }
}

// Execution order
function executionOrder() {
  try {
    console.log('1: Try');
    return 'try value';
  } catch (error) {
    console.log('2: Catch');
    return 'catch value';
  } finally {
    console.log('3: Finally');
    // Return here overrides try/catch return!
  }
}

console.log(executionOrder());
// Output:
// 1: Try
// 3: Finally
// try value

// Finally with exception
function finallyWithException() {
  try {
    throw new Error('Error in try');
  } finally {
    console.log('Finally still runs');
    // Even though exception is thrown
  }
}

try {
  finallyWithException();
} catch (error) {
  console.log('Caught:', error.message);
}
// Output:
// Finally still runs
// Caught: Error in try
```

**Common use cases:**
```javascript
// Database connection
async function queryDatabase(sql) {
  const connection = await db.connect();
  
  try {
    const result = await connection.query(sql);
    return result;
  } finally {
    await connection.close();  // Always close
  }
}

// Timer cleanup
function measurePerformance(fn) {
  const start = performance.now();
  
  try {
    return fn();
  } finally {
    const end = performance.now();
    console.log(`Execution time: ${end - start}ms`);
  }
}

// Lock release
async function criticalSection() {
  await lock.acquire();
  
  try {
    // Critical code
    await processData();
  } finally {
    lock.release();  // Always release
  }
}
```

---

### Q6: How do you handle multiple async errors?

**Answer:**
Use Promise.allSettled() to handle all results, or try-catch with Promise.all() for fail-fast behavior.

**Promise.all() - Fails fast:**
```javascript
async function fetchAllFast() {
  try {
    const [users, posts, comments] = await Promise.all([
      fetch('/api/users').then(r => r.json()),
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/comments').then(r => r.json())
    ]);
    
    return { users, posts, comments };
  } catch (error) {
    // First error stops everything
    console.error('One or more requests failed:', error);
    throw error;
  }
}
```

**Promise.allSettled() - All complete:**
```javascript
async function fetchAllSafe() {
  const results = await Promise.allSettled([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ]);
  
  const data = {};
  const errors = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const keys = ['users', 'posts', 'comments'];
      data[keys[index]] = result.value;
    } else {
      errors.push(result.reason);
    }
  });
  
  if (errors.length > 0) {
    console.warn('Some requests failed:', errors);
  }
  
  return data;
}
```

**Individual try-catch:**
```javascript
async function fetchIndividually() {
  let users, posts, comments;
  
  try {
    users = await fetch('/api/users').then(r => r.json());
  } catch (error) {
    console.error('Users failed:', error);
    users = [];
  }
  
  try {
    posts = await fetch('/api/posts').then(r => r.json());
  } catch (error) {
    console.error('Posts failed:', error);
    posts = [];
  }
  
  try {
    comments = await fetch('/api/comments').then(r => r.json());
  } catch (error) {
    console.error('Comments failed:', error);
    comments = [];
  }
  
  return { users, posts, comments };
}
```

---

### Q7: What are error boundaries in JavaScript frameworks?

**Answer:**
Error boundaries catch errors during rendering and provide fallback UI (React concept).

**React Error Boundary:**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  static getDerivedStateFromError(error) {
    // Update state for fallback UI
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error to service
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // Send to error reporting
    logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <details>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <UserProfile />
      <Posts />
    </ErrorBoundary>
  );
}
```

**Vanilla JavaScript equivalent:**
```javascript
class ComponentErrorHandler {
  constructor(component, fallback) {
    this.component = component;
    this.fallback = fallback;
  }
  
  render(container) {
    try {
      const result = this.component.render();
      container.innerHTML = result;
    } catch (error) {
      console.error('Render error:', error);
      container.innerHTML = this.fallback(error);
    }
  }
}

// Usage
const handler = new ComponentErrorHandler(
  {
    render() {
      throw new Error('Component failed');
    }
  },
  (error) => `<div>Error: ${error.message}</div>`
);

handler.render(document.getElementById('app'));
```

---

### Q8: How do you implement retry logic for failed operations?

**Answer:**
Implement exponential backoff with configurable retry attempts.

```javascript
async function retry(fn, options = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 2,
    onRetry = () => {}
  } = options;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;  // Give up
      }
      
      const waitTime = delay * Math.pow(backoff, attempt - 1);
      onRetry(attempt, error, waitTime);
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Usage
try {
  const data = await retry(
    () => fetch('/api/data').then(r => r.json()),
    {
      maxAttempts: 3,
      delay: 1000,
      backoff: 2,
      onRetry: (attempt, error, wait) => {
        console.log(`Attempt ${attempt} failed: ${error.message}`);
        console.log(`Retrying in ${wait}ms...`);
      }
    }
  );
  
  console.log('Success:', data);
} catch (error) {
  console.error('All retries failed:', error);
}

// Conditional retry (only for specific errors)
async function retryOnNetworkError(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isNetworkError = error.name === 'NetworkError' ||
                             error.message.includes('fetch');
      
      if (!isNetworkError || attempt === maxAttempts) {
        throw error;
      }
      
      console.log(`Network error, retrying (${attempt}/${maxAttempts})...`);
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
}
```

---

### Q9: What's the difference between operational and programmer errors?

**Answer:**
**Operational errors** are runtime issues (network failures, invalid input), while **programmer errors** are bugs (null reference, undefined function).

**Operational Errors (Handle):**
```javascript
// These are expected and should be handled
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      // Operational error: API returned error
      throw new Error(`User not found: ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    // Handle gracefully
    console.error('Failed to fetch user:', error);
    return null;  // Fallback
  }
}

// Invalid input - operational error
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');  // Expected, handle it
  }
  return a / b;
}
```

**Programmer Errors (Fix the code):**
```javascript
// These indicate bugs - DON'T catch, FIX them
function calculateTotal(items) {
  // Bug: assuming items is always an array
  return items.reduce((sum, item) => sum + item.price, 0);
  // If items is null/undefined → TypeError
}

// Fix by validating
function calculateTotalFixed(items) {
  if (!Array.isArray(items)) {
    throw new TypeError('items must be an array');  // Fail fast
  }
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Bug: typo in property name
const user = { name: 'John' };
console.log(user.naem);  // undefined (programmer error)
```

**How to handle:**
```javascript
// Operational errors: Handle gracefully
try {
  const user = await fetchUser(999);
  if (!user) {
    showError('User not found');  // Show UI message
  }
} catch (error) {
  logError(error);  // Log but continue
}

// Programmer errors: Fail fast and fix
function processOrder(order) {
  // Validate assumptions
  if (!order || typeof order !== 'object') {
    throw new TypeError('order must be an object');
  }
  
  if (!order.items || !Array.isArray(order.items)) {
    throw new TypeError('order.items must be an array');
  }
  
  // Process...
}
```

---

### Q10: How do you implement global error handling?

**Answer:**
Set up global handlers for uncaught errors and unhandled Promise rejections.

**Browser:**
```javascript
// Uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Log to error tracking service
  logToService({
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
  
  // Prevent default browser error handling
  event.preventDefault();
});

// Unhandled Promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  
  logToService({
    type: 'unhandledRejection',
    reason: event.reason,
    promise: event.promise
  });
  
  event.preventDefault();
});
```

**Node.js:**
```javascript
// Uncaught exceptions
process.on('uncaughtException', (error, origin) => {
  console.error('Uncaught Exception:', error);
  console.error('Origin:', origin);
  
  // Log to service
  logErrorToService(error);
  
  // Graceful shutdown
  process.exit(1);
});

// Unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  
  // Log to service
  logErrorToService(reason);
});

// Warning events
process.on('warning', (warning) => {
  console.warn('Warning:', warning.name);
  console.warn('Message:', warning.message);
  console.warn('Stack:', warning.stack);
});
```

**Complete Error Handler:**
```javascript
class GlobalErrorHandler {
  constructor() {
    this.setupHandlers();
  }
  
  setupHandlers() {
    if (typeof window !== 'undefined') {
      this.setupBrowserHandlers();
    } else {
      this.setupNodeHandlers();
    }
  }
  
  setupBrowserHandlers() {
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handleRejection.bind(this));
  }
  
  setupNodeHandlers() {
    process.on('uncaughtException', this.handleError.bind(this));
    process.on('unhandledRejection', this.handleRejection.bind(this));
  }
  
  handleError(error) {
    console.error('Error caught:', error);
    this.logToService(error);
    // Notify user, etc.
  }
  
  handleRejection(event) {
    const error = event.reason || event;
    console.error('Rejection caught:', error);
    this.logToService(error);
  }
  
  logToService(error) {
    // Send to Sentry, LogRocket, etc.
    console.log('Logging to service:', error);
  }
}

// Initialize
const errorHandler = new GlobalErrorHandler();
```

---

## 🎓 Key Takeaways

✅ Use try-catch for synchronous errors  
✅ Always handle Promise rejections  
✅ Create custom error classes for clarity  
✅ finally blocks execute regardless of errors  
✅ Validate inputs to prevent errors  
✅ Log errors with context and timestamps  
✅ Implement retry logic for transient failures  
✅ Set up global error handlers  
✅ Distinguish operational vs programmer errors  
✅ Use error boundaries in UI frameworks

---

## 📚 Practice Tips

1. Create custom error hierarchies for different error types
2. Practice async error handling with try-catch and .catch()
3. Implement retry logic with exponential backoff
4. Build error logging utilities
5. Set up global error handlers for applications
6. Use TypeScript for compile-time error prevention

---

**Previous Topic:** Prototypes & Inheritance  
**Next Topic:** Modules & Imports
