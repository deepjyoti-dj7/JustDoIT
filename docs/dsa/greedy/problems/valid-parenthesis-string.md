---
title: Valid Parenthesis String
difficulty: Medium
tags: [Greedy, String, Stack, Dynamic Programming]
link: https://leetcode.com/problems/valid-parenthesis-string/
---

# Valid Parenthesis String

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [678. Valid Parenthesis String](https://leetcode.com/problems/valid-parenthesis-string/) |
| **Tags** | Greedy, String, Stack, Dynamic Programming |

## Problem Statement

Given a string `s` containing `'('`, `')'`, and `'*'`, return `true` if `s` is **valid**. A `'*'` can act as:
- `'('` — an opening parenthesis
- `')'` — a closing parenthesis  
- `''` — an empty string

A string is valid if every `'('` can be matched with a later `')'`, and vice versa.

**Examples:**
```
"(*)"   → true
"(*))"  → true  ('*' can be '(', making "(())")
"(*"    → true  ('*' can be '')
")(*)(" → false
```

---

## Intuition

Track how many **unmatched `(`** we have at every point. Without `*`, we'd just need this count to never go negative and end at zero.

With `*`, each `*` can shift the open-paren count by +1, 0, or -1. Instead of tracking a single count, track a **range** `[lo, hi]`:
- `lo` = minimum possible number of unmatched `(`
- `hi` = maximum possible number of unmatched `(`

Rules:
- `'('`: both `lo` and `hi` increase by 1
- `')'`: both decrease by 1
- `'*'`: `lo--` (use `*` as `)`), `hi++` (use `*` as `(`)
- If `hi < 0` at any point: too many `)` — impossible, return `false`
- Clamp `lo = max(lo, 0)` — open-paren count can't go negative (extra `)` from `*` is useless once `lo` hits 0)

At the end, if `lo == 0`, there's a valid assignment where all opens are matched.

**Why greedy?** We don't need to try every combination of `*` replacements. Tracking the range of *possible* open counts is equivalent — if `0` is achievable within `[lo, hi]` at the end, a valid string exists.

---

## Approach 1: DP

`dp[i][j]` = can we have exactly `j` unmatched opens after processing first `i` characters?

```cpp
bool checkValidString(string s) {
    int n = s.size();
    // dp[j] = true if j unmatched opens is achievable at current position
    vector<bool> dp(n + 1, false);
    dp[0] = true;
    for (char c : s) {
        vector<bool> ndp(n + 1, false);
        for (int j = 0; j <= n; j++) {
            if (!dp[j]) continue;
            if (c == '(' || c == '*') if (j + 1 <= n) ndp[j + 1] = true;
            if (c == ')' || c == '*') if (j > 0) ndp[j - 1] = true;
            if (c == '*') ndp[j] = true;
        }
        dp = ndp;
    }
    return dp[0];
}
```

```java
boolean checkValidString(String s) {
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    for (char c : s.toCharArray()) {
        boolean[] ndp = new boolean[n + 1];
        for (int j = 0; j <= n; j++) {
            if (!dp[j]) continue;
            if (c == '(' || c == '*') if (j + 1 <= n) ndp[j + 1] = true;
            if (c == ')' || c == '*') if (j > 0)      ndp[j - 1] = true;
            if (c == '*')                              ndp[j]     = true;
        }
        dp = ndp;
    }
    return dp[0];
}
```

```typescript
function checkValidString(s: string): boolean {
    const n = s.length;
    let dp = new Array(n + 1).fill(false);
    dp[0] = true;
    for (const c of s) {
        const ndp = new Array(n + 1).fill(false);
        for (let j = 0; j <= n; j++) {
            if (!dp[j]) continue;
            if (c === '(' || c === '*') if (j + 1 <= n) ndp[j + 1] = true;
            if (c === ')' || c === '*') if (j > 0)      ndp[j - 1] = true;
            if (c === '*')                               ndp[j]     = true;
        }
        dp = ndp;
    }
    return dp[0];
}
```

```python
def check_valid_string_dp(s: str) -> bool:
    n = len(s)
    dp = {0}  # set of achievable open-paren counts
    for c in s:
        ndp: set[int] = set()
        for j in dp:
            if c in ('(', '*') and j + 1 <= n: ndp.add(j + 1)
            if c in (')', '*') and j > 0:       ndp.add(j - 1)
            if c == '*':                         ndp.add(j)
        dp = ndp
    return 0 in dp
```

```go
func checkValidStringDP(s string) bool {
    n := len(s)
    dp := make([]bool, n+1)
    dp[0] = true
    for _, c := range s {
        ndp := make([]bool, n+1)
        for j := 0; j <= n; j++ {
            if !dp[j] { continue }
            if c == '(' || c == '*' { if j+1 <= n { ndp[j+1] = true } }
            if c == ')' || c == '*' { if j > 0    { ndp[j-1] = true } }
            if c == '*'             { ndp[j] = true }
        }
        dp = ndp
    }
    return dp[0]
}
```

**Time:** O(n²) — **Space:** O(n)

---

## Approach 2: Greedy Range [lo, hi] (Optimal)

Track the range of possible unmatched open-paren counts. Prune impossible states early.

```cpp
bool checkValidString(string s) {
    int lo = 0, hi = 0;
    for (char c : s) {
        if (c == '(') { lo++; hi++; }
        else if (c == ')') { lo--; hi--; }
        else { lo--; hi++; }   // '*': lo uses '*' as ')', hi uses '*' as '('
        if (hi < 0) return false;   // too many ')' even in best case
        lo = max(lo, 0);            // can't have negative open count
    }
    return lo == 0;
}
```

```java
boolean checkValidString(String s) {
    int lo = 0, hi = 0;
    for (char c : s.toCharArray()) {
        if (c == '(')      { lo++; hi++; }
        else if (c == ')') { lo--; hi--; }
        else               { lo--; hi++; } // '*'
        if (hi < 0) return false;
        lo = Math.max(lo, 0);
    }
    return lo == 0;
}
```

```typescript
function checkValidString(s: string): boolean {
    let lo = 0, hi = 0;
    for (const c of s) {
        if (c === '(')      { lo++; hi++; }
        else if (c === ')') { lo--; hi--; }
        else                { lo--; hi++; } // '*'
        if (hi < 0) return false;
        lo = Math.max(lo, 0);
    }
    return lo === 0;
}
```

```python
def check_valid_string(s: str) -> bool:
    lo = hi = 0
    for c in s:
        if c == '(':
            lo += 1; hi += 1
        elif c == ')':
            lo -= 1; hi -= 1
        else:            # '*'
            lo -= 1; hi += 1
        if hi < 0:
            return False   # too many ')'
        lo = max(lo, 0)    # clamp: can't go negative
    return lo == 0
```

```go
func checkValidString(s string) bool {
    lo, hi := 0, 0
    for _, c := range s {
        switch c {
        case '(':
            lo++; hi++
        case ')':
            lo--; hi--
        default: // '*'
            lo--; hi++
        }
        if hi < 0 { return false }
        if lo < 0 { lo = 0 }
    }
    return lo == 0
}
```

**Time:** O(n) — **Space:** O(1)

---

## Approach 3: Two-Stack (Intuitive)

Keep two stacks: one for `(` indices, one for `*` indices. Match `)` with `(` first, then with `*`. At the end, match remaining `(` with `*` to their right.

```cpp
bool checkValidStringStack(string s) {
    stack<int> opens, stars;
    for (int i = 0; i < (int)s.size(); i++) {
        if (s[i] == '(')      opens.push(i);
        else if (s[i] == '*') stars.push(i);
        else {
            if (!opens.empty()) opens.pop();
            else if (!stars.empty()) stars.pop();
            else return false;
        }
    }
    // Match remaining '(' with '*' that appear to their right
    while (!opens.empty() && !stars.empty()) {
        if (opens.top() > stars.top()) return false; // '(' is after '*'
        opens.pop(); stars.pop();
    }
    return opens.empty();
}
```

```java
boolean checkValidStringStack(String s) {
    Deque<Integer> opens = new ArrayDeque<>(), stars = new ArrayDeque<>();
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (c == '(')      opens.push(i);
        else if (c == '*') stars.push(i);
        else {
            if (!opens.isEmpty()) opens.pop();
            else if (!stars.isEmpty()) stars.pop();
            else return false;
        }
    }
    while (!opens.isEmpty() && !stars.isEmpty()) {
        if (opens.peek() > stars.peek()) return false;
        opens.pop(); stars.pop();
    }
    return opens.isEmpty();
}
```

```typescript
function checkValidStringStack(s: string): boolean {
    const opens: number[] = [], stars: number[] = [];
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(')      opens.push(i);
        else if (s[i] === '*') stars.push(i);
        else {
            if (opens.length > 0)      opens.pop();
            else if (stars.length > 0) stars.pop();
            else return false;
        }
    }
    while (opens.length > 0 && stars.length > 0) {
        if (opens[opens.length - 1] > stars[stars.length - 1]) return false;
        opens.pop(); stars.pop();
    }
    return opens.length === 0;
}
```

```python
def check_valid_string_stack(s: str) -> bool:
    opens, stars = [], []
    for i, c in enumerate(s):
        if c == '(':   opens.append(i)
        elif c == '*': stars.append(i)
        else:
            if opens:       opens.pop()
            elif stars:     stars.pop()
            else:           return False
    # Match remaining '(' with '*' that come after them
    while opens and stars:
        if opens[-1] > stars[-1]:
            return False    # '(' appears after '*', can't use '*' as ')'
        opens.pop(); stars.pop()
    return not opens
```

```go
func checkValidStringStack(s string) bool {
    opens, stars := []int{}, []int{}
    for i := 0; i < len(s); i++ {
        switch s[i] {
        case '(':
            opens = append(opens, i)
        case '*':
            stars = append(stars, i)
        default:
            if len(opens) > 0 { opens = opens[:len(opens)-1] } else
            if len(stars) > 0 { stars = stars[:len(stars)-1] } else { return false }
        }
    }
    for len(opens) > 0 && len(stars) > 0 {
        if opens[len(opens)-1] > stars[len(stars)-1] { return false }
        opens = opens[:len(opens)-1]
        stars = stars[:len(stars)-1]
    }
    return len(opens) == 0
}
```

**Time:** O(n) — **Space:** O(n)

---

## Dry Run (Greedy)

`s = "(*))":`

| i | c | lo | hi | hi < 0? | lo after clamp |
|---|---|---|---|---|---|
| 0 | `(` | 1 | 1 | No | 1 |
| 1 | `*` | 0 | 2 | No | 0 |
| 2 | `)` | -1 | 1 | No | **0** (clamped) |
| 3 | `)` | -1 | 0 | No | **0** (clamped) |

`lo = 0` → `true` ✓ (`*` acts as `(`, giving `"(()))"` — actually `(())` with last `)` matched)

`s = ")(":`

| i | c | lo | hi |
|---|---|---|---|
| 0 | `)` | -1 → clamp 0 | -1 → **hi < 0 → false** |

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| DP | O(n²) | O(n) |
| Greedy range [lo, hi] | O(n) | O(1) |
| Two-stack | O(n) | O(n) |

---

## Key Interview Insights

- **`lo` represents the optimistic minimum** (use `*` as `)` wherever possible). **`hi` represents the pessimistic maximum** (use `*` as `(` everywhere). If zero is achievable within `[lo, hi]`, we win.
- **Clamping `lo` at 0** is critical: a `*` used as `)` can never produce a negative open count in a valid string — surplus `)` is ignored.
- **`hi < 0` is the early exit:** Even if every `*` is used as `(`, we still have more `)` than `(` — impossible.
- **Two-stack approach** is more intuitive to explain verbally: "match `)` with the nearest `(`, fall back to `*` if needed. Then match leftover `(` with `*` to their right."
- The greedy range approach is cleanest to code and most impressive in an interview setting.
