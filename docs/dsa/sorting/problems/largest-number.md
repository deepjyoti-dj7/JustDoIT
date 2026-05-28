---
title: Largest Number
difficulty: Medium
tags: [Array, String, Sorting, Custom Comparator, Greedy]
link: https://leetcode.com/problems/largest-number/
---

# Largest Number

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [179. Largest Number](https://leetcode.com/problems/largest-number/) |
| **Tags** | Array, String, Sorting, Custom Comparator, Greedy |

## Problem Statement

Given a list of non-negative integers `nums`, arrange them to form the **largest possible number** and return it as a string.

**Example:**
```
Input:  [3, 30, 34, 5, 9]
Output: "9534330"

Input:  [10, 2]
Output: "210"
```

## Intuition

We need to sort numbers by which combination produces a larger string — not by their numeric value.

**Key insight:** For any two numbers `a` and `b`, the order to place them depends on whether `str(a) + str(b) > str(b) + str(a)`.

For `10` and `2`: `"102"` vs `"210"` → `"210"` is larger → `2` comes before `10`.

This gives us a **custom comparator**: sort by the concatenation that produces a larger number.

**Why this works:** The comparator defines a total order. If we sort all numbers using this comparator, the result is always the globally largest arrangement. This follows from the transitivity of the comparison relation.

## Approach 1: Brute Force

Generate all permutations, convert each to a number, find the maximum. O(n! × n) — not viable.

## Approach 2: Custom Comparator Sort (Optimal)

Convert all numbers to strings, sort using the custom comparator `(a, b) → (b+a).compare(a+b)`, then concatenate.

```cpp
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    string largestNumber(vector<int>& nums) {
        vector<string> strs;
        for (int n : nums) strs.push_back(to_string(n));

        sort(strs.begin(), strs.end(), [](const string& a, const string& b) {
            return a + b > b + a;  // sort in descending order of (a+b)
        });

        if (strs[0] == "0") return "0";  // edge case: all zeros → "000...0"

        string result;
        for (const string& s : strs) result += s;
        return result;
    }
};
```

```java
class Solution {
    public String largestNumber(int[] nums) {
        String[] strs = new String[nums.length];
        for (int i = 0; i < nums.length; i++) strs[i] = String.valueOf(nums[i]);

        Arrays.sort(strs, (a, b) -> (b + a).compareTo(a + b));

        if (strs[0].equals("0")) return "0";

        StringBuilder sb = new StringBuilder();
        for (String s : strs) sb.append(s);
        return sb.toString();
    }
}
```

```typescript
function largestNumber(nums: number[]): string {
    const strs = nums.map(String);

    strs.sort((a, b) => (b + a) > (a + b) ? 1 : (b + a) < (a + b) ? -1 : 0);

    if (strs[0] === '0') return '0';
    return strs.join('');
}
```

```python
from functools import cmp_to_key

class Solution:
    def largestNumber(self, nums: list[int]) -> str:
        strs = list(map(str, nums))

        def compare(a: str, b: str) -> int:
            # Returns positive if a+b > b+a (a should come first)
            if a + b > b + a: return -1   # a first (descending sort)
            if a + b < b + a: return 1    # b first
            return 0

        strs.sort(key=cmp_to_key(compare))

        # Edge case: all zeros
        if strs[0] == '0':
            return '0'

        return ''.join(strs)
```

```go
import (
    "sort"
    "strconv"
    "strings"
)

func largestNumber(nums []int) string {
    strs := make([]string, len(nums))
    for i, n := range nums { strs[i] = strconv.Itoa(n) }

    sort.Slice(strs, func(i, j int) bool {
        return strs[i]+strs[j] > strs[j]+strs[i]
    })

    if strs[0] == "0" { return "0" }
    return strings.Join(strs, "")
}
```

## Dry Run

```
Input: [3, 30, 34, 5, 9]
Strings: ["3", "30", "34", "5", "9"]

Comparisons for sorting (descending):
"9" vs "5":  "95" > "59" → 9 first
"9" vs "34": "934" > "349" → 9 first
"5" vs "34": "534" > "345" → 5 first
"3" vs "30": "330" > "303" → 3 first
"34" vs "30":"3430" > "3034" → 34 first

Sorted: ["9", "5", "34", "3", "30"]
Result: "9534330" ✓
```

## Why Is the Comparator Transitive?

An important mathematical concern: is `a+b > b+a` transitive? If `a > b` and `b > c` (in comparator terms), is `a > c`?

Yes — it can be proven by treating strings as numbers in base 10 raised to the appropriate power. The comparator defines a valid total ordering, making it safe to use in sorting.

## Complexity

- **Time:** O(n log n × L) — sorting with O(n log n) comparisons, each comparison is O(L) string concatenation where L = max number length
- **Space:** O(n × L) — storing string representations

## Key Interview Insights

- **The comparator `a+b vs b+a` is the core insight.** Everything else is boilerplate. State this clearly when explaining.
- **Edge case: all zeros.** `[0, 0]` → after sort `["0", "0"]` → concatenation gives `"00"`. Check if first element is `"0"` and return `"0"`.
- **Why convert to strings first?** Numeric comparison of `3` and `30` gives `3 < 30` → wrong. String comparison of `"3"` and `"30"` by concatenation gives `"330" > "303"` → correct.
- **Python needs `cmp_to_key`.** Python 3 doesn't support comparison functions directly in sort; use `functools.cmp_to_key`.
- **Follow-up: "Is your comparator transitively correct?"** Be ready to prove or at least sketch the argument.
