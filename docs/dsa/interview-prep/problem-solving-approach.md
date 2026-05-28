---
title: Problem-Solving Approach
description: A systematic framework for cracking any coding interview question from scratch
---

# Problem-Solving Approach

The difference between candidates who consistently pass coding interviews and those who don't is rarely raw algorithmic knowledge — it's **process**. A candidate who methodically works through unknowns beats one who knows more but panics under pressure.

This guide gives you a repeatable, field-tested framework for every problem you encounter.

---

## The 6-Step Framework

```
1. UNDERSTAND  →  2. MATCH  →  3. PLAN  →  4. CODE  →  5. TEST  →  6. OPTIMIZE
```

Work through these in order, out loud. Interviewers evaluate your **thinking process**, not just your final answer.

---

## Step 1: Understand the Problem (3–5 minutes)

Before touching code, make sure you know exactly what's being asked.

### Read and Restate

Read the problem once, then restate it in your own words to the interviewer. This confirms your understanding and often surfaces hidden constraints.

> "So if I understand correctly, I'm given a list of integers and need to find two that sum to a target — and I should return their indices, not the values?"

### Ask Clarifying Questions

Never assume. Ask about:

| Question | Why It Matters |
|---|---|
| What are the input bounds? (n up to 10^5? 10^9?) | Determines if O(n^2) is acceptable |
| Can input be empty or null? | Determines if you need null/empty checks |
| Are there duplicates? | May change the approach entirely |
| Is the input sorted? | Enables binary search / two pointers |
| Can I modify the input in-place? | Space complexity implications |
| What should I return on no answer? (-1, empty, null?) | Output format |
| Are values always positive? integers? | May open/close certain approaches |

### Work Through the Example

Don't just accept the given example — trace through it yourself. Often the example hides edge cases.

Then immediately ask: **"What happens with these cases?"**
- Empty input
- Single element
- All identical elements
- Maximum values
- Negative numbers (if applicable)

---

## Step 2: Match the Pattern (1–2 minutes)

Once you understand the problem, categorize it. This is the most powerful skill you can develop.

### Pattern Recognition Table

| If you see... | Think... |
|---|---|
| Find pair/triplet with given sum | Two Pointers or Hash Map |
| Subarray/substring with constraint | Sliding Window |
| Sorted array + O(log n) | Binary Search |
| Tree traversal / path | DFS or BFS |
| Shortest path in graph | BFS (unweighted) or Dijkstra (weighted) |
| All subsets / combinations / permutations | Backtracking |
| Optimal substructure / overlapping subproblems | Dynamic Programming |
| Greedy choice at each step | Greedy |
| Range merging / scheduling | Intervals |
| Count of distinct elements | Hash Set / Sliding Window |
| Top-K elements | Heap |
| Cycle detection in list | Fast & Slow Pointers |
| Intervals [start, end] | Sort + Sweep |
| Count of set bits / XOR | Bit Manipulation |

### Ask Yourself

1. Have I seen a problem with a similar *shape*?
2. What are the constraints telling me? (n <= 20 → exponential ok; n <= 10^6 → need O(n) or O(n log n))
3. What data structures would make the expensive operation cheap?

---

## Step 3: Plan the Approach (3–5 minutes)

**Always start with brute force, out loud.**

This signals competence. It also gives you a baseline to optimize from, and sometimes the interviewer wants to see your brute-force reasoning before jumping to optimal.

### The Escalation Ladder

```
Brute Force → Recognize the bottleneck → Apply pattern → Verify constraints → Code
```

For each approach, state before coding:
- What is the algorithm?
- What is the time complexity?
- What is the space complexity?
- Are there tradeoffs?

### Example Escalation

Problem: Find two numbers in an array that sum to target.

- **Brute force:** Check every pair. O(n^2) time, O(1) space.
- **Bottleneck:** The inner loop — searching for the complement.
- **Better:** Sort + two pointers. O(n log n) time, O(1) space. But loses indices.
- **Optimal:** Hash map. O(n) time, O(n) space. Preserves indices.

Get interviewer buy-in before coding: *"I'm thinking of using a hash map for O(n) time — does that approach make sense to you?"*

---

## Step 4: Code (10–15 minutes)

### Before You Write Line 1

- Decide on function signature
- Name variables clearly (not `a`, `b`, `temp` — use `left`, `right`, `freq`)
- Say out loud: "I'll start by handling the edge cases"

### Coding Best Practices

**Write top-down.** Start with the high-level structure, fill in details.

```
function solve(input):
    // 1. edge case
    // 2. setup data structure
    // 3. main loop
    // 4. return answer
```

**Don't optimize prematurely.** Get a working solution first.

**Talk through your code as you write it.** Not line-by-line narration, but reasoning: *"I'm using a hash map here because I need O(1) lookup..."*

