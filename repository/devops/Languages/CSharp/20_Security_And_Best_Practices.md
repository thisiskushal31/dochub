# C# — Security and best practices

[← C# README](./README.md)

When building and operating C# and .NET applications, apply the same security and hygiene practices as for other languages: keep dependencies and the runtime up to date, validate input, avoid trusting user data, and follow least privilege. This topic summarizes practices that help keep C# codebases and deployments safe.

---

## Dependencies and NuGet

- **Pin and review:** Use explicit or bounded package versions and **dotnet list package** to audit. Run **dotnet restore** in a reproducible way (e.g. in CI). Prefer packages from known publishers and check vulnerability databases.
- **Supply chain:** Prefer well-maintained packages and minimal dependency sets. Review release notes and security advisories for the packages you use.
- **Updates:** Plan regular updates of the .NET runtime and SDK and of NuGet packages; test after upgrades.

---

## Input and output

- **Validate and sanitize:** Do not trust input (HTTP, files, CLI). Validate and sanitize before use; use parameterized queries or ORMs correctly for database access. Avoid building SQL or commands from concatenated user input.
- **Sensitive data:** Do not log or expose secrets, tokens, or PII in plain text. Use secure storage and configuration (e.g. Azure Key Vault, environment variables) and avoid hardcoding credentials.

---

## Code and operations

- **Async and disposal:** Use **async/await** for I/O and **using** or **await using** for disposable resources so connections and streams are released promptly.
- **Error handling:** Do not expose internal details in error messages returned to users. Log exceptions with sufficient context for debugging; avoid catching and ignoring without logging.
- **Least privilege:** Run services and automation with the minimum permissions required. In Azure, use managed identities and scoped RBAC instead of broad roles where possible.

---

## Build and deployment

- **Build and test:** Run **dotnet build** and **dotnet test** in CI on every change. Use **--configuration Release** for production builds.
- **Runtime version:** Pin the .NET runtime version in deployment (e.g. in Docker images or host configuration) so behavior is consistent and you control when to upgrade.

---

## Further reading

- [C# README](./README.md) — Topic index.
- [.NET security](https://learn.microsoft.com/en-us/dotnet/standard/security/)
- [Secure coding guidelines](https://learn.microsoft.com/en-us/dotnet/standard/security/secure-coding-guidelines)
