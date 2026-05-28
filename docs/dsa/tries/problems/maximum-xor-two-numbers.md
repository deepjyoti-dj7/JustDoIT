---
title: Maximum XOR of Two Numbers in an Array
difficulty: Medium
tags: [Trie, Bit Manipulation, Array, Hash Map]
link: https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/
---

# Maximum XOR of Two Numbers in an Array

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [421. Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/) |
| **Tags** | Trie, Bit Manipulation, Array, Hash Map |

## Problem Statement

Given an integer array `nums`, return the maximum result of `nums[i] XOR nums[j]` where `0 ≤ i ≤ j < n`.

Example: `nums = [3, 10, 5, 25, 2, 8]` → `28`

Explanation: `5 XOR 25 = 00101 XOR 11001 = 11100 = 28`

## Intuition

### XOR Refresher

XOR (`^`) of two bits is `1` when they differ. So to **maximize XOR**, we want bit positions where the two numbers have **opposite bits** — especially the most significant bits (MSB first).

```
a = 5  = 00101
b = 25 = 11001
XOR    = 11100 = 28  ← maximized by having 1s in high positions
```

### Brute Force

Try all pairs — O(n²). For n = 2×10^5, this is 4×10^10 operations — too slow.

### Hash Map Approach — O(32n)

For each bit position from MSB to LSB, greedily try to set that bit in the result:

1. Collect all prefixes of length `bit` for all numbers
2. For each prefix `p`, check if `p XOR (desired_result)` exists among the prefixes
3. If yes, that bit can be 1 in our answer

```
For bit position 4 (value 16):
  Candidate result = current_max | (1 << bit)
  For each prefix p in prefix_set:
    if (p XOR candidate) in prefix_set → this bit can be 1!
```

This is clever but the trie approach is more intuitive and direct.

### Binary Trie Approach — O(32n)

Store all numbers bit-by-bit in a trie (MSB first = bit 31 down to bit 0). For each number `n`, greedily traverse the trie choosing the opposite bit at each level to maximize XOR.

At bit position `i`:
- Current bit of `n` = `b = (num >> i) & 1`
- To maximize XOR at this bit: we want `b XOR x = 1`, so we want `x = 1 - b` (the opposite)
- If the trie has a node for `1-b`, go there (XOR bit = 1, contributes `1 << i` to result)
- Otherwise, go with `b` (XOR bit = 0)

This is a **greedy** strategy: maximize the highest-order bits first.

## Approach 1: Brute Force — O(n²)

```cpp
int findMaximumXOR(vector<int>& nums) {
    int maxXor = 0;
    int n = nums.size();
    for (int i = 0; i < n; i++)
        for (int j = i; j < n; j++)
            maxXor = max(maxXor, nums[i] ^ nums[j]);
    return maxXor;
}
```

```java
int findMaximumXOR(int[] nums) {
    int maxXor = 0;
    for (int i = 0; i < nums.length; i++)
        for (int j = i; j < nums.length; j++)
            maxXor = Math.max(maxXor, nums[i] ^ nums[j]);
    return maxXor;
}
```

```typescript
function findMaximumXOR(nums: number[]): number {
    let maxXor = 0;
    for (let i = 0; i < nums.length; i++)
        for (let j = i; j < nums.length; j++)
            maxXor = Math.max(maxXor, nums[i] ^ nums[j]);
    return maxXor;
}
```

```python
def find_maximum_xor(nums: list[int]) -> int:
    max_xor = 0
    for i in range(len(nums)):
        for j in range(i, len(nums)):
            max_xor = max(max_xor, nums[i] ^ nums[j])
    return max_xor
```

