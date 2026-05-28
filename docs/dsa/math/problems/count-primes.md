---
title: Count Primes
difficulty: Medium
tags: [Math, Array, Sieve of Eratosthenes]
link: https://leetcode.com/problems/count-primes/
---

# Count Primes

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [204. Count Primes](https://leetcode.com/problems/count-primes/) |
| **Tags** | Math, Array, Sieve of Eratosthenes |

## Problem Statement

Given an integer `n`, return the number of prime numbers that are strictly less than `n`.

**Example 1:**
```
Input:  n = 10
Output: 4   (primes: 2, 3, 5, 7)
```

**Example 2:**
```
Input:  n = 0
Output: 0
```

**Example 3:**
```
Input:  n = 1
Output: 0
```

---

## Intuition

We need to count primes in `[2, n-1]`. The key phrase is "count **all** primes up to n" — this is the exact use case for the **Sieve of Eratosthenes**.

Checking each number independently with a primality test would be O(n * sqrt(n)). The sieve does it in O(n log log n) by marking composite numbers in bulk.

**How the sieve works:**
1. Start with all numbers 2..n-1 assumed prime.
2. For each prime `p`, mark all its multiples (starting at `p*p`) as composite.
3. Count remaining unmarked numbers.

**Why start at `p*p`?** Every multiple of `p` smaller than `p*p` has a smaller prime factor that's already been processed. So `2*p, 3*p, ..., (p-1)*p` are already marked.

---

## Approach 1: Brute Force — Check Each Number

For each number up to `n-1`, test primality by trial division up to its square root.

```cpp
bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; (long long)i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

int countPrimes(int n) {
    int count = 0;
    for (int i = 2; i < n; i++)
        if (isPrime(i)) count++;
    return count;
}
```

```java
boolean isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; (long)i * i <= n; i++)
        if (n % i == 0) return false;
    return true;
}

int countPrimes(int n) {
    int count = 0;
    for (int i = 2; i < n; i++)
        if (isPrime(i)) count++;
    return count;
}
```

```typescript
function isPrime(n: number): boolean {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++)
        if (n % i === 0) return false;
    return true;
}

function countPrimes(n: number): number {
    let count = 0;
    for (let i = 2; i < n; i++)
        if (isPrime(i)) count++;
    return count;
}
```

```python
def is_prime(n: int) -> bool:
    if n < 2: return False
    i = 2
    while i * i <= n:
        if n % i == 0: return False
        i += 1
    return True

def count_primes(n: int) -> int:
    return sum(1 for i in range(2, n) if is_prime(i))
```

```go
func isPrime(n int) bool {
    if n < 2 { return false }
    for i := 2; i*i <= n; i++ {
        if n%i == 0 { return false }
    }
    return true
}

func countPrimes(n int) int {
    count := 0
    for i := 2; i < n; i++ {
        if isPrime(i) { count++ }
    }
    return count
}
```

**Time:** O(n * sqrt(n)) — TLE for large n — **Space:** O(1)

---

## Approach 2: Sieve of Eratosthenes (Optimal)

Build a boolean array of size `n`. Mark composites. Count remaining primes.

```cpp
int countPrimes(int n) {
    if (n < 2) return 0;
    vector<bool> isPrime(n, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; (long long)p * p < n; p++) {
        if (isPrime[p]) {
            for (int mul = p * p; mul < n; mul += p)
                isPrime[mul] = false;
        }
    }
    return count(isPrime.begin(), isPrime.end(), true);
}
```

```java
int countPrimes(int n) {
    if (n < 2) return 0;
    boolean[] isPrime = new boolean[n];
    Arrays.fill(isPrime, true);
    isPrime[0] = isPrime[1] = false;
    for (int p = 2; (long)p * p < n; p++) {
        if (isPrime[p]) {
            for (int mul = p * p; mul < n; mul += p)
                isPrime[mul] = false;
        }
    }
    int count = 0;
    for (boolean b : isPrime) if (b) count++;
    return count;
}
```

```typescript
function countPrimes(n: number): number {
    if (n < 2) return 0;
    const isPrime = new Array(n).fill(true);
    isPrime[0] = isPrime[1] = false;
    for (let p = 2; p * p < n; p++) {
        if (isPrime[p]) {
            for (let mul = p * p; mul < n; mul += p)
                isPrime[mul] = false;
        }
    }
    return isPrime.filter(Boolean).length;
}
```

```python
def count_primes(n: int) -> int:
    if n < 2: return 0
    is_prime = [True] * n
    is_prime[0] = is_prime[1] = False
    p = 2
    while p * p < n:
        if is_prime[p]:
            for mul in range(p * p, n, p):
                is_prime[mul] = False
        p += 1
    return sum(is_prime)
```

```go
func countPrimes(n int) int {
    if n < 2 { return 0 }
    isPrime := make([]bool, n)
    for i := range isPrime { isPrime[i] = true }
    isPrime[0], isPrime[1] = false, false
    for p := 2; p*p < n; p++ {
        if isPrime[p] {
            for mul := p * p; mul < n; mul += p {
                isPrime[mul] = false
            }
        }
    }
    count := 0
    for _, v := range isPrime { if v { count++ } }
    return count
}
```

**Time:** O(n log log n) — **Space:** O(n)

---

## Dry Run

`n = 10`

Initial: `[F,F,T,T,T,T,T,T,T,T]` (indices 0..9; 0 and 1 marked false)

`p = 2`: mark 4, 6, 8 → `[F,F,T,T,F,T,F,T,F,T]`

`p = 3`: 3*3=9 < 10, mark 9 → `[F,F,T,T,F,T,F,T,F,F]`

`p = 4`: 4*4=16 >= 10, outer loop stops.

Count trues: indices 2,3,5,7 → **4** ✓

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute (trial division per number) | O(n sqrt(n)) | O(1) |
| Sieve of Eratosthenes | O(n log log n) | O(n) |

---

## Key Interview Insights

- **The sieve is THE answer** for "count primes up to n." Recognize this immediately.
- **`p * p < n` (not `<= n`):** We need primes strictly less than `n`. The outer loop condition mirrors this — we only sieve up to sqrt(n-1).
- **`p * p` overflow:** Cast to `long`/`int64` before comparing. If `p` is near sqrt(INT_MAX), `p * p` overflows int.
- **Memory optimization:** Use a `byte` or `bitset` array instead of `boolean[]` to reduce memory by 8x. Useful when n is very large.
- **Time complexity explanation for interviews:** The sieve does `n/2 + n/3 + n/5 + n/7 + ...` work — summing `n/p` for all primes p up to n. By the prime harmonic series, this is O(n log log n).
- **Why `p * p` as starting point?** All composites `k*p` where `k < p` were already marked when we processed prime `k`. Starting at `p*p` avoids redundant work.
