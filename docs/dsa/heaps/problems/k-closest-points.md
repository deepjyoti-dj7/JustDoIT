---
title: K Closest Points to Origin
difficulty: Medium
tags: [Array, Heap, Geometry, Divide and Conquer, Quickselect, Sorting]
link: https://leetcode.com/problems/k-closest-points-to-origin/
---

# K Closest Points to Origin

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/) |
| **Tags** | Array, Heap, Geometry, Sorting, Quickselect |

## Problem Statement

Given an array of points where `points[i] = [xi, yi]`, return the `k` closest points to the origin `(0, 0)`.

The distance from a point `(x, y)` to the origin is `√(x² + y²)`. Return the answer in **any order**. The answer is guaranteed to be unique.

Example: `points = [[1,3],[-2,2]]`, k = 1 → `[[-2,2]]`

Distance of [1,3] = √10, distance of [-2,2] = √8. The closest is [-2,2].

## Intuition

This is the **Top K smallest** pattern applied to a custom metric (Euclidean distance). Since order doesn't matter within the result and we're comparing distances:

1. **Skip the square root** — comparing `x²+y²` directly is sufficient (monotone transformation preserves ordering)
2. Apply one of: sort, max-heap of size k, or quickselect

**Key insight for heap approach:** To find the k *smallest* distances, maintain a **max-heap** of size k. When the heap exceeds k, evict the *farthest* point (max distance). Whatever remains is the k closest.

## Approach 1: Sort by Distance — O(n log n)

Sort all points by squared distance, return first k.

```cpp
vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    sort(points.begin(), points.end(), [](const vector<int>& a, const vector<int>& b) {
        return a[0]*a[0] + a[1]*a[1] < b[0]*b[0] + b[1]*b[1];
    });
    return vector<vector<int>>(points.begin(), points.begin() + k);
}
```

```java
class Solution {
    public int[][] kClosest(int[][] points, int k) {
        Arrays.sort(points, (a, b) ->
            (a[0]*a[0] + a[1]*a[1]) - (b[0]*b[0] + b[1]*b[1])
        );
        return Arrays.copyOfRange(points, 0, k);
    }
}
```

```typescript
function kClosest(points: number[][], k: number): number[][] {
    const dist = (p: number[]) => p[0]*p[0] + p[1]*p[1];
    return points
        .sort((a, b) => dist(a) - dist(b))
        .slice(0, k);
}
```

```python
class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        points.sort(key=lambda p: p[0]**2 + p[1]**2)
        return points[:k]
```

```go
func kClosest(points [][]int, k int) [][]int {
    sort.Slice(points, func(i, j int) bool {
        di := points[i][0]*points[i][0] + points[i][1]*points[i][1]
        dj := points[j][0]*points[j][0] + points[j][1]*points[j][1]
        return di < dj
    })
    return points[:k]
}
```

**Time:** O(n log n) — **Space:** O(1)

## Approach 2: Max-Heap of Size k — O(n log k)

For k smallest: maintain a **max-heap** of size k. Evict the farthest (largest distance) whenever size exceeds k. The heap retains the k closest.

```cpp
vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    // Max-heap: {squared_distance, point_index}
    priority_queue<pair<int,int>> maxHeap;

    for (int i = 0; i < points.size(); i++) {
        int d = points[i][0]*points[i][0] + points[i][1]*points[i][1];
        maxHeap.push({d, i});
        if (maxHeap.size() > k) maxHeap.pop(); // evict farthest
    }

    vector<vector<int>> res;
    while (!maxHeap.empty()) {
        res.push_back(points[maxHeap.top().second]);
        maxHeap.pop();
    }
    return res;
}
```

```java
class Solution {
    public int[][] kClosest(int[][] points, int k) {
        // Max-heap by distance (keep k smallest → evict max)
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
            (a, b) -> (b[0]*b[0] + b[1]*b[1]) - (a[0]*a[0] + a[1]*a[1])
        );

        for (int[] p : points) {
            maxHeap.offer(p);
            if (maxHeap.size() > k) maxHeap.poll(); // evict farthest
        }

        return maxHeap.toArray(new int[k][]);
    }
}
```

```typescript
function kClosest(points: number[][], k: number): number[][] {
    const dist = (p: number[]) => p[0]*p[0] + p[1]*p[1];
    // Max-heap: comparator returns positive if a should be popped AFTER b
    const heap = new Heap<number[]>((a, b) => dist(b) - dist(a));

    for (const p of points) {
        heap.push(p);
        if (heap.size() > k) heap.pop(); // evict farthest
    }

    const res: number[][] = [];
    while (!heap.isEmpty()) res.push(heap.pop()!);
    return res;
}
```

```python
import heapq

class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        heap: list = []  # max-heap via negation of distance

        for x, y in points:
            d = x*x + y*y
            # Push (-distance, point) — largest distance = highest priority in max-heap
            heapq.heappush(heap, (-d, x, y))
            if len(heap) > k:
                heapq.heappop(heap)  # evict farthest

        return [[x, y] for (_, x, y) in heap]
```

