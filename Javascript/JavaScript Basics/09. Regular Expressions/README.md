# Regular Expressions - Quick Summary & Interview Guide

## 📚 Quick Notes

### 1. Basic Syntax

**Creating RegEx:**
```javascript
// Literal notation
const regex1 = /pattern/flags;

// Constructor notation
const regex2 = new RegExp('pattern', 'flags');

// Examples
const emailRegex = /\w+@\w+\.\w+/;
const phoneRegex = new RegExp('\\d{3}-\\d{3}-\\d{4}');

// Test if pattern matches
console.log(/hello/.test('hello world'));  // true
console.log(/hello/.test('goodbye'));      // false
```

**Common Methods:**
```javascript
const text = 'The quick brown fox';
const regex = /quick/;

// test() - returns boolean
regex.test(text);  // true

// exec() - returns array with match details or null
regex.exec(text);  // ['quick', index: 4, input: 'The quick brown fox', groups: undefined]

// String methods with regex
text.match(regex);      // ['quick']
text.search(regex);     // 4 (index)
text.replace(regex, 'slow');  // 'The slow brown fox'
text.split(/\s+/);      // ['The', 'quick', 'brown', 'fox']
```

---

### 2. Flags

**Common Flags:**
```javascript
// g - Global (find all matches)
const text = 'cat bat rat';
text.match(/at/);   // ['at'] (first match only)
text.match(/at/g);  // ['at', 'at', 'at'] (all matches)

// i - Case insensitive
/hello/i.test('HELLO');   // true
/hello/.test('HELLO');    // false

// m - Multiline (^ and $ match line boundaries)
const multiline = 'first\nsecond\nthird';
multiline.match(/^second/m);   // ['second']
multiline.match(/^second/);    // null

// s - Dotall (. matches newlines)
/hello.world/.test('hello\nworld');   // false
/hello.world/s.test('hello\nworld');  // true

// u - Unicode
/\u{1F600}/u.test('😀');  // true

// y - Sticky (match from lastIndex only)
const sticky = /test/y;
sticky.lastIndex = 5;
```

**Combining Flags:**
```javascript
const regex = /pattern/gi;  // Global + case insensitive
const text = 'Hello HELLO hello';
text.match(regex);  // ['Hello', 'HELLO', 'hello']
```

---

### 3. Character Classes

**Basic Classes:**
```javascript
// . - Any character except newline
/h.t/.test('hot');   // true
/h.t/.test('hat');   // true
/h.t/.test('h\nt');  // false

// \d - Digit [0-9]
/\d+/.test('123');     // true
/\d+/.exec('abc123');  // ['123']

// \D - Non-digit [^0-9]
/\D+/.exec('abc123');  // ['abc']

// \w - Word character [a-zA-Z0-9_]
/\w+/.exec('hello_123');  // ['hello_123']

// \W - Non-word character
/\W+/.exec('hello world!');  // [' ']

// \s - Whitespace (space, tab, newline)
/\s+/.exec('hello world');  // [' ']

// \S - Non-whitespace
/\S+/.exec('  hello');  // ['hello']
```

**Custom Classes:**
```javascript
// [abc] - Any character a, b, or c
/[abc]/.test('apple');  // true (matches 'a')

// [^abc] - Any character except a, b, c
/[^abc]/.test('dog');   // true (matches 'd')

// [a-z] - Range from a to z
/[a-z]+/.exec('Hello');  // ['ello']

// [0-9] - Digits 0 to 9
/[0-9]+/.exec('Room 101');  // ['101']

// [a-zA-Z] - All letters
/[a-zA-Z]+/.exec('Hello123');  // ['Hello']

// Multiple ranges
/[a-zA-Z0-9]+/.exec('User123');  // ['User123']
```

---

### 4. Quantifiers

**Basic Quantifiers:**
```javascript
// * - Zero or more
/ab*/.test('a');     // true
/ab*/.test('ab');    // true
/ab*/.test('abbb');  // true

// + - One or more
/ab+/.test('a');     // false
/ab+/.test('ab');    // true
/ab+/.test('abbb');  // true

// ? - Zero or one (optional)
/colou?r/.test('color');   // true
/colou?r/.test('colour');  // true

// {n} - Exactly n times
/\d{3}/.test('12');   // false
/\d{3}/.test('123');  // true

// {n,} - n or more times
/\d{2,}/.test('1');    // false
/\d{2,}/.test('123');  // true

// {n,m} - Between n and m times
/\d{2,4}/.exec('12345');  // ['1234']
```

