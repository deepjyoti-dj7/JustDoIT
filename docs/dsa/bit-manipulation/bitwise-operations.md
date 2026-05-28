---
title: Bitwise Operations
description: Core bit operators, representations, and interview patterns for bit manipulation
---

# Bitwise Operations

Bit manipulation is about working directly with the binary representation of numbers. It unlocks O(1) tricks that are otherwise impossible — detecting duplicates with no extra space, counting set bits in a constant, swapping values without a temp variable.

Every integer in memory is just bits. The key insight: **individual bits are independent 1/0 flags**, and bitwise operators act on all 32 (or 64) bits simultaneously.

---

## The Six Operators

### AND ( `&` )

Both bits must be 1 for the result to be 1. Everything else becomes 0.

```
  1010  (10)
& 1100  (12)
------
  1000  (8)
```

**What AND is good for:**
- **Masking** — isolate specific bits (zero out everything else)
- **Checking** a bit: `(n >> i) & 1` tells you if bit `i` is set
- **Clearing** a bit: `n & ~(1 << i)` turns bit `i` off

### OR ( `|` )

At least one bit must be 1.

```
  1010  (10)
| 0101  (5)
------
  1111  (15)
```

**What OR is good for:**
- **Setting** a bit: `n | (1 << i)` turns bit `i` on
- **Combining** flags in a bitmask

### XOR ( `^` )

Bits differ → 1. Bits match → 0. Think of it as "controlled flip" or "difference detector."

```
  1010  (10)
^ 1100  (12)
------
  0110  (6)
```

**XOR's three superpowers:**
- `a ^ a = 0` — anything XOR itself cancels out
- `a ^ 0 = a` — anything XOR zero is unchanged
- Commutative and associative — order doesn't matter

**What XOR is good for:**
- Finding the single non-duplicate in a list
- Detecting changes (used in checksums, diff detection)
- Swapping two values without a temp: `a ^= b; b ^= a; a ^= b`

### NOT ( `~` )

Flips every bit. This is **bitwise complement**, not logical NOT.

```
~5   in 32-bit:  ~00000000 00000000 00000000 00000101
                = 11111111 11111111 11111111 11111010
                = -6  (two's complement)
```

The identity: `~n = -(n + 1)`. So `~0 = -1`, `~(-1) = 0`.

**What NOT is good for:**
- Creating the complement mask: `~(1 << i)` = all bits set except bit `i`
- Getting `-n` in two's complement: `~n + 1`

### Left Shift ( `<<` )

Shifts bits to the left, filling with zeros on the right. Each left shift **multiplies by 2**.

```
5 << 1 = 10    (5 * 2)
5 << 2 = 20    (5 * 4)
1 << k         = 2^k
```

**What left shift is good for:**
- Creating bitmasks: `1 << k` has exactly bit `k` set
- Fast multiplication by powers of 2

### Right Shift ( `>>` )

Shifts bits to the right. Each right shift **divides by 2** (integer division).

```
20 >> 1 = 10   (20 / 2)
20 >> 2 = 5    (20 / 4)
```

**Arithmetic vs Logical right shift:**
- `>>` in Java/C++ (signed) is **arithmetic** — fills with the sign bit (1 for negatives)
- `>>>` in Java is **logical** — always fills with 0 regardless of sign
- Python `>>` is arithmetic (but integers are arbitrary precision, so be careful)
- For most interview problems you work with non-negative numbers — no difference

---

## Truth Tables

| a | b | a & b | a \| b | a ^ b |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 1 | 0 | 1 | 1 |
| 1 | 0 | 0 | 1 | 1 |
| 1 | 1 | 1 | 1 | 0 |

Memorize XOR — it's the most interesting column: **same → 0, different → 1**.

---

## Two's Complement Representation

Computers represent negative integers using two's complement:

```
To get -n from n:
  1. Flip all bits (~n)
  2. Add 1

Example: -5
  5  = 00000101
~5  = 11111010
-5  = 11111011  (add 1)
```

**Why this matters:**
- `-1` is all 1s: `11111111 11111111 11111111 11111111`
- `-n = ~n + 1` → and reversing: `~(-n) = n - 1`
- Negative number check: MSB (bit 31) is 1

---

## Operator Precedence — A Common Trap

Bitwise operators have **lower precedence** than comparison operators in most languages.

```cpp
// WRONG — evaluated as: n & (1 == 0)
if (n & 1 == 0) { ... }

// CORRECT — always parenthesize
if ((n & 1) == 0) { ... }
```

**Rule:** Always wrap bitwise expressions in parentheses when combining with `==`, `!=`, `<`, `>`.

