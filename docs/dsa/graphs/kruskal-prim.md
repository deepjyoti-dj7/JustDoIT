---
title: Kruskal & Prim (MST)
description: Minimum Spanning Tree algorithms — Kruskal's greedy edge sort and Prim's greedy node expansion
---

# Kruskal & Prim (MST)

A **Minimum Spanning Tree (MST)** of a connected, undirected, weighted graph is a subgraph that:
- Connects all V vertices
- Uses exactly V-1 edges
- Minimizes the total edge weight

MST problems appear as: "minimum cost to connect all nodes," "minimum cable to connect all cities," "minimum roads to reach all villages."

## Kruskal's Algorithm

**Greedy:** Sort all edges by weight. Add each edge to the MST if it doesn't form a cycle (i.e., its two endpoints are in different components). Use Union-Find for cycle detection.

**Steps:**
1. Sort edges by weight (ascending)
2. For each edge (u, v, w): if `find(u) != find(v)`, include it and `unite(u, v)`
3. Stop when V-1 edges are selected

```cpp
#include <vector>
#include <algorithm>
using namespace std;

struct UnionFind {
    vector<int> parent, rank_;
    UnionFind(int n) : parent(n), rank_(n, 0) { iota(parent.begin(), parent.end(), 0); }
    int find(int x) { return parent[x] == x ? x : parent[x] = find(parent[x]); }
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
        return true;
    }
};

int kruskal(int n, vector<vector<int>>& edges) {
    // edges[i] = {weight, u, v}
    sort(edges.begin(), edges.end());
    UnionFind uf(n);
    int totalWeight = 0, edgesUsed = 0;
    for (auto& e : edges) {
        if (uf.unite(e[1], e[2])) {
            totalWeight += e[0];
            if (++edgesUsed == n - 1) break;
        }
    }
    return edgesUsed == n - 1 ? totalWeight : -1;  // -1 if not connected
}
```

```java
int kruskal(int n, int[][] edges) {
    // edges[i] = {u, v, weight}
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    int[] parent = new int[n]; int[] rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;

    int totalWeight = 0, used = 0;
    for (int[] e : edges) {
        int pu = find(parent, e[0]), pv = find(parent, e[1]);
        if (pu != pv) {
            if (rank[pu] < rank[pv]) { int t = pu; pu = pv; pv = t; }
            parent[pv] = pu;
            if (rank[pu] == rank[pv]) rank[pu]++;
            totalWeight += e[2];
            if (++used == n - 1) break;
        }
    }
    return used == n - 1 ? totalWeight : -1;
}
int find(int[] parent, int x) {
    if (parent[x] != x) parent[x] = find(parent, parent[x]);
    return parent[x];
}
```

```typescript
function kruskal(n: number, edges: number[][]): number {
    edges.sort((a, b) => a[2] - b[2]);
    const parent = Array.from({length: n}, (_, i) => i);
    const rank = new Array(n).fill(0);

    function find(x: number): number {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    }

    let totalWeight = 0, used = 0;
    for (const [u, v, w] of edges) {
        const pu = find(u), pv = find(v);
        if (pu !== pv) {
            if (rank[pu] < rank[pv]) { parent[pu] = pv; } 
            else { parent[pv] = pu; if (rank[pu] === rank[pv]) rank[pu]++; }
            totalWeight += w;
            if (++used === n - 1) break;
        }
    }
    return used === n - 1 ? totalWeight : -1;
}
```

```python
def kruskal(n: int, edges: list[list[int]]) -> int:
    edges.sort(key=lambda e: e[2])
    parent = list(range(n))
    rank = [0] * n

    def find(x: int) -> int:
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    total_weight = 0
    used = 0
    for u, v, w in edges:
        pu, pv = find(u), find(v)
        if pu != pv:
            if rank[pu] < rank[pv]:
                pu, pv = pv, pu
            parent[pv] = pu
            if rank[pu] == rank[pv]:
                rank[pu] += 1
            total_weight += w
            used += 1
            if used == n - 1:
                break
    return total_weight if used == n - 1 else -1
```

```go
func kruskal(n int, edges [][]int) int {
    sort.Slice(edges, func(i, j int) bool { return edges[i][2] < edges[j][2] })
    parent := make([]int, n)
    rank := make([]int, n)
    for i := range parent { parent[i] = i }

    var find func(int) int
    find = func(x int) int {
        if parent[x] != x { parent[x] = find(parent[x]) }
        return parent[x]
    }

    totalWeight, used := 0, 0
    for _, e := range edges {
        pu, pv := find(e[0]), find(e[1])
        if pu != pv {
            if rank[pu] < rank[pv] { pu, pv = pv, pu }
            parent[pv] = pu
            if rank[pu] == rank[pv] { rank[pu]++ }
            totalWeight += e[2]; used++
            if used == n-1 { break }
        }
    }
    if used == n-1 { return totalWeight }
    return -1
}
```

