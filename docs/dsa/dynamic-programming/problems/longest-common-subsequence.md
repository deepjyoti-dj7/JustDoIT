---
title: Longest Common Subsequence
difficulty: Medium
tags: [Dynamic Programming, String]
link: https://leetcode.com/problems/longest-common-subsequence/
---

# Longest Common Subsequence

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) |
| **Tags** | Dynamic Programming, String |

## Problem Statement

Given two strings `text1` and `text2`, return the length of their **longest common subsequence** (LCS). If there is no common subsequence, return `0`.

A subsequence is a sequence derived from a string by deleting some characters (possibly none) without changing the order of the remaining characters.

**Example:** `text1 = "abcde"`, `text2 = "ace"` → `3` (LCS is `"ace"`)
**Example:** `text1 = "abc"`, `text2 = "abc"` → `3`
**Example:** `text1 = "abc"`, `text2 = "def"` → `0`

## Intuition

Let `dp[i][j]` = LCS length of `text1[0..i-1]` and `text2[0..j-1]`.

Two cases at each `(i, j)`:
1. **Characters match** (`text1[i-1] == text2[j-1]`): `dp[i][j] = dp[i-1][j-1] + 1`
2. **Characters don't match**: `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

Base cases: `dp[0][*] = 0` and `dp[*][0] = 0` — empty string has 0 LCS with anything.

This is one of the most fundamental 2D DP patterns — foundational for diff algorithms, DNA alignment, edit distance, etc.

## Approach 1: Brute Force (Recursion)

Recursively try all possibilities — exponential.

```cpp
int longestCommonSubsequence(string t1, string t2) {
    function<int(int, int)> dfs = [&](int i, int j) -> int {
        if (i == 0 || j == 0) return 0;
        if (t1[i-1] == t2[j-1]) return dfs(i-1, j-1) + 1;
        return max(dfs(i-1, j), dfs(i, j-1));
    };
    return dfs(t1.size(), t2.size());
}
```

```java
int longestCommonSubsequence(String t1, String t2) {
    return dfs(t1, t2, t1.length(), t2.length());
}
int dfs(String t1, String t2, int i, int j) {
    if (i == 0 || j == 0) return 0;
    if (t1.charAt(i-1) == t2.charAt(j-1)) return dfs(t1, t2, i-1, j-1) + 1;
    return Math.max(dfs(t1, t2, i-1, j), dfs(t1, t2, i, j-1));
}
```

```typescript
function longestCommonSubsequence(t1: string, t2: string): number {
    function dfs(i: number, j: number): number {
        if (i === 0 || j === 0) return 0;
        if (t1[i-1] === t2[j-1]) return dfs(i-1, j-1) + 1;
        return Math.max(dfs(i-1, j), dfs(i, j-1));
    }
    return dfs(t1.length, t2.length);
}
```

```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    def dfs(i: int, j: int) -> int:
        if i == 0 or j == 0: return 0
        if text1[i-1] == text2[j-1]: return dfs(i-1, j-1) + 1
        return max(dfs(i-1, j), dfs(i, j-1))
    return dfs(len(text1), len(text2))
```

```go
func longestCommonSubsequence(t1 string, t2 string) int {
    var dfs func(i, j int) int
    dfs = func(i, j int) int {
        if i == 0 || j == 0 { return 0 }
        if t1[i-1] == t2[j-1] { return dfs(i-1, j-1) + 1 }
        return max(dfs(i-1, j), dfs(i, j-1))
    }
    return dfs(len(t1), len(t2))
}
```

**Time:** O(2^(m+n)) — **Space:** O(m+n) stack

## Approach 2: 2D DP (Standard)

Fill the DP table bottom-up.

```cpp
int longestCommonSubsequence(string t1, string t2) {
    int m = t1.size(), n = t2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (t1[i-1] == t2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}
```

```java
public int longestCommonSubsequence(String t1, String t2) {
    int m = t1.length(), n = t2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (t1.charAt(i-1) == t2.charAt(j-1))
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}
```

```typescript
function longestCommonSubsequence(t1: string, t2: string): number {
    const m = t1.length, n = t2.length;
    const dp = Array.from({ length: m+1 }, () => new Array(n+1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (t1[i-1] === t2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
            else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        }
    }
    return dp[m][n];
}
```

