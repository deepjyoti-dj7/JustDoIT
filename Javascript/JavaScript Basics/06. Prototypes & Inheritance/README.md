# Prototypes & Inheritance - Quick Summary & Interview Guide

## 📚 Quick Notes

### 1. Prototypes

**Prototype Chain:**
```javascript
// Every object has a prototype
const obj = {};
console.log(obj.__proto__);  // Object.prototype
console.log(obj.__proto__.__proto__);  // null (end of chain)

// Array prototype chain
const arr = [];
console.log(arr.__proto__);  // Array.prototype
console.log(arr.__proto__.__proto__);  // Object.prototype
console.log(arr.__proto__.__proto__.__proto__);  // null

// Function prototype chain
function myFunc() {}
console.log(myFunc.__proto__);  // Function.prototype
console.log(myFunc.__proto__.__proto__);  // Object.prototype
console.log(myFunc.__proto__.__proto__.__proto__);  // null
```

**Constructor Functions:**
```javascript
// Constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Add method to prototype (shared across all instances)
Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

Person.prototype.getAge = function() {
  return this.age;
};

// Create instances
const john = new Person('John', 30);
const jane = new Person('Jane', 25);

john.greet();  // "Hi, I'm John"
jane.greet();  // "Hi, I'm Jane"

// Methods are shared (same reference)
console.log(john.greet === jane.greet);  // true

// Properties are instance-specific
console.log(john.name === jane.name);  // false
```

**Prototype Property vs __proto__:**
```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

const dog = new Animal('Dog');

// Animal.prototype - template for instances
console.log(Animal.prototype);  // { speak: [Function], constructor: Animal }

// dog.__proto__ - points to Animal.prototype
console.log(dog.__proto__ === Animal.prototype);  // true

// Constructor property
console.log(dog.constructor === Animal);  // true
console.log(Animal.prototype.constructor === Animal);  // true
```

---

### 2. Prototypal Inheritance

**Manual Prototype Chain:**
```javascript
// Parent constructor
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  return `${this.name} is eating`;
};

// Child constructor
function Dog(name, breed) {
  Animal.call(this, name);  // Call parent constructor
  this.breed = breed;
}

// Inherit from Animal
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;  // Fix constructor reference

// Add Dog-specific method
Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};

const myDog = new Dog('Buddy', 'Golden Retriever');

myDog.eat();   // "Buddy is eating" (inherited)
myDog.bark();  // "Buddy barks!" (own method)
console.log(myDog.breed);  // "Golden Retriever"

// Prototype chain
console.log(myDog instanceof Dog);     // true
console.log(myDog instanceof Animal);  // true
console.log(myDog instanceof Object);  // true
```

**Object.create():**
```javascript
// Create object with specific prototype
const animal = {
  type: 'Animal',
  describe: function() {
    return `This is a ${this.type}`;
  }
};

// dog inherits from animal
const dog = Object.create(animal);
dog.type = 'Dog';
dog.bark = function() {
  return 'Woof!';
};

dog.describe();  // "This is a Dog" (inherited method)
dog.bark();      // "Woof!" (own method)

// Prototype chain
console.log(dog.__proto__ === animal);  // true

// Create object with null prototype
const noProto = Object.create(null);
console.log(noProto.__proto__);  // undefined
console.log(noProto.toString);   // undefined (no Object.prototype methods)
```

---

### 3. ES6 Classes

**Basic Class Syntax:**
```javascript
class Person {
  // Constructor
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Method (added to prototype)
  greet() {
    return `Hi, I'm ${this.name}`;
  }
  
  // Getter
  get info() {
    return `${this.name} is ${this.age} years old`;
  }
  
  // Setter
  set updateAge(newAge) {
    if (newAge > 0) {
      this.age = newAge;
    }
  }
  
  // Static method (on class itself, not prototype)
  static species() {
    return 'Homo sapiens';
  }
}

const john = new Person('John', 30);

john.greet();  // "Hi, I'm John"
console.log(john.info);  // "John is 30 years old"
john.updateAge = 31;
console.log(john.age);  // 31

// Static method
Person.species();  // "Homo sapiens"
john.species();    // TypeError: john.species is not a function
```

**Class Inheritance:**
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
  
  eat() {
    return `${this.name} is eating`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // Call parent constructor
    this.breed = breed;
  }
  
  // Override parent method
  speak() {
    return `${this.name} barks!`;
  }
  
  // Call parent method
  describe() {
    return `${super.speak()} and is a ${this.breed}`;
  }
}

const myDog = new Dog('Buddy', 'Golden Retriever');

myDog.speak();     // "Buddy barks!" (overridden)
myDog.eat();       // "Buddy is eating" (inherited)
myDog.describe();  // "Buddy makes a sound and is a Golden Retriever"

// Prototype chain
console.log(myDog instanceof Dog);     // true
console.log(myDog instanceof Animal);  // true
console.log(myDog instanceof Object);  // true
```

