---
title: Palindrome Number
difficulty: Easy
tags: [Math]
link: https://leetcode.com/problems/palindrome-number/
---

# Palindrome Number

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [9. Palindrome Number](https://leetcode.com/problems/palindrome-number/) |
| **Tags** | Math |

## Problem Statement

Given an integer `x`, return `true` if `x` is a **palindrome**, and `false` otherwise. A palindrome reads the same backward as forward.

**Example 1:**
```
Input:  x = 121
Output: true
```

**Example 2:**
```
Input:  x = -121
Output: false   (reads -121 forward, 121- backward)
```

**Example 3:**
```
Input:  x = 10
Output: false   (reads 01 backward)
```

**Follow-up:** Could you solve it without converting the integer to a string?

---

## Intuition

Two approaches:

1. **String conversion** — convert to string and check if it equals its reverse. Simple but uses O(n) extra space.
2. **Reverse half the number** — only reverse the second half of the digits. If the original first half equals the reversed second half, it's a palindrome. No string conversion, O(1) extra space.

**Immediate eliminations (before any math):**
- Any negative number → false (the minus sign breaks symmetry)
- Numbers ending in 0 (except 0 itself) → false (no positive integer starts with 0)

---

## Approach 1: String Conversion

Convert to string, compare with its reverse.

```cpp
bool isPalindrome(int x) {
    if (x < 0) return false;
    string s = to_string(x);
    string rev = string(s.rbegin(), s.rend());
    return s == rev;
}
```

```java
boolean isPalindrome(int x) {
    if (x < 0) return false;
    String s = Integer.toString(x);
    return s.equals(new StringBuilder(s).reverse().toString());
}
```

```typescript
function isPalindrome(x: number): boolean {
    if (x < 0) return false;
    const s = x.toString();
    return s === s.split('').reverse().join('');
}
```

```python
def is_palindrome(x: int) -> bool:
    if x < 0: return False
    s = str(x)
    return s == s[::-1]
```

```go
func isPalindrome(x int) bool {
    if x < 0 { return false }
    s := strconv.Itoa(x)
    for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
        if s[i] != s[j] { return false }
    }
    return true
}
```

**Time:** O(log x) — O(d) where d = number of digits — **Space:** O(log x)

---

## Approach 2: Reverse Half the Number (No String)

Only reverse the second half of digits. Stop when the remaining first half is ≤ the reversed second half. For an even-digit palindrome: `firstHalf == secondHalfReversed`. For odd digits: `firstHalf == secondHalfReversed / 10` (discard the middle digit).

```
x = 1221
  rev = 0, x = 1221  →  rev = 1, x = 122
  rev = 12, x = 12   →  x (12) == rev (12) ✓

x = 12321
  rev = 1, x = 1232  →  rev = 12, x = 123  →  rev = 123, x = 12
  x (12) == rev (123) / 10 = 12  ✓ (odd digits — discard middle)
```

```cpp
bool isPalindrome(int x) {
    if (x < 0 || (x != 0 && x % 10 == 0)) return false;
    int rev = 0;
    while (x > rev) {
        rev = rev * 10 + x % 10;
        x /= 10;
    }
    return x == rev || x == rev / 10;
}
```

```java
boolean isPalindrome(int x) {
    if (x < 0 || (x != 0 && x % 10 == 0)) return false;
    int rev = 0;
    while (x > rev) {
        rev = rev * 10 + x % 10;
        x /= 10;
    }
    return x == rev || x == rev / 10;
}
```

```typescript
function isPalindrome(x: number): boolean {
    if (x < 0 || (x !== 0 && x % 10 === 0)) return false;
    let rev = 0;
    while (x > rev) {
        rev = rev * 10 + x % 10;
        x = Math.floor(x / 10);
    }
    return x === rev || x === Math.floor(rev / 10);
}
```

```python
def is_palindrome(x: int) -> bool:
    if x < 0 or (x != 0 and x % 10 == 0):
        return False
    rev = 0
    while x > rev:
        rev = rev * 10 + x % 10
        x //= 10
    return x == rev or x == rev // 10
```

```go
func isPalindrome(x int) bool {
    if x < 0 || (x != 0 && x%10 == 0) { return false }
    rev := 0
    for x > rev {
        rev = rev*10 + x%10
        x /= 10
    }
    return x == rev || x == rev/10
}
```

**Time:** O(log x) — **Space:** O(1)

---

## Dry Run

`x = 1221`

| x | rev | x > rev? |
|---|---|---|
| 1221 | 0 | yes |
| 122 | 1 | yes |
| 12 | 12 | no — stop |

`x == rev` → `12 == 12` → **true** ✓

`x = 12321`

| x | rev | x > rev? |
|---|---|---|
| 12321 | 0 | yes |
| 1232 | 1 | yes |
| 123 | 12 | yes |
| 12 | 123 | no — stop |

`x == rev / 10` → `12 == 12` → **true** ✓ (middle digit 3 discarded)

---

## Key Interview Insights

- **The half-reversal trick** is the "follow-up" answer. Showing you know it signals you've thought beyond the obvious.
- **Why `x % 10 == 0` with `x != 0` → false?** A number like `10, 100, 1000` would reverse to `01, 001` — not palindromes. And the reversal loop wouldn't detect this correctly since leading zeros are dropped.
- **No overflow risk** in the half-reversal approach: `rev` never exceeds the original `x`, and `x` is an `int` input. No `long` needed.
- **The `x > rev` loop condition** elegantly handles both even and odd digit counts without knowing the digit count in advance.
