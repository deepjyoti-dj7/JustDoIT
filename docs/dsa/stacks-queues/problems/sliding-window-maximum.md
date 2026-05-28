---
title: Sliding Window Maximum
difficulty: Hard
tags: [Array, Queue, Sliding Window, Deque, Monotonic Queue]
link: https://leetcode.com/problems/sliding-window-maximum/
---

# Sliding Window Maximum

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/) |
| **Tags** | Array, Queue, Sliding Window, Monotonic Deque |

## Problem Statement

Given an array of integers `nums` and an integer `k`, there is a sliding window of size `k` moving from left to right. Return the maximum value of each window.

Example: `nums = [1, 3, -1, -3, 5, 3, 6, 7]`, `k = 3`

```
Window          Max
[1  3  -1] -3   5  3  6  7    3
 1 [3  -1  -3]  5  3  6  7    3
 1  3 [-1  -3   5] 3  6  7    5
 1  3  -1 [-3   5  3] 6  7    5
 1  3  -1  -3  [5  3  6] 7    6
 1  3  -1  -3   5 [3  6  7]   7
```

Output: `[3, 3, 5, 5, 6, 7]`

## Intuition

The brute force scans k elements per window: O(nk). We need O(n).

**Key observation:** Inside any window, if element `a` comes before element `b` and `a ≤ b`, then `a` can **never** be the maximum of any future window (because `b` is also in those windows and is larger). We can discard `a` permanently.

This gives us the **monotonic deque** pattern: maintain a deque of indices in **decreasing order of values**. The front always holds the current window's maximum.

Two invariants to maintain:
1. **Front is in-window** — remove from front if the front index is ≤ `i - k`
2. **Decreasing order** — remove from back any index whose value < `nums[i]` before pushing `i`

## Approach 1: Brute Force — O(nk)

Scan k elements for each window position.

```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    int n = nums.size();
    vector<int> result;
    for (int i = 0; i <= n - k; i++) {
        int maxVal = *max_element(nums.begin() + i, nums.begin() + i + k);
        result.push_back(maxVal);
    }
    return result;
}
```

```java
int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n - k + 1];
    for (int i = 0; i <= n - k; i++) {
        int maxVal = nums[i];
        for (int j = i; j < i + k; j++) maxVal = Math.max(maxVal, nums[j]);
        result[i] = maxVal;
    }
    return result;
}
```

```typescript
function maxSlidingWindow(nums: number[], k: number): number[] {
    const result: number[] = [];
    for (let i = 0; i <= nums.length - k; i++) {
        result.push(Math.max(...nums.slice(i, i + k)));
    }
    return result;
}
```

```python
def max_sliding_window(nums: list[int], k: int) -> list[int]:
    return [max(nums[i:i+k]) for i in range(len(nums) - k + 1)]
```

```go
func maxSlidingWindow(nums []int, k int) []int {
    n := len(nums)
    result := make([]int, n-k+1)
    for i := 0; i <= n-k; i++ {
        maxVal := nums[i]
        for j := i + 1; j < i+k; j++ {
            if nums[j] > maxVal { maxVal = nums[j] }
        }
        result[i] = maxVal
    }
    return result
}
```

**Time:** O(nk) — **Space:** O(1)

## Approach 2: Monotonic Deque — O(n)

```cpp
class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> dq; // stores indices, maintains decreasing values
        vector<int> result;

        for (int i = 0; i < nums.size(); i++) {
            // Remove indices outside the window
            if (!dq.empty() && dq.front() <= i - k) dq.pop_front();

            // Remove indices with smaller values from back
            while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();

            dq.push_back(i);

            // Window is fully formed
            if (i >= k - 1) result.push_back(nums[dq.front()]);
        }
        return result;
    }
};
```

```java
class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>(); // stores indices

        for (int i = 0; i < n; i++) {
            // Evict out-of-window front
            if (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();

            // Maintain decreasing order
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();

            dq.offerLast(i);

            if (i >= k - 1) result[i - k + 1] = nums[dq.peekFirst()];
        }
        return result;
    }
}
```

