---
title: 2D Dynamic Programming
description: Grid DP and two-sequence DP patterns — state over two dimensions
---

# 2D Dynamic Programming

2D DP extends the state to two indices. This covers two major problem families: **grid traversal problems** (navigate an m×n matrix) and **two-sequence problems** (compare or combine two strings/arrays). Both share the same bottom-up structure: a 2D table where each cell depends on its neighbors.

## Grid DP

**Shape:** You're given an m×n grid. Move according to some rules (usually down and right only). Compute something at the destination.

**State:** `dp[i][j]` = answer for the subgrid ending at cell `(i, j)`

**Transition:** Depends on which directions are allowed. For down/right movement:
```
dp[i][j] = f(dp[i-1][j], dp[i][j-1]) + cost[i][j]
```

### Unique Paths

Count the number of paths from top-left to bottom-right in an m×n grid, moving only right or down.

**State:** `dp[i][j]` = number of paths to reach cell `(i, j)`

**Recurrence:** `dp[i][j] = dp[i-1][j] + dp[i][j-1]`

**Base cases:** First row and column = 1 (only one way to reach any cell in them)

```cpp
int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
    return dp[m-1][n-1];
}
```

```java
int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    for (int[] row : dp) Arrays.fill(row, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
    return dp[m-1][n-1];
}
```

```typescript
function uniquePaths(m: number, n: number): number {
    const dp = Array.from({length: m}, () => new Array(n).fill(1));
    for (let i = 1; i < m; i++)
        for (let j = 1; j < n; j++)
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
    return dp[m-1][n-1];
}
```

```python
def uniquePaths(m: int, n: int) -> int:
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]
```

```go
func uniquePaths(m, n int) int {
    dp := make([][]int, m)
    for i := range dp {
        dp[i] = make([]int, n)
        for j := range dp[i] { dp[i][j] = 1 }
    }
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
        }
    }
    return dp[m-1][n-1]
}
```

**Space optimization:** `dp[i][j]` only uses the row above and the current row. Compress to 1D:

```cpp
int uniquePaths(int m, int n) {
    vector<int> dp(n, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j-1];
    return dp[n-1];
}
```

```java
int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[j] += dp[j-1];
    return dp[n-1];
}
```

```typescript
function uniquePaths(m: number, n: number): number {
    const dp = new Array(n).fill(1);
    for (let i = 1; i < m; i++)
        for (let j = 1; j < n; j++)
            dp[j] += dp[j-1];
    return dp[n-1];
}
```

```python
def uniquePaths(m: int, n: int) -> int:
    dp = [1] * n
    for _ in range(1, m):
        for j in range(1, n):
            dp[j] += dp[j-1]
    return dp[-1]
```

```go
func uniquePaths(m, n int) int {
    dp := make([]int, n)
    for i := range dp { dp[i] = 1 }
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            dp[j] += dp[j-1]
        }
    }
    return dp[n-1]
}
```

### Minimum Path Sum

Navigate an m×n grid of non-negative integers from top-left to bottom-right (moving only right or down), minimizing the sum of visited cells.

**State:** `dp[i][j]` = minimum path sum to reach `(i, j)`

**Recurrence:** `dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]`

**Base cases:** `dp[0][0] = grid[0][0]`, fill first row and first column with running sums.

```cpp
int minPathSum(vector<vector<int>>& grid) {
    int m = grid.size(), n = grid[0].size();
    vector<vector<int>> dp(m, vector<int>(n, 0));
    dp[0][0] = grid[0][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
    return dp[m-1][n-1];
}
```

```java
int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dp = new int[m][n];
    dp[0][0] = grid[0][0];
    for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];
    for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];
    return dp[m-1][n-1];
}
```

```typescript
function minPathSum(grid: number[][]): number {
    const m = grid.length, n = grid[0].length;
    const dp = Array.from({length: m}, (_, i) => [...grid[i]]);
    for (let j = 1; j < n; j++) dp[0][j] += dp[0][j-1];
    for (let i = 1; i < m; i++) dp[i][0] += dp[i-1][0];
    for (let i = 1; i < m; i++)
        for (let j = 1; j < n; j++)
            dp[i][j] += Math.min(dp[i-1][j], dp[i][j-1]);
    return dp[m-1][n-1];
}
```

