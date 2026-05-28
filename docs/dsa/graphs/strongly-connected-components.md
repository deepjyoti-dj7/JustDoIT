---
title: Strongly Connected Components
description: Finding SCCs in directed graphs using Kosaraju's two-pass DFS algorithm
---

# Strongly Connected Components

A **Strongly Connected Component (SCC)** of a directed graph is a maximal set of vertices such that there's a path from every vertex to every other vertex in the set.

```
Graph:
0 → 1 → 2 → 0  (forms SCC: {0,1,2})
2 → 3           (3 is its own SCC: {3})
3 → 4 → 3       (forms SCC: {3,4}... wait, 3→4 and 4→3 → SCC: {3,4})
```

SCCs decompose a directed graph into its "strongly connected clusters." The condensation graph (DAG of SCCs) is always a DAG.

## Kosaraju's Algorithm (Two-Pass DFS)

**Intuition:** 
1. DFS on original graph — record finish order (post-order)
2. DFS on **reversed** graph — process nodes in reverse finish order

Each DFS in pass 2 that starts a new tree = one SCC.

**Why it works:** The node that finishes last in pass 1 is the "source" SCC. Reversing the graph keeps this node reachable from within its SCC but unreachable from other SCCs. So each new DFS start in pass 2 explores exactly one SCC.

```cpp
#include <vector>
#include <stack>
using namespace std;

void dfs1(int node, vector<vector<int>>& adj, vector<bool>& visited, stack<int>& finishStack) {
    visited[node] = true;
    for (int neighbor : adj[node])
        if (!visited[neighbor]) dfs1(neighbor, adj, visited, finishStack);
    finishStack.push(node);  // post-order: push after all descendants
}

void dfs2(int node, vector<vector<int>>& radj, vector<bool>& visited, vector<int>& component) {
    visited[node] = true;
    component.push_back(node);
    for (int neighbor : radj[node])
        if (!visited[neighbor]) dfs2(neighbor, radj, visited, component);
}

vector<vector<int>> kosaraju(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n), radj(n);
    for (auto& e : edges) {
        adj[e[0]].push_back(e[1]);
        radj[e[1]].push_back(e[0]);  // reversed edge
    }

    // Pass 1: DFS on original, record finish order
    vector<bool> visited(n, false);
    stack<int> finishStack;
    for (int i = 0; i < n; i++)
        if (!visited[i]) dfs1(i, adj, visited, finishStack);

    // Pass 2: DFS on reversed graph in reverse finish order
    fill(visited.begin(), visited.end(), false);
    vector<vector<int>> sccs;
    while (!finishStack.empty()) {
        int node = finishStack.top(); finishStack.pop();
        if (!visited[node]) {
            vector<int> component;
            dfs2(node, radj, visited, component);
            sccs.push_back(component);
        }
    }
    return sccs;
}
```

```java
import java.util.*;

void dfs1(int node, List<List<Integer>> adj, boolean[] visited, Deque<Integer> stack) {
    visited[node] = true;
    for (int neighbor : adj.get(node))
        if (!visited[neighbor]) dfs1(neighbor, adj, visited, stack);
    stack.push(node);
}

void dfs2(int node, List<List<Integer>> radj, boolean[] visited, List<Integer> comp) {
    visited[node] = true; comp.add(node);
    for (int neighbor : radj.get(node))
        if (!visited[neighbor]) dfs2(neighbor, radj, visited, comp);
}

List<List<Integer>> kosaraju(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>(), radj = new ArrayList<>();
    for (int i = 0; i < n; i++) { adj.add(new ArrayList<>()); radj.add(new ArrayList<>()); }
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); radj.get(e[1]).add(e[0]); }

    boolean[] visited = new boolean[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) if (!visited[i]) dfs1(i, adj, visited, stack);

    Arrays.fill(visited, false);
    List<List<Integer>> sccs = new ArrayList<>();
    while (!stack.isEmpty()) {
        int node = stack.pop();
        if (!visited[node]) {
            List<Integer> comp = new ArrayList<>();
            dfs2(node, radj, visited, comp);
            sccs.add(comp);
        }
    }
    return sccs;
}
```

