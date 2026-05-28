---
title: Cycle Detection
description: Detecting cycles in undirected and directed graphs using DFS state tracking and Union-Find
---

# Cycle Detection

A cycle in a graph means you can start at a node, follow edges, and return to the same node. Cycle detection problems appear directly (course schedule, deadlock) and as subroutines (valid tree check, topological sort feasibility).

## Undirected vs Directed

| | Undirected Graph | Directed Graph |
|---|---|---|
| **Cycle means** | Edge u–v where v is already visited (excluding parent) | Back edge: reach a node currently on the DFS stack |
| **Algorithm** | DFS with parent tracking, or Union-Find | DFS with 3-color state (UNVISITED/VISITING/VISITED) |
| **Key check** | neighbor ≠ parent AND already visited | neighbor is in VISITING state |

## Undirected Graph — DFS with Parent

The trick: when doing DFS from node `u`, skip the edge back to `u`'s parent (it's the same edge you arrived on). If you reach an already-visited neighbor that's NOT the parent → cycle found.

```cpp
bool hasCycleUndirected(vector<vector<int>>& adj, int node, int parent, vector<bool>& visited) {
    visited[node] = true;
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            if (hasCycleUndirected(adj, neighbor, node, visited)) return true;
        } else if (neighbor != parent) {
            return true;  // back edge — cycle!
        }
    }
    return false;
}

bool detectCycle(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }
    vector<bool> visited(n, false);
    for (int i = 0; i < n; i++)
        if (!visited[i] && hasCycleUndirected(adj, i, -1, visited)) return true;
    return false;
}
```

```java
boolean hasCycle(List<List<Integer>> adj, int node, int parent, boolean[] visited) {
    visited[node] = true;
    for (int neighbor : adj.get(node)) {
        if (!visited[neighbor]) {
            if (hasCycle(adj, neighbor, node, visited)) return true;
        } else if (neighbor != parent) {
            return true;
        }
    }
    return false;
}
```

```typescript
function hasCycleUndirected(adj: number[][], node: number, parent: number, visited: boolean[]): boolean {
    visited[node] = true;
    for (const neighbor of adj[node]) {
        if (!visited[neighbor]) {
            if (hasCycleUndirected(adj, neighbor, node, visited)) return true;
        } else if (neighbor !== parent) {
            return true;
        }
    }
    return false;
}
```

```python
def has_cycle_undirected(adj: list[list[int]], node: int, parent: int, visited: list[bool]) -> bool:
    visited[node] = True
    for neighbor in adj[node]:
        if not visited[neighbor]:
            if has_cycle_undirected(adj, neighbor, node, visited):
                return True
        elif neighbor != parent:
            return True  # back edge
    return False
```

```go
func hasCycleUndirected(adj [][]int, node, parent int, visited []bool) bool {
    visited[node] = true
    for _, neighbor := range adj[node] {
        if !visited[neighbor] {
            if hasCycleUndirected(adj, neighbor, node, visited) { return true }
        } else if neighbor != parent {
            return true
        }
    }
    return false
}
```

## Undirected Graph — Union-Find

Even cleaner: if adding an edge (u, v) would connect two nodes that are already in the same component → cycle.

```cpp
class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;  // already connected — cycle!
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
};

bool detectCycleUF(int n, vector<vector<int>>& edges) {
    UnionFind uf(n);
    for (auto& e : edges)
        if (!uf.unite(e[0], e[1])) return true;
    return false;
}
```

```java
boolean detectCycleUF(int n, int[][] edges) {
    int[] parent = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    for (int[] e : edges) {
        int pu = find(parent, e[0]), pv = find(parent, e[1]);
        if (pu == pv) return true;
        parent[pu] = pv;
    }
    return false;
}
int find(int[] parent, int x) {
    if (parent[x] != x) parent[x] = find(parent, parent[x]);
    return parent[x];
}
```

```typescript
function detectCycleUF(n: number, edges: number[][]): boolean {
    const parent = Array.from({length: n}, (_, i) => i);
    function find(x: number): number {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }
    for (const [u, v] of edges) {
        const pu = find(u), pv = find(v);
        if (pu === pv) return true;
        parent[pu] = pv;
    }
    return false;
}
```

```python
def detect_cycle_uf(n: int, edges: list[list[int]]) -> bool:
    parent = list(range(n))

    def find(x: int) -> int:
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    for u, v in edges:
        pu, pv = find(u), find(v)
        if pu == pv:
            return True
        parent[pu] = pv
    return False
```

