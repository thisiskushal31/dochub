# Error handling

[← Back to Lua](./README.md)

Lua does not have built-in exceptions; instead it uses protected calls and error objects. Understanding how errors are raised, caught, and propagated helps when writing robust scripts and when integrating with C hosts (e.g. Nginx, Redis).

## Raising errors

Several operations can raise an error (e.g. type errors, arithmetic errors). Lua code can raise explicitly by calling **error**. That function never returns: it propagates the error object to a protected call or to the host. The error object can be any value except nil (nil is turned into a string message). Lua itself only generates string error objects; programs and hosts can use other types for their own handling.

## Catching errors: protected calls

To catch errors you use a **protected call**: **pcall** or **xpcall**. **pcall(f, ...)** runs `f` with the given arguments. If `f` runs without error, pcall returns true plus all values returned by `f`. If an error occurs, pcall returns false plus the error object. So the caller can branch on the first return value and handle the error without crashing.

**xpcall** adds a **message handler**: xpcall(f, handler, ...). If an error occurs, the handler is called with the error object and can return a new error object (e.g. a string with a stack trace). The handler runs before the stack is unwound, so it can inspect the stack. It is still protected: an error inside the handler triggers the handler again; if that recurses too deeply, Lua breaks the loop. The handler is not used for memory-allocation errors or for errors in finalizers or in other message handlers.

## Host integration

Lua code usually starts when the host (e.g. the standalone `lua` program or an embedded application) calls into Lua. That call is typically protected. So an unprotected error during load or run propagates to the host, which can log, retry, or abort. In embedded use, the host is responsible for deciding how to present or handle the error.

## Warnings

Lua also has a **warning** system (e.g. **warn**). Warnings do not change program execution; they typically produce a message. Behavior can be customized from C (e.g. **lua_setwarnf**).

---

## Further reading

- [Lua 5.5 — §2.3 Error Handling](https://www.lua.org/manual/5.5/manual.html#2.3)
