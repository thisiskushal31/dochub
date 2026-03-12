# Defer, panic, and recover

[← Back to Go](./README.md)

**defer** schedules a function call to run when the surrounding function returns (normally or via panic). **panic** stops normal execution and runs deferred functions; when they finish, the program crashes unless **recover** is used. **recover** is only useful inside a deferred function; it captures the panic value and stops the panic propagation. This section covers defer, panic, and recover so you can use them for cleanup and for handling unrecoverable failures.

**Why defer, panic, and recover matter.** **defer** is the standard way to ensure cleanup (close files, unlock mutexes) no matter how the function exits. **panic** is for truly unrecoverable situations (e.g. programmer error, invariant violated); it is not the normal error path. **recover** is for converting a panic into an error at a boundary (e.g. in an HTTP handler or a worker goroutine) so the process can continue. Misuse (e.g. panicking for expected failures, or recovering and then not handling the error) leads to confusing behavior.

**defer.** **DeferStmt** = `defer` Expression. The expression is usually a function call. The **arguments** (and receiver, if a method) are evaluated when the defer runs, not when the surrounding function returns; the **call** executes when the function returns. Deferred calls run in **LIFO** order. So **defer f(i)** captures **i** at defer time; **defer func() { f(i) }()** would capture **i** at call time. Even on panic, deferred functions run before the panic propagates. Use defer for **Close**, **Unlock**, and for **recover** in a deferred closure.

**panic.** The built-in **panic(v)** stops normal execution. The value **v** can be any type; often it is a string or an **error**. The runtime runs all deferred functions in the current goroutine in reverse order; if a deferred function calls **recover**, the panic stops and **recover** returns the value passed to **panic**. If no recover catches the panic, the program exits (typically with a stack trace). Panic is for bugs and unrecoverable conditions, not for expected failures like “file not found”; use **error** for those.

**recover.** The built-in **recover()** returns the value passed to **panic** if the current goroutine is panicking and **recover** was called from within a deferred function. Otherwise **recover** returns **nil**. So you must call **recover** inside a **defer** (e.g. **defer func() { if x := recover(); x != nil { ... } }()**). Recover does not work from another goroutine; each goroutine’s panic is independent. After a successful recover, execution continues normally in the deferred function; the panicking function does not resume.

```go
f, err := os.Open(name)
if err != nil {
	return err
}
defer f.Close() // runs when function returns, even on panic
// ... use f ...
```

**Why this matters.** **defer** keeps cleanup next to acquisition and ensures it runs; use it for every resource that must be released. Reserve **panic** for programmer errors and invariants; use **error** for operational failures. **recover** at boundaries (e.g. top of a goroutine or HTTP handler) can prevent one panicking goroutine from killing the whole process, but you must then handle the recovered value (log it, return an error) and not pretend the program is still in a valid state if you cannot guarantee it.

---

## Further reading

- [The Go Programming Language Specification: Defer statements](https://go.dev/ref/spec#Defer_statements)
- [Defer, Panic, and Recover](https://go.dev/blog/defer-panic-and-recover)
- [Effective Go: Panic](https://go.dev/doc/effective_go#panic)
