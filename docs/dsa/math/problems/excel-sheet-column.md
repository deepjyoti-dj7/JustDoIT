---
title: Excel Sheet Column Number / Title
difficulty: Medium
tags: [Math, String]
link: https://leetcode.com/problems/excel-sheet-column-title/
---

# Excel Sheet Column Title

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [168. Excel Sheet Column Title](https://leetcode.com/problems/excel-sheet-column-title/) |
| **Tags** | Math, String |

## Problem Statement

Given an integer `columnNumber`, return its corresponding column title as it appears in an Excel spreadsheet.

Excel column titles: `A=1, B=2, ..., Z=26, AA=27, AB=28, ..., AZ=52, BA=53, ...`

**Example 1:**
```
Input:  columnNumber = 1
Output: "A"
```

**Example 2:**
```
Input:  columnNumber = 28
Output: "AB"
```

**Example 3:**
```
Input:  columnNumber = 701
Output: "ZY"
```

---

## Intuition

This looks like base-26 conversion (A=0, B=1, ..., Z=25), but it's **not standard base-26**. The key difference: there is no zero digit. The system is 1-indexed: `A=1, ..., Z=26`.

In standard base-26, the values are `0..25`. Here, digits are `1..26`. This "off-by-one" is the twist.

**The trick:** Before taking `% 26`, subtract 1 from `columnNumber`. This shifts the range from `[1..26]` to `[0..25]`, making it standard base-26.

```
n = 28 ("AB"):
  n - 1 = 27
  27 % 26 = 1  → 'B'   (1 → 'B' since 'A' + 1 = 'B')
  27 / 26 = 1
  1 - 1 = 0
  0 % 26 = 0   → 'A'
  0 / 26 = 0   → stop

Result (reversed): "AB" ✓
```

**Algorithm:**
1. Subtract 1 from `columnNumber`
2. Take `(columnNumber) % 26` to get the current digit → convert to letter
3. Divide `columnNumber` by 26 (integer division)
4. Prepend the letter to result
5. Repeat until `columnNumber == 0`

---

## Approach: Adjusted Base-26 Conversion

```cpp
string convertToTitle(int columnNumber) {
    string result = "";
    while (columnNumber > 0) {
        columnNumber--;             // shift: 1-indexed → 0-indexed
        result += (char)('A' + columnNumber % 26);
        columnNumber /= 26;
    }
    reverse(result.begin(), result.end());
    return result;
}
```

```java
String convertToTitle(int columnNumber) {
    StringBuilder sb = new StringBuilder();
    while (columnNumber > 0) {
        columnNumber--;
        sb.append((char)('A' + columnNumber % 26));
        columnNumber /= 26;
    }
    return sb.reverse().toString();
}
```

```typescript
function convertToTitle(columnNumber: number): string {
    let result = '';
    while (columnNumber > 0) {
        columnNumber--;
        result = String.fromCharCode('A'.charCodeAt(0) + columnNumber % 26) + result;
        columnNumber = Math.floor(columnNumber / 26);
    }
    return result;
}
```

```python
def convert_to_title(column_number: int) -> str:
    result = []
    while column_number > 0:
        column_number -= 1
        result.append(chr(ord('A') + column_number % 26))
        column_number //= 26
    return ''.join(reversed(result))
```

```go
func convertToTitle(columnNumber int) string {
    result := []byte{}
    for columnNumber > 0 {
        columnNumber--
        result = append([]byte{byte('A' + columnNumber%26)}, result...)
        columnNumber /= 26
    }
    return string(result)
}
```

**Time:** O(log_{26} n) — **Space:** O(log_{26} n) for the result

---

## Dry Run

`columnNumber = 701`

| columnNumber | -1 → | % 26 | letter | / 26 |
|---|---|---|---|---|
| 701 | 700 | 700 % 26 = 24 | 'Y' | 700 / 26 = 26 |
| 26 | 25 | 25 % 26 = 25 | 'Z' | 25 / 26 = 0 |
| 0 | stop | — | — | — |

Letters collected (last to first): Y, Z → reversed: **"ZY"** ✓

---

## Reverse Problem: Column Title to Number (LC 171)

Given a column title like `"AB"`, return its column number.

This is standard base-26 with 1-indexing: `A=1, B=2, ..., Z=26`.

Process left to right: `result = result * 26 + (char - 'A' + 1)`

```cpp
int titleToNumber(string s) {
    int result = 0;
    for (char c : s)
        result = result * 26 + (c - 'A' + 1);
    return result;
}
```

```java
int titleToNumber(String s) {
    int result = 0;
    for (char c : s.toCharArray())
        result = result * 26 + (c - 'A' + 1);
    return result;
}
```

```typescript
function titleToNumber(columnTitle: string): number {
    let result = 0;
    for (const c of columnTitle)
        result = result * 26 + (c.charCodeAt(0) - 'A'.charCodeAt(0) + 1);
    return result;
}
```

```python
def title_to_number(column_title: str) -> int:
    result = 0
    for c in column_title:
        result = result * 26 + (ord(c) - ord('A') + 1)
    return result
```

```go
func titleToNumber(columnTitle string) int {
    result := 0
    for _, c := range columnTitle {
        result = result*26 + int(c-'A'+1)
    }
    return result
}
```

---

## Key Interview Insights

- **Not standard base-26:** The `columnNumber--` before the modulo is the entire insight. Without it, you get a wrong answer for multiples of 26 (e.g., 26 should be "Z" but naive `26 % 26 = 0` maps to nothing).
- **Why does `columnNumber--` work?** It shifts the bijective base-26 encoding to standard 0-indexed base-26. `26` becomes `25 % 26 = 25 = 'Z'`, `52` becomes `51 % 26 = 25 = 'Z'` with quotient 1 → 0 → 'A' → "AZ". Correct.
- **Bijective numeration:** This system is called "bijective base-k numeration" — every positive integer maps to a unique string with no "zero" digit.
- **The reverse problem (LC 171)** is simpler — just Horner's method in base 26 with 1-indexing.
- **Common mistake:** Applying `% 26` and then `/ 26` without the `--` adjustment first. Always test with 26 ("Z") and 52 ("AZ") to catch this bug.
