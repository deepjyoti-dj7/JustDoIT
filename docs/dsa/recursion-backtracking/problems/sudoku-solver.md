---
title: Sudoku Solver
difficulty: Hard
tags: [Array, Hash Table, Backtracking, Matrix]
link: https://leetcode.com/problems/sudoku-solver/
---

# Sudoku Solver

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [37. Sudoku Solver](https://leetcode.com/problems/sudoku-solver/) |
| **Tags** | Array, Hash Table, Backtracking, Matrix |

## Problem Statement

Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy all of the following rules:
- Each of the digits `1-9` must occur exactly once in each row.
- Each of the digits `1-9` must occur exactly once in each column.
- Each of the digits `1-9` must occur exactly once in each of the nine `3 × 3` sub-boxes of the grid.

Empty cells are indicated by `'.'`. It is guaranteed that the input board has exactly one solution.

## Intuition

This is constraint satisfaction via backtracking. At each empty cell, try all valid digits (1-9). For each candidate, check three constraints:
1. Not already in this row
2. Not already in this column
3. Not already in this 3×3 box

If valid, place it and recurse to the next empty cell. If no digit works, backtrack and try the next candidate at the previous cell.

**Box index:** For cell at `(r, c)`, the box index is `(r // 3) * 3 + (c // 3)`. There are 9 boxes (3×3 grid of boxes).

```
Box mapping:
(0,0)(0,1)(0,2)  (0,3)(0,4)(0,5)  (0,6)(0,7)(0,8)
(1,0)(1,1)(1,2)  (1,3)(1,4)(1,5)  (1,6)(1,7)(1,8)
(2,0)(2,1)(2,2)  ...
------box0------  ------box1------  ------box2------

Box index = (r//3)*3 + (c//3)
```

## Approach: Backtracking with Constraint Sets

Precompute which digits are used in each row, column, and box. Then try each empty cell in order.

```cpp
class Solution {
public:
    void solveSudoku(vector<vector<char>>& board) {
        // Initialize constraint sets from pre-filled cells
        vector<set<char>> rows(9), cols(9), boxes(9);

        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] != '.') {
                    char d = board[r][c];
                    int box = (r/3)*3 + (c/3);
                    rows[r].insert(d);
                    cols[c].insert(d);
                    boxes[box].insert(d);
                }
            }
        }
        backtrack(board, rows, cols, boxes, 0, 0);
    }

private:
    bool backtrack(vector<vector<char>>& board,
                   vector<set<char>>& rows, vector<set<char>>& cols, vector<set<char>>& boxes,
                   int r, int c) {
        // Advance to next empty cell
        while (r < 9 && board[r][c] != '.') {
            if (++c == 9) { c = 0; r++; }
        }
        if (r == 9) return true;  // all cells filled

        int box = (r/3)*3 + (c/3);

        for (char d = '1'; d <= '9'; d++) {
            if (rows[r].count(d) || cols[c].count(d) || boxes[box].count(d)) continue;

            board[r][c] = d;
            rows[r].insert(d); cols[c].insert(d); boxes[box].insert(d);

            int nr = r, nc = c + 1;
            if (nc == 9) { nc = 0; nr++; }

            if (backtrack(board, rows, cols, boxes, nr, nc)) return true;

            board[r][c] = '.';
            rows[r].erase(d); cols[c].erase(d); boxes[box].erase(d);
        }
        return false;
    }
};
```

```java
class Solution {
    private boolean[][] rows = new boolean[9][10];
    private boolean[][] cols = new boolean[9][10];
    private boolean[][] boxes = new boolean[9][10];

    public void solveSudoku(char[][] board) {
        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                if (board[r][c] != '.') {
                    int d = board[r][c] - '0';
                    int box = (r/3)*3 + (c/3);
                    rows[r][d] = cols[c][d] = boxes[box][d] = true;
                }
            }
        }
        backtrack(board, 0, 0);
    }

    private boolean backtrack(char[][] board, int r, int c) {
        while (r < 9 && board[r][c] != '.') {
            if (++c == 9) { c = 0; r++; }
        }
        if (r == 9) return true;

        int box = (r/3)*3 + (c/3);

        for (int d = 1; d <= 9; d++) {
            if (rows[r][d] || cols[c][d] || boxes[box][d]) continue;

            board[r][c] = (char)('0' + d);
            rows[r][d] = cols[c][d] = boxes[box][d] = true;

            int nr = r, nc = c + 1;
            if (nc == 9) { nc = 0; nr++; }

            if (backtrack(board, nr, nc)) return true;

            board[r][c] = '.';
            rows[r][d] = cols[c][d] = boxes[box][d] = false;
        }
        return false;
    }
}
```

```typescript
function solveSudoku(board: string[][]): void {
    const rows = Array.from({length: 9}, () => new Set<number>());
    const cols = Array.from({length: 9}, () => new Set<number>());
    const boxes = Array.from({length: 9}, () => new Set<number>());

    // Initialize from pre-filled cells
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] !== '.') {
                const d = parseInt(board[r][c]);
                const box = Math.floor(r/3)*3 + Math.floor(c/3);
                rows[r].add(d); cols[c].add(d); boxes[box].add(d);
            }
        }
    }

    function backtrack(r: number, c: number): boolean {
        while (r < 9 && board[r][c] !== '.') {
            if (++c === 9) { c = 0; r++; }
        }
        if (r === 9) return true;

        const box = Math.floor(r/3)*3 + Math.floor(c/3);

        for (let d = 1; d <= 9; d++) {
            if (rows[r].has(d) || cols[c].has(d) || boxes[box].has(d)) continue;

            board[r][c] = String(d);
            rows[r].add(d); cols[c].add(d); boxes[box].add(d);

            let nr = r, nc = c + 1;
            if (nc === 9) { nc = 0; nr++; }

            if (backtrack(nr, nc)) return true;

            board[r][c] = '.';
            rows[r].delete(d); cols[c].delete(d); boxes[box].delete(d);
        }
        return false;
    }

    backtrack(0, 0);
}
```

```python
class Solution:
    def solveSudoku(self, board: list[list[str]]) -> None:
        rows  = [set() for _ in range(9)]
        cols  = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]

        # Build constraint sets from pre-filled digits
        for r in range(9):
            for c in range(9):
                if board[r][c] != '.':
                    d = int(board[r][c])
                    box = (r // 3) * 3 + (c // 3)
                    rows[r].add(d)
                    cols[c].add(d)
                    boxes[box].add(d)

        def backtrack(r: int, c: int) -> bool:
            # Skip to next empty cell
            while r < 9 and board[r][c] != '.':
                c += 1
                if c == 9:
                    c = 0
                    r += 1

            if r == 9:
                return True  # board fully filled

            box = (r // 3) * 3 + (c // 3)

            for d in range(1, 10):
                if d in rows[r] or d in cols[c] or d in boxes[box]:
                    continue

                board[r][c] = str(d)
                rows[r].add(d); cols[c].add(d); boxes[box].add(d)

                nr, nc = r, c + 1
                if nc == 9:
                    nc = 0
                    nr += 1

                if backtrack(nr, nc):
                    return True

                board[r][c] = '.'
                rows[r].discard(d); cols[c].discard(d); boxes[box].discard(d)

            return False

        backtrack(0, 0)
```

```go
func solveSudoku(board [][]byte) {
    rows  := [9][10]bool{}
    cols  := [9][10]bool{}
    boxes := [9][10]bool{}

    for r := 0; r < 9; r++ {
        for c := 0; c < 9; c++ {
            if board[r][c] != '.' {
                d := int(board[r][c] - '0')
                box := (r/3)*3 + (c/3)
                rows[r][d] = true; cols[c][d] = true; boxes[box][d] = true
            }
        }
    }

    var backtrack func(r, c int) bool
    backtrack = func(r, c int) bool {
        for r < 9 && board[r][c] != '.' {
            c++
            if c == 9 { c = 0; r++ }
        }
        if r == 9 { return true }

        box := (r/3)*3 + (c/3)

        for d := 1; d <= 9; d++ {
            if rows[r][d] || cols[c][d] || boxes[box][d] { continue }

            board[r][c] = byte('0' + d)
            rows[r][d] = true; cols[c][d] = true; boxes[box][d] = true

            nr, nc := r, c+1
            if nc == 9 { nc = 0; nr++ }

            if backtrack(nr, nc) { return true }

            board[r][c] = '.'
            rows[r][d] = false; cols[c][d] = false; boxes[box][d] = false
        }
        return false
    }

    backtrack(0, 0)
}
```

## Complexity

- **Time:** O(9^m) where m = number of empty cells. Each empty cell tries up to 9 digits. With constraint propagation, branches are pruned aggressively — typical puzzles solve in microseconds.
- **Space:** O(m) recursion depth + O(1) for the constraint arrays (fixed 9×10 size)

## Key Interview Insights

- **Box index formula:** `(r // 3) * 3 + (c // 3)` — this is the key insight. Internalize it.
- **Precompute constraints from filled cells** before starting backtracking. Don't scan the board at each step.
- **Return bool from backtrack** — unlike problems that find all solutions, here we stop at the first (and only) solution. Propagate the `true` up the call stack.
- **`while r < 9 && board[r][c] != '.'`** advances to the next empty cell inside the function — cleaner than maintaining an explicit empty-cells list.
- **Boolean arrays are faster than sets** for fixed domains. `rows[r][d]` is O(1) and cache-friendly compared to a set lookup.
- **Harder optimization (not needed in interviews):** Process cells in order of fewest valid candidates first (Minimum Remaining Values heuristic). This dramatically reduces the search space for hard puzzles but adds implementation complexity.
