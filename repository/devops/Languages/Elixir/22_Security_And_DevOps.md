# Security and DevOps

[← Back to Elixir](./README.md)

This topic summarizes **security** and **DevOps** practices for Elixir applications: secure configuration and secrets, dependency and supply-chain hygiene, safe handling of input and errors, and production deployment. It applies to **application developers**, **DevOps/SRE**, and **security** roles so that Elixir systems stay maintainable, auditable, and resilient.

---

## Configuration and secrets

Never put secrets (passwords, API keys, signing keys) in source code or in committed config files. Use **environment variables** or a secrets manager and read them at runtime (e.g. in **config/releases.exs** or in **Application.start/2**). Restrict who can read env and secrets in your deployment environment. For Phoenix, **DATABASE_URL** and **SECRET_KEY_BASE** are typically set in the environment; document required vars and fail fast if they are missing in production. From a **cybersecurity** perspective, least privilege and secret rotation should be part of your runbook.

---

## Dependencies and supply chain

**Hex** is the package manager. **mix deps.get** and **mix.lock** pin versions for reproducible builds. Keep dependencies up to date and run **mix hex.audit** (or equivalent) to check for known vulnerabilities. In CI, run **mix deps.audit** or integrate with a dependency scanner. Review new dependencies for license and maintenance; prefer widely used libraries when possible. Updating deps and lockfile in a controlled way reduces supply-chain risk.

---

## Input validation and boundaries

Validate and sanitize all **external input**: HTTP params, file uploads, message payloads, and config from env or files. Use **pattern matching** and **case** to reject invalid shape or type; use **Ecto** changesets or similar for structured data. Do not trust size or format of binaries (e.g. in binary protocols or file parsing); enforce limits and validate structure to avoid DoS or injection. At boundaries (API, message queue, file), convert external data into **structs** or tagged tuples so the rest of the code assumes a validated shape. That improves both correctness and security.

---

## Errors and logging

Use **try/rescue** at boundaries when you can recover or when you must return a tagged error to the caller. Do not log secrets or PII at info level; use **Logger** metadata and levels appropriately. In production, avoid **inspect** of full structs that might contain secrets. **Let it crash** inside a service is fine when a supervisor can restart; at the outer boundary (e.g. HTTP request), catch and return a safe error response so you do not leak stack traces or internal state.

---

## Releases and production

Build **releases** with **mix release** and deploy the release artifact (not source). Use **:prod** environment and **config/releases.exs** (or **config/runtime.exs**) for runtime config; that file is executed when the release starts, so you can read env vars and fail fast if required ones (e.g. **DATABASE_URL**, **SECRET_KEY_BASE**) are missing. Do not enable **iex** or debug code in production unless for a controlled debugging session. In **distributed** setups, **ERLANG_COOKIE** must be the same on all nodes that should form a cluster; use a long, random value and keep it secret so untrusted nodes cannot join. Node names and **vm.args** (memory, distribution, etc.) should be set per environment. From a **DevOps** perspective, automate release build in CI, version the artifact, and deploy with the same config and runbook every time.

---

## Checklist (quick reference)

- [ ] No secrets in source or committed config; use env or secrets manager.
- [ ] Dependencies audited and updated; **mix.lock** in version control.
- [ ] Input validated at boundaries; invalid data rejected or sanitized.
- [ ] Logging does not expose secrets or PII; Logger level and metadata set for prod.
- [ ] Releases built in CI; production runs from release, not mix.
- [ ] Runtime config (releases.exs) documents required env vars; app fails fast if missing.
- [ ] Distributed cookie and node names configured securely when using distribution.

---

## Further reading

- [Releases — HexDocs](https://hexdocs.pm/elixir/releases.html)
- [Config — HexDocs](https://hexdocs.pm/elixir/Config.html)
- [Library guidelines — HexDocs](https://hexdocs.pm/elixir/library-guidelines.html)
