---
title: Serialize and Deserialize Binary Tree
difficulty: Hard
tags: [Tree, BFS, DFS, Design, String]
link: https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
---

# Serialize and Deserialize Binary Tree

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [297. Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/) |
| **Tags** | Tree, BFS, DFS, Design, String |

## Problem Statement

Design an algorithm to **serialize** a binary tree to a string, and **deserialize** that string back to the original tree.

There are no constraints on the format — you choose how to encode it.

```
Tree:    1
        / \
       2   3
          / \
         4   5

Serialize:   "1,2,#,#,3,4,#,#,5,#,#"   (preorder with nulls)
Deserialize: Reconstruct the original tree
```

## Intuition

The key challenge: can you uniquely reconstruct a tree from just one traversal?

- **Preorder alone:** Not unique — 1,2,3 could be many shapes.
- **Preorder with null markers:** Unique! Because null markers tell you exactly where subtrees end.
- **Inorder + Preorder:** Also unique, but more complex to implement.

The cleanest approach: **preorder DFS with `#` for null nodes**.

```
Preorder of tree with #:
    1  2  #  #  3  4  #  #  5  #  #
    ↑  ↑ (leaf)  ↑  ↑ (leaf)  ↑ (leaf)
```

Reading this back left-to-right reconstructs the tree perfectly.

## Approach 1: Preorder DFS

### Serialize

Preorder traversal, write `#` for null nodes, values separated by `,`.

```cpp
class Codec {
public:
    string serialize(TreeNode* root) {
        if (!root) return "#";
        return to_string(root->val) + "," + serialize(root->left) + "," + serialize(root->right);
    }

    TreeNode* deserialize(string data) {
        queue<string> tokens;
        stringstream ss(data);
        string token;
        while (getline(ss, token, ',')) tokens.push(token);
        return build(tokens);
    }

private:
    TreeNode* build(queue<string>& tokens) {
        string val = tokens.front(); tokens.pop();
        if (val == "#") return nullptr;
        TreeNode* root = new TreeNode(stoi(val));
        root->left  = build(tokens);
        root->right = build(tokens);
        return root;
    }
};
```

```java
public class Codec {
    public String serialize(TreeNode root) {
        if (root == null) return "#";
        return root.val + "," + serialize(root.left) + "," + serialize(root.right);
    }

    public TreeNode deserialize(String data) {
        Deque<String> tokens = new ArrayDeque<>(Arrays.asList(data.split(",")));
        return build(tokens);
    }

    private TreeNode build(Deque<String> tokens) {
        String val = tokens.pollFirst();
        if (val.equals("#")) return null;
        TreeNode root = new TreeNode(Integer.parseInt(val));
        root.left  = build(tokens);
        root.right = build(tokens);
        return root;
    }
}
```

```typescript
function serialize(root: TreeNode | null): string {
    if (!root) return '#';
    return `${root.val},${serialize(root.left)},${serialize(root.right)}`;
}

function deserialize(data: string): TreeNode | null {
    const tokens = data.split(',');
    let idx = 0;

    function build(): TreeNode | null {
        const val = tokens[idx++];
        if (val === '#') return null;
        const root = new TreeNode(parseInt(val));
        root.left = build();
        root.right = build();
        return root;
    }

    return build();
}
```

```python
class Codec:
    def serialize(self, root: TreeNode | None) -> str:
        if not root:
            return '#'
        return f'{root.val},{self.serialize(root.left)},{self.serialize(root.right)}'

    def deserialize(self, data: str) -> TreeNode | None:
        tokens = iter(data.split(','))

        def build() -> TreeNode | None:
            val = next(tokens)
            if val == '#':
                return None
            node = TreeNode(int(val))
            node.left  = build()
            node.right = build()
            return node

        return build()
```

```go
type Codec struct{}

func (c *Codec) serialize(root *TreeNode) string {
    if root == nil { return "#" }
    return fmt.Sprintf("%d,%s,%s", root.Val, c.serialize(root.Left), c.serialize(root.Right))
}

func (c *Codec) deserialize(data string) *TreeNode {
    tokens := strings.Split(data, ",")
    idx := 0
    var build func() *TreeNode
    build = func() *TreeNode {
        val := tokens[idx]; idx++
        if val == "#" { return nil }
        num, _ := strconv.Atoi(val)
        root := &TreeNode{Val: num}
        root.Left  = build()
        root.Right = build()
        return root
    }
    return build()
}
```

