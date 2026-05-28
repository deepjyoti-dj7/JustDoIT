---
title: Memoization vs Tabulation
description: Top-down memoization and bottom-up tabulation — two implementation strategies for the same DP idea
---

# Memoization vs Tabulation

Every DP problem has exactly one underlying recurrence. But you can implement that recurrence in two fundamentally different ways: **top-down (memoization)** and **bottom-up (tabulation)**. Understanding both — and knowing when to switch — is a key interview skill.

## The Same Problem, Two Approaches

Take Climbing Stairs: you can climb 1 or 2 steps at a time. How many distinct ways to reach step `n`?

**Recurrence:** `ways(n) = ways(n-1) + ways(n-2)` (from step n-1 with 1 step, or from n-2 with 2 steps)

**Base cases:** `ways(0) = 1`, `ways(1) = 1`

Both approaches implement this exact recurrence — they just traverse it in opposite directions.

## Top-Down: Memoization

Start from the original problem and recurse toward base cases. Cache results to avoid recomputing.

**Mental model:** "I'll solve the big problem, and whenever I need a subproblem, I'll either look it up in my cache or compute it on the spot."

```cpp
class Solution {
    unordered_map<int, int> memo;
public:
    int climbStairs(int n) {
        if (n <= 1) return 1;
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
        Arrays.fill(memo, -1);
        return dp(n);
    }
    private int dp(int n) {
        if (n <= 1) return 1;
        if (memo[n] != -1) return memo[n];
        return memo[n] = dp(n - 1) + dp(n - 2);
    }
}
```

```typescript
function climbStairs(n: number): number {
    const memo = new Map<number, number>();
    function dp(n: number): number {
        if (n <= 1) return 1;
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
        if n <= 1: return 1
        return dp(n - 1) + dp(n - 2)

    return dp(n)
```

```go
func climbStairs(n int) int {
    memo := make(map[int]int)
    var dp func(int) int
    dp = func(n int) int {
        if n <= 1 { return 1 }
        if v, ok := memo[n]; ok { return v }
        memo[n] = dp(n-1) + dp(n-2)
        return memo[n]
    }
    return dp(n)
}
```

**Execution trace for `n = 5`:**

```
dp(5) → calls dp(4) and dp(3)
  dp(4) → calls dp(3) and dp(2)
    dp(3) → calls dp(2) and dp(1)
      dp(2) → calls dp(1) and dp(0) → returns 2, cached
      dp(1) → returns 1
    → dp(3) = 3, cached
    dp(2) → cache hit! returns 2
  → dp(4) = 5, cached
  dp(3) → cache hit! returns 3
→ dp(5) = 8
```

## Bottom-Up: Tabulation

Build the solution table from the smallest subproblems upward until you reach the final answer.

**Mental model:** "I'll fill a table, starting from the base cases, row by row, until I reach the cell I need."

```cpp
int climbStairs(int n) {
    if (n <= 1) return 1;
    vector<int> dp(n + 1);
    dp[0] = 1; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
```

```java
int climbStairs(int n) {
    if (n <= 1) return 1;
    int[] dp = new int[n + 1];
    dp[0] = 1; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}
```

```typescript
function climbStairs(n: number): number {
    if (n <= 1) return 1;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1; dp[1] = 1;
    for (let i = 2; i <= n; i++)
        dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}
```

