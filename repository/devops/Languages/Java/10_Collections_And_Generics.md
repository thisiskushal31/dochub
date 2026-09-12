# Collections and generics

The Java Collections Framework provides a standard set of interfaces and implementations for storing and processing groups of objects. Generics let you write type-safe, reusable code by parameterizing types (e.g. `List<String>`). This topic covers the main collection interfaces (Collection, List, Set, Map), common implementations (ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap), iterators and iteration, and generics: generic classes and methods, type parameters, bounded type parameters, and how generics interact with collections. The goal is to choose the right collection type and use it safely with generics.

---

## Why a collections framework?

Before the framework, ad hoc types (Vector, Hashtable, etc.) had inconsistent APIs and no shared design. The framework unifies **interfaces** (contracts: List, Set, Map, etc.), **implementations** (ArrayList, HashMap, etc.), and **algorithms** (sorting, searching in java.util.Collections). You program to interfaces (e.g. `List<String>`) and pick an implementation (e.g. ArrayList) for performance or behavior. Implementations are reusable and interoperable; algorithms work on any implementation of the right interface.

---

## Collection and Map

**Collection** is the root interface for groups of elements. Subinterfaces: **List** (ordered, index-based, duplicates allowed), **Set** (no duplicates), **Queue** (FIFO or priority). Methods include add, remove, contains, size, isEmpty, iterator, and bulk operations (addAll, removeAll, etc.). **Map** is not a Collection; it stores key-value pairs. Keys are unique; each key maps to at most one value. Map provides put, get, remove, containsKey, keySet, values, entrySet. Collections and maps are in **java.util**; concurrent variants (e.g. ConcurrentHashMap) are in **java.util.concurrent**.

---

## List: ordered sequences

**List** extends Collection and adds index-based access: get(int), set(int, E), add(int, E), remove(int). Elements have a position; duplicates are allowed. **ArrayList** is implemented with a resizable array: O(1) get/set by index, O(1) amortized add at end, O(n) add/remove in the middle. **LinkedList** is a doubly linked list: O(1) add/remove at head/tail, O(n) access by index. Use ArrayList by default for general-purpose lists; use LinkedList when you frequently add/remove at the ends (e.g. queue/deque) and rarely need random access.

**ArrayList growth and capacity.** ArrayList has an internal capacity; when you add beyond it, the backing array is reallocated (typically 1.5× or 2× growth). If you know the final size, construct with `new ArrayList<>(initialCapacity)` to avoid repeated resizing. **ArrayDeque** is often a better choice than LinkedList for stack/queue usage: array-based, no per-element node overhead, and cache-friendly. List implementations are not thread-safe; for concurrent access use CopyOnWriteArrayList (read-heavy) or synchronize externally.

```java
List<String> a1 = new ArrayList<>();
a1.add("Zara");
a1.add("Mahnaz");
a1.add("Ayan");
a1.remove(1);
List<String> a2 = new LinkedList<>();
a2.add("Zara");
```

---

## Set: no duplicates

**Set** extends Collection and forbids duplicate elements (equality by equals()). **HashSet** uses a hash table: O(1) average add, contains, remove; iteration order is unspecified. **LinkedHashSet** keeps insertion order. **TreeSet** keeps elements sorted (natural order or a Comparator); O(log n) add, contains, remove. Use HashSet for general “unique” sets; TreeSet when you need order or range operations; LinkedHashSet when you need insertion order.

**Set and object equality.** For an object to behave correctly in a HashSet or as a HashMap key, it must consistently implement equals() and hashCode(): if equals(a, b) then hashCode(a) == hashCode(b). Mutating an element’s fields that affect equals/hashCode while it is in the set can break the contract and make the element “lost” or cause inconsistent behavior. TreeSet and TreeMap require either natural ordering (elements implement Comparable) or an explicit Comparator; they do not allow null if the comparator cannot compare null.

```java
Set<Integer> set = new HashSet<>();
set.add(34);
set.add(22);
set.add(10);
set.add(22);  // duplicate, no effect
// set: [34, 22, 10] (order not guaranteed)
TreeSet<Integer> sorted = new TreeSet<>(set);  // [10, 22, 34]
```

---

## Map: key-value storage

