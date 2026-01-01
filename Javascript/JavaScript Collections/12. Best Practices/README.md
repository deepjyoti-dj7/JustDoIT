# Collection Best Practices

## Choosing Right Data Structure

### Array vs Set
```javascript
// ✅ Use Array when:
// - Order matters
// - Need index access
// - Allow duplicates
const tasks = ['task1', 'task2', 'task3'];
console.log(tasks[0]);  // Fast O(1)

// ✅ Use Set when:
// - Need unique values
// - Frequent existence checks
// - Order doesn't matter
const uniqueIds = new Set([1, 2, 3, 2, 1]);  // {1, 2, 3}
console.log(uniqueIds.has(2));  // Fast O(1)
```

### Object vs Map
```javascript
// ✅ Use Object when:
// - Simple key-value pairs
// - Keys are strings
// - Need JSON serialization
const config = {theme: 'dark', lang: 'en'};
JSON.stringify(config);  // Works

// ✅ Use Map when:
// - Keys can be any type
// - Frequent add/delete
// - Need size
// - Iterate in insertion order
const cache = new Map();
cache.set({id: 1}, 'data');  // Object as key
cache.set(function(){}, 'fn');  // Function as key
console.log(cache.size);  // O(1)
```

### Array vs Map for Lookups
```javascript
// ❌ Slow: Array for frequent lookups
const users = [{id: 1, name: 'A'}, {id: 2, name: 'B'}];
const user = users.find(u => u.id === 2);  // O(n)

// ✅ Fast: Map for frequent lookups
const userMap = new Map([[1, {name: 'A'}], [2, {name: 'B'}]]);
const user = userMap.get(2);  // O(1)

// Trade-off: Map uses more memory
```

## Performance Guidelines

### Avoid Nested Loops
```javascript
// ❌ Bad: O(n²)
function findCommon(arr1, arr2) {
  const common = [];
  for (const a of arr1) {
    for (const b of arr2) {
      if (a === b) common.push(a);
    }
  }
  return common;
}

// ✅ Good: O(n + m)
function findCommon(arr1, arr2) {
  const set2 = new Set(arr2);
  return arr1.filter(item => set2.has(item));
}
```

### Choose Right Method
```javascript
// ❌ Bad: filter().length for existence
const exists = arr.filter(x => x === target).length > 0;  // O(n)

// ✅ Good: some() short-circuits
const exists = arr.some(x => x === target);  // O(1) to O(n)

// ✅ Better: Set for repeated checks
const set = new Set(arr);
const exists = set.has(target);  // O(1)
```

### Minimize Array Copying
```javascript
// ❌ Bad: Multiple copies
let arr = [1, 2, 3];
arr = [...arr, 4];
arr = [...arr, 5];
arr = [...arr, 6];

// ✅ Good: Build then copy
const temp = [1, 2, 3];
temp.push(4, 5, 6);
const arr = [...temp];  // One copy

// ✅ Best: If mutation OK
const arr = [1, 2, 3];
arr.push(4, 5, 6);
```

### Cache Calculations
```javascript
// ❌ Bad: Recalculate
for (let i = 0; i < arr.length; i++) {
  expensive(arr[i]);
}

// ✅ Good: Cache length
const len = arr.length;
for (let i = 0; i < len; i++) {
  expensive(arr[i]);
}

// Note: Modern engines optimize this anyway
```

## Immutability Patterns

### Array Updates
```javascript
// ❌ Mutating
const arr = [1, 2, 3];
arr.push(4);        // Mutates
arr[0] = 10;        // Mutates
arr.sort();         // Mutates

// ✅ Immutable
const arr2 = [...arr, 4];           // Add
const arr3 = arr.with(0, 10);       // Update (ES2023)
const arr4 = arr.toSorted();        // Sort (ES2023)
const arr5 = arr.filter((_, i) => i !== 0);  // Remove
```

### Object Updates
```javascript
// ❌ Mutating
const obj = {a: 1, b: 2};
obj.c = 3;         // Mutates
delete obj.b;      // Mutates

// ✅ Immutable
const obj2 = {...obj, c: 3};        // Add
const {b, ...obj3} = obj;           // Remove

// Nested update
const nested = {a: 1, b: {c: 2}};
const updated = {
  ...nested,
  b: {...nested.b, c: 3}
};
```

