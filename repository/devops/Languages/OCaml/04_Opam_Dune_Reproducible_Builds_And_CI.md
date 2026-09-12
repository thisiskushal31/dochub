# opam, dune, reproducible builds, and CI

[← Back to OCaml](./README.md)

## What this chapter covers

How **opam** installs compilers and libraries into isolated **switches**, how **dune** turns `dune` and `dune-project` files into build graphs, how to **lock** dependencies for reproducibility, and how to wire the same flow in **CI**. After this chapter you should know what a switch is, why `.opam` files exist, and what to cache safely in pipelines.

```bash
opam switch create . --deps-only
eval "$(opam env)"
dune build
```

---

## 1. What opam does

**opam** is the package manager for OCaml. It does two jobs at once:

1. It installs **compiler toolchains** (specific OCaml versions).
2. It installs **libraries and tools** (dune, alcotest, lwt, etc.) into the **same prefix** as that compiler.

Everything for one toolchain lives in an **opam switch**. A switch is a directory tree (often under `~/.opam/<switch>`) containing `bin`, `lib`, and metadata. Switch **A** can use OCaml 4.14 while switch **B** uses OCaml 5.2—same machine, no conflict.

**Why switches matter for engineering:** you pin the compiler version your project supports, document it in `dune-project` or `.opam` files, and make CI create a matching switch. Drift between “developer laptop” and “CI image” is a common source of “builds on my machine” failures.

```bash
opam switch create myproj ocaml-base-compiler.5.2.1
opam install dune
```

---

## 2. Project metadata: `.opam` files and `dune-project`

A package description usually includes:

- **Name** and **version** of your project.
- **Depends** on other opam packages (with version constraints).
- **Build** instructions (often `dune build`).

**dune** reads `dune-project` at the repo root and can generate or align with `.opam` metadata. CI and `opam install . --deps-only` use that metadata to install **exactly** the dependencies your project declares.

**Minimum OCaml version** in metadata tells contributors and tools which language features you assume (e.g. OCaml 5 for effects).

```opam
opam-version: "2.0"
name: "myproj"
version: "0.1"
depends: [
  "ocaml" {>= "5.0"}
  "dune" {>= "3.0"}
]
build: [["dune" "build" "-p" name "-j" jobs]]
```

---

## 3. What dune does

**dune** reads:

- `dune-project` — language version, package names, **wrapped** executables, etc.
- `dune` files in each directory — **libraries**, **executables**, **tests**, **foreign** stubs, **flags**.

It computes a **dependency graph** between modules and **invokes** `ocamlopt` or `ocamlc` with the right flags. You normally run:

- `dune build` — build everything default in the tree.
- `dune runtest` — run test stanzas.
- `dune install` — install binaries and libraries according to project rules (often used in packaging or local install).

**Incremental** builds reuse `.cmi` and `.cmx` artifacts. If something “impossible” fails after a refactor, a **clean** build (`dune clean` then `dune build`) clears stale interfaces.

```scheme
(executable
 (name server)
 (libraries lwt lwt.unix))
```

---

## 4. Reproducible installs: lockfiles

**opam** can lock **dependency resolution** so that every machine resolves the same package versions. Workflows vary by team:

- `opam lock` (or equivalent) produces a **lockfile** committed to the repo.
- CI runs `opam install` using that lockfile so **transitive** dependencies do not drift.

**Containers** and **Nix** flakes can further pin **system** libraries (C headers, `pkg-config`) that your **FFI** bindings need. For security audits, **you must know** which **package versions** shipped in a **release** artifact—lockfiles and image tags are the source of truth.

---

## 5. CI pipeline shape

A typical pipeline:

1. Start from an image with **opam** (or install opam).
2. **Create** **or** **select** a switch matching the project’s OCaml version.
3. **Install** dependencies: `opam install . --deps-only` (or your documented command).
4. **Build**: `dune build`.
5. **Test**: `dune runtest`.
6. **Optionally** publish artifacts (binary, docs).

**Caching:** cache the opam download and switch **only** when the cache key includes **lockfile hash**, **base image digest**, and **opam** version. Otherwise you get stale or inconsistent installs.

**Docker note:** `opam init` inside a container often needs `--disable-sandboxing` unless sandboxing is set up; document that for your team so CI stays reproducible.

```bash
#!/usr/bin/env bash
set -euo pipefail
opam init --disable-sandboxing --bare -y
opam switch create . --deps-only --with-test
dune build --profile release
dune runtest
```

---

## 6. Release engineering and native binaries

Native executables **link** **system** dynamic libraries (e.g. `libc`, OpenSSL). **Release** artifacts should note:

- **Target OS** and **libc** (glibc vs musl on Linux).
- **Architecture** (x86_64 vs arm64).

Incident response and **binary** diffing use the same **metadata** as any native toolchain.

```bash
file _build/default/bin/server.exe
# otool -L … / ldd … on the installed binary
```

---

## Advanced use cases and implementation

