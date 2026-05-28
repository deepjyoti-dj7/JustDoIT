---
title: Heap Operations
description: Complete reference for heap operations, language APIs, custom comparators, and common patterns
---

# Heap Operations

This page is a practical reference for working with heaps across different languages and problem contexts. Understanding the language-specific APIs and their quirks is as important as understanding the heap data structure itself.

## Operation Complexity Reference

| Operation | Time | Notes |
|---|---|---|
| `peek` (find min/max) | O(1) | Read `heap[0]` |
| `push` (insert) | O(log n) | Append + sift up |
| `pop` (extract min/max) | O(log n) | Swap root with last + sift down |
| `heapify` (build from array) | **O(n)** | Start from last non-leaf, sift down |
| `decrease-key` | O(log n) | Update + sift up (often unsupported natively) |
| `delete arbitrary` | O(n) | Find + remove (use lazy deletion instead) |
| `merge two heaps` | O(n) | Or O(log n) with advanced heaps (Fibonacci) |

## Language API Reference

### C++ — `priority_queue`

```cpp
#include <queue>
#include <vector>
using namespace std;

// Max-heap (default)
priority_queue<int> maxPQ;

// Min-heap
priority_queue<int, vector<int>, greater<int>> minPQ;

// Custom comparator: min-heap on pair's first element
auto cmp = [](pair<int,int>& a, pair<int,int>& b) {
    return a.first > b.first; // '>' makes it a min-heap
};
priority_queue<pair<int,int>, vector<pair<int,int>>, decltype(cmp)> pq(cmp);

// Operations
pq.push({3, 'a'});
pq.top();   // peek — does NOT remove
pq.pop();   // remove top (returns void!)
pq.size();
pq.empty();

// Build from vector: no direct heapify; use make_heap
vector<int> v = {3,1,4,1,5};
make_heap(v.begin(), v.end());          // max-heap in O(n)
push_heap(v.begin(), v.end());          // after push_back
pop_heap(v.begin(), v.end()); v.pop_back(); // pop
```

```java
import java.util.*;

// Min-heap (default)
PriorityQueue<Integer> minPQ = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Collections.reverseOrder());

// Custom comparator: min-heap by distance
PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> Integer.compare(a[0]*a[0] + a[1]*a[1], b[0]*b[0] + b[1]*b[1])
);

// Operations
pq.offer(val);   // push (prefer offer over add — returns false vs throws)
pq.peek();       // peek — null if empty
pq.poll();       // pop  — null if empty
pq.size();
pq.isEmpty();

// Initialize with capacity
PriorityQueue<Integer> pq2 = new PriorityQueue<>(n);

// Build from collection — O(n)
PriorityQueue<Integer> fromList = new PriorityQueue<>(Arrays.asList(3,1,4,1,5));
```

```typescript
// No built-in heap in TypeScript/JavaScript.
// Generic heap with custom comparator:
class Heap<T> {
    private h: T[] = [];
    constructor(private cmp: (a: T, b: T) => number) {}

    push(val: T): void {
        this.h.push(val);
        let i = this.h.length - 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.cmp(this.h[p], this.h[i]) <= 0) break;
            [this.h[i], this.h[p]] = [this.h[p], this.h[i]];
            i = p;
        }
    }

    pop(): T | undefined {
        if (this.h.length === 0) return undefined;
        const top = this.h[0];
        const last = this.h.pop()!;
        if (this.h.length > 0) {
            this.h[0] = last;
            let i = 0;
            while (true) {
                let s = i, l = 2*i+1, r = 2*i+2;
                if (l < this.h.length && this.cmp(this.h[l], this.h[s]) < 0) s = l;
                if (r < this.h.length && this.cmp(this.h[r], this.h[s]) < 0) s = r;
                if (s === i) break;
                [this.h[i], this.h[s]] = [this.h[s], this.h[i]];
                i = s;
            }
        }
        return top;
    }

    peek(): T | undefined { return this.h[0]; }
    size(): number { return this.h.length; }
}

// Min-heap of numbers
const minH = new Heap<number>((a, b) => a - b);
// Max-heap of numbers
const maxH = new Heap<number>((a, b) => b - a);
// Heap of [distance, index] sorted by distance
const distH = new Heap<[number, number]>((a, b) => a[0] - b[0]);
```

