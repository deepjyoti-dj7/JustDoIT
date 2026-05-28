---
title: Top 14 DSA Patterns
description: The core algorithmic patterns that cover ~90% of coding interview problems
---

# Top 14 DSA Patterns

Master these 14 patterns and you'll recognize the shape of almost any interview problem before you've finished reading it. For each pattern: when to use it, what signals to look for, the core template, and representative problems.

---

## Pattern 1: Sliding Window

**Core idea:** Maintain a contiguous subarray/substring of variable or fixed size. Expand the right boundary, shrink the left when a condition is violated.

**Identification signals:**
- "Longest/shortest subarray/substring with property X"
- "Maximum sum of subarray of size k"
- Input is a string or array, answer is a contiguous range

**Time:** O(n) — each element is added and removed at most once.
**Space:** O(k) for the window state (often O(1) or O(alphabet size))

**Template:**

```cpp
int slidingWindow(vector<int>& nums, int k) {
    unordered_map<int,int> window;
    int left = 0, res = 0;

    for (int right = 0; right < nums.size(); right++) {
        // 1. Add right element to window
        window[nums[right]]++;

        // 2. Shrink from left while window is invalid
        while (/* window invalid condition */) {
            window[nums[left]]--;
            if (window[nums[left]] == 0) window.erase(nums[left]);
            left++;
        }

        // 3. Update result with valid window
        res = max(res, right - left + 1);
    }
    return res;
}
```

```java
int slidingWindow(int[] nums, int k) {
    Map<Integer,Integer> window = new HashMap<>();
    int left = 0, res = 0;

    for (int right = 0; right < nums.length; right++) {
        // 1. Add right element
        window.merge(nums[right], 1, Integer::sum);

        // 2. Shrink while invalid
        while (/* invalid */) {
            window.merge(nums[left], -1, Integer::sum);
            if (window.get(nums[left]) == 0) window.remove(nums[left]);
            left++;
        }

        // 3. Update result
        res = Math.max(res, right - left + 1);
    }
    return res;
}
```

```typescript
function slidingWindow(nums: number[], k: number): number {
    const window = new Map<number, number>();
    let left = 0, res = 0;

    for (let right = 0; right < nums.length; right++) {
        // 1. Add right element
        window.set(nums[right], (window.get(nums[right]) ?? 0) + 1);

        // 2. Shrink while invalid
        while (/* invalid */) {
            const cnt = window.get(nums[left])! - 1;
            if (cnt === 0) window.delete(nums[left]);
            else window.set(nums[left], cnt);
            left++;
        }

        // 3. Update result
        res = Math.max(res, right - left + 1);
    }
    return res;
}
```

```python
def sliding_window(nums: list[int], k: int) -> int:
    from collections import defaultdict
    window = defaultdict(int)
    left = res = 0

    for right, val in enumerate(nums):
        # 1. Add right element
        window[val] += 1

        # 2. Shrink while invalid
        while # invalid:
            window[nums[left]] -= 1
            if window[nums[left]] == 0:
                del window[nums[left]]
            left += 1

        # 3. Update result
        res = max(res, right - left + 1)
    return res
```

```go
func slidingWindow(nums []int, k int) int {
    window := make(map[int]int)
    left, res := 0, 0

    for right, val := range nums {
        // 1. Add right element
        window[val]++

        // 2. Shrink while invalid
        for /* invalid */ {
            window[nums[left]]--
            if window[nums[left]] == 0 {
                delete(window, nums[left])
            }
            left++
        }

        // 3. Update result
        if right-left+1 > res {
            res = right - left + 1
        }
    }
    return res
}
```

**Classic problems:** Longest Substring Without Repeating Characters (LC 3), Minimum Window Substring (LC 76), Fruit Into Baskets (LC 904)

---

## Pattern 2: Two Pointers

**Core idea:** Two indices that move toward each other (or in the same direction) to eliminate the need for nested loops.

**Identification signals:**
- Sorted array, find pair/triplet with sum
- Compare elements from both ends
- Remove duplicates in-place
- "Is palindrome?"

**Time:** O(n) — each pointer moves at most n steps.
**Space:** O(1)

