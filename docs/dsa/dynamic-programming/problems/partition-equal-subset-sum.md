---
title: Partition Equal Subset Sum
difficulty: Medium
tags: [Dynamic Programming, Array]
link: https://leetcode.com/problems/partition-equal-subset-sum/
---

# Partition Equal Subset Sum

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) |
| **Tags** | Dynamic Programming, Array |

## Problem Statement

Given an integer array `nums`, return `true` if you can partition it into two subsets such that the sum of elements in both subsets is equal, and `false` otherwise.

**Example:** `nums = [1, 5, 11, 5]` → `true` (`{1, 5, 5}` and `{11}`)
**Example:** `nums = [1, 2, 3, 5]` → `false`

## Intuition

If the total sum is **odd**, return false immediately (can't split evenly).
If even, the goal reduces to: **can we find a subset that sums to `total/2`?**

This is exactly the **0/1 Knapsack** decision problem: can we pick some items (each usable at most once) to hit a target weight?

`dp[j]` = true if subset sum `j` is achievable with the numbers seen so far.

For each number `num`, update: `dp[j] |= dp[j - num]` (iterate `j` backwards to avoid reuse).

## Approach 1: Brute Force (All Subsets)

Try all 2ⁿ subsets. Check if any sums to `target`.

```cpp
bool canPartition(vector<int>& nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    int target = total / 2;
    function<bool(int, int)> dfs = [&](int i, int rem) -> bool {
        if (rem == 0) return true;
        if (i >= nums.size() || rem < 0) return false;
        return dfs(i + 1, rem - nums[i]) || dfs(i + 1, rem);
    };
    return dfs(0, target);
}
```

```java
boolean canPartition(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    return dfs(nums, 0, total / 2);
}
boolean dfs(int[] nums, int i, int rem) {
    if (rem == 0) return true;
    if (i >= nums.length || rem < 0) return false;
    return dfs(nums, i + 1, rem - nums[i]) || dfs(nums, i + 1, rem);
}
```

```typescript
function canPartition(nums: number[]): boolean {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    const target = total / 2;
    function dfs(i: number, rem: number): boolean {
        if (rem === 0) return true;
        if (i >= nums.length || rem < 0) return false;
        return dfs(i + 1, rem - nums[i]) || dfs(i + 1, rem);
    }
    return dfs(0, target);
}
```

```python
def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0: return False
    target = total // 2
    def dfs(i: int, rem: int) -> bool:
        if rem == 0: return True
        if i >= len(nums) or rem < 0: return False
        return dfs(i + 1, rem - nums[i]) or dfs(i + 1, rem)
    return dfs(0, target)
```

```go
func canPartition(nums []int) bool {
    total := 0
    for _, n := range nums { total += n }
    if total%2 != 0 { return false }
    target := total / 2
    var dfs func(i, rem int) bool
    dfs = func(i, rem int) bool {
        if rem == 0 { return true }
        if i >= len(nums) || rem < 0 { return false }
        return dfs(i+1, rem-nums[i]) || dfs(i+1, rem)
    }
    return dfs(0, target)
}
```

**Time:** O(2ⁿ) — **Space:** O(n) stack

## Approach 2: 2D DP (Knapsack Table)

`dp[i][j]` = true if we can achieve sum `j` using the first `i` items.

```cpp
bool canPartition(vector<int>& nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    int target = total / 2;
    int n = nums.size();
    vector<vector<bool>> dp(n + 1, vector<bool>(target + 1, false));
    for (int i = 0; i <= n; i++) dp[i][0] = true;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= target; j++) {
            dp[i][j] = dp[i-1][j];
            if (nums[i-1] <= j)
                dp[i][j] = dp[i][j] || dp[i-1][j - nums[i-1]];
        }
    }
    return dp[n][target];
}
```

```java
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    int target = total / 2, n = nums.length;
    boolean[][] dp = new boolean[n + 1][target + 1];
    for (int i = 0; i <= n; i++) dp[i][0] = true;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= target; j++) {
            dp[i][j] = dp[i-1][j];
            if (nums[i-1] <= j)
                dp[i][j] |= dp[i-1][j - nums[i-1]];
        }
    }
    return dp[n][target];
}
```

```typescript
function canPartition(nums: number[]): boolean {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    const target = total / 2, n = nums.length;
    const dp = Array.from({ length: n+1 }, () => new Array(target+1).fill(false));
    for (let i = 0; i <= n; i++) dp[i][0] = true;
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= target; j++) {
            dp[i][j] = dp[i-1][j];
            if (nums[i-1] <= j) dp[i][j] = dp[i][j] || dp[i-1][j - nums[i-1]];
        }
    }
    return dp[n][target];
}
```

```python
def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0: return False
    target, n = total // 2, len(nums)
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    for i in range(n + 1): dp[i][0] = True
    for i in range(1, n + 1):
        for j in range(1, target + 1):
            dp[i][j] = dp[i-1][j]
            if nums[i-1] <= j:
                dp[i][j] = dp[i][j] or dp[i-1][j - nums[i-1]]
    return dp[n][target]
```

```go
func canPartition(nums []int) bool {
    total := 0
    for _, n := range nums { total += n }
    if total%2 != 0 { return false }
    target, n := total/2, len(nums)
    dp := make([][]bool, n+1)
    for i := range dp {
        dp[i] = make([]bool, target+1)
        dp[i][0] = true
    }
    for i := 1; i <= n; i++ {
        for j := 1; j <= target; j++ {
            dp[i][j] = dp[i-1][j]
            if nums[i-1] <= j {
                dp[i][j] = dp[i][j] || dp[i-1][j-nums[i-1]]
            }
        }
    }
    return dp[n][target]
}
```

**Time:** O(n × target) — **Space:** O(n × target)

## Approach 3: 1D DP — Space-Optimized (Optimal)

Use a single boolean array. Iterate `j` **right-to-left** to prevent using the same item twice.

```cpp
bool canPartition(vector<int>& nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    int target = total / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : nums) {
        for (int j = target; j >= num; j--)
            dp[j] = dp[j] || dp[j - num];
    }
    return dp[target];
}
```

```java
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums) {
        for (int j = target; j >= num; j--)
            dp[j] |= dp[j - num];
    }
    return dp[target];
}
```

```typescript
function canPartition(nums: number[]): boolean {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    const target = total / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    for (const num of nums) {
        for (let j = target; j >= num; j--)
            dp[j] = dp[j] || dp[j - num];
    }
    return dp[target];
}
```

```python
def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2 != 0: return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]
```

```go
func canPartition(nums []int) bool {
    total := 0
    for _, n := range nums { total += n }
    if total%2 != 0 { return false }
    target := total / 2
    dp := make([]bool, target+1)
    dp[0] = true
    for _, num := range nums {
        for j := target; j >= num; j-- {
            dp[j] = dp[j] || dp[j-num]
        }
    }
    return dp[target]
}
```

**Time:** O(n × target) — **Space:** O(target)

## Dry Run

`nums = [1, 5, 11, 5]`, `total = 22`, `target = 11`

| num | dp after update (show only changed) |
|---|---|
| 1 | dp[1]=T |
| 5 | dp[6]=T, dp[5]=T |
| 11 | dp[11]=T, dp[12]=T, dp[16]=T |
| 5 | dp[11] already T |

`dp[11] = true` → **true** ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(2ⁿ) | O(n) |
| 2D DP | O(n×S) | O(n×S) |
| 1D DP | O(n×S) | O(S) |

where S = `sum/2`

## Key Interview Insights

**The right-to-left iteration prevents double-counting.** In 0/1 knapsack (each item once), iterate `j` from `target` down to `num`. This ensures `dp[j - num]` refers to the state *before* the current item was considered. Left-to-right would allow the same item multiple times (unbounded knapsack).

**Early termination:** If `total` is odd, return false immediately. Also, if any single `num > target`, you can never reach `target` using that item, so skip it.

**Bitset optimization (C++):** Represent `dp` as a bitset. The update becomes `bs |= (bs << num)`. This runs in O(n × S / 64) — much faster in practice.

**Related problems following the same pattern:** Target Sum (LC 494), Last Stone Weight II (LC 1049), Count Subset Sum (standard DP variant). All are 0/1 knapsack with slight variations on what's being computed.
