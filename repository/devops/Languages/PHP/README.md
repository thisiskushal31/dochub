# PHP

[← Back to Languages](../README.md)

PHP is a **general-purpose** language that dominates **server-side web** programming: request handling, HTML generation, JSON APIs, and glue around databases and caches. The runtime most teams mean today is **PHP 8.x**: a **Zend Engine**–based VM with **JIT** (where enabled), **extensions** loaded as shared objects, and multiple **SAPIs** (CLI, built-in server, **FPM**, Apache module) that change how code starts, how long it lives, and what globals mean.

In **DevOps** and **platform** work you rarely author large PHP applications; you **ship**, **configure**, and **defend** them. That means **PHP-FPM** pools, **Opcache**, **Composer** lockfiles and private registries, **`php.ini`** hardening, **extension** matrices across OS images, and **observability** (slow logs, FPM status, application traces). In **security** and **application security**, PHP appears in **injection** classes (SQL, command, deserialization), **session** fixation and **cookie** policy, **file upload** abuse, and **supply-chain** risk through **Packagist** dependencies.

This handbook is **standalone prose**: each chapter explains **what** a topic is, **why** it behaves that way in production, and **how** to apply it, from first ideas through advanced mechanics and whole-engineering angles (software engineering, reliability, security, operations). Narrative is **text first**; **PHP**, **ini**, **nginx**, or **shell** snippets appear in fenced blocks only where behavior needs a concrete anchor. Optional figures live under `../../Assets/Languages/PHP/` when they add more than text alone.

**Staff / platform engineers:** PHP is still **actively** deployed at massive scale (CMS, commerce, APIs, batch workers). Framework docs assume you already understand **SAPI lifetime**, **extensions vs Composer**, **FPM/Opcache**, and **HTTP/session mechanics**. Read **[chapter 17](./17_Pre_Framework_Competency_Domains_And_Active_Ecosystem.md)** early for a **domain map**, **pre-framework competency checklist**, and **ecosystem orientation** (Composer apps vs plugin CMSs, survey context)—then chapters **01–11** before leaning on Laravel/Symfony/WordPress manuals alone.

### Chapter structure

Every numbered chapter **`01`–`21`** uses the same **three-part body** (before **`## References`**):

1. **Concepts** — definitions, syntax, and mechanics you need to read code and configs (`###` subsections under **`## 1. Concepts`**).
2. **Advanced concepts** — VM details, SAPI differences, extension ABI, concurrency limits, and interactions with the web server or database layer (**`## 2. Advanced concepts`**).
3. **Applications and use cases** — **DevOps**, **security**, **CI/CD**, **incident response**, and **migration** scenarios where the chapter’s ideas show up in real work (**`## 3. Applications and use cases`**).

Chapters are written for **depth**: opcode caching and JIT policy, INI changeability modes, FPM pool mathematics, PDO and persistent connection failure modes, Composer supply-chain mechanics, and concrete failure-mode checklists—not a syntax tutorial alone.

**References** are listed last only: URLs for readers who want exhaustive tables, edge cases, or version-specific wording. The body does not attribute facts to a named document.

### Guardrails (how this material is written)

1. **Standalone narrative** — The body explains behavior and tradeoffs directly; it does not say where each sentence was “taken from.” Deeper tables and version-specific wording live under **References** only.
2. **Text first, then code** — Prose defines the idea; fenced blocks show PHP, `ini`, nginx, shell, or JSON **only** when something concrete would otherwise stay vague.
3. **No ornamental code or images** — Sections that are purely conceptual stay prose-only. Diagrams belong under `Assets/Languages/PHP/` only when they add real structure; none are required to understand the track.
4. **Depth over tourism** — Chapters drill into failure modes (FPM queues, Opcache invalidation, PDO/proxy interactions, Composer install-time code, stream contexts) so staff can debug without guessing.

### Semantic model (why PHP feels different from Python or Go)

Four ideas unlock most reading and most production incidents:

1. **Request-scoped vs long-lived** — In **FPM**, worker processes handle many requests sequentially; **global state** persists across requests in the same worker unless you deliberately isolate. In **CLI**, one run equals one process unless you fork. Mental models from **stateless** HTTP frameworks still leak when **`static`** properties, **singletons**, or **Opcache**-cached bytecode retain data longer than a single request.

