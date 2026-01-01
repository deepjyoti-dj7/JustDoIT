# Functions & Closures - Quick Summary & Interview Guide

## 📚 Quick Notes

### 1. Function Declarations

**Basic Function:**
```javascript
// Function declaration - hoisted
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet('John'));  // "Hello, John!"

// Can be called before declaration (hoisted)
sayHi();  // "Hi!" - works!

function sayHi() {
  return 'Hi!';
}

// Function with default parameters (ES6+)
function multiply(a, b = 1) {
  return a * b;
}

multiply(5);     // 5
multiply(5, 2);  // 10

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, num) => acc + num, 0);
}

sum(1, 2, 3, 4);  // 10
```

---

### 2. Function Expressions

**Named and Anonymous:**
```javascript
// Anonymous function expression - not hoisted
const greet = function(name) {
  return `Hello, ${name}!`;
};

// Cannot call before initialization
sayHi();  // ReferenceError ❌

const sayHi = function() {
  return 'Hi!';
};

// Named function expression (useful for recursion and debugging)
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);  // Can call itself by name
};

factorial(5);  // 120

// Function expression as callback
setTimeout(function() {
  console.log('Delayed');
}, 1000);

// Immediately Invoked Function Expression (IIFE)
(function() {
  console.log('Runs immediately!');
})();

// IIFE with parameters
(function(name) {
  console.log(`Hello, ${name}!`);
})('John');  // "Hello, John!"
```

---

### 3. Arrow Functions

**Syntax Variations:**
```javascript
// Basic arrow function
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Concise (implicit return)
const greet = name => `Hello, ${name}!`;

// Multiple parameters
const add = (a, b) => a + b;

// No parameters
const random = () => Math.random();

// Returning object literal (wrap in parentheses)
const makePerson = (name, age) => ({ name, age });

makePerson('John', 30);  // { name: 'John', age: 30 }

// Arrow function in array methods
const numbers = [1, 2, 3, 4, 5];

numbers.map(n => n * 2);           // [2, 4, 6, 8, 10]
numbers.filter(n => n > 2);        // [3, 4, 5]
numbers.reduce((sum, n) => sum + n, 0);  // 15
```

**Lexical `this`:**
```javascript
// Regular function - dynamic this
function Timer() {
  this.seconds = 0;
  
  setInterval(function() {
    this.seconds++;  // `this` is window/undefined ❌
    console.log(this.seconds);
  }, 1000);
}

// Arrow function - lexical this
function Timer() {
  this.seconds = 0;
  
  setInterval(() => {
    this.seconds++;  // `this` is Timer instance ✓
    console.log(this.seconds);
  }, 1000);
}

// Object methods
const person = {
  name: 'John',
  
  // Regular function - this is person
  greet: function() {
    console.log(`Hi, I'm ${this.name}`);
  },
  
  // Arrow function - this is NOT person ❌
  greetArrow: () => {
    console.log(`Hi, I'm ${this.name}`);  // undefined
  }
};

person.greet();       // "Hi, I'm John"
person.greetArrow();  // "Hi, I'm undefined"
```

**No `arguments` object:**
```javascript
// Regular function has arguments
function sum() {
  console.log(arguments);  // [1, 2, 3]
  return Array.from(arguments).reduce((a, b) => a + b);
}

sum(1, 2, 3);  // 6

// Arrow function - no arguments ❌
const sumArrow = () => {
  console.log(arguments);  // ReferenceError
};

// Use rest parameters instead
const sumArrowFixed = (...args) => {
  console.log(args);  // [1, 2, 3]
  return args.reduce((a, b) => a + b);
};

sumArrowFixed(1, 2, 3);  // 6
```

---

### 4. Closures

**Basic Closure:**
```javascript
// Outer function
function outer() {
  const outerVar = 'I am outer';
  
  // Inner function (closure)
  function inner() {
    console.log(outerVar);  // Accesses outer variable
  }
  
  return inner;
}

const innerFunc = outer();
innerFunc();  // "I am outer" - outerVar still accessible!

// Closure with parameter
function makeGreeter(greeting) {
  return function(name) {
    return `${greeting}, ${name}!`;
  };
}

