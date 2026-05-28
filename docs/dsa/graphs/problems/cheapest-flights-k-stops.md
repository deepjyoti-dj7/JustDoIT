---
title: Cheapest Flights Within K Stops
difficulty: Medium
tags: [Graph, BFS, Bellman-Ford, Dynamic Programming]
link: https://leetcode.com/problems/cheapest-flights-within-k-stops/
---

# Cheapest Flights Within K Stops

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) |
| **Tags** | Graph, Bellman-Ford, DP, BFS |

## Problem Statement

Given `n` cities, a list of flights `flights[i] = [from, to, price]`, a source `src`, a destination `dst`, and at most `k` stops, find the cheapest price from `src` to `dst` with at most `k` stops. Return `-1` if no such route exists.

## Intuition

**Why not regular Dijkstra?** The stops constraint means we can't use a simple greedy shortest path — a cheaper longer path might exceed k stops, while a more expensive shorter path fits. The constraint breaks the Dijkstra greedy property.

**Bellman-Ford k-pass variant:** Standard Bellman-Ford does `V-1` passes to find shortest paths. For "at most k stops" = "at most k+1 edges," do exactly `k+1` passes. The critical trick: use a **copy** of the distance array from the previous pass when updating — this ensures each pass counts exactly one more hop.

## Approach 1: Bellman-Ford (k+1 Passes)

```cpp
class Solution {
public:
    int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
        vector<int> dist(n, INT_MAX);
        dist[src] = 0;

        for (int i = 0; i <= k; i++) {  // k+1 passes = at most k stops
            vector<int> temp = dist;    // copy BEFORE this pass
            for (auto& f : flights) {
                int u = f[0], v = f[1], w = f[2];
                if (dist[u] != INT_MAX && dist[u] + w < temp[v])
                    temp[v] = dist[u] + w;
            }
            dist = temp;
        }
        return dist[dst] == INT_MAX ? -1 : dist[dst];
    }
};
```

```java
class Solution {
    public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[src] = 0;

        for (int i = 0; i <= k; i++) {
            int[] temp = dist.clone();  // snapshot from previous pass
            for (int[] f : flights) {
                int u = f[0], v = f[1], w = f[2];
                if (dist[u] != Integer.MAX_VALUE && dist[u] + w < temp[v])
                    temp[v] = dist[u] + w;
            }
            dist = temp;
        }
        return dist[dst] == Integer.MAX_VALUE ? -1 : dist[dst];
    }
}
```

```typescript
function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
    let dist = new Array(n).fill(Infinity);
    dist[src] = 0;

    for (let i = 0; i <= k; i++) {
        const temp = [...dist];  // copy before this pass
        for (const [u, v, w] of flights) {
            if (dist[u] !== Infinity && dist[u] + w < temp[v])
                temp[v] = dist[u] + w;
        }
        dist = temp;
    }
    return dist[dst] === Infinity ? -1 : dist[dst];
}
```

```python
class Solution:
    def findCheapestPrice(self, n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
        dist = [float('inf')] * n
        dist[src] = 0

        for _ in range(k + 1):  # k+1 passes = at most k+1 edges = k stops
            temp = dist[:]      # COPY before pass — prevent using this pass's updates
            for u, v, w in flights:
                if dist[u] != float('inf') and dist[u] + w < temp[v]:
                    temp[v] = dist[u] + w
            dist = temp

        return dist[dst] if dist[dst] != float('inf') else -1
```

```go
func findCheapestPrice(n int, flights [][]int, src int, dst int, k int) int {
    const INF = 1<<31 - 1
    dist := make([]int, n)
    for i := range dist { dist[i] = INF }
    dist[src] = 0

    for i := 0; i <= k; i++ {
        temp := append([]int{}, dist...)  // copy before pass
        for _, f := range flights {
            u, v, w := f[0], f[1], f[2]
            if dist[u] != INF && dist[u]+w < temp[v] { temp[v] = dist[u] + w }
        }
        dist = temp
    }
    if dist[dst] == INF { return -1 }
    return dist[dst]
}
```

## Approach 2: BFS Level-by-Level (Cleaner for "Stops" Constraint)

Level-based BFS is intuitive: each BFS level = one more stop used.

```cpp
int findCheapestPrice(int n, vector<vector<int>>& flights, int src, int dst, int k) {
    vector<vector<pair<int,int>>> adj(n);
    for (auto& f : flights) adj[f[0]].push_back({f[1], f[2]});
    vector<int> prices(n, INT_MAX);
    prices[src] = 0;
    queue<pair<int,int>> q;  // {node, cost}
    q.push({src, 0});
    for (int stops = 0; stops <= k && !q.empty(); stops++) {
        int sz = q.size();
        while (sz--) {
            auto [node, cost] = q.front(); q.pop();
            for (auto [nb, price] : adj[node]) {
                int newCost = cost + price;
                if (newCost < prices[nb]) { prices[nb] = newCost; q.push({nb, newCost}); }
            }
        }
    }
    return prices[dst] == INT_MAX ? -1 : prices[dst];
}
```