---

### 4. Private Fields & Methods (ES2022)

**Private Fields:**
```javascript
class BankAccount {
  #balance = 0;  // Private field
  
  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }
  
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      return this.#balance;
    }
  }
  
  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return this.#balance;
    }
    return 'Insufficient funds';
  }
  
  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount('John', 1000);

account.deposit(500);   // 1500
account.withdraw(200);  // 1300
account.getBalance();   // 1300

console.log(account.owner);    // "John"
console.log(account.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class
```

**Private Methods:**
```javascript
class User {
  #password;
  
  constructor(username, password) {
    this.username = username;
    this.#password = this.#hashPassword(password);
  }
  
  // Private method
  #hashPassword(password) {
    return `hashed_${password}`;
  }
  
  // Private method
  #validatePassword(password) {
    return this.#hashPassword(password) === this.#password;
  }
  
  login(password) {
    if (this.#validatePassword(password)) {
      return 'Login successful';
    }
    return 'Invalid password';
  }
}

const user = new User('john', 'secret123');

user.login('secret123');  // "Login successful"
user.login('wrong');      // "Invalid password"

user.#hashPassword('test');  // SyntaxError: Private method '#hashPassword' is not accessible
```

---

### 5. Mixins

**Mixin Pattern:**
```javascript
// Mixin objects
const canEat = {
  eat(food) {
    return `${this.name} is eating ${food}`;
  }
};

const canWalk = {
  walk() {
    return `${this.name} is walking`;
  }
};

const canSwim = {
  swim() {
    return `${this.name} is swimming`;
  }
};

// Apply mixins to class
class Person {
  constructor(name) {
    this.name = name;
  }
}

// Copy mixin methods to prototype
Object.assign(Person.prototype, canEat, canWalk);

const john = new Person('John');

john.eat('pizza');  // "John is eating pizza"
john.walk();        // "John is walking"
john.swim();        // TypeError: john.swim is not a function

// Functional mixin
function flyMixin(obj) {
  obj.fly = function() {
    return `${this.name} is flying`;
  };
  return obj;
}

class Bird {
  constructor(name) {
    this.name = name;
  }
}

flyMixin(Bird.prototype);

const eagle = new Bird('Eagle');
eagle.fly();  // "Eagle is flying"
```

---

### 6. Inheritance Patterns

**Constructor Stealing:**
```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

function Child(name, age) {
  Parent.call(this, name);  // Steal parent constructor
  this.age = age;
}

const child1 = new Child('John', 10);
const child2 = new Child('Jane', 12);

child1.colors.push('green');

console.log(child1.colors);  // ['red', 'blue', 'green']
console.log(child2.colors);  // ['red', 'blue'] - not affected
```

**Combination Inheritance:**
```javascript
function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

Parent.prototype.sayName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);  // Inherit instance properties
  this.age = age;
}

// Inherit prototype methods
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.sayAge = function() {
  return this.age;
};

const child1 = new Child('John', 10);
const child2 = new Child('Jane', 12);

child1.colors.push('green');

console.log(child1.colors);  // ['red', 'blue', 'green']
console.log(child2.colors);  // ['red', 'blue']

child1.sayName();  // "John"
child1.sayAge();   // 10
```

**Parasitic Combination Inheritance:**
```javascript
function inheritPrototype(child, parent) {
  const prototype = Object.create(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}

function Parent(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}

Parent.prototype.sayName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

inheritPrototype(Child, Parent);

Child.prototype.sayAge = function() {
  return this.age;
};

const child = new Child('John', 10);
child.sayName();  // "John"
child.sayAge();   // 10
```

---

### 7. Property Descriptors

**Object.defineProperty():**
```javascript
const person = {};

Object.defineProperty(person, 'name', {
  value: 'John',
  writable: false,      // Cannot be changed
  enumerable: true,     // Shows in for...in
  configurable: false   // Cannot be deleted or reconfigured
});

console.log(person.name);  // "John"

person.name = 'Jane';  // Silently fails (strict mode: TypeError)
console.log(person.name);  // "John"

delete person.name;  // Silently fails
console.log(person.name);  // "John"

// Getter/Setter with defineProperty
Object.defineProperty(person, 'age', {
  get() {
    return this._age || 0;
  },
  set(value) {
    if (value >= 0) {
      this._age = value;
    }
  },
  enumerable: true,
  configurable: true
});

person.age = 30;
console.log(person.age);  // 30
```

