---
title: Binary Search
difficulty: Easy
tags: [Array, Binary Search]
link: https://leetcode.com/problems/binary-search/
---

# Binary Search

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [704. Binary Search](https://leetcode.com/problems/binary-search/) |
| **Tags** | Array, Binary Search |

## Problem Statement

Given a sorted array of distinct integers `nums` and a target value, return the index if the target is found. If not, return `-1`. You must write an algorithm with `O(log n)` runtime complexity.

## Intuition

The sorted property is the key. For any element at position `mid`:
- If `nums[mid] == target` → we're done
- If `nums[mid] < target` → target must be to the right (eliminate left half)
- If `nums[mid] > target` → target must be to the left (eliminate right half)

Each comparison eliminates half the remaining search space → O(log n).

## Approach 1: Iterative (Optimal)

```cpp
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;  // avoids integer overflow

            if (nums[mid] == target) return mid;
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
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
            else if (nums[mid] < target) left = mid + 1;
            else right = mid - 1;
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
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
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
            elif nums[mid] < target:
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
        if nums[mid] < target  { left = mid + 1 } else { right = mid - 1 }
    }
    return -1
}
```

## Approach 2: Recursive

Cleaner to read but uses O(log n) stack space.

```cpp
int search(vector<int>& nums, int target) {
    return helper(nums, target, 0, nums.size() - 1);
}
int helper(vector<int>& nums, int target, int left, int right) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target)  return helper(nums, target, mid + 1, right);
    return helper(nums, target, left, mid - 1);
}
```

```java
public int search(int[] nums, int target) {
    return helper(nums, target, 0, nums.length - 1);
}
int helper(int[] nums, int target, int left, int right) {
    if (left > right) return -1;
    int mid = left + (right - left) / 2;
    if (nums[mid] == target) return mid;
    if (nums[mid] < target)  return helper(nums, target, mid + 1, right);
    return helper(nums, target, left, mid - 1);
}
```

```typescript
function search(nums: number[], target: number): number {
    function helper(left: number, right: number): number {
        if (left > right) return -1;
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target)   return helper(mid + 1, right);
        return helper(left, mid - 1);
    }
    return helper(0, nums.length - 1);
}
```

```python
class Solution:
    def search(self, nums: list[int], target: int) -> int:
        def helper(left: int, right: int) -> int:
            if left > right:
                return -1
            mid = (left + right) // 2
            if nums[mid] == target: return mid
            if nums[mid] < target:  return helper(mid + 1, right)
            return helper(left, mid - 1)

        return helper(0, len(nums) - 1)
```

```go
func search(nums []int, target int) int {
    return bsHelper(nums, target, 0, len(nums)-1)
}
func bsHelper(nums []int, target, left, right int) int {
    if left > right { return -1 }
    mid := left + (right-left)/2
    if nums[mid] == target { return mid }
    if nums[mid] < target  { return bsHelper(nums, target, mid+1, right) }
    return bsHelper(nums, target, left, mid-1)
}
```

## Dry Run

```
nums = [-1, 0, 3, 5, 9, 12],  target = 9

left=0, right=5, mid=2  → nums[2]=3 < 9  → left=3
left=3, right=5, mid=4  → nums[4]=9 == 9 → return 4 ✓

nums = [-1, 0, 3, 5, 9, 12],  target = 2

left=0, right=5, mid=2  → nums[2]=3 > 2  → right=1
left=0, right=1, mid=0  → nums[0]=-1 < 2 → left=1
left=1, right=1, mid=1  → nums[1]=0 < 2  → left=2
left=2 > right=1 → return -1 ✓
```

## Complexity

- **Time:** O(log n) — halve the search space each iteration
- **Space:** O(1) iterative, O(log n) recursive

## Key Interview Insights

- **Always use `left + (right - left) / 2`** for mid in C++/Java to prevent integer overflow when `left + right` exceeds `INT_MAX`.
- **`while left <= right`** (not `<`). When `left == right`, there's one element remaining to check. Without `<=`, you'd miss it.
- **Both updates use `mid ± 1`**. Never `left = mid` or `right = mid` in this template — that can create infinite loops.
- **Distinct elements guarantee** simplifies this problem. Handling duplicates (find first/last occurrence) requires additional logic — see the variants theory file.
