---
title: Replace Words
difficulty: Medium
tags: [Trie, Hash Set, String, Array]
link: https://leetcode.com/problems/replace-words/
---

# Replace Words

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [648. Replace Words](https://leetcode.com/problems/replace-words/) |
| **Tags** | Trie, Hash Set, String, Array |

## Problem Statement

Given a dictionary of roots and a sentence, replace every word in the sentence that has a dictionary root as a prefix with that root. If a word has multiple roots that are prefixes, use the **shortest** root.

Return the modified sentence.

Example:
```
dictionary = ["cat", "bat", "rat"]
sentence   = "the cattle was rattled by the battery"
Output:    = "the cat was rat by the bat"
```

- "cattle" → prefix "cat" → "cat"
- "rattled" → prefix "rat" → "rat"
- "battery" → prefix "bat" → "bat"

## Intuition

For each word in the sentence, we need the **shortest dictionary word that is a prefix** of it.

**Brute force:** For each sentence word, check all dictionary roots — is root a prefix of this word? Keep the shortest one found. O(W × R × L) where W = sentence words, R = dictionary size, L = average root length.

**Trie approach:** Build a trie from the dictionary. For each sentence word, traverse the trie character by character. The first time you hit a node with `isEnd = true`, that's the shortest matching root — stop immediately. O(build: D × L, query: W × L) where D = dictionary size.

The trie approach wins because the "first `isEnd` encountered during traversal = shortest prefix" property is exactly what prefix trees are built for.

## Approach 1: Hash Set with String Checks — O(W × L²)

Split sentence, for each word check all prefix lengths 1 to word.length in the hash set.

```cpp
string replaceWords(vector<string>& dictionary, string sentence) {
    unordered_set<string> rootSet(dictionary.begin(), dictionary.end());
    istringstream iss(sentence);
    string word, result;

    while (iss >> word) {
        string replacement = word;
        for (int i = 1; i <= word.size(); i++) {
            string prefix = word.substr(0, i);
            if (rootSet.count(prefix)) { replacement = prefix; break; }
        }
        if (!result.empty()) result += ' ';
        result += replacement;
    }
    return result;
}
```

```java
class Solution {
    public String replaceWords(List<String> dictionary, String sentence) {
        Set<String> rootSet = new HashSet<>(dictionary);
        StringBuilder sb = new StringBuilder();

        for (String word : sentence.split(" ")) {
            String replacement = word;
            for (int i = 1; i <= word.length(); i++) {
                String prefix = word.substring(0, i);
                if (rootSet.contains(prefix)) { replacement = prefix; break; }
            }
            if (sb.length() > 0) sb.append(' ');
            sb.append(replacement);
        }
        return sb.toString();
    }
}
```

```typescript
function replaceWords(dictionary: string[], sentence: string): string {
    const rootSet = new Set(dictionary);
    return sentence.split(' ').map(word => {
        for (let i = 1; i <= word.length; i++) {
            const prefix = word.slice(0, i);
            if (rootSet.has(prefix)) return prefix;
        }
        return word;
    }).join(' ');
}
```

```python
class Solution:
    def replaceWords(self, dictionary: list[str], sentence: str) -> str:
        root_set = set(dictionary)
        result = []
        for word in sentence.split():
            replacement = word
            for i in range(1, len(word) + 1):
                if word[:i] in root_set:
                    replacement = word[:i]
                    break
            result.append(replacement)
        return ' '.join(result)
```

```go
func replaceWords(dictionary []string, sentence string) string {
    rootSet := map[string]bool{}
    for _, r := range dictionary { rootSet[r] = true }

    words := strings.Split(sentence, " ")
    for i, word := range words {
        for j := 1; j <= len(word); j++ {
            if rootSet[word[:j]] { words[i] = word[:j]; break }
        }
    }
    return strings.Join(words, " ")
}
```

**Time:** O(W × L²) — for each word, create O(L) substrings of total O(L²) characters
**Space:** O(D × L) for the hash set

## Approach 2: Trie — O((D + W) × L)

Build a trie from all dictionary roots. For each sentence word, traverse the trie and stop at the **first `isEnd = true`** node — that's the shortest matching root.

```cpp
class Solution {
    struct TrieNode {
        TrieNode* children[26] = {};
        bool isEnd = false;
    };

    TrieNode* root = new TrieNode();

    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            int i = c - 'a';
            if (!node->children[i]) node->children[i] = new TrieNode();
            node = node->children[i];
            if (node->isEnd) break; // prune: shorter root already covers this
        }
        node->isEnd = true;
    }

    string findRoot(const string& word) {
        TrieNode* node = root;
        for (int i = 0; i < word.size(); i++) {
            int idx = word[i] - 'a';
            if (!node->children[idx]) break;
            node = node->children[idx];
            if (node->isEnd) return word.substr(0, i + 1); // shortest root found
        }
        return word; // no root found, keep original
    }

public:
    string replaceWords(vector<string>& dictionary, string sentence) {
        for (const string& root : dictionary) insert(root);

        string result, word;
        istringstream iss(sentence);
        while (iss >> word) {
            if (!result.empty()) result += ' ';
            result += findRoot(word);
        }
        return result;
    }
};
```

```java
class Solution {
    private static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd;
    }

    private final TrieNode root = new TrieNode();

    private void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
            if (node.isEnd) return; // shorter root already covers longer ones
        }
        node.isEnd = true;
    }

    private String findRoot(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            int idx = word.charAt(i) - 'a';
            if (node.children[idx] == null) break;
            node = node.children[idx];
            if (node.isEnd) return word.substring(0, i + 1);
        }
        return word;
    }

    public String replaceWords(List<String> dictionary, String sentence) {
        for (String root : dictionary) insert(root);

        StringBuilder sb = new StringBuilder();
        for (String word : sentence.split(" ")) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(findRoot(word));
        }
        return sb.toString();
    }
}
```

```typescript
class TrieNode {
    children: (TrieNode | null)[] = new Array(26).fill(null);
    isEnd = false;
}

function replaceWords(dictionary: string[], sentence: string): string {
    const root = new TrieNode();

    const insert = (word: string): void => {
        let node = root;
        for (const c of word) {
            const i = c.charCodeAt(0) - 97;
            if (!node.children[i]) node.children[i] = new TrieNode();
            node = node.children[i]!;
            if (node.isEnd) return; // shorter root covers this
        }
        node.isEnd = true;
    };

    const findRoot = (word: string): string => {
        let node = root;
        for (let i = 0; i < word.length; i++) {
            const idx = word.charCodeAt(i) - 97;
            if (!node.children[idx]) break;
            node = node.children[idx]!;
            if (node.isEnd) return word.slice(0, i + 1);
        }
        return word;
    };

    dictionary.forEach(insert);
    return sentence.split(' ').map(findRoot).join(' ');
}
```

```python
class Solution:
    def replaceWords(self, dictionary: list[str], sentence: str) -> str:
        # Build trie
        root: dict = {}
        for word in dictionary:
            node = root
            for c in word:
                if c not in node:
                    node[c] = {}
                node = node[c]
                if '#' in node:
                    break  # shorter root already here
            node['#'] = True  # mark end

        def find_root(word: str) -> str:
            node = root
            for i, c in enumerate(word):
                if c not in node:
                    break
                node = node[c]
                if '#' in node:
                    return word[:i + 1]
            return word

        return ' '.join(find_root(word) for word in sentence.split())
```

```go
type TrieNode struct {
    children [26]*TrieNode
    isEnd    bool
}

func replaceWords(dictionary []string, sentence string) string {
    root := &TrieNode{}

    insert := func(word string) {
        node := root
        for _, c := range word {
            i := c - 'a'
            if node.children[i] == nil { node.children[i] = &TrieNode{} }
            node = node.children[i]
            if node.isEnd { return }
        }
        node.isEnd = true
    }

    findRoot := func(word string) string {
        node := root
        for i, c := range word {
            idx := c - 'a'
            if node.children[idx] == nil { break }
            node = node.children[idx]
            if node.isEnd { return word[:i+1] }
        }
        return word
    }

    for _, r := range dictionary { insert(r) }

    words := strings.Split(sentence, " ")
    for i, w := range words { words[i] = findRoot(w) }
    return strings.Join(words, " ")
}
```

**Time:** O(D × L) to build + O(W × L) to process = O((D + W) × L)
**Space:** O(D × L × 26) for the trie

## Dry Run

`dictionary = ["cat", "bat", "rat"]`, `sentence = "cattle battery rattled"`

Trie after inserts:
```
root → c → a → t*
     → b → a → t*
     → r → a → t*
```

Processing "cattle":
- c → a → t (isEnd=true!) → return "cat" (shortest root found at depth 3)

Processing "battery":
- b → a → t (isEnd=true!) → return "bat"

Processing "rattled":
- r → a → t (isEnd=true!) → return "rat"

Result: `"cat bat rat"` ✓

## Comparison

| Approach | Time | Space | Notes |
|---|---|---|---|
| Hash Set | O(W × L²) | O(D × L) | Simple, but O(L²) substring creation |
| **Trie** | **O((D+W) × L)** | O(D × L × 26) | Optimal: first isEnd = shortest root |

## Key Interview Insights

- **The trie gives "shortest prefix" for free.** As you traverse, the first `isEnd = true` is always the shortest matching root — because you're reading characters from left to right and stopping at the earliest match.
- **Optimization during insert:** If you encounter `isEnd = true` during insertion of a longer word, you can stop early — the shorter root already covers all possible sentences this word could appear in.
- **Python dict-of-dicts trick:** Using nested dicts `{}` is a clean way to build a trie without a class. Use a sentinel key like `'#'` for `isEnd`.
- **Split/join for sentence processing:** Always split by space and join by space — don't use string concatenation in a loop.
- **Edge case:** A word in the sentence that has no matching root is returned unchanged. The `break` + `return word` in `findRoot` handles this.
