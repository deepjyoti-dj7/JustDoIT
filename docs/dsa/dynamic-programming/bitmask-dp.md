---
title: Bitmask DP
description: DP where the state encodes a subset as a bitmask — for problems involving small sets with exponential state spaces
---

# Bitmask DP

Bitmask DP is the technique of encoding a **subset** of elements as a bitmask (a binary integer), and using that bitmask as a dimension of the DP state. It's used when:
- You need to track which elements from a small set have been "used" or "visited"
- The total number of elements is small (typically n ≤ 20, practically n ≤ 25)
- Naive backtracking would be exponential in the wrong way

## Bitmask Fundamentals

An integer with `n` bits can represent any subset of `n` elements. Bit `i` is 1 if element `i` is in the subset, 0 otherwise.

| Operation | Expression | Meaning |
|---|---|---|
| Check if bit `i` is set | `(mask >> i) & 1` | Is element `i` in the set? |
| Set bit `i` | `mask \| (1 << i)` | Add element `i` to set |
| Clear bit `i` | `mask & ~(1 << i)` | Remove element `i` from set |
| Count set bits | `__builtin_popcount(mask)` | Size of the subset |
| Full set of n elements | `(1 << n) - 1` | All elements present |
| Empty set | `0` | No elements |

## The Travelling Salesman Problem (TSP)

The canonical bitmask DP problem. Visit all `n` cities exactly once, starting and ending at city 0, minimizing total distance.

**Brute force:** Try all `n!` permutations — O(n! × n)

**Bitmask DP:** State = (current city, set of visited cities). At each state, try moving to any unvisited city.

**State:** `dp[mask][i]` = minimum cost to reach city `i` having visited exactly the cities in `mask`

**Recurrence:** `dp[mask | (1 << j)][j] = min(dp[mask | (1 << j)][j], dp[mask][i] + dist[i][j])` for each unvisited city `j`

**Base case:** `dp[1 << 0][0] = 0` (start at city 0, only city 0 visited)

**Answer:** `min(dp[full_mask][i] + dist[i][0])` for all `i` (return to city 0)

```cpp
int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    int fullMask = (1 << n) - 1;
    // dp[mask][i] = min cost to have visited 'mask', currently at city i
    vector<vector<int>> dp(1 << n, vector<int>(n, INT_MAX / 2));
    dp[1][0] = 0;  // start at city 0

    for (int mask = 1; mask <= fullMask; mask++) {
        for (int i = 0; i < n; i++) {
            if (!(mask & (1 << i))) continue;        // i must be in mask
            if (dp[mask][i] == INT_MAX / 2) continue;
            for (int j = 0; j < n; j++) {
                if (mask & (1 << j)) continue;       // j must NOT be in mask
                int newMask = mask | (1 << j);
                dp[newMask][j] = min(dp[newMask][j], dp[mask][i] + dist[i][j]);
            }
        }
    }

    int result = INT_MAX;
    for (int i = 1; i < n; i++)
        result = min(result, dp[fullMask][i] + dist[i][0]);
    return result;
}
```

```java
int tsp(int[][] dist) {
    int n = dist.length, fullMask = (1 << n) - 1;
    int[][] dp = new int[1 << n][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE / 2);
    dp[1][0] = 0;
    for (int mask = 1; mask <= fullMask; mask++) {
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) == 0 || dp[mask][i] == Integer.MAX_VALUE / 2) continue;
            for (int j = 0; j < n; j++) {
                if ((mask & (1 << j)) != 0) continue;
                int nm = mask | (1 << j);
                dp[nm][j] = Math.min(dp[nm][j], dp[mask][i] + dist[i][j]);
            }
        }
    }
    int result = Integer.MAX_VALUE;
    for (int i = 1; i < n; i++) result = Math.min(result, dp[fullMask][i] + dist[i][0]);
    return result;
}
```

