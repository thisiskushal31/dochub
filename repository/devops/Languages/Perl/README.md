# Perl

[← Back to Languages](../README.md)

Perl is a general-purpose language whose strengths are **text processing**, **regular expressions**, and **glue** between Unix tools and system APIs. It grew from a tool for scanning files and printing reports into a language used for one-liners, system administration, batch jobs, network services, and large applications. The runtime ships rich core documentation; the **CPAN** archive provides modules for almost every domain.

The implementation most people mean by “Perl” is **Perl 5**: a mature, stable line with regular releases, a large standard library, and a **bytecode** compilation step inside the interpreter (source is compiled to an internal op tree, then executed). That matters for performance intuition: hot loops can be optimized, but you still think in terms of an **interpreter** process, `@INC` module lookup, and optional **XS** extensions that link C code.

People still use Perl where **legacy** and **throughput of text** matter: cron and CI scripts, log parsers, mail and reporting pipelines, ETL glue, BioPerl-era scientific tooling, and codebases that predate newer languages. In **operations**, you meet Perl when jobs fail on **PATH**, **locale**, or **missing pure-perl vs XS** modules. In **security**, you meet it when **auditing** scripts that **open** files, **invoke** shells, **`eval`** strings, or pull **unvetted** CPAN dependencies into regulated environments.

This handbook is written to stand alone: each chapter explains **what** a topic is, **why** it matters in practice, and **how** to apply it, from first ideas through advanced mechanics and whole-engineering angles (software engineering, operations, reliability, security). Explanations are **text first**; **Perl** appears in fenced blocks only where syntax or behavior needs a concrete anchor. Optional figures live under `../../Assets/Languages/Perl/` when they add more than text alone.

### Semantic model (why Perl feels different)

Three ideas unlock most reading:

1. **Context** — Many expressions produce different results in **scalar** context (one value) vs **list** context (zero or more values). Assignment, subroutines, and builtins dispatch on context. Misreading context is the most common “bug” when porting mental models from Python or JavaScript.

2. **Sigils** — `$name` is a scalar, `@name` is an array, `%name` is a hash. Sigils are not “type prefixes” in the C++ sense; they tell you what kind of value you are accessing. Slices and references add nuance (later chapters).

3. **Practical defaults** — The language historically favored **DWIM** (“do what I mean”). That helps one-liners; it hurts when strictness is required. Modern style uses **`use strict`**, **`use warnings`**, and explicit **encoding** discipline for anything that leaves a toy script.

### What you can take away

- **What** Perl is, how the interpreter runs code, and how modules load.
- **Why** teams still depend on it and which **risks** (supply chain, injection, legacy patterns) show up in review.
- **How** to write, test, and ship scripts with predictable behavior in **cron**, **CI**, and **containers**.
- **Where** Perl appears in real engineering (automation, parsing, glue, legacy services) and what **security** and **operations** reviews should check: **`system`/`exec`**, **`open`**, **`eval`**, **`$ENV`**, **`@INC`**, **XS**, and **file** permissions.

Read chapters **1 → 12** in order unless you already know the basics and jump to a topic.

```bash
perl -v
perl -V:version
```

The second line prints a compact version line useful for logs and support tickets.

---

## Chapters (what each file is for)

