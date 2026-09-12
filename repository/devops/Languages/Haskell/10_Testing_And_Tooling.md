# Testing and tooling

Haskell supports unit tests, property-based tests, and documentation tests. The usual approach is to add a test suite in the `.cabal` file and use a test framework (e.g. Tasty) with one or more back ends (HUnit, QuickCheck, Hedgehog, etc.). Additional tooling includes the Haskell Language Server (IDE support), Haddock (documentation), and Hoogle (API search by type).

**Test suites in Cabal/Stack.** In the `.cabal` file you declare a `test-suite` with a type (e.g. `exitcode-stdio-1.0`) and a `main-is` file (or `ghc-options` and source), plus `build-depends` for the test framework and the library under test. Example:

```
test-suite myapp-test
  type:             exitcode-stdio-1.0
  main-is:          Spec.hs
  build-depends:    base, myapp, tasty, tasty-quickcheck, QuickCheck
  hs-source-dirs:   test
  default-language: Haskell2010
```

Then `cabal test` or `stack test` builds and runs the suite. The test binary exits with code 0 on success, non-zero on failure.

**Tasty.** Tasty is a test harness that supports multiple test types (unit, property, golden, benchmark) via *ingredients*. You write a `main` that runs `defaultMain` with a `TestTree`: a tree of test groups and individual tests. That gives a single test binary and unified output. You can combine HUnit tests (via tasty-hunit), QuickCheck properties (via tasty-quickcheck), and other back ends in one tree.

**Unit tests.** HUnit provides assertions and test cases. You build a list of `Test` values (e.g. `TestCase (assertEqual "description" expected actual)`) and run them. Tasty wraps HUnit tests so they appear in the same test run as property and other tests.

**Property-based testing.** QuickCheck (and alternatives like Hedgehog) generate random inputs and check *properties* (e.g. “reverse (reverse xs) == xs”). You define a property as a function returning `Bool` or `Property` and optionally give `Arbitrary` instances (generators) for custom types. Tasty integrates with QuickCheck and Hedgehog so property tests run alongside unit tests. Failed properties are shrunk to a minimal counterexample when possible.

**Doctests.** The doctest tool runs code snippets embedded in Haddock comments. That keeps examples in the documentation and checks that they still type-check and evaluate as expected. It is often used in addition to a dedicated test suite. The snippets are executed in order; you can use `$ setup` and `$ run` for setup code.

**Haskell Language Server (HLS).** HLS provides IDE features: diagnostics, completion, go-to-definition, type information, and formatting. It works with editors that support the Language Server Protocol. GHCup can install HLS for your GHC version. It uses the same compiler and Cabal/Stack configuration as the command line, so diagnostics match what you get from `cabal build` or `stack build`.

**Haddock.** Haddock generates HTML (and other formats) from module structure, type signatures, and comments. Special syntax: `-- |` for the entity that follows; `-- ^` for the preceding entity. Use it for library docs and when publishing to Hackage. Build with `cabal haddock` or `stack haddock`.

**Hoogle.** Hoogle indexes Hackage (and often Stackage) and lets you search by function name or by type signature. That is useful when you know the shape of the function you need but not its name.

```haskell
-- Example test module (Tasty + QuickCheck)
import Test.Tasty
import Test.Tasty.QuickCheck as QC

main = defaultMain tests

tests :: TestTree
tests = testGroup "Properties"
  [ QC.testProperty "reverse . reverse = id" $
      \xs -> (reverse . reverse) xs == (xs :: [Int])
  , QC.testProperty "length (filter p xs) <= length xs" $
      \p xs -> length (filter p xs) <= length (xs :: [Int])
  ]
```

---

## Further reading

- [How to Write a Haskell Program – Testing](https://wiki.haskell.org/How_to_write_a_Haskell_program)
- [Tasty](https://github.com/UnkindPartition/tasty)
- [QuickCheck](https://hackage.haskell.org/package/QuickCheck)
- [Haskell Language Server](https://haskell-language-server.readthedocs.io/)
- [Haddock User Guide](https://haskell-haddock.readthedocs.io/)
- [Hoogle](https://www.haskell.org/hoogle/)
- [Introduction to QuickCheck (wiki)](https://wiki.haskell.org/Introduction_to_QuickCheck)
