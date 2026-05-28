---
title: Merge Sort Implementation
difficulty: Medium
tags: [Divide and Conquer, Sorting, Stable Sort]
link: https://leetcode.com/problems/sort-an-array/
---

# Merge Sort Implementation

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [912. Sort an Array](https://leetcode.com/problems/sort-an-array/) |
| **Tags** | Divide and Conquer, Sorting, Stable Sort |

## Problem Statement

Given an array of integers `nums`, sort the array in ascending order and return it. You must solve the problem **without using any built-in functions** in O(n log n) time complexity and with the smallest space complexity possible.

---

## Intuition

Merge sort is the canonical divide-and-conquer sorting algorithm. The key insight is that **merging two already-sorted arrays is O(n)** — much cheaper than sorting from scratch.

Split the array in half recursively until every subarray has one element (trivially sorted). Then merge pairs back up the recursion tree. Each merge level does O(n) total work, and there are O(log n) levels, giving O(n log n) overall.

**Why it's better than O(n²) sorts:** Selection sort and insertion sort do O(n) work per element. Merge sort does O(log n) splits × O(n) merges = O(n log n). The recursion tree is the engine of efficiency.

---

## Approach 1: Top-Down (Recursive) Merge Sort

Recursively split to single elements, then merge on the way back up.

The merge step uses two pointers on the two sorted halves and copies the smaller element each time.

```cpp
void merge(vector<int>& arr, int lo, int mid, int hi, vector<int>& tmp) {
    for (int i = lo; i <= hi; i++) tmp[i] = arr[i]; // copy to temp
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) {
        if (tmp[i] <= tmp[j]) arr[k++] = tmp[i++];
        else                  arr[k++] = tmp[j++];
    }
    while (i <= mid) arr[k++] = tmp[i++];
    while (j <= hi)  arr[k++] = tmp[j++];
}

void mergeSort(vector<int>& arr, int lo, int hi, vector<int>& tmp) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(arr, lo, mid, tmp);
    mergeSort(arr, mid + 1, hi, tmp);
    merge(arr, lo, mid, hi, tmp);
}

vector<int> sortArray(vector<int>& nums) {
    vector<int> tmp(nums.size());
    mergeSort(nums, 0, (int)nums.size() - 1, tmp);
    return nums;
}
```

```java
void merge(int[] arr, int lo, int mid, int hi, int[] tmp) {
    for (int i = lo; i <= hi; i++) tmp[i] = arr[i];
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) {
        if (tmp[i] <= tmp[j]) arr[k++] = tmp[i++];
        else                  arr[k++] = tmp[j++];
    }
    while (i <= mid) arr[k++] = tmp[i++];
    while (j <= hi)  arr[k++] = tmp[j++];
}

void mergeSort(int[] arr, int lo, int hi, int[] tmp) {
    if (lo >= hi) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(arr, lo, mid, tmp);
    mergeSort(arr, mid + 1, hi, tmp);
    merge(arr, lo, mid, hi, tmp);
}

int[] sortArray(int[] nums) {
    int[] tmp = new int[nums.length];
    mergeSort(nums, 0, nums.length - 1, tmp);
    return nums;
}
```

```typescript
function sortArray(nums: number[]): number[] {
    const tmp = new Array(nums.length);
    mergeSort(nums, 0, nums.length - 1, tmp);
    return nums;
}

function mergeSort(arr: number[], lo: number, hi: number, tmp: number[]): void {
    if (lo >= hi) return;
    const mid = lo + ((hi - lo) >> 1);
    mergeSort(arr, lo, mid, tmp);
    mergeSort(arr, mid + 1, hi, tmp);
    merge(arr, lo, mid, hi, tmp);
}

function merge(arr: number[], lo: number, mid: number, hi: number, tmp: number[]): void {
    for (let i = lo; i <= hi; i++) tmp[i] = arr[i];
    let i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi)
        arr[k++] = tmp[i] <= tmp[j] ? tmp[i++] : tmp[j++];
    while (i <= mid) arr[k++] = tmp[i++];
    while (j <= hi)  arr[k++] = tmp[j++];
}
```

```python
def sort_array(nums: list[int]) -> list[int]:
    tmp = [0] * len(nums)
    merge_sort(nums, 0, len(nums) - 1, tmp)
    return nums

def merge_sort(arr: list[int], lo: int, hi: int, tmp: list[int]) -> None:
    if lo >= hi:
        return
    mid = lo + (hi - lo) // 2
    merge_sort(arr, lo, mid, tmp)
    merge_sort(arr, mid + 1, hi, tmp)
    merge(arr, lo, mid, hi, tmp)

def merge(arr: list[int], lo: int, mid: int, hi: int, tmp: list[int]) -> None:
    tmp[lo:hi+1] = arr[lo:hi+1]
    i, j, k = lo, mid + 1, lo
    while i <= mid and j <= hi:
        if tmp[i] <= tmp[j]:
            arr[k] = tmp[i]; i += 1
        else:
            arr[k] = tmp[j]; j += 1
        k += 1
    while i <= mid: arr[k] = tmp[i]; k += 1; i += 1
    while j <= hi:  arr[k] = tmp[j]; k += 1; j += 1
```

```go
func sortArray(nums []int) []int {
    tmp := make([]int, len(nums))
    mergeSort(nums, 0, len(nums)-1, tmp)
    return nums
}

func mergeSort(arr []int, lo, hi int, tmp []int) {
    if lo >= hi { return }
    mid := lo + (hi-lo)/2
    mergeSort(arr, lo, mid, tmp)
    mergeSort(arr, mid+1, hi, tmp)
    mergeParts(arr, lo, mid, hi, tmp)
}

func mergeParts(arr []int, lo, mid, hi int, tmp []int) {
    copy(tmp[lo:hi+1], arr[lo:hi+1])
    i, j, k := lo, mid+1, lo
    for i <= mid && j <= hi {
        if tmp[i] <= tmp[j] { arr[k] = tmp[i]; i++ } else { arr[k] = tmp[j]; j++ }
        k++
    }
    for i <= mid { arr[k] = tmp[i]; i++; k++ }
    for j <= hi  { arr[k] = tmp[j]; j++; k++ }
}
```

**Time:** O(n log n) — **Space:** O(n) for temp array + O(log n) stack

---

## Approach 2: Bottom-Up (Iterative) Merge Sort

Avoid recursion entirely. Start by sorting subarrays of size 1, then 2, then 4, etc. Eliminates function call overhead and stack space.

```cpp
vector<int> sortArray(vector<int>& nums) {
    int n = nums.size();
    vector<int> tmp(n);
    for (int width = 1; width < n; width *= 2) {
        for (int lo = 0; lo < n; lo += 2 * width) {
            int mid = min(lo + width - 1, n - 1);
            int hi  = min(lo + 2 * width - 1, n - 1);
            if (mid < hi)
                merge(nums, lo, mid, hi, tmp);  // same merge as above
        }
    }
    return nums;
}
```

```java
int[] sortArray(int[] nums) {
    int n = nums.length;
    int[] tmp = new int[n];
    for (int width = 1; width < n; width *= 2) {
        for (int lo = 0; lo < n; lo += 2 * width) {
            int mid = Math.min(lo + width - 1, n - 1);
            int hi  = Math.min(lo + 2 * width - 1, n - 1);
            if (mid < hi) merge(nums, lo, mid, hi, tmp);
        }
    }
    return nums;
}
```

```typescript
function sortArrayIterative(nums: number[]): number[] {
    const n = nums.length, tmp = new Array(n);
    for (let width = 1; width < n; width *= 2) {
        for (let lo = 0; lo < n; lo += 2 * width) {
            const mid = Math.min(lo + width - 1, n - 1);
            const hi  = Math.min(lo + 2 * width - 1, n - 1);
            if (mid < hi) merge(nums, lo, mid, hi, tmp);
        }
    }
    return nums;
}
```

```python
def sort_array_iterative(nums: list[int]) -> list[int]:
    n = len(nums)
    tmp = [0] * n
    width = 1
    while width < n:
        lo = 0
        while lo < n:
            mid = min(lo + width - 1, n - 1)
            hi  = min(lo + 2 * width - 1, n - 1)
            if mid < hi:
                merge(nums, lo, mid, hi, tmp)
            lo += 2 * width
        width *= 2
    return nums
```

```go
func sortArrayIterative(nums []int) []int {
    n := len(nums)
    tmp := make([]int, n)
    for width := 1; width < n; width *= 2 {
        for lo := 0; lo < n; lo += 2 * width {
            mid := lo + width - 1
            if mid >= n { mid = n - 1 }
            hi := lo + 2*width - 1
            if hi >= n { hi = n - 1 }
            if mid < hi {
                mergeParts(nums, lo, mid, hi, tmp)
            }
        }
    }
    return nums
}
```

**Time:** O(n log n) — **Space:** O(n) — no recursion stack

---

## Dry Run (Top-Down, small example)

`[3, 1, 4, 2]`

```
Split: [3,1] | [4,2]
  Split [3,1]: [3] | [1]  → merge → [1,3]
  Split [4,2]: [4] | [2]  → merge → [2,4]
Merge [1,3] + [2,4]:
  i=1, j=2: 1<2 → take 1, i=3
  i=3, j=2: 3>2 → take 2, j=4
  i=3, j exhausted → take 3
  take 4
Result: [1,2,3,4] ✓
```

---

## Merge Sort Properties

| Property | Value |
|---|---|
| Time (best / avg / worst) | O(n log n) / O(n log n) / O(n log n) |
| Space | O(n) auxiliary |
| Stable? | Yes — equal elements preserve original order |
| In-place? | No (standard version) |
| Cache-friendly? | Mostly — sequential access pattern |
| Parallelizable? | Yes — each half is independent |

---

## Key Interview Insights

- **Merge sort is the preferred sort for linked lists** — it doesn't require random access, and merging linked lists is O(1) space.
- **Stability matters:** If you need to sort by multiple keys (e.g., first by name, then by age), a stable sort preserves the previous sort order.
- **Why not in-place?** True in-place merge sort exists but is O(n log² n) and complex to implement. Not worth it in practice.
- **The temp array trick:** Allocate `tmp` once at the top level, not inside the recursive call — this avoids O(n log n) total allocations.
- **Merge sort is predictable:** Unlike quick sort, it's O(n log n) worst case. Preferred when guaranteed performance matters more than cache behavior.
- **Bottom-up avoids stack overflow** on very large arrays where the recursion depth O(log n) could theoretically be an issue.
