# Metatables and metamethods

[← Back to Lua](./README.md)

Metatables customize the behavior of values. Each value can have an associated table (the metatable) whose keys name events (e.g. `__add`, `__index`) and whose values are metamethods—usually functions—that Lua calls when those events occur. Tables and full userdata have per-value metatables; other types share one metatable per type. This mechanism is used for operator overloading, default values, and custom indexing.

## Metatables and events

A metatable is an ordinary table. Keys are strings with two leading underscores (e.g. `__add`, `__index`). The corresponding value is the metamethod; for most events it must be a function (or another callable value). **getmetatable** returns a value’s metatable; **setmetatable** can replace the metatable of a table (and, via the debug library, of other types). Lua looks up metamethods with raw access. Only tables and full userdata have individual metatables from Lua; for other types you need the debug library to change the type metatable. The string library sets a metatable for the string type.

## Common metamethods

- **__add**, **__sub**, **__mul**, **__div**, **__idiv**, **__mod**, **__pow** — arithmetic. Lua tries the first operand, then the second; the metamethod is called with the two operands; result is adjusted to one value.
- **__unm** — unary minus.
- **__band**, **__bor**, **__bxor**, **__bnot**, **__shl**, **__shr** — bitwise. Similar to arithmetic.
- **__concat** — concatenation (`..`). Tried if an operand is not string or number.
- **__len** — length (`#`). For non-strings, Lua tries the metamethod; for tables without it, the table length operation is used.
- **__eq**, **__lt**, **__le** — comparison. `__eq` only when both values are tables or both full userdata and not primitively equal. `__lt`/`__le` when values are not both numbers or both strings. Result is converted to boolean.
- **__index** — read access `table[key]` when key is absent (or value is not a table). Metavalue can be a function (called with table, key) or a table/object with `__index` (then indexing is repeated on it). Used for defaults and delegation.
- **__newindex** — write `table[key] = value` when key is absent. Metavalue can be a function (table, key, value) or a table; Lua does not perform the primitive assignment unless the metamethod does **rawset**.
- **__call** — call a non-function value. Metamethod is called with the value as first argument, then the call arguments. Only metamethod that can return multiple results.
- **__pairs** — custom iteration. If present, **pairs(t)** calls it with `t` and uses the first four return values (iterator function, state, initial control value, closing value), like the generic for. Used for custom key–value traversal.
- **__tostring** — **tostring(v)** calls this metamethod with `v` when present; otherwise it may use **__name** for a default. The standalone interpreter uses **__tostring** for error messages when the error object is not a string.
- **__metatable** — if the metatable has this key, **getmetatable** returns its value instead of the real metatable, and **setmetatable** raises an error. Used to lock or hide the metatable.

Other keys used by Lua: **__gc** (finalizer), **__close** (to-be-closed), **__mode** (weak table), **__name** (used by tostring and error messages). Add all needed metamethods to a table before using it as a metatable; set the metatable on the object right after creation so that **__gc** and others work as intended.

---

## Further reading

- [Lua 5.5 — §2.4 Metatables and Metamethods](https://www.lua.org/manual/5.5/manual.html#2.4)
