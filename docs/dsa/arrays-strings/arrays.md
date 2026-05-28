---
title: Arrays
description: Foundational array concepts, operations, patterns, and interview techniques
---

# Arrays

Arrays are the most fundamental data structure in computer science and the backbone of nearly every coding interview. Mastering arrays means mastering **indexing**, **traversal patterns**, and **in-place manipulation** — skills that transfer to almost every other topic.

## Core Concepts

An array is a **contiguous block of memory** storing elements of the same type. This contiguity gives arrays their superpower: **O(1) random access** via index arithmetic.

| Operation | Array | Dynamic Array (ArrayList) |
|---|---|---|
| Access by index | O(1) | O(1) |
| Search (unsorted) | O(n) | O(n) |
| Search (sorted) | O(log n) | O(log n) |
| Insert at end | N/A | O(1) amortized |
| Insert at index | O(n) | O(n) |
| Delete at index | O(n) | O(n) |

> **Interview tip:** When an interviewer says "array," they almost always mean a dynamic array (vector, ArrayList, list). True fixed-size arrays are rare in interviews.

## Array Traversal Patterns

Almost every array problem boils down to one of these traversal strategies:

### 1. Single Pass (Linear Scan)

Walk through the array once, maintaining state as you go.

```cpp
// Find maximum element
int findMax(vector<int>& nums) {
    int maxVal = nums[0];
    for (int i = 1; i < nums.size(); i++) {
        maxVal = max(maxVal, nums[i]);
    }
    return maxVal;
}
```

```java
int findMax(int[] nums) {
    int maxVal = nums[0];
    for (int i = 1; i < nums.length; i++) {
        maxVal = Math.max(maxVal, nums[i]);
    }
    return maxVal;
}
```

```typescript
function findMax(nums: number[]): number {
    let maxVal = nums[0];
    for (let i = 1; i < nums.length; i++) {
        maxVal = Math.max(maxVal, nums[i]);
    }
    return maxVal;
}
```

```python
def find_max(nums: list[int]) -> int:
    max_val = nums[0]
    for i in range(1, len(nums)):
        max_val = max(max_val, nums[i])
    return max_val
```

```go
func findMax(nums []int) int {
    maxVal := nums[0]
    for i := 1; i < len(nums); i++ {
        if nums[i] > maxVal {
            maxVal = nums[i]
        }
    }
    return maxVal
}
```

### 2. Two Pointers

Use two indices moving towards each other or in the same direction. Covered in depth in the [Two Pointers](two-pointers) section.

### 3. Sliding Window

Maintain a window of elements that expands/contracts. Covered in the [Sliding Window](sliding-window) section.

### 4. Prefix Sums

Precompute cumulative sums for O(1) range queries. Covered in [Prefix Sums](prefix-sums).

## In-Place Array Manipulation

Many interview problems require modifying the array **without extra space**. The key techniques:

### Swap-based rearrangement

```cpp
// Move all zeros to end, maintain relative order of non-zeros
void moveZeroes(vector<int>& nums) {
    int write = 0;
    for (int read = 0; read < nums.size(); read++) {
        if (nums[read] != 0) {
            swap(nums[write], nums[read]);
            write++;
        }
    }
}
```

```java
void moveZeroes(int[] nums) {
    int write = 0;
    for (int read = 0; read < nums.length; read++) {
        if (nums[read] != 0) {
            int temp = nums[write];
            nums[write] = nums[read];
            nums[read] = temp;
            write++;
        }
    }
}
```

```typescript
function moveZeroes(nums: number[]): void {
    let write = 0;
    for (let read = 0; read < nums.length; read++) {
        if (nums[read] !== 0) {
            [nums[write], nums[read]] = [nums[read], nums[write]];
            write++;
        }
    }
}
```

```python
def move_zeroes(nums: list[int]) -> None:
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write], nums[read] = nums[read], nums[write]
            write += 1
```

```go
func moveZeroes(nums []int) {
    write := 0
    for read := 0; read < len(nums); read++ {
        if nums[read] != 0 {
            nums[write], nums[read] = nums[read], nums[write]
            write++
        }
    }
}
```

### Overwrite from the back

When merging or expanding, work backwards to avoid overwriting unprocessed elements.

### Index as hash

Use the array indices themselves to mark visited elements — great for problems on arrays with values in the range `[1, n]`.

