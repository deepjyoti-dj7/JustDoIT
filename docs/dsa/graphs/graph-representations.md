---
title: Graph Representations
description: How to represent graphs in code — adjacency list, adjacency matrix, and edge list with tradeoffs
---

# Graph Representations

A graph is a set of **nodes (vertices)** connected by **edges**. Before solving any graph problem, you need to choose how to represent the graph in memory. The right representation determines the complexity of every operation you'll perform.

## Graph Terminology

| Term | Definition |
|---|---|
| **Vertex (node)** | A point in the graph |
| **Edge** | A connection between two vertices |
| **Directed** | Edges have direction (A → B does not imply B → A) |
| **Undirected** | Edges are bidirectional |
| **Weighted** | Edges carry a cost/distance value |
| **Degree** | Number of edges connected to a vertex |
| **In-degree** | Number of edges pointing *into* a vertex (directed) |
| **Out-degree** | Number of edges pointing *out of* a vertex (directed) |
| **Path** | Sequence of vertices connected by edges |
| **Cycle** | Path that starts and ends at the same vertex |
| **Connected** | Path exists between every pair of vertices |
| **DAG** | Directed Acyclic Graph — directed, no cycles |

## The Three Representations

### 1. Adjacency List

Store a list of neighbors for each vertex. The most common representation in interviews.

```
Graph:  1 — 2 — 4
        |   |
        3 — 5

Adjacency List:
1: [2, 3]
2: [1, 4, 5]
3: [1, 5]
4: [2]
5: [2, 3]
```

```cpp
#include <vector>
#include <unordered_map>
using namespace std;

// Unweighted undirected
vector<vector<int>> buildGraph(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        adj[e[1]].push_back(e[0]);  // remove for directed
    }
    return adj;
}

// Weighted directed: adj[u] = [(v, weight), ...]
vector<vector<pair<int,int>>> buildWeighted(int n, vector<vector<int>>& edges) {
    vector<vector<pair<int,int>>> adj(n);
    for (auto& e : edges)
        adj[e[0]].push_back({e[1], e[2]});
    return adj;
}
```

```java
import java.util.*;

// Unweighted undirected
List<List<Integer>> buildGraph(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);  // remove for directed
    }
    return adj;
}

// Weighted: adj[u] = [(v, weight), ...]
List<List<int[]>> buildWeighted(int n, int[][] edges) {
    List<List<int[]>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) adj.get(e[0]).add(new int[]{e[1], e[2]});
    return adj;
}
```

```typescript
function buildGraph(n: number, edges: number[][]): number[][] {
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        adj[u].push(v);
        adj[v].push(u);  // remove for directed
    }
    return adj;
}

// Weighted: adj[u] = [[v, weight], ...]
function buildWeighted(n: number, edges: number[][]): number[][][] {
    const adj: number[][][] = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) adj[u].push([v, w]);
    return adj;
}
```

```python
from collections import defaultdict

def build_graph(n: int, edges: list[list[int]]) -> dict:
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)  # remove for directed
    return adj

# Weighted: adj[u] = [(v, weight), ...]
def build_weighted(n: int, edges: list[list[int]]) -> dict:
    adj = defaultdict(list)
    for u, v, w in edges:
        adj[u].append((v, w))
    return adj
```

```go
func buildGraph(n int, edges [][]int) [][]int {
    adj := make([][]int, n)
    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], e[1])
        adj[e[1]] = append(adj[e[1]], e[0])  // remove for directed
    }
    return adj
}

// Weighted
type Edge struct{ to, w int }
func buildWeighted(n int, edges [][]int) [][]Edge {
    adj := make([][]Edge, n)
    for _, e := range edges {
        adj[e[0]] = append(adj[e[0]], Edge{e[1], e[2]})
    }
    return adj
}
```

### 2. Adjacency Matrix

A 2D array where `matrix[u][v] = 1` (or weight) if edge u→v exists, else 0.

```cpp
vector<vector<int>> buildMatrix(int n, vector<vector<int>>& edges) {
    vector<vector<int>> mat(n, vector<int>(n, 0));
    for (auto& e : edges) {
        mat[e[0]][e[1]] = 1;
        mat[e[1]][e[0]] = 1;  // undirected
    }
    return mat;
}
```

