---
title: Generate Parentheses
difficulty: Medium
tags: [Stack, String, Backtracking, Dynamic Programming]
link: https://leetcode.com/problems/generate-parentheses/
---

# Generate Parentheses

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [22. Generate Parentheses](https://leetcode.com/problems/generate-parentheses/) |
| **Tags** | String, Backtracking |

## Problem Statement

Given `n` pairs of parentheses, write a function to generate all combinations of **well-formed parentheses**.

Example: `n = 3` → `["((()))", "(()())", "(())()", "()(())", "()()()"]`

## Intuition

At each position we can place either `(` or `)`, but not freely — the placement must lead to a valid string. The constraints are:

1. We can place `(` only if we haven't used all `n` opening brackets yet (`open < n`)
2. We can place `)` only if it won't create an invalid state (`close < open`)

This naturally leads to a **recursive backtracking** solution — we build the string character by character and only branch when the choice is valid.

## Approach: Backtracking

```cpp
class Solution {
    void backtrack(int n, int open, int close, string& current, vector<string>& result) {
        if (current.size() == 2 * n) {
            result.push_back(current);
            return;
        }
        if (open < n) {
            current.push_back('(');
            backtrack(n, open + 1, close, current, result);
            current.pop_back();
        }
        if (close < open) {
            current.push_back(')');
            backtrack(n, open, close + 1, current, result);
            current.pop_back();
        }
    }
public:
    vector<string> generateParenthesis(int n) {
        vector<string> result;
        string current;
        backtrack(n, 0, 0, current, result);
        return result;
    }
};
```

```java
class Solution {
    private List<String> result = new ArrayList<>();

    public List<String> generateParenthesis(int n) {
        backtrack(n, 0, 0, new StringBuilder());
        return result;
    }

    private void backtrack(int n, int open, int close, StringBuilder sb) {
        if (sb.length() == 2 * n) {
            result.add(sb.toString());
            return;
        }
        if (open < n) {
            sb.append('(');
            backtrack(n, open + 1, close, sb);
            sb.deleteCharAt(sb.length() - 1);
        }
        if (close < open) {
            sb.append(')');
            backtrack(n, open, close + 1, sb);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}
```

```typescript
function generateParenthesis(n: number): string[] {
    const result: string[] = [];

    function backtrack(open: number, close: number, current: string): void {
        if (current.length === 2 * n) {
            result.push(current);
            return;
        }
        if (open < n) backtrack(open + 1, close, current + '(');
        if (close < open) backtrack(open, close + 1, current + ')');
    }

    backtrack(0, 0, '');
    return result;
}
```

```python
class Solution:
    def generateParenthesis(self, n: int) -> list[str]:
        result = []

        def backtrack(open_count: int, close_count: int, current: str) -> None:
            if len(current) == 2 * n:
                result.append(current)
                return
            if open_count < n:
                backtrack(open_count + 1, close_count, current + '(')
            if close_count < open_count:
                backtrack(open_count, close_count + 1, current + ')')

        backtrack(0, 0, '')
        return result
```

```go
func generateParenthesis(n int) []string {
    result := []string{}

    var backtrack func(open, close int, current string)
    backtrack = func(open, close int, current string) {
        if len(current) == 2*n {
            result = append(result, current)
            return
        }
        if open < n {
            backtrack(open+1, close, current+"(")
        }
        if close < open {
            backtrack(open, close+1, current+")")
        }
    }

    backtrack(0, 0, "")
    return result
}
```

**Time:** O(4ⁿ / √n) — the n-th Catalan number times n characters per string.
**Space:** O(n) recursion depth (excluding output).

## Recursion Tree for n=2

```
                 ""
               /    \
            "("      (can't close yet)
           /    \
        "(("    "()"
         |        |
       "(()"    "()(
         |        |
       "(())"  "()()"
```

Every leaf is a valid result. The tree never explores invalid branches.

## Dry Run (n=2)

| open | close | current | Action |
|---|---|---|---|
| 0 | 0 | `""` | can add `(` |
| 1 | 0 | `"("` | can add `(` or `)` |
| 2 | 0 | `"(("` | can only add `)` (open=n) |
| 2 | 1 | `"(()"` | can only add `)` |
| 2 | 2 | `"(())"` | **done** → add to result |
| 1 | 1 | `"()"` | can only add `(` (close=open) |
| 2 | 1 | `"()("` | can only add `)` |
| 2 | 2 | `"()()"` | **done** → add to result |

Result: `["(())", "()()"]` ✓

## Key Interview Insights

- **The two constraints are the entire algorithm.** `open < n` and `close < open` are necessary and sufficient conditions for validity.
- **Why not generate all 2^(2n) strings and filter?** The search space grows too fast. Backtracking prunes invalid branches early, giving the Catalan-number count of valid results.
- **Java's `StringBuilder`** — use `sb.deleteCharAt(sb.length() - 1)` for backtracking. This is O(1) (no string copy), unlike Java's `String` concatenation which creates O(n) copies.
- **Common follow-up:** "What if there are multiple types of brackets?" — extend to track counts for each type and add validity checks per type.
- **The number of valid strings is the n-th Catalan number:** $C_n = \frac{1}{n+1}\binom{2n}{n}$. For n=3, C_3 = 5 (matches the example).

