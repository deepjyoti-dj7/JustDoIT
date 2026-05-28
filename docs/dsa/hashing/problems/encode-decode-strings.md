---
title: Encode and Decode Strings
difficulty: Medium
tags: [String, Design]
link: https://leetcode.com/problems/encode-and-decode-strings/
---

# Encode and Decode Strings

| | |
|---|---|
| **Difficulty** | Medium |
| **LeetCode** | [271. Encode and Decode Strings](https://leetcode.com/problems/encode-and-decode-strings/) (Premium) · [Lintcode 659](https://www.lintcode.com/problem/659/) |
| **Tags** | String, Design |

## Problem Statement

Design an algorithm to encode a list of strings to a single string and decode it back to the original list. The codec must handle any characters including the delimiter character itself.

```
encode(["lint","code","love","you"]) → some_string
decode(some_string) → ["lint","code","love","you"]
```

## Intuition

The core challenge: how do you separate strings if they can contain *any* character, including any delimiter you might choose?

**Wrong approach:** Using a single special character (like `#` or `,`) as separator fails when strings contain that character.

**Right approach:** **Length-prefixed encoding** — prefix each string with its length. The decoder reads the length first, then reads exactly that many characters. No ambiguity, any characters allowed.

Format: `<length>#<string><length>#<string>...`

Example: `["lint", "co#de"]` → `"4#lint5#co#de"`

The `#` after the length is a separator between the length number and the string content. Even though `co#de` contains `#`, the decoder reads exactly 5 characters after the `#` separator — it never needs to "search" for the next `#` ambiguously.

## Approach: Length Prefix Encoding

```cpp
class Codec {
public:
    string encode(vector<string>& strs) {
        string encoded;
        for (const string& s : strs) {
            encoded += to_string(s.size()) + '#' + s;
        }
        return encoded;
    }

    vector<string> decode(string s) {
        vector<string> result;
        int i = 0;
        while (i < s.size()) {
            int j = i;
            while (s[j] != '#') j++;
            int len = stoi(s.substr(i, j - i));
            result.push_back(s.substr(j + 1, len));
            i = j + 1 + len;
        }
        return result;
    }
};
```

```java
public class Codec {
    public String encode(List<String> strs) {
        StringBuilder sb = new StringBuilder();
        for (String s : strs) {
            sb.append(s.length()).append('#').append(s);
        }
        return sb.toString();
    }

    public List<String> decode(String s) {
        List<String> result = new ArrayList<>();
        int i = 0;
        while (i < s.length()) {
            int j = i;
            while (s.charAt(j) != '#') j++;
            int len = Integer.parseInt(s.substring(i, j));
            result.add(s.substring(j + 1, j + 1 + len));
            i = j + 1 + len;
        }
        return result;
    }
}
```

```typescript
function encode(strs: string[]): string {
    return strs.map(s => `${s.length}#${s}`).join('');
}

function decode(s: string): string[] {
    const result: string[] = [];
    let i = 0;
    while (i < s.length) {
        let j = i;
        while (s[j] !== '#') j++;
        const len = parseInt(s.slice(i, j));
        result.push(s.slice(j + 1, j + 1 + len));
        i = j + 1 + len;
    }
    return result;
}
```

```python
class Codec:
    def encode(self, strs: list[str]) -> str:
        return ''.join(f'{len(s)}#{s}' for s in strs)

    def decode(self, s: str) -> list[str]:
        result = []
        i = 0
        while i < len(s):
            j = i
            while s[j] != '#':
                j += 1
            length = int(s[i:j])
            result.append(s[j + 1 : j + 1 + length])
            i = j + 1 + length
        return result
```

```go
type Codec struct{}

func (c *Codec) Encode(strs []string) string {
    var sb strings.Builder
    for _, s := range strs {
        sb.WriteString(fmt.Sprintf("%d#%s", len(s), s))
    }
    return sb.String()
}

func (c *Codec) Decode(s string) []string {
    result := []string{}
    i := 0
    for i < len(s) {
        j := i
        for s[j] != '#' { j++ }
        length, _ := strconv.Atoi(s[i:j])
        result = append(result, s[j+1:j+1+length])
        i = j + 1 + length
    }
    return result
}
```

**Time:** O(n) encode and decode where n = total character count.
**Space:** O(n) for the encoded string.

## Dry Run

Encode `["lint", "co#de", ""]`:

| String | Length | Chunk |
|---|---|---|
| "lint" | 4 | `4#lint` |
| "co#de" | 5 | `5#co#de` |
| "" | 0 | `0#` |

Encoded: `"4#lint5#co#de0#"`

Decode `"4#lint5#co#de0#"`:

| i | Find # at j | len | Extract | New i |
|---|---|---|---|---|
| 0 | j=1 | 4 | s[2:6]="lint" | 6 |
| 6 | j=7 | 5 | s[8:13]="co#de" | 13 |
| 13 | j=14 | 0 | s[15:15]="" | 15 |

Result: `["lint", "co#de", ""]` ✓

Note that the `#` inside `"co#de"` doesn't confuse the decoder because we only look for `#` in the length portion, then jump exactly `len` characters.

## Key Interview Insights

- **Why not a single separator character?** The strings could contain any character. A single delimiter like `|` or `#` would fail on inputs like `["a|b", "c"]`.
- **Why `#` after the length?** The length is a variable-width number (could be 1, 2, or more digits). We need a delimiter between the length number and the string itself so we know where the length ends. The `#` serves this purpose.
- **Why not escape the delimiter?** Escaping works but is much more complex to implement correctly in an interview. Length prefixing is simpler and cleaner.
- **Empty strings must be handled** — `""` encodes as `"0#"` and decodes back correctly.
- **Alternative: chunked transfer encoding** — this is exactly how HTTP chunked transfer encoding works. Showing you recognize the real-world pattern is a strong signal.
- **Alternative: use 4 fixed bytes for length** — Java's `DataOutputStream` writes integers as 4 fixed bytes, avoiding the need for a delimiter between length and string. Either approach is valid.

