---
title: Common Mistakes
description: The most frequent errors in coding interviews — and exactly how to avoid them
---

# Common Mistakes

These are the errors that separate candidates who get the offer from those who almost did. They're not about knowing more algorithms — they're about careful execution, edge case awareness, and communication habits.

---

## Category 1: Off-By-One Errors

The most common source of wrong answers. They're subtle, language-agnostic, and embarrassing to debug during an interview.

### Mistake: Wrong loop boundary

```cpp
// WRONG: misses last element
for (int i = 0; i < nums.size() - 1; i++) { ... }

// RIGHT: processes all elements
for (int i = 0; i < nums.size(); i++) { ... }
```

```java
// WRONG: ArrayIndexOutOfBoundsException
for (int i = 0; i <= nums.length; i++) { ... }

// RIGHT
for (int i = 0; i < nums.length; i++) { ... }
```

```typescript
// WRONG: skips last element
for (let i = 0; i < nums.length - 1; i++) { ... }

// RIGHT
for (let i = 0; i < nums.length; i++) { ... }
```

```python
# WRONG: misses last element
for i in range(len(nums) - 1):
    pass

# RIGHT
for i in range(len(nums)):
    pass
```

```go
// WRONG: out of bounds
for i := 0; i <= len(nums); i++ { ... }

// RIGHT
for i := 0; i < len(nums); i++ { ... }
```

**Prevention:** For every loop, ask yourself:
- What is the first element processed? Is that right?
- What is the last element processed? Is that right?
- Does the boundary condition handle an empty array?

### Mistake: Substring/Slice indices

`s.substring(l, r)` in Java and `s[l:r]` in Python/Go are **exclusive at `r`**.

```
"hello"[1:4] → "ell"  (indices 1, 2, 3 — NOT 4)
```

When you want length `k` starting at `i`: `s[i:i+k]` or `s.substring(i, i+k)`.

### Mistake: Two-pointer crossing

```cpp
// WRONG: processes duplicates when left == right
while (left <= right) { ... }

// RIGHT for two-pointer sum problems
while (left < right) { ... }
```

---

## Category 2: Integer Overflow

Missed in a rush, causes wrong answers on large inputs.

### Where it happens

- `(a + b)` where both are near `INT_MAX`
- `mid = (lo + hi) / 2` — classic binary search bug
- `a * b` in product/area calculations
- `-INT_MIN` in C++/Java — negating the minimum integer overflows

### Fixes

```cpp
// WRONG: overflow when lo + hi > INT_MAX
int mid = (lo + hi) / 2;

// RIGHT
int mid = lo + (hi - lo) / 2;
```

```java
// WRONG: int multiplication overflows
int area = height[left] * width; // could overflow if values are large

// RIGHT: cast to long
long area = (long) height[left] * width;
```

```typescript
// JS numbers are 64-bit floats — safe up to 2^53
// No int overflow, but watch for precision issues with very large integers
```

```python
# Python integers are arbitrary precision — no overflow ever
# Only watch for performance (big number arithmetic is slow)
```

```go
// WRONG
mid := (lo + hi) / 2  // may overflow for large int32 values

// RIGHT
mid := lo + (hi-lo)/2
```

**Rule of thumb:** Any time you add/multiply two values of the same order of magnitude as `INT_MAX`, use `long`/`int64`.

---

## Category 3: Wrong Comparator for Sorting

A silent bug: wrong sort order causes a logically correct algorithm to produce wrong answers.

### Mistake: Sorting numbers as strings

```typescript
// WRONG: sorts lexicographically! [1, 10, 2, 20, 3]
[1, 20, 3, 10, 2].sort();

// RIGHT
[1, 20, 3, 10, 2].sort((a, b) => a - b); // [1, 2, 3, 10, 20]
```

**Always provide a comparator for numeric sorting in JavaScript/TypeScript.**

### Mistake: Integer subtraction overflow in Java comparator

```java
// WRONG: a - b can overflow if a is very negative and b very positive
Arrays.sort(arr, (a, b) -> a - b);

// RIGHT: use Integer.compare
Arrays.sort(arr, (a, b) -> Integer.compare(a, b));
// Or for primitive arrays, Arrays.sort is safe (uses natural ordering)
```

