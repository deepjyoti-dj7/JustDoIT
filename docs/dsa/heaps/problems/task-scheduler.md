---
title: Task Scheduler
difficulty: Medium
tags: [Array, Heap, Greedy, Queue, Counting]
link: https://leetcode.com/problems/task-scheduler/
---

# Task Scheduler

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [621. Task Scheduler](https://leetcode.com/problems/task-scheduler/) |
| **Tags** | Array, Heap, Greedy, Queue, Counting |

## Problem Statement

Given a character array `tasks` representing CPU tasks (each task takes 1 unit of time) and an integer `n` representing the cooldown between same-task types, return the minimum number of CPU intervals (including idle time) to finish all tasks.

Example: `tasks = [A,A,A,B,B,B]`, n = 2

One valid schedule: `A B _ A B _ A B`. Total intervals = 8.

## Intuition

At each time unit, the greedy choice is: **execute the most frequent remaining task that is off cooldown**.

Why most frequent? Because the most frequent tasks are the hardest to schedule — they constrain the minimum idle time needed. The bottleneck task determines the answer.

**Two approaches:**

1. **Greedy + Heap + Queue:** Simulate the CPU. At each step, pick the most frequent available task. Track cooldowns. O(n log n) time — works for all cases.

2. **Math formula:** The minimum time is determined by the most frequent task. If the max frequency is `f` and there are `maxCount` tasks with that frequency:
   ```
   result = max(totalTasks, (f - 1) * (n + 1) + maxCount)
   ```
   O(n) time — clever but requires understanding.

### Math Formula Explained

Imagine filling a grid:

```
n=2, tasks=[A,A,A,B,B,C]

Frame layout (each row = n+1 slots):
  A  B  C
  A  B  _
  A

(f-1) = 2 full rows of (n+1) = 3 slots each = 6
Last partial row: maxCount = 1 (only A is at max freq)
Total = 6 + 1 = 7

But total tasks = 6. max(7, 6) = 7 ✓
```

When tasks fill all slots including idle, total tasks count wins.

## Approach 1: Greedy Simulation (Heap + Queue) — O(m log m)

Use a max-heap (by frequency) for available tasks. Use a queue to hold tasks that are on cooldown: `(frequency_remaining, available_at_time)`.

At each time step:
1. Release tasks from the queue whose cooldown has expired (push back to heap)
2. Execute the most frequent available task (pop from heap, push to queue if count > 0)
3. If no task is available, the CPU is idle

```cpp
class Solution {
public:
    int leastInterval(vector<char>& tasks, int n) {
        unordered_map<char,int> freq;
        for (char t : tasks) freq[t]++;

        priority_queue<int> maxHeap; // frequencies
        for (auto& [_, f] : freq) maxHeap.push(f);

        queue<pair<int,int>> cooldown; // {remaining_count, available_time}
        int time = 0;

        while (!maxHeap.empty() || !cooldown.empty()) {
            time++;

            // Release tasks whose cooldown expired
            if (!cooldown.empty() && cooldown.front().second <= time) {
                maxHeap.push(cooldown.front().first);
                cooldown.pop();
            }

            if (!maxHeap.empty()) {
                int remaining = maxHeap.top() - 1;
                maxHeap.pop();
                if (remaining > 0) cooldown.push({remaining, time + n + 1});
            }
            // else: idle cycle
        }

        return time;
    }
};
```

```java
class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char t : tasks) freq[t - 'A']++;

        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int f : freq) if (f > 0) maxHeap.offer(f);

        Queue<int[]> cooldown = new LinkedList<>(); // [remaining, available_time]
        int time = 0;

        while (!maxHeap.isEmpty() || !cooldown.isEmpty()) {
            time++;

            if (!cooldown.isEmpty() && cooldown.peek()[1] <= time) {
                maxHeap.offer(cooldown.poll()[0]);
            }

            if (!maxHeap.isEmpty()) {
                int remaining = maxHeap.poll() - 1;
                if (remaining > 0) cooldown.offer(new int[]{remaining, time + n + 1});
            }
        }

        return time;
    }
}
```

```typescript
function leastInterval(tasks: string[], n: number): number {
    const freq = new Map<string, number>();
    for (const t of tasks) freq.set(t, (freq.get(t) ?? 0) + 1);

    const maxHeap = new Heap<number>((a, b) => b - a); // max-heap
    for (const f of freq.values()) maxHeap.push(f);

    const cooldown: Array<[number, number]> = []; // [remaining, available_time]
    let time = 0;

    while (!maxHeap.isEmpty() || cooldown.length > 0) {
        time++;

        // Release expired cooldowns
        while (cooldown.length > 0 && cooldown[0][1] <= time) {
            maxHeap.push(cooldown.shift()![0]);
        }

        if (!maxHeap.isEmpty()) {
            const remaining = maxHeap.pop()! - 1;
            if (remaining > 0) cooldown.push([remaining, time + n + 1]);
        }
    }

    return time;
}
```

```python
import heapq
from collections import Counter, deque

class Solution:
    def leastInterval(self, tasks: list[str], n: int) -> int:
        freq = Counter(tasks)
        max_heap = [-f for f in freq.values()]
        heapq.heapify(max_heap)

        cooldown = deque()  # (remaining, available_time)
        time = 0

        while max_heap or cooldown:
            time += 1

            # Release expired cooldowns
            if cooldown and cooldown[0][1] <= time:
                remaining, _ = cooldown.popleft()
                heapq.heappush(max_heap, -remaining)

            if max_heap:
                remaining = -heapq.heappop(max_heap) - 1
                if remaining > 0:
                    cooldown.append((remaining, time + n + 1))

        return time
```

```go
import (
    "container/heap"
    "container/list"
)

type MaxFreqHeap []int
func (h MaxFreqHeap) Len() int            { return len(h) }
func (h MaxFreqHeap) Less(i, j int) bool  { return h[i] > h[j] }
func (h MaxFreqHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MaxFreqHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *MaxFreqHeap) Pop() interface{}   { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

func leastInterval(tasks []byte, n int) int {
    freq := map[byte]int{}
    for _, t := range tasks { freq[t]++ }

    h := &MaxFreqHeap{}
    for _, f := range freq { heap.Push(h, f) }

    type coolItem struct{ remaining, availAt int }
    q := list.New()
    time := 0

    for h.Len() > 0 || q.Len() > 0 {
        time++
        if q.Len() > 0 && q.Front().Value.(coolItem).availAt <= time {
            item := q.Front().Value.(coolItem)
            q.Remove(q.Front())
            heap.Push(h, item.remaining)
        }
        if h.Len() > 0 {
            remaining := heap.Pop(h).(int) - 1
            if remaining > 0 { q.PushBack(coolItem{remaining, time + n + 1}) }
        }
    }
    return time
}
```

**Time:** O(m log m) where m = unique task types (at most 26) — effectively O(n) for total tasks
**Space:** O(m)

## Approach 2: Math Formula — O(n)

```cpp
int leastInterval(vector<char>& tasks, int n) {
    vector<int> freq(26, 0);
    for (char t : tasks) freq[t - 'A']++;

    int maxFreq = *max_element(freq.begin(), freq.end());
    int maxCount = count(freq.begin(), freq.end(), maxFreq);

    return max((int)tasks.size(), (maxFreq - 1) * (n + 1) + maxCount);
}
```

```java
class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char t : tasks) freq[t - 'A']++;

        int maxFreq = 0;
        for (int f : freq) maxFreq = Math.max(maxFreq, f);

        int maxCount = 0;
        for (int f : freq) if (f == maxFreq) maxCount++;

        return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
    }
}
```

```typescript
function leastInterval(tasks: string[], n: number): number {
    const freq = new Array(26).fill(0);
    for (const t of tasks) freq[t.charCodeAt(0) - 65]++;

    const maxFreq = Math.max(...freq);
    const maxCount = freq.filter(f => f === maxFreq).length;

    return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);
}
```

```python
from collections import Counter

class Solution:
    def leastInterval(self, tasks: list[str], n: int) -> int:
        freq = Counter(tasks)
        max_freq = max(freq.values())
        max_count = sum(1 for f in freq.values() if f == max_freq)

        return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)
```

```go
func leastInterval(tasks []byte, n int) int {
    freq := [26]int{}
    for _, t := range tasks { freq[t-'A']++ }

    maxFreq, maxCount := 0, 0
    for _, f := range freq {
        if f > maxFreq { maxFreq, maxCount = f, 1 } else if f == maxFreq { maxCount++ }
    }

    formula := (maxFreq-1)*(n+1) + maxCount
    if len(tasks) > formula { return len(tasks) }
    return formula
}
```

**Time:** O(n) — **Space:** O(1) (26-element array)

## Dry Run (Formula)

`tasks = [A,A,A,B,B,B]`, n = 2

Frequencies: `{A: 3, B: 3}`, maxFreq = 3, maxCount = 2

Formula: `(3-1) * (2+1) + 2 = 2*3 + 2 = 8`
Total tasks: 6

`max(6, 8) = 8` ✓

Visualization:
```
Slot: [A, B, _], [A, B, _], [A, B]
Time:  1  2  3    4  5  6    7  8
```

## Dry Run (Greedy)

`tasks = [A,A,A,B,B,C]`, n = 2

| Time | Heap (freqs) | Action | Cooldown Queue |
|---|---|---|---|
| 1 | [3,2,1] | Execute A (3→2) | [(2, t=4)] |
| 2 | [2,1] | Execute B (2→1) | [(2,4),(1,5)] |
| 3 | [1] | Execute C (1→0) | [(2,4),(1,5)] |
| 4 | [2] (released A) | Execute A (2→1) | [(1,5),(1,7)] |
| 5 | [1,1] (released B) | Execute B (1→0) | [(1,7)] |
| 6 | [] | IDLE | [(1,7)] |
| 7 | [1] (released A) | Execute A (1→0) | [] |

Total time: **7** ✓

## Key Interview Insights

- **Present both approaches.** The greedy simulation shows you can implement it. The formula shows you understand the math. Together they demonstrate depth.
- **Formula insight:** The bottleneck is always the most frequent task. The formula computes the minimum idle time needed around it.
- **`max(totalTasks, formula)`:** When tasks are dense enough to fill all idle slots, the formula underestimates — we take the maximum.
- **Cooldown queue detail:** The cooldown deque acts like a "waiting room." A task enters with `available_time = current_time + n + 1` (must wait n full cycles).
- **Edge case n=0:** No cooldown needed. Answer is `tasks.length`. Formula: `(maxFreq-1)*1 + maxCount ≤ tasks.length`, so `max` returns `tasks.length`. ✓
- **At most 26 unique tasks** — the heap never has more than 26 elements. In practice it's very fast.
- **Real-world analog:** This is exactly how operating systems handle process scheduling with priority queues and cooldowns (rate limiting, thermal throttling).