**Template:**

```cpp
// Opposite-direction two pointers (sorted array)
int twoPointers(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;

    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return true;
        else if (sum < target) left++;
        else right--;
    }
    return false;
}
```

```java
boolean twoPointers(int[] nums, int target) {
    int left = 0, right = nums.length - 1;

    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return true;
        else if (sum < target) left++;
        else right--;
    }
    return false;
}
```

```typescript
function twoPointers(nums: number[], target: number): boolean {
    let left = 0, right = nums.length - 1;

    while (left < right) {
        const sum = nums[left] + nums[right];
        if (sum === target) return true;
        else if (sum < target) left++;
        else right--;
    }
    return false;
}
```

```python
def two_pointers(nums: list[int], target: int) -> bool:
    left, right = 0, len(nums) - 1

    while left < right:
        s = nums[left] + nums[right]
        if s == target:
            return True
        elif s < target:
            left += 1
        else:
            right -= 1
    return False
```

```go
func twoPointers(nums []int, target int) bool {
    left, right := 0, len(nums)-1

    for left < right {
        sum := nums[left] + nums[right]
        if sum == target {
            return true
        } else if sum < target {
            left++
        } else {
            right--
        }
    }
    return false
}
```

**Classic problems:** Two Sum II (LC 167), 3Sum (LC 15), Container With Most Water (LC 11), Valid Palindrome (LC 125)

---

## Pattern 3: Fast & Slow Pointers

**Core idea:** Two pointers at different speeds. The fast pointer moves 2x as fast. They meet at the cycle entry or middle of the list.

**Identification signals:**
- Cycle detection in linked list or array
- Find middle of linked list
- Find start of cycle
- "Happy number" (cycle in number sequences)

**Time:** O(n) — **Space:** O(1)

**Template:**

```cpp
// Cycle detection (Floyd's algorithm)
bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;

    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}
```

```java
boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}
```

```typescript
function hasCycle(head: ListNode | null): boolean {
    let slow = head, fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}
```

```python
def has_cycle(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
```

```go
func hasCycle(head *ListNode) bool {
    slow, fast := head, head

    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast {
            return true
        }
    }
    return false
}
```

**Classic problems:** Linked List Cycle (LC 141), Linked List Cycle II (LC 142), Happy Number (LC 202), Middle of Linked List (LC 876)

---

## Pattern 4: Hash Map / Frequency Count

**Core idea:** Trade space for time. Use a hash map to achieve O(1) lookups instead of O(n) linear scans.

**Identification signals:**
- "Find duplicate", "find pair", "count occurrences"
- Need to look up whether something has been seen
- Frequency/count of elements matters
- Group elements by property (anagram grouping)

**Time:** O(n) — **Space:** O(n)

**Template (Two Sum style — complement lookup):**

```cpp
// Check if complement exists; store seen values as you go
unordered_map<int,int> seen; // value → index
for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (seen.count(complement)) {
        return {seen[complement], i};
    }
    seen[nums[i]] = i;
}
```

```java
Map<Integer,Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (seen.containsKey(complement)) {
        return new int[]{seen.get(complement), i};
    }
    seen.put(nums[i], i);
}
```

```typescript
const seen = new Map<number, number>();
for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
        return [seen.get(complement)!, i];
    }
    seen.set(nums[i], i);
}
```

```python
seen: dict[int, int] = {}  # value -> index
for i, num in enumerate(nums):
    complement = target - num
    if complement in seen:
        return [seen[complement], i]
    seen[num] = i
```

```go
seen := make(map[int]int) // value -> index
for i, num := range nums {
    complement := target - num
    if j, ok := seen[complement]; ok {
        return []int{j, i}
    }
    seen[num] = i
}
```

**Template (Frequency count):**

```cpp
unordered_map<int,int> freq;
for (int x : nums) freq[x]++;
// Use freq[x] to check count in O(1)
```

```java
Map<Integer,Integer> freq = new HashMap<>();
for (int x : nums) freq.merge(x, 1, Integer::sum);
```

