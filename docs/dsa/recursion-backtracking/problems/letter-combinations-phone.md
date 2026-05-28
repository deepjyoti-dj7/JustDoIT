---
title: Letter Combinations of a Phone Number
difficulty: Medium
tags: [Hash Map, String, Backtracking]
link: https://leetcode.com/problems/letter-combinations-of-a-phone-number/
---

# Letter Combinations of a Phone Number

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [17. Letter Combinations of a Phone Number](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) |
| **Tags** | Hash Map, String, Backtracking |

## Problem Statement

Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.

The digit-to-letters mapping (as on telephone buttons):
```
2 → "abc"   3 → "def"   4 → "ghi"   5 → "jkl"
6 → "mno"   7 → "pqrs"  8 → "tuv"   9 → "wxyz"
```

## Intuition

Each digit independently maps to 2-4 letters. We must choose exactly one letter per digit and concatenate all choices. This is a **Cartesian product** of per-digit letter sets.

```
digits = "23"
Digit 2 → {a, b, c}
Digit 3 → {d, e, f}
Cartesian product: {ad, ae, af, bd, be, bf, cd, ce, cf}
```

Backtracking maps naturally: `index` tracks which digit we're currently resolving. At each step, try every letter for `digits[index]`, then recurse on `index+1`.

## Approach: Backtracking

```cpp
class Solution {
    unordered_map<char, string> phone = {
        {'2',"abc"},{'3',"def"},{'4',"ghi"},{'5',"jkl"},
        {'6',"mno"},{'7',"pqrs"},{'8',"tuv"},{'9',"wxyz"}
    };
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        vector<string> result;
        string current;
        backtrack(digits, 0, current, result);
        return result;
    }

private:
    void backtrack(const string& digits, int index,
                   string& current, vector<string>& result) {
        if (index == digits.size()) {
            result.push_back(current);
            return;
        }
        for (char c : phone[digits[index]]) {
            current.push_back(c);
            backtrack(digits, index + 1, current, result);
            current.pop_back();
        }
    }
};
```

```java
class Solution {
    private static final Map<Character, String> phone = Map.of(
        '2', "abc", '3', "def", '4', "ghi", '5', "jkl",
        '6', "mno", '7', "pqrs", '8', "tuv", '9', "wxyz"
    );
    private List<String> result = new ArrayList<>();

    public List<String> letterCombinations(String digits) {
        if (digits.isEmpty()) return result;
        backtrack(digits, 0, new StringBuilder());
        return result;
    }

    private void backtrack(String digits, int index, StringBuilder current) {
        if (index == digits.length()) {
            result.add(current.toString());
            return;
        }
        for (char c : phone.get(digits.charAt(index)).toCharArray()) {
            current.append(c);
            backtrack(digits, index + 1, current);
            current.deleteCharAt(current.length() - 1);
        }
    }
}
```

```typescript
function letterCombinations(digits: string): string[] {
    if (!digits) return [];

    const phone: Record<string, string> = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };
    const result: string[] = [];

    function backtrack(index: number, current: string): void {
        if (index === digits.length) {
            result.push(current);
            return;
        }
        for (const c of phone[digits[index]]) {
            backtrack(index + 1, current + c);
        }
    }

    backtrack(0, '');
    return result;
}
```

```python
class Solution:
    def letterCombinations(self, digits: str) -> list[str]:
        if not digits:
            return []

        phone = {
            '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
            '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
        }
        result = []

        def backtrack(index: int, current: str) -> None:
            if index == len(digits):
                result.append(current)
                return
            for c in phone[digits[index]]:
                backtrack(index + 1, current + c)

        backtrack(0, '')
        return result
```

```go
func letterCombinations(digits string) []string {
    if len(digits) == 0 { return nil }

    phone := map[byte]string{
        '2': "abc", '3': "def", '4': "ghi", '5': "jkl",
        '6': "mno", '7': "pqrs", '8': "tuv", '9': "wxyz",
    }
    result := []string{}

    var backtrack func(index int, current string)
    backtrack = func(index int, current string) {
        if index == len(digits) {
            result = append(result, current)
            return
        }
        for _, c := range phone[digits[index]] {
            backtrack(index+1, current+string(c))
        }
    }

    backtrack(0, "")
    return result
}
```

