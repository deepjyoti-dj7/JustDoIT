---
title: Sqrt(x)
difficulty: Easy
tags: [Math, Binary Search]
link: https://leetcode.com/problems/sqrtx/
---

# Sqrt(x)

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [69. Sqrt(x)](https://leetcode.com/problems/sqrtx/) |
| **Tags** | Math, Binary Search |

## Problem Statement

Given a non-negative integer `x`, return the square root of `x` **rounded down** to the nearest integer. The returned integer should be non-negative.

You must not use any built-in exponent function or operator (e.g., `pow(x, 0.5)` or `x ** 0.5`).

**Example 1:**
```
Input:  x = 4
Output: 2
```

**Example 2:**
```
Input:  x = 8
Output: 2   (sqrt(8) ≈ 2.828; floor = 2)
```

---

## Intuition

We want the largest integer `k` such that `k * k <= x`.

The answer lies in `[0, x]`. The function `f(k) = k * k` is monotonically increasing — perfect for **binary search**.

Binary search on the answer:
- If `mid * mid == x` → found exact answer
- If `mid * mid < x` → answer is ≥ mid, move left pointer right
- If `mid * mid > x` → answer is < mid, move right pointer left

Track the last `mid` where `mid * mid <= x` — that's the floor of the square root.

**Alternative:** Newton's method converges faster in practice (quadratic convergence) but is harder to analyze.

---

## Approach 1: Binary Search

```cpp
int mySqrt(int x) {
    if (x < 2) return x;
    int lo = 1, hi = x / 2, ans = 1;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        if (mid * mid == x) return (int)mid;
        if (mid * mid < x) { ans = (int)mid; lo = (int)mid + 1; }
        else hi = (int)mid - 1;
    }
    return ans;
}
```

```java
int mySqrt(int x) {
    if (x < 2) return x;
    int lo = 1, hi = x / 2, ans = 1;
    while (lo <= hi) {
        long mid = lo + (hi - lo) / 2;
        if (mid * mid == x) return (int) mid;
        if (mid * mid < x) { ans = (int) mid; lo = (int) mid + 1; }
        else hi = (int) mid - 1;
    }
    return ans;
}
```

```typescript
function mySqrt(x: number): number {
    if (x < 2) return x;
    let lo = 1, hi = Math.floor(x / 2), ans = 1;
    while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        if (mid * mid === x) return mid;
        if (mid * mid < x) { ans = mid; lo = mid + 1; }
        else hi = mid - 1;
    }
    return ans;
}
```

```python
def my_sqrt(x: int) -> int:
    if x < 2: return x
    lo, hi, ans = 1, x // 2, 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if mid * mid == x: return mid
        if mid * mid < x:
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return ans
```

```go
func mySqrt(x int) int {
    if x < 2 { return x }
    lo, hi, ans := 1, x/2, 1
    for lo <= hi {
        mid := lo + (hi-lo)/2
        if mid*mid == x { return mid }
        if mid*mid < x { ans = mid; lo = mid + 1 } else { hi = mid - 1 }
    }
    return ans
}
```

**Time:** O(log x) — **Space:** O(1)

---

## Approach 2: Newton's Method (Fast Convergence)

Newton's method finds roots by iterative approximation. For `f(k) = k^2 - x = 0`:

```
next_k = k - f(k)/f'(k) = k - (k^2 - x)/(2k) = (k + x/k) / 2
```

Start with an initial guess, iterate until the result stops decreasing.

```cpp
int mySqrt(int x) {
    if (x < 2) return x;
    long k = x;
    while (k * k > x)
        k = (k + x / k) / 2;
    return (int)k;
}
```

```java
int mySqrt(int x) {
    if (x < 2) return x;
    long k = x;
    while (k * k > x)
        k = (k + x / k) / 2;
    return (int) k;
}
```

```typescript
function mySqrt(x: number): number {
    if (x < 2) return x;
    let k = x;
    while (k * k > x)
        k = Math.floor((k + Math.floor(x / k)) / 2);
    return k;
}
```

```python
def my_sqrt(x: int) -> int:
    if x < 2: return x
    k = x
    while k * k > x:
        k = (k + x // k) // 2
    return k
```

```go
func mySqrt(x int) int {
    if x < 2 { return x }
    k := x
    for k*k > x { k = (k + x/k) / 2 }
    return k
}
```

**Time:** O(log log x) — quadratic convergence — **Space:** O(1)

---

## Dry Run — Binary Search

`x = 8`

Initial: `lo=1, hi=4, ans=1`

| lo | hi | mid | mid*mid | action |
|---|---|---|---|---|
| 1 | 4 | 2 | 4 < 8 | ans=2, lo=3 |
| 3 | 4 | 3 | 9 > 8 | hi=2 |
| — | lo > hi | stop | — | return ans=2 |

Result: **2** ✓

---

## Edge Cases

| Input | Output | Reason |
|---|---|---|
| 0 | 0 | sqrt(0) = 0 |
| 1 | 1 | sqrt(1) = 1 |
| 2 | 1 | floor(sqrt(2)) = 1 |
| 4 | 2 | exact |
| INT_MAX (2147483647) | 46340 | 46340^2 = 2147395600 ≤ INT_MAX |

---

## Key Interview Insights

- **Overflow:** `mid * mid` overflows `int` for large `x`. Use `long` for the multiplication in C++/Java.
- **Why `hi = x / 2`?** For `x >= 2`, sqrt(x) ≤ x/2. This halves the initial search space.
- **Binary search is the expected answer.** Newton's method is a bonus — mention it if asked about faster convergence.
- **The `ans` tracking pattern:** Instead of checking if `lo > hi` after the loop, track the best valid `mid` inside the loop. This is cleaner than post-loop analysis.
- **Follow-up:** "Return as a double with p decimal places" — binary search continues into fractional range; stop when `hi - lo < 10^(-p)`.
