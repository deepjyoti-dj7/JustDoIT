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

Suppose an array of length `n` sorted in ascending order is rotated between `1` and `n` times. Given the sorted rotated array `nums` of unique elements, return the minimum element.

You must write an algorithm that runs in `O(log n)` time.

## Intuition

The minimum element is the **pivot** — the only element smaller than its predecessor. Everything before the pivot is the "right-rotated" chunk (higher values), and everything from the pivot onward is the "left-rotated" chunk (lower values).

```
Original:  [1, 2, 3, 4, 5, 6, 7]
Rotated:   [4, 5, 6, 7, 1, 2, 3]
                      ^
                    pivot (minimum)

Left portion [4,5,6,7]: all greater than pivot
Right portion [1,2,3]: sorted, minimum is at start
```

**Key observation:** Compare `nums[mid]` with `nums[right]`:
- `nums[mid] > nums[right]` → the pivot (minimum) is somewhere in `[mid+1, right]`. The left portion is fully above the right portion.
- `nums[mid] <= nums[right]` → `nums[mid]` could be the minimum, or the minimum is to its left. Don't exclude `mid`.

## Approach

```cpp
class Solution {
public:
    int findMin(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                left = mid + 1;   // minimum is strictly to the right of mid
            } else {
                right = mid;      // nums[mid] might be the minimum
            }
        }
        return nums[left];  // left == right == index of minimum
    }
};
```

```java
class Solution {
    public int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) left = mid + 1;
            else right = mid;
        }
        return nums[left];
    }
}
```

```typescript
function findMin(nums: number[]): number {
    let left = 0, right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] > nums[right]) left = mid + 1;
        else right = mid;
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
                left = mid + 1  # minimum is in right portion
            else:
                right = mid     # nums[mid] could be the minimum

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

## Dry Run

```
nums = [3, 4, 5, 1, 2]

left=0, right=4, mid=2
  nums[2]=5 > nums[4]=2 → left = 3

left=3, right=4, mid=3
  nums[3]=1 <= nums[4]=2 → right = 3

left=3, right=3 → exit loop
return nums[3] = 1 ✓

---

nums = [4, 5, 6, 7, 0, 1, 2]

left=0, right=6, mid=3
  nums[3]=7 > nums[6]=2 → left = 4

left=4, right=6, mid=5
  nums[5]=1 <= nums[6]=2 → right = 5

left=4, right=5, mid=4
  nums[4]=0 <= nums[5]=1 → right = 4

left=4, right=4 → exit
return nums[4] = 0 ✓

---

nums = [1, 2, 3] (not rotated)

left=0, right=2, mid=1
  nums[1]=2 <= nums[2]=3 → right = 1

left=0, right=1, mid=0
  nums[0]=1 <= nums[1]=2 → right = 0

left=0, right=0 → exit
return nums[0] = 1 ✓
```

## Why Compare With `nums[right]`, Not `nums[left]`?

Comparing `nums[mid]` with `nums[left]` doesn't tell us where the minimum is:
- If `nums[mid] > nums[left]`, the minimum could be to the right OR `nums[left]` itself is the minimum (no rotation case).

Comparing `nums[mid]` with `nums[right]` is unambiguous:
- `nums[mid] > nums[right]` → there's a "drop" between `mid` and `right` → minimum is in `[mid+1, right]`
- `nums[mid] <= nums[right]` → no drop in `[mid, right]` → minimum is in `[left, mid]`

## Complexity

- **Time:** O(log n) — binary search
- **Space:** O(1)

## Follow-up: Duplicates Allowed (LC 154)

When duplicates exist and `nums[mid] == nums[right]`, we can't determine which side the minimum is on. Fall back to `right--` (decrement right by 1). This degrades worst case to O(n) for arrays like `[1, 1, 1, 0, 1]`.

```cpp
int findMin(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if      (nums[mid] > nums[right]) left = mid + 1;
        else if (nums[mid] < nums[right]) right = mid;
        else                              right--;  // can't tell: shrink
    }
    return nums[left];
}
```

```java
public int findMin(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if      (nums[mid] > nums[right]) left = mid + 1;
        else if (nums[mid] < nums[right]) right = mid;
        else                              right--;
    }
    return nums[left];
}
```

```typescript
function findMin(nums: number[]): number {
    let left = 0, right = nums.length - 1;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if      (nums[mid] > nums[right]) left = mid + 1;
        else if (nums[mid] < nums[right]) right = mid;
        else                              right--;
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
            elif nums[mid] < nums[right]:
                right = mid
            else:               # nums[mid] == nums[right]: can't tell
                right -= 1      # shrink right by 1 (safe: worst case O(n))

        return nums[left]
```

```go
func findMin(nums []int) int {
    left, right := 0, len(nums)-1
    for left < right {
        mid := left + (right-left)/2
        if      nums[mid] > nums[right] { left = mid + 1 }
        else if nums[mid] < nums[right] { right = mid }
        else                            { right-- }
    }
    return nums[left]
}
```

## Connection to LC 33

In LC 33 (Search in Rotated Array), you first conceptually find the minimum (pivot) to determine which half is sorted. This problem isolates that sub-task. Understanding LC 153 deeply makes LC 33 easier to reason about.
