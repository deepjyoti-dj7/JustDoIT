---
title: Group Anagrams
difficulty: Medium
tags: [String, Hash Map, Sorting]
link: https://leetcode.com/problems/group-anagrams/
---

# Group Anagrams

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [49. Group Anagrams](https://leetcode.com/problems/group-anagrams/) |
| **Tags** | String, Hash Map, Sorting |

## Problem Statement

Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.

## Intuition

All anagrams share the same **canonical form** — either their sorted version or their character frequency signature. Use this as a hash map key to group them.

## Approach 1: Sort Each String

Sort each string → use the sorted string as a key.

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
        for (auto& [_, group] : groups) {
            result.push_back(move(group));
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
        const key = [...s].sort().join('');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(s);
    }
    return [...groups.values()];
}
```

```python
class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = defaultdict(list)
        for s in strs:
            key = ''.join(sorted(s))
            groups[key].append(s)
        return list(groups.values())
```

```go
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

**Time:** O(n × k log k) where k = max string length — **Space:** O(n × k)

## Approach 2: Character Count Key (Optimal)

Instead of sorting each string, count character frequencies and use the count as a key. This is O(k) per string instead of O(k log k).

```cpp
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (const string& s : strs) {
            int count[26] = {};
            for (char c : s) count[c - 'a']++;
            string key;
            for (int i = 0; i < 26; i++) {
                key += '#';
                key += to_string(count[i]);
            }
            groups[key].push_back(s);
        }
        vector<vector<string>> result;
        for (auto& [_, group] : groups) {
            result.push_back(move(group));
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
            int[] count = new int[26];
            for (char c : s.toCharArray()) count[c - 'a']++;
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 26; i++) {
                sb.append('#').append(count[i]);
            }
            String key = sb.toString();
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
        const count = new Array(26).fill(0);
        for (const c of s) count[c.charCodeAt(0) - 97]++;
        const key = count.join('#');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(s);
    }
    return [...groups.values()];
}
```

```python
class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = defaultdict(list)
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
        for _, c := range s {
            count[c-'a']++
        }
        groups[count] = append(groups[count], s)
    }
    result := make([][]string, 0, len(groups))
    for _, group := range groups {
        result = append(result, group)
    }
    return result
}
```

**Time:** O(n × k) — **Space:** O(n × k)

## Key Interview Insights

- **Approach 1 is usually good enough.** The sort approach is simpler and the constant factor is small. Mention the count approach as an optimization.
- **Python trick:** `tuple(count)` is hashable and works directly as a dict key. Very clean.
- **Go trick:** Fixed-size arrays `[26]int` are comparable and work directly as map keys.
- **Key encoding matters:** For the count approach, use a delimiter like `#` between counts. Without it, `[1, 12]` and `[11, 2]` produce the same key `"112"`.
