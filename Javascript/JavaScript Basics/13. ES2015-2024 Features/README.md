# ES2015-2024 Features - Quick Summary & Interview Guide

## 📋 Quick Notes

### 1. ES2015 (ES6) - Major Update

**Arrow Functions:**
```javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Single parameter (no parentheses needed)
const double = x => x * 2;

// No parameters
const greet = () => 'Hello';

// Multiple lines
const calculate = (x, y) => {
  const sum = x + y;
  return sum * 2;
};

// Lexical 'this'
class Counter {
  constructor() {
    this.count = 0;
    
    // Arrow function inherits 'this'
    setInterval(() => {
      this.count++;  // 'this' refers to Counter instance
    }, 1000);
  }
}
```

**Template Literals:**
```javascript
const name = 'John';
const age = 30;

// String interpolation
const greeting = `Hello, ${name}!`;

// Multi-line strings
const message = `
  Name: ${name}
  Age: ${age}
  Year: ${2024 - age + age}
`;

// Expression evaluation
const price = 19.99;
const total = `Total: $${(price * 1.2).toFixed(2)}`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

const user = 'Alice';
const html = highlight`User: ${user}`;  // "User: <mark>Alice</mark>"
```

**Destructuring:**
```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Skip elements
const [a, , c] = [1, 2, 3];  // a = 1, c = 3

// Default values
const [x = 0, y = 0] = [1];  // x = 1, y = 0

// Object destructuring
const { name, age } = { name: 'John', age: 30 };

// Rename variables
const { name: userName, age: userAge } = user;

// Nested destructuring
const { address: { city, zip } } = {
  name: 'John',
  address: { city: 'NYC', zip: '10001' }
};

// Function parameters
function greet({ name, age = 18 }) {
  console.log(`${name}, ${age}`);
}

greet({ name: 'Alice', age: 25 });
```

**Default Parameters:**
```javascript
// Old way
function greet(name) {
  name = name || 'Guest';
  return 'Hello, ' + name;
}

// ES6 way
function greet(name = 'Guest') {
  return `Hello, ${name}`;
}

// With expressions
function createUser(name, role = 'user', id = Date.now()) {
  return { name, role, id };
}

// Previous parameters available
function multiply(a, b = a * 2) {
  return a * b;
}
```

**Rest and Spread:**
```javascript
// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3, 4);  // 10

// Spread in arrays
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]

// Clone array
const clone = [...arr1];

// Spread in objects
const user = { name: 'John', age: 30 };
const updated = { ...user, age: 31 };  // { name: 'John', age: 31 }

// Merge objects
const merged = { ...obj1, ...obj2 };

// Function calls
Math.max(...[1, 5, 3]);  // 5
```

---

### 2. ES2016 (ES7)

**Exponentiation Operator:**
```javascript
// Old way
Math.pow(2, 3);  // 8

// ES2016
2 ** 3;  // 8

// With assignment
let x = 2;
x **= 3;  // x = 8
```

**Array.includes():**
```javascript
// Old way
[1, 2, 3].indexOf(2) !== -1;  // true

// ES2016
[1, 2, 3].includes(2);  // true

// Works with NaN
[1, NaN, 3].includes(NaN);  // true
[1, NaN, 3].indexOf(NaN);   // -1 (doesn't work)
```

---

### 3. ES2017 (ES8)

**Async/Await:**
```javascript
// Promise-based
function fetchData() {
  return fetch('/api/data')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

// Async/await
async function fetchData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

**Object.entries() and Object.values():**
```javascript
const obj = { a: 1, b: 2, c: 3 };

// Object.entries()
Object.entries(obj);  // [['a', 1], ['b', 2], ['c', 3]]

for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}

// Object.values()
Object.values(obj);  // [1, 2, 3]

// Convert to Map
const map = new Map(Object.entries(obj));
```

**String Padding:**
```javascript
'5'.padStart(3, '0');   // '005'
'5'.padEnd(3, '0');     // '500'

