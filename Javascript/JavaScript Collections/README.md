# JavaScript Collections - Study Guide

Complete guide to JavaScript data structures, collections, and algorithms with practical examples and interview preparation.

---

## 📚 Quick Notes by Topic

### 1. Arrays & Array Methods

#### **Array Basics**
**Creation Methods:**
- **Literal**: `const arr = [1, 2, 3]` - Most common, concise
- **Constructor**: `new Array(5)` creates sparse array with 5 empty slots; `new Array(1, 2, 3)` creates `[1, 2, 3]`
- **Array.from()**: Converts iterables to arrays - `Array.from('hello')` → `['h','e','l','l','o']`, `Array.from({length: 5}, (_, i) => i)` → `[0,1,2,3,4]`
- **Array.of()**: `Array.of(5)` → `[5]` (unlike `new Array(5)` which creates empty slots)

**Accessing Elements:**
- **Index**: `arr[0]` for first element, `arr[arr.length - 1]` for last
- **at() method**: `arr.at(-1)` gets last element (negative indices supported)
- **Length property**: Dynamic, can be set to truncate: `arr.length = 2` removes elements beyond index 1

**Common Patterns:**
```javascript
// Range: [0, 1, 2, ..., 9]
Array.from({length: 10}, (_, i) => i)

// Deduplication
[...new Set([1, 2, 2, 3])] // [1, 2, 3]

// Flatten nested arrays
[[1, 2], [3, 4]].flat() // [1, 2, 3, 4]

// Chunk into groups
const chunk = (arr, size) => Array.from({length: Math.ceil(arr.length/size)}, (_, i) => arr.slice(i*size, i*size+size))

// Shuffle (Fisher-Yates)
arr.sort(() => Math.random() - 0.5) // Simple but biased
```

---

#### **Iteration Methods**
**forEach(callback)**: Executes function for each element
- No return value (returns `undefined`)
- Cannot `break` or `continue` (use `for...of` if needed)
- Use for side effects (logging, DOM manipulation)
```javascript
arr.forEach((item, index, array) => console.log(item))
```

**map(callback)**: Transforms each element
- Returns new array with same length
- Original array unchanged
- Callback should return transformed value
```javascript
[1, 2, 3].map(x => x * 2) // [2, 4, 6]
```

**filter(callback)**: Keeps elements that pass test
- Returns new array (can be shorter)
- Callback returns truthy/falsy
```javascript
[1, 2, 3, 4].filter(x => x % 2 === 0) // [2, 4]
```

**reduce(callback, initialValue)**: Reduces to single value
- Callback: `(accumulator, current, index, array) => newAccumulator`
- Versatile: sum, group, flatten, compose functions
```javascript
// Sum
[1, 2, 3].reduce((sum, n) => sum + n, 0) // 6

// Group by property
items.reduce((acc, item) => {
  (acc[item.category] = acc[item.category] || []).push(item)
  return acc
}, {})
```

**find/findIndex**: Returns first match
- `find()` returns element or `undefined`
- `findIndex()` returns index or `-1`
- Stops at first match (efficient for large arrays)
- ES2023 adds `findLast()` and `findLastIndex()` for reverse search

**some(callback)**: Tests if ANY element passes
- Returns `true` if at least one matches
- Short-circuits (stops at first `true`)
```javascript
[1, 2, 3].some(x => x > 2) // true (stops at 3)
```

**every(callback)**: Tests if ALL elements pass
- Returns `true` only if all match
- Short-circuits (stops at first `false`)
```javascript
[1, 2, 3].every(x => x > 0) // true
```

---

#### **Mutating Methods**
**Add/Remove from Ends:**
- **push(...items)**: Adds to end, returns new length, O(1)
- **pop()**: Removes from end, returns removed element, O(1)
- **shift()**: Removes from start, returns removed element, O(n) - reindexes entire array
- **unshift(...items)**: Adds to start, returns new length, O(n) - reindexes entire array

**splice(start, deleteCount, ...items)**: Swiss army knife
- **Remove**: `arr.splice(2, 1)` removes 1 element at index 2
- **Insert**: `arr.splice(2, 0, 'new')` inserts at index 2
- **Replace**: `arr.splice(2, 1, 'new')` replaces element at index 2
- Returns array of removed elements
- Modifies original array

**sort(compareFn)**: Sorts in-place
- **Default**: Lexicographic (converts to strings) - `[10, 5, 40].sort()` → `[10, 40, 5]` ⚠️
- **Numeric**: `arr.sort((a, b) => a - b)` ascending, `(a, b) => b - a` descending
- **Stable** since ES2019 (equal elements maintain relative order)
- Time complexity: O(n log n)

**reverse()**: Reverses in-place, O(n)

**fill(value, start, end)**: Fills with static value
```javascript
new Array(5).fill(0) // [0, 0, 0, 0, 0]
arr.fill('x', 2, 4) // Fills indices 2-3 with 'x'
```

**Immutable Alternatives (ES2023):**
- **toSorted()**: Returns sorted copy without mutating
- **toReversed()**: Returns reversed copy
- **toSpliced()**: Returns spliced copy
- **with(index, value)**: Returns copy with one element updated

---

#### **Non-Mutating Methods**
**concat(...arrays)**: Merges arrays
- Returns new array
- Doesn't modify originals
- Alternative: spread `[...arr1, ...arr2]`
```javascript
[1, 2].concat([3, 4], [5, 6]) // [1, 2, 3, 4, 5, 6]
```

**slice(start, end)**: Extracts portion
- Returns shallow copy of portion
- Negative indices supported: `arr.slice(-2)` gets last 2
- `arr.slice()` copies entire array
```javascript
[1, 2, 3, 4, 5].slice(1, 3) // [2, 3]
```

**join(separator)**: Creates string
- Default separator is comma
```javascript
['a', 'b', 'c'].join('-') // 'a-b-c'
```

**includes(value, fromIndex)**: Checks existence
- Returns boolean
- Handles NaN correctly (unlike `indexOf`)
- O(n) time complexity
```javascript
[1, 2, NaN].includes(NaN) // true
```

**indexOf/lastIndexOf(value, fromIndex)**: Finds index
- Returns index or `-1` if not found
- Cannot find NaN: `[NaN].indexOf(NaN)` → `-1`
- Use `findIndex()` for complex conditions

**flat(depth)**: Flattens nested arrays
- Default depth is 1
- `flat(Infinity)` flattens all levels
```javascript
[1, [2, [3, [4]]]].flat(2) // [1, 2, 3, [4]]
```

**flatMap(callback)**: Maps then flattens one level
- Equivalent to `map().flat()`
- More efficient than separate operations
```javascript
[1, 2, 3].flatMap(x => [x, x * 2]) // [1, 2, 2, 4, 3, 6]
```

---

### 2. Objects & Maps

#### **Object Basics**
**Creation Methods:**
- **Literal**: `const obj = {key: 'value'}` - Most common
- **Constructor**: `new Object()` - Rarely used
- **Object.create(proto)**: Creates object with specified prototype
  ```javascript
  const parent = {greet: () => 'Hello'}
  const child = Object.create(parent) // child inherits greet()
  ```
- **Object.fromEntries()**: Converts entries to object
  ```javascript
  Object.fromEntries([['a', 1], ['b', 2]]) // {a: 1, b: 2}
  ```

**Property Access:**
- **Dot notation**: `obj.property` - Clean, requires valid identifiers
- **Bracket notation**: `obj['property']` - Dynamic keys, special characters
- **Optional chaining**: `obj?.nested?.property` - Safe access (returns `undefined` if path broken)
- **Nullish coalescing**: `obj?.prop ?? 'default'` - Default values

