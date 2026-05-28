---
title: Word Search
difficulty: Medium
tags: [Array, String, Backtracking, Depth-First Search, Matrix]
link: https://leetcode.com/problems/word-search/
---

# Word Search

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [79. Word Search](https://leetcode.com/problems/word-search/) |
| **Tags** | Array, String, Backtracking, DFS, Matrix |

## Problem Statement

Given an `m × n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

## Intuition

For each cell in the grid, try to spell `word` starting from that cell. At each step, try moving in all 4 directions to match the next character.

The backtracking part: mark a cell as **visited** before recursing, and **unmark** it after. This prevents reusing the same cell within a single path.

```
board:       word = "ABCCED"
A B C E
S F C S
A D E E

Start at (0,0)=A → (0,1)=B → (0,2)=C → (1,2)=C → (2,2)=E → (2,1)=D ✓
```

## Approach: DFS + Backtracking

```cpp
class Solution {
    int rows, cols;
    vector<pair<int,int>> dirs = {{0,1},{0,-1},{1,0},{-1,0}};

public:
    bool exist(vector<vector<char>>& board, string word) {
        rows = board.size();
        cols = board[0].size();

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }

private:
    bool dfs(vector<vector<char>>& board, const string& word, int r, int c, int idx) {
        if (idx == word.size()) return true;  // matched entire word
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        if (board[r][c] != word[idx]) return false;
        if (board[r][c] == '#') return false;  // visited

        char temp = board[r][c];
        board[r][c] = '#';  // mark visited

        for (auto [dr, dc] : dirs) {
            if (dfs(board, word, r + dr, c + dc, idx + 1)) {
                board[r][c] = temp;  // restore before returning
                return true;
            }
        }

        board[r][c] = temp;  // restore (backtrack)
        return false;
    }
};
```

```java
class Solution {
    private int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    private int rows, cols;

    public boolean exist(char[][] board, String word) {
        rows = board.length;
        cols = board[0].length;

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (dfs(board, word, r, c, 0)) return true;
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int r, int c, int idx) {
        if (idx == word.length()) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        if (board[r][c] != word.charAt(idx)) return false;

        char temp = board[r][c];
        board[r][c] = '#';  // mark visited

        for (int[] d : dirs) {
            if (dfs(board, word, r + d[0], c + d[1], idx + 1)) {
                board[r][c] = temp;
                return true;
            }
        }

        board[r][c] = temp;  // unmark (backtrack)
        return false;
    }
}
```

```typescript
function exist(board: string[][], word: string): boolean {
    const rows = board.length, cols = board[0].length;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

    function dfs(r: number, c: number, idx: number): boolean {
        if (idx === word.length) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        if (board[r][c] !== word[idx]) return false;

        const temp = board[r][c];
        board[r][c] = '#';  // mark visited

        for (const [dr, dc] of dirs) {
            if (dfs(r + dr, c + dc, idx + 1)) {
                board[r][c] = temp;
                return true;
            }
        }

        board[r][c] = temp;  // backtrack
        return false;
    }

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true;
        }
    }
    return false;
}
```

```python
class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        rows, cols = len(board), len(board[0])
        dirs = [(0,1),(0,-1),(1,0),(-1,0)]

        def dfs(r: int, c: int, idx: int) -> bool:
            if idx == len(word):
                return True
            if r < 0 or r >= rows or c < 0 or c >= cols:
                return False
            if board[r][c] != word[idx]:
                return False

            temp = board[r][c]
            board[r][c] = '#'  # mark visited

            for dr, dc in dirs:
                if dfs(r + dr, c + dc, idx + 1):
                    board[r][c] = temp  # restore before returning
                    return True

            board[r][c] = temp  # backtrack
            return False

        for r in range(rows):
            for c in range(cols):
                if dfs(r, c, 0):
                    return True
        return False
```

```go
func exist(board [][]byte, word string) bool {
    rows, cols := len(board), len(board[0])
    dirs := [][2]int{{0,1},{0,-1},{1,0},{-1,0}}

    var dfs func(r, c, idx int) bool
    dfs = func(r, c, idx int) bool {
        if idx == len(word) { return true }
        if r < 0 || r >= rows || c < 0 || c >= cols { return false }
        if board[r][c] != word[idx] { return false }

        temp := board[r][c]
        board[r][c] = '#'  // mark visited

        for _, d := range dirs {
            if dfs(r+d[0], c+d[1], idx+1) {
                board[r][c] = temp
                return true
            }
        }

        board[r][c] = temp  // backtrack
        return false
    }

    for r := 0; r < rows; r++ {
        for c := 0; c < cols; c++ {
            if dfs(r, c, 0) { return true }
        }
    }
    return false
}
```

## Dry Run

```
board:          word = "SEE"
S E E
A D E
S F C

