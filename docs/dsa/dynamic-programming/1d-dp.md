---
title: 1D Dynamic Programming
description: Linear DP patterns — state over a single index with the most common interview templates
---

# 1D Dynamic Programming

1D DP is the entry point to dynamic programming. The state is a single integer — usually an index into an array or sequence — and the recurrence expresses the answer at position `i` in terms of answers at earlier positions.

Master these patterns and you can handle the majority of DP problems that appear in interviews.

## Pattern 1: The "Previous Choices" Pattern

**Shape:** At each index, you make a binary or multi-way choice. The result at `i` depends on the best result from some previous index.

**Template:**
```
dp[i] = best over all valid j < i of (dp[j] + contribution of choosing j → i)
```

### House Robber — The Quintessential Example

You're a robber. `nums[i]` = money in house `i`. You cannot rob two adjacent houses. Maximize loot.

**State:** `dp[i]` = maximum money robbing from houses `0..i`

**Recurrence:**
- Rob house `i`: `dp[i-2] + nums[i]` (must skip house `i-1`)
- Skip house `i`: `dp[i-1]`
- `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`

**Base cases:** `dp[0] = nums[0]`, `dp[1] = max(nums[0], nums[1])`

```cpp
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    vector<int> dp(n);
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}
```

```java
int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];
    int[] dp = new int[n];
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (int i = 2; i < n; i++)
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}
```

```typescript
function rob(nums: number[]): number {
    const n = nums.length;
    if (n === 1) return nums[0];
    const dp = new Array(n).fill(0);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    for (let i = 2; i < n; i++)
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    return dp[n-1];
}
```

```python
def rob(nums: list[int]) -> int:
    n = len(nums)
    if n == 1: return nums[0]
    dp = [0] * n
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    return dp[-1]
```

```go
func rob(nums []int) int {
    n := len(nums)
    if n == 1 { return nums[0] }
    dp := make([]int, n)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    for i := 2; i < n; i++ {
        dp[i] = max(dp[i-1], dp[i-2]+nums[i])
    }
    return dp[n-1]
}
```

**Space optimization:** Since `dp[i]` only needs `dp[i-1]` and `dp[i-2]`, use two variables:

```cpp
int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```java
int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```typescript
function rob(nums: number[]): number {
    let prev2 = 0, prev1 = 0;
    for (const num of nums) {
        const curr = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

```python
def rob(nums: list[int]) -> int:
    prev2 = prev1 = 0
    for num in nums:
        prev2, prev1 = prev1, max(prev1, prev2 + num)
    return prev1
