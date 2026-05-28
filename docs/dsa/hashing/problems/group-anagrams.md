---
title: Group Anagrams
difficulty: Medium
tags: [Array, Hash Map, String, Sorting]
link: https://leetcode.com/problems/group-anagrams/
---

# Group Anagrams

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/) |
| **Tags** | Array, String, Hash Map |

## Problem Statement

Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.

Two strings are anagrams if one is a rearrangement of the other's characters.

Example: `["eat","tea","tan","ate","nat","bat"]` → `[["eat","tea","ate"],["tan","nat"],["bat"]]`

## Intuition

Anagrams have the same characters — just in different order. If we find a **canonical form** that's identical for all anagrams of a word, we can use it as a hash map key to group them.

Two canonical forms work well:
1. **Sorted string** — `"eat"` → `"aet"`, `"tea"` → `"aet"` (same key)
2. **Character count array** — `"eat"` → `[1,0,0,0,1,0,...,0,1,...]` (count of each letter)

Both produce the same grouping. The sorted string is simpler; the count array is faster (O(k) vs O(k log k) per word where k = word length).

## Approach 1: Sort Each String as Key — O(n × k log k)

```cpp
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            groups[key].push_back(s);
        }
        vector<vector<string>> result;
        for (auto& [key, group] : groups) {
            result.push_back(group);
        }
        return result;
    }
};
```

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }
}
```

```typescript
function groupAnagrams(strs: string[]): string[][] {
    const groups = new Map<string, string[]>();
    for (const s of strs) {
        const key = s.split('').sort().join('');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(s);
    }
    return Array.from(groups.values());
}
```

```python
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups: dict[str, list[str]] = defaultdict(list)
        for s in strs:
            key = ''.join(sorted(s))
            groups[key].append(s)
        return list(groups.values())
```

```go
import "sort"

func groupAnagrams(strs []string) [][]string {
    groups := map[string][]string{}
    for _, s := range strs {
        b := []byte(s)
        sort.Slice(b, func(i, j int) bool { return b[i] < b[j] })
        key := string(b)
        groups[key] = append(groups[key], s)
    }
    result := make([][]string, 0, len(groups))
    for _, group := range groups {
        result = append(result, group)
    }
    return result
}
```

**Time:** O(n × k log k) where n = number of strings, k = max string length.
**Space:** O(n × k) — storing all strings.

## Approach 2: Character Count as Key — O(n × k)

Instead of sorting, encode each string as a count of its 26 letters. This key is O(k) to compute instead of O(k log k).

```cpp
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (const string& s : strs) {
            vector<int> count(26, 0);
            for (char c : s) count[c - 'a']++;
            // Encode count vector as a string key
            string key;
            for (int i = 0; i < 26; i++) {
                key += '#' + to_string(count[i]);
            }
            groups[key].push_back(s);
        }
        vector<vector<string>> result;
        for (auto& [k, v] : groups) result.push_back(v);
        return result;
    }
};
```

```java
class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            int[] count = new int[26];
            for (char c : s.toCharArray()) count[c - 'a']++;
            StringBuilder key = new StringBuilder();
            for (int c : count) key.append('#').append(c);
            groups.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(groups.values());
    }
}
```

```typescript
function groupAnagrams(strs: string[]): string[][] {
    const groups = new Map<string, string[]>();
    for (const s of strs) {
        const count = new Array(26).fill(0);
        for (const c of s) count[c.charCodeAt(0) - 97]++;
        const key = count.join('#');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(s);
    }
    return Array.from(groups.values());
}
```

```python
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups: dict[tuple, list[str]] = defaultdict(list)
        for s in strs:
            count = [0] * 26
            for c in s:
                count[ord(c) - ord('a')] += 1
            groups[tuple(count)].append(s)
        return list(groups.values())
```

```go
func groupAnagrams(strs []string) [][]string {
    groups := map[[26]int][]string{}
    for _, s := range strs {
        var count [26]int
        for _, c := range s { count[c-'a']++ }
        groups[count] = append(groups[count], s)
    }
    result := make([][]string, 0, len(groups))
    for _, group := range groups { result = append(result, group) }
    return result
}
```

**Time:** O(n × k) — **Space:** O(n × k)

## Approach Comparison

| Approach | Time | Space | Best When |
|---|---|---|---|
| Sort as key | O(nk log k) | O(nk) | Short strings, simple to code |
| Count as key | O(nk) | O(nk) | Long strings, all lowercase letters |

For interview purposes, the **sorted key approach** is usually the right answer to give first. If asked "can you do better?" introduce the count approach.

## Dry Run

`strs = ["eat", "tea", "tan"]`

Approach 1 (sorted key):

| String | Sorted key | Group |
|---|---|---|
| "eat" | "aet" | groups["aet"] = ["eat"] |
| "tea" | "aet" | groups["aet"] = ["eat","tea"] |
| "tan" | "ant" | groups["ant"] = ["tan"] |

Result: `[["eat","tea"],["tan"]]` ✓

## Key Interview Insights

- **The canonical key is everything.** Any representation that maps all anagrams to the same value and non-anagrams to different values works. Two main choices: sorted characters or character frequency vector.
- **Python's `tuple(count)` as dict key** — tuples are hashable in Python, lists are not. This is why you can use a tuple of counts as a dictionary key but not a list.
- **Go's `[26]int` as map key** — fixed-size arrays are hashable in Go (unlike slices), making them directly usable as map keys.
- **Java's `computeIfAbsent`** — cleaner than manually checking for key existence before inserting into the value list.
- **The delimiter trick for string keys** — use a separator character (like `#`) between counts to avoid ambiguity: `[1,11]` and `[11,1]` would produce the same string `"111"` without a separator. Use `"1#11#"` and `"11#1#"`.

