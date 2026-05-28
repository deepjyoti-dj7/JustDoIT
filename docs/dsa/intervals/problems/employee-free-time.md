---
title: Employee Free Time
difficulty: Hard
tags: [Array, Sorting, Heap]
link: https://leetcode.com/problems/employee-free-time/
---

# Employee Free Time

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [759. Employee Free Time](https://leetcode.com/problems/employee-free-time/) |
| **Tags** | Array, Sorting, Heap |

## Problem Statement

We are given a list `schedule` — a list of lists of `Interval` objects. `schedule[i]` is a list of intervals belonging to the i-th employee, sorted in ascending order.

Return the list of finite intervals representing **common free time** for all employees — time when no employee is working.

**Note:** Even though free time intervals might not overlap with any employee's working schedule, it could still not be considered free if an employee might be working at that time (multiple employees' free times must coincide).

**Example 1:**
```
Input:  schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]
Output: [[5,6],[7,9]]
```

**Example 2:**
```
Input:  schedule = [[[1,3],[6,7]],[[2,4]]]
Output: [[4,6]]
```

---

## Intuition

"Free time for all employees" = **gaps in the union of all work intervals**.

Steps:
1. Collect all intervals from all employees into one list
2. Sort by start time
3. Merge overlapping intervals (standard merge)
4. The gaps between merged intervals are the free time periods

This reduces the problem to "merge intervals and find gaps" — a direct application of the core intervals pattern.

```
All intervals: [1,3] [6,7] [2,4] [2,5] [9,12]
Sort by start: [1,3] [2,4] [2,5] [6,7] [9,12]
Merge:         [1,5] [6,7] [9,12]

Gaps:
  [5,6] — between [1,5] and [6,7]
  [7,9] — between [6,7] and [9,12]

Answer: [[5,6],[7,9]] ✓
```

---

## Approach 1: Flatten + Sort + Merge (Optimal)

Collect all intervals, sort, merge, then extract gaps between consecutive merged intervals.

This problem uses a custom `Interval` class in most LeetCode language versions. Implementations below show the same logic adapted for each language.

```cpp
#include <vector>
#include <algorithm>
using namespace std;

// Interval class provided by LeetCode
struct Interval {
    int start, end;
    Interval() : start(0), end(0) {}
    Interval(int s, int e) : start(s), end(e) {}
};

class Solution {
public:
    vector<Interval> employeeFreeTime(vector<vector<Interval>> schedule) {
        vector<Interval> all;
        for (auto& emp : schedule)
            for (auto& iv : emp)
                all.push_back(iv);

        sort(all.begin(), all.end(),
             [](const Interval& a, const Interval& b) { return a.start < b.start; });

        // Merge intervals
        vector<Interval> merged;
        for (auto& iv : all) {
            if (merged.empty() || merged.back().end < iv.start) {
                merged.push_back(iv);
            } else {
                merged.back().end = max(merged.back().end, iv.end);
            }
        }

        // Extract gaps
        vector<Interval> res;
        for (int i = 1; i < (int)merged.size(); i++) {
            res.push_back({merged[i-1].end, merged[i].start});
        }
        return res;
    }
};
```

```java
import java.util.*;

// Interval class provided by LeetCode
class Interval {
    public int start, end;
    public Interval(int start, int end) { this.start = start; this.end = end; }
}

class Solution {
    public List<Interval> employeeFreeTime(List<List<Interval>> schedule) {
        List<Interval> all = new ArrayList<>();
        for (List<Interval> emp : schedule)
            all.addAll(emp);

        all.sort((a, b) -> a.start - b.start);

        // Merge
        List<Interval> merged = new ArrayList<>();
        for (Interval iv : all) {
            if (merged.isEmpty() || merged.get(merged.size()-1).end < iv.start) {
                merged.add(new Interval(iv.start, iv.end));
            } else {
                merged.get(merged.size()-1).end =
                    Math.max(merged.get(merged.size()-1).end, iv.end);
            }
        }

        // Gaps
        List<Interval> res = new ArrayList<>();
        for (int i = 1; i < merged.size(); i++) {
            res.add(new Interval(merged.get(i-1).end, merged.get(i).start));
        }
        return res;
    }
}
```

```typescript
// Using plain [start, end] pairs since Interval class not available in TS
function employeeFreeTime(schedule: number[][][]): number[][] {
    const all: number[][] = [];
    for (const emp of schedule)
        for (const iv of emp)
            all.push(iv);

    all.sort((a, b) => a[0] - b[0]);

    // Merge
    const merged: number[][] = [];
    for (const iv of all) {
        if (merged.length === 0 || merged[merged.length-1][1] < iv[0]) {
            merged.push([...iv]);
        } else {
            merged[merged.length-1][1] = Math.max(merged[merged.length-1][1], iv[1]);
        }
    }

    // Gaps
    const res: number[][] = [];
    for (let i = 1; i < merged.length; i++) {
        res.push([merged[i-1][1], merged[i][0]]);
    }
    return res;
}
```

