---
title: Implement Trie (Prefix Tree)
difficulty: Medium
tags: [Trie, Design, String, Hash Map]
link: https://leetcode.com/problems/implement-trie-prefix-tree/
---

# Implement Trie (Prefix Tree)

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/) |
| **Tags** | Trie, Design, String |

## Problem Statement

Implement a trie (prefix tree) with the following operations:

- `insert(word)` — Insert a word into the trie
- `search(word)` — Return `true` if the exact word exists
- `startsWith(prefix)` — Return `true` if any word begins with the prefix

All inputs consist of lowercase English letters only.

## Intuition

A trie stores strings by breaking them into characters. Each node represents one character position. All words sharing a common prefix share the same path from the root.

The critical distinction between `search` and `startsWith`:
- A node at position `i` exists for every word that has characters up to that position
- Only `isEnd = true` confirms a **complete word** ends there

So `search("app")` is false if only `"apple"` was inserted (node for 'p' exists, but `isEnd` is false). `startsWith("app")` is true (the path exists).

## Approach: Standard Trie with Array Children

Use a 26-slot array per node (one per lowercase letter). This gives O(1) child access at the cost of O(26) space per node.

```cpp
class Trie {
    struct TrieNode {
        TrieNode* children[26] = {};
        bool isEnd = false;
    };

    TrieNode* root = new TrieNode();

    TrieNode* traverse(const string& s) {
        TrieNode* node = root;
        for (char c : s) {
            int i = c - 'a';
            if (!node->children[i]) return nullptr;
            node = node->children[i];
        }
        return node;
    }

public:
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            int i = c - 'a';
            if (!node->children[i]) node->children[i] = new TrieNode();
            node = node->children[i];
        }
        node->isEnd = true;
    }

    bool search(string word) {
        TrieNode* node = traverse(word);
        return node != nullptr && node->isEnd;
    }

    bool startsWith(string prefix) {
        return traverse(prefix) != nullptr;
    }
};
```

```java
class Trie {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

    private final TrieNode root = new TrieNode();

    private TrieNode traverse(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) return null;
            node = node.children[i];
        }
        return node;
    }

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isEnd = true;
    }

    public boolean search(String word) {
        TrieNode node = traverse(word);
        return node != null && node.isEnd;
    }

    public boolean startsWith(String prefix) {
        return traverse(prefix) != null;
    }
}
```

```typescript
class TrieNode {
    children: (TrieNode | null)[] = new Array(26).fill(null);
    isEnd = false;
}

class Trie {
    private root = new TrieNode();

    private traverse(s: string): TrieNode | null {
        let node = this.root;
        for (const c of s) {
            const i = c.charCodeAt(0) - 97;
            if (!node.children[i]) return null;
            node = node.children[i]!;
        }
        return node;
    }

    insert(word: string): void {
        let node = this.root;
        for (const c of word) {
            const i = c.charCodeAt(0) - 97;
            if (!node.children[i]) node.children[i] = new TrieNode();
            node = node.children[i]!;
        }
        node.isEnd = true;
    }

    search(word: string): boolean {
        const node = this.traverse(word);
        return node !== null && node.isEnd;
    }

    startsWith(prefix: string): boolean {
        return this.traverse(prefix) !== null;
    }
}
```

```python
class TrieNode:
    def __init__(self):
        self.children: dict[str, 'TrieNode'] = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def _traverse(self, s: str) -> 'TrieNode | None':
        node = self.root
        for c in s:
            if c not in node.children:
                return None
            node = node.children[c]
        return node

    def insert(self, word: str) -> None:
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self._traverse(word)
        return node is not None and node.is_end

    def startsWith(self, prefix: str) -> bool:
        return self._traverse(prefix) is not None
```

```go
type TrieNode struct {
    children [26]*TrieNode
    isEnd    bool
}

type Trie struct{ root *TrieNode }

func Constructor() Trie { return Trie{root: &TrieNode{}} }

func (t *Trie) traverse(s string) *TrieNode {
    node := t.root
    for _, c := range s {
        i := c - 'a'
        if node.children[i] == nil { return nil }
        node = node.children[i]
    }
    return node
}

func (t *Trie) Insert(word string) {
    node := t.root
    for _, c := range word {
        i := c - 'a'
        if node.children[i] == nil { node.children[i] = &TrieNode{} }
        node = node.children[i]
    }
    node.isEnd = true
}

func (t *Trie) Search(word string) bool {
    node := t.traverse(word)
    return node != nil && node.isEnd
}

func (t *Trie) StartsWith(prefix string) bool {
    return t.traverse(prefix) != nil
}
```

**Time:** O(m) for each operation, where m = length of word/prefix
**Space:** O(n × m × 26) for n words of average length m

## Dry Run

Operations: `insert("apple")`, `search("apple")`, `search("app")`, `startsWith("app")`, `insert("app")`, `search("app")`

After `insert("apple")`:
```
root → a → p → p → l → e  (isEnd=true on 'e')
```

- `search("apple")` → walk a→p→p→l→e, isEnd=true → **true** ✓
- `search("app")` → walk a→p→p, isEnd=false → **false** ✓
- `startsWith("app")` → walk a→p→p, node exists → **true** ✓

After `insert("app")`:
```
root → a → p → p* → l → e*
              (isEnd=true on 'p' now too)
```

- `search("app")` → walk a→p→p, isEnd=true → **true** ✓

## Key Interview Insights

- **`isEnd` is the entire difference between search and startsWith.** A node at the last character exists for both — only `isEnd` differentiates a complete word from a prefix.
- **Array vs HashMap for children:** Array of 26 is faster (O(1) guaranteed) and simpler to code. HashMap saves space for sparse alphabets but adds overhead. In interviews, default to array for lowercase letters.
- **The `traverse` helper** avoids duplicating the walk logic between `search` and `startsWith`. Factor it out from the start.
- **Space complexity is often asked.** The trie can use O(n × m × 26) memory where n is number of words and m is average length. For a million short words this can be significant — mention it.
- **Follow-up: How would you support deletion?** You'd need to remove `isEnd`, then recursively remove nodes that have no children and no `isEnd` markers (to avoid breaking other words sharing the path).
- **Follow-up: How would you count words with a given prefix?** Store a `count` field in each node that increments on every insert passing through that node.
