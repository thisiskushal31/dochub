# Cairo — Getting started

[← Cairo README](./README.md)

This topic covers installing Cairo, creating a project with Scarb, and writing a minimal program that prints "Hello, world!". Scarb is Cairo’s build tool and package manager; it bundles the compiler and language server so you can compile and run Cairo code from the command line.

---

## Installation

Cairo is installed via **starkup**, a command-line tool that manages Cairo and related tools. You need an internet connection for the download. Starkup installs the latest stable **Scarb**, which includes the Cairo compiler and language server. Scarb is also the package manager (similar in role to Cargo for Rust). It builds code (pure Cairo or Starknet contracts), fetches dependencies, and works with the VSCode Cairo extension for syntax highlighting and completion.

**Starknet Foundry** is the default test runner when you create a Cairo project with Scarb. It supports tests, deployment, and interacting with Starknet; you can install it via starkup as well.

**Install starkup (Linux or macOS):** run in a terminal:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.starkup.dev | sh
```

After the script finishes, starkup installs the latest stable Cairo, Scarb, and Starknet Foundry. Restart the terminal if needed, then check:

```bash
scarb --version
snforge --version
```

**VSCode:** Install the Cairo extension from the marketplace and enable "Enable Language Server" and "Enable Scarb" in the extension settings.

For help with Cairo or Starknet, you can use community resources such as the Starknet Discord server. Starknet also offers an AI agent trained on Cairo and Starknet documentation for answering questions.

---

## Creating a project

Create a directory for your projects (e.g. `~/cairo_projects`), then create a new Scarb project:

```bash
mkdir -p ~/cairo_projects
cd ~/cairo_projects
scarb new hello_world
cd hello_world
```

When Scarb asks which test runner to set up, choose **Starknet Foundry (default)** unless you prefer Cairo Test. Scarb generates a `Scarb.toml` manifest and a `src` directory. For a simple executable (no Starknet contract), you can use a minimal `Scarb.toml` and a single module.

**Minimal Scarb.toml for an executable:**

```toml
[package]
name = "hello_world"
version = "0.1.0"
edition = "2024_07"

[cairo]
enable-gas = false

[dependencies]
cairo_execute = "2.13.1"

[[target.executable]]
name = "hello_world_main"
function = "hello_world::hello_world::main"
```

**Project layout:** Put source under `src/`. For example, `src/lib.cairo` declares the module, and `src/hello_world.cairo` holds the entry point:

```
├── Scarb.toml
├── src
│   ├── lib.cairo
│   └── hello_world.cairo
```

**src/lib.cairo:**

```cairo
mod hello_world;
```

**src/hello_world.cairo:**

```cairo
#[executable]
fn main() {
    println!("Hello, World!");
}
```

---

## Building and running

From the project directory:

```bash
scarb build
scarb execute
```

`scarb build` compiles the project. `scarb execute` runs the executable and prints `Hello, World!` to the terminal.

---

## Anatomy of the program

The entry point is the `main` function. It is special: for an executable target, it is the first code that runs. The function has no parameters and no return value here. The body is enclosed in curly braces.

```cairo
fn main() {

}
```

The line `println!("Hello, World!");` prints the text. `println!` is a macro (the `!` indicates a macro, not a normal function). The string is passed as an argument. The line ends with a semicolon, which marks the end of the statement. Cairo style is to indent with four spaces.

---

## Further reading

- [The Cairo Book — Getting Started](https://www.starknet.io/cairo-book/ch01-00-getting-started.html)
- [The Cairo Book — Installation](https://www.starknet.io/cairo-book/ch01-01-installation.html)
- [The Cairo Book — Hello, World!](https://www.starknet.io/cairo-book/ch01-02-hello-world.html)
- [Scarb documentation](https://docs.swmansion.com/scarb/docs.html)
- [Cairo README](./README.md) — Topic index.
