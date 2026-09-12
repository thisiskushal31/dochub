# Pattern matching

[← Back to Elixir](./README.md)

In Elixir, `=` is the **match operator**, not only assignment. The right-hand side is evaluated, then the left-hand side is **matched** against that value. If the match succeeds, any variables on the left are bound; if it fails, a `MatchError` is raised. Pattern matching is used everywhere: variable binding, function clauses, and destructuring of lists, tuples, and maps. This topic covers the basics and the **pin operator** (`^`) so you can match against existing values without rebinding.

---

## The match operator

When you write `x = 1`, Elixir binds `x` to `1`. But matching is symmetric in the sense that the left side must be compatible with the right. So `1 = x` is valid when `x` is already `1`; it asserts that the right-hand value is `1`. If the two sides cannot match, you get a `MatchError`.

```elixir
x = 1
# => 1
1 = x
# => 1
2 = x
# => ** (MatchError) no match of right hand side value: 1
```

Only the left side can have unbound variables that get bound; the right side is always evaluated first. So `1 = unknown` would try to use `unknown` as a value and fail if `unknown` is not defined.

---

## Pattern matching on tuples and lists

You can destructure tuples and lists on the left of `=`:

```elixir
{a, b, c} = {:hello, "world", 42}
# => {:hello, "world", 42}
a
# => :hello
b
# => "world"
```

If the structure does not match (e.g. different tuple size or list shape), a `MatchError` is raised. You can also match on specific values. That is common for result tuples:

```elixir
{:ok, result} = {:ok, 13}
# => {:ok, 13}
result
# => 13
{:ok, result} = {:error, :oops}
# => ** (MatchError) no match of right hand side value: {:error, :oops}
```

So the pattern both destructures and asserts: “this must be an `:ok` tuple with one element.”

For lists, you can match the head and tail:

```elixir
[head | tail] = [1, 2, 3]
# => [1, 2, 3]
head
# => 1
tail
# => [2, 3]
```

The same `[head | tail]` syntax is used to **build** lists (prepend): `[0 | [1, 2, 3]]` => `[0, 1, 2, 3]`. You cannot match `[head | tail]` on an empty list; that raises `MatchError`.

---

## Ignoring values with underscore

Use `_` when you do not care about a value in a pattern. It matches anything and cannot be read from.

```elixir
[head | _] = [1, 2, 3]
# => [1, 2, 3]
head
# => 1
```

If a variable appears more than once in a pattern, all occurrences must match the same value: `{x, x} = {1, 1}` works; `{x, x} = {1, 2}` raises `MatchError`. You cannot call functions on the left side of `=`; the left side is a pattern, not an expression. The same pattern-matching rules apply in **function heads** (so different clauses are chosen by pattern and guards), in **case** and **cond**, and in **receive** (message handling). That consistency is what makes Elixir code predictable: you see a pattern and you know how the value is destructured and what is required for the match to succeed.

---

## The pin operator

Variables in Elixir can be rebound: `x = 1` then `x = 2` is allowed. Sometimes you want to **match against** the current value of a variable without rebinding it. Use the **pin operator** `^` for that.

```elixir
x = 1
# => 1
^x = 2
# => ** (MatchError) no match of right hand side value: 2
```

So `^x` means “match as the value that `x` has now.” You can pin inside larger patterns:

```elixir
x = 1
[^x, 2, 3] = [1, 2, 3]
# => [1, 2, 3]
{y, ^x} = {2, 1}
# => {2, 1}
y
# => 2
```

Pattern matching and the pin operator are the basis for control flow (case, cond, function clauses) and for safe destructuring of data in all engineering contexts—from application code to parsing logs or config in DevOps and security tooling.

---

## Further reading

- [Pattern matching — HexDocs](https://hexdocs.pm/elixir/pattern-matching.html)
- [Kernel.SpecialForms — =/2, ^/1](https://hexdocs.pm/elixir/Kernel.SpecialForms.html)
