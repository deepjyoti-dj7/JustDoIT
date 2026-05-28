---
title: Heap Sort
description: In-place O(n log n) sorting using the heap data structure — guaranteed performance without auxiliary memory
---

# Heap Sort

Heap Sort combines the **best-case guarantee of merge sort** (O(n log n) always) with the **space efficiency of quick sort** (in-place, O(1) extra). It's not the fastest in practice (poor cache behavior), but it's theoretically elegant and the `heapify` operation underpins a huge class of interview problems.

Understanding heap sort deeply means understanding **heaps**, which are fundamental to: priority queues, Dijkstra's algorithm, top-K problems, median maintenance, and much more.

## Heap Fundamentals (Quick Recap)

A **max-heap** is a complete binary tree where every parent is ≥ its children. Stored efficiently in an array:

```
Index i → left child: 2i+1, right child: 2i+2, parent: (i-1)/2

Array: [10, 7, 8, 5, 3, 6, 4]

         10
        /  \
       7    8
      / \  / \
     5   3 6   4
```

The root `arr[0]` is always the maximum in a max-heap.

## Core Insight: Two-Phase Algorithm

**Phase 1 — Build Max-Heap:** Transform the array into a valid max-heap in O(n).

**Phase 2 — Extract Max Repeatedly:** Swap the root (max) with the last element, shrink the heap boundary by 1, and heapify down. Repeat n-1 times. Each extraction is O(log n).

```
Initial: [4, 10, 3, 5, 1]

After build-heap: [10, 5, 3, 4, 1]   ← valid max-heap

Iteration 1: swap root with last → [1, 5, 3, 4, | 10]  heapify → [5, 4, 3, 1, | 10]
Iteration 2: swap root with last → [1, 4, 3, | 5, 10]  heapify → [4, 1, 3, | 5, 10]
Iteration 3: swap root with last → [3, 1, | 4, 5, 10]  heapify → [3, 1, | 4, 5, 10]
Iteration 4: swap root with last → [1, | 3, 4, 5, 10]  heapify → [1, | 3, 4, 5, 10]

Result: [1, 3, 4, 5, 10]  ✓
```

## The Heapify-Down Operation

`siftDown` (or `heapifyDown`) is the key primitive: given that both children of node `i` are valid max-heaps, restore the heap property at `i` by "sinking" it down.

```cpp
#include <vector>
using namespace std;

// Restore max-heap property at index i, given heap size n
void siftDown(vector<int>& arr, int i, int n) {
    while (true) {
        int largest = i;
        int left  = 2 * i + 1;
        int right = 2 * i + 2;

        if (left  < n && arr[left]  > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;

        if (largest == i) break;  // heap property satisfied

        swap(arr[i], arr[largest]);
        i = largest;  // continue sifting down
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();

    // Phase 1: Build max-heap in O(n)
    // Start from last non-leaf node: (n/2 - 1)
    for (int i = n / 2 - 1; i >= 0; i--)
        siftDown(arr, i, n);

    // Phase 2: Extract max elements one by one
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);   // move current max to end
        siftDown(arr, 0, i);    // restore heap for remaining i elements
    }
}
```

```java
void siftDown(int[] arr, int i, int n) {
    while (true) {
        int largest = i;
        int left = 2 * i + 1, right = 2 * i + 2;

        if (left  < n && arr[left]  > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;

        if (largest == i) break;

        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;
        i = largest;
    }
}

void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--)
        siftDown(arr, i, n);

    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
        siftDown(arr, 0, i);
    }
}
```

```typescript
function siftDown(arr: number[], i: number, n: number): void {
    while (true) {
        let largest = i;
        const left = 2 * i + 1, right = 2 * i + 2;

        if (left  < n && arr[left]  > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;

        if (largest === i) break;

        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        i = largest;
    }
}

function heapSort(arr: number[]): void {
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
        siftDown(arr, i, n);

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        siftDown(arr, 0, i);
    }
}
```

```python
def sift_down(arr: list[int], i: int, n: int) -> None:
    while True:
        largest = i
        left, right = 2 * i + 1, 2 * i + 2

        if left  < n and arr[left]  > arr[largest]: largest = left
        if right < n and arr[right] > arr[largest]: largest = right

        if largest == i:
            break

        arr[i], arr[largest] = arr[largest], arr[i]
        i = largest

def heap_sort(arr: list[int]) -> None:
    n = len(arr)

    # Build max-heap: start from last non-leaf and sift down
    for i in range(n // 2 - 1, -1, -1):
        sift_down(arr, i, n)

    # Extract max elements one by one
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        sift_down(arr, 0, i)
```

```go
func siftDown(arr []int, i, n int) {
    for {
        largest := i
        left, right := 2*i+1, 2*i+2

        if left  < n && arr[left]  > arr[largest] { largest = left }
        if right < n && arr[right] > arr[largest] { largest = right }

        if largest == i { break }

        arr[i], arr[largest] = arr[largest], arr[i]
        i = largest
    }
}

func heapSort(arr []int) {
    n := len(arr)
    for i := n/2 - 1; i >= 0; i-- {
        siftDown(arr, i, n)
    }
    for i := n - 1; i > 0; i-- {
        arr[0], arr[i] = arr[i], arr[0]
        siftDown(arr, 0, i)
    }
}
```

## Why Build-Heap is O(n), Not O(n log n)

This is a classic interview question. Intuitively, building the heap by calling `siftDown` from the bottom up is more efficient than inserting elements one by one.

Formally: nodes at height `h` do at most `h` swaps. The number of nodes at height `h` is at most ⌈n/2^(h+1)⌉. Summing over all heights:

