---
title: Binary Trees
description: Core binary tree concepts, properties, terminology, and fundamental patterns for interview success
---

# Binary Trees

A binary tree is a hierarchical data structure where each node has **at most two children** — a left child and a right child. Nearly every advanced tree problem (BSTs, heaps, tries, segment trees) builds on binary tree fundamentals. Master this first.

## Anatomy of a Binary Tree

```
          1          ← Root (depth 0, level 1)
        /   \
       2     3       ← depth 1, level 2
      / \     \
     4   5     6     ← depth 2, level 3
        /
       7             ← depth 3, level 4 (leaf)
```

| Term | Definition |
|---|---|
| **Root** | The topmost node; has no parent |
| **Leaf** | A node with no children |
| **Height** | Longest path from root to any leaf (edges) |
| **Depth** | Distance from root to a given node (edges) |
| **Level** | depth + 1 (root is level 1) |
| **Subtree** | A node and all its descendants |
| **Ancestor** | Any node on path from root to given node |
| **Descendant** | Any node reachable downward from given node |
| **Sibling** | Nodes sharing the same parent |

## Node Structure

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};
```

```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int v) { val = v; }
}
```

```typescript
class TreeNode {
    val: number;
    left: TreeNode | null;
    right: TreeNode | null;
    constructor(val: number) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}
```

```python
class TreeNode:
    def __init__(self, val: int = 0):
        self.val = val
        self.left = None
        self.right = None
```

```go
type TreeNode struct {
    Val   int
    Left  *TreeNode
    Right *TreeNode
}
```

## Types of Binary Trees

| Type | Definition | Key Property |
|---|---|---|
| **Full** | Every node has 0 or 2 children | No node has exactly 1 child |
| **Complete** | All levels full except last; last level filled left to right | Used in heaps |
| **Perfect** | All internal nodes have 2 children; all leaves at same level | n = 2^h+1 - 1 nodes |
| **Balanced** | Height ≈ log n; `|height(left) - height(right)| ≤ 1` for every node | AVL, Red-Black |
| **Degenerate** | Each node has only one child; degrades to linked list | BST with sorted input |
| **BST** | Left subtree < node < right subtree | Enables O(log n) search |

## Key Properties

For a binary tree with `n` nodes:

| Fact | Value |
|---|---|
| Max nodes at depth `d` | 2^d |
| Max nodes in tree of height `h` | 2^(h+1) - 1 |
| Min height of `n`-node tree | ⌊log₂ n⌋ |
| Max height of `n`-node tree | n - 1 (degenerate) |
| Leaves in a full binary tree | ⌈n/2⌉ |

## The Recursive Nature of Trees

The most important insight: **a binary tree is defined recursively**.

> A binary tree is either `null`, or a node with a `left` subtree (a binary tree) and a `right` subtree (a binary tree).

This means almost every tree problem has a natural recursive solution:

1. **Base case:** handle `null` (empty tree)
2. **Recursive case:** solve for left subtree, solve for right subtree, combine results with current node

This pattern covers ~80% of tree interview problems.

## The Two Fundamental Thinking Models

### Model 1: Return-Value Recursion (Bottom-Up)

Ask: "What does my function return that the parent needs?"

Used for: height, max path sum, diameter, checking properties

```cpp
// Template: compute something and return it
int solve(TreeNode* root) {
    if (!root) return base_case;
    int left = solve(root->left);
    int right = solve(root->right);
    return combine(left, right, root->val);
}
```

```java
int solve(TreeNode root) {
    if (root == null) return base_case;
    int left = solve(root.left);
    int right = solve(root.right);
    return combine(left, right, root.val);
}
```

```typescript
function solve(root: TreeNode | null): number {
    if (!root) return base_case;
    const left = solve(root.left);
    const right = solve(root.right);
    return combine(left, right, root.val);
}
```

```python
def solve(root: TreeNode | None) -> int:
    if not root:
        return base_case
    left = solve(root.left)
    right = solve(root.right)
    return combine(left, right, root.val)