```typescript
function tsp(dist: number[][]): number {
    const n = dist.length, fullMask = (1 << n) - 1;
    const INF = Infinity;
    const dp = Array.from({length: 1 << n}, () => new Array(n).fill(INF));
    dp[1][0] = 0;
    for (let mask = 1; mask <= fullMask; mask++) {
        for (let i = 0; i < n; i++) {
            if (!(mask & (1 << i)) || dp[mask][i] === INF) continue;
            for (let j = 0; j < n; j++) {
                if (mask & (1 << j)) continue;
                const nm = mask | (1 << j);
                dp[nm][j] = Math.min(dp[nm][j], dp[mask][i] + dist[i][j]);
            }
        }
    }
    let result = INF;
    for (let i = 1; i < n; i++) result = Math.min(result, dp[fullMask][i] + dist[i][0]);
    return result;
}
```

```python
def tsp(dist: list[list[int]]) -> int:
    n = len(dist)
    full_mask = (1 << n) - 1
    INF = float('inf')
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0  # start at city 0

    for mask in range(1, full_mask + 1):
        for i in range(n):
            if not (mask >> i & 1) or dp[mask][i] == INF:
                continue
            for j in range(n):
                if mask >> j & 1:
                    continue
                new_mask = mask | (1 << j)
                dp[new_mask][j] = min(dp[new_mask][j], dp[mask][i] + dist[i][j])

    return min(dp[full_mask][i] + dist[i][0] for i in range(1, n))
```

```go
func tsp(dist [][]int) int {
    n := len(dist)
    fullMask := (1 << n) - 1
    dp := make([][]int, 1<<n)
    for i := range dp {
        dp[i] = make([]int, n)
        for j := range dp[i] { dp[i][j] = 1<<31 - 1 }
    }
    dp[1][0] = 0
    for mask := 1; mask <= fullMask; mask++ {
        for i := 0; i < n; i++ {
            if mask>>i&1 == 0 || dp[mask][i] == 1<<31-1 { continue }
            for j := 0; j < n; j++ {
                if mask>>j&1 != 0 { continue }
                nm := mask | (1 << j)
                if v := dp[mask][i] + dist[i][j]; v < dp[nm][j] { dp[nm][j] = v }
            }
        }
    }
    result := 1<<31 - 1
    for i := 1; i < n; i++ {
        if v := dp[fullMask][i] + dist[i][0]; v < result { result = v }
    }
    return result
}
```

**Complexity:** O(2ⁿ × n²) time, O(2ⁿ × n) space — much better than O(n!) brute force for small n

## Subset Assignment: Assign Workers to Jobs

**Problem:** `n` workers, `n` jobs, cost `cost[i][j]` to assign worker `i` to job `j`. Minimize total cost. Each worker gets exactly one job.

**State:** `dp[mask]` = minimum cost to assign jobs for the set `mask` of jobs to the first `popcount(mask)` workers

**Recurrence:** If `k = popcount(mask)` workers are assigned (0-indexed), worker `k` takes any unassigned job `j`:
```
dp[mask | (1 << j)] = min(dp[mask | (1 << j)], dp[mask] + cost[k][j])
```

```cpp
int assignJobs(vector<vector<int>>& cost) {
    int n = cost.size();
    vector<int> dp(1 << n, INT_MAX / 2);
    dp[0] = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        int worker = __builtin_popcount(mask);  // next worker to assign
        if (worker == n) continue;
        for (int job = 0; job < n; job++) {
            if (mask & (1 << job)) continue;
            dp[mask | (1 << job)] = min(dp[mask | (1 << job)],
                                        dp[mask] + cost[worker][job]);
        }
    }
    return dp[(1 << n) - 1];
}
```

