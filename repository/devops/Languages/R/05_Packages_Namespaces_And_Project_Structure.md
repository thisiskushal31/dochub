# Packages, namespaces, and project structure

[← Back to R](./README.md)

## What this chapter covers

How R packages actually load: **`library()` versus `require()`**, **`NAMESPACE`** exports and imports, **`::`** qualification, **`Depends` / `Imports` / `Suggests`** in `DESCRIPTION`, and why **search path order** creates “function masking” incidents. This chapter also introduces **Bioconductor** as a parallel ecosystem with its own release cadence—teams doing genomics/bioinformatics treat it as a first-class dependency plane, not “just more CRAN.”

---

## 1. Concepts

### 1. Packages are versioned deployable units

An R package bundles R code, metadata (`DESCRIPTION`), compiled code (optional), documentation, tests, and namespace directives. CRAN packages must satisfy **`R CMD check`** constraints; internal packages should voluntarily meet similar standards to avoid team-scale drift.

### 2. Namespaces isolate symbols

Each package has a **namespace** environment controlling what is exported and how imported symbols are resolved. **`package::function()`** bypasses many masking surprises and makes code review easier—many organizations mandate `::` for anything security- or money-touching.

### 3. Search path and masking

`search()` shows attached packages. Two packages exporting the same name can **mask** each other depending on attach order. Startup behaviors that silently attach packages are operational hazards.

### 4. `DESCRIPTION` dependency semantics

**Imports** are loaded namespaces needed at runtime (preferred for libraries).
**Depends** loads packages onto the search path (still appears in legacy packages).
**Suggests** are optional (tests/vignettes).

Mis-declared dependencies cause “works on my laptop because I attached tidyverse manually” failures.

### 5. `NAMESPACE` directives beyond exports

You will see **`export()`**, **`import()`**, **`importFrom()`**, **`S3method()`** registrations for S3 generics, and hooks used when packages interact with **S4** (`methods` package). Incorrect namespace wiring yields “object not found” or broken dispatch at runtime even though `devtools::load_all()` seemed fine locally.

---

## 2. Advanced concepts

### 1. S3 method registration

Modern packages typically register S3 methods via **`NAMESPACE`** (`S3method(generic, class, fun)`), not only by naming `generic.class` in a file. Staff debugging includes checking whether a method is **registered and exported** as intended.

### 2. S4, Reference Classes, and R6 (where complexity enters)

**S4** offers formal classes and multiple dispatch; **`methods`** package is its home. **R6** and reference classes introduce **mutable object** patterns that feel more like OOP in other languages—useful for services, easy to abuse in analytics code if shared mutable state leaks.

### 3. Native code: `R_ext` and repair hell

Many CRAN packages compile C/C++/Fortran. That ties you to **toolchains** (Windows Rtools, macOS SDK, Linux headers) and to **CRAN’s policy** on compiled checks. For production, track **system dependencies** the same way you track R packages (containers help).

### 4. Two repositories, two lifecycles: CRAN and Bioconductor

**Bioconductor** is a separate repository and **release schedule** for bioinformatics packages. Do not mix Bioconductor and CRAN package management ad hoc: use `BiocManager::install` with a Bioconductor version aligned to your R version, and document that pin for reproducibility.

### 5. `pak`, `remotes`, and `devtools`

Teams use **`pak`** and **`remotes::install_*`** to install from Git remotes. This is powerful for internal forks and a supply-chain risk if refs are not pinned. Treat Git SHA pins like dependency versions.

---

## 3. Applications and use cases

- **Internal package:** move shared analytics helpers out of copy-paste scripts.
- **CI:** run `R CMD check` (or a lighter custom check) on internal packages.
- **HPC/bio:** pin Bioconductor release and R version together; never “latest” in regulated pipelines.

```r
# Explicit namespace at call sites (common org style for critical code)
stats::median(c(1, 2, NA), na.rm = TRUE)
```

### Staff-level review checklist

- `DESCRIPTION` dependencies match real runtime imports; no “helpful” manual attaches.
- Masking risks are mitigated with `::` and controlled `library()` order.
- Bioconductor/CRAN/Git sources are policy-controlled and pin-compatible.
- Compiled packages are covered in CI for every deployment platform.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-exts.html
- https://cran.r-project.org/doc/manuals/r-devel/R-admin.html
- https://contributor.r-project.org/
