# Crystal — Compiler and build

[← Crystal README](./README.md)

The **crystal** command is the compiler and driver. You use it to **run** a file (compile and execute), **build** an executable, or **eval** a snippet. For production, you typically build a **release** binary; for deployment you may use **static linking** or a container image so the binary is self-contained.

**Why the compiler matters:** Crystal has no separate runtime. The compiler produces a native binary; that binary is what you deploy. Knowing how to build for release, how to link libraries, and how to target a platform (including cross-compilation) is essential for DevOps and deployment.

---

## crystal run and crystal build

**crystal run** compiles and runs the given file; no executable is left on disk unless you pass **--no-codegen**. **crystal build** produces an executable; **--release** enables optimizations and is recommended for production.

```bash
crystal run src/app.cr
crystal build src/app.cr -o app
crystal build src/app.cr --release -o app
```

---

## Release build

A **release** build enables optimizations and typically strips debug info. Use it for production binaries to get smaller size and better performance.

```bash
crystal build src/app.cr --release -o app
```

---

## Static linking

By default the binary may depend on system libraries (e.g. libc). **Static linking** embeds those dependencies so the binary is more portable. Support depends on the platform and the Crystal version; see the static linking guide for your environment.

---

## Platform support and required libraries

Crystal targets a set of platforms (Linux, macOS, Windows, etc.). Some features or C bindings require specific system libraries. The **required libraries** documentation and **platform support** pages describe what is needed per OS. For containers, use an image that includes the needed libraries or a fully static binary.

---

## Performance and optimization

The compiler uses LLVM for optimization: inlining, dead code elimination, and loop vectorization apply especially in **--release** builds. To optimize further: prefer **value types** (structs) to reduce heap allocation; reuse objects where possible; use **StaticArray** for fixed-size arrays; and avoid building intermediate strings when you can write to an **IO** with **to_s(io)**. Always profile with **--release** and tools like **perf** or **Instruments** before tuning.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal compiler manual](https://crystal-lang.org/reference/man/crystal.html)
- [Static linking guide](https://crystal-lang.org/reference/guides/static_linking.html)
- [Platform support](https://crystal-lang.org/reference/syntax_and_semantics/platform_support.html)