### Mistake: Sorting by wrong key

For intervals problems: sorting by start vs end changes the entire algorithm.
- Merging: sort by **start**
- Activity selection / arrows: sort by **end**

---

## Category 4: Modifying a Collection While Iterating

This causes `ConcurrentModificationException` in Java, silent skips in Python, and undefined behavior in other languages.

```java
// WRONG: modifying list while iterating it
for (int x : list) {
    if (x < 0) list.remove(x); // throws ConcurrentModificationException
}

// RIGHT: use an iterator or collect removals first
Iterator<Integer> it = list.iterator();
while (it.hasNext()) {
    if (it.next() < 0) it.remove();
}
```

```python
# WRONG: modifying list while iterating
for x in my_list:
    if x < 0:
        my_list.remove(x)  # silently skips elements!

# RIGHT: iterate over a copy
for x in my_list[:]:
    if x < 0:
        my_list.remove(x)

# BEST: build new list
my_list = [x for x in my_list if x >= 0]
```

---

## Category 5: Not Handling Empty/Null Input

The first test case an interviewer runs is often `[]` or `null`. Crashing here looks careless.

```cpp
// WRONG: crashes on empty vector
int findMax(vector<int>& nums) {
    int maxVal = nums[0]; // out of bounds if empty
    ...
}

// RIGHT
int findMax(vector<int>& nums) {
    if (nums.empty()) return INT_MIN; // or throw, or return -1
    int maxVal = nums[0];
    ...
}
```

```java
int findMax(int[] nums) {
    if (nums == null || nums.length == 0) return Integer.MIN_VALUE;
    int max = nums[0];
    ...
}
```

```python
def find_max(nums: list[int]) -> int:
    if not nums:
        return float('-inf')
    return max(nums)
```

**Habits to build:**
1. After understanding the problem, explicitly ask: "Can the input be empty or null?"
2. Write the edge case check at the top of your function before anything else.

---

## Category 6: Using the Wrong Data Structure

The correct algorithm with the wrong data structure is either O(n^2) instead of O(n) or simply broken.

| Mistake | Should Use Instead |
|---|---|
| Array for O(1) lookup by value | Hash Map / Hash Set |
| FIFO queue → using a stack | Queue (deque) |
| Finding min/max repeatedly → linear scan | Heap |
| Checking membership in large set → O(n) | Hash Set |
| Ordered traversal of dynamic data | BST (TreeMap/TreeSet) |
| DFS → using queue | Stack (or recursion) |
| BFS → using stack | Queue |

### Specific trap: "Stack" in Python is a list

Python's `list` used as a stack (`.append()`, `.pop()`) is O(1) and correct. But using it as a queue (`.pop(0)`) is O(n). Use `collections.deque` for O(1) pops from both ends.

---

## Category 7: Wrong Base Case in Recursion / DP

Missing or wrong base cases cause infinite recursion, index-out-of-bounds, or wrong answers for small inputs.

### Mistake: Missing base case

```python
# WRONG: infinite recursion
def fib(n):
    return fib(n-1) + fib(n-2)

# RIGHT
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
```

### Mistake: Off-by-one in DP array initialization

```java
// Problem: number of ways to climb n stairs (1 or 2 steps at a time)
// WRONG: dp[0] = 0 misses the base case
int[] dp = new int[n + 1];
dp[1] = 1;

// RIGHT
int[] dp = new int[n + 1];
dp[0] = 1; // 1 way to stay at ground (take 0 steps)
dp[1] = 1;
```

### Check your base cases against n=0, n=1, n=2 manually.

---

## Category 8: Ignoring Duplicate Elements

Duplicates break algorithms that assume uniqueness.

### Two-pointer with duplicates

```cpp
// 3Sum: after finding a triplet, skip duplicates to avoid repeated answers
while (left < right && nums[left] == nums[left-1]) left++;
while (left < right && nums[right] == nums[right+1]) right--;
```

### Subset/combination with duplicates

