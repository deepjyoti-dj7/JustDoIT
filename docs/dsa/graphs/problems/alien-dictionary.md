---
title: Alien Dictionary
difficulty: Hard
tags: [Graph, Topological Sort, BFS, DFS, String]
link: https://leetcode.com/problems/alien-dictionary/
---

# Alien Dictionary

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [269. Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) |
| **Tags** | Graph, Topological Sort, BFS, DFS, String |

## Problem Statement

Given a sorted list of words in an alien language, determine the character ordering of that language. Return any valid ordering. Return `""` if invalid.

## Intuition

Build a **character ordering graph** from adjacent word comparisons. For each consecutive pair of words, find the first differing character — this gives a directed edge `a → b` (a comes before b in the alien alphabet). Then perform **topological sort** on this character DAG.

**Edge cases:**
- If word B is a prefix of word A AND B comes after A in the list → invalid (e.g., `["abc", "ab"]`)
- If there's a cycle in the character graph → invalid
- Characters that appear in words but have no ordering constraint are still valid (include them freely)

## Approach: Kahn's BFS Topological Sort

```cpp
class Solution {
public:
    string alienOrder(vector<string>& words) {
        // Collect all unique chars
        unordered_map<char, unordered_set<char>> adj;
        unordered_map<char, int> indegree;
        for (auto& w : words) for (char c : w) { adj[c]; indegree[c] = indegree.count(c) ? indegree[c] : 0; }

        // Build edges from adjacent word comparisons
        for (int i = 0; i + 1 < words.size(); i++) {
            string& w1 = words[i], &w2 = words[i+1];
            int minLen = min(w1.size(), w2.size());
            bool found = false;
            for (int j = 0; j < minLen; j++) {
                if (w1[j] != w2[j]) {
                    if (!adj[w1[j]].count(w2[j])) {
                        adj[w1[j]].insert(w2[j]);
                        indegree[w2[j]]++;
                    }
                    found = true; break;
                }
            }
            if (!found && w1.size() > w2.size()) return "";  // prefix violation
        }

        queue<char> q;
        for (auto& [c, deg] : indegree) if (deg == 0) q.push(c);
        string result;
        while (!q.empty()) {
            char c = q.front(); q.pop();
            result += c;
            for (char next : adj[c]) if (--indegree[next] == 0) q.push(next);
        }
        return result.size() == indegree.size() ? result : "";
    }
};
```

```java
class Solution {
    public String alienOrder(String[] words) {
        Map<Character, Set<Character>> adj = new HashMap<>();
        Map<Character, Integer> indegree = new HashMap<>();
        for (String w : words) for (char c : w.toCharArray()) { adj.putIfAbsent(c, new HashSet<>()); indegree.putIfAbsent(c, 0); }

        for (int i = 0; i + 1 < words.length; i++) {
            String w1 = words[i], w2 = words[i+1];
            boolean found = false;
            for (int j = 0; j < Math.min(w1.length(), w2.length()); j++) {
                if (w1.charAt(j) != w2.charAt(j)) {
                    char a = w1.charAt(j), b = w2.charAt(j);
                    if (!adj.get(a).contains(b)) { adj.get(a).add(b); indegree.merge(b, 1, Integer::sum); }
                    found = true; break;
                }
            }
            if (!found && w1.length() > w2.length()) return "";
        }

        Queue<Character> q = new LinkedList<>();
        for (char c : indegree.keySet()) if (indegree.get(c) == 0) q.offer(c);
        StringBuilder result = new StringBuilder();
        while (!q.isEmpty()) {
            char c = q.poll(); result.append(c);
            for (char next : adj.get(c)) if (indegree.merge(next, -1, Integer::sum) == 0) q.offer(next);
        }
        return result.length() == indegree.size() ? result.toString() : "";
    }
}
```

```typescript
function alienOrder(words: string[]): string {
    const adj = new Map<string, Set<string>>();
    const indegree = new Map<string, number>();
    for (const w of words) for (const c of w) { if (!adj.has(c)) adj.set(c, new Set()); indegree.set(c, indegree.get(c) ?? 0); }

    for (let i = 0; i + 1 < words.length; i++) {
        const [w1, w2] = [words[i], words[i+1]];
        let found = false;
        for (let j = 0; j < Math.min(w1.length, w2.length); j++) {
            if (w1[j] !== w2[j]) {
                if (!adj.get(w1[j])!.has(w2[j])) {
                    adj.get(w1[j])!.add(w2[j]);
                    indegree.set(w2[j], (indegree.get(w2[j]) ?? 0) + 1);
                }
                found = true; break;
            }
        }
        if (!found && w1.length > w2.length) return "";
    }

    const q: string[] = [];
    for (const [c, deg] of indegree) if (deg === 0) q.push(c);
    let result = '', head = 0;
    while (head < q.length) {
        const c = q[head++]; result += c;
        for (const next of adj.get(c)!) {
            const newDeg = (indegree.get(next) ?? 0) - 1;
            indegree.set(next, newDeg);
            if (newDeg === 0) q.push(next);
        }
    }
    return result.length === indegree.size ? result : "";
}
```

