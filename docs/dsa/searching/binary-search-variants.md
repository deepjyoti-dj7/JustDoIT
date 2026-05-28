---
title: Binary Search Variants
description: Every pattern of binary search you'll encounter in interviews — from rotated arrays to searching on the answer
---

# Binary Search Variants

The classic binary search finds a value in a sorted array. But in interviews, binary search appears in disguised forms that look nothing like the original problem. This guide catalogs every major variant with the mental model to recognize and solve each one.

## The Two Fundamental Frameworks

Before variants, nail two base templates. Every variant is a specialization of one of these.

### Framework 1: Exact Match (`left <= right`)

Use when you're searching for a specific target and return immediately on match.

```
left = 0, right = n - 1
while left <= right:
    mid = left + (right - left) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target: left = mid + 1
    else: right = mid - 1
return -1
```

### Framework 2: Boundary Search (`left < right`)

Use when you're finding a boundary — the first position where a condition is true/false. Loop exits with `left == right`, which is the answer.

```
left = 0, right = n - 1
while left < right:
    mid = left + (right - left) // 2
    if condition(mid):
        right = mid       # mid could be the answer, don't exclude it
    else:
        left = mid + 1    # mid definitely not the answer
return left               # left == right == answer
```

The key insight: when `condition(mid)` is true, we set `right = mid` (not `mid-1`) because `mid` itself might be the leftmost true position.

---

## Variant 1: Rotated Sorted Array

The array was sorted, then rotated at some pivot. It's not globally sorted, but each half is sorted.

**Recognition:** "Sorted array" + "rotated" anywhere in the problem.

**Key insight:** After computing `mid`, at least one of `[left, mid]` or `[mid, right]` is fully sorted. Identify which half is sorted, then check if the target falls within it.

```
[4, 5, 6, 7, 0, 1, 2]   target = 0

left=0, right=6, mid=3  → arr[3]=7
Left half [4,5,6,7]: arr[left]=4 <= arr[mid]=7 → left half is sorted
Is target 0 in [4..7]? No → search right: left=4

left=4, right=6, mid=5  → arr[5]=1
Left half [0,1]: arr[left]=0 <= arr[mid]=1 → left half is sorted
Is target 0 in [0..1]? Yes → search left: right=4

left=4, right=4, mid=4  → arr[4]=0 == target → found at index 4
```

```cpp
int searchRotated(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;

        // Determine which half is sorted
        if (arr[left] <= arr[mid]) {  // left half is sorted
            if (arr[left] <= target && target < arr[mid])
                right = mid - 1;     // target in sorted left half
            else
                left = mid + 1;
        } else {                       // right half is sorted
            if (arr[mid] < target && target <= arr[right])
                left = mid + 1;       // target in sorted right half
            else
                right = mid - 1;
        }
    }
    return -1;
}
```

```java
int searchRotated(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;

        if (arr[left] <= arr[mid]) {
            if (arr[left] <= target && target < arr[mid]) right = mid - 1;
            else left = mid + 1;
        } else {
            if (arr[mid] < target && target <= arr[right]) left = mid + 1;
            else right = mid - 1;
        }
    }
    return -1;
}
```

```typescript
function searchRotated(arr: number[], target: number): number {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[left] <= arr[mid]) {
            if (arr[left] <= target && target < arr[mid]) right = mid - 1;
            else left = mid + 1;
        } else {
            if (arr[mid] < target && target <= arr[right]) left = mid + 1;
            else right = mid - 1;
        }
    }
    return -1;
}
```

```python
def search_rotated(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid

        if arr[left] <= arr[mid]:  # left half is sorted
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:                       # right half is sorted
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1
```

```go
func searchRotated(arr []int, target int) int {
    left, right := 0, len(arr)-1
    for left <= right {
        mid := left + (right-left)/2
        if arr[mid] == target { return mid }
        if arr[left] <= arr[mid] {
            if arr[left] <= target && target < arr[mid] { right = mid - 1 } else { left = mid + 1 }
        } else {
            if arr[mid] < target && target <= arr[right] { left = mid + 1 } else { right = mid - 1 }
        }
    }
    return -1
}
```

---

## Variant 2: Find Minimum in Rotated Array

