# Errors, exceptions, context managers, and cleanup

[← Back to Python](./README.md)

## What this chapter covers

**Syntax errors** vs **exceptions**, **`try`/`except`/`else`/`finally`**, **exception chaining**, **exception groups** and **`except*`**, **notes**, **context managers** (**`with`**), and **`contextlib`** patterns—foundation for reliable services, transactions, and clear production logs.

---

## 1. Concepts

### 1. Syntax errors

**SyntaxError** is raised before execution; the traceback points at the offending token. **IndentationError** is a subclass—common in copy-paste and templated code.

### 2. Exceptions

**Exception** subclasses represent runtime failures. **BaseException** includes **SystemExit**, **KeyboardInterrupt**, **GeneratorExit**—usually **do not** catch **BaseException** in application **`except`** blocks unless you intend to swallow process exit.

### 3. Handling

**`except Exception as e:`** binds the instance; use **`raise`** to re-raise, **`raise New from e`** to chain. **Bare `except:`** catches everything including **KeyboardInterrupt**—avoid.

**`else`** on **try** runs when no exception occurred in **try**. **`finally`** always runs on the way out—use for cleanup paired with **with** when possible.

### 4. Chaining

**`raise RuntimeError("bad") from e`** sets **`__cause__`**. Implicit chaining records **`__context__`** when an exception occurs during handling another. Preserve chains in logs for post-mortems.

### 5. Exception groups (3.11+)

**ExceptionGroup** bundles multiple failures (e.g. concurrent tasks). **`except* TypeError`** matches and splits sub-exceptions—framework authors use this heavily; application code should understand stack traces that mention **ExceptionGroup**.

### 6. Notes

**`e.add_note("...")`** attaches diagnostic text without changing exception type—useful for request IDs and pipeline stage labels.

### 7. Context managers

**`with resource() as r:`** calls **`__enter__`** and guarantees **`__exit__(exc_type, exc, tb)`** even on exceptions. **File**, **lock**, and **database** APIs implement this pattern.

**`contextlib.closing`**, **`suppress`**, **`ExitStack`**, **`asynccontextmanager`** compose cleanup for complex setups.

---

## 2. Advanced concepts

**`__suppress_context__`** and traceback formatting interact with nested errors—logging frameworks should use **`logging.exception`** or **`exc_info=True`**.

**ResourceWarning** indicates reliance on **GC** for **`close()`**—fix with explicit **with** or **`close()`** in **`finally`**.

**`try`/`finally` without `except`** is valid—ensure **`finally`** does not raise a second exception that masks the first.

---

## 3. Applications and use cases

- **Web:** Map domain errors to HTTP status; never return raw tracebacks to clients.
- **Data:** **Transaction rollback** in **`finally`** or context managers around connections.
- **Security:** Do not include secrets in exception messages logged to shared sinks.
- **Ops:** Structured logs with **exception type**, **message**, **traceback**, **request id**.

```python
from contextlib import contextmanager

@contextmanager
def transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise

try:
    risky()
except ValueError as e:
    e.add_note("stage=parse_config")
    raise
```

---

## References

- [Errors and Exceptions](https://docs.python.org/3/tutorial/errors.html)
- [Syntax Errors](https://docs.python.org/3/tutorial/errors.html#syntax-errors)
- [Exceptions](https://docs.python.org/3/tutorial/errors.html#exceptions)
- [Handling Exceptions](https://docs.python.org/3/tutorial/errors.html#handling-exceptions)
- [Raising Exceptions](https://docs.python.org/3/tutorial/errors.html#raising-exceptions)
- [Exception Chaining](https://docs.python.org/3/tutorial/errors.html#exception-chaining)
- [User-defined Exceptions](https://docs.python.org/3/tutorial/errors.html#user-defined-exceptions)
- [Defining Clean-up Actions](https://docs.python.org/3/tutorial/errors.html#defining-clean-up-actions)
- [Predefined Clean-up Actions](https://docs.python.org/3/tutorial/errors.html#predefined-clean-up-actions)
- [Raising and Handling Multiple Unrelated Exceptions](https://docs.python.org/3/tutorial/errors.html#raising-and-handling-multiple-unrelated-exceptions)
- [Enriching Exceptions with Notes](https://docs.python.org/3/tutorial/errors.html#enriching-exceptions-with-notes)
- [contextlib](https://docs.python.org/3/library/contextlib.html)
- [Built-in Exceptions](https://docs.python.org/3/library/exceptions.html)
