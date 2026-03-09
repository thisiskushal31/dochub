# D — Environment and build

[← D README](./README.md)

To build and run D programs you need a **D compiler** (e.g. **DMD**, **GDC**, or **LDC**) and optionally **dub** as the package and build manager. The compiler produces native object files and executables; dub handles dependencies and project layout.

**Why this matters:** Knowing how to compile and link D code lets you run examples, integrate D into scripts or CI, and inspect build artifacts when reviewing or analyzing projects.

---

## Installing a D compiler

Install **DMD** (reference compiler) or **LDC**/ **GDC** for your platform from the official D site or your package manager. Verify:

```bash
dmd --version
# or
ldc2 --version
```

---

## Building from the command line

Compile a single file to an executable:

```bash
dmd app.d -of=app
./app
```

Generate an object file for linking:

```bash
dmd -c module.d
```

Multiple modules are passed together; the compiler resolves imports from the module path.

---

## Using dub

**dub** is the standard package and build tool. Initialize a new project:

```bash
dub init myapp
cd myapp
```

Build and run:

```bash
dub build
dub run
```

`dub.json` or `dub.sdl` defines dependencies, source paths, and build configurations. Dependencies are fetched from the [D package registry](https://code.dlang.org/).

---

## Project layout

A typical dub project has **source/** for `.d` files, **dub.json** or **dub.sdl** for configuration, and optionally **dub.selections.json** for locked dependency versions. The entry point is often **main** in a module named after the package or an explicit `mainSourceFile`.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D downloads](https://dlang.org/download.html)
- [dub](https://code.dlang.org/)
