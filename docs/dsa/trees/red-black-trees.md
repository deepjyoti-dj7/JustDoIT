---
title: Red-Black Trees
description: Self-balancing BST with color-based invariants, used in language standard libraries
---

# Red-Black Trees

A Red-Black tree is a self-balancing BST that uses **node coloring** (red or black) to maintain approximate balance. It guarantees O(log n) operations and is used in Java's `TreeMap`/`TreeSet`, C++'s `std::map`/`std::set`, and the Linux kernel scheduler.

## The Five Invariants

Every valid Red-Black tree satisfies all five of these properties:

| Property | Rule |
|---|---|
| **1. Color** | Every node is red or black |
| **2. Root** | The root is always black |
| **3. Null leaves** | All null leaves (NIL) are considered black |
| **4. Red rule** | A red node's children must both be black (no two consecutive reds) |
| **5. Black-height** | Every path from a node to any of its null leaves contains the same number of black nodes |

The black-height property (5) ensures the tree cannot be more than twice as tall as the shortest path — guaranteeing O(log n) height.

## Black-Height Guarantee

If the black-height is `bh`, then:
- Min nodes: `2^bh - 1` (all-black perfect tree)
- Max nodes: `4^bh - 1` (alternating red-black)

Height `h ≤ 2 × log₂(n+1)` — so O(log n) is guaranteed.

## Node Structure

```cpp
enum Color { RED, BLACK };

struct RBNode {
    int val;
    Color color;
    RBNode *left, *right, *parent;
    RBNode(int v) : val(v), color(RED), left(nullptr), right(nullptr), parent(nullptr) {}
};
```

```java
enum Color { RED, BLACK }

class RBNode {
    int val;
    Color color = Color.RED;
    RBNode left, right, parent;
    RBNode(int v) { val = v; }
}
```

```typescript
type Color = 'RED' | 'BLACK';

class RBNode {
    val: number;
    color: Color = 'RED';
    left: RBNode | null = null;
    right: RBNode | null = null;
    parent: RBNode | null = null;
    constructor(val: number) { this.val = val; }
}
```

```python
from enum import Enum

class Color(Enum):
    RED = 0
    BLACK = 1

class RBNode:
    def __init__(self, val: int):
        self.val = val
        self.color = Color.RED
        self.left = None
        self.right = None
        self.parent = None
```

```go
type Color bool

const (
    RED   Color = true
    BLACK Color = false
)

type RBNode struct {
    Val    int
    Color  Color
    Left   *RBNode
    Right  *RBNode
    Parent *RBNode
}
```

## Insert — Fix-Up Cases

New nodes are always inserted as **RED**. If this violates the red rule (new node's parent is also red), fix with recoloring + rotations.

### Uncle is Red → Recolor

```
    B(G)              R(G)
   / \       →       / \
  R(P) R(U)         B(P) B(U)
  /
 R(N)
```

Recolor parent and uncle to BLACK, grandparent to RED. Move problem up to grandparent.

### Uncle is Black + Triangle → Rotate to Line, then Rotate Root

```
    B(G)              B(G)              B(P)
   / \       →       / \       →       / \
  R(P) B(U)         R(N) B(U)         R(N) R(G)
    \                /                      \
     R(N)           R(P)                   B(U)
```

**Triangle case (LR):** Rotate P to convert to line case.  
**Line case (LL):** Rotate G right, swap colors of P and G.

## Operations Summary

| Operation | Steps |
|---|---|
| **Insert** | BST insert → color RED → fix-up (recolor/rotate) |
| **Delete** | BST delete → if black node removed → fix double-black |
| **Search** | Same as BST |
| **Rotation** | Left/right, same as AVL, O(1) — adjusts parent pointers too |

## Comparison: AVL vs Red-Black

| Criterion | AVL Tree | Red-Black Tree |
|---|---|---|
| Balance strength | Stronger (|bf| ≤ 1) | Looser (h ≤ 2 log n) |
| Lookup speed | Slightly faster | Slightly slower |
| Insert/delete rotations | Up to O(log n) | At most 3 rotations |
| Recolorings | None | Up to O(log n) |
| Memory | Height field | Color bit |
| Best for | Read-heavy | Write-heavy |
| Used in | Databases | std::map, TreeMap, kernel |

## Complexity

| Operation | Time | Space |
|---|---|---|
| Search | O(log n) | O(1) |
| Insert | O(log n) | O(1) |
| Delete | O(log n) | O(1) |
| Total space | — | O(n) |

## Key Interview Insights

- **Red-Black trees trade strict balance for fewer rotations on insert/delete.** AVL trees are more balanced (faster lookup) but costlier to maintain.
- **At most 3 rotations** are needed per insert (then only recoloring propagates up). This is why Red-Black trees are preferred for write-heavy workloads.
- **Java `TreeMap`, C++ `std::map`, Linux CFS scheduler** all use Red-Black trees internally.
- **You're unlikely to code a full Red-Black tree** in an interview — but know the 5 properties, the comparison with AVL, and why it's preferred in standard libraries.
- **The key invariant to remember:** No path from root to null can be more than twice as long as any other path (black-height guarantee + no double reds).