// Use case: Formatting
const id = '42';
console.log(id.padStart(6, '0'));  // '000042'

// Time formatting
const hours = '9';
const minutes = '5';
console.log(`${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`);  // '09:05'
```

---

### 4. ES2018 (ES9)

**Rest/Spread for Objects:**
```javascript
// Rest in objects
const { a, b, ...rest } = { a: 1, b: 2, c: 3, d: 4 };
// a = 1, b = 2, rest = { c: 3, d: 4 }

// Spread in objects (already in ES2015 but standardized)
const defaults = { theme: 'dark', lang: 'en' };
const userPrefs = { lang: 'fr' };
const config = { ...defaults, ...userPrefs };  // { theme: 'dark', lang: 'fr' }
```

**Promise.finally():**
```javascript
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => {
    console.log('Cleanup');  // Always runs
  });

// With async/await
async function fetchData() {
  try {
    const data = await fetch('/api/data');
    return data;
  } catch (err) {
    console.error(err);
  } finally {
    console.log('Cleanup');
  }
}
```

**Async Iteration:**
```javascript
// Async iterables
const asyncIterable = {
  async *[Symbol.asyncIterator]() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
  }
};

// For-await-of
for await (const num of asyncIterable) {
  console.log(num);  // 1, 2, 3
}

// Use case: Processing streams
async function processStream(stream) {
  for await (const chunk of stream) {
    console.log(chunk);
  }
}
```

---

### 5. ES2019 (ES10)

**Array.flat() and flatMap():**
```javascript
// flat() - Flattens nested arrays
[1, [2, 3], [4, [5, 6]]].flat();     // [1, 2, 3, 4, [5, 6]]
[1, [2, 3], [4, [5, 6]]].flat(2);    // [1, 2, 3, 4, 5, 6]
[1, [2, 3], [4, [5, 6]]].flat(Infinity);  // Fully flatten

// flatMap() - Map then flatten
[1, 2, 3].flatMap(x => [x, x * 2]);  // [1, 2, 2, 4, 3, 6]

// Use case: Processing nested data
const users = [
  { name: 'Alice', hobbies: ['reading', 'gaming'] },
  { name: 'Bob', hobbies: ['cooking'] }
];

users.flatMap(u => u.hobbies);  // ['reading', 'gaming', 'cooking']
```

**Object.fromEntries():**
```javascript
// Convert entries to object
const entries = [['a', 1], ['b', 2]];
Object.fromEntries(entries);  // { a: 1, b: 2 }

// Use case: Transform object
const obj = { a: 1, b: 2, c: 3 };
const doubled = Object.fromEntries(
  Object.entries(obj).map(([k, v]) => [k, v * 2])
);
// { a: 2, b: 4, c: 6 }

// Convert Map to object
const map = new Map([['name', 'John'], ['age', 30]]);
Object.fromEntries(map);  // { name: 'John', age: 30 }
```

**String.trimStart() and trimEnd():**
```javascript
'  hello  '.trimStart();  // 'hello  '
'  hello  '.trimEnd();    // '  hello'

// Aliases
'  hello  '.trimLeft();   // 'hello  '
'  hello  '.trimRight();  // '  hello'
```

---

### 6. ES2020 (ES11)

**Optional Chaining (?.):**
```javascript
// Old way
const city = user && user.address && user.address.city;

// ES2020
const city = user?.address?.city;

// With arrays
const firstHobby = user?.hobbies?.[0];

// With functions
const result = obj?.method?.();

// Use case
function getStreetName(user) {
  return user?.address?.street?.name ?? 'Unknown';
}
```

**Nullish Coalescing (??):**
```javascript
// Old way (issue with falsy values)
const value = input || 'default';  // 0 or '' would use 'default'

// ES2020 (only null/undefined)
const value = input ?? 'default';

// Examples
0 ?? 10;         // 0
'' ?? 'default'; // ''
null ?? 'default';      // 'default'
undefined ?? 'default'; // 'default'

