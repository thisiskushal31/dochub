# C API and embedding

[← Back to Lua](./README.md)

Lua is implemented as a C library. The host creates a Lua state, pushes and pulls values on a stack, calls Lua code, and can register C functions for Lua to call. From a DevOps perspective, this overview helps when reading embedding code (e.g. in Nginx or Redis) or when you need to extend or sandbox the runtime.

## Lua state and stack

All API functions take a **lua_State*** (a thread). The Lua library is reentrant: it keeps data in a **Lua state**, created with **lua_newstate** (or **luaL_newstate** from the auxiliary library). The state holds one or more threads; the main thread is created with the state.

Lua and C exchange values through a **virtual stack**. Each stack slot holds one Lua value (nil, number, string, table, etc.). Index 1 is the bottom; negative indices are relative to the top (-1 is top). **Valid indices** are stack positions 1..top plus pseudo-indices (registry, upvalues). **Acceptable indices** include valid indices plus positive indices up to the allocated stack size and “past” upvalues; query functions treat invalid acceptable indices as **LUA_TNONE** (like nil). So you can query “argument 3” without checking the stack top first. **Stack size:** you must ensure enough space for results; **lua_checkstack** grows the stack. When Lua calls C, it guarantees at least **LUA_MINSTACK** (e.g. 20) free slots. **String pointers** returned by the API (e.g. **lua_tolstring**) are valid only while that value remains at that stack index (or, for upvalues, while the call is active and the upvalue unchanged); the GC can invalidate them otherwise.

## Registry and global environment

The **registry** is a predefined table accessible at pseudo-index **LUA_REGISTRYINDEX**. C code can store Lua values there (use unique keys, e.g. library name or light userdata). Integer keys are reserved for the reference mechanism and predefined indices. **LUA_RIDX_GLOBALS** is the global environment; **LUA_RIDX_MAINTHREAD** is the main thread. The global environment is what Lua scripts see as _ENV; the host can replace it to sandbox scripts.

## C functions and closures

A **C function** in Lua has type **lua_CFunction**: it receives the state and returns the number of return values it pushed. You push a C function with **lua_pushcfunction**; **lua_pushcclosure** attaches **upvalues** (Lua values) that the C function can read via **lua_upvalueindex(i)**. The host registers C functions by pushing them and storing them in the global environment (or in a table that scripts can access).

## Loading and running code

**luaL_loadfile** / **luaL_loadstring** (or **load** in Lua) compile a chunk and push a function. **lua_pcall** (or **lua_call**) runs that function. **lua_pcall** is protected: on error it returns a non-zero status and leaves the error object on the stack; **lua_call** is unprotected and never returns on error. For embedding, the host usually uses **lua_pcall** (or **lua_pcallk** if the script can yield) so that errors do not crash the process. The auxiliary library provides **luaL_dofile**, **luaL_dostring**, and helpers for argument checking and error messages.

## Error handling and yields

Lua uses **longjmp** (or C++ exceptions if built that way) for errors. **lua_error** raises an error from C. If an error occurs outside a protected call, Lua calls the **panic function** (see **lua_atpanic**) and then aborts. **Status codes:** **LUA_OK** (0), **LUA_ERRRUN** (runtime), **LUA_ERRMEM** (allocation), **LUA_ERRSYNTAX**, **LUA_ERRFILE**, **LUA_ERRERR** (error in message handler), **LUA_YIELD** (coroutine yielded). **lua_pcall** / **lua_load** etc. return these; **LUA_ERRMEM** does not run the message handler.

C code that might yield (e.g. when calling back into Lua that yields) must use **lua_pcallk** / **lua_callk** / **lua_yieldk** with a **continuation function** (**lua_KFunction**). When the callee yields, the C stack frame is lost; on resume Lua calls the continuation with the same stack state as if the callee had returned. The continuation receives (L, status, ctx); for **lua_pcallk**, status is **LUA_YIELD** when resuming after yield. Normal **lua_pcall** cannot return after a yield.

## API structure (where to look)

- **Stack:** **lua_checkstack**, **lua_gettop**, **lua_settop**, **lua_push***, **lua_to***, **lua_getfield**, **lua_setfield**, **lua_gettable**, **lua_settable**, **lua_rawget**, **lua_rawset**, **lua_insert**, **lua_remove**, **lua_replace**, **lua_copy**, **lua_rotate**, **lua_absindex**.
- **State and threads:** **lua_newstate**, **lua_close**, **lua_newthread**, **lua_resume**, **lua_yieldk**, **lua_isyieldable**.
- **Load/call:** **lua_load**, **lua_call**, **lua_pcall**, **lua_callk**, **lua_pcallk**; **luaL_loadfile**, **luaL_loadstring**, **luaL_dofile**, **luaL_dostring**.
- **C closures:** **lua_pushcfunction**, **lua_pushcclosure**, **lua_upvalueindex**.
- **Registry and globals:** **LUA_REGISTRYINDEX**, **LUA_RIDX_GLOBALS**, **lua_getfield(L, LUA_REGISTRYINDEX, ...)**.
- **Auxiliary library (luaL_*):** argument checking (**luaL_check***, **luaL_opt***), **luaL_error**, **luaL_newmetatable**, **luaL_ref** / **luaL_unref**, **luaL_requiref**, buffers, etc. The full alphabetical list of C API and auxiliary functions is in manual §4.6, §4.7, and §5.1.

## Standard libraries

The host chooses which standard libraries to load. **luaL_openlibs** opens all; **luaL_openselectedlibs** opens a subset (basic, package, coroutine, string, table, math, I/O, OS, debug, etc.). The standalone interpreter opens all. Embedded hosts often omit or replace I/O and OS and may restrict debug.

---

## Further reading

- [Lua 5.5 — §4 The Application Program Interface](https://www.lua.org/manual/5.5/manual.html#4)
- [Lua 5.5 — §4.1 The Stack](https://www.lua.org/manual/5.5/manual.html#4.1) (size, valid/acceptable indices, string pointers)
- [Lua 5.5 — §4.4 Error Handling in C](https://www.lua.org/manual/5.5/manual.html#4.4) and [§4.4.1 Status Codes](https://www.lua.org/manual/5.5/manual.html#4.4.1)
- [Lua 5.5 — §4.5 Handling Yields in C](https://www.lua.org/manual/5.5/manual.html#4.5)
- [Lua 5.5 — §4.6 Functions and Types](https://www.lua.org/manual/5.5/manual.html#4.6), [§4.7 Debug Interface](https://www.lua.org/manual/5.5/manual.html#4.7)
- [Lua 5.5 — §5 The Auxiliary Library](https://www.lua.org/manual/5.5/manual.html#5) and [§5.1 Functions and Types](https://www.lua.org/manual/5.5/manual.html#5.1)
