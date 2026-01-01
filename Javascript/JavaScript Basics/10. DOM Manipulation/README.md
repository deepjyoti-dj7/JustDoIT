# DOM Manipulation - Quick Summary & Interview Guide

## 📋 Quick Notes

### 1. Selecting Elements

**Basic Selectors:**
```javascript
// Get by ID (returns single element or null)
const header = document.getElementById('header');

// Get by class name (returns HTMLCollection - live)
const items = document.getElementsByClassName('item');
console.log(items[0]);  // First item

// Get by tag name (returns HTMLCollection - live)
const paragraphs = document.getElementsByTagName('p');

// Query selector (returns first match or null)
const firstButton = document.querySelector('.btn');
const navLink = document.querySelector('#nav a.active');

// Query selector all (returns NodeList - static)
const allButtons = document.querySelectorAll('.btn');
allButtons.forEach(btn => console.log(btn));  // Can use forEach

// Difference: HTMLCollection vs NodeList
const liveCollection = document.getElementsByClassName('item');  // Live
const staticList = document.querySelectorAll('.item');  // Static

document.body.innerHTML += '<div class="item">New</div>';
console.log(liveCollection.length);  // Updates automatically
console.log(staticList.length);      // Doesn't update
```

**Modern Selectors:**
```javascript
// Closest (traverses up)
const button = document.querySelector('.btn');
const container = button.closest('.container');  // Finds ancestor

// Matches (checks if element matches selector)
if (button.matches('.btn-primary')) {
  console.log('Primary button');
}

// Children elements
const parent = document.querySelector('.parent');
parent.children;  // HTMLCollection of child elements
parent.firstElementChild;
parent.lastElementChild;
parent.childElementCount;
```

---

### 2. Traversing the DOM

**Parent/Child/Sibling:**
```javascript
const element = document.querySelector('.item');

// Parent
element.parentElement;        // Parent element
element.parentNode;           // Parent node (can be non-element)
element.closest('.container'); // Nearest ancestor matching selector

// Children
element.children;             // HTMLCollection of child elements
element.childNodes;           // NodeList (includes text nodes)
element.firstElementChild;    // First child element
element.lastElementChild;     // Last child element

// Siblings
element.nextElementSibling;   // Next sibling element
element.previousElementSibling; // Previous sibling element
element.nextSibling;          // Next node (can be text)
element.previousSibling;      // Previous node

// Example: Navigate tree
const nav = document.querySelector('nav');
const firstLink = nav.firstElementChild;
const secondLink = firstLink.nextElementSibling;
const parent = firstLink.parentElement;

// Traverse all children
const parent = document.querySelector('.parent');
Array.from(parent.children).forEach((child, index) => {
  console.log(`Child ${index}:`, child.textContent);
});
```

---

### 3. Creating and Modifying Elements

**Creating Elements:**
```javascript
// Create element
const div = document.createElement('div');
div.className = 'container';
div.id = 'main';

// Set content
div.textContent = 'Hello World';  // Text only (safe)
div.innerHTML = '<strong>Hello</strong> World';  // HTML (XSS risk)

// Create with attributes
const link = document.createElement('a');
link.href = 'https://example.com';
link.textContent = 'Click me';
link.target = '_blank';
link.rel = 'noopener noreferrer';

// Create text node
const text = document.createTextNode('Plain text');

// Create document fragment (better performance)
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
document.querySelector('ul').appendChild(fragment);  // Single reflow
```

**Inserting Elements:**
```javascript
const parent = document.querySelector('.parent');
const child = document.createElement('div');

// Append (end)
parent.appendChild(child);
parent.append(child, 'Text', otherElement);  // Multiple items

// Prepend (beginning)
parent.prepend(child);

// Insert before/after
const reference = document.querySelector('.reference');
parent.insertBefore(child, reference);  // Before reference

// Modern methods
reference.before(child);   // Before reference
reference.after(child);    // After reference
reference.replaceWith(child);  // Replace reference

// Insert adjacent
element.insertAdjacentHTML('beforebegin', '<div>Before</div>');
element.insertAdjacentHTML('afterbegin', '<div>Start</div>');
element.insertAdjacentHTML('beforeend', '<div>End</div>');
element.insertAdjacentHTML('afterend', '<div>After</div>');

// Positions:
// beforebegin: <div>Before</div>
// <element>
//   afterbegin: <div>Start</div>
//   ...existing content...
//   beforeend: <div>End</div>
// </element>
// afterend: <div>After</div>
```

