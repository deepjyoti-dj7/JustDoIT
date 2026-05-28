---
title: Quick Sort
description: The fastest average-case in-place sort — partition-based divide and conquer with O(n log n) average and critical pivot strategies
---

# Quick Sort

Quick Sort is the **fastest general-purpose in-place sorting algorithm in practice**. Despite its O(n²) worst case, it consistently outperforms merge sort on real-world data due to better cache performance and no auxiliary memory allocation. Every systems programmer should understand quick sort at a deep level — the partition step alone appears in dozens of interview problems.

## Core Intuition

**Pick a pivot. Partition. Recurse.**

The partition step rearranges the array so that:
- All elements **less than** the pivot are to its **left**
- All elements **greater than** the pivot are to its **right**
- The pivot is now in its **final sorted position**

Then recursively sort the left and right subarrays. The pivot doesn't need to be included in either recursive call — it's already in place.

```
[3, 6, 8, 10, 1, 2, 1]   pivot = 1 (last element)

After partition:
[1, 1, 8, 10, 3, 2, 6]
      ↑
   pivot in final position

Recurse left:  [1]         → already sorted
Recurse right: [8, 10, 3, 2, 6] → partition again
```

## The Partition Step (Lomuto Scheme)

The most interview-friendly partition. Maintains a "wall" pointer `i` that separates elements smaller than pivot from larger ones.

```
arr = [3, 6, 8, 10, 1, 2, 1],  pivot = arr[right] = 1
i = left - 1 = -1

j=0: arr[0]=3 > 1  → skip
j=1: arr[1]=6 > 1  → skip
j=2: arr[2]=8 > 1  → skip
j=3: arr[3]=10 > 1 → skip
j=4: arr[4]=1 ≤ 1  → i++, swap(arr[0], arr[4]) → [1, 6, 8, 10, 3, 2, 1]
j=5: arr[5]=2 > 1  → skip
j=6: (pivot, skip)

Final: swap(arr[i+1], arr[right]) → swap index 1 with 6
Result: [1, 1, 8, 10, 3, 2, 6]   pivot (1) at index 1
```

## Template

### Lomuto Partition (Cleaner Code)

```cpp
#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];  // last element as pivot
    int i = low - 1;        // wall: everything ≤ i is < pivot

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);  // place pivot in final position
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low >= high) return;
    int pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
}
```

```java
int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
        }
    }
    int temp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = temp;
    return i + 1;
}

void quickSort(int[] arr, int low, int high) {
    if (low >= high) return;
    int pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
}
```

```typescript
function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

function quickSort(arr: number[], low: number, high: number): void {
    if (low >= high) return;
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
}
```

```python
def quick_sort(arr: list[int], low: int, high: int) -> None:
    if low >= high:
        return
    pivot_idx = partition(arr, low, high)
    quick_sort(arr, low, pivot_idx - 1)
    quick_sort(arr, pivot_idx + 1, high)

def partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1
```

```go
func partition(arr []int, low, high int) int {
    pivot := arr[high]
    i := low - 1
    for j := low; j < high; j++ {
        if arr[j] <= pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1
}

func quickSort(arr []int, low, high int) {
    if low >= high { return }
    pivotIdx := partition(arr, low, high)
    quickSort(arr, low, pivotIdx-1)
    quickSort(arr, pivotIdx+1, high)
}
```

### Hoare Partition (Faster in Practice)

Hoare's original scheme uses two pointers moving toward each other. Fewer swaps on average, but trickier to implement correctly.

```cpp
int hoarePartition(vector<int>& arr, int low, int high) {
    int pivot = arr[low];  // first element as pivot
    int i = low - 1, j = high + 1;

    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        if (i >= j) return j;
        swap(arr[i], arr[j]);
    }
}
// Note: Hoare returns the partition index, NOT the pivot's final position.
// Recurse on [low, j] and [j+1, high] (not excluding j).
```

```java
int hoarePartition(int[] arr, int low, int high) {
    int pivot = arr[low], i = low - 1, j = high + 1;
    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        if (i >= j) return j;
        int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
}
// Recurse on [low, j] and [j+1, high]
```

```typescript
function hoarePartition(arr: number[], low: number, high: number): number {
    const pivot = arr[low];
    let i = low - 1, j = high + 1;
    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        if (i >= j) return j;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
// Recurse on [low, j] and [j+1, high]
```

```python
def hoare_partition(arr: list[int], low: int, high: int) -> int:
    pivot = arr[low]
    i, j = low - 1, high + 1
    while True:
        i += 1
        while arr[i] < pivot: i += 1
        j -= 1
        while arr[j] > pivot: j -= 1
        if i >= j: return j
        arr[i], arr[j] = arr[j], arr[i]
# Recurse on [low, j] and [j+1, high]
```

```go
func hoarePartition(arr []int, low, high int) int {
    pivot := arr[low]
    i, j := low-1, high+1
    for {
        for i++; arr[i] < pivot; i++ {}
        for j--; arr[j] > pivot; j-- {}
        if i >= j { return j }
        arr[i], arr[j] = arr[j], arr[i]
    }
}
// Recurse on [low, j] and [j+1, high]
```

