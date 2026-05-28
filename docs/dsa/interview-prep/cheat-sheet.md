---
title: DSA Cheat Sheet
description: Quick-reference complexity tables, built-in operations, and pattern signals for coding interviews
---

# DSA Cheat Sheet

A condensed reference for everything you need during interview preparation. Bookmark this and use it actively.

---

## Data Structure Complexity

| Data Structure | Access | Search | Insert | Delete | Notes |
|---|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) | O(log n) search if sorted |
| Dynamic Array | O(1) | O(n) | O(1) amort. | O(n) | Append is O(1) amortized |
| Linked List | O(n) | O(n) | O(1) at head | O(1) at head | O(n) to find position |
| Doubly Linked List | O(n) | O(n) | O(1) | O(1) | Given pointer to node |
| Stack | O(n) | O(n) | O(1) | O(1) | LIFO; top in O(1) |
| Queue | O(n) | O(n) | O(1) | O(1) | FIFO; front in O(1) |
| Hash Map | N/A | O(1) avg | O(1) avg | O(1) avg | O(n) worst case |
| Hash Set | N/A | O(1) avg | O(1) avg | O(1) avg | O(n) worst case |
| Binary Heap (Min/Max) | O(1) peek | O(n) | O(log n) | O(log n) | Build heap: O(n) |
| BST (balanced) | O(log n) | O(log n) | O(log n) | O(log n) | Unbalanced: O(n) |
| Trie | N/A | O(L) | O(L) | O(L) | L = key length |
| Union-Find | N/A | O(α(n)) | O(α(n)) | N/A | α(n) is near constant |

---

## Sorting Algorithm Complexity

| Algorithm | Best | Average | Worst | Space | Stable? |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Selection Sort | O(n^2) | O(n^2) | O(n^2) | O(1) | No |
| Insertion Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n+k) | Yes |
| Tim Sort | O(n) | O(n log n) | O(n log n) | O(n) | Yes |

> **Built-in sorts** (Python `sort`, Java `Arrays.sort`, etc.) are Tim Sort — O(n log n) worst case, stable.

---

## Graph Algorithm Complexity

