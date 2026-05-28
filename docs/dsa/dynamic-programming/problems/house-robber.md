---
title: House Robber
difficulty: Medium
tags: [Dynamic Programming, Array]
link: https://leetcode.com/problems/house-robber/
---

# House Robber

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [198. House Robber](https://leetcode.com/problems/house-robber/) |
| **Tags** | Dynamic Programming, Array |

## Problem Statement

You are a robber planning to rob houses along a street. Each house has a certain amount of money. Adjacent houses have connected security systems — robbing two adjacent houses triggers an alarm. Given `nums[i]` as the money at house `i`, return the maximum amount you can rob.

## Intuition

At each house, you make a binary choice: **rob it** or **skip it**.

- If you rob house `i`: you cannot rob house `i-1`, so the best you can do is `nums[i] + best(i-2)`
- If you skip house `i`: carry forward the best result through `i-1`, which is `best(i-1)`

This gives us: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`

The key insight: **you don't need to explicitly decide which houses to rob** — the recurrence handles it automatically by always picking the better option.

## Approach 1: Brute Force (Exponential Recursion)

Try every subset of non-adjacent houses — exponential complexity.

```cpp
int rob(vector<int>& nums) {
    function<int(int)> solve = [&](int i) -> int {
        if (i < 0) return 0;
        return max(solve(i - 1), solve(i - 2) + nums[i]);
    };
    return solve(nums.size() - 1);
}
```

```java
int rob(int[] nums) {
    return solve(nums, nums.length - 1);
}
int solve(int[] nums, int i) {
    if (i < 0) return 0;
    return Math.max(solve(nums, i - 1), solve(nums, i - 2) + nums[i]);
}
```

```typescript
function rob(nums: number[]): number {
    function solve(i: number): number {
        if (i < 0) return 0;
        return Math.max(solve(i - 1), solve(i - 2) + nums[i]);
    }
    return solve(nums.length - 1);
}
```

```python
def rob(nums: list[int]) -> int:
    def solve(i: int) -> int:
        if i < 0: return 0
        return max(solve(i - 1), solve(i - 2) + nums[i])
    return solve(len(nums) - 1)
```

```go
func rob(nums []int) int {
    var solve func(int) int
    solve = func(i int) int {
        if i < 0 { return 0 }
        return max(solve(i-1), solve(i-2)+nums[i])
    }
    return solve(len(nums) - 1)
}
```

**Time:** O(2ⁿ) — **Space:** O(n) stack

## Approach 2: DP Array

Build the DP table iteratively — O(n) time, O(n) space.

```cpp
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    vector<int> dp(n);
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}
```

```java
public int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    int[] dp = new int[n];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}
```

```typescript
function rob(nums: number[]): number {
    const n = nums.length;
    if (n === 1) return nums[0];
    const dp = new Array(n).fill(0);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (let i = 2; i < n; i++)
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}
```

```python
def rob(nums: list[int]) -> int:
    n = len(nums)
    if n == 1: return nums[0]
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    return dp[-1]
```

```go
func rob(nums []int) int {
    n := len(nums)
    if n == 1 { return nums[0] }
    dp := make([]int, n)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i := 2; i < n; i++ {
        dp[i] = max(dp[i-1], dp[i-2]+nums[i])
    }
    return dp[n-1]
}
```

**Time:** O(n) — **Space:** O(n)

## Approach 3: Space-Optimized DP (Optimal)

Only two previous values are needed. Use two variables.

```cpp
int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```java
public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```typescript
function rob(nums: number[]): number {
    let prev2 = 0, prev1 = 0;
    for (const num of nums) {
        const curr = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```python
def rob(nums: list[int]) -> int:
    prev2 = prev1 = 0
    for num in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + num)
    return prev1
```

```go
func rob(nums []int) int {
    prev2, prev1 := 0, 0
    for _, num := range nums {
        prev2, prev1 = prev1, max(prev1, prev2+num)
    }
    return prev1
}
```

**Time:** O(n) — **Space:** O(1)

## Dry Run

`nums = [2, 7, 9, 3, 1]`

| num | prev2 | prev1 (max so far) |
|---|---|---|
| 2 | 0 | 2 |
| 7 | 2 | 7 |
| 9 | 7 | 11 |
| 3 | 11 | 11 |
| 1 | 11 | 12 |

Answer: **12** (rob houses 0, 2, 4: `2 + 9 + 1 = 12`)

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force recursion | O(2ⁿ) | O(n) |
| DP array | O(n) | O(n) |
| Two-variable DP | O(n) | O(1) |

## Key Interview Insights

**Generalizing "no two adjacent" to "no two within k distance":** Change the recurrence to `dp[i] = max(dp[i-1], dp[i-k] + nums[i])`. The structure stays the same.

**This is the foundation of House Robber II and III.** House Robber II adds the circular constraint (first and last are adjacent). House Robber III is the tree DP version.

**The initialized zeros matter:** Starting `prev2 = prev1 = 0` handles any leading empty prefix naturally — picking nothing yields 0 profit. Never start with negative infinity here.

**Interview trap:** Don't initialize `prev1 = nums[0]` and start the loop at index 1. The cleaner and bug-free approach is to start with `prev2 = prev1 = 0` and iterate over the full array.