Find the pivot point — the smallest element — which is where the rotation happened.

**Key insight:** The minimum is the only element smaller than both its neighbors. In the binary search view: the minimum is the **first element of the unsorted portion**. The right half always contains the minimum (or the left half is entirely sorted, meaning `arr[left]` is the minimum).

```cpp
int findMin(vector<int>& arr) {
    int left = 0, right = arr.size() - 1;

    while (left < right) {
        int mid = left + (right - left) / 2;

        if (arr[mid] > arr[right])
            left = mid + 1;   // minimum must be in right half
        else
            right = mid;      // arr[mid] could be the minimum
    }
    return arr[left];  // left == right == minimum index
}
```

```java
int findMin(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] > arr[right]) left  = mid + 1;
        else                        right = mid;
    }
    return arr[left];
}
```

```typescript
function findMin(arr: number[]): number {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] > arr[right]) left  = mid + 1;
        else                        right = mid;
    }
    return arr[left];
}
```

```python
def find_min(arr: list[int]) -> int:
    left, right = 0, len(arr) - 1

    while left < right:
        mid = (left + right) // 2
        if arr[mid] > arr[right]:
            left = mid + 1   # mid can't be minimum; minimum is to the right
        else:
            right = mid      # arr[mid] might be the minimum

    return arr[left]
```

```go
func findMin(arr []int) int {
    left, right := 0, len(arr)-1
    for left < right {
        mid := left + (right-left)/2
        if arr[mid] > arr[right] { left = mid + 1 } else { right = mid }
    }
    return arr[left]
}
```

**Why compare with `arr[right]` not `arr[left]`?**

Comparing `arr[mid]` with `arr[right]` tells us which side the discontinuity (rotation point) is on:
- `arr[mid] > arr[right]` → the drop happened somewhere in `[mid+1, right]`
- `arr[mid] <= arr[right]` → the right half is sorted; the minimum is at `mid` or to its left

---

## Variant 3: Binary Search on the Answer

The most powerful and frequently misrecognized variant. Instead of searching an array, you search the **space of possible answers**.

**Pattern:** "Find the minimum X such that [some condition is satisfiable]"

**Template:**

```cpp
// Binary Search on Answer template
int solve(vector<int>& arr, int constraint) {
    int left = 1, right = *max_element(arr.begin(), arr.end());
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (feasible(arr, mid, constraint)) right = mid;
        else                                left  = mid + 1;
    }
    return left;
}
```

```java
int solve(int[] arr, int constraint) {
    int left = 1, right = Arrays.stream(arr).max().getAsInt();
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (feasible(arr, mid, constraint)) right = mid;
        else                                left  = mid + 1;
    }
    return left;
}
```

```typescript
function solve(arr: number[], constraint: number): number {
    let left = 1, right = Math.max(...arr);
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (feasible(arr, mid, constraint)) right = mid;
        else                                left  = mid + 1;
    }
    return left;
}
```

```python
def solve(data, constraint):
    left, right = min_possible_answer, max_possible_answer

    while left < right:
        mid = (left + right) // 2
        if feasible(data, mid, constraint):
            right = mid         # mid works, try smaller
        else:
            left = mid + 1      # mid doesn't work, need larger

    return left  # minimum feasible value
```

```go
func solve(arr []int, constraint int) int {
    left, right := 1, slices.Max(arr)
    for left < right {
        mid := left + (right-left)/2
        if feasible(arr, mid, constraint) { right = mid } else { left = mid + 1 }
    }
    return left
}
```

**Examples of this pattern:**
- Koko Eating Bananas: minimum eating speed such that all bananas can be eaten in `h` hours
- Ship Packages Within D Days: minimum ship capacity
- Split Array Largest Sum: minimize the largest sum when splitting into k parts
- Magnetic Force Between Balls: maximize the minimum distance

The `feasible()` function is usually O(n) (simulate the scenario). Binary search brings the total to O(n log(answer_range)).

---

## Variant 4: Search in 2D Matrix

A 2D matrix where each row is sorted and the first element of each row > last element of the previous row. This is just a 1D sorted array mapped onto 2D.

**Key insight:** Treat the matrix as a flat sorted array. Index `k` maps to `row = k / cols`, `col = k % cols`.

