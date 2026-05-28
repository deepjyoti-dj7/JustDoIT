---
title: Merge Intervals
description: Core theory for detecting overlaps, merging intervals, and solving sweep-line problems
---

# Merge Intervals

Intervals show up constantly in real-world systems — calendar scheduling, network packet merging, genomic analysis, meeting room allocation. The **intervals pattern** is one of the most predictable in interviews: once you know the core framework, every problem becomes a variation.

---

## What Is an Interval?

An interval `[start, end]` represents a contiguous range where `start <= end`. Intervals can:

- **Overlap** — share at least one point
- **Be adjacent** — touch at exactly one point (e.g., `[1,3]` and `[3,5]`)
- **Be disjoint** — no shared point

### Overlap Condition

Two intervals `A = [a1, a2]` and `B = [b1, b2]` overlap if and only if:

```
a1 <= b2  AND  b1 <= a2
```

Equivalently, they do NOT overlap if `a2 < b1` or `b2 < a1`.

```
Non-overlapping cases:
  A:  |------|
  B:           |------|       (a2 < b1)

  A:           |------|
  B:  |------|               (b2 < a1)

Overlapping cases:
  A:  |---------|
  B:       |---------|

  A:  |--------------|
  B:       |-----|

  A:  |------|
  B:  |------|               (identical)
```

---

## The Golden Rule: Sort by Start Time

Almost every interval problem begins the same way:

**Sort intervals by start time.** After sorting, you only need to compare the current interval's start with the previous interval's end — you never need to look backwards.

This is the insight that converts O(n^2) brute force into O(n log n) elegant solutions.

---

## Core Template: Merging Overlapping Intervals

After sorting, walk through intervals and merge greedily:

```cpp
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end()); // sort by start
    vector<vector<int>> merged;

    for (auto& interval : intervals) {
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);         // no overlap
        } else {
            merged.back()[1] = max(merged.back()[1], interval[1]); // extend
        }
    }
    return merged;
}
```

```java
import java.util.*;

int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> merged = new ArrayList<>();

    for (int[] interval : intervals) {
        if (merged.isEmpty() || merged.get(merged.size()-1)[1] < interval[0]) {
            merged.add(interval);
        } else {
            merged.get(merged.size()-1)[1] = Math.max(
                merged.get(merged.size()-1)[1], interval[1]);
        }
    }
    return merged.toArray(new int[0][]);
}
```

```typescript
function merge(intervals: number[][]): number[][] {
    intervals.sort((a, b) => a[0] - b[0]);
    const merged: number[][] = [];

    for (const interval of intervals) {
        if (merged.length === 0 || merged[merged.length-1][1] < interval[0]) {
            merged.push([...interval]);
        } else {
            merged[merged.length-1][1] = Math.max(
                merged[merged.length-1][1], interval[1]);
        }
    }
    return merged;
}
```

```python
def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = []

    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(list(interval))
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
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
        if len(merged) == 0 || merged[len(merged)-1][1] < interval[0] {
            merged = append(merged, []int{interval[0], interval[1]})
        } else if interval[1] > merged[len(merged)-1][1] {
            merged[len(merged)-1][1] = interval[1]
        }
    }
    return merged
}
```

### The Decision at Each Step

At each interval, only two outcomes are possible:

| Condition | Action |
|---|---|
| `last.end < current.start` | No overlap — push current as new interval |
| `last.end >= current.start` | Overlap — extend `last.end = max(last.end, current.end)` |

Notice: we always take `max(last.end, current.end)` not just `current.end`. One interval can fully contain another.

---

## Overlap Detection Pattern (Quick Check)

When you just need to know if two sorted intervals overlap (not merge them):

```
NOT overlapping: interval[0] > prev[1]
Overlapping:     interval[0] <= prev[1]
```

This single comparison drives meeting room problems, scheduling conflicts, etc.

---

## Insert Into Sorted Interval List

A second fundamental operation: inserting a new interval into an already-sorted, non-overlapping list.

