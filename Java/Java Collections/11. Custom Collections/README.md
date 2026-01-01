# 📝 Custom Collections - Quick Interview Notes

## 🎯 Why Custom Collections?

**Reasons:**
- **Specialized behavior** - Domain-specific logic
- **Performance optimization** - Tailored to use case
- **Learning internals** - Understand how collections work
- **Constraints** - Size limits, validation, etc.

---

## 📝 Creating Custom ArrayList

**Basic Implementation:**
```java
public class CustomArrayList<E> {
    private static final int DEFAULT_CAPACITY = 10;
    private Object[] elements;
    private int size;
    
    public CustomArrayList() {
        elements = new Object[DEFAULT_CAPACITY];
        size = 0;
    }
    
    public CustomArrayList(int initialCapacity) {
        if(initialCapacity < 0) {
            throw new IllegalArgumentException("Illegal Capacity: " + initialCapacity);
        }
        elements = new Object[initialCapacity];
        size = 0;
    }
    
    public boolean add(E element) {
        ensureCapacity();
        elements[size++] = element;
        return true;
    }
    
    @SuppressWarnings("unchecked")
    public E get(int index) {
        checkIndex(index);
        return (E) elements[index];
    }
    
    public E set(int index, E element) {
        checkIndex(index);
        E oldValue = get(index);
        elements[index] = element;
        return oldValue;
    }
    
    public E remove(int index) {
        checkIndex(index);
        E oldValue = get(index);
        
        // Shift elements left
        int numMoved = size - index - 1;
        if(numMoved > 0) {
            System.arraycopy(elements, index + 1, elements, index, numMoved);
        }
        elements[--size] = null;  // Clear for GC
        return oldValue;
    }
    
    public int size() {
        return size;
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    public void clear() {
        for(int i = 0; i < size; i++) {
            elements[i] = null;
        }
        size = 0;
    }
    
    private void ensureCapacity() {
        if(size == elements.length) {
            int newCapacity = elements.length + (elements.length >> 1);  // 1.5x
            elements = Arrays.copyOf(elements, newCapacity);
        }
    }
    
    private void checkIndex(int index) {
        if(index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }
    }
}
```

**Key Points:**
- **Array backing** - Object[] internal storage
- **Dynamic resizing** - Grow by 1.5x (50%)
- **Type safety** - Generics with casting
- **Null clearing** - Set to null for GC

---

## 🗂️ Creating Custom HashMap

**Basic Implementation:**
```java
public class CustomHashMap<K, V> {
    private static final int DEFAULT_CAPACITY = 16;
    private static final float DEFAULT_LOAD_FACTOR = 0.75f;
    
    private Entry<K, V>[] table;
    private int size;
    private int threshold;
    private float loadFactor;
    
    static class Entry<K, V> {
        final K key;
        V value;
        Entry<K, V> next;
        final int hash;
        
        Entry(int hash, K key, V value, Entry<K, V> next) {
            this.hash = hash;
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }
    
    @SuppressWarnings("unchecked")
    public CustomHashMap() {
        this.loadFactor = DEFAULT_LOAD_FACTOR;
        this.threshold = (int) (DEFAULT_CAPACITY * DEFAULT_LOAD_FACTOR);
        this.table = new Entry[DEFAULT_CAPACITY];
        this.size = 0;
    }
    
    public V put(K key, V value) {
        int hash = hash(key);
        int index = indexFor(hash, table.length);
        
        // Check if key exists
        for(Entry<K, V> e = table[index]; e != null; e = e.next) {
            if(e.hash == hash && Objects.equals(key, e.key)) {
                V oldValue = e.value;
                e.value = value;
                return oldValue;
            }
        }
        
        // Add new entry
        addEntry(hash, key, value, index);
        return null;
    }
    
    public V get(K key) {
        int hash = hash(key);
        int index = indexFor(hash, table.length);
        
        for(Entry<K, V> e = table[index]; e != null; e = e.next) {
            if(e.hash == hash && Objects.equals(key, e.key)) {
                return e.value;
            }
        }
        return null;
    }
    
    public V remove(K key) {
        int hash = hash(key);
        int index = indexFor(hash, table.length);
        
        Entry<K, V> prev = null;
        Entry<K, V> e = table[index];
        
        while(e != null) {
            if(e.hash == hash && Objects.equals(key, e.key)) {
                if(prev == null) {
                    table[index] = e.next;
                } else {
                    prev.next = e.next;
                }
                size--;
                return e.value;
            }
            prev = e;
            e = e.next;
        }
        return null;
    }
    
    public int size() {
        return size;
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    private void addEntry(int hash, K key, V value, int bucketIndex) {
        Entry<K, V> e = table[bucketIndex];
        table[bucketIndex] = new Entry<>(hash, key, value, e);
        
        if(++size >= threshold) {
            resize(2 * table.length);
        }
    }
    
    @SuppressWarnings("unchecked")
    private void resize(int newCapacity) {
        Entry<K, V>[] oldTable = table;
        table = new Entry[newCapacity];
        threshold = (int) (newCapacity * loadFactor);
        size = 0;
        
        for(Entry<K, V> e : oldTable) {
            while(e != null) {
                put(e.key, e.value);
                e = e.next;
            }
        }
    }
    
    private int hash(K key) {
        if(key == null) return 0;
        int h = key.hashCode();
        return h ^ (h >>> 16);  // XOR with shifted bits
    }
    
    private int indexFor(int hash, int length) {
        return hash & (length - 1);  // Same as hash % length for power of 2
    }
}
```