```java
int[][] buildMatrix(int n, int[][] edges) {
    int[][] mat = new int[n][n];
    for (int[] e : edges) {
        mat[e[0]][e[1]] = 1;
        mat[e[1]][e[0]] = 1;
    }
    return mat;
}
```

```typescript
function buildMatrix(n: number, edges: number[][]): number[][] {
    const mat = Array.from({ length: n }, () => new Array(n).fill(0));
    for (const [u, v] of edges) { mat[u][v] = 1; mat[v][u] = 1; }
    return mat;
}
```

```python
def build_matrix(n: int, edges: list[list[int]]) -> list[list[int]]:
    mat = [[0] * n for _ in range(n)]
    for u, v in edges:
        mat[u][v] = 1
        mat[v][u] = 1
    return mat
```

```go
func buildMatrix(n int, edges [][]int) [][]int {
    mat := make([][]int, n)
    for i := range mat { mat[i] = make([]int, n) }
    for _, e := range edges { mat[e[0]][e[1]] = 1; mat[e[1]][e[0]] = 1 }
    return mat
}
```

### 3. Edge List

Simply store all edges as pairs (or triples for weighted). Simplest representation; used in Kruskal's MST.

```
edges = [(0,1), (0,2), (1,3), (2,3)]
weighted_edges = [(0,1,4), (0,2,2), (1,3,5), (2,3,1)]
```

Sort by weight → apply algorithm directly. No adjacency structure needed.

## Representation Comparison

| | Adjacency List | Adjacency Matrix | Edge List |
|---|---|---|---|
| **Space** | O(V + E) | O(V²) | O(E) |
| **Check edge u→v** | O(degree(u)) | O(1) | O(E) |
| **Iterate all neighbors of u** | O(degree(u)) | O(V) | O(E) |
| **Iterate all edges** | O(V + E) | O(V²) | O(E) |
| **Best for** | Sparse graphs, BFS/DFS | Dense graphs, Floyd-Warshall | MST (Kruskal's) |

## Grid as Implicit Graph

Many interview problems use a 2D grid. The grid *is* the graph — no explicit adjacency list needed.

```
Neighbors of cell (r, c) in a 4-directional grid:
(r-1, c), (r+1, c), (r, c-1), (r, c+1)
```

```cpp
vector<pair<int,int>> dirs = {{-1,0},{1,0},{0,-1},{0,1}};
// 8-directional: add diagonals {-1,-1},{-1,1},{1,-1},{1,1}

bool inBounds(int r, int c, int rows, int cols) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
}
```

```java
int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
boolean inBounds(int r, int c, int rows, int cols) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
}
```

```typescript
const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
const inBounds = (r: number, c: number, rows: number, cols: number) =>
    r >= 0 && r < rows && c >= 0 && c < cols;
```

```python
DIRS = [(-1, 0), (1, 0), (0, -1), (0, 1)]

def in_bounds(r: int, c: int, rows: int, cols: int) -> bool:
    return 0 <= r < rows and 0 <= c < cols
```

```go
var dirs = [][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

func inBounds(r, c, rows, cols int) bool {
    return r >= 0 && r < rows && c >= 0 && c < cols
}
```

## Choosing a Representation

| Situation | Use |
|---|---|
| Sparse graph (E << V²), BFS/DFS | Adjacency list |
| Dense graph (E ≈ V²), need O(1) edge check | Adjacency matrix |
| Sorting edges by weight (Kruskal's) | Edge list |
| Grid problems | Implicit graph with direction arrays |
| String-keyed nodes | `HashMap<String, List<String>>` |

## Key Interview Insights

- **Default to adjacency list.** It handles 99% of interview graphs efficiently (O(V+E) space vs O(V²) for matrix).
- **Always build the graph first** before implementing the algorithm. Clean separation prevents bugs.
- **For undirected graphs**, add both directions when building the adjacency list.
- **Use `defaultdict(list)` in Python** — avoids the "key not found" check when accessing unseen nodes.
- **Grid problems are graph problems.** Always think BFS/DFS when you see a 2D grid with connectivity queries.
