---
title: Partition Labels
difficulty: Medium
tags: [Greedy, Hash Map, Two Pointers, String]
link: https://leetcode.com/problems/partition-labels/
---

# Partition Labels

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [763. Partition Labels](https://leetcode.com/problems/partition-labels/) |
| **Tags** | Greedy, Hash Map, Two Pointers, String |

## Problem Statement

You are given a string `s`. Partition the string into **as many parts as possible** so that each letter appears in at most one part. Return a list of integers representing the size of each part.

**Example:**
```
Input:  s = "ababcbacadefegdehijhklij"
Output: [9, 7, 8]
Explanation:
  "ababcbaca" — a, b, c appear only in this partition
  "defegde"   — d, e, f, g appear only in this partition
  "hijhklij"  — h, i, j, k, l appear only in this partition
```

---

## Intuition

For each character, we know its **last occurrence** in the string. A partition ending at index `i` is valid only if every character seen so far has its last occurrence `<= i`.

So the algorithm is:
1. Precompute `last[c]` = last index of character `c`
2. Walk the string. Maintain `partitionEnd = max(last[s[i]])` for all characters seen so far.
3. When `i == partitionEnd`, we've hit the earliest valid cut. Record the partition, reset.

This is a classic "running maximum" greedy — extend the boundary as long as characters force you to, then cut when you've satisfied all of them.

---

## Approach 1: Brute Force

For each possible split point, check if the left and right parts share any characters.

```cpp
bool noSharedChars(const string& s, int l, int mid, int r) {
    set<char> left(s.begin() + l, s.begin() + mid + 1);
    for (int i = mid + 1; i <= r; i++)
        if (left.count(s[i])) return false;
    return true;
}

vector<int> partitionLabelsBrute(string s) {
    vector<int> result;
    int start = 0;
    while (start < (int)s.size()) {
        for (int end = start; end < (int)s.size(); end++) {
            if (noSharedChars(s, start, end, (int)s.size() - 1)) {
                result.push_back(end - start + 1);
                start = end + 1;
                break;
            }
        }
    }
    return result;
}
```

```java
List<Integer> partitionLabelsBrute(String s) {
    List<Integer> result = new ArrayList<>();
    int start = 0;
    while (start < s.length()) {
        for (int end = start; end < s.length(); end++) {
            Set<Character> left = new HashSet<>();
            for (int i = start; i <= end; i++) left.add(s.charAt(i));
            boolean ok = true;
            for (int i = end + 1; i < s.length(); i++) {
                if (left.contains(s.charAt(i))) { ok = false; break; }
            }
            if (ok) { result.add(end - start + 1); start = end + 1; break; }
        }
    }
    return result;
}
```

```typescript
function partitionLabelsBrute(s: string): number[] {
    const result: number[] = [];
    let start = 0;
    while (start < s.length) {
        for (let end = start; end < s.length; end++) {
            const left = new Set(s.slice(start, end + 1));
            let ok = true;
            for (let i = end + 1; i < s.length; i++) {
                if (left.has(s[i])) { ok = false; break; }
            }
            if (ok) { result.push(end - start + 1); start = end + 1; break; }
        }
    }
    return result;
}
```

```python
def partition_labels_brute(s: str) -> list[int]:
    result = []
    start = 0
    while start < len(s):
        for end in range(start, len(s)):
            left = set(s[start:end+1])
            if not any(c in left for c in s[end+1:]):
                result.append(end - start + 1)
                start = end + 1
                break
    return result
```

```go
func partitionLabelsBrute(s string) []int {
    result := []int{}
    start := 0
    for start < len(s) {
        for end := start; end < len(s); end++ {
            left := map[byte]bool{}
            for i := start; i <= end; i++ { left[s[i]] = true }
            ok := true
            for i := end + 1; i < len(s); i++ {
                if left[s[i]] { ok = false; break }
            }
            if ok {
                result = append(result, end-start+1)
                start = end + 1
                break
            }
        }
    }
    return result
}
```

**Time:** O(n²) — **Space:** O(n)

---

## Approach 2: Greedy with Last Occurrence (Optimal)

Precompute the last occurrence of every character in one pass. Then walk the string, extending `partitionEnd` to the furthest last-occurrence seen. When `i == partitionEnd`, emit a partition.

```cpp
vector<int> partitionLabels(string s) {
    int last[26] = {};
    for (int i = 0; i < (int)s.size(); i++)
        last[s[i] - 'a'] = i;

    vector<int> result;
    int start = 0, partitionEnd = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        partitionEnd = max(partitionEnd, last[s[i] - 'a']);
        if (i == partitionEnd) {
            result.push_back(i - start + 1);
            start = i + 1;
        }
    }
    return result;
}
```

```java
List<Integer> partitionLabels(String s) {
    int[] last = new int[26];
    for (int i = 0; i < s.length(); i++)
        last[s.charAt(i) - 'a'] = i;

    List<Integer> result = new ArrayList<>();
    int start = 0, partitionEnd = 0;
    for (int i = 0; i < s.length(); i++) {
        partitionEnd = Math.max(partitionEnd, last[s.charAt(i) - 'a']);
        if (i == partitionEnd) {
            result.add(i - start + 1);
            start = i + 1;
        }
    }
    return result;
}
```

```typescript
function partitionLabels(s: string): number[] {
    const last = new Array(26).fill(0);
    for (let i = 0; i < s.length; i++)
        last[s.charCodeAt(i) - 97] = i;

    const result: number[] = [];
    let start = 0, partitionEnd = 0;
    for (let i = 0; i < s.length; i++) {
        partitionEnd = Math.max(partitionEnd, last[s.charCodeAt(i) - 97]);
        if (i === partitionEnd) {
            result.push(i - start + 1);
            start = i + 1;
        }
    }
    return result;
}
```

```python
def partition_labels(s: str) -> list[int]:
    last = {c: i for i, c in enumerate(s)}   # last occurrence of each char

    result = []
    start = 0
    partition_end = 0
    for i, c in enumerate(s):
        partition_end = max(partition_end, last[c])
        if i == partition_end:
            result.append(i - start + 1)
            start = i + 1
    return result
```

```go
func partitionLabels(s string) []int {
    last := [26]int{}
    for i := 0; i < len(s); i++ {
        last[s[i]-'a'] = i
    }

    result := []int{}
    start, partitionEnd := 0, 0
    for i := 0; i < len(s); i++ {
        if l := last[s[i]-'a']; l > partitionEnd {
            partitionEnd = l
        }
        if i == partitionEnd {
            result = append(result, i-start+1)
            start = i + 1
        }
    }
    return result
}
```

**Time:** O(n) — **Space:** O(1) — only 26-char alphabet

---

## Dry Run

`s = "ababcbacadefegdehijhklij"`

Last occurrences:
`a→8, b→5, c→7, d→14, e→15, f→11, g→13, h→19, i→22, j→23, k→20, l→21`

Walking:

| i | s[i] | partitionEnd | Cut? |
|---|---|---|---|
| 0 | a | max(0, 8)=8 | |
| 1 | b | max(8, 5)=8 | |
| 2 | a | max(8, 8)=8 | |
| 3 | b | max(8, 5)=8 | |
| 4 | c | max(8, 7)=8 | |
| 5 | b | max(8, 5)=8 | |
| 6 | a | max(8, 8)=8 | |
| 7 | c | max(8, 7)=8 | |
| 8 | a | max(8, 8)=8 | **i==8 → partition [0..8], size=9** |
| 9 | d | max(9,14)=14 | |
| ... | | | |
| 15 | e | max(14,15)=15 | **i==15 → partition [9..15], size=7** |
| ... | | | |
| 23 | j | max(?,23)=23 | **i==23 → partition [16..23], size=8** |

Result: `[9, 7, 8]` ✓

---

## Complexity

| Approach | Time | Space |
|---|---|---|
| Brute Force | O(n²) | O(n) |
| Greedy (last occurrence) | O(n) | O(1) |

---

## Key Interview Insights

- Building `last` with a simple iteration (later indices overwrite earlier ones) is elegant — no special logic needed.
- **The cut condition `i == partitionEnd`** is the key: it means "I've seen all instances of every character in this partition — safe to cut."
- **Greedy correctness:** Once `partitionEnd` is set to some index `k`, we *must* include index `k` in this partition (that character's last occurrence is there). We can never cut earlier.
- **Connection to intervals:** Each character defines an interval `[first_occurrence, last_occurrence]`. This problem is equivalent to: merge all overlapping character-intervals, then return their lengths.
- **Only lowercase English letters:** The `O(1)` space claim assumes a 26-character alphabet. For arbitrary characters, use a HashMap (still conceptually O(1) if alphabet size is bounded).
