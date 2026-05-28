---
title: Space-Time Tradeoffs
description: When and how to trade memory for speed — the core patterns every interview candidate must master
---

# Space-Time Tradeoffs

The single most impactful skill in interview problem solving: knowing when to spend memory to save time, and when to do the reverse. Almost every optimization is a variation of this tradeoff.

> **Core principle:** Use memory to avoid recomputing the same thing.

---

## Tradeoff 1: Brute Force Scan → Hash Map

**Problem:** Two Sum — find indices of two numbers that add to target.

**Brute force (O(n²) time, O(1) space):** Try every pair.

**Optimal (O(n) time, O(n) space):** Store each number in a hash map; for each x, check if `target - x` is already seen.

```cpp
// O(n) time, O(n) space
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement))
            return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}
```

```java
int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement))
            return new int[]{seen.get(complement), i};
        seen.put(nums[i], i);
    }
    return new int[]{};
}
```

```typescript
function twoSum(nums: number[], target: number): number[] {
    const seen = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) return [seen.get(complement)!, i];
        seen.set(nums[i], i);
    }
    return [];
}
```

```python
def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}
    for i, x in enumerate(nums):
        complement = target - x
        if complement in seen:
            return [seen[complement], i]
        seen[x] = i
    return []
```

```go
func twoSum(nums []int, target int) []int {
    seen := map[int]int{}
    for i, x := range nums {
        if j, ok := seen[target-x]; ok {
            return []int{j, i}
        }
        seen[x] = i
    }
    return nil
}
```

**Trade:** O(n) extra space → O(n²) → O(n) time. The hash map gives O(1) average lookup instead of O(n) scan.

---

## Tradeoff 2: Repeated Range Queries → Prefix Sum

**Problem:** Many subarray sum queries on a static array.

**Brute force:** O(n) per query → O(nq) for q queries.

**Optimal:** Build prefix sum array once in O(n). Each query is then O(1).

```cpp
class NumArray {
    vector<int> prefix;
public:
    NumArray(vector<int>& nums) {
        prefix.resize(nums.size() + 1, 0);
        for (int i = 0; i < nums.size(); i++)
            prefix[i + 1] = prefix[i] + nums[i];
    }
    int sumRange(int l, int r) {
        return prefix[r + 1] - prefix[l];  // O(1)
    }
};
```

```java
class NumArray {
    int[] prefix;
    NumArray(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++)
            prefix[i + 1] = prefix[i] + nums[i];
    }
    int sumRange(int l, int r) {
        return prefix[r + 1] - prefix[l];
    }
}
```

```typescript
class NumArray {
    private prefix: number[];
    constructor(nums: number[]) {
        this.prefix = new Array(nums.length + 1).fill(0);
        for (let i = 0; i < nums.length; i++)
            this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
    sumRange(l: number, r: number): number {
        return this.prefix[r + 1] - this.prefix[l];
    }
}
```

```python
class NumArray:
    def __init__(self, nums: list[int]):
        self.prefix = [0] * (len(nums) + 1)
        for i, x in enumerate(nums):
            self.prefix[i + 1] = self.prefix[i] + x

    def sum_range(self, l: int, r: int) -> int:
        return self.prefix[r + 1] - self.prefix[l]
```

```go
type NumArray struct{ prefix []int }

func Constructor(nums []int) NumArray {
    prefix := make([]int, len(nums)+1)
    for i, x := range nums { prefix[i+1] = prefix[i] + x }
    return NumArray{prefix}
}

func (na *NumArray) SumRange(l, r int) int {
    return na.prefix[r+1] - na.prefix[l]
}
```

**Trade:** O(n) space for prefix array → each of q queries drops from O(n) to O(1). Pays off as soon as q ≥ 2.

---

## Tradeoff 3: Recomputation → Memoization

**Problem:** Fibonacci or any overlapping-subproblem recursion.

**Without memo (O(2^n)):** Same subproblems recomputed exponentially.

**With memo (O(n) time, O(n) space):** Each unique state computed once.

```cpp
unordered_map<int, long long> memo;
long long fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}
```

```java
Map<Integer, Long> memo = new HashMap<>();
long fib(int n) {
    if (n <= 1) return n;
    if (memo.containsKey(n)) return memo.get(n);
    long res = fib(n - 1) + fib(n - 2);
    memo.put(n, res);
    return res;
}
```

```typescript
const memo = new Map<number, number>();
function fib(n: number): number {
    if (n <= 1) return n;
    if (memo.has(n)) return memo.get(n)!;
    const res = fib(n - 1) + fib(n - 2);
    memo.set(n, res);
    return res;
}
```

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n: int) -> int:
    if n <= 1: return n
    return fib(n - 1) + fib(n - 2)
```

```go
var memo = map[int]int{}
func fib(n int) int {
    if n <= 1 { return n }
    if v, ok := memo[n]; ok { return v }
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]
}
```

**Further optimization (O(1) space):** If you only need the final result, use two variables rolling forward: O(n) time, O(1) space.

---

## Tradeoff 4: O(1) Space → Sort First

**Problem:** Find if any duplicates exist in an array.

| Approach | Time | Space |
|---|---|---|
| Hash set | O(n) | O(n) |
| Sort + adjacent check | O(n log n) | O(1)* |

*If in-place sort is allowed.

```cpp
// O(n) time, O(n) space — hash set
bool hasDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int x : nums) {
        if (seen.count(x)) return true;
        seen.insert(x);
    }
    return false;
}