// Combined with optional chaining
const name = user?.name ?? 'Guest';
```

**BigInt:**
```javascript
// Large integers
const bigNum = 9007199254740991n;  // Add 'n'
const big = BigInt(9007199254740991);

// Operations
10n + 20n;  // 30n
10n * 2n;   // 20n

// Cannot mix with Number
10n + 5;    // TypeError
10n + BigInt(5);  // 15n

// Use case: Cryptography, IDs
const timestamp = 1234567890123456789n;
```

**Promise.allSettled():**
```javascript
const promises = [
  Promise.resolve(1),
  Promise.reject('error'),
  Promise.resolve(3)
];

Promise.allSettled(promises).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 1 },
  //   { status: 'rejected', reason: 'error' },
  //   { status: 'fulfilled', value: 3 }
  // ]
});
```

**globalThis:**
```javascript
// Works everywhere (browser, Node, workers)
globalThis.setTimeout(() => {}, 1000);

// Before ES2020
const global = typeof window !== 'undefined' ? window :
               typeof global !== 'undefined' ? global :
               typeof self !== 'undefined' ? self : {};
```

---

### 7. ES2021 (ES12)

**String.replaceAll():**
```javascript
// Old way
'hello world'.replace(/o/g, 'a');  // 'hella warld'

// ES2021
'hello world'.replaceAll('o', 'a');  // 'hella warld'

// With regex
'hello world'.replaceAll(/o/g, 'a');
```

**Logical Assignment:**
```javascript
// OR assignment
x ||= 10;  // x = x || 10

// AND assignment
x &&= 10;  // x = x && 10

// Nullish assignment
x ??= 10;  // x = x ?? 10

// Use cases
config.timeout ??= 5000;  // Set default if null/undefined

user.isActive &&= isVerified;  // Update only if truthy

cache[key] ||= computeValue();  // Lazy initialization
```

**Numeric Separators:**
```javascript
// Improve readability
const billion = 1_000_000_000;
const bytes = 0xFF_FF_FF_FF;
const price = 19_99;  // 19.99

// Works with BigInt
const big = 1_000_000_000_000n;
```

**Promise.any():**
```javascript
// Returns first fulfilled promise
const promises = [
  fetch('https://api1.com/data'),
  fetch('https://api2.com/data'),
  fetch('https://api3.com/data')
];

Promise.any(promises)
  .then(response => console.log('First success:', response))
  .catch(error => console.log('All failed'));
```

---

### 8. ES2022 (ES13)

**Top-level await:**
```javascript
// Before: Had to wrap in async function
async function main() {
  const data = await fetch('/api/data');
}
main();

// ES2022: Use await at module top level
const data = await fetch('/api/data');
const json = await data.json();

// Conditional imports
const module = await import(condition ? './moduleA.js' : './moduleB.js');
```

**Class Fields:**
```javascript
class User {
  // Public fields
  name = 'John';
  age = 30;
  
  // Private fields (with #)
  #password = 'secret123';
  
  // Private methods
  #validatePassword(pwd) {
    return pwd === this.#password;
  }
  
  // Public method
  login(pwd) {
    return this.#validatePassword(pwd);
  }
  
  // Static fields
  static roles = ['admin', 'user'];
  
  // Static private
  static #apiKey = 'key123';
  
  // Static block
  static {
    // Initialization code
    console.log('Class initialized');
  }
}

const user = new User();
user.name;       // 'John'
user.#password;  // SyntaxError: Private field
```

**at() Method:**
```javascript
// Arrays
const arr = [1, 2, 3, 4, 5];
arr.at(0);   // 1
arr.at(-1);  // 5 (last element)
arr.at(-2);  // 4

// Strings
'hello'.at(0);   // 'h'
'hello'.at(-1);  // 'o'
```

**Object.hasOwn():**
```javascript
// Better than hasOwnProperty
const obj = { name: 'John' };

// Old way
obj.hasOwnProperty('name');  // true