```python
# Interval class provided by LeetCode, using [start, end] pairs here
class Solution:
    def employeeFreeTime(self, schedule: list[list[list[int]]]) -> list[list[int]]:
        all_intervals = [iv for emp in schedule for iv in emp]
        all_intervals.sort(key=lambda x: x[0])

        # Merge
        merged = []
        for iv in all_intervals:
            if not merged or merged[-1][1] < iv[0]:
                merged.append(list(iv))
            else:
                merged[-1][1] = max(merged[-1][1], iv[1])

        # Gaps
        return [[merged[i-1][1], merged[i][0]] for i in range(1, len(merged))]
```

```go
// Using [][]int since Go LeetCode uses custom struct — shown with int slices
func employeeFreeTime(schedule [][][2]int) [][2]int {
    all := [][2]int{}
    for _, emp := range schedule {
        all = append(all, emp...)
    }

    sort.Slice(all, func(i, j int) bool {
        return all[i][0] < all[j][0]
    })

    // Merge
    merged := [][2]int{}
    for _, iv := range all {
        if len(merged) == 0 || merged[len(merged)-1][1] < iv[0] {
            merged = append(merged, iv)
        } else if iv[1] > merged[len(merged)-1][1] {
            merged[len(merged)-1][1] = iv[1]
        }
    }

    // Gaps
    res := [][2]int{}
    for i := 1; i < len(merged); i++ {
        res = append(res, [2]int{merged[i-1][1], merged[i][0]})
    }
    return res
}
```

**Time:** O(N log N) where N = total intervals — **Space:** O(N)

---

## Approach 2: Min-Heap (Merge Without Flattening)

If schedules are already sorted per employee (as guaranteed), use a min-heap across employee schedules. This is a k-way merge — efficient when memory is limited or employees are streamed in.

Each heap entry holds `(start, end, empIdx, ivIdx)`. At each step, pop the smallest-start interval, check if it creates a gap against the current merged end, then push the next interval from that employee.

```cpp
#include <vector>
#include <queue>
using namespace std;

struct Interval {
    int start, end;
    Interval(int s, int e) : start(s), end(e) {}
};

class Solution {
public:
    vector<Interval> employeeFreeTime(vector<vector<Interval>> schedule) {
        // min-heap: (start, end, empIdx, ivIdx)
        using T = tuple<int,int,int,int>;
        priority_queue<T, vector<T>, greater<T>> pq;

        for (int i = 0; i < (int)schedule.size(); i++) {
            pq.push({schedule[i][0].start, schedule[i][0].end, i, 0});
        }

        vector<Interval> res;
        int mergedEnd = get<1>(pq.top()); // init to first interval's end

        while (!pq.empty()) {
            auto [start, end, emp, idx] = pq.top(); pq.pop();

            if (start > mergedEnd) {
                res.push_back({mergedEnd, start}); // gap found
            }
            mergedEnd = max(mergedEnd, end);

            if (idx + 1 < (int)schedule[emp].size()) {
                int ni = idx + 1;
                pq.push({schedule[emp][ni].start, schedule[emp][ni].end, emp, ni});
            }
        }
        return res;
    }
};
```

```java
import java.util.*;

class Interval {
    public int start, end;
    public Interval(int start, int end) { this.start = start; this.end = end; }
}

class Solution {
    public List<Interval> employeeFreeTime(List<List<Interval>> schedule) {
        // min-heap: [start, end, empIdx, ivIdx]
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);

        for (int i = 0; i < schedule.size(); i++) {
            pq.offer(new int[]{schedule.get(i).get(0).start,
                               schedule.get(i).get(0).end, i, 0});
        }

        List<Interval> res = new ArrayList<>();
        int mergedEnd = pq.peek()[1];

        while (!pq.isEmpty()) {
            int[] cur = pq.poll();
            int start = cur[0], end = cur[1], emp = cur[2], idx = cur[3];

            if (start > mergedEnd) {
                res.add(new Interval(mergedEnd, start));
            }
            mergedEnd = Math.max(mergedEnd, end);

            List<Interval> empSchedule = schedule.get(emp);
            if (idx + 1 < empSchedule.size()) {
                Interval next = empSchedule.get(idx + 1);
                pq.offer(new int[]{next.start, next.end, emp, idx + 1});
            }
        }
        return res;
    }
}
```

