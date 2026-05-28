---
title: Combination Sum II
difficulty: Medium
tags: [Array, Backtracking]
link: https://leetcode.com/problems/combination-sum-ii/
---

# Combination Sum II

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [40. Combination Sum II](https://leetcode.com/problems/combination-sum-ii/) |
| **Tags** | Array, Backtracking |

## Problem Statement

Given a collection of candidate numbers `candidates` (which **may have duplicates**) and a `target` number, find all unique combinations in `candidates` where the candidate numbers sum to `target`.

Each number in `candidates` may only be used **once** in the combination.

Note: The solution set must not contain duplicate combinations.

## Intuition

This problem combines two constraints from previous problems:
- From **Combination Sum (LC 39)**: use a `start` index to build combinations
- From **Subsets II (LC 90)**: sort + skip duplicates at the same recursion level

The difference from LC 39: pass `i+1` (no reuse), and skip `candidates[i] == candidates[i-1]` when `i > start`.

```
candidates = [1, 1, 2, 5, 6, 7, 10] (sorted), target = 8

At level 0 (start=0):
  Choose candidates[0]=1 → explore subtree
  Choose candidates[1]=1 → SKIP (same value as candidates[0], already tried at this level)
  Choose candidates[2]=2 → explore subtree
  ...

This prevents [1(idx0),7] and [1(idx1),7] from both being generated.
Both would produce the same combination [1,7].
```

## Approach

```cpp
class Solution {
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        vector<vector<int>> result;
        vector<int> current;
        backtrack(candidates, target, 0, current, result);
        return result;
    }

private:
    void backtrack(vector<int>& candidates, int remaining,
                   int start, vector<int>& current, vector<vector<int>>& result) {
        if (remaining == 0) {
            result.push_back(current);
            return;
        }
        for (int i = start; i < candidates.size(); i++) {
            if (candidates[i] > remaining) break;         // pruning
            if (i > start && candidates[i] == candidates[i-1]) continue;  // skip dup

            current.push_back(candidates[i]);
            backtrack(candidates, remaining - candidates[i], i + 1, current, result);  // i+1: no reuse
            current.pop_back();
        }
    }
};
```

```java
class Solution {
    private List<List<Integer>> result = new ArrayList<>();

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        Arrays.sort(candidates);
        backtrack(candidates, target, 0, new ArrayList<>());
        return result;
    }

    private void backtrack(int[] candidates, int remaining, int start, List<Integer> current) {
        if (remaining == 0) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break;
            if (i > start && candidates[i] == candidates[i - 1]) continue;  // skip duplicate

            current.add(candidates[i]);
            backtrack(candidates, remaining - candidates[i], i + 1, current);  // i+1: no reuse
            current.remove(current.size() - 1);
        }
    }
}
```

```typescript
function combinationSum2(candidates: number[], target: number): number[][] {
    candidates.sort((a, b) => a - b);
    const result: number[][] = [];

    function backtrack(remaining: number, start: number, current: number[]): void {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break;
            if (i > start && candidates[i] === candidates[i - 1]) continue;

            current.push(candidates[i]);
            backtrack(remaining - candidates[i], i + 1, current);  // i+1: no reuse
            current.pop();
        }
    }

    backtrack(target, 0, []);
    return result;
}
```

```python
class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        result = []

        def backtrack(remaining: int, start: int, current: list[int]) -> None:
            if remaining == 0:
                result.append(current[:])
                return
            for i in range(start, len(candidates)):
                if candidates[i] > remaining:
                    break
                if i > start and candidates[i] == candidates[i - 1]:
                    continue  # skip duplicate at this level

                current.append(candidates[i])
                backtrack(remaining - candidates[i], i + 1, current)  # i+1: no reuse
                current.pop()

        backtrack(target, 0, [])
        return result
```

```go
func combinationSum2(candidates []int, target int) [][]int {
    sort.Ints(candidates)
    result := [][]int{}

    var backtrack func(remaining, start int, current []int)
    backtrack = func(remaining, start int, current []int) {
        if remaining == 0 {
            snapshot := make([]int, len(current))
            copy(snapshot, current)
            result = append(result, snapshot)
            return
        }
        for i := start; i < len(candidates); i++ {
            if candidates[i] > remaining { break }
            if i > start && candidates[i] == candidates[i-1] { continue }

            current = append(current, candidates[i])
            backtrack(remaining-candidates[i], i+1, current)  // i+1: no reuse
            current = current[:len(current)-1]
        }
    }

    backtrack(target, 0, []int{})
    return result
}
```

## Dry Run

```
candidates = [1, 1, 2, 5, 6, 7, 10] (sorted),  target = 8

backtrack(remaining=8, start=0, current=[])
  i=0: candidates[0]=1, add → backtrack(7, 1, [1])
    i=1: candidates[1]=1, add → backtrack(6, 2, [1,1])
      i=2: candidates[2]=2, add → backtrack(4, 3, [1,1,2])
        i=3: 5>4 → BREAK
      pop 2 → [1,1]
      i=3: 5<=6, add → backtrack(1, 4, [1,1,5])
        i=4: 6>1 → BREAK
      pop 5 → [1,1]
      i=4: 6<=6, add → backtrack(0, 5, [1,1,6])
        remaining==0 → RECORD [1,1,6] ✓
      pop 6 → [1,1]
      i=5: 7>6 → BREAK
    pop 1 → [1]
    i=2: 2<=7, add → backtrack(5, 3, [1,2])
      i=3: 5<=5, add → backtrack(0, 4, [1,2,5])
        RECORD [1,2,5] ✓
      ...
    ...
    i=4: 6<=7, add → backtrack(1, 5, [1,6])
      i=5: 7>1 → BREAK
    pop 6 → [1]
    i=5: 7<=7, add → backtrack(0, 6, [1,7])
      RECORD [1,7] ✓
  pop 1 → []
  i=1: i>start=0 and candidates[1]==candidates[0] → SKIP  (avoids duplicate paths)
  i=2: candidates[2]=2, add → backtrack(6, 3, [2])
    i=3: 5<=6, add → backtrack(1, 4, [2,5])
      i=4: 6>1 → BREAK
    i=4: 6<=6, add → backtrack(0, 5, [2,6])
      RECORD [2,6] ✓
    ...
  i=3: candidates[3]=5, add → backtrack(3, 4, [5])
    ...
  i=4: 6<=8, add → backtrack(2, 5, [6])
    i=5: 7>2 → BREAK
  i=5: 7<=8, add → backtrack(1, 6, [7])
    ...

Final: [[1,1,6], [1,2,5], [1,7], [2,6]] ✓
```

## Comparison: Combination Sum I vs II

| Aspect | Combination Sum I (LC 39) | Combination Sum II (LC 40) |
|---|---|---|
| Duplicates in input? | No | Yes |
| Can reuse elements? | Yes | No |
| Next call index | `i` (same index) | `i + 1` (next index) |
| Duplicate skip | Not needed | `if i > start and nums[i] == nums[i-1]` |
| Sort required? | For pruning (optional) | Required (for dedup + pruning) |

## Complexity

- **Time:** O(2ⁿ) in the worst case — each element either included or skipped
- **Space:** O(n) recursion depth

## Key Interview Insights

- **Three-line diff from LC 39:** change `i` to `i+1` in the recursive call, add the duplicate skip condition, sort the array.
- **The duplicate skip condition `i > start`** is the same as in Subsets II — think of `start` as the "first allowed index at this recursion level."
- **Both pruning conditions matter:** `candidates[i] > remaining → break` eliminates large candidates; the duplicate skip eliminates redundant subtrees. Remove either and the solution is either wrong or TLE.
