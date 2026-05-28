---
title: Reconstruct Itinerary
difficulty: Hard
tags: [Graph, DFS, Eulerian Path, Hierholzer]
link: https://leetcode.com/problems/reconstruct-itinerary/
---

# Reconstruct Itinerary

| | |
|---|---|
| **Difficulty** | Hard |
| **LeetCode** | [332. Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary/) |
| **Tags** | Graph, DFS, Eulerian Path, Hierholzer's Algorithm |

## Problem Statement

Given a list of airline tickets `tickets[i] = [from, to]`, reconstruct the itinerary starting from `"JFK"`. Use all tickets exactly once. If multiple valid itineraries exist, return the one with the smallest lexical order.

## Intuition

This is an **Eulerian path** problem — find a path that visits every **edge** exactly once.

**Hierholzer's algorithm** finds Eulerian paths efficiently:
1. Sort neighbors in **lexical order** (ensures lexicographically smallest result)
2. DFS from `JFK`, greedily taking the smallest available neighbor
3. When a node has no more unused edges (dead end), **push it to the result**
4. Reverse the result at the end

**Why post-order push?** If you push nodes in visit order, you might record a dead-end node before you've explored all paths that go through it. Post-order (push when done) ensures the full path is captured correctly — nodes with outgoing edges get prepended "naturally" through reversal.

## Approach: Hierholzer's Algorithm (DFS Post-Order)

```cpp
class Solution {
    unordered_map<string, multiset<string>> adj;  // multiset = sorted + handles duplicates
    vector<string> result;

    void dfs(const string& airport) {
        while (!adj[airport].empty()) {
            string next = *adj[airport].begin();
            adj[airport].erase(adj[airport].begin());
            dfs(next);
        }
        result.push_back(airport);  // post-order: add when all edges are used
    }
public:
    vector<string> findItinerary(vector<vector<string>>& tickets) {
        for (auto& t : tickets) adj[t[0]].insert(t[1]);
        dfs("JFK");
        reverse(result.begin(), result.end());
        return result;
    }
};
```

```java
class Solution {
    Map<String, PriorityQueue<String>> adj = new HashMap<>();
    List<String> result = new LinkedList<>();

    void dfs(String airport) {
        while (adj.containsKey(airport) && !adj.get(airport).isEmpty()) {
            dfs(adj.get(airport).poll());  // PriorityQueue = sorted/min-heap
        }
        ((LinkedList<String>) result).addFirst(airport);  // prepend (reverse order)
    }

    public List<String> findItinerary(List<List<String>> tickets) {
        for (List<String> t : tickets)
            adj.computeIfAbsent(t.get(0), k -> new PriorityQueue<>()).offer(t.get(1));
        dfs("JFK");
        return result;
    }
}
```

```typescript
function findItinerary(tickets: string[][]): string[] {
    const adj = new Map<string, string[]>();
    tickets.sort((a, b) => a[1] < b[1] ? -1 : 1);  // sort by destination
    for (const [from, to] of tickets) {
        if (!adj.has(from)) adj.set(from, []);
        adj.get(from)!.push(to);
    }

    const result: string[] = [];
    function dfs(airport: string) {
        const neighbors = adj.get(airport);
        while (neighbors && neighbors.length > 0) {
            dfs(neighbors.shift()!);  // take first (sorted) neighbor
        }
        result.push(airport);
    }

    dfs("JFK");
    return result.reverse();
}
```

```python
from collections import defaultdict

class Solution:
    def findItinerary(self, tickets: list[list[str]]) -> list[str]:
        adj = defaultdict(list)
        # Sort in reverse so we can pop from the end (efficient)
        for src, dst in sorted(tickets, reverse=True):
            adj[src].append(dst)

        result = []

        def dfs(airport: str) -> None:
            while adj[airport]:
                next_airport = adj[airport].pop()  # pop from sorted list = smallest first
                dfs(next_airport)
            result.append(airport)  # post-order: append when no more edges

        dfs("JFK")
        return result[::-1]  # reverse post-order to get the actual path
```

```go
import "sort"

func findItinerary(tickets [][]string) []string {
    adj := map[string][]string{}
    for _, t := range tickets { adj[t[0]] = append(adj[t[0]], t[1]) }
    for k := range adj { sort.Strings(adj[k]) }  // sort neighbors lexically

    result := []string{}
    var dfs func(airport string)
    dfs = func(airport string) {
        for len(adj[airport]) > 0 {
            next := adj[airport][0]; adj[airport] = adj[airport][1:]
            dfs(next)
        }
        result = append(result, airport)
    }

    dfs("JFK")
    // Reverse result
    for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 { result[i], result[j] = result[j], result[i] }
    return result
}
```

## Dry Run

```
tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
Sorted adj: JFK→[MUC], LHR→[SFO], MUC→[LHR], SFO→[SJC]

DFS("JFK"):
  take MUC → DFS("MUC")
    take LHR → DFS("LHR")
      take SFO → DFS("SFO")
        take SJC → DFS("SJC")
          no neighbors → append "SJC"   result=["SJC"]
        no neighbors → append "SFO"     result=["SJC","SFO"]
      no neighbors → append "LHR"       result=["SJC","SFO","LHR"]
    no neighbors → append "MUC"         result=["SJC","SFO","LHR","MUC"]
  no neighbors → append "JFK"           result=["SJC","SFO","LHR","MUC","JFK"]

Reversed: ["JFK","MUC","LHR","SFO","SJC"] ✓
```

## Complexity

- **Time:** O(E log E) — sorting neighbors; DFS visits each edge once: O(E)
- **Space:** O(V + E) — adjacency lists and recursion stack

## Key Interview Insights

- **Post-order push + reverse = Hierholzer's algorithm.** This is the standard way to find Eulerian paths. The post-order ensures dead-end nodes appear at the end of the reversed path (i.e., the beginning of the actual route).
- **Sorted neighbors ensure lexicographic smallest result.** Always take the smallest available destination first. Use sorted adjacency lists (pop from end in Python) or a min-heap.
- **Guaranteed Eulerian path exists.** The problem guarantees a valid itinerary exists, so you don't need to handle the case where no Eulerian path is possible.
- **If using iterative DFS:** Replace recursion with an explicit stack, pushing to result and reversing at the end — same logic, avoids recursion depth issues.
- **Difference from DFS flood-fill:** Here you're finding a path that uses every EDGE once (Eulerian), not visiting every NODE once (Hamiltonian, which is NP-hard).
