# List comprehensions

[← Back to Erlang](./README.md)

A **list comprehension** builds a list from one or more **generators** and optional **filters**. The syntax is `[ Expression || Generator1, Generator2, ..., Filter1, ... ]`. Each generator has the form `Pattern <- List` (or, in newer Erlang, `Pattern <:- List` for a strict generator). The expression is evaluated for each combination that satisfies the filters, and the results are collected in order.

**Generators and filters.** A generator produces values from a list (or other structure); a filter is a guard-like condition. Only combinations for which all filters succeed are included. So you get “the list of Expression such that Pattern is drawn from List and Filter1, Filter2, ... hold.”

```erlang
1> [X || X <- [1,2,a,3,4,b,5,6], X > 3].
[a,4,b,5,6]
2> [X || X <- [1,2,a,3,4,b,5,6], is_integer(X), X > 3].
[4,5,6]
```

**Multiple generators.** Two generators act like nested loops: for each element of the first list, every element of the second is considered. So the number of combinations is the product of the sizes (minus any filtered out). That gives a Cartesian product.

```erlang
3> [{X, Y} || X <- [1,2,3], Y <- [a,b]].
[{1,a},{1,b},{2,a},{2,b},{3,a},{3,b}]
```

**Zip generators.** Some Erlang versions support a zip form so that two lists are paired element-wise (first with first, second with second) instead of forming a Cartesian product. That reduces the result size when you want paired elements.

**Variable bindings.** Variables bound in a generator are fresh inside the comprehension; they do not export out. Variables used in filters that were bound before the comprehension keep their outer values. If you use a variable from the function head in a generator pattern, it is shadowed (the pattern variable is new). To use an outer variable in a filter, bind it to a new name in the pattern and test equality in the filter (e.g. `{X1, Y} <- L, X == X1`).

**Strict vs relaxed generators.** A strict generator (`<:-` where supported) raises an exception if an element does not match the pattern. A relaxed generator (`<-`) skips non-matching elements. Use strict when every element must match; use relaxed when you intend to filter by pattern. When the pattern is a single variable, both behave the same.

**Typical uses.** List comprehensions are handy for “select from list where condition,” “transform each element,” “combine two lists,” and small recursive algorithms (e.g. quicksort, permutations). For heavy list processing, the `lists` module and tail-recursive functions are often more efficient.

```erlang
sort([]) -> [];
sort([Pivot|T]) ->
    sort([X || X <- T, X < Pivot]) ++ [Pivot] ++ sort([X || X <- T, X >= Pivot]).
```

**Why this matters.** List comprehensions give a compact, declarative way to express “build a list from these sources under these conditions.” They are often clearer than manual recursion or multiple `lists:map`/`filter` steps for simple transformations.

---

## Further reading

- [List Comprehensions](https://www.erlang.org/doc/system/list_comprehensions) (Programming Examples)
- [Expressions](https://www.erlang.org/doc/system/expressions) (comprehensions)