**Removing Elements:**
```javascript
// Remove element
const element = document.querySelector('.remove-me');
element.remove();  // Modern way

// Old way
element.parentNode.removeChild(element);

// Remove all children
const parent = document.querySelector('.parent');
parent.innerHTML = '';  // Fast but loses event listeners

// Better: remove individually
while (parent.firstChild) {
  parent.removeChild(parent.firstChild);
}

// Or modern
parent.replaceChildren();  // Removes all children
```

---

### 4. Attributes and Properties

**Working with Attributes:**
```javascript
const input = document.querySelector('input');

// Get/set attributes
input.getAttribute('type');          // 'text'
input.setAttribute('type', 'email');
input.hasAttribute('required');      // false
input.removeAttribute('disabled');

// Data attributes
// <div data-user-id="123" data-role="admin">
const div = document.querySelector('div');
div.dataset.userId;   // '123'
div.dataset.role;     // 'admin'
div.dataset.newAttr = 'value';  // Sets data-new-attr="value"

// Class manipulation
div.className = 'container active';  // Replace all classes
div.classList.add('highlight');      // Add class
div.classList.remove('active');      // Remove class
div.classList.toggle('dark-mode');   // Toggle class
div.classList.contains('container'); // Check class
div.classList.replace('old', 'new'); // Replace class

// Style manipulation
div.style.color = 'red';
div.style.backgroundColor = 'blue';  // camelCase
div.style.fontSize = '16px';

// Get computed styles
const styles = window.getComputedStyle(div);
styles.color;        // Actual rendered color
styles.fontSize;     // Actual font size

// Properties vs Attributes
input.value = 'text';           // Property (live)
input.setAttribute('value', 'text');  // Attribute (initial)

input.value;                    // Current value
input.getAttribute('value');    // Initial value
```

---

### 5. Event Handling

**Adding Event Listeners:**
```javascript
const button = document.querySelector('button');

// Add listener
button.addEventListener('click', function(event) {
  console.log('Clicked!', event);
});

// Arrow function
button.addEventListener('click', (e) => {
  console.log('Target:', e.target);
  console.log('Current:', e.currentTarget);
});

// Named function (can remove later)
function handleClick(event) {
  console.log('Clicked');
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);

// Options
button.addEventListener('click', handler, {
  once: true,      // Remove after first trigger
  capture: true,   // Use capture phase
  passive: true    // Never calls preventDefault()
});
```

**Event Object:**
```javascript
element.addEventListener('click', (e) => {
  e.target;           // Element that triggered event
  e.currentTarget;    // Element listener is attached to
  e.type;             // 'click'
  e.preventDefault(); // Prevent default behavior
  e.stopPropagation(); // Stop bubbling
  e.stopImmediatePropagation(); // Stop other listeners too
  
  // Mouse events
  e.clientX, e.clientY;  // Viewport coordinates
  e.pageX, e.pageY;      // Document coordinates
  e.offsetX, e.offsetY;  // Element coordinates
  
  // Keyboard events
  e.key;      // 'Enter', 'a', 'ArrowUp'
  e.code;     // 'KeyA', 'Enter'
  e.ctrlKey;  // Ctrl pressed
  e.shiftKey; // Shift pressed
  e.altKey;   // Alt pressed
});
```

