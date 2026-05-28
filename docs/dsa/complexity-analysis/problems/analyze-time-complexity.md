---
title: Analyze Time Complexity
description: Worked examples — derive time complexity step-by-step for iterative, recursive, and tricky patterns
---

# Analyze Time Complexity

A drill-focused guide with 12 worked examples. Each one shows the exact counting argument, not just the answer.

## The Method

For any code, ask:
1. **Identify the innermost operation** (most frequently executed)
2. **Count total executions** — precisely, not by gut feel
3. **Write a recurrence** if recursive
4. **Apply Master Theorem or expansion** to solve it
5. **Drop constants and lower-order terms**

---

## Example 1 — Single Loop: O(n)

```cpp
int sumArray(vector<int>& nums) {
    int total = 0;
    for (int x : nums) total += x;  // runs exactly n times
    return total;
}
```

```java
int sumArray(int[] nums) {
    int total = 0;
    for (int x : nums) total += x;
    return total;
}
```

```typescript
function sumArray(nums: number[]): number {
    let total = 0;
    for (const x of nums) total += x;
    return total;
}
```

```python
def sum_array(nums: list[int]) -> int:
    return sum(nums)
```

```go
func sumArray(nums []int) int {
    total := 0
    for _, x := range nums { total += x }
    return total
}
```

**Count:** Loop body executes n times, each O(1). Total = **O(n)**.

---

## Example 2 — Nested Loop: O(n²)

```cpp
int countPairs(vector<int>& nums, int target) {
    int count = 0;
    for (int i = 0; i < nums.size(); i++)
        for (int j = i + 1; j < nums.size(); j++)
            if (nums[i] + nums[j] == target) count++;
    return count;
}
```

```java
int countPairs(int[] nums, int target) {
    int count = 0;
    for (int i = 0; i < nums.length; i++)
        for (int j = i + 1; j < nums.length; j++)
            if (nums[i] + nums[j] == target) count++;
    return count;
}
```

```typescript
function countPairs(nums: number[], target: number): number {
    let count = 0;
    for (let i = 0; i < nums.length; i++)
        for (let j = i + 1; j < nums.length; j++)
            if (nums[i] + nums[j] === target) count++;
    return count;
}
```

```python
def count_pairs(nums: list[int], target: int) -> int:
    count = 0
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                count += 1
    return count
```

```go
func countPairs(nums []int, target int) int {
    count := 0
    for i := 0; i < len(nums); i++ {
        for j := i + 1; j < len(nums); j++ {
            if nums[i] + nums[j] == target { count++ }
        }
    }
    return count
}
```

**Count:** Inner loop runs (n-1) + (n-2) + ... + 1 + 0 = n(n-1)/2 times → **O(n²)**.

---

## Example 3 — Halving Variable: O(log n)