// ES2022
Object.hasOwn(obj, 'name');  // true

// Why better: Works with null prototype objects
const obj2 = Object.create(null);
obj2.hasOwnProperty('name');  // TypeError
Object.hasOwn(obj2, 'name');  // false ✓
```

---

### 9. ES2023 (ES14)

**Array Methods: findLast() and findLastIndex():**
```javascript
const arr = [1, 2, 3, 4, 5, 4, 3, 2, 1];

// findLast - search from end
arr.findLast(x => x > 3);  // 4 (last occurrence)

// findLastIndex
arr.findLastIndex(x => x > 3);  // 5

// Use case: Find most recent item
const logs = [
  { time: 1, level: 'info' },
  { time: 2, level: 'error' },
  { time: 3, level: 'info' }
];

logs.findLast(log => log.level === 'error');  // { time: 2, level: 'error' }
```

**Array.toSorted(), toReversed(), toSpliced():**
```javascript
const arr = [3, 1, 2];

// Original methods mutate
arr.sort();  // Mutates arr

// New methods return new array
arr.toSorted();  // [1, 2, 3], arr unchanged

arr.toReversed();  // [2, 1, 3], arr unchanged

arr.toSpliced(1, 1, 99);  // [3, 99, 2], arr unchanged

// with() - immutable element replacement
arr.with(1, 99);  // [3, 99, 2], arr unchanged
```

---

### 10. ES2024 (ES15)

**Object.groupBy():**
```javascript
const people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];

// Group by age
Object.groupBy(people, p => p.age);
// {
//   '25': [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
//   '30': [{ name: 'Bob', age: 30 }]
// }

// Map.groupBy for non-string keys
Map.groupBy(people, p => p.age > 27);
// Map {
//   false => [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 25 }],
//   true => [{ name: 'Bob', age: 30 }]
// }
```

**Promise.withResolvers():**
```javascript
// Old way
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

// ES2024
const { promise, resolve, reject } = Promise.withResolvers();

// Use case: Manual promise control
const controller = Promise.withResolvers();
button.onclick = () => controller.resolve('Clicked');
const result = await controller.promise;
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between arrow functions and regular functions?

**Answer:**

```javascript
// 1. 'this' binding
const obj = {
  name: 'John',
  
  // Regular function - 'this' is dynamic
  greet: function() {
    console.log(this.name);  // 'John'
  },
  
  // Arrow function - 'this' is lexical
  greetArrow: () => {
    console.log(this.name);  // undefined (inherits from outer scope)
  }
};

// 2. Cannot be used as constructor
const Regular = function() { this.x = 1; };
new Regular();  // ✓ Works

const Arrow = () => { this.x = 1; };
new Arrow();    // ❌ TypeError: Arrow is not a constructor

// 3. No 'arguments' object
function regular() {
  console.log(arguments);  // ✓ [1, 2, 3]
}
regular(1, 2, 3);

const arrow = () => {
  console.log(arguments);  // ❌ ReferenceError
};

// Use rest parameters instead
const arrow2 = (...args) => {
  console.log(args);  // ✓ [1, 2, 3]
};

// 4. Use case: Event handlers
class Counter {
  constructor() {
    this.count = 0;
    
    // Regular function - loses 'this'
    button.onclick = function() {
      this.count++;  // 'this' is button, not Counter
    };
    
    // Arrow function - keeps 'this'
    button.onclick = () => {
      this.count++;  // 'this' is Counter ✓
    };
  }
}
```

---

### Q2: Explain optional chaining and nullish coalescing.

**Answer:**

