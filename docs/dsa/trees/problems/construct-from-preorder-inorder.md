---
title: Construct Binary Tree from Preorder and Inorder Traversal
difficulty: Medium
tags: [Tree, DFS, Divide and Conquer, Hash Map]
link: https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
---

# Construct Binary Tree from Preorder and Inorder Traversal

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) |
| **Tags** | Tree, DFS, Divide and Conquer, Hash Map |

## Problem Statement

Given two integer arrays `preorder` and `inorder` where:
- `preorder` is the preorder traversal of a binary tree
- `inorder` is the inorder traversal of the same tree

Construct and return the binary tree. Assume no duplicate values.

```
preorder = [3, 9, 20, 15, 7]
inorder  = [9, 3, 15, 20, 7]

Output:
    3
   / \
  9  20
    /  \
   15   7
```

## Intuition

Two key facts:

1. **Preorder[0] is always the root** of the current tree/subtree.
2. Once we know the root, we can **find it in the inorder array** — everything to the left of it is the left subtree, everything to the right is the right subtree.

From the split position in inorder, we know **how many nodes** are in the left subtree. This lets us split the preorder array correctly too.

### Walk-through

```
preorder = [3, 9, 20, 15, 7]
inorder  = [9, 3, 15, 20, 7]

Root = preorder[0] = 3
Find 3 in inorder: index 1
Left subtree nodes (inorder[0..0])  = [9]     → leftSize = 1
Right subtree nodes (inorder[2..4]) = [15, 20, 7]

Left preorder  = preorder[1..1]   = [9]
Right preorder = preorder[2..4]   = [20, 15, 7]

Recurse:
  Root=9:  inorder=[9], no children
  Root=20: inorder=[15,20,7], preorder=[20,15,7]
    Root=20, left=[15], right=[7]
```

## Approach 1: Naive Recursive — O(n²)

Search for root index in inorder array each time — O(n) per call.

```cpp
TreeNode* build(vector<int>& pre, int preL, int preR,
                vector<int>& in, int inL, int inR) {
    if (preL > preR) return nullptr;
    int rootVal = pre[preL];
    TreeNode* root = new TreeNode(rootVal);

    int mid = inL;
    while (in[mid] != rootVal) mid++;  // O(n) search

    int leftSize = mid - inL;
    root->left = build(pre, preL+1, preL+leftSize, in, inL, mid-1);
    root->right = build(pre, preL+leftSize+1, preR, in, mid+1, inR);
    return root;
}

TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    return build(preorder, 0, preorder.size()-1, inorder, 0, inorder.size()-1);
}
```

```java
TreeNode build(int[] pre, int preL, int preR, int[] in, int inL, int inR) {
    if (preL > preR) return null;
    TreeNode root = new TreeNode(pre[preL]);
    int mid = inL;
    while (in[mid] != pre[preL]) mid++;
    int leftSize = mid - inL;
    root.left = build(pre, preL+1, preL+leftSize, in, inL, mid-1);
    root.right = build(pre, preL+leftSize+1, preR, in, mid+1, inR);
    return root;
}

TreeNode buildTree(int[] preorder, int[] inorder) {
    return build(preorder, 0, preorder.length-1, inorder, 0, inorder.length-1);
}
```

```typescript
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    function build(preL: number, preR: number, inL: number, inR: number): TreeNode | null {
        if (preL > preR) return null;
        const root = new TreeNode(preorder[preL]);
        let mid = inL;
        while (inorder[mid] !== preorder[preL]) mid++;
        const leftSize = mid - inL;
        root.left = build(preL+1, preL+leftSize, inL, mid-1);
        root.right = build(preL+leftSize+1, preR, mid+1, inR);
        return root;
    }
    return build(0, preorder.length-1, 0, inorder.length-1);
}
```

```python
def buildTree(preorder: list[int], inorder: list[int]) -> TreeNode | None:
    def build(pre_l: int, pre_r: int, in_l: int, in_r: int) -> TreeNode | None:
        if pre_l > pre_r:
            return None
        root_val = preorder[pre_l]
        root = TreeNode(root_val)
        mid = inorder.index(root_val, in_l, in_r + 1)  # O(n) search
        left_size = mid - in_l
        root.left = build(pre_l + 1, pre_l + left_size, in_l, mid - 1)
        root.right = build(pre_l + left_size + 1, pre_r, mid + 1, in_r)
        return root

    return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

```go
func buildTree(preorder []int, inorder []int) *TreeNode {
    var build func(preL, preR, inL, inR int) *TreeNode
    build = func(preL, preR, inL, inR int) *TreeNode {
        if preL > preR { return nil }
        root := &TreeNode{Val: preorder[preL]}
        mid := inL
        for inorder[mid] != preorder[preL] { mid++ }
        leftSize := mid - inL
        root.Left = build(preL+1, preL+leftSize, inL, mid-1)
        root.Right = build(preL+leftSize+1, preR, mid+1, inR)
        return root
    }
    return build(0, len(preorder)-1, 0, len(inorder)-1)
}
```

**Time:** O(n²) — O(n) search per node  
**Space:** O(h) call stack

## Approach 2: Optimized with HashMap — O(n)

Build a hash map from `value → index in inorder` before recursion. This makes the root-finding step O(1).

```cpp
unordered_map<int, int> inMap;

