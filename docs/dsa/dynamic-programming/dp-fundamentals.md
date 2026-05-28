---
title: Dynamic Programming Fundamentals
description: Core DP concepts, identification patterns, and the systematic thought process for solving any DP problem
---

# Dynamic Programming Fundamentals

Dynamic Programming is not a data structure or a specific algorithm — it's a **problem-solving paradigm**. DP is the technique of breaking a problem into overlapping subproblems and storing the results so you never recompute them.

The honest definition: **DP = recursion + memoization**. Everything else is engineering.

## Why DP Exists

Consider the naive recursive Fibonacci:

```
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2) ← computed again
│   │   └── fib(1)
│   └── fib(2)   ← computed again
└── fib(3)       ← computed again
    ├── fib(2)   ← computed again
    └── fib(1)
```

`fib(3)` is called twice, `fib(2)` is called three times. The call tree grows exponentially — O(2ⁿ). DP fixes this by **caching results**: each subproblem is solved once and reused. O(2ⁿ) becomes O(n).

## Two Necessary Conditions for DP

A problem is a DP problem if and only if it has **both** of these properties:

### 1. Overlapping Subproblems

The same sub-computations appear multiple times when solving the main problem recursively. This is what makes caching worth it.

**Test:** Draw the recursion tree. Do you see duplicate nodes? → DP applies.

**Counter-example:** Merge sort has subproblems, but they never overlap (each half is unique). Merge sort is divide-and-conquer, not DP.

### 2. Optimal Substructure

The optimal solution to the main problem can be built from optimal solutions to its subproblems.

**Test:** Can you define `f(n)` purely in terms of `f(smaller inputs)`? → Optimal substructure exists.

**Counter-example:** Longest path in a general graph has no optimal substructure (optimal sub-paths can contradict each other), so DP fails there.

## Recognizing DP Problems

These signal words and problem shapes almost always indicate DP:

| Signal | Example Problem |
|---|---|
| "How many ways..." | Climbing stairs, coin change count |
| "Maximum/minimum..." | Knapsack, edit distance |
| "Can you achieve..." | Subset sum, partition equal subset |
| "Longest/shortest..." | LCS, LIS, edit distance |
| "Is it possible to..." | Word break, partition |
| Sequences with choices | Rod cutting, stock buy/sell |
| 2D grid traversal | Unique paths, min path sum |
| String matching | Edit distance, regex matching |

If you see any of these patterns **and** the brute force is exponential recursion, reach for DP.

## The 4-Step DP Framework

Every DP problem follows this systematic process:

### Step 1: Define the State

The **state** is what uniquely describes a subproblem. This is the most critical step.

Ask: "What information do I need to answer this subproblem?"

- For sequence problems: usually the current index
- For two-sequence problems: two indices
- For knapsack-style: index + remaining capacity
- For interval DP: left and right bounds

Write `dp[i]` or `dp[i][j]` and precisely define what it represents. The definition must be complete: **"dp[i] is the [answer] for [what specific subproblem]."**

### Step 2: Write the Recurrence

Express `dp[state]` in terms of smaller states. This is your transition function.

Enumerate all choices at the current state, take the best one:

```
dp[i] = max/min over all choices at step i
```

### Step 3: Identify Base Cases

What are the smallest subproblems you can answer directly without recursion?

Base cases are where the recursion bottoms out. Missing a base case = infinite recursion or wrong answers.

### Step 4: Determine Evaluation Order

For bottom-up DP: subproblems must be solved before the problems that depend on them.

- Linear DP: left to right (usually)
- 2D DP: row by row
- Interval DP: by increasing length

## A Concrete Template

Here is the mental model applied to the Fibonacci problem:

**State:** `dp[i]` = the i-th Fibonacci number

**Recurrence:** `dp[i] = dp[i-1] + dp[i-2]`

**Base cases:** `dp[0] = 0`, `dp[1] = 1`

**Order:** Left to right (i = 2 to n)

