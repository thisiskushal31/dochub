# Tuples and lists

[← Back to Erlang](./README.md)

**Tuples** group a fixed number of terms in curly braces; **lists** are sequences of any length in square brackets. Both are central to Erlang. This section explains what they are, why you use each, and how to work with them so you can write and read real code.

**Why tuples.** Tuples group a fixed number of values into one term. That makes the meaning of data clear: for example `{inch, 3}` unambiguously denotes 3 inches, whereas `convert(3, inch)` might mean "3 in inches" or "convert 3 to inches." Tuples are used where other languages use records or structs: fixed shape, known positions. Tagged tuples like `{ok, Result}` and `{error, Reason}` are the standard way to represent success or failure. Tuples can contain any terms, including other tuples (e.g. `{moscow, {c, -10}}` for a city and its temperature).

**Tuple syntax and BIFs.** Each term in a tuple is an element; positions are 1-based. Use `element(N, Tuple)` to read, `setelement(N, Tuple, Value)` to build a new tuple with one element replaced (the original is unchanged—tuples are immutable), `tuple_size/1` for the number of elements, and `is_tuple/1` to test. If you request an element that does not exist (e.g. element 3 of a 2-tuple), you get a run-time error.

```erlang
1> T = {moscow, {c, -10}}.
{moscow,{c,-10}}
2> element(1, T).
moscow
3> element(2, T).
{c,-10}
4> setelement(2, T, {f, 14}).
{moscow,{f,14}}
5> tuple_size(T).
2
```

**Why lists.** Lists represent sequences of varying length: zero or more elements. They are the main way to represent collections, to traverse data recursively, and (as lists of character codes) to represent text. In general, tuples are used where you need a fixed shape; lists are used where you need a variable number of items, as with linked lists in other languages.

**List structure.** A list is either the empty list `[]` or a head and a tail `[H|T]`, where the tail is itself a list. So `[a,b,c]` is equivalent to `[a|[b|[c|[]]]]`. The `|` operator separates the first element from the rest. You can match multiple elements at the front: `[A, B | R] = [1, 2, 3, 4]` binds `A=1`, `B=2`, `R=[3,4]`. If you ask for more elements than the list has, you get a run-time error. A list whose tail is always a list is a proper list; the tail can theoretically be non-list (e.g. `[a|b]`), but such improper lists are rarely useful.

```erlang
6> [First | Rest] = [1, 2, 3, 4, 5].
[1,2,3,4,5]
7> First.
1
8> Rest.
[2,3,4,5]
9> [A, B | R] = [1, 2, 3, 4].
[1,2,3,4]
10> R.
[3,4]
```

**Recursing over lists.** The standard pattern is two clauses: one for the empty list (base case) and one for `[Head | Rest]` (process Head, then recurse on Rest). The length of a list can be computed by: length of empty list is 0; length of `[First | Rest]` is 1 plus the length of Rest. This is not tail-recursive; for long lists a tail-recursive version with an accumulator is better, but the pattern of "empty vs non-empty" is the same everywhere.

```erlang
list_length([]) ->
    0;
list_length([_First | Rest]) ->
    1 + list_length(Rest).
```

**Variable scope.** In the examples above, new variable names are used each time. A variable can only be given a value once in its scope. So in a new shell expression you can reuse names, but within the same clause you cannot bind the same variable to two different values. That is why recursion uses new "copies" of the clause: each recursive call has its own scope, so `Rest` and `Result_so_far` and similar can take different values in different invocations.

**Prepending and the `|` operator.** Just as you use `|` to take the head and tail apart, you use it to add a head to a list: `[NewHead | ExistingList]` produces a new list with `NewHead` in front. Prepending is O(1). Building a list by repeatedly appending with `++` is O(n) per append and can be expensive; building by prepending and then reversing (or using an accumulator) is usually better.

**Strings as lists.** Erlang has no distinct string type. The literal `"hello"` is shorthand for the list `[104,101,108,108,111]`. The shell prints lists of printable character codes as strings. List concatenation is `++`; list difference is `--`. For UTF-8 binary text, use binaries or the `~b` sigil.

```erlang
11> [97, 98, 99].
"abc"
12> "hello" ++ " " ++ "world".
"hello world"
```

**Why this matters.** Tuples give you fixed, known shapes for messages and results; lists are the default collection and the representation of text. Recursion over `[H|T]` is the basis for most list processing and for the behaviour of the `lists` module. Understanding both is essential for reading and writing Erlang.

---

## Further reading

- [Data Types](https://www.erlang.org/doc/system/data_types) (tuple, list, string)
- [Sequential Programming](https://www.erlang.org/doc/system/seq_prog) (tuples and lists)
