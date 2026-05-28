---
title: Trie Applications
description: Advanced trie patterns — wildcard search, XOR trie, compressed tries, autocomplete, and word board search
---

# Trie Applications

Once you understand the basic trie, several powerful extensions unlock. This page covers the advanced patterns that appear in Medium-to-Hard interview problems.

## Pattern 1: Wildcard Search (DFS on Trie)

When a search can contain wildcards (like `.` matching any character), you can't follow a single path — you must branch. This turns prefix lookup into a DFS over the trie.

**Key idea:** At each wildcard character, recurse into **all non-null children** at that level.

```
Search "ca." in trie containing ["cat", "car", "cab", "dog"]:

At root → c → a → (wildcard '.'):
  Try t → found "cat"? isEnd=true ✓
  Try r → found "car"? isEnd=true ✓
  Try b → found "cab"? isEnd=true ✓
```

```cpp
bool searchWithWildcard(TrieNode* node, const string& word, int idx) {
    if (idx == word.size()) return node->isEnd;
    char c = word[idx];
    if (c != '.') {
        int i = c - 'a';
        return node->children[i] &&
               searchWithWildcard(node->children[i], word, idx + 1);
    }
    // Wildcard: try all children
    for (TrieNode* child : node->children)
        if (child && searchWithWildcard(child, word, idx + 1))
            return true;
    return false;
}
```

```java
boolean searchWithWildcard(TrieNode node, String word, int idx) {
    if (idx == word.length()) return node.isEnd;
    char c = word.charAt(idx);
    if (c != '.') {
        int i = c - 'a';
        return node.children[i] != null &&
               searchWithWildcard(node.children[i], word, idx + 1);
    }
    for (TrieNode child : node.children)
        if (child != null && searchWithWildcard(child, word, idx + 1))
            return true;
    return false;
}
```

```typescript
function searchWithWildcard(node: TrieNode, word: string, idx: number): boolean {
    if (idx === word.length) return node.isEnd;
    const c = word[idx];
    if (c !== '.') {
        const i = c.charCodeAt(0) - 97;
        return !!node.children[i] && searchWithWildcard(node.children[i]!, word, idx + 1);
    }
    return node.children.some(child => child && searchWithWildcard(child, word, idx + 1));
}
```

```python
def search_with_wildcard(node: TrieNode, word: str, idx: int) -> bool:
    if idx == len(word):
        return node.is_end
    c = word[idx]
    if c != '.':
        if c not in node.children:
            return False
        return search_with_wildcard(node.children[c], word, idx + 1)
    # Wildcard: try all children
    return any(
        search_with_wildcard(child, word, idx + 1)
        for child in node.children.values()
    )
```

```go
func searchWithWildcard(node *TrieNode, word string, idx int) bool {
    if idx == len(word) { return node.isEnd }
    c := rune(word[idx])
    if c != '.' {
        i := c - 'a'
        return node.children[i] != nil && searchWithWildcard(node.children[i], word, idx+1)
    }
    for _, child := range node.children {
        if child != nil && searchWithWildcard(child, word, idx+1) { return true }
    }
    return false
}
```

## Pattern 2: Trie + DFS on a Grid (Word Board Search)

For problems like "find all dictionary words in a 2D grid," the naive approach searches the grid once per word — O(W × N × M × 4^L). Building a trie of all words and doing one DFS over the grid is O(N × M × 4^L + build trie).

**Key optimizations:**
1. Build trie from all target words
2. DFS from each cell, navigate the trie simultaneously
3. When `isEnd` is hit, record the found word
4. **Remove found words from the trie** to avoid revisiting and to prune exhausted branches
5. Mark cells visited during DFS (unmark on backtrack)

```
Grid:        Trie of words ["oath","pea","eat","rain"]:
o a t h      root
e a f l        e → a → t*    o → a → t → h*
i h e s        o → a → t → h*  p → e → a*
              r → a → i → n*
DFS from 'e': e→a→t (found "eat"), e→a (continue)...
```

## Pattern 3: XOR Trie (Binary Trie)

For problems involving **maximum XOR** between numbers, store numbers bit-by-bit in a trie (from most significant to least significant bit). To maximize XOR with a query number, at each bit prefer to go in the **opposite direction** (since XOR of opposite bits = 1).

