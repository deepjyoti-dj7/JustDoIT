---
title: Interval Scheduling
description: Mastering interval problems — the most common greedy pattern in coding interviews
---

# Interval Scheduling

Interval problems are among the most common greedy problems in interviews. They test your ability to reason about time ranges, overlaps, and optimal ordering. Most interval problems collapse to one key decision: **which end to sort by**.

---

## The Fundamental Problem: Activity Selection

Given `n` activities with `[start, end]` times, find the **maximum number** you can attend without overlap.

**Naive attempt:** Sort by start time and pick greedily. ❌  
This fails because an early-starting activity might be very long, blocking many short ones.

**Correct greedy insight:** Sort by **end time** and pick greedily.  
Always picking the activity that finishes earliest leaves the maximum room for future activities.

### Proof via Exchange Argument

Suppose an optimal solution skips the earliest-ending activity $A$ and starts instead with activity $B$. Since $A.end \le B.end$, replacing $B$ with $A$ in the solution produces no new conflicts. The count stays the same, so including $A$ is always safe.

---

## Sorting Key Cheat Sheet

| Goal | Sort by | Reason |
|---|---|---|
| Max non-overlapping intervals | End time ↑ | Earliest finish = most room for future |
| Min intervals to remove | End time ↑ | Same as max non-overlapping |
| Merge overlapping intervals | Start time ↑ | Process in chronological order |
| Detect any overlap (Meeting Rooms I) | Start time ↑ | Check consecutive pairs |
| Min rooms needed (Meeting Rooms II) | Start time ↑ | Match to earliest-free room |
| Minimum arrows to burst balloons | End time ↑ | Same as activity selection |

---

## Variant 1: Activity Selection (Max Non-Overlapping)

Sort by end time. Keep a `lastEnd` pointer. Pick the next interval only if its start is `>=` lastEnd.

```cpp
int activitySelection(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(),
         [](auto& a, auto& b){ return a[1] < b[1]; });
    int count = 1;
    int lastEnd = intervals[0][1];
    for (int i = 1; i < (int)intervals.size(); i++) {
        if (intervals[i][0] >= lastEnd) {
            count++;
            lastEnd = intervals[i][1];
        }
    }
    return count;
}
```

```java
int activitySelection(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int count = 1, lastEnd = intervals[0][1];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {
            count++;
            lastEnd = intervals[i][1];
        }
    }
    return count;
}
```

```typescript
function activitySelection(intervals: number[][]): number {
    intervals.sort((a, b) => a[1] - b[1]);
    let count = 1, lastEnd = intervals[0][1];
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= lastEnd) {
            count++;
            lastEnd = intervals[i][1];
        }
    }
    return count;
}
```

```python
def activity_selection(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    count = 1
    last_end = intervals[0][1]
    for start, end in intervals[1:]:
        if start >= last_end:
            count += 1
            last_end = end
    return count
```

```go
func activitySelection(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][1] < intervals[j][1]
    })
    count, lastEnd := 1, intervals[0][1]
    for i := 1; i < len(intervals); i++ {
        if intervals[i][0] >= lastEnd {
            count++
            lastEnd = intervals[i][1]
        }
    }
    return count
}
```

**Time:** O(n log n) — **Space:** O(1)

---

## Variant 2: Merge Overlapping Intervals

Sort by start time. For each interval, either merge it into the last merged interval (if they overlap) or append it as a new interval.

Two intervals `[a, b]` and `[c, d]` overlap when `c <= b`.

```cpp
vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> res = {intervals[0]};
    for (int i = 1; i < (int)intervals.size(); i++) {
        if (intervals[i][0] <= res.back()[1])
            res.back()[1] = max(res.back()[1], intervals[i][1]);
        else
            res.push_back(intervals[i]);
    }
    return res;
}
```

```java
int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> res = new ArrayList<>();
    res.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = res.get(res.size() - 1);
        if (intervals[i][0] <= last[1])
            last[1] = Math.max(last[1], intervals[i][1]);
        else
            res.add(intervals[i]);
    }
    return res.toArray(new int[0][]);
}
```

```typescript
function merge(intervals: number[][]): number[][] {
    intervals.sort((a, b) => a[0] - b[0]);
    const res: number[][] = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        const last = res[res.length - 1];
        if (intervals[i][0] <= last[1])
            last[1] = Math.max(last[1], intervals[i][1]);
        else
            res.push(intervals[i]);
    }
    return res;
}
```

```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort()
    res = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= res[-1][1]:
            res[-1][1] = max(res[-1][1], end)
        else:
            res.append([start, end])
    return res
```

```go
func merge(intervals [][]int) [][]int {
    sort.Slice(intervals, func(i, j int) bool { return intervals[i][0] < intervals[j][0] })
    res := [][]int{intervals[0]}
    for i := 1; i < len(intervals); i++ {
        last := res[len(res)-1]
        if intervals[i][0] <= last[1] {
            if intervals[i][1] > last[1] {
                last[1] = intervals[i][1]
            }
        } else {
            res = append(res, intervals[i])
        }
    }
    return res
}
```

**Time:** O(n log n) — **Space:** O(n)

---

## Variant 3: Minimum Conference Rooms (Meeting Rooms II)

Given meeting time intervals, find the minimum number of rooms required.

**Key insight:** The number of rooms needed at any moment equals the number of simultaneously active meetings. Use a min-heap tracking *end times* of active meetings. For each new meeting (sorted by start), if the earliest-ending active meeting ends before this one starts, reuse that room. Otherwise, open a new room.