```python
def minPathSum(grid: list[list[int]]) -> int:
    m, n = len(grid), len(grid[0])
    dp = [row[:] for row in grid]
    for j in range(1, n): dp[0][j] += dp[0][j-1]
    for i in range(1, m): dp[i][0] += dp[i-1][0]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] += min(dp[i-1][j], dp[i][j-1])
    return dp[m-1][n-1]
```

```go
func minPathSum(grid [][]int) int {
    m, n := len(grid), len(grid[0])
    dp := make([][]int, m)
    for i := range dp {
        dp[i] = make([]int, n)
        copy(dp[i], grid[i])
    }
    for j := 1; j < n; j++ { dp[0][j] += dp[0][j-1] }
    for i := 1; i < m; i++ { dp[i][0] += dp[i-1][0] }
    for i := 1; i < m; i++ {
        for j := 1; j < n; j++ {
            if dp[i-1][j] < dp[i][j-1] { dp[i][j] += dp[i-1][j] } else { dp[i][j] += dp[i][j-1] }
        }
    }
    return dp[m-1][n-1]
}
```

## Two-Sequence DP

**Shape:** Given two strings or sequences, define a state over both indices simultaneously. The most important subclass is string comparison/transformation.

**State:** `dp[i][j]` = answer considering the first `i` characters of `s1` and first `j` characters of `s2`

**Key insight:** When `s1[i-1] == s2[j-1]`, you get something for free. When they differ, you must make a choice (insert, delete, replace, skip).

### Edit Distance

Transform string `word1` into `word2` using minimum operations: insert, delete, or replace a character.

**State:** `dp[i][j]` = minimum operations to convert `word1[0..i-1]` to `word2[0..j-1]`

**Recurrence:**
- If `word1[i-1] == word2[j-1]`: `dp[i][j] = dp[i-1][j-1]` (no operation needed)
- Else: `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])`
  - `dp[i-1][j]`: delete from word1
  - `dp[i][j-1]`: insert into word1
  - `dp[i-1][j-1]`: replace

**Base cases:** `dp[i][0] = i` (delete all i chars), `dp[0][j] = j` (insert all j chars)

```cpp
int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (word1[i-1] == word2[j-1])
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = 1 + min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
    return dp[m][n];
}
```

```java
int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (word1.charAt(i-1) == word2.charAt(j-1))
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = 1 + Math.min(dp[i-1][j-1], Math.min(dp[i-1][j], dp[i][j-1]));
    return dp[m][n];
}
```

```typescript
function minDistance(word1: string, word2: string): number {
    const m = word1.length, n = word2.length;
    const dp = Array.from({length: m + 1}, (_, i) =>
        Array.from({length: n + 1}, (_, j) => i === 0 ? j : j === 0 ? i : 0));
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = word1[i-1] === word2[j-1]
                ? dp[i-1][j-1]
                : 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}
```