**Adding/Modifying Properties:**
```javascript
obj.newProp = 'value'           // Add property
obj['prop'] = 'value'           // Dynamic key
delete obj.prop                  // Remove property
obj.prop = undefined            // Keep property, set to undefined
```

**Property Descriptors:**
- Control writability, enumerability, configurability
```javascript
Object.defineProperty(obj, 'prop', {
  value: 42,
  writable: false,      // Cannot change value
  enumerable: true,     // Shows in for...in
  configurable: false   // Cannot delete or redefine
})
```

**Getters/Setters:**
```javascript
const obj = {
  _value: 0,
  get value() { return this._value },
  set value(v) { this._value = Math.max(0, v) } // Validation
}
```

**Advanced Features:**
- **Computed property names**: `{[key]: value}` - Dynamic keys in literals
- **Shorthand**: `{name, age}` instead of `{name: name, age: age}`
- **Method shorthand**: `{method() {}}` instead of `{method: function() {}}`

---

#### **Object Methods**
**Object.keys/values/entries()**: Extract data
```javascript
const obj = {a: 1, b: 2, c: 3}
Object.keys(obj)     // ['a', 'b', 'c']
Object.values(obj)   // [1, 2, 3]
Object.entries(obj)  // [['a', 1], ['b', 2], ['c', 3]]
```
- Only enumerable own properties (not inherited)
- Order: integer keys ascending, then insertion order for strings

**Object.assign(target, ...sources)**: Copy/merge
```javascript
Object.assign({}, obj1, obj2)  // Merge, later overrides earlier
Object.assign({}, obj)         // Shallow copy
```
- Copies enumerable own properties
- Triggers setters on target
- Returns target object (modified)

**Immutability Controls:**
- **Object.freeze(obj)**: Completely immutable
  - Cannot add, delete, or modify properties
  - Shallow only (nested objects still mutable)
  ```javascript
  const frozen = Object.freeze({a: 1, b: {c: 2}})
  frozen.a = 10        // ❌ Fails (strict mode throws)
  frozen.b.c = 20      // ✅ Works (nested not frozen)
  ```

- **Object.seal(obj)**: Can modify but not add/delete
  ```javascript
  const sealed = Object.seal({a: 1})
  sealed.a = 10        // ✅ Allowed
  sealed.b = 2         // ❌ Cannot add
  delete sealed.a      // ❌ Cannot delete
  ```

- **Object.preventExtensions(obj)**: Can modify and delete but not add
  ```javascript
  const obj = Object.preventExtensions({a: 1})
  obj.a = 10           // ✅ Allowed
  delete obj.a         // ✅ Allowed
  obj.b = 2            // ❌ Cannot add
  ```

**Object.hasOwn(obj, prop)** (ES2022): Safer than `hasOwnProperty`
```javascript
Object.hasOwn(obj, 'prop')  // ✅ Recommended
obj.hasOwnProperty('prop')  // ⚠️ Can be overridden
```

**Other Useful Methods:**
- `Object.is(val1, val2)`: Strict equality (handles NaN, -0 correctly)
- `Object.getOwnPropertyNames(obj)`: All own properties (including non-enumerable)
- `Object.getPrototypeOf(obj)`: Get prototype

---

#### **Maps**
**Why Use Map Over Object:**
1. **Any type as key**: Objects, functions, primitives
2. **Better performance**: Optimized for frequent add/delete
3. **Size property**: `map.size` is O(1), object needs `Object.keys(obj).length`
4. **Iteration order**: Guaranteed insertion order
5. **No prototype pollution**: Clean, no inherited properties

**Creation:**
```javascript
const map = new Map()
const map2 = new Map([['key1', 'val1'], ['key2', 'val2']])
const map3 = new Map(Object.entries(obj)) // From object
```

**Methods:**
- **set(key, value)**: Add/update, returns map (chainable)
- **get(key)**: Retrieve value, returns `undefined` if not found
- **has(key)**: Check existence, returns boolean
- **delete(key)**: Remove, returns `true` if existed
- **clear()**: Remove all entries
- **size**: Property (not method) for count

**Iteration:**
```javascript
for (const [key, value] of map) { }  // Entries
for (const key of map.keys()) { }    // Keys only
for (const value of map.values()) { } // Values only
map.forEach((value, key) => { })     // forEach (note: value first!)
```

**Map vs Object Performance:**
```javascript
// Map: Better for
// - Frequent additions/deletions
// - Large datasets
// - Non-string keys
// - Need size tracking

// Object: Better for
// - Fixed structure
// - JSON serialization
// - Small datasets
// - String-only keys
```

**WeakMap:**
- Keys **must be objects** (not primitives)
- Weak references - allows garbage collection
- No iteration, no size, no clear()
- Use cases: Private data, metadata, caching
```javascript
const weakMap = new WeakMap()
let obj = {id: 1}
weakMap.set(obj, 'metadata')
obj = null  // Metadata can be garbage collected
```

---

### 3. Sets & WeakSets

#### **Sets**
- **Purpose**: Store unique values
- **Methods**: `add()`, `has()`, `delete()`, `clear()`
- **Operations**: Union, intersection, difference, symmetric difference
- **Use Cases**: Deduplication, membership testing, removing duplicates from arrays

#### **WeakSets**
- **Constraints**: Only objects as values
- **Benefits**: Garbage collection friendly, no memory leaks
- **Use Cases**: Marking objects, tracking DOM nodes, private flags
- **Limitations**: No iteration, no size, no clear()

---

### 4. Array Iteration Methods

#### **Transforming Arrays**
**map(callback)**: Transform each element
```javascript
const doubled = [1, 2, 3].map(x => x * 2)  // [2, 4, 6]
const users = ids.map(id => ({id, name: getName(id)}))  // Create objects
// ⚠️ Returns new array (length unchanged), doesn't modify original
```

**flatMap(callback)**: Map + flatten one level
```javascript
const nested = [[1], [2, 3], [4]]
nested.flatMap(x => x)  // [1, 2, 3] - More efficient than .map().flat()

// Expand elements
const words = ['hello', 'world']
words.flatMap(w => w.split(''))  // ['h','e','l','l','o','w','o','r','l','d']

// Filter + map
arr.flatMap(x => x > 0 ? [x * 2] : [])  // Remove negatives and double
```

**reduce(callback, initial)**: Powerful aggregation
```javascript
// Sum
const sum = [1, 2, 3].reduce((acc, n) => acc + n, 0)  // 6

// Group by
const grouped = users.reduce((acc, user) => {
  const key = user.role
  acc[key] = acc[key] || []
  acc[key].push(user)
  return acc
}, {})

// Flatten
const flattened = [[1], [2, 3]].reduce((acc, arr) => acc.concat(arr), [])

// Build object
const obj = entries.reduce((acc, [k, v]) => ({...acc, [k]: v}), {})

// Count occurrences
const counts = arr.reduce((acc, item) => ({
  ...acc,
  [item]: (acc[item] || 0) + 1
}), {})
```

**reduceRight()**: Right-to-left reduction
```javascript
// Reverse string processing
const reversed = arr.reduceRight((acc, item) => [...acc, item], [])

// Right-associative operations
const composed = fns.reduceRight((f, g) => x => g(f(x)))
```

**Chaining Methods:**
```javascript
const result = users
  .filter(u => u.active)           // Keep active users
  .map(u => u.orders)              // Get orders
  .flat()                          // Flatten
  .reduce((sum, o) => sum + o.total, 0)  // Sum totals

// ⚠️ Performance: Each step creates new array
// For large datasets, consider single reduce or for-loop
```

---

#### **Filtering & Searching**
**filter(predicate)**: Returns all matches
```javascript
const evens = [1, 2, 3, 4].filter(n => n % 2 === 0)  // [2, 4]
// ⚠️ Always checks ALL elements, returns new array
```

