---
title: Counting Bits
difficulty: Easy
tags: [Bit Manipulation, Dynamic Programming]
link: https://leetcode.com/problems/counting-bits/
---

# Counting Bits

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [338. Counting Bits](https://leetcode.com/problems/counting-bits/) |
| **Tags** | Bit Manipulation, Dynamic Programming |

## Problem Statement

Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the **number of set bits** (1s) in the binary representation of `i`.

**Example 1:**
```
Input:  n = 2
Output: [0, 1, 1]
Explanation:
  0 → 0 (0 ones)
  1 → 1 (1 one)
  2 → 10 (1 one)
```

**Example 2:**
```
Input:  n = 5
Output: [0, 1, 1, 2, 1, 2]
Explanation:
  0 → 0    1 → 1    2 → 10
  3 → 11   4 → 100  5 → 101
```

---

## Intuition

We need the popcount (number of 1-bits) for every number from 0 to n.

**Naive:** Call a bit-counting function for each number. That's O(n log n) total.

**Better:** Notice that the bit counts have structure — we can compute them from smaller numbers we've already calculated. This is a DP problem hiding inside a bit manipulation problem.

Two elegant DP transitions exist:

**Option A — using right shift:** `i` and `i >> 1` differ only in the lowest bit. So:
```
dp[i] = dp[i >> 1] + (i & 1)
```
`i >> 1` is `i` with the last bit removed. We already computed its count. Just add whether the last bit of `i` is 1.

**Option B — using n & (n-1):** `n & (n-1)` clears the rightmost set bit. So:
```
dp[i] = dp[i & (i - 1)] + 1
```
`i & (i-1)` has one fewer set bit than `i`, and we've already computed it.

Both are O(n) time and O(n) space (for the output array).

---

## Approach 1: Brute Force — Count Bits per Number

Count set bits for each number independently using Brian Kernighan's method.

```cpp
vector<int> countBits(int n) {
    vector<int> ans(n + 1);
    for (int i = 0; i <= n; i++) {
        int x = i, cnt = 0;
        while (x) { x &= x - 1; cnt++; }
        ans[i] = cnt;
    }
    return ans;
}
```

```java
int[] countBits(int n) {
    int[] ans = new int[n + 1];
    for (int i = 0; i <= n; i++) {
        int x = i, cnt = 0;
        while (x != 0) { x &= x - 1; cnt++; }
        ans[i] = cnt;
    }
    return ans;
}
```

```typescript
function countBits(n: number): number[] {
    const ans = new Array(n + 1).fill(0);
    for (let i = 0; i <= n; i++) {
        let x = i, cnt = 0;
        while (x !== 0) { x &= x - 1; cnt++; }
        ans[i] = cnt;
    }
    return ans;
}
```

```python
def count_bits(n: int) -> list[int]:
    ans = []
    for i in range(n + 1):
        x, cnt = i, 0
        while x:
            x &= x - 1
            cnt += 1
        ans.append(cnt)
    return ans
```

```go
func countBits(n int) []int {
    ans := make([]int, n+1)
    for i := 0; i <= n; i++ {
        x, cnt := i, 0
        for x != 0 { x &= x - 1; cnt++ }
        ans[i] = cnt
    }
    return ans
}
```

**Time:** O(n log n) — **Space:** O(n) for the output

---

## Approach 2: DP — Right Shift Recurrence (Optimal)

`dp[i] = dp[i >> 1] + (i & 1)`

Every number `i` is just `i >> 1` (right-shifted by 1, i.e., i/2) with one more bit — the lowest bit of `i`.

```
i = 5 = 101   →   i >> 1 = 2 = 10
dp[5] = dp[2] + (5 & 1) = 1 + 1 = 2 ✓

i = 6 = 110   →   i >> 1 = 3 = 11
dp[6] = dp[3] + (6 & 1) = 2 + 0 = 2 ✓
```

```cpp
vector<int> countBits(int n) {
    vector<int> dp(n + 1, 0);
    for (int i = 1; i <= n; i++)
        dp[i] = dp[i >> 1] + (i & 1);
    return dp;
}
```

```java
int[] countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++)
        dp[i] = dp[i >> 1] + (i & 1);
    return dp;
}
```

```typescript
function countBits(n: number): number[] {
    const dp = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++)
        dp[i] = dp[i >> 1] + (i & 1);
    return dp;
}
```

```python
def count_bits(n: int) -> list[int]:
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp
```

```go
func countBits(n int) []int {
    dp := make([]int, n+1)
    for i := 1; i <= n; i++ {
        dp[i] = dp[i>>1] + i&1
    }
    return dp
}
```

**Time:** O(n) — **Space:** O(n) for the output (no extra space beyond the answer array)

---

## Dry Run

`n = 5`

| i | binary | i >> 1 | i & 1 | dp[i>>1] | dp[i] |
|---|---|---|---|---|---|
| 0 | 0 | — | — | — | 0 (base) |
| 1 | 1 | 0 | 1 | dp[0]=0 | 1 |
| 2 | 10 | 1 | 0 | dp[1]=1 | 1 |
| 3 | 11 | 1 | 1 | dp[1]=1 | 2 |
| 4 | 100 | 2 | 0 | dp[2]=1 | 1 |
| 5 | 101 | 2 | 1 | dp[2]=1 | 2 |

Output: `[0, 1, 1, 2, 1, 2]` ✓

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute (Brian Kernighan per number) | O(n log n) | O(n) |
| DP with right shift | O(n) | O(n) |
| DP with n & (n-1) | O(n) | O(n) |

---

## Key Interview Insights

- **The DP recurrence is the intended O(n) solution.** The shift-based one (`dp[i >> 1] + (i & 1)`) is slightly more intuitive because it maps to "chop off the last bit."
- **Why is dp[i >> 1] already computed?** Because `i >> 1 < i`, we always build on previously computed values in a single forward pass.
- **Alternative recurrence:** `dp[i] = dp[i & (i-1)] + 1` — uses the "clear rightmost bit" trick. Also valid.
- **Follow-up:** "What if you can't use extra space?" — you can't avoid O(n) since the output itself is O(n). The question means no extra space *beyond* the output.
- This problem nicely demonstrates how bit patterns have recursive structure — the same structure exploited in Fenwick Trees and bitmask DP.
