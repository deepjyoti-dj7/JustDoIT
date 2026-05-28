---
title: Trie (Prefix Tree)
description: Complete guide to the Trie data structure — node design, core operations, complexity, and interview patterns
---

# Trie (Prefix Tree)

A **trie** (pronounced "try," from re**trie**val) is a tree where each node represents a single character and each root-to-node path represents a prefix. Every path that ends at a marked node spells out a complete word.

It's the data structure behind autocomplete, spell-checkers, IP routing tables, and prefix-based search — anywhere you need fast prefix lookups over a dictionary of strings.

## The Core Idea

A hash map or set can tell you if a full word exists in O(1). But a trie can tell you if any word with a given **prefix** exists in O(m) where m is the prefix length — regardless of dictionary size. That's the key advantage.

```
Dictionary: ["cat", "car", "card", "care", "dog"]

Trie:
         (root)
        /       \
       c         d
       |         |
       a         o
      / \        |
     t   r       g*
    *   / \
       d   e
       *   *
(* = isEnd marker — a complete word ends here)
```

Every node on the path to `"care"` is visited in O(4) time. Searching the whole dictionary for words starting with `"car"` takes O(3) — just reach the `r` node and check if it has any descendants.

## Node Structure

Two common implementations for children storage:

**Array of 26** (for lowercase a–z): O(1) access, O(26) space per node. Best for fixed alphabets.

**Hash Map**: O(1) average access, space proportional to actual children. Best for large/varied alphabets.

```cpp
// Array-based (fixed lowercase alphabet)
struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};

// HashMap-based (flexible)
struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};
```

```java
// Array-based
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEnd = false;
}

// HashMap-based
class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEnd = false;
}
```

```typescript
// Array-based
class TrieNode {
    children: (TrieNode | null)[] = new Array(26).fill(null);
    isEnd: boolean = false;
}

// HashMap-based
class TrieNode {
    children: Map<string, TrieNode> = new Map();
    isEnd: boolean = false;
}
```

```python
# Using a class
class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end: bool = False

# Compact: using defaultdict trick
from collections import defaultdict
TrieNode = lambda: defaultdict(TrieNode)
# (mark end with a sentinel key like '#')
```

```go
type TrieNode struct {
    children [26]*TrieNode // or map[rune]*TrieNode
    isEnd    bool
}
```

## Core Operations

### Insert — O(m)

Walk the word character by character. At each step, create a child node if it doesn't exist. After the last character, mark `isEnd = true`.

```cpp
void insert(TrieNode* root, const string& word) {
    TrieNode* node = root;
    for (char c : word) {
        int idx = c - 'a';
        if (!node->children[idx])
            node->children[idx] = new TrieNode();
        node = node->children[idx];
    }
    node->isEnd = true;
}
```

```java
void insert(TrieNode root, String word) {
    TrieNode node = root;
    for (char c : word.toCharArray()) {
        int idx = c - 'a';
        if (node.children[idx] == null)
            node.children[idx] = new TrieNode();
        node = node.children[idx];
    }
    node.isEnd = true;
}
```

```typescript
function insert(root: TrieNode, word: string): void {
    let node = root;
    for (const c of word) {
        const idx = c.charCodeAt(0) - 97;
        if (!node.children[idx]) node.children[idx] = new TrieNode();
        node = node.children[idx]!;
    }
    node.isEnd = true;
}
```

```python
def insert(root: TrieNode, word: str) -> None:
    node = root
    for c in word:
        if c not in node.children:
            node.children[c] = TrieNode()
        node = node.children[c]
    node.is_end = True
```

```go
func (t *TrieNode) Insert(word string) {
    node := t
    for _, c := range word {
        idx := c - 'a'
        if node.children[idx] == nil {
            node.children[idx] = &TrieNode{}
        }
        node = node.children[idx]
    }
    node.isEnd = true
}
```

### Search — O(m)

Walk the characters. If any child is missing, the word doesn't exist. After all characters, check `isEnd` — a node exists for prefixes too, but `isEnd` confirms a complete word.

```cpp
bool search(TrieNode* root, const string& word) {
    TrieNode* node = root;
    for (char c : word) {
        int idx = c - 'a';
        if (!node->children[idx]) return false;
        node = node->children[idx];
    }
    return node->isEnd;
}
```

```java
boolean search(TrieNode root, String word) {
    TrieNode node = root;
    for (char c : word.toCharArray()) {
        int idx = c - 'a';
        if (node.children[idx] == null) return false;
        node = node.children[idx];
    }
    return node.isEnd;
}
```

```typescript
function search(root: TrieNode, word: string): boolean {
    let node = root;
    for (const c of word) {
        const idx = c.charCodeAt(0) - 97;
        if (!node.children[idx]) return false;
        node = node.children[idx]!;
    }
    return node.isEnd;
}
```

```python
def search(root: TrieNode, word: str) -> bool:
    node = root
    for c in word:
        if c not in node.children:
            return False
        node = node.children[c]
    return node.is_end
```

```go
func (t *TrieNode) Search(word string) bool {
    node := t
    for _, c := range word {
        idx := c - 'a'
        if node.children[idx] == nil { return false }
        node = node.children[idx]
    }
    return node.isEnd
}
```

### StartsWith (Prefix Check) — O(m)

Identical to search, but returns `true` as long as the path exists — no `isEnd` check needed.

