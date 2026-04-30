# Introduction, runtime, and first scripts

[← Back to R](./README.md)

## What this chapter covers

What “running R” actually means in practice: interactive versus batch execution, how R loads startup configuration before your code sees light of day, why session state is never neutral for reproducibility, how `Rscript` differs from `R --slave` / `R --no-save` patterns, and how to build **entrypoints** that behave like real software (arguments, env vars, exit codes, logging) instead of ad-hoc notebook scripts. This is the chapter you use when a job “worked in the IDE” but **fails in cron, Airflow, or GitHub Actions** for reasons that look magical until you model the session.

---

## 1. Concepts

### 1. R as a language and a process

R is a language for **statistical computing and graphics**; the usual implementation is the **R engine** you install from CRAN (or a vendor build). In production you care about the **process model**: one R process per `Rscript` invocation unless you explicitly design long-lived processes (rare in batch analytics, common in Shiny/Plumber). Each process has its own **global environment**, **search path**, **options**, **locale**, **random number stream**, and **loaded shared libraries** (BLAS/LAPACK, system deps for packages with native code).

### 2. Invoking R: REPL, `R CMD`, and `Rscript`

Typical invocations:

- **Interactive REPL:** `R` (or the binary your OS provides) starts a read-eval-print loop. This is the natural home for exploration, not for non-interactive automation.
- **Batch script:** `Rscript path/to/job.R [args...]` is the default pattern for schedulers and containers. `Rscript` is designed to run a file without an interactive session and is what most teams standardize on.
- **Piping and one-liners:** `R -e 'expr'` (or `Rscript -e 'expr'`) is useful in ops glue. Shell quoting is a common footgun: always pass **lists of arguments** from orchestrators when possible, not giant shell-escaped strings.

`R CMD` is a different entry surface (building/installing packages, `R CMD BATCH`, `R CMD check`, etc.). Operational pipelines mainly live under `Rscript`, but release engineers live under `R CMD check`.

### 3. Startup sequence matters more than beginners expect

Before your first line of user code, R can read **site and user** configuration that alters:

- which packages are loaded or **attached** to the search path,
- `options()` defaults (for example, scipen, width, `stringsAsFactors` on older R),
- `Sys.setenv` side effects in `.Renviron`,
- default library locations via `R_LIBS`, `R_LIBS_USER`, and `.libPaths()`.

For production, treat uncontrolled startup as **untrusted input**: it can change numerics, mask functions, and inject credentials from a developer’s home directory that do not exist in CI.

### 4. What `commandArgs()` is and is not

`commandArgs()` returns the **command line** that started R, including the `Rscript` path and your script name; `trailingOnly = TRUE` is the usual way to keep only your user args. It is not a full CLI framework: for real services, use a package that parses flags and prints help (`optparse` is a common choice, or an internal standard library at your org). The important engineering property is a **documented command line contract** and **non-zero exit** on invalid input.

### 5. Environment variables you will see in real systems

**`R_HOME`** locates the R installation; **`PATH`** must include the intended R binary when multiple versions are installed. **`R_LIBS`**, **`R_LIBS_USER`**, and **`R_PROFILE`** / **`R_ENVIRON`** can redirect startup behavior. Container images should set these explicitly rather than inheriting surprising host defaults.

### 6. Options that quietly change results

`options()` can influence printing, warnings-to-errors policy, connection defaults, and numeric formatting. For pipelines that compare outputs across machines, standardize **digits**, **scipen**, **encoding**, and **warning** treatment in the entrypoint so interactive defaults cannot leak into automation.

---

## 2. Advanced concepts

### 1. Why “same code, different machine” is the default failure mode

Two machines can differ in:

- **R minor version** (language features, defaults like `stringsAsFactors`),
- **BLAS/LAPACK** (OpenBLAS vs reference vs MKL—small numeric deltas compound in optimization),
- **timezone default** (often inherited from the OS; analytics must usually pin **`TZ`** explicitly),
- **locale collation** (sorting and string equality for non-ASCII),
- **package versions** (even patch-level changes can alter edge-case behavior in modeling packages).

Staff-level practice is to treat every production run as producing a **runtime fingerprint** that you can diff against last-known-good.

### 2. Reference counting and “copy-on-modify” (why performance surprises exist)

R gives the illusion of **copy-by-value** assignment, but under the hood most assignments share underlying data until a **mutation** forces a copy. Since **R 4.0.0**, the engine has moved from the older **NAMED** heuristic toward **reference counting** for deciding when in-place mutation is safe; the practical effect is **fewer unnecessary copies** in many idioms, but **mutation inside functions** can still trigger copies when an object is shared between caller and callee.

You do not need C-level knowledge to program R, but you need the operational consequence: **large objects + in-place-looking updates** can still allocate heavily; profile memory when jobs spike.

### 3. BLAS/LAPACK and numerical parity

Linked linear algebra can yield **different rounding** on different builds. That does not mean “R is non-deterministic”; it means **floating-point equivalence across platforms is not a contract** unless you control the stack. Define tolerances for tests and for cross-environment golden outputs.

### 4. Deterministic batch entrypoints

Strong patterns:

- parse arguments first; stop with usage text if invalid,
- set `TZ` and document it in logs,
- call `sessionInfo()` once per job in debug modes,
- standardize **warnings**: optionally turn warnings into errors in CI (`options(warn = 2)`) when your pipeline treats warnings as contract violations.

### 5. Security-adjacent startup facts

`.Renviron` is a frequent place for accidental **secret persistence**. CI images should not silently mount user home directories. Prefer injecting secrets at runtime from your orchestrator and **never** echo them in `sessionInfo()` output.

---

## 3. Applications and use cases

- **Scheduled reporting:** one `Rscript` per job, explicit input paths, exit non-zero on validation failure.
- **Container jobs:** pin base image + R version; log `sessionInfo()` on failure only if logs are protected.
- **Multi-version estates:** document how analysts select R (sysadmin paths, `rig`, conda—whatever your org uses) and ensure CI uses the same selector.
- **Incident response:** compare fingerprints (R version, `sessionInfo()`, library paths) between green and red runs.

```r
args <- commandArgs(trailingOnly = TRUE)
if (length(args) < 2) {
  stop("usage: Rscript job.R <input_path> <output_path>")
}

options(stringsAsFactors = FALSE)
Sys.setenv(TZ = "UTC")

cat("runtime_start", format(Sys.time(), tz = "UTC"), "UTC\n")
print(R.version.string)
print(sessionInfo())
print(.libPaths())
```

### Staff-level review checklist

- Entrypoint defines CLI contract, failure modes, and exit codes.
- Startup files cannot mutate production behavior without review (`--vanilla` or controlled images where appropriate).
- Logs include a reproducible runtime fingerprint (at least R version, platform, library paths, timezone).
- BLAS/LAPACK and locale assumptions are documented for numerically sensitive workflows.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-intro.html
- https://cran.r-project.org/doc/manuals/r-devel/R-admin.html
- https://cran.r-project.org/doc/manuals/r-devel/R-FAQ.html
- https://cran.r-project.org/doc/manuals/r-devel/R-ints.html
