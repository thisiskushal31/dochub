# Build and packages (Cabal, Stack)

Haskell projects are built and packaged with Cabal or Stack. Both use a `.cabal` file to describe the package: name, version, licence, and components (executables, libraries, test suites). Each component has its own `build-depends`, source directories, and options. GHCup is the recommended way to install GHC, Cabal, and Stack.

**Cabal.** Cabal defines the Common Architecture for Building Applications and Libraries. The *cabal* executable (from the cabal-install package) reads the package description, resolves dependencies from Hackage (and optionally other repositories), and compiles your code. Commands: `cabal update` (refresh the package index), `cabal build` (compile), `cabal run [component]` (build and run an executable), `cabal test` (run test suites), `cabal repl` (start GHCi with the package context). Dependencies are listed in `build-depends` with version bounds (e.g. `base ^>=4.19.0.0`, `haskell-say ^>=1.0.0.0`). The `^>=` operator means “this major version or any compatible later minor”.

**Creating a package.** Run `cabal init myapp --non-interactive` (or `cabal init` in an existing directory). This creates a directory with a `.cabal` file and a default layout. A typical executable section looks like:

```
executable myapp
  import:           warnings
  main-is:          Main.hs
  build-depends:    base ^>=4.19.0.0
  hs-source-dirs:   app
  default-language: Haskell2010
```

The `main-is` field points to the file containing the `main` entry point (module `Main`). The `build-depends` list must include `base` and any other packages the code imports. After adding dependencies, run `cabal update` if needed, then `cabal run` to build and run.

**Adding dependencies.** Edit the `.cabal` file and add the package name and version bound to `build-depends` for the relevant component. Then use the module in your code with `import ModuleName`. Hackage is the central package archive; Hoogle and Stackage help you discover packages and compatible versions.

**Stack.** Stack uses the same `.cabal` format but pins the compiler and many dependencies to a *resolver* (a Stackage snapshot). That gives reproducible builds across machines. Commands: `stack build`, `stack run`, `stack test`, `stack repl`. A `stack.yaml` file specifies the resolver and any extra dependencies. Use `stack new myproject` to create a project skeleton. Stack downloads the compiler and snapshot if needed.

**Single-file scripts.** Cabal supports running a single Haskell file as a script. The file can start with a shebang `#!/usr/bin/env cabal` and an embedded Cabal comment block declaring `build-depends`. Run with `cabal run myscript` or, on Unix, make the file executable and run `./myscript`. The script cannot also be part of a package as an executable or listed module.

**Haddock.** Documentation is generated with Haddock. It reads Haddock comments and type signatures and produces HTML (and other formats). With Stack: `stack haddock` (optionally `--open` and `--haddock-hyperlink-source`). That helps when browsing libraries and when publishing to Hackage.

**Hackage and Stackage.** Hackage is the main public package repository. Stackage provides curated snapshots of Hackage packages that are known to build together. Depending on a Stackage snapshot (via Stack or Cabal configuration) reduces dependency conflicts. Hoogle and Stackage’s search let you look up functions by name or by type.

```bash
# Cabal: new project and run
cabal init myapp --non-interactive
cd myapp
cabal run

# Add a dependency in myapp.cabal: build-depends: base, haskell-say ^>=1.0.0.0
# Then in Main.hs: import HaskellSay (haskellSay); main = haskellSay "Hello!"

# Stack: new project and run
stack new myproject
cd myproject
stack run

# Build and run tests
cabal test
stack test
```

---

## Further reading

- [Cabal – Overview and quick start](https://www.haskell.org/cabal/)
- [Cabal User Guide – Getting started](https://cabal.readthedocs.io/en/stable/getting-started.html)
- [Cabal User Guide](https://cabal.readthedocs.io/)
- [Stack User Guide](https://docs.haskellstack.org/)
- [How to Write a Haskell Program](https://wiki.haskell.org/How_to_write_a_Haskell_program)
- [Hackage](https://hackage.haskell.org/)
- [Stackage](https://www.stackage.org/)
