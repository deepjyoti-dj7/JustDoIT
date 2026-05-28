---
title: Kth Smallest Element in BST
difficulty: Medium
tags: [Tree, BST, DFS, Inorder]
link: https://leetcode.com/problems/kth-smallest-element-in-a-bst/
---

# Kth Smallest Element in BST

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [230. Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) |
| **Tags** | Tree, BST, DFS, Inorder |

## Problem Statement

Given the root of a BST and an integer `k`, return the **k-th smallest value** (1-indexed) of all the values of the nodes.

```
BST:     3
        / \
       1   4
        \
         2

k=1 → 1, k=2 → 2, k=3 → 3, k=4 → 4
```

## Intuition

**Key insight:** Inorder traversal of a BST produces elements in **sorted ascending order**.

So the k-th smallest element = the k-th element produced by inorder traversal.

Two approaches:
1. **Collect all values in inorder, return index k-1** — simple but O(n) space.
2. **Inorder with counter, stop early at k** — O(k) time, O(h) space (optimal).

## Approach 1: Collect Inorder — O(n) Time and Space

```cpp
void inorder(TreeNode* root, vector<int>& vals) {
    if (!root) return;
    inorder(root->left, vals);
    vals.push_back(root->val);
    inorder(root->right, vals);
}

int kthSmallest(TreeNode* root, int k) {
    vector<int> vals;
    inorder(root, vals);
    return vals[k - 1];
}
```

```java
void inorder(TreeNode root, List<Integer> vals) {
    if (root == null) return;
    inorder(root.left, vals);
    vals.add(root.val);
    inorder(root.right, vals);
}

int kthSmallest(TreeNode root, int k) {
    List<Integer> vals = new ArrayList<>();
    inorder(root, vals);
    return vals.get(k - 1);
}
```

```typescript
function kthSmallest(root: TreeNode | null, k: number): number {
    const vals: number[] = [];
    function inorder(node: TreeNode | null): void {
        if (!node) return;
        inorder(node.left);
        vals.push(node.val);
        inorder(node.right);
    }
    inorder(root);
    return vals[k - 1];
}
```

```python
def kthSmallest(root: TreeNode | None, k: int) -> int:
    vals: list[int] = []

    def inorder(node: TreeNode | None) -> None:
        if not node:
            return
        inorder(node.left)
        vals.append(node.val)
        inorder(node.right)

    inorder(root)
    return vals[k - 1]
```

```go
func kthSmallest(root *TreeNode, k int) int {
    var vals []int
    var inorder func(*TreeNode)
    inorder = func(node *TreeNode) {
        if node == nil { return }
        inorder(node.Left)
        vals = append(vals, node.Val)
        inorder(node.Right)
    }
    inorder(root)
    return vals[k-1]
}
```

**Time:** O(n) — **Space:** O(n)

## Approach 2: Inorder with Early Termination — O(k) Time, O(h) Space

Use a counter. Decrement at each inorder step. When counter reaches 0, capture the answer and stop recursing.

```cpp
int ans, count;

void inorder(TreeNode* root) {
    if (!root || count == 0) return;
    inorder(root->left);
    if (--count == 0) { ans = root->val; return; }
    inorder(root->right);
}

int kthSmallest(TreeNode* root, int k) {
    count = k;
    inorder(root);
    return ans;
}
```

```java
int ans = 0, count = 0;

void inorder(TreeNode root) {
    if (root == null) return;
    inorder(root.left);
    if (--count == 0) { ans = root.val; return; }
    inorder(root.right);
}

int kthSmallest(TreeNode root, int k) {
    count = k;
    inorder(root);
    return ans;
}
```

```typescript
function kthSmallest(root: TreeNode | null, k: number): number {
    let count = k, ans = 0;

    function inorder(node: TreeNode | null): void {
        if (!node || count === 0) return;
        inorder(node.left);
        if (--count === 0) { ans = node.val; return; }
        inorder(node.right);
    }

    inorder(root);
    return ans;
}
```

```python
def kthSmallest(root: TreeNode | None, k: int) -> int:
    count = [k]
    ans = [0]

    def inorder(node: TreeNode | None) -> None:
        if not node or count[0] == 0:
            return
        inorder(node.left)
        count[0] -= 1
        if count[0] == 0:
            ans[0] = node.val
            return
        inorder(node.right)

    inorder(root)
    return ans[0]
```

```go
func kthSmallest(root *TreeNode, k int) int {
    count, ans := k, 0
    var inorder func(*TreeNode)
    inorder = func(node *TreeNode) {
        if node == nil || count == 0 { return }
        inorder(node.Left)
        count--
        if count == 0 { ans = node.Val; return }
        inorder(node.Right)
    }
    inorder(root)
    return ans
}
```

**Time:** O(h + k) — **Space:** O(h) call stack

## Approach 3: Iterative Inorder (No Recursion Stack Concern)

```cpp
int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    TreeNode* curr = root;
    while (curr || !st.empty()) {
        while (curr) { st.push(curr); curr = curr->left; }
        curr = st.top(); st.pop();
        if (--k == 0) return curr->val;
        curr = curr->right;
    }
    return -1;
}
```

```java
int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;
    while (curr != null || !stack.isEmpty()) {
        while (curr != null) { stack.push(curr); curr = curr.left; }
        curr = stack.pop();
        if (--k == 0) return curr.val;
        curr = curr.right;
    }
    return -1;
}
```

```typescript
function kthSmallest(root: TreeNode | null, k: number): number {
    const stack: TreeNode[] = [];
    let curr: TreeNode | null = root;
    while (curr || stack.length) {
        while (curr) { stack.push(curr); curr = curr.left; }
        curr = stack.pop()!;
        if (--k === 0) return curr.val;
        curr = curr.right;
    }
    return -1;
}
```

```python
def kthSmallest(root: TreeNode | None, k: int) -> int:
    stack, curr = [], root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        k -= 1
        if k == 0:
            return curr.val
        curr = curr.right
    return -1
```

```go
func kthSmallest(root *TreeNode, k int) int {
    var stack []*TreeNode
    curr := root
    for curr != nil || len(stack) > 0 {
        for curr != nil { stack = append(stack, curr); curr = curr.Left }
        curr = stack[len(stack)-1]; stack = stack[:len(stack)-1]
        k--
        if k == 0 { return curr.Val }
        curr = curr.Right
    }
    return -1
}
```

**Time:** O(h + k) — **Space:** O(h) explicit stack

## Follow-up: Frequent Modifications

> If the BST is modified often (inserts/deletes) and we need to find kth smallest frequently — how do you optimize?

**Answer:** Augment each node with the size of its left subtree (or total subtree size). Then each kth smallest query is O(log n):
- If `k == leftSize + 1`, current node is the answer
- If `k ≤ leftSize`, recurse left with same `k`
- If `k > leftSize + 1`, recurse right with `k - leftSize - 1`

This is a classic follow-up question — mention it proactively.

## Key Interview Insights

- **Inorder BST = sorted array** — this is the fundamental insight. Once you know this, the problem is trivial.
- **Early termination** reduces worst case from O(n) to O(h + k). Important when k is small and the tree is large.
- **Iterative inorder avoids recursion limit issues** — mention this for very deep trees.
- **The augmented tree follow-up** (store subtree sizes) reduces kth smallest to O(log n) per query and is worth mentioning unprompted — it shows system design awareness.
