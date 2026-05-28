---
title: Fenwick Tree (Binary Indexed Tree)
description: Compact prefix-sum data structure with O(log n) updates and queries
---

# Fenwick Tree (Binary Indexed Tree)

A Fenwick Tree (BIT — Binary Indexed Tree) is a compact data structure for **prefix sum queries with point updates** in O(log n). It uses less memory and has a smaller constant factor than a segment tree, but is limited to operations that are **invertible** (sum, XOR — not min/max).

## Core Idea

Each index `i` in the BIT is responsible for a range determined by the **lowest set bit** of `i`.

```
i in binary  →  Lowest set bit  →  Range covered
1 = 0001     →  1               →  [1, 1]
2 = 0010     →  2               →  [1, 2]
3 = 0011     →  1               →  [3, 3]
4 = 0100     →  4               →  [1, 4]
5 = 0101     →  1               →  [5, 5]
6 = 0110     →  2               →  [5, 6]
7 = 0111     →  1               →  [7, 7]
8 = 1000     →  8               →  [1, 8]
```

The **lowest set bit** of `i` is: `i & (-i)` (two's complement trick).

## 1-Indexed Convention

BIT is **always 1-indexed**. Index 0 is unused. Store your array starting at index 1.

## The Two Operations

### Prefix Sum Query (`prefixSum(i)`)

Walk from index `i` upward by **removing** the lowest set bit.

```
prefixSum(7) = tree[7] + tree[6] + tree[4]
  7 = 0111 → remove LSB → 6 = 0110 → remove LSB → 4 = 0100 → remove LSB → 0 (stop)
```

### Point Update (`update(i, delta)`)

Walk from index `i` upward by **adding** the lowest set bit.

```
update(3, +5): update tree[3], tree[4], tree[8], tree[16], ...
  3 = 0011 → add LSB (1) → 4 = 0100 → add LSB (4) → 8 → ...
```

## Implementation

```cpp
class BIT {
    vector<int> tree;
    int n;
public:
    BIT(int n) : n(n), tree(n + 1, 0) {}

    void update(int i, int delta) {  // 1-indexed; add delta to arr[i]
        for (; i <= n; i += i & (-i))
            tree[i] += delta;
    }

    int query(int i) {               // Sum of arr[1..i]
        int sum = 0;
        for (; i > 0; i -= i & (-i))
            sum += tree[i];
        return sum;
    }

    int query(int l, int r) {        // Sum of arr[l..r]
        return query(r) - query(l - 1);
    }
};
```

```java
class BIT {
    private int[] tree;
    private int n;

    BIT(int n) {
        this.n = n;
        tree = new int[n + 1];
    }

    void update(int i, int delta) {
        for (; i <= n; i += i & (-i))
            tree[i] += delta;
    }

    int query(int i) {
        int sum = 0;
        for (; i > 0; i -= i & (-i))
            sum += tree[i];
        return sum;
    }

    int query(int l, int r) {
        return query(r) - query(l - 1);
    }
}
```

```typescript
class BIT {
    private tree: number[];
    private n: number;

    constructor(n: number) {
        this.n = n;
        this.tree = new Array(n + 1).fill(0);
    }

    update(i: number, delta: number): void {
        for (; i <= this.n; i += i & (-i))
            this.tree[i] += delta;
    }

    query(i: number): number;
    query(l: number, r: number): number;
    query(l: number, r?: number): number {
        if (r === undefined) {
            let sum = 0;
            for (let i = l; i > 0; i -= i & (-i)) sum += this.tree[i];
            return sum;
        }
        return this.query(r) - this.query(l - 1);
    }
}
```

```python
class BIT:
    def __init__(self, n: int):
        self.n = n
        self.tree = [0] * (n + 1)   # 1-indexed

    def update(self, i: int, delta: int) -> None:
        """Add delta to arr[i] (1-indexed)."""
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)

    def query(self, i: int) -> int:
        """Prefix sum arr[1..i]."""
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & (-i)
        return total

    def range_query(self, l: int, r: int) -> int:
        """Sum of arr[l..r] (1-indexed)."""
        return self.query(r) - self.query(l - 1)
```

```go
type BIT struct{ tree []int; n int }

func NewBIT(n int) *BIT { return &BIT{tree: make([]int, n+1), n: n} }

func (b *BIT) Update(i, delta int) {
    for ; i <= b.n; i += i & (-i) { b.tree[i] += delta }
}

func (b *BIT) Query(i int) int {
    sum := 0
    for ; i > 0; i -= i & (-i) { sum += b.tree[i] }
    return sum
}

func (b *BIT) RangeQuery(l, r int) int { return b.Query(r) - b.Query(l-1) }
```

## Build from Array in O(n)

Instead of calling `update()` n times (O(n log n)), build in O(n):

```cpp
BIT(vector<int>& arr) : n(arr.size()), tree(arr.size() + 1, 0) {
    for (int i = 1; i <= n; i++) {
        tree[i] += arr[i-1];
        int j = i + (i & (-i));
        if (j <= n) tree[j] += tree[i];
    }
}
```

```java
void buildFromArray(int[] arr) {
    for (int i = 1; i <= n; i++) {
        tree[i] += arr[i-1];
        int j = i + (i & (-i));
        if (j <= n) tree[j] += tree[i];
    }
}
```

```typescript
buildFromArray(arr: number[]): void {
    for (let i = 1; i <= this.n; i++) {
        this.tree[i] += arr[i-1];
        const j = i + (i & (-i));
        if (j <= this.n) this.tree[j] += this.tree[i];
    }
}
```

```python
def build(self, arr: list[int]) -> None:
    for i in range(1, self.n + 1):
        self.tree[i] += arr[i - 1]
        j = i + (i & (-i))
        if j <= self.n:
            self.tree[j] += self.tree[i]
```

```go
func (b *BIT) Build(arr []int) {
    for i := 1; i <= b.n; i++ {
        b.tree[i] += arr[i-1]
        if j := i + (i & (-i)); j <= b.n { b.tree[j] += b.tree[i] }
    }
}
```

## 2D Fenwick Tree

For 2D range sum queries on a grid:

```cpp
class BIT2D {
    vector<vector<int>> tree;
    int n, m;
public:
    BIT2D(int n, int m) : n(n), m(m), tree(n+1, vector<int>(m+1, 0)) {}

    void update(int x, int y, int delta) {
        for (int i = x; i <= n; i += i & (-i))
            for (int j = y; j <= m; j += j & (-j))
                tree[i][j] += delta;
    }

    int query(int x, int y) {
        int sum = 0;
        for (int i = x; i > 0; i -= i & (-i))
            for (int j = y; j > 0; j -= j & (-j))
                sum += tree[i][j];
        return sum;
    }
};
```

```java
// Same nested loop structure with int[][] tree
```

```typescript
// Same nested loop structure with number[][] tree
```

```python
# Same nested loop structure with list[list[int]] tree
```

```go
// Same nested loop structure with [][]int tree
```

**2D BIT:** O(log n × log m) per update/query

## BIT vs Segment Tree

| | BIT / Fenwick | Segment Tree |
|---|---|---|
| Code complexity | Very simple | More complex |
| Memory | O(n) | O(4n) |
| Speed (constant) | Faster | Slightly slower |
| Supports | Sum, XOR (invertible ops) | Sum, min, max, GCD, etc. |
| Range updates | Needs two BITs (difference trick) | Native with lazy prop |
| 2D support | Yes, O(log² n) | Yes, but more complex |

**Rule of thumb:** Use BIT for prefix sums with point updates. Use segment tree for non-invertible operations (min/max) or range updates.

## Complexity

| Operation | Time | Space |
|---|---|---|
| Build | O(n) | O(n) |
| Point update | O(log n) | O(1) |
| Prefix query | O(log n) | O(1) |
| Range query | O(log n) | O(1) |

## Key Interview Insights

- **`i & (-i)` is the magic.** It isolates the lowest set bit of `i`. Adding it moves you up to the parent (update); subtracting it moves you to the previous responsibility range (query).
- **Always 1-indexed.** Passing index 0 causes an infinite loop. Convert to 1-indexed before using.
- **Prefix sum + subtraction for range queries:** `sum(l, r) = query(r) - query(l-1)` — same as prefix sum arrays.
- **BIT is the cleanest O(log n) solution** for "count of elements seen so far ≤ x" problems with coordinate compression.
- **Common use case:** Count inversions in an array, count smaller numbers to the right, number of smaller elements after self (LC 315).
