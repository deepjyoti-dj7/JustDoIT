---
title: Sort Colors
difficulty: Medium
tags: [Array, Two Pointers, Sorting]
link: https://leetcode.com/problems/sort-colors/
---

# Sort Colors

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [75. Sort Colors](https://leetcode.com/problems/sort-colors/) |
| **Tags** | Array, Two Pointers, Sorting |

## Problem Statement

Given an array `nums` with values only `0`, `1`, and `2` (representing red, white, blue), sort it **in-place** so that all 0s come first, then 1s, then 2s. You must solve this without using the built-in sort function.

**Follow-up:** Can you do it in one pass with O(1) extra space?

## Intuition

This is the classic **Dutch National Flag problem** by Edsger Dijkstra. We have 3 categories to sort in-place with one pass.

**Key insight:** Maintain three regions using two boundary pointers:
- Everything before `low` is `0`
- Everything after `high` is `2`
- Everything between `low` and `high` (inclusive with `mid`) is unknown or `1`

Move pointer `mid` through the array, routing each element to the correct region.

## Approach 1: Two-Pass Counting Sort

Count 0s, 1s, 2s, then overwrite. Simple but uses two passes.

```cpp
class Solution {
public:
    void sortColors(vector<int>& nums) {
        int count[3] = {0};
        for (int x : nums) count[x]++;
        int i = 0;
        for (int color = 0; color < 3; color++)
            while (count[color]-- > 0) nums[i++] = color;
    }
};
```

```java
class Solution {
    public void sortColors(int[] nums) {
        int[] count = new int[3];
        for (int x : nums) count[x]++;
        int i = 0;
        for (int color = 0; color < 3; color++)
            while (count[color]-- > 0) nums[i++] = color;
    }
}
```

```typescript
function sortColors(nums: number[]): void {
    const count = [0, 0, 0];
    for (const x of nums) count[x]++;
    let i = 0;
    for (let color = 0; color < 3; color++)
        while (count[color]-- > 0) nums[i++] = color;
}
```

```python
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        count = [0, 0, 0]
        for x in nums:
            count[x] += 1
        i = 0
        for color in range(3):
            for _ in range(count[color]):
                nums[i] = color
                i += 1
```

```go
func sortColors(nums []int) {
    count := [3]int{}
    for _, x := range nums { count[x]++ }
    i := 0
    for color := 0; color < 3; color++ {
        for count[color] > 0 { nums[i] = color; i++; count[color]-- }
    }
}
```

**Time:** O(n) | **Space:** O(1)

## Approach 2: Dutch National Flag (One Pass, Optimal)

Three-pointer approach. `low`, `mid`, `high` define the boundaries.

- `arr[0..low-1]` = 0s (sorted)
- `arr[low..mid-1]` = 1s (sorted)
- `arr[mid..high]` = unexplored
- `arr[high+1..n-1]` = 2s (sorted)

```
Initial: [2, 0, 2, 1, 1, 0]
          low=0, mid=0, high=5

mid=0: arr[0]=2 → swap(mid, high) → [0, 0, 2, 1, 1, 2], high=4, mid stays
mid=0: arr[0]=0 → swap(low, mid) → [0, 0, 2, 1, 1, 2], low=1, mid=1
mid=1: arr[1]=0 → swap(low, mid) → [0, 0, 2, 1, 1, 2], low=2, mid=2
mid=2: arr[2]=2 → swap(mid, high) → [0, 0, 1, 1, 2, 2], high=3, mid stays
mid=2: arr[2]=1 → mid++, mid=3
mid=3: arr[3]=1 → mid++, mid=4
mid=4 > high=3 → done
Result: [0, 0, 1, 1, 2, 2] ✓
```

```cpp
class Solution {
public:
    void sortColors(vector<int>& nums) {
        int low = 0, mid = 0, high = nums.size() - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                swap(nums[low++], nums[mid++]);
            } else if (nums[mid] == 2) {
                swap(nums[mid], nums[high--]);
                // Don't increment mid: swapped element from high is unexamined
            } else {
                mid++;  // nums[mid] == 1: already in correct region
            }
        }
    }
};
```

```java
class Solution {
    public void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int t = nums[low]; nums[low] = nums[mid]; nums[mid] = t;
                low++; mid++;
            } else if (nums[mid] == 2) {
                int t = nums[mid]; nums[mid] = nums[high]; nums[high] = t;
                high--;
            } else {
                mid++;
            }
        }
    }
}
```

```typescript
function sortColors(nums: number[]): void {
    let low = 0, mid = 0, high = nums.length - 1;
    while (mid <= high) {
        if (nums[mid] === 0) {
            [nums[low], nums[mid]] = [nums[mid], nums[low]];
            low++; mid++;
        } else if (nums[mid] === 2) {
            [nums[mid], nums[high]] = [nums[high], nums[mid]];
            high--;
        } else {
            mid++;
        }
    }
}
```

```python
class Solution:
    def sortColors(self, nums: list[int]) -> None:
        low, mid, high = 0, 0, len(nums) - 1

        while mid <= high:
            if nums[mid] == 0:
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 2:
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1
                # Don't advance mid: the element swapped from high is unexamined
            else:  # nums[mid] == 1
                mid += 1
```

```go
func sortColors(nums []int) {
    low, mid, high := 0, 0, len(nums)-1
    for mid <= high {
        if nums[mid] == 0 {
            nums[low], nums[mid] = nums[mid], nums[low]
            low++; mid++
        } else if nums[mid] == 2 {
            nums[mid], nums[high] = nums[high], nums[mid]
            high--
        } else {
            mid++
        }
    }
}
```

**Time:** O(n) — single pass | **Space:** O(1)

## Key Interview Insights

- **Don't advance `mid` when swapping with `high`.** The element swapped from `high` is unknown — it hasn't been examined yet. You must re-check `nums[mid]` before moving forward.
- **When swapping with `low`, advance both `low` and `mid`.** `nums[low]` was previously examined (it was a `1`), so it's safe to advance `mid`.
- **The invariant is the key.** Before writing code, state the invariant: what each region contains. This prevents off-by-one errors.
- **This generalizes to k-color sorting** with k-1 boundaries, but gets complex. For k > 3, counting sort is cleaner.
