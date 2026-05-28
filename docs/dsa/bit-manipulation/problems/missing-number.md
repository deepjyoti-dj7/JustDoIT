---
title: Missing Number
difficulty: Easy
tags: [Bit Manipulation, Array, Math, Hash Table]
link: https://leetcode.com/problems/missing-number/
---

# Missing Number

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [268. Missing Number](https://leetcode.com/problems/missing-number/) |
| **Tags** | Bit Manipulation, Array, Math, Hash Table |

## Problem Statement

Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

**Example 1:**
```
Input:  nums = [3, 0, 1]
Output: 2
```

**Example 2:**
```
Input:  nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]
Output: 8
```

**Constraints:** `n == nums.length`, all numbers are distinct, each in `[0, n]`.

---

## Intuition

The array has `n` numbers drawn from `[0, n]` with exactly one missing. Three clean approaches:

1. **Sort and scan** — sort, then find the gap. O(n log n).
2. **Gauss formula** — the expected sum of `[0, n]` is `n*(n+1)/2`. Subtract the actual sum to get the missing number. O(n) time, O(1) space.
3. **XOR** — XOR all indices 0..n with all array values. Pairs cancel; the missing index survives. O(n) time, O(1) space.

Both approaches 2 and 3 are optimal. The XOR approach is the bit-manipulation answer; Gauss is the math answer. Know both.

---

## Approach 1: Gauss Formula (Math)

The sum of integers from 0 to n is `n * (n + 1) / 2`. The actual sum of `nums` is missing exactly one number. Their difference is the answer.

```cpp
int missingNumber(vector<int>& nums) {
    int n = nums.size();
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int x : nums) actual += x;
    return expected - actual;
}
```

```java
int missingNumber(int[] nums) {
    int n = nums.length;
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int x : nums) actual += x;
    return expected - actual;
}
```

```typescript
function missingNumber(nums: number[]): number {
    const n = nums.length;
    const expected = n * (n + 1) / 2;
    const actual = nums.reduce((sum, x) => sum + x, 0);
    return expected - actual;
}
```

```python
def missing_number(nums: list[int]) -> int:
    n = len(nums)
    return n * (n + 1) // 2 - sum(nums)
```

```go
func missingNumber(nums []int) int {
    n := len(nums)
    expected := n * (n + 1) / 2
    actual := 0
    for _, x := range nums { actual += x }
    return expected - actual
}
```

**Time:** O(n) — **Space:** O(1)

---

## Approach 2: XOR (Bit Manipulation)

XOR all values in `nums` together with all indices from `0` to `n`. Every number that appears in both cancels out (a ^ a = 0). The only survivor is the missing number.

```
nums = [3, 0, 1],  n = 3

XOR all indices:    0 ^ 1 ^ 2 ^ 3
XOR all values:     3 ^ 0 ^ 1

Combined: 0 ^ 1 ^ 2 ^ 3 ^ 3 ^ 0 ^ 1
        = (0^0) ^ (1^1) ^ (3^3) ^ 2
        = 0 ^ 0 ^ 0 ^ 2
        = 2  ✓
```

```cpp
int missingNumber(vector<int>& nums) {
    int result = nums.size();
    for (int i = 0; i < (int)nums.size(); i++)
        result ^= i ^ nums[i];
    return result;
}
```

```java
int missingNumber(int[] nums) {
    int result = nums.length;
    for (int i = 0; i < nums.length; i++)
        result ^= i ^ nums[i];
    return result;
}
```

```typescript
function missingNumber(nums: number[]): number {
    let result = nums.length;
    for (let i = 0; i < nums.length; i++)
        result ^= i ^ nums[i];
    return result;
}
```

```python
def missing_number(nums: list[int]) -> int:
    result = len(nums)
    for i, x in enumerate(nums):
        result ^= i ^ x
    return result
```

```go
func missingNumber(nums []int) int {
    result := len(nums)
    for i, x := range nums {
        result ^= i ^ x
    }
    return result
}
```

**Time:** O(n) — **Space:** O(1)

---

## Dry Run — XOR Approach

`nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]`, n = 9

Start: `result = 9`

XOR each `i ^ nums[i]` into `result`:
- i=0: result ^= 0 ^ 9
- i=1: result ^= 1 ^ 6
- i=2: result ^= 2 ^ 4
- i=3: result ^= 3 ^ 2
- i=4: result ^= 4 ^ 3
- i=5: result ^= 5 ^ 5
- i=6: result ^= 6 ^ 7
- i=7: result ^= 7 ^ 0
- i=8: result ^= 8 ^ 1

Every index 0..8 and every value 0..9 except 8 appears. Everything except 8 cancels. Result = **8** ✓

---

## Complexity Comparison

| Approach | Time | Space | Notes |
|---|---|---|---|
| Sort and scan | O(n log n) | O(1) | Modifies array (or needs copy) |
| Gauss formula | O(n) | O(1) | Risk of overflow for very large n |
| XOR | O(n) | O(1) | No overflow risk; purely bitwise |

---

## Key Interview Insights

- **Gauss vs XOR:** Both are O(n)/O(1). Gauss is more intuitive; XOR is the bit-manipulation showcase. Know which context the interviewer is testing.
- **Overflow concern with Gauss:** `n * (n + 1) / 2` can overflow 32-bit int for large n. Use `long` in Java/C++. Python handles big integers natively.
- **XOR trick generalization:** This same trick finds a missing number when the "complete" set is indices — very common in in-place array manipulation problems.
- **Why start result at n?** We need to XOR all values 0..n (n+1 values) against the n values in the array. Initializing to n means we XOR index `n` before the loop starts, correctly completing the full range.
- **Alternative XOR formulation:** `result = 0`, then loop `i` from 0 to n inclusive and XOR in `i`, then XOR in each `nums[i]`. Same result, slightly longer.
