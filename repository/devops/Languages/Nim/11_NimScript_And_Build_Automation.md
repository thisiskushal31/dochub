# NimScript and build automation

[← Back to Nim](./README.md)

## What this topic covers

This chapter explains **NimScript** as the **VM-backed** subset used for **`config.nims`**, **compiler switches**, and **task** automation, where it runs, and what **cannot** run in the VM. **Every** builtin available to scripts and **Nimble** integration details are **referenced** from the official **NimScript** and **nimscript** module pages—this file gives **placement** in the overall toolchain.

## What NimScript is

**NimScript** is the subset of Nim that runs on the compiler’s **built-in virtual machine** (the same machinery used for **compile-time** evaluation). It is **not** a full replacement for compiled Nim: several low-level and FFI-heavy features are limited or unavailable, but for **configuration** and **project automation** it is the standard tool.

## Where configuration is loaded from

The **`nim`** executable reads **`.nims`** configuration in a fixed order; **later files override earlier ones**:

1. User config: **`$XDG_CONFIG_HOME/nim/config.nims`**, or **`~/.config/nim/config.nims`** on typical POSIX, or **`%APPDATA%/nim/config.nims`** on Windows. Skippable with **`--skipUserCfg`**.
2. **Parent-directory** configs: **`config.nims`** in any parent of the project file’s path. Skippable with **`--skipParentCfg`**.
3. **Project directory** **`config.nims`**. Skippable with **`--skipProjCfg`** (same flag also covers the next item).
4. **Project-specific** file **`$project.nims`** next to **`$project.nim`**.

Exact procedures available in scripts are documented alongside the **`nimscript`** module; NimScript also allows **`switch("name", "value")`** to mirror command-line flags, or **`--name:value`** lines as shorthand. Some **define** switches cannot be set from NimScript (for example certain link-time or toolchain defines).

## Limitations that affect scripts

Expect gaps versus compiled Nim, including:

- **No foreign-function interface** in the VM: stdlib modules that depend on **`importc`** are not usable in typical NimScript contexts.
- **Pointers** and **`var T`** parameters can be fragile compared to normal compilation.
- **Nested `ref` types** (e.g. `ref ref int`) are generally unsupported.
- **Multimethods** are not available.
- Details evolve with releases—validate against the current docs when a script fails mysteriously.

A sizable list of **stdlib modules** is still available in NimScript (math, strings, JSON, OS helpers, parsers, etc.); treat anything touching native code or threads with extra caution.

## NimScript as a build tool

The **`task`** template (from the implicit **`system`** surface in script mode) names entry points such as **`help`**, **`build`**, **`tests`**, and **`bench`** as **conventions** many projects follow. Tasks should stay **deterministic**, avoid hidden environment assumptions, and pin **toolchain versions** in team documentation.

Text first:

```nim
task buildRelease, "Build release binary":
  exec "nim c -d:release src/app.nim"
```

## Standalone scripts

You can run a script with **`nim myscript.nims`**. On Unix, a shebang such as **`#!/usr/bin/env nim`** works when the filename ends with **`.nims`**. That makes NimScript a **cross-platform** alternative to shell-specific glue for teams that already standardize on Nim.

## Nimble integration

Package projects often combine **Nimble** metadata with NimScript tasks. Keep automation **idempotent** and safe for **CI** (no interactive prompts, explicit paths).

## Engineering guidance

- Prefer **small, reviewable** scripts over sprawling implicit config spread across many parent directories.
- Document which **skip flags** CI uses so local and pipeline behavior match.
- When a module “works in app code but not in `.nims`,” assume **VM limitations** or **FFI** first.

---

## Further reading

- [NimScript overview](https://nim-lang.org/docs/nims.html)
- [nimscript module](https://nim-lang.org/docs/nimscript.html)
- [Nimble readme](https://github.com/nim-lang/nimble#readme)
- [Compiler user guide](https://nim-lang.org/docs/nimc.html)
