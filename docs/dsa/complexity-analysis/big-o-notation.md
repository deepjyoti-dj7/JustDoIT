---
title: Big-O Notation
description: Understanding asymptotic analysis, growth rates, and complexity bounds — the language of algorithm efficiency
---

# Big-O Notation

Big-O notation is the universal language for describing algorithm efficiency. When you say "this runs in O(n log n)," you're making a precise claim about how runtime *scales* as input grows — independent of hardware, compiler, or implementation constants.

## The Three Asymptotic Bounds

| Notation | Name | Meaning | Use |
|---|---|---|---|
| O(f(n)) | Big-O | **Upper bound** — grows no faster than f(n) | Worst case (most common in interviews) |
| Ω(f(n)) | Big-Omega | **Lower bound** — grows at least as fast as f(n) | Best case |
| Θ(f(n)) | Big-Theta | **Tight bound** — grows exactly like f(n) | Both upper and lower |

In interviews, "time complexity" almost always means **Big-O worst case**. If someone says "O(n)," they mean: for large enough n, runtime ≤ c×n for some constant c.

## The Complexity Hierarchy

From fastest to slowest growth:

| Complexity | Name | n = 1,000 | Example |
|---|---|---|---|
| O(1) | Constant | 1 op | Array index, hash lookup |
| O(log n) | Logarithmic | ~10 ops | Binary search |
| O(√n) | Square root | ~32 ops | Primality by trial division |
| O(n) | Linear | 1,000 ops | Linear scan |
| O(n log n) | Linearithmic | ~10,000 ops | Merge sort, heap sort |
| O(n²) | Quadratic | 1,000,000 ops | Bubble sort, naive nested loops |
| O(n³) | Cubic | 10⁹ ops | Floyd-Warshall |
| O(2^n) | Exponential | 10³⁰¹ ops | All subsets |
| O(n!) | Factorial | astronomical | All permutations |

**Input size → max feasible complexity** (assuming ~10⁸ simple ops/sec):

| Input size n | Target complexity |
|---|---|
| n ≤ 10 | O(n!) |
| n ≤ 20–25 | O(2^n) |
| n ≤ 500 | O(n³) |
| n ≤ 5,000 | O(n²) |
| n ≤ 10⁶ | O(n log n) |
| n ≤ 10⁸ | O(n) |
| n > 10⁸ | O(log n) or O(1) |

> **Interview shortcut:** If n ≤ 10⁵ and you're asked for an efficient solution, aim for O(n log n) or better.

## Simplification Rules

Big-O drops constants and lower-order terms. Here's exactly why that's valid and how to do it:

**Rule 1 — Drop multiplicative constants**

Constants reflect hardware speed, not algorithm structure. We care about growth rate only.

```
3n → O(n)
500 → O(1)
n/2 → O(n)
```

**Rule 2 — Drop lower-order terms**

For large n, the dominant term overwhelms all others.

```
n² + n → O(n²)        (n² dominates when n ≥ 1)
n log n + n → O(n log n)
2^n + n³ → O(2^n)
```

**Rule 3 — Sequential steps add**

```
O(n) + O(m) = O(n + m)
```

Keep both variables if they're independent. Only drop if one dominates.

**Rule 4 — Nested steps multiply**

```
O(n) × O(m) = O(n × m)
A loop inside a loop → multiply their complexities
```

## Code Patterns and Their Complexities

### Single Loop → O(n)

```cpp
int findMax(vector<int>& nums) {
    int res = nums[0];
    for (int x : nums) res = max(res, x);  // n iterations, O(1) body
    return res;
}
```

```java
int findMax(int[] nums) {
    int res = nums[0];
    for (int x : nums) res = Math.max(res, x);
    return res;
}
```

```typescript
function findMax(nums: number[]): number {
    let res = nums[0];
    for (const x of nums) res = Math.max(res, x);
    return res;
}
```

```python
def find_max(nums: list[int]) -> int:
    res = nums[0]
    for x in nums:
        res = max(res, x)
    return res
```

```go
func findMax(nums []int) int {
    res := nums[0]
    for _, x := range nums {
        if x > res {
            res = x
        }
    }
    return res
}
```

### Halving the Variable → O(log n)

When the loop variable is halved (or multiplied) each step, the loop runs log₂ n times.

```cpp
int numDigits(int n) {
    int count = 0;
    while (n > 0) {  // n → n/10 → n/100 → ... → 0: log₁₀(n) iterations
        count++;
        n /= 10;
    }
    return count;
}
```

```java
int numDigits(int n) {
    int count = 0;
    while (n > 0) {
        count++;
        n /= 10;
    }
    return count;
}
```

```typescript
function numDigits(n: number): number {
    let count = 0;
    while (n > 0) {
        count++;
        n = Math.floor(n / 10);
    }
    return count;
}
```

```python
def num_digits(n: int) -> int:
    count = 0
    while n > 0:
        count += 1
        n //= 10
    return count
```

```go
func numDigits(n int) int {
    count := 0
    for n > 0 {
        count++
        n /= 10
    }
    return count
}
```

### Nested Loops → O(n²)

```cpp
bool hasDuplicate(vector<int>& nums) {
    for (int i = 0; i < nums.size(); i++)          // n iterations
        for (int j = i + 1; j < nums.size(); j++)  // ~n iterations
            if (nums[i] == nums[j]) return true;
    return false;
}
```

```java
boolean hasDuplicate(int[] nums) {
    for (int i = 0; i < nums.length; i++)
        for (int j = i + 1; j < nums.length; j++)
            if (nums[i] == nums[j]) return true;
    return false;
}
```

```typescript
function hasDuplicate(nums: number[]): boolean {
    for (let i = 0; i < nums.length; i++)
        for (let j = i + 1; j < nums.length; j++)
            if (nums[i] === nums[j]) return true;
    return false;
}
```

```python
def has_duplicate(nums: list[int]) -> bool:
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False
```

```go
func hasDuplicate(nums []int) bool {
    for i := 0; i < len(nums); i++ {
        for j := i + 1; j < len(nums); j++ {
            if nums[i] == nums[j] {
                return true
            }
        }
    }
    return false
}
```

## Common Pitfalls

**Pitfall 1: Hidden O(n) in built-ins**

| Operation | Language | True Cost |
|---|---|---|
| `s1 + s2` string concat | Java, Python | O(n) — creates new string |
| `list.insert(0, x)` | Python | O(n) — shifts all elements |
| `s[i:j]` slicing | Python | O(j - i) |
| `substring(i, j)` | Java | O(j - i) |
| `in list` membership | Python | O(n) |
| `in set` membership | Python | O(1) average |
| `Arrays.sort()` | Java | O(n log n) |

**Pitfall 2: Nested loops are not always O(n²)**

A nested structure that looks O(n²) can be O(n) amortized if elements are processed a bounded number of times in total. Monotonic stacks, the two-pointer technique, and sliding windows often fall into this category.

**Pitfall 3: Two separate variables**

If a function processes two independent inputs of size n and m:
- Sequential: O(n + m)
- Nested: O(n × m)

Don't collapse them into one variable unless they're equal.

## Key Interview Insights

- **Always state time AND space complexity** — don't wait to be asked.
- **Clarify variables** — O(V + E) needs context. Say "V = number of vertices, E = number of edges."
- **Worst case is the default** — unless asked specifically for average or best case.
- **Mention constants when relevant** — an O(26n) solution is effectively O(n) but the constant matters if comparing two O(n) approaches.
- **Dominant term is what matters** — once you find the most expensive step, that's your answer.
