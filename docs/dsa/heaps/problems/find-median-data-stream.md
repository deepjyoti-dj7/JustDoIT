---
title: Find Median from Data Stream
difficulty: Hard
tags: [Heap, Design, Two Pointers, Data Stream, Sorting]
link: https://leetcode.com/problems/find-median-from-data-stream/
---

# Find Median from Data Stream

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/) |
| **Tags** | Heap, Design, Data Stream |

## Problem Statement

Design a data structure that supports:
- `addNum(int num)` — Add a number to the data structure
- `findMedian()` — Return the median of all elements seen so far

The median is the middle value in a sorted list. If even count, the average of the two middle values.

Example:
```
addNum(1) → data: [1]             → findMedian() = 1.0
addNum(2) → data: [1, 2]          → findMedian() = 1.5
addNum(3) → data: [1, 2, 3]       → findMedian() = 2.0
```

## Intuition

**Brute force:** Maintain a sorted array. Insert in O(n) (shift elements), find median in O(1). Or use an unsorted array: insert O(1), find median by sorting O(n log n). Neither is ideal.

**The Two-Heap Insight:**

Split the numbers into two halves:
- **Lower half** → max-heap (quickly get the max of the smaller values)
- **Upper half** → min-heap (quickly get the min of the larger values)

```
Numbers seen so far: [1, 2, 3, 4, 5]

Lower half (max-heap): [2, 1]    → top = 2
Upper half (min-heap): [3, 4, 5] → top = 3

Median = (2 + 3) / 2 = 2.5  (even count)
     or = 3                 (odd count, upper half has one more)
```

**Invariant to maintain after every insertion:**
1. `|lower_size - upper_size| ≤ 1` — sizes differ by at most 1
2. `max(lower) ≤ min(upper)` — all lower elements ≤ all upper elements

**Finding median:**
- If sizes equal: average of both tops
- If lower has one more: top of lower
- If upper has one more: top of upper

**Adding a number (4-step process):**
1. Push to lower (max-heap)
2. If `lower.top > upper.top` (ordering violated): move lower.top to upper
3. If `lower.size > upper.size + 1`: move lower.top to upper (balance)
4. If `upper.size > lower.size`: move upper.top to lower (balance)

A simpler equivalent: always push to lower, then if lower.top > upper.top, move it to upper, then rebalance sizes.

## Implementation

```cpp
class MedianFinder {
    priority_queue<int> lower;                          // max-heap
    priority_queue<int, vector<int>, greater<int>> upper; // min-heap

public:
    void addNum(int num) {
        // Step 1: push to lower half
        lower.push(num);

        // Step 2: fix ordering — lower's max must not exceed upper's min
        if (!upper.empty() && lower.top() > upper.top()) {
            upper.push(lower.top());
            lower.pop();
        }

        // Step 3: rebalance sizes (lower can have at most 1 more than upper)
        if (lower.size() > upper.size() + 1) {
            upper.push(lower.top());
            lower.pop();
        } else if (upper.size() > lower.size()) {
            lower.push(upper.top());
            upper.pop();
        }
    }

    double findMedian() {
        if (lower.size() == upper.size())
            return (lower.top() + upper.top()) / 2.0;
        return lower.top(); // lower has one more
    }
};
```

```java
class MedianFinder {
    private PriorityQueue<Integer> lower; // max-heap
    private PriorityQueue<Integer> upper; // min-heap

    public MedianFinder() {
        lower = new PriorityQueue<>(Collections.reverseOrder());
        upper = new PriorityQueue<>();
    }

    public void addNum(int num) {
        lower.offer(num);

        // Fix ordering
        if (!upper.isEmpty() && lower.peek() > upper.peek()) {
            upper.offer(lower.poll());
        }

        // Rebalance sizes
        if (lower.size() > upper.size() + 1) {
            upper.offer(lower.poll());
        } else if (upper.size() > lower.size()) {
            lower.offer(upper.poll());
        }
    }

    public double findMedian() {
        if (lower.size() == upper.size())
            return (lower.peek() + upper.peek()) / 2.0;
        return lower.peek(); // lower has one more element
    }
}
```

```typescript
class MedianFinder {
    private lower: Heap<number>; // max-heap
    private upper: Heap<number>; // min-heap

    constructor() {
        this.lower = new Heap<number>((a, b) => b - a); // max-heap
        this.upper = new Heap<number>((a, b) => a - b); // min-heap
    }

    addNum(num: number): void {
        this.lower.push(num);

        // Fix ordering
        if (!this.upper.isEmpty() && this.lower.peek()! > this.upper.peek()!) {
            this.upper.push(this.lower.pop()!);
        }

        // Rebalance
        if (this.lower.size() > this.upper.size() + 1) {
            this.upper.push(this.lower.pop()!);
        } else if (this.upper.size() > this.lower.size()) {
            this.lower.push(this.upper.pop()!);
        }
    }

    findMedian(): number {
        if (this.lower.size() === this.upper.size())
            return (this.lower.peek()! + this.upper.peek()!) / 2;
        return this.lower.peek()!;
    }
}
```

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.lower: list[int] = []   # max-heap (negated)
        self.upper: list[int] = []   # min-heap

    def addNum(self, num: int) -> None:
        # Push to lower (negate for max-heap simulation)
        heapq.heappush(self.lower, -num)

        # Fix ordering: lower's max must not exceed upper's min
        if self.upper and -self.lower[0] > self.upper[0]:
            heapq.heappush(self.upper, -heapq.heappop(self.lower))

        # Rebalance sizes
        if len(self.lower) > len(self.upper) + 1:
            heapq.heappush(self.upper, -heapq.heappop(self.lower))
        elif len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self) -> float:
        if len(self.lower) == len(self.upper):
            return (-self.lower[0] + self.upper[0]) / 2.0
        return float(-self.lower[0])