**Event Delegation:**
```javascript
// Instead of adding listener to each item
const list = document.querySelector('ul');

list.addEventListener('click', (e) => {
  if (e.target.matches('li')) {
    console.log('List item clicked:', e.target.textContent);
  }
  
  // Or with closest
  const item = e.target.closest('li');
  if (item && list.contains(item)) {
    console.log('Item:', item.textContent);
  }
});

// Benefits: Works for dynamically added elements
const newItem = document.createElement('li');
newItem.textContent = 'New Item';
list.appendChild(newItem);  // Already has listener via delegation
```

---

### 6. Form Handling

**Form Events and Values:**
```javascript
const form = document.querySelector('form');
const input = document.querySelector('input[name="email"]');

// Form events
form.addEventListener('submit', (e) => {
  e.preventDefault();  // Prevent page reload
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  console.log(data);
});

// Input events
input.addEventListener('input', (e) => {
  console.log('Typing:', e.target.value);  // On every keystroke
});

input.addEventListener('change', (e) => {
  console.log('Changed:', e.target.value);  // On blur/enter
});

// Get form values
const email = form.elements.email.value;
const password = form.elements.password.value;

// Checkboxes and radios
const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.checked;  // true/false

const radio = document.querySelector('input[type="radio"]:checked');
radio?.value;

// Select dropdowns
const select = document.querySelector('select');
select.value;              // Selected value
select.selectedIndex;      // Selected index
select.options[0].selected = true;  // Set selection

// Form validation
input.setCustomValidity('Invalid email format');
input.reportValidity();    // Show validation message
form.checkValidity();      // Check if form is valid
```

---

### 7. Performance Optimization

**Efficient DOM Updates:**
```javascript
// ❌ BAD: Multiple reflows
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  document.body.appendChild(div);  // Reflow each time
}

// ✅ GOOD: Single reflow with fragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
document.body.appendChild(fragment);  // Single reflow

// ❌ BAD: Reading layout properties in loop
for (let i = 0; i < elements.length; i++) {
  elements[i].style.top = elements[i].offsetTop + 10 + 'px';  // Forced reflow
}

// ✅ GOOD: Batch reads and writes
const offsets = [];
for (let i = 0; i < elements.length; i++) {
  offsets.push(elements[i].offsetTop);  // Read phase
}
for (let i = 0; i < elements.length; i++) {
  elements[i].style.top = offsets[i] + 10 + 'px';  // Write phase
}

// Use requestAnimationFrame for visual changes
function updatePosition() {
  element.style.left = position + 'px';
  requestAnimationFrame(updatePosition);
}
requestAnimationFrame(updatePosition);

// Debouncing scroll/resize events
let timeout;
window.addEventListener('scroll', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    console.log('Scrolled');
  }, 200);
});
```

**Memory Management:**
```javascript
// Remove event listeners when done
const handler = () => console.log('Click');
button.addEventListener('click', handler);
button.removeEventListener('click', handler);

// Use weak references for large data
const cache = new WeakMap();
cache.set(element, { data: 'large object' });  // Auto-cleaned when element removed

// Clone nodes efficiently
const original = document.querySelector('.template');
const clone = original.cloneNode(true);  // Deep clone
document.body.appendChild(clone);
```

---

### 8. Common Patterns

**Loading Content Dynamically:**
```javascript
async function loadContent(url) {
  const container = document.querySelector('#content');
  
  // Show loader
  container.innerHTML = '<div class="loader">Loading...</div>';
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    container.innerHTML = html;
  } catch (error) {
    container.innerHTML = '<p class="error">Failed to load content</p>';
  }
}
```

**Creating Reusable Components:**
```javascript
function createCard(data) {
  const card = document.createElement('div');
  card.className = 'card';
  
  card.innerHTML = `
    <img src="${data.image}" alt="${data.title}">
    <h3>${data.title}</h3>
    <p>${data.description}</p>
    <button data-id="${data.id}">View</button>
  `;
  
  return card;
}

// Usage
const data = { image: 'img.jpg', title: 'Title', description: 'Desc', id: 1 };
const card = createCard(data);
document.querySelector('.container').appendChild(card);
```

