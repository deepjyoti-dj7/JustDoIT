---
title: Binary Search Trees (BST)
description: BST properties, operations, common patterns, and interview techniques
---

# Binary Search Trees (BST)

A Binary Search Tree is a binary tree with a strict ordering property: for every node, **all values in its left subtree are less than the node's value**, and **all values in its right subtree are greater**. This property makes search, insert, and delete all O(h) — O(log n) when balanced.

## The BST Property

```
          8
        /   \
       3    10
      / \     \
     1   6    14
        / \   /
       4   7 13
```

For node `8`: everything in left subtree {1, 3, 4, 6, 7} < 8 < everything in right subtree {10, 13, 14}.

This holds **recursively for every node** — not just the immediate children.

> **Common mistake:** Checking only that `left.val < root.val < right.val` is not enough. Validate with min/max bounds (see validate-bst.md).

## Core BST Operations

### Search

Follow left or right based on comparison. No need to visit both children.

```cpp
TreeNode* search(TreeNode* root, int target) {
    if (!root || root->val == target) return root;
    if (target < root->val) return search(root->left, target);
    return search(root->right, target);
}

// Iterative (preferred for large trees)
TreeNode* searchIter(TreeNode* root, int target) {
    while (root && root->val != target) {
        root = target < root->val ? root->left : root->right;
    }
    return root;
}
```

```java
TreeNode search(TreeNode root, int target) {
    if (root == null || root.val == target) return root;
    if (target < root.val) return search(root.left, target);
    return search(root.right, target);
}

TreeNode searchIter(TreeNode root, int target) {
    while (root != null && root.val != target) {
        root = target < root.val ? root.left : root.right;
    }
    return root;
}
```

```typescript
function search(root: TreeNode | null, target: number): TreeNode | null {
    if (!root || root.val === target) return root;
    return target < root.val ? search(root.left, target) : search(root.right, target);
}

function searchIter(root: TreeNode | null, target: number): TreeNode | null {
    while (root && root.val !== target) {
        root = target < root.val ? root.left : root.right;
    }
    return root;
}
```

```python
def search(root: TreeNode | None, target: int) -> TreeNode | None:
    if not root or root.val == target:
        return root
    if target < root.val:
        return search(root.left, target)
    return search(root.right, target)

def search_iter(root: TreeNode | None, target: int) -> TreeNode | None:
    while root and root.val != target:
        root = root.left if target < root.val else root.right
    return root
```

```go
func search(root *TreeNode, target int) *TreeNode {
    if root == nil || root.Val == target { return root }
    if target < root.Val { return search(root.Left, target) }
    return search(root.Right, target)
}

func searchIter(root *TreeNode, target int) *TreeNode {
    for root != nil && root.Val != target {
        if target < root.Val { root = root.Left } else { root = root.Right }
    }
    return root
}
```

**Time:** O(h) — O(log n) balanced, O(n) skewed

### Insert

Find the right spot (where the key would be if it existed) and insert there.

```cpp
TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    // val == root->val: duplicate, ignore (or handle as needed)
    return root;
}
```

```java
TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    return root;
}
```

```typescript
function insert(root: TreeNode | null, val: number): TreeNode {
    if (!root) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    return root;
}
```

```python
def insert(root: TreeNode | None, val: int) -> TreeNode:
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root
```

```go
func insert(root *TreeNode, val int) *TreeNode {
    if root == nil { return &TreeNode{Val: val} }
    if val < root.Val { root.Left = insert(root.Left, val) }
    if val > root.Val { root.Right = insert(root.Right, val) }
    return root
}
```

### Delete

Three cases:
1. Node is a **leaf** → just remove it
2. Node has **one child** → replace node with its child
3. Node has **two children** → replace with **inorder successor** (smallest in right subtree), then delete the successor

```cpp
TreeNode* deleteNode(TreeNode* root, int key) {
    if (!root) return nullptr;

    if (key < root->val) {
        root->left = deleteNode(root->left, key);
    } else if (key > root->val) {
        root->right = deleteNode(root->right, key);
    } else {
        // Found the node to delete
        if (!root->left) return root->right;   // Case 1 & 2
        if (!root->right) return root->left;   // Case 2

        // Case 3: find inorder successor (min of right subtree)
        TreeNode* successor = root->right;
        while (successor->left) successor = successor->left;
        root->val = successor->val;                          // Replace value
        root->right = deleteNode(root->right, successor->val); // Delete successor
    }
    return root;
}
```

```java
TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) root.left = deleteNode(root.left, key);
    else if (key > root.val) root.right = deleteNode(root.right, key);
    else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode successor = root.right;
        while (successor.left != null) successor = successor.left;
        root.val = successor.val;
        root.right = deleteNode(root.right, successor.val);
    }
    return root;
}
```

