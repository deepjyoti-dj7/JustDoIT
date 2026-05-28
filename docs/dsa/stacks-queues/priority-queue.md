---
title: Priority Queue (Heap)
description: Priority queue and heap — concepts, operations, patterns, and top-K interview techniques
---

# Priority Queue (Heap)

A **priority queue** is an abstract data type where each element has a **priority**, and the element with the highest (or lowest) priority is always dequeued first. The standard implementation is a **binary heap**.

A **min-heap** dequeues the smallest element first. A **max-heap** dequeues the largest first.

## Core Operations

| Operation | Time | Notes |
|---|---|---|
| `insert(x)` / `offer(x)` | O(log n) | Sift up |
| `extractMin()` / `poll()` | O(log n) | Sift down |
| `peek()` / `top()` | O(1) | View min/max without removing |
| `heapify(array)` | O(n) | Build heap from scratch |
| `size()` / `isEmpty()` | O(1) | |

## Implementation

```cpp
#include <queue>
// Min-heap (default)
priority_queue<int, vector<int>, greater<int>> minHeap;
minHeap.push(3);
minHeap.push(1);
minHeap.push(2);
int top = minHeap.top();  // 1
minHeap.pop();            // removes 1

// Max-heap (default for priority_queue)
priority_queue<int> maxHeap;
maxHeap.push(3); maxHeap.push(1); maxHeap.push(2);
int maxTop = maxHeap.top(); // 3
```

```java
// Min-heap
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(3);
minHeap.offer(1);
minHeap.offer(2);
int top = minHeap.peek();  // 1
minHeap.poll();            // removes 1

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
// Or: new PriorityQueue<>((a, b) -> b - a);
```

```typescript
// No built-in heap in JS/TS — implement or use a library
// Minimal min-heap for interviews:
class MinHeap {
    private heap: number[] = [];
    push(val: number) {
        this.heap.push(val);
        this._siftUp(this.heap.length - 1);
    }
    pop(): number {
        const top = this.heap[0];
        const last = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._siftDown(0);
        }
        return top;
    }
    peek(): number { return this.heap[0]; }
    size(): number { return this.heap.length; }
    private _siftUp(i: number) {
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (this.heap[parent] <= this.heap[i]) break;
            [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
            i = parent;
        }
    }
    private _siftDown(i: number) {
        const n = this.heap.length;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this.heap[l] < this.heap[smallest]) smallest = l;
            if (r < n && this.heap[r] < this.heap[smallest]) smallest = r;
            if (smallest === i) break;
            [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
            i = smallest;
        }
    }
}
```

```python
import heapq

# Min-heap (Python's heapq is always a min-heap)
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 2)
top = heap[0]           # peek: 1
val = heapq.heappop(heap)  # 1

# Max-heap: negate values
max_heap = []
heapq.heappush(max_heap, -3)
heapq.heappush(max_heap, -1)
max_top = -max_heap[0]  # 3

# Heapify in O(n)
nums = [3, 1, 4, 1, 5]
heapq.heapify(nums)
```

```go
import "container/heap"

type MinHeap []int
func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() interface{} {
    old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x
}

// Usage:
h := &MinHeap{3, 1, 2}
heap.Init(h)
heap.Push(h, 0)
top := (*h)[0]          // peek
val := heap.Pop(h).(int)
```

## When to Use a Priority Queue

| Scenario | Why PQ |
|---|---|
| **Top K elements** | Maintain a heap of size k; O(n log k) vs O(n log n) sort |
| **K closest points** | Max-heap of size k, keyed by distance |
| **Merge K sorted lists** | Always extract the minimum among k current heads |
| **Dijkstra's shortest path** | Process lowest-cost node first |
| **Task scheduling** | Process by priority, not arrival time |
| **Median from stream** | Two heaps: max-heap for lower half, min-heap for upper half |

## Pattern 1: Top K Smallest Elements

Counterintuitively, use a **max-heap** of size k. When it exceeds k, pop the maximum (which is larger than what we want to keep).

```cpp
vector<int> topKSmallest(vector<int>& nums, int k) {
    priority_queue<int> maxHeap; // max-heap
    for (int n : nums) {
        maxHeap.push(n);
        if (maxHeap.size() > k) maxHeap.pop();
    }
    vector<int> result;
    while (!maxHeap.empty()) {
        result.push_back(maxHeap.top());
        maxHeap.pop();
    }
    return result;
}
```

```java
int[] topKSmallest(int[] nums, int k) {
    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int n : nums) {
        maxHeap.offer(n);
        if (maxHeap.size() > k) maxHeap.poll();
    }
    int[] result = new int[k];
    for (int i = k - 1; i >= 0; i--) result[i] = maxHeap.poll();
    return result;
}
```