**Object.getOwnPropertyDescriptor():**
```javascript
const obj = { name: 'John' };

const descriptor = Object.getOwnPropertyDescriptor(obj, 'name');

console.log(descriptor);
// {
//   value: 'John',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

---

### 8. Object Methods

**Object.create():**
```javascript
const proto = {
  greet() {
    return `Hello, ${this.name}`;
  }
};

const person = Object.create(proto, {
  name: {
    value: 'John',
    writable: true,
    enumerable: true
  },
  age: {
    value: 30,
    writable: true,
    enumerable: true
  }
});

person.greet();  // "Hello, John"
console.log(person.__proto__ === proto);  // true
```

**Object.setPrototypeOf() & Object.getPrototypeOf():**
```javascript
const animal = {
  speak() {
    return 'Animal sound';
  }
};

const dog = {
  bark() {
    return 'Woof!';
  }
};

// Set prototype (not recommended for performance)
Object.setPrototypeOf(dog, animal);

dog.bark();   // "Woof!"
dog.speak();  // "Animal sound" (inherited)

// Get prototype
console.log(Object.getPrototypeOf(dog) === animal);  // true

// Preferred: Use Object.create() instead
const cat = Object.create(animal);
cat.meow = function() {
  return 'Meow!';
};
```

---

## 🎯 Interview Questions & Answers

### Q1: What is the prototype chain in JavaScript?

**Answer:**
The prototype chain is how JavaScript implements inheritance. When you access a property on an object, JavaScript looks for it on the object itself, then on its prototype, then on the prototype's prototype, and so on until it reaches `null`.

```javascript
const obj = { name: 'John' };

// Prototype chain: obj -> Object.prototype -> null

console.log(obj.toString());  // [object Object]
// toString is not on obj, but on Object.prototype

console.log(obj.__proto__ === Object.prototype);  // true
console.log(Object.prototype.__proto__);  // null

// Array prototype chain
const arr = [1, 2, 3];

console.log(arr.__proto__ === Array.prototype);  // true
console.log(arr.__proto__.__proto__ === Object.prototype);  // true
console.log(arr.__proto__.__proto__.__proto__);  // null

// Property lookup
arr.push(4);  // Found on Array.prototype
arr.toString();  // Not on Array.prototype, found on Object.prototype
```

**How property lookup works:**
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

const john = new Person('John');

// Lookup order for john.greet():
// 1. john object (not found)
// 2. Person.prototype (found! ✓)

console.log(john.hasOwnProperty('name'));   // true (own property)
console.log(john.hasOwnProperty('greet'));  // false (inherited)
```

---

### Q2: What's the difference between `__proto__` and `prototype`?

**Answer:**

**`prototype`** - Property on **constructor functions** that serves as a template for instances

**`__proto__`** - Property on **objects** that points to their prototype

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

const john = new Person('John');

// Person.prototype - template for instances
console.log(Person.prototype);  // { greet: [Function], constructor: Person }

// john.__proto__ - points to Person.prototype
console.log(john.__proto__ === Person.prototype);  // true

// Person itself has a prototype (it's a function)
console.log(Person.__proto__ === Function.prototype);  // true
```

**Visualization:**
```
Person (constructor function)
  ├─ .prototype ───────────┐
  └─ .__proto__ → Function.prototype
                            │
john (instance)             │
  ├─ .name = "John"         │
  └─ .__proto__ ────────────┘
        │
        └→ Person.prototype
              ├─ .greet (method)
              └─ .constructor → Person
```

**Key differences:**

| Feature | `prototype` | `__proto__` |
|---------|------------|-------------|
| On | Constructor functions | All objects |
| Purpose | Template for instances | Link to prototype |
| Writable | Yes | No (use Object.setPrototypeOf) |
| Usage | Define shared methods | Access prototype chain |

```javascript
// Adding to prototype
Person.prototype.sayAge = function() {
  return this.age;
};

// Following the chain
console.log(john.__proto__);                    // Person.prototype
console.log(john.__proto__.__proto__);          // Object.prototype
console.log(john.__proto__.__proto__.__proto__); // null
```

---

### Q3: How does prototypal inheritance work with constructor functions?

**Answer:**
Prototypal inheritance with constructor functions involves setting up a prototype chain between child and parent.

**Basic Setup:**
```javascript
// Parent constructor
function Animal(name) {
  this.name = name;
  this.energy = 100;
}

Animal.prototype.eat = function(food) {
  console.log(`${this.name} is eating ${food}`);
  this.energy += 10;
};

Animal.prototype.sleep = function() {
  console.log(`${this.name} is sleeping`);
  this.energy += 20;
};

