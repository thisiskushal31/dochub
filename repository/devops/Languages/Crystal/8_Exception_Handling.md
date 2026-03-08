# Crystal — Exception handling

[← Crystal README](./README.md)

Errors that break the normal flow are represented by **exceptions**. You **raise** an exception to signal an error and **rescue** it to handle it. Unhandled exceptions terminate the program with a stack trace. Using exceptions for error paths keeps normal logic clear and centralizes handling.

**Why exceptions?** They separate “what went wrong” from “what to do about it.” You can raise in deep call stacks and handle at a higher level, or let the program exit with a clear message. For expected cases (e.g. “not found”), returning `nil` or a result type is often better; reserve exceptions for unexpected or unrecoverable failures.

---

## raise and rescue

**raise** throws an exception (optionally with a message or custom type). **rescue** catches it; you can restrict by exception type. **ensure** runs whether or not an exception was raised (e.g. to close resources).

```crystal
def might_fail(x)
  raise "invalid" if x < 0
  x
end

begin
  might_fail(-1)
rescue ex
  puts "Error: #{ex.message}"
ensure
  puts "cleanup"
end
```

---

## Exception types

**Exception** is the base type. Standard subtypes include **ArgumentError**, **KeyError**, **IO::Error**, and others. Rescue a specific type to handle only that kind of error.

```crystal
begin
  # ...
rescue ArgumentError
  puts "bad argument"
rescue ex : KeyError
  puts "missing key: #{ex.key}"
end
```

---

## Retry and ensure

Inside a **begin** block, **retry** re-runs the block from the start after a rescue. Use **ensure** for cleanup that must run on both success and failure.

```crystal
begin
  attempt_io
rescue IO::Error
  sleep 1
  retry
ensure
  close_connection
end
```

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal reference: Exception handling](https://crystal-lang.org/reference/syntax_and_semantics/exception_handling.html)
