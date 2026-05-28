---
title: Interval Problems
description: Patterns, strategies, and templates for the full spectrum of interval-based interview problems
---

# Interval Problem Patterns

The intervals section of interview prep is uniquely satisfying: there are really only **five core problem archetypes**, and almost every interval question maps to one of them. Learn these patterns and you'll solve new interval problems by recognition, not derivation.

---

## The Five Core Archetypes

| # | Archetype | Key Technique | Classic Problems |
|---|---|---|---|
| 1 | **Merge overlapping** | Sort by start, greedy merge | LC 56 Merge Intervals |
| 2 | **Insert into sorted list** | 3-phase linear scan | LC 57 Insert Interval |
| 3 | **Scheduling / min resources** | Sweep line OR min-heap | LC 252, LC 253 Meeting Rooms |
| 4 | **Remove min to de-conflict** | Sort by end, activity selection | LC 435 Non-Overlapping Intervals |
| 5 | **Cover / hit all intervals** | Sort by end, greedy shot | LC 452 Minimum Arrows |

---

## Archetype 1 — Merge Overlapping Intervals

**When:** Given a list of potentially overlapping intervals, output the merged non-overlapping list.

**Approach:** Sort by start time. Walk and greedily extend the last merged interval.

**The key overlap check:** `prev.end >= curr.start` (strict `>` for exclusive-end intervals).

```
Input:  [1,3] [2,6] [8,10] [15,18]
After sort: same order
Merge:
  [1,3] → output
  [2,6]: 3 >= 2 → extend to [1,6]
  [8,10]: 6 < 8 → output [1,6], start [8,10]
  [15,18]: 10 < 15 → output [8,10], start [15,18]
Output: [1,6] [8,10] [15,18]
```

---

## Archetype 2 — Insert Into Sorted Interval List

**When:** The existing intervals are already sorted and non-overlapping. You must insert one new interval and merge as needed.

**Approach:** Linear scan in three phases — no sort needed.

```
Phase 1: intervals that end before newInterval starts → add as-is
Phase 2: intervals that overlap newInterval → merge into newInterval
Phase 3: remaining intervals → add as-is
```

**The tricky boundary:** Phase 1 ends when `interval.end >= newInterval.start`. Phase 3 starts when `interval.start > newInterval.end`.

---

## Archetype 3 — Minimum Meeting Rooms (Max Simultaneous Overlap)

**When:** Find the maximum number of intervals that overlap at any single point in time.

**Two equivalent approaches:**

### Approach A: Min-Heap of End Times

Sort by start. Maintain a min-heap of end times of active meetings. At each new meeting, pop meetings that have ended (heap.top <= current.start), then push current.end. Peak heap size = answer.

```
Meetings: [0,30] [5,10] [15,20]
Sort by start: same order

i=0: heap empty → push 30  → heap=[30]  size=1, peak=1
i=1: 30 > 5, don't pop → push 10 → heap=[10,30] size=2, peak=2
i=2: 10 <= 15, pop 10 → push 20 → heap=[20,30] size=2, peak=2

Answer: 2
```

### Approach B: Sweep Line with Events

Flatten all starts and ends into events `(time, type)`. Sort by time (end events before start events on ties). Count running total; max is the answer.

**Heap approach is generally preferred in interviews** — it's more intuitive and O(n log n) overall.

---

## Archetype 4 — Remove Minimum Intervals to Eliminate Overlaps

**When:** Remove the fewest number of intervals so the rest are non-overlapping.

**Approach:** Sort by **end time**. Use the classic activity selection greedy: always keep the interval that ends earliest. When an overlap is found, discard the one with the later end (which is always the current one if we track `prevEnd`).

```
Sort by end: [1,2] [1,3] [2,4] [3,5]

prevEnd = 2 (keep [1,2])
[1,3]: start=1 < prevEnd=2 → overlap, remove, count++
[2,4]: start=2 >= prevEnd=2 → keep, prevEnd=4
[3,5]: start=3 < prevEnd=4 → overlap, remove, count++

Removed: 2
```

**Why sort by end?** The interval ending soonest frees up the most room for future intervals — greedy proof by exchange argument.

---

## Archetype 5 — Minimum Points / Arrows to Hit All Intervals

**When:** Find the minimum number of "shots" (points) such that every interval contains at least one shot.

**Approach:** Sort by **end time**. Shoot at the end of the first interval. Any intervals overlapping that point are eliminated. Move to the next un-hit interval and repeat.

```
Balloons: [1,6] [2,8] [7,12] [10,16]
Sort by end: [1,6] [2,8] [7,12] [10,16]

Shot 1: shoot at 6 → hits [1,6] and [2,8] (both contain 6)
Shot 2: shoot at 12 → hits [7,12] and [10,16] (both contain 12)

Answer: 2 arrows
```

**Relationship to Archetype 4:** The number of minimum arrows equals the number of non-overlapping intervals. They're the same greedy, different framing.

---

