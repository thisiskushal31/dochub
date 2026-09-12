# Keyword lists and maps

[← Back to Elixir](./README.md)

**Keyword lists** and **maps** are the main key–value structures in Elixir. Keyword lists are lists of two-element tuples (usually `[{key, value}, ...]`) with atoms as keys; they keep order and allow duplicate keys, and are used for options and small config. **Maps** store key–value pairs with fast access by key; they are the usual choice for structured data, JSON-like records, and configuration. This topic covers when to use which, how to access and update them, and how they work with pattern matching and nesting.

---

## Keyword lists

A keyword list is a list of `{key, value}` pairs, typically with atoms as keys. Literals can use the shorthand `[key: value, ...]`, which is equivalent to `[{:key, value}, ...]`. They preserve order and allow duplicate keys; the first occurrence wins for functions like `Keyword.get/2`. Keyword lists are used for **options** (e.g. `if x, do: 1, else: 2`) and for small, ordered config where duplicate keys or order matter.

```elixir
opts = [a: 1, b: 2]
Keyword.get(opts, :a)
# => 1
[a: 1, a: 2]
# => [a: 1, a: 2]
```

The `Keyword` module provides get, put, delete, and other helpers. For large or frequently accessed data by key, maps are better.

---

## Maps (key–value pairs)

Maps use `%{}` and store unique keys with values. Keys can be any type; often atoms or strings are used. Access with `map.key` (atoms only) or `map[key]`; both raise if the key is missing unless you use `Map.get/3` or the `[]` access with a default. Maps are the standard for JSON-like data, API responses, and structured config.

```elixir
m = %{a: 1, "b" => 2}
m.a
# => 1
m["b"]
# => 2
Map.get(m, :c, 0)
# => 0
```

Updating a key with `%{map | key: new_value}` or `Map.put/3` returns a new map; the original is unchanged. Pattern matching on maps is common: `%{a: x}` matches any map with an `:a` key and binds `x`.

---

## Maps with predefined keys (structs)

When you need a fixed set of keys and possibly default values, you use **structs** (Topic 11). They are maps with a `__struct__` key and enforced keys. For ad hoc key–value data without a fixed shape, plain maps are the right choice.

---

## Nested data structures

Maps and keyword lists can be nested. Use `put_in/2`, `get_in/2`, `update_in/2`, and `Kernel.get_in/2` for nested access and updates so you avoid repetitive pattern matching. For config or API payloads, validate the shape and presence of keys at boundaries (e.g. when reading from env or the network) so the rest of the code can assume a known structure; that matters for both correctness and security.

---

## Further reading

- [Keyword lists and maps — HexDocs](https://hexdocs.pm/elixir/keyword-lists-and-maps.html)
- [Keyword module](https://hexdocs.pm/elixir/Keyword.html), [Map module](https://hexdocs.pm/elixir/Map.html)
