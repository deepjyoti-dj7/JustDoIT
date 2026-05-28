---
title: Top K Problems
description: Pattern guide for Top K problems — heaps, quickselect, and bucket sort strategies
---

# Top K Problems

"Top K" is one of the most common interview problem families. The same pattern appears in dozens of variants — top k frequent, k closest points, kth largest, k-way merge. Understanding the **decision tree** between approaches is what separates a good answer from a great one.

## The Core Problem Family

| Problem | Example |
|---|---|
| Top K largest elements | Find 3 largest in [3,2,1,5,6,4] |
| Top K smallest elements | Find 2 smallest in [1,3,2,4,5] |
| Kth largest / smallest | Find 2nd largest |
| Top K by frequency | Most frequent k words |
| Top K by custom metric | K closest points to origin |
| K-way merge | Merge k sorted lists |

## Decision Tree: Which Approach?

```
Is K given and fixed?
├── Yes: How large is n vs k?
│   ├── k ≈ n: Just sort — O(n log n) is fine
│   ├── k << n (streaming or large n):
│   │   ├── Need exact k elements: Min/Max Heap — O(n log k)
│   │   ├── Need Kth element only: Quickselect — O(n) avg
│   │   └── Frequencies bounded by n: Bucket Sort — O(n)
│   └── Order of top-k matters: Sort the heap result
└── No (dynamic): Two heaps or sorted structure
```

## Approach 1: Sort — O(n log n)

Sort and take the first k. Simple, works everywhere, optimal if n and k are similar.

```cpp
vector<int> topKLargest(vector<int>& nums, int k) {
    sort(nums.begin(), nums.end(), greater<int>());
    return vector<int>(nums.begin(), nums.begin() + k);
}
```

```java
int[] topKLargest(int[] nums, int k) {
    Arrays.sort(nums);
    int[] res = new int[k];
    for (int i = 0; i < k; i++) res[i] = nums[nums.length - 1 - i];
    return res;
}
```

```typescript
function topKLargest(nums: number[], k: number): number[] {
    return nums.sort((a, b) => b - a).slice(0, k);
}
```

```python
def top_k_largest(nums: list[int], k: int) -> list[int]:
    return sorted(nums, reverse=True)[:k]
```

```go
func topKLargest(nums []int, k int) []int {
    sort.Sort(sort.Reverse(sort.IntSlice(nums)))
    return nums[:k]
}
```

**When:** k is close to n, or you need the result sorted.

## Approach 2: Min-Heap of Size K — O(n log k)

For top K **largest**: maintain a min-heap of size k. The heap holds the k largest seen so far. When size exceeds k, evict the smallest (heap root). After all n elements, the heap contains the k largest.

**Counter-intuitive but correct:** Use a **min**-heap to find the k **largest**. The min at the root acts as a "guard" — any new element smaller than it can't be in the top k and is discarded.

```cpp
vector<int> topKLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap; // min-heap
    for (int n : nums) {
        minHeap.push(n);
        if (minHeap.size() > k) minHeap.pop(); // evict smallest
    }
    vector<int> res;
    while (!minHeap.empty()) { res.push_back(minHeap.top()); minHeap.pop(); }
    return res;
}
```

```java
int[] topKLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);
    for (int n : nums) {
        minHeap.offer(n);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.stream().mapToInt(Integer::intValue).toArray();
}
```

```typescript
function topKLargest(nums: number[], k: number): number[] {
    const heap = new Heap<number>((a, b) => a - b); // min-heap
    for (const n of nums) {
        heap.push(n);
        if (heap.size() > k) heap.pop();
    }
    const res: number[] = [];
    while (!heap.isEmpty()) res.push(heap.pop()!);
    return res;
}
```

```python
import heapq

def top_k_largest(nums: list[int], k: int) -> list[int]:
    # heapq.nlargest uses a min-heap of size k internally
    return heapq.nlargest(k, nums)
    # Manual version:
    # heap = []
    # for n in nums:
    #     heapq.heappush(heap, n)
    #     if len(heap) > k: heapq.heappop(heap)
    # return heap
```

```go
func topKLargest(nums []int, k int) []int {
    h := &MinHeap{}
    heap.Init(h)
    for _, n := range nums {
        heap.Push(h, n)
        if h.Len() > k { heap.Pop(h) }
    }
    return []int(*h)
}
```

**When:** n is large, k is small, streaming input, or you need O(n log k) guaranteed.

**Flip for K smallest:** Use a **max**-heap and evict the largest.

## Approach 3: Quickselect — O(n) Average, O(n²) Worst

Partition the array (like quicksort) around a pivot. After partitioning, the pivot is at its "sorted" position. If pivot position == n-k, we're done — everything to the right is the top k largest.

This is the approach behind `nth_element` in C++ and `Arrays.sort` partial sort tricks.

```cpp
// Using STL nth_element — O(n) average
void nthElement(vector<int>& nums, int k) {
    // After call, nums[n-k] = kth largest, elements to its right >= it
    nth_element(nums.begin(), nums.begin() + nums.size() - k, nums.end());
}

// Manual quickselect for Kth largest
int quickselect(vector<int>& nums, int k) {
    int n = nums.size();
    int lo = 0, hi = n - 1, target = n - k;
    while (lo < hi) {
        int pivot = nums[hi], p = lo;
        for (int i = lo; i < hi; i++)
            if (nums[i] <= pivot) swap(nums[i], nums[p++]);
        swap(nums[p], nums[hi]);
        if (p == target) break;
        else if (p < target) lo = p + 1;
        else hi = p - 1;
    }
    return nums[target];
}
```

