# 📝 List Interface - Quick Interview Notes

## 📋 List Interface Basics

**What is List?**
- Ordered collection (sequence)
- Allows duplicates
- Positional access via index
- Extends Collection interface

**Key Characteristics:**
- **Ordered** - Maintains insertion order
- **Index-based** - Access by position (0-based)
- **Duplicates allowed** - Can have duplicate elements
- **Null allowed** - Can contain null elements

**List Methods:**
```java
// Positional Access
E get(int index)
E set(int index, E element)
void add(int index, E element)
E remove(int index)

// Search
int indexOf(Object o)
int lastIndexOf(Object o)

// List Iterator
ListIterator<E> listIterator()
ListIterator<E> listIterator(int index)

// Range View
List<E> subList(int fromIndex, int toIndex)
```

---

## 📊 ArrayList

**Characteristics:**
- **Dynamic array** - Resizable array implementation
- **Fast random access** - O(1) for get/set
- **Slow insertion/deletion** - O(n) in middle
- **Not synchronized** - Not thread-safe

**Internal:**
- Backed by array
- Default capacity: 10
- Grows by 50% when full: `newCapacity = oldCapacity + (oldCapacity >> 1)`

**Usage:**
```java
List<String> list = new ArrayList<>();
list.add("A");
list.add(0, "B");  // Insert at index
String item = list.get(0);
list.set(0, "C");
list.remove(0);
```

**When to Use:**
- ✅ Frequent random access
- ✅ Iteration
- ✅ Adding at end
- ❌ Frequent insertion/deletion in middle

**Time Complexity:**
- get/set: O(1)
- add (end): O(1) amortized
- add (middle): O(n)
- remove: O(n)
- contains: O(n)

---

## 🔗 LinkedList

**Characteristics:**
- **Doubly-linked list** - Nodes with prev/next pointers
- **Slow random access** - O(n) for get/set
- **Fast insertion/deletion** - O(1) if position known
- **Implements List and Deque** - Can be used as stack/queue
- **Not synchronized** - Not thread-safe

**Internal:**
- Node structure: `Node { E element, Node next, Node prev }`
- Maintains head and tail references

**Usage:**
```java
LinkedList<String> list = new LinkedList<>();
list.add("A");
list.addFirst("B");
list.addLast("C");
String first = list.getFirst();
String last = list.getLast();
list.removeFirst();
list.removeLast();
```

**When to Use:**
- ✅ Frequent insertion/deletion
- ✅ Queue/Deque operations
- ✅ Adding at beginning/end
- ❌ Random access
- ❌ Memory-constrained (overhead per node)

**Time Complexity:**
- get/set: O(n)
- add (beginning/end): O(1)
- add (middle): O(n) to find position
- remove (beginning/end): O(1)
- contains: O(n)

---

## 🔐 Vector

**Characteristics:**
- **Synchronized** - Thread-safe (all methods synchronized)
- **Legacy class** - Before Collections Framework
- **Similar to ArrayList** - Dynamic array
- **Slower** - Due to synchronization overhead

**Internal:**
- Grows by 100% by default (doubles)
- Can specify growth increment

**Usage:**
```java
Vector<String> vector = new Vector<>();
vector.add("A");
vector.addElement("B");  // Legacy method
String item = vector.get(0);
```

**When to Use:**
- ❌ Generally avoid - Use ArrayList with external sync if needed
- ⚠️ Legacy code only

---

## 📚 Stack

**Characteristics:**
- **Extends Vector** - LIFO (Last-In-First-Out)
- **Synchronized** - Thread-safe
- **Legacy class** - Use Deque instead

**Stack Operations:**
```java
Stack<String> stack = new Stack<>();
stack.push("A");
stack.push("B");
String top = stack.peek();  // View top
String item = stack.pop();  // Remove and return top
boolean empty = stack.empty();
int position = stack.search("A");  // 1-based from top
```

**Modern Alternative - Deque:**
```java
Deque<String> stack = new ArrayDeque<>();
stack.push("A");
stack.push("B");
String top = stack.peek();
String item = stack.pop();
```

**When to Use:**
- ❌ Avoid Stack class - Use Deque instead
- ✅ Use ArrayDeque for stack operations

---

## ⚖️ ArrayList vs LinkedList

| Feature | ArrayList | LinkedList |
|---------|-----------|------------|
| **Structure** | Dynamic array | Doubly-linked list |
| **Random Access** | Fast O(1) | Slow O(n) |
| **Insertion/Deletion (middle)** | Slow O(n) | Fast O(1) if node known |
| **Insertion at end** | Fast O(1) | Fast O(1) |
| **Memory** | Contiguous, less overhead | Non-contiguous, node overhead |
| **Iteration** | Faster (cache-friendly) | Slower |
| **Implements** | List | List + Deque |
| **Use Case** | Random access, iteration | Frequent insert/delete |

---

## 📝 CopyOnWriteArrayList

**Characteristics:**
- **Thread-safe** - No need for synchronization
- **Copy-on-write** - Creates new array on modification
- **Snapshot iterators** - Never throws ConcurrentModificationException
- **Read-optimized** - Fast reads, slow writes

**Usage:**
```java
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
list.add("A");
list.add("B");

// Iterator is snapshot
Iterator<String> it = list.iterator();
list.add("C");  // Won't affect iterator
while(it.hasNext()) {
    System.out.println(it.next());  // Only A, B
}
```

**When to Use:**
- ✅ Read-heavy scenarios (event listeners, observers)
- ✅ Iteration more frequent than modification
- ✅ Small to medium size
- ❌ Frequent modifications
- ❌ Large lists (memory overhead)

**Time Complexity:**
- get: O(1)
- add: O(n) - copies array
- remove: O(n) - copies array
- iterator.next(): O(1)

---

## 🎯 Quick Interview Points

1. **List characteristics?** - Ordered, allows duplicates, index-based
2. **ArrayList internal?** - Dynamic array
3. **ArrayList default capacity?** - 10
4. **ArrayList growth?** - 50% (newCap = oldCap + oldCap/2)
5. **LinkedList structure?** - Doubly-linked list
6. **ArrayList vs LinkedList access?** - ArrayList O(1), LinkedList O(n)
7. **Best for random access?** - ArrayList
8. **Best for frequent insert/delete?** - LinkedList
9. **Vector vs ArrayList?** - Vector synchronized, ArrayList not
10. **Stack extends?** - Vector
11. **Modern alternative to Stack?** - ArrayDeque (Deque interface)
12. **CopyOnWriteArrayList thread-safe?** - Yes
13. **CopyOnWriteArrayList modification?** - Creates new array copy
14. **CopyOnWriteArrayList when?** - Read-heavy, event listeners
15. **Can LinkedList be queue?** - Yes, implements Deque
16. **List allows null?** - Yes
17. **List allows duplicates?** - Yes
18. **subList() returns?** - View of portion (backed by original)
19. **Vector growth?** - 100% (doubles)
20. **Why avoid Vector/Stack?** - Synchronized overhead, use ArrayList/ArrayDeque instead
