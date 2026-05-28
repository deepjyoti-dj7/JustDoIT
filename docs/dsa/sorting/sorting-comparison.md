---
title: Sorting Algorithms — Complete Comparison & Interview Guide
description: The definitive reference for choosing, analyzing, and discussing sorting algorithms in technical interviews
---

# Sorting Algorithms — Complete Comparison & Interview Guide

This is the reference sheet for sorting in interviews. When asked "which sorting algorithm would you use?" — this page has the answer, backed by the reasoning interviewers want to hear.

## The Master Comparison Table

| Algorithm | Best | Average | Worst | Space | Stable | In-Place |
|---|---|---|---|---|---|---|
| **Bubble Sort** | O(n) | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| **Selection Sort** | O(n²) | O(n²) | O(n²) | O(1) | ❌ | ✅ |
| **Insertion Sort** | O(n) | O(n²) | O(n²) | O(1) | ✅ | ✅ |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ | ❌ |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ | ✅ |
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ | ✅ |
| **Counting Sort** | O(n+k) | O(n+k) | O(n+k) | O(k) | ✅ | ❌ |
| **Radix Sort** | O(d·n) | O(d·n) | O(d·n) | O(n+b) | ✅ | ❌ |
| **Bucket Sort** | O(n+k) | O(n+k) | O(n²) | O(n+k) | ✅ | ❌ |
| **Tim Sort** | O(n) | O(n log n) | O(n log n) | O(n) | ✅ | ❌ |

> **Tim Sort** is what Python's `sorted()` and Java's `Arrays.sort()` (for objects) actually use — a hybrid of merge sort and insertion sort, optimized for real-world data with natural runs.

## Decision Framework: Which Sort to Use?

Work through these questions in order:

```
1. Is the range of values small (k << n)?
   → Counting Sort: O(n + k)

2. Are values integers with fixed digit count?
   → Radix Sort: O(d × n)

3. Are values floats uniformly distributed?
   → Bucket Sort: O(n) average

4. Is stability required?
   → Merge Sort (guaranteed O(n log n), stable)

5. Is O(1) extra space required AND O(n²) worst case is unacceptable?
   → Heap Sort (O(n log n), O(1) space, not stable)

6. Is O(1) extra space required AND average performance matters most?
   → Quick Sort with random pivot (fastest in practice)

7. Default (general-purpose):
   → Merge Sort or built-in sort (Tim Sort)
```

## Stability Deep Dive

A sort is **stable** if equal elements maintain their original relative order.

**Why stability matters:** Suppose you sort employee records first by department, then by salary. If the salary sort is stable, employees with the same salary preserve their department ordering from the previous sort. If unstable, that ordering is lost.

**Stable sorts:** Bubble, Insertion, Merge, Counting, Radix, Bucket, Tim Sort

**Unstable sorts:** Selection, Heap, Quick Sort (in standard implementations)

**Making unstable sorts stable:** Augment keys with original index. Sort on `(key, original_index)`. Now ties are always broken by position → effectively stable. Cost: O(n) extra space.

## The O(n log n) Lower Bound

**Theorem:** Any comparison-based sorting algorithm requires Ω(n log n) comparisons in the worst case.

**Proof sketch:** The algorithm's execution forms a **decision tree** where each internal node is a comparison and each leaf is a permutation. A tree with at least n! leaves has height at least log₂(n!) ≈ n log n (by Stirling's approximation).

This is why counting/radix/bucket sort can beat O(n log n) — they don't use comparisons between elements.

## Real-World Sorting: What Libraries Actually Use

| Language | Primitive Arrays | Object Arrays / Lists |
|---|---|---|
| **Java** | Dual-Pivot Quick Sort | Tim Sort |
| **Python** | — | Tim Sort |
| **C++** | Introsort (quick + heap + insertion) | Introsort |
| **Go** | Pattern-defeating quicksort (pdqsort) | pdqsort |
| **JavaScript** | Tim Sort (V8) | Tim Sort |

**Introsort** (C++ `std::sort`): Quick sort → if recursion depth exceeds 2 log n, switch to Heap Sort to guarantee O(n log n). For small subarrays (< ~16 elements), switch to Insertion Sort (cache friendly, low overhead).

**Pattern-defeating quicksort (pdqsort)**: Go's implementation. Detects bad pivot patterns and adapts. State-of-the-art in practice.

## Interview-Specific Scenarios

### "Sort a nearly-sorted array"

**Answer:** Insertion Sort is O(nk) where k is the maximum displacement. For nearly-sorted data (k is small), it's faster than O(n log n) sorts.

### "Sort an array of 0s, 1s, and 2s"

**Answer:** Dutch National Flag algorithm (three-way partition) — O(n) time, O(1) space. Not technically "counting sort" — it's a partition approach.

### "Sort a linked list"

**Answer:** Merge Sort — O(n log n). Quick sort requires random access (bad for lists). No auxiliary array needed for merging two lists.

### "Find the kth largest element"

**Answer:** QuickSelect — O(n) average. Not sorting at all — partition-based selection.

### "Sort strings of different lengths"

**Answer:** Comparison sort (lexicographic). Radix sort can work if padding to same length is acceptable.

### "External sort (data doesn't fit in RAM)"

**Answer:** Merge sort — sort chunks that fit in RAM, write to disk, then k-way merge using a priority queue.

### "Sort by multiple criteria (e.g., by age, then by name)"

**Answer:** Stable sort on the secondary key first, then stable sort on the primary key. Due to stability, the secondary ordering is preserved for equal primary keys.

## Tradeoff Summary Table

| Concern | Best Choice | Why |
|---|---|---|
| Fastest in practice | Quick Sort (randomized) | Cache-friendly, in-place |
| Guaranteed O(n log n) | Merge Sort or Heap Sort | No worst-case degradation |
| O(1) extra space + guaranteed | Heap Sort | In-place, worst-case safe |
| Stable sort | Merge Sort | Stable + O(n log n) |
| Small range integers | Counting Sort | O(n) |
| Linked list | Merge Sort | Natural fit for merge |
| Streaming / external | Merge Sort | Chunk-based processing |
| Nearly sorted | Insertion Sort | O(nk) for displacement k |
| Few distinct values | 3-way Quick Sort | Handles duplicates efficiently |

## Sorting Interview Red Flags

Things that signal weak understanding — avoid saying these:

- ❌ "I'd just use sort()" without discussing time/space complexity
- ❌ "Bubble sort is O(n log n)" — it's O(n²)
- ❌ "Quick sort is always O(n log n)" — worst case is O(n²)
- ❌ "Merge sort is in-place" — it needs O(n) auxiliary space
- ❌ "Selection sort is stable" — it's not (standard implementation)
- ❌ Choosing counting sort for floats or large-range integers

## Sorting as a Tool (Not the Goal)

In most interview problems, sorting is a **preprocessing step**, not the solution itself. Recognize these patterns:

| If the problem needs... | Sort by... |
|---|---|
| Two-sum / pair sum on sorted input | Value |
| Interval problems (merge, overlap, gap) | Start time |
| Meeting rooms / scheduling | Start time or end time |
| Greedy on tasks | Deadline, weight, or duration |
| Custom ordering (Largest Number) | Custom comparator |
| Top-K / median maintenance | Use heap, not sort |
