# Metaprogramming, operators, objects, compiler pipeline

[← Back to OCaml](./README.md)

## What this chapter covers

PPX rewriters extend the compiler with compile-time program transformations. Custom operators embed domain-specific notation. Objects and classes add an object-oriented layer alongside modules and variants. The compiler frontend and backend explain where parsing, type checking, optimization, and code generation happen—useful when reading error messages and tuning flags.

---

## 1. Metaprogramming (PPX)

PPX rewriters operate on the abstract syntax tree after parsing. Typical uses include derivers that generate boilerplate (encoders, decoders, equality, pretty printers) and syntax extensions that introduce surface syntax desugared to core OCaml.

PPX executes at build time with full access to your sources. Treat ppx packages as trusted code in the supply chain: pin versions, review updates, and invalidate CI caches when inputs change.

**AST** **stability** is tied to **compiler** minor versions: PPX rewriters depend on internal **Parsetree**/**Typedtree** shapes. Upgrading OCaml without upgrading matching **ppxlib**/**ppx** dependencies often yields **migration** errors in CI—plan **compiler** bumps as a **toolchain** change, not a one-line edit.

---

## 2. Custom operators

You can define new operator symbols for domain notation (linear algebra, parsing combinators, and similar). Precedence and associativity follow language rules; document them for readers so expressions are not misread in review.

---

## 3. Objects and classes

OCaml supports classes, objects, inheritance, and row polymorphism. Many teams prefer algebraic types and modules for new code, but objects remain in older codebases and some GUI bindings.

---

## 4. Compiler frontend and backend

The frontend lexes and parses source, runs type inference and checks, and lowers programs to an intermediate representation. The backend optimizes and emits native or bytecode. Miscompilation bugs and flag interactions often surface as backend issues; syntax and type errors as frontend issues.

**Flambda** (when enabled) performs **inlining** and **specialization** across compilation units in ways that change **performance** and sometimes **stack** **depth**—benchmark with release flags. **Warning** sets (`-w`, `-warn-error`) treated as **errors** in CI catch unused bindings, partial matches, and fragile pattern matches before review.

---

## Advanced use cases and implementation

Lock ppx and compiler versions together with the rest of the toolchain—version skew often surfaces as AST or attribute errors in CI.

If one machine fails to build while others succeed, compare compiler patch levels and ppx hashes before debugging application logic.

---

## References

### Primary — advanced language

- [Metaprogramming](https://ocaml.org/docs/metaprogramming)
- [Operators](https://ocaml.org/docs/operators)
- [Objects](https://ocaml.org/docs/objects)
- [Compiler Frontend](https://ocaml.org/docs/compiler-frontend)
- [Compiler Backend](https://ocaml.org/docs/compiler-backend)

### Primary — manual

- [The OCaml compiler](https://ocaml.org/manual/comp.html)
