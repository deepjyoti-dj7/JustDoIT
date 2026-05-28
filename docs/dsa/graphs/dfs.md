---
title: Depth-First Search (DFS)
description: Deep graph traversal for connectivity, cycle detection, topological ordering, and path exploration
---

# Depth-First Search (DFS)

DFS explores a graph by going as **deep as possible** along each path before backtracking. It's the workhorse for connectivity checks, cycle detection, topological sort, and any problem where you need to explore all paths.

## Core Intuition

Imagine navigating a maze: always take the first available path as deep as you can. When you hit a dead end, backtrack to the last junction and try the next direction. That's DFS.

```
Graph:     1
          / \
         2   3
        / \
       4   5

DFS order (from 1): 1 → 2 → 4 → 5 → 3
```

## When to Use DFS

| Signal | Why DFS |
|---|---|
| Check if path exists between two nodes | Simple DFS reachability |
| Count connected components | DFS/BFS each unvisited node |
| Detect cycles | DFS with state tracking |
| Topological sort | DFS post-order |
| Find all paths | DFS with backtracking |
| Check if graph is bipartite | DFS 2-coloring |
| Tree structure problems | DFS naturally maps to recursion |

## DFS Template — Recursive

The recursive template uses the call stack implicitly.

```cpp
#include <vector>
#include <unordered_set>
using namespace std;

void dfs(vector<vector<int>>& adj, int node, unordered_set<int>& visited) {
    visited.insert(node);
    // process node here
    for (int neighbor : adj[node]) {
        if (!visited.count(neighbor)) {
            dfs(adj, neighbor, visited);
        }
    }
}

// Count connected components
int countComponents(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);
    }
    unordered_set<int> visited;
    int components = 0;
    for (int i = 0; i < n; i++) {
        if (!visited.count(i)) {
            dfs(adj, i, visited);
            components++;
        }
    }
    return components;
}
```

```java
void dfs(List<List<Integer>> adj, int node, boolean[] visited) {
    visited[node] = true;
    for (int neighbor : adj.get(node)) {
        if (!visited[neighbor]) {
            dfs(adj, neighbor, visited);
        }
    }
}

int countComponents(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    boolean[] visited = new boolean[n];
    int components = 0;
    for (int i = 0; i < n; i++) {
        if (!visited[i]) { dfs(adj, i, visited); components++; }
    }
    return components;
}
```

```typescript
function dfs(adj: number[][], node: number, visited: boolean[]): void {
    visited[node] = true;
    for (const neighbor of adj[node]) {
        if (!visited[neighbor]) dfs(adj, neighbor, visited);
    }
}

function countComponents(n: number, edges: number[][]): number {
    const adj: number[][] = Array.from({length: n}, () => []);
    for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
    const visited = new Array(n).fill(false);
    let components = 0;
    for (let i = 0; i < n; i++) {
        if (!visited[i]) { dfs(adj, i, visited); components++; }
    }
    return components;
}
```

```python
from collections import defaultdict

def dfs(adj: dict, node: int, visited: set) -> None:
    visited.add(node)
    for neighbor in adj[node]:
        if neighbor not in visited:
            dfs(adj, neighbor, visited)

def count_components(n: int, edges: list[list[int]]) -> int:
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = set()
    components = 0
    for i in range(n):
        if i not in visited:
            dfs(adj, i, visited)
            components += 1
    return components
```

```go
func dfs(adj [][]int, node int, visited []bool) {
    visited[node] = true
    for _, neighbor := range adj[node] {
        if !visited[neighbor] {
            dfs(adj, neighbor, visited)
        }
    }
}

func countComponents(n int, edges [][]int) int {
    adj := make([][]int, n)
    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], e[1])
        adj[e[1]] = append(adj[e[1]], e[0])
    }
    visited := make([]bool, n)
    components := 0
    for i := 0; i < n; i++ {
        if !visited[i] { dfs(adj, i, visited); components++ }
    }
    return components
}
```

## DFS Template — Iterative

Use an explicit stack when recursion depth is a concern (large graphs can cause stack overflow).

```cpp
void dfsIterative(vector<vector<int>>& adj, int start) {
    stack<int> st;
    unordered_set<int> visited;
    st.push(start);
    while (!st.empty()) {
        int node = st.top(); st.pop();
        if (visited.count(node)) continue;
        visited.insert(node);
        // process node here
        for (int neighbor : adj[node]) {
            if (!visited.count(neighbor)) st.push(neighbor);
        }
    }
}
```

