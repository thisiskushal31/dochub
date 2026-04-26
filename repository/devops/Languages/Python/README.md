# Python

[← Back to Languages](../README.md)

Python is a **high-level**, **dynamically typed** language with a **reference-counting** CPython implementation (the default “Python” for most teams), a large **standard library**, and a **PyPI** ecosystem used across **web services**, **data and ML**, **automation**, **CLI tooling**, **embedded glue**, and **infrastructure** code. Execution semantics—**import** time, **global interpreter lock** effects, **async** versus **threading**, and **packaging** boundaries—matter as much as syntax when you ship or review systems.

This section is written as **whole-engineering** material: **language and runtime behavior**, **software design** and **maintainability**, **security** (supply chain, injection, unsafe deserialization), **reliability**, **testing and quality**, **operations** (reproducible environments, containers, CI), and **domain fit** (APIs, batch jobs, notebooks, plugins)—not only “scripts for DevOps.” Platform engineers still touch Python constantly in **CI**, **IaC helpers**, **Kubernetes operators**, and **glue**; application teams ship **Django**, **FastAPI**, **Flask**, and **internal services** in the same language, so a shared baseline reduces friction.

**Engineering domains this track touches:** interpreter and **import** system; **types** and gradual typing; **data structures** and algorithmic idioms; **I/O** and **Unicode**; **exceptions** and **resource** management; **object model** and **protocols**; **stdlib** surfaces for OS and network tasks; **venv/pip** and **lockfile-style** reproducibility; **concurrency** (GIL, threads, processes, asyncio); **security** reviews; **testing and observability** hooks; **packaging** and **delivery**; **ecosystem** orientation (frameworks, data stack).

### Python versions and documentation

The language evolves by **major** and **minor** releases: syntax (e.g. **`match`**, **`async`/`await`**), **stdlib** additions, and **typing** features are tied to a **minimum** version in **`pyproject.toml`** or policy docs. **CPython**’s **bugfix** and **security** support windows determine how long you can stay on a minor in production before upgrade pressure. Unqualified **`docs.python.org/3/...`** tracks the **current stable** Python 3 docs; for an interpreter you actually run, **`docs.python.org/3.N/...`** matches **`sys.version_info`** and avoids surprises when reading behavior tables. **Python 2.7**-era codebases still appear in operations and legacy services; that line is **frozen** and must not be the target for new design, but staff still need literacy for migration and incident triage.

Authoring link inventories (including **per-minor** doc roots and **2.7** hubs) live under **`DevOps-Handbook-Source`** for scrape passes; the learner-facing handbook does not depend on that tree.

The handbook is **standalone prose**: each chapter explains **what** a topic is, **why** it behaves that way, and **how** to apply it. Narrative is **text first**; **Python**, **shell**, **toml**, or **ini** appear in fenced blocks only where they anchor behavior. Optional figures live under `../../Assets/Languages/Python/`.

### Chapter structure

Every numbered chapter **`01`–`18`** uses the same **three-part body** (before **`## References`**):

1. **Concepts** — definitions and mechanics (`## 1. Concepts`).
2. **Advanced concepts** — interactions with the runtime, performance, or security model (`## 2. Advanced concepts`).
3. **Applications and use cases** — software engineering, security, data boundaries, operations, and migration scenarios (`## 3. Applications and use cases`).

**References** at chapter ends list official documentation and other stable URLs for readers who want exhaustive detail. The body does not attribute facts to a named document.

### Guardrails (how this material is written)

1. **Standalone narrative** — No phrases like “according to site X” in the body; deeper reading is under **References** only.
2. **Text first, then code** — Prose defines the idea; code illustrates it.
3. **No ornamental code or images** — Purely conceptual sections stay prose-only.
4. **Depth** — Failure modes (import shadowing, GIL contention, pickle risks, naive async) are called out explicitly.

### Beginner → advanced progression

