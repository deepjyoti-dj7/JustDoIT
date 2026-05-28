---
title: Classic Backtracking Problems
description: The essential problem patterns every interviewer tests — mapped to templates you can reuse
---

# Classic Backtracking Problems

Backtracking problems in interviews cluster into a small number of patterns. Master the pattern, and any new problem in that category becomes a template-fill exercise.

## Pattern Map

| Pattern | Core Operation | Representative Problems |
|---|---|---|
| **Subsets** | Include or skip each element | Subsets (78), Subsets II (90) |
| **Permutations** | Place unused elements in order | Permutations (46), Permutations II (47) |
| **Combinations** | Pick k elements from n | Combinations (77), Combination Sum (39, 40) |
| **Partitioning** | Split a string by a constraint | Palindrome Partitioning (131) |
| **Grid Search** | Walk a 2D grid following a path | Word Search (79) |
| **Constraint Satisfaction** | Place items obeying hard rules | N-Queens (51), Sudoku Solver (37) |
| **String Building** | Construct valid strings character by character | Letter Combinations (17), Generate Parentheses (22) |

---

## Pattern 1: Subsets

**Decision at each element:** include it or skip it. Every node in the recursion tree is a valid subset — record `current` at the start of every call.

```cpp
void backtrack(vector<int>& nums, int start, vector<int>& current, vector<vector<int>>& result) {
    result.push_back(current);       // every state is a valid subset
    for (int i = start; i < nums.size(); i++) {
        current.push_back(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.pop_back();
    }
}
```

```java
void backtrack(int[] nums, int start, List<Integer> current, List<List<Integer>> result) {
    result.add(new ArrayList<>(current));
    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.remove(current.size() - 1);
    }
}
```

```typescript
function backtrack(nums: number[], start: number, current: number[], result: number[][]): void {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
        current.push(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.pop();
    }
}
```

```python
def backtrack(start: int, current: list) -> None:
    result.append(current[:])     # every node is a valid subset
    for i in range(start, len(nums)):
        current.append(nums[i])
        backtrack(i + 1, current)  # i+1: no reuse of elements
        current.pop()
```

```go
var backtrack func(start int, current []int)
backtrack = func(start int, current []int) {
    snapshot := make([]int, len(current))
    copy(snapshot, current)
    result = append(result, snapshot)
    for i := start; i < len(nums); i++ {
        current = append(current, nums[i])
        backtrack(i+1, current)
        current = current[:len(current)-1]
    }
}
```

**With duplicates (Subsets II):** Sort first, then skip `nums[i] == nums[i-1]` when `i > start`.

---

## Pattern 2: Permutations

**Decision at each position:** which unused element to place here. Track used indices with a boolean array.

```cpp
void backtrack(vector<int>& nums, vector<bool>& used,
               vector<int>& current, vector<vector<int>>& result) {
    if (current.size() == nums.size()) { result.push_back(current); return; }
    for (int i = 0; i < nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true;  current.push_back(nums[i]);
        backtrack(nums, used, current, result);
        current.pop_back();  used[i] = false;
    }
}
```

```java
void backtrack(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> result) {
    if (current.size() == nums.length) { result.add(new ArrayList<>(current)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;  current.add(nums[i]);
        backtrack(nums, used, current, result);
        current.remove(current.size() - 1);  used[i] = false;
    }
}
```

```typescript
function backtrack(nums: number[], used: boolean[], current: number[], result: number[][]): void {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;  current.push(nums[i]);
        backtrack(nums, used, current, result);
        current.pop();  used[i] = false;
    }
}
```

```python
def backtrack(current: list, used: list) -> None:
    if len(current) == len(nums):
        result.append(current[:])
        return
    for i in range(len(nums)):
        if used[i]: continue
        used[i] = True
        current.append(nums[i])
        backtrack(current, used)
        current.pop()
        used[i] = False
```

