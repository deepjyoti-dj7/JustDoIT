---
title: GCD and LCM
description: Euclidean algorithm, LCM, and their applications in interview problems
---

# GCD and LCM

Two of the most fundamental math operations in competitive programming and interviews. They appear directly in problems involving fractions, rhythms, synchronization, and divisibility.

---

## Greatest Common Divisor (GCD)

The GCD of two integers is the largest integer that divides both without a remainder.

```
gcd(12, 8) = 4    because 4 divides both 12 and 8
gcd(7, 3)  = 1    (coprime — no common factor > 1)
gcd(0, 5)  = 5    by convention: gcd(0, n) = n
```

### The Euclidean Algorithm

The key insight: `gcd(a, b) = gcd(b, a % b)`.

Why? Any divisor of both `a` and `b` also divides `a - b` (and therefore `a % b`). So the set of common divisors is the same, and the GCD is preserved.

The algorithm terminates because `a % b < b` — the second argument strictly decreases each step.

```
gcd(48, 18):
  gcd(48, 18) → gcd(18, 12) → gcd(12, 6) → gcd(6, 0) = 6
```

**Time complexity:** O(log(min(a, b))) — the argument halves roughly every two steps.

### Recursive and Iterative Forms

```cpp
// Recursive
int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }

// Iterative
int gcd(int a, int b) {
    while (b) { a %= b; swap(a, b); }
    return a;
}

// C++17 built-in
#include <numeric>
int g = __gcd(a, b);   // or std::gcd(a, b) in <numeric>
```

```java
int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }

// Java 9+ built-in
import java.math.BigInteger;
int g = BigInteger.valueOf(a).gcd(BigInteger.valueOf(b)).intValue();
```

```typescript
function gcd(a: number, b: number): number {
    return b === 0 ? a : gcd(b, a % b);
}
```

```python
from math import gcd   # built-in since Python 3.5
# or:
def gcd(a: int, b: int) -> int:
    return a if b == 0 else gcd(b, a % b)
```

```go
func gcd(a, b int) int {
    for b != 0 { a, b = b, a%b }
    return a
}
```

---

## Least Common Multiple (LCM)

The LCM is the smallest positive integer divisible by both `a` and `b`.

The relationship between GCD and LCM:

```
lcm(a, b) = (a / gcd(a, b)) * b
```

Divide first, then multiply — this avoids overflow from `a * b` which can exceed 32-bit range.

```
lcm(4, 6):
  gcd(4, 6) = 2
  lcm = (4 / 2) * 6 = 12  ✓
```

```cpp
long long lcm(long long a, long long b) {
    return (a / __gcd(a, b)) * b;   // divide first to prevent overflow
}
```

```java
long lcm(long a, long b) {
    return (a / gcd(a, b)) * b;
}
```

```typescript
function lcm(a: number, b: number): number {
    return (a / gcd(a, b)) * b;
}
```

```python
from math import lcm   # Python 3.9+
# or:
def lcm(a: int, b: int) -> int:
    return a // gcd(a, b) * b
```

```go
func lcm(a, b int) int {
    return (a / gcd(a, b)) * b
}
```

---

## Extending to Multiple Numbers

GCD and LCM are associative — extend pairwise:

```
gcd(a, b, c) = gcd(gcd(a, b), c)
lcm(a, b, c) = lcm(lcm(a, b), c)
```

```cpp
int gcdAll(vector<int>& nums) {
    int g = nums[0];
    for (int x : nums) g = __gcd(g, x);
    return g;
}
```

```java
int gcdAll(int[] nums) {
    int g = nums[0];
    for (int x : nums) g = gcd(g, x);
    return g;
}
```

```typescript
function gcdAll(nums: number[]): number {
    return nums.reduce((g, x) => gcd(g, x));
}
```

```python
from math import gcd
from functools import reduce

def gcd_all(nums: list[int]) -> int:
    return reduce(gcd, nums)
```

```go
func gcdAll(nums []int) int {
    g := nums[0]
    for _, x := range nums { g = gcd(g, x) }
    return g
}
```

---

## Key Properties

| Property | Formula | Example |
|---|---|---|
| Commutative | gcd(a,b) = gcd(b,a) | gcd(6,4) = gcd(4,6) = 2 |
| Identity | gcd(a,0) = a | gcd(7,0) = 7 |
| Associative | gcd(a,gcd(b,c)) = gcd(gcd(a,b),c) | — |
| Relation to LCM | gcd(a,b) * lcm(a,b) = a * b | 2 * 12 = 4 * 6 ✓ |
| Coprime | gcd(a,b) = 1 → a and b share no factors | gcd(7,9) = 1 |

---

## Interview Applications

| Problem Pattern | How GCD/LCM Appears |
|---|---|
| Fraction simplification | Divide numerator/denominator by gcd |
| Two events repeating every a and b steps — when do they sync? | LCM(a, b) |
| Tile a rectangle with smallest square tiles | Side = gcd(width, height) |
| Find all divisors of gcd(array) | GCD of the array; any common divisor divides it |
| "Is there a number that divides all array elements?" | Check if x divides gcd of the array |
| Rope cutting: cut n ropes to max equal pieces | GCD of all lengths |

---

## Identification Signals

Look for these phrases in problems:
- "common divisor," "common factor" → GCD
- "first time both events happen together," "synchronize" → LCM
- "maximum equal length segments" → GCD of lengths
- "coprime," "relatively prime" → check `gcd == 1`
- Fraction operations (add, compare, simplify) → GCD for simplification

---

## Pitfalls

1. **Overflow in LCM:** `a * b` can overflow a 32-bit int. Always compute `(a / gcd(a, b)) * b`.
2. **GCD with 0:** `gcd(0, 0) = 0` by convention. Handle carefully if 0 is a valid input.
3. **Negative numbers:** GCD is defined for non-negative integers in most implementations. Use `abs()` before calling.
4. **LCM of many numbers** can grow extremely large — use `long long`/`BigInteger` when needed.
5. **Python's `math.lcm`** only exists from Python 3.9+. In older versions, use the formula.

---

## Complexity

| Operation | Time | Space |
|---|---|---|
| gcd(a, b) | O(log min(a,b)) | O(log min(a,b)) recursive / O(1) iterative |
| lcm(a, b) | O(log min(a,b)) | O(1) |
| gcd of n numbers | O(n log max) | O(1) |
