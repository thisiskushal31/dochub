# Testing, debugging, profiling, and observability

[← Back to OCaml](./README.md)

## What this chapter covers

How to test OCaml projects in CI, debug native binaries, profile CPU and allocation, handle errors in a structured way, and observe running services. The workflow parallels other compiled languages: symbols, debug info, and log correlation matter for incident response.

```bash
dune runtest
```

---

## 1. Tests with dune

dune defines test stanzas that build and run test executables or inline tests. `dune runtest` from the project root is the usual CI entry point. Tests should be deterministic: avoid live network unless you use recorded fixtures or mocked backends.

Alcotest is a common library for organizing tests with readable output. ppx_expect-style tests compare captured output to expected text—useful for parsers and compilers.

```scheme
(test
 (name my_test)
 (libraries alcotest mylib))
```

---

## 2. Debugging native code

Native builds integrate with gdb and lldb like C programs. Compile with debug info (`-g`, usually default in dev profiles) so stack traces include line numbers. Release binaries are often stripped; keep split debug symbols or dSYM-style artifacts if your policy requires postmortem debugging.

The toplevel (`utop`) is for interactive exploration, not for production diagnosis.

**ocamldebug** is a bytecode-oriented **source-level** debugger stepping through interpreted-style execution; native services more often rely on **gdb**/**lldb** with **DWARF** and **frame** unwinding. When stack traces look wrong, check **frame-pointer** preservation and whether **tail calls** merged frames—tail recursion is great for performance but can confuse naive stack expectations.

```bash
lldb _build/default/bin/myexe
# (gdb) run / (lldb) run — same as C
```

---

## 3. Profiling

CPU and allocation profilers show where time and GC pressure go. Microbenchmarks can be noisy because of GC; prefer longer runs or production-like inputs. Profiling guides optimization: avoid allocating in tight loops before rewriting algorithms.

**Instrumentation** options in the ecosystem include **coverage** tools (line or branch coverage in CI), **allocation** profilers that attribute **words** allocated to call stacks, and **event** tracing when the runtime supports **eventlog**-style timelines—useful for correlating **GC** pauses with **request** latency. Compare **`-O2`**/**release** profiles with **`-O0`** when investigating “only in production” behavior: **inlining** and **specialization** change costs dramatically.

```bash
# Example: time + allocations — use your org’s standard perf wrapper
perf record -g -- ./_build/default/bin/myexe
```

---

## 4. Error handling in services

Combine `result` and structured errors at module boundaries. Log stable error codes or machine-readable reasons, not only localized strings, so automation and alerting can act on them.

**Language-wide stance:** avoid encoding failures as **ordinary** return values that look like success (magic sentinels); prefer **`option`**, **`result`**, or in rare cases **exceptions** for control flow that should not appear in types. **`exn`** is an **extensible** sum—libraries add constructors over time—so treat any function that can **`raise`** as documented risk unless you wrap it. **`try … with …`** handles exceptions locally; when you re-raise, use **`Printexc`** helpers or your standard library’s helpers if you need to **preserve backtraces** across handlers. Effect-based error models on OCaml 5 are still ecosystem-specific—standardise in your repo before mixing styles.

```ocaml
type err = [ `Not_found | `Invalid ]

let load path : (string, [> err ]) result =
  if path = "" then Error `Invalid else Ok (path ^ ":data")
```

---

## 5. Logging and observability

Use structured logging (JSON lines or key=value fields) with request or job IDs propagated through async chains. Integrate with whatever your platform uses (syslog, OpenTelemetry, cloud log sinks). Never log secrets or unsanitized PII without policy.

```ocaml
let log_json ~request_id ~msg =
  Printf.printf {|{"request_id":"%s","msg":"%s"}|} request_id msg
```

---

## 6. Observability contracts and incident readiness

A practical observability contract for OCaml services includes:

- Stable log fields (`service`, `version`, `request_id`, `error_code`).
- Metrics with bounded cardinality and clear units.
- Trace propagation across async boundaries.
- Build metadata embedded in binaries for exact symbol/source matching.

Without these contracts, postmortems degrade into guesswork even when logs exist.

```ocaml
let version = "1.2.3"

