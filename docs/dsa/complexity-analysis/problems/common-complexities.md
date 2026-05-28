---
title: Common Algorithm Complexities
description: A comprehensive quick-reference for time and space complexities of the most important algorithms and data structures
---

# Common Algorithm Complexities

Memorize this table cold. In interviews, knowing complexity off the top of your head signals confidence and depth.

## Sorting Algorithms

| Algorithm | Best | Average | Worst | Space | Stable? |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Counting Sort | O(n + k) | O(n + k) | O(n + k) | O(k) | Yes |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n + k) | Yes |
| Tim Sort | O(n) | O(n log n) | O(n log n) | O(n) | Yes |

**Key facts to remember:**

- Comparison-based sorting lower bound: **Ω(n log n)** — no comparison sort can beat this
- **Tim Sort** is used in Python `list.sort()` and Java `Collections.sort()` — adaptive, stable, fast in practice
- **Quick Sort** worst case triggers on already-sorted input with naive pivot; always use randomized pivot
- **Merge Sort** is the go-to when you need guaranteed O(n log n) and stability
- **Counting/Radix Sort** beat the lower bound by exploiting key structure (not comparisons)
- **Insertion Sort** wins for small arrays (n ≤ 16) due to cache locality — used inside Tim Sort

## Searching

| Algorithm | Time | Space | Requirement |
|---|---|---|---|
| Linear Search | O(n) | O(1) | None |
| Binary Search | O(log n) | O(1) | Sorted array |
| Binary Search (recursive) | O(log n) | O(log n) | Sorted array (stack frames) |
| Interpolation Search | O(log log n) avg | O(1) | Sorted, uniform distribution |

## Data Structure Operations

### Array / Dynamic Array (ArrayList, vector)

| Operation | Time | Notes |
|---|---|---|
| Access by index | O(1) | Random access |
| Search (unsorted) | O(n) | — |
| Binary search (sorted) | O(log n) | — |
| Append (end) | O(1) amortized | Doubling strategy |
| Insert at index i | O(n) | Shift right |
| Delete at index i | O(n) | Shift left |
| Insert/delete at front | O(n) | — |

### Linked List

| Operation | Singly | Doubly | Notes |
|---|---|---|---|
| Access by index | O(n) | O(n) | No random access |
| Search | O(n) | O(n) | — |
| Insert at head | O(1) | O(1) | Update head pointer |
| Insert at tail | O(n) / O(1)* | O(1) | *O(1) with tail pointer |
| Delete given node pointer | O(n)** | O(1) | **Singly needs prev; doubly doesn't |
| Delete head | O(1) | O(1) | — |

### Hash Table (HashMap / HashSet / dict / unordered_map)

| Operation | Average | Worst | Notes |
|---|---|---|---|
| Insert | O(1) | O(n) | Worst case: all keys hash to same bucket |
| Delete | O(1) | O(n) | — |
| Search / Lookup | O(1) | O(n) | — |

Worst case is extremely rare with a good hash function. Say "O(1) average" in interviews.

### BST (unbalanced)

| Operation | Average | Worst | Notes |
|---|---|---|---|
| Search | O(log n) | O(n) | Skewed tree = linked list |
| Insert | O(log n) | O(n) | — |
| Delete | O(log n) | O(n) | — |
| Min / Max | O(log n) | O(n) | — |

### Balanced BST (AVL, Red-Black / TreeMap, TreeSet)

| Operation | Guaranteed | Notes |
|---|---|---|
| Search | O(log n) | Always balanced |
| Insert | O(log n) | — |
| Delete | O(log n) | — |
| Min / Max / Floor / Ceiling | O(log n) | Ordered operations |
| In-order traversal | O(n) | Produces sorted sequence |

### Heap / Priority Queue

| Operation | Time | Notes |
|---|---|---|
| Insert (push) | O(log n) | Sift up |
| Extract min/max (pop) | O(log n) | Sift down |
| Peek min/max | O(1) | Root access |
| Build heap from n elements | O(n) | Not O(n log n) — mathematical identity |
| Heap sort | O(n log n) | Build + n extractions |

> **Build heap = O(n):** The sum of sift-down costs Σ(log(n/2^k)) × 2^k converges to O(n). This often surprises interviewers who expect O(n log n).

### Stack / Queue / Deque

| Operation | Time | Notes |
|---|---|---|
| Push / Enqueue | O(1) | — |
| Pop / Dequeue | O(1) | — |
| Peek / Front | O(1) | — |