**find(predicate)**: First match, stops early
```javascript
const user = users.find(u => u.id === targetId)  // Returns element or undefined
// ✅ Stops at first match - more efficient than filter()[0]
```

**findIndex(predicate)**: Index of first match
```javascript
const idx = arr.findIndex(x => x > 10)  // Returns index or -1
```

**findLast() / findLastIndex()** (ES2023): Search from end
```javascript
const lastEven = [1, 2, 3, 4].findLast(n => n % 2 === 0)  // 4
const lastIdx = arr.findLastIndex(x => x.active)
```

**some(predicate)**: At least one match (short-circuits)
```javascript
const hasAdmin = users.some(u => u.role === 'admin')  // true/false
// ✅ Stops at first true - use instead of filter().length > 0
```

**every(predicate)**: All must match (short-circuits)
```javascript
const allValid = data.every(item => item.isValid)  // true/false
// ✅ Stops at first false
```

**Best Practices:**
```javascript
// ❌ Inefficient
const firstActive = users.filter(u => u.active)[0]
const hasActive = users.filter(u => u.active).length > 0

// ✅ Efficient
const firstActive = users.find(u => u.active)
const hasActive = users.some(u => u.active)
```

---

### 5. Destructuring & Spread

#### **Array Destructuring**
**Basic Syntax:**
```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5]
// first = 1, second = 2, rest = [3, 4, 5]
```

**Skip Elements:**
```javascript
const [a, , c] = [1, 2, 3]  // a = 1, c = 3 (skip 2)
const [, , third] = arr      // Get only third element
```

**Default Values:**
```javascript
const [x = 0, y = 0] = [1]  // x = 1, y = 0
const [name = 'Anonymous'] = []  // name = 'Anonymous'
```

**Swapping:**
```javascript
[a, b] = [b, a]  // No temp variable needed
```

**Nested Destructuring:**
```javascript
const [a, [b, c]] = [1, [2, 3]]  // a = 1, b = 2, c = 3
```

**Function Parameters:**
```javascript
function sum([a, b]) {
  return a + b
}
sum([1, 2])  // 3
```

---

#### **Object Destructuring**
**Basic Syntax:**
```javascript
const {name, age} = user  // Extract properties
// name = user.name, age = user.age
```

**Rename Variables:**
```javascript
const {name: userName, age: userAge} = user
// userName = user.name, userAge = user.age
```

**Default Values:**
```javascript
const {city = 'NYC', country = 'USA'} = user
// Uses defaults if properties don't exist
```

**Nested Destructuring:**
```javascript
const {address: {street, city}} = user
// street = user.address.street, city = user.address.city

// ⚠️ Creates `street` and `city` variables, NOT `address`
// To get both:
const {address, address: {street}} = user
```

**Rest Properties:**
```javascript
const {id, ...otherProps} = user
// id = user.id, otherProps = {name, age, email, ...}
```

**Dynamic Keys:**
```javascript
const key = 'username'
const {[key]: value} = user  // value = user.username
```

**Function Parameters:**
```javascript
function greet({name, age = 18}) {
  console.log(`${name} is ${age}`)
}
greet(user)

// With defaults for entire object
function configure({timeout = 1000, retries = 3} = {}) {
  // Handles configure() with no args
}
```

**Common Patterns:**
```javascript
// Extract from API response
const {data: {users, total}, error} = await fetchData()

// Props in React
function Component({title, onClick, disabled = false}) { }

// Config objects
const {
  host = 'localhost',
  port = 3000,
  ssl: {enabled: sslEnabled = false} = {}
} = config
```

---

#### **Spread Operator (...)**
**Array Spread:**
```javascript
// Copy array (shallow)
const copy = [...original]

// Merge arrays
const merged = [...arr1, ...arr2, ...arr3]

// Add elements
const withExtra = [...arr, newItem]
const between = [...start, middle, ...end]

// Convert iterables
const chars = [...'hello']  // ['h', 'e', 'l', 'l', 'o']
const unique = [...new Set(arr)]  // Remove duplicates
const arr = [...map.values()]  // Map to array
```

**Object Spread:**
```javascript
// Copy object (shallow)
const copy = {...original}

// Merge objects (later overrides earlier)
const merged = {...defaults, ...userConfig}

// Override properties
const updated = {...user, age: 30}

// Conditional properties
const obj = {
  name: 'John',
  ...(isAdmin && {role: 'admin'}),  // Only if isAdmin is true
  ...(email && {email})              // Only if email is truthy
}

// Remove property (combine with destructuring)
const {password, ...safeUser} = user  // safeUser has everything except password
```

**Function Arguments:**
```javascript
Math.max(...numbers)  // Instead of Math.max.apply(null, numbers)
console.log(...args)

function sum(...numbers) {  // Rest parameters (not spread)
  return numbers.reduce((a, b) => a + b, 0)
}
```

**Limitations:**
```javascript
// ⚠️ Shallow copy only
const original = {a: {b: 1}}
const copy = {...original}
copy.a.b = 2  // Also changes original.a.b

// Need deep copy for nested
const deepCopy = JSON.parse(JSON.stringify(original))  // Simple but limited
// Or use structuredClone() (modern browsers)
const deepCopy = structuredClone(original)
```

---

### 6. Collection Utilities

#### **Grouping**
**Object.groupBy()** (ES2024):
```javascript
const products = [
  {name: 'Apple', category: 'Fruit'},
  {name: 'Carrot', category: 'Vegetable'},
  {name: 'Banana', category: 'Fruit'}
]

const grouped = Object.groupBy(products, item => item.category)
// {
//   Fruit: [{name: 'Apple', ...}, {name: 'Banana', ...}],
//   Vegetable: [{name: 'Carrot', ...}]
// }
```

**Map.groupBy()** (ES2024): Returns Map (better for non-string keys)
```javascript
const byPrice = Map.groupBy(products, p => p.price > 10 ? 'expensive' : 'cheap')
```

**Manual Grouping with reduce():**
```javascript
const grouped = items.reduce((acc, item) => {
  const key = item.category
  if (!acc[key]) acc[key] = []
  acc[key].push(item)
  return acc
}, {})

// Or more concise
const grouped = items.reduce((acc, item) => {
  (acc[item.category] = acc[item.category] || []).push(item)
  return acc
}, {})
```

**Use Cases:**
- Categorize data by property
- Organize by date/time periods
- Create lookup tables
- Data analysis and reporting

---

#### **Aggregation**
**Sum/Count:**
```javascript
const sum = numbers.reduce((acc, n) => acc + n, 0)
const count = items.filter(i => i.active).length
```

**Min/Max:**
```javascript
const max = Math.max(...numbers)
const min = Math.min(...numbers)

// For objects
const maxPrice = Math.max(...products.map(p => p.price))
const cheapest = products.reduce((min, p) => 
  p.price < min.price ? p : min
)
```

**Average:**
```javascript
const avg = numbers.reduce((sum, n) => sum + n, 0) / numbers.length
```

**Frequency/Count Map:**
```javascript
const frequency = items.reduce((acc, item) => {
  acc[item] = (acc[item] || 0) + 1
  return acc
}, {})
// ['a', 'b', 'a', 'c'] → {a: 2, b: 1, c: 1}
```

**Multiple Stats in One Pass:**
```javascript
const stats = numbers.reduce((acc, n) => ({
  count: acc.count + 1,
  sum: acc.sum + n,
  min: Math.min(acc.min, n),
  max: Math.max(acc.max, n)
}), {count: 0, sum: 0, min: Infinity, max: -Infinity})

const avg = stats.sum / stats.count
```