```python
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

```go
func minDistance(word1 string, word2 string) int {
    m, n := len(word1), len(word2)
    dp := make([][]int, m+1)
    for i := range dp {
        dp[i] = make([]int, n+1)
        dp[i][0] = i
    }
    for j := 0; j <= n; j++ { dp[0][j] = j }
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if word1[i-1] == word2[j-1] {
                dp[i][j] = dp[i-1][j-1]
            } else {
                dp[i][j] = 1 + min(min(dp[i-1][j], dp[i][j-1]), dp[i-1][j-1])
            }
        }
    }
    return dp[m][n]
}
```

## Interval DP

**Shape:** The state is a range `[i, j]`. You split the range at some midpoint `k` and combine results from both halves.

**Template:**
```
dp[i][j] = best over all k (i <= k < j) of (dp[i][k] + dp[k+1][j] + merge_cost)
```

**Evaluation order:** Must solve shorter intervals before longer ones. Outer loop: interval length. Inner loop: starting index.

### Burst Balloons

Given `n` balloons with values `nums[i]`. Bursting balloon `i` when its left neighbor is `l` and right neighbor is `r` gives `nums[l] * nums[i] * nums[r]` coins. Maximize total coins.

**Key insight:** Instead of thinking about which balloon to burst first, think about which to burst **last** in a range. This avoids the "shifting neighbors" problem.

**State:** `dp[i][j]` = maximum coins obtainable by bursting all balloons in the open interval `(i, j)` (exclusive bounds, so balloons `i` and `j` are not burst in this subproblem — they serve as boundaries)

**Recurrence:** For each `k` in `(i, j)` as the last balloon to burst:
```
dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j])
```

Pad `nums` with `1` on both ends to handle boundaries cleanly.

```cpp
int maxCoins(vector<int>& nums) {
    nums.insert(nums.begin(), 1);
    nums.push_back(1);
    int n = nums.size();
    vector<vector<int>> dp(n, vector<int>(n, 0));
    for (int len = 2; len < n; len++)
        for (int i = 0; i + len < n; i++) {
            int j = i + len;
            for (int k = i + 1; k < j; k++)
                dp[i][j] = max(dp[i][j],
                    dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j]);
        }
    return dp[0][n-1];
}
```

```java
int maxCoins(int[] numsOrig) {
    int[] nums = new int[numsOrig.length + 2];
    nums[0] = nums[nums.length - 1] = 1;
    for (int i = 0; i < numsOrig.length; i++) nums[i + 1] = numsOrig[i];
    int n = nums.length;
    int[][] dp = new int[n][n];
    for (int len = 2; len < n; len++)
        for (int i = 0; i + len < n; i++) {
            int j = i + len;
            for (int k = i + 1; k < j; k++)
                dp[i][j] = Math.max(dp[i][j],
                    dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j]);
        }
    return dp[0][n-1];
}
```

```typescript
function maxCoins(numsOrig: number[]): number {
    const nums = [1, ...numsOrig, 1];
    const n = nums.length;
    const dp = Array.from({length: n}, () => new Array(n).fill(0));
    for (let len = 2; len < n; len++)
        for (let i = 0; i + len < n; i++) {
            const j = i + len;
            for (let k = i + 1; k < j; k++)
                dp[i][j] = Math.max(dp[i][j],
                    dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j]);
        }
    return dp[0][n-1];
}
```

```python
def maxCoins(nums: list[int]) -> int:
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):
        for i in range(n - length):
            j = i + length
            for k in range(i + 1, j):
                dp[i][j] = max(dp[i][j],
                    dp[i][k] + dp[k][j] + nums[i] * nums[k] * nums[j])
    return dp[0][n-1]
```

```go
func maxCoins(numsOrig []int) int {
    nums := append([]int{1}, append(numsOrig, 1)...)
    n := len(nums)
    dp := make([][]int, n)
    for i := range dp { dp[i] = make([]int, n) }
    for length := 2; length < n; length++ {
        for i := 0; i+length < n; i++ {
            j := i + length
            for k := i + 1; k < j; k++ {
                val := dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]
                if val > dp[i][j] { dp[i][j] = val }
            }
        }
    }
    return dp[0][n-1]
}
```

## Complexity Summary

| Problem | Time | Space | Optimized Space |
|---|---|---|---|
| Unique Paths | O(mn) | O(mn) | O(n) |
| Minimum Path Sum | O(mn) | O(mn) | O(n) |
| Edit Distance | O(mn) | O(mn) | O(n) |
| Burst Balloons | O(n³) | O(n²) | — |

## Key Patterns and Insights

**Grid DP initialization:** The first row and first column are always base cases with only one transition source. Fill them first before the main nested loop.

**Two-sequence DP — the match/mismatch split:** Whenever you see two sequences, the recurrence almost always splits into "characters match" and "characters don't match" cases. Matching characters often inherit from the diagonal (`dp[i-1][j-1]`).

**Interval DP — loop over length, not index:** Always iterate with the outer loop over **interval length** and inner loop over **starting index**. This ensures shorter intervals are computed before the longer intervals that depend on them.

**Space optimization for 2D DP:** If `dp[i][j]` only depends on the previous row (`dp[i-1][...]`), roll the 2D table into a 1D array. Process one row at a time, overwriting in place. Left-to-right vs right-to-left depends on whether you need `dp[i][j-1]` (current row, already updated) or `dp[i-1][j-1]` (previous row, about to be overwritten).
