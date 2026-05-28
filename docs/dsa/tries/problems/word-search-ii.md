---
title: Word Search II
difficulty: Hard
tags: [Trie, Backtracking, DFS, Matrix, String]
link: https://leetcode.com/problems/word-search-ii/
---

# Word Search II

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [212. Word Search II](https://leetcode.com/problems/word-search-ii/) |
| **Tags** | Trie, Backtracking, DFS, Matrix, String |

## Problem Statement

Given an `m × n` board of characters and a list of strings `words`, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically adjacent). The same cell may not be used more than once in a word.

Example:
```
Board:
o a a n
e t a e
i h k r
i f l v

words = ["oath","pea","eat","rain"]
Output: ["eat","oath"]
```

## Intuition

### Why Not Search One Word at a Time?

For a single word of length L on an M×N board, DFS from each cell takes O(M × N × 4^L). With W words, brute force is O(W × M × N × 4^L). For W=1000 words, L=10, this is astronomically slow.

### The Trie Insight

Build a trie of all target words. Then DFS from each cell **once** — navigating the trie simultaneously. At each cell, you only continue if the current character exists in the trie as a child of the current trie node. This prunes entire subtrees instantly.

Instead of asking "does word W start here?" W times, we ask once: "does any target word start here?" — and the trie answers efficiently.

```
DFS from cell 'e':
- e is a child of root (eat, ...) → continue
- 'e' node has child 'a' → try adjacent 'a' cells
- 'a' node has child 't' → try adjacent 't' cells
- 't' node has isEnd=true → found "eat"!
```

### Key Optimizations

1. **Remove found words from the trie** — once found, clear `isEnd` (and optionally prune empty nodes). Prevents re-finding the same word and enables pruning of dead branches.
2. **Mark visited cells** in-place — overwrite with `'#'` during DFS, restore on backtrack. Avoids extra `visited` array.
3. **Prune empty trie nodes** — after removing a found word, if a node has no children and no `isEnd`, remove it from its parent. This aggressively prunes the trie during search.

## Approach 1: Brute Force (DFS per word) — O(W × N × M × 4^L)

Search the grid for each word independently using standard backtracking DFS.

```cpp
bool dfsWord(vector<vector<char>>& board, const string& word, int r, int c, int idx) {
    if (idx == word.size()) return true;
    if (r < 0 || r >= board.size() || c < 0 || c >= board[0].size()) return false;
    if (board[r][c] != word[idx]) return false;
    char tmp = board[r][c]; board[r][c] = '#'; // mark visited
    bool found = dfsWord(board, word, r+1, c, idx+1) ||
                 dfsWord(board, word, r-1, c, idx+1) ||
                 dfsWord(board, word, r, c+1, idx+1) ||
                 dfsWord(board, word, r, c-1, idx+1);
    board[r][c] = tmp; // restore
    return found;
}

vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
    vector<string> result;
    int m = board.size(), n = board[0].size();
    for (const string& word : words)
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++)
                if (dfsWord(board, word, r, c, 0)) { result.push_back(word); break; }
    return result;
}
```

```java
class Solution {
    public List<String> findWords(char[][] board, String[] words) {
        List<String> result = new ArrayList<>();
        int m = board.length, n = board[0].length;
        for (String word : words)
            outer:
            for (int r = 0; r < m; r++)
                for (int c = 0; c < n; c++)
                    if (dfs(board, word, r, c, 0)) { result.add(word); break outer; }
        return result;
    }

    boolean dfs(char[][] board, String word, int r, int c, int idx) {
        if (idx == word.length()) return true;
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return false;
        if (board[r][c] != word.charAt(idx)) return false;
        char tmp = board[r][c]; board[r][c] = '#';
        boolean found = dfs(board, word, r+1, c, idx+1) || dfs(board, word, r-1, c, idx+1) ||
                        dfs(board, word, r, c+1, idx+1) || dfs(board, word, r, c-1, idx+1);
        board[r][c] = tmp;
        return found;
    }
}
```

```typescript
function findWords(board: string[][], words: string[]): string[] {
    const m = board.length, n = board[0].length;
    const dfs = (word: string, r: number, c: number, idx: number): boolean => {
        if (idx === word.length) return true;
        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;
        const tmp = board[r][c]; board[r][c] = '#';
        const found = dfs(word,r+1,c,idx+1)||dfs(word,r-1,c,idx+1)||
                      dfs(word,r,c+1,idx+1)||dfs(word,r,c-1,idx+1);
        board[r][c] = tmp;
        return found;
    };
    return words.filter(word => {
        for (let r = 0; r < m; r++)
            for (let c = 0; c < n; c++)
                if (dfs(word, r, c, 0)) return true;
        return false;
    });
}
```