```typescript
const freq = new Map<number, number>();
for (const x of nums) freq.set(x, (freq.get(x) ?? 0) + 1);
```

```python
from collections import Counter
freq = Counter(nums)  # or: freq = {}; freq[x] = freq.get(x, 0) + 1
```

```go
freq := make(map[int]int)
for _, x := range nums { freq[x]++ }
```

**Classic problems:** Two Sum (LC 1), Group Anagrams (LC 49), Top K Frequent Elements (LC 347), Valid Anagram (LC 242)

---

## Pattern 5: Binary Search

**Core idea:** On a sorted array (or monotonic function), eliminate half the search space at each step.

**Identification signals:**
- Sorted array, find target / first/last occurrence
- "Minimize the maximum" / "maximize the minimum"
- Feasibility function that is monotone (true/false flips at some threshold)
- Answer is a value in a range, not an index

**Time:** O(log n) — **Space:** O(1)

**Template:**

```cpp
// Standard binary search
int binarySearch(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2; // avoid overflow
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

// Binary search on answer (find minimum valid x)
int bsOnAnswer(int lo, int hi) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (feasible(mid)) hi = mid;      // mid could be answer, try smaller
        else lo = mid + 1;                // mid too small, go right
    }
    return lo;
}
```

```java
int binarySearch(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

// Binary search on answer
int bsOnAnswer(int lo, int hi) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (feasible(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
```

```typescript
function binarySearch(nums: number[], target: number): number {
    let lo = 0, hi = nums.length - 1;

    while (lo <= hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        if (nums[mid] === target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

function bsOnAnswer(lo: number, hi: number): number {
    while (lo < hi) {
        const mid = lo + Math.floor((hi - lo) / 2);
        if (feasible(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
```

```python
def binary_search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1

    while lo <= hi:
        mid = lo + (hi - lo) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

def bs_on_answer(lo: int, hi: int) -> int:
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
```

```go
func binarySearch(nums []int, target int) int {
    lo, hi := 0, len(nums)-1

    for lo <= hi {
        mid := lo + (hi-lo)/2
        if nums[mid] == target {
            return mid
        } else if nums[mid] < target {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return -1
}

func bsOnAnswer(lo, hi int) int {
    for lo < hi {
        mid := lo + (hi-lo)/2
        if feasible(mid) {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return lo
}
```

**Classic problems:** Binary Search (LC 704), Find Minimum in Rotated Array (LC 153), Search in Rotated Array (LC 33), Koko Eating Bananas (LC 875), Split Array Largest Sum (LC 410)

---

## Pattern 6: Prefix Sum

**Core idea:** Precompute cumulative sums so that any range sum `[l, r]` can be answered in O(1): `prefix[r+1] - prefix[l]`.

**Identification signals:**
- Range sum queries
- "Subarray sum equals k"
- "Number of subarrays with sum divisible by k"
- 2D grid sum queries

**Time:** O(n) precompute + O(1) per query — **Space:** O(n)

**Template (build prefix array + range query):**

```cpp
// Build: prefix[0] = 0 (sentinel), prefix[i] = prefix[i-1] + nums[i-1]
vector<int> prefix(nums.size() + 1, 0);
for (int i = 0; i < nums.size(); i++)
    prefix[i+1] = prefix[i] + nums[i];

// Range sum [l, r] inclusive (0-indexed)
auto rangeSum = [&](int l, int r) { return prefix[r+1] - prefix[l]; };
```

```java
int[] prefix = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++)
    prefix[i+1] = prefix[i] + nums[i];

// Range sum [l, r] inclusive (0-indexed)
// return prefix[r+1] - prefix[l];
```

```typescript
const prefix = new Array(nums.length + 1).fill(0);
for (let i = 0; i < nums.length; i++)
    prefix[i+1] = prefix[i] + nums[i];

// Range sum [l, r]: prefix[r+1] - prefix[l]
```

```python
prefix = [0] * (len(nums) + 1)
for i, x in enumerate(nums):
    prefix[i+1] = prefix[i] + x

# Range sum [l, r]: prefix[r+1] - prefix[l]
```