---

## Interview Identification Signals

When you see these in a problem, think bit manipulation:

| Signal | Bit technique |
|---|---|
| Find the one non-duplicate in an array where everything else appears twice | XOR all elements |
| Check if a number is a power of 2 | `n & (n-1) == 0` |
| Count set bits in a number | Brian Kernighan's or shift loop |
| Find missing number in [0..n] | XOR with indices |
| Subsets of a set | Bitmask enumeration (0 to 2^n - 1) |
| Add two integers without `+` | XOR for sum, AND+shift for carry |
| Multiply/divide by power of 2 | Left/right shift |
| Swap two values without temp | XOR swap |
| Check if two integers have opposite signs | `(a ^ b) < 0` |
| Range of values fits in k bits | Mask with `(1 << k) - 1` |

---

## Bit Operators at a Glance

```cpp
int n = 42;   // 101010 in binary

// Check bit i
bool isSet = (n >> i) & 1;

// Set bit i
n = n | (1 << i);

// Clear bit i
n = n & ~(1 << i);

// Toggle bit i
n = n ^ (1 << i);

// Lowest set bit (isolate rightmost 1)
int lsb = n & (-n);

// Clear lowest set bit
n = n & (n - 1);

// Check power of two
bool isPow2 = n > 0 && (n & (n - 1)) == 0;

// XOR swap
a ^= b; b ^= a; a ^= b;
```

```java
int n = 42;

boolean isSet = ((n >> i) & 1) == 1;
n = n | (1 << i);           // set bit i
n = n & ~(1 << i);          // clear bit i
n = n ^ (1 << i);           // toggle bit i
int lsb = n & (-n);         // lowest set bit
n = n & (n - 1);            // clear lowest set bit
boolean isPow2 = n > 0 && (n & (n - 1)) == 0;
```

```typescript
let n = 42;

const isSet = ((n >> i) & 1) === 1;
n = n | (1 << i);           // set bit i
n = n & ~(1 << i);          // clear bit i
n = n ^ (1 << i);           // toggle bit i
const lsb = n & (-n);       // lowest set bit
n = n & (n - 1);            // clear lowest set bit
const isPow2 = n > 0 && (n & (n - 1)) === 0;
```

```python
n = 42

is_set = (n >> i) & 1       # check bit i
n = n | (1 << i)            # set bit i
n = n & ~(1 << i)           # clear bit i
n = n ^ (1 << i)            # toggle bit i
lsb = n & (-n)              # lowest set bit
n = n & (n - 1)             # clear lowest set bit
is_pow2 = n > 0 and (n & (n - 1)) == 0
```

```go
n := 42

isSet := (n>>i)&1 == 1
n = n | (1 << i)           // set bit i
n = n & ^(1 << i)          // clear bit i (^ is NOT in Go)
n = n ^ (1 << i)           // toggle bit i
lsb := n & (-n)            // lowest set bit
n = n & (n - 1)            // clear lowest set bit
isPow2 := n > 0 && (n&(n-1)) == 0
```

---

## Complexity

All individual bitwise operations are **O(1)** — they operate on fixed-width integers in hardware. Loops over bits (e.g., counting set bits) run for at most 32 or 64 iterations, which is still effectively O(1) since the word width is constant.

| Operation | Time | Space |
|---|---|---|
| Single bitwise op (`&`, `\|`, `^`, `~`, `<<`, `>>`) | O(1) | O(1) |
| Count set bits (loop) | O(log n) = O(32) | O(1) |
| Count set bits (Brian Kernighan) | O(set bits) | O(1) |
| Enumerate all subsets of n elements | O(2^n) | O(1) extra |

---

## Common Pitfalls

1. **Operator precedence:** Always parenthesize: `(n & mask) == 0`, not `n & mask == 0`.
2. **Integer overflow in shifts:** `1 << 31` overflows a signed 32-bit int. Use `1L << 31` or `1u << 31` in C++/Java.
3. **Python integers are arbitrary-precision:** `~5` in Python gives `-6`, which is correct two's complement, but there's no 32-bit wrap-around. Use `& 0xFFFFFFFF` if you need 32-bit behavior.
4. **Go's NOT operator:** In Go, bitwise NOT is `^n` (prefix), not `~n`. And clearing a bit is `n & ^(1 << i)`.
5. **Right shift of negative numbers:** `>>` fills with sign bit for signed integers. For logical right shift use `>>>` in Java, or cast to unsigned first.
6. **XOR swap doesn't work if a and b are the same variable:** `a ^= a` becomes 0.
