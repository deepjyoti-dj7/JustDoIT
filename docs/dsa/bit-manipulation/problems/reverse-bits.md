---
title: Reverse Bits
difficulty: Easy
tags: [Bit Manipulation, Divide and Conquer]
link: https://leetcode.com/problems/reverse-bits/
---

# Reverse Bits

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [190. Reverse Bits](https://leetcode.com/problems/reverse-bits/) |
| **Tags** | Bit Manipulation, Divide and Conquer |

## Problem Statement

Reverse the bits of a given 32-bit unsigned integer.

**Example 1:**
```
Input:  n = 00000010100101000001111010011100  (43261596)
Output:    00111001011110000010100101000000  (964176192)
```

**Example 2:**
```
Input:  n = 11111111111111111111111111111101  (4294967293)
Output:    10111111111111111111111111111111  (3221225471)
```

---

## Intuition

We want bit 0 to go to position 31, bit 1 to position 30, ..., bit 31 to position 0.

The approach: for each of the 32 bit positions, extract the lowest bit of `n`, shift it into the correct position in the result, then shift `n` right by 1 to expose the next bit.

Each iteration:
1. Shift `result` left by 1 (making room for the next bit)
2. OR in the current lowest bit of `n`
3. Shift `n` right by 1

After 32 iterations, every bit has been placed in its reversed position.

```
n = ...1010   (original, reading right to left)

Step 1: result = 0, extract n's bit 0 = 0 → result = 0
Step 2: extract bit 1 = 1 → result = 01
Step 3: extract bit 2 = 0 → result = 010
Step 4: extract bit 3 = 1 → result = 0101
...
```

---

## Approach: Bit-by-Bit Reversal

Extract the LSB of `n` at each step and shift it into the correct position in `result`.

```cpp
uint32_t reverseBits(uint32_t n) {
    uint32_t result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>= 1;
    }
    return result;
}
```

```java
int reverseBits(int n) {
    int result = 0;
    for (int i = 0; i < 32; i++) {
        result = (result << 1) | (n & 1);
        n >>>= 1;   // logical right shift — fills with 0, not sign bit
    }
    return result;
}
```

```typescript
function reverseBits(n: number): number {
    let result = 0;
    for (let i = 0; i < 32; i++) {
        result = ((result << 1) | (n & 1)) >>> 0;  // >>> 0 keeps it unsigned 32-bit
        n >>>= 1;
    }
    return result >>> 0;
}
```

```python
def reverse_bits(n: int) -> int:
    result = 0
    for _ in range(32):
        result = (result << 1) | (n & 1)
        n >>= 1
    return result
```

```go
func reverseBits(num uint32) uint32 {
    var result uint32 = 0
    for i := 0; i < 32; i++ {
        result = (result << 1) | (num & 1)
        num >>= 1
    }
    return result
}
```

**Time:** O(32) = O(1) — **Space:** O(1)

---

## Dry Run

`n = 1011` (treating as 4 bits for clarity, same principle)

| Iteration | n (binary) | n & 1 | result before shift | result after `<<1 | bit` |
|---|---|---|---|---|
| 1 | 1011 | 1 | 0000 | 0001 |
| 2 | 0101 | 1 | 0001 | 0011 |
| 3 | 0010 | 0 | 0011 | 0110 |
| 4 | 0001 | 1 | 0110 | 1101 |

Result: `1101` — which is `1011` reversed ✓

---

## Follow-up: Cache for Repeated Calls

If this function is called many times, precompute a lookup table of reversed 8-bit values. Then reverse a 32-bit number in four lookups:

```cpp
uint32_t reverseBits(uint32_t n) {
    static uint8_t cache[256] = {};
    static bool built = false;
    if (!built) {
        for (int i = 0; i < 256; i++) {
            uint8_t x = i, rev = 0;
            for (int b = 0; b < 8; b++) {
                rev = (rev << 1) | (x & 1);
                x >>= 1;
            }
            cache[i] = rev;
        }
        built = true;
    }
    return ((uint32_t)cache[n & 0xFF] << 24) |
           ((uint32_t)cache[(n >> 8) & 0xFF] << 16) |
           ((uint32_t)cache[(n >> 16) & 0xFF] << 8) |
           ((uint32_t)cache[(n >> 24) & 0xFF]);
}
```

```java
private final int[] cache = new int[256];
private boolean built = false;

int reverseBits(int n) {
    if (!built) {
        for (int i = 0; i < 256; i++) {
            int x = i, rev = 0;
            for (int b = 0; b < 8; b++) {
                rev = (rev << 1) | (x & 1);
                x >>= 1;
            }
            cache[i] = rev;
        }
        built = true;
    }
    return (cache[n & 0xFF] << 24) |
           (cache[(n >>> 8) & 0xFF] << 16) |
           (cache[(n >>> 16) & 0xFF] << 8) |
           (cache[(n >>> 24) & 0xFF]);
}
```

```typescript
// Precomputed lookup for 8-bit chunks
const cache = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
    let x = i, rev = 0;
    for (let b = 0; b < 8; b++) { rev = (rev << 1) | (x & 1); x >>= 1; }
    cache[i] = rev;
}
function reverseBits(n: number): number {
    return (((cache[n & 0xFF]) << 24) |
            ((cache[(n >>> 8) & 0xFF]) << 16) |
            ((cache[(n >>> 16) & 0xFF]) << 8) |
            ((cache[(n >>> 24) & 0xFF]))) >>> 0;
}
```

```python
cache = {}
def _rev8(x: int) -> int:
    if x not in cache:
        rev = 0
        for _ in range(8):
            rev = (rev << 1) | (x & 1)
            x >>= 1
        cache[x] = rev
    return cache[x]

def reverse_bits(n: int) -> int:
    return ((_rev8(n & 0xFF) << 24) |
            (_rev8((n >> 8) & 0xFF) << 16) |
            (_rev8((n >> 16) & 0xFF) << 8) |
            (_rev8((n >> 24) & 0xFF)))
```

```go
var cache [256]byte
var built bool

func reverseBits(num uint32) uint32 {
    if !built {
        for i := 0; i < 256; i++ {
            x, rev := byte(i), byte(0)
            for b := 0; b < 8; b++ { rev = (rev << 1) | (x & 1); x >>= 1 }
            cache[i] = rev
        }
        built = true
    }
    return uint32(cache[num&0xFF])<<24 |
           uint32(cache[(num>>8)&0xFF])<<16 |
           uint32(cache[(num>>16)&0xFF])<<8 |
           uint32(cache[(num>>24)&0xFF])
}
```

**Time per call:** O(1) after O(256) = O(1) precomputation — **Space:** O(256) = O(1)

---

## Key Interview Insights

- **The simple 32-iteration loop is the primary answer.** Mention the cache follow-up only if asked "how would you optimize for repeated calls?"
- **Java `>>>` vs `>>`:** For this problem, `n >>>= 1` is essential in Java. Using `>>=` for signed ints would fill from the left with sign bits, corrupting the reversal for large unsigned inputs treated as negative signed ints.
- **TypeScript `>>> 0` idiom:** JavaScript/TS bitwise ops work on signed 32-bit integers. `>>> 0` reinterprets the value as unsigned — important when returning a large number like `964176192`.
- **Python integers are arbitrary-precision** — no 32-bit wrapping concerns, but be aware you must run exactly 32 iterations.
- **Divide and Conquer variant:** Swap adjacent 1-bit groups, then 2-bit groups, 4-bit, 8-bit, 16-bit — 5 operations total. This is the parallel/SWAR approach used in hardware.
