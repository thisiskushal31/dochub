# Security and DevOps

[← Back to F#](./README.md)

Running F# in production or in automation involves **configuration and secrets**, **supply chain**, **error handling and logging**, and **.NET deployment** practices. This topic gives a concise guide from a security and DevOps perspective so you can deploy and operate F# and .NET systems safely.

**Configuration and secrets.** Do not put secrets in source or in config files committed to the repo. Use **environment variables**, **Azure Key Vault**, or another secrets manager and read them at runtime. In Azure, prefer **managed identity** so the app does not need stored credentials. Fail fast if required config (e.g. connection strings, API keys) is missing so misconfigurations are caught at startup. For F# and .NET, use the same configuration abstractions (e.g. **IConfiguration**, **IOptions**) as the rest of the ecosystem.

**Supply chain.** Dependencies (NuGet packages) can contain vulnerable or malicious code. Pin versions in the project file and use **dotnet restore** with a lock file or consistent feeds. Audit dependencies periodically and prefer well-maintained, widely used packages. In CI, run with pinned versions and run tests and any security checks before deploying. For compliance and security, treat the build pipeline and dependency graph as part of your threat model.

**Error handling and logging.** Use **Result** or **option** for expected failures and **try...with** for unexpected exceptions; log before re-raising or converting to a Result. Do not log secrets or PII. Use structured logging where possible. In production, set appropriate log levels and retention. Crash dumps and stack traces may contain sensitive data; restrict access and retention.

**Deployment and runtime.** Build with **dotnet publish** for a self-contained or framework-dependent deployment. Use the same runtime and SDK version in CI and production where possible. For containers, use official or trusted base images and run as a non-root user when feasible. In Azure, use App Service, Functions, or AKS with managed identity and secure config. Do not run F# Interactive or debug endpoints in production.

**Why this matters.** F# and .NET share the same runtime and ecosystem; security and DevOps practices for .NET apply to F#. Secure config, supply-chain hygiene, and safe error handling and logging reduce risk. Applying these practices helps you operate F#-based systems reliably and securely in production and in automation.

---

## Further reading

- [F# Component Design Guidelines (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/fsharp/style-guide/component-design-guidelines)
- [.NET security and deployment](https://learn.microsoft.com/en-us/dotnet/core/security/) (Microsoft Learn)
- [Documentation (fsharp.org)](https://fsharp.org/docs/)