```typescript
// Using [start, end] pairs; each heap entry: [start, end, empIdx, ivIdx]
function employeeFreeTime(schedule: number[][][]): number[][] {
    // Simple sorted array used as a min-heap substitute
    const entries: [number, number, number, number][] = [];
    for (let i = 0; i < schedule.length; i++) {
        entries.push([schedule[i][0][0], schedule[i][0][1], i, 0]);
    }
    entries.sort((a, b) => a[0] - b[0]);

    // Process in order (re-sort after each insertion for correctness)
    const res: number[][] = [];
    let mergedEnd = entries[0][1];

    while (entries.length > 0) {
        const [start, end, emp, idx] = entries.shift()!;

        if (start > mergedEnd) {
            res.push([mergedEnd, start]);
        }
        mergedEnd = Math.max(mergedEnd, end);

        if (idx + 1 < schedule[emp].length) {
            const next = schedule[emp][idx + 1];
            const entry: [number, number, number, number] = [next[0], next[1], emp, idx + 1];
            // Insert in sorted position
            let pos = entries.findIndex(e => e[0] > next[0]);
            if (pos === -1) pos = entries.length;
            entries.splice(pos, 0, entry);
        }
    }
    return res;
}
```

```python
import heapq

class Solution:
    def employeeFreeTime(self, schedule: list[list[list[int]]]) -> list[list[int]]:
        # heap entry: (start, end, emp_idx, iv_idx)
        heap = []
        for i, emp in enumerate(schedule):
            heapq.heappush(heap, (emp[0][0], emp[0][1], i, 0))

        res = []
        merged_end = heap[0][1]

        while heap:
            start, end, emp, idx = heapq.heappop(heap)

            if start > merged_end:
                res.append([merged_end, start])  # gap found
            merged_end = max(merged_end, end)

            if idx + 1 < len(schedule[emp]):
                nxt = schedule[emp][idx + 1]
                heapq.heappush(heap, (nxt[0], nxt[1], emp, idx + 1))

        return res
```

```go
import "container/heap"

// entry: start, end, empIdx, ivIdx
type Entry struct{ start, end, emp, idx int }
type EntryHeap []Entry
func (h EntryHeap) Len() int           { return len(h) }
func (h EntryHeap) Less(i, j int) bool { return h[i].start < h[j].start }
func (h EntryHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *EntryHeap) Push(x any)        { *h = append(*h, x.(Entry)) }
func (h *EntryHeap) Pop() any          { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }

func employeeFreeTime(schedule [][][2]int) [][2]int {
    h := &EntryHeap{}
    heap.Init(h)
    for i, emp := range schedule {
        heap.Push(h, Entry{emp[0][0], emp[0][1], i, 0})
    }

    res := [][2]int{}
    mergedEnd := (*h)[0].end

    for h.Len() > 0 {
        cur := heap.Pop(h).(Entry)

        if cur.start > mergedEnd {
            res = append(res, [2]int{mergedEnd, cur.start})
        }
        if cur.end > mergedEnd {
            mergedEnd = cur.end
        }

        emp := schedule[cur.emp]
        if cur.idx+1 < len(emp) {
            ni := cur.idx + 1
            heap.Push(h, Entry{emp[ni][0], emp[ni][1], cur.emp, ni})
        }
    }
    return res
}
```

**Time:** O(N log k) where N = total intervals, k = number of employees — **Space:** O(k) heap + O(N) output

---

## Dry Run

```
schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]

All intervals: [[1,3],[6,7],[2,4],[2,5],[9,12]]
Sort by start: [[1,3],[2,4],[2,5],[6,7],[9,12]]

Merge:
  [1,3] → merged=[[1,3]]
  [2,4]: 2 <= 3 → extend → [[1,4]]
  [2,5]: 2 <= 4 → extend → [[1,5]]
  [6,7]: 6 > 5 → new → [[1,5],[6,7]]
  [9,12]: 9 > 7 → new → [[1,5],[6,7],[9,12]]

Gaps:
  [5,6]  (between [1,5] and [6,7])
  [7,9]  (between [6,7] and [9,12])

Output: [[5,6],[7,9]] ✓
```

---

## Key Interview Insights

- **Reduce to "gaps in merged intervals"** — this is the key insight. Don't try to compute "time when no one is working" directly; instead find the union of all work intervals and look at what's left.
- **Flatten first, then sort.** Each employee's schedule may be sorted, but across employees intervals can interleave — you must sort globally.
- **The "Hard" rating is mostly about** recognizing the reduction and handling the custom `Interval` class API. The algorithm itself is just merge intervals.
- **Min-heap approach** is the "fancy" solution interviewers may expect at FAANG — it avoids flattening and works in a streaming fashion.
- **Gap extraction** is the new step vs standard merge: after merging, iterate consecutive merged pairs and output `[merged[i-1].end, merged[i].start]`.
- **Edge case:** Adjacent merged intervals (e.g., `[1,3]` and `[3,5]`) produce a zero-width gap `[3,3]`. Depending on the problem, you may need to skip zero-width gaps.

