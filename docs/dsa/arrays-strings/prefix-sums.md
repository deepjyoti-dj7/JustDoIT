---
title: Prefix Sums
description: Precompute cumulative sums for efficient range queries
---

# Prefix Sums

Prefix sums transform any range-sum query from O(n) to O(1) after a single O(n) preprocessing step. This technique is deceptively simple yet appears in a huge number of interview problems — often disguised under other names.

## Core Intuition

Instead of summing elements from index `i` to `j` every time (O(n)), precompute a running total so that any range sum is just a subtraction.

Given array `nums = [2, 4, 1, 3, 5]`:

| Index | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| nums | 2 | 4 | 1 | 3 | 5 |
| prefix | 2 | 6 | 7 | 10 | 15 |

**Range sum from index 1 to 3:** `prefix[3] - prefix[0] = 10 - 2 = 8` → which is `4 + 1 + 3 = 8` ✓

The formula:

> sum[i, j] = prefix[j] - prefix[i - 1]

To handle the `i = 0` edge case cleanly, use a prefix array of size `n + 1` where `prefix[0] = 0`:

| Index | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| prefix | 0 | 2 | 6 | 7 | 10 | 15 |

Now: `sum(i, j) = prefix[j + 1] - prefix[i]` — no special cases needed.

## Building a Prefix Sum Array

```cpp
vector<int> buildPrefix(vector<int>& nums) {
    int n = nums.size();
    vector<int> prefix(n + 1, 0);
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    return prefix;
}

// Range sum query: sum of nums[i..j] inclusive
int rangeSum(vector<int>& prefix, int i, int j) {
    return prefix[j + 1] - prefix[i];
}
```

```java
int[] buildPrefix(int[] nums) {
    int n = nums.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    return prefix;
}

int rangeSum(int[] prefix, int i, int j) {
    return prefix[j + 1] - prefix[i];
}
```

```typescript
function buildPrefix(nums: number[]): number[] {
    const prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    return prefix;
}

function rangeSum(prefix: number[], i: number, j: number): number {
    return prefix[j + 1] - prefix[i];
}
```

```python
def build_prefix(nums: list[int]) -> list[int]:
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]
    return prefix

def range_sum(prefix: list[int], i: int, j: int) -> int:
    return prefix[j + 1] - prefix[i]
```

```go
func buildPrefix(nums []int) []int {
    prefix := make([]int, len(nums)+1)
    for i := 0; i < len(nums); i++ {
        prefix[i+1] = prefix[i] + nums[i]
    }
    return prefix
}

func rangeSum(prefix []int, i, j int) int {
    return prefix[j+1] - prefix[i]
}
```

## When to Use Prefix Sums

**Identification signals:**
- "Sum of elements between indices i and j"
- "Number of subarrays with sum equal to K"
- "Subarray sum" in any form
- "Running total" or "cumulative"
- Multiple range queries on a static array

**NOT prefix sums when:**
- Array is being modified between queries → use a Segment Tree or BIT
- You need min/max of a range → use Sparse Table or Segment Tree

## The Prefix Sum + HashMap Pattern

This is the most important interview pattern involving prefix sums. It solves:

> "Count subarrays with sum equal to K"

**Key insight:** If `prefix[j] - prefix[i] = K`, then the subarray `(i, j]` has sum K. So for each index `j`, we need to know how many earlier prefix sums equal `prefix[j] - K`.

```cpp
int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> prefixCount;
    prefixCount[0] = 1; // empty prefix
    int sum = 0, count = 0;
    for (int num : nums) {
        sum += num;
        if (prefixCount.count(sum - k)) {
            count += prefixCount[sum - k];
        }
        prefixCount[sum]++;
    }
    return count;
}
```

```java
int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixCount = new HashMap<>();
    prefixCount.put(0, 1);
    int sum = 0, count = 0;
    for (int num : nums) {
        sum += num;
        count += prefixCount.getOrDefault(sum - k, 0);
        prefixCount.merge(sum, 1, Integer::sum);
    }
    return count;
}
```

```typescript
function subarraySum(nums: number[], k: number): number {
    const prefixCount = new Map<number, number>([[0, 1]]);
    let sum = 0, count = 0;
    for (const num of nums) {
        sum += num;
        count += prefixCount.get(sum - k) ?? 0;
        prefixCount.set(sum, (prefixCount.get(sum) ?? 0) + 1);
    }
    return count;
}
```

```python
def subarray_sum(nums: list[int], k: int) -> int:
    prefix_count = {0: 1}
    total = 0
    count = 0
    for num in nums:
        total += num
        count += prefix_count.get(total - k, 0)
        prefix_count[total] = prefix_count.get(total, 0) + 1
    return count
```

```go
func subarraySum(nums []int, k int) int {
    prefixCount := map[int]int{0: 1}
    sum, count := 0, 0
    for _, num := range nums {
        sum += num
        count += prefixCount[sum-k]
        prefixCount[sum]++
    }
    return count
}
```

> **Why `prefixCount[0] = 1`?** It represents the empty prefix. If the running sum itself equals K, we need to count that subarray starting from index 0.

## Variations

### Prefix XOR

Same concept but with XOR instead of addition. Useful because `XOR(i, j) = prefix[j] ^ prefix[i-1]`.

### Prefix Product

Use multiplication instead of addition. Watch out for **zeros** — they require special handling since you can't divide by zero.

### 2D Prefix Sum

For matrix range queries. Compute the cumulative sum over a 2D grid using inclusion-exclusion:

$$\text{prefix}[i][j] = \text{grid}[i][j] + \text{prefix}[i-1][j] + \text{prefix}[i][j-1] - \text{prefix}[i-1][j-1]$$

Query the sum of a submatrix `(r1, c1)` to `(r2, c2)`:

$$\text{sum} = P[r2][c2] - P[r1-1][c2] - P[r2][c1-1] + P[r1-1][c1-1]$$

### Difference Array

The "inverse" of prefix sums. Given range updates `add val to [l, r]`, mark `+val` at `l` and `-val` at `r+1`, then take prefix sums to get the final array. Turns O(n) range updates into O(1) each.

## Common Pitfalls

1. **Off-by-one errors** — The most common mistake. Use the `n+1` sized prefix array to avoid index gymnastics.
2. **Integer overflow** — Prefix sums grow large. Use `long` in Java or `long long` in C++.
3. **Forgetting `prefixCount[0] = 1`** — This accounts for subarrays starting from index 0.
4. **Confusing prefix sum index with array index** — `prefix[i]` represents the sum of the first `i` elements, not the element at index `i`.

## Complexity Analysis

| Operation | Time | Space |
|---|---|---|
| Build prefix array | O(n) | O(n) |
| Range sum query | O(1) | — |
| Subarray sum equals K | O(n) | O(n) |
| 2D prefix sum build | O(m × n) | O(m × n) |
| 2D range query | O(1) | — |

## Common Interview Problems

| Problem | Key Idea |
|---|---|
| Range Sum Query - Immutable | Basic prefix sum |
| Subarray Sum Equals K | Prefix sum + HashMap |
| Contiguous Array | Transform 0→-1, then prefix sum + map |
| Product of Array Except Self | Prefix and suffix products |
| Find Pivot Index | Left sum = total - left sum - nums[i] |
| Subarray Sums Divisible by K | Prefix sum mod K + HashMap |
