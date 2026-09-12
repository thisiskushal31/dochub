# Security and best practices

[← Back to VB.NET](./README.md)

## What this chapter covers

**Defense and review literacy** for VB.NET on .NET: least privilege, configuration secrets, dependency hygiene, dangerous deserialization patterns, and why **`Option Strict`** is security-adjacent discipline. Default: **modern .NET** apps and libraries; call out **.NET Framework** brownfield where controls differ.

This is not a malware or evasion course. Deeper shared NuGet/testing habits: [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md). Broader C# security notes: [C# security chapter](../CSharp/20_Security_And_Best_Practices.md). Office macro defense is a different world—[VBA](../VBA/README.md).

---

## 1. Concepts

### 1. Same platform, language-specific footguns

VB.NET shares the CLR with C#: patch the **runtime**, validate **input**, and shrink **trust**. Language-specific habits still matter:

| Habit | Why security reviewers care |
|-------|-----------------------------|
| `Option Strict Off` | Silent conversions; late-bound calls hide intent |
| `Option Explicit Off` | Typos become runtime surprises |
| Late binding / `CreateObject` | Opaque COM surface (ch **14**) |
| `My.Computer` / file helpers | Easy I/O—easy path traversal if unchecked |

Treat Options as **team policy**, not personal taste.

### 2. Least privilege

| Context | Prefer |
|---------|--------|
| Windows Service | Dedicated service account; deny interactive logon; minimal ACLs |
| Desktop LOB | Do not require admin to “run normally” |
| Network / SQL | Scoped credentials or managed identity patterns—not sa |
| File shares | Share + NTFS least rights for the actual identity |

If the app only works as Administrator, that is a **finding**, not a feature.

### 3. Configuration and secrets

- Do not commit passwords, API keys, or connection strings with secrets into source control.
- Prefer environment variables, secret stores, or platform secret managers over hardcoding.
- Protect `app.config` / `appsettings.json` transforms in deployment pipelines.
- Scrub secrets from logs and exception messages shown to end users.

**Config shapes you will see**

| Shape | Typical home | Staff note |
|-------|--------------|------------|
| `app.config` / `web.config` | .NET Framework LOB | Transforms and machine overrides matter |
| `appsettings.json` (+ env-specific) | Modern .NET hosts | Do not commit production secrets |
| **User secrets** (local dev) | Developer machine only | Never a production secret store |
| Environment / vault / Key Vault | Deployed environments | Match platform; rotate |

Ceiling: recognize the shape and refuse secrets-in-repo—not a full configuration-framework course.

### 4. Dependency hygiene

NuGet is part of your **attack surface** (ch **13**):

- Pin or bound versions; restore reproducibly in CI.
- Review advisories; update with tests.
- Prefer maintained packages; minimize transitive graph weight.
- Know your private feed trust model.

Operational detail lives in [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md)—apply it to `.vbproj` the same way.

### 5. Input, output, and injection classes

Classic rules still win:

- Parameterize data access; do not concatenate SQL from user input.
- Validate paths; do not trust client-supplied full paths for server-side writes.
- Encode appropriately for the sink (HTML, command line—prefer APIs that avoid shells).
- Treat desktop path + filename inputs as hostile when the binary is widely deployed.

### 6. `Option Strict` as security-adjacent discipline

`Option Strict On` forces explicit conversions and blocks many late-bound calls unless you opt into them deliberately. That improves:

- Reviewability (call targets are clearer).
- Resistance to “stringly” COM/Office automation creeping in unnoticed.
- Maintainability when modernizing toward C# or shared libraries.

It does not replace input validation—but **Off** makes reviews slower and misses easier.

---

## 2. Advanced concepts

### 1. Deserialization caution

Untrusted data fed into powerful serializers/formatters has a long history of **remote code execution** class bugs across ecosystems. Staff habits:

- Do not deserialize untrusted payloads with legacy binary formatters.
- Prefer simple data contracts (JSON with explicit types) and validate schema.
- Treat “type name embedded in payload” features as high risk.
- Review any custom binder / type-resolving hooks as trust boundaries.

Exact API deprecations change by runtime—follow current .NET secure coding guidance in References. Goal here: **recognize the class of bug** and refuse casual patterns.

### 2. Cryptography literacy ceiling

Use platform crypto APIs correctly (TLS for transport, approved libraries for at-rest secrets). Do not invent hash-for-password schemes from blog memory—use established password-hashing APIs. Review: hard-coded IVs, home-rolled ciphers, and “encrypt” that is only Base64.

### 3. Assembly load and plugin surfaces

Dynamic load of arbitrary assemblies or scripts expands trust. If the product needs plugins: signed catalogs, restricted directories, and least privilege. Casual `Assembly.Load` from user paths is a review flag.

### 4. Framework vs modern .NET security posture

| Topic | Note |
|-------|------|
| Patching | Framework on Windows Update vs modern runtime side-by-side |
| API obsolescence | Some risky APIs are obsolete/disabled on modern .NET—brownfield may still compile them |
| TLS defaults | Do not pin ancient protocols “for that one vendor” without compensating controls |

### 5. Logging and privacy

Log enough to debug; do not log tokens, passwords, or full personal data by default. Desktop LOB often talks more than services—set retention and access on log folders.

---

## 3. Applications and use cases

| Role | “Secure enough” looks like |
|------|----------------------------|
| Maintainer | `Option Strict On`, validated inputs, no secrets in repo |
| Ops | Least-privilege service accounts; patched runtime; secret deployment path |
| Security reviewer | Package inventory, COM/P/Invoke inventory, deserialization sinks listed |
| Modernizer | Risky APIs quarantined; tests before TFM jump |

Pair with WinForms/services doors (ch **15**) when reviewing desktop persistence and service accounts.

---

## 4. Staff-level review checklist

- Require `Option Explicit On` and prefer `Option Strict On` in project defaults for maintained code.
- Scan for secrets in source, config templates, and scripts; rotate if history is dirty.
- Verify service/desktop identities run least privilege—not admin/LocalSystem by habit.
- Inventory PackageReferences and check known vulnerability process ([C# NuGet](../CSharp/18_NuGet_And_Testing.md)).
- Flag `CreateObject`, P/Invoke, and shelling out as explicit trust boundaries (ch **14**).
- Reject untrusted binary/legacy deserialization patterns; demand safer contracts.
- Ensure SQL and command construction cannot be influenced by raw concatenation of user input.
- Confirm TLS and crypto use platform defaults/APIs—not home-rolled.
- Keep error messages user-safe; send detail to protected logs only.
- Separate Office VBA macro policy questions ([VBA](../VBA/README.md)) from VB.NET application reviews.

---

## References

- [.NET security documentation](https://learn.microsoft.com/en-us/dotnet/standard/security/)
- [Secure coding guidelines for .NET](https://learn.microsoft.com/en-us/dotnet/standard/security/secure-coding-guidelines)
- [Safe storage of app secrets during development](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets)
- [Option Strict Statement](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/statements/option-strict-statement)
- [NuGet documentation](https://learn.microsoft.com/en-us/nuget/)
- [C# — NuGet and testing](../CSharp/18_NuGet_And_Testing.md)
- [C# — Security and best practices](../CSharp/20_Security_And_Best_Practices.md)
- [VBA track README](../VBA/README.md)
- [VB.NET README](./README.md)
