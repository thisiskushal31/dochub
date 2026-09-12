# Procedures, iterators, OOP, and exceptions

[← Back to Nim](./README.md)

## What this topic covers

This topic is about **structuring behavior** and **errors** in real programs:

- **procedures and funcs** for reusable logic
- **iterators** for traversal and pipeline-style code
- **objects** and common **OOP-style** patterns
- **exceptions** for failure paths and boundary handling

## Why it matters

These choices shape **API clarity**, **testability**, and how **failures** surface in operations. They sit between “syntax basics” and advanced **metaprogramming** and **memory** topics.

## How to use this material

Default to **narrow** procedures, **explicit** types at module edges, and **exceptions** only where failure is truly exceptional or forced by APIs—keep **text-first** reasoning in reviews, then add patterns like iterators or inheritance when they simplify the domain model.

## Procedures and function design

Procedures are Nim's core unit of behavior. Good design practices include:

- narrow inputs/outputs
- explicit return types in module APIs
- clear side-effect boundaries
- predictable error behavior

Text first: procedure with guard checks:

```nim
proc safeDivide(a, b: float): float =
  if b == 0.0:
    raise newException(ValueError, "division by zero")
  a / b
```

## Iterators and traversal patterns

Iterators support readable data processing and reduce loop boilerplate. They are useful for pipeline-style logic and controlled iteration over collections.

Text first: simple custom iterator:

```nim
iterator countdown(start: int): int =
  var i = start
  while i >= 0:
    yield i
    dec i

for n in countdown(3):
  echo n
```

## OOP model in Nim

Nim supports object-oriented patterns while staying pragmatic:

- object types for structured data and behavior grouping
- inheritance/polymorphic patterns where needed
- composition-first style in many systems codebases

Use OOP when it clarifies domain models, not as a default for every module.

## Exceptions and error handling strategy

Nim includes exceptions for recoverable runtime failures. In production engineering:

- define what is exceptional vs expected failure
- catch near trust boundaries (I/O, parsing, network)
- avoid swallowing exceptions silently
- propagate context-rich errors for observability

Text first: boundary handling pattern:

```nim
proc parsePort(raw: string): int =
  try:
    result = parseInt(raw)
    if result < 1 or result > 65535:
      raise newException(ValueError, "port out of range")
  except ValueError as e:
    raise newException(ValueError, "invalid port: " & e.msg)
```

## Security and operations perspective

- Keep exception messages useful but avoid leaking secrets.
- Use defensive checks in entry procedures for untrusted input.
- Log failures with enough context for on-call diagnostics.
- Prefer deterministic iterator/procedure behavior in critical workflows.

---

## Further reading

- [Tutorial, part 1](https://nim-lang.org/docs/tut1.html)
- [Tutorial, part 2](https://nim-lang.org/docs/tut2.html)
- [Nim documentation portal](https://nim-lang.org/documentation.html)
- [Language manual](https://nim-lang.org/docs/manual.html)
