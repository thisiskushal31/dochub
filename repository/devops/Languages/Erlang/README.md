# Erlang

[← Back to Languages](../README.md)

**What this language does and why it's here:** Erlang is a concurrent, functional language that runs on the BEAM VM. It was designed for fault-tolerant, distributed systems (telecom, messaging, databases). Elixir compiles to Erlang and uses the same runtime. In a DevOps and engineering context, Erlang underpins RabbitMQ, CouchDB, and many high-availability systems; understanding Erlang helps with operating BEAM-based infrastructure, protocol security, and building reliable distributed services. This section is a deep dive: it goes from **very basic** (what Erlang is, installation, types) through **advanced** (processes, OTP, Rebar3) to **use-case driven** (where and how to use it, security and DevOps).

---

## Erlang vs Erlang/OTP vs “System”

It’s easy to see “Erlang,” “Erlang/OTP,” and “system” and wonder what each means. Here’s the distinction:

- **Erlang** — The **language**: syntax, types, modules, functions, processes, message passing, distribution primitives. When we say “Erlang” we usually mean this language and its core semantics.

- **Erlang/OTP** — The **full distribution** you install: the Erlang language plus the **BEAM** VM plus the **OTP** (Open Telecom Platform) libraries and tools. OTP adds:
  - **Kernel** and **STDLIB**: `application`, `code`, `gen_server`, `supervisor`, `lists`, `file`, `io`, etc.
  - **Behaviours**: gen_server, gen_statem, gen_event, supervisor.
  - **Applications and releases**: how you package and run a system.
  - **SASL**, **compiler**, **erts**, and other applications.
  So “Erlang/OTP” = language + VM + standard library + OTP framework. When you install “Erlang” you get Erlang/OTP.