```

```go
func rob(nums []int) int {
    prev2, prev1 := 0, 0
    for _, num := range nums {
        prev2, prev1 = prev1, max(prev1, prev2+num)
    }
    return prev1
}
```

## Pattern 2: Coin Change / Minimum Steps

**Shape:** Reach a target value using available "jumps." Find the minimum number of jumps (or total ways).

**Two variants:**
- **Minimum count:** `dp[i] = min(dp[i - coin] + 1)` over all valid coins
- **Number of ways:** `dp[i] += dp[i - coin]` over all valid coins

### Coin Change (Minimum Coins)

**State:** `dp[i]` = minimum coins needed to make amount `i`

**Recurrence:** `dp[i] = min(dp[i - coin] + 1)` for each `coin` where `coin <= i`

**Base cases:** `dp[0] = 0` (0 coins for amount 0), `dp[i] = infinity` initially

```cpp
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++)
        for (int coin : coins)
            if (coin <= i && dp[i - coin] != INT_MAX)
                dp[i] = min(dp[i], dp[i - coin] + 1);
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}
```

```java
int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);  // sentinel > max possible
    dp[0] = 0;
    for (int i = 1; i <= amount; i++)
        for (int coin : coins)
            if (coin <= i)
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}
```

```typescript
function coinChange(coins: number[], amount: number): number {
    const dp = new Array(amount + 1).fill(amount + 1);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++)
        for (const coin of coins)
            if (coin <= i)
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}
```

```python
def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
```

```go
func coinChange(coins []int, amount int) int {
    dp := make([]int, amount+1)
    for i := range dp { dp[i] = amount + 1 }
    dp[0] = 0
    for i := 1; i <= amount; i++ {
        for _, coin := range coins {
            if coin <= i && dp[i-coin]+1 < dp[i] {
                dp[i] = dp[i-coin] + 1
            }
        }
    }
    if dp[amount] > amount { return -1 }
    return dp[amount]
}
```

**Key insight:** The loop structure matters for the variant:
- Outer loop over amounts, inner loop over coins → **combination count** (order doesn't matter)
- Outer loop over coins, inner loop over amounts → **permutation count** (order matters)

For Coin Change II (number of ways), swap the outer/inner loop and add instead of min:

```cpp
// Coin Change II — count of combinations
int change(int amount, vector<int>& coins) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;
    for (int coin : coins)           // outer: coins
        for (int i = coin; i <= amount; i++)  // inner: amounts
            dp[i] += dp[i - coin];
    return dp[amount];
}
```

```java
int change(int amount, int[] coins) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    for (int coin : coins)
        for (int i = coin; i <= amount; i++)
            dp[i] += dp[i - coin];
    return dp[amount];
}
```

```typescript
function change(amount: number, coins: number[]): number {
    const dp = new Array(amount + 1).fill(0);
    dp[0] = 1;
    for (const coin of coins)
        for (let i = coin; i <= amount; i++)
            dp[i] += dp[i - coin];
    return dp[amount];
}
```

```python
def change(amount: int, coins: list[int]) -> int:
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    return dp[amount]
```

```go
func change(amount int, coins []int) int {
    dp := make([]int, amount+1)
    dp[0] = 1
    for _, coin := range coins {
        for i := coin; i <= amount; i++ {
            dp[i] += dp[i-coin]
        }
    }
    return dp[amount]
}
```

## Pattern 3: Decode Ways / Count Distinct Paths

**Shape:** At each position, look back 1 or 2 (or more) positions to count how many ways reach the current position.

### Decode Ways

A string of digits encodes letters (1='A', ..., 26='Z'). Count the number of decodings.

**State:** `dp[i]` = number of ways to decode `s[0..i-1]` (1-indexed)

**Recurrence:**
- Single digit `s[i-1]`: if `'1' <= s[i-1] <= '9'`, add `dp[i-1]`
- Two digits `s[i-2..i-1]`: if `10 <= val <= 26`, add `dp[i-2]`

```cpp
int numDecodings(string s) {
    int n = s.size();
    vector<int> dp(n + 1, 0);
    dp[0] = 1;                                    // empty prefix: 1 way
    dp[1] = s[0] != '0' ? 1 : 0;                 // first char

    for (int i = 2; i <= n; i++) {
        if (s[i-1] != '0')                        // single digit
            dp[i] += dp[i-1];
        int two = stoi(s.substr(i-2, 2));
        if (two >= 10 && two <= 26)               // two digits
            dp[i] += dp[i-2];
    }
    return dp[n];
}
```

```java
int numDecodings(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = s.charAt(0) != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        if (s.charAt(i-1) != '0')
            dp[i] += dp[i-1];
        int two = Integer.parseInt(s.substring(i-2, i));
        if (two >= 10 && two <= 26)
            dp[i] += dp[i-2];
    }
    return dp[n];
}
```

```typescript
function numDecodings(s: string): number {
    const n = s.length;
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;
    dp[1] = s[0] !== '0' ? 1 : 0;
    for (let i = 2; i <= n; i++) {
        if (s[i-1] !== '0') dp[i] += dp[i-1];
        const two = parseInt(s.substring(i-2, i));
        if (two >= 10 && two <= 26) dp[i] += dp[i-2];
    }
    return dp[n];
}
```

```python
def numDecodings(s: str) -> int:
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1 if s[0] != '0' else 0
    for i in range(2, n + 1):
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        two = int(s[i-2:i])
        if 10 <= two <= 26:
            dp[i] += dp[i-2]
    return dp[n]
```

```go
func numDecodings(s string) int {
    n := len(s)
    dp := make([]int, n+1)
    dp[0] = 1
    if s[0] != '0' { dp[1] = 1 }
    for i := 2; i <= n; i++ {
        if s[i-1] != '0' { dp[i] += dp[i-1] }
        two := (int(s[i-2]-'0') * 10) + int(s[i-1]-'0')
        if two >= 10 && two <= 26 { dp[i] += dp[i-2] }
    }
    return dp[n]
}
```

## Pattern 4: Jump Game / Reachability

**Shape:** Each position has a reach. Can you get to the end? What is the minimum jumps?

**Greedy first, DP second:** Jump Game I (can you reach the end?) is actually greedier than DP — track the maximum reachable index. Jump Game II (minimum jumps) uses BFS-like greedy. But the DP formulation is a clean fallback.

```cpp
// Jump Game I — can we reach the end?
bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (i > maxReach) return false;
        maxReach = max(maxReach, i + nums[i]);
    }
    return true;
}
```

```java
boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}
```

```typescript
function canJump(nums: number[]): boolean {
    let maxReach = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}
