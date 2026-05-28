---
title: Breadth-First Search (BFS)
description: Level-by-level graph traversal for shortest paths, connectivity, and multi-source problems
---

# Breadth-First Search (BFS)

BFS explores a graph **level by level** — visiting all neighbors of the current node before moving deeper. This property makes it the go-to algorithm for **shortest path in unweighted graphs** and any problem that asks about "minimum steps," "minimum distance," or "reachable within k steps."

## Core Intuition

Think of BFS as a ripple on water. Drop a stone (start node), and waves spread outward level by level. Every node at distance d is visited before any node at distance d+1.

```
Graph:     1
          / \
         2   3
        / \
       4   5

BFS order: 1 → 2 → 3 → 4 → 5
Level 0: [1]
Level 1: [2, 3]
Level 2: [4, 5]
```

## When to Use BFS

| Signal in Problem | Why BFS |
|---|---|
| "Shortest path" in unweighted graph | BFS finds shortest path by level |
| "Minimum steps/moves" | Same — steps = BFS levels |
| "Nearest/closest" | BFS guarantees first found = nearest |
| Level-order traversal | BFS = level-by-level |
| Multi-source shortest path | Start BFS from all sources simultaneously |
| "Reachable within k steps" | BFS and track depth |

## BFS Template

The standard BFS template — memorize this.

```cpp
#include <queue>
#include <vector>
#include <unordered_set>
using namespace std;

int bfs(vector<vector<int>>& adj, int start, int target) {
    queue<int> q;
    unordered_set<int> visited;
    q.push(start);
    visited.insert(start);
    int steps = 0;

    while (!q.empty()) {
        int size = q.size();       // snapshot: process entire level
        for (int i = 0; i < size; i++) {
            int node = q.front(); q.pop();
            if (node == target) return steps;
            for (int neighbor : adj[node]) {
                if (!visited.count(neighbor)) {
                    visited.insert(neighbor);
                    q.push(neighbor);
                }
            }
        }
        steps++;
    }
    return -1;  // target unreachable
}
```

```java
import java.util.*;

int bfs(List<List<Integer>> adj, int start, int target) {
    Queue<Integer> q = new LinkedList<>();
    Set<Integer> visited = new HashSet<>();
    q.offer(start);
    visited.add(start);
    int steps = 0;

    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            int node = q.poll();
            if (node == target) return steps;
            for (int neighbor : adj.get(node)) {
                if (visited.add(neighbor)) {
                    q.offer(neighbor);
                }
            }
        }
        steps++;
    }
    return -1;
}
```

```typescript
function bfs(adj: number[][], start: number, target: number): number {
    const q: number[] = [start];
    const visited = new Set<number>([start]);
    let steps = 0;

    while (q.length > 0) {
        const size = q.length;
        for (let i = 0; i < size; i++) {
            const node = q.shift()!;
            if (node === target) return steps;
            for (const neighbor of adj[node]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    q.push(neighbor);
                }
            }
        }
        steps++;
    }
    return -1;
}
```

```python
from collections import deque

def bfs(adj: list[list[int]], start: int, target: int) -> int:
    q = deque([start])
    visited = {start}
    steps = 0

    while q:
        for _ in range(len(q)):   # process entire level
            node = q.popleft()
            if node == target:
                return steps
            for neighbor in adj[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    q.append(neighbor)
        steps += 1
    return -1
```

```go
func bfs(adj [][]int, start, target int) int {
    q := []int{start}
    visited := map[int]bool{start: true}
    steps := 0

    for len(q) > 0 {
        size := len(q)
        for i := 0; i < size; i++ {
            node := q[0]; q = q[1:]
            if node == target { return steps }
            for _, neighbor := range adj[node] {
                if !visited[neighbor] {
                    visited[neighbor] = true
                    q = append(q, neighbor)
                }
            }
        }
        steps++
    }
    return -1
}
```

## BFS on a Grid

Most grid BFS problems follow the same pattern — just replace the adjacency list with direction arrays.

```cpp
int bfsGrid(vector<vector<int>>& grid, pair<int,int> start, pair<int,int> end) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<int>> dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    queue<pair<int,int>> q;
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    q.push(start);
    visited[start.first][start.second] = true;
    int steps = 0;

    while (!q.empty()) {
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            auto [r, c] = q.front(); q.pop();
            if (r == end.first && c == end.second) return steps;
            for (auto& d : dirs) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && !visited[nr][nc] && grid[nr][nc] != '#') {
                    visited[nr][nc] = true;
                    q.push({nr, nc});
                }
            }
        }
        steps++;
    }
    return -1;
}
```

