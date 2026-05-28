---
title: Longest Substring Without Repeating Characters
difficulty: Medium
tags: [String, Sliding Window, Hash Map]
link: https://leetcode.com/problems/longest-substring-without-repeating-characters/
---

# Longest Substring Without Repeating Characters

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) |
| **Tags** | String, Sliding Window, Hash Map |

## Problem Statement

Given a string `s`, find the length of the **longest substring** without repeating characters.

## Intuition

This is a classic variable-size sliding window problem. Expand the window by moving `right`. When a duplicate is found, shrink from `left` until the window is valid again.

## Approach 1: Brute Force

Check all substrings, verify each has unique characters.

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        int maxLen = 0;
        for (int i = 0; i < s.size(); i++) {
            unordered_set<char> seen;
            for (int j = i; j < s.size(); j++) {
                if (seen.count(s[j])) break;
                seen.insert(s[j]);
                maxLen = max(maxLen, j - i + 1);
            }
        }
        return maxLen;
    }
};
```

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int maxLen = 0;
        for (int i = 0; i < s.length(); i++) {
            Set<Character> seen = new HashSet<>();
            for (int j = i; j < s.length(); j++) {
                if (seen.contains(s.charAt(j))) break;
                seen.add(s.charAt(j));
                maxLen = Math.max(maxLen, j - i + 1);
            }
        }
        return maxLen;
    }
}
```

```typescript
function lengthOfLongestSubstring(s: string): number {
    let maxLen = 0;
    for (let i = 0; i < s.length; i++) {
        const seen = new Set<string>();
        for (let j = i; j < s.length; j++) {
            if (seen.has(s[j])) break;
            seen.add(s[j]);
            maxLen = Math.max(maxLen, j - i + 1);
        }
    }
    return maxLen;
}
```

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        max_len = 0
        for i in range(len(s)):
            seen = set()
            for j in range(i, len(s)):
                if s[j] in seen:
                    break
                seen.add(s[j])
                max_len = max(max_len, j - i + 1)
        return max_len
```

```go
func lengthOfLongestSubstring(s string) int {
    maxLen := 0
    for i := 0; i < len(s); i++ {
        seen := map[byte]bool{}
        for j := i; j < len(s); j++ {
            if seen[s[j]] {
                break
            }
            seen[s[j]] = true
            if j-i+1 > maxLen {
                maxLen = j - i + 1
            }
        }
    }
    return maxLen
}
```

**Time:** O(n²) — **Space:** O(min(n, m)) where m = charset size

## Approach 2: Sliding Window + Set (Optimal)

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_set<char> window;
        int left = 0, maxLen = 0;

        for (int right = 0; right < s.size(); right++) {
            while (window.count(s[right])) {
                window.erase(s[left]);
                left++;
            }
            window.insert(s[right]);
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};
```

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> window = new HashSet<>();
        int left = 0, maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            while (window.contains(s.charAt(right))) {
                window.remove(s.charAt(left));
                left++;
            }
            window.add(s.charAt(right));
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}
```

```typescript
function lengthOfLongestSubstring(s: string): number {
    const window = new Set<string>();
    let left = 0, maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        while (window.has(s[right])) {
            window.delete(s[left]);
            left++;
        }
        window.add(s[right]);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        window = set()
        left = 0
        max_len = 0

        for right in range(len(s)):
            while s[right] in window:
                window.remove(s[left])
                left += 1
            window.add(s[right])
            max_len = max(max_len, right - left + 1)

        return max_len
```

```go
func lengthOfLongestSubstring(s string) int {
    window := map[byte]bool{}
    left, maxLen := 0, 0

    for right := 0; right < len(s); right++ {
        for window[s[right]] {
            delete(window, s[left])
            left++
        }
        window[s[right]] = true
        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}
```

**Time:** O(n) — **Space:** O(min(n, m))

## Approach 3: Sliding Window + Last Index Map (Optimized)

Instead of shrinking one character at a time, jump `left` directly past the duplicate's last position.

```cpp
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastIdx;
        int left = 0, maxLen = 0;

        for (int right = 0; right < s.size(); right++) {
            if (lastIdx.count(s[right]) && lastIdx[s[right]] >= left) {
                left = lastIdx[s[right]] + 1;
            }
            lastIdx[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};
```

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastIdx = new HashMap<>();
        int left = 0, maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastIdx.containsKey(c) && lastIdx.get(c) >= left) {
                left = lastIdx.get(c) + 1;
            }
            lastIdx.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}
```

```typescript
function lengthOfLongestSubstring(s: string): number {
    const lastIdx = new Map<string, number>();
    let left = 0, maxLen = 0;

    for (let right = 0; right < s.length; right++) {
        if (lastIdx.has(s[right]) && lastIdx.get(s[right])! >= left) {
            left = lastIdx.get(s[right])! + 1;
        }
        lastIdx.set(s[right], right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last_idx = {}
        left = 0
        max_len = 0

        for right in range(len(s)):
            if s[right] in last_idx and last_idx[s[right]] >= left:
                left = last_idx[s[right]] + 1
            last_idx[s[right]] = right
            max_len = max(max_len, right - left + 1)

        return max_len
```

```go
func lengthOfLongestSubstring(s string) int {
    lastIdx := map[byte]int{}
    left, maxLen := 0, 0

    for right := 0; right < len(s); right++ {
        if idx, ok := lastIdx[s[right]]; ok && idx >= left {
            left = idx + 1
        }
        lastIdx[s[right]] = right
        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}
```

**Time:** O(n) — **Space:** O(min(n, m))

## Key Interview Insights

- **The `>= left` check is critical** in approach 3. A character's stored index might be from before the current window — we must ignore it.
- **Approach 2 vs 3:** Approach 2 shrinks one step at a time (simple but potentially slower inner loop). Approach 3 jumps directly (faster but slightly more complex).
- **ASCII optimization:** Use `int[128]` instead of a hash map for O(1) lookup with no hashing overhead.
- **Empty string:** Returns 0 naturally — the loop doesn't execute.
