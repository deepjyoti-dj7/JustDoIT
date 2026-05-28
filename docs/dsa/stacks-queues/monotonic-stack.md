---
title: Monotonic Stack
description: Monotonic stack — the most powerful stack pattern for "nearest greater/smaller" problems
---

# Monotonic Stack

A **monotonic stack** is a stack that maintains elements in either strictly increasing or strictly decreasing order from bottom to top. When you push an element that violates the order, you first pop elements until the stack is valid again.

This is not a data structure in its own right — it's a **technique** applied to a normal stack. But it's one of the most important patterns for medium-to-hard interview problems.

## The Core Insight

**The element you pop has found its "answer."**

When you push a new element `x` and pop element `y` from the stack (because `x > y` or `x < y`), that popping event tells you:
- `x` is the **next greater element** to the right of `y` (in a decreasing stack)
- `x` is the **next smaller element** to the right of `y` (in an increasing stack)

This is the aha moment. Every pop is an answer being recorded.

## Two Variants

### Monotonic Decreasing Stack

Maintains **decreasing** order (top is smallest). Use to find **next greater element**.

```
Processing [2, 1, 5, 3]:

i=0: push 2  → stack: [2]
i=1: push 1  → stack: [2, 1]   (1 < 2, OK)
i=2: see 5
     pop  1  → NGE of 1 is 5
     pop  2  → NGE of 2 is 5
     push 5  → stack: [5]
i=3: see 3
     push 3  → stack: [5, 3]   (3 < 5, OK)

Remaining in stack (no NGE): 5 → -1, 3 → -1
```

### Monotonic Increasing Stack

Maintains **increasing** order (top is largest). Use to find **next smaller element**.

```
Processing [5, 2, 4, 1]:

i=0: push 5  → stack: [5]
i=1: see 2
     pop  5  → NSE of 5 is 2
     push 2  → stack: [2]
i=2: push 4  → stack: [2, 4]   (4 > 2, OK)
i=3: see 1
     pop  4  → NSE of 4 is 1
     pop  2  → NSE of 2 is 1
     push 1  → stack: [1]
```

## Templates

### Next Greater Element to the Right

```cpp
vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st; // stores indices, maintains decreasing values
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}
```

```java
int[] nextGreater(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // indices
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            result[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return result;
}
```

```typescript
function nextGreater(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack: number[] = []; // indices
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
            result[stack.pop()!] = nums[i];
        }
        stack.push(i);
    }
    return result;
}
```

```python
def next_greater(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []  # indices
    for i, val in enumerate(nums):
        while stack and nums[stack[-1]] < val:
            result[stack.pop()] = val
        stack.append(i)
    return result
```

```go
func nextGreater(nums []int) []int {
    n := len(nums)
    result := make([]int, n)
    for i := range result { result[i] = -1 }
    stack := []int{} // indices
    for i, val := range nums {
        for len(stack) > 0 && nums[stack[len(stack)-1]] < val {
            result[stack[len(stack)-1]] = val
            stack = stack[:len(stack)-1]
        }
        stack = append(stack, i)
    }
    return result
}
```

### Next Greater Element Circular (Wrap Around)

Run two passes (or loop `2n` with `i % n`):

```cpp
vector<int> nextGreaterCircular(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;
    for (int i = 0; i < 2 * n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i % n]) {
            result[st.top()] = nums[i % n];
            st.pop();
        }
        if (i < n) st.push(i);
    }
    return result;
}
```

```java
int[] nextGreaterCircular(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < 2 * n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i % n]) {
            result[stack.pop()] = nums[i % n];
        }
        if (i < n) stack.push(i);
    }
    return result;
}
```

```typescript
function nextGreaterCircular(nums: number[]): number[] {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack: number[] = [];
    for (let i = 0; i < 2 * n; i++) {
        while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i % n]) {
            result[stack.pop()!] = nums[i % n];
        }
        if (i < n) stack.push(i);
    }
    return result;
}
```

```python
def next_greater_circular(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []
    for i in range(2 * n):
        while stack and nums[stack[-1]] < nums[i % n]:
            result[stack.pop()] = nums[i % n]
        if i < n:
            stack.append(i)
    return result
```

```go
func nextGreaterCircular(nums []int) []int {
    n := len(nums)
    result := make([]int, n)
    for i := range result { result[i] = -1 }
    stack := []int{}
    for i := 0; i < 2*n; i++ {
        for len(stack) > 0 && nums[stack[len(stack)-1]] < nums[i%n] {
            result[stack[len(stack)-1]] = nums[i%n]
            stack = stack[:len(stack)-1]
        }
        if i < n { stack = append(stack, i) }
    }
    return result
}
```

## Problem Categories

| Problem Type | Stack Order | What the pop records |
|---|---|---|
| Next Greater Element | Decreasing | `nums[i]` is NGE of popped element |
| Next Smaller Element | Increasing | `nums[i]` is NSE of popped element |
| Previous Greater Element | Decreasing (reverse scan) | Stack top is PGE of current |
| Previous Smaller Element | Increasing (reverse scan) | Stack top is PSE of current |
| Daily Temperatures | Decreasing | `i - popped_index` = days to wait |
| Largest Rectangle | Increasing heights | Width expansion from previous smaller |
| Trapping Rain Water | Decreasing | Bounded by shorter of left/right walls |

## Identifying Monotonic Stack Problems

Look for these trigger phrases:

- "Next greater / smaller element"
- "Previous greater / smaller element"
- "How many days until..."
- "Largest rectangle / area under..."
- "Stock span" — how many consecutive days was the stock price lower?
- "Visible buildings" — how many can you see from a position?
- "Trap water" (can also be solved with two-pointer, but monotonic stack is the general approach)

## Key Rules and Pitfalls

**Always store indices, not values.** You almost always need the index to compute distance or to track which position has been "answered."

**`<` vs `<=` in the while condition:**
- `nums[st.top()] < nums[i]` — strict: keeps equal elements on the stack (pops only on strictly greater)
- `nums[st.top()] <= nums[i]` — non-strict: pops equal elements too (keeps only the latest equal element)

Choose based on whether equal elements should share the same "next greater" or not.

**Don't forget leftover elements.** After the loop, elements remaining on the stack have no next greater element — their answer is -1 (or 0, or the array boundary, depending on the problem).

**Time complexity is always O(n).** Despite the nested `while` loop, each element is pushed and popped at most once.

## Complexity

| | Time | Space |
|---|---|---|
| Any monotonic stack algorithm | O(n) | O(n) |

The O(n) time follows from the fact that each element enters the stack exactly once and leaves exactly once — so the total number of push+pop operations is 2n.

