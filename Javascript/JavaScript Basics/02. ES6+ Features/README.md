# ES6+ Features - Quick Summary & Interview Guide

## 📋 Quick Notes

### 1. Arrow Functions

**Syntax:**
```javascript
// Traditional
function add(a, b) { return a + b; }

// Arrow - explicit return
const add = (a, b) => { return a + b; };

// Arrow - implicit return
const add = (a, b) => a + b;

// Single parameter (parentheses optional)
const square = x => x * x;

// No parameters
const greet = () => "Hello";

// Returning objects (wrap in parentheses)
const makePerson = (name, age) => ({ name, age });
```

**Lexical `this`:**
```javascript
const obj = {
  name: 'Object',
  regularFunc() {
    setTimeout(function() {
      console.log(this.name);  // undefined (lost this)
    }, 100);
  },
  arrowFunc() {
    setTimeout(() => {
      console.log(this.name);  // 'Object' (inherits this)
    }, 100);
  }
};
```

---

### 2. Template Literals

```javascript
const name = 'John';
const age = 30;

// String interpolation
const greeting = `Hello, ${name}!`;

// Multi-line
const message = `
  Dear ${name},
  You are ${age} years old.
`;

// Expression evaluation
const sum = `2 + 2 = ${2 + 2}`;  // "2 + 2 = 4"

// Tagged templates
function tag(strings, ...values) {
  console.log(strings);  // ["Hello ", "!"]
  console.log(values);   // ["John"]
}
tag`Hello ${name}!`;
```

---

### 3. Destructuring

**Array Destructuring:**
```javascript
const [a, b, c] = [1, 2, 3];
const [first, , third] = [1, 2, 3];      // Skip elements
const [head, ...tail] = [1, 2, 3, 4];    // Rest pattern
const [x, y, z = 99] = [1, 2];           // Default values

// Swapping
let a = 1, b = 2;
[a, b] = [b, a];  // a=2, b=1
```

**Object Destructuring:**
```javascript
const { name, age } = user;
const { name: userName } = user;         // Rename
const { name, age = 18 } = user;         // Default
const { user: { address: { city } } } = data;  // Nested

// Function parameters
function greet({ name, age = 18 }) {
  return `${name} is ${age}`;
}
```

---

### 4. Spread & Rest

**Spread:**
```javascript
// Arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];     // [1, 2, 3, 4]
const clone = [...arr1];                 // [1, 2]

// Objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3 };
const merged = { ...obj1, ...obj2 };     // {a:1, b:2, c:3}
const updated = { ...obj1, b: 99 };      // {a:1, b:99}

// Function calls
Math.max(...[1, 5, 3]);                  // 5
```

**Rest:**
```javascript
// Function parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);  // 10

// Array destructuring
const [first, ...rest] = [1, 2, 3, 4];   // rest = [2, 3, 4]

// Object destructuring
const { a, ...others } = { a: 1, b: 2, c: 3 };  // others = {b:2, c:3}
```

---

### 5. Default Parameters

```javascript
function greet(name = 'Guest', greeting = 'Hello') {
  return `${greeting}, ${name}!`;
}
greet();                    // "Hello, Guest!"
greet('John');              // "Hello, John!"
greet(undefined, 'Hi');     // "Hi, Guest!"

// Default can be expression
function createId(prefix = Date.now()) {
  return `${prefix}-${Math.random()}`;
}

// Using previous parameters
function createRange(start, end = start + 10) {
  return [start, end];
}
```

---

### 6. Enhanced Object Literals

```javascript
const name = 'John';
const age = 30;

// Shorthand properties
const person = { name, age };  // {name: 'John', age: 30}

// Shorthand methods
const obj = {
  greet() {              // Instead of: greet: function()
    return 'Hello';
  }
};

// Computed property names
const key = 'dynamicKey';
const obj = {
  [key]: 'value',
  [`${key}_2`]: 'value2',
  [1 + 1]: 'two'
};
```

---

### 7. Optional Chaining (`?.`)

