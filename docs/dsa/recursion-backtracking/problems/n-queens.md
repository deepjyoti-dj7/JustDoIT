---
title: N-Queens
difficulty: Hard
tags: [Array, Backtracking]
link: https://leetcode.com/problems/n-queens/
---

# N-Queens

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [51. N-Queens](https://leetcode.com/problems/n-queens/) |
| **Tags** | Array, Backtracking |

## Problem Statement

The **N-Queens** puzzle is the problem of placing `n` queens on an `n × n` chessboard such that no two queens attack each other.

Given an integer `n`, return all distinct solutions to the N-Queens puzzle. Each solution contains a distinct board configuration of the queens' placement, where `'Q'` indicates a queen and `'.'` indicates an empty space.

A queen attacks any piece in the same row, column, or diagonal.

## Intuition

**Key observation:** Since a queen attacks the entire row, each row must contain **exactly one** queen. So we can place queens row by row and never worry about row conflicts.

At each row, we try placing a queen in each column. The constraints are:
- Column is not already occupied
- The `\` diagonal is not occupied (same `row - col` value)
- The `/` diagonal is not occupied (same `row + col` value)

By using sets for these three constraints, each placement check is O(1).

```
n=4, placing queens row by row:

Row 0: try col 0,1,2,3
  col=1: Q at (0,1)
    Row 1: try col 0,1,2,3
      col=0: safe? 0∉cols, (1-0=1)∉diag1, (1+0=1)∉diag2 ✓
        Row 2: try ...
          col=2: safe? but (2-2=0)∈diag1 (from (0,1)? no: 0-1=-1)
                 Actually: diag1 tracks row-col. (0,1)→-1, (1,0)→1, (2,2)→0
                 Wait, (2,2): col=2∉cols{0,1}, row-col=0∉diag1{-1,1}, row+col=4∉diag2{1,1}... valid
```

## Approach: Backtracking with Constraint Sets

```cpp
class Solution {
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<vector<string>> result;
        vector<int> queens(n, -1);  // queens[row] = col
        set<int> cols, diag1, diag2;  // diag1: row-col, diag2: row+col
        backtrack(n, 0, queens, cols, diag1, diag2, result);
        return result;
    }

private:
    void backtrack(int n, int row, vector<int>& queens,
                   set<int>& cols, set<int>& diag1, set<int>& diag2,
                   vector<vector<string>>& result) {
        if (row == n) {
            result.push_back(buildBoard(queens, n));
            return;
        }
        for (int col = 0; col < n; col++) {
            if (cols.count(col) || diag1.count(row-col) || diag2.count(row+col))
                continue;  // under attack

            queens[row] = col;
            cols.insert(col); diag1.insert(row-col); diag2.insert(row+col);

            backtrack(n, row + 1, queens, cols, diag1, diag2, result);

            cols.erase(col); diag1.erase(row-col); diag2.erase(row+col);
        }
    }

    vector<string> buildBoard(vector<int>& queens, int n) {
        vector<string> board(n, string(n, '.'));
        for (int r = 0; r < n; r++) board[r][queens[r]] = 'Q';
        return board;
    }
};
```

```java
class Solution {
    private List<List<String>> result = new ArrayList<>();
    private Set<Integer> cols = new HashSet<>(), diag1 = new HashSet<>(), diag2 = new HashSet<>();

    public List<List<String>> solveNQueens(int n) {
        int[] queens = new int[n];
        Arrays.fill(queens, -1);
        backtrack(n, 0, queens);
        return result;
    }