```go
type PointHeap struct {
    pts [][]int
}
func (h PointHeap) Len() int { return len(h.pts) }
func (h PointHeap) Less(i, j int) bool {
    di := h.pts[i][0]*h.pts[i][0] + h.pts[i][1]*h.pts[i][1]
    dj := h.pts[j][0]*h.pts[j][0] + h.pts[j][1]*h.pts[j][1]
    return di > dj // max-heap
}
func (h PointHeap) Swap(i, j int)       { h.pts[i], h.pts[j] = h.pts[j], h.pts[i] }
func (h *PointHeap) Push(x interface{}) { h.pts = append(h.pts, x.([]int)) }
func (h *PointHeap) Pop() interface{}   {
    old := h.pts; x := old[len(old)-1]; h.pts = old[:len(old)-1]; return x
}

func kClosest(points [][]int, k int) [][]int {
    h := &PointHeap{}
    heap.Init(h)
    for _, p := range points {
        heap.Push(h, p)
        if h.Len() > k { heap.Pop(h) }
    }
    return h.pts
}
```

**Time:** O(n log k) — **Space:** O(k)

## Approach 3: Quickselect — O(n) Average

Partition the points array by distance around a pivot until the pivot lands at index k. All points to the left are the k closest (not necessarily sorted among themselves).

```cpp
vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    int lo = 0, hi = points.size() - 1;
    auto dist = [&](int i) {
        return points[i][0]*points[i][0] + points[i][1]*points[i][1];
    };

    while (lo < hi) {
        int pivot = dist(hi), p = lo;
        for (int i = lo; i < hi; i++) {
            if (dist(i) <= pivot) swap(points[i], points[p++]);
        }
        swap(points[p], points[hi]);
        if (p == k) break;
        else if (p < k) lo = p + 1;
        else hi = p - 1;
    }

    return vector<vector<int>>(points.begin(), points.begin() + k);
}
```

```java
class Solution {
    public int[][] kClosest(int[][] points, int k) {
        int lo = 0, hi = points.length - 1;
        while (lo < hi) {
            int p = partition(points, lo, hi);
            if (p == k) break;
            else if (p < k) lo = p + 1;
            else hi = p - 1;
        }
        return Arrays.copyOfRange(points, 0, k);
    }

    private int partition(int[][] pts, int lo, int hi) {
        long pivot = dist(pts[hi]);
        int p = lo;
        for (int i = lo; i < hi; i++) {
            if (dist(pts[i]) <= pivot) { int[] t = pts[i]; pts[i] = pts[p]; pts[p++] = t; }
        }
        int[] t = pts[p]; pts[p] = pts[hi]; pts[hi] = t;
        return p;
    }

    private long dist(int[] pt) { return (long)pt[0]*pt[0] + (long)pt[1]*pt[1]; }
}
```

```typescript
function kClosest(points: number[][], k: number): number[][] {
    const dist = (p: number[]) => p[0]*p[0] + p[1]*p[1];
    let lo = 0, hi = points.length - 1;

    while (lo < hi) {
        const pivot = dist(points[hi]);
        let p = lo;
        for (let i = lo; i < hi; i++) {
            if (dist(points[i]) <= pivot) [points[i], points[p++]] = [points[p], points[i]];
        }
        [points[p], points[hi]] = [points[hi], points[p]];
        if (p === k) break;
        else if (p < k) lo = p + 1;
        else hi = p - 1;
    }
    return points.slice(0, k);
}
```

```python
import random

class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        def dist(p): return p[0]**2 + p[1]**2

        def partition(lo, hi):
            pivot_idx = random.randint(lo, hi)
            points[pivot_idx], points[hi] = points[hi], points[pivot_idx]
            pivot, p = dist(points[hi]), lo
            for i in range(lo, hi):
                if dist(points[i]) <= pivot:
                    points[i], points[p] = points[p], points[i]
                    p += 1
            points[p], points[hi] = points[hi], points[p]
            return p

        lo, hi = 0, len(points) - 1
        while lo < hi:
            p = partition(lo, hi)
            if p == k: break
            elif p < k: lo = p + 1
            else: hi = p - 1

        return points[:k]
```

```go
func kClosest(points [][]int, k int) [][]int {
    dist := func(p []int) int { return p[0]*p[0] + p[1]*p[1] }
    lo, hi := 0, len(points)-1

    for lo < hi {
        pivot, p := dist(points[hi]), lo
        for i := lo; i < hi; i++ {
            if dist(points[i]) <= pivot {
                points[i], points[p] = points[p], points[i]
                p++
            }
        }
        points[p], points[hi] = points[hi], points[p]
        if p == k { break }
        if p < k { lo = p + 1 } else { hi = p - 1 }
    }
    return points[:k]
}
```

**Time:** O(n) average — **Space:** O(1)

## Comparison

| Approach | Time | Space | Output Ordered | Best When |
|---|---|---|---|---|
| Sort | O(n log n) | O(1) | Yes | k ≈ n |
| Max-Heap | O(n log k) | O(k) | No | k << n, streaming |
| Quickselect | O(n) avg | O(1) | No | One-shot, large n |

## Key Interview Insights

- **Skip the square root.** `√(x²+y²)` is monotone, so comparing `x²+y²` gives the same ordering. Avoids floating-point.
- **Top K smallest → max-heap** (not min-heap). Counterintuitive: you use a max-heap to *discard* the farthest. This is the key conceptual flip.
- **The answer can be returned in any order.** This is why quickselect works — it doesn't fully sort.
- **Overflow risk in Java/Go:** `x*x + y*y` with `x, y` up to 10^4 gives up to 2×10^8, which fits in `int`. But `10^5` would overflow — check constraints and use `long` if needed.
- **Generalizes to:** K nearest neighbors, geographic queries, recommendation systems. This exact pattern with a max-heap is used in production for approximate nearest neighbor search.
