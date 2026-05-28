---
title: Queue
description: Queue data structure — concepts, operations, patterns, and interview techniques
---

# Queue

A queue is a **First-In, First-Out (FIFO)** data structure. Think of a checkout line: the first person in is the first person served.

Queues appear in **BFS traversal**, **level-order tree processing**, **task scheduling**, and any problem where order of arrival matters.

## Core Operations

| Operation | Description | Time |
|---|---|---|
| `enqueue(x)` / `offer(x)` | Add to back | O(1) |
| `dequeue()` / `poll()` | Remove from front | O(1) |
| `peek()` / `front()` | View front without removing | O(1) |
| `isEmpty()` | Check if empty | O(1) |
| `size()` | Number of elements | O(1) |

## When to Use a Queue

Reach for a queue when you see:

- **BFS / level-order traversal** — explore by distance, level by level
- **Processing in arrival order** — task queues, event queues
- **Sliding window** — when you need O(1) dequeue from front (use Deque for this)
- **"Minimum steps"** problems — shortest path in an unweighted graph

## Stack vs Queue

| Property | Stack (LIFO) | Queue (FIFO) |
|---|---|---|
| Add | Top (push) | Back (enqueue) |
| Remove | Top (pop) | Front (dequeue) |
| Traversal | DFS | BFS |
| Use case | "Most recent" | "Oldest first" |

## Implementation

```cpp
#include <queue>
queue<int> q;
q.push(1);    // enqueue
q.push(2);
int front = q.front();  // 1
q.pop();                // removes 1
bool empty = q.empty();
```

```java
Queue<Integer> queue = new LinkedList<>();
// Or for pure queue use: new ArrayDeque<>()
queue.offer(1);    // enqueue
queue.offer(2);
int front = queue.peek();   // 1
queue.poll();               // removes 1
boolean empty = queue.isEmpty();
```

```typescript
// Use an array as a queue (note: shift() is O(n) — use a proper deque for performance-sensitive code)
const queue: number[] = [];
queue.push(1);   // enqueue
queue.push(2);
const front = queue[0];   // peek
queue.shift();            // dequeue
const empty = queue.length === 0;
```

```python
from collections import deque
queue = deque()
queue.append(1)     # enqueue
queue.append(2)
front = queue[0]    # peek
queue.popleft()     # dequeue O(1)
empty = len(queue) == 0
```

```go
// Use a slice as a queue
queue := []int{}
queue = append(queue, 1)  // enqueue
queue = append(queue, 2)
front := queue[0]         // peek
queue = queue[1:]         // dequeue
empty := len(queue) == 0
```

> **Python tip:** Always use `collections.deque` for queues, not a plain list. `list.pop(0)` is O(n); `deque.popleft()` is O(1).

> **TypeScript/JS tip:** Array `shift()` is O(n). For performance-critical code, implement a proper circular buffer or use a library. For interviews, `shift()` is acceptable.

## BFS Template

This is the most important queue pattern in interviews:

```cpp
void bfs(vector<vector<int>>& graph, int start) {
    queue<int> q;
    vector<bool> visited(graph.size(), false);
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}
```

```java
void bfs(List<List<Integer>> graph, int start) {
    Queue<Integer> queue = new ArrayDeque<>();
    boolean[] visited = new boolean[graph.size()];
    queue.offer(start);
    visited[start] = true;
    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.offer(neighbor);
            }
        }
    }
}
```

```typescript
function bfs(graph: number[][], start: number): void {
    const queue = [start];
    const visited = new Set([start]);
    while (queue.length > 0) {
        const node = queue.shift()!;
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
}
```

```python
from collections import deque

def bfs(graph: list[list[int]], start: int) -> None:
    queue = deque([start])
    visited = {start}
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

```go
func bfs(graph [][]int, start int) {
    queue := []int{start}
    visited := make([]bool, len(graph))
    visited[start] = true
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        for _, neighbor := range graph[node] {
            if !visited[neighbor] {
                visited[neighbor] = true
                queue = append(queue, neighbor)
            }
        }
    }
}
```

## Level-Order BFS Template

When you need to process the tree **level by level**, track the size at each step:

```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level;
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }
    return result;
}
```

```java
List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}
```

```typescript
function levelOrder(root: TreeNode | null): number[][] {
    const result: number[][] = [];
    if (!root) return result;
    const queue: TreeNode[] = [root];
    while (queue.length > 0) {
        const levelSize = queue.length;
        const level: number[] = [];
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift()!;
            level.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(level);
    }
    return result;
}
```

```python
from collections import deque

def level_order(root) -> list[list[int]]:
    result = []
    if not root:
        return result
    queue = deque([root])
    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result
```

```go
func levelOrder(root *TreeNode) [][]int {
    result := [][]int{}
    if root == nil { return result }
    queue := []*TreeNode{root}
    for len(queue) > 0 {
        levelSize := len(queue)
        level := []int{}
        for i := 0; i < levelSize; i++ {
            node := queue[0]
            queue = queue[1:]
            level = append(level, node.Val)
            if node.Left != nil { queue = append(queue, node.Left) }
            if node.Right != nil { queue = append(queue, node.Right) }
        }
        result = append(result, level)
    }
    return result
}
```

## Edge Cases

- **Empty queue** — always guard `!isEmpty()` before peek/poll
- **Visited set** — always mark visited *before* enqueuing (not after dequeuing) to prevent duplicate processing in BFS
- **Disconnected graph** — BFS from one source may not reach all nodes
- **Single-node graph** — handle trivially; don't assume the loop runs at least once

## Interview Patterns Table

| Pattern | Trigger Words | Approach |
|---|---|---|
| BFS shortest path | "minimum steps", "shortest path" | Queue + visited set |
| Level order | "level by level", "tree levels" | Queue + levelSize snapshot |
| Multi-source BFS | "walls and gates", "rotten oranges" | Seed all sources into queue first |
| Circular queue | "design a queue with fixed size" | Array + head/tail pointers |
| Queue via stacks | "implement queue using stacks" | Two stacks (see below) |

## Implement Queue Using Two Stacks (Classic)

Push to `s1`. For dequeue, if `s2` is empty, pour all of `s1` into `s2` — this reverses order. Then pop from `s2`.

```
s1 (input)    s2 (output)
[3, 2, 1] →  empty
             pour s1 into s2:
              [1, 2, 3]
             pop → 1 (FIFO order ✓)
```

Amortized O(1) per operation. Each element is pushed once and popped once across both stacks.

