# Perl

[← Back to Languages](../README.md)

Perl is a general-purpose language whose strengths are **text processing**, **regular expressions**, and **glue** between Unix tools and system APIs. It grew from a tool for scanning files and printing reports into a language used for one-liners, system administration, batch jobs, network services, and large applications. The runtime ships rich core documentation; the **CPAN** archive provides modules for almost every domain.

The implementation most people mean by “Perl” is **Perl 5**: a mature, stable line with regular releases, a large standard library, and a **bytecode** compilation step inside the interpreter (source is compiled to an internal op tree, then executed). That matters for performance intuition: hot loops can be optimized, but you still think in terms of an **interpreter** process, `@INC` module lookup, and optional **XS** extensions that link C code.

People still use Perl where **legacy** and **throughput of text** matter: cron and CI scripts, log parsers, mail and reporting pipelines, ETL glue, BioPerl-era scientific tooling, and codebases that predate newer languages. In **operations**, you meet Perl when jobs fail on **PATH**, **locale**, or **missing pure-perl vs XS** modules. In **security**, you meet it when **auditing** scripts that **open** files, **invoke** shells, **`eval`** strings, or pull **unvetted** CPAN dependencies into regulated environments.

This handbook is written to stand alone: each chapter explains **what** a topic is, **why** it matters in practice, and **how** to apply it, from first ideas through advanced mechanics and whole-engineering angles (software engineering, operations, reliability, security). Explanations are **text first**; **Perl** appears in fenced blocks only where syntax or behavior needs a concrete anchor. Optional figures live under `../../Assets/Languages/Perl/` when they add more than text alone.

### Chapter structure

Every numbered chapter file **`01`–`16`** uses the same **three-part body** (before **`## References`**):

1. **Concepts** — definitions, syntax, and mechanics you need to read code and docs (`###` subsections under **`## 1. Concepts`**).
2. **Advanced concepts** — edge cases, interactions with other layers (XS, locale, concurrency), and deeper implementation notes (**`## 2. Advanced concepts`**).
3. **Applications and use cases** — **DevOps**, **security**, **CI/cron**, **incident response**, and **migration** scenarios where the chapter’s ideas show up in real work (**`## 3. Applications and use cases`**).

**References** stay last: upstream **Perldoc** / **MetaCPAN** only, so goals and guardrails remain in the narrative.

### Where official documentation lives

