---
title: Binary Tree Right Side View
difficulty: Medium
tags: [Tree, BFS, DFS, Queue]
link: https://leetcode.com/problems/binary-tree-right-side-view/
---

# Binary Tree Right Side View

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [199. Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/) |
| **Tags** | Tree, BFS, DFS, Queue |

## Problem Statement

Given the root of a binary tree, imagine yourself standing on the **right side** of it. Return the values of the nodes you can see ordered from top to bottom.

```
    1            ← see 1
   / \
  2   3          ← see 3
   \   \
    5   4        ← see 4

Output: [1, 3, 4]
```

Note: the rightmost node at each level is visible. If the right subtree is shorter, the leftmost node at a deeper level from the left subtree may be visible.

## Intuition

The right side view = **the last node at each level** when traversing left to right.

Two approaches:
1. **BFS:** Do level order traversal. At each level, take the last element.
2. **DFS (Preorder Right-first):** Traverse right child before left. First node visited at each depth = rightmost node at that depth.

## Approach 1: BFS — Last Node of Each Level

```cpp
vector<int> rightSideView(TreeNode* root) {
    vector<int> res;
    if (!root) return res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            if (i == size - 1) res.push_back(node->val);  // Last of level
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    return res;
}
```

```java
List<Integer> rightSideView(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            if (i == size - 1) res.add(node.val);
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
    }
    return res;
}
```

```typescript
function rightSideView(root: TreeNode | null): number[] {
    const res: number[] = [];
    if (!root) return res;
    const q: TreeNode[] = [root];
    while (q.length) {
        const size = q.length;
        for (let i = 0; i < size; i++) {
            const node = q.shift()!;
            if (i === size - 1) res.push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
    }
    return res;
}
```

```python
from collections import deque

def rightSideView(root: TreeNode | None) -> list[int]:
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        for i in range(len(q)):
            node = q.popleft()
            if i == len(q):     # Last element of this level
                res.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
    return res
```

```go
func rightSideView(root *TreeNode) []int {
    var res []int
    if root == nil { return res }
    q := []*TreeNode{root}
    for len(q) > 0 {
        size := len(q)
        for i := 0; i < size; i++ {
            node := q[0]; q = q[1:]
            if i == size-1 { res = append(res, node.Val) }
            if node.Left != nil { q = append(q, node.Left) }
            if node.Right != nil { q = append(q, node.Right) }
        }
    }
    return res
}
```

**Time:** O(n) — **Space:** O(w) max queue width

## Approach 2: DFS (Right-First Preorder)

Traverse right before left. The first node encountered at each depth is the rightmost.

```cpp
vector<int> res;

void dfs(TreeNode* root, int depth) {
    if (!root) return;
    if (depth == res.size()) res.push_back(root->val); // First at this depth
    dfs(root->right, depth + 1);   // Go RIGHT first
    dfs(root->left, depth + 1);
}

vector<int> rightSideView(TreeNode* root) {
    dfs(root, 0);
    return res;
}
```

```java
List<Integer> res = new ArrayList<>();

void dfs(TreeNode root, int depth) {
    if (root == null) return;
    if (depth == res.size()) res.add(root.val);
    dfs(root.right, depth + 1);
    dfs(root.left, depth + 1);
}

List<Integer> rightSideView(TreeNode root) {
    dfs(root, 0);
    return res;
}
```

```typescript
function rightSideView(root: TreeNode | null): number[] {
    const res: number[] = [];

    function dfs(node: TreeNode | null, depth: number): void {
        if (!node) return;
        if (depth === res.length) res.push(node.val);
        dfs(node.right, depth + 1);
        dfs(node.left, depth + 1);
    }

    dfs(root, 0);
    return res;
}
```

```python
def rightSideView(root: TreeNode | None) -> list[int]:
    res = []

    def dfs(node: TreeNode | None, depth: int) -> None:
        if not node:
            return
        if depth == len(res):    # First time at this depth
            res.append(node.val)
        dfs(node.right, depth + 1)   # Right first!
        dfs(node.left, depth + 1)

    dfs(root, 0)
    return res
```

```go
func rightSideView(root *TreeNode) []int {
    var res []int
    var dfs func(*TreeNode, int)
    dfs = func(node *TreeNode, depth int) {
        if node == nil { return }
        if depth == len(res) { res = append(res, node.Val) }
        dfs(node.Right, depth+1)
        dfs(node.Left, depth+1)
    }
    dfs(root, 0)
    return res
}
```

**Time:** O(n) — **Space:** O(h) call stack

## Left Side View Variant

Swap to left-first DFS or take the first element per BFS level.

```python
# DFS: visit left before right
dfs(node.left, depth + 1)
dfs(node.right, depth + 1)
```

## Key Interview Insights

- **BFS approach is more intuitive** — the right side view is literally the last node at each BFS level.
- **DFS approach is more elegant** — the `depth == res.size()` check naturally captures only the first node seen at each depth when going right-first.
- **Tricky edge:** If the right subtree is shorter than the left, the "visible" node at a deeper level comes from the left subtree. Both approaches handle this correctly.
- **Follow-up:** "What if we want BOTH left and right side views?" — Run both DFS traversals or take both first and last per BFS level.