Try starting at (0,0)='S': word[0]='S' ✓
  board[0][0]='#'
  Try (0,1)='E': word[1]='E' ✓
    board[0][1]='#'
    Try (0,2)='E': word[2]='E' ✓
      idx==3==len(word) → return true ✓
    board[0][1]='E' (restored on return)
  board[0][0]='S' (restored on return)
  return true ✓
```

## Complexity

- **Time:** O(m × n × 4^L) where L = length of word
  - We start from each of the m×n cells
  - From each cell, DFS explores up to 4 directions at each of L steps
- **Space:** O(L) recursion depth (call stack)

## Optimization: Early Character Frequency Check

Before running DFS, check that the board has enough of each character in `word`. If `word` has 5 'A's but the board has only 3, return false immediately.

```cpp
// Add before the DFS loops:
unordered_map<char, int> boardCount, wordCount;
for (auto& row : board) for (char c : row) boardCount[c]++;
for (char c : word) wordCount[c]++;
for (auto& [c, cnt] : wordCount)
    if (boardCount[c] < cnt) return false;
// Optional: reverse word if first char is more common than last
if (boardCount[word[0]] > boardCount[word.back()])
    reverse(word.begin(), word.end());
```

```java
// Add before the DFS loops:
Map<Character, Integer> boardCount = new HashMap<>(), wordCount = new HashMap<>();
for (char[] row : board) for (char c : row) boardCount.merge(c, 1, Integer::sum);
for (char c : word.toCharArray()) wordCount.merge(c, 1, Integer::sum);
for (Map.Entry<Character, Integer> e : wordCount.entrySet())
    if (boardCount.getOrDefault(e.getKey(), 0) < e.getValue()) return false;
// Optional: reverse word if first char is more common than last
if (boardCount.getOrDefault(word.charAt(0), 0) >
    boardCount.getOrDefault(word.charAt(word.length()-1), 0))
    word = new StringBuilder(word).reverse().toString();
```

```typescript
// Add before the DFS loops:
const boardCount: Record<string, number> = {};
const wordCount: Record<string, number> = {};
for (const row of board) for (const c of row) boardCount[c] = (boardCount[c] ?? 0) + 1;
for (const c of word) wordCount[c] = (wordCount[c] ?? 0) + 1;
for (const c in wordCount)
    if ((boardCount[c] ?? 0) < wordCount[c]) return false;
// Optional: reverse word if first char is more common than last
if ((boardCount[word[0]] ?? 0) > (boardCount[word[word.length-1]] ?? 0))
    word = word.split('').reverse().join('');
```

```python
from collections import Counter

# Add before the DFS loops:
board_count = Counter(c for row in board for c in row)
word_count  = Counter(word)
if any(word_count[c] > board_count[c] for c in word_count):
    return False

# Also: if word[0] appears less than word[-1], reverse word
# (reduces branching since common starting chars mean more DFS paths)
if board_count[word[0]] > board_count[word[-1]]:
    word = word[::-1]
```

```go
// Add before the DFS loops:
boardCount := map[byte]int{}
wordCount  := map[byte]int{}
for _, row := range board { for _, c := range row { boardCount[byte(c)]++ } }
for i := 0; i < len(word); i++ { wordCount[word[i]]++ }
for c, cnt := range wordCount {
    if boardCount[c] < cnt { return false }
}
// Optional: reverse word if first char is more common than last
if boardCount[word[0]] > boardCount[word[len(word)-1]] {
    bs := []byte(word)
    for i, j := 0, len(bs)-1; i < j; i, j = i+1, j-1 { bs[i], bs[j] = bs[j], bs[i] }
    word = string(bs)
}
```

## Key Interview Insights

- **Mark-before-recurse, unmark-after** is the critical pattern. Unlike using a separate `visited` set, marking directly in the board is O(1) and avoids extra memory.
- **Restore on early return** — when we find the word and return `true` up the call stack, we still restore the cell before returning to the outer loop. This is important if the outer loop is later used for a different search (though for this problem, we can return immediately).
- **The `idx == len(word)` base case** fires *before* any bounds/character checks. This is important: after matching the last character, we've already marked it visited — returning early before re-entering DFS is correct.
- **Word Search II (LC 212)** extends this to finding multiple words simultaneously using a Trie for efficient prefix checking. Worth mentioning as a follow-up.
