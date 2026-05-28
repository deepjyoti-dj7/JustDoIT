---
title: House Robber II
difficulty: Medium
tags: [Dynamic Programming, Array]
link: https://leetcode.com/problems/house-robber-ii/
---

# House Robber II

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [213. House Robber II](https://leetcode.com/problems/house-robber-ii/) |
| **Tags** | Dynamic Programming, Array |

## Problem Statement

Same as House Robber, except the houses are arranged in a circle — the first and last house are adjacent. Return the maximum amount you can rob without triggering the alarm.

## Intuition

The circular constraint means you can't rob both house 0 and house `n-1` simultaneously.

**Key insight:** Break the circle. Since we can't rob both endpoints, the optimal solution must either:
1. Exclude house 0 — run House Robber on `nums[1..n-1]`
2. Exclude house `n-1` — run House Robber on `nums[0..n-2]`

The answer is the max of these two. We reuse the linear House Robber solution (from LeetCode 198) as a helper.

## Approach 1: Brute Force

Try all valid non-adjacent subsets respecting the circular constraint. Exponential — not practical.

```cpp
// O(2^n) — not practical. Skip to DP approach.
int rob(vector<int>& nums) {
    if (nums.size() == 1) return nums[0];
    // Break circle into two linear sub-problems
    return -1; // placeholder
}
```

```java
// O(2^n) — not practical. Skip to DP approach.
int rob(int[] nums) {
    if (nums.length == 1) return nums[0];
    return -1; // placeholder
}
```

```typescript
// O(2^n) — not practical. Skip to DP approach.
function rob(nums: number[]): number {
    if (nums.length === 1) return nums[0];
    return -1; // placeholder
}
```

```python
# O(2^n) — not practical. Skip to DP approach.
def rob(nums: list[int]) -> int:
    if len(nums) == 1: return nums[0]
    return -1  # placeholder
```

```go
// O(2^n) — not practical. Skip to DP approach.
func rob(nums []int) int {
    if len(nums) == 1 { return nums[0] }
    return -1 // placeholder
}
```

## Approach 2: Two-Pass Linear DP (Optimal)

Run the House Robber linear DP twice on the two sub-arrays. Return the max.

```cpp
class Solution {
    int robRange(vector<int>& nums, int l, int r) {
        int prev2 = 0, prev1 = 0;
        for (int i = l; i <= r; i++) {
            int curr = max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        return max(robRange(nums, 0, n - 2), robRange(nums, 1, n - 1));
    }
};
```

```java
class Solution {
    private int robRange(int[] nums, int l, int r) {
        int prev2 = 0, prev1 = 0;
        for (int i = l; i <= r; i++) {
            int curr = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(robRange(nums, 0, n - 2), robRange(nums, 1, n - 1));
    }
}
```

```typescript
function rob(nums: number[]): number {
    const n = nums.length;
    if (n === 1) return nums[0];

    function robRange(l: number, r: number): number {
        let prev2 = 0, prev1 = 0;
        for (let i = l; i <= r; i++) {
            const curr = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }

    return Math.max(robRange(0, n - 2), robRange(1, n - 1));
}
```

```python
def rob(nums: list[int]) -> int:
    def rob_range(l: int, r: int) -> int:
        prev2 = prev1 = 0
        for i in range(l, r + 1):
            prev2, prev1 = prev1, max(prev1, prev2 + nums[i])
        return prev1

    n = len(nums)
    if n == 1: return nums[0]
    return max(rob_range(0, n - 2), rob_range(1, n - 1))
```

```go
func rob(nums []int) int {
    n := len(nums)
    if n == 1 { return nums[0] }

    robRange := func(l, r int) int {
        prev2, prev1 := 0, 0
        for i := l; i <= r; i++ {
            prev2, prev1 = prev1, max(prev1, prev2+nums[i])
        }
        return prev1
    }

    return max(robRange(0, n-2), robRange(1, n-1))
}
```

**Time:** O(n) — **Space:** O(1)

## Dry Run

`nums = [2, 3, 2]` (circle: house 0 and house 2 are adjacent)

- Pass 1 (indices 0..1 = `[2,3]`): `max(0+2, 0) = 2`, `max(2, 0+3) = 3` → **3**
- Pass 2 (indices 1..2 = `[3,2]`): `max(0+3, 0) = 3`, `max(3, 0+2) = 3` → **3**

Answer: `max(3, 3) = 3`. ✓

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute force | O(2ⁿ) | O(n) |
| Two-pass DP | O(n) | O(1) |

## Key Interview Insights

**The "break the circle" trick is universal.** Any problem with a circular constraint can often be solved by running the linear solution twice — once excluding the first element, once excluding the last.

**Always handle `n == 1` separately.** When there's only one house, you must rob it (`nums[0]`). The two sub-arrays would be empty, producing 0 incorrectly.

**The helper function pattern matters.** Extracting `robRange` makes the code clean and reusable. Define `robRange(l, r)` that runs vanilla House Robber on `nums[l..r]` — then the outer function is just two calls and a max.

**Follow-up: House Robber III** is set on a binary tree. The approach there is tree DP: for each node, return a pair `(rob_this, skip_this)`.
