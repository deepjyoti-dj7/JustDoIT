---
title: Search a 2D Matrix
difficulty: Medium
tags: [Array, Binary Search, Matrix]
link: https://leetcode.com/problems/search-a-2d-matrix/
---

# Search a 2D Matrix

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [74. Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/) |
| **Tags** | Array, Binary Search, Matrix |

## Problem Statement

Write an efficient algorithm that searches for a value in an `m × n` integer matrix. The matrix has the following properties:
- Integers in each row are sorted from left to right.
- The first integer of each row is greater than the last integer of the previous row.

Return `true` if `target` is in the matrix, `false` otherwise.

## Intuition

The two properties together mean: if you read the matrix row by row from top-left to bottom-right, you get a single sorted sequence of `m × n` numbers.

So treat the matrix as a 1D sorted array of length `m × n`. Binary search on index `k ∈ [0, m*n - 1]`. The mapping from flat index to 2D:

```
row = k / n   (integer division)
col = k % n
```

## Approach: Single Binary Search (Optimal)

```cpp
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int rows = matrix.size(), cols = matrix[0].size();
        int left = 0, right = rows * cols - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int val = matrix[mid / cols][mid % cols];  // 2D index mapping

            if (val == target) return true;
            else if (val < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
};
```

```java
class Solution {
    public boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length, cols = matrix[0].length;
        int left = 0, right = rows * cols - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            int val = matrix[mid / cols][mid % cols];

            if (val == target) return true;
            else if (val < target) left = mid + 1;
            else right = mid - 1;
        }
        return false;
    }
}
```

```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
    const rows = matrix.length, cols = matrix[0].length;
    let left = 0, right = rows * cols - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const val = matrix[Math.floor(mid / cols)][mid % cols];

        if (val === target) return true;
        else if (val < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
}
```

```python
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        rows, cols = len(matrix), len(matrix[0])
        left, right = 0, rows * cols - 1

        while left <= right:
            mid = (left + right) // 2
            val = matrix[mid // cols][mid % cols]  # flat index → 2D

            if val == target:
                return True
            elif val < target:
                left = mid + 1
            else:
                right = mid - 1

        return False
```

```go
func searchMatrix(matrix [][]int, target int) bool {
    rows, cols := len(matrix), len(matrix[0])
    left, right := 0, rows*cols-1

    for left <= right {
        mid := left + (right-left)/2
        val := matrix[mid/cols][mid%cols]

        if val == target   { return true }
        if val < target    { left = mid + 1 } else { right = mid - 1 }
    }
    return false
}
```

## Dry Run

```
matrix = [
  [1,  3,  5,  7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
]
target = 3,  rows=3, cols=4,  total=12

left=0, right=11, mid=5
  matrix[5/4][5%4] = matrix[1][1] = 11 > 3 → right=4

left=0, right=4, mid=2
  matrix[2/4][2%4] = matrix[0][2] = 5 > 3 → right=1

left=0, right=1, mid=0
  matrix[0/4][0%4] = matrix[0][0] = 1 < 3 → left=1

left=1, right=1, mid=1
  matrix[1/4][1%4] = matrix[0][1] = 3 == 3 → return true ✓
```

## Alternative: Two Binary Searches

First binary search for the correct row (find the last row where `matrix[row][0] <= target`), then binary search within that row. This is two O(log n) searches but less elegant.

```cpp
bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int rows = matrix.size(), cols = matrix[0].size();
    int top = 0, bot = rows - 1;
    while (top < bot) {
        int midRow = top + (bot - top + 1) / 2;  // upper mid
        if (matrix[midRow][0] <= target) top = midRow;
        else bot = midRow - 1;
    }
    int row = top;
    if (matrix[row][0] > target || matrix[row][cols-1] < target) return false;
    int left = 0, right = cols - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if      (matrix[row][mid] == target) return true;
        else if (matrix[row][mid] <  target) left  = mid + 1;
        else                                 right = mid - 1;
    }
    return false;
}
```

```java
public boolean searchMatrix(int[][] matrix, int target) {
    int rows = matrix.length, cols = matrix[0].length;
    int top = 0, bot = rows - 1;
    while (top < bot) {
        int midRow = top + (bot - top + 1) / 2;
        if (matrix[midRow][0] <= target) top = midRow;
        else bot = midRow - 1;
    }
    int row = top;
    if (matrix[row][0] > target || matrix[row][cols-1] < target) return false;
    int left = 0, right = cols - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if      (matrix[row][mid] == target) return true;
        else if (matrix[row][mid] <  target) left  = mid + 1;
        else                                 right = mid - 1;
    }
    return false;
}
```

```typescript
function searchMatrix(matrix: number[][], target: number): boolean {
    const rows = matrix.length, cols = matrix[0].length;
    let top = 0, bot = rows - 1;
    while (top < bot) {
        const midRow = top + Math.floor((bot - top + 1) / 2);
        if (matrix[midRow][0] <= target) top = midRow;
        else bot = midRow - 1;
    }
    const row = top;
    if (matrix[row][0] > target || matrix[row][cols-1] < target) return false;
    let left = 0, right = cols - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if      (matrix[row][mid] === target) return true;
        else if (matrix[row][mid] <   target) left  = mid + 1;
        else                                  right = mid - 1;
    }
    return false;
}
```

```python
class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        if not matrix: return False
        rows, cols = len(matrix), len(matrix[0])

        # Find the target row
        top, bot = 0, rows - 1
        while top < bot:
            mid_row = (top + bot + 1) // 2  # upper mid to avoid infinite loop
            if matrix[mid_row][0] <= target:
                top = mid_row
            else:
                bot = mid_row - 1

        row = top
        if matrix[row][0] > target or matrix[row][cols-1] < target:
            return False

        # Binary search in the row
        left, right = 0, cols - 1
        while left <= right:
            mid = (left + right) // 2
            if matrix[row][mid] == target: return True
            elif matrix[row][mid] < target: left = mid + 1
            else: right = mid - 1

        return False
```

```go
func searchMatrix(matrix [][]int, target int) bool {
    rows, cols := len(matrix), len(matrix[0])
    top, bot := 0, rows-1
    for top < bot {
        midRow := top + (bot-top+1)/2
        if matrix[midRow][0] <= target { top = midRow } else { bot = midRow - 1 }
    }
    row := top
    if matrix[row][0] > target || matrix[row][cols-1] < target { return false }
    left, right := 0, cols-1
    for left <= right {
        mid := left + (right-left)/2
        if      matrix[row][mid] == target { return true }
        else if matrix[row][mid] <  target { left  = mid + 1 }
        else                               { right = mid - 1 }
    }
    return false
}
```

The single binary search approach is preferred in interviews — one template, fewer moving parts.

## Complexity

- **Time:** O(log(m × n)) — binary search over all elements
- **Space:** O(1)

## Key Interview Insights

- **The mapping `row = mid // cols`, `col = mid % cols`** is the core trick. Internalize it — it works for any row-major matrix linearization.
- **Why does this work?** The matrix property guarantees that if you concatenate all rows in order, the result is a sorted array. The mapping is just the inverse of how 2D arrays are stored in memory (row-major order).
- **Different problem:** [240. Search a 2D Matrix II](https://leetcode.com/problems/search-a-2d-matrix-ii/) has weaker properties (rows and columns sorted independently, but rows not connected). Binary search doesn't apply there — use the staircase search from the top-right corner instead.
