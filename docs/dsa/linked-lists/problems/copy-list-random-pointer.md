---
title: Copy List with Random Pointer
difficulty: Medium
tags: [Linked List, Hash Map]
link: https://leetcode.com/problems/copy-list-with-random-pointer/
---

# Copy List with Random Pointer

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [138. Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/) |
| **Tags** | Linked List, Hash Map |

## Problem Statement

A linked list of length n is given where each node has a `next` pointer and an additional `random` pointer. The `random` pointer can point to any node in the list or null.

Construct a **deep copy** of the list. The new list should consist of completely new nodes, with `next` and `random` pointers of the new nodes pointing to new nodes in the copied list (not the original).

## Intuition

The challenge is the `random` pointer — when copying node `A`, its `random` might point to node `B` which we haven't created yet.

**Key insight:** We need a mapping from old nodes to their new copies. Then the `random` pointer of the new node is simply `map[old_node.random]`.

## Approach 1: Hash Map (Two Passes)

**Pass 1:** Create all new nodes, store `old → new` in a map.
**Pass 2:** Set `next` and `random` pointers using the map.

```cpp
class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;

        unordered_map<Node*, Node*> oldToNew;

        // Pass 1: create all nodes
        Node* curr = head;
        while (curr) {
            oldToNew[curr] = new Node(curr->val);
            curr = curr->next;
        }

        // Pass 2: wire pointers
        curr = head;
        while (curr) {
            if (curr->next) oldToNew[curr]->next = oldToNew[curr->next];
            if (curr->random) oldToNew[curr]->random = oldToNew[curr->random];
            curr = curr->next;
        }

        return oldToNew[head];
    }
};
```

```java
class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;

        Map<Node, Node> oldToNew = new HashMap<>();

        Node curr = head;
        while (curr != null) {
            oldToNew.put(curr, new Node(curr.val));
            curr = curr.next;
        }

        curr = head;
        while (curr != null) {
            if (curr.next != null) oldToNew.get(curr).next = oldToNew.get(curr.next);
            if (curr.random != null) oldToNew.get(curr).random = oldToNew.get(curr.random);
            curr = curr.next;
        }

        return oldToNew.get(head);
    }
}
```

```typescript
function copyRandomList(head: Node | null): Node | null {
    if (!head) return null;

    const oldToNew = new Map<Node, Node>();

    let curr: Node | null = head;
    while (curr !== null) {
        oldToNew.set(curr, new Node(curr.val));
        curr = curr.next;
    }

    curr = head;
    while (curr !== null) {
        if (curr.next) oldToNew.get(curr)!.next = oldToNew.get(curr.next)!;
        if (curr.random) oldToNew.get(curr)!.random = oldToNew.get(curr.random)!;
        curr = curr.next;
    }

    return oldToNew.get(head)!;
}
```

```python
class Solution:
    def copyRandomList(self, head: Node | None) -> Node | None:
        if not head:
            return None

        old_to_new = {}

        curr = head
        while curr:
            old_to_new[curr] = Node(curr.val)
            curr = curr.next

        curr = head
        while curr:
            if curr.next:
                old_to_new[curr].next = old_to_new[curr.next]
            if curr.random:
                old_to_new[curr].random = old_to_new[curr.random]
            curr = curr.next

        return old_to_new[head]
```

```go
func copyRandomList(head *Node) *Node {
    if head == nil {
        return nil
    }

    oldToNew := map[*Node]*Node{}

    curr := head
    for curr != nil {
        oldToNew[curr] = &Node{Val: curr.Val}
        curr = curr.Next
    }

    curr = head
    for curr != nil {
        if curr.Next != nil {
            oldToNew[curr].Next = oldToNew[curr.Next]
        }
        if curr.Random != nil {
            oldToNew[curr].Random = oldToNew[curr.Random]
        }
        curr = curr.Next
    }

    return oldToNew[head]
}
```

**Time:** O(n) — **Space:** O(n)

## Approach 2: Interleaved Nodes (O(1) Space)

Instead of a hash map, temporarily interleave new nodes with old ones to encode the mapping structurally:

