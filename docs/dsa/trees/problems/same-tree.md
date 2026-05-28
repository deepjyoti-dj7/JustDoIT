---
title: Same Tree
difficulty: Easy
tags: [Tree, DFS, BFS, Recursion]
link: https://leetcode.com/problems/same-tree/
---

# Same Tree

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [100. Same Tree](https://leetcode.com/problems/same-tree/) |
| **Tags** | Tree, DFS, BFS, Recursion |

## Problem Statement

Given the roots of two binary trees `p` and `q`, return `true` if they are **structurally identical** with the **same node values**, `false` otherwise.

```
p:      q:       Same? 
  1       1      ✓
 / \     / \
2   3   2   3

p:      q:       Same? 
  1       1      ✗
 /         \
2           2
```

## Intuition

Two trees are the same if:
1. Both are `null` → true
2. Exactly one is `null` → false (structural mismatch)
3. Current node values differ → false
4. Left subtrees are the same AND right subtrees are the same

This is a natural recursive definition — process children results and combine at the current node (postorder).

## Approach 1: Recursive DFS

```cpp
bool isSameTree(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;          // Both null
    if (!p || !q) return false;         // One null
    if (p->val != q->val) return false; // Values differ
    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}
```

```java
boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    if (p.val != q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

```typescript
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    if (!p && !q) return true;
    if (!p || !q) return false;
    if (p.val !== q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}
```

```python
def isSameTree(p: TreeNode | None, q: TreeNode | None) -> bool:
    if not p and not q:
        return True
    if not p or not q:
        return False
    if p.val != q.val:
        return False
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)
```

```go
func isSameTree(p *TreeNode, q *TreeNode) bool {
    if p == nil && q == nil { return true }
    if p == nil || q == nil { return false }
    if p.Val != q.Val { return false }
    return isSameTree(p.Left, q.Left) && isSameTree(p.Right, q.Right)
}
```

**Time:** O(min(n, m)) — stops at first mismatch  
**Space:** O(min(h1, h2)) — call stack depth

## Approach 2: Iterative BFS

Use a queue of paired nodes. Dequeue a pair, check them, then enqueue their children as pairs.

```cpp
bool isSameTree(TreeNode* p, TreeNode* q) {
    queue<pair<TreeNode*, TreeNode*>> queue;
    queue.push({p, q});
    while (!queue.empty()) {
        auto [a, b] = queue.front(); queue.pop();
        if (!a && !b) continue;
        if (!a || !b || a->val != b->val) return false;
        queue.push({a->left, b->left});
        queue.push({a->right, b->right});
    }
    return true;
}
```

```java
boolean isSameTree(TreeNode p, TreeNode q) {
    Deque<TreeNode[]> queue = new ArrayDeque<>();
    queue.offer(new TreeNode[]{p, q});
    while (!queue.isEmpty()) {
        TreeNode[] pair = queue.poll();
        TreeNode a = pair[0], b = pair[1];
        if (a == null && b == null) continue;
        if (a == null || b == null || a.val != b.val) return false;
        queue.offer(new TreeNode[]{a.left, b.left});
        queue.offer(new TreeNode[]{a.right, b.right});
    }
    return true;
}
```

```typescript
function isSameTree(p: TreeNode | null, q: TreeNode | null): boolean {
    const queue: [TreeNode | null, TreeNode | null][] = [[p, q]];
    while (queue.length) {
        const [a, b] = queue.shift()!;
        if (!a && !b) continue;
        if (!a || !b || a.val !== b.val) return false;
        queue.push([a.left, b.left]);
        queue.push([a.right, b.right]);
    }
    return true;
}
```

```python
from collections import deque

def isSameTree(p: TreeNode | None, q: TreeNode | None) -> bool:
    queue = deque([(p, q)])
    while queue:
        a, b = queue.popleft()
        if not a and not b:
            continue
        if not a or not b or a.val != b.val:
            return False
        queue.append((a.left, b.left))
        queue.append((a.right, b.right))
    return True
```

```go
func isSameTree(p *TreeNode, q *TreeNode) bool {
    type pair struct{ a, b *TreeNode }
    queue := []pair{{p, q}}
    for len(queue) > 0 {
        cur := queue[0]; queue = queue[1:]
        a, b := cur.a, cur.b
        if a == nil && b == nil { continue }
        if a == nil || b == nil || a.Val != b.Val { return false }
        queue = append(queue, pair{a.Left, b.Left}, pair{a.Right, b.Right})
    }
    return true
}
```

## Key Interview Insights

- **Three conditions, in order:** Both null (match), one null (mismatch), values differ (mismatch). This order is critical — check nulls before accessing `.val`.
- **Short-circuit evaluation** in `&&`: once the left subtrees don't match, right subtrees aren't checked. This gives early termination.
- **This pattern recurs in:** Subtree of Another Tree (run `isSameTree` at every node), symmetric tree (compare left to right mirror), and tree serialization validation.
- **Structural vs value equivalence:** Both must hold — two trees with same values but different shapes are NOT the same tree.
