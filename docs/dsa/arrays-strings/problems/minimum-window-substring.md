---
title: Minimum Window Substring
difficulty: Hard
tags: [String, Sliding Window, Hash Map]
link: https://leetcode.com/problems/minimum-window-substring/
---

# Minimum Window Substring

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) |
| **Tags** | String, Sliding Window, Hash Map |

## Problem Statement

Given strings `s` and `t`, return the minimum window substring of `s` that contains all characters of `t` (including duplicates). If no such window exists, return `""`.

## Intuition

This is the canonical **variable-size sliding window** problem. Expand `right` to include characters until the window contains all of `t`. Then shrink `left` to find the smallest valid window. Track character matches using frequency maps.

## Approach: Sliding Window with Match Counter

The key optimization: instead of comparing full frequency maps at each step, maintain a `formed` counter that tracks how many **distinct characters** in `t` have the required count in the current window.

```cpp
class Solution {
public:
    string minWindow(string s, string t) {
        if (s.size() < t.size()) return "";

        unordered_map<char, int> need, have;
        for (char c : t) need[c]++;

        int required = need.size(); // distinct chars needed
        int formed = 0;             // distinct chars satisfied
        int left = 0, minLen = INT_MAX, minStart = 0;

        for (int right = 0; right < s.size(); right++) {
            have[s[right]]++;
            if (need.count(s[right]) && have[s[right]] == need[s[right]]) {
                formed++;
            }

            while (formed == required) {
                // Update answer
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minStart = left;
                }
                // Shrink from left
                have[s[left]]--;
                if (need.count(s[left]) && have[s[left]] < need[s[left]]) {
                    formed--;
                }
                left++;
            }
        }
        return minLen == INT_MAX ? "" : s.substr(minStart, minLen);
    }
};
```

```java
class Solution {
    public String minWindow(String s, String t) {
        if (s.length() < t.length()) return "";

        Map<Character, Integer> need = new HashMap<>(), have = new HashMap<>();
        for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);

        int required = need.size();
        int formed = 0;
        int left = 0, minLen = Integer.MAX_VALUE, minStart = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            have.merge(c, 1, Integer::sum);
            if (need.containsKey(c) && have.get(c).intValue() == need.get(c).intValue()) {
                formed++;
            }

            while (formed == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minStart = left;
                }
                char lc = s.charAt(left);
                have.merge(lc, -1, Integer::sum);
                if (need.containsKey(lc) && have.get(lc) < need.get(lc)) {
                    formed--;
                }
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }
}
```

```typescript
function minWindow(s: string, t: string): string {
    if (s.length < t.length) return "";

    const need = new Map<string, number>();
    const have = new Map<string, number>();
    for (const c of t) need.set(c, (need.get(c) ?? 0) + 1);

    const required = need.size;
    let formed = 0;
    let left = 0, minLen = Infinity, minStart = 0;

    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        have.set(c, (have.get(c) ?? 0) + 1);
        if (need.has(c) && have.get(c) === need.get(c)) {
            formed++;
        }

        while (formed === required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            const lc = s[left];
            have.set(lc, have.get(lc)! - 1);
            if (need.has(lc) && have.get(lc)! < need.get(lc)!) {
                formed--;
            }
            left++;
        }
    }
    return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
}
```

```python
class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if len(s) < len(t):
            return ""

        need = Counter(t)
        have = defaultdict(int)

        required = len(need)
        formed = 0
        left = 0
        min_len = float('inf')
        min_start = 0

        for right in range(len(s)):
            c = s[right]
            have[c] += 1
            if c in need and have[c] == need[c]:
                formed += 1

            while formed == required:
                if right - left + 1 < min_len:
                    min_len = right - left + 1
                    min_start = left

                lc = s[left]
                have[lc] -= 1
                if lc in need and have[lc] < need[lc]:
                    formed -= 1
                left += 1

        return "" if min_len == float('inf') else s[min_start:min_start + min_len]
```

```go
func minWindow(s string, t string) string {
    if len(s) < len(t) {
        return ""
    }

    need := map[byte]int{}
    have := map[byte]int{}
    for i := 0; i < len(t); i++ {
        need[t[i]]++
    }

    required := len(need)
    formed := 0
    left, minLen, minStart := 0, len(s)+1, 0

    for right := 0; right < len(s); right++ {
        c := s[right]
        have[c]++
        if need[c] > 0 && have[c] == need[c] {
            formed++
        }

        for formed == required {
            if right-left+1 < minLen {
                minLen = right - left + 1
                minStart = left
            }
            lc := s[left]
            have[lc]--
            if need[lc] > 0 && have[lc] < need[lc] {
                formed--
            }
            left++
        }
    }
    if minLen > len(s) {
        return ""
    }
    return s[minStart : minStart+minLen]
}
```

**Time:** O(|s| + |t|) — **Space:** O(|s| + |t|)

## Dry Run

Input: `s = "ADOBECODEBANC"`, `t = "ABC"`

`need = {A:1, B:1, C:1}`, `required = 3`

| right | char | have | formed | Shrink? | Window | minLen |
|---|---|---|---|---|---|---|
| 0 | A | A:1 | 1 | No | | |
| 3 | B | A:1,D:1,O:1,B:1 | 2 | No | | |
| 5 | C | ...C:1 | 3 | Yes → shrink | ADOBEC(0-5) | 6 |
| | shrink | A:0 | 2 | Stop | | |
| 9 | A | ...A:1 | 3 | Yes → shrink | CODEBA(3-9)→... | |
| 10 | N | | | | | |
| 12 | C | ...C:2 | 3 | Yes → shrink | ...BANC(9-12) | **4** |

Result: `"BANC"`

## Key Interview Insights

- **The `formed` counter** avoids comparing full frequency maps at each step — O(1) check instead of O(26) or O(k).
- **Use `.intValue()` for Java map comparison** — `Integer` objects with values > 127 won't compare correctly with `==`.
- **"Shortest" window pattern:** Update answer while valid, then shrink. This is the opposite of "longest" problems where you update after shrinking.
- **This is the hardest sliding window variant.** If you can solve this cleanly, you can solve any sliding window problem.