```python
def climbStairs(n: int) -> int:
    if n <= 1: return 1
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

```go
func climbStairs(n int) int {
    if n <= 1 { return 1 }
    dp := make([]int, n+1)
    dp[0], dp[1] = 1, 1
    for i := 2; i <= n; i++ {
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[n]
}
```

## Space Optimization: Rolling Variables

When each state only depends on the **previous few states**, you don't need the entire DP array. Just keep variables.

For Climbing Stairs, `dp[i]` only needs `dp[i-1]` and `dp[i-2]`:

```cpp
int climbStairs(int n) {
    if (n <= 1) return 1;
    int prev2 = 1, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```java
int climbStairs(int n) {
    if (n <= 1) return 1;
    int prev2 = 1, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```typescript
function climbStairs(n: number): number {
    if (n <= 1) return 1;
    let prev2 = 1, prev1 = 1;
    for (let i = 2; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```python
def climbStairs(n: int) -> int:
    if n <= 1: return 1
    prev2, prev1 = 1, 1
    for _ in range(2, n + 1):
        prev2, prev1 = prev1, prev1 + prev2
    return prev1
```

```go
func climbStairs(n int) int {
    if n <= 1 { return 1 }
    prev2, prev1 := 1, 1
    for i := 2; i <= n; i++ {
        prev2, prev1 = prev1, prev1+prev2
    }
    return prev1
}
```

O(n) → **O(1) space** with the same O(n) time. This trick works for any DP where the current row depends only on a fixed number of previous rows.

## Converting Top-Down to Bottom-Up

The mechanical conversion:

1. Identify all the state variables (the arguments to the recursive function)
2. Create a table with one dimension per state variable
3. Fill base cases directly into the table
4. Replace the recursive calls with table lookups
5. Replace the return value with a table write

The **evaluation order** in bottom-up must ensure all dependencies are filled before they're needed. For linear DP, that's left to right. For 2D DP, row-major order usually works.

## When to Use Which

**Prefer top-down (memoization) when:**
- The state space is large but sparse — you only compute what you actually need
- The problem has a natural recursive structure that's easy to express
- You need to implement quickly in an interview
- Python with `@lru_cache` makes it a one-liner
- The recursion depth is not a concern (problem size is moderate)

**Prefer bottom-up (tabulation) when:**
- You need space optimization (rolling array trick)
- The call stack depth is a problem (very large `n`)
- Every subproblem is needed anyway (no wasted computation in memoization)
- The evaluation order is simple and obvious
- You want to avoid function call overhead for performance

## Handling Multiple State Dimensions

When your DP has 2+ state variables, the same rules apply but with a higher-dimensional table:

**Top-down:** Use a hash map with a tuple key, or a 2D array indexed by both states.

**Bottom-up:** Nested loops, one per dimension. Make sure the loop order respects dependencies.

```cpp
// 2D state: dp[i][j] — top-down with 2D array
int memo[1001][1001];
memset(memo, -1, sizeof(memo));

int dp(int i, int j, ...) {
    if (/* base case */) return ...;
    if (memo[i][j] != -1) return memo[i][j];
    return memo[i][j] = /* recurrence */;
}
```

```java
// 2D state: dp[i][j] — bottom-up
int[][] dp = new int[n + 1][m + 1];
// fill base cases
for (int i = 1; i <= n; i++)
    for (int j = 1; j <= m; j++)
        dp[i][j] = /* recurrence using dp[i-1][j], dp[i][j-1], etc. */;
```

```typescript
// 2D DP — bottom-up
const dp: number[][] = Array.from({length: n + 1}, () => new Array(m + 1).fill(0));
for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
        dp[i][j] = /* recurrence */;
```

```python
# 2D DP — bottom-up
dp = [[0] * (m + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    for j in range(1, m + 1):
        dp[i][j] = # recurrence
```

```go
// 2D DP — bottom-up
dp := make([][]int, n+1)
for i := range dp { dp[i] = make([]int, m+1) }
for i := 1; i <= n; i++ {
    for j := 1; j <= m; j++ {
        dp[i][j] = /* recurrence */
    }
}
```

## Rolling Array for 2D DP

When `dp[i][j]` only depends on `dp[i-1][...]` (the previous row), you can compress the 2D table into a 1D array:

Replace `dp[i][j]` with `dp[j]` and process row by row, overwriting the previous row's values.

**Critical:** Depending on whether you traverse left-to-right or right-to-left, you either use the current or previous row's value for the same column. For the 0/1 Knapsack, process **right to left** to avoid using the current row's updated value. For Unbounded Knapsack, process **left to right** to intentionally use it.

## The Python `@lru_cache` Shortcut

In Python, you can memoize any recursive function with a single decorator. This is interview gold:

```python
from functools import lru_cache

def solve(n: int, k: int) -> int:
    @lru_cache(maxsize=None)
    def dp(i: int, remaining: int) -> int:
        if remaining < 0: return float('-inf')
        if i == n: return 0
        # take or skip
        return max(dp(i + 1, remaining - cost[i]) + value[i],
                   dp(i + 1, remaining))
    return dp(0, k)
```

The cache is keyed automatically on the function arguments. No boilerplate needed.

## Key Interview Insight

Both approaches compute identical answers. The difference is purely implementation strategy:

- Top-down is easier to **write** — start from the problem statement and recurse naturally
- Bottom-up is easier to **optimize** — space compression via rolling arrays is straightforward

In 45-minute interviews, start with top-down to get a working solution, then optimize to bottom-up with rolling array if the interviewer asks about space complexity.
