---
title: First Missing Positive
difficulty: Hard
tags: [Array, Hash Table, In-place]
link: https://leetcode.com/problems/first-missing-positive/
---

# First Missing Positive

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [41. First Missing Positive](https://leetcode.com/problems/first-missing-positive/) |
| **Tags** | Array, Hash Table, In-place |

## Problem Statement

Given an unsorted integer array `nums`, return the **smallest positive integer** that does not appear in the array.

**Constraints:** Must run in O(n) time **and** O(1) extra space.

Examples:
- `[1, 2, 0]` → `3`
- `[3, 4, -1, 1]` → `2`
- `[7, 8, 9, 11, 12]` → `1`

## Intuition

**Key insight:** The answer must be in the range `[1, n+1]`. Why? An array of `n` elements can contain at most `n` distinct positive integers in `[1, n]`. If all of 1 through n are present, the answer is `n+1`. Otherwise, the answer is some missing value in `[1, n]`.

This bounds the search space to `[1, n+1]`, which is also exactly the size of the input array — letting us use the **array itself as a hash table**.

**Index as hash:** Place each number `x` where `1 ≤ x ≤ n` at index `x - 1`. Then scan for the first index `i` where `nums[i] != i + 1`. That index gives us the answer `i + 1`.

## Approach 1: Hash Set — O(n) time, O(n) space

Simple but uses extra space — violates the hard constraint. Good to mention as the stepping stone.

```cpp
int firstMissingPositive(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    for (int i = 1; ; i++) {
        if (!s.count(i)) return i;
    }
}
```

```java
int firstMissingPositive(int[] nums) {
    Set<Integer> s = new HashSet<>();
    for (int n : nums) s.add(n);
    for (int i = 1; ; i++) {
        if (!s.contains(i)) return i;
    }
}
```

```typescript
function firstMissingPositive(nums: number[]): number {
    const s = new Set(nums);
    for (let i = 1; ; i++) {
        if (!s.has(i)) return i;
    }
}
```

```python
def first_missing_positive(nums: list[int]) -> int:
    s = set(nums)
    i = 1
    while i in s:
        i += 1
    return i
```

```go
func firstMissingPositive(nums []int) int {
    s := map[int]bool{}
    for _, n := range nums { s[n] = true }
    for i := 1; ; i++ {
        if !s[i] { return i }
    }
}
```

**Time:** O(n) — **Space:** O(n) ← violates constraint

## Approach 2: Array as Hash Table — O(n) time, O(1) space

Use the input array itself as storage. For each number in `[1, n]`, swap it to its "correct" index (`num - 1`).

**Algorithm:**
1. For each index `i`, while `nums[i]` is in `[1, n]` and not already at its correct position (`nums[nums[i]-1] != nums[i]`), swap `nums[i]` to index `nums[i] - 1`.
2. Scan the array: first index `i` where `nums[i] != i + 1` → answer is `i + 1`.
3. If all positions are correct → answer is `n + 1`.

```cpp
class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = nums.size();

        // Place each number at its correct index
        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                swap(nums[i], nums[nums[i] - 1]);
            }
        }

        // Find first index where value doesn't match
        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }
        return n + 1;
    }
};
```

```java
class Solution {
    public int firstMissingPositive(int[] nums) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                int temp = nums[nums[i] - 1];
                nums[nums[i] - 1] = nums[i];
                nums[i] = temp;
            }
        }

        for (int i = 0; i < n; i++) {
            if (nums[i] != i + 1) return i + 1;
        }
        return n + 1;
    }
}
```

```typescript
function firstMissingPositive(nums: number[]): number {
    const n = nums.length;

    for (let i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            const j = nums[i] - 1;
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }
    }

    for (let i = 0; i < n; i++) {
        if (nums[i] !== i + 1) return i + 1;
    }
    return n + 1;
}
```

```python
class Solution:
    def firstMissingPositive(self, nums: list[int]) -> int:
        n = len(nums)

        for i in range(n):
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                j = nums[i] - 1
                nums[i], nums[j] = nums[j], nums[i]

        for i in range(n):
            if nums[i] != i + 1:
                return i + 1

        return n + 1
```

```go
func firstMissingPositive(nums []int) int {
    n := len(nums)

    for i := 0; i < n; i++ {
        for nums[i] > 0 && nums[i] <= n && nums[nums[i]-1] != nums[i] {
            j := nums[i] - 1
            nums[i], nums[j] = nums[j], nums[i]
        }
    }

    for i := 0; i < n; i++ {
        if nums[i] != i+1 { return i + 1 }
    }
    return n + 1
}
```

**Time:** O(n) — **Space:** O(1)

## Why the Swap Loop Is O(n) Total

Each swap places at least one element at its correct position. An element already at its correct position is never moved again (the condition `nums[nums[i]-1] != nums[i]` prevents it). So across all iterations, the total number of swaps is at most `n`.

## Dry Run

`nums = [3, 4, -1, 1]`, n = 4

**Placement phase:**

| i | nums | Action |
|---|---|---|
| 0 | [3, 4, -1, 1] | nums[0]=3, target idx 2. nums[2]=-1≠3 → swap(0,2) |
| 0 | [-1, 4, 3, 1] | nums[0]=-1, not in [1,4] → stop |
| 1 | [-1, 4, 3, 1] | nums[1]=4, target idx 3. nums[3]=1≠4 → swap(1,3) |
| 1 | [-1, 1, 3, 4] | nums[1]=1, target idx 0. nums[0]=-1≠1 → swap(1,0) |
| 1 | [1, -1, 3, 4] | nums[1]=-1, not in [1,4] → stop |
| 2 | [1, -1, 3, 4] | nums[2]=3, target idx 2. nums[2]=3=3 → already correct → stop |
| 3 | [1, -1, 3, 4] | nums[3]=4, target idx 3. nums[3]=4=4 → already correct → stop |

After placement: `[1, -1, 3, 4]`

**Scan phase:** i=0: 1==1 ✓ — i=1: -1≠2 → **return 2** ✓

## Key Interview Insights

- **Always present the hash-set approach first**, then say "but the constraint is O(1) space, so we need to use the array itself as a hash table."
- **The answer is always in `[1, n+1]`** — this is the key theorem that makes the approach work. State it explicitly in your interview.
- **The while loop condition has three parts:**
  1. `nums[i] > 0` — only positive numbers have valid indices
  2. `nums[i] <= n` — only numbers in range can be placed
  3. `nums[nums[i]-1] != nums[i]` — avoid infinite loops on duplicates (e.g., `[1, 1]`)
- **Duplicates are handled naturally** — if `nums[i] == nums[j]` for two positions, the condition prevents swapping and the duplicate ends up "homeless," which is fine since we only need to find the first missing.
- **The marking technique (alternative):** Some solutions mark "seen" numbers by negating values at their positions. This also works but is trickier to reason about cleanly. The swap-to-correct-position approach is cleaner for interviews.
- **This is the canonical "use the array as a hash" problem.** Understanding it deeply unlocks a whole class of in-place hashing problems.

