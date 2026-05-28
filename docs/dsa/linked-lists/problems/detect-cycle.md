---
title: Detect Cycle in Linked List
difficulty: Easy / Medium
tags: [Linked List, Hash Table, Two Pointers]
link: https://leetcode.com/problems/linked-list-cycle/
---

# Detect Cycle in Linked List

| | |
|---|---|
| **Difficulty** | Easy (detection) / Medium (find entry) |
| **LeetCode** | [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/) · [142. Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/) |
| **Tags** | Linked List, Hash Table, Two Pointers |

## Problem Statement

**LC 141:** Given the head of a linked list, determine if a cycle exists.

**LC 142:** Given the head of a linked list with a cycle, return the **node where the cycle begins**. If no cycle, return null.

## Intuition

If there's a cycle, a fast pointer will **lap** a slow pointer — they will meet inside the cycle. This is Floyd's cycle detection. For LC 142, the meeting point has a mathematical relationship with the cycle entry that lets us find it with a second pass.

## LC 141: Detect Cycle

### Approach 1: Hash Set — O(n) space

```cpp
class Solution {
public:
    bool hasCycle(ListNode* head) {
        unordered_set<ListNode*> seen;
        while (head != nullptr) {
            if (seen.count(head)) return true;
            seen.insert(head);
            head = head->next;
        }
        return false;
    }
};
```

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        Set<ListNode> seen = new HashSet<>();
        while (head != null) {
            if (!seen.add(head)) return true;
            head = head.next;
        }
        return false;
    }
}
```

```typescript
function hasCycle(head: ListNode | null): boolean {
    const seen = new Set<ListNode>();
    while (head !== null) {
        if (seen.has(head)) return true;
        seen.add(head);
        head = head.next;
    }
    return false;
}
```

```python
class Solution:
    def hasCycle(self, head: ListNode | None) -> bool:
        seen = set()
        while head:
            if id(head) in seen:
                return True
            seen.add(id(head))
            head = head.next
        return False
```

```go
func hasCycle(head *ListNode) bool {
    seen := map[*ListNode]bool{}
    for head != nil {
        if seen[head] {
            return true
        }
        seen[head] = true
        head = head.Next
    }
    return false
}
```

**Time:** O(n) — **Space:** O(n)

### Approach 2: Floyd's (Optimal) — O(1) space

```cpp
class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;
        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};
```

```java
public class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}
```

```typescript
function hasCycle(head: ListNode | null): boolean {
    let slow = head, fast = head;
    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}
```

```python
class Solution:
    def hasCycle(self, head: ListNode | None) -> bool:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False
```

```go
func hasCycle(head *ListNode) bool {
    slow, fast := head, head
    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast {
            return true
        }
    }
    return false
}
```

**Time:** O(n) — **Space:** O(1)

## LC 142: Find Cycle Entry

After phase 1 (slow == fast), the distance from head to entry equals the distance from meeting point to entry (within the cycle). Reset slow to head, move both one step — they meet at the entry.

See [Circular Linked List](../circular-linked-list) for the proof.

```cpp
class Solution {
public:
    ListNode* detectCycle(ListNode* head) {
        ListNode* slow = head;
        ListNode* fast = head;

        while (fast != nullptr && fast->next != nullptr) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {
                slow = head;
                while (slow != fast) {
                    slow = slow->next;
                    fast = fast->next;
                }
                return slow;
            }
        }
        return nullptr;
    }
};
```

```java
public class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                slow = head;
                while (slow != fast) {
                    slow = slow.next;
                    fast = fast.next;
                }
                return slow;
            }
        }
        return null;
    }
}
```

```typescript
function detectCycle(head: ListNode | null): ListNode | null {
    let slow = head, fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
        if (slow === fast) {
            slow = head;
            while (slow !== fast) {
                slow = slow!.next;
                fast = fast!.next;
            }
            return slow;
        }
    }
    return null;
}
```

```python
class Solution:
    def detectCycle(self, head: ListNode | None) -> ListNode | None:
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                slow = head
                while slow is not fast:
                    slow = slow.next
                    fast = fast.next
                return slow
        return None
```

```go
func detectCycle(head *ListNode) *ListNode {
    slow, fast := head, head

    for fast != nil && fast.Next != nil {
        slow = slow.Next
        fast = fast.Next.Next
        if slow == fast {
            slow = head
            for slow != fast {
                slow = slow.Next
                fast = fast.Next
            }
            return slow
        }
    }
    return nil
}
```

**Time:** O(n) — **Space:** O(1)

## Key Interview Insights

- **Advance before comparing** — both pointers start at head; check equality *after* moving to avoid false positive on the first iteration.
- **Why `fast.next != null` guard?** For even-length acyclic lists, fast lands on the last node and `fast.next.next` would NPE.
- **Python pointer comparison** — always use `is`, not `==`, for node identity. Two nodes could have equal values but be different objects.
- **Phase 2 moves at the same speed** — both slow and fast advance one step per iteration in the cycle entry search.
- **This algorithm is applied in Find Duplicate Number (LC 287)** — mapping array values as "next pointers" to detect the cycle representing the duplicate.

