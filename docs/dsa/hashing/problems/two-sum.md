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

Given an array of integers `nums` and an integer `target`, return the **indices** of the two numbers that add up to `target`. Each input has exactly one solution. You may not use the same element twice.

## Intuition

For each number `x`, we need `target - x` (its complement). The naive approach checks every pair. The hash map approach asks a smarter question: "Have I already seen the complement?"

By processing left to right and storing each number's index as we go, we can check in O(1) whether the complement exists among previously seen numbers.

## Approach 1: Brute Force — O(n²)

Check every pair (i, j) where i < j.

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                if (nums[i] + nums[j] == target) return {i, j};
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
                if (nums[i] + nums[j] == target) return new int[]{i, j};
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
            if (nums[i] + nums[j] === target) return [i, j];
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
            if nums[i]+nums[j] == target { return []int{i, j} }
        }
    }
    return nil
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Hash Map — O(n)

One pass: for each element, check if its complement is already in the map. If yes, return the pair. If no, store the current element.

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen; // value → index
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.count(complement)) return {seen[complement], i};
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
    const seen = new Map<number, number>(); // value → index
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) return [seen.get(complement)!, i];
        seen.set(nums[i], i);
    }
    return [];
}
```

```python
class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen: dict[int, int] = {}  # value → index
        for i, n in enumerate(nums):
            complement = target - n
            if complement in seen:
                return [seen[complement], i]
            seen[n] = i
        return []
```

```go
func twoSum(nums []int, target int) []int {
    seen := map[int]int{} // value → index
    for i, n := range nums {
        complement := target - n
        if j, ok := seen[complement]; ok {
            return []int{j, i}
        }
        seen[n] = i
    }
    return nil
}
```

**Time:** O(n) — **Space:** O(n)

## Dry Run

`nums = [2, 7, 11, 15]`, `target = 9`

| i | nums[i] | complement | seen | Result |
|---|---|---|---|---|
| 0 | 2 | 9-2=7 | {} (no 7) | store {2→0} |
| 1 | 7 | 9-7=2 | {2→0} (found!) | **return [0, 1]** |

## Key Interview Insights

- **Store index, not value.** The problem asks for indices, not the values themselves. Map: `value → index`.
- **Why check complement before inserting?** Checking first avoids using the same element twice (e.g., `nums = [3, 3], target = 6` — if we insert 3 at index 0, then check for 3 again at index 1, we correctly find index 0).
- **What if there are duplicates?** The one-pass approach handles duplicates naturally — we store the *latest* index (earlier is overwritten), but since we check before inserting, we always find a valid earlier index for the complement.
- **Two-pass alternative:** First pass: store all values. Second pass: look up complements. Simpler to reason about but uses more code.
- **Follow-up: return values, not indices (sorted array)?** Sort + two pointers in O(n log n) / O(1) space — see Two Sum II (LC 167).

