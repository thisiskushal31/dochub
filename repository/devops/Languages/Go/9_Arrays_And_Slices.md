# Arrays and slices

[← Back to Go](./README.md)

An **array** is a numbered sequence of elements of a single type; the **length** is part of the type and fixed at compile time. A **slice** is a descriptor for a contiguous segment of an underlying array: it has a **length** and a **capacity** and can grow (up to capacity) by appending. Slices are the usual way to work with sequences in Go; arrays are used when the length is fixed and known. This section covers array and slice types, literals, indexing, slicing, and **append** so you can use them correctly.

**Why arrays and slices matter.** Most sequential data in Go is held in slices. Slices are reference-like: they share storage with their underlying array and with other slices of the same array. Understanding length vs capacity and how **append** can reallocate helps you avoid bugs and write efficient code. Arrays are used for fixed-size buffers and as the backing store for slices created with **make**.

**Array type and literal.** **ArrayType** = `[` ArrayLength `]` ElementType. **ArrayLength** = Expression (must be non-negative constant representable by **int**). The length is part of the type. An array type **T** may not have an element of type **T** or of a type containing **T** if those containing types are only arrays or structs (pointers, slices, or func types break the cycle). Array literal: elements may have optional keys (index); **...** as length means max index + 1. Arrays are comparable element-wise; passed by value. **len(a)** gives length; indices 0 through **len(a)-1**.

**Slice type and value.** **SliceType** = `[ ]` ElementType. A slice is a descriptor for a contiguous segment of an underlying array; it has length and capacity. **nil** slice has length and capacity 0. **make([]T, length, capacity)** allocates a new hidden array and returns a slice referencing it; **capacity** is optional (defaults to length). The spec: **make([]T, n, m)** is equivalent to **new([m]T)[0:n]** — the slice shares no storage with other slices until you derive from it. A slice literal **[]T{x1, …}** is shorthand for an array literal plus slice **tmp[0:n]**.

**Indexing and slicing.** For a slice (or array) **s**, **s\[i]** is the element at index **i** (0 ≤ i < len(s)); a panic occurs if **i** is out of range. The **slice expression** **s\[low:high]** produces a new slice with elements from **low** to **high-1**; it shares the underlying array with **s**. Defaults: **low** defaults to 0, **high** to **len(s)**. The new slice’s length is **high - low**; its capacity is **cap(s) - low**. A **full slice expression** **s\[low:high:max]** sets the capacity to **max - low**. Slicing beyond **cap(s)** causes a panic.

**append.** The built-in **append(s, elements...)** appends elements to a slice. If the slice has enough capacity, **append** writes into the existing array and returns a slice that still shares it. If not, **append** allocates a new array, copies the existing elements and the new ones, and returns a slice that references the new array. You must assign the result: **s = append(s, x)**. **append** can grow a slice beyond its current capacity; the growth strategy is implementation-defined but typically doubles capacity when a new allocation is needed.

```go
a := [3]int{1, 2, 3}           // array of length 3
s := []int{1, 2, 3}            // slice backed by an array
s = append(s, 4)               // s is [1 2 3 4]; may have new backing array
t := s[1:3]                    // t shares backing with s; t is [2 3]
s[1] = 99                      // t[0] is now 99 (same backing array)
u := make([]int, 2, 4)         // length 2, capacity 4
u = append(u, 5, 6)            // no realloc; u is [0 0 5 6]
```

**Why this matters.** Slices are the primary collection type for ordered data. Sharing of the backing array means that sub-slices and the original slice can see each other’s updates to elements; that is useful but can surprise if you assume a copy. **append** can invalidate other slices that shared the old array when it reallocates. In DevOps and services, slices are used for buffers, lines of output, and lists of items; understanding length, capacity, and **append** avoids panics and unnecessary allocations.

---

## Further reading

- [The Go Programming Language Specification: Array types](https://go.dev/ref/spec#Array_types)
- [The Go Programming Language Specification: Slice types](https://go.dev/ref/spec#Slice_types)
- [Go Slices: usage and internals](https://go.dev/blog/go-slices-usage-and-internals)