**Partition (group into two):**
```javascript
const [passed, failed] = students.reduce(
  ([pass, fail], student) => 
    student.score >= 60 
      ? [[...pass, student], fail]
      : [pass, [...fail, student]],
  [[], []]
)
```

---

### 7. Data Structures

#### **Stacks (LIFO - Last In, First Out)**
**Implementation with Array:**
```javascript
class Stack {
  constructor() {
    this.items = []
  }
  
  push(element) {
    this.items.push(element)  // O(1)
  }
  
  pop() {
    return this.items.pop()  // O(1)
  }
  
  peek() {
    return this.items[this.items.length - 1]
  }
  
  isEmpty() {
    return this.items.length === 0
  }
  
  size() {
    return this.items.length
  }
}
```

**Use Cases:**
- **Undo/Redo**: Store previous states
- **Browser History**: Back/forward navigation
- **Expression Evaluation**: Parse and evaluate mathematical expressions
- **Function Call Stack**: Runtime execution tracking
- **DFS (Depth-First Search)**: Graph/tree traversal
- **Backtracking**: Maze solving, puzzles

**Example - Balanced Parentheses:**
```javascript
function isBalanced(str) {
  const stack = []
  const pairs = {'(': ')', '[': ']', '{': '}'}
  
  for (const char of str) {
    if (char in pairs) {
      stack.push(char)
    } else if (Object.values(pairs).includes(char)) {
      if (pairs[stack.pop()] !== char) return false
    }
  }
  return stack.length === 0
}
```

---

#### **Queues (FIFO - First In, First Out)**
**Simple Implementation (inefficient):**
```javascript
class Queue {
  constructor() {
    this.items = []
  }
  
  enqueue(element) {
    this.items.push(element)  // O(1)
  }
  
  dequeue() {
    return this.items.shift()  // ⚠️ O(n) - shifts all elements
  }
  
  front() {
    return this.items[0]
  }
}
```

**Circular Queue (efficient):**
```javascript
class CircularQueue {
  constructor(capacity) {
    this.items = new Array(capacity)
    this.capacity = capacity
    this.front = 0
    this.rear = -1
    this.size = 0
  }
  
  enqueue(element) {
    if (this.isFull()) return false
    this.rear = (this.rear + 1) % this.capacity  // O(1)
    this.items[this.rear] = element
    this.size++
    return true
  }
  
  dequeue() {
    if (this.isEmpty()) return null
    const item = this.items[this.front]
    this.front = (this.front + 1) % this.capacity  // O(1)
    this.size--
    return item
  }
  
  isFull() {
    return this.size === this.capacity
  }
  
  isEmpty() {
    return this.size === 0
  }
}
```

**Use Cases:**
- **Task Queues**: Process jobs in order (job scheduler)
- **BFS (Breadth-First Search)**: Level-order traversal
- **Print Queue**: Manage printing jobs
- **Request Processing**: Server request handling
- **Cache**: LRU cache implementation

---

#### **Linked Lists**
**Singly Linked List:**
```javascript
class Node {
  constructor(data) {
    this.data = data
    this.next = null
  }
}

class LinkedList {
  constructor() {
    this.head = null
    this.size = 0
  }
  
  // Add at beginning - O(1)
  prepend(data) {
    const newNode = new Node(data)
    newNode.next = this.head
    this.head = newNode
    this.size++
  }
  
  // Add at end - O(n)
  append(data) {
    const newNode = new Node(data)
    if (!this.head) {
      this.head = newNode
    } else {
      let current = this.head
      while (current.next) {
        current = current.next
      }
      current.next = newNode
    }
    this.size++
  }
  
  // Delete node - O(n)
  delete(data) {
    if (!this.head) return
    
    if (this.head.data === data) {
      this.head = this.head.next
      this.size--
      return
    }
    
    let current = this.head
    while (current.next && current.next.data !== data) {
      current = current.next
    }
    
    if (current.next) {
      current.next = current.next.next
      this.size--
    }
  }
  
  // Search - O(n)
  find(data) {
    let current = this.head
    while (current) {
      if (current.data === data) return current
      current = current.next
    }
    return null
  }
}
```

**Pros:**
- Dynamic size (no pre-allocation)
- O(1) insertion/deletion at head
- Efficient insertions/deletions in middle (if you have the node)

**Cons:**
- O(n) access by index
- Extra memory for pointers
- Not cache-friendly (random memory locations)
- No backward traversal (singly linked)

**Use Cases:**
- Implement stacks/queues
- Undo functionality
- Hash table chaining
- Adjacency lists for graphs
- Music playlists

**Doubly Linked List:**
```javascript
class DoublyNode {
  constructor(data) {
    this.data = data
    this.next = null
    this.prev = null
  }
}
// Allows bidirectional traversal, easier deletions
```

---

### 8. Sorting & Searching

#### **Sorting Algorithms**
**Array.sort() - Built-in:**
```javascript
// ⚠️ Default: Lexicographic (string-based)
[10, 2, 3].sort()  // [10, 2, 3] - WRONG for numbers

// ✅ Use comparator
[10, 2, 3].sort((a, b) => a - b)  // [2, 3, 10] - Ascending
[10, 2, 3].sort((a, b) => b - a)  // [10, 3, 2] - Descending

// Objects
users.sort((a, b) => a.age - b.age)
products.sort((a, b) => a.name.localeCompare(b.name))  // Strings

// ✅ Stable since ES2019 (maintains relative order of equal elements)
```

**Bubble Sort** - O(n²):
```javascript
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]  // Swap
      }
    }
  }
  return arr
}
// Simple but slow, not used in practice
```

**Quick Sort** - O(n log n) average, O(n²) worst:
```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr
  
  const pivot = arr[arr.length - 1]
  const left = arr.filter((x, i) => x <= pivot && i < arr.length - 1)
  const right = arr.filter(x => x > pivot)
  
  return [...quickSort(left), pivot, ...quickSort(right)]
}
// Fast in practice, cache-friendly
```

**Merge Sort** - O(n log n) guaranteed:
```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr
  
  const mid = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, mid))
  const right = mergeSort(arr.slice(mid))
  
  return merge(left, right)
}

function merge(left, right) {
  const result = []
  let i = 0, j = 0
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++])
    } else {
      result.push(right[j++])
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j))
}
// Stable, predictable O(n log n), extra space O(n)
```

---

#### **Searching Algorithms**
**Linear Search** - O(n):
```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i
  }
  return -1
}
// Works on unsorted arrays
```

**Binary Search** - O(log n):
```javascript
function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    
    if (arr[mid] === target) return mid
    if (arr[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  
  return -1
}
// ⚠️ Requires sorted array
// Much faster for large datasets
```

**Built-in Methods Comparison:**
```javascript
// find() - Stops at first match
const user = users.find(u => u.id === 5)  // Returns element or undefined

// filter() - Checks all elements
const admins = users.filter(u => u.role === 'admin')  // Returns array

// indexOf() - Primitive equality
[1, 2, 3].indexOf(2)  // 1
[NaN].indexOf(NaN)    // -1 ⚠️ Can't find NaN

// includes() - Better for NaN
[1, 2, 3].includes(2)  // true
[NaN].includes(NaN)    // true ✅

// ✅ Use find() instead of filter()[0]
// ✅ Use some() instead of filter().length > 0
```

---

### 9. Performance Optimization

#### **Memory Efficiency**
- **Avoid Leaks**: Clear references, remove listeners, clear timers
- **WeakMap/WeakSet**: Enable garbage collection
- **Object Pooling**: Reuse objects in high-frequency scenarios
- **Typed Arrays**: `Int32Array`, `Float32Array` for numeric data