```cpp
int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<int>> minHeap; // end times
    for (auto& iv : intervals) {
        if (!minHeap.empty() && minHeap.top() <= iv[0])
            minHeap.pop(); // reuse this room
        minHeap.push(iv[1]);
    }
    return (int)minHeap.size();
}
```

```java
int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    PriorityQueue<Integer> minHeap = new PriorityQueue<>(); // end times
    for (int[] iv : intervals) {
        if (!minHeap.isEmpty() && minHeap.peek() <= iv[0])
            minHeap.poll(); // reuse room
        minHeap.offer(iv[1]);
    }
    return minHeap.size();
}
```

```typescript
function minMeetingRooms(intervals: number[][]): number {
    intervals.sort((a, b) => a[0] - b[0]);
    // Min-heap simulation (sorted array for clarity)
    const endTimes: number[] = [];
    for (const [start, end] of intervals) {
        endTimes.sort((a, b) => a - b);
        if (endTimes.length > 0 && endTimes[0] <= start)
            endTimes.shift(); // reuse room
        endTimes.push(end);
    }
    return endTimes.length;
}
```

```python
import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    intervals.sort()
    min_heap: list[int] = []  # stores end times
    for start, end in intervals:
        if min_heap and min_heap[0] <= start:
            heapq.heapreplace(min_heap, end)  # reuse earliest-ending room
        else:
            heapq.heappush(min_heap, end)
    return len(min_heap)
```

```go
import "container/heap"

type IntHeap []int
func (h IntHeap) Len() int            { return len(h) }
func (h IntHeap) Less(i, j int) bool  { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x any)         { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() any           { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }

func minMeetingRooms(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool { return intervals[i][0] < intervals[j][0] })
    h := &IntHeap{}
    for _, iv := range intervals {
        if h.Len() > 0 && (*h)[0] <= iv[0] {
            heap.Pop(h) // reuse room
        }
        heap.Push(h, iv[1])
    }
    return h.Len()
}
```

**Time:** O(n log n) — **Space:** O(n)

---

## Variant 4: Minimum Arrows to Burst Balloons (LC 452)

Balloons occupy horizontal ranges `[start, end]`. An arrow shot at position `x` bursts all balloons covering `x`. Find the minimum arrows needed.

This is **identical** to activity selection — an arrow covers the earliest-ending balloon and everything overlapping it. Sort by end, fire an arrow at each non-covered balloon.

```cpp
int findMinArrowShots(vector<vector<int>>& points) {
    sort(points.begin(), points.end(), [](auto& a, auto& b){ return a[1] < b[1]; });
    int arrows = 1;
    int arrowPos = points[0][1];
    for (int i = 1; i < (int)points.size(); i++) {
        if (points[i][0] > arrowPos) {
            arrows++;
            arrowPos = points[i][1];
        }
    }
    return arrows;
}
```

```java
int findMinArrowShots(int[][] points) {
    Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));
    int arrows = 1, arrowPos = points[0][1];
    for (int i = 1; i < points.length; i++) {
        if (points[i][0] > arrowPos) {
            arrows++;
            arrowPos = points[i][1];
        }
    }
    return arrows;
}
```

```typescript
function findMinArrowShots(points: number[][]): number {
    points.sort((a, b) => a[1] - b[1]);
    let arrows = 1, arrowPos = points[0][1];
    for (let i = 1; i < points.length; i++) {
        if (points[i][0] > arrowPos) {
            arrows++;
            arrowPos = points[i][1];
        }
    }
    return arrows;
}
```

```python
def find_min_arrow_shots(points: list[list[int]]) -> int:
    points.sort(key=lambda x: x[1])
    arrows = 1
    arrow_pos = points[0][1]
    for start, end in points[1:]:
        if start > arrow_pos:
            arrows += 1
            arrow_pos = end
    return arrows
```

```go
func findMinArrowShots(points [][]int) int {
    sort.Slice(points, func(i, j int) bool { return points[i][1] < points[j][1] })
    arrows, arrowPos := 1, points[0][1]
    for i := 1; i < len(points); i++ {
        if points[i][0] > arrowPos {
            arrows++
            arrowPos = points[i][1]
        }
    }
    return arrows
}
```

**Time:** O(n log n) — **Space:** O(1)

---

## Key Relationships

```
Min intervals to remove  =  n  −  max non-overlapping count
Min arrows to burst      =  max non-overlapping count  (sort by end)
Min rooms needed         =  max overlapping at any point  (min-heap)
```

---

## Edge Cases to Always Test

- Empty input array
- Single interval
- All intervals identical: `[1,2], [1,2], [1,2]`
- No overlaps at all
- Fully nested: `[1,10], [2,5], [3,4]`
- Point intervals: `[3,3]`
- Intervals touching at a boundary: `[1,2], [2,3]` — overlap or not? (depends on `<` vs `<=`)

---

## Interview Tips

1. **Ask upfront:** "Are start/end inclusive or exclusive?" — this determines whether touching intervals overlap (`<` vs `<=`)
2. **Sketch a timeline** — Interval problems are visual; a quick sketch prevents logic bugs
3. **State sort key first** — naming the sort key upfront signals mastery of the pattern
4. **Key identity:** `min to remove = n − activity_selection(intervals)`
5. **Boundary care:** `Integer.compare(a[1], b[1])` instead of `a[1] - b[1]` prevents overflow for large values in Java
