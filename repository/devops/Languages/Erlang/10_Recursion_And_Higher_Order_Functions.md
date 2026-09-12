# Recursion and higher-order functions

[← Back to Erlang](./README.md)

Erlang has no built-in loops. **Recursion** is how you iterate: a function calls itself with a "smaller" argument until a base case stops. **Tail recursion** (the recursive call is the last thing the function does) is optimized so the stack does not grow; the VM reuses the current frame. **Higher-order functions** take or return functions; they are used for callbacks, iteration helpers, and abstraction. This section explains both so you can write efficient, idiomatic Erlang.

**Why recursion.** In a functional language without mutable variables, you cannot "increment a counter and loop." Instead you express iteration by a function that, for example, takes a list and either handles the empty case (base case) or handles the head and recurses on the tail. The same idea applies to other data: process a piece, recurse on the rest. Recursion makes the structure of the data (e.g. list shape) visible in the code.

**Recursion over lists.** The typical pattern: one clause for the empty list (base case), one for `[H | T]` (process `H`, recurse on `T`). The result can be built in the return path (e.g. `1 + list_length(Rest)`) or in an **accumulator** (an extra argument that carries the result so far). The first style is simple but not tail-recursive; for long lists an accumulator is better so the recursion can be tail-recursive.

```erlang
list_length([]) ->
    0;
list_length([_First | Rest]) ->
    1 + list_length(Rest).
```

**Tail recursion with an accumulator.** You add an extra argument (e.g. `Result_so_far`) and pass the updated value down. The recursive call is then the last expression, so the compiler can optimize it (no extra stack frame). Example: finding the maximum of a list. You "carry" the current maximum; when the list is empty you return it.

```erlang
list_max([Head | Rest]) ->
    list_max(Rest, Head).

list_max([], Res) ->
    Res;
list_max([Head | Rest], Result_so_far) when Head > Result_so_far ->
    list_max(Rest, Head);
list_max([Head | Rest], Result_so_far) ->
    list_max(Rest, Result_so_far).
```

**Reversing a list.** Building a list by prepending is cheap; appending is expensive. So a common pattern is to build the result in reverse using an accumulator, then return it (or reverse it once at the end if needed). Reversing a list: take the head, put it in front of the accumulator, recurse on the tail; when the list is empty, the accumulator is the reversed list.

```erlang
reverse(List) ->
    reverse(List, []).

reverse([Head | Rest], Reversed_List) ->
    reverse(Rest, [Head | Reversed_List]);
reverse([], Reversed_List) ->
    Reversed_List.
```

**Higher-order functions.** Functions are values. You can pass them as arguments or return them. The `lists` module provides `map`, `filter`, `foldl`, `foldr`, and others that take a function and a list. That lets you express "do this to every element" or "combine all elements" without writing the recursion yourself. Anonymous functions use the syntax `fun (Args) -> Body end` or `fun Module:Name/Arity`.

```erlang
lists:map(fun(X) -> X * 2 end, [1, 2, 3]).
%% => [2,4,6]

lists:filter(fun(X) -> X rem 2 =:= 0 end, [1, 2, 3, 4]).
%% => [2,4]

lists:foldl(fun(X, Acc) -> Acc + X end, 0, [1, 2, 3, 4]).
%% => 10
```

**Variable scope in recursion.** Each recursive call has its own scope. So a variable like `Result_so_far` in `list_max/2` can have a different value in each call; you are not "reassigning" it, you are passing a new value to the next invocation. That is why recursion with accumulators is both correct and tail-recursive.

**Why this matters.** Recursion is the standard way to express iteration in Erlang; tail recursion keeps it efficient for long lists. Higher-order functions and the `lists` module give you reusable patterns (map, filter, fold) and make code shorter and clearer. Before writing a custom list function, check if `lists` already provides it.

---

## Further reading

- [Functions](https://www.erlang.org/doc/system/functions) (tail recursion)
- [Expressions](https://www.erlang.org/doc/system/expressions) (fun expressions)
- [Funs](https://www.erlang.org/doc/system/funs) (Programming Examples)
- [Sequential Programming](https://www.erlang.org/doc/system/seq_prog) (higher-order functions)
