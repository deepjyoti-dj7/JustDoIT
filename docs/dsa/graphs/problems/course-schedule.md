---
title: Course Schedule
difficulty: Medium
tags: [Graph, Topological Sort, Cycle Detection, DFS, BFS]
link: https://leetcode.com/problems/course-schedule/
---

# Course Schedule

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [207. Course Schedule](https://leetcode.com/problems/course-schedule/) |
| **Tags** | Graph, Topological Sort, Cycle Detection |

## Problem Statement

There are `numCourses` courses labeled `0` to `numCourses-1`. Given `prerequisites[i] = [a, b]` (must take b before a), return `true` if you can finish all courses.

## Intuition

This is a **cycle detection in a directed graph** problem. Build a directed graph where each prerequisite pair `[a, b]` becomes an edge `b → a`. If this graph has a cycle, it's impossible to complete all courses (circular dependency). Otherwise, a valid topological order exists → return true.

## Approach 1: Kahn's BFS (Topological Sort)

If Kahn's algorithm processes all n nodes → no cycle → return true. If stuck (remaining nodes with in-degree > 0) → cycle → return false.

```cpp
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        vector<int> indegree(numCourses, 0);
        for (auto& p : prerequisites) {
            adj[p[1]].push_back(p[0]);
            indegree[p[0]]++;
        }
        queue<int> q;
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.push(i);
        int processed = 0;
        while (!q.empty()) {
            int course = q.front(); q.pop(); processed++;
            for (int next : adj[course])
                if (--indegree[next] == 0) q.push(next);
        }
        return processed == numCourses;
    }
};
```

```java
class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        int[] indegree = new int[numCourses];
        for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); indegree[p[0]]++; }

        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.offer(i);
        int processed = 0;
        while (!q.isEmpty()) {
            int course = q.poll(); processed++;
            for (int next : adj.get(course))
                if (--indegree[next] == 0) q.offer(next);
        }
        return processed == numCourses;
    }
}
```

```typescript
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    const adj: number[][] = Array.from({length: numCourses}, () => []);
    const indegree = new Array(numCourses).fill(0);
    for (const [a, b] of prerequisites) { adj[b].push(a); indegree[a]++; }

    const q: number[] = [];
    for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) q.push(i);

    let processed = 0, head = 0;
    while (head < q.length) {
        const course = q[head++]; processed++;
        for (const next of adj[course])
            if (--indegree[next] === 0) q.push(next);
    }
    return processed === numCourses;
}
```

```python
from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        adj = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for a, b in prerequisites:
            adj[b].append(a)
            indegree[a] += 1

        q = deque(i for i in range(numCourses) if indegree[i] == 0)
        processed = 0
        while q:
            course = q.popleft()
            processed += 1
            for nxt in adj[course]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    q.append(nxt)
        return processed == numCourses
```

```go
func canFinish(numCourses int, prerequisites [][]int) bool {
    adj := make([][]int, numCourses)
    indegree := make([]int, numCourses)
    for _, p := range prerequisites { adj[p[1]] = append(adj[p[1]], p[0]); indegree[p[0]]++ }

    q := []int{}
    for i := 0; i < numCourses; i++ { if indegree[i] == 0 { q = append(q, i) } }
    processed := 0
    for len(q) > 0 {
        course := q[0]; q = q[1:]; processed++
        for _, next := range adj[course] {
            indegree[next]--
            if indegree[next] == 0 { q = append(q, next) }
        }
    }
    return processed == numCourses
}
```

## Approach 2: DFS with 3-State Cycle Detection

Use 3 states: 0 = unvisited, 1 = visiting (on current path), 2 = visited (safe).

```cpp
class Solution {
    vector<int> state;
    bool hasCycle(vector<vector<int>>& adj, int node) {
        if (state[node] == 1) return true;   // visiting → back edge → cycle
        if (state[node] == 2) return false;  // already confirmed safe
        state[node] = 1;
        for (int next : adj[node])
            if (hasCycle(adj, next)) return true;
        state[node] = 2;
        return false;
    }
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> adj(numCourses);
        for (auto& p : prerequisites) adj[p[1]].push_back(p[0]);
        state.assign(numCourses, 0);
        for (int i = 0; i < numCourses; i++)
            if (state[i] == 0 && hasCycle(adj, i)) return false;
        return true;
    }
};
```

```java
class Solution {
    int[] state; List<List<Integer>> adj;
    boolean hasCycle(int node) {
        if (state[node] == 1) return true;
        if (state[node] == 2) return false;
        state[node] = 1;
        for (int next : adj.get(node)) if (hasCycle(next)) return true;
        state[node] = 2; return false;
    }
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) adj.get(p[1]).add(p[0]);
        state = new int[numCourses];
        for (int i = 0; i < numCourses; i++) if (state[i] == 0 && hasCycle(i)) return false;
        return true;
    }
}
```

```typescript
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
    const adj: number[][] = Array.from({length: numCourses}, () => []);
    for (const [a, b] of prerequisites) adj[b].push(a);
    const state = new Array(numCourses).fill(0);
    function hasCycle(node: number): boolean {
        if (state[node] === 1) return true;
        if (state[node] === 2) return false;
        state[node] = 1;
        for (const next of adj[node]) if (hasCycle(next)) return true;
        state[node] = 2; return false;
    }
    for (let i = 0; i < numCourses; i++) if (state[i] === 0 && hasCycle(i)) return false;
    return true;
}
```

```python
class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        adj = [[] for _ in range(numCourses)]
        for a, b in prerequisites:
            adj[b].append(a)
        state = [0] * numCourses  # 0=unvisited, 1=visiting, 2=done

        def has_cycle(node: int) -> bool:
            if state[node] == 1: return True   # back edge
            if state[node] == 2: return False  # safe
            state[node] = 1
            for nxt in adj[node]:
                if has_cycle(nxt): return True
            state[node] = 2
            return False

        return not any(state[i] == 0 and has_cycle(i) for i in range(numCourses))
```

```go
func canFinish(numCourses int, prerequisites [][]int) bool {
    adj := make([][]int, numCourses)
    for _, p := range prerequisites { adj[p[1]] = append(adj[p[1]], p[0]) }
    state := make([]int, numCourses)
    var hasCycle func(int) bool
    hasCycle = func(node int) bool {
        if state[node] == 1 { return true }
        if state[node] == 2 { return false }
        state[node] = 1
        for _, next := range adj[node] { if hasCycle(next) { return true } }
        state[node] = 2; return false
    }
    for i := 0; i < numCourses; i++ { if state[i] == 0 && hasCycle(i) { return false } }
    return true
}
```

## Complexity

- **Time:** O(V + E) — V = numCourses, E = len(prerequisites)
- **Space:** O(V + E) — adjacency list + state/queue

## Key Interview Insights

- **"Can all tasks be completed?" = "Is the dependency graph a DAG?"**
- **Kahn's BFS is the cleaner choice** — cycle detection is a natural byproduct, and BFS is easier to debug than 3-state DFS.
- **Edge direction matters.** `[a, b]` means b → a (must take b before a). Getting this wrong gives wrong answers on edge cases.
- **Follow-up is Course Schedule II** — return the actual order instead of just true/false. Use the same Kahn's but collect the BFS order.
