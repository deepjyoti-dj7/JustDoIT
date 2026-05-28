---
title: Insert Interval
difficulty: Medium
tags: [Array, Sorting, Intervals]
link: https://leetcode.com/problems/insert-interval/
---

# Insert Interval

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [57. Insert Interval](https://leetcode.com/problems/insert-interval/) |
| **Tags** | Array, Intervals |

## Problem Statement

Given a sorted array of non-overlapping intervals and a new interval, insert the new interval and merge if necessary. The existing intervals are sorted by start time and non-overlapping.

**Example:**
```
Input:  intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
```

## Intuition

Because the intervals are already sorted and non-overlapping, we can handle this in three phases with a single pass:

1. **Add all intervals that end before the new interval starts** → they're entirely to the left, no overlap
2. **Merge all intervals that overlap with the new interval** → update new interval's bounds
3. **Add all remaining intervals** → they're entirely to the right, no overlap

The overlap condition: `existing.end >= newInterval.start AND existing.start <= newInterval.end`

Simplified: intervals that DON'T overlap are those where `existing.end < new.start` (to the left) or `existing.start > new.end` (to the right).

## Approach: Single-Pass Three-Phase (Optimal)

```cpp
class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> result;
        int i = 0, n = intervals.size();

        // Phase 1: Add all intervals ending before newInterval starts
        while (i < n && intervals[i][1] < newInterval[0])
            result.push_back(intervals[i++]);

        // Phase 2: Merge all overlapping intervals into newInterval
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.push_back(newInterval);  // add the merged result

        // Phase 3: Add all remaining intervals
        while (i < n) result.push_back(intervals[i++]);

        return result;
    }
};
```

```java
class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0, n = intervals.length;

        // Phase 1: before new interval
        while (i < n && intervals[i][1] < newInterval[0])
            result.add(intervals[i++]);

        // Phase 2: merge overlapping
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);

        // Phase 3: after new interval
        while (i < n) result.add(intervals[i++]);

        return result.toArray(new int[0][]);
    }
}
```

```typescript
function insert(intervals: number[][], newInterval: number[]): number[][] {
    const result: number[][] = [];
    let i = 0;
    const n = intervals.length;

    // Phase 1: no overlap, interval is to the left
    while (i < n && intervals[i][1] < newInterval[0])
        result.push(intervals[i++]);

    // Phase 2: merge overlapping intervals
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push(newInterval);

    // Phase 3: no overlap, interval is to the right
    while (i < n) result.push(intervals[i++]);

    return result;
}
```

```python
class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        result = []
        i = 0
        n = len(intervals)

        # Phase 1: Add intervals that end before new interval starts
        while i < n and intervals[i][1] < newInterval[0]:
            result.append(intervals[i])
            i += 1

        # Phase 2: Merge all overlapping intervals
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
        result.append(newInterval)

        # Phase 3: Add remaining intervals
        while i < n:
            result.append(intervals[i])
            i += 1

        return result
```

```go
func insert(intervals [][]int, newInterval []int) [][]int {
    result := [][]int{}
    i, n := 0, len(intervals)

    for i < n && intervals[i][1] < newInterval[0] {
        result = append(result, intervals[i]); i++
    }
    for i < n && intervals[i][0] <= newInterval[1] {
        if intervals[i][0] < newInterval[0] { newInterval[0] = intervals[i][0] }
        if intervals[i][1] > newInterval[1] { newInterval[1] = intervals[i][1] }
        i++
    }
    result = append(result, newInterval)
    for i < n { result = append(result, intervals[i]); i++ }
    return result
}
```

## Dry Run

```
intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]]
newInterval = [4,8]

Phase 1 (end < 4):
  [1,2]: end=2 < 4 → add. result=[[1,2]]
  [3,5]: end=5 >= 4 → stop. i=1

Phase 2 (start <= 8):
  [3,5]:  start=3 <= 8 → merge → new=[3,8]
  [6,7]:  start=6 <= 8 → merge → new=[3,8]
  [8,10]: start=8 <= 8 → merge → new=[3,10]
  [12,16]:start=12 > 8 → stop. i=4
  add [3,10] → result=[[1,2],[3,10]]

Phase 3:
  [12,16] → add. result=[[1,2],[3,10],[12,16]]

Output: [[1,2],[3,10],[12,16]] ✓
```

## Complexity

- **Time:** O(n) — single pass through all intervals
- **Space:** O(n) — output array

## Key Interview Insights

- **No sorting needed** — the input is already sorted. This is O(n) vs O(n log n) for merge intervals.
- **The three-phase structure is clean and error-free.** Trying to handle all cases in one loop leads to messy conditionals. The three-while structure is much clearer.
- **Condition for "no overlap, to the left": `intervals[i][1] < newInterval[0]`** (the existing interval ends before new one starts).
- **Condition for "no overlap, to the right": `intervals[i][0] > newInterval[1]`** (which is naturally handled by the remaining-intervals phase after merging stops).
- **Edge cases:** Empty intervals array (return `[newInterval]`) and new interval at the very beginning or end — all handled cleanly by the three-phase structure.
