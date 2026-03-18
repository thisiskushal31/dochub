# Standard libraries

[← Back to Lua](./README.md)

The standard Lua libraries are C modules exposed through the C API. They provide language essentials (type, metatables), data structures (table, string), math, I/O, OS facilities, modules, coroutines, and debugging. Embedded hosts can open all libraries or only selected ones. This topic gives an overview and then goes deeper on the basic library, string (including patterns), and table; for every function and constant, the manual index and §6.2–§6.11 are the definitive reference.

## Overview

Libraries are loaded explicitly by the host (e.g. **luaL_openlibs** or **luaL_openselectedlibs** in C). The standalone interpreter opens all of them. Except for the basic and package libraries, each library puts its functions in a global table (e.g. **string**, **table**, **math**, **coroutine**, **io**, **os**, **utf8**, **debug**) or as methods on objects. Many functions that can fail return a **fail** value (currently nil); the manual recommends testing with **not status** rather than **status == nil**.

---

## Basic library in depth (§6.2)

The basic library provides core facilities. If you omit it in an embedded build, you must provide replacements for what your scripts use.

**Type and conversion:** **type(v)** returns the type name as a string. **tonumber(e [, base])** converts a value to number (optional base for string conversion); returns nil if conversion fails. **tostring(v)** converts to string; uses **__tostring** metamethod if present.

**Metatables:** **getmetatable(object)** returns the metatable, or the value of **__metatable** if set. **setmetatable(table, metatable)** sets a table’s metatable (errors if **__metatable** is set). **rawequal**, **rawget**, **rawset**, **rawlen** bypass metamethods for equality, read, write, and length; use them when you need to avoid **__index** / **__newindex** / **__len**.

**Errors and protection:** **error(message [, level])** raises an error (level controls where the error is reported). **assert(v [, message])** raises if `v` is false/nil; otherwise returns all arguments. **pcall(f, ...)** and **xpcall(f, msgh, ...)** call `f` in protected mode; pcall returns true + results or false + error object; xpcall adds a message handler for tracebacks.

**Loading and running:** **load(chunk [, chunkname [, mode [, env]]])** loads a chunk (string or function that returns pieces); returns a function or nil + errmsg. **loadfile([filename [, mode [, env]]])** loads from a file. **dofile([filename])** loads and runs a file, returning its results; propagates errors. **require(modname)** loads modules (topic 14).

**Iteration and indexing:** **next(table [, index])** allows manual iteration over key–value pairs; order is unspecified. **pairs(t)** uses **__pairs** if present, else returns next, t, nil. **ipairs(t)** iterates integer keys 1, 2, ... until nil.

**Variadic and selection:** **select(index, ...)** returns the count of extra arguments if index is "#", otherwise the argument at index and all following. **print(...)** writes values to stdout using tostring.

**GC:** **collectgarbage(opt [, arg])** controls the garbage collector (e.g. "collect", "step", "stop", "restart", or "param" with parameter names like "pause", "stepmul"). Do not call from a finalizer.

**Globals:** **\_G** is the global environment. **\_VERSION** is the Lua version string. **warn(...)** emits warnings (can be customized from C).

---

## Package library (§6.4)

**require(modname)** loads modules; see topic 14 (Modules). The **package** table holds **package.path**, **package.cpath**, **package.loaded**, **package.preload**, **package.searchers**, and **package.config**.

---

## Coroutine library (§6.3)

The **coroutine** table: **create**, **resume**, **yield**, **status**, **wrap**, **close**, **running**, **isyieldable**. See topic 12.

---

## String library and patterns (§6.5, §6.5.1)

The **string** table provides **string.byte**, **string.char** (byte/char conversion), **string.sub** (substring; indices from 1, negative = from end), **string.rep**, **string.reverse**, **string.len**, **string.lower**, **string.upper**, **string.format** (sprintf-style; specifier **%q** for Lua-safe quoted strings), **string.dump** (serialize function to binary chunk). Strings have a metatable so **s:method(...)** works.

