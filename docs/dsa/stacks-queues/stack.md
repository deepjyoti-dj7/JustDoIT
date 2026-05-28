---
title: Stack
description: Stack data structure — concepts, operations, patterns, and interview techniques
---

# Stack

A stack is a **Last-In, First-Out (LIFO)** data structure. Think of a stack of plates: you always add to and remove from the top.

Stacks are one of the most interview-critical data structures because they appear in syntax validation, expression evaluation, undo mechanisms, DFS traversal, and the entire family of **monotonic stack** problems.

## Core Operations

| Operation | Description | Time |
|---|---|---|
| `push(x)` | Add element to top | O(1) |
| `pop()` | Remove and return top element | O(1) |
| `peek()` / `top()` | View top without removing | O(1) |
| `isEmpty()` | Check if empty | O(1) |
| `size()` | Number of elements | O(1) |

> **Never forget:** Always check `isEmpty()` before `pop()` or `peek()`. An empty-stack pop is the #1 runtime error in stack problems.

## When to Use a Stack

Reach for a stack when you see:

- **Matching / pairing** — brackets, parentheses, tags
- **"Most recent" lookups** — nearest previous greater/smaller element
- **Undo/history** — need the last thing added
- **DFS traversal** — iterative tree/graph traversal
- **Expression evaluation** — postfix (RPN), infix with operators
- **Backtracking state** — push state before exploring, pop to restore

## Implementation

In interviews, use the language's built-in stack/deque. Never implement from scratch unless asked.

```cpp
#include <stack>
stack<int> st;
st.push(1);
st.push(2);
int top = st.top();  // 2
st.pop();            // removes 2
bool empty = st.empty();
```

```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
int top = stack.peek();  // 2
stack.pop();             // removes 2
boolean empty = stack.isEmpty();
```

```typescript
// JavaScript arrays serve as stacks
const stack: number[] = [];
stack.push(1);
stack.push(2);
const top = stack[stack.length - 1]; // peek: 2
stack.pop();                          // removes 2
const empty = stack.length === 0;
```

```python
stack = []
stack.append(1)
stack.append(2)
top = stack[-1]   # peek: 2
stack.pop()       # removes 2
empty = len(stack) == 0
```

```go
stack := []int{}
stack = append(stack, 1)
stack = append(stack, 2)
top := stack[len(stack)-1]    // peek: 2
stack = stack[:len(stack)-1]  // pop
empty := len(stack) == 0
```

> **Java note:** Use `ArrayDeque` over `Stack` class. The legacy `java.util.Stack` is synchronized and significantly slower.

## The Stack Frame Mental Model

Visualizing a stack makes problems easier:

```
push(1), push(2), push(3)

| 3 | ← top
| 2 |
| 1 |
|___|

pop() → 3

| 2 | ← top
| 1 |
|___|
```

Every element waits on the stack until something "resolves" it (a matching bracket, a smaller element, etc.). This **deferred resolution** is the core pattern.

## Key Patterns

### Pattern 1: Validate / Match Pairs

**Template:** Push opening elements; when you see a closing element, check that the top matches.

```cpp
bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return st.empty();
}
```

```java
boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') {
            stack.push(c);
        } else {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return stack.isEmpty();
}
```

```typescript
function isValid(s: string): boolean {
    const stack: string[] = [];
    const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
    for (const c of s) {
        if ('([{'.includes(c)) {
            stack.push(c);
        } else {
            if (stack.length === 0 || stack[stack.length - 1] !== pairs[c]) return false;
            stack.pop();
        }
    }
    return stack.length === 0;
}
```

```python
def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for c in s:
        if c in '([{':
            stack.append(c)
        else:
            if not stack or stack[-1] != pairs[c]:
                return False
            stack.pop()
    return len(stack) == 0
```

```go
func isValid(s string) bool {
    stack := []rune{}
    pairs := map[rune]rune{')': '(', ']': '[', '}': '{'}
    for _, c := range s {
        if c == '(' || c == '[' || c == '{' {
            stack = append(stack, c)
        } else {
            if len(stack) == 0 || stack[len(stack)-1] != pairs[c] {
                return false
            }
            stack = stack[:len(stack)-1]
        }
    }
    return len(stack) == 0
}
```

### Pattern 2: Evaluate Expressions

**Template:** Scan tokens, push numbers; on operator, pop two operands and push result.

```cpp
int evalRPN(vector<string>& tokens) {
    stack<long long> st;
    for (auto& token : tokens) {
        if (token == "+" || token == "-" || token == "*" || token == "/") {
            long long b = st.top(); st.pop();
            long long a = st.top(); st.pop();
            if (token == "+") st.push(a + b);
            else if (token == "-") st.push(a - b);
            else if (token == "*") st.push(a * b);
            else st.push(a / b);
        } else {
            st.push(stoll(token));
        }
    }
    return st.top();
}
```

