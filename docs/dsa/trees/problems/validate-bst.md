---
title: Validate BST
difficulty: Medium
tags: [Tree, DFS, BST, Recursion]
link: https://leetcode.com/problems/validate-binary-search-tree/
---

# Validate Binary Search Tree

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [98. Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) |
| **Tags** | Tree, DFS, BST, Recursion |

## Problem Statement

Given the root of a binary tree, determine if it is a valid **binary search tree (BST)**.

A valid BST satisfies:
- The left subtree contains only nodes with values **less than** the node's value
- The right subtree contains only nodes with values **greater than** the node's value
- Both subtrees are also valid BSTs

```
Valid BST:        Invalid BST:
    5                 5
   / \               / \
  1   4             1   4
     / \               / \
    3   6             3   6
                         (3 < 5, so 3 can't be in the right subtree of 5!)
```

## Intuition

### Common Mistake

Checking only `root->left->val < root->val < root->right->val` is **wrong**.

```
    10
   /  \
  5    15
      /  \
     6    20
```

Node 6 is in the right subtree of 10, but `6 < 10` — this is invalid! Checking only the parent-child relationship misses this.

### Correct Approach: Propagate Bounds

Pass down `min` and `max` bounds at each recursion level. Every node must satisfy `min < node->val < max`.

```
Root (−∞, +∞):   10 must be in (−∞, +∞)  ✓
Left (−∞, 10):    5 must be in (−∞, 10)   ✓
Right (10, +∞):  15 must be in (10, +∞)   ✓
  Right.left (10, 15):  6 must be in (10, 15) ✗ → Invalid!
```

## Approach 1: Wrong — Only Check Parent-Child

This is the approach many beginners write. It's wrong — don't use it.

```cpp
// WRONG - only checks immediate parent-child relationship
bool isValidBST(TreeNode* root) {
    if (!root) return true;
    if (root->left && root->left->val >= root->val) return false;
    if (root->right && root->right->val <= root->val) return false;
    return isValidBST(root->left) && isValidBST(root->right);
}
```

```python
# WRONG
```

```java
// WRONG
```

```typescript
// WRONG
```

```go
// WRONG
```

## Approach 2: Recursive with Bounds — O(n)

```cpp
bool validate(TreeNode* root, long minVal, long maxVal) {
    if (!root) return true;
    if (root->val <= minVal || root->val >= maxVal) return false;
    return validate(root->left, minVal, root->val) &&
           validate(root->right, root->val, maxVal);
}

bool isValidBST(TreeNode* root) {
    return validate(root, LONG_MIN, LONG_MAX);
}
```

```java
boolean validate(TreeNode root, long min, long max) {
    if (root == null) return true;
    if (root.val <= min || root.val >= max) return false;
    return validate(root.left, min, root.val) &&
           validate(root.right, root.val, max);
}

boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
```

```typescript
function isValidBST(root: TreeNode | null): boolean {
    function validate(node: TreeNode | null, min: number, max: number): boolean {
        if (!node) return true;
        if (node.val <= min || node.val >= max) return false;
        return validate(node.left, min, node.val) &&
               validate(node.right, node.val, max);
    }
    return validate(root, -Infinity, Infinity);
}
```

```python
def isValidBST(root: TreeNode | None) -> bool:
    def validate(node: TreeNode | None, min_val: float, max_val: float) -> bool:
        if not node:
            return True
        if node.val <= min_val or node.val >= max_val:
            return False
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))

    return validate(root, float('-inf'), float('inf'))
```

```go
func isValidBST(root *TreeNode) bool {
    return validate(root, math.MinInt64, math.MaxInt64)
}

func validate(root *TreeNode, min, max int) bool {
    if root == nil { return true }
    if root.Val <= min || root.Val >= max { return false }
    return validate(root.Left, min, root.Val) && validate(root.Right, root.Val, max)
}
```

**Time:** O(n) — **Space:** O(h)

## Approach 3: Inorder Traversal — O(n)

Inorder traversal of a valid BST produces a **strictly increasing sequence**. Check that each visited value is greater than the previous.

```cpp
TreeNode* prev = nullptr;

bool isValidBST(TreeNode* root) {
    if (!root) return true;
    if (!isValidBST(root->left)) return false;
    if (prev && root->val <= prev->val) return false;
    prev = root;
    return isValidBST(root->right);
}
```

```java
TreeNode prev = null;

boolean isValidBST(TreeNode root) {
    if (root == null) return true;
    if (!isValidBST(root.left)) return false;
    if (prev != null && root.val <= prev.val) return false;
    prev = root;
    return isValidBST(root.right);
}
```

```typescript
function isValidBST(root: TreeNode | null): boolean {
    let prev: TreeNode | null = null;

    function inorder(node: TreeNode | null): boolean {
        if (!node) return true;
        if (!inorder(node.left)) return false;
        if (prev && node.val <= prev.val) return false;
        prev = node;
        return inorder(node.right);
    }

    return inorder(root);
}
```

```python
def isValidBST(root: TreeNode | None) -> bool:
    prev = [None]   # Use list to allow mutation inside nested function

    def inorder(node: TreeNode | None) -> bool:
        if not node:
            return True
        if not inorder(node.left):
            return False
        if prev[0] is not None and node.val <= prev[0].val:
            return False
        prev[0] = node
        return inorder(node.right)

    return inorder(root)
```

```go
func isValidBST(root *TreeNode) bool {
    var prev *TreeNode
    var inorder func(*TreeNode) bool
    inorder = func(node *TreeNode) bool {
        if node == nil { return true }
        if !inorder(node.Left) { return false }
        if prev != nil && node.Val <= prev.Val { return false }
        prev = node
        return inorder(node.Right)
    }
    return inorder(root)
}
```

**Time:** O(n) — **Space:** O(h)

## Comparison

| Approach | Time | Space | Notes |
|---|---|---|---|
| Wrong (parent-only) | O(n) | O(h) | ❌ Incorrect |
| Bounds propagation | O(n) | O(h) | ✅ Recommended — clean and direct |
| Inorder + prev | O(n) | O(h) | ✅ Alternative — uses BST property |

## Key Interview Insights

- **Use `long` bounds or `-Infinity`/`Infinity` for the initial call** — node values may be `INT_MIN` or `INT_MAX`, so integer bounds would fail.
- **Strict inequalities:** BSTs require `left < root < right` — duplicates are not allowed in a standard BST. Use `<=` and `>=` in your checks.
- **The bounds approach is cleaner and more general** — it doesn't require tracking previous state.
- **Inorder approach** is good to mention as an alternative (exploits BST property), but bounds approach is easier to reason about.
- **Classic wrong answer:** Only checking `node->left->val < node->val`. Always draw the counterexample (the node 6 under node 15 example above) to justify your correct approach.
