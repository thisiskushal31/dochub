# Modules and functions

[← Back to Erlang](./README.md)

All Erlang code lives in **modules**. A module is a single file `<name>.erl` whose first line must be `-module(name).`—the name must match the filename. The module contains **attributes** (such as `-export`, `-import`, `-behaviour`) and **functions**. Functions are defined with one or more clauses; each clause has a head (function name, arity, patterns, optional guards) and a body (expressions separated by commas, ending with a period). Understanding modules and functions is essential because you cannot run real programs without them; the shell is for experimentation, but production code is always in modules.

**Why modules.** Modules are the unit of compilation and code loading. The VM loads code per module; when you compile `tut.erl` you get `tut.beam`. Modules also define the **namespace**: function names are unique within a module, and you call another module's functions with `module_name:function_name(Args)`. That avoids global name clashes and keeps APIs explicit.

**Export.** Only functions listed in `-export([name/arity, ...]).` can be called from other modules. The **arity** is the number of arguments; `fac/1` and `fac/2` are different functions. You must add every public function to the export list. If you add a new function and forget to export it, callers get an undefined function error. Keeping the export list small makes the public API clear and hides helpers.

**Import.** You can write `-import(Module, [name/arity, ...]).` and then call those functions without the module prefix. Many style guides avoid import: explicit `Module:function(Args)` makes call sites clear and prevents name clashes when two modules export the same name.

**Calling functions.** From another module use `module_name:function_name(Args).` From inside the same module you can write just `function_name(Args).` The form `Module:Function(Args)` is always valid and supports **dynamic dispatch** when `Module` or `Function` is a variable—used in behaviours where the callback module is passed at runtime.

**Local (private) functions.** Functions not in `-export` are private to the module. They are used for helpers and internal recursion (e.g. a tail-recursive helper that carries an accumulator). The compiler does not require them in the export list. Only the exported functions form the module's API.

**Multiple clauses and arity.** A function can have several clauses (same name and arity, different patterns or guards). The VM tries them in order; the first matching clause runs. Functions with different arity are distinct: `list_max/1` and `list_max/2` are two different functions. You refer to them as Name/Arity (e.g. `list_max/1`).

```erlang
-module(tut1).
-export([fac/1, mult/2]).

fac(1) ->
    1;
fac(N) when N > 0 ->
    N * fac(N - 1).

mult(X, Y) ->
    X * Y.
```

**Module attributes.** Common attributes: `-module(name).`, `-export([...]).`, `-import(Module, [...]).`, `-compile(Option).` User-defined attributes (e.g. `-version("1.0").`) can be read at compile time. The attribute `-behaviour(Behaviour).` (or `-behavior`) declares that the module implements an OTP behaviour (e.g. `gen_server`); the compiler then checks that the required callbacks are present and warns if any are missing. That keeps callback modules consistent with the behaviour.

**Why this matters.** Modules are the unit of code loading and naming; exports define the public API. OTP behaviours (gen_server, supervisor, application) are implemented as callback modules that export a fixed set of functions; the generic part calls into your module by name. Getting modules and exports right is the basis for both application code and OTP.

---

## Further reading

- [Modules](https://www.erlang.org/doc/system/modules)
- [Functions](https://www.erlang.org/doc/system/functions)
- [Sequential Programming](https://www.erlang.org/doc/system/seq_prog) (modules and functions)
