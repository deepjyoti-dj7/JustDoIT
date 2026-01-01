# 📝 Collection Framework Overview - Quick Interview Notes

## 📚 Introduction to Collections

**What is Collection Framework?**
- Unified architecture for storing and manipulating groups of objects
- Provides interfaces, implementations, and algorithms
- Part of java.util package

**Benefits:**
- ✅ Reduces programming effort (ready-made data structures)
- ✅ Increases performance (optimized implementations)
- ✅ Interoperability between unrelated APIs
- ✅ Easy to learn and use
- ✅ Reduces effort to design new APIs

**Core Interfaces:**
- `Collection` - Root interface
- `List` - Ordered collection (allows duplicates)
- `Set` - Unordered collection (no duplicates)
- `Queue` - Collection for holding elements prior to processing
- `Map` - Key-value pairs (not extends Collection)

---

## 🌳 Collection Hierarchy

```
Iterable
    └── Collection
            ├── List
            │   ├── ArrayList
            │   ├── LinkedList
            │   ├── Vector
            │   └── Stack
            ├── Set
            │   ├── HashSet
            │   ├── LinkedHashSet
            │   └── SortedSet
            │       └── NavigableSet
            │           └── TreeSet
            └── Queue
                ├── PriorityQueue
                └── Deque
                    ├── ArrayDeque
                    └── LinkedList

Map (separate hierarchy)
    ├── HashMap
    ├── LinkedHashMap
    ├── Hashtable
    └── SortedMap
        └── NavigableMap
            └── TreeMap
```

**Key Points:**
- Map does NOT extend Collection
- LinkedList implements both List and Deque
- All collections inherit from Iterable

---

## 🆚 Collection vs Collections

| Collection | Collections |
|------------|-------------|
| Interface | Utility class |
| Root of collection hierarchy | Contains static methods |
| `java.util.Collection` | `java.util.Collections` |
| `List<String> list;` | `Collections.sort(list);` |

**Collection Interface:**
```java
public interface Collection<E> extends Iterable<E> {
    boolean add(E e);
    boolean remove(Object o);
    int size();
    boolean isEmpty();
    // ... more methods
}
```

**Collections Class (Utility):**
```java
Collections.sort(list);
Collections.reverse(list);
Collections.shuffle(list);
Collections.max(list);
Collections.min(list);
Collections.frequency(list, element);
Collections.binarySearch(list, key);
```

---

## 🔄 Iterable & Iterator

### Iterable Interface
- Root of collection hierarchy
- Provides iterator() method
- Allows use of enhanced for-loop

```java
public interface Iterable<T> {
    Iterator<T> iterator();
    default void forEach(Consumer<? super T> action) { }
}
```

### Iterator Interface
- Traverse collection
- Remove elements during iteration

```java
public interface Iterator<E> {
    boolean hasNext();
    E next();
    void remove();  // Optional
    default void forEachRemaining(Consumer<? super E> action) { }
}
```

**Using Iterator:**
```java
List<String> list = new ArrayList<>();
Iterator<String> it = list.iterator();
while(it.hasNext()) {
    String element = it.next();
    System.out.println(element);
    // Can remove during iteration
    if(condition) {
        it.remove();
    }
}
```

**Enhanced for-loop (uses Iterator internally):**
```java
for(String element : list) {
    System.out.println(element);
    // Cannot remove here!
}
```

**ListIterator (for List):**
- Bidirectional traversal
- Add, remove, replace elements
```java
ListIterator<String> lit = list.listIterator();
while(lit.hasNext()) {
    String element = lit.next();
    lit.set("Modified");  // Replace
    lit.add("New");       // Add
}
// Backward iteration
while(lit.hasPrevious()) {
    String element = lit.previous();
}
```

---

## ⚖️ Comparable vs Comparator

**Both used for sorting, but different approaches**

### Comparable Interface
- Natural ordering
- Part of class definition
- Single sorting sequence
- `int compareTo(T o)`

```java
class Student implements Comparable<Student> {
    private int id;
    private String name;
    
    @Override
    public int compareTo(Student other) {
        return this.id - other.id;  // Sort by id
    }
}

Collections.sort(students);  // Uses compareTo()
```

**compareTo() Return Values:**
- Negative: this < other
- Zero: this == other
- Positive: this > other

