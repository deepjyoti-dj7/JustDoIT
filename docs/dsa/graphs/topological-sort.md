---
title: Topological Sort
description: Ordering nodes of a DAG so all edges point forward — Kahn's BFS and DFS post-order approaches
---

# Topological Sort

Topological sort orders nodes of a **Directed Acyclic Graph (DAG)** such that for every directed edge u → v, u appears before v in the ordering. It's the algorithm behind dependency resolution, build systems, course scheduling, and task ordering.

> **Key constraint:** Only works on DAGs. If the graph has a cycle, no valid topological order exists.

## Core Intuition

Think of a topological order as a valid "schedule." If course A must be taken before course B, A appears before B. Multiple valid orderings may exist.

```
Graph:
A → C → E
B → C
B → D → E

Valid topological orders:
A, B, C, D, E
B, A, C, D, E
B, D, A, C, E
```

## Approach 1: Kahn's Algorithm (BFS)

**Intuition:** Nodes with no incoming edges can be scheduled first. Process them, remove their outgoing edges, then find the next batch of zero-in-degree nodes.

**Algorithm:**
1. Build adjacency list + compute in-degree of each node
2. Initialize queue with all nodes of in-degree 0
3. Pop a node → add to result → decrement in-degree of its neighbors
4. If a neighbor's in-degree drops to 0, add it to the queue
5. If result contains all n nodes → valid order. Else → cycle exists.

```cpp
#include <queue>
#include <vector>
using namespace std;

vector<int> topoSortKahn(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    vector<int> indegree(n, 0);
    for (auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        indegree[e[1]]++;
    }
    queue<int> q;
    for (int i = 0; i < n; i++) if (indegree[i] == 0) q.push(i);
    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int neighbor : adj[node]) {
            if (--indegree[neighbor] == 0) q.push(neighbor);
        }
    }
    return order.size() == n ? order : {};  // empty = cycle
}
```

```java
import java.util.*;

int[] topoSortKahn(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    int[] indegree = new int[n];
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); indegree[e[1]]++; }

    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < n; i++) if (indegree[i] == 0) q.offer(i);

    int[] order = new int[n];
    int idx = 0;
    while (!q.isEmpty()) {
        int node = q.poll();
        order[idx++] = node;
        for (int neighbor : adj.get(node))
            if (--indegree[neighbor] == 0) q.offer(neighbor);
    }
    return idx == n ? order : new int[]{};
}
```

```typescript
function topoSortKahn(n: number, edges: number[][]): number[] {
    const adj: number[][] = Array.from({length: n}, () => []);
    const indegree = new Array(n).fill(0);
    for (const [u, v] of edges) { adj[u].push(v); indegree[v]++; }

    const q: number[] = [];
    for (let i = 0; i < n; i++) if (indegree[i] === 0) q.push(i);

    const order: number[] = [];
    let head = 0;
    while (head < q.length) {
        const node = q[head++];
        order.push(node);
        for (const neighbor of adj[node])
            if (--indegree[neighbor] === 0) q.push(neighbor);
    }
    return order.length === n ? order : [];
}
```

```python
from collections import deque

def topo_sort_kahn(n: int, edges: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(n)]
    indegree = [0] * n
    for u, v in edges:
        adj[u].append(v)
        indegree[v] += 1

    q = deque(i for i in range(n) if indegree[i] == 0)
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for neighbor in adj[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                q.append(neighbor)
    return order if len(order) == n else []  # empty = cycle
```

```go
func topoSortKahn(n int, edges [][]int) []int {
    adj := make([][]int, n)
    indegree := make([]int, n)
    for _, e := range edges { adj[e[0]] = append(adj[e[0]], e[1]); indegree[e[1]]++ }

    q := []int{}
    for i := 0; i < n; i++ { if indegree[i] == 0 { q = append(q, i) } }

    order := []int{}
    for len(q) > 0 {
        node := q[0]; q = q[1:]
        order = append(order, node)
        for _, neighbor := range adj[node] {
            indegree[neighbor]--
            if indegree[neighbor] == 0 { q = append(q, neighbor) }
        }
    }
    if len(order) == n { return order }
    return nil
}
```

## Approach 2: DFS Post-Order

**Intuition:** Run DFS. After fully exploring a node (all its descendants are done), add it to the front of the result. This gives reverse finishing order = topological order.