## The Sweep Line in Depth

The sweep line is the most general interval technique. Think of it as a vertical line sweeping left to right across a timeline, and you're tracking what happens as it crosses interval boundaries.

**Event types:**
- `START` event at `interval[0]` — something begins
- `END` event at `interval[1]` — something ends

**Tie-breaking matters:**
- If end events come before start events at the same time → a resource is freed before being reallocated (room reuse allowed)
- If start events come before end events → overlap is counted at shared boundary

**Template:**

```cpp
// Find maximum overlap at any point
int maxOverlap(vector<vector<int>>& intervals) {
    vector<pair<int,int>> events;
    for (auto& iv : intervals) {
        events.push_back({iv[0], 1});   // start
        events.push_back({iv[1], -1});  // end
    }
    sort(events.begin(), events.end());

    int count = 0, peak = 0;
    for (auto& [time, type] : events) {
        count += type;
        peak = max(peak, count);
    }
    return peak;
}
```

```java
int maxOverlap(int[][] intervals) {
    List<int[]> events = new ArrayList<>();
    for (int[] iv : intervals) {
        events.add(new int[]{iv[0], 1});
        events.add(new int[]{iv[1], -1});
    }
    events.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);

    int count = 0, peak = 0;
    for (int[] e : events) {
        count += e[1];
        peak = Math.max(peak, count);
    }
    return peak;
}
```

```typescript
function maxOverlap(intervals: number[][]): number {
    const events: [number, number][] = [];
    for (const [s, e] of intervals) {
        events.push([s, 1]);
        events.push([e, -1]);
    }
    events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    let count = 0, peak = 0;
    for (const [, type] of events) {
        count += type;
        peak = Math.max(peak, count);
    }
    return peak;
}
```

```python
def max_overlap(intervals: list[list[int]]) -> int:
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort()

    count = peak = 0
    for _, t in events:
        count += t
        peak = max(peak, count)
    return peak
```

```go
import "sort"

func maxOverlap(intervals [][]int) int {
    events := [][2]int{}
    for _, iv := range intervals {
        events = append(events, [2]int{iv[0], 1})
        events = append(events, [2]int{iv[1], -1})
    }
    sort.Slice(events, func(i, j int) bool {
        if events[i][0] != events[j][0] {
            return events[i][0] < events[j][0]
        }
        return events[i][1] < events[j][1]
    })

    count, peak := 0, 0
    for _, e := range events {
        count += e[1]
        if count > peak {
            peak = count
        }
    }
    return peak
}
```

---

## Min-Heap Template for Scheduling

Sort by start time, use a min-heap to track end times of active intervals:

```cpp
#include <queue>
#include <algorithm>
using namespace std;

int minRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<int>> minHeap;

    for (auto& iv : intervals) {
        if (!minHeap.empty() && minHeap.top() <= iv[0]) {
            minHeap.pop();
        }
        minHeap.push(iv[1]);
    }
    return (int)minHeap.size();
}
```

```java
int minRooms(int[][] intervals) {
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
```

```typescript
function minRooms(intervals: number[][]): number {
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends   = intervals.map(i => i[1]).sort((a, b) => a - b);

    let rooms = 0, endPtr = 0;
    for (let i = 0; i < starts.length; i++) {
        if (starts[i] < ends[endPtr]) {
            rooms++;
        } else {
            endPtr++;
        }
    }
    return rooms;
}
```

```python
import heapq

def min_rooms(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[0])
    min_heap: list[int] = []

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

type IntHeap []int
func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() any          { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }

func minRooms(intervals [][]int) int {
    sort.Slice(intervals, func(i, j int) bool {
        return intervals[i][0] < intervals[j][0]
    })
    h := &IntHeap{}
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

---

## Two-Pointer Trick for Scheduling (No Heap)

Sort starts and ends separately. Use two pointers to simulate the sweep:

```
starts: [0, 5, 15]
ends:   [10, 20, 30]

i=0 (s=0):  s < e[0]=10 → need new room, rooms=1
i=1 (s=5):  s < e[0]=10 → need new room, rooms=2
i=2 (s=15): s >= e[0]=10 → reuse room, ePtr=1, rooms stays 2

Answer: 2
```

This approach achieves the same result as the heap approach without a priority queue.

---

## Key Interview Insights

- **The sort determines everything.** Sort by start for merging/inserting. Sort by end for activity selection, arrow problems, and min-removal.
- **Greedy works because intervals are sorted.** Every greedy interval algorithm relies on the fact that sorting creates a natural local-optimal-implies-global-optimal structure.
- **Sweep line = most general.** If you forget which specific approach to use, the sweep line always works.
- **The overlap check has an off-by-one.** `prev.end < curr.start` (no overlap, strict) vs `prev.end <= curr.start` (no overlap, touching ok). Read the problem carefully.
- **Always ask: are intervals inclusive or exclusive?** `[1,3]` inclusive vs `[1,3)` exclusive changes the overlap condition.
