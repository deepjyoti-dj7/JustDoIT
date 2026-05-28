---
title: Palindrome Partitioning
difficulty: Medium
tags: [String, Backtracking, Dynamic Programming]
link: https://leetcode.com/problems/palindrome-partitioning/
---

# Palindrome Partitioning

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [131. Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/) |
| **Tags** | String, Backtracking, Dynamic Programming |

## Problem Statement

Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return **all possible palindrome partitionings** of `s`.

## Intuition

We want to split the string at every possible position, but only accept a prefix if it's a palindrome.

At each step: try every possible end position `end` for the current segment `s[start:end]`. If that segment is a palindrome, include it and recurse on the remaining suffix starting at `end`.

```
s = "aab"

Start at index 0:
  s[0:1] = "a" → palindrome ✓ → recurse on "ab" (index 1)
    s[1:2] = "a" → palindrome ✓ → recurse on "b" (index 2)
      s[2:3] = "b" → palindrome ✓ → index==len → record ["a","a","b"] ✓
    s[1:3] = "ab" → not palindrome ✗
  s[0:2] = "aa" → palindrome ✓ → recurse on "b" (index 2)
    s[2:3] = "b" → palindrome ✓ → record ["aa","b"] ✓
  s[0:3] = "aab" → not palindrome ✗

Result: [["a","a","b"], ["aa","b"]]
```

## Approach 1: Backtracking with Inline Palindrome Check

```cpp
class Solution {
public:
    vector<vector<string>> partition(string s) {
        vector<vector<string>> result;
        vector<string> current;
        backtrack(s, 0, current, result);
        return result;
    }

private:
    bool isPalin(const string& s, int l, int r) {
        while (l < r) {
            if (s[l++] != s[r--]) return false;
        }
        return true;
    }

    void backtrack(const string& s, int start,
                   vector<string>& current, vector<vector<string>>& result) {
        if (start == s.size()) {
            result.push_back(current);
            return;
        }
        for (int end = start + 1; end <= s.size(); end++) {
            if (isPalin(s, start, end - 1)) {
                current.push_back(s.substr(start, end - start));
                backtrack(s, end, current, result);
                current.pop_back();
            }
        }
    }
};
```

```java
class Solution {
    private List<List<String>> result = new ArrayList<>();

    public List<List<String>> partition(String s) {
        backtrack(s, 0, new ArrayList<>());
        return result;
    }

    private void backtrack(String s, int start, List<String> current) {
        if (start == s.length()) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int end = start + 1; end <= s.length(); end++) {
            if (isPalin(s, start, end - 1)) {
                current.add(s.substring(start, end));
                backtrack(s, end, current);
                current.remove(current.size() - 1);
            }
        }
    }

    private boolean isPalin(String s, int l, int r) {
        while (l < r) {
            if (s.charAt(l++) != s.charAt(r--)) return false;
        }
        return true;
    }
}
```

```typescript
function partition(s: string): string[][] {
    const result: string[][] = [];

    function isPalin(l: number, r: number): boolean {
        while (l < r) {
            if (s[l++] !== s[r--]) return false;
        }
        return true;
    }

    function backtrack(start: number, current: string[]): void {
        if (start === s.length) {
            result.push([...current]);
            return;
        }
        for (let end = start + 1; end <= s.length; end++) {
            if (isPalin(start, end - 1)) {
                current.push(s.slice(start, end));
                backtrack(end, current);
                current.pop();
            }
        }
    }

    backtrack(0, []);
    return result;
}
```

```python
class Solution:
    def partition(self, s: str) -> list[list[str]]:
        result = []

        def is_palin(l: int, r: int) -> bool:
            while l < r:
                if s[l] != s[r]:
                    return False
                l += 1
                r -= 1
            return True

        def backtrack(start: int, current: list[str]) -> None:
            if start == len(s):
                result.append(current[:])
                return
            for end in range(start + 1, len(s) + 1):
                if is_palin(start, end - 1):
                    current.append(s[start:end])
                    backtrack(end, current)
                    current.pop()

        backtrack(0, [])
        return result
```

```go
func partition(s string) [][]string {
    result := [][]string{}

    isPalin := func(l, r int) bool {
        for l < r {
            if s[l] != s[r] { return false }
            l++; r--
        }
        return true
    }

    var backtrack func(start int, current []string)
    backtrack = func(start int, current []string) {
        if start == len(s) {
            snapshot := make([]string, len(current))
            copy(snapshot, current)
            result = append(result, snapshot)
            return
        }
        for end := start + 1; end <= len(s); end++ {
            if isPalin(start, end-1) {
                current = append(current, s[start:end])
                backtrack(end, current)
                current = current[:len(current)-1]
            }
        }
    }

    backtrack(0, []string{})
    return result
}
```

## Approach 2: Backtracking + DP Precomputation (Optimal)

The palindrome check is called O(2ⁿ) times and each check is O(n). We can precompute `isPalin[i][j]` for all pairs in O(n²) using DP.

```cpp
class Solution {
public:
    vector<vector<string>> partition(string s) {
        int n = s.size();
        vector<vector<bool>> dp(n, vector<bool>(n, false));
        for (int i = 0; i < n; i++) dp[i][i] = true;
        for (int len = 2; len <= n; len++)
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                dp[i][j] = (s[i] == s[j]) && (len == 2 || dp[i+1][j-1]);
            }
        vector<vector<string>> result;
        vector<string> current;
        function<void(int)> backtrack = [&](int start) {
            if (start == n) { result.push_back(current); return; }
            for (int end = start; end < n; end++)
                if (dp[start][end]) {
                    current.push_back(s.substr(start, end - start + 1));
                    backtrack(end + 1);
                    current.pop_back();
                }
        };
        backtrack(0);
        return result;
    }
};
```

