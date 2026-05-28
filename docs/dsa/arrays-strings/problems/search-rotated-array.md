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

Given a sorted array rotated at some pivot (e.g., `[4,5,6,7,0,1,2]`), search for `target` in O(log n) time. Return its index or -1.

## Intuition

Even though the array is rotated, **one half is always sorted**. At each binary search step, determine which half is sorted, then check if the target falls within that sorted half.

## Approach 1: Brute Force (Linear Search)

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] == target) return i;
        }
        return -1;
    }
};
```

```java
class Solution {
    public int search(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] == target) return i;
        }
        return -1;
    }
}
```

```typescript
function search(nums: number[], target: number): number {
    return nums.indexOf(target);
}
```

```python
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        return nums.index(target) if target in nums else -1
```

```go
func search(nums []int, target int) int {
    for i, v := range nums {
        if v == target {
            return i
        }
    }
    return -1
}
```

**Time:** O(n) — **Space:** O(1)

## Approach 2: Modified Binary Search (Optimal)

At each step:
1. Check if `mid` is the target
2. Determine which half is sorted (`left` to `mid` or `mid` to `right`)
3. Check if target is in the sorted half — if yes, search there; otherwise, search the other half

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;

            // Left half is sorted
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
            // Right half is sorted
            else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
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

            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            } else {
                if (nums[mid] < target && target <= nums[right]) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
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
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid] === target) return mid;

        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
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

            # Left half is sorted
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            # Right half is sorted
            else:
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

        if nums[mid] == target {
            return mid
        }

        if nums[left] <= nums[mid] {
            if nums[left] <= target && target < nums[mid] {
                right = mid - 1
            } else {
                left = mid + 1
            }
        } else {
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

**Time:** O(log n) — **Space:** O(1)

## Dry Run

Input: `nums = [4, 5, 6, 7, 0, 1, 2]`, `target = 0`

| Step | left | right | mid | nums[mid] | Sorted half | Action |
|---|---|---|---|---|---|---|
| 1 | 0 | 6 | 3 | 7 | Left [4,5,6,7] | 0 not in [4,7] → search right |
| 2 | 4 | 6 | 5 | 1 | Right [1,2] | 0 not in (1,2] → search left |
| 3 | 4 | 4 | 4 | 0 | Found! | Return 4 |

## Key Interview Insights

- **The `<=` in `nums[left] <= nums[mid]`** handles the case when `left == mid` (two-element subarray). Without `=`, you'd incorrectly classify the sorted half.
- **Strict vs inclusive bounds:** Left sorted check: `nums[left] <= target < nums[mid]`. Right sorted check: `nums[mid] < target <= nums[right]`. Getting these wrong is the #1 bug.
- **With duplicates (LC 81):** When `nums[left] == nums[mid]`, you can't determine which half is sorted. Fall back to `left++`. Worst case becomes O(n).
- **Relation to Find Minimum:** Find minimum finds the pivot. Search uses the same sorted-half logic but targets a specific value.
