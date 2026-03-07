# Lua

[← Back to Languages](../README.md)

**Why in DevOps:** **Nginx/OpenResty**, **Redis** (Lua scripts), **HAProxy**, and some other infra components use Lua for config, scripting, or embedded logic. You’ll encounter it when tuning or extending those systems.

**Planned topics:** (add numbered `.md` files and link below)

- Syntax and idioms (enough to read and write small scripts)
- Where Lua is used: Nginx/OpenResty, Redis, HAProxy
- Reading and writing Lua for config and extension
- Embedding and C API (if relevant to DevOps)

---

## Topics

| # | Topic | File |
|---|--------|------|
| _TBD_ | _Add topic files and link here_ | |

---

## Further reading

- [Lua documentation](https://www.lua.org/manual/)
- [OpenResty (Nginx + Lua)](https://openresty.org/en/)
- [Redis Lua scripting](https://redis.io/docs/manual/programmability/eval-intro/)

---

## Basic understanding (from official docs)

The official definition of the Lua language is its **reference manual**, which describes the syntax and semantics of Lua, the standard libraries, and the C API. Lua is a lightweight, embeddable scripting language designed for extending applications. It is widely used in infrastructure and DevOps contexts: **Nginx/OpenResty** use Lua for config and scripting; **Redis** runs Lua scripts for server-side logic; **HAProxy** and other tools support Lua for customization. For a detailed introduction to the practice of Lua programming, the project points to the book *Programming in Lua*. The manual is available for multiple versions (5.5, 5.4, 5.3, etc.) and covers basic concepts (values, types, scopes, metatables, coroutines), the language (lexical conventions, statements, expressions), and the standard libraries.