```typescript
function topKSmallest(nums: number[], k: number): number[] {
    // Using a max-heap simulation with sorted array (interview-friendly)
    const heap: number[] = [];
    for (const n of nums) {
        heap.push(n);
        heap.sort((a, b) => b - a); // max at index 0
        if (heap.length > k) heap.shift(); // remove max
    }
    return heap;
}
```

```python
import heapq

def top_k_smallest(nums: list[int], k: int) -> list[int]:
    max_heap = []
    for n in nums:
        heapq.heappush(max_heap, -n)  # negate for max-heap
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    return [-x for x in max_heap]
```

```go
func topKSmallest(nums []int, k int) []int {
    // Max-heap to keep k smallest
    h := &MaxHeap{}
    heap.Init(h)
    for _, n := range nums {
        heap.Push(h, n)
        if h.Len() > k { heap.Pop(h) }
    }
    result := make([]int, h.Len())
    for i := range result { result[i] = heap.Pop(h).(int) }
    return result
}
```

## Pattern 2: K Closest Points to Origin

```cpp
vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {
    // max-heap by distance squared
    auto cmp = [](vector<int>& a, vector<int>& b) {
        return a[0]*a[0]+a[1]*a[1] < b[0]*b[0]+b[1]*b[1];
    };
    priority_queue<vector<int>, vector<vector<int>>, decltype(cmp)> pq(cmp);
    for (auto& p : points) {
        pq.push(p);
        if (pq.size() > k) pq.pop();
    }
    vector<vector<int>> result;
    while (!pq.empty()) { result.push_back(pq.top()); pq.pop(); }
    return result;
}
```

```java
int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
        (a, b) -> (b[0]*b[0]+b[1]*b[1]) - (a[0]*a[0]+a[1]*a[1])
    );
    for (int[] p : points) {
        maxHeap.offer(p);
        if (maxHeap.size() > k) maxHeap.poll();
    }
    return maxHeap.toArray(new int[k][]);
}
```

```typescript
function kClosest(points: number[][], k: number): number[][] {
    const dist = (p: number[]) => p[0] ** 2 + p[1] ** 2;
    // Sort by distance — O(n log n), acceptable for interviews
    return points.sort((a, b) => dist(a) - dist(b)).slice(0, k);
}
```

```python
import heapq

def k_closest(points: list[list[int]], k: int) -> list[list[int]]:
    max_heap = []
    for x, y in points:
        d = -(x*x + y*y)  # negate for max-heap
        heapq.heappush(max_heap, (d, x, y))
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    return [[x, y] for _, x, y in max_heap]
```

```go
func kClosest(points [][]int, k int) [][]int {
    dist := func(p []int) int { return p[0]*p[0] + p[1]*p[1] }
    sort.Slice(points, func(i, j int) bool {
        return dist(points[i]) < dist(points[j])
    })
    return points[:k]
}
```

## Pattern 3: Median from Data Stream

Maintain two heaps:
- **Max-heap** for the lower half (left side)
- **Min-heap** for the upper half (right side)
- The median is the top of the larger heap (or average of both tops when equal size)

| Invariant | Condition |
|---|---|
| Size difference | `|maxHeap.size() - minHeap.size()| <= 1` |
| Ordering | `maxHeap.top() <= minHeap.top()` (left max ≤ right min) |

**Time:** O(log n) per insert, O(1) per findMedian.

## Complexity Quick Reference

| Operation | Min/Max Heap | Sorted Array |
|---|---|---|
| Insert | O(log n) | O(n) |
| Extract min/max | O(log n) | O(1) from end |
| Peek min/max | O(1) | O(1) |
| Build from array | O(n) | O(n log n) |

## Heap vs Sort

| Approach | Time | Use When |
|---|---|---|
| Sort + slice | O(n log n) | Need complete sorted order |
| Heap size k | O(n log k) | Only need top k (k << n) |
| QuickSelect | O(n) average | Need exactly the k-th element |

## Pitfalls

- **Python max-heap** — negate all values. Don't forget to negate back when extracting.
- **Custom comparators in Java** — integer overflow with `a - b` comparators when values can be INT_MIN. Prefer `Integer.compare(a, b)`.
- **C++ default is max-heap** — use `greater<int>` for min-heap: `priority_queue<int, vector<int>, greater<int>>`.
- **Heap is not fully sorted** — `heap[1]` is NOT guaranteed to be the second smallest. Only `heap[0]` is guaranteed.

