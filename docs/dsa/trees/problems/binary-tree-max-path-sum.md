---
title: Binary Tree Maximum Path Sum
difficulty: Hard
tags: [Tree, DFS, Dynamic Programming, Recursion]
link: https://leetcode.com/problems/binary-tree-maximum-path-sum/
---

# Binary Tree Maximum Path Sum

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/) |
| **Tags** | Tree, DFS, Dynamic Programming, Recursion |

## Problem Statement

Given the root of a binary tree where node values can be **negative**, return the **maximum path sum** of any non-empty path.

A path is any sequence of nodes from some starting node to any node in the tree along parent-child connections. The path must contain at least one node and **does not need to pass through the root**.

```
Example 1:          Example 2:
   -10                    1
   /  \                  / \
  9   20                2   3
     /  \
    15   7

Max = 15 + 20 + 7 = 42    Max = 2 + 1 + 3 = 6
```

## Intuition

This is the **weighted version of Diameter of Binary Tree** (LC 543).

For each node, the maximum path **through it** is:
```
node.val + max(0, left_gain) + max(0, right_gain)
```

We take `max(0, gain)` because if a subtree contributes a negative sum, we're better off not including it.

However, a path can only **turn** at one node — it can go left **or** right downward, not both (if it needs to be a valid top-down path). So what we return to the parent is:

```
node.val + max(0, left_gain, right_gain)   // Only one branch
```

But we update the global answer with the full path through this node (both branches).

This is the **"global state" DFS pattern**:
- Return: max gain this node can contribute to its parent (one-sided path)
- Update: global max with the best path **through** this node (both-sided)

## Core Pattern: Diameter + Weights

```
Diameter pattern:            This problem:
  ans = max(ans, L + R)        ans = max(ans, node.val + max(0,L) + max(0,R))
  return 1 + max(L, R)         return node.val + max(0, max(L, R))
```

The difference: node values are added, and we clamp to 0 (skip negative subtrees).

## Approach: Single DFS with Global Max — O(n)

```cpp
class Solution {
    int ans = INT_MIN;

    int dfs(TreeNode* node) {
        if (!node) return 0;

        int left  = max(0, dfs(node->left));   // Clamp negative to 0
        int right = max(0, dfs(node->right));

        ans = max(ans, node->val + left + right);  // Path THROUGH this node

        return node->val + max(left, right);       // Best one-sided gain for parent
    }

public:
    int maxPathSum(TreeNode* root) {
        dfs(root);
        return ans;
    }
};
```

```java
class Solution {
    int ans = Integer.MIN_VALUE;

    int dfs(TreeNode node) {
        if (node == null) return 0;

        int left  = Math.max(0, dfs(node.left));
        int right = Math.max(0, dfs(node.right));

        ans = Math.max(ans, node.val + left + right);

        return node.val + Math.max(left, right);
    }

    public int maxPathSum(TreeNode root) {
        dfs(root);
        return ans;
    }
}
```

```typescript
function maxPathSum(root: TreeNode | null): number {
    let ans = -Infinity;

    function dfs(node: TreeNode | null): number {
        if (!node) return 0;

        const left  = Math.max(0, dfs(node.left));
        const right = Math.max(0, dfs(node.right));

        ans = Math.max(ans, node.val + left + right);

        return node.val + Math.max(left, right);
    }

    dfs(root);
    return ans;
}
```

```python
def maxPathSum(root: TreeNode | None) -> int:
    ans = float('-inf')

    def dfs(node: TreeNode | None) -> int:
        nonlocal ans
        if not node:
            return 0

        left  = max(0, dfs(node.left))    # Discard negative contributions
        right = max(0, dfs(node.right))

        ans = max(ans, node.val + left + right)  # Full path through this node

        return node.val + max(left, right)       # One-sided gain for parent

    dfs(root)
    return ans
```

```go
func maxPathSum(root *TreeNode) int {
    ans := math.MinInt32

    var dfs func(*TreeNode) int
    dfs = func(node *TreeNode) int {
        if node == nil { return 0 }

        left  := max(0, dfs(node.Left))
        right := max(0, dfs(node.Right))

        if node.Val + left + right > ans { ans = node.Val + left + right }

        if left > right { return node.Val + left }
        return node.Val + right
    }

    dfs(root)
    return ans
}

func max(a, b int) int {
    if a > b { return a }
    return b
}
```

**Time:** O(n) — each node visited once  
**Space:** O(h) — recursion depth

## Dry Run

```
Tree:   -10
        /  \
       9   20
          /  \
         15   7

dfs(9)  → left=0, right=0, ans=max(-∞, 9+0+0)=9,   return 9
dfs(15) → left=0, right=0, ans=max(9, 15)=15,       return 15
dfs(7)  → left=0, right=0, ans=max(15, 7)=15,       return 7
dfs(20) → left=max(0,15)=15, right=max(0,7)=7
           ans=max(15, 20+15+7)=42                  return 20+15=35
dfs(-10)→ left=max(0,9)=9, right=max(0,35)=35
           ans=max(42, -10+9+35)=max(42,34)=42       return -10+35=25

Final: 42 ✓
```

## Edge Cases

| Case | Handling |
|---|---|
| All negative values | `ans = INT_MIN`, never replaced by 0 — at least one node is included |
| Single node | ans = node.val |
| Path is a single leaf | Works — left=0, right=0, ans=node.val |
| Path doesn't include root | Works — ans updated at each node, not just root |
| Negative subtree contributions | Clamped to 0 with `max(0, dfs(...))` |

## Why `max(0, gain)` but Initialize `ans = INT_MIN`?

Subtle distinction:
- **`max(0, gain)` for left/right:** When deciding to *include* a subtree in a path through the current node, we only include it if it helps (non-negative). If negative, skip it.
- **`ans = INT_MIN` not 0:** The answer must include at least one node. If all nodes are negative (e.g., `[-1, -2, -3]`), the answer is `-1` (the maximum single node), not 0.

Clamping `ans` to 0 would incorrectly return 0 for all-negative trees.

## Key Interview Insights

- **This is Diameter of Binary Tree with weights** — recognize the pattern immediately.
- **Two return values in one function:** `dfs` returns the one-sided gain (for the parent) but updates `ans` with the two-sided path (for the final answer). Mastering this dual-purpose DFS is critical.
- **Clamping negative subtrees to 0** is elegant: `max(0, dfs(child))` means "include this subtree only if it's beneficial."
- **Initialize `ans = INT_MIN`**, not 0 — a tree of all-negative values still has a valid maximum path (the largest single node).
- **The path "turning point":** Each node considers itself as the highest node in the path. The optimal turning node is where the global max is found. This is guaranteed by checking every node.
