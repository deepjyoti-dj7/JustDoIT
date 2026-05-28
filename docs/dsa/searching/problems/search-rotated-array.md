---
title: Search in Rotated Sorted Array
difficulty: Medium
tags: [Array, Binary Search]
link: https://leetcode.com/problems/search-in-rotated-sorted-array/
---

# Search in Rotated Sorted Array

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [33. Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/) |
| **Tags** | Array, Binary Search |

## Problem Statement

There is an integer array `nums` sorted in ascending order (with distinct values). Before being passed to your function, `nums` is possibly rotated at an unknown pivot index `k` such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]`.

Given the rotated array `nums` and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not.

You must write an algorithm with `O(log n)` runtime complexity.

## Intuition

After rotation, the array is no longer globally sorted. But after computing `mid`, one critical observation holds:

**At least one half of `[left, mid]` or `[mid, right]` is always completely sorted.**

This is because the rotation point (discontinuity) can only be in one half. The other half has no discontinuity, so it's sorted.

Identify which half is sorted, then check if `target` lies within that sorted range. If yes, search there. If no, search the other half.

```
[4, 5, 6, 7, 0, 1, 2]  (rotated at index 4)
      ^         ^
   left=0     right=6

mid=3 → arr[3]=7
arr[left]=4 <= arr[mid]=7 → LEFT HALF [4,5,6,7] IS SORTED
Is target=0 in [4, 7]? NO → search right half
```

## Approach

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;

            // Check which half is sorted
            if (nums[left] <= nums[mid]) {
                // Left half [left..mid] is sorted
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;  // target is in sorted left half
                } else {
                    left = mid + 1;   // target is in right half
                }
            } else {
                // Right half [mid..right] is sorted
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;   // target is in sorted right half
                } else {
                    right = mid - 1;  // target is in left half
                }
            }
        }
        return -1;
    }
};
```

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;

            if (nums[left] <= nums[mid]) {  // left half sorted
                if (nums[left] <= target && target < nums[mid])
                    right = mid - 1;
                else
                    left = mid + 1;
            } else {                          // right half sorted
                if (nums[mid] < target && target <= nums[right])
                    left = mid + 1;
                else
                    right = mid - 1;
            }
        }
        return -1;
    }
}
```

```typescript
function search(nums: number[], target: number): number {
    let left = 0, right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) return mid;

        if (nums[left] <= nums[mid]) {  // left half sorted
            if (nums[left] <= target && target < nums[mid])
                right = mid - 1;
            else
                left = mid + 1;
        } else {                         // right half sorted
            if (nums[mid] < target && target <= nums[right])
                left = mid + 1;
            else
                right = mid - 1;
        }
    }
    return -1;
}
```

```python
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        left, right = 0, len(nums) - 1

        while left <= right:
            mid = (left + right) // 2

            if nums[mid] == target:
                return mid

            if nums[left] <= nums[mid]:  # left half is sorted
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:                         # right half is sorted
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1

        return -1
```

```go
func search(nums []int, target int) int {
    left, right := 0, len(nums)-1

    for left <= right {
        mid := left + (right-left)/2

        if nums[mid] == target { return mid }

        if nums[left] <= nums[mid] {  // left half sorted
            if nums[left] <= target && target < nums[mid] {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {  // right half sorted
            if nums[mid] < target && target <= nums[right] {
                left = mid + 1
            } else {
                right = mid - 1
            }
        }
    }
    return -1
}
```

## Dry Run

```
nums = [4, 5, 6, 7, 0, 1, 2],  target = 0

Step 1: left=0, right=6, mid=3
  nums[3]=7, not target
  nums[0]=4 <= nums[3]=7 → left half sorted
  Is 0 in [4..7)? No → left = 4

Step 2: left=4, right=6, mid=5
  nums[5]=1, not target
  nums[4]=0 <= nums[5]=1 → left half sorted
  Is 0 in [0..1)? Yes (0 is in [0,1)) → right = 4

Step 3: left=4, right=4, mid=4
  nums[4]=0 == target → return 4 ✓
```

## Why `nums[left] <= nums[mid]` (not `<`)?

When `left == mid` (single element), `nums[left] == nums[mid]`. Using `<=` correctly identifies this as "left half sorted" (trivially), and the range check `nums[left] <= target < nums[mid]` correctly evaluates to `false` (empty range), directing us to the right.

## Complexity

- **Time:** O(log n)
- **Space:** O(1)

## Follow-up: Duplicates Allowed (LC 81)

When duplicates are allowed (`nums[left] == nums[mid]`), we can't determine which half is sorted. Handle by simply incrementing `left` (shrink the window by 1, not by half). Worst case degrades to O(n) when all elements are equal.

```cpp
// Key modification for duplicates (LC 81):
if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
    left++;
    right--;
}
// ... rest of logic remains the same
```

```java
// Key modification for duplicates (LC 81):
if (nums[left] == nums[mid] && nums[mid] == nums[right]) {
    left++;
    right--;
}
// ... rest of logic remains the same
```

```typescript
// Key modification for duplicates (LC 81):
if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
    left++;
    right--;
}
// ... rest of logic remains the same
```

```python
# Key modification for duplicates:
if nums[left] == nums[mid] == nums[right]:
    left += 1
    right -= 1
# ... rest of logic remains the same
```

```go
// Key modification for duplicates (LC 81):
if nums[left] == nums[mid] && nums[mid] == nums[right] {
    left++
    right--
}
// ... rest of logic remains the same
```
