---
title: Lowest Common Ancestor of BST
difficulty: Medium
tags: [Tree, BST, DFS, Recursion]
link: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
---

# Lowest Common Ancestor of a Binary Search Tree

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) |
| **Tags** | Tree, BST, DFS, Recursion |

## Problem Statement

Given the root of a BST and two nodes `p` and `q`, find their **lowest common ancestor (LCA)**.

The LCA is the deepest node that is an ancestor of both `p` and `q`. A node can be an ancestor of itself.

```
BST:       6
          / \
         2   8
        / \ / \
       0  4 7  9
         / \
        3   5

LCA(2, 8) = 6   (they split at root)
LCA(2, 4) = 2   (2 is ancestor of 4)
LCA(3, 5) = 4   (3 and 5 are both under 4)
```

## Intuition

In a regular binary tree, LCA requires checking both subtrees (O(n)). In a BST, the ordering property lets us **navigate directly** to the LCA in O(h) time.

The LCA is the **first node where `p` and `q` split**:

- Both `p.val` and `q.val` are **less** than `root.val` → LCA is in the left subtree
- Both `p.val` and `q.val` are **greater** than `root.val` → LCA is in the right subtree
- Otherwise (one is less, one is greater, or one equals the root) → **root is the LCA**

## Approach 1: Iterative — O(h) Time, O(1) Space

The iterative version is cleaner and avoids any stack overhead.

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    while (root) {
        if (p->val < root->val && q->val < root->val)
            root = root->left;           // Both in left subtree
        else if (p->val > root->val && q->val > root->val)
            root = root->right;          // Both in right subtree
        else
            return root;                 // Split point = LCA
    }
    return nullptr;
}
```

```java
TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
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
function lowestCommonAncestor(root: TreeNode | null, p: TreeNode, q: TreeNode): TreeNode | null {
    while (root) {
        if (p.val < root.val && q.val < root.val) root = root.left;
        else if (p.val > root.val && q.val > root.val) root = root.right;
        else return root;
    }
    return null;
}
```

```python
def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
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
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    for root != nil {
        if p.Val < root.Val && q.Val < root.Val { root = root.Left }
        if p.Val > root.Val && q.Val > root.Val { root = root.Right }
        break
    }
    return root
}
```

**Time:** O(h) — O(log n) balanced, O(n) skewed  
**Space:** O(1) — no recursion stack

## Approach 2: Recursive — O(h) Time, O(h) Space

```cpp
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (p->val < root->val && q->val < root->val)
        return lowestCommonAncestor(root->left, p, q);
    if (p->val > root->val && q->val > root->val)
        return lowestCommonAncestor(root->right, p, q);
    return root;
}
```

```java
TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (p.val < root.val && q.val < root.val)
        return lowestCommonAncestor(root.left, p, q);
    if (p.val > root.val && q.val > root.val)
        return lowestCommonAncestor(root.right, p, q);
    return root;
}
```

```typescript
function lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode): TreeNode {
    if (p.val < root.val && q.val < root.val)
        return lowestCommonAncestor(root.left!, p, q);
    if (p.val > root.val && q.val > root.val)
        return lowestCommonAncestor(root.right!, p, q);
    return root;
}
```

```python
def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    if p.val < root.val and q.val < root.val:
        return lowestCommonAncestor(root.left, p, q)
    if p.val > root.val and q.val > root.val:
        return lowestCommonAncestor(root.right, p, q)
    return root
```

```go
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
    if p.Val < root.Val && q.Val < root.Val { return lowestCommonAncestor(root.Left, p, q) }
    if p.Val > root.Val && q.Val > root.Val { return lowestCommonAncestor(root.Right, p, q) }
    return root
}
```

**Time:** O(h) — **Space:** O(h) recursion

## Dry Run

```
BST:    6,  p=2, q=4

root=6: p.val(2) < 6 and q.val(4) < 6 → go left
root=2: p.val(2) == 2 (not strictly less) → else branch → return 2 ✓

Alternative: root=2: not (2<2 && 4<2) and not (2>2 && 4>2) → return 2 ✓
```

## BST LCA vs Binary Tree LCA

| | BST LCA | Binary Tree LCA |
|---|---|---|
| Time | O(h) | O(n) |
| Space | O(1) iterative | O(h) |
| Uses BST ordering | Yes | No |
| Approach | Navigate with comparisons | Postorder DFS check |

## Key Interview Insights

- **Use BST ordering, not postorder DFS.** The LCA in a BST can be found by comparison alone — no need to search both subtrees.
- **The iterative version is preferred** — it's O(1) space and avoids stack overflow on deep trees.
- **`else return root`** covers all cases: root equals p or q, or p and q are on different sides.
- **Guaranteed validity:** The problem guarantees both p and q exist in the tree, so we don't need null checks in the BST version.
- **Follow-up:** "What if this were a general binary tree (not BST)?" — Then use the full postorder LCA (LC 236), which is O(n).