**Greedy vs Lazy:**
```javascript
const text = '<div>Hello</div>';

// Greedy (default) - matches as much as possible
text.match(/<.*>/);   // ['<div>Hello</div>']

// Lazy (add ?) - matches as little as possible
text.match(/<.*?>/);  // ['<div>']

// Examples
'aaaa'.match(/a+/);   // ['aaaa'] (greedy)
'aaaa'.match(/a+?/);  // ['a'] (lazy)

const html = '<p>First</p><p>Second</p>';
html.match(/<p>.*<\/p>/);   // ['<p>First</p><p>Second</p>'] (greedy)
html.match(/<p>.*?<\/p>/);  // ['<p>First</p>'] (lazy)
```

---

### 5. Anchors and Boundaries

**Position Anchors:**
```javascript
// ^ - Start of string (or line with m flag)
/^hello/.test('hello world');  // true
/^hello/.test('say hello');    // false

// $ - End of string (or line with m flag)
/world$/.test('hello world');  // true
/world$/.test('world hello');  // false

// \b - Word boundary
/\bcat\b/.test('cat');        // true
/\bcat\b/.test('cats');       // false
/\bcat\b/.test('the cat');    // true

// \B - Non-word boundary
/\Bcat/.test('cat');     // false
/\Bcat/.test('bobcat');  // true
```

**Multiline Mode:**
```javascript
const text = 'first line\nsecond line\nthird line';

// Without multiline flag
text.match(/^second/);   // null

// With multiline flag
text.match(/^second/m);  // ['second']

// End of line
text.match(/line$/gm);   // ['line', 'line', 'line']
```

---

### 6. Groups and Capturing

**Capturing Groups:**
```javascript
// () - Capture group
const regex = /(\d{3})-(\d{3})-(\d{4})/;
const phone = '555-123-4567';
const match = regex.exec(phone);

console.log(match[0]);  // '555-123-4567' (full match)
console.log(match[1]);  // '555' (first group)
console.log(match[2]);  // '123' (second group)
console.log(match[3]);  // '4567' (third group)

// Named groups
const namedRegex = /(?<area>\d{3})-(?<exchange>\d{3})-(?<number>\d{4})/;
const namedMatch = namedRegex.exec(phone);

console.log(namedMatch.groups.area);      // '555'
console.log(namedMatch.groups.exchange);  // '123'
console.log(namedMatch.groups.number);    // '4567'
```

**Non-Capturing Groups:**
```javascript
// (?:) - Non-capturing group (faster, no memory)
const regex1 = /(cat|dog)/;     // Capturing
const regex2 = /(?:cat|dog)/;   // Non-capturing

'I have a cat'.match(regex1);  // ['cat', 'cat']
'I have a cat'.match(regex2);  // ['cat']

// Use when you need grouping but not capturing
const url = /https?:\/\/(?:www\.)?example\.com/;
```

**Backreferences:**
```javascript
// \1, \2 - Reference captured groups
const repeated = /(\w+)\s\1/;
repeated.test('hello hello');  // true
repeated.test('hello world');  // false

// Find repeated words
const text = 'the the cat sat on the mat mat';
text.match(/\b(\w+)\s\1\b/g);  // ['the the', 'mat mat']

// Named backreferences
const tag = /<(?<tag>\w+)>.*?<\/\k<tag>>/;
tag.test('<div>content</div>');   // true
tag.test('<div>content</span>');  // false
```

---

### 7. Lookahead and Lookbehind

**Positive Lookahead:**
```javascript
// (?=) - Assert what follows
const regex = /\d+(?= dollars)/;

'50 dollars'.match(regex);  // ['50']
'50 euros'.match(regex);    // null

// Password validation (at least one digit)
const hasDigit = /^(?=.*\d).+$/;
hasDigit.test('password123');  // true
hasDigit.test('password');     // false
```

**Negative Lookahead:**
```javascript
// (?!) - Assert what doesn't follow
const regex = /\d+(?! dollars)/;

'50 euros'.match(regex);   // ['50']
'50 dollars'.match(regex); // null

// Not followed by specific pattern
/\d+(?!\d)/.exec('123456');  // ['6'] (last digit)
```

