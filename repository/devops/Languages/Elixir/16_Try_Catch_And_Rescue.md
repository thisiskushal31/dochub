# try, catch, and rescue

[← Back to Elixir](./README.md)

Elixir treats **errors** as part of the flow: you let them propagate or you handle them in a **try** block with **rescue** (for exceptions), **catch** (for throws and exits), **after** (cleanup), and **else** (when no exception). This topic explains the difference between **errors** (exceptions), **throws** (control flow), and **exits** (process termination), and how to use try/rescue/after so your code stays robust and predictable in production and in tooling.

---

## Errors (exceptions)

When a function cannot continue, it can **raise** an exception (e.g. `raise "message"` or `raise ArgumentError, "invalid"`). The process will crash unless the exception is **rescued**. In Elixir, rescuing is used at boundaries (e.g. external I/O, parsing untrusted input); inside a library or core logic, letting the process crash is often preferred so a supervisor can restart it. Use **rescue** when you can meaningfully recover or when you need to convert an exception into a tagged result (e.g. `{:error, reason}`) for the caller.

```elixir
try do
  raise "fail"
rescue
  e in RuntimeError -> {:error, e.message}
end
# => {:error, "fail"}
```

You can rescue specific exception modules or use a catch-all. **after** runs whether or not an exception was raised; use it for closing files or releasing resources. **else** runs when the try body completed without raising; it receives the result of the try body.

---

## Throws

**throw(value)** is a non-local return: the nearest enclosing **catch** that matches will receive the value. Throws are used for control flow (e.g. breaking out of a deep recursion or a loop simulated with recursion). Prefer **case** and tagged tuples (`:ok`/`:error`) when possible; use throw when the control flow is clearer that way.

```elixir
try do
  throw(:done)
catch
  :throw, :done -> :caught
end
# => :caught
```

---

## Exits

A process can **exit** normally or with a reason. When a process exits abnormally (e.g. because of an unhandled exception), linked processes are notified. **exit(reason)** is used to terminate the current process; it is the basis of OTP’s “let it crash” and supervision. In a try you can catch exits with `catch :exit, reason`. Exits are important for building fault-tolerant systems: links and monitors (Topic 17) and supervision (Topic 20) rely on them.

---

## After and else

**after** runs after the try (and any rescue or catch), even when an exception occurs. Use it to release resources (close sockets, files) so you do not leak them. **else** runs only when the try body completed without raising; the block receives the return value of the try body. Combining **rescue**, **after**, and **else** lets you handle errors, guarantee cleanup, and handle success in one place—useful at API boundaries and in DevOps scripts.

---

## Variable scope

Variables bound inside **try**, **rescue**, **catch**, **else**, or **after** are scoped to that block. If you need a value from the try body in the else or after block, bind it in the try and use it in the appropriate block. This avoids leaking internal state and keeps error handling clear.

---

## Further reading

- [try, catch, and rescue — HexDocs](https://hexdocs.pm/elixir/try-catch-and-rescue.html)
- [Exception module](https://hexdocs.pm/elixir/Exception.html)