$$\sum_{h=0}^{\log n} \frac{n}{2^{h+1}} \cdot h = O(n)$$

This geometric series converges. Most nodes are near the bottom (height 0, 1, 2) and do very little work. Only the root (height log n) does log n work.

## Complexity

| Phase | Time | Space |
|---|---|---|
| Build-Heap | O(n) | O(1) |
| n extractions × siftDown | O(n log n) | O(1) |
| **Total** | **O(n log n)** | **O(1)** |

Heap sort is the only comparison sort that is simultaneously **O(n log n) worst case** and **O(1) space**.

## Key Interview Patterns Using Heaps

### Top-K Elements Pattern

Don't sort everything — maintain a heap of size K.

```cpp
vector<int> topKLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> heap;  // min-heap
    for (int num : nums) {
        heap.push(num);
        if ((int)heap.size() > k) heap.pop();
    }
    vector<int> result;
    while (!heap.empty()) { result.push_back(heap.top()); heap.pop(); }
    return result;
}
```

```java
List<Integer> topKLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();  // min-heap
    for (int num : nums) {
        heap.offer(num);
        if (heap.size() > k) heap.poll();
    }
    return new ArrayList<>(heap);
}
```

```typescript
function topKLargest(nums: number[], k: number): number[] {
    // Simulate bounded min-heap with sorted array
    const heap: number[] = [];
    for (const num of nums) {
        heap.push(num);
        heap.sort((a, b) => a - b);
        if (heap.length > k) heap.shift();
    }
    return heap;
}
```

```python
import heapq

def top_k_largest(nums: list[int], k: int) -> list[int]:
    # Min-heap of size k: root is the kth largest seen so far
    heap = nums[:k]
    heapq.heapify(heap)  # O(k)

    for num in nums[k:]:  # O((n-k) log k)
        if num > heap[0]:
            heapq.heapreplace(heap, num)

    return heap  # all k largest elements (unsorted)
```

```go
func topKLargest(nums []int, k int) []int {
    h := &MinIntHeap{}
    heap.Init(h)
    for _, num := range nums {
        heap.Push(h, num)
        if h.Len() > k { heap.Pop(h) }
    }
    return []int(*h)
}
// MinIntHeap implements heap.Interface for a min-heap of ints
```

### Kth Largest in a Stream

```cpp
class KthLargest {
    priority_queue<int, vector<int>, greater<int>> heap;
    int k;
public:
    KthLargest(int k, vector<int>& nums) : k(k) {
        for (int n : nums) heap.push(n);
        while ((int)heap.size() > k) heap.pop();
    }
    int add(int val) {
        heap.push(val);
        if ((int)heap.size() > k) heap.pop();
        return heap.top();
    }
};
```

```java
class KthLargest {
    private PriorityQueue<Integer> heap = new PriorityQueue<>();
    private int k;
    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int n : nums) heap.offer(n);
        while (heap.size() > k) heap.poll();
    }
    public int add(int val) {
        heap.offer(val);
        if (heap.size() > k) heap.poll();
        return heap.peek();
    }
}
```

```typescript
class KthLargest {
    private heap: number[] = [];
    private k: number;
    constructor(k: number, nums: number[]) {
        this.k = k;
        for (const n of nums) this.add(n);
    }
    add(val: number): number {
        this.heap.push(val);
        this.heap.sort((a, b) => a - b);
        if (this.heap.length > this.k) this.heap.shift();
        return this.heap[0];
    }
}
```

```python
import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = nums
        heapq.heapify(self.heap)
        while len(self.heap) > k:
            heapq.heappop(self.heap)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]
```

```go
type KthLargest struct {
    k    int
    heap MinIntHeap
}
func NewKthLargest(k int, nums []int) *KthLargest {
    kl := &KthLargest{k: k}
    heap.Init(&kl.heap)
    for _, n := range nums {
        heap.Push(&kl.heap, n)
        if kl.heap.Len() > k { heap.Pop(&kl.heap) }
    }
    return kl
}
func (kl *KthLargest) Add(val int) int {
    heap.Push(&kl.heap, val)
    if kl.heap.Len() > kl.k { heap.Pop(&kl.heap) }
    return kl.heap[0]
}
```

## Heap Sort vs Other O(n log n) Sorts

| Property | Heap Sort | Merge Sort | Quick Sort |
|---|---|---|---|
| Worst Case | O(n log n) | O(n log n) | O(n²) |
| Average Case | O(n log n) | O(n log n) | O(n log n) |
| Space | O(1) | O(n) | O(log n) |
| Stable | No | Yes | No |
| Cache Friendly | No | Moderate | Yes |
| Used in `std::sort` | Partial (introsort) | No | Yes (introsort) |

**When to choose heap sort:** Space is critically constrained AND you can't risk O(n²) worst case (quick sort with bad pivots). The cache unfriendliness means it's slower than quick sort by a constant factor in practice.

## Common Pitfalls

- **siftDown vs siftUp confusion:** Building the heap uses `siftDown` (not `siftUp`). Using `siftUp` for build-heap would be O(n log n), missing the O(n) optimization.
- **Last non-leaf formula:** `n/2 - 1` (0-indexed). Starting from any higher index is wasteful; starting from lower is wrong.
- **Off-by-one in heap size during phase 2:** The heap boundary shrinks each iteration (`siftDown(arr, 0, i)` where `i` decrements). The `n` parameter must reflect current heap size.
- **Max-heap gives ascending order:** Extracting max each time and placing at the end builds the array from right to left in ascending order.
