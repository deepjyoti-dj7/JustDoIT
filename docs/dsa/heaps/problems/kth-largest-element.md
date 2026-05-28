---
title: Kth Largest Element in Array
difficulty: Medium
tags: [Array, Heap, Divide and Conquer, Quickselect, Sorting]
link: https://leetcode.com/problems/kth-largest-element-in-an-array/
---

# Kth Largest Element in Array

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) |
| **Tags** | Array, Heap, Divide and Conquer, Quickselect |

## Problem Statement

Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note: kth largest is in sorted order, not kth distinct.

Example: `nums = [3, 2, 1, 5, 6, 4]`, `k = 2` → `5`

## Intuition

Three distinct strategies exist here, each with different tradeoffs. This problem is a canonical example for the **sort vs heap vs quickselect** decision.

- **Sort:** Transform to a sorted array problem. O(n log n). Simple baseline.
- **Min-heap of size k:** Keep only the k largest seen. O(n log k). Great when k << n or streaming.
- **Quickselect:** Partition around a pivot. Only recurse into one half. O(n) average. Optimal for one-shot, in-place.

The kth largest in sorted descending order is the same as the `(n - k)`th element in sorted ascending order. Quickselect finds this without fully sorting.

## Approach 1: Sort — O(n log n)

```cpp
int findKthLargest(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end(), greater<int>());
    return nums[k - 1];
}
```

```java
int findKthLargest(int[] nums, int k) {
    Arrays.sort(nums);
    return nums[nums.length - k];
}
```

```typescript
function findKthLargest(nums: number[], k: number): number {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
}
```

```python
def find_kth_largest(nums: list[int], k: int) -> int:
    nums.sort(reverse=True)
    return nums[k - 1]
```

```go
func findKthLargest(nums []int, k int) int {
    sort.Sort(sort.Reverse(sort.IntSlice(nums)))
    return nums[k-1]
}
```

**Time:** O(n log n) — **Space:** O(1)

## Approach 2: Min-Heap of Size k — O(n log k)

Maintain a min-heap of exactly k elements. When the heap grows beyond k, evict the minimum. After processing all n elements, the heap root is the kth largest.

**Why min-heap?** We want to evict the *smallest among the k-largest-so-far*. The min-heap root is exactly that element.

```cpp
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap; // min-heap

    for (int n : nums) {
        minHeap.push(n);
        if (minHeap.size() > k) minHeap.pop(); // evict smallest
    }

    return minHeap.top(); // root = kth largest
}
```

```java
class Solution {
    public int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);

        for (int n : nums) {
            minHeap.offer(n);
            if (minHeap.size() > k) minHeap.poll();
        }

        return minHeap.peek();
    }
}
```

```typescript
function findKthLargest(nums: number[], k: number): number {
    const heap = new Heap<number>((a, b) => a - b); // min-heap

    for (const n of nums) {
        heap.push(n);
        if (heap.size() > k) heap.pop();
    }

    return heap.peek()!;
}
```

```python
import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        heap: list[int] = []
        for n in nums:
            heapq.heappush(heap, n)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]  # min of top-k = kth largest
```

```go
func findKthLargest(nums []int, k int) int {
    h := &MinHeap{}
    heap.Init(h)
    for _, n := range nums {
        heap.Push(h, n)
        if h.Len() > k { heap.Pop(h) }
    }
    return (*h)[0]
}
```

**Time:** O(n log k) — **Space:** O(k)

## Approach 3: Quickselect — O(n) Average

Quickselect partitions the array around a pivot. After partitioning:
- All elements left of pivot are ≤ pivot
- All elements right of pivot are ≥ pivot
- Pivot is at its "correct" sorted position

We want the element at index `n - k` (0-based in ascending sorted order). After each partition, we only need to recurse into one half — average O(n).

```cpp
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        int target = nums.size() - k; // index of kth largest in ascending order
        int lo = 0, hi = nums.size() - 1;

        while (lo < hi) {
            int pivotIdx = partition(nums, lo, hi);
            if (pivotIdx == target) break;
            else if (pivotIdx < target) lo = pivotIdx + 1;
            else hi = pivotIdx - 1;
        }

        return nums[target];
    }

private:
    int partition(vector<int>& nums, int lo, int hi) {
        // Random pivot to avoid O(n²) worst case
        int randIdx = lo + rand() % (hi - lo + 1);
        swap(nums[randIdx], nums[hi]);

        int pivot = nums[hi], p = lo;
        for (int i = lo; i < hi; i++) {
            if (nums[i] <= pivot) swap(nums[i], nums[p++]);
        }
        swap(nums[p], nums[hi]);
        return p;
    }
};
```