const sayHello = makeGreeter('Hello');
const sayHi = makeGreeter('Hi');

sayHello('John');  // "Hello, John!"
sayHi('Jane');     // "Hi, Jane!"
```

**Private Variables:**
```javascript
// Counter with private state
function createCounter() {
  let count = 0;  // Private variable
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();

counter.increment();  // 1
counter.increment();  // 2
counter.getCount();   // 2
counter.decrement();  // 1

console.log(counter.count);  // undefined - private!

// Module pattern
const calculator = (function() {
  // Private variables
  let result = 0;
  
  // Private function
  function log(operation, value) {
    console.log(`${operation}: ${value}`);
  }
  
  // Public API
  return {
    add: function(x) {
      result += x;
      log('Add', x);
      return this;
    },
    
    subtract: function(x) {
      result -= x;
      log('Subtract', x);
      return this;
    },
    
    multiply: function(x) {
      result *= x;
      log('Multiply', x);
      return this;
    },
    
    getResult: function() {
      return result;
    },
    
    reset: function() {
      result = 0;
      return this;
    }
  };
})();

calculator.add(10).multiply(2).subtract(5).getResult();  // 15
```

**Common Closure Pitfall - Loop:**
```javascript
// WRONG - All buttons get i=3
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);  // 3, 3, 3 ❌
  }, 1000);
}

// FIX 1: Use IIFE to capture i
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);  // 0, 1, 2 ✓
    }, 1000);
  })(i);
}

// FIX 2: Use let (block scope)
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);  // 0, 1, 2 ✓
  }, 1000);
}
```

---

### 5. Higher-Order Functions

**Functions as Arguments:**
```javascript
// Function that takes a function
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log);
// 0
// 1
// 2

// Custom forEach
function forEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}

forEach([1, 2, 3], (item, index) => {
  console.log(`${index}: ${item}`);
});
// 0: 1
// 1: 2
// 2: 3
```

**Functions as Return Values:**
```javascript
// Function factory
function multiplyBy(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

double(5);  // 10
triple(5);  // 15

// Function decorator
function log(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd = log(add);

loggedAdd(2, 3);
// Calling add with [2, 3]
// Result: 5
// 5
```

**Array Methods (Higher-Order):**
```javascript
const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(n => n * 2);
// [2, 4, 6, 8, 10]

// filter - select elements
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4]

// reduce - accumulate
const sum = numbers.reduce((acc, n) => acc + n, 0);
// 15

// find - first matching element
const firstEven = numbers.find(n => n % 2 === 0);
// 2

// some - at least one matches
const hasEven = numbers.some(n => n % 2 === 0);
// true

// every - all match
const allPositive = numbers.every(n => n > 0);
// true

// Chaining
const result = numbers
  .filter(n => n > 2)      // [3, 4, 5]
  .map(n => n * 2)         // [6, 8, 10]
  .reduce((a, b) => a + b); // 24
```

---

### 6. Function Composition

**Compose Functions:**
```javascript
// Compose - right to left execution
const compose = (...fns) => x => 
  fns.reduceRight((acc, fn) => fn(acc), x);

// Pipe - left to right execution
const pipe = (...fns) => x => 
  fns.reduce((acc, fn) => fn(acc), x);

// Helper functions
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const subtract3 = x => x - 3;

// Compose: subtract(multiply(add(10)))
const composed = compose(subtract3, multiply2, add5);
composed(10);  // (10 + 5) * 2 - 3 = 27

// Pipe: add(multiply(subtract(10)))
const piped = pipe(add5, multiply2, subtract3);
piped(10);  // (10 + 5) * 2 - 3 = 27

// Real example
const toLowerCase = str => str.toLowerCase();
const removeSpaces = str => str.replace(/\s/g, '');
const reverse = str => str.split('').reverse().join('');

const transform = pipe(toLowerCase, removeSpaces, reverse);

transform('Hello World');  // "dlrowolleh"
```

---

### 7. Currying

**Partial Application:**
```javascript
// Manual currying
function multiply(a) {
  return function(b) {
    return a * b;
  };
}

const multiplyBy5 = multiply(5);
multiplyBy5(10);  // 50

// Arrow function currying
const add = a => b => a + b;

const add5 = add(5);
add5(10);  // 15

// Practical example - logger
const log = level => message => {
  console.log(`[${level}] ${message}`);
};

const info = log('INFO');
const error = log('ERROR');

info('User logged in');    // [INFO] User logged in
error('Database error');   // [ERROR] Database error

// Generic curry function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    } else {
      return function(...moreArgs) {
        return curried(...args, ...moreArgs);
      };
    }
  };
}

