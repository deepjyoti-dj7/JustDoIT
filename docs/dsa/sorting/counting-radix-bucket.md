---
title: Counting, Radix & Bucket Sort
description: Linear-time sorting algorithms that break the O(n log n) comparison barrier by exploiting structure in the data
---

# Counting, Radix & Bucket Sort

Comparison-based sorting has a provable lower bound of **Ω(n log n)**. But if you know something about the data — its range, digit structure, or distribution — you can sort in **O(n)**. These non-comparison sorts are powerful interview tools and appear in surprising places.

## Why Can We Beat O(n log n)?

The O(n log n) lower bound applies to **comparison sorts** only. It comes from the decision tree model: sorting n elements requires distinguishing between n! permutations, needing at least log₂(n!) ≈ n log n comparisons.

Non-comparison sorts **don't compare elements against each other**. They exploit additional knowledge about the data's domain to place elements directly.

---

## Counting Sort

### Intuition

If you know elements are integers in range `[0, k]`, you can count how many times each value appears, then reconstruct the sorted array from those counts.

```
Input: [4, 2, 2, 8, 3, 3, 1]   (values in [0, 8])

Count array: index  0  1  2  3  4  5  6  7  8
             count  0  1  2  2  1  0  0  0  1

Reconstruct: 1, 2, 2, 3, 3, 4, 8
```

### Template

```cpp
#include <vector>
using namespace std;

vector<int> countingSort(vector<int>& arr, int maxVal) {
    vector<int> count(maxVal + 1, 0);

    // Phase 1: Count occurrences
    for (int x : arr) count[x]++;

    // Phase 2: Convert counts to cumulative (prefix sum) — for stable sort
    for (int i = 1; i <= maxVal; i++) count[i] += count[i - 1];

    // Phase 3: Build output array (iterate in reverse for stability)
    vector<int> output(arr.size());
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[--count[arr[i]]] = arr[i];
    }
    return output;
}
```

```java
int[] countingSort(int[] arr, int maxVal) {
    int[] count = new int[maxVal + 1];
    for (int x : arr) count[x]++;
    for (int i = 1; i <= maxVal; i++) count[i] += count[i - 1];

    int[] output = new int[arr.length];
    for (int i = arr.length - 1; i >= 0; i--)
        output[--count[arr[i]]] = arr[i];
    return output;
}
```

```typescript
function countingSort(arr: number[], maxVal: number): number[] {
    const count = new Array(maxVal + 1).fill(0);
    for (const x of arr) count[x]++;
    for (let i = 1; i <= maxVal; i++) count[i] += count[i - 1];

    const output = new Array(arr.length);
    for (let i = arr.length - 1; i >= 0; i--)
        output[--count[arr[i]]] = arr[i];
    return output;
}
```

```python
def counting_sort(arr: list[int], max_val: int) -> list[int]:
    count = [0] * (max_val + 1)
    for x in arr:
        count[x] += 1

    # Prefix sum → position of each value in output
    for i in range(1, max_val + 1):
        count[i] += count[i - 1]

    output = [0] * len(arr)
    for x in reversed(arr):  # reverse for stability
        count[x] -= 1
        output[count[x]] = x
    return output
```

```go
func countingSort(arr []int, maxVal int) []int {
    count := make([]int, maxVal+1)
    for _, x := range arr { count[x]++ }
    for i := 1; i <= maxVal; i++ { count[i] += count[i-1] }

    output := make([]int, len(arr))
    for i := len(arr) - 1; i >= 0; i-- {
        count[arr[i]]--
        output[count[arr[i]]] = arr[i]
    }
    return output
}
```

### Complexity

| | Time | Space |
|---|---|---|
| Counting Sort | O(n + k) | O(k) |

Where `k` is the range of input values. **Optimal when k = O(n)** (range is proportional to count). Degrades when k >> n (large range, few elements).

---

## Radix Sort

### Intuition

Counting sort breaks down for large ranges (e.g., sorting integers up to 10⁹). Radix sort solves this by sorting **digit by digit** from least significant to most significant (LSD variant), using counting sort as a stable subroutine.

