---
title: Largest Rectangle in Histogram
difficulty: Hard
tags: [Stack, Array, Monotonic Stack]
link: https://leetcode.com/problems/largest-rectangle-in-histogram/
---

# Largest Rectangle in Histogram

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) |
| **Tags** | Array, Stack, Monotonic Stack |

## Problem Statement

Given an array of integers `heights` representing the heights of bars in a histogram (each bar has width 1), return the area of the **largest rectangle** that can be formed in the histogram.

Example: `heights = [2, 1, 5, 6, 2, 3]` → **10** (the rectangle spanning bars 3–4 at height 5)

## Intuition

For each bar `i`, the largest rectangle it can be part of extends as far left and right as the bar can "support" (i.e., as long as adjacent bars are at least as tall). The width is bounded by the **nearest shorter bar** on each side.

**For each bar `i`:** area = `heights[i] × (rightBound[i] - leftBound[i] - 1)`

Where `rightBound[i]` = index of the first bar shorter than `heights[i]` to the right (or n), and `leftBound[i]` = index of the first bar shorter than `heights[i]` to the left (or -1).

This is a **two-sided monotonic stack** problem.

## Approach 1: Brute Force — O(n²)

For each bar, expand left and right tracking the minimum height.

```cpp
int largestRectangleArea(vector<int>& heights) {
    int n = heights.size(), maxArea = 0;
    for (int i = 0; i < n; i++) {
        int minH = heights[i];
        for (int j = i; j < n; j++) {
            minH = min(minH, heights[j]);
            maxArea = max(maxArea, minH * (j - i + 1));
        }
    }
    return maxArea;
}
```

```java
int largestRectangleArea(int[] heights) {
    int n = heights.length, maxArea = 0;
    for (int i = 0; i < n; i++) {
        int minH = heights[i];
        for (int j = i; j < n; j++) {
            minH = Math.min(minH, heights[j]);
            maxArea = Math.max(maxArea, minH * (j - i + 1));
        }
    }
    return maxArea;
}
```

```typescript
function largestRectangleArea(heights: number[]): number {
    const n = heights.length;
    let maxArea = 0;
    for (let i = 0; i < n; i++) {
        let minH = heights[i];
        for (let j = i; j < n; j++) {
            minH = Math.min(minH, heights[j]);
            maxArea = Math.max(maxArea, minH * (j - i + 1));
        }
    }
    return maxArea;
}
```

```python
def largest_rectangle_area(heights: list[int]) -> int:
    n = len(heights)
    max_area = 0
    for i in range(n):
        min_h = heights[i]
        for j in range(i, n):
            min_h = min(min_h, heights[j])
            max_area = max(max_area, min_h * (j - i + 1))
    return max_area
```