function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

curriedSum(1)(2)(3);      // 6
curriedSum(1, 2)(3);      // 6
curriedSum(1)(2, 3);      // 6
curriedSum(1, 2, 3);      // 6
```

---

### 8. Recursion

**Basic Recursion:**
```javascript
// Factorial
function factorial(n) {
  if (n <= 1) return 1;  // Base case
  return n * factorial(n - 1);  // Recursive case
}

factorial(5);  // 120

// Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

fibonacci(6);  // 8

// Sum array
function sum(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sum(arr.slice(1));
}

sum([1, 2, 3, 4, 5]);  // 15

// Flatten nested array
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}

flatten([1, [2, [3, [4]], 5]]);  // [1, 2, 3, 4, 5]
```

**Tail Call Optimization:**
```javascript
// Non-tail recursive (stack grows)
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);  // Operation after recursive call
}

// Tail recursive (optimized in strict mode)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc);  // Nothing after recursive call
}

factorialTail(5);  // 120
```

---

### 9. Memoization

**Caching Function Results:**
```javascript
// Memoize decorator
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log('Cached result');
      return cache[key];
    }
    
    console.log('Computing...');
    const result = fn(...args);
    cache[key] = result;
    
    return result;
  };
}

// Slow Fibonacci
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// Memoized Fibonacci
const fibMemo = memoize(fib);

fibMemo(40);  // Computing... (slow first time)
fibMemo(40);  // Cached result (instant!)

// Advanced memoization
function advancedMemoize(fn, resolver) {
  const cache = new Map();
  
  return function(...args) {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  };
}

// Custom key resolver
const expensiveOperation = advancedMemoize(
  (user) => {
    console.log('Processing user:', user.id);
    return user.name.toUpperCase();
  },
  (user) => user.id  // Use user.id as cache key
);
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between function declaration and function expression?

**Answer:**

**Function Declaration:**
```javascript
// Hoisted - can call before declaration
sayHello();  // "Hello!" ✓

function sayHello() {
  return 'Hello!';
}

// Creates a named function in current scope
console.log(typeof sayHello);  // "function"
```

**Function Expression:**
```javascript
// Not hoisted - cannot call before initialization
sayHi();  // ReferenceError: Cannot access 'sayHi' before initialization ❌

const sayHi = function() {
  return 'Hi!';
};

// Can be anonymous or named
const anonymous = function() { /* ... */ };
const named = function factorial(n) { /* ... */ };
```

**Key Differences:**

| Feature | Declaration | Expression |
|---------|-------------|------------|
| Hoisting | Yes | No (const/let) |
| Must be named | Yes | No (can be anonymous) |
| When defined | Parse time | Runtime |
| Use before definition | Yes | No |

**When to use:**
- **Declaration:** Top-level functions, utilities
- **Expression:** Callbacks, conditional definitions, IIFEs

```javascript
// Conditional function (expression only)
const func = condition ? function() { /* A */ } : function() { /* B */ };

// This doesn't work with declarations
if (condition) {
  function test() { /* ... */ }  // ❌ Unpredictable
}
```

---

### Q2: What is a closure and how does it work?

**Answer:**
A closure is an inner function that has access to variables in its outer (enclosing) function's scope, even after the outer function has returned.

```javascript
function outer(x) {
  // Outer variable
  const outerVar = 'I am outer';
  
  // Inner function (closure)
  function inner(y) {
    // Can access:
    // 1. Its own variables (y)
    // 2. Outer function's variables (x, outerVar)
    // 3. Global variables
    console.log(x, outerVar, y);
  }
  
  return inner;
}

const innerFunc = outer(10);
innerFunc(20);  // 10 "I am outer" 20

// outer() finished executing, but innerFunc still accesses x and outerVar!
```

