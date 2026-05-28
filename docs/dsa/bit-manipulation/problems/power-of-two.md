---
title: Power of Two
difficulty: Easy
tags: [Bit Manipulation, Math, Recursion]
link: https://leetcode.com/problems/power-of-two/
---

# Power of Two

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [231. Power of Two](https://leetcode.com/problems/power-of-two/) |
| **Tags** | Bit Manipulation, Math, Recursion |

## Problem Statement

Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.

An integer `n` is a power of two if there exists an integer `k` such that `n == 2^k`.

**Example 1:**
```
Input:  n = 1   (2^0)
Output: true
```

**Example 2:**
```
Input:  n = 16  (2^4)
Output: true
```

**Example 3:**
```
Input:  n = 3
Output: false
```

---

## Intuition

A power of 2 in binary has **exactly one bit set**.

```
1  = 0001  ← one bit set ✓
2  = 0010  ← one bit set ✓
4  = 0100  ← one bit set ✓
8  = 1000  ← one bit set ✓

3  = 0011  ← two bits set ✗
5  = 0101  ← two bits set ✗
6  = 0110  ← two bits set ✗
```

**The `n & (n-1)` trick:** Subtracting 1 from a power of 2 flips the single set bit and turns on all lower bits.

```
8 = 1000
7 = 0111
8 & 7 = 0000   ← zero, so 8 is a power of 2

6 = 0110
5 = 0101
6 & 5 = 0100   ← non-zero, so 6 is NOT a power of 2
```

If `n & (n-1) == 0` and `n > 0`, then n is a power of 2.

The `n > 0` guard is necessary: n = 0 gives `0 & (-1) = 0`, which would incorrectly pass without it.

---

## Approach 1: Iterative Division

Repeatedly divide by 2 while n is even. If we reach 1, it's a power of 2.

```cpp
bool isPowerOfTwo(int n) {
    if (n <= 0) return false;
    while (n % 2 == 0) n /= 2;
    return n == 1;
}
```

```java
boolean isPowerOfTwo(int n) {
    if (n <= 0) return false;
    while (n % 2 == 0) n /= 2;
    return n == 1;
}
```

```typescript
function isPowerOfTwo(n: number): boolean {
    if (n <= 0) return false;
    while (n % 2 === 0) n /= 2;
    return n === 1;
}
```

```python
def is_power_of_two(n: int) -> bool:
    if n <= 0:
        return False
    while n % 2 == 0:
        n //= 2
    return n == 1
```

```go
func isPowerOfTwo(n int) bool {
    if n <= 0 { return false }
    for n%2 == 0 { n /= 2 }
    return n == 1
}
```

**Time:** O(log n) — **Space:** O(1)

---

## Approach 2: Bit Trick — `n & (n-1)` (Optimal)

A power of 2 has exactly one bit set. `n & (n-1)` clears the lowest set bit — if that gives 0, there was only one bit to begin with.

```cpp
bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}
```

```java
boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}
```

```typescript
function isPowerOfTwo(n: number): boolean {
    return n > 0 && (n & (n - 1)) === 0;
}
```

```python
def is_power_of_two(n: int) -> bool:
    return n > 0 and (n & (n - 1)) == 0
```

```go
func isPowerOfTwo(n int) bool {
    return n > 0 && (n&(n-1)) == 0
}
```

**Time:** O(1) — **Space:** O(1)

---

## Dry Run

`n = 16 = 10000`

`n - 1 = 15 = 01111`

`n & (n-1) = 10000 & 01111 = 00000 = 0` → n > 0 and result is 0 → **true** ✓

`n = 12 = 1100`

`n - 1 = 11 = 1011`

`n & (n-1) = 1100 & 1011 = 1000 ≠ 0` → **false** ✓

---

## Edge Cases

| Input | Expected | Reason |
|---|---|---|
| 0 | false | 0 is not a power of 2; without `n > 0`, `0 & -1 = 0` is a false positive |
| 1 | true | 2^0 = 1 |
| -1 | false | Negative numbers are never powers of 2 |
| INT_MIN (−2^31) | false | `n > 0` guards this |
| 2^30 | true | Largest power of 2 within 32-bit signed range |

---

## Key Interview Insights

- **The one-liner `n > 0 && (n & (n-1)) == 0` is the expected answer.** It demonstrates you know the `n & (n-1)` idiom.
- **Why `n > 0` and not `n != 0`?** Negative numbers: a negative power of 2 doesn't make sense by the problem definition. Also, `-1` in two's complement is all 1s, so `(-1) & (-2) = -2 ≠ 0` — actually false, but guard is cleaner than relying on this.
- **The `n & (n-1)` trick has many uses:** counting set bits (Brian Kernighan), the Power of Two check, and it's the basis for understanding Fenwick Tree index navigation.
- **Alternative:** `n > 0 && Integer.bitCount(n) == 1` — equally valid but doesn't demonstrate the bit trick.
- **Generalization:** "Power of 3? Power of k?" — for non-power-of-2 bases, the bit trick doesn't apply. Instead: repeatedly divide, or check if `MAX_POWER % n == 0` (since all lower powers divide into the max power).