```go
prefix := make([]int, len(nums)+1)
for i, x := range nums {
    prefix[i+1] = prefix[i] + x
}
// Range sum [l, r]: prefix[r+1] - prefix[l]
```

**Template (subarray sum equals k — hash map variant):**

```cpp
int subarraySum(vector<int>& nums, int k) {
    unordered_map<int,int> seen{{0, 1}}; // prefixSum -> count
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        count += seen[sum - k];
        seen[sum]++;
    }
    return count;
}
```

```java
int subarraySum(int[] nums, int k) {
    Map<Integer,Integer> seen = new HashMap<>();
    seen.put(0, 1);
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        count += seen.getOrDefault(sum - k, 0);
        seen.merge(sum, 1, Integer::sum);
    }
    return count;
}
```

```typescript
function subarraySum(nums: number[], k: number): number {
    const seen = new Map([[0, 1]]);
    let sum = 0, count = 0;
    for (const x of nums) {
        sum += x;
        count += seen.get(sum - k) ?? 0;
        seen.set(sum, (seen.get(sum) ?? 0) + 1);
    }
    return count;
}
```

```python
def subarray_sum(nums: list[int], k: int) -> int:
    from collections import defaultdict
    seen = defaultdict(int, {0: 1})
    total = count = 0
    for x in nums:
        total += x
        count += seen[total - k]
        seen[total] += 1
    return count
```

```go
func subarraySum(nums []int, k int) int {
    seen := map[int]int{0: 1}
    sum, count := 0, 0
    for _, x := range nums {
        sum += x
        count += seen[sum-k]
        seen[sum]++
    }
    return count
}
```

**Classic problems:** Range Sum Query (LC 303), Subarray Sum Equals K (LC 560), Product of Array Except Self (LC 238), 2D Range Sum (LC 304)

---

## Pattern 7: Monotonic Stack

**Core idea:** Maintain a stack where elements are in strictly increasing or decreasing order. Elements that break the monotonic property are popped and processed.

**Identification signals:**
- "Next greater/smaller element"
- "Previous greater/smaller element"
- "Largest rectangle in histogram"
- "Daily temperatures" / "stock span"
- Problems involving nearest boundary

**Time:** O(n) — each element is pushed and popped at most once.
**Space:** O(n)

Increasing stack: pop when `nums[i] >= stack.top()` → finds "next smaller"
Decreasing stack: pop when `nums[i] <= stack.top()` → finds "next greater"

**Template (next greater element — decreasing monotonic stack):**

```cpp
vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, -1);
    stack<int> st; // stores indices

    for (int i = 0; i < n; i++) {
        // Pop all indices whose element is smaller than current
        while (!st.empty() && nums[st.top()] < nums[i]) {
            res[st.top()] = nums[i]; // nums[i] is the next greater
            st.pop();
        }
        st.push(i);
    }
    return res; // remaining in stack have no next greater → -1
}
```

```java
int[] nextGreater(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Arrays.fill(res, -1);
    Deque<Integer> st = new ArrayDeque<>(); // stores indices

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
    const st: number[] = []; // stack of indices

    for (let i = 0; i < n; i++) {
        while (st.length > 0 && nums[st[st.length-1]] < nums[i]) {
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
    stack = []  # stores indices

    for i, val in enumerate(nums):
        while stack and nums[stack[-1]] < val:
            res[stack.pop()] = val
        stack.append(i)
    return res
```

```go
func nextGreater(nums []int) []int {
    n := len(nums)
    res := make([]int, n)
    for i := range res { res[i] = -1 }
    st := []int{} // stack of indices

    for i, val := range nums {
        for len(st) > 0 && nums[st[len(st)-1]] < val {
            res[st[len(st)-1]] = val
            st = st[:len(st)-1]
        }
        st = append(st, i)
    }
    return res
}
```

**Classic problems:** Daily Temperatures (LC 739), Largest Rectangle in Histogram (LC 84), Next Greater Element (LC 496), Trapping Rain Water (LC 42)

---

## Pattern 8: BFS (Breadth-First Search)

**Core idea:** Explore nodes level by level using a queue. Guarantees shortest path in unweighted graphs.