```cpp
bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int rows = matrix.size(), cols = matrix[0].size();
    int left = 0, right = rows * cols - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = matrix[mid / cols][mid % cols];  // convert to 2D index

        if (val == target) return true;
        else if (val < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
}
```

```java
boolean searchMatrix(int[][] matrix, int target) {
    int rows = matrix.length, cols = matrix[0].length;
    int left = 0, right = rows * cols - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = matrix[mid / cols][mid % cols];
        if      (val == target) return true;
        else if (val <  target) left  = mid + 1;
        else                    right = mid - 1;
    }
    return false;
}
```

```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
    const rows = matrix.length, cols = matrix[0].length;
    let left = 0, right = rows * cols - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const val = matrix[Math.floor(mid / cols)][mid % cols];
        if      (val === target) return true;
        else if (val <   target) left  = mid + 1;
        else                     right = mid - 1;
    }
    return false;
}
```

```python
def search_matrix(matrix: list[list[int]], target: int) -> bool:
    rows, cols = len(matrix), len(matrix[0])
    left, right = 0, rows * cols - 1

    while left <= right:
        mid = (left + right) // 2
        val = matrix[mid // cols][mid % cols]

        if val == target: return True
        elif val < target: left = mid + 1
        else: right = mid - 1

    return False
```

```go
func searchMatrix(matrix [][]int, target int) bool {
    rows, cols := len(matrix), len(matrix[0])
    left, right := 0, rows*cols-1
    for left <= right {
        mid := left + (right-left)/2
        val := matrix[mid/cols][mid%cols]
        if      val == target { return true }
        else if val <  target { left  = mid + 1 }
        else                  { right = mid - 1 }
    }
    return false
}
```

---

## Variant 5: Staircase Search (Sorted Matrix — Different Problem)

A different matrix variant: each row sorted left-to-right AND each column sorted top-to-bottom, but rows not connected. Binary search doesn't apply directly here. Use the **staircase search** instead — start at top-right corner, eliminate row or column at each step.

```cpp
bool searchMatrixII(vector<vector<int>>& matrix, int target) {
    if (matrix.empty()) return false;
    int row = 0, col = matrix[0].size() - 1;  // top-right corner
    while (row < (int)matrix.size() && col >= 0) {
        if      (matrix[row][col] == target) return true;
        else if (matrix[row][col] >  target) col--;   // too big: eliminate column
        else                                 row++;   // too small: eliminate row
    }
    return false;
}
```

```java
boolean searchMatrixII(int[][] matrix, int target) {
    if (matrix.length == 0) return false;
    int row = 0, col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        if      (matrix[row][col] == target) return true;
        else if (matrix[row][col] >  target) col--;
        else                                 row++;
    }
    return false;
}
```

```typescript
function searchMatrixII(matrix: number[][], target: number): boolean {
    if (!matrix.length) return false;
    let row = 0, col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        if      (matrix[row][col] === target) return true;
        else if (matrix[row][col] >   target) col--;
        else                                  row++;
    }
    return false;
}
```

```python
def search_matrix_ii(matrix: list[list[int]], target: int) -> bool:
    if not matrix: return False
    row, col = 0, len(matrix[0]) - 1  # top-right corner

    while row < len(matrix) and col >= 0:
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] > target:
            col -= 1   # too big: eliminate this column
        else:
            row += 1   # too small: eliminate this row

    return False
```

```go
func searchMatrixII(matrix [][]int, target int) bool {
    if len(matrix) == 0 { return false }
    row, col := 0, len(matrix[0])-1
    for row < len(matrix) && col >= 0 {
        if      matrix[row][col] == target { return true }
        else if matrix[row][col] >  target { col-- }
        else                               { row++ }
    }
    return false
}
```

This is O(m + n), not O(log(mn)). Binary search doesn't apply because the property is weaker.

---

## Variant 6: Lower Bound / Upper Bound

Finding the leftmost or rightmost occurrence of a target, or the insert position. Critical for counting occurrences of a value in a sorted array.

```cpp
// lower_bound: first index where arr[i] >= target
int lowerBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size();
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < target) left  = mid + 1;
        else                    right = mid;
    }
    return left;
}
// Count occurrences: upperBound(arr,t) - lowerBound(arr,t)
```

