# Security and supply-chain considerations

[← Back to R](./README.md)

## What this chapter covers

R in security-sensitive environments: **untrusted code execution** (Shiny, Rmarkdown render farms, `source()` of external scripts), **package supply chain** (CRAN is not a signed pnpm world—integrity is process-driven), **secrets** in `.Renviron` and rendered documents, and **data exfiltration** via `readLines(url(...))` style calls. The goal is practical threat modeling, not fear.

---

## 1. Concepts

### 1. R is a full programming language

R can read files, open network connections, call system facilities through packages, and load native code. Any feature that “evaluates” external input (parsing, knit engines, `shiny` upload handlers) is a **trust boundary**.

### 2. CRAN and trust model

CRAN enforces strong policy and automated checks, but it is not a cryptographic attestation system for every artifact. Mature orgs add: **private mirrors**, **package allowlists**, **lockfiles**, and **code review** for new dependencies.

### 3. Transitive risk

A single new dependency can pull in many others. The review question is not only “is this package safe” but “what new transitive surface area appears in production?”

### 4. Secrets management

Never commit secrets. Prefer orchestrator-injected environment variables, short-lived tokens, and secret managers. Be aware that **rendered reports** and **plot objects** can leak credentials if you `print()` them or cache responses.

### 5. Reproducible attacks

If an attacker can change your `renv.lock` in a pull request, they can shift you to a malicious fork—treat lockfile changes as high sensitivity.

---

## 2. Advanced concepts

### 1. `install.packages` from arbitrary repos

Point repositories to trusted mirrors; pin SSL; in high-assurance settings, **airgap** package drops and internal scanning.

### 2. HTML widgets and JavaScript

Some R packages include JS dependencies; supply chain extends into **npm**-like concerns indirectly. Web-exposed R services (Plumber, Shiny) also bring standard web app risks: CSRF, auth, and SSRF if you build HTTP clients on user input.

### 3. `system()` and friends

If your code ever calls out to the shell, you inherit shell injection issues. Ban ad-hoc `system(paste(...))` with user content; use safe argument vector patterns or avoid shelling out.

### 4. Serialized data

`readRDS` can execute code paths in some historical footguns; treat untrusted RDS as untrusted input. Prefer **JSON/Parquet** for cross-team boundaries with explicit schema validation.

### 5. Log redaction

Logging `sessionInfo()` is good; logging full data frames is not. Build redaction rules for PII/PHI.

---

## 3. Applications and use cases

- **Regulated analytics:** internal CRAN-like mirror, lockfile review, no open internet on production runners.
- **Shiny/Plumber services:** standard web hardening, authn/z, rate limits, input validation.
- **Research collaboration:** quarantine untrusted Rmd until reviewed.

```r
token <- Sys.getenv("API_TOKEN", unset = NA_character_)
if (is.na(token) || !nzchar(token)) stop("API_TOKEN not set")
```

### Staff-level review checklist

- Trust boundaries for code execution and rendering are explicit.
- Dependency additions require security review and lockfile approval.
- Secrets never appear in git, logs, or rendered artifacts.
- Network egress from R jobs is controlled and monitored.

---

## References

- https://cran.r-project.org/doc/manuals/r-devel/R-admin.html
- https://owasp.org/
- https://rstudio.github.io/renv/