**Identification signals:**
- Shortest path in unweighted graph/grid
- Level-order traversal of tree
- "Minimum steps to reach..."
- Spread/infection problems (rotting oranges, word ladder)

**Time:** O(V + E) — **Space:** O(V)

**Template:**

```cpp
int bfs(vector<vector<int>>& grid, int startR, int startC) {
    int rows = grid.size(), cols = grid[0].size();
    queue<pair<int,int>> q;
    set<pair<int,int>> visited;
    q.push({startR, startC});
    visited.insert({startR, startC});
    int steps = 0;

    while (!q.empty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            auto [r, c] = q.front(); q.pop();
            // process current cell
            for (auto [dr, dc] : vector<pair<int,int>>{{0,1},{0,-1},{1,0},{-1,0}}) {
                int nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && !visited.count({nr, nc})) {
                    visited.insert({nr, nc});
                    q.push({nr, nc});
                }
            }
        }
        steps++;
    }
    return steps;
}
```

```java
int bfs(int[][] grid, int startR, int startC) {
    int rows = grid.length, cols = grid[0].length;
    Queue<int[]> q = new LinkedList<>();
    boolean[][] visited = new boolean[rows][cols];
    q.offer(new int[]{startR, startC});
    visited[startR][startC] = true;
    int steps = 0;
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};

    while (!q.isEmpty()) {
        int size = q.size();
        for (int i = 0; i < size; i++) {
            int[] cur = q.poll();
            for (int[] d : dirs) {
                int nr = cur[0] + d[0], nc = cur[1] + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    q.offer(new int[]{nr, nc});
                }
            }
        }
        steps++;
    }
    return steps;
}
```

```typescript
function bfs(grid: number[][], startR: number, startC: number): number {
    const rows = grid.length, cols = grid[0].length;
    const q: [number, number][] = [[startR, startC]];
    const visited = Array.from({length: rows}, () => new Array(cols).fill(false));
    visited[startR][startC] = true;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    let steps = 0;

    while (q.length > 0) {
        const size = q.length;
        for (let i = 0; i < size; i++) {
            const [r, c] = q.shift()!;
            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc]) {
                    visited[nr][nc] = true;
                    q.push([nr, nc]);
                }
            }
        }
        steps++;
    }
    return steps;
}
```

```python
from collections import deque

def bfs(grid: list[list[int]], start_r: int, start_c: int) -> int:
    rows, cols = len(grid), len(grid[0])
    q = deque([(start_r, start_c)])
    visited = set([(start_r, start_c)])
    steps = 0
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]

    while q:
        for _ in range(len(q)):
            r, c = q.popleft()
            for dr, dc in dirs:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    q.append((nr, nc))
        steps += 1
    return steps
```

```go
func bfs(grid [][]int, startR, startC int) int {
    rows, cols := len(grid), len(grid[0])
    type Point struct{ r, c int }
    q := []Point{{startR, startC}}
    visited := make([][]bool, rows)
    for i := range visited { visited[i] = make([]bool, cols) }
    visited[startR][startC] = true
    dirs := []Point{{0,1},{0,-1},{1,0},{-1,0}}
    steps := 0

    for len(q) > 0 {
        size := len(q)
        for i := 0; i < size; i++ {
            cur := q[0]; q = q[1:]
            for _, d := range dirs {
                nr, nc := cur.r+d.r, cur.c+d.c
                if nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] {
                    visited[nr][nc] = true
                    q = append(q, Point{nr, nc})
                }
            }
        }
        steps++
    }
    return steps
}
```

**Classic problems:** Binary Tree Level Order (LC 102), Rotting Oranges (LC 994), Word Ladder (LC 127), Shortest Path in Binary Matrix (LC 1091)

---

## Pattern 9: DFS / Backtracking

**Core idea:** Explore all paths recursively. Backtracking adds pruning — undo the choice and try the next option when a path fails.

**Identification signals:**
- Generate all subsets / combinations / permutations
- Path exists in graph/grid?
- Solve a constraint puzzle (N-Queens, Sudoku)
- Tree problems involving paths