```go
var backtrack func(current []int, used []bool)
backtrack = func(current []int, used []bool) {
    if len(current) == len(nums) {
        snapshot := make([]int, len(current))
        copy(snapshot, current)
        result = append(result, snapshot)
        return
    }
    for i := 0; i < len(nums); i++ {
        if used[i] { continue }
        used[i] = true
        current = append(current, nums[i])
        backtrack(current, used)
        current = current[:len(current)-1]
        used[i] = false
    }
}
```

**With duplicates:** Sort, then skip `if i > 0 and nums[i] == nums[i-1] and not used[i-1]`.

---

## Pattern 3: Combinations / Combination Sum

Similar to subsets, but with a target sum constraint. Sort first; break when current candidate exceeds remaining target.

**Can reuse elements (Combination Sum):** Pass `i` (not `i+1`) to the next call.

**Cannot reuse elements (Combination Sum II):** Pass `i+1` and skip duplicates.

```cpp
void backtrack(vector<int>& candidates, int remaining,
               int start, vector<int>& current, vector<vector<int>>& result) {
    if (remaining == 0) { result.push_back(current); return; }
    for (int i = start; i < candidates.size(); i++) {
        if (candidates[i] > remaining) break;
        current.push_back(candidates[i]);
        backtrack(candidates, remaining - candidates[i], i, current, result);  // i: reuse
        current.pop_back();
    }
}
```

```java
void backtrack(int[] candidates, int remaining, int start,
               List<Integer> current, List<List<Integer>> result) {
    if (remaining == 0) { result.add(new ArrayList<>(current)); return; }
    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) break;
        current.add(candidates[i]);
        backtrack(candidates, remaining - candidates[i], i, current, result);  // i: reuse
        current.remove(current.size() - 1);
    }
}
```

```typescript
function backtrack(candidates: number[], remaining: number,
                   start: number, current: number[], result: number[][]): void {
    if (remaining === 0) { result.push([...current]); return; }
    for (let i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) break;
        current.push(candidates[i]);
        backtrack(candidates, remaining - candidates[i], i, current, result);  // i: reuse
        current.pop();
    }
}
```

```python
def backtrack(start: int, current: list, remaining: int) -> None:
    if remaining == 0:
        result.append(current[:])
        return
    for i in range(start, len(candidates)):
        if candidates[i] > remaining: break  # sorted: all subsequent too large
        current.append(candidates[i])
        backtrack(i, current, remaining - candidates[i])  # i: reuse allowed
        current.pop()
```

```go
var backtrack func(remaining, start int, current []int)
backtrack = func(remaining, start int, current []int) {
    if remaining == 0 {
        snapshot := make([]int, len(current))
        copy(snapshot, current)
        result = append(result, snapshot)
        return
    }
    for i := start; i < len(candidates); i++ {
        if candidates[i] > remaining { break }
        current = append(current, candidates[i])
        backtrack(remaining-candidates[i], i, current)  // i: reuse allowed
        current = current[:len(current)-1]
    }
}
```

---

## Pattern 4: String Partitioning

**Decision at each split point:** where to end the current partition. Only recurse when the current segment satisfies the constraint (e.g., is a palindrome).

```cpp
void backtrack(const string& s, int start,
               vector<string>& current, vector<vector<string>>& result) {
    if (start == s.size()) { result.push_back(current); return; }
    for (int end = start + 1; end <= s.size(); end++) {
        if (isPalin(s, start, end - 1)) {
            current.push_back(s.substr(start, end - start));
            backtrack(s, end, current, result);
            current.pop_back();
        }
    }
}
```

```java
void backtrack(String s, int start, List<String> current, List<List<String>> result) {
    if (start == s.length()) { result.add(new ArrayList<>(current)); return; }
    for (int end = start + 1; end <= s.length(); end++) {
        if (isPalin(s, start, end - 1)) {
            current.add(s.substring(start, end));
            backtrack(s, end, current, result);
            current.remove(current.size() - 1);
        }
    }
}
```

