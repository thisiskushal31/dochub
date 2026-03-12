# Exception handling and resources

[← Back to F#](./README.md)

F# supports **try...with** to catch exceptions and **try...finally** to run cleanup. The **use** keyword ties a resource’s lifetime to scope so it is disposed when execution leaves the scope. This section covers exception handling and resource management so you can write robust, leak-free code when calling .NET or doing I/O.

**Why exception handling and resources matter.** .NET APIs and I/O can throw; you need to catch, log, and either re-raise or convert to a Result. Resources (files, connections, handles) must be disposed; **use** and **using** ensure that happens even when an exception occurs. In services and DevOps scripts, correct handling avoids leaks and ensures errors are visible and actionable.

**try...with.** Use **try** *expression* **with** *pattern* -> *handler* to catch exceptions. Match on exception type: **| :? System.IO.IOException as e -> ...**. You can match on the exception object and extract information (e.g. **e.Message**). After handling you can return a value (e.g. **Error e.Message**), **reraise()** to re-throw the same exception while preserving the stack trace, or **raise** a new exception. The whole try/with is an expression; its type is the common type of all branches, so every handler must return the same type (e.g. **Result** or **option**).

```fsharp
let readAll path =
    try
        System.IO.File.ReadAllText path |> Ok
    with
    | :? System.IO.FileNotFoundException as e -> Error e.Message
    | :? System.UnauthorizedAccessException -> Error "Access denied"
```

**try...finally.** Use **try** *expression* **finally** *cleanup* to run cleanup code whether the try block succeeds or throws. The finally block runs before the exception propagates. Use for releasing resources when you are not using **use**.

**use and using.** A **use** binding disposes the bound value when execution leaves the scope (normal exit or exception). The type must support **IDisposable**. Syntax: **use resource = createResource ()** then use *resource* in the block. The compiler inserts a **try...finally**-style dispose. In computation expressions (e.g. **async { }**), **use!** binds a disposable result and disposes it when the scope ends. The **using** function takes a disposable and a function and disposes after the function returns. Prefer **use** in F# for clarity and correct disposal even when an exception occurs.

```fsharp
use stream = System.IO.File.OpenRead "file.txt"
// use stream ...
// disposed here
```

**Why this matters.** In production, unhandled exceptions can crash the process; caught exceptions should be logged and either converted to a Result or re-raised with context. Disposable resources that are not disposed can cause handle leaks and connection exhaustion. Using **use** and consistent exception handling is part of writing reliable F# and .NET code.

---

## Further reading

- [Exception Handling (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/exception-handling/)
- [The try...with Expression (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/exception-handling/the-try-with-expression)
- [The try...finally Expression (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/exception-handling/the-try-finally-expression)
- [The use Keyword (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/resource-management-the-use-keyword)
