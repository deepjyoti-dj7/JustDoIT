---
title: Insert Interval
difficulty: Medium
tags: [Array, Sorting]
link: https://leetcode.com/problems/insert-interval/
---

# Insert Interval

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [57. Insert Interval](https://leetcode.com/problems/insert-interval/) |
| **Tags** | Array, Sorting |

## Problem Statement

You are given an array of **non-overlapping** intervals `intervals` sorted in ascending order by start time, and a single interval `newInterval`. Insert `newInterval` into `intervals`, merging if necessary, such that the result is still sorted and non-overlapping.

**Example 1:**
```
Input:  intervals = [[1,3],[6,9]], newInterval = [2,5]
Output: [[1,5],[6,9]]
```

**Example 2:**
```
Input:  intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
Output: [[1,2],[3,10],[12,16]]
```

**Example 3:**
```
Input:  intervals = [], newInterval = [5,7]
Output: [[5,7]]
```

---

## Intuition

The key insight: the input is already sorted and non-overlapping. You don't need to re-sort. Instead, do one linear pass through three distinct phases:

- **Phase 1 (Before):** Intervals that end before `newInterval` starts. These can't overlap — add them directly.
- **Phase 2 (Merge):** Intervals that overlap with `newInterval`. Merge each one in by expanding `newInterval`'s boundaries.
- **Phase 3 (After):** Intervals that start after `newInterval` ends. Add them directly.

The merged `newInterval` is inserted at the boundary between Phase 1 and Phase 3.

```
Intervals:   [1,2]  [3,5]  [6,7]  [8,10]  [12,16]
New:         [4,8]

Phase 1: [1,2] ends at 2 < 4 → add as-is
Phase 2: [3,5] overlaps [4,8] → newInterval = [3,8]
         [6,7] overlaps [3,8] → newInterval = [3,8]
         [8,10] overlaps [3,8] → newInterval = [3,10]
Phase 3: [12,16] starts at 12 > 10 → add newInterval=[3,10], then [12,16]

Result: [[1,2],[3,10],[12,16]]
```

---

## Approach: Three-Phase Linear Scan (Optimal)

No sort needed. One pass, O(n).

An interval `iv` is in:
- Phase 1 if `iv[1] < newInterval[0]` (ends before new starts)
- Phase 2 if `iv[0] <= newInterval[1]` (starts before new ends — overlaps)
- Phase 3 otherwise (starts after new ends)

```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> res;
        int i = 0, n = intervals.size();

        // Phase 1: no overlap, interval ends before newInterval starts
        while (i < n && intervals[i][1] < newInterval[0]) {
            res.push_back(intervals[i++]);
        }

        // Phase 2: merge overlapping intervals into newInterval
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.push_back(newInterval);

        // Phase 3: no overlap, interval starts after newInterval ends
        while (i < n) {
            res.push_back(intervals[i++]);
        }
        return res;
    }
};
```

```java
import java.util.*;

class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> res = new ArrayList<>();
        int i = 0, n = intervals.length;

        // Phase 1: before
        while (i < n && intervals[i][1] < newInterval[0]) {
            res.add(intervals[i++]);
        }

        // Phase 2: merge
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.add(newInterval);

        // Phase 3: after
        while (i < n) res.add(intervals[i++]);

        return res.toArray(new int[0][]);
    }
}
```

```typescript
function insert(intervals: number[][], newInterval: number[]): number[][] {
    const res: number[][] = [];
    let i = 0;
    const n = intervals.length;

    // Phase 1: before
    while (i < n && intervals[i][1] < newInterval[0]) {
        res.push(intervals[i++]);
    }

    // Phase 2: merge
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.push([...newInterval]);

    // Phase 3: after
    while (i < n) res.push(intervals[i++]);

    return res;
}
```

```python
class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        res = []
        i, n = 0, len(intervals)

        # Phase 1: before
        while i < n and intervals[i][1] < newInterval[0]:
            res.append(intervals[i])
            i += 1

        # Phase 2: merge
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
        res.append(newInterval)

        # Phase 3: after
        while i < n:
            res.append(intervals[i])
            i += 1

        return res
```

```go
func insert(intervals [][]int, newInterval []int) [][]int {
    res := [][]int{}
    i, n := 0, len(intervals)

    // Phase 1: before
    for i < n && intervals[i][1] < newInterval[0] {
        res = append(res, intervals[i])
        i++
    }

    // Phase 2: merge
    for i < n && intervals[i][0] <= newInterval[1] {
        if intervals[i][0] < newInterval[0] {
            newInterval[0] = intervals[i][0]
        }
        if intervals[i][1] > newInterval[1] {
            newInterval[1] = intervals[i][1]
        }
        i++
    }
    res = append(res, newInterval)

    // Phase 3: after
    for i < n {
        res = append(res, intervals[i])
        i++
    }
    return res
}
```

**Time:** O(n) — **Space:** O(n) for output

---

## Dry Run

```
intervals = [[1,3],[6,9]], newInterval = [2,5]

Phase 1:
  i=0: intervals[0][1]=3 < newInterval[0]=2? No → stop

Phase 2:
  i=0: intervals[0][0]=1 <= newInterval[1]=5? Yes
       newInterval = [min(2,1), max(5,3)] = [1,5], i=1
  i=1: intervals[1][0]=6 <= newInterval[1]=5? No → stop
  push newInterval=[1,5] → res=[[1,5]]

Phase 3:
  i=1: push [6,9] → res=[[1,5],[6,9]]

Output: [[1,5],[6,9]] ✓
```

---

## Key Interview Insights

- **No re-sort needed** — the input guarantee of sorted, non-overlapping intervals is a gift. Exploit it with a linear scan instead of re-sorting O(n log n).
- **The three-phase structure is the entire solution.** Memorize the two boundary conditions: `iv[1] < new[0]` for Phase 1, `iv[0] <= new[1]` for Phase 2.
- **newInterval expands during Phase 2.** Both boundaries may be updated — always use `min` for start and `max` for end.
- **Edge cases that work naturally:** empty `intervals` (skips all phases, just pushes `newInterval`), `newInterval` at the start or end, `newInterval` that swallows all existing intervals.
- **Modify `newInterval` in-place during Phase 2** — this is safe and keeps the code clean.

