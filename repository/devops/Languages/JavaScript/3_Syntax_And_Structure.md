# Syntax and structure

JavaScript code is made of **statements**: declarations, expressions, and control flow. This topic covers how code is structured (statements, semicolons, automatic semicolon insertion), comments, strict mode, and **exception handling** in depth: `try/catch/finally`, the error object, `throw`, built-in and custom errors, and how to handle failures so scripts behave predictably in production and in automation.

---

## Statements

A **statement** is a unit of code that performs an action: an expression (e.g. a function call), a declaration (variable, function), or a control construct (if, loop, try/catch). Statements are separated by semicolons or by line breaks where the engine inserts a semicolon automatically. Multiple statements can appear on one line separated by semicolons, but usually one statement per line is used for readability.

---

## Semicolons and automatic semicolon insertion (ASI)

Semicolons terminate statements. In many cases the engine will insert a semicolon at the end of a line if it would otherwise be the end of a statement—this is **automatic semicolon insertion (ASI)**. So you can omit semicolons and the code may still run. Relying on ASI can be risky: the rules are subtle and a few cases produce different behavior than you might expect.

**Where ASI does not insert a semicolon:** If the next line can be parsed as a continuation of the current expression, no semicolon is inserted. For example, a line ending with `+`, `,`, or `[` is continued on the next line. That is usually what you want. But a line that *starts* with `[` or `(` can be interpreted as part of the previous line (e.g. as a property access or function call), which can cause bugs.

Example: after `alert("Hello")` with no semicolon, the next line `[1, 2].forEach(alert)` is parsed as `alert("Hello")[1, 2].forEach(alert)`—property access on the return value of `alert`. That is wrong. So when the next statement starts with `[` or `(`, either put a semicolon at the end of the previous statement or be aware of ASI. Many style guides recommend always using semicolons to avoid such edge cases.

```javascript
alert("Hello");
[1, 2].forEach(alert);
```

Without the semicolon after `alert("Hello")`, the second line is not treated as a new statement.

---

## Comments

**Single-line comments** start with `//`; the rest of the line is ignored. **Block comments** start with `/*` and end with `*/`; everything between is ignored. Block comments cannot be nested: a `/*` inside another `/* ... */` is not allowed and will break parsing. Comments are for documentation and for temporarily disabling code; minifiers typically strip them in production builds.

---

## Strict mode

The directive `"use strict"` (or `'use strict'`) enables **strict mode** for the script or for the function in which it appears. It must be at the very top of the script (only comments may appear before it); otherwise it has no effect. In strict mode, several legacy or error-prone behaviors are removed or turned into errors: for example, assigning to an undeclared variable throws instead of creating a global, and some syntax is disallowed. Classes and ES modules enable strict mode by default. For scripts that are not modules, putting `"use strict";` at the top is recommended so that mistakes are caught early. There is no way to turn strict mode off once it is on.

---

## Exception handling: try, catch, finally

When a **runtime error** occurs (e.g. a thrown exception or a reference to an undefined variable), the normal flow of execution is interrupted. **try/catch** lets you run a block of code and, if an exception is thrown inside it, transfer control to a **catch** block so the script can handle the error instead of terminating.

**Syntax:** The `try` block contains the code that might throw. The `catch` block runs only if an exception is thrown in `try`; it receives the thrown value (conventionally named `err` or `e`). After `catch`, execution continues after the whole try/catch. If no exception is thrown, `catch` is skipped. An optional **finally** block runs in all cases: after `try` completes normally or after `catch` runs (or even when `try` or `catch` exit via `return`). Use `finally` for cleanup (e.g. closing a handle) that must run whether or not an error occurred.

```javascript
try {
  // code that may throw
  let data = JSON.parse(someString);
} catch (err) {
  // handle the error
  console.error("Parse failed:", err.message);
} finally {
  // runs always (after try or after catch)
  cleanup();
}
```

**try/catch only catches runtime errors.** If the code inside `try` is syntactically invalid, the engine cannot run it at all (parse-time error), so there is no “execution” to catch. Only errors that occur *during* execution of valid code can be caught.

**try/catch is synchronous.** If you schedule work asynchronously (e.g. with `setTimeout` or a promise), the callback runs later, outside the try block. An exception thrown inside that callback is *not* caught by the try that scheduled it. You must use try/catch inside the callback, or handle promise rejections with `.catch()` / async function try/catch.

```javascript
try {
  setTimeout(() => {
    throw new Error("in callback");
  }, 100);
} catch (err) {
  // never runs; the throw happens later
}
setTimeout(() => {
  try {
    throw new Error("in callback");
  } catch (err) {
    console.error(err.message); // handled here
  }
}, 100);
```

---

## The error object and optional catch binding

When an error is thrown (by the engine or by your code), JavaScript typically provides an **error object** with at least:

- **name:** The type of error (e.g. `"ReferenceError"`, `"TypeError"`, `"SyntaxError"`).
- **message:** A human-readable description.

Many environments also provide **stack**, a string representing the call stack at the time the error was created; useful for debugging. The catch clause receives this object. If you do not need it, you can omit the binding: `catch { ... }` (optional catch binding).

```javascript
try {
  nonexistent;
} catch (err) {
  console.error(err.name);    // ReferenceError
  console.error(err.message); // nonexistent is not defined
  console.error(err.stack);   // stack trace
}
```

---

## Throwing errors: throw

