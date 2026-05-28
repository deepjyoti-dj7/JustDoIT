---
title: Knapsack Patterns
description: 0/1 Knapsack, Unbounded Knapsack, and all their interview disguises
---

# Knapsack Patterns

The Knapsack problem family is one of the most important DP patterns. Nearly every "can you pick a subset to achieve a target?" problem reduces to some variant of it. There are two fundamental types, and recognizing which one you're dealing with determines everything about the solution.

## The Core Question: Can Items Be Reused?

| Type | Items | Key Property |
|---|---|---|
| **0/1 Knapsack** | Each item used **at most once** | "pick or skip" each item |
| **Unbounded Knapsack** | Each item used **unlimited times** | "pick any number" of each item |

This single distinction changes the loop order in the space-optimized solution — everything else is the same.

## 0/1 Knapsack

**Problem:** Given items with weights `w[i]` and values `v[i]`, and a capacity `W`. Maximize total value without exceeding capacity. Each item can be used at most once.

**State:** `dp[i][j]` = maximum value using the first `i` items with capacity `j`

**Recurrence:**
- Skip item `i`: `dp[i][j] = dp[i-1][j]`
- Take item `i` (if `w[i] <= j`): `dp[i][j] = dp[i-1][j - w[i]] + v[i]`
- `dp[i][j] = max(skip, take)`

**Base case:** `dp[0][j] = 0` for all `j` (no items = no value)

```cpp
int knapsack(vector<int>& weights, vector<int>& values, int W) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++)
        for (int j = 0; j <= W; j++) {
            dp[i][j] = dp[i-1][j];  // skip
            if (weights[i-1] <= j)
                dp[i][j] = max(dp[i][j], dp[i-1][j - weights[i-1]] + values[i-1]);
        }
    return dp[n][W];
}
```

```java
int knapsack(int[] weights, int[] values, int W) {
    int n = weights.length;
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++)
        for (int j = 0; j <= W; j++) {
            dp[i][j] = dp[i-1][j];
            if (weights[i-1] <= j)
                dp[i][j] = Math.max(dp[i][j], dp[i-1][j - weights[i-1]] + values[i-1]);
        }
    return dp[n][W];
}
```

```typescript
function knapsack(weights: number[], values: number[], W: number): number {
    const n = weights.length;
    const dp = Array.from({length: n + 1}, () => new Array(W + 1).fill(0));
    for (let i = 1; i <= n; i++)
        for (let j = 0; j <= W; j++) {
            dp[i][j] = dp[i-1][j];
            if (weights[i-1] <= j)
                dp[i][j] = Math.max(dp[i][j], dp[i-1][j - weights[i-1]] + values[i-1]);
        }
    return dp[n][W];
}
```

```python
def knapsack(weights: list[int], values: list[int], W: int) -> int:
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for j in range(W + 1):
            dp[i][j] = dp[i-1][j]
            if weights[i-1] <= j:
                dp[i][j] = max(dp[i][j], dp[i-1][j - weights[i-1]] + values[i-1])
    return dp[n][W]
```

```go
func knapsack(weights, values []int, W int) int {
    n := len(weights)
    dp := make([][]int, n+1)
    for i := range dp { dp[i] = make([]int, W+1) }
    for i := 1; i <= n; i++ {
        for j := 0; j <= W; j++ {
            dp[i][j] = dp[i-1][j]
            if weights[i-1] <= j {
                if v := dp[i-1][j-weights[i-1]] + values[i-1]; v > dp[i][j] {
                    dp[i][j] = v
                }
            }
        }
    }
    return dp[n][W]
}
```

### Space-Optimized 0/1 Knapsack

Since `dp[i][j]` only reads from `dp[i-1][...]`, compress to 1D. **Critical:** traverse capacity **right to left** to avoid using an item twice (using `dp[i][j - w]` instead of `dp[i-1][j - w]`).

```cpp
int knapsack(vector<int>& weights, vector<int>& values, int W) {
    vector<int> dp(W + 1, 0);
    for (int i = 0; i < weights.size(); i++)
        for (int j = W; j >= weights[i]; j--)  // right to left!
            dp[j] = max(dp[j], dp[j - weights[i]] + values[i]);
    return dp[W];
}
```

```java
int knapsack(int[] weights, int[] values, int W) {
    int[] dp = new int[W + 1];
    for (int i = 0; i < weights.length; i++)
        for (int j = W; j >= weights[i]; j--)  // right to left!
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
    return dp[W];
}
```

