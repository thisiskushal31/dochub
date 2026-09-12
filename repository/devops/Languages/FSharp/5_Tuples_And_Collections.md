# Tuples and collections

[← Back to F#](./README.md)

**Tuples** group a fixed number of values of possibly different types; they are the simplest way to return or pass multiple values without defining a type. **Collections**—**lists**, **arrays**, and **sequences**—hold multiple elements of the same type. F# also has **Map** and **Set**. This section covers tuples and the main collection types, when to use which, and the most common operations so you can work with structured and bulk data correctly.

**Why tuples and collections matter.** Tuples appear everywhere for ad-hoc grouping and multiple return values. Lists and sequences are the standard way to represent ordered data in functional style; arrays are used when you need indexing, mutation, or .NET interop. Choosing the right collection (list vs array vs seq) affects performance and semantics; the list and sequence modules are used in almost every non-trivial F# codebase.

**Tuples.** A tuple is written with commas: **(1, "hello")** has type **int \* string**. You can destructure with a tuple pattern: **let (a, b) = (1, 2)**. For pairs, **fst** and **snd** return the first and second element. Tuples are immutable. Use them for ad-hoc grouping and multiple return values; for more structure and named fields, use a record.

```fsharp
let pair = (10, "ten")
let (n, s) = pair
let first = fst pair   // 10
let second = snd pair   // "ten"
```

**Lists.** A **list** is an ordered, **immutable** sequence of elements of the same type. Syntax: **[1; 2; 3]** or **1 :: 2 :: 3 :: []**. The **cons** operator **::** adds an element to the **front**; the list is a linked structure, so prepending is O(1) and indexing by position is O(n). The **List** module provides **List.map**, **List.filter**, **List.fold**, **List.iter**, **List.tryFind**, **List.tryFindIndex**, and many others. Lists are the default choice for sequential data in F# when you do not need random access or mutation.

```fsharp
let nums = [1; 2; 3; 4]
let doubled = List.map (fun x -> x * 2) nums   // [2; 4; 6; 8]
let sum = List.fold (+) 0 nums                // 10
let head :: tail = nums   // head=1, tail=[2;3;4]
```

**Arrays.** **Arrays** are fixed-size, zero-based, **mutable** collections that occupy a contiguous block of memory. Syntax: **[| 1; 2; 3 |]**. Access and update with **arr.[i]** and **arr.[i] &lt;- value**. Use arrays when you need random access by index, in-place mutation, or compatibility with .NET APIs that expect **T[]**. Arrays are not lazy; the whole array is in memory.

```fsharp
let arr = [| 10; 20; 30 |]
arr.[1] <- 25   // mutable
let first = arr.[0]   // 10
```

**Sequences.** A **sequence** (**seq&lt;'T&gt;**), which is **IEnumerable&lt;T&gt;** in .NET, represents a logical series of elements; it is **lazy** and can be **infinite**. Create with **seq { ... }** (sequence expression), or from a list/array with **Seq.ofList** / **Seq.ofArray**. Use **Seq.take**, **Seq.takeWhile**, **Seq.map**, **Seq.filter**, and **Seq.toList** or **Seq.toArray** when you need to force evaluation. Sequences are the right choice for large or unbounded data and for chaining operations without materializing intermediate lists. Each time you iterate a sequence, the computation runs again unless you cache it (e.g. **Seq.cache** or convert to list).

```fsharp
let squares = seq { for i in 1..10 -> i * i }
squares |> Seq.take 3 |> Seq.toList   // [1; 4; 9]
let infinite = seq { while true do yield 1 }   // infinite; use with take
```

**List vs array vs sequence.** Use a **list** when you have a small or moderate number of elements and want immutability and functional style (cons, pattern matching). Use an **array** when you need indexing, mutation, or .NET array interop. Use a **sequence** when the data is large, unbounded, or produced on demand and you want to avoid allocating the full collection up front.

**Maps and sets.** **Map** is an immutable key-value structure (like a dictionary); **Set** is an immutable set of distinct elements. Both support functional updates: **Map.add**, **Map.remove**, **Set.add**, **Set.remove** return a new map or set. Create a map with **Map.ofList [ (k1, v1); (k2, v2) ]** or **Map [ (k1, v1); (k2, v2) ]**; create a set with **Set.ofList** or **Set [ a; b; c ]**. Use **Map.tryFind** for optional lookup; it returns **option&lt;'V&gt;**.

**Why this matters.** Tuples and lists are the bread and butter of F# data flow. Familiarity with **map**, **filter**, **fold**, and the difference between list (immutable, cons), array (mutable, indexed), and sequence (lazy) is essential for reading and writing real F# code. In DevOps and data scripts, lists and sequences are common for processing lines or batches; arrays appear when interfacing with .NET or when performance requires indexing.

---

## Further reading

- [Tuples (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/tuples)
- [Lists (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/lists)
- [Arrays (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/arrays)
- [Sequences (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/sequences)
- [F# collection types (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/fsharp-collection-types)
