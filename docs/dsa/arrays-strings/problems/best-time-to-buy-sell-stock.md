---
title: Best Time to Buy and Sell Stock
difficulty: Easy
tags: [Array, Sliding Window, Dynamic Programming]
link: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
---

# Best Time to Buy and Sell Stock

| | |
|---|---|
| **Difficulty** | Easy |
| **LeetCode** | [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) |
| **Tags** | Array, Sliding Window, DP |

## Problem Statement

Given an array `prices` where `prices[i]` is the price of a stock on day `i`, find the maximum profit from one buy and one sell. You must buy before you sell. If no profit is possible, return 0.

## Intuition

We want to buy at the lowest point and sell at the highest point **after** the buy. The key insight: track the minimum price seen so far, and at each step calculate the profit if we sold today.

## Approach 1: Brute Force

Try every (buy, sell) pair where buy comes before sell.

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int maxP = 0;
        for (int i = 0; i < prices.size(); i++) {
            for (int j = i + 1; j < prices.size(); j++) {
                maxP = max(maxP, prices[j] - prices[i]);
            }
        }
        return maxP;
    }
};
```

```java
class Solution {
    public int maxProfit(int[] prices) {
        int maxP = 0;
        for (int i = 0; i < prices.length; i++) {
            for (int j = i + 1; j < prices.length; j++) {
                maxP = Math.max(maxP, prices[j] - prices[i]);
            }
        }
        return maxP;
    }
}
```

```typescript
function maxProfit(prices: number[]): number {
    let maxP = 0;
    for (let i = 0; i < prices.length; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            maxP = Math.max(maxP, prices[j] - prices[i]);
        }
    }
    return maxP;
}
```

```python
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        max_p = 0
        for i in range(len(prices)):
            for j in range(i + 1, len(prices)):
                max_p = max(max_p, prices[j] - prices[i])
        return max_p
```

```go
func maxProfit(prices []int) int {
    maxP := 0
    for i := 0; i < len(prices); i++ {
        for j := i + 1; j < len(prices); j++ {
            if prices[j]-prices[i] > maxP {
                maxP = prices[j] - prices[i]
            }
        }
    }
    return maxP
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: One Pass (Optimal)

Track the minimum price so far. At each day, the best profit is `current price - minimum so far`.

```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        for (int price : prices) {
            minPrice = min(minPrice, price);
            maxProfit = max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
};
```

```java
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
}
```

```typescript
function maxProfit(prices: number[]): number {
    let minPrice = Infinity;
    let maxP = 0;
    for (const price of prices) {
        minPrice = Math.min(minPrice, price);
        maxP = Math.max(maxP, price - minPrice);
    }
    return maxP;
}
```

```python
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit
```

```go
func maxProfit(prices []int) int {
    minPrice := prices[0]
    maxP := 0
    for _, price := range prices {
        if price < minPrice {
            minPrice = price
        }
        if price-minPrice > maxP {
            maxP = price - minPrice
        }
    }
    return maxP
}
```

**Time:** O(n) — **Space:** O(1)

## Dry Run

Input: `prices = [7, 1, 5, 3, 6, 4]`

| Day | Price | minPrice | Profit | maxProfit |
|---|---|---|---|---|
| 0 | 7 | 7 | 0 | 0 |
| 1 | 1 | 1 | 0 | 0 |
| 2 | 5 | 1 | 4 | 4 |
| 3 | 3 | 1 | 2 | 4 |
| 4 | 6 | 1 | 5 | **5** |
| 5 | 4 | 1 | 3 | 5 |

Buy on day 1 (price=1), sell on day 4 (price=6) → profit = 5.

## Key Interview Insights

- **This is Kadane's algorithm in disguise.** Reframe as: maximize `prices[j] - prices[i]` where `j > i`. The daily difference array turns this into a maximum subarray problem.
- **Why greedy works:** We only need one transaction. The optimal buy point is always the global minimum *before* the optimal sell point.
- **Follow-up variants:**
  - Buy and sell **multiple times** → sum all positive differences
  - At most **K transactions** → DP with states
  - With **cooldown** → state machine DP
