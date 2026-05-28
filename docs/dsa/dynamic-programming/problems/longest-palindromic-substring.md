---
title: Longest Palindromic Substring
difficulty: Medium
tags: [Dynamic Programming, String, Two Pointers]
link: https://leetcode.com/problems/longest-palindromic-substring/
---

# Longest Palindromic Substring

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [5. Longest Palindromic Substring](https://leetcode.com/problems/longest-palindromic-substring/) |
| **Tags** | Dynamic Programming, String, Two Pointers |

## Problem Statement

Given a string `s`, return the **longest palindromic substring** of `s`.

**Example:** `s = "babad"` → `"bab"` or `"aba"` (both valid)
**Example:** `s = "cbbd"` → `"bb"`

## Intuition

A substring `s[l..r]` is a palindrome if:
1. `s[l] == s[r]`, and
2. `s[l+1..r-1]` is also a palindrome.

**Expand Around Center:** A palindrome has a center — either a single character (odd length) or gap between two characters (even length). Expand outward from each center while characters match. Total centers = `2n - 1`. This gives O(n²) time and O(1) space — optimal for interview purposes.

**2D DP:** `dp[l][r]` = true if `s[l..r]` is a palindrome. Fill diagonally by substring length. O(n²) time, O(n²) space.

## Approach 1: Brute Force

Check all O(n²) substrings for palindrome in O(n) each.

```cpp
string longestPalindrome(string s) {
    int n = s.size(), start = 0, maxLen = 1;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            string sub = s.substr(i, j - i + 1);
            string rev = sub;
            reverse(rev.begin(), rev.end());
            if (sub == rev && j - i + 1 > maxLen) {
                maxLen = j - i + 1;
                start = i;
            }
        }
    }
    return s.substr(start, maxLen);
}
```

```java
public String longestPalindrome(String s) {
    int n = s.length(), start = 0, maxLen = 1;
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            String sub = s.substring(i, j + 1);
            String rev = new StringBuilder(sub).reverse().toString();
            if (sub.equals(rev) && j - i + 1 > maxLen) {
                maxLen = j - i + 1;
                start = i;
            }
        }
    }
    return s.substring(start, start + maxLen);
}
```

```typescript
function longestPalindrome(s: string): string {
    const n = s.length;
    let start = 0, maxLen = 1;
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            const sub = s.slice(i, j + 1);
            if (sub === sub.split('').reverse().join('') && j - i + 1 > maxLen) {
                maxLen = j - i + 1;
                start = i;
            }
        }
    }
    return s.slice(start, start + maxLen);
}
```

```python
def longestPalindrome(s: str) -> str:
    start, max_len = 0, 1
    for i in range(len(s)):
        for j in range(i, len(s)):
            sub = s[i:j+1]
            if sub == sub[::-1] and len(sub) > max_len:
                max_len = len(sub)
                start = i
    return s[start:start + max_len]
```

```go
func longestPalindrome(s string) string {
    n := len(s)
    start, maxLen := 0, 1
    for i := 0; i < n; i++ {
        for j := i; j < n; j++ {
            sub := s[i : j+1]
            runes := []rune(sub)
            isPalin := true
            for l, r := 0, len(runes)-1; l < r; l, r = l+1, r-1 {
                if runes[l] != runes[r] { isPalin = false; break }
            }
            if isPalin && j-i+1 > maxLen { maxLen = j - i + 1; start = i }
        }
    }
    return s[start : start+maxLen]
}
```

**Time:** O(n³) — **Space:** O(n)

## Approach 2: 2D DP

`dp[l][r]` = palindrome from index `l` to `r`.

```cpp
string longestPalindrome(string s) {
    int n = s.size(), start = 0, maxLen = 1;
    vector<vector<bool>> dp(n, vector<bool>(n, false));
    for (int i = 0; i < n; i++) dp[i][i] = true;
    for (int len = 2; len <= n; len++) {
        for (int l = 0; l + len - 1 < n; l++) {
            int r = l + len - 1;
            if (s[l] == s[r] && (len == 2 || dp[l+1][r-1])) {
                dp[l][r] = true;
                if (len > maxLen) { maxLen = len; start = l; }
            }
        }
    }
    return s.substr(start, maxLen);
}
```

```java
public String longestPalindrome(String s) {
    int n = s.length(), start = 0, maxLen = 1;
    boolean[][] dp = new boolean[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = true;
    for (int len = 2; len <= n; len++) {
        for (int l = 0; l + len - 1 < n; l++) {
            int r = l + len - 1;
            if (s.charAt(l) == s.charAt(r) && (len == 2 || dp[l+1][r-1])) {
                dp[l][r] = true;
                if (len > maxLen) { maxLen = len; start = l; }
            }
        }
    }
    return s.substring(start, start + maxLen);
}
```

```typescript
function longestPalindrome(s: string): string {
    const n = s.length;
    let start = 0, maxLen = 1;
    const dp = Array.from({ length: n }, () => new Array(n).fill(false));
    for (let i = 0; i < n; i++) dp[i][i] = true;
    for (let len = 2; len <= n; len++) {
        for (let l = 0; l + len - 1 < n; l++) {
            const r = l + len - 1;
            if (s[l] === s[r] && (len === 2 || dp[l+1][r-1])) {
                dp[l][r] = true;
                if (len > maxLen) { maxLen = len; start = l; }
            }
        }
    }
    return s.slice(start, start + maxLen);
}
```

```python
def longestPalindrome(s: str) -> str:
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    start, max_len = 0, 1
    for i in range(n): dp[i][i] = True
    for length in range(2, n + 1):
        for l in range(n - length + 1):
            r = l + length - 1
            if s[l] == s[r] and (length == 2 or dp[l+1][r-1]):
                dp[l][r] = True
                if length > max_len:
                    max_len = length
                    start = l
    return s[start:start + max_len]
```

```go
func longestPalindrome(s string) string {
    n := len(s)
    dp := make([][]bool, n)
    for i := range dp { dp[i] = make([]bool, n); dp[i][i] = true }
    start, maxLen := 0, 1
    for length := 2; length <= n; length++ {
        for l := 0; l+length-1 < n; l++ {
            r := l + length - 1
            if s[l] == s[r] && (length == 2 || dp[l+1][r-1]) {
                dp[l][r] = true
                if length > maxLen { maxLen = length; start = l }
            }
        }
    }
    return s[start : start+maxLen]
}
```

**Time:** O(n²) — **Space:** O(n²)

## Approach 3: Expand Around Center (Optimal for Interviews)

For each of the `2n-1` centers, expand while characters match.

```cpp
class Solution {
    int start = 0, maxLen = 1;
    void expand(const string& s, int l, int r) {
        while (l >= 0 && r < s.size() && s[l] == s[r]) {
            if (r - l + 1 > maxLen) { maxLen = r - l + 1; start = l; }
            l--; r++;
        }
    }
public:
    string longestPalindrome(string s) {
        for (int i = 0; i < s.size(); i++) {
            expand(s, i, i);      // odd length
            expand(s, i, i + 1); // even length
        }
        return s.substr(start, maxLen);
    }
};
```

```java
class Solution {
    int start = 0, maxLen = 1;
    void expand(String s, int l, int r) {
        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) {
            if (r - l + 1 > maxLen) { maxLen = r - l + 1; start = l; }
            l--; r++;
        }
    }
    public String longestPalindrome(String s) {
        for (int i = 0; i < s.length(); i++) {
            expand(s, i, i);
            expand(s, i, i + 1);
        }
        return s.substring(start, start + maxLen);
    }
}
```

```typescript
function longestPalindrome(s: string): string {
    let start = 0, maxLen = 1;
    function expand(l: number, r: number): void {
        while (l >= 0 && r < s.length && s[l] === s[r]) {
            if (r - l + 1 > maxLen) { maxLen = r - l + 1; start = l; }
            l--; r++;
        }
    }
    for (let i = 0; i < s.length; i++) {
        expand(i, i);
        expand(i, i + 1);
    }
    return s.slice(start, start + maxLen);
}
```

```python
def longestPalindrome(s: str) -> str:
    start, max_len = 0, 1

    def expand(l: int, r: int) -> None:
        nonlocal start, max_len
        while l >= 0 and r < len(s) and s[l] == s[r]:
            if r - l + 1 > max_len:
                max_len = r - l + 1
                start = l
            l -= 1
            r += 1

    for i in range(len(s)):
        expand(i, i)      # odd
        expand(i, i + 1)  # even

    return s[start:start + max_len]
```

```go
func longestPalindrome(s string) string {
    start, maxLen := 0, 1
    expand := func(l, r int) {
        for l >= 0 && r < len(s) && s[l] == s[r] {
            if r-l+1 > maxLen { maxLen = r - l + 1; start = l }
            l--; r++
        }
    }
    for i := 0; i < len(s); i++ {
        expand(i, i)
        expand(i, i+1)
    }
    return s[start : start+maxLen]
}
```

**Time:** O(n²) — **Space:** O(1)

## Dry Run

`s = "babad"`, Expand Around Center:

| Center | Expansion | Max found |
|---|---|---|
| i=0 'b' | 'b' only | "b" |
| i=1 'a' | l=0,r=2: 'b'='b' → "bab" | "bab" (len 3) |
| i=2 'b' | l=1,r=3: 'a'='a' → "aba" | tie (len 3) |
| even gaps | none match | — |

Answer: **"bab"** ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(n³) | O(n) |
| 2D DP | O(n²) | O(n²) |
| Expand from center | O(n²) | O(1) |
| Manacher's Algorithm | O(n) | O(n) |

## Key Interview Insights

**Always expand both odd and even centers.** Skipping the even case misses palindromes like `"abba"`. Each even-center expansion starts at `(i, i+1)`.

**Manacher's Algorithm** solves this in O(n) time. It's rarely asked in standard interviews but is a common follow-up for FAANG-level system design discussions. Mention it to show depth of knowledge.

**Longest Palindromic Subsequence (LC 516)** is different — it's a subsequence (can skip characters). That uses 2D DP: `dp[i][j] = dp[i+1][j-1] + 2` if match, else `max(dp[i+1][j], dp[i][j-1])`.

**Number of Palindromic Substrings (LC 647):** Same expand approach — instead of tracking the longest, count all valid expansions. Add 1 for each expansion step.