1. Insert copy of each node right after the original: `A → A' → B → B' → ...`
2. Set `random` pointers: `A'.random = A.random.next`
3. Separate the two lists

```cpp
class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;

        // Step 1: Interleave
        Node* curr = head;
        while (curr) {
            Node* copy = new Node(curr->val);
            copy->next = curr->next;
            curr->next = copy;
            curr = copy->next;
        }

        // Step 2: Set random pointers
        curr = head;
        while (curr) {
            if (curr->random) {
                curr->next->random = curr->random->next;
            }
            curr = curr->next->next;
        }

        // Step 3: Separate lists
        Node dummy(0);
        Node* copyCurr = &dummy;
        curr = head;
        while (curr) {
            copyCurr->next = curr->next;
            curr->next = curr->next->next;
            copyCurr = copyCurr->next;
            curr = curr->next;
        }
        return dummy.next;
    }
};
```

```java
class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) return null;

        Node curr = head;
        while (curr != null) {
            Node copy = new Node(curr.val);
            copy.next = curr.next;
            curr.next = copy;
            curr = copy.next;
        }

        curr = head;
        while (curr != null) {
            if (curr.random != null) {
                curr.next.random = curr.random.next;
            }
            curr = curr.next.next;
        }

        Node dummy = new Node(0);
        Node copyCurr = dummy;
        curr = head;
        while (curr != null) {
            copyCurr.next = curr.next;
            curr.next = curr.next.next;
            copyCurr = copyCurr.next;
            curr = curr.next;
        }
        return dummy.next;
    }
}
```

```typescript
function copyRandomList(head: Node | null): Node | null {
    if (!head) return null;

    let curr: Node | null = head;
    while (curr !== null) {
        const copy = new Node(curr.val);
        copy.next = curr.next;
        curr.next = copy;
        curr = copy.next;
    }

    curr = head;
    while (curr !== null) {
        if (curr.random) curr.next!.random = curr.random.next;
        curr = curr.next!.next;
    }

    const dummy = new Node(0);
    let copyCurr: Node = dummy;
    curr = head;
    while (curr !== null) {
        copyCurr.next = curr.next;
        curr.next = curr.next!.next;
        copyCurr = copyCurr.next!;
        curr = curr.next;
    }
    return dummy.next;
}
```

```python
class Solution:
    def copyRandomList(self, head: Node | None) -> Node | None:
        if not head:
            return None

        curr = head
        while curr:
            copy = Node(curr.val)
            copy.next = curr.next
            curr.next = copy
            curr = copy.next

        curr = head
        while curr:
            if curr.random:
                curr.next.random = curr.random.next
            curr = curr.next.next

        dummy = Node(0)
        copy_curr = dummy
        curr = head
        while curr:
            copy_curr.next = curr.next
            curr.next = curr.next.next
            copy_curr = copy_curr.next
            curr = curr.next

        return dummy.next
```

```go
func copyRandomList(head *Node) *Node {
    if head == nil {
        return nil
    }

    curr := head
    for curr != nil {
        copy := &Node{Val: curr.Val, Next: curr.Next}
        curr.Next = copy
        curr = copy.Next
    }

    curr = head
    for curr != nil {
        if curr.Random != nil {
            curr.Next.Random = curr.Random.Next
        }
        curr = curr.Next.Next
    }

    dummy := &Node{}
    copyCurr := dummy
    curr = head
    for curr != nil {
        copyCurr.Next = curr.Next
        curr.Next = curr.Next.Next
        copyCurr = copyCurr.Next
        curr = curr.Next
    }
    return dummy.Next
}
```

**Time:** O(n) — **Space:** O(1)

## Key Interview Insights

- **Approach 1 is usually the expected answer.** The hash map solution is clean and easy to explain.
- **Approach 2 is the impressive follow-up.** If asked "can you do it in O(1) space?", the interleaving trick is the answer.
- **Why not just copy `random` directly?** The `random` pointer references an old node, not the new copy. We must translate old → new, either via the map or via the interleaved position.
- **The interleaving insight:** `A'.random = A.random.next` works because when processing `A`, its random's copy (`A.random.next`) already exists from step 1.