```typescript
function knapsack(weights: number[], values: number[], W: number): number {
    const dp = new Array(W + 1).fill(0);
    for (let i = 0; i < weights.length; i++)
        for (let j = W; j >= weights[i]; j--)  // right to left!
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
    return dp[W];
}
```

```python
def knapsack(weights: list[int], values: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for w, v in zip(weights, values):
        for j in range(W, w - 1, -1):  # right to left!
            dp[j] = max(dp[j], dp[j - w] + v)
    return dp[W]
```

```go
func knapsack(weights, values []int, W int) int {
    dp := make([]int, W+1)
    for i, w := range weights {
        for j := W; j >= w; j-- {  // right to left!
            if v := dp[j-w] + values[i]; v > dp[j] { dp[j] = v }
        }
    }
    return dp[W]
}
```

## Unbounded Knapsack

**Problem:** Same as 0/1, but each item can be used any number of times.

The only change: traverse capacity **left to right**, so `dp[j - w]` uses the current row (already updated), allowing the same item to be picked again.

```cpp
int unboundedKnapsack(vector<int>& weights, vector<int>& values, int W) {
    vector<int> dp(W + 1, 0);
    for (int j = 1; j <= W; j++)
        for (int i = 0; i < weights.size(); i++)
            if (weights[i] <= j)
                dp[j] = max(dp[j], dp[j - weights[i]] + values[i]);
    return dp[W];
}
```

```java
int unboundedKnapsack(int[] weights, int[] values, int W) {
    int[] dp = new int[W + 1];
    for (int j = 1; j <= W; j++)
        for (int i = 0; i < weights.length; i++)
            if (weights[i] <= j)
                dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
    return dp[W];
}
```

```typescript
function unboundedKnapsack(weights: number[], values: number[], W: number): number {
    const dp = new Array(W + 1).fill(0);
    for (let j = 1; j <= W; j++)
        for (let i = 0; i < weights.length; i++)
            if (weights[i] <= j)
                dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
    return dp[W];
}
```

```python
def unbounded_knapsack(weights: list[int], values: list[int], W: int) -> int:
    dp = [0] * (W + 1)
    for j in range(1, W + 1):
        for w, v in zip(weights, values):
            if w <= j:
                dp[j] = max(dp[j], dp[j - w] + v)
    return dp[W]
```

```go
func unboundedKnapsack(weights, values []int, W int) int {
    dp := make([]int, W+1)
    for j := 1; j <= W; j++ {
        for i, w := range weights {
            if w <= j {
                if v := dp[j-w] + values[i]; v > dp[j] { dp[j] = v }
            }
        }
    }
    return dp[W]
}
```

## The Most Important Disguise: Subset Sum / Partition

Most interview "knapsack" problems don't look like knapsack. They're disguised as partition or subset problems. The tell: "can you find a subset with a specific sum?"

**Subset Sum:** Can we find a subset of `nums` that sums to `target`?

This is 0/1 Knapsack where each item has weight = value = `nums[i]` and you want to reach exactly capacity `target`.

```cpp
bool canPartition(vector<int>& nums) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if (total % 2) return false;
    int target = total / 2;
    vector<bool> dp(target + 1, false);
    dp[0] = true;
    for (int num : nums)
        for (int j = target; j >= num; j--)  // right to left: 0/1 knapsack
            dp[j] = dp[j] || dp[j - num];
    return dp[target];
}
```

```java
boolean canPartition(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums)
        for (int j = target; j >= num; j--)
            dp[j] = dp[j] || dp[j - num];
    return dp[target];
}
```

```typescript
function canPartition(nums: number[]): boolean {
    const total = nums.reduce((a, b) => a + b, 0);
    if (total % 2 !== 0) return false;
    const target = total / 2;
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;
    for (const num of nums)
        for (let j = target; j >= num; j--)
            dp[j] = dp[j] || dp[j - num];
    return dp[target];
}
```

```python
def canPartition(nums: list[int]) -> bool:
    total = sum(nums)
    if total % 2: return False
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    return dp[target]
```

```go
func canPartition(nums []int) bool {
    total := 0
    for _, n := range nums { total += n }
    if total%2 != 0 { return false }
    target := total / 2
    dp := make([]bool, target+1)
    dp[0] = true
    for _, num := range nums {
        for j := target; j >= num; j-- {
            dp[j] = dp[j] || dp[j-num]
        }
    }
    return dp[target]
}
```

## Common Knapsack Interview Variants

