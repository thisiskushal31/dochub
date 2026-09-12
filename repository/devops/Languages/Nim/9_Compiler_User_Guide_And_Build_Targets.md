# Compiler user guide and build targets

[← Back to Nim](./README.md)

## What this topic covers

This chapter summarizes **how you invoke the compiler**, which **commands** map to which **artifacts**, and which **flags** matter for **checks**, **optimization**, **debuggability**, and **release** hardening. It is a **practitioner’s map**—not a copy of every switch. For **cross-compilation**, **linker** passthrough, and **warning** catalogs, use the **compiler user guide** in **Further reading**.

## Why compiler knowledge matters

The **Nim compiler** turns source into **C/C++/Objective-C** (for native targets) or **JavaScript**, then relies on platform toolchains or JS runtimes as appropriate. Flags control **optimizations**, **runtime checks**, **debuggability**, **threading**, and **artifact shape** (console vs GUI vs library). Operations and security reviews should treat the compiler like any other build tool: **pin versions**, **record flags**, and understand **what ships**.

## Command shape

Invocations follow a common pattern:

```text
nim <command> [options] <projectfile> [program arguments]
```

**Program arguments** are forwarded when you compile and **run** in one step (for example with **`--run`** / **`-r`**).

Frequently used **commands** include:

- **`c` / `compile`** — compile with the default backend (typically **C**).
- **`r`** — compile into the **nim cache** output location and **run**, using the backend selected by **`--backend`** (default **c**).
- **`doc`** — generate documentation for the input file for the selected backend.
- **`check`** — parse and semantically check without producing a full binary (useful in CI and editors).
- **`dump`** — dump defined conditionals and search paths (supports JSON output for tooling).

**Advanced commands** name the codegen explicitly: **`compileToC` / `cc`**, **`compileToCpp` / `cpp`**, **`compileToOC` / `objc`**, **`js`**. There are also helpers for **tags**, **dependency graphs**, **doc extraction**, and **Markdown/reST to HTML or TeX** when you are working on documentation pipelines.

## Path placeholders in options

Several switches accept paths with **substitutions** the compiler expands, including:

- **`$nimcache`** — nim cache directory
- **`$projectpath` / `$projectdir`** — project file location
- **`$projectname`** — project file basename without extension
- **`$config`** — directory of the module being compiled
- **`$lib`** — standard library path
- **`$nim`** — global Nim prefix

These matter when scripting **reproducible** builds or normalizing **CI** paths.

## Switches that affect engineering and risk

**Defines and configuration**

- **`-d:SYMBOL` / `--define:SYMBOL(:value)`** — set compile-time defines; **`-d:release`** is the usual **release profile** shortcut (disables many runtime checks and enables optimizations in typical setups).
- **`-u:SYMBOL` / `--undef:SYMBOL`** — undefine a conditional symbol.

**Checks and safety**

- **`-x` / `--checks:on|off`** — master toggle for **runtime checks** as a group.
- Finer switches exist for **bounds**, **overflow**, **nil**, **range**, **object conversion**, **floating-point NaN/Inf**, and related behaviors—tighten for **debuggability**, relax only with **explicit** team policy.

**Performance and size**

- **`--opt:none|speed|size`** — optimization emphasis; release workflows usually pair **`--opt:speed`** (or defaults implied by **release**) with your linker settings.

**Output shape**

- **`--app:console|gui|lib|staticlib`** — whether you emit a **console** program, **GUI** subsystem entry, **DLL**, or **static library**.

**Execution and tooling**

- **`-r` / `--run`** — run after compile, passing trailing arguments to the program.
- **`--stackTrace:on|off`**, **`--lineTrace:on|off`** — influence **crash diagnosability** vs leakage/size trade-offs.
- **`--threads:on|off`** — enable or disable the threading runtime support model your code expects.

**Diagnostics discipline**

- Warning and hint families can be listed, enabled, disabled, or promoted to **errors**—useful for **CI gates** and gradual cleanup.

## Typical local commands

Text first:

```bash
nim c -r app.nim
nim c -d:release app.nim
```

The first compiles and runs; the second is a common **optimized binary** build pattern (always confirm checks and defines match your **risk** tolerance).

## Operations perspective

- **Standardize** command lines per environment (dev vs CI vs release) and store them in scripts or documented **nimble** tasks.
- **Capture** compiler version, defines, and backend in build logs for **forensics** and customer support.
- **Test** cross-target builds early; backend and linker differences are where “works on my laptop” fails.
- **Balance** checks and optimizations against **security** (crash info, hardening) and **performance** SLAs.
- **Reproducible artifacts:** some teams pin embedded timestamps via environment conventions (for example **`SOURCE_DATE_EPOCH`**) when building toolchains or release binaries—follow your org’s reproducible-build policy.

---

## Further reading

- [Compiler user guide](https://nim-lang.org/docs/nimc.html)
- [Backend integration docs](https://nim-lang.org/docs/backends.html)
- [Nim documentation portal](https://nim-lang.org/documentation.html)
- [Compiler internals](https://nim-lang.org/docs/intern.html) (for contributors and deep debugging)