**Common patterns to handle upfront:**

| Situation | How to Handle |
|---|---|
| Empty input | `if not nums: return []` at the top |
| Single element | Often falls through naturally — verify |
| Off-by-one in loops | Use `<` vs `<=` consciously, verify on paper |
| Integer overflow | Use `long` in Java/C++, Python handles natively |
| Two-pointer crossing | `while left < right` not `<=` |

### Variable Naming That Communicates Intent

```
i, j        → generic indices (ok for short loops)
left, right → two pointers
lo, hi      → binary search bounds
slow, fast  → Floyd's cycle detection
prev, curr  → linked list traversal
freq        → frequency map
seen        → visited set
```

---

## Step 5: Test Your Solution (3–5 minutes)

Never say "I'm done." Always trace through examples.

### Testing Order

1. **Trace the provided example** — step through your code manually, not in your head.
2. **Test your edge cases** — the ones you identified in Step 1.
3. **Test a medium-sized case** — make sure the loop logic is right.

### Edge Cases to Always Consider

- Empty / null input
- Single element
- All same elements
- Already sorted input
- Reverse-sorted input
- Maximum constraints (does it overflow? TLE?)
- Negative numbers
- Zero
- The answer is at index 0 or the last index

### Dry Run Template

State the variables, then step through:

```
Input: [2, 7, 11, 15], target = 9

seen = {}
i=0: num=2, complement=7, not in seen → seen={2:0}
i=1: num=7, complement=2, 2 in seen → return [seen[2], 1] = [0, 1]  ✓
```

---

## Step 6: Optimize (2–3 minutes)

After a working solution, ask: *"Can we do better?"*

Frame it proactively: *"My current solution is O(n) time and O(n) space. I believe this is optimal for time, but we could potentially reduce space by..."*

### Optimization Levers

| If bottleneck is... | Try... |
|---|---|
| Time in inner loop | Hash map, binary search, or sliding window |
| Repeated subproblem computation | Memoization / DP |
| Sorting | Ask if input can be assumed sorted |
| Space from hash map | Two pointers on sorted array |
| Space from recursion stack | Convert to iterative with explicit stack |

---

## Time Management

Total interview time is usually 45–60 minutes for one problem.

| Phase | Time Budget |
|---|---|
| Understanding + clarifying | 3–5 min |
| Pattern matching + approach discussion | 3–5 min |
| Coding | 15–20 min |
| Testing + dry run | 5–7 min |
| Optimization discussion | 3–5 min |
| Questions for interviewer | 5 min |

If you're at 20 minutes and haven't started coding, explicitly say: *"I'd like to start coding the O(n^2) solution now and optimize after."* A working brute force beats an incomplete optimal solution.

---

## When You're Stuck

**Don't freeze. Talk.** Interviewers help candidates who communicate.

Phrases that buy you time and signal maturity:

- *"Let me think through a simpler version of this problem first..."*
- *"I know this feels like it should use a hash map, let me work out why..."*
- *"Can I use a specific example to build intuition?"*
- *"I'm not immediately seeing the optimal, let me walk through the brute force and see what the bottleneck is."*

If you truly need a hint: *"I feel like there's a data structure that would make the lookup O(1) here — am I on the right track?"* This invites the interviewer to guide without asking for the answer.

---

## Communication Checklist

Use this before every interview round:

- [ ] Restate the problem before coding
- [ ] Ask about input constraints and edge cases
- [ ] State brute force approach first
- [ ] Get buy-in before coding the chosen approach
- [ ] Narrate your logic while coding (not every line, just the reasoning)
- [ ] Say "let me test this" before claiming you're done
- [ ] Trace through at least one example manually
- [ ] Mention complexity at the end
- [ ] Ask "Is there anything you'd like me to optimize or change?"

---

## The Meta-Skill: Pattern → Template → Adapt

The fastest path to solving unfamiliar problems:

1. **Recognize the pattern** (this problem looks like Sliding Window)
2. **Recall the template** (maintain a window with two pointers, expand right, shrink left when violated)
3. **Adapt to specifics** (what does "violated" mean for this problem?)

This is why studying patterns — not just individual problems — compounds. Every new problem you solve either confirms a pattern you know or teaches you a new one.

---

## Complexity Analysis — Quick Reference

State complexity **proactively**. Don't wait to be asked.

Format: *"This is O(n log n) time due to the sort, and O(n) space for the output array."*

| n | Max Acceptable Complexity |
|---|---|
| n <= 20 | O(2^n) or O(n!) |
| n <= 1,000 | O(n^2) |
| n <= 100,000 | O(n log n) |
| n <= 10^6 | O(n) |
| n <= 10^9 | O(log n) |
