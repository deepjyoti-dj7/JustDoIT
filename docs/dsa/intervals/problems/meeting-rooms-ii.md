---
title: Meeting Rooms II
difficulty: Medium
tags: [Array, Sorting, Heap, Greedy]
link: https://leetcode.com/problems/meeting-rooms-ii/
---

# Meeting Rooms II

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [253. Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) |
| **Tags** | Array, Sorting, Heap, Greedy |

## Problem Statement

Given an array of meeting time intervals where `intervals[i] = [start_i, end_i]`, return the **minimum number of conference rooms** required.

**Example 1:**
```
Input:  intervals = [[0,30],[5,10],[15,20]]
Output: 2
```

**Example 2:**
```
Input:  intervals = [[7,10],[2,4]]
Output: 1
```

---

## Intuition

At any point in time, the number of rooms you need equals the number of meetings happening simultaneously. You want the **peak simultaneous overlap** across all time.

Think of it this way: as you process meetings in chronological order, if a room is free (its meeting ended), reuse it. If no room is free, open a new one. The max rooms open at any time is the answer.

---

## Approach 1: Brute Force (O(n^2))

For each meeting, count how many other meetings overlap with it. The maximum count is the answer. O(n^2) time, no sorting needed but too slow.

---

## Approach 2: Min-Heap of End Times (Optimal)

Sort by start time. Use a min-heap that stores end times of ongoing meetings.

For each meeting:
- If the earliest-ending meeting ends at or before the current start → that room is free. Pop it and reuse (update its end time).
- Otherwise → all current meetings are still ongoing. Open a new room (push).

The heap size at the end is the answer.

```cpp
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        priority_queue<int, vector<int>, greater<int>> minHeap; // min-heap of end times

        for (auto& iv : intervals) {
            if (!minHeap.empty() && minHeap.top() <= iv[0]) {
                minHeap.pop(); // room freed
            }
            minHeap.push(iv[1]); // allocate room
        }
        return (int)minHeap.size();
    }
};
```

```java
import java.util.*;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        for (int[] iv : intervals) {
            if (!minHeap.isEmpty() && minHeap.peek() <= iv[0]) {
                minHeap.poll();
            }
            minHeap.offer(iv[1]);
        }
        return minHeap.size();
    }
}
```

```typescript
function minMeetingRooms(intervals: number[][]): number {
    // No built-in heap in JS — use the two-pointer approach instead
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends   = intervals.map(i => i[1]).sort((a, b) => a - b);

    let rooms = 0, endPtr = 0;
    for (let i = 0; i < starts.length; i++) {
        if (starts[i] < ends[endPtr]) {
            rooms++;
        } else {
            endPtr++; // one meeting ended, reuse the room
        }
    }
    return rooms;
}
```

```python
import heapq

class Solution:
    def minMeetingRooms(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda x: x[0])
        min_heap: list[int] = []  # end times of active meetings

        for start, end in intervals:
            if min_heap and min_heap[0] <= start:
                heapq.heapreplace(min_heap, end)
            else:
                heapq.heappush(min_heap, end)
        return len(min_heap)
```

```go
import (
    "container/heap"
    "sort"
)

type MinHeap []int
func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any          { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }

func minMeetingRooms(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    h := &MinHeap{}
    heap.Init(h)

    for _, iv := range intervals {
        if h.Len() > 0 && (*h)[0] <= iv[0] {
            heap.Pop(h)
        }
        heap.Push(h, iv[1])
    }
    return h.Len()
}
```

**Time:** O(n log n) — **Space:** O(n) heap

---

## Approach 3: Two-Pointer on Sorted Start/End Arrays

Sort starts and ends separately. Use a pointer into ends to track the earliest-ending meeting. If a new meeting starts before the earliest end, we need a new room; otherwise, we reuse one.

This achieves the exact same result as the heap without needing a heap data structure.