```javascript
const user = { name: 'John', address: { city: 'NY' } };

// Without optional chaining
const city = user && user.address && user.address.city;

// With optional chaining
const city = user?.address?.city;           // 'NY'
const zip = user?.address?.zip;             // undefined (no error)

// Optional method calls
const result = obj.method?.();              // Calls if exists

// Optional array access
const first = arr?.[0];                     // Safe access

// Combining with nullish coalescing
const city = user?.address?.city ?? 'Unknown';
```

---

### 8. Nullish Coalescing (`??`)

```javascript
// || treats 0, '', false as falsy
const port1 = 0 || 3000;                    // 3000 (wrong!)
const name1 = '' || 'Guest';                // 'Guest' (wrong!)

// ?? only triggers on null/undefined
const port2 = 0 ?? 3000;                    // 0 (correct!)
const name2 = '' ?? 'Guest';                // '' (correct!)
const value = null ?? 'default';            // 'default'

// Logical assignment (ES2021)
let x = null;
x ??= 10;     // x = x ?? 10
x ||= 20;     // x = x || 20
x &&= 30;     // x = x && 30
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between arrow functions and regular functions?

**Answer:**
1. **Syntax**: Arrow functions are more concise
2. **`this` binding**: Arrow functions inherit `this` lexically
3. **`arguments`**: Arrow functions don't have `arguments` object
4. **Constructor**: Arrow functions can't be used with `new`
5. **`prototype`**: Arrow functions don't have `prototype` property

```javascript
// Regular function - dynamic this
const obj = {
  name: 'Object',
  regularFunc: function() {
    console.log(this.name);  // 'Object' (this = obj)
  },
  arrowFunc: () => {
    console.log(this.name);  // undefined (this = parent scope)
  }
};

obj.regularFunc();  // 'Object'
obj.arrowFunc();    // undefined

// Regular function - has arguments
function regular() {
  console.log(arguments);  // [1, 2, 3]
}
regular(1, 2, 3);

// Arrow function - no arguments
const arrow = () => {
  console.log(arguments);  // ReferenceError
};

// Use rest parameters instead
const arrow = (...args) => {
  console.log(args);  // [1, 2, 3]
};

// Regular function - can be constructor
function Person(name) {
  this.name = name;
}
const p = new Person('John');  // ✓ Works

// Arrow function - cannot be constructor
const Person = (name) => {
  this.name = name;
};
const p = new Person('John');  // ✗ TypeError
```

**When to use:**
- **Arrow functions**: Callbacks, array methods, when you want lexical `this`
- **Regular functions**: Object methods, constructors, when you need `arguments`

---

### Q2: How does template literal work? What are tagged templates?

**Answer:**
Template literals use backticks (`) and allow:
1. String interpolation with `${}`
2. Multi-line strings
3. Expression evaluation
4. Tagged templates for custom processing

```javascript
// Basic interpolation
const name = 'John';
const greeting = `Hello, ${name}!`;  // "Hello, John!"

// Multi-line
const message = `
  Line 1
  Line 2
  Line 3
`;

// Expression evaluation
const price = 10;
const tax = 2;
const total = `Total: $${price + tax}`;  // "Total: $12"
const isEven = `${5 % 2 === 0}`;          // "false"

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
  }, '');
}

const name = 'John';
const age = 30;
const html = highlight`Name: ${name}, Age: ${age}`;
// "Name: <mark>John</mark>, Age: <mark>30</mark>"

// Practical use - SQL query builder
function sql(strings, ...values) {
  // Escape values to prevent SQL injection
  return strings.reduce((query, str, i) => {
    const value = values[i] !== undefined 
      ? `'${String(values[i]).replace(/'/g, "''")}'` 
      : '';
    return query + str + value;
  }, '');
}

const userId = 123;
const query = sql`SELECT * FROM users WHERE id = ${userId}`;
```

---

### Q3: Explain destructuring with examples. When is it useful?

**Answer:**
Destructuring extracts values from arrays or properties from objects into variables.

**Array Destructuring:**
```javascript
// Basic
const [a, b, c] = [1, 2, 3];  // a=1, b=2, c=3

