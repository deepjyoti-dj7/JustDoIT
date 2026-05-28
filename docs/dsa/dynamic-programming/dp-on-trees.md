---
title: DP on Trees
description: Dynamic programming where the structure is a tree — DFS + propagating answers up (or rerooting down)
---

# DP on Trees

Tree DP combines DFS traversal with dynamic programming. The key insight: a tree's recursive structure maps perfectly to DP. Subproblems are naturally the subtrees rooted at each node, and results propagate upward via post-order DFS.

## Core Pattern: Post-Order DFS DP

In tree DP, you almost always compute the DP value for a node **after** computing it for all children. This is post-order traversal — solve children first, then combine.

**Template:**
```
dp[node] = combine(dp[child1], dp[child2], ..., node's own value)
```

The combination function depends on the problem. Common ones: sum, max, min, product.

## Pattern 1: Subtree Size / Aggregation

**Problem:** For each node, compute some aggregate (sum, max, size) over its entire subtree.

**Example:** Count nodes in each subtree.

```cpp
vector<int> sz;
void dfs(vector<vector<int>>& adj, int node, int parent) {
    sz[node] = 1;
    for (int child : adj[node]) {
        if (child == parent) continue;
        dfs(adj, child, node);
        sz[node] += sz[child];
    }
}
```

```java
int[] sz;
void dfs(List<List<Integer>> adj, int node, int parent) {
    sz[node] = 1;
    for (int child : adj.get(node)) {
        if (child == parent) continue;
        dfs(adj, child, node);
        sz[node] += sz[child];
    }
}
```

```typescript
function buildSubtreeSize(adj: number[][], n: number): number[] {
    const sz = new Array(n).fill(1);
    function dfs(node: number, parent: number): void {
        for (const child of adj[node]) {
            if (child === parent) continue;
            dfs(child, node);
            sz[node] += sz[child];
        }
    }
    dfs(0, -1);
    return sz;
}
```

```python
def build_subtree_size(adj: list[list[int]], n: int) -> list[int]:
    sz = [1] * n
    def dfs(node: int, parent: int) -> None:
        for child in adj[node]:
            if child == parent: continue
            dfs(child, node)
            sz[node] += sz[child]
    dfs(0, -1)
    return sz
```

```go
func buildSubtreeSize(adj [][]int, n int) []int {
    sz := make([]int, n)
    for i := range sz { sz[i] = 1 }
    var dfs func(node, parent int)
    dfs = func(node, parent int) {
        for _, child := range adj[node] {
            if child == parent { continue }
            dfs(child, node)
            sz[node] += sz[child]
        }
    }
    dfs(0, -1)
    return sz
}
```

## Pattern 2: Maximum Path Sum (Diameter-Style)

**Problem:** Find the maximum sum path between any two nodes in the tree (the path does not need to pass through the root).

**Key insight:** Any path between two nodes passes through their lowest common ancestor. At each node, the best path either:
1. Stays in the subtree (goes down and comes back up through the node)
2. Passes through the current node, combining the two best downward paths

**State:** `dp[node]` = maximum gain from going down into node's subtree (one direction only)

**At each node:** Update global answer with `max(dp[left] + dp[right] + node.val)`

```cpp
int maxPathSum(TreeNode* root) {
    int result = INT_MIN;
    function<int(TreeNode*)> dfs = [&](TreeNode* node) -> int {
        if (!node) return 0;
        int left  = max(0, dfs(node->left));   // ignore negative paths
        int right = max(0, dfs(node->right));
        result = max(result, left + right + node->val);  // path through node
        return max(left, right) + node->val;             // best single-path gain
    };
    dfs(root);
    return result;
}
```

```java
int result = Integer.MIN_VALUE;
int maxPathSum(TreeNode root) {
    dfs(root);
    return result;
}
int dfs(TreeNode node) {
    if (node == null) return 0;
    int left  = Math.max(0, dfs(node.left));
    int right = Math.max(0, dfs(node.right));
    result = Math.max(result, left + right + node.val);
    return Math.max(left, right) + node.val;
}
```

