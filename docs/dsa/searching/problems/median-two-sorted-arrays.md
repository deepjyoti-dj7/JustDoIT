---
title: Median of Two Sorted Arrays
difficulty: Hard
tags: [Array, Binary Search, Divide and Conquer]
link: https://leetcode.com/problems/median-of-two-sorted-arrays/
---

# Median of Two Sorted Arrays

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/) |
| **Tags** | Array, Binary Search, Divide and Conquer |

## Problem Statement

Given two sorted arrays `nums1` and `nums2` of sizes `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity must be `O(log(m+n))`.

## Intuition

The naïve O(m+n) approach merges both arrays and returns the middle element. To achieve O(log(m+n)), we must use binary search.

**Key insight:** The median divides the combined array into two equal halves. If we can find the correct partition in both arrays such that:
1. The left partitions together have exactly `(m+n+1)/2` elements
2. `max(left_partition) <= min(right_partition)` across both arrays

...then we have found the median.

### Visualizing the Partition

```
nums1: [1, 3, 8, 9, 15]          m=5
nums2: [7, 11, 18, 19, 21, 25]   n=6

Combined length = 11, median is the 6th element (index 5)
Left half must have ceil(11/2) = 6 elements

Partition nums1 at position i (i elements from nums1 go left):
  i=3: nums1_left=[1,3,8], nums1_right=[9,15]
       nums2_left=[7,11,18], nums2_right=[19,21,25]  (j=3 since 3+3=6)

Check: max(nums1_left)=8 <= min(nums2_right)=19 OK
       max(nums2_left)=18 <= min(nums1_right)=9  FAIL -> 18>9

Move i right to i=4:
  nums1_left=[1,3,8,9], nums1_right=[15]
  nums2_left=[7,11], nums2_right=[18,19,21,25]  (j=2 since 4+2=6)

Check: max(nums1_left)=9 <= min(nums2_right)=18 OK
       max(nums2_left)=11 <= min(nums1_right)=15 OK  -> Valid partition!

Median = max(9, 11) = 11  (odd total, median is max of left halves)
```

## Approach: Binary Search on Partition

Binary search on the partition position `i` in `nums1` (the smaller array). For each `i`, compute `j = half_len - i`. Check if the partition is valid. Adjust `i` based on the comparison.

```cpp
class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);

        int m = nums1.size(), n = nums2.size();
        int half = (m + n + 1) / 2;
        int left = 0, right = m;

        while (left <= right) {
            int i = left + (right - left) / 2;
            int j = half - i;

            int maxLeft1  = (i == 0) ? INT_MIN : nums1[i - 1];
            int minRight1 = (i == m) ? INT_MAX : nums1[i];
            int maxLeft2  = (j == 0) ? INT_MIN : nums2[j - 1];
            int minRight2 = (j == n) ? INT_MAX : nums2[j];

            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                if ((m + n) % 2 == 1)
                    return max(maxLeft1, maxLeft2);
                return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0;
            } else if (maxLeft1 > minRight2) {
                right = i - 1;
            } else {
                left = i + 1;
            }
        }
        return 0.0;
    }
};
```

```java
class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);

        int m = nums1.length, n = nums2.length;
        int half = (m + n + 1) / 2;
        int left = 0, right = m;

        while (left <= right) {
            int i = left + (right - left) / 2;
            int j = half - i;

            int maxLeft1  = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
            int minRight1 = (i == m) ? Integer.MAX_VALUE : nums1[i];
            int maxLeft2  = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
            int minRight2 = (j == n) ? Integer.MAX_VALUE : nums2[j];

            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                if ((m + n) % 2 == 1) return Math.max(maxLeft1, maxLeft2);
                return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;
            } else if (maxLeft1 > minRight2) {
                right = i - 1;
            } else {
                left = i + 1;
            }
        }
        return 0.0;
    }
}
```

```typescript
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
    if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);

    const m = nums1.length, n = nums2.length;
    const half = Math.floor((m + n + 1) / 2);
    let left = 0, right = m;

    while (left <= right) {
        const i = Math.floor((left + right) / 2);
        const j = half - i;

        const maxLeft1  = i === 0 ? -Infinity : nums1[i - 1];
        const minRight1 = i === m ?  Infinity : nums1[i];
        const maxLeft2  = j === 0 ? -Infinity : nums2[j - 1];
        const minRight2 = j === n ?  Infinity : nums2[j];

        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            if ((m + n) % 2 === 1) return Math.max(maxLeft1, maxLeft2);
            return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;
        } else if (maxLeft1 > minRight2) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }
    return 0;
}
```

```python
class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1

        m, n = len(nums1), len(nums2)
        half = (m + n + 1) // 2
        left, right = 0, m

        while left <= right:
            i = (left + right) // 2
            j = half - i

            max_left1  = nums1[i - 1] if i > 0 else float('-inf')
            min_right1 = nums1[i]     if i < m else float('inf')
            max_left2  = nums2[j - 1] if j > 0 else float('-inf')
            min_right2 = nums2[j]     if j < n else float('inf')

            if max_left1 <= min_right2 and max_left2 <= min_right1:
                if (m + n) % 2 == 1:
                    return float(max(max_left1, max_left2))
                return (max(max_left1, max_left2) + min(min_right1, min_right2)) / 2.0
            elif max_left1 > min_right2:
                right = i - 1
            else:
                left = i + 1

        return 0.0
