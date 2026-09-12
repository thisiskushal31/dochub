# Ecosystem, use cases, and competency map

[← Back to R](./README.md)

## What this chapter covers

Where R wins strategically: **statistics-forward workflows**, **reporting**, **research operationalization**, and **interfaces** to databases and cloud stores. Where teams commonly complement R with **Python**, **SQL/dbt**, **Spark**, or **Java services**. This chapter maps **roles** (analyst → scientist → data engineer → platform) to expected competencies and clarifies migration pathways without rewriting mathematics incorrectly.

---

## 1. Concepts

### 1. Strength clusters

- **Inference-heavy domains:** biostatistics, econometrics, social science methods built around classical frameworks.
- **Forecasting and uncertainty:** strong ecosystem for time-series thinking if workflows respect temporal validation.
- **Visualization + narrative:** ggplot ecosystem + RMarkdown/Quarto-class publishing pipelines drive adoption in consulting and research.

### 2. Coexistence architecture patterns

Common mature splits:

- **R** for modeling/reporting; **Python** for production services and orchestration,
- **dbt/SQL** for warehouse semantics; **R** consumes curated tables,
- **Spark** for massive scale feature extraction; **R** evaluates slices and diagnostics.

### 3. Community artifacts that shape engineering reality

CRAN policy encourages quality but constrains release cadence; Posit stack tooling shapes enterprise workflows; Bioconductor defines parallel ecosystem governance for life sciences.

---

## 2. Advanced concepts

### 1. Migration without fooling yourself

Rewriting R models in another language without parity tests on representative datasets tends to fail silently. Migration phases:

1. freeze semantics with tests + artifacts,
2. port computations with differential evaluation,
3. cut traffic gradually with rollback metrics.

### 2. Org competency modeling

- **Analyst:** reproducible scripts, basic testing discipline.
- **Senior analyst:** package boundaries, renv, diagnostics rigor.
- **Analytics engineer:** CI/CD, Docker, data contracts, observability.
- **Staff:** supply-chain policy, multi-team standards, incident ownership.

### 3. Vendor/runtime choices

Teams standardize on Linux containers for production even when analysts use macOS—expect numeric tolerance differences and different native deps.

### 4. “R in production” is not one thing

It might mean **scheduled reports**, **APIs**, **Shiny apps**, or **batch scoring**. Each has different failure modes; don’t import Shiny’s memory model into batch jobs or vice versa.

---

## 3. Applications and use cases

- **Regulated research:** R remains if methods and validation are built there; export is documentation + code, not vibes.
- **Revenue science:** move scoring to a controlled service; keep R for development and backtesting if desired.
- **Data journalism / policy:** emphasize uncertainty, provenance, and auditability in published outputs.

## Competency checklist

- **Language/runtime:** Rscript entrypoints, options, session discipline.
- **Data engineering:** schema, encoding, time, keys, joins, drift.
- **Modeling science:** leakage, baselines, diagnostics, intervals.
- **Reproducibility:** renv + R version + data snapshot policy.
- **Security/ops:** trust boundaries, lockfile review, job observability.

### Staff-level review checklist

- Ecosystem decisions are written down with tradeoffs and owners.
- Migration projects include differential testing and rollback metrics.
- Production patterns match the actual serving architecture (batch vs API vs app).
- Cross-language boundaries have explicit data contracts and SLAs.

---

## References

- https://cran.r-project.org/manuals.html
- https://cran.r-project.org/doc/manuals/r-devel/R-intro.html
- https://cran.r-project.org/doc/manuals/r-devel/R-lang.html
- https://cran.r-project.org/doc/manuals/r-devel/R-exts.html
- https://www.r-project.org/
