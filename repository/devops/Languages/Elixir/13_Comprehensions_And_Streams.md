# Comprehensions and streams

[← Back to Elixir](./README.md)

**Comprehensions** provide a concise way to build a collection from one or more **generators** (e.g. “for each element in this list”) and optional **filters**. **Streams** are lazy enumerables: they represent a pipeline of operations and only compute when the result is needed, which helps with large or infinite data. This topic covers the syntax of comprehensions, the difference between eager (Enum) and lazy (Stream) processing, and the **pipe operator** that chains transformations.

---

## Comprehensions

A comprehension has the form `for generator(s), [into: target], do: expression`. Generators are written as `x <- collection`; filters use `, when condition`. The result is a list by default, or another collection if you pass `into:` (e.g. a map or a stream).

```elixir
for n <- [1, 2, 3, 4], n > 2, do: n * 2
# => [6, 8]
for {k, v} <- %{a: 1, b: 2}, into: %{}, do: {k, v * 2}
# => %{a: 2, b: 4}
```

Multiple generators nest like nested loops; the rightmost varies fastest. Comprehensions are a good fit when you are building one collection from another with a simple condition and transformation; for more complex logic, `Enum` or explicit recursion may be clearer.

---

## Bitstring and :into options

Comprehensions can use **bitstring generators** (e.g. for parsing binary data) and the **:into** option to collect into a map, map set, or other collectable. The **:reduce** option (in newer Elixir) allows a single reduction step instead of building a list. These are useful for binary parsing and for building specific collection types without an extra pass.

---

## Eager vs lazy (Enum vs Stream)

**Enum** is eager: each function (e.g. `map`, `filter`) runs over the whole collection and produces a new collection. Chaining many Enum steps can create many intermediate lists. **Stream** is lazy: it builds a pipeline of operations and runs them only when the stream is consumed (e.g. by `Enum.into/2` or `Stream.run/1`). That reduces memory and allows working with infinite or very large data.

```elixir
1..1000
|> Stream.map(&(&1 * 2))
|> Stream.filter(&(&1 < 100))
|> Enum.to_list()
# => [2, 4, 6, ..., 98]
```

Use **Stream** when the collection is large, when you have a long pipeline, or when the source is infinite (e.g. a stream of events). Use **Enum** when the collection is small and you want simple, eager behavior.

---

## The pipe operator

The **pipe** `|>` passes the left-hand side as the first argument to the right-hand side. It is used to chain transformations so that data flows top to bottom instead of nesting function calls.

```elixir
[1, 2, 3, 4]
|> Enum.filter(&(&1 > 2))
|> Enum.map(&(&1 * 2))
# => [6, 8]
```

The right side can be a call like `Enum.map(&fun/1)` or an anonymous function; for the latter the piped value is the first argument. Piping keeps code readable and is idiomatic in Elixir for data pipelines and Plug/Phoenix.

---

## Further reading

- [Comprehensions — HexDocs](https://hexdocs.pm/elixir/comprehensions.html)
- [Enumerables and Streams — HexDocs](https://hexdocs.pm/elixir/enumerables-and-streams.html)
- [Stream module](https://hexdocs.pm/elixir/Stream.html)
