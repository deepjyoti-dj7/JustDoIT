---
title: Unique Paths
difficulty: Medium
tags: [Dynamic Programming, Math, Combinatorics]
link: https://leetcode.com/problems/unique-paths/
---

# Unique Paths

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [62. Unique Paths](https://leetcode.com/problems/unique-paths/) |
| **Tags** | Dynamic Programming, Math, Combinatorics |

## Problem Statement

A robot is on an `m × n` grid, starting at the top-left corner `(0,0)`. It can only move **right** or **down** at each step. How many unique paths are there to reach the bottom-right corner `(m-1, n-1)`?

## Intuition

To reach cell `(i, j)`, the robot must have come from either `(i-1, j)` (moved down) or `(i, j-1)` (moved right). So:

```
dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

Base cases: the entire first row and first column have exactly **1** path each (only one way to reach any cell on the top row or leftmost column).

This is a classic 2D grid DP. The structure is very clean — no choices, just accumulation.

## Approach 1: Brute Force (Recursion)

Recurse from `(m-1, n-1)` back to `(0, 0)`. Exponential without memoization.

```cpp
int uniquePaths(int m, int n) {
    if (m == 1 || n == 1) return 1;
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
}
```

```java
int uniquePaths(int m, int n) {
    if (m == 1 || n == 1) return 1;
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
}
```

```typescript
function uniquePaths(m: number, n: number): number {
    if (m === 1 || n === 1) return 1;
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1);
}
```

```python
def uniquePaths(m: int, n: int) -> int:
    if m == 1 or n == 1: return 1
    return uniquePaths(m - 1, n) + uniquePaths(m, n - 1)
```

```go
func uniquePaths(m int, n int) int {
    if m == 1 || n == 1 { return 1 }
    return uniquePaths(m-1, n) + uniquePaths(m, n-1)
}
```

**Time:** O(2^(m+n)) — **Space:** O(m+n) stack

## Approach 2: 2D DP

Build a full grid table. `dp[i][j]` = number of paths from `(0,0)` to `(i,j)`.

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
public int uniquePaths(int m, int n) {
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
    const dp = Array.from({ length: m }, () => new Array(n).fill(1));
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
func uniquePaths(m int, n int) int {
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

**Time:** O(m×n) — **Space:** O(m×n)

## Approach 3: 1D Rolling Array DP (Optimal)

Each row only depends on the row above. Compress to a single 1D array.

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
public int uniquePaths(int m, int n) {
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
func uniquePaths(m int, n int) int {
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

**Time:** O(m×n) — **Space:** O(n)

## Math Approach: Combinatorics O(1)

The robot must make exactly `(m-1)` down moves and `(n-1)` right moves, in any order. Total moves = `m+n-2`. The answer is C(m+n-2, m-1).

`uniquePaths(m, n) = C(m+n-2, min(m-1, n-1))`

Useful for competitive programming but typically not expected in interviews unless you recognize the pattern.

## Dry Run

`m=3, n=3`

Grid DP:
```
1  1  1
1  2  3
1  3  6
```

Answer: **6**

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(2^(m+n)) | O(m+n) |
| 2D DP | O(m×n) | O(m×n) |
| 1D rolling DP | O(m×n) | O(n) |
| Combinatorics | O(min(m,n)) | O(1) |

## Key Interview Insights

**The rolling array optimization** reduces 2D DP to 1D for problems where each row only depends on the row above. This pattern appears repeatedly in 2D DP problems (Min Path Sum, edit distance, LCS, etc.).

**Unique Paths II** adds obstacles: if `grid[i][j] == 1`, set `dp[i][j] = 0`. The core recurrence stays the same.

**3D extension:** "A robot on a 3D grid can move right, down, or forward." Add a third dimension: `dp[x][y][z] = dp[x-1][y][z] + dp[x][y-1][z] + dp[x][y][z-1]`.

**Corner case:** The grid is 1-row or 1-column. The correct answer is 1 (only one path exists — always go right, or always go down). Make sure your base cases handle this.
