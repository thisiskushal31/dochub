# Use cases by role

Haskell is used across software engineering, DevOps/SRE, security, and research. How you use this section depends on your role: learning the language for product work, maintaining or integrating Haskell tools in pipelines, or applying it in high-assurance or formal-methods contexts.

**Software and backend.** If you build applications or libraries in Haskell, follow the full path: basics (1–2), core language (3–6), concepts (7–10), then use cases (11–12). You will use types, purity, modules, type classes, I/O, and testing daily. Focus on topics 4 (types), 5 (functions and purity), 6 (modules), 7 (type classes), 8 (I/O), and 10 (testing and tooling). Use Hoogle and Haddock to discover and understand libraries. Set up a project with Cabal or Stack (topic 9), add a test suite with Tasty and QuickCheck (topic 10), and use the Haskell Language Server for feedback while editing.

**DevOps and SRE.** If you maintain CI/CD, build systems, or infrastructure that uses Haskell tools, start with 1 (what Haskell is) and 2 (environment and setup), then 9 (build and packages). You need to run `ghc`, `cabal`, or `stack`, interpret build and test output, and sometimes adjust dependencies or compiler flags. You rarely write large Haskell applications but may edit `.cabal` or `stack.yaml`, scripts that invoke Haskell binaries, or small glue code. Topic 11 (DevOps, security, formal methods) summarises where Haskell fits in tooling and pipelines. Use `cabal build`/`stack build` and `cabal test`/`stack test` in CI; ensure the CI image or runner has the right GHC version (e.g. via GHCup or Stack).

**Security and cybersecurity.** If you audit or harden systems that include Haskell components, focus on 1–2 (what the language is and how it is built), 4 (types) and 7 (type classes) for understanding APIs and invariants, and 8 (I/O and effects) for where interaction with the outside world happens. Topic 11 covers security- and cybersecurity-sensitive tooling and safe use in production. Understanding the type system and purity helps when assessing what guarantees a library or tool claims and where trust boundaries are. Pay attention to dependency sources, version pinning, and supply-chain practices when deploying or evaluating Haskell tools.

**Research and formal methods.** If you work with verification, compilers, or formal specification, the full progression 1–12 is relevant. Emphasise 4 (types), 5 (functions and purity), 7 (type classes), and 6 (modules) for reading and writing proofs, embeddings, or verified code. Topic 11 summarises the role of Haskell in formal methods and tooling. Many research tools are built with Cabal or Stack; topic 9 covers building and running them. For full language and extension details, use the Further reading links at the end of the relevant topics.

**Cross-cutting.** Regardless of role, use the README’s topic index and “By engineering role” table to jump to the right depth. Use “Further reading” at the end of each topic to go deeper without cluttering the main narrative. For hands-on practice, create a small project with `cabal init` or `stack new`, add a dependency and a test, and run it locally and (for DevOps) in a CI job.

---

## Further reading

- [Haskell documentation](https://www.haskell.org/documentation/)
- [Learning Haskell (wiki)](https://wiki.haskell.org/Learning_Haskell)
- [Hoogle API Search](https://www.haskell.org/hoogle/)
- [Hackage](https://hackage.haskell.org/)
- [Cabal User Guide – Getting started](https://cabal.readthedocs.io/en/stable/getting-started.html)
- [How to Write a Haskell Program](https://wiki.haskell.org/How_to_write_a_Haskell_program)
