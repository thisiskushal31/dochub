# Collections and sequences

[← Back to Kotlin](./README.md)

The Kotlin standard library provides list, set, and map types with read-only and mutable variants. Read-only interfaces expose only reading and iteration; mutable interfaces add operations to add, remove, or update elements. Collections are generic over element type and support a wide set of operations (filter, map, fold, and others). Sequences offer lazy, step-by-step processing and can avoid building intermediate collections. This topic covers collection types, construction, common operations, and when to use sequences so you can work with multi-element data efficiently.

## Collection types

Kotlin models each collection kind with a read-only interface and a mutable interface. The read-only type is used when you do not need to change the collection; the mutable type extends it with write operations. Prefer exposing read-only types in APIs and use mutable types only where you need to modify the collection.

**List** stores elements in order and supports access by index. Duplicates and nulls are allowed. The default mutable implementation is `ArrayList`.

**Set** stores unique elements; order is generally not defined. The default mutable implementation preserves insertion order; alternatives like `HashSet` do not.

**Map** stores key–value pairs; keys are unique. It is not a subtype of `Collection` but is part of the collection types. The default mutable implementation preserves insertion order when iterating.

Read-only collection types are covariant: if `Rectangle` extends `Shape`, you can use a `List<Rectangle>` where a `List<Shape>` is expected. Mutable collections are not covariant, so you cannot pass a `MutableList<Rectangle>` where a `MutableList<Shape>` is required; that would allow inserting other `Shape` subtypes and break type safety.

```kotlin
val numbers = listOf("one", "two", "three", "four")
println(numbers.size)
println(numbers[2])
val mutable = mutableListOf(1, 2, 3)
mutable.add(4)
mutable[0] = 0
```

A mutable collection can be stored in a `val`: the reference does not change, but the contents can. Using `val` for the reference helps avoid accidentally reassigning the variable.

## Constructing collections

Create lists and sets with `listOf()`, `setOf()`, `mutableListOf()`, and `mutableSetOf()`. For empty collections, specify the type: `mutableListOf<String>()`. Maps use `mapOf()` and `mutableMapOf()`; key–value pairs are often written with the `to` infix function: `mapOf("a" to 1, "b" to 2)`.

Builder functions `buildList()`, `buildSet()`, and `buildMap()` create a mutable collection inside a block and return a read-only collection with the same elements. For lists, `List(size) { index -> value }` creates a list of a given size using an initializer.

```kotlin
val map = buildMap {
    put("one", 1)
    put("two", 2)
}
val doubled = List(5) { it * 2 }  // [0, 2, 4, 6, 8]
```

Copying functions such as `toList()`, `toMutableList()`, `toSet()`, and `toMutableSet()` produce a new collection with the same elements (shallow copy). They snapshot the current state; later changes to the original do not affect the copy. Assigning an existing collection to a variable creates another reference to the same instance, not a copy. To restrict mutability at the type level, you can assign a `MutableList` to a variable of type `List`; the variable then cannot be used to modify the collection.

## Common operations

Most operations return a new collection or a value and do not change the original. Filtering (e.g. `filter`, `filterNot`) produces a new collection of elements that match a predicate. Transformations (e.g. `map`, `mapNotNull`) produce a new collection from a transformation. Aggregate operations (e.g. `sum()`, `count()`, `fold()`, `reduce()`) compute a single value. You also have retrieval of single elements (`first()`, `last()`, `getOrNull()`), ordering (`sorted()`, `sortedBy()`), and grouping (`groupBy()`).

Functions with a `To` suffix (e.g. `filterTo()`, `mapTo()`) take a destination mutable collection and append results to it instead of returning a new collection; they return the destination, so you can create and fill it in one call.

```kotlin
val words = listOf("one", "two", "three", "four")
val longerThan3 = words.filter { it.length > 3 }
val lengths = words.map { it.length }
val total = words.fold(0) { acc, s -> acc + s.length }
```

For mutable collections, in-place operations exist (e.g. `sort()`, `add()`, `remove()`). There are also non-mutating variants that return a new collection (e.g. `sorted()` returns a new list). Choosing the right variant (mutating vs non-mutating) helps avoid accidental shared-state bugs when the same collection is used in multiple places or across coroutines.

## ArrayDeque

`ArrayDeque` is a double-ended queue: you can add or remove elements at both ends. It is implemented with a resizable array and can serve as a stack or a queue. Use `addFirst()` / `addLast()` and `removeFirst()` / `removeLast()` (or the property forms `first` / `last`).

## Sequences

A **sequence** (`Sequence<T>`) does not hold elements; it produces them when iterated. Processing is **lazy**: each step (e.g. filter, map) is applied per element as they are consumed, and intermediate collections are not created. That can reduce memory and work when you have long or infinite streams of data or when you stop early (e.g. with `take(n)`).

Create a sequence with `sequenceOf(...)`, with `list.asSequence()`, or with `generateSequence(seed) { next -> ... }` (generation stops when the function returns `null`). The `sequence { }` builder uses `yield()` and `yieldAll()` to produce elements.

```kotlin
val seq = sequenceOf(1, 2, 3, 4)
val fromList = listOf(1, 2, 3).asSequence()
val odds = generateSequence(1) { it + 2 }.take(5).toList()
```

Operations on sequences are either **intermediate** (return another sequence, e.g. `map`, `filter`, `take`) or **terminal** (produce a result or side effect, e.g. `toList()`, `sum()`, `forEach()`). Only terminal operations trigger evaluation. With sequences, the order of execution is per element: for each item, the full chain (filter then map, etc.) runs before moving to the next item. With collections, each operation runs over the whole collection before the next step. For small collections or simple pipelines, the overhead of sequences may not pay off; use them when laziness or per-element processing is beneficial (e.g. large data, early termination, or chained steps that reduce the number of elements).

## Ranges and progressions

Ranges (e.g. `1..10`, `1 until 10`, `10 downTo 1 step 2`) are covered in the control-flow topic. They implement a progression of values and work with `for` loops and the `in` operator. Numeric ranges are often used with collection operations (e.g. indices) and with sequences when you need bounded or unbounded numeric streams.

Using the right collection type and choosing between eager collections and lazy sequences helps keep code clear and efficient. The next topic covers lambdas and higher-order functions, which are used throughout the collection API.

---

## Further reading

- [Collections overview](https://kotlinlang.org/docs/collections-overview.html)
- [Constructing collections](https://kotlinlang.org/docs/constructing-collections.html)
- [Collection operations overview](https://kotlinlang.org/docs/collection-operations.html)
- [Sequences](https://kotlinlang.org/docs/sequences.html)
- [Ranges and progressions](https://kotlinlang.org/docs/ranges.html)
