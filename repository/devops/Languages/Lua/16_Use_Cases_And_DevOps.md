# Use cases and engineering perspectives

[← Back to Lua](./README.md)

Lua is used across **application development**, **systems and embedded**, **game and tooling**, **security**, and **DevOps**. This topic describes where Lua appears and what to focus on from each engineering perspective. The **implementation** side—how hosts embed Lua and how the C API is used—is covered in topic 15 (C API and embedding).

## Where Lua appears

Lua is often embedded in host programs that need a small, fast script layer. The host exposes a C API; scripts run in a Lua state with a controlled environment (e.g. custom globals, no or limited I/O). Domains include configuration and data description, request or message handling, in-engine logic (games, tools), and automation. The standalone interpreter is used for scripts, one-off tasks, and testing; **LuaRocks** is the main package manager for standalone Lua.

## Web and reverse proxies

Web servers and reverse proxies frequently use Lua for access control, routing, rewriting, and response generation. Scripts run in phases (e.g. before/after proxy, body filter) and can read and set headers, URI, and body. **OpenResty** (Nginx + Lua/JIT) and API gateways like **Kong** use Lua for dynamic routing, rate limiting, and request transformation. When writing Lua inside Nginx/OpenResty, use only **non-blocking** operations (e.g. cosocket APIs provided by the host); blocking I/O or OS calls block the whole worker and hurt all concurrent requests. Globals in Lua modules are shared per worker, so avoid request-specific state in globals. Understanding chunks, environments, coroutines, and the host’s lifecycle (when scripts are loaded and when they run) is important for correct and efficient logic. Path and module resolution (package.path, LUA_PATH) affect how scripts and shared code are loaded.

## Caches and data stores

Some caches and data stores allow Lua scripts to run atomically on the server. Scripts receive keys and arguments and return results; they can perform multiple operations in one go and avoid round-trips. You need to know the host’s API (how arguments and return values are passed), execution limits (time, memory), and which standard libraries or globals are available. Error handling (pcall, error objects) and the fact that scripts are often cached by name matter for robustness and debugging.

## Load balancers

Load balancers may use Lua to decide where to send traffic, to modify requests or responses, or to implement custom health checks. Scripts often run in a constrained environment (e.g. no or limited I/O). Knowledge of tables, string patterns, and the host’s callback shape (e.g. sample fetches, actions) helps when reading or writing such logic.

## Configuration and glue

Lua’s table syntax and minimal boilerplate make it a common choice for configuration files and for glue scripts that orchestrate other tools. In these cases you usually run the standalone interpreter or a small host. **LuaRocks** installs and manages third-party modules (“rocks”). Environment and startup (LUA_INIT, LUA_PATH, -E) and module layout (require, package.path) determine how config and libraries are found.

## Other embedders

Beyond web and infra, Lua is used in game engines, network and media tools (e.g. Wireshark dissectors), editors, and other applications. The same language and C API apply; the host defines the environment and available libraries.

## Engineering perspectives: what to focus on

The following is a **whole-engineering** view: whatever your role, pick the line that fits and lean on the topics listed.

- **Application and product development:** Scripting and extending products, plugins, configuration, and user-defined behavior. Focus on the language (values, variables, statements, expressions, functions), modules and require, and how the host exposes APIs (topic 15). Use the standard libraries (topic 13) for string, table, and I/O when the host allows them.
- **Systems and embedded engineering:** Embedding Lua in C/C++ programs, custom DSLs, resource-constrained or real-time environments. Focus on the C API (topic 15): stack, registry, loading and running chunks, registering C functions, error handling and yields (lua_pcallk, continuations). Understand footprint, allocation, and which standard libraries the host opens (luaL_openselectedlibs).
- **Game development and tooling:** In-engine scripting, modding, automation, protocol or data handling. Focus on the language core (topics 3–8), coroutines (topic 12) for cooperative flow, and string/table (topic 13). Be aware of host lifecycle (when scripts load, when they run) and which globals or libraries the host provides.
- **Security and hardening:** Sandboxed script execution, safe subsets, and validation of untrusted input. Focus on environments and _ENV (topic 4), load/require and binary chunks (topics 5, 14), and what is excluded in embedded builds (e.g. debug, os). Understand that binary chunks can be unsafe; restrict or validate script source and use custom environments (topic 15) to limit what scripts can access.
- **DevOps and infrastructure:** Nginx/OpenResty, Redis, HAProxy, deployment, and operations. Focus on how the product loads Lua (paths, LUA_PATH/LUA_CPATH), which phases or hooks run scripts, and how errors and timeouts are reported. Use the language topics to read and tweak existing scripts; for non-blocking hosts (e.g. OpenResty), avoid blocking I/O and request-specific state in globals (see “Web and reverse proxies” above).

---

## Further reading

- [Lua 5.5 — §7 Lua Standalone](https://www.lua.org/manual/5.5/manual.html#7)
- [OpenResty](https://openresty.org/en/)
- [Redis Lua scripting](https://redis.io/docs/manual/programmability/eval-intro/)
- [Lua uses (applications)](https://www.lua.org/uses.html) · [LuaRocks](https://luarocks.org/)
