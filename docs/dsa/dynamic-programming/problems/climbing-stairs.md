---
title: Climbing Stairs
difficulty: Easy
tags: [Dynamic Programming, Memoization, Math]
link: https://leetcode.com/problems/climbing-stairs/
---

# Climbing Stairs

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [70. Climbing Stairs](https://leetcode.com/problems/climbing-stairs/) |
| **Tags** | Dynamic Programming, Memoization, Math |

## Problem Statement

You are climbing a staircase with `n` steps. Each time you can climb 1 or 2 steps. Return the number of distinct ways to reach the top.

## Intuition

To reach step `n`, you must have come from either step `n-1` (one step) or step `n-2` (two steps). So the number of ways to reach step `n` equals the number of ways to reach `n-1` plus the ways to reach `n-2`.

This is exactly the Fibonacci recurrence — this problem **is** Fibonacci in disguise.

```
ways(n) = ways(n-1) + ways(n-2)
ways(1) = 1,  ways(2) = 2
```

## Approach 1: Brute Force (Recursion)

Recurse from `n` down to the base cases. Without memoization, this recomputes the same subproblems exponentially.

```cpp
int climbStairs(int n) {
    if (n <= 2) return n;
    return climbStairs(n - 1) + climbStairs(n - 2);
}
```

```java
int climbStairs(int n) {
    if (n <= 2) return n;
    return climbStairs(n - 1) + climbStairs(n - 2);
}
```

```typescript
function climbStairs(n: number): number {
    if (n <= 2) return n;
    return climbStairs(n - 1) + climbStairs(n - 2);
}
```

```python
def climbStairs(n: int) -> int:
    if n <= 2: return n
    return climbStairs(n - 1) + climbStairs(n - 2)
```

```go
func climbStairs(n int) int {
    if n <= 2 { return n }
    return climbStairs(n-1) + climbStairs(n-2)
}
```

**Time:** O(2ⁿ) — **Space:** O(n) stack

## Approach 2: Top-Down DP (Memoization)

Cache each subproblem so it's never recomputed.

```cpp
class Solution {
    unordered_map<int, int> memo;
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        if (memo.count(n)) return memo[n];
        return memo[n] = climbStairs(n - 1) + climbStairs(n - 2);
    }
};
```

```java
class Solution {
    private int[] memo;
    public int climbStairs(int n) {
        memo = new int[n + 1];
        return dp(n);
    }
    private int dp(int n) {
        if (n <= 2) return n;
        if (memo[n] != 0) return memo[n];
        return memo[n] = dp(n - 1) + dp(n - 2);
    }
}
```

```typescript
function climbStairs(n: number): number {
    const memo = new Map<number, number>();
    function dp(n: number): number {
        if (n <= 2) return n;
        if (memo.has(n)) return memo.get(n)!;
        const result = dp(n - 1) + dp(n - 2);
        memo.set(n, result);
        return result;
    }
    return dp(n);
}
```

```python
def climbStairs(n: int) -> int:
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def dp(n: int) -> int:
        if n <= 2: return n
        return dp(n - 1) + dp(n - 2)

    return dp(n)
```

```go
func climbStairs(n int) int {
    memo := make(map[int]int)
    var dp func(int) int
    dp = func(n int) int {
        if n <= 2 { return n }
        if v, ok := memo[n]; ok { return v }
        memo[n] = dp(n-1) + dp(n-2)
        return memo[n]
    }
    return dp(n)
}
```

**Time:** O(n) — **Space:** O(n)

## Approach 3: Bottom-Up DP with O(1) Space (Optimal)

Since we only need the last two values, we don't need the full array.

```cpp
int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```java
public int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```typescript
function climbStairs(n: number): number {
    if (n <= 2) return n;
    let prev2 = 1, prev1 = 2;
    for (let i = 3; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```python
def climbStairs(n: int) -> int:
    if n <= 2: return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1
```

```go
func climbStairs(n int) int {
    if n <= 2 { return n }
    prev2, prev1 := 1, 2
    for i := 3; i <= n; i++ {
        prev2, prev1 = prev1, prev1+prev2
    }
    return prev1
}
```

**Time:** O(n) — **Space:** O(1)

## Dry Run

`n = 5`

| Step | prev2 | prev1 |
|---|---|---|
| Init | 1 | 2 |
| i=3 | 2 | 3 |
| i=4 | 3 | 5 |
| i=5 | 5 | 8 |

Answer: 8 ways. ✓ (`climbStairs(5) = 8` — matches Fibonacci)

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(2ⁿ) | O(n) |
| Memoization | O(n) | O(n) |
| Bottom-up O(1) | O(n) | O(1) |

## Key Interview Insights

**This is the entry-level DP problem.** Its purpose is to test if you understand the DP thought process: identify overlapping subproblems, define a clear state, write the recurrence, handle base cases.

**The Fibonacci connection:** `climbStairs(n) = fib(n+1)` — the n-th Fibonacci number when 1-indexed. Understanding this helps: any Fibonacci variant (k-step climbing, tribonacci, etc.) follows the exact same pattern.

**Common follow-up:** "What if you can take 1, 2, or 3 steps?" Extend the recurrence to `dp[i] = dp[i-1] + dp[i-2] + dp[i-3]`. Base cases become `dp[0]=1, dp[1]=1, dp[2]=2`.

**Space optimization first:** Interviewers often want O(1) space. Jump straight to the two-variable solution after explaining the recurrence.
