# Environment and installation

[← Back to Elixir](./README.md)

To run Elixir you need the **Elixir** runtime and the **Erlang/OTP** runtime (the BEAM). This topic covers how to install them, how to use the **interactive shell (IEx)** and run **scripts**, and what to expect from the environment so you can follow the rest of the section and run examples on your machine.

---

## Requirements

Elixir runs on the BEAM, so **Erlang/OTP** must be installed first. Current documentation typically assumes:

- **Erlang/OTP 26** or later
- **Elixir 1.15** or later

Check the official installation page for your OS for the exact minimum versions and recommended builds.

---

## Installing Elixir

Installation is OS-specific. Common options:

- **macOS:** Package managers like Homebrew: install Erlang/OTP, then Elixir. Prebuilt packages are also available.
- **Windows:** Use the official installer that bundles Erlang and Elixir, or a package manager (e.g. Chocolatey) if you prefer.
- **Linux:** Use the official installation instructions (e.g. apt/deb or rpm repos, or prebuilt packages). Many distros also offer Erlang and Elixir in their package repositories; ensure versions meet the minimum above.

After installation, open a new terminal and confirm both runtimes:

```bash
elixir --version
erlang
```

You should see the Elixir and Erlang version lines. If `elixir` or `iex` is not found, fix your PATH so the install directory is included.

---

## Three executables

Once installed, you get three main commands:

- **iex** — Interactive Elixir. Starts a REPL where you type expressions and see results. Use it to try small snippets and explore the language. On Windows PowerShell, use **iex.bat** if `iex` is reserved.
- **elixir** — Runs a script (e.g. `elixir my_script.exs`). Scripts are typically **.exs** (interpreted); no separate compile step. The **.ex** and **.exs** files are treated the same by the compiler; the convention is **.ex** for compiled modules and **.exs** for scripts and tests.
- **elixirc** — Compiles **.ex** files into BEAM bytecode (**.beam**). Mix uses this when you run **mix compile**; you rarely call **elixirc** directly. You can also load a script into IEx with **iex script.exs** so the script runs and then you get a shell with the defined modules available.

For learning and for quick automation scripts, **iex** and **elixir** are enough.

---

## Interactive mode (IEx)

Start the shell with:

```bash
iex
```

You’ll see a prompt like `iex(1)>`. Type any Elixir expression and press Enter to evaluate it. Example:

```elixir
iex(1)> 40 + 2
42
iex(2)> "hello " <> "world"
"hello world"
```

To exit IEx, press **Ctrl+C** twice, or type **Ctrl+\** depending on your platform. Help is available with `h()` or `h(Module.function/arity)`.

IEx is useful for trying types, pattern matching, and one-liners without creating a file.

---

## Running scripts

Put code in a file with a `.exs` extension (e.g. `simple.exs`) and run it with `elixir`:

```elixir
IO.puts("Hello world from Elixir")
```

Save as `simple.exs`, then:

```bash
elixir simple.exs
```

Output: `Hello world from Elixir`. No compilation step is required for scripts. For larger applications you will use **Mix** (Topic 19) to create a project and build releases.

---

## What you need for this handbook

- **Learning:** Install Elixir and Erlang, then use **iex** and **elixir** to run the examples in the following topics.
- **DevOps:** Same install on build agents and deployment targets; use **Mix** and **releases** for production (Topics 19–20, 22).
- **Security:** Ensure you use a supported Elixir/OTP version and track advisories; see Topic 22.

---

## Further reading

- [Elixir installation guide](https://elixir-lang.org/install.html)
- [Introduction — Running scripts](https://hexdocs.pm/elixir/introduction.html#running-scripts)
