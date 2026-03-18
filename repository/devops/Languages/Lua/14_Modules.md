# Modules

[← Back to Lua](./README.md)

The package library provides **require** and the **package** table so that Lua code can load modules by name. Understanding how require resolves names and where it looks (preload, path, cpath, searchers) is important for organizing code and for configuring embedded Lua (e.g. LUA_PATH in Nginx or Redis).

## require (modname)

**require(modname)** loads the module named *modname*. It first checks **package.loaded[modname]**. If that entry is present (not nil/false), require returns that value and does not load again. Otherwise it runs the **package.searchers** in order to find a loader. When a searcher finds the module, it returns a loader function and an optional loader data value. require calls the loader with *modname* and that data. If the loader returns a non-nil value, require stores it in **package.loaded[modname]**; if the loader does not set that entry, require sets it to true. require then returns the value in **package.loaded[modname]** and, as a second result, the loader data. If no loader is found or loading fails, require raises an error.

## package.loaded

This table records which modules have been loaded. **package.loaded[modname]** is the value returned by the loader (or true). Require only uses this table; assigning to the variable **package.loaded** does not change the table used internally (the real table is in the C registry).

## package.preload

A table of custom loaders. If **package.preload[modname]** is set to a function, the first searcher uses it as the loader. No file search is done. Useful for C-loaded or dynamically built modules.

## package.path and package.cpath

**package.path** is the search path for Lua loaders. Each template is separated by `;`; `?` is replaced by the module name (dots become directory separators). Example: `./?.lua;./?.lc;/usr/local/?/init.lua` makes `require "foo.bar"` try `./foo/bar.lua`, `./foo/bar.lc`, `/usr/local/foo/bar/init.lua`. At startup, Lua sets package.path from **LUA_PATH_5_5** or **LUA_PATH**; a `;;` in the env value is replaced by the default path.

**package.cpath** is the search path for C loaders (e.g. `./?.so;./?.dll`). Set from **LUA_CPATH_5_5** or **LUA_CPATH** or a default. The C loader function name is derived from the module name (e.g. `luaopen_foo_bar` for `foo.bar`).

## package.searchers

Require calls each entry in **package.searchers** in order. A searcher receives the module name and returns either (loader, loader_data) or a string (error message) or nil. The default searchers are: (1) preload table, (2) Lua path (package.path), (3) C path (package.cpath), (4) all-in-one C library loader. You can replace or extend this table to change how modules are found. Searchers should not raise errors in Lua.

## package.searchpath (name, path [, sep [, rep]])

Searches for *name* in the path string (templates separated by `;`). Replaces `?` in each template with *name* after substituting *sep* (default `.`) by *rep* (default directory separator). Returns the first path it can open for read, or fail plus an error message. Useful to implement custom searchers.

## package.config

A string of configuration lines (directory separator, template separator, substitution mark, etc.) used by the package system. See the manual for the exact format. The fifth line defines what to ignore when building the `luaopen_` name (e.g. version suffix).

## Writing a module

A Lua module is a chunk that returns a value (usually a table) or assigns it to **package.loaded[modname]**. Convention: the chunk is in a file whose path matches the module name (e.g. `mymod` → `mymod.lua` or `mymod/init.lua` on the path). The loader is called with the module name and loader data; if the loader returns a table, that becomes the module. So a minimal module is:

```lua
-- mymod.lua
local M = {}
function M.hello() return "hello" end
return M
```

Then **require "mymod"** returns that table. You can also set **package.loaded[modname] = M** and then return M (or leave return for the loader to assign). C modules expose a **luaopen_*** function and are found via **package.cpath**.

---

## Further reading

- [Lua 5.5 — §6.4 Modules](https://www.lua.org/manual/5.5/manual.html#6.4)
