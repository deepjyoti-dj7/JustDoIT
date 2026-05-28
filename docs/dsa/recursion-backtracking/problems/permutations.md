---
title: Permutations
difficulty: Medium
tags: [Array, Backtracking]
link: https://leetcode.com/problems/permutations/
---

# Permutations

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [46. Permutations](https://leetcode.com/problems/permutations/) |
| **Tags** | Array, Backtracking |

## Problem Statement

Given an array `nums` of **distinct** integers, return all possible permutations. You can return the answer in **any order**.

## Intuition

In subsets, we move a `start` pointer forward to avoid revisiting earlier elements. In permutations, **every element can appear at every position** — but each element can only appear **once** in a single permutation.

The decision at each step: which unused element to place at the current position?

```
nums = [1, 2, 3]

Position 0: choose 1, 2, or 3
  Chose 1 → Position 1: choose from {2, 3}
    Chose 2 → Position 2: must use 3 → [1, 2, 3]
    Chose 3 → Position 2: must use 2 → [1, 3, 2]
  Chose 2 → Position 1: choose from {1, 3}
    ...
```

Total permutations = 3! = 6.

## Approach 1: Backtracking with `used` Array (Clearest)

Track which indices have been used. At each step, try every unused index.

```cpp
class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        vector<vector<int>> result;
        vector<int> current;
        vector<bool> used(nums.size(), false);
        backtrack(nums, used, current, result);
        return result;
    }

private:
    void backtrack(vector<int>& nums, vector<bool>& used,
                   vector<int>& current, vector<vector<int>>& result) {
        if (current.size() == nums.size()) {
            result.push_back(current);  // complete permutation
            return;
        }
        for (int i = 0; i < nums.size(); i++) {
            if (used[i]) continue;
            used[i] = true;
            current.push_back(nums[i]);
            backtrack(nums, used, current, result);
            current.pop_back();
            used[i] = false;
        }
    }
};
```

```java
class Solution {
    private List<List<Integer>> result = new ArrayList<>();

    public List<List<Integer>> permute(int[] nums) {
        backtrack(nums, new boolean[nums.length], new ArrayList<>());
        return result;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> current) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            current.add(nums[i]);
            backtrack(nums, used, current);
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }
}
```

```typescript
function permute(nums: number[]): number[][] {
    const result: number[][] = [];
    const used = new Array(nums.length).fill(false);

    function backtrack(current: number[]): void {
        if (current.length === nums.length) {
            result.push([...current]);
            return;
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            current.push(nums[i]);
            backtrack(current);
            current.pop();
            used[i] = false;
        }
    }

    backtrack([]);
    return result;
}
```

```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []
        used = [False] * len(nums)

        def backtrack(current: list[int]) -> None:
            if len(current) == len(nums):
                result.append(current[:])
                return
            for i in range(len(nums)):
                if used[i]:
                    continue
                used[i] = True
                current.append(nums[i])
                backtrack(current)
                current.pop()
                used[i] = False

        backtrack([])
        return result
```

```go
func permute(nums []int) [][]int {
    result := [][]int{}
    used := make([]bool, len(nums))

    var backtrack func(current []int)
    backtrack = func(current []int) {
        if len(current) == len(nums) {
            snapshot := make([]int, len(current))
            copy(snapshot, current)
            result = append(result, snapshot)
            return
        }
        for i := 0; i < len(nums); i++ {
            if used[i] { continue }
            used[i] = true
            current = append(current, nums[i])
            backtrack(current)
            current = current[:len(current)-1]
            used[i] = false
        }
    }

    backtrack([]int{})
    return result
}
```

## Approach 2: Swap-Based (In-Place, No Extra Space)

Swap `nums[start]` with each element at index `>= start`. After recursing, swap back. This avoids the `used` array.

```cpp
void backtrack(vector<int>& nums, int start, vector<vector<int>>& result) {
    if (start == (int)nums.size()) { result.push_back(nums); return; }
    for (int i = start; i < (int)nums.size(); i++) {
        swap(nums[start], nums[i]);
        backtrack(nums, start + 1, result);
        swap(nums[start], nums[i]);  // swap back
    }
}
vector<vector<int>> permute(vector<int>& nums) {
    vector<vector<int>> result;
    backtrack(nums, 0, result);
    return result;
}
```

```java
void backtrack(int[] nums, int start, List<List<Integer>> result) {
    if (start == nums.length) {
        List<Integer> perm = new ArrayList<>();
        for (int n : nums) perm.add(n);
        result.add(perm);
        return;
    }
    for (int i = start; i < nums.length; i++) {
        int tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;
        backtrack(nums, start + 1, result);
        tmp = nums[start]; nums[start] = nums[i]; nums[i] = tmp;
    }
}
```

```typescript
function permute(nums: number[]): number[][] {
    const result: number[][] = [];
    function backtrack(start: number): void {
        if (start === nums.length) { result.push([...nums]); return; }
        for (let i = start; i < nums.length; i++) {
            [nums[start], nums[i]] = [nums[i], nums[start]];
            backtrack(start + 1);
            [nums[start], nums[i]] = [nums[i], nums[start]];
        }
    }
    backtrack(0);
    return result;
}
```

```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []

        def backtrack(start: int) -> None:
            if start == len(nums):
                result.append(nums[:])
                return
            for i in range(start, len(nums)):
                nums[start], nums[i] = nums[i], nums[start]  # swap in
                backtrack(start + 1)
                nums[start], nums[i] = nums[i], nums[start]  # swap back

        backtrack(0)
        return result
```

```go
func permute(nums []int) [][]int {
    result := [][]int{}
    var backtrack func(start int)
    backtrack = func(start int) {
        if start == len(nums) {
            snapshot := make([]int, len(nums))
            copy(snapshot, nums)
            result = append(result, snapshot)
            return
        }
        for i := start; i < len(nums); i++ {
            nums[start], nums[i] = nums[i], nums[start]
            backtrack(start + 1)
            nums[start], nums[i] = nums[i], nums[start]
        }
    }
    backtrack(0)
    return result
}
```

The swap approach is O(1) extra space (excluding output), but harder to extend to the duplicates variant (Permutations II).

## Dry Run

```
nums = [1, 2, 3],  used = [F, F, F]

backtrack(current=[])
  i=0: use 1 → backtrack([1])
    i=0: used[0]=T, skip
    i=1: use 2 → backtrack([1,2])
      i=0,1: skip
      i=2: use 3 → backtrack([1,2,3])
        len==3 → record [1,2,3] ✓
      pop 3, unuse 2
    i=2: use 3 → backtrack([1,3])
      i=2: use 2 → backtrack([1,3,2])
        record [1,3,2] ✓
      pop 2
    pop 2
  pop 1, unuse 0
  i=1: use 2 → backtrack([2]) ...
  i=2: use 3 → backtrack([3]) ...
```

## Complexity

- **Time:** O(n! × n) — n! permutations, each of length n to copy
- **Space:** O(n) for call stack and `used` array

## Permutations II (LC 47) — With Duplicates

Sort + skip pattern: `if i > 0 and nums[i] == nums[i-1] and not used[i-1]: continue`

The condition `not used[i-1]` ensures we only use the second occurrence of a duplicate *after* the first occurrence has been used (in the same path), preventing duplicate permutations.

```cpp
vector<vector<int>> permuteUnique(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    vector<bool> used(nums.size(), false);
    vector<int> current;
    function<void()> backtrack = [&]() {
        if (current.size() == nums.size()) { result.push_back(current); return; }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue;
            used[i] = true; current.push_back(nums[i]);
            backtrack();
            current.pop_back(); used[i] = false;
        }
    };
    backtrack();
    return result;
}
```

```java
public List<List<Integer>> permuteUnique(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrack(nums, used, new ArrayList<>(), result);
    return result;
}
void backtrack(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> result) {
    if (current.size() == nums.length) { result.add(new ArrayList<>(current)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        if (i > 0 && nums[i] == nums[i-1] && !used[i-1]) continue;
        used[i] = true; current.add(nums[i]);
        backtrack(nums, used, current, result);
        current.remove(current.size()-1); used[i] = false;
    }
}
```

```typescript
function permuteUnique(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];
    const used = new Array(nums.length).fill(false);
    function backtrack(current: number[]): void {
        if (current.length === nums.length) { result.push([...current]); return; }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i] === nums[i-1] && !used[i-1]) continue;
            used[i] = true; current.push(nums[i]);
            backtrack(current);
            current.pop(); used[i] = false;
        }
    }
    backtrack([]);
    return result;
}
```

```python
def permuteUnique(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []
    used = [False] * len(nums)

    def backtrack(current):
        if len(current) == len(nums):
            result.append(current[:])
            return
        for i in range(len(nums)):
            if used[i]: continue
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue  # skip duplicate permutation
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            current.pop()
            used[i] = False

    backtrack([])
    return result
```

```go
func permuteUnique(nums []int) [][]int {
    sort.Ints(nums)
    result := [][]int{}
    used := make([]bool, len(nums))
    var backtrack func(current []int)
    backtrack = func(current []int) {
        if len(current) == len(nums) {
            snapshot := make([]int, len(current))
            copy(snapshot, current)
            result = append(result, snapshot)
            return
        }
        for i := 0; i < len(nums); i++ {
            if used[i] { continue }
            if i > 0 && nums[i] == nums[i-1] && !used[i-1] { continue }
            used[i] = true
            current = append(current, nums[i])
            backtrack(current)
            current = current[:len(current)-1]
            used[i] = false
        }
    }
    backtrack([]int{})
    return result
}
```

## Key Interview Insights

- **Permutations vs Subsets:** In subsets, you iterate `start` forward (avoid re-using earlier elements). In permutations, you iterate from `0` every time (all positions can use any element), but track `used`.
- **The `used` array is the key data structure.** It tracks exactly which elements are in the current partial permutation.
- **Swap-based approach** runs slightly faster in practice (no `used` array lookups) but is harder to modify for duplicates.
- **n! grows extremely fast:** n=10 gives 3.6M permutations. Backtracking is practical only for small n (typically n ≤ 8 in interviews).
