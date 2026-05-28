---
title: Longest Consecutive Sequence
difficulty: Medium
tags: [Array, Hash Set, Union Find]
link: https://leetcode.com/problems/longest-consecutive-sequence/
---

# Longest Consecutive Sequence

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [128. Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) |
| **Tags** | Array, Hash Set |

## Problem Statement

Given an unsorted array of integers `nums`, return the length of the longest sequence of consecutive integers (e.g., 4, 5, 6, 7).

**Constraint:** Must run in O(n) time.

Example: `nums = [100, 4, 200, 1, 3, 2]` → `4` (sequence: 1, 2, 3, 4)

## Intuition

**Brute force** sorts the array and scans for the longest run — O(n log n). The O(n log n) solution is elegant but violates the constraint.

**The O(n) insight:** A consecutive sequence has exactly one starting point — the element with no left neighbor. If `n - 1` is in the set, then `n` is not the start. We only expand sequences that begin from their true start, avoiding redundant work.

Use a hash set for O(1) lookup. For each number, check if `num - 1` exists. If not, it's a sequence start — count forward from there.

```
nums = [100, 4, 200, 1, 3, 2]
set  = {100, 4, 200, 1, 3, 2}

n=100: 99 not in set → start! count forward: 100,101? no → length 1
n=4:   3 in set → skip (not a start)
n=200: 199 not in set → start! count forward: 200,201? no → length 1
n=1:   0 not in set → start! count forward: 1,2,3,4,5? no → length 4
n=3:   2 in set → skip
n=2:   1 in set → skip

Longest: 4 ✓
```

## Approach 1: Sort — O(n log n)

Sort and scan, skipping duplicates.

```cpp
int longestConsecutive(vector<int>& nums) {
    if (nums.empty()) return 0;
    sort(nums.begin(), nums.end());
    int longest = 1, current = 1;
    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] == nums[i-1]) continue; // skip duplicate
        if (nums[i] == nums[i-1] + 1) current++;
        else current = 1;
        longest = max(longest, current);
    }
    return longest;
}
```

```java
int longestConsecutive(int[] nums) {
    if (nums.length == 0) return 0;
    Arrays.sort(nums);
    int longest = 1, current = 1;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] == nums[i-1]) continue;
        if (nums[i] == nums[i-1] + 1) current++;
        else current = 1;
        longest = Math.max(longest, current);
    }
    return longest;
}
```

```typescript
function longestConsecutive(nums: number[]): number {
    if (nums.length === 0) return 0;
    nums.sort((a, b) => a - b);
    let longest = 1, current = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i-1]) continue;
        if (nums[i] === nums[i-1] + 1) current++;
        else current = 1;
        longest = Math.max(longest, current);
    }
    return longest;
}
```

```python
def longest_consecutive(nums: list[int]) -> int:
    if not nums:
        return 0
    nums.sort()
    longest = current = 1
    for i in range(1, len(nums)):
        if nums[i] == nums[i-1]:
            continue
        if nums[i] == nums[i-1] + 1:
            current += 1
        else:
            current = 1
        longest = max(longest, current)
    return longest
```

```go
func longestConsecutive(nums []int) int {
    if len(nums) == 0 { return 0 }
    sort.Ints(nums)
    longest, current := 1, 1
    for i := 1; i < len(nums); i++ {
        if nums[i] == nums[i-1] { continue }
        if nums[i] == nums[i-1]+1 { current++ } else { current = 1 }
        if current > longest { longest = current }
    }
    return longest
}
```

**Time:** O(n log n) — **Space:** O(1) or O(n) depending on sort

## Approach 2: Hash Set — O(n)

Build a set, then for each sequence start (no left neighbor), count forward.

```cpp
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        int longest = 0;

        for (int n : numSet) {
            if (!numSet.count(n - 1)) { // sequence start
                int length = 1;
                while (numSet.count(n + length)) length++;
                longest = max(longest, length);
            }
        }
        return longest;
    }
};
```

```java
class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> numSet = new HashSet<>();
        for (int n : nums) numSet.add(n);

        int longest = 0;
        for (int n : numSet) {
            if (!numSet.contains(n - 1)) { // sequence start
                int length = 1;
                while (numSet.contains(n + length)) length++;
                longest = Math.max(longest, length);
            }
        }
        return longest;
    }
}
```

```typescript
function longestConsecutive(nums: number[]): number {
    const numSet = new Set(nums);
    let longest = 0;

    for (const n of numSet) {
        if (!numSet.has(n - 1)) { // sequence start
            let length = 1;
            while (numSet.has(n + length)) length++;
            longest = Math.max(longest, length);
        }
    }
    return longest;
}
```

```python
class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        num_set = set(nums)
        longest = 0

        for n in num_set:
            if n - 1 not in num_set:  # sequence start
                length = 1
                while n + length in num_set:
                    length += 1
                longest = max(longest, length)

        return longest
```

```go
func longestConsecutive(nums []int) int {
    numSet := map[int]bool{}
    for _, n := range nums { numSet[n] = true }

    longest := 0
    for n := range numSet {
        if !numSet[n-1] { // sequence start
            length := 1
            for numSet[n+length] { length++ }
            if length > longest { longest = length }
        }
    }
    return longest
}
```

**Time:** O(n) — **Space:** O(n)

## Why the Inner While Loop Doesn't Make This O(n²)

The key insight: **each number is visited by the inner while loop at most once across all outer iterations.** We only enter the while loop for sequence *starts*. If `n` is a start, we count `n, n+1, n+2, ...` — none of those have `n-1` in the set (since `n` is the start), so they never trigger their own inner loops.

Total work across all inner while loops = total number of elements in all sequences = n. So overall: O(n).

## Dry Run

`nums = [100, 4, 200, 1, 3, 2]`

Set: `{1, 2, 3, 4, 100, 200}`

| n | n-1 in set? | Sequence start? | Count forward |
|---|---|---|---|
| 1 | 0 — No | ✓ | 1→2→3→4→5? No → length=4 |
| 2 | 1 — Yes | ✗ | skip |
| 3 | 2 — Yes | ✗ | skip |
| 4 | 3 — Yes | ✗ | skip |
| 100 | 99 — No | ✓ | 100→101? No → length=1 |
| 200 | 199 — No | ✓ | 200→201? No → length=1 |

Longest: **4** ✓

## Key Interview Insights

- **Iterate over the set, not the array.** If you iterate over the original array and there are duplicates, you'd re-process the same sequence start multiple times. Iterating over the set avoids this.
- **The "sequence start" check is the critical optimization.** Without it, every element triggers a while loop and you get O(n²) worst case.
- **Edge case: empty array.** Return 0. Both the set-based and sort-based approaches handle this with an early guard.
- **Edge case: all duplicates.** `[1, 1, 1]` — set = `{1}`. Only `n=1` is a start (0 not in set). Count: 1→2? No. Length = 1. Correct.
- **This O(n) approach beats any sort-based approach for large inputs** and is one of the canonical examples of trading O(n) space for a factor of log n in time.