| Algorithm | Time | Space | Use Case |
|---|---|---|---|
| BFS | O(V + E) | O(V) | Shortest path (unweighted), level order |
| DFS | O(V + E) | O(V) | Connected components, cycle detection, topological sort |
| Dijkstra (min-heap) | O((V+E) log V) | O(V) | Shortest path (non-negative weights) |
| Bellman-Ford | O(VE) | O(V) | Shortest path (negative weights) |
| Floyd-Warshall | O(V^3) | O(V^2) | All-pairs shortest path |
| Kruskal's MST | O(E log E) | O(V) | Minimum spanning tree |
| Prim's MST | O((V+E) log V) | O(V) | Minimum spanning tree |
| Topological Sort (Kahn's) | O(V + E) | O(V) | DAG ordering |
| Tarjan's SCC | O(V + E) | O(V) | Strongly connected components |

---

## Tree Operations

| Operation | BST (balanced) | Binary Tree | Trie |
|---|---|---|---|
| Search | O(log n) | O(n) | O(L) |
| Insert | O(log n) | O(n) | O(L) |
| Delete | O(log n) | O(n) | O(L) |
| Min/Max | O(log n) | O(n) | N/A |
| Successor/Predecessor | O(log n) | O(n) | N/A |

Tree traversals (all O(n)):
- **Preorder:** root → left → right (serialize tree, clone)
- **Inorder:** left → root → right (BST gives sorted output)
- **Postorder:** left → right → root (delete tree, evaluate expression)
- **Level order:** BFS (shortest path, right side view)

---

## Dynamic Programming Patterns

| Pattern | State | Recurrence Shape | Example |
|---|---|---|---|
| 1D Linear | `dp[i]` | `dp[i] = f(dp[i-1], dp[i-2])` | Fibonacci, House Robber |
| 1D Prefix | `dp[i]` | `dp[i] = max(dp[j]) + cost` for j < i | LIS, Jump Game II |
| 2D Grid | `dp[i][j]` | `dp[i][j] = dp[i-1][j] + dp[i][j-1]` | Unique Paths, Min Path Sum |
| Knapsack 0/1 | `dp[i][w]` | `dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt]+val)` | 0/1 Knapsack, Subset Sum |
| Knapsack Unbounded | `dp[w]` | `dp[w] = min(dp[w-coin]+1)` | Coin Change |
| Interval DP | `dp[i][j]` | `dp[i][j] = max(dp[i][k] + dp[k+1][j])` | Burst Balloons, MCM |
| Tree DP | `dp[node]` | Combine results from children | Diameter, Max Path Sum |
| Bitmask DP | `dp[mask]` | Iterate over set bits | TSP, Assign Tasks |

---

## Input Size → Complexity Guide

| n | Maximum Complexity | Typical Approach |
|---|---|---|
| n <= 10 | O(n!) | Brute force, permutations |
| n <= 20 | O(2^n) | Bitmask DP, backtracking |
| n <= 100 | O(n^3) | Triple nested loop, Floyd-Warshall |
| n <= 1,000 | O(n^2) | Double nested loop, DP |
| n <= 100,000 | O(n log n) | Sort, heap, binary search |
| n <= 1,000,000 | O(n) | Linear scan, sliding window, prefix sum |
| n <= 10^9 | O(log n) | Binary search, math |

---

## Pattern → Signal Quick Reference

| Signals in Problem | Pattern |
|---|---|
| Sorted array + pair with sum | Two Pointers |
| Subarray/substring with property | Sliding Window |
| Cycle in linked list / sequence | Fast & Slow Pointers |
| Count distinct / lookup O(1) | Hash Map / Set |
| Sorted input + find value | Binary Search |
| Any range sum query | Prefix Sum |
| Next greater/smaller element | Monotonic Stack |
| Shortest path (unweighted) | BFS |
| All paths / subsets / permutations | DFS / Backtracking |
| Overlapping subproblems | Dynamic Programming |
| Greedy choice works | Greedy |
| [start, end] intervals | Sort + Sweep Line |
| Top-K elements | Heap |
| Connected components, dynamic edges | Union-Find |
| Prefix matching / word search | Trie |
| Weighted shortest path | Dijkstra |

---

## Common Built-in Operations by Language

### Sorting

```cpp
sort(v.begin(), v.end());                       // ascending
sort(v.begin(), v.end(), greater<int>());        // descending
sort(v.begin(), v.end(), [](a, b){ return ...; }); // custom
```

```java
Arrays.sort(arr);                                // ascending
Arrays.sort(arr, (a, b) -> b - a);              // descending (objects)
Collections.sort(list, Comparator.reverseOrder()); // descending list
```

```typescript
arr.sort((a, b) => a - b);   // ascending number sort (ALWAYS provide comparator)
arr.sort((a, b) => b - a);   // descending
```

```python
arr.sort()                            # in-place ascending
arr.sort(key=lambda x: -x)           # descending
sorted(arr, key=lambda x: x[1])      # by second element
```

```go
import "sort"
sort.Ints(arr)                                      // ascending int slice
sort.Slice(arr, func(i, j int) bool { return arr[i] > arr[j] }) // descending
```

### Min / Max Heap

```cpp
priority_queue<int> maxHeap;                     // max-heap (default)
priority_queue<int, vector<int>, greater<int>> minHeap; // min-heap
```

```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();          // min-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
```

```typescript
// No built-in heap — use sorted array or a library
// Common interview pattern: sort after each insert (small k only)
```

```python
import heapq
heapq.heappush(heap, val)    # min-heap by default
heapq.heappop(heap)          # pop minimum
# For max-heap: push/pop -val
```

```go
import "container/heap"
// Must implement heap.Interface: Len, Less, Swap, Push, Pop
```

### String Operations

```cpp
s.substr(start, len)   // substring
s.find("abc")          // -1 if not found, else index
to_string(42)          // int to string
stoi("42")             // string to int
```

```java
s.substring(start, end)        // [start, end)
s.indexOf("abc")               // -1 if not found
String.valueOf(42)             // int to string
Integer.parseInt("42")         // string to int
s.toCharArray()                // string to char array
String.join(",", list)         // join list of strings
```

```typescript
s.slice(start, end)            // [start, end)
s.indexOf("abc")               // -1 if not found
String(42)                     // number to string
parseInt("42")                 // string to int
s.split('')                    // string to char array
Array.from(new Set(arr))       // deduplicate array
```

```python
s[start:end]                   # [start, end)
s.find("abc")                  # -1 if not found
str(42)                        # int to string
int("42")                      # string to int
list(s)                        # string to char list
''.join(char_list)             # char list to string
Counter(s)                     # character frequency map
```

```go
s[start:end]                   // [start, end) bytes
strings.Index(s, "abc")        // -1 if not found
strconv.Itoa(42)               // int to string
strconv.Atoi("42")             // string to int (returns int, error)
[]rune(s)                      // string to rune slice (Unicode-safe)
```

---

## Edge Cases Checklist

Use this before finalizing any solution:

**Input edge cases:**
- [ ] Empty input (`[]`, `""`, `null`)
- [ ] Single element
- [ ] All identical elements
- [ ] Minimum/maximum allowed values
- [ ] Negative numbers (if applicable)
- [ ] Zero (as value or as input)

**Array / String specific:**
- [ ] Off-by-one: index 0 vs index n-1 vs length n
- [ ] Subarray of length 0 vs length 1
- [ ] Last element included/excluded in loop

**Number specific:**
- [ ] Integer overflow: `int` max is ~2.1 * 10^9; use `long` for n^2 scale products
- [ ] Division by zero
- [ ] Modulo of negative numbers (language-dependent)

**Graph / Tree specific:**
- [ ] Disconnected graph
- [ ] Cycle
- [ ] Empty tree (null root)
- [ ] Single node tree
- [ ] Linear tree (skewed)

**Linked List specific:**
- [ ] Empty list
- [ ] Single node
- [ ] Two nodes (especially for reversal problems)
- [ ] Cycle

---

## Integer Limits Reference

| Type | Min | Max |
|---|---|---|
| int (32-bit) | -2,147,483,648 | 2,147,483,647 (~2.1 * 10^9) |
| long (64-bit) | -9.2 * 10^18 | 9.2 * 10^18 |
| Python int | Unbounded (arbitrary precision) | — |

Common overflow traps:
- `a + b` overflows if both are near INT_MAX → use `long` or check `a > INT_MAX - b`
- `mid = (lo + hi) / 2` → use `lo + (hi - lo) / 2`
- `-INT_MIN` overflows in C++/Java (two's complement) → cast to `long` first

---

## Modular Arithmetic Shortcuts

When the answer requires `mod 10^9 + 7`:

```
MOD = 1_000_000_007

(a + b) % MOD          -- addition
(a - b + MOD) % MOD    -- subtraction (prevent negative)
(a * b) % MOD          -- multiplication (use long for a*b)
pow(b, e, MOD)         -- Python: built-in; others: fast exponentiation
```

Modular inverse (when MOD is prime): `inv(a) = pow(a, MOD-2, MOD)`

---

## Complexity of Common Recursions (Master Theorem)

| Recurrence | Result | Example |
|---|---|---|
| T(n) = T(n/2) + O(1) | O(log n) | Binary search |
| T(n) = T(n-1) + O(1) | O(n) | Linear scan |
| T(n) = 2T(n/2) + O(n) | O(n log n) | Merge sort |
| T(n) = T(n-1) + O(n) | O(n^2) | Insertion sort |
| T(n) = 2T(n/2) + O(1) | O(n) | Tree traversal |
| T(n) = 2T(n-1) + O(1) | O(2^n) | Naive Fibonacci |
