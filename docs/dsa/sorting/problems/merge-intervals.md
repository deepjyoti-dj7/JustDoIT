---
title: Merge Intervals
difficulty: Medium
tags: [Array, Sorting, Intervals]
link: https://leetcode.com/problems/merge-intervals/
---

# Merge Intervals

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/) |
| **Tags** | Array, Sorting, Intervals |

## Problem Statement

Given an array of intervals `intervals[i] = [start, end]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.

**Example:**
```
Input:  [[1,3], [2,6], [8,10], [15,18]]
Output: [[1,6], [8,10], [15,18]]

[1,3] and [2,6] overlap (3 >= 2) → merged to [1,6]
```

## Intuition

Two intervals overlap if the start of one is ≤ the end of the other. The key insight: **if we sort by start time, overlapping intervals are always adjacent**. We never need to compare an interval with one far away.

After sorting, walk through intervals and greedily extend the current merged interval if the next one overlaps. If it doesn't overlap, the current interval is finalized.

**Overlap condition:** `nextInterval.start <= currentMerged.end`

## Approach 1: Brute Force

For each interval, check all others for overlap and merge repeatedly until no more merges are possible. O(n²) or worse.

This works but is slow — skip to the optimal approach in interviews.

## Approach 2: Sort + Greedy Merge (Optimal)

```cpp
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());  // sort by start time
        vector<vector<int>> merged;

        for (auto& interval : intervals) {
            // No overlap with last merged interval → start a new one
            if (merged.empty() || interval[0] > merged.back()[1]) {
                merged.push_back(interval);
            } else {
                // Overlap → extend the end of the last merged interval
                merged.back()[1] = max(merged.back()[1], interval[1]);
            }
        }
        return merged;
    }
};
```

```java
class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> merged = new ArrayList<>();

        for (int[] interval : intervals) {
            if (merged.isEmpty() || interval[0] > merged.get(merged.size() - 1)[1]) {
                merged.add(interval);
            } else {
                merged.get(merged.size() - 1)[1] =
                    Math.max(merged.get(merged.size() - 1)[1], interval[1]);
            }
        }
        return merged.toArray(new int[0][]);
    }
}
```

```typescript
function merge(intervals: number[][]): number[][] {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged: number[][] = [];

    for (const interval of intervals) {
        if (merged.length === 0 || interval[0] > merged[merged.length - 1][1]) {
            merged.push(interval);
        } else {
            merged[merged.length - 1][1] =
                Math.max(merged[merged.length - 1][1], interval[1]);
        }
    }
    return merged;
}
```

```python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort(key=lambda x: x[0])  # sort by start time
        merged = []

        for start, end in intervals:
            if not merged or start > merged[-1][1]:
                merged.append([start, end])
            else:
                # Overlap: extend the current interval's end
                merged[-1][1] = max(merged[-1][1], end)

        return merged
```

```go
import "sort"

func merge(intervals [][]int) [][]int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })

    merged := [][]int{}
    for _, interval := range intervals {
        if len(merged) == 0 || interval[0] > merged[len(merged)-1][1] {
            merged = append(merged, interval)
        } else {
            if interval[1] > merged[len(merged)-1][1] {
                merged[len(merged)-1][1] = interval[1]
            }
        }
    }
    return merged
}
```

## Dry Run

```
Input: [[1,3], [2,6], [8,10], [15,18]]
After sort: [[1,3], [2,6], [8,10], [15,18]] (already sorted)

Process [1,3]:  merged=[] → push → merged=[[1,3]]
Process [2,6]:  2 <= 3 (overlap) → extend → merged=[[1,6]]
Process [8,10]: 8 > 6 (no overlap) → push → merged=[[1,6],[8,10]]
Process [15,18]:15 > 10 (no overlap) → push → merged=[[1,6],[8,10],[15,18]]

Output: [[1,6],[8,10],[15,18]] ✓
```

## Complexity

- **Time:** O(n log n) — dominated by sorting; the merge pass is O(n)
- **Space:** O(n) — output array (O(log n) for sort stack if not counted)

## Key Interview Insights

- **Sort by start time first.** This is the critical setup that makes the greedy merge work. Without sorting, you'd have to check every pair.
- **Use `max` when extending end.** An interval can be completely contained inside another: `[1,10]` then `[2,5]` — the end stays `10`, not drops to `5`.
- **The condition is `start > last_end` for no overlap, `start <= last_end` for overlap.** Touching intervals `[1,3],[3,5]` DO overlap (share endpoint 3) — the condition handles this correctly.
- **This is the foundation for Insert Interval, Non-Overlapping Intervals, and Meeting Rooms.** Master this pattern first.
