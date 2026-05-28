---
title: Graph Valid Tree
difficulty: Medium
tags: [Graph, DFS, BFS, Union-Find]
link: https://leetcode.com/problems/graph-valid-tree/
---

# Graph Valid Tree

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [261. Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/) |
| **Tags** | Graph, DFS, BFS, Union-Find |

## Problem Statement

Given `n` nodes labeled `0` to `n-1` and a list of undirected edges, determine if these edges form a valid tree.

## Intuition

A valid tree on `n` nodes satisfies **both** conditions:
1. **Exactly n-1 edges** (necessary but not sufficient — could still have a disconnected forest)
2. **No cycle** (i.e., the graph is connected with no redundant edges)

Equivalently: **connected + no cycle** = tree.

**Shortcut:** Check edges count first. If `edges.size() != n-1`, immediately return false. Then just verify connectivity (if connected AND n-1 edges → no cycle guaranteed).

**Why n-1 edges + connected = no cycle:** A tree on n nodes has exactly n-1 edges. If connected + n-1 edges, adding any edge creates a cycle. So the converse also holds.

## Approach 1: Union-Find

Process each edge. If both endpoints already have the same root → cycle detected. If all unions succeed and we end with 1 component → valid tree.

```cpp
class Solution {
    vector<int> parent, rank_;
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;  // cycle!
        if (rank_[x] < rank_[y]) swap(x, y);
        parent[y] = x;
        if (rank_[x] == rank_[y]) rank_[x]++;
        return true;
    }
public:
    bool validTree(int n, vector<vector<int>>& edges) {
        if ((int)edges.size() != n - 1) return false;
        parent.resize(n); rank_.resize(n, 0);
        iota(parent.begin(), parent.end(), 0);
        for (auto& e : edges) if (!unite(e[0], e[1])) return false;
        return true;  // n-1 successful unions = connected
    }
};
```

```java
class Solution {
    int[] parent, rank;
    int find(int x) { return parent[x] == x ? x : (parent[x] = find(parent[x])); }
    boolean unite(int x, int y) {
        x = find(x); y = find(y);
        if (x == y) return false;
        if (rank[x] < rank[y]) { int t = x; x = y; y = t; }
        parent[y] = x;
        if (rank[x] == rank[y]) rank[x]++;
        return true;
    }
    public boolean validTree(int n, int[][] edges) {
        if (edges.length != n - 1) return false;
        parent = new int[n]; rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
        for (int[] e : edges) if (!unite(e[0], e[1])) return false;
        return true;
    }
}
```

```typescript
function validTree(n: number, edges: number[][]): boolean {
    if (edges.length !== n - 1) return false;
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

    for (const [u, v] of edges) if (!unite(u, v)) return false;
    return true;
}
```

```python
class Solution:
    def validTree(self, n: int, edges: list[list[int]]) -> bool:
        if len(edges) != n - 1:
            return False
        parent = list(range(n))
        rank = [0] * n

        def find(x: int) -> int:
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]

        def unite(x: int, y: int) -> bool:
            px, py = find(x), find(y)
            if px == py: return False  # cycle
            if rank[px] < rank[py]: px, py = py, px
            parent[py] = px
            if rank[px] == rank[py]: rank[px] += 1
            return True

        return all(unite(u, v) for u, v in edges)
```

```go
func validTree(n int, edges [][]int) bool {
    if len(edges) != n-1 { return false }
    parent := make([]int, n)
    rank := make([]int, n)
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

    for _, e := range edges { if !unite(e[0], e[1]) { return false } }
    return true
}
```

## Approach 2: DFS (Connectivity Check)

Check `n-1 edges` upfront, then do DFS from node 0 and verify all n nodes are reachable.

```cpp
bool validTree(int n, vector<vector<int>>& edges) {
    if ((int)edges.size() != n - 1) return false;
    vector<vector<int>> adj(n);
    for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
    vector<bool> visited(n, false);
    function<void(int)> dfs = [&](int node) {
        visited[node] = true;
        for (int nb : adj[node]) if (!visited[nb]) dfs(nb);
    };
    dfs(0);
    return all_of(visited.begin(), visited.end(), [](bool v){ return v; });
}
```

```java
boolean validTree(int n, int[][] edges) {
    if (edges.length != n - 1) return false;
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
    boolean[] visited = new boolean[n];
    dfs(adj, visited, 0);
    for (boolean v : visited) if (!v) return false;
    return true;
}
void dfs(List<List<Integer>> adj, boolean[] visited, int node) {
    visited[node] = true;
    for (int nb : adj.get(node)) if (!visited[nb]) dfs(adj, visited, nb);
}
```

```typescript
function validTree(n: number, edges: number[][]): boolean {
    if (edges.length !== n - 1) return false;
    const adj: number[][] = Array.from({length: n}, () => []);
    for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
    const visited = new Set<number>();
    function dfs(node: number): void {
        visited.add(node);
        for (const nb of adj[node]) if (!visited.has(nb)) dfs(nb);
    }
    dfs(0);
    return visited.size === n;
}
```

```python
class Solution:
    def validTree(self, n: int, edges: list[list[int]]) -> bool:
        if len(edges) != n - 1:
            return False
        adj = [[] for _ in range(n)]
        for u, v in edges:
            adj[u].append(v)
            adj[v].append(u)

        visited = set()
        def dfs(node: int) -> None:
            visited.add(node)
            for nb in adj[node]:
                if nb not in visited:
                    dfs(nb)

        dfs(0)
        return len(visited) == n  # all nodes reachable = connected
```

```go
func validTree(n int, edges [][]int) bool {
    if len(edges) != n-1 { return false }
    adj := make([][]int, n)
    for _, e := range edges { adj[e[0]] = append(adj[e[0]], e[1]); adj[e[1]] = append(adj[e[1]], e[0]) }
    visited := make([]bool, n)
    var dfs func(int)
    dfs = func(node int) {
        visited[node] = true
        for _, nb := range adj[node] { if !visited[nb] { dfs(nb) } }
    }
    dfs(0)
    for _, v := range visited { if !v { return false } }
    return true
}
```

## Complexity

| Approach | Time | Space |
|---|---|---|
| Union-Find | O(E × α(n)) | O(n) |
| DFS | O(V + E) | O(V + E) |

## Key Interview Insights

- **Check `n-1 edges` first.** Immediately eliminates trivially wrong inputs. If `len(edges) != n-1`, answer is always false.
- **With n-1 edges check, you only need ONE property.** n-1 edges + connected = tree. n-1 edges + no cycle = tree. Both are equivalent.
- **With Union-Find, n-1 successful unions = connected with no cycle.** Each successful union means you merged two separate components. After n-1 merges, exactly 1 component remains.
- **Edge case: n=1, no edges.** A single node is a valid tree. `len(edges)==0==n-1` passes the check.
