# Crystal — Security and best practices

[← Crystal README](./README.md)

When operating or deploying Crystal applications, apply the same security and hygiene practices as for other languages: keep dependencies and the compiler up to date, avoid trusting user input, and follow least privilege. This topic summarizes practices that help keep Crystal codebases and deployments safe.

---

## Dependencies and Shards

- **Pin and review:** Use **shard.lock** so installs are reproducible. Periodically run **shards update** and review changes; prefer minimal version ranges in **shard.yml** so you control when you take new versions.
- **Supply chain:** Prefer well-maintained Shards and known sources (e.g. official or organization repos). Audit new dependencies before adding them.
- **Vulnerabilities:** There is no central CVE database for Shards; check issue trackers and release notes for the libraries you use.

---

## Input and output

- **Validate and sanitize:** Do not trust input (HTTP, CLI, files). Validate and sanitize before use; use parameterized queries or safe APIs for databases.
- **Errors and logging:** Avoid leaking internal details in error messages returned to users. Log sensitive data only when necessary and with appropriate controls.

---

## Build and deployment

- **Release build:** Use **crystal build --release** for production so optimizations are enabled and debug symbols are not shipped by default.
- **Minimal image:** In containers, use a minimal base image and only the built binary (and any required libraries) so the attack surface is small.
- **Static linking:** Where supported, static linking can reduce dependency on the host environment; verify that you are not shipping unwanted libraries.

---

## Code and operations

- **Coding style:** Follow the language conventions (e.g. naming, formatting) so code is consistent and reviewable. Use **crystal tool format** for formatting.
- **Testing and CI:** Run **crystal spec** in CI on every change. Run with **--release** occasionally to catch release-specific issues.
- **Compiler version:** Pin the Crystal version in CI and deployment (e.g. in Docker or CI config) so builds are reproducible and you control when to upgrade.
- **Supply chain:** Prefer well-maintained Shards and known sources; there is no central CVE database for Crystal shards, so track issues and releases for your dependencies.

---

## Further reading

- [Crystal README](./README.md) — Topic index.
- [Crystal conventions: Coding style](https://crystal-lang.org/reference/conventions/coding_style.html)
