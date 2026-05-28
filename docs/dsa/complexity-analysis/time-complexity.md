---
title: Time Complexity Analysis
description: How to systematically derive time complexity for iterative, recursive, and divide-and-conquer algorithms
---

# Time Complexity Analysis

Time complexity tells you how the number of operations grows as input size n grows. The skill is reading code and deriving the complexity systematically — not guessing.

## The Four-Step Framework

1. **Identify the dominant operation** — the innermost loop body or most-called function
2. **Count how many times it runs** — trace loop bounds precisely
3. **Write a recurrence if recursive** — express T(n) in terms of smaller inputs
4. **Apply simplification rules** — drop constants and lower-order terms

## Iterative Analysis

### Pattern 1: Single Loop → O(n)

The loop body runs exactly n times.

```cpp
int linearSearch(vector<int>& nums, int target) {
    for (int i = 0; i < nums.size(); i++) {  // n iterations
        if (nums[i] == target) return i;
    }
    return -1;
}
```

```java
int linearSearch(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] == target) return i;
    }
    return -1;
}
```

```typescript
function linearSearch(nums: number[], target: number): number {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] === target) return i;
    }
    return -1;
}
```

```python
def linear_search(nums: list[int], target: int) -> int:
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1
```

```go
func linearSearch(nums []int, target int) int {
    for i, x := range nums {
        if x == target {
            return i
        }
    }
    return -1
}
```

### Pattern 2: Nested Loops → O(n²)

The inner loop body runs (n-1) + (n-2) + ... + 1 + 0 = n(n-1)/2 times → O(n²).

```cpp
vector<vector<int>> allPairs(vector<int>& nums) {
    vector<vector<int>> res;
    for (int i = 0; i < nums.size(); i++)           // n
        for (int j = i + 1; j < nums.size(); j++)   // n-i-1
            res.push_back({nums[i], nums[j]});
    return res;
}
```

```java
List<int[]> allPairs(int[] nums) {
    List<int[]> res = new ArrayList<>();
    for (int i = 0; i < nums.length; i++)
        for (int j = i + 1; j < nums.length; j++)
            res.add(new int[]{nums[i], nums[j]});
    return res;
}
```

```typescript
function allPairs(nums: number[]): number[][] {
    const res: number[][] = [];
    for (let i = 0; i < nums.length; i++)
        for (let j = i + 1; j < nums.length; j++)
            res.push([nums[i], nums[j]]);
    return res;
}
```

```python
def all_pairs(nums: list[int]) -> list[list[int]]:
    res = []
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            res.append([nums[i], nums[j]])
    return res
```

```go
func allPairs(nums []int) [][]int {
    res := [][]int{}
    for i := 0; i < len(nums); i++ {
        for j := i + 1; j < len(nums); j++ {
            res = append(res, []int{nums[i], nums[j]})
        }
    }
    return res
}
```

### Pattern 3: Loop + Halving Inner Variable → O(n log n)

The outer loop runs n times; the inner loop's variable doubles each step → log n inner iterations.

```cpp
// Example: for each element, count how many powers of 2 fit below it
vector<int> countPowers(vector<int>& nums) {
    vector<int> res;
    for (int x : nums) {          // O(n)
        int count = 0, j = 1;
        while (j < x) {           // O(log x) ≤ O(log n)
            count++;
            j *= 2;
        }
        res.push_back(count);
    }
    return res;
}
```

```java
int[] countPowers(int[] nums) {
    int[] res = new int[nums.length];
    for (int k = 0; k < nums.length; k++) {
        int count = 0, j = 1;
        while (j < nums[k]) { count++; j *= 2; }
        res[k] = count;
    }
    return res;
}
```

```typescript
function countPowers(nums: number[]): number[] {
    return nums.map(x => {
        let count = 0, j = 1;
        while (j < x) { count++; j *= 2; }
        return count;
    });
}
```

```python
def count_powers(nums: list[int]) -> list[int]:
    res = []
    for x in nums:
        count, j = 0, 1
        while j < x:
            count += 1
            j *= 2
        res.append(count)
    return res
```

```go
func countPowers(nums []int) []int {
    res := make([]int, len(nums))
    for k, x := range nums {
        count, j := 0, 1
        for j < x {
            count++
            j *= 2
        }
        res[k] = count
    }
    return res
}
```

### Pattern 4: Monotonic Stack — Looks O(n²), Actually O(n)

The while loop inside the for loop appears to make this O(n²). It's not.

**Amortized argument:** Each element is pushed onto the stack once and popped at most once. Total push + pop operations ≤ 2n → O(n) total.

```cpp
vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, -1);
    stack<int> st;  // stores indices
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            res[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return res;
}
```

```java
int[] nextGreater(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && nums[st.peek()] < nums[i]) {
            res[st.pop()] = nums[i];
        }
        st.push(i);
    }
    return res;
}
```

```typescript
function nextGreater(nums: number[]): number[] {
    const n = nums.length;
    const res = new Array(n).fill(-1);
    const st: number[] = [];
    for (let i = 0; i < n; i++) {
        while (st.length > 0 && nums[st[st.length - 1]] < nums[i]) {
            res[st.pop()!] = nums[i];
        }
        st.push(i);
    }
    return res;
}
```