| Problem | Type | Twist |
|---|---|---|
| 0/1 Knapsack | 0/1 | Classic — maximize value within capacity |
| Coin Change (min coins) | Unbounded | Minimize count to reach target |
| Coin Change II (count ways) | Unbounded | Count combinations to reach target |
| Partition Equal Subset Sum | 0/1 | Can subset sum to total/2? |
| Target Sum | 0/1 | Assign +/- to each number, count ways to reach target |
| Last Stone Weight II | 0/1 | Minimize difference of two groups |
| Word Break | Unbounded | Can string be segmented into dictionary words? |
| Perfect Squares | Unbounded | Minimum perfect squares summing to n |

## The Loop Order Rule (Critical)

This is the single most important rule for the 1D space-optimized version:

| Type | Inner Loop Direction | Reason |
|---|---|---|
| **0/1 Knapsack** | Right to left (`j = W to w`) | Prevent reusing the same item |
| **Unbounded Knapsack** | Left to right (`j = w to W`) | Allow reusing the same item |

**Why it works:** In a 1D DP array, `dp[j - w]` at capacity `j - w` was either:
- Already updated this iteration (if we processed smaller `j` first → left to right) — means we can take the item again
- Not yet updated this iteration (if we process larger `j` first → right to left) — means we can only take the item from the "previous item" iteration

## Target Sum: A Counting Knapsack

Assign `+` or `-` to each number, count ways to reach `target`. This looks combinatorial but reduces to subset sum:

If `P` = sum of positives, `N` = sum of negatives, then `P - N = target` and `P + N = total`, giving `P = (total + target) / 2`. Count subsets summing to `P`.

```cpp
int findTargetSumWays(vector<int>& nums, int target) {
    int total = accumulate(nums.begin(), nums.end(), 0);
    if ((total + target) % 2 || abs(target) > total) return 0;
    int goal = (total + target) / 2;
    vector<int> dp(goal + 1, 0);
    dp[0] = 1;
    for (int num : nums)
        for (int j = goal; j >= num; j--)
            dp[j] += dp[j - num];
    return dp[goal];
}
```

```java
int findTargetSumWays(int[] nums, int target) {
    int total = 0;
    for (int n : nums) total += n;
    if ((total + target) % 2 != 0 || Math.abs(target) > total) return 0;
    int goal = (total + target) / 2;
    int[] dp = new int[goal + 1];
    dp[0] = 1;
    for (int num : nums)
        for (int j = goal; j >= num; j--)
            dp[j] += dp[j - num];
    return dp[goal];
}
```

```typescript
function findTargetSumWays(nums: number[], target: number): number {
    const total = nums.reduce((a, b) => a + b, 0);
    if ((total + target) % 2 !== 0 || Math.abs(target) > total) return 0;
    const goal = (total + target) / 2;
    const dp = new Array(goal + 1).fill(0);
    dp[0] = 1;
    for (const num of nums)
        for (let j = goal; j >= num; j--)
            dp[j] += dp[j - num];
    return dp[goal];
}
```

```python
def findTargetSumWays(nums: list[int], target: int) -> int:
    total = sum(nums)
    if (total + target) % 2 or abs(target) > total: return 0
    goal = (total + target) // 2
    dp = [0] * (goal + 1)
    dp[0] = 1
    for num in nums:
        for j in range(goal, num - 1, -1):
            dp[j] += dp[j - num]
    return dp[goal]
```

```go
func findTargetSumWays(nums []int, target int) int {
    total := 0
    for _, n := range nums { total += n }
    if (total+target)%2 != 0 || abs(target) > total { return 0 }
    goal := (total + target) / 2
    dp := make([]int, goal+1)
    dp[0] = 1
    for _, num := range nums {
        for j := goal; j >= num; j-- { dp[j] += dp[j-num] }
    }
    return dp[goal]
}
func abs(x int) int { if x < 0 { return -x }; return x }
```

## Key Interview Insights

**Recognition:** If the problem says "pick a subset" or "can you achieve exactly X?" with a collection of integers, think 0/1 Knapsack. If items are reusable (coins, squares), think Unbounded Knapsack.

**The partition trick:** Many problems reduce to finding a subset summing to `total/2`. First check if `total` is odd (impossible). Then run 0/1 Knapsack toward `total/2`.

**Counting vs existence vs optimization:** The DP table stores different things depending on the question:
- Existence (can we?): `bool dp[j]`, initialize `dp[0] = true`
- Counting (how many ways?): `int dp[j]`, initialize `dp[0] = 1`
- Optimization (max/min): `int dp[j]`, initialize `dp[0] = 0` or `infinity`

**Loop direction is the #1 bug source:** Right-to-left for 0/1, left-to-right for unbounded. If your answers are wrong, check this first.
