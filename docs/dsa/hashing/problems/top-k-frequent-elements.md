---
title: Top K Frequent Elements
difficulty: Medium
tags: [Array, Hash Map, Heap, Bucket Sort]
link: https://leetcode.com/problems/top-k-frequent-elements/
---

# Top K Frequent Elements

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/) |
| **Tags** | Array, Hash Map, Heap, Bucket Sort |

## Problem Statement

Given an integer array `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.

Example: `nums = [1, 1, 1, 2, 2, 3]`, `k = 2` → `[1, 2]`

## Intuition

Step 1 is always the same: count element frequencies with a hash map. The question is how to efficiently extract the top k after counting.

**Three approaches:**
1. Sort by frequency — O(n log n) — too slow if we want to beat sorting
2. Min-heap of size k — O(n log k) — good when k << n
3. Bucket sort — O(n) — optimal when we know frequencies are bounded by n

## Approach 1: Sort by Frequency — O(n log n)

Count frequencies, then sort elements by their frequency in descending order, take first k.

```cpp
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int n : nums) freq[n]++;

        vector<pair<int,int>> entries(freq.begin(), freq.end());
        sort(entries.begin(), entries.end(), [](auto& a, auto& b) {
            return a.second > b.second;
        });

        vector<int> result;
        for (int i = 0; i < k; i++) result.push_back(entries[i].first);
        return result;
    }
};
```

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);

        return freq.entrySet().stream()
            .sorted((a, b) -> b.getValue() - a.getValue())
            .limit(k)
            .mapToInt(Map.Entry::getKey)
            .toArray();
    }
}
```

```typescript
function topKFrequent(nums: number[], k: number): number[] {
    const freq = new Map<number, number>();
    for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, k)
        .map(([val]) => val);
}
```

```python
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        freq = Counter(nums)
        return [val for val, _ in freq.most_common(k)]
```

```go
import "sort"

func topKFrequent(nums []int, k int) []int {
    freq := map[int]int{}
    for _, n := range nums { freq[n]++ }

    keys := make([]int, 0, len(freq))
    for key := range freq { keys = append(keys, key) }
    sort.Slice(keys, func(i, j int) bool { return freq[keys[i]] > freq[keys[j]] })

    return keys[:k]
}
```

**Time:** O(n log n) — **Space:** O(n)

## Approach 2: Min-Heap of Size k — O(n log k)

Maintain a min-heap of size k. When it exceeds k, evict the element with the lowest frequency. The heap retains only the k most frequent.

```cpp
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int n : nums) freq[n]++;

        // min-heap: {frequency, value}
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> minHeap;
        for (auto& [val, f] : freq) {
            minHeap.push({f, val});
            if (minHeap.size() > k) minHeap.pop();
        }

        vector<int> result;
        while (!minHeap.empty()) {
            result.push_back(minHeap.top().second);
            minHeap.pop();
        }
        return result;
    }
};
```

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);

        // min-heap by frequency
        PriorityQueue<Integer> minHeap = new PriorityQueue<>(
            (a, b) -> freq.get(a) - freq.get(b)
        );
        for (int val : freq.keySet()) {
            minHeap.offer(val);
            if (minHeap.size() > k) minHeap.poll();
        }

        int[] result = new int[k];
        for (int i = k - 1; i >= 0; i--) result[i] = minHeap.poll();
        return result;
    }
}
```

```typescript
function topKFrequent(nums: number[], k: number): number[] {
    const freq = new Map<number, number>();
    for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

    // Simulate min-heap with sorted array (interview-friendly)
    const heap: [number, number][] = []; // [frequency, value]
    for (const [val, f] of freq) {
        heap.push([f, val]);
        heap.sort((a, b) => a[0] - b[0]);
        if (heap.length > k) heap.shift();
    }
    return heap.map(([, val]) => val);
}
```

```python
import heapq
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        freq = Counter(nums)
        # heapq.nlargest uses a heap internally — O(n log k)
        return heapq.nlargest(k, freq.keys(), key=freq.get)
```

```go
import "container/heap"

