---
title: Number of Islands
difficulty: Medium
tags: [Graph, BFS, DFS, Grid]
link: https://leetcode.com/problems/number-of-islands/
---

# Number of Islands

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [200. Number of Islands](https://leetcode.com/problems/number-of-islands/) |
| **Tags** | Graph, DFS, BFS, Grid |

## Problem Statement

Given a 2D grid of `'1'`s (land) and `'0'`s (water), count the number of islands. An island is formed by connecting adjacent lands horizontally or vertically.

## Intuition

Each island is a connected component of `'1'` cells. Scan the grid — whenever you hit an unvisited `'1'`, start a DFS/BFS to mark all connected land cells as visited, then increment the island count. The number of times you start a fresh DFS = number of islands.

**Key insight:** Mutate the grid in-place (set `'1'` → `'0'`) to mark visited cells. Avoids a separate visited array.

## Approach 1: DFS (In-Place Mutation)

When you find a `'1'`, recursively flood-fill all connected `'1'`s to `'0'`. Count how many times you start this flood-fill.

```cpp
class Solution {
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != '1') return;
        grid[r][c] = '0';  // mark visited
        dfs(grid, r+1, c); dfs(grid, r-1, c);
        dfs(grid, r, c+1); dfs(grid, r, c-1);
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < grid.size(); r++)
            for (int c = 0; c < grid[0].size(); c++)
                if (grid[r][c] == '1') { dfs(grid, r, c); count++; }
        return count;
    }
};
```

```java
class Solution {
    private void dfs(char[][] grid, int r, int c) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r+1, c); dfs(grid, r-1, c);
        dfs(grid, r, c+1); dfs(grid, r, c-1);
    }
    public int numIslands(char[][] grid) {
        int count = 0;
        for (int r = 0; r < grid.length; r++)
            for (int c = 0; c < grid[0].length; c++)
                if (grid[r][c] == '1') { dfs(grid, r, c); count++; }
        return count;
    }
}
```

```typescript
function numIslands(grid: string[][]): number {
    function dfs(r: number, c: number) {
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
        grid[r][c] = '0';
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1);
    }
    let count = 0;
    for (let r = 0; r < grid.length; r++)
        for (let c = 0; c < grid[0].length; c++)
            if (grid[r][c] === '1') { dfs(r, c); count++; }
    return count;
}
```

```python
class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        def dfs(r: int, c: int) -> None:
            if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != '1':
                return
            grid[r][c] = '0'  # mark visited
            dfs(r+1, c); dfs(r-1, c)
            dfs(r, c+1); dfs(r, c-1)

        count = 0
        for r in range(len(grid)):
            for c in range(len(grid[0])):
                if grid[r][c] == '1':
                    dfs(r, c)
                    count += 1
        return count
```

```go
func numIslands(grid [][]byte) int {
    var dfs func(r, c int)
    dfs = func(r, c int) {
        if r < 0 || r >= len(grid) || c < 0 || c >= len(grid[0]) || grid[r][c] != '1' { return }
        grid[r][c] = '0'
        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)
    }
    count := 0
    for r := range grid {
        for c := range grid[r] {
            if grid[r][c] == '1' { dfs(r, c); count++ }
        }
    }
    return count
}
```

**Complexity:**
- Time: O(rows × cols) — each cell visited at most once
- Space: O(rows × cols) — recursion stack in worst case (all land)

## Approach 2: BFS (Iterative — Avoids Stack Overflow)

For very large grids, DFS risks stack overflow. Use BFS with an explicit queue.

```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        int rows = grid.size(), cols = grid[0].size();
        int count = 0;
        vector<vector<int>> dirs = {{1,0},{-1,0},{0,1},{0,-1}};

        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] != '1') continue;
                count++;
                queue<pair<int,int>> q;
                q.push({r, c}); grid[r][c] = '0';
                while (!q.empty()) {
                    auto [cr, cc] = q.front(); q.pop();
                    for (auto& d : dirs) {
                        int nr = cr+d[0], nc = cc+d[1];
                        if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]=='1') {
                            grid[nr][nc] = '0'; q.push({nr,nc});
                        }
                    }
                }
            }
        }
        return count;
    }
};
```

```java
int numIslands(char[][] grid) {
    int rows = grid.length, cols = grid[0].length, count = 0;
    int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] != '1') continue;
            count++;
            Queue<int[]> q = new LinkedList<>();
            q.offer(new int[]{r, c}); grid[r][c] = '0';
            while (!q.isEmpty()) {
                int[] cur = q.poll();
                for (int[] d : dirs) {
                    int nr = cur[0]+d[0], nc = cur[1]+d[1];
                    if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]=='1') {
                        grid[nr][nc] = '0'; q.offer(new int[]{nr, nc});
                    }
                }
            }
        }
    }
    return count;
}
```

```typescript
function numIslands(grid: string[][]): number {
    const rows = grid.length, cols = grid[0].length;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] !== '1') continue;
            count++;
            const q: [number,number][] = [[r, c]];
            grid[r][c] = '0';
            let head = 0;
            while (head < q.length) {
                const [cr, cc] = q[head++];
                for (const [dr, dc] of dirs) {
                    const nr = cr+dr, nc = cc+dc;
                    if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]==='1') {
                        grid[nr][nc] = '0'; q.push([nr, nc]);
                    }
                }
            }
        }
    }
    return count;
}
```

```python
from collections import deque

class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        rows, cols = len(grid), len(grid[0])
        count = 0
        dirs = [(1,0),(-1,0),(0,1),(0,-1)]

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != '1': continue
                count += 1
                q = deque([(r, c)])
                grid[r][c] = '0'
                while q:
                    cr, cc = q.popleft()
                    for dr, dc in dirs:
                        nr, nc = cr+dr, cc+dc
                        if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]=='1':
                            grid[nr][nc] = '0'
                            q.append((nr, nc))
        return count
```

```go
func numIslands(grid [][]byte) int {
    rows, cols, count := len(grid), len(grid[0]), 0
    dirs := [][2]int{{1,0},{-1,0},{0,1},{0,-1}}
    for r := 0; r < rows; r++ {
        for c := 0; c < cols; c++ {
            if grid[r][c] != '1' { continue }
            count++
            q := [][2]int{{r, c}}; grid[r][c] = '0'
            for len(q) > 0 {
                cur := q[0]; q = q[1:]
                for _, d := range dirs {
                    nr, nc := cur[0]+d[0], cur[1]+d[1]
                    if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1' {
                        grid[nr][nc] = '0'; q = append(q, [2]int{nr, nc})
                    }
                }
            }
        }
    }
    return count
}
```

**Complexity:** Same O(rows × cols) time, O(min(rows, cols)) space for the BFS queue in the best case.

## Key Interview Insights

- **In-place mutation saves O(rows×cols) space.** Ask interviewer if you can modify the input. If not, use a `visited` set or boolean array.
- **DFS is simpler, BFS is safer for large inputs.** Mention BFS as the follow-up if the interviewer asks about stack overflow risk.
- **The scan-and-flood pattern appears everywhere.** Variant: count area of each island, find largest island, color all islands differently.
- **Union-Find alternative:** For online edge insertion (dynamic grid), Union-Find handles incremental connectivity updates efficiently.
