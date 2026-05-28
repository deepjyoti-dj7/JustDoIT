---
title: Dijkstra's Algorithm
description: Single-source shortest path for graphs with non-negative edge weights using a min-heap
---

# Dijkstra's Algorithm

Dijkstra's algorithm finds the **shortest path from a source node to all other nodes** in a graph with **non-negative edge weights**. It's the workhorse of weighted shortest path problems in interviews.

## Core Intuition

Dijkstra is a **greedy best-first search**. At every step, expand the unvisited node with the smallest known distance. This greedy choice is safe because edge weights are non-negative — you can never find a shorter path to an already-settled node.

Think of it as: always process the "cheapest" next city you haven't finalized yet.

```
Graph with weights:
    (1) --4-- (2)
     |  \     |
     2   3    1
     |     \  |
    (3)--5--(4)

Start at 1:
- dist[1]=0, dist[2]=∞, dist[3]=∞, dist[4]=∞
- Process 1: dist[2]=4, dist[3]=2, dist[4]=3
- Process 3 (dist=2): no updates (dist[4] = min(3, 2+5) = 3)
- Process 4 (dist=3): dist[2] = min(4, 3+1) = 4 (no change)
- Process 2 (dist=4): done
```

## Why Non-Negative Weights Only?

If a negative edge exists, settling a node might be wrong — a later, longer path with a negative edge could be shorter. Bellman-Ford handles negative weights.

## Implementation — Min-Heap (Priority Queue)

```cpp
#include <vector>
#include <queue>
#include <climits>
using namespace std;

vector<int> dijkstra(int n, vector<vector<pair<int,int>>>& adj, int src) {
    vector<int> dist(n, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq; // min-heap
    dist[src] = 0;
    pq.push({0, src});  // {distance, node}

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue;  // stale entry — skip
        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

```java
import java.util.*;

int[] dijkstra(int n, List<List<int[]>> adj, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    // min-heap: {distance, node}
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], u = curr[1];
        if (d > dist[u]) continue;  // stale
        for (int[] edge : adj.get(u)) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}
```

```typescript
function dijkstra(n: number, adj: [number, number][][], src: number): number[] {
    const dist = new Array(n).fill(Infinity);
    dist[src] = 0;
    // Min-heap simulation: [distance, node]
    const pq: [number, number][] = [[0, src]];
    pq.sort((a, b) => a[0] - b[0]);

    while (pq.length > 0) {
        const [d, u] = pq.shift()!;
        if (d > dist[u]) continue;
        for (const [v, w] of adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push([dist[v], v]);
                pq.sort((a, b) => a[0] - b[0]);
            }
        }
    }
    return dist;
}
```

```python
import heapq

def dijkstra(n: int, adj: list[list[tuple[int, int]]], src: int) -> list[int]:
    dist = [float('inf')] * n
    dist[src] = 0
    heap = [(0, src)]  # (distance, node)

    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue  # stale entry
        for v, w in adj[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                heapq.heappush(heap, (dist[v], v))
    return dist
```

```go
import "container/heap"

type Item struct{ dist, node int }
type MinHeap []Item
func (h MinHeap) Len() int            { return len(h) }
func (h MinHeap) Less(i, j int) bool  { return h[i].dist < h[j].dist }
func (h MinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x interface{}) { *h = append(*h, x.(Item)) }
func (h *MinHeap) Pop() interface{}   { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }

func dijkstra(n int, adj [][][2]int, src int) []int {
    dist := make([]int, n)
    for i := range dist { dist[i] = 1<<31 - 1 }
    dist[src] = 0
    h := &MinHeap{{0, src}}
    heap.Init(h)
    for h.Len() > 0 {
        curr := heap.Pop(h).(Item)
        if curr.dist > dist[curr.node] { continue }
        for _, e := range adj[curr.node] {
            v, w := e[0], e[1]
            if d := dist[curr.node] + w; d < dist[v] {
                dist[v] = d
                heap.Push(h, Item{d, v})
            }
        }
    }
    return dist
}
```

## The "Stale Entry" Pattern

Dijkstra with lazy deletion: when we update a node's distance, we push a new entry to the heap without removing the old one. The check `if d > dist[u]: continue` skips outdated entries efficiently.

This avoids the need for a decrease-key operation (which requires a Fibonacci heap for theoretical optimality but complicates code).

## Complexity

| | Time | Space |
|---|---|---|
| Binary heap (interview standard) | O((V + E) log V) | O(V + E) |
| Fibonacci heap (theoretical) | O(V log V + E) | O(V + E) |
| Dense graphs | O(V²) with array | O(V) |

## Key Interview Insights

- **Non-negative weights only.** If the problem has negative edges, use Bellman-Ford.
- **The stale-entry skip is essential.** `if d > dist[u]: continue` prevents reprocessing with outdated distances.
- **Dijkstra also finds if a node is reachable:** if `dist[target] == ∞` after running, it's unreachable.
- **Modified Dijkstra for k-stops:** When constraints are added (e.g., "at most k stops"), you can't use `dist[u] > d: continue` because you need to track (cost, stops) as state. This becomes the Bellman-Ford / BFS variant (see Cheapest Flights problem).
- **Bidirectional Dijkstra** runs from source and target simultaneously — cuts search space roughly in half.
