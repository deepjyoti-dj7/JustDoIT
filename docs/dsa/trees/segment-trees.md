---
title: Segment Trees
description: Range query data structure supporting sum, min, max, and point updates in O(log n)
---

# Segment Trees

A segment tree is a tree-based data structure built over an array that answers **range queries** (sum, min, max, GCD...) and supports **point updates** in O(log n). It's the go-to when you need both queries and updates, unlike prefix sums (updates break them) or sparse tables (O(1) queries but no updates).

## When to Use

| Situation | Tool |
|---|---|
| Range queries, no updates | Prefix sum / Sparse table |
| **Range queries + point updates** | **Segment tree** |
| Range queries + range updates | Segment tree with lazy propagation |
| Only max/min, no updates | Sparse table (O(1) query) |

## Core Idea

Divide the array into segments. Each node in the tree stores the aggregate (sum/min/max) of a contiguous subarray.

```
Array: [2, 1, 5, 3, 4]
Index:  0  1  2  3  4

Segment tree (sum):
              15 [0,4]
            /         \
         8 [0,2]      7 [3,4]
         /    \       /    \
      3 [0,1] 5[2]  3[3]  4[4]
      /   \
    2[0]  1[1]
```

## Array Representation

Store the segment tree in a 1-indexed array. For node at index `i`:
- Left child: `2i`
- Right child: `2i + 1`
- Parent: `i / 2`

Use array of size `4n` (safe upper bound).

## Build

```cpp
int tree[4 * MAXN];

void build(int* arr, int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = (start + end) / 2;
    build(arr, 2*node, start, mid);
    build(arr, 2*node+1, mid+1, end);
    tree[node] = tree[2*node] + tree[2*node+1];   // Aggregate
}
// Call: build(arr, 1, 0, n-1)
```

```java
int[] tree;

void build(int[] arr, int node, int start, int end) {
    if (start == end) { tree[node] = arr[start]; return; }
    int mid = (start + end) / 2;
    build(arr, 2*node, start, mid);
    build(arr, 2*node+1, mid+1, end);
    tree[node] = tree[2*node] + tree[2*node+1];
}
```

```typescript
let tree: number[];

function build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) { tree[node] = arr[start]; return; }
    const mid = (start + end) >> 1;
    build(arr, 2*node, start, mid);
    build(arr, 2*node+1, mid+1, end);
    tree[node] = tree[2*node] + tree[2*node+1];
}
```

```python
class SegmentTree:
    def __init__(self, arr: list[int]):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self._build(arr, 1, 0, self.n - 1)

    def _build(self, arr: list[int], node: int, start: int, end: int) -> None:
        if start == end:
            self.tree[node] = arr[start]
            return
        mid = (start + end) // 2
        self._build(arr, 2*node, start, mid)
        self._build(arr, 2*node+1, mid+1, end)
        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]
```

```go
type SegTree struct{ tree []int; n int }

func NewSegTree(arr []int) *SegTree {
    n := len(arr)
    st := &SegTree{tree: make([]int, 4*n), n: n}
    st.build(arr, 1, 0, n-1)
    return st
}

func (st *SegTree) build(arr []int, node, start, end int) {
    if start == end { st.tree[node] = arr[start]; return }
    mid := (start + end) / 2
    st.build(arr, 2*node, start, mid)
    st.build(arr, 2*node+1, mid+1, end)
    st.tree[node] = st.tree[2*node] + st.tree[2*node+1]
}
```

**Build time:** O(n)

## Point Update

```cpp
void update(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;   // Leaf: set new value
        return;
    }
    int mid = (start + end) / 2;
    if (idx <= mid) update(2*node, start, mid, idx, val);
    else update(2*node+1, mid+1, end, idx, val);
    tree[node] = tree[2*node] + tree[2*node+1];  // Update on the way back up
}
```

```java
void update(int node, int start, int end, int idx, int val) {
    if (start == end) { tree[node] = val; return; }
    int mid = (start + end) / 2;
    if (idx <= mid) update(2*node, start, mid, idx, val);
    else update(2*node+1, mid+1, end, idx, val);
    tree[node] = tree[2*node] + tree[2*node+1];
}
```

```typescript
function update(node: number, start: number, end: number, idx: number, val: number): void {
    if (start === end) { tree[node] = val; return; }
    const mid = (start + end) >> 1;
    if (idx <= mid) update(2*node, start, mid, idx, val);
    else update(2*node+1, mid+1, end, idx, val);
    tree[node] = tree[2*node] + tree[2*node+1];
}
```

```python
def update(self, node: int, start: int, end: int, idx: int, val: int) -> None:
    if start == end:
        self.tree[node] = val
        return
    mid = (start + end) // 2
    if idx <= mid:
        self.update(2*node, start, mid, idx, val)
    else:
        self.update(2*node+1, mid+1, end, idx, val)
    self.tree[node] = self.tree[2*node] + self.tree[2*node+1]
```

