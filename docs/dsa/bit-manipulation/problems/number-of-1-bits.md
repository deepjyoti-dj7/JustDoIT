---
title: Number of 1 Bits
difficulty: Easy
tags: [Bit Manipulation, Divide and Conquer]
link: https://leetcode.com/problems/number-of-1-bits/
---

# Number of 1 Bits

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [191. Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) |
| **Tags** | Bit Manipulation, Divide and Conquer |

## Problem Statement

Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the **Hamming weight**).

**Example 1:**
```
Input:  n = 11  (binary: 1011)
Output: 3
```

**Example 2:**
```
Input:  n = 128  (binary: 10000000)
Output: 1
```

**Example 3:**
```
Input:  n = 2147483645  (binary: 1111111111111111111111111111101)
Output: 30
```

---

## Intuition

We need to count how many bits are `1` in the 32-bit binary representation of `n`.

Two clean approaches:
1. **Shift loop** — check the lowest bit, shift right, repeat 32 times.
2. **Brian Kernighan's trick** — each step clears the *rightmost* set bit. We only loop as many times as there are set bits — faster for sparse numbers.

The key insight for Brian Kernighan: `n & (n-1)` always clears the rightmost 1-bit. So if we do this repeatedly and count iterations, we get the Hamming weight.

---

## Approach 1: Shift Loop (Check Each Bit)

Check the lowest bit with `n & 1`, then right-shift `n` by 1. Repeat 32 times.

Use **logical** right shift (unsigned) so that negative/large numbers don't cause infinite loops due to sign-bit extension.

```cpp
int hammingWeight(uint32_t n) {
    int count = 0;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}
```

```java
int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        count += n & 1;
        n >>>= 1;   // >>> is logical right shift in Java
    }
    return count;
}
```

```typescript
function hammingWeight(n: number): number {
    let count = 0;
    while (n !== 0) {
        count += n & 1;
        n >>>= 1;   // >>> is logical (unsigned) right shift in JS/TS
    }
    return count;
}
```

```python
def hamming_weight(n: int) -> int:
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count
```

```go
func hammingWeight(n uint32) int {
    count := 0
    for n != 0 {
        count += int(n & 1)
        n >>= 1
    }
    return count
}
```

**Time:** O(32) = O(1) — **Space:** O(1)

---

## Approach 2: Brian Kernighan's Algorithm (Optimal)

Each iteration of `n = n & (n - 1)` removes exactly the rightmost set bit. Count how many iterations until `n` becomes 0.

```
n = 13 = 1101

n &= n-1:  1101 & 1100 = 1100   (removed rightmost 1)  count=1
n &= n-1:  1100 & 1011 = 1000   (removed rightmost 1)  count=2
n &= n-1:  1000 & 0111 = 0000   (removed rightmost 1)  count=3
n = 0, stop.   Answer: 3 ✓
```

This loops only as many times as there are set bits — better for sparse inputs.

```cpp
int hammingWeight(uint32_t n) {
    int count = 0;
    while (n) {
        n &= n - 1;   // clear rightmost set bit
        count++;
    }
    return count;
}
```

```java
int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= n - 1;
        count++;
    }
    return count;
}
```

```typescript
function hammingWeight(n: number): number {
    let count = 0;
    while (n !== 0) {
        n &= n - 1;
        count++;
    }
    return count;
}
```

```python
def hamming_weight(n: int) -> int:
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count
```

```go
func hammingWeight(n uint32) int {
    count := 0
    for n != 0 {
        n &= n - 1
        count++
    }
    return count
}
```

**Time:** O(k) where k = number of set bits — **Space:** O(1)

---

## Approach 3: Built-in Functions

Language standard libraries provide optimized popcount intrinsics (often a single CPU instruction):

```cpp
int hammingWeight(uint32_t n) {
    return __builtin_popcount(n);  // GCC/Clang intrinsic
}
```

```java
int hammingWeight(int n) {
    return Integer.bitCount(n);
}
```

```typescript
// No built-in; use Brian Kernighan or:
function hammingWeight(n: number): number {
    return n.toString(2).split('').filter(b => b === '1').length;
}
```

```python
def hamming_weight(n: int) -> int:
    return bin(n).count('1')
```

```go
import "math/bits"
func hammingWeight(n uint32) int {
    return bits.OnesCount32(n)
}
```

**Time:** O(1) hardware — **Space:** O(1)

---

## Complexity Comparison

| Approach | Time | Space | Notes |
|---|---|---|---|
| Shift loop | O(32) | O(1) | Always 32 iterations |
| Brian Kernighan | O(k) | O(1) | k = set bit count; faster for sparse |
| Built-in popcount | O(1) | O(1) | Single hardware instruction |

---

## Key Interview Insights

- **Know Brian Kernighan** — examiners love it because it shows you know the `n & (n-1)` trick, which appears in many problems (power-of-two check, etc.).
- **Java pitfall:** Use `>>>` not `>>` for the shift loop, or your loop won't terminate for negative inputs because `>>` extends the sign bit.
- **Python note:** Python integers have arbitrary precision — the shift loop will still terminate because Python's `>>` eventually zeroes out all bits even for large positives.
- **Follow-up:** "What if the function is called many times?" → precompute a lookup table for 8-bit chunks; process 32-bit integer in four 8-bit lookups.
- This is a warm-up for **Counting Bits (LC 338)**, which asks for Hamming weight of all numbers from 0 to n.