type FreqHeap [][]int // [[freq, val], ...]
func (h FreqHeap) Len() int            { return len(h) }
func (h FreqHeap) Less(i, j int) bool  { return h[i][0] < h[j][0] } // min-heap
func (h FreqHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *FreqHeap) Push(x interface{}) { *h = append(*h, x.([]int)) }
func (h *FreqHeap) Pop() interface{}   { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

func topKFrequent(nums []int, k int) []int {
    freq := map[int]int{}
    for _, n := range nums { freq[n]++ }

    h := &FreqHeap{}
    heap.Init(h)
    for val, f := range freq {
        heap.Push(h, []int{f, val})
        if h.Len() > k { heap.Pop(h) }
    }
    result := make([]int, k)
    for i := k - 1; i >= 0; i-- { result[i] = heap.Pop(h).([]int)[1] }
    return result
}
```

**Time:** O(n log k) — **Space:** O(n + k)

## Approach 3: Bucket Sort — O(n)

The frequency of any element is at most `n`. Create `n+1` buckets where `bucket[f]` holds all elements with frequency `f`. Scan buckets from right to left and collect k elements.

```cpp
class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> freq;
        for (int n : nums) freq[n]++;

        int n = nums.size();
        vector<vector<int>> buckets(n + 1);
        for (auto& [val, f] : freq) buckets[f].push_back(val);

        vector<int> result;
        for (int f = n; f >= 1 && result.size() < k; f--) {
            for (int val : buckets[f]) {
                result.push_back(val);
                if (result.size() == k) break;
            }
        }
        return result;
    }
};
```

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);

        List<Integer>[] buckets = new List[nums.length + 1];
        for (int val : freq.keySet()) {
            int f = freq.get(val);
            if (buckets[f] == null) buckets[f] = new ArrayList<>();
            buckets[f].add(val);
        }

        int[] result = new int[k];
        int idx = 0;
        for (int f = nums.length; f >= 1 && idx < k; f--) {
            if (buckets[f] == null) continue;
            for (int val : buckets[f]) {
                result[idx++] = val;
                if (idx == k) break;
            }
        }
        return result;
    }
}
```

```typescript
function topKFrequent(nums: number[], k: number): number[] {
    const freq = new Map<number, number>();
    for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

    const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
    for (const [val, f] of freq) buckets[f].push(val);

    const result: number[] = [];
    for (let f = nums.length; f >= 1 && result.length < k; f--) {
        for (const val of buckets[f]) {
            result.push(val);
            if (result.length === k) break;
        }
    }
    return result;
}
```

```python
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        freq = Counter(nums)
        n = len(nums)
        buckets: list[list[int]] = [[] for _ in range(n + 1)]
        for val, f in freq.items():
            buckets[f].append(val)

        result = []
        for f in range(n, 0, -1):
            for val in buckets[f]:
                result.append(val)
                if len(result) == k:
                    return result
        return result
```

```go
func topKFrequent(nums []int, k int) []int {
    freq := map[int]int{}
    for _, n := range nums { freq[n]++ }

    buckets := make([][]int, len(nums)+1)
    for val, f := range freq { buckets[f] = append(buckets[f], val) }

    result := []int{}
    for f := len(nums); f >= 1 && len(result) < k; f-- {
        result = append(result, buckets[f]...)
        if len(result) > k { result = result[:k] }
    }
    return result
}
```

**Time:** O(n) — **Space:** O(n)

## Approach Comparison

| Approach | Time | Space | Best When |
|---|---|---|---|
| Sort by frequency | O(n log n) | O(n) | Simple, small n |
| Min-heap of size k | O(n log k) | O(n + k) | k << n, streaming data |
| Bucket sort | O(n) | O(n) | Frequencies bounded by n (always true here) |

## Dry Run (Bucket Sort)

`nums = [1, 1, 1, 2, 2, 3]`, k = 2

Frequency: `{1: 3, 2: 2, 3: 1}`

Buckets (index = frequency):
```
buckets[1] = [3]
buckets[2] = [2]
buckets[3] = [1]
```

Scan from right: f=3 → pick 1, f=2 → pick 2. Result: `[1, 2]` ✓

## Key Interview Insights

- **The problem says O(n log n) is too slow** — the follow-up constraint pushes you toward bucket sort or heap. Mention this proactively.
- **Bucket sort is the optimal interview answer** here. The key insight: "frequencies are bounded by n, so I can use bucket sort."
- **Min-heap size k** — the trick is using a *min*-heap (not max) when finding top k. You evict the *smallest* frequency to retain the k largest.
- **Python's `Counter.most_common(k)`** uses `heapq.nlargest` internally — O(n log k). But stating this explicitly shows depth.
- **Why not max-heap?** A max-heap of all n elements gives O(n) to build + O(k log n) to extract k elements = O(n + k log n). The min-heap approach uses O(n log k) total, which is better when k << n.