```
Input: [170, 45, 75, 90, 802, 24, 2, 66]

Sort by ones digit (LSD):
170, 90, 802, 2, 24, 45, 75, 66

Sort by tens digit:
802, 2, 24, 45, 66, 170, 75, 90

Sort by hundreds digit:
2, 24, 45, 66, 75, 90, 170, 802  ← sorted!
```

The key insight: as long as each digit-level sort is **stable** (equal digits preserve order from previous pass), the overall result is correct.

### Template

```cpp
#include <vector>
using namespace std;

void countSortByDigit(vector<int>& arr, int exp) {
    int n = arr.size();
    vector<int> output(n);
    int count[10] = {0};

    // Count digits at position exp
    for (int i = 0; i < n; i++) count[(arr[i] / exp) % 10]++;
    // Prefix sum
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    // Build output (reverse for stability)
    for (int i = n - 1; i >= 0; i--) {
        int digit = (arr[i] / exp) % 10;
        output[--count[digit]] = arr[i];
    }
    arr = output;
}

void radixSort(vector<int>& arr) {
    int maxVal = *max_element(arr.begin(), arr.end());
    for (int exp = 1; maxVal / exp > 0; exp *= 10)
        countSortByDigit(arr, exp);
}
```

```java
void radixSort(int[] arr) {
    int maxVal = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; maxVal / exp > 0; exp *= 10)
        countByDigit(arr, exp);
}

void countByDigit(int[] arr, int exp) {
    int n = arr.length;
    int[] output = new int[n], count = new int[10];
    for (int x : arr) count[(x / exp) % 10]++;
    for (int i = 1; i < 10; i++) count[i] += count[i - 1];
    for (int i = n - 1; i >= 0; i--) {
        int d = (arr[i] / exp) % 10;
        output[--count[d]] = arr[i];
    }
    System.arraycopy(output, 0, arr, 0, n);
}
```

```typescript
function radixSort(arr: number[]): void {
    const maxVal = Math.max(...arr);
    for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
        countByDigit(arr, exp);
    }
}
function countByDigit(arr: number[], exp: number): void {
    const n = arr.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);
    for (const x of arr) count[Math.floor(x / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = n - 1; i >= 0; i--) {
        const d = Math.floor(arr[i] / exp) % 10;
        output[--count[d]] = arr[i];
    }
    for (let i = 0; i < n; i++) arr[i] = output[i];
}
```

```python
def radix_sort(arr: list[int]) -> list[int]:
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        arr = _count_by_digit(arr, exp)
        exp *= 10
    return arr

def _count_by_digit(arr: list[int], exp: int) -> list[int]:
    n = len(arr)
    count = [0] * 10
    for x in arr:
        count[(x // exp) % 10] += 1
    for i in range(1, 10):
        count[i] += count[i - 1]
    output = [0] * n
    for x in reversed(arr):
        d = (x // exp) % 10
        count[d] -= 1
        output[count[d]] = x
    return output
```

```go
func radixSort(arr []int) {
    maxVal := arr[0]
    for _, x := range arr { if x > maxVal { maxVal = x } }
    for exp := 1; maxVal/exp > 0; exp *= 10 {
        countByDigit(arr, exp)
    }
}

func countByDigit(arr []int, exp int) {
    n := len(arr)
    count := make([]int, 10)
    for _, x := range arr { count[(x/exp)%10]++ }
    for i := 1; i < 10; i++ { count[i] += count[i-1] }
    output := make([]int, n)
    for i := n - 1; i >= 0; i-- {
        d := (arr[i] / exp) % 10
        count[d]--; output[count[d]] = arr[i]
    }
    copy(arr, output)
}
```

### Complexity

| | Time | Space |
|---|---|---|
| Radix Sort (LSD) | O(d × (n + b)) | O(n + b) |

Where `d` = number of digits, `b` = base (10 for decimal). For fixed-range integers: **O(n)** since d = O(log_b(maxVal)) is a constant.

---

## Bucket Sort

### Intuition

If input values are **uniformly distributed** over a known range (like floats in [0, 1)), distribute them into `n` equal-sized buckets, sort each bucket individually, then concatenate.

```
Input: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12]
8 buckets for [0, 1):

Bucket 0: [0.12, 0.17]
Bucket 1: [0.17]
Bucket 2: [0.21, 0.26]
Bucket 3: [0.39]
...
Bucket 7: [0.78, 0.72]
Bucket 9: [0.94]

Sort each bucket → concatenate → sorted!
```

