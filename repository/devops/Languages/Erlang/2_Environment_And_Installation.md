# Environment and installation

[← Back to Erlang](./README.md)

To run Erlang you need the **Erlang/OTP** distribution: the VM (BEAM), the standard library (STDLIB, Kernel), and OTP applications. On most systems you install a single package (e.g. `erlang` on Debian/Ubuntu, `erlang` via Homebrew on macOS, or the official installer on Windows). Prefer version 24 or later; check your project or tooling for specific requirements.

**Why the shell matters.** The Erlang shell is where you run code interactively: you type expressions, compile modules, and see results immediately. It is the main way to learn the language and to inspect or debug running systems. Understanding how to start it, how to end expressions, and how to compile and run modules is the first step to using Erlang.

**Starting the shell.** In a terminal, run `erl`. You get a banner and a prompt like `1>`. The shell is a command interpreter: you enter Erlang code and press Enter. You must tell the shell you are done with an expression by ending it with a **full stop** (`.`) and then pressing Enter. Without the full stop, the shell keeps waiting for more input.

```erlang
$ erl
Erlang/OTP 26 [erts-14.0] [source] [64-bit] [smp:8:8] [ds:8:8:10] [async-threads:1]

Eshell v14.0 (press Ctrl+C, then 'a' to abort)
1> 2 + 5.
7
2> (42 + 77) * 66 / 3.
2618.0
```

**Stopping the system.** Press Control-C. The shell shows a menu: type `a` (abort) to leave the Erlang system. Alternatively, call `halt().` in the shell to shut down the runtime. Both are normal ways to exit.

**Compiling and running a module.** Erlang code lives in **modules**. A module is stored in a file named `<module_name>.erl`; the filename must match the module name. The first line of the file must be `-module(name).` The second line typically lists which functions are visible from outside the module: `-export([function_name/arity, ...]).` The **arity** is the number of arguments. In the shell you compile with `c(Module)`—for example `c(tut)`. The compiler produces a `.beam` file. If you see `{ok,tut}`, compilation succeeded. If you see `error`, there is a mistake in the code; the compiler message helps you fix it. To call a function in another module, use the syntax `module_name:function_name(arguments).`

```erlang
%% File: tut.erl
-module(tut).
-export([double/1]).

double(X) ->
    2 * X.
```

In the shell after saving the file in the current directory:

```erlang
3> c(tut).
{ok,tut}
4> tut:double(10).
20
```

**Why the file name and directory matter.** The compiler looks for `tut.erl` in the current directory (the one from which you started `erl`). If the file is elsewhere, compilation fails unless you change the working directory or add code paths. For real projects you use a build tool (e.g. Rebar3) to manage paths and compile many modules.

**Source file encoding.** Erlang source files use UTF-8 by default. You can set encoding with a comment in one of the first two lines that matches `coding\s*[:=]\s*...`; valid values are `Latin-1` and `UTF-8`. This matters for correct handling of non-ASCII characters in atoms, strings, and comments.

**Why this matters for DevOps.** You use the same VM and shell to run one-off commands, attach to a running node (remote shell), and debug. Releases built with Rebar3 or similar bundle the VM and your beams so you can deploy a single artifact without installing Erlang on the target.

---

## Further reading

- [Getting Started With Erlang](https://www.erlang.org/doc/system/getting_started)
- [Sequential Programming](https://www.erlang.org/doc/system/seq_prog) (shell, modules, compiling)
- [Character Set and Source File Encoding](https://www.erlang.org/doc/system/character_set)
- [Rebar3](https://rebar3.org/)
