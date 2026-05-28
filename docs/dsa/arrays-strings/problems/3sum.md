---
title: 3Sum
difficulty: Medium
tags: [Array, Two Pointers, Sorting]
link: https://leetcode.com/problems/3sum/
---

# 3Sum

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [15. 3Sum](https://leetcode.com/problems/3sum/) |
| **Tags** | Array, Two Pointers, Sorting |

## Problem Statement

Given an integer array `nums`, return all **unique** triplets `[nums[i], nums[j], nums[k]]` such that `i != j != k` and `nums[i] + nums[j] + nums[k] == 0`.

The solution set must not contain duplicate triplets.

## Intuition

Fix one element, then solve Two Sum on the remaining array. To avoid duplicates, **sort first** and skip over repeated values at every level.

## Approach 1: Brute Force

Check all triplets.

```cpp
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        set<vector<int>> resultSet;
        sort(nums.begin(), nums.end());
        for (int i = 0; i < nums.size(); i++) {
            for (int j = i + 1; j < nums.size(); j++) {
                for (int k = j + 1; k < nums.size(); k++) {
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        resultSet.insert({nums[i], nums[j], nums[k]});
                    }
                }
            }
        }
        return vector<vector<int>>(resultSet.begin(), resultSet.end());
    }
};
```

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Set<List<Integer>> resultSet = new HashSet<>();
        Arrays.sort(nums);
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                for (int k = j + 1; k < nums.length; k++) {
                    if (nums[i] + nums[j] + nums[k] == 0) {
                        resultSet.add(Arrays.asList(nums[i], nums[j], nums[k]));
                    }
                }
            }
        }
        return new ArrayList<>(resultSet);
    }
}
```

```typescript
function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const resultSet = new Set<string>();
    const result: number[][] = [];
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            for (let k = j + 1; k < nums.length; k++) {
                if (nums[i] + nums[j] + nums[k] === 0) {
                    const key = `${nums[i]},${nums[j]},${nums[k]}`;
                    if (!resultSet.has(key)) {
                        resultSet.add(key);
                        result.push([nums[i], nums[j], nums[k]]);
                    }
                }
            }
        }
    }
    return result;
}
```

```python
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result_set = set()
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                for k in range(j + 1, len(nums)):
                    if nums[i] + nums[j] + nums[k] == 0:
                        result_set.add((nums[i], nums[j], nums[k]))
        return [list(t) for t in result_set]
```

```go
func threeSum(nums []int) [][]int {
    sort.Ints(nums)
    seen := map[[3]int]bool{}
    var result [][]int
    for i := 0; i < len(nums); i++ {
        for j := i + 1; j < len(nums); j++ {
            for k := j + 1; k < len(nums); k++ {
                if nums[i]+nums[j]+nums[k] == 0 {
                    key := [3]int{nums[i], nums[j], nums[k]}
                    if !seen[key] {
                        seen[key] = true
                        result = append(result, []int{nums[i], nums[j], nums[k]})
                    }
                }
            }
        }
    }
    return result
}
```

**Time:** O(n³) — **Space:** O(n) for deduplication

## Approach 2: Sort + Two Pointers (Optimal)

1. Sort the array
2. For each index `i`, run two pointers `left = i+1`, `right = n-1`
3. Skip duplicates at all three levels

```cpp
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;

        for (int i = 0; i < (int)nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue; // skip duplicate i
            if (nums[i] > 0) break; // optimization: no solution possible

            int left = i + 1, right = nums.size() - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum < 0) {
                    left++;
                } else if (sum > 0) {
                    right--;
                } else {
                    result.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                }
            }
        }
        return result;
    }
};
```

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            if (nums[i] > 0) break;

            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum < 0) {
                    left++;
                } else if (sum > 0) {
                    right--;
                } else {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                }
            }
        }
        return result;
    }
}
```

```typescript
function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const result: number[][] = [];

    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        if (nums[i] > 0) break;

        let left = i + 1, right = nums.length - 1;
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum < 0) {
                left++;
            } else if (sum > 0) {
                right--;
            } else {
                result.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            }
        }
    }
    return result;
}
```

```python
class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []

        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            if nums[i] > 0:
                break

            left, right = i + 1, len(nums) - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total < 0:
                    left += 1
                elif total > 0:
                    right -= 1
                else:
                    result.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1

        return result
```

```go
func threeSum(nums []int) [][]int {
    sort.Ints(nums)
    var result [][]int

    for i := 0; i < len(nums)-2; i++ {
        if i > 0 && nums[i] == nums[i-1] {
            continue
        }
        if nums[i] > 0 {
            break
        }

        left, right := i+1, len(nums)-1
        for left < right {
            sum := nums[i] + nums[left] + nums[right]
            if sum < 0 {
                left++
            } else if sum > 0 {
                right--
            } else {
                result = append(result, []int{nums[i], nums[left], nums[right]})
                for left < right && nums[left] == nums[left+1] {
                    left++
                }
                for left < right && nums[right] == nums[right-1] {
                    right--
                }
                left++
                right--
            }
        }
    }
    return result
}
```

**Time:** O(n²) — **Space:** O(1) extra (O(n) for sort in some languages)

## Dry Run

Input: `nums = [-1, 0, 1, 2, -1, -4]`
After sorting: `[-4, -1, -1, 0, 1, 2]`

**i=0, nums[i]=-4:** left=1, right=5. All sums too small → no match.

**i=1, nums[i]=-1:** left=2, right=5.
- sum = -1 + (-1) + 2 = 0 → found `[-1, -1, 2]`, skip dups, left=3, right=4
- sum = -1 + 0 + 1 = 0 → found `[-1, 0, 1]`, skip dups, done.

**i=2, nums[i]=-1:** skip (duplicate of i=1).

Result: `[[-1, -1, 2], [-1, 0, 1]]`

## Key Interview Insights

- **Duplicate handling is the hardest part.** Practice the skip pattern until it's automatic.
- **Optimization: `if (nums[i] > 0) break`** — in a sorted array, if the smallest element is positive, no triplet can sum to zero.
- **Generalization to kSum:** Fix one element + solve (k-1)Sum recursively. 4Sum is O(n³), etc.
- **Why not hash map?** It works for Two Sum but duplicate handling in 3Sum with hash maps is messy. Sorting + two pointers is cleaner.
