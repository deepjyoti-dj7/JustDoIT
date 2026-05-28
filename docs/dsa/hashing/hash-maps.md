---
title: Hash Maps
description: Hash map internals, operations, patterns, and interview techniques
---

# Hash Maps

A hash map (also called a dictionary, hash table, or unordered map) is the single most powerful data structure for optimizing interview solutions. It converts O(n) lookup problems into O(1) lookup problems.

Knowing *when* to reach for a hash map and *how* to use it effectively separates average solutions from optimal ones.

## What is a Hash Map?

A hash map stores **key → value** pairs. Given a key, you can retrieve its value in O(1) average time. Internally:

1. A **hash function** converts the key to an integer index
2. The index points to a **bucket** in an underlying array
3. The value (or a node containing key+value) lives at that bucket

```
key "apple"  → hash("apple") % capacity → index 3 → bucket[3] → value 5
key "banana" → hash("banana") % capacity → index 7 → bucket[7] → value 2
```

## Core Operations

| Operation | Average | Worst Case | Notes |
|---|---|---|---|
| `put(key, value)` | O(1) | O(n) | Worst case: all keys hash to same bucket |
| `get(key)` | O(1) | O(n) | |
| `remove(key)` | O(1) | O(n) | |
| `containsKey(key)` | O(1) | O(n) | |
| `size()` | O(1) | O(1) | |
| `iterate` | O(n) | O(n) | |

> **Interview note:** When asked about time complexity, always say "O(1) **average**." If your interviewer asks about the worst case, mention hash collisions and O(n) worst case, then explain why it's practically O(1) with a good hash function.

## Implementation

```cpp
#include <unordered_map>
unordered_map<string, int> freq;
freq["apple"] = 5;
freq["banana"]++;          // increment (initializes to 0 if not present)
freq.count("apple");       // 1 if exists, 0 otherwise
freq["cherry"];            // creates entry with value 0!
freq.erase("banana");

// Iterate
for (auto& [key, val] : freq) {
    // use key, val
}
```

```java
import java.util.HashMap;
Map<String, Integer> freq = new HashMap<>();
freq.put("apple", 5);
freq.getOrDefault("banana", 0);        // safe get with default
freq.merge("apple", 1, Integer::sum);  // increment elegantly
freq.containsKey("apple");
freq.remove("banana");

// Iterate
for (Map.Entry<String, Integer> entry : freq.entrySet()) {
    String key = entry.getKey();
    int val = entry.getValue();
}
// Java 8+
freq.forEach((key, val) -> System.out.println(key + " → " + val));
```

```typescript
const freq = new Map<string, number>();
freq.set("apple", 5);
freq.get("apple");                         // 5
freq.has("banana");                        // false
freq.set("apple", (freq.get("apple") ?? 0) + 1);  // increment safely
freq.delete("banana");

// Iterate
for (const [key, val] of freq) {
    // use key, val
}
```

```python
from collections import defaultdict, Counter

freq: dict[str, int] = {}
freq["apple"] = 5
freq.get("banana", 0)          # safe get
freq["apple"] = freq.get("apple", 0) + 1

# Cleaner with defaultdict
freq = defaultdict(int)
freq["apple"] += 1

# Even cleaner for counting
freq = Counter(["apple", "banana", "apple"])
freq.most_common(2)             # top 2 by frequency

# Iterate
for key, val in freq.items():
    pass
```

```go
freq := map[string]int{}
freq["apple"] = 5
val, ok := freq["apple"]   // ok is false if key doesn't exist
freq["apple"]++            // zero-value initializes to 0 automatically
delete(freq, "banana")

// Iterate
for key, val := range freq {
    _ = key; _ = val
}
```

> **C++ trap:** `freq["key"]` creates a zero-value entry if the key doesn't exist. Use `freq.count("key")` or `freq.find("key")` to check existence without insertion.

> **Python power tools:** `defaultdict(int)` avoids KeyError on first access. `Counter` handles frequency counting in one line.

## When to Use a Hash Map

Reach for a hash map when you need:

- **Frequency counting** — count occurrences of elements
- **Two-pass lookup** — store something in pass 1, look it up in pass 2
- **One-pass lookup** — check if a complement/pair exists before inserting
- **Grouping** — map a key to a list of associated values
- **Caching** — memoization, LRU cache

**Identifying signals in a problem:**
- "Find if X exists" → hash map for O(1) lookup
- "Count how many times X appears" → hash map as frequency counter
- "Two numbers that sum to target" → hash map for complement lookup
- "Group elements with same property" → hash map with property as key
- "Has this element been seen?" → hash set (or map with dummy value)

## Core Patterns

### Pattern 1: Frequency Counter

Count occurrences of each element, then query the counts.

```cpp
unordered_map<int, int> freq;
for (int n : nums) freq[n]++;
// Query: freq[target] → how many times target appears
```

```java
Map<Integer, Integer> freq = new HashMap<>();
for (int n : nums) freq.merge(n, 1, Integer::sum);
```

```typescript
const freq = new Map<number, number>();
for (const n of nums) freq.set(n, (freq.get(n) ?? 0) + 1);
```

```python
from collections import Counter
freq = Counter(nums)
```

```go
freq := map[int]int{}
for _, n := range nums { freq[n]++ }
```

### Pattern 2: Complement Lookup (One Pass)

For each element, check if its complement already exists in the map. If not, store the current element.