**How it works:**
1. When `inner` is created, it "closes over" variables from `outer`
2. JavaScript creates a "lexical environment" that persists
3. Variables are kept in memory as long as closure exists

**Practical uses:**

```javascript
// 1. Private variables
function createBankAccount(initialBalance) {
  let balance = initialBalance;  // Private
  
  return {
    deposit: function(amount) {
      balance += amount;
      return balance;
    },
    
    withdraw: function(amount) {
      if (amount <= balance) {
        balance -= amount;
        return balance;
      }
      return 'Insufficient funds';
    },
    
    getBalance: function() {
      return balance;
    }
  };
}

const account = createBankAccount(100);

account.deposit(50);      // 150
account.withdraw(30);     // 120
account.getBalance();     // 120

console.log(account.balance);  // undefined - private!

// 2. Function factories
function makeMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

double(5);  // 10
triple(5);  // 15

// 3. Event handlers
function setupButton(buttonId) {
  let clickCount = 0;
  
  document.getElementById(buttonId).addEventListener('click', function() {
    clickCount++;
    console.log(`Button clicked ${clickCount} times`);
  });
}

setupButton('myButton');  // clickCount is preserved across clicks
```

---

### Q3: What's the difference between arrow functions and regular functions?

**Answer:**

**Key Differences:**

| Feature | Regular Function | Arrow Function |
|---------|-----------------|----------------|
| `this` binding | Dynamic | Lexical |
| `arguments` object | Yes | No |
| Constructor | Can use `new` | Cannot use `new` |
| `prototype` | Has one | No |
| Hoisting | Yes (declaration) | No |

**1. `this` binding:**
```javascript
const obj = {
  name: 'John',
  
  // Regular function - this is obj
  greet: function() {
    console.log(`Hi, I'm ${this.name}`);
  },
  
  // Arrow function - this is NOT obj (lexical)
  greetArrow: () => {
    console.log(`Hi, I'm ${this.name}`);  // undefined
  },
  
  // Nested example
  regularNested: function() {
    setTimeout(function() {
      console.log(this.name);  // undefined (this is window/global)
    }, 100);
  },
  
  arrowNested: function() {
    setTimeout(() => {
      console.log(this.name);  // "John" (lexical this)
    }, 100);
  }
};

obj.greet();         // "Hi, I'm John"
obj.greetArrow();    // "Hi, I'm undefined"
obj.regularNested(); // undefined
obj.arrowNested();   // "John"
```

**2. `arguments` object:**
```javascript
// Regular function
function regularFunc() {
  console.log(arguments);  // [1, 2, 3]
}

regularFunc(1, 2, 3);

// Arrow function
const arrowFunc = () => {
  console.log(arguments);  // ReferenceError
};

// Use rest parameters instead
const arrowFixed = (...args) => {
  console.log(args);  // [1, 2, 3]
};

arrowFixed(1, 2, 3);
```

**3. Constructor:**
```javascript
// Regular function
function Person(name) {
  this.name = name;
}

const john = new Person('John');  // ✓ Works

// Arrow function
const PersonArrow = (name) => {
  this.name = name;
};

const jane = new PersonArrow('Jane');  // ❌ TypeError: PersonArrow is not a constructor
```

**When to use:**
- **Arrow:** Callbacks, array methods, when you want lexical `this`
- **Regular:** Object methods, constructors, when you need `arguments`

---

### Q4: Explain the common closure pitfall in loops.

**Answer:**

**The Problem:**
```javascript
// Create 3 buttons
for (var i = 0; i < 3; i++) {
  const button = document.createElement('button');
  button.textContent = `Button ${i}`;
  
  button.addEventListener('click', function() {
    alert(`Button ${i} clicked`);  // Always alerts "Button 3"! ❌
  });
  
  document.body.appendChild(button);
}