```java
int assignJobs(int[][] cost) {
    int n = cost.length;
    int[] dp = new int[1 << n];
    Arrays.fill(dp, Integer.MAX_VALUE / 2);
    dp[0] = 0;
    for (int mask = 0; mask < (1 << n); mask++) {
        int worker = Integer.bitCount(mask);
        if (worker == n) continue;
        for (int job = 0; job < n; job++) {
            if ((mask & (1 << job)) != 0) continue;
            dp[mask | (1 << job)] = Math.min(dp[mask | (1 << job)], dp[mask] + cost[worker][job]);
        }
    }
    return dp[(1 << n) - 1];
}
```

```typescript
function assignJobs(cost: number[][]): number {
    const n = cost.length;
    const dp = new Array(1 << n).fill(Infinity);
    dp[0] = 0;
    for (let mask = 0; mask < (1 << n); mask++) {
        const worker = mask.toString(2).split('1').length - 1;  // popcount
        if (worker === n) continue;
        for (let job = 0; job < n; job++) {
            if (mask & (1 << job)) continue;
            const nm = mask | (1 << job);
            dp[nm] = Math.min(dp[nm], dp[mask] + cost[worker][job]);
        }
    }
    return dp[(1 << n) - 1];
}
```

```python
def assign_jobs(cost: list[list[int]]) -> int:
    n = len(cost)
    dp = [float('inf')] * (1 << n)
    dp[0] = 0
    for mask in range(1 << n):
        worker = bin(mask).count('1')  # popcount
        if worker == n: continue
        for job in range(n):
            if mask >> job & 1: continue
            new_mask = mask | (1 << job)
            dp[new_mask] = min(dp[new_mask], dp[mask] + cost[worker][job])
    return dp[(1 << n) - 1]
```

```go
func assignJobs(cost [][]int) int {
    n := len(cost)
    dp := make([]int, 1<<n)
    for i := range dp { dp[i] = 1<<31 - 1 }
    dp[0] = 0
    for mask := 0; mask < (1 << n); mask++ {
        worker := bits.OnesCount(uint(mask))
        if worker == n { continue }
        for job := 0; job < n; job++ {
            if mask>>job&1 != 0 { continue }
            nm := mask | (1 << job)
            if v := dp[mask] + cost[worker][job]; v < dp[nm] { dp[nm] = v }
        }
    }
    return dp[(1<<n)-1]
}
```

## Counting Paths Through Subsets: Hamiltonian Path

Count paths that visit every node exactly once. Similar to TSP but without the return.

**State:** `dp[mask][i]` = number of paths visiting exactly the nodes in `mask` and ending at node `i`

```cpp
int countHamiltonianPaths(vector<vector<int>>& adj) {
    int n = adj.size(), fullMask = (1 << n) - 1;
    vector<vector<long long>> dp(1 << n, vector<long long>(n, 0));
    for (int i = 0; i < n; i++) dp[1 << i][i] = 1;  // start at any node
    for (int mask = 1; mask <= fullMask; mask++)
        for (int i = 0; i < n; i++) {
            if (!dp[mask][i] || !(mask & (1 << i))) continue;
            for (int j = 0; j < n; j++) {
                if ((mask & (1 << j)) || !adj[i][j]) continue;
                dp[mask | (1 << j)][j] += dp[mask][i];
            }
        }
    long long result = 0;
    for (int i = 0; i < n; i++) result += dp[fullMask][i];
    return result;
}
```

```java
long countHamiltonianPaths(int[][] adj) {
    int n = adj.length, fullMask = (1 << n) - 1;
    long[][] dp = new long[1 << n][n];
    for (int i = 0; i < n; i++) dp[1 << i][i] = 1;
    for (int mask = 1; mask <= fullMask; mask++)
        for (int i = 0; i < n; i++) {
            if (dp[mask][i] == 0 || (mask & (1 << i)) == 0) continue;
            for (int j = 0; j < n; j++) {
                if ((mask & (1 << j)) != 0 || adj[i][j] == 0) continue;
                dp[mask | (1 << j)][j] += dp[mask][i];
            }
        }
    long result = 0;
    for (int i = 0; i < n; i++) result += dp[fullMask][i];
    return result;
}
```

