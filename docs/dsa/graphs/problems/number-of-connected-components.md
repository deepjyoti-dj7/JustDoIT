---
title: Number of Connected Components in an Undirected Graph
difficulty: Medium
tags: [Graph, DFS, BFS, Union-Find]
link: https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
---

# Number of Connected Components

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [323. Number of Connected Components](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) |
| **Tags** | Graph, DFS, BFS, Union-Find |

## Problem Statement

Given `n` nodes labeled `0` to `n-1` and a list of undirected edges, return the number of connected components in the graph.

## Intuition

Count the number of distinct clusters in an undirected graph. Two standard approaches:

1. **DFS/BFS:** Scan all nodes. Each time you start a fresh traversal from an unvisited node, you've found a new component.
2. **Union-Find:** Start with n components. For each edge, if the two endpoints are in different components, merge them (decrement component count).

## Approach 1: DFS

```cpp
class Solution {
    void dfs(vector<vector<int>>& adj, vector<bool>& visited, int node) {
        visited[node] = true;
        for (int nb : adj[node])
            if (!visited[nb]) dfs(adj, visited, nb);
    }
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        vector<vector<int>> adj(n);
        for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
        vector<bool> visited(n, false);
        int components = 0;
        for (int i = 0; i < n; i++)
            if (!visited[i]) { dfs(adj, visited, i); components++; }
        return components;
    }
};
```

```java
class Solution {
    private void dfs(List<List<Integer>> adj, boolean[] visited, int node) {
        visited[node] = true;
        for (int nb : adj.get(node)) if (!visited[nb]) dfs(adj, visited, nb);
    }
    public int countComponents(int n, int[][] edges) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
        boolean[] visited = new boolean[n];
        int components = 0;
        for (int i = 0; i < n; i++)
            if (!visited[i]) { dfs(adj, visited, i); components++; }
        return components;
    }
}
```

```typescript
function countComponents(n: number, edges: number[][]): number {
    const adj: number[][] = Array.from({length: n}, () => []);
    for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
    const visited = new Array(n).fill(false);

    function dfs(node: number) {
        visited[node] = true;
        for (const nb of adj[node]) if (!visited[nb]) dfs(nb);
    }

    let components = 0;
    for (let i = 0; i < n; i++) if (!visited[i]) { dfs(i); components++; }
    return components;
}
```

```python
class Solution:
    def countComponents(self, n: int, edges: list[list[int]]) -> int:
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)
        visited = [False] * n

        def dfs(node: int) -> None:
            visited[node] = True
            for nb in adj[node]:
                if not visited[nb]:
                    dfs(nb)

        count = 0
        for i in range(n):
            if not visited[i]:
                dfs(i)
                count += 1
        return count
```

```go
func countComponents(n int, edges [][]int) int {
    adj := make([][]int, n)
    for _, e := range edges { adj[e[0]] = append(adj[e[0]], e[1]); adj[e[1]] = append(adj[e[1]], e[0]) }
    visited := make([]bool, n)

    var dfs func(int)
    dfs = func(node int) {
        visited[node] = true
        for _, nb := range adj[node] { if !visited[nb] { dfs(nb) } }
    }

    count := 0
    for i := 0; i < n; i++ { if !visited[i] { dfs(i); count++ } }
    return count
}
```

## Approach 2: Union-Find (Optimal for Dynamic Connectivity)

Start with `n` components. Merge components as edges are processed. Union-Find handles repeated merges efficiently.

```cpp
class Solution {
    vector<int> parent, rank_;
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (rank_[x] < rank_[y]) swap(x, y);
        parent[y] = x;
        if (rank_[x] == rank_[y]) rank_[x]++;
        return true;
    }
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        parent.resize(n); rank_.resize(n, 0);
        iota(parent.begin(), parent.end(), 0);
        int components = n;
        for (auto& e : edges) if (unite(e[0], e[1])) components--;
        return components;
    }
};
```

```java
class Solution {
    int[] parent, rank_;
    int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }
    boolean unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (rank_[x] < rank_[y]) { int t = x; x = y; y = t; }
        parent[y] = x;
        if (rank_[x] == rank_[y]) rank_[x]++;
        return true;
    }
    public int countComponents(int n, int[][] edges) {
        parent = new int[n]; rank_ = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        int components = n;
        for (int[] e : edges) if (unite(e[0], e[1])) components--;
        return components;
    }
}
```

```typescript
function countComponents(n: number, edges: number[][]): number {
    const parent = Array.from({length: n}, (_, i) => i);
    const rank = new Array(n).fill(0);
    function find(x: number): number {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }
    function unite(x: number, y: number): boolean {
        x = find(x); y = find(y);
        if (x === y) return false;
        if (rank[x] < rank[y]) [x, y] = [y, x];
        parent[y] = x;
        if (rank[x] === rank[y]) rank[x]++;
        return true;
    }
    let components = n;
    for (const [u, v] of edges) if (unite(u, v)) components--;
    return components;
}
```

```python
class Solution:
    def countComponents(self, n: int, edges: list[list[int]]) -> int:
        parent = list(range(n))
        rank = [0] * n

        def find(x: int) -> int:
            if parent[x] != x:
                parent[x] = find(parent[x])  # path compression
            return parent[x]

        def unite(x: int, y: int) -> bool:
            px, py = find(x), find(y)
            if px == py: return False
            if rank[px] < rank[py]: px, py = py, px
            parent[py] = px
            if rank[px] == rank[py]: rank[px] += 1
            return True

        components = n
        for u, v in edges:
            if unite(u, v):
                components -= 1
        return components
```

```go
func countComponents(n int, edges [][]int) int {
    parent := make([]int, n); rank := make([]int, n)
    for i := range parent { parent[i] = i }
    var find func(int) int
    find = func(x int) int {
        if parent[x] != x { parent[x] = find(parent[x]) }
        return parent[x]
    }
    unite := func(x, y int) bool {
        x, y = find(x), find(y)
        if x == y { return false }
        if rank[x] < rank[y] { x, y = y, x }
        parent[y] = x
        if rank[x] == rank[y] { rank[x]++ }
        return true
    }
    components := n
    for _, e := range edges { if unite(e[0], e[1]) { components-- } }
    return components
}
```

## Complexity

| Approach | Time | Space |
|---|---|---|
| DFS/BFS | O(V + E) | O(V + E) |
| Union-Find | O(E × α(V)) ≈ O(E) | O(V) |

## Key Interview Insights

- **For static graphs, DFS/BFS and Union-Find are equivalent.** Pick whichever you can write faster.
- **For dynamic connectivity (edges added one at a time), Union-Find is far superior** — DFS would require re-traversal.
- **Union-Find starts at n and decrements.** This is cleaner than maintaining a separate set of component roots.
- **Component count after Union-Find = `n - number_of_successful_unions`.** A union is "successful" when the two nodes are in different components.
