# Options and error handling

[← Back to F#](./README.md)

The **option** type represents a value that may or may not be present. It has two cases: **Some** (with a value) and **None**. Options are the standard F# way to model optional results without null. For operations that can fail with an error, **Result** (Ok / Error) or exceptions are used. This section covers the option type, the Option module, Result, when to use which, and exception handling so you can handle absence and failure correctly.

**Why options and error handling matter.** Many operations can “have no value” or fail. Options make the possibility explicit in the type; the compiler forces you to handle both **Some** and **None** in pattern matching. Using options and Result (or exceptions) consistently avoids null-reference bugs and unhandled failures. In DevOps and security, robust error handling and logging are part of production readiness.

**The option type.** **option&lt;'T&gt;** is a discriminated union: **Some v** (value present) or **None** (absent). Create with **Some 42** or **None**. You **must** handle both cases when you consume an option—typically with **match**. The **Option** module provides: **Option.map** (transform the value inside **Some**), **Option.bind** (chain operations that return option), **Option.defaultValue** (get value or a default), **Option.isSome** / **Option.isNone** (check case), **Option.iter** (run a function if **Some**). Use options for optional parameters, lookup results (e.g. **Map.tryFind** returns **option&lt;'V&gt;**), and any “maybe there is a value” case.

```fsharp
let findIndex pred list = list |> List.tryFindIndex pred   // option<int>
match findIndex ((=) 3) [1;2;3;4] with
| Some i -> printfn "Found at %d" i
| None -> printfn "Not found"
let safeDiv a b = if b = 0 then None else Some (a / b)
let result = Option.bind (fun x -> safeDiv x 2) (Some 10)   // Some 5
```

**Result type.** For operations that can fail with an **error value**, use **Result&lt;'T, 'E&gt;**: **Ok value** or **Error error**. Pattern match on both; the compiler enforces handling. **Result** is preferred over exceptions when failure is an **expected** outcome (e.g. validation, parsing, business rules). Use **Result.map**, **Result.bind**, **Result.mapError**, and **Result.defaultValue** to chain operations. Use **Result** when the caller needs to react to the error (e.g. show a message, retry); use **option** when “no value” is enough and you do not need to carry an error.

**When to use Option vs Result vs exceptions.** Use **option** when the only information is “value or nothing” (e.g. dictionary lookup). Use **Result** when you need to convey *why* something failed (e.g. **Error "invalid input"** or **Error ValidationFailure**). Use **exceptions** for truly exceptional or unexpected failures (e.g. out of memory, broken invariant). In F#, prefer option and Result for control flow; reserve exceptions for boundaries (e.g. I/O errors) and convert to Result at API boundaries so callers can handle uniformly.

**Exceptions.** For unexpected or exceptional failures, F# supports **try...with** and **try...finally**. Raise with **raise**, **failwith**, or **invalidOp**; catch with **with | :? ExceptionType as e -> ...** or **| ex -> ...**. Use exceptions sparingly in F#; prefer options and Result for expected failure paths. When you do use exceptions, log and re-raise or convert to Result at boundaries so callers can handle consistently. **try...finally** ensures cleanup (e.g. close a handle) whether or not an exception occurs.

```fsharp
try
    let x = int "not a number"
    Ok x
with :? System.FormatException as e ->
    Error (sprintf "Parse failed: %s" e.Message)
```

**Why this matters.** Options and Result make failure and absence part of the type system. That reduces null and “forgot to check” bugs. In services and scripts, combining option/Result with logging and clear error messages improves debuggability and security (e.g. not leaking internals in error output). The Option and Result modules are standard tools for composing optional and fallible operations.

---

## Further reading

- [Options (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/options)
- [Exception Handling (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/exception-handling/)
- [F# Language Reference](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/)