    private void backtrack(int n, int row, int[] queens) {
        if (row == n) {
            result.add(buildBoard(queens, n));
            return;
        }
        for (int col = 0; col < n; col++) {
            if (cols.contains(col) || diag1.contains(row-col) || diag2.contains(row+col))
                continue;

            queens[row] = col;
            cols.add(col); diag1.add(row-col); diag2.add(row+col);

            backtrack(n, row + 1, queens);

            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col);
        }
    }

    private List<String> buildBoard(int[] queens, int n) {
        List<String> board = new ArrayList<>();
        for (int r = 0; r < n; r++) {
            char[] row = new char[n];
            Arrays.fill(row, '.');
            row[queens[r]] = 'Q';
            board.add(new String(row));
        }
        return board;
    }
}
```

```typescript
function solveNQueens(n: number): string[][] {
    const result: string[][] = [];
    const queens: number[] = new Array(n).fill(-1);
    const cols = new Set<number>(), diag1 = new Set<number>(), diag2 = new Set<number>();

    function buildBoard(): string[] {
        return queens.map(col => '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1));
    }

    function backtrack(row: number): void {
        if (row === n) {
            result.push(buildBoard());
            return;
        }
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;

            queens[row] = col;
            cols.add(col); diag1.add(row - col); diag2.add(row + col);

            backtrack(row + 1);

            cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
        }
    }

    backtrack(0);
    return result;
}
```

```python
class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        result = []
        queens = [-1] * n  # queens[row] = col
        cols, diag1, diag2 = set(), set(), set()

        def build_board() -> list[str]:
            return ['.' * queens[r] + 'Q' + '.' * (n - queens[r] - 1) for r in range(n)]

        def backtrack(row: int) -> None:
            if row == n:
                result.append(build_board())
                return
            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue
                queens[row] = col
                cols.add(col); diag1.add(row - col); diag2.add(row + col)
                backtrack(row + 1)
                cols.discard(col); diag1.discard(row - col); diag2.discard(row + col)

        backtrack(0)
        return result
```

```go
func solveNQueens(n int) [][]string {
    result := [][]string{}
    queens := make([]int, n)
    for i := range queens { queens[i] = -1 }

    cols  := map[int]bool{}
    diag1 := map[int]bool{}  // row - col
    diag2 := map[int]bool{}  // row + col

    var buildBoard func() []string
    buildBoard = func() []string {
        board := make([]string, n)
        for r, c := range queens {
            row := make([]byte, n)
            for i := range row { row[i] = '.' }
            row[c] = 'Q'
            board[r] = string(row)
        }
        return board
    }

    var backtrack func(row int)
    backtrack = func(row int) {
        if row == n {
            board := buildBoard()
            result = append(result, board)
            return
        }
        for col := 0; col < n; col++ {
            if cols[col] || diag1[row-col] || diag2[row+col] { continue }

            queens[row] = col
            cols[col] = true; diag1[row-col] = true; diag2[row+col] = true

            backtrack(row + 1)

            delete(cols, col); delete(diag1, row-col); delete(diag2, row+col)
        }
    }

    backtrack(0)
    return result
}
```

## Why `row - col` for `\` diagonals and `row + col` for `/` diagonals?

```
Board indices (row, col):

\  diagonals — same (row - col):
(0,0)→0  (0,1)→-1  (0,2)→-2
(1,0)→1  (1,1)→0   (1,2)→-1
(2,0)→2  (2,1)→1   (2,2)→0

/  diagonals — same (row + col):
(0,0)→0  (0,1)→1   (0,2)→2
(1,0)→1  (1,1)→2   (1,2)→3
(2,0)→2  (2,1)→3   (2,2)→4
```

Two cells share a `\` diagonal iff they have the same `row - col`. Two cells share a `/` diagonal iff they have the same `row + col`.

## Dry Run for n=4

```
Row 0, col=1: place Q. cols={1}, d1={-1}, d2={1}
Row 1, col=3: place Q. cols={1,3}, d1={-1,-2}, d2={1,4}
Row 2, col=0: place Q. cols={0,1,3}, d1={-1,-2,2}, d2={1,4,2}
Row 3, col=2: check col=2 not in cols ✓, 3-2=1 not in d1 ✓, 3+2=5 not in d2 ✓
  Place Q → row==4 → record:
  [".Q..", "...Q", "Q...", "..Q."] ✓
```

## Complexity

- **Time:** O(n!) — n choices for row 0, at most n-1 for row 1, etc. With constraint pruning, far fewer branches are explored in practice.
- **Space:** O(n) for queens array + constraint sets + O(n) call stack

## Key Interview Insights

- **Place one queen per row** — this design decision eliminates row conflicts entirely. We only need to track columns and diagonals.
- **Diagonal identifiers** (`row-col` and `row+col`) are the interview insight. Memorize these formulas; they appear in any board problem involving diagonal constraints.
- **`cols`, `diag1`, `diag2` as sets** make conflict checks O(1). Don't use a 2D attacked array — updating it on backtrack is error-prone.
- **N-Queens II (LC 52)** asks for the count only. Skip the board-building step and increment a counter instead.
- **Bitmask optimization** for very fast solutions: represent cols, diag1, diag2 as integers and use bitwise operations. Useful for competitive programming but not required in most interviews.
