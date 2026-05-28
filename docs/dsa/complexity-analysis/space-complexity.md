---
title: Space Complexity
description: Analyzing memory usage — auxiliary space, recursion stack, and space optimization techniques for interviews
---

# Space Complexity

Space complexity measures how much memory an algorithm uses relative to input size. It's the second half of every complexity answer — always state both time and space.

## Total Space vs Auxiliary Space

| Type | Definition | Counts? |
|---|---|---|
| **Total space** | Input memory + extra memory used | Sometimes |
| **Auxiliary space** | Extra memory beyond input storage | Almost always |

In interviews, "space complexity" almost always means **auxiliary space**. The input itself doesn't count since you had to store it anyway.

```
Input array of n integers: O(n) input space (not counted)
Hash map of n entries you create: O(n) auxiliary space (counted)
```

## Common Auxiliary Space Patterns

| Pattern | Space | Example |
|---|---|---|
| No extra storage | O(1) | Two pointers, in-place swap |
| Single output array | O(n) | Prefix sum, result array |
| Hash map / hash set | O(n) | Two-sum, frequency count |
| Recursion call stack | O(h) | DFS on tree (h = height) |
| Queue for BFS | O(w) | BFS on tree (w = max width) |
| DP table | O(n) or O(nm) | 1D or 2D dynamic programming |

## Recursion Stack Space

Every recursive call adds a **stack frame**. The stack depth equals the maximum recursion depth.

```
Depth of recursion → O(depth) space
```

### Example: DFS on a Binary Tree

Each call processes one node and makes two recursive calls. The call stack depth = tree height h.

- Balanced tree: h = O(log n) → **O(log n) space**
- Skewed tree (linked-list shape): h = O(n) → **O(n) space**

```cpp
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    // Stack depth = tree height h
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}
// Space: O(h) — h = height of tree
```

```java
int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
// Space: O(h)
```

```typescript
function maxDepth(root: TreeNode | null): number {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
// Space: O(h)
```

```python
def max_depth(root: TreeNode | None) -> int:
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
# Space: O(h)
```

```go
func maxDepth(root *TreeNode) int {
    if root == nil { return 0 }
    left := maxDepth(root.Left)
    right := maxDepth(root.Right)
    if left > right { return 1 + left }
    return 1 + right
}
// Space: O(h)
```

### Example: Fibonacci — Exponential Calls, O(n) Stack

Despite 2^n total calls, the stack depth is n (the longest path root → leaf).

```cpp
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
// Time: O(2^n), Space: O(n) — max stack depth is n
```

```java
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
// Time: O(2^n), Space: O(n)
```

```typescript
function fib(n: number): number {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
// Time: O(2^n), Space: O(n)
```

```python
def fib(n: int) -> int:
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)
# Time: O(2^n), Space: O(n)
```

```go
func fib(n int) int {
    if n <= 1 { return n }
    return fib(n-1) + fib(n-2)
}
// Time: O(2^n), Space: O(n)
```

## Space vs Traversal Strategy

| Traversal | Space Used | When to Choose |
|---|---|---|
| DFS (recursive) | O(h) call stack | Balanced trees, small depth |
| DFS (iterative) | O(h) explicit stack | Avoid stack overflow risk |
| BFS | O(w) queue, w = max width | Level-by-level, shortest path |

For a **complete binary tree** with n nodes:
- h ≈ log n → DFS: O(log n) space
- w ≈ n/2 → BFS: O(n) space

**So DFS uses less space on balanced trees; BFS uses less space on deep skinny trees.**

## Space Optimization: 1D DP Rolling Array

The classic O(nm) → O(min(n,m)) reduction.

### Longest Common Subsequence (LCS)

**Standard O(nm) DP:**

Each cell depends on: current row, previous row (only).

**Optimized O(m) DP:**

Keep only the previous row, overwrite in-place:

```cpp
int lcs(string& s1, string& s2) {
    int m = s1.size(), n = s2.size();
    vector<int> dp(n + 1, 0);
    for (int i = 1; i <= m; i++) {
        int prev = 0;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (s1[i-1] == s2[j-1]) dp[j] = prev + 1;
            else dp[j] = max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
// Space: O(n) instead of O(nm)
```

