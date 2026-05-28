---
title: Valid Parentheses
difficulty: Easy
tags: [Stack, String]
link: https://leetcode.com/problems/valid-parentheses/
---

# Valid Parentheses

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/) |
| **Tags** | Stack, String |

## Problem Statement

Given a string `s` containing only `'('`, `')'`, `'{'`, `'}'`, `'['`, `']'`, determine if the input string is valid.

A string is valid if:
1. Open brackets are closed by the same type of bracket.
2. Open brackets are closed in the correct order.
3. Every close bracket has a corresponding open bracket.

## Intuition

This is the foundational **bracket matching** problem. Every time you see an opening bracket, you don't know yet what will close it — so you push it onto a stack and wait. When you see a closing bracket, the **most recently opened** bracket must match it. If it doesn't, the string is invalid.

The stack naturally enforces this "most recent first" ordering — which is exactly LIFO.

## Approach: Stack

```cpp
class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        unordered_map<char, char> pairs = {
            {')', '('}, {']', '['}, {'}', '{'}
        };
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.empty() || st.top() != pairs[c]) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};
```

```java
class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{');
        for (char c : s.toCharArray()) {
            if (pairs.containsKey(c)) {
                if (stack.isEmpty() || stack.peek() != pairs.get(c)) return false;
                stack.pop();
            } else {
                stack.push(c);
            }
        }
        return stack.isEmpty();
    }
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
class Solution:
    def isValid(self, s: str) -> bool:
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

**Time:** O(n) — **Space:** O(n)

## Dry Run

Input: `"({[]})"` 

| Char | Action | Stack |
|---|---|---|
| `(` | push | `[(`] |
| `{` | push | `[({`] |
| `[` | push | `[({[`] |
| `]` | pop `[` — match ✓ | `[({`] |
| `}` | pop `{` — match ✓ | `[(`] |
| `)` | pop `(` — match ✓ | `[]` |

Stack empty → **true** ✓

Input: `"([)]"`

| Char | Action | Stack |
|---|---|---|
| `(` | push | `[(`] |
| `[` | push | `[([`] |
| `)` | top is `[`, expected `(` → **false** ✗ | |

## Key Interview Insights

- **Two failure modes:** (1) closing bracket doesn't match top, (2) string ends with non-empty stack. Both checks are required.
- **`stack.empty()` guard before `peek()`** handles `"]"` (close bracket with nothing open).
- **Common follow-up:** "What if there are other characters?" — skip them. Only act on brackets.
- **The hash map approach** (`pairs` map from close to open) is cleaner than a chain of if/else — easier to extend to new bracket types.