```typescript
function backtrack(start: number, current: string[], result: string[][]): void {
    if (start === s.length) { result.push([...current]); return; }
    for (let end = start + 1; end <= s.length; end++) {
        if (isPalin(start, end - 1)) {
            current.push(s.slice(start, end));
            backtrack(end, current, result);
            current.pop();
        }
    }
}
```

```python
def backtrack(start: int, current: list) -> None:
    if start == len(s):
        result.append(current[:])
        return
    for end in range(start + 1, len(s) + 1):
        if is_palindrome(s, start, end - 1):  # check before recursing
            current.append(s[start:end])
            backtrack(end, current)
            current.pop()
```

```go
var backtrack func(start int, current []string)
backtrack = func(start int, current []string) {
    if start == len(s) {
        snapshot := make([]string, len(current))
        copy(snapshot, current)
        result = append(result, snapshot)
        return
    }
    for end := start + 1; end <= len(s); end++ {
        if isPalin(s, start, end-1) {
            current = append(current, s[start:end])
            backtrack(end, current)
            current = current[:len(current)-1]
        }
    }
}
```

---

## Pattern 5: Grid Search (Word Search)

Mark the current cell visited *before* recursing, unmark *after*. Without this, you may revisit the same cell within the same path.

```cpp
bool dfs(vector<vector<char>>& board, const string& word, int r, int c, int idx) {
    if (idx == word.size()) return true;
    if (r<0||r>=rows||c<0||c>=cols||board[r][c]!=word[idx]) return false;
    char tmp = board[r][c];
    board[r][c] = '#';  // mark visited
    bool found = dfs(board,word,r+1,c,idx+1)||dfs(board,word,r-1,c,idx+1)
              || dfs(board,word,r,c+1,idx+1)||dfs(board,word,r,c-1,idx+1);
    board[r][c] = tmp;  // restore
    return found;
}
```

```java
boolean dfs(char[][] board, String word, int r, int c, int idx) {
    if (idx == word.length()) return true;
    if (r<0||r>=rows||c<0||c>=cols||board[r][c]!=word.charAt(idx)) return false;
    char tmp = board[r][c];
    board[r][c] = '#';
    boolean found = dfs(board,word,r+1,c,idx+1)||dfs(board,word,r-1,c,idx+1)
                 || dfs(board,word,r,c+1,idx+1)||dfs(board,word,r,c-1,idx+1);
    board[r][c] = tmp;
    return found;
}
```

```typescript
function dfs(r: number, c: number, idx: number): boolean {
    if (idx === word.length) return true;
    if (r<0||r>=rows||c<0||c>=cols||board[r][c]!==word[idx]) return false;
    const tmp = board[r][c];
    board[r][c] = '#';
    const found = dfs(r+1,c,idx+1)||dfs(r-1,c,idx+1)||dfs(r,c+1,idx+1)||dfs(r,c-1,idx+1);
    board[r][c] = tmp;
    return found;
}
```

```python
def dfs(r: int, c: int, idx: int) -> bool:
    if idx == len(word): return True
    if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[idx]: return False
    temp, board[r][c] = board[r][c], '#'  # mark visited
    found = (dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1)
          or dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1))
    board[r][c] = temp  # restore
    return found
```

```go
func dfs(board [][]byte, word string, r, c, idx int) bool {
    if idx == len(word) { return true }
    if r<0||r>=rows||c<0||c>=cols||board[r][c]!=word[idx] { return false }
    tmp := board[r][c]
    board[r][c] = '#'
    found := dfs(board,word,r+1,c,idx+1)||dfs(board,word,r-1,c,idx+1)||
             dfs(board,word,r,c+1,idx+1)||dfs(board,word,r,c-1,idx+1)
    board[r][c] = tmp
    return found
}
```

---

## Pattern 6: Constraint Satisfaction (N-Queens, Sudoku)

Maintain fast constraint-check sets. For N-Queens, track `cols`, `diag1 (row-col)`, and `diag2 (row+col)`.