**Monorepos:** dune **workspaces** can span multiple directories; **vendored** dependencies live under a predictable path. **Security** policy may require **scanning** vendored C code like any other third-party dependency.

**Air-gapped** builds: mirror **opam** **repositories** internally and pin **only** mirrored packages.

```scheme
;; dune-workspace — multiple roots / vendored trees (illustrative)
(lang dune 3.0)
```

---

## 7. opam pins, variables, and local packages

**Pins** point a package name at a **git URL**, **path**, or **version**, so `opam install` resolves to your fork or a subdirectory until you release. Pins are essential for **pre-release** integration and for **emergency** patches while upstream tags a fix.

**opam variables** (compiler version, OS, architecture) appear in **depends** and **build** scripts so the same `opam` file can express “needs this C stub on Linux only.” CI should set **consistent** variable environments so resolution matches developer machines—drift here shows up as “optional” deps missing on the server.

Installing from the **project root** with `opam install . --deps-only` (or similar) reads the local `.opam` package file and pulls **exactly** what the package declares; document any **system** packages (`conf-*` packages, `pkg-config`) in README or CI scripts for auditors.

```bash
opam pin add mypkg.dev git+https://github.com/org/mypkg#abc123
```

---

## 8. Dune: profiles, contexts, and workspaces

**Profiles** (`dev` vs `release`) change **flags**: unchecked optimizations, debug info, and warnings. Release binaries for production should match what you **profiled**; `dev` defaults trade speed for faster iteration.

**Contexts** let dune build the same tree with **different** compiler versions or **targets** (native vs bytecode) in one workspace—useful for **cross**-compilation setups and for comparing behavior across OCaml versions.

A **`dune-workspace`** file can define multiple **packages** or roots in a **monorepo**: shared **vendored** code, internal libraries with one version policy, and a single `dune build` that catches broken **edges** between teams’ trees.

**Promotion** (`dune promote`) applies **expectation** updates for tests that snapshot output—treat promoted files as **reviewable** artifacts in code review, like golden files in other stacks.

```scheme
(env
 (dev
  (flags (:standard -w +a-4)))
 (release
  (flags (:standard -O3))))
```

---

## 9. Developer ergonomics: REPL and incremental failure modes

`dune utop` (or `utop` with the right libs loaded) gives a **REPL** against your **library** dependencies—faster than ad hoc test binaries for exploring APIs.

When **incremental** builds behave oddly after **interface** changes, `dune clean` is the first remediation; persistent issues often trace to **stale** `.cmi` consumers or a **cyclic** dependency that only manifests after reordering.

```bash
dune utop
```

---

## 10. Deterministic CI at scale

As projects grow, reproducibility depends on controlling three layers together:

- **Language layer**: OCaml compiler, opam solver behavior, dune profile.
- **System layer**: base image digest, libc, C toolchain, `pkg-config` paths.
- **Network layer**: mirrored package indexes, pinned commits, checksum validation.

If any one layer floats, two CI jobs with the same source commit can produce different binaries. Mature pipelines capture all three layers in metadata and block releases when provenance is incomplete.

```yaml
# Cache key sketch (conceptual)
key: opam-lock-${{ hashFiles('**/*.opam.lock') }}-img-${{ env.BASE_IMAGE_DIGEST }}
```

---

## 11. Day-one opam and project bootstrap (dependencies, compiler pin)

**Workflow shape:** initialise opam → create or activate a **switch** with the required **compiler** version → `opam install` **platform** tools (dune, utop, formatter, LSP) as team policy → in the repo, `opam install . --deps-only` (or your lockfile-driven equivalent) → `dune build` / `dune runtest`. Document the exact commands in `README` so CI and humans share one path.

**Switches:** a switch is an isolated prefix: compiler, stdlib, and all opam packages installed for that toolchain. Switch **A** can track OCaml **5.x** while switch **B** stays on **4.x**—no conflicting global compilers.

**Managing dependencies:** version constraints live in `.opam` metadata; the **solver** picks concrete package sets. **Pins** override a package with a git path or fork for urgent fixes. **Lockfiles** (when your workflow uses them) freeze the solved graph for CI.

**Bootstrapping a new tree:** `dune-project` names packages and language version; nested `dune` stanzas declare **libraries** and **executables**. The first successful `dune build` proves the **module graph** and **library** edges are consistent—fix missing `libraries` lines before debugging logic.

```bash
git clone https://github.com/org/proj && cd proj
opam switch create . --deps-only
dune build @all @runtest
```

---

## References

### Primary — platform guides

- [Managing Dependencies](https://ocaml.org/docs/managing-dependencies)
- [Bootstrapping a Dune Project](https://ocaml.org/docs/bootstrapping-a-dune-project)
- [Install a Specific OCaml Compiler Version](https://ocaml.org/docs/install-a-specific-ocaml-compiler-version)

### Primary — opam and dune

- [opam — User guide](https://opam.ocaml.org/doc/Usage.html)
- [opam — FAQ](https://opam.ocaml.org/doc/FAQ.html)
- [Dune documentation](https://dune.readthedocs.io/en/stable/)
