---
title: Jump Game
difficulty: Medium
tags: [Dynamic Programming, Greedy, Array]
link: https://leetcode.com/problems/jump-game/
---

# Jump Game

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [55. Jump Game](https://leetcode.com/problems/jump-game/) |
| **Tags** | Dynamic Programming, Greedy, Array |

## Problem Statement

Given an integer array `nums` where `nums[i]` is the maximum jump length from index `i`, return `true` if you can reach the last index starting from index `0`, otherwise `false`.

**Example:** `nums = [2,3,1,1,4]` → `true` (jump 1 step to index 1, then 3 steps to last index)
**Example:** `nums = [3,2,1,0,4]` → `false` (always stuck at index 3)

## Intuition

**Greedy insight:** Track the farthest reachable index at any point. If the current index ever exceeds the farthest reachable index, you're stuck. If the farthest reaches or passes the last index, you can make it.

This is more intuitive and faster than DP — O(n) time, O(1) space with no table needed.

## Approach 1: Brute Force (Recursion)

For each index, try jumping every possible distance. Exponential.

```cpp
bool canJump(vector<int>& nums) {
    function<bool(int)> dfs = [&](int i) -> bool {
        if (i >= nums.size() - 1) return true;
        for (int j = 1; j <= nums[i]; j++)
            if (dfs(i + j)) return true;
        return false;
    };
    return dfs(0);
}
```

```java
boolean canJump(int[] nums) {
    return dfs(nums, 0);
}
boolean dfs(int[] nums, int i) {
    if (i >= nums.length - 1) return true;
    for (int j = 1; j <= nums[i]; j++)
        if (dfs(nums, i + j)) return true;
    return false;
}
```

```typescript
function canJump(nums: number[]): boolean {
    function dfs(i: number): boolean {
        if (i >= nums.length - 1) return true;
        for (let j = 1; j <= nums[i]; j++)
            if (dfs(i + j)) return true;
        return false;
    }
    return dfs(0);
}
```

```python
def canJump(nums: list[int]) -> bool:
    def dfs(i: int) -> bool:
        if i >= len(nums) - 1: return True
        return any(dfs(i + j) for j in range(1, nums[i] + 1))
    return dfs(0)
```

```go
func canJump(nums []int) bool {
    var dfs func(int) bool
    dfs = func(i int) bool {
        if i >= len(nums)-1 { return true }
        for j := 1; j <= nums[i]; j++ {
            if dfs(i + j) { return true }
        }
        return false
    }
    return dfs(0)
}
```

**Time:** O(nⁿ) — **Space:** O(n) stack

## Approach 2: DP (Backward)

Mark each index as "good" (can reach end) or "bad". Work backwards from the last index.

```cpp
bool canJump(vector<int>& nums) {
    int n = nums.size();
    vector<bool> good(n, false);
    good[n-1] = true;
    for (int i = n - 2; i >= 0; i--) {
        int farthest = min(i + nums[i], n - 1);
        for (int j = i + 1; j <= farthest; j++) {
            if (good[j]) { good[i] = true; break; }
        }
    }
    return good[0];
}
```

```java
public boolean canJump(int[] nums) {
    int n = nums.length;
    boolean[] good = new boolean[n];
    good[n-1] = true;
    for (int i = n - 2; i >= 0; i--) {
        int farthest = Math.min(i + nums[i], n - 1);
        for (int j = i + 1; j <= farthest; j++) {
            if (good[j]) { good[i] = true; break; }
        }
    }
    return good[0];
}
```

```typescript
function canJump(nums: number[]): boolean {
    const n = nums.length;
    const good = new Array(n).fill(false);
    good[n-1] = true;
    for (let i = n - 2; i >= 0; i--) {
        const farthest = Math.min(i + nums[i], n - 1);
        for (let j = i + 1; j <= farthest; j++) {
            if (good[j]) { good[i] = true; break; }
        }
    }
    return good[0];
}
```

```python
def canJump(nums: list[int]) -> bool:
    n = len(nums)
    good = [False] * n
    good[-1] = True
    for i in range(n - 2, -1, -1):
        farthest = min(i + nums[i], n - 1)
        for j in range(i + 1, farthest + 1):
            if good[j]: good[i] = True; break
    return good[0]
```

```go
func canJump(nums []int) bool {
    n := len(nums)
    good := make([]bool, n)
    good[n-1] = true
    for i := n - 2; i >= 0; i-- {
        farthest := i + nums[i]
        if farthest >= n-1 { farthest = n - 1 }
        for j := i + 1; j <= farthest; j++ {
            if good[j] { good[i] = true; break }
        }
    }
    return good[0]
}
```

**Time:** O(n²) — **Space:** O(n)

## Approach 3: Greedy (Optimal)

Track `maxReach` — the farthest index reachable so far. If at any index `i > maxReach`, we can't get there; return false. If `maxReach >= n-1`, return true.

```cpp
bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
    }
    return true;
}
```

```java
public boolean canJump(int[] nums) {
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
def canJump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach: return False
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

## Dry Run

`nums = [3, 2, 1, 0, 4]`

| i | nums[i] | maxReach | i > maxReach? |
|---|---|---|---|
| 0 | 3 | 3 | No |
| 1 | 2 | 3 | No |
| 2 | 1 | 3 | No |
| 3 | 0 | 3 | No |
| 4 | 4 | 3 | **Yes → return false** |

Answer: **false** ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(nⁿ) | O(n) |
| DP backward | O(n²) | O(n) |
| Greedy | O(n) | O(1) |

## Key Interview Insights

**Jump Game II (LeetCode 45)** asks for the *minimum* number of jumps. The greedy approach extends to: at each "current boundary", scan forward to find the next farthest reach, increment jumps, and advance the boundary.

**The greedy is provably optimal** because the decision to maximize reach at each step never makes future states worse — you're strictly expanding the reachable region.

**Common mistake:** Returning false when `nums[i] == 0`. A zero at index `i` is only a blocker if `i > maxReach`. If you can jump over it, it's fine.

**The DP approach** works backwards and is O(n²) in the worst case, but is more intuitive as a stepping stone — useful to explain before presenting the greedy optimization.
