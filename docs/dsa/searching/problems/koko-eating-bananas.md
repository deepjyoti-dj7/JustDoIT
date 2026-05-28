---
title: Koko Eating Bananas
difficulty: Medium
tags: [Array, Binary Search]
link: https://leetcode.com/problems/koko-eating-bananas/
---

# Koko Eating Bananas

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [875. Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) |
| **Tags** | Array, Binary Search |

## Problem Statement

Koko loves to eat bananas. There are `n` piles of bananas, the `i`th pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.

Koko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.

Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.

## Intuition

This is a classic **binary search on the answer space** problem. Instead of searching an array, we search the range of possible speeds.

The key insight is the **monotonicity of feasibility**:
- If Koko can finish at speed `k`, she can definitely finish at speed `k+1` (faster is always at least as good).
- If she can't finish at speed `k`, she can't finish at any speed less than `k`.

This monotonicity means: the feasibility function looks like `[false, false, ..., false, true, true, ..., true]`. We want the **first true** — binary search!

```
Speed range:  [1, 2, 3, 4, 5, 6, ..., max(piles)]
Feasible:     [F, F, F, T, T, T, ..., T]
                        ^
                    answer (minimum feasible speed)
```

## Approach: Binary Search on Answer Space

```cpp
class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        int left = 1, right = *max_element(piles.begin(), piles.end());

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canFinish(piles, mid, h)) {
                right = mid;       // mid works, try to find something smaller
            } else {
                left = mid + 1;    // mid too slow, need faster speed
            }
        }
        return left;  // minimum speed that works
    }

private:
    bool canFinish(vector<int>& piles, int speed, int h) {
        long long hours = 0;
        for (int pile : piles) {
            hours += (pile + speed - 1) / speed;  // ceil(pile / speed)
            if (hours > h) return false;  // early exit optimization
        }
        return hours <= h;
    }
};
```

```java
class Solution {
    public int minEatingSpeed(int[] piles, int h) {
        int left = 1, right = 0;
        for (int p : piles) right = Math.max(right, p);

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canFinish(piles, mid, h)) right = mid;
            else left = mid + 1;
        }
        return left;
    }

    private boolean canFinish(int[] piles, int speed, int h) {
        long hours = 0;
        for (int pile : piles) {
            hours += (pile + speed - 1) / speed;
            if (hours > h) return false;
        }
        return true;
    }
}
```

```typescript
function minEatingSpeed(piles: number[], h: number): number {
    let left = 1, right = Math.max(...piles);

    const canFinish = (speed: number): boolean => {
        let hours = 0;
        for (const pile of piles) {
            hours += Math.ceil(pile / speed);
            if (hours > h) return false;
        }
        return true;
    };

    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (canFinish(mid)) right = mid;
        else left = mid + 1;
    }
    return left;
}
```

```python
import math

class Solution:
    def minEatingSpeed(self, piles: list[int], h: int) -> int:
        left, right = 1, max(piles)

        def can_finish(speed: int) -> bool:
            hours = 0
            for pile in piles:
                hours += math.ceil(pile / speed)
                if hours > h:
                    return False
            return True

        while left < right:
            mid = (left + right) // 2
            if can_finish(mid):
                right = mid       # mid is feasible, search for smaller
            else:
                left = mid + 1    # mid too slow

        return left
```

```go
func minEatingSpeed(piles []int, h int) int {
    left, right := 1, 0
    for _, p := range piles {
        if p > right { right = p }
    }

    canFinish := func(speed int) bool {
        hours := 0
        for _, pile := range piles {
            hours += (pile + speed - 1) / speed
            if hours > h { return false }
        }
        return true
    }

    for left < right {
        mid := left + (right-left)/2
        if canFinish(mid) {
            right = mid
        } else {
            left = mid + 1
        }
    }
    return left
}
```

## Dry Run

```
piles = [3, 6, 7, 11],  h = 8
speed range: [1, 11]

left=1, right=11, mid=6
  can_finish(6)? ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6) = 1+1+2+2 = 6 ≤ 8 ✓
  right = 6

left=1, right=6, mid=3
  can_finish(3)? ceil(3/3)+ceil(6/3)+ceil(7/3)+ceil(11/3) = 1+2+3+4 = 10 > 8 ✗
  left = 4

left=4, right=6, mid=5
  can_finish(5)? ceil(3/5)+ceil(6/5)+ceil(7/5)+ceil(11/5) = 1+2+2+3 = 8 ≤ 8 ✓
  right = 5

left=4, right=5, mid=4
  can_finish(4)? ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 ≤ 8 ✓
  right = 4

left=4, right=4 → exit
return 4 ✓
```

## Ceiling Division Without Floating Point

`ceil(a / b)` in integer arithmetic: `(a + b - 1) / b` (integer division).

This avoids `math.ceil` and floating-point issues. Alternatively: `(a - 1) / b + 1` (equivalent for positive `a, b`).

## Complexity

- **Time:** O(n log m) where n = number of piles, m = max pile size. Binary search over m speeds, each feasibility check is O(n).
- **Space:** O(1)

## Template: Binary Search on Answer

This problem is the canonical example of the pattern. Memorize the structure:

```cpp
// Binary Search on Answer template
int solve(vector<int>& arr, int constraint) {
    int left = 1, right = *max_element(arr.begin(), arr.end());
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (feasible(arr, mid, constraint))
            right = mid;      // mid works, try smaller
        else
            left = mid + 1;   // mid doesn't work, need larger
    }
    return left;  // minimum feasible value
}
```

```java
int solve(int[] arr, int constraint) {
    int left = 1, right = Arrays.stream(arr).max().getAsInt();
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (feasible(arr, mid, constraint))
            right = mid;
        else
            left = mid + 1;
    }
    return left;
}
```

```typescript
function solve(arr: number[], constraint: number): number {
    let left = 1, right = Math.max(...arr);
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (feasible(arr, mid, constraint))
            right = mid;
        else
            left = mid + 1;
    }
    return left;
}
```

```python
def solve():
    left = min_possible_answer       # could be 1
    right = max_possible_answer      # could be max(arr) or sum(arr)

    while left < right:
        mid = (left + right) // 2
        if feasible(mid):            # can we achieve mid?
            right = mid              # mid works, try smaller
        else:
            left = mid + 1           # mid doesn't work, need more

    return left                      # minimum feasible value
```

```go
func solve(arr []int, constraint int) int {
    left, right := 1, slices.Max(arr)
    for left < right {
        mid := left + (right-left)/2
        if feasible(arr, mid, constraint) {
            right = mid
        } else {
            left = mid + 1
        }
    }
    return left
}
```

**Similar problems using this exact template:**
- [1011. Capacity to Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)
- [410. Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/)
- [1482. Minimum Number of Days to Make m Bouquets](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/)