```java
int quickselect(int[] nums, int k) {
    int n = nums.length, target = n - k;
    int lo = 0, hi = n - 1;
    while (lo < hi) {
        int pivot = nums[hi], p = lo;
        for (int i = lo; i < hi; i++)
            if (nums[i] <= pivot) { int t = nums[i]; nums[i] = nums[p]; nums[p++] = t; }
        int t = nums[p]; nums[p] = nums[hi]; nums[hi] = t;
        if (p == target) break;
        else if (p < target) lo = p + 1;
        else hi = p - 1;
    }
    return nums[target];
}
```

```typescript
function quickselect(nums: number[], k: number): number {
    const n = nums.length, target = n - k;
    let lo = 0, hi = n - 1;
    while (lo < hi) {
        const pivot = nums[hi];
        let p = lo;
        for (let i = lo; i < hi; i++)
            if (nums[i] <= pivot) [nums[i], nums[p++]] = [nums[p], nums[i]];
        [nums[p], nums[hi]] = [nums[hi], nums[p]];
        if (p === target) break;
        else if (p < target) lo = p + 1;
        else hi = p - 1;
    }
    return nums[target];
}
```

```python
import random

def quickselect(nums: list[int], k: int) -> int:
    # Returns kth largest
    target = len(nums) - k

    def select(lo, hi):
        pivot_idx = random.randint(lo, hi)
        nums[pivot_idx], nums[hi] = nums[hi], nums[pivot_idx]
        pivot, p = nums[hi], lo
        for i in range(lo, hi):
            if nums[i] <= pivot:
                nums[i], nums[p] = nums[p], nums[i]
                p += 1
        nums[p], nums[hi] = nums[hi], nums[p]
        if p == target: return nums[p]
        elif p < target: return select(p + 1, hi)
        else: return select(lo, p - 1)

    return select(0, len(nums) - 1)
```

```go
func quickselect(nums []int, k int) int {
    n, target := len(nums), len(nums)-k
    lo, hi := 0, n-1
    for lo < hi {
        pivot, p := nums[hi], lo
        for i := lo; i < hi; i++ {
            if nums[i] <= pivot {
                nums[i], nums[p] = nums[p], nums[i]
                p++
            }
        }
        nums[p], nums[hi] = nums[hi], nums[p]
        if p == target { break }
        if p < target { lo = p + 1 } else { hi = p - 1 }
    }
    return nums[target]
}
```

**When:** Only need one specific Kth element, can mutate input, n is large.

**Gotcha:** Worst case O(n²) with sorted input and bad pivot choice. Use random pivot to avoid.

## Approach 4: Bucket Sort — O(n)

When values are bounded (e.g., frequencies bounded by n), use bucket sort. Create `n` buckets where `bucket[i]` holds all elements with value/frequency `i`. Scan from highest to lowest bucket to collect k elements.

```cpp
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int n : nums) freq[n]++;

    int n = nums.size();
    vector<vector<int>> buckets(n + 1);
    for (auto& [val, f] : freq) buckets[f].push_back(val);

    vector<int> res;
    for (int f = n; f >= 1 && res.size() < k; f--)
        for (int v : buckets[f]) { res.push_back(v); if (res.size() == k) break; }
    return res;
}
```

```java
int[] topKFrequent(int[] nums, int k) {
    Map<Integer,Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);

    List<Integer>[] buckets = new List[nums.length + 1];
    for (int v : freq.keySet()) {
        int f = freq.get(v);
        if (buckets[f] == null) buckets[f] = new ArrayList<>();
        buckets[f].add(v);
    }
    int[] res = new int[k]; int idx = 0;
    for (int f = nums.length; f >= 1 && idx < k; f--)
        if (buckets[f] != null) for (int v : buckets[f]) { res[idx++] = v; if (idx == k) break; }
    return res;
}
```

```typescript
function topKFrequent(nums: number[], k: number): number[] {
    const freq = new Map<number, number>();
    for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

    const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
    for (const [val, f] of freq) buckets[f].push(val);

    const res: number[] = [];
    for (let f = nums.length; f >= 1 && res.length < k; f--)
        for (const v of buckets[f]) { res.push(v); if (res.length === k) break; }
    return res;
}
```

```python
from collections import Counter

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    freq = Counter(nums)
    buckets: list[list[int]] = [[] for _ in range(len(nums) + 1)]
    for val, f in freq.items():
        buckets[f].append(val)

    res = []
    for f in range(len(nums), 0, -1):
        for v in buckets[f]:
            res.append(v)
            if len(res) == k:
                return res
    return res
```

```go
func topKFrequent(nums []int, k int) []int {
    freq := map[int]int{}
    for _, n := range nums { freq[n]++ }

    buckets := make([][]int, len(nums)+1)
    for v, f := range freq { buckets[f] = append(buckets[f], v) }

    res := []int{}
    for f := len(nums); f >= 1 && len(res) < k; f-- {
        res = append(res, buckets[f]...)
        if len(res) > k { res = res[:k] }
    }
    return res
}
```

**When:** The "value range" is bounded and small (frequencies, digits, characters).

## Complexity Summary

| Approach | Time | Space | Best Use Case |
|---|---|---|---|
| Sort | O(n log n) | O(1) | Simple, k ≈ n |
| Min/Max Heap | O(n log k) | O(k) | k << n, streaming |
| Quickselect | O(n) avg | O(1) | Need exactly Kth element |
| Bucket Sort | O(n) | O(n) | Bounded value range |

## Interview Strategy

1. **Always start with sort** — state it as the baseline, note its O(n log n) complexity.
2. **Then offer the heap approach** — explain the min-heap-for-max insight proactively.
3. **Mention quickselect** — show depth even if you don't implement it (often not needed).
4. **Bucket sort** — bring it up when you notice bounded frequencies/values.

> The interviewer wants to see that you know multiple tools and can reason about when each is appropriate — not just that you can implement one.
