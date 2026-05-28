---
title: Two Sum
difficulty: Easy
tags: [Array, Hash Map]
link: https://leetcode.com/problems/two-sum/
---

# Two Sum

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [1. Two Sum](https://leetcode.com/problems/two-sum/) |
| **Tags** | Array, Hash Map |

## Problem Statement

Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`. Each input has exactly one solution and you may not use the same element twice.

## Intuition

For each number `x`, we need to find if `target - x` exists in the array. The question is: how fast can we check?

## Approach 1: Brute Force

Check every pair of elements.

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                if (nums[i] + nums[j] == target) {
                    return {i, j};
                }
            }
        }
        return {};
    }
};
```

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == target) {
                    return new int[]{i, j};
                }
            }
        }
        return new int[]{};
    }
}
```

```typescript
function twoSum(nums: number[], target: number): number[] {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}
```

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []
```

```go
func twoSum(nums []int, target int) []int {
    for i := 0; i < len(nums); i++ {
        for j := i + 1; j < len(nums); j++ {
            if nums[i]+nums[j] == target {
                return []int{i, j}
            }
        }
    }
    return nil
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Hash Map (Optimal)

As we iterate, store each number and its index in a hash map. For the current number `x`, check if `target - x` already exists in the map.

**Why this works:** By the time we reach `x`, all previous elements are in the map. If `target - x` was seen before, we've found our pair.

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};
```

```java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[]{seen.get(complement), i};
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}
```

```typescript
function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement)!, i];
        }
        seen.set(nums[i], i);
    }
    return [];
}
```

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []
```

```go
func twoSum(nums []int, target int) []int {
    seen := map[int]int{}
    for i, num := range nums {
        complement := target - num
        if j, ok := seen[complement]; ok {
            return []int{j, i}
        }
        seen[num] = i
    }
    return nil
}
```

**Time:** O(n) — **Space:** O(n)

## Dry Run

Input: `nums = [2, 7, 11, 15]`, `target = 9`

| Step | nums[i] | complement | seen | Action |
|---|---|---|---|---|
| i=0 | 2 | 7 | {} | 7 not in map → add {2: 0} |
| i=1 | 7 | 2 | {2: 0} | 2 found at index 0 → return [0, 1] |

## Key Interview Insights

- **Why not sort?** Sorting destroys original indices. You'd need to store index info separately, adding complexity.
- **Why hash map over two pointers?** Two pointers requires sorting (O(n log n)) and doesn't preserve indices. Hash map does both in O(n).
- **Duplicate values?** The algorithm handles them naturally — we check the map *before* inserting, so we never match an element with itself.
- **Follow-up: What if sorted?** Use two pointers from opposite ends for O(n) time, O(1) space.
