---
title: Combination Sum
difficulty: Medium
tags: [Array, Backtracking]
link: https://leetcode.com/problems/combination-sum/
---

# Combination Sum

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [39. Combination Sum](https://leetcode.com/problems/combination-sum/) |
| **Tags** | Array, Backtracking |

## Problem Statement

Given an array of **distinct** integers `candidates` and a `target` integer, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. The same number may be chosen from `candidates` **an unlimited number of times**.

Two combinations are unique if the frequency of at least one of the chosen numbers is different. Return the combinations in any order.

## Intuition

This is a subset/combination search with two twists:
1. Elements can be reused (unlimited times)
2. The stopping condition is `sum == target`, not reaching end of array

**Key design decisions:**
- Use a `start` index to prevent `[2,3]` and `[3,2]` from both appearing (combinations, not permutations)
- Pass `remaining - candidates[i]` to avoid a running sum variable
- Prune when `remaining < 0` (if sorted: `candidates[i] > remaining → break`)

```
candidates = [2, 3, 6, 7],  target = 7

        []  remaining=7
       / | \  \
      2  3  6   7
      |  |
   [2,r=5] [3,r=4]
    /  |      |  \
   2   3      3   6
  [2,2,r=3] [3,3,r=1]...
  /   \
 2     3
[2,2,2,r=1] [2,2,3,r=0] → FOUND [2,2,3]
 |
[2,2,2,2,r=-1] → PRUNE
```

## Approach: Backtracking with Reuse

```cpp
class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());  // enables early break
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
            if (candidates[i] > remaining) break;  // sorted: rest also too big
            current.push_back(candidates[i]);
            backtrack(candidates, remaining - candidates[i], i, current, result);  // i not i+1: reuse allowed
            current.pop_back();
        }
    }
};
```

```java
class Solution {
    private List<List<Integer>> result = new ArrayList<>();

    public List<List<Integer>> combinationSum(int[] candidates, int target) {
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
            current.add(candidates[i]);
            backtrack(candidates, remaining - candidates[i], i, current);  // i, not i+1
            current.remove(current.size() - 1);
        }
    }
}
```

```typescript
function combinationSum(candidates: number[], target: number): number[][] {
    candidates.sort((a, b) => a - b);
    const result: number[][] = [];

    function backtrack(remaining: number, start: number, current: number[]): void {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        for (let i = start; i < candidates.length; i++) {
            if (candidates[i] > remaining) break;
            current.push(candidates[i]);
            backtrack(remaining - candidates[i], i, current);  // i: can reuse
            current.pop();
        }
    }

    backtrack(target, 0, []);
    return result;
}
```

```python
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates.sort()
        result = []

        def backtrack(remaining: int, start: int, current: list[int]) -> None:
            if remaining == 0:
                result.append(current[:])
                return
            for i in range(start, len(candidates)):
                if candidates[i] > remaining:
                    break  # sorted: all subsequent too large
                current.append(candidates[i])
                backtrack(remaining - candidates[i], i, current)  # i: reuse
                current.pop()

        backtrack(target, 0, [])
        return result
```

```go
func combinationSum(candidates []int, target int) [][]int {
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
            current = append(current, candidates[i])
            backtrack(remaining-candidates[i], i, current)  // i: reuse
            current = current[:len(current)-1]
        }
    }

    backtrack(target, 0, []int{})
    return result
}
```

## Dry Run

```
candidates = [2, 3, 6, 7] (sorted),  target = 7

backtrack(remaining=7, start=0, current=[])
  i=0: candidates[0]=2 <= 7, add → backtrack(5, 0, [2])
    i=0: 2<=5, add → backtrack(3, 0, [2,2])
      i=0: 2<=3, add → backtrack(1, 0, [2,2,2])
        i=0: 2>1 → BREAK
      pop 2 → [2,2]
      i=1: 3>3? No, add → backtrack(0, 1, [2,2,3])
        remaining==0 → RECORD [2,2,3] ✓
      pop 3 → [2,2]
      i=2: 6>3 → BREAK
    pop 2 → [2]
    i=1: 3<=5, add → backtrack(2, 1, [2,3])
      i=1: 3>2 → BREAK
    pop 3 → [2]
    i=2: 6>5 → BREAK
  pop 2 → []
  i=1: 3<=7, add → backtrack(4, 1, [3])
    i=1: 3<=4, add → backtrack(1, 1, [3,3])
      i=1: 3>1 → BREAK
    pop 3 → [3]
    i=2: 6>4 → BREAK
  pop 3 → []
  i=2: 6<=7, add → backtrack(1, 2, [6])
    i=2: 6>1 → BREAK
  pop 6 → []
  i=3: 7<=7, add → backtrack(0, 3, [7])
    remaining==0 → RECORD [7] ✓
  pop 7 → []

Result: [[2,2,3], [7]]
```

## Complexity

- **Time:** O(n^(target/min) × k) where k is the average length — exponential but pruned significantly by sorting and early break
- **Space:** O(target/min) recursion depth

## Key Interview Insights

- **Pass `i` not `i+1`** to the recursive call — this is what enables reuse of the same element. For Combination Sum II where reuse is not allowed, pass `i+1`.
- **Sort + break is the critical pruning** — without it, we'd try all elements even when they far exceed the remaining target.
- **The `remaining` parameter** is cleaner than maintaining a running `sum`. It avoids needing to undo a sum change separately from the list change.
- **The `start` pointer** ensures combinations not permutations: `[2,3]` and `[3,2]` aren't both generated because when we start from index 1 (3), we never go back to index 0 (2).
