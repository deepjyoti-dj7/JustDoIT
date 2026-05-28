---
title: AVL Trees
description: Self-balancing BST with height-balance invariant, rotations, and operations
---

# AVL Trees

An AVL tree (Adelson-Velsky and Landis, 1962) is a self-balancing BST that maintains the **height-balance property**: for every node, the heights of the left and right subtrees differ by at most 1. This guarantees O(log n) operations in the worst case.

## The Balance Factor

```
balance_factor(node) = height(left) - height(right)

Valid values: -1, 0, +1
If |balance_factor| > 1 → tree is unbalanced → perform rotation
```

```
     Balanced                      Unbalanced
         4 (bf=0)                      3 (bf=-2)
        / \                             \
       2   6 (bf=0)                      4
      / \ / \                             \
     1  3 5  7                             5
     
All bf ∈ {-1,0,1} ✓              Node 3 has bf = -2 ✗
```

## Height Maintenance

Each node stores its height (not bf directly — compute bf from heights).

```
height(null) = -1  (or 0, depending on convention)
height(node) = 1 + max(height(left), height(right))
```

## Four Rotation Cases

When a node becomes unbalanced after insert/delete, one of four rotations restores balance.

### Case 1: Left-Left (LL) → Right Rotation

```
    z (bf=+2)         y
   / \               / \
  y   T4    →       x   z
 / \               /\   /\
x   T3            T1 T2 T3 T4
```

```cpp
TreeNode* rotateRight(TreeNode* z) {
    TreeNode* y = z->left;
    TreeNode* T3 = y->right;
    y->right = z;
    z->left = T3;
    updateHeight(z);
    updateHeight(y);
    return y;   // New root of this subtree
}
```

```java
TreeNode rotateRight(TreeNode z) {
    TreeNode y = z.left;
    TreeNode T3 = y.right;
    y.right = z;
    z.left = T3;
    updateHeight(z);
    updateHeight(y);
    return y;
}
```

```typescript
function rotateRight(z: AVLNode): AVLNode {
    const y = z.left!;
    const T3 = y.right;
    y.right = z;
    z.left = T3;
    updateHeight(z);
    updateHeight(y);
    return y;
}
```

```python
def rotate_right(z: AVLNode) -> AVLNode:
    y = z.left
    T3 = y.right
    y.right = z
    z.left = T3
    update_height(z)
    update_height(y)
    return y
```

```go
func rotateRight(z *AVLNode) *AVLNode {
    y := z.Left
    T3 := y.Right
    y.Right = z
    z.Left = T3
    updateHeight(z)
    updateHeight(y)
    return y
}
```

### Case 2: Right-Right (RR) → Left Rotation

Mirror of LL: rotate left around the unbalanced node.

### Case 3: Left-Right (LR) → Double Rotation

First rotate left on the left child (convert to LL case), then rotate right.

```cpp
// LR: rotate left on z->left, then rotate right on z
if (balance > 1 && getBalance(root->left) < 0) {
    root->left = rotateLeft(root->left);   // Convert to LL
    return rotateRight(root);
}
```

```java
if (balance > 1 && getBalance(root.left) < 0) {
    root.left = rotateLeft(root.left);
    return rotateRight(root);
}
```

```typescript
if (balance > 1 && getBalance(root.left) < 0) {
    root.left = rotateLeft(root.left!);
    return rotateRight(root);
}
```

```python
if balance > 1 and get_balance(root.left) < 0:
    root.left = rotate_left(root.left)
    return rotate_right(root)
```

```go
if balance > 1 && getBalance(z.Left) < 0 {
    z.Left = rotateLeft(z.Left)
    return rotateRight(z)
}
```

### Case 4: Right-Left (RL) → Double Rotation

Rotate right on right child, then rotate left. Mirror of LR.

## Complete Insert

