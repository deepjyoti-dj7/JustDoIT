---
title: Binary Search
description: The definitive guide to binary search — the single most important pattern in coding interviews after arrays and hash maps
---

# Binary Search

Binary search is deceptively simple to state and surprisingly hard to implement correctly. The algorithm itself is four lines. But the details — loop conditions, mid calculation, boundary updates, termination — are where bugs hide. This guide teaches you a single, consistent framework you can apply to every binary search problem.

## The Core Idea

Binary search applies to any situation where the answer space is **monotonic** — meaning once a condition becomes true, it stays true (or once it becomes false, it stays false). The classic example: a sorted array.

Given a sorted array and a target, we can eliminate half the search space with every comparison:
- If `arr[mid] == target` → found it
- If `arr[mid] < target` → target must be in the right half
- If `arr[mid] > target` → target must be in the left half

```
arr = [1, 3, 5, 7, 9, 11, 13]   target = 7

left=0, right=6, mid=3 → arr[3]=7 == target → found at index 3

arr = [1, 3, 5, 7, 9, 11, 13]   target = 6

left=0, right=6, mid=3 → arr[3]=7 > 6 → right=2
left=0, right=2, mid=1 → arr[1]=3 < 6 → left=2
left=2, right=2, mid=2 → arr[2]=5 < 6 → left=3
left=3 > right=2 → not found
```

## The Universal Template

There are many binary search templates floating around. This one is clean, handles all variants, and terminates correctly every time.

```
left = 0, right = n - 1

while left <= right:
    mid = left + (right - left) / 2   ← always use this to avoid overflow

    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        left = mid + 1
    else:
        right = mid - 1

return -1  (not found)
```

**Why `left + (right - left) / 2` instead of `(left + right) / 2`?**

`left + right` can overflow for large arrays in C++/Java (both are 32-bit ints). `left + (right - left) / 2` is mathematically identical but overflow-safe.

## Standard Implementation

```cpp
#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;  // not found
}
```

```java
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

```typescript
function binarySearch(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
```

```python
def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2  # Python has arbitrary precision; no overflow

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

```go
func binarySearch(arr []int, target int) int {
    left, right := 0, len(arr)-1

    for left <= right {
        mid := left + (right-left)/2

        if arr[mid] == target { return mid }
        if arr[mid] < target  { left = mid + 1 } else { right = mid - 1 }
    }
    return -1
}
```

## Why `while left <= right`?

The loop condition `left <= right` means we stop when the search space is **empty**. When `left == right`, there's still one element to check. When `left > right`, we've exhausted all possibilities.

An alternative — `while left < right` — is used in some variants (particularly for finding boundaries), but it requires post-loop handling and is error-prone for beginners.

## Finding Boundaries (Lower Bound / Upper Bound)

Standard binary search finds *a* position of the target. But many problems ask:

- **Lower bound:** First index where `arr[i] >= target`
- **Upper bound:** First index where `arr[i] > target`

These are the C++ `lower_bound` and `upper_bound` equivalents.

### Finding the First (Leftmost) Occurrence

When `arr[mid] == target`, don't stop — record it and keep searching left.

```cpp
// Returns first index where arr[i] == target, or -1
int firstOccurrence(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    int result = -1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            result = mid;       // record this position
            right = mid - 1;   // keep looking left
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}
```

```java
int firstOccurrence(int[] arr, int target) {
    int left = 0, right = arr.length - 1, result = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if      (arr[mid] == target) { result = mid; right = mid - 1; }
        else if (arr[mid] <  target) left  = mid + 1;
        else                          right = mid - 1;
    }
    return result;
}
```

```typescript
function firstOccurrence(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1, result = -1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if      (arr[mid] === target) { result = mid; right = mid - 1; }
        else if (arr[mid] <   target) left  = mid + 1;
        else                          right = mid - 1;
    }
    return result;
}
```

```python
def first_occurrence(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    result = -1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1  # keep going left
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result
```

```go
func firstOccurrence(arr []int, target int) int {
    left, right, result := 0, len(arr)-1, -1
    for left <= right {
        mid := left + (right-left)/2
        if arr[mid] == target { result = mid; right = mid - 1 }
        if arr[mid] < target  { left = mid + 1 } else { right = mid - 1 }
    }
    return result
}
```

### Finding the Last (Rightmost) Occurrence

```cpp
int lastOccurrence(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1, result = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if      (arr[mid] == target) { result = mid; left = mid + 1; }
        else if (arr[mid] <  target) left  = mid + 1;
        else                          right = mid - 1;
    }
    return result;
}
```

```java
int lastOccurrence(int[] arr, int target) {
    int left = 0, right = arr.length - 1, result = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if      (arr[mid] == target) { result = mid; left = mid + 1; }
        else if (arr[mid] <  target) left  = mid + 1;
        else                          right = mid - 1;
    }
    return result;
}
```

```typescript
function lastOccurrence(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1, result = -1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if      (arr[mid] === target) { result = mid; left = mid + 1; }
        else if (arr[mid] <   target) left  = mid + 1;
        else                          right = mid - 1;
    }
    return result;
}
```

```python
def last_occurrence(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    result = -1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            left = mid + 1   # keep going right
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result
```

```go
func lastOccurrence(arr []int, target int) int {
    left, right, result := 0, len(arr)-1, -1
    for left <= right {
        mid := left + (right-left)/2
        if arr[mid] == target { result = mid; left = mid + 1 }
        if arr[mid] < target  { left = mid + 1 } else { right = mid - 1 }
    }
    return result
}
```

## Complexity

| | Time | Space |
|---|---|---|
| Binary Search | O(log n) | O(1) |
| Recursive variant | O(log n) | O(log n) stack |

The iterative version is always preferred in interviews — same time, better space.

## The Monotonic Property: When Can You Binary Search?

Binary search works on **any monotonic search space**, not just sorted arrays. Ask yourself:

> If I check some value `x`, and the answer is "no," can I confidently eliminate half the remaining candidates?

If yes → binary search applies.

| Problem | Search Space | Monotonic? |
|---|---|---|
| Find target in sorted array | Array indices | ✅ |
| Find min in rotated array | Array indices | ✅ (modified) |
| Minimum eating speed for bananas | Speed values [1, max] | ✅ |
| Minimum days to ship packages | Capacity values | ✅ |
| Find sqrt(x) | Values [1, x] | ✅ |

## Identification Patterns

Recognize these signals that binary search is the intended solution:

- **Sorted array** — the most obvious trigger
- **"Find minimum/maximum X such that condition holds"** — binary search on the answer
- **O(log n) time complexity hinted** — almost always means binary search
- **Search space is bounded integers** — binary search on the value range
- **"Could you do better than O(n)?"** when input is sorted — binary search

## Common Pitfalls

| Pitfall | Consequence | Fix |
|---|---|---|
| `mid = (left + right) / 2` | Integer overflow in C++/Java | Use `left + (right - left) / 2` |
| `while left < right` for basic search | May miss single-element case | Use `left <= right` |
| `right = mid` instead of `mid - 1` | Infinite loop | Use `mid - 1` (Lomuto template) |
| Forgetting sorted precondition | Wrong results silently | Always sort first or verify |
| Off-by-one in boundary variants | Returns wrong index | Test with 2-3 element arrays |
