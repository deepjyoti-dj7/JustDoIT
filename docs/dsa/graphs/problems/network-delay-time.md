---
title: Network Delay Time
difficulty: Medium
tags: [Graph, Dijkstra, Shortest Path, Heap]
link: https://leetcode.com/problems/network-delay-time/
---

# Network Delay Time

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/) |
| **Tags** | Graph, Dijkstra, Shortest Path, Heap |

## Problem Statement

Given `n` nodes, a list of weighted directed edges `times[i] = [u, v, w]`, and a source node `k`, find the minimum time for all nodes to receive a signal sent from `k`. If not all nodes can receive the signal, return `-1`.

## Intuition

This is a classic **single-source shortest path** problem with non-negative weights — exactly the use case for Dijkstra's algorithm. After computing shortest distances from `k` to all nodes, the answer is `max(dist)`. If any node is unreachable, return `-1`.

## Approach: Dijkstra's Algorithm

Use a min-heap to always process the closest unvisited node first.

```cpp
class Solution {
public:
    int networkDelayTime(vector<vector<int>>& times, int n, int k) {
        vector<vector<pair<int,int>>> adj(n+1);
        for (auto& t : times) adj[t[0]].push_back({t[1], t[2]});

        vector<int> dist(n+1, INT_MAX);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
        dist[k] = 0;
        pq.push({0, k});

        while (!pq.empty()) {
            auto [d, u] = pq.top(); pq.pop();
            if (d > dist[u]) continue;  // stale entry — skip
            for (auto& [v, w] : adj[u]) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.push({dist[v], v});
                }
            }
        }

        int maxDist = *max_element(dist.begin()+1, dist.end());
        return maxDist == INT_MAX ? -1 : maxDist;
    }
};
```

```java
class Solution {
    public int networkDelayTime(int[][] times, int n, int k) {
        List<int[]>[] adj = new List[n+1];
        for (int i = 1; i <= n; i++) adj[i] = new ArrayList<>();
        for (int[] t : times) adj[t[0]].add(new int[]{t[1], t[2]});

        int[] dist = new int[n+1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;
        PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0]-b[0]);
        pq.offer(new int[]{0, k});

        while (!pq.isEmpty()) {
            int[] top = pq.poll();
            int d = top[0], u = top[1];
            if (d > dist[u]) continue;
            for (int[] edge : adj[u]) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.offer(new int[]{dist[v], v});
                }
            }
        }

        int max = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            max = Math.max(max, dist[i]);
        }
        return max;
    }
}
```

```typescript
function networkDelayTime(times: number[][], n: number, k: number): number {
    const adj: [number, number][][] = Array.from({length: n+1}, () => []);
    for (const [u, v, w] of times) adj[u].push([v, w]);

    const dist = new Array(n+1).fill(Infinity);
    dist[k] = 0;
    // Min-heap: [distance, node]
    const pq: [number, number][] = [[0, k]];

    while (pq.length > 0) {
        pq.sort((a,b) => a[0]-b[0]);  // Note: use a proper heap in production
        const [d, u] = pq.shift()!;
        if (d > dist[u]) continue;
        for (const [v, w] of adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push([dist[v], v]);
            }
        }
    }

    const max = Math.max(...dist.slice(1));
    return max === Infinity ? -1 : max;
}
```

```python
import heapq

class Solution:
    def networkDelayTime(self, times: list[list[int]], n: int, k: int) -> int:
        adj: dict[int, list[tuple[int, int]]] = {i: [] for i in range(1, n+1)}
        for u, v, w in times:
            adj[u].append((v, w))

        dist = {i: float('inf') for i in range(1, n+1)}
        dist[k] = 0
        min_heap = [(0, k)]  # (distance, node)

        while min_heap:
            d, u = heapq.heappop(min_heap)
            if d > dist[u]:
                continue  # stale entry
            for v, w in adj[u]:
                if dist[u] + w < dist[v]:
                    dist[v] = dist[u] + w
                    heapq.heappush(min_heap, (dist[v], v))

        max_dist = max(dist.values())
        return max_dist if max_dist != float('inf') else -1
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

func networkDelayTime(times [][]int, n int, k int) int {
    adj := make([][][2]int, n+1)
    for _, t := range times { adj[t[0]] = append(adj[t[0]], [2]int{t[1], t[2]}) }

    dist := make([]int, n+1)
    for i := range dist { dist[i] = 1<<31 - 1 }
    dist[k] = 0

    pq := &MinHeap{{0, k}}
    heap.Init(pq)

    for pq.Len() > 0 {
        item := heap.Pop(pq).(Item)
        if item.dist > dist[item.node] { continue }
        for _, edge := range adj[item.node] {
            v, w := edge[0], edge[1]
            if dist[item.node]+w < dist[v] {
                dist[v] = dist[item.node] + w
                heap.Push(pq, Item{dist[v], v})
            }
        }
    }

    maxDist := 0
    for i := 1; i <= n; i++ {
        if dist[i] == 1<<31-1 { return -1 }
        if dist[i] > maxDist { maxDist = dist[i] }
    }
    return maxDist
}
```

## Complexity

- **Time:** O((V + E) log V) — each node and edge processed once; heap operations are log V
- **Space:** O(V + E) — adjacency list + distance array + heap

## Key Interview Insights

- **Answer = `max(dist[1..n])`.** The last node to receive the signal determines the total delay.
- **If any node is unreachable, return -1.** Check if `max(dist) == infinity` after running Dijkstra.
- **The "stale entry" check `if d > dist[u]: continue` is essential.** Without it, you re-process nodes with outdated distances. This is standard lazy deletion for Dijkstra with a binary heap.
- **Nodes are 1-indexed.** Be careful with array sizing (`n+1`) and iteration (`1` to `n` inclusive).
- **Bellman-Ford alternative:** Works with negative weights, but this problem only has non-negative weights so Dijkstra is optimal.
