---
title: Jump Game
difficulty: Medium
tags: [Greedy, Array, Dynamic Programming]
link: https://leetcode.com/problems/jump-game/
---

# Jump Game

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [55. Jump Game](https://leetcode.com/problems/jump-game/) |
| **Tags** | Greedy, Array, Dynamic Programming |

## Problem Statement

You are given an integer array `nums`. You start at index `0`. Each element `nums[i]` represents the **maximum** jump length from position `i`. Return `true` if you can reach the last index, or `false` otherwise.

**Example 1:**
```
Input:  nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step from 0 → 1 → last, or 2 steps from 0 → 2 → last.
```

**Example 2:**
```
Input:  nums = [3,2,1,0,4]
Output: false
Explanation: Index 3 always has value 0; you always get stuck there.
```

---

## Intuition

At any position `i`, you can reach any index from `i+1` to `i + nums[i]`. The question is: does the *farthest* reachable index ever reach or exceed `n-1`?

Think of it as tracking a **"reach horizon"** — the furthest index you can currently jump to. As you walk forward, keep updating the horizon. If you ever step past the horizon without extending it, you're stuck.

---

## Approach 1: Brute Force (DP)

Mark each index as reachable or not. For every reachable index, mark everything within its jump range.

```cpp
bool canJump(vector<int>& nums) {
    int n = nums.size();
    vector<bool> reachable(n, false);
    reachable[0] = true;
    for (int i = 0; i < n; i++) {
        if (!reachable[i]) continue;
        for (int j = i + 1; j <= min(i + nums[i], n - 1); j++)
            reachable[j] = true;
    }
    return reachable[n - 1];
}
```

```java
boolean canJump(int[] nums) {
    int n = nums.length;
    boolean[] reachable = new boolean[n];
    reachable[0] = true;
    for (int i = 0; i < n; i++) {
        if (!reachable[i]) continue;
        for (int j = i + 1; j <= Math.min(i + nums[i], n - 1); j++)
            reachable[j] = true;
    }
    return reachable[n - 1];
}
```

```typescript
function canJump(nums: number[]): boolean {
    const n = nums.length;
    const reachable = new Array(n).fill(false);
    reachable[0] = true;
    for (let i = 0; i < n; i++) {
        if (!reachable[i]) continue;
        for (let j = i + 1; j <= Math.min(i + nums[i], n - 1); j++)
            reachable[j] = true;
    }
    return reachable[n - 1];
}
```

```python
def can_jump(nums: list[int]) -> bool:
    n = len(nums)
    reachable = [False] * n
    reachable[0] = True
    for i in range(n):
        if not reachable[i]:
            continue
        for j in range(i + 1, min(i + nums[i], n - 1) + 1):
            reachable[j] = True
    return reachable[n - 1]
```

```go
func canJump(nums []int) bool {
    n := len(nums)
    reachable := make([]bool, n)
    reachable[0] = true
    for i := 0; i < n; i++ {
        if !reachable[i] { continue }
        end := i + nums[i]
        if end >= n-1 { return true }
        for j := i + 1; j <= end; j++ {
            reachable[j] = true
        }
    }
    return reachable[n-1]
}
```

**Time:** O(n²) — **Space:** O(n)

---

## Approach 2: Greedy (Optimal)

Track a single variable `maxReach` — the farthest index reachable so far. At each index `i`:
- If `i > maxReach`, we can't reach `i` → return `false`
- Otherwise, extend `maxReach = max(maxReach, i + nums[i])`
- If `maxReach >= n-1`, return `true`

One pass, O(1) space.

```cpp
bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
    }
    return true;
}
```

```java
boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}
```

```typescript
function canJump(nums: number[]): boolean {
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}
```

```python
def can_jump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    return True
```

```go
func canJump(nums []int) bool {
    maxReach := 0
    for i, jump := range nums {
        if i > maxReach { return false }
        if i+jump > maxReach { maxReach = i + jump }
    }
    return true
}
```

**Time:** O(n) — **Space:** O(1)

---

## Dry Run

`nums = [3, 2, 1, 0, 4]`

| i | nums[i] | maxReach | i > maxReach? |
|---|---|---|---|
| 0 | 3 | max(0, 0+3) = 3 | No |
| 1 | 2 | max(3, 1+2) = 3 | No |
| 2 | 1 | max(3, 2+1) = 3 | No |
| 3 | 0 | max(3, 3+0) = 3 | No |
| 4 | 4 | — | **Yes (4 > 3) → false** |

`nums = [2, 3, 1, 1, 4]`

| i | nums[i] | maxReach |
|---|---|---|
| 0 | 2 | 2 |
| 1 | 3 | 4 |
| 2 | 1 | 4 → `4 >= n-1=4` → **true** |

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| DP / Brute Force | O(n²) | O(n) |
| Greedy | O(n) | O(1) |

---

## Key Interview Insights

- The greedy works because: if you can reach index `i`, you can reach anything up to `i + nums[i]`. The farthest you've ever reached is the only thing that matters.
- **Zero trap:** A `0` at position `i` is only a trap if `maxReach <= i` — meaning nothing earlier could jump over it.
- This problem is also solvable with DP backwards (mark `good`/`bad` from the end), but greedy is cleaner.
- Follow-up: **Jump Game II** (LC 45) asks for minimum jumps — use a BFS-level greedy.
- **Alternate greedy (backwards):** Start `goal = n-1`. Walk backwards; if `i + nums[i] >= goal`, update `goal = i`. Return `goal == 0`.
