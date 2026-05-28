---
title: Amortized Analysis
description: Analyzing the true cost of operations over a sequence — aggregate, accounting, and potential methods with real examples
---

# Amortized Analysis

Some operations are occasionally expensive but cheap on average over a sequence of calls. **Amortized analysis** gives a more accurate per-operation cost than worst-case analysis when operations have variable cost.

> **Key idea:** Pay for expensive operations in advance using "credits" earned from cheap operations.

## Amortized vs Average Case

These are different things:

| | Amortized | Average |
|---|---|---|
| **Input** | Fixed sequence of operations | Random/probabilistic input |
| **Guarantee** | Over any sequence of n ops, total ≤ n × amortized cost | On average over random inputs |
| **Use case** | Dynamic arrays, stacks, Union-Find | Quicksort, hash tables |

Amortized = worst case *total*, spread across operations. No randomness assumed.

## Method 1: Aggregate Analysis

**Idea:** Count total work over n operations directly. Divide by n to get amortized cost per operation.

### Dynamic Array — Append

A dynamic array doubles when full. A sequence of n appends costs:

```
1 copy (when array has 1 element → resize to 2)
2 copies (resize to 4)
4 copies (resize to 8)
...
n/2 copies (resize to n)

Total copies = 1 + 2 + 4 + ... + n/2 = n - 1 (geometric series)
Total work = n appends + (n-1) copies ≈ 2n
Amortized cost per append = 2n / n = O(1)
```

Each append is **O(1) amortized** even though some individual appends trigger O(n) resizes.

```cpp
class DynamicArray {
    vector<int> data;
    int cap = 1;
public:
    void push(int x) {
        if (data.size() == cap) {
            data.reserve(cap * 2);  // O(cap) — rare
            cap *= 2;
        }
        data.push_back(x);          // O(1) — always
    }
};
// Amortized O(1) per push
```

```java
class DynamicArray {
    int[] data = new int[1];
    int size = 0, cap = 1;

    void push(int x) {
        if (size == cap) {
            data = Arrays.copyOf(data, cap * 2);  // O(cap) — rare
            cap *= 2;
        }
        data[size++] = x;  // O(1) — always
    }
}
// Amortized O(1) per push
```

```typescript
class DynamicArray {
    private data: number[] = [];

    push(x: number): void {
        this.data.push(x);  // JS arrays handle resizing internally
    }
}
// Amortized O(1) per push (JS engine handles doubling)
```

```python
class DynamicArray:
    def __init__(self):
        self.data = []

    def push(self, x: int) -> None:
        self.data.append(x)  # Python list.append is O(1) amortized
# Amortized O(1) per push
```

```go
type DynamicArray struct {
    data []int
}

func (a *DynamicArray) Push(x int) {
    a.data = append(a.data, x)  // Go slice append is O(1) amortized
}
// Amortized O(1) per push
```

## Method 2: Accounting (Banker's) Method

**Idea:** Assign an "amortized cost" to each operation. Cheap operations overpay and store credits. Expensive operations spend stored credits. The total amortized cost must be ≥ actual total cost.

### Dynamic Array — Banker's Method

Assign amortized cost of **3** to each push:
- 1 credit: pay for current insertion
- 1 credit: save to pay for copying this element in a future resize
- 1 credit: save to pay for copying an element that was inserted *before* the last resize

When a resize of capacity c occurs: c/2 new elements carry 2 extra credits each → c credits total → exactly pays for copying all c elements. ✓

Amortized cost per push = **O(1)**.

## Method 3: Potential Method

**Idea:** Define a potential function Φ (like "stored energy") over the data structure state.

```
Amortized cost of operation i = actual cost + ΔΦ
                               = actual cost + Φ(after) - Φ(before)
```

For dynamic array, let Φ = 2·size - capacity.

- After n inserts starting from empty: Φ ≥ 0 always
- A cheap insert (no resize): actual = 1, Φ increases by 2 → amortized = 3
- A resize insert: actual = size + 1, Φ drops by size → amortized = size+1 - size = 1 ≈ O(1)

All three methods give the same answer. **In interviews, the aggregate method is clearest.**

## Key Example: Monotonic Stack

A monotonic stack inside a loop looks like O(n²) but is O(n) amortized.

```cpp
vector<int> dailyTemperatures(vector<int>& temps) {
    int n = temps.size();
    vector<int> res(n, 0);
    stack<int> st;  // monotonic decreasing — stores indices
    for (int i = 0; i < n; i++) {
        // This while loop looks expensive — but total pops ≤ n
        while (!st.empty() && temps[st.top()] < temps[i]) {
            res[st.top()] = i - st.top();
            st.pop();
        }
        st.push(i);
    }
    return res;
}
// Time: O(n) amortized — each index pushed once, popped at most once
// Space: O(n) — stack
```