```java
int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    List<int[]>[] adj = new List[n];
    for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();
    for (int[] f : flights) adj[f[0]].add(new int[]{f[1], f[2]});
    int[] prices = new int[n];
    Arrays.fill(prices, Integer.MAX_VALUE);
    prices[src] = 0;
    Queue<int[]> q = new LinkedList<>();
    q.offer(new int[]{src, 0});
    for (int stops = 0; stops <= k && !q.isEmpty(); stops++) {
        int sz = q.size();
        while (sz-- > 0) {
            int[] curr = q.poll();
            int node = curr[0], cost = curr[1];
            for (int[] nb : adj[node]) {
                int newCost = cost + nb[1];
                if (newCost < prices[nb[0]]) { prices[nb[0]] = newCost; q.offer(new int[]{nb[0], newCost}); }
            }
        }
    }
    return prices[dst] == Integer.MAX_VALUE ? -1 : prices[dst];
}
```

```typescript
function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
    const adj: [number, number][][] = Array.from({length: n}, () => []);
    for (const [u, v, w] of flights) adj[u].push([v, w]);
    const prices = new Array(n).fill(Infinity);
    prices[src] = 0;
    let q: [number, number][] = [[src, 0]];
    for (let stops = 0; stops <= k && q.length > 0; stops++) {
        const sz = q.length;
        const next: [number, number][] = [];
        for (let i = 0; i < sz; i++) {
            const [node, cost] = q[i];
            for (const [nb, price] of adj[node]) {
                const newCost = cost + price;
                if (newCost < prices[nb]) { prices[nb] = newCost; next.push([nb, newCost]); }
            }
        }
        q = next;
    }
    return prices[dst] === Infinity ? -1 : prices[dst];
}
```

```python
from collections import defaultdict, deque

class Solution:
    def findCheapestPrice(self, n: int, flights: list[list[int]], src: int, dst: int, k: int) -> int:
        adj = defaultdict(list)
        for u, v, w in flights:
            adj[u].append((v, w))

        prices = [float('inf')] * n
        prices[src] = 0
        q = deque([(src, 0)])  # (node, cost_so_far)

        stops = 0
        while q and stops <= k:
            for _ in range(len(q)):
                node, cost = q.popleft()
                for neighbor, price in adj[node]:
                    new_cost = cost + price
                    if new_cost < prices[neighbor]:
                        prices[neighbor] = new_cost
                        q.append((neighbor, new_cost))
            stops += 1

        return prices[dst] if prices[dst] != float('inf') else -1
```

```go
func findCheapestPrice(n int, flights [][]int, src int, dst int, k int) int {
    adj := make([][][2]int, n)
    for _, f := range flights { adj[f[0]] = append(adj[f[0]], [2]int{f[1], f[2]}) }
    prices := make([]int, n)
    for i := range prices { prices[i] = math.MaxInt32 }
    prices[src] = 0
    q := [][2]int{{src, 0}}
    for stops := 0; stops <= k && len(q) > 0; stops++ {
        sz := len(q)
        for i := 0; i < sz; i++ {
            node, cost := q[i][0], q[i][1]
            for _, nb := range adj[node] {
                if newCost := cost + nb[1]; newCost < prices[nb[0]] {
                    prices[nb[0]] = newCost
                    q = append(q, [2]int{nb[0], newCost})
                }
            }
        }
        q = q[sz:]
    }
    if prices[dst] == math.MaxInt32 { return -1 }
    return prices[dst]
}
```

## Why NOT Regular Dijkstra

Consider: `src=0, dst=2, k=1, flights: 0→1 (cost 1), 1→2 (cost 1), 0→2 (cost 10)`

Regular Dijkstra picks `0→1→2` (cost 2) which uses 1 stop — this works here.

But: `src=0, dst=2, k=0, flights: 0→1 (cost 1), 1→2 (cost 1), 0→2 (cost 10)`

k=0 means 0 stops. Only direct flights count. Correct answer: 10 (direct 0→2). Dijkstra would still try 0→1→2 (cost 2) but it uses 1 stop which exceeds k=0. The stops constraint invalidates the greedy property.

## Complexity

- **Time:** O((k+1) × E) — Bellman-Ford k+1 passes over all edges
- **Space:** O(V) — two distance arrays (current + temp)

## Key Interview Insights

- **The copy trick is critical.** `temp = dist[:]` ensures updates in pass `i` don't contaminate pass `i` itself. Without it, a single relaxation might chain through multiple edges in one pass, using more than one "stop."
- **k stops = k+1 edges = k+1 Bellman-Ford passes.** "Stops" doesn't include src or dst, so `k stops` allows paths with up to `k+1` edges.
- **Modified Dijkstra with (cost, stops, node) state also works** — use `(cost, stops, node)` in the heap and don't skip if stops <= k, even if cost > known cost at that node. But Bellman-Ford is cleaner here.
- **DP formulation:** `dp[i][v]` = min cost to reach `v` using at most `i` edges. This is exactly what the copy trick implements.
