---
title: Merge K Sorted Lists
difficulty: Hard
tags: [Linked List, Heap, Divide and Conquer, Merge Sort]
link: https://leetcode.com/problems/merge-k-sorted-lists/
---

# Merge K Sorted Lists

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [23. Merge K Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/) |
| **Tags** | Linked List, Heap, Divide and Conquer |

## Problem Statement

You are given an array of `k` linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.

Example:
```
Input:  [1→4→5], [1→3→4], [2→6]
Output: 1→1→2→3→4→4→5→6
```

## Intuition

Let `N` = total number of nodes across all lists.

**Brute force:** Collect all values, sort, rebuild. O(N log N) time, O(N) extra space.

**Two-pointer merge (sequential):** Merge lists pairwise (like merge-two-sorted-lists). Merge list[0]+list[1], then result+list[2], etc. Each merge is O(N) but we do k-1 merges — O(kN) total. Poor when k is large.

**Min-heap (k-way merge):** At each step, the next node in the merged list must be the smallest among the k current heads. A min-heap of size k gives us the minimum in O(log k) time. Total: O(N log k).

**Divide and conquer:** Merge lists in pairs, halving k each round. O(N log k) — same complexity as heap but simpler to implement without a heap.

## Approach 1: Brute Force — O(N log N)

Collect all values, sort, build a new linked list.

```cpp
ListNode* mergeKLists(vector<ListNode*>& lists) {
    vector<int> vals;
    for (auto* head : lists)
        for (auto* node = head; node; node = node->next)
            vals.push_back(node->val);

    sort(vals.begin(), vals.end());

    ListNode dummy(0);
    auto* cur = &dummy;
    for (int v : vals) { cur->next = new ListNode(v); cur = cur->next; }
    return dummy.next;
}
```

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode head : lists)
            for (ListNode node = head; node != null; node = node.next)
                vals.add(node.val);

        Collections.sort(vals);

        ListNode dummy = new ListNode(0), cur = dummy;
        for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; }
        return dummy.next;
    }
}
```

```typescript
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    const vals: number[] = [];
    for (let head of lists)
        for (let node = head; node; node = node.next)
            vals.push(node.val);

    vals.sort((a, b) => a - b);

    const dummy = new ListNode(0);
    let cur = dummy;
    for (const v of vals) { cur.next = new ListNode(v); cur = cur.next; }
    return dummy.next;
}
```

```python
class Solution:
    def mergeKLists(self, lists: list[ListNode | None]) -> ListNode | None:
        vals = []
        for head in lists:
            node = head
            while node:
                vals.append(node.val)
                node = node.next

        vals.sort()
        dummy = ListNode(0)
        cur = dummy
        for v in vals:
            cur.next = ListNode(v)
            cur = cur.next
        return dummy.next
```

```go
func mergeKLists(lists []*ListNode) *ListNode {
    vals := []int{}
    for _, head := range lists {
        for node := head; node != nil; node = node.Next {
            vals = append(vals, node.Val)
        }
    }
    sort.Ints(vals)

    dummy := &ListNode{}
    cur := dummy
    for _, v := range vals {
        cur.Next = &ListNode{Val: v}
        cur = cur.Next
    }
    return dummy.Next
}
```

**Time:** O(N log N) — **Space:** O(N)

## Approach 2: Min-Heap (K-Way Merge) — O(N log k)

Initialize the min-heap with the head of each non-null list. Each iteration: pop the minimum node, append it to the result, push that node's `.next` onto the heap (if non-null).

The heap always has at most k elements — one per list head. Each heap operation is O(log k). We do N heap operations total.

```cpp
struct Compare {
    bool operator()(ListNode* a, ListNode* b) { return a->val > b->val; }
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        priority_queue<ListNode*, vector<ListNode*>, Compare> minHeap;

        for (auto* head : lists)
            if (head) minHeap.push(head);

        ListNode dummy(0);
        auto* cur = &dummy;

