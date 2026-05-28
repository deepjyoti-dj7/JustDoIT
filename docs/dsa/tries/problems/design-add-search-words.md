---
title: Design Add and Search Words Data Structure
difficulty: Medium
tags: [Trie, Design, DFS, Backtracking, String]
link: https://leetcode.com/problems/design-add-and-search-words-data-structure/
---

# Design Add and Search Words Data Structure

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [211. Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/) |
| **Tags** | Trie, DFS, Backtracking, String |

## Problem Statement

Design a data structure that supports:

- `addWord(word)` — Add a word to the data structure
- `search(word)` — Return `true` if the word matches any string in the data structure, where `.` can match any letter

Example:
```
addWord("bad"), addWord("dad"), addWord("mad")
search("pad") → false
search("bad") → true
search(".ad") → true
search("b..") → true
```

## Intuition

This is Implement Trie (LC 208) with a wildcard twist. The `addWord` operation is identical to standard trie insert. The `search` diverges only when it encounters a `.` character.

For `.`, you can't follow a single path — the dot can match *any* character. So at a `.`, you must recursively try all non-null children at that level.

This is a **DFS on the trie**: for normal characters, follow the one matching child; for `.`, branch into all children.

**Why DFS and not BFS?** We're looking for *any* valid path that reaches `isEnd` — DFS naturally short-circuits on the first success (return `true`). BFS would process more nodes unnecessarily.

## Approach: Trie + DFS

Insert words normally. For search, DFS recursively with the character index. At each step:
- If char is a letter: proceed to the matching child (or fail if it doesn't exist)
- If char is `.`: try all non-null children recursively

```cpp
class WordDictionary {
    struct TrieNode {
        TrieNode* children[26] = {};
        bool isEnd = false;
    };

    TrieNode* root = new TrieNode();

    bool dfs(TrieNode* node, const string& word, int idx) {
        if (idx == word.size()) return node->isEnd;
        char c = word[idx];
        if (c != '.') {
            int i = c - 'a';
            return node->children[i] &&
                   dfs(node->children[i], word, idx + 1);
        }
        // Wildcard: try all children
        for (TrieNode* child : node->children)
            if (child && dfs(child, word, idx + 1))
                return true;
        return false;
    }

public:
    void addWord(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int i = c - 'a';
            if (!node->children[i]) node->children[i] = new TrieNode();
            node = node->children[i];
        }
        node->isEnd = true;
    }

    bool search(string word) {
        return dfs(root, word, 0);
    }
};
```

```java
class WordDictionary {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

    private final TrieNode root = new TrieNode();

    public void addWord(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        return dfs(root, word, 0);
    }

    private boolean dfs(TrieNode node, String word, int idx) {
        if (idx == word.length()) return node.isEnd;
        char c = word.charAt(idx);
        if (c != '.') {
            int i = c - 'a';
            return node.children[i] != null && dfs(node.children[i], word, idx + 1);
        }
        for (TrieNode child : node.children)
            if (child != null && dfs(child, word, idx + 1))
                return true;
        return false;
    }
}
```

```typescript
class TrieNode {
    children: (TrieNode | null)[] = new Array(26).fill(null);
    isEnd = false;
}

class WordDictionary {
    private root = new TrieNode();

    addWord(word: string): void {
        let node = this.root;
        for (const c of word) {
            const i = c.charCodeAt(0) - 97;
            if (!node.children[i]) node.children[i] = new TrieNode();
            node = node.children[i]!;
        }
        node.isEnd = true;
    }

    search(word: string): boolean {
        return this.dfs(this.root, word, 0);
    }

    private dfs(node: TrieNode, word: string, idx: number): boolean {
        if (idx === word.length) return node.isEnd;
        const c = word[idx];
        if (c !== '.') {
            const i = c.charCodeAt(0) - 97;
            return !!node.children[i] && this.dfs(node.children[i]!, word, idx + 1);
        }
        return node.children.some(child => child && this.dfs(child, word, idx + 1));
    }
}
```

```python
class TrieNode:
    def __init__(self):
        self.children: dict[str, 'TrieNode'] = {}
        self.is_end = False

class WordDictionary:
    def __init__(self):
        self.root = TrieNode()

    def addWord(self, word: str) -> None:
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True

    def search(self, word: str) -> bool:
        return self._dfs(self.root, word, 0)

    def _dfs(self, node: TrieNode, word: str, idx: int) -> bool:
        if idx == len(word):
            return node.is_end
        c = word[idx]
        if c != '.':
            if c not in node.children:
                return False
            return self._dfs(node.children[c], word, idx + 1)
        # Wildcard: try all children
        return any(
            self._dfs(child, word, idx + 1)
            for child in node.children.values()
        )
```

```go
type TrieNode struct {
    children [26]*TrieNode
    isEnd    bool
}

type WordDictionary struct{ root *TrieNode }

func Constructor() WordDictionary { return WordDictionary{root: &TrieNode{}} }

func (wd *WordDictionary) AddWord(word string) {
    node := wd.root
    for _, c := range word {
        i := c - 'a'
        if node.children[i] == nil { node.children[i] = &TrieNode{} }
        node = node.children[i]
    }
    node.isEnd = true
}

func (wd *WordDictionary) Search(word string) bool {
    return wd.dfs(wd.root, word, 0)
}

func (wd *WordDictionary) dfs(node *TrieNode, word string, idx int) bool {
    if idx == len(word) { return node.isEnd }
    c := rune(word[idx])
    if c != '.' {
        i := c - 'a'
        return node.children[i] != nil && wd.dfs(node.children[i], word, idx+1)
    }
    for _, child := range node.children {
        if child != nil && wd.dfs(child, word, idx+1) { return true }
    }
    return false
}
```

**Time:**
- `addWord`: O(m) — m = word length
- `search`: O(m) for words without `.`. Worst case `"..."` (all dots): O(26^m × m). In practice: bounded by total nodes in trie.

**Space:** O(n × m × 26) for the trie

## Dry Run

After: `addWord("bad")`, `addWord("dad")`, `addWord("mad")`

```
Trie:
root
├── b → a → d* (bad)
├── d → a → d* (dad)
└── m → a → d* (mad)
```

`search(".ad")`:

- idx=0, char=`.` → try all children of root: `b`, `d`, `m`
  - **Branch b:** idx=1, char=`a`, go to `a` node
    - idx=2, char=`d`, go to `d` node
      - idx=3, reached end, isEnd=true → **return true** (short-circuit)

`search("b..")`:

- idx=0, char=`b` → go to `b` node
- idx=1, char=`.` → try all children of `b` node: only `a`
  - idx=2, char=`.` → try all children of `a` node: only `d`
    - idx=3, reached end, isEnd=true → **return true** ✓

`search("pad")`:

- idx=0, char=`p` → `children['p'-'a']` is null → **return false** ✓

## Key Interview Insights

- **The base case `idx == word.size()` must check `isEnd`**, not just return `true`. A node existing doesn't mean a word ends there.
- **DFS short-circuits on the first `true`.** This is critical for performance — using `any()` in Python or returning early in loops.
- **Worst case for wildcards.** A query of all dots `"....."` on a dense trie explores 26^m nodes. In interviews, mention this and note that real-world inputs are rarely all wildcards.
- **Only DFS over non-null children.** Always check `child != null` before recursing — no need to explore empty branches.
- **The `root` starts the DFS, not any other node.** The search always starts from the trie root with index 0.
- **This exact pattern** (trie DFS with wildcards) extends to regex-like matching, glob patterns, and shell autocomplete with wildcards.
