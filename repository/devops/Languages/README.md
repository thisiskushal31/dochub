# Languages

Programming languages used in DevOps, **cybersecurity**, and **Web3**: general-purpose, query/config (HCL, JSON, YAML), niche/security (Assembly, Nim, VBA, R, Erlang, Zig, Delphi, COBOL, OCaml, F#, Ada, Julia, Dart, D, Haskell, Clojure, Crystal, VB.NET, Tcl, Fortran, Objective-C), **Web3** (Solidity, Vyper, Move, Cairo), and **LaTeX** for PDF generation. This section gives enough syntax, tooling, and patterns so you can read and write scripts, automation, and tooling; for deep language reference, use official docs or a dedicated language repo. **Shell** content lives in [Operating-Systems](../Operating-Systems/README.md); **HCL** has a deep-dive in [Languages/HCL](./HCL/README.md) (the language); Terraform use cases (providers, state, modules, pipelines) are in [IAC](../IAC/README.md) and [Terraform](../IAC/Terraform/README.md). **Database query languages** (SQL, PromQL, Cypher, etc.) are covered in [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) alongside each engine — see [Database query and config languages](#database-query-and-config-languages) below.

---

## Why these languages (DevOps and security)

| Language   | DevOps relevance |
|-----------|-------------------|
| **C/C++** | Systems programming, kernel/driver context, performance-critical tooling; many infra tools are C/C++. |
| **Python** | Automation, scripting, CI/CD scripts, Ansible, ML/data pipelines, APIs; de facto for many DevOps tasks. |
| **Go**     | Docker, Kubernetes, Terraform, Prometheus, many cloud-native tools; single binary, fast builds, concurrency. |
| **Java**   | Jenkins, enterprise CI/CD, Maven/Gradle builds, Spring Boot microservices; JVM-based tooling and plugins. |
| **JavaScript** | Node.js tooling, front-end for dashboards (Grafana, custom UIs), serverless (Lambda, Cloud Functions). |
| **Rust**   | Growing use in infra (e.g. Bottlerocket, some agents); memory safety, performance; CLI and systems tooling. |
| **TypeScript** | Typed JavaScript; large codebases, tooling, and front-ends that integrate with DevOps dashboards and APIs. |
| **Ruby**   | Chef, Vagrant (Vagrantfile), Capistrano; cookbooks and automation tooling. |
| **Groovy** | Jenkins pipelines (Jenkinsfile), Gradle build scripts; CI/CD and JVM builds. |
| **C#**     | Azure tooling, PowerShell/.NET, Azure DevOps, Azure Functions; Windows and Microsoft-centric DevOps. |
| **Scala**  | JVM; Apache Spark, Kafka, data pipelines, sbt builds; data engineering and streaming. |
| **Perl**   | Legacy sysadmin scripts, CI/cron, Unix automation; maintaining existing environments. |
| **Kotlin** | Gradle build scripts (build.gradle.kts), Android, JVM services; Gradle and JVM stacks. |
| **PHP**    | Web apps (WordPress, Laravel) that DevOps deploys and operates; Composer, PHP-FPM. |
| **Lua**    | Nginx/OpenResty, Redis scripting, HAProxy; config and embedded scripting in infra. |
| **Swift**  | Apple ecosystem (iOS, macOS); Apple-centric DevOps and tooling. |
| **Elixir**  | Phoenix apps, BEAM/OTP, Nerves (embedded); deploy and operate Elixir services. |
| **Assembly** | Reverse engineering, malware analysis, exploit dev; x86/x64, ARM; reading disassembly. |
| **Nim**     | Used in malware and security tooling; cross-platform, compiles to C; recognition and analysis. |
| **VBA**     | VBA and VBScript: macro malware (Office), Windows scripting; deobfuscation and analysis. |
| **R**       | Forensics, threat intel, security analytics; statistics, visualization, and reporting. |
| **LaTeX**   | PDF generation; reports, documentation, threat/audit deliverables; templated and automated PDFs. |
| **Erlang**  | BEAM VM, RabbitMQ, distributed systems; Elixir’s parent; protocol and infra. |
| **Zig**     | Systems language (C alternative); Bun, tooling; emerging in security/low-level. |
| **Delphi**  | Pascal-derived, Windows; legacy enterprise and malware; recognition and analysis. |
| **COBOL**   | Mainframes, banking, government; legacy systems and compliance. |
| **Objective-C** | macOS/iOS legacy; Apple frameworks and interop with Swift. |
| **OCaml**   | Compilers, MirageOS, formal/security tooling; high-assurance. |
| **Solidity** | Ethereum smart contracts; Web3 DevOps and smart-contract security. |
| **F#**      | .NET functional; Azure, data, scripting; Microsoft ecosystem. |
| **Ada**     | Safety-critical (avionics, defense); regulated and high-assurance. |
| **Julia**   | Scientific/numerical, HPC, data pipelines; research infra. |
| **Dart**    | Flutter (mobile/cross-platform); build, deploy, app security. |
| **D**       | Systems language; tooling and niche malware; recognition. |
| **Haskell** | Functional; security/finance tooling, formal methods. |
| **Clojure** | JVM Lisp; data processing, tooling, backend services. |
| **Crystal** | Ruby-like, compiled; web and CLI tooling. |
| **VB.NET**  | .NET legacy; Windows enterprise apps and services. |
| **Tcl**     | Expect, legacy automation, embedded scripting. |
| **Fortran** | HPC, scientific computing; research and legacy. |
| **Vyper**   | Ethereum smart contracts (Python-like); Web3. |
| **Move**    | Aptos, Sui smart contracts; resource-oriented; Web3. |
| **Cairo**   | StarkNet, STARK provable programs; Web3. |
| **Shell**  | Day-to-day scripting on Linux/Unix (Bash, zsh) and Windows (PowerShell); **covered in Operating-Systems**; this folder points there. |
| **HCL**     | HashiCorp Configuration Language: syntax, expressions, types; Terraform, Packer, Vault, Nomad, Consul use it; **Terraform use cases** (providers, state, modules, pipelines) in IAC/Terraform. |
| **JSON**    | Config and APIs; used across CiCd, IAC, Cloud-Native, JavaScript; this folder signposts. |
| **YAML**    | K8s, CI pipelines, Ansible; used across Cloud-Native, CiCd, IAC; this folder signposts. |

---

## Content format (all languages)

For **every concept** in every language section we use the same pattern so readers are not confused:

1. **Text first** — Define the concept, goal, or rule in words.
2. **Then a code block or visual** — Show the idea with real code (or a diagram) so people see syntax, structure, and flow.

Topics go from **very basic to advanced**. Where possible, include **case studies or hands-on examples**: goal → approach/thought process → implementation (code) → expected behavior. This format applies to Ada and to every other language added to this handbook.

---

## Structure

One folder per language. Add topic files (e.g. `1_Basics_And_Syntax.md`, `2_Tooling_And_Packaging.md`) under each language folder and link from that folder’s README.

**Total: 47 languages** (use the # column below to count).

| # | Folder | Description |
|---|--------|-------------|
| 1 | [**C-C++**](./C-C++/README.md) | C and C++: basics, build (make, CMake), where they show up in DevOps (system libs, tooling). |
| 2 | [**Python**](./Python/README.md) | Python: syntax, venv/pip, scripting, automation, and use in Ansible, CI, and data pipelines. |
| 3 | [**Go**](./Go/README.md) | Go: syntax, modules, concurrency, and use in Docker, K8s, Terraform, and CLI tooling. |
| 4 | [**Java**](./Java/README.md) | Java: syntax, Maven/Gradle, Jenkins and CI/CD, microservices; JVM tooling. |
| 5 | [**JavaScript**](./JavaScript/README.md) | JavaScript (Node.js): runtime, npm, scripting, and use in tooling and serverless. |
| 6 | [**Rust**](./Rust/README.md) | Rust: basics, Cargo, and use in systems and CLI tooling in the DevOps space. |
| 7 | [**TypeScript**](./TypeScript/README.md) | TypeScript: types, tooling, and use in tooling and front-ends that touch DevOps. |
| 8 | [**Ruby**](./Ruby/README.md) | Ruby: Chef, Vagrant, Capistrano; cookbooks and automation. |
| 9 | [**Groovy**](./Groovy/README.md) | Groovy: Jenkinsfile, Gradle build scripts; CI/CD and JVM builds. |
| 10 | [**CSharp**](./CSharp/README.md) | C#: Azure, .NET, PowerShell, Azure DevOps; Windows-centric DevOps. |
| 11 | [**Scala**](./Scala/README.md) | Scala: JVM, Spark, Kafka, sbt; data pipelines and streaming. |
| 12 | [**Perl**](./Perl/README.md) | Perl 5: language + CPAN + HTTP/DBI/web/XS integration (16 chapters). |
| 13 | [**Kotlin**](./Kotlin/README.md) | Kotlin: Gradle DSL, Android, JVM; build scripts and services. |
| 14 | [**PHP**](./PHP/README.md) | PHP: runtime, FPM, Composer, domains, CMS + framework landscape. |
| 15 | [**Lua**](./Lua/README.md) | Lua: Nginx/OpenResty, Redis, HAProxy; config and scripting. |
| 16 | [**Swift**](./Swift/README.md) | Swift: Apple (iOS, macOS); tooling and CI. |
| 17 | [**Elixir**](./Elixir/README.md) | Elixir: Phoenix, BEAM/OTP, Nerves; deploy and operate. |
| 18 | [**Assembly**](./Assembly/README.md) | Assembly: RE, malware analysis, exploit dev; x86/x64, ARM. |
| 19 | [**Nim**](./Nim/README.md) | Nim: malware and security tooling; recognition and analysis. |
| 20 | [**VBA**](./VBA/README.md) | VBA and VBScript: macro malware, Windows scripting; analysis. |
| 21 | [**R**](./R/README.md) | R: forensics, threat intel, security analytics. |
| 22 | [**LaTeX**](./LaTeX/README.md) | LaTeX: PDF generation; reports, docs, automated/templated PDFs. |
| 23 | [**Erlang**](./Erlang/README.md) | Erlang: BEAM, RabbitMQ, distributed systems; Elixir’s parent. |
| 24 | [**Zig**](./Zig/README.md) | Zig: systems language; Bun, tooling; C alternative. |
| 25 | [**Delphi**](./Delphi/README.md) | Delphi: Pascal/Windows; legacy and malware; analysis. |
| 26 | [**COBOL**](./COBOL/README.md) | COBOL: mainframes, banking, government; legacy and compliance. |
| 27 | [**Objective-C**](./Objective-C/README.md) | Objective-C: macOS/iOS legacy; Apple frameworks. |
| 28 | [**OCaml**](./OCaml/README.md) | OCaml: compilers, MirageOS, formal/security tooling. |
| 29 | [**Solidity**](./Solidity/README.md) | Solidity: Ethereum smart contracts; Web3 and security. |
| 30 | [**FSharp**](./FSharp/README.md) | F#: .NET functional; Azure, data, scripting. |
| 31 | [**Ada**](./Ada/README.md) | Ada: safety-critical; avionics, defense, regulated. |
| 32 | [**Julia**](./Julia/README.md) | Julia: scientific, HPC, data pipelines. |
| 33 | [**Dart**](./Dart/README.md) | Dart: Flutter; mobile/cross-platform; build and deploy. |
| 34 | [**D**](./D/README.md) | D: systems language; tooling, recognition. |
| 35 | [**Haskell**](./Haskell/README.md) | Haskell: functional; security/finance, formal methods. |
| 36 | [**Clojure**](./Clojure/README.md) | Clojure: JVM Lisp; data, tooling. |
| 37 | [**Crystal**](./Crystal/README.md) | Crystal: Ruby-like, compiled; web and CLI. |
| 38 | [**VBNet**](./VBNet/README.md) | VB.NET: .NET legacy; Windows enterprise. |
| 39 | [**Tcl**](./Tcl/README.md) | Tcl: Expect, legacy automation. |
| 40 | [**Fortran**](./Fortran/README.md) | Fortran: HPC, scientific computing. |
| 41 | [**Vyper**](./Vyper/README.md) | Vyper: Ethereum contracts (Python-like); Web3. |
| 42 | [**Move**](./Move/README.md) | Move: Aptos, Sui smart contracts; Web3. |
| 43 | [**Cairo**](./Cairo/README.md) | Cairo: StarkNet, STARK; Web3. |
| 44 | [**Shell**](./Shell/README.md) | Shell (Bash, PowerShell): **covered in Operating-Systems**; this folder signposts to Linux/Unix/Windows shell docs. |
| 45 | [**HCL**](./HCL/README.md) | HCL language deep-dive (syntax, expressions, types); Terraform/Packer/Vault/Nomad/Consul; Terraform use cases → IAC/Terraform. |
| 46 | [**JSON**](./JSON/README.md) | JSON: config and APIs; **used across CiCd, IAC, Cloud-Native**; this folder signposts. |
| 47 | [**YAML**](./YAML/README.md) | YAML: K8s, CI, Ansible; **used across Cloud-Native, CiCd, IAC**; this folder signposts. |

### Languages in the cybersecurity domain (spectrum)

From **low-level** (firmware, hardware, bootkit — e.g. attacks at the “floppy drive” / BIOS / UEFI level) to **high-level** (scripting, C2, offensive automation) and **nation-state / advanced** tooling (custom implants, exploit chains, NSA-level tradecraft), different languages show up at different layers. Use this map to know what to study for each layer; each language has a folder above.

| Layer | Typical use | Languages you will see |
|-------|-------------|-------------------------|
| **Hardware / firmware / boot** | Bootkits, UEFI/BIOS implants, firmware abuse, very low-level persistence | **Assembly** (x86/x64, ARM), **C** (firmware, drivers); sometimes **Forth** in embedded |
| **Kernel / driver / rootkit** | Kernel modules, rootkits, hypervisor-level | **C**, **C++**, **Assembly**; **Rust** in newer work |
| **Exploit / shellcode / payload** | Exploit dev, shellcode, weaponized exploits | **Assembly**, **C**, **C++**; **Python** for tooling (e.g. pwntools); **Rust**, **Zig**, **D** in newer tooling |
| **Malware / implant / loader** | Malware families, loaders, stealers, RATs | **C/C++**, **Nim**, **Go**, **Rust**, **Delphi**, **C#**, **VBA** (macros), **PowerShell**; **D** in niche cases |
| **Offensive scripting / automation** | Red-team automation, post-ex, C2 agents, phishing | **Python**, **PowerShell**, **Bash**, **Ruby** (Metasploit), **Perl**, **JavaScript** (living-off-the-land, payloads) |
| **Formal / high-assurance** | Verified components, formal methods, crypto, secure OS | **OCaml**, **Haskell**, **Ada**, **Rust**; **F#** in some MS security tooling |
| **Legacy / mainframe / OT** | Critical legacy systems, SCADA, mainframes | **COBOL**, **C**, **Ada**; **Tcl** in some industrial/legacy automation |
| **Nation-state / advanced** | Custom implants, long-term persistence, tailored exploits | Mix of **C/C++**, **Assembly**, **Rust**, **Go**; **Python** for automation; often obfuscated or custom toolchains |

For **defensive** work: **Python**, **R**, **SQL** (analytics, forensics, threat intel); **Shell**, **PowerShell** (IR, automation); **LaTeX** (reports). **JavaScript/PHP** for web-app security. See [Security](../Security/README.md) for practices; use the language folders above for syntax and tooling at each layer.

### Database query and config languages

Database-specific **query and config languages** are covered in **[Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive)** alongside each engine. That repo covers both the database and its language; no separate language folders here. Summary:

| Language / API | Used by (in Databases-Deep-Dive) | Where covered |
|----------------|----------------------------------|---------------|
| **SQL** | MySQL, PostgreSQL, Oracle, SQL Server, SQLite; TimescaleDB, pgvector | [Relational](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/relational), [MySQL](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/relational/mysql), [PostgreSQL](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/relational/postgresql), [time-series](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/time-series), [vector](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/vector) |
| **MongoDB query / aggregation** | MongoDB | [Document/MongoDB](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/document/mongodb) |
| **Cypher** | Neo4j (graph) | [Graph/Neo4j](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/graph/neo4j) |
| **AQL** | ArangoDB (graph, document) | [Graph/ArangoDB](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/graph/arangodb) |
| **Gremlin** | Neptune, some graph APIs | [Graph/Neptune](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/graph/neptune) |
| **CQL** (Cassandra Query Language) | Cassandra, ScyllaDB | [Wide-column](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/wide-column) |
| **Flux / InfluxQL** | InfluxDB (time-series) | [Time-series/InfluxDB](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/time-series/influxdb) |
| **PromQL** | Prometheus (metrics) | [Time-series/Prometheus](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/time-series/prometheus) — Prometheus and PromQL are covered there |
| **Elasticsearch DSL** (Query DSL, JSON) | Elasticsearch | [Search-engine/Elasticsearch](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/search-engine/elasticsearch) |
| **Redis commands / Lua** | Redis (key-value, cache) | [Key-value/Redis](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/key-value/redis); Lua see [Lua](./Lua/README.md) here |
| **PartiQL / DynamoDB API** | DynamoDB | [Key-value/DynamoDB](https://github.com/thisiskushal31/Databases-Deep-Dive/tree/main/key-value/dynamodb) |

For **SQL**, **PromQL**, and all other database languages above, use [Databases-Deep-Dive](https://github.com/thisiskushal31/Databases-Deep-Dive) (each engine and its query language are covered together there).

### Web3 / blockchain

**Solidity**, **Vyper**, **Move**, and **Cairo** have dedicated folders above. **Rust** and **Go** are also used in Web3 (e.g. Solana, Substrate, Hyperledger); see their folders. **JavaScript/TypeScript** are used for dapp frontends and ethers.js/web3.js; see [JavaScript](./JavaScript/README.md) and [TypeScript](./TypeScript/README.md).

---

## How to use

- Pick the language you need for a task (e.g. Python for automation, Go for reading K8s/Terraform code).
- Use each folder’s README as the entry point; add numbered topic files as content grows.
- Cross-reference: [Automation](../Automation/README.md) for scripting patterns; [Operating-Systems](../Operating-Systems/README.md) for shell and OS context.

---

## Adding topics

Add new numbered files under `Languages/<Language>/` and link them from that language’s README. Keep content focused on **DevOps-relevant** usage (scripts, tooling, packaging, testing). Community-maintained.