### Template

```cpp
#include <vector>
#include <algorithm>
using namespace std;

vector<double> bucketSort(vector<double>& arr) {
    int n = arr.size();
    vector<vector<double>> buckets(n);

    for (double x : arr) {
        int idx = (int)(x * n);  // map [0,1) → [0, n)
        if (idx == n) idx--;     // edge case: x == 1.0
        buckets[idx].push_back(x);
    }

    for (auto& bucket : buckets)
        sort(bucket.begin(), bucket.end());  // insertion sort is fine for small buckets

    vector<double> result;
    for (auto& bucket : buckets)
        for (double x : bucket) result.push_back(x);
    return result;
}
```

```java
List<Double> bucketSort(double[] arr) {
    int n = arr.length;
    List<List<Double>> buckets = new ArrayList<>();
    for (int i = 0; i < n; i++) buckets.add(new ArrayList<>());
    for (double x : arr) {
        int idx = (int)(x * n);
        if (idx == n) idx--;
        buckets.get(idx).add(x);
    }
    List<Double> result = new ArrayList<>();
    for (List<Double> bucket : buckets) {
        Collections.sort(bucket);
        result.addAll(bucket);
    }
    return result;
}
```

```typescript
function bucketSort(arr: number[]): number[] {
    const n = arr.length;
    const buckets: number[][] = Array.from({length: n}, () => []);
    for (const x of arr) {
        let idx = Math.floor(x * n);
        if (idx === n) idx--;
        buckets[idx].push(x);
    }
    const result: number[] = [];
    for (const bucket of buckets) {
        bucket.sort((a, b) => a - b);
        result.push(...bucket);
    }
    return result;
}
```

```python
def bucket_sort(arr: list[float]) -> list[float]:
    n = len(arr)
    buckets: list[list[float]] = [[] for _ in range(n)]

    for x in arr:
        idx = int(x * n)
        if idx == n: idx -= 1
        buckets[idx].append(x)

    result = []
    for bucket in buckets:
        bucket.sort()           # O(k log k) per bucket; O(1) on average with uniform dist
        result.extend(bucket)
    return result
```

```go
func bucketSort(arr []float64) []float64 {
    n := len(arr)
    buckets := make([][]float64, n)
    for _, x := range arr {
        idx := int(x * float64(n))
        if idx == n { idx-- }
        buckets[idx] = append(buckets[idx], x)
    }
    result := []float64{}
    for _, bucket := range buckets {
        sort.Float64s(bucket)
        result = append(result, bucket...)
    }
    return result
}
```

### Complexity

| | Time (average) | Time (worst) | Space |
|---|---|---|---|
| Bucket Sort | O(n + k) | O(n²) | O(n + k) |

Average case assumes **uniform distribution**. Worst case (all elements in one bucket) degrades to O(n²).

---

## Choosing the Right Linear Sort

| Algorithm | Use When | Key Constraint |
|---|---|---|
| **Counting Sort** | Small integer range `k = O(n)` | Values must be non-negative integers |
| **Radix Sort** | Large integers, fixed digit count | Works on integers/strings |
| **Bucket Sort** | Floats uniformly distributed in [0,1) | Distribution must be roughly uniform |

## Interview Applications

- **Sort array of 0s, 1s, 2s:** Counting sort in O(n) — or Dutch National Flag (O(n), O(1) space)
- **Sort strings of same length:** Radix sort on characters
- **Sort n numbers in range [0, n²]:** Radix sort in base n → O(n)
- **Top-K frequent elements:** Bucket sort by frequency (bucket index = frequency)

## Common Pitfalls

- **Negative numbers:** Counting sort requires non-negative indices. Shift all values by the minimum first.
- **Radix sort not stable → wrong result:** Each digit-pass MUST be stable. Verify your subroutine preserves relative order.
- **Bucket sort on non-uniform data:** Bucket sort's O(n) average breaks completely if data is clustered.
- **Off-by-one in bucket index:** When mapping float to bucket index, `idx = int(x * n)` with `x ∈ [0, 1)` gives `idx ∈ [0, n-1]`. Guard against `x == 1.0` edge case.