TreeNode* build(vector<int>& pre, int preL, int preR, int inL, int inR) {
    if (preL > preR) return nullptr;
    int rootVal = pre[preL];
    int mid = inMap[rootVal];         // O(1) lookup
    int leftSize = mid - inL;
    TreeNode* root = new TreeNode(rootVal);
    root->left  = build(pre, preL+1, preL+leftSize, inL, mid-1);
    root->right = build(pre, preL+leftSize+1, preR, mid+1, inR);
    return root;
}

TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
    for (int i = 0; i < inorder.size(); i++) inMap[inorder[i]] = i;
    return build(preorder, 0, preorder.size()-1, 0, inorder.size()-1);
}
```

```java
Map<Integer, Integer> inMap = new HashMap<>();

TreeNode build(int[] pre, int preL, int preR, int inL, int inR) {
    if (preL > preR) return null;
    int mid = inMap.get(pre[preL]);
    int leftSize = mid - inL;
    TreeNode root = new TreeNode(pre[preL]);
    root.left  = build(pre, preL+1, preL+leftSize, inL, mid-1);
    root.right = build(pre, preL+leftSize+1, preR, mid+1, inR);
    return root;
}

TreeNode buildTree(int[] preorder, int[] inorder) {
    for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
    return build(preorder, 0, preorder.length-1, 0, inorder.length-1);
}
```

```typescript
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    const inMap = new Map<number, number>();
    inorder.forEach((v, i) => inMap.set(v, i));

    function build(preL: number, preR: number, inL: number, inR: number): TreeNode | null {
        if (preL > preR) return null;
        const mid = inMap.get(preorder[preL])!;
        const leftSize = mid - inL;
        const root = new TreeNode(preorder[preL]);
        root.left = build(preL+1, preL+leftSize, inL, mid-1);
        root.right = build(preL+leftSize+1, preR, mid+1, inR);
        return root;
    }

    return build(0, preorder.length-1, 0, inorder.length-1);
}
```

```python
def buildTree(preorder: list[int], inorder: list[int]) -> TreeNode | None:
    in_map = {val: idx for idx, val in enumerate(inorder)}

    def build(pre_l: int, pre_r: int, in_l: int, in_r: int) -> TreeNode | None:
        if pre_l > pre_r:
            return None
        root_val = preorder[pre_l]
        mid = in_map[root_val]           # O(1) lookup
        left_size = mid - in_l
        root = TreeNode(root_val)
        root.left  = build(pre_l + 1, pre_l + left_size, in_l, mid - 1)
        root.right = build(pre_l + left_size + 1, pre_r, mid + 1, in_r)
        return root

    return build(0, len(preorder) - 1, 0, len(inorder) - 1)
```

```go
func buildTree(preorder []int, inorder []int) *TreeNode {
    inMap := make(map[int]int, len(inorder))
    for i, v := range inorder { inMap[v] = i }

    var build func(preL, preR, inL, inR int) *TreeNode
    build = func(preL, preR, inL, inR int) *TreeNode {
        if preL > preR { return nil }
        mid := inMap[preorder[preL]]
        leftSize := mid - inL
        root := &TreeNode{Val: preorder[preL]}
        root.Left = build(preL+1, preL+leftSize, inL, mid-1)
        root.Right = build(preL+leftSize+1, preR, mid+1, inR)
        return root
    }
    return build(0, len(preorder)-1, 0, len(inorder)-1)
}
```

**Time:** O(n) — O(1) hash lookup per node  
**Space:** O(n) hash map + O(h) call stack

## Key Index Arithmetic

```
Root = preorder[preL]
mid  = inMap[root]         (position in inorder)
leftSize = mid - inL

Left subtree:
  preorder slice: [preL+1 .. preL+leftSize]
  inorder  slice: [inL    .. mid-1        ]

Right subtree:
  preorder slice: [preL+leftSize+1 .. preR]
  inorder  slice: [mid+1           .. inR ]
```

## Key Interview Insights

- **Always start with the HashMap approach** — it's the expected solution and shows you know to precompute.
- **The key insight:** preorder gives root; root splits inorder into left/right subtrees; left subtree size tells you where to split preorder.
- **Without duplicates:** The problem guarantees no duplicates — without this, you can't uniquely find the root position in inorder.
- **Variant:** Construct from postorder + inorder → root is `postorder[postR]`, but splitting logic is symmetric.
- **Variant:** Construct from preorder + postorder → only possible when the tree is full (every node has 0 or 2 children).