**Positive Lookbehind:**
```javascript
// (?<=) - Assert what precedes
const regex = /(?<=\$)\d+/;

'$50'.match(regex);    // ['50']
'€50'.match(regex);    // null

// Extract price
'Price: $100'.match(/(?<=\$)\d+/);  // ['100']
```

**Negative Lookbehind:**
```javascript
// (?<!) - Assert what doesn't precede
const regex = /(?<!\$)\d+/;

'€50'.match(regex);    // ['50']
'$50'.match(regex);    // null
```

**Complex Lookbehinds:**
```javascript
// Password: 8+ chars, 1 uppercase, 1 lowercase, 1 digit
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

strongPassword.test('Weak');           // false
strongPassword.test('StrongPass1');    // true
strongPassword.test('strongpass1');    // false (no uppercase)
```

---

### 8. Common Patterns

**Email Validation:**
```javascript
// Simple
const emailSimple = /^\w+@\w+\.\w+$/;

// More comprehensive
const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

email.test('user@example.com');     // true
email.test('invalid.email');        // false
```

**URL Validation:**
```javascript
const url = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

url.test('https://example.com');           // true
url.test('http://www.example.com/path');   // true
```

**Phone Number:**
```javascript
// US format
const phone = /^\d{3}-\d{3}-\d{4}$/;
const phoneFlexible = /^(\d{3}[-.]?)?\d{3}[-.]?\d{4}$/;

phone.test('555-123-4567');        // true
phoneFlexible.test('555.123.4567'); // true
phoneFlexible.test('5551234567');   // true
```

**Date Validation:**
```javascript
// MM/DD/YYYY
const date = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

date.test('12/31/2024');  // true
date.test('13/01/2024');  // false
```

**Credit Card:**
```javascript
// Basic format (strips spaces/dashes)
const creditCard = /^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/;

creditCard.test('1234 5678 9012 3456');  // true
creditCard.test('1234-5678-9012-3456');  // true
```

---

## 🎯 Interview Questions & Answers

### Q1: What's the difference between test(), exec(), and match()?

**Answer:**

**test() - Returns boolean:**
```javascript
const regex = /hello/;
const text = 'hello world';

regex.test(text);  // true
regex.test('goodbye');  // false

// Use for simple yes/no checks
function isValidEmail(email) {
  return /^\w+@\w+\.\w+$/.test(email);
}
```

**exec() - Returns array with details or null:**
```javascript
const regex = /(\w+)@(\w+)\.(\w+)/;
const email = 'user@example.com';

const result = regex.exec(email);
// [
//   'user@example.com',  // Full match
//   'user',              // Group 1
//   'example',           // Group 2
//   'com',               // Group 3
//   index: 0,
//   input: 'user@example.com',
//   groups: undefined
// ]

// Returns null if no match
/hello/.exec('goodbye');  // null

// With global flag, maintains state
const globalRegex = /\d+/g;
globalRegex.exec('12 34 56');  // ['12']
globalRegex.exec('12 34 56');  // ['34'] (continues from lastIndex)
globalRegex.exec('12 34 56');  // ['56']
globalRegex.exec('12 34 56');  // null (resets)
```

**match() - String method, returns array:**
```javascript
const text = 'The price is 100 dollars';

// Without global flag - similar to exec()
text.match(/\d+/);
// ['100', index: 13, input: 'The price is 100 dollars', groups: undefined]

// With global flag - returns all matches (no details)
const prices = 'Prices: 10, 20, 30';
prices.match(/\d+/g);  // ['10', '20', '30']

// No match returns null
'hello'.match(/\d+/);  // null
```

**Summary:**

| Method | Returns | Use Case |
|--------|---------|----------|
| test() | Boolean | Check if pattern exists |
| exec() | Array/null | Get match details, iterate with /g |
| match() | Array/null | Get all matches (with /g) or details (without) |

---

### Q2: How do greedy vs lazy quantifiers work?

**Answer:**

**Greedy (default) - Match as much as possible:**
```javascript
const html = '<div>Hello</div><div>World</div>';

// Greedy * matches everything between first < and last >
html.match(/<.*>/);
// ['<div>Hello</div><div>World</div>']

html.match(/<.+>/);
// ['<div>Hello</div><div>World</div>']

// Example with repeated characters
'aaaa'.match(/a+/);   // ['aaaa'] (all a's)
'12345'.match(/\d{2,4}/);  // ['1234'] (max 4)
```

