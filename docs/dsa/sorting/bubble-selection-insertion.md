---
title: Bubble, Selection & Insertion Sort
description: The foundational O(n²) sorting algorithms — their mechanics, tradeoffs, and when they're still the right choice
---

# Bubble, Selection & Insertion Sort

These three algorithms are the "simple" sorts. They're rarely used for large inputs in production, but they teach the **core mechanics of sorting** — comparison, swapping, and in-place rearrangement. You'll encounter them in interviews as building blocks, as edge-case scenarios (nearly sorted input), or as the first step in a "why not just use this?" follow-up.

## Bubble Sort

### Intuition

Bubble Sort makes repeated passes over the array. On each pass, adjacent pairs are compared and swapped if out of order. After each full pass, the **largest unsorted element "bubbles up"** to its correct position at the end.

```
Pass 1: [5, 3, 8, 1] → [3, 5, 1, 8]  (8 is now in place)
Pass 2: [3, 5, 1, 8] → [3, 1, 5, 8]  (5 is now in place)
Pass 3: [3, 1, 5, 8] → [1, 3, 5, 8]  (done)
```

### Template

```cpp
void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {  // last i elements already sorted
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;  // early termination: already sorted
    }
}
```

```java
void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}
```

```typescript
function bubbleSort(arr: number[]): void {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}
```

```python
def bubble_sort(arr: list[int]) -> None:
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # already sorted
```

```go
func bubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        swapped := false
        for j := 0; j < n-1-i; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = true
            }
        }
        if !swapped { break }
    }
}
```

### Complexity

| Case | Time | Space |
|---|---|---|
| Best (already sorted) | O(n) with early exit | O(1) |
| Average | O(n²) | O(1) |
| Worst (reversed) | O(n²) | O(1) |

**Stable:** Yes — equal elements never swap.

---

## Selection Sort

### Intuition

Selection Sort divides the array into a sorted left portion and an unsorted right portion. On each pass, it **selects the minimum from the unsorted portion** and swaps it to the boundary.

```
[5, 3, 8, 1]   find min(all) = 1 → swap with index 0
[1, 3, 8, 5]   find min(1..3) = 3 → already at index 1
[1, 3, 8, 5]   find min(2..3) = 5 → swap with index 2
[1, 3, 5, 8]   done
```

The key difference from Bubble Sort: Selection Sort does at most **n-1 swaps** — regardless of input. This makes it useful when writes/swaps are expensive.

### Template

```cpp
void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        if (minIdx != i) swap(arr[i], arr[minIdx]);
    }
}
```

```java
void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        int temp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = temp;
    }
}
```

```typescript
function selectionSort(arr: number[]): void {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
}
```

```python
def selection_sort(arr: list[int]) -> None:
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
```

```go
func selectionSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        minIdx := i
        for j := i + 1; j < n; j++ {
            if arr[j] < arr[minIdx] { minIdx = j }
        }
        arr[i], arr[minIdx] = arr[minIdx], arr[i]
    }
}
```

### Complexity

| Case | Time | Space |
|---|---|---|
| All cases | O(n²) | O(1) |

**Stable:** No — swapping non-adjacent elements can break stability. (Can be made stable with insertion instead of swap.)

**When swap count matters:** Selection Sort does exactly n-1 swaps (one per pass). Useful for flash memory or other write-expensive media.

---

## Insertion Sort

### Intuition

Insertion Sort builds a sorted portion **from left to right**. For each new element, it finds its correct position by shifting larger elements rightward — like how you'd sort a hand of playing cards.

```
[5, 3, 8, 1]
 ^           sorted=[5]
[3, 5, 8, 1] ← 3 inserted before 5
    ^         sorted=[3,5]
[3, 5, 8, 1] ← 8 stays in place
       ^      sorted=[3,5,8]
[1, 3, 5, 8] ← 1 inserted at front
          ^   sorted=[1,3,5,8]
```

### Template

```cpp
void insertionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];  // shift right
            j--;
        }
        arr[j + 1] = key;  // insert in correct position
    }
}
```

```java
void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

```typescript
function insertionSort(arr: number[]): void {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}
```

```python
def insertion_sort(arr: list[int]) -> None:
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
```

```go
func insertionSort(arr []int) {
    for i := 1; i < len(arr); i++ {
        key := arr[i]
        j := i - 1
        for j >= 0 && arr[j] > key {
            arr[j+1] = arr[j]
            j--
        }
        arr[j+1] = key
    }
}
```

### Complexity

| Case | Time | Space |
|---|---|---|
| Best (already sorted) | O(n) | O(1) |
| Average | O(n²) | O(1) |
| Worst (reversed) | O(n²) | O(1) |

**Stable:** Yes — equal elements are never moved past each other.

**Adaptive:** Yes — runs in O(n) on nearly-sorted arrays. This is why Timsort (Python, Java's Arrays.sort for objects) uses Insertion Sort for small subarrays.

---

## Side-by-Side Comparison

| Property | Bubble | Selection | Insertion |
|---|---|---|---|
| Time (best) | O(n) | O(n²) | **O(n)** |
| Time (average) | O(n²) | O(n²) | O(n²) |
| Time (worst) | O(n²) | O(n²) | O(n²) |
| Space | O(1) | O(1) | O(1) |
| Stable | ✅ | ❌ | ✅ |
| Adaptive | ✅ | ❌ | ✅ |
| Swaps | O(n²) | **O(n)** | O(n²) |
| Practical use | Rare | Write-limited | **Small/nearly-sorted** |

## When Each Appears in Interviews

- **Bubble Sort:** Almost never useful in practice. Interviewers ask it to test your knowledge of optimization (early exit flag) and stability.
- **Selection Sort:** Useful to discuss when minimizing writes. Rarely the answer to an interview problem.
- **Insertion Sort:** The important one. Appears as:
  - Sorting a small subarray
  - Online sorting (elements arrive one at a time)
  - The inner loop of Timsort / Introsort
  - Building a sorted hand of cards

## Key Interview Insights

- **"Which is best for nearly-sorted data?"** → Insertion Sort (O(n) best case). Neither Bubble (does unnecessary comparisons) nor Selection (always O(n²)) matches this.
- **"Which minimizes memory writes?"** → Selection Sort (at most n-1 swaps).
- **"Which is stable?"** → Bubble and Insertion. Selection is NOT stable by default.
- **Insertion Sort is used inside hybrid sorts (Timsort, Introsort) for small n** — below a threshold (typically 8–32 elements), the low overhead of Insertion Sort beats O(n log n) algorithms.
