---
title: Time Based Key-Value Store
difficulty: Medium
tags: [Hash Map, String, Binary Search, Design]
link: https://leetcode.com/problems/time-based-key-value-store/
---

# Time Based Key-Value Store

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [981. Time Based Key-Value Store](https://leetcode.com/problems/time-based-key-value-store/) |
| **Tags** | Hash Map, String, Binary Search, Design |

## Problem Statement

Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the key's value at a certain timestamp.

Implement the `TimeMap` class:
- `TimeMap()` Initializes the object.
- `void set(String key, String value, int timestamp)` Stores the key `key` with the value `value` at the given time `timestamp`.
- `String get(String key, int timestamp)` Returns a value such that `set` was called previously with `timestamp_prev <= timestamp`. If there are multiple such values, it returns the value associated with the largest `timestamp_prev`. If there are no values, it returns `""`.

**Constraints:** All `set` calls are made with strictly increasing `timestamp` values.

## Intuition

The constraint that timestamps are strictly increasing means: for each key, we store a list of `(timestamp, value)` pairs, and the list is naturally sorted by timestamp.

`get(key, timestamp)` asks: "Find the value with the largest stored timestamp that is `<= timestamp`." This is a **upper bound / predecessor query** — binary search for the rightmost timestamp that is `<= timestamp`.

```
key "foo" has entries:  [(1, "bar"), (4, "baz")]

get("foo", 1):  largest stored_ts <= 1 → stored_ts=1 → "bar"
get("foo", 3):  largest stored_ts <= 3 → stored_ts=1 → "bar"
get("foo", 4):  largest stored_ts <= 4 → stored_ts=4 → "baz"
get("foo", 5):  largest stored_ts <= 5 → stored_ts=4 → "baz"
```

## Approach: HashMap + Binary Search

Store entries in a `HashMap<String, List<(int, String)>>`. Each list is sorted by timestamp (guaranteed by strictly increasing set calls). For `get`, binary search for the rightmost timestamp `<= target`.

```cpp
class TimeMap {
    unordered_map<string, vector<pair<int, string>>> store;

public:
    void set(string key, string value, int timestamp) {
        store[key].push_back({timestamp, value});
    }

    string get(string key, int timestamp) {
        if (!store.count(key)) return "";

        auto& entries = store[key];
        // Binary search: find last entry with ts <= timestamp
        int left = 0, right = (int)entries.size() - 1, ans = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (entries[mid].first <= timestamp) {
                ans = mid;       // valid candidate, try to find a later one
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return ans == -1 ? "" : entries[ans].second;
    }
};
```

```java
class TimeMap {
    private Map<String, List<int[]>> store;  // int[] = {timestamp, value_index}
    private Map<String, List<String>> values;

    public TimeMap() {
        store  = new HashMap<>();
        values = new HashMap<>();
    }

    public void set(String key, String value, int timestamp) {
        store.computeIfAbsent(key, k -> new ArrayList<>())
             .add(new int[]{timestamp});
        values.computeIfAbsent(key, k -> new ArrayList<>())
              .add(value);
    }

    public String get(String key, int timestamp) {
        if (!store.containsKey(key)) return "";

        List<int[]> ts = store.get(key);
        int left = 0, right = ts.size() - 1, ans = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (ts.get(mid)[0] <= timestamp) {
                ans = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return ans == -1 ? "" : values.get(key).get(ans);
    }
}
```

```typescript
class TimeMap {
    private store: Map<string, [number, string][]>;

    constructor() {
        this.store = new Map();
    }

    set(key: string, value: string, timestamp: number): void {
        if (!this.store.has(key)) this.store.set(key, []);
        this.store.get(key)!.push([timestamp, value]);
    }

    get(key: string, timestamp: number): string {
        const entries = this.store.get(key);
        if (!entries) return "";

        let left = 0, right = entries.length - 1, ans = -1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (entries[mid][0] <= timestamp) {
                ans = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return ans === -1 ? "" : entries[ans][1];
    }
}
```

```python
from collections import defaultdict
import bisect

class TimeMap:

    def __init__(self):
        # Store (timestamp, value) pairs per key; timestamps are sorted ascending
        self.store: dict[str, list[tuple[int, str]]] = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self.store[key]
        if not entries:
            return ""

        # Binary search: find rightmost timestamp <= given timestamp
        left, right, ans = 0, len(entries) - 1, -1

        while left <= right:
            mid = (left + right) // 2
            if entries[mid][0] <= timestamp:
                ans = mid
                left = mid + 1   # try to find a later valid timestamp
            else:
                right = mid - 1

        return "" if ans == -1 else entries[ans][1]
```

```go
type TimeMap struct {
    timestamps map[string][]int
    values     map[string][]string
}

func Constructor() TimeMap {
    return TimeMap{
        timestamps: make(map[string][]int),
        values:     make(map[string][]string),
    }
}

func (t *TimeMap) Set(key string, value string, timestamp int) {
    t.timestamps[key] = append(t.timestamps[key], timestamp)
    t.values[key]     = append(t.values[key], value)
}

func (t *TimeMap) Get(key string, timestamp int) string {
    ts := t.timestamps[key]
    if len(ts) == 0 { return "" }

    left, right, ans := 0, len(ts)-1, -1

    for left <= right {
        mid := left + (right-left)/2
        if ts[mid] <= timestamp {
            ans = mid
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    if ans == -1 { return "" }
    return t.values[key][ans]
}
```

## Dry Run

```
set("foo", "bar", 1)  → store["foo"] = [(1, "bar")]
set("foo", "baz", 4)  → store["foo"] = [(1, "bar"), (4, "baz")]

get("foo", 4):
  entries = [(1,"bar"), (4,"baz")],  target_ts = 4
  left=0, right=1, mid=0: ts[0]=1 <= 4 → ans=0, left=1
  left=1, right=1, mid=1: ts[1]=4 <= 4 → ans=1, left=2
  left=2 > right=1 → exit
  return entries[1][1] = "baz" ✓

get("foo", 3):
  left=0, right=1, mid=0: ts[0]=1 <= 3 → ans=0, left=1
  left=1, right=1, mid=1: ts[1]=4 > 3 → right=0
  left=1 > right=0 → exit
  return entries[0][1] = "bar" ✓

get("foo", 0):
  left=0, right=1, mid=0: ts[0]=1 > 0 → right=-1
  exit (ans stays -1)
  return "" ✓
```

## Language-Native Shortcuts

Some languages have stdlib tools that replace the manual binary search for this specific "rightmost entry at or before timestamp" query.

```cpp
// upper_bound on sorted pairs: finds first entry with ts > timestamp
string get(string key, int timestamp) {
    auto& entries = store[key];  // vector<pair<int,string>>
    auto it = upper_bound(entries.begin(), entries.end(),
                          make_pair(timestamp, string(1, '\x7f')));
    if (it == entries.begin()) return "";
    return prev(it)->second;
}
```

```java
// Java: TreeMap.floorKey gives largest key <= timestamp in O(log n)
private Map<String, TreeMap<Integer, String>> store = new HashMap<>();

public String get(String key, int timestamp) {
    TreeMap<Integer, String> ts = store.getOrDefault(key, new TreeMap<>());
    Integer floor = ts.floorKey(timestamp);
    return floor == null ? "" : ts.get(floor);
}
```

```typescript
// TypeScript: no stdlib shortcut — binary search (bisect_right equivalent)
get(key: string, timestamp: number): string {
    const entries = this.store.get(key) ?? [];
    let left = 0, right = entries.length;
    while (left < right) {
        const mid = (left + right) >> 1;
        if (entries[mid][0] <= timestamp) left = mid + 1;
        else right = mid;
    }
    return left > 0 ? entries[left - 1][1] : "";
}
```

```python
# bisect_right finds the insertion position for timestamp+1
# which is equivalent to the count of timestamps <= timestamp
# So the rightmost valid index is bisect_right(timestamps, timestamp) - 1

import bisect

class TimeMap:
    def __init__(self):
        self.store = defaultdict(list)  # key → [(ts, val), ...]

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self.store[key]
        # bisect_right on tuples compares first element (timestamp)
        # We search for (timestamp+1,) to find rightmost ts <= timestamp
        idx = bisect.bisect_right(entries, (timestamp, chr(127))) - 1
        return entries[idx][1] if idx >= 0 else ""
```

```go
// Go: binary search (bisect_right equivalent — sort.SearchInts not applicable here)
func (t *TimeMap) Get(key string, timestamp int) string {
    entries := t.store[key]  // []struct{ts int; val string}
    left, right := 0, len(entries)
    for left < right {
        mid := (left + right) / 2
        if entries[mid].ts <= timestamp { left = mid + 1 } else { right = mid }
    }
    if left == 0 { return "" }
    return entries[left-1].val
}
```

## Complexity

| Operation | Time | Space |
|---|---|---|
| `set` | O(1) amortized | O(1) per call |
| `get` | O(log n) binary search | O(1) |
| Overall | O(n log n) for n operations | O(n) |

Where `n` is total number of `set` calls.

## Key Interview Insights

- **The "strictly increasing timestamp" constraint is the key** — it guarantees the stored list is always sorted, making binary search valid.
- **This is an upper-bound / predecessor binary search** — we want the last stored timestamp `<= target`, not `==` target. Track the `ans` index whenever the condition is satisfied and keep moving right.
- **What to store:** Two parallel arrays (timestamps and values) per key, or a list of tuples. Parallel arrays allow bisect on the timestamp list directly.