// Skip elements
const [first, , third] = [1, 2, 3];  // first=1, third=3

// Rest pattern
const [head, ...tail] = [1, 2, 3, 4];  // head=1, tail=[2,3,4]

// Default values
const [x, y, z = 0] = [1, 2];  // x=1, y=2, z=0

// Swapping
let a = 1, b = 2;
[a, b] = [b, a];  // a=2, b=1

// Function returns
function getCoordinates() {
  return [10, 20];
}
const [x, y] = getCoordinates();
```

**Object Destructuring:**
```javascript
const user = { name: 'John', age: 30, city: 'NY' };

// Basic
const { name, age } = user;

// Rename variables
const { name: userName, age: userAge } = user;

// Default values
const { name, country = 'USA' } = user;

// Nested
const data = { 
  user: { 
    name: 'John', 
    address: { city: 'NY' } 
  } 
};
const { user: { address: { city } } } = data;

// Function parameters
function greet({ name, age = 18 }) {
  return `${name} is ${age}`;
}
greet({ name: 'John', age: 30 });
greet({ name: 'Jane' });  // Uses default age

// API responses
fetch('/api/user')
  .then(res => res.json())
  .then(({ id, name, email }) => {
    console.log(id, name, email);
  });

// React props
function UserCard({ name, age, avatar }) {
  return `<div>${name}, ${age}</div>`;
}
```

**Benefits:**
- Cleaner code
- Less repetitive
- Clear function signatures
- Extract only needed values

---

### Q4: What's the difference between spread and rest operators?

**Answer:**
Both use `...` but in different contexts:

**Spread (...)** - Expands/unpacks elements:
```javascript
// Arrays
const arr1 = [1, 2];
const arr2 = [3, 4];
const combined = [...arr1, ...arr2];  // [1, 2, 3, 4]

// Objects
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const merged = { ...obj1, ...obj2 };  // {a: 1, b: 2}

// Function arguments
const numbers = [1, 5, 3];
Math.max(...numbers);  // 5 (same as Math.max(1, 5, 3))

// Copying (shallow)
const original = [1, 2, 3];
const copy = [...original];

// Adding elements
const arr = [2, 3];
const newArr = [1, ...arr, 4];  // [1, 2, 3, 4]
```

**Rest (...)** - Collects/packs elements:
```javascript
// Function parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4);  // 10

// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3, 4, 5]

// Object destructuring
const { a, b, ...others } = { a: 1, b: 2, c: 3, d: 4 };
// a=1, b=2, others={c: 3, d: 4}

// Must be last parameter
function fn(a, b, ...rest) {}     // ✓
function fn(a, ...rest, b) {}     // ✗ SyntaxError
```

**Key Difference:**
- **Spread**: Expands (right side of `=`, function calls)
- **Rest**: Collects (left side of `=`, function parameters)

---

### Q5: How does the nullish coalescing operator (`??`) differ from `||`?

**Answer:**

**`||` (Logical OR):**
- Returns right side if left is **any falsy value**
- Falsy: `false`, `0`, `""`, `null`, `undefined`, `NaN`

**`??` (Nullish Coalescing):**
- Returns right side only if left is **`null` or `undefined`**
- Treats `0`, `""`, `false` as valid values

```javascript
// Problem with ||
const port = 0 || 3000;              // 3000 ⚠️ (0 is falsy)
const name = '' || 'Guest';          // 'Guest' ⚠️ ("" is falsy)
const flag = false || true;          // true ⚠️ (false is falsy)

// Solution with ??
const port = 0 ?? 3000;              // 0 ✓ (0 is valid)
const name = '' ?? 'Guest';          // '' ✓ ("" is valid)
const flag = false ?? true;          // false ✓ (false is valid)

const value1 = null ?? 'default';    // 'default'
const value2 = undefined ?? 'default'; // 'default'

