---
title: Minimum Number of Arrows to Burst Balloons
difficulty: Medium
tags: [Array, Sorting, Greedy]
link: https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/
---

# Minimum Number of Arrows to Burst Balloons

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [452. Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) |
| **Tags** | Array, Sorting, Greedy |

## Problem Statement

There are some spherical balloons taped onto a flat wall. Each balloon is represented as `[x_start, x_end]` where an arrow shot at x will burst the balloon if `x_start <= x <= x_end`. Arrows can be shot vertically from different positions. Find the **minimum number of arrows** needed to burst all the balloons.

**Example 1:**
```
Input:  points = [[10,16],[2,8],[1,6],[7,12]]
Output: 2
Explanation: Shoot at x=6 → bursts [2,8] and [1,6].
             Shoot at x=11 → bursts [10,16] and [7,12].
```

**Example 2:**
```
Input:  points = [[1,2],[3,4],[5,6],[7,8]]
Output: 4
Explanation: No overlap at all, each needs its own arrow.
```

**Example 3:**
```
Input:  points = [[1,2],[2,3],[3,4],[4,5]]
Output: 2
Explanation: Shoot at x=2 → bursts [1,2] and [2,3].
             Shoot at x=4 → bursts [3,4] and [4,5].
```

---

## Intuition

**Key insight:** The minimum number of arrows equals the minimum number of non-overlapping "groups" of balloons. Balloons in the same group share a common x-coordinate.

This is structurally identical to Activity Selection / Non-Overlapping Intervals:

- Sort by end time
- Greedily assign each arrow to the earliest-ending remaining balloon
- Any balloon whose range includes that arrow's x position is burst in the same shot
- Move on to the next un-burst balloon and repeat

The greedy choice: **always shoot at the end of the current balloon's x range.** This shoots as far right as possible while still bursting the current balloon, giving every overlapping balloon on the right the best chance to also be hit.

---

## Approach 1: Brute Force

Try all possible x positions. For each, count how many balloons it bursts. Pick positions greedily. O(n^2) and not straightforward — skip.

---

## Approach 2: Sort by End + Greedy (Optimal)

1. Sort by end position
2. `arrowX` = end of first balloon, `arrows` = 1
3. For each subsequent balloon:
   - If its start > current `arrowX` → arrow misses, need a new arrow. Set `arrowX` = this balloon's end, `arrows++`.
   - Otherwise → current arrow still hits this balloon too.

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int findMinArrowShots(vector<vector<int>>& points) {
        sort(points.begin(), points.end(),
             [](const auto& a, const auto& b) { return a[1] < b[1]; });

        int arrows = 1;
        int arrowX = points[0][1];

        for (int i = 1; i < (int)points.size(); i++) {
            if (points[i][0] > arrowX) { // arrow misses
                arrows++;
                arrowX = points[i][1];
            }
        }
        return arrows;
    }
};
```

```java
import java.util.*;

class Solution {
    public int findMinArrowShots(int[][] points) {
        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1])); // avoid overflow

        int arrows = 1;
        int arrowX = points[0][1];

        for (int i = 1; i < points.length; i++) {
            if (points[i][0] > arrowX) {
                arrows++;
                arrowX = points[i][1];
            }
        }
        return arrows;
    }
}
```

```typescript
function findMinArrowShots(points: number[][]): number {
    points.sort((a, b) => a[1] - b[1]);

    let arrows = 1;
    let arrowX = points[0][1];

    for (let i = 1; i < points.length; i++) {
        if (points[i][0] > arrowX) {
            arrows++;
            arrowX = points[i][1];
        }
    }
    return arrows;
}
```

```python
class Solution:
    def findMinArrowShots(self, points: list[list[int]]) -> int:
        points.sort(key=lambda x: x[1])

        arrows = 1
        arrow_x = points[0][1]

        for start, end in points[1:]:
            if start > arrow_x:  # arrow misses
                arrows += 1
                arrow_x = end
        return arrows
```

```go
import "sort"

func findMinArrowShots(points [][]int) int {
    sort.Slice(points, func(i, j int) bool {
        return points[i][1] < points[j][1]
    })

    arrows := 1
    arrowX := points[0][1]

    for i := 1; i < len(points); i++ {
        if points[i][0] > arrowX {
            arrows++
            arrowX = points[i][1]
        }
    }
    return arrows
}
```

**Time:** O(n log n) — **Space:** O(log n)

---

## Dry Run

```
Input: [[10,16],[2,8],[1,6],[7,12]]
Sort by end: [[1,6],[2,8],[7,12],[10,16]]

arrows=1, arrowX=6

i=1: [2,8] → start=2 > arrowX=6? No → same arrow hits it
i=2: [7,12] → start=7 > arrowX=6? Yes → new arrow! arrows=2, arrowX=12
i=3: [10,16] → start=10 > arrowX=12? No → same arrow hits it

Answer: 2 ✓
```

---

## Crucial Difference From Non-Overlapping Intervals

| Problem | Overlap at boundary | Arrow condition |
|---|---|---|
| Non-Overlapping Intervals (LC 435) | `[1,2]` and `[2,3]` → no overlap (touching) | `start >= prevEnd` → keep |
| Minimum Arrows (LC 452) | `[1,2]` and `[2,3]` → same arrow (one arrow at x=2 hits both) | `start > arrowX` → new arrow needed |

Here, balloons touching at a boundary (`[1,2]` and `[2,3]`) are burst by the **same** arrow at x=2. So the condition uses strict `>` for "needs new arrow."

In Java, **do NOT use `a[1] - b[1]` for sorting** — balloon coordinates can be near `Integer.MAX_VALUE`, causing overflow. Use `Integer.compare(a[1], b[1])` instead.

---

## Key Interview Insights

- **Sort by end, shoot at end.** This greedy is optimal — proof: any other choice of arrow position within the group can only burst fewer balloons.
- **Touching boundaries count as one shot.** `[1,2]` and `[2,3]` — an arrow at 2 bursts both. The condition `points[i][0] > arrowX` (strict greater) handles this correctly.
- **Integer overflow in Java:** `a[1] - b[1]` overflows for large coordinate values. Use `Integer.compare()` in the comparator.
- **Connection to LC 435:** `minArrows = n - maxNonOverlapping`. The algorithms differ only in how they define "overlap at boundary."
- **Reformulation:** How many groups can you partition the intervals into such that every group has a common point? The minimum arrows is that number.

