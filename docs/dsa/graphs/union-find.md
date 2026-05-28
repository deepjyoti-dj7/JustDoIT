---
title: Union-Find (DSU)
description: Disjoint Set Union for connectivity queries, cycle detection, and MST — with path compression and union by rank
---

# Union-Find (DSU)

Union-Find (also called Disjoint Set Union / DSU) maintains a collection of disjoint sets and supports two operations in near O(1) amortized time:
- **find(x):** Which set does x belong to? (returns the root/representative)
- **union(x, y):** Merge the sets containing x and y

It's the perfect structure for **dynamic connectivity**: edges arrive one at a time, and you need to track which nodes are connected.

## Core Intuition

Each set is a tree. The root is the "representative" of its set. Two nodes are connected iff they share the same root.

```
Initially: {0} {1} {2} {3} {4}   (5 separate sets)
parent:     0   1   2   3   4

union(0,1): {0,1} {2} {3} {4}
parent:      0    2   3   4
             ^
             1's parent = 0

union(2,3): {0,1} {2,3} {4}
union(0,2): {0,1,2,3} {4}

find(3) → 3's parent=2 → 2's parent=0 → root=0 ✓
find(1) → 1's parent=0 → root=0 ✓
Same root → 1 and 3 are connected
```

## Two Key Optimizations

### 1. Path Compression

When calling `find(x)`, flatten the path so every node on the path points directly to the root. Future finds become O(1).

```
Before find(4):    1 → 3 → 2 → 0 (root)
After find(4):     1 → 0
                   3 → 0
                   2 → 0
```

### 2. Union by Rank

Always attach the smaller tree under the larger. Keeps tree height ≤ O(log n), preventing degenerate chains.

With **both** optimizations: amortized O(α(n)) per operation — effectively O(1).

## Full Implementation

```cpp
class UnionFind {
    vector<int> parent, rank_;
    int components;
public:
    UnionFind(int n) : parent(n), rank_(n, 0), components(n) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);  // path compression
        return parent[x];
    }
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;  // already connected
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
        components--;
        return true;
    }
    bool connected(int x, int y) { return find(x) == find(y); }
    int count() { return components; }
};
```

```java
class UnionFind {
    int[] parent, rank;
    int components;

    UnionFind(int n) {
        parent = new int[n]; rank = new int[n]; components = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    boolean unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) { int t = px; px = py; py = t; }
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        components--;
        return true;
    }
    boolean connected(int x, int y) { return find(x) == find(y); }
}
```

```typescript
class UnionFind {
    parent: number[];
    rank: number[];
    components: number;

    constructor(n: number) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.components = n;
    }
    find(x: number): number {
        if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }
    unite(x: number, y: number): boolean {
        const px = this.find(x), py = this.find(y);
        if (px === py) return false;
        if (this.rank[px] < this.rank[py]) { [this.parent[px], this.parent[py]] = [py, py]; }
        else if (this.rank[px] > this.rank[py]) { this.parent[py] = px; }
        else { this.parent[py] = px; this.rank[px]++; }
        this.components--;
        return true;
    }
    connected(x: number, y: number): boolean { return this.find(x) === this.find(y); }
}
```

```python
class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]

    def unite(self, x: int, y: int) -> bool:
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        self.components -= 1
        return True

    def connected(self, x: int, y: int) -> bool:
        return self.find(x) == self.find(y)
```

```go
type UnionFind struct {
    parent, rank []int
    components   int
}

func NewUnionFind(n int) *UnionFind {
    parent := make([]int, n)
    for i := range parent { parent[i] = i }
    return &UnionFind{parent, make([]int, n), n}
}

func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x { uf.parent[x] = uf.Find(uf.parent[x]) }
    return uf.parent[x]
}

func (uf *UnionFind) Unite(x, y int) bool {
    px, py := uf.Find(x), uf.Find(y)
    if px == py { return false }
    if uf.rank[px] < uf.rank[py] { px, py = py, px }
    uf.parent[py] = px
    if uf.rank[px] == uf.rank[py] { uf.rank[px]++ }
    uf.components--
    return true
}

func (uf *UnionFind) Connected(x, y int) bool { return uf.Find(x) == uf.Find(y) }
```

## Common Applications

| Problem | How Union-Find Helps |
|---|---|
| Count connected components | Start with n components; each `unite` that merges two → decrement |
| Detect cycle (undirected) | If `unite(u, v)` returns false → u and v are already connected → cycle |
| Kruskal's MST | Sort edges; `unite` if they're not already connected |
| Graph Valid Tree | n-1 edges + no cycle = tree. Check with Union-Find |
| Accounts Merge | Union emails belonging to same account |
| Number of provinces | Classic Union-Find connectivity count |

## When to Choose Union-Find vs DFS/BFS

| | Union-Find | DFS/BFS |
|---|---|---|
| **Edges added online** | ✅ Supports incremental adds | ❌ Must re-run |
| **Connectivity query** | O(α(n)) | O(V + E) |
| **Find actual path** | ❌ Cannot | ✅ Yes |
| **Directed graphs** | ❌ Undirected only | ✅ Both |
| **Cycle detection (undirected)** | ✅ Natural | ✅ With parent tracking |

## Complexity

| Operation | Without optimization | With path compression only | Both optimizations |
|---|---|---|---|
| find | O(n) | O(log n) amortized | O(α(n)) |
| union | O(n) | O(log n) amortized | O(α(n)) |
| Space | O(n) | O(n) | O(n) |

α(n) = inverse Ackermann function ≤ 5 for any practical n. Treat as O(1).

## Key Interview Insights

- **Always include both optimizations** — path compression + union by rank. Missing either leaves performance on the table.
- **`unite` returning false = nodes already connected = cycle detected.** Use this for graph-valid-tree type problems.
- **Track component count** — decrement on every successful `unite`. Start at n, end at the number of connected components.
- **For 2D grid problems**, you can convert (row, col) to a single integer `row * cols + col` and use Union-Find on the linearized index.
- **Use Union-Find when edges arrive online** and you need repeated connectivity queries. For a static graph, DFS/BFS is equally good.