Core language and standard-library **POD** (plain old documentation) is distributed with the interpreter. You can read it three ways: the **`perldoc`** command (and **`man`** on many Unix installs), the **[Perldoc Browser](https://perldoc.perl.org/)** (HTML, search, and a **release menu** so you can match production’s Perl), and **`perldoc -f`** / **`perldoc -v`** for built-in functions and variables. **Third-party CPAN modules** are indexed on **[MetaCPAN](https://metacpan.org/)**; the browser and `perldoc` are authoritative for **core** pods bundled with your `perl` binary.

Versioned browser URLs follow `https://perldoc.perl.org/<major.minor.patch>/<page>` (for example `https://perldoc.perl.org/5.40.0/perl`). If a behavior change matters, compare **[perldelta](https://perldoc.perl.org/perldelta)** for your selected release with the delta pages for older versions listed under **History** in [perl](https://perldoc.perl.org/perl).

### Semantic model (why Perl feels different)

Four ideas unlock most reading:

1. **Context** — Many expressions produce different results in **scalar** context (one value) vs **list** context (zero or more values). Assignment, subroutines, and builtins dispatch on context. Misreading context is the most common “bug” when porting mental models from Python or JavaScript.

2. **Sigils** — `$name` is a scalar, `@name` is an array, `%name` is a hash. Sigils are not “type prefixes” in the C++ sense; they tell you what kind of value you are accessing. Slices and references add nuance (later chapters).

3. **Practical defaults** — The language historically favored **DWIM** (“do what I mean”). That helps one-liners; it hurts when strictness is required. Modern style uses **`use strict`**, **`use warnings`**, and explicit **encoding** discipline for anything that leaves a toy script.

4. **Compile time vs runtime** — `use`, `BEGIN`, and some pragmas run during a **compile** phase before the main program runs. That matters when debugging “it fails before line 1,” ordering of `@INC` changes, and why a typo in a `use` can abort the whole script before any `print`.

### What you can take away

- **What** Perl is, how the interpreter runs code, and how modules load.
- **Why** teams still depend on it and which **risks** (supply chain, injection, legacy patterns) show up in review.
- **How** to write, test, and ship scripts with predictable behavior in **cron**, **CI**, and **containers**.
- **Where** Perl appears in real engineering (automation, parsing, glue, legacy services) and what **security** and **operations** reviews should check: **`system`/`exec`**, **`open`**, **`eval`**, **`$ENV`**, **`@INC`**, **XS**, and **file** permissions.
- **How** Perl sits in **full-stack** and **integration** roles: **TLS/HTTP clients**, **DBI** and **SQL** boundaries, **PSGI/Plack** and **web frameworks**, and the **XS/C** boundary when things **segfault** or **ABI**-drift.

### Supplementary Perldoc index ([perldoc.perl.org](https://perldoc.perl.org/))

The lists below mirror the **table of contents** inside [perl](https://perldoc.perl.org/perl) (GETTING HELP → Overview / Tutorials / Reference Manual / …). Use them for a second pass, deep tables, or release-specific wording; they are **not** required to follow the handbook chapters. Pod names match what you pass to `perldoc <name>`.

**Overview**

- [perl](https://perldoc.perl.org/perl) — top-level manual and full outline (this page is the spine of the rest).
- [perlintro](https://perldoc.perl.org/perlintro) — short intro for newcomers.
- [perlrun](https://perldoc.perl.org/perlrun) — interpreter switches, environment, execution model.
- [perltoc](https://perldoc.perl.org/perltoc) — long table of contents as its own page.

**Tutorials**

- [perlreftut](https://perldoc.perl.org/perlreftut), [perldsc](https://perldoc.perl.org/perldsc), [perllol](https://perldoc.perl.org/perllol) — references and data structures.
- [perlrequick](https://perldoc.perl.org/perlrequick), [perlretut](https://perldoc.perl.org/perlretut) — regular expressions.
- [perlootut](https://perldoc.perl.org/perlootut) — object-oriented Perl (replaces the old **perlboot** tutorial, which is now a stub pointing here).
- [perlperf](https://perldoc.perl.org/perlperf), [perlstyle](https://perldoc.perl.org/perlstyle), [perlcheat](https://perldoc.perl.org/perlcheat), [perltrap](https://perldoc.perl.org/perltrap), [perldebtut](https://perldoc.perl.org/perldebtut) — performance, style, pitfalls, debugging.
- [perlfaq](https://perldoc.perl.org/perlfaq) — FAQ hub; detail in [perlfaq1](https://perldoc.perl.org/perlfaq1) … [perlfaq9](https://perldoc.perl.org/perlfaq9).

**Reference manual — language core**

- [perlsyn](https://perldoc.perl.org/perlsyn), [perldata](https://perldoc.perl.org/perldata), [perlop](https://perldoc.perl.org/perlop) — syntax, data, operators.
- [perlsub](https://perldoc.perl.org/perlsub), [perlfunc](https://perldoc.perl.org/perlfunc) — subroutines and built-in functions (see also the aggregated [Functions](https://perldoc.perl.org/functions) index in the browser).
- [perlvar](https://perldoc.perl.org/perlvar), [perldiag](https://perldoc.perl.org/perldiag), [perllexwarn](https://perldoc.perl.org/perllexwarn) — variables, diagnostics, warnings.
- [perldeprecation](https://perldoc.perl.org/perldeprecation), [perlexperiment](https://perldoc.perl.org/perlexperiment) — what is being removed or is still experimental.

**Reference manual — regex, Unicode, I/O**

- [perlre](https://perldoc.perl.org/perlre), [perlrebackslash](https://perldoc.perl.org/perlrebackslash), [perlrecharclass](https://perldoc.perl.org/perlrecharclass), [perlreref](https://perldoc.perl.org/perlreref).
- [perluniintro](https://perldoc.perl.org/perluniintro), [perlunicode](https://perldoc.perl.org/perlunicode), [perlunicook](https://perldoc.perl.org/perlunicook), [perlunitut](https://perldoc.perl.org/perlunitut), [perlunifaq](https://perldoc.perl.org/perlunifaq).
- [perlopentut](https://perldoc.perl.org/perlopentut), [perlipc](https://perldoc.perl.org/perlipc), [perlfork](https://perldoc.perl.org/perlfork), [perlthrtut](https://perldoc.perl.org/perlthrtut) — **ithreads** tutorial; prefer **fork** + **IPC** or **event** loops for many **ops** designs.
- [Parallel::ForkManager](https://metacpan.org/pod/Parallel::ForkManager) — **fork**-pool **workers** for **batch** jobs (MetaCPAN).

**Reference manual — modules, POD, objects**

- [perlmod](https://perldoc.perl.org/perlmod), [perlmodlib](https://perldoc.perl.org/perlmodlib), [perlmodstyle](https://perldoc.perl.org/perlmodstyle), [perlmodinstall](https://perldoc.perl.org/perlmodinstall), [perlnewmod](https://perldoc.perl.org/perlnewmod), [perlpragma](https://perldoc.perl.org/perlpragma).
- [perlpod](https://perldoc.perl.org/perlpod), [perlpodspec](https://perldoc.perl.org/perlpodspec), [perlpodstyle](https://perldoc.perl.org/perlpodstyle), [perldocstyle](https://perldoc.perl.org/perldocstyle).
- [perlobj](https://perldoc.perl.org/perlobj), [perltie](https://perldoc.perl.org/perltie), [perlclass](https://perldoc.perl.org/perlclass).

**Reference manual — security, portability, tooling**

- [perlsec](https://perldoc.perl.org/perlsec), [perlsecpolicy](https://perldoc.perl.org/perlsecpolicy).
- [perlport](https://perldoc.perl.org/perlport), [perllocale](https://perldoc.perl.org/perllocale).
- [perldebug](https://perldoc.perl.org/perldebug), [perlutil](https://perldoc.perl.org/perlutil).

**Internals and C / XS (selected)**

- [perlembed](https://perldoc.perl.org/perlembed), [perlxstut](https://perldoc.perl.org/perlxstut), [perlxs](https://perldoc.perl.org/perlxs), [perlguts](https://perldoc.perl.org/perlguts), [perlapi](https://perldoc.perl.org/perlapi).

**History, misc, community**

- [perldelta](https://perldoc.perl.org/perldelta) and version-specific `perlNNNNNdelta` pages listed under [History in perl](https://perldoc.perl.org/perl#History).
- [perlhist](https://perldoc.perl.org/perlhist), [perlcommunity](https://perldoc.perl.org/perlcommunity), [perlbook](https://perldoc.perl.org/perlbook), [perldoc](https://perldoc.perl.org/perldoc).

**Platform- and language-specific pods** — Listed under [Platform-Specific](https://perldoc.perl.org/perl#Platform-Specific) and [Language-Specific](https://perldoc.perl.org/perl#Language-Specific) in [perl](https://perldoc.perl.org/perl) (e.g. [perlwin32](https://perldoc.perl.org/perlwin32), [perllinux](https://perldoc.perl.org/perllinux)).

Read chapters **1 → 12** for the **core language** track, then **13 → 16** for **networking, databases, web serving, and XS/C**—or jump by topic if you already know the basics.

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
| 13 | [Networking, TLS, HTTP clients, and outbound glue](./13_Networking_TLS_HTTP_And_Clients.md) | Use **sockets**, **TLS**, and **HTTP** clients with correct **verification**, **timeouts**, and **SSRF** awareness. |
| 14 | [Databases, DBI, and SQL boundaries](./14_Databases_DBI_And_SQL_Boundaries.md) | Use **DBI** safely (**placeholders**, **transactions**, **errors**), tune **connections**, and avoid **injection**. |
| 15 | [Web serving: PSGI, Plack, CGI, FastCGI, `mod_perl`, and frameworks](./15_Web_PSGI_Plack_CGI_And_Frameworks.md) | Choose and operate **CGI** vs **PSGI**, deploy **Plack** apps, and review **Mojolicious** / **Dancer2** in production. |
| 16 | [XS, embedding, `FFI::Platypus`, and the C boundary](./16_XS_Embedding_And_C_Boundary.md) | Reason about **XS** **ABI**, **embedding**, **crashes**, and **FFI** vs hand-written **glue**. |

### Deep-study workflow (body-first)

1. Within each chapter, read **§1 Concepts**, then **§2 Advanced concepts**, then **§3 Applications and use cases**—that order matches how the body is written.
2. Re-read and extract invariants, failure modes, and operational constraints (context, `@INC`, encoding, subprocess boundaries).
3. Cross-link chapters: syntax and data → modules and CPAN → I/O and security → testing and operations → supply chain → **HTTP/TLS** (13) → **DBI** (14) → **web** process models (15) → **XS/C** when debugging native code (16).
4. Only then use Perldoc and MetaCPAN for exhaustive tables, edge cases, and **release-specific** behavior; pick the **same** Perl version in the browser as in production.

This keeps the handbook as the primary source while references stay optional validation.

### Part II — integration depth (chapters 13–16)

Chapters **13–16** are the **deep dive** into how Perl is used as **network client**, **database client**, **HTTP application**, and **C extension** host. They follow the same **prose-first** rule: narrative and guardrails in the chapter body, **References** for upstream POD and MetaCPAN.

**Explicitly not covered here:** **[Raku](https://www.raku.org/)** (a different language and toolchain). For **SQL dialects** and engine operations beyond **DBI** usage, use your engine docs and companion database material.

---

## References

Goals, guardrails, and narrative live in the chapters above. Everything below is **upstream** documentation and ecosystem links.

### Perldoc Browser (Perl 5.x)

- [Perldoc Browser](https://perldoc.perl.org/) — HTML manual with **search** and a **release selector** (match the interpreter you ship or debug).
- [perl](https://perldoc.perl.org/perl) — main manual; use its **GETTING HELP** outline as the map of all core pods.
- [perlintro](https://perldoc.perl.org/perlintro) — beginner orientation.
- [perldoc](https://perldoc.perl.org/perldoc) — the `perldoc` program (`-f`, `-v`, `-q`, module names, etc.).

### CLI quick reference

```bash
perldoc perl           # main manual
perldoc perlintro      # intro
perldoc -f open        # built-in function
perldoc -v '$/'       # predefined variable
perldoc -q 'password'  # FAQ keyword search
perldoc Moose          # installed module (if present on @INC)
```

### Manual table of contents (anchors on `perl`)

Fragment IDs match the live page (verified on the Perldoc Browser HTML for `perl`).

| Section | Link |
|--------|------|
| GETTING HELP | [perl#GETTING-HELP](https://perldoc.perl.org/perl#GETTING-HELP) |
| Overview | [perl#Overview](https://perldoc.perl.org/perl#Overview) |
| Tutorials | [perl#Tutorials](https://perldoc.perl.org/perl#Tutorials) |
| Reference Manual | [perl#Reference-Manual](https://perldoc.perl.org/perl#Reference-Manual) |
| Internals and C Language Interface | [perl#Internals-and-C-Language-Interface](https://perldoc.perl.org/perl#Internals-and-C-Language-Interface) |
| History | [perl#History](https://perldoc.perl.org/perl#History) |
| Miscellaneous | [perl#Miscellaneous](https://perldoc.perl.org/perl#Miscellaneous) |
| Language-Specific | [perl#Language-Specific](https://perldoc.perl.org/perl#Language-Specific) |
| Platform-Specific | [perl#Platform-Specific](https://perldoc.perl.org/perl#Platform-Specific) |
| Stubs for Deleted Documents | [perl#Stubs-for-Deleted-Documents](https://perldoc.perl.org/perl#Stubs-for-Deleted-Documents) |

### Aggregated indexes (browser)

These pages collect many pods in one place for scanning (they complement [perlfunc](https://perldoc.perl.org/perlfunc) and the rest of the reference manual).

- [perlop](https://perldoc.perl.org/perlop) — operators and precedence.
- [Functions](https://perldoc.perl.org/functions) — built-in functions (browser index).
- [Variables](https://perldoc.perl.org/variables) — specials and globals (browser index).
- [Modules](https://perldoc.perl.org/modules) — pragmata and core modules (browser index).
- [perlutil](https://perldoc.perl.org/perlutil) — utilities shipped with Perl.

### Frequently needed single pages

- [perlrun](https://perldoc.perl.org/perlrun) — command-line switches (`-0`, `-n`, `-p`, `-E`, taint `-T`, etc.).
- [perlsec](https://perldoc.perl.org/perlsec) — security model, tainting, unsafe constructs.
- [strict](https://perldoc.perl.org/strict), [warnings](https://perldoc.perl.org/warnings) — baseline pragmas for maintainable code.

### Ecosystem

- [CPAN](https://www.cpan.org/) — archive and mirror network.
- [MetaCPAN](https://metacpan.org/) — search, author pages, and dependency metadata for CPAN distributions.
- [perl.org](https://www.perl.org/) — language hub.
- [Perl Mongers (pm.org)](https://www.pm.org/) — local groups.

### Perldoc Browser maintenance

Site issues (search, rendering): [perldoc-browser issues](https://github.com/Grinnz/perldoc-browser/issues). Documentation content: [Perl/perl5 issues](https://github.com/Perl/perl5/issues) and the [perl5-porters](https://lists.perl.org/list/perl5-porters.html) list (as described in [perl](https://perldoc.perl.org/perl#NOTES)).
