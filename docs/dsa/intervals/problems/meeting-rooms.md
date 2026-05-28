---
title: Meeting Rooms
difficulty: Easy
tags: [Array, Sorting]
link: https://leetcode.com/problems/meeting-rooms/
---

# Meeting Rooms

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [252. Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) |
| **Tags** | Array, Sorting |

## Problem Statement

Given an array of meeting time intervals where `intervals[i] = [start_i, end_i]`, determine if a person could attend **all** meetings.

**Example 1:**
```
Input:  intervals = [[0,30],[5,10],[15,20]]
Output: false
Explanation: Meeting [0,30] conflicts with [5,10] and [15,20].
```

**Example 2:**
```
Input:  intervals = [[7,10],[2,4]]
Output: true
```

---

## Intuition

A person can attend all meetings if and only if **no two meetings overlap**. After sorting by start time, you only need to check adjacent pairs — if any meeting starts before the previous one ends, there's a conflict.

This is the simplest interval overlap problem. The answer is a single boolean.

---

## Approach 1: Brute Force (O(n^2))

Check every pair of intervals for overlap.

For intervals `[a1,a2]` and `[b1,b2]`: they overlap if `a1 < b2 AND b1 < a2`.

This is O(n^2) time and unnecessary — sorting gives us O(n log n) with a much simpler check.

---

## Approach 2: Sort + Linear Scan (Optimal)

Sort by start time. Walk the sorted list and check if any meeting starts before the previous one ends.

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    bool canAttendMeetings(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());

        for (int i = 1; i < (int)intervals.size(); i++) {
            if (intervals[i][0] < intervals[i-1][1]) {
                return false; // overlap found
            }
        }
        return true;
    }
};
```

```java
import java.util.*;

class Solution {
    public boolean canAttendMeetings(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < intervals[i-1][1]) {
                return false;
            }
        }
        return true;
    }
}
```

```typescript
function canAttendMeetings(intervals: number[][]): boolean {
    intervals.sort((a, b) => a[0] - b[0]);

    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < intervals[i-1][1]) {
            return false;
        }
    }
    return true;
}
```

```python
class Solution:
    def canAttendMeetings(self, intervals: list[list[int]]) -> bool:
        intervals.sort(key=lambda x: x[0])

        for i in range(1, len(intervals)):
            if intervals[i][0] < intervals[i-1][1]:
                return False
        return True
```

```go
import "sort"

func canAttendMeetings(intervals [][]int) bool {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })

    for i := 1; i < len(intervals); i++ {
        if intervals[i][0] < intervals[i-1][1] {
            return false
        }
    }
    return true
}
```

**Time:** O(n log n) — **Space:** O(log n) sort stack

---

## Dry Run

```
Input: [[0,30],[5,10],[15,20]]
After sort: [[0,30],[5,10],[15,20]]

i=1: intervals[1][0]=5 < intervals[0][1]=30 → return false ✓

Input: [[7,10],[2,4]]
After sort: [[2,4],[7,10]]

i=1: intervals[1][0]=7 < intervals[0][1]=4? No → continue
Loop ends → return true ✓
```

---

## Key Interview Insights

- **Only adjacent pairs matter after sorting.** If sorted by start, a conflict can only exist between consecutive intervals.
- **Overlap condition:** `curr.start < prev.end` (strict less-than). If `curr.start == prev.end`, meetings are back-to-back — no overlap (a meeting ending at 10 and one starting at 10 don't conflict).
- **This is the warmup to Meeting Rooms II** (LC 253). If asked "how many rooms?", that's the follow-up.
- **Edge cases:** empty array (trivially true, loop doesn't run), single interval (true).
- **Why not check `curr.start <= prev.end`?** Because `[1,4]` and `[4,5]` are touching at a point but don't truly conflict — you finish at 4 and start at 4. The strict `<` is correct here.

