# Variables, scopes, and environments

[← Back to Lua](./README.md)

Lua has global variables, local variables, and table fields. Names are resolved by lexical scope and by declarations: a name can be global or local depending on the declarations in scope. Globals are resolved through an environment table (`_ENV`). Understanding this is important for writing clear scripts and for sandboxing (e.g. custom environments in Nginx or Redis).

## Kinds of variables

There are three kinds of variables: **global variables**, **local variables** (including function parameters), and **table fields**. A bare name refers to a global or a local according to the declarations in scope. Table fields are accessed with `t[key]` or `t.name` (where `t.name` is syntax for `t["name"]`). Before any assignment, a variable’s value is `nil`.

## Global-by-default and the global declaration

Every chunk starts with an implicit **global \***: any name not declared otherwise is treated as global. Inside a **global** declaration block, that default is void—every variable must be declared (global or local). Example:

```lua
X = 1       -- global by default
do
  global Y
  Y = 1     -- Y is global
  X = 1     -- ERROR: X not declared in this scope
end
X = 2       -- global again
```

So outside any `global` block you get the usual “global by default” behavior; inside a `global` block you must list globals explicitly.

## Lexical scoping

Lua is lexically scoped. The scope of a declaration starts at the first statement after the declaration and lasts until the end of the innermost block that contains it (labels and empty statements do not extend scope). A new declaration for the same name shadows the outer one; inside that inner scope the outer declaration is not visible.

In `local x = x`, the right-hand side `x` is the outer variable, because the new `x` is not in scope yet on the right side of the declaration. Example:

```lua
global print, x
x = 10
do
  local x = x      -- new x, value 10 from global
  print(x)         --> 10
  x = x + 1
  do
    local x = x+1  -- another new x
    print(x)       --> 12
  end
  print(x)         --> 11
end
print(x)           --> 10  (global)
```

## Locals and upvalues

Functions defined inside a block can read and write local variables of that block. A local used by an inner function is called an **upvalue** (or external local) inside that function. Each execution of a `local` statement creates new locals. So in a loop, each iteration can have its own local that is captured by closures:

```lua
a = {}
local x = 20
for i = 1, 10 do
  local y = 0
  a[i] = function () y = y + 1; return x + y end
end
```

There are ten different `y` variables (one per iteration) and one shared `x`.

## Environments and _ENV

Every reference to a global name `var` is treated as `_ENV.var`. Each chunk is compiled in the scope of an external local named `_ENV`, so free names in the chunk refer to this table. Any table used as the value of `_ENV` is called an **environment**. The **global environment** is the default: the standalone interpreter and `load`/`loadfile` set a chunk’s `_ENV` to this table, so globals behave as usual. You can load a chunk with a different environment (e.g. for sandboxing) by passing a different `_ENV` when loading. In C, you set the chunk’s first upvalue to the desired environment. The global `_G` is initialized to this same global environment; Lua does not use `_G` internally.

---

## Further reading

- [Lua 5.5 — §2.2 Scopes, Variables, and Environments](https://www.lua.org/manual/5.5/manual.html#2.2)
- [Lua 5.5 — §3.2 Variables](https://www.lua.org/manual/5.5/manual.html#3.2)
