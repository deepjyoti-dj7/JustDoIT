---
title: Merge Sort
description: Divide-and-conquer sorting — guarantees O(n log n) in all cases and powers external sorting and merge-based problems
---

# Merge Sort

Merge Sort is the canonical **divide-and-conquer** sorting algorithm. It guarantees **O(n log n) in all cases** — the best worst-case guarantee of any comparison-based sort. Understanding merge sort deeply unlocks an entire class of "merge-based" interview problems: counting inversions, sorting linked lists, merge k sorted lists, and the two-pointer merge pattern.

## Core Intuition

**Divide:** Split the array in half recursively until you have subarrays of size 1. A single element is trivially sorted.

**Conquer (Merge):** Merge two sorted halves into a single sorted array. Two sorted sequences can always be merged in O(n) using a two-pointer approach.

```
[38, 27, 43, 3, 9, 82, 10]

Split:
[38, 27, 43, 3]     [9, 82, 10]
[38, 27] [43, 3]    [9, 82] [10]
[38][27] [43][3]    [9][82] [10]

Merge back:
[27, 38] [3, 43]    [9, 82] [10]
[3, 27, 38, 43]     [9, 10, 82]
[3, 9, 10, 27, 38, 43, 82]
```

The key insight: **merging is cheap** (O(n)) when both halves are already sorted. Recursion guarantees sorted halves.

## The Merge Step (The Real Work)

The merge is the heart of the algorithm. Given two sorted arrays, produce one sorted array:

Use two pointers, one for each half. Always pick the smaller current element and advance that pointer.

```
Left:  [3, 27, 38, 43]
Right: [9, 10, 82]

i=0, j=0 → pick 3  (L)   → [3]
i=1, j=0 → pick 9  (R)   → [3, 9]
i=1, j=1 → pick 10 (R)   → [3, 9, 10]
i=1, j=2 → pick 27 (L)   → [3, 9, 10, 27]
i=2, j=2 → pick 38 (L)   → [3, 9, 10, 27, 38]
i=3, j=2 → pick 43 (L)   → [3, 9, 10, 27, 38, 43]
i=4 (done)→ append 82     → [3, 9, 10, 27, 38, 43, 82]
```

## Template

### Recursive (Top-Down)

The standard implementation most interviewers expect.

```cpp
#include <vector>
using namespace std;

void merge(vector<int>& arr, int left, int mid, int right) {
    vector<int> temp(right - left + 1);
    int i = left, j = mid + 1, k = 0;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else                  temp[k++] = arr[j++];
    }
    while (i <= mid)  temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    for (int idx = 0; idx < (int)temp.size(); idx++)
        arr[left + idx] = temp[idx];
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;           // base case: single element
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}
```

```java
void merge(int[] arr, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else                  temp[k++] = arr[j++];
    }
    while (i <= mid)   temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    for (int idx = 0; idx < temp.length; idx++)
        arr[left + idx] = temp[idx];
}

void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}
```

```typescript
function merge(arr: number[], left: number, mid: number, right: number): void {
    const temp: number[] = [];
    let i = left, j = mid + 1;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp.push(arr[i++]);
        else                  temp.push(arr[j++]);
    }
    while (i <= mid)   temp.push(arr[i++]);
    while (j <= right) temp.push(arr[j++]);

    for (let k = 0; k < temp.length; k++)
        arr[left + k] = temp[k];
}

function mergeSort(arr: number[], left: number, right: number): void {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}
```

```python
def merge_sort(arr: list[int], left: int, right: int) -> None:
    if left >= right:
        return
    mid = (left + right) // 2
    merge_sort(arr, left, mid)
    merge_sort(arr, mid + 1, right)
    _merge(arr, left, mid, right)

def _merge(arr: list[int], left: int, mid: int, right: int) -> None:
    temp = []
    i, j = left, mid + 1

    while i <= mid and j <= right:
        if arr[i] <= arr[j]:
            temp.append(arr[i]); i += 1
        else:
            temp.append(arr[j]); j += 1

    while i <= mid:   temp.append(arr[i]); i += 1
    while j <= right: temp.append(arr[j]); j += 1

    for k, val in enumerate(temp):
        arr[left + k] = val
```

