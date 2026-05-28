---
title: Tree Traversals
description: All tree traversal strategies — DFS (preorder, inorder, postorder) and BFS (level order) — with recursive and iterative implementations
---

# Tree Traversals

Tree traversal is how you visit every node in a tree exactly once. The **order** you visit nodes determines what problems you can solve. Get this completely solid — traversal is the foundation of every tree algorithm.

## The Four Traversal Orders

```
          1
        /   \
       2     3
      / \     \
     4   5     6
```

| Traversal | Order | Result for above tree |
|---|---|---|
| **Preorder** | Root → Left → Right | 1, 2, 4, 5, 3, 6 |
| **Inorder** | Left → Root → Right | 4, 2, 5, 1, 3, 6 |
| **Postorder** | Left → Right → Root | 4, 5, 2, 6, 3, 1 |
| **Level Order** | Level by level, left to right | [1], [2, 3], [4, 5, 6] |

## Preorder — Root First

Process the node, then recurse into children. The root always appears first in the output.

**Use when:** Copying a tree, serialization, generating prefix expressions, path-from-root problems.

```cpp
void preorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    res.push_back(root->val);   // Process root FIRST
    preorder(root->left, res);
    preorder(root->right, res);
}

// Iterative version using a stack
vector<int> preorderIterative(TreeNode* root) {
    vector<int> res;
    if (!root) return res;
    stack<TreeNode*> st;
    st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top(); st.pop();
        res.push_back(node->val);
        if (node->right) st.push(node->right); // Push right first!
        if (node->left) st.push(node->left);   // Left processed next
    }
    return res;
}
```

```java
void preorder(TreeNode root, List<Integer> res) {
    if (root == null) return;
    res.add(root.val);
    preorder(root.left, res);
    preorder(root.right, res);
}

List<Integer> preorderIterative(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        res.add(node.val);
        if (node.right != null) stack.push(node.right);
        if (node.left != null) stack.push(node.left);
    }
    return res;
}
```

```typescript
function preorder(root: TreeNode | null, res: number[] = []): number[] {
    if (!root) return res;
    res.push(root.val);
    preorder(root.left, res);
    preorder(root.right, res);
    return res;
}

function preorderIterative(root: TreeNode | null): number[] {
    const res: number[] = [];
    if (!root) return res;
    const stack: TreeNode[] = [root];
    while (stack.length) {
        const node = stack.pop()!;
        res.push(node.val);
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    return res;
}
```

```python
def preorder(root: TreeNode | None, res: list[int] | None = None) -> list[int]:
    if res is None:
        res = []
    if not root:
        return res
    res.append(root.val)
    preorder(root.left, res)
    preorder(root.right, res)
    return res

def preorder_iterative(root: TreeNode | None) -> list[int]:
    res, stack = [], [root] if root else []
    while stack:
        node = stack.pop()
        res.append(node.val)
        if node.right: stack.append(node.right)
        if node.left: stack.append(node.left)
    return res
```

```go
func preorder(root *TreeNode, res *[]int) {
    if root == nil { return }
    *res = append(*res, root.Val)
    preorder(root.Left, res)
    preorder(root.Right, res)
}

func preorderIterative(root *TreeNode) []int {
    var res []int
    if root == nil { return res }
    stack := []*TreeNode{root}
    for len(stack) > 0 {
        node := stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        res = append(res, node.Val)
        if node.Right != nil { stack = append(stack, node.Right) }
        if node.Left != nil { stack = append(stack, node.Left) }
    }
    return res
}
```

## Inorder — Left First

Process left subtree, then root, then right subtree.

**Key insight:** Inorder traversal of a **BST** produces elements in **sorted ascending order**. This is the most important property of inorder traversal.

**Use when:** BST sorted order, kth smallest, BST validation, expression trees.

```cpp
void inorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    inorder(root->left, res);
    res.push_back(root->val);   // Process root AFTER left
    inorder(root->right, res);
}

// Iterative: use a stack, go left as deep as possible
vector<int> inorderIterative(TreeNode* root) {
    vector<int> res;
    stack<TreeNode*> st;
    TreeNode* curr = root;
    while (curr || !st.empty()) {
        while (curr) { st.push(curr); curr = curr->left; }
        curr = st.top(); st.pop();
        res.push_back(curr->val);
        curr = curr->right;
    }
    return res;
}
```

```java
void inorder(TreeNode root, List<Integer> res) {
    if (root == null) return;
    inorder(root.left, res);
    res.add(root.val);
    inorder(root.right, res);
}

List<Integer> inorderIterative(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;
    while (curr != null || !stack.isEmpty()) {
        while (curr != null) { stack.push(curr); curr = curr.left; }
        curr = stack.pop();
        res.add(curr.val);
        curr = curr.right;
    }
    return res;
}
```

```typescript
function inorder(root: TreeNode | null, res: number[] = []): number[] {
    if (!root) return res;
    inorder(root.left, res);
    res.push(root.val);
    inorder(root.right, res);
    return res;
}

function inorderIterative(root: TreeNode | null): number[] {
    const res: number[] = [];
    const stack: TreeNode[] = [];
    let curr: TreeNode | null = root;
    while (curr || stack.length) {
        while (curr) { stack.push(curr); curr = curr.left; }
        curr = stack.pop()!;
        res.push(curr.val);
        curr = curr.right;
    }
    return res;
}
```

```python
def inorder(root: TreeNode | None, res: list[int] | None = None) -> list[int]:
    if res is None:
        res = []
    if not root:
        return res
    inorder(root.left, res)
    res.append(root.val)
    inorder(root.right, res)
    return res

def inorder_iterative(root: TreeNode | None) -> list[int]:
    res, stack, curr = [], [], root
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        res.append(curr.val)
        curr = curr.right
    return res
```

