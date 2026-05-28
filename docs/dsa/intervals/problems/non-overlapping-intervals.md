---
title: Non-Overlapping Intervals
difficulty: Medium
tags: [Array, Sorting, Greedy]
link: https://leetcode.com/problems/non-overlapping-intervals/
---

# Non-Overlapping Intervals

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [435. Non-Overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) |
| **Tags** | Array, Sorting, Greedy |

## Problem Statement

Given an array of intervals, return the **minimum number of intervals you need to remove** to make the rest non-overlapping.

**Example 1:**
```
Input:  intervals = [[1,2],[2,3],[3,4],[1,3]]
Output: 1
Explanation: Remove [1,3] — the rest are non-overlapping.
```

**Example 2:**
```
Input:  intervals = [[1,2],[1,2],[1,2]]
Output: 2
Explanation: Remove two [1,2] — one must remain.
```

**Example 3:**
```
Input:  intervals = [[1,2],[2,3]]
Output: 0
Explanation: Already non-overlapping (touching at 2 is ok).
```

---

## Intuition

This is the classic **Activity Selection Problem** — a fundamental greedy algorithm.

You want to **keep as many intervals as possible** without overlap. The answer (number to remove) = total intervals - max intervals you can keep.

**Greedy insight:** To maximize the number of intervals you keep, always select the interval that **ends earliest**. An interval that ends earlier leaves more time for future intervals, so it's always at least as good as any other choice. This is provable by exchange argument.

**After sorting by end time:** Walk through intervals, keeping a pointer to the end of the last kept interval. If the current interval starts at or after the last kept end → keep it (update pointer). Otherwise → it overlaps, remove it (increment count).

---

## Approach 1: Brute Force

Try all subsets of intervals, check each for non-overlap, track the maximum non-overlapping set size. O(2^n) — clearly impractical.

---

## Approach 2: Sort by End Time + Greedy (Optimal)

Sort by end time. Use `prevEnd` to track the end of the last kept interval. On overlap, always discard the current interval (which has a later end than `prevEnd`, so keeping `prevEnd` is better).

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end(),
             [](const auto& a, const auto& b) { return a[1] < b[1]; });

        int removed = 0;
        int prevEnd = INT_MIN;

        for (auto& iv : intervals) {
            if (iv[0] >= prevEnd) {
                prevEnd = iv[1]; // keep this interval
            } else {
                removed++;       // discard this interval
            }
        }
        return removed;
    }
};
```

```java
import java.util.*;

class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[1] - b[1]); // sort by end

        int removed = 0;
        int prevEnd = Integer.MIN_VALUE;

        for (int[] iv : intervals) {
            if (iv[0] >= prevEnd) {
                prevEnd = iv[1];
            } else {
                removed++;
            }
        }
        return removed;
    }
}
```

```typescript
function eraseOverlapIntervals(intervals: number[][]): number {
    intervals.sort((a, b) => a[1] - b[1]); // sort by end

    let removed = 0;
    let prevEnd = -Infinity;

    for (const [start, end] of intervals) {
        if (start >= prevEnd) {
            prevEnd = end;
        } else {
            removed++;
        }
    }
    return removed;
}
```

```python
class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda x: x[1])  # sort by end

        removed = 0
        prev_end = float('-inf')

        for start, end in intervals:
            if start >= prev_end:
                prev_end = end
            else:
                removed += 1
        return removed
```

```go
import "sort"

func eraseOverlapIntervals(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][1] < intervals[j][1]
    })

    removed := 0
    prevEnd := -1 << 62 // min int

    for _, iv := range intervals {
        if iv[0] >= prevEnd {
            prevEnd = iv[1]
        } else {
            removed++
        }
    }
    return removed
}
```

**Time:** O(n log n) — **Space:** O(log n) sort stack

---

## Dry Run

```
Input: [[1,2],[2,3],[3,4],[1,3]]
Sort by end: [[1,2],[2,3],[1,3],[3,4]]

prevEnd = -inf, removed = 0

iv=[1,2]: 1 >= -inf → keep, prevEnd=2
iv=[2,3]: 2 >= 2   → keep, prevEnd=3
iv=[1,3]: 1 >= 3?  → No → remove, removed=1
iv=[3,4]: 3 >= 3   → keep, prevEnd=4

Answer: 1 ✓
```

---

## Why Sort by End (Not Start)?

If we sort by start and greedily keep the earliest-starting non-overlapping intervals, we might keep long intervals that block many future ones.

Example: `[[1,100],[2,3],[3,4]]`
- Sort by start: keep `[1,100]` first → then `[2,3]` and `[3,4]` both conflict → remove 2
- Sort by end: keep `[2,3]`, `[3,4]` → `[1,100]` conflicts → remove 1 ✓

Sorting by end is the provably optimal greedy for activity selection.

---

## Alternative Framing

`answer = n - (max intervals we can keep without overlap)`

The max intervals you can keep is the classic greedy count:

```python
# Count of non-overlapping intervals (activity selection)
count = 0
prev_end = float('-inf')
for start, end in sorted(intervals, key=lambda x: x[1]):
    if start >= prev_end:
        count += 1
        prev_end = end
# intervals to remove = n - count
```

Both formulations give the same answer.

---

## Key Interview Insights

- **Sort by END, not start.** This is the counterintuitive but critical choice. Sort by start leads to wrong answers.
- **Overlap condition uses `>=` for start:** `iv[0] >= prevEnd` means "this interval starts at or after the last one ends" → no overlap. Adjacent intervals (touching at a point) are fine.
- **The greedy choice is local-globally optimal** via exchange argument: if you ever pick a longer interval over a shorter one, you can always swap them in without worsening the result.
- **Minimum arrows to burst balloons (LC 452)** is essentially the same problem — the number of arrows equals the number of non-overlapping intervals kept by this same greedy.
- **Connection to LIS:** This problem can also be solved as "n minus the length of the longest chain of non-overlapping intervals," which reduces to LIS on end times.