// Real-world example
function fetchData(config = {}) {
  const timeout = config.timeout ?? 5000;  // 0 is valid timeout
  const retries = config.retries ?? 3;     // 0 retries is valid
  const cache = config.cache ?? true;      // false is valid
}

fetchData({ timeout: 0 });     // Uses 0, not 5000
fetchData({ retries: 0 });     // Uses 0, not 3
fetchData({ cache: false });   // Uses false, not true

// With ||, all would use defaults!
```

**Combining with Optional Chaining:**
```javascript
const city = user?.address?.city ?? 'Unknown';
// Safe access + default value
```

---

### Q6: What are default parameters? How do they interact with `undefined`?

**Answer:**
Default parameters provide fallback values when arguments are missing or `undefined`.

```javascript
// Basic default
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}
greet();           // "Hello, Guest!"
greet('John');     // "Hello, John!"

// undefined triggers default
greet(undefined);  // "Hello, Guest!"

// null does NOT trigger default
greet(null);       // "Hello, null!"

// Multiple defaults
function createUser(name = 'Guest', age = 18, role = 'user') {
  return { name, age, role };
}

// Default can be expression
function log(msg, timestamp = Date.now()) {
  console.log(`[${timestamp}] ${msg}`);
}

// Using previous parameters
function createRange(start, end = start + 10) {
  return Array.from({ length: end - start }, (_, i) => start + i);
}
createRange(1);      // [1, 2, 3, ..., 10]
createRange(1, 5);   // [1, 2, 3, 4]

// Default can be function call
function getDefaultConfig() {
  return { theme: 'dark', lang: 'en' };
}
function init(config = getDefaultConfig()) {
  return config;
}

// Destructuring with defaults
function greet({ name = 'Guest', age = 18 } = {}) {
  return `${name} is ${age}`;
}
greet();                          // "Guest is 18"
greet({});                        // "Guest is 18"
greet({ name: 'John' });          // "John is 18"
greet({ name: 'John', age: 30 }); // "John is 30"

// Avoid in defaults
function append(value, array = []) {
  array.push(value);
  return array;
}
append(1);  // [1]
append(2);  // [2] ⚠️ New array each time, not shared
```

---

### Q7: Explain optional chaining. What problems does it solve?

**Answer:**
Optional chaining (`?.`) safely accesses nested properties without throwing errors if intermediate values are `null` or `undefined`.

**Problem without optional chaining:**
```javascript
const user = {
  name: 'John',
  address: {
    city: 'NY'
  }
};

// Accessing deep property
const city = user.address.city;  // ✓ 'NY'

// If address doesn't exist
const user2 = { name: 'Jane' };
const city = user2.address.city;  // ✗ TypeError: Cannot read property 'city' of undefined

// Old solution - verbose
const city = user2 && user2.address && user2.address.city;
```

**Solution with optional chaining:**
```javascript
const city = user2?.address?.city;  // undefined (no error!)

// Property access
obj?.prop
obj?.[expr]

// Method calls
obj?.method()

// Array access
arr?.[index]

// Combining
const zipCode = user?.address?.zipCode ?? 'Unknown';

// Real examples
const username = response?.data?.user?.name;
const firstItem = array?.[0];
const result = api?.fetchData?.();
const nestedValue = obj?.['nested']?.['deep']?.value;

// Short-circuits
const result = obj?.prop?.method?.();
// If obj is null/undefined, entire expression returns undefined
// method() is never called

// With function calls
user.getAddress?.();  // Calls only if exists

// Common API pattern
fetch('/api/user')
  .then(res => res.json())
  .then(data => {
    const email = data?.user?.profile?.email ?? 'N/A';
    console.log(email);
  });
```

**Benefits:**
- Cleaner code
- No verbose null checks
- Prevents runtime errors
- Short-circuit evaluation

**Limitations:**
```javascript
// Doesn't help with left side
null.property?.value;  // ✗ Still throws error

