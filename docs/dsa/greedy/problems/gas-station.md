---
title: Gas Station
difficulty: Medium
tags: [Greedy, Array]
link: https://leetcode.com/problems/gas-station/
---

# Gas Station

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [134. Gas Station](https://leetcode.com/problems/gas-station/) |
| **Tags** | Greedy, Array |

## Problem Statement

There are `n` gas stations in a circle. The `i`-th station has `gas[i]` liters of fuel. It costs `cost[i]` to travel from station `i` to the next. Starting with an empty tank, find the **starting station index** from which you can complete the full circuit. If no solution exists, return `-1`. The solution is guaranteed to be unique if it exists.

**Example:**
```
gas  = [1, 2, 3, 4, 5]
cost = [3, 4, 5, 1, 2]

Output: 3
Start at station 3:
  tank=0+4-1=3, go to 4
  tank=3+5-2=6, go to 0
  tank=6+1-3=4, go to 1
  tank=4+2-4=2, go to 2
  tank=2+3-5=0, arrive at 3 ✓
```

---

## Intuition

Two key observations:

1. **Existence check:** If `sum(gas) < sum(cost)`, no solution exists — you simply don't have enough fuel total.

2. **Finding the start:** If a solution exists, the starting point is the station *after the lowest running-sum prefix*. Why? If your running tank dips lowest at station `k`, then no station between your current start and `k` could be a valid starting point (they'd all hit negative tank before completing the circuit).

Think of `net[i] = gas[i] - cost[i]`. We want to find a start index such that all prefix sums of `net` (with circular wrap) are non-negative. The greedy approach finds exactly this.

---

## Approach 1: Brute Force

Try starting from each station. Simulate the full circuit.

```cpp
int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int n = gas.size();
    for (int start = 0; start < n; start++) {
        int tank = 0;
        bool ok = true;
        for (int i = 0; i < n; i++) {
            int idx = (start + i) % n;
            tank += gas[idx] - cost[idx];
            if (tank < 0) { ok = false; break; }
        }
        if (ok) return start;
    }
    return -1;
}
```

```java
int canCompleteCircuit(int[] gas, int[] cost) {
    int n = gas.length;
    for (int start = 0; start < n; start++) {
        int tank = 0;
        boolean ok = true;
        for (int i = 0; i < n; i++) {
            int idx = (start + i) % n;
            tank += gas[idx] - cost[idx];
            if (tank < 0) { ok = false; break; }
        }
        if (ok) return start;
    }
    return -1;
}
```

```typescript
function canCompleteCircuit(gas: number[], cost: number[]): number {
    const n = gas.length;
    for (let start = 0; start < n; start++) {
        let tank = 0, ok = true;
        for (let i = 0; i < n; i++) {
            const idx = (start + i) % n;
            tank += gas[idx] - cost[idx];
            if (tank < 0) { ok = false; break; }
        }
        if (ok) return start;
    }
    return -1;
}
```

```python
def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    n = len(gas)
    for start in range(n):
        tank = 0
        ok = True
        for i in range(n):
            idx = (start + i) % n
            tank += gas[idx] - cost[idx]
            if tank < 0:
                ok = False
                break
        if ok:
            return start
    return -1
```

```go
func canCompleteCircuit(gas []int, cost []int) int {
    n := len(gas)
    for start := 0; start < n; start++ {
        tank, ok := 0, true
        for i := 0; i < n; i++ {
            idx := (start + i) % n
            tank += gas[idx] - cost[idx]
            if tank < 0 { ok = false; break }
        }
        if ok { return start }
    }
    return -1
}
```

**Time:** O(n²) — **Space:** O(1)

---

## Approach 2: Greedy (Optimal)

One pass. Track `totalSurplus` and `tank`. When `tank` goes negative, the current start is invalid — reset start to `i+1` and reset `tank` to 0. After the loop, if `totalSurplus >= 0`, return `start`; else `-1`.

**Why this works:** If starting from `s` makes your tank go negative at station `k`, then no station between `s` and `k` can be a valid start either (since we'd be starting with less fuel than if we'd started at `s`). So we can safely skip to `k+1`.

```cpp
int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
    int totalSurplus = 0, tank = 0, start = 0;
    for (int i = 0; i < (int)gas.size(); i++) {
        int net = gas[i] - cost[i];
        totalSurplus += net;
        tank += net;
        if (tank < 0) {
            start = i + 1;   // reset candidate start
            tank = 0;
        }
    }
    return totalSurplus >= 0 ? start : -1;
}
```

```java
int canCompleteCircuit(int[] gas, int[] cost) {
    int totalSurplus = 0, tank = 0, start = 0;
    for (int i = 0; i < gas.length; i++) {
        int net = gas[i] - cost[i];
        totalSurplus += net;
        tank += net;
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    return totalSurplus >= 0 ? start : -1;
}
```

```typescript
function canCompleteCircuit(gas: number[], cost: number[]): number {
    let totalSurplus = 0, tank = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
        const net = gas[i] - cost[i];
        totalSurplus += net;
        tank += net;
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    return totalSurplus >= 0 ? start : -1;
}
```

```python
def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    total_surplus = 0
    tank = 0
    start = 0
    for i, (g, c) in enumerate(zip(gas, cost)):
        net = g - c
        total_surplus += net
        tank += net
        if tank < 0:
            start = i + 1
            tank = 0
    return start if total_surplus >= 0 else -1
```

```go
func canCompleteCircuit(gas []int, cost []int) int {
    totalSurplus, tank, start := 0, 0, 0
    for i := range gas {
        net := gas[i] - cost[i]
        totalSurplus += net
        tank += net
        if tank < 0 {
            start = i + 1
            tank = 0
        }
    }
    if totalSurplus >= 0 {
        return start
    }
    return -1
}
```

**Time:** O(n) — **Space:** O(1)

---

## Dry Run

`gas = [1,2,3,4,5]`, `cost = [3,4,5,1,2]`  
`net = [-2,-2,-2,3,3]`

| i | net | tank (before reset) | start |
|---|---|---|---|
| 0 | -2 | -2 → reset | 1 |
| 1 | -2 | -2 → reset | 2 |
| 2 | -2 | -2 → reset | 3 |
| 3 | +3 | 3 | 3 |
| 4 | +3 | 6 | 3 |

`totalSurplus = -2-2-2+3+3 = 0 >= 0` → return `start = 3` ✓

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute Force | O(n²) | O(1) |
| Greedy | O(n) | O(1) |

---

## Key Interview Insights

- **Two-step reasoning:** First check feasibility (`totalSurplus >= 0`), then the greedy reset finds the answer in the same pass.
- **The skip argument:** When tank goes negative at `i`, any start in `[current_start, i]` fails — they'd all eventually hit the same deficit. Jump to `i+1`.
- **Uniqueness:** The problem guarantees uniqueness when a solution exists, which is why the greedy reset always finds the right answer (no ambiguity to resolve).
- **Net array trick:** Precompute `net[i] = gas[i] - cost[i]` mentally. The problem reduces to finding a starting index where all prefix sums (circular) are non-negative.
- Don't forget: if `start == n` at the end (which can happen if the last station resets it), there's no valid starting point — the `totalSurplus` check handles this.