```cpp
void dfsTopoSort(vector<vector<int>>& adj, int node, vector<bool>& visited, vector<int>& result) {
    visited[node] = true;
    for (int neighbor : adj[node])
        if (!visited[neighbor]) dfsTopoSort(adj, neighbor, visited, result);
    result.push_back(node);  // post-order: add after all descendants
}

vector<int> topoSortDFS(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) adj[e[0]].push_back(e[1]);
    vector<bool> visited(n, false);
    vector<int> result;
    for (int i = 0; i < n; i++)
        if (!visited[i]) dfsTopoSort(adj, i, visited, result);
    reverse(result.begin(), result.end());
    return result;
}
```

```java
void dfs(List<List<Integer>> adj, int node, boolean[] visited, List<Integer> result) {
    visited[node] = true;
    for (int neighbor : adj.get(node))
        if (!visited[neighbor]) dfs(adj, neighbor, visited, result);
    result.add(node);
}

List<Integer> topoSortDFS(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) adj.get(e[0]).add(e[1]);
    boolean[] visited = new boolean[n];
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < n; i++) if (!visited[i]) dfs(adj, i, visited, result);
    Collections.reverse(result);
    return result;
}
```

```typescript
function topoSortDFS(n: number, edges: number[][]): number[] {
    const adj: number[][] = Array.from({length: n}, () => []);
    for (const [u, v] of edges) adj[u].push(v);
    const visited = new Array(n).fill(false);
    const result: number[] = [];

    function dfs(node: number) {
        visited[node] = true;
        for (const neighbor of adj[node])
            if (!visited[neighbor]) dfs(neighbor);
        result.push(node);
    }

    for (let i = 0; i < n; i++) if (!visited[i]) dfs(i);
    return result.reverse();
}
```

```python
def topo_sort_dfs(n: int, edges: list[list[int]]) -> list[int]:
    adj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
    visited = [False] * n
    result = []

    def dfs(node: int) -> None:
        visited[node] = True
        for neighbor in adj[node]:
            if not visited[neighbor]:
                dfs(neighbor)
        result.append(node)  # post-order

    for i in range(n):
        if not visited[i]:
            dfs(i)
    return result[::-1]  # reverse for topological order
```

```go
func topoSortDFS(n int, edges [][]int) []int {
    adj := make([][]int, n)
    for _, e := range edges { adj[e[0]] = append(adj[e[0]], e[1]) }
    visited := make([]bool, n)
    result := []int{}

    var dfs func(int)
    dfs = func(node int) {
        visited[node] = true
        for _, neighbor := range adj[node] {
            if !visited[neighbor] { dfs(neighbor) }
        }
        result = append(result, node)
    }

    for i := 0; i < n; i++ { if !visited[i] { dfs(i) } }
    // reverse
    for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 {
        result[i], result[j] = result[j], result[i]
    }
    return result
}
```

## Kahn's vs DFS

| | Kahn's BFS | DFS Post-Order |
|---|---|---|
| **Cycle detection** | Built-in (check `len(order) == n`) | Need 3-color state separately |
| **Ordering intuition** | Level-by-level, processes "ready" nodes | Post-order reversal |
| **Code simplicity** | Slightly more setup (in-degree array) | Cleaner recursion |
| **Prefer when** | Need to detect cycles OR find "available" nodes | Simpler traversal code |

## Identifying Topological Sort Problems

Problems that need topological sort often disguise themselves:
- "Can all courses be finished?" → detect cycle in prerequisite DAG
- "Find a valid build order" → topological sort of dependency graph
- "Sequence reconstruction" → check if unique topological order exists
- "Alien dictionary" → build char ordering from word comparisons, then topo sort

## Complexity

| | Time | Space |
|---|---|---|
| Kahn's BFS | O(V + E) | O(V + E) |
| DFS post-order | O(V + E) | O(V + E) |

## Key Interview Insights

- **Kahn's is safer in interviews** — cycle detection is built-in and the iterative BFS is easier to debug.
- **"Can all tasks be completed?" = "Is this a DAG?" = Kahn's BFS where `len(result) == n`.**
- **In-degree 0 = safe to process.** This is the key insight of Kahn's — any node with no dependencies can go first.
- **Multiple valid orderings exist** for most graphs. If the problem asks for any valid order, either approach works. If it asks for lexicographically smallest, use a min-heap instead of a regular queue in Kahn's.