// Why? All closures reference the SAME i
// After loop finishes, i = 3
// All event handlers access this same i
```

**Solution 1: Use `let` (block scope):**
```javascript
for (let i = 0; i < 3; i++) {
  const button = document.createElement('button');
  button.textContent = `Button ${i}`;
  
  button.addEventListener('click', function() {
    alert(`Button ${i} clicked`);  // Correct! ✓
  });
  
  document.body.appendChild(button);
}

// let creates a NEW i for each iteration
// Each closure gets its own i
```

**Solution 2: IIFE (Immediately Invoked Function Expression):**
```javascript
for (var i = 0; i < 3; i++) {
  (function(j) {  // Create new scope with parameter j
    const button = document.createElement('button');
    button.textContent = `Button ${j}`;
    
    button.addEventListener('click', function() {
      alert(`Button ${j} clicked`);  // Correct! ✓
    });
    
    document.body.appendChild(button);
  })(i);  // Pass current i as j
}

// Each IIFE creates new scope with its own j
```

**Solution 3: Factory function:**
```javascript
function makeClickHandler(index) {
  return function() {
    alert(`Button ${index} clicked`);
  };
}

for (var i = 0; i < 3; i++) {
  const button = document.createElement('button');
  button.textContent = `Button ${i}`;
  button.addEventListener('click', makeClickHandler(i));  // ✓
  document.body.appendChild(button);
}
```

**Why it happens:**
- `var` is function-scoped, not block-scoped
- All closures reference the same `i` variable
- After loop, `i = 3`, so all closures see `3`

---

### Q5: What are higher-order functions? Give examples.

**Answer:**
A higher-order function is a function that:
1. Takes one or more functions as arguments, OR
2. Returns a function as its result

**Example 1: Function as argument:**
```javascript
// filter is a higher-order function
const numbers = [1, 2, 3, 4, 5];

const evens = numbers.filter(function(n) {
  return n % 2 === 0;
});  // [2, 4]

// Custom higher-order function
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log);
// 0
// 1
// 2

// Flexible behavior
repeat(3, (i) => console.log(`Number: ${i}`));
// Number: 0
// Number: 1
// Number: 2
```

**Example 2: Function as return value:**
```javascript
// Function factory
function multiplyBy(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
const triple = multiplyBy(3);

double(5);  // 10
triple(5);  // 15

// Decorator pattern
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const loggedAdd = withLogging(add);

loggedAdd(2, 3);
// Calling add with [2, 3]
// Result: 5
// 5
```

**Common built-in higher-order functions:**
```javascript
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
  { name: 'Bob', age: 35 }
];

// map - transform
const names = users.map(u => u.name);
// ['John', 'Jane', 'Bob']

// filter - select
const adults = users.filter(u => u.age >= 30);
// [{ name: 'John', age: 30 }, { name: 'Bob', age: 35 }]

// reduce - accumulate
const totalAge = users.reduce((sum, u) => sum + u.age, 0);
// 90

// sort - with comparator function
users.sort((a, b) => a.age - b.age);
// Sorted by age

// find - first match
const jane = users.find(u => u.name === 'Jane');
// { name: 'Jane', age: 25 }
```

**Benefits:**
- Code reuse
- Abstraction
- Composability
- Declarative style

---

### Q6: What is function currying?

**Answer:**
Currying is transforming a function with multiple arguments into a sequence of functions, each taking a single argument.

```javascript
// Normal function
function add(a, b, c) {
  return a + b + c;
}

add(1, 2, 3);  // 6

// Curried version
function addCurried(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

addCurried(1)(2)(3);  // 6

// Arrow function syntax (cleaner)
const addCurried = a => b => c => a + b + c;

addCurried(1)(2)(3);  // 6

// Partial application
const add1 = addCurried(1);
const add1and2 = add1(2);

add1and2(3);  // 6
add1and2(10); // 13
```

**Practical uses:**

```javascript
// 1. Configuration
const log = level => message => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
};

const info = log('INFO');
const error = log('ERROR');
const debug = log('DEBUG');

info('User logged in');        // [2024-...] [INFO] User logged in
error('Database connection');  // [2024-...] [ERROR] Database connection

