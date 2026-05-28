---
title: Clone Graph
difficulty: Medium
tags: [Graph, DFS, BFS, Hash Map]
link: https://leetcode.com/problems/clone-graph/
---

# Clone Graph

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [133. Clone Graph](https://leetcode.com/problems/clone-graph/) |
| **Tags** | Graph, DFS, BFS, Hash Map |

## Problem Statement

Given a reference to a node in a **connected undirected graph**, return a **deep copy** of the graph. Each node has a value and a list of neighbors.

```
class Node {
    int val;
    List<Node> neighbors;
}
```

## Intuition

The core challenge: when you clone node A which points to node B, and then clone B which points back to A — you must return the *same clone of A*, not create a new copy.

**Solution:** Use a hash map from original node → cloned node. Before cloning a node's neighbors, check if the clone already exists. If yes, reuse it. This prevents infinite loops and duplicate nodes.

## Approach: DFS with Memoization

For each node, create its clone if not already created, then recursively clone all neighbors.

```cpp
class Solution {
    unordered_map<Node*, Node*> cloneMap;
public:
    Node* cloneGraph(Node* node) {
        if (!node) return nullptr;
        if (cloneMap.count(node)) return cloneMap[node];  // already cloned

        Node* clone = new Node(node->val);
        cloneMap[node] = clone;  // register BEFORE recursing to handle cycles

        for (Node* neighbor : node->neighbors)
            clone->neighbors.push_back(cloneGraph(neighbor));
        return clone;
    }
};
```

```java
class Solution {
    private Map<Node, Node> cloneMap = new HashMap<>();
    public Node cloneGraph(Node node) {
        if (node == null) return null;
        if (cloneMap.containsKey(node)) return cloneMap.get(node);

        Node clone = new Node(node.val);
        cloneMap.put(node, clone);  // register before recursing

        for (Node neighbor : node.neighbors)
            clone.neighbors.add(cloneGraph(neighbor));
        return clone;
    }
}
```

```typescript
function cloneGraph(node: _Node | null): _Node | null {
    if (!node) return null;
    const map = new Map<_Node, _Node>();

    function dfs(n: _Node): _Node {
        if (map.has(n)) return map.get(n)!;
        const clone = new _Node(n.val);
        map.set(n, clone);
        for (const neighbor of n.neighbors)
            clone.neighbors.push(dfs(neighbor));
        return clone;
    }
    return dfs(node);
}
```

```python
class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        if not node:
            return None
        clone_map: dict['Node', 'Node'] = {}

        def dfs(n: 'Node') -> 'Node':
            if n in clone_map:
                return clone_map[n]
            clone = Node(n.val)
            clone_map[n] = clone    # register BEFORE recursing (handles cycles)
            for neighbor in n.neighbors:
                clone.neighbors.append(dfs(neighbor))
            return clone

        return dfs(node)
```

```go
func cloneGraph(node *Node) *Node {
    if node == nil { return nil }
    cloneMap := map[*Node]*Node{}

    var dfs func(*Node) *Node
    dfs = func(n *Node) *Node {
        if clone, ok := cloneMap[n]; ok { return clone }
        clone := &Node{Val: n.Val}
        cloneMap[n] = clone  // register before recursing
        for _, neighbor := range n.Neighbors {
            clone.Neighbors = append(clone.Neighbors, dfs(neighbor))
        }
        return clone
    }
    return dfs(node)
}
```

## Approach 2: BFS

BFS alternative — create clones layer by layer.

```cpp
Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    unordered_map<Node*, Node*> cloneMap;
    cloneMap[node] = new Node(node->val);
    queue<Node*> q;
    q.push(node);
    while (!q.empty()) {
        Node* curr = q.front(); q.pop();
        for (Node* nb : curr->neighbors) {
            if (!cloneMap.count(nb)) { cloneMap[nb] = new Node(nb->val); q.push(nb); }
            cloneMap[curr]->neighbors.push_back(cloneMap[nb]);
        }
    }
    return cloneMap[node];
}
```

```java
Node cloneGraph(Node node) {
    if (node == null) return null;
    Map<Node, Node> cloneMap = new HashMap<>();
    cloneMap.put(node, new Node(node.val));
    Queue<Node> q = new LinkedList<>();
    q.offer(node);
    while (!q.isEmpty()) {
        Node curr = q.poll();
        for (Node nb : curr.neighbors) {
            if (!cloneMap.containsKey(nb)) { cloneMap.put(nb, new Node(nb.val)); q.offer(nb); }
            cloneMap.get(curr).neighbors.add(cloneMap.get(nb));
        }
    }
    return cloneMap.get(node);
}
```

```typescript
function cloneGraph(node: _Node | null): _Node | null {
    if (!node) return null;
    const cloneMap = new Map<_Node, _Node>();
    cloneMap.set(node, new _Node(node.val));
    const q: _Node[] = [node];
    while (q.length > 0) {
        const curr = q.shift()!;
        for (const nb of curr.neighbors) {
            if (!cloneMap.has(nb)) { cloneMap.set(nb, new _Node(nb.val)); q.push(nb); }
            cloneMap.get(curr)!.neighbors.push(cloneMap.get(nb)!);
        }
    }
    return cloneMap.get(node)!;
}
```

```python
from collections import deque

class Solution:
    def cloneGraph(self, node: 'Node') -> 'Node':
        if not node:
            return None
        clone_map = {node: Node(node.val)}
        q = deque([node])

        while q:
            curr = q.popleft()
            for neighbor in curr.neighbors:
                if neighbor not in clone_map:
                    clone_map[neighbor] = Node(neighbor.val)
                    q.append(neighbor)
                clone_map[curr].neighbors.append(clone_map[neighbor])

        return clone_map[node]
```

```go
func cloneGraph(node *Node) *Node {
    if node == nil { return nil }
    cloneMap := map[*Node]*Node{}
    cloneMap[node] = &Node{Val: node.Val}
    q := []*Node{node}
    for len(q) > 0 {
        curr := q[0]; q = q[1:]
        for _, nb := range curr.Neighbors {
            if _, ok := cloneMap[nb]; !ok { cloneMap[nb] = &Node{Val: nb.Val}; q = append(q, nb) }
            cloneMap[curr].Neighbors = append(cloneMap[curr].Neighbors, cloneMap[nb])
        }
    }
    return cloneMap[node]
}
```

## Dry Run

```
Original: 1 — 2
          |   |
          4 — 3

Start DFS at 1:
- Create clone(1), register in map
- DFS neighbor 2:
  - Create clone(2), register in map
  - DFS neighbor 1 → already in map → return clone(1) ✓
  - DFS neighbor 3:
    - Create clone(3), register
    - DFS neighbor 2 → map → clone(2) ✓
    - DFS neighbor 4:
      - Create clone(4), register
      - DFS neighbor 1 → map → clone(1) ✓
      - DFS neighbor 3 → map → clone(3) ✓
```

No node is created twice. The map handles all back-edges.

## Complexity

- **Time:** O(V + E) — each node and edge visited once
- **Space:** O(V) — hash map stores one entry per node

## Key Interview Insights

- **Register the clone BEFORE recursing into neighbors.** This is the critical invariant. Without it, cycles cause infinite recursion.
- **The hash map is the memoization cache.** It serves two purposes: detecting already-visited nodes AND storing the mapping from original → clone.
- **This pattern generalizes:** Any deep-copy problem with shared references (e.g., copy linked list with random pointers) uses the same "map original → copy, recurse" approach.