let () =
  Printf.printf "service=myapi version=%s\n%!" version
```

---

## 7. Pretty-printing with `Format` (boxes and break hints)

The stdlib **`Format`** module implements a **pretty-printing engine**: you **open boxes** (layout regions), emit **break hints** (“if the line is full, break here with this indent; otherwise print a space”), and **close** boxes like nested parentheses. **`Format.printf`** / **`fprintf`** accept **`@`**-annotations in the format string to open/close boxes and insert breaks without dozens of tiny helper calls.

**Practical rules** (mirroring upstream guides): nest **`open`/`close`** consistently; prefer **break hints** over hard-coded spaces for flexible layout; avoid embedding raw **newline** characters in strings you feed to `Format`—use **vertical** boxes or hints when you need guaranteed line breaks; end interactive `printf` sessions with a **`print_newline`**-style flush so buffers actually emit. For libraries, take a **`formatter`** (`pp` functions) so callers can direct output to **stdout**, **stderr**, **buffers**, or logs.

**`Printf` and typed formats:** **`Printf.printf`** / **`fprintf`** use **typed** format strings—the compiler checks that **`%d`**, **`%F`**, **`%s`**, etc. match argument types. The **`%a`** specifier composes **custom printers** `(formatter -> 'a -> unit)` so you build reusable pretty-printers for domain types (the **manual’s “Printf formats”** section). Storing a format in a **value** often needs an explicit **`(_ format)`** annotation so inference stays stable.

```ocaml
open Format

let () =
  printf "@[<v>line1@,line2@]@."
```

---

## 8. More debugging tools: traces, backtraces, and source locations

The **toplevel** can trace selected functions (`#trace` / `#untrace`) to print call/return events—fast for small reproducers; **polymorphic** functions trace with less readable arguments unless you add a **type constraint** to make the trace monomorphic.

For **uncaught exceptions**, enable printing a **backtrace** with **`OCAMLRUNPARAM`** (the **`b`** flag in common setups)—works with binaries built by **dune** the same way as hand-invoked compilers. Compiler built-ins like **`__LOC__`** and **`__POS__`** expand to source locations in error messages and logs.

**Bytecode** programs compiled with **`-g`** work with **`ocamldebug`** (step, breakpoints, **`bt`**). **Native** services still usually use **gdb**/**lldb**. For **multicore** races, see chapter 6 on **Thread Sanitizer**.

```bash
export OCAMLRUNPARAM=b
./_build/default/bin/myexe
```

---

## 9. Profiling: what you are measuring

Profiler guides often walk down to **assembly** to show how **`ocamlopt`** represents calls and allocations. You do not need to read asm for day-to-day work, but you should internalise the idea: **hot paths** are a mix of **your** logic, **stdlib** code, **allocation rate**, and **GC**. A profile that attributes time to **known** functions is enough to choose between algorithm changes, **container** changes, or **reducing** closure and allocation churn.

```ocaml
(* Profile attribution: time in List.map vs your [f] vs GC *)
let work xs = List.map String.uppercase_ascii xs
```

---

## Advanced use cases and implementation

Flaky async tests need explicit timeouts and deterministic clocks where possible.

Ship version strings and build identifiers with binaries so support can match symbols to source.

```ocaml
let build_id = "git-abc1234"
```

---

## References

### Primary — guides

- [Debugging](https://ocaml.org/docs/debugging)
- [Profiling](https://ocaml.org/docs/profiling)
- [Error Handling](https://ocaml.org/docs/error-handling)
- [Formatting and Wrapping Text](https://ocaml.org/docs/formatting-text)

### Primary — dune and manual

- [Dune: tests](https://dune.readthedocs.io/en/stable/tests.html)
- [Debugger](https://ocaml.org/manual/debugger.html)

### Community

- [Alcotest](https://github.com/mirage/alcotest)
