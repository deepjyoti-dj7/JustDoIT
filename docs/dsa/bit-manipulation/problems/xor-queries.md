---
title: XOR Queries of a Subarray
difficulty: Medium
tags: [Bit Manipulation, Array, Prefix Sum]
link: https://leetcode.com/problems/xor-queries-of-a-subarray/
---

# XOR Queries of a Subarray

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [1310. XOR Queries of a Subarray](https://leetcode.com/problems/xor-queries-of-a-subarray/) |
| **Tags** | Bit Manipulation, Array, Prefix Sum |

## Problem Statement

You are given an array `arr` of positive integers and a 2D array `queries`, where `queries[i] = [left, right]`.

For each query `[left, right]`, compute the **XOR of all elements** from `arr[left]` to `arr[right]` inclusive.

Return an array of the results.

**Example 1:**
```
Input:  arr = [1, 3, 4, 8], queries = [[0,1],[1,2],[0,3],[3,3]]
Output: [2, 7, 14, 8]

Explanation:
  [0,1]: 1 ^ 3 = 2
  [1,2]: 3 ^ 4 = 7
  [0,3]: 1 ^ 3 ^ 4 ^ 8 = 14
  [3,3]: 8
```

**Example 2:**
```
Input:  arr = [4, 8, 2, 10], queries = [[2,3],[1,3],[0,0],[0,3]]
Output: [8, 0, 4, 0]
```

---

## Intuition

This is the **prefix XOR** technique — the bit-manipulation analog of prefix sums.

XOR has a special cancellation property: `a ^ a = 0`. So if we define:

```
prefix[i] = arr[0] ^ arr[1] ^ ... ^ arr[i-1]
```

Then the XOR of elements from index `l` to `r` is:

```
xor(l, r) = prefix[r+1] ^ prefix[l]
```

**Why?** Because `prefix[r+1] ^ prefix[l]` expands to:

```
(arr[0] ^ ... ^ arr[r]) ^ (arr[0] ^ ... ^ arr[l-1])
```

The elements from `arr[0]` to `arr[l-1]` appear in both — they XOR to 0 and cancel. Only `arr[l] ^ ... ^ arr[r]` remains.

This is exactly the same logic as prefix sums: `sum(l, r) = prefix[r+1] - prefix[l]`, but using XOR's self-inverse property instead of subtraction.

---

## Approach 1: Brute Force — XOR Each Query Directly

For each query `[l, r]`, iterate from `l` to `r` and XOR all elements.

```cpp
vector<int> xorQueries(vector<int>& arr, vector<vector<int>>& queries) {
    vector<int> result;
    for (auto& q : queries) {
        int xorVal = 0;
        for (int i = q[0]; i <= q[1]; i++)
            xorVal ^= arr[i];
        result.push_back(xorVal);
    }
    return result;
}
```

```java
int[] xorQueries(int[] arr, int[][] queries) {
    int[] result = new int[queries.length];
    for (int q = 0; q < queries.length; q++) {
        int xorVal = 0;
        for (int i = queries[q][0]; i <= queries[q][1]; i++)
            xorVal ^= arr[i];
        result[q] = xorVal;
    }
    return result;
}
```

```typescript
function xorQueries(arr: number[], queries: number[][]): number[] {
    return queries.map(([l, r]) => {
        let xorVal = 0;
        for (let i = l; i <= r; i++) xorVal ^= arr[i];
        return xorVal;
    });
}
```

```python
def xor_queries(arr: list[int], queries: list[list[int]]) -> list[int]:
    result = []
    for l, r in queries:
        xor_val = 0
        for i in range(l, r + 1):
            xor_val ^= arr[i]
        result.append(xor_val)
    return result
```

```go
func xorQueries(arr []int, queries [][]int) []int {
    result := make([]int, len(queries))
    for q, query := range queries {
        xorVal := 0
        for i := query[0]; i <= query[1]; i++ {
            xorVal ^= arr[i]
        }
        result[q] = xorVal
    }
    return result
}
```

**Time:** O(n * q) where n = array length, q = number of queries — **Space:** O(1) extra

---

## Approach 2: Prefix XOR (Optimal)

Build a prefix XOR array in O(n). Answer each query in O(1).

`prefix[0] = 0`
`prefix[i] = prefix[i-1] ^ arr[i-1]`

Query `[l, r]` → `prefix[r+1] ^ prefix[l]`

```cpp
vector<int> xorQueries(vector<int>& arr, vector<vector<int>>& queries) {
    int n = arr.size();
    vector<int> prefix(n + 1, 0);
    for (int i = 0; i < n; i++)
        prefix[i + 1] = prefix[i] ^ arr[i];

    vector<int> result;
    for (auto& q : queries)
        result.push_back(prefix[q[1] + 1] ^ prefix[q[0]]);
    return result;
}
```

```java
int[] xorQueries(int[] arr, int[][] queries) {
    int n = arr.length;
    int[] prefix = new int[n + 1];
    for (int i = 0; i < n; i++)
        prefix[i + 1] = prefix[i] ^ arr[i];

    int[] result = new int[queries.length];
    for (int q = 0; q < queries.length; q++)
        result[q] = prefix[queries[q][1] + 1] ^ prefix[queries[q][0]];
    return result;
}
```

```typescript
function xorQueries(arr: number[], queries: number[][]): number[] {
    const prefix = new Array(arr.length + 1).fill(0);
    for (let i = 0; i < arr.length; i++)
        prefix[i + 1] = prefix[i] ^ arr[i];

    return queries.map(([l, r]) => prefix[r + 1] ^ prefix[l]);
}
```

```python
def xor_queries(arr: list[int], queries: list[list[int]]) -> list[int]:
    prefix = [0] * (len(arr) + 1)
    for i, x in enumerate(arr):
        prefix[i + 1] = prefix[i] ^ x

    return [prefix[r + 1] ^ prefix[l] for l, r in queries]
```

```go
func xorQueries(arr []int, queries [][]int) []int {
    n := len(arr)
    prefix := make([]int, n+1)
    for i, x := range arr {
        prefix[i+1] = prefix[i] ^ x
    }

    result := make([]int, len(queries))
    for q, query := range queries {
        result[q] = prefix[query[1]+1] ^ prefix[query[0]]
    }
    return result
}
```

**Time:** O(n + q) — **Space:** O(n) for prefix array

---

## Dry Run

`arr = [1, 3, 4, 8]`

Build prefix:
```
prefix[0] = 0
prefix[1] = 0 ^ 1 = 1
prefix[2] = 1 ^ 3 = 2
prefix[3] = 2 ^ 4 = 6
prefix[4] = 6 ^ 8 = 14
```

Queries:
```
[0,1]: prefix[2] ^ prefix[0] = 2 ^ 0 = 2   ✓
[1,2]: prefix[3] ^ prefix[1] = 6 ^ 1 = 7   ✓
[0,3]: prefix[4] ^ prefix[0] = 14 ^ 0 = 14  ✓
[3,3]: prefix[4] ^ prefix[3] = 14 ^ 6 = 8   ✓
```

---

## Why `prefix[r+1] ^ prefix[l]` Works

```
prefix[r+1] = arr[0] ^ arr[1] ^ ... ^ arr[r]
prefix[l]   = arr[0] ^ arr[1] ^ ... ^ arr[l-1]

prefix[r+1] ^ prefix[l]
= (arr[0] ^ ... ^ arr[l-1] ^ arr[l] ^ ... ^ arr[r])
  ^ (arr[0] ^ ... ^ arr[l-1])

= arr[l] ^ arr[l+1] ^ ... ^ arr[r]    (elements 0..l-1 cancel)
```

Self-cancellation (`x ^ x = 0`) does the work.

---

## Complexity

| Approach | Time | Space | Per Query |
|---|---|---|---|
| Brute force | O(n × q) | O(1) | O(n) |
| Prefix XOR | O(n + q) | O(n) | O(1) |

---

## Key Interview Insights

- **Prefix XOR is the bit-manipulation mirror of prefix sums.** If you know prefix sums, this is immediate. The key is recognizing that XOR (like addition) is associative and has a cancellation inverse (`x ^ x = 0`).
- **The `+ 1` offset in `prefix`:** The prefix array is 1-indexed so that `prefix[0] = 0` acts as an identity. This avoids a special case for `l = 0`.
- **Modifying in-place:** You can compute the prefix XOR directly in `arr` to save space, then recover query results. Trade-off: destroys the input.
- **Common mistake:** Writing `prefix[r] ^ prefix[l-1]` (0-indexed without the offset) and then panicking on `l = 0`. The `n+1` sized prefix with offset avoids all edge cases cleanly.
- **Generalizes to:** Any operation that is associative and has an inverse — XOR (inverse = itself), addition (inverse = subtraction), multiplication with modular inverse. Bitwise AND/OR do NOT have inverses, so prefix-AND/OR tricks don't work the same way.
