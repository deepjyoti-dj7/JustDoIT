---
title: Roman to Integer
difficulty: Easy
tags: [Math, Hash Table, String]
link: https://leetcode.com/problems/roman-to-integer/
---

# Roman to Integer

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [13. Roman to Integer](https://leetcode.com/problems/roman-to-integer/) |
| **Tags** | Math, Hash Table, String |

## Problem Statement

Roman numerals use seven symbols: I, V, X, L, C, D, M.

| Symbol | Value |
|---|---|
| I | 1 |
| V | 5 |
| X | 10 |
| L | 50 |
| C | 100 |
| D | 500 |
| M | 1000 |

Usually symbols are written from largest to smallest. However, there are six subtraction cases:
- `IV` = 4, `IX` = 9
- `XL` = 40, `XC` = 90
- `CD` = 400, `CM` = 900

Given a Roman numeral string, convert it to an integer.

**Example 1:**
```
Input:  s = "III"
Output: 3
```

**Example 2:**
```
Input:  s = "MCMXCIV"
Output: 1994
```

---

## Intuition

Scan the string left to right. Normally you add each symbol's value. The **subtraction rule** kicks in when a smaller symbol appears *before* a larger one — in that case, subtract the smaller value instead of adding it.

The elegance: you only need to compare the current symbol with the next one. If `s[i] < s[i+1]`, subtract `s[i]`. Otherwise, add it.

```
MCMXCIV:
  M  = 1000  → next is C (1000 > 100) → add 1000
  C  =  100  → next is M (100 < 1000) → subtract 100
  M  = 1000  → next is X (1000 > 10) → add 1000
  X  =   10  → next is C (10 < 100) → subtract 10
  C  =  100  → next is I (100 > 1) → add 100
  I  =    1  → next is V (1 < 5) → subtract 1
  V  =    5  → no next → add 5

Total = 1000 - 100 + 1000 - 10 + 100 - 1 + 5 = 1994 ✓
```

---

## Approach: Right-to-Left Scan (Cleanest)

Scan from right to left. Always add the current value. If the current value is *less than the maximum seen so far*, subtract instead of add.

This avoids needing to look ahead.

```cpp
int romanToInt(string s) {
    unordered_map<char, int> val = {
        {'I',1},{'V',5},{'X',10},{'L',50},
        {'C',100},{'D',500},{'M',1000}
    };
    int result = 0, maxSeen = 0;
    for (int i = s.size() - 1; i >= 0; i--) {
        int v = val[s[i]];
        if (v < maxSeen) result -= v;
        else { result += v; maxSeen = v; }
    }
    return result;
}
```

```java
int romanToInt(String s) {
    Map<Character, Integer> val = Map.of(
        'I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000
    );
    int result = 0, maxSeen = 0;
    for (int i = s.length() - 1; i >= 0; i--) {
        int v = val.get(s.charAt(i));
        if (v < maxSeen) result -= v;
        else { result += v; maxSeen = v; }
    }
    return result;
}
```

```typescript
function romanToInt(s: string): number {
    const val: Record<string, number> = {
        I:1, V:5, X:10, L:50, C:100, D:500, M:1000
    };
    let result = 0, maxSeen = 0;
    for (let i = s.length - 1; i >= 0; i--) {
        const v = val[s[i]];
        if (v < maxSeen) result -= v;
        else { result += v; maxSeen = v; }
    }
    return result;
}
```

```python
def roman_to_int(s: str) -> int:
    val = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    result, max_seen = 0, 0
    for ch in reversed(s):
        v = val[ch]
        if v < max_seen:
            result -= v
        else:
            result += v
            max_seen = v
    return result
```

```go
func romanToInt(s string) int {
    val := map[byte]int{'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    result, maxSeen := 0, 0
    for i := len(s) - 1; i >= 0; i-- {
        v := val[s[i]]
        if v < maxSeen { result -= v } else { result += v; maxSeen = v }
    }
    return result
}
```

**Time:** O(n) — **Space:** O(1) (map has fixed 7 entries)

---

## Alternative: Left-to-Right with Look-Ahead

Check the next character. If current < next, subtract; otherwise add.

```cpp
int romanToInt(string s) {
    unordered_map<char, int> val = {
        {'I',1},{'V',5},{'X',10},{'L',50},
        {'C',100},{'D',500},{'M',1000}
    };
    int result = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        int v = val[s[i]];
        if (i + 1 < (int)s.size() && v < val[s[i+1]])
            result -= v;
        else
            result += v;
    }
    return result;
}
```

```java
int romanToInt(String s) {
    Map<Character, Integer> val = Map.of(
        'I',1,'V',5,'X',10,'L',50,'C',100,'D',500,'M',1000
    );
    int result = 0;
    for (int i = 0; i < s.length(); i++) {
        int v = val.get(s.charAt(i));
        if (i + 1 < s.length() && v < val.get(s.charAt(i + 1)))
            result -= v;
        else
            result += v;
    }
    return result;
}
```

```typescript
function romanToInt(s: string): number {
    const val: Record<string, number> = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
    let result = 0;
    for (let i = 0; i < s.length; i++) {
        const v = val[s[i]];
        if (i + 1 < s.length && v < val[s[i+1]]) result -= v;
        else result += v;
    }
    return result;
}
```

```python
def roman_to_int(s: str) -> int:
    val = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    result = 0
    for i, ch in enumerate(s):
        v = val[ch]
        if i + 1 < len(s) and v < val[s[i+1]]:
            result -= v
        else:
            result += v
    return result
```

```go
func romanToInt(s string) int {
    val := map[byte]int{'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    result := 0
    for i := 0; i < len(s); i++ {
        v := val[s[i]]
        if i+1 < len(s) && v < val[s[i+1]] { result -= v } else { result += v }
    }
    return result
}
```

**Time:** O(n) — **Space:** O(1)

---

## Key Interview Insights

- **The core rule:** If a smaller symbol precedes a larger one, subtract it. This is the only rule you need to remember.
- **Right-to-left is slightly cleaner** because you never need a look-ahead; you track the max seen so far.
- **Left-to-right with look-ahead** is more natural to explain verbally — good for talking through in an interview.
- **No edge cases in valid input:** LeetCode guarantees the input is a valid Roman numeral. No need to validate.
- **Follow-up:** "Integer to Roman" (LC 12) reverses the problem — work from largest symbol to smallest, greedily subtracting.
- Variations: "What if the input has invalid Roman numerals?" — add validation; "Convert 1-3999 to Roman" → LC 12.
