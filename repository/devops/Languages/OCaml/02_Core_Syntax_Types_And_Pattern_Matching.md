# Core syntax: expressions, types, pattern matching, control flow

[← Back to OCaml](./README.md)

## What this chapter covers

The core language: how expressions and bindings work, the usual types, algebraic data types and pattern matching, lists and recursion, higher-order functions, labelled arguments, imperative escape hatches, and modelling errors with `option` and `result`. The goal is to read and write straightforward OCaml and to know where advanced features (modules, FFI, concurrency) attach later.

---

## 1. Expressions and `let`

Almost everything is an expression with a type. A top-level binding gives a name to a value:

```ocaml
let answer = 42
```

Local bindings use `let … in …` and only exist inside the inner expression:

```ocaml
let x = 3 in
let y = 4 in
x * x + y * y
```

There is no separate “statement” layer: side-effecting code returns `unit`, written `()`, and functions that exist only for effects have type like `string -> unit`.

---

## 2. Functions: values, currying, partial application

Functions are values. A function of two arguments is really a function of one argument that returns another function. That is **currying**:

```ocaml
let add x y = x + y
(* same idea as: let add = fun x -> fun y -> x + y *)

let add_five = add 5
let twelve = add_five 7
```

**Partial application** means you fix some arguments and get a new function. That is how you configure behavior without classes or dependency-injection frameworks.

The pipe operator `|>` passes the left-hand value as the last argument to the function on the right—useful for linear data pipelines:

```ocaml
let doubled = [1; 2; 3] |> List.map (fun x -> x * 2)
```

---

## 3. Basic types

Common scalar types include `int`, `float`, `bool`, `char`, and `string`. Float literals need a decimal point; float operators have a dot (`+.`, `*.`). Strings are immutable; `^` concatenates.

```ocaml
let pi = 3.14159
let area r = pi *. r *. r
let greeting = "Hello, " ^ "world"
```

Polymorphism appears when the type checker generalizes a function to work for many types, shown as type variables like `'a` in the toplevel.

---

## 4. Tuples and records

A **tuple** groups a fixed number of values of possibly different types:

```ocaml
let p = (1, "one")
let (n, s) = p
```

A **record** has named fields and needs a type declaration:

```ocaml
type point = { x : float; y : float }

let origin = { x = 0.; y = 0. }
let shifted = { origin with x = 1. }
```

Records are the usual way to name structured data in APIs; tuples are fine for small private returns.

---

## 5. Variants and pattern matching

A **variant type** lists **constructors**—tags that can carry data. **Pattern matching** inspects which constructor you have and binds any payload:

```ocaml
type outcome = Ok | Err of string

let message = function
  | Ok -> "success"
  | Err e -> "error: " ^ e
```

The compiler checks **exhaustiveness**: every constructor must be handled, which prevents many “forgot a case” bugs.

`match` generalizes the same idea:

```ocaml
match Some 3 with
| None -> 0
| Some n -> n * 2
```

---

## 6. Lists and recursion

Lists are singly linked, immutable sequences. The empty list is `[]`; `head :: tail` prepends one element.

```ocaml
let nums = 1 :: 2 :: 3 :: []
let sum = List.fold_left ( + ) 0 nums
```

Recursive functions are idiomatic for trees and lists. **Tail-recursive** functions reuse the current stack frame when there is no pending work after the recursive call—important for very deep structures so you do not exhaust the stack in a long-running service.

```ocaml
let rec length_acc acc = function
  | [] -> acc
  | _ :: t -> length_acc (acc + 1) t

let length lst = length_acc 0 lst
```

`for` and `while` exist but are secondary; recursion and higher-order iterators cover most control flow.

---

## 7. Higher-order functions

Functions that take or return functions let you factor repetition. `List.map`, `List.filter`, and `List.fold_left` are the workhorses:

```ocaml
let squares = List.map (fun x -> x * x) [1; 2; 3; 4]
```

In pipelines and parsers, building small combinators keeps each step testable.

---

## 8. Labelled and optional arguments

**Labelled** arguments use names at the call site, which disambiguates arguments of the same type:

```ocaml
let divide ~numerator ~denominator = numerator / denominator

let q = divide ~numerator:10 ~denominator:2
```

**Optional** arguments use `?` and usually default inside the function. They reduce boilerplate for flags and configuration objects.

---

## 9. Imperative pieces: refs, arrays, loops

**Refs** are mutable cells: `ref` to create, `!` to read, `:=` to write.

```ocaml
let counter = ref 0 in
counter := !counter + 1;
!counter
```

**Arrays** are fixed-length and mutable; good when you need index access or tight integration with C buffers. **Mutable record fields** are declared with `mutable`.

`for` and `while` loops are available when an imperative loop is clearer than recursion. Long-running services still benefit from keeping mutable state small and well-scoped so reasoning and testing stay easy.

---

## 10. `option` and `result`

`option` models a value that may be absent: `None` or `Some v`.