```javascript
// Optional chaining (?.) - Safe property access
const user = {
  name: 'John',
  address: {
    city: 'NYC'
  }
};

// Old way - multiple checks
const zip = user && user.address && user.address.zip;

// ES2020 - optional chaining
const zip = user?.address?.zip;  // undefined (no error)

// With arrays
const firstHobby = user?.hobbies?.[0];

// With methods
const result = obj?.method?.();

// Nullish coalescing (??) - Default for null/undefined only
const value1 = 0 || 'default';   // 'default' (0 is falsy)
const value2 = 0 ?? 'default';   // 0 (only null/undefined trigger default)

const value3 = '' || 'default';  // 'default'
const value4 = '' ?? 'default';  // ''

const value5 = null ?? 'default';      // 'default'
const value6 = undefined ?? 'default'; // 'default'

// Combined
const name = user?.profile?.name ?? 'Guest';

// Use case: Config with defaults
function createConfig(options) {
  return {
    timeout: options?.timeout ?? 5000,
    retries: options?.retries ?? 3,
    debug: options?.debug ?? false  // false is valid, won't use default
  };
}
```

---

### Q3: What are the differences between var, let, and const?

**Answer:**

```javascript
// 1. Scope
{
  var x = 1;    // Function-scoped
  let y = 2;    // Block-scoped
  const z = 3;  // Block-scoped
}

console.log(x);  // 1 (accessible)
console.log(y);  // ReferenceError
console.log(z);  // ReferenceError

// 2. Hoisting
console.log(a);  // undefined (hoisted)
var a = 1;

console.log(b);  // ReferenceError (temporal dead zone)
let b = 2;

// 3. Re-declaration
var x = 1;
var x = 2;  // ✓ Allowed

let y = 1;
let y = 2;  // ❌ SyntaxError

// 4. const - immutable binding (not value)
const arr = [1, 2, 3];
arr.push(4);  // ✓ Allowed (modifying content)
arr = [];     // ❌ TypeError (reassigning)

const obj = { name: 'John' };
obj.name = 'Jane';  // ✓ Allowed
obj = {};           // ❌ TypeError

// 5. Global object property
var globalVar = 1;
window.globalVar;  // 1 (becomes property)

let globalLet = 2;
window.globalLet;  // undefined (doesn't become property)
```

---

### Q4: How do async iterators work?

**Answer:**

```javascript
// Async iterator protocol
const asyncIterable = {
  async *[Symbol.asyncIterator]() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
  }
};

// For-await-of
for await (const num of asyncIterable) {
  console.log(num);  // 1, 2, 3 (one at a time)
}

// Use case: Paginated API
async function* fetchPages(url) {
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    
    yield data.items;
    
    hasMore = data.hasMore;
    page++;
  }
}

// Usage
for await (const items of fetchPages('/api/data')) {
  console.log('Processing page:', items);
}

// Manual iteration
const iterator = asyncIterable[Symbol.asyncIterator]();
await iterator.next();  // { value: 1, done: false }
await iterator.next();  // { value: 2, done: false }
await iterator.next();  // { value: 3, done: false }
await iterator.next();  // { value: undefined, done: true }
```

---

### Q5: What are private fields in classes?

**Answer:**

```javascript
class BankAccount {
  // Private field (with #)
  #balance = 0;
  #pin = '1234';
  
  // Public field
  accountNumber = '123456';
  
  // Constructor
  constructor(initialBalance) {
    this.#balance = initialBalance;
  }
  
  // Private method
  #validatePin(pin) {
    return pin === this.#pin;
  }
  
  // Public methods
  deposit(amount) {
    this.#balance += amount;
  }
  
  withdraw(amount, pin) {
    if (!this.#validatePin(pin)) {
      throw new Error('Invalid PIN');
    }
    
    if (this.#balance >= amount) {
      this.#balance -= amount;
      return amount;
    }
    
    throw new Error('Insufficient funds');
  }
  
  getBalance(pin) {
    if (!this.#validatePin(pin)) {
      throw new Error('Invalid PIN');
    }
    return this.#balance;
  }
}

const account = new BankAccount(100);

account.deposit(50);
account.getBalance('1234');  // 150

account.#balance;  // ❌ SyntaxError: Private field
account.#pin;      // ❌ SyntaxError: Private field

// Static private
class Database {
  static #connection = null;
  
  static connect() {
    if (!this.#connection) {
      this.#connection = createConnection();
    }
    return this.#connection;
  }
}
```

