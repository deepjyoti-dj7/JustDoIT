---
title: Daily Temperatures
difficulty: Medium
tags: [Stack, Array, Monotonic Stack]
link: https://leetcode.com/problems/daily-temperatures/
---

# Daily Temperatures

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) |
| **Tags** | Array, Stack, Monotonic Stack |

## Problem Statement

Given an array of integers `temperatures` representing daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the i-th day to get a warmer temperature. If there is no future warmer day, `answer[i] = 0`.

Example: `temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`
Output: `[1, 1, 4, 2, 1, 1, 0, 0]`

## Intuition

This is the classic **Next Greater Element** problem in disguise. Instead of returning the value, we return the **distance** (index difference) to the next greater element.

Brute force checks every future day for each day: O(n²). The monotonic stack does it in O(n) by processing each element exactly once.

**The insight:** maintain a stack of days where we haven't yet found a warmer day. When we encounter a temperature warmer than the stack's top, that day is the answer for the top — pop it and record the gap.

## Approach 1: Brute Force — O(n²)

Check every future day for each day.

```cpp
vector<int> dailyTemperatures(vector<int>& t) {
    int n = t.size();
    vector<int> ans(n, 0);
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (t[j] > t[i]) { ans[i] = j - i; break; }
        }
    }
    return ans;
}
```

```java
int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] ans = new int[n];
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (t[j] > t[i]) { ans[i] = j - i; break; }
        }
    }
    return ans;
}
```

```typescript
function dailyTemperatures(t: number[]): number[] {
    const n = t.length;
    const ans = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (t[j] > t[i]) { ans[i] = j - i; break; }
        }
    }
    return ans;
}
```

```python
def daily_temperatures(t: list[int]) -> list[int]:
    n = len(t)
    ans = [0] * n
    for i in range(n):
        for j in range(i + 1, n):
            if t[j] > t[i]:
                ans[i] = j - i
                break
    return ans
```

```go
func dailyTemperatures(t []int) []int {
    n := len(t)
    ans := make([]int, n)
    for i := 0; i < n; i++ {
        for j := i + 1; j < n; j++ {
            if t[j] > t[i] { ans[i] = j - i; break }
        }
    }
    return ans
}
```

**Time:** O(n²) — **Space:** O(1)

## Approach 2: Monotonic Stack — O(n)

Maintain a **decreasing monotonic stack** of indices. When `temperatures[i]` is greater than the temperature at the top index, the top index has found its warmer day.

```cpp
class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        int n = temperatures.size();
        vector<int> ans(n, 0);
        stack<int> st; // stores indices, maintains decreasing temperatures

        for (int i = 0; i < n; i++) {
            while (!st.empty() && temperatures[st.top()] < temperatures[i]) {
                int idx = st.top();
                st.pop();
                ans[idx] = i - idx;
            }
            st.push(i);
        }
        return ans;
    }
};
```

```java
class Solution {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] ans = new int[n];
        Deque<Integer> stack = new ArrayDeque<>(); // stores indices

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
                int idx = stack.pop();
                ans[idx] = i - idx;
            }
            stack.push(i);
        }
        return ans;
    }
}
```

```typescript
function dailyTemperatures(temperatures: number[]): number[] {
    const n = temperatures.length;
    const ans = new Array(n).fill(0);
    const stack: number[] = []; // indices

    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temperatures[stack[stack.length - 1]] < temperatures[i]) {
            const idx = stack.pop()!;
            ans[idx] = i - idx;
        }
        stack.push(i);
    }
    return ans;
}
```

```python
class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        n = len(temperatures)
        ans = [0] * n
        stack = []  # stores indices

        for i, temp in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < temp:
                idx = stack.pop()
                ans[idx] = i - idx
            stack.append(i)

        return ans
```

```go
func dailyTemperatures(temperatures []int) []int {
    n := len(temperatures)
    ans := make([]int, n)
    stack := []int{} // indices

    for i, temp := range temperatures {
        for len(stack) > 0 && temperatures[stack[len(stack)-1]] < temp {
            idx := stack[len(stack)-1]
            stack = stack[:len(stack)-1]
            ans[idx] = i - idx
        }
        stack = append(stack, i)
    }
    return ans
}
```

**Time:** O(n) — each index pushed and popped at most once.
**Space:** O(n) — stack holds at most n indices.

## Dry Run

`temperatures = [73, 74, 75, 71, 69, 72, 76, 73]`

| i | temp | Stack (indices) | Action | ans |
|---|---|---|---|---|
| 0 | 73 | [0] | push 0 | [0,0,0,0,0,0,0,0] |
| 1 | 74 | [1] | 74>73: pop 0 → ans[0]=1-0=**1**; push 1 | [1,0,...] |
| 2 | 75 | [2] | 75>74: pop 1 → ans[1]=2-1=**1**; push 2 | [1,1,...] |
| 3 | 71 | [2,3] | 71<75: push 3 | [1,1,...] |
| 4 | 69 | [2,3,4] | 69<71: push 4 | — |
| 5 | 72 | [2,5] | 72>69: pop 4 → ans[4]=5-4=**1**; 72>71: pop 3 → ans[3]=5-3=**2**; 72<75: push 5 | [1,1,0,2,1,...] |
| 6 | 76 | [6] | 76>72: pop 5 → ans[5]=6-5=**1**; 76>75: pop 2 → ans[2]=6-2=**4**; push 6 | [1,1,4,2,1,1,...] |
| 7 | 73 | [6,7] | 73<76: push 7 | — |

Remaining stack [6,7] → ans[6]=0, ans[7]=0 (already 0 by default).

Final: `[1, 1, 4, 2, 1, 1, 0, 0]` ✓

## Key Interview Insights

- **Store indices, not temperatures.** The answer requires the index difference, not the temperature.
- **The default answer is 0.** Initialize the result array to 0; elements remaining on the stack after the loop already have their 0 answer.
- **The while loop is O(n) total**, not O(n) per iteration. Each element is pushed once and popped once → 2n operations total.
- **`<` vs `<=`:** Using `<` means equal temperatures don't trigger a pop (correctly — a warmer day, not equal). If the problem asked for "next day at least as warm," use `<=`.