```go
func mergeSort(arr []int, left, right int) {
    if left >= right { return }
    mid := left + (right-left)/2
    mergeSort(arr, left, mid)
    mergeSort(arr, mid+1, right)
    mergeFn(arr, left, mid, right)
}

func mergeFn(arr []int, left, mid, right int) {
    temp := make([]int, right-left+1)
    i, j, k := left, mid+1, 0

    for i <= mid && j <= right {
        if arr[i] <= arr[j] { temp[k] = arr[i]; i++ } else { temp[k] = arr[j]; j++ }
        k++
    }
    for i <= mid   { temp[k] = arr[i]; i++; k++ }
    for j <= right { temp[k] = arr[j]; j++; k++ }

    for idx, val := range temp { arr[left+idx] = val }
}
```

### Sorting a Linked List (Classic Interview Variant)

Merge sort is **the preferred algorithm for linked lists**. Quick sort's random access pattern is bad for lists, but merge sort's split-and-merge structure maps perfectly.

```cpp
struct ListNode { int val; ListNode* next; };

ListNode* sortList(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* slow = head, *fast = head->next;
    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }
    ListNode* mid = slow->next; slow->next = nullptr;
    return mergeSorted(sortList(head), sortList(mid));
}
ListNode* mergeSorted(ListNode* l1, ListNode* l2) {
    ListNode dummy(0); ListNode* curr = &dummy;
    while (l1 && l2) {
        if (l1->val <= l2->val) { curr->next = l1; l1 = l1->next; }
        else                    { curr->next = l2; l2 = l2->next; }
        curr = curr->next;
    }
    curr->next = l1 ? l1 : l2;
    return dummy.next;
}
```

```java
ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode slow = head, fast = head.next;
    while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
    ListNode mid = slow.next; slow.next = null;
    return mergeSorted(sortList(head), sortList(mid));
}
ListNode mergeSorted(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), curr = dummy;
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
        else                  { curr.next = l2; l2 = l2.next; }
        curr = curr.next;
    }
    curr.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}
```

```typescript
function sortList(head: ListNode | null): ListNode | null {
    if (!head || !head.next) return head;
    let slow = head, fast: ListNode | null = head.next;
    while (fast && fast.next) { slow = slow.next!; fast = fast.next.next; }
    const mid = slow.next; slow.next = null;
    return mergeSorted(sortList(head), sortList(mid));
}
function mergeSorted(l1: ListNode | null, l2: ListNode | null): ListNode | null {
    const dummy = new ListNode(0); let curr = dummy;
    while (l1 && l2) {
        if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
        else                  { curr.next = l2; l2 = l2.next; }
        curr = curr.next!;
    }
    curr.next = l1 ?? l2;
    return dummy.next;
}
```

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next

def sortList(head: ListNode) -> ListNode:
    if not head or not head.next:
        return head

    # Find middle using slow/fast pointers
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    mid = slow.next
    slow.next = None  # split list in two

    left  = sortList(head)
    right = sortList(mid)
    return merge_lists(left, right)

def merge_lists(l1: ListNode, l2: ListNode) -> ListNode:
    dummy = ListNode(0)
    curr = dummy
    while l1 and l2:
        if l1.val <= l2.val: curr.next = l1; l1 = l1.next
        else:                 curr.next = l2; l2 = l2.next
        curr = curr.next
    curr.next = l1 or l2
    return dummy.next
```

```go
type ListNode struct { Val int; Next *ListNode }

func sortList(head *ListNode) *ListNode {
    if head == nil || head.Next == nil { return head }
    slow, fast := head, head.Next
    for fast != nil && fast.Next != nil { slow = slow.Next; fast = fast.Next.Next }
    mid := slow.Next; slow.Next = nil
    return mergeSorted(sortList(head), sortList(mid))
}
func mergeSorted(l1, l2 *ListNode) *ListNode {
    dummy := &ListNode{}; curr := dummy
    for l1 != nil && l2 != nil {
        if l1.Val <= l2.Val { curr.Next = l1; l1 = l1.Next } else { curr.Next = l2; l2 = l2.Next }
        curr = curr.Next
    }
    if l1 != nil { curr.Next = l1 } else { curr.Next = l2 }
    return dummy.Next
}
```

## Why O(n log n)?

The recurrence relation is:

$$T(n) = 2T\left(\frac{n}{2}\right) + O(n)$$

By the Master Theorem (case 2): **T(n) = O(n log n)**

Intuitively: there are **log n levels** of recursion, and each level does **O(n) total work** across all merge calls at that level.

```
Level 0: 1 merge of size n         → O(n)
Level 1: 2 merges of size n/2      → O(n)
Level 2: 4 merges of size n/4      → O(n)
...
Level log n: n merges of size 1    → O(n)