**Toggle Visibility:**
```javascript
function toggleElement(selector) {
  const element = document.querySelector(selector);
  element.classList.toggle('hidden');
  
  // Or with display
  if (element.style.display === 'none') {
    element.style.display = '';
  } else {
    element.style.display = 'none';
  }
}

// Modal pattern
function showModal(content) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      ${content}
      <button class="close">×</button>
    </div>
  `;
  
  modal.querySelector('.close').addEventListener('click', () => {
    modal.remove();
  });
  
  document.body.appendChild(modal);
}
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between `innerHTML`, `textContent`, and `innerText`?

**Answer:**

```javascript
const div = document.createElement('div');
div.innerHTML = '<strong>Bold</strong> text';

// innerHTML - Parses HTML
console.log(div.innerHTML);  // '<strong>Bold</strong> text'

// textContent - Plain text, includes hidden elements
console.log(div.textContent);  // 'Bold text'

// innerText - Rendered text, respects CSS
console.log(div.innerText);    // 'Bold text'

// Key differences:
const element = document.querySelector('.test');
element.innerHTML = `
  <style>p { display: none; }</style>
  <p>Hidden</p>
  <span>Visible</span>
`;

element.textContent;  // Includes hidden text and styles
element.innerText;    // Only visible text (triggers reflow)

// Security: XSS vulnerability
const userInput = '<img src=x onerror="alert(1)">';
element.innerHTML = userInput;  // ⚠️ Executes script!
element.textContent = userInput;  // ✅ Safe, shows as text

// Performance
element.textContent = 'Fast';   // Fast
element.innerText = 'Slow';     // Triggers reflow (slow)
```

**Summary:**
- `innerHTML`: Parses HTML (XSS risk, use carefully)
- `textContent`: All text content (fast, safe)
- `innerText`: Visible text only (slow, triggers reflow)

---

### Q2: Explain event bubbling and capturing with examples.

**Answer:**

**Event Flow Phases:**
```html
<div id="parent">
  <button id="child">Click</button>
</div>
```

```javascript
const parent = document.querySelector('#parent');
const child = document.querySelector('#child');

// Bubbling (default) - child → parent
child.addEventListener('click', () => {
  console.log('Child clicked');
});

parent.addEventListener('click', () => {
  console.log('Parent clicked');
});

// Click button:
// "Child clicked"
// "Parent clicked"  ← Bubbles up

// Capturing - parent → child
parent.addEventListener('click', () => {
  console.log('Parent (capture)');
}, { capture: true });

child.addEventListener('click', () => {
  console.log('Child');
});

// Click button:
// "Parent (capture)"  ← Captures down
// "Child"

// Stop propagation
child.addEventListener('click', (e) => {
  console.log('Child');
  e.stopPropagation();  // Stops bubbling
});

parent.addEventListener('click', () => {
  console.log('Never runs');  // Blocked
});
```

**Event Delegation (using bubbling):**
```javascript
// Instead of this (inefficient):
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handleClick);
});

// Do this (efficient):
document.querySelector('.list').addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e);
  }
});

// Works for dynamically added elements
const newItem = document.createElement('div');
newItem.className = 'item';
list.appendChild(newItem);  // Already has listener!
```

---

### Q3: How do you prevent memory leaks when working with DOM?

**Answer:**

```javascript
// ❌ Memory leak: Event listeners not removed
class Widget {
  constructor(element) {
    this.element = element;
    this.handleClick = () => {
      console.log('Clicked');
    };
    this.element.addEventListener('click', this.handleClick);
  }
  
  // Missing cleanup - element reference persists
}

// ✅ Proper cleanup
class Widget {
  constructor(element) {
    this.element = element;
    this.handleClick = () => console.log('Clicked');
    this.element.addEventListener('click', this.handleClick);
  }
  
  destroy() {
    this.element.removeEventListener('click', this.handleClick);
    this.element = null;  // Break reference
  }
}

// ❌ Closure keeping large objects in memory
function setupHandler() {
  const largeData = new Array(1000000).fill('data');
  
  button.addEventListener('click', () => {
    console.log(largeData.length);  // Holds reference to largeData
  });
}

// ✅ Store only what's needed
function setupHandler() {
  const largeData = new Array(1000000).fill('data');
  const length = largeData.length;  // Copy primitive
  
  button.addEventListener('click', () => {
    console.log(length);  // largeData can be GC'd
  });
}

// ✅ Use WeakMap for element-data association
const elementData = new WeakMap();

function attachData(element, data) {
  elementData.set(element, data);  // Auto-cleaned when element removed
}

// ✅ AbortController for cleanup
const controller = new AbortController();

button.addEventListener('click', handler, {
  signal: controller.signal
});

// Later: Remove all listeners
controller.abort();
```