| # | Topic | You will be able to… |
|---|--------|----------------------|
| 1 | [Introduction: platform, interpreter, toolchain, first script](./01_Introduction_Platform_Toolchain_And_First_Script.md) | Invoke `perl`, read `perl -V`, reason about `@INC`, shebangs, and minimal **strict** discipline. |
| 2 | [Scalars, context, and core syntax](./02_Scalars_Context_And_Core_Syntax.md) | Predict **scalar vs list** behavior, use operators and quoting safely, avoid common uninitialized-value mistakes. |
| 3 | [Arrays, hashes, lists, and control flow](./03_Arrays_Hashes_Lists_And_Control_Flow.md) | Work with **arrays**/**hashes**, `map`/`grep`, and control flow idioms used in real scripts. |
| 4 | [Regular expressions and text processing](./04_Regular_Expressions_And_Text_Processing.md) | Read and write **regex**-heavy code, handle streams and **encoding**, avoid **ReDoS** and unsafe parsing assumptions. |
| 5 | [Subroutines, packages, and the module system](./05_Subroutines_Packages_And_Modules.md) | Structure code into **packages**, load modules with **`use`/`require`**, understand **Exporter**-style APIs. |
| 6 | [CPAN, installers, and reproducible environments](./06_CPAN_Installers_And_Reproducible_Environments.md) | Install and **pin** dependencies, separate **dev/prod** `@INC`, audit **XS** vs pure-Perl. |
| 7 | [References and complex data](./07_References_And_Complex_Data.md) | Build nested structures, pass data without copying huge lists accidentally, debug reference bugs. |
| 8 | [Object-oriented Perl and design](./08_Object_Oriented_Perl_And_Design.md) | Read **bless**-based OO and modern **Moo/Moose**-style layers; know where **metaprogramming** hurts audits. |
| 9 | [Processes, I/O, and security boundaries](./09_Processes_IO_And_Security_Boundaries.md) | Use **`open`**, pipes, and subprocess APIs without **shell injection**; understand **tainting** (`-T`) as a guardrail. |
| 10 | [Testing, debugging, and profiling](./10_Testing_Debugging_And_Profiling.md) | Run **`prove`**, write **`Test::More`** tests, profile hot paths in production-like builds. |
| 11 | [CI, deployment, cron, and operations](./11_CI_Deployment_Cron_And_Operations.md) | Make scripts **cron-safe**, container-safe, and observable (exit codes, logging, locking). |
| 12 | [Use cases, supply chain, and migration](./12_Use_Cases_Supply_Chain_And_Migration.md) | Place Perl in a **modern** stack, plan **migration**, and review **SBOM**-style dependency risk. |

### Deep-study workflow (body-first)

1. Read the chapter narrative and run the examples locally with the **same** Perl major/minor you use in production.
2. Only then open the **References** links for edge cases and exhaustive tables (operators, functions).
3. For security-sensitive code paths, cross-check **perlsec** and your org’s scripting policy after you understand the mechanics here.

---

## References

### Perldoc browser (Perl 5.x)

- [Perldoc Browser](https://perldoc.perl.org/) — versioned HTML manual; pick a Perl release from the site menu when pinning behavior.
- [perl](https://perldoc.perl.org/perl) — main manual, table of contents (Overview, Tutorials, Reference Manual, Internals, History, Miscellaneous, language- and platform-specific material).
- [perlintro](https://perldoc.perl.org/perlintro) — short introduction for newcomers.
- [perldoc](https://perldoc.perl.org/perldoc) — the `perldoc` utility itself.

### Reference lists

- [perlop](https://perldoc.perl.org/perlop) — operators.
- [Functions](https://perldoc.perl.org/functions) — built-in functions.
- [Variables](https://perldoc.perl.org/variables) — special and global variables.
- [Modules](https://perldoc.perl.org/modules) — pragmata and modules.
- [perlutil](https://perldoc.perl.org/perlutil) — installed utilities.

### Tutorials (selected)

- [perlre](https://perldoc.perl.org/perlre), [perlretut](https://perldoc.perl.org/perlretut) — regular expressions.
- [perlboot](https://perldoc.perl.org/perlboot) — OO tutorial (introductory).

### Release and community

- [perldelta](https://perldoc.perl.org/perldelta) — changes for the selected release.
- [perlcommunity](https://perldoc.perl.org/perlcommunity) — where to ask for help.
- [perlfaq](https://perldoc.perl.org/perlfaq) — frequently asked questions.

### Security and platform

- [perlsec](https://perldoc.perl.org/perlsec) — security considerations.
- [perlrun](https://perldoc.perl.org/perlrun) — command-line switches.

### Ecosystem

- [CPAN](https://www.cpan.org/) — Comprehensive Perl Archive Network.
- [perl.org](https://www.perl.org/) — language hub.
