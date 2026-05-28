---
title: Regular Expression Matching
difficulty: Hard
tags: [Dynamic Programming, String, Recursion]
link: https://leetcode.com/problems/regular-expression-matching/
---

# Regular Expression Matching

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [10. Regular Expression Matching](https://leetcode.com/problems/regular-expression-matching/) |
| **Tags** | Dynamic Programming, String, Recursion |

## Problem Statement

Implement regular expression matching with support for `.` and `*`.

- `.` matches any single character
- `*` matches zero or more of the **preceding** element

The matching must cover the **entire** input string `s`.

**Example 1:** `s = "aa"`, `p = "a*"` → `true`

**Example 2:** `s = "ab"`, `p = ".*"` → `true`

**Example 3:** `s = "aab"`, `p = "c*a*b"` → `true` (c\* matches "", a\* matches "aa", b matches 'b')

## Intuition

Let `dp[i][j]` = true if `s[0..i-1]` matches `p[0..j-1]`.

**Case 1:** `p[j-1]` is a regular char or `.`:
`dp[i][j] = dp[i-1][j-1] && (s[i-1] == p[j-1] || p[j-1] == '.')`

**Case 2:** `p[j-1] == '*'` — look at `p[j-2]` as the repeated char:
- **Use 0 times:** `dp[i][j] = dp[i][j-2]`
- **Use 1+ times:** `dp[i][j] |= dp[i-1][j]` when `s[i-1]` matches `p[j-2]`

**Base cases:**
- `dp[0][0] = true` (empty matches empty)
- `dp[0][j] = dp[0][j-2]` when `p[j-1] == '*'` (pattern can match empty string)

## Approach 1: Brute Force Recursion

Recurse on suffix pairs — exponential without memoization.

```cpp
bool isMatch(string s, string p) {
    if (p.empty()) return s.empty();
    bool firstMatch = !s.empty() && (s[0] == p[0] || p[0] == '.');
    if (p.size() >= 2 && p[1] == '*') {
        return isMatch(s, p.substr(2)) ||
               (firstMatch && isMatch(s.substr(1), p));
    }
    return firstMatch && isMatch(s.substr(1), p.substr(1));
}
```

```java
boolean isMatch(String s, String p) {
    if (p.isEmpty()) return s.isEmpty();
    boolean firstMatch = !s.isEmpty() &&
        (s.charAt(0) == p.charAt(0) || p.charAt(0) == '.');
    if (p.length() >= 2 && p.charAt(1) == '*') {
        return isMatch(s, p.substring(2)) ||
               (firstMatch && isMatch(s.substring(1), p));
    }
    return firstMatch && isMatch(s.substring(1), p.substring(1));
}
```

```typescript
function isMatch(s: string, p: string): boolean {
    if (!p) return !s;
    const firstMatch = s.length > 0 && (s[0] === p[0] || p[0] === '.');
    if (p.length >= 2 && p[1] === '*') {
        return isMatch(s, p.slice(2)) || (firstMatch && isMatch(s.slice(1), p));
    }
    return firstMatch && isMatch(s.slice(1), p.slice(1));
}
```

```python
def isMatch(s: str, p: str) -> bool:
    if not p: return not s
    first_match = bool(s) and p[0] in {s[0], '.'}
    if len(p) >= 2 and p[1] == '*':
        return isMatch(s, p[2:]) or (first_match and isMatch(s[1:], p))
    return first_match and isMatch(s[1:], p[1:])
```

```go
func isMatch(s string, p string) bool {
    if len(p) == 0 { return len(s) == 0 }
    firstMatch := len(s) > 0 && (s[0] == p[0] || p[0] == '.')
    if len(p) >= 2 && p[1] == '*' {
        return isMatch(s, p[2:]) || (firstMatch && isMatch(s[1:], p))
    }
    return firstMatch && isMatch(s[1:], p[1:])
}
```

**Time:** O(2^(m+n)) — **Space:** O(m+n) stack

## Approach 2: Top-Down DP (Memoization)

Cache results at each `(i, j)` pair to avoid redundant computation.

```cpp
class Solution {
    vector<vector<int>> memo;
    string s, p;
    bool dp(int i, int j) {
        if (memo[i][j] != -1) return memo[i][j];
        if (j == (int)p.size()) return memo[i][j] = (i == (int)s.size());
        bool firstMatch = i < (int)s.size() && (s[i] == p[j] || p[j] == '.');
        bool res;
        if (j + 1 < (int)p.size() && p[j+1] == '*') {
            res = dp(i, j + 2) || (firstMatch && dp(i + 1, j));
        } else {
            res = firstMatch && dp(i + 1, j + 1);
        }
        return memo[i][j] = res;
    }
public:
    bool isMatch(string s, string p) {
        this->s = s; this->p = p;
        int m = s.size(), n = p.size();
        memo.assign(m + 1, vector<int>(n + 1, -1));
        return dp(0, 0);
    }
};
```

```java
class Solution {
    private Boolean[][] memo;
    private String str, pat;
    private boolean dp(int i, int j) {
        if (memo[i][j] != null) return memo[i][j];
        if (j == pat.length()) return memo[i][j] = (i == str.length());
        boolean firstMatch = i < str.length() &&
            (str.charAt(i) == pat.charAt(j) || pat.charAt(j) == '.');
        boolean res;
        if (j + 1 < pat.length() && pat.charAt(j + 1) == '*') {
            res = dp(i, j + 2) || (firstMatch && dp(i + 1, j));
        } else {
            res = firstMatch && dp(i + 1, j + 1);
        }
        return memo[i][j] = res;
    }
    public boolean isMatch(String s, String p) {
        str = s; pat = p;
        memo = new Boolean[s.length() + 1][p.length() + 1];
        return dp(0, 0);
    }
}
```

```typescript
function isMatch(s: string, p: string): boolean {
    const memo = new Map<string, boolean>();
    function dp(i: number, j: number): boolean {
        const key = i + "," + j;
        if (memo.has(key)) return memo.get(key)!;
        if (j === p.length) return i === s.length;
        const firstMatch = i < s.length && (s[i] === p[j] || p[j] === '.');
        let res: boolean;
        if (j + 1 < p.length && p[j + 1] === '*') {
            res = dp(i, j + 2) || (firstMatch && dp(i + 1, j));
        } else {
            res = firstMatch && dp(i + 1, j + 1);
        }
        memo.set(key, res);
        return res;
    }
    return dp(0, 0);
}
```

```python
def isMatch(s: str, p: str) -> bool:
    from functools import lru_cache

    @lru_cache(maxsize=None)
    def dp(i: int, j: int) -> bool:
        if j == len(p): return i == len(s)
        first_match = i < len(s) and p[j] in {s[i], '.'}
        if j + 1 < len(p) and p[j + 1] == '*':
            return dp(i, j + 2) or (first_match and dp(i + 1, j))
        return first_match and dp(i + 1, j + 1)

    return dp(0, 0)
```

```go
func isMatch(s string, p string) bool {
    m, n := len(s), len(p)
    memo := make([][]int8, m+1)
    for i := range memo { memo[i] = make([]int8, n+1) }
    var dp func(i, j int) bool
    dp = func(i, j int) bool {
        if memo[i][j] != 0 { return memo[i][j] == 1 }
        var res bool
        if j == n {
            res = i == m
        } else {
            firstMatch := i < m && (s[i] == p[j] || p[j] == '.')
            if j+1 < n && p[j+1] == '*' {
                res = dp(i, j+2) || (firstMatch && dp(i+1, j))
            } else {
                res = firstMatch && dp(i+1, j+1)
            }
        }
        if res { memo[i][j] = 1 } else { memo[i][j] = -1 }
        return res
    }
    return dp(0, 0)
}
```

**Time:** O(m×n) — **Space:** O(m×n)

## Approach 3: Bottom-Up DP (Optimal)

Build the `(m+1) × (n+1)` table iteratively.

```cpp
bool isMatch(string s, string p) {
    int m = s.size(), n = p.size();
    vector<vector<bool>> dp(m+1, vector<bool>(n+1, false));
    dp[0][0] = true;
    for (int j = 2; j <= n; j++)
        if (p[j-1] == '*') dp[0][j] = dp[0][j-2];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p[j-1] == '*') {
                dp[i][j] = dp[i][j-2];
                if (s[i-1] == p[j-2] || p[j-2] == '.')
                    dp[i][j] = dp[i][j] || dp[i-1][j];
            } else if (s[i-1] == p[j-1] || p[j-1] == '.') {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    return dp[m][n];
}
```

```java
public boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m+1][n+1];
    dp[0][0] = true;
    for (int j = 2; j <= n; j++)
        if (p.charAt(j-1) == '*') dp[0][j] = dp[0][j-2];
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j-1) == '*') {
                dp[i][j] = dp[i][j-2];
                if (s.charAt(i-1) == p.charAt(j-2) || p.charAt(j-2) == '.')
                    dp[i][j] |= dp[i-1][j];
            } else if (s.charAt(i-1) == p.charAt(j-1) || p.charAt(j-1) == '.') {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    return dp[m][n];
}
```

```typescript
function isMatch(s: string, p: string): boolean {
    const m = s.length, n = p.length;
    const dp = Array.from({ length: m+1 }, () => new Array(n+1).fill(false));
    dp[0][0] = true;
    for (let j = 2; j <= n; j++)
        if (p[j-1] === '*') dp[0][j] = dp[0][j-2];
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j-1] === '*') {
                dp[i][j] = dp[i][j-2];
                if (s[i-1] === p[j-2] || p[j-2] === '.')
                    dp[i][j] = dp[i][j] || dp[i-1][j];
            } else if (s[i-1] === p[j-1] || p[j-1] === '.') {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    return dp[m][n];
}
```

```python
def isMatch(s: str, p: str) -> bool:
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    for j in range(2, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-2]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                dp[i][j] = dp[i][j-2]
                if p[j-2] in {s[i-1], '.'}:
                    dp[i][j] = dp[i][j] or dp[i-1][j]
            elif p[j-1] in {s[i-1], '.'}:
                dp[i][j] = dp[i-1][j-1]
    return dp[m][n]
```

```go
func isMatch(s string, p string) bool {
    m, n := len(s), len(p)
    dp := make([][]bool, m+1)
    for i := range dp { dp[i] = make([]bool, n+1) }
    dp[0][0] = true
    for j := 2; j <= n; j++ {
        if p[j-1] == '*' { dp[0][j] = dp[0][j-2] }
    }
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if p[j-1] == '*' {
                dp[i][j] = dp[i][j-2]
                if p[j-2] == s[i-1] || p[j-2] == '.' {
                    dp[i][j] = dp[i][j] || dp[i-1][j]
                }
            } else if p[j-1] == s[i-1] || p[j-1] == '.' {
                dp[i][j] = dp[i-1][j-1]
            }
        }
    }
    return dp[m][n]
}
```

**Time:** O(m×n) — **Space:** O(m×n)

## Dry Run

`s = "aab"`, `p = "c*a*b"` (m=3, n=5)

|   | 0 | 1(c) | 2(c\*) | 3(a) | 4(a\*) | 5(b) |
|---|---|---|---|---|---|---|
| 0 | T | F | T | F | T | F |
| 1(a) | F | F | F | T | T | F |
| 2(a) | F | F | F | F | T | F |
| 3(b) | F | F | F | F | F | **T** |

`dp[3][5] = true` — Answer: **true** ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(2^(m+n)) | O(m+n) |
| Memoized top-down | O(m×n) | O(m×n) |
| Bottom-up DP | O(m×n) | O(m×n) |

## Key Interview Insights

**The `*` always pairs with the preceding character.** `p[j-1]='*'` means handle `p[j-2]` and `p[j-1]` together. Two sub-cases:
1. Use `p[j-2]*` zero times — look at `dp[i][j-2]`
2. Use `p[j-2]*` one or more times — current char must match `p[j-2]`, carry `dp[i-1][j]`

**Base case initialization for empty string:** Patterns matching `""` follow the form `x*y*z*...`. Iterate `j` from 2 by 2 and propagate `dp[0][j] = dp[0][j-2]` only when `p[j-1] == '*'`.

**Wildcard Matching (LC 44)** uses `*` as a standalone wildcard (matches any sequence). The `*` case simplifies to: `dp[i][j] = dp[i-1][j] || dp[i][j-1]` — consume one char from s, or extend previous match.

**The brute force recursion is elegant and interview-ready.** Start with the recursive solution, memoize naturally, then derive the bottom-up table. The recursive call structure maps directly to DP table dependencies.