```java
int evalRPN(String[] tokens) {
    Deque<Long> stack = new ArrayDeque<>();
    for (String token : tokens) {
        switch (token) {
            case "+" -> { long b = stack.pop(); stack.push(stack.pop() + b); }
            case "-" -> { long b = stack.pop(); stack.push(stack.pop() - b); }
            case "*" -> { long b = stack.pop(); stack.push(stack.pop() * b); }
            case "/" -> { long b = stack.pop(); stack.push(stack.pop() / b); }
            default  -> stack.push(Long.parseLong(token));
        }
    }
    return stack.peek().intValue();
}
```

```typescript
function evalRPN(tokens: string[]): number {
    const stack: number[] = [];
    for (const token of tokens) {
        if ('+-*/'.includes(token)) {
            const b = stack.pop()!;
            const a = stack.pop()!;
            if (token === '+') stack.push(a + b);
            else if (token === '-') stack.push(a - b);
            else if (token === '*') stack.push(a * b);
            else stack.push(Math.trunc(a / b));
        } else {
            stack.push(Number(token));
        }
    }
    return stack[0];
}
```

```python
def eval_rpn(tokens: list[str]) -> int:
    stack = []
    for token in tokens:
        if token in '+-*/':
            b, a = stack.pop(), stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            else: stack.append(int(a / b))  # truncate toward zero
        else:
            stack.append(int(token))
    return stack[0]
```

```go
func evalRPN(tokens []string) int {
    stack := []int{}
    for _, token := range tokens {
        switch token {
        case "+", "-", "*", "/":
            b, a := stack[len(stack)-1], stack[len(stack)-2]
            stack = stack[:len(stack)-2]
            switch token {
            case "+": stack = append(stack, a+b)
            case "-": stack = append(stack, a-b)
            case "*": stack = append(stack, a*b)
            case "/": stack = append(stack, a/b)
            }
        default:
            n, _ := strconv.Atoi(token)
            stack = append(stack, n)
        }
    }
    return stack[0]
}
```

### Pattern 3: Iterative DFS

**Template:** Replace the recursive call stack with an explicit stack.

```cpp
void dfs(vector<vector<int>>& graph, int start) {
    stack<int> st;
    vector<bool> visited(graph.size(), false);
    st.push(start);
    while (!st.empty()) {
        int node = st.top(); st.pop();
        if (visited[node]) continue;
        visited[node] = true;
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) st.push(neighbor);
        }
    }
}
```

```java
void dfs(List<List<Integer>> graph, int start) {
    Deque<Integer> stack = new ArrayDeque<>();
    boolean[] visited = new boolean[graph.size()];
    stack.push(start);
    while (!stack.isEmpty()) {
        int node = stack.pop();
        if (visited[node]) continue;
        visited[node] = true;
        for (int neighbor : graph.get(node)) {
            if (!visited[neighbor]) stack.push(neighbor);
        }
    }
}
```

```typescript
function dfs(graph: number[][], start: number): void {
    const stack = [start];
    const visited = new Set<number>();
    while (stack.length > 0) {
        const node = stack.pop()!;
        if (visited.has(node)) continue;
        visited.add(node);
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) stack.push(neighbor);
        }
    }
}
```

```python
def dfs(graph: list[list[int]], start: int) -> None:
    stack = [start]
    visited = set()
    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)
```

```go
func dfs(graph [][]int, start int) {
    stack := []int{start}
    visited := make([]bool, len(graph))
    for len(stack) > 0 {
        node := stack[len(stack)-1]
        stack = stack[:len(stack)-1]
        if visited[node] { continue }
        visited[node] = true
        for _, neighbor := range graph[node] {
            if !visited[neighbor] { stack = append(stack, neighbor) }
        }
    }
}
```

## Edge Cases to Always Consider

- **Empty stack pop** — check before accessing top
- **Single element** — does the algorithm still work?
- **All elements the same** — edge for monotonic variants
- **Unmatched opening brackets** — `stack.isEmpty()` check at end (not just during traversal)
- **Order matters** — for subtraction/division in RPN, `a op b` means pop `b` first, then `a`

## Complexity Reference

| Use Case | Time | Space |
|---|---|---|
| Bracket matching | O(n) | O(n) |
| RPN evaluation | O(n) | O(n) |
| Iterative DFS | O(V + E) | O(V) |
| Monotonic stack (next greater) | O(n) | O(n) |

## Interview Patterns Table

| Pattern | Trigger Words | Approach |
|---|---|---|
| Balanced brackets | "valid", "matching", "nested" | Push opens, pop on close |
| Expression eval | "postfix", "RPN", "calculator" | Push numbers, pop on operator |
| Next greater element | "nearest greater/smaller" | Monotonic stack |
| Undo operations | "history", "revert" | Stack of states |
| Iterative DFS | "avoid recursion", tree traversal | Explicit stack |
| Min/Max with history | "min/max at any point" | Auxiliary stack |

