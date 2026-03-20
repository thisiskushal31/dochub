# Testing, debugging, and observability

[← Back to Nim](./README.md)

## What this topic covers

This chapter maps **verification** (unit vs **testament**), **editor** integration (**nimsuggest**), **documentation** output, and **hygiene** tools (**nimgrep**, **nimpretty**, etc.). It explains **what each class of tool is for** in a **delivery** organization; **flag-by-flag** manuals stay in the linked **tools** and **docgen** pages.

## Why this matters

Production Nim systems need the same verification and operability discipline as any compiled stack: **fast feedback in development**, **reliable CI**, and **actionable signals** during incidents. The Nim distribution ships several tools beyond the compiler that cover **tests**, **IDE integration**, **documentation output**, and **source hygiene**.

## Testing layers

**In-process unit tests** — modules such as **`unittest`** suit many projects: suites, checks, and straightforward assertions running under the normal test runner you wire into **Nimble** or scripts.

**Integration and compiler-level tests** — **`testament`** is the heavier runner used for Nim itself. It supports **process isolation**, **multiple backends** (C, C++, Objective-C, JavaScript, and combinations), **optional Valgrind** on supported Linux targets, **HTML reports**, **skip lists**, **dry-run simulation**, and rich **per-test specifications** (expected compile failure, stdout/stderr patterns, generated C snippets, timeouts, target matrices). Default discovery expects a **`tests/category/*.nim`** layout unless you override patterns and working directory. Point it at a specific **`nim`** binary in CI when you need reproducibility.

Choose the lightest tool that meets the risk: **`unittest`** for most app logic; **`testament`** when you must prove behavior across **targets** or **toolchain flags** the way the compiler test suite does.

Text first (simple unit test style):

```nim
import std/unittest

suite "math checks":
  test "addition":
    check 2 + 2 == 4
```

## IDE support and interactive debugging

**`nimsuggest`** exposes compiler-backed queries (definition jump, completion after **`.`**, call-context help, find-usages / rename support) to editors. It behaves as a **long-running server** (stdin for experiments, sockets by default) and respects the same **search paths** and **config** as **`nim`**. Fast compile times make this model practical; teams should ensure **CI** and **developer machines** use compatible **Nim versions** so suggestions match real builds.

For **native** debugging, use **debug-info builds** (compiler and linker flags) and your platform debugger; stack and line-trace options in the compiler user guide affect how crashes present in the field.

## Documentation as an operational artifact

**`nim doc`** generates **HTML** API docs from **`##`** comments and exported symbols; project-wide runs can emit an **`htmldocs`** tree with an index. **`doc2tex`** and **`jsondoc`** exist for LaTeX and JSON consumers. Standalone **`.md`** / **`.rst`** documents use the companion commands (**`md2html`**, **`rst2html`**, etc.); cross-file references may require **index** passes as described in the markup guide. Treat generated docs like any build product: regenerate in **CI** or **release** pipelines when public API stability matters, and serve **HTML** over HTTP locally if search or CORS behavior requires it.

## Code search, formatting, and packaging utilities

- **`nimgrep`** — Nim-aware search and replace across trees (useful refactors and audits).
- **`nimpretty`** — formatter aligned with the official style guide; good for pre-commit or CI **style gates** when combined with **`--styleCheck`** on the compiler.
- **`niminst`** — generate installers for shipping Nim programs on supported platforms.
- **`c2nim`** — assists turning C headers into Nim interfaces; output still needs human review for ABI and safety.

## Workspace and dependency tooling

**`atlas`** clones packages into an **isolated workspace** of projects and dependencies—complementary to **Nimble**-centric flows when you want a different layout or experimentation sandbox. Pick one primary workflow per repo to avoid duplicated lockfiles and confusion.

## Hot reload (advanced)

**Hot code reloading** reloads **individual modules** while a process keeps running; the **main** module is not reloadable in the usual workflow, so logic lives in **helper modules** triggered by your app (for example a keypress or IPC). Enable with the **`--hotcodereloading:on`** compiler mode. Native builds in this mode lean on **runtime support libraries** and **dynamic libraries** under the **nim cache**; treat this as **development-only** complexity—wider **DLL** surface and loader behavior are rarely what you want in hardened production images. The **JavaScript** path uses different mechanics; see the dedicated guide for constraints.

## Operations guidance

- Keep **tests mandatory in CI**; fail builds on skipped critical paths.
- Separate **debug** and **release** diagnostics (traces, assertions, logging volume).
- **Pin** the **`nim`** binary path in **`testament`** jobs when parallel toolchains exist.
- Design **logs and metrics** for on-call use; Nim does not replace your observability backend.
- For **security-sensitive** code, add tests at **FFI boundaries** and under **multiple `--mm`** modes if you support them.

---

## Further reading

- [Tools overview](https://nim-lang.org/docs/tools.html)
- [Testament](https://nim-lang.org/docs/testament.html)
- [unittest module](https://nim-lang.org/docs/unittest.html)
- [Nimsuggest / IDE integration](https://nim-lang.org/docs/nimsuggest.html)
- [Documentation generator](https://nim-lang.org/docs/docgen.html)
- [Nim-flavored Markdown and reStructuredText](https://nim-lang.org/docs/markdown_rst.html)
- [rst module (parser)](https://nim-lang.org/docs/rst.html)
- [nimgrep](https://nim-lang.org/docs/nimgrep.html)
- [niminst](https://nim-lang.org/docs/niminst.html)
- [atlas](https://nim-lang.org/docs/atlas.html)
- [Hot code reloading](https://nim-lang.org/docs/hcr.html)
- [Compiler user guide](https://nim-lang.org/docs/nimc.html)
