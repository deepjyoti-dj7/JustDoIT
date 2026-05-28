---
title: Sum of Two Integers
difficulty: Medium
tags: [Bit Manipulation, Math]
link: https://leetcode.com/problems/sum-of-two-integers/
---

# Sum of Two Integers

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [371. Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/) |
| **Tags** | Bit Manipulation, Math |

## Problem Statement

Given two integers `a` and `b`, return the sum of the two integers without using the operators `+` or `-`.

**Example 1:**
```
Input:  a = 1, b = 2
Output: 3
```

**Example 2:**
```
Input:  a = 2, b = 3
Output: 5
```

---

## Intuition

Think about how addition actually works at the binary level. When you add two bits:

```
0 + 0 = 0   (no carry)
0 + 1 = 1   (no carry)
1 + 0 = 1   (no carry)
1 + 1 = 0   with carry 1
```

The **sum without carry** is exactly XOR: `a ^ b`.
The **carry** is exactly AND shifted left: `(a & b) << 1`.

So: `a + b = (a ^ b) + carry`, and carry itself can be added the same way — keep applying until the carry is 0.

```
a = 0011  (3)
b = 0101  (5)

Round 1:
  sum  = 0011 ^ 0101 = 0110  (partial sum, no carries yet)
  carry= (0011 & 0101) << 1 = 0001 << 1 = 0010

Round 2:
  sum  = 0110 ^ 0010 = 0100
  carry= (0110 & 0010) << 1 = 0010 << 1 = 0100

Round 3:
  sum  = 0100 ^ 0100 = 0000
  carry= (0100 & 0100) << 1 = 0100 << 1 = 1000

Round 4:
  sum  = 0000 ^ 1000 = 1000  (8)
  carry= 0

Result: 1000 = 8  ✓  (3 + 5 = 8)
```

Each round "ripples" the carry one position to the left. We stop when carry = 0.

---

## Approach: XOR + Carry Iteration

Iteratively compute the XOR sum and the carry. Reassign `a = XOR result` and `b = carry`. Repeat until `b` (carry) is 0. At that point, `a` holds the answer.

```cpp
int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;  // positions where carry is generated
        a = a ^ b;                  // sum without carry
        b = carry;
    }
    return a;
}
```

```java
int getSum(int a, int b) {
    while (b != 0) {
        int carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}
```

```typescript
function getSum(a: number, b: number): number {
    while (b !== 0) {
        const carry = (a & b) << 1;
        a = a ^ b;
        b = carry;
    }
    return a;
}
```

```python
def get_sum(a: int, b: int) -> int:
    # Python integers are arbitrary-precision — must mask to 32-bit unsigned
    MASK = 0xFFFFFFFF   # 32-bit mask
    MAX  = 0x7FFFFFFF   # max positive 32-bit signed int

    while b != 0:
        carry = ((a & b) << 1) & MASK
        a = (a ^ b) & MASK
        b = carry

    # If a > MAX, it's a negative number in 32-bit two's complement
    return a if a <= MAX else ~(a ^ MASK)
```

```go
func getSum(a int, b int) int {
    for b != 0 {
        carry := (a & b) << 1
        a = a ^ b
        b = carry
    }
    return a
}
```

**Time:** O(32) = O(1) — at most 32 carry propagations for 32-bit integers — **Space:** O(1)

---

## Why Python Needs Special Treatment

Python integers are **arbitrary precision** — they never overflow and don't wrap around at 32 bits. The carry can grow without bound, making the loop potentially infinite for negative numbers.

The fix: mask to 32 bits after each operation using `& 0xFFFFFFFF`. After the loop, if the result has bit 31 set (i.e., `a > 0x7FFFFFFF`), it represents a negative number in 32-bit two's complement. Convert it back: `~(a ^ MASK)`.

---

## Dry Run

`a = 7 (0111)`, `b = 5 (0101)`

| Round | a (XOR) | b (carry) |
|---|---|---|
| Start | 0111 (7) | 0101 (5) |
| 1 | 0111^0101 = 0010 (2) | (0111&0101)<<1 = 0101<<1 = 1010 (10) |
| 2 | 0010^1010 = 1000 (8) | (0010&1010)<<1 = 0010<<1 = 0100 (4) |
| 3 | 1000^0100 = 1100 (12) | (1000&0100)<<1 = 0000 = 0 |
| 4 | carry=0, stop | — |

Result: `1100 = 12` ✓ (7 + 5 = 12)

---

## Key Interview Insights

- **This is a pure conceptual problem.** Interviewers want to see that you understand how binary addition works: XOR = sum bits, AND+shift = carry bits.
- **The loop terminates** because each carry shifts the shared 1-bits one position left. After at most 32 shifts, carry is 0.
- **Python trap:** Almost every candidate who uses Python will write an infinite loop without the 32-bit mask. Explicitly discuss this tradeoff.
- **Negative numbers work correctly** in C++/Java/Go/TypeScript because those languages use fixed-width two's complement — XOR and AND handle negatives transparently.
- **Subtraction without `-`:** `a - b = a + (-b)`. And `-b = ~b + 1` in two's complement. So `getSum(a, getSum(~b, 1))` gives `a - b`.
- **Follow-up:** "Can you do it recursively?" — `getSum(a ^ b, (a & b) << 1)` with base case `b == 0: return a`. The iterative version is preferred.
