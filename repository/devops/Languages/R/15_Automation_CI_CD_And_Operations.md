# Automation, CI/CD, and operations

[← Back to R](./README.md)

## What this chapter covers

Running R in the real world: **GitHub Actions / GitLab CI / Jenkins** patterns, **Docker** images, **orchestrated** jobs (Airflow, Prefect, cron), **observability** (logs, metrics, row counts), and service patterns (**Plumber** APIs, **Shiny** behind reverse proxies). The focus is operability: idempotency, retries, exit codes, and runbooks.

---

## 1. Concepts

### 1. Job contract

A batch job should define: inputs, outputs, resource budget, success criteria, and failure modes. R’s default is to print and exit; production jobs should `quit(status=...)` explicitly on failure if your wrapper expects it (depends on harness).

### 2. CI as quality gate

Run: unit tests, `lintr`, and a **smoke** `Rscript` on a small fixture dataset. For packages, add `R CMD check` on the target OS images you deploy to.

### 3. Container images

Pin **base image digest** and R version. Install system dependencies required by packages (e.g. `libxml2`, `libssl`, `libgdal`) in the Dockerfile, not by trial in production.

### 4. Orchestrator integration

Pass parameters as environment variables and/or flags; write structured logs (JSON lines) if your log stack supports it.

### 5. API services with R

**Plumber** turns functions into HTTP endpoints. Treat it like any microservice: health checks, graceful shutdown, request size limits, and auth. **Shiny** is stateful; scale horizontally with sticky sessions and shared nothing or shared external state.

---

## 2. Advanced concepts

### 1. Idempotency and side effects

If a job writes to a database, make writes idempotent (merge keys) or use transactions. Retries are inevitable in cloud environments.

### 2. Resource limits and `ulimit`

Memory blowups should fail fast; k8s memory limits and local `ulimit` can surface as confusing OOM kills—log peak RSS in long jobs if allowed.

### 3. Data volume and `TMPDIR`

Large temp files should go to fast local disk; set `TMPDIR` explicitly in containers to avoid filling small root volumes.

### 4. Multi-core policy

If your job uses `parallel` AND linked BLAS threads, you can **oversubscribe CPUs**. Central policy sets thread env vars per workload type.

### 5. Blue/green for models

Model deployments benefit from traffic splitting and rollback—often coordinated outside R, but R artifacts must be versioned accordingly.

---

## 3. Applications and use cases

- **Nightly ETL + modeling:** scheduled container task with metrics exported to Prometheus/OpenTelemetry via sidecar or push gateway patterns.
- **Internal metrics API:** Plumber behind OAuth proxy for curated KPI endpoints.
- **Research automation:** CI renders reports with `renv restore` and uploads artifacts to object storage.

```bash
Rscript pipeline.R --date 2026-04-26 --env prod
```

```r
args <- commandArgs(trailingOnly = TRUE)
cat(sprintf("job_start %s args=%s\n", Sys.time(), paste(args, collapse = " ")))
```

### Staff-level review checklist

- Jobs are idempotent under retries where side effects exist.
- Containers pin R version + OS deps + lockfile restore path.
- Parallelism policy avoids BLAS/thread oversubscription.
- Production services include auth, limits, and health checks appropriate to exposure.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-admin.html
- https://www.rplumber.io/
- https://pkgs.rstudio.com/connect/