**Time:** Exponential (backtracking), O(n) to O(n^2) for tree DFS.
**Space:** O(depth) recursion stack

**Template (backtracking):**

```cpp
void backtrack(vector<int>& nums, int start, vector<int>& curr, vector<vector<int>>& res) {
    res.push_back(curr); // add current state

    for (int i = start; i < nums.size(); i++) {
        curr.push_back(nums[i]);           // choose
        backtrack(nums, i + 1, curr, res); // explore
        curr.pop_back();                   // unchoose
    }
}
```

```java
void backtrack(int[] nums, int start, List<Integer> curr, List<List<Integer>> res) {
    res.add(new ArrayList<>(curr));

    for (int i = start; i < nums.length; i++) {
        curr.add(nums[i]);
        backtrack(nums, i + 1, curr, res);
        curr.remove(curr.size() - 1);
    }
}
```

```typescript
function backtrack(nums: number[], start: number, curr: number[], res: number[][]): void {
    res.push([...curr]);

    for (let i = start; i < nums.length; i++) {
        curr.push(nums[i]);
        backtrack(nums, i + 1, curr, res);
        curr.pop();
    }
}
```

```python
def backtrack(nums: list[int], start: int, curr: list[int], res: list[list[int]]) -> None:
    res.append(list(curr))

    for i in range(start, len(nums)):
        curr.append(nums[i])        # choose
        backtrack(nums, i+1, curr, res)  # explore
        curr.pop()                  # unchoose
```

```go
func backtrack(nums []int, start int, curr []int, res *[][]int) {
    temp := make([]int, len(curr))
    copy(temp, curr)
    *res = append(*res, temp)

    for i := start; i < len(nums); i++ {
        curr = append(curr, nums[i])
        backtrack(nums, i+1, curr, res)
        curr = curr[:len(curr)-1]
    }
}
```

**Classic problems:** Subsets (LC 78), Permutations (LC 46), Combination Sum (LC 39), N-Queens (LC 51), Word Search (LC 79)

---

## Pattern 10: Dynamic Programming

**Core idea:** Break a problem into overlapping subproblems. Store solutions to avoid recomputation. Build bottom-up (tabulation) or top-down (memoization).

**Identification signals:**
- "Maximum/minimum ways to..."
- "Number of ways to..."
- "Is it possible to..."
- Choices at each step with future consequences
- Overlapping subproblems (naive recursion repeats the same calls)

**Time:** Usually O(n) to O(n^2) — **Space:** O(n) to O(n^2), often reducible

**The DP thought process:**
1. Define `dp[i]` clearly in English
2. Write the recurrence
3. Identify base cases
4. Determine traversal order

**Common DP shapes:**

| Shape | Example dp definition |
|---|---|
| 1D linear | `dp[i]` = answer for first i elements |
| 2D grid | `dp[i][j]` = answer for subproblem with i rows, j cols |
| Interval | `dp[i][j]` = answer for subarray from i to j |
| Knapsack | `dp[i][w]` = answer using first i items with capacity w |
| Bitmask | `dp[mask]` = answer for the subset represented by mask |

**Template (top-down memoization — generic):**

```cpp
unordered_map<int,int> memo;
int dp(int i, vector<int>& nums) {
    if (i <= 0) return 0;           // base case
    if (memo.count(i)) return memo[i];
    // recurrence: choose between options
    return memo[i] = max(dp(i-1, nums), dp(i-2, nums) + nums[i-1]);
}
```

```java
Map<Integer,Integer> memo = new HashMap<>();
int dp(int i, int[] nums) {
    if (i <= 0) return 0;
    if (memo.containsKey(i)) return memo.get(i);
    int result = Math.max(dp(i-1, nums), dp(i-2, nums) + nums[i-1]);
    memo.put(i, result);
    return result;
}
```

```typescript
const memo = new Map<number, number>();
function dp(i: number, nums: number[]): number {
    if (i <= 0) return 0;
    if (memo.has(i)) return memo.get(i)!;
    const result = Math.max(dp(i-1, nums), dp(i-2, nums) + nums[i-1]);
    memo.set(i, result);
    return result;
}
```

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def dp(i: int) -> int:
    if i <= 0:
        return 0
    return max(dp(i-1), dp(i-2) + nums[i-1])
