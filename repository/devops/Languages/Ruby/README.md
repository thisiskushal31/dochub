# Ruby

[← Back to Languages](../README.md)

Ruby is a **dynamic**, **object-oriented** language built around **message passing**: you send messages to objects, and methods answer. The implementation most teams mean when they say “Ruby” is **MRI** (Matz’s Ruby Interpreter), also called **CRuby**—the C-based reference runtime from [ruby-lang.org](https://www.ruby-lang.org/). Other implementations (**JRuby**, **TruffleRuby**, **mruby**, **Opal**) share much of the language but differ in threading, deployment, gem compatibility, and performance tradeoffs.

This section treats Ruby as **whole-engineering** material: **language and runtime semantics**, **software design** and maintainability, **API and domain modeling**, **data and integration boundaries**, **quality** (testing, review, static analysis), **security and privacy**, **reliability** (failure modes, observability, incident response), **performance and cost**, **packaging and delivery**, and **ecosystem** choices (Rails, Sinatra, automation DSLs, embedded runtimes). **DevOps** is one lens on the same skills—shipping, configuring, and defending systems—not the only audience.

**Engineering domains this track touches:** interpreter and object model; blocks and metaprogramming; core types and Enumerable; concurrency and the GVL; stdlib and gems; native extensions and JIT; alternate implementations; testing and debugging; supply chain; CI/CD and containers; web and batch workloads; infrastructure DSLs (Chef, Vagrant, Rake) as **one** ecosystem slice among many.

**Chef and IAC:** Language mechanics for reading cookbooks and libraries live here. Chef *product* workflow (Policyfiles, Infra Server, compliance) lives under **[IAC/Chef](../../IAC/Chef/README.md)**.

**Rails** is a **framework**, not Ruby. Learn chapters **01–13** before relying on Rails guides alone.

---

## Ruby versions, MRI, and documentation policy

Ruby uses **major.minor.patch** (e.g. **3.4.2**). Behavior and stdlib are tied to the **minor** you run. This handbook defaults to **MRI 3.4**; pin the same minor in `.ruby-version`, `Gemfile`, CI, and production images.

```bash
ruby -v
ruby -e 'puts RUBY_VERSION; puts RUBY_DESCRIPTION'
which ruby
```

Authoring link inventories live under **`DevOps-Handbook-Source`**; learners do not need internal scrape folders.

---

## Chapter structure

Every chapter **`01`–`22`** uses the same **three-part body** (before **`## References`**):

1. **Concepts** — mechanics you must be able to reason about (`## 1. Concepts`).
2. **Advanced concepts** — VM behavior, edge cases, cross-version and cross-implementation differences (`## 2. Advanced concepts`).
3. **Applications and use cases** — **software engineering** (design, APIs, refactors), **security**, **data boundaries**, **reliability**, **performance**, **delivery/operations**, and **migration** (`## 3. Applications and use cases`).

Many chapters end with a **staff-level review checklist**.

### Guardrails

1. **Standalone narrative** — No “according to document X” in the body; deep links only under **References**.
2. **Text first, then code** — Prose explains; Ruby/shell appears only where it anchors behavior.
3. **No ornamental code** — Conceptual sections stay prose-only.
4. **Depth over tourism** — Failure modes, invariants, and review questions are explicit—not a syntax pamphlet.

---

## Semantic model (why Ruby feels different)

1. **Everything is an object** — Classes and modules are objects; `nil` is an object; methods are resolved at runtime.
2. **Messages, not just function calls** — `obj.foo` is dispatch with dynamic lookup; `method_missing`, `prepend`, and refinements change behavior.
3. **Blocks are structural** — Not optional sugar; iterators, resource lifecycle, and DSLs depend on blocks/procs/lambdas.
4. **GVL on MRI** — Parallel CPU-bound Ruby in one process is limited; I/O and multi-process architectures compensate.
5. **Open classes and metaprogramming** — Power for frameworks; risk for global monkey patches—governance required.

---

## What you can take away

- **What** Ruby is as a language and **which implementation** you run in each environment.
- **Why** teams still choose Ruby (velocity, expressiveness, gem ecosystem, Rails, DSLs) and **where** costs appear (typing, GVL, memory, extensions).
- **How** to design APIs, modules, and boundaries in dynamic Ruby without hidden magic.
- **How** to test, secure, package, and ship Ruby like any production language—not only as “script glue.”

---

## Beginner → staff progression

| Phase | Chapters | Outcome |
|--------|----------|---------|
| Foundations | 01–08 | Read/write idiomatic Ruby; object model, blocks, metaprogramming literacy. |
| Libraries & integration | 09–13 | Load path, I/O, stdlib, JSON/YAML, Bundler, reproducible builds. |
| Runtime & platforms | 14–18 | GC, YJIT, extensions; MRI vs JRuby vs embedded. |
| Production engineering | 19–22 | Testing, security, delivery, ecosystem strategy. |

Suggested order: **01 → 13** → **14 → 18** → **19 → 22**. Revisit **07** for concurrency incidents; **08** before reviewing framework or DSL code; **20** before any untrusted input path.

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 1 | Introduction: MRI, runtime, and first scripts | [01](./01_Introduction_MRI_Runtime_And_First_Scripts.md) |
| 2 | Syntax, literals, operators, and precedence | [02](./02_Syntax_Literals_Operators_And_Precedence.md) |
| 3 | Control flow, blocks, procs, and methods | [03](./03_Control_Flow_Blocks_Procs_And_Methods.md) |
| 4 | Classes, modules, and the object model | [04](./04_Classes_Modules_And_Object_Model.md) |
| 5 | Core types: strings, collections, symbols, time | [05](./05_Core_Types_Strings_Collections_And_Time.md) |
| 6 | Enumerable, iteration, and pattern matching | [06](./06_Enumerable_Iteration_And_Pattern_Matching.md) |
| 7 | Exceptions, fibers, threading, and the GVL | [07](./07_Exceptions_Fibers_Threading_And_GVL.md) |
| 8 | Metaprogramming and DSL patterns | [08](./08_Metaprogramming_And_DSL_Patterns.md) |
| 9 | Load path, `require`, gems, and packaging layout | [09](./09_Load_Path_Require_Gems_And_Packaging.md) |
| 10 | Files, processes, I/O, and networking basics | [10](./10_Files_Processes_IO_And_Networking.md) |
| 11 | Standard library I: data, CLI, logging | [11](./11_Standard_Library_Part_I_Data_CLI_Logging.md) |
| 12 | Standard library II: net, crypto, and ops surfaces | [12](./12_Standard_Library_Part_II_Net_Crypto_And_Ops.md) |
| 13 | RubyGems, Bundler, and reproducible dependencies | [13](./13_RubyGems_Bundler_And_Reproducible_Dependencies.md) |
| 14 | GC, memory, profiling, and performance | [14](./14_GC_Memory_Profiling_And_Performance.md) |
| 15 | YJIT, native extensions, and runtime internals | [15](./15_YJIT_Native_Extensions_And_Runtime_Internals.md) |
| 16 | JRuby: JVM, threads, and deployment | [16](./16_JRuby_JVM_Threads_And_Deployment.md) |
| 17 | TruffleRuby and GraalVM | [17](./17_TruffleRuby_And_GraalVM.md) |
| 18 | Alternate implementations and embedded Ruby | [18](./18_Alternate_Implementations_And_Embedded_Ruby.md) |
| 19 | Testing, debugging, and quality | [19](./19_Testing_Debugging_And_Quality.md) |
| 20 | Security, unsafe patterns, and supply chain | [20](./20_Security_Unsafe_Patterns_And_Supply_Chain.md) |
| 21 | CI, containers, and operations | [21](./21_CI_Containers_And_Operations.md) |
| 22 | Ecosystem, engineering domains, and competency map | [22](./22_Ecosystem_DevOps_Tools_And_Competency_Map.md) |

All **22 chapters** are written and undergoing a **depth expansion pass**: staff-level mechanics, failure modes, and scenarios across software engineering, security, data, reliability, and delivery—not a DevOps-only lens.

---

## Deep-study workflow

1. Read **`## 1` → `## 2` → `## 3`** in order; use **References** only after you can explain the chapter without them.
2. Maintain an **invariants notebook**: encoding policy, hash key types, exception taxonomy, Bundler/Ruby pins, concurrency model.
3. After **04–08**, read framework or library code (Rails model, gem client, internal DSL) and label dispatch, `self`, and blocks.
4. After **13–15**, reproduce one production build locally (Dockerfile + lockfile + native gems).
5. After **19–20**, run tests + `bundle audit` + one threat-model pass on a real repo.

---

## Further reading

- [Ruby documentation (MRI 3.4)](https://docs.ruby-lang.org/en/3.4/)
- [The Ruby Programming Language site](https://www.ruby-lang.org/en/documentation/)
- [Ruby Style Guide](https://rubystyle.guide/)
- [RubyGems guides](https://guides.rubygems.org/)
- [Bundler documentation](https://bundler.io/)
- [Rails Guides](https://guides.rubyonrails.org/)
- [IAC: Chef](../../IAC/Chef/README.md)