## Pivot Selection Strategies

The choice of pivot is everything. A bad pivot (always min or max) leads to O(n²) worst case.

| Strategy | Worst Case Trigger | In Practice |
|---|---|---|
| **First element** | Already sorted array | Bad for real-world data |
| **Last element** (Lomuto default) | Already sorted array | Bad for real-world data |
| **Random element** | Extremely unlikely | Good — O(n log n) expected |
| **Median-of-three** | Contrived adversarial input | Excellent — used in `std::sort` |
| **Median-of-medians** | Never (guaranteed) | Too slow in practice — O(n) selection |

**Randomized pivot** is the standard defense in interviews:

```cpp
void quickSortRandom(vector<int>& arr, int low, int high) {
    if (low >= high) return;
    int randIdx = low + rand() % (high - low + 1);
    swap(arr[randIdx], arr[high]);  // swap random pivot to end
    int pivotIdx = partition(arr, low, high);
    quickSortRandom(arr, low, pivotIdx - 1);
    quickSortRandom(arr, pivotIdx + 1, high);
}
```

```java
void quickSortRandom(int[] arr, int low, int high) {
    if (low >= high) return;
    int randIdx = low + new Random().nextInt(high - low + 1);
    int tmp = arr[randIdx]; arr[randIdx] = arr[high]; arr[high] = tmp;
    int pivotIdx = partition(arr, low, high);
    quickSortRandom(arr, low, pivotIdx - 1);
    quickSortRandom(arr, pivotIdx + 1, high);
}
```

```typescript
function quickSortRandom(arr: number[], low: number, high: number): void {
    if (low >= high) return;
    const randIdx = low + Math.floor(Math.random() * (high - low + 1));
    [arr[randIdx], arr[high]] = [arr[high], arr[randIdx]];
    const pivotIdx = partition(arr, low, high);
    quickSortRandom(arr, low, pivotIdx - 1);
    quickSortRandom(arr, pivotIdx + 1, high);
}
```

```python
import random

def quick_sort_random(arr: list[int], low: int, high: int) -> None:
    if low >= high:
        return
    # Swap random pivot to end, then use Lomuto
    rand_idx = random.randint(low, high)
    arr[rand_idx], arr[high] = arr[high], arr[rand_idx]
    pivot_idx = partition(arr, low, high)
    quick_sort_random(arr, low, pivot_idx - 1)
    quick_sort_random(arr, pivot_idx + 1, high)
```

```go
func quickSortRandom(arr []int, low, high int) {
    if low >= high { return }
    randIdx := low + rand.Intn(high-low+1)
    arr[randIdx], arr[high] = arr[high], arr[randIdx]
    pivotIdx := partition(arr, low, high)
    quickSortRandom(arr, low, pivotIdx-1)
    quickSortRandom(arr, pivotIdx+1, high)
}
```

## Three-Way Partition (Dutch National Flag)

When the array has **many duplicate elements**, standard quick sort degrades because elements equal to the pivot end up on one side. Three-way partition (also called Dutch National Flag partition) handles duplicates optimally.

Partitions into three regions: `< pivot | == pivot | > pivot`

```cpp
void threeWayQuickSort(vector<int>& arr, int low, int high) {
    if (low >= high) return;

    int lt = low, gt = high, i = low;
    int pivot = arr[low];

    while (i <= gt) {
        if      (arr[i] < pivot) swap(arr[lt++], arr[i++]);
        else if (arr[i] > pivot) swap(arr[i],    arr[gt--]);
        else                     i++;  // arr[i] == pivot: just advance
    }
    // arr[low..lt-1] < pivot
    // arr[lt..gt]   == pivot (all in final position)
    // arr[gt+1..high] > pivot
    threeWayQuickSort(arr, low, lt - 1);
    threeWayQuickSort(arr, gt + 1, high);
}
```

```java
void threeWayQuickSort(int[] arr, int low, int high) {
    if (low >= high) return;
    int lt = low, gt = high, i = low, pivot = arr[low];
    while (i <= gt) {
        if      (arr[i] < pivot) { swap(arr, lt++, i++); }
        else if (arr[i] > pivot) { swap(arr, i, gt--); }
        else                     { i++; }
    }
    threeWayQuickSort(arr, low, lt - 1);
    threeWayQuickSort(arr, gt + 1, high);
}
```

```typescript
function threeWayQuickSort(arr: number[], low: number, high: number): void {
    if (low >= high) return;
    let lt = low, gt = high, i = low;
    const pivot = arr[low];
    while (i <= gt) {
        if      (arr[i] < pivot) { [arr[lt++], arr[i++]] = [arr[i], arr[lt]]; }
        else if (arr[i] > pivot) { [arr[i], arr[gt--]] = [arr[gt], arr[i]]; }
        else                     { i++; }
    }
    threeWayQuickSort(arr, low, lt - 1);
    threeWayQuickSort(arr, gt + 1, high);
}
```