```python
# Subsets II: sort first, then skip same-value elements at the same recursion level
def backtrack(start, curr):
    res.append(list(curr))
    for i in range(start, len(nums)):
        if i > start and nums[i] == nums[i-1]:  # skip duplicate
            continue
        curr.append(nums[i])
        backtrack(i + 1, curr)
        curr.pop()
```

---

## Category 9: Binary Search Bugs

Binary search is deceptively easy to get wrong in the boundary conditions.

### Common bugs

```cpp
// BUG 1: infinite loop when lo = hi - 1
int mid = (lo + hi) / 2;
if (condition) lo = mid; // should be lo = mid + 1

// BUG 2: wrong answer for lower_bound
// Use lo < hi (not lo <= hi) when searching for insertion point

// BUG 3: wrong direction
if (nums[mid] < target) hi = mid - 1; // WRONG: should advance lo
```

**Template sanity check:**
- `while (lo <= hi)` — standard search, returns -1 if not found
- `while (lo < hi)` — find first/last position, `lo` converges to answer
- `lo = mid + 1`, `hi = mid - 1` — standard
- `hi = mid` (not `mid - 1`) — when `mid` itself could be the answer

---

## Category 10: Greedy When DP Is Needed (and Vice Versa)

### When greedy fails

Greedy fails when local optimal ≠ global optimal. Classic trap:

```
Coin change: coins = [1, 3, 4], amount = 6
Greedy: 4 + 1 + 1 = 3 coins
DP:     3 + 3 = 2 coins  ← optimal
```

**Test:** If you can construct a counterexample to the greedy choice, you need DP.

### When DP is overkill

If the greedy strategy is provably optimal by an exchange argument (intervals, activity selection, Huffman), don't complicate it with DP. Greedy is O(n log n) vs DP's O(n^2).

---

## Category 11: Graph Pitfalls

### Not marking visited in BFS/DFS

```python
# WRONG: infinite loop on a graph with a cycle
def dfs(node, graph):
    for neighbor in graph[node]:
        dfs(neighbor, graph)

# RIGHT
def dfs(node, graph, visited):
    visited.add(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor, graph, visited)
```

### Visiting node before adding to queue (BFS)

```python
# WRONG: same node gets queued multiple times, causing duplicate processing
while queue:
    node = queue.popleft()
    visited.add(node)  # TOO LATE — already queued multiple times
    for neighbor in graph[node]:
        queue.append(neighbor)

# RIGHT: mark visited WHEN you enqueue
visited = {start}
queue = deque([start])
while queue:
    node = queue.popleft()
    for neighbor in graph[node]:
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)
```

---

## Category 12: Python-Specific Pitfalls

### Mutable default arguments

```python
# WRONG: the default list is shared across all calls!
def backtrack(curr=[]):
    ...

# RIGHT
def backtrack(curr=None):
    if curr is None:
        curr = []
```

### `//` vs `/` for integer division

```python
5 / 2   # → 2.5  (float division)
5 // 2  # → 2    (integer division)
mid = lo + (hi - lo) // 2  # always use // for index arithmetic
```

### Modulo of negative numbers

```python
# Python: always non-negative
-7 % 3  # → 2   (not -1 like C++/Java)
```

---

## Communication Mistakes

Technical correctness isn't enough. These communication errors cost offers:

| Mistake | Better Approach |
|---|---|
| Silently coding for 5+ minutes | Narrate your thought process as you code |
| Jumping to code without clarifying | Ask about constraints and edge cases first |
| "I don't know" (and stop) | "I'm not immediately sure, but let me think through what I do know..." |
| Claiming done without testing | Always trace through an example after coding |
| Not stating complexity | Proactively say "This is O(n log n) time, O(n) space" |
| Not asking for hints when stuck | Asking for hints after 5 mins is fine — staying silent is not |
| Over-engineering the solution | Solve the stated problem, then ask "Should I optimize further?" |

---

## Pre-Submission Checklist

Before saying "I'm done," run through this:

- [ ] Traced through the provided example manually
- [ ] Tested an edge case (empty, single element, all-same)
- [ ] Checked loop boundaries (first and last iteration)
- [ ] Verified no integer overflow for large inputs
- [ ] Confirmed the return value type matches what's expected
- [ ] Stated time and space complexity
- [ ] Asked if there's anything the interviewer would like changed
