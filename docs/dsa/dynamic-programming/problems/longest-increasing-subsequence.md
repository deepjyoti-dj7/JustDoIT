---
title: Longest Increasing Subsequence
difficulty: Medium
tags: [Dynamic Programming, Binary Search, Array]
link: https://leetcode.com/problems/longest-increasing-subsequence/
---

# Longest Increasing Subsequence

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [300. Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/) |
| **Tags** | Dynamic Programming, Binary Search, Array |

## Problem Statement

Given an integer array `nums`, return the length of the **longest strictly increasing subsequence**.

A subsequence is derived from the array by deleting some (possibly none) elements without changing the relative order of the remaining elements.

**Example:** `nums = [10, 9, 2, 5, 3, 7, 101, 18]` → `4` (the LIS is `[2, 3, 7, 101]` or `[2, 5, 7, 101]`)

## Intuition

**O(n²) DP:** For each position `i`, find the longest increasing subsequence ending at index `i`.

`dp[i] = max(dp[j] + 1)` for all `j < i` where `nums[j] < nums[i]`.

**O(n log n) Patience Sorting:** Maintain a `tails` array where `tails[k]` is the smallest tail element of all increasing subsequences of length `k+1`. For each new number, binary search to find where it fits and update `tails`. The length of `tails` at the end is the LIS length.

## Approach 1: Brute Force (All Subsequences)

Generate all subsequences, filter increasing, find the longest. Exponential.

```cpp
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size(), ans = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> sub;
        for (int i = 0; i < n; i++)
            if (mask >> i & 1) sub.push_back(nums[i]);
        bool inc = true;
        for (int i = 1; i < sub.size(); i++)
            if (sub[i] <= sub[i-1]) { inc = false; break; }
        if (inc) ans = max(ans, (int)sub.size());
    }
    return ans;
}
```

```java
int lengthOfLIS(int[] nums) {
    int n = nums.length, ans = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> sub = new ArrayList<>();
        for (int i = 0; i < n; i++)
            if ((mask >> i & 1) == 1) sub.add(nums[i]);
        boolean inc = true;
        for (int i = 1; i < sub.size(); i++)
            if (sub.get(i) <= sub.get(i-1)) { inc = false; break; }
        if (inc) ans = Math.max(ans, sub.size());
    }
    return ans;
}
```

```typescript
function lengthOfLIS(nums: number[]): number {
    const n = nums.length;
    let ans = 0;
    for (let mask = 0; mask < (1 << n); mask++) {
        const sub: number[] = [];
        for (let i = 0; i < n; i++)
            if ((mask >> i) & 1) sub.push(nums[i]);
        let inc = true;
        for (let i = 1; i < sub.length; i++)
            if (sub[i] <= sub[i-1]) { inc = false; break; }
        if (inc) ans = Math.max(ans, sub.length);
    }
    return ans;
}
```

```python
def lengthOfLIS(nums: list[int]) -> int:
    n = len(nums)
    ans = 0
    for mask in range(1 << n):
        sub = [nums[i] for i in range(n) if mask >> i & 1]
        if all(sub[i] < sub[i+1] for i in range(len(sub)-1)):
            ans = max(ans, len(sub))
    return ans
```

```go
func lengthOfLIS(nums []int) int {
    n := len(nums)
    ans := 0
    for mask := 0; mask < (1 << n); mask++ {
        sub := []int{}
        for i := 0; i < n; i++ {
            if mask>>i&1 == 1 { sub = append(sub, nums[i]) }
        }
        inc := true
        for i := 1; i < len(sub); i++ {
            if sub[i] <= sub[i-1] { inc = false; break }
        }
        if inc && len(sub) > ans { ans = len(sub) }
    }
    return ans
}
```

**Time:** O(2ⁿ × n) — **Space:** O(n)

## Approach 2: O(n²) DP

Classic DP. `dp[i]` = length of LIS ending at index `i`.

```cpp
int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, 1);
    int ans = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i])
                dp[i] = max(dp[i], dp[j] + 1);
        }
        ans = max(ans, dp[i]);
    }
    return ans;
}
```

```java
public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    int ans = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i])
                dp[i] = Math.max(dp[i], dp[j] + 1);
        }
        ans = Math.max(ans, dp[i]);
    }
    return ans;
}
```

```typescript
function lengthOfLIS(nums: number[]): number {
    const n = nums.length;
    const dp = new Array(n).fill(1);
    let ans = 1;
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i])
                dp[i] = Math.max(dp[i], dp[j] + 1);
        }
        ans = Math.max(ans, dp[i]);
    }
    return ans;
}
```

```python
def lengthOfLIS(nums: list[int]) -> int:
    dp = [1] * len(nums)
    for i in range(1, len(nums)):
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
    ans := 1
    for i := 1; i < n; i++ {
        for j := 0; j < i; j++ {
            if nums[j] < nums[i] && dp[j]+1 > dp[i] {
                dp[i] = dp[j] + 1
            }
        }
        if dp[i] > ans { ans = dp[i] }
    }
    return ans
}
```

**Time:** O(n²) — **Space:** O(n)

## Approach 3: O(n log n) — Patience Sorting (Optimal)

Maintain `tails[]` where `tails[k]` = smallest tail of all IS of length `k+1`. For each number, binary search for the first `tails[k] >= num` and replace it.

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
public int lengthOfLIS(int[] nums) {
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
        tails[lo] = num;
    }
    return tails.length;
}
```

```python
def lengthOfLIS(nums: list[int]) -> int:
    import bisect
    tails = []
    for num in nums:
        pos = bisect.bisect_left(tails, num)
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
        if lo == len(tails) {
            tails = append(tails, num)
        } else {
            tails[lo] = num
        }
    }
    return len(tails)
}
```

**Time:** O(n log n) — **Space:** O(n)

## Dry Run — Patience Sorting

`nums = [10, 9, 2, 5, 3, 7, 101, 18]`

| num | binary search | tails after |
|---|---|---|
| 10 | insert at 0 | [10] |
| 9 | replace pos 0 | [9] |
| 2 | replace pos 0 | [2] |
| 5 | insert at 1 | [2, 5] |
| 3 | replace pos 1 | [2, 3] |
| 7 | insert at 2 | [2, 3, 7] |
| 101 | insert at 3 | [2, 3, 7, 101] |
| 18 | replace pos 3 | [2, 3, 7, 18] |

Length of `tails` = **4** ✓

Note: `tails` itself is NOT the LIS — it's just a bookkeeping structure. The length is correct, but the elements may not form the actual LIS.

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(2ⁿ×n) | O(n) |
| O(n²) DP | O(n²) | O(n) |
| Patience Sorting | O(n log n) | O(n) |

## Key Interview Insights

**`tails` doesn't hold the actual LIS.** If asked to reconstruct the sequence, use the O(n²) DP to track parent pointers, or combine patience sorting with parent pointers carefully.

**Strictly increasing vs. non-decreasing:** For strictly increasing, use `lower_bound` (first element ≥ num). For non-decreasing (allowing equals), use `upper_bound` (first element > num).

**Russian Doll Envelopes (LC 354):** Sort by width ascending, then height **descending**. Then find LIS on heights. The descending sort on heights prevents two envelopes with the same width from being selected.

**Number of LIS (LC 673):** Add a `count[i]` array alongside `dp[i]`. When `dp[j] + 1 > dp[i]`, set `count[i] = count[j]`. When equal, `count[i] += count[j]`. Sum up `count[i]` for all `i` with `dp[i] == maxLen`.