        while (!minHeap.empty()) {
            auto* node = minHeap.top(); minHeap.pop();
            cur->next = node;
            cur = cur->next;
            if (node->next) minHeap.push(node->next);
        }

        return dummy.next;
    }
};
```

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> minHeap = new PriorityQueue<>(
            (a, b) -> Integer.compare(a.val, b.val)
        );

        for (ListNode head : lists)
            if (head != null) minHeap.offer(head);

        ListNode dummy = new ListNode(0), cur = dummy;

        while (!minHeap.isEmpty()) {
            ListNode node = minHeap.poll();
            cur.next = node;
            cur = cur.next;
            if (node.next != null) minHeap.offer(node.next);
        }

        return dummy.next;
    }
}
```

```typescript
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    const heap = new Heap<ListNode>((a, b) => a.val - b.val);

    for (const head of lists)
        if (head) heap.push(head);

    const dummy = new ListNode(0);
    let cur = dummy;

    while (!heap.isEmpty()) {
        const node = heap.pop()!;
        cur.next = node;
        cur = cur.next;
        if (node.next) heap.push(node.next);
    }

    return dummy.next;
}
```

```python
import heapq

class Solution:
    def mergeKLists(self, lists: list[ListNode | None]) -> ListNode | None:
        # heap entries: (val, tie_breaker, node)
        # tie_breaker needed because ListNode may not be comparable
        heap = []
        counter = 0
        for head in lists:
            if head:
                heapq.heappush(heap, (head.val, counter, head))
                counter += 1

        dummy = ListNode(0)
        cur = dummy

        while heap:
            val, _, node = heapq.heappop(heap)
            cur.next = node
            cur = cur.next
            if node.next:
                heapq.heappush(heap, (node.next.val, counter, node.next))
                counter += 1

        return dummy.next
```

```go
type NodeHeap []*ListNode
func (h NodeHeap) Len() int            { return len(h) }
func (h NodeHeap) Less(i, j int) bool  { return h[i].Val < h[j].Val }
func (h NodeHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *NodeHeap) Push(x interface{}) { *h = append(*h, x.(*ListNode)) }
func (h *NodeHeap) Pop() interface{}   { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

func mergeKLists(lists []*ListNode) *ListNode {
    h := &NodeHeap{}
    heap.Init(h)
    for _, head := range lists {
        if head != nil { heap.Push(h, head) }
    }

    dummy := &ListNode{}
    cur := dummy
    for h.Len() > 0 {
        node := heap.Pop(h).(*ListNode)
        cur.Next = node
        cur = cur.Next
        if node.Next != nil { heap.Push(h, node.Next) }
    }
    return dummy.Next
}
```

**Time:** O(N log k) — **Space:** O(k) for the heap

## Approach 3: Divide and Conquer — O(N log k)

Merge pairs of lists each round, halving the number of lists each time. After log k rounds, we have one merged list.

```cpp
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) return nullptr;
        while (lists.size() > 1) {
            vector<ListNode*> merged;
            for (int i = 0; i < lists.size(); i += 2) {
                ListNode* l1 = lists[i];
                ListNode* l2 = (i + 1 < lists.size()) ? lists[i+1] : nullptr;
                merged.push_back(mergeTwoLists(l1, l2));
            }
            lists = merged;
        }
        return lists[0];
    }

private:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        ListNode dummy(0); auto* cur = &dummy;
        while (l1 && l2) {
            if (l1->val <= l2->val) { cur->next = l1; l1 = l1->next; }
            else { cur->next = l2; l2 = l2->next; }
            cur = cur->next;
        }
        cur->next = l1 ? l1 : l2;
        return dummy.next;
    }
};
```

