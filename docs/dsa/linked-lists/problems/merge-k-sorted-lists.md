---
title: Merge K Sorted Lists
difficulty: Hard
tags: [Linked List, Divide and Conquer, Heap]
link: https://leetcode.com/problems/merge-k-sorted-lists/
---

# Merge K Sorted Lists

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) |
| **Tags** | Linked List, Divide and Conquer, Heap, Priority Queue |

## Problem Statement

You are given an array of `k` linked lists, each sorted in ascending order. Merge all the lists into one sorted linked list and return its head.

Let `n` = total number of nodes across all lists, `k` = number of lists.

## Intuition

**Brute force:** Collect all values, sort, rebuild → O(n log n). Ignores the existing sorted order.

**Two key approaches that exploit sorted order:**

1. **Min-Heap:** Maintain a heap of size k containing the current head of each list. Always extract the minimum, then push that node's next. This gives O(n log k) — far better when k << n.

2. **Divide and Conquer:** Repeatedly merge pairs of lists, halving the number of lists each round. We do log k rounds of merges, each processing all n nodes → O(n log k).

## Approach 1: Min-Heap (Priority Queue)

```cpp
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> minHeap(cmp);

        for (ListNode* list : lists) {
            if (list) minHeap.push(list);
        }

        ListNode dummy(0);
        ListNode* curr = &dummy;
        while (!minHeap.empty()) {
            ListNode* node = minHeap.top();
            minHeap.pop();
            curr->next = node;
            curr = curr->next;
            if (node->next) minHeap.push(node->next);
        }
        return dummy.next;
    }
};
```

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> minHeap =
            new PriorityQueue<>((a, b) -> a.val - b.val);

        for (ListNode list : lists) {
            if (list != null) minHeap.offer(list);
        }

        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (!minHeap.isEmpty()) {
            ListNode node = minHeap.poll();
            curr.next = node;
            curr = curr.next;
            if (node.next != null) minHeap.offer(node.next);
        }
        return dummy.next;
    }
}
```

```typescript
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    // Use a sorted array as a simple min-heap simulation
    // (In practice, use a proper heap library for large k)
    const heap: ListNode[] = [];
    for (const list of lists) {
        if (list !== null) heap.push(list);
    }
    heap.sort((a, b) => a.val - b.val);

    const dummy = new ListNode(0);
    let curr: ListNode = dummy;

    while (heap.length > 0) {
        // Extract min
        const node = heap.shift()!;
        curr.next = node;
        curr = curr.next;

        if (node.next !== null) {
            // Insert next node in sorted position
            let i = 0;
            while (i < heap.length && heap[i].val <= node.next.val) i++;
            heap.splice(i, 0, node.next);
        }
    }
    return dummy.next;
}
```

```python
import heapq

class Solution:
    def mergeKLists(self, lists: list[ListNode | None]) -> ListNode | None:
        # heapq doesn't support custom objects directly; use (val, id, node)
        min_heap: list[tuple[int, int, ListNode]] = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(min_heap, (node.val, i, node))

        dummy = ListNode(0)
        curr = dummy
        counter = len(lists)

        while min_heap:
            val, _, node = heapq.heappop(min_heap)
            curr.next = node
            curr = curr.next
            if node.next:
                heapq.heappush(min_heap, (node.next.val, counter, node.next))
                counter += 1

        return dummy.next
```

```go
import "container/heap"

type MinHeap []*ListNode

func (h MinHeap) Len() int            { return len(h) }
func (h MinHeap) Less(i, j int) bool  { return h[i].Val < h[j].Val }
func (h MinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x interface{}) { *h = append(*h, x.(*ListNode)) }
func (h *MinHeap) Pop() interface{} {
    old := *h
    n := len(old)
    x := old[n-1]
    *h = old[:n-1]
    return x
}