```

```go
func solve(root *TreeNode) int {
    if root == nil { return base_case }
    left := solve(root.Left)
    right := solve(root.Right)
    return combine(left, right, root.Val)
}
```

### Model 2: Global State / Side-Effect Recursion

Ask: "What global state do I update as I traverse?"

Used for: diameter, max path sum, level-order variants, serialization

```cpp
// Template: update a global answer during traversal
int ans = 0;

int dfs(TreeNode* root) {
    if (!root) return 0;
    int left = dfs(root->left);
    int right = dfs(root->right);
    ans = max(ans, /* use left, right, root->val */);
    return /* value useful to parent */;
}
```

```java
int ans = 0;

int dfs(TreeNode root) {
    if (root == null) return 0;
    int left = dfs(root.left);
    int right = dfs(root.right);
    ans = Math.max(ans, /* combine */);
    return /* value useful to parent */;
}
```

```typescript
let ans = 0;

function dfs(root: TreeNode | null): number {
    if (!root) return 0;
    const left = dfs(root.left);
    const right = dfs(root.right);
    ans = Math.max(ans, /* combine */);
    return /* value useful to parent */;
}
```

```python
ans = 0

def dfs(root: TreeNode | None) -> int:
    nonlocal ans
    if not root:
        return 0
    left = dfs(root.left)
    right = dfs(root.right)
    ans = max(ans, # combine)
    return  # value useful to parent
```

```go
ans := 0

var dfs func(root *TreeNode) int
dfs = func(root *TreeNode) int {
    if root == nil { return 0 }
    left := dfs(root.Left)
    right := dfs(root.Right)
    if combined := /* ... */; combined > ans { ans = combined }
    return /* value useful to parent */
}
```

## When to Use Which Traversal

| Problem Type | Best Traversal | Why |
|---|---|---|
| Process node before children | Preorder (Root → L → R) | Parent info needed first |
| Process children before node | Postorder (L → R → Root) | Need subtree results |
| BST sorted order | Inorder (L → Root → R) | Produces sorted output |
| Level-by-level processing | BFS / Level Order | Queue-based, natural levels |
| Path from root to leaf | Preorder DFS | Carry state downward |
| Build answer from subtrees | Postorder DFS | Aggregate upward |

## Common Tree Pitfalls

- **Forgetting the null check:** Always handle `root == null` first — it's the base case.
- **Off-by-one on height:** Height of a single node is 0 (edge count). Depth of root is 0.
- **Confusing height and depth:** Height is measured upward from leaves; depth is measured downward from root.
- **BST vs Binary Tree:** BST has ordering; binary tree does not. Don't assume ordering unless specified.
- **Modifying tree during traversal:** If you prune/modify, be careful about pointer invalidation.
- **Stack overflow on skewed trees:** DFS on a chain of 10^5 nodes will overflow. Mention iterative fallback.

## Interview Identification Patterns

| If the problem says... | Think... |
|---|---|
| "Find path from root to leaf" | Preorder DFS + path tracking |
| "Sum/max/min of subtree" | Postorder DFS + return values |
| "Level by level" | BFS + queue |
| "Check if balanced/complete/valid BST" | Postorder DFS + return height/bounds |
| "Ancestor of two nodes" | LCA (postorder: find in left or right?) |
| "Serialize / reconstruct" | Preorder DFS + sentinel for null |
| "BST + kth element / range query" | Inorder traversal |

## Complexity Reference

| Operation | Balanced Tree | Degenerate Tree |
|---|---|---|
| Height | O(log n) | O(n) |
| DFS traversal | O(n) | O(n) |
| BFS traversal | O(n) | O(n) |
| Space (DFS call stack) | O(log n) | O(n) |
| Space (BFS queue) | O(w) where w = max width | O(n) |
