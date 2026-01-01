# JavaScript Fundamentals - Quick Summary & Interview Guide

## 📋 Quick Notes

### 1. Variables & Data Types

**Variable Declarations:**
```javascript
const PI = 3.14;      // Cannot reassign (use by default)
let count = 0;        // Can reassign (use when needed)
var old = 1;          // Function-scoped (avoid - legacy)
```

**8 Data Types:**
- **7 Primitives:** `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
- **1 Reference:** `object` (includes arrays, functions)

**Type Checking:**
```javascript
typeof "hello"        // "string"
typeof 42             // "number"
typeof true           // "boolean"
typeof undefined      // "undefined"
typeof null           // "object" ⚠️ (bug)
typeof Symbol()       // "symbol"
typeof 123n           // "bigint"
typeof {}             // "object"
```

---

### 2. Type Coercion

**Implicit Coercion:**
```javascript
"5" + 3               // "53" (string concatenation)
"5" - 3               // 2 (numeric subtraction)
"5" * "2"             // 10 (both converted to numbers)
true + 1              // 2 (true → 1)
false + 1             // 1 (false → 0)
```

**Explicit Coercion:**
```javascript
String(123)           // "123"
Number("456")         // 456
Boolean(1)            // true
parseInt("42px")      // 42
parseFloat("3.14")    // 3.14
```

**Falsy Values (only 6):**
```javascript
false, 0, -0, 0n, "", null, undefined, NaN
// Everything else is truthy!
```

**Equality:**
```javascript
5 == "5"              // true (loose, with coercion)
5 === "5"             // false (strict, no coercion) ✓ Use this
```

---

### 3. Operators

**Arithmetic:**
```javascript
10 + 5                // 15 (addition)
10 - 5                // 5 (subtraction)
10 * 5                // 50 (multiplication)
10 / 5                // 2 (division)
10 % 3                // 1 (remainder/modulo)
2 ** 3                // 8 (exponentiation)
```

**Comparison:**
```javascript
5 === 5               // true (strict equal)
5 !== "5"             // true (strict not equal)
5 > 3                 // true
5 >= 5                // true
```

**Logical:**
```javascript
true && false         // false (AND)
true || false         // true (OR)
!true                 // false (NOT)
```

**Nullish Coalescing & Optional Chaining:**
```javascript
null ?? "default"     // "default"
0 ?? "default"        // 0 (only null/undefined trigger ??)
user?.address?.city   // Safe navigation (no error if undefined)
```

**Assignment:**
```javascript
x += 5                // x = x + 5
x ||= 10              // x = x || 10 (assign if falsy)
x ??= 10              // x = x ?? 10 (assign if null/undefined)
```

---

### 4. Conditionals

**if-else:**
```javascript
if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teen");
} else {
  console.log("Child");
}
```

**Ternary:**
```javascript
const status = age >= 18 ? "Adult" : "Minor";
```

**Switch:**
```javascript
switch (day) {
  case "Mon":
  case "Tue":
    console.log("Weekday");
    break;
  case "Sat":
  case "Sun":
    console.log("Weekend");
    break;
  default:
    console.log("Invalid");
}
```

---

### 5. Loops

**for Loop:**
```javascript
for (let i = 0; i < 5; i++) {
  console.log(i);     // 0, 1, 2, 3, 4
}
```

**while Loop:**
```javascript
let i = 0;
while (i < 5) {
  console.log(i++);
}
```

**do-while Loop:**
```javascript
let i = 0;
do {
  console.log(i++);
} while (i < 5);
```

**for...of (iterate values):**
```javascript
for (const item of [1, 2, 3]) {
  console.log(item);  // 1, 2, 3
}
```

**for...in (iterate keys):**
```javascript
for (const key in {a: 1, b: 2}) {
  console.log(key);   // "a", "b"
}
```

**break & continue:**
```javascript
for (let i = 0; i < 10; i++) {
  if (i === 5) break;     // Exit loop
  if (i === 2) continue;  // Skip iteration
  console.log(i);         // 0, 1, 3, 4
}
```

---

### 6. Strict Mode

**Enable:**
```javascript
"use strict";         // At top of file or function

