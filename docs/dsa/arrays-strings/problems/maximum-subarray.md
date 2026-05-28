---
title: Maximum Subarray
difficulty: Medium
tags: [Array, Dynamic Programming, Divide and Conquer]
link: https://leetcode.com/problems/maximum-subarray/
---

# Maximum Subarray (Kadane's Algorithm)

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) |
| **Tags** | Array, DP, Divide & Conquer |

## Problem Statement

Given an integer array `nums`, find the contiguous subarray with the largest sum and return its sum.

## Intuition

At each position, we have a choice: **extend the current subarray** or **start fresh** from the current element. If the accumulated sum so far is negative, it can only hurt — drop it and start over.

This is **Kadane's Algorithm**, one of the most elegant greedy/DP algorithms.

## Approach 1: Brute Force

Try all subarrays.

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int maxSum = INT_MIN;
        for (int i = 0; i < nums.size(); i++) {
            int sum = 0;
            for (int j = i; j < nums.size(); j++) {
                sum += nums[j];
                maxSum = max(maxSum, sum);
            }
        }
        return maxSum;
    }
};
```

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = Integer.MIN_VALUE;
        for (int i = 0; i < nums.length; i++) {
            int sum = 0;
            for (int j = i; j < nums.length; j++) {
                sum += nums[j];
                maxSum = Math.max(maxSum, sum);
            }
        }
        return maxSum;
    }
}
```

```typescript
function maxSubArray(nums: number[]): number {
    let maxSum = -Infinity;
    for (let i = 0; i < nums.length; i++) {
        let sum = 0;
        for (let j = i; j < nums.length; j++) {
            sum += nums[j];
            maxSum = Math.max(maxSum, sum);
        }
    }
    return maxSum;
}
```

```python
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        max_sum = float('-inf')
        for i in range(len(nums)):
            total = 0
            for j in range(i, len(nums)):
                total += nums[j]
                max_sum = max(max_sum, total)
        return max_sum
```

```go
func maxSubArray(nums []int) int {
    maxSum := nums[0]
    for i := 0; i < len(nums); i++ {
        sum := 0
        for j := i; j < len(nums); j++ {
            sum += nums[j]
            if sum > maxSum {
                maxSum = sum
            }
        }
    }
    return maxSum
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Kadane's Algorithm (Optimal)

At each index, decide: extend the previous subarray or start a new one.

$$\text{currentSum}[i] = \max(\text{nums}[i],\ \text{currentSum}[i-1] + \text{nums}[i])$$

```cpp
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int current = nums[0];
        int maxSum = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            current = max(nums[i], current + nums[i]);
            maxSum = max(maxSum, current);
        }
        return maxSum;
    }
};
```

```java
class Solution {
    public int maxSubArray(int[] nums) {
        int current = nums[0];
        int maxSum = nums[0];
        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]);
            maxSum = Math.max(maxSum, current);
        }
        return maxSum;
    }
}
```

```typescript
function maxSubArray(nums: number[]): number {
    let current = nums[0];
    let maxSum = nums[0];
    for (let i = 1; i < nums.length; i++) {
        current = Math.max(nums[i], current + nums[i]);
        maxSum = Math.max(maxSum, current);
    }
    return maxSum;
}
```

```python
class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        current = nums[0]
        max_sum = nums[0]
        for i in range(1, len(nums)):
            current = max(nums[i], current + nums[i])
            max_sum = max(max_sum, current)
        return max_sum
```

```go
func maxSubArray(nums []int) int {
    current := nums[0]
    maxSum := nums[0]
    for i := 1; i < len(nums); i++ {
        if current+nums[i] > nums[i] {
            current = current + nums[i]
        } else {
            current = nums[i]
        }
        if current > maxSum {
            maxSum = current
        }
    }
    return maxSum
}
```

**Time:** O(n) — **Space:** O(1)

## Dry Run

Input: `nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`

| i | nums[i] | current | maxSum |
|---|---|---|---|
| 0 | -2 | -2 | -2 |
| 1 | 1 | max(1, -2+1) = 1 | 1 |
| 2 | -3 | max(-3, 1-3) = -2 | 1 |
| 3 | 4 | max(4, -2+4) = 4 | 4 |
| 4 | -1 | max(-1, 4-1) = 3 | 4 |
| 5 | 2 | max(2, 3+2) = 5 | 5 |
| 6 | 1 | max(1, 5+1) = 6 | **6** |
| 7 | -5 | max(-5, 6-5) = 1 | 6 |
| 8 | 4 | max(4, 1+4) = 5 | 6 |

Subarray `[4, -1, 2, 1]` has sum = 6.

## Key Interview Insights

- **Alternative view:** `current = max(nums[i], current + nums[i])` is equivalent to: if `current < 0`, reset to `nums[i]`. A negative prefix never helps.
- **All-negative arrays:** Kadane's handles this correctly — it picks the least negative single element.
- **Return the subarray itself:** Track `start` and `end` indices. Reset `start` when `current` resets to `nums[i]`, update `end` when `maxSum` updates.
- **Follow-up — Divide & Conquer:** Split array in half. Answer is max of (left max, right max, max crossing the midpoint). O(n log n) time. Good for demonstrating recursion knowledge.
- **Related:** Maximum Product Subarray uses a similar scan but tracks both max and min products.