```cpp
unordered_map<int, int> seen; // value → index
for (int i = 0; i < nums.size(); i++) {
    int complement = target - nums[i];
    if (seen.count(complement)) return {seen[complement], i};
    seen[nums[i]] = i;
}
```

```java
Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (seen.containsKey(complement)) return new int[]{seen.get(complement), i};
    seen.put(nums[i], i);
}
```

```typescript
const seen = new Map<number, number>();
for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement)!, i];
    seen.set(nums[i], i);
}
```

```python
seen: dict[int, int] = {}
for i, n in enumerate(nums):
    complement = target - n
    if complement in seen:
        return [seen[complement], i]
    seen[n] = i
```

```go
seen := map[int]int{}
for i, n := range nums {
    complement := target - n
    if j, ok := seen[complement]; ok {
        return []int{j, i}
    }
    seen[n] = i
}
```

### Pattern 3: Grouping by Key

Map each element to a canonical key that represents its group. Collect elements sharing the same key.

```cpp
unordered_map<string, vector<string>> groups;
for (const string& s : strs) {
    string key = s;
    sort(key.begin(), key.end()); // canonical form
    groups[key].push_back(s);
}
```

```java
Map<String, List<String>> groups = new HashMap<>();
for (String s : strs) {
    char[] chars = s.toCharArray();
    Arrays.sort(chars);
    String key = new String(chars);
    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
}
```

```typescript
const groups = new Map<string, string[]>();
for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
}
```

```python
from collections import defaultdict
groups: dict[str, list[str]] = defaultdict(list)
for s in strs:
    key = ''.join(sorted(s))
    groups[key].append(s)
```

```go
groups := map[string][]string{}
for _, s := range strs {
    b := []byte(s)
    sort.Slice(b, func(i, j int) bool { return b[i] < b[j] })
    key := string(b)
    groups[key] = append(groups[key], s)
}
```

### Pattern 4: Sliding Window with Hash Map

Track element counts within a window. Expand right, contract left when a constraint is violated.

```cpp
unordered_map<char, int> window;
int left = 0, result = 0;
for (int right = 0; right < s.size(); right++) {
    window[s[right]]++;
    while (window[s[right]] > 1) { // constraint violated
        window[s[left]]--;
        if (window[s[left]] == 0) window.erase(s[left]);
        left++;
    }
    result = max(result, right - left + 1);
}
```

```java
Map<Character, Integer> window = new HashMap<>();
int left = 0, result = 0;
for (int right = 0; right < s.length(); right++) {
    window.merge(s.charAt(right), 1, Integer::sum);
    while (window.get(s.charAt(right)) > 1) {
        window.merge(s.charAt(left), -1, Integer::sum);
        if (window.get(s.charAt(left)) == 0) window.remove(s.charAt(left));
        left++;
    }
    result = Math.max(result, right - left + 1);
}
```

```typescript
const window = new Map<string, number>();
let left = 0, result = 0;
for (let right = 0; right < s.length; right++) {
    window.set(s[right], (window.get(s[right]) ?? 0) + 1);
    while (window.get(s[right])! > 1) {
        window.set(s[left], window.get(s[left])! - 1);
        if (window.get(s[left]) === 0) window.delete(s[left]);
        left++;
    }
    result = Math.max(result, right - left + 1);
}
```

```python
from collections import defaultdict
window: dict[str, int] = defaultdict(int)
left = result = 0
for right, c in enumerate(s):
    window[c] += 1
    while window[c] > 1:
        window[s[left]] -= 1
        left += 1
    result = max(result, right - left + 1)
```

```go
window := map[byte]int{}
left, result := 0, 0
for right := 0; right < len(s); right++ {
    window[s[right]]++
    for window[s[right]] > 1 {
        window[s[left]]--
        left++
    }
    if right-left+1 > result { result = right - left + 1 }
}
```

## Pitfalls

| Pitfall | Language | Fix |
|---|---|---|
| `map["key"]` creates entry | C++ | Use `map.count("key")` or `map.find("key")` |
| Integer overflow as key | Java | Use `Long` not `int` for large products/sums |
| Mutable keys | Java | Never use arrays or lists as HashMap keys — they don't hash by content |
| Float keys | All | Floating-point keys are unreliable due to precision; avoid |
| `NullPointerException` on `.get()` | Java | Always use `getOrDefault()` or null-check |

## Ordered vs Unordered

| | Hash Map | Sorted Map (TreeMap) |
|---|---|---|
| `get`/`put` | O(1) avg | O(log n) |
| Iteration order | Unpredictable | Sorted by key |
| Use when | Order doesn't matter | Need smallest/largest key, range queries |

Use `TreeMap` (Java) / `std::map` (C++) / `SortedDict` (Python) only when you need ordering — hash maps are faster for everything else.

## Complexity Reference

| Operation | Average | Worst | Space |
|---|---|---|---|
| All operations | O(1) | O(n) | O(n) |
| Build from n elements | O(n) | O(n²) | O(n) |

Worst case occurs with hash collisions (all keys map to same bucket). A good hash function and load factor < 0.75 makes this effectively impossible in practice.

## Interview Patterns Table

| Problem Signal | Map Pattern | Example Problems |
|---|---|---|
| "two numbers sum to target" | Complement lookup | Two Sum |
| "count occurrences" | Frequency counter | Top K Frequent, Anagram |
| "group by property" | Key → list | Group Anagrams |
| "first/last occurrence" | Value → index | Longest Subarray |
| "seen before?" | Set or map as visited | Contains Duplicate |
| "running state per element" | Element → state | LRU Cache, Word Pattern |

