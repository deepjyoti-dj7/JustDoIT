---
title: Word Break
difficulty: Medium
tags: [Dynamic Programming, Trie, Memoization, Hash Table]
link: https://leetcode.com/problems/word-break/
---

# Word Break

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [139. Word Break](https://leetcode.com/problems/word-break/) |
| **Tags** | Dynamic Programming, Trie, Hash Table |

## Problem Statement

Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.

**Example:** `s = "leetcode"`, `wordDict = ["leet","code"]` → `true` ("leet" + "code")
**Example:** `s = "applepenapple"`, `wordDict = ["apple","pen"]` → `true` ("apple" + "pen" + "apple")
**Example:** `s = "catsandog"`, `wordDict = ["cats","dog","sand","and","cat"]` → `false`

## Intuition

Let `dp[i]` = true if `s[0..i-1]` can be segmented using words in the dictionary.

To compute `dp[i]`: check if there exists a `j < i` such that `dp[j] == true` **and** `s[j..i-1]` is in the dictionary.

In other words: for each position `i`, try to find a dictionary word that ends at `i` and has a valid segmentation before it.

```
dp[0] = true   (empty string)
dp[i] = OR over all j < i: dp[j] && s[j..i-1] in wordDict
```

## Approach 1: Brute Force (DFS)

Try all possible word splits recursively. Exponential without memoization.

```cpp
bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    function<bool(int)> dfs = [&](int start) -> bool {
        if (start == s.size()) return true;
        for (int end = start + 1; end <= s.size(); end++) {
            if (dict.count(s.substr(start, end - start)) && dfs(end))
                return true;
        }
        return false;
    };
    return dfs(0);
}
```

```java
boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    return dfs(s, dict, 0);
}
boolean dfs(String s, Set<String> dict, int start) {
    if (start == s.length()) return true;
    for (int end = start + 1; end <= s.length(); end++) {
        if (dict.contains(s.substring(start, end)) && dfs(s, dict, end))
            return true;
    }
    return false;
}
```

```typescript
function wordBreak(s: string, wordDict: string[]): boolean {
    const dict = new Set(wordDict);
    function dfs(start: number): boolean {
        if (start === s.length) return true;
        for (let end = start + 1; end <= s.length; end++) {
            if (dict.has(s.slice(start, end)) && dfs(end)) return true;
        }
        return false;
    }
    return dfs(0);
}
```

```python
def wordBreak(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)
    def dfs(start: int) -> bool:
        if start == len(s): return True
        return any(
            s[start:end] in word_set and dfs(end)
            for end in range(start + 1, len(s) + 1)
        )
    return dfs(0)
```

```go
func wordBreak(s string, wordDict []string) bool {
    dict := make(map[string]bool)
    for _, w := range wordDict { dict[w] = true }
    var dfs func(int) bool
    dfs = func(start int) bool {
        if start == len(s) { return true }
        for end := start + 1; end <= len(s); end++ {
            if dict[s[start:end]] && dfs(end) { return true }
        }
        return false
    }
    return dfs(0)
}
```

**Time:** O(2ⁿ) — **Space:** O(n)

## Approach 2: Top-Down DP (Memoization)

Cache the result at each start index to avoid recomputation.

```cpp
bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    unordered_map<int, bool> memo;
    function<bool(int)> dfs = [&](int start) -> bool {
        if (start == s.size()) return true;
        if (memo.count(start)) return memo[start];
        for (int end = start + 1; end <= s.size(); end++) {
            if (dict.count(s.substr(start, end - start)) && dfs(end))
                return memo[start] = true;
        }
        return memo[start] = false;
    };
    return dfs(0);
}
```

```java
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    Boolean[] memo = new Boolean[s.length()];
    return dfs(s, dict, 0, memo);
}
boolean dfs(String s, Set<String> dict, int start, Boolean[] memo) {
    if (start == s.length()) return true;
    if (memo[start] != null) return memo[start];
    for (int end = start + 1; end <= s.length(); end++) {
        if (dict.contains(s.substring(start, end)) && dfs(s, dict, end, memo))
            return memo[start] = true;
    }
    return memo[start] = false;
}
```

```typescript
function wordBreak(s: string, wordDict: string[]): boolean {
    const dict = new Set(wordDict);
    const memo = new Map<number, boolean>();
    function dfs(start: number): boolean {
        if (start === s.length) return true;
        if (memo.has(start)) return memo.get(start)!;
        for (let end = start + 1; end <= s.length; end++) {
            if (dict.has(s.slice(start, end)) && dfs(end)) {
                memo.set(start, true);
                return true;
            }
        }
        memo.set(start, false);
        return false;
    }
    return dfs(0);
}
```

```python
def wordBreak(s: str, wordDict: list[str]) -> bool:
    from functools import lru_cache
    word_set = frozenset(wordDict)

    @lru_cache(maxsize=None)
    def dfs(start: int) -> bool:
        if start == len(s): return True
        return any(
            s[start:end] in word_set and dfs(end)
            for end in range(start + 1, len(s) + 1)
        )

    return dfs(0)
```

```go
func wordBreak(s string, wordDict []string) bool {
    dict := make(map[string]bool)
    for _, w := range wordDict { dict[w] = true }
    memo := make([]int, len(s)) // 0=unvisited, 1=true, -1=false
    var dfs func(int) bool
    dfs = func(start int) bool {
        if start == len(s) { return true }
        if memo[start] != 0 { return memo[start] == 1 }
        for end := start + 1; end <= len(s); end++ {
            if dict[s[start:end]] && dfs(end) {
                memo[start] = 1
                return true
            }
        }
        memo[start] = -1
        return false
    }
    return dfs(0)
}
```

**Time:** O(n² × m) where m = max word length — **Space:** O(n)

## Approach 3: Bottom-Up DP (Optimal)

Build `dp[0..n]` iteratively. `dp[i]` = can `s[0..i-1]` be segmented?

```cpp
bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> dict(wordDict.begin(), wordDict.end());
    int n = s.size();
    vector<bool> dp(n + 1, false);
    dp[0] = true;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.count(s.substr(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}
```

```java
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}
```

```typescript
function wordBreak(s: string, wordDict: string[]): boolean {
    const dict = new Set(wordDict);
    const n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            if (dp[j] && dict.has(s.slice(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}
```

```python
def wordBreak(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[n]
```

```go
func wordBreak(s string, wordDict []string) bool {
    dict := make(map[string]bool)
    for _, w := range wordDict { dict[w] = true }
    n := len(s)
    dp := make([]bool, n+1)
    dp[0] = true
    for i := 1; i <= n; i++ {
        for j := 0; j < i; j++ {
            if dp[j] && dict[s[j:i]] {
                dp[i] = true
                break
            }
        }
    }
    return dp[n]
}
```

**Time:** O(n² × m) — **Space:** O(n + dict size)

## Dry Run

`s = "leetcode"`, `wordDict = ["leet", "code"]`

| i | j=0..i-1 | match | dp[i] |
|---|---|---|---|
| 0 | — | — | true |
| 4 | j=0: dp[0]∧"leet"✓ | yes | true |
| 8 | j=4: dp[4]∧"code"✓ | yes | true |

Answer: **true** ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force DFS | O(2ⁿ) | O(n) |
| Memoized DFS | O(n²×m) | O(n) |
| Bottom-up DP | O(n²×m) | O(n) |

## Key Interview Insights

**Optimization with max word length:** Bound the inner loop to only go back as far as the longest word in the dictionary. This reduces practical runtime significantly when the dictionary has short words.

**Word Break II (LC 140)** asks for all valid segmentations. Use memoization where each state returns a list of all valid suffixes. The DP structure is identical but stores strings.

**Trie optimization:** Build a Trie from `wordDict`. Then for each position in `s`, walk the Trie forward instead of doing substring lookups. This reduces the inner loop to O(n) with O(1) per character.

**Why not greedy?** Greedy fails on cases like `s = "aaab"`, `wordDict = ["a", "aa", "aaa"]`. Greedily picking the longest match first may not lead to a complete segmentation.
