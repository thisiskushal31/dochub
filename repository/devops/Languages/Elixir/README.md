# Elixir

[← Back to Languages](../README.md)

**What this language does and why it's here:** Elixir is a dynamic, functional language built on the BEAM (Erlang VM). It gives you concurrency, fault tolerance, and distribution from Erlang/OTP, with a clear syntax and a strong standard library. In a DevOps and engineering context, Elixir powers Phoenix web apps and APIs, Nerves for embedded/IoT, and tooling that benefits from the BEAM. This section is a deep dive: it goes from **very basic** (what Elixir is, installation, basic types) through **advanced** (processes, OTP, Mix) to **use-case driven** (what you can do with the language, security and DevOps), and ends with a **reference** (standard library modules).

---

## How to read this section

Read in **number order** for a single path from beginner to advanced to use cases.

- **Topics 1–4 (Very basic):** What Elixir is, how to run it, basic types, lists and tuples. Start here if you are new.
- **Topics 5–11 (Core language):** Pattern matching, control flow, functions, strings, keyword lists and maps, modules, structs. The core you need to write real code.
- **Topics 12–15 (Recursion and data):** Recursion, Enum and Stream, comprehensions, protocols, sigils. Deeper data and abstraction.
- **Topics 16–18 (Concurrency and I/O):** Error handling, processes, IO and the file system. Concurrency and side effects.
- **Topics 19–20 (Build and runtime):** Mix projects, OTP (agents, GenServer, supervision). How to build and run applications.
- **Topics 21–22 (Use cases and security):** What you can do with Elixir (by role and goal) and how to run it safely in production. Read these when you want to see where the language fits and how to harden it.
- **Topic 23 (Reference):** Standard library modules—what each module is and when to use it. Use this when you need to look something up; it does not teach the language.

---

## Learning path: from basics to use cases

| Stage | Topics | What you'll be able to do |
|-------|--------|---------------------------|
| **Very basic** | 1 → 2 → 3 → 4 | Understand what Elixir is, run IEx and scripts, and use basic types, lists, and tuples. |
| **Core language** | 5 → 6 → 7 → 8 → 9 → 10 → 11 | Use pattern matching, case/cond/if, anonymous functions, strings/binaries, keyword lists and maps, modules and functions, structs. |
| **Recursion and data** | 12 → 13 → 14 → 15 | Write recursive code, use Enum and Stream, comprehensions, protocols, and sigils. |
| **Concurrency and I/O** | 16 → 17 → 18 | Handle errors with try/rescue, work with processes, and use IO and the file system. |
| **Build and OTP** | 19 → 20 | Create and build Mix projects, and use OTP (agents, GenServer, supervision). |
| **Use cases and applications** | 21 | See what you can do with Elixir: application and web, scripts and CLI, tooling, data and formats, by role. |
| **Security and DevOps** | 22 | Apply security and DevOps practices: config and secrets, input validation, supply chain, releases, and hardening. |
| **Standard library reference** | 23 | Look up any standard library module: what it is, when to use it, and how it fits use cases and security. |

---

## Topics (in order)

| # | Topic | File |
|---|--------|------|
| **1–4: Very basic** |
| 1 | What is Elixir? | [1_What_Is_Elixir.md](./1_What_Is_Elixir.md) |
| 2 | Environment and installation | [2_Environment_And_Installation.md](./2_Environment_And_Installation.md) |
| 3 | Basic types | [3_Basic_Types.md](./3_Basic_Types.md) |
| 4 | Lists and tuples | [4_Lists_And_Tuples.md](./4_Lists_And_Tuples.md) |
| **5–11: Core language** |
| 5 | Pattern matching | [5_Pattern_Matching.md](./5_Pattern_Matching.md) |
| 6 | case, cond, and if | [6_Case_Cond_And_If.md](./6_Case_Cond_And_If.md) |
| 7 | Anonymous functions | [7_Anonymous_Functions.md](./7_Anonymous_Functions.md) |
| 8 | Binaries, strings, and charlists | [8_Binaries_Strings_And_Charlists.md](./8_Binaries_Strings_And_Charlists.md) |
| 9 | Keyword lists and maps | [9_Keyword_Lists_And_Maps.md](./9_Keyword_Lists_And_Maps.md) |
| 10 | Modules and functions | [10_Modules_And_Functions.md](./10_Modules_And_Functions.md) |
| 11 | Structs | [11_Structs.md](./11_Structs.md) |
| **12–15: Recursion and data** |
| 12 | Recursion and enumerables | [12_Recursion_And_Enumerables.md](./12_Recursion_And_Enumerables.md) |
| 13 | Comprehensions and streams | [13_Comprehensions_And_Streams.md](./13_Comprehensions_And_Streams.md) |
| 14 | Protocols | [14_Protocols.md](./14_Protocols.md) |
| 15 | Sigils | [15_Sigils.md](./15_Sigils.md) |
| **16–18: Concurrency and I/O** |
| 16 | try, catch, and rescue | [16_Try_Catch_And_Rescue.md](./16_Try_Catch_And_Rescue.md) |
| 17 | Processes | [17_Processes.md](./17_Processes.md) |
| 18 | IO and the file system | [18_IO_And_The_File_System.md](./18_IO_And_The_File_System.md) |
| **19–20: Build and runtime** |
| 19 | Mix and projects | [19_Mix_And_Projects.md](./19_Mix_And_Projects.md) |
| 20 | OTP: agents, GenServer, and supervision | [20_OTP_Agents_GenServer_And_Supervision.md](./20_OTP_Agents_GenServer_And_Supervision.md) |
| **21–22: Use cases and security** |
| 21 | Use cases and applications | [21_Use_Cases_And_Applications.md](./21_Use_Cases_And_Applications.md) |
| 22 | Security and DevOps | [22_Security_And_DevOps.md](./22_Security_And_DevOps.md) |
| **23: Reference** |
| 23 | Standard library modules reference | [23_Standard_Library_Modules_Reference.md](./23_Standard_Library_Modules_Reference.md) |

---

## By engineering role

| Role | Focus | Where to go |
|------|--------|-------------|
| **Application / Phoenix** | Web APIs, real-time apps, deploy | Basics 1–4, core 5–11, processes 17–18, build 19–20, then **21** (use cases), **22** (security). |
| **DevOps / SRE** | Build, releases, deploy, operate | 2, 18–20, then **21**, **22**; use **23** to look up modules. |
| **Security** | Secure config, supply chain, hardening | Core 9–10, errors 16, then **21**, **22**; **23** for config, System, File, Path. |
| **Embedded / IoT (Nerves)** | Firmware, OTA, device ops | 2, 17–20, then **21**, **22**. |
| **Backend / tooling** | Services, scripts, concurrency | 5–12, 17–20, then **21**; **23** for Enum, Stream, File, System. |

---

## Further reading

- [Elixir documentation (Getting Started)](https://hexdocs.pm/elixir/)
- [Phoenix](https://www.phoenixframework.org/)
- [Nerves](https://www.nerves-project.org/)
- [Hex (package manager)](https://hex.pm/)
