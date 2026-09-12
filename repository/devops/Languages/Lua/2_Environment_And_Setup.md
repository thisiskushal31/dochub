# Environment and setup

[← Back to Lua](./README.md)

Lua can be run as a standalone interpreter or embedded in a host program. This topic covers installing and using the standalone `lua` interpreter, its command-line options, and the main environment variables that affect module loading and startup.

## Getting Lua

Install the Lua interpreter and libraries from your system package manager or from the Lua website. Many distributions provide a `lua` or `lua5.5` package. On macOS you can use Homebrew (`brew install lua`); on Linux, `apt install lua5.5` or similar depending on the distro. The standalone interpreter is a single executable that runs scripts or enters interactive mode.

## Running the interpreter

The standalone interpreter is invoked as:

```text
lua [options] [script [args]]
```

If you run `lua` with no arguments and standard input is a terminal, it prints version information and enters interactive mode. If stdin is not a terminal (e.g. a pipe), it behaves as if you had passed `-`, i.e. it runs stdin as a script.

Common options:

- **`-`** — Run stdin as a script and stop processing options.
- **`--`** — Stop handling options; following arguments are passed to the script.
- **`-e stat`** — Execute the string `stat` as Lua code.
- **`-l mod`** — Call `require "mod"` and assign the result to the global `mod`.
- **`-l g=mod`** — Call `require "mod"` and assign the result to the global `g`.
- **`-i`** — Enter interactive mode after running the script.
- **`-v`** — Print version information.
- **`-W`** — Turn warnings on.
- **`-E`** — Ignore environment variables (see below).

Options `-e`, `-l`, and `-W` are processed in the order they appear. Example:

```bash
lua -e 'a=1' -llib1 script.lua
```

This sets `a` to 1, then requires `lib1`, then runs `script.lua`.

## Command-line arguments

Before running any code, the interpreter collects command-line arguments in the global table `arg`. The script name is at index 0; script arguments follow at 1, 2, etc. Arguments that are options or the interpreter name go to negative indices. Example:

```bash
lua -la b.lua t1 t2
```

Then `arg` is effectively:

```lua
arg[-2] = "lua"
arg[-1] = "-la"
arg[0]  = "b.lua"
arg[1]  = "t1"
arg[2]  = "t2"
```

If there is no script, the interpreter name is at index 0. The script is run as a chunk compiled as a variadic function and receives the arguments at `arg[1]` through `arg[#arg]`.

## LUA_INIT

When not started with `-E`, the interpreter checks the environment variable **LUA_INIT_5_5** (or **LUA_INIT** if the versioned name is not set) before running the script or interactive session. If the value has the form **`@filename`**, Lua runs that file. Otherwise it runs the value as Lua code. This is useful for loading a config or predefining globals.

With **`-E`**, Lua does not use environment variables. Then `package.path` and `package.cpath` are set to the default paths from the build (e.g. from `luaconf.h`). Use `-E` when you want reproducible, environment-independent runs.

## Module search path: LUA_PATH and LUA_CPATH

Lua finds modules via **package.path** (for Lua source) and **package.cpath** (for C libraries). At startup, **package.path** is set from **LUA_PATH_5_5** or **LUA_PATH** (or a default from the build). A **`;;`** in the value is replaced by the default path. So you can extend the search path by setting LUA_PATH in the environment; for example:

```bash
export LUA_PATH=";;/opt/mylibs/?.lua"
```

The first `;;` inserts the default path; then Lua also looks in `/opt/mylibs/` for `?.lua` (where `?` is the module name). Similarly, **LUA_CPATH_5_5** or **LUA_CPATH** set **package.cpath** for C modules.

## Interactive mode

With **`-i`** (or when `lua` is run with no script and stdin is a terminal), Lua enters interactive mode: it prompts, reads a line, and either evaluates it as an expression (and prints the result) or executes it as a chunk. If the chunk is incomplete, it prompts for more input until the chunk is complete.

Each complete line is a new chunk, so **local** variables do not persist across lines. The interpreter may warn if a line starts with `local` to avoid confusion. To keep locals across lines, use a multi-line chunk (e.g. wrap in `do ... end`).

## Embedding

When Lua is embedded, the host creates a Lua state, optionally loads the standard libraries, and runs code via the C API (e.g. `luaL_dofile`, `lua_pcall`). There is no `lua` binary in that case; the host decides how scripts are loaded and when they run. Topic 15 (C API and embedding) gives an overview relevant to reading or extending embedding code.

---

## Further reading

- [Lua 5.5 — §7 Lua Standalone](https://www.lua.org/manual/5.5/manual.html#7)
- [Lua 5.5 — §6.4 Modules (package.path, package.cpath)](https://www.lua.org/manual/5.5/manual.html#6.4)
