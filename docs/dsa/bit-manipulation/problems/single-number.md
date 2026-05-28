---
title: Single Number
difficulty: Easy
tags: [Bit Manipulation, Array, XOR]
link: https://leetcode.com/problems/single-number/
---

# Single Number

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [136. Single Number](https://leetcode.com/problems/single-number/) |
| **Tags** | Bit Manipulation, Array, XOR |

## Problem Statement

Given a non-empty array of integers `nums`, every element appears **twice** except for one. Find that single one.

You must implement a solution with linear runtime complexity and use only constant extra space.

**Example 1:**
```
Input:  nums = [2, 2, 1]
Output: 1
```

**Example 2:**
```
Input:  nums = [4, 1, 2, 1, 2]
Output: 4
```

---

## Intuition

The constraint "constant space" rules out hash maps. This is the classic XOR self-cancellation problem.

XOR has two key properties:
- `a ^ a = 0` — any number XOR itself equals zero
- `a ^ 0 = a` — any number XOR zero equals itself

If every number appears twice, XOR-ing all elements cancels every pair to 0. The lone number XOR-s with 0 and survives unchanged.

```
[4, 1, 2, 1, 2]

4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)
= 4 ^ 0 ^ 0
= 4
```

Order doesn't matter — XOR is commutative and associative.

---

## Approach 1: Hash Map

Track the frequency of each number. Return the one with frequency 1.

```cpp
int singleNumber(vector<int>& nums) {
    unordered_map<int, int> freq;
    for (int n : nums) freq[n]++;
    for (auto& [num, cnt] : freq)
        if (cnt == 1) return num;
    return -1;
}
```

```java
int singleNumber(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    for (Map.Entry<Integer, Integer> e : freq.entrySet())
        if (e.getValue() == 1) return e.getKey();
    return -1;
}
```

```typescript
function singleNumber(nums: number[]): number {
    const freq = new Map<number, number>();
    for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
    for (const [num, cnt] of freq)
        if (cnt === 1) return num;
    return -1;
}
```

```python
def single_number(nums: list[int]) -> int:
    from collections import Counter
    return next(n for n, cnt in Counter(nums).items() if cnt == 1)
```

```go
func singleNumber(nums []int) int {
    freq := make(map[int]int)
    for _, n := range nums { freq[n]++ }
    for n, cnt := range freq {
        if cnt == 1 { return n }
    }
    return -1
}
```

**Time:** O(n) — **Space:** O(n)

---

## Approach 2: XOR (Optimal)

XOR all elements together. Every duplicate pair cancels to 0; the single number XORs with 0 and remains.

```cpp
int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int n : nums) result ^= n;
    return result;
}
```

```java
int singleNumber(int[] nums) {
    int result = 0;
    for (int n : nums) result ^= n;
    return result;
}
```

```typescript
function singleNumber(nums: number[]): number {
    return nums.reduce((acc, n) => acc ^ n, 0);
}
```

```python
def single_number(nums: list[int]) -> int:
    from functools import reduce
    from operator import xor
    return reduce(xor, nums)
```

```go
func singleNumber(nums []int) int {
    result := 0
    for _, n := range nums { result ^= n }
    return result
}
```

**Time:** O(n) — **Space:** O(1)

---

## Dry Run

```
nums = [4, 1, 2, 1, 2]

result = 0
  ^ 4  → 4   (0100)
  ^ 1  → 5   (0101)
  ^ 2  → 7   (0111)
  ^ 1  → 6   (0110)   ← 1 ^ 1 = 0 undoes the earlier XOR
  ^ 2  → 4   (0100)   ← 2 ^ 2 = 0 undoes the earlier XOR

return 4 ✓
```

---

## Key Interview Insights

- **The XOR trick is the intended answer.** Any interviewer who asks this wants to see `result ^= n` and the explanation of why it works.
- **Generalization:** "What if every number appears 3 times except one?" XOR doesn't work for k=3. You need a bit counter that resets at k — harder, involves tracking with two bitmasks.
- **Another generalization:** "Two numbers appear once, rest appear twice" — XOR all to get `a ^ b`, use any set bit to partition numbers into two groups, XOR each group to isolate `a` and `b`.
- The problem guarantees exactly one unique element. No edge-case handling needed.