```python
import heapq

# heapq — min-heap on a plain list
heap: list = []

heapq.heappush(heap, val)          # push
heapq.heappop(heap)                # pop
heap[0]                            # peek (no removal)
heapq.heapify(lst)                 # build in O(n), mutates in-place
heapq.nlargest(k, iterable)        # top-k largest, O(n log k)
heapq.nsmallest(k, iterable)       # top-k smallest, O(n log k)

# Max-heap: negate integers
heapq.heappush(heap, -val)
max_val = -heapq.heappop(heap)

# Custom key: push (key, value) tuples
heapq.heappush(heap, (priority, item))
_, item = heapq.heappop(heap)

# Tie-breaking with tuples (Python compares element-by-element)
heapq.heappush(heap, (freq, count, word))  # count breaks ties deterministically
```

```go
import "container/heap"

// Go: implement heap.Interface on your type
// Interface: Len, Less, Swap, Push, Pop

// Generic int min-heap
type IntHeap []int
func (h IntHeap) Len() int            { return len(h) }
func (h IntHeap) Less(i, j int) bool  { return h[i] < h[j] }
func (h IntHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() interface{}   { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }

// Max-heap: flip Less
type MaxHeap []int
func (h MaxHeap) Less(i, j int) bool { return h[i] > h[j] }
// ... (same Len, Swap, Push, Pop)

// Usage
h := &IntHeap{3, 1, 4}
heap.Init(h)            // O(n) heapify
heap.Push(h, 2)         // push
top := (*h)[0]          // peek
min := heap.Pop(h).(int) // pop
```

## Custom Comparators

Custom comparators let you heap any object by any key. The key rule:

- **C++:** `greater<T>` means "larger value gets lower priority" → min-heap. For custom: return `true` if `a` should be popped **after** `b`.
- **Java:** Return negative if `a` should be popped **before** `b` (higher priority).
- **Python:** `heapq` uses `<`. Use tuples `(key, value)`. For max-heap, negate the key.
- **Go:** `Less(i, j)` returns `true` if element `i` should be popped **before** `j`.

### Pattern: Heap of Pairs/Objects

The most common interview pattern — heap sorted by one field of a composite object.

```cpp
// Min-heap by distance from origin
struct Point { int x, y; };
auto cmp = [](const Point& a, const Point& b) {
    return a.x*a.x + a.y*a.y > b.x*b.x + b.y*b.y; // '>' = min-heap
};
priority_queue<Point, vector<Point>, decltype(cmp)> pq(cmp);
```

```java
// Min-heap: [dist, x, y] sorted by dist
PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> Integer.compare(a[0], b[0])
);
pq.offer(new int[]{dist, x, y});
int[] closest = pq.poll();
```

```typescript
// Min-heap of [frequency, value] sorted by frequency
const pq = new Heap<[number, number]>((a, b) => a[0] - b[0]);
pq.push([3, 'a'.charCodeAt(0)]);
const [freq, val] = pq.pop()!;
```

```python
# Min-heap by frequency, then by value for tie-breaking
import heapq
heap = []
heapq.heappush(heap, (freq, val))
freq, val = heapq.heappop(heap)
```

```go
type Item struct{ val, priority int }
type PQ []*Item
func (pq PQ) Less(i, j int) bool { return pq[i].priority < pq[j].priority }
func (pq PQ) Len() int           { return len(pq) }
func (pq PQ) Swap(i, j int)      { pq[i], pq[j] = pq[j], pq[i] }
func (pq *PQ) Push(x interface{}) { *pq = append(*pq, x.(*Item)) }
func (pq *PQ) Pop() interface{}   { old := *pq; x := old[len(old)-1]; *pq = old[:len(old)-1]; return x }
```

## Lazy Deletion

When you need to **update or remove an arbitrary element** from a heap (not supported in O(log n) natively), use lazy deletion:

1. Mark the element as "deleted" in a hash set
2. Keep pushing/popping normally
3. On each `pop`, skip elements that are in the "deleted" set

This avoids the O(n) cost of finding and removing arbitrary elements.

```cpp
unordered_set<int> deleted;

void remove(int val) { deleted.insert(val); }

int popValid(priority_queue<int>& pq) {
    while (!pq.empty() && deleted.count(pq.top())) {
        deleted.erase(pq.top());
        pq.pop();
    }
    return pq.top();
}
```

```java
Set<Integer> deleted = new HashSet<>();

void remove(int val) { deleted.add(val); }

int popValid(PriorityQueue<Integer> pq) {
    while (!pq.isEmpty() && deleted.contains(pq.peek())) {
        deleted.remove(pq.poll());
    }
    return pq.poll();
}
```

```typescript
const deleted = new Set<number>();

function remove(val: number): void { deleted.add(val); }

function popValid(pq: Heap<number>): number {
    while (!pq.isEmpty() && deleted.has(pq.peek()!)) {
        deleted.delete(pq.peek()!);
        pq.pop();
    }
    return pq.pop()!;
}
```

