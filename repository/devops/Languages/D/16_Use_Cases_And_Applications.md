# D — Use cases and applications

[← D README](./README.md)

By this point you have covered **very basic** (modules, types, expressions) through **advanced** (templates, contracts, traits, errors, GC, interop) to **implementation**. This topic ties those concepts to real use cases from **all sides of engineering**: software, DevOps, security, systems, and research. D is used in systems tooling, game development, scripting, and native libraries where performance and control matter.

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

## By engineering perspective

Use cases and implementation focus depend on your role. The following maps **what to do** and **which topics support it**.

**Software / application engineer:** Ship native apps, libraries, or scripts. Focus on Topics 2 (dub, build), 5–9 (expressions, arrays, structs, classes, functions), 10 (templates), 12 (unit tests). Implement: CLI tools, shared libraries with **extern(C)** API, or dub packages consumed by other D or C/C++ projects.

**DevOps / SRE:** Integrate D into pipelines, operate tooling, deploy binaries. Focus on Topics 2 (dub build, dmd flags), 11 (conditional compilation for platform), 14 (interop for scripting or glue), 16–17. Implement: CI steps that run **dub test** and **dub build**, artifact publishing, or small automation binaries (e.g. Better C) with no runtime dependency.

**Security / cybersecurity engineer:** Audit D codebases, analyze native binaries, harden supply chain. Focus on Topics 4 (types, qualifiers), 11 (contracts), 12 (traits, tests), 15 (memory safety, @safe), 17. Implement: Review for @safe boundaries and raw pointer use; audit **dub.json** dependencies; use contracts and unit tests as assurance evidence.

**Systems / low-level engineer:** Compilers, kernels, drivers, or high-performance libraries. Focus on Topics 13 (GC vs manual memory, floating point), 14 (C/C++ interop), 15 (inline asm, ABI, Better C, vector extensions). Implement: D libraries callable from C, or Better C components with minimal runtime; use **version** and **static if** for platform-specific paths.

**Research / prototyping:** Experiments, performance studies, or metaprogramming. Focus on Topics 10 (templates, mixins), 11 (contracts), 12 (traits), 13–15. Implement: Compile-time code generation, numeric or SIMD experiments, or D as a scripting front end to C libraries.

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
| By role | See “By engineering perspective” above; each role has a focused topic set and implementation angle. |

For security, dependency hygiene, and safe deployment when working with D, see **[Topic 17 — Security and best practices](./17_Security_And_Best_Practices.md)**.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D language](https://dlang.org/)
- [Organizations using D](https://dlang.org/orgs-using-d.html)