---

### Q4: What's the difference between `createElement` and `cloneNode`?

**Answer:**

```javascript
// createElement - Create new element from scratch
const div1 = document.createElement('div');
div1.className = 'box';
div1.textContent = 'New';

// cloneNode - Copy existing element
const template = document.querySelector('.template');
const div2 = template.cloneNode(true);  // Deep clone (with children)
const div3 = template.cloneNode(false); // Shallow (no children)

// Example: Template pattern
const template = document.querySelector('#card-template');

function createCard(data) {
  const card = template.cloneNode(true);  // Clone template
  card.querySelector('.title').textContent = data.title;
  card.querySelector('.desc').textContent = data.desc;
  return card;
}

// Cloning preserves structure but not event listeners
const original = document.createElement('button');
original.addEventListener('click', () => console.log('Click'));

const clone = original.cloneNode(true);
clone.click();  // No output - listeners not cloned

// Performance: cloneNode is faster for complex structures
// createElement + building: ~1000 ops/sec
// cloneNode: ~5000 ops/sec (approx)
```

**When to use:**
- `createElement`: Unique elements, dynamic structure
- `cloneNode`: Templates, repeated structures

---

### Q5: How do you efficiently update a large list?

**Answer:**

```javascript
// ❌ BAD: Causes multiple reflows
const list = document.querySelector('ul');
data.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  list.appendChild(li);  // Reflow each time
});

// ✅ GOOD: DocumentFragment (single reflow)
const fragment = document.createDocumentFragment();
data.forEach(item => {
  const li = document.createElement('li');
  li.textContent = item;
  fragment.appendChild(li);
});
list.appendChild(fragment);  // One reflow

// ✅ BETTER: innerHTML (fastest for simple content)
const html = data.map(item => `<li>${item}</li>`).join('');
list.innerHTML = html;

// ✅ BEST: Virtual scrolling for huge lists
class VirtualList {
  constructor(container, items, rowHeight) {
    this.container = container;
    this.items = items;
    this.rowHeight = rowHeight;
    this.visibleRows = Math.ceil(container.clientHeight / rowHeight);
    
    this.render(0);
    
    container.addEventListener('scroll', () => {
      const scrollTop = container.scrollTop;
      const firstVisible = Math.floor(scrollTop / rowHeight);
      this.render(firstVisible);
    });
  }
  
  render(startIndex) {
    const endIndex = startIndex + this.visibleRows;
    const visible = this.items.slice(startIndex, endIndex);
    
    this.container.innerHTML = visible.map((item, i) => {
      const actualIndex = startIndex + i;
      const top = actualIndex * this.rowHeight;
      return `<div style="position: absolute; top: ${top}px">${item}</div>`;
    }).join('');
    
    this.container.style.height = this.items.length * this.rowHeight + 'px';
  }
}

// Renders only visible items (e.g., 20 out of 10,000)
const list = new VirtualList(container, hugeArray, 50);
```

---

### Q6: How do you handle dynamically added elements?

**Answer:**

