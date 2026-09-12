# Error handling

[← Back to Go](./README.md)

Go does not have exceptions in the traditional sense. Errors are **values**: functions that can fail return an **error** as the last result. The caller checks the error and decides what to do (propagate, log, convert). The predeclared type **error** is an interface with a single method **Error() string**. This section covers the error type, checking and propagating errors, and common patterns so you can handle failures correctly and consistently.

**Why error handling matters.** Explicit error returns make the control flow visible: every call site that can fail must handle or pass the error up. That avoids uncaught exceptions and forces you to think about failure paths. In services and DevOps tools, robust error handling and logging are essential for debuggability and for not leaking internal details to clients.

**The error type.** The **error** interface is **type error interface { Error() string }**. Any type with an **Error() string** method implements **error**. **errors.New("message")** and **fmt.Errorf("format", args...)** create errors. **fmt.Errorf("... %w ...", err)** wraps **err**; the wrapped error is the one that supports **Unwrap() error** (returned by **fmt.Errorf** when **%w** is used). **errors.Unwrap(err)** returns the result of **err.Unwrap()** if present, else **nil**. **errors.Is(err, target)** repeatedly unwraps **err** and compares with **target** using **==**; use for sentinel checks (e.g. **errors.Is(err, io.EOF)**). **errors.As(err, &target)** repeatedly unwraps and tries to assign to **target** (a pointer to interface or type); use to extract a specific error type from the chain.

**Checking errors.** After a call that returns an error, check it: **if err != nil { ... }**. Typical handling: return the error to the caller (**return err**), add context and return (**return fmt.Errorf("doing X: %w", err)**), or log and then return or continue. Do not ignore errors; at minimum log or return. The **_, err =** assignment reuses **err** in the same scope (e.g. in a chain of calls) so you can check once at the end.

**Sentinel errors.** Some packages define **sentinel** errors (e.g. **io.EOF**, **sql.ErrNoRows**) that callers compare with **==** or **errors.Is(err, io.EOF)**. Use **errors.Is** when errors might be wrapped so that comparison still works across wrapping.

**Custom error types.** You can define a struct that implements **error** (and optionally other methods) to carry extra state. Callers can use **errors.As(err, &myErr)** to recover the concrete type when the error is wrapped.

```go
f, err := os.Open(name)
if err != nil {
	return fmt.Errorf("open %s: %w", name, err)
}
defer f.Close()
if err != nil {
	return err
}
if errors.Is(err, io.EOF) {
	// handle EOF
}
```

**Why this matters.** Consistent error handling makes code predictable and debuggable. Wrapping with **%w** preserves the chain for **errors.Is** and **errors.As**. In DevOps and security, avoid exposing internal paths or stack traces in error messages to clients; log details server-side and return safe messages. Use **errors.Is** and **errors.As** instead of direct comparison when using wrapped errors.

---

## Further reading

- [The Go Programming Language Specification: Errors](https://go.dev/ref/spec#Errors)
- [Error handling and Go](https://go.dev/blog/error-handling-and-go)
- [errors package](https://pkg.go.dev/errors)
