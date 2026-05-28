---
title: Floyd-Warshall Algorithm
description: All-pairs shortest paths using dynamic programming — O(V³) but handles negative weights
---

# Floyd-Warshall Algorithm

Floyd-Warshall finds the **shortest path between every pair of nodes** in a weighted graph. While Dijkstra gives you distances from one source in O((V+E) log V), Floyd-Warshall gives you ALL-PAIRS shortest paths in O(V³).

## Core Intuition

**Dynamic programming over intermediate nodes.**

`dp[i][j][k]` = shortest path from i to j using only nodes 0..k as intermediates.

For each new intermediate node k, check: is going through k shorter than the current best?

```
dp[i][j][k] = min(dp[i][j][k-1], dp[i][k][k-1] + dp[k][j][k-1])
                       ^                   ^              ^
                  don't use k         i to k          k to j
```

Since we update in place (k outer, i and j inner), the 3D DP collapses to a 2D matrix.

## Implementation

```cpp
#include <vector>
#include <climits>
using namespace std;

vector<vector<int>> floydWarshall(int n, vector<vector<int>>& edges) {
    const int INF = 1e9;
    // Initialize: dist[i][i] = 0, dist[i][j] = weight if edge exists, else INF
    vector<vector<int>> dist(n, vector<int>(n, INF));
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (auto& e : edges) {
        dist[e[0]][e[1]] = e[2];
        // dist[e[1]][e[0]] = e[2];  // undirected
    }

    // Core DP: try each node k as intermediate
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] != INF && dist[k][j] != INF)
                    dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);

    // Optional: check for negative cycles
    // If dist[i][i] < 0 for any i → negative cycle
    return dist;
}
```

```java
int[][] floydWarshall(int n, int[][] edges) {
    final int INF = (int) 1e9;
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, INF);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) dist[e[0]][e[1]] = e[2];

    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                if (dist[i][k] != INF && dist[k][j] != INF)
                    dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);

    return dist;
}
```

```typescript
function floydWarshall(n: number, edges: number[][]): number[][] {
    const INF = 1e9;
    const dist: number[][] = Array.from({length: n}, (_, i) =>
        Array.from({length: n}, (_, j) => i === j ? 0 : INF)
    );
    for (const [u, v, w] of edges) dist[u][v] = w;

    for (let k = 0; k < n; k++)
        for (let i = 0; i < n; i++)
            for (let j = 0; j < n; j++)
                if (dist[i][k] + dist[k][j] < dist[i][j])
                    dist[i][j] = dist[i][k] + dist[k][j];

    return dist;
}
```

```python
def floyd_warshall(n: int, edges: list[list[int]]) -> list[list[int]]:
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, w in edges:
        dist[u][v] = w
        # dist[v][u] = w  # undirected

    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]

    return dist
```

```go
func floydWarshall(n int, edges [][]int) [][]int {
    const INF = 1<<31 - 1
    dist := make([][]int, n)
    for i := range dist {
        dist[i] = make([]int, n)
        for j := range dist[i] { dist[i][j] = INF }
        dist[i][i] = 0
    }
    for _, e := range edges { dist[e[0]][e[1]] = e[2] }

    for k := 0; k < n; k++ {
        for i := 0; i < n; i++ {
            for j := 0; j < n; j++ {
                if dist[i][k] != INF && dist[k][j] != INF {
                    if d := dist[i][k] + dist[k][j]; d < dist[i][j] {
                        dist[i][j] = d
                    }
                }
            }
        }
    }
    return dist
}
```

## Negative Cycle Detection

After running Floyd-Warshall, if `dist[i][i] < 0` for any node i, there's a negative cycle reachable from i.

## When to Use Floyd-Warshall

| Situation | Algorithm |
|---|---|
| Shortest from ONE source, non-negative weights | Dijkstra O((V+E) log V) |
| Shortest from ONE source, negative weights | Bellman-Ford O(VE) |
| **Shortest between ALL pairs** | **Floyd-Warshall O(V³)** |
| Dense graph, all pairs | Floyd-Warshall beats V × Dijkstra when E ≈ V² |
| Graph is small (V ≤ 500) | Floyd-Warshall is fine |
| Graph is large (V > 1000) | Too slow; use repeated Dijkstra |

## Complexity

| | Time | Space |
|---|---|---|
| Floyd-Warshall | O(V³) | O(V²) |
| V × Dijkstra | O(V(V+E) log V) | O(V + E) |

Floyd-Warshall is better when V is small or the graph is dense (E ≈ V²).

## Key Interview Insights

- **The loop order matters: k is outermost.** k must be the outermost loop to ensure that when you compute paths through k, all paths through 0..k-1 are already computed.
- **Guard against INF overflow.** `dist[i][k] + dist[k][j]` can overflow if both are INF. Always check `!= INF` before adding.
- **Transitive closure** is a special case: replace min with OR, use boolean matrix.
- **Floyd-Warshall works on directed graphs by default.** For undirected, just set both `dist[u][v] = w` and `dist[v][u] = w` during initialization.
