---
title: Course Schedule II
difficulty: Medium
tags: [Graph, Topological Sort, BFS, DFS]
link: https://leetcode.com/problems/course-schedule-ii/
---

# Course Schedule II

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) |
| **Tags** | Graph, Topological Sort, BFS, DFS |

## Problem Statement

There are `numCourses` courses labeled `0` to `numCourses-1`. Given `prerequisites[i] = [a, b]` (must take b before a), return a valid ordering in which to take all courses. Return an empty array if impossible.

## Intuition

This is exactly **topological sort**. A valid course ordering = a valid topological order of the prerequisite DAG. If the graph has a cycle, no valid order exists. Kahn's BFS naturally produces the topological order as it processes nodes — just collect each dequeued node.

## Approach: Kahn's BFS (Optimal)

Build in-degree array and adjacency list. Queue all zero in-degree nodes. Repeatedly dequeue, collect into result, and decrement neighbors' in-degrees. If result has all n courses → valid order. Otherwise → cycle.

```cpp
class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indegree(numCourses, 0);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            indegree[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.push(i);

        vector<int> order;
        while (!q.empty()) {
            int course = q.front(); q.pop();
            order.push_back(course);
            for (int next : adj[course])
                if (--indegree[next] == 0) q.push(next);
        }
        return (int)order.size() == numCourses ? order : vector<int>{};
    }
};
```

```java
class Solution {
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); indegree[p[0]]++; }

        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.offer(i);

        int[] order = new int[numCourses];
        int idx = 0;
        while (!q.isEmpty()) {
            int course = q.poll();
            order[idx++] = course;
            for (int next : adj.get(course))
                if (--indegree[next] == 0) q.offer(next);
        }
        return idx == numCourses ? order : new int[]{};
    }
}
```

```typescript
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
    const adj: number[][] = Array.from({length: numCourses}, () => []);
    const indegree = new Array(numCourses).fill(0);
    for (const [a, b] of prerequisites) { adj[b].push(a); indegree[a]++; }

    const q: number[] = [];
    for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) q.push(i);

    const order: number[] = [];
    let head = 0;
    while (head < q.length) {
        const course = q[head++];
        order.push(course);
        for (const next of adj[course])
            if (--indegree[next] === 0) q.push(next);
    }
    return order.length === numCourses ? order : [];
}
```

```python
from collections import deque

class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        adj = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for a, b in prerequisites:
            adj[b].append(a)
            indegree[a] += 1

        q = deque(i for i in range(numCourses) if indegree[i] == 0)
        order = []
        while q:
            course = q.popleft()
            order.append(course)
            for nxt in adj[course]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    q.append(nxt)
        return order if len(order) == numCourses else []
```

```go
func findOrder(numCourses int, prerequisites [][]int) []int {
    adj := make([][]int, numCourses)
    indegree := make([]int, numCourses)
    for _, p := range prerequisites { adj[p[1]] = append(adj[p[1]], p[0]); indegree[p[0]]++ }

    q := []int{}
    for i := 0; i < numCourses; i++ { if indegree[i] == 0 { q = append(q, i) } }

    order := []int{}
    for len(q) > 0 {
        course := q[0]; q = q[1:]
        order = append(order, course)
        for _, next := range adj[course] {
            indegree[next]--
            if indegree[next] == 0 { q = append(q, next) }
        }
    }
    if len(order) == numCourses { return order }
    return []int{}
}
```

## Approach 2: DFS (Post-Order)

DFS post-order gives reverse topological order. Collect post-order nodes, then reverse for the final answer.

```cpp
class Solution {
    vector<int> state, order;
    bool dfs(vector<vector<int>>& adj, int node) {
        if (state[node] == 1) return false;
        if (state[node] == 2) return true;
        state[node] = 1;
        for (int nxt : adj[node]) if (!dfs(adj, nxt)) return false;
        state[node] = 2; order.push_back(node); return true;
    }
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        for (auto& p : prerequisites) adj[p[1]].push_back(p[0]);
        state.assign(numCourses, 0);
        for (int i = 0; i < numCourses; i++)
            if (state[i] == 0 && !dfs(adj, i)) return {};
        reverse(order.begin(), order.end());
        return order;
    }
};
```

```java
class Solution {
    int[] state; List<Integer> order = new ArrayList<>(); List<List<Integer>> adj;
    boolean dfs(int node) {
        if (state[node] == 1) return false;
        if (state[node] == 2) return true;
        state[node] = 1;
        for (int nxt : adj.get(node)) if (!dfs(nxt)) return false;
        state[node] = 2; order.add(node); return true;
    }
    public int[] findOrder(int numCourses, int[][] prerequisites) {
        adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);
        state = new int[numCourses];
        for (int i = 0; i < numCourses; i++) if (state[i] == 0 && !dfs(i)) return new int[]{};
        Collections.reverse(order);
        return order.stream().mapToInt(Integer::intValue).toArray();
    }
}
```

```typescript
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
    const adj: number[][] = Array.from({length: numCourses}, () => []);
    for (const [a, b] of prerequisites) adj[b].push(a);
    const state = new Array(numCourses).fill(0);
    const order: number[] = [];
    function dfs(node: number): boolean {
        if (state[node] === 1) return false;
        if (state[node] === 2) return true;
        state[node] = 1;
        for (const nxt of adj[node]) if (!dfs(nxt)) return false;
        state[node] = 2; order.push(node); return true;
    }
    for (let i = 0; i < numCourses; i++) if (state[i] === 0 && !dfs(i)) return [];
    return order.reverse();
}
```

```python
class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        adj = [[] for _ in range(numCourses)]
        for a, b in prerequisites:
            adj[b].append(a)

        state = [0] * numCourses  # 0=unvisited, 1=visiting, 2=done
        order = []

        def dfs(node: int) -> bool:
            if state[node] == 1: return False  # cycle
            if state[node] == 2: return True   # safe
            state[node] = 1
            for nxt in adj[node]:
                if not dfs(nxt): return False
            state[node] = 2
            order.append(node)  # post-order
            return True

        for i in range(numCourses):
            if state[i] == 0 and not dfs(i):
                return []
        return order[::-1]  # reverse post-order = topological order
```

```go
func findOrder(numCourses int, prerequisites [][]int) []int {
    adj := make([][]int, numCourses)
    for _, p := range prerequisites { adj[p[1]] = append(adj[p[1]], p[0]) }
    state := make([]int, numCourses)
    var order []int
    var dfs func(int) bool
    dfs = func(node int) bool {
        if state[node] == 1 { return false }
        if state[node] == 2 { return true }
        state[node] = 1
        for _, nxt := range adj[node] { if !dfs(nxt) { return false } }
        state[node] = 2; order = append(order, node); return true
    }
    for i := 0; i < numCourses; i++ { if state[i] == 0 && !dfs(i) { return nil } }
    for l, r := 0, len(order)-1; l < r; l, r = l+1, r-1 { order[l], order[r] = order[r], order[l] }
    return order
}
```

## Complexity

- **Time:** O(V + E) — Kahn's BFS processes each node and edge once
- **Space:** O(V + E) — adjacency list and in-degree array

## Key Interview Insights

- **This is Course Schedule I with the order collected.** The only change: collect each dequeued node into a result list.
- **Kahn's vs DFS:** Kahn's gives the order naturally in BFS sequence. DFS requires reversing the post-order. Kahn's is preferred for returning an actual topological order.
- **Multiple valid orders exist.** The answer isn't unique. The specific order you get depends on which zero-in-degree node you start with.
- **This pattern appears in:** Build systems (Makefile), package dependency resolution, task scheduling, any problem with dependencies.