// O(n log n) time, O(1) space — sort
bool hasDuplicateSorted(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    for (int i = 1; i < nums.size(); i++)
        if (nums[i] == nums[i-1]) return true;
    return false;
}
```

```java
// O(n) time, O(n) space
boolean hasDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) if (!seen.add(x)) return true;
    return false;
}
```

```typescript
// O(n) time, O(n) space
function hasDuplicate(nums: number[]): boolean {
    return new Set(nums).size !== nums.length;
}
```

```python
# O(n) time, O(n) space
def has_duplicate(nums: list[int]) -> bool:
    return len(nums) != len(set(nums))
```

```go
// O(n) time, O(n) space
func hasDuplicate(nums []int) bool {
    seen := map[int]bool{}
    for _, x := range nums {
        if seen[x] { return true }
        seen[x] = true
    }
    return false
}
```

**When to choose sort:** The interviewer asks for O(1) space, or modifying the input is acceptable.

---

## Tradeoff 5: DP Table → Rolling Array

**Problem:** Reduce 2D DP to O(n) space.

Many 2D DP problems only look back one row. Store just that row.

```cpp
// LCS: O(nm) → O(min(n,m)) space
int lcs(string& s1, string& s2) {
    if (s1.size() < s2.size()) swap(s1, s2);
    int m = s1.size(), n = s2.size();
    vector<int> dp(n + 1, 0);
    for (int i = 1; i <= m; i++) {
        int prev = 0;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            dp[j] = (s1[i-1] == s2[j-1]) ? prev + 1 : max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

```java
int lcs(String s1, String s2) {
    int m = s1.length(), n = s2.length();
    int[] dp = new int[n + 1];
    for (int i = 1; i <= m; i++) {
        int prev = 0;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            dp[j] = s1.charAt(i-1) == s2.charAt(j-1) ? prev + 1 : Math.max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

```typescript
function lcs(s1: string, s2: string): number {
    const m = s1.length, n = s2.length;
    const dp = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
        let prev = 0;
        for (let j = 1; j <= n; j++) {
            const temp = dp[j];
            dp[j] = s1[i-1] === s2[j-1] ? prev + 1 : Math.max(dp[j], dp[j-1]);
            prev = temp;
        }
    }
    return dp[n];
}
```

```python
def lcs(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [0] * (n + 1)
    for i in range(1, m + 1):
        prev = 0
        for j in range(1, n + 1):
            temp = dp[j]
            dp[j] = prev + 1 if s1[i-1] == s2[j-1] else max(dp[j], dp[j-1])
            prev = temp
    return dp[n]
```

```go
func lcs(s1, s2 string) int {
    m, n := len(s1), len(s2)
    dp := make([]int, n+1)
    for i := 1; i <= m; i++ {
        prev := 0
        for j := 1; j <= n; j++ {
            temp := dp[j]
            if s1[i-1] == s2[j-1] { dp[j] = prev + 1 } else if dp[j] < dp[j-1] { dp[j] = dp[j-1] }
            prev = temp
        }
    }
    return dp[n]
}
```

**Trade:** O(nm) → O(min(n,m)) space. Time stays O(nm). The `prev` variable captures the diagonal cell.

---

## Decision Framework

Use this to pick the right tradeoff during an interview:

```
1. Is the same value computed multiple times?
   YES → memoize or precompute (spend O(n) space, save repeated work)

2. Are there many queries on static data?
   YES → prefix sum, sparse table, or segment tree

3. Does the interviewer ask for O(1) space?
   YES → sort first (costs O(n log n) time), bit manipulation, or in-place

4. Is the bottleneck lookup speed?
   YES → hash map (O(1) average lookup vs O(n) scan)

5. Is the bottleneck 2D DP space?
   YES → rolling array (keep only previous row)
```

## Tradeoff Reference Table

| Problem Type | Brute | Space Used | Optimal | Space Used |
|---|---|---|---|---|
| Two Sum | O(n²) time | O(1) | O(n) time | O(n) hash map |
| Range sum query | O(n) per query | O(1) | O(1) per query | O(n) prefix |
| Has duplicate | O(n²) time | O(1) | O(n) time | O(n) set |
| Fibonacci | O(2^n) time | O(n) | O(n) time | O(n) memo |
| LCS | O(nm) time | O(nm) | O(nm) time | O(min(n,m)) |
| Top-k elements | O(n log n) sort | O(1) | O(n log k) | O(k) heap |

## Key Interview Insights

- **Always offer the tradeoff explicitly.** "I can solve this in O(n²) time with O(1) space, or O(n) time with O(n) space — which do you prefer?"
- **Hash map is the most impactful tradeoff.** O(n) extra space buys you O(1) average lookup at every step. Know this reflex.
- **Prefix sum is the second most impactful.** If you see "sum/count of subarray" more than once, prefix sum is the answer.
- **Rolling array is the standard DP space optimization.** Any 2D DP that only looks back one row can be reduced to O(n) with a prev-variable trick.
- **Sorting is a valid space-for-time reverse trade.** When you need O(1) space and O(n log n) time is acceptable, sort first.
