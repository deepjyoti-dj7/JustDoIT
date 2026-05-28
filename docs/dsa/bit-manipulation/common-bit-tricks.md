---
title: Common Bit Tricks
description: Essential bit manipulation patterns, templates, and tricks for coding interviews
---

# Common Bit Tricks

This is your practical playbook. Every trick here appears directly in interview problems. Learn the pattern, not just the formula.

---

## Trick 1: Check if a Bit is Set

To test whether bit `i` is set in `n`, shift a 1 into position `i` and AND it against `n`.

```
n = 13 = 1101
i = 2

1 << 2 = 0100
1101 & 0100 = 0100  (non-zero → bit 2 is set)
```

If the result is non-zero, bit `i` is set. If zero, it's not.

**Alternative:** right-shift `n` by `i` and check the lowest bit: `(n >> i) & 1`. This gives 0 or 1 directly.

---

## Trick 2: Set a Bit

Turn bit `i` on using OR with a mask that has only bit `i` set.

```
n = 1001 (9)
Set bit 1:
1 << 1 = 0010
1001 | 0010 = 1011  (11)
```

---

## Trick 3: Clear a Bit

Turn bit `i` off. Create a mask with all 1s except bit `i`, then AND.

```
n = 1111 (15)
Clear bit 2:
1 << 2    = 0100
~(1 << 2) = 1011
1111 & 1011 = 1011  (11)
```

---

## Trick 4: Toggle a Bit

Flip bit `i` using XOR. XOR with 1 flips; XOR with 0 leaves unchanged.

```
n = 1010 (10)
Toggle bit 0:
1 << 0 = 0001
1010 ^ 0001 = 1011  (11)
```

---

## Trick 5: Clear the Rightmost Set Bit — `n & (n - 1)`

This is one of the most useful bit tricks. Subtracting 1 from `n` flips the rightmost 1 and all zeros below it. AND-ing eliminates that rightmost 1.

```
n     = 1100  (12)
n - 1 = 1011
n & (n-1) = 1000  (8)  ← rightmost 1 is gone
```

**Interview applications:**
- Count set bits: keep doing `n = n & (n-1)` until n is 0, count iterations
- Check if n is a power of 2: exactly one bit set → `n & (n-1) == 0`

---

## Trick 6: Isolate the Rightmost Set Bit — `n & (-n)`

In two's complement, `-n = ~n + 1`. This creates a number with only the rightmost set bit of `n` remaining.

```
n  = 1100  (12)
-n = 0100  (in two's complement)
n & (-n) = 0100  → bit 2 is the rightmost set bit
```

**Interview applications:**
- Fenwick (Binary Indexed) Tree relies on this to navigate
- Detecting which bit differs between two numbers

---

## Trick 7: Count Set Bits — Brian Kernighan's Algorithm

Repeatedly clear the rightmost set bit until `n` becomes 0. Each iteration removes exactly one set bit.

```
n = 13 = 1101  (3 set bits)

Iteration 1: n = 1101 & 1100 = 1100
Iteration 2: n = 1100 & 1011 = 1000
Iteration 3: n = 1000 & 0111 = 0000
Count = 3 ✓
```

Time: O(k) where k = number of set bits. Best case better than O(32) for sparse numbers.

---

## Trick 8: XOR for Duplicate Detection

XOR has a beautiful self-cancellation property: `a ^ a = 0`. XOR all elements — duplicates cancel, the lone survivor remains.

```
[2, 3, 2, 4, 3]
XOR all: 2 ^ 3 ^ 2 ^ 4 ^ 3
       = (2^2) ^ (3^3) ^ 4
       = 0 ^ 0 ^ 4
       = 4  ← the unique element
```

**Extensions:**
- Two missing/unique numbers: XOR everything, then use the rightmost set bit to split into two groups
- Find missing number in [0..n]: XOR all numbers with all indices 0..n

---

## Trick 9: Check Power of 2

A power of 2 has exactly one bit set. Clearing its rightmost (and only) set bit gives 0.

