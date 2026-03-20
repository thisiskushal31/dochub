# Standard library essentials

[← Back to Nim](./README.md)

## What this topic covers

This chapter is about **how Nim’s standard library is organized**, **which families of modules** you will touch first, and **how to navigate** thousands of symbols without memorizing names. It does **not** list every procedure—that belongs in the **library index** and per-module pages linked at the end. The goal is a **mental map**: pure vs impure vs wrappers, common clusters (text, OS, collections, time), and where **async**, **networking**, and **serialization** sit so you can jump to the right docs when building.

## Why stdlib mastery matters

Nim’s standard library is broad enough that many tasks need **no third-party packages**. Staying in the stdlib often means **fewer moving parts** in security review, simpler upgrades, and clearer behavior across platforms—as long as you respect the **pure vs impure** split (see below).

## How the library is organized

The documentation groups modules into:

- **Pure libraries** — implemented without requiring extra `*.dll` / `lib*.so` beyond what the language runtime already implies for your target.
- **Impure libraries** — depend on external native binaries or OS facilities in ways that matter for packaging and auditing.
- **Wrappers** — thin, low-level facades over **C** libraries; powerful but usually closer to unsafe boundaries.

There is also an **automatic import**: the **`system`** module (basic procs, operators, fundamental IO) is **implicitly available**. You should **not** import `system` yourself; the compiler treats it specially.

For **how names are chosen** in the library (short abbreviations, `init` vs `new`, `len` vs `size`, iterators named **`items`** / **`pairs`**, etc.), the maintained **API naming** overview complements the **style guide** used for contributor-facing rules.

## Module families to know first

These clusters cover most day-to-day engineering without reaching for Nimble immediately:

- **Collections** — hash tables, ordered maps, sets, deques, heaps, linked lists, optional values, and related structures.
- **Algorithms** — sorting, searching, and sequence/set utilities often used in data preparation and tooling.
- **String handling** — splitting, searching, Unicode, formatting and interpolation helpers, encoding conversion, scanf-style parsing.
- **Time** — wall-clock and monotonic time APIs for logging, metrics, and scheduling.
- **Generic OS services** — files, paths, environment, processes, and cross-platform OS integration (with platform-specific modules when you must specialize).
- **Math and numerics** — common math, bit operations, and related low-level helpers where relevant.
- **Threading and synchronization** — locks, atomics, and concurrent structures when you compile with threading enabled.
- **Networking and protocols** — sockets, HTTP client/server building blocks, and related types (exact surface evolves with releases—check the index for your version).
- **Serialization and parsing** — JSON and other formats, plus lexer/parser utilities for custom grammars.
- **JavaScript backend** — dedicated modules for browser or Node-oriented targets; irrelevant for pure native builds but important if you share code across backends.

## Concurrency, async I/O, and networking (how it fits together)

For **servers**, **proxies**, and **high-concurrency clients**, Nim’s ecosystem usually combines:

- **Thread-based** work: explicit **threads**, locks, and channels when you compile with **threading** enabled and model shared state carefully.
- **Async I/O**: cooperative **futures** / **async** procedures backed by a runtime **event loop**, typically used with **TCP/UDP** and **HTTP** client/server modules in the standard library. This style avoids one OS thread per connection but requires **disciplined** async/await flow—**blocking** calls in the wrong place stall the loop.
- **Memory management interaction**: **reference cycles** and **closure** graphs show up often in async code; that is why **ORC** vs **ARC** and cycle collection matter in real services (see the memory topic).

You do not need to pick one model for the whole system—many designs use **threads** for CPU work and **async** for I/O, with clear queues between them. Exact **module names**, **procedure signatures**, and **deprecation** status change between releases; use the **searchable index** and the **async** / **net** / **http** module pages when implementing.

When you outgrow the basics, the **Nimble** ecosystem extends the stack; treat external packages as **supply-chain** decisions. Discover and evaluate packages with the **Nimble CLI** (for example **`nimble search`**) and your team’s own curation policy—do not depend on a single public web directory staying available.

## Docs for APIs and standalone guides

Exported symbols and module-level **`##`** comments feed **`nim doc`** output (HTML, LaTeX, or JSON). For **Markdown** or **reStructuredText** handbooks and specs outside `.nim` sources, the compiler exposes commands such as **`nim md2html`**, **`nim md2tex`**, **`nim rst2html`**, and **`nim rst2tex`**—same family as docgen, with Nim-specific markup rules and limitations. Treat doc builds as part of **release** and **CI** when customers or other teams depend on them.

## Text-first example

Combining common stdlib imports:

```nim
import std/[strutils, sequtils]

let nums = @["1", "2", "3"]
let parsed = nums.map(parseInt)
echo parsed
```

## Engineering guidance

- Prefer **stdlib** for filesystem, text, collections, and time until a package clearly buys maintainability or performance you cannot get otherwise.
- Classify dependencies as **pure vs impure** when threat-modeling deployments (especially minimal containers and locked-down hosts).
- For **wrappers**, read the underlying C library’s contract; Nim cannot magically make unsafe C APIs memory-safe.
- Use the **searchable index** when you know the task (“JSON”, “async”, “os”) but not the module name.

---

## Further reading

### Navigation and API reference

- [Standard library index](https://nim-lang.org/docs/lib.html)
- [Searchable documentation index](https://nim-lang.org/docs/theindex.html)
- [API naming design](https://nim-lang.org/docs/apis.html)

### Concurrency and I/O (module-level detail)

- [asyncdispatch](https://nim-lang.org/docs/asyncdispatch.html)
- [httpclient](https://nim-lang.org/docs/httpclient.html)
- [asynchttpserver](https://nim-lang.org/docs/asynchttpserver.html)
- [Language manual](https://nim-lang.org/docs/manual.html)

### Docs tooling

- [Documentation generator](https://nim-lang.org/docs/docgen.html)
- [Nim-flavored Markdown and reStructuredText](https://nim-lang.org/docs/markdown_rst.html)
- [rst module (parser)](https://nim-lang.org/docs/rst.html)

### Packages

- [Nimble (package manager)](https://github.com/nim-lang/nimble)
