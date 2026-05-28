---
title: Recursion Fundamentals
description: How recursion works, how to think recursively, and the mental models that make every recursive problem tractable
---

# Recursion Fundamentals

Recursion is not a trick — it is a way of thinking. Once you internalize the mental model, recursive solutions become the *obvious* choice for a wide class of problems. This page builds that model from the ground up.

## What Is Recursion?

A function is recursive when it calls itself with a *smaller* version of the same problem. The solution to the big problem is built from solutions to the smaller problems.

```
solve(problem) = combine(solve(smaller_1), solve(smaller_2), ...)
```

This definition has two requirements:
1. **Base case** — a version of the problem small enough to answer directly (no recursion)
2. **Recursive case** — reduce the problem toward the base case and combine results

## The Three Questions

Before writing any recursive function, answer these:

| Question | What to define |
|---|---|
| What does this function *do*? | The contract — input → output |
| What is the *base case*? | When do we stop? |
| How do we *reduce* toward it? | What smaller version do we pass down? |

## Example: Factorial

`factorial(n) = n * factorial(n-1)`, base case `factorial(0) = 1`.

```cpp
int factorial(int n) {
    if (n == 0) return 1;          // base case
    return n * factorial(n - 1);  // recursive case
}
```

```java
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}
```

```typescript
function factorial(n: number): number {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}
```

```python
def factorial(n: int) -> int:
    if n == 0:
        return 1
    return n * factorial(n - 1)
```

```go
func factorial(n int) int {
    if n == 0 { return 1 }
    return n * factorial(n-1)
}
```

## The Call Stack

Each recursive call pushes a new **stack frame** onto the call stack. The frame holds the function's local variables and where to return to. Frames are popped in reverse order (LIFO).

```
factorial(4)
  factorial(3)
    factorial(2)
      factorial(1)
        factorial(0) → returns 1
      → returns 1 * 1 = 1
    → returns 2 * 1 = 2
  → returns 3 * 2 = 6
→ returns 4 * 6 = 24
```

**Stack overflow** happens when the recursion goes too deep without hitting a base case (infinite recursion, or input too large). Python's default stack depth is ~1000 frames; Java/C++ are typically ~10,000+.

## Recursion Tree

Draw a tree where each node is a function call and each edge is a recursive call. The leaves are base cases.

```
                fib(4)
               /      \
           fib(3)    fib(2)
           /    \    /    \
       fib(2) fib(1) fib(1) fib(0)
       /    \
   fib(1) fib(0)
```

The recursion tree makes two things visible:
- **Total work** = number of nodes × work per node
- **Repeated subproblems** = same node appearing multiple times (memoization opportunity)

## Example: Fibonacci

```cpp
// Naive: O(2^n) time — exponential tree
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// Memoized: O(n) time, O(n) space
int fib(int n, unordered_map<int,int>& memo) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n-1, memo) + fib(n-2, memo);
}
```

```java
// Naive recursive
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// Memoized with HashMap
int fib(int n, Map<Integer, Integer> memo) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    int result = fib(n - 1, memo) + fib(n - 2, memo);
    memo.put(n, result);
    return result;
}
```

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
```

```typescript
function fib(n: number, memo = new Map<number, number>()): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;
    const result = fib(n - 1, memo) + fib(n - 2, memo);
    memo.set(n, result);
    return result;
}
```

```go
func fib(n int, memo map[int]int) int {
    if n <= 1 { return n }
    if v, ok := memo[n]; ok { return v }
    memo[n] = fib(n-1, memo) + fib(n-2, memo)
    return memo[n]
}
```

## Structural Recursion

Many data structures are *recursively defined*. Trees are the canonical example: a tree is either empty, or a node with left and right subtrees (both of which are trees). Recursive code mirrors this structure naturally.

```cpp
// Inorder traversal — structure mirrors the tree definition
void inorder(TreeNode* root) {
    if (!root) return;           // base case: empty tree
    inorder(root->left);         // solve left subtree
    process(root->val);          // handle current node
    inorder(root->right);        // solve right subtree
}
```

```java
void inorder(TreeNode root) {
    if (root == null) return;
    inorder(root.left);
    process(root.val);
    inorder(root.right);
}
```

```python
def inorder(root: TreeNode) -> None:
    if not root:
        return
    inorder(root.left)
    process(root.val)
    inorder(root.right)
