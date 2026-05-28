---
title: Pow(x, n)
difficulty: Medium
tags: [Math, Recursion]
link: https://leetcode.com/problems/powx-n/
---

# Pow(x, n)

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [50. Pow(x, n)](https://leetcode.com/problems/powx-n/) |
| **Tags** | Math, Recursion |

## Problem Statement

Implement `pow(x, n)`, which calculates `x` raised to the power `n` (i.e., `x^n`).

**Example 1:**
```
Input:  x = 2.00000, n = 10
Output: 1024.00000
```

**Example 2:**
```
Input:  x = 2.10000, n = 3
Output: 9.26100
```

**Example 3:**
```
Input:  x = 2.00000, n = -2
Output: 0.25000   (1 / 2^2 = 0.25)
```

**Constraints:** `-100.0 < x < 100.0`, `-2^31 <= n <= 2^31 - 1`

---

## Intuition

Multiplying `x` by itself `n` times is O(n) — too slow for `n = 2^31 - 1`.

**Binary exponentiation** (fast power) computes `x^n` in O(log n) by halving the problem each time:

```
x^n = (x^(n/2))^2          if n is even
x^n = x * (x^(n/2))^2      if n is odd
```

For negative `n`: `x^(-n) = (1/x)^n`. Replace `x` with `1.0/x` and negate `n`.

**The critical pitfall:** `n = INT_MIN = -2147483648`. Negating this overflows a 32-bit signed integer since `INT_MAX = 2147483647`. Cast to `long` first.

---

## Approach 1: Recursive Fast Power

```cpp
double myPow(double x, int n) {
    long exp = n;  // cast to long to handle INT_MIN safely
    if (exp < 0) { x = 1.0 / x; exp = -exp; }
    return fastPow(x, exp);
}

double fastPow(double base, long exp) {
    if (exp == 0) return 1.0;
    double half = fastPow(base, exp / 2);
    if (exp % 2 == 0) return half * half;
    return half * half * base;
}
```

```java
double myPow(double x, int n) {
    long exp = n;
    if (exp < 0) { x = 1.0 / x; exp = -exp; }
    return fastPow(x, exp);
}

double fastPow(double base, long exp) {
    if (exp == 0) return 1.0;
    double half = fastPow(base, exp / 2);
    return exp % 2 == 0 ? half * half : half * half * base;
}
```

```typescript
function myPow(x: number, n: number): number {
    if (n < 0) { x = 1 / x; n = -n; }
    function fastPow(base: number, exp: number): number {
        if (exp === 0) return 1;
        const half = fastPow(base, Math.floor(exp / 2));
        return exp % 2 === 0 ? half * half : half * half * base;
    }
    return fastPow(x, n);
}
```

```python
def my_pow(x: float, n: int) -> float:
    if n < 0:
        x, n = 1.0 / x, -n

    def fast_pow(base: float, exp: int) -> float:
        if exp == 0: return 1.0
        half = fast_pow(base, exp // 2)
        return half * half if exp % 2 == 0 else half * half * base

    return fast_pow(x, n)
```

```go
func myPow(x float64, n int) float64 {
    if n < 0 { x = 1.0 / x; n = -n }
    var fastPow func(float64, int) float64
    fastPow = func(base float64, exp int) float64 {
        if exp == 0 { return 1.0 }
        half := fastPow(base, exp/2)
        if exp%2 == 0 { return half * half }
        return half * half * base
    }
    return fastPow(x, n)
}
```

**Time:** O(log n) — **Space:** O(log n) recursion stack

---

## Approach 2: Iterative Fast Power (O(1) Space)

Process bits of `n` from right to left. Multiply result by `base` when the current bit is 1; always square `base`.

```cpp
double myPow(double x, int n) {
    long exp = n;
    if (exp < 0) { x = 1.0 / x; exp = -exp; }
    double result = 1.0;
    while (exp > 0) {
        if (exp & 1) result *= x;
        x *= x;
        exp >>= 1;
    }
    return result;
}
```

```java
double myPow(double x, int n) {
    long exp = n;
    if (exp < 0) { x = 1.0 / x; exp = -exp; }
    double result = 1.0;
    while (exp > 0) {
        if ((exp & 1) == 1) result *= x;
        x *= x;
        exp >>= 1;
    }
    return result;
}
```

```typescript
function myPow(x: number, n: number): number {
    if (n < 0) { x = 1 / x; n = -n; }
    let result = 1;
    while (n > 0) {
        if (n & 1) result *= x;
        x *= x;
        n >>= 1;
    }
    return result;
}
```

```python
def my_pow(x: float, n: int) -> float:
    if n < 0:
        x, n = 1.0 / x, -n
    result = 1.0
    while n > 0:
        if n & 1:
            result *= x
        x *= x
        n >>= 1
    return result
```

```go
func myPow(x float64, n int) float64 {
    if n < 0 { x = 1.0 / x; n = -n }
    result := 1.0
    for n > 0 {
        if n&1 == 1 { result *= x }
        x *= x
        n >>= 1
    }
    return result
}
```

**Time:** O(log n) — **Space:** O(1)

---

## Dry Run

`x = 2, n = 10 (binary: 1010)`

| n | n & 1 | result | x (squaring) |
|---|---|---|---|
| 10 (1010) | 0 | 1.0 | 2 → 4 |
| 5 (0101) | 1 | 1 * 4 = 4 | 4 → 16 |
| 2 (0010) | 0 | 4 | 16 → 256 |
| 1 (0001) | 1 | 4 * 256 = 1024 | — |
| 0 | stop | **1024** | — |

2^10 = 1024 ✓

---

## Edge Cases

| Input | Output | Reason |
|---|---|---|
| x=2, n=0 | 1.0 | Any base to 0th power = 1 |
| x=0, n=0 | 1.0 | Convention: 0^0 = 1 (LeetCode) |
| x=2, n=-1 | 0.5 | 1/2 |
| n = INT_MIN (-2147483648) | Handle carefully | `-n` overflows int; cast to long first |

---

## Key Interview Insights

- **INT_MIN negation overflow** is the number one bug. Always cast `n` to `long` before negating.
- **The iterative version is preferred** in interviews — no stack overflow risk, O(1) space.
- **Both recursive and iterative** are O(log n) time. The recursive version has O(log n) stack depth.
- **x = 0 with n < 0 is undefined** (division by zero). LeetCode guarantees `x != 0` when `n < 0`.
- **Floating point precision** is typically not tested — the judge allows small errors (usually 10^-5 tolerance).
- **Direct application of `fast-exponentiation.md` theory** — this problem is exactly the binary exponentiation algorithm applied to floating-point.
