# D — Portability, memory safety, and advanced topics

[← D README](./README.md)

**Portability** concerns writing D that works across platforms (OS, CPU, ABI). **Memory safety** (@safe, @system, @trusted) restricts operations to prevent buffer overflows and use-after-free. **Better C** is a subset of D that can be compiled without the D runtime for C-like deployment. **Vector extensions**, **ABI**, **Windows**-specific and **editions** round out the spec. These topics matter for security-sensitive or cross-platform code.

**Why memory safety?** @safe code avoids raw pointers and unchecked casts so the compiler can enforce safety. **Why Better C?** It allows D syntax and features where only a C runtime is acceptable.

---

## Memory safety

**@safe** functions may not use certain operations (e.g. raw pointer arithmetic, unsafe casts). **@system** is the default and allows everything. **@trusted** marks code that is manually verified safe and callable from @safe. Use @safe by default and narrow @trusted to small, audited boundaries.

```d
@safe int add(int a, int b) { return a + b; }
@trusted void wrapLegacy() { legacyUnsafeCall(); }
```

---

## Portability and ABI

The **portability** guide and **ABI** spec describe platform differences (sizes, alignment, calling conventions). Use **version (Windows)**, **version (Linux)**, etc., and **static if** with **size_t.sizeof** or **traits** when you need platform-specific code. Stick to standard types and documented interfaces for portability.

---

## Better C and ImportC

**Better C** compiles D without the D runtime (no GC, no D main). Use **-betterC** (or equivalent) and restrict the code to the subset that works. **ImportC** parses C headers for interop. Both support gradual migration from C to D.

---

## Inline assembler and embedded documentation

**D x86 Inline Assembler** allows embedding assembly instructions in D code for low-level or performance-critical sections; the syntax and constraints are platform-specific (x86/x64). **Embedded documentation** (**ddoc**) uses comment blocks and conventions that tools can extract to generate API docs. Use inline asm only when necessary; use ddoc to document public APIs.

**Live Functions** are a feature for dynamic or interactive execution contexts; the spec describes their semantics. Refer to the language reference for details when you need them.

---

## Editions, Windows, and glossary

**Editions** (e.g. default, **preview**) enable or disable language features for compatibility. **Windows** programming covers Win32 API and D-specific support. The **glossary** and **legacy** sections define terms and deprecated behavior. Refer to the spec when targeting a specific platform or edition.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Memory Safety](https://dlang.org/spec/memory-safe-d.html)
- [D spec: Better C](https://dlang.org/spec/betterc.html)
- [D spec: Portability](https://dlang.org/spec/portability.html)
- [D spec: D x86 Inline Assembler](https://dlang.org/spec/iasm.html)
- [D spec: Embedded Documentation](https://dlang.org/spec/ddoc.html)
- [D spec: Live Functions](https://dlang.org/spec/ob.html)
- [D spec: Named Character Entities](https://dlang.org/spec/entity.html)
- [D spec: Application Binary Interface](https://dlang.org/spec/abi.html)
- [D spec: Vector Extensions](https://dlang.org/spec/simd.html)
- [D spec: Windows Programming](https://dlang.org/spec/windows.html)
- [D spec: Glossary](https://dlang.org/spec/glossary.html)
- [D spec: Legacy Code](https://dlang.org/spec/legacy.html)
- [D spec: Editions](https://dlang.org/spec/editions.html)
