# Ruby

[← Back to Languages](../README.md)

Ruby is a **dynamic**, **object-oriented** language built around **message passing**: you send messages to objects, and methods answer. The implementation most teams mean when they say “Ruby” is **MRI** (Matz’s Ruby Interpreter), also called **CRuby**—the C-based reference runtime. Other implementations (**JRuby**, **TruffleRuby**, **mruby**, **Opal**) share much of the language but differ in threading, deployment, gem compatibility, and performance tradeoffs.

This track teaches Ruby as **systems work**: language and runtime semantics, software design, API and domain modeling, data and integration boundaries, quality (testing, review, static analysis), security, reliability, performance, packaging and delivery, and ecosystem choices (Rails, Sinatra, automation DSLs, embedded runtimes)—**not** only as a syntax tour. **Chef** product workflow lives under **[IAC/Chef](../../IAC/Chef/README.md)**; language mechanics for reading cookbooks live here. **Rails** is a framework, not Ruby—learn chapters **01–13** before leaning on Rails guides alone.

---

## Ruby versions, MRI, and which documentation to read

Ruby uses **major.minor.patch** releases (for example **3.4.x**). Behavior and the standard library are tied to the **minor** you run. This handbook defaults to **MRI 3.4**; pin the same minor in `.ruby-version`, `Gemfile`, CI, and production images. When you read API docs, match them to the Ruby you run—methods and defaults can differ across minors.

**Practical policy:** record `RUBY_VERSION` / `RUBY_DESCRIPTION` in diagnostic output; in CI, assert the expected **minor**; keep a **Gemfile.lock** and a **container digest** (or base-image pin) for the system layer. Developer machines often use **rbenv**, **asdf**, or similar—standardize one story per team.

```bash
ruby -v
ruby -e 'puts RUBY_VERSION; puts RUBY_DESCRIPTION'
which ruby
```

---

## Chapter structure

Chapters `01`–`22` follow a consistent body shape:

1. **Concepts** (mechanics you can reason about in incidents)
2. **Advanced concepts** (VM behavior, edge cases, cross-version and cross-implementation differences)
3. **Applications and use cases** (production and governance patterns)
4. **Staff-level review checklist** (what staff enforce in review)

Links live in each chapter’s **References** section.

---

## Semantic model (why Ruby feels different)

- **Everything is an object:** classes and modules are objects; `nil` is an object; methods are resolved at runtime.
- **Messages, not just function calls:** `obj.foo` is dispatch with dynamic lookup; `method_missing`, `prepend`, and refinements change behavior.
- **Blocks are structural:** not optional sugar; iterators, resource lifecycle, and DSLs depend on blocks, procs, and lambdas.
- **GVL on MRI:** parallel CPU-bound Ruby in one process is limited; I/O and multi-process architectures compensate.
- **Open classes and metaprogramming:** power for frameworks; risk for global monkey patches—governance required.

---

## Beginner to advanced progression

| Phase | Chapters | Outcome |
|--------|----------|---------|
| Foundations | 01–08 | Read/write idiomatic Ruby; object model, blocks, metaprogramming literacy. |
| Libraries and integration | 09–13 | Load path, I/O, stdlib, JSON/YAML, Bundler, reproducible builds. |
| Runtime and platforms | 14–18 | GC, YJIT, extensions; MRI vs JRuby vs embedded. |
| Production engineering | 19–22 | Testing, security, delivery, ecosystem strategy. |

Suggested order: **01 → 13**, then **14 → 18**, then **19 → 22**. Revisit **07** for concurrency incidents; **08** before reviewing framework or DSL code; **20** before any untrusted input path.

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

---

## Deep-study workflow

1. Read each chapter with a **notebook of invariants** for your org (encoding policy, hash key types, exception taxonomy, Bundler/Ruby pins, concurrency model).
2. After chapters **04–08**, read framework or library code (Rails model, gem client, internal DSL) and label dispatch, `self`, and blocks.
3. After chapters **13–15**, reproduce one production build locally (Dockerfile + lockfile + native gems).
4. After chapters **19–20**, run tests, a dependency audit, and one threat-model pass on a real repo.

---

## Further reading

- [Ruby documentation (MRI 3.4)](https://docs.ruby-lang.org/en/3.4/)
- [Ruby documentation hub](https://www.ruby-lang.org/en/documentation/)
- [RubyGems guides](https://guides.rubygems.org/)
- [Bundler documentation](https://bundler.io/)
- [Rails Guides](https://guides.rubyonrails.org/)
- [IAC: Chef](../../IAC/Chef/README.md)

---

## References (hub links)

- [The Ruby Programming Language](https://www.ruby-lang.org/)
- [Ruby documentation (MRI 3.4)](https://docs.ruby-lang.org/en/3.4/)
- [RubyGems](https://rubygems.org/)
- [Bundler](https://bundler.io/)