**Pattern matching:** **string.find**, **string.match**, **string.gmatch**, **string.gsub** use **patterns** (see §6.5.1). A pattern is a sequence of **pattern items**. Character classes: **%a** (letters), **%c** (control), **%d** (digits), **%l** (lowercase), **%p** (punctuation), **%s** (space), **%u** (uppercase), **%w** (alphanumeric), **%x** (hex), **.** (any); uppercase = complement. **%x** (x non-alphanumeric) escapes magic character x. **[]** and **[^set]** for sets and ranges. Pattern items: class, class**?** (0 or 1), class***** (0 or more, longest), class**+** (1 or more), class**-** (0 or more, shortest), **%bxy** (balanced x..y), **%f[set]** (frontier), **%n** (n-th capture). **^** and **$** anchor start/end. **Captures** are subpatterns in parentheses; they are returned by find/match and used in gsub replacement (**%1**–**%9**, **%0** for whole match). **string.pack** / **string.unpack** / **string.packsize** use format strings (§6.5.2) for binary data.

---

## UTF-8 library (§6.6)

The **utf8** table: **utf8.len**, **utf8.codes**, **utf8.codepoint**, **utf8.char**, **utf8.offset**, **utf8.charpattern**. For full reference see manual §6.6.

---

## Table library in depth (§6.7)

**table.concat(list [, sep [, i [, j]]])** concatenates list elements (default sep "", range i to j). **table.insert(list [, pos], value)** inserts at position (default end). **table.remove(list [, pos])** removes and returns element at pos (default last). **table.move(a1, f, e, t [, a2])** moves elements from a1 to a2 (default a1). **table.sort(list [, comp])** sorts in place; comp is a comparison function. **table.pack(...)** returns a table with all arguments and **n** = number of arguments. **table.unpack(list [, i [, j]])** returns list[i]..list[j]. **table.create(n [, m])** creates a table with preallocated array size n and optional hash part m. For the full list see manual §6.7.

---

## Mathematical library (§6.8)

The **math** table: **abs**, **acos**, **asin**, **atan**, **ceil**, **cos**, **deg**, **exp**, **floor**, **fmod**, **log**, **max**, **min**, **modf**, **rad**, **random**, **randomseed**, **sin**, **sqrt**, **tan**, **tointeger**, **type**, **ult**; constants **math.pi**, **math.huge**, **math.maxinteger**, **math.mininteger**. See manual §6.8.

---

## I/O library (§6.9)

**io** table: **input**, **output**, **open**, **close**, **read**, **write**, **lines**, **flush**, **type**, **popen**, **tmpfile**; **io.stdin**, **io.stdout**, **io.stderr**. File handles support **:read**, **:write**, **:close**, **:flush**, **:lines**, **:seek**, **:setvbuf**. In embedded environments, I/O may be restricted or replaced. See manual §6.9.

---

## Operating system library (§6.10)

The **os** table: **clock**, **date**, **difftime**, **execute**, **exit**, **getenv**, **remove**, **rename**, **setlocale**, **time**, **tmpname**. Host-dependent. See manual §6.10.

---

## Debug library (§6.11)

The **debug** table: **getinfo**, **getlocal**, **getupvalue**, **setlocal**, **setupvalue**, **getmetatable**, **setmetatable**, **getregistry**, **getuservalue**, **setuservalue**, **traceback**, **upvalueid**, **upvaluejoin**, **sethook**, **gethook**, **debug**. Used for introspection and custom error handling; can change metatables of non-table types. Many hosts omit or restrict it. See manual §6.11.

---

## Further reading

- [Lua 5.5 — §6 The Standard Libraries](https://www.lua.org/manual/5.5/manual.html#6)
- [Lua 5.5 — §6.2 Basic Functions](https://www.lua.org/manual/5.5/manual.html#6.2) through [§6.11 Debug](https://www.lua.org/manual/5.5/manual.html#6.11)
- [Lua 5.5 — §6.5.1 Patterns](https://www.lua.org/manual/5.5/manual.html#6.5.1)