```

```go
var memo = map[int]int{}
func dp(i int, nums []int) int {
    if i <= 0 { return 0 }
    if v, ok := memo[i]; ok { return v }
    result := max(dp(i-1, nums), dp(i-2, nums)+nums[i-1])
    memo[i] = result
    return result
}
```

**Template (bottom-up tabulation — 1D House Robber style):**

```cpp
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    vector<int> dp(n);
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
    // Space-optimize: track only prev2, prev1
}
```

```java
int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    int[] dp = new int[n];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}
```

```typescript
function rob(nums: number[]): number {
    const n = nums.length;
    if (n === 1) return nums[0];
    const dp = new Array(n).fill(0);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (let i = 2; i < n; i++)
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}
```

```python
def rob(nums: list[int]) -> int:
    n = len(nums)
    if n == 1:
        return nums[0]
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    return dp[-1]
```

```go
func rob(nums []int) int {
    n := len(nums)
    if n == 1 { return nums[0] }
    dp := make([]int, n)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i := 2; i < n; i++ {
        dp[i] = max(dp[i-1], dp[i-2]+nums[i])
    }
    return dp[n-1]
}
```

**Classic problems:** Climbing Stairs (LC 70), House Robber (LC 198), Longest Common Subsequence (LC 1143), Coin Change (LC 322), Longest Increasing Subsequence (LC 300)

---

## Pattern 11: Greedy

**Core idea:** At each step, make the locally optimal choice. Works when the local optimum leads to a global optimum — provable by exchange argument.

**Identification signals:**
- "Minimum number of X to cover all Y"
- "Maximum number of non-overlapping intervals"
- "Arrange elements to maximize/minimize result"
- Activity selection problems
- Usually you can sort and then linearly scan

**Time:** Usually O(n log n) for the sort + O(n) scan.
**Space:** O(1)

**Key questions to validate greedy:**
1. Does making the locally optimal choice now ever *hurt* future choices?
2. Can you prove by exchange argument that any other choice is at least as bad?

If you can't answer yes to #2, consider DP instead.

**Classic problems:** Jump Game (LC 55), Gas Station (LC 134), Minimum Number of Arrows (LC 452), Non-Overlapping Intervals (LC 435), Task Scheduler (LC 621)

---

## Pattern 12: Intervals (Sort + Sweep)

**Core idea:** Sort intervals by start or end time, then make greedy decisions in a single pass.

**Identification signals:**
- "Merge overlapping intervals"
- "Minimum rooms/resources needed"
- "Remove fewest intervals to make non-overlapping"
- Input has `[start, end]` pairs

**Sort by start** for merging. **Sort by end** for activity selection (greedy removal/shooting).

**Classic problems:** Merge Intervals (LC 56), Insert Interval (LC 57), Meeting Rooms II (LC 253), Non-Overlapping Intervals (LC 435)

---

## Pattern 13: Heap / Top-K

**Core idea:** Use a heap to maintain the top-K elements, or to always process the smallest/largest element next.

**Identification signals:**
- "Find K largest/smallest elements"
- "K closest points"
- "Merge K sorted lists"
- "Process events in order of priority"
- Dijkstra's algorithm

**Time:** O(n log k) for top-k — **Space:** O(k)

**Interview tip:** Use a **min-heap of size k** for top-K largest (pop when size exceeds k). Use **max-heap** for top-K smallest.

**Template (top-K largest using a min-heap of size k):**

```cpp
#include <queue>
vector<int> topKLargest(vector<int>& nums, int k) {
    // min-heap: if size exceeds k, pop the smallest → only k largest remain
    priority_queue<int, vector<int>, greater<int>> minHeap;
    for (int x : nums) {
        minHeap.push(x);
        if ((int)minHeap.size() > k) minHeap.pop();
    }
    vector<int> res;
    while (!minHeap.empty()) { res.push_back(minHeap.top()); minHeap.pop(); }
    return res;
}
```

```java
int[] topKLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>(); // min-heap
    for (int x : nums) {
        minHeap.offer(x);
        if (minHeap.size() > k) minHeap.poll(); // remove smallest
    }
    return minHeap.stream().mapToInt(Integer::intValue).toArray();
}
```

```typescript
// No built-in heap — sort + slice for small n, or implement MinHeap
function topKLargest(nums: number[], k: number): number[] {
    return nums.sort((a, b) => b - a).slice(0, k); // O(n log n) fallback
    // For true O(n log k): implement a min-heap of size k
}
```

```python
import heapq

