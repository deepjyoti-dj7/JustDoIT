---
title: Meeting Rooms II
difficulty: Medium
tags: [Array, Sorting, Intervals, Heap, Two Pointers]
link: https://leetcode.com/problems/meeting-rooms-ii/
---

# Meeting Rooms II

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [253. Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) |
| **Tags** | Array, Sorting, Intervals, Heap, Two Pointers |

## Problem Statement

Given an array of meeting time intervals `intervals[i] = [start, end]`, find the **minimum number of conference rooms** required to hold all meetings.

**Example:**
```
Input:  [[0,30],[5,10],[15,20]]
Output: 2

At time 5: meetings [0,30] and [5,10] are both active → need 2 rooms
```

## Intuition

We need to track how many meetings are running simultaneously at any point. The peak simultaneous count is the answer.

**Key insight:** Think of meetings as "events." Each meeting generates two events:
- A start event: someone arrives, need one more room
- An end event: someone leaves, free up a room

If we process these events in time order, the maximum "rooms in use" at any moment is the answer.

**Alternative intuition with min-heap:** Sort meetings by start time. Use a min-heap to track end times of currently running meetings. When a new meeting starts, if the earliest-ending meeting is already done, reuse its room. Otherwise, allocate a new room.

## Approach 1: Min-Heap (Sort by Start + Track Earliest End)

Maintain a min-heap of end times for ongoing meetings.

```cpp
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());  // sort by start time
        priority_queue<int, vector<int>, greater<int>> heap;  // min-heap of end times

        for (auto& interval : intervals) {
            int start = interval[0], end = interval[1];
            // If the earliest-ending meeting is done, reuse its room
            if (!heap.empty() && heap.top() <= start)
                heap.pop();
            heap.push(end);  // assign room with this end time
        }
        return heap.size();  // rooms currently in use = total rooms needed
    }
};
```

```java
class Solution {
    public int minMeetingRooms(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        PriorityQueue<Integer> heap = new PriorityQueue<>();  // min-heap of end times

        for (int[] interval : intervals) {
            if (!heap.isEmpty() && heap.peek() <= interval[0])
                heap.poll();  // reuse room
            heap.offer(interval[1]);
        }
        return heap.size();
    }
}
```

```typescript
function minMeetingRooms(intervals: number[][]): number {
    intervals.sort((a, b) => a[0] - b[0]);

    // Min-heap simulation using sorted array (for simplicity)
    const endTimes: number[] = [];

    for (const [start, end] of intervals) {
        endTimes.sort((a, b) => a - b);  // keep sorted (use actual heap in prod)
        if (endTimes.length > 0 && endTimes[0] <= start) {
            endTimes.shift();  // reuse earliest-ending room
        }
        endTimes.push(end);
    }
    return endTimes.length;
}
```

```python
import heapq

class Solution:
    def minMeetingRooms(self, intervals: list[list[int]]) -> int:
        intervals.sort(key=lambda x: x[0])  # sort by start time
        heap: list[int] = []  # min-heap of end times for active meetings

        for start, end in intervals:
            # If the meeting ending soonest is already done, free that room
            if heap and heap[0] <= start:
                heapq.heappop(heap)
            heapq.heappush(heap, end)

        return len(heap)  # remaining active meetings = rooms needed
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
func (h *MinHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() interface{}   { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }

func minMeetingRooms(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool { return intervals[i][0] < intervals[j][0] })
    h := &MinHeap{}
    heap.Init(h)
    for _, iv := range intervals {
        if h.Len() > 0 && (*h)[0] <= iv[0] { heap.Pop(h) }
        heap.Push(h, iv[1])
    }
    return h.Len()
}
```

## Approach 2: Two-Sorted-Arrays / Chronological Events (Alternative)

Separate all start and end times into two sorted arrays. Use two pointers to simulate a timeline.