func mergeKLists(lists []*ListNode) *ListNode {
    h := &MinHeap{}
    heap.Init(h)
    for _, list := range lists {
        if list != nil {
            heap.Push(h, list)
        }
    }

    dummy := &ListNode{}
    curr := dummy
    for h.Len() > 0 {
        node := heap.Pop(h).(*ListNode)
        curr.Next = node
        curr = curr.Next
        if node.Next != nil {
            heap.Push(h, node.Next)
        }
    }
    return dummy.Next
}
```

**Time:** O(n log k) — **Space:** O(k)

## Approach 2: Divide and Conquer

Merge lists pairwise, reducing from k to k/2 to k/4 ... to 1. Uses the same two-list merge function from LC 21.

```cpp
class Solution {
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* curr = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { curr->next = l1; l1 = l1->next; }
            else                    { curr->next = l2; l2 = l2->next; }
            curr = curr->next;
        }
        curr->next = l1 ? l1 : l2;
        return dummy.next;
    }
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        int n = lists.size();
        while (n > 1) {
            for (int i = 0; i < n / 2; i++) {
                lists[i] = mergeTwoLists(lists[i], lists[n - 1 - i]);
            }
            n = (n + 1) / 2;
        }
        return lists[0];
    }
};
```

```java
class Solution {
    private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), curr = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
            else                  { curr.next = l2; l2 = l2.next; }
            curr = curr.next;
        }
        curr.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }

    public ListNode mergeKLists(ListNode[] lists) {
        if (lists.length == 0) return null;
        int n = lists.length;
        while (n > 1) {
            for (int i = 0; i < n / 2; i++) {
                lists[i] = mergeTwoLists(lists[i], lists[n - 1 - i]);
            }
            n = (n + 1) / 2;
        }
        return lists[0];
    }
}
```

```typescript
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    if (lists.length === 0) return null;

    function mergeTwoLists(l1: ListNode | null, l2: ListNode | null): ListNode | null {
        const dummy = new ListNode(0);
        let curr = dummy;
        while (l1 !== null && l2 !== null) {
            if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
            else                  { curr.next = l2; l2 = l2.next; }
            curr = curr.next!;
        }
        curr.next = l1 ?? l2;
        return dummy.next;
    }

    let n = lists.length;
    while (n > 1) {
        for (let i = 0; i < Math.floor(n / 2); i++) {
            lists[i] = mergeTwoLists(lists[i], lists[n - 1 - i]);
        }
        n = Math.ceil(n / 2);
    }
    return lists[0];
}
```

```python
class Solution:
    def mergeKLists(self, lists: list[ListNode | None]) -> ListNode | None:
        if not lists:
            return None

        def merge_two(l1, l2):
            dummy = ListNode(0)
            curr = dummy
            while l1 and l2:
                if l1.val <= l2.val:
                    curr.next, l1 = l1, l1.next
                else:
                    curr.next, l2 = l2, l2.next
                curr = curr.next
            curr.next = l1 or l2
            return dummy.next

        n = len(lists)
        while n > 1:
            for i in range(n // 2):
                lists[i] = merge_two(lists[i], lists[n - 1 - i])
            n = (n + 1) // 2
        return lists[0]
```

```go
func mergeKLists(lists []*ListNode) *ListNode {
    if len(lists) == 0 { return nil }

    mergeTwoLists := func(l1, l2 *ListNode) *ListNode {
        dummy := &ListNode{}
        curr := dummy
        for l1 != nil && l2 != nil {
            if l1.Val <= l2.Val { curr.Next = l1; l1 = l1.Next } else { curr.Next = l2; l2 = l2.Next }
            curr = curr.Next
        }
        if l1 != nil { curr.Next = l1 } else { curr.Next = l2 }
        return dummy.Next
    }

    n := len(lists)
    for n > 1 {
        for i := 0; i < n/2; i++ {
            lists[i] = mergeTwoLists(lists[i], lists[n-1-i])
        }
        n = (n + 1) / 2
    }
    return lists[0]
}
```

**Time:** O(n log k) — **Space:** O(log k) recursion stack

## Complexity Comparison

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute force (sort all) | O(n log n) | O(n) | Ignores sorted order |
| Sequential merges | O(kn) | O(1) | Degrades for large k |
| **Min-Heap** | **O(n log k)** | **O(k)** | Best for streaming/online |
| **Divide & Conquer** | **O(n log k)** | **O(log k)** | Best for offline, pure LL |

## Key Interview Insights

- **Both approaches are O(n log k)** — the heap approach is more intuitive; D&C is more elegant. Know both.
- **Why is naive sequential merging O(kn)?** Merging list 2 into list 1 costs O(n), then list 3 costs O(2n/k + n/k), etc. Total balloons to O(kn) in the worst case.
- **Python heapq needs a tiebreaker.** ListNode is not comparable by default. Use `(val, unique_counter, node)` to avoid comparison errors on equal values.
- **D&C merge direction matters.** Merge from the ends inward (pair `lists[i]` with `lists[n-1-i]`) to avoid re-merging already-merged results of different lengths.
- **This generalizes to any merge-sorted problem** (e.g., external sort with k files).