#### **Time Complexity**
- **Big O**: O(1) < O(log n) < O(n) < O(n log n) < O(n²)
- **Array Access**: O(1) by index, O(n) by search
- **Map/Set**: O(1) average for get/has/set/delete
- **Optimization**: Avoid nested loops, use Set/Map for lookups

---

### 10. Immutable Operations

#### **Immutability Concepts**
- **Why**: Predictability, easier debugging, safe sharing
- **Shallow Copy**: Spread, `Object.assign()` (nested objects shared)
- **Deep Copy**: `structuredClone()`, `JSON.parse(JSON.stringify())`
- **Object.freeze()**: Prevents modifications (shallow)
- **Libraries**: Immer for complex immutable updates

---

### 9. Performance Optimization

#### **Memory Efficiency**
**Avoid Memory Leaks:**
```javascript
// ❌ Accumulating references
const cache = {}
function store(key, value) {
  cache[key] = value  // Never cleaned up
}

// ✅ Use WeakMap for automatic cleanup
const cache = new WeakMap()
function store(obj, value) {
  cache.set(obj, value)  // Auto-removed when obj is GC'd
}

// ❌ Event listeners not removed
element.addEventListener('click', handler)
// Element removed but listener persists

// ✅ Clean up
element.removeEventListener('click', handler)

// ❌ Global variables
window.myData = largeArray  // Lives forever

// ✅ Local scope
function process() {
  const myData = largeArray  // GC'd when function completes
}
```

**Reduce Copying:**
```javascript
// ❌ Multiple copies
const arr1 = original.slice()
const arr2 = arr1.concat(newItems)
const arr3 = arr2.filter(x => x > 0)

// ✅ Chain operations
const result = original
  .slice()
  .concat(newItems)
  .filter(x => x > 0)

// ⚠️ Or mutate locally if appropriate
const result = [...original, ...newItems].filter(x => x > 0)
```

**WeakMap/WeakSet for Metadata:**
```javascript
// Store metadata without preventing GC
const metadata = new WeakMap()
function setMeta(obj, meta) {
  metadata.set(obj, meta)
}
// When obj is no longer referenced, metadata is auto-removed
```

**Sparse Arrays:**
```javascript
// ❌ Wastes memory
const arr = new Array(1000000)
arr[999999] = 'value'  // 999,999 empty slots

// ✅ Use object or Map
const map = new Map()
map.set(999999, 'value')  // Only stores actual entry
```

---

#### **Time Complexity**
**Array Operations:**
| Operation | Time Complexity | Note |
|-----------|----------------|------|
| `arr[i]` | O(1) | Direct access |
| `push()` | O(1) amortized | Add to end |
| `pop()` | O(1) | Remove from end |
| `shift()` | O(n) | Shifts all elements |
| `unshift()` | O(n) | Shifts all elements |
| `splice()` | O(n) | May shift elements |
| `indexOf()` | O(n) | Linear search |
| `includes()` | O(n) | Linear search |
| `find()` | O(n) | Linear search |
| `filter()` | O(n) | Must check all |
| `map()` | O(n) | Must transform all |
| `sort()` | O(n log n) | Built-in optimized |

**Set/Map Operations:**
| Operation | Time Complexity | Note |
|-----------|----------------|------|
| `set.add()` | O(1) | Hash-based |
| `set.has()` | O(1) | Hash lookup |
| `set.delete()` | O(1) | Hash-based |
| `map.set()` | O(1) | Hash-based |
| `map.get()` | O(1) | Hash lookup |
| `map.has()` | O(1) | Hash lookup |

**Optimize Nested Loops:**
```javascript
// ❌ O(n²) - Nested loops
function findCommon(arr1, arr2) {
  const common = []
  for (const item1 of arr1) {
    for (const item2 of arr2) {  // n * m iterations
      if (item1 === item2) common.push(item1)
    }
  }
  return common
}

// ✅ O(n) - Use Set
function findCommon(arr1, arr2) {
  const set = new Set(arr2)  // O(m)
  return arr1.filter(item => set.has(item))  // O(n)
}
// Total: O(n + m) instead of O(n * m)
```

**Early Exit:**
```javascript
// ❌ Checks all elements
const hasMatch = arr.filter(x => x > 10).length > 0  // O(n) always

// ✅ Stops at first match
const hasMatch = arr.some(x => x > 10)  // O(1) to O(n)
```

**Choose Right Method:**
```javascript
// Finding single element
const user = users.find(u => u.id === targetId)  // ✅ Stops early
const user = users.filter(u => u.id === targetId)[0]  // ❌ Checks all

// Checking existence
const exists = users.some(u => u.active)  // ✅ Stops early
const exists = users.filter(u => u.active).length > 0  // ❌ Checks all

// Getting count
const count = users.filter(u => u.active).length  // ✅ Need all anyway
const count = users.reduce((sum, u) => sum + (u.active ? 1 : 0), 0)  // Same O(n)
```

---

### 10. Immutability

#### **Immutable Operations Concepts**
**Why Immutability:**
- Predictable state changes
- Easier debugging (state history)
- Enables time-travel debugging
- Safe concurrency
- React/Redux requirements

**Shallow vs Deep Copy:**
```javascript
// Shallow copy - nested objects are still shared
const shallow = {...original}
const shallow2 = [...original]

const obj = {a: {b: 1}}
const copy = {...obj}
copy.a.b = 2  // ⚠️ Also changes original.a.b

// Deep copy
const deep = JSON.parse(JSON.stringify(obj))  // ⚠️ Loses functions, Dates, etc.
const deep2 = structuredClone(obj)  // ✅ Modern, handles more types
```

**When to Mutate:**
```javascript
// ✅ Local scope mutation is fine
function process(data) {
  const copy = [...data]  // Copy first
  copy.sort((a, b) => a - b)  // Mutate local copy
  return copy
}

// ❌ Don't mutate parameters or external state
function bad(arr) {
  arr.sort()  // Mutates caller's array
  return arr
}
```

---

#### **Immutable Arrays**
**ES2023 Immutable Methods:**
```javascript
const arr = [3, 1, 4, 1, 5]

// toSorted() - immutable sort
const sorted = arr.toSorted((a, b) => a - b)  // [1, 1, 3, 4, 5]
console.log(arr)  // [3, 1, 4, 1, 5] - unchanged

// toReversed() - immutable reverse
const reversed = arr.toReversed()  // [5, 1, 4, 1, 3]

// toSpliced() - immutable splice
const spliced = arr.toSpliced(1, 2, 10, 20)  // [3, 10, 20, 1, 5]

// with() - immutable element replacement
const replaced = arr.with(2, 99)  // [3, 1, 99, 1, 5]
```

**Traditional Immutable Patterns:**
```javascript
const arr = [1, 2, 3]

// Add to end
const newArr = [...arr, 4]  // [1, 2, 3, 4]

// Add to beginning
const newArr = [0, ...arr]  // [0, 1, 2, 3]

// Remove by index
const newArr = [...arr.slice(0, idx), ...arr.slice(idx + 1)]

// Replace by index
const newArr = [...arr.slice(0, idx), newValue, ...arr.slice(idx + 1)]
// Or with .with() (ES2023)
const newArr = arr.with(idx, newValue)

// Update conditionally
const newArr = arr.map(item => item.id === targetId ? {...item, updated: true} : item)

// Remove by condition
const newArr = arr.filter(item => item.id !== targetId)
```

**Performance Consideration:**
```javascript
// ⚠️ Creating many copies is expensive
let result = []
for (let i = 0; i < 10000; i++) {
  result = [...result, i]  // O(n) each iteration = O(n²) total
}

// ✅ Mutate locally, return once
function buildArray() {
  const result = []
  for (let i = 0; i < 10000; i++) {
    result.push(i)  // O(1) each = O(n) total
  }
  return result  // Immutable from caller's perspective
}
```