**Key Points:**
- **Buckets** - Array of Entry chains
- **Separate chaining** - Linked list for collisions
- **Hash function** - XOR with shifted bits
- **Load factor** - Resize when 75% full
- **Indexing** - Bitwise AND for power-of-2 capacity

---

## 🔗 Creating Custom LinkedList

**Basic Implementation:**
```java
public class CustomLinkedList<E> {
    private Node<E> head;
    private Node<E> tail;
    private int size;
    
    private static class Node<E> {
        E data;
        Node<E> next;
        Node<E> prev;
        
        Node(Node<E> prev, E data, Node<E> next) {
            this.prev = prev;
            this.data = data;
            this.next = next;
        }
    }
    
    public CustomLinkedList() {
        head = null;
        tail = null;
        size = 0;
    }
    
    public void add(E element) {
        addLast(element);
    }
    
    public void addFirst(E element) {
        Node<E> newNode = new Node<>(null, element, head);
        if(head == null) {
            head = tail = newNode;
        } else {
            head.prev = newNode;
            head = newNode;
        }
        size++;
    }
    
    public void addLast(E element) {
        Node<E> newNode = new Node<>(tail, element, null);
        if(tail == null) {
            head = tail = newNode;
        } else {
            tail.next = newNode;
            tail = newNode;
        }
        size++;
    }
    
    public E get(int index) {
        return node(index).data;
    }
    
    public E set(int index, E element) {
        Node<E> node = node(index);
        E oldValue = node.data;
        node.data = element;
        return oldValue;
    }
    
    public E remove(int index) {
        return unlink(node(index));
    }
    
    public E removeFirst() {
        if(head == null) {
            throw new NoSuchElementException();
        }
        return unlink(head);
    }
    
    public E removeLast() {
        if(tail == null) {
            throw new NoSuchElementException();
        }
        return unlink(tail);
    }
    
    public int size() {
        return size;
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    private Node<E> node(int index) {
        checkIndex(index);
        
        // Search from head or tail (whichever is closer)
        if(index < (size >> 1)) {
            Node<E> x = head;
            for(int i = 0; i < index; i++) {
                x = x.next;
            }
            return x;
        } else {
            Node<E> x = tail;
            for(int i = size - 1; i > index; i--) {
                x = x.prev;
            }
            return x;
        }
    }
    
    private E unlink(Node<E> node) {
        E element = node.data;
        Node<E> next = node.next;
        Node<E> prev = node.prev;
        
        if(prev == null) {
            head = next;
        } else {
            prev.next = next;
            node.prev = null;
        }
        
        if(next == null) {
            tail = prev;
        } else {
            next.prev = prev;
            node.next = null;
        }
        
        node.data = null;
        size--;
        return element;
    }
    
    private void checkIndex(int index) {
        if(index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }
    }
}
```

