---
title: Add Two Numbers
difficulty: Medium
tags: [Linked List, Math, Recursion]
link: https://leetcode.com/problems/add-two-numbers/
---

# Add Two Numbers

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/) |
| **Tags** | Linked List, Math |

## Problem Statement

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in **reverse order** and each node contains a single digit. Add the two numbers and return the sum as a linked list (also in reverse order).

Example: `(2 → 4 → 3)` + `(5 → 6 → 4)` = `342 + 465 = 807` = `(7 → 0 → 8)`.

## Intuition

This is elementary addition with **carry propagation**, done digit by digit. The reversed storage is actually a gift — the head corresponds to the least significant digit, exactly where you start addition.

Process both lists simultaneously. At each step:
- `sum = l1.val + l2.val + carry`
- `carry = sum / 10`
- `digit = sum % 10`

Continue until both lists are exhausted **and** there's no remaining carry.

## Approach: Iterative Simulation

```cpp
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* curr = &dummy;
        int carry = 0;

        while (l1 != nullptr || l2 != nullptr || carry != 0) {
            int sum = carry;
            if (l1 != nullptr) { sum += l1->val; l1 = l1->next; }
            if (l2 != nullptr) { sum += l2->val; l2 = l2->next; }
            carry = sum / 10;
            curr->next = new ListNode(sum % 10);
            curr = curr->next;
        }
        return dummy.next;
    }
};
```

```java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        int carry = 0;

        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
        }
        return dummy.next;
    }
}
```

```typescript
function addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummy = new ListNode(0);
    let curr: ListNode = dummy;
    let carry = 0;

    while (l1 !== null || l2 !== null || carry !== 0) {
        let sum = carry;
        if (l1 !== null) { sum += l1.val; l1 = l1.next; }
        if (l2 !== null) { sum += l2.val; l2 = l2.next; }
        carry = Math.floor(sum / 10);
        curr.next = new ListNode(sum % 10);
        curr = curr.next;
    }
    return dummy.next;
}
```

```python
class Solution:
    def addTwoNumbers(self, l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
        dummy = ListNode(0)
        curr = dummy
        carry = 0

        while l1 or l2 or carry:
            total = carry
            if l1:
                total += l1.val
                l1 = l1.next
            if l2:
                total += l2.val
                l2 = l2.next
            carry, digit = divmod(total, 10)
            curr.next = ListNode(digit)
            curr = curr.next

        return dummy.next
```

```go
func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
    dummy := &ListNode{}
    curr := dummy
    carry := 0

    for l1 != nil || l2 != nil || carry != 0 {
        sum := carry
        if l1 != nil {
            sum += l1.Val
            l1 = l1.Next
        }
        if l2 != nil {
            sum += l2.Val
            l2 = l2.Next
        }
        carry = sum / 10
        curr.Next = &ListNode{Val: sum % 10}
        curr = curr.Next
    }
    return dummy.Next
}
```

**Time:** O(max(m, n)) — **Space:** O(max(m, n))

## Dry Run

l1: `2 → 4 → 3` (342), l2: `5 → 6 → 4` (465)

| Step | l1.val | l2.val | carry in | sum | digit | carry out |
|---|---|---|---|---|---|---|
| 1 | 2 | 5 | 0 | 7 | 7 | 0 |
| 2 | 4 | 6 | 0 | 10 | 0 | 1 |
| 3 | 3 | 4 | 1 | 8 | 8 | 0 |

Result: `7 → 0 → 8` (807) ✓

## Key Interview Insights

- **`|| carry != 0` in the loop condition** is the critical detail. After both lists are exhausted, there might still be a carry to emit (e.g., `5 + 5 = 10` at the last digit).
- **Handle unequal lengths** — safely check `if l1 != null` before accessing `l1.val`. The shorter list contributes 0 after it's exhausted.
- **Follow-up: numbers stored forward** — reverse both lists first (or use a stack to process from the most significant digit). See Add Two Numbers II (LC 445).
- **Overflow-safe** — we never reconstruct the actual integers (which could be astronomical), we process digit by digit.