```javascript
// ❌ WRONG: Listeners on existing elements only
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', handler);
});

// New items won't have listener
const newItem = document.createElement('div');
newItem.className = 'item';
list.appendChild(newItem);  // No listener!

// ✅ RIGHT: Event delegation
list.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handler(e);
  }
});

// Now works for all items (current and future)
list.appendChild(newItem);  // Has listener via delegation

// Advanced: Delegation with multiple selectors
list.addEventListener('click', (e) => {
  // Delete button
  if (e.target.matches('.delete-btn')) {
    e.target.closest('.item').remove();
  }
  
  // Edit button
  if (e.target.matches('.edit-btn')) {
    const item = e.target.closest('.item');
    editItem(item);
  }
  
  // Item itself
  if (e.target.matches('.item')) {
    selectItem(e.target);
  }
});

// MutationObserver for complex scenarios
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.matches && node.matches('.item')) {
        console.log('New item added:', node);
      }
    });
  });
});

observer.observe(list, { childList: true, subtree: true });
```

---

### Q7: What causes reflows and how do you minimize them?

**Answer:**

**Actions that trigger reflows:**
```javascript
// Reading layout properties
element.offsetWidth, element.offsetHeight
element.clientWidth, element.clientHeight
element.scrollTop, element.scrollLeft
element.getBoundingClientRect()
window.getComputedStyle(element)

// Modifying layout
element.style.width = '100px'
element.classList.add('wide')
element.innerHTML = '<div>...</div>'

// ❌ BAD: Interleaved read/write
for (let i = 0; i < elements.length; i++) {
  const width = elements[i].offsetWidth;  // Read (reflow)
  elements[i].style.width = width + 10 + 'px';  // Write (invalidates layout)
  // Next iteration: reflow again
}

// ✅ GOOD: Batch reads, then writes
const widths = [];
for (let i = 0; i < elements.length; i++) {
  widths.push(elements[i].offsetWidth);  // Batch reads
}
for (let i = 0; i < elements.length; i++) {
  elements[i].style.width = widths[i] + 10 + 'px';  // Batch writes
}

// ✅ Use CSS classes instead of inline styles
// Bad
element.style.width = '100px';
element.style.height = '100px';
element.style.backgroundColor = 'red';

// Good
element.classList.add('large-red-box');

// ✅ Use transform for animations (no reflow)
// Bad (triggers reflow)
element.style.left = '100px';

// Good (GPU accelerated, no reflow)
element.style.transform = 'translateX(100px)';

// ✅ Detach from DOM during bulk updates
const parent = element.parentNode;
parent.removeChild(element);

// Make changes
for (let i = 0; i < 100; i++) {
  element.appendChild(createChild());
}

parent.appendChild(element);  // Single reflow
```

---

### Q8: How do you sanitize user input before inserting into DOM?

**Answer:**

```javascript
// ❌ DANGEROUS: XSS vulnerability
const userInput = '<img src=x onerror="alert(1)">';
element.innerHTML = userInput;  // Executes script!

// ✅ Use textContent for plain text
element.textContent = userInput;  // Safe, no HTML parsing

// ✅ Sanitize HTML with DOMPurify library
import DOMPurify from 'dompurify';

const dirty = '<img src=x onerror="alert(1)"> <b>Safe</b>';
const clean = DOMPurify.sanitize(dirty);
element.innerHTML = clean;  // '<b>Safe</b>' (script removed)

// ✅ Manual sanitization
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

const safe = escapeHTML('<script>alert(1)</script>');
// '&lt;script&gt;alert(1)&lt;/script&gt;'

// ✅ Template literals with escaping
function renderComment(comment) {
  const escaped = escapeHTML(comment.text);
  return `
    <div class="comment">
      <strong>${escapeHTML(comment.author)}</strong>
      <p>${escaped}</p>
    </div>
  `;
}

// ✅ Use createElement for dynamic content
function createCard(data) {
  const card = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = data.title;  // Safe
  
  const desc = document.createElement('p');
  desc.textContent = data.description;  // Safe
  
  card.appendChild(title);
  card.appendChild(desc);
  return card;
}
```

---

### Q9: What's the difference between `getAttribute` and property access?

**Answer:**

