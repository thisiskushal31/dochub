# What is Erlang?

[← Back to Erlang](./README.md)

Erlang is a **concurrent, functional** programming language built for **fault-tolerant, distributed** systems. It runs on the **BEAM** (Björn's Erlang Abstract Machine), the same virtual machine that runs Elixir. This section answers: what the language is, why it is used, how you use it, and where it fits—from zero knowledge to advanced use and across software engineering, DevOps, and security.

**What it is.** Erlang was developed at Ericsson for telecom switches and control systems where downtime and data loss are unacceptable. The language and runtime are built around a few ideas: **lightweight processes** (threads of execution that share no data), **message passing** (no shared memory—processes communicate only by sending messages), **supervision** (when a process crashes, a supervisor can restart it instead of the whole system failing), and **distribution** (processes can run on different machines and communicate the same way). The term "process" is used deliberately: in many languages "threads" share data; in Erlang, each thread of execution has its own memory, so they are called processes.

**Why it is used.** In traditional languages, concurrency often relies on threads and shared state. Race conditions and deadlocks are hard to reason about and reproduce. Erlang avoids shared mutable state: each process has its own memory, and processes communicate only by sending messages. If a process crashes, it does not corrupt others; a **supervisor** can restart it. That makes it easier to build systems that run for years and recover from software errors. The same design fits **distribution**: processes can live on different nodes (machines) and still communicate via the same message-passing model. The BEAM provides preemptive scheduling (no single process can block the VM), per-process garbage collection, and a small process footprint, so you can run very large numbers of processes on one node. For DevOps and infrastructure, that means one runtime can handle many connections—for example in message brokers or databases—with predictable latency and high availability.

**How you use it.** You write code in modules (files with extension `.erl`), compile them to bytecode (`.beam`), and run them in the Erlang shell or as part of a release. You use the shell for experimenting and one-off evaluation; you use **OTP** (behaviours like gen_server, supervisors, applications, releases) to structure production systems. The language gives you pattern matching, single-assignment variables, recursion instead of loops, and a small set of types (numbers, atoms, tuples, lists, maps, binaries, pids, and a few others). Concurrency is explicit: you spawn processes, send messages with `!`, and receive messages with `receive ... end`. Distribution uses the same primitives: you can spawn on another node and send to a process on another node once the nodes share a magic cookie and are connected.

**What are the use cases.** Erlang fits soft real-time systems, message brokers (e.g. RabbitMQ), databases and storage (e.g. CouchDB, Riak), protocol implementations, telecom and VoIP, and any system where concurrency, fault tolerance, and distribution are central. It is less suited to CPU-heavy number crunching (you can use NIFs or ports to other languages, but with care), quick one-off scripts (syntax and tooling target larger systems), or teams with no prior exposure to functional or concurrent programming. From a **software engineering** perspective you design services as processes and OTP behaviours; from a **DevOps** perspective you build releases, configure the VM and distribution, and operate BEAM nodes; from a **security** perspective you secure configuration, distribution (cookies, TLS), and supply chain.

**Relation to Elixir.** Elixir compiles to Erlang and runs on the BEAM. It offers different syntax, a richer standard library, and a different ecosystem (e.g. Phoenix, Mix), but the runtime—processes, OTP, distribution—is the same. Knowing Erlang helps when debugging BEAM systems, reading OTP source, or operating Erlang/Elixir services.

**Erlang vs Erlang/OTP vs “system.”** **Erlang** is the language (syntax, types, processes, etc.). **Erlang/OTP** is what you install: the language plus the BEAM VM plus OTP (Kernel, STDLIB, gen_server, supervisor, applications, releases, and the rest of the platform). So “Erlang/OTP” = language + runtime + standard library + OTP framework. The **system documentation** is the official manuals on erlang.org that describe this whole system (under `doc/system/`—e.g. Getting Started, Reference Manual, OTP Design Principles). When we say we “scraped” or used “system” docs, we mean we used those manuals to build this handbook; the handbook itself is standalone and points to them only in “Further reading.”

---

## Further reading

- [Erlang/OTP documentation](https://www.erlang.org/docs)
- [Getting Started With Erlang](https://www.erlang.org/doc/system/getting_started)
- [Erlang Reference Manual](https://www.erlang.org/doc/system/reference_manual)
- [OTP Design Principles](https://www.erlang.org/doc/system/design_principles)