```typescript
function maxPathSum(root: TreeNode | null): number {
    let result = -Infinity;
    function dfs(node: TreeNode | null): number {
        if (!node) return 0;
        const left  = Math.max(0, dfs(node.left));
        const right = Math.max(0, dfs(node.right));
        result = Math.max(result, left + right + node.val);
        return Math.max(left, right) + node.val;
    }
    dfs(root);
    return result;
}
```

```python
def maxPathSum(root) -> int:
    result = [float('-inf')]
    def dfs(node) -> int:
        if not node: return 0
        left  = max(0, dfs(node.left))
        right = max(0, dfs(node.right))
        result[0] = max(result[0], left + right + node.val)
        return max(left, right) + node.val
    dfs(root)
    return result[0]
```

```go
func maxPathSum(root *TreeNode) int {
    result := -1 << 31
    var dfs func(*TreeNode) int
    dfs = func(node *TreeNode) int {
        if node == nil { return 0 }
        left  := max(0, dfs(node.Left))
        right := max(0, dfs(node.Right))
        if v := left + right + node.Val; v > result { result = v }
        return max(left, right) + node.Val
    }
    dfs(root)
    return result
}
```

## Pattern 3: Tree Diameter

**Problem:** Longest path (by number of edges) between any two nodes.

This is the edge-count version of the path sum problem. At each node, the longest path passing through it is `depth(left) + depth(right)`.

```cpp
int diameterOfBinaryTree(TreeNode* root) {
    int diameter = 0;
    function<int(TreeNode*)> dfs = [&](TreeNode* node) -> int {
        if (!node) return 0;
        int left  = dfs(node->left);
        int right = dfs(node->right);
        diameter = max(diameter, left + right);
        return max(left, right) + 1;
    };
    dfs(root);
    return diameter;
}
```

```java
int diameter = 0;
int diameterOfBinaryTree(TreeNode root) {
    dfs(root);
    return diameter;
}
int dfs(TreeNode node) {
    if (node == null) return 0;
    int left = dfs(node.left), right = dfs(node.right);
    diameter = Math.max(diameter, left + right);
    return Math.max(left, right) + 1;
}
```

```typescript
function diameterOfBinaryTree(root: TreeNode | null): number {
    let diameter = 0;
    function dfs(node: TreeNode | null): number {
        if (!node) return 0;
        const left = dfs(node.left), right = dfs(node.right);
        diameter = Math.max(diameter, left + right);
        return Math.max(left, right) + 1;
    }
    dfs(root);
    return diameter;
}
```

```python
def diameterOfBinaryTree(root) -> int:
    diameter = [0]
    def dfs(node) -> int:
        if not node: return 0
        left, right = dfs(node.left), dfs(node.right)
        diameter[0] = max(diameter[0], left + right)
        return max(left, right) + 1
    dfs(root)
    return diameter[0]
```

```go
func diameterOfBinaryTree(root *TreeNode) int {
    diameter := 0
    var dfs func(*TreeNode) int
    dfs = func(node *TreeNode) int {
        if node == nil { return 0 }
        left, right := dfs(node.Left), dfs(node.Right)
        if left+right > diameter { diameter = left + right }
        if left > right { return left + 1 }
        return right + 1
    }
    dfs(root)
    return diameter
}
```

## Pattern 4: Maximum Independent Set on a Tree

**Problem:** Select the maximum number of nodes such that no two selected nodes are adjacent (share an edge). This is a classic tree DP.

**State:** `dp[node][0]` = max nodes selected in node's subtree when node is NOT selected. `dp[node][1]` = max nodes when node IS selected.

**Recurrence:**
- Not selected: children can be selected or not → `dp[node][0] = sum(max(dp[child][0], dp[child][1]))`
- Selected: children must NOT be selected → `dp[node][1] = 1 + sum(dp[child][0])`

```cpp
pair<int,int> dfs(vector<vector<int>>& adj, int node, int parent) {
    int take = 1, skip = 0;
    for (int child : adj[node]) {
        if (child == parent) continue;
        auto [childTake, childSkip] = dfs(adj, child, node);
        take += childSkip;
        skip += max(childTake, childSkip);
    }
    return {take, skip};
}
int maxIndependentSet(vector<vector<int>>& adj, int n) {
    auto [take, skip] = dfs(adj, 0, -1);
    return max(take, skip);
}
```