```
Number 6 = 110 in binary.
Stored in trie:
root → 1 → 1 → 0

To maximize XOR with 6 (110):
At bit 2 (=1): prefer 0 → if child[0] exists, go there (XOR bit = 1)
At bit 1 (=1): prefer 0 → if child[0] exists, go there (XOR bit = 1)
At bit 0 (=0): prefer 1 → if child[1] exists, go there (XOR bit = 1)
Maximum XOR = 111 = 7
```

```cpp
struct XorTrieNode {
    XorTrieNode* children[2] = {};
};

void insertNum(XorTrieNode* root, int num) {
    XorTrieNode* node = root;
    for (int i = 31; i >= 0; i--) {
        int bit = (num >> i) & 1;
        if (!node->children[bit]) node->children[bit] = new XorTrieNode();
        node = node->children[bit];
    }
}

int maxXorWith(XorTrieNode* root, int num) {
    XorTrieNode* node = root;
    int result = 0;
    for (int i = 31; i >= 0; i--) {
        int bit = (num >> i) & 1;
        int want = 1 - bit; // prefer opposite bit to maximize XOR
        if (node->children[want]) {
            result |= (1 << i);
            node = node->children[want];
        } else {
            node = node->children[bit];
        }
    }
    return result;
}
```

```java
class XorTrie {
    int[][] children = new int[32 * 100001][2];
    int size = 1;

    void insert(int num) {
        int node = 0;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1;
            if (children[node][bit] == 0) children[node][bit] = size++;
            node = children[node][bit];
        }
    }

    int maxXorWith(int num) {
        int node = 0, result = 0;
        for (int i = 31; i >= 0; i--) {
            int bit = (num >> i) & 1, want = 1 - bit;
            if (children[node][want] != 0) { result |= (1 << i); node = children[node][want]; }
            else { node = children[node][bit]; }
        }
        return result;
    }
}
```

```typescript
class XorTrieNode {
    children: [XorTrieNode | null, XorTrieNode | null] = [null, null];
}

function insertNum(root: XorTrieNode, num: number): void {
    let node = root;
    for (let i = 31; i >= 0; i--) {
        const bit = (num >> i) & 1;
        if (!node.children[bit]) node.children[bit] = new XorTrieNode();
        node = node.children[bit]!;
    }
}

function maxXorWith(root: XorTrieNode, num: number): number {
    let node = root, result = 0;
    for (let i = 31; i >= 0; i--) {
        const bit = (num >> i) & 1, want = 1 - bit;
        if (node.children[want]) { result |= (1 << i); node = node.children[want]!; }
        else { node = node.children[bit]!; }
    }
    return result;
}
```

```python
class XorTrieNode:
    def __init__(self):
        self.children: list['XorTrieNode | None'] = [None, None]

def insert_num(root: XorTrieNode, num: int) -> None:
    node = root
    for i in range(31, -1, -1):
        bit = (num >> i) & 1
        if not node.children[bit]:
            node.children[bit] = XorTrieNode()
        node = node.children[bit]

def max_xor_with(root: XorTrieNode, num: int) -> int:
    node, result = root, 0
    for i in range(31, -1, -1):
        bit = (num >> i) & 1
        want = 1 - bit  # prefer opposite for maximum XOR
        if node.children[want]:
            result |= (1 << i)
            node = node.children[want]
        else:
            node = node.children[bit]
    return result
```

```go
type XorTrieNode struct {
    children [2]*XorTrieNode
}

func insertNum(root *XorTrieNode, num int) {
    node := root
    for i := 31; i >= 0; i-- {
        bit := (num >> i) & 1
        if node.children[bit] == nil { node.children[bit] = &XorTrieNode{} }
        node = node.children[bit]
    }
}

func maxXorWith(root *XorTrieNode, num int) int {
    node, result := root, 0
    for i := 31; i >= 0; i-- {
        bit, want := (num>>i)&1, 1-((num>>i)&1)
        if node.children[want] != nil { result |= (1 << i); node = node.children[want] } else { node = node.children[bit] }
    }
    return result
}
```

## Pattern 4: Autocomplete (Collect All Words Under a Prefix)

After navigating to the prefix node, DFS to collect all words (`isEnd = true`) reachable from that node.