```
8  = 1000
7  = 0111
8 & 7 = 0  → 8 is a power of 2

6  = 0110
5  = 0101
6 & 5 = 0100 ≠ 0  → 6 is not a power of 2
```

Full check: `n > 0 && (n & (n - 1)) == 0`.  
The `n > 0` guard is important: `0 & (-1) == 0` but 0 is not a power of 2.

---

## Trick 10: Bitmask for Subsets

To enumerate all subsets of a set with `n` elements, iterate from `0` to `2^n - 1`. Each integer's binary representation is a subset mask — bit `i` set means element `i` is included.

```
n = 3 elements: [a, b, c]

mask = 000 → {}
mask = 001 → {a}
mask = 010 → {b}
mask = 011 → {a, b}
mask = 100 → {c}
mask = 101 → {a, c}
mask = 110 → {b, c}
mask = 111 → {a, b, c}
```

Check if element `i` is in subset `mask`: `(mask >> i) & 1`.

**Interview applications:** DP on subsets (TSP, knapsack variants), generating power sets, checking all combinations.

---

## Trick 11: Swap Without Temp Variable

```
a ^= b;  // a = a ^ b
b ^= a;  // b = b ^ (a ^ b) = a
a ^= b;  // a = (a ^ b) ^ a = b
```

**Caution:** This breaks if `a` and `b` point to the same memory location (same variable). Never use for `swap(arr[i], arr[i])`.

---

## Trick 12: Lowest k Bits Mask

To keep only the lowest `k` bits of a number: `n & ((1 << k) - 1)`.

```
n = 1011 1010
k = 4
(1 << 4) - 1 = 0000 1111
n & mask      = 0000 1010  (lower 4 bits only)
```

Used in rolling hash, circular buffers, modulo by power of 2: `n % (2^k) == n & ((1^k) - 1)`.

---

## Trick 13: Check if Two Numbers Have Opposite Signs

```
(a ^ b) < 0   →  true if signs differ
```

In two's complement, the sign bit (MSB) is 1 for negative numbers. XOR of two numbers with the same sign has MSB = 0; opposite signs have MSB = 1 → negative result.

---

## Complete Tricks Reference Table

| Trick | Expression | What it does |
|---|---|---|
| Check bit i | `(n >> i) & 1` | Returns 0 or 1 |
| Set bit i | `n \| (1 << i)` | Turns bit i on |
| Clear bit i | `n & ~(1 << i)` | Turns bit i off |
| Toggle bit i | `n ^ (1 << i)` | Flips bit i |
| Clear rightmost 1 | `n & (n - 1)` | Removes lowest set bit |
| Isolate rightmost 1 | `n & (-n)` | Only lowest set bit remains |
| Is power of 2 | `n > 0 && (n & (n-1)) == 0` | Exactly one bit set |
| Count set bits | Loop `n & (n-1)` | Brian Kernighan |
| XOR self-cancel | `a ^ a = 0` | Duplicate detection |
| Lowest k bits | `n & ((1 << k) - 1)` | Mask lower k bits |
| Multiply by 2^k | `n << k` | Fast multiply |
| Divide by 2^k | `n >> k` | Fast floor divide |
| Opposite signs | `(a ^ b) < 0` | Sign comparison |

---

## Counting Set Bits: Three Approaches

**Approach 1 — Shift loop:** Check each bit one by one. Always 32 iterations.

```cpp
int countBits(int n) {
    int count = 0;
    while (n) {
        count += n & 1;
        n >>= 1;
    }
    return count;
}
```

```java
int countBits(int n) {
    int count = 0;
    while (n != 0) {
        count += n & 1;
        n >>>= 1;   // logical right shift for unsigned behavior
    }
    return count;
}
```

```typescript
function countBits(n: number): number {
    let count = 0;
    while (n !== 0) {
        count += n & 1;
        n >>>= 1;
    }
    return count;
}
```

```python
def count_bits(n: int) -> int:
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count
```

```go
func countBits(n int) int {
    count := 0
    for n != 0 {
        count += n & 1
        n >>= 1
    }
    return count
}
```

**Approach 2 — Brian Kernighan:** Only iterates as many times as there are set bits.