// Child constructor
function Dog(name, breed) {
  Animal.call(this, name);  // Inherit instance properties
  this.breed = breed;
}

// Inherit prototype methods
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;  // Fix constructor reference

// Add Dog-specific method
Dog.prototype.bark = function() {
  console.log(`${this.name} barks: Woof!`);
  this.energy -= 5;
};

const myDog = new Dog('Buddy', 'Golden Retriever');

myDog.eat('bone');   // "Buddy is eating bone"
myDog.sleep();       // "Buddy is sleeping"
myDog.bark();        // "Buddy barks: Woof!"
console.log(myDog.energy);  // 125

// Check inheritance
console.log(myDog instanceof Dog);     // true
console.log(myDog instanceof Animal);  // true
console.log(myDog instanceof Object);  // true
```

**Step-by-step breakdown:**

1. **Call parent constructor:** `Animal.call(this, name)` - copies instance properties
2. **Set up prototype chain:** `Dog.prototype = Object.create(Animal.prototype)` - inherits methods
3. **Fix constructor:** `Dog.prototype.constructor = Dog` - maintains proper constructor reference

**Why Object.create():**
```javascript
// ❌ WRONG - shares same prototype object
Dog.prototype = Animal.prototype;
// Changes to Dog.prototype affect Animal.prototype

// ❌ WRONG - calls constructor with undefined arguments
Dog.prototype = new Animal();
// Creates unnecessary instance, may have side effects

// ✅ CORRECT - creates new object with Animal.prototype as prototype
Dog.prototype = Object.create(Animal.prototype);
// Clean inheritance without calling constructor
```

---

### Q4: What's the difference between classical inheritance and prototypal inheritance?

**Answer:**

**Classical Inheritance (e.g., Java, C++):**
- Classes are blueprints
- Objects are instances of classes
- Inheritance through class hierarchies
- Static relationships

**Prototypal Inheritance (JavaScript):**
- Objects inherit from objects
- No classes (until ES6 syntactic sugar)
- Dynamic prototype chain
- Flexible relationships

```javascript
// Prototypal inheritance (pure)
const animal = {
  eat() {
    return `${this.name} is eating`;
  }
};

const dog = Object.create(animal);
dog.name = 'Buddy';
dog.bark = function() {
  return `${this.name} barks`;
};

dog.eat();   // "Buddy is eating" (inherited)
dog.bark();  // "Buddy barks" (own method)

// ES6 classes (syntactic sugar over prototypes)
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    return `${this.name} is eating`;
  }
}

class Dog extends Animal {
  bark() {
    return `${this.name} barks`;
  }
}

const myDog = new Dog('Buddy');
myDog.eat();   // "Buddy is eating"
myDog.bark();  // "Buddy barks"

// Under the hood, it's still prototypal
console.log(myDog.__proto__ === Dog.prototype);  // true
console.log(Dog.prototype.__proto__ === Animal.prototype);  // true
```

**Key Differences:**

| Feature | Classical | Prototypal |
|---------|-----------|-----------|
| Inheritance | Class → Instance | Object → Object |
| Flexibility | Static hierarchy | Dynamic chain |
| Methods | Copied to instance | Shared via prototype |
| Multiple inheritance | Interface/Mixin | Easy with Object.assign |
| Performance | Faster method calls | Prototype lookup |

**Advantages of Prototypal:**
```javascript
// Dynamic modification
const car = {
  drive() {
    return 'Driving';
  }
};

const myCar = Object.create(car);

// Add method to prototype later
car.stop = function() {
  return 'Stopping';
};

myCar.stop();  // "Stopping" - automatically available

// Easy composition
const canFly = {
  fly() {
    return 'Flying';
  }
};

const canSwim = {
  swim() {
    return 'Swimming';
  }
};

const duck = Object.assign({}, canFly, canSwim);
duck.fly();   // "Flying"
duck.swim();  // "Swimming"
```

---

### Q5: How do ES6 classes work under the hood?

**Answer:**
ES6 classes are syntactic sugar over JavaScript's existing prototype-based inheritance.

```javascript
// ES6 class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hi, I'm ${this.name}`;
  }
  
  static species() {
    return 'Homo sapiens';
  }
}

// Equivalent ES5 (what it compiles to)
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

Person.species = function() {
  return 'Homo sapiens';
};

// Both create the same structure
const john1 = new Person('John', 30);
const john2 = new Person('John', 30);

console.log(john1.greet === john2.greet);  // true (shared method)
```

**Class Inheritance:**
```javascript
// ES6
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
    super(name);  // Calls Animal constructor
    this.breed = breed;
  }
  
  speak() {
    return `${this.name} barks`;
  }
}

