# Core syntax: expressions, types, pattern matching, control flow

[← Back to OCaml](./README.md)

## What this chapter covers

The core language: how expressions and bindings work, the usual types, algebraic data types and pattern matching, lists and recursion, higher-order functions, labelled arguments, imperative escape hatches, and modelling errors with `option` and `result`. The chapter also lines up with the **manual’s “core language” thread**—quoted strings, record punning and disambiguation, lazy values, deeper exception patterns, and a concise introduction to **GADTs**. The goal is to read and write straightforward OCaml and to know where advanced features (modules, FFI, concurrency) attach later.

```ocaml
(* Preview: expressions, types, and match — expanded in §1 onward. *)
let demo xs = match xs with [] -> None | x :: _ -> Some x
```

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

Common scalar types include `int`, `float`, `bool`, `char`, and `string`. Float literals need a decimal point; float operators have a dot (`+.`, `*.`). **`string`** values are **immutable** sequences of bytes used as text in typical code; **`bytes`** is the **mutable** byte buffer type when you need in-place updates before I/O or parsing. Use **`String`** / **`Bytes`** module functions instead of manual bounds logic when possible.

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

```ocaml
let head = function [] -> failwith "empty" | x :: _ -> x

let safe_head xs =
  try Some (head xs) with Failure _ -> None
```

---

## 12. Polymorphic variants (when you need open unions)

**Ordinary** variants have a fixed set of constructors declared in one `type`—the compiler knows the full set for exhaustiveness. **Polymorphic variants** use tags like `` `Ok `` or `` `Err of string `` without a single closed declaration; they can be **open** (accept more tags later) or constrained by subtyping. They help when:

- You need **extensibility** across libraries (each adds tags without editing a central type).
- You **parse** protocols where the tag set is not fixed at compile time.

Trade-offs: error messages can be harder to read, and you must still design boundaries so untrusted input cannot forge tags you treat as trusted without validation.

```ocaml
let ok : [> `Ok ] = `Ok
let parse : [ `Ok | `Err of string ] -> string = function `Ok -> "ok" | `Err e -> e
```

---

## 13. The value restriction (why some `let`-bound “functions” are not polymorphic)

The type checker sometimes **refuses** to give a polymorphic type to a binding like `let f = ref None` or a partially applied value that could hide mutable state - not because the code is wrong, but because **soundness** requires that mutable storage and polymorphism do not combine unsafely. In practice: if a `let`-bound name is **syntactically** a function (explicit `fun` or pattern that makes it a function value), it often generalizes; if it is a **structure** that could hold mutable state, generalization is limited.

When you hit this, the fix is usually to add an explicit **parameter** (`let make_cell () = ref None`) so each call creates a fresh cell with its own inferred element type. A single shared polymorphic mutable cell is intentionally disallowed. Understanding the restriction explains mysterious “This expression has type … but an expression was expected of type …” errors around refs and polymorphism.

```ocaml
(* rejected or monomorphic: let r = ref None *)

let make_cell () = ref None

let id x = x
(* id often generalizes to 'a -> 'a because it is syntactically a function *)
```

---

## 14. Guards, nested patterns, and `as`

Patterns can be **nested** (e.g. matching a pair and a variant inside it) and use **`when`** guards for extra boolean conditions. Guards are **not** exhaustiveness-checked in the same way as pattern heads—the compiler may warn that a match is not exhaustive if a guard could exclude cases. Prefer **thin** guards; heavy logic in `when` obscures control flow for reviewers.

The **`p as x`** form binds a name to the whole value matching `p`, useful for logging or reusing a sub-value without reconstructing it.

```ocaml
let classify = function
  | (Some n as pair) when n < 0 -> ("neg", pair)
  | (Some _ as pair) -> ("nonneg", pair)
  | None as none -> ("none", none)
```

---

## 15. Sequencing, `unit`, and `begin`/`end`

`e1; e2` evaluates `e1` for its side effect (typically `unit`), then `e2`. The **semicolon** is not “statement separator” in the C sense; it is an operator on expressions where the left side must be `unit` in strict style (or you use `ignore`). **`begin`/`end`** are just parentheses for readability around large `if` or sequence expressions.

APIs that return `unit` for effects (logging, mutation) compose with `;` inside `let` bodies; confusing `unit` with “ignored result” causes bugs when a function returns something important you accidentally drop.

