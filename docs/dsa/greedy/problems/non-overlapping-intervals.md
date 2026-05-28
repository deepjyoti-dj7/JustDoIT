---
title: Non-overlapping Intervals
difficulty: Medium
tags: [Greedy, Array, Sorting, Intervals]
link: https://leetcode.com/problems/non-overlapping-intervals/
---

# Non-overlapping Intervals

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) |
| **Tags** | Greedy, Array, Sorting, Intervals |

## Problem Statement

Given an array of intervals `intervals` where `intervals[i] = [starti, endi]`, return the **minimum number of intervals you need to remove** to make the rest non-overlapping.

**Example 1:**
```
Input:  [[1,2],[2,3],[3,4],[1,3]]
Output: 1
Remove [1,3], leaving [1,2],[2,3],[3,4].
```

**Example 2:**
```
Input:  [[1,2],[1,2],[1,2]]
Output: 2
Remove two of the three identical intervals.
```

**Example 3:**
```
Input:  [[1,2],[2,3]]
Output: 0
Already non-overlapping (touching at 2 is OK).
```

---

## Intuition

**Key identity:**

> Minimum intervals to remove = Total intervals − Maximum non-overlapping intervals

So the problem reduces to finding the **maximum set of non-overlapping intervals** — the classic Activity Selection Problem.

**Greedy choice:** Sort by end time. Greedily keep an interval if its start is `>=` the end of the last kept interval. Each kept interval contributes to the "non-overlapping" set; everything else must be removed.

**Why sort by end time?** An interval that finishes earlier leaves more room for future intervals. Choosing any other interval instead can only make things worse — the exchange argument applies.

---

## Approach 1: Brute Force

Try all subsets. Return the size of the largest non-overlapping subset. O(2^n) — only useful for understanding.

---

## Approach 2: DP

`dp[i]` = length of the longest non-overlapping chain ending at interval `i`.

```cpp
int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b){ return a[1] < b[1]; });
    int n = intervals.size();
    vector<int> dp(n, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (intervals[j][1] <= intervals[i][0])
                dp[i] = max(dp[i], dp[j] + 1);
    return n - *max_element(dp.begin(), dp.end());
}
```

```java
int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int n = intervals.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < n; i++)
        for (int j = 0; j < i; j++)
            if (intervals[j][1] <= intervals[i][0])
                dp[i] = Math.max(dp[i], dp[j] + 1);
    int maxKeep = 0;
    for (int d : dp) maxKeep = Math.max(maxKeep, d);
    return n - maxKeep;
}
```

```typescript
function eraseOverlapIntervals(intervals: number[][]): number {
    intervals.sort((a, b) => a[1] - b[1]);
    const n = intervals.length;
    const dp = new Array(n).fill(1);
    for (let i = 1; i < n; i++)
        for (let j = 0; j < i; j++)
            if (intervals[j][1] <= intervals[i][0])
                dp[i] = Math.max(dp[i], dp[j] + 1);
    return n - Math.max(...dp);
}
```

```python
def erase_overlap_intervals_dp(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    n = len(intervals)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if intervals[j][1] <= intervals[i][0]:
                dp[i] = max(dp[i], dp[j] + 1)
    return n - max(dp)
```

```go
func eraseOverlapIntervalsDP(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool { return intervals[i][1] < intervals[j][1] })
    n := len(intervals)
    dp := make([]int, n)
    for i := range dp { dp[i] = 1 }
    maxKeep := 1
    for i := 1; i < n; i++ {
        for j := 0; j < i; j++ {
            if intervals[j][1] <= intervals[i][0] && dp[j]+1 > dp[i] {
                dp[i] = dp[j] + 1
            }
        }
        if dp[i] > maxKeep { maxKeep = dp[i] }
    }
    return n - maxKeep
}
```

**Time:** O(n²) — **Space:** O(n)

---

## Approach 3: Greedy (Optimal)

Sort by end time. Walk through; if the current interval overlaps with `lastEnd`, skip it (remove it). Otherwise, keep it and update `lastEnd`.

Count removals directly — or equivalently count `keep` and return `n - keep`.

```cpp
int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b){ return a[1] < b[1]; });
    int keep = 1, lastEnd = intervals[0][1];
    for (int i = 1; i < (int)intervals.size(); i++) {
        if (intervals[i][0] >= lastEnd) {
            keep++;
            lastEnd = intervals[i][1];
        }
        // else: overlapping — skip (remove) this interval
    }
    return (int)intervals.size() - keep;
}
```

```java
int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
    int keep = 1, lastEnd = intervals[0][1];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {
            keep++;
            lastEnd = intervals[i][1];
        }
    }
    return intervals.length - keep;
}
```

```typescript
function eraseOverlapIntervals(intervals: number[][]): number {
    intervals.sort((a, b) => a[1] - b[1]);
    let keep = 1, lastEnd = intervals[0][1];
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {
            keep++;
            lastEnd = intervals[i][1];
        }
    }
    return intervals.length - keep;
}
```

```python
def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    keep = 1
    last_end = intervals[0][1]
    for start, end in intervals[1:]:
        if start >= last_end:
            keep += 1
            last_end = end
    return len(intervals) - keep
```

```go
func eraseOverlapIntervals(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][1] < intervals[j][1]
    })
    keep, lastEnd := 1, intervals[0][1]
    for i := 1; i < len(intervals); i++ {
        if intervals[i][0] >= lastEnd {
            keep++
            lastEnd = intervals[i][1]
        }
    }
    return len(intervals) - keep
}
```

**Time:** O(n log n) — **Space:** O(1)

---

## Dry Run

`[[1,2],[2,3],[3,4],[1,3]]` sorted by end: `[[1,2],[2,3],[1,3],[3,4]]`

| i | interval | start >= lastEnd? | keep | lastEnd |
|---|---|---|---|---|
| 0 | [1,2] | — (first) | 1 | 2 |
| 1 | [2,3] | 2 >= 2 ✓ | 2 | 3 |
| 2 | [1,3] | 1 >= 3? ✗ | 2 | 3 (skip — remove) |
| 3 | [3,4] | 3 >= 3 ✓ | 3 | 4 |

`keep = 3`, `n = 4` → remove `4 - 3 = 1` ✓

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute Force (all subsets) | O(2^n) | O(n) |
| DP (LIS-style) | O(n²) | O(n) |
| Greedy | O(n log n) | O(1) |

---

## Key Interview Insights

- **Core identity:** `min_remove = n - activity_selection(intervals)`. Memorize this.
- **Touching is OK:** `[1,2]` and `[2,3]` don't overlap — use `>=` not `>` in the keep condition.
- **Sort key matters:** Sort by end time (not start time) for the greedy to work. Sorting by start time can lead to suboptimal selections.
- **Integer overflow in Java:** Use `Integer.compare(a[1], b[1])` instead of `a[1] - b[1]` to avoid overflow when values are large negatives.
- **Variant — Minimum Arrows (LC 452):** Same pattern, slightly different overlap definition (`>` vs `>=`). The arrow fires at `end` of first balloon and bursts all that include that position.
