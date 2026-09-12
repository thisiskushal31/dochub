# Pattern matching and guards

[← Back to Erlang](./README.md)

**Pattern matching** is how Erlang binds variables and selects which clause of a function (or which branch of `case` or `receive`) to run. The **match operator** is `=`: the left side is a pattern, the right side is a value. If the value has the same shape as the pattern, the match succeeds and variables in the pattern are bound. If not, you get a run-time error (no match). **Guards** are extra conditions on a clause; they use a subset of Erlang and run after pattern matching. Together, pattern matching and guards are the main way you express logic in Erlang—without them you cannot write idiomatic code. This section explains what they are, why they matter, and how to use them.

**Why pattern matching.** Instead of writing "if the value is a tuple of two elements and the first is the atom ok, then bind the second to Result," you write the pattern `{ok, Result} = Something`. The language does the test and the binding in one step. The same idea is used in function heads: you write one clause per "case" (e.g. empty list vs non-empty, success tuple vs error tuple), and the VM tries the clauses in order until one matches. That keeps code declarative and easy to read. The same rules apply in `receive` (for messages) and in `case` and `try`, so you use one mental model everywhere.

**Basic matching.** Literals in a pattern match only themselves. Variables in a pattern match any value and get bound. The underscore `_` is an anonymous variable: it matches anything and does not bind, so you use it when the value is irrelevant. Once a variable is bound in a scope, it keeps that value; matching it to a different value in the same scope causes a run-time error.

```erlang
1> {A, B} = {10, 20}.
{10,20}
2> A.
10
3> {ok, Result} = {ok, 42}.
{ok,42}
4> Result.
42
5> {ok, X} = {error, bad}.
** exception error: no match of right hand side value {error,bad}
```

**Matching in function heads.** A function can have multiple clauses. The VM tries them in order; the first clause whose patterns match (and whose guards succeed, if any) is executed. So you often write one clause per case: for example one clause for the empty list and one for `[Head | Rest]`, or one for `{ok, X}` and one for `{error, Reason}`. The head is the part before `->`; the body is the part after. If no clause matches, you get a `function_clause` run-time error.

```erlang
convert_length({centimeter, X}) ->
    {inch, X / 2.54};
convert_length({inch, Y}) ->
    {centimeter, Y * 2.54}.
```

**Why guards.** Sometimes the shape of the data is the same but you want to choose the clause based on a condition—for example "only when N is greater than 0" or "only when the list is non-empty and the head is larger than the result so far." Guards are boolean expressions that run after pattern matching; they use a restricted subset of Erlang (no side effects, no user-defined functions in the guard itself—only type tests, comparisons, and a few allowed functions). A guard sequence can be a comma-separated list of tests (all must succeed) or semicolon-separated alternatives (one must succeed). If the guard fails, the next clause is tried.

**Guard operators.** Useful operators in guards include `/=` (not equal), `=<` (less or equal), `>=` (greater or equal), `==` (equal), `>` (greater than), `<` (less than). Type tests like `is_integer/1`, `is_list/1`, `is_atom/1` are also common in guards. The keyword `when` introduces the guard before `->`.

```erlang
list_max([Head|Rest], Result_so_far) when Head > Result_so_far ->
    list_max(Rest, Head);
list_max([Head|Rest], Result_so_far) ->
    list_max(Rest, Result_so_far).
```

**Pin operator.** In a pattern, a variable normally binds to whatever is on the right. To use the **current** value of a variable (i.e. to compare instead of bind), you use the **pin** operator `^`. So `{^X, Z} = {1, 3}` means: match a two-tuple whose first element equals the value already in `X`; bind the second to `Z`. Without the pin, `X` would be bound to the first element and could "shadow" the previous `X`.

```erlang
6> X = 1.
1
7> {X, Y} = {1, 2}.
{1,2}
8> {^X, Z} = {1, 3}.
{1,3}
9> {^X, W} = {2, 4}.
** exception error: no match of right hand side value {2,4}
```

**Scope.** Variables bound in a clause head or in the body are in scope for the rest of that clause. Variables bound in one branch of `case` or `receive` are not in scope in other branches. Each recursive call creates a new scope, so the same variable name in different calls can hold different values (e.g. `Result_so_far` in each step of `list_max/2`).

**Why this matters.** Pattern matching and guards give you declarative control flow and data destructuring. The same rules apply in `receive` for messages, so process logic stays consistent and predictable. Mastering them is necessary for both sequential and concurrent Erlang.

---

## Further reading

- [Expressions](https://www.erlang.org/doc/system/expressions) (pattern matching, guards)
- [Sequential Programming](https://www.erlang.org/doc/system/seq_prog) (matching, guards, scope)