```

```python
def canJump(nums: list[int]) -> bool:
    max_reach = 0
    for i, jump in enumerate(nums):
        if i > max_reach: return False
        max_reach = max(max_reach, i + jump)
    return True
```

```go
func canJump(nums []int) bool {
    maxReach := 0
    for i, jump := range nums {
        if i > maxReach { return false }
        if i+jump > maxReach { maxReach = i + jump }
    }
    return true
}
```

## Pattern 5: Stock Buy/Sell (State Machine DP)

When a problem has a **state machine** — you're in one of several states, and actions transition you between them — DP over states is natural.

**Best Time to Buy and Sell Stock with Cooldown:**

States: `holding` (own a stock), `cooldown`, `idle`

```cpp
int maxProfit(vector<int>& prices) {
    int holding = INT_MIN, cooldown = 0, idle = 0;
    for (int p : prices) {
        int prevHolding = holding, prevCooldown = cooldown, prevIdle = idle;
        holding  = max(prevHolding, prevIdle - p);   // buy from idle
        cooldown = prevHolding + p;                   // sell
        idle     = max(prevIdle, prevCooldown);       // rest
    }
    return max(cooldown, idle);
}
```

```java
int maxProfit(int[] prices) {
    int holding = Integer.MIN_VALUE, cooldown = 0, idle = 0;
    for (int p : prices) {
        int ph = holding, pc = cooldown, pi = idle;
        holding  = Math.max(ph, pi - p);
        cooldown = ph + p;
        idle     = Math.max(pi, pc);
    }
    return Math.max(cooldown, idle);
}
```

```typescript
function maxProfit(prices: number[]): number {
    let holding = -Infinity, cooldown = 0, idle = 0;
    for (const p of prices) {
        const [ph, pc, pi] = [holding, cooldown, idle];
        holding  = Math.max(ph, pi - p);
        cooldown = ph + p;
        idle     = Math.max(pi, pc);
    }
    return Math.max(cooldown, idle);
}
```

```python
def maxProfit(prices: list[int]) -> int:
    holding, cooldown, idle = float('-inf'), 0, 0
    for p in prices:
        holding, cooldown, idle = (
            max(holding, idle - p),
            holding + p,
            max(idle, cooldown)
        )
    return max(cooldown, idle)
```

```go
func maxProfit(prices []int) int {
    holding, cooldown, idle := -1<<31, 0, 0
    for _, p := range prices {
        holding, cooldown, idle = max(holding, idle-p), holding+p, max(idle, cooldown)
    }
    return max(cooldown, idle)
}
```

## Complexity Summary

| Problem | Time | Space | Optimized Space |
|---|---|---|---|
| House Robber | O(n) | O(n) | O(1) |
| Coin Change | O(n × coins) | O(n) | O(n) |
| Coin Change II | O(n × coins) | O(n) | O(n) |
| Decode Ways | O(n) | O(n) | O(1) |
| Jump Game | O(n) | O(1) | O(1) |
| Stock Cooldown | O(n) | O(1) | O(1) |

## Common Pitfalls in 1D DP

**Forgetting the empty prefix base case:** Many counting problems need `dp[0] = 1` to represent "the empty selection is one valid configuration." Missing this makes all counts 0.

**Not handling leading zeros in Decode Ways:** Characters like `'0'` cannot be decoded alone — they can only combine with the previous digit. Always check before adding.

**Off-by-one in 1-indexed DP:** When `dp[i]` represents the answer for the first `i` characters (1-indexed), `s[i-1]` is the `i`-th character. Stay consistent.

**Coin Change: wrong loop order for combinations vs permutations:** Outer coins, inner amounts = combinations (each coin used unlimited times, order-independent). Outer amounts, inner coins = permutations (order matters). Pick based on what the problem asks.
