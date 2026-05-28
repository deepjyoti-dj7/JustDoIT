---
title: Diameter of Binary Tree
difficulty: Easy
tags: [Tree, DFS, Recursion]
link: https://leetcode.com/problems/diameter-of-binary-tree/
---

# Diameter of Binary Tree

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [543. Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/) |
| **Tags** | Tree, DFS, Recursion |

## Problem Statement

Given the root of a binary tree, return the **diameter** — the length of the **longest path between any two nodes**. The path may or may not pass through the root.

The length of a path is the **number of edges** between nodes.

```
        1
       / \
      2   3
     / \
    4   5

Longest path: 4 → 2 → 1 → 3 (length 3)
              OR: 4 → 2 → 5 (length 2)

Diameter = 3
```

## Intuition

The diameter is the longest path in the tree. A path must pass through some node as its "highest point" (turning point). For each node, the longest path through it is:

```
height(left subtree) + height(right subtree)
```

So: **compute the height of every node, and track the maximum path at each node as a global answer**.

This is the "global state" DFS pattern:
- Return the height from each subtree call
- Update a global `max` with `left_height + right_height`
- Answer is the global max

## Approach 1: Brute Force — O(n²)

For each node, compute `depth(left) + depth(right)`. Computing depth for each node separately is O(n) per node.

This is too slow but illustrates the naive approach:

```cpp
int height(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(height(root->left), height(root->right));
}

int diameterOfBinaryTree(TreeNode* root) {
    if (!root) return 0;
    int leftH = height(root->left);
    int rightH = height(root->right);
    int throughRoot = leftH + rightH;
    int leftDiam = diameterOfBinaryTree(root->left);
    int rightDiam = diameterOfBinaryTree(root->right);
    return max({throughRoot, leftDiam, rightDiam});
}
```

```java
int height(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(height(root.left), height(root.right));
}
int diameterOfBinaryTree(TreeNode root) {
    if (root == null) return 0;
    int through = height(root.left) + height(root.right);
    return Math.max(through, Math.max(
        diameterOfBinaryTree(root.left), diameterOfBinaryTree(root.right)));
}
```

```typescript
function height(root: TreeNode | null): number {
    if (!root) return 0;
    return 1 + Math.max(height(root.left), height(root.right));
}
function diameterOfBinaryTree(root: TreeNode | null): number {
    if (!root) return 0;
    return Math.max(
        height(root.left) + height(root.right),
        diameterOfBinaryTree(root.left),
        diameterOfBinaryTree(root.right)
    );
}
```

```python
def height(root: TreeNode | None) -> int:
    if not root: return 0
    return 1 + max(height(root.left), height(root.right))

def diameterOfBinaryTree(root: TreeNode | None) -> int:
    if not root: return 0
    through = height(root.left) + height(root.right)
    return max(through, diameterOfBinaryTree(root.left), diameterOfBinaryTree(root.right))
```

```go
func height(root *TreeNode) int {
    if root == nil { return 0 }
    if l, r := height(root.Left), height(root.Right); l > r { return l + 1 }
    return height(root.Right) + 1
}
func diameterOfBinaryTree(root *TreeNode) int {
    if root == nil { return 0 }
    through := height(root.Left) + height(root.Right)
    if l := diameterOfBinaryTree(root.Left); l > through { through = l }
    if r := diameterOfBinaryTree(root.Right); r > through { through = r }
    return through
}
```

**Time:** O(n²) — height recomputed for every node

## Approach 2: Optimal — Single DFS with Global Max — O(n)

Compute height and update the global maximum in one pass.

```cpp
class Solution {
    int ans = 0;

    int dfs(TreeNode* root) {
        if (!root) return 0;
        int left = dfs(root->left);
        int right = dfs(root->right);
        ans = max(ans, left + right);  // Path through current node
        return 1 + max(left, right);  // Height returned to parent
    }
public:
    int diameterOfBinaryTree(TreeNode* root) {
        dfs(root);
        return ans;
    }
};
```

```java
class Solution {
    int ans = 0;

    int dfs(TreeNode root) {
        if (root == null) return 0;
        int left = dfs(root.left);
        int right = dfs(root.right);
        ans = Math.max(ans, left + right);
        return 1 + Math.max(left, right);
    }

    public int diameterOfBinaryTree(TreeNode root) {
        dfs(root);
        return ans;
    }
}
```

```typescript
function diameterOfBinaryTree(root: TreeNode | null): number {
    let ans = 0;

    function dfs(node: TreeNode | null): number {
        if (!node) return 0;
        const left = dfs(node.left);
        const right = dfs(node.right);
        ans = Math.max(ans, left + right);
        return 1 + Math.max(left, right);
    }

    dfs(root);
    return ans;
}
```

```python
def diameterOfBinaryTree(root: TreeNode | None) -> int:
    ans = 0

    def dfs(node: TreeNode | None) -> int:
        nonlocal ans
        if not node:
            return 0
        left = dfs(node.left)
        right = dfs(node.right)
        ans = max(ans, left + right)   # Candidate diameter through this node
        return 1 + max(left, right)    # Height reported to parent

    dfs(root)
    return ans
```

```go
func diameterOfBinaryTree(root *TreeNode) int {
    ans := 0

    var dfs func(*TreeNode) int
    dfs = func(node *TreeNode) int {
        if node == nil { return 0 }
        left, right := dfs(node.Left), dfs(node.Right)
        if left+right > ans { ans = left + right }
        if left > right { return left + 1 }
        return right + 1
    }

    dfs(root)
    return ans
}
```

**Time:** O(n) — each node visited once  
**Space:** O(h) — recursion depth

## Dry Run

```
Tree:    1
        / \
       2   3
      / \
     4   5

dfs(4) → left=0, right=0, ans=max(0,0)=0, return 1
dfs(5) → left=0, right=0, ans=max(0,0)=0, return 1
dfs(2) → left=1, right=1, ans=max(0,1+1)=2, return 2
dfs(3) → left=0, right=0, ans=max(2,0)=2, return 1
dfs(1) → left=2, right=1, ans=max(2,2+1)=3, return 3

Final ans = 3 ✓
```

## Key Interview Insights

- **The dual return values pattern:** `dfs` returns `height` (for its parent) but updates `ans` (for the final answer) as a side effect. These two roles coexist in one function.
- **Diameter ≠ 2×height.** The diameter is found by combining heights of left and right subtrees at the optimal turning node.
- **The path doesn't have to go through the root.** This catches beginners who only consider `height(left) + height(right)` at the root.
- **Edge case:** Single node → diameter = 0 (no edges). Two nodes → diameter = 1. The `0` base case handles this correctly.
- **Binary Tree Maximum Path Sum** (LC 124) is the weighted version of this problem — same pattern, just add node values instead of heights.
