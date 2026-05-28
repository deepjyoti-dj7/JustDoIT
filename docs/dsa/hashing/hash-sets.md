---
title: Hash Sets
description: Hash sets — membership testing, deduplication, and set operation patterns for interviews
---

# Hash Sets

A hash set stores a collection of **unique values** and answers "does this element exist?" in O(1) average time. It's a hash map with no values — just keys.

Hash sets are the first tool to reach for when you need fast **membership testing**, **deduplication**, or **visited tracking**.

## Core Operations

| Operation | Average | Worst Case |
|---|---|---|
| `add(x)` | O(1) | O(n) |
| `contains(x)` | O(1) | O(n) |
| `remove(x)` | O(1) | O(n) |
| `size()` | O(1) | O(1) |
| `iterate` | O(n) | O(n) |

## Implementation

```cpp
#include <unordered_set>
unordered_set<int> seen;
seen.insert(1);
seen.insert(2);
seen.count(1);     // 1 if present, 0 if not
seen.erase(1);
bool has = seen.find(2) != seen.end(); // alternative check

// Ordered set (sorted, O(log n))
// set<int> orderedSet;
```

```java
Set<Integer> seen = new HashSet<>();
seen.add(1);
seen.contains(1);  // true
seen.remove(1);
seen.size();

// Iteration
for (int x : seen) { /* ... */ }

// Ordered set
// TreeSet<Integer> sorted = new TreeSet<>();
```

```typescript
const seen = new Set<number>();
seen.add(1);
seen.has(1);       // true
seen.delete(1);
seen.size;

for (const x of seen) { /* ... */ }
```

```python
seen: set[int] = set()
seen.add(1)
1 in seen          # True
seen.discard(1)    # remove if present (no error if absent)
len(seen)

# Build from list (deduplication)
seen = set([1, 2, 2, 3])  # {1, 2, 3}
```

```go
seen := map[int]struct{}{}  // empty struct uses 0 bytes
seen[1] = struct{}{}
_, ok := seen[1]  // ok is true if present
delete(seen, 1)

// Alternative: map[int]bool{}
seen2 := map[int]bool{}
seen2[1] = true
if seen2[1] { /* present */ }
```

> **Go note:** The idiomatic empty set is `map[K]struct{}{}` — the empty struct takes zero memory compared to `map[K]bool{}`. Either works for interviews.

## Set vs Map

| Use Case | Reach For |
|---|---|
| "Has this been seen?" | Set |
| "How many times has this been seen?" | Map (frequency counter) |
| "What index did I see this at?" | Map (value → index) |
| "What value maps to this key?" | Map |

If you only need **existence**, prefer a set. It's more explicit about intent and uses half the memory of a map.

## Core Patterns

### Pattern 1: Deduplication

```cpp
unordered_set<int> unique(nums.begin(), nums.end());
// unique.size() == number of distinct elements
```

```java
Set<Integer> unique = new HashSet<>(Arrays.asList(nums));
// Or from an int array:
Set<Integer> unique = new HashSet<>();
for (int n : nums) unique.add(n);
```

```typescript
const unique = new Set(nums);
// unique.size == number of distinct elements
```

```python
unique = set(nums)
# len(unique) == number of distinct elements
```

```go
unique := map[int]struct{}{}
for _, n := range nums { unique[n] = struct{}{} }
```

### Pattern 2: Contains Duplicate Check

```cpp
unordered_set<int> seen;
for (int n : nums) {
    if (seen.count(n)) return true;
    seen.insert(n);
}
return false;
```

```java
Set<Integer> seen = new HashSet<>();
for (int n : nums) {
    if (!seen.add(n)) return true; // add() returns false if already present
}
return false;
```

```typescript
const seen = new Set<number>();
for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
}
return false;
```

```python
seen = set()
for n in nums:
    if n in seen:
        return True
    seen.add(n)
return False
# Or one-liner: return len(nums) != len(set(nums))
```

```go
seen := map[int]bool{}
for _, n := range nums {
    if seen[n] { return true }
    seen[n] = true
}
return false
```

### Pattern 3: Set Intersection / Difference

Classic for problems asking "find elements in both arrays" or "find elements only in one array."

```cpp
unordered_set<int> setA(a.begin(), a.end());
vector<int> intersection;
for (int n : b) {
    if (setA.count(n)) intersection.push_back(n);
}
```

```java
Set<Integer> setA = new HashSet<>(Arrays.asList(a));
List<Integer> intersection = new ArrayList<>();
for (int n : b) {
    if (setA.contains(n)) intersection.add(n);
}
```

```typescript
const setA = new Set(a);
const intersection = b.filter(n => setA.has(n));
```

```python
set_a = set(a)
intersection = [n for n in b if n in set_a]
# Or: list(set(a) & set(b))
```