```ocaml
let bump r =
  r := !r + 1;
  Printf.printf "now %d\n" !r
```

---

## 16. Structural equality vs physical equality

**Structural** equality `=` compares values by **content** for algebraic types (with caveats for floats and mutable structures). **Physical** equality `==` asks whether two values are the **same heap object** (for mutable things, aliasing). For **functions**, `=` is not meaningful in the general case; for **abstract** types, equality depends on what the module exports.

Security-relevant code: do not rely on `=` for **secrets** (constant-time comparison is a separate concern; use crypto libraries). For **floats**, `nan` and signed-zero details match IEEE semantics—be explicit in tests and protocols.

```ocaml
let a = ref 1 in
let b = ref 1 in
assert (a = b);
(* structural: same content *)
assert (a != b)
(* physical: two distinct ref cells *)
```

---

## 17. Pattern-matching diagnostics: exhaustive, redundant, fragile

The compiler gives three high-value signals for `match`:

- **Non-exhaustive**: at least one shape is missing.
- **Redundant case**: a branch can never run because earlier patterns already cover it.
- **Fragile pattern** (depending on flags): matching assumptions may break if a type evolves.

Treat these warnings as design feedback, not noise. In services and parsers, missing branches often become production incidents when a new input shape appears.

```ocaml
(* compiler may warn: non-exhaustive *)
type t = A | B | C

let f = function A -> 0 | B -> 1
```

---

## 18. Recursion, folds, and cost model

`List.fold_left` is tail-recursive and usually the default for long lists. `List.fold_right` is often cleaner for right-associated constructions but is not tail-recursive in the straightforward form.

Rules of thumb:

- Prefer `fold_left` for accumulation over unbounded input sizes.
- Use explicit accumulators for custom recursion that runs on external input.
- Avoid repeated list concatenation (`@`) in loops; it can turn linear logic into quadratic behavior.

Depth, allocation, and traversal order matter more than micro-optimizing syntax. For production code, pick the shape that keeps stack usage bounded and allocations predictable.

```ocaml
let sum xs = List.fold_left ( + ) 0 xs

(* O(n) append in a loop is a classic quadratic footgun: *)
(* List.fold_left (fun acc x -> acc @ [ x ]) [] xs *)
```

---

## 19. Labelled and optional argument edge cases

Labelled arguments improve readability but can surprise during partial application when some labels are omitted. Optional arguments (`?x`) are represented as options under the hood and become concrete only when supplied or defaulted.

Common pitfalls:

- Forwarding optional args without preserving defaults.
- Expecting argument order to behave like positional APIs.
- Forgetting that adding a new optional argument can affect call sites that partially apply the function.

For public APIs, keep labels stable and use narrow, explicit defaults to avoid behavior drift across versions.

```ocaml
let greet ?(title = "Mr.") name = Printf.sprintf "%s %s" title name

let hi = greet ~title:"Dr." "Jones"
```

---

## 20. Type-driven refactoring discipline

A practical deep OCaml workflow is to let type errors guide refactors:

- Change one type at a boundary (record, variant, function signature).
- Compile and follow type errors as a todo list through call sites.
- Resolve pattern-match warnings before moving to the next boundary.

This approach scales well in large codebases because the compiler identifies impacted paths precisely, reducing hidden behavior drift during feature work.

```ocaml
(* After changing a variant, compile: the type checker lists missing match arms. *)
type status = Idle | Running | Done

let show = function Idle -> "…" | Running -> "…" | Done -> "…"
```

---

## 21. Conditionals, `exn`, and why not “error-shaped” return values

**`if … then … else …`** is an expression: both branches must have compatible types, and there is no `else`-less form—use `if cond then x else ()` when the “false” path is `unit`.

**Exceptions** use the built-in type **`exn`**, which is an **extensible** variant: libraries and programs can add new constructors over time. That keeps interop flexible but means exception effects are **not** visible in function types—read API docs or wrap risky calls. Prefer **`option`** or **`result`** at **boundaries** where callers must handle failure; reserve `raise` for impossible states or rare control flow where the type system would be noise.

**Anti-pattern:** encoding “error” as a **magic** scalar inside a normal return type (sentinel integers, empty strings, magic booleans). It mirrors C-style `errno` / `-1` patterns: callers forget to check, and auditors cannot see failure in types. Use explicit `option`/`result` instead.

```ocaml
let parse_int s =
  try Ok (int_of_string s) with Failure _ -> Error "not an int"
```

