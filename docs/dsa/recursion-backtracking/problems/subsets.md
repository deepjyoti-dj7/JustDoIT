---
title: Subsets
difficulty: Medium
tags: [Array, Backtracking, Bit Manipulation]
link: https://leetcode.com/problems/subsets/
---

# Subsets

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [78. Subsets](https://leetcode.com/problems/subsets/) |
| **Tags** | Array, Backtracking, Bit Manipulation |

## Problem Statement

Given an integer array `nums` of **unique** elements, return *all possible subsets* (the power set). The solution set must not contain duplicate subsets. Return the solution in **any order**.

## Intuition

For each element, we make a binary decision: **include** it or **skip** it. With `n` elements, we make `n` independent binary decisions, giving us exactly `2^n` subsets.

The recursion tree for `[1, 2, 3]`:
```
                []
          /           \
       [1]             []
      /    \          /    \
   [1,2]   [1]     [2]     []
   /  \    / \    /   \   /  \
[1,2,3][1,2][1,3][1][2,3][2][3][]
```

Every node (not just leaves) is a valid subset, so we record `current` at the start of every call.

## Approach 1: Backtracking (Optimal)

Iterate from a `start` index forward. At each index, decide to include `nums[i]` or not. The `start` parameter ensures we never go backward — no duplicate subsets.

```cpp
class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        backtrack(nums, 0, current, result);
        return result;
    }

private:
    void backtrack(vector<int>& nums, int start,
                   vector<int>& current, vector<vector<int>>& result) {
        result.push_back(current);  // every state is a valid subset

        for (int i = start; i < nums.size(); i++) {
            current.push_back(nums[i]);         // include nums[i]
            backtrack(nums, i + 1, current, result);
            current.pop_back();                  // undo (backtrack)
        }
    }
};
```

```java
class Solution {
    private List<List<Integer>> result = new ArrayList<>();

    public List<List<Integer>> subsets(int[] nums) {
        backtrack(nums, 0, new ArrayList<>());
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> current) {
        result.add(new ArrayList<>(current));  // snapshot

        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);
            backtrack(nums, i + 1, current);
            current.remove(current.size() - 1);
        }
    }
}
```

```typescript
function subsets(nums: number[]): number[][] {
    const result: number[][] = [];

    function backtrack(start: number, current: number[]): void {
        result.push([...current]);  // snapshot

        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop();
        }
    }

    backtrack(0, []);
    return result;
}
```

```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        result = []

        def backtrack(start: int, current: list[int]) -> None:
            result.append(current[:])  # snapshot at every node

            for i in range(start, len(nums)):
                current.append(nums[i])
                backtrack(i + 1, current)
                current.pop()

        backtrack(0, [])
        return result
```

```go
func subsets(nums []int) [][]int {
    result := [][]int{}

    var backtrack func(start int, current []int)
    backtrack = func(start int, current []int) {
        snapshot := make([]int, len(current))
        copy(snapshot, current)
        result = append(result, snapshot)

        for i := start; i < len(nums); i++ {
            current = append(current, nums[i])
            backtrack(i+1, current)
            current = current[:len(current)-1]
        }
    }

    backtrack(0, []int{})
    return result
}
```

## Approach 2: Iterative (Cascading)

Start with `[[]]`. For each number, duplicate all existing subsets and append the number to the duplicates.

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result = {{}};
    for (int num : nums) {
        int size = result.size();
        for (int j = 0; j < size; j++) {
            result.push_back(result[j]);
            result.back().push_back(num);
        }
    }
    return result;
}
```

```java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    result.add(new ArrayList<>());
    for (int num : nums) {
        int size = result.size();
        for (int j = 0; j < size; j++) {
            List<Integer> subset = new ArrayList<>(result.get(j));
            subset.add(num);
            result.add(subset);
        }
    }
    return result;
}
```

```typescript
function subsets(nums: number[]): number[][] {
    const result: number[][] = [[]];
    for (const num of nums) {
        const size = result.length;
        for (let j = 0; j < size; j++) {
            result.push([...result[j], num]);
        }
    }
    return result;
}
```

```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        result = [[]]

        for num in nums:
            # For each existing subset, create a new one with num added
            result += [subset + [num] for subset in result]

        return result
```

```go
func subsets(nums []int) [][]int {
    result := [][]int{{}}
    for _, num := range nums {
        size := len(result)
        for j := 0; j < size; j++ {
            subset := make([]int, len(result[j]))
            copy(subset, result[j])
            subset = append(subset, num)
            result = append(result, subset)
        }
    }
    return result
}
```

## Approach 3: Bit Manipulation

Each subset corresponds to a bitmask of `n` bits. Bit `i` = 1 means include `nums[i]`.

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> result;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> subset;
        for (int i = 0; i < n; i++)
            if (mask & (1 << i)) subset.push_back(nums[i]);
        result.push_back(subset);
    }
    return result;
}
```

```java
public List<List<Integer>> subsets(int[] nums) {
    int n = nums.length;
    List<List<Integer>> result = new ArrayList<>();
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++)
            if ((mask & (1 << i)) != 0) subset.add(nums[i]);
        result.add(subset);
    }
    return result;
}
```

```typescript
function subsets(nums: number[]): number[][] {
    const n = nums.length;
    const result: number[][] = [];
    for (let mask = 0; mask < (1 << n); mask++) {
        const subset: number[] = [];
        for (let i = 0; i < n; i++)
            if (mask & (1 << i)) subset.push(nums[i]);
        result.push(subset);
    }
    return result;
}
```

```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        n = len(nums)
        result = []

        for mask in range(1 << n):  # 0 to 2^n - 1
            subset = [nums[i] for i in range(n) if mask & (1 << i)]
            result.append(subset)

        return result
```

```go
func subsets(nums []int) [][]int {
    n := len(nums)
    result := [][]int{}
    for mask := 0; mask < (1 << n); mask++ {
        subset := []int{}
        for i := 0; i < n; i++ {
            if mask&(1<<i) != 0 {
                subset = append(subset, nums[i])
            }
        }
        result = append(result, subset)
    }
    return result
}
```

## Dry Run

```
nums = [1, 2, 3]

backtrack(start=0, current=[])
  record []
  i=0: current=[1] → backtrack(1, [1])
         record [1]
         i=1: current=[1,2] → backtrack(2, [1,2])
                record [1,2]
                i=2: current=[1,2,3] → backtrack(3, [1,2,3])
                       record [1,2,3]
                     pop → [1,2]
              pop → [1]
         i=2: current=[1,3] → backtrack(3, [1,3])
                record [1,3]
              pop → [1]
       pop → []
  i=1: current=[2] → backtrack(2, [2])
         record [2]
         i=2: current=[2,3] → backtrack(3, [2,3])
                record [2,3]
              pop → [2]
       pop → []
  i=2: current=[3] → backtrack(3, [3])
         record [3]
       pop → []

Result: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
```

## Complexity

- **Time:** O(2ⁿ × n) — 2ⁿ subsets, each takes O(n) to copy
- **Space:** O(n) call stack depth + O(2ⁿ × n) output

## Key Interview Insights

- **`result.append(current[:])`** — the snapshot is critical. Without copying, all entries in `result` would point to the same list.
- **`start` prevents duplicates** — passing `i+1` means we only look forward, so `[1,2]` and `[2,1]` are never both generated.
- **All three approaches produce valid answers**. The backtracking approach generalizes most easily to the variations (Subsets II, Combination Sum, etc.).
- **Bit manipulation** is elegant and O(2ⁿ) time, but may be harder to adapt to variations. Know it as an alternative.
