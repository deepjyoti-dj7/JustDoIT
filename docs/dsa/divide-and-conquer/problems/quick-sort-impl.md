---
title: Quick Sort Implementation
difficulty: Medium
tags: [Divide and Conquer, Sorting, Partitioning]
link: https://leetcode.com/problems/sort-an-array/
---

# Quick Sort Implementation

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [912. Sort an Array](https://leetcode.com/problems/sort-an-array/) |
| **Tags** | Divide and Conquer, Sorting, Partitioning |

## Problem Statement

Given an array of integers `nums`, sort the array in ascending order and return it. Implement Quick Sort, understanding its partition strategy and performance characteristics.

---

## Intuition

Quick sort's insight is the opposite of merge sort: **do all the hard work during the split (partitioning), and the combine step becomes trivial**.

The **partition** step places a chosen pivot element into its final sorted position — everything to its left is smaller, everything to its right is larger. After partitioning, recursively sort both sides. No merge needed.

The pivot's position after partitioning is permanent. Each recursive call processes strictly fewer elements. On average, each partition splits the array in half → O(n log n).

**The danger:** If the pivot is always the min or max (sorted input with naive pivot), every partition peels off just one element → O(n²). Randomization fixes this.

---

## Partition Schemes

### Lomuto Partition
Simpler to understand. Uses `end` as pivot. Maintains a "wall" index `i`; elements `≤ pivot` are swapped to the left side.

### Hoare Partition
More efficient in practice (3× fewer swaps on average). Uses two pointers moving inward. Pivot ends up somewhere in the middle (not necessarily at its final sorted position after one call — handled by the recursion bounds).

---

## Approach 1: Lomuto Partition (Simpler)

```cpp
int lomuto(vector<int>& arr, int lo, int hi) {
    int pivot = arr[hi];          // last element as pivot
    int i = lo - 1;               // wall
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            swap(arr[++i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[hi]);    // place pivot at wall+1
    return i + 1;
}

void quickSort(vector<int>& arr, int lo, int hi) {
    if (lo >= hi) return;
    // Randomize pivot to avoid O(n²) on sorted input
    int r = lo + rand() % (hi - lo + 1);
    swap(arr[r], arr[hi]);
    int p = lomuto(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
}

vector<int> sortArray(vector<int>& nums) {
    quickSort(nums, 0, (int)nums.size() - 1);
    return nums;
}
```

```java
int lomuto(int[] arr, int lo, int hi) {
    int pivot = arr[hi], i = lo - 1;
    for (int j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            int tmp = arr[++i]; arr[i] = arr[j]; arr[j] = tmp;
        }
    }
    int tmp = arr[i + 1]; arr[i + 1] = arr[hi]; arr[hi] = tmp;
    return i + 1;
}

void quickSort(int[] arr, int lo, int hi, Random rnd) {
    if (lo >= hi) return;
    int r = lo + rnd.nextInt(hi - lo + 1);
    int tmp = arr[r]; arr[r] = arr[hi]; arr[hi] = tmp;
    int p = lomuto(arr, lo, hi);
    quickSort(arr, lo, p - 1, rnd);
    quickSort(arr, p + 1, hi, rnd);
}

int[] sortArray(int[] nums) {
    quickSort(nums, 0, nums.length - 1, new Random());
    return nums;
}
```

```typescript
function sortArray(nums: number[]): number[] {
    quickSort(nums, 0, nums.length - 1);
    return nums;
}

function quickSort(arr: number[], lo: number, hi: number): void {
    if (lo >= hi) return;
    const r = lo + Math.floor(Math.random() * (hi - lo + 1));
    [arr[r], arr[hi]] = [arr[hi], arr[r]];
    const p = lomuto(arr, lo, hi);
    quickSort(arr, lo, p - 1);
    quickSort(arr, p + 1, hi);
}

function lomuto(arr: number[], lo: number, hi: number): number {
    const pivot = arr[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    return i + 1;
}
```

```python
import random

def sort_array(nums: list[int]) -> list[int]:
    quick_sort(nums, 0, len(nums) - 1)
    return nums

def quick_sort(arr: list[int], lo: int, hi: int) -> None:
    if lo >= hi:
        return
    r = random.randint(lo, hi)
    arr[r], arr[hi] = arr[hi], arr[r]
    p = lomuto(arr, lo, hi)
    quick_sort(arr, lo, p - 1)
    quick_sort(arr, p + 1, hi)

def lomuto(arr: list[int], lo: int, hi: int) -> int:
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1
```

```go
import "math/rand"

func sortArray(nums []int) []int {
    quickSort(nums, 0, len(nums)-1)
    return nums
}

func quickSort(arr []int, lo, hi int) {
    if lo >= hi { return }
    r := lo + rand.Intn(hi-lo+1)
    arr[r], arr[hi] = arr[hi], arr[r]
    p := lomuto(arr, lo, hi)
    quickSort(arr, lo, p-1)
    quickSort(arr, p+1, hi)
}

func lomuto(arr []int, lo, hi int) int {
    pivot, i := arr[hi], lo-1
    for j := lo; j < hi; j++ {
        if arr[j] <= pivot {
            i++
            arr[i], arr[j] = arr[j], arr[i]
        }
    }
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i + 1
}
```

**Time:** O(n log n) avg, O(n²) worst — **Space:** O(log n) avg stack

---

## Approach 2: Hoare Partition (Efficient)

Hoare's scheme uses two inward-moving pointers. More swaps are avoided compared to Lomuto. Note: the pivot is NOT guaranteed to be at index `p` after partitioning — just everything left of `p+1` is `≤ pivot` and everything from `p+1` onward is `≥ pivot`.

```cpp
int hoare(vector<int>& arr, int lo, int hi) {
    int pivot = arr[lo + (hi - lo) / 2]; // middle element
    int i = lo - 1, j = hi + 1;
    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        if (i >= j) return j;
        swap(arr[i], arr[j]);
    }
}

void quickSortHoare(vector<int>& arr, int lo, int hi) {
    if (lo >= hi) return;
    int p = hoare(arr, lo, hi);
    quickSortHoare(arr, lo, p);       // note: p, not p-1
    quickSortHoare(arr, p + 1, hi);
}
```

```java
int hoare(int[] arr, int lo, int hi) {
    int pivot = arr[lo + (hi - lo) / 2];
    int i = lo - 1, j = hi + 1;
    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        if (i >= j) return j;
        int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
}

void quickSortHoare(int[] arr, int lo, int hi) {
    if (lo >= hi) return;
    int p = hoare(arr, lo, hi);
    quickSortHoare(arr, lo, p);
    quickSortHoare(arr, p + 1, hi);
}
```

```typescript
function hoare(arr: number[], lo: number, hi: number): number {
    const pivot = arr[lo + ((hi - lo) >> 1)];
    let i = lo - 1, j = hi + 1;
    while (true) {
        do { i++; } while (arr[i] < pivot);
        do { j--; } while (arr[j] > pivot);
        if (i >= j) return j;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function quickSortHoare(arr: number[], lo: number, hi: number): void {
    if (lo >= hi) return;
    const p = hoare(arr, lo, hi);
    quickSortHoare(arr, lo, p);
    quickSortHoare(arr, p + 1, hi);
}
```

```python
def hoare(arr: list[int], lo: int, hi: int) -> int:
    pivot = arr[lo + (hi - lo) // 2]
    i, j = lo - 1, hi + 1
    while True:
        i += 1
        while arr[i] < pivot: i += 1
        j -= 1
        while arr[j] > pivot: j -= 1
        if i >= j: return j
        arr[i], arr[j] = arr[j], arr[i]

def quick_sort_hoare(arr: list[int], lo: int, hi: int) -> None:
    if lo >= hi: return
    p = hoare(arr, lo, hi)
    quick_sort_hoare(arr, lo, p)      # note: p, not p-1
    quick_sort_hoare(arr, p + 1, hi)
```

```go
func hoare(arr []int, lo, hi int) int {
    pivot := arr[lo+(hi-lo)/2]
    i, j := lo-1, hi+1
    for {
        for { i++; if arr[i] >= pivot { break } }
        for { j--; if arr[j] <= pivot { break } }
        if i >= j { return j }
        arr[i], arr[j] = arr[j], arr[i]
    }
}

func quickSortHoare(arr []int, lo, hi int) {
    if lo >= hi { return }
    p := hoare(arr, lo, hi)
    quickSortHoare(arr, lo, p)
    quickSortHoare(arr, p+1, hi)
}
```

**Time:** O(n log n) avg — **Space:** O(log n) avg stack

---

## Approach 3: Three-Way Partition (Dutch National Flag)

Handles arrays with many duplicate elements. Partitions into three regions: `< pivot`, `= pivot`, `> pivot`. Elements equal to pivot are already in their final positions — skip them in recursive calls.

```cpp
void threeWay(vector<int>& arr, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = arr[lo + rand() % (hi - lo + 1)];
    int lt = lo, gt = hi, i = lo;
    while (i <= gt) {
        if      (arr[i] < pivot) swap(arr[lt++], arr[i++]);
        else if (arr[i] > pivot) swap(arr[i],    arr[gt--]);
        else                     i++;
    }
    threeWay(arr, lo, lt - 1);
    threeWay(arr, gt + 1, hi);
}
```

```java
void threeWay(int[] arr, int lo, int hi, Random rnd) {
    if (lo >= hi) return;
    int pivot = arr[lo + rnd.nextInt(hi - lo + 1)];
    int lt = lo, gt = hi, i = lo;
    while (i <= gt) {
        int cmp = Integer.compare(arr[i], pivot);
        if      (cmp < 0) { int t=arr[lt]; arr[lt]=arr[i]; arr[i]=t; lt++; i++; }
        else if (cmp > 0) { int t=arr[gt]; arr[gt]=arr[i]; arr[i]=t; gt--; }
        else              { i++; }
    }
    threeWay(arr, lo, lt - 1, rnd);
    threeWay(arr, gt + 1, hi, rnd);
}
```

```typescript
function threeWay(arr: number[], lo: number, hi: number): void {
    if (lo >= hi) return;
    const pivot = arr[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let lt = lo, gt = hi, i = lo;
    while (i <= gt) {
        if      (arr[i] < pivot) { [arr[lt++], arr[i++]] = [arr[i], arr[lt]]; }
        else if (arr[i] > pivot) { [arr[i], arr[gt--]]   = [arr[gt], arr[i]]; }
        else                     { i++; }
    }
    threeWay(arr, lo, lt - 1);
    threeWay(arr, gt + 1, hi);
}
```

```python
import random

def three_way(arr: list[int], lo: int, hi: int) -> None:
    if lo >= hi:
        return
    pivot = arr[random.randint(lo, hi)]
    lt, i, gt = lo, lo, hi
    while i <= gt:
        if arr[i] < pivot:
            arr[lt], arr[i] = arr[i], arr[lt]
            lt += 1; i += 1
        elif arr[i] > pivot:
            arr[i], arr[gt] = arr[gt], arr[i]
            gt -= 1
        else:
            i += 1
    three_way(arr, lo, lt - 1)
    three_way(arr, gt + 1, hi)
```

```go
func threeWay(arr []int, lo, hi int) {
    if lo >= hi { return }
    pivot := arr[lo+rand.Intn(hi-lo+1)]
    lt, i, gt := lo, lo, hi
    for i <= gt {
        if arr[i] < pivot {
            arr[lt], arr[i] = arr[i], arr[lt]; lt++; i++
        } else if arr[i] > pivot {
            arr[i], arr[gt] = arr[gt], arr[i]; gt--
        } else {
            i++
        }
    }
    threeWay(arr, lo, lt-1)
    threeWay(arr, gt+1, hi)
}
```

**Time:** O(n log n) avg, O(n) when all duplicates — **Space:** O(log n)

---

## Dry Run (Lomuto, `[3,1,4,2]`, pivot=2)

```
arr = [3,1,4,2], lo=0, hi=3
Swap random pivot to hi: arr[hi]=2 already fine
pivot=2, i=-1

j=0: arr[0]=3 > 2 → skip
j=1: arr[1]=1 ≤ 2 → i=0, swap arr[0]↔arr[1] → [1,3,4,2]
j=2: arr[2]=4 > 2 → skip
Place pivot: swap arr[i+1]=arr[1]↔arr[hi]=arr[3] → [1,2,4,3]
Pivot at index 1

Recurse left [1], right [4,3]
  [4,3]: pivot=3, i=0, j=0: arr[0]=4>3 skip; place pivot → [3,4]
Result: [1,2,3,4] ✓
```

---

## Comparison

| Property | Quick Sort | Merge Sort |
|---|---|---|
| Time (avg) | O(n log n) | O(n log n) |
| Time (worst) | O(n²) | O(n log n) |
| Space | O(log n) stack | O(n) auxiliary |
| Stable | No | Yes |
| In-place | Yes | No |
| Cache behavior | Excellent | Good |
| Best for | Arrays (cache-friendly) | Linked lists, stability needed |

---

## Key Interview Insights

- **Always randomize the pivot** — naive last/first element pivot degrades to O(n²) on sorted/reverse-sorted input, which is common in practice.
- **Hoare vs Lomuto:** Hoare does 3× fewer swaps; use it when performance matters. Lomuto is easier to implement correctly under pressure.
- **Three-way partition is the best default** — handles duplicates efficiently and is how Java's `Arrays.sort` works for primitives.
- **Quick sort is not stable** — equal elements can change relative order. If stability is required, use merge sort.
- **QuickSelect uses the same partition logic** but only recurses into one side → O(n) average for finding the k-th element.
- **Tail-call optimization trick:** Always recurse on the smaller half first (and loop for the larger) to guarantee O(log n) stack space.