```cpp
TreeNode* insert(TreeNode* root, int val) {
    // 1. Standard BST insert
    if (!root) return new TreeNode(val);
    if (val < root->val) root->left = insert(root->left, val);
    else if (val > root->val) root->right = insert(root->right, val);
    else return root;  // Duplicate

    // 2. Update height
    updateHeight(root);

    // 3. Get balance factor
    int balance = getBalance(root);

    // 4. Fix violations — 4 cases
    if (balance > 1 && val < root->left->val)   return rotateRight(root);       // LL
    if (balance < -1 && val > root->right->val)  return rotateLeft(root);        // RR
    if (balance > 1 && val > root->left->val) {                                  // LR
        root->left = rotateLeft(root->left);
        return rotateRight(root);
    }
    if (balance < -1 && val < root->right->val) {                                // RL
        root->right = rotateRight(root->right);
        return rotateLeft(root);
    }
    return root;
}
```

```java
TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    else return root;
    updateHeight(root);
    int balance = getBalance(root);
    if (balance > 1 && val < root.left.val) return rotateRight(root);
    if (balance < -1 && val > root.right.val) return rotateLeft(root);
    if (balance > 1 && val > root.left.val) {
        root.left = rotateLeft(root.left);
        return rotateRight(root);
    }
    if (balance < -1 && val < root.right.val) {
        root.right = rotateRight(root.right);
        return rotateLeft(root);
    }
    return root;
}
```

```typescript
function insert(root: AVLNode | null, val: number): AVLNode {
    if (!root) return { val, height: 0, left: null, right: null };
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    else return root;
    updateHeight(root);
    const balance = getBalance(root);
    if (balance > 1 && val < root.left!.val) return rotateRight(root);
    if (balance < -1 && val > root.right!.val) return rotateLeft(root);
    if (balance > 1 && val > root.left!.val) {
        root.left = rotateLeft(root.left!);
        return rotateRight(root);
    }
    if (balance < -1 && val < root.right!.val) {
        root.right = rotateRight(root.right!);
        return rotateLeft(root);
    }
    return root;
}
```

```python
def insert(root: AVLNode | None, val: int) -> AVLNode:
    if not root:
        return AVLNode(val)
    if val < root.val: root.left = insert(root.left, val)
    elif val > root.val: root.right = insert(root.right, val)
    else: return root
    update_height(root)
    balance = get_balance(root)
    if balance > 1 and val < root.left.val: return rotate_right(root)
    if balance < -1 and val > root.right.val: return rotate_left(root)
    if balance > 1 and val > root.left.val:
        root.left = rotate_left(root.left)
        return rotate_right(root)
    if balance < -1 and val < root.right.val:
        root.right = rotate_right(root.right)
        return rotate_left(root)
    return root
```

```go
func insert(root *AVLNode, val int) *AVLNode {
    if root == nil { return &AVLNode{Val: val} }
    if val < root.Val { root.Left = insert(root.Left, val) }
    if val > root.Val { root.Right = insert(root.Right, val) }
    updateHeight(root)
    balance := getBalance(root)
    if balance > 1 && val < root.Left.Val { return rotateRight(root) }
    if balance < -1 && val > root.Right.Val { return rotateLeft(root) }
    if balance > 1 && val > root.Left.Val {
        root.Left = rotateLeft(root.Left); return rotateRight(root)
    }
    if balance < -1 && val < root.Right.Val {
        root.Right = rotateRight(root.Right); return rotateLeft(root)
    }
    return root
}
```

## Complexity

| Operation | AVL Tree | Plain BST (worst) |
|---|---|---|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
| Space | O(n) | O(n) |

## AVL vs Red-Black Tree

| | AVL | Red-Black |
|---|---|---|
| Balance guarantee | Stricter (≤1 height diff) | Looser (factor of 2) |
| Search speed | Faster (shorter tree) | Slightly slower |
| Insert/Delete cost | More rotations | Fewer rotations |
| Best for | Read-heavy workloads | Write-heavy workloads |
| Used in | Databases, sorted sets | Linux scheduler, Java TreeMap, C++ std::map |

## Key Interview Insights

- **AVL trees guarantee O(log n) worst case**, unlike plain BSTs which degrade to O(n).
- **Only remember the 4 rotation cases** by their imbalance direction and the child's balance direction: (LL→R), (RR→L), (LR→LR), (RL→RL).
- **Height must be updated bottom-up** after every insert/delete — this is why the recursive approach naturally works (post-order update).
- **Interviewers rarely ask you to code a full AVL tree**, but expect you to explain the concept, rotations, and when to use it over a plain BST or Red-Black tree.
