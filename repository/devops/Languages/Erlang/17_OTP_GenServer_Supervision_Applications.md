# OTP: gen_server, supervision, applications

[← Back to Erlang](./README.md)

**OTP** (Open Telecom Platform) is the set of libraries and design principles that make Erlang systems reliable and maintainable. The main building blocks are **behaviours** (gen_server, gen_statem, supervisor, etc.), **applications** (packages of code and processes), and **releases** (runnable systems). Together they give you a standard way to structure processes, handle failures, and start the system.

**Supervision trees.** A supervision tree is a hierarchy of **supervisors** and **workers**. Supervisors are processes that start and monitor workers; if a worker terminates, the supervisor can restart it. Workers do the actual computation. That structure makes it possible to design fault-tolerant software: when something goes wrong, the failing process is restarted instead of the whole system.

**Behaviours.** Many processes in a supervision tree follow the same patterns (e.g. a server that holds state and answers requests). Behaviours formalise these patterns: a **behaviour module** (part of OTP) implements the generic part (message loop, timeouts, code change); a **callback module** (your code) implements the specific part by exporting a fixed set of callback functions. The compiler understands `-behaviour(gen_server).` and warns about missing callbacks. Using behaviours keeps code consistent and makes it easier for others to read and maintain.

**gen_server.** The **gen_server** behaviour implements a client–server pattern: one process holds state and handles requests. Clients use `gen_server:call/2` for synchronous requests and `gen_server:cast/2` for asynchronous ones. You implement: `init/1` (initial state), `handle_call/3` (sync: request, sender, state; return `{reply, Reply, NewState}` or similar), `handle_cast/2` (async: request, state; return `{noreply, NewState}`), `handle_info/2` (other messages, e.g. from `!`). The generic part hides the protocol and the receive loop; you only write the callbacks. The server can be registered (e.g. `{local, Name}`) so clients call it by name.

```erlang
-module(ch3).
-behaviour(gen_server).
-export([start_link/0, alloc/0, free/1]).
-export([init/1, handle_call/3, handle_cast/2]).

start_link() ->
    gen_server:start_link({local, ch3}, ch3, [], []).

alloc() -> gen_server:call(ch3, alloc).
free(Ch) -> gen_server:cast(ch3, {free, Ch}).

init(_Args) -> {ok, channels()}.
handle_call(alloc, _From, Chs) ->
    {Ch, Chs2} = alloc(Chs),
    {reply, Ch, Chs2}.
handle_cast({free, Ch}, Chs) ->
    Chs2 = free(Ch, Chs),
    {noreply, Chs2}.
```

**Supervisor.** A **supervisor** is a process that starts child processes according to a list of **child specifications** and monitors them. When a child terminates, the supervisor restarts it according to a **restart strategy** (one_for_one, rest_for_one, one_for_all) and **restart intensity** (how many restarts in a time window before the supervisor gives up). You implement `init/1` and return the child spec list and supervisor flags.

**Application.** An **application** is a component with a name, a list of dependent applications, and a **start** entry point (usually starting the root supervisor). The minimal Erlang/OTP system consists of the Kernel and STDLIB applications. An application can be a library (no processes) or a supervision tree. Releases are built from a set of applications; the release specifies which applications are included and in what order they are started.

**Releases and release handling.** A **release** is a complete system: a subset of Erlang/OTP applications plus your applications, plus boot scripts and config. Release handling is upgrading or downgrading between release versions in a (possibly) running system. How to create and install a release is described in System Principles; how to do release handling is in the Release Handling chapter.

**Why this matters.** OTP is how you build production systems: gen_server for stateful services, supervisors for resilience, applications for structure and releases. Understanding these three is enough to read and extend most Erlang and Elixir codebases.

---

## Further reading

- [OTP Design Principles](https://www.erlang.org/doc/system/design_principles)
- [gen_server Behaviour](https://www.erlang.org/doc/system/gen_server_concepts)
- [Supervisor Behaviour](https://www.erlang.org/doc/system/sup_princ)
- [Applications](https://www.erlang.org/doc/system/applications)
- [Releases](https://www.erlang.org/doc/system/release_structure)
- [Release Handling](https://www.erlang.org/doc/system/release_handling)
- [Creating and Upgrading a Target System](https://www.erlang.org/doc/system/create_target)