---

### 11. Lodash & Utility Libraries

#### **Lodash Basics**
**Common Utilities:**
```javascript
import _ from 'lodash'

// Array utilities
_.chunk([1, 2, 3, 4, 5], 2)  // [[1, 2], [3, 4], [5]]
_.uniq([1, 2, 2, 3])  // [1, 2, 3] - native: [...new Set(arr)]
_.intersection([1, 2], [2, 3])  // [2]
_.difference([1, 2], [2, 3])  // [1]

// Object utilities
_.get(obj, 'a.b.c', 'default')  // Safe nested access
_.set(obj, 'a.b.c', value)  // Set nested property
_.pick(obj, ['name', 'age'])  // {name: '...', age: ...}
_.omit(obj, ['password'])  // Everything except password

// Deep operations
_.cloneDeep(obj)  // True deep copy
_.merge(obj1, obj2)  // Deep merge

// Collection utilities
_.groupBy(arr, 'category')  // Group array of objects
_.keyBy(arr, 'id')  // Convert array to object keyed by property
_.sortBy(arr, ['age', 'name'])  // Multi-field sort

// Function utilities
_.debounce(fn, 300)  // Delay execution until calls stop
_.throttle(fn, 1000)  // Limit execution frequency
_.memoize(fn)  // Cache results
```

**When to Use Lodash:**
- Complex nested object operations
- Deep cloning/merging
- Debounce/throttle utilities
- Missing native equivalents
- Need consistent cross-browser behavior

**Native Alternatives:**
```javascript
// Many Lodash features now have native equivalents

// ❌ Lodash
_.map(arr, x => x * 2)
_.filter(arr, x => x > 0)
_.find(arr, {id: 1})

// ✅ Native
arr.map(x => x * 2)
arr.filter(x => x > 0)
arr.find(x => x.id === 1)

// ❌ Lodash
_.keys(obj)
_.values(obj)

// ✅ Native
Object.keys(obj)
Object.values(obj)
```

---

#### **Ramda**
**Functional Programming Library:**
```javascript
import * as R from 'ramda'

// Auto-curried functions
const add = R.add(10)  // Partially applied
add(5)  // 15

// Composition
const processData = R.pipe(
  R.filter(x => x > 0),
  R.map(x => x * 2),
  R.take(5)
)
processData([1, -2, 3, -4, 5, 6, 7])  // [2, 6, 10, 12, 14]

// compose - right to left
const transform = R.compose(
  R.join(', '),
  R.map(R.toUpper),
  R.split(' ')
)
transform('hello world')  // 'HELLO, WORLD'

// Data-last parameter order
const users = [{name: 'John', age: 30}, {name: 'Jane', age: 25}]
const getNames = R.map(R.prop('name'))
getNames(users)  // ['John', 'Jane']

// Path operations
const obj = {a: {b: {c: 42}}}
R.path(['a', 'b', 'c'], obj)  // 42
R.pathOr('default', ['a', 'b', 'x'], obj)  // 'default'
```

**Philosophy:**
- **Immutability**: Never mutates data
- **Currying**: All functions auto-curried
- **Composition**: Build complex operations from simple ones
- **Data-last**: Opposite of native JS (enables better composition)

**When to Use Ramda:**
- Functional programming style
- Heavy composition needs
- Point-free programming
- Complex data transformations

---

### 12. Best Practices

**Choose the Right Data Structure:**
```javascript
// ✅ Array: Order matters, need index access
const todos = [{id: 1, text: 'Task 1'}, ...]
todos[0]
todos.forEach(...)

// ✅ Set: Unique values, fast lookups
const uniqueIds = new Set([1, 2, 3])
uniqueIds.has(2)  // O(1)

// ✅ Map: Key-value pairs, non-string keys
const userCache = new Map()
userCache.set(userObj, userData)

// ✅ Object: Fixed structure, JSON serialization
const config = {host: 'localhost', port: 3000}
```

**Avoid Nested Loops:**
```javascript
// ❌ O(n²)
for (const item1 of arr1) {
  for (const item2 of arr2) {
    if (item1.id === item2.id) { }
  }
}

// ✅ O(n) - Use Map/Set
const map = new Map(arr2.map(item => [item.id, item]))
for (const item1 of arr1) {
  const match = map.get(item1.id)
  if (match) { }
}
```

**Prefer Immutability:**
```javascript
// ❌ Mutates original
function addItem(arr, item) {
  arr.push(item)
  return arr
}

// ✅ Returns new array
function addItem(arr, item) {
  return [...arr, item]
}

// ✅ Or use ES2023
const newArr = arr.toSpliced(arr.length, 0, newItem)
```

**Common Pitfalls:**
```javascript
// ❌ sort() default is lexicographic
[10, 2, 3].sort()  // [10, 2, 3]

// ✅ Use comparator
[10, 2, 3].sort((a, b) => a - b)  // [2, 3, 10]

// ❌ Sparse arrays
const arr = new Array(5)  // [empty × 5]
arr.map(x => 0)  // [empty × 5] - map skips empty

// ✅ Fill first
const arr = new Array(5).fill(0)  // [0, 0, 0, 0, 0]

// ❌ Array equality
[1, 2] === [1, 2]  // false (different references)

// ✅ Deep comparison
JSON.stringify(arr1) === JSON.stringify(arr2)  // Simple cases
// Or use library like Lodash _.isEqual()

// ❌ Modifying during iteration
arr.forEach((item, i) => {
  arr.splice(i, 1)  // ⚠️ Skips elements
})

// ✅ Use filter to remove
const filtered = arr.filter(item => shouldKeep(item))
```

**Performance Best Practices:**
```javascript
// ✅ Use appropriate methods
arr.some(x => x > 10)  // Not filter().length > 0
arr.find(x => x.id === id)  // Not filter()[0]

// ✅ Minimize iterations
// ❌ Multiple passes
const filtered = arr.filter(x => x > 0)
const mapped = filtered.map(x => x * 2)
const summed = mapped.reduce((a, b) => a + b, 0)

// ✅ Single pass
const result = arr.reduce((sum, x) => 
  x > 0 ? sum + (x * 2) : sum
, 0)

// ✅ Cache expensive operations
// ❌
arr.filter(x => expensiveCheck(x)).map(...)

// ✅
const cache = new Map()
arr.filter(x => {
  if (!cache.has(x)) cache.set(x, expensiveCheck(x))
  return cache.get(x)
}).map(...)
```

---

## 🎯 Interview Questions & Answers

### **Arrays**

**Q1: What's the difference between `map()` and `forEach()`?**
```javascript
// forEach - no return value, used for side effects
arr.forEach(item => console.log(item)); // undefined

// map - returns new array with transformed values
const doubled = arr.map(item => item * 2); // [2, 4, 6]
```
**Answer**: `map()` returns a new array with transformed elements. `forEach()` returns undefined and is used for side effects. Use `map()` when you need a transformed array, `forEach()` when performing actions.

---

**Q2: How do you remove duplicates from an array?**
```javascript
// Method 1: Set (fastest)
const unique = [...new Set([1, 2, 2, 3, 3, 4])]; // [1, 2, 3, 4]

// Method 2: filter
const unique = arr.filter((item, index) => arr.indexOf(item) === index);

// Method 3: reduce
const unique = arr.reduce((acc, item) => 
  acc.includes(item) ? acc : [...acc, item], []);

// For objects by property
const uniqueById = Array.from(
  new Map(users.map(u => [u.id, u])).values()
);
```

---

