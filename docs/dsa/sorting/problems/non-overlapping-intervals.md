---
title: Non-overlapping Intervals
difficulty: Medium
tags: [Array, Sorting, Intervals, Greedy]
link: https://leetcode.com/problems/non-overlapping-intervals/
---

# Non-overlapping Intervals

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) |
| **Tags** | Array, Sorting, Greedy |

## Problem Statement

Given an array of intervals, find the **minimum number of intervals to remove** to make the rest non-overlapping.

**Example:**
```
Input:  [[1,2],[2,3],[3,4],[1,3]]
Output: 1   (remove [1,3])

Input:  [[1,2],[1,2],[1,2]]
Output: 2   (remove two of the three)
```

## Intuition

Minimum removals = n - maximum non-overlapping intervals we can keep.

This reframes the problem as: **find the maximum number of non-overlapping intervals** (the classic "Activity Selection Problem" from greedy algorithms).

**Greedy insight:** Sort by **end time**. Always keep the interval that ends earliest — it leaves maximum room for future intervals. When two intervals overlap, remove the one ending later (it "wastes" more timeline).

**Why sort by end time (not start)?** The interval ending soonest gives the best chance for the next interval to fit. This is the key greedy choice in activity selection.

## Approach 1: Sort by Start + Remove Later-Ending Interval (Intuitive)

Sort by start time. When two intervals overlap, remove the one ending later.

```cpp
int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    int removals = 0, prevEnd = intervals[0][1];
    for (int i = 1; i < (int)intervals.size(); i++) {
        if (intervals[i][0] < prevEnd) {
            removals++;
            prevEnd = min(prevEnd, intervals[i][1]);
        } else {
            prevEnd = intervals[i][1];
        }
    }
    return removals;
}
```

```java
public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    int removals = 0, prevEnd = intervals[0][1];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < prevEnd) {
            removals++;
            prevEnd = Math.min(prevEnd, intervals[i][1]);
        } else {
            prevEnd = intervals[i][1];
        }
    }
    return removals;
}
```

```typescript
function eraseOverlapIntervals(intervals: number[][]): number {
    intervals.sort((a, b) => a[0] - b[0]);
    let removals = 0, prevEnd = intervals[0][1];
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < prevEnd) {
            removals++;
            prevEnd = Math.min(prevEnd, intervals[i][1]);
        } else {
            prevEnd = intervals[i][1];
        }
    }
    return removals;
}
```

```python
class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda x: x[0])
        removals = 0
        prev_end = intervals[0][1]

        for i in range(1, len(intervals)):
            start, end = intervals[i]
            if start < prev_end:   # overlap
                removals += 1
                prev_end = min(prev_end, end)  # keep the one that ends sooner
            else:
                prev_end = end     # no overlap: update boundary

        return removals
```

```go
func eraseOverlapIntervals(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool { return intervals[i][0] < intervals[j][0] })
    removals, prevEnd := 0, intervals[0][1]
    for i := 1; i < len(intervals); i++ {
        if intervals[i][0] < prevEnd {
            removals++
            if intervals[i][1] < prevEnd { prevEnd = intervals[i][1] }
        } else {
            prevEnd = intervals[i][1]
        }
    }
    return removals
}
```

The `prev_end = min(prev_end, end)` is critical — when there's an overlap, we "remove" the interval ending later and keep the one ending sooner (more greedy-optimal).

## Approach 2: Sort by End Time (Classic Activity Selection)

The cleaner greedy: sort by end time, greedily keep every interval that doesn't overlap with the last kept one.

```cpp
class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(),
             [](const vector<int>& a, const vector<int>& b) {
                 return a[1] < b[1];  // sort by END time
             });

        int kept = 1;
        int lastEnd = intervals[0][1];

        for (int i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] >= lastEnd) {  // no overlap: keep this interval
                kept++;
                lastEnd = intervals[i][1];
            }
            // overlap: skip (implicitly remove) this interval
        }
        return intervals.size() - kept;
    }
};
```

```java
class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[1] - b[1]);  // sort by end time

        int kept = 1;
        int lastEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= lastEnd) {
                kept++;
                lastEnd = intervals[i][1];
            }
        }
        return intervals.length - kept;
    }
}
```

```typescript
function eraseOverlapIntervals(intervals: number[][]): number {
    intervals.sort((a, b) => a[1] - b[1]);  // sort by end time

    let kept = 1;
    let lastEnd = intervals[0][1];

    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {
            kept++;
            lastEnd = intervals[i][1];
        }
    }
    return intervals.length - kept;
}
```

```python
class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda x: x[1])  # sort by END time — greedy key

        kept = 1
        last_end = intervals[0][1]

        for i in range(1, len(intervals)):
            start, end = intervals[i]
            if start >= last_end:  # no overlap: keep this interval
                kept += 1
                last_end = end
            # else: overlap → skip (remove it)

        return len(intervals) - kept
```

```go
import "sort"

func eraseOverlapIntervals(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][1] < intervals[j][1]  // sort by end time
    })

    kept := 1
    lastEnd := intervals[0][1]

    for i := 1; i < len(intervals); i++ {
        if intervals[i][0] >= lastEnd {
            kept++
            lastEnd = intervals[i][1]
        }
    }
    return len(intervals) - kept
}
```

## Dry Run

```
Input: [[1,2],[2,3],[3,4],[1,3]]
Sort by end: [[1,2],[2,3],[1,3],[3,4]]

kept=1, lastEnd=2  (keep [1,2])

i=1: [2,3] → start=2 >= lastEnd=2 → keep. kept=2, lastEnd=3
i=2: [1,3] → start=1 < lastEnd=3 → overlap → skip (remove)
i=3: [3,4] → start=3 >= lastEnd=3 → keep. kept=3, lastEnd=4

kept=3, intervals.length=4
removals = 4 - 3 = 1 ✓
```

## Why Greedy by End Time Works

**Proof by exchange argument:** Suppose the optimal solution keeps a set S of intervals. If S contains an interval `a` that doesn't end earliest in its "position" in the sorted order, we can swap `a` for the interval ending earliest that starts after the previous kept interval. This swap doesn't decrease the count of kept intervals and produces a valid solution. By induction, the greedy solution is always at least as good as any optimal solution.

## Complexity

- **Time:** O(n log n) — sorting dominates; the greedy scan is O(n)
- **Space:** O(1) — no extra space beyond sorting

## Key Interview Insights

- **Minimum removals = n - maximum kept.** Reframing the problem reveals the classic activity selection greedy pattern.
- **Sort by end time for activity selection.** This is different from merge intervals (sort by start). The distinction trips many candidates up.
- **When overlapping, the greedy always removes the later-ending interval.** It "wastes" more future timeline. The earlier-ending interval is greedily better.
- **The no-overlap condition is `start >= lastEnd`** (not `>`). Intervals sharing an endpoint `[1,2],[2,3]` do NOT overlap — they're adjacent.
- **Connection to LIS:** The maximum number of non-overlapping intervals equals the longest chain of non-overlapping intervals — similar to Longest Increasing Subsequence structure but solved greedily here.
