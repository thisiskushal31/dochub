# Coroutines

[← Back to Lua](./README.md)

Coroutines provide cooperative concurrency: a single thread of execution that can suspend and resume. They are useful for iterators, state machines, and non-blocking patterns. Lua threads (type **thread**) are not OS threads; they yield explicitly.

## Creating and running coroutines

**coroutine.create(f)** creates a new coroutine with body `f` and returns a thread value. It does not start execution. **coroutine.resume(co, ...)** starts or continues the coroutine. On first resume, the extra arguments are passed to `f`. When the coroutine **yields**, resume returns immediately with true plus the values passed to **coroutine.yield(...)**. When the coroutine returns, resume returns true plus its return values. On error, resume returns false plus the error object; the coroutine stays suspended and does not unwind, so you can inspect it with the debug API.

**coroutine.yield(...)** suspends the current coroutine. The arguments to yield become the extra return values of the corresponding resume. The next resume continues after the yield; the extra arguments to that resume become the return values of the yield call.

## coroutine.wrap

**coroutine.wrap(f)** creates a coroutine and returns a function that, when called, resumes it. The function returns all values from resume except the first (the boolean). On error, the wrapper closes the coroutine and re-raises the error. So you get a simple “call to continue” interface without checking a boolean.

## Status and closing

**coroutine.status(co)** returns `"running"` (this coroutine called status), `"suspended"` (yielded or not started), `"normal"` (active but resumed another), or `"dead"` (finished or errored). **coroutine.running()** returns the running coroutine plus a boolean (true if it is the main thread). **coroutine.isyieldable([co])** returns whether the coroutine can yield (main thread or inside a non-yieldable C function cannot).

**coroutine.close(co)** closes a suspended or dead coroutine: it runs pending to-be-closed variables and puts the coroutine in a dead state. For the running coroutine, close does not return—the resumer gets the return. On error during close, it returns false plus the error object. Use close when a coroutine will not be resumed again so that resources are released.

## Example flow

```lua
co = coroutine.create(function (a, b)
  print("body", a, b)
  local r = coroutine.yield(2*a)
  print("body", r)
  return a+b, a-b
end)
print(coroutine.resume(co, 1, 10))   -- body 1 10  then  true  2
print(coroutine.resume(co, "r"))     -- body r     then  true  11  -9
print(coroutine.resume(co))          -- false  cannot resume dead coroutine
```

---

## Further reading

- [Lua 5.5 — §2.6 Coroutines](https://www.lua.org/manual/5.5/manual.html#2.6)
- [Lua 5.5 — §6.3 Coroutine Manipulation](https://www.lua.org/manual/5.5/manual.html#6.3)
