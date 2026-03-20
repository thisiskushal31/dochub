# Backend integration and C/C++/JS interop

[← Back to Nim](./README.md)

## What this topic covers

This chapter explains **which code generators** exist (**C**, **C++**, **Objective-C**, **JavaScript**), how **Nim calls C** (and similar) and **how hosts call Nim**, and what **breaks** when you mix **strings**, **GC**, and **foreign** lifetimes. **Low-level** pragma tables, **mangling** rules, and **platform** linkers are **referenced** from the manual and backend guide—use those for **copy-paste** FFI work.

## Why backends matter

Nim is usually described as “compiles to C,” but the toolchain actually targets a **family of native generators** (**C**, **C++**, **Objective-C**) and a separate **JavaScript** pipeline. Picking the backend changes **linking**, **debugging**, **what the stdlib can do**, and how you **embed** or **call** Nim from other languages.

## Native (C-like) targets

Commands such as **`nim c`**, **`nim cpp`**, and **`nim objc`** all produce **native binaries**; the practical difference shows up in **generated sources** under the **nim cache** (`.c`, `.cpp`, `.m`) and in which **language-specific pragmas** you use when binding to existing code. **Cross-compilation** uses extra compiler switches for CPU, OS, and toolchain selection.

## JavaScript target

**`nim js`** emits JavaScript (historically ES3-oriented; runtimes such as **Node** are common for execution). Not everything available on native targets exists on JS: expect restrictions around **manual memory tricks**, **unsafe casts**, **file/OS** surfaces, **threading**, and parts of the standard library. The library includes **JS-oriented modules** for browser and Node workflows; feature gaps are a normal design constraint when sharing code between backends.

## Nim calling backend code

The usual pattern for C (and analogues for other native backends) is **`importc`** (and related pragmas) per the language manual. For **C++** and **Objective-C**, there are **backend-specific** import pragmas for classes and methods.

Linking strategy matters in production:

- **Dynamic linking** is often preferred so build machines do not need every dev library installed; **`dynlib`**-style imports support that.
- **Static linking** or bundling **`.c` / `.o` / archive** artifacts is common for controlled deployments; **`compile`**, **`passL`**, and toolchain flags express that.
- Header-driven wrapping at scale often uses **c2nim** or hand-maintained layers—either way, **ABI** and **lifetime** rules stay your responsibility.

Text first (C symbol):

```nim
proc c_puts(s: cstring): cint {.importc: "puts", header: "<stdio.h>".}
discard c_puts("Hello from Nim interop")
```

## Backend code calling Nim

**`exportc`** exposes Nim procedures to the backend with a stable symbol name (mangling is otherwise normal). On **C-like** targets, embedders must initialize Nim runtime via **`NimMain`** (name overridable with **`--nimMainPrefix`**). **Libraries** may need **`NimDestroyGlobals`** (or prefixed variant) so global destructors run where a full Nim program would have exited cleanly.

**JavaScript** embedding is simpler from a “no NimMain” perspective: generated code can be loaded like other JS and called from the host page or Node, subject to how you package the output file.

## Memory and strings at the boundary

Scalar examples hide complexity: **strings**, **references**, and **custom types** need explicit rules for **who frees what**. Nim strings often interop with **`cstring`** for C calls, but **lifetimes** must match the callee’s contract. Sharing **GC-managed** references with C may require **pinning**/**unpinning** patterns documented for the runtime you use. Treat every boundary as **security-critical**: use tests and fuzzing where feasible.

## Engineering cautions

- Validate **ABI**, calling conventions, and **32/64-bit** assumptions.
- Isolate **unsafe** and **FFI** modules behind small, reviewed APIs.
- Add **integration tests** at every interop seam.
- For **JS**, verify **target runtime** version (for example **globalThis** expectations on older Node).

---

## Further reading

- [Backend integration](https://nim-lang.org/docs/backends.html)
- [Compiler user guide](https://nim-lang.org/docs/nimc.html)
- [Language manual — FFI](https://nim-lang.org/docs/manual.html#foreign-function-interface)
- [c2nim](https://github.com/nim-lang/c2nim)
- [Nim language repository](https://github.com/nim-lang/Nim)