```typescript
function deleteNode(root: TreeNode | null, key: number): TreeNode | null {
    if (!root) return null;
    if (key < root.val) root.left = deleteNode(root.left, key);
    else if (key > root.val) root.right = deleteNode(root.right, key);
    else {
        if (!root.left) return root.right;
        if (!root.right) return root.left;
        let successor = root.right;
        while (successor.left) successor = successor.left;
        root.val = successor.val;
        root.right = deleteNode(root.right, successor.val);
    }
    return root;
}
```

```python
def delete_node(root: TreeNode | None, key: int) -> TreeNode | None:
    if not root:
        return None
    if key < root.val:
        root.left = delete_node(root.left, key)
    elif key > root.val:
        root.right = delete_node(root.right, key)
    else:
        if not root.left: return root.right
        if not root.right: return root.left
        successor = root.right
        while successor.left:
            successor = successor.left
        root.val = successor.val
        root.right = delete_node(root.right, successor.val)
    return root
```

```go
func deleteNode(root *TreeNode, key int) *TreeNode {
    if root == nil { return nil }
    if key < root.Val { root.Left = deleteNode(root.Left, key) }
    if key > root.Val { root.Right = deleteNode(root.Right, key) }
    if key == root.Val {
        if root.Left == nil { return root.Right }
        if root.Right == nil { return root.Left }
        successor := root.Right
        for successor.Left != nil { successor = successor.Left }
        root.Val = successor.Val
        root.Right = deleteNode(root.Right, successor.Val)
    }
    return root
}
```

## Finding Min and Max

The minimum is always the **leftmost** node; the maximum is always the **rightmost**.

```cpp
TreeNode* findMin(TreeNode* root) {
    while (root->left) root = root->left;
    return root;
}
TreeNode* findMax(TreeNode* root) {
    while (root->right) root = root->right;
    return root;
}
```

```java
TreeNode findMin(TreeNode root) {
    while (root.left != null) root = root.left;
    return root;
}
TreeNode findMax(TreeNode root) {
    while (root.right != null) root = root.right;
    return root;
}
```

```typescript
function findMin(root: TreeNode): TreeNode {
    while (root.left) root = root.left;
    return root;
}
function findMax(root: TreeNode): TreeNode {
    while (root.right) root = root.right;
    return root;
}
```

```python
def find_min(root: TreeNode) -> TreeNode:
    while root.left:
        root = root.left
    return root

def find_max(root: TreeNode) -> TreeNode:
    while root.right:
        root = root.right
    return root
```

```go
func findMin(root *TreeNode) *TreeNode {
    for root.Left != nil { root = root.Left }
    return root
}
func findMax(root *TreeNode) *TreeNode {
    for root.Right != nil { root = root.Right }
    return root
}
```

## Inorder as Sorted Array

Inorder traversal of a BST gives sorted output. This is the bridge between BST problems and array problems.

Pattern: **convert BST to sorted array via inorder, then apply standard array techniques**.

However, for k-th smallest, range queries etc., avoid the full traversal — use early termination with a counter.

## BST Validation Pattern

Use min/max bounds passed down recursively — not just parent comparison.

```
For any node with value v:
  All values in its left subtree must be in (min, v)
  All values in its right subtree must be in (v, max)
```

See `validate-bst.md` for full implementation.

## Complexity Reference

| Operation | Average (Balanced) | Worst (Skewed) |
|---|---|---|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Min/Max | O(log n) | O(n) |
| Inorder traversal | O(n) | O(n) |
| Space (height) | O(log n) | O(n) |

## Common BST Interview Patterns

| Pattern | Approach |
|---|---|
| Validate BST | Recursive bounds (min, max) |
| Kth smallest | Inorder traversal with counter |
| Lowest Common Ancestor | Navigate left/right based on both targets |
| Floor / Ceiling | Track candidate while searching |
| Convert sorted array to BST | Mid-element as root, recurse |
| BST to sorted doubly linked list | Inorder + rewire pointers |

## Key Interview Insights

- **Always validate with bounds, not just parent:** `root->left->val < root->val` is insufficient — the entire subtree must satisfy the constraint.
- **Inorder = sorted:** If a BST problem asks for anything "in order" or "k-th smallest", inorder traversal is likely the answer.
- **BST search is O(log n) amortized but O(n) worst-case.** Mention AVL or Red-Black Trees when reliability matters.
- **Deletion successor vs predecessor:** Using the inorder successor (minimum of right subtree) is the standard; predecessor works too but convention is successor.
- **When BST is not balanced:** The worst case is a sorted input creating a degenerate tree. Mention this tradeoff explicitly.