2. **Coercive vs strict typing** — PHP historically **coerces** types in many contexts. `declare(strict_types=1);` tightens **function** calls and **returns** per file. Mixed codebases and vendor packages create **boundary** surprises at callsites.

3. **Extensions are first-class** — Core language features often delegate to **extensions** (`mysqli`, `pdo_mysql`, `openssl`, `curl`). Missing or wrong **extension** builds (different from Composer packages) break deploys before application logic runs.

4. **Configuration stacks** — Behavior is the intersection of **`php.ini`**, **pool** configs (FPM), **web server** directives, **environment** variables, and **runtime** `ini_set`. “It works on my laptop” usually means a **different stack**, not a different `.php` file.

### What you can take away

- **What** PHP is as a language and runtime, and **which SAPI** you are debugging.
- **Why** teams standardize on **FPM + Opcache + Composer** and which **knobs** change security and performance.
- **How** to read **`composer.json` / `composer.lock`**, reproduce installs in **CI**, and audit **extensions** on images.
- **Where** PHP shows up in engineering: **CMS** and **framework** stacks, **APIs**, **batch** workers, and **legacy** glue—and what **reviews** should check: **superglobals**, **subprocess** calls, **upload** paths, **sessions**, and **dependency** graphs.

Suggested order: **17** (domains + ecosystem + checklist) → **1 → 12** (language, packaging, web, DB, performance) → **18 → 21** (completeness tracks: generators/reflection/wrappers/extensions) → **13 → 16** (CI, security, concurrency, frameworks/migration).

```bash
php -v
php --ini
```

The second command shows which **`php.ini`** files are loaded for that binary—essential when a setting “should” apply but does not.

---

## Chapters (what each file is for)

