---
title: Maximum Depth of Binary Tree
difficulty: Easy
tags: [Tree, DFS, BFS, Recursion]
link: https://leetcode.com/problems/maximum-depth-of-binary-tree/
---

# Maximum Depth of Binary Tree

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [104. Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/) |
| **Tags** | Tree, DFS, BFS, Recursion |

## Problem Statement

Given the root of a binary tree, return its **maximum depth** — the number of nodes along the longest path from the root node to the farthest leaf node.

```
    3          Depth = 3
   / \
  9  20
    /  \
   15   7
```

## Intuition

The depth of a tree rooted at `node` is: `1 + max(depth(left), depth(right))`.

Base case: an empty tree has depth 0.

This is the classic **return-value recursion (postorder)** template: compute from children, combine at current node.

## Approach 1: Recursive DFS

```cpp
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}
```

```java
int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

```typescript
function maxDepth(root: TreeNode | null): number {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

```python
def maxDepth(root: TreeNode | None) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))
```

```go
func maxDepth(root *TreeNode) int {
    if root == nil { return 0 }
    left, right := maxDepth(root.Left), maxDepth(root.Right)
    if left > right { return left + 1 }
    return right + 1
}
```

**Time:** O(n) — visits every node once  
**Space:** O(h) — call stack; O(log n) balanced, O(n) skewed

## Approach 2: Iterative BFS (Level Count)

Count the number of levels using BFS. Each level increment = 1 depth.

```cpp
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    queue<TreeNode*> q;
    q.push(root);
    int depth = 0;
    while (!q.empty()) {
        depth++;
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return depth;
}
```

```java
int maxDepth(TreeNode root) {
    if (root == null) return 0;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    int depth = 0;
    while (!q.isEmpty()) {
        depth++;
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
    }
    return depth;
}
```

```typescript
function maxDepth(root: TreeNode | null): number {
    if (!root) return 0;
    const q: TreeNode[] = [root];
    let depth = 0;
    while (q.length) {
        depth++;
        const size = q.length;
        for (let i = 0; i < size; i++) {
            const node = q.shift()!;
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
    }
    return depth;
}
```

```python
from collections import deque

def maxDepth(root: TreeNode | None) -> int:
    if not root:
        return 0
    q = deque([root])
    depth = 0
    while q:
        depth += 1
        for _ in range(len(q)):
            node = q.popleft()
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
    return depth
```

```go
func maxDepth(root *TreeNode) int {
    if root == nil { return 0 }
    q := []*TreeNode{root}
    depth := 0
    for len(q) > 0 {
        depth++
        for size := len(q); size > 0; size-- {
            node := q[0]; q = q[1:]
            if node.Left != nil { q = append(q, node.Left) }
            if node.Right != nil { q = append(q, node.Right) }
        }
    }
    return depth
}
```

**Time:** O(n) — **Space:** O(w) where w = max width ≤ n/2

## Dry Run

```
Tree:  3
      / \
     9  20
       /  \
      15   7

Recursive:
maxDepth(3) = 1 + max(maxDepth(9), maxDepth(20))
           = 1 + max(1, 1 + max(1, 1))
           = 1 + max(1, 2)
           = 1 + 2 = 3 ✓
```

## Key Interview Insights

- **This is the simplest postorder DFS pattern.** The one-liner recursive solution is ideal — mention it shows you understand recursion on trees.
- **BFS alternative** is useful when the interviewer asks for an iterative solution or mentions stack overflow concerns.
- **Edge cases:** Single node → depth 1. Empty tree → depth 0. Always check `!root` first.
- **Minimum depth (LC 111)** is trickier: you can't just return `1 + min(left, right)` because a node with one null child is not a leaf. Check for `null` children explicitly.