```java
void dfsIterative(List<List<Integer>> adj, int start) {
    Deque<Integer> st = new ArrayDeque<>();
    Set<Integer> visited = new HashSet<>();
    st.push(start);
    while (!st.isEmpty()) {
        int node = st.pop();
        if (!visited.add(node)) continue;
        for (int neighbor : adj.get(node)) {
            if (!visited.contains(neighbor)) st.push(neighbor);
        }
    }
}
```

```typescript
function dfsIterative(adj: number[][], start: number): void {
    const st = [start];
    const visited = new Set<number>();
    while (st.length > 0) {
        const node = st.pop()!;
        if (visited.has(node)) continue;
        visited.add(node);
        for (const neighbor of adj[node]) {
            if (!visited.has(neighbor)) st.push(neighbor);
        }
    }
}
```

```python
def dfs_iterative(adj: list[list[int]], start: int) -> None:
    stack = [start]
    visited = set()
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        for neighbor in adj[node]:
            if neighbor not in visited:
                stack.append(neighbor)
```

```go
func dfsIterative(adj [][]int, start int) {
    st := []int{start}
    visited := map[int]bool{}
    for len(st) > 0 {
        node := st[len(st)-1]; st = st[:len(st)-1]
        if visited[node] { continue }
        visited[node] = true
        for _, neighbor := range adj[node] {
            if !visited[neighbor] { st = append(st, neighbor) }
        }
    }
}
```

## DFS on a Grid

```cpp
void dfsGrid(vector<vector<char>>& grid, int r, int c) {
    int rows = grid.size(), cols = grid[0].size();
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') return;
    grid[r][c] = '0';  // mark visited by mutating grid
    dfsGrid(grid, r+1, c);
    dfsGrid(grid, r-1, c);
    dfsGrid(grid, r, c+1);
    dfsGrid(grid, r, c-1);
}
```

```java
void dfsGrid(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfsGrid(grid, r+1, c); dfsGrid(grid, r-1, c);
    dfsGrid(grid, r, c+1); dfsGrid(grid, r, c-1);
}
```

```typescript
function dfsGrid(grid: string[][], r: number, c: number): void {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfsGrid(grid, r+1, c); dfsGrid(grid, r-1, c);
    dfsGrid(grid, r, c+1); dfsGrid(grid, r, c-1);
}
```

```python
def dfs_grid(grid: list[list[str]], r: int, c: int) -> None:
    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != '1':
        return
    grid[r][c] = '0'
    dfs_grid(grid, r+1, c)
    dfs_grid(grid, r-1, c)
    dfs_grid(grid, r, c+1)
    dfs_grid(grid, r, c-1)
```

```go
func dfsGrid(grid [][]byte, r, c int) {
    if r < 0 || r >= len(grid) || c < 0 || c >= len(grid[0]) || grid[r][c] != '1' { return }
    grid[r][c] = '0'
    dfsGrid(grid, r+1, c); dfsGrid(grid, r-1, c)
    dfsGrid(grid, r, c+1); dfsGrid(grid, r, c-1)
}
```

## DFS States for Cycle Detection

For directed graphs, track three states instead of just visited/unvisited:

| State | Meaning |
|---|---|
| 0 = UNVISITED | Not yet explored |
| 1 = VISITING | In current DFS path (on the call stack) |
| 2 = VISITED | Fully explored, no cycle through here |

If you reach a node in state `VISITING`, you've found a back edge → **cycle exists**.

## Complexity

| | Time | Space |
|---|---|---|
| Adjacency List | O(V + E) | O(V) — stack/visited |
| Adjacency Matrix | O(V²) | O(V) |
| Grid | O(rows × cols) | O(rows × cols) |

## Key Interview Insights

- **Recursive DFS is cleaner** — prefer it unless n > 10⁴ and stack overflow is a concern.
- **Mark visited before recursing**, not after, to handle back edges correctly.
- **DFS can replace BFS for connectivity** — both are O(V+E). Use BFS only when you need shortest path.
- **Mutate the grid in-place** as a visited marker (set '1' → '0' or similar) to save O(rows×cols) space for the visited array.
- **Post-order DFS** (process after children) is the basis for topological sort.