```java
class Solution {
    private Random rand = new Random();

    public int findKthLargest(int[] nums, int k) {
        int target = nums.length - k;
        int lo = 0, hi = nums.length - 1;
        while (lo < hi) {
            int p = partition(nums, lo, hi);
            if (p == target) break;
            else if (p < target) lo = p + 1;
            else hi = p - 1;
        }
        return nums[target];
    }

    private int partition(int[] nums, int lo, int hi) {
        int pivotIdx = lo + rand.nextInt(hi - lo + 1);
        int tmp = nums[pivotIdx]; nums[pivotIdx] = nums[hi]; nums[hi] = tmp;
        int pivot = nums[hi], p = lo;
        for (int i = lo; i < hi; i++) {
            if (nums[i] <= pivot) {
                tmp = nums[i]; nums[i] = nums[p]; nums[p++] = tmp;
            }
        }
        tmp = nums[p]; nums[p] = nums[hi]; nums[hi] = tmp;
        return p;
    }
}
```

```typescript
function findKthLargest(nums: number[], k: number): number {
    const target = nums.length - k;

    const partition = (lo: number, hi: number): number => {
        const pivotIdx = lo + Math.floor(Math.random() * (hi - lo + 1));
        [nums[pivotIdx], nums[hi]] = [nums[hi], nums[pivotIdx]];
        const pivot = nums[hi];
        let p = lo;
        for (let i = lo; i < hi; i++) {
            if (nums[i] <= pivot) [nums[i], nums[p++]] = [nums[p], nums[i]];
        }
        [nums[p], nums[hi]] = [nums[hi], nums[p]];
        return p;
    };

    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const p = partition(lo, hi);
        if (p === target) break;
        else if (p < target) lo = p + 1;
        else hi = p - 1;
    }
    return nums[target];
}
```

```python
import random

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        target = len(nums) - k

        def partition(lo: int, hi: int) -> int:
            pivot_idx = random.randint(lo, hi)
            nums[pivot_idx], nums[hi] = nums[hi], nums[pivot_idx]
            pivot, p = nums[hi], lo
            for i in range(lo, hi):
                if nums[i] <= pivot:
                    nums[i], nums[p] = nums[p], nums[i]
                    p += 1
            nums[p], nums[hi] = nums[hi], nums[p]
            return p

        lo, hi = 0, len(nums) - 1
        while lo < hi:
            p = partition(lo, hi)
            if p == target: break
            elif p < target: lo = p + 1
            else: hi = p - 1

        return nums[target]
```

```go
func findKthLargest(nums []int, k int) int {
    target := len(nums) - k
    lo, hi := 0, len(nums)-1

    partition := func(lo, hi int) int {
        pivotIdx := lo + rand.Intn(hi-lo+1)
        nums[pivotIdx], nums[hi] = nums[hi], nums[pivotIdx]
        pivot, p := nums[hi], lo
        for i := lo; i < hi; i++ {
            if nums[i] <= pivot {
                nums[i], nums[p] = nums[p], nums[i]
                p++
            }
        }
        nums[p], nums[hi] = nums[hi], nums[p]
        return p
    }

    for lo < hi {
        p := partition(lo, hi)
        if p == target { break }
        if p < target { lo = p + 1 } else { hi = p - 1 }
    }
    return nums[target]
}
```

**Time:** O(n) average, O(n²) worst — **Space:** O(1)

## Dry Run (Quickselect)

`nums = [3, 2, 1, 5, 6, 4]`, k = 2, target index = 4

**Round 1:** Pivot = 4 (idx 5). Partition around 4:
- Elements ≤ 4: 3, 2, 1, 4 → positions 0-3
- pivot lands at index 3

`[3, 2, 1, 4, 6, 5]` — pivot at idx 3. target=4 > 3 → search right, lo=4

**Round 2:** `[6, 5]`, lo=4, hi=5. Pivot = 5 (idx 5). Partition:
- Elements ≤ 5: 5 at p=0 relative... pivot lands at idx 4

`[3, 2, 1, 4, 5, 6]` — pivot at idx 4 = target. Done.

Return `nums[4]` = **5** ✓

## Comparison

| Approach | Time | Space | Mutates Input | Streaming |
|---|---|---|---|---|
| Sort | O(n log n) | O(1) | Yes | No |
| Min-Heap | O(n log k) | O(k) | No | **Yes** |
| Quickselect | O(n) avg | O(1) | Yes | No |

## Key Interview Insights

- **Always start with the sort solution** as baseline, then optimize.
- **Min-heap wins for streaming data** — you can't sort data you haven't seen yet.
- **Quickselect trade-off:** O(n) average but O(n²) worst case on sorted inputs without random pivot. Always randomize the pivot.
- **`nth_element` in C++** is exactly quickselect with O(n) guarantee (introsort variant). Mentioning this shows systems knowledge.
- **k=1** → just find the maximum. Any approach reduces to O(n).
- **Constraint hint:** If the problem says "you may assume k is always valid," you don't need to handle out-of-bounds.
