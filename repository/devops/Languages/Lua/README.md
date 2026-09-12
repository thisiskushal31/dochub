# Lua

[← Back to Languages](../README.md)

This section is a **deep dive** into Lua: factually correct, standalone, and written so you can go from **very basic to advanced to implementation**. It answers four things: **What is Lua?** **Why is it used?** **How can I use it?** **What are the use cases?** The section is organized in three layers: **Basic** (what Lua is, environment and setup, values and types, variables and scopes, lexical conventions and chunks, statements, expressions, functions); **Advanced** (error handling, metatables and metamethods, garbage collection and weak tables, coroutines, standard libraries, modules); **Implementation** (C API and embedding, use cases and perspectives). Each topic is self-contained and in-depth. For more depth on any topic, use the links in the Further reading section at the end of each file.

Lua is a small, embeddable scripting language. This section uses **16 topic files** so that the language, standard libraries, embedding, and use cases are each covered in their own place.

**Where you use it:** Lua is used for scripting and configuration in applications, games, and tools; for embedding in C/C++ (Nginx/OpenResty, Redis, HAProxy, game engines); and for security-sensitive contexts (sandboxing, safe subsets). The use-cases topic (16) covers where Lua appears and what to focus on by role.

---

## How to read this section

Read in **number order** for a single path: **basics first**, then **language core**, then **advanced and libraries**, then **embedding and use cases**.

- **Overview and setup:** What Lua is, why use it, environment and setup, standalone and embedding.
- **Language core:** Values and types, variables and scopes, lexical conventions and chunks, statements, expressions, functions.
- **Advanced:** Error handling, metatables and metamethods, garbage collection and weak tables, coroutines.
- **Libraries and embedding:** Standard libraries, modules, C API overview, Lua standalone.
- **Use cases:** Where Lua is used—infra, applications, games, tools—and what to focus on by role.

---

## Topic index

| # | Topic | File |
|---|--------|------|
| 1 | What is Lua? | [1_What_Is_Lua.md](./1_What_Is_Lua.md) |
| 2 | Environment and setup | [2_Environment_And_Setup.md](./2_Environment_And_Setup.md) |
| 3 | Values and types | [3_Values_And_Types.md](./3_Values_And_Types.md) |
| 4 | Variables, scopes, and environments | [4_Variables_Scopes_And_Environments.md](./4_Variables_Scopes_And_Environments.md) |
| 5 | Lexical conventions, blocks, and chunks | [5_Lexical_Conventions_Blocks_And_Chunks.md](./5_Lexical_Conventions_Blocks_And_Chunks.md) |
| 6 | Statements | [6_Statements.md](./6_Statements.md) |
| 7 | Expressions and operators | [7_Expressions_And_Operators.md](./7_Expressions_And_Operators.md) |
| 8 | Functions, calls, and definitions | [8_Functions_Calls_And_Definitions.md](./8_Functions_Calls_And_Definitions.md) |
| 9 | Error handling | [9_Error_Handling.md](./9_Error_Handling.md) |
| 10 | Metatables and metamethods | [10_Metatables_And_Metamethods.md](./10_Metatables_And_Metamethods.md) |
| 11 | Garbage collection and weak tables | [11_Garbage_Collection_And_Weak_Tables.md](./11_Garbage_Collection_And_Weak_Tables.md) |
| 12 | Coroutines | [12_Coroutines.md](./12_Coroutines.md) |
| 13 | Standard libraries | [13_Standard_Libraries.md](./13_Standard_Libraries.md) |
| 14 | Modules | [14_Modules.md](./14_Modules.md) |
| 15 | C API and embedding | [15_C_API_And_Embedding.md](./15_C_API_And_Embedding.md) |
| 16 | Use cases and engineering perspectives | [16_Use_Cases_And_DevOps.md](./16_Use_Cases_And_DevOps.md) |

---

## Learning path

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Overview and setup** | 1 → 2 | Understand what Lua is, why it is used, run the standalone interpreter, set LUA_PATH / LUA_INIT. |
| **Language core** | 3 → 8 | Use values and types, variables and scopes, write blocks and chunks, statements, expressions, and functions. |
| **Advanced** | 9 → 12 | Handle errors, use metatables and metamethods, understand GC and weak tables, use coroutines. |
| **Libraries and embedding** | 13 → 15 | Use string, table, io, os, utf8, package, debug; write and load modules; understand C API context. |
| **Use cases** | 16 | Where Lua is used (infra, apps, games, tools) and what to focus on by role. |

---

## Further reading

- [Lua 5.5 Reference Manual](https://www.lua.org/manual/5.5/)
- [Lua reference manuals (all versions)](https://www.lua.org/manual/)
- [Programming in Lua (book)](https://www.lua.org/pil/)
- [Lua uses (applications)](https://www.lua.org/uses.html) · [LuaRocks](https://luarocks.org/)
- [OpenResty (Nginx + Lua)](https://openresty.org/en/)
- [Redis Lua scripting](https://redis.io/docs/manual/programmability/eval-intro/)