### When to Mutate
```javascript
// ✅ OK: Local scope
function process(data) {
  const copy = [...data];
  copy.sort();
  copy.reverse();
  return copy;  // No external mutation
}

// ✅ OK: Building result
function buildArray(n) {
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(i);
  }
  return Object.freeze(result);
}
```

## Common Pitfalls

### Array.sort() Default Behavior
```javascript
// ❌ Wrong: Sorts as strings
const numbers = [10, 5, 40, 25, 1000];
numbers.sort();
console.log(numbers);  // [10, 1000, 25, 40, 5] ❌

// ✅ Correct: Numeric sort
numbers.sort((a, b) => a - b);
console.log(numbers);  // [5, 10, 25, 40, 1000] ✅
```

### Sparse Arrays
```javascript
// ❌ Creates sparse array
const arr = new Array(3);  // [empty × 3]
arr.map(x => 1);          // Still [empty × 3]

// ✅ Dense array
const arr = Array.from({length: 3}, () => 0);  // [0, 0, 0]
arr.map(x => 1);  // [1, 1, 1]
```

### Array vs Reference Comparison
```javascript
// ❌ Arrays are never equal
console.log([1, 2] === [1, 2]);  // false

// ✅ Compare values
function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

// Or JSON (simple values only)
JSON.stringify([1, 2]) === JSON.stringify([1, 2]);  // true
```

### Object Key Coercion
```javascript
const obj = {};
const key1 = {id: 1};
const key2 = {id: 2};

obj[key1] = 'value1';
obj[key2] = 'value2';

console.log(obj);  // {'[object Object]': 'value2'} ❌

// ✅ Use Map for object keys
const map = new Map();
map.set(key1, 'value1');
map.set(key2, 'value2');
```

### forEach Cannot Break
```javascript
// ❌ Can't break from forEach
arr.forEach(item => {
  if (condition) break;  // SyntaxError!
});

// ✅ Use for...of instead
for (const item of arr) {
  if (condition) break;  // Works
}

// Or find() if looking for one
const found = arr.find(item => condition);
```

## Code Examples

### Deduplication
```javascript
// Simple values
const unique = [...new Set([1, 2, 2, 3])];  // [1, 2, 3]

// Objects by property
const uniqueById = Array.from(
  new Map(users.map(u => [u.id, u])).values()
);
```

### Grouping
```javascript
// Modern (ES2024)
const grouped = Object.groupBy(items, item => item.category);

// Manual
const grouped = items.reduce((acc, item) => {
  const key = item.category;
  (acc[key] = acc[key] || []).push(item);
  return acc;
}, {});
```

### Flattening
```javascript
// Shallow
const flat = arr.flat();  // One level

// Deep
const flatAll = arr.flat(Infinity);

// With map
const flatMapped = arr.flatMap(x => [x, x * 2]);
```

### Safe Property Access
```javascript
// ❌ Can throw
const city = user.address.city;

// ✅ Optional chaining
const city = user?.address?.city;

// ✅ Default value
const city = user?.address?.city ?? 'Unknown';
```

### Chunking Arrays
```javascript
function chunk(arr, size) {
  return Array.from(
    {length: Math.ceil(arr.length / size)},
    (_, i) => arr.slice(i * size, i * size + size)
  );
}

const chunked = chunk([1, 2, 3, 4, 5, 6, 7], 3);
// [[1, 2, 3], [4, 5, 6], [7]]
```

### Range Generation
```javascript
// Numbers 0-9
const range = Array.from({length: 10}, (_, i) => i);

// Custom range
const range2 = Array.from({length: 5}, (_, i) => i * 2);  // [0, 2, 4, 6, 8]

// Or spread
const range3 = [...Array(10).keys()];  // [0, 1, ..., 9]
```

## Key Takeaways

- **Choose structure** based on operations needed
- **Set/Map** for O(1) lookups
- **Array** when order and indexing matter
- **Avoid nested loops** - use Set/Map
- **Immutability** for predictable code
- **sort()** needs comparison function for numbers
- **Use appropriate methods** (some vs filter)
- **Optional chaining** for safe access
- **Modern methods** (toSorted, groupBy, with)
- **Performance matters** for large datasets
