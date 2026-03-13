# What is Haskell?

Haskell is a purely functional, statically typed programming language. Programs are built by evaluating expressions to produce values; there are no implicit side effects in the core language. Types are pervasive: every value has a type, and the type system is both rich and checked at compile time. That combination makes Haskell well suited to correctness, abstraction, and reasoning about programs.

**What it is.** Haskell is a *typeful* language: types are central, and the type system is more expressive than in many mainstream languages. You can omit type signatures and the compiler will infer them (Hindley–Milner style), though writing signatures is recommended for documentation and for catching mistakes. The language is purely functional: functions depend only on their arguments; expressions denote values rather than performing hidden state changes. The standard in widespread use is Haskell 2010; compilers such as GHC implement many additional language extensions. Older standards (e.g. Haskell 98) are obsolete for new code.

**Standard Prelude and libraries.** The Standard Prelude and standard libraries provide common types and functions. They are a good place to see idiomatic Haskell and to learn the standard vocabulary. The Prelude is implicitly in scope in every module unless you override it with an explicit import.

**Why it is used.** Haskell is used where strong guarantees, reuse, and maintainability matter: compilers and language tools, security- and finance-related code, formal methods and verification, and research. Its type system and purity help avoid whole classes of bugs (e.g. null references, unintended mutation) and support refactoring. In DevOps and tooling, Haskell appears in build and analysis tools, configuration generators, and high-assurance components rather than as a general-purpose scripting language.

**How you use it.** You install the Glasgow Haskell Compiler (GHC) and the Cabal or Stack build tools (GHCup is the recommended installer). You write source in `.hs` files, compile with `ghc` or build with `cabal`/`stack`, run scripts with `runghc`, and use the interactive REPL with `ghci`. A minimal program has an entry point `main` with type `IO ()` in the module `Main`.

```haskell
-- Minimal program: main has type IO ()
main :: IO ()
main = putStrLn "Hello, Haskell!"
```

**GHC in brief.** GHC provides both a batch compiler and an interactive interpreter (GHCi). You use the same program with different options for each mode. Compiled modules can be loaded into GHCi; most library code is pre-compiled, so you get fast turnaround for the code you are editing. GHC supports many language extensions (concurrency, FFI, exceptions, extra type-system features) and has a powerful optimiser and a profiling system.

**Use cases.** Haskell is used for compilers and interpreters, domain-specific languages, verification and formal methods, security-sensitive tooling, financial and protocol logic, and as a vehicle for research in type systems and functional programming. In engineering roles, it shows up in backend and library code, in DevOps when maintaining or extending Haskell-based tools, and in security and research when building or auditing high-assurance systems.

---

## Further reading

- [Haskell documentation](https://www.haskell.org/documentation/)
- [GHC – Glasgow Haskell Compiler](https://www.haskell.org/ghc/)
- [Haskell 2010 report (HTML)](https://haskell.org/onlinereport/haskell2010/)
- [A Gentle Introduction to Haskell – Introduction](https://www.haskell.org/tutorial/intro.html)
