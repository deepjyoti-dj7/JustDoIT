---
title: Kth Largest Element in an Array
difficulty: Medium
tags: [Divide and Conquer, QuickSelect, Heap, Sorting]
link: https://leetcode.com/problems/kth-largest-element-in-an-array/
---

# Kth Largest Element in an Array

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/) |
| **Tags** | Divide and Conquer, QuickSelect, Heap, Sorting |

## Problem Statement

Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest in sorted order, not the `k`th distinct element.

**Example:**
```
nums = [3,2,1,5,6,4], k = 2  →  5
nums = [3,2,3,1,2,4,5,5,6], k = 4  →  4
```

---

## Intuition

We want the k-th largest, which is the `(n - k)`th smallest (0-indexed). We don't need to sort the whole array — we just need to find *which* element sits at position `n-k` in sorted order.

**QuickSelect** is the ideal tool: it's quick sort's partition step, but we only recurse into the half that *contains* the target index. Expected O(n) time, compared to O(n log n) for a full sort.

---

## Approach 1: Full Sort

Sort descending and return `nums[k-1]`.

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

**Time:** O(n log n) — **Space:** O(1) or O(log n) stack

---

## Approach 2: Min-Heap of Size k

Maintain a min-heap of the k largest elements seen so far. The heap top is always the k-th largest.

```cpp
int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap; // min-heap
    for (int n : nums) {
        minHeap.push(n);
        if ((int)minHeap.size() > k) minHeap.pop();
    }
    return minHeap.top();
}
```

```java
int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int n : nums) {
        minHeap.offer(n);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.peek();
}
```

```typescript
function findKthLargest(nums: number[], k: number): number {
    // Min-heap simulation with sorted array (use a proper heap in prod)
    const heap: number[] = [];
    for (const n of nums) {
        heap.push(n);
        heap.sort((a, b) => a - b);  // maintain heap property
        if (heap.length > k) heap.shift();
    }
    return heap[0];
}
```

```python
import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    min_heap: list[int] = []
    for n in nums:
        heapq.heappush(min_heap, n)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]
```

```go
import "container/heap"

type MinHeap []int
func (h MinHeap) Len() int            { return len(h) }
func (h MinHeap) Less(i, j int) bool  { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)         { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any           { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }

func findKthLargest(nums []int, k int) int {
    h := &MinHeap{}
    for _, n := range nums {
        heap.Push(h, n)
        if h.Len() > k { heap.Pop(h) }
    }
    return (*h)[0]
}
```

**Time:** O(n log k) — **Space:** O(k)

---

## Approach 3: QuickSelect (Optimal Average Case)

Partition around a random pivot. The pivot lands at its final sorted index `p`. If `p == target`, done. Otherwise recurse only into the relevant half.

Target index (for k-th largest): `n - k` (0-based position in ascending sorted array).

```cpp
int partition(vector<int>& nums, int lo, int hi) {
    int r = lo + rand() % (hi - lo + 1);
    swap(nums[r], nums[hi]);
    int pivot = nums[hi], wall = lo - 1;
    for (int j = lo; j < hi; j++)
        if (nums[j] <= pivot) swap(nums[++wall], nums[j]);
    swap(nums[wall + 1], nums[hi]);
    return wall + 1;
}

int quickSelect(vector<int>& nums, int lo, int hi, int target) {
    if (lo == hi) return nums[lo];
    int p = partition(nums, lo, hi);
    if      (p == target) return nums[p];
    else if (p < target)  return quickSelect(nums, p + 1, hi, target);
    else                  return quickSelect(nums, lo, p - 1, target);
}

int findKthLargest(vector<int>& nums, int k) {
    int target = (int)nums.size() - k;  // k-th largest = (n-k)-th smallest
    return quickSelect(nums, 0, (int)nums.size() - 1, target);
}
```

```java
int findKthLargest(int[] nums, int k) {
    return quickSelect(nums, 0, nums.length - 1, nums.length - k, new Random());
}

int quickSelect(int[] nums, int lo, int hi, int target, Random rnd) {
    if (lo == hi) return nums[lo];
    int p = partition(nums, lo, hi, rnd);
    if      (p == target) return nums[p];
    else if (p < target)  return quickSelect(nums, p + 1, hi, target, rnd);
    else                  return quickSelect(nums, lo, p - 1, target, rnd);
}

int partition(int[] nums, int lo, int hi, Random rnd) {
    int r = lo + rnd.nextInt(hi - lo + 1);
    int tmp = nums[r]; nums[r] = nums[hi]; nums[hi] = tmp;
    int pivot = nums[hi], wall = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (nums[j] <= pivot) {
            tmp = nums[++wall]; nums[wall] = nums[j]; nums[j] = tmp;
        }
    }
    tmp = nums[wall+1]; nums[wall+1] = nums[hi]; nums[hi] = tmp;
    return wall + 1;
}
```