```python
class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        m, n = len(board), len(board[0])
        result = []

        def dfs(word, r, c, idx):
            if idx == len(word): return True
            if r < 0 or r >= m or c < 0 or c >= n: return False
            if board[r][c] != word[idx]: return False
            tmp, board[r][c] = board[r][c], '#'
            found = dfs(word,r+1,c,idx+1) or dfs(word,r-1,c,idx+1) or \
                    dfs(word,r,c+1,idx+1) or dfs(word,r,c-1,idx+1)
            board[r][c] = tmp
            return found

        for word in words:
            if any(dfs(word, r, c, 0) for r in range(m) for c in range(n)):
                result.append(word)
        return result
```

```go
func findWords(board [][]byte, words []string) []string {
    m, n := len(board), len(board[0])
    var dfs func(word string, r, c, idx int) bool
    dfs = func(word string, r, c, idx int) bool {
        if idx == len(word) { return true }
        if r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word[idx] { return false }
        tmp := board[r][c]; board[r][c] = '#'
        found := dfs(word,r+1,c,idx+1)||dfs(word,r-1,c,idx+1)||
                 dfs(word,r,c+1,idx+1)||dfs(word,r,c-1,idx+1)
        board[r][c] = tmp
        return found
    }
    result := []string{}
    for _, word := range words {
        for r := 0; r < m; r++ {
            for c := 0; c < n; c++ {
                if dfs(word, r, c, 0) { result = append(result, word); goto next }
            }
        }
        next:
    }
    return result
}
```

**Time:** O(W × M × N × 4^L) — **Space:** O(L) for recursion depth

## Approach 2: Trie + DFS — O(M × N × 4^L + build trie)

Build a trie of all words. DFS from each cell simultaneously navigating the trie. Found words are removed to avoid duplicates and prune the trie.

```cpp
class Solution {
    struct TrieNode {
        TrieNode* children[26] = {};
        string word; // store full word at leaf, empty otherwise
    };

    TrieNode* buildTrie(vector<string>& words) {
        TrieNode* root = new TrieNode();
        for (const string& w : words) {
            TrieNode* node = root;
            for (char c : w) {
                int i = c - 'a';
                if (!node->children[i]) node->children[i] = new TrieNode();
                node = node->children[i];
            }
            node->word = w; // store word at the end node
        }
        return root;
    }

    void dfs(vector<vector<char>>& board, int r, int c, TrieNode* node, vector<string>& res) {
        int m = board.size(), n = board[0].size();
        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] == '#') return;

        char ch = board[r][c];
        int i = ch - 'a';
        if (!node->children[i]) return; // not a valid trie path
        TrieNode* next = node->children[i];

        if (!next->word.empty()) {
            res.push_back(next->word);
            next->word = ""; // mark as found to avoid duplicates
        }

        board[r][c] = '#'; // mark visited
        dfs(board, r+1, c, next, res);
        dfs(board, r-1, c, next, res);
        dfs(board, r, c+1, next, res);
        dfs(board, r, c-1, next, res);
        board[r][c] = ch; // restore
    }

public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        TrieNode* root = buildTrie(words);
        vector<string> result;
        for (int r = 0; r < board.size(); r++)
            for (int c = 0; c < board[0].size(); c++)
                dfs(board, r, c, root, result);
        return result;
    }
};
```

```java
class Solution {
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        String word; // non-null when a word ends here
    }

    public List<String> findWords(char[][] board, String[] words) {
        TrieNode root = new TrieNode();
        for (String w : words) {
            TrieNode node = root;
            for (char c : w.toCharArray()) {
                int i = c - 'a';
                if (node.children[i] == null) node.children[i] = new TrieNode();
                node = node.children[i];
            }
            node.word = w;
        }

        List<String> result = new ArrayList<>();
        for (int r = 0; r < board.length; r++)
            for (int c = 0; c < board[0].length; c++)
                dfs(board, r, c, root, result);
        return result;
    }

    void dfs(char[][] board, int r, int c, TrieNode node, List<String> result) {
        if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
        char ch = board[r][c];
        if (ch == '#') return; // visited
        int i = ch - 'a';
        if (node.children[i] == null) return; // not in trie
        TrieNode next = node.children[i];

        if (next.word != null) {
            result.add(next.word);
            next.word = null; // avoid re-adding
        }

        board[r][c] = '#'; // mark visited
        dfs(board, r+1, c, next, result);
        dfs(board, r-1, c, next, result);
        dfs(board, r, c+1, next, result);
        dfs(board, r, c-1, next, result);
        board[r][c] = ch; // restore
    }
}
```

