---
title: Merge Intervals
difficulty: Medium
tags: [Array, Sorting]
link: https://leetcode.com/problems/merge-intervals/
---

# Merge Intervals

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/) |
| **Tags** | Array, Sorting |

## Problem Statement

Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.

**Example 1:**
```
Input:  intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: [1,3] and [2,6] overlap, merge to [1,6].
```

**Example 2:**
```
Input:  intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: [1,4] and [4,5] are considered overlapping.
```

---

## Intuition

If intervals were sorted by start time, you'd only ever need to compare the new interval against the last one you added to the result. After sorting, each interval either:
- Starts after the previous one ends → no overlap, just append
- Starts during or before the previous one ends → overlap, extend the end

The "extend the end" step uses `max` because one interval might be completely inside another (e.g., `[1,10]` contains `[2,4]`).

---

## Approach 1: Brute Force (O(n^2))

For each interval, check all other intervals for overlap and merge. Repeat until no more merges can be done. Not worth implementing — the sort-based approach is clearly better.

---

## Approach 2: Sort + Greedy (Optimal)

1. Sort intervals by start time
2. Initialize result with the first interval
3. For each subsequent interval:
   - If it overlaps with the last result interval → merge (extend end)
   - Otherwise → append as new interval

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> res;

        for (auto& iv : intervals) {
            if (res.empty() || res.back()[1] < iv[0]) {
                res.push_back(iv);
            } else {
                res.back()[1] = max(res.back()[1], iv[1]);
            }
        }
        return res;
    }
};
```

```java
import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> res = new ArrayList<>();

        for (int[] iv : intervals) {
            if (res.isEmpty() || res.get(res.size()-1)[1] < iv[0]) {
                res.add(iv);
            } else {
                res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], iv[1]);
            }
        }
        return res.toArray(new int[0][]);
    }
}
```

```typescript
function merge(intervals: number[][]): number[][] {
    intervals.sort((a, b) => a[0] - b[0]);
    const res: number[][] = [];

    for (const iv of intervals) {
        if (res.length === 0 || res[res.length-1][1] < iv[0]) {
            res.push([...iv]);
        } else {
            res[res.length-1][1] = Math.max(res[res.length-1][1], iv[1]);
        }
    }
    return res;
}
```

```python
class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort(key=lambda x: x[0])
        res = []

        for iv in intervals:
            if not res or res[-1][1] < iv[0]:
                res.append(list(iv))
            else:
                res[-1][1] = max(res[-1][1], iv[1])
        return res
```

```go
import "sort"

func merge(intervals [][]int) [][]int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    res := [][]int{}

    for _, iv := range intervals {
        if len(res) == 0 || res[len(res)-1][1] < iv[0] {
            res = append(res, []int{iv[0], iv[1]})
        } else if iv[1] > res[len(res)-1][1] {
            res[len(res)-1][1] = iv[1]
        }
    }
    return res
}
```

**Time:** O(n log n) — **Space:** O(n)

---

## Dry Run

```
Input: [[1,3],[2,6],[8,10],[15,18]]
After sort: [[1,3],[2,6],[8,10],[15,18]]

Step 1: res=[] → push [1,3]        → res=[[1,3]]
Step 2: res[-1][1]=3 >= iv[0]=2    → merge: res=[[1,6]]
Step 3: res[-1][1]=6 < iv[0]=8    → push [8,10]   → res=[[1,6],[8,10]]
Step 4: res[-1][1]=10 < iv[0]=15  → push [15,18]  → res=[[1,6],[8,10],[15,18]]

Output: [[1,6],[8,10],[15,18]] ✓
```

---

## Key Interview Insights

- **Always sort first.** This is the only thing standing between O(n^2) and O(n log n).
- **Use `max` when extending the end.** `[1,10]` followed by `[2,4]` should stay `[1,10]`, not shrink to `[1,4]`.
- **Adjacent intervals:** `[1,4]` and `[4,5]` overlap — the condition `res.back()[1] < iv[0]` (strictly less) handles this correctly: `4 < 4` is false, so they merge.
- **Only one interval:** edge case that works naturally — the loop body runs once, pushing the single interval.
- **In-place vs new output:** You can't easily merge in-place in a single pass because merging changes downstream relationships. Output to a new list.

