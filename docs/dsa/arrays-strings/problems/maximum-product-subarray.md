---
title: Maximum Product Subarray
difficulty: Medium
tags: [Array, Dynamic Programming]
link: https://leetcode.com/problems/maximum-product-subarray/
---

# Maximum Product Subarray

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) |
| **Tags** | Array, Dynamic Programming |

## Problem Statement

Given an integer array `nums`, find the contiguous subarray within the array that has the largest product, and return that product.

## Intuition

This is similar to Maximum Subarray (Kadane's), but multiplication has a twist: **a negative × negative = positive**. So the minimum product ending here could become the maximum after multiplying by a negative number.

Track **both** the current max and current min at each step.

## Approach 1: Brute Force

Try all subarrays.

```cpp
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int result = nums[0];
        for (int i = 0; i < nums.size(); i++) {
            int product = 1;
            for (int j = i; j < nums.size(); j++) {
                product *= nums[j];
                result = max(result, product);
            }
        }
        return result;
    }
};
```

```java
class Solution {
    public int maxProduct(int[] nums) {
        int result = nums[0];
        for (int i = 0; i < nums.length; i++) {
            int product = 1;
            for (int j = i; j < nums.length; j++) {
                product *= nums[j];
                result = Math.max(result, product);
            }
        }
        return result;
    }
}
```

```typescript
function maxProduct(nums: number[]): number {
    let result = nums[0];
    for (let i = 0; i < nums.length; i++) {
        let product = 1;
        for (let j = i; j < nums.length; j++) {
            product *= nums[j];
            result = Math.max(result, product);
        }
    }
    return result;
}
```

```python
class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        result = nums[0]
        for i in range(len(nums)):
            product = 1
            for j in range(i, len(nums)):
                product *= nums[j]
                result = max(result, product)
        return result
```

```go
func maxProduct(nums []int) int {
    result := nums[0]
    for i := 0; i < len(nums); i++ {
        product := 1
        for j := i; j < len(nums); j++ {
            product *= nums[j]
            if product > result {
                result = product
            }
        }
    }
    return result
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Track Max and Min (Optimal)

At each index, compute:
- `curMax = max(nums[i], curMax * nums[i], curMin * nums[i])`
- `curMin = min(nums[i], curMax * nums[i], curMin * nums[i])`

The min is tracked because a large negative can flip to a large positive with one more negative.

```cpp
class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int curMax = nums[0], curMin = nums[0], result = nums[0];
        for (int i = 1; i < nums.size(); i++) {
            int temp = curMax;
            curMax = max({nums[i], curMax * nums[i], curMin * nums[i]});
            curMin = min({nums[i], temp * nums[i], curMin * nums[i]});
            result = max(result, curMax);
        }
        return result;
    }
};
```

```java
class Solution {
    public int maxProduct(int[] nums) {
        int curMax = nums[0], curMin = nums[0], result = nums[0];
        for (int i = 1; i < nums.length; i++) {
            int temp = curMax;
            curMax = Math.max(nums[i], Math.max(curMax * nums[i], curMin * nums[i]));
            curMin = Math.min(nums[i], Math.min(temp * nums[i], curMin * nums[i]));
            result = Math.max(result, curMax);
        }
        return result;
    }
}
```

```typescript
function maxProduct(nums: number[]): number {
    let curMax = nums[0], curMin = nums[0], result = nums[0];
    for (let i = 1; i < nums.length; i++) {
        const temp = curMax;
        curMax = Math.max(nums[i], curMax * nums[i], curMin * nums[i]);
        curMin = Math.min(nums[i], temp * nums[i], curMin * nums[i]);
        result = Math.max(result, curMax);
    }
    return result;
}
```

```python
class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        cur_max = cur_min = result = nums[0]
        for i in range(1, len(nums)):
            temp = cur_max
            cur_max = max(nums[i], cur_max * nums[i], cur_min * nums[i])
            cur_min = min(nums[i], temp * nums[i], cur_min * nums[i])
            result = max(result, cur_max)
        return result
```

```go
func maxProduct(nums []int) int {
    curMax, curMin, result := nums[0], nums[0], nums[0]
    for i := 1; i < len(nums); i++ {
        temp := curMax
        curMax = max(nums[i], max(curMax*nums[i], curMin*nums[i]))
        curMin = min(nums[i], min(temp*nums[i], curMin*nums[i]))
        result = max(result, curMax)
    }
    return result
}
```

**Time:** O(n) — **Space:** O(1)

## Dry Run

Input: `nums = [2, 3, -2, 4]`

| i | nums[i] | curMax | curMin | result |
|---|---|---|---|---|
| 0 | 2 | 2 | 2 | 2 |
| 1 | 3 | max(3, 6, 6)=6 | min(3, 6, 6)=3 | 6 |
| 2 | -2 | max(-2, -12, -6)=-2 | min(-2, -12, -6)=-12 | 6 |
| 3 | 4 | max(4, -8, -48)=4 | min(4, -8, -48)=-48 | **6** |

Result: `6` from subarray `[2, 3]`.

## Key Interview Insights

- **Critical: save `curMax` in a temp variable** before updating. Otherwise `curMin` uses the already-updated `curMax`.
- **Zeros reset everything.** When `nums[i] = 0`, both `curMax` and `curMin` reset to 0. The `max(nums[i], ...)` ensures we can start fresh from the next element.
- **Why not just Kadane's?** Kadane's drops negative prefixes. But in products, a negative prefix might become positive with another negative number later.
- **Alternative approach:** Two passes — prefix product from left, prefix product from right. The answer is the maximum of all prefix/suffix products. Zeros naturally divide the array into segments.
