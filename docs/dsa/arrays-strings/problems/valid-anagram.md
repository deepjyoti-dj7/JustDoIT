---
title: Valid Anagram
difficulty: Easy
tags: [String, Hash Map, Sorting]
link: https://leetcode.com/problems/valid-anagram/
---

# Valid Anagram

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [242. Valid Anagram](https://leetcode.com/problems/valid-anagram/) |
| **Tags** | String, Hash Map, Sorting |

## Problem Statement

Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise. An anagram uses the same characters with the same frequencies.

## Intuition

Two strings are anagrams if and only if they have the **same character frequencies**. We can either sort both and compare, or count character occurrences.

## Approach 1: Sorting

Sort both strings and compare.

```cpp
class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        sort(s.begin(), s.end());
        sort(t.begin(), t.end());
        return s == t;
    }
};
```

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        char[] a = s.toCharArray(), b = t.toCharArray();
        Arrays.sort(a);
        Arrays.sort(b);
        return Arrays.equals(a, b);
    }
}
```

```typescript
function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    return [...s].sort().join('') === [...t].sort().join('');
}
```

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return sorted(s) == sorted(t)
```

```go
func isAnagram(s string, t string) bool {
    if len(s) != len(t) {
        return false
    }
    a, b := []byte(s), []byte(t)
    sort.Slice(a, func(i, j int) bool { return a[i] < a[j] })
    sort.Slice(b, func(i, j int) bool { return b[i] < b[j] })
    return string(a) == string(b)
}
```

**Time:** O(n log n) — **Space:** O(n) for sorting

## Approach 2: Character Count (Optimal)

Count characters using a fixed-size array. Increment for `s`, decrement for `t`. All counts must be zero.

```cpp
class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        int count[26] = {};
        for (int i = 0; i < s.size(); i++) {
            count[s[i] - 'a']++;
            count[t[i] - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }
};
```

```java
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }
}
```

```typescript
function isAnagram(s: string, t: string): boolean {
    if (s.length !== t.length) return false;
    const count = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++) {
        count[s.charCodeAt(i) - 97]++;
        count[t.charCodeAt(i) - 97]--;
    }
    return count.every(c => c === 0);
}
```

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        count = [0] * 26
        for a, b in zip(s, t):
            count[ord(a) - ord('a')] += 1
            count[ord(b) - ord('a')] -= 1
        return all(c == 0 for c in count)
```

```go
func isAnagram(s string, t string) bool {
    if len(s) != len(t) {
        return false
    }
    var count [26]int
    for i := 0; i < len(s); i++ {
        count[s[i]-'a']++
        count[t[i]-'a']--
    }
    for _, c := range count {
        if c != 0 {
            return false
        }
    }
    return true
}
```

**Time:** O(n) — **Space:** O(1) (fixed 26-size array)

## Key Interview Insights

- **Follow-up: What if the inputs contain Unicode?** Use a HashMap instead of a fixed-size array since you can't predict the character range.
- **Single-pass trick:** Increment for one string, decrement for the other, check all zeros. More elegant than two separate count arrays.
- **Early length check:** If lengths differ, immediately return false — saves computation.
- **Relation to Group Anagrams:** The same character-counting technique becomes the grouping key.