```java
int[] dfs(List<List<Integer>> adj, int node, int parent) {
    int take = 1, skip = 0;
    for (int child : adj.get(node)) {
        if (child == parent) continue;
        int[] res = dfs(adj, child, node);
        take += res[1];
        skip += Math.max(res[0], res[1]);
    }
    return new int[]{take, skip};
}
int maxIndependentSet(List<List<Integer>> adj) {
    int[] res = dfs(adj, 0, -1);
    return Math.max(res[0], res[1]);
}
```

```typescript
function maxIndependentSet(adj: number[][], n: number): number {
    function dfs(node: number, parent: number): [number, number] {
        let take = 1, skip = 0;
        for (const child of adj[node]) {
            if (child === parent) continue;
            const [childTake, childSkip] = dfs(child, node);
            take += childSkip;
            skip += Math.max(childTake, childSkip);
        }
        return [take, skip];
    }
    const [take, skip] = dfs(0, -1);
    return Math.max(take, skip);
}
```

```python
def max_independent_set(adj: list[list[int]], n: int) -> int:
    def dfs(node: int, parent: int) -> tuple[int, int]:
        take, skip = 1, 0
        for child in adj[node]:
            if child == parent: continue
            child_take, child_skip = dfs(child, node)
            take += child_skip
            skip += max(child_take, child_skip)
        return take, skip
    take, skip = dfs(0, -1)
    return max(take, skip)
```

```go
func maxIndependentSet(adj [][]int, n int) int {
    var dfs func(node, parent int) (int, int)
    dfs = func(node, parent int) (int, int) {
        take, skip := 1, 0
        for _, child := range adj[node] {
            if child == parent { continue }
            ct, cs := dfs(child, node)
            take += cs
            if ct > cs { skip += ct } else { skip += cs }
        }
        return take, skip
    }
    t, s := dfs(0, -1)
    if t > s { return t }
    return s
}
```

## Pattern 5: Rerooting (Change of Root)

**Problem:** Compute some value for every node as if it were the root of the tree. Naive approach: root at each node and run DFS → O(n²). Rerooting does it in O(n) with two passes.

**Example:** For each node, find the sum of distances to all other nodes.