```python
from collections import defaultdict, deque

class Solution:
    def alienOrder(self, words: list[str]) -> str:
        # Initialize all characters
        adj: dict[str, set[str]] = {c: set() for w in words for c in w}
        indegree: dict[str, int] = {c: 0 for w in words for c in w}

        # Build ordering edges from adjacent word pairs
        for i in range(len(words) - 1):
            w1, w2 = words[i], words[i+1]
            min_len = min(len(w1), len(w2))
            found = False
            for j in range(min_len):
                if w1[j] != w2[j]:
                    if w2[j] not in adj[w1[j]]:  # avoid duplicate edges
                        adj[w1[j]].add(w2[j])
                        indegree[w2[j]] += 1
                    found = True
                    break
            if not found and len(w1) > len(w2):
                return ""  # prefix violation: "abc" before "ab" is invalid

        # Kahn's BFS topological sort
        q = deque(c for c in indegree if indegree[c] == 0)
        result = []
        while q:
            c = q.popleft()
            result.append(c)
            for nxt in adj[c]:
                indegree[nxt] -= 1
                if indegree[nxt] == 0:
                    q.append(nxt)

        # Cycle check: if result doesn't include all chars → cycle → invalid
        return "".join(result) if len(result) == len(indegree) else ""
```

```go
func alienOrder(words []string) string {
    adj := map[byte]map[byte]bool{}
    indegree := map[byte]int{}
    for _, w := range words { for i := 0; i < len(w); i++ { c := w[i]; if _, ok := adj[c]; !ok { adj[c] = map[byte]bool{}; indegree[c] = 0 } } }

    for i := 0; i+1 < len(words); i++ {
        w1, w2 := words[i], words[i+1]
        minLen := len(w1); if len(w2) < minLen { minLen = len(w2) }
        found := false
        for j := 0; j < minLen; j++ {
            if w1[j] != w2[j] {
                if !adj[w1[j]][w2[j]] { adj[w1[j]][w2[j]] = true; indegree[w2[j]]++ }
                found = true; break
            }
        }
        if !found && len(w1) > len(w2) { return "" }
    }

    q := []byte{}
    for c, deg := range indegree { if deg == 0 { q = append(q, c) } }
    result := []byte{}
    for len(q) > 0 {
        c := q[0]; q = q[1:]; result = append(result, c)
        for next := range adj[c] { indegree[next]--; if indegree[next] == 0 { q = append(q, next) } }
    }
    if len(result) == len(indegree) { return string(result) }
    return ""
}
```

## Dry Run

```
words = ["wrt", "wrf", "er", "ett", "rftt"]

Adjacent comparisons:
"wrt" vs "wrf": first diff at index 2 → t → f  (edge: t→f)
"wrf" vs "er":  first diff at index 0 → w → e  (edge: w→e)
"er"  vs "ett": first diff at index 1 → r → t  (edge: r→t)
"ett" vs "rftt":first diff at index 0 → e → r  (edge: e→r)

Graph: w→e, e→r, r→t, t→f
All in-degrees: w=0, e=1, r=1, t=1, f=1
Start BFS from w → process: w, e, r, t, f
Result: "wertf"
```

## Complexity

- **Time:** O(C) where C = total number of characters across all words
- **Space:** O(1) or O(26²) since there are at most 26 unique characters

## Key Interview Insights

- **Only adjacent word pairs provide ordering information.** Comparing non-adjacent words gives no direct ordering constraint.
- **Avoid duplicate edges.** If `t→f` is already in the graph, adding it again would incorrectly inflate in-degree.
- **Prefix violation is the trickiest edge case.** If `word[i]` is longer than `word[i+1]` AND all of `word[i+1]`'s characters match, it's an invalid ordering (e.g., `["abc", "ab"]`).
- **Not all chars need ordering constraints.** Some characters may appear only in one word with no ordering info — they're still valid and must be included in the result.
- **Length of result vs all characters is the cycle check.** If result has fewer chars than the total unique chars, there's a cycle.