### Comparator Interface
- Custom ordering
- External to class
- Multiple sorting sequences
- `int compare(T o1, T o2)`

```java
class NameComparator implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        return s1.getName().compareTo(s2.getName());
    }
}

Collections.sort(students, new NameComparator());
```

**Lambda Expression:**
```java
Collections.sort(students, (s1, s2) -> s1.getName().compareTo(s2.getName()));

// Method reference
Collections.sort(students, Comparator.comparing(Student::getName));
```

**Comparison:**
| Comparable | Comparator |
|------------|------------|
| Natural ordering | Custom ordering |
| Modify class | External class |
| Single sequence | Multiple sequences |
| `compareTo()` | `compare()` |
| `Collections.sort(list)` | `Collections.sort(list, comparator)` |

**Comparator Methods (Java 8+):**
```java
Comparator<Student> byName = Comparator.comparing(Student::getName);
Comparator<Student> byId = Comparator.comparing(Student::getId);
Comparator<Student> reversed = byName.reversed();
Comparator<Student> thenBy = byName.thenComparing(Student::getId);
Comparator<Student> nullsFirst = Comparator.nullsFirst(byName);
Comparator<Student> nullsLast = Comparator.nullsLast(byName);
```

---

## 🔒 Fail-Fast vs Fail-Safe

### Fail-Fast Iterators
- Throws `ConcurrentModificationException` if modified during iteration
- Uses modCount to detect changes
- Examples: ArrayList, HashMap, HashSet

```java
List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C"));
for(String s : list) {
    list.remove(s);  // ❌ ConcurrentModificationException
}

// Using Iterator (safe way to remove)
Iterator<String> it = list.iterator();
while(it.hasNext()) {
    String s = it.next();
    it.remove();  // ✅ OK
}
```

### Fail-Safe Iterators
- Work on clone of collection
- No exception if modified
- May not reflect latest changes
- Examples: CopyOnWriteArrayList, ConcurrentHashMap

```java
List<String> list = new CopyOnWriteArrayList<>(Arrays.asList("A", "B", "C"));
for(String s : list) {
    list.remove(s);  // ✅ No exception, but may not see changes
}
```

**Comparison:**
| Fail-Fast | Fail-Safe |
|-----------|-----------|
| Throws exception | No exception |
| Works on original | Works on clone |
| Memory efficient | Memory overhead |
| ArrayList, HashMap | CopyOnWriteArrayList, ConcurrentHashMap |

**modCount:**
- Modification counter
- Incremented on structural modification
- Iterator checks if modCount changed
```java
// Internal implementation
int expectedModCount = modCount;
if(modCount != expectedModCount) {
    throw new ConcurrentModificationException();
}
```

---

## 🎯 Quick Interview Points

1. **Collection Framework?** - Unified architecture for storing/manipulating object groups
2. **Core interfaces?** - Collection, List, Set, Queue, Map
3. **Does Map extend Collection?** - No, separate hierarchy
4. **Collection vs Collections?** - Collection is interface, Collections is utility class
5. **Iterable purpose?** - Provides iterator, enables for-each loop
6. **Iterator methods?** - hasNext(), next(), remove()
7. **Can remove during for-each?** - No, use iterator.remove()
8. **ListIterator?** - Bidirectional iterator for List
9. **Comparable vs Comparator?** - Comparable for natural order (in class), Comparator for custom order (external)
10. **compareTo() returns?** - Negative (less), 0 (equal), Positive (greater)
11. **Fail-fast?** - Throws ConcurrentModificationException on modification
12. **Fail-safe?** - No exception, works on clone
13. **Fail-fast examples?** - ArrayList, HashMap, HashSet
14. **Fail-safe examples?** - CopyOnWriteArrayList, ConcurrentHashMap
15. **modCount?** - Modification counter for fail-fast detection
16. **Why Map not in Collection?** - Different contract (key-value vs elements)
17. **Collections.sort() requirement?** - Elements must be Comparable or provide Comparator
18. **Iterator.remove() advantage?** - Safe way to remove during iteration
19. **Comparator.comparing()?** - Static method to create comparator (Java 8+)
20. **Can modify collection during iteration?** - Only via Iterator.remove() for fail-fast collections
