# Crystal — Environment setup and install

[← Crystal README](./README.md)

To run and compile Crystal programs you need the **Crystal compiler**. Crystal produces **native executables**, so there is no separate runtime to install once the binary is built. This topic covers how to install the compiler and run your first program.

**Why install the compiler?** Crystal is **compiled**, not interpreted. The compiler (`crystal`) parses source, type-checks it, and generates native code. Commands like `crystal run` and `crystal build` invoke the compiler; without it you cannot build or run Crystal code.

---

## Installing the compiler

Install the Crystal compiler using the recommended method for your platform:

- **macOS (Homebrew):** `brew install crystal`
- **Linux:** Use the official package repository for your distribution (see the install link below).
- **Docker:** Use an official Crystal image for a consistent build environment.

After installation, verify:

```bash
crystal --version
```

---

## Running code

Run a single file without producing a separate executable:

```bash
crystal run app.cr
```

Build a release executable (optimized, standalone):

```bash
crystal build app.cr --release
./app
```

The `--release` flag enables optimizations; omit it for faster compile times during development.

---

## Project layout

A typical project has a `src/` directory for source files and a `shard.yml` for dependencies (Shards). The main file is often `src/<project_name>.cr` or `src/main.cr`. Use `crystal init app myapp` to scaffold an application or `crystal init lib mylib` for a library.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal install guide](https://crystal-lang.org/install)