```go
func inorder(root *TreeNode, res *[]int) {
    if root == nil { return }
    inorder(root.Left, res)
    *res = append(*res, root.Val)
    inorder(root.Right, res)
}

func inorderIterative(root *TreeNode) []int {
    var res []int
    var stack []*TreeNode
    curr := root
    for curr != nil || len(stack) > 0 {
        for curr != nil { stack = append(stack, curr); curr = curr.Left }
        curr = stack[len(stack)-1]; stack = stack[:len(stack)-1]
        res = append(res, curr.Val)
        curr = curr.Right
    }
    return res
}
```

## Postorder — Children First

Process both children, then the root. The root always appears last.

**Use when:** Deleting a tree, computing subtree sizes/heights/sums, bottom-up DP on trees, evaluating expression trees.

The critical pattern: **get information from children, combine at the node**.

```cpp
void postorder(TreeNode* root, vector<int>& res) {
    if (!root) return;
    postorder(root->left, res);
    postorder(root->right, res);
    res.push_back(root->val);   // Process root LAST
}

// Iterative: reverse of modified preorder (Root → Right → Left)
vector<int> postorderIterative(TreeNode* root) {
    vector<int> res;
    if (!root) return res;
    stack<TreeNode*> st;
    st.push(root);
    while (!st.empty()) {
        TreeNode* node = st.top(); st.pop();
        res.push_back(node->val);
        if (node->left) st.push(node->left);
        if (node->right) st.push(node->right);
    }
    reverse(res.begin(), res.end()); // Reverse gives L → R → Root
    return res;
}
```

```java
void postorder(TreeNode root, List<Integer> res) {
    if (root == null) return;
    postorder(root.left, res);
    postorder(root.right, res);
    res.add(root.val);
}

List<Integer> postorderIterative(TreeNode root) {
    LinkedList<Integer> res = new LinkedList<>();
    if (root == null) return res;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        res.addFirst(node.val);           // Prepend = reverse
        if (node.left != null) stack.push(node.left);
        if (node.right != null) stack.push(node.right);
    }
    return res;
}
```

```typescript
function postorder(root: TreeNode | null, res: number[] = []): number[] {
    if (!root) return res;
    postorder(root.left, res);
    postorder(root.right, res);
    res.push(root.val);
    return res;
}

function postorderIterative(root: TreeNode | null): number[] {
    const res: number[] = [];
    if (!root) return res;
    const stack: TreeNode[] = [root];
    while (stack.length) {
        const node = stack.pop()!;
        res.unshift(node.val);          // Prepend
        if (node.left) stack.push(node.left);
        if (node.right) stack.push(node.right);
    }
    return res;
}
```

```python
def postorder(root: TreeNode | None, res: list[int] | None = None) -> list[int]:
    if res is None:
        res = []
    if not root:
        return res
    postorder(root.left, res)
    postorder(root.right, res)
    res.append(root.val)
    return res

def postorder_iterative(root: TreeNode | None) -> list[int]:
    res, stack = [], [root] if root else []
    while stack:
        node = stack.pop()
        res.append(node.val)
        if node.left: stack.append(node.left)
        if node.right: stack.append(node.right)
    return res[::-1]   # Reverse
```

```go
func postorder(root *TreeNode, res *[]int) {
    if root == nil { return }
    postorder(root.Left, res)
    postorder(root.Right, res)
    *res = append(*res, root.Val)
}

func postorderIterative(root *TreeNode) []int {
    var res []int
    if root == nil { return res }
    stack := []*TreeNode{root}
    for len(stack) > 0 {
        node := stack[len(stack)-1]; stack = stack[:len(stack)-1]
        res = append([]int{node.Val}, res...)   // Prepend
        if node.Left != nil { stack = append(stack, node.Left) }
        if node.Right != nil { stack = append(stack, node.Right) }
    }
    return res
}
```

## Level Order (BFS)

Process nodes level by level using a queue. This is **BFS on a tree**.

**Use when:** Minimum depth, right side view, zigzag traversal, level-specific operations, connecting nodes at same level.

```cpp
vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (!root) return res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        int size = q.size();        // CRITICAL: snapshot level size first
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

def level_order(root: TreeNode | None) -> list[list[int]]:
    if not root:
        return []
    res, q = [], deque([root])
    while q:
        level = []
        for _ in range(len(q)):     # Snapshot: len(q) is current level size
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

## Traversal Decision Guide

```
Is the problem level-based?
  Yes → BFS (level order)
  No  → DFS

Which DFS?
  Need parent info before processing children? → Preorder
  Need children results to compute answer?    → Postorder
  Working with BST sorted order?              → Inorder
```

## Complexity Summary

| Traversal | Time | Space (Recursive) | Space (Iterative) |
|---|---|---|---|
| Preorder | O(n) | O(h) stack | O(h) stack |
| Inorder | O(n) | O(h) stack | O(h) stack |
| Postorder | O(n) | O(h) stack | O(h) stack |
| Level Order | O(n) | O(w) queue | O(w) queue |

Where `h` = height (O(log n) balanced, O(n) worst), `w` = max width (up to n/2 in a perfect tree).

## Key Interview Insights

- **The BFS queue trick:** Always snapshot `q.size()` before the inner loop — this separates levels. Forgetting this is the #1 BFS tree bug.
- **Iterative inorder** uses the "go left as far as possible, then pop and go right" pattern — memorize this.
- **Postorder iterative** is easiest remembered as "reverse of Right-first preorder."
- **Recursive DFS** has O(h) call stack space — mention this in your complexity analysis, especially for skewed trees where h = O(n).
- **Morris Traversal** (O(1) space inorder) is an advanced technique — only mention if asked for constant space.
