# R

[← Back to Languages](../README.md)

R is a language and environment for **statistical computing** and **graphics**. In engineering organizations it appears as **batch analytics**, **research replication**, **regulated reporting**, **internal APIs** (Plumber), **interactive apps** (Shiny), and **notebook/report pipelines** (RMarkdown/Quarto-class workflows). This track teaches R as **systems work**: language semantics, data contracts, statistical workflow rigor, dependency governance, security boundaries, and operations—**not** only as a syntax tour.

---

## R versions, CRAN, and which documentation to read

R development follows **major.minor.patch** releases. The **R-release** and **R-devel** branches on CRAN are the usual reference points: **R-devel** is the development tree; your organization should pin a **supported R minor** for production and match **Bioconductor** releases if you use them (Bioconductor versions are **tied to an R version**). Online manuals are published for `r-release` and `r-devel` (for example `r-devel` manual paths are common in deep links). When you read a manual page, ensure it matches the R you run; language-level behavior and defaults can differ across minors.

**Practical policy:** record `R.version.string` in every production artifact; in CI, assert the expected **minor** version; keep a **lockfile** for packages and a **container digest** or **image version** for the system layer. Multi-R-version developer machines often use **rig**-style installers; HPC and enterprise environments may use **modules** or **conda**—standardize one story per team.

```bash
R --version
Rscript --version
Rscript -e "print(R.version); print(R.version.string); sessionInfo()"
```

---

## Chapter structure

Chapters `01`–`16` follow a consistent body shape:

1. **Concepts** (mechanics you can reason about in incidents)
2. **Advanced concepts** (internals, edge cases, cross-version behavior)
3. **Applications and use cases** (production and governance patterns)
4. **Staff-level review checklist** (what staff actually enforce in review)

**Guardrails:** body text is standalone; code appears only where it clarifies behavior; links live in each chapter’s **References** section; no internal source-map files in the learner-facing handbook.

---

## Semantic model (why R feels different from “a normal scripting language”)

- **Vectorized core:** most operations are array operations; recycling is a language feature and a footgun.
- **Attributes and S3:** `class` and friends drive method dispatch for printing, subsetting, modeling, and more.
- **Lazy promises:** function arguments are not “just values” at the call site; they are promises with evaluation rules.
- **Environments:** scoping and mutable environments underpin packages, namespaces, and closures.
- **Copy-on-modify with reference counting:** since **R 4.0.0**, reference counting refines when data can be modified in place versus copied (older **NAMED** heuristics were coarser). Memory and performance are still about **measured** behavior, not slogans.
- **Two repository worlds:** **CRAN** and **Bioconductor** are different release and compatibility planes—do not treat them as interchangeable.

---

## Beginner to advanced progression

| Phase | Chapters | Outcome |
|--------|----------|---------|
| Foundations | 01–05 | Runtime literacy, vectors/coercion, environments, structures, packages/namespaces. |
| Data and modeling core | 06–10 | I/O contracts, transforms, visualization ethics, modeling and time series discipline. |
| Production engineering | 11–15 | Reproducibility (`renv`), performance, testing, security, CI/CD and ops. |
| Strategy | 16 | Ecosystem positioning, migration, competency expectations. |

Suggested order: **01 → 10**, then **11 → 15**, then **16**.

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 1 | Introduction, runtime, and first scripts | [01](./01_Introduction_Runtime_And_First_Scripts.md) |
| 2 | Syntax, types, vectors, and coercion | [02](./02_Syntax_Types_Vectors_And_Coercion.md) |
| 3 | Control flow, functions, environments, and scoping | [03](./03_Control_Flow_Functions_Environments_And_Scoping.md) |
| 4 | Core data structures | [04](./04_Core_Data_Structures.md) |
| 5 | Packages, namespaces, and project structure | [05](./05_Packages_Namespaces_And_Project_Structure.md) |
| 6 | Import/export: CSV, Excel, JSON, XML, databases | [06](./06_Data_IO_CSV_Excel_JSON_XML_Databases.md) |
| 7 | Data transformation and reshaping | [07](./07_Data_Transformation_And_Reshaping.md) |
| 8 | Visualization engineering | [08](./08_Visualization_Engineering.md) |
| 9 | Statistical modeling fundamentals | [09](./09_Statistical_Modeling_Fundamentals.md) |
| 10 | Time series and advanced modeling patterns | [10](./10_Time_Series_And_Advanced_Modeling.md) |
| 11 | Reproducibility, environments, dependency locking | [11](./11_Reproducibility_Environments_And_Dependency_Locking.md) |
| 12 | Performance, memory, and profiling | [12](./12_Performance_Memory_And_Profiling.md) |
| 13 | Testing, quality, and code review | [13](./13_Testing_Quality_And_Code_Review.md) |
| 14 | Security and supply chain | [14](./14_Security_And_Supply_Chain.md) |
| 15 | Automation, CI/CD, and operations | [15](./15_Automation_CI_CD_And_Operations.md) |
| 16 | Ecosystem, use cases, and competency map | [16](./16_Ecosystem_Use_Cases_And_Competency_Map.md) |

---

## Deep-study workflow

1. Read each chapter with a **notebook of invariants** for your org (NA policy, ID types, factor policy, TZ policy, join cardinality checks).
2. After chapters 06–08, write **contract tests** on a real upstream extract (sanitized).
3. After chapters 09–10, run a **leakage review** on one real modeling workflow using your actual join keys and timestamps.
4. After chapters 11–15, stand up a **minimal CI job** that restores packages and runs tests on a clean runner.

---

## Further reading

- [CRAN manuals](https://cran.r-project.org/manuals.html)
- [An Introduction to R](https://cran.r-project.org/doc/manuals/r-devel/R-intro.html)
- [R Language Definition](https://cran.r-project.org/doc/manuals/r-devel/R-lang.html)
- [R Internals](https://cran.r-project.org/doc/manuals/r-devel/R-ints.html)
- [R Installation and Administration](https://cran.r-project.org/doc/manuals/r-devel/R-admin.html)
- [Writing R Extensions](https://cran.r-project.org/doc/manuals/r-devel/R-exts.html)
- [R Data Import/Export](https://cran.r-project.org/doc/manuals/r-devel/R-data.html)

---

## References (hub links)

- [The R Project](https://www.r-project.org/)
- [CRAN](https://cran.r-project.org/)
- [R FAQ](https://cran.r-project.org/doc/manuals/r-devel/R-FAQ.html)