// Catches errors:
x = 10;               // ReferenceError (no declaration)
delete Object.prototype; // TypeError (can't delete)

// ES6 modules are automatically strict
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between `var`, `let`, and `const`?

**Answer:**
- **`var`**: Function-scoped, hoisted (initialized as `undefined`), can be redeclared
- **`let`**: Block-scoped, hoisted but not initialized (TDZ), cannot be redeclared
- **`const`**: Block-scoped, hoisted but not initialized (TDZ), cannot be reassigned

```javascript
// var - function scoped
function test() {
  if (true) {
    var x = 10;
  }
  console.log(x);  // 10 (accessible outside block)
}

// let - block scoped
function test() {
  if (true) {
    let y = 10;
  }
  console.log(y);  // ReferenceError
}

// const - cannot reassign
const obj = { a: 1 };
obj.a = 2;        // ✓ OK (modifying property)
obj = {};         // ✗ Error (reassigning variable)
```

**Best Practice:** Use `const` by default, `let` when reassignment needed, never use `var`.

---

### Q2: What are all the data types in JavaScript?

**Answer:**
**7 Primitives:**
1. `string` - text: `"hello"`
2. `number` - integers & floats: `42`, `3.14`
3. `boolean` - true/false: `true`
4. `null` - intentional absence: `null`
5. `undefined` - uninitialized: `undefined`
6. `symbol` - unique identifier: `Symbol("id")`
7. `bigint` - large integers: `123n`

**1 Reference Type:**
8. `object` - collections: `{}`, `[]`, functions

```javascript
typeof "hello"        // "string"
typeof 42             // "number"
typeof true           // "boolean"
typeof null           // "object" ⚠️ (known bug!)
typeof undefined      // "undefined"
typeof Symbol()       // "symbol"
typeof 123n           // "bigint"
typeof {}             // "object"
```

---

### Q3: Why does `typeof null` return "object"?

**Answer:**
It's a **bug from JavaScript's first implementation** that can't be fixed for backward compatibility. In the original implementation, values were represented by a type tag and a value. Objects had a type tag of 0, and `null` was represented as the NULL pointer (0x00), so it got the object type tag.

**Safe null check:**
```javascript
const value = null;
typeof value === "object"                  // true (misleading)
value === null                             // true (correct)
typeof value === "object" && value !== null // false (safe object check)
```

---

### Q4: What's the difference between `==` and `===`?

**Answer:**
- **`==` (loose equality)**: Compares values after type coercion
- **`===` (strict equality)**: Compares both value AND type, no coercion

```javascript
// Loose equality (==) - with coercion
5 == "5"              // true (string coerced to number)
0 == false            // true (both coerced to 0)
"" == false           // true
null == undefined     // true (special case)

// Strict equality (===) - no coercion
5 === "5"             // false (different types)
0 === false           // false (number vs boolean)
"" === false          // false
null === undefined    // false

// Always prefer ===
```

---

### Q5: What are falsy values in JavaScript?

**Answer:**
There are exactly **6 falsy values**. Everything else is truthy:

```javascript
// Falsy values:
false
0
-0
0n          // BigInt zero
""          // empty string
null
undefined
NaN

// Common truthy surprises:
"0"         // truthy (non-empty string)
"false"     // truthy (non-empty string)
[]          // truthy (empty array is an object)
{}          // truthy (empty object)
function(){} // truthy
```

**Usage:**
```javascript
if ("0") {              // ✓ Runs ("0" is truthy)
  console.log("true");
}

if (0) {                // ✗ Doesn't run (0 is falsy)
  console.log("never");
}

// Practical:
const name = userName || "Guest";  // Default if falsy
```

---

### Q6: Explain type coercion with examples.

**Answer:**
Type coercion is automatic or explicit conversion of values between different types.

