---
title: Deque (Double-Ended Queue)
description: Deque — concepts, operations, patterns, and the sliding window maximum technique
---

# Deque (Double-Ended Queue)

A **deque** (pronounced "deck") supports O(1) insertions and deletions from **both ends**. It is simultaneously a stack AND a queue, making it the most versatile linear data structure.

Deques appear naturally in **sliding window maximum/minimum** problems — one of the most asked Hard-level patterns in interviews.

## Core Operations

| Operation | Description | Time |
|---|---|---|
| `pushFront(x)` | Add to front | O(1) |
| `pushBack(x)` | Add to back | O(1) |
| `popFront()` | Remove from front | O(1) |
| `popBack()` | Remove from back | O(1) |
| `peekFront()` | View front | O(1) |
| `peekBack()` | View back | O(1) |

## Implementation

```cpp
#include <deque>
deque<int> dq;
dq.push_front(1); // [1]
dq.push_back(2);  // [1, 2]
dq.push_back(3);  // [1, 2, 3]
int front = dq.front(); // 1
int back  = dq.back();  // 3
dq.pop_front(); // [2, 3]
dq.pop_back();  // [2]
```

```java
Deque<Integer> dq = new ArrayDeque<>();
dq.offerFirst(1);  // addFirst / pushFront
dq.offerLast(2);   // addLast  / pushBack
int front = dq.peekFirst();
int back  = dq.peekLast();
dq.pollFirst();    // popFront
dq.pollLast();     // popBack
```

```typescript
// No built-in deque — use an array with shift/push/unshift/pop
// For performance, implement a doubly linked list or use a library
const dq: number[] = [];
dq.unshift(1);                        // pushFront — O(n) for arrays!
dq.push(2);                           // pushBack  — O(1)
const front = dq[0];
const back  = dq[dq.length - 1];
dq.shift();                           // popFront — O(n) for arrays!
dq.pop();                             // popBack  — O(1)
```

```python
from collections import deque
dq = deque()
dq.appendleft(1)   # pushFront — O(1)
dq.append(2)       # pushBack  — O(1)
front = dq[0]
back  = dq[-1]
dq.popleft()       # popFront  — O(1)
dq.pop()           # popBack   — O(1)
```

```go
// Go has no built-in deque — use a slice (pop from front is O(n) but common in interviews)
dq := []int{}
dq = append([]int{1}, dq...)    // pushFront (O(n))
dq = append(dq, 2)              // pushBack
front := dq[0]
back  := dq[len(dq)-1]
dq = dq[1:]                     // popFront
dq = dq[:len(dq)-1]             // popBack
```

> **JavaScript/TypeScript note:** Array `shift()` and `unshift()` are O(n). For the sliding window maximum pattern where you need true O(1) deque operations, implement a doubly linked list or use an indexed approach in interviews (the O(n) front operations are acceptable for interview purposes since the overall algorithm is still O(n) amortized).

## When to Use a Deque

| Scenario | Why Deque |
|---|---|
| Sliding window max/min | Need to evict from front (old elements) and back (smaller elements) |
| Palindrome checking | Push all, then compare front and back simultaneously |
| Work-stealing schedulers | Threads pop from back; idle threads steal from front |
| A* search / BFS with costs | 0-1 BFS needs pushFront for zero-cost edges |

## The Key Pattern: Monotonic Deque for Sliding Window

This is the canonical deque interview pattern. See [Sliding Window Maximum](./problems/sliding-window-maximum) for the full problem.

**Goal:** Find the maximum in every window of size `k` in O(n) total time.

**Insight:** Maintain a deque that stores **indices** in **decreasing value order**. When the window slides:
- Remove from **front** if the front index is outside the window
- Remove from **back** all indices whose values are ≤ current value (they can never be the max)
- Push current index to **back**
- The **front** always holds the index of the current window's max

```
nums = [3, 1, 2, 5, 4], k = 3

i=0: deque=[0]         window=[3]       max=-
i=1: deque=[0,1]       window=[3,1]     max=-
i=2: deque=[0,2]       window=[3,1,2]   max=nums[0]=3
     (pop 1 because nums[1]=1 < nums[2]=2)
i=3: deque=[3]         window=[1,2,5]   max=nums[3]=5
     (pop 0: out of window; pop 2: nums[2]=2 < 5; pop back 2)
i=4: deque=[3,4]       window=[2,5,4]   max=nums[3]=5
     (pop back? nums[4]=4 < nums[3]=5, keep 3; push 4)
```

```cpp
vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq; // stores indices
    vector<int> result;
    for (int i = 0; i < nums.size(); i++) {
        // Remove out-of-window front
        if (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();
        // Maintain decreasing order: remove smaller from back
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        // Window fully formed
        if (i >= k - 1) result.push_back(nums[dq.front()]);
    }
    return result;
}
```

```java
int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();
    int[] result = new int[nums.length - k + 1];
    for (int i = 0; i < nums.length; i++) {
        if (!dq.isEmpty() && dq.peekFirst() < i - k + 1) dq.pollFirst();
        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
        dq.offerLast(i);
        if (i >= k - 1) result[i - k + 1] = nums[dq.peekFirst()];
    }
    return result;
}
```

```typescript
function maxSlidingWindow(nums: number[], k: number): number[] {
    const dq: number[] = []; // indices
    const result: number[] = [];
    for (let i = 0; i < nums.length; i++) {
        if (dq.length > 0 && dq[0] < i - k + 1) dq.shift();
        while (dq.length > 0 && nums[dq[dq.length - 1]] < nums[i]) dq.pop();
        dq.push(i);
        if (i >= k - 1) result.push(nums[dq[0]]);
    }
    return result;
}
```

```python
from collections import deque

def max_sliding_window(nums: list[int], k: int) -> list[int]:
    dq = deque()  # stores indices
    result = []
    for i, val in enumerate(nums):
        if dq and dq[0] < i - k + 1:
            dq.popleft()
        while dq and nums[dq[-1]] < val:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result
```

```go
func maxSlidingWindow(nums []int, k int) []int {
    dq := []int{} // indices
    result := []int{}
    for i, val := range nums {
        if len(dq) > 0 && dq[0] < i-k+1 { dq = dq[1:] }
        for len(dq) > 0 && nums[dq[len(dq)-1]] < val { dq = dq[:len(dq)-1] }
        dq = append(dq, i)
        if i >= k-1 { result = append(result, nums[dq[0]]) }
    }
    return result
}
```

**Time:** O(n) — each element is pushed and popped at most once.
**Space:** O(k) — deque holds at most k indices.

## Deque vs Stack vs Queue

| | Stack | Queue | Deque |
|---|---|---|---|
| Add front | ✗ | ✗ | ✓ |
| Add back | ✓ | ✓ | ✓ |
| Remove front | ✗ | ✓ | ✓ |
| Remove back | ✓ | ✗ | ✓ |
| Main use | LIFO | FIFO | Sliding window, both-end access |

## Pitfalls

- **Storing values vs indices** — for sliding window, always store **indices** in the deque. You need the index to check if an element is still in the window.
- **`<` vs `<=`** in the eviction condition — `<` gives max; `<=` keeps only one copy for duplicates (both valid depending on problem).
- **Front eviction first** — check and evict the out-of-window front element *before* adding the new element.