```cpp
bool startsWith(TrieNode* root, const string& prefix) {
    TrieNode* node = root;
    for (char c : prefix) {
        int idx = c - 'a';
        if (!node->children[idx]) return false;
        node = node->children[idx];
    }
    return true; // no isEnd check
}
```

```java
boolean startsWith(TrieNode root, String prefix) {
    TrieNode node = root;
    for (char c : prefix.toCharArray()) {
        int idx = c - 'a';
        if (node.children[idx] == null) return false;
        node = node.children[idx];
    }
    return true;
}
```

```typescript
function startsWith(root: TrieNode, prefix: string): boolean {
    let node = root;
    for (const c of prefix) {
        const idx = c.charCodeAt(0) - 97;
        if (!node.children[idx]) return false;
        node = node.children[idx]!;
    }
    return true;
}
```

```python
def starts_with(root: TrieNode, prefix: str) -> bool:
    node = root
    for c in prefix:
        if c not in node.children:
            return False
        node = node.children[c]
    return True
```

```go
func (t *TrieNode) StartsWith(prefix string) bool {
    node := t
    for _, c := range prefix {
        idx := c - 'a'
        if node.children[idx] == nil { return false }
        node = node.children[idx]
    }
    return true
}
```

## Complexity

| Operation | Time | Space |
|---|---|---|
| Insert | O(m) | O(m) new nodes |
| Search | O(m) | O(1) |
| StartsWith | O(m) | O(1) |
| Build trie of n words avg length m | O(n × m) | O(n × m × alphabet_size) |

where m = length of word/prefix.

**Space note:** Worst case (no shared prefixes) is O(n × m × 26) for array-based. With a hash map, space is O(n × m) — proportional to total characters inserted.

## When to Use a Trie

Use a trie when the problem involves:

| Signal | Example |
|---|---|
| Prefix queries on a dictionary | "Find all words starting with 'un'" |
| Multiple string searches | "Is any word in this list a prefix of another?" |
| Autocomplete / type-ahead | Suggest completions as user types |
| Word insertion + search + prefix | LC 208 (Implement Trie) |
| Wildcard matching in a dictionary | LC 211 (`.` matches any character) |
| Finding the shortest prefix | LC 648 (Replace Words) |
| XOR maximization | LC 421 (binary digits as trie path) |

**Don't use when:** You need exact string lookup only (use a hash set). You need sorted order (use a sorted array or BST). The alphabet is very large with few words (hash map suffices).

## Identification Patterns

Look for these clues in problem descriptions:

- "Given a list of words" + any prefix/search query
- "Find all words that start with..."
- "Check if a prefix exists"
- "Match a pattern with wildcards"
- "Find the longest/shortest common prefix"
- Multiple queries over the same word set (build once, query many)

## Trie vs Hash Set vs Sorted Array

| | Trie | Hash Set | Sorted Array |
|---|---|---|---|
| Exact lookup | O(m) | O(m) avg | O(m log n) |
| Prefix lookup | **O(m)** | O(n × m) scan | O(m log n) |
| All words with prefix | O(m + output) | O(n × m) | O(m log n + output) |
| Space | O(n × m × Σ) | O(n × m) | O(n × m) |

The trie shines specifically for prefix queries on large dictionaries.

## Common Pitfalls

- **`isEnd` vs node existence.** A node existing at position `i` only means some word has the characters up to position `i` as a prefix. Only `isEnd = true` means a complete word ends there. Confusing these breaks search.
- **Not initializing children.** In C++, `TrieNode* children[26] = {}` zero-initializes (all nullptrs). Without `= {}`, you get garbage pointers.
- **Array index math.** `c - 'a'` assumes lowercase only. For uppercase, use `c - 'A'`. For mixed or arbitrary characters, use a hash map.
- **Memory leaks in C++.** Each `new TrieNode()` needs to be deleted. In interviews, this is usually waived, but mention it.
- **Modifying trie during traversal.** If you delete words while searching (e.g., to avoid duplicates), be careful not to break paths shared by other words.

## Delete Operation

Delete is rarely asked but worth understanding. You can't just clear `isEnd` and remove nodes — a node may be shared by other words.

```
words: ["car", "card"]
trie:  root → c → a → r* → d*
             (r is shared)

To delete "car": clear isEnd on r.
To delete "card": clear isEnd on d. If d has no children, remove it.
Check if parent (r) has no remaining children and isEnd=false → remove r too.
Etc.
```

In practice: use reference counting or recursive cleanup.

## Template

The standard trie class template used across most problems:

```cpp
struct TrieNode {
    TrieNode* children[26] = {};
    bool isEnd = false;
};

class Trie {
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
    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int i = c - 'a';
            if (!node->children[i]) node->children[i] = new TrieNode();
            node = node->children[i];
        }
        node->isEnd = true;
    }

    bool search(const string& word) {
        TrieNode* node = traverse(word);
        return node && node->isEnd;
    }

    bool startsWith(const string& prefix) {
        return traverse(prefix) != nullptr;
    }
};
```

```java
class Trie {
    private TrieNode root = new TrieNode();

    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

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

    def _traverse(self, s: str) -> TrieNode | None:
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

    def starts_with(self, prefix: str) -> bool:
        return self._traverse(prefix) is not None
```

```go
type TrieNode struct {
    children [26]*TrieNode
    isEnd    bool
}

type Trie struct{ root *TrieNode }

func NewTrie() Trie { return Trie{root: &TrieNode{}} }

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
