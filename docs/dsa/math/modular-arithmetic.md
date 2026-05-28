---
title: Modular Arithmetic
description: Modular arithmetic properties, overflow prevention, and modular inverse for interview problems
---

# Modular Arithmetic

Modular arithmetic is arithmetic on the "remainder after division." It shows up in problems involving large numbers, cyclic patterns, combinatorics, and cryptography.

The notation `a % m` (or `a mod m`) gives the remainder when `a` is divided by `m`.

```
17 % 5 = 2    (17 = 3*5 + 2)
100 % 7 = 2   (100 = 14*7 + 2)
```

---

## Why It Matters in Interviews

Many problems ask for answers "modulo 10^9 + 7" (often written as `1e9 + 7` or `MOD`). The reason:
- Answers can be astronomically large (factorials, Fibonacci, path counts)
- The judge only needs the remainder to verify correctness
- Modular arithmetic keeps numbers within 64-bit bounds during computation

The magic number `10^9 + 7 = 1_000_000_007` is prime — which enables **modular inverses** (division under modulo).

---

## Core Properties

These properties let you take mod at any intermediate step:

```
(a + b) % m = ((a % m) + (b % m)) % m
(a - b) % m = ((a % m) - (b % m) + m) % m    ← the +m prevents negative
(a * b) % m = ((a % m) * (b % m)) % m
(a ^ n) % m = use fast exponentiation
```

**Division does NOT distribute over mod** — you need the modular inverse instead.

---

## Addition and Subtraction

Safe to reduce mod at each step:

```cpp
const int MOD = 1e9 + 7;

long long addMod(long long a, long long b, long long mod = MOD) {
    return (a % mod + b % mod) % mod;
}

long long subMod(long long a, long long b, long long mod = MOD) {
    return ((a % mod - b % mod) + mod) % mod;  // +mod prevents negative
}
```

```java
static final long MOD = 1_000_000_007L;

long addMod(long a, long b) { return (a % MOD + b % MOD) % MOD; }
long subMod(long a, long b) { return ((a % MOD - b % MOD) + MOD) % MOD; }
```

```typescript
const MOD = 1_000_000_007n;  // use bigint for safety in TS

function addMod(a: bigint, b: bigint): bigint { return (a + b) % MOD; }
function subMod(a: bigint, b: bigint): bigint { return ((a - b) + MOD) % MOD; }
```

```python
MOD = 10**9 + 7

def add_mod(a: int, b: int) -> int: return (a + b) % MOD
def sub_mod(a: int, b: int) -> int: return (a - b) % MOD  # Python handles negative mod correctly
```

```go
const MOD = 1_000_000_007

func addMod(a, b int64) int64 { return (a%MOD + b%MOD) % MOD }
func subMod(a, b int64) int64 { return ((a%MOD-b%MOD)+MOD) % MOD }
```

---

## Multiplication

The key risk: `a * b` can overflow even `long long` if both are near MOD (~10^9). Take mod after multiplying — the product fits in `long long` since `10^9 * 10^9 = 10^18 < 9.2 * 10^18 (LLONG_MAX)`.

```cpp
long long mulMod(long long a, long long b, long long mod = MOD) {
    return (a % mod) * (b % mod) % mod;
}
```

```java
long mulMod(long a, long b) { return (a % MOD) * (b % MOD) % MOD; }
```

```typescript
function mulMod(a: bigint, b: bigint): bigint { return (a * b) % MOD; }
```

```python
def mul_mod(a: int, b: int) -> int: return (a * b) % MOD
```

```go
func mulMod(a, b int64) int64 { return (a % MOD) * (b % MOD) % MOD }
```

---

## Modular Inverse (Division under Mod)

To compute `a / b (mod m)`, multiply by the modular inverse of `b`:

```
a / b ≡ a * inv(b)  (mod m)
```

The modular inverse of `b` exists only when `gcd(b, m) = 1`. Since `10^9 + 7` is prime, the inverse of any `b` (not divisible by MOD) exists.

**Fermat's Little Theorem** gives us: for prime `p` and `gcd(b, p) = 1`:

```
b^(p-1) ≡ 1 (mod p)
b^(p-2) ≡ inv(b) (mod p)
```

So `inv(b) = pow(b, MOD - 2, MOD)`.

```cpp
long long modInverse(long long b, long long mod = MOD) {
    return modPow(b, mod - 2, mod);  // requires fast exponentiation
}
```

```java
long modInverse(long b) {
    return modPow(b, MOD - 2, MOD);
}
```

```typescript
function modInverse(b: bigint, mod: bigint = MOD): bigint {
    return modPow(b, mod - 2n, mod);
}
```

```python
def mod_inverse(b: int, mod: int = MOD) -> int:
    return pow(b, mod - 2, mod)  # Python's pow(b, exp, mod) is built-in
```

```go
func modInverse(b int64) int64 {
    return modPow(b, MOD-2, MOD)
}
```

---

## Precomputing Factorials and Inverse Factorials

For combinatorics problems (nCr mod p), precompute:

```cpp
const int MAXN = 1e6 + 5;
long long fact[MAXN], inv_fact[MAXN];

void precompute() {
    fact[0] = 1;
    for (int i = 1; i < MAXN; i++) fact[i] = fact[i-1] * i % MOD;
    inv_fact[MAXN-1] = modPow(fact[MAXN-1], MOD-2, MOD);
    for (int i = MAXN-2; i >= 0; i--) inv_fact[i] = inv_fact[i+1] * (i+1) % MOD;
}

long long nCr(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fact[n] * inv_fact[r] % MOD * inv_fact[n-r] % MOD;
}
```

```java
static long[] fact, invFact;
static void precompute(int maxN) {
    fact = new long[maxN]; invFact = new long[maxN];
    fact[0] = 1;
    for (int i = 1; i < maxN; i++) fact[i] = fact[i-1] * i % MOD;
    invFact[maxN-1] = modPow(fact[maxN-1], MOD-2);
    for (int i = maxN-2; i >= 0; i--) invFact[i] = invFact[i+1] * (i+1) % MOD;
}
static long nCr(int n, int r) {
    if (r < 0 || r > n) return 0;
    return fact[n] * invFact[r] % MOD * invFact[n-r] % MOD;
}
```

```typescript
// TypeScript version uses bigint to handle large products safely
function precompute(maxN: number, MOD: bigint) {
    const fact = new Array(maxN).fill(1n);
    const invFact = new Array(maxN).fill(1n);
    for (let i = 1; i < maxN; i++) fact[i] = fact[i-1] * BigInt(i) % MOD;
    invFact[maxN-1] = modPow(fact[maxN-1], MOD - 2n, MOD);
    for (let i = maxN-2; i >= 0; i--) invFact[i] = invFact[i+1] * BigInt(i+1) % MOD;
    return { fact, invFact };
}
```

```python
MOD = 10**9 + 7

def precompute(max_n: int):
    fact = [1] * max_n
    for i in range(1, max_n):
        fact[i] = fact[i-1] * i % MOD
    inv_fact = [1] * max_n
    inv_fact[max_n-1] = pow(fact[max_n-1], MOD-2, MOD)
    for i in range(max_n-2, -1, -1):
        inv_fact[i] = inv_fact[i+1] * (i+1) % MOD
    return fact, inv_fact

def n_choose_r(n: int, r: int, fact: list, inv_fact: list) -> int:
    if r < 0 or r > n: return 0
    return fact[n] * inv_fact[r] % MOD * inv_fact[n-r] % MOD
```

```go
var fact, invFact []int64

func precompute(maxN int) {
    fact = make([]int64, maxN)
    invFact = make([]int64, maxN)
    fact[0] = 1
    for i := 1; i < maxN; i++ { fact[i] = fact[i-1] * int64(i) % MOD }
    invFact[maxN-1] = modPow(fact[maxN-1], MOD-2, MOD)
    for i := maxN - 2; i >= 0; i-- { invFact[i] = invFact[i+1] * int64(i+1) % MOD }
}
func nCr(n, r int) int64 {
    if r < 0 || r > n { return 0 }
    return fact[n] * invFact[r] % MOD * invFact[n-r] % MOD
}
```

---

## Negative Modulo

Different languages handle `(-1) % 5` differently:

| Language | `(-1) % 5` | Convention |
|---|---|---|
| C++, Java, Go, TS | `-1` | Truncates toward zero |
| Python | `4` | Always non-negative |

In C++/Java/Go, add `+ mod` after subtraction to guarantee non-negative:

```
result = ((a % m) - (b % m) + m) % m
```

Python handles it naturally — no fix needed.

---

## Interview Identification Signals

- Answer "modulo 10^9 + 7" → always apply mod at each addition/multiplication step
- Need to divide under modulo → use modular inverse with Fermat's little theorem
- Combinatorics (nCr, permutations) with large n → precompute factorials + inverse factorials
- Cyclic/repeating patterns → work in modular space
- "Last digit of x^n" → x^n mod 10, which has a cycle of length ≤ 4

---

## Pitfalls

1. **Forgetting `+m` in subtraction:** `(a - b) % m` can be negative in C++/Java/Go. Always use `((a - b) % m + m) % m`.
2. **Multiplying two large numbers:** Each operand should be reduced mod before multiplying: `(a % m) * (b % m)`. Without this, overflow occurs for `a ~ 10^18`.
3. **Division without inverse:** `(a / b) % m ≠ (a % m) / (b % m)`. Use modular inverse.
4. **Non-prime modulus:** Fermat's little theorem only works for prime modulus. For composite modulus, use the extended Euclidean algorithm.
5. **TypeScript number precision:** JS/TS `number` is a 64-bit float — integers > 2^53 lose precision. Use `bigint` for modular arithmetic.

---

## Complexity

| Operation | Time | Space |
|---|---|---|
| Single mod | O(1) | O(1) |
| Modular inverse via fast pow | O(log p) | O(1) |
| Precompute n! and inverses | O(n) | O(n) |
| nCr after precompute | O(1) | O(1) |