```typescript
function countHamiltonianPaths(adj: number[][]): number {
    const n = adj.length, fullMask = (1 << n) - 1;
    const dp = Array.from({length: 1 << n}, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) dp[1 << i][i] = 1;
    for (let mask = 1; mask <= fullMask; mask++)
        for (let i = 0; i < n; i++) {
            if (!dp[mask][i] || !(mask & (1 << i))) continue;
            for (let j = 0; j < n; j++) {
                if ((mask & (1 << j)) || !adj[i][j]) continue;
                dp[mask | (1 << j)][j] += dp[mask][i];
            }
        }
    return Array.from({length: n}, (_, i) => dp[fullMask][i]).reduce((a, b) => a + b, 0);
}
```

```python
def count_hamiltonian_paths(adj: list[list[int]]) -> int:
    n = len(adj)
    full_mask = (1 << n) - 1
    dp = [[0] * n for _ in range(1 << n)]
    for i in range(n):
        dp[1 << i][i] = 1
    for mask in range(1, full_mask + 1):
        for i in range(n):
            if not dp[mask][i] or not (mask >> i & 1): continue
            for j in range(n):
                if mask >> j & 1 or not adj[i][j]: continue
                dp[mask | (1 << j)][j] += dp[mask][i]
    return sum(dp[full_mask])
```

```go
func countHamiltonianPaths(adj [][]int) int64 {
    n := len(adj)
    fullMask := (1 << n) - 1
    dp := make([][]int64, 1<<n)
    for i := range dp { dp[i] = make([]int64, n) }
    for i := 0; i < n; i++ { dp[1<<i][i] = 1 }
    for mask := 1; mask <= fullMask; mask++ {
        for i := 0; i < n; i++ {
            if dp[mask][i] == 0 || mask>>i&1 == 0 { continue }
            for j := 0; j < n; j++ {
                if mask>>j&1 != 0 || adj[i][j] == 0 { continue }
                dp[mask|(1<<j)][j] += dp[mask][i]
            }
        }
    }
    var result int64
    for i := 0; i < n; i++ { result += dp[fullMask][i] }
    return result
}
```

## Complexity and Constraints

| n | States | Transitions | Total Time |
|---|---|---|---|
| 10 | 1,024 | ~10 | ~10K |
| 15 | 32,768 | ~15 | ~500K |
| 20 | 1,048,576 | ~20 | ~20M |
| 25 | 33,554,432 | ~25 | ~840M (borderline) |

Bitmask DP is practical for `n ≤ 20`. Beyond that, you need heuristics or approximations.

## Recognizing Bitmask DP Problems

**Strong signals:**
- n ≤ 20 and you need to track which of n elements are used
- "Visit all nodes/cities exactly once"
- "Assign each of n items to exactly one of n slots"
- "For each subset, compute something"

**Anti-patterns (bitmask DP probably NOT needed):**
- n > 25 (too large)
- Items have no identity (just values, not distinct items) → regular knapsack
- The order of selection doesn't matter → regular knapsack or combinations

## Key Interview Insights

**The bit-counting trick:** `popcount(mask)` (number of set bits) tells you how many items are "used" — this naturally gives you the index of the "next worker" or "current step" in assignment problems. This avoids needing a separate counter.

**Enumerate submasks efficiently:** To iterate over all subsets of a mask:
```
for (int sub = mask; sub > 0; sub = (sub - 1) & mask)
```
This visits all non-empty subsets in O(3ⁿ) total time across all masks (each element is in/out/not-considered for each mask).

**Memory warning:** A `dp[2^20][20]` table is 20 million integers — about 80MB. For `n = 20`, this is the limit. Consider using `long` instead of `int` for counting problems to avoid overflow.

**Common bug:** Iterating masks in the wrong order. Iterate `mask` from 0 to `(1 << n) - 1` so that when you update `dp[mask | (1 << j)]`, `mask | (1 << j) > mask` is always already computed (it's a larger mask processed later). ✓