```

```go
func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {
    if len(nums1) > len(nums2) {
        return findMedianSortedArrays(nums2, nums1)
    }

    m, n := len(nums1), len(nums2)
    half := (m + n + 1) / 2
    left, right := 0, m

    for left <= right {
        i := left + (right-left)/2
        j := half - i

        maxLeft1, minRight1 := math.MinInt64, math.MaxInt64
        maxLeft2, minRight2 := math.MinInt64, math.MaxInt64

        if i > 0 { maxLeft1  = nums1[i-1] }
        if i < m { minRight1 = nums1[i] }
        if j > 0 { maxLeft2  = nums2[j-1] }
        if j < n { minRight2 = nums2[j] }

        if maxLeft1 <= minRight2 && maxLeft2 <= minRight1 {
            if (m+n)%2 == 1 {
                if maxLeft1 > maxLeft2 { return float64(maxLeft1) }
                return float64(maxLeft2)
            }
            lo := maxLeft1
            if maxLeft2 > lo { lo = maxLeft2 }
            hi := minRight1
            if minRight2 < hi { hi = minRight2 }
            return float64(lo+hi) / 2.0
        } else if maxLeft1 > minRight2 {
            right = i - 1
        } else {
            left = i + 1
        }
    }
    return 0.0
}
```

## Step-by-Step Walkthrough

```
nums1 = [1, 3],   nums2 = [2]   (m=2, n=1, total=3, half=2)

left=0, right=2, i=1, j=1
  maxLeft1=nums1[0]=1,  minRight1=nums1[1]=3
  maxLeft2=nums2[0]=2,  minRight2=+inf (j==n)

  1 <= inf and 2 <= 3 -> valid partition
  total odd -> return max(1,2) = 2.0

---

nums1=[1,2], nums2=[3,4]  (m=2, n=2, total=4, half=2)

left=0, right=2, i=1, j=1
  maxLeft1=1, minRight1=2, maxLeft2=3, minRight2=4
  1<=4 but 3<=2 FAIL -> maxLeft2 > minRight1 -> left=2

left=2, right=2, i=2, j=0
  maxLeft1=nums1[1]=2,  minRight1=+inf (i==m)
  maxLeft2=-inf (j==0), minRight2=nums2[0]=3

  2<=3 and -inf<=inf -> valid partition
  total even -> (max(2,-inf) + min(inf,3)) / 2 = (2+3)/2 = 2.5
```

## Sentinel Values

When `i == 0`, left side of nums1 is empty — use `−∞` as `maxLeft1`. When `i == m`, right side of nums1 is empty — use `+∞` as `minRight1`. These sentinels ensure boundary conditions remain well-defined when one array contributes nothing to a partition half.

## Complexity

- **Time:** O(log(min(m, n))) — binary search on the smaller array only
- **Space:** O(1)

## Key Interview Insights

- **Always binary search the smaller array.** This guarantees `j = half - i` stays valid (0 ≤ j ≤ n). If `nums1` is larger, swap them.
- **Search range is `[0, m]`** — partition position can be 0 (nothing from nums1 in left half) to m (everything in left half). Both extremes are valid.
- **Two conditions for a valid partition:**
  - `maxLeft1 <= minRight2`
  - `maxLeft2 <= minRight1`
- **If `maxLeft1 > minRight2`:** too many elements from nums1 on the left → move `i` left
- **If `maxLeft2 > minRight1`:** too few elements from nums1 on the left → move `i` right
- **Odd vs even total:** Odd total — median is `max(maxLeft1, maxLeft2)`. Even total — median is average of `max(left halves)` and `min(right halves)`.
