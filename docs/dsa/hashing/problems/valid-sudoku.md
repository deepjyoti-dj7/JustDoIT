---
title: Valid Sudoku
difficulty: Medium
tags: [Array, Hash Set, Matrix]
link: https://leetcode.com/problems/valid-sudoku/
---

# Valid Sudoku

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [36. Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) |
| **Tags** | Array, Hash Set, Matrix |

## Problem Statement

Determine if a 9×9 Sudoku board is valid. The board is valid if:
1. Each **row** contains digits 1–9 with no repetition
2. Each **column** contains digits 1–9 with no repetition
3. Each of the nine **3×3 sub-boxes** contains digits 1–9 with no repetition

Empty cells are marked with `'.'`. You don't need to solve the puzzle — only validate the placed digits.

## Intuition

Three types of constraints, each needs duplicate detection. Hash sets are the natural tool.

**Key formula:** For cell `(row, col)`, the 3×3 box index is `(row / 3) * 3 + (col / 3)`. This maps the 9 boxes to indices 0–8:

```
box 0 | box 1 | box 2
------+-------+------
box 3 | box 4 | box 5
------+-------+------
box 6 | box 7 | box 8
```

**One-pass approach:** Scan every cell once. For each digit found, check if it's already in the corresponding row set, column set, and box set. If any check fails → invalid. Otherwise add the digit to all three sets.

## Approach 1: Multi-Pass (Readable)

Validate rows, then columns, then boxes separately.

```cpp
class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        // Check rows
        for (int r = 0; r < 9; r++) {
            unordered_set<char> seen;
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') continue;
                if (!seen.insert(board[r][c]).second) return false;
            }
        }
        // Check columns
        for (int c = 0; c < 9; c++) {
            unordered_set<char> seen;
            for (int r = 0; r < 9; r++) {
                if (board[r][c] == '.') continue;
                if (!seen.insert(board[r][c]).second) return false;
            }
        }
        // Check 3x3 boxes
        for (int box = 0; box < 9; box++) {
            unordered_set<char> seen;
            int startRow = (box / 3) * 3, startCol = (box % 3) * 3;
            for (int dr = 0; dr < 3; dr++)
                for (int dc = 0; dc < 3; dc++) {
                    char ch = board[startRow + dr][startCol + dc];
                    if (ch == '.') continue;
                    if (!seen.insert(ch).second) return false;
                }
        }
        return true;
    }
};
```

```java
class Solution {
    public boolean isValidSudoku(char[][] board) {
        // Check rows
        for (int r = 0; r < 9; r++) {
            Set<Character> seen = new HashSet<>();
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') continue;
                if (!seen.add(board[r][c])) return false;
            }
        }
        // Check columns
        for (int c = 0; c < 9; c++) {
            Set<Character> seen = new HashSet<>();
            for (int r = 0; r < 9; r++) {
                if (board[r][c] == '.') continue;
                if (!seen.add(board[r][c])) return false;
            }
        }
        // Check 3x3 boxes
        for (int box = 0; box < 9; box++) {
            Set<Character> seen = new HashSet<>();
            int startRow = (box / 3) * 3, startCol = (box % 3) * 3;
            for (int dr = 0; dr < 3; dr++)
                for (int dc = 0; dc < 3; dc++) {
                    char ch = board[startRow + dr][startCol + dc];
                    if (ch == '.') continue;
                    if (!seen.add(ch)) return false;
                }
        }
        return true;
    }
}
```

```typescript
function isValidSudoku(board: string[][]): boolean {
    const check = (cells: string[]) => {
        const seen = new Set<string>();
        for (const c of cells) {
            if (c === '.') continue;
            if (seen.has(c)) return false;
            seen.add(c);
        }
        return true;
    };

    for (let r = 0; r < 9; r++)
        if (!check(board[r])) return false;

    for (let c = 0; c < 9; c++)
        if (!check(board.map(row => row[c]))) return false;

    for (let box = 0; box < 9; box++) {
        const cells: string[] = [];
        const sr = Math.floor(box / 3) * 3, sc = (box % 3) * 3;
        for (let dr = 0; dr < 3; dr++)
            for (let dc = 0; dc < 3; dc++)
                cells.push(board[sr + dr][sc + dc]);
        if (!check(cells)) return false;
    }
    return true;
}
```

```python
class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        def check(cells):
            nums = [c for c in cells if c != '.']
            return len(nums) == len(set(nums))

        # Rows
        for r in range(9):
            if not check(board[r]): return False

        # Columns
        for c in range(9):
            if not check([board[r][c] for r in range(9)]): return False

        # Boxes
        for box in range(9):
            sr, sc = (box // 3) * 3, (box % 3) * 3
            cells = [board[sr+dr][sc+dc] for dr in range(3) for dc in range(3)]
            if not check(cells): return False

        return True
```

```go
func isValidSudoku(board [][]byte) bool {
    check := func(cells []byte) bool {
        seen := map[byte]bool{}
        for _, c := range cells {
            if c == '.' { continue }
            if seen[c] { return false }
            seen[c] = true
        }
        return true
    }

    for r := 0; r < 9; r++ {
        if !check(board[r]) { return false }
    }
    for c := 0; c < 9; c++ {
        col := make([]byte, 9)
        for r := 0; r < 9; r++ { col[r] = board[r][c] }
        if !check(col) { return false }
    }
    for box := 0; box < 9; box++ {
        cells := []byte{}
        sr, sc := (box/3)*3, (box%3)*3
        for dr := 0; dr < 3; dr++ {
            for dc := 0; dc < 3; dc++ {
                cells = append(cells, board[sr+dr][sc+dc])
            }
        }
        if !check(cells) { return false }
    }
    return true
}
```