def top_k_largest(nums: list[int], k: int) -> list[int]:
    # heapq is a min-heap; maintain heap of size k
    heap: list[int] = []
    for x in nums:
        heapq.heappush(heap, x)
        if len(heap) > k:
            heapq.heappop(heap)  # remove smallest
    return heap  # remaining k elements are the largest
    # Shortcut: heapq.nlargest(k, nums)  — O(n log k)
```

```go
import "container/heap"

type MinHeap []int
func (h MinHeap) Len() int           { return len(h) }
func (h MinHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any          { old := *h; n := len(old); x := old[n-1]; *h = old[:n-1]; return x }

func topKLargest(nums []int, k int) []int {
    h := &MinHeap{}
    heap.Init(h)
    for _, x := range nums {
        heap.Push(h, x)
        if h.Len() > k {
            heap.Pop(h) // remove smallest
        }
    }
    return []int(*h)
}
```

**Classic problems:** Kth Largest Element (LC 215), K Closest Points to Origin (LC 973), Top K Frequent Elements (LC 347), Merge K Sorted Lists (LC 23), Task Scheduler (LC 621)

---

## Pattern 14: Union-Find (Disjoint Set Union)

**Core idea:** Maintain a forest of trees where each tree is a connected component. `find` returns the root; `union` merges two components.

**Identification signals:**
- "Connected components"
- "Dynamic connectivity" (edges added one at a time)
- "Detect cycle in undirected graph"
- "Number of islands" (alternative to BFS/DFS)

**Time:** Nearly O(1) per operation with path compression + union by rank.
**Space:** O(n)

**Template:**

```cpp
class UnionFind {
    vector<int> parent, rank;
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]); // path compression
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
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    find(x: number): number {
        if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
        return this.parent[x];
    }
    unite(x: number, y: number): boolean {
        let px = this.find(x), py = this.find(y);
        if (px === py) return false;
        if (this.rank[px] < this.rank[py]) [px, py] = [py, px];
        this.parent[py] = px;
        if (this.rank[px] === this.rank[py]) this.rank[px]++;
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
    p := make([]int, n)
    for i := range p { p[i] = i }
    return &UnionFind{parent: p, rank: make([]int, n)}
}
func (uf *UnionFind) Find(x int) int {
    if uf.parent[x] != x { uf.parent[x] = uf.Find(uf.parent[x]) }
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

**Classic problems:** Number of Provinces (LC 547), Redundant Connection (LC 684), Accounts Merge (LC 721), Number of Islands (LC 200)

---

## Pattern Quick-Reference

| # | Pattern | Key Data Structure | Sort Needed? | Time |
|---|---|---|---|---|
| 1 | Sliding Window | Hash map / array | No | O(n) |
| 2 | Two Pointers | — | Yes (usually) | O(n) |
| 3 | Fast & Slow Pointers | — | No | O(n) |
| 4 | Hash Map | Hash map/set | No | O(n) |
| 5 | Binary Search | — | Yes | O(log n) |
| 6 | Prefix Sum | Array | No | O(n) |
| 7 | Monotonic Stack | Stack | No | O(n) |
| 8 | BFS | Queue | No | O(V+E) |
| 9 | DFS / Backtracking | Recursion stack | No | O(2^n)–O(n^2) |
| 10 | Dynamic Programming | Array/Map | No | O(n)–O(n^2) |
| 11 | Greedy | — | Yes | O(n log n) |
| 12 | Intervals | Array | Yes | O(n log n) |
| 13 | Heap / Top-K | Heap | No | O(n log k) |
| 14 | Union-Find | Array | No | O(n · α(n)) |
