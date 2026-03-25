# Testing, debugging, profiling, and observability

[← Back to OCaml](./README.md)

## What this chapter covers

How to test OCaml projects in CI, debug native binaries, profile CPU and allocation, handle errors in a structured way, and observe running services. The workflow parallels other compiled languages: symbols, debug info, and log correlation matter for incident response.

---

## 1. Tests with dune

dune defines test stanzas that build and run test executables or inline tests. `dune runtest` from the project root is the usual CI entry point. Tests should be deterministic: avoid live network unless you use recorded fixtures or mocked backends.

Alcotest is a common library for organizing tests with readable output. ppx_expect-style tests compare captured output to expected text—useful for parsers and compilers.

---

## 2. Debugging native code

Native builds integrate with gdb and lldb like C programs. Compile with debug info (`-g`, usually default in dev profiles) so stack traces include line numbers. Release binaries are often stripped; keep split debug symbols or dSYM-style artifacts if your policy requires postmortem debugging.

The toplevel (`utop`) is for interactive exploration, not for production diagnosis.

**ocamldebug** is a bytecode-oriented **source-level** debugger stepping through interpreted-style execution; native services more often rely on **gdb**/**lldb** with **DWARF** and **frame** unwinding. When stack traces look wrong, check **frame-pointer** preservation and whether **tail calls** merged frames—tail recursion is great for performance but can confuse naive stack expectations.

---

## 3. Profiling

CPU and allocation profilers show where time and GC pressure go. Microbenchmarks can be noisy because of GC; prefer longer runs or production-like inputs. Profiling guides optimization: avoid allocating in tight loops before rewriting algorithms.

**Instrumentation** options in the ecosystem include **coverage** tools (line or branch coverage in CI), **allocation** profilers that attribute **words** allocated to call stacks, and **event** tracing when the runtime supports **eventlog**-style timelines—useful for correlating **GC** pauses with **request** latency. Compare **`-O2`**/**release** profiles with **`-O0`** when investigating “only in production” behavior: **inlining** and **specialization** change costs dramatically.

---

## 4. Error handling in services

Combine `result` and structured errors at module boundaries. Log stable error codes or machine-readable reasons, not only localized strings, so automation and alerting can act on them.

---

## 5. Logging and observability

Use structured logging (JSON lines or key=value fields) with request or job IDs propagated through async chains. Integrate with whatever your platform uses (syslog, OpenTelemetry, cloud log sinks). Never log secrets or unsanitized PII without policy.

---

## Advanced use cases and implementation

Flaky async tests need explicit timeouts and deterministic clocks where possible.

Ship version strings and build identifiers with binaries so support can match symbols to source.

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
