---
title: Invert Binary Tree
difficulty: Easy
tags: [Tree, DFS, BFS, Recursion]
link: https://leetcode.com/problems/invert-binary-tree/
---

# Invert Binary Tree

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [226. Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/) |
| **Tags** | Tree, DFS, BFS, Recursion |

## Problem Statement

Given the root of a binary tree, invert it (mirror it), and return its root.

```
Input:          Output:
    4               4
   / \             / \
  2   7    →      7   2
 / \ / \         / \ / \
1  3 6  9       9  6 3  1
```

## Intuition

To invert a tree, swap the left and right children at every node. Since this must happen for every node, use recursion:

1. Invert the left subtree
2. Invert the right subtree
3. Swap left and right children of current node

The order matters slightly — you must save the reference before overwriting. The cleanest approach swaps first, then recurses (preorder), or recurses first, then swaps (postorder). Both work.

## Approach 1: Recursive DFS (Preorder)

Swap first, then recurse into children.

```cpp
TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    swap(root->left, root->right);    // Swap children
    invertTree(root->left);
    invertTree(root->right);
    return root;
}
```

```java
TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode tmp = root.left;
    root.left = root.right;
    root.right = tmp;
    invertTree(root.left);
    invertTree(root.right);
    return root;
}
```

```typescript
function invertTree(root: TreeNode | null): TreeNode | null {
    if (!root) return null;
    [root.left, root.right] = [root.right, root.left];
    invertTree(root.left);
    invertTree(root.right);
    return root;
}
```

```python
def invertTree(root: TreeNode | None) -> TreeNode | None:
    if not root:
        return None
    root.left, root.right = root.right, root.left
    invertTree(root.left)
    invertTree(root.right)
    return root
```

```go
func invertTree(root *TreeNode) *TreeNode {
    if root == nil { return nil }
    root.Left, root.Right = root.Right, root.Left
    invertTree(root.Left)
    invertTree(root.Right)
    return root
}
```

**Time:** O(n) — **Space:** O(h)

## Approach 2: Recursive DFS (Postorder)

Recurse into children first, then swap. Also valid and arguably more natural as "fix children, then fix self":

```cpp
TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* left = invertTree(root->left);
    TreeNode* right = invertTree(root->right);
    root->left = right;
    root->right = left;
    return root;
}
```

```java
TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode left = invertTree(root.left);
    TreeNode right = invertTree(root.right);
    root.left = right;
    root.right = left;
    return root;
}
```

```typescript
function invertTree(root: TreeNode | null): TreeNode | null {
    if (!root) return null;
    const left = invertTree(root.left);
    const right = invertTree(root.right);
    root.left = right;
    root.right = left;
    return root;
}
```

```python
def invertTree(root: TreeNode | None) -> TreeNode | None:
    if not root:
        return None
    left = invertTree(root.left)
    right = invertTree(root.right)
    root.left, root.right = right, left
    return root
```

```go
func invertTree(root *TreeNode) *TreeNode {
    if root == nil { return nil }
    left, right := invertTree(root.Left), invertTree(root.Right)
    root.Left, root.Right = right, left
    return root
}
```

## Approach 3: Iterative BFS

Use a queue. For each node dequeued, swap its children and enqueue both.

```cpp
TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        swap(node->left, node->right);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return root;
}
```

```java
TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        TreeNode node = q.poll();
        TreeNode tmp = node.left;
        node.left = node.right;
        node.right = tmp;
        if (node.left != null) q.offer(node.left);
        if (node.right != null) q.offer(node.right);
    }
    return root;
}
```

```typescript
function invertTree(root: TreeNode | null): TreeNode | null {
    if (!root) return null;
    const q: TreeNode[] = [root];
    while (q.length) {
        const node = q.shift()!;
        [node.left, node.right] = [node.right, node.left];
        if (node.left) q.push(node.left);
        if (node.right) q.push(node.right);
    }
    return root;
}
```

```python
from collections import deque

def invertTree(root: TreeNode | None) -> TreeNode | None:
    if not root:
        return None
    q = deque([root])
    while q:
        node = q.popleft()
        node.left, node.right = node.right, node.left
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)
    return root
```

```go
func invertTree(root *TreeNode) *TreeNode {
    if root == nil { return nil }
    q := []*TreeNode{root}
    for len(q) > 0 {
        node := q[0]; q = q[1:]
        node.Left, node.Right = node.Right, node.Left
        if node.Left != nil { q = append(q, node.Left) }
        if node.Right != nil { q = append(q, node.Right) }
    }
    return root
}
```

**Time:** O(n) — **Space:** O(w) max queue width

## Key Interview Insights

- **All three approaches are O(n) time.** The one-liner postorder recursive is the cleanest.
- **Python and TypeScript swap syntax** (`a, b = b, a`) makes the code elegantly brief.
- **"Homogenous" mutation:** Every single node gets swapped — you can't skip any. The recursion ensures this.
- **The famous tweet:** This problem went viral when Max Howell (author of Homebrew) tweeted that Google rejected him for not being able to invert a binary tree. It's now a symbolic "easy" problem — perfect to solve in under 2 minutes.
