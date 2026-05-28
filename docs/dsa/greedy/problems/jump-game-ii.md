---
title: Jump Game II
difficulty: Medium
tags: [Greedy, Array, Dynamic Programming, BFS]
link: https://leetcode.com/problems/jump-game-ii/
---

# Jump Game II

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/) |
| **Tags** | Greedy, Array, Dynamic Programming |

## Problem Statement

Given an integer array `nums` where `nums[i]` represents the maximum jump length from index `i`, return the **minimum number of jumps** to reach the last index. You can always reach the last index.

**Example:**
```
Input:  nums = [2,3,1,1,4]
Output: 2
Explanation: Jump from index 0 → 1 (jump 3) → last (jump 3). Min 2 jumps.
```

---

## Intuition

Think of this as a **BFS on levels**. Each "level" is the set of indices reachable in `k` jumps. To minimize jumps, expand level by level — the first time you reach the last index, that level count is the answer.

You don't need an actual BFS queue. Instead, track:
- `curEnd` — the rightmost index reachable in the *current* jump
- `farthest` — the rightmost index reachable from anywhere in the current level

When you exhaust the current level (`i == curEnd`), take one more jump: `jumps++`, advance `curEnd = farthest`.

---

## Approach 1: DP

`dp[i]` = minimum jumps to reach index `i`. Fill left to right.

```cpp
int jump(vector<int>& nums) {
    int n = nums.size();
    vector<int> dp(n, INT_MAX);
    dp[0] = 0;
    for (int i = 0; i < n; i++) {
        if (dp[i] == INT_MAX) continue;
        for (int j = i + 1; j <= min(i + nums[i], n - 1); j++)
            dp[j] = min(dp[j], dp[i] + 1);
    }
    return dp[n - 1];
}
```

```java
int jump(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int i = 0; i < n; i++) {
        if (dp[i] == Integer.MAX_VALUE) continue;
        for (int j = i + 1; j <= Math.min(i + nums[i], n - 1); j++)
            dp[j] = Math.min(dp[j], dp[i] + 1);
    }
    return dp[n - 1];
}
```

```typescript
function jump(nums: number[]): number {
    const n = nums.length;
    const dp = new Array(n).fill(Infinity);
    dp[0] = 0;
    for (let i = 0; i < n; i++) {
        if (dp[i] === Infinity) continue;
        for (let j = i + 1; j <= Math.min(i + nums[i], n - 1); j++)
            dp[j] = Math.min(dp[j], dp[i] + 1);
    }
    return dp[n - 1];
}
```

```python
def jump(nums: list[int]) -> int:
    n = len(nums)
    dp = [float('inf')] * n
    dp[0] = 0
    for i in range(n):
        if dp[i] == float('inf'):
            continue
        for j in range(i + 1, min(i + nums[i], n - 1) + 1):
            dp[j] = min(dp[j], dp[i] + 1)
    return dp[n - 1]
```

```go
func jump(nums []int) int {
    n := len(nums)
    dp := make([]int, n)
    for i := range dp { dp[i] = 1<<31 - 1 }
    dp[0] = 0
    for i := 0; i < n; i++ {
        if dp[i] == 1<<31-1 { continue }
        end := i + nums[i]
        if end >= n-1 { return dp[i] + 1 }
        for j := i + 1; j <= end; j++ {
            if dp[i]+1 < dp[j] { dp[j] = dp[i] + 1 }
        }
    }
    return dp[n-1]
}
```

**Time:** O(n²) — **Space:** O(n)

---

## Approach 2: Greedy BFS Levels (Optimal)

Process the array like BFS levels. `curEnd` is the end of the current level. `farthest` tracks how far we *could* jump from any position in the current level. When `i` hits `curEnd`, increment jumps and advance `curEnd`.

Stop early when `curEnd >= n-1` — no need to process the last level.

```cpp
int jump(vector<int>& nums) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < (int)nums.size() - 1; i++) {
        farthest = max(farthest, i + nums[i]);
        if (i == curEnd) {       // exhausted current level
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}
```

```java
int jump(int[] nums) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i == curEnd) {       // must jump now
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}
```

```typescript
function jump(nums: number[]): number {
    let jumps = 0, curEnd = 0, farthest = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i === curEnd) {
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}
```

```python
def jump(nums: list[int]) -> int:
    jumps = 0
    cur_end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == cur_end:       # end of current jump range
            jumps += 1
            cur_end = farthest
    return jumps
```

```go
func jump(nums []int) int {
    jumps, curEnd, farthest := 0, 0, 0
    for i := 0; i < len(nums)-1; i++ {
        if i+nums[i] > farthest { farthest = i + nums[i] }
        if i == curEnd {
            jumps++
            curEnd = farthest
        }
    }
    return jumps
}
```

**Time:** O(n) — **Space:** O(1)

---

## Dry Run

`nums = [2, 3, 1, 1, 4]`, n=5

```
i=0: farthest=max(0,0+2)=2, i==curEnd(0)? YES → jumps=1, curEnd=2
i=1: farthest=max(2,1+3)=4, i==curEnd(2)? No
i=2: farthest=max(4,2+1)=4, i==curEnd(2)? YES → jumps=2, curEnd=4
i=3: farthest=max(4,3+1)=4, i==curEnd(4)? No   (loop ends at n-2=3)

return 2 ✓
```

`nums = [1, 2, 1, 1, 1]`

```
i=0: farthest=1, i==0=curEnd → jumps=1, curEnd=1
i=1: farthest=3, i==1=curEnd → jumps=2, curEnd=3
i=2: farthest=3, i≠curEnd
i=3: farthest=4, i==3=curEnd → jumps=3, curEnd=4

return 3 ✓
```

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| DP | O(n²) | O(n) |
| Greedy BFS levels | O(n) | O(1) |

---

## Key Interview Insights

- The loop goes to `n-2` (not `n-1`) because if you're already at the last index, no jump is needed. Avoids an extra spurious increment.
- **Why greedy is optimal:** At each level, we take the jump that extends our reach the farthest. Not doing so would leave us with a strictly smaller `curEnd`, requiring at least as many (or more) future jumps.
- **Connection to Jump Game I:** Same `farthest` tracking — Jump Game I just checks if `farthest >= n-1`.
- **BFS analogy:** Each jump = one BFS level. `curEnd` is the end of current level. `farthest` is the end of the next level.
- Edge case: `nums = [0]` → already at last index, return `0`.
