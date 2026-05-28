---
title: Two Pointers
description: Using two indices to solve array and string problems efficiently
---

# Two Pointers

Two pointers is one of the most versatile patterns in all of DSA. The idea is simple: use two indices that move through the data structure according to some rule, reducing O(n²) brute force to O(n).

## Core Intuition

Instead of checking every pair `(i, j)` with nested loops, two pointers exploit a **monotonic property** — knowing the relationship between the pointers tells you which direction to move.

**There are three flavors:**

| Variant | Pointer Setup | Movement | Classic Use Case |
|---|---|---|---|
| Opposite ends | `left = 0, right = n-1` | Move inward | Two Sum (sorted), Container With Most Water |
| Same direction | `slow = 0, fast = 0` | Both move right | Remove duplicates, Linked list cycle |
| From different inputs | One in each array | Condition-based | Merge sorted arrays |

## When to Use Two Pointers

**Identification signals:**
- Array is **sorted** (or should be sorted first)
- Need to find **pairs** with a target sum/difference
- Need to **partition** or **rearrange** in-place
- "Container" or "area" problems on sorted/indexed data
- Comparing elements from **both ends**

**NOT two pointers when:**
- Need all pairs (output is O(n²) anyway)
- No ordering or monotonic property to exploit
- Problem involves arbitrary subsets (→ backtracking)

## Opposite-End Pointers

Start from both ends, move inward based on a comparison.

### Template: Two Sum on Sorted Array

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            return {left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {-1, -1};
}
```

```java
int[] twoSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            return new int[]{left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{-1, -1};
}
```

```typescript
function twoSum(nums: number[], target: number): number[] {
    let left = 0, right = nums.length - 1;
    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return [-1, -1];
}
```

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        elif total < target:
            left += 1
        else:
            right -= 1
    return [-1, -1]
```

```go
func twoSum(nums []int, target int) []int {
    left, right := 0, len(nums)-1
    for left < right {
        sum := nums[left] + nums[right]
        if sum == target {
            return []int{left, right}
        } else if sum < target {
            left++
        } else {
            right--
        }
    }
    return []int{-1, -1}
}
```

**Why it works:** If the sum is too small, moving `left` right increases it (array is sorted). If too large, moving `right` left decreases it. Each step eliminates a row or column from the search space.

### Template: Container With Most Water

```cpp
int maxArea(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxWater = 0;
    while (left < right) {
        int water = min(height[left], height[right]) * (right - left);
        maxWater = max(maxWater, water);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxWater;
}
```

```java
int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxWater = 0;
    while (left < right) {
        int water = Math.min(height[left], height[right]) * (right - left);
        maxWater = Math.max(maxWater, water);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxWater;
}
```

```typescript
function maxArea(height: number[]): number {
    let left = 0, right = height.length - 1;
    let maxWater = 0;
    while (left < right) {
        const water = Math.min(height[left], height[right]) * (right - left);
        maxWater = Math.max(maxWater, water);
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return maxWater;
}
```

```python
def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        water = min(height[left], height[right]) * (right - left)
        max_water = max(max_water, water)
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water
```

```go
func maxArea(height []int) int {
    left, right := 0, len(height)-1
    maxWater := 0
    for left < right {
        h := height[left]
        if height[right] < h {
            h = height[right]
        }
        water := h * (right - left)
        if water > maxWater {
            maxWater = water
        }
        if height[left] < height[right] {
            left++
        } else {
            right--
        }
    }
    return maxWater
}
```

**Why move the shorter side?** The area is limited by the shorter bar. Moving the taller bar can only decrease or maintain the width while the height stays bottlenecked. Moving the shorter bar at least gives a chance to find a taller one.

## Same-Direction (Fast & Slow) Pointers

Both pointers start at the beginning. The fast pointer explores ahead while the slow pointer marks a "write" position or boundary.

### Template: Remove Duplicates from Sorted Array

```cpp
int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.size(); fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}
```

```java
int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}
```

```typescript
function removeDuplicates(nums: number[]): number {
    if (nums.length === 0) return 0;
    let slow = 0;
    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}
```

```python
def remove_duplicates(nums: list[int]) -> int:
    if not nums:
        return 0
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1
```

```go
func removeDuplicates(nums []int) int {
    if len(nums) == 0 {
        return 0
    }
    slow := 0
    for fast := 1; fast < len(nums); fast++ {
        if nums[fast] != nums[slow] {
            slow++
            nums[slow] = nums[fast]
        }
    }
    return slow + 1
}
```

## Three Pointers (3Sum Pattern)

Fix one element, then run two-pointer on the remaining sorted array:

1. Sort the array
2. For each element `i`, run two-sum with `left = i+1, right = n-1`
3. Skip duplicates at all three levels

This reduces 3Sum from O(n³) brute force to O(n²).

## Handling Duplicates

Duplicates are the #1 source of bugs in two-pointer problems. The strategy:

- **Skip duplicates for the outer pointer** — after processing `nums[i]`, advance past all equal elements
- **Skip duplicates for inner pointers** — after finding a valid pair, advance both `left` and `right` past duplicates

```cpp
// Skip duplicates pattern
while (left < right && nums[left] == nums[left + 1]) left++;
while (left < right && nums[right] == nums[right - 1]) right--;
left++;
right--;
```

## Common Pitfalls

1. **Forgetting to sort** — Two-pointer on an unsorted array doesn't give correct results for sum problems.
2. **Infinite loops** — Always ensure at least one pointer moves in every iteration.
3. **Wrong pointer to move** — Moving the wrong pointer breaks the monotonic invariant.
4. **Duplicate handling** — Missing duplicate skips leads to duplicate results.
5. **Modifying while iterating** — The slow/fast pattern handles this, but be careful with swaps.

## Complexity Analysis

| Approach | Time | Space |
|---|---|---|
| Brute force pairs | O(n²) | O(1) |
| Two pointers (sorted) | O(n) | O(1) |
| Two pointers (need sort) | O(n log n) | O(1)–O(n) |
| 3Sum with two pointers | O(n²) | O(1) |
| 4Sum with two pointers | O(n³) | O(1) |

## Interview Problem Map

| Problem | Variant | Key Insight |
|---|---|---|
| Two Sum II (sorted) | Opposite ends | Move based on sum comparison |
| 3Sum | Fix + opposite ends | Sort + skip duplicates |
| Container With Most Water | Opposite ends | Move shorter bar |
| Trapping Rain Water | Opposite ends | Move towards smaller max |
| Remove Duplicates | Same direction | Slow writes, fast reads |
| Move Zeroes | Same direction | Swap non-zeros to front |
| Sort Colors | Three pointers | Dutch flag partitioning |
| Valid Palindrome | Opposite ends | Skip non-alphanumeric |
| Merge Sorted Arrays | Two inputs | Fill from the back |