```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

```go
func longestCommonSubsequence(t1 string, t2 string) int {
    m, n := len(t1), len(t2)
    dp := make([][]int, m+1)
    for i := range dp { dp[i] = make([]int, n+1) }
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if t1[i-1] == t2[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1
            } else if dp[i-1][j] > dp[i][j-1] {
                dp[i][j] = dp[i-1][j]
            } else {
                dp[i][j] = dp[i][j-1]
            }
        }
    }
    return dp[m][n]
}
```

**Time:** O(m×n) — **Space:** O(m×n)

## Approach 3: Space-Optimized 1D DP (Optimal)

Each row only uses the previous row. Use a 1D `dp` array with a `prev` variable for the diagonal.

```cpp
int longestCommonSubsequence(string t1, string t2) {
    int m = t1.size(), n = t2.size();
    vector<int> dp(n + 1, 0);
    for (int i = 1; i <= m; i++) {
        int prev = 0;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (t1[i-1] == t2[j-1]) dp[j] = prev + 1;
            else dp[j] = max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

```java
public int longestCommonSubsequence(String t1, String t2) {
    int m = t1.length(), n = t2.length();
    int[] dp = new int[n + 1];
    for (int i = 1; i <= m; i++) {
        int prev = 0;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (t1.charAt(i-1) == t2.charAt(j-1))
                dp[j] = prev + 1;
            else
                dp[j] = Math.max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

```typescript
function longestCommonSubsequence(t1: string, t2: string): number {
    const m = t1.length, n = t2.length;
    const dp = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
        let prev = 0;
        for (let j = 1; j <= n; j++) {
            const temp = dp[j];
            if (t1[i-1] === t2[j-1]) dp[j] = prev + 1;
            else dp[j] = Math.max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

```python
def longestCommonSubsequence(text1: str, text2: str) -> int:
    m, n = len(text1), len(text2)
    dp = [0] * (n + 1)
    for i in range(1, m + 1):
        prev = 0
        for j in range(1, n + 1):
            temp = dp[j]
            if text1[i-1] == text2[j-1]:
                dp[j] = prev + 1
            else:
                dp[j] = max(dp[j], dp[j-1])
            prev = temp
    return dp[n]
```

```go
func longestCommonSubsequence(t1 string, t2 string) int {
    m, n := len(t1), len(t2)
    dp := make([]int, n+1)
    for i := 1; i <= m; i++ {
        prev := 0
        for j := 1; j <= n; j++ {
            temp := dp[j]
            if t1[i-1] == t2[j-1] {
                dp[j] = prev + 1
            } else if dp[j] < dp[j-1] {
                dp[j] = dp[j-1]
            }
            prev = temp
        }
    }
    return dp[n]
}
```

**Time:** O(m×n) — **Space:** O(min(m,n))

## Dry Run

`text1 = "abcde"`, `text2 = "ace"`

|   | "" | a | c | e |
|---|---|---|---|---|
| "" | 0 | 0 | 0 | 0 |
| a | 0 | **1** | 1 | 1 |
| b | 0 | 1 | 1 | 1 |
| c | 0 | 1 | **2** | 2 |
| d | 0 | 1 | 2 | 2 |
| e | 0 | 1 | 2 | **3** |

LCS length = **3** ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(2^(m+n)) | O(m+n) |
| 2D DP | O(m×n) | O(m×n) |
| 1D rolling DP | O(m×n) | O(min(m,n)) |

## Key Interview Insights

**LCS is the foundation of many problems.** Edit Distance, Shortest Common Supersequence, Delete Operation for Two Strings (LC 583), and Minimum ASCII Delete Sum (LC 712) all reduce to LCS.

**Reconstructing the actual LCS:** Backtrack through the 2D DP table. Start at `dp[m][n]`. If characters match, go diagonal. Otherwise go in the direction of the larger neighbor (up or left). The characters taken diagonally form the LCS.

**LCS vs. Longest Common Substring:** LCS allows skipping characters (subsequence). LCS-substring requires contiguous characters. For the substring version, `dp[i][j]` resets to 0 when characters don't match, and you track the maximum seen.

**Space optimization `prev` trick:** In the 1D version, `prev` stores `dp[i-1][j-1]` (the diagonal value before overwriting). This replaces the second row entirely and is an important pattern to know.
