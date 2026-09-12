# Control flow: case and if

[← Back to Erlang](./README.md)

Erlang uses **pattern matching** in function heads for most branching: you write one clause per case. When you need to branch **inside** a function body (e.g. on the result of a computation or on a single value), you use `case` or `if`. Both evaluate to a value and can appear anywhere an expression is allowed. This section explains how they work and when to use each so you can write clear, correct control flow.

**Why case and if exist.** Function clauses already give you multi-way branching by pattern and guard. Sometimes the value you want to branch on is not the argument but something you compute in the body (e.g. the result of a function call or an expression). For that you need an expression that (1) computes a value, (2) matches it against several alternatives, and (3) returns the result of the matching branch. That is what `case` and `if` do.

**case.** A `case` expression has the form `case Expr of Clause1; Clause2; ... end`. Each clause is `Pattern [when Guard] -> Body`. The expression is evaluated once; its value is matched against the clauses in order. The first clause whose pattern matches (and whose guard succeeds, if present) runs; the result of that body is the result of the `case`. If no clause matches, a **case_clause** run-time error is raised. So you either cover all possibilities or add a catch-all (e.g. `_ -> ...` or `Other -> ...`).

```erlang
result(X) ->
    case X of
        {ok, N}    -> N + 1;
        {error, _} -> 0
    end.
```

In the shell:

```erlang
1> X = {ok, 42}.
{ok,42}
2> case X of
2>     {ok, N} -> N + 1;
2>     {error, _} -> 0
2> end.
43
3> case X of
3>     {error, _} -> 0
3> end.
** exception error: no case clause matching {ok,42}
```

**if.** An `if` expression has **no** subject to pattern-match; it has only guards. The form is `if Guard1 -> Body1; Guard2 -> Body2; ... end`. The VM evaluates the guards in order; the first guard that succeeds runs the corresponding body, and that body's value is the result of the `if`. There is no "else" keyword; you use `true -> ...` as a catch-all. If no guard succeeds, an **if_clause** run-time error is raised.

```erlang
sign(N) ->
    if
        N > 0  -> positive;
        N < 0  -> negative;
        true   -> zero
    end.
```

**Choosing case vs if.** Use **case** when the decision is based on the **shape or value** of a term (e.g. `{ok,_}` vs `{error,_}`, or specific atoms). Use **if** when you have **only conditions** (comparisons, type tests) and no single "subject" to destructure. In practice, `case` is more common; `if` is used for short condition lists. When in doubt, `case` is often clearer because the pattern makes the branch explicit.

**Why this matters.** Control flow is explicit: every branch is visible. Combined with pattern matching in function heads, you keep logic in small, readable pieces. Using a catch-all in `case` or `true` in `if` avoids run-time errors when you add new cases later.

---

## Further reading

- [Expressions](https://www.erlang.org/doc/system/expressions) (if, case, maybe)
- [Sequential Programming](https://www.erlang.org/doc/system/seq_prog) (if and case)