```javascript
const input = document.querySelector('input');

// Properties - Live values
input.value = 'new value';
console.log(input.value);  // 'new value' (current)

// Attributes - Initial values (in HTML)
input.setAttribute('value', 'initial');
console.log(input.getAttribute('value'));  // 'initial'

// User types "hello" in input
console.log(input.value);              // 'hello' (property)
console.log(input.getAttribute('value')); // 'initial' (attribute)

// Boolean attributes
const checkbox = document.querySelector('input[type="checkbox"]');

// Property
checkbox.checked = true;  // Boolean
console.log(checkbox.checked);  // true

// Attribute
checkbox.setAttribute('checked', '');  // String
console.log(checkbox.getAttribute('checked'));  // ''
console.log(checkbox.hasAttribute('checked'));  // true

// href attribute vs property
const link = document.createElement('a');
link.setAttribute('href', '/page');

console.log(link.getAttribute('href'));  // '/page' (as written)
console.log(link.href);  // 'http://example.com/page' (absolute URL)

// Custom attributes
// Bad
element.setAttribute('user-id', '123');  // Not standard

// Good
element.setAttribute('data-user-id', '123');
element.dataset.userId;  // '123' (via dataset API)
```

**Summary:**
- **Properties**: Live values, typed (boolean, number, etc.)
- **Attributes**: Initial values, always strings
- Use properties for current state, attributes for initial HTML

---

### Q10: Implement a simple autocomplete component.

**Answer:**

```javascript
class Autocomplete {
  constructor(inputElement, options) {
    this.input = inputElement;
    this.options = options;
    this.suggestions = [];
    
    this.createSuggestionBox();
    this.attachEvents();
  }
  
  createSuggestionBox() {
    this.box = document.createElement('ul');
    this.box.className = 'autocomplete-suggestions';
    this.box.style.display = 'none';
    this.input.parentNode.appendChild(this.box);
  }
  
  attachEvents() {
    this.input.addEventListener('input', (e) => {
      this.handleInput(e.target.value);
    });
    
    this.input.addEventListener('blur', () => {
      setTimeout(() => this.hideSuggestions(), 200);
    });
    
    this.box.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        this.selectSuggestion(e.target.textContent);
      }
    });
  }
  
  handleInput(value) {
    if (!value) {
      this.hideSuggestions();
      return;
    }
    
    this.suggestions = this.options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    
    this.showSuggestions();
  }
  
  showSuggestions() {
    if (this.suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }
    
    this.box.innerHTML = this.suggestions
      .map(s => `<li>${this.highlight(s)}</li>`)
      .join('');
    
    this.box.style.display = 'block';
  }
  
  highlight(text) {
    const query = this.input.value;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }
  
  selectSuggestion(value) {
    this.input.value = value;
    this.hideSuggestions();
  }
  
  hideSuggestions() {
    this.box.style.display = 'none';
  }
}

// Usage
const countries = ['USA', 'UK', 'Canada', 'Australia', 'India'];
const input = document.querySelector('#country');
const autocomplete = new Autocomplete(input, countries);
```

---

## 🎓 Key Takeaways

✅ Use `querySelector/querySelectorAll` for flexible selection  
✅ `textContent` is safer than `innerHTML` (prevents XSS)  
✅ Event delegation for dynamic elements and performance  
✅ DocumentFragment for efficient bulk DOM updates  
✅ Batch reads and writes to minimize reflows  
✅ Use `classList` instead of `className` for class manipulation  
✅ `transform` for animations (GPU accelerated)  
✅ Remove event listeners to prevent memory leaks  
✅ Sanitize user input before inserting into DOM  
✅ Properties vs attributes: Live vs initial values

---

## 📚 Practice Tips

1. Build interactive components (modal, tabs, accordion)
2. Practice event delegation with dynamically added elements
3. Optimize performance for large lists (virtual scrolling)
4. Implement form validation with custom error messages
5. Create reusable component patterns with templates

---

**Next Topic:** Event Loop & Concurrency (Call Stack, Microtasks, Macrotasks)