**Map** maps keys to values; each key appears at most once. **HashMap** is hash-based: O(1) average get, put, remove; iteration order unspecified. **LinkedHashMap** preserves insertion order of keys. **TreeMap** keeps keys sorted; O(log n) operations. Methods: put(k, v), get(k), remove(k), containsKey(k), keySet(), values(), entrySet(). keySet() and values() are views; changes to the map are reflected in the views. Use HashMap by default; TreeMap when you need sorted or range operations on keys.

**put and return value.** put(key, value) returns the previous value associated with the key, or null if there was none. So you can detect “first put” vs “replacement.” get(key) returns null if the key is absent—but also if the key is present and the value is null. Use containsKey(key) to distinguish, or getOrDefault(key, defaultValue). **ConcurrentHashMap** allows concurrent reads and writes without locking the whole map; use it when the map is shared across threads. Do not use null keys or values in ConcurrentHashMap.

```java
Map<String, String> m1 = new HashMap<>();
m1.put("Zara", "8");
m1.put("Mahnaz", "31");
m1.put("Ayan", "12");
m1.get("Zara");   // "8"
m1.remove("Daisy");
Map<String, String> m2 = new TreeMap<>(m1);  // keys sorted
```

---

## Iterators and iteration

`Iterator<E>` provides hasNext(), next(), and optionally remove(). Used to traverse a collection and optionally remove the current element safely. `ListIterator` (for List) adds previous(), add(), set(), and index methods for bidirectional traversal and modification. The enhanced for-loop (“for-each”) uses the iterator internally; do not modify the collection (other than via the iterator’s remove()) while iterating or you may get ConcurrentModificationException. To remove during iteration, use the iterator’s remove() or collect items to remove and remove after the loop.

**ConcurrentModificationException and fail-fast.** Most standard collections (ArrayList, HashMap, etc.) use fail-fast iterators: they detect structural modification (add, remove, or certain other changes) during iteration and throw ConcurrentModificationException. Structural modification means a change in the number of elements or (for some structures) the layout. Updating the value of an existing element (e.g. list.set(i, x), map.put(existingKey, newValue)) is not necessarily structural and may or may not throw depending on the implementation. **Weakly consistent** iterators (e.g. ConcurrentHashMap, CopyOnWriteArrayList) tolerate concurrent modification and may reflect some or no such changes; they never throw ConcurrentModificationException.

---

## Generics: type parameters

**Generics** allow classes, interfaces, and methods to be parameterized by type. You write `List<String>` instead of a raw List; the compiler enforces that only strings are added and get() returns String. This gives compile-time type safety and avoids casts. Type parameters are declared in angle brackets: `class Box<T>` or `<E> void printArray(E[] array)`. **T**, **E** are type variables (convention: T type, E element, K key, V value). At runtime, generic type information is erased (erasure); the JVM sees mostly raw types, so you cannot create new T() or use T in instanceof in a useful way.

**Type erasure in practice.** After erasure, `List<String>` and `List<Integer>` both become List at runtime. So you cannot overload methods by type parameter alone (e.g. void m(List<String> x) and void m(List<Integer> x) are the same signature after erasure). You cannot instantiate T (e.g. `new T()` is invalid) because T is unknown at runtime. Arrays of parameterized types are not allowed (e.g. `new List<String>[10]`) to preserve type safety; you use `List<String>[]` of lists or collections instead. Casts to parameterized types may trigger unchecked warnings because the runtime cannot verify the generic type.

---

## Generic classes and methods

A **generic class** declares one or more type parameters: `class Box<T> { private T t; void add(T t) { this.t = t; } T get() { return t; } }`. Use: `Box<Integer> box = new Box<>(); box.add(10);`. The diamond `<>` lets the compiler infer the type from the left-hand side. A **generic method** declares type parameters before the return type: `public static <E> void printArray(E[] inputArray) { for (E element : inputArray) System.out.println(element); }`. The compiler infers **E** from the argument. Type parameters can be used for parameters, return types, and local types.

```java
public class Box<T> {
    private T t;
    public void add(T t) { this.t = t; }
    public T get() { return t; }
}
Box<Integer> integerBox = new Box<>();
Box<String> stringBox = new Box<>();
integerBox.add(10);
stringBox.add("Hello");
```

---

## Bounded type parameters

You can restrict a type parameter to a subtype of a class or implementor of an interface: `<T extends Number>` or `<T extends Comparable<T>>`. Then inside the class or method you can call methods of that bound (e.g. T can be used where Number or Comparable is required). **extends** here means “extends or implements.” Multiple bounds: `<T extends A & B>` (T must extend A and implement B). Bounds enable generic code to use the API of the bound type while still being type-safe.