// 2. Event handling
const handleEvent = eventType => selector => callback => {
  document.querySelector(selector).addEventListener(eventType, callback);
};

const onClick = handleEvent('click');
const onSubmit = handleEvent('submit');

onClick('#button')(() => console.log('Clicked!'));
onSubmit('#form')(() => console.log('Submitted!'));

// 3. Data processing
const filter = predicate => array => array.filter(predicate);
const map = fn => array => array.map(fn);

const isEven = n => n % 2 === 0;
const double = n => n * 2;

const filterEvens = filter(isEven);
const doubleAll = map(double);

const numbers = [1, 2, 3, 4, 5];

filterEvens(numbers);  // [2, 4]
doubleAll(numbers);    // [2, 4, 6, 8, 10]

// Composition
const processNumbers = numbers => doubleAll(filterEvens(numbers));
processNumbers([1, 2, 3, 4, 5]);  // [4, 8]
```

**Generic curry function:**
```javascript
function curry(fn) {
  return function curried(...args) {
    // If enough arguments, call original function
    if (args.length >= fn.length) {
      return fn(...args);
    }
    
    // Otherwise, return function waiting for more arguments
    return function(...moreArgs) {
      return curried(...args, ...moreArgs);
    };
  };
}

// Use with any function
function sum(a, b, c) {
  return a + b + c;
}

const curriedSum = curry(sum);

curriedSum(1)(2)(3);      // 6
curriedSum(1, 2)(3);      // 6
curriedSum(1)(2, 3);      // 6
curriedSum(1, 2, 3);      // 6
```

---

### Q7: What is an IIFE and why use it?

**Answer:**
IIFE (Immediately Invoked Function Expression) is a function that runs immediately after it's defined.

**Syntax:**
```javascript
// Basic IIFE
(function() {
  console.log('Runs immediately!');
})();

// Arrow function IIFE
(() => {
  console.log('Also runs immediately!');
})();

// With parameters
(function(name) {
  console.log(`Hello, ${name}!`);
})('John');  // "Hello, John!"

// Return value
const result = (function() {
  return 42;
})();

console.log(result);  // 42
```

**Why use IIFEs:**

**1. Avoid polluting global scope:**
```javascript
// Without IIFE - global pollution
var counter = 0;
var increment = function() { counter++; };
var reset = function() { counter = 0; };

// With IIFE - no global pollution
const counterModule = (function() {
  let counter = 0;  // Private
  
  return {
    increment: function() { counter++; },
    reset: function() { counter = 0; },
    getCount: function() { return counter; }
  };
})();

counterModule.increment();
counterModule.getCount();  // 1
console.log(counter);  // ReferenceError - not in global scope
```

**2. Module pattern:**
```javascript
const calculator = (function() {
  // Private variables and functions
  let result = 0;
  
  function log(operation) {
    console.log(`${operation}: ${result}`);
  }
  
  // Public API
  return {
    add: function(x) {
      result += x;
      log('Add');
      return this;
    },
    
    subtract: function(x) {
      result -= x;
      log('Subtract');
      return this;
    },
    
    getResult: function() {
      return result;
    }
  };
})();

calculator.add(10).subtract(3).getResult();  // 7
```

**3. Loop closure fix:**
```javascript
// Problem
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);  // 3, 3, 3 ❌
  }, 1000);
}

// IIFE solution
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);  // 0, 1, 2 ✓
    }, 1000);
  })(i);
}
```

**4. Initialization code:**
```javascript
// Run setup code without polluting global scope
(function() {
  const config = loadConfig();
  const db = connectDatabase(config);
  
  // Initialize app
  app.init(db);
})();

// config and db are not accessible outside
```

**5. Creating private state:**
```javascript
const person = (function() {
  // Private
  let name = 'John';
  let age = 30;
  
  // Public
  return {
    getName: () => name,
    getAge: () => age,
    setAge: (newAge) => {
      if (newAge > 0) age = newAge;
    }
  };
})();

person.getName();   // "John"
person.setAge(31);
person.getAge();    // 31