```cpp
int fib(int n) {
    if (n <= 1) return n;
    vector<int> dp(n + 1);
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
```

```java
int fib(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
```

```typescript
function fib(n: number): number {
    if (n <= 1) return n;
    const dp = new Array(n + 1).fill(0);
    dp[1] = 1;
    for (let i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}
```

```python
def fib(n: int) -> int:
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]
```

```go
func fib(n int) int {
    if n <= 1 { return n }
    dp := make([]int, n+1)
    dp[1] = 1
    for i := 2; i <= n; i++ {
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[n]
}
```

## Top-Down vs Bottom-Up

There are two implementation strategies for the same DP idea:

| | Top-Down (Memoization) | Bottom-Up (Tabulation) |
|---|---|---|
| **Direction** | Recursive, start from answer | Iterative, build from base |
| **Code style** | Natural recursion + cache | Loops filling a table |
| **Subproblems solved** | Only what's needed | All subproblems |
| **Stack overflow risk** | Yes (deep recursion) | No |
| **Easier to write** | ✓ Usually | Sometimes harder |
| **Space optimization** | Harder | Easier (rolling array) |

Both are valid. In interviews, top-down is often faster to implement correctly. Bottom-up is preferred when space optimization matters.

## DP Complexity Analysis

**Time complexity:** (number of distinct states) × (work per state)

**Space complexity:** (number of distinct states) — often reducible

For `dp[i][j]` with `i` up to `n` and `j` up to `m`, and O(1) work per state: **O(nm) time, O(nm) space** (reducible to O(m) with rolling array if transitions only look at the previous row).

## Common DP Pitfalls

**Off-by-one errors** are the most common DP bug. Be precise about whether indices are inclusive or exclusive, and whether the array is 0-indexed or 1-indexed.

**Wrong state definition** leads to recurrences that don't hold. If your recurrence feels awkward, revisit the state definition before writing code.

**Missing base cases** cause incorrect results in edge cases. Always trace through `n=0`, `n=1`, and empty-string inputs.

**Initializing with wrong sentinel values** for min/max problems. Use `Integer.MAX_VALUE / 2` (not `MAX_VALUE`) to avoid overflow when adding to it.

**Memoization without correct key** in multi-dimensional states. Forgetting one dimension of the state = wrong answers that are hard to debug.

## DP Patterns Overview

| Pattern | Key Insight | Representative Problems |
|---|---|---|
| **Linear DP** | State is an index; decisions at each step | Fibonacci, Climbing Stairs, House Robber |
| **Knapsack** | Include/exclude decision at each item | 0/1 Knapsack, Subset Sum, Partition |
| **Unbounded Knapsack** | Items can be reused | Coin Change, Unbounded Knapsack |
| **Interval DP** | State is a range [i, j]; merge subranges | Burst Balloons, Matrix Chain, Palindrome |
| **2D Grid DP** | State is (row, col); move in a grid | Unique Paths, Min Path Sum, Dungeon Game |
| **String DP** | Two-pointer state on two strings | Edit Distance, LCS, Regular Expression |
| **LIS / LCS** | Subsequence optimization | Longest Increasing Subsequence, LCS |
| **Bitmask DP** | State encodes a set as a bitmask | TSP, Assignment, Hamiltonian Path |
| **Tree DP** | DFS + DP on subtree results | Diameter, Max Path Sum, Independent Set |
| **DP on Digits** | Count numbers with constraints | Digit DP, Count numbers < N |

## The Right Mental Model

Think of DP as filling a table. Each cell answers one specific question about a subproblem. Your job is:

1. Define exactly what question each cell answers
2. Figure out which smaller cells you need to answer the current one
3. Fill in the easy cells first (base cases)
4. Fill the rest in the right order

When you're stuck on a DP problem in an interview:
1. Write the brute force recursive solution first — it always exists
2. Identify the repeated sub-calls (draw the recursion tree mentally)
3. Cache those sub-calls (memoization) — you're done with top-down
4. Optionally, convert to bottom-up for cleaner code or space savings
