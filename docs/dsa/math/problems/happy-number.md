---
title: Happy Number
difficulty: Easy
tags: [Math, Hash Table, Two Pointers]
link: https://leetcode.com/problems/happy-number/
---

# Happy Number

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [202. Happy Number](https://leetcode.com/problems/happy-number/) |
| **Tags** | Math, Hash Table, Two Pointers |

## Problem Statement

A **happy number** is defined by the following process:

1. Start with any positive integer.
2. Replace the number by the **sum of squares of its digits**.
3. Repeat until the number equals 1 (happy) or it loops endlessly in a cycle that does not include 1 (not happy).

Return `true` if `n` is a happy number, and `false` otherwise.

**Example 1:**
```
Input:  n = 19
Output: true

19 → 1² + 9² = 82
82 → 8² + 2² = 68
68 → 6² + 8² = 100
100 → 1² + 0² + 0² = 1  ✓
```

**Example 2:**
```
Input:  n = 2
Output: false  (enters a cycle: 2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 → ...)
```

---

## Intuition

The sequence either:
- Reaches 1 → happy
- Enters a cycle that never reaches 1 → not happy

This is a **cycle detection** problem in disguise.

Two approaches:
1. **Hash set** — track all seen values. If we see a repeat, there's a cycle. O(k) space where k = cycle length.
2. **Floyd's cycle detection (fast/slow pointers)** — apply the digit-square function twice for the fast pointer, once for the slow. If they meet, there's a cycle. O(1) space.

**Key fact:** All non-happy numbers eventually enter the cycle containing 4. So if you ever see 4, you can return false immediately. This enables an O(1) space short-circuit.

---

## Helper: Sum of Squares of Digits

```cpp
int digitSquareSum(int n) {
    int sum = 0;
    while (n > 0) {
        int d = n % 10;
        sum += d * d;
        n /= 10;
    }
    return sum;
}
```

```java
int digitSquareSum(int n) {
    int sum = 0;
    while (n > 0) {
        int d = n % 10;
        sum += d * d;
        n /= 10;
    }
    return sum;
}
```

```typescript
function digitSquareSum(n: number): number {
    let sum = 0;
    while (n > 0) {
        const d = n % 10;
        sum += d * d;
        n = Math.floor(n / 10);
    }
    return sum;
}
```

```python
def digit_square_sum(n: int) -> int:
    return sum(int(d)**2 for d in str(n))
```

```go
func digitSquareSum(n int) int {
    sum := 0
    for n > 0 { d := n % 10; sum += d * d; n /= 10 }
    return sum
}
```

---

## Approach 1: Hash Set

Keep a set of all numbers seen so far. If a number repeats → cycle → return false. If we reach 1 → return true.

```cpp
bool isHappy(int n) {
    unordered_set<int> seen;
    while (n != 1 && !seen.count(n)) {
        seen.insert(n);
        n = digitSquareSum(n);
    }
    return n == 1;
}
```

```java
boolean isHappy(int n) {
    Set<Integer> seen = new HashSet<>();
    while (n != 1 && !seen.contains(n)) {
        seen.add(n);
        n = digitSquareSum(n);
    }
    return n == 1;
}
```

```typescript
function isHappy(n: number): boolean {
    const seen = new Set<number>();
    while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        n = digitSquareSum(n);
    }
    return n === 1;
}
```

```python
def is_happy(n: int) -> bool:
    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = digit_square_sum(n)
    return n == 1
```

```go
func isHappy(n int) bool {
    seen := map[int]bool{}
    for n != 1 && !seen[n] {
        seen[n] = true
        n = digitSquareSum(n)
    }
    return n == 1
}
```

**Time:** O(log n) per iteration, bounded number of unique values — **Space:** O(k) for cycle length

---

## Approach 2: Floyd's Cycle Detection (O(1) Space)

Use slow/fast pointers. `slow` advances one step; `fast` advances two steps. If there's a cycle, they'll meet. If we reach 1, we're done.

If `fast` or `fast.next` reaches 1, the number is happy. Otherwise, when `slow == fast`, we've detected a cycle — not happy.

```cpp
bool isHappy(int n) {
    int slow = n, fast = digitSquareSum(n);
    while (fast != 1 && slow != fast) {
        slow = digitSquareSum(slow);
        fast = digitSquareSum(digitSquareSum(fast));
    }
    return fast == 1;
}
```

```java
boolean isHappy(int n) {
    int slow = n, fast = digitSquareSum(n);
    while (fast != 1 && slow != fast) {
        slow = digitSquareSum(slow);
        fast = digitSquareSum(digitSquareSum(fast));
    }
    return fast == 1;
}
```

```typescript
function isHappy(n: number): boolean {
    let slow = n, fast = digitSquareSum(n);
    while (fast !== 1 && slow !== fast) {
        slow = digitSquareSum(slow);
        fast = digitSquareSum(digitSquareSum(fast));
    }
    return fast === 1;
}
```

```python
def is_happy(n: int) -> bool:
    slow, fast = n, digit_square_sum(n)
    while fast != 1 and slow != fast:
        slow = digit_square_sum(slow)
        fast = digit_square_sum(digit_square_sum(fast))
    return fast == 1
```

```go
func isHappy(n int) bool {
    slow, fast := n, digitSquareSum(n)
    for fast != 1 && slow != fast {
        slow = digitSquareSum(slow)
        fast = digitSquareSum(digitSquareSum(fast))
    }
    return fast == 1
}
```

**Time:** O(log n) — **Space:** O(1)

---

## Dry Run — Floyd's on n = 19

```
slow: 19 → 82 → 68 → 100 → 1
fast: 82 → 100 → 1

fast reaches 1 before slow meets fast → return true ✓
```

`n = 4` (enters cycle):
```
slow: 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 → ...
fast: 16 → 58 → 145 → 20 → 16 → ...

Eventually slow == fast → cycle detected → return false ✓
```

---

## Key Interview Insights

- **This is fundamentally a linked list cycle detection problem.** The "next node" function is `digitSquareSum`. Recognizing this is the key insight.
- **Hash set approach is simpler to explain** and perfectly acceptable. Mention Floyd's as a follow-up for O(1) space.
- **All non-happy numbers cycle through 4.** You can short-circuit: `if n == 4: return False`. But the general cycle detection works without knowing this fact.
- **Why does the sequence always terminate?** For n with d digits, the sum of squares is at most `81d`. For large n, this converges quickly — within ~10 steps, values drop to below 1000, and from there the cycle is short.
- **Follow-up:** "Sad number" — same concept, return false if it reaches 4 or 89. The pattern of cycle detection generalizes to any such "iterate until convergence or cycle" problem.
