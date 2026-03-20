# Environment, toolchain, and first build

[← Back to Nim](./README.md)

## What this topic covers

This chapter is about **installing and reasoning about the toolchain**: compiler, **Nimble**, project files, and a **first successful compile**. Platform-specific download steps change over time; the **documentation portal** (linked below) remains the canonical place for **Windows**, **macOS**, **Linux**, and CI images. Here you get the **engineering expectations**: same compiler version in dev and CI, predictable **entrypoint** commands, and where **config** files sit in a real repo.

## Installing and pinning the toolchain

**Obtaining Nim** is intentionally not duplicated here: use the **Getting started** / **Download** path from the official portal for your OS and package manager. Whether you use a **system package**, a **version manager**, or a **container** image, treat the **compiler executable** and **stdlib path** as part of your **artifact contract**—record them in **README**, **Dockerfile**, or **CI** variables so **on-call** and **security audits** see one truth.

**Nimble** ships alongside typical installs; verify **`nimble`** is on **`PATH`** for dependency workflows. Teams should **pin** a **major.minor** (or exact) compiler line and bump it through **change control**, not ad hoc laptop upgrades.

## What is the Nim toolchain?

The Nim toolchain centers on:

- the **Nim compiler**
- **Nimble** for package management
- project files (`.nim`, `.nimble`, config files)
- standard tooling for test/build/run

For beginners, the first objective is simple: install Nim, compile one program, and understand how package/project commands fit together.

## Why setup quality matters

Good setup prevents friction later:

- reproducible builds in CI
- consistent compiler versions across team members
- reliable dependency resolution
- cleaner debugging when builds differ between environments

Treat setup as part of engineering quality, not a one-time step.

## Typical local workflow

Text first: a common project workflow shape:

```bash
nimble init myapp
cd myapp
nimble build
nimble run
```

Direct compiler usage is also common:

```bash
nim c -r src/myapp.nim
```

## Project layout essentials

A practical Nim project commonly includes:

- source files grouped by module responsibility
- one package descriptor for distribution and dependency management
- test files and scripts separated from production modules

As projects scale, establish version pinning and explicit build flags in team docs or scripts.

## First build example

Text first: the following minimal program validates your compiler and runtime path.

```nim
import std/os

proc main() =
  echo "Nim version and toolchain are working."
  echo "Current directory: ", getCurrentDir()

when isMainModule:
  main()
```

Compile and run:

```bash
nim c -r hello.nim
```

## Toolchain concerns in production and security contexts

- **Version control:** pin Nim/Nimble versions for reproducible CI artifacts.
- **Dependency policy:** define trusted package sources and review process.
- **Build provenance:** capture compiler flags and package lock state in build logs.
- **Operational readiness:** document debug/rebuild commands for on-call workflows.

---

## Further reading

- [Nim documentation portal](https://nim-lang.org/documentation.html)
- [Tutorial, part 1](https://nim-lang.org/docs/tut1.html)
- [Language manual](https://nim-lang.org/docs/manual.html)
- [Nimble package manager repository](https://github.com/nim-lang/nimble)
- [Compiler user guide](https://nim-lang.org/docs/nimc.html)