**Key Points:**
- **Doubly-linked** - prev/next pointers
- **Head & tail** - Fast access to both ends
- **Bidirectional search** - Start from closer end
- **Unlinking** - Proper cleanup of references

---

## 🔨 Implementing Collection Interface

**Full Implementation:**
```java
public class CustomCollection<E> implements Collection<E> {
    private Object[] elements;
    private int size;
    private static final int DEFAULT_CAPACITY = 10;
    
    public CustomCollection() {
        elements = new Object[DEFAULT_CAPACITY];
        size = 0;
    }
    
    @Override
    public boolean add(E e) {
        ensureCapacity();
        elements[size++] = e;
        return true;
    }
    
    @Override
    public boolean remove(Object o) {
        for(int i = 0; i < size; i++) {
            if(Objects.equals(o, elements[i])) {
                fastRemove(i);
                return true;
            }
        }
        return false;
    }
    
    @Override
    public boolean contains(Object o) {
        return indexOf(o) >= 0;
    }
    
    @Override
    public int size() {
        return size;
    }
    
    @Override
    public boolean isEmpty() {
        return size == 0;
    }
    
    @Override
    public void clear() {
        for(int i = 0; i < size; i++) {
            elements[i] = null;
        }
        size = 0;
    }
    
    @Override
    public Iterator<E> iterator() {
        return new Itr();
    }
    
    @Override
    public Object[] toArray() {
        return Arrays.copyOf(elements, size);
    }
    
    @Override
    @SuppressWarnings("unchecked")
    public <T> T[] toArray(T[] a) {
        if(a.length < size) {
            return (T[]) Arrays.copyOf(elements, size, a.getClass());
        }
        System.arraycopy(elements, 0, a, 0, size);
        if(a.length > size) {
            a[size] = null;
        }
        return a;
    }
    
    @Override
    public boolean containsAll(Collection<?> c) {
        for(Object e : c) {
            if(!contains(e)) {
                return false;
            }
        }
        return true;
    }
    
    @Override
    public boolean addAll(Collection<? extends E> c) {
        boolean modified = false;
        for(E e : c) {
            if(add(e)) {
                modified = true;
            }
        }
        return modified;
    }
    
    @Override
    public boolean removeAll(Collection<?> c) {
        boolean modified = false;
        Iterator<E> it = iterator();
        while(it.hasNext()) {
            if(c.contains(it.next())) {
                it.remove();
                modified = true;
            }
        }
        return modified;
    }
    
    @Override
    public boolean retainAll(Collection<?> c) {
        boolean modified = false;
        Iterator<E> it = iterator();
        while(it.hasNext()) {
            if(!c.contains(it.next())) {
                it.remove();
                modified = true;
            }
        }
        return modified;
    }
    
    private class Itr implements Iterator<E> {
        int cursor = 0;
        int lastRet = -1;
        
        @Override
        public boolean hasNext() {
            return cursor != size;
        }
        
        @Override
        @SuppressWarnings("unchecked")
        public E next() {
            if(cursor >= size) {
                throw new NoSuchElementException();
            }
            lastRet = cursor;
            return (E) elements[cursor++];
        }
        
        @Override
        public void remove() {
            if(lastRet < 0) {
                throw new IllegalStateException();
            }
            fastRemove(lastRet);
            cursor = lastRet;
            lastRet = -1;
        }
    }
    
    private void ensureCapacity() {
        if(size == elements.length) {
            int newCapacity = elements.length + (elements.length >> 1);
            elements = Arrays.copyOf(elements, newCapacity);
        }
    }
    
    private void fastRemove(int index) {
        int numMoved = size - index - 1;
        if(numMoved > 0) {
            System.arraycopy(elements, index + 1, elements, index, numMoved);
        }
        elements[--size] = null;
    }
    
    private int indexOf(Object o) {
        for(int i = 0; i < size; i++) {
            if(Objects.equals(o, elements[i])) {
                return i;
            }
        }
        return -1;
    }
}
```

