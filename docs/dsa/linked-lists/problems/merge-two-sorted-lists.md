---
title: Merge Two Sorted Lists
difficulty: Easy
tags: [Linked List, Recursion]
link: https://leetcode.com/problems/merge-two-sorted-lists/
---

# Merge Two Sorted Lists

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/) |
| **Tags** | Linked List, Recursion |

## Problem Statement

Given the heads of two sorted linked lists `list1` and `list2`, merge them into a single sorted linked list and return the head of the merged list.

## Intuition

At each step, pick the smaller of the two current nodes and append it to the result. This is exactly the **merge step of merge sort** adapted for linked lists.

The dummy head pattern eliminates the special case of choosing the initial node.

## Approach 1: Iterative (Optimal)

```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* curr = &dummy;

        while (l1 != nullptr && l2 != nullptr) {
            if (l1->val <= l2->val) {
                curr->next = l1;
                l1 = l1->next;
            } else {
                curr->next = l2;
                l2 = l2->next;
            }
            curr = curr->next;
        }
        curr->next = (l1 != nullptr) ? l1 : l2;
        return dummy.next;
    }
};
```

```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;

        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
                curr.next = l1;
                l1 = l1.next;
            } else {
                curr.next = l2;
                l2 = l2.next;
            }
            curr = curr.next;
        }
        curr.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}
```

```typescript
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummy = new ListNode(0);
    let curr: ListNode = dummy;

    while (l1 !== null && l2 !== null) {
        if (l1.val <= l2.val) {
            curr.next = l1;
            l1 = l1.next;
        } else {
            curr.next = l2;
            l2 = l2.next;
        }
        curr = curr.next;
    }
    curr.next = l1 !== null ? l1 : l2;
    return dummy.next;
}
```

```python
class Solution:
    def mergeTwoLists(self, l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
        dummy = ListNode(0)
        curr = dummy

        while l1 and l2:
            if l1.val <= l2.val:
                curr.next = l1
                l1 = l1.next
            else:
                curr.next = l2
                l2 = l2.next
            curr = curr.next

        curr.next = l1 if l1 else l2
        return dummy.next
```

```go
func mergeTwoLists(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    curr := dummy

    for l1 != nil && l2 != nil {
        if l1.Val <= l2.Val {
            curr.Next = l1
            l1 = l1.Next
        } else {
            curr.Next = l2
            l2 = l2.Next
        }
        curr = curr.Next
    }
    if l1 != nil {
        curr.Next = l1
    } else {
        curr.Next = l2
    }
    return dummy.Next
}
```

**Time:** O(m + n) — **Space:** O(1)

## Approach 2: Recursive

```cpp
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        if (l1 == nullptr) return l2;
        if (l2 == nullptr) return l1;

        if (l1->val <= l2->val) {
            l1->next = mergeTwoLists(l1->next, l2);
            return l1;
        } else {
            l2->next = mergeTwoLists(l1, l2->next);
            return l2;
        }
    }
};
```

```java
class Solution {
    public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        if (l1 == null) return l2;
        if (l2 == null) return l1;

        if (l1.val <= l2.val) {
            l1.next = mergeTwoLists(l1.next, l2);
            return l1;
        } else {
            l2.next = mergeTwoLists(l1, l2.next);
            return l2;
        }
    }
}
```

```typescript
function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    if (l1 === null) return l2;
    if (l2 === null) return l1;

    if (l1.val <= l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }
}
```

```python
class Solution:
    def mergeTwoLists(self, l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
        if not l1: return l2
        if not l2: return l1

        if l1.val <= l2.val:
            l1.next = self.mergeTwoLists(l1.next, l2)
            return l1
        else:
            l2.next = self.mergeTwoLists(l1, l2.next)
            return l2
```

```go
func mergeTwoLists(l1 *ListNode, l2 *ListNode) *ListNode {
    if l1 == nil { return l2 }
    if l2 == nil { return l1 }

    if l1.Val <= l2.Val {
        l1.Next = mergeTwoLists(l1.Next, l2)
        return l1
    }
    l2.Next = mergeTwoLists(l1, l2.Next)
    return l2
}
```

**Time:** O(m + n) — **Space:** O(m + n) call stack

## Dry Run

l1: `1 → 3 → 5`, l2: `2 → 4 → 6`

| Iteration | l1.val | l2.val | Pick | curr moves to |
|---|---|---|---|---|
| 1 | 1 | 2 | l1(1) | node 1 |
| 2 | 3 | 2 | l2(2) | node 2 |
| 3 | 3 | 4 | l1(3) | node 3 |
| 4 | 5 | 4 | l2(4) | node 4 |
| 5 | 5 | 6 | l1(5) | node 5 |
| End | null | 6 | Attach l2 tail | — |

Result: `1 → 2 → 3 → 4 → 5 → 6` ✓

## Key Interview Insights

- **`curr.next = remaining_list`** at the end is the cleanup step — don't forget it. One list exhausts before the other; just attach the rest.
- **The dummy head** makes the code uniform — no special case for the very first node.
- **In-place merge** — we reuse existing nodes, no new nodes created. Space is O(1).
- **Building block:** This exact function is used as a subroutine in Merge K Sorted Lists (with a min-heap or divide-and-conquer).