```typescript
function kosaraju(n: number, edges: number[][]): number[][] {
    const adj: number[][] = Array.from({length: n}, () => []);
    const radj: number[][] = Array.from({length: n}, () => []);
    for (const [u, v] of edges) { adj[u].push(v); radj[v].push(u); }

    const visited = new Array(n).fill(false);
    const stack: number[] = [];

    function dfs1(node: number) {
        visited[node] = true;
        for (const nb of adj[node]) if (!visited[nb]) dfs1(nb);
        stack.push(node);
    }

    function dfs2(node: number, comp: number[]) {
        visited[node] = true; comp.push(node);
        for (const nb of radj[node]) if (!visited[nb]) dfs2(nb, comp);
    }

    for (let i = 0; i < n; i++) if (!visited[i]) dfs1(i);
    visited.fill(false);

    const sccs: number[][] = [];
    while (stack.length > 0) {
        const node = stack.pop()!;
        if (!visited[node]) {
            const comp: number[] = [];
            dfs2(node, comp);
            sccs.push(comp);
        }
    }
    return sccs;
}
```

```python
import sys
sys.setrecursionlimit(100000)

def kosaraju(n: int, edges: list[list[int]]) -> list[list[int]]:
    adj = [[] for _ in range(n)]
    radj = [[] for _ in range(n)]
    for u, v in edges:
        adj[u].append(v)
        radj[v].append(u)  # reversed

    visited = [False] * n
    finish_stack = []

    def dfs1(node: int) -> None:
        visited[node] = True
        for neighbor in adj[node]:
            if not visited[neighbor]:
                dfs1(neighbor)
        finish_stack.append(node)  # post-order

    def dfs2(node: int, comp: list[int]) -> None:
        visited[node] = True
        comp.append(node)
        for neighbor in radj[node]:
            if not visited[neighbor]:
                dfs2(neighbor, comp)

    for i in range(n):
        if not visited[i]:
            dfs1(i)

    visited[:] = [False] * n
    sccs = []
    while finish_stack:
        node = finish_stack.pop()
        if not visited[node]:
            comp = []
            dfs2(node, comp)
            sccs.append(comp)
    return sccs
```

```go
func kosaraju(n int, edges [][]int) [][]int {
    adj := make([][]int, n)
    radj := make([][]int, n)
    for _, e := range edges { adj[e[0]] = append(adj[e[0]], e[1]); radj[e[1]] = append(radj[e[1]], e[0]) }

    visited := make([]bool, n)
    stack := []int{}

    var dfs1 func(int)
    dfs1 = func(node int) {
        visited[node] = true
        for _, nb := range adj[node] { if !visited[nb] { dfs1(nb) } }
        stack = append(stack, node)
    }

    var dfs2 func(int, *[]int)
    dfs2 = func(node int, comp *[]int) {
        visited[node] = true; *comp = append(*comp, node)
        for _, nb := range radj[node] { if !visited[nb] { dfs2(nb, comp) } }
    }

    for i := 0; i < n; i++ { if !visited[i] { dfs1(i) } }
    for i := range visited { visited[i] = false }

    sccs := [][]int{}
    for len(stack) > 0 {
        node := stack[len(stack)-1]; stack = stack[:len(stack)-1]
        if !visited[node] {
            comp := []int{}
            dfs2(node, &comp)
            sccs = append(sccs, comp)
        }
    }
    return sccs
}
```

## When to Use SCCs

| Problem | How SCCs Help |
|---|---|
| Find all groups where everyone knows everyone else | Each SCC = one group |
| 2-SAT problems | SCCs on implication graph |
| Condensation DAG | SCCs as nodes, edges between SCCs |
| "Can A reach B in a directed graph?" | If same SCC → yes. Else, check condensation DAG. |

## Complexity

| | Time | Space |
|---|---|---|
| Kosaraju's | O(V + E) — two DFS passes | O(V + E) |
| Tarjan's | O(V + E) — single DFS pass | O(V + E) |

Tarjan's is slightly more efficient (one pass) but harder to implement. For interviews, Kosaraju's is clearer.

## Key Interview Insights

- **Two passes, opposite directions.** Pass 1 on original (record finish order), pass 2 on reversed (process in reverse finish order).
- **The finish stack gives you source SCCs last.** The last node pushed is the "root" of the source SCC — in the reversed graph, it can only reach its own SCC.
- **SCCs of directed graph form a DAG.** This condensation is always acyclic — useful for reasoning about reachability between SCCs.
- **Tarjan's algorithm** uses a single DFS with low-link values. More efficient but much harder to remember under pressure — Kosaraju's is safer in interviews.
