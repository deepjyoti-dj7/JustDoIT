---
title: Meeting Rooms
difficulty: Easy
tags: [Array, Sorting, Intervals]
link: https://leetcode.com/problems/meeting-rooms/
---

# Meeting Rooms

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [252. Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) |
| **Tags** | Array, Sorting, Intervals |

## Problem Statement

Given an array of meeting time intervals `intervals[i] = [start, end]`, determine if a person could attend **all** meetings (i.e., no two meetings overlap).

**Example:**
```
Input:  [[0,30],[5,10],[15,20]]
Output: false   (0-30 overlaps with 5-10)

Input:  [[7,10],[2,4]]
Output: true
```

## Intuition

Two intervals overlap if one starts before the other ends. The problem reduces to: **are there any two overlapping intervals?**

**Key insight:** If we sort by start time, we only need to check consecutive pairs. An interval can only overlap with the immediately following one (since all others start even later). If sorted pair `[i]` and `[i+1]` don't overlap, no non-consecutive pair can overlap either.

**Overlap condition:** `intervals[i+1].start < intervals[i].end`

Note: `<` not `<=` because meetings can end and start at the same time (`[0,10],[10,20]` is fine — you leave one and enter the other instantly).

## Approach 1: Brute Force

Check every pair of intervals for overlap. O(n²).

```cpp
bool canAttendMeetings(vector<vector<int>>& intervals) {
    for (int i = 0; i < (int)intervals.size(); i++)
        for (int j = i + 1; j < (int)intervals.size(); j++) {
            auto& a = intervals[i]; auto& b = intervals[j];
            if (a[0] < b[1] && b[0] < a[1]) return false;
        }
    return true;
}
```

```java
public boolean canAttendMeetings(int[][] intervals) {
    for (int i = 0; i < intervals.length; i++)
        for (int j = i + 1; j < intervals.length; j++) {
            int[] a = intervals[i], b = intervals[j];
            if (a[0] < b[1] && b[0] < a[1]) return false;
        }
    return true;
}
```

```typescript
function canAttendMeetings(intervals: number[][]): boolean {
    for (let i = 0; i < intervals.length; i++)
        for (let j = i + 1; j < intervals.length; j++) {
            const [a0, a1] = intervals[i], [b0, b1] = intervals[j];
            if (a0 < b1 && b0 < a1) return false;
        }
    return true;
}
```

```python
class Solution:
    def canAttendMeetings(self, intervals: list[list[int]]) -> bool:
        for i in range(len(intervals)):
            for j in range(i + 1, len(intervals)):
                a, b = intervals[i], intervals[j]
                # Overlap if one starts before the other ends
                if a[0] < b[1] and b[0] < a[1]:
                    return False
        return True
```

```go
func canAttendMeetings(intervals [][]int) bool {
    for i := 0; i < len(intervals); i++ {
        for j := i + 1; j < len(intervals); j++ {
            a, b := intervals[i], intervals[j]
            if a[0] < b[1] && b[0] < a[1] { return false }
        }
    }
    return true
}
```

**Time:** O(n²) | **Space:** O(1)

## Approach 2: Sort + Linear Scan (Optimal)

```cpp
class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());  // sort by start time

        for (int i = 0; i + 1 < intervals.size(); i++) {
            // If next meeting starts before current ends → overlap
            if (intervals[i + 1][0] < intervals[i][1])
                return false;
        }
        return true;
    }
};
```

```java
class Solution {
    public boolean canAttendMeetings(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

        for (int i = 0; i + 1 < intervals.length; i++) {
            if (intervals[i + 1][0] < intervals[i][1])
                return false;
        }
        return true;
    }
}
```

```typescript
function canAttendMeetings(intervals: number[][]): boolean {
    intervals.sort((a, b) => a[0] - b[0]);

    for (let i = 0; i + 1 < intervals.length; i++) {
        if (intervals[i + 1][0] < intervals[i][1])
            return false;
    }
    return true;
}
```

```python
class Solution:
    def canAttendMeetings(self, intervals: list[list[int]]) -> bool:
        intervals.sort(key=lambda x: x[0])

        for i in range(len(intervals) - 1):
            if intervals[i + 1][0] < intervals[i][1]:
                return False
        return True
```

```go
import "sort"

func canAttendMeetings(intervals [][]int) bool {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    for i := 0; i+1 < len(intervals); i++ {
        if intervals[i+1][0] < intervals[i][1] {
            return false
        }
    }
    return true
}
```

**Time:** O(n log n) | **Space:** O(1) (or O(log n) for sort)

## Key Interview Insights

- **Sort first.** After sorting by start time, overlaps can only exist between consecutive pairs. This reduces O(n²) comparisons to O(n).
- **The overlap condition is `next.start < curr.end`**, not `<=`. Meetings can share an endpoint — `[1,5]` and `[5,10]` don't overlap; you attend one then the other.
- **This is the foundation for Meeting Rooms II.** Understanding this simpler version makes the harder one (minimum rooms needed) much clearer.
- **Variation: find which meetings conflict.** Return the pair of overlapping intervals, not just a boolean.
