# D — Use cases and applications

[← D README](./README.md)

By this point you have covered **basics** (modules, types, expressions, arrays, structs, classes), **advanced** (templates, contracts, traits, errors, GC, interop), and **portability** topics. This section is **where you implement**: it ties those concepts to real use cases. D is used in systems tooling, game development, scripting, and native libraries where performance and control matter.

---

## Use cases: where D appears

| Domain | Typical use | Why D fits |
|--------|-------------|------------|
| **Systems tooling** | Compilers, parsers, code generators | Native speed, metaprogramming, low-level control |
| **Scripting and CLI** | dub-run scripts, small utilities | Fast startup, single binary, easy deployment |
| **Game and graphics** | Bindings, native back ends | C/C++ interop, predictable performance |
| **DevOps and automation** | Build tools, custom agents | Compile to native, no runtime dependency (with Better C) |
| **Security and analysis** | Binary analysis, tooling | Direct memory, inline asm, interfacing to C |
| **Legacy and niche** | Existing D codebases, research | Mature language, long-standing projects |

---

## Implementation: building and deploying

Use **dub** for application and library projects: **dub build**, **dub run**, **dub test**. Use **dmd**/ **ldc2**/ **gdc** for one-off compiles or custom build scripts. For **Better C**, build with **-betterC** and link only the C runtime. For **shared libraries**, use **-shared** and **extern(C)** exports for the public API.

---

## Implementation: reading and navigating a D codebase

Start with **dub.json**/ **dub.sdl** for project layout and dependencies. Entry points are **main()** or the module specified as **mainSourceFile**. Follow **import** to see module structure. **unittest** blocks document expected behavior. Use **grep** or IDE "find references" for symbols and **__traits**/ templates to see generated code paths.

---

## Summary

| Use case | Key topics |
|----------|------------|
| Tooling / CLI | 2 (build), 3 (modules), 9 (functions), 12 (testing) |
| Native library | 7 (classes), 10 (templates), 14 (interop), 15 (ABI) |
| Safe / auditable code | 4 (types), 11 (contracts), 12 (traits, tests), 15 (memory safety) |
| Reading / analysis | 1–5, 7, 10, 12 |

For security, dependency hygiene, and safe deployment when working with D, see **[Topic 17 — Security and best practices](./17_Security_And_Best_Practices.md)**.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D language](https://dlang.org/)
- [Organizations using D](https://dlang.org/orgs-using-d.html)
