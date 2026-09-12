# Environment and setup

To run and build Haskell programs you need a compiler (usually GHC) and a way to manage projects and dependencies (Cabal and/or Stack). The recommended way to install and manage these is GHCup, which handles GHC, Cabal, Stack, and the Haskell Language Server on Linux, macOS, and Windows.

**Obtaining GHC.** The Glasgow Haskell Compiler (GHC) is the standard Haskell implementation. It provides both a batch compiler and an interactive interpreter (GHCi). You can download GHC from the GHC home page, or use GHCup to install and switch between versions. Building GHC from source is possible but not required for normal use.

**Toolchain components.** GHC ships the compiler (`ghc`), the interpreter (`ghci`), and `runghc` for running source files as scripts. Cabal is the common build and package system: it uses `.cabal` files to describe packages and dependencies. The `cabal` executable (from cabal-install) is the usual command-line interface. Stack is an alternative that uses curated snapshots (e.g. from Stackage) for reproducible builds. GHCup can install GHC, Cabal, Stack, and the Haskell Language Server so you can manage versions in one place.

**Creating a new project with Cabal.** After installing the toolchain, create a new application with `cabal init` (e.g. `cabal init myapp --non-interactive`). This generates a directory with a `.cabal` file (package description) and a default source layout (e.g. `app/Main.hs`). The `.cabal` file lists package metadata (name, version, licence, etc.) and components: executables, libraries, and test suites. Each component has `build-depends`, `main-is` or `hs-source-dirs`, and `default-language: Haskell2010`. Build and run with `cabal build` and `cabal run`; with a single executable, `cabal run` without a component name runs that executable.

**Checking the installation.** Verify the compiler and, if used, Cabal:

```bash
ghc --version
cabal --version
```

**GHCi.** The interactive environment loads modules with `:load` or `:l`, reloads with `:reload`, shows types with `:type`, and evaluates expressions at the prompt. You can set compiler options with `:set` and run scripts by loading the main module. GHCi uses the same layout and syntax as batch compilation; the prompt shows the current scope.

**runghc.** To run a single Haskell source file as a script without building a full package, use `runghc` (e.g. `runghc MyScript.hs`). The file is compiled on the fly. For scripts with dependencies you can use a shebang and an embedded Cabal-style comment to declare `build-depends` and then run the file with `cabal run` (see Cabal documentation for script support).

**Version numbering.** GHC stable releases use the form `x.y.z` (e.g. 9.14.1). Patch levels (z) are bug-fix only and do not change the programmer-facing interface; upgrading a patch level may require recompiling code built against the old libraries. The `__GLASGOW_HASKELL__` macro (when using the C preprocessor) encodes the major version. You can test the compiler version in code via `MIN_VERSION_GLASGOW_HASKELL`. Use `ghc --version` or the `--version` flag to see the installed version.

**Recommendation.** Use GHCup to install GHC, Cabal, Stack, and the Haskell Language Server so you can manage versions and keep the toolchain up to date without conflicting with system packages.

---

## Further reading

- [GHC User's Guide – Introduction](https://www.haskell.org/ghc/docs/latest/html/users_guide/intro.html)
- [GHCup](https://www.haskell.org/ghcup/)
- [Cabal – Install/Upgrade and Quick Start](https://www.haskell.org/cabal/)
- [Cabal User Guide – Getting Started](https://cabal.readthedocs.io/en/stable/getting-started.html)
- [How to Write a Haskell Program](https://wiki.haskell.org/How_to_write_a_Haskell_program)
