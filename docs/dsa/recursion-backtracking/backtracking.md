---
title: Backtracking
description: The systematic method for exploring all possibilities — with the discipline to abandon dead ends early
---

# Backtracking

Backtracking is **recursive search with pruning**. You build a solution incrementally, and at each step you either commit to a choice or abandon it (backtrack) the moment you know it cannot lead to a valid solution.

The name comes from what the algorithm does: it goes as deep as it can down a path, and when that path fails, it steps *back* to the last decision point and tries the next option.

## The Core Idea

Think of solving a maze. You walk until you hit a wall, then retrace your steps to the last fork and try a different direction. Backtracking is this process, generalized to arbitrary decision problems.

Every backtracking problem has:
- A **state** — the current partial solution (what choices you've made so far)
- **Choices** — the decisions available at the current step
- A **constraint** — what makes a partial solution invalid (prune here)
- A **goal** — what makes a complete solution valid (record here)

## The Universal Template

```cpp
void backtrack(vector<int>& current, vector<int>& choices) {
    if (isGoal(current)) {
        result.push_back(current);    // found a valid complete solution
        return;
    }
    for (int choice : choices) {
        if (isValid(current, choice)) {       // pruning
            current.push_back(choice);        // commit
            backtrack(current, nextChoices);  // explore
            current.pop_back();               // undo (backtrack)
        }
    }
}
```

```java
void backtrack(List<Integer> current, int[] choices) {
    if (isGoal(current)) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int choice : choices) {
        if (isValid(current, choice)) {
            current.add(choice);              // make choice
            backtrack(current, choices);      // recurse
            current.remove(current.size()-1); // undo
        }
    }
}
```

```typescript
function backtrack(current: number[], choices: number[]): void {
    if (isGoal(current)) {
        result.push([...current]);
        return;
    }
    for (const choice of choices) {
        if (isValid(current, choice)) {
            current.push(choice);
            backtrack(current, choices);
            current.pop();
        }
    }
}
```

```python
def backtrack(current: list, choices: list) -> None:
    if is_goal(current):
        result.append(current[:])  # snapshot of current state
        return
    for choice in choices:
        if is_valid(current, choice):
            current.append(choice)       # make choice
            backtrack(current, choices)  # recurse
            current.pop()               # undo choice
```

```go
func backtrack(current []int, choices []int) {
    if isGoal(current) {
        snapshot := make([]int, len(current))
        copy(snapshot, current)
        result = append(result, snapshot)
        return
    }
    for _, choice := range choices {
        if isValid(current, choice) {
            current = append(current, choice)
            backtrack(current, choices)
            current = current[:len(current)-1]  // undo
        }
    }
}
```

The **undo step** is what separates backtracking from plain recursion. After exploring a branch, you must restore the state exactly as it was before that choice — so the next choice starts from a clean slate.

## The State Space Tree

Backtracking explores a **state space tree** (also called a decision tree). Each node represents a partial solution; each edge represents a choice. The leaves are either complete solutions or dead ends.

```
                    []
          /          |          \
        [1]         [2]         [3]
       /   \       /   \       /   \
    [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
      |     |     |     |     |     |
  [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]
```

Without pruning, we visit every node. **Pruning** cuts branches early, eliminating entire subtrees that cannot produce valid solutions.

## Pruning: The Performance Multiplier

The difference between an exponential algorithm and a practical one is almost always pruning quality.

```cpp
// Combination Sum — target = 7, candidates = [2, 3, 6, 7]
// Sorted: stop as soon as candidate > remaining
void backtrack(vector<int>& candidates, int remaining,
               int start, vector<int>& current, vector<vector<int>>& result) {
    if (remaining == 0) { result.push_back(current); return; }
    for (int i = start; i < candidates.size(); i++) {
        if (candidates[i] > remaining) break;  // PRUNE: rest are also too large
        current.push_back(candidates[i]);
        backtrack(candidates, remaining - candidates[i], i, current, result);
        current.pop_back();
    }
}
```

```java
void backtrack(int[] candidates, int remaining,
               int start, List<Integer> current, List<List<Integer>> result) {
    if (remaining == 0) { result.add(new ArrayList<>(current)); return; }
    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) break;  // PRUNE
        current.add(candidates[i]);
        backtrack(candidates, remaining - candidates[i], i, current, result);
        current.remove(current.size() - 1);
    }
}
```

```typescript
function backtrack(candidates: number[], remaining: number,
                   start: number, current: number[], result: number[][]): void {
    if (remaining === 0) { result.push([...current]); return; }
    for (let i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) break;  // PRUNE
        current.push(candidates[i]);
        backtrack(candidates, remaining - candidates[i], i, current, result);
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
        if candidates[i] > remaining:
            break  # PRUNE: sorted, rest also too large
        current.append(candidates[i])
        backtrack(i, current, remaining - candidates[i])
        current.pop()
```

```go
func backtrack(candidates []int, remaining, start int, current []int) {
    if remaining == 0 {
        snapshot := make([]int, len(current))
        copy(snapshot, current)
        result = append(result, snapshot)
        return
    }
    for i := start; i < len(candidates); i++ {
        if candidates[i] > remaining { break }  // PRUNE
        current = append(current, candidates[i])
        backtrack(candidates, remaining-candidates[i], i, current)
        current = current[:len(current)-1]
    }
}
```

## Three Backtracking Patterns

### Pattern 1: Subsets / Combinations

Build a subset by deciding at each position: include or skip. Iterate from a `start` index forward.

```cpp
void backtrack(vector<int>& nums, int start, vector<int>& current, vector<vector<int>>& result) {
    result.push_back(current);
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
    result.append(current[:])
    for i in range(start, len(nums)):
        current.append(nums[i])
        backtrack(i + 1, current)
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

Key: iterate from `start` index to avoid reusing elements and avoid duplicate orderings.

### Pattern 2: Permutations

Build a permutation by choosing which unused element to place next.

```cpp
void backtrack(vector<int>& nums, vector<bool>& used,
               vector<int>& current, vector<vector<int>>& result) {
    if (current.size() == nums.size()) { result.push_back(current); return; }
    for (int i = 0; i < nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true;
        current.push_back(nums[i]);
        backtrack(nums, used, current, result);
        current.pop_back();
        used[i] = false;
    }
}
```

```java
void backtrack(int[] nums, boolean[] used, List<Integer> current, List<List<Integer>> result) {
    if (current.size() == nums.length) { result.add(new ArrayList<>(current)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        current.add(nums[i]);
        backtrack(nums, used, current, result);
        current.remove(current.size() - 1);
        used[i] = false;
    }
}
```

```typescript
function backtrack(nums: number[], used: boolean[], current: number[], result: number[][]): void {
    if (current.length === nums.length) { result.push([...current]); return; }
    for (let i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        current.push(nums[i]);
        backtrack(nums, used, current, result);
        current.pop();
        used[i] = false;
    }
}
```

```python
def backtrack(current: list, used: list) -> None:
    if len(current) == len(nums):
        result.append(current[:])
        return
    for i in range(len(nums)):
        if used[i]:
            continue
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

Key: track which elements are "used" via a boolean array. Reset on backtrack.

### Pattern 3: Grid Exploration

Explore a 2D grid by making directional choices (up/down/left/right).

```cpp
bool dfs(vector<vector<char>>& board, string& word, int r, int c, int idx) {
    if (idx == word.size()) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (board[r][c] != word[idx]) return false;
    char tmp = board[r][c];
    board[r][c] = '#';  // mark visited
    bool found = dfs(board, word, r+1,c,idx+1) || dfs(board, word, r-1,c,idx+1)
              || dfs(board, word, r,c+1,idx+1) || dfs(board, word, r,c-1,idx+1);
    board[r][c] = tmp;  // restore
    return found;
}
```

```java
boolean dfs(char[][] board, String word, int r, int c, int idx) {
    if (idx == word.length()) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (board[r][c] != word.charAt(idx)) return false;
    char tmp = board[r][c];
    board[r][c] = '#';  // mark visited
    boolean found = dfs(board, word, r+1,c,idx+1) || dfs(board, word, r-1,c,idx+1)
                 || dfs(board, word, r,c+1,idx+1) || dfs(board, word, r,c-1,idx+1);
    board[r][c] = tmp;  // restore
    return found;
}
```

```typescript
function dfs(r: number, c: number, idx: number): boolean {
    if (idx === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (board[r][c] !== word[idx]) return false;
    const tmp = board[r][c];
    board[r][c] = '#';  // mark visited
    const found = dfs(r+1,c,idx+1) || dfs(r-1,c,idx+1)
               || dfs(r,c+1,idx+1) || dfs(r,c-1,idx+1);
    board[r][c] = tmp;  // restore
    return found;
}
```

```python
def dfs(r: int, c: int, idx: int) -> bool:
    if idx == len(word): return True
    if r < 0 or r >= rows or c < 0 or c >= cols: return False
    if board[r][c] != word[idx]: return False
    temp, board[r][c] = board[r][c], '#'  # mark visited
    found = (dfs(r+1,c,idx+1) or dfs(r-1,c,idx+1)
          or dfs(r,c+1,idx+1) or dfs(r,c-1,idx+1))
    board[r][c] = temp  # restore
    return found
```

```go
func dfs(board [][]byte, word string, r, c, idx int) bool {
    if idx == len(word) { return true }
    if r < 0 || r >= rows || c < 0 || c >= cols { return false }
    if board[r][c] != word[idx] { return false }
    tmp := board[r][c]
    board[r][c] = '#'  // mark visited
    found := dfs(board, word, r+1,c,idx+1) || dfs(board, word, r-1,c,idx+1) ||
             dfs(board, word, r,c+1,idx+1) || dfs(board, word, r,c-1,idx+1)
    board[r][c] = tmp  // restore
    return found
}
```

Key: mark the current cell as visited *before* recursing, unmark it *after*.

## Identifying Backtracking Problems

Look for these signals in the problem statement:

| Signal | Example |
|---|---|
| "Find **all** combinations/permutations/subsets" | LC 46, 78, 39 |
| "Generate all valid..." | LC 22 (Generate Parentheses), LC 17 |
| "Find if a path/arrangement **exists**" | LC 79 (Word Search) |
| "Constraint satisfaction" | LC 36 (Valid Sudoku), LC 51 (N-Queens) |
| Exponential answer space, small `n` (n ≤ 20) | Strong backtracking signal |

## Complexity Analysis

Backtracking complexity is problem-specific but follows patterns:

| Problem Type | Time Complexity | Space (call stack) |
|---|---|---|
| Subsets of n items | O(2ⁿ) | O(n) |
| Permutations of n items | O(n! × n) | O(n) |
| Combinations C(n,k) | O(C(n,k) × k) | O(k) |
| Grid path of length L | O(4^L) | O(L) |

The time complexity equals the number of leaves × work per leaf.

## Snapshot vs Reference

A critical bug in backtracking: when you record a valid solution, you must **snapshot** it (copy it), not record a reference to the mutable current state.

```cpp
// WRONG: records a reference — current will be empty when checked later
result.push_back(current);  // OK in C++ since vector copies by value — but in pointer contexts, copy explicitly

// CORRECT in all languages: make a deep copy
result.push_back(vector<int>(current));   // C++
```

```java
// WRONG: all entries share the same List object
result.add(current);

// CORRECT
result.add(new ArrayList<>(current));
```

```typescript
// WRONG
result.push(current);

// CORRECT
result.push([...current]);
```

```python
# WRONG: records a reference — all results will be the same empty list
result.append(current)

# CORRECT: records a snapshot of the current state
result.append(current[:])
```

```go
// WRONG: slice header copies but underlying array is shared
result = append(result, current)

// CORRECT: deep copy
snapshot := make([]int, len(current))
copy(snapshot, current)
result = append(result, snapshot)
```

## Backtracking vs Dynamic Programming

Both explore overlapping subproblems, but differ in intent:

| | Backtracking | Dynamic Programming |
|---|---|---|
| **Goal** | Find all solutions / one feasible solution | Find optimal value |
| **Subproblems** | Typically non-overlapping (different paths) | Overlapping (same subproblem many times) |
| **State** | Mutable, restored after each call | Stored permanently in a table |
| **Pruning** | Cut invalid branches | Not applicable |
| **Answer** | Collection of solutions | Single value |

## Optimizing Backtracking

1. **Sort inputs** — Enables skipping duplicates and early termination (e.g., remaining < 0)
2. **Prune aggressively** — Any constraint that eliminates a choice early is worth adding
3. **Skip duplicates** — When input has duplicates and you want unique results, sort first then skip `if i > start && candidates[i] == candidates[i-1]: continue`
4. **Order choices wisely** — Try the most constrained choices first (reduces branching)
5. **Use bitmask for visited state** — Faster than boolean arrays for small n

## The "Leap of Faith"

The hardest part of backtracking is trusting the recursion. When writing `backtrack(state)`, *assume* it correctly explores all possibilities from that state and returns. You only need to:
1. Define the base case correctly
2. Make one valid choice
3. Trust the recursive call handles the rest
4. Undo that choice

This "leap of faith" is the same as inductive proof: assume it works for n-1 steps, show it works for n steps.