```cpp
int binarySearch(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

```java
int binarySearch(int[] arr, int target) {
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

```typescript
function binarySearch(arr: number[], target: number): number {
    let lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
```

```python
def binary_search(arr: list[int], target: int) -> int:
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: lo = mid + 1
        else: hi = mid - 1
    return -1
```

```go
func binarySearch(arr []int, target int) int {
    lo, hi := 0, len(arr)-1
    for lo <= hi {
        mid := lo + (hi-lo)/2
        if arr[mid] == target { return mid }
        if arr[mid] < target { lo = mid + 1 } else { hi = mid - 1 }
    }
    return -1
}
```

**Count:** Search space halves each step: n → n/2 → n/4 → ... → 1. Steps = log₂ n. → **O(log n)**.

---

## Example 4 — Nested with Halving: O(n log n)

The outer loop runs n times. For each i, the inner loop doubles j from 1 up to n → log n inner steps.

```cpp
void mystery(int n) {
    for (int i = 0; i < n; i++) {     // n iterations
        int j = 1;
        while (j < n) j *= 2;          // log n iterations
    }
}
```

```java
void mystery(int n) {
    for (int i = 0; i < n; i++) {
        int j = 1;
        while (j < n) j *= 2;
    }
}
```

```typescript
function mystery(n: number): void {
    for (let i = 0; i < n; i++) {
        let j = 1;
        while (j < n) j *= 2;
    }
}
```

```python
def mystery(n: int) -> None:
    for i in range(n):
        j = 1
        while j < n:
            j *= 2
```

```go
func mystery(n int) {
    for i := 0; i < n; i++ {
        j := 1
        for j < n { j *= 2 }
    }
}
```

**Count:** n (outer) × log n (inner) = **O(n log n)**.

---

## Example 5 — Deceptive O(n): Monotonic Stack

This looks O(n²) — it's not. The `while` inside the `for` is amortized O(1).

```cpp
vector<int> largestRectangleHistogram(vector<int>& heights) {
    stack<int> st;
    int maxArea = 0;
    heights.push_back(0);
    for (int i = 0; i < heights.size(); i++) {
        while (!st.empty() && heights[st.top()] > heights[i]) {
            int h = heights[st.top()]; st.pop();
            int w = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        st.push(i);
    }
    return {maxArea};
}
```

```java
int largestRectangleArea(int[] heights) {
    Deque<Integer> st = new ArrayDeque<>();
    int maxArea = 0;
    int[] h = Arrays.copyOf(heights, heights.length + 1); // sentinel 0
    for (int i = 0; i < h.length; i++) {
        while (!st.isEmpty() && h[st.peek()] > h[i]) {
            int height = h[st.pop()];
            int width = st.isEmpty() ? i : i - st.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        st.push(i);
    }
    return maxArea;
}
```

```typescript
function largestRectangleArea(heights: number[]): number {
    const st: number[] = [];
    let maxArea = 0;
    const h = [...heights, 0];
    for (let i = 0; i < h.length; i++) {
        while (st.length > 0 && h[st[st.length-1]] > h[i]) {
            const height = h[st.pop()!];
            const width = st.length === 0 ? i : i - st[st.length-1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        st.push(i);
    }
    return maxArea;
}
```

```python
def largest_rectangle_area(heights: list[int]) -> int:
    heights.append(0)
    st = []
    max_area = 0
    for i, h in enumerate(heights):
        while st and heights[st[-1]] > h:
            height = heights[st.pop()]
            width = i if not st else i - st[-1] - 1
            max_area = max(max_area, height * width)
        st.append(i)
    heights.pop()
    return max_area
```

```go
func largestRectangleArea(heights []int) int {
    heights = append(heights, 0)
    st := []int{}
    maxArea := 0
    for i, h := range heights {
        for len(st) > 0 && heights[st[len(st)-1]] > h {
            height := heights[st[len(st)-1]]
            st = st[:len(st)-1]
            width := i
            if len(st) > 0 { width = i - st[len(st)-1] - 1 }
            if area := height * width; area > maxArea { maxArea = area }
        }
        st = append(st, i)
    }
    return maxArea
}
```

**Count:** Each index is pushed once and popped at most once. Total push + pop ≤ 2(n+1). → **O(n) amortized**.

---

## Example 6 — Recursive Binary Search: O(log n)

**Recurrence:** T(n) = T(n/2) + O(1)

Apply Master Theorem: a=1, b=2, d=0, log_b(a)=0 → d = log_b(a) → Case 2 → **O(log n)**.

```cpp
int recBinarySearch(vector<int>& arr, int target, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return recBinarySearch(arr, target, mid + 1, hi);
    return recBinarySearch(arr, target, lo, mid - 1);
}
```

```java
int recBinarySearch(int[] arr, int target, int lo, int hi) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return recBinarySearch(arr, target, mid + 1, hi);
    return recBinarySearch(arr, target, lo, mid - 1);
}
```

```typescript
function recBinarySearch(arr: number[], target: number, lo: number, hi: number): number {
    if (lo > hi) return -1;
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) return recBinarySearch(arr, target, mid + 1, hi);
    return recBinarySearch(arr, target, lo, mid - 1);
}
```

```python
def rec_binary_search(arr: list[int], target: int, lo: int, hi: int) -> int:
    if lo > hi: return -1
    mid = (lo + hi) // 2
    if arr[mid] == target: return mid
    if arr[mid] < target: return rec_binary_search(arr, target, mid + 1, hi)
    return rec_binary_search(arr, target, lo, mid - 1)
```

```go
func recBinarySearch(arr []int, target, lo, hi int) int {
    if lo > hi { return -1 }
    mid := lo + (hi-lo)/2
    if arr[mid] == target { return mid }
    if arr[mid] < target { return recBinarySearch(arr, target, mid+1, hi) }
    return recBinarySearch(arr, target, lo, mid-1)
}
```

**Time:** O(log n). **Space:** O(log n) — log n stack frames.

---

## Example 7 — Merge Sort: O(n log n)

**Recurrence:** T(n) = 2T(n/2) + O(n)

Master Theorem: a=2, b=2, d=1, log_b(a)=1 → d = log_b(a) → Case 2 → **O(n log n)**.

**Recursion tree:** log n levels, O(n) work per level → O(n log n) total.

```cpp
void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int mid = l + (r - l) / 2;
    mergeSort(arr, l, mid);       // T(n/2)
    mergeSort(arr, mid + 1, r);   // T(n/2)
    merge(arr, l, mid, r);        // O(n)
}
```

```java
void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int mid = l + (r - l) / 2;
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}
```

```typescript
function mergeSort(arr: number[], l: number, r: number): void {
    if (l >= r) return;
    const mid = Math.floor((l + r) / 2);
    mergeSort(arr, l, mid);
    mergeSort(arr, mid + 1, r);
    merge(arr, l, mid, r);
}
```

```python
def merge_sort(arr: list[int], l: int, r: int) -> None:
    if l >= r: return
    mid = (l + r) // 2
    merge_sort(arr, l, mid)
    merge_sort(arr, mid + 1, r)
    merge(arr, l, mid, r)
```

```go
func mergeSort(arr []int, l, r int) {
    if l >= r { return }
    mid := l + (r-l)/2
    mergeSort(arr, l, mid)
    mergeSort(arr, mid+1, r)
    mergeFn(arr, l, mid, r)
}
```

**Time:** O(n log n). **Space:** O(n) — merge buffer.

---

## Example 8 — Naive Fibonacci: O(2^n)

**Recurrence:** T(n) = T(n-1) + T(n-2) + O(1)

The recursion tree is a binary tree of depth n. Nodes ≈ 2^n. → **O(2^n)**.

Even though the tree isn't perfectly full, the lower bound Ω(φ^n) where φ ≈ 1.618 still makes it exponential.

```cpp
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
// Time: O(2^n), Space: O(n) — max stack depth
```

```java
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

```typescript
function fib(n: number): number {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
```

```python
def fib(n: int) -> int:
    if n <= 1: return n
    return fib(n - 1) + fib(n - 2)
```

```go
func fib(n int) int {
    if n <= 1 { return n }
    return fib(n-1) + fib(n-2)
}
```

**With memoization:** T(n) = O(n), Space = O(n). Each unique state computed once.

---

## Example 9 — DFS on Tree: O(n)

Every node visited exactly once. Work per node = O(1). Total = O(n).

```cpp
int countNodes(TreeNode* root) {
    if (!root) return 0;
    return 1 + countNodes(root->left) + countNodes(root->right);
}
// T(n) = T(left) + T(right) + O(1) = O(n) for all n nodes
```

```java
int countNodes(TreeNode root) {
    if (root == null) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}
```

```typescript
function countNodes(root: TreeNode | null): number {
    if (!root) return 0;
    return 1 + countNodes(root.left) + countNodes(root.right);
}
```

```python
def count_nodes(root: TreeNode | None) -> int:
    if not root: return 0
    return 1 + count_nodes(root.left) + count_nodes(root.right)
```

```go
func countNodes(root *TreeNode) int {
    if root == nil { return 0 }
    return 1 + countNodes(root.Left) + countNodes(root.Right)
}
```

**Time:** O(n). **Space:** O(h) — h = tree height (O(log n) balanced, O(n) skewed).

---

## Example 10 — Backtracking Subsets: O(n × 2^n)

2^n subsets, each taking O(n) time to copy → **O(n × 2^n)**.

```cpp
vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> res;
    vector<int> cur;
    function<void(int)> bt = [&](int start) {
        res.push_back(cur);             // O(n) copy
        for (int i = start; i < nums.size(); i++) {
            cur.push_back(nums[i]);
            bt(i + 1);
            cur.pop_back();
        }
    };
    bt(0);
    return res;
}
```

```java
List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), res);
    return res;
}
void backtrack(int[] nums, int start, List<Integer> cur, List<List<Integer>> res) {
    res.add(new ArrayList<>(cur));    // O(n) copy
    for (int i = start; i < nums.length; i++) {
        cur.add(nums[i]);
        backtrack(nums, i + 1, cur, res);
        cur.remove(cur.size() - 1);
    }
}
```

```typescript
function subsets(nums: number[]): number[][] {
    const res: number[][] = [];
    function bt(start: number, cur: number[]) {
        res.push([...cur]);           // O(n) copy
        for (let i = start; i < nums.length; i++) {
            cur.push(nums[i]);
            bt(i + 1, cur);
            cur.pop();
        }
    }
    bt(0, []);
    return res;
}
```

```python
def subsets(nums: list[int]) -> list[list[int]]:
    res = []
    def bt(start: int, cur: list[int]) -> None:
        res.append(cur[:])            # O(n) copy
        for i in range(start, len(nums)):
            cur.append(nums[i])
            bt(i + 1, cur)
            cur.pop()
    bt(0, [])
    return res