```typescript
class TrieNode {
    children: (TrieNode | null)[] = new Array(26).fill(null);
    word: string | null = null;
}

function findWords(board: string[][], words: string[]): string[] {
    const root = new TrieNode();
    for (const w of words) {
        let node = root;
        for (const c of w) {
            const i = c.charCodeAt(0) - 97;
            if (!node.children[i]) node.children[i] = new TrieNode();
            node = node.children[i]!;
        }
        node.word = w;
    }

    const m = board.length, n = board[0].length;
    const result: string[] = [];

    const dfs = (r: number, c: number, node: TrieNode): void => {
        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] === '#') return;
        const ch = board[r][c];
        const i = ch.charCodeAt(0) - 97;
        if (!node.children[i]) return;
        const next = node.children[i]!;

        if (next.word) { result.push(next.word); next.word = null; }

        board[r][c] = '#';
        dfs(r+1, c, next); dfs(r-1, c, next);
        dfs(r, c+1, next); dfs(r, c-1, next);
        board[r][c] = ch;
    };

    for (let r = 0; r < m; r++)
        for (let c = 0; c < n; c++)
            dfs(r, c, root);

    return result;
}
```

```python
class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        # Build trie using nested dicts
        root: dict = {}
        for word in words:
            node = root
            for c in word:
                node = node.setdefault(c, {})
            node['#'] = word  # store word at end node

        m, n = len(board), len(board[0])
        result = []

        def dfs(r: int, c: int, node: dict) -> None:
            if r < 0 or r >= m or c < 0 or c >= n:
                return
            ch = board[r][c]
            if ch == '#' or ch not in node:
                return
            next_node = node[ch]

            if '#' in next_node:
                result.append(next_node['#'])
                del next_node['#']  # avoid re-finding

            board[r][c] = '#'  # mark visited
            dfs(r+1, c, next_node)
            dfs(r-1, c, next_node)
            dfs(r, c+1, next_node)
            dfs(r, c-1, next_node)
            board[r][c] = ch   # restore

        for r in range(m):
            for c in range(n):
                dfs(r, c, root)

        return result
```

```go
type TrieNode struct {
    children [26]*TrieNode
    word     string
}

func findWords(board [][]byte, words []string) []string {
    root := &TrieNode{}
    for _, w := range words {
        node := root
        for _, c := range w {
            i := c - 'a'
            if node.children[i] == nil { node.children[i] = &TrieNode{} }
            node = node.children[i]
        }
        node.word = w
    }

    m, n := len(board), len(board[0])
    result := []string{}

    var dfs func(r, c int, node *TrieNode)
    dfs = func(r, c int, node *TrieNode) {
        if r < 0 || r >= m || c < 0 || c >= n || board[r][c] == '#' { return }
        ch := board[r][c]
        i := ch - 'a'
        if node.children[i] == nil { return }
        next := node.children[i]

        if next.word != "" { result = append(result, next.word); next.word = "" }

        board[r][c] = '#'
        dfs(r+1, c, next); dfs(r-1, c, next)
        dfs(r, c+1, next); dfs(r, c-1, next)
        board[r][c] = ch
    }

    for r := 0; r < m; r++ {
        for c := 0; c < n; c++ { dfs(r, c, root) }
    }
    return result
}
```

**Time:** O(M × N × 4^L + W × L) — M×N cells, each starting a DFS of depth L with 4 branches, plus trie build
**Space:** O(W × L) for trie + O(L) for recursion stack

## Complexity Comparison

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute Force | O(W × M × N × 4^L) | O(L) | Slow for many words |
| **Trie + DFS** | **O(M × N × 4^L + W × L)** | O(W × L) | One pass over grid |

## Key Interview Insights

- **Store the word string in the trie leaf node** (not just `isEnd`). This avoids reconstructing the word from the DFS path.
- **Null out `word` after finding** to prevent the same word from being added to results multiple times (a word can appear multiple times on the board).
- **In-place visited marking** (`board[r][c] = '#'`) is cleaner than a separate `visited` array — just restore on backtrack.
- **Trie pruning (optional but impressive):** After clearing a word from a leaf node, if that node has no children, remove it from its parent. This shrinks the trie during search, providing progressively better pruning.
- **Why 4 directions, not 8?** The problem specifies horizontally/vertically adjacent only.
- **Real-world analog:** This is how word games (Boggle) and search engines index text in grids. The trie gives a 100x speedup over naive approaches for large word lists.
