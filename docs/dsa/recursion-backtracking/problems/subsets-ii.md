---
title: Subsets II
difficulty: Medium
tags: [Array, Backtracking, Bit Manipulation]
link: https://leetcode.com/problems/subsets-ii/
---

# Subsets II

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [90. Subsets II](https://leetcode.com/problems/subsets-ii/) |
| **Tags** | Array, Backtracking, Bit Manipulation |

## Problem Statement

Given an integer array `nums` that **may contain duplicates**, return all possible subsets (the power set). The solution set must **not contain duplicate subsets**. Return the solution in any order.

## Intuition

This is Subsets (LC 78) with one extra constraint: the input has duplicates and we must deduplicate the output.

The core insight: **sort the array first**. Identical values become adjacent. Then, when iterating over choices, skip `nums[i]` if it equals `nums[i-1]` and `i > start`. This skips duplicate branches at the same recursion level.

**Why `i > start` not `i > 0`?**

`i > 0` would skip the first occurrence of a duplicate value even when it's the first choice at this level — losing valid subsets. `i > start` only skips when the *same value has already been chosen* at *this same recursion depth*.

```
nums = [1, 2, 2]  (sorted)

Level 0 (start=0):   can choose 1, 2, (skip second 2)
Level 1 (start=1):   can choose 2, (skip second 2)
Level 1 (start=2):   can choose 2  ← different recursion level, allowed

Subsets: [], [1], [1,2], [1,2,2], [2], [2,2]  (6 unique subsets)
```

## Approach: Backtracking with Duplicate Skipping

```cpp
class Solution {
public:
    vector<vector<int>> subsetsWithDup(vector<int>& nums) {
        sort(nums.begin(), nums.end());  // sort to group duplicates
        vector<vector<int>> result;
        vector<int> current;
        backtrack(nums, 0, current, result);
        return result;
    }

private:
    void backtrack(vector<int>& nums, int start,
                   vector<int>& current, vector<vector<int>>& result) {
        result.push_back(current);

        for (int i = start; i < nums.size(); i++) {
            // Skip duplicate at the same recursion level
            if (i > start && nums[i] == nums[i - 1]) continue;

            current.push_back(nums[i]);
            backtrack(nums, i + 1, current, result);
            current.pop_back();
        }
    }
};
```

```java
class Solution {
    private List<List<Integer>> result = new ArrayList<>();

    public List<List<Integer>> subsetsWithDup(int[] nums) {
        Arrays.sort(nums);
        backtrack(nums, 0, new ArrayList<>());
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> current) {
        result.add(new ArrayList<>(current));

        for (int i = start; i < nums.length; i++) {
            if (i > start && nums[i] == nums[i - 1]) continue;  // skip duplicate

            current.add(nums[i]);
            backtrack(nums, i + 1, current);
            current.remove(current.size() - 1);
        }
    }
}
```

```typescript
function subsetsWithDup(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];

    function backtrack(start: number, current: number[]): void {
        result.push([...current]);

        for (let i = start; i < nums.length; i++) {
            if (i > start && nums[i] === nums[i - 1]) continue;

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
    def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []

        def backtrack(start: int, current: list[int]) -> None:
            result.append(current[:])

            for i in range(start, len(nums)):
                if i > start and nums[i] == nums[i - 1]:
                    continue  # skip duplicate at this recursion level

                current.append(nums[i])
                backtrack(i + 1, current)
                current.pop()

        backtrack(0, [])
        return result
```

```go
func subsetsWithDup(nums []int) [][]int {
    sort.Ints(nums)
    result := [][]int{}

    var backtrack func(start int, current []int)
    backtrack = func(start int, current []int) {
        snapshot := make([]int, len(current))
        copy(snapshot, current)
        result = append(result, snapshot)

        for i := start; i < len(nums); i++ {
            if i > start && nums[i] == nums[i-1] {
                continue  // skip duplicate at this level
            }
            current = append(current, nums[i])
            backtrack(i+1, current)
            current = current[:len(current)-1]
        }
    }

    backtrack(0, []int{})
    return result
}
```

## Dry Run

```
nums = [1, 2, 2]  (already sorted)

backtrack(start=0, current=[])
  record []
  i=0: nums[0]=1, include → backtrack(1, [1])
    record [1]
    i=1: nums[1]=2, include → backtrack(2, [1,2])
      record [1,2]
      i=2: nums[2]=2, include → backtrack(3, [1,2,2])
        record [1,2,2]
      pop → [1,2]
    pop → [1]
    i=2: i>start=1 and nums[2]==nums[1] → SKIP
  pop → []
  i=1: nums[1]=2, include → backtrack(2, [2])
    record [2]
    i=2: nums[2]=2, include → backtrack(3, [2,2])
      record [2,2]
    pop → [2]
  pop → []
  i=2: i>start=0 and nums[2]==nums[1] → SKIP

Result: [[], [1], [1,2], [1,2,2], [2], [2,2]] ✓
```

## Side-by-Side: Subsets vs Subsets II

| | Subsets (78) | Subsets II (90) |
|---|---|---|
| Input | All distinct | May have duplicates |
| Pre-sort? | Not needed | **Required** |
| Duplicate skip? | No | `if i > start and nums[i] == nums[i-1]: skip` |
| Rest of code | Identical | Identical |

## Complexity

- **Time:** O(n × 2ⁿ) — sorting is O(n log n), dominated by generating subsets
- **Space:** O(n) recursion depth + O(2ⁿ × n) output

## Key Interview Insights

- **Sort is mandatory** — the duplicate-skip logic only works when equal values are adjacent.
- **`i > start`** not `i > 0` — this is the single most common bug in Subsets II. Think of `start` as "the first index at this recursion level." We skip a value only if the same value was already used as the first element at this level.
- **This exact pattern** (`sort` + `if i > start and nums[i] == nums[i-1]: continue`) appears unchanged in Combination Sum II and Permutations II.
