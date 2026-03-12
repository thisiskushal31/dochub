# Standard library modules reference

[← Back to Elixir](./README.md)

**Where this topic fits:** After the basics (1–4), core language (5–11), recursion and data (12–15), concurrency and I/O (16–18), build and OTP (19–20), and the use-case and security topics (21–22), this topic is a **reference** for the Elixir standard library. Use it when you need to look up what a module does and when to use it; it does not teach the language.

The standard library is the set of modules shipped with Elixir. Kernel is auto-imported; all other modules you call with the module name (e.g. `String.length/1`, `Enum.map/2`). The sections below group modules by role and describe what each does and when to use it. Links to external APIs are only in the Further reading section at the end.

**How this reference is organized:** Kernel and special forms → Data types → Collections and enumerables → IO and system → Calendar → Processes and applications → Protocols → Code and macros → Exceptions and deprecated → Use cases → Security and DevOps → Further reading.

---

## Kernel and special forms

**Kernel** provides the default environment: type-checking guards (`is_list/1`, `is_atom/1`), control-flow macros (`if`, `case`, `cond`, `unless`), arithmetic and comparison operators, process primitives (`spawn/1`, `send/2`, `self/0`), and basic type handling. Because it is auto-imported, you rarely write `Kernel.` in front of these. Use `import Kernel, except: [if: 2]` only when you want to override or exclude something.

**Kernel.SpecialForms** are language constructs that are always in scope and cannot be overridden: `defmodule`, `def`, `defp`, `defmacro`, `receive`, `import`, `alias`, `require`, `use`, `quote`, `unquote`, `super`, `__MODULE__`, `__STACKTRACE__`, and a few others. They are the building blocks of the language; you use them when defining modules, functions, and when doing metaprogramming.

---

## Data types

Modules that work with built-in and common types.

