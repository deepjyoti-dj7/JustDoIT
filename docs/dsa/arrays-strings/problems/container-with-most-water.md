---
title: Container With Most Water
difficulty: Medium
tags: [Array, Two Pointers, Greedy]
link: https://leetcode.com/problems/container-with-most-water/
---

# Container With Most Water

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [11. Container With Most Water](https://leetcode.com/problems/container-with-most-water/) |
| **Tags** | Array, Two Pointers, Greedy |

## Problem Statement

Given `n` non-negative integers `height[0..n-1]` where each represents a vertical line on the x-axis, find two lines that together with the x-axis form a container that holds the most water.

## Intuition

Water between two lines = `min(height[left], height[right]) × (right - left)`. Start with the widest container (left=0, right=n-1) and greedily move the shorter pointer inward — moving the taller one can only reduce width without improving height.

## Approach 1: Brute Force

Try every pair of lines.

```cpp
class Solution {
public:
    int maxArea(vector<int>& height) {
        int maxWater = 0;
        for (int i = 0; i < height.size(); i++) {
            for (int j = i + 1; j < height.size(); j++) {
                int water = min(height[i], height[j]) * (j - i);
                maxWater = max(maxWater, water);
            }
        }
        return maxWater;
    }
};
```

```java
class Solution {
    public int maxArea(int[] height) {
        int maxWater = 0;
        for (int i = 0; i < height.length; i++) {
            for (int j = i + 1; j < height.length; j++) {
                int water = Math.min(height[i], height[j]) * (j - i);
                maxWater = Math.max(maxWater, water);
            }
        }
        return maxWater;
    }
}
```

```typescript
function maxArea(height: number[]): number {
    let maxWater = 0;
    for (let i = 0; i < height.length; i++) {
        for (let j = i + 1; j < height.length; j++) {
            const water = Math.min(height[i], height[j]) * (j - i);
            maxWater = Math.max(maxWater, water);
        }
    }
    return maxWater;
}
```

```python
class Solution:
    def maxArea(self, height: list[int]) -> int:
        max_water = 0
        for i in range(len(height)):
            for j in range(i + 1, len(height)):
                water = min(height[i], height[j]) * (j - i)
                max_water = max(max_water, water)
        return max_water
```

```go
func maxArea(height []int) int {
    maxWater := 0
    for i := 0; i < len(height); i++ {
        for j := i + 1; j < len(height); j++ {
            h := height[i]
            if height[j] < h {
                h = height[j]
            }
            water := h * (j - i)
            if water > maxWater {
                maxWater = water
            }
        }
    }
    return maxWater
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Two Pointers (Optimal)

```cpp
class Solution {
public:
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
};
```

```java
class Solution {
    public int maxArea(int[] height) {
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
class Solution:
    def maxArea(self, height: list[int]) -> int:
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

**Time:** O(n) — **Space:** O(1)

## Why the Greedy Works

The key proof: when we move the shorter pointer, we might miss pairs — but every pair we skip is **provably worse** than one we've already computed.

If `height[left] < height[right]`, then for any `right' < right`:
- Width decreases: `right' - left < right - left`
- Height is still bounded by `height[left]`
- So area with `(left, right')` ≤ area with `(left, right)`

We've already recorded `(left, right)`, so skipping all `(left, right')` is safe.

## Key Interview Insights

- **Don't confuse with Trapping Rain Water.** Container = two lines forming a box. Trapping = rain between all bars.
- **Equal heights:** When `height[left] == height[right]`, moving either pointer is fine. Neither can produce a better result with any inner pair at the current position.
- **This is not a sliding window problem** — the pointers start at opposite ends and move inward, which is the two-pointer pattern.