```java
int[] dailyTemperatures(int[] temps) {
    int n = temps.length;
    int[] res = new int[n];
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && temps[st.peek()] < temps[i]) {
            res[st.peek()] = i - st.pop();
        }
        st.push(i);
    }
    return res;
}
```

```typescript
function dailyTemperatures(temps: number[]): number[] {
    const n = temps.length;
    const res = new Array(n).fill(0);
    const st: number[] = [];
    for (let i = 0; i < n; i++) {
        while (st.length > 0 && temps[st[st.length - 1]] < temps[i]) {
            const idx = st.pop()!;
            res[idx] = i - idx;
        }
        st.push(i);
    }
    return res;
}
```

```python
def daily_temperatures(temps: list[int]) -> list[int]:
    n = len(temps)
    res = [0] * n
    st = []  # stores indices, monotonic decreasing by temp value
    for i in range(n):
        while st and temps[st[-1]] < temps[i]:
            idx = st.pop()
            res[idx] = i - idx
        st.append(i)
    return res
```

```go
func dailyTemperatures(temps []int) []int {
    n := len(temps)
    res := make([]int, n)
    st := []int{}
    for i := 0; i < n; i++ {
        for len(st) > 0 && temps[st[len(st)-1]] < temps[i] {
            idx := st[len(st)-1]
            st = st[:len(st)-1]
            res[idx] = i - idx
        }
        st = append(st, i)
    }
    return res
}
```

**Why O(n)?** Aggregate argument: across all n iterations of the outer for-loop, the total number of push operations is exactly n (one per i). The total number of pop operations is at most n (each element can only be popped once after being pushed once). Therefore total work = O(n).

## Key Example: Union-Find with Path Compression

Union-Find supports two operations: `find(x)` and `union(x, y)`. With both optimizations:

- **Union by rank:** Always attach shorter tree under taller
- **Path compression:** Flatten the tree on every `find`

```cpp
class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);  // path compression
        return parent[x];
    }
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
};
// Amortized O(α(n)) per operation — α = inverse Ackermann ≈ O(1) in practice
```

```java
class UnionFind {
    int[] parent, rank;
    UnionFind(int n) {
        parent = new int[n]; rank = new int[n];
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
        return true;
    }
}
```

```typescript
class UnionFind {
    parent: number[];
    rank: number[];
    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    find(x: number): number {
        if (this.parent[x] !== x)
            this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }
    unite(x: number, y: number): boolean {
        const px = this.find(x), py = this.find(y);
        if (px === py) return false;
        if (this.rank[px] < this.rank[py]) this.parent[px] = py;
        else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
        else { this.parent[py] = px; this.rank[px]++; }
        return true;
    }
}
```

```python
class UnionFind:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
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
        return True
```

```go
type UnionFind struct {
    parent, rank []int
}

func NewUnionFind(n int) *UnionFind {
    parent := make([]int, n)
    for i := range parent { parent[i] = i }
    return &UnionFind{parent, make([]int, n)}
}

func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x {
        uf.parent[x] = uf.Find(uf.parent[x])
    }
    return uf.parent[x]
}

func (uf *UnionFind) Unite(x, y int) bool {
    px, py := uf.Find(x), uf.Find(y)
    if px == py { return false }
    if uf.rank[px] < uf.rank[py] { px, py = py, px }
    uf.parent[py] = px
    if uf.rank[px] == uf.rank[py] { uf.rank[px]++ }
    return true
}
```

With both path compression and union by rank, the amortized cost per operation is **O(α(n))** — the inverse Ackermann function, which is ≤ 5 for any realistic n. Treat it as **O(1) amortized** in interviews.

## Amortized Complexity Reference

| Data Structure / Operation | Amortized Cost | Notes |
|---|---|---|
| Dynamic array push | O(1) | Doubling strategy |
| Dynamic array pop (end) | O(1) | No resize needed |
| Hash table insert | O(1) | With load factor control |
| Monotonic stack | O(n) total | Each element pushed/popped once |
| Union-Find find + union | O(α(n)) ≈ O(1) | Path compression + rank |
| Splay tree operations | O(log n) | Self-adjusting BST |

## Key Interview Insights

- **Say "amortized O(1)" not just "O(1)."** The distinction matters — single operations can still be O(n).
- **The aggregate argument is the clearest.** "Each element is pushed once and popped at most once, so total work across all n iterations is O(n)."
- **Don't say "average O(1)."** That implies probabilistic input. Amortized is a worst-case-total guarantee.
- **Python `list.append()` and Go `append()` are O(1) amortized** — this is the same dynamic array analysis.
- **Union-Find is your O(1)-ish connectivity structure.** For graph connectivity problems, always reach for Union-Find over repeated BFS/DFS.