**Lazy (add ?) - Match as little as possible:**
```javascript
// Lazy *? matches minimum
html.match(/<.*?>/);
// ['<div>']

html.match(/<.+?>/);
// ['<div>']

// Get all tags (with global flag)
html.match(/<.*?>/g);
// ['<div>', '</div>', '<div>', '</div>']

// Example with repeated characters
'aaaa'.match(/a+?/);   // ['a'] (single a)
'12345'.match(/\d{2,4}?/);  // ['12'] (min 2)
```

**Practical Examples:**
```javascript
// Extract content from quotes
const text = 'He said "hello" and "goodbye"';

// Greedy - wrong!
text.match(/".*"/);
// ['"hello" and "goodbye"']

// Lazy - correct!
text.match(/".*?"/g);
// ['"hello"', '"goodbye"']

// Extract HTML content
const html = '<p>First</p><p>Second</p>';

// Greedy
html.match(/<p>.*<\/p>/);
// ['<p>First</p><p>Second</p>']

// Lazy
html.match(/<p>.*?<\/p>/g);
// ['<p>First</p>', '<p>Second</p>']
```

**All Lazy Quantifiers:**
```javascript
// *? - Zero or more (lazy)
// +? - One or more (lazy)
// ?? - Zero or one (lazy)
// {n,}? - n or more (lazy)
// {n,m}? - Between n and m (lazy)
```

---

### Q3: How do you use lookaheads and lookbehinds?

**Answer:**

**Positive Lookahead (?=) - Assert what follows:**
```javascript
// Match number only if followed by "USD"
const price = /\d+(?=\s*USD)/;

price.exec('100 USD');   // ['100']
price.exec('100 EUR');   // null

// Password must contain digit
const hasDigit = /^(?=.*\d)/;
hasDigit.test('pass123');   // true
hasDigit.test('password');  // false

// Multiple conditions
const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
strongPass.test('Weak1');           // false (no special char)
strongPass.test('Strong1!');        // true
```

**Negative Lookahead (?!) - Assert what doesn't follow:**
```javascript
// Match number NOT followed by "USD"
const notUSD = /\d+(?!\s*USD)/;

notUSD.exec('100 EUR');  // ['100']
notUSD.exec('100 USD');  // null

// Password must NOT contain spaces
const noSpaces = /^(?!.*\s).+$/;
noSpaces.test('password123');   // true
noSpaces.test('pass word');     // false
```

**Positive Lookbehind (?<=) - Assert what precedes:**
```javascript
// Match number only if preceded by "$"
const dollarAmount = /(?<=\$)\d+(\.\d{2})?/;

dollarAmount.exec('$100.50');  // ['100.50']
dollarAmount.exec('€100.50');  // null

// Extract username from email
const username = /(?<=@)\w+/;
username.exec('user@example.com');  // ['example']
```

**Negative Lookbehind (?<!) - Assert what doesn't precede:**
```javascript
// Match number NOT preceded by "$"
const notDollar = /(?<!\$)\d+/;

notDollar.exec('€100');   // ['100']
notDollar.exec('$100');   // null (or matches other digits)
```

**Complex Example - Password Validation:**
```javascript
function validatePassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  return regex.test(password);
}

validatePassword('Weak1');           // false
validatePassword('Strong1!');        // true
validatePassword('STRONG1!');        // false (no lowercase)
validatePassword('strong1!');        // false (no uppercase)
```

---

### Q4: How do capturing groups and backreferences work?

**Answer:**

**Capturing Groups () - Save matched content:**
```javascript
// Extract parts of phone number
const phone = /(\d{3})-(\d{3})-(\d{4})/;
const number = '555-123-4567';
const match = phone.exec(number);

console.log(match[0]);  // '555-123-4567' (full match)
console.log(match[1]);  // '555' (first group)
console.log(match[2]);  // '123' (second group)
console.log(match[3]);  // '4567' (third group)

// Use in replace
const formatted = number.replace(phone, '($1) $2-$3');
// '(555) 123-4567'

// Extract date parts
const date = /(\d{2})\/(\d{2})\/(\d{4})/;
'12/31/2024'.replace(date, '$2/$1/$3');
// '31/12/2024' (swap month/day)
```