---

## 22. Quoted string literals

Beyond `"..."`, OCaml supports **quoted strings** where delimiters avoid escaping (e.g. `{| ... |}` and `{delim| ... |delim}`). Use them for **regexes**, **paths**, **JSON** snippets, or any text heavy with backslashes and quotes—readability beats manual escaping in reviews.

```ocaml
let path = {|C:\Users\dev\project|}
let json = {|{"ok": true}|}
```

---

## 23. Records: punning, `with`, and disambiguation

**Field punning:** when a variable has the same name as a record field, you can write `{ x; y }` instead of `{ x = x; y = y }` when constructing or pattern-matching, if types are clear.

**Functional update:** `{ r with field = expr }` copies `r` except for the listed fields—idiomatic for immutable “change one field” updates.

**Disambiguation:** when several record types share field names, the compiler picks a type using **local type information**—annotations on parameters, the set of fields used together, or (as a last resort) **recent** type definitions in scope. That last rule is **fragile**: reordering types or adding `open` can change inference. Prefer **explicit annotations** on public APIs and in tricky matches so refactors do not silently flip which record type you meant.

```ocaml
type point = { x : float; y : float }

let origin = { x = 0.; y = 0. }
let moved p dx = { p with x = p.x +. dx }
let norm { x; y } = sqrt (x *. x +. y *. y)
```

---

## 24. Lazy computations (`Lazy.t`)

**`lazy (expr)`** defers evaluation; **`Lazy.force`** runs the computation once and **memoizes** the result. Use for expensive pure work that might not be needed, or to break dependency cycles in data structures—avoid lazy **effects** unless you document evaluation order (effects run at force time, not at lazy creation).

```ocaml
let expensive =
  lazy
    (print_endline "compute once";
     List.init 1_000_000 Fun.id)

let v = Lazy.force expensive
let w = Lazy.force expensive
(* print_endline runs once *)
```

---

## 25. Exceptions beyond `raise` and `try`

You can declare **new** exception constructors (`exception E of …`). **`exn`** is **extensible**, so libraries add constructors over time.

**`try … with …`** pattern-matches on exceptions like ordinary variants. **`match e with exception Not_found -> …`** handles exceptions raised **while** matching `e` (not nested arbitrarily inside other patterns).

**Locally scoped exceptions** (`let exception E in …`) confine a control-flow label to a small region—useful for **fixpoint** search or backtracking without polluting the global `exn` namespace.

**Finalisation idiom:** `try … with e -> cleanup (); raise e` restores invariants; in production prefer **`Fun.protect`**-style helpers or domain-specific wrappers so backtraces and resource rules stay consistent.

```ocaml
exception Not_found

let assoc_opt k xs =
  match List.assoc k xs with
  | exception Not_found -> None
  | v -> Some v
```

---

## 26. Generalized algebraic datatypes (GADTs)—what they buy you

Ordinary variants are **uniform**: each constructor’s payload types are fixed. **GADTs** let constructors carry **more specific** type information, often by indexing the type with a type parameter that **refines** in each case. Typical uses:

- **Typed** abstract syntax trees (e.g. “this subtree is an expression of type `int` in the object language”).
- **Proof**-carrying data in verification-oriented code.

Trade-offs: type errors become more abstract; tooling and error messages can be harder for newcomers. Treat GADTs as a **specialist** tool; most services stick to ordinary variants plus modules.

```ocaml
type _ expr =
  | Int : int -> int expr
  | Bool : bool -> bool expr
  | Add : int expr * int expr -> int expr

let eval : type a. a expr -> a = function
  | Int n -> n
  | Bool b -> b
  | Add (a, b) -> eval a + eval b
```

---

## Advanced use cases and implementation

**API design:** Use `result` at boundaries between subsystems; keep exceptions for invariant violations that should never happen if the rest of the code is correct. Log or map errors with stable codes for operations, not only human strings.

**Services:** Stack depth and allocation patterns matter under load; prefer tail recursion or iterators for unbounded inputs. Mutable caches are fine behind a small interface if concurrency rules are clear (see chapter 6).

**Security:** Parsing untrusted input should produce `result` or `option` and never trust success based on a bare string; combine with validation before acting on data.

```ocaml
type err = [ `Invalid | `TooLarge ]

let parse_config s : (_, [> err ]) result =
  if String.length s > 10_000 then Error `TooLarge else Ok s
```

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
