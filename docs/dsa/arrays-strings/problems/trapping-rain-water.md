---
title: Trapping Rain Water
difficulty: Hard
tags: [Array, Two Pointers, Stack, Dynamic Programming]
link: https://leetcode.com/problems/trapping-rain-water/
---

# Trapping Rain Water

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/) |
| **Tags** | Array, Two Pointers, Stack, DP |

## Problem Statement

Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

## Intuition

Water at each index = `min(max_left, max_right) - height[i]`. The water level above any bar is bounded by the shorter of the tallest bars on each side.

The question is how to compute `max_left` and `max_right` efficiently.

## Approach 1: Brute Force

For each position, scan left and right to find the max heights.

```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size(), water = 0;
        for (int i = 0; i < n; i++) {
            int leftMax = 0, rightMax = 0;
            for (int j = 0; j <= i; j++) leftMax = max(leftMax, height[j]);
            for (int j = i; j < n; j++) rightMax = max(rightMax, height[j]);
            water += min(leftMax, rightMax) - height[i];
        }
        return water;
    }
};
```

```java
class Solution {
    public int trap(int[] height) {
        int n = height.length, water = 0;
        for (int i = 0; i < n; i++) {
            int leftMax = 0, rightMax = 0;
            for (int j = 0; j <= i; j++) leftMax = Math.max(leftMax, height[j]);
            for (int j = i; j < n; j++) rightMax = Math.max(rightMax, height[j]);
            water += Math.min(leftMax, rightMax) - height[i];
        }
        return water;
    }
}
```

```typescript
function trap(height: number[]): number {
    const n = height.length;
    let water = 0;
    for (let i = 0; i < n; i++) {
        let leftMax = 0, rightMax = 0;
        for (let j = 0; j <= i; j++) leftMax = Math.max(leftMax, height[j]);
        for (let j = i; j < n; j++) rightMax = Math.max(rightMax, height[j]);
        water += Math.min(leftMax, rightMax) - height[i];
    }
    return water;
}
```

```python
class Solution:
    def trap(self, height: list[int]) -> int:
        n = len(height)
        water = 0
        for i in range(n):
            left_max = max(height[:i + 1])
            right_max = max(height[i:])
            water += min(left_max, right_max) - height[i]
        return water
```

```go
func trap(height []int) int {
    n := len(height)
    water := 0
    for i := 0; i < n; i++ {
        leftMax, rightMax := 0, 0
        for j := 0; j <= i; j++ {
            if height[j] > leftMax { leftMax = height[j] }
        }
        for j := i; j < n; j++ {
            if height[j] > rightMax { rightMax = height[j] }
        }
        water += min(leftMax, rightMax) - height[i]
    }
    return water
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Prefix/Suffix Max Arrays

Precompute `leftMax[i]` and `rightMax[i]` arrays.

```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        int n = height.size();
        if (n == 0) return 0;

        vector<int> leftMax(n), rightMax(n);
        leftMax[0] = height[0];
        for (int i = 1; i < n; i++) {
            leftMax[i] = max(leftMax[i - 1], height[i]);
        }
        rightMax[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            rightMax[i] = max(rightMax[i + 1], height[i]);
        }

        int water = 0;
        for (int i = 0; i < n; i++) {
            water += min(leftMax[i], rightMax[i]) - height[i];
        }
        return water;
    }
};
```

```java
class Solution {
    public int trap(int[] height) {
        int n = height.length;
        if (n == 0) return 0;

        int[] leftMax = new int[n], rightMax = new int[n];
        leftMax[0] = height[0];
        for (int i = 1; i < n; i++) {
            leftMax[i] = Math.max(leftMax[i - 1], height[i]);
        }
        rightMax[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            rightMax[i] = Math.max(rightMax[i + 1], height[i]);
        }

        int water = 0;
        for (int i = 0; i < n; i++) {
            water += Math.min(leftMax[i], rightMax[i]) - height[i];
        }
        return water;
    }
}
```

```typescript
function trap(height: number[]): number {
    const n = height.length;
    if (n === 0) return 0;

    const leftMax = new Array(n), rightMax = new Array(n);
    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    }
    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    }

    let water = 0;
    for (let i = 0; i < n; i++) {
        water += Math.min(leftMax[i], rightMax[i]) - height[i];
    }
    return water;
}
```

```python
class Solution:
    def trap(self, height: list[int]) -> int:
        n = len(height)
        if n == 0:
            return 0

        left_max = [0] * n
        right_max = [0] * n
        left_max[0] = height[0]
        for i in range(1, n):
            left_max[i] = max(left_max[i - 1], height[i])
        right_max[n - 1] = height[n - 1]
        for i in range(n - 2, -1, -1):
            right_max[i] = max(right_max[i + 1], height[i])

        return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))