```java
int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[] dp = new int[n + 1];
    for (int i = 1; i <= m; i++) {
        int prev = 0;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (s1.charAt(i-1) == s2.charAt(j-1)) dp[j] = prev + 1;
            else dp[j] = Math.max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

```typescript
function lcs(s1: string, s2: string): number {
    const m = s1.length, n = s2.length;
    const dp = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
        let prev = 0;
        for (let j = 1; j <= n; j++) {
            const temp = dp[j];
            if (s1[i-1] === s2[j-1]) dp[j] = prev + 1;
            else dp[j] = Math.max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

```python
def lcs(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [0] * (n + 1)
    for i in range(1, m + 1):
        prev = 0
        for j in range(1, n + 1):
            temp = dp[j]
            if s1[i-1] == s2[j-1]:
                dp[j] = prev + 1
            else:
                dp[j] = max(dp[j], dp[j-1])
            prev = temp
    return dp[n]
```

```go
func lcs(s1, s2 string) int {
    m, n := len(s1), len(s2)
    dp := make([]int, n+1)
    for i := 1; i <= m; i++ {
        prev := 0
        for j := 1; j <= n; j++ {
            temp := dp[j]
            if s1[i-1] == s2[j-1] {
                dp[j] = prev + 1
            } else if dp[j] < dp[j-1] {
                dp[j] = dp[j-1]
            }
            prev = temp
        }
    }
    return dp[n]
}
```

## In-Place Algorithms

Some algorithms modify the input array directly to achieve O(1) space. Common in interviews.

**Dutch National Flag (3-way partition):**

```cpp
void sortColors(vector<int>& nums) {
    int lo = 0, mid = 0, hi = nums.size() - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) swap(nums[lo++], nums[mid++]);
        else if (nums[mid] == 1) mid++;
        else swap(nums[mid], nums[hi--]);
    }
}
// Space: O(1) — modifies input, no extra storage
```

```java
void sortColors(int[] nums) {
    int lo = 0, mid = 0, hi = nums.length - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) { int t = nums[lo]; nums[lo++] = nums[mid]; nums[mid++] = t; }
        else if (nums[mid] == 1) mid++;
        else { int t = nums[mid]; nums[mid] = nums[hi]; nums[hi--] = t; }
    }
}
```

```typescript
function sortColors(nums: number[]): void {
    let lo = 0, mid = 0, hi = nums.length - 1;
    while (mid <= hi) {
        if (nums[mid] === 0) [nums[lo++], nums[mid++]] = [nums[mid], nums[lo]];
        else if (nums[mid] === 1) mid++;
        else [nums[mid], nums[hi--]] = [nums[hi], nums[mid]];
    }
}
```

```python
def sort_colors(nums: list[int]) -> None:
    lo, mid, hi = 0, 0, len(nums) - 1
    while mid <= hi:
        if nums[mid] == 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo += 1; mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi -= 1
```

```go
func sortColors(nums []int) {
    lo, mid, hi := 0, 0, len(nums)-1
    for mid <= hi {
        switch nums[mid] {
        case 0:
            nums[lo], nums[mid] = nums[mid], nums[lo]
            lo++; mid++
        case 1:
            mid++
        default:
            nums[mid], nums[hi] = nums[hi], nums[mid]
            hi--
        }
    }
}
```

## Space Complexity Cheat Sheet

| Algorithm Type | Typical Space |
|---|---|
| Iterative, no extra arrays | O(1) |
| Single auxiliary array | O(n) |
| Hash map / set | O(n) |
| Recursive DFS on tree | O(h) |
| BFS on tree/graph | O(w) or O(V) |
| Merge sort | O(n) — merge buffer |
| Quicksort in-place | O(log n) — stack frames |
| 1D DP | O(n) |
| 2D DP | O(nm) — or O(n) with rolling array |
| Backtracking | O(depth) — recursion stack |

## Key Interview Insights

- **Always say both time and space.** "This runs in O(n log n) time and O(n) space."
- **Input arrays don't count as auxiliary space.** Reading input is free; extra structures you allocate are not.
- **Recursion has hidden space cost.** Even if each call does O(1) work, depth-d recursion uses O(d) stack space.
- **In-place is not always possible.** When asked to solve in O(1) space, check if the problem semantics allow mutation of the input.
- **Rolling array is a standard follow-up.** If you give a 2D DP, be prepared to reduce it to O(n) with a one/two-row optimization.
