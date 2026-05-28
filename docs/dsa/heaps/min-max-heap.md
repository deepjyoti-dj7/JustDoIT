---
title: Min Heap & Max Heap
description: Binary heap data structure, heap properties, array representation, and core operations
---

# Min Heap & Max Heap

A **heap** is a complete binary tree stored in a flat array where every parent satisfies a fixed ordering rule relative to its children. It gives O(1) access to the minimum or maximum element — the go-to structure whenever you repeatedly need the extreme value from a dynamic collection.

## The Heap Property

| Heap Type | Rule | Root |
|---|---|---|
| **Min-Heap** | Every parent ≤ both children | Smallest element |
| **Max-Heap** | Every parent ≥ both children | Largest element |

The property applies only between parent and direct children — **siblings have no guaranteed order**. This is the key distinction between a heap and a sorted array.

## Array Representation

A complete binary tree maps perfectly to an array using index arithmetic — no pointers needed:

```
Index formula (0-based):
  Left child  of i  →  2i + 1
  Right child of i  →  2i + 2
  Parent      of i  →  (i - 1) / 2

Min-heap example:
  Array: [1, 3, 6, 5, 9, 8]
  Tree:
           1         (idx 0)
          / \
         3   6       (idx 1, 2)
        / \ /
       5  9 8        (idx 3, 4, 5)
```

**Why array over tree nodes?** Cache-friendly, constant-factor faster than pointer traversal, and no allocations per node.

## Core Operations

### Peek — O(1)

The root `heap[0]` is always the min (or max). No traversal needed.

### Insertion (Push) — O(log n)

1. Append new element to end (maintains complete-tree shape)
2. **Sift up**: swap with parent while parent violates the heap property

```
Insert 2 into min-heap [1, 3, 6, 5, 9, 8]:
Append → [1, 3, 6, 5, 9, 8, 2]
idx 6, parent idx 2 = 6. 2 < 6 → swap → [1, 3, 2, 5, 9, 8, 6]
idx 2, parent idx 0 = 1. 2 > 1 → STOP
Result: [1, 3, 2, 5, 9, 8, 6]
```

### Extraction (Pop) — O(log n)

1. Save root (the answer)
2. Move last element to root (maintains complete-tree shape)
3. Remove last
4. **Sift down**: swap with the smaller child while current node violates the property

```
Pop from [1, 3, 2, 5, 9, 8, 6]:
Save 1, move 6 to root → [6, 3, 2, 5, 9, 8], return 1
Sift down 6: children 3,2 → min=2 at idx 2. 6>2 → swap → [2, 3, 6, 5, 9, 8]
6 at idx 2: children 5,9... none < 6 in this case... (no left child beyond array) → STOP
```

### Build Heap from Array — O(n)

Starting from the last non-leaf `(n/2 - 1)` and sifting down is O(n) — better than n insertions which is O(n log n). The proof: most nodes are near leaves and do very little work.

## Implementation

```cpp
#include <vector>
#include <algorithm>
using namespace std;

class MinHeap {
    vector<int> h;

    void siftUp(int i) {
        while (i > 0) {
            int p = (i - 1) / 2;
            if (h[p] <= h[i]) break;
            swap(h[i], h[p]);
            i = p;
        }
    }

    void siftDown(int i) {
        int n = h.size();
        while (true) {
            int s = i, l = 2*i+1, r = 2*i+2;
            if (l < n && h[l] < h[s]) s = l;
            if (r < n && h[r] < h[s]) s = r;
            if (s == i) break;
            swap(h[i], h[s]);
            i = s;
        }
    }

public:
    void push(int v) { h.push_back(v); siftUp(h.size()-1); }
    int pop() {
        int top = h[0];
        h[0] = h.back(); h.pop_back();
        if (!h.empty()) siftDown(0);
        return top;
    }
    int peek()  { return h[0]; }
    int size()  { return h.size(); }
    bool empty(){ return h.empty(); }
};

// Built-in: priority_queue (max-heap by default)
// priority_queue<int>            maxHeap;
// priority_queue<int,vector<int>,greater<int>> minHeap;
```

```java
import java.util.*;

// Java's PriorityQueue is a min-heap by default
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

minHeap.offer(3);
minHeap.offer(1);
minHeap.offer(2);
int top = minHeap.peek();  // 1 — does not remove
int min = minHeap.poll();  // 1 — removes

// Custom comparator (min-heap by first element of pair)
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
```

