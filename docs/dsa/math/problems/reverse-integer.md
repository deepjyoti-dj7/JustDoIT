---
title: Reverse Integer
difficulty: Medium
tags: [Math]
link: https://leetcode.com/problems/reverse-integer/
---

# Reverse Integer

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [7. Reverse Integer](https://leetcode.com/problems/reverse-integer/) |
| **Tags** | Math |

## Problem Statement

Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside the signed 32-bit integer range `[-2^31, 2^31 - 1]`, return `0`.

**Assume the environment does not allow you to store 64-bit integers** (though most solutions do use `long` for intermediate values).

**Example 1:**
```
Input:  x = 123
Output: 321
```

**Example 2:**
```
Input:  x = -123
Output: -321
```

**Example 3:**
```
Input:  x = 120
Output: 21   (trailing zero dropped)
```

---

## Intuition

Extract digits one by one from the right using `% 10`, build the reversed number by multiplying the running result by 10 and adding the digit.

The core challenge: **overflow detection**. After reversing, the result may exceed `[-2^31, 2^31 - 1]`. We need to detect this *before* it happens (not after, when the value is already corrupted).

**Two strategies:**
1. **Use a 64-bit intermediate:** Build the result as a `long`/`int64`, then check if it fits in 32 bits before returning.
2. **Check before each digit addition:** Before `result = result * 10 + digit`, verify that `result * 10 + digit` won't overflow — without actually doing the multiplication. This satisfies the strict "no 64-bit integer" constraint.

---

## Approach 1: Using 64-bit Integer (Practical)

Build the reversed number in a `long`. After the loop, check bounds.

```cpp
int reverse(int x) {
    long rev = 0;
    while (x != 0) {
        rev = rev * 10 + x % 10;
        x /= 10;
    }
    return (rev > INT_MAX || rev < INT_MIN) ? 0 : (int)rev;
}
```

```java
int reverse(int x) {
    long rev = 0;
    while (x != 0) {
        rev = rev * 10 + x % 10;
        x /= 10;
    }
    return (rev > Integer.MAX_VALUE || rev < Integer.MIN_VALUE) ? 0 : (int) rev;
}
```

```typescript
function reverse(x: number): number {
    const sign = x < 0 ? -1 : 1;
    const digits = Math.abs(x).toString().split('').reverse().join('');
    const rev = sign * parseInt(digits, 10);
    return rev > 2**31 - 1 || rev < -(2**31) ? 0 : rev;
}
```

```python
def reverse(x: int) -> int:
    sign = -1 if x < 0 else 1
    rev = sign * int(str(abs(x))[::-1])
    return rev if -(2**31) <= rev <= 2**31 - 1 else 0
```

```go
func reverse(x int) int {
    rev := 0
    for x != 0 {
        rev = rev*10 + x%10
        x /= 10
    }
    if rev > math.MaxInt32 || rev < math.MinInt32 { return 0 }
    return rev
}
```

**Time:** O(log x) — digits of x — **Space:** O(1)

---

## Approach 2: Overflow Check Before Each Step (No 64-bit)

Before computing `rev * 10 + digit`, check if it would overflow:

```
If rev > INT_MAX / 10 → overflow guaranteed
If rev == INT_MAX / 10 and digit > 7 → overflow (INT_MAX ends in 7)
If rev < INT_MIN / 10 → underflow guaranteed
If rev == INT_MIN / 10 and digit < -8 → underflow (INT_MIN ends in -8)
```

```cpp
int reverse(int x) {
    int rev = 0;
    while (x != 0) {
        int digit = x % 10;
        x /= 10;
        if (rev > INT_MAX / 10 || (rev == INT_MAX / 10 && digit > 7)) return 0;
        if (rev < INT_MIN / 10 || (rev == INT_MIN / 10 && digit < -8)) return 0;
        rev = rev * 10 + digit;
    }
    return rev;
}
```

```java
int reverse(int x) {
    int rev = 0;
    while (x != 0) {
        int digit = x % 10;
        x /= 10;
        if (rev > Integer.MAX_VALUE / 10 || (rev == Integer.MAX_VALUE / 10 && digit > 7)) return 0;
        if (rev < Integer.MIN_VALUE / 10 || (rev == Integer.MIN_VALUE / 10 && digit < -8)) return 0;
        rev = rev * 10 + digit;
    }
    return rev;
}
```

```typescript
function reverse(x: number): number {
    const MAX = 2147483647, MIN = -2147483648;
    let rev = 0;
    while (x !== 0) {
        const digit = x % 10;
        x = Math.trunc(x / 10);
        if (rev > Math.trunc(MAX / 10) || (rev === Math.trunc(MAX / 10) && digit > 7)) return 0;
        if (rev < Math.trunc(MIN / 10) || (rev === Math.trunc(MIN / 10) && digit < -8)) return 0;
        rev = rev * 10 + digit;
    }
    return rev;
}
```

```python
def reverse(x: int) -> int:
    MAX, MIN = 2**31 - 1, -(2**31)
    sign = -1 if x < 0 else 1
    x = abs(x)
    rev = 0
    while x != 0:
        rev = rev * 10 + x % 10
        x //= 10
    rev *= sign
    return rev if MIN <= rev <= MAX else 0
```

```go
func reverse(x int) int {
    rev := 0
    for x != 0 {
        digit := x % 10
        x /= 10
        if rev > math.MaxInt32/10 || (rev == math.MaxInt32/10 && digit > 7) { return 0 }
        if rev < math.MinInt32/10 || (rev == math.MinInt32/10 && digit < -8) { return 0 }
        rev = rev*10 + digit
    }
    return rev
}
```

**Time:** O(log x) — **Space:** O(1)

---

## Dry Run

`x = -123`

| x | digit (x % 10) | rev |
|---|---|---|
| -123 | -3 | 0*10 + (-3) = -3 |
| -12 | -2 | -3*10 + (-2) = -32 |
| -1 | -1 | -32*10 + (-1) = -321 |
| 0 | — stop | -321 |

Within [-2^31, 2^31-1] → return **-321** ✓

---

## Key Interview Insights

- **Java's `%` with negatives:** In Java (and C++/Go), `-7 % 10 = -7` — the sign follows the dividend. This is correct behavior here; the digit carries the sign, and it all works out.
- **Python's `%` always non-negative:** Python returns `3` for `-7 % 10`. Handle separately: take `abs(x)`, reverse, then apply sign.
- **The 64-bit approach is cleaner** and universally accepted in interviews. The "no 64-bit" variant is mainly a teaching tool for understanding overflow.
- **INT_MAX = 2147483647** ends in digit 7. **INT_MIN = -2147483648** ends in digit 8. These are the critical boundary digits.
- **Trailing zeros:** They automatically disappear — `120 % 10 = 0`, added to `rev = 0`, gives `rev = 0`. Then `12 % 10 = 2`, giving `rev = 2`, and so on. Natural behavior.