```go
func (st *SegTree) update(node, start, end, idx, val int) {
    if start == end { st.tree[node] = val; return }
    mid := (start + end) / 2
    if idx <= mid { st.update(2*node, start, mid, idx, val) }
    if idx > mid { st.update(2*node+1, mid+1, end, idx, val) }
    st.tree[node] = st.tree[2*node] + st.tree[2*node+1]
}
```

**Update time:** O(log n)

## Range Query

```cpp
int query(int node, int start, int end, int l, int r) {
    if (r < start || end < l) return 0;     // Out of range → identity
    if (l <= start && end <= r) return tree[node]; // Fully within range
    int mid = (start + end) / 2;
    return query(2*node, start, mid, l, r) + query(2*node+1, mid+1, end, l, r);
}
```

```java
int query(int node, int start, int end, int l, int r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return tree[node];
    int mid = (start + end) / 2;
    return query(2*node, start, mid, l, r) + query(2*node+1, mid+1, end, l, r);
}
```

```typescript
function query(node: number, start: number, end: number, l: number, r: number): number {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return tree[node];
    const mid = (start + end) >> 1;
    return query(2*node, start, mid, l, r) + query(2*node+1, mid+1, end, l, r);
}
```

```python
def query(self, node: int, start: int, end: int, l: int, r: int) -> int:
    if r < start or end < l:
        return 0            # Identity for sum
    if l <= start and end <= r:
        return self.tree[node]
    mid = (start + end) // 2
    return self.query(2*node, start, mid, l, r) + self.query(2*node+1, mid+1, end, l, r)
```

```go
func (st *SegTree) query(node, start, end, l, r int) int {
    if r < start || end < l { return 0 }
    if l <= start && end <= r { return st.tree[node] }
    mid := (start + end) / 2
    return st.query(2*node, start, mid, l, r) + st.query(2*node+1, mid+1, end, l, r)
}
```

**Query time:** O(log n)

## Range Update with Lazy Propagation

When you need to update a **range** of elements (e.g., add `v` to all `arr[l..r]`), naive point updates take O(n log n). **Lazy propagation** defers updates until needed.

Each node stores a `lazy` value — the pending update that hasn't been pushed to children yet. When you visit a node, push the lazy value to children first.

```cpp
int lazy[4 * MAXN];  // Pending updates

void pushDown(int node) {
    if (lazy[node] != 0) {
        tree[2*node] += lazy[node];
        tree[2*node+1] += lazy[node];
        lazy[2*node] += lazy[node];
        lazy[2*node+1] += lazy[node];
        lazy[node] = 0;
    }
}

void rangeUpdate(int node, int start, int end, int l, int r, int val) {
    if (r < start || end < l) return;
    if (l <= start && end <= r) {
        tree[node] += val;
        lazy[node] += val;
        return;
    }
    pushDown(node);
    int mid = (start + end) / 2;
    rangeUpdate(2*node, start, mid, l, r, val);
    rangeUpdate(2*node+1, mid+1, end, l, r, val);
    tree[node] = tree[2*node] + tree[2*node+1];
}
```

```java
// Same structure — lazy[] parallel to tree[]
```

```typescript
// Same structure — lazy[] parallel to tree[]
```

```python
# lazy list initialized to 0, same logic
```

```go
// lazy []int parallel to tree
```

**Range update time:** O(log n)

## Complexity Summary

| Operation | Time | Space |
|---|---|---|
| Build | O(n) | O(n) |
| Point update | O(log n) | O(1) |
| Range query | O(log n) | O(1) |
| Range update (lazy) | O(log n) | O(n) |

## Interview Patterns

| Problem | Segment Tree Approach |
|---|---|
| Range sum query + updates | Standard sum segment tree |
| Range min/max query | Replace `+` with `min`/`max`, identity = INT_MAX |
| Count of elements in range | Coordinate compression + sum tree |
| Range GCD query | Replace `+` with `gcd` |
| Range updates | Lazy propagation |

## Key Interview Insights

- **The identity element matters:** For sum use 0, for min use INT_MAX, for max use INT_MIN, for product use 1. Out-of-range nodes should return the identity.
- **4n array size** is the safe bound. 2n works only for power-of-2 sizes.
- **Segment tree vs BIT (Fenwick):** Segment trees are more general (support min/max/GCD, not just sum). BIT/Fenwick trees are simpler and faster in practice for pure prefix sums.
- **Lazy propagation** is the hard part — interviewers may probe this specifically for range update problems.
- **Coordinate compression** + segment tree handles queries on large value ranges by mapping values to array indices.
