# D — Arrays and associative arrays

[← D README](./README.md)

**Arrays** in D come in **static** (fixed length), **dynamic** (length can change), and **slicing** forms. They are zero-indexed and have a **.length** property. **Associative arrays** (hashes) map keys to values. Arrays are central to most D programs; understanding slicing and bounds is important for correctness and performance.

**Why slicing?** Slices are a view into contiguous memory without copying; they share the same underlying storage and are the idiomatic way to pass array data. **Why associative arrays?** They provide fast key-value lookup without a separate library.

---

## Array kinds and declaration

Static arrays have a fixed length given at compile time; dynamic arrays have a length set at runtime. Array literals use `[ ... ]`. The type is **elementType[]** for dynamic and **elementType[n]** for static.

```d
int[] dynamic = [1, 2, 3];
int[5] static;
static[] = 0;  // default init
dynamic ~= 4;  // append
```

---

## Slicing and indexing

A **slice** is a range of elements (pointer + length). Slicing with `arr[a .. b]` gives elements from index `a` up to (not including) `b`. Indexing with `arr[i]` accesses one element. **.ptr** gives the pointer to the first element. Out-of-bounds access is undefined unless bounds checking is enabled.

```d
int[] arr = [10, 20, 30, 40, 50];
int[] sub = arr[1 .. 4];  // [20, 30, 40]
arr[0] = 99;
```

---

## Array operations

Concatenation uses **~**; **~=** appends in place. **.length** can be set for dynamic arrays (resize). **.dup** creates a copy. Vector operations and **capacity**/ **reserve** apply to dynamic arrays. Strings are arrays of **char** (UTF-8); **string** is an alias for **immutable(char)[]**.

---

## Associative arrays

An **associative array** maps keys to values. Syntax: **valueType[keyType]** or **valueType[keyType] aa;**. Indexing by key returns the value; missing keys can be handled with **.get** or **in**.

```d
int[string] counts;
counts["hello"] = 1;
counts["world"]++;
if ("hello" in counts)
    writeln(counts["hello"]);
```

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Arrays](https://dlang.org/spec/arrays.html)
- [D spec: Associative Arrays](https://dlang.org/spec/hash-map.html)
