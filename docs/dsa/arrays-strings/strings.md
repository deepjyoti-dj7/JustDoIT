---
title: Strings
description: String manipulation patterns, techniques, and interview strategies
---

# Strings

Strings are arrays of characters with additional constraints — **immutability** in most languages, **encoding considerations**, and a rich set of **pattern-matching** techniques. String problems appear in almost every interview and test both algorithmic thinking and attention to detail.

## Strings vs Character Arrays

| Language | String Type | Mutable? | Access |
|---|---|---|---|
| C++ | `std::string` | Yes | O(1) |
| Java | `String` | No (use `StringBuilder`) | O(1) |
| TypeScript | `string` | No | O(1) |
| Python | `str` | No (use `list`) | O(1) |
| Go | `string` | No (use `[]byte`) | O(1) |

> **Interview impact:** In Java/Python/TS, string concatenation in a loop is O(n²) because each concat creates a new string. Use a mutable builder or array of characters instead.

```cpp
// O(n) - C++ strings are mutable
string buildString(vector<char>& chars) {
    string result;
    result.reserve(chars.size());
    for (char c : chars) {
        result += c;
    }
    return result;
}
```

```java
// O(n) - Use StringBuilder, NOT string concat
String buildString(char[] chars) {
    StringBuilder sb = new StringBuilder(chars.length);
    for (char c : chars) {
        sb.append(c);
    }
    return sb.toString();
}
```

```typescript
// O(n) - Join array at the end
function buildString(chars: string[]): string {
    return chars.join('');
}
```

```python
# O(n) - Join list at the end
def build_string(chars: list[str]) -> str:
    return ''.join(chars)
```

```go
// O(n) - Use strings.Builder
func buildString(chars []byte) string {
    var sb strings.Builder
    sb.Grow(len(chars))
    for _, c := range chars {
        sb.WriteByte(c)
    }
    return sb.String()
}
```

## Essential String Techniques

### 1. Character Frequency Counting

The workhorse of string problems. Use a hash map or a fixed-size array (for lowercase English letters, size 26 is enough).

```cpp
// Using fixed array for lowercase English letters
array<int, 26> count(const string& s) {
    array<int, 26> freq = {};
    for (char c : s) {
        freq[c - 'a']++;
    }
    return freq;
}
```

```java
int[] count(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) {
        freq[c - 'a']++;
    }
    return freq;
}
```

```typescript
function count(s: string): number[] {
    const freq = new Array(26).fill(0);
    for (const c of s) {
        freq[c.charCodeAt(0) - 97]++;
    }
    return freq;
}
```

```python
def count(s: str) -> list[int]:
    freq = [0] * 26
    for c in s:
        freq[ord(c) - ord('a')] += 1
    return freq
```

```go
func count(s string) [26]int {
    var freq [26]int
    for _, c := range s {
        freq[c-'a']++
    }
    return freq
}
```

> **When to use int[26] vs HashMap:** Use the fixed array when the character set is known and small (lowercase English). Use a map when dealing with Unicode, mixed cases, or when you need to iterate only over present characters.

### 2. String Comparison & Matching

**Anagram check:** Two strings are anagrams if they have the same character frequencies.

**Palindrome check:** Compare characters from both ends moving inward.

```cpp
bool isPalindrome(const string& s) {
    int left = 0, right = s.size() - 1;
    while (left < right) {
        if (s[left] != s[right]) return false;
        left++;
        right--;
    }
    return true;
}
```

```java
boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}
```

```typescript
function isPalindrome(s: string): boolean {
    let left = 0, right = s.length - 1;
    while (left < right) {
        if (s[left] !== s[right]) return false;
        left++;
        right--;
    }
    return true;
}
```

```python
def is_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True
```

```go
func isPalindrome(s string) bool {
    left, right := 0, len(s)-1
    for left < right {
        if s[left] != s[right] {
            return false
        }
        left++
        right--
    }
    return true
}
```

### 3. Substring Operations

Finding, extracting, and comparing substrings. Key operations:

| Operation | C++ | Java | Python |
|---|---|---|---|
| Substring | `s.substr(i, len)` | `s.substring(i, j)` | `s[i:j]` |
| Find | `s.find("abc")` | `s.indexOf("abc")` | `s.find("abc")` |
| Contains | `s.find("abc") != npos` | `s.contains("abc")` | `"abc" in s` |

### 4. String Hashing (Rabin-Karp)

Rolling hash for efficient substring matching. The idea: represent a string as a number using a polynomial hash.

$$h(s) = s[0] \cdot b^{n-1} + s[1] \cdot b^{n-2} + \ldots + s[n-1] \cdot b^0 \pmod{m}$$

When sliding the window by one character, update the hash in O(1):

$$h_{new} = (h_{old} - s[i] \cdot b^{k-1}) \cdot b + s[i+k]$$

This is essential for problems like finding repeated substrings or pattern matching.

## Common String Patterns

### Pattern 1: Sliding Window on Strings

Most common for substring problems. Maintain a window with character counts.

**Identification signals:**
- "Longest/shortest substring with..."
- "Substring containing all characters of..."
- "At most K distinct characters"

See [Sliding Window](sliding-window) for detailed templates.

### Pattern 2: Two Pointers on Strings

Used for palindrome problems, reversals, and partitioning.

**Identification signals:**
- "Is palindrome" / "Make palindrome"
- "Reverse words"
- "Compare strings with backspaces"

### Pattern 3: HashMap / Frequency Map

Used for anagram detection, character counting, grouping.

**Identification signals:**
- "Anagram" / "Permutation"
- "Group strings by..."
- "Character frequency"

### Pattern 4: String Building / Simulation

Simulate a process, often using a stack.

**Identification signals:**
- "Decode string"
- "Remove duplicates"
- "Evaluate expression"

## Edge Cases Checklist

- **Empty string** `""` — valid input in most problems
- **Single character** — often a palindrome, an anagram of itself
- **All same characters** — `"aaaa"`
- **Case sensitivity** — clarify with interviewer: `'A' != 'a'`?
- **Spaces and special characters** — should they be ignored?
- **Unicode** — most interviews stick to ASCII, but ask
- **Very long strings** — think about O(n²) operations like `substring` in a loop

## Common Interview Problems by Category

| Category | Problems |
|---|---|
| Anagrams | Valid Anagram, Group Anagrams, Find All Anagrams |
| Palindromes | Valid Palindrome, Longest Palindromic Substring |
| Sliding Window | Longest Substring Without Repeating, Minimum Window Substring |
| Hashing | Repeated DNA Sequences, Longest Duplicate Substring |
| Two Pointers | Reverse String, Valid Palindrome II |
| Stack-based | Valid Parentheses, Decode String |

## Complexity Patterns

| Technique | Time | Space |
|---|---|---|
| Character frequency | O(n) | O(1) for fixed alphabet |
| Sliding window | O(n) | O(k) where k = charset size |
| Brute force all substrings | O(n²) | O(n) |
| String sort comparison | O(n log n) | O(n) |
| Rabin-Karp matching | O(n + m) avg | O(1) |
| KMP matching | O(n + m) | O(m) |