| Phase | Chapters | Outcome |
|--------|----------|---------|
| Foundation | 01–08 | Read and write idiomatic Python; reason about imports, types at runtime, exceptions, and OOP. |
| Libraries & packaging | 09–12 | Navigate stdlib for ops and app tasks; own venv/pip; handle float/decimal correctly. |
| Engineering & production | 13–17 | Typing, concurrency, security, testing, CI/packaging. |
| Ecosystem & roles | 18 | Map frameworks and domains to language competencies. |

Suggested order: **01 → 12** (language + stdlib + environments + numeric correctness) → **13 → 17** (typing, concurrency, security, testing, delivery) → **18**. Revisit **14** when profiling shows CPU-bound vs I/O-bound bottlenecks.

### Alignment with the official tutorial (topics 1–16)

The [Python Tutorial](https://docs.python.org/3/tutorial/index.html) maps to this track as follows: **sections 1–2** (interpreter, encoding) → **01**; **section 3** (calculator intro, first steps) → **02–03**; **section 4** (control flow, functions, match) → **03**; **section 5** (data structures) → **04**; **section 6** (modules, packages) → **05**; **section 7** (I/O, JSON) → **06**; **section 8** (exceptions) → **07**; **section 9** (classes, iterators, generators) → **08**; **sections 10–11** (stdlib tours) → **09–10**; **section 12** (venv, pip) → **11**; **section 13** (what next) → **18**; **section 14** (interactive editing) → **01**, **16** (operational tips); **section 15** (float) → **12**; **section 16** (appendix, interactive mode) → **01**. The [Standard Library](https://docs.python.org/3/library/index.html), [Language Reference](https://docs.python.org/3/reference/index.html), [Extending/Embedding](https://docs.python.org/3/extending/index.html), [C API](https://docs.python.org/3/c-api/index.html), and [Glossary](https://docs.python.org/3/glossary.html) are linked from each chapter’s **References** and from **Further reading** below—no separate scrape folder in the handbook.

```bash
python3 -V
python3 -c "import sys; print(sys.executable)"
```

The second line confirms **which interpreter** runs when multiple Python installs exist—essential for “wrong venv” incidents.

---

## Chapters (what each file is for)

| # | Topic | You will be able to… |
|---|--------|----------------------|
| 1 | [Introduction: Python, CPython, interpreter, and first steps](./01_Introduction_Python_CPython_Interpreter_And_First_Steps.md) | Explain **what runs** your code, use **`-m`**, **shebangs**, and **source encoding** safely. |
| 2 | [Numbers, text, bytes, Unicode, and core semantics](./02_Numbers_Text_Bytes_Unicode_And_Core_Semantics.md) | Choose **str** vs **bytes**, avoid **Unicode** pitfalls, and reason about **truthiness** and operators. |
| 3 | [Control flow, functions, match, parameters, and style](./03_Control_Flow_Functions_Match_Parameters_And_Style.md) | Use **match**, parameter kinds, **scopes**, and PEP 8–aware style in reviews. |
| 4 | [Data structures, comprehensions, and algorithmic idioms](./04_Data_Structures_Comprehensions_And_Algorithmic_Idioms.md) | Use **list/dict/set** operations, **comprehensions**, and complexity-aware patterns. |
| 5 | [Modules, packages, import system, and `__main__`](./05_Modules_Packages_Import_System_And_Main.md) | Debug **import** failures, layout **packages**, and run modules with **`python -m`**. |
| 6 | [I/O, formatting, files, encodings, and JSON](./06_IO_Formatting_Files_Encodings_And_JSON.md) | Format safely, read/write text and binary, use **`pathlib`**, exchange **JSON** with clear boundaries. |
| 7 | [Errors, exceptions, context managers, and cleanup](./07_Errors_Exceptions_Context_Managers_And_Cleanup.md) | Design **exception** boundaries, use **`with`**, chain and group exceptions for observability. |
| 8 | [Classes, protocols, iterators, and generators](./08_Classes_Protocols_Iterators_And_Generators.md) | Model with **classes**, customize **iteration**, write **generators** without subtle leaks. |
| 9 | [Standard library I: OS, CLI, text, time, net, quality](./09_Standard_Library_Part_I_OS_CLI_Text_Time_Net_Quality.md) | Apply **os/sys**, **argparse**, **re**, **datetime**, **urllib**, compression, **doctest** patterns. |
| 10 | [Standard library II: formatting, threading, logging, decimal](./10_Standard_Library_Part_II_Formatting_Threading_Logging_Decimal.md) | Use **logging**, **threading** basics, **struct**, **decimal**, **itertools**, **weakref** appropriately. |
| 11 | [Virtual environments, pip, and reproducible dependencies](./11_Virtual_Environments_Pip_And_Reproducible_Dependencies.md) | Create **venv**, pin dependencies, and align **CI** with production installs. |
| 12 | [Floating-point limitations and decimal arithmetic](./12_Floating_Point_Limitations_And_Decimal_Arithmetic.md) | Explain **binary float** error, use **Decimal** for money and auditing. |
| 13 | [Type hints, protocols, and static analysis](./13_Type_Hints_Protocols_And_Static_Analysis.md) | Apply **gradual typing**, **Protocol**, and toolchains (**mypy**/ruff) in real repos. |
| 14 | [Concurrency: GIL, threading, asyncio, multiprocessing](./14_Concurrency_GIL_Threading_Asyncio_And_Multiprocessing.md) | Pick **threads** vs **async** vs **processes** from workload shape and operational constraints. |
| 15 | [Security, unsafe patterns, and supply chain](./15_Security_Unsafe_Patterns_And_Supply_Chain.md) | Block **pickle**/YAML/**eval** footguns, harden **subprocess**, audit **dependencies**. |
| 16 | [Testing, debugging, and profiling](./16_Testing_Debugging_And_Profiling.md) | Structure **pytest**-style tests, debug effectively, profile CPU and memory. |
| 17 | [Packaging, CI, containers, and operations](./17_Packaging_CI_Containers_And_Operations.md) | Use **pyproject.toml**, ship containers, wire **health** checks and config. |
| 18 | [Ecosystem, domains, and competency map](./18_Ecosystem_Domains_And_Competency_Map.md) | Place **Django/FastAPI/Flask**, **data tools**, and **automation** in a single competency frame. |

### Deep-study workflow

1. Read **`## 1` → `## 2` → `## 3`** in each chapter before jumping to References.
2. Build a personal checklist: **imports**, **encoding**, **float vs Decimal**, **GIL**, **async** blocking, **pickle** boundaries.
3. Cross-link: types (02) → data structures (04) → imports (05) → I/O (06) → exceptions (07) → concurrency (14) → security (15).

---

## Further reading

- [The Python Tutorial](https://docs.python.org/3/tutorial/index.html)
- [The Python Standard Library](https://docs.python.org/3/library/index.html)
- [The Python Language Reference](https://docs.python.org/3/reference/index.html)
- [Extending and Embedding Python](https://docs.python.org/3/extending/index.html)
- [Python/C API Reference](https://docs.python.org/3/c-api/index.html)
- [Glossary](https://docs.python.org/3/glossary.html)
- [Status of Python versions](https://devguide.python.org/versions/)
- [Python downloads](https://www.python.org/downloads/)

---

## References (hub links)

Handbook chapters end with focused URLs. Hubs for self-study:

- [Tutorial](https://docs.python.org/3/tutorial/index.html)
- [Library reference](https://docs.python.org/3/library/index.html)
- [Language reference](https://docs.python.org/3/reference/index.html)
- [Installing Python modules](https://docs.python.org/3/installing/index.html)
- [Python Packaging User Guide](https://packaging.python.org/)
- [Status of Python versions](https://devguide.python.org/versions/)