**Wildcards: ? extends and ? super.** In method parameters or field types you can use **? extends X** (upper bounded: unknown type that is a subtype of X) and **? super X** (lower bounded: unknown type that is a supertype of X). `List<? extends Number>` accepts lists of Number or any subclass (e.g. List<Integer>); you can read elements as Number but cannot add (except null), because the actual element type is unknown. `List<? super Integer>` accepts lists that can hold Integer (e.g. List<Integer>, List<Number>, List<Object>); you can add Integer but when reading you get Object. Use “extends” for producer (you read from it) and “super” for consumer (you write to it)—often summarized as PECS (Producer Extends, Consumer Super).

```java
public static <T extends Comparable<T>> T maximum(T x, T y, T z) {
    T max = x;
    if (y.compareTo(max) > 0) max = y;
    if (z.compareTo(max) > 0) max = z;
    return max;
}
maximum(3, 4, 5);           // Integer
maximum(6.6, 8.8, 7.7);     // Double
maximum("pear", "apple", "orange");  // String
```

---

## Generics and collections together

Collection interfaces and implementations are generic: `List<E>`, `Set<E>`, `Map<K,V>`, `ArrayList<E>`, `HashMap<K,V>`, etc. Use them with concrete types: `List<String>`, `Map<Integer, String>`. This avoids casting and catches type errors at compile time. Raw types (List, Map without type arguments) exist for backward compatibility but lose type safety; avoid them in new code. **Collections** utility class provides static methods: sort, binarySearch, reverse, shuffle, and methods to create unmodifiable or synchronized wrappers.

**Unmodifiable and immutable.** `Collections.unmodifiableList(list)` returns a view that throws UnsupportedOperationException on any mutating operation; the backing list is still mutable, so changes to the original are visible through the view. Java 9+ offers `List.of()`, `Set.of()`, `Map.of()` for truly immutable small collections (no backing collection to modify). For a fully immutable collection, either use the of() factories or ensure no reference to the backing collection escapes.

---

## Choosing a collection

- **Need order and index?** List. Prefer ArrayList unless you need frequent insert/delete at ends (then LinkedList or ArrayDeque).  
- **Need uniqueness?** Set. HashSet for speed, TreeSet for order, LinkedHashSet for insertion order.  
- **Need key-value lookup?** Map. HashMap by default, TreeMap for sorted keys, LinkedHashMap for insertion order.  
- **Need thread-safe access?** Use concurrent collections (ConcurrentHashMap, CopyOnWriteArrayList) or synchronize access; the legacy Vector and Hashtable are also thread-safe but often replaced by concurrent alternatives.  
- **Need null keys/values?** HashMap allows one null key and null values; TreeSet/TreeMap and some others may not allow null depending on implementation and comparator.

---

## Summary

The Collections Framework provides List, Set, Map and their implementations (ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap, etc.). Program to interfaces and choose implementations by access patterns, ordering, and concurrency needs (e.g. ConcurrentHashMap for shared maps). Use iterators or for-each; fail-fast iterators throw ConcurrentModificationException on structural modification during iteration—use iterator.remove() or weakly consistent collections where appropriate. Generics add type parameters for type-safe collections; understand erasure (no runtime type parameter), wildcards (extends/super, PECS), and bounded type parameters. Prefer List.of/Set.of/Map.of for immutable small collections; use unmodifiable wrappers when you need a read-only view of a mutable collection.

---

## Further reading

- [TutorialsPoint Java – Collections Framework](https://www.tutorialspoint.com/java/java_collections.htm)
- [TutorialsPoint Java – List Interface](https://www.tutorialspoint.com/java/java_list_interface.htm)
- [TutorialsPoint Java – Set Interface](https://www.tutorialspoint.com/java/java_set_interface.htm)
- [TutorialsPoint Java – Map Interface](https://www.tutorialspoint.com/java/java_map_interface.htm)
- [TutorialsPoint Java – Generics](https://www.tutorialspoint.com/java/java_generics.htm)
- [The Java™ Tutorials – Collections](https://docs.oracle.com/javase/tutorial/collections/)
- [The Java™ Tutorials – Generics](https://docs.oracle.com/javase/tutorial/java/generics/)
