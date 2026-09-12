# Recursion and enumerables

[← Back to Elixir](./README.md)

In Elixir there are no classic “for” or “while” loops; **recursion** is the way to iterate. You recurse on the tail of a list or on a reduced value until a base case stops the recursion. The **Enum** module wraps this pattern for lists and other collections so you can use `map`, `reduce`, `filter`, and similar operations without writing recursion by hand. This topic introduces recursion on lists, reduce and map algorithms, and the **Enumerable** protocol so you can read and write idiomatic Elixir.

---

## Loops through recursion

A typical list recursion has a base case (e.g. empty list) and a recursive case: process the head, then recurse on the tail. The result is built in the recursive calls (e.g. consing onto an accumulator).

```elixir
defmodule MyList do
  def sum([]), do: 0
  def sum([head | tail]) do
    head + sum(tail)
  end
end
MyList.sum([1, 2, 3])
# => 6
```

Execution flows as: **sum_list([1,2,3], 0)** → **sum_list([2,3], 1)** → **sum_list([3], 3)** → **sum_list([], 6)** → returns **6**. The recursive call is the last operation (tail position), so the BEAM applies tail-call optimization and the stack does not grow. For a "map" style (e.g. double each element), you would build a new list by consing in the recursive case (**[head * 2 | double_each(tail)]**); that form is not tail-recursive because work happens after the recursive call returns. Tail recursion keeps the stack constant: the recursive call is the last thing the function does, and the compiler can optimize it to a loop. Accumulators (e.g. passing a “result so far” argument) are used to make recursion tail-recursive when you are building a list or a single value.

---

## Reduce and map algorithms

**Reduce** (fold) traverses a collection and combines each element into a single value (e.g. sum). **Map** produces a new collection by applying a function to each element. Both can be implemented with recursion; in practice you call `Enum.reduce/3` and `Enum.map/2`. The capture syntax `&(&1 * 2)` is shorthand for `fn x -> x * 2 end`; `&+/2` captures the `+` function with arity 2.

```elixir
Enum.reduce([1, 2, 3], 0, fn x, acc -> x + acc end)
# => 6
Enum.reduce([1, 2, 3], 0, &+/2)
# => 6
Enum.map([1, 2, 3], &(&1 * 2))
# => [2, 4, 6]
```

Many other operations (filter, find, take, join) are built on reduce or on the Enumerable protocol. Understanding reduce and recursion helps when you need a custom traversal or when debugging Enum-based code.

---

## Enumerables

The **Enumerable** protocol is implemented by lists, ranges, maps (as key–value pairs), and other collections. That is why the same `Enum` functions work on different types. Streams (Topic 13) also implement Enumerable but produce values lazily. When you pass a collection to `Enum.map/2` or `Enum.into/2`, the protocol is used under the hood. Implementing the protocol for your own type (e.g. a custom collection) is an advanced topic; for most code, using `Enum` and `Stream` is enough.

---

## Further reading

- [Recursion — HexDocs](https://hexdocs.pm/elixir/recursion.html)
- [Enumerables and Streams — HexDocs](https://hexdocs.pm/elixir/enumerables-and-streams.html)
- [Enum module](https://hexdocs.pm/elixir/Enum.html), [Enumerable protocol](https://hexdocs.pm/elixir/Enumerable.html)
