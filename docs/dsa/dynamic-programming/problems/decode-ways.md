---
title: Decode Ways
difficulty: Medium
tags: [Dynamic Programming, String]
link: https://leetcode.com/problems/decode-ways/
---

# Decode Ways

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [91. Decode Ways](https://leetcode.com/problems/decode-ways/) |
| **Tags** | Dynamic Programming, String |

## Problem Statement

A message encoded as digits (1='A', 2='B', ..., 26='Z') can be decoded in multiple ways. Given a string `s` of digits, return the total number of ways to decode it.

**Example:** `"226"` → 3 ways: `"BZ"` (2,26), `"VF"` (22,6), `"BBF"` (2,2,6)

The string may contain `'0'` which cannot be decoded alone (no letter maps to 0).

## Intuition

Let `dp[i]` = number of ways to decode `s[0..i-1]` (first `i` characters).

At position `i`, we have two choices:
1. **Decode `s[i-1]` alone** (1-digit): valid if `s[i-1] != '0'`. Add `dp[i-1]`.
2. **Decode `s[i-2..i-1]` together** (2-digit): valid if `s[i-2..i-1]` is in `[10, 26]`. Add `dp[i-2]`.

Base cases: `dp[0] = 1` (empty string has 1 way), `dp[1] = 1 if s[0] != '0' else 0`.

This is exactly like Climbing Stairs but with conditional additions.

## Approach 1: Brute Force (Recursion)

Try all valid splits recursively — exponential without memoization.

```cpp
int numDecodings(string s) {
    function<int(int)> dfs = [&](int i) -> int {
        if (i == s.size()) return 1;
        if (s[i] == '0') return 0;
        int res = dfs(i + 1);  // single digit
        if (i + 1 < s.size()) {
            int twoDigit = stoi(s.substr(i, 2));
            if (twoDigit <= 26) res += dfs(i + 2);
        }
        return res;
    };
    return dfs(0);
}
```

```java
int numDecodings(String s) {
    return dfs(s, 0);
}
int dfs(String s, int i) {
    if (i == s.length()) return 1;
    if (s.charAt(i) == '0') return 0;
    int res = dfs(s, i + 1);
    if (i + 1 < s.length()) {
        int two = Integer.parseInt(s.substring(i, i + 2));
        if (two <= 26) res += dfs(s, i + 2);
    }
    return res;
}
```

```typescript
function numDecodings(s: string): number {
    function dfs(i: number): number {
        if (i === s.length) return 1;
        if (s[i] === '0') return 0;
        let res = dfs(i + 1);
        if (i + 1 < s.length) {
            const two = parseInt(s.slice(i, i + 2));
            if (two <= 26) res += dfs(i + 2);
        }
        return res;
    }
    return dfs(0);
}
```

```python
def numDecodings(s: str) -> int:
    def dfs(i: int) -> int:
        if i == len(s): return 1
        if s[i] == '0': return 0
        res = dfs(i + 1)
        if i + 1 < len(s) and int(s[i:i+2]) <= 26:
            res += dfs(i + 2)
        return res
    return dfs(0)
```

```go
func numDecodings(s string) int {
    var dfs func(int) int
    dfs = func(i int) int {
        if i == len(s) { return 1 }
        if s[i] == '0' { return 0 }
        res := dfs(i + 1)
        if i+1 < len(s) {
            two, _ := strconv.Atoi(s[i : i+2])
            if two <= 26 { res += dfs(i + 2) }
        }
        return res
    }
    return dfs(0)
}
```

**Time:** O(2ⁿ) — **Space:** O(n) stack

## Approach 2: DP Array

Bottom-up DP. `dp[i]` = ways to decode `s[0..i-1]`.

```cpp
int numDecodings(string s) {
    int n = s.size();
    vector<int> dp(n + 1, 0);
    dp[0] = 1;
    dp[1] = s[0] != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        if (s[i-1] != '0')
            dp[i] += dp[i-1];
        int twoDigit = stoi(s.substr(i - 2, 2));
        if (twoDigit >= 10 && twoDigit <= 26)
            dp[i] += dp[i-2];
    }
    return dp[n];
}
```

```java
public int numDecodings(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = s.charAt(0) != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        if (s.charAt(i-1) != '0')
            dp[i] += dp[i-1];
        int two = Integer.parseInt(s.substring(i-2, i));
        if (two >= 10 && two <= 26)
            dp[i] += dp[i-2];
    }
    return dp[n];
}
```

```typescript
function numDecodings(s: string): number {
    const n = s.length;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    dp[1] = s[0] !== '0' ? 1 : 0;
    for (let i = 2; i <= n; i++) {
        if (s[i-1] !== '0') dp[i] += dp[i-1];
        const two = parseInt(s.slice(i-2, i));
        if (two >= 10 && two <= 26) dp[i] += dp[i-2];
    }
    return dp[n];
}
```

```python
def numDecodings(s: str) -> int:
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 0 if s[0] == '0' else 1
    for i in range(2, n + 1):
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        two = int(s[i-2:i])
        if 10 <= two <= 26:
            dp[i] += dp[i-2]
    return dp[n]
```

```go
func numDecodings(s string) int {
    n := len(s)
    dp := make([]int, n+1)
    dp[0] = 1
    if s[0] != '0' { dp[1] = 1 }
    for i := 2; i <= n; i++ {
        if s[i-1] != '0' { dp[i] += dp[i-1] }
        two, _ := strconv.Atoi(s[i-2 : i])
        if two >= 10 && two <= 26 { dp[i] += dp[i-2] }
    }
    return dp[n]
}
```

**Time:** O(n) — **Space:** O(n)

## Approach 3: Space-Optimized DP (Optimal)

We only need `dp[i-1]` and `dp[i-2]` — use two variables.

```cpp
int numDecodings(string s) {
    int n = s.size();
    int prev2 = 1, prev1 = s[0] != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        int curr = 0;
        if (s[i-1] != '0') curr += prev1;
        int two = stoi(s.substr(i-2, 2));
        if (two >= 10 && two <= 26) curr += prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```java
public int numDecodings(String s) {
    int n = s.length();
    int prev2 = 1, prev1 = s.charAt(0) != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        int curr = 0;
        if (s.charAt(i-1) != '0') curr += prev1;
        int two = Integer.parseInt(s.substring(i-2, i));
        if (two >= 10 && two <= 26) curr += prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```typescript
function numDecodings(s: string): number {
    const n = s.length;
    let prev2 = 1, prev1 = s[0] !== '0' ? 1 : 0;
    for (let i = 2; i <= n; i++) {
        let curr = 0;
        if (s[i-1] !== '0') curr += prev1;
        const two = parseInt(s.slice(i-2, i));
        if (two >= 10 && two <= 26) curr += prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```python
def numDecodings(s: str) -> int:
    n = len(s)
    prev2, prev1 = 1, 0 if s[0] == '0' else 1
    for i in range(2, n + 1):
        curr = 0
        if s[i-1] != '0': curr += prev1
        if 10 <= int(s[i-2:i]) <= 26: curr += prev2
        prev2, prev1 = prev1, curr
    return prev1
```

```go
func numDecodings(s string) int {
    n := len(s)
    prev2 := 1
    prev1 := 0
    if s[0] != '0' { prev1 = 1 }
    for i := 2; i <= n; i++ {
        curr := 0
        if s[i-1] != '0' { curr += prev1 }
        two, _ := strconv.Atoi(s[i-2 : i])
        if two >= 10 && two <= 26 { curr += prev2 }
        prev2, prev1 = prev1, curr
    }
    return prev1
}
```

**Time:** O(n) — **Space:** O(1)

## Dry Run

`s = "226"` → Expected: 3

| i | char | two-digit | dp[i] |
|---|---|---|---|
| 0 | — | — | 1 |
| 1 | '2' valid | — | 1 |
| 2 | '2' valid (+1); "22"≤26 (+1) | 22 | 2 |
| 3 | '6' valid (+2); "26"≤26 (+1) | 26 | 3 |

Answer: **3** ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(2ⁿ) | O(n) |
| DP array | O(n) | O(n) |
| Space-optimized | O(n) | O(1) |

## Key Interview Insights

**The `'0'` edge case is the hardest part.** A `'0'` digit alone is always invalid (no letter). As the second digit of a pair, it's valid only if the pair is 10 or 20. As the first digit of a pair, the pair is 01-09 which is invalid (< 10). Always check `two >= 10` for the 2-digit case.

**Two-digit validation:** The range is exactly `[10, 26]`. Checking `<= 26` catches only valid codes. `"27"` through `"99"` cannot represent a single letter.

**Leading zeros in input:** If `s = "06"`, the answer is 0. Single `'0'` digit contributes 0 to `dp[i]`, and the pair "06" < 10, so `dp[2] = 0`.

**Decode Ways II (LC 639)** introduces `'*'` wildcards. The same DP structure applies but with multipliers (1-9 or 1-6/11-26 depending on position). It's the same pattern with careful case analysis.