```go
func largestRectangleArea(heights []int) int {
    n, maxArea := len(heights), 0
    for i := 0; i < n; i++ {
        minH := heights[i]
        for j := i; j < n; j++ {
            if heights[j] < minH { minH = heights[j] }
            area := minH * (j - i + 1)
            if area > maxArea { maxArea = area }
        }
    }
    return maxArea
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Monotonic Stack — O(n)

Use an **increasing monotonic stack** of indices. When a bar shorter than the stack's top is found, the top bar can extend **no further right** — compute its maximum rectangle.

**The width calculation:** when we pop index `top`, the left boundary is the new stack top (the previous smaller element), and the right boundary is the current index `i`. Width = `i - stack.top() - 1` (or `i - (-1) - 1 = i` if the stack is empty).

**Trick: append `0` to heights** to flush all remaining elements from the stack at the end.

```cpp
class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        heights.push_back(0); // sentinel to flush stack
        int n = heights.size(), maxArea = 0;
        stack<int> st; // increasing stack of indices

        for (int i = 0; i < n; i++) {
            while (!st.empty() && heights[st.top()] > heights[i]) {
                int height = heights[st.top()];
                st.pop();
                int width = st.empty() ? i : i - st.top() - 1;
                maxArea = max(maxArea, height * width);
            }
            st.push(i);
        }
        return maxArea;
    }
};
```

```java
class Solution {
    public int largestRectangleArea(int[] heights) {
        int n = heights.length;
        int[] h = Arrays.copyOf(heights, n + 1); // append sentinel 0
        int maxArea = 0;
        Deque<Integer> stack = new ArrayDeque<>();

        for (int i = 0; i <= n; i++) {
            while (!stack.isEmpty() && h[stack.peek()] > h[i]) {
                int height = h[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }
}
```

```typescript
function largestRectangleArea(heights: number[]): number {
    const h = [...heights, 0]; // sentinel
    const n = h.length;
    const stack: number[] = [];
    let maxArea = 0;

    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && h[stack[stack.length - 1]] > h[i]) {
            const height = h[stack.pop()!];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    return maxArea;
}
```

```python
class Solution:
    def largestRectangleArea(self, heights: list[int]) -> int:
        heights = heights + [0]  # sentinel to flush stack
        stack = []  # increasing stack of indices
        max_area = 0

        for i, h in enumerate(heights):
            while stack and heights[stack[-1]] > h:
                height = heights[stack.pop()]
                width = i if not stack else i - stack[-1] - 1
                max_area = max(max_area, height * width)
            stack.append(i)

        return max_area
```

```go
func largestRectangleArea(heights []int) int {
    heights = append(heights, 0) // sentinel
    n := len(heights)
    stack := []int{}
    maxArea := 0

    for i := 0; i < n; i++ {
        for len(stack) > 0 && heights[stack[len(stack)-1]] > heights[i] {
            height := heights[stack[len(stack)-1]]
            stack = stack[:len(stack)-1]
            width := i
            if len(stack) > 0 { width = i - stack[len(stack)-1] - 1 }
            area := height * width
            if area > maxArea { maxArea = area }
        }
        stack = append(stack, i)
    }
    return maxArea
}
```

**Time:** O(n) — each index pushed and popped at most once.
**Space:** O(n) — stack.

## Dry Run

`heights = [2, 1, 5, 6, 2, 3, 0]` (0 is sentinel)

| i | h[i] | Stack | Action | Area Computed |
|---|---|---|---|---|
| 0 | 2 | [0] | push 0 | — |
| 1 | 1 | [1] | 1<2: pop 0 → h=2, width=1 (empty) → **2×1=2**; push 1 | 2 |
| 2 | 5 | [1,2] | push 2 | — |
| 3 | 6 | [1,2,3] | push 3 | — |
| 4 | 2 | [1,4] | 2<6: pop 3 → h=6, width=4-2-1=1 → **6×1=6**; 2<5: pop 2 → h=5, width=4-1-1=2 → **5×2=10**; push 4 | 6, **10** |
| 5 | 3 | [1,4,5] | push 5 | — |
| 6 | 0 | [] | 0<3: pop 5 → h=3, w=6-4-1=1 → 3; 0<2: pop 4 → h=2, w=6-1-1=4 → 8; 0<1: pop 1 → h=1, w=6 (empty) → 6 | 3, 8, 6 |

Max area: **10** ✓

## Width Calculation Explained

When we pop index `top` at position `i`:
- **Right boundary:** `i` (the first bar shorter than `heights[top]` to its right)
- **Left boundary:** `stack.top()` (the bar below in the stack — the first bar shorter than `heights[top]` to its left) or -1 if stack is empty
- **Width:** `i - left_boundary - 1` = `i - stack.top() - 1` (or `i` if stack empty)

```
stack (before pop):  [ ... left_idx, top_idx ]
pop top_idx, current i:

  left_idx+1 ... top_idx ... i-1
  |________ width __________|
  width = i - left_idx - 1
```

## Key Interview Insights

- **The sentinel 0** at the end eliminates the need for a post-loop cleanup. Any bar remaining in the stack will be popped when it sees `height = 0`.
- **The popped element is the height**; the stack's new top (after popping) gives the left boundary.
- **Why increasing stack?** We want to pop a bar when it can no longer extend rightward — i.e., when a shorter bar appears. This gives us the exact right boundary.
- **This technique extends to:** Maximal Rectangle in Binary Matrix (LC 85) — apply this row by row on cumulative column heights.
- **Alternative: divide and conquer** — find min height as the root, recurse left and right. O(n log n) average, O(n²) worst case with sorted input.

