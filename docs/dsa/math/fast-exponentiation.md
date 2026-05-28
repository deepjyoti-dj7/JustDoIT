---
title: Fast Exponentiation
description: Binary exponentiation — computing x^n in O(log n) time
---

# Fast Exponentiation

Computing `x^n` by multiplying `x` exactly `n` times takes O(n) time. For `n = 10^9`, that's a billion multiplications — too slow.

**Binary exponentiation** (also called fast power or exponentiation by squaring) computes `x^n` in O(log n) multiplications by exploiting the structure of the exponent in binary.

---

## The Core Idea

Any exponent `n` can be decomposed using its binary representation:

```
x^13 = x^(1101 in binary)
     = x^8 * x^4 * x^1    (bits 3, 2, 0 are set)
     = x^8 * x^4 * x^1
```

We compute `x^1, x^2, x^4, x^8, ...` by repeated squaring — each value is just the square of the previous. Then we multiply together only the powers corresponding to set bits in `n`.

This requires only **O(log n) squarings** and at most O(log n) multiplications.

```
x = 2, n = 13 (binary: 1101)

power = 2^1  = 2   → bit 0 is set → result *= 2
power = 2^2  = 4   → bit 1 is 0   → skip
power = 2^4  = 16  → bit 2 is set → result *= 16
power = 2^8  = 256 → bit 3 is set → result *= 256

result = 2 * 16 * 256 = 8192 = 2^13 ✓
```

---

## Recursive Formulation

```
pow(x, n) =
  1                           if n == 0
  pow(x, n/2)^2               if n is even
  x * pow(x, n/2)^2           if n is odd
```

Half the exponent each call → O(log n) depth.

---

## Iterative Formulation (Preferred)

More space-efficient (O(1) instead of O(log n) stack), and easier to extend for modular exponentiation.

```cpp
long long fastPow(long long base, long long exp) {
    long long result = 1;
    while (exp > 0) {
        if (exp & 1) result *= base;  // if current bit is set
        base *= base;                  // square the base
        exp >>= 1;                     // shift to next bit
    }
    return result;
}
```

```java
long fastPow(long base, long exp) {
    long result = 1;
    while (exp > 0) {
        if ((exp & 1) == 1) result *= base;
        base *= base;
        exp >>= 1;
    }
    return result;
}
```

```typescript
function fastPow(base: number, exp: number): number {
    let result = 1;
    while (exp > 0) {
        if (exp & 1) result *= base;
        base *= base;
        exp >>= 1;
    }
    return result;
}
```

```python
def fast_pow(base: int, exp: int) -> int:
    result = 1
    while exp > 0:
        if exp & 1:
            result *= base
        base *= base
        exp >>= 1
    return result
```

```go
func fastPow(base, exp int64) int64 {
    result := int64(1)
    for exp > 0 {
        if exp&1 == 1 { result *= base }
        base *= base
        exp >>= 1
    }
    return result
}
```

---

## Modular Exponentiation

The most common interview variant: compute `(x^n) % mod`.

The key: take mod at every multiplication step to keep numbers small and prevent overflow.

```
(a * b) % m == ((a % m) * (b % m)) % m
```

```cpp
long long modPow(long long base, long long exp, long long mod) {
    long long result = 1;
    base %= mod;
    while (exp > 0) {
        if (exp & 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}
```

```java
long modPow(long base, long exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return result;
}
```

```typescript
function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp & 1n) result = result * base % mod;
        base = base * base % mod;
        exp >>= 1n;
    }
    return result;
}
```

```python
def mod_pow(base: int, exp: int, mod: int) -> int:
    return pow(base, exp, mod)  # Python's built-in handles this optimally
    # Manual implementation:
    # result = 1
    # base %= mod
    # while exp > 0:
    #     if exp & 1: result = result * base % mod
    #     base = base * base % mod
    #     exp >>= 1
    # return result
```

```go
func modPow(base, exp, mod int64) int64 {
    result := int64(1)
    base %= mod
    for exp > 0 {
        if exp&1 == 1 { result = result * base % mod }
        base = base * base % mod
        exp >>= 1
    }
    return result
}
```

---

## Handling Negative Exponents

For `x^(-n)`, the result is `1 / x^n`. In floating-point problems (like LC 50 Pow(x, n)):

```
x^(-n) = (1/x)^n = 1.0 / x^n
```

Negate the exponent and use `1.0 / base` as the new base (or divide result by 1).

---

## Dry Run

`base = 3, exp = 5 (binary: 101)`

| exp | exp & 1 | result | base |
|---|---|---|---|
| 5 (101) | 1 | 1 * 3 = 3 | 3 * 3 = 9 |
| 2 (010) | 0 | 3 | 9 * 9 = 81 |
| 1 (001) | 1 | 3 * 81 = 243 | — |
| 0 | stop | **243** | — |

3^5 = 243 ✓

---

## Interview Applications

| Problem | How fast exponentiation helps |
|---|---|
| LC 50 — Pow(x, n) | Direct application |
| Large Fibonacci mod p | Matrix exponentiation (same idea on matrices) |
| Modular inverse | `inv(a) = a^(p-2) % p` when p is prime (Fermat's little theorem) |
| Count paths in graph of length k | Matrix^k using fast exp |
| RSA encryption/decryption | Modular exponentiation on huge numbers |
| Combinatorics (nCr mod p) | Need `n! * inv(k!) * inv((n-k)!)` using modPow for inverse |

---

## Common Pitfalls

1. **Integer overflow:** `base * base` can overflow `int` or even `long`. Use `long long` in C++/Java, or `BigInteger`/`bigint`.
2. **Forget `base %= mod` at the start:** Without this, the first `base * base` might overflow before the loop runs.
3. **Negative exponent:** Convert to `1.0 / base` and positive exponent. Don't pass negative exp to the integer version.
4. **n = INT_MIN negation overflow:** `-INT_MIN` overflows in 32-bit signed. Cast to `long` before negating in LC 50.
5. **Python `pow(base, exp, mod)`** is built-in and uses binary exponentiation — use it directly.

---

## Complexity

| Variant | Time | Space |
|---|---|---|
| Iterative fast pow | O(log n) | O(1) |
| Recursive fast pow | O(log n) | O(log n) stack |
| Modular fast pow | O(log n) | O(1) |
| Matrix fast pow (k×k matrix) | O(k^3 log n) | O(k^2) |
