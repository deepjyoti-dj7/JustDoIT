---
title: Maximum Subarray (Divide & Conquer)
difficulty: Medium
tags: [Divide and Conquer, Array, Dynamic Programming]
link: https://leetcode.com/problems/maximum-subarray/
---

# Maximum Subarray

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [53. Maximum Subarray](https://leetcode.com/problems/maximum-subarray/) |
| **Tags** | Divide and Conquer, Array, Dynamic Programming |

## Problem Statement

Given an integer array `nums`, find the contiguous subarray with the largest sum and return its sum.

**Example:**
```
nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: [4,-1,2,1] has the largest sum = 6.
```

**Constraints:** Must contain at least one element.

---

## Intuition

This is a classic problem with three solutions at increasing levels of cleverness:

1. **Brute Force:** Try all O(n²) subarrays — O(n²) or O(n³)
2. **Kadane's (DP/Greedy):** One pass, O(n) — the standard solution
3. **Divide & Conquer:** Split at midpoint — O(n log n) — demonstrates D&C thinking

The D&C approach isn't the most efficient here, but it's the version that exercises the D&C pattern and is sometimes specifically required ("solve it using divide and conquer").

**D&C key insight:** The maximum subarray either:
- Lies entirely in the **left half**
- Lies entirely in the **right half**
- **Crosses the midpoint** (contains elements from both halves)

The first two cases are solved recursively. The third is solved in O(n) by extending greedily from the midpoint outward.

---

## Approach 1: Brute Force

Check every possible subarray start/end pair.

```cpp
int maxSubArray(vector<int>& nums) {
    int n = nums.size(), result = INT_MIN;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += nums[j];
            result = max(result, sum);
        }
    }
    return result;
}
```

```java
int maxSubArray(int[] nums) {
    int n = nums.length, result = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) {
        int sum = 0;
        for (int j = i; j < n; j++) {
            sum += nums[j];
            result = Math.max(result, sum);
        }
    }
    return result;
}
```

```typescript
function maxSubArray(nums: number[]): number {
    let result = -Infinity;
    for (let i = 0; i < nums.length; i++) {
        let sum = 0;
        for (let j = i; j < nums.length; j++) {
            sum += nums[j];
            result = Math.max(result, sum);
        }
    }
    return result;
}
```

```python
def max_sub_array(nums: list[int]) -> int:
    result = float('-inf')
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            result = max(result, total)
    return result
```

```go
func maxSubArray(nums []int) int {
    result := -(1 << 31)
    for i := 0; i < len(nums); i++ {
        sum := 0
        for j := i; j < len(nums); j++ {
            sum += nums[j]
            if sum > result { result = sum }
        }
    }
    return result
}
```

**Time:** O(n²) — **Space:** O(1)

---

## Approach 2: Kadane's Algorithm (DP / Greedy — Optimal)

At each index, decide: extend the previous subarray, or start fresh. Keep running max.

```cpp
int maxSubArray(vector<int>& nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        cur  = max(nums[i], cur + nums[i]);
        best = max(best, cur);
    }
    return best;
}
```

```java
int maxSubArray(int[] nums) {
    int cur = nums[0], best = nums[0];
    for (int i = 1; i < nums.length; i++) {
        cur  = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
    }
    return best;
}
```

```typescript
function maxSubArray(nums: number[]): number {
    let cur = nums[0], best = nums[0];
    for (let i = 1; i < nums.length; i++) {
        cur  = Math.max(nums[i], cur + nums[i]);
        best = Math.max(best, cur);
    }
    return best;
}
```

```python
def max_sub_array(nums: list[int]) -> int:
    cur = best = nums[0]
    for n in nums[1:]:
        cur  = max(n, cur + n)
        best = max(best, cur)
    return best
```

```go
func maxSubArray(nums []int) int {
    cur, best := nums[0], nums[0]
    for _, n := range nums[1:] {
        if cur+n > n { cur = cur + n } else { cur = n }
        if cur > best { best = cur }
    }
    return best
}
```

**Time:** O(n) — **Space:** O(1)

---

## Approach 3: Divide and Conquer

Split at midpoint. The answer is `max(left, right, cross)`.

The **cross** case: start from `mid` going left to find the max left suffix sum, then from `mid+1` going right for max right prefix sum. Their sum is the max crossing subarray.

```cpp
int maxCross(vector<int>& nums, int lo, int mid, int hi) {
    int leftSum = INT_MIN, sum = 0;
    for (int i = mid; i >= lo; i--) {
        sum += nums[i];
        leftSum = max(leftSum, sum);
    }
    int rightSum = INT_MIN; sum = 0;
    for (int j = mid + 1; j <= hi; j++) {
        sum += nums[j];
        rightSum = max(rightSum, sum);
    }
    return leftSum + rightSum;
}

int dcMaxSub(vector<int>& nums, int lo, int hi) {
    if (lo == hi) return nums[lo];
    int mid = lo + (hi - lo) / 2;
    int left  = dcMaxSub(nums, lo, mid);
    int right = dcMaxSub(nums, mid + 1, hi);
    int cross = maxCross(nums, lo, mid, hi);
    return max({left, right, cross});
}

int maxSubArray(vector<int>& nums) {
    return dcMaxSub(nums, 0, (int)nums.size() - 1);
}
```

```java
int maxCross(int[] nums, int lo, int mid, int hi) {
    int leftSum = Integer.MIN_VALUE, sum = 0;
    for (int i = mid; i >= lo; i--) {
        sum += nums[i];
        leftSum = Math.max(leftSum, sum);
    }
    int rightSum = Integer.MIN_VALUE; sum = 0;
    for (int j = mid + 1; j <= hi; j++) {
        sum += nums[j];
        rightSum = Math.max(rightSum, sum);
    }
    return leftSum + rightSum;
}

int dcMaxSub(int[] nums, int lo, int hi) {
    if (lo == hi) return nums[lo];
    int mid = lo + (hi - lo) / 2;
    return Math.max(
        Math.max(dcMaxSub(nums, lo, mid), dcMaxSub(nums, mid + 1, hi)),
        maxCross(nums, lo, mid, hi)
    );
}

int maxSubArray(int[] nums) {
    return dcMaxSub(nums, 0, nums.length - 1);
}
```

```typescript
function maxSubArray(nums: number[]): number {
    return dcMaxSub(nums, 0, nums.length - 1);
}

function dcMaxSub(nums: number[], lo: number, hi: number): number {
    if (lo === hi) return nums[lo];
    const mid = lo + ((hi - lo) >> 1);
    return Math.max(
        dcMaxSub(nums, lo, mid),
        dcMaxSub(nums, mid + 1, hi),
        maxCross(nums, lo, mid, hi)
    );
}

function maxCross(nums: number[], lo: number, mid: number, hi: number): number {
    let leftSum = -Infinity, sum = 0;
    for (let i = mid; i >= lo; i--) { sum += nums[i]; leftSum = Math.max(leftSum, sum); }
    let rightSum = -Infinity; sum = 0;
    for (let j = mid + 1; j <= hi; j++) { sum += nums[j]; rightSum = Math.max(rightSum, sum); }
    return leftSum + rightSum;
}
```

```python
def max_sub_array_dc(nums: list[int]) -> int:
    return dc_max_sub(nums, 0, len(nums) - 1)

def dc_max_sub(nums: list[int], lo: int, hi: int) -> int:
    if lo == hi:
        return nums[lo]
    mid = lo + (hi - lo) // 2
    left  = dc_max_sub(nums, lo, mid)
    right = dc_max_sub(nums, mid + 1, hi)
    cross = max_cross(nums, lo, mid, hi)
    return max(left, right, cross)

def max_cross(nums: list[int], lo: int, mid: int, hi: int) -> int:
    left_sum, total = float('-inf'), 0
    for i in range(mid, lo - 1, -1):
        total += nums[i]
        left_sum = max(left_sum, total)
    right_sum, total = float('-inf'), 0
    for j in range(mid + 1, hi + 1):
        total += nums[j]
        right_sum = max(right_sum, total)
    return left_sum + right_sum
```

```go
func maxSubArrayDC(nums []int) int {
    return dcMaxSub(nums, 0, len(nums)-1)
}

func dcMaxSub(nums []int, lo, hi int) int {
    if lo == hi { return nums[lo] }
    mid := lo + (hi-lo)/2
    left, right, cross := dcMaxSub(nums, lo, mid), dcMaxSub(nums, mid+1, hi), maxCross(nums, lo, mid, hi)
    if left > right { right = left }
    if cross > right { return cross }
    return right
}

func maxCross(nums []int, lo, mid, hi int) int {
    leftSum, sum := -(1 << 31), 0
    for i := mid; i >= lo; i-- {
        sum += nums[i]
        if sum > leftSum { leftSum = sum }
    }
    rightSum, sum := -(1 << 31), 0
    for j := mid + 1; j <= hi; j++ {
        sum += nums[j]
        if sum > rightSum { rightSum = sum }
    }
    return leftSum + rightSum
}
```

**Time:** O(n log n) — **Space:** O(log n) stack

---

## Dry Run (D&C)

`nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]`

Split at mid=4 (`-1`):

```
Left  [-2,1,-3,4,-1]:  max = 4  (just [4])
Right [2,1,-5,4]:      max = 4  (just [4] or [2,1] etc.)

Cross: extend left from mid=4:
  i=4: -1, leftSum=-1
  i=3: -1+4=3, leftSum=3
  i=2: 3-3=0, leftSum=3
  ... leftSum=3

Extend right from mid+1=5:
  j=5: 2, rightSum=2
  j=6: 3, rightSum=3
  j=7: -2, rightSum=3
  j=8: 2, rightSum=3

cross = 3 + 3 = 6
```

Answer = max(4, 4, 6) = **6** ✓

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute Force | O(n²) | O(1) |
| Kadane's (optimal) | O(n) | O(1) |
| Divide and Conquer | O(n log n) | O(log n) |

---

## Key Interview Insights

- **Kadane's is the expected answer** for this problem — O(n) time, O(1) space, elegant. Lead with it.
- **D&C is asked explicitly** in follow-ups or when the interviewer wants to see your D&C skills. The recurrence is $T(n) = 2T(n/2) + O(n)$ → Case 2 Master Theorem → O(n log n).
- **The cross-subarray computation is the core:** always scan outward from `mid`, not from `lo` or `hi`. The subarray must include `mid` and `mid+1`.
- **All-negative arrays:** The answer is the single largest element, not 0. Kadane handles this correctly by initializing `cur = nums[0]` (not 0).
- **D&C advantage:** It's more naturally parallelizable — each half can be processed independently on separate processors. Relevant in distributed computing contexts.
- **Return indices variant:** To also return the start/end indices, augment each return value to include `(maxSum, start, end)` — works for all three approaches.