// Use:
(null)?.property?.value;  // ✓ undefined
```

---

### Q8: How does spread operator create shallow vs deep copies?

**Answer:**
Spread creates **shallow copies** - only the top level is copied, nested objects/arrays are still referenced.

**Shallow Copy:**
```javascript
// Arrays
const original = [1, 2, 3];
const copy = [...original];

copy.push(4);
console.log(original);  // [1, 2, 3] ✓ Not affected
console.log(copy);      // [1, 2, 3, 4]

// Objects
const obj = { a: 1, b: 2 };
const clone = { ...obj };

clone.b = 99;
console.log(obj);       // {a: 1, b: 2} ✓ Not affected
console.log(clone);     // {a: 1, b: 99}

// Problem with nested objects/arrays
const original = {
  name: 'John',
  scores: [10, 20, 30],
  address: { city: 'NY' }
};

const copy = { ...original };

// Primitive changed - OK
copy.name = 'Jane';
console.log(original.name);  // 'John' ✓

// Nested array modified - SHARED!
copy.scores.push(40);
console.log(original.scores);  // [10, 20, 30, 40] ⚠️

// Nested object modified - SHARED!
copy.address.city = 'LA';
console.log(original.address.city);  // 'LA' ⚠️
```

**Deep Copy Solutions:**
```javascript
// 1. JSON (works for JSON-safe data)
const deepCopy = JSON.parse(JSON.stringify(original));
// Limitations: loses functions, undefined, symbols, dates become strings

// 2. Structured clone (modern)
const deepCopy = structuredClone(original);
// Works with most types, including Date, RegExp, Map, Set

// 3. Recursive spread (manual)
const deepCopy = {
  ...original,
  scores: [...original.scores],
  address: { ...original.address }
};

// 4. Libraries (lodash, ramda)
const deepCopy = _.cloneDeep(original);

// Verification
const original = { a: { b: 1 } };
const shallow = { ...original };
const deep = structuredClone(original);

shallow.a.b = 99;
console.log(original.a.b);  // 99 ⚠️ (shallow - shared)

deep.a.b = 99;
console.log(original.a.b);  // 1 ✓ (deep - independent)
```

---

### Q9: What's the output?

```javascript
const obj = { a: 1, b: 2, c: 3 };
const { a, ...rest } = obj;
rest.d = 4;
console.log(obj);
```

**Answer:**
```javascript
{ a: 1, b: 2, c: 3 }  // Original unchanged

// Explanation:
// Destructuring with rest creates a NEW object
// rest = { b: 2, c: 3 }  (new object)
// rest.d = 4
// rest = { b: 2, c: 3, d: 4 }
// obj is not affected
```

---

### Q10: Predict the output:

```javascript
const arr = [1, 2];
const newArr = [0, ...arr, ...arr, 3];
console.log(newArr);
```

**Answer:**
```javascript
[0, 1, 2, 1, 2, 3]

// Explanation:
// ...arr spreads [1, 2] twice
// [0, ...arr, ...arr, 3]
// [0, 1, 2, 1, 2, 3]
```

---

## 🎓 Key Takeaways

✅ Arrow functions inherit `this` lexically (no own `this`)  
✅ Use template literals for string interpolation and multi-line strings  
✅ Destructuring extracts values cleanly from arrays/objects  
✅ Spread expands, Rest collects (same `...` syntax, different contexts)  
✅ Default parameters use `undefined` as trigger, not `null`  
✅ Optional chaining (`?.`) prevents errors on null/undefined  
✅ `??` is safer than `||` for defaults when 0/""/false are valid  
✅ Spread creates shallow copies (nested objects are referenced)  
✅ Enhanced object literals reduce boilerplate  
✅ Rest parameters must be last in function/destructuring

---

## 📚 Practice Tips

1. Convert all regular functions to arrow functions in callbacks
2. Replace string concatenation with template literals
3. Use destructuring in function parameters
4. Practice shallow vs deep copy scenarios
5. Combine `?.` and `??` for safe property access

---

**Next Topic:** Object-Oriented JavaScript (Classes, Inheritance, Prototypes)