```java
// lower_bound: first index where arr[i] >= target
int lowerBound(int[] arr, int target) {
    int left = 0, right = arr.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < target) left  = mid + 1;
        else                    right = mid;
    }
    return left;
}
```

```typescript
// lower_bound: first index where arr[i] >= target
function lowerBound(arr: number[], target: number): number {
    let left = 0, right = arr.length;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] < target) left  = mid + 1;
        else                    right = mid;
    }
    return left;
}
```

```python
import bisect

# Python's bisect module implements these directly:
# bisect.bisect_left(arr, target)  → first index where arr[i] >= target
# bisect.bisect_right(arr, target) → first index where arr[i] > target

# Count occurrences of target:
def count_occurrences(arr: list[int], target: int) -> int:
    left  = bisect.bisect_left(arr, target)
    right = bisect.bisect_right(arr, target)
    return right - left

# Manual lower_bound (first index where arr[i] >= target):
def lower_bound(arr: list[int], target: int) -> int:
    left, right = 0, len(arr)  # right = n (open boundary)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left
```

```go
// Go stdlib: sort.SearchInts finds first index where arr[i] >= target
func lowerBound(arr []int, target int) int {
    return sort.SearchInts(arr, target)
}
// Manual version:
func lowerBoundManual(arr []int, target int) int {
    left, right := 0, len(arr)
    for left < right {
        mid := left + (right-left)/2
        if arr[mid] < target { left = mid + 1 } else { right = mid }
    }
    return left
}
```

---

## Variant 7: Peak Finding

Find any peak element (element greater than its neighbors). Works by always moving toward the higher neighbor — a peak must exist in that direction.

```cpp
int findPeak(vector<int>& arr) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < arr[mid + 1]) left  = mid + 1;
        else                          right = mid;
    }
    return left;
}
```

```java
int findPeak(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] < arr[mid + 1]) left  = mid + 1;
        else                          right = mid;
    }
    return left;
}
```

```typescript
function findPeak(arr: number[]): number {
    let left = 0, right = arr.length - 1;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] < arr[mid + 1]) left  = mid + 1;
        else                          right = mid;
    }
    return left;
}
```

```python
def find_peak(arr: list[int]) -> int:
    left, right = 0, len(arr) - 1

    while left < right:
        mid = (left + right) // 2
        if arr[mid] < arr[mid + 1]:
            left = mid + 1    # peak is to the right
        else:
            right = mid       # arr[mid] could be the peak

    return left  # left == right == peak index
```

```go
func findPeak(arr []int) int {
    left, right := 0, len(arr)-1
    for left < right {
        mid := left + (right-left)/2
        if arr[mid] < arr[mid+1] { left = mid + 1 } else { right = mid }
    }
    return left
}
```

---

## Variant Comparison

| Variant | Template | Key Condition | Compare With |
|---|---|---|---|
| Exact match | `left <= right` | `arr[mid] == target` | Target |
| First/last occurrence | `left <= right` + save result | `arr[mid] == target` → save + continue | Target |
| Rotated search | `left <= right` | Identify sorted half | `arr[left]` or `arr[right]` |
| Find minimum rotated | `left < right` | `arr[mid] > arr[right]` | `arr[right]` |
| Search on answer | `left < right` | `feasible(mid)` | Custom function |
| 2D matrix | `left <= right` | `matrix[mid/c][mid%c]` | Target |
| Peak element | `left < right` | `arr[mid] < arr[mid+1]` | Neighbor |
| Lower bound | `left < right` | `arr[mid] < target` | Target |

## Mental Checklist for Any Binary Search Problem

1. **What am I searching over?** Array indices? Value range? Answer space?
2. **Is the space monotonic?** Can I eliminate half after each check?
3. **Which template?** `left <= right` (exact match) or `left < right` (boundary)?
4. **What's my `mid` update?** `left = mid + 1` or `right = mid`? (Never `right = mid - 1` in boundary search)
5. **What's the termination value?** Return `mid`, `left`, `right`, or `arr[left]`?
6. **Edge cases?** Empty array, single element, all same values, target smaller/larger than all elements.