### Trie (Prefix Tree)

| Operation | Time | Space | Notes |
|---|---|---|---|
| Insert | O(m) | O(m) | m = length of string |
| Search (exact) | O(m) | O(1) | — |
| Starts-with prefix | O(m) | O(1) | — |
| Total space for n strings | — | O(n × m) | Shared prefixes reduce this |

## Graph Algorithms

| Algorithm | Time | Space | Notes |
|---|---|---|---|
| BFS | O(V + E) | O(V) | Shortest path in unweighted graph |
| DFS | O(V + E) | O(V) | Cycle detection, topological sort, SCCs |
| Dijkstra (binary heap) | O((V + E) log V) | O(V) | Shortest path, non-negative weights |
| Bellman-Ford | O(V × E) | O(V) | Shortest path, handles negative weights |
| Floyd-Warshall | O(V³) | O(V²) | All-pairs shortest paths |
| Kruskal (MST) | O(E log E) | O(E) | Sort edges, Union-Find for cycles |
| Prim (MST, binary heap) | O((V + E) log V) | O(V) | Priority queue based |
| Topological Sort (Kahn's) | O(V + E) | O(V) | BFS-based, detects cycles |
| Topological Sort (DFS) | O(V + E) | O(V) | DFS post-order |
| Kosaraju's SCC | O(V + E) | O(V) | Two DFS passes |
| Tarjan's SCC | O(V + E) | O(V) | Single DFS with low-link values |

## String Algorithms

| Algorithm | Time | Space | Use Case |
|---|---|---|---|
| Naive matching | O(n × m) | O(1) | Simple, n and m small |
| KMP | O(n + m) | O(m) | Pattern matching |
| Rabin-Karp | O(n + m) avg | O(1) | Multiple patterns, rolling hash |
| Z-algorithm | O(n + m) | O(n + m) | Pattern + string matching |
| Manacher's | O(n) | O(n) | Longest palindromic substring |

n = text length, m = pattern length.

## Dynamic Programming Classics

| Problem | Time | Naive Space | Optimized Space |
|---|---|---|---|
| Fibonacci | O(n) | O(n) | O(1) — two variables |
| Coin Change | O(n × amount) | O(amount) | O(amount) — 1D DP |
| 0/1 Knapsack | O(n × W) | O(n × W) | O(W) — rolling row |
| Unbounded Knapsack | O(n × W) | O(W) | O(W) |
| Longest Common Subsequence | O(n × m) | O(n × m) | O(min(n, m)) |
| Longest Increasing Subsequence | O(n²) | O(n) | O(n log n) with patience sort |
| Edit Distance | O(n × m) | O(n × m) | O(min(n, m)) |
| Matrix Chain Multiplication | O(n³) | O(n²) | — |
| Subset Sum | O(n × sum) | O(n × sum) | O(sum) |

## Complexity by Pattern

| Pattern | Time | Space |
|---|---|---|
| Single pointer scan | O(n) | O(1) |
| Two pointers | O(n) | O(1) |
| Sliding window | O(n) | O(k) or O(1) |
| Binary search | O(log n) | O(1) |
| Hash map lookup | O(n) total | O(n) |
| Monotonic stack | O(n) | O(n) |
| Sorting then scanning | O(n log n) | O(1)–O(n) |
| BFS/DFS | O(V + E) | O(V) |
| Heap operations (k elements) | O(n log k) | O(k) |
| Backtracking subsets | O(n × 2^n) | O(n) |
| Backtracking permutations | O(n × n!) | O(n) |

## Key Interview Insights

- **Build heap = O(n), not O(n log n).** Know this — it surprises many interviewers.
- **Hash table O(1) is average case.** Always say "O(1) average" not just "O(1)" for hash operations.
- **Trie operations are O(m) independent of n.** Insert/search cost depends only on string length m, not how many strings are stored. This makes Trie better than hash map for prefix queries.
- **Balanced BST for ordered operations.** When you need floor, ceiling, rank, or range queries, use TreeMap/TreeSet — O(log n) guaranteed with ordering.
- **Dijkstra requires non-negative weights.** For negative weights, use Bellman-Ford.
- **Topological sort only works on DAGs.** If the graph has a cycle, topological order doesn't exist — Kahn's algorithm detects this via remaining in-degree > 0 nodes.