```go
func findMaximumXOR(nums []int) int {
    maxXor := 0
    for i := 0; i < len(nums); i++ {
        for j := i; j < len(nums); j++ {
            if nums[i]^nums[j] > maxXor { maxXor = nums[i] ^ nums[j] }
        }
    }
    return maxXor
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Hash Map (Prefix Greedy) — O(32n)

Build the maximum XOR bit by bit from MSB. For each bit, check if we can set it to 1 using any pair of prefixes.

```cpp
int findMaximumXOR(vector<int>& nums) {
    int maxXor = 0, mask = 0;

    for (int i = 31; i >= 0; i--) {
        mask |= (1 << i);
        unordered_set<int> prefixes;
        for (int n : nums) prefixes.insert(n & mask);

        int candidate = maxXor | (1 << i);
        for (int prefix : prefixes) {
            if (prefixes.count(prefix ^ candidate)) {
                maxXor = candidate;
                break;
            }
        }
    }
    return maxXor;
}
```

```java
int findMaximumXOR(int[] nums) {
    int maxXor = 0, mask = 0;
    for (int i = 31; i >= 0; i--) {
        mask |= (1 << i);
        Set<Integer> prefixes = new HashSet<>();
        for (int n : nums) prefixes.add(n & mask);

        int candidate = maxXor | (1 << i);
        for (int prefix : prefixes) {
            if (prefixes.contains(prefix ^ candidate)) { maxXor = candidate; break; }
        }
    }
    return maxXor;
}
```

```typescript
function findMaximumXOR(nums: number[]): number {
    let maxXor = 0, mask = 0;
    for (let i = 31; i >= 0; i--) {
        mask |= (1 << i);
        const prefixes = new Set(nums.map(n => n & mask));
        const candidate = maxXor | (1 << i);
        if ([...prefixes].some(p => prefixes.has(p ^ candidate))) {
            maxXor = candidate;
        }
    }
    return maxXor;
}
```

```python
def find_maximum_xor(nums: list[int]) -> int:
    max_xor = mask = 0
    for i in range(31, -1, -1):
        mask |= (1 << i)
        prefixes = {n & mask for n in nums}
        candidate = max_xor | (1 << i)
        if any((prefix ^ candidate) in prefixes for prefix in prefixes):
            max_xor = candidate
    return max_xor
```

```go
func findMaximumXOR(nums []int) int {
    maxXor, mask := 0, 0
    for i := 31; i >= 0; i-- {
        mask |= (1 << i)
        prefixes := map[int]bool{}
        for _, n := range nums { prefixes[n&mask] = true }
        candidate := maxXor | (1 << i)
        for prefix := range prefixes {
            if prefixes[prefix^candidate] { maxXor = candidate; break }
        }
    }
    return maxXor
}
```

**Time:** O(32n) = O(n) — **Space:** O(n) for prefix sets

## Approach 3: Binary Trie — O(32n)

Insert all numbers into a binary trie (MSB first). For each number, traverse the trie greedily choosing the opposite bit at each level to maximize XOR.

```cpp
class Solution {
    struct TrieNode {
        TrieNode* children[2] = {};
    };

    TrieNode* root = new TrieNode();

    void insert(int num) {
        TrieNode* node = root;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            if (!node->children[bit]) node->children[bit] = new TrieNode();
            node = node->children[bit];
        }
    }

    int maxXorWith(int num) {
        TrieNode* node = root;
        int result = 0;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            int want = 1 - bit; // prefer opposite to maximize XOR
            if (node->children[want]) {
                result |= (1 << i);
                node = node->children[want];
            } else {
                node = node->children[bit]; // fall back to same bit
            }
        }
        return result;
    }

public:
    int findMaximumXOR(vector<int>& nums) {
        for (int n : nums) insert(n);
        int maxXor = 0;
        for (int n : nums) maxXor = max(maxXor, maxXorWith(n));
        return maxXor;
    }
};
```

```java
class Solution {
    private int[][] trie = new int[32 * 100001][2]; // array-based trie, faster
    private int trieSize = 1;

    private void insert(int num) {
        int node = 0;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            if (trie[node][bit] == 0) trie[node][bit] = trieSize++;
            node = trie[node][bit];
        }
    }

    private int maxXorWith(int num) {
        int node = 0, result = 0;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1, want = 1 - bit;
            if (trie[node][want] != 0) { result |= (1 << i); node = trie[node][want]; }
            else { node = trie[node][bit]; }
        }
        return result;
    }

    public int findMaximumXOR(int[] nums) {
        for (int n : nums) insert(n);
        int maxXor = 0;
        for (int n : nums) maxXor = Math.max(maxXor, maxXorWith(n));
        return maxXor;
    }
}
```

```typescript
class XorTrieNode {
    children: [XorTrieNode | null, XorTrieNode | null] = [null, null];
}