**Pass 1 (root at node 0):** Compute `subtreeSize[v]` and `downDist[v]` (sum of distances to nodes in v's subtree).

**Pass 2 (rerooting):** When moving the root from parent `u` to child `v`:
- Nodes in `v`'s subtree get 1 closer (there are `subtreeSize[v]` of them)
- All other nodes get 1 farther (there are `n - subtreeSize[v]` of them)
- `dist[v] = dist[u] - subtreeSize[v] + (n - subtreeSize[v])`

```cpp
vector<int> sumOfDistancesInTree(int n, vector<vector<int>>& edges) {
    vector<vector<int>> adj(n);
    for (auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }

    vector<int> sz(n, 1), dist(n, 0);

    // Pass 1: compute subtree sizes and distances from root (node 0)
    function<void(int,int)> dfs1 = [&](int u, int p) {
        for (int v : adj[u]) {
            if (v == p) continue;
            dfs1(v, u);
            sz[u] += sz[v];
            dist[u] += dist[v] + sz[v];  // all nodes in v's subtree are 1 farther
        }
    };

    // Pass 2: reroot — propagate distances to all nodes
    function<void(int,int)> dfs2 = [&](int u, int p) {
        for (int v : adj[u]) {
            if (v == p) continue;
            // Move root from u to v
            dist[v] = dist[u] - sz[v] + (n - sz[v]);
            sz[v] = n;  // from v's perspective, its subtree is the whole tree
            dfs2(v, u);
        }
    };

    dfs1(0, -1);
    dfs2(0, -1);
    return dist;
}
```

```java
int[] sumOfDistancesInTree(int n, int[][] edges) {
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }
    int[] sz = new int[n], dist = new int[n];
    Arrays.fill(sz, 1);
    dfs1(adj, 0, -1, sz, dist);
    dfs2(adj, 0, -1, sz, dist, n);
    return dist;
}
void dfs1(List<List<Integer>> adj, int u, int p, int[] sz, int[] dist) {
    for (int v : adj.get(u)) {
        if (v == p) continue;
        dfs1(adj, v, u, sz, dist);
        sz[u] += sz[v]; dist[u] += dist[v] + sz[v];
    }
}
void dfs2(List<List<Integer>> adj, int u, int p, int[] sz, int[] dist, int n) {
    for (int v : adj.get(u)) {
        if (v == p) continue;
        dist[v] = dist[u] - sz[v] + (n - sz[v]);
        sz[v] = n;
        dfs2(adj, v, u, sz, dist, n);
    }
}
```

```typescript
function sumOfDistancesInTree(n: number, edges: number[][]): number[] {
    const adj: number[][] = Array.from({length: n}, () => []);
    for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
    const sz = new Array(n).fill(1), dist = new Array(n).fill(0);
    function dfs1(u: number, p: number): void {
        for (const v of adj[u]) {
            if (v === p) continue;
            dfs1(v, u); sz[u] += sz[v]; dist[u] += dist[v] + sz[v];
        }
    }
    function dfs2(u: number, p: number): void {
        for (const v of adj[u]) {
            if (v === p) continue;
            dist[v] = dist[u] - sz[v] + (n - sz[v]);
            sz[v] = n;
            dfs2(v, u);
        }
    }
    dfs1(0, -1); dfs2(0, -1);
    return dist;
}
```

```python
def sumOfDistancesInTree(n: int, edges: list[list[int]]) -> list[int]:
    from collections import defaultdict
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v); adj[v].append(u)

    sz = [1] * n
    dist = [0] * n

    def dfs1(u: int, p: int) -> None:
        for v in adj[u]:
            if v == p: continue
            dfs1(v, u)
            sz[u] += sz[v]
            dist[u] += dist[v] + sz[v]

    def dfs2(u: int, p: int) -> None:
        for v in adj[u]:
            if v == p: continue
            dist[v] = dist[u] - sz[v] + (n - sz[v])
            sz[v] = n
            dfs2(v, u)

    dfs1(0, -1)
    dfs2(0, -1)
    return dist
```

```go
func sumOfDistancesInTree(n int, edges [][]int) []int {
    adj := make([][]int, n)
    for _, e := range edges { adj[e[0]] = append(adj[e[0]], e[1]); adj[e[1]] = append(adj[e[1]], e[0]) }
    sz := make([]int, n); dist := make([]int, n)
    for i := range sz { sz[i] = 1 }
    var dfs1 func(u, p int)
    dfs1 = func(u, p int) {
        for _, v := range adj[u] {
            if v == p { continue }
            dfs1(v, u); sz[u] += sz[v]; dist[u] += dist[v] + sz[v]
        }
    }
    var dfs2 func(u, p int)
    dfs2 = func(u, p int) {
        for _, v := range adj[u] {
            if v == p { continue }
            dist[v] = dist[u] - sz[v] + (n - sz[v]); sz[v] = n; dfs2(v, u)
        }
    }
    dfs1(0, -1); dfs2(0, -1)
    return dist
}
```

## Complexity Summary

| Pattern | Time | Space |
|---|---|---|
| Subtree aggregation | O(n) | O(n) |
| Max path sum / Diameter | O(n) | O(n) recursion stack |
| Max Independent Set | O(n) | O(n) |
| Rerooting (sum of distances) | O(n) | O(n) |

## Key Interview Insights

**Post-order is almost always correct:** Compute answers for children before combining at the parent. 99% of tree DP problems follow this pattern.

**The global variable trick:** For "best path through any node" problems (diameter, max path sum), maintain a global variable updated during DFS. The function returns the best one-sided path to the parent.

**Rerooting mental model:** "If I know the answer for node `u`, what changes when I move the root to its neighbor `v`? Nodes in `v`'s subtree get closer, all others get farther." Encode this delta update and propagate.

**Stack overflow on large trees:** For n up to 10⁵, recursive DFS may hit stack limits in some languages (Java/Python default stack is shallow). Use iterative DFS with an explicit stack, or increase the stack size. In competitive programming, iterative BFS-based post-order is safer.

**Binary tree vs general tree:** Most LeetCode problems give you a binary tree (at most 2 children). For general trees, use adjacency lists and pass a `parent` argument to avoid revisiting. The DP patterns are identical.

**Independent Set is a template for many problems:** "House Robber on a tree" = maximum independent set. Any "pick nodes with constraints about neighbors" problem maps to this two-state DP.
