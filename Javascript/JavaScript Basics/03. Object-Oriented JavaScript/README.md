# Object-Oriented JavaScript - Quick Summary & Interview Guide

## 📋 Quick Notes

### 1. Classes & Objects

**ES6 Class Syntax:**
```javascript
class Person {
  // Constructor
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Instance method
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  // Static method
  static species() {
    return 'Homo sapiens';
  }
}

const john = new Person('John', 30);
john.greet();              // "Hello, I'm John"
Person.species();          // "Homo sapiens"
```

**Private Fields (#):**
```javascript
class BankAccount {
  #balance = 0;  // Private field
  
  deposit(amount) {
    this.#balance += amount;
  }
  
  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount();
account.deposit(100);
account.getBalance();     // 100
account.#balance;         // SyntaxError
```

---

### 2. Inheritance

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);        // Call parent constructor
    this.breed = breed;
  }
  
  speak() {
    return `${super.speak()}. ${this.name} barks!`;
  }
  
  fetch() {
    return `${this.name} fetches`;
  }
}

const dog = new Dog('Rex', 'German Shepherd');
dog.speak();    // "Rex makes a sound. Rex barks!"
dog.fetch();    // "Rex fetches"
```

---

### 3. Getters & Setters

```javascript
class User {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  
  // Getter
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  
  // Setter
  set fullName(name) {
    [this.firstName, this.lastName] = name.split(' ');
  }
}

const user = new User('John', 'Doe');
console.log(user.fullName);  // "John Doe" (getter)
user.fullName = 'Jane Smith'; // (setter)
console.log(user.firstName);  // "Jane"
```

---

### 4. `this` Keyword

**Binding Rules:**
```javascript
// 1. Default binding (global object or undefined in strict mode)
function test() {
  console.log(this);  // window (or undefined in strict mode)
}

// 2. Implicit binding (object calling the method)
const obj = {
  name: 'Object',
  greet() {
    console.log(this.name);  // 'Object'
  }
};
obj.greet();

// 3. Explicit binding (call, apply, bind)
function greet() {
  console.log(this.name);
}
const person = { name: 'John' };
greet.call(person);        // 'John'
greet.apply(person);       // 'John'
const bound = greet.bind(person);
bound();                   // 'John'

// 4. new binding
function Person(name) {
  this.name = name;
}
const p = new Person('John');  // this = new object

// Arrow functions - lexical this
const obj = {
  name: 'Object',
  delayedGreet() {
    setTimeout(() => {
      console.log(this.name);  // 'Object' (inherits this)
    }, 100);
  }
};
```

---

### 5. Prototypes

```javascript
// Constructor function
function Person(name) {
  this.name = name;
}

// Add method to prototype
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const john = new Person('John');
john.greet();  // "Hello, I'm John"

// Prototype chain
console.log(john.__proto__ === Person.prototype);  // true
console.log(Person.prototype.__proto__ === Object.prototype);  // true

// Object.create()
const animal = {
  eat() {
    console.log('Eating');
  }
};

const dog = Object.create(animal);
dog.bark = function() {
  console.log('Barking');
};