console.log(person.name);  // undefined - private!
```

---

### Q8: What is memoization and how do you implement it?

**Answer:**
Memoization is an optimization technique that caches function results to avoid redundant computations.

**Basic implementation:**
```javascript
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log('Returning cached result');
      return cache[key];
    }
    
    console.log('Computing result');
    const result = fn(...args);
    cache[key] = result;
    
    return result;
  };
}

// Slow function
function slowSquare(n) {
  // Simulate slow operation
  for (let i = 0; i < 1e9; i++) {}
  return n * n;
}

const fastSquare = memoize(slowSquare);

fastSquare(5);  // Computing result... (slow)
fastSquare(5);  // Returning cached result (instant!)
```

**Real-world example - Fibonacci:**
```javascript
// Slow recursive Fibonacci (exponential time)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

fib(40);  // Takes several seconds! 😱

// Memoized version (linear time)
const fibMemo = memoize(function fib(n) {
  if (n <= 1) return n;
  return fibMemo(n - 1) + fibMemo(n - 2);
});

fibMemo(40);  // Almost instant! ⚡
fibMemo(100); // Still fast!
```

**Advanced memoization:**
```javascript
function advancedMemoize(fn, options = {}) {
  const cache = new Map();
  const { maxSize = Infinity, resolver } = options;
  
  return function(...args) {
    // Custom key resolver or default
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    
    // Limit cache size (LRU-like)
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    cache.set(key, result);
    return result;
  };
}

// Usage with custom resolver
const expensiveQuery = advancedMemoize(
  (user) => {
    console.log('Querying database for:', user.id);
    return { ...user, processed: true };
  },
  {
    maxSize: 100,
    resolver: (user) => user.id  // Use user.id as cache key
  }
);

expensiveQuery({ id: 1, name: 'John' });  // Querying...
expensiveQuery({ id: 1, name: 'Jane' });  // Cached (same id)
```

**When to use memoization:**
- Pure functions (same input → same output)
- Expensive computations
- Recursive functions
- API calls with same parameters
- Data transformations

**When NOT to use:**
- Functions with side effects
- Random/time-based functions
- Functions with large/complex arguments
- Memory-constrained environments

---

### Q9: What's the difference between `call`, `apply`, and `bind`?

**Answer:**
All three methods control the `this` value in function execution.

**1. `call()` - Invoke immediately with arguments:**
```javascript
function greet(greeting, punctuation) {
  return `${greeting}, I'm ${this.name}${punctuation}`;
}

const person = { name: 'John' };

greet.call(person, 'Hello', '!');  // "Hello, I'm John!"
//          ↑       ↑        ↑
//        this    arg1     arg2
```

**2. `apply()` - Invoke immediately with array:**
```javascript
greet.apply(person, ['Hi', '?']);  // "Hi, I'm John?"
//           ↑       ↑
//         this   [args]

// Useful for functions with unknown number of arguments
const numbers = [5, 6, 2, 3, 7];

Math.max.apply(null, numbers);  // 7
// Same as: Math.max(5, 6, 2, 3, 7)
```

**3. `bind()` - Return new function (doesn't invoke):**
```javascript
const boundGreet = greet.bind(person, 'Hey');
//                       ↑     ↑       ↑
//                  returns fn  this  arg1

boundGreet('!!!');  // "Hey, I'm John!!!"

// Partial application
const greetJohn = greet.bind(person);

greetJohn('Hello', '!');  // "Hello, I'm John!"
greetJohn('Hi', '?');     // "Hi, I'm John?"
```

**Comparison:**

| Method | Invokes immediately | Arguments | Returns |
|--------|-------------------|-----------|---------|
| `call` | Yes | Individual | Result |
| `apply` | Yes | Array | Result |
| `bind` | No | Individual (partial) | New function |

**Practical examples:**

```javascript
// 1. Borrowing methods
const person1 = {
  firstName: 'John',
  lastName: 'Doe',
  getFullName: function() {
    return `${this.firstName} ${this.lastName}`;
  }
};

const person2 = {
  firstName: 'Jane',
  lastName: 'Smith'
};

// Borrow method
person1.getFullName.call(person2);  // "Jane Smith"

