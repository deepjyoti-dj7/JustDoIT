---
title: Edit Distance
difficulty: Hard
tags: [Dynamic Programming, String]
link: https://leetcode.com/problems/edit-distance/
---

# Edit Distance

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [72. Edit Distance](https://leetcode.com/problems/edit-distance/) |
| **Tags** | Dynamic Programming, String |

## Problem Statement

Given two strings `word1` and `word2`, return the **minimum number of operations** required to convert `word1` to `word2`.

Allowed operations (each costs 1):
- **Insert** a character
- **Delete** a character
- **Replace** a character

**Example:** `word1 = "horse"`, `word2 = "ros"` → `3`
- horse → rorse (replace 'h' with 'r')
- rorse → rose (delete 'r')
- rose → ros (delete 'e')

## Intuition

Let `dp[i][j]` = minimum edit distance between `word1[0..i-1]` and `word2[0..j-1]`.

**Case 1: Characters match** `word1[i-1] == word2[j-1]`:
`dp[i][j] = dp[i-1][j-1]` — no operation needed, carry forward.

**Case 2: Characters differ**:
`dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])`
- `dp[i-1][j-1]` → replace character
- `dp[i-1][j]` → delete from `word1` (or insert into `word2`)
- `dp[i][j-1]` → insert into `word1` (or delete from `word2`)

**Base cases:**
- `dp[0][j] = j` — converting empty string to `word2[0..j-1]` requires `j` inserts
- `dp[i][0] = i` — converting `word1[0..i-1]` to empty requires `i` deletes

## Approach 1: Brute Force Recursion

Recurse on suffix pairs — exponential without memoization.

```cpp
int minDistance(string w1, string w2) {
    function<int(int, int)> dfs = [&](int i, int j) -> int {
        if (i == 0) return j;
        if (j == 0) return i;
        if (w1[i-1] == w2[j-1]) return dfs(i-1, j-1);
        return 1 + min({dfs(i-1, j-1), dfs(i-1, j), dfs(i, j-1)});
    };
    return dfs(w1.size(), w2.size());
}
```

```java
int minDistance(String w1, String w2) {
    return dfs(w1, w2, w1.length(), w2.length());
}
int dfs(String w1, String w2, int i, int j) {
    if (i == 0) return j;
    if (j == 0) return i;
    if (w1.charAt(i-1) == w2.charAt(j-1)) return dfs(w1, w2, i-1, j-1);
    return 1 + Math.min(dfs(w1, w2, i-1, j-1),
               Math.min(dfs(w1, w2, i-1, j), dfs(w1, w2, i, j-1)));
}
```

```typescript
function minDistance(w1: string, w2: string): number {
    function dfs(i: number, j: number): number {
        if (i === 0) return j;
        if (j === 0) return i;
        if (w1[i-1] === w2[j-1]) return dfs(i-1, j-1);
        return 1 + Math.min(dfs(i-1, j-1), dfs(i-1, j), dfs(i, j-1));
    }
    return dfs(w1.length, w2.length);
}
```

```python
def minDistance(word1: str, word2: str) -> int:
    def dfs(i: int, j: int) -> int:
        if i == 0: return j
        if j == 0: return i
        if word1[i-1] == word2[j-1]: return dfs(i-1, j-1)
        return 1 + min(dfs(i-1, j-1), dfs(i-1, j), dfs(i, j-1))
    return dfs(len(word1), len(word2))
```

```go
func minDistance(word1 string, word2 string) int {
    var dfs func(i, j int) int
    dfs = func(i, j int) int {
        if i == 0 { return j }
        if j == 0 { return i }
        if word1[i-1] == word2[j-1] { return dfs(i-1, j-1) }
        a, b, c := dfs(i-1, j-1), dfs(i-1, j), dfs(i, j-1)
        if a <= b && a <= c { return 1 + a }
        if b <= c { return 1 + b }
        return 1 + c
    }
    return dfs(len(word1), len(word2))
}
```

**Time:** O(3^(m+n)) — **Space:** O(m+n) stack

## Approach 2: 2D DP (Standard)

Fill the `(m+1) × (n+1)` table bottom-up.

```cpp
int minDistance(string w1, string w2) {
    int m = w1.size(), n = w2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (w1[i-1] == w2[j-1]) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = 1 + min({dp[i-1][j-1], dp[i-1][j], dp[i][j-1]});
        }
    }
    return dp[m][n];
}
```

```java
public int minDistance(String w1, String w2) {
    int m = w1.length(), n = w2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (w1.charAt(i-1) == w2.charAt(j-1)) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = 1 + Math.min(dp[i-1][j-1],
                                 Math.min(dp[i-1][j], dp[i][j-1]));
        }
    }
    return dp[m][n];
}
```

```typescript
function minDistance(w1: string, w2: string): number {
    const m = w1.length, n = w2.length;
    const dp = Array.from({ length: m+1 }, (_, i) =>
        new Array(n+1).fill(0).map((_, j) => i === 0 ? j : j === 0 ? i : 0)
    );
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (w1[i-1] === w2[j-1]) dp[i][j] = dp[i-1][j-1];
            else dp[i][j] = 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);
        }
    }
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
                dp[i][j] = 1 + min(dp[i-1][j-1], min(dp[i-1][j], dp[i][j-1]))
            }
        }
    }
    return dp[m][n]
}
```

**Time:** O(m×n) — **Space:** O(m×n)

## Approach 3: Space-Optimized 1D DP (Optimal)

Only the current and previous row are needed. Use a 1D array with a `prev` variable for the diagonal.

```cpp
int minDistance(string w1, string w2) {
    int m = w1.size(), n = w2.size();
    vector<int> dp(n + 1);
    for (int j = 0; j <= n; j++) dp[j] = j;
    for (int i = 1; i <= m; i++) {
        int prev = dp[0];
        dp[0] = i;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (w1[i-1] == w2[j-1]) dp[j] = prev;
            else dp[j] = 1 + min({prev, dp[j], dp[j-1]});
            prev = temp;
        }
    }
    return dp[n];
}
```

```java
public int minDistance(String w1, String w2) {
    int m = w1.length(), n = w2.length();
    int[] dp = new int[n + 1];
    for (int j = 0; j <= n; j++) dp[j] = j;
    for (int i = 1; i <= m; i++) {
        int prev = dp[0];
        dp[0] = i;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (w1.charAt(i-1) == w2.charAt(j-1)) dp[j] = prev;
            else dp[j] = 1 + Math.min(prev, Math.min(dp[j], dp[j-1]));
            prev = temp;
        }
    }
    return dp[n];
}
```

```typescript
function minDistance(w1: string, w2: string): number {
    const m = w1.length, n = w2.length;
    const dp = Array.from({ length: n+1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
        let prev = dp[0];
        dp[0] = i;
        for (let j = 1; j <= n; j++) {
            const temp = dp[j];
            if (w1[i-1] === w2[j-1]) dp[j] = prev;
            else dp[j] = 1 + Math.min(prev, dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

```python
def minDistance(word1: str, word2: str) -> int:
    m, n = len(word1), len(word2)
    dp = list(range(n + 1))
    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            temp = dp[j]
            if word1[i-1] == word2[j-1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(prev, dp[j], dp[j-1])
            prev = temp
    return dp[n]
```

```go
func minDistance(word1 string, word2 string) int {
    m, n := len(word1), len(word2)
    dp := make([]int, n+1)
    for j := range dp { dp[j] = j }
    for i := 1; i <= m; i++ {
        prev := dp[0]
        dp[0] = i
        for j := 1; j <= n; j++ {
            temp := dp[j]
            if word1[i-1] == word2[j-1] {
                dp[j] = prev
            } else {
                dp[j] = 1 + min(prev, min(dp[j], dp[j-1]))
            }
            prev = temp
        }
    }
    return dp[n]
}
```

**Time:** O(m×n) — **Space:** O(min(m,n))

## Dry Run

`word1 = "horse"`, `word2 = "ros"`

DP table (rows = horse+empty, cols = ros+empty):

|   | "" | r | o | s |
|---|---|---|---|---|
| "" | 0 | 1 | 2 | 3 |
| h | 1 | 1 | 2 | 3 |
| o | 2 | 2 | 1 | 2 |
| r | 3 | 2 | 2 | 2 |
| s | 4 | 3 | 3 | 2 |
| e | 5 | 4 | 4 | 3 |

`dp[5][3] = 3` ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(3^(m+n)) | O(m+n) |
| 2D DP | O(m×n) | O(m×n) |
| 1D rolling DP | O(m×n) | O(min(m,n)) |

## Key Interview Insights

**Three operations, three neighbors in the DP table:**
- Replace → diagonal neighbor `dp[i-1][j-1]`
- Delete from w1 → row above `dp[i-1][j]`
- Insert into w1 → left neighbor `dp[i][j-1]`

Memorizing which operation maps to which cell is the key to this problem.

**Weighted variant:** If insert/delete/replace have different costs, just change the `1 +` to the respective cost. The structure is identical.

**Reconstructing the edit sequence:** Backtrack through the 2D table. When `dp[i][j] == dp[i-1][j-1]` and characters match, no op. Otherwise compare to find the minimum and record the operation (replace, delete, insert).

**Applications:** Git diff, spell checkers, DNA sequence alignment (Needleman-Wunsch algorithm), natural language processing. This is one of the most practically applied DP problems.
