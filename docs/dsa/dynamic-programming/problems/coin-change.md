---
title: Coin Change
difficulty: Medium
tags: [Dynamic Programming, Breadth-First Search, Array]
link: https://leetcode.com/problems/coin-change/
---

# Coin Change

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [322. Coin Change](https://leetcode.com/problems/coin-change/) |
| **Tags** | Dynamic Programming, BFS, Array |

## Problem Statement

Given an integer array `coins` representing coin denominations and an integer `amount`, return the **fewest number of coins** needed to make up that amount. If it cannot be made, return `-1`. You have an **infinite** supply of each coin.

## Intuition

This is the **Unbounded Knapsack** / minimum-cost variant. For each amount `a`, the minimum coins needed is:

```
dp[a] = 1 + min(dp[a - coin]) for each coin where a >= coin
```

We want the minimum across all coin choices. If no coin leads to a valid state, the amount is unreachable.

The "infinite supply" means we can reuse coins — this is what makes it unbounded, not 0/1.

## Approach 1: Brute Force DFS

Try every combination recursively. Exponential without memoization.

```cpp
int coinChange(vector<int>& coins, int amount) {
    function<int(int)> dfs = [&](int rem) -> int {
        if (rem == 0) return 0;
        if (rem < 0) return INT_MAX;
        int best = INT_MAX;
        for (int c : coins) {
            int sub = dfs(rem - c);
            if (sub != INT_MAX)
                best = min(best, sub + 1);
        }
        return best;
    };
    int res = dfs(amount);
    return res == INT_MAX ? -1 : res;
}
```

```java
int coinChange(int[] coins, int amount) {
    int res = dfs(coins, amount);
    return res == Integer.MAX_VALUE ? -1 : res;
}
int dfs(int[] coins, int rem) {
    if (rem == 0) return 0;
    if (rem < 0) return Integer.MAX_VALUE;
    int best = Integer.MAX_VALUE;
    for (int c : coins) {
        int sub = dfs(coins, rem - c);
        if (sub != Integer.MAX_VALUE)
            best = Math.min(best, sub + 1);
    }
    return best;
}
```

```typescript
function coinChange(coins: number[], amount: number): number {
    function dfs(rem: number): number {
        if (rem === 0) return 0;
        if (rem < 0) return Infinity;
        let best = Infinity;
        for (const c of coins) {
            const sub = dfs(rem - c);
            if (sub !== Infinity) best = Math.min(best, sub + 1);
        }
        return best;
    }
    const res = dfs(amount);
    return res === Infinity ? -1 : res;
}
```

```python
def coinChange(coins: list[int], amount: int) -> int:
    def dfs(rem: int) -> int:
        if rem == 0: return 0
        if rem < 0: return float('inf')
        return min((dfs(rem - c) + 1 for c in coins), default=float('inf'))
    res = dfs(amount)
    return res if res != float('inf') else -1
```

```go
func coinChange(coins []int, amount int) int {
    var dfs func(rem int) int
    dfs = func(rem int) int {
        if rem == 0 { return 0 }
        best := 1<<31 - 1
        for _, c := range coins {
            if rem-c >= 0 {
                sub := dfs(rem - c)
                if sub != 1<<31-1 && sub+1 < best {
                    best = sub + 1
                }
            }
        }
        return best
    }
    res := dfs(amount)
    if res == 1<<31-1 { return -1 }
    return res
}
```

**Time:** O(S^n) where S=amount, n=coins — **Space:** O(S) stack

## Approach 2: Top-Down DP (Memoization)

Same recursion, but cache results to avoid recomputation.

```cpp
class Solution {
    unordered_map<int, int> memo;
public:
    int coinChange(vector<int>& coins, int amount) {
        return dp(coins, amount);
    }
    int dp(vector<int>& coins, int rem) {
        if (rem == 0) return 0;
        if (rem < 0) return INT_MAX;
        if (memo.count(rem)) return memo[rem];
        int best = INT_MAX;
        for (int c : coins) {
            int sub = dp(coins, rem - c);
            if (sub != INT_MAX)
                best = min(best, sub + 1);
        }
        return memo[rem] = best;
    }
};
```

```java
class Solution {
    private int[] memo;
    public int coinChange(int[] coins, int amount) {
        memo = new int[amount + 1];
        Arrays.fill(memo, -2);
        int res = dp(coins, amount);
        return res == Integer.MAX_VALUE ? -1 : res;
    }
    private int dp(int[] coins, int rem) {
        if (rem == 0) return 0;
        if (rem < 0) return Integer.MAX_VALUE;
        if (memo[rem] != -2) return memo[rem];
        int best = Integer.MAX_VALUE;
        for (int c : coins) {
            int sub = dp(coins, rem - c);
            if (sub != Integer.MAX_VALUE)
                best = Math.min(best, sub + 1);
        }
        return memo[rem] = best;
    }
}
```

```typescript
function coinChange(coins: number[], amount: number): number {
    const memo = new Map<number, number>();
    function dp(rem: number): number {
        if (rem === 0) return 0;
        if (rem < 0) return Infinity;
        if (memo.has(rem)) return memo.get(rem)!;
        let best = Infinity;
        for (const c of coins) {
            const sub = dp(rem - c);
            if (sub !== Infinity) best = Math.min(best, sub + 1);
        }
        memo.set(rem, best);
        return best;
    }
    const res = dp(amount);
    return res === Infinity ? -1 : res;
}
```

```python
def coinChange(coins: list[int], amount: int) -> int:
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def dp(rem: int) -> float:
        if rem == 0: return 0
        if rem < 0: return float('inf')
        return min((dp(rem - c) + 1 for c in coins), default=float('inf'))

    res = dp(amount)
    return int(res) if res != float('inf') else -1
```

```go
func coinChange(coins []int, amount int) int {
    memo := make([]int, amount+1)
    for i := range memo { memo[i] = -2 }
    const inf = 1<<31 - 1
    var dp func(rem int) int
    dp = func(rem int) int {
        if rem == 0 { return 0 }
        if rem < 0 { return inf }
        if memo[rem] != -2 { return memo[rem] }
        best := inf
        for _, c := range coins {
            sub := dp(rem - c)
            if sub != inf && sub+1 < best { best = sub + 1 }
        }
        memo[rem] = best
        return best
    }
    res := dp(amount)
    if res == inf { return -1 }
    return res
}
```

**Time:** O(S × n) — **Space:** O(S)

## Approach 3: Bottom-Up DP (Optimal)

Build `dp[0..amount]` where `dp[a]` = min coins to make amount `a`.

- Base: `dp[0] = 0`
- Init: `dp[i] = infinity` for `i > 0`
- Recurrence: `dp[a] = min(dp[a], dp[a - coin] + 1)` for each valid coin

```cpp
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (c <= a && dp[a - c] != INT_MAX)
                dp[a] = min(dp[a], dp[a - c] + 1);
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}
```

```java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++) {
        for (int c : coins) {
            if (c <= a)
                dp[a] = Math.min(dp[a], dp[a - c] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

```typescript
function coinChange(coins: number[], amount: number): number {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let a = 1; a <= amount; a++) {
        for (const c of coins) {
            if (c <= a && dp[a - c] !== Infinity)
                dp[a] = Math.min(dp[a], dp[a - c] + 1);
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```

```python
def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] != float('inf'):
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

```go
func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for i := range dp { dp[i] = amount + 1 }
    dp[0] = 0
    for a := 1; a <= amount; a++ {
        for _, c := range coins {
            if c <= a && dp[a-c]+1 < dp[a] {
                dp[a] = dp[a-c] + 1
            }
        }
    }
    if dp[amount] > amount { return -1 }
    return dp[amount]
}
```

**Time:** O(S × n) — **Space:** O(S)

## Dry Run

`coins = [1, 5, 6]`, `amount = 11`

| a | coins tried | dp[a] |
|---|---|---|
| 0 | — | 0 |
| 1 | 1→dp[0]+1=1 | 1 |
| 5 | 5→dp[0]+1=1 | 1 |
| 6 | 6→dp[0]+1=1 | 1 |
| 10 | 5→dp[5]+1=2; 6→dp[4]+1 | 2 |
| 11 | 5→dp[6]+1=2; 6→dp[5]+1=2 | 2 |

Answer: **2** (coins 5+6=11)

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force DFS | O(Sⁿ) | O(S) |
| Memoization | O(S×n) | O(S) |
| Bottom-up DP | O(S×n) | O(S) |

## Key Interview Insights

**Initializing with `amount + 1` instead of infinity** avoids integer overflow when adding 1 to a sentinel value. In Java/C++, this is common. For languages with arbitrary precision (Python), `float('inf')` is cleaner.

**Unbounded vs 0/1 knapsack:** In coin change, each coin can be used unlimited times, so we iterate over amounts *before* coins (or in either order for a 1D table). In 0/1 knapsack, each item can only be used once, so you iterate over items first and amounts in *reverse*.

**BFS alternative:** BFS from 0 to `amount` where edges are "+coin" transitions. BFS gives shortest path = minimum coins. More intuitive but same complexity. Use when you want to reconstruct the path (which coins were used).

**Variant: Coin Change 2 (counting ways):** Change `min` to `sum`. `dp[a] += dp[a - coin]` counts the number of distinct combinations. Start with `dp[0] = 1`.