**Named Groups (?<name>) - More readable:**
```javascript
const email = /(?<user>\w+)@(?<domain>\w+)\.(?<tld>\w+)/;
const match = email.exec('john@example.com');

console.log(match.groups.user);    // 'john'
console.log(match.groups.domain);  // 'example'
console.log(match.groups.tld);     // 'com'

// Use in replace
'john@example.com'.replace(email, '$<user> at $<domain> dot $<tld>');
// 'john at example dot com'
```

**Backreferences \1, \2 - Reference captured groups:**
```javascript
// Find repeated words
const repeated = /\b(\w+)\s\1\b/;

repeated.test('the the');     // true
repeated.test('the cat');     // false

'the the cat sat on the mat mat'.match(/\b(\w+)\s\1\b/g);
// ['the the', 'mat mat']

// Find repeated characters
const doubles = /(\w)\1/;
doubles.test('hello');   // true ('ll')
doubles.test('world');   // false

// Match HTML tags
const tag = /<(\w+)>.*?<\/\1>/;
tag.test('<div>content</div>');    // true
tag.test('<div>content</span>');   // false

// Named backreferences
const namedTag = /<(?<tag>\w+)>.*?<\/\k<tag>>/;
namedTag.test('<p>text</p>');      // true
```

**Non-Capturing Groups (?:) - Group without saving:**
```javascript
// Don't need to capture
const url = /https?:\/\/(?:www\.)?example\.com/;

url.test('https://example.com');      // true
url.test('https://www.example.com');  // true

// Compare memory usage
const capturing = /(cat|dog)/;        // Saves match
const nonCapturing = /(?:cat|dog)/;   // Doesn't save

'cat'.match(capturing);      // ['cat', 'cat'] (full + group)
'cat'.match(nonCapturing);   // ['cat'] (just full match)
```

---

### Q5: How do you validate common formats?

**Answer:**

**Email Validation:**
```javascript
// Simple
const emailSimple = /^\w+@\w+\.\w+$/;

// Comprehensive
const email = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**Phone Number:**
```javascript
// US format: (123) 456-7890 or 123-456-7890
const phone = /^(\(\d{3}\)\s?|\d{3}-)\d{3}-\d{4}$/;

phone.test('(555) 123-4567');  // true
phone.test('555-123-4567');    // true

// Flexible
const phoneFlexible = /^[\d\s()-]+$/;
```

**URL:**
```javascript
const url = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

url.test('https://example.com');
url.test('http://www.example.com/path?query=1');
```

**Credit Card:**
```javascript
// Visa, MasterCard, Amex
const visa = /^4\d{15}$/;
const mastercard = /^5[1-5]\d{14}$/;
const amex = /^3[47]\d{13}$/;

function validateCard(number) {
  const cleaned = number.replace(/\s|-/g, '');
  return visa.test(cleaned) || 
         mastercard.test(cleaned) || 
         amex.test(cleaned);
}
```

**Password Strength:**
```javascript
// At least 8 chars, 1 uppercase, 1 lowercase, 1 digit
const password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// With special characters
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function checkPasswordStrength(pwd) {
  if (pwd.length < 8) return 'Too short';
  if (!/(?=.*[a-z])/.test(pwd)) return 'Need lowercase';
  if (!/(?=.*[A-Z])/.test(pwd)) return 'Need uppercase';
  if (!/(?=.*\d)/.test(pwd)) return 'Need digit';
  if (!/(?=.*[@$!%*?&])/.test(pwd)) return 'Need special char';
  return 'Strong';
}
```

**Date Formats:**
```javascript
// MM/DD/YYYY
const date1 = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;

// YYYY-MM-DD (ISO)
const date2 = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// DD-MM-YYYY
const date3 = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
```

---

### Q6: How do you extract data using regex?

**Answer:**

**Basic Extraction:**
```javascript
// Extract numbers
const text = 'Price: $99.99, Tax: $10.50';
const prices = text.match(/\d+\.\d{2}/g);
// ['99.99', '10.50']

// Extract emails
const emails = 'Contact: john@example.com or jane@test.com';
emails.match(/\w+@\w+\.\w+/g);
// ['john@example.com', 'jane@test.com']

