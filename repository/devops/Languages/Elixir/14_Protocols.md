# Protocols

[← Back to Elixir](./README.md)

**Protocols** are Elixir’s mechanism for **polymorphic** behavior: one interface (a set of functions) with different implementations per type. Built-in protocols include **Enumerable**, **String.Chars** (for interpolation and `to_string`), **Inspect** (for IEx and debugging), and **Collectable** (for building collections with `into`). This topic explains how to use protocols and how to implement one for your own types (e.g. structs) so they work with the standard library and with pattern matching.

---

## What protocols are

A protocol defines a set of function signatures (name and arity). Any type (usually a struct) can implement the protocol by providing those functions. When you call a protocol function, the implementation is chosen at runtime based on the type of the first argument. So one function name can behave differently for different data types—polymorphism without classes.

---

## Example: implementing a protocol for a struct

Suppose you have a struct and want it to be printable or to participate in `Enum`. You implement the relevant protocol. For example, `String.Chars` has one callback, `to_string/1`. Implementing it allows your struct to be used in `"#{my_struct}"` and with `to_string/1`.

```elixir
defmodule User do
  defstruct [:name, :email]
end

defimpl String.Chars, for: User do
  def to_string(%User{name: name, email: email}) do
    "#{name} <#{email}>"
  end
end
to_string(%User{name: "Alice", email: "a@b.com"})
# => "Alice <a@b.com>"
```

Other common protocols: **Inspect** (for pretty-printing in IEx and logs), **Enumerable** (for Enum and Stream), **Collectable** (for `into`). The protocol documentation lists the required callbacks.

---

## Protocols and structs

Structs are the typical type used with protocols because they have a single “type” (the struct module). You can also implement protocols for built-in types (e.g. for a custom Inspect for a tuple) in limited cases. When you define a struct that should work with Enum, Inspect, or string interpolation, add the corresponding `defimpl` in the same project.

---

## Built-in protocols

- **Enumerable** — `reduce/3` and others; used by Enum and Stream.
- **String.Chars** — `to_string/1`; used in interpolation and `Kernel.to_string/1`.
- **Inspect** — `inspect/2`; used by IEx and `inspect/1`.
- **Collectable** — `into/1`; used by `for ... into:` and `Enum.into/2`.
- **List.Chars** — `to_charlist/1`; used when a charlist is required.

Implementing these for your structs makes them behave like built-in types in pipelines, logging, and debugging—useful for application and DevOps tooling.

---

## Further reading

- [Protocols — HexDocs](https://hexdocs.pm/elixir/protocols.html)
- [Protocol module](https://hexdocs.pm/elixir/Protocol.html)
- [String.Chars, Inspect, Enumerable](https://hexdocs.pm/elixir/)