```cpp
void backtrack(int n, int row, vector<int>& queens,
               set<int>& cols, set<int>& d1, set<int>& d2) {
    if (row == n) { result.push_back(buildBoard(queens, n)); return; }
    for (int col = 0; col < n; col++) {
        if (cols.count(col)||d1.count(row-col)||d2.count(row+col)) continue;
        queens[row] = col;
        cols.insert(col); d1.insert(row-col); d2.insert(row+col);
        backtrack(n, row+1, queens, cols, d1, d2);
        cols.erase(col); d1.erase(row-col); d2.erase(row+col);
    }
}
```

```java
void backtrack(int n, int row, int[] queens,
               Set<Integer> cols, Set<Integer> d1, Set<Integer> d2) {
    if (row == n) { result.add(buildBoard(queens, n)); return; }
    for (int col = 0; col < n; col++) {
        if (cols.contains(col)||d1.contains(row-col)||d2.contains(row+col)) continue;
        queens[row] = col;
        cols.add(col); d1.add(row-col); d2.add(row+col);
        backtrack(n, row+1, queens, cols, d1, d2);
        cols.remove(col); d1.remove(row-col); d2.remove(row+col);
    }
}
```

```typescript
function backtrack(row: number, queens: number[],
                   cols: Set<number>, d1: Set<number>, d2: Set<number>): void {
    if (row === n) { result.push(buildBoard(queens)); return; }
    for (let col = 0; col < n; col++) {
        if (cols.has(col)||d1.has(row-col)||d2.has(row+col)) continue;
        queens[row] = col;
        cols.add(col); d1.add(row-col); d2.add(row+col);
        backtrack(row+1, queens, cols, d1, d2);
        cols.delete(col); d1.delete(row-col); d2.delete(row+col);
    }
}
```

```python
def backtrack(row: int) -> None:
    if row == n:
        result.append(build_board(queens))
        return
    for col in range(n):
        if col in cols or (row-col) in diag1 or (row+col) in diag2:
            continue  # constraint violated: prune
        cols.add(col); diag1.add(row-col); diag2.add(row+col)
        queens[row] = col
        backtrack(row + 1)
        cols.discard(col); diag1.discard(row-col); diag2.discard(row+col)
```

```go
var backtrack func(row int, queens []int, cols, d1, d2 map[int]bool)
backtrack = func(row int, queens []int, cols, d1, d2 map[int]bool) {
    if row == n { result = append(result, buildBoard(queens, n)); return }
    for col := 0; col < n; col++ {
        if cols[col]||d1[row-col]||d2[row+col] { continue }
        queens[row] = col
        cols[col]=true; d1[row-col]=true; d2[row+col]=true
        backtrack(row+1, queens, cols, d1, d2)
        delete(cols,col); delete(d1,row-col); delete(d2,row+col)
    }
}
```

---

## Complexity Quick Reference

| Problem | # Solutions | Time Complexity | Notes |
|---|---|---|---|
| Subsets (n=20) | 2ⁿ | O(2ⁿ × n) | Copy each subset |
| Permutations (n=8) | n! | O(n! × n) | Copy each permutation |
| Combination Sum | Varies | O(2^target) | Depends on candidates |
| Palindrome Partitioning | Varies | O(n × 2ⁿ) | 2ⁿ partitions × O(n) check |
| Word Search | — | O(m×n × 4^L) | L = word length |
| N-Queens | — | O(n!) | With constraint pruning |
| Sudoku | — | O(9^81) worst | Prunes aggressively in practice |

---

## Interview Strategy

**When the problem says "find all":** immediate backtracking signal.

**Small n (n ≤ 20):** exponential is acceptable. Use backtracking freely.

**State what you're backtracking over:**
> "I'll backtrack over the elements. At each step I decide whether to include the current element."

**Mention pruning before coding:**
> "I'll sort the array first so I can break early when the current candidate exceeds the remaining target."

**For constraint problems, name your invariants:**
> "I'll track which columns and diagonals are occupied so each placement check is O(1)."