**Q3: Explain the difference between `sort()` and `toSorted()`.**
```javascript
const arr = [3, 1, 2];

// sort() - mutates original
arr.sort(); // arr is now [1, 2, 3]

// toSorted() - returns new array (ES2023)
const sorted = arr.toSorted(); // arr unchanged, sorted is [1, 2, 3]
```
**Answer**: `sort()` mutates the original array. `toSorted()` (ES2023) returns a new sorted array without modifying the original, following the immutability pattern.

---

**Q4: How does `reduce()` work?**
```javascript
// Sum
const sum = [1, 2, 3, 4].reduce((acc, num) => acc + num, 0); // 10

// Grouping
const grouped = items.reduce((acc, item) => {
  const key = item.category;
  (acc[key] = acc[key] || []).push(item);
  return acc;
}, {});

// Flattening
const flat = [[1, 2], [3, 4]].reduce((acc, arr) => acc.concat(arr), []);
```
**Answer**: `reduce()` executes a reducer function on each element, accumulating a result. Takes reducer function and initial value. Extremely versatile for aggregations, grouping, flattening, etc.

---

**Q5: What's the difference between `slice()` and `splice()`?**
```javascript
const arr = [1, 2, 3, 4, 5];

// slice(start, end) - non-mutating, extracts portion
const sub = arr.slice(1, 3); // [2, 3], arr unchanged

// splice(start, deleteCount, ...items) - mutating, modifies array
arr.splice(1, 2, 'a', 'b'); // arr is now [1, 'a', 'b', 4, 5]
```
**Answer**: `slice()` returns a shallow copy of a portion without modifying original. `splice()` mutates the array by removing/adding elements in place.

---

### **Objects & Maps**

**Q6: When should you use Map over Object?**
```javascript
// Use Object when:
const config = {theme: 'dark', lang: 'en'};
JSON.stringify(config); // Works

// Use Map when:
const cache = new Map();
cache.set({id: 1}, 'data');     // Object keys
cache.set(function(){}, 'fn');  // Function keys
cache.size;                      // O(1) size
cache.delete(key);               // Better performance for frequent add/delete
```
**Answer**: Use **Map** when you need: non-string keys, frequent additions/deletions, size property, guaranteed iteration order. Use **Object** for: simple key-value pairs, JSON serialization, fixed structure.

---

