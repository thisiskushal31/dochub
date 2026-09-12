# Functions, calls, and definitions

[← Back to Lua](./README.md)

Functions are first-class values. Lua supports multiple results, variadic parameters, tail calls, and method-call syntax. Understanding calls, definitions, and result adjustment is important for APIs and for scripts in embedded hosts.

## Function calls

A call has the form *prefixexp* *args*. If *prefixexp* evaluates to a function, that function is called with the given arguments. Otherwise the `__call` metamethod is used, with the value as first argument and the call arguments following.

**Method call**  
`v:name(args)` is sugar for `v.name(v, args)`, with `v` evaluated once. Used for object-style methods.

**Arguments**  
Args can be `(explist)`, a table constructor `{...}` (one table argument), or a literal string. So `f"x"` and `f'x'` pass one string; `f{...}` passes one table. All argument expressions are evaluated before the call.

**Tail calls**  
A `return functioncall` not inside a to-be-closed variable’s scope is a tail call: the callee reuses the caller’s stack frame, so there is no limit on tail recursion. Only the exact form `return f(...)` qualifies; `return (f(x))`, `return 2*f(x)`, or `return x, f(x)` are not tail calls.

## Function definitions

A function definition is an expression that creates a closure when executed. Syntax: `function (parlist) block end`. Sugar: `function f() body end` → `f = function () body end`; `function t.a.b:c(params) body end` → `t.a.b.c = function (self, params) body end` (colon adds `self`). `local function f() body end` is equivalent to `local f; f = function () body end` so that `f` is visible for recursion inside the body.

**Parameters**  
Parameters are locals initialized with the arguments. Non-variadic functions adjust the argument list to the number of parameters (extra dropped, missing filled with nil). A variadic function has `...` at the end of the parameter list; it does not adjust arguments and receives extra arguments via a vararg. The vararg can be named, e.g. `function f(a, b, ...) end`; the name refers to a read-only table with indices 1, 2, … and `n` for the count. The expression `...` in the body yields the list of extra arguments. If control reaches the end of the function without return, the function returns no values. There is a limit on how many values a function can return (at least 1000).

## Multiple results and adjustment

Function calls and vararg expressions can produce multiple values (multires expressions). Where Lua expects a **list** of expressions (e.g. assignment RHS, call arguments, return list, table constructor, for-in explist), the last element can be a multires expression; all its values are used. In other positions, or where a **single** value is expected (e.g. inside parentheses), the list is adjusted to one value (first kept, rest dropped). So `(f())` returns only the first result; `return f()` returns all results. In assignments and parameter passing, the list is adjusted to the needed length: extra values discarded, missing values become nil.

Examples: `print(x, (f()))` prints x and the first result of `f()`. `x, y, z = f()` assigns the first three results (or nil if fewer). `local x = ...` in a variadic function takes the first vararg. `return x, f()` returns x plus all results of `f()`.

---

## Further reading

- [Lua 5.5 — §3.4.10 Function Calls](https://www.lua.org/manual/5.5/manual.html#3.4.10)
- [Lua 5.5 — §3.4.11 Function Definitions](https://www.lua.org/manual/5.5/manual.html#3.4.11)
- [Lua 5.5 — §3.4.12 Lists of Expressions, Multiple Results](https://www.lua.org/manual/5.5/manual.html#3.4.12)
