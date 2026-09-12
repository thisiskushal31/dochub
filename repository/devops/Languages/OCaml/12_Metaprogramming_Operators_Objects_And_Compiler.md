# Metaprogramming, operators, objects, compiler pipeline

[← Back to OCaml](./README.md)

## What this chapter covers

PPX rewriters extend the compiler with compile-time program transformations. Custom operators embed domain-specific notation. **Objects and classes** are the **manual’s object-oriented track** (classes, inheritance, row polymorphism)—an alternative to modules + variants for some APIs. The compiler frontend and backend explain where parsing, type checking, optimization, and code generation happen—useful when reading error messages and tuning flags.

```scheme
(library
 (name mylib)
 (preprocess
  (pps ppx_deriving)))
```

---

## 1. Metaprogramming (PPX)

PPX rewriters operate on the abstract syntax tree after parsing. Typical uses include derivers that generate boilerplate (encoders, decoders, equality, pretty printers) and syntax extensions that introduce surface syntax desugared to core OCaml.

PPX executes at build time with full access to your sources. Treat ppx packages as trusted code in the supply chain: pin versions, review updates, and invalidate CI caches when inputs change.

**AST** **stability** is tied to **compiler** minor versions: PPX rewriters depend on internal **Parsetree**/**Typedtree** shapes. Upgrading OCaml without upgrading matching **ppxlib**/**ppx** dependencies often yields **migration** errors in CI—plan **compiler** bumps as a **toolchain** change, not a one-line edit.

```ocaml
(* Attribute hooks for derivers — real expansion lives in the ppx package *)
type t = A | B [@@deriving eq]
```

---

## 2. Custom operators

You can define new operator symbols for domain notation (linear algebra, parsing combinators, and similar). Precedence and associativity follow language rules; document them for readers so expressions are not misread in review.

```ocaml
let ( +! ) a b = a * 10 + b

let _ = 1 +! 2
```

---

## 3. Objects in OCaml (classes, inheritance, row types)

**Classes** define **constructors** and **methods**; **objects** are runtime values with **hidden** internal state and **dynamic dispatch** on method names. **Inheritance** subclasses extend or override behavior. **Row polymorphism** lets functions accept “any object that has at least these methods” without naming a single class—useful for narrow interfaces.

**When to use:** **GUI** frameworks, **visitor**-style APIs, or **legacy** code you maintain as-is. **When to avoid for new services:** modules + algebraic types usually give **clearer** invariants, easier **refactor**, and simpler reasoning under **multicore** (object identity and mutable slots are easy to get wrong across **domains**).

**Interop:** objects coexist with modules; you can wrap an object **behind** a module signature so callers see only the operations you want to audit.

```ocaml
class counter_init x = object
  val mutable n = x

  method get = n
end

let o = new counter_init 0
```

---

## 4. Compiler frontend and backend

The frontend lexes and parses source, runs type inference and checks, and lowers programs to an intermediate representation. The backend optimizes and emits native or bytecode. Miscompilation bugs and flag interactions often surface as backend issues; syntax and type errors as frontend issues.

**Flambda** (when enabled) performs **inlining** and **specialization** across compilation units in ways that change **performance** and sometimes **stack** **depth**—benchmark with release flags. **Warning** sets (`-w`, `-warn-error`) treated as **errors** in CI catch unused bindings, partial matches, and fragile pattern matches before review.

```bash
ocamlopt -w @a-4 -warn-error +a -c module.ml
```

---

## 5. PPX governance and review discipline

Because PPX rewrites source before type checking completes, teams need explicit governance:

- Keep a short approved PPX allowlist per repository.
- Require code review for new derivers and syntax extensions.
- Pin PPX versions with compiler versions in the same upgrade PR.
- Snapshot generated output in tests when behavior matters.

This keeps metaprogramming productive without turning compile-time rewrites into opaque risk.

```ocaml
(* Approved PPX list: record in repo policy, e.g. README or SECURITY.md *)
```

---

## 6. End-to-end compiler pipeline (frontend → backends)

At a high level, each **`.ml`/`.mli`** unit passes:

1. **Lex/parse** to a **syntax tree**.
2. **PPX** rewriters reshape that tree (derivers, syntax sugar).
3. **Type-check** and **module** resolution build a typed representation; errors here are still “frontend” errors.
4. **Translation** to an **untyped intermediate** (historically **lambda**-family IR) that drops most module and object abstraction, **lowers** pattern matches toward efficient tests, and lines up with the **memory model** from chapter 5.
5. **Backend choice**: **bytecode** (`ocamlc` + interpreter) for portability, or **native** (`ocamlopt`) for host **machine code**. Separate compilation produces **`.cmo`/`.cmx`** objects; **linking** joins them with the **runtime** and **foreign** objects.

Optional paths (not always in play) include **Flambda** optimisations and **JavaScript** backends via **js_of_ocaml**—same early pipeline, different final code generator. When debugging “only in release” behaviour, compare **debug** vs **optimised** builds: inlining and specialisation **remove** frames and change allocation sites.

```bash
ocamlopt -dcmm -c module.ml
# Emit intermediate representation — inspect when tuning hot paths
```

---

## 7. Custom operators and objects in real codebases

**Operators** (`+`, `>>=`, or user-defined symbol names) follow fixed **precedence** and **associativity** rules. Domain-specific embedded languages (parsers, linear algebra) often define small sets of operators; document them in module headers so reviewers parse expressions correctly.

**Objects** (classes, inheritance, row polymorphism) appear in **legacy** GUIs and some bindings. New services usually prefer **algebraic types** and **modules**; when you maintain object code, treat method **hooks** and **mutable object state** like any other concurrency-sensitive surface—chapter 6 still applies if domains touch shared handles.

```ocaml
let f (o : < get : int >) = o#get
```

---

## Advanced use cases and implementation

Lock ppx and compiler versions together with the rest of the toolchain—version skew often surfaces as AST or attribute errors in CI.

If one machine fails to build while others succeed, compare compiler patch levels and ppx hashes before debugging application logic.

```bash
opam list --installed | rg 'ppx|ocaml'
```

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