## Dry Run

```
digits = "23"

backtrack(0, "")
  phone['2'] = "abc"
  c='a': backtrack(1, "a")
    phone['3'] = "def"
    c='d': backtrack(2, "ad") → index==len → record "ad" ✓
    c='e': backtrack(2, "ae") → record "ae" ✓
    c='f': backtrack(2, "af") → record "af" ✓
  c='b': backtrack(1, "b")
    → "bd", "be", "bf" ✓
  c='c': backtrack(1, "c")
    → "cd", "ce", "cf" ✓

Result: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
```

## Iterative Alternative (BFS / Queue)

```cpp
vector<string> letterCombinations(string digits) {
    if (digits.empty()) return {};
    unordered_map<char, string> phone = {{'2',"abc"},{'3',"def"},{'4',"ghi"},
        {'5',"jkl"},{'6',"mno"},{'7',"pqrs"},{'8',"tuv"},{'9',"wxyz"}};
    vector<string> result = {""};
    for (char digit : digits) {
        vector<string> next;
        for (const string& prefix : result)
            for (char c : phone[digit])
                next.push_back(prefix + c);
        result = next;
    }
    return result;
}
```

```java
public List<String> letterCombinations(String digits) {
    if (digits.isEmpty()) return new ArrayList<>();
    Map<Character, String> phone = new HashMap<>();
    phone.put('2',"abc"); phone.put('3',"def"); phone.put('4',"ghi");
    phone.put('5',"jkl"); phone.put('6',"mno"); phone.put('7',"pqrs");
    phone.put('8',"tuv"); phone.put('9',"wxyz");
    Queue<String> queue = new LinkedList<>(Arrays.asList(""));
    for (char digit : digits.toCharArray()) {
        int size = queue.size();
        while (size-- > 0) {
            String prefix = queue.poll();
            for (char c : phone.get(digit).toCharArray())
                queue.offer(prefix + c);
        }
    }
    return new ArrayList<>(queue);
}
```

```typescript
function letterCombinations(digits: string): string[] {
    if (!digits) return [];
    const phone: Record<string, string> = {
        '2':'abc','3':'def','4':'ghi','5':'jkl',
        '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'
    };
    let result = [''];
    for (const digit of digits) {
        const next: string[] = [];
        for (const prefix of result)
            for (const c of phone[digit])
                next.push(prefix + c);
        result = next;
    }
    return result;
}
```

```python
from collections import deque

def letterCombinations(digits: str) -> list[str]:
    if not digits: return []

    phone = {'2':'abc','3':'def','4':'ghi','5':'jkl',
             '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}

    queue = deque([''])
    for digit in digits:
        for _ in range(len(queue)):
            prefix = queue.popleft()
            for c in phone[digit]:
                queue.append(prefix + c)

    return list(queue)
```

```go
func letterCombinations(digits string) []string {
    if len(digits) == 0 { return nil }
    phone := map[byte]string{'2':"abc",'3':"def",'4':"ghi",'5':"jkl",
        '6':"mno",'7':"pqrs",'8':"tuv",'9':"wxyz"}
    result := []string{""}
    for i := 0; i < len(digits); i++ {
        var next []string
        for _, prefix := range result {
            for _, c := range phone[digits[i]] {
                next = append(next, prefix+string(c))
            }
        }
        result = next
    }
    return result
}
```

## Complexity

- **Time:** O(4ⁿ × n) — at most 4 letters per digit, n digits, each combination of length n to construct
- **Space:** O(n) recursion depth (call stack)

## Key Interview Insights

- **No `start` index needed** — unlike combination/subset problems, here the "position" is the digit index, and each digit has its own independent letter set. No revisiting possible.
- **String immutability** in Python/TypeScript: `current + c` creates a new string each time, so no explicit undo is needed (shown in the Python/TS implementations). Java uses `StringBuilder` to avoid O(n) string creation cost.
- **Edge case: empty input** — must return `[]`, not `[""]`. Check at the start.
- **This is a Cartesian product**: result size is exactly `product(len(letters(d)) for d in digits)`. For "999", that's 4×4×4 = 64.
