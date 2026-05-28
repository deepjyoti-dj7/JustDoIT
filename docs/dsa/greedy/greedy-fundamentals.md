---
title: Greedy Algorithms
description: Mastering the greedy paradigm — when local optimal choices lead to global optimal solutions
---

# Greedy Algorithms

A **greedy algorithm** makes the locally optimal choice at each step, committing to it without ever going back. Unlike dynamic programming which considers all possibilities, greedy bets everything on the best-looking move right now.

**The core bet:** If picking the locally best option at every step produces a globally optimal solution, greedy works. If not, you need DP.

---

## When Does Greedy Work?

Greedy is only provably correct when a problem has **both** of these properties:

### 1. Greedy Choice Property
A globally optimal solution can be built by making locally optimal (greedy) choices. The choice at step *i* never needs to be undone based on what happens later.

### 2. Optimal Substructure
An optimal solution to the problem contains optimal solutions to its subproblems — same as DP, but greedy adds the commitment guarantee on top.

> **Key distinction from DP:** DP solves all subproblems first, then picks the best. Greedy makes a choice first, then solves the remaining subproblem. Greedy is top-down and irreversible.

---

## How to Spot a Greedy Problem

Look for these signals in the problem statement:

| Signal | Classic Example |
|---|---|
| "Maximum number of..." | Max non-overlapping intervals |
| "Minimum cost/steps to..." | Jump Game II |
| "Can you reach/complete..." | Gas Station, Jump Game |
| Scheduling or ordering tasks | Activity selection, task scheduler |
| Sorting by some key unlocks optimal order | Interval problems |
| Local choices don't poison future options | Fractional knapsack |

**The test:** *"If I make the greedy choice here, will I ever regret it later?"* If you can argue no — greedy is safe.

---

## Greedy vs Dynamic Programming

| Aspect | Greedy | Dynamic Programming |
|---|---|---|
| Decision style | Commit once, no backtrack | Explore all, pick best |
| State tracking | Minimal — often O(1) | Usually O(n) to O(n²) table |
| Speed | O(n) or O(n log n) typically | O(n²) or O(n·k) typically |
| Correctness | Requires proof | Correct if recurrence is right |
| When applicable | Problems with greedy choice property | General optimization |

**Exchange argument** — the canonical proof technique for greedy:  
Show that swapping any non-greedy choice for the greedy choice never makes the solution worse. Therefore, the greedy solution is always as good as any other.

---

## Core Greedy Patterns

### Pattern 1: Sort + Scan
Sort by a carefully chosen key, then scan left-to-right making decisions.

- Sort by **end time** → maximize non-overlapping intervals
- Sort by **start time** → merge overlapping intervals  
- Sort by **ratio value/weight** → fractional knapsack
- Sort by **deadline** → minimize lateness in scheduling

### Pattern 2: Running Aggregate + Reset
Maintain a running sum or count; reset greedily when it goes negative or invalid.

- **Gas Station:** reset start index when tank drops below zero
- **Jump Game:** track farthest reachable index
- **Subarray Sum:** Kadane's algorithm resets at negative prefix

### Pattern 3: Min-Heap / Priority Queue
Use a heap to always process the "best" remaining element next.

- **Huffman coding:** always merge two smallest-frequency nodes
- **Task Scheduler:** always run the most-frequent pending task
- **Meeting Rooms II:** track earliest-ending active meeting

### Pattern 4: Two-Pass (Left + Right)
Make one pass left-to-right, one right-to-left, then combine.

- **Candy:** ensure each child beats left neighbor, then right neighbor
- **Trapping Rain Water:** track max from left, max from right

### Pattern 5: Range Tracking
Track a *range* of possible states (min, max) and prune impossible branches.

- **Valid Parenthesis String:** track `[minOpen, maxOpen]`

---

## Complexity Reference

| Pattern | Time | Space |
|---|---|---|
| Sort + scan | O(n log n) | O(1) |
| Running aggregate | O(n) | O(1) |
| Min-heap greedy | O(n log n) | O(n) |
| Two-pass | O(n) | O(n) |
| Range tracking | O(n) | O(1) |

---

## Common Pitfalls

1. **Assuming greedy is always safe** — Coin change with arbitrary denominations breaks greedy. Always verify.
2. **Wrong sort key** — Sorting interval problems by start (not end) gives wrong answers for activity selection.
3. **Off-by-one in index tracking** — Jump game variants are especially prone to fencepost errors.
4. **Ignoring ties** — When two candidates tie, the tiebreak rule can change correctness.
5. **Missing existence check** — Gas Station requires `sum(gas) >= sum(cost)` before the greedy answer is valid.
6. **Confusing greedy with brute-force sorting** — Not every sort-then-pick is greedy; you need the commitment argument.

---

## Templates

### Template: Interval Activity Selection

```
sort intervals by end time
count = 1, lastEnd = intervals[0].end

for each interval (after first):
    if interval.start >= lastEnd:
        count++
        lastEnd = interval.end

return count
```

### Template: Running-Reset Greedy

```
total = 0, candidate = 0, running = 0

for i in 0..n-1:
    running += value[i]
    total   += value[i]
    if running < 0:
        running = 0
        candidate = i + 1       // next position is new candidate start

if total >= 0: return candidate
else: return -1                 // no solution
```

### Template: Two-Pass Left/Right

```
left[0] = base_value
for i in 1..n-1:
    left[i] = compute_from_left(i, left[i-1])

right[n-1] = base_value
for i in n-2..0:
    right[i] = compute_from_right(i, right[i+1])

answer[i] = combine(left[i], right[i])
```

### Template: Greedy Range (min/max open count)

```
lo = 0, hi = 0    // [min possible open parens, max possible open parens]

for each char c:
    if c == '(':   lo++; hi++
    if c == ')':   lo--; hi--
    if c == '*':   lo--; hi++   // '*' can be '(', ')', or ''
    if hi < 0: return false     // too many ')'
    lo = max(lo, 0)             // lo can't go negative

return lo == 0
```

---

## Interview Approach

1. **Recognize the pattern** — Does sorting help? Is there a natural "best first" ordering?
2. **State the greedy choice explicitly** — "At each step I choose X because..."
3. **Argue correctness briefly** — "Choosing anything else leaves us at least as constrained because..."
4. **Code it + trace through an example** — Walk through `[2,3,1,1,4]` mentally before writing
5. **Test edge cases** — Empty, single element, already optimal, all identical, adversarial input

---

## Quick Reference: Greedy Problem Catalog

| Problem | Key Insight | Pattern |
|---|---|---|
| Jump Game (LC 55) | Track max reachable index | Running aggregate |
| Jump Game II (LC 45) | BFS levels with greedy extension | Running aggregate |
| Gas Station (LC 134) | Reset start when tank negative | Running-reset |
| Candy (LC 135) | Two-pass left then right | Two-pass |
| Non-Overlapping Intervals (LC 435) | Sort by end, count non-overlapping | Sort + scan |
| Partition Labels (LC 763) | Last occurrence defines partition end | Running aggregate |
| Valid Parenthesis String (LC 678) | Track [minOpen, maxOpen] range | Range tracking |
| Hand of Straights (LC 846) | Process smallest card, drain groups | Sort + heap |
| Merge Intervals (LC 56) | Sort by start, extend or append | Sort + scan |
| Meeting Rooms II (LC 253) | Min-heap of meeting end times | Heap |
| Task Scheduler (LC 621) | Most-frequent first, count idle slots | Heap / math |
