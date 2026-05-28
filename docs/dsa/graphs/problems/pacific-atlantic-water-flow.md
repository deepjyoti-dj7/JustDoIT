---
title: Pacific Atlantic Water Flow
difficulty: Medium
tags: [Graph, BFS, DFS, Matrix]
link: https://leetcode.com/problems/pacific-atlantic-water-flow/
---

# Pacific Atlantic Water Flow

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [417. Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) |
| **Tags** | Graph, BFS, DFS, Matrix |

## Problem Statement

Given an `m × n` matrix of heights, water flows from higher or equal cells to lower or equal cells. The Pacific Ocean borders the top/left, the Atlantic Ocean borders the bottom/right. Return all cells from which water can flow to **both** oceans.

## Intuition

**Naive approach:** For each cell, run DFS/BFS to check if water can reach both oceans. O(m×n×(m×n)) — too slow.

**Reverse BFS (key insight):** Instead of checking which cells can reach the ocean, start FROM the ocean shores and work inward — find all cells from which the ocean can reach. Water flows downhill, so reverse = water flows uphill (to equal or higher cells).

- BFS from all Pacific border cells → find all cells that can drain to Pacific
- BFS from all Atlantic border cells → find all cells that can drain to Atlantic  
- Answer = intersection (cells in both sets)

## Approach: Multi-Source BFS (Optimal)

```cpp
class Solution {
    void bfs(vector<vector<int>>& heights, queue<pair<int,int>>& q, vector<vector<bool>>& reachable) {
        int rows = heights.size(), cols = heights[0].size();
        vector<vector<int>> dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.empty()) {
            auto [r, c] = q.front(); q.pop();
            for (auto& d : dirs) {
                int nr = r+d[0], nc = c+d[1];
                if (nr<0 || nr>=rows || nc<0 || nc>=cols || reachable[nr][nc]) continue;
                if (heights[nr][nc] >= heights[r][c]) {  // can flow: higher/equal goes to lower
                    reachable[nr][nc] = true;
                    q.push({nr, nc});
                }
            }
        }
    }
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        int rows = heights.size(), cols = heights[0].size();
        vector<vector<bool>> pacific(rows, vector<bool>(cols, false));
        vector<vector<bool>> atlantic(rows, vector<bool>(cols, false));

        queue<pair<int,int>> pacQ, atlQ;
        for (int r = 0; r < rows; r++) {
            pacQ.push({r, 0});      pacific[r][0] = true;
            atlQ.push({r, cols-1}); atlantic[r][cols-1] = true;
        }
        for (int c = 0; c < cols; c++) {
            pacQ.push({0, c});      pacific[0][c] = true;
            atlQ.push({rows-1, c}); atlantic[rows-1][c] = true;
        }
        bfs(heights, pacQ, pacific);
        bfs(heights, atlQ, atlantic);

        vector<vector<int>> result;
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (pacific[r][c] && atlantic[r][c]) result.push_back({r, c});
        return result;
    }
};
```

```java
class Solution {
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        int rows = heights.length, cols = heights[0].length;
        boolean[][] pacific = new boolean[rows][cols];
        boolean[][] atlantic = new boolean[rows][cols];
        Queue<int[]> pacQ = new LinkedList<>(), atlQ = new LinkedList<>();

        for (int r = 0; r < rows; r++) {
            pacQ.offer(new int[]{r, 0}); pacific[r][0] = true;
            atlQ.offer(new int[]{r, cols-1}); atlantic[r][cols-1] = true;
        }
        for (int c = 0; c < cols; c++) {
            pacQ.offer(new int[]{0, c}); pacific[0][c] = true;
            atlQ.offer(new int[]{rows-1, c}); atlantic[rows-1][c] = true;
        }
        bfs(heights, pacQ, pacific);
        bfs(heights, atlQ, atlantic);

        List<List<Integer>> result = new ArrayList<>();
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols; c++)
                if (pacific[r][c] && atlantic[r][c]) result.add(Arrays.asList(r, c));
        return result;
    }

    void bfs(int[][] h, Queue<int[]> q, boolean[][] reach) {
        int rows = h.length, cols = h[0].length;
        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};
        while (!q.isEmpty()) {
            int[] cell = q.poll();
            for (int[] d : dirs) {
                int nr = cell[0]+d[0], nc = cell[1]+d[1];
                if (nr<0||nr>=rows||nc<0||nc>=cols||reach[nr][nc]) continue;
                if (h[nr][nc] >= h[cell[0]][cell[1]]) { reach[nr][nc]=true; q.offer(new int[]{nr,nc}); }
            }
        }
    }
}
```