```

```go
func trap(height []int) int {
    n := len(height)
    if n == 0 {
        return 0
    }

    leftMax := make([]int, n)
    rightMax := make([]int, n)
    leftMax[0] = height[0]
    for i := 1; i < n; i++ {
        leftMax[i] = max(leftMax[i-1], height[i])
    }
    rightMax[n-1] = height[n-1]
    for i := n - 2; i >= 0; i-- {
        rightMax[i] = max(rightMax[i+1], height[i])
    }

    water := 0
    for i := 0; i < n; i++ {
        water += min(leftMax[i], rightMax[i]) - height[i]
    }
    return water
}
```

**Time:** O(n) — **Space:** O(n)

## Approach 3: Two Pointers (Optimal)

Eliminate the extra arrays. Use two pointers from opposite ends, tracking `leftMax` and `rightMax` as we go.

**Key insight:** We process the side with the smaller max. If `leftMax < rightMax`, water at `left` is determined by `leftMax` (the right side is guaranteed tall enough).

```cpp
class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = max(leftMax, height[left]);
                water += leftMax - height[left];
                left++;
            } else {
                rightMax = max(rightMax, height[right]);
                water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
};
```

```java
class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left];
                left++;
            } else {
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}
```

```typescript
function trap(height: number[]): number {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            leftMax = Math.max(leftMax, height[left]);
            water += leftMax - height[left];
            left++;
        } else {
            rightMax = Math.max(rightMax, height[right]);
            water += rightMax - height[right];
            right--;
        }
    }
    return water;
}
```

```python
class Solution:
    def trap(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        left_max = right_max = 0
        water = 0

        while left < right:
            if height[left] < height[right]:
                left_max = max(left_max, height[left])
                water += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                water += right_max - height[right]
                right -= 1

        return water
```

```go
func trap(height []int) int {
    left, right := 0, len(height)-1
    leftMax, rightMax := 0, 0
    water := 0

    for left < right {
        if height[left] < height[right] {
            if height[left] > leftMax {
                leftMax = height[left]
            }
            water += leftMax - height[left]
            left++
        } else {
            if height[right] > rightMax {
                rightMax = height[right]
            }
            water += rightMax - height[right]
            right--
        }
    }
    return water
}
```

**Time:** O(n) — **Space:** O(1)

## Why Two Pointers Works

When `height[left] < height[right]`:
- We know `rightMax >= height[right] > height[left]`
- So `min(leftMax, rightMax) = leftMax` for this position
- Water at `left` = `leftMax - height[left]`
- We don't need to know the exact `rightMax` — just that it's tall enough

Symmetric logic applies when processing from the right.

## Key Interview Insights

- **Three approaches = three complexity tradeoffs.** Show the progression from O(n²) → O(n)/O(n) → O(n)/O(1).
- **Don't confuse with Container With Most Water.** Container finds the most water between two lines. Trapping sums water above all bars.
- **Stack-based approach also exists:** Use a monotonic stack to compute water layer by layer. O(n) time and O(n) space. Useful when you're already comfortable with monotonic stacks.
- **The two-pointer approach** uses the same "process the smaller side" logic as Container With Most Water, but for a different purpose.
