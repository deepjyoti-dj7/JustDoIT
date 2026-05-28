---
title: Balanced Binary Tree
difficulty: Easy
tags: [Tree, DFS, Recursion]
link: https://leetcode.com/problems/balanced-binary-tree/
---

# Balanced Binary Tree

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [110. Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/) |
| **Tags** | Tree, DFS, Recursion |

## Problem Statement

Given the root of a binary tree, determine if it is **height-balanced**.

A binary tree is height-balanced if for **every node**: the heights of its left and right subtrees differ by at most 1.

```
Balanced:         Not Balanced:
    3                  1
   / \                /
  9  20              2
    /  \            /
   15   7          3
```

## Intuition

Check the height of every node's left and right subtrees. If any node has a height difference > 1, return false.

### Naive Approach (O(n²))

Call a `height()` function at every node, then check the balance condition. But `height()` itself is O(n), and calling it at every node gives O(n²).

### Optimal Approach (O(n))

Combine the height computation and balance check in a single DFS. Return `-1` (sentinel) if any subtree is unbalanced — propagate this signal up without further work.

## Approach 1: Brute Force — O(n²)

```cpp
int height(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(height(root->left), height(root->right));
}

bool isBalanced(TreeNode* root) {
    if (!root) return true;
    int leftH = height(root->left);
    int rightH = height(root->right);
    if (abs(leftH - rightH) > 1) return false;
    return isBalanced(root->left) && isBalanced(root->right);
}
```

```java
int height(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(height(root.left), height(root.right));
}
boolean isBalanced(TreeNode root) {
    if (root == null) return true;
    if (Math.abs(height(root.left) - height(root.right)) > 1) return false;
    return isBalanced(root.left) && isBalanced(root.right);
}
```

```typescript
function height(root: TreeNode | null): number {
    if (!root) return 0;
    return 1 + Math.max(height(root.left), height(root.right));
}
function isBalanced(root: TreeNode | null): boolean {
    if (!root) return true;
    if (Math.abs(height(root.left) - height(root.right)) > 1) return false;
    return isBalanced(root.left) && isBalanced(root.right);
}
```

```python
def height(root: TreeNode | None) -> int:
    if not root: return 0
    return 1 + max(height(root.left), height(root.right))

def isBalanced(root: TreeNode | None) -> bool:
    if not root: return True
    if abs(height(root.left) - height(root.right)) > 1: return False
    return isBalanced(root.left) and isBalanced(root.right)
```

```go
func height(root *TreeNode) int {
    if root == nil { return 0 }
    if l, r := height(root.Left), height(root.Right); l > r { return l + 1 }
    return height(root.Right) + 1
}
func isBalanced(root *TreeNode) bool {
    if root == nil { return true }
    l, r := height(root.Left), height(root.Right)
    if l-r > 1 || r-l > 1 { return false }
    return isBalanced(root.Left) && isBalanced(root.Right)
}
```

**Time:** O(n²) — height recomputed for every node  
**Space:** O(h)

## Approach 2: Optimal Single DFS — O(n)

Return height from each DFS call, but return `-1` as a sentinel if any subtree is unbalanced. Propagate `-1` upward immediately (no further computation).

```cpp
int dfs(TreeNode* root) {
    if (!root) return 0;
    int left = dfs(root->left);
    if (left == -1) return -1;   // Already unbalanced below
    int right = dfs(root->right);
    if (right == -1) return -1;
    if (abs(left - right) > 1) return -1;   // Unbalanced at this node
    return 1 + max(left, right);            // Return height
}

bool isBalanced(TreeNode* root) {
    return dfs(root) != -1;
}
```

```java
int dfs(TreeNode root) {
    if (root == null) return 0;
    int left = dfs(root.left);
    if (left == -1) return -1;
    int right = dfs(root.right);
    if (right == -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
}

boolean isBalanced(TreeNode root) {
    return dfs(root) != -1;
}
```

```typescript
function isBalanced(root: TreeNode | null): boolean {
    function dfs(node: TreeNode | null): number {
        if (!node) return 0;
        const left = dfs(node.left);
        if (left === -1) return -1;
        const right = dfs(node.right);
        if (right === -1) return -1;
        if (Math.abs(left - right) > 1) return -1;
        return 1 + Math.max(left, right);
    }
    return dfs(root) !== -1;
}
```

```python
def isBalanced(root: TreeNode | None) -> bool:
    def dfs(node: TreeNode | None) -> int:
        if not node:
            return 0
        left = dfs(node.left)
        if left == -1: return -1        # Short-circuit
        right = dfs(node.right)
        if right == -1: return -1
        if abs(left - right) > 1: return -1
        return 1 + max(left, right)

    return dfs(root) != -1
```

```go
func isBalanced(root *TreeNode) bool {
    var dfs func(*TreeNode) int
    dfs = func(node *TreeNode) int {
        if node == nil { return 0 }
        left := dfs(node.Left)
        if left == -1 { return -1 }
        right := dfs(node.Right)
        if right == -1 { return -1 }
        if left-right > 1 || right-left > 1 { return -1 }
        if left > right { return left + 1 }
        return right + 1
    }
    return dfs(root) != -1
}
```

**Time:** O(n) — each node visited once  
**Space:** O(h) — recursion depth

## Dry Run (Optimal)

```
Tree (unbalanced):   1
                    /
                   2
                  /
                 3

dfs(3) → left=0, right=0, |0-0|≤1, return 1
dfs(2) → left=1, right=0, |1-0|≤1, return 2
dfs(1) → left=2, right=0, |2-0|=2 > 1, return -1

isBalanced = (-1 != -1) = false ✓
```

## Key Interview Insights

- **The -1 sentinel trick** is the key insight. Returning -1 to signal "invalid/unbalanced" lets you avoid an extra boolean return value and skip subtrees early.
- **O(n²) vs O(n):** Beginners compute `height()` separately inside `isBalanced()` — recognize and fix this pattern.
- **This exact trick appears in:** Validate BST (returning bounds), Binary Tree cameras, and any problem where you need to return both a computed value AND a validity flag in one function.
- **The balance condition checks EVERY node,** not just the root. A tree where the root is balanced but some deep subtree is not balanced is still unbalanced overall.
