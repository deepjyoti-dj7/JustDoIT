---
title: Last Stone Weight
difficulty: Easy
tags: [Array, Heap, Simulation, Greedy]
link: https://leetcode.com/problems/last-stone-weight/
---

# Last Stone Weight

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [1046. Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) |
| **Tags** | Array, Heap, Simulation |

## Problem Statement

You have a collection of stones, each with a positive integer weight. Each turn, smash the two heaviest stones together:

- If both have equal weight, both are destroyed
- Otherwise, the heavier stone loses the lighter stone's weight (`heavy - light` remains)

Return the weight of the last remaining stone, or 0 if none remain.

## Intuition

Each round we need the **two heaviest** stones. This is a classic max-element-repeated-extraction pattern — exactly what a **max-heap** is built for.

Without a heap: scanning for the two max values each round is O(n) per round, giving O(n²) total.

With a max-heap: each round costs O(log n), and there are at most n rounds, giving O(n log n) total.

## Approach 1: Sort Each Round — O(n² log n)

Sort the array after every smash and pop from the end. Simple but inefficient.

```cpp
int lastStoneWeight(vector<int>& stones) {
    while (stones.size() > 1) {
        sort(stones.begin(), stones.end());
        int n = stones.size();
        int diff = stones[n-1] - stones[n-2];
        stones.pop_back();
        stones.pop_back();
        if (diff > 0) stones.push_back(diff);
    }
    return stones.empty() ? 0 : stones[0];
}
```

```java
int lastStoneWeight(int[] stones) {
    List<Integer> list = new ArrayList<>();
    for (int s : stones) list.add(s);
    while (list.size() > 1) {
        Collections.sort(list);
        int n = list.size();
        int diff = list.get(n-1) - list.get(n-2);
        list.remove(n-1); list.remove(n-2);
        if (diff > 0) list.add(diff);
    }
    return list.isEmpty() ? 0 : list.get(0);
}
```

```typescript
function lastStoneWeight(stones: number[]): number {
    while (stones.length > 1) {
        stones.sort((a, b) => a - b);
        const n = stones.length;
        const diff = stones[n-1] - stones[n-2];
        stones.splice(n-2, 2);
        if (diff > 0) stones.push(diff);
    }
    return stones.length === 0 ? 0 : stones[0];
}
```

```python
def last_stone_weight(stones: list[int]) -> int:
    while len(stones) > 1:
        stones.sort()
        diff = stones[-1] - stones[-2]
        stones.pop(); stones.pop()
        if diff > 0:
            stones.append(diff)
    return stones[0] if stones else 0
```

```go
func lastStoneWeight(stones []int) int {
    for len(stones) > 1 {
        sort.Ints(stones)
        n := len(stones)
        diff := stones[n-1] - stones[n-2]
        stones = stones[:n-2]
        if diff > 0 { stones = append(stones, diff) }
    }
    if len(stones) == 0 { return 0 }
    return stones[0]
}
```

**Time:** O(n² log n) — **Space:** O(1)

## Approach 2: Max-Heap — O(n log n)

Heap maintains the ordering automatically. Each smash costs O(log n) for two pops and one push.

```cpp
int lastStoneWeight(vector<int>& stones) {
    priority_queue<int> pq(stones.begin(), stones.end()); // max-heap

    while (pq.size() > 1) {
        int a = pq.top(); pq.pop();
        int b = pq.top(); pq.pop();
        if (a != b) pq.push(a - b); // a >= b guaranteed
    }

    return pq.empty() ? 0 : pq.top();
}
```

```java
class Solution {
    public int lastStoneWeight(int[] stones) {
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int s : stones) maxHeap.offer(s);

        while (maxHeap.size() > 1) {
            int a = maxHeap.poll(); // heaviest
            int b = maxHeap.poll(); // second heaviest
            if (a != b) maxHeap.offer(a - b);
        }

        return maxHeap.isEmpty() ? 0 : maxHeap.peek();
    }
}
```

```typescript
function lastStoneWeight(stones: number[]): number {
    // Max-heap via negation or custom comparator
    const heap = new Heap<number>((a, b) => b - a); // max-heap
    for (const s of stones) heap.push(s);

    while (heap.size() > 1) {
        const a = heap.pop()!;
        const b = heap.pop()!;
        if (a !== b) heap.push(a - b);
    }

    return heap.isEmpty() ? 0 : heap.peek()!;
}
```

```python
import heapq

class Solution:
    def lastStoneWeight(self, stones: list[int]) -> int:
        # Python heapq is min-heap — negate for max-heap
        heap = [-s for s in stones]
        heapq.heapify(heap)

        while len(heap) > 1:
            a = -heapq.heappop(heap)  # heaviest
            b = -heapq.heappop(heap)  # second heaviest
            if a != b:
                heapq.heappush(heap, -(a - b))

        return -heap[0] if heap else 0
```

```go
type MaxHeap []int
func (h MaxHeap) Len() int            { return len(h) }
func (h MaxHeap) Less(i, j int) bool  { return h[i] > h[j] } // max-heap
func (h MaxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MaxHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MaxHeap) Pop() interface{}   { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

func lastStoneWeight(stones []int) int {
    h := MaxHeap(append([]int{}, stones...))
    heap.Init(&h)

    for h.Len() > 1 {
        a := heap.Pop(&h).(int)
        b := heap.Pop(&h).(int)
        if a != b { heap.Push(&h, a-b) }
    }

    if h.Len() == 0 { return 0 }
    return h[0]
}
```

**Time:** O(n log n) — **Space:** O(n)

## Dry Run

`stones = [2, 7, 4, 1, 8, 1]`

Heap after init (max-heap): `[8, 7, 4, 2, 1, 1]`

| Round | Pop a | Pop b | Diff | Push | Heap |
|---|---|---|---|---|---|
| 1 | 8 | 7 | 1 | 1 | [4, 2, 1, 1, 1] |
| 2 | 4 | 2 | 2 | 2 | [2, 1, 1, 1] |
| 3 | 2 | 2 | 0 | — | [1, 1] |
| 4 | 1 | 1 | 0 | — | [] |

Result: **0** ✓

## Key Interview Insights

- **Max-heap is the natural tool** whenever you repeatedly need the maximum from a changing collection.
- **Python negation trick:** Since Python's `heapq` is min-heap only, negate all values. `heappush(-val)` and `val = -heappop()`.
- **a != b check:** The problem says "if equal, both destroyed." Only push back if the difference is positive. `if a != b` and `if a - b > 0` are equivalent since `a >= b`.
- **Edge case: single stone** — the while loop runs 0 times, heap has 1 element, return it.
- **Edge case: all equal weights** — every round destroys both stones, possibly leaving 0.
- This problem is a warmup for harder heap problems. The pattern extends to: always extract the two extremes, transform, reinsert.