// 2. Array-like objects
function sum() {
  // arguments is not an array, but array-like
  const args = Array.prototype.slice.call(arguments);
  return args.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3, 4);  // 10

// 3. Event handlers
class Button {
  constructor(label) {
    this.label = label;
    this.clickCount = 0;
  }
  
  handleClick() {
    this.clickCount++;
    console.log(`${this.label} clicked ${this.clickCount} times`);
  }
  
  render() {
    const button = document.createElement('button');
    button.textContent = this.label;
    
    // bind preserves `this`
    button.addEventListener('click', this.handleClick.bind(this));
    
    return button;
  }
}

const btn = new Button('Click me');
document.body.appendChild(btn.render());

// 4. Function composition
function multiply(a, b) {
  return a * b;
}

const double = multiply.bind(null, 2);
const triple = multiply.bind(null, 3);

double(5);  // 10
triple(5);  // 15
```

---

### Q10: Explain function composition and pipe.

**Answer:**
Function composition combines multiple functions to create a new function.

**Compose (right-to-left execution):**
```javascript
// Manual composition
const compose = (...fns) => x =>
  fns.reduceRight((acc, fn) => fn(acc), x);

// Helper functions
const add5 = x => x + 5;
const multiply2 = x => x * 2;
const subtract3 = x => x - 3;

// Compose: executes right to left
const calculate = compose(subtract3, multiply2, add5);

calculate(10);
// Step 1: add5(10) = 15
// Step 2: multiply2(15) = 30
// Step 3: subtract3(30) = 27
// Result: 27
```

**Pipe (left-to-right execution):**
```javascript
// Pipe: executes left to right (more intuitive)
const pipe = (...fns) => x =>
  fns.reduce((acc, fn) => fn(acc), x);

const calculate = pipe(add5, multiply2, subtract3);

calculate(10);
// Step 1: add5(10) = 15
// Step 2: multiply2(15) = 30
// Step 3: subtract3(30) = 27
// Result: 27
```

**Real-world example:**
```javascript
// String processing
const toLowerCase = str => str.toLowerCase();
const removeSpaces = str => str.replace(/\s/g, '');
const reverse = str => str.split('').reverse().join('');
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

// Compose username
const createUsername = pipe(
  toLowerCase,
  removeSpaces,
  reverse
);

createUsername('John Doe');  // "eodnhoj"

// Data transformation
const users = [
  { name: 'John', age: 30, active: true },
  { name: 'Jane', age: 25, active: false },
  { name: 'Bob', age: 35, active: true }
];

const getActiveUsers = users => users.filter(u => u.active);
const getNames = users => users.map(u => u.name);
const sortNames = names => names.sort();
const joinNames = names => names.join(', ');

const getActiveUserNames = pipe(
  getActiveUsers,
  getNames,
  sortNames,
  joinNames
);

getActiveUserNames(users);  // "Bob, John"
```

**Benefits:**
- Reusability
- Testability
- Readability
- Declarative code
- Small, focused functions

---

## 🎓 Key Takeaways

✅ **Function declarations** are hoisted, **expressions** are not  
✅ **Arrow functions** have lexical `this` and no `arguments`  
✅ **Closures** allow inner functions to access outer scope  
✅ **Higher-order functions** take/return other functions  
✅ **Currying** transforms multi-arg function into sequence of single-arg functions  
✅ **IIFEs** create private scope immediately  
✅ **Memoization** caches results for performance  
✅ **`call`/`apply`** invoke immediately, **`bind`** returns new function  
✅ **Composition** combines functions for reusable pipelines  
✅ **`let`** fixes closure loop pitfall (or use IIFE with `var`)

---

## 📚 Practice Tips

1. Convert regular functions to arrow functions (and vice versa)
2. Create closures for private variables and state management
3. Implement your own `map`, `filter`, `reduce`
4. Practice currying with multi-parameter functions
5. Build utility functions using composition/pipe
6. Understand `this` binding in different contexts
7. Solve recursion problems (factorial, Fibonacci, tree traversal)
8. Implement memoization for expensive computations

---

**Previous Topic:** Asynchronous JavaScript  
**Next Topic:** Prototypes & Inheritance
