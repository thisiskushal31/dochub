# Use cases and applications

[← Back to Erlang](./README.md)

Erlang is used where **concurrency**, **fault tolerance**, and **distribution** matter more than raw single-thread speed. This topic summarises what the language is good for, how you can use it, and where it fits from the perspective of **software engineering**, **DevOps**, **cybersecurity**, and **embedded/systems** so you can see the full picture from basics to advanced use.

**What you can do with Erlang.** You can build long-running, concurrent services that handle many connections or messages (e.g. message brokers, protocol servers, backends). You can structure them with OTP so that failures in one process do not bring down the system and so that you can scale across multiple nodes. You can deploy them as a single release artifact and operate them with standard DevOps practices, while paying attention to distribution security and supply chain.

**Messaging and brokers.** **RabbitMQ** is implemented in Erlang. Message brokers need to handle many connections, route messages, and stay up under load. The BEAM’s process model and per-process GC fit this: many lightweight processes, clear failure boundaries, and clustering via distribution. If you operate or extend RabbitMQ, knowing Erlang helps with debugging, plugins, and tuning.

**Databases and storage.** **CouchDB** and **Riak** (and similar) use Erlang for replication, distribution, and consistency. The same strengths apply: many connections, fault tolerance, and multi-node design. Erlang is also used in custom storage layers and caches where consistency and availability are priorities.

**Telecom and protocols.** Erlang was created for telecom: call control, signalling, and protocol stacks. It is still used in VoIP, messaging systems, and anywhere that requires soft real-time behaviour and high availability. Protocol implementations often use the bit syntax and binaries for parsing and building frames.

**Web and APIs.** Erlang is less common for typical CRUD web apps than Elixir (Phoenix), but it powers backends that need many long-lived connections (e.g. WebSocket servers, game backends) or that are part of a larger Erlang system. **Cowboy** and **elli** are HTTP servers written in Erlang; Phoenix runs on the BEAM and can call Erlang code.

**By engineering role.**

- **Software engineering:** You use Erlang (or Elixir) to design and implement services: processes, message passing, OTP behaviours (gen_server, supervision), and applications. You need the language (types, pattern matching, modules, functions), concurrency (processes, links), and OTP (gen_server, supervisors, applications, releases). You apply the same concepts whether the system is a broker, a database, or an API backend.

- **DevOps / SRE:** You build releases (e.g. with Rebar3), configure the VM and distribution (name, cookie, TLS), and deploy and operate BEAM nodes. You care about boot scripts, code loading, target systems, and release handling. You use the same shell and VM for remote inspection and one-off commands. Understanding Erlang helps when reading logs, crash dumps, and config and when writing automation that interacts with the runtime.

- **Cybersecurity / security engineering:** You care about secure configuration (no secrets in repo, env or secrets manager), distribution security (strong cookie, TLS for distribution, network segmentation), input validation at boundaries (pattern matching, guards, safe path handling), and supply chain (pinned deps, lock files, audit). You ensure that nodes accept only intended peers and that sensitive data is not logged or exposed.

- **Embedded / systems:** Nerves (Elixir) and Erlang are used on devices for firmware, OTA updates, and device-side logic. The same BEAM concepts (processes, OTP, distribution) apply; the deployment and constraints are different (resource limits, read-only or minimal storage). Use cases include gateways, industrial control, and IoT backends on the device.

**Why this matters.** Seeing use cases and roles together helps you decide when to choose Erlang, how to use it (from coding to deploying), and what to harden (security and DevOps). The language and OTP are the same whether you are writing a broker, a backend, or tooling; the context (DevOps, security, embedded) determines how you build, deploy, and operate it.

---

## Further reading

- [RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [CouchDB](https://docs.couchdb.org/)
- [Nerves](https://hexdocs.pm/nerves/)
- [Erlang/OTP documentation](https://www.erlang.org/docs)
- [EEF](https://erlef.org/)
