---
title: Burst Balloons
difficulty: Hard
tags: [Dynamic Programming, Divide and Conquer, Array]
link: https://leetcode.com/problems/burst-balloons/
---

# Burst Balloons

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [312. Burst Balloons](https://leetcode.com/problems/burst-balloons/) |
| **Tags** | Dynamic Programming, Divide and Conquer, Array |

## Problem Statement

You are given `n` balloons, indexed from `0` to `n-1`. Each balloon has a number painted on it given by `nums[i]`. You burst all the balloons one by one. If you burst balloon `i`, you gain `nums[i-1] * nums[i] * nums[i+1]` coins (neighbors at time of burst). Balloons at the boundary default to `1` (treat `nums[-1] = nums[n] = 1`). Return the **maximum coins** you can collect.

**Example:** `nums = [3, 1, 5, 8]` → `167`
- Burst 1 → 3×1×5=15, remaining [3,5,8]
- Burst 5 → 3×5×8=120, remaining [3,8]
- Burst 3 → 1×3×8=24, remaining [8]
- Burst 8 → 1×8×1=8

## Intuition

**The key insight:** Instead of thinking about which balloon to burst **first**, think about which balloon to burst **last** in a subrange `[l, r]`.

If balloon `k` is the **last burst** in `(l, r)` (exclusive boundaries are the "padding" balloons, already present at edges), then:
- When we burst `k`, balloons `l` and `r` are still present (they're the boundaries)
- Coins from `k` being last = `nums[l] * nums[k] * nums[r]`
- Left subproblem `(l, k)` and right subproblem `(k, r)` are **independent**

Add padding: `nums = [1] + nums + [1]`, so boundary balloons are always 1.

`dp[l][r]` = max coins from bursting all balloons **strictly inside** `(l, r)`.

```
dp[l][r] = max over k in (l, r): dp[l][k] + nums[l]*nums[k]*nums[r] + dp[k][r]
```

Base: `dp[l][r] = 0` when `r - l < 2` (no balloons inside).

## Approach 1: Brute Force (Try All Permutations)

Enumerate all burst orderings — O(n!) — infeasible.

```cpp
// O(n!) — infeasible for n > 10.
// Demonstrates why we need the "last burst" insight.
int maxCoins(vector<int>& nums) {
    if (nums.empty()) return 0;
    int maxVal = 0;
    for (int i = 0; i < nums.size(); i++) {
        int val = (i > 0 ? nums[i-1] : 1) * nums[i] * (i + 1 < nums.size() ? nums[i+1] : 1);
        vector<int> rest(nums.begin(), nums.begin() + i);
        rest.insert(rest.end(), nums.begin() + i + 1, nums.end());
        maxVal = max(maxVal, val + maxCoins(rest));
    }
    return maxVal;
}
```

```java
// O(n!) — infeasible.
int maxCoins(int[] nums) {
    int maxVal = 0;
    for (int i = 0; i < nums.length; i++) {
        int val = (i > 0 ? nums[i-1] : 1) * nums[i] * (i+1 < nums.length ? nums[i+1] : 1);
        int[] rest = new int[nums.length - 1];
        System.arraycopy(nums, 0, rest, 0, i);
        System.arraycopy(nums, i+1, rest, i, nums.length - i - 1);
        maxVal = Math.max(maxVal, val + maxCoins(rest));
    }
    return maxVal;
}
```

```typescript
// O(n!) — infeasible.
function maxCoins(nums: number[]): number {
    if (!nums.length) return 0;
    let maxVal = 0;
    for (let i = 0; i < nums.length; i++) {
        const val = (i > 0 ? nums[i-1] : 1) * nums[i] * (i+1 < nums.length ? nums[i+1] : 1);
        const rest = [...nums.slice(0, i), ...nums.slice(i+1)];
        maxVal = Math.max(maxVal, val + maxCoins(rest));
    }
    return maxVal;
}
```

```python
# O(n!) — infeasible.
def maxCoins(nums: list[int]) -> int:
    if not nums: return 0
    best = 0
    for i in range(len(nums)):
        left = nums[i-1] if i > 0 else 1
        right = nums[i+1] if i+1 < len(nums) else 1
        coins = left * nums[i] * right
        rest = nums[:i] + nums[i+1:]
        best = max(best, coins + maxCoins(rest))
    return best
```

```go
// O(n!) — infeasible.
func maxCoins(nums []int) int {
    if len(nums) == 0 { return 0 }
    best := 0
    for i, n := range nums {
        left, right := 1, 1
        if i > 0 { left = nums[i-1] }
        if i+1 < len(nums) { right = nums[i+1] }
        coins := left * n * right
        rest := append(append([]int{}, nums[:i]...), nums[i+1:]...)
        if v := coins + maxCoins(rest); v > best { best = v }
    }
    return best
}
```

**Time:** O(n!) — **Space:** O(n)

## Approach 2: Top-Down DP with Memoization

Implement the interval DP recurrence recursively with a memoization table.

```cpp
class Solution {
    vector<int> nums;
    vector<vector<int>> memo;
    int dp(int l, int r) {
        if (r - l < 2) return 0;
        if (memo[l][r] != -1) return memo[l][r];
        int best = 0;
        for (int k = l + 1; k < r; k++) {
            int coins = nums[l] * nums[k] * nums[r];
            best = max(best, dp(l, k) + coins + dp(k, r));
        }
        return memo[l][r] = best;
    }
public:
    int maxCoins(vector<int>& n) {
        nums = {1};
        nums.insert(nums.end(), n.begin(), n.end());
        nums.push_back(1);
        int sz = nums.size();
        memo.assign(sz, vector<int>(sz, -1));
        return dp(0, sz - 1);
    }
};
```

```java
class Solution {
    int[] nums;
    int[][] memo;
    int dp(int l, int r) {
        if (r - l < 2) return 0;
        if (memo[l][r] != -1) return memo[l][r];
        int best = 0;
        for (int k = l + 1; k < r; k++) {
            int coins = nums[l] * nums[k] * nums[r];
            best = Math.max(best, dp(l, k) + coins + dp(k, r));
        }
        return memo[l][r] = best;
    }
    public int maxCoins(int[] n) {
        nums = new int[n.length + 2];
        nums[0] = nums[n.length + 1] = 1;
        for (int i = 0; i < n.length; i++) nums[i + 1] = n[i];
        int sz = nums.length;
        memo = new int[sz][sz];
        for (int[] row : memo) Arrays.fill(row, -1);
        return dp(0, sz - 1);
    }
}
```

```typescript
function maxCoins(n: number[]): number {
    const nums = [1, ...n, 1];
    const sz = nums.length;
    const memo: number[][] = Array.from({ length: sz }, () => new Array(sz).fill(-1));
    function dp(l: number, r: number): number {
        if (r - l < 2) return 0;
        if (memo[l][r] !== -1) return memo[l][r];
        let best = 0;
        for (let k = l + 1; k < r; k++) {
            const coins = nums[l] * nums[k] * nums[r];
            best = Math.max(best, dp(l, k) + coins + dp(k, r));
        }
        return memo[l][r] = best;
    }
    return dp(0, sz - 1);
}
```

```python
def maxCoins(nums: list[int]) -> int:
    from functools import lru_cache
    nums = [1] + nums + [1]
    n = len(nums)

    @lru_cache(maxsize=None)
    def dp(l: int, r: int) -> int:
        if r - l < 2: return 0
        return max(
            dp(l, k) + nums[l] * nums[k] * nums[r] + dp(k, r)
            for k in range(l + 1, r)
        )

    return dp(0, n - 1)
```

```go
func maxCoins(n []int) int {
    nums := append([]int{1}, n...)
    nums = append(nums, 1)
    sz := len(nums)
    memo := make([][]int, sz)
    for i := range memo {
        memo[i] = make([]int, sz)
        for j := range memo[i] { memo[i][j] = -1 }
    }
    var dp func(l, r int) int
    dp = func(l, r int) int {
        if r-l < 2 { return 0 }
        if memo[l][r] != -1 { return memo[l][r] }
        best := 0
        for k := l + 1; k < r; k++ {
            coins := nums[l] * nums[k] * nums[r]
            if v := dp(l, k) + coins + dp(k, r); v > best { best = v }
        }
        memo[l][r] = best
        return best
    }
    return dp(0, sz-1)
}
```

**Time:** O(n³) — **Space:** O(n²)

## Approach 3: Bottom-Up Interval DP (Optimal)

Fill the DP table by increasing interval lengths.

```cpp
int maxCoins(vector<int>& n) {
    vector<int> nums = {1};
    nums.insert(nums.end(), n.begin(), n.end());
    nums.push_back(1);
    int sz = nums.size();
    vector<vector<int>> dp(sz, vector<int>(sz, 0));
    for (int len = 2; len < sz; len++) {          // interval length
        for (int l = 0; l < sz - len; l++) {      // left boundary
            int r = l + len;
            for (int k = l + 1; k < r; k++) {     // last burst
                int coins = nums[l] * nums[k] * nums[r];
                dp[l][r] = max(dp[l][r], dp[l][k] + coins + dp[k][r]);
            }
        }
    }
    return dp[0][sz-1];
}
```

```java
public int maxCoins(int[] n) {
    int[] nums = new int[n.length + 2];
    nums[0] = nums[n.length + 1] = 1;
    for (int i = 0; i < n.length; i++) nums[i + 1] = n[i];
    int sz = nums.length;
    int[][] dp = new int[sz][sz];
    for (int len = 2; len < sz; len++) {
        for (int l = 0; l < sz - len; l++) {
            int r = l + len;
            for (int k = l + 1; k < r; k++) {
                int coins = nums[l] * nums[k] * nums[r];
                dp[l][r] = Math.max(dp[l][r], dp[l][k] + coins + dp[k][r]);
            }
        }
    }
    return dp[0][sz-1];
}
```

```typescript
function maxCoins(n: number[]): number {
    const nums = [1, ...n, 1];
    const sz = nums.length;
    const dp = Array.from({ length: sz }, () => new Array(sz).fill(0));
    for (let len = 2; len < sz; len++) {
        for (let l = 0; l < sz - len; l++) {
            const r = l + len;
            for (let k = l + 1; k < r; k++) {
                const coins = nums[l] * nums[k] * nums[r];
                dp[l][r] = Math.max(dp[l][r], dp[l][k] + coins + dp[k][r]);
            }
        }
    }
    return dp[0][sz-1];
}
```

```python
def maxCoins(nums: list[int]) -> int:
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):
        for l in range(n - length):
            r = l + length
            for k in range(l + 1, r):
                coins = nums[l] * nums[k] * nums[r]
                dp[l][r] = max(dp[l][r], dp[l][k] + coins + dp[k][r])
    return dp[0][n-1]
```

```go
func maxCoins(n []int) int {
    nums := append([]int{1}, n...)
    nums = append(nums, 1)
    sz := len(nums)
    dp := make([][]int, sz)
    for i := range dp { dp[i] = make([]int, sz) }
    for length := 2; length < sz; length++ {
        for l := 0; l < sz-length; l++ {
            r := l + length
            for k := l + 1; k < r; k++ {
                coins := nums[l] * nums[k] * nums[r]
                if v := dp[l][k] + coins + dp[k][r]; v > dp[l][r] {
                    dp[l][r] = v
                }
            }
        }
    }
    return dp[0][sz-1]
}
```

**Time:** O(n³) — **Space:** O(n²)

## Dry Run

`nums = [3, 1, 5, 8]` → padded: `[1, 3, 1, 5, 8, 1]` (indices 0–5)

Key interval computations (showing `dp[0][5]` built up):

- `dp[0][2]`: k=1: nums[0]*nums[1]*nums[2] = 1*3*1=3. dp[0][2]=3
- `dp[1][3]`: k=2: 3*1*5=15. dp[1][3]=15
- `dp[2][4]`: k=3: 1*5*8=40. dp[2][4]=40
- `dp[0][3]`: k=1: dp[0][1]+3*3*5+dp[1][3]=0+45+15=60; k=2: 3+1*1*5+0=8. dp[0][3]=60
- `dp[1][5]`: k=2: 0+3*1*1+40=43; k=3: 15+3*5*1+8=38; k=4: 0+3*8*1+40=64. dp[1][5]=64
- `dp[0][5]`: k=1: dp[0][1]+1*3*1+dp[1][5]=0+3+64=67; k=2: 3+1*1*1+64=68; k=3: 60+1*5*1+40=105; k=4: dp[0][4]+1*8*1+0=... → **167**

Answer: **167** ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(n!) | O(n) |
| Memoized top-down | O(n³) | O(n²) |
| Bottom-up interval DP | O(n³) | O(n²) |

## Key Interview Insights

**The "last burst" framing is the key insight.** The naive "first burst" approach creates dependent subproblems because bursting a balloon changes its neighbors. Thinking about the *last* burst in a range creates independent subproblems — both sides become their own isolated intervals.

**Interval DP template:** Whenever you see a problem that asks for optimal value over a contiguous subarray where the order of operations matters, try interval DP. Other examples: Matrix Chain Multiplication, Optimal BST, Strange Printer (LC 664).

**Padding with 1s:** Always add boundary sentinels to avoid out-of-bounds checks and to handle the rule that boundaries default to 1. This is cleaner than special-casing edges.

**Bottom-up ordering:** You MUST iterate by increasing interval length. A range of length `len` depends on sub-ranges of smaller lengths. Never fill the table row by row for interval DP.
