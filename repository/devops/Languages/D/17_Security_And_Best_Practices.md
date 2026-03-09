# D — Security and best practices

[← D README](./README.md)

When building and operating D applications, apply the same security and hygiene practices as for other systems languages: keep dependencies and the compiler up to date, validate input, avoid trusting user data, and follow least privilege. These practices apply across **all engineering roles**—software, DevOps, security, and systems—whether you ship D services, run tooling in pipelines, or audit native binaries. This topic summarizes what helps keep D codebases and deployments safe.

---

## Dependencies and dub

- **Pin and review:** Use **dub.selections.json** or exact versions for reproducible builds. Audit **dub.json** dependencies and prefer well-maintained packages. Run **dub build** in CI with a locked selection.
- **Supply chain:** Prefer packages from the official registry and known maintainers. Review release notes and security advisories. Minimize the dependency set.
- **Updates:** Plan regular updates of the D compiler/toolchain and dub packages; run **dub test** and integration tests after upgrades.

---

## Memory and safety

- **Use @safe where possible:** Prefer **@safe** and **@trusted** boundaries so the compiler can enforce memory safety. Limit **@system** and raw pointer use to small, reviewed modules.
- **Input and buffers:** Do not trust input (files, network, CLI). Validate and bound all sizes before array indexing or buffer operations. Use **assert** and **in** contracts for invariants in debug builds.
- **Sensitive data:** Do not log or expose secrets, tokens, or PII. Use secure storage and environment variables; avoid hardcoding credentials.

---

## Error handling and testing

- **Exceptions:** Use **try**/ **catch** for recoverable errors; do not swallow exceptions without logging. **nothrow** when you need to guarantee no throw for critical paths.
- **Unit tests:** Keep **unittest** blocks and run **dub test** in CI. Assert preconditions and postconditions where contracts are not enough.
- **Build and test:** Run **dub build** and **dub test** on every change. Use release builds for performance-sensitive deployment and ensure tests pass.

---

## Interop and deployment

- **C/C++ interop:** When calling C/C++ or exporting from D, keep the ABI stable and document ownership (who frees memory). Prefer **extern(C)** for simple APIs.
- **Least privilege:** Run services and automation with the minimum permissions required. In containers or VMs, drop capabilities and use read-only mounts where possible.
- **Runtime version:** Pin the compiler and runtime version in deployment (e.g. in Docker images) so behavior is consistent and you control when to upgrade.

---

## Further reading

- [D README](./README.md) — Topic index.
- [D language](https://dlang.org/)
- [D spec: Memory Safety](https://dlang.org/spec/memory-safe-d.html)