```java
int bfsGrid(int[][] grid, int[] start, int[] end) {
    int rows = grid.length, cols = grid[0].length;
    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    Queue<int[]> q = new LinkedList<>();
    boolean[][] visited = new boolean[rows][cols];
    q.offer(start); visited[start[0]][start[1]] = true;
    int steps = 0;
    while (!q.isEmpty()) {
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            int[] cell = q.poll();
            if (cell[0] == end[0] && cell[1] == end[1]) return steps;
            for (int[] d : dirs) {
                int nr = cell[0] + d[0], nc = cell[1] + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                        && !visited[nr][nc] && grid[nr][nc] != 1) {
                    visited[nr][nc] = true;
                    q.offer(new int[]{nr, nc});
                }
            }
        }
        steps++;
    }
    return -1;
}
```

```typescript
function bfsGrid(grid: number[][], start: [number,number], end: [number,number]): number {
    const rows = grid.length, cols = grid[0].length;
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    const q: [number,number][] = [start];
    const visited = Array.from({length: rows}, () => new Array(cols).fill(false));
    visited[start[0]][start[1]] = true;
    let steps = 0;
    while (q.length > 0) {
        const sz = q.length;
        for (let i = 0; i < sz; i++) {
            const [r, c] = q.shift()!;
            if (r === end[0] && c === end[1]) return steps;
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    q.push([nr, nc]);
                }
            }
        }
        steps++;
    }
    return -1;
}
```

```python
from collections import deque

def bfs_grid(grid: list[list[int]], start: tuple, end: tuple) -> int:
    rows, cols = len(grid), len(grid[0])
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]
    q = deque([start])
    visited = set([start])
    steps = 0

    while q:
        for _ in range(len(q)):
            r, c = q.popleft()
            if (r, c) == end:
                return steps
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    q.append((nr, nc))
        steps += 1
    return -1
```

```go
func bfsGrid(grid [][]int, sr, sc, er, ec int) int {
    rows, cols := len(grid), len(grid[0])
    dirs := [][2]int{{-1,0},{1,0},{0,-1},{0,1}}
    type cell struct{ r, c int }
    q := []cell{{sr, sc}}
    visited := make([][]bool, rows)
    for i := range visited { visited[i] = make([]bool, cols) }
    visited[sr][sc] = true
    steps := 0
    for len(q) > 0 {
        sz := len(q)
        for i := 0; i < sz; i++ {
            cur := q[0]; q = q[1:]
            if cur.r == er && cur.c == ec { return steps }
            for _, d := range dirs {
                nr, nc := cur.r+d[0], cur.c+d[1]
                if nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] {
                    visited[nr][nc] = true
                    q = append(q, cell{nr, nc})
                }
            }
        }
        steps++
    }
    return -1
}
```

## Multi-Source BFS

Start BFS from **multiple sources simultaneously**. Used when: "find the distance from each cell to its nearest X."

Classic examples:
- 0-1 Matrix: nearest 0 for each cell
- Rotten Oranges: time for all oranges to rot
- Walls and Gates

The trick: seed the queue with ALL sources at step 0, then run standard BFS.

## BFS vs DFS for Shortest Path

| | BFS | DFS |
|---|---|---|
| Shortest path (unweighted) | **Yes** — guaranteed | No — finds *a* path |
| Memory | O(w) — max width | O(h) — max depth |
| When to use | Shortest path, levels | Connectivity, cycles, backtracking |

**BFS finds the shortest path in an unweighted graph. DFS does not.**

## Complexity

| | Adjacency List | Adjacency Matrix | Grid |
|---|---|---|---|
| **Time** | O(V + E) | O(V²) | O(rows × cols) |
| **Space** | O(V) | O(V) | O(rows × cols) |

## Key Interview Insights

- **Snapshot the queue size before the inner loop.** `size = q.size()` at the start of each while-iteration ensures you process exactly one level at a time.
- **Mark visited on enqueue, not on dequeue.** This prevents duplicate enqueues and is critical for correctness in large graphs.
- **Bidirectional BFS** can reduce O(b^d) to O(b^(d/2)) by searching from both ends. Mention this as an optimization.
- **For grid BFS**, the visited array can often be replaced by mutating the grid in place (mark as '#' or -1) to save space.
