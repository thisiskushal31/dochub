# Security and DevOps

[← Back to Erlang](./README.md)

Running Erlang in production involves **configuration**, **distribution security**, **input validation**, **supply chain**, and **operational hardening**. This topic gives a concise guide from a security and DevOps perspective so you can deploy and harden BEAM systems safely.

**Configuration and secrets.** Do not put secrets in source or in `sys.config` in the repo. Use **environment variables** or a secrets manager and read them at runtime (e.g. in the application start or in a config provider). Rebar3 and releases support `config_provider` and overlays so you can inject config from the environment. Fail fast if required config (e.g. database URL, distribution cookie) is missing so that misconfigurations are caught at startup.

**Distribution security.** Erlang distribution is **not** encrypted by default. Anyone who can reach the distribution port and guess or obtain the **magic cookie** can join the cluster and execute code on the node. For production: (1) use a **strong, random cookie** (e.g. from `crypto:strong_rand_bytes/1` encoded); (2) use **TLS for distribution** so traffic is encrypted and authenticated; (3) restrict network access (firewall, VPC) so only intended nodes can connect. The SSL application and the EEF Secure Coding and Deployment Hardening guidelines describe how to set up TLS distribution.

**Cookie handling.** Set the cookie via `-setcookie` in `vm.args` (or equivalent) or via environment; avoid default cookies and do not commit cookies to version control. All nodes that must form a cluster must share the same cookie (or use per-node cookie setup with care). The cookie is used during connection setup; if it does not match, the connection is rejected.

**Input and boundaries.** Validate and sanitise at process and system boundaries. Use pattern matching and guards to reject bad data. For file paths, avoid using user input directly; use safe path handling to prevent directory traversal. For network input, parse with the bit syntax or trusted libraries and enforce size and structure limits. Do not create atoms from arbitrary user input (atom table is not garbage-collected and can be exhausted).

**Supply chain.** Dependencies (Rebar3, Hex) can contain malicious or vulnerable code. Pin versions, use lock files, and periodically audit. Prefer well-maintained, widely used libraries. In CI, run with locked deps and run tests and any security checks before deploying. For cybersecurity and compliance, treat dependency and build pipeline integrity as part of your threat model.

**Releases and runtime.** Build **releases** for production so the node runs without a full Erlang install and with a fixed set of applications. Do not start an interactive shell (e.g. `rebar shell`) in production; use **remote shell** only over a secure channel and with access control. Set **VM flags** (e.g. `+A`, `+K`, environment variables for limits) as needed for the environment. Understand boot scripts and code loading (embedded vs interactive) when creating target systems.

**Logging and errors.** Do not log secrets or PII. Crash dumps and error reports may contain sensitive data; restrict access and retention. Use structured logging where possible and ensure log levels are appropriate for production. In security-sensitive contexts, treat logs as part of your data handling and retention policy.

**EEF guidelines.** The Erlang Ecosystem Foundation’s **Secure Coding and Deployment Hardening** document gives detailed, up-to-date recommendations for writing and running BEAM applications securely. Use it as the main reference for security hardening alongside the official Erlang/OTP documentation on SSL distribution, vm.args, and release handling.

---

## Further reading

- [EEF Secure Coding and Deployment Hardening](https://security.erlef.org/secure_coding_and_deployment_hardening/)
- [Distributed Erlang](https://www.erlang.org/doc/system/distributed) (security, cookies)
- [Creating and Upgrading a Target System](https://www.erlang.org/doc/system/create_target)
- [Rebar3](https://rebar3.org/) (releases, config)