- **System documentation** — On [erlang.org](https://www.erlang.org), the **System Documentation** is the set of manuals that describe this whole system. The URLs live under `https://www.erlang.org/doc/system/` (e.g. `seq_prog`, `conc_prog`, `design_principles`, `reference_manual`). So:
  - **“System”** = the **documentation** that describes the Erlang/OTP system (getting started, reference manual, design principles, etc.).
  - The content in this handbook was written using that system documentation (and other sources) so you get one coherent deep dive; we don’t say “from system doc X” in the body—we keep it standalone and point to those docs in “Further reading.”

In short: **Erlang** is the language; **Erlang/OTP** is the language plus the platform (VM + OTP); **system** refers to the **official system documentation** we used to build this section.

---

## How to read this section

Read in **number order** for a single path from beginner to advanced to use cases.

- **Topics 1–4 (Very basic):** What Erlang is, how to run it, basic types, tuples and lists. Start here if you are new.
- **Topics 5–9 (Core language):** Pattern matching and guards, modules and functions, control flow (case/if), maps and records, binaries and strings. The core you need to write real code.
- **Topics 10–12 (Recursion and robustness):** Recursion and higher-order functions, list comprehensions, error handling. Deeper data and robustness.
- **Topics 13–15 (Concurrency and I/O):** Processes and message passing, registered processes and distribution, IO and the file system.
- **Topics 16–17 (Build and runtime):** Rebar3 and projects, OTP (gen_server, supervision, applications). How to build and run applications.
- **Topics 18–19 (Use cases and security):** What you can do with Erlang (by role and goal) and how to run it safely in production.

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what Erlang is, run the shell and compile modules, use basic types, tuples, and lists. |
| **Core language** | 5 → 6 → 7 → 8 → 9 | Use pattern matching and guards, modules and functions, case/if, maps and records, binaries and strings. |
| **Recursion and robustness** | 10 → 11 → 12 | Write recursive code, list comprehensions, and handle errors with catch/try. |
| **Concurrency and I/O** | 13 → 14 → 15 | Work with processes, message passing, registered names, distribution basics, and IO/file system. |
| **Build and OTP** | 16 → 17 | Create Rebar3 projects and use OTP (gen_server, supervisors, applications, releases). |
| **Use cases and applications** | 18 | See where Erlang is used: messaging, databases, telecom, DevOps, and by engineering role. |
| **Security and DevOps** | 19 | Apply security and DevOps practices: config, cookies, TLS distribution, supply chain, hardening. |

---

## Topics (in order)

| # | Topic | File |
|---|--------|------|
| **1–4: Very basic** |
| 1 | What is Erlang? | [1_What_Is_Erlang.md](./1_What_Is_Erlang.md) |
| 2 | Environment and installation | [2_Environment_And_Installation.md](./2_Environment_And_Installation.md) |
| 3 | Basic types | [3_Basic_Types.md](./3_Basic_Types.md) |
| 4 | Tuples and lists | [4_Tuples_And_Lists.md](./4_Tuples_And_Lists.md) |
| **5–9: Core language** |
| 5 | Pattern matching and guards | [5_Pattern_Matching_And_Guards.md](./5_Pattern_Matching_And_Guards.md) |
| 6 | Modules and functions | [6_Modules_And_Functions.md](./6_Modules_And_Functions.md) |
| 7 | Control flow: case and if | [7_Control_Flow_Case_And_If.md](./7_Control_Flow_Case_And_If.md) |
| 8 | Maps and records | [8_Maps_And_Records.md](./8_Maps_And_Records.md) |
| 9 | Binaries and strings | [9_Binaries_And_Strings.md](./9_Binaries_And_Strings.md) |
| **10–12: Recursion and robustness** |
| 10 | Recursion and higher-order functions | [10_Recursion_And_Higher_Order_Functions.md](./10_Recursion_And_Higher_Order_Functions.md) |
| 11 | List comprehensions | [11_List_Comprehensions.md](./11_List_Comprehensions.md) |
| 12 | Error handling | [12_Error_Handling.md](./12_Error_Handling.md) |
| **13–15: Concurrency and I/O** |
| 13 | Processes and message passing | [13_Processes_And_Message_Passing.md](./13_Processes_And_Message_Passing.md) |
| 14 | Registered processes and distribution | [14_Registered_Processes_And_Distribution.md](./14_Registered_Processes_And_Distribution.md) |
| 15 | IO and the file system | [15_IO_And_The_File_System.md](./15_IO_And_The_File_System.md) |
| **16–17: Build and runtime** |
| 16 | Rebar3 and projects | [16_Rebar3_And_Projects.md](./16_Rebar3_And_Projects.md) |
| 17 | OTP: gen_server, supervision, applications | [17_OTP_GenServer_Supervision_Applications.md](./17_OTP_GenServer_Supervision_Applications.md) |
| **18–19: Use cases and security** |
| 18 | Use cases and applications | [18_Use_Cases_And_Applications.md](./18_Use_Cases_And_Applications.md) |
| 19 | Security and DevOps | [19_Security_And_DevOps.md](./19_Security_And_DevOps.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Application / backend** | Services, APIs, reliability | Basics 1–4, core 5–9, processes 13–14, build 16–17, then **18**, **19**. |
| **DevOps / SRE** | Build, releases, deploy, operate | 2, 15–17, then **18**, **19**. |
| **Security** | Secure config, distribution, supply chain | 8–9, 12, 14, then **18**, **19**. |
| **Embedded / systems** | BEAM on devices, Nerves-related | 2, 13–14, 16–17, **18**, **19**. |

---

## Scope: what's covered and what's not

**Covered (no stone unturned for the stated goal):** This section gives a full path from zero to use: what Erlang is, why and how to use it, and where it fits (use cases, security, DevOps). It includes: language basics (types, tuples, lists, pattern matching, guards, modules, functions, case/if, maps, records, binaries, strings); recursion and higher-order functions; list comprehensions; error handling; processes and message passing; registered processes and distribution (nodes, cookies, epmd); IO and the file system; Rebar3 and projects; OTP (gen_server, supervision, applications, releases); use cases by engineering role; and security and DevOps. That is enough to read and write Erlang, use OTP, build releases, and operate BEAM systems safely.

**Not covered in depth here (by design):** Some topics are only mentioned or left for further reading so the section stays focused and readable. You can go deeper on your own with the links below and the official docs:

- **gen_statem, gen_event** — Other OTP behaviours; gen_server (topic 17) gives you the pattern; the same ideas apply.
- **ETS, DETS, Mnesia** — In-memory and disk tables, and the distributed DB; used in caches and storage backends; see STDLIB and Mnesia docs.
- **NIFs and Ports** — Calling C/other code from Erlang; advanced and with stability/latency implications; see Interoperability Tutorial.
- **Release handling** — Upgrading and downgrading a running system (appup, relup); topic 17 and Security (19) point to it; full detail is in System Principles / Release Handling.
- **Preprocessor and macros** — `-define`, `-include`, conditional compilation; used in records and in many codebases; Reference Manual and Records and Macros.
- **Efficiency Guide** — Performance pitfalls (e.g. `++`, `list_to_atom`, `length`), binary handling, process tuning; important for production but separate from “learn the language and OTP.”
- **Embedded / Nerves** — Running on devices, OTA updates; use cases (topic 18) point there; see Embedded Systems User's Guide and Nerves.

If you need one of these, use the “Further reading” links in the relevant topic or the list below.

---

## Further reading

- [Erlang/OTP documentation](https://www.erlang.org/docs)
- [Getting Started With Erlang](https://www.erlang.org/doc/system/getting_started)
- [OTP Design Principles](https://www.erlang.org/doc/system/design_principles)
- [Rebar3](https://rebar3.org/)
- [EEF Secure Coding and Deployment Hardening](https://security.erlef.org/secure_coding_and_deployment_hardening/)