```ocaml
let safe_div x y =
  if y = 0 then None else Some (x / y)
```

`result` is similar but uses `Ok` and `Error` so you can carry structured error information without exceptions:

```ocaml
type err = Msg of string

let safe_div_e x y =
  if y = 0 then Error (Msg "div by zero") else Ok (x / y)
```

At module boundaries, `result` makes error paths explicit and composable—important for reliable automation and security-sensitive parsing.

---

## 11. Exceptions (briefly)

Exceptions (`raise`, `try … with …`) exist for truly exceptional cases or interop. Uncaught exceptions crash the program or thread. For expected failures (bad input, missing files), `result` or `option` keeps control flow visible to the type checker and to reviewers.

---

## 12. Polymorphic variants (when you need open unions)

**Ordinary** variants have a fixed set of constructors declared in one `type`—the compiler knows the full set for exhaustiveness. **Polymorphic variants** use tags like `` `Ok `` or `` `Err of string `` without a single closed declaration; they can be **open** (accept more tags later) or constrained by subtyping. They help when:

- You need **extensibility** across libraries (each adds tags without editing a central type).
- You **parse** protocols where the tag set is not fixed at compile time.

Trade-offs: error messages can be harder to read, and you must still design boundaries so untrusted input cannot forge tags you treat as trusted without validation.

---

## 13. The value restriction (why some `let`-bound “functions” are not polymorphic)

The type checker sometimes **refuses** to give a polymorphic type to a binding like `let f = ref None` or `let id = fun x -> x` in certain shapes—not because the code is wrong, but because **soundness** requires that mutable storage and polymorphism do not combine unsafely. In practice: if a `let`-bound name is **syntactically** a function (explicit `fun` or pattern that makes it a function value), it often generalizes; if it is a **structure** that could hold mutable state, generalization is limited.

When you hit this, the fix is usually to add an explicit **parameter** (`let f () = ref None` or `let f : 'a. 'a option ref = ref None` where appropriate) or to use a **module**-level `let` with the right arity. Understanding the restriction explains mysterious “This expression has type … but an expression was expected of type …” errors around refs and polymorphism.

---

## 14. Guards, nested patterns, and `as`

Patterns can be **nested** (e.g. matching a pair and a variant inside it) and use **`when`** guards for extra boolean conditions. Guards are **not** exhaustiveness-checked in the same way as pattern heads—the compiler may warn that a match is not exhaustive if a guard could exclude cases. Prefer **thin** guards; heavy logic in `when` obscures control flow for reviewers.

The **`p as x`** form binds a name to the whole value matching `p`, useful for logging or reusing a sub-value without reconstructing it.

---

## 15. Sequencing, `unit`, and `begin`/`end`

`e1; e2` evaluates `e1` for its side effect (typically `unit`), then `e2`. The **semicolon** is not “statement separator” in the C sense; it is an operator on expressions where the left side must be `unit` in strict style (or you use `ignore`). **`begin`/`end`** are just parentheses for readability around large `if` or sequence expressions.

APIs that return `unit` for effects (logging, mutation) compose with `;` inside `let` bodies; confusing `unit` with “ignored result” causes bugs when a function returns something important you accidentally drop.

---

## 16. Structural equality vs physical equality

**Structural** equality `=` compares values by **content** for algebraic types (with caveats for floats and mutable structures). **Physical** equality `==` asks whether two values are the **same heap object** (for mutable things, aliasing). For **functions**, `=` is not meaningful in the general case; for **abstract** types, equality depends on what the module exports.

Security-relevant code: do not rely on `=` for **secrets** (constant-time comparison is a separate concern; use crypto libraries). For **floats**, `nan` and signed-zero details match IEEE semantics—be explicit in tests and protocols.

---

## Advanced use cases and implementation

**API design:** Use `result` at boundaries between subsystems; keep exceptions for invariant violations that should never happen if the rest of the code is correct. Log or map errors with stable codes for operations, not only human strings.

**Services:** Stack depth and allocation patterns matter under load; prefer tail recursion or iterators for unbounded inputs. Mutable caches are fine behind a small interface if concurrency rules are clear (see chapter 6).

**Security:** Parsing untrusted input should produce `result` or `option` and never trust success based on a bare string; combine with validation before acting on data.

---

## References

### Primary — language tutorials

- [Values and Functions](https://ocaml.org/docs/values-and-functions)
- [Basic Data Types](https://ocaml.org/docs/basic-data-types)
- [Loops and Recursions](https://ocaml.org/docs/loops-recursion)
- [Lists](https://ocaml.org/docs/lists)
- [Higher Order Functions](https://ocaml.org/docs/higher-order-functions)
- [Labels](https://ocaml.org/docs/labels)
- [Mutability and Imperative Control Flow](https://ocaml.org/docs/mutability-imperative-control-flow)

### Primary — manual

- [The OCaml language](https://ocaml.org/manual/core.html)

### Guides

- [Error Handling](https://ocaml.org/docs/error-handling)
