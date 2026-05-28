---
title: LCS and LIS
description: Longest Common Subsequence, Longest Increasing Subsequence, and their many interview variants
---

# LCS and LIS

Two of the most frequently tested DP patterns. They look different on the surface but share deep structural similarities: both ask about **subsequences** (not subarrays), and both have elegant DP formulations that extend to many variants.

## Longest Common Subsequence (LCS)

**Problem:** Given two strings `s1` and `s2`, find the length of their longest common subsequence. A subsequence is any sequence of characters you can obtain by deleting some (or zero) characters without changing the order.

**Example:** `s1 = "abcde"`, `s2 = "ace"` → LCS = `"ace"`, length = 3

### Intuition

At each pair of positions `(i, j)`, you ask: "What's the LCS of `s1[0..i-1]` and `s2[0..j-1]`?"

- If the last characters match (`s1[i-1] == s2[j-1]`): this character must be in the LCS. `dp[i][j] = dp[i-1][j-1] + 1`
- If they don't match: LCS comes from either ignoring the last char of `s1` or ignoring the last char of `s2`. `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`

**State:** `dp[i][j]` = length of LCS of `s1[0..i-1]` and `s2[0..j-1]`

**Base case:** `dp[0][j] = dp[i][0] = 0` (one string is empty → LCS is 0)

```cpp
int longestCommonSubsequence(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1[i-1] == s2[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}
```

```java
int longestCommonSubsequence(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            if (s1.charAt(i-1) == s2.charAt(j-1))
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}
```

```typescript
function longestCommonSubsequence(s1: string, s2: string): number {
    const m = s1.length, n = s2.length;
    const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = s1[i-1] === s2[j-1]
                ? dp[i-1][j-1] + 1
                : Math.max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}
```

```python
def longestCommonSubsequence(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]
```

```go
func longestCommonSubsequence(s1 string, s2 string) int {
    m, n := len(s1), len(s2)
    dp := make([][]int, m+1)
    for i := range dp { dp[i] = make([]int, n+1) }
    for i := 1; i <= m; i++ {
        for j := 1; j <= n; j++ {
            if s1[i-1] == s2[j-1] {
                dp[i][j] = dp[i-1][j-1] + 1
            } else {
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
            }
        }
    }
    return dp[m][n]
}
```

**Time:** O(mn) — **Space:** O(mn), reducible to O(n) with rolling row

### LCS Variants

| Variant | Change to Recurrence |
|---|---|
| **Longest Common Substring** | Reset to 0 when chars don't match: `dp[i][j] = s1[i-1]==s2[j-1] ? dp[i-1][j-1]+1 : 0` |
| **Shortest Common Supersequence** | `len(s1) + len(s2) - LCS(s1, s2)` |
| **Edit Distance** | Add cost for insert/delete/replace operations |
| **Delete to Make Equal** | `len(s1) + len(s2) - 2 * LCS` (minimum deletions) |
| **Is Subsequence** | LCS == len(shorter string) (or use two-pointer O(n)) |

## Longest Increasing Subsequence (LIS)

**Problem:** Given an array `nums`, find the length of the longest strictly increasing subsequence.

**Example:** `nums = [10, 9, 2, 5, 3, 7, 101, 18]` → LIS = `[2, 3, 7, 101]`, length = 4

### Approach 1: O(n²) DP

**State:** `dp[i]` = length of the LIS ending at index `i`

**Recurrence:** `dp[i] = max(dp[j] + 1)` for all `j < i` where `nums[j] < nums[i]`

**Base case:** `dp[i] = 1` (each element alone is a subsequence of length 1)

**Answer:** `max(dp[i])` over all `i`

```cpp
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    int result = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i])
                dp[i] = max(dp[i], dp[j] + 1);
        result = max(result, dp[i]);
    }
    return result;
}
```

```java
int lengthOfLIS(int[] nums) {
    int n = nums.length, result = 1;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i])
                dp[i] = Math.max(dp[i], dp[j] + 1);
        result = Math.max(result, dp[i]);
    }
    return result;
}
```