```cpp
int countBits(int n) {
    int count = 0;
    while (n) {
        n &= n - 1;  // clear rightmost set bit
        count++;
    }
    return count;
}
```

```java
int countBits(int n) {
    int count = 0;
    while (n != 0) {
        n &= n - 1;
        count++;
    }
    return count;
}
```

```typescript
function countBits(n: number): number {
    let count = 0;
    while (n !== 0) {
        n &= n - 1;
        count++;
    }
    return count;
}
```

```python
def count_bits(n: int) -> int:
    count = 0
    while n:
        n &= n - 1
        count += 1
    return count
```

```go
func countBits(n int) int {
    count := 0
    for n != 0 {
        n &= n - 1
        count++
    }
    return count
}
```

**Approach 3 — Built-in:** Use language built-ins when allowed.

```cpp
__builtin_popcount(n)       // GCC intrinsic
```

```java
Integer.bitCount(n)
```

```typescript
// No built-in; use the loop or:
n.toString(2).split('0').join('').length
```

```python
bin(n).count('1')
```

```go
import "math/bits"
bits.OnesCount(uint(n))
```

---

## Subset Enumeration Template

Iterate all subsets of a set with n elements, from empty set to the full set:

```cpp
void enumerateSubsets(vector<int>& arr) {
    int n = arr.size();
    for (int mask = 0; mask < (1 << n); mask++) {
        // mask represents a subset
        for (int i = 0; i < n; i++) {
            if ((mask >> i) & 1) {
                // arr[i] is in this subset
            }
        }
    }
}
```

```java
void enumerateSubsets(int[] arr) {
    int n = arr.length;
    for (int mask = 0; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if (((mask >> i) & 1) == 1) {
                // arr[i] is in this subset
            }
        }
    }
}
```

```typescript
function enumerateSubsets(arr: number[]): void {
    const n = arr.length;
    for (let mask = 0; mask < (1 << n); mask++) {
        for (let i = 0; i < n; i++) {
            if (((mask >> i) & 1) === 1) {
                // arr[i] is in this subset
            }
        }
    }
}
```

```python
def enumerate_subsets(arr: list) -> None:
    n = len(arr)
    for mask in range(1 << n):
        for i in range(n):
            if (mask >> i) & 1:
                # arr[i] is in this subset
                pass
```

```go
func enumerateSubsets(arr []int) {
    n := len(arr)
    for mask := 0; mask < (1 << n); mask++ {
        for i := 0; i < n; i++ {
            if (mask>>i)&1 == 1 {
                // arr[i] is in this subset
            }
        }
    }
}
```

---

## Common Interview Patterns

### Pattern 1 — "Find the unique element" (XOR cancel)
XOR all elements. Pairs cancel to 0. Answer is what's left.

### Pattern 2 — "Count operations until zero" (Brian Kernighan)
If each operation clears the rightmost set bit, the count equals the number of set bits.

### Pattern 3 — "Bitmask DP"
State is a bitmask. Transition: add element `i` to state `mask` → `mask | (1 << i)`.
Check if `i` is already in state: `(mask >> i) & 1`.

### Pattern 4 — "Prefix XOR for range queries"
`xor(l, r) = prefix[r+1] ^ prefix[l]`. Range XOR in O(1) after O(n) preprocessing.

### Pattern 5 — "Add without arithmetic operators"
XOR gives the sum without carry. AND + left shift gives the carry. Repeat until carry is 0.

---

## Pitfalls

- **`1 << 31` overflows signed 32-bit int** in C++/Java. Use `1L << 31` for 64-bit.
- **Python has no 32-bit int limit** — use `& 0xFFFFFFFF` to simulate unsigned 32-bit.
- **Go's complement operator is `^n`** (prefix caret), not `~n`.
- **XOR swap is unsafe** when both operands alias the same location.
- **`n & (n-1)` doesn't work for `n = 0`** — add a guard or handle separately.
- **Signed right shift** is implementation-defined in C++ for negative numbers. Prefer unsigned or use Java's `>>>`.
