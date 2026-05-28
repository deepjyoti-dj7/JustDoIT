---
title: Find Minimum in Rotated Sorted Array
difficulty: Medium
tags: [Array, Binary Search]
link: https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
---

# Find Minimum in Rotated Sorted Array

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [153. Find Minimum in Rotated Sorted Array](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| **Tags** | Array, Binary Search |

## Problem Statement

Given a sorted array of unique elements rotated at some pivot, find the minimum element in O(log n) time.

## Intuition

The minimum is at the **rotation point** — where the sorted order breaks. In binary search, the minimum is in the **unsorted half** (or at `mid` if `mid` is the pivot).

The key invariant: compare `nums[mid]` with `nums[right]`:
- If `nums[mid] > nums[right]` → minimum is in the right half
- If `nums[mid] <= nums[right]` → minimum is in the left half (including mid)

## Approach 1: Linear Scan

```cpp
class Solution {
public:
    int findMin(vector<int>& nums) {
        int minVal = nums[0];
        for (int num : nums) {
            minVal = min(minVal, num);
        }
        return minVal;
    }
};
```

```java
class Solution {
    public int findMin(int[] nums) {
        int minVal = nums[0];
        for (int num : nums) {
            minVal = Math.min(minVal, num);
        }
        return minVal;
    }
}
```

```typescript
function findMin(nums: number[]): number {
    return Math.min(...nums);
}
```

```python
class Solution:
    def findMin(self, nums: list[int]) -> int:
        return min(nums)
```

```go
func findMin(nums []int) int {
    minVal := nums[0]
    for _, v := range nums {
        if v < minVal {
            minVal = v
        }
    }
    return minVal
}
```

**Time:** O(n) — **Space:** O(1)

## Approach 2: Binary Search (Optimal)

```cpp
class Solution {
public:
    int findMin(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                left = mid + 1; // min is in right half
            } else {
                right = mid; // min is in left half (including mid)
            }
        }
        return nums[left];
    }
};
```

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return nums[left];
    }
}
```

```typescript
function findMin(nums: number[]): number {
    let left = 0, right = nums.length - 1;

    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid] > nums[right]) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return nums[left];
}
```

```python
class Solution:
    def findMin(self, nums: list[int]) -> int:
        left, right = 0, len(nums) - 1

        while left < right:
            mid = (left + right) // 2

            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid

        return nums[left]
```

```go
func findMin(nums []int) int {
    left, right := 0, len(nums)-1

    for left < right {
        mid := left + (right-left)/2

        if nums[mid] > nums[right] {
            left = mid + 1
        } else {
            right = mid
        }
    }
    return nums[left]
}
```

**Time:** O(log n) — **Space:** O(1)

## Dry Run

Input: `nums = [3, 4, 5, 1, 2]`

| Step | left | right | mid | nums[mid] vs nums[right] | Action |
|---|---|---|---|---|---|
| 1 | 0 | 4 | 2 | 5 > 2 | min is right → left = 3 |
| 2 | 3 | 4 | 3 | 1 < 2 | min is left (incl mid) → right = 3 |
| 3 | left == right = 3 | | | | Return nums[3] = **1** |

## Key Interview Insights

- **Why compare with `nums[right]` not `nums[left]`?** Comparing with `nums[left]` doesn't work when the array isn't rotated (`[1,2,3,4]`). Comparing with `nums[right]` correctly handles both rotated and non-rotated cases.
- **`left < right` not `left <= right`:** We're searching for a position, not a value. When `left == right`, we've converged on the answer.
- **`right = mid` not `right = mid - 1`:** Since `nums[mid]` could be the minimum, we can't exclude it.
- **With duplicates (LC 154):** When `nums[mid] == nums[right]`, we can't decide. Do `right--` to safely shrink. Worst case O(n).