```typescript
function findKthLargest(nums: number[], k: number): number {
    return quickSelect(nums, 0, nums.length - 1, nums.length - k);
}

function quickSelect(nums: number[], lo: number, hi: number, target: number): number {
    if (lo === hi) return nums[lo];
    const p = partition(nums, lo, hi);
    if      (p === target) return nums[p];
    else if (p < target)   return quickSelect(nums, p + 1, hi, target);
    else                   return quickSelect(nums, lo, p - 1, target);
}

function partition(nums: number[], lo: number, hi: number): number {
    const r = lo + Math.floor(Math.random() * (hi - lo + 1));
    [nums[r], nums[hi]] = [nums[hi], nums[r]];
    const pivot = nums[hi];
    let wall = lo - 1;
    for (let j = lo; j < hi; j++)
        if (nums[j] <= pivot) { wall++; [nums[wall], nums[j]] = [nums[j], nums[wall]]; }
    [nums[wall + 1], nums[hi]] = [nums[hi], nums[wall + 1]];
    return wall + 1;
}
```

```python
import random

def find_kth_largest(nums: list[int], k: int) -> int:
    target = len(nums) - k
    return quick_select(nums, 0, len(nums) - 1, target)

def quick_select(nums: list[int], lo: int, hi: int, target: int) -> int:
    if lo == hi:
        return nums[lo]
    p = partition(nums, lo, hi)
    if p == target:
        return nums[p]
    elif p < target:
        return quick_select(nums, p + 1, hi, target)
    else:
        return quick_select(nums, lo, p - 1, target)

def partition(nums: list[int], lo: int, hi: int) -> int:
    r = random.randint(lo, hi)
    nums[r], nums[hi] = nums[hi], nums[r]
    pivot, wall = nums[hi], lo - 1
    for j in range(lo, hi):
        if nums[j] <= pivot:
            wall += 1
            nums[wall], nums[j] = nums[j], nums[wall]
    nums[wall + 1], nums[hi] = nums[hi], nums[wall + 1]
    return wall + 1
```

```go
func findKthLargest(nums []int, k int) int {
    target := len(nums) - k
    return quickSelect(nums, 0, len(nums)-1, target)
}

func quickSelect(nums []int, lo, hi, target int) int {
    if lo == hi { return nums[lo] }
    p := partitionArr(nums, lo, hi)
    if      p == target { return nums[p] }
    else if p < target  { return quickSelect(nums, p+1, hi, target) }
    else                { return quickSelect(nums, lo, p-1, target) }
}

func partitionArr(nums []int, lo, hi int) int {
    r := lo + rand.Intn(hi-lo+1)
    nums[r], nums[hi] = nums[hi], nums[r]
    pivot, wall := nums[hi], lo-1
    for j := lo; j < hi; j++ {
        if nums[j] <= pivot { wall++; nums[wall], nums[j] = nums[j], nums[wall] }
    }
    nums[wall+1], nums[hi] = nums[hi], nums[wall+1]
    return wall + 1
}
```

**Time:** O(n) average, O(n²) worst — **Space:** O(log n) avg stack

---

## Dry Run (QuickSelect)

`nums = [3,2,1,5,6,4]`, k=2, target = 6-2 = **4** (4th smallest = 2nd largest = 5)

Partition: random pivot, say 5 ends up at position 4 after partition: `[3,2,1,4,5,6]` (or similar)

`p=4 == target=4` → return `nums[4] = 5` ✓

---

## Complexity

| Approach | Time | Space | Notes |
|---|---|---|---|
| Full Sort | O(n log n) | O(1) | Simple, always works |
| Min-Heap size k | O(n log k) | O(k) | Best for streaming/large n |
| QuickSelect | O(n) avg, O(n²) worst | O(log n) | Best average, modifies array |

---

## Key Interview Insights

- **k-th largest maps to `(n-k)`-th index** in 0-indexed ascending sorted array. Be precise about this mapping upfront.
- **QuickSelect vs heap:** QuickSelect is O(n) average and in-place, but modifies the array and has O(n²) worst case. Heap is O(n log k), doesn't modify input, and is better for streaming scenarios or when you can't modify the array.
- **Randomizing the pivot** prevents the O(n²) worst case on sorted/adversarial inputs.
- **Introselect** is the guaranteed O(n) worst-case algorithm (used by `std::nth_element` in C++) — median-of-medians pivot selection. Too complex for interviews, but mention it.
- **LeetCode follow-up:** The problem asks if you can solve it in O(n) time — the intended answer is QuickSelect.
- **Equal elements:** With many duplicates, three-way partition avoids degeneracy and makes QuickSelect O(n) even on uniform arrays.