**Implicit Coercion:**
```javascript
// String coercion (+ with string)
"5" + 3               // "53" (number → string)
"Hello" + true        // "Hellotrue"

// Number coercion (-, *, /, %)
"5" - 3               // 2 (string → number)
"10" * "2"            // 20 (both → numbers)
"20" / "4"            // 5

// Boolean coercion (in conditions)
if ("hello") {}       // "hello" → true
if (0) {}             // 0 → false

// Weird coercions
[] + []               // "" (empty string)
[] + {}               // "[object Object]"
{} + []               // 0 (in some contexts)
```

**Explicit Coercion:**
```javascript
String(123)           // "123"
Number("456")         // 456
Boolean(1)            // true
parseInt("42px")      // 42 (stops at non-digit)
parseFloat("3.14")    // 3.14
```

---

### Q7: What's the difference between `||` and `??`?

**Answer:**
- **`||`**: Returns right side if left is **any falsy value**
- **`??`**: Returns right side only if left is **null or undefined**

```javascript
// || treats 0, "", false as "missing"
const port1 = 0 || 3000;              // 3000 ⚠️ (0 is falsy)
const name1 = "" || "Guest";          // "Guest" ⚠️ ("" is falsy)
const flag1 = false || true;          // true ⚠️ (false is falsy)

// ?? only treats null/undefined as "missing"
const port2 = 0 ?? 3000;              // 0 ✓ (correct!)
const name2 = "" ?? "Guest";          // "" ✓ (correct!)
const flag2 = false ?? true;          // false ✓ (correct!)
const value = null ?? "default";      // "default"
const value2 = undefined ?? "default"; // "default"

// Use ?? when 0, "", false are valid values
const config = {
  port: userPort ?? 3000,     // 0 is valid port
  name: userName ?? "Guest",  // "" is valid name
  debug: userDebug ?? false   // false is valid flag
};
```

---

### Q8: How does short-circuit evaluation work?

**Answer:**
JavaScript stops evaluating logical expressions as soon as the result is determined.

**AND (&&):**
```javascript
// Stops at first falsy value
true && false && console.log("Never runs");  // false
true && true && console.log("Runs");         // "Runs"

// Practical use
isLoggedIn && showDashboard();  // Only calls if true
user && user.profile && user.profile.name;  // Safe access
```

**OR (||):**
```javascript
// Stops at first truthy value
false || true || console.log("Never runs");  // true
false || false || console.log("Runs");       // "Runs"

// Practical use
const name = user.name || "Guest";
const port = process.env.PORT || 3000;
```

---

### Q9: When should you use `switch` vs `if-else`?

**Answer:**
- **Use `switch`**: Multiple exact value comparisons on same variable
- **Use `if-else`**: Complex conditions, ranges, different variables

```javascript
// ✓ Good use of switch
switch (status) {
  case "pending":
    handlePending();
    break;
  case "approved":
    handleApproved();
    break;
  case "rejected":
    handleRejected();
    break;
  default:
    handleUnknown();
}

// ✓ Better as if-else (ranges, complex conditions)
if (age < 13) {
  category = "child";
} else if (age < 20) {
  category = "teen";
} else if (age < 60 && isEmployed) {
  category = "working adult";
} else {
  category = "senior";
}
```

---

### Q10: What happens if you forget `break` in switch?

**Answer:**
**Fall-through** occurs - execution continues to next case regardless of match.

```javascript
const day = "Monday";
switch (day) {
  case "Monday":
    console.log("Start of week");
    // Missing break!
  case "Tuesday":
    console.log("Second day");
    break;
}
// Output:
// "Start of week"
// "Second day"  ⚠️ Both execute!

// Fall-through can be intentional:
switch (day) {
  case "Saturday":
  case "Sunday":
    console.log("Weekend!");
    break;  // Handle both cases the same
  case "Monday":
  case "Tuesday":
  case "Wednesday":
  case "Thursday":
  case "Friday":
    console.log("Weekday!");
    break;
}
```

---

### Q11: What's the difference between `for...in` and `for...of`?

**Answer:**
- **`for...in`**: Iterates over **enumerable property keys** (use for objects)
- **`for...of`**: Iterates over **iterable values** (use for arrays)