// ES5 equivalent
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);  // super(name)
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
  return `${this.name} barks`;
};
```

**Key differences:**

| Feature | Class | Function |
|---------|-------|----------|
| Hoisting | Not hoisted | Function declarations hoisted |
| Strict mode | Always strict | Can be non-strict |
| `new` required | Yes (throws error) | No (creates global vars) |
| Methods enumerable | No | Yes |
| Static methods | `static` keyword | Added to constructor |

```javascript
// Classes not hoisted
const p = new Person();  // ReferenceError
class Person {}

// Functions hoisted
const p = new Person();  // Works
function Person() {}

// Classes require new
class Animal {}
Animal();  // TypeError: Class constructor Animal cannot be invoked without 'new'

// Methods not enumerable
class Cat {
  meow() {}
}

for (let key in new Cat()) {
  console.log(key);  // Nothing (meow is not enumerable)
}
```

---

### Q6: What are private fields and methods in JavaScript classes?

**Answer:**
Private fields and methods (ES2022) use `#` prefix and are truly private - inaccessible outside the class.

**Private Fields:**
```javascript
class BankAccount {
  #balance = 0;  // Private field
  #pin;          // Private field (declared but not initialized)
  
  constructor(owner, initialBalance, pin) {
    this.owner = owner;  // Public field
    this.#balance = initialBalance;
    this.#pin = pin;
  }
  
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
      return `New balance: ${this.#balance}`;
    }
    return 'Invalid amount';
  }
  
  withdraw(amount, pin) {
    if (pin !== this.#pin) {
      return 'Invalid PIN';
    }
    
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
      return `New balance: ${this.#balance}`;
    }
    return 'Insufficient funds';
  }
  
  getBalance(pin) {
    if (pin === this.#pin) {
      return this.#balance;
    }
    return 'Invalid PIN';
  }
}

const account = new BankAccount('John', 1000, '1234');

account.deposit(500);           // "New balance: 1500"
account.withdraw(200, '1234');  // "New balance: 1300"
account.getBalance('1234');     // 1300

// Cannot access private fields
console.log(account.owner);     // "John"
console.log(account.#balance);  // SyntaxError
console.log(account['#balance']); // undefined
```

**Private Methods:**
```javascript
class User {
  #password;
  #loginAttempts = 0;
  
  constructor(username, password) {
    this.username = username;
    this.#password = this.#hashPassword(password);
  }
  
  // Private method
  #hashPassword(password) {
    return `hashed_${password}`;
  }
  
  // Private method
  #resetAttempts() {
    this.#loginAttempts = 0;
  }
  
  // Private method
  #incrementAttempts() {
    this.#loginAttempts++;
    if (this.#loginAttempts >= 3) {
      return this.#lockAccount();
    }
    return false;
  }
  
  // Private method
  #lockAccount() {
    console.log('Account locked due to too many failed attempts');
    return true;
  }
  
  login(password) {
    if (this.#hashPassword(password) === this.#password) {
      this.#resetAttempts();
      return 'Login successful';
    }
    
    const locked = this.#incrementAttempts();
    if (locked) {
      return 'Account locked';
    }
    
    return `Invalid password (${3 - this.#loginAttempts} attempts remaining)`;
  }
}

const user = new User('john', 'secret123');

user.login('wrong');      // "Invalid password (2 attempts remaining)"
user.login('wrong');      // "Invalid password (1 attempts remaining)"
user.login('wrong');      // "Account locked"
user.login('secret123');  // "Account locked"

// Cannot access private methods
user.#hashPassword('test');  // SyntaxError
```

**Private vs Public:**

| Feature | Public | Private |
|---------|--------|---------|
| Syntax | `property` | `#property` |
| Access | Inside & outside class | Inside class only |
| Inheritance | Inherited by subclasses | Not inherited |
| Enumeration | Yes (for...in) | No |

```javascript
class Parent {
  publicField = 'public';
  #privateField = 'private';
  
  getPrivate() {
    return this.#privateField;
  }
}

class Child extends Parent {
  accessFields() {
    console.log(this.publicField);   // "public" ✓
    console.log(this.#privateField);  // SyntaxError ❌
  }
}

const parent = new Parent();
console.log(parent.publicField);   // "public"
console.log(parent.getPrivate());  // "private" (via public method)
console.log(parent.#privateField); // SyntaxError
```

---

### Q7: What are getters and setters, and how do they work?

**Answer:**
Getters and setters are special methods that allow controlled access to object properties.

