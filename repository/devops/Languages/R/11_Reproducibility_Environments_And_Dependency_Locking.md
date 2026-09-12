# Reproducibility, environments, and dependency locking

[← Back to R](./README.md)

## What this chapter covers

Reproducibility beyond “I ran it twice”: **project-local libraries**, **lockfiles**, **cache behavior**, and the reality that **renv tracks R package state but cannot magically pin OS libraries**. You will also see **rig** (install/switch R versions) discussed in R circles because teams frequently need multiple **minor R versions** aligned to CRAN/Bioconductor release matrices.

---

## 1. Concepts

### 1. What `renv` solves

The **`renv`** package provides **`renv::init()`**, project libraries, **`renv.lock`**, **`snapshot()`**, and **`restore()`**. The lockfile is JSON describing package versions and provenance fields sufficient to reinstall matching artifacts from CRAN/GitHub/Bioconductor-style sources (subject to repository availability).

Operational habit: treat **`renv.lock`** changes like dependency PRs: diff review + CI restore.

### 2. What renv does not solve

R version selection (you still need images/rig/conda policy), system libraries (GDAL, ICU, Java), external data, secrets, and nondeterminism from parallel/streaming randomness without explicit controls.

### 3. Caches and disk layout

`renv` uses a global package cache to deduplicate downloads—great for laptops, important to understand in CI where caches must be warmed intentionally.

### 4. `sessionInfo()` remains mandatory metadata

Even with renv, attach `sessionInfo()` output (or a structured equivalent) to critical artifacts for forensic diffing.

---

## 2. Advanced concepts

### 1. Bioconductor + renv alignment

Bioconductor releases map to specific R versions. If you mix branches incorrectly, `restore()` may succeed locally but fail cross-platform due to binary package differences—pin **Bioconductor version** alongside **R minor**.

### 2. GitHub remotes and supply chain

Git-sourced packages pin by commit hash fields when recorded—verify what your lockfile captured and ensure tags/branches are immutable enough for your risk appetite.

### 3. Container-first reproducibility

Many mature teams treat **Docker image digest** as the true reproducibility anchor and use renv as an inner pin within that image lineage.

### 4. Deterministic builds vs deterministic science

Reproducible numerics across CPUs may still drift slightly due to BLAS threading/order—define acceptable tolerance for “same result.”

---

## 3. Applications and use cases

- **CI:** `renv::restore()` on clean runners with cached package downloads.
- **Handoffs:** analysts ship code + lockfile; platforms ship container digest.
- **Audits:** artifact bundles include lockfile + `sessionInfo()` + data snapshot ID.

```r
# Typical workflow shape (exact commands depend on project policy)
# renv::init()
# ... work ...
# renv::snapshot()
print(sessionInfo())
```

### Staff-level review checklist

- Lockfile updates are reviewed like dependency upgrades.
- R minor version policy matches CRAN/Bioc constraints.
- CI proves `restore()` from cold cache periodically.
- Artifact metadata includes R + packages + data snapshot pointers.

---

## References

- https://cran.r-project.org/web/packages/renv/vignettes/renv.html
- https://github.com/r-lib/rig
- https://cran.r-project.org/doc/manuals/r-devel/R-admin.html
