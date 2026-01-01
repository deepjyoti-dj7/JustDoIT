# Object-Oriented JavaScript

## Overview
Master object-oriented programming in JavaScript using both classical OOP patterns and JavaScript's prototype-based system. Learn ES6 classes, inheritance, encapsulation, polymorphism, and how JavaScript's unique `this` keyword works.

---

## Topics Covered

### 1. Objects & Properties
**What you'll learn:**
- Creating objects with literals, constructors, and Object.create()
- Property descriptors (writable, enumerable, configurable)
- Adding, modifying, and deleting properties
- Property getters and setters
- Object.defineProperty() and Object.freeze()

**Key takeaway:** JavaScript objects are dynamic collections of properties that can be modified at runtime.

---

### 2. `this` Keyword
**What you'll learn:**
- How `this` is determined by call-site, not definition
- Four binding rules: default, implicit, explicit, new
- call(), apply(), and bind() methods
- Arrow functions and lexical `this`
- Common `this` pitfalls and solutions

**Key takeaway:** `this` refers to the object calling the function, not where the function is defined.

---

### 3. Classes & Constructors
**What you'll learn:**
- ES6 class syntax and sugar over prototypes
- Constructor method for initialization
- Instance methods and properties
- Static methods and properties
- Private fields with `#` prefix
- When to use classes vs factory functions

**Key takeaway:** ES6 classes provide cleaner syntax for creating objects and inheritance, but are still prototype-based under the hood.

---

### 4. Inheritance
**What you'll learn:**
- `extends` keyword for class inheritance
- `super()` to call parent constructor
- Method overriding and super.method()
- Prototype chain traversal
- Multiple levels of inheritance
- Composition vs inheritance

**Key takeaway:** Use `extends` for inheritance and always call `super()` in child constructors before using `this`.

---

### 5. Encapsulation
**What you'll learn:**
- Public, private, and protected members
- Private fields (#) and methods
- Closures for data privacy
- WeakMap for private data
- Getters and setters for controlled access

**Key takeaway:** Use `#` for truly private fields or closures/WeakMaps for privacy in older code.

---

### 6. Polymorphism
**What you'll learn:**
- Method overriding in subclasses
- Duck typing ("if it quacks like a duck...")
- Interface-like patterns with duck typing
- Runtime polymorphism
- Type checking with instanceof

**Key takeaway:** JavaScript uses duck typing - objects are judged by their behavior, not their type.

---

### 7. Static Methods
**What you'll learn:**
- Defining static methods with `static` keyword
- Calling static methods on the class, not instances
- Use cases (utility functions, factory methods)
- Static vs instance methods
- Static initialization blocks

**Key takeaway:** Static methods belong to the class itself and are called without creating an instance.

---

### 8. Getters & Setters
**What you'll learn:**
- Defining getters with `get` keyword
- Defining setters with `set` keyword
- Computed properties
- Validation in setters
- Private backing fields
- Object.defineProperty() for dynamic getters/setters

**Key takeaway:** Getters and setters provide controlled access to properties with computed values or validation.

---

## Quick Reference

```javascript
// ===== CLASSES =====
class Person {
  #ssn;  // Private field
  
  constructor(name, ssn) {
    this.name = name;
    this.#ssn = ssn;
  }
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
  
  get maskedSSN() {
    return `***-**-${this.#ssn.slice(-4)}`;
  }
  
  static species() {
    return 'Homo sapiens';
  }
}

// ===== INHERITANCE =====
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  speak() {
    return `${super.speak()}. ${this.name} barks!`;
  }
}

// ===== THIS BINDING =====
const obj = { name: 'Object', greet() { console.log(this.name); } };
obj.greet();              // 'Object'

const fn = obj.greet;
fn();                     // undefined (lost this)
fn.call(obj);            // 'Object'

// ===== ENCAPSULATION =====
class BankAccount {
  #balance = 0;
  
  deposit(amount) { this.#balance += amount; }
  getBalance() { return this.#balance; }
}
```

---

## Common Pitfalls

1. **Forgetting `super()` in child constructor**
2. **Lost `this` context when passing methods**
3. **Arrow functions as object methods (no `this`)**
4. **Accessing private fields outside class**
5. **Calling static methods on instances**

---

## Best Practices

✅ **Use ES6 classes for cleaner, more readable OOP code**  
✅ **Always call `super()` first in child constructors**  
✅ **Use `#` for truly private fields in modern JavaScript**  
✅ **Prefer composition over inheritance when possible**  
✅ **Use getters/setters for computed properties and validation**  
✅ **Bind methods or use arrow functions to preserve `this` context**  
✅ **Use static methods for utility functions**  
✅ **Avoid deep inheritance hierarchies (max 2-3 levels)**

---

## Learning Path

1. **Understand objects and properties** (1 hour)
2. **Master the `this` keyword** (1-2 hours)
3. **Learn ES6 class syntax** (1 hour)
4. **Practice inheritance with extends** (1 hour)
5. **Implement encapsulation with private fields** (1 hour)
6. **Apply polymorphism patterns** (1 hour)
7. **Work with static methods and getters/setters** (1 hour)

**Total time: 7-9 hours**

---

**Next**: Move to **04. Asynchronous JavaScript** to master callbacks, promises, and async/await