**Basic Syntax:**
```javascript
class Person {
  constructor(firstName, lastName) {
    this._firstName = firstName;
    this._lastName = lastName;
  }
  
  // Getter - accessed like a property
  get fullName() {
    return `${this._firstName} ${this._lastName}`;
  }
  
  // Setter - set like a property
  set fullName(name) {
    const [firstName, lastName] = name.split(' ');
    this._firstName = firstName;
    this._lastName = lastName;
  }
  
  get firstName() {
    return this._firstName;
  }
  
  set firstName(value) {
    if (typeof value === 'string' && value.length > 0) {
      this._firstName = value;
    }
  }
}

const person = new Person('John', 'Doe');

// Use getter (no parentheses)
console.log(person.fullName);  // "John Doe"

// Use setter (no parentheses)
person.fullName = 'Jane Smith';
console.log(person.fullName);  // "Jane Smith"

person.firstName = 'Bob';
console.log(person.fullName);  // "Bob Smith"

person.firstName = '';  // Validation fails
console.log(person.fullName);  // "Bob Smith" (unchanged)
```

**Data Validation:**
```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }
  
  get celsius() {
    return this._celsius;
  }
  
  set celsius(value) {
    if (value < -273.15) {
      throw new Error('Temperature below absolute zero is not possible');
    }
    this._celsius = value;
  }
  
  get fahrenheit() {
    return (this._celsius * 9/5) + 32;
  }
  
  set fahrenheit(value) {
    this.celsius = (value - 32) * 5/9;  // Uses celsius setter
  }
  
  get kelvin() {
    return this._celsius + 273.15;
  }
  
  set kelvin(value) {
    this.celsius = value - 273.15;
  }
}

const temp = new Temperature(25);

console.log(temp.celsius);     // 25
console.log(temp.fahrenheit);  // 77
console.log(temp.kelvin);      // 298.15

temp.fahrenheit = 86;
console.log(temp.celsius);     // 30

temp.celsius = -300;  // Error: Temperature below absolute zero
```

**Computed Properties:**
```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  
  get area() {
    return this.width * this.height;
  }
  
  get perimeter() {
    return 2 * (this.width + this.height);
  }
  
  // Can't set area directly (no setter)
}

const rect = new Rectangle(10, 5);

console.log(rect.area);       // 50
console.log(rect.perimeter);  // 30

rect.width = 20;
console.log(rect.area);       // 100 (recalculated)

rect.area = 200;  // Silently ignored (no setter)
console.log(rect.area);  // 100
```

**Object Literal Getters/Setters:**
```javascript
const user = {
  _age: 0,
  
  get age() {
    return this._age;
  },
  
  set age(value) {
    if (value >= 0 && value <= 150) {
      this._age = value;
    }
  },
  
  get birthYear() {
    return new Date().getFullYear() - this._age;
  }
};

user.age = 30;
console.log(user.age);        // 30
console.log(user.birthYear);  // 1994 (or current year - 30)

user.age = -5;  // Validation fails
console.log(user.age);  // 30 (unchanged)
```

---

### Q8: How do you create objects without prototypes?

**Answer:**
Use `Object.create(null)` to create objects with no prototype chain.

**Normal Object:**
```javascript
const normalObj = {};

console.log(normalObj.__proto__);  // Object.prototype
console.log(normalObj.toString);   // [Function: toString]
console.log(normalObj.hasOwnProperty);  // [Function: hasOwnProperty]

// Has all Object.prototype methods
for (let key in normalObj) {
  console.log(key);  // Nothing (but methods are there)
}
```

**Null Prototype Object:**
```javascript
const nullProtoObj = Object.create(null);

console.log(nullProtoObj.__proto__);  // undefined
console.log(nullProtoObj.toString);   // undefined
console.log(nullProtoObj.hasOwnProperty);  // undefined

// No inherited properties
nullProtoObj.name = 'John';
nullProtoObj.age = 30;

for (let key in nullProtoObj) {
  console.log(key);  // "name", "age"
}

// Cannot use Object methods
nullProtoObj.toString();  // TypeError: nullProtoObj.toString is not a function
nullProtoObj.hasOwnProperty('name');  // TypeError

// Must use Object methods directly
Object.prototype.hasOwnProperty.call(nullProtoObj, 'name');  // true
```

**Use Cases:**

**1. Hash Maps / Dictionaries:**
```javascript
// Problem with normal objects
const cache = {};
cache['toString'] = 'cached value';

console.log(cache.toString);  // "cached value"
console.log(cache.toString());  // TypeError: cache.toString is not a function

// Solution with null prototype
const safeCache = Object.create(null);
safeCache['toString'] = 'cached value';

console.log(safeCache.toString);  // "cached value"
console.log(typeof safeCache.toString);  // "string" (not a function)
```