```javascript
const arr = ["a", "b", "c"];
const obj = { x: 1, y: 2, z: 3 };

// for...in - gets keys/indices
for (const key in arr) {
  console.log(key);      // "0", "1", "2" (indices as strings)
}

for (const key in obj) {
  console.log(key);      // "x", "y", "z"
}

// for...of - gets values
for (const value of arr) {
  console.log(value);    // "a", "b", "c"
}

for (const value of obj) {  // ✗ TypeError: obj is not iterable
}

// Best practice:
// Arrays/iterables: use for...of
// Objects: use for...in or Object.keys/values/entries
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
```

---

### Q12: How do `break` and `continue` differ?

**Answer:**
- **`break`**: Exits the loop entirely
- **`continue`**: Skips current iteration, continues with next

```javascript
// break - exit loop
for (let i = 0; i < 10; i++) {
  if (i === 5) break;
  console.log(i);  // 0, 1, 2, 3, 4
}
console.log("After loop");

// continue - skip iteration
for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  console.log(i);  // 0, 1, 3, 4 (skips 2)
}

// Practical use
const users = [/* ... */];
for (const user of users) {
  if (!user.isActive) continue;  // Skip inactive
  if (user.age < 18) continue;   // Skip minors
  processUser(user);  // Only active adults
}

// Search pattern
for (const item of items) {
  if (item.id === targetId) {
    found = item;
    break;  // Stop searching
  }
}
```

---

### Q13: What is strict mode and why use it?

**Answer:**
Strict mode is JavaScript's restricted variant that:
- Catches common coding errors
- Prevents unsafe actions
- Disables confusing features
- Can improve performance

**Enable:**
```javascript
"use strict";  // At top of file or function

// Benefits:
x = 10;  // ReferenceError (must declare variable)

function sum(a, a) {  // SyntaxError (duplicate params)
  return a + a;
}

delete Object.prototype;  // TypeError (can't delete)

function test() {
  console.log(this);  // undefined (not global object)
}
test();

// Prevents accidental globals
function leak() {
  "use strict";
  leakedVar = "oops";  // ReferenceError
}

// ES6 modules are automatically strict
```

---

### Q14: Predict the output:

```javascript
console.log(typeof typeof 1);
```

**Answer:**
```javascript
typeof typeof 1  // "string"

// Explanation:
// Step 1: typeof 1 = "number"
// Step 2: typeof "number" = "string"
// typeof ALWAYS returns a string!
```

---

### Q15: What will this print?

```javascript
var a = 1;
function test() {
  console.log(a);
  var a = 2;
  console.log(a);
}
test();
```

**Answer:**
```javascript
// Output:
undefined
2

// Explanation (hoisting):
function test() {
  var a;              // Declaration hoisted to top
  console.log(a);     // undefined (declared but not assigned)
  a = 2;              // Assignment stays in place
  console.log(a);     // 2
}

// With let (Temporal Dead Zone):
function test() {
  console.log(a);     // ReferenceError (TDZ)
  let a = 2;
}
```

---

### Q16: Explain this output:

```javascript
console.log(1 < 2 < 3);
console.log(3 > 2 > 1);
```

**Answer:**
```javascript
1 < 2 < 3    // true
3 > 2 > 1    // false

// Explanation (left-to-right evaluation):
// 1 < 2 < 3
// (1 < 2) < 3      // true < 3
// true < 3         // 1 < 3 (true coerced to 1)
// true ✓

// 3 > 2 > 1
// (3 > 2) > 1      // true > 1
// true > 1         // 1 > 1 (true coerced to 1)
// false ✗

// Don't chain comparisons in JavaScript!
// Use: 1 < 2 && 2 < 3
```

---

### Q17: Why does `0.1 + 0.2 !== 0.3`?

**Answer:**
**Floating-point precision issue** - JavaScript uses IEEE 754 standard for numbers.

