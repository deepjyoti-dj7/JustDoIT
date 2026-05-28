---
title: Binary Tree Level Order Traversal
difficulty: Medium
tags: [Tree, BFS, Queue]
link: https://leetcode.com/problems/binary-tree-level-order-traversal/
---

# Binary Tree Level Order Traversal

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) |
| **Tags** | Tree, BFS, Queue |

## Problem Statement

Given the root of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).

```
    3
   / \
  9  20
    /  \
   15   7

Output: [[3], [9, 20], [15, 7]]
```

## Intuition

Level order traversal = BFS on a tree. Use a queue.

The key trick: **snapshot the queue size before the inner loop** — that tells you how many nodes are in the current level. Process exactly that many, then increment the level.

Without snapshotting `size`, you'd process future levels' nodes in the current iteration.

## Approach: BFS with Queue

```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;

    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int size = q.size();         // Nodes at this level
        vector<int> level;
        for (int i = 0; i < size; i++) {
            TreeNode* node = q.front(); q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        res.push_back(level);
    }
    return res;
}
```

```java
List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;

    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);

    while (!q.isEmpty()) {
        int size = q.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = q.poll();
            level.add(node.val);
            if (node.left != null) q.offer(node.left);
            if (node.right != null) q.offer(node.right);
        }
        res.add(level);
    }
    return res;
}
```

```typescript
function levelOrder(root: TreeNode | null): number[][] {
    const res: number[][] = [];
    if (!root) return res;

    const q: TreeNode[] = [root];

    while (q.length) {
        const size = q.length;
        const level: number[] = [];
        for (let i = 0; i < size; i++) {
            const node = q.shift()!;
            level.push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
        res.push(level);
    }
    return res;
}
```

```python
from collections import deque

def levelOrder(root: TreeNode | None) -> list[list[int]]:
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):     # Snapshot size before inner loop
            node = q.popleft()
            level.append(node.val)
            if node.left: q.append(node.left)
            if node.right: q.append(node.right)
        res.append(level)
    return res
```

```go
func levelOrder(root *TreeNode) [][]int {
    var res [][]int
    if root == nil { return res }
    q := []*TreeNode{root}
    for len(q) > 0 {
        size := len(q)
        level := make([]int, 0, size)
        for i := 0; i < size; i++ {
            node := q[0]; q = q[1:]
            level = append(level, node.Val)
            if node.Left != nil { q = append(q, node.Left) }
            if node.Right != nil { q = append(q, node.Right) }
        }
        res = append(res, level)
    }
    return res
}
```

**Time:** O(n) — **Space:** O(w) where w = max width

## Variations on the Same Template

This BFS template powers many problems. Adapt the inner loop:

### Reverse Level Order (LC 107)

```python
res.appendleft(level)   # Or: return res[::-1] at the end
```

### Zigzag Level Order (LC 103)

```python
if level_idx % 2 == 1:
    level.reverse()     # Or use deque and appendleft at odd levels
res.append(level)
```

### Right Side View (LC 199)

```python
res.append(level[-1])   # Last element at each level
```

### Average of Levels (LC 637)

```python
res.append(sum(level) / len(level))
```

### Maximum Width (LC 662)

Assign index to each node: left child = `2*i`, right child = `2*i+1`. Width = `last_index - first_index + 1`.

## Dry Run

```
Tree:    3
        / \
       9  20
         /  \
        15   7

Level 0: q=[3],    process 3, enqueue 9, 20 → level=[3]
Level 1: q=[9,20], process 9 (no children), 20 (enqueue 15, 7) → level=[9,20]
Level 2: q=[15,7], process 15, 7 → level=[15,7]

Result: [[3],[9,20],[15,7]] ✓
```

## Key Interview Insights

- **The size-snapshot trick is the core of BFS level separation.** Without `size = q.size()` before the inner loop, you lose level boundaries.
- **`q.shift()` in TypeScript is O(n).** In production code, use a proper queue (index-based). In interviews, it's acceptable.
- **Python's `len(q)` inside `for _ in range(len(q))`** — `len(q)` is evaluated once at loop start, so adding to `q` in the loop body doesn't expand the range. This is the snapshot.
- **This is the universal "process by levels" template.** Know it cold — it applies to right side view, zigzag, maximum depth via BFS, minimum depth, connect next right pointers, and more.