```go
func detectCycleUF(n int, edges [][]int) bool {
    parent := make([]int, n)
    for i := range parent { parent[i] = i }
    var find func(int) int
    find = func(x int) int {
        if parent[x] != x { parent[x] = find(parent[x]) }
        return parent[x]
    }
    for _, e := range edges {
        pu, pv := find(e[0]), find(e[1])
        if pu == pv { return true }
        parent[pu] = pv
    }
    return false
}
```

## Directed Graph — DFS with 3-Color States

For directed graphs, you need to distinguish "visited in this path" from "visited in a previous completed path." Use three states:

- **0 = WHITE (UNVISITED):** not yet explored
- **1 = GRAY (VISITING):** currently on the DFS stack
- **2 = BLACK (VISITED):** fully processed, no cycle through here

A back edge (reaching a GRAY node) means there's a cycle in a directed graph.

```cpp
bool hasCycleDirected(vector<vector<int>>& adj, int node, vector<int>& state) {
    state[node] = 1;  // VISITING
    for (int neighbor : adj[node]) {
        if (state[neighbor] == 1) return true;  // back edge
        if (state[neighbor] == 0 && hasCycleDirected(adj, neighbor, state)) return true;
    }
    state[node] = 2;  // VISITED
    return false;
}

bool detectCycleDirected(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) adj[e[0]].push_back(e[1]);
    vector<int> state(n, 0);
    for (int i = 0; i < n; i++)
        if (state[i] == 0 && hasCycleDirected(adj, i, state)) return true;
    return false;
}
```

```java
boolean hasCycle(List<List<Integer>> adj, int node, int[] state) {
    state[node] = 1;
    for (int neighbor : adj.get(node)) {
        if (state[neighbor] == 1) return true;
        if (state[neighbor] == 0 && hasCycle(adj, neighbor, state)) return true;
    }
    state[node] = 2;
    return false;
}
```

```typescript
function hasCycleDirected(adj: number[][], node: number, state: number[]): boolean {
    state[node] = 1;
    for (const neighbor of adj[node]) {
        if (state[neighbor] === 1) return true;
        if (state[neighbor] === 0 && hasCycleDirected(adj, neighbor, state)) return true;
    }
    state[node] = 2;
    return false;
}
```

```python
def has_cycle_directed(adj: list[list[int]], node: int, state: list[int]) -> bool:
    state[node] = 1  # VISITING
    for neighbor in adj[node]:
        if state[neighbor] == 1:
            return True  # back edge
        if state[neighbor] == 0 and has_cycle_directed(adj, neighbor, state):
            return True
    state[node] = 2  # VISITED
    return False
```

```go
func hasCycleDirected(adj [][]int, node int, state []int) bool {
    state[node] = 1
    for _, neighbor := range adj[node] {
        if state[neighbor] == 1 { return true }
        if state[neighbor] == 0 && hasCycleDirected(adj, neighbor, state) { return true }
    }
    state[node] = 2
    return false
}
```

## Cycle Detection via Topological Sort (Kahn's)

An alternative for directed graphs: if Kahn's BFS topological sort doesn't process all nodes (nodes remain with in-degree > 0), the graph has a cycle.

This approach is often cleaner and avoids the 3-state complexity.

```
If topological_sort result size < n → cycle exists
```

## Complexity

| Method | Time | Space | Best For |
|---|---|---|---|
| DFS + parent (undirected) | O(V + E) | O(V) | Clean recursive |
| Union-Find (undirected) | O(E × α(n)) | O(V) | Adding edges online |
| DFS 3-color (directed) | O(V + E) | O(V) | Directed graphs |
| Kahn's BFS (directed) | O(V + E) | O(V) | When topo sort also needed |

## Key Interview Insights

- **Undirected vs directed matters.** A 2-node graph with one edge u–v has no cycle undirected, but a self-loop has a cycle. Always clarify direction.
- **The parent trick only works for undirected.** For directed graphs, you need 3 states.
- **Union-Find shines for online edge addition.** If edges are added one at a time and you need to detect cycles incrementally, Union-Find is cleaner than re-running DFS.
- **Kahn's algorithm doubles as cycle detection.** "Does this DAG have a valid topological order?" = "Does it have no cycles?" Use Kahn's for both.
