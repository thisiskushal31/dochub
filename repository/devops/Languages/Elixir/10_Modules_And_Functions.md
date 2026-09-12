# Modules and functions

[← Back to Elixir](./README.md)

Elixir code is organized in **modules** and **functions**. Modules group related functions and are the unit of compilation and reuse. Functions can have multiple **clauses** and **guards**; they are identified by name and **arity** (e.g. `length/1`). This topic covers **defining modules and functions**, **default arguments**, **aliases**, **alias/require/import/use**, and **module attributes** so you can read and write clear, modular code.

---

## Module and function definition

A module is defined with `defmodule`; functions inside it are defined with `def` (public) or `defp` (private). The result of the last expression in a function is its return value; there is no explicit “return.” Functions are often written with multiple clauses: the first pattern (and guards) that matches runs.

```elixir
defmodule Math do
  def add(a, b) do
    a + b
  end

  def double(x) when is_number(x), do: x * 2
  def double(_), do: :error
end
Math.add(1, 2)
# => 3
Math.double(3)
# => 6
```

Single-clause one-liners can use `do:` instead of `do ... end`. Guards (`when`) restrict when a clause matches; they support a subset of expressions (e.g. type checks, comparisons).

---

## Default arguments

Function parameters can have default values. Defaults are **evaluated at call time** (not at definition time), so a default like `\\ IO.gets("prompt> ")` runs each time the function is called with that argument omitted. Default arguments are used for optional options or backward compatibility; put them at the end of the parameter list. If a function has **multiple clauses**, you must declare defaults in a **function head** (a clause with no body) and then define the real clauses; otherwise the compiler cannot know which clause gets the default.

```elixir
defmodule Concat do
  def join(a, b, sep \\ " ")

  def join(a, b, _sep) when b == "", do: a
  def join(a, b, sep), do: a <> sep <> b
end
Concat.join("Hello", "world")
# => "Hello world"
Concat.join("Hello", "world", "_")
# => "Hello_world"
```

---

## alias, require, import, use

- **alias** — Shortens a module name: `alias MyApp.Long.Module` lets you write `Module.fun` instead of the full name. Common in the top of a module.
- **require** — Ensures a module is compiled and available; needed before using its **macros**.
- **import** — Brings the module’s functions (and macros) into the current scope so you can call them without the module prefix. Use sparingly to avoid name clashes; prefer `alias` and qualified calls.
- **use** — Invokes the module’s `__using__/1` callback, which typically injects code (e.g. `use GenServer`, `use ExUnit.Case`). It is a convention for extending the current module.

**Aliases** compile to atoms (e.g. `String` → `:"Elixir.String"`); that is how the BEAM represents modules. **Module nesting** (e.g. `defmodule Foo do defmodule Bar do`) defines `Foo` and `Foo.Bar`; you can also write `defmodule Foo.Bar do` without defining `Foo` first. Multi alias/import/require/use are supported with list syntax. In application code, explicit module names (or a short alias) often improve readability and make dependencies clear—important for security review and maintenance.

---

## Module attributes

Module attributes are set with `@name value`. They can be used as **annotations** (e.g. `@doc`, `@moduledoc`), as **temporary storage** during compilation, or as **constants** (read with `@name` in the same module). They are evaluated at compile time, so they can hold config or metadata that does not change at runtime.

```elixir
defmodule Example do
  @greeting "Hello"
  def say do
    @greeting
  end
end
Example.say()
# => "Hello"
```

---

## Scripting

Outside a project, you can run a single file with `elixir script.exs`. For scripts that need modules, define the module in the same file or in a separate `.ex` file and load it. For larger applications, use **Mix** (Topic 19) to create a project and manage dependencies and compilation.

---

## Further reading

- [Modules and functions — HexDocs](https://hexdocs.pm/elixir/modules-and-functions.html)
- [Module module](https://hexdocs.pm/elixir/Module.html)