```javascript
0.1 + 0.2             // 0.30000000000000004
0.1 + 0.2 === 0.3     // false

// Solutions:

// 1. Round to fixed decimals
(0.1 + 0.2).toFixed(2)  // "0.30" (string)
parseFloat((0.1 + 0.2).toFixed(2))  // 0.3

// 2. Use epsilon for comparison
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON  // true

// 3. Work with integers (best for money)
const price1 = 10;  // 10 cents
const price2 = 20;  // 20 cents
const total = (price1 + price2) / 100;  // 0.3 dollars

// 4. Use libraries for precise calculations
// decimal.js, big.js, bignumber.js
```

---

### Q18: What's the output?

```javascript
const arr = [1, 2, 3];
arr[10] = 10;
console.log(arr.length);
console.log(arr[5]);
```

**Answer:**
```javascript
arr.length    // 11 (highest index + 1)
arr[5]        // undefined (empty slot)

console.log(arr);
// [1, 2, 3, empty × 7, 10]
// Indices 3-9 are "holes" (not undefined, just empty)

// Behavior with methods:
arr.forEach(x => console.log(x));  // 1, 2, 3, 10 (skips empty)
arr.map(x => x * 2);               // [2, 4, 6, empty × 7, 20]
Array.from(arr);                   // [1, 2, 3, undefined × 7, 10]
```

---

### Q19: Explain object key ordering:

```javascript
const obj = {};
obj.c = 1;
obj[2] = 2;
obj.b = 3;
obj[1] = 4;
obj.a = 5;
console.log(Object.keys(obj));
```

**Answer:**
```javascript
Object.keys(obj)  // ["1", "2", "c", "b", "a"]

// JavaScript orders object keys:
// 1. Integer keys (0, 1, 2...) in ascending order
// 2. String keys in insertion order
// 3. Symbol keys in insertion order

// Breakdown:
// Integer keys: 1, 2 (ascending)
// String keys: c, b, a (insertion order)

const obj2 = { z: 1, a: 2, 5: 3, 1: 4, m: 5 };
Object.keys(obj2);  // ["1", "5", "z", "a", "m"]
```

---

### Q20: What's the difference between `null` and `undefined`?

**Answer:**
- **`undefined`**: Variable declared but not assigned, or missing property
- **`null`**: Intentional absence of value (explicitly set by programmer)

```javascript
// undefined - "I don't have a value yet"
let x;
console.log(x);           // undefined (declared, not assigned)

function test(param) {
  console.log(param);     // undefined (not provided)
}
test();

const obj = { a: 1 };
console.log(obj.b);       // undefined (property doesn't exist)

// null - "I intentionally have no value"
let user = null;          // Explicitly set to "no user"
let response = null;      // Explicitly "no response yet"

// Checking:
if (x === undefined) {}   // Specific check
if (x == null) {}         // Checks both null AND undefined
if (x === null) {}        // Only null

// Type:
typeof undefined          // "undefined"
typeof null               // "object" ⚠️ (bug)

// Best practice:
// Use undefined for uninitialized/missing
// Use null for "intentionally empty"
```

---

## 🎓 Key Takeaways

✅ Use `const` by default, `let` when reassignment needed, never `var`  
✅ Always use `===` instead of `==` to avoid coercion bugs  
✅ Know the 6 falsy values: `false`, `0`, `""`, `null`, `undefined`, `NaN`  
✅ Use `??` instead of `||` for defaults when 0/""/false are valid  
✅ Enable strict mode with `"use strict"` to catch errors  
✅ Use `for...of` for arrays, `for...in` for objects  
✅ Always add `break` in switch cases (unless intentional fall-through)  
✅ `typeof null` returns "object" (known bug)  
✅ JavaScript uses hoisting - declarations moved to top  
✅ Floating-point math is imprecise - use integers for money

---

## 📚 Practice Tips

1. **Type in the console** - Experiment with every example
2. **Predict first, then run** - Guess output before executing
3. **Break things** - Intentionally make mistakes to learn
4. **Build small projects** - Calculator, todo list, quiz app
5. **Review daily** - 15 minutes keeps concepts fresh

---

**Next Topic:** ES6+ Features (Arrow Functions, Destructuring, Spread/Rest)