```typescript
function pacificAtlantic(heights: number[][]): number[][] {
    const rows = heights.length, cols = heights[0].length;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    const pacific = Array.from({length: rows}, () => new Array(cols).fill(false));
    const atlantic = Array.from({length: rows}, () => new Array(cols).fill(false));

    function bfs(q: number[][], reachable: boolean[][]) {
        while (q.length > 0) {
            const [r, c] = q.shift()!;
            for (const [dr, dc] of dirs) {
                const nr = r+dr, nc = c+dc;
                if (nr<0||nr>=rows||nc<0||nc>=cols||reachable[nr][nc]) continue;
                if (heights[nr][nc] >= heights[r][c]) { reachable[nr][nc]=true; q.push([nr,nc]); }
            }
        }
    }

    const pacQ: number[][] = [], atlQ: number[][] = [];
    for (let r = 0; r < rows; r++) {
        pacQ.push([r,0]); pacific[r][0]=true;
        atlQ.push([r,cols-1]); atlantic[r][cols-1]=true;
    }
    for (let c = 0; c < cols; c++) {
        pacQ.push([0,c]); pacific[0][c]=true;
        atlQ.push([rows-1,c]); atlantic[rows-1][c]=true;
    }
    bfs(pacQ, pacific); bfs(atlQ, atlantic);

    const result: number[][] = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (pacific[r][c] && atlantic[r][c]) result.push([r,c]);
    return result;
}
```

```python
from collections import deque

class Solution:
    def pacificAtlantic(self, heights: list[list[int]]) -> list[list[int]]:
        rows, cols = len(heights), len(heights[0])
        dirs = [(1,0),(-1,0),(0,1),(0,-1)]

        def bfs(starts: list[tuple[int,int]]) -> set[tuple[int,int]]:
            reachable = set(starts)
            q = deque(starts)
            while q:
                r, c = q.popleft()
                for dr, dc in dirs:
                    nr, nc = r+dr, c+dc
                    if (nr, nc) not in reachable and 0<=nr<rows and 0<=nc<cols:
                        if heights[nr][nc] >= heights[r][c]:  # uphill = reverse flow
                            reachable.add((nr, nc))
                            q.append((nr, nc))
            return reachable

        pacific_starts = [(r, 0) for r in range(rows)] + [(0, c) for c in range(cols)]
        atlantic_starts = [(r, cols-1) for r in range(rows)] + [(rows-1, c) for c in range(cols)]

        pacific = bfs(pacific_starts)
        atlantic = bfs(atlantic_starts)

        return [[r, c] for r, c in pacific & atlantic]
```

```go
func pacificAtlantic(heights [][]int) [][]int {
    rows, cols := len(heights), len(heights[0])
    dirs := [][2]int{{1,0},{-1,0},{0,1},{0,-1}}

    bfs := func(q [][2]int, reach [][]bool) {
        for len(q) > 0 {
            cell := q[0]; q = q[1:]
            for _, d := range dirs {
                nr, nc := cell[0]+d[0], cell[1]+d[1]
                if nr<0||nr>=rows||nc<0||nc>=cols||reach[nr][nc] { continue }
                if heights[nr][nc] >= heights[cell[0]][cell[1]] {
                    reach[nr][nc] = true; q = append(q, [2]int{nr, nc})
                }
            }
        }
    }

    pacific := make([][]bool, rows); atlantic := make([][]bool, rows)
    for i := range pacific { pacific[i] = make([]bool, cols); atlantic[i] = make([]bool, cols) }

    pacQ, atlQ := [][2]int{}, [][2]int{}
    for r := 0; r < rows; r++ {
        pacQ = append(pacQ, [2]int{r, 0}); pacific[r][0] = true
        atlQ = append(atlQ, [2]int{r, cols-1}); atlantic[r][cols-1] = true
    }
    for c := 0; c < cols; c++ {
        pacQ = append(pacQ, [2]int{0, c}); pacific[0][c] = true
        atlQ = append(atlQ, [2]int{rows-1, c}); atlantic[rows-1][c] = true
    }
    bfs(pacQ, pacific); bfs(atlQ, atlantic)

    result := [][]int{}
    for r := 0; r < rows; r++ {
        for c := 0; c < cols; c++ {
            if pacific[r][c] && atlantic[r][c] { result = append(result, []int{r, c}) }
        }
    }
    return result
}
```

## Complexity

- **Time:** O(m × n) — each cell visited at most twice (once per ocean BFS)
- **Space:** O(m × n) — two reachability arrays + BFS queues

## Key Interview Insights

- **Reverse direction is the key insight.** Checking each cell individually = O(m²n²). Starting from shores = O(mn).
- **Seeding the queue: mark as visited on insert.** Seed all border cells for Pacific (top row + left col), all border cells for Atlantic (bottom row + right col). Mark them as reachable immediately to avoid re-processing.
- **The boundary cells belong to both shores.** Corners belong to both oceans. Mark them in both sets.
- **BFS condition is reversed.** Normally: flow from high → low. Reverse BFS: we move from low → high (i.e., `heights[neighbor] >= heights[current]`).
