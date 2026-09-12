# case, cond, and if

[← Back to Elixir](./README.md)

Elixir uses **pattern matching** and **guards** for control flow instead of only “if” branches. **case** matches a value against several patterns; **cond** checks a series of conditions until one is truthy; **if** and **unless** handle a single condition. All of them are expressions and return a value. This topic shows how to choose and use them so your code stays clear and idiomatic.

---

## case

**case** takes an expression and matches its result against one or more **clauses**. Each clause has a pattern (and optional guards); the first matching clause runs and its result becomes the result of the `case`. If no clause matches, a `CaseClauseError` is raised.

```elixir
result = {:ok, 42}
case result do
  {:ok, value} -> "Got: #{value}"
  {:error, _}  -> "Error"
end
# => "Got: 42"
```

Clauses are separated by `->`; the right side can be a single expression or a `do`-block. The matching rules are the same as for `=` and for function clauses: patterns and guards are tried in order; the first that matches wins. Use `case` when you are branching on the **shape or value** of a single expression (e.g. result tuples, tags, or structs). Often the last clause uses `_` or a broad pattern to act as a default, or you explicitly raise to make unexpected values visible. If no clause matches, **CaseClauseError** is raised—so either cover all cases or use a catch-all.

---

## cond

**cond** does not take a value; it evaluates a list of conditions in order and runs the body of the first condition that is truthy (not `false` or `nil`). If none is truthy, `CondClauseError` is raised. Use **cond** when the decision is based on **multiple different conditions**, not on one value to pattern-match.

```elixir
x = 0
cond do
  x > 0 -> "positive"
  x < 0 -> "negative"
  true  -> "zero"
end
# => "zero"
```

It is common to use `true` as the last condition as a catch-all so that one branch always runs.

---

## if and unless

**if** and **unless** take one condition and one (or two) branches. They are expressions: the result is the result of the branch that runs.

```elixir
if 1 == 1 do
  "yes"
else
  "no"
end
# => "yes"

unless false do
  "run"
end
# => "run"
```

Use **if** when you have a single condition and two outcomes. For more than two branches or when the logic is “match this value,” **case** or **cond** is usually clearer. In guards and conditions, only `false` and `nil` are falsy; `0` and `""` are truthy.

---

## Summing up

- **case** — One expression; choose by pattern (and guards). Use for result tuples, tags, and any single value with multiple shapes.
- **cond** — Multiple conditions; first truthy wins. Use when the decision is “which condition holds?”
- **if** / **unless** — One condition, one or two branches. Use for simple yes/no logic.

All of them support **guards** (e.g. `when value > 0`) to add extra constraints; guards are covered in the language guide and in Topic 7 (anonymous functions) and Topic 10 (modules and functions).

---

## Further reading

- [case, cond, and if — HexDocs](https://hexdocs.pm/elixir/case-cond-and-if.html)
- [Patterns and guards — HexDocs](https://hexdocs.pm/elixir/patterns-and-guards.html)