// Extract URLs
const content = 'Visit https://example.com or http://test.com';
content.match(/https?:\/\/[^\s]+/g);
// ['https://example.com', 'http://test.com']
```

**Using Groups:**
```javascript
// Extract and transform
const phone = '555-123-4567';
const regex = /(\d{3})-(\d{3})-(\d{4})/;
const match = regex.exec(phone);

const formatted = `(${match[1]}) ${match[2]}-${match[3]}`;
// '(555) 123-4567'

// Extract date parts
const date = '2024-12-31';
const [_, year, month, day] = /(\d{4})-(\d{2})-(\d{2})/.exec(date);
console.log({ year, month, day });
// { year: '2024', month: '12', day: '31' }
```

**Named Groups (modern approach):**
```javascript
const userInfo = 'Name: John Doe, Age: 30';
const regex = /Name: (?<name>[\w\s]+), Age: (?<age>\d+)/;
const { name, age } = regex.exec(userInfo).groups;

console.log({ name, age });
// { name: 'John Doe', age: '30' }
```

**matchAll() - Get all matches with details:**
```javascript
const text = 'Phone: 555-123-4567, Fax: 555-987-6543';
const regex = /(\d{3})-(\d{3})-(\d{4})/g;

for (const match of text.matchAll(regex)) {
  console.log(`Area: ${match[1]}, Exchange: ${match[2]}, Number: ${match[3]}`);
}
// Area: 555, Exchange: 123, Number: 4567
// Area: 555, Exchange: 987, Number: 6543

// Convert to array
const matches = [...text.matchAll(regex)];
```

**Replace with Transformation:**
```javascript
// Capitalize words
const text = 'hello world';
text.replace(/\b\w/g, char => char.toUpperCase());
// 'Hello World'

// Format phone number
'5551234567'.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
// '(555) 123-4567'

// Obfuscate email
'user@example.com'.replace(/(.{2})(.*)(@.*)/, '$1***$3');
// 'us***@example.com'
```

---

### Q7: What are common regex performance pitfalls?

**Answer:**

**Catastrophic Backtracking:**
```javascript
// BAD - Exponential time complexity
const bad = /^(a+)+$/;

// Test with long string
bad.test('aaaaaaaaaaaaaaaaab');  // Takes VERY long!

// GOOD - Linear time
const good = /^a+$/;
```

**Greedy Quantifiers in Large Text:**
```javascript
const html = '<div>' + 'x'.repeat(10000) + '</div>';

// BAD - Greedy match on large text
console.time('greedy');
html.match(/<div>.*<\/div>/);
console.timeEnd('greedy');

// GOOD - Use lazy quantifier
console.time('lazy');
html.match(/<div>.*?<\/div>/);
console.timeEnd('lazy');
```

**Unnecessary Capturing:**
```javascript
// BAD - Captures when not needed
const bad = /(\d+)-(\d+)-(\d+)/g;

// GOOD - Use non-capturing groups
const good = /(?:\d+)-(?:\d+)-(?:\d+)/g;

// Or only capture what you need
const better = /\d+-\d+-(\d+)/;  // Only capture last part
```

**Optimizations:**
```javascript
// Use specific quantifiers instead of +/*
const bad = /\d+/;
const good = /\d{1,10}/;  // If you know max length

// Anchor patterns when possible
const bad2 = /hello/;
const good2 = /^hello$/;  // If matching whole string

// Use character classes instead of alternation
const bad3 = /(a|b|c|d)/;
const good3 = /[a-d]/;

// Pre-compile regex for reuse
// BAD - compiles every time
function check(text) {
  return /pattern/.test(text);
}

// GOOD - compile once
const pattern = /pattern/;
function checkOptimized(text) {
  return pattern.test(text);
}
```

---

### Q8: How do you use regex with replace()?

**Answer:**

**Basic Replace:**
```javascript
const text = 'Hello World';

// Replace first occurrence
text.replace(/o/, '0');  // 'Hell0 World'

// Replace all (global flag)
text.replace(/o/g, '0');  // 'Hell0 W0rld'

// Case insensitive
text.replace(/hello/i, 'Hi');  // 'Hi World'
```

**Using Captured Groups:**
```javascript
// Swap words
'John Doe'.replace(/(\w+) (\w+)/, '$2, $1');
// 'Doe, John'

// Format phone
'5551234567'.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
// '(555) 123-4567'