| Module | What it is and when to use it |
|--------|--------------------------------|
| **Atom** | Constants whose value is their name (`:ok`, `:error`). Use for status, options, and tags. `to_string/1` and `to_charlist/1` convert to string or charlist. Do not create atoms from arbitrary user input (atom table is not GC'd). |
| **Base** | Encode and decode binaries: base16, base32, base64 (standard and URL-safe). Use when you need to represent binary data as text (e.g. tokens, config) or decode such strings back to binary. |
| **Bitwise** | Bitwise operations: `band`, `bor`, `bxor`, `bnot`, `bsl`, `bsr`. Use `use Bitwise` to bring them into scope. Use for flags, masks, and low-level binary handling. |
| **Date** | Date struct (year, month, day) and calendar functions. Create with `Date.new/3` or sigil `~D[2000-01-01]`. Use for date arithmetic (`add/2`, `diff/2`), ranges (`Date.range/2`), and conversions (`to_iso8601/1`, `from_erl/1`). |
| **DateTime** | Date and time with time zone. Use when you need a point in time in a specific time zone; for "wall clock" without zone use NaiveDateTime. |
| **Duration** | Time duration (days, hours, etc.) for adding to dates or datetimes. Use with `Date.shift/2` or `DateTime.add/2` for calendar-aware arithmetic. |
| **Exception** | Behaviour for custom exceptions and functions to format or normalize errors and stacktraces. Use `defexception/1` for your own exception; use `Exception.format/3`, `message/1`, `normalize/3` when handling or logging errors. |
| **Float** | Float parsing (`parse/1`), rounding, comparison, and conversion. Use when you need floating-point math or parsing decimal strings. |
| **Function** | Identity (`identity/1`) and composition (`compose/2`, `pipe/2`). Use when building or composing functions dynamically. |
| **Integer** | Integer utilities: `digits/2`, `undigits/2`, `gcd/2`, `mod/2`, `floor_div/2`, `parse/2`, `pow/2`, `to_string/2`, `to_charlist/2`. Use for base conversion, number theory, or parsing. Guards: `is_even/1`, `is_odd/1`. |
| **JSON** | Encode and decode JSON. Use at boundaries (APIs, config files). Handles strings, numbers, lists, maps, and structs that implement the JSON protocol. |
| **Module** | Runtime info about modules: `loaded?/1`, `get_attribute/3`, `concat/1`, `safe_concat/1`, `make_overridable/2`. Use when introspecting or building modules at runtime. |
| **NaiveDateTime** | Date and time without time zone. Use for "local" wall clock when time zone is irrelevant; for UTC or other zones use DateTime. |
| **Record** | Work with Erlang records from Elixir (extract, update). Use when interfacing with Erlang code that uses records. |
| **Regex** | Regular expressions (PCRE). Create with sigil `~r/foo/` or `Regex.compile/2`. Use `run/3`, `scan/3`, `replace/4`, `split/3`, `match?/2` for matching and substitution. Options: case-insensitive, Unicode, multiline. |
| **String** | UTF-8 strings. Use for grapheme/codepoint handling, `split/3`, `replace/3`, `match?/2`, `length/1`, `slice/3`, padding, trimming, and case conversion. Strings are binaries; use `byte_size/1` for bytes and `String.length/1` for graphemes. |
| **Time** | Time-of-day struct (hour, minute, second). Use with sigil `~T[12:00:00]` or `Time.new/3` when you only need time, not date. |
| **Tuple** | Tuple operations: `append/2`, `delete_at/2`, `duplicate/2`, `insert_at/3`, `to_list/1`. Use when you need to build or modify tuples programmatically; for fixed-size data you often use tuple literals. |
| **URI** | Parse and encode URIs. Use for URLs (scheme, host, path, query) in HTTP clients, redirects, or config. |
| **Version** | Parse and compare version strings. Use for dependency resolution or compatibility checks. |
| **Version.Requirement** | Version requirement syntax (e.g. `~> 1.0`). Use when parsing or building requirement strings for dependencies. |

---

## Collections and enumerables

Types that implement the Enumerable protocol can be used with Enum and Stream. Lists, maps, ranges, MapSet, and File.Stream are enumerables.

| Module | What it is and when to use it |
|--------|--------------------------------|
| **Access** | Behaviour for key-based access (`map[key]`, `struct[key]`). Implement it for your struct if you want bracket access; get default with `get/3`. |
| **Date.Range** | Range of dates (e.g. from `Date.range/2`). Enumerable; use with Enum when iterating over a span of days. |
| **Enum** | Eager operations on enumerables: map, reduce, filter, find, take, drop, concat, sort, uniq, join, chunk, zip. Use for one-pass or multi-pass over lists, maps, ranges. Linear time; for infinite or very large data use Stream. |
| **Keyword** | Keyword list operations: get, put, delete, merge, has_key?, keys, values. Use for options, config, and small key-value data where order and duplicate keys matter. |
| **List** | List-specific operations: flatten, foldr, keyfind, keymember?, replace, wrap, first, last. Use when you need list structure (head/tail, keys in a list of tuples) rather than generic Enum. |
| **Map** | Map operations: get, put, merge, delete, keys, values, split, take. Use for key-value data with unique keys and fast access. |
| **MapSet** | Unordered set of unique elements. Use for membership, union, intersection, difference when you do not need order or duplicate keys. |
| **Range** | Integer range (`1..10`, `1..10//2`). Enumerable; use for numeric ranges and as slice spec for strings and lists. |
| **Stream** | Lazy enumerables: map, filter, take, cycle, zip, etc. Use for large or infinite data, or when composing many steps without building intermediate lists. |

---

## IO and system

File system, paths, standard I/O, and process environment.

| Module | What it is and when to use it |
|--------|--------------------------------|
| **File** | Read, write, open, copy, rename, remove, mkdir, rmdir, and metadata. Functions return `{:ok, result}` or `{:error, reason}`; bang versions raise on error. Use for script and app file handling. |
| **File.Stat** | Struct holding file metadata (size, type, mtime, etc.) from `File.stat/1`. |
| **File.Stream** | Stream a file by line or bytes. Use with Enum or Stream when you do not want to load the whole file. |
| **IO** | Standard I/O: puts, gets, read, write, binread, binwrite, inspect. Use for console and file I/O; default device is configurable. |
| **IO.ANSI** | ANSI escape sequences for color and cursor control. Use for colored or formatted terminal output. |
| **IO.Stream** | Stream-based IO device. Use when you need to treat an IO stream as an enumerable or collectable. |
| **OptionParser** | Parse command-line argv into a keyword list. Use strict or switches, types (:boolean, :string, :integer, :count), and aliases. Use for CLI tools and scripts. |
| **Path** | Join, expand, basename, dirname, extname, split, wildcard, and safe_relative (directory-traversal safe). Use for building and resolving paths; most functions do not touch the file system. |
| **Port** | Ports for communicating with the OS and external programs. Use when you need to run external processes or drivers. |
| **StringIO** | In-memory IO device. Use when you need something that behaves like IO but reads/writes to a string (e.g. testing or capturing output). |
| **System** | System environment: cwd, env, argv, halt, find_executable, cmd, and build info. Use for environment and process control in scripts and releases. |

---

## Calendar

Calendar behaviour and time-zone databases for Date, Time, DateTime, and NaiveDateTime.

| Module | What it is and when to use it |
|--------|--------------------------------|
| **Calendar** | Behaviour that calendar implementations must provide (date, time, datetime, day of week, etc.). Use when implementing a custom calendar. |
| **Calendar.ISO** | ISO calendar used by default for Date and DateTime. |
| **Calendar.TimeZoneDatabase** | Behaviour for time zone databases. Use when you need custom or updated time zone data. |
| **Calendar.UTCOnlyTimeZoneDatabase** | Time zone database that only knows UTC. Use when you do not need other zones. |

---

## Processes and applications

OTP processes, application lifecycle, and configuration.

| Module | What it is and when to use it |
|--------|--------------------------------|
| **Agent** | Process that holds a single value; get, update, get_and_update, cast. Use for simple shared state (cache, counter). For request-reply and more structure use GenServer. |
| **Application** | Start and stop OTP applications; get and set application env. Use in release and Mix to start the supervision tree and to read config. |
| **Config** | Keyword-based config in `config/*.exs`: `config/2`, `config/3`, `config_env/0`, `import_config/1`. Use for compile-time and per-environment config; for runtime use config/releases.exs or Config.Reader. |
| **Config.Provider** | Behaviour for runtime config providers (e.g. reading from env or a file at boot). Use in releases to inject config before the app starts. |
| **Config.Reader** | Read and evaluate config files. Use when you need to load config outside the normal Mix/release flow. |
| **DynamicSupervisor** | Supervisor with no static children; start children on demand with start_child/2. Use for one process per connection, per job, or when the number of children is unknown at boot. |
| **GenServer** | Generic server behaviour: init, handle_call (sync), handle_cast (async), handle_info (other messages). Use for servers that hold state and respond to requests; the standard choice for registries, caches, and services. |
| **Node** | Distributed Erlang: list nodes, connect, ping, cookie, spawn on another node, start/stop distribution. Use when building distributed or clustered systems. |
| **PartitionSupervisor** | Partitions children across multiple supervisor processes. Use to scale DynamicSupervisor or other supervisors. |
| **Process** | Process operations: alive?, link, unlink, monitor, demonitor, register, send, spawn, exit. Use when you need low-level process control or to build custom behaviours. |
| **Registry** | Key-value process registry (unique or duplicate keys). Use to find a process by name or key; often used with DynamicSupervisor for "one process per key". |
| **Supervisor** | Supervision behaviour: child_spec, restart strategies (one_for_one, rest_for_one, one_for_all). Use as the top of your process tree and to group workers. |
| **Task** | One-off async work: async/await, start_link, yield. Use for parallel one-shot work (e.g. parallel HTTP requests). |
| **Task.Supervisor** | Supervisor for tasks. Use when you want to limit or supervise short-lived tasks. |

---

## Protocols

Protocols define one interface implemented by many types. You implement a protocol for your type; the same function name then works across types.

| Module | What it is and when to use it |
|--------|--------------------------------|
| **Collectable** | Protocol for collecting into a structure (e.g. Enum.into). Implement for your collection type so it can be used as the target of into. |
| **Enumerable** | Protocol that Enum and Stream use: reduce, count, member?, slice. Implement for your collection so Enum and Stream work on it. |
| **Inspect** | Protocol for turning a value into an algebra document (iex, Logger). Implement or derive for your struct to control how it is printed. |
| **Inspect.Algebra** | Functions to build and combine algebra documents (concat, nest, line, etc.). Use when implementing Inspect or custom formatting. |
| **Inspect.Opts** | Options passed to inspect (limit, pretty, structs, etc.). Use when calling inspect programmatically or in custom Inspect implementations. |
| **JSON.Encoder** | Protocol for encoding Elixir values to JSON. Implement for your struct if you want it to encode in a specific way. |
| **List.Chars** | Protocol for converting to charlist. Used when you need a charlist representation (e.g. for Erlang). |
| **Protocol** | Functions to define and implement protocols (defprotocol, defimpl). Use when defining a new protocol. |
| **String.Chars** | Protocol for converting to string. Implement to_string/1; it is used by string interpolation and Kernel.to_string/1. |

---

## Code and macros

Compilation, evaluation, and macro/AST utilities.

| Module | What it is and when to use it |
|--------|--------------------------------|
| **Code** | Compile and eval code (compile_string, eval_string, require_file), fetch docs, and check types. Use for tooling, scripting, or dynamic code load. |
| **Code.Fragment** | Parse code fragments (e.g. for completion or refactor). Use when you need to parse incomplete code. |
| **Kernel.ParallelCompiler** | Compile multiple files in parallel. Use when building a compiler or tool that compiles many modules. |
| **Macro** | AST helpers: escape, unescape, expand, expand_once, quoted?, traverse. Use in macros and when analyzing or generating code. |
| **Macro.Env** | Struct holding macro environment (module, function, file, line, vars, etc.). Use in macros to get context. |

---

## Exceptions

Common exceptions: ArgumentError, ArithmeticError, BadArityError, BadBooleanError, BadFunctionError, BadMapError, CaseClauseError, CondClauseError, FunctionClauseError, KeyError, MatchError, RuntimeError, and module-specific ones (e.g. File.Error, OptionParser.ParseError, Protocol.UndefinedError). Each has a struct and message; use them in rescue or when raising. Custom exceptions use `defexception/1` and implement the Exception behaviour.

---

## Deprecated

BadStructError, Behaviour, Dict, GenEvent, HashDict, HashSet, Set, Supervisor.Spec are deprecated. Use the recommended replacements (e.g. Map for Dict, MapSet for HashSet, Supervisor child_spec for Supervisor.Spec) as described in the language docs.

---

## Use cases

**Application and web:** String, Map, List, Enum, Stream for data; Ecto (external) for DB; Plug/Phoenix (external) for HTTP. Config and Application for app config and startup. GenServer, Supervisor, Registry, DynamicSupervisor for services and process structure. Task for parallel work.

**Scripts and CLI:** System (env, argv, cwd), OptionParser (flags and options), File and Path for file handling, IO for output. Enum and Stream for one-off data pipelines.

**Tooling and build:** Mix (external) and Config for project and release config. Code and Macro for analysis or code generation. Version and Version.Requirement for dependency and version checks.

**Data and formats:** String, Integer, Float for parsing; JSON for APIs; Date, DateTime, NaiveDateTime, Time for timestamps. Regex for text extraction and validation.

---

## Security and DevOps

**Configuration and secrets:** Use Config for application config; read secrets from environment (System.get_env) or a secrets manager at runtime, not from source. Application.get_env and config/releases.exs (in releases) are where runtime config is read. Never commit secrets.

**Input and boundaries:** Validate and sanitize at boundaries. Use pattern matching, guards, and types (String, Integer, OptionParser types) to reject bad input. Use Path.safe_relative when accepting path input to avoid directory traversal. Use File and IO with care on paths and permissions.

**Processes and distribution:** Node (cookie, connect, list) and Process (monitor, link) affect who can talk to whom in distributed setups. Secure the cookie and node names in production. Use Supervisor and restarts for resilience; avoid unlinked or unsupervised processes for critical state.

**Supply chain:** Version and Version.Requirement matter for dependency constraints. Lock dependencies and audit them; use mix hex.audit when available. Prefer well-maintained libraries and pin versions in production.

**Logging and errors:** Exception (format, message, normalize) and Logger (external) for errors. Do not log secrets or PII at info level. Use inspect with structs: false when debugging to avoid recursive or sensitive output.

---

## Further reading

- [Elixir API Reference](https://hexdocs.pm/elixir/api-reference.html)
- [Enum cheatsheet](https://hexdocs.pm/elixir/enum-cheat.html)
