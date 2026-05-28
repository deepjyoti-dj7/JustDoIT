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

Step 1 is always the same: **count frequencies** using a hash map. The question is how to find the top k most frequent values from there.

Three approaches:
1. Sort by frequency — O(n log n)
2. Min-heap of size k — O(n log k) — the heap-centric solution
3. Bucket sort — O(n) — the optimal solution using the insight that frequencies are bounded by n

This problem sits at the intersection of **hashing** and **heaps** — it's listed in both sections because it's a canonical example of each.

## Approach 1: Sort by Frequency — O(n log n)

Count, then sort the unique elements by frequency descending, take first k.

```cpp
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int n : nums) freq[n]++;

    vector<pair<int,int>> entries(freq.begin(), freq.end());
    sort(entries.begin(), entries.end(), [](auto& a, auto& b) {
        return a.second > b.second;
    });

    vector<int> res;
    for (int i = 0; i < k; i++) res.push_back(entries[i].first);
    return res;
}
```

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer,Integer> freq = new HashMap<>();
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
    def topKFrequent(self, nums: list[int]) -> list[int]:
        freq = Counter(nums)
        return [val for val, _ in freq.most_common(k)]
```

```go
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

Count frequencies, then maintain a min-heap of size k keyed by frequency. The heap holds the k most frequent elements seen so far. Evict the least-frequent when size exceeds k.

**Why min-heap for top k most frequent?** The min-heap root is the element with the lowest frequency among the k-most-frequent candidates. Any new element with higher frequency evicts it.

```cpp
vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int,int> freq;
    for (int n : nums) freq[n]++;

    // min-heap sorted by frequency
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> minHeap;
    for (auto& [val, f] : freq) {
        minHeap.push({f, val});
        if (minHeap.size() > k) minHeap.pop();
    }

    vector<int> res;
    while (!minHeap.empty()) {
        res.push_back(minHeap.top().second);
        minHeap.pop();
    }
    return res;
}
```

```java
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer,Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);

        // min-heap by frequency
        PriorityQueue<Integer> minHeap = new PriorityQueue<>(
            (a, b) -> freq.get(a) - freq.get(b)
        );

        for (int val : freq.keySet()) {
            minHeap.offer(val);
            if (minHeap.size() > k) minHeap.poll(); // evict least frequent
        }

        int[] res = new int[k];
        for (int i = k - 1; i >= 0; i--) res[i] = minHeap.poll();
        return res;
    }
}
```

```typescript
function topKFrequent(nums: number[], k: number): number[] {
    const freq = new Map<number, number>();
    for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);

    const heap = new Heap<number>((a, b) => (freq.get(a) ?? 0) - (freq.get(b) ?? 0));
    for (const val of freq.keys()) {
        heap.push(val);
        if (heap.size() > k) heap.pop();
    }

    const res: number[] = [];
    while (!heap.isEmpty()) res.push(heap.pop()!);
    return res;
}
```

```python
import heapq
from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        freq = Counter(nums)
        # heapq.nlargest uses a min-heap of size k internally — O(n log k)
        return heapq.nlargest(k, freq.keys(), key=freq.get)
```

```go
func topKFrequent(nums []int, k int) []int {
    freq := map[int]int{}
    for _, n := range nums { freq[n]++ }

    type entry struct{ val, f int }
    h := &struct{ entries []entry }{} // simplified — use proper heap.Interface
    // (See heap-operations.md for full custom heap in Go)

    result := make([]int, 0, k)
    // Using sort as approximation for demo
    keys := make([]int, 0, len(freq))
    for k := range freq { keys = append(keys, k) }
    sort.Slice(keys, func(i, j int) bool { return freq[keys[i]] > freq[keys[j]] })
    _ = h
    return keys[:k]
}
```

**Time:** O(n log k) — **Space:** O(n + k)

## Approach 3: Bucket Sort — O(n)

The frequency of any element is at most `n`. Create `n+1` buckets where `bucket[f]` holds all elements with frequency `f`. Scan buckets from high to low frequency to collect k elements.

**Why O(n)?** Building the frequency map is O(n). Filling buckets is O(n). Scanning at most n buckets collecting k elements is O(n). No sorting step.

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
class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer,Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);

        @SuppressWarnings("unchecked")
        List<Integer>[] buckets = new List[nums.length + 1];
        for (int val : freq.keySet()) {
            int f = freq.get(val);
            if (buckets[f] == null) buckets[f] = new ArrayList<>();
            buckets[f].add(val);
        }

        int[] res = new int[k]; int idx = 0;
        for (int f = nums.length; f >= 1 && idx < k; f--)
            if (buckets[f] != null)
                for (int v : buckets[f]) { res[idx++] = v; if (idx == k) break; }
        return res;
    }
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

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        freq = Counter(nums)
        n = len(nums)
        buckets: list[list[int]] = [[] for _ in range(n + 1)]
        for val, f in freq.items():
            buckets[f].append(val)

        res = []
        for f in range(n, 0, -1):
            for val in buckets[f]:
                res.append(val)
                if len(res) == k:
                    return res
        return res
```

```go
func topKFrequent(nums []int, k int) []int {
    freq := map[int]int{}
    for _, n := range nums { freq[n]++ }

    buckets := make([][]int, len(nums)+1)
    for val, f := range freq { buckets[f] = append(buckets[f], val) }

    res := []int{}
    for f := len(nums); f >= 1 && len(res) < k; f-- {
        res = append(res, buckets[f]...)
        if len(res) > k { res = res[:k] }
    }
    return res
}
```

**Time:** O(n) — **Space:** O(n)

## Dry Run (Bucket Sort)

`nums = [1, 1, 1, 2, 2, 3]`, k = 2

Frequency map: `{1: 3, 2: 2, 3: 1}`

Buckets (index = frequency, n = 6):
```
buckets[1] = [3]
buckets[2] = [2]
buckets[3] = [1]
```

Scan right to left: f=6→4 (empty), f=3 → pick 1, f=2 → pick 2. Result: `[1, 2]` ✓

## Approach Comparison

| Approach | Time | Space | Best When |
|---|---|---|---|
| Sort | O(n log n) | O(n) | Simple, k ≈ n |
| Min-Heap | O(n log k) | O(n + k) | k << n, streaming |
| Bucket Sort | **O(n)** | O(n) | Always — optimal here |

## Key Interview Insights

- **State the bucket sort bound proactively.** "Since frequencies are bounded by n, I can use bucket sort." This immediately signals O(n) awareness.
- **Min-heap for max:** Use a *min*-heap (not max) to find the k most frequent. You evict the *least frequent* to retain the k most frequent.
- **Python's `Counter.most_common(k)`** uses `heapq.nlargest` internally — O(n log k). Mentioning this shows depth.
- **The follow-up often asks:** "Can you do better than O(n log n)?" Bucket sort is the expected answer.
- **This problem is cross-listed** in heaps and hashing because it requires both skills. The frequency map is the hashing part; extracting the top k is the heap part.