// Reformat date
'2024-12-31'.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1');
// '12/31/2024'
```

**Using Function:**
```javascript
// Uppercase first letter
'hello world'.replace(/\b\w/g, char => char.toUpperCase());
// 'Hello World'

// Custom transformation
const text = 'Price: $10.50';
text.replace(/\$(\d+\.\d{2})/, (match, price) => {
  return `$${(parseFloat(price) * 1.1).toFixed(2)}`;
});
// 'Price: $11.55'

// With all parameters
'a1 b2 c3'.replace(/(\w)(\d)/g, (match, letter, number, offset, string) => {
  return `${letter.toUpperCase()}${parseInt(number) * 2}`;
});
// 'A2 B4 C6'
```

**Named Groups:**
```javascript
const date = '2024-12-31';
date.replace(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
  '$<month>/$<day>/$<year>'
);
// '12/31/2024'

// With function
date.replace(
  /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/,
  (...args) => {
    const { year, month, day } = args.at(-1);  // Last arg is groups
    return `${month}/${day}/${year}`;
  }
);
```

---

### Q9: How do you handle unicode in regex?

**Answer:**

**Unicode Flag (u):**
```javascript
// Without u flag - treats emoji as 2 characters
/^.$/. test('😀');   // false

// With u flag - treats emoji as single character
/^.$/u.test('😀');   // true

// Unicode escapes
/\u{1F600}/u.test('😀');  // true
/\u{1F600}/.test('😀');   // false (needs u flag)
```

**Unicode Properties:**
```javascript
// Match any letter (any language)
/\p{Letter}/u.test('a');   // true
/\p{Letter}/u.test('é');   // true
/\p{Letter}/u.test('中');  // true

// Match specific scripts
/\p{Script=Latin}/u.test('hello');    // true
/\p{Script=Cyrillic}/u.test('привет'); // true
/\p{Script=Han}/u.test('中文');       // true

// Match emoji
/\p{Emoji}/u.test('😀');  // true
/\p{Emoji}/u.test('a');   // false

// Match currency symbols
/\p{Currency_Symbol}/u.test('$');  // true
/\p{Currency_Symbol}/u.test('€');  // true
```

**Practical Examples:**
```javascript
// Match any word in any language
const anyWord = /\p{L}+/gu;
'Hello مرحبا 你好'.match(anyWord);
// ['Hello', 'مرحبا', '你好']

// Validate international names
function validateName(name) {
  return /^[\p{L}\s'-]+$/u.test(name);
}

validateName('José García');      // true
validateName('Müller-Schmidt');   // true
validateName('李明');              // true

// Remove emojis
const text = 'Hello 😀 World 🌍';
text.replace(/\p{Emoji}/gu, '');
// 'Hello  World '
```

---

### Q10: What's the output?

**Answer:**
```javascript
const text = 'The price is 100 dollars and 200 euros';

// Q1: What does this match?
text.match(/\d+/);
// ['100'] - First number only

// Q2: What about this?
text.match(/\d+/g);
// ['100', '200'] - All numbers

// Q3: This?
text.match(/(\d+) (\w+)/);
// ['100 dollars', '100', 'dollars'] - Full match + groups

// Q4: And this?
text.match(/(\d+) (\w+)/g);
// ['100 dollars', '200 euros'] - Only full matches (groups not captured with g flag)

// Q5: How to get all groups?
[...text.matchAll(/(\d+) (\w+)/g)];
// Returns iterator with full match details including groups
```

---

## 🎓 Key Takeaways

✅ **test()** - Check if pattern exists (boolean)  
✅ **exec()** - Get match details with groups  
✅ **match()** - Extract matches from string  
✅ **Greedy** - Matches maximum possible  
✅ **Lazy** - Matches minimum possible  
✅ **Lookaheads** - Assert what follows  
✅ **Lookbehinds** - Assert what precedes  
✅ **Groups** - Capture and reference matched content  
✅ **Flags** - g (global), i (case-insensitive), m (multiline)  
✅ **Performance** - Avoid catastrophic backtracking

---

## 📚 Practice Tips

1. Practice common patterns (email, phone, URL)
2. Use regex101.com or regexr.com for testing
3. Master lookaheads/lookbehinds for complex validation
4. Learn to optimize regex for performance
5. Use named groups for better readability
6. Test edge cases thoroughly

---

**Previous Topic:** Modules & Imports  
**Next Topic:** DOM Manipulation
