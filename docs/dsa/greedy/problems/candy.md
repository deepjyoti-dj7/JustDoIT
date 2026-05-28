---
title: Candy
difficulty: Hard
tags: [Greedy, Array, Two-Pass]
link: https://leetcode.com/problems/candy/
---

# Candy

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [135. Candy](https://leetcode.com/problems/candy/) |
| **Tags** | Greedy, Array, Two-Pass |

## Problem Statement

There are `n` children standing in a line. Each child has a rating value in the integer array `ratings`. You must distribute candies satisfying:
- Each child gets **at least one** candy
- Children with a **higher rating** than an adjacent child get **more candies**

Return the **minimum total candies** needed.

**Example:**
```
ratings = [1, 0, 2]
Output:   5
Explanation: [2, 1, 2] candies — each child with higher rating than neighbor gets more.

ratings = [1, 2, 2]
Output:   4
Explanation: [1, 2, 1] — equal ratings don't need more candies.
```

---

## Intuition

Two constraints operate independently:
- "More than left neighbor" — satisfiable in a left-to-right pass
- "More than right neighbor" — satisfiable in a right-to-left pass

Running both passes and taking `max(left[i], right[i])` satisfies **both** constraints simultaneously with the minimum allocation.

**Why greedy?** In each pass, give *just one more* than the neighbor — never more. This minimizes the allocation while still satisfying the constraint for that direction.

---

## Approach 1: Brute Force

Repeat until stable: for each child, if their rating is higher than a neighbor but they don't have more candies, increment their count. Repeat until no changes happen.

This converges but is slow.

```cpp
int candy(vector<int>& ratings) {
    int n = ratings.size();
    vector<int> candies(n, 1);
    bool changed = true;
    while (changed) {
        changed = false;
        for (int i = 0; i < n; i++) {
            if (i > 0 && ratings[i] > ratings[i-1] && candies[i] <= candies[i-1]) {
                candies[i] = candies[i-1] + 1; changed = true;
            }
            if (i < n-1 && ratings[i] > ratings[i+1] && candies[i] <= candies[i+1]) {
                candies[i] = candies[i+1] + 1; changed = true;
            }
        }
    }
    return accumulate(candies.begin(), candies.end(), 0);
}
```

```java
int candy(int[] ratings) {
    int n = ratings.length;
    int[] candies = new int[n];
    Arrays.fill(candies, 1);
    boolean changed = true;
    while (changed) {
        changed = false;
        for (int i = 0; i < n; i++) {
            if (i > 0 && ratings[i] > ratings[i-1] && candies[i] <= candies[i-1]) {
                candies[i] = candies[i-1] + 1; changed = true;
            }
            if (i < n-1 && ratings[i] > ratings[i+1] && candies[i] <= candies[i+1]) {
                candies[i] = candies[i+1] + 1; changed = true;
            }
        }
    }
    int sum = 0;
    for (int c : candies) sum += c;
    return sum;
}
```

```typescript
function candy(ratings: number[]): number {
    const n = ratings.length;
    const candies = new Array(n).fill(1);
    let changed = true;
    while (changed) {
        changed = false;
        for (let i = 0; i < n; i++) {
            if (i > 0 && ratings[i] > ratings[i-1] && candies[i] <= candies[i-1]) {
                candies[i] = candies[i-1] + 1; changed = true;
            }
            if (i < n-1 && ratings[i] > ratings[i+1] && candies[i] <= candies[i+1]) {
                candies[i] = candies[i+1] + 1; changed = true;
            }
        }
    }
    return candies.reduce((a, b) => a + b, 0);
}
```

```python
def candy(ratings: list[int]) -> int:
    n = len(ratings)
    candies = [1] * n
    changed = True
    while changed:
        changed = False
        for i in range(n):
            if i > 0 and ratings[i] > ratings[i-1] and candies[i] <= candies[i-1]:
                candies[i] = candies[i-1] + 1
                changed = True
            if i < n-1 and ratings[i] > ratings[i+1] and candies[i] <= candies[i+1]:
                candies[i] = candies[i+1] + 1
                changed = True
    return sum(candies)
```

```go
func candy(ratings []int) int {
    n := len(ratings)
    candies := make([]int, n)
    for i := range candies { candies[i] = 1 }
    for changed := true; changed; {
        changed = false
        for i := 0; i < n; i++ {
            if i > 0 && ratings[i] > ratings[i-1] && candies[i] <= candies[i-1] {
                candies[i] = candies[i-1] + 1; changed = true
            }
            if i < n-1 && ratings[i] > ratings[i+1] && candies[i] <= candies[i+1] {
                candies[i] = candies[i+1] + 1; changed = true
            }
        }
    }
    total := 0
    for _, c := range candies { total += c }
    return total
}
```

**Time:** O(n²) worst case — **Space:** O(n)

---

## Approach 2: Two-Pass Greedy (Optimal)

**Pass 1 (Left → Right):** Start everyone at 1. If `ratings[i] > ratings[i-1]`, set `left[i] = left[i-1] + 1`.

**Pass 2 (Right → Left):** Start everyone at 1. If `ratings[i] > ratings[i+1]`, set `right[i] = right[i+1] + 1`.

**Answer:** `sum of max(left[i], right[i])`.

```cpp
int candy(vector<int>& ratings) {
    int n = ratings.size();
    vector<int> left(n, 1), right(n, 1);

    for (int i = 1; i < n; i++)
        if (ratings[i] > ratings[i-1])
            left[i] = left[i-1] + 1;

    for (int i = n-2; i >= 0; i--)
        if (ratings[i] > ratings[i+1])
            right[i] = right[i+1] + 1;

    int total = 0;
    for (int i = 0; i < n; i++)
        total += max(left[i], right[i]);
    return total;
}
```

```java
int candy(int[] ratings) {
    int n = ratings.length;
    int[] left = new int[n], right = new int[n];
    Arrays.fill(left, 1); Arrays.fill(right, 1);

    for (int i = 1; i < n; i++)
        if (ratings[i] > ratings[i-1])
            left[i] = left[i-1] + 1;

    for (int i = n-2; i >= 0; i--)
        if (ratings[i] > ratings[i+1])
            right[i] = right[i+1] + 1;

    int total = 0;
    for (int i = 0; i < n; i++)
        total += Math.max(left[i], right[i]);
    return total;
}
```

```typescript
function candy(ratings: number[]): number {
    const n = ratings.length;
    const left = new Array(n).fill(1);
    const right = new Array(n).fill(1);

    for (let i = 1; i < n; i++)
        if (ratings[i] > ratings[i-1])
            left[i] = left[i-1] + 1;

    for (let i = n-2; i >= 0; i--)
        if (ratings[i] > ratings[i+1])
            right[i] = right[i+1] + 1;

    let total = 0;
    for (let i = 0; i < n; i++)
        total += Math.max(left[i], right[i]);
    return total;
}
```

```python
def candy(ratings: list[int]) -> int:
    n = len(ratings)
    left  = [1] * n
    right = [1] * n

    for i in range(1, n):
        if ratings[i] > ratings[i - 1]:
            left[i] = left[i - 1] + 1

    for i in range(n - 2, -1, -1):
        if ratings[i] > ratings[i + 1]:
            right[i] = right[i + 1] + 1

    return sum(max(l, r) for l, r in zip(left, right))
```

```go
func candy(ratings []int) int {
    n := len(ratings)
    left, right := make([]int, n), make([]int, n)
    for i := range left { left[i], right[i] = 1, 1 }

    for i := 1; i < n; i++ {
        if ratings[i] > ratings[i-1] { left[i] = left[i-1] + 1 }
    }
    for i := n - 2; i >= 0; i-- {
        if ratings[i] > ratings[i+1] { right[i] = right[i+1] + 1 }
    }

    total := 0
    for i := 0; i < n; i++ {
        if left[i] > right[i] { total += left[i] } else { total += right[i] }
    }
    return total
}
```

**Time:** O(n) — **Space:** O(n)

---

## Dry Run

`ratings = [1, 3, 2, 2, 1]`

**Left pass:**

| i | rating | left |
|---|---|---|
| 0 | 1 | 1 |
| 1 | 3 > 1 | 2 |
| 2 | 2 < 3 | 1 |
| 3 | 2 = 2 | 1 |
| 4 | 1 < 2 | 1 |

`left = [1, 2, 1, 1, 1]`

**Right pass:**

| i | rating | right |
|---|---|---|
| 4 | 1 | 1 |
| 3 | 2 > 1 | 2 |
| 2 | 2 = 2 | 1 |
| 1 | 3 > 2 | 2 |
| 0 | 1 < 3 | 1 |

`right = [1, 2, 1, 2, 1]`

`max = [1, 2, 1, 2, 1]` → total = **7**

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute Force (repeated scan) | O(n²) | O(n) |
| Two-Pass Greedy | O(n) | O(n) |

---

## Key Interview Insights

- **Why two passes?** A single left-to-right pass handles the left-neighbor constraint but misses the right-neighbor constraint (e.g., a descending run needs the rightmost child to have 1, and counts must increase going left). The right pass fixes this.
- **`max` not `+`:** Take `max(left[i], right[i])`, not their sum. A child needs enough candies to satisfy *both* constraints simultaneously, which is exactly the max.
- **Equal ratings:** Children with equal ratings have no constraint between them — both can have 1 candy.
- **Space optimization:** It's possible to do this in O(1) extra space using a slope-counting technique (tracking ascending/descending run lengths), but it's significantly more complex. The two-array approach is always accepted in interviews.
- This problem is rated Hard primarily because of the non-obvious two-pass insight — once you see it, the code is straightforward.