| # | Topic | You will be able to… |
|---|--------|----------------------|
| 1 | [Introduction: PHP runtime, SAPIs, toolchain, first script](./01_Introduction_PHP_Runtime_SAPIs_Toolchain_And_First_Script.md) | Choose the right **binary/SAPI**, read **`php.ini`** provenance, run a strict baseline script, and reason about **lifecycle**. |
| 2 | [Types, coercion, operators, and expressions](./02_Types_Coercion_Operators_And_Expressions.md) | Predict **coercion** vs **`strict_types`**, avoid comparison traps, and read **operator** behavior in real code. |
| 3 | [Control flow, functions, namespaces, and autoloading](./03_Control_Flow_Functions_Namespaces_And_Autoloading.md) | Structure code with **namespaces**, understand **Composer autoload** vs **`include`**, and trace **bootstrap** order. |
| 4 | [Arrays, strings, encoding, and serialization](./04_Arrays_Strings_Encoding_And_Serialization.md) | Handle **UTF-8**, **JSON**, and **serialization** safely; spot **deserialization** risk. |
| 5 | [Classes, objects, OOP, and modern features](./05_Classes_Objects_OOP_And_Modern_Features.md) | Read **OOP** code with **readonly**, **enums**, and **attributes**; know audit points for **magic** methods. |
| 6 | [Errors, exceptions, and production logging](./06_Errors_Exceptions_And_Production_Logging.md) | Map **error levels** to **observability**, design **exception** boundaries, and avoid leaking **stack traces**. |
| 7 | [Composer, dependencies, and reproducible builds](./07_Composer_Dependencies_And_Reproducible_Builds.md) | Use **lockfiles**, **platform** packages, **private** repos, and **CI** install patterns. |
| 8 | [Files, streams, processes, and security boundaries](./08_Files_Streams_Processes_And_Security_Boundaries.md) | Open paths and **streams** safely, invoke subprocesses without **shell injection**, and set **open_basedir** tradeoffs. |
| 9 | [Web request lifecycle, sessions, and input handling](./09_Web_Request_Lifecycle_Sessions_And_Input_Handling.md) | Trace **superglobals**, **sessions**, **cookies**, and **uploads** with a **threat** lens. |
| 10 | [Databases, PDO, SQL, and connection management](./10_Databases_PDO_SQL_And_Connection_Management.md) | Use **prepared statements**, tune **PDO** attributes, and operate **connection** pools under FPM. |
| 11 | [PHP-FPM, web servers, Opcache, and performance](./11_PHP_FPM_Web_Servers_OpCache_And_Performance.md) | Configure **pools**, **workers**, **Opcache**, and **timeouts** aligned with **nginx** or **Apache**. |
| 12 | [Testing, debugging, and profiling](./12_Testing_Debugging_And_Profiling.md) | Run **PHPUnit**-style workflows, use **Xdebug** without production leakage, and interpret **profiles**. |
| 13 | [CI, deployment, environments, and operations](./13_CI_Deployment_Environments_And_Operations.md) | Model **12-factor** config, **secrets**, **health** checks, and **runbooks** for PHP services. |
| 14 | [Security hardening, supply chain, and threat model](./14_Security_Hardening_Supply_Chain_And_Threat_Model.md) | Harden **`php.ini`**, review **dependency** and **upload** surfaces, and map **OWASP**-style failures. |
| 15 | [Concurrency, queues, and long-running workloads](./15_Concurrency_Queues_And_Long_Running_Workloads.md) | Place **fibers** and **parallel** extensions in context; design **queue workers** and **cron** safely. |
| 16 | [Frameworks, ecosystem, version migration, and use cases](./16_Frameworks_Ecosystem_Version_Migration_And_Use_Cases.md) | Navigate **Laravel** / **Symfony** / **WordPress** / **Drupal** / **commerce** stacks, plan **major** upgrades, and consolidate **use cases**. |
| 17 | [Pre-framework competency, domains, and active ecosystem](./17_Pre_Framework_Competency_Domains_And_Active_Ecosystem.md) | Use the **domain map** and **checklist** before framework docs; place **PHP in industry context** (CMS vs Composer apps, surveys). |
| 18 | [Generators, iterators, fibers, and execution patterns](./18_Generators_Iterators_Fibers_And_Execution_Patterns.md) | Use lazy iteration, delegation (`yield from`), and fiber-aware patterns without hidden memory or lifecycle bugs. |
| 19 | [Predefined variables, interfaces/classes, and reflection](./19_Predefined_Variables_Interfaces_Classes_And_Reflection.md) | Reason about `$_SERVER`/environment boundaries, reserved interfaces/classes, and reflection-heavy framework behavior. |
| 20 | [Protocols, wrappers, context options, and stream integration](./20_Protocols_Wrappers_Context_Options_And_Stream_Integration.md) | Operate PHP stream wrappers and context options safely for HTTP/TLS/filesystems in production. |
| 21 | [Extension landscape, interoperability, and production selection](./21_Extension_Landscape_Interoperability_And_Production_Selection.md) | Choose and operate native extensions (`intl`, `opcache`, `sodium`, DB drivers, async runtimes) with ABI and security discipline. |

### Deep-study workflow (body-first)

1. Read each chapter in order: **`## 1. Concepts`**, **`## 2. Advanced concepts`**, **`## 3. Applications and use cases`**.
2. Extract invariants and failure modes: **SAPI**, **worker** reuse, **strict_types** boundaries, **extension** presence, **session** storage, **SQL** parameterization.
3. Cross-link: types and OOP → Composer autoload → web input → PDO → FPM/Opcache → CI → security → workers → migration (chapter **17** maps these to roles).
4. Use the reference lists only when you need version-specific wording or exhaustive function tables; match the **PHP minor** you ship.

---

## Further reading

- [PHP Manual (English)](https://www.php.net/manual/en/index.php)
- [Composer documentation](https://getcomposer.org/doc/)
- [W3Techs — PHP usage context](https://w3techs.com/technologies/details/pl-php)
- [W3Techs — server-side language overview](https://w3techs.com/technologies/overview/programming_language/all)

---

## References

Handbook goals and guardrails live in the chapters. The links below are **optional** deep dives.

### PHP Manual (selected hubs)

- [PHP Manual (English)](https://www.php.net/manual/en/index.php)
- [Introduction to PHP](https://www.php.net/manual/en/introduction.php)
- [Installation and Configuration](https://www.php.net/manual/en/install.php)
- [Language Reference](https://www.php.net/manual/en/langref.php)
- [Security](https://www.php.net/manual/en/security.php)
- [Features (HTTP, sessions, uploads, CLI)](https://www.php.net/manual/en/features.php)
- [Function reference](https://www.php.net/manual/en/funcref.php)

### Composer

- [Composer documentation](https://getcomposer.org/doc/)