**2. Configuration Objects:**
```javascript
const config = Object.create(null);

config.apiUrl = 'https://api.example.com';
config.timeout = 5000;
config.retries = 3;

// No accidental prototype pollution
config.__proto__ = { malicious: true };  // Doesn't affect prototype chain

// Clean iteration
for (let key in config) {
  console.log(`${key}: ${config[key]}`);
}
// apiUrl: https://api.example.com
// timeout: 5000
// retries: 3
```

**3. Pure Data Storage:**
```javascript
function createStorage() {
  const storage = Object.create(null);
  
  return {
    set(key, value) {
      storage[key] = value;
    },
    
    get(key) {
      return storage[key];
    },
    
    has(key) {
      return key in storage;
    },
    
    delete(key) {
      delete storage[key];
    },
    
    keys() {
      return Object.keys(storage);
    }
  };
}

const store = createStorage();

store.set('user', { name: 'John' });
store.set('count', 42);

console.log(store.get('user'));  // { name: 'John' }
console.log(store.keys());       // ['user', 'count']
```

**Comparison:**

| Feature | `{}` | `Object.create(null)` |
|---------|------|----------------------|
| Prototype | Object.prototype | null |
| toString() | Yes | No |
| hasOwnProperty() | Yes | No |
| constructor | Yes | No |
| Prototype pollution | Vulnerable | Safe |
| Performance | Slower (prototype lookup) | Faster (no lookup) |
| Use case | General objects | Hash maps, configs |

---

### Q9: What's the difference between `Object.create()` and the constructor pattern?

**Answer:**

**Constructor Pattern:**
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

const john = new Person('John', 30);

// Creates object with:
// 1. Own properties (name, age)
// 2. Prototype set to Person.prototype
// 3. Constructor property

console.log(john.name);  // "John"
console.log(john.greet());  // "Hi, I'm John"
console.log(john.constructor === Person);  // true
console.log(john instanceof Person);  // true
```

**Object.create():**
```javascript
const personProto = {
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

const john = Object.create(personProto);
john.name = 'John';
john.age = 30;

// Creates object with:
// 1. Specified prototype
// 2. No own properties initially
// 3. No constructor call

console.log(john.name);  // "John"
console.log(john.greet());  // "Hi, I'm John"
console.log(john.constructor);  // Object (not Person)
console.log(john instanceof Object);  // true
```

**Key Differences:**

| Feature | Constructor | Object.create() |
|---------|-------------|-----------------|
| Syntax | `new Constructor()` | `Object.create(proto)` |
| Initialization | In constructor function | Manual assignment |
| Constructor property | Set automatically | Not set |
| Use case | Traditional OOP | Prototypal patterns |
| Performance | Faster (optimized) | Slightly slower |

**Object.create() with properties:**
```javascript
const personProto = {
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

const john = Object.create(personProto, {
  name: {
    value: 'John',
    writable: true,
    enumerable: true
  },
  age: {
    value: 30,
    writable: true,
    enumerable: true
  }
});

console.log(john.name);  // "John"
console.log(john.greet());  // "Hi, I'm John"
```

**Combining Both Patterns:**
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function() {
  return `Hi, I'm ${this.name}`;
};

function Employee(name, age, title) {
  Person.call(this, name, age);  // Call parent constructor
  this.title = title;
}

// Use Object.create for inheritance
Employee.prototype = Object.create(Person.prototype);
Employee.prototype.constructor = Employee;

Employee.prototype.work = function() {
  return `${this.name} is working as ${this.title}`;
};

const emp = new Employee('John', 30, 'Developer');

console.log(emp.greet());  // "Hi, I'm John" (inherited)
console.log(emp.work());   // "John is working as Developer"
console.log(emp instanceof Employee);  // true
console.log(emp instanceof Person);    // true
```

**When to use:**

- **Constructor:** Traditional OOP, performance-critical code, familiar pattern
- **Object.create():** Prototypal inheritance, pure delegation, avoiding constructors

---

### Q10: How do mixins work in JavaScript?

**Answer:**
Mixins allow you to add functionality to classes/objects without traditional inheritance.

**Object Mixin:**
```javascript
// Mixin objects
const canEat = {
  eat(food) {
    return `${this.name} is eating ${food}`;
  }
};

const canWalk = {
  walk() {
    return `${this.name} is walking`;
  }
};

const canSwim = {
  swim() {
    return `${this.name} is swimming`;
  }
};

// Compose object from mixins
const duck = Object.assign(
  { name: 'Donald' },
  canEat,
  canWalk,
  canSwim
);

console.log(duck.eat('bread'));  // "Donald is eating bread"
console.log(duck.walk());        // "Donald is walking"
console.log(duck.swim());        // "Donald is swimming"
```

**Class Mixin:**
```javascript
// Mixin function
const FlyMixin = (Base) => class extends Base {
  fly() {
    return `${this.name} is flying`;
  }
};

const SwimMixin = (Base) => class extends Base {
  swim() {
    return `${this.name} is swimming`;
  }
};

// Base class
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    return `${this.name} is eating`;
  }
}