```

```typescript
function inorder(root: TreeNode | null): void {
    if (!root) return;
    inorder(root.left);
    process(root.val);
    inorder(root.right);
}
```

```go
func inorder(root *TreeNode) {
    if root == nil { return }
    inorder(root.Left)
    process(root.Val)
    inorder(root.Right)
}
```

## Complexity of Recursive Algorithms

### Work per level × number of levels

For a binary recursion (each call makes 2 recursive calls) with `n` levels:
- Nodes at level `k` = $2^k$
- Total nodes = $2^0 + 2^1 + ... + 2^n = 2^{n+1} - 1 = O(2^n)$

### The Recurrence Relation

Express the work mathematically:
```
T(n) = a * T(n/b) + f(n)
```
Where:
- `a` = number of recursive subproblems
- `n/b` = size of each subproblem
- `f(n)` = work done outside the recursive calls

Use the **Master Theorem** to solve: [see complexity-analysis/master-theorem]

| Recurrence | Example | Solution |
|---|---|---|
| T(n) = T(n-1) + O(1) | Factorial | O(n) |
| T(n) = T(n-1) + O(n) | Selection sort | O(n²) |
| T(n) = 2T(n/2) + O(n) | Merge sort | O(n log n) |
| T(n) = 2T(n-1) + O(1) | Tower of Hanoi | O(2ⁿ) |

## Tail Recursion

A recursive call is **tail recursive** when the recursive call is the *last operation* in the function — nothing happens after it returns.

Non-tail recursive (multiplication happens *after* the return):

```cpp
// NOT tail recursive
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);  // multiplication is the last op, not the call
}

// Tail recursive — accumulator carries the work
int factorialTail(int n, int acc = 1) {
    if (n == 0) return acc;
    return factorialTail(n - 1, n * acc);  // call is the last op
}
```

```java
// NOT tail recursive
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}

// Tail recursive
int factorialTail(int n, int acc) {
    if (n == 0) return acc;
    return factorialTail(n - 1, n * acc);
}
```

```typescript
// NOT tail recursive
function factorial(n: number): number {
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

// Tail recursive
function factorialTail(n: number, acc = 1): number {
    if (n === 0) return acc;
    return factorialTail(n - 1, n * acc);
}
```

```python
# NOT tail recursive — multiplication happens after return
def factorial(n: int) -> int:
    if n == 0: return 1
    return n * factorial(n - 1)  # n * (...) is the last operation

# Tail recursive — accumulator carries the work
def factorial_tail(n: int, acc: int = 1) -> int:
    if n == 0: return acc
    return factorial_tail(n - 1, n * acc)  # call is the last operation
```

```go
// NOT tail recursive
func factorial(n int) int {
    if n == 0 { return 1 }
    return n * factorial(n-1)
}

// Tail recursive
func factorialTail(n, acc int) int {
    if n == 0 { return acc }
    return factorialTail(n-1, n*acc)
}
```

Tail-recursive functions can be optimized by the compiler/interpreter into loops (tail call optimization — TCO). Python does **not** do TCO. Java and Go do not either. C++ compilers often do with optimization flags.

## The Divide-and-Conquer Pattern

Divide the problem into subproblems, solve them recursively, and merge the results.

```cpp
// Generic divide-and-conquer skeleton (e.g., merge sort)
void solve(vector<int>& arr, int lo, int hi) {
    if (lo >= hi) return;          // base case: single element
    int mid = lo + (hi - lo) / 2;
    solve(arr, lo, mid);           // left subproblem
    solve(arr, mid + 1, hi);       // right subproblem
    merge(arr, lo, mid, hi);       // combine results
}
```

```java
void solve(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    solve(arr, lo, mid);
    solve(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
}
```

```typescript
function solve(arr: number[], lo: number, hi: number): void {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    solve(arr, lo, mid);
    solve(arr, mid + 1, hi);
    merge(arr, lo, mid, hi);
}
```

```python
def solve(arr: list, lo: int, hi: int) -> None:
    if lo >= hi:
        return          # base case: single element
    mid = (lo + hi) // 2
    solve(arr, lo, mid)      # left subproblem
    solve(arr, mid + 1, hi)  # right subproblem
    merge(arr, lo, mid, hi)  # combine results
```

```go
func solve(arr []int, lo, hi int) {
    if lo >= hi { return }
    mid := lo + (hi-lo)/2
    solve(arr, lo, mid)
    solve(arr, mid+1, hi)
    merge(arr, lo, mid, hi)
}
```

Classic examples: Merge Sort, Quick Sort, Binary Search.

## Common Pitfalls

| Pitfall | What goes wrong | Fix |
|---|---|---|
| Missing base case | Stack overflow | Define the smallest valid input |
| Wrong base case | Off-by-one errors | Trace through smallest inputs manually |
| Not reducing toward base | Infinite recursion | Ensure recursive call is strictly smaller |
| Exponential recomputation | TLE on large inputs | Memoize repeated subproblems |
| Mutating shared state | Incorrect results | Pass copies or use backtracking (undo after recurse) |

## Iteration vs Recursion

Every recursive algorithm can be rewritten iteratively (using an explicit stack). When should you prefer each?

| Use Recursion | Use Iteration |
|---|---|
| Problem is naturally tree-shaped | Performance-critical code (no stack overhead) |
| Code clarity is worth more than micro-optimization | Language lacks TCO and input is large |
| Backtracking (trying choices) | Simple linear traversals |
| Tree/graph traversals | When stack depth is a concern |

## Interview Approach

When you see a recursive problem in an interview:

1. **State the recurrence** — "The answer for n is f(answer for n-1) because..."
2. **State the base case** — "We stop when..."
3. **Argue correctness** by induction: assume it works for n-1, show it works for n
4. **Analyze complexity** using the recursion tree or recurrence relation
5. **Check for memoization opportunity** — any overlapping subproblems?