---

### Q6: What's the difference between Promise.all, allSettled, race, and any?

**Answer:**

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.reject('Error');
const p3 = Promise.resolve(3);

// Promise.all - All must succeed, fails fast
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(err => console.log('Failed:', err));
// Output: "Failed: Error"

// Promise.allSettled - Wait for all (ES2020)
Promise.allSettled([p1, p2, p3])
  .then(results => console.log(results));
// Output: [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'Error' },
//   { status: 'fulfilled', value: 3 }
// ]

// Promise.race - First to settle (resolve or reject)
const slow = new Promise(resolve => setTimeout(() => resolve('slow'), 1000));
const fast = new Promise(resolve => setTimeout(() => resolve('fast'), 100));

Promise.race([slow, fast])
  .then(result => console.log(result));  // 'fast'

// Promise.any - First to fulfill (ES2021)
Promise.any([p1, p2, p3])
  .then(result => console.log(result));  // 1 (ignores rejection)

Promise.any([Promise.reject('a'), Promise.reject('b')])
  .catch(err => console.log(err));  // AggregateError
```

**Comparison:**

| Method | Returns | Rejects | Use Case |
|--------|---------|---------|----------|
| `all` | Array of all values | On first rejection | All must succeed |
| `allSettled` | Array of all results | Never | Handle partial failures |
| `race` | First settled value/reason | If first rejects | Timeout, fastest |
| `any` | First fulfilled value | If all reject | Fallback servers |

---

### Q7: Explain the difference between flat() and flatMap().

**Answer:**

```javascript
// flat() - Flattens nested arrays
const nested = [1, [2, 3], [4, [5, 6]]];

nested.flat();     // [1, 2, 3, 4, [5, 6]] (1 level)
nested.flat(2);    // [1, 2, 3, 4, 5, 6] (2 levels)
nested.flat(Infinity);  // Fully flatten

// Remove empty slots
[1, 2, , 4, 5].flat();  // [1, 2, 4, 5]

// flatMap() - map() then flat(1)
[1, 2, 3].map(x => [x, x * 2]);
// [[1, 2], [2, 4], [3, 6]]

[1, 2, 3].flatMap(x => [x, x * 2]);
// [1, 2, 2, 4, 3, 6]

// Equivalent to:
[1, 2, 3].map(x => [x, x * 2]).flat();

// Use case: Filtering while mapping
const sentences = ['Hello world', 'Foo bar'];

// Get all words
sentences.flatMap(s => s.split(' '));
// ['Hello', 'world', 'Foo', 'bar']

// Filter and transform
[1, 2, 3, 4].flatMap(x => {
  return x % 2 === 0 ? [x, x * 2] : [];
});
// [2, 4, 4, 8]
```

---

### Q8: What is BigInt and when should you use it?

**Answer:**

```javascript
// Problem: Number precision limit
const max = Number.MAX_SAFE_INTEGER;  // 9007199254740991
max + 1;  // 9007199254740992 ✓
max + 2;  // 9007199254740992 ❌ (same, precision lost)

// BigInt - arbitrary precision integers
const bigNum = 9007199254740991n;  // Add 'n'
const big2 = BigInt(9007199254740991);

// Operations
10n + 20n;  // 30n
10n * 2n;   // 20n
10n ** 100n;  // Works!

// Cannot mix with Number
10n + 5;    // ❌ TypeError
10n + BigInt(5);  // ✅ 15n

// Comparisons work
10n > 5;    // true
10n === 10; // false (different types)
10n == 10;  // true (loose equality)

// Division truncates
7n / 2n;  // 3n (not 3.5n)

// Use cases:
// 1. Large IDs (Twitter snowflake IDs)
const tweetId = 1234567890123456789n;

// 2. Timestamps with high precision
const nanoTimestamp = BigInt(Date.now()) * 1_000_000n;

// 3. Cryptography
const prime = 2n ** 607n - 1n;

