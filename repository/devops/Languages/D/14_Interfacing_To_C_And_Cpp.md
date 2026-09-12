# D — Interfacing to C and C++

[← D README](./README.md)

D can call **C** and **C++** code and be called from C/C++ via **extern(C)** and **extern(C++)** linkage. **ImportC** allows importing C headers directly. Interop is essential for using existing libraries and for embedding D in C/C++ projects.

**Why interop?** Large ecosystems exist in C and C++; D can reuse them without reimplementation. **Why linkage?** The ABI (calling convention, name mangling) must match so that D and C/C++ object files link correctly.

---

## extern(C)

**extern(C)** uses the C calling convention and C name mangling. Functions and global variables declared **extern(C)** can be linked with C object files or libraries. **pragma** **mangle** can override the symbol name.

```d
extern(C) int printf(const char* format, ...);
extern(C) double sqrt(double x);
void main()
{
    printf("sqrt(2) = %f\n", sqrt(2.0));
}
```

---

## Binding to C libraries

Declare C functions and types in D with the same layout (e.g. **size_t**, **struct** with **extern(C)**). Use **core.stdc.*** or hand-written declarations. Link the C library at link time (**-L** or dub **libs**).

---

## extern(C++) and Objective-C

**extern(C++)** uses C++ name mangling and (where supported) C++ linkage. **extern(Objective-C)** is for Objective-C classes and methods. Interfacing to C++ requires matching types (e.g. **class** vs **struct**) and sometimes **pragma** **cpp_namespace** or helper wrappers.

---

## ImportC

**ImportC** allows the compiler to parse C header files and generate D bindings. Use it to integrate C APIs without hand-writing declarations. Not all C constructs are supported; see the ImportC spec for limitations.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D spec: Interfacing to C](https://dlang.org/spec/interfaceToC.html)
- [D spec: Interfacing to C++](https://dlang.org/spec/cpp_interface.html)
- [D spec: ImportC](https://dlang.org/spec/importc.html)