```cpp
void collect(TrieNode* node, string& current, vector<string>& results) {
    if (!node) return;
    if (node->isEnd) results.push_back(current);
    for (int i = 0; i < 26; i++) {
        if (node->children[i]) {
            current.push_back('a' + i);
            collect(node->children[i], current, results);
            current.pop_back(); // backtrack
        }
    }
}

vector<string> autocomplete(TrieNode* root, const string& prefix) {
    TrieNode* node = root;
    for (char c : prefix) {
        int i = c - 'a';
        if (!node->children[i]) return {}; // prefix not found
        node = node->children[i];
    }
    string current = prefix;
    vector<string> results;
    collect(node, current, results);
    return results;
}
```

```java
List<String> autocomplete(TrieNode root, String prefix) {
    TrieNode node = root;
    for (char c : prefix.toCharArray()) {
        int i = c - 'a';
        if (node.children[i] == null) return Collections.emptyList();
        node = node.children[i];
    }
    List<String> results = new ArrayList<>();
    collect(node, new StringBuilder(prefix), results);
    return results;
}

void collect(TrieNode node, StringBuilder current, List<String> results) {
    if (node.isEnd) results.add(current.toString());
    for (int i = 0; i < 26; i++) {
        if (node.children[i] != null) {
            current.append((char)('a' + i));
            collect(node.children[i], current, results);
            current.deleteCharAt(current.length() - 1);
        }
    }
}
```

```typescript
function autocomplete(root: TrieNode, prefix: string): string[] {
    let node = root;
    for (const c of prefix) {
        const i = c.charCodeAt(0) - 97;
        if (!node.children[i]) return [];
        node = node.children[i]!;
    }
    const results: string[] = [];
    const collect = (node: TrieNode, current: string): void => {
        if (node.isEnd) results.push(current);
        for (let i = 0; i < 26; i++)
            if (node.children[i])
                collect(node.children[i]!, current + String.fromCharCode(97 + i));
    };
    collect(node, prefix);
    return results;
}
```

```python
def autocomplete(root: TrieNode, prefix: str) -> list[str]:
    node = root
    for c in prefix:
        if c not in node.children:
            return []
        node = node.children[c]

    results: list[str] = []

    def collect(node: TrieNode, current: str) -> None:
        if node.is_end:
            results.append(current)
        for c, child in node.children.items():
            collect(child, current + c)

    collect(node, prefix)
    return results
```

```go
func autocomplete(root *TrieNode, prefix string) []string {
    node := root
    for _, c := range prefix {
        i := c - 'a'
        if node.children[i] == nil { return nil }
        node = node.children[i]
    }
    results := []string{}
    var collect func(*TrieNode, string)
    collect = func(n *TrieNode, cur string) {
        if n.isEnd { results = append(results, cur) }
        for i, child := range n.children {
            if child != nil { collect(child, cur+string(rune('a'+i))) }
        }
    }
    collect(node, prefix)
    return results
}
```

## Pattern 5: Shortest Prefix in Dictionary

Given a dictionary and a word, find the shortest dictionary word that is a prefix of the word. Insert all dictionary words into a trie, then traverse the word character by character — the first `isEnd = true` encountered is the shortest prefix match.

This is the core of LC 648 (Replace Words).

## Compressed Trie (Patricia Trie)

A regular trie wastes nodes on long chains with no branching. A **compressed trie** merges single-child chains into a single edge with a label:

```
Regular:    root → a → p → p → l → e*
Compressed: root → "apple"*
```

This reduces space from O(total characters) to O(number of words). Implemented in production systems (e.g., Linux kernel's routing tables use radix tries — a compressed binary trie).

## Interview Patterns Quick Reference

| Pattern | LC Problems | Key Technique |
|---|---|---|
| Insert + Search + Prefix | 208 | Standard trie |
| Wildcard search | 211 | DFS on trie |
| Shortest prefix replace | 648 | First isEnd during traversal |
| Multi-word grid search | 212 | Trie + backtracking DFS on grid |
| Maximum XOR | 421 | Binary trie, prefer opposite bit |
| Palindrome pairs | 336 | Trie + reversal trick |
| Word squares | 425 | Prefix enumeration via trie |