**Q7: Explain Object.freeze() vs Object.seal()?**
```javascript
const obj = {a: 1};

// freeze - completely immutable
Object.freeze(obj);
obj.a = 2;       // ❌ Blocked
obj.b = 3;       // ❌ Blocked
delete obj.a;    // ❌ Blocked

// seal - can modify existing properties
Object.seal(obj);
obj.a = 2;       // ✅ Allowed
obj.b = 3;       // ❌ Blocked
delete obj.a;    // ❌ Blocked

// Note: Both are shallow
```
**Answer**: `freeze()` prevents all modifications. `seal()` allows changing existing properties but prevents adding/deleting. Both are shallow (don't affect nested objects).

---

**Q8: How do you deeply clone an object?**
```javascript
const original = {a: 1, b: {c: 2}, date: new Date()};

// Method 1: structuredClone (modern, recommended)
const clone1 = structuredClone(original);

// Method 2: JSON (simple but limited)
const clone2 = JSON.parse(JSON.stringify(original));
// Issues: loses functions, dates, undefined, symbols

// Method 3: Recursive function
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}
```

---

### **Sets**

**Q9: How do you perform set operations (union, intersection, difference)?**
```javascript
const set1 = new Set([1, 2, 3, 4]);
const set2 = new Set([3, 4, 5, 6]);

// Union - all unique elements from both
const union = new Set([...set1, ...set2]); // {1,2,3,4,5,6}

// Intersection - common elements
const intersection = new Set([...set1].filter(x => set2.has(x))); // {3,4}

// Difference - in set1 but not set2
const difference = new Set([...set1].filter(x => !set2.has(x))); // {1,2}

// Symmetric difference - in either but not both
const symDiff = new Set([
  ...[...set1].filter(x => !set2.has(x)),
  ...[...set2].filter(x => !set1.has(x))
]); // {1,2,5,6}
```

---

**Q10: What's the difference between WeakMap and Map?**
```javascript
// Map - keys can be anything, prevents GC
const map = new Map();
let obj = {data: 'value'};
map.set(obj, 'cached');
obj = null; // Object still in memory due to Map!

// WeakMap - keys must be objects, allows GC
const weakMap = new WeakMap();
let obj2 = {data: 'value'};
weakMap.set(obj2, 'cached');
obj2 = null; // Object can be garbage collected

// WeakMap limitations: no iteration, no size, no clear()
```
**Answer**: **WeakMap** holds weak references to keys (must be objects), allowing garbage collection. **Map** holds strong references, preventing GC. Use WeakMap for metadata, caches, or private data tied to object lifetime.

---

### **Iteration & Loops**

**Q11: What are the different ways to iterate over an array?**
```javascript
const arr = [1, 2, 3];

// for loop - full control, can break
for (let i = 0; i < arr.length; i++) {
  if (condition) break;
}

// for...of - clean, can break
for (const item of arr) {
  if (condition) break;
}

// forEach - functional, cannot break
arr.forEach(item => console.log(item));

// map/filter/reduce - transformation
const doubled = arr.map(x => x * 2);

// for...in - iterates indices (avoid for arrays)
for (const index in arr) { /* indices as strings */ }
```

---

**Q12: Explain the difference between `some()` and `every()`?**
```javascript
const numbers = [1, 2, 3, 4, 5];

// some() - at least one match (short-circuits on first true)
numbers.some(n => n > 3);  // true (stops at 4)
numbers.some(n => n > 10); // false (checks all)

// every() - all must match (short-circuits on first false)
numbers.every(n => n > 0);  // true
numbers.every(n => n > 3);  // false (stops at 1)
```
**Answer**: `some()` returns true if **at least one** element passes the test (stops at first match). `every()` returns true if **all** elements pass (stops at first failure). Both short-circuit for efficiency.

---

### **Performance & Optimization**

**Q13: How do you optimize searching in an array?**
```javascript
// ❌ Slow: O(n²) - nested loops
function findCommon(arr1, arr2) {
  for (const a of arr1) {
    for (const b of arr2) {
      if (a === b) return true;
    }
  }
  return false;
}

// ✅ Fast: O(n) - use Set
function findCommon(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.some(item => set2.has(item));
}

// For repeated lookups, convert to Set/Map once
const set = new Set(largeArray);
const exists = set.has(value); // O(1) vs O(n)
```

---

**Q14: What's the time complexity of common array operations?**
```javascript
// O(1) - Constant time
arr[0]        // Access by index
arr.push()    // Add to end
arr.pop()     // Remove from end

// O(n) - Linear time
arr.shift()      // Remove from start (reindexes)
arr.unshift()    // Add to start (reindexes)
arr.indexOf()    // Search
arr.includes()   // Search
arr.map()        // Iterate all
arr.filter()     // Iterate all

// O(n log n) - Linearithmic
arr.sort()    // Sorting

// Map/Set operations - O(1) average
map.get()     // Get value
map.set()     // Set value
set.has()     // Check existence
```

---

**Q15: How can you prevent memory leaks in JavaScript?**
```javascript
// ❌ Leak: Global variables
function leak() {
  globalVar = [];  // Implicit global
}

// ❌ Leak: Event listeners not removed
element.addEventListener('click', handler);

// ❌ Leak: Timers not cleared
setInterval(fn, 1000);

// ❌ Leak: Closures holding large objects
function createLeak() {
  const huge = new Array(1000000);
  return () => console.log(huge[0]); // Keeps entire array
}

// ✅ Solutions:
// 1. Use const/let
const data = [];

// 2. Remove listeners
element.removeEventListener('click', handler);
// Or use AbortController
const controller = new AbortController();
element.addEventListener('click', handler, {signal: controller.signal});
controller.abort();

// 3. Clear timers
const id = setInterval(fn, 1000);
clearInterval(id);

// 4. Use WeakMap/WeakSet for object metadata
const metadata = new WeakMap();
metadata.set(obj, data); // Allows GC when obj is gone

// 5. Only keep what you need in closures
function noLeak() {
  const huge = new Array(1000000);
  const firstValue = huge[0];
  return () => console.log(firstValue); // Only keeps one value
}
```

---

### **Immutability**

**Q16: How do you update a nested object immutably?**
```javascript
const state = {
  user: {
    name: 'John',
    address: {
      city: 'NYC',
      zip: '10001'
    }
  }
};

// ❌ Mutating
state.user.address.city = 'LA'; // Mutates original

// ✅ Immutable - spread operator
const updated = {
  ...state,
  user: {
    ...state.user,
    address: {
      ...state.user.address,
      city: 'LA'
    }
  }
};

// ✅ Using Immer (cleaner for complex updates)
import {produce} from 'immer';
const updated = produce(state, draft => {
  draft.user.address.city = 'LA';
});
```

---

**Q17: What are the new immutable array methods in ES2023?**
```javascript
const arr = [3, 1, 4, 1, 5];

// toSorted() - immutable sort
const sorted = arr.toSorted((a, b) => a - b);
console.log(arr);    // [3, 1, 4, 1, 5] (unchanged)
console.log(sorted); // [1, 1, 3, 4, 5]

// toReversed() - immutable reverse
const reversed = arr.toReversed(); // [5, 1, 4, 1, 3]

// toSpliced() - immutable splice
const spliced = arr.toSpliced(2, 1, 99); // [3, 1, 99, 1, 5]

// with() - immutable element update
const updated = arr.with(0, 100); // [100, 1, 4, 1, 5]
```

---

### **Destructuring & Spread**

**Q18: How does the rest parameter work in destructuring?**
```javascript
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Object destructuring
const {name, age, ...other} = {name: 'John', age: 30, city: 'NYC', job: 'Dev'};
console.log(name);   // 'John'
console.log(other);  // {city: 'NYC', job: 'Dev'}

// Function parameters
function sum(first, ...numbers) {
  return first + numbers.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10
```

---

**Q19: What's the difference between shallow and deep copy?**
```javascript
const original = {a: 1, b: {c: 2}};

// Shallow copy - nested objects are shared
const shallow = {...original};
shallow.a = 10;    // Independent
shallow.b.c = 20;  // Affects original!

console.log(original.b.c); // 20 ❌

// Deep copy - fully independent
const deep = structuredClone(original);
deep.b.c = 30;

console.log(original.b.c); // 2 ✅

// Spread is shallow
const arr = [[1, 2], [3, 4]];
const copy = [...arr];
copy[0][0] = 99;
console.log(arr[0][0]); // 99 (shared reference)
```

---

### **Advanced Topics**

**Q20: Implement a function to group array elements by a key.**
```javascript
// Manual implementation
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = typeof key === 'function' ? key(item) : item[key];
    (result[group] = result[group] || []).push(item);
    return result;
  }, {});
}

const users = [
  {name: 'Alice', role: 'admin'},
  {name: 'Bob', role: 'user'},
  {name: 'Charlie', role: 'admin'}
];

groupBy(users, 'role');
// {admin: [{name: 'Alice'...}, {name: 'Charlie'...}], user: [{name: 'Bob'...}]}

groupBy(users, user => user.name.length);
// {5: [{name: 'Alice'}], 3: [{name: 'Bob'}], 7: [{name: 'Charlie'}]}

// ES2024 native
Object.groupBy(users, user => user.role);
Map.groupBy(users, user => user.role); // Returns Map
```

---

**Q21: How do you flatten a deeply nested array?**
```javascript
const nested = [1, [2, [3, [4, [5]]]]];

// Method 1: flat(Infinity)
const flat1 = nested.flat(Infinity); // [1, 2, 3, 4, 5]

// Method 2: Recursive
function flattenDeep(arr) {
  return arr.reduce((acc, val) =>
    Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val),
    []
  );
}

// Method 3: Stack-based (iterative)
function flatten(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.unshift(item);
    }
  }
  return result;
}
```

---

**Q22: Implement a simple LRU cache using Map.**
```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    // Remove if exists (will re-add at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Remove oldest if at capacity
    if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
}

const cache = new LRUCache(2);
cache.put(1, 'a');
cache.put(2, 'b');
cache.get(1);       // 'a' (makes 1 most recent)
cache.put(3, 'c');  // Evicts key 2
cache.get(2);       // -1 (not found)
```

---

**Q23: How do you implement debounce and throttle?**
```javascript
// Debounce - execute after delay, reset on new calls
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage: Search after user stops typing
const search = debounce((query) => {
  console.log('Searching:', query);
}, 300);

// Throttle - execute at most once per interval
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage: Scroll handler (max once per 100ms)
const onScroll = throttle(() => {
  console.log('Scrolling');
}, 100);

window.addEventListener('scroll', onScroll);
```

---

**Q24: Implement a function to find the intersection of two arrays.**
```javascript
// Method 1: Using Set (efficient)
function intersection(arr1, arr2) {
  const set2 = new Set(arr2);
  return [...new Set(arr1.filter(x => set2.has(x)))];
}

// Method 2: Using filter (simple but O(n²))
function intersection(arr1, arr2) {
  return [...new Set(arr1.filter(x => arr2.includes(x)))];
}

// Method 3: For sorted arrays (two pointers, O(n + m))
function intersectionSorted(arr1, arr2) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] === arr2[j]) {
      if (result[result.length - 1] !== arr1[i]) {
        result.push(arr1[i]);
      }
      i++;
      j++;
    } else if (arr1[i] < arr2[j]) {
      i++;
    } else {
      j++;
    }
  }
  
  return result;
}

console.log(intersection([1, 2, 2, 3, 4], [2, 2, 3, 5])); // [2, 3]
```

---

**Q25: How do you implement a binary search?**
```javascript
// Iterative approach
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}

// Recursive approach
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// Time: O(log n), Space: O(1) iterative, O(log n) recursive
const sorted = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(binarySearch(sorted, 7)); // 3
```

---

## 💡 Quick Tips

### Performance
- Use `Set` for O(1) lookups instead of `Array.includes()` (O(n))
- Use `Map` instead of object for frequent add/delete operations
- Prefer `find()` over `filter()[0]` to short-circuit
- Prefer `some()` over `filter().length > 0`
- Use binary search for sorted arrays (O(log n) vs O(n))

### Immutability
- Use spread `[...arr]`, `{...obj}` for shallow copies
- Use `structuredClone()` for deep copies
- Use ES2023 methods: `toSorted()`, `toReversed()`, `with()`
- Consider Immer for complex nested updates

### Common Patterns
```javascript
// Range: [0, 1, 2, ..., 9]
Array.from({length: 10}, (_, i) => i)

// Chunk array
const chunk = (arr, size) => 
  Array.from({length: Math.ceil(arr.length / size)}, 
    (_, i) => arr.slice(i * size, i * size + size))

// Unique by property
const uniqueById = Array.from(
  new Map(users.map(u => [u.id, u])).values()
)

// Count occurrences
const counts = arr.reduce((acc, val) => {
  acc[val] = (acc[val] || 0) + 1;
  return acc;
}, {})
```

---

## 📖 Resources

- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN: Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [TC39 Proposals](https://github.com/tc39/proposals)
- [JavaScript.info](https://javascript.info/)

---

**Last Updated**: December 2025  
**Total Topics**: 28  
**Interview Questions**: 25