```python
deleted = set()

def remove(val): deleted.add(val)

def pop_valid(heap):
    while heap and heap[0] in deleted:
        deleted.discard(heapq.heappop(heap))
    return heapq.heappop(heap)
```

```go
deleted := map[int]bool{}

func remove(val int) { deleted[val] = true }

func popValid(h *IntHeap) int {
    for h.Len() > 0 && deleted[(*h)[0]] {
        delete(deleted, (*h)[0])
        heap.Pop(h)
    }
    return heap.Pop(h).(int)
}
```

## Heap Sort — O(n log n), O(1) space

Build a max-heap in-place, then repeatedly extract the max to the sorted portion.

```cpp
void heapSort(vector<int>& arr) {
    int n = arr.size();
    // Build max-heap
    for (int i = n/2 - 1; i >= 0; i--) {
        // sift down from i
        auto siftDown = [&](int i, int end) {
            while (true) {
                int s = i, l = 2*i+1, r = 2*i+2;
                if (l < end && arr[l] > arr[s]) s = l;
                if (r < end && arr[r] > arr[s]) s = r;
                if (s == i) break;
                swap(arr[i], arr[s]);
                i = s;
            }
        };
        siftDown(i, n);
    }
    // Extract max one by one
    for (int i = n-1; i > 0; i--) {
        swap(arr[0], arr[i]);
        // sift down within [0, i)
    }
}
```

```java
void heapSort(int[] arr) {
    int n = arr.length;
    // Build max-heap
    for (int i = n/2 - 1; i >= 0; i--) siftDown(arr, i, n);
    // Extract
    for (int i = n-1; i > 0; i--) {
        int tmp = arr[0]; arr[0] = arr[i]; arr[i] = tmp;
        siftDown(arr, 0, i);
    }
}
void siftDown(int[] arr, int i, int end) {
    while (true) {
        int s = i, l = 2*i+1, r = 2*i+2;
        if (l < end && arr[l] > arr[s]) s = l;
        if (r < end && arr[r] > arr[s]) s = r;
        if (s == i) break;
        int tmp = arr[i]; arr[i] = arr[s]; arr[s] = tmp;
        i = s;
    }
}
```

```typescript
function heapSort(arr: number[]): void {
    const n = arr.length;
    const siftDown = (i: number, end: number): void => {
        while (true) {
            let s = i, l = 2*i+1, r = 2*i+2;
            if (l < end && arr[l] > arr[s]) s = l;
            if (r < end && arr[r] > arr[s]) s = r;
            if (s === i) break;
            [arr[i], arr[s]] = [arr[s], arr[i]];
            i = s;
        }
    };
    for (let i = Math.floor(n/2) - 1; i >= 0; i--) siftDown(i, n);
    for (let i = n-1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        siftDown(0, i);
    }
}
```

```python
def heap_sort(arr: list) -> None:
    n = len(arr)
    def sift_down(i, end):
        while True:
            s, l, r = i, 2*i+1, 2*i+2
            if l < end and arr[l] > arr[s]: s = l
            if r < end and arr[r] > arr[s]: s = r
            if s == i: break
            arr[i], arr[s] = arr[s], arr[i]
            i = s
    for i in range(n//2 - 1, -1, -1):
        sift_down(i, n)
    for i in range(n-1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        sift_down(0, i)
```

```go
func heapSort(arr []int) {
    n := len(arr)
    var siftDown func(i, end int)
    siftDown = func(i, end int) {
        for {
            s, l, r := i, 2*i+1, 2*i+2
            if l < end && arr[l] > arr[s] { s = l }
            if r < end && arr[r] > arr[s] { s = r }
            if s == i { break }
            arr[i], arr[s] = arr[s], arr[i]
            i = s
        }
    }
    for i := n/2 - 1; i >= 0; i-- { siftDown(i, n) }
    for i := n - 1; i > 0; i-- {
        arr[0], arr[i] = arr[i], arr[0]
        siftDown(0, i)
    }
}
```

## Interview Patterns Quick Reference

| Pattern | Approach | Time |
|---|---|---|
| Top K largest | Min-heap size k | O(n log k) |
| Top K smallest | Max-heap size k | O(n log k) |
| Kth element | Min-heap size k | O(n log k) |
| Running median | Two heaps | O(n log n) |
| K-way merge | Min-heap with k heads | O(N log k) |
| Task scheduling | Max-heap + cooldown queue | O(n log n) |
| Sliding window max | Monotonic deque (not heap!) | O(n) |