```java
class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists.length == 0) return null;
        List<ListNode> ls = new ArrayList<>(Arrays.asList(lists));
        while (ls.size() > 1) {
            List<ListNode> merged = new ArrayList<>();
            for (int i = 0; i < ls.size(); i += 2) {
                ListNode l2 = (i + 1 < ls.size()) ? ls.get(i + 1) : null;
                merged.add(mergeTwoLists(ls.get(i), l2));
            }
            ls = merged;
        }
        return ls.get(0);
    }

    private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), cur = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
            else { cur.next = l2; l2 = l2.next; }
            cur = cur.next;
        }
        cur.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }
}
```

```typescript
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
    if (lists.length === 0) return null;

    const mergeTwoLists = (l1: ListNode | null, l2: ListNode | null): ListNode | null => {
        const dummy = new ListNode(0);
        let cur = dummy;
        while (l1 && l2) {
            if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
            else { cur.next = l2; l2 = l2.next; }
            cur = cur.next!;
        }
        cur.next = l1 ?? l2;
        return dummy.next;
    };

    while (lists.length > 1) {
        const merged: Array<ListNode | null> = [];
        for (let i = 0; i < lists.length; i += 2)
            merged.push(mergeTwoLists(lists[i], lists[i+1] ?? null));
        lists = merged;
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
            cur = dummy
            while l1 and l2:
                if l1.val <= l2.val:
                    cur.next, l1 = l1, l1.next
                else:
                    cur.next, l2 = l2, l2.next
                cur = cur.next
            cur.next = l1 or l2
            return dummy.next

        while len(lists) > 1:
            merged = []
            for i in range(0, len(lists), 2):
                l2 = lists[i+1] if i+1 < len(lists) else None
                merged.append(merge_two(lists[i], l2))
            lists = merged

        return lists[0]
```

```go
func mergeKLists(lists []*ListNode) *ListNode {
    if len(lists) == 0 { return nil }

    var mergeTwoLists func(l1, l2 *ListNode) *ListNode
    mergeTwoLists = func(l1, l2 *ListNode) *ListNode {
        dummy := &ListNode{}
        cur := dummy
        for l1 != nil && l2 != nil {
            if l1.Val <= l2.Val { cur.Next = l1; l1 = l1.Next } else { cur.Next = l2; l2 = l2.Next }
            cur = cur.Next
        }
        if l1 != nil { cur.Next = l1 } else { cur.Next = l2 }
        return dummy.Next
    }

    for len(lists) > 1 {
        merged := []*ListNode{}
        for i := 0; i < len(lists); i += 2 {
            if i+1 < len(lists) { merged = append(merged, mergeTwoLists(lists[i], lists[i+1])) } else { merged = append(merged, lists[i]) }
        }
        lists = merged
    }
    return lists[0]
}
```

**Time:** O(N log k) — **Space:** O(log k) for recursion stack (iterative version above: O(1))

## Complexity Comparison

| Approach | Time | Space | Notes |
|---|---|---|---|
| Brute force | O(N log N) | O(N) | Simple, wasteful |
| Sequential merge | O(kN) | O(1) | Worst when k is large |
| **Min-heap** | **O(N log k)** | O(k) | Clean, interview-standard |
| Divide & conquer | O(N log k) | O(1) | Same complexity, no heap needed |

## Key Interview Insights

- **Heap approach is the "expected" solution.** O(N log k) is optimal, and the heap solution is clean and direct.
- **Python tie-breaker:** `heapq` can't compare `ListNode` objects directly. Use `(val, counter, node)` tuples where `counter` is a monotonically increasing tie-breaker.
- **Dummy head trick:** Using a `dummy` sentinel node at the start of the output list avoids edge case handling for the first node.
- **Don't push null.** Always guard before pushing `node.next` — only push if it's non-null.
- **Space is O(k)** for the heap (not O(N)) — we never store all nodes simultaneously, just k heads.
- **Divide and conquer** is worth mentioning — same complexity without needing a heap. It's essentially how external merge sort works.
- **Follow-up:** "What if k is very large?" With k > 10^6, even O(N log k) might be slow. External sorting with multiple passes could be discussed.