```cpp
int minMeetingRooms(vector<vector<int>>& intervals) {
    int n = intervals.size();
    vector<int> starts, ends;
    for (auto& iv : intervals) { starts.push_back(iv[0]); ends.push_back(iv[1]); }
    sort(starts.begin(), starts.end());
    sort(ends.begin(),   ends.end());
    int rooms = 0, maxRooms = 0, j = 0;
    for (int i = 0; i < n; i++) {
        if (starts[i] < ends[j]) rooms++;
        else { rooms--; j++; }
        maxRooms = max(maxRooms, rooms);
    }
    return maxRooms;
}
```

```java
public int minMeetingRooms(int[][] intervals) {
    int n = intervals.length;
    int[] starts = new int[n], ends = new int[n];
    for (int i = 0; i < n; i++) { starts[i] = intervals[i][0]; ends[i] = intervals[i][1]; }
    Arrays.sort(starts); Arrays.sort(ends);
    int rooms = 0, maxRooms = 0, j = 0;
    for (int i = 0; i < n; i++) {
        if (starts[i] < ends[j]) rooms++;
        else { rooms--; j++; }
        maxRooms = Math.max(maxRooms, rooms);
    }
    return maxRooms;
}
```

```typescript
function minMeetingRooms(intervals: number[][]): number {
    const starts = intervals.map(iv => iv[0]).sort((a, b) => a - b);
    const ends   = intervals.map(iv => iv[1]).sort((a, b) => a - b);
    let rooms = 0, maxRooms = 0, j = 0;
    for (let i = 0; i < intervals.length; i++) {
        if (starts[i] < ends[j]) rooms++;
        else { rooms--; j++; }
        maxRooms = Math.max(maxRooms, rooms);
    }
    return maxRooms;
}
```

```python
class Solution:
    def minMeetingRooms(self, intervals: list[list[int]]) -> int:
        starts = sorted(iv[0] for iv in intervals)
        ends   = sorted(iv[1] for iv in intervals)

        rooms = 0
        max_rooms = 0
        i = j = 0  # i: next start, j: next end

        while i < len(starts):
            if starts[i] < ends[j]:   # a new meeting starts before one ends
                rooms += 1
                i += 1
            else:                      # a meeting ends before the next starts
                rooms -= 1
                j += 1
            max_rooms = max(max_rooms, rooms)

        return max_rooms
```

```go
func minMeetingRooms(intervals [][]int) int {
    n := len(intervals)
    starts, ends := make([]int, n), make([]int, n)
    for i, iv := range intervals { starts[i], ends[i] = iv[0], iv[1] }
    sort.Ints(starts); sort.Ints(ends)
    rooms, maxRooms, j := 0, 0, 0
    for i := 0; i < n; i++ {
        if starts[i] < ends[j] { rooms++ } else { rooms--; j++ }
        if rooms > maxRooms { maxRooms = rooms }
    }
    return maxRooms
}
```

Both approaches give O(n log n) time. The two-pointer approach avoids a heap and is often cleaner to explain.

## Dry Run (Min-Heap Approach)

```
intervals = [[0,30],[5,10],[15,20]]  → sorted: [[0,30],[5,10],[15,20]]
heap = []

Process [0,30]:  heap empty → push 30.      heap=[30]
Process [5,10]:  heap[0]=30 > 5 → new room, push 10. heap=[10,30]
Process [15,20]: heap[0]=10 <= 15 → reuse, pop 10, push 20. heap=[20,30]

heap.size() = 2 → answer: 2 rooms ✓
```

## Complexity

| Approach | Time | Space |
|---|---|---|
| Min-Heap | O(n log n) | O(n) |
| Two Pointers | O(n log n) | O(n) |

## Key Interview Insights

- **The heap tracks "rooms in use," not "all meetings."** Its size at the end equals the minimum rooms needed, since each element represents one occupied room.
- **Condition `heap[0] <= start` (not `<`).** A meeting ending at exactly the same time another starts means the room CAN be reused. `[1,10]` and `[10,20]` — the room is free at time 10.
- **The two-pointer approach is O(n) after sorting** and avoids heap overhead — better for explaining in interviews without heap support.
- **Common mistake:** Sorting by end time instead of start time. You must process meetings in order of their start time to assign rooms correctly.
- **Real-world interpretation:** This is the "interval scheduling" problem — used in OS schedulers, meeting room booking systems, and calendar applications.