**Key Implementation Points:**
- **All Collection methods** - Must implement all
- **Iterator** - Inner class for iteration
- **toArray()** - Two variants
- **Bulk operations** - addAll, removeAll, retainAll
- **Iterator.remove()** - Must support if collection modifiable

---

## 🎯 Advanced Custom Collection Features

### 1️⃣ Thread-Safe Custom Collection
```java
public class SynchronizedCustomList<E> {
    private final List<E> list = new ArrayList<>();
    private final Object lock = new Object();
    
    public boolean add(E e) {
        synchronized(lock) {
            return list.add(e);
        }
    }
    
    public E get(int index) {
        synchronized(lock) {
            return list.get(index);
        }
    }
    
    // ... other methods
}
```

### 2️⃣ Bounded Collection
```java
public class BoundedList<E> extends ArrayList<E> {
    private final int maxSize;
    
    public BoundedList(int maxSize) {
        this.maxSize = maxSize;
    }
    
    @Override
    public boolean add(E e) {
        if(size() >= maxSize) {
            throw new IllegalStateException("List is full");
        }
        return super.add(e);
    }
}
```

### 3️⃣ Immutable Collection
```java
public class ImmutableList<E> implements List<E> {
    private final List<E> list;
    
    public ImmutableList(List<E> list) {
        this.list = new ArrayList<>(list);
    }
    
    @Override
    public boolean add(E e) {
        throw new UnsupportedOperationException();
    }
    
    @Override
    public E get(int index) {
        return list.get(index);
    }
    
    // ... other read-only methods
}
```

### 4️⃣ Validated Collection
```java
public class ValidatedList<E> extends ArrayList<E> {
    private final Predicate<E> validator;
    
    public ValidatedList(Predicate<E> validator) {
        this.validator = validator;
    }
    
    @Override
    public boolean add(E e) {
        if(!validator.test(e)) {
            throw new IllegalArgumentException("Invalid element");
        }
        return super.add(e);
    }
}
```

---

## 🎯 Quick Interview Points

1. **Why create custom collection?** - Specialized behavior, optimization, learning
2. **ArrayList internal?** - Object[] array
3. **ArrayList growth factor?** - 1.5x (50% increase)
4. **HashMap internal?** - Array of Entry chains
5. **HashMap load factor?** - 0.75
6. **HashMap index calculation?** - hash & (length - 1)
7. **LinkedList node structure?** - data, next, prev
8. **LinkedList head/tail?** - Fast access to both ends
9. **Collection interface methods?** - add, remove, contains, size, isEmpty, clear, iterator
10. **Iterator.remove() requirement?** - Must be supported if modifiable
11. **toArray() variants?** - toArray() and toArray(T[] a)
12. **ensureCapacity() when?** - Before adding when full
13. **Why clear references?** - Allow garbage collection
14. **HashMap hash function?** - XOR with shifted bits (hash ^ (hash >>> 16))
15. **HashMap collision handling?** - Separate chaining (linked list)
16. **LinkedList bidirectional search?** - Start from closer end (head or tail)
17. **Why override equals() and hashCode()?** - For HashMap/HashSet correctness
18. **What is fail-fast iterator?** - Throws ConcurrentModificationException
19. **How to make thread-safe?** - Synchronized methods or use locks
20. **Bounded collection use?** - Enforce size limits
21. **Immutable collection use?** - Prevent modifications
22. **Validated collection use?** - Enforce constraints
23. **System.arraycopy() benefit?** - Faster than manual loop
24. **Why store hash in Entry?** - Avoid recalculating during rehash
25. **Power of 2 capacity benefit?** - Fast modulo using bitwise AND
