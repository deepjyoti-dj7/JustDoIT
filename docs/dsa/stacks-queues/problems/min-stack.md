---
title: Min Stack
difficulty: Medium
tags: [Stack, Design]
link: https://leetcode.com/problems/min-stack/
---

# Min Stack

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [155. Min Stack](https://leetcode.com/problems/min-stack/) |
| **Tags** | Stack, Design |

## Problem Statement

Design a stack that supports push, pop, top, and retrieving the minimum element in **constant time**.

Implement `MinStack`:
- `void push(int val)` — push element onto stack
- `void pop()` — removes the top element
- `int top()` — get the top element
- `int getMin()` — retrieve the minimum element

All operations must be **O(1)**.

## Intuition

The naive solution — searching the entire stack for the minimum — is O(n). We need O(1).

**Key insight:** Track the minimum *at each level of the stack*. When we push a new element, we record what the minimum was at that point (either the new element or the previous minimum). When we pop, the minimum automatically reverts to what it was before.

## Approach 1: Two Stacks

Use a second "min stack" in parallel. The top of the min stack always holds the minimum up to the current state.

```cpp
class MinStack {
    stack<int> st;
    stack<int> minSt;
public:
    void push(int val) {
        st.push(val);
        int curMin = minSt.empty() ? val : min(val, minSt.top());
        minSt.push(curMin);
    }
    void pop() {
        st.pop();
        minSt.pop();
    }
    int top() {
        return st.top();
    }
    int getMin() {
        return minSt.top();
    }
};
```

```java
class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        int curMin = minStack.isEmpty() ? val : Math.min(val, minStack.peek());
        minStack.push(curMin);
    }
    public void pop() {
        stack.pop();
        minStack.pop();
    }
    public int top() {
        return stack.peek();
    }
    public int getMin() {
        return minStack.peek();
    }
}
```

```typescript
class MinStack {
    private stack: number[] = [];
    private minStack: number[] = [];

    push(val: number): void {
        this.stack.push(val);
        const curMin = this.minStack.length === 0
            ? val
            : Math.min(val, this.minStack[this.minStack.length - 1]);
        this.minStack.push(curMin);
    }
    pop(): void {
        this.stack.pop();
        this.minStack.pop();
    }
    top(): number {
        return this.stack[this.stack.length - 1];
    }
    getMin(): number {
        return this.minStack[this.minStack.length - 1];
    }
}
```

```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        cur_min = val if not self.min_stack else min(val, self.min_stack[-1])
        self.min_stack.append(cur_min)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]
```

```go
type MinStack struct {
    stack    []int
    minStack []int
}

func Constructor() MinStack { return MinStack{} }

func (s *MinStack) Push(val int) {
    s.stack = append(s.stack, val)
    curMin := val
    if len(s.minStack) > 0 && s.minStack[len(s.minStack)-1] < curMin {
        curMin = s.minStack[len(s.minStack)-1]
    }
    s.minStack = append(s.minStack, curMin)
}
func (s *MinStack) Pop() {
    s.stack = s.stack[:len(s.stack)-1]
    s.minStack = s.minStack[:len(s.minStack)-1]
}
func (s *MinStack) Top() int { return s.stack[len(s.stack)-1] }
func (s *MinStack) GetMin() int { return s.minStack[len(s.minStack)-1] }
```

**Time:** O(1) all operations — **Space:** O(n)

## Approach 2: Single Stack of Pairs

Store `(value, currentMin)` pairs in one stack. Slightly more memory-efficient in terms of number of data structures.

```cpp
class MinStack {
    stack<pair<int,int>> st; // {val, minSoFar}
public:
    void push(int val) {
        int curMin = st.empty() ? val : min(val, st.top().second);
        st.push({val, curMin});
    }
    void pop() { st.pop(); }
    int top() { return st.top().first; }
    int getMin() { return st.top().second; }
};
```

```java
class MinStack {
    private Deque<int[]> stack = new ArrayDeque<>(); // [val, minSoFar]

    public void push(int val) {
        int curMin = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);
        stack.push(new int[]{val, curMin});
    }
    public void pop() { stack.pop(); }
    public int top() { return stack.peek()[0]; }
    public int getMin() { return stack.peek()[1]; }
}
```

```typescript
class MinStack {
    private stack: [number, number][] = []; // [val, minSoFar]

    push(val: number): void {
        const curMin = this.stack.length === 0
            ? val
            : Math.min(val, this.stack[this.stack.length - 1][1]);
        this.stack.push([val, curMin]);
    }
    pop(): void { this.stack.pop(); }
    top(): number { return this.stack[this.stack.length - 1][0]; }
    getMin(): number { return this.stack[this.stack.length - 1][1]; }
}
```

```python
class MinStack:
    def __init__(self):
        self.stack = []  # (val, min_so_far)

    def push(self, val: int) -> None:
        cur_min = val if not self.stack else min(val, self.stack[-1][1])
        self.stack.append((val, cur_min))

    def pop(self) -> None: self.stack.pop()
    def top(self) -> int: return self.stack[-1][0]
    def getMin(self) -> int: return self.stack[-1][1]
```

```go
type MinStack struct {
    stack [][2]int // [val, minSoFar]
}

func Constructor() MinStack { return MinStack{} }

func (s *MinStack) Push(val int) {
    curMin := val
    if len(s.stack) > 0 && s.stack[len(s.stack)-1][1] < curMin {
        curMin = s.stack[len(s.stack)-1][1]
    }
    s.stack = append(s.stack, [2]int{val, curMin})
}
func (s *MinStack) Pop() { s.stack = s.stack[:len(s.stack)-1] }
func (s *MinStack) Top() int { return s.stack[len(s.stack)-1][0] }
func (s *MinStack) GetMin() int { return s.stack[len(s.stack)-1][1] }
```

## Dry Run

Operations: `push(3)`, `push(5)`, `push(1)`, `getMin()`, `pop()`, `getMin()`

| Operation | stack | minStack | getMin |
|---|---|---|---|
| push(3) | [3] | [3] | — |
| push(5) | [3,5] | [3,3] | — |
| push(1) | [3,5,1] | [3,3,1] | — |
| getMin() | [3,5,1] | [3,3,1] | **1** |
| pop() | [3,5] | [3,3] | — |
| getMin() | [3,5] | [3,3] | **3** |

After popping 1, the min correctly reverts to 3 ✓

## Key Interview Insights

- **The invariant:** `minStack[i]` always holds the minimum of `stack[0..i]`.
- **Why not just track one global minimum?** When you pop the current minimum, you'd have no way to recover the previous minimum without scanning.
- **Follow-up — O(1) space optimization:** Only push to minStack when the new value is ≤ current min. Then only pop from minStack when the value being removed equals the current min. This saves space when there are many pushes of non-minimum values, but complicates the logic slightly.

