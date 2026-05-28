---
title: Bellman-Ford Algorithm
description: Single-source shortest path that handles negative weights and detects negative cycles
---

# Bellman-Ford Algorithm

Bellman-Ford finds the **shortest path from a source to all other nodes**, and crucially, it handles **negative edge weights** — something Dijkstra cannot do. It also detects **negative cycles** (cycles whose total weight is negative, making shortest paths undefined).

## Core Intuition

**Relax all edges, n-1 times.**

A shortest path in a graph with n nodes can have at most n-1 edges (otherwise it contains a cycle). So repeat n-1 "relaxation passes" over all edges. After n-1 passes, all shortest paths are found.

If a n-th pass still updates a distance → **negative cycle detected**.

```
Relax edge (u, v, w): if dist[u] + w < dist[v] → dist[v] = dist[u] + w

Pass 1: Finds shortest paths using ≤ 1 edge
Pass 2: Finds shortest paths using ≤ 2 edges
...
Pass n-1: Finds shortest paths using ≤ n-1 edges
Pass n:   If any update → negative cycle
```

## Implementation

```cpp
#include <vector>
#include <climits>
using namespace std;

vector<int> bellmanFord(int n, vector<vector<int>>& edges, int src) {
    // edges[i] = {u, v, weight}
    vector<int> dist(n, INT_MAX);
    dist[src] = 0;

    for (int i = 0; i < n - 1; i++) {      // n-1 passes
        for (auto& e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != INT_MAX && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    // Check for negative cycle
    for (auto& e : edges) {
        int u = e[0], v = e[1], w = e[2];
        if (dist[u] != INT_MAX && dist[u] + w < dist[v])
            return {};  // negative cycle exists
    }
    return dist;
}
```

```java
int[] bellmanFord(int n, int[][] edges, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    for (int i = 0; i < n - 1; i++) {
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v])
                dist[v] = dist[u] + w;
        }
    }
    for (int[] e : edges) {
        if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]])
            return new int[]{};  // negative cycle
    }
    return dist;
}
```

```typescript
function bellmanFord(n: number, edges: number[][], src: number): number[] | null {
    const dist = new Array(n).fill(Infinity);
    dist[src] = 0;

    for (let i = 0; i < n - 1; i++) {
        for (const [u, v, w] of edges) {
            if (dist[u] !== Infinity && dist[u] + w < dist[v])
                dist[v] = dist[u] + w;
        }
    }
    for (const [u, v, w] of edges) {
        if (dist[u] !== Infinity && dist[u] + w < dist[v])
            return null;  // negative cycle
    }
    return dist;
}
```

```python
def bellman_ford(n: int, edges: list[list[int]], src: int) -> list[int] | None:
    dist = [float('inf')] * n
    dist[src] = 0

    for _ in range(n - 1):                # n-1 passes
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w

    # Detect negative cycle
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return None  # negative cycle exists
    return dist
```

```go
func bellmanFord(n int, edges [][]int, src int) []int {
    const INF = 1<<31 - 1
    dist := make([]int, n)
    for i := range dist { dist[i] = INF }
    dist[src] = 0

    for i := 0; i < n-1; i++ {
        for _, e := range edges {
            u, v, w := e[0], e[1], e[2]
            if dist[u] != INF && dist[u]+w < dist[v] {
                dist[v] = dist[u] + w
            }
        }
    }
    for _, e := range edges {
        if dist[e[0]] != INF && dist[e[0]]+e[2] < dist[e[1]] {
            return nil  // negative cycle
        }
    }
    return dist
}
```

## K-Pass Variant (Cheapest Flights Within K Stops)

A powerful variant: run exactly k+1 passes of Bellman-Ford to find shortest paths using **at most k+1 edges** (k stops in between). Use a copy of dist from the previous pass to prevent chaining updates within the same pass.

```cpp
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    const int INF = 1e9;
    vector<int> dist(n, INF);
    dist[src] = 0;

    for (int i = 0; i <= k; i++) {          // k+1 passes = at most k+1 edges
        vector<int> tmp = dist;              // copy to avoid intra-pass updates
        for (auto& f : flights) {
            int u = f[0], v = f[1], w = f[2];
            if (dist[u] != INF && dist[u] + w < tmp[v])
                tmp[v] = dist[u] + w;
        }
        dist = tmp;
    }
    return dist[dst] == INF ? -1 : dist[dst];
}
```

```java
int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int INF = Integer.MAX_VALUE / 2;
    int[] dist = new int[n];
    Arrays.fill(dist, INF);
    dist[src] = 0;
    for (int i = 0; i <= k; i++) {
        int[] tmp = dist.clone();
        for (int[] f : flights) {
            int u = f[0], v = f[1], w = f[2];
            if (dist[u] != INF && dist[u] + w < tmp[v]) tmp[v] = dist[u] + w;
        }
        dist = tmp;
    }
    return dist[dst] == INF ? -1 : dist[dst];
}
```

```typescript
function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
    const INF = Infinity;
    let dist = new Array(n).fill(INF);
    dist[src] = 0;
    for (let i = 0; i <= k; i++) {
        const tmp = [...dist];
        for (const [u, v, w] of flights) {
            if (dist[u] !== INF && dist[u] + w < tmp[v]) tmp[v] = dist[u] + w;
        }
        dist = tmp;
    }
    return dist[dst] === INF ? -1 : dist[dst];
}
```

```python
def find_cheapest_price(n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
    INF = float('inf')
    dist = [INF] * n
    dist[src] = 0

    for _ in range(k + 1):          # k+1 passes = at most k stops
        tmp = dist[:]               # copy previous state
        for u, v, w in flights:
            if dist[u] != INF and dist[u] + w < tmp[v]:
                tmp[v] = dist[u] + w
        dist = tmp

    return dist[dst] if dist[dst] != INF else -1
```

```go
func findCheapestPrice(n int, flights [][]int, src int, dst int, k int) int {
    const INF = math.MaxInt32
    dist := make([]int, n)
    for i := range dist { dist[i] = INF }
    dist[src] = 0
    for i := 0; i <= k; i++ {
        tmp := append([]int{}, dist...)
        for _, f := range flights {
            u, v, w := f[0], f[1], f[2]
            if dist[u] != INF && dist[u]+w < tmp[v] { tmp[v] = dist[u] + w }
        }
        dist = tmp
    }
    if dist[dst] == INF { return -1 }
    return dist[dst]
}
```

## Dijkstra vs Bellman-Ford

| | Dijkstra | Bellman-Ford |
|---|---|---|
| **Negative weights** | ❌ Doesn't work | ✅ Handles |
| **Negative cycles** | ❌ Cannot detect | ✅ Detects |
| **Time complexity** | O((V+E) log V) | O(V × E) |
| **Best for** | Non-negative weighted graphs | Negative weights, k-edge limit |
| **k-edge paths** | ❌ Needs modification | ✅ Run exactly k passes |

## Complexity

| | Time | Space |
|---|---|---|
| Standard | O(V × E) | O(V) |
| K-pass variant | O(k × E) | O(V) |

## Key Interview Insights

- **Use Bellman-Ford when:** edges can be negative, you need negative cycle detection, or the problem asks for "at most k hops/stops."
- **The copy trick for k-pass is critical.** Without copying dist before each pass, a chain of relaxations can happen in one pass and use more than k edges.
- **SPFA (Shortest Path Faster Algorithm)** is an optimized Bellman-Ford using a queue — average O(E) but worst case still O(VE). Not worth the complexity in interviews.
- **`dist[u] != INF` guard is necessary** to avoid integer overflow when adding weight to infinity.