```java
public List<List<String>> partition(String s) {
    int n = s.length();
    boolean[][] dp = new boolean[n][n];
    for (int i = 0; i < n; i++) dp[i][i] = true;
    for (int len = 2; len <= n; len++)
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = s.charAt(i) == s.charAt(j) && (len == 2 || dp[i+1][j-1]);
        }
    List<List<String>> result = new ArrayList<>();
    backtrack(s, 0, n, dp, new ArrayList<>(), result);
    return result;
}
void backtrack(String s, int start, int n, boolean[][] dp,
               List<String> current, List<List<String>> result) {
    if (start == n) { result.add(new ArrayList<>(current)); return; }
    for (int end = start; end < n; end++)
        if (dp[start][end]) {
            current.add(s.substring(start, end + 1));
            backtrack(s, end + 1, n, dp, current, result);
            current.remove(current.size() - 1);
        }
}
```

```typescript
function partition(s: string): string[][] {
    const n = s.length;
    const dp: boolean[][] = Array.from({length: n}, () => new Array(n).fill(false));
    for (let i = 0; i < n; i++) dp[i][i] = true;
    for (let len = 2; len <= n; len++)
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            dp[i][j] = s[i] === s[j] && (len === 2 || dp[i+1][j-1]);
        }
    const result: string[][] = [];
    const current: string[] = [];
    function backtrack(start: number): void {
        if (start === n) { result.push([...current]); return; }
        for (let end = start; end < n; end++)
            if (dp[start][end]) {
                current.push(s.slice(start, end + 1));
                backtrack(end + 1);
                current.pop();
            }
    }
    backtrack(0);
    return result;
}
```

```python
class Solution:
    def partition(self, s: str) -> list[list[str]]:
        n = len(s)

        # Precompute: dp[i][j] = True if s[i..j] is a palindrome
        dp = [[False] * n for _ in range(n)]
        for i in range(n):
            dp[i][i] = True          # single char
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                if s[i] == s[j]:
                    dp[i][j] = (length == 2) or dp[i+1][j-1]

        result = []

        def backtrack(start: int, current: list[str]) -> None:
            if start == n:
                result.append(current[:])
                return
            for end in range(start, n):
                if dp[start][end]:       # O(1) check now
                    current.append(s[start:end+1])
                    backtrack(end + 1, current)
                    current.pop()

        backtrack(0, [])
        return result
```

```go
func partitionDP(s string) [][]string {
    n := len(s)
    dp := make([][]bool, n)
    for i := range dp { dp[i] = make([]bool, n); dp[i][i] = true }
    for length := 2; length <= n; length++ {
        for i := 0; i <= n-length; i++ {
            j := i + length - 1
            dp[i][j] = s[i] == s[j] && (length == 2 || dp[i+1][j-1])
        }
    }
    result := [][]string{}
    var backtrack func(start int, current []string)
    backtrack = func(start int, current []string) {
        if start == n {
            snapshot := make([]string, len(current))
            copy(snapshot, current)
            result = append(result, snapshot)
            return
        }
        for end := start; end < n; end++ {
            if dp[start][end] {
                current = append(current, s[start:end+1])
                backtrack(end+1, current)
                current = current[:len(current)-1]
            }
        }
    }
    backtrack(0, []string{})
    return result
}
```

## Dry Run

```
s = "aab",  n=3

Precompute dp:
dp[0][0]=T (a), dp[1][1]=T (a), dp[2][2]=T (b)
dp[0][1]: s[0]='a'==s[1]='a' and length==2 → dp[0][1]=T
dp[1][2]: s[1]='a'!=s[2]='b' → dp[1][2]=F
dp[0][2]: s[0]='a'!=s[2]='b' → dp[0][2]=F

backtrack(start=0, current=[])
  end=0: dp[0][0]=T → add "a", backtrack(1, ["a"])
    end=1: dp[1][1]=T → add "a", backtrack(2, ["a","a"])
      end=2: dp[2][2]=T → add "b", backtrack(3, ["a","a","b"])
        start==n → record ["a","a","b"] ✓
      pop "b"
    pop "a"
    end=2: dp[1][2]=F → skip
  pop "a"
  end=1: dp[0][1]=T → add "aa", backtrack(2, ["aa"])
    end=2: dp[2][2]=T → add "b", backtrack(3, ["aa","b"])
      record ["aa","b"] ✓
  pop "aa"
  end=2: dp[0][2]=F → skip
```

## Complexity

| Approach | Time | Space |
|---|---|---|
| Backtracking + O(n) palindrome check | O(n × 2ⁿ) | O(n) stack + O(n) current |
| Backtracking + DP precompute | O(n² + n × 2ⁿ) | O(n²) DP table |

For n ≤ 16 (typical constraint), both work. The DP approach is significantly faster in practice because the O(n) check is done O(2ⁿ) times.

## Key Interview Insights

- **The `start` to `end` loop** is the "choose split point" decision. Unlike subset/combination problems, the element we "choose" is a substring, not a single value.
- **Only recurse when valid** — the palindrome check gates the recursive call. This is the pruning step.
- **DP precomputation** is a common optimization to mention. State it upfront: "I'll precompute all palindrome substrings in O(n²) so each check during backtracking is O(1)."
- **The recurrence for DP palindromes:** `dp[i][j] = (s[i]==s[j]) and (j-i <= 1 or dp[i+1][j-1])`.