```cpp
// Find all duplicates in array where 1 <= nums[i] <= n
vector<int> findDuplicates(vector<int>& nums) {
    vector<int> result;
    for (int i = 0; i < nums.size(); i++) {
        int idx = abs(nums[i]) - 1;
        if (nums[idx] < 0) {
            result.push_back(idx + 1);
        } else {
            nums[idx] = -nums[idx];
        }
    }
    return result;
}
```

```java
List<Integer> findDuplicates(int[] nums) {
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        int idx = Math.abs(nums[i]) - 1;
        if (nums[idx] < 0) {
            result.add(idx + 1);
        } else {
            nums[idx] = -nums[idx];
        }
    }
    return result;
}
```

```typescript
function findDuplicates(nums: number[]): number[] {
    const result: number[] = [];
    for (let i = 0; i < nums.length; i++) {
        const idx = Math.abs(nums[i]) - 1;
        if (nums[idx] < 0) {
            result.push(idx + 1);
        } else {
            nums[idx] = -nums[idx];
        }
    }
    return result;
}
```

```python
def find_duplicates(nums: list[int]) -> list[int]:
    result = []
    for i in range(len(nums)):
        idx = abs(nums[i]) - 1
        if nums[idx] < 0:
            result.append(idx + 1)
        else:
            nums[idx] = -nums[idx]
    return result
```

```go
func findDuplicates(nums []int) []int {
    result := []int{}
    for i := 0; i < len(nums); i++ {
        idx := nums[i]
        if idx < 0 {
            idx = -idx
        }
        idx--
        if nums[idx] < 0 {
            result = append(result, idx+1)
        } else {
            nums[idx] = -nums[idx]
        }
    }
    return result
}
```

## Sorting as a Preprocessing Step

Sorting is one of the most powerful interview techniques. After sorting:

- **Duplicates** become adjacent → easy to detect
- **Two Sum** becomes solvable with two pointers
- **Closest pair** problems become manageable
- **Grouping** problems simplify dramatically

> **Tradeoff:** Sorting costs O(n log n) and may destroy the original order. Always ask yourself: "Does order matter here?"

## Subarray vs Subsequence vs Subset

| Term | Definition | Contiguous? | Order? | Example from [1,2,3] |
|---|---|---|---|---|
| Subarray | Contiguous slice | Yes | Yes | [1,2], [2,3] |
| Subsequence | Pick elements in order | No | Yes | [1,3], [2,3] |
| Subset | Any combination | No | No | {1,3}, {2} |

This distinction matters enormously for choosing the right algorithm:
- **Subarray** → Sliding window, prefix sum, Kadane's
- **Subsequence** → DP, greedy
- **Subset** → Backtracking, bitmask

## Edge Cases Checklist

Always consider these before coding:

- **Empty array** — return 0 / empty / handle gracefully
- **Single element** — often a valid answer
- **All same elements** — [5, 5, 5, 5]
- **All negative** — critical for max subarray problems
- **Sorted / reverse sorted** — worst or best case for some algorithms
- **Contains duplicates** — affects uniqueness constraints
- **Very large values** — integer overflow when summing
- **Array of size 2** — minimum meaningful pair

## Common Interview Patterns

| Pattern | When to Use | Key Problems |
|---|---|---|
| Hash map for lookup | Need O(1) existence check or counting | Two Sum, Contains Duplicate |
| Sort + two pointers | Need pairs/triplets with target sum | 3Sum, Two Sum II |
| Prefix sum | Range sum queries | Subarray Sum Equals K |
| Kadane's algorithm | Maximum subarray | Max Subarray, Max Product |
| Sliding window | Contiguous subarray with constraint | Min Size Subarray Sum |
| In-place write pointer | Remove/rearrange elements | Move Zeroes, Remove Duplicates |
| Index as hash | Values in [1, n] range | Find Duplicate, Missing Number |
| Monotonic stack | Next greater/smaller element | Daily Temperatures |

## Complexity Quick Reference

| Algorithm | Time | Space |
|---|---|---|
| Linear scan | O(n) | O(1) |
| Sort-based | O(n log n) | O(1)–O(n) |
| Hash map approach | O(n) | O(n) |
| Two pointers (sorted) | O(n) | O(1) |
| Brute force pairs | O(n²) | O(1) |
| All subarrays | O(n²) | O(1) |
| All subsequences | O(2ⁿ) | O(n) |