Total: log n levels × O(n) each = O(n log n)
```

## Complexity

| Case | Time | Space |
|---|---|---|
| Best | O(n log n) | O(n) |
| Average | O(n log n) | O(n) |
| Worst | O(n log n) | O(n) |

The O(n) **extra space** for the temporary array is the main drawback vs. in-place sorts. The recursion stack adds O(log n) space on top of that.

## Stability

Merge sort is **stable** — equal elements maintain their original relative order. This matters when sorting by multiple keys (e.g., sort by last name, then by first name).

The stability comes from the `<=` in the merge condition: when elements are equal, we always prefer the left subarray element, preserving original order.

## When to Use Merge Sort

| Use merge sort when... | Reason |
|---|---|
| Guaranteed O(n log n) is required | No worst-case degradation (unlike Quick Sort) |
| Sorting a **linked list** | O(1) extra space (no aux array needed for list merge) |
| **Stable sort** is needed | Preserves relative order of equal elements |
| External sorting (data doesn't fit in RAM) | Merge naturally handles streaming/chunked data |
| **Counting inversions** problem | Augment merge step to count cross-inversions |

## Key Interview Patterns

### Counting Inversions

An inversion is a pair `(i, j)` where `i < j` but `arr[i] > arr[j]`. Modified merge sort counts them in O(n log n): when you pick from the right half during merge, all remaining left-half elements form inversions with it.

```cpp
long long countInversions(vector<int>& arr) {
    if (arr.size() <= 1) return 0;
    int mid = arr.size() / 2;
    vector<int> left(arr.begin(), arr.begin() + mid);
    vector<int> right(arr.begin() + mid, arr.end());
    long long count = countInversions(left) + countInversions(right);
    int i = 0, j = 0, k = 0;
    while (i < (int)left.size() && j < (int)right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else { count += left.size() - i; arr[k++] = right[j++]; }
    }
    while (i < (int)left.size())  arr[k++] = left[i++];
    while (j < (int)right.size()) arr[k++] = right[j++];
    return count;
}
```

```java
long countInversions(int[] arr) {
    if (arr.length <= 1) return 0;
    int mid = arr.length / 2;
    int[] left = Arrays.copyOfRange(arr, 0, mid);
    int[] right = Arrays.copyOfRange(arr, mid, arr.length);
    long count = countInversions(left) + countInversions(right);
    int i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else { count += left.length - i; arr[k++] = right[j++]; }
    }
    while (i < left.length)  arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
    return count;
}
```

```typescript
function countInversions(arr: number[]): number {
    if (arr.length <= 1) return 0;
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid), right = arr.slice(mid);
    let count = countInversions(left) + countInversions(right);
    let i = 0, j = 0, k = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else { count += left.length - i; arr[k++] = right[j++]; }
    }
    while (i < left.length)  arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
    return count;
}
```

```python
def count_inversions(arr: list[int]) -> int:
    if len(arr) <= 1:
        return 0

    mid = len(arr) // 2
    left, right = arr[:mid], arr[mid:]
    count = count_inversions(left) + count_inversions(right)

    i = j = k = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]; i += 1
        else:
            # All remaining elements in left[] are greater than right[j]
            count += len(left) - i   # key step
            arr[k] = right[j]; j += 1
        k += 1

    while i < len(left):  arr[k] = left[i];  i += 1; k += 1
    while j < len(right): arr[k] = right[j]; j += 1; k += 1
    return count
```

```go
func countInversions(arr []int) int64 {
    if len(arr) <= 1 { return 0 }
    mid := len(arr) / 2
    left := append([]int{}, arr[:mid]...)
    right := append([]int{}, arr[mid:]...)
    count := countInversions(left) + countInversions(right)
    i, j, k := 0, 0, 0
    for i < len(left) && j < len(right) {
        if left[i] <= right[j] { arr[k] = left[i]; i++ } else {
            count += int64(len(left) - i); arr[k] = right[j]; j++
        }
        k++
    }
    for i < len(left)  { arr[k] = left[i];  i++; k++ }
    for j < len(right) { arr[k] = right[j]; j++; k++ }
    return count
}
```

## Common Pitfalls

- **Off-by-one in mid calculation:** Always use `mid = left + (right - left) / 2` to avoid integer overflow (especially in C++/Java).
- **Forgetting to copy back:** The temp array must be written back into the original array after merging.
- **`left >= right` not `left == right`:** The base case must handle empty subarrays (when `left > right` due to a bug).
- **Memory allocation inside merge:** Avoid allocating the temp array inside the merge function in hot loops — pre-allocate once and pass it in.