```python
def three_way_quick_sort(arr: list[int], low: int, high: int) -> None:
    if low >= high: return
    lt, gt, i = low, high, low
    pivot = arr[low]
    while i <= gt:
        if   arr[i] < pivot: arr[lt], arr[i] = arr[i], arr[lt]; lt += 1; i += 1
        elif arr[i] > pivot: arr[i], arr[gt] = arr[gt], arr[i]; gt -= 1
        else:                i += 1
    three_way_quick_sort(arr, low, lt - 1)
    three_way_quick_sort(arr, gt + 1, high)
```

```go
func threeWayQuickSort(arr []int, low, high int) {
    if low >= high { return }
    lt, gt, i, pivot := low, high, low, arr[low]
    for i <= gt {
        if      arr[i] < pivot { arr[lt], arr[i] = arr[i], arr[lt]; lt++; i++ }
        else if arr[i] > pivot { arr[i], arr[gt] = arr[gt], arr[i]; gt-- }
        else                   { i++ }
    }
    threeWayQuickSort(arr, low, lt-1)
    threeWayQuickSort(arr, gt+1, high)
}
```

## QuickSelect: Finding the Kth Smallest (O(n) Average)

The partition step alone can answer "find the kth smallest element" without fully sorting. After one partition, the pivot is in its final position — compare with k to decide which half to recurse into.

```cpp
int quickSelect(vector<int>& arr, int low, int high, int k) {
    if (low == high) return arr[low];
    int pivotIdx = partition(arr, low, high);
    if      (pivotIdx == k) return arr[pivotIdx];
    else if (k < pivotIdx)  return quickSelect(arr, low, pivotIdx - 1, k);
    else                    return quickSelect(arr, pivotIdx + 1, high, k);
}
```

```java
int quickSelect(int[] arr, int low, int high, int k) {
    if (low == high) return arr[low];
    int pivotIdx = partition(arr, low, high);
    if      (pivotIdx == k) return arr[pivotIdx];
    else if (k < pivotIdx)  return quickSelect(arr, low, pivotIdx - 1, k);
    else                    return quickSelect(arr, pivotIdx + 1, high, k);
}
```

```typescript
function quickSelect(arr: number[], low: number, high: number, k: number): number {
    if (low === high) return arr[low];
    const pivotIdx = partition(arr, low, high);
    if      (pivotIdx === k) return arr[pivotIdx];
    else if (k < pivotIdx)   return quickSelect(arr, low, pivotIdx - 1, k);
    else                     return quickSelect(arr, pivotIdx + 1, high, k);
}
```

```python
def quick_select(arr: list[int], low: int, high: int, k: int) -> int:
    """Returns the kth smallest element (0-indexed k)."""
    if low == high:
        return arr[low]

    pivot_idx = partition(arr, low, high)

    if pivot_idx == k:
        return arr[pivot_idx]
    elif k < pivot_idx:
        return quick_select(arr, low, pivot_idx - 1, k)
    else:
        return quick_select(arr, pivot_idx + 1, high, k)
```

```go
func quickSelect(arr []int, low, high, k int) int {
    if low == high { return arr[low] }
    pivotIdx := partition(arr, low, high)
    if      pivotIdx == k { return arr[pivotIdx] }
    else if k < pivotIdx  { return quickSelect(arr, low, pivotIdx-1, k) }
    return quickSelect(arr, pivotIdx+1, high, k)
}
```

QuickSelect is the O(n) average algorithm behind `nth_element` in C++ STL.

## Complexity

| Case | Time | Space |
|---|---|---|
| Best | O(n log n) | O(log n) stack |
| Average | O(n log n) | O(log n) stack |
| Worst | O(n²) | O(n) stack |

The worst case occurs when every pivot is the min or max — causing maximally unbalanced partitions. With random pivot selection, the probability of consistently bad pivots is astronomically low.

## Quick Sort vs Merge Sort

| Property | Quick Sort | Merge Sort |
|---|---|---|
| Average Time | O(n log n) | O(n log n) |
| Worst Time | O(n²) | O(n log n) |
| Space | O(log n) | O(n) |
| Stable | No | Yes |
| Cache-friendly | Yes | No |
| Linked Lists | Poor | Excellent |
| In-place | Yes | No (needs aux array) |

**Quick sort wins in practice** for in-memory sorting due to cache locality — it modifies data in-place with good spatial access patterns. Modern implementations (`introsort` in C++ `std::sort`) combine quick sort, heap sort, and insertion sort to get the best of all worlds.

## Common Pitfalls

- **Forgetting randomization:** Naive pivot selection → O(n²) on sorted input — a common interview trap.
- **Infinite loop with duplicates:** Lomuto can produce unbalanced partitions with all-equal arrays; three-way partition solves this.
- **Stack overflow on large sorted input:** Worst-case O(n) recursion depth → stack overflow for large n. Mitigation: randomize pivot, or switch to iterative + explicit stack.
- **Off-by-one in Hoare vs Lomuto:** Hoare's pivot doesn't land in its final position after partition — the recursion bounds differ.