```typescript
function lengthOfLIS(nums: number[]): number {
    const n = nums.length;
    const dp = new Array(n).fill(1);
    let result = 1;
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++)
            if (nums[j] < nums[i])
                dp[i] = Math.max(dp[i], dp[j] + 1);
        result = Math.max(result, dp[i]);
    }
    return result;
}
```

```python
def lengthOfLIS(nums: list[int]) -> int:
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)
```

```go
func lengthOfLIS(nums []int) int {
    n := len(nums)
    dp := make([]int, n)
    for i := range dp { dp[i] = 1 }
    result := 1
    for i := 1; i < n; i++ {
        for j := 0; j < i; j++ {
            if nums[j] < nums[i] && dp[j]+1 > dp[i] {
                dp[i] = dp[j] + 1
            }
        }
        if dp[i] > result { result = dp[i] }
    }
    return result
}
```

### Approach 2: O(n log n) — Patience Sorting (Binary Search)

Maintain a `tails` array where `tails[i]` is the smallest tail element of any increasing subsequence of length `i+1`. This array is always sorted, enabling binary search.

For each `num`:
- If `num > tails[-1]`: extend the LIS — append to `tails`
- Else: find the leftmost position in `tails` where `tails[pos] >= num` and replace `tails[pos] = num`

The length of `tails` is the LIS length. `tails` itself is **not** a valid LIS — it's a bookkeeping structure.

```cpp
int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int num : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), num);
        if (it == tails.end()) tails.push_back(num);
        else *it = num;
    }
    return tails.size();
}
```

```java
int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int num : nums) {
        int lo = 0, hi = tails.size();
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (tails.get(mid) < num) lo = mid + 1;
            else hi = mid;
        }
        if (lo == tails.size()) tails.add(num);
        else tails.set(lo, num);
    }
    return tails.size();
}
```

```typescript
function lengthOfLIS(nums: number[]): number {
    const tails: number[] = [];
    for (const num of nums) {
        let lo = 0, hi = tails.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (tails[mid] < num) lo = mid + 1;
            else hi = mid;
        }
        if (lo === tails.length) tails.push(num);
        else tails[lo] = num;
    }
    return tails.length;
}
```

```python
def lengthOfLIS(nums: list[int]) -> int:
    from bisect import bisect_left
    tails = []
    for num in nums:
        pos = bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    return len(tails)
```

```go
func lengthOfLIS(nums []int) int {
    tails := []int{}
    for _, num := range nums {
        lo, hi := 0, len(tails)
        for lo < hi {
            mid := (lo + hi) / 2
            if tails[mid] < num { lo = mid + 1 } else { hi = mid }
        }
        if lo == len(tails) { tails = append(tails, num) } else { tails[lo] = num }
    }
    return len(tails)
}
```

### Dry Run: Patience Sorting

`nums = [10, 9, 2, 5, 3, 7, 101, 18]`

```
num=10: tails=[]       → append   → tails=[10]
num=9:  tails=[10]     → replace  → tails=[9]
num=2:  tails=[9]      → replace  → tails=[2]
num=5:  tails=[2]      → append   → tails=[2, 5]
num=3:  tails=[2,5]    → replace  → tails=[2, 3]
num=7:  tails=[2,3]    → append   → tails=[2, 3, 7]
num=101:tails=[2,3,7]  → append   → tails=[2, 3, 7, 101]
num=18: tails=[2,3,7,101] → replace → tails=[2, 3, 7, 18]
```

Length = 4. Correct.

## LIS Variants

### Longest Non-Decreasing Subsequence

Change `lower_bound` to `upper_bound` in the binary search. This allows equal elements.

### Longest Bitonic Subsequence

Find the longest subsequence that first increases then decreases. Compute LIS from left to right and LDS (longest decreasing subsequence = LIS from right to left). For each index `k`, answer = `lis[k] + lds[k] - 1`.