Use the **throw** statement to signal an error. You can throw any value (number, string, object), but convention and tooling expect an **Error** instance or a subclass so that `name`, `message`, and `stack` are available. Built-in constructors include **Error**, **SyntaxError**, **ReferenceError**, **TypeError**, **RangeError**, **URIError**. Use them to create and throw errors.

```javascript
if (!user.name) {
  throw new Error("User name is required");
}
throw new TypeError("Expected a number");
```

After `throw`, execution stops and control jumps to the nearest enclosing `catch`, or the script terminates if there is none. So `throw` is a non-local exit.

---

## Built-in error types

- **Error:** Generic base; use for application-level errors.
- **SyntaxError:** Invalid syntax (e.g. invalid JSON in `JSON.parse`).
- **ReferenceError:** Reference to an undeclared variable.
- **TypeError:** Wrong type (e.g. calling a non-function, or invalid property access).
- **RangeError:** Value out of allowed range (e.g. invalid array length).
- **URIError:** Error in encoding/decoding (e.g. `decodeURIComponent` with invalid input).

Using the right type helps when handling errors: you can catch `SyntaxError` from `JSON.parse` and handle it separately from your own validation errors. For example, when parsing JSON from the network or from user input, wrap the parse in try/catch so invalid data does not crash the script; then validate the parsed object and throw your own error (e.g. `ValidationError`) if required fields are missing, so the caller gets a clear, domain-specific message.

```javascript
let json = getDataFromNetwork();
let user;
try {
  user = JSON.parse(json);
} catch (err) {
  if (err instanceof SyntaxError) {
    console.error("Invalid JSON:", err.message);
    return;
  }
  throw err;
}
if (!user.name) throw new Error("Missing field: name");
```

---

## Custom errors and extending Error

You can define your own error classes by extending **Error**. That gives you a recognizable type (e.g. `ValidationError`, `NotFoundError`) and lets you add extra properties (e.g. `statusCode`, `field`). Always call **super(message)** in the constructor so `message` and the base behavior are set. Set **this.name** to the class name so that stack traces and `err.name` are correct. Then use **throw new MyError(...)** and in catch use **instanceof MyError** to distinguish your errors from others.

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
try {
  if (!data.age) throw new ValidationError("Missing: age");
} catch (err) {
  if (err instanceof ValidationError) {
    console.error("Validation failed:", err.message);
  } else {
    throw err;
  }
}
```

**Rethrowing:** If you cannot handle an error, rethrow it with `throw err` so that a higher-level catch or the environment can handle it. Do not swallow errors unless you intentionally ignore them (and log or document why).

---

## Wrapping exceptions and error chains

When a function can throw several low-level errors (e.g. `SyntaxError` from `JSON.parse`, plus your own `ValidationError`), callers would have to check for each type. A common pattern is **wrapping**: catch low-level errors inside the function and throw a single higher-level error type (e.g. **ReadError**) that carries the original error in a property (e.g. **cause**). Callers then only need to check for `ReadError` and can inspect `err.cause` if they need details.

```javascript
class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "ReadError";
    this.cause = cause;
  }
}
function readUser(json) {
  try {
    let user = JSON.parse(json);
    if (!user.name) throw new ValidationError("No name");
    return user;
  } catch (err) {
    if (err instanceof SyntaxError || err instanceof ValidationError) {
      throw new ReadError("Failed to read user", err);
    }
    throw err;
  }
}
```

This keeps the public API of `readUser` simple (one error type) while preserving the chain of causes for logging or debugging.

---

## Uncaught errors and global handlers

When an exception is never caught, it becomes an **uncaught** error. In the **browser**, the script stops and the error is reported in the console; you can also listen with **window.onerror** (and in some environments **window.onunhandledrejection** for promise rejections) to log or report errors to a service. In **Node.js**, uncaught exceptions and unhandled promise rejections can be handled with **process.on('uncaughtException')** and **process.on('unhandledRejection')**; these are last-resort handlers for logging or graceful shutdown—they do not replace proper try/catch and promise rejection handling in your code. For scripts that run in CI or as CLI tools, letting an uncaught exception exit the process with a non-zero code is the correct way to signal failure; for long-running servers, log the error and decide whether to exit or continue.

---

## finally and cleanup

The **finally** block runs after the try (and catch, if present) complete—whether they complete normally, with return, or by throwing. If finally throws, that exception replaces any exception that was in progress. Use finally for releasing resources (e.g. closing a file handle or clearing a timer) so that cleanup runs even when an error occurs. Do not use finally to “fix” or swallow errors; use it only for side effects that must run.

---

## Summary

Statements are separated by semicolons or by line breaks where ASI applies; be careful when the next line starts with `[` or `(`. Comments use `//` or `/* */`. Strict mode is enabled with `"use strict"` at the top of the script. Exception handling uses **try/catch/finally**: only runtime errors are caught, and only for code that runs synchronously inside the try block. The error object has **name**, **message**, and often **stack**. Use **throw** with **Error** or subclasses; extend **Error** for custom error types and use **instanceof** in catch. Wrap low-level errors in a higher-level type with a **cause** when that simplifies the caller. Use **finally** for cleanup; rethrow when you cannot handle an error so that callers or the environment can.

---

## Further reading

- [javascript.info – Code structure](https://javascript.info/structure)
- [javascript.info – The modern mode, "use strict"](https://javascript.info/strict-mode)
- [javascript.info – Error handling, "try...catch"](https://javascript.info/try-catch)
- [javascript.info – Custom errors, extending Error](https://javascript.info/custom-errors)
- [MDN – try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [MDN – Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
