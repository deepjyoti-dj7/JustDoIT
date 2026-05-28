---
title: Subtree of Another Tree
difficulty: Easy
tags: [Tree, DFS, String Matching, Hash]
link: https://leetcode.com/problems/subtree-of-another-tree/
---

# Subtree of Another Tree

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [572. Subtree of Another Tree](https://leetcode.com/problems/subtree-of-another-tree/) |
| **Tags** | Tree, DFS, String Matching, Hash |

## Problem Statement

Given the roots of two binary trees `root` and `subRoot`, return `true` if there is a subtree of `root` with the same structure and node values as `subRoot`, and `false` otherwise.

A subtree of a tree is a node in the tree and all its descendants.

```
root:       3              subRoot:   4
           / \                       / \
          4   5                     1   2
         / \
        1   2

3's subtree rooted at 4 matches subRoot → return true

Another example:
root:       3              subRoot:   4
           / \                       / \
          4   5                     1   2
         / \
        1   2
           /
          0

NOT a match — root's subtree has an extra node 0 below node 2
```

## Intuition

At each node of `root`, check if the subtree rooted there **exactly matches** `subRoot`. This is `isSameTree()` applied at every node.

Two functions work together:
1. `isSubtree(root, sub)` — try `isSameTree` at every node of `root`
2. `isSameTree(a, b)` — check structural and value equality (from LC 100)

## Approach 1: DFS at Every Node — O(m×n)

```cpp
bool isSameTree(TreeNode* a, TreeNode* b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a->val != b->val) return false;
    return isSameTree(a->left, b->left) && isSameTree(a->right, b->right);
}

bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    if (!root) return false;
    if (isSameTree(root, subRoot)) return true;
    return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
}
```

```java
boolean isSameTree(TreeNode a, TreeNode b) {
    if (a == null && b == null) return true;
    if (a == null || b == null) return false;
    if (a.val != b.val) return false;
    return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}

boolean isSubtree(TreeNode root, TreeNode subRoot) {
    if (root == null) return false;
    if (isSameTree(root, subRoot)) return true;
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
```

```typescript
function isSameTree(a: TreeNode | null, b: TreeNode | null): boolean {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.val !== b.val) return false;
    return isSameTree(a.left, b.left) && isSameTree(a.right, b.right);
}

function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    if (!root) return false;
    if (isSameTree(root, subRoot)) return true;
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
```

```python
def isSameTree(a: TreeNode | None, b: TreeNode | None) -> bool:
    if not a and not b: return True
    if not a or not b: return False
    if a.val != b.val: return False
    return isSameTree(a.left, b.left) and isSameTree(a.right, b.right)

def isSubtree(root: TreeNode | None, subRoot: TreeNode | None) -> bool:
    if not root:
        return False
    if isSameTree(root, subRoot):
        return True
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)
```

```go
func isSameTree(a, b *TreeNode) bool {
    if a == nil && b == nil { return true }
    if a == nil || b == nil { return false }
    if a.Val != b.Val { return false }
    return isSameTree(a.Left, b.Left) && isSameTree(a.Right, b.Right)
}

func isSubtree(root *TreeNode, subRoot *TreeNode) bool {
    if root == nil { return false }
    if isSameTree(root, subRoot) { return true }
    return isSubtree(root.Left, subRoot) || isSubtree(root.Right, subRoot)
}
```

**Time:** O(m × n) where m = nodes in root, n = nodes in subRoot  
**Space:** O(h1 + h2) — combined recursion depth

## Approach 2: Serialize + String Matching — O(m + n)

Serialize both trees to strings (with structural markers), then check if the subRoot string is a substring of the root string.

```cpp
string serialize(TreeNode* root) {
    if (!root) return "#";
    return "," + to_string(root->val) +
           "," + serialize(root->left) +
           "," + serialize(root->right);
}

bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    string s = serialize(root);
    string t = serialize(subRoot);
    return s.find(t) != string::npos;
}
```

```java
String serialize(TreeNode root) {
    if (root == null) return "#";
    return "," + root.val + "," + serialize(root.left) + "," + serialize(root.right);
}

boolean isSubtree(TreeNode root, TreeNode subRoot) {
    return serialize(root).contains(serialize(subRoot));
}
```

```typescript
function serialize(root: TreeNode | null): string {
    if (!root) return '#';
    return `,${root.val},${serialize(root.left)},${serialize(root.right)}`;
}

function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
    return serialize(root).includes(serialize(subRoot!));
}
```

```python
def serialize(root: TreeNode | None) -> str:
    if not root:
        return '#'
    return f',{root.val},{serialize(root.left)},{serialize(root.right)}'

def isSubtree(root: TreeNode | None, subRoot: TreeNode | None) -> bool:
    return serialize(subRoot) in serialize(root)
```

```go
func serialize(root *TreeNode) string {
    if root == nil { return "#" }
    return fmt.Sprintf(",%d,%s,%s", root.Val, serialize(root.Left), serialize(root.Right))
}

func isSubtree(root *TreeNode, subRoot *TreeNode) bool {
    return strings.Contains(serialize(root), serialize(subRoot))
}
```

**Time:** O(m + n) — serialization, O(m × n) for naive substring search (KMP makes it O(m + n))  
**Space:** O(m + n) — string storage

## Critical Serialization Note

Using `serialize(root) = "12"` and `serialize(subRoot) = "2"` would falsely match! You **must** use delimiters (`,` before each value) to prevent partial number matches.

## Comparison

| Approach | Time | Space | Notes |
|---|---|---|---|
| DFS at every node | O(m × n) | O(h1+h2) | Simple, interview-standard |
| Serialize + substring | O(m + n) with KMP | O(m + n) | Clever; needs delimiter care |

For most interviews, the O(m×n) DFS approach is expected and sufficient.

## Key Interview Insights

- **Reuse `isSameTree`:** This problem is `isSameTree` applied at every node. Recognize the composition.
- **Short-circuit:** `isSubtree(root.left, sub) || isSubtree(root.right, sub)` — once a match is found in the left subtree, the right subtree is not checked.
- **The serialization trick** is elegant but requires care with delimiters. Always add `,` before the value (not just between) to differentiate single-digit numbers.
- **Not any node — a full subtree:** A subtree is a node AND all its descendants. The `subRoot` must match an entire subtree of `root`, not just a partial match.
