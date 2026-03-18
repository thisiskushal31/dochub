# What is Lua?

[← Back to Lua](./README.md)

Lua is a lightweight, embeddable scripting language. It is powerful and efficient: it supports procedural, object-oriented, functional, and data-driven programming, and it is used for configuration, scripting, rapid prototyping, and in-engine logic across applications, infrastructure, games, and tools. Understanding Lua helps whether you embed it in a product, extend Nginx/OpenResty or Redis, write game or tool scripts, or harden and sandbox script execution.

## What is Lua?

Lua is dynamically typed: variables do not have types; only values do. There are no type declarations. The language combines simple procedural syntax with rich data description based on associative arrays (tables) and extensible semantics. Lua runs by interpreting bytecode with a register-based virtual machine and uses automatic memory management with a generational garbage collector.

Lua is implemented as a C library (the common subset of standard C and C++). The distribution includes a host program, the standalone interpreter `lua`, which uses that library to run Lua interactively or in batch. Lua is intended both as an embeddable scripting language for host programs and as a standalone language.

As an extension language, Lua has no built-in notion of a "main" program: it runs inside a host. The host can run Lua code, read and write Lua variables, and register C functions that Lua can call. Through C functions, Lua can be extended for many domains, forming custom languages that share Lua’s syntax and runtime.

## Implementation (high level)

Lua source is compiled to **bytecode** for a **register-based virtual machine**. The VM interprets these instructions; there is no JIT in standard Lua. You can precompile chunks with **luac** or **string.dump** and load the resulting binary (the interpreter detects the format). The runtime is a **C library**: the host creates a Lua state, loads and runs chunks via the C API, and can register C functions as Lua callables. Understanding this helps when you read embedding code or when you care about load/run separation (e.g. sandboxing or caching compiled scripts). Topic 15 (C API and embedding) goes deeper.

## Why is it used?

Lua is used wherever a small, fast, embeddable script layer is needed: configuration and data description, routing or filtering logic, server-side and in-process scripts, game and application scripting, and tool automation. Its small footprint and C API make it easy to embed in C/C++ hosts; its tables and first-class functions make it flexible for both data and behavior. It appears in infrastructure (web servers, caches, load balancers), in applications and plugins, in game engines and tools (e.g. Wireshark dissectors), and in standalone scripts and CLI tools.

## How can I use it?

You can run Lua in two main ways: as a standalone script or embedded in a host application. A minimal standalone example:

```lua
print("Hello, world!")
```

Save as `hello.lua` and run with `lua hello.lua`. In interactive mode, run `lua -i` (or just `lua` when stdin is a terminal with no script). The rest of this section covers environment and setup; later topics cover the language and standard libraries.

## What are the use cases?

Use cases span the whole engineering spectrum: **application and product**—configuration and behavior scripts, plugins, extension APIs; **systems and embedded**—scripting inside C/C++ programs, custom DSLs, resource-constrained environments; **game and tooling**—in-engine logic, modding, protocol dissectors, automation; **security**—sandboxed script execution, validation, and safe subsets; **DevOps and infrastructure**—Nginx/OpenResty, Redis, HAProxy, deployment and tuning. Whatever your domain, a solid grasp of the language and its embedding model (topics 2, 14, 15, 16) helps you read, write, and integrate Lua safely.

---

## Further reading

- [Lua 5.5 Reference Manual](https://www.lua.org/manual/5.5/)
- [Lua reference manuals](https://www.lua.org/manual/)
- [Programming in Lua](https://www.lua.org/pil/)
