---
title: Word Ladder
difficulty: Hard
tags: [Graph, BFS, String, Hash Table]
link: https://leetcode.com/problems/word-ladder/
---

# Word Ladder

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [127. Word Ladder](https://leetcode.com/problems/word-ladder/) |
| **Tags** | Graph, BFS, String, Hash Table |

## Problem Statement

Given `beginWord`, `endWord`, and a `wordList`, find the length of the shortest transformation sequence from `beginWord` to `endWord`, where each intermediate word must be in `wordList` and differ by exactly one letter. Return 0 if no path exists.

## Intuition

This is an **unweighted shortest path** problem — use BFS. The "graph" is implicit: nodes = words, edges = pairs of words differing by one character.

**Key performance issue:** Naively finding neighbors requires comparing each word against all others: O(L × N²) per BFS level. For large wordlists, this is too slow.

**Pattern grouping optimization:** For each word, create patterns by replacing each character with `*` (e.g., `hot` → `*ot`, `h*t`, `ho*`). Group words by their patterns. To find neighbors of a word, look up all words in its pattern groups. This reduces neighbor lookup to O(L²) per word where L = word length.

## Approach: BFS with Pattern Grouping (Optimal)

```cpp
class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_map<string, vector<string>> patternMap;
        for (auto& w : wordList)
            for (int i = 0; i < w.size(); i++) {
                string p = w; p[i] = '*';
                patternMap[p].push_back(w);
            }

        unordered_set<string> visited = {beginWord};
        queue<string> q;
        q.push(beginWord);
        int steps = 1;

        while (!q.empty()) {
            int sz = q.size();
            while (sz--) {
                string word = q.front(); q.pop();
                if (word == endWord) return steps;
                for (int i = 0; i < word.size(); i++) {
                    string p = word; p[i] = '*';
                    for (auto& neighbor : patternMap[p]) {
                        if (!visited.count(neighbor)) {
                            visited.insert(neighbor);
                            q.push(neighbor);
                        }
                    }
                }
            }
            steps++;
        }
        return 0;
    }
};
```

```java
class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Map<String, List<String>> patternMap = new HashMap<>();
        for (String w : wordList)
            for (int i = 0; i < w.length(); i++) {
                String p = w.substring(0, i) + "*" + w.substring(i+1);
                patternMap.computeIfAbsent(p, k -> new ArrayList<>()).add(w);
            }

        Set<String> visited = new HashSet<>();
        visited.add(beginWord);
        Queue<String> q = new LinkedList<>();
        q.offer(beginWord);
        int steps = 1;

        while (!q.isEmpty()) {
            int sz = q.size();
            while (sz-- > 0) {
                String word = q.poll();
                if (word.equals(endWord)) return steps;
                for (int i = 0; i < word.length(); i++) {
                    String p = word.substring(0, i) + "*" + word.substring(i+1);
                    for (String neighbor : patternMap.getOrDefault(p, Collections.emptyList())) {
                        if (!visited.contains(neighbor)) {
                            visited.add(neighbor); q.offer(neighbor);
                        }
                    }
                }
            }
            steps++;
        }
        return 0;
    }
}
```

```typescript
function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
    const patternMap = new Map<string, string[]>();
    for (const w of wordList) {
        for (let i = 0; i < w.length; i++) {
            const p = w.slice(0,i) + '*' + w.slice(i+1);
            if (!patternMap.has(p)) patternMap.set(p, []);
            patternMap.get(p)!.push(w);
        }
    }

    const visited = new Set([beginWord]);
    const q: string[] = [beginWord];
    let steps = 1, head = 0;

    while (head < q.length) {
        const sz = q.length - head;
        for (let i = 0; i < sz; i++) {
            const word = q[head++];
            if (word === endWord) return steps;
            for (let j = 0; j < word.length; j++) {
                const p = word.slice(0,j) + '*' + word.slice(j+1);
                for (const neighbor of patternMap.get(p) ?? []) {
                    if (!visited.has(neighbor)) { visited.add(neighbor); q.push(neighbor); }
                }
            }
        }
        steps++;
    }
    return 0;
}
```

```python
from collections import defaultdict, deque

class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: list[str]) -> int:
        # Build pattern → [words] map
        pattern_map: dict[str, list[str]] = defaultdict(list)
        for w in wordList:
            for i in range(len(w)):
                pattern = w[:i] + '*' + w[i+1:]
                pattern_map[pattern].append(w)

        visited = {beginWord}
        q = deque([beginWord])
        steps = 1

        while q:
            for _ in range(len(q)):  # process level by level
                word = q.popleft()
                if word == endWord:
                    return steps
                for i in range(len(word)):
                    pattern = word[:i] + '*' + word[i+1:]
                    for neighbor in pattern_map[pattern]:
                        if neighbor not in visited:
                            visited.add(neighbor)
                            q.append(neighbor)
            steps += 1
        return 0
```

```go
func ladderLength(beginWord string, endWord string, wordList []string) int {
    patternMap := map[string][]string{}
    for _, w := range wordList {
        for i := range w {
            p := w[:i] + "*" + w[i+1:]
            patternMap[p] = append(patternMap[p], w)
        }
    }

    visited := map[string]bool{beginWord: true}
    q := []string{beginWord}
    steps := 1

    for len(q) > 0 {
        sz := len(q)
        for i := 0; i < sz; i++ {
            word := q[0]; q = q[1:]
            if word == endWord { return steps }
            for j := range word {
                p := word[:j] + "*" + word[j+1:]
                for _, neighbor := range patternMap[p] {
                    if !visited[neighbor] { visited[neighbor] = true; q = append(q, neighbor) }
                }
            }
        }
        steps++
    }
    return 0
}
```

## Dry Run

```
beginWord = "hit", endWord = "cog"
wordList = ["hot","dot","dog","lot","log","cog"]

Patterns:
"hot" → "*ot", "h*t", "ho*"
"dot" → "*ot", "d*t", "do*"
...

BFS:
Level 1: ["hit"] → steps=1
  hit patterns: "*it","h*t","hi*"
  "h*t" matches "hot" → enqueue
Level 2: ["hot"] → steps=2
  hot patterns: "*ot","h*t","ho*"
  "*ot" matches "dot","lot" → enqueue
Level 3: ["dot","lot"] → steps=3
  dot: "d*t","do*" → "*ot" already visited; "do*" → "dog"
  lot: "l*t","lo*" → "lo*" → "log"
Level 4: ["dog","log"] → steps=4
  dog: "do*","*og" → "cog"
Level 5: ["cog"] → steps=5 → return 5
```

## Complexity

- **Time:** O(M² × N) — M = word length, N = word list size. Each word creates M patterns, each pattern lookup is O(M) string operations.
- **Space:** O(M² × N) — pattern map storage

## Key Interview Insights

- **BFS guarantees shortest path** in unweighted graphs. Never use DFS for "minimum steps" problems.
- **Pattern grouping reduces O(L×N²) to O(L²×N).** This is the key optimization that takes it from TLE to passing.
- **Track visited at enqueue time, not dequeue time.** Prevents the same word from being added to the queue multiple times.
- **beginWord may not be in wordList** but is still a valid step. Only neighbors need to be in wordList.