```typescript
// TypeScript has no built-in heap — implement or use a library
class MinHeap<T = number> {
    private h: T[] = [];
    constructor(private cmp: (a: T, b: T) => number = (a: any, b: any) => a - b) {}

    push(val: T): void {
        this.h.push(val);
        this.siftUp(this.h.length - 1);
    }
    pop(): T {
        const top = this.h[0];
        const last = this.h.pop()!;
        if (this.h.length > 0) { this.h[0] = last; this.siftDown(0); }
        return top;
    }
    peek(): T  { return this.h[0]; }
    size(): number { return this.h.length; }
    isEmpty(): boolean { return this.h.length === 0; }

    private siftUp(i: number): void {
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (this.cmp(this.h[p], this.h[i]) <= 0) break;
            [this.h[i], this.h[p]] = [this.h[p], this.h[i]];
            i = p;
        }
    }
    private siftDown(i: number): void {
        const n = this.h.length;
        while (true) {
            let s = i;
            const l = 2*i+1, r = 2*i+2;
            if (l < n && this.cmp(this.h[l], this.h[s]) < 0) s = l;
            if (r < n && this.cmp(this.h[r], this.h[s]) < 0) s = r;
            if (s === i) break;
            [this.h[i], this.h[s]] = [this.h[s], this.h[i]];
            i = s;
        }
    }
}
```

```python
import heapq

# heapq implements a min-heap on a regular list
heap: list[int] = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 2)

print(heap[0])               # 1 — peek (no removal)
print(heapq.heappop(heap))   # 1 — pop

# Max-heap trick: negate values
max_heap: list[int] = []
heapq.heappush(max_heap, -5)
heapq.heappush(max_heap, -2)
max_val = -heapq.heappop(max_heap)  # 5

# Build heap from existing list in O(n)
data = [3, 1, 4, 1, 5, 9]
heapq.heapify(data)  # mutates in-place

# Custom key: push (priority, value) tuples
heapq.heappush(heap, (priority, value))
```

```go
import "container/heap"

// Go requires implementing heap.Interface
type MinHeap []int

func (h MinHeap) Len() int            { return len(h) }
func (h MinHeap) Less(i, j int) bool  { return h[i] < h[j] } // flip for max-heap
func (h MinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() interface{}   {
    old := *h
    x := old[len(old)-1]
    *h = old[:len(old)-1]
    return x
}

// Usage
h := &MinHeap{3, 1, 4}
heap.Init(h)           // build heap O(n)
heap.Push(h, 2)
top := (*h)[0]         // peek
min := heap.Pop(h).(int) // pop
```

## Min-Heap vs Max-Heap: Decision Guide

| Problem Goal | Heap to Use | Reasoning |
|---|---|---|
| Always access minimum | Min-heap | Root = min |
| Always access maximum | Max-heap | Root = max |
| Top K **largest** elements | **Min**-heap of size k | Evict smallest to keep k-largest |
| Top K **smallest** elements | **Max**-heap of size k | Evict largest to keep k-smallest |
| Kth largest / smallest | Same as above | Stop after evicting n-k elements |
| Running median | Min-heap + Max-heap | Split into lower/upper halves |
| Priority scheduling | Min or Max by priority | |
| K-way merge | Min-heap | Always pick smallest head |

## Heap vs Other Structures

| | Heap | Sorted Array | Balanced BST |
|---|---|---|---|
| Get min/max | **O(1)** | O(1) | O(log n) |
| Insert | O(log n) | O(n) | O(log n) |
| Delete min/max | O(log n) | O(n) | O(log n) |
| Delete arbitrary | O(n) | O(n) | O(log n) |
| Search | O(n) | O(log n) | O(log n) |
| Build from n | **O(n)** | O(n log n) | O(n log n) |

Use a heap when: you only need the min/max repeatedly, not general search.

## Common Pitfalls

- **Heap ≠ sorted array.** `heap[1]` is NOT the second smallest. Only the root is guaranteed.
- **Python max-heap.** `heapq` is min-heap only. Negate integers; for objects, negate the comparison key or use `(-val, obj)` tuples.
- **C++ `priority_queue` is max-heap by default.** Use `greater<int>` for min-heap.
- **Java comparator overflow.** `(a, b) -> a - b` can overflow for large integers. Prefer `Integer.compare(a, b)`.
- **Go's `heap.Pop` vs direct slice access.** Always use `heap.Pop(h)` to maintain the invariant — never remove from the slice directly.