**Time:** O(n) serialize, O(n) deserialize  
**Space:** O(n) string + O(h) call stack

## Approach 2: BFS (Level Order)

Serialize level by level. Deserialize by reconnecting children to each parent in order.

```cpp
string serialize(TreeNode* root) {
    if (!root) return "";
    queue<TreeNode*> q;
    q.push(root);
    string res = "";
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (!res.empty()) res += ",";
        if (!node) { res += "#"; continue; }
        res += to_string(node->val);
        q.push(node->left);
        q.push(node->right);
    }
    return res;
}

TreeNode* deserialize(string data) {
    if (data.empty()) return nullptr;
    vector<string> tokens;
    stringstream ss(data); string t;
    while (getline(ss, t, ',')) tokens.push_back(t);

    TreeNode* root = new TreeNode(stoi(tokens[0]));
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < tokens.size()) {
        TreeNode* node = q.front(); q.pop();
        if (tokens[i] != "#") {
            node->left = new TreeNode(stoi(tokens[i]));
            q.push(node->left);
        }
        i++;
        if (i < tokens.size() && tokens[i] != "#") {
            node->right = new TreeNode(stoi(tokens[i]));
            q.push(node->right);
        }
        i++;
    }
    return root;
}
```

```java
public String serialize(TreeNode root) {
    if (root == null) return "";
    StringBuilder sb = new StringBuilder();
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        TreeNode node = q.poll();
        if (sb.length() > 0) sb.append(",");
        if (node == null) { sb.append("#"); continue; }
        sb.append(node.val);
        q.offer(node.left);
        q.offer(node.right);
    }
    return sb.toString();
}

public TreeNode deserialize(String data) {
    if (data.isEmpty()) return null;
    String[] tokens = data.split(",");
    TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    int i = 1;
    while (!q.isEmpty() && i < tokens.length) {
        TreeNode node = q.poll();
        if (!tokens[i].equals("#")) { node.left = new TreeNode(Integer.parseInt(tokens[i])); q.offer(node.left); }
        i++;
        if (i < tokens.length && !tokens[i].equals("#")) { node.right = new TreeNode(Integer.parseInt(tokens[i])); q.offer(node.right); }
        i++;
    }
    return root;
}
```

```typescript
// BFS serialize/deserialize — same structure as Java above
```

```python
from collections import deque

class Codec:
    def serialize(self, root: TreeNode | None) -> str:
        if not root: return ''
        res, q = [], deque([root])
        while q:
            node = q.popleft()
            if node:
                res.append(str(node.val))
                q.append(node.left)
                q.append(node.right)
            else:
                res.append('#')
        return ','.join(res)

    def deserialize(self, data: str) -> TreeNode | None:
        if not data: return None
        tokens = data.split(',')
        root = TreeNode(int(tokens[0]))
        q, i = deque([root]), 1
        while q and i < len(tokens):
            node = q.popleft()
            if tokens[i] != '#':
                node.left = TreeNode(int(tokens[i]))
                q.append(node.left)
            i += 1
            if i < len(tokens) and tokens[i] != '#':
                node.right = TreeNode(int(tokens[i]))
                q.append(node.right)
            i += 1
        return root
```

```go
// BFS serialize — same pattern as Python above
```

## Approach Comparison

| | Preorder DFS | BFS Level Order |
|---|---|---|
| Serialize | Simple recursive | Queue-based |
| Deserialize | Simple recursive | Queue reconnection |
| String length | O(n) | O(n) |
| Implementation | Cleaner | More code |
| Null count | Includes interior nulls | Only leaf-adjacent nulls |

## Key Interview Insights

- **Preorder DFS is the cleanest solution.** The recursive structure mirrors the recursive tree structure.
- **The `#` sentinel for null is critical** — without null markers, you can't uniquely reconstruct the tree from preorder alone.
- **Index vs queue for deserialization:** TypeScript/Python closures make index tracking natural. Java/C++ benefit from passing a `Deque` or `Iterator` to consume tokens in order.
- **Delimiter choice:** Use `,` between values. Don't encode the length of the string — just split on `,`.
- **This is a "design" problem** — the interviewer may ask you to justify your format choice. Always explain why null markers are needed.
- **Real-world use:** This is literally how databases and distributed systems serialize tree data (JSON, XML, Protocol Buffers all use similar sentinel concepts).