```
starts: [0, 5, 15]
ends:   [10, 20, 30]
ePtr=0, rooms=0

i=0: s=0 < e[0]=10 → rooms=1
i=1: s=5 < e[0]=10 → rooms=2
i=2: s=15 >= e[0]=10 → ePtr=1, rooms stays 2

Answer: 2
```

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        vector<int> starts, ends;
        for (auto& iv : intervals) {
            starts.push_back(iv[0]);
            ends.push_back(iv[1]);
        }
        sort(starts.begin(), starts.end());
        sort(ends.begin(), ends.end());

        int rooms = 0, ePtr = 0;
        for (int i = 0; i < (int)starts.size(); i++) {
            if (starts[i] < ends[ePtr]) {
                rooms++;
            } else {
                ePtr++;
            }
        }
        return rooms;
    }
};
```

```java
import java.util.*;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        int n = intervals.length;
        int[] starts = new int[n];
        int[] ends   = new int[n];
        for (int i = 0; i < n; i++) {
            starts[i] = intervals[i][0];
            ends[i]   = intervals[i][1];
        }
        Arrays.sort(starts);
        Arrays.sort(ends);

        int rooms = 0, ePtr = 0;
        for (int i = 0; i < n; i++) {
            if (starts[i] < ends[ePtr]) {
                rooms++;
            } else {
                ePtr++;
            }
        }
        return rooms;
    }
}
```

```typescript
function minMeetingRooms(intervals: number[][]): number {
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends   = intervals.map(i => i[1]).sort((a, b) => a - b);

    let rooms = 0, ePtr = 0;
    for (let i = 0; i < starts.length; i++) {
        if (starts[i] < ends[ePtr]) {
            rooms++;
        } else {
            ePtr++;
        }
    }
    return rooms;
}
```

```python
class Solution:
    def minMeetingRooms(self, intervals: list[list[int]]) -> int:
        starts = sorted(iv[0] for iv in intervals)
        ends   = sorted(iv[1] for iv in intervals)

        rooms, e_ptr = 0, 0
        for start in starts:
            if start < ends[e_ptr]:
                rooms += 1
            else:
                e_ptr += 1
        return rooms
```

```go
import "sort"

func minMeetingRooms(intervals [][]int) int {
    n := len(intervals)
    starts := make([]int, n)
    ends   := make([]int, n)
    for i, iv := range intervals {
        starts[i] = iv[0]
        ends[i]   = iv[1]
    }
    sort.Ints(starts)
    sort.Ints(ends)

    rooms, ePtr := 0, 0
    for i := 0; i < n; i++ {
        if starts[i] < ends[ePtr] {
            rooms++
        } else {
            ePtr++
        }
    }
    return rooms
}
```

**Time:** O(n log n) — **Space:** O(n)

---

## Dry Run (Heap Approach)

```
Input: [[0,30],[5,10],[15,20]]
After sort: [[0,30],[5,10],[15,20]]

iv=[0,30]: heap=[]         → push 30 → heap=[30]
iv=[5,10]: heap.top=30>5  → push 10 → heap=[10,30]
iv=[15,20]: heap.top=10<=15 → pop 10, push 20 → heap=[20,30]

heap.size() = 2 → Answer: 2 ✓
```

---

## Key Interview Insights

- **Min-heap of end times** is the canonical approach. The heap always shows you the "most available" room (earliest to free up).
- **The heap pop condition:** `heap.top <= interval.start`. Use `<=` here because if a meeting ends exactly when the next starts, the room is free to reuse.
- **Why min-heap?** You always want to check if the *soonest*-ending meeting is done. A max-heap would give you the latest-ending, which is useless for this decision.
- **Two-pointer alternative** is elegant for TypeScript/JavaScript where no built-in heap exists — same O(n log n) complexity via two sorts.
- **The answer is not just "max simultaneous" in a naive sense** — you must account for meetings ending as others begin. The heap naturally handles this.
- **Follow-up:** "Which rooms are assigned which meetings?" — use a map from room ID to end time instead of a simple heap.

