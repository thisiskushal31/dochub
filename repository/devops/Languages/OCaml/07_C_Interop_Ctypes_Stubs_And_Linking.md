# C interop: Ctypes, stubs, and linking

[← Back to OCaml](./README.md)

## What this chapter covers

How OCaml programs call C functions and link native libraries: stub code that converts values at the boundary, Ctypes for describing C layouts in OCaml, and dune rules that compile C sources and pass linker flags. CI must install the same development headers and shared-library dependencies as developer machines.

```ocaml
(* C symbol name must match the stub you link — see the manual’s interfacing chapter *)
external my_stub : int -> int = "my_stub"
```

---

## 1. Why FFI appears

FFI reaches operating system APIs, cryptographic libraries (e.g. OpenSSL), databases (e.g. SQLite), media codecs, and legacy C codebases. The ecosystem provides many bindings; you write custom stubs when you need coverage the ecosystem does not ship or when you need tight control over allocation and lifetimes.

Operations pain usually shows up here: missing `-dev` packages on Linux CI, incorrect `pkg-config` paths, or ABI mismatch between compiler or libc versions.

```bash
pkg-config --libs openssl
```

---

## 2. Stubs: marshaling values

A stub is glue code (often C) that converts OCaml values into C types before a call and converts results back afterward. Layout rules for strings, bigarrays, and custom blocks are part of the runtime contract—they are not checked by the OCaml type system on the C side. Errors are memory bugs of the same severity as ordinary C.

Treat every stub on a security-sensitive path as C code during review.

```c
#include <caml/mlvalues.h>
#include <caml/memory.h>

CAMLprim value stub_twice(value n) {
  CAMLparam1(n);
  CAMLreturn(Val_long(Long_val(n) * 2));
}
```

---

## 3. Ctypes

Ctypes describes C types and function signatures in OCaml and can call into C or help generate bindings. It reduces boilerplate but does not remove obligation: incorrect struct layout or calling convention still corrupts memory.

```ocaml
(* Conceptual — requires the ctypes library *)
(* let open C in *)
(* let t = structure "point" in *)
(* let () = field t "x" int *)
```

---

## 4. Linking and dune

dune declares foreign archives, C sources, and compiler or linker flags. System dependencies often appear as `conf-*` opam packages that probe for headers and libraries during configuration.

Reproducible builds pin not only opam packages but also base-image packages (for example `libssl-dev` on Debian) that satisfy those probes.

```scheme
(executable
 (name app)
 (foreign_stubs
  (language c)
  (names stub)))
```

---

## 5. The runtime lock and re-entrancy

The OCaml runtime coordinates the **GC** and **mutator** with rules about **which** OS thread may execute OCaml code at a time. C stubs that call **back** into OCaml, or C libraries that invoke **callbacks** from **worker** threads, must follow the **locking** contract for your compiler version: acquire the **runtime lock** before touching the OCaml heap from a foreign thread, and never hold OCaml-visible structures across arbitrary C concurrency without a documented plan.

Getting this wrong produces **intermittent** crashes—exactly the class of bugs that slip past unit tests. **Document** next to each binding whether callbacks may run on **library** threads and whether those threads ever call into OCaml.

```c
/* Before calling back into OCaml from a foreign thread, acquire the runtime lock
   (exact API is version-specific — see the manual’s interfacing chapter). */
```

---

## 6. GC roots and long-lived C pointers

If C **stores** a pointer to an OCaml value between calls (for example in a **handle** struct), the GC must know that value is **live** even if no OCaml variable references it. The manual describes **global** and **local** **registration** of roots; forgetting **release** leaks or leads to **use-after-free** when the value is collected.

**Bigarray** and **custom** blocks have their own **finalization** and lifetime stories—pair **free** in C with the right **deallocation** hook on the OCaml side.

```c
/* caml_register_global_root(&global_ocaml_value); … caml_remove_global_root … */
```

---

## 7. ABI compatibility and upgrade discipline

FFI breakage often appears only after upgrades:

- Compiler or runtime upgrades can change calling assumptions.
- Library minor upgrades can alter struct layout, symbol names, or behavior.
- OS updates can replace shared objects with subtly different ABI contracts.

Treat FFI bindings as versioned interfaces: run compatibility tests against every supported target OS and architecture, and gate dependency bumps on those tests.

```bash
ocamlopt -version
cc --version
```

---

## 8. Strings, bytes, and buffers at the boundary

OCaml **`string`** values are **immutable** UTF-8-oriented text in user code; at the C boundary you often copy into **`char`** buffers or work with **length** + **pointer** pairs. **`bytes`** is the **mutable** byte sequence type when you need in-place update on the OCaml side before passing data out.

Mismatches to watch:

- **NUL** termination: C strings often expect `'\0'`; OCaml strings **do not** carry an implicit terminator unless you add one in the stub.
- **Lifetime**: never let C retain a pointer into a **short-lived** OCaml string after the stub returns unless the value is **registered** as a root or copied.
- **Encoding**: binary protocols are **`bytes`**, **`Bigarray`**, or plain buffers—not “text” assumptions.

```ocaml
let s = "hello" in
let b = Bytes.of_string s in
Bytes.set b 0 'H';
Bytes.to_string b
```

---

## Advanced use cases and implementation

Linked shared objects pick up security updates from the OS distribution independently of OCaml source—record their versions in release notes when auditing production artifacts.

TLS verification, path sanitization, and input limits must hold inside C-backed calls as well as in pure OCaml.

```ocaml
(* Boundary: same validation rules as in OCaml; C does not add safety *)
let read_config path =
  if String.length path > 4096 then Error `path_too_long else Ok path
```

---

## References

### Primary

- [Interfacing C with OCaml](https://ocaml.org/manual/intfc.html)
- [Dune: foreign code](https://dune.readthedocs.io/en/stable/foreign-code.html)

### Community

- [ocaml-ctypes](https://github.com/ocamllabs/ocaml-ctypes)