```

```go
func subsets(nums []int) [][]int {
    res := [][]int{}
    var bt func(int, []int)
    bt = func(start int, cur []int) {
        tmp := make([]int, len(cur))
        copy(tmp, cur)
        res = append(res, tmp)         // O(n) copy
        for i := start; i < len(nums); i++ {
            bt(i+1, append(cur, nums[i]))
        }
    }
    bt(0, []int{})
    return res
}
```

**Time:** O(n × 2^n). **Space:** O(n) — max recursion depth is n.

---

## Complexity Pattern Cheat Sheet

| Code Shape | Complexity |
|---|---|
| `for i in range(n)` | O(n) |
| `for i ... for j in range(n)` | O(n²) |
| `for i ... for j in range(i, n)` | O(n²) |
| `while n > 0: n //= 2` | O(log n) |
| `for i ... while j < n: j *= 2` | O(n log n) |
| Monotonic stack (push/pop once each) | O(n) |
| T(n) = T(n/2) + O(1) | O(log n) |
| T(n) = 2T(n/2) + O(n) | O(n log n) |
| T(n) = T(n-1) + O(1) | O(n) |
| T(n) = T(n-1) + T(n-2) | O(2^n) |
| All subsets, each copied | O(n × 2^n) |
| All permutations, each copied | O(n × n!) |
| BFS or DFS | O(V + E) |

## Key Interview Insights

- **Count total work, not per-step worst case.** For structures like monotonic stack, the total across all steps is what matters — not the worst single step.
- **Always write the recurrence first** for recursive problems, then apply Master Theorem or expansion. Don't try to eyeball recursive complexity.
- **Recursion stack is free only for O(log n) depth.** For O(n) depth, mention the O(n) space cost.
- **Early return doesn't change worst-case Big-O.** Mention "in the best case this returns early" but still report worst-case as your primary answer.
- **Memoization converts exponential to polynomial.** Naive recursion with T(n-1)+T(n-2) is O(2^n); add a memo table and every unique state is computed once → O(n).