// Apply mixins
class Duck extends SwimMixin(FlyMixin(Animal)) {
  quack() {
    return `${this.name} says quack!`;
  }
}

const donald = new Duck('Donald');

console.log(donald.eat());   // "Donald is eating"
console.log(donald.fly());   // "Donald is flying"
console.log(donald.swim());  // "Donald is swimming"
console.log(donald.quack()); // "Donald says quack!"
```

**Functional Mixin:**
```javascript
// Mixin factory
function withLogging(obj) {
  return {
    ...obj,
    log(message) {
      console.log(`[${new Date().toISOString()}] ${message}`);
    }
  };
}

function withTimestamps(obj) {
  return {
    ...obj,
    createdAt: new Date(),
    updatedAt: new Date(),
    touch() {
      this.updatedAt = new Date();
    }
  };
}

// Create object with mixins
const user = withTimestamps(withLogging({
  name: 'John',
  email: 'john@example.com'
}));

user.log('User created');  // [2024-...] User created
console.log(user.createdAt);  // Date object
user.touch();
console.log(user.updatedAt);  // Updated date
```

**Prototype Mixin:**
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }
}

// Apply mixins to prototype
Object.assign(Person.prototype, canEat, canWalk);

const john = new Person('John');

john.eat('pizza');  // "John is eating pizza"
john.walk();        // "John is walking"

// All instances share mixin methods
const jane = new Person('Jane');
console.log(john.eat === jane.eat);  // true
```

**Multiple Mixins with Conflicts:**
```javascript
const mixin1 = {
  greet() {
    return 'Hello from mixin1';
  },
  shared() {
    return 'Mixin1 shared';
  }
};

const mixin2 = {
  goodbye() {
    return 'Goodbye from mixin2';
  },
  shared() {
    return 'Mixin2 shared';  // Overwrites mixin1.shared
  }
};

const obj = Object.assign({}, mixin1, mixin2);

console.log(obj.greet());   // "Hello from mixin1"
console.log(obj.goodbye()); // "Goodbye from mixin2"
console.log(obj.shared());  // "Mixin2 shared" (mixin2 wins)
```

**Advanced Mixin Pattern:**
```javascript
// Composable mixins
const compose = (...mixins) => (Base) => {
  return mixins.reduce((acc, mixin) => mixin(acc), Base);
};

const TimestampMixin = (Base) => class extends Base {
  constructor(...args) {
    super(...args);
    this.createdAt = new Date();
  }
};

const ValidationMixin = (Base) => class extends Base {
  validate() {
    return this.name && this.name.length > 0;
  }
};

const LoggingMixin = (Base) => class extends Base {
  log(message) {
    console.log(`[${this.name}] ${message}`);
  }
};

class Entity {
  constructor(name) {
    this.name = name;
  }
}

// Compose all mixins
const EnhancedEntity = compose(
  TimestampMixin,
  ValidationMixin,
  LoggingMixin
)(Entity);

const entity = new EnhancedEntity('MyEntity');

console.log(entity.createdAt);    // Date object
console.log(entity.validate());   // true
entity.log('Entity created');     // [MyEntity] Entity created
```

---

## 🎓 Key Takeaways

✅ **Prototype chain** - Objects inherit from other objects via `__proto__`  
✅ **`prototype` vs `__proto__`** - Constructor property vs instance link  
✅ **Constructor functions** - Traditional pattern before ES6 classes  
✅ **ES6 classes** - Syntactic sugar over prototypes  
✅ **`Object.create()`** - Creates object with specified prototype  
✅ **Private fields** - Use `#` prefix for true privacy  
✅ **Getters/setters** - Controlled property access  
✅ **Mixins** - Compose functionality without inheritance  
✅ **`instanceof`** - Checks prototype chain  
✅ **Prototypal inheritance** - More flexible than classical

---

## 📚 Practice Tips

1. Implement inheritance patterns both with constructors and classes
2. Create custom objects with `Object.create()` and property descriptors
3. Build mixin systems for code reuse
4. Practice prototype chain lookup by hand
5. Use private fields for encapsulation
6. Understand `this` binding in different inheritance patterns
7. Create object hierarchies (Animal → Dog → GoldenRetriever)
8. Implement method overriding and `super` calls

---

**Previous Topic:** Functions & Closures  
**Next Topic:** Error Handling
