# Maps

[← Back to Go](./README.md)

A **map** is an unordered collection of **key-value** pairs. The key type must be **comparable** (no slices, maps, or functions); the value type can be anything. Maps are reference types: a map variable holds a reference to the underlying hash table, and assignment or passing copies the reference, not the map. The zero value of a map type is **nil**; a nil map has no entries and must not be written to. This section covers map types, creation, access, and the “comma ok” idiom so you can use maps correctly.

**Why maps matter.** Maps are the standard way to represent key-value data (lookup tables, caches, grouping). They are used everywhere: config key-value pairs, HTTP headers, sets (map[T]bool or map[T]struct{}), and in-memory indexes. Understanding nil maps and the fact that maps are not comparable (you cannot use **==** on two maps) avoids panics and logic errors.

**Map type and creation.** **MapType** = `map` `[` KeyType `]` ElementType. The key type must be **comparable**: **==** and **!=** must be defined (so no slice, map, or function; if key is interface, comparison is defined at run time for the dynamic key). **make(map[K]V)** or **make(map[K]V, cap)** creates an initialized empty map; **cap** is a hint and does not bound size. Nil map has length 0; adding to nil map panics. The built-in **clear(m)** (Go 1.21+) removes all entries from **m**.

**Access and presence.** For a map **m**, **m\[key]** returns the value for **key** if present, or the **zero value** of the value type if not. So you cannot distinguish “absent” from “present with zero value” from the single-value form. The **two-value** form **v, ok := m\[key]** gives **ok == true** if the key was present and **false** otherwise. Use this when the value type has a meaningful zero value (e.g. int, string) and you need to know presence. Reading from a nil map returns the zero value (and **ok == false**); writing to a nil map causes a panic.

**Insert and delete.** Assign to **m\[key] = value** to insert or update. The built-in **delete(m, key)** removes the entry for **key**; it is a no-op if the key is absent or if **m** is nil. You cannot remove all entries by iterating and deleting in a way that depends on iteration order; use a new map or **clear** (Go 1.21+) if you need to reset.

**Iteration.** **for k, v := range m** iterates over the map; order is **not** specified and can vary between runs. If you only need keys, use **for k := range m**. If you only need values, use **for _, v := range m**. Adding or removing entries during iteration may or may not be observed; the behavior is not specified. So avoid mutating the map while ranging over it unless the semantics are intentional and documented.

```go
m := make(map[string]int)
m["a"] = 1
m["b"] = 2
v := m["a"]       // 1
v, ok := m["c"]   // v is 0, ok is false
delete(m, "b")
for k, v := range m {
	fmt.Println(k, v)
}
```

**Why this matters.** Maps are ubiquitous for lookup and grouping. Always use the two-value form when you need to distinguish “key missing” from “value is zero”. Never write to a nil map. In DevOps and services, maps are used for env-based config, headers, query params, and in-memory caches; thread safety requires a mutex or concurrent map (e.g. **sync.Map**) if multiple goroutines write.

---

## Further reading

- [The Go Programming Language Specification: Map types](https://go.dev/ref/spec#Map_types)
- [Effective Go: Maps](https://go.dev/doc/effective_go#maps)