**Time:** O(81) = O(1) — **Space:** O(27) sets = O(1) (fixed 9×9 board)

## Approach 2: One-Pass with 27 Sets

Validate all three constraints in a single scan.

```cpp
class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        vector<unordered_set<char>> rows(9), cols(9), boxes(9);

        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                char ch = board[r][c];
                if (ch == '.') continue;

                int box = (r / 3) * 3 + (c / 3);
                if (!rows[r].insert(ch).second) return false;
                if (!cols[c].insert(ch).second) return false;
                if (!boxes[box].insert(ch).second) return false;
            }
        }
        return true;
    }
};
```

```java
class Solution {
    public boolean isValidSudoku(char[][] board) {
        Set<Character>[] rows = new HashSet[9];
        Set<Character>[] cols = new HashSet[9];
        Set<Character>[] boxes = new HashSet[9];
        for (int i = 0; i < 9; i++) {
            rows[i] = new HashSet<>();
            cols[i] = new HashSet<>();
            boxes[i] = new HashSet<>();
        }

        for (int r = 0; r < 9; r++) {
            for (int c = 0; c < 9; c++) {
                char ch = board[r][c];
                if (ch == '.') continue;

                int box = (r / 3) * 3 + (c / 3);
                if (!rows[r].add(ch)) return false;
                if (!cols[c].add(ch)) return false;
                if (!boxes[box].add(ch)) return false;
            }
        }
        return true;
    }
}
```

```typescript
function isValidSudoku(board: string[][]): boolean {
    const rows = Array.from({ length: 9 }, () => new Set<string>());
    const cols = Array.from({ length: 9 }, () => new Set<string>());
    const boxes = Array.from({ length: 9 }, () => new Set<string>());

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const ch = board[r][c];
            if (ch === '.') continue;

            const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
            if (rows[r].has(ch) || cols[c].has(ch) || boxes[box].has(ch)) return false;
            rows[r].add(ch); cols[c].add(ch); boxes[box].add(ch);
        }
    }
    return true;
}
```

```python
class Solution:
    def isValidSudoku(self, board: list[list[str]]) -> bool:
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]

        for r in range(9):
            for c in range(9):
                ch = board[r][c]
                if ch == '.':
                    continue
                box = (r // 3) * 3 + (c // 3)
                if ch in rows[r] or ch in cols[c] or ch in boxes[box]:
                    return False
                rows[r].add(ch)
                cols[c].add(ch)
                boxes[box].add(ch)

        return True
```

```go
func isValidSudoku(board [][]byte) bool {
    rows := [9]map[byte]bool{}
    cols := [9]map[byte]bool{}
    boxes := [9]map[byte]bool{}
    for i := 0; i < 9; i++ {
        rows[i] = map[byte]bool{}
        cols[i] = map[byte]bool{}
        boxes[i] = map[byte]bool{}
    }

    for r := 0; r < 9; r++ {
        for c := 0; c < 9; c++ {
            ch := board[r][c]
            if ch == '.' { continue }
            box := (r/3)*3 + c/3
            if rows[r][ch] || cols[c][ch] || boxes[box][ch] { return false }
            rows[r][ch] = true
            cols[c][ch] = true
            boxes[box][ch] = true
        }
    }
    return true
}
```

**Time:** O(81) = O(1) — **Space:** O(27 × 9) = O(1)

## Box Index Formula Visualization

```
Cell (r, c) → box index = (r / 3) * 3 + (c / 3)

       c: 0  1  2 | 3  4  5 | 6  7  8
r: 0      0  0  0 | 1  1  1 | 2  2  2
   1      0  0  0 | 1  1  1 | 2  2  2
   2      0  0  0 | 1  1  1 | 2  2  2
         ---------+---------+---------
   3      3  3  3 | 4  4  4 | 5  5  5
   4      3  3  3 | 4  4  4 | 5  5  5
   5      3  3  3 | 4  4  4 | 5  5  5
         ---------+---------+---------
   6      6  6  6 | 7  7  7 | 8  8  8
   7      6  6  6 | 7  7  7 | 8  8  8
   8      6  6  6 | 7  7  7 | 8  8  8
```

## Key Interview Insights

- **The board is always 9×9.** All time and space is technically O(1). Don't let the "O(n²)" claim fool you — n is always 9.
- **Box formula `(r/3)*3 + (c/3)` is the key to memorize.** Integer division groups rows into 0/1/2 and columns into 0/1/2, then maps to 0–8.
- **You don't need to solve the puzzle** — only validate the *current* configuration of placed digits. Empty cells are always valid.
- **Alternative with no hash sets:** Use `boolean[9][9]` arrays — `rowUsed[r][digit-1]`, `colUsed[c][digit-1]`, `boxUsed[box][digit-1]`. Same O(1) space, slightly faster in practice (no hashing).
- **This problem is about constraint decomposition** — rows, columns, and boxes are three independent sets of constraints, each checked identically. Recognizing this pattern generalizes to constraint satisfaction problems.

