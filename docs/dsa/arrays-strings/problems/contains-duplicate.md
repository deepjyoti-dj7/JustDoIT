---
title: Contains Duplicate
difficulty: Easy
tags: [Array, Hash Set, Sorting]
link: https://leetcode.com/problems/contains-duplicate/
---

# Contains Duplicate

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [217. Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) |
| **Tags** | Array, Hash Set, Sorting |

## Problem Statement

Given an integer array `nums`, return `true` if any value appears at least twice, and `false` if every element is distinct.

## Intuition

We need to detect if any element repeats. The question is about the **lookup speed** of previously seen elements.

## Approach 1: Brute Force

Compare every pair.

```cpp
class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                if (nums[i] == nums[j]) return true;
            }
        }
        return false;
    }
};
```

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] == nums[j]) return true;
            }
        }
        return false;
    }
}
```

```typescript
function containsDuplicate(nums: number[]): boolean {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] === nums[j]) return true;
        }
    }
    return false;
}
```

```python
class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] == nums[j]:
                    return True
        return False
```

```go
func containsDuplicate(nums []int) bool {
    for i := 0; i < len(nums); i++ {
        for j := i + 1; j < len(nums); j++ {
            if nums[i] == nums[j] {
                return true
            }
        }
    }
    return false
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Sorting

Sort the array — duplicates become adjacent.

```cpp
class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] == nums[i - 1]) return true;
        }
        return false;
    }
};
```

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Arrays.sort(nums);
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] == nums[i - 1]) return true;
        }
        return false;
    }
}
```

```typescript
function containsDuplicate(nums: number[]): boolean {
    nums.sort((a, b) => a - b);
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) return true;
    }
    return false;
}
```

```python
class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        nums.sort()
        for i in range(1, len(nums)):
            if nums[i] == nums[i - 1]:
                return True
        return False
```

```go
func containsDuplicate(nums []int) bool {
    sort.Ints(nums)
    for i := 1; i < len(nums); i++ {
        if nums[i] == nums[i-1] {
            return true
        }
    }
    return false
}
```

**Time:** O(n log n) — **Space:** O(1) if sorting in place

## Approach 3: Hash Set (Optimal)

Insert each element into a set. If it already exists, we found a duplicate.

```cpp
class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int num : nums) {
            if (!seen.insert(num).second) return true;
        }
        return false;
    }
};
```

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int num : nums) {
            if (!seen.add(num)) return true;
        }
        return false;
    }
}
```

```typescript
function containsDuplicate(nums: number[]): boolean {
    const seen = new Set<number>();
    for (const num of nums) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}
```

```python
class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        seen = set()
        for num in nums:
            if num in seen:
                return True
            seen.add(num)
        return False
```

```go
func containsDuplicate(nums []int) bool {
    seen := map[int]bool{}
    for _, num := range nums {
        if seen[num] {
            return true
        }
        seen[num] = true
    }
    return false
}
```

**Time:** O(n) — **Space:** O(n)

> **One-liner alternative:** `return len(nums) != len(set(nums))` in Python. Acceptable in interviews but show you understand the underlying mechanics.

## Key Interview Insights

- **Tradeoff discussion:** Sort = O(n log n) time, O(1) space. Hash set = O(n) time, O(n) space. Interviewers love hearing you articulate this.
- **Early exit:** The hash set approach can return as soon as the first duplicate is found — best case O(1).
- **Follow-up:** Contains Duplicate II (within distance K) → use a sliding window hash set of size K.
- **Follow-up:** Contains Duplicate III (within distance K, value diff ≤ t) → use a bucket sort approach or ordered set.