### Russian Doll Envelopes

Sort by width ascending, height descending. Then find LIS by height. The descending height sort for equal widths ensures we can't use two envelopes with the same width.

```cpp
int maxEnvelopes(vector<vector<int>>& env) {
    sort(env.begin(), env.end(), [](auto& a, auto& b) {
        return a[0] == b[0] ? a[1] > b[1] : a[0] < b[0];
    });
    vector<int> tails;
    for (auto& e : env) {
        int h = e[1];
        auto it = lower_bound(tails.begin(), tails.end(), h);
        if (it == tails.end()) tails.push_back(h);
        else *it = h;
    }
    return tails.size();
}
```

```java
int maxEnvelopes(int[][] env) {
    Arrays.sort(env, (a, b) -> a[0] == b[0] ? b[1] - a[1] : a[0] - b[0]);
    List<Integer> tails = new ArrayList<>();
    for (int[] e : env) {
        int h = e[1], lo = 0, hi = tails.size();
        while (lo < hi) { int mid = (lo+hi)/2; if (tails.get(mid) < h) lo = mid+1; else hi = mid; }
        if (lo == tails.size()) tails.add(h); else tails.set(lo, h);
    }
    return tails.size();
}
```

```typescript
function maxEnvelopes(env: number[][]): number {
    env.sort((a, b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]);
    const tails: number[] = [];
    for (const [, h] of env) {
        let lo = 0, hi = tails.length;
        while (lo < hi) { const mid = (lo+hi)>>1; if (tails[mid] < h) lo = mid+1; else hi = mid; }
        if (lo === tails.length) tails.push(h); else tails[lo] = h;
    }
    return tails.length;
}
```

```python
def maxEnvelopes(env: list[list[int]]) -> int:
    from bisect import bisect_left
    env.sort(key=lambda x: (x[0], -x[1]))
    tails = []
    for _, h in env:
        pos = bisect_left(tails, h)
        if pos == len(tails): tails.append(h)
        else: tails[pos] = h
    return len(tails)
```

```go
func maxEnvelopes(env [][]int) int {
    sort.Slice(env, func(i, j int) bool {
        if env[i][0] == env[j][0] { return env[i][1] > env[j][1] }
        return env[i][0] < env[j][0]
    })
    tails := []int{}
    for _, e := range env {
        h := e[1]
        lo, hi := 0, len(tails)
        for lo < hi { mid := (lo+hi)/2; if tails[mid] < h { lo = mid+1 } else { hi = mid } }
        if lo == len(tails) { tails = append(tails, h) } else { tails[lo] = h }
    }
    return len(tails)
}
```

## Complexity Summary

| Algorithm | Time | Space |
|---|---|---|
| LCS | O(mn) | O(mn) → O(n) |
| LIS (O(n²) DP) | O(n²) | O(n) |
| LIS (binary search) | O(n log n) | O(n) |
| Russian Doll Envelopes | O(n log n) | O(n) |

## Key Interview Insights

**LCS vs LIS:** LCS requires two sequences and a 2D state. LIS is a single sequence with a 1D state. Both can appear disguised — "delete minimum characters to make strings equal" = LCS; "number of envelopes you can fit" = LIS.

**Patience sorting mental model:** Imagine dealing cards left to right. Place each card on the leftmost pile whose top card is ≥ the current card. Start a new pile if none works. Number of piles = LIS length.

**LIS is O(n log n) in interviews:** If an interviewer asks you to optimize Coin Change, Edit Distance, or LIS, the O(n log n) approach for LIS via binary search is often the expected answer.

**Reconstruct the actual LIS:** Track which index each `dp[i]` came from (parent array). Walk backward from the max `dp[i]` to reconstruct. This is a common follow-up.

**The "strictly" vs "non-strictly" distinction:** `lower_bound` gives strictly increasing. `upper_bound` gives non-decreasing. Confirm with the interviewer.