```go
setA := map[int]bool{}
for _, n := range a { setA[n] = true }
intersection := []int{}
for _, n := range b {
    if setA[n] { intersection = append(intersection, n) }
}
```

### Pattern 4: Visited Tracking (Graph/BFS/DFS)

```cpp
unordered_set<int> visited;
queue<int> q;
q.push(start);
visited.insert(start);
while (!q.empty()) {
    int node = q.front(); q.pop();
    for (int neighbor : graph[node]) {
        if (!visited.count(neighbor)) {
            visited.insert(neighbor);
            q.push(neighbor);
        }
    }
}
```

```java
Set<Integer> visited = new HashSet<>();
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(start);
visited.add(start);
while (!queue.isEmpty()) {
    int node = queue.poll();
    for (int neighbor : graph.get(node)) {
        if (visited.add(neighbor)) queue.offer(neighbor);
    }
}
```

```typescript
const visited = new Set<number>([start]);
const queue = [start];
while (queue.length > 0) {
    const node = queue.shift()!;
    for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
        }
    }
}
```

```python
from collections import deque
visited = {start}
queue = deque([start])
while queue:
    node = queue.popleft()
    for neighbor in graph[node]:
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)
```

```go
visited := map[int]bool{start: true}
queue := []int{start}
for len(queue) > 0 {
    node := queue[0]
    queue = queue[1:]
    for _, neighbor := range graph[node] {
        if !visited[neighbor] {
            visited[neighbor] = true
            queue = append(queue, neighbor)
        }
    }
}
```

### Pattern 5: Consecutive Sequence Start Detection

For the Longest Consecutive Sequence problem — only start counting from elements that have no left neighbor in the set.

```cpp
unordered_set<int> numSet(nums.begin(), nums.end());
int longest = 0;
for (int n : numSet) {
    if (!numSet.count(n - 1)) { // n is the start of a sequence
        int length = 1;
        while (numSet.count(n + length)) length++;
        longest = max(longest, length);
    }
}
```

```java
Set<Integer> numSet = new HashSet<>();
for (int n : nums) numSet.add(n);
int longest = 0;
for (int n : numSet) {
    if (!numSet.contains(n - 1)) {
        int length = 1;
        while (numSet.contains(n + length)) length++;
        longest = Math.max(longest, length);
    }
}
```

```typescript
const numSet = new Set(nums);
let longest = 0;
for (const n of numSet) {
    if (!numSet.has(n - 1)) {
        let length = 1;
        while (numSet.has(n + length)) length++;
        longest = Math.max(longest, length);
    }
}
```

```python
num_set = set(nums)
longest = 0
for n in num_set:
    if n - 1 not in num_set:  # start of a sequence
        length = 1
        while n + length in num_set:
            length += 1
        longest = max(longest, length)
```

```go
numSet := map[int]bool{}
for _, n := range nums { numSet[n] = true }
longest := 0
for n := range numSet {
    if !numSet[n-1] {
        length := 1
        for numSet[n+length] { length++ }
        if length > longest { longest = length }
    }
}
```

## Ordered Set (Sorted Set)

When you need both O(log n) operations AND sorted order (e.g., find the k-th smallest, find the predecessor/successor):

| Language | Ordered Set | Notes |
|---|---|---|
| Java | `TreeSet<Integer>` | `first()`, `last()`, `floor()`, `ceiling()` |
| C++ | `std::set<int>` | `begin()`, `rbegin()`, `lower_bound()` |
| Python | `SortedList` (sortedcontainers) | Not built-in |
| Go | Manual (heap or BST) | No built-in sorted set |

```java
TreeSet<Integer> ts = new TreeSet<>();
ts.add(5); ts.add(3); ts.add(8);
ts.first();    // 3 (minimum)
ts.last();     // 8 (maximum)
ts.floor(6);   // 5 (largest ≤ 6)
ts.ceiling(4); // 5 (smallest ≥ 4)
ts.higher(5);  // 8 (strictly greater than 5)
```

## Pitfalls

- **Mutable objects in sets** — using lists or arrays as set elements doesn't work correctly in Java/Python because their hash is based on identity/content inconsistency. Use tuples (Python) or convert to strings.
- **Floating-point in sets** — avoid using floats as set keys due to precision issues.
- **Iteration order** — hash sets have no guaranteed order. If you need ordered iteration, use a `TreeSet` (Java) or `sorted(set)` (Python).
- **Python `discard` vs `remove`** — `remove(x)` raises `KeyError` if x is absent; `discard(x)` does not. Use `discard` when unsure.

## Complexity Reference

| | Hash Set | Sorted Set |
|---|---|---|
| Add / Remove / Contains | O(1) avg | O(log n) |
| Min / Max | O(n) | O(log n) or O(1) |
| Sorted iteration | O(n log n) | O(n) |
| Space | O(n) | O(n) |