## Prim's Algorithm

**Greedy:** Grow the MST from a starting node. Maintain a min-heap of edges that cross the cut between MST and non-MST. Always pick the cheapest crossing edge.

```cpp
#include <queue>
using namespace std;

int prim(int n, vector<vector<pair<int,int>>>& adj) {
    // adj[u] = [(v, weight), ...]
    vector<bool> inMST(n, false);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({0, 0});  // {cost, node}, start from 0
    int totalWeight = 0, edgesUsed = 0;

    while (!pq.empty() && edgesUsed < n) {
        auto [cost, u] = pq.top(); pq.pop();
        if (inMST[u]) continue;
        inMST[u] = true;
        totalWeight += cost;
        edgesUsed++;
        for (auto [v, w] : adj[u])
            if (!inMST[v]) pq.push({w, v});
    }
    return edgesUsed == n ? totalWeight : -1;
}
```

```java
int prim(int n, List<List<int[]>> adj) {
    boolean[] inMST = new boolean[n];
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, 0});
    int totalWeight = 0, used = 0;

    while (!pq.isEmpty() && used < n) {
        int[] curr = pq.poll();
        int cost = curr[0], u = curr[1];
        if (inMST[u]) continue;
        inMST[u] = true; totalWeight += cost; used++;
        for (int[] edge : adj.get(u))
            if (!inMST[edge[0]]) pq.offer(new int[]{edge[1], edge[0]});
    }
    return used == n ? totalWeight : -1;
}
```

```typescript
function prim(n: number, adj: [number, number][][]): number {
    const inMST = new Array(n).fill(false);
    const pq: [number, number][] = [[0, 0]];  // [cost, node]
    let totalWeight = 0, used = 0;

    while (pq.length > 0 && used < n) {
        pq.sort((a, b) => a[0] - b[0]);
        const [cost, u] = pq.shift()!;
        if (inMST[u]) continue;
        inMST[u] = true; totalWeight += cost; used++;
        for (const [v, w] of adj[u])
            if (!inMST[v]) pq.push([w, v]);
    }
    return used === n ? totalWeight : -1;
}
```

```python
import heapq

def prim(n: int, adj: list[list[tuple[int, int]]]) -> int:
    in_mst = [False] * n
    heap = [(0, 0)]  # (cost, node)
    total_weight = 0
    used = 0

    while heap and used < n:
        cost, u = heapq.heappop(heap)
        if in_mst[u]:
            continue
        in_mst[u] = True
        total_weight += cost
        used += 1
        for v, w in adj[u]:
            if not in_mst[v]:
                heapq.heappush(heap, (w, v))

    return total_weight if used == n else -1
```

```go
func prim(n int, adj [][][2]int) int {
    inMST := make([]bool, n)
    h := &MinHeap{{0, 0}}
    heap.Init(h)
    totalWeight, used := 0, 0

    for h.Len() > 0 && used < n {
        curr := heap.Pop(h).(Item)
        if inMST[curr.node] { continue }
        inMST[curr.node] = true
        totalWeight += curr.dist; used++
        for _, e := range adj[curr.node] {
            if !inMST[e[0]] { heap.Push(h, Item{e[1], e[0]}) }
        }
    }
    if used == n { return totalWeight }
    return -1
}
```

## Kruskal's vs Prim's

| | Kruskal's | Prim's |
|---|---|---|
| **Approach** | Sort all edges, process globally | Grow tree from one node |
| **Data structure** | Union-Find | Min-heap (priority queue) |
| **Time (binary heap)** | O(E log E) | O((V + E) log V) |
| **Best for** | Sparse graphs (E << V²) | Dense graphs (E ≈ V²) |
| **Code simplicity** | Simpler with Union-Find | More setup |

Both produce the same minimum total weight (though edge sets may differ).

## Complexity

| Algorithm | Time | Space |
|---|---|---|
| Kruskal's | O(E log E) — sorting dominates | O(V + E) |
| Prim's (binary heap) | O((V + E) log V) | O(V + E) |

## Key Interview Insights

- **MST weight is unique.** Even if multiple MSTs exist (ties), the minimum total weight is always the same.
- **Kruskal's is simpler to code** in most interview settings — just sort edges and apply Union-Find.
- **Connected graph check:** if `edgesUsed < n-1` after Kruskal's, the graph isn't connected → no MST.
- **Prim's is preferred for dense graphs** where E ≈ V². Starting from any node gives the same MST weight.
- **MST variation — Maximum Spanning Tree:** Reverse the sort (descending) in Kruskal's or use a max-heap in Prim's.