dog.eat();   // 'Eating' (from prototype)
dog.bark();  // 'Barking' (own property)
```

---

### 6. Encapsulation

**Using Closures:**
```javascript
function createCounter() {
  let count = 0;  // Private variable
  
  return {
    increment() {
      count++;
    },
    decrement() {
      count--;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
counter.increment();
console.log(counter.getCount());  // 1
console.log(counter.count);       // undefined (private)
```

**Using WeakMap:**
```javascript
const privateData = new WeakMap();

class Person {
  constructor(name, ssn) {
    this.name = name;
    privateData.set(this, { ssn });
  }
  
  getSSN() {
    return privateData.get(this).ssn;
  }
}
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between `class` and constructor function?

**Answer:**
ES6 classes are syntactic sugar over constructor functions, but with some differences:

```javascript
// Constructor function (old way)
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};

// ES6 Class (new way)
class Person {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

// Both create objects the same way
const p1 = new Person('John');

// Key differences:
// 1. Classes must be called with 'new'
Person();  // TypeError (class)
Person();  // Works (constructor function, creates global vars)

// 2. Class methods are non-enumerable
for (let key in p1) {
  console.log(key);  
}
// Constructor: logs 'name' and 'greet'
// Class: only logs 'name'

// 3. Classes are always in strict mode
class StrictClass {
  method() {
    console.log(this);  // undefined if called without context
  }
}

// 4. Classes can't be hoisted
const p = new Person();  // Works with constructor function
class Person {}          // ReferenceError with class

// 5. Classes support extends/super easily
class Dog extends Animal { }  // Clean
// Constructor function inheritance is complex
```

**Recommendation:** Use classes for cleaner, more readable code.

---

### Q2: How does `this` work in JavaScript?

**Answer:**
`this` is determined by **how a function is called**, not where it's defined.

**Four binding rules:**

```javascript
// 1. DEFAULT BINDING (standalone function call)
function test() {
  console.log(this);
}
test();  // window (or undefined in strict mode)

// 2. IMPLICIT BINDING (method call)
const obj = {
  name: 'Object',
  greet() {
    console.log(this.name);
  }
};
obj.greet();  // 'Object' (this = obj)

// Lost implicit binding
const fn = obj.greet;
fn();  // undefined (this = window/undefined)

// 3. EXPLICIT BINDING (call/apply/bind)
function greet() {
  console.log(this.name);
}
const person = { name: 'John' };

greet.call(person);   // 'John'
greet.apply(person);  // 'John'

const bound = greet.bind(person);
bound();  // 'John' (permanently bound)

// 4. NEW BINDING (constructor)
function Person(name) {
  this.name = name;  // this = new empty object
}
const p = new Person('John');  // this = p

// ARROW FUNCTIONS - lexical this (no own this)
const obj = {
  name: 'Object',
  regularMethod() {
    setTimeout(function() {
      console.log(this.name);  // undefined (lost this)
    }, 100);
  },
  arrowMethod() {
    setTimeout(() => {
      console.log(this.name);  // 'Object' (inherits this)
    }, 100);
  }
};
```

**Priority:** new > explicit (bind) > implicit > default

---

### Q3: What are prototypes? How does the prototype chain work?

**Answer:**
Every JavaScript object has an internal link to another object called its **prototype**. The prototype chain is how JavaScript implements inheritance.

```javascript
// Every object has __proto__
const obj = {};
console.log(obj.__proto__ === Object.prototype);  // true

// Constructor functions have prototype property
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};

const john = new Person('John');

// Prototype chain
console.log(john.__proto__ === Person.prototype);  // true
console.log(Person.prototype.__proto__ === Object.prototype);  // true
console.log(Object.prototype.__proto__);  // null (end of chain)

// Property lookup
john.greet();  
// 1. Check john object - not found
// 2. Check john.__proto__ (Person.prototype) - found!
// 3. Execute Person.prototype.greet

john.toString();
// 1. Check john - not found
// 2. Check Person.prototype - not found
// 3. Check Object.prototype - found!

// Prototype chain: john → Person.prototype → Object.prototype → null

// Adding to prototype affects all instances
Person.prototype.sayBye = function() {
  return `Bye, ${this.name}`;
};

john.sayBye();  // "Bye, John" (inherited)

// Own property vs inherited
console.log(john.hasOwnProperty('name'));   // true
console.log(john.hasOwnProperty('greet'));  // false (inherited)

// Object.create() sets prototype
const animal = {
  eat() { console.log('Eating'); }
};

const dog = Object.create(animal);
dog.bark = function() { console.log('Barking'); };

dog.eat();   // 'Eating' (from prototype)
dog.bark();  // 'Barking' (own property)

console.log(dog.__proto__ === animal);  // true
```

**Key points:**
- `__proto__`: Object's prototype link (actual link)
- `prototype`: Property on constructor functions (template for instances)
- Prototype chain enables inheritance
- Property lookup goes up the chain until found or reaches `null`

---

### Q4: What's the difference between `call`, `apply`, and `bind`?

**Answer:**
All three explicitly set `this`, but differ in usage:

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'John' };

// CALL - arguments individually
greet.call(person, 'Hello', '!');  // "Hello, John!"

// APPLY - arguments as array
greet.apply(person, ['Hello', '!']);  // "Hello, John!"

// BIND - returns new function with bound this
const boundGreet = greet.bind(person);
boundGreet('Hello', '!');  // "Hello, John!"

// Partial application with bind
const sayHello = greet.bind(person, 'Hello');
sayHello('!');   // "Hello, John!"
sayHello('?');   // "Hello, John?"

// Real-world examples

// 1. Borrowing methods
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.apply(null, numbers);  // 7
// Modern: Math.max(...numbers)

// 2. Converting array-like to array
function test() {
  const args = Array.prototype.slice.call(arguments);
  // Modern: Array.from(arguments) or [...arguments]
}

// 3. Event handlers with this
class Button {
  constructor(label) {
    this.label = label;
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    console.log(`${this.label} clicked`);
  }
  
  render() {
    element.addEventListener('click', this.handleClick);
  }
}

// 4. Function composition
function add(a, b) {
  return a + b;
}

const add5 = add.bind(null, 5);  // Partial application
add5(3);  // 8
```

**Differences:**
- **call**: Invokes immediately, args individually
- **apply**: Invokes immediately, args as array
- **bind**: Returns new function, args can be preset

---

### Q5: How do you create private properties in JavaScript?

**Answer:**
Multiple approaches:

**1. Private Fields (# prefix) - Modern:**
```javascript
class Person {
  #ssn;  // Private field
  
  constructor(name, ssn) {
    this.name = name;    // Public
    this.#ssn = ssn;     // Private
  }
  
  getSSN() {
    return this.#ssn.slice(-4);  // Last 4 digits
  }
}

const person = new Person('John', '123-45-6789');
console.log(person.name);     // 'John' ✓
console.log(person.#ssn);     // SyntaxError ✗
console.log(person.getSSN()); // '6789' ✓
```

**2. Closures - Classic:**
```javascript
function createPerson(name, ssn) {
  // Private variables
  let _ssn = ssn;
  
  // Public interface
  return {
    name,  // Public
    getSSN() {
      return _ssn.slice(-4);
    }
  };
}

const person = createPerson('John', '123-45-6789');
console.log(person.name);     // 'John'
console.log(person._ssn);     // undefined (private)
console.log(person.getSSN()); // '6789'
```

**3. WeakMap - Advanced:**
```javascript
const privateData = new WeakMap();

class Person {
  constructor(name, ssn) {
    this.name = name;
    privateData.set(this, { ssn });
  }
  
  getSSN() {
    return privateData.get(this).ssn.slice(-4);
  }
}

const person = new Person('John', '123-45-6789');
console.log(person.getSSN());  // '6789'
// privateData is only accessible within this scope
```

**4. Naming Convention (_ prefix) - By convention only:**
```javascript
class Person {
  constructor(name, ssn) {
    this.name = name;
    this._ssn = ssn;  // "Private" by convention
  }
  
  getSSN() {
    return this._ssn.slice(-4);
  }
}

// Still accessible, just conventionally private
const person = new Person('John', '123-45-6789');
console.log(person._ssn);  // '123-45-6789' (not truly private)
```

**Recommendation:** Use `#` private fields in modern code.

---

### Q6: What's the difference between `extends` and `Object.create()`?

**Answer:**
Both implement inheritance but differently:

**`extends` (ES6 classes):**
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // Call parent constructor
    this.breed = breed;
  }
  
  speak() {
    return `${super.speak()}. ${this.name} barks!`;
  }
}

const dog = new Dog('Rex', 'German Shepherd');
console.log(dog.speak());  // "Rex makes a sound. Rex barks!"
console.log(dog instanceof Dog);     // true
console.log(dog instanceof Animal);  // true
```

**`Object.create()` (Prototypal inheritance):**
```javascript
const animal = {
  speak() {
    return `${this.name} makes a sound`;
  }
};

const dog = Object.create(animal);
dog.name = 'Rex';
dog.breed = 'German Shepherd';
dog.bark = function() {
  return `${this.speak()}. ${this.name} barks!`;
};

console.log(dog.bark());  // "Rex makes a sound. Rex barks!"
console.log(dog instanceof Animal);  // false (no constructor)

// Prototype chain
console.log(dog.__proto__ === animal);  // true
```

**Key Differences:**

| Feature | `extends` | `Object.create()` |
|---------|-----------|-------------------|
| Syntax | Class-based | Object-based |
| Constructor | Requires `super()` | No constructor |
| `instanceof` | Works | Doesn't work |
| Static methods | Inherited | Not inherited |
| Use case | Class hierarchies | Simple object delegation |

**Example combining both:**
```javascript
// Factory function with Object.create
function createAnimal(name) {
  return Object.create(animal, {
    name: { value: name, writable: true }
  });
}

const cat = createAnimal('Whiskers');
```

---

### Q7: Explain polymorphism in JavaScript.

**Answer:**
Polymorphism means "many forms" - same interface, different implementations.

**Method Overriding:**
```javascript
class Shape {
  area() {
    throw new Error('Must implement area()');
  }
  
  describe() {
    return `Area: ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  
  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  area() {
    return this.width * this.height;
  }
}

// Polymorphic function - works with any shape
function printArea(shape) {
  console.log(shape.describe());  // Calls appropriate area()
}

printArea(new Circle(5));         // "Area: 78.54"
printArea(new Rectangle(4, 6));   // "Area: 24"

// Array of different shapes
const shapes = [
  new Circle(3),
  new Rectangle(4, 5),
  new Circle(2)
];

shapes.forEach(shape => printArea(shape));
```

**Duck Typing:**
```javascript
// "If it walks like a duck and quacks like a duck, it's a duck"

function makeItFly(flyable) {
  if (typeof flyable.fly === 'function') {
    flyable.fly();
  }
}

const bird = {
  fly() { console.log('Bird flying'); }
};

const plane = {
  fly() { console.log('Plane flying'); }
};

const car = {
  drive() { console.log('Car driving'); }
};

makeItFly(bird);   // "Bird flying"
makeItFly(plane);  // "Plane flying"
makeItFly(car);    // (nothing - no fly method)

// Real-world example - array-like objects
function processArrayLike(obj) {
  if (obj.length !== undefined && typeof obj.forEach === 'function') {
    obj.forEach(item => console.log(item));
  }
}

processArrayLike([1, 2, 3]);           // Works
processArrayLike('hello');             // Works (string has length)
processArrayLike({ length: 3 });       // Doesn't work (no forEach)
```

---

### Q8: What happens when you call a class without `new`?

**Answer:**
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
}

// Without new
Person('John');  // TypeError: Class constructor Person cannot be invoked without 'new'

// With new
const p = new Person('John');  // ✓ Works

// Constructor function (old way) - no error, but creates global
function PersonOld(name) {
  this.name = name;
}

PersonOld('John');  // Creates global variable 'name' ⚠️
console.log(window.name);  // 'John'

// Safe constructor function
function PersonSafe(name) {
  if (!(this instanceof PersonSafe)) {
    return new PersonSafe(name);
  }
  this.name = name;
}

const p1 = PersonSafe('John');      // ✓ Auto-corrects
const p2 = new PersonSafe('Jane');  // ✓ Works normally
```

---

### Q9: What's the output?

```javascript
class Parent {
  constructor() {
    this.name = 'Parent';
  }
  
  greet() {
    console.log(`Hello from ${this.name}`);
  }
}

class Child extends Parent {
  constructor() {
    this.name = 'Child';
    super();
  }
}

const child = new Child();
child.greet();
```

**Answer:**
```javascript
// ReferenceError: Must call super constructor in derived class before accessing 'this'

// Explanation:
// In a derived class, you MUST call super() BEFORE accessing 'this'

// Correct version:
class Child extends Parent {
  constructor() {
    super();           // Call parent first
    this.name = 'Child';  // Then modify this
  }
}

const child = new Child();
child.greet();  // "Hello from Child"
```

---

### Q10: Explain static methods and when to use them.

**Answer:**
Static methods belong to the class itself, not instances.

```javascript
class MathUtil {
  // Static method
  static add(a, b) {
    return a + b;
  }
  
  // Instance method
  multiply(a, b) {
    return a * b;
  }
}

// Call on class
MathUtil.add(5, 3);  // 8 ✓

// Can't call on instance
const util = new MathUtil();
util.add(5, 3);      // TypeError: util.add is not a function ✗
util.multiply(5, 3); // 15 ✓

// Real-world examples

// 1. Factory methods
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
  
  static createAdmin(name) {
    return new User(name, 'admin');
  }
  
  static createGuest(name) {
    return new User(name, 'guest');
  }
}

const admin = User.createAdmin('John');
const guest = User.createGuest('Jane');

// 2. Utility functions
class StringUtil {
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  static reverse(str) {
    return str.split('').reverse().join('');
  }
}

StringUtil.capitalize('hello');  // "Hello"
StringUtil.reverse('hello');     // "olleh"

// 3. Counters/tracking
class Database {
  static connections = 0;
  
  constructor() {
    Database.connections++;
  }
  
  static getConnectionCount() {
    return Database.connections;
  }
}

new Database();
new Database();
console.log(Database.getConnectionCount());  // 2

// 4. Validation
class Validator {
  static isEmail(str) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
  }
  
  static isURL(str) {
    return /^https?:\/\/.+/.test(str);
  }
}

Validator.isEmail('test@example.com');  // true
```

**Use static methods for:**
- Factory functions
- Utility functions
- Operations that don't need instance state
- Class-level counters or configs

---

## 🎓 Key Takeaways

✅ Use ES6 classes for cleaner OOP code  
✅ Always call `super()` before using `this` in child classes  
✅ Use `#` for true private fields in modern JavaScript  
✅ `this` is determined by call-site, not definition  
✅ Arrow functions inherit `this` (no own `this`)  
✅ Prototype chain enables inheritance in JavaScript  
✅ Static methods belong to class, not instances  
✅ Use `extends` for class inheritance, `Object.create()` for prototypal  
✅ Polymorphism via method overriding and duck typing  
✅ `call`/`apply` invoke immediately, `bind` returns new function

---

## 📚 Practice Tips

1. Build a class hierarchy (Animal → Dog/Cat → Specific breeds)
2. Practice `this` binding in different contexts
3. Create utility classes with static methods
4. Implement private data with different approaches
5. Use getters/setters for computed properties

---

**Next Topic:** Asynchronous JavaScript (Promises, Async/Await, Event Loop)