Three phases:
1. Add all intervals that end before the new interval starts (no overlap, left side)
2. Merge all intervals that overlap with the new interval
3. Add all remaining intervals (no overlap, right side)

```
Intervals: [1,3] [6,9]
Insert:    [2,5]

Phase 1: [1,3] overlaps [2,5] → skip (goes to phase 2)
Phase 2: Merge [1,3] and [2,5] → [1,5]; [6,9] doesn't overlap → stop
Phase 3: Add [6,9]
Result: [1,5] [6,9]
```

---

## Sweep Line / Event-Based Thinking

For problems like "minimum rooms needed" or "maximum overlap at any point," think in terms of **events**:

- **+1** when an interval starts (a meeting begins, a person arrives)
- **-1** when an interval ends (a meeting ends, a person leaves)

Sort events by time, process them in order, track a running count. The peak count is your answer.

```
Meetings: [0,30] [5,10] [15,20]
Events: (0,+1) (5,+1) (10,-1) (15,+1) (20,-1) (30,-1)

Process:
  t=0:  count=1, peak=1
  t=5:  count=2, peak=2
  t=10: count=1
  t=15: count=2
  t=20: count=1
  t=30: count=0

Answer: 2 rooms needed
```

**Tie-breaking rule:** When start and end events happen at the same time, process **end before start** if you want rooms freed before being re-allocated (common for "minimum rooms" problems where adjacency is ok).

---

## Greedy Selection: Minimum Interval Removal

For problems like "remove the fewest intervals to eliminate all overlaps," use a greedy strategy:

**Sort by end time.** Always keep the interval that ends earliest — it leaves the most room for future intervals (classic activity selection / interval scheduling).

When you find an overlap:
- Remove the interval with the **later** end time (keep the earlier-ending one)
- This maximally avoids conflicts with upcoming intervals

---

## Identification Patterns

Reach for the intervals pattern when you see:

- "Meeting rooms" / "scheduling"
- "Merge overlapping ranges"
- "Find gaps between ranges"
- "Maximum overlap / minimum coverage"
- "Insert / delete from a sorted range list"
- Input involves `[start, end]` pairs

---

## Common Pitfalls

**1. Forgetting to sort**
Without sorting, you can't apply the greedy merge. Always sort first.

**2. Adjacent intervals (touching at a point)**
Decide upfront: does `[1,3]` and `[3,5]` overlap? For most problems, `[1,3]` ends at 3 and `[3,5]` starts at 3 — they touch but don't overlap. The condition `last.end < current.start` (strict less-than) treats them as non-overlapping. Use `<=` if touching counts as overlap.

**3. Contained intervals**
`[1,10]` and `[2,4]` — the second is fully inside the first. After merging, the result is `[1,10]`. Use `max(last.end, current.end)`, not just `current.end`.

**4. Single-element intervals**
`[3,3]` is a valid interval (a point). Your merge logic handles this naturally.

**5. Modifying input during sort**
Some languages sort in-place. If the caller doesn't expect mutation, copy first.

---

## Complexity Reference

| Operation | Time | Space |
|---|---|---|
| Sort intervals | O(n log n) | O(log n) sort stack |
| Merge after sort | O(n) | O(n) output |
| Full merge algorithm | O(n log n) | O(n) |
| Insert into sorted list | O(n) | O(n) output |
| Sweep line (event sort) | O(n log n) | O(n) events |
| Activity selection (greedy) | O(n log n) | O(1) |

---

## Quick Reference: When to Use Which Strategy

| Problem Type | Strategy |
|---|---|
| Merge overlapping intervals | Sort by start, greedy extend |
| Insert new interval into sorted list | 3-phase linear scan |
| Minimum meeting rooms / max overlap | Sweep line with +1/-1 events OR min-heap of end times |
| Remove min intervals to avoid overlap | Sort by end, activity selection greedy |
| Check if person can attend all meetings | Sort by start, check `prev.end > curr.start` |
| Arrows to burst balloons / points | Sort by end, greedy shoot at earliest end |
