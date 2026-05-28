---
title: Hand of Straights
difficulty: Medium
tags: [Greedy, Hash Map, Sorting]
link: https://leetcode.com/problems/hand-of-straights/
---

# Hand of Straights

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [846. Hand of Straights](https://leetcode.com/problems/hand-of-straights/) |
| **Tags** | Greedy, Hash Map, Sorting |

## Problem Statement

Alice has `hand`, an array of card values. She wants to rearrange them into groups of `groupSize` consecutive cards. Return `true` if she can, `false` otherwise.

**Example 1:**
```
hand = [1,2,3,6,2,3,4,7,8], groupSize = 3
Output: true
Groups: [1,2,3], [2,3,4], [6,7,8]
```

**Example 2:**
```
hand = [1,2,3,4,5], groupSize = 4
Output: false  (can't form groups of 4)
```

---

## Intuition

**Key insight:** Always try to start a new group with the *smallest* available card. If you can't, it's impossible.

Why? Suppose the smallest card is `x`. It *must* go into a group that starts at `x` (since all other group start values are larger, they wouldn't include `x`). If we can't form a group `[x, x+1, ..., x+groupSize-1]`, then `x` is stranded — no valid arrangement exists.

This reduces to: sort the distinct card values, then greedily consume groups starting from the minimum each time.

---

## Approach 1: Sorting (Intuitive)

Sort the hand. For each card (in sorted order), if it hasn't been used yet, try to form a group starting at this card.

```cpp
bool isNStraightHand(vector<int>& hand, int groupSize) {
    if (hand.size() % groupSize != 0) return false;
    map<int,int> count;
    for (int c : hand) count[c]++;
    for (auto& [card, cnt] : count) {
        if (cnt == 0) continue;
        // Try to form 'cnt' groups starting at 'card'
        for (int i = 0; i < groupSize; i++) {
            if (count[card + i] < cnt) return false;
            count[card + i] -= cnt;
        }
    }
    return true;
}
```

```java
boolean isNStraightHand(int[] hand, int groupSize) {
    if (hand.length % groupSize != 0) return false;
    TreeMap<Integer, Integer> count = new TreeMap<>();
    for (int c : hand) count.merge(c, 1, Integer::sum);
    for (int card : count.keySet()) {
        int cnt = count.get(card);
        if (cnt == 0) continue;
        for (int i = 0; i < groupSize; i++) {
            int needed = count.getOrDefault(card + i, 0);
            if (needed < cnt) return false;
            if (needed - cnt == 0) count.remove(card + i);
            else count.put(card + i, needed - cnt);
        }
    }
    return true;
}
```

```typescript
function isNStraightHand(hand: number[], groupSize: number): boolean {
    if (hand.length % groupSize !== 0) return false;
    const count = new Map<number, number>();
    for (const c of hand) count.set(c, (count.get(c) ?? 0) + 1);
    const sorted = [...count.keys()].sort((a, b) => a - b);
    for (const card of sorted) {
        const cnt = count.get(card)!;
        if (cnt === 0) continue;
        for (let i = 0; i < groupSize; i++) {
            const available = count.get(card + i) ?? 0;
            if (available < cnt) return false;
            count.set(card + i, available - cnt);
        }
    }
    return true;
}
```

```python
from collections import Counter

def is_n_straight_hand(hand: list[int], group_size: int) -> bool:
    if len(hand) % group_size != 0:
        return False
    count = Counter(hand)
    for card in sorted(count):
        cnt = count[card]
        if cnt == 0:
            continue
        for i in range(group_size):
            if count[card + i] < cnt:
                return False
            count[card + i] -= cnt
    return True
```

```go
import "sort"

func isNStraightHand(hand []int, groupSize int) bool {
    if len(hand)%groupSize != 0 { return false }
    count := map[int]int{}
    for _, c := range hand { count[c]++ }

    keys := make([]int, 0, len(count))
    for k := range count { keys = append(keys, k) }
    sort.Ints(keys)

    for _, card := range keys {
        cnt := count[card]
        if cnt == 0 { continue }
        for i := 0; i < groupSize; i++ {
            if count[card+i] < cnt { return false }
            count[card+i] -= cnt
        }
    }
    return true
}
```

**Time:** O(n log n) — **Space:** O(n)

---

## Approach 2: Min-Heap (Alternative)

Use a min-heap to always access the smallest available card. Pop the minimum and try to consume `groupSize` consecutive cards, using the frequency map.

```cpp
bool isNStraightHand(vector<int>& hand, int groupSize) {
    if (hand.size() % groupSize != 0) return false;
    map<int,int> count;
    for (int c : hand) count[c]++;
    priority_queue<int, vector<int>, greater<int>> pq;
    for (auto& [k, v] : count) pq.push(k);
    while (!pq.empty()) {
        int start = pq.top();
        for (int i = 0; i < groupSize; i++) {
            if (count[start + i] == 0) return false;
            count[start + i]--;
            if (count[start + i] == 0) {
                if (pq.top() != start + i) return false;
                pq.pop();
            }
        }
    }
    return true;
}
```

```java
boolean isNStraightHand2(int[] hand, int groupSize) {
    if (hand.length % groupSize != 0) return false;
    Map<Integer, Integer> count = new TreeMap<>();
    for (int c : hand) count.merge(c, 1, Integer::sum);
    PriorityQueue<Integer> pq = new PriorityQueue<>(count.keySet());
    while (!pq.isEmpty()) {
        int start = pq.peek();
        for (int i = 0; i < groupSize; i++) {
            if (count.getOrDefault(start + i, 0) == 0) return false;
            count.merge(start + i, -1, Integer::sum);
            if (count.get(start + i) == 0) {
                if (pq.peek() != start + i) return false;
                pq.poll();
            }
        }
    }
    return true;
}
```

```typescript
function isNStraightHand2(hand: number[], groupSize: number): boolean {
    if (hand.length % groupSize !== 0) return false;
    const count = new Map<number, number>();
    for (const c of hand) count.set(c, (count.get(c) ?? 0) + 1);
    const sortedKeys = [...count.keys()].sort((a, b) => a - b);
    for (const start of sortedKeys) {
        while ((count.get(start) ?? 0) > 0) {
            for (let i = 0; i < groupSize; i++) {
                if ((count.get(start + i) ?? 0) === 0) return false;
                count.set(start + i, count.get(start + i)! - 1);
            }
        }
    }
    return true;
}
```

```python
import heapq
from collections import Counter

def is_n_straight_hand_heap(hand: list[int], group_size: int) -> bool:
    if len(hand) % group_size != 0:
        return False
    count = Counter(hand)
    min_heap = list(count.keys())
    heapq.heapify(min_heap)
    while min_heap:
        start = min_heap[0]
        for i in range(group_size):
            if count[start + i] == 0:
                return False
            count[start + i] -= 1
            if count[start + i] == 0:
                if min_heap[0] != start + i:
                    return False
                heapq.heappop(min_heap)
    return True
```

```go
func isNStraightHandHeap(hand []int, groupSize int) bool {
    if len(hand)%groupSize != 0 { return false }
    count := map[int]int{}
    for _, c := range hand { count[c]++ }
    keys := make([]int, 0, len(count))
    for k := range count { keys = append(keys, k) }
    sort.Ints(keys)
    for len(keys) > 0 {
        start := keys[0]
        for i := 0; i < groupSize; i++ {
            if count[start+i] == 0 { return false }
            count[start+i]--
            if count[start+i] == 0 {
                if keys[0] != start+i { return false }
                keys = keys[1:]
            }
        }
    }
    return true
}
```

**Time:** O(n log n) — **Space:** O(n)

---

## Dry Run

`hand = [1,2,3,6,2,3,4,7,8]`, `groupSize = 3`

`count = {1:1, 2:2, 3:2, 4:1, 6:1, 7:1, 8:1}`

Processing card `1` (cnt=1):
- Need `1,2,3` each with count >= 1 ✓
- Subtract: `{1:0, 2:1, 3:1, 4:1, 6:1, 7:1, 8:1}`

Processing card `2` (cnt=1):
- Need `2,3,4` each >= 1 ✓
- Subtract: `{2:0, 3:0, 4:0, 6:1, 7:1, 8:1}`

Processing card `6` (cnt=1):
- Need `6,7,8` each >= 1 ✓
- Subtract: `{6:0, 7:0, 8:0}`

All counts reach 0 → `true` ✓

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Sorted keys + count map | O(n log n) | O(n) |
| Min-heap + count map | O(n log n) | O(n) |

---

## Key Interview Insights

- **Quick elimination:** If `n % groupSize != 0`, return `false` immediately — can't partition evenly.
- **Greedy correctness:** The smallest card can only go in a group starting at itself. This forces the choice, making greedy optimal.
- **Same as "Divide Array in Sets of K Consecutive Numbers" (LC 1296)** — literally the same problem with different variable names.
- **Sorted iteration over `TreeMap`/`Counter` keys** is cleaner than a heap here; use a heap when you need repeated extraction of the global minimum.
- **Consecutive gap check:** If during a group-forming step you find `count[card+i] == 0`, return false immediately — no repair is possible.
