---
title: Remove Nth Node From End
difficulty: Medium
tags: [Linked List, Two Pointers]
link: https://leetcode.com/problems/remove-nth-node-from-end-of-list/
---

# Remove Nth Node From End of List

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/) |
| **Tags** | Linked List, Two Pointers |

## Problem Statement

Given the head of a linked list, remove the n-th node from the end of the list and return its head.

## Intuition

To remove a node, we need its **predecessor** (the node before it). The challenge is finding the n-th from the end without knowing the total length upfront.

**Two-pointer trick:** Move `fast` pointer n steps ahead. Then move both pointers until `fast` reaches the last node. At that point, `slow` is right before the target node.

We combine this with a **dummy head** to handle edge cases like removing the actual head.

## Approach 1: Two Passes

Count the length, then traverse to position `length - n`.

```cpp
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        int len = 0;
        ListNode* curr = head;
        while (curr) { len++; curr = curr->next; }

        ListNode dummy(0);
        dummy.next = head;
        curr = &dummy;
        for (int i = 0; i < len - n; i++) curr = curr->next;
        curr->next = curr->next->next;
        return dummy.next;
    }
};
```

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        int len = 0;
        ListNode curr = head;
        while (curr != null) { len++; curr = curr.next; }

        ListNode dummy = new ListNode(0);
        dummy.next = head;
        curr = dummy;
        for (int i = 0; i < len - n; i++) curr = curr.next;
        curr.next = curr.next.next;
        return dummy.next;
    }
}
```

```typescript
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    let len = 0;
    let curr: ListNode | null = head;
    while (curr !== null) { len++; curr = curr.next; }

    const dummy = new ListNode(0);
    dummy.next = head;
    curr = dummy;
    for (let i = 0; i < len - n; i++) curr = curr.next!;
    curr.next = curr.next!.next;
    return dummy.next;
}
```

```python
class Solution:
    def removeNthFromEnd(self, head: ListNode | None, n: int) -> ListNode | None:
        length = 0
        curr = head
        while curr:
            length += 1
            curr = curr.next

        dummy = ListNode(0)
        dummy.next = head
        curr = dummy
        for _ in range(length - n):
            curr = curr.next
        curr.next = curr.next.next
        return dummy.next
```

```go
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    length := 0
    curr := head
    for curr != nil { length++; curr = curr.Next }

    dummy := &ListNode{Next: head}
    curr = dummy
    for i := 0; i < length-n; i++ { curr = curr.Next }
    curr.Next = curr.Next.Next
    return dummy.Next
}
```

**Time:** O(n) — **Space:** O(1)

## Approach 2: One-Pass Two Pointers (Optimal)

Move `fast` n+1 steps ahead from the dummy node. Then advance both until `fast` is null. `slow` is now the predecessor of the target.

```cpp
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0);
        dummy.next = head;
        ListNode* slow = &dummy;
        ListNode* fast = &dummy;

        for (int i = 0; i <= n; i++) {
            fast = fast->next;
        }

        while (fast != nullptr) {
            slow = slow->next;
            fast = fast->next;
        }

        slow->next = slow->next->next;
        return dummy.next;
    }
};
```

```java
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode slow = dummy, fast = dummy;

        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        while (fast != null) {
            slow = slow.next;
            fast = fast.next;
        }

        slow.next = slow.next.next;
        return dummy.next;
    }
}
```

```typescript
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
    const dummy = new ListNode(0);
    dummy.next = head;
    let slow: ListNode = dummy, fast: ListNode = dummy;

    for (let i = 0; i <= n; i++) {
        fast = fast.next!;
    }

    while (fast !== null) {
        slow = slow.next!;
        fast = fast.next;
    }

    slow.next = slow.next!.next;
    return dummy.next;
}
```

```python
class Solution:
    def removeNthFromEnd(self, head: ListNode | None, n: int) -> ListNode | None:
        dummy = ListNode(0)
        dummy.next = head
        slow = fast = dummy

        for _ in range(n + 1):
            fast = fast.next

        while fast:
            slow = slow.next
            fast = fast.next

        slow.next = slow.next.next
        return dummy.next
```

```go
func removeNthFromEnd(head *ListNode, n int) *ListNode {
    dummy := &ListNode{Next: head}
    slow, fast := dummy, dummy

    for i := 0; i <= n; i++ {
        fast = fast.Next
    }

    for fast != nil {
        slow = slow.Next
        fast = fast.Next
    }

    slow.Next = slow.Next.Next
    return dummy.Next
}
```

**Time:** O(L) — **Space:** O(1)

## Dry Run

List: `1 → 2 → 3 → 4 → 5`, n = 2

After advancing fast n+1 = 3 steps from dummy:

```
dummy → 1 → 2 → 3 → 4 → 5 → null
  ↑                 ↑
slow              fast
```

Move both until fast is null:

```
dummy → 1 → 2 → 3 → 4 → 5 → null
                  ↑           ↑
                slow         fast
```

`slow.next = slow.next.next` → 3.next = 5, skipping node 4.

Result: `1 → 2 → 3 → 5` ✓

## Key Interview Insights

- **Why n+1 steps, not n?** We want `slow` to stop at the **predecessor** of the target, not the target itself. Advancing one extra step creates that gap.
- **Dummy head is essential** when n equals the list length (removing the head node). Without it, `slow` can't stop before the head.
- **Gap technique** — maintaining an exact gap between two pointers is a reusable pattern in linked list problems.

