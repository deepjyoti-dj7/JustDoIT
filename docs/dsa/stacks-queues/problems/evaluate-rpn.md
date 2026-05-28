---
title: Evaluate Reverse Polish Notation
difficulty: Medium
tags: [Stack, Array, Math]
link: https://leetcode.com/problems/evaluate-reverse-polish-notation/
---

# Evaluate Reverse Polish Notation

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) |
| **Tags** | Stack, Array, Math |

## Problem Statement

Evaluate the value of an arithmetic expression in **Reverse Polish Notation (RPN)** (also called postfix notation).

Valid operators: `+`, `-`, `*`, `/`. Each operand may be an integer or another expression. Division **truncates toward zero**.

Example: `["2", "1", "+", "3", "*"]` = `(2 + 1) * 3` = **9**

## Intuition

In RPN, operators come *after* their operands. This eliminates the need for parentheses and operator precedence — the order is already encoded in position.

The stack fits naturally: push numbers as you see them, and when you see an operator, pop two operands, apply the operation, and push the result back. At the end, the stack has exactly one element: the answer.

```
Tokens: [2, 1, +, 3, *]

see 2 → push 2     stack: [2]
see 1 → push 1     stack: [2, 1]
see + → pop 1, pop 2 → push 2+1=3   stack: [3]
see 3 → push 3     stack: [3, 3]
see * → pop 3, pop 3 → push 3*3=9   stack: [9]

result: 9
```

## Approach: Stack Simulation

```cpp
class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        stack<long long> st;
        for (const string& token : tokens) {
            if (token == "+" || token == "-" || token == "*" || token == "/") {
                long long b = st.top(); st.pop();
                long long a = st.top(); st.pop();
                if      (token == "+") st.push(a + b);
                else if (token == "-") st.push(a - b);
                else if (token == "*") st.push(a * b);
                else                   st.push(a / b); // C++ truncates toward zero
            } else {
                st.push(stoll(token));
            }
        }
        return (int)st.top();
    }
};
```

```java
class Solution {
    public int evalRPN(String[] tokens) {
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
}
```

```typescript
function evalRPN(tokens: string[]): number {
    const stack: number[] = [];
    for (const token of tokens) {
        if (token === '+' || token === '-' || token === '*' || token === '/') {
            const b = stack.pop()!;
            const a = stack.pop()!;
            if      (token === '+') stack.push(a + b);
            else if (token === '-') stack.push(a - b);
            else if (token === '*') stack.push(a * b);
            else                    stack.push(Math.trunc(a / b)); // truncate toward zero
        } else {
            stack.push(Number(token));
        }
    }
    return stack[0];
}
```

```python
class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        stack = []
        for token in tokens:
            if token in {'+', '-', '*', '/'}:
                b = stack.pop()
                a = stack.pop()
                if   token == '+': stack.append(a + b)
                elif token == '-': stack.append(a - b)
                elif token == '*': stack.append(a * b)
                else: stack.append(int(a / b))  # int() truncates toward zero
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
            b := stack[len(stack)-1]
            a := stack[len(stack)-2]
            stack = stack[:len(stack)-2]
            switch token {
            case "+": stack = append(stack, a+b)
            case "-": stack = append(stack, a-b)
            case "*": stack = append(stack, a*b)
            case "/": stack = append(stack, a/b) // Go integer division truncates toward zero
            }
        default:
            n, _ := strconv.Atoi(token)
            stack = append(stack, n)
        }
    }
    return stack[0]
}
```

**Time:** O(n) — **Space:** O(n)

## Dry Run

Tokens: `["4", "13", "5", "/", "+"]`

| Token | Action | Stack |
|---|---|---|
| `"4"` | push 4 | [4] |
| `"13"` | push 13 | [4, 13] |
| `"5"` | push 5 | [4, 13, 5] |
| `"/"` | b=5, a=13, push 13/5=2 | [4, 2] |
| `"+"` | b=2, a=4, push 4+2=6 | [6] |

Result: **6** (which is `4 + (13/5)` = `4 + 2` = 6) ✓

## Key Interview Insights

- **Pop order matters for subtraction and division.** The first pop is the *right* operand (`b`), the second pop is the *left* operand (`a`). `a op b`, not `b op a`.
- **Division truncates toward zero**, not floor. In Python, `//` floors toward negative infinity: `-7 // 2 = -4`. Use `int(a / b)` or `int(a / b)` with `math.trunc` for correct behavior. In C++, Java, and Go, integer division already truncates toward zero.
- **Use `long`/`int64` in Java** to avoid overflow on intermediate multiplication results.
- **The input is guaranteed valid** — you won't get division by zero or mismatched tokens. Don't add unnecessary checks.
- **Interesting fact:** RPN is how most calculators and compilers internally process expressions. Expression trees evaluate in postorder, which is exactly RPN.