```typescript
function maxSlidingWindow(nums: number[], k: number): number[] {
    const dq: number[] = []; // indices
    const result: number[] = [];

    for (let i = 0; i < nums.length; i++) {
        // Evict out-of-window indices from front
        if (dq.length > 0 && dq[0] <= i - k) dq.shift();

        // Maintain decreasing order: evict smaller from back
        while (dq.length > 0 && nums[dq[dq.length - 1]] < nums[i]) dq.pop();

        dq.push(i);

        if (i >= k - 1) result.push(nums[dq[0]]);
    }
    return result;
}
```

```python
from collections import deque

class Solution:
    def maxSlidingWindow(self, nums: list[int], k: int) -> list[int]:
        dq = deque()  # stores indices
        result = []

        for i, val in enumerate(nums):
            # Evict out-of-window indices from front
            if dq and dq[0] <= i - k:
                dq.popleft()

            # Maintain decreasing order
            while dq and nums[dq[-1]] < val:
                dq.pop()

            dq.append(i)

            if i >= k - 1:
                result.append(nums[dq[0]])

        return result
```

```go
func maxSlidingWindow(nums []int, k int) []int {
    dq := []int{} // indices
    result := []int{}

    for i, val := range nums {
        // Evict out-of-window from front
        if len(dq) > 0 && dq[0] <= i-k {
            dq = dq[1:]
        }
        // Maintain decreasing order
        for len(dq) > 0 && nums[dq[len(dq)-1]] < val {
            dq = dq[:len(dq)-1]
        }
        dq = append(dq, i)
        if i >= k-1 {
            result = append(result, nums[dq[0]])
        }
    }
    return result
}
```

**Time:** O(n) — each element is pushed and popped at most once.
**Space:** O(k) — deque holds at most k indices.

## Dry Run

`nums = [1, 3, -1, -3, 5, 3, 6, 7]`, `k = 3`

| i | val | Before | Evict front? | Evict back? | Deque after | Result |
|---|---|---|---|---|---|---|
| 0 | 1 | [] | No | No | [0] | — |
| 1 | 3 | [0] | No | Yes (1<3, pop 0) | [1] | — |
| 2 | -1 | [1] | No | No (-1<3) | [1,2] | **3** |
| 3 | -3 | [1,2] | No | No (-3<-1) | [1,2,3] | **3** |
| 4 | 5 | [1,2,3] | Yes (1≤4-3=1, pop) | Yes (5>-3, pop 3; 5>-1, pop 2; 5>3, pop 1) | [4] | **5** |
| 5 | 3 | [4] | No | No (3<5) | [4,5] | **5** |
| 6 | 6 | [4,5] | No | Yes (6>3, pop 5; 6>5, pop 4) | [6] | **6** |
| 7 | 7 | [6] | No | Yes (7>6, pop 6) | [7] | **7** |

Result: `[3, 3, 5, 5, 6, 7]` ✓

## Why This Works

The deque stores indices in **decreasing value order**. When we query `nums[dq.front()]`, it's the largest in the current window because:
1. All larger or equal elements ahead of it would have been popped from the back when they were added
2. The front is guaranteed to be within the window (we evict stale indices)

Since elements are in decreasing order, nothing in the window can be larger than the front.

## Key Interview Insights

- **Store indices, not values.** We need indices to check whether an element is still within the window.
- **Eviction order matters:** Evict the out-of-window front *first*, then maintain the decreasing invariant from the back, then push the current index.
- **`<` vs `<=` in back eviction:** `nums[dq.back()] < nums[i]` evicts smaller elements. If you use `<=`, you also evict equal elements — both produce correct max values, but `<` keeps more elements (useful if you need to track positions of duplicates).
- **`<=` in front eviction:** `dq.front() <= i - k` checks if the front index is outside the window. The window is `[i-k+1, i]`, so `i - k` is already outside.
- **Sliding window minimum:** same approach, flip the comparison to `>` in the back eviction step.
- **This pattern extends to:** minimum window problems, maximum of all subarrays of size k, and other fixed-window range queries.

