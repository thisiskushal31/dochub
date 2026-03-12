# What is Elixir?

[← Back to Elixir](./README.md)

**Elixir** is a **dynamic, functional** programming language that runs on the **BEAM** (the Erlang virtual machine). It was designed for building **scalable** and **maintainable** applications, with a focus on **concurrency**, **fault tolerance**, and **low latency**. The syntax is clear and consistent, and the language comes with a rich standard library and a build tool (Mix) and package manager (Hex) built in. Because Elixir runs on the BEAM, it reuses Erlang’s decades of work on **distributed**, **soft real-time** systems, which is why it shows up in web backends, real-time apps, embedded/IoT, and DevOps tooling.

---

## The BEAM and why it matters

The **BEAM** (Bogdan/Björn's Erlang Abstract Machine) is the virtual machine that executes both Erlang and Elixir bytecode. It is built for **concurrency** and **reliability**: it runs many lightweight **processes** (often hundreds of thousands) with preemptive scheduling, no shared mutable state, and message passing. When a process crashes, it does not bring down the whole system; **supervisors** can restart it. The BEAM also has built-in support for **distribution**: processes can live on different nodes and communicate the same way. That is why Elixir is a natural fit for backends that need many concurrent connections (e.g. WebSockets, APIs), for systems that must tolerate failures (e.g. "let it crash" and restart), and for distributed or embedded deployments. If you come from a language with threads and shared memory, the shift to "processes and messages" is fundamental: there are no locks; isolation and copying (or reference counting for large data) replace shared state.

---

## Immutability and functional style

In Elixir, **data is immutable**. When you "update" a list or a map, you get a **new** value; the original is unchanged. That has practical consequences: you can pass data to other functions (or other processes) without fear of it being mutated; reasoning about code is easier because values do not change behind your back; and the runtime can reuse structure when building new values (e.g. a new list can share the tail of an old one). There are no classes or objects with mutable fields; you organize code in **modules** (namespaces of functions) and **functions** that take inputs and return outputs. Side effects (I/O, sending messages) are explicit and usually happen at the edges of your logic. For application developers this means writing a lot of small, pure-ish functions and combining them; for DevOps and security it means predictable behaviour and no hidden shared state.

---

## Why Elixir appears in this handbook

Elixir is relevant across engineering roles:

- **Application development:** Phoenix (the main Elixir web framework) is used for APIs and real-time features (channels, LiveView). Understanding Elixir helps you read, modify, and deploy these apps. The same language and runtime are used in non-web services (job queues, pipelines, internal tools).
- **DevOps and SRE:** You may build or operate Elixir services, run Mix and releases, and integrate with CI/CD. Knowing the language and runtime makes configuration, debugging, and capacity planning easier. Releases are self-contained (no Elixir install on the server); understanding the BEAM and OTP helps when tuning and when things go wrong.
- **Security:** Elixir apps handle secrets, configuration, and network I/O. Secure coding, dependency hygiene (Hex), and release hardening matter for security reviews and compliance. Immutability and process isolation also reduce whole classes of bugs (e.g. data races).
- **Embedded and IoT:** Nerves uses Elixir on the BEAM to build and deploy firmware. Ops and security teams need a basic grasp of the stack to support and harden devices (OTA, secure boot, config).
- **General engineering:** Concurrency via processes, supervision trees, and pattern matching are transferable ideas; the language is a good fit for scripting and internal tools where reliability and clarity matter.

This section takes you from **very beginner** (no prior Elixir) through **advanced** concepts to **implementation and use cases** for these roles.

---

## What you get: language and ecosystem

Elixir provides:

- **Functional style:** Data is immutable; you transform it with functions. There are no classes; code is organized in **modules** and **functions**. Recursion and higher-order functions (e.g. `Enum.map`) replace loops.
- **Pattern matching:** The `=` operator is the *match* operator; it matches and destructures data (e.g. tuples, lists, maps). That drives both everyday code and error handling (e.g. `{:ok, x}` vs `{:error, reason}`). Function clauses and `case` use the same mechanism.
- **Concurrency via processes:** The BEAM runs millions of lightweight **processes**. They share nothing by default and communicate by message passing. **OTP** adds patterns like **GenServer**, **supervision trees**, and **releases**. You will use these when building or operating real applications.
- **Tooling:** **Mix** for projects (compile, test, release), **Hex** for dependencies, **IEx** for an interactive shell, **ExUnit** for tests. The same tooling is used in apps and in scripts, so learning one workflow carries over.

The rest of this section teaches these ideas step by step so you can read, write, and operate Elixir code with confidence.

---

## When to choose Elixir (and when not)

Choose Elixir when you need: high concurrency (many connections or tasks), fault tolerance and clean restarts, real-time or low-latency behaviour, or a single language for app and tooling. It is a strong fit for web backends (Phoenix), real-time systems, and embedded (Nerves). It is less ideal when you need heavy numeric computation (use NIFs or ports to C/Rust), when the team has no time to learn a functional style, or when the ecosystem (e.g. a specific library) is better in another language. For DevOps, even if you do not write Elixir daily, understanding it helps when deploying and debugging Phoenix or Nerves and when writing small scripts or tools on the BEAM.

---

## Further reading

- [Elixir — Getting Started](https://hexdocs.pm/elixir/)
- [Elixir learning resources](https://elixir-lang.org/learning.html)