function findMaximumXOR(nums: number[]): number {
    const root = new XorTrieNode();

    const insert = (num: number): void => {
        let node = root;
        for (let i = 31; i >= 0; i--) {
            const bit = (num >> i) & 1;
            if (!node.children[bit]) node.children[bit] = new XorTrieNode();
            node = node.children[bit]!;
        }
    };

    const maxXorWith = (num: number): number => {
        let node = root, result = 0;
        for (let i = 31; i >= 0; i--) {
            const bit = (num >> i) & 1, want = 1 - bit;
            if (node.children[want]) {
                result |= (1 << i);
                node = node.children[want]!;
            } else {
                node = node.children[bit]!;
            }
        }
        return result;
    };

    for (const n of nums) insert(n);
    return Math.max(...nums.map(maxXorWith));
}
```

```python
class Solution:
    def findMaximumXOR(self, nums: list[int]) -> int:
        # Use nested lists as trie nodes: [left_child(0), right_child(1)]
        root = [None, None]

        def insert(num: int) -> None:
            node = root
            for i in range(31, -1, -1):
                bit = (num >> i) & 1
                if node[bit] is None:
                    node[bit] = [None, None]
                node = node[bit]

        def max_xor_with(num: int) -> int:
            node, result = root, 0
            for i in range(31, -1, -1):
                bit = (num >> i) & 1
                want = 1 - bit  # prefer opposite bit
                if node[want] is not None:
                    result |= (1 << i)
                    node = node[want]
                else:
                    node = node[bit]
            return result

        for n in nums:
            insert(n)

        return max(max_xor_with(n) for n in nums)
```

```go
type XorNode struct{ children [2]*XorNode }

func findMaximumXOR(nums []int) int {
    root := &XorNode{}

    insert := func(num int) {
        node := root
        for i := 31; i >= 0; i-- {
            bit := (num >> i) & 1
            if node.children[bit] == nil { node.children[bit] = &XorNode{} }
            node = node.children[bit]
        }
    }

    maxXorWith := func(num int) int {
        node, result := root, 0
        for i := 31; i >= 0; i-- {
            bit, want := (num>>i)&1, 1-((num>>i)&1)
            if node.children[want] != nil {
                result |= (1 << i)
                node = node.children[want]
            } else {
                node = node.children[bit]
            }
        }
        return result
    }

    for _, n := range nums { insert(n) }
    maxXor := 0
    for _, n := range nums {
        if v := maxXorWith(n); v > maxXor { maxXor = v }
    }
    return maxXor
}
```

**Time:** O(32n) = O(n) — **Space:** O(32n) = O(n) for the trie

## Dry Run (Binary Trie)

`nums = [3, 10, 5, 25, 2, 8]`

Numbers in 5-bit binary (simplified):
```
3  = 00011
10 = 01010
5  = 00101
25 = 11001
2  = 00010
8  = 01000
```

Query `maxXorWith(5 = 00101)`:

| Bit | 5's bit | want (opposite) | Trie has? | XOR bit | result |
|---|---|---|---|---|---|
| 4 | 0 | 1 | Yes (25=11001) | 1 | 10000 = 16 |
| 3 | 0 | 1 | Yes (from 25) | 1 | 11000 = 24 |
| 2 | 1 | 0 | Yes (from 25) | 1 | 11100 = 28 |
| 1 | 0 | 1 | No (25 has 0) | 0 | 11100 = 28 |
| 0 | 1 | 0 | Yes (from 25) | 1 | 11101... |

Following 25 through trie gives XOR = `5 ^ 25 = 28` ✓

## Comparison

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute Force | O(n²) | O(1) | Too slow for large n |
| Hash Prefix | O(32n) | O(n) | Bit-by-bit greedy |
| **Binary Trie** | **O(32n)** | O(32n) | Most intuitive for XOR |

## Key Interview Insights

- **The MSB-first greedy is the key insight.** XOR bits are independent — set the highest-value bit to 1 first, then continue to lower bits. This is exactly the greedy strategy on the binary trie.
- **Why 32 bits?** Integers in most languages are 32-bit. Process from bit 31 down to bit 0. If constraints say values ≤ 10^6 ≈ 2^20, you can start from bit 19 to save time.
- **Java array-based trie** (`int[][] trie`) is significantly faster than pointer-based nodes due to better cache locality. Useful to mention in Java interviews.
- **The `want = 1 - bit` line is the core.** If the current bit is 0, we want 1; if it's 1, we want 0. Either way: `want = 1 - bit`.
- **Python list nodes `[None, None]`** are a clean way to avoid defining a class for bit tries.
- **Same pattern for:** Maximum XOR with a query (range queries), maximum AND/OR queries, and other bitwise optimization problems that need fast bit-level lookup.