// Limitations:
// - No Math methods
Math.sqrt(100n);  // ❌ TypeError

// - JSON doesn't support BigInt
JSON.stringify({ big: 10n });  // ❌ TypeError

// Solution: Custom serialization
BigInt.prototype.toJSON = function() {
  return this.toString();
};
```

---

### Q9: What are the new immutable array methods in ES2023?

**Answer:**

```javascript
const arr = [3, 1, 2];

// Old methods (mutate original)
arr.sort();     // [1, 2, 3] - arr is changed
arr.reverse();  // [3, 2, 1] - arr is changed
arr.splice(1, 1, 99);  // arr is changed

// New methods (return new array)

// toSorted() - non-mutating sort
const sorted = arr.toSorted();
// sorted = [1, 2, 3], arr = [3, 1, 2] (unchanged)

arr.toSorted((a, b) => b - a);  // [3, 2, 1], arr unchanged

// toReversed() - non-mutating reverse
const reversed = arr.toReversed();
// reversed = [2, 1, 3], arr unchanged

// toSpliced() - non-mutating splice
const spliced = arr.toSpliced(1, 1, 99);
// spliced = [3, 99, 2], arr unchanged

// with() - non-mutating element replacement
const updated = arr.with(1, 99);
// updated = [3, 99, 2], arr unchanged

// Use case: Immutable state updates
const state = {
  items: [1, 2, 3, 4, 5]
};

// Update state immutably
const newState = {
  ...state,
  items: state.items.with(2, 99)  // Replace index 2
};

// Chaining
arr
  .toSorted()
  .toReversed()
  .with(0, 99);
// [3, 2, 1] → [1, 2, 3] → [3, 2, 1] → [99, 2, 1]
```

---

### Q10: What is top-level await and when can you use it?

**Answer:**

```javascript
// Before ES2022: Wrap in async function
async function main() {
  const data = await fetch('/api/data');
  const json = await data.json();
  console.log(json);
}
main();

// ES2022: Use await directly at module top level
const data = await fetch('/api/data');
const json = await data.json();
console.log(json);

// Requirements:
// - Must be in a module (type="module" or .mjs)
// - Not available in scripts or CommonJS

// Use cases:

// 1. Dynamic imports based on async data
const config = await fetch('/config.json').then(r => r.json());
const module = await import(config.featureEnabled ? './feature.js' : './fallback.js');

// 2. Resource initialization
const db = await connectToDatabase();
export default db;

// 3. Dependency initialization
await initializeApp();
export { app };

// 4. Fallback with error handling
let translations;
try {
  translations = await import(`./i18n/${language}.js`);
} catch {
  translations = await import('./i18n/en.js');
}

// Blocking behavior: Module execution waits
// moduleA.js
console.log('A: before');
await delay(1000);
console.log('A: after');

// moduleB.js
import './moduleA.js';
console.log('B: start');

// Output:
// A: before
// (1 second delay)
// A: after
// B: start
```

---

## 🎓 Key Takeaways

✅ Arrow functions have lexical `this`, can't be constructors  
✅ Optional chaining (`?.`) and nullish coalescing (`??`) for safe access  
✅ `let`/`const` are block-scoped, `var` is function-scoped  
✅ Private class fields use `#` prefix  
✅ Promise combinators: `all`, `allSettled`, `race`, `any`  
✅ `flat()` and `flatMap()` for nested arrays  
✅ BigInt for arbitrary precision integers  
✅ Immutable array methods: `toSorted()`, `toReversed()`, `with()`  
✅ Top-level await in ES modules  
✅ Logical assignment: `||=`, `&&=`, `??=`

---

## 📚 Practice Tips

1. Refactor old code to use modern ES features
2. Practice with optional chaining and nullish coalescing
3. Implement classes with private fields
4. Use Promise combinators in real scenarios
5. Explore new array methods for data transformation

---

**Next Topic:** Best Practices (Clean Code, Performance, Security)
