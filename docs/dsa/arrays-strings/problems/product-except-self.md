---
title: Product of Array Except Self
difficulty: Medium
tags: [Array, Prefix Sum]
link: https://leetcode.com/problems/product-of-array-except-self/
---

# Product of Array Except Self

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [238. Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/) |
| **Tags** | Array, Prefix/Suffix Products |

## Problem Statement

Given an integer array `nums`, return an array `answer` where `answer[i]` is the product of all elements except `nums[i]`. You must solve it in O(n) time **without using division**.

## Intuition

For each index `i`, we need `product of everything to the left` × `product of everything to the right`. This is a prefix/suffix product problem.

## Approach 1: Brute Force

For each element, multiply all others.

```cpp
class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> answer(n, 1);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i != j) answer[i] *= nums[j];
            }
        }
        return answer;
    }
};
```

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        Arrays.fill(answer, 1);
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i != j) answer[i] *= nums[j];
            }
        }
        return answer;
    }
}
```

```typescript
function productExceptSelf(nums: number[]): number[] {
    const n = nums.length;
    const answer = new Array(n).fill(1);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) answer[i] *= nums[j];
        }
    }
    return answer;
}
```

```python
class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        answer = [1] * n
        for i in range(n):
            for j in range(n):
                if i != j:
                    answer[i] *= nums[j]
        return answer
```

```go
func productExceptSelf(nums []int) []int {
    n := len(nums)
    answer := make([]int, n)
    for i := range answer {
        answer[i] = 1
    }
    for i := 0; i < n; i++ {
        for j := 0; j < n; j++ {
            if i != j {
                answer[i] *= nums[j]
            }
        }
    }
    return answer
}
```

**Time:** O(n²) — **Space:** O(1) extra

## Approach 2: Prefix & Suffix Arrays

Build two arrays:
- `left[i]` = product of all elements to the left of `i`
- `right[i]` = product of all elements to the right of `i`
- `answer[i] = left[i] * right[i]`

```cpp
class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> left(n, 1), right(n, 1), answer(n);

        for (int i = 1; i < n; i++) {
            left[i] = left[i - 1] * nums[i - 1];
        }
        for (int i = n - 2; i >= 0; i--) {
            right[i] = right[i + 1] * nums[i + 1];
        }
        for (int i = 0; i < n; i++) {
            answer[i] = left[i] * right[i];
        }
        return answer;
    }
};
```

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] left = new int[n], right = new int[n], answer = new int[n];
        left[0] = 1;
        right[n - 1] = 1;

        for (int i = 1; i < n; i++) {
            left[i] = left[i - 1] * nums[i - 1];
        }
        for (int i = n - 2; i >= 0; i--) {
            right[i] = right[i + 1] * nums[i + 1];
        }
        for (int i = 0; i < n; i++) {
            answer[i] = left[i] * right[i];
        }
        return answer;
    }
}
```

```typescript
function productExceptSelf(nums: number[]): number[] {
    const n = nums.length;
    const left = new Array(n).fill(1);
    const right = new Array(n).fill(1);
    const answer = new Array(n);

    for (let i = 1; i < n; i++) {
        left[i] = left[i - 1] * nums[i - 1];
    }
    for (let i = n - 2; i >= 0; i--) {
        right[i] = right[i + 1] * nums[i + 1];
    }
    for (let i = 0; i < n; i++) {
        answer[i] = left[i] * right[i];
    }
    return answer;
}
```

```python
class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        left = [1] * n
        right = [1] * n

        for i in range(1, n):
            left[i] = left[i - 1] * nums[i - 1]
        for i in range(n - 2, -1, -1):
            right[i] = right[i + 1] * nums[i + 1]

        return [left[i] * right[i] for i in range(n)]
```

```go
func productExceptSelf(nums []int) []int {
    n := len(nums)
    left := make([]int, n)
    right := make([]int, n)
    answer := make([]int, n)
    left[0] = 1
    right[n-1] = 1

    for i := 1; i < n; i++ {
        left[i] = left[i-1] * nums[i-1]
    }
    for i := n - 2; i >= 0; i-- {
        right[i] = right[i+1] * nums[i+1]
    }
    for i := 0; i < n; i++ {
        answer[i] = left[i] * right[i]
    }
    return answer
}
```

**Time:** O(n) — **Space:** O(n)

## Approach 3: Optimal (O(1) Extra Space)

Use the output array for left products, then sweep right-to-left with a running product.

```cpp
class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> answer(n, 1);

        // Build left products into answer
        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] * nums[i - 1];
        }

        // Sweep right products using a running variable
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= right;
            right *= nums[i];
        }
        return answer;
    }
};
```

```java
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];
        answer[0] = 1;

        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] * nums[i - 1];
        }

        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= right;
            right *= nums[i];
        }
        return answer;
    }
}
```

```typescript
function productExceptSelf(nums: number[]): number[] {
    const n = nums.length;
    const answer = new Array(n).fill(1);

    for (let i = 1; i < n; i++) {
        answer[i] = answer[i - 1] * nums[i - 1];
    }

    let right = 1;
    for (let i = n - 1; i >= 0; i--) {
        answer[i] *= right;
        right *= nums[i];
    }
    return answer;
}
```

```python
class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        answer = [1] * n

        for i in range(1, n):
            answer[i] = answer[i - 1] * nums[i - 1]

        right = 1
        for i in range(n - 1, -1, -1):
            answer[i] *= right
            right *= nums[i]

        return answer
```

```go
func productExceptSelf(nums []int) []int {
    n := len(nums)
    answer := make([]int, n)
    answer[0] = 1

    for i := 1; i < n; i++ {
        answer[i] = answer[i-1] * nums[i-1]
    }

    right := 1
    for i := n - 1; i >= 0; i-- {
        answer[i] *= right
        right *= nums[i]
    }
    return answer
}
```

**Time:** O(n) — **Space:** O(1) extra (output array doesn't count)

## Dry Run

Input: `nums = [1, 2, 3, 4]`

**Pass 1 — left products into answer:**

| i | answer[i] |
|---|---|
| 0 | 1 |
| 1 | 1 |
| 2 | 1×2 = 2 |
| 3 | 2×3 = 6 |

**Pass 2 — multiply by right products:**

| i | right (before) | answer[i] | right (after) |
|---|---|---|---|
| 3 | 1 | 6×1 = 6 | 4 |
| 2 | 4 | 2×4 = 8 | 12 |
| 1 | 12 | 1×12 = 12 | 24 |
| 0 | 24 | 1×24 = 24 | 24 |

Result: `[24, 12, 8, 6]` ✓

## Key Interview Insights

- **Why no division?** The constraint prevents `totalProduct / nums[i]`, which also breaks when zeros are present.
- **The "two-pass" mental model** is reusable: prefix from left, suffix from right. Same pattern appears in Trapping Rain Water.
- **Watch for zeros:** If there's one zero, only that index has a non-zero product. If there are two+ zeros, all products are zero. (This matters if you're asked about the division approach.)
