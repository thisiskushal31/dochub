# Control flow, functions, environments, and scoping

[← Back to R](./README.md)

## What this chapter covers

How R **evaluates** code: lexical scoping, **environments** as first-class objects, **lazy evaluation** of function arguments (promises), **closures**, and the boundary between “expressive metaprogramming” and “unmaintainable magic.” This chapter matters because much of the tidyverse and modeling APIs rely on **non-standard evaluation (NSE)**; production teams need explicit rules for where NSE is allowed, how to test it, and how to avoid hidden global state.

---

## 1. Concepts

### 1. Lexical scoping and the environment chain

R resolves symbols by walking **environment chains**: local function environment → enclosure → parent frames until a binding is found. This is **lexical** scoping: where a function was **defined** matters, not where it is called (with nuances around promises and `eval`).

Practical consequence: a function that **appears** self-contained may still read globals unless you discipline free variables.

### 2. Environments are mutable maps

An environment maps names to values and has a **parent** pointer. Package namespaces and function evaluation frames are environments. That makes R flexible—and makes **mutable state** easy to abuse.

### 3. Functions: closures and factories

A **closure** is a function bundled with its enclosing environment state. Closures enable factories, counters, and memoization. They also enable accidental long-lived memory retention if environments capture large objects.

### 4. Lazy evaluation (promises)

Function arguments are generally **promises**: not evaluated until needed (and sometimes not at all). That powers defaults like `sample(x, size = length(x))` where `size` can refer to `x` before `x` is evaluated—because argument evaluation is staged.

Operational consequence: side effects in argument expressions can run **later than you expect** or **zero times** if the argument is unused.

### 5. Control flow primitives

`if` requires a scalar-like logical decision (be careful with vectors—use `ifelse`, `dplyr::case_when`, or explicit indexing for vectorized decisions). `for` loops are clear and sometimes fastest after profiling; **vectorization** is not always the winning move—measure.

---

## 2. Advanced concepts

### 1. `substitute()`, `quote()`, `eval()`, and the NSE boundary

Metaprogramming allows capturing unevaluated expressions and evaluating them in chosen environments. This is how many DSLs work—and why **`...`** misspellings can silently disappear into **`...`** capture.

Staff governance patterns:

- restrict NSE to **well-named wrapper functions** with tests,
- provide **standard-evaluation (SE)** alternatives (`_at`, `_if` patterns in dplyr-style APIs),
- forbid `eval(parse(...))` on external strings in production.

### 2. `<<-` and `assign(..., envir=)`

These mutate bindings in **parent** environments. Occasionally necessary for advanced patterns; by default treat them as **code smell** in analytics repos because they break reasoning and testing.

### 3. `on.exit()` for resource hygiene

Use `on.exit()` to close connections, release files, and restore options when a function returns or errors—critical for production pipelines that must not leak connections under failure.

### 4. Exception handling: `tryCatch` vs swallowing

`silent=TRUE` error swallowing is how dashboards ship wrong numbers. Prefer structured errors with context; convert to non-zero exit at the job boundary.

### 5. S3 dispatch touches almost everything (preview)

Generics like `print`, `summary`, `[`, and arithmetic dispatch methods based on **class** attributes. Debugging “why does `[` do that?” often ends at S3/S4 dispatch—chapter 4 ties structures to this behavior.

---

## 3. Applications and use cases

- **Package design:** pure transforms + explicit I/O at boundaries; avoid globals.
- **CI-safe scripts:** no interactive prompts; deterministic option setup.
- **Security-sensitive paths:** never `parse()` network-provided code.

```r
f <- function(x, label = deparse(substitute(x))) {
  # label illustrates lazy/substitute interplay — use carefully in public APIs
  list(value = x + 1L, label = label)
}

make_adder <- function(delta) {
  function(x) x + delta
}
add2 <- make_adder(2)
add2(3)
```

### Staff-level review checklist

- Free variables in functions are eliminated or explicitly injected for testing.
- NSE is scoped, tested, and paired with SE escape hatches where applicable.
- Resource cleanup uses `on.exit` or equivalent patterns for connections and files.
- Error handling preserves context and maps to non-zero exits for batch jobs.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-lang.html
- https://cran.r-project.org/doc/manuals/r-devel/R-ints.html
