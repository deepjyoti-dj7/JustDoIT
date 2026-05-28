---
title: Lowest Common Ancestor (LCA)
description: LCA algorithms for binary trees and BSTs, with efficient techniques for repeated queries
---

# Lowest Common Ancestor (LCA)

The **Lowest Common Ancestor** of two nodes `p` and `q` in a tree is the deepest node that is an ancestor of both. "Ancestor" includes the node itself — so if `p` is an ancestor of `q`, then `p` is their LCA.

```
         3
        / \
       5   1
      / \ / \
     6  2 0  8
       / \
      7   4
```

- LCA(6, 4) = 5
- LCA(5, 4) = 5 (5 is an ancestor of itself)
- LCA(6, 8) = 3

## Two Types of LCA Problems

| Problem | Key Difference |
|---|---|
| **LCA in Binary Tree** | No ordering — must search everywhere |
| **LCA in BST** | Use ordering to navigate efficiently |

## Binary Tree LCA — Recursive Postorder

The core insight: do a postorder DFS. At each node, check:
- If `root` is `null` → return `null`
- If `root == p` or `root == q` → return `root` (found one of the targets)
- Recursively find in left and right subtrees
- If both sides return non-null → this node is the LCA
- If only one side returns non-null → that result bubbles up

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;

    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);

    if (left && right) return root;  // p and q are in different subtrees
    return left ? left : right;      // both are in the same subtree
}
```

```java
TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;

    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);

    if (left != null && right != null) return root;
    return left != null ? left : right;
}
```

```typescript
function lowestCommonAncestor(
    root: TreeNode | null, p: TreeNode, q: TreeNode
): TreeNode | null {
    if (!root || root === p || root === q) return root;

    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);

    if (left && right) return root;
    return left ?? right;
}
```

```python
def lowest_common_ancestor(
    root: TreeNode | None, p: TreeNode, q: TreeNode
) -> TreeNode | None:
    if not root or root is p or root is q:
        return root
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    if left and right:
        return root
    return left or right
```

```go
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    if root == nil || root == p || root == q { return root }
    left := lowestCommonAncestor(root.Left, p, q)
    right := lowestCommonAncestor(root.Right, p, q)
    if left != nil && right != nil { return root }
    if left != nil { return left }
    return right
}
```

**Time:** O(n) — visits every node once  
**Space:** O(h) — recursion stack depth

## BST LCA — O(h) with Ordering

In a BST, use the ordering to navigate:
- If both `p` and `q` are less than current node → LCA is in the left subtree
- If both are greater → LCA is in the right subtree
- If they're on different sides (or one equals current) → current node is the LCA

```cpp
TreeNode* lcaBST(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val)
            root = root->left;
        else if (p->val > root->val && q->val > root->val)
            root = root->right;
        else
            return root;  // Split point = LCA
    }
    return nullptr;
}
```

```java
TreeNode lcaBST(TreeNode root, TreeNode p, TreeNode q) {
    while (root != null) {
        if (p.val < root.val && q.val < root.val)
            root = root.left;
        else if (p.val > root.val && q.val > root.val)
            root = root.right;
        else
            return root;
    }
    return null;
}
```

```typescript
function lcaBST(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
    while (root) {
        if (p.val < root.val && q.val < root.val) root = root.left;
        else if (p.val > root.val && q.val > root.val) root = root.right;
        else return root;
    }
    return null;
}
```

```python
def lca_bst(root: TreeNode | None, p: TreeNode, q: TreeNode) -> TreeNode | None:
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root
    return None
```

```go
func lcaBST(root, p, q *TreeNode) *TreeNode {
    for root != nil {
        if p.Val < root.Val && q.Val < root.Val { root = root.Left }
        if p.Val > root.Val && q.Val > root.Val { root = root.Right }
        break
    }
    return root
}
```

**Time:** O(h) — O(log n) balanced BST  
**Space:** O(1) iterative

## LCA Variants

### Variant 1: LCA when p or q may not exist in tree

Return `null` if either node is not found. Track whether both `p` and `q` were actually found.

```cpp
// Returns {found_lca_or_partial, found_p, found_q}
struct Result { TreeNode* node; bool foundP, foundQ; };

Result dfs(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root) return {nullptr, false, false};
    auto [ln, lp, lq] = dfs(root->left, p, q);
    auto [rn, rp, rq] = dfs(root->right, p, q);
    bool fp = lp || rp || root == p;
    bool fq = lq || rq || root == q;
    if ((root == p || root == q) && (lp || lq || rp || rq))
        return {root, fp, fq};
    if (ln && rn) return {root, true, true};
    return {ln ? ln : rn, fp, fq};
}
```

```java
// Returns int[]{lca_val, found_p, found_q}
// Simplified: track with array[3] = {lca, foundP, foundQ}
```

```typescript
// Similar approach — track both flags in the return tuple
```

```python
def lca_may_not_exist(
    root: TreeNode | None, p: TreeNode, q: TreeNode
) -> TreeNode | None:
    found = [False, False]  # found_p, found_q
    result = [None]

    def dfs(node: TreeNode | None) -> bool:
        if not node:
            return False
        left = dfs(node.left)
        right = dfs(node.right)
        mid = node is p or node is q
        if mid + left + right >= 2:
            result[0] = node
        return mid or left or right

    dfs(root)
    return result[0]
```

```go
// Standard approach extended with boolean tracking
```

### Variant 2: LCA in n-ary Tree

Same idea — recurse all children, count non-null returns.

### Variant 3: Repeated LCA Queries (Offline / Binary Lifting)

For repeated LCA queries on large trees:
- **Euler tour + Sparse table:** O(n log n) preprocessing, O(1) per query
- **Binary Lifting:** O(n log n) preprocessing, O(log n) per query — most common in competitive programming

Binary lifting stores `ancestor[node][j]` = the 2^j-th ancestor of `node`.

```
ancestor[v][0] = parent[v]
ancestor[v][j] = ancestor[ancestor[v][j-1]][j-1]
```

LCA(u, v): bring both to the same depth, then jump in sync.

## LCA Applications

| Use Case | How LCA Helps |
|---|---|
| Distance between two nodes | dist(u, v) = depth(u) + depth(v) - 2×depth(LCA) |
| Path between two nodes | Path goes from u → LCA → v |
| Sum along a path | Prefix sums + LCA depth |
| Is node A an ancestor of B? | LCA(A, B) == A |

## Key Interview Insights

- **Single-pass elegance:** The binary tree LCA algorithm is O(n) and does not require finding parent pointers — it's complete in one DFS. That's the key insight interviewers look for.
- **The `if left && right → return root` line is the heart.** If both sides returned something non-null, this node is the split point = LCA.
- **BST LCA is O(h)** because we use the ordering to eliminate half the tree at each step.
- **Early termination:** Once you find both `p` and `q`, you don't need to continue. The recursive structure naturally short-circuits via return values.
- **LCA generalizes:** Remind interviewers you know the O(n log n) binary lifting approach for repeated queries on large trees.