```python
def next_greater(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    st = []  # stores indices
    for i in range(n):
        while st and nums[st[-1]] < nums[i]:
            res[st.pop()] = nums[i]
        st.append(i)
    return res
```

```go
func nextGreater(nums []int) []int {
    n := len(nums)
    res := make([]int, n)
    for i := range res { res[i] = -1 }
    st := []int{}
    for i := 0; i < n; i++ {
        for len(st) > 0 && nums[st[len(st)-1]] < nums[i] {
            res[st[len(st)-1]] = nums[i]
            st = st[:len(st)-1]
        }
        st = append(st, i)
    }
    return res
}
```

## Recursive Analysis

### The Recurrence Relation

For recursive algorithms, express the cost as T(n) = (cost of subproblems) + (cost of current level work).

| Algorithm | Recurrence | Result |
|---|---|---|
| Binary search | T(n) = T(n/2) + O(1) | O(log n) |
| Merge sort | T(n) = 2T(n/2) + O(n) | O(n log n) |
| Naive Fibonacci | T(n) = T(n-1) + T(n-2) + O(1) | O(2^n) |
| DFS on tree | T(n) = T(left) + T(right) + O(1) | O(n) |

### The Master Theorem

For recurrences of the form **T(n) = a·T(n/b) + O(n^d)**:

- **a** = number of recursive subproblems
- **b** = factor by which input shrinks
- **d** = exponent of work done at current level

| Condition | Result | Intuition |
|---|---|---|
| d > log_b(a) | O(n^d) | Top level dominates |
| d = log_b(a) | O(n^d · log n) | Equal work at each level |
| d < log_b(a) | O(n^log_b(a)) | Leaves dominate |

**Examples:**

| Recurrence | a | b | d | log_b(a) | Case | Result |
|---|---|---|---|---|---|---|
| T(n) = T(n/2) + O(1) | 1 | 2 | 0 | 0 | d = log_b(a) | O(log n) |
| T(n) = 2T(n/2) + O(n) | 2 | 2 | 1 | 1 | d = log_b(a) | O(n log n) |
| T(n) = 4T(n/2) + O(n) | 4 | 2 | 1 | 2 | d < log_b(a) | O(n²) |
| T(n) = 2T(n/2) + O(n²) | 2 | 2 | 2 | 1 | d > log_b(a) | O(n²) |

### Recursion Tree Method

Draw the tree, compute work at each level, sum across all levels.

For **T(n) = 2T(n/2) + O(n)**:

```
Level 0: 1 problem × O(n)  = O(n)     work
Level 1: 2 problems × O(n/2) = O(n)   work
Level 2: 4 problems × O(n/4) = O(n)   work
...
Level log n: n problems × O(1) = O(n)  work

Total levels = log n
Total work = O(n) × log n = O(n log n)
```

## Loop Pattern Reference

| Pattern | Example | Complexity |
|---|---|---|
| Single loop | `for i in range(n)` | O(n) |
| Nested loop (independent) | `for i ... for j in range(n)` | O(n²) |
| Nested loop (triangle) | `for i ... for j in range(i, n)` | O(n²) |
| Loop with halving | `while j < n: j *= 2` | O(log n) |
| Outer loop + inner halving | `for i ... while j < n: j *= 2` | O(n log n) |
| Monotonic stack | `for i ... while stack and condition: pop` | O(n) amortized |
| Binary search | `while lo <= hi: mid = (lo+hi)//2` | O(log n) |
| BFS/DFS on graph | visit each node/edge once | O(V + E) |

## Built-in Operation Costs

**Python:**

| Operation | Cost |
|---|---|
| `list.append(x)` | O(1) amortized |
| `list.insert(0, x)` | O(n) |
| `list.pop()` | O(1) |
| `list.pop(0)` | O(n) |
| `x in list` | O(n) |
| `x in set` | O(1) average |
| `sorted(list)` | O(n log n) |
| `s[i:j]` | O(j - i) |
| `s1 + s2` (strings) | O(n + m) |

**Java:**

| Operation | Cost |
|---|---|
| `ArrayList.add(x)` | O(1) amortized |
| `ArrayList.add(0, x)` | O(n) |
| `HashMap.get/put` | O(1) average |
| `TreeMap.get/put` | O(log n) |
| `Arrays.sort()` | O(n log n) |
| `String.substring(i, j)` | O(j - i) |
| `s1 + s2` (strings in loop) | O(n²) total — use StringBuilder |

## Key Interview Insights

- **State the recurrence before solving it.** Writing `T(n) = 2T(n/2) + O(n)` demonstrates rigor.
- **Don't be fooled by nested syntax.** A `while` inside a `for` is only O(n²) if the total iterations across all outer steps is O(n²). Count total work, not worst-case-per-step.
- **Recursion ≠ exponential.** Recursive doesn't mean slow. Binary search is O(log n) and recursive. The key is whether subproblems *overlap* (bad) or *are independent* (good).
- **Early exit doesn't change worst case.** `return` on a match doesn't change O(n) to O(1) — worst case is still O(n).