```

```go
type MaxHeap []int
func (h MaxHeap) Len() int            { return len(h) }
func (h MaxHeap) Less(i, j int) bool  { return h[i] > h[j] }
func (h MaxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MaxHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MaxHeap) Pop() interface{}   { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

type MinHeapG []int
func (h MinHeapG) Len() int            { return len(h) }
func (h MinHeapG) Less(i, j int) bool  { return h[i] < h[j] }
func (h MinHeapG) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeapG) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MinHeapG) Pop() interface{}   { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

type MedianFinder struct {
    lower *MaxHeap
    upper *MinHeapG
}

func Constructor() MedianFinder {
    lo, up := &MaxHeap{}, &MinHeapG{}
    heap.Init(lo); heap.Init(up)
    return MedianFinder{lo, up}
}

func (m *MedianFinder) AddNum(num int) {
    heap.Push(m.lower, num)

    if m.upper.Len() > 0 && (*m.lower)[0] > (*m.upper)[0] {
        heap.Push(m.upper, heap.Pop(m.lower))
    }

    if m.lower.Len() > m.upper.Len()+1 {
        heap.Push(m.upper, heap.Pop(m.lower))
    } else if m.upper.Len() > m.lower.Len() {
        heap.Push(m.lower, heap.Pop(m.upper))
    }
}

func (m *MedianFinder) FindMedian() float64 {
    if m.lower.Len() == m.upper.Len() {
        return float64((*m.lower)[0]+(*m.upper)[0]) / 2.0
    }
    return float64((*m.lower)[0])
}
```

**Time:** O(log n) per `addNum`, O(1) per `findMedian`
**Space:** O(n)

## Dry Run

Adding numbers `[1, 2, 3, 4, 5]` step by step:

| addNum | lower (max-heap) | upper (min-heap) | Action | findMedian |
|---|---|---|---|---|
| 1 | [**1**] | [] | Push 1 to lower | **1.0** |
| 2 | [**1**] | [**2**] | Push 2 to lower (top=2 > upper.top → move to upper). Balance: upper.size > lower → move 2 to lower... Wait, upper=2 > lower=1 → move upper.top(2) back → lower=[2,1], upper=[]. Then lower.size(2) > upper.size(0)+1 → move lower.top(2) to upper → lower=[1], upper=[2] | **(1+2)/2 = 1.5** |
| 3 | [**2**, 1] | [**3**] | Push 3 to lower (top=3 > upper.top? No, lower is [3,1,2], top=3 > upper.top=∞? upper empty so push 3). Rebalance: lower.size=2 = upper.size=1+1 ✓ | **2.0** (lower has one more) |
| 4 | [**2**, 1] | [**3**, 4] | After balancing lower=[2,1], upper=[3,4] | **(2+3)/2 = 2.5** |
| 5 | [**3**, 2, 1] | [**4**, 5] | After balancing lower=[3,2,1], upper=[4,5] | **3.0** |

## Invariant Visualization

```
         lower (max-heap)    upper (min-heap)
         ← smaller half →   ← larger half →
         [... 2  3]         [4  5 ...]
              ↑                  ↑
              max                min
              └──── median ──────┘
              (if even: avg of both tops)
              (if odd: top of larger heap)
```

## Key Interview Insights

- **Two heaps is the canonical solution.** Interviewers expect this. Make sure you can code it without looking up anything.
- **Invariant is everything.** The two invariants — size balance and ordering — are what the `addNum` logic enforces. State them explicitly before coding.
- **Python negation.** `heapq` is min-heap only. For the lower (max-heap), push `-num` and negate on extraction. The comparison `-lower[0] > upper[0]` becomes `lower[0] > upper[0]` after negating.
- **The ordering step comes before the size-balance step.** If you rebalance sizes first, you might violate ordering. Order matters.
- **Follow-up: What if you have many duplicates?** The two-heap approach still works correctly — duplicates can exist in either heap.
- **Follow-up: What if you need to track the median of a sliding window?** This requires a harder approach — lazy deletion with two heaps or an order statistics tree (segment tree / balanced BST).
- **Alternative: Sorted list with binary search insert.** O(n) per insert, O(1) median — worse than heaps for large streams.
- **Real-world use:** Streaming median is used in network latency monitoring, financial data analysis, and distributed systems percentile tracking.
