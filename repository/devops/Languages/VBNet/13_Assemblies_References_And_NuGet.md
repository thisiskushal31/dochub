# Assemblies, references, and NuGet

[← Back to VB.NET](./README.md)

## What this chapter covers

How **VB.NET projects** become **assemblies**, how **project references** and **PackageReference** pull in other code, and how **NuGet restore** fits everyday build and CI literacy. Default narrative: **modern .NET SDK-style** `.vbproj` files. Brownfield **.NET Framework** projects still show up in Windows estates—treat their reference model as the same ideas with older tooling.

Broader NuGet workflows, vulnerability scanning habits, and test-project patterns live primarily in the [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md) chapter. SDK install and `dotnet` CLI basics: [C# environment setup](../CSharp/2_Environment_Setup_And_DotNet_SDK.md). This chapter is the **VB-facing assembly and dependency map**.

---

## 1. Concepts

### 1. Assembly = deployable unit of managed code

An **assembly** is typically a `.dll` or `.exe` produced by the compiler: IL, metadata, and (for apps) an entry point. VB.NET and C# both compile to the same kind of assembly. Namespaces organize types *inside* assemblies; **references** are decided at the **assembly / project** boundary.

Mental model:

> Project → compile → assembly.  
> Other projects / packages → referenced assemblies.  
> Runtime loads what your code actually uses (plus transitive graph).

Staff who already know C# assemblies are not learning a second platform—only VB project files and idioms.

### 2. ProjectReference vs PackageReference

| Kind | What it is | When you see it |
|------|------------|-----------------|
| **ProjectReference** | Build-time link to another project in the solution | Internal libraries, shared domain code |
| **PackageReference** | NuGet package id + version in the project file | Third-party or shared internal packages |
| Framework / SDK refs | Implied by `TargetFramework` / SDK | BCL, ASP.NET, WinForms packs, etc. |

SDK-style projects keep dependencies **visible in the `.vbproj`**. That is a review gift: you can audit without hunting opaque `packages.config` trees—though brownfield Framework apps may still use the older layout.

Illustrative shape (not a package menu):

```xml
<ItemGroup>
  <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
  <ProjectReference Include="..\MyApp.Core\MyApp.Core.vbproj" />
</ItemGroup>
```

### 3. Restore, build, and “why CI failed”

**Restore** resolves the package graph and downloads assets into the local cache / `obj` graph. **Build** compiles against the resolved references.

Common staff vocabulary:

| Command / idea | Role |
|----------------|------|
| `dotnet restore` | Resolve PackageReferences (often implicit in `build`) |
| `dotnet build` | Compile; restore usually runs first |
| `dotnet list package` | Inventory direct (and optionally transitive) packages |
| Lock / pinned versions | Reproducible CI vs floating ranges |

If restore fails, treat it as a **supply-chain / feed / version** problem before blaming VB syntax. If build fails with “type not found,” check **missing reference**, **wrong TFM**, or **API that does not exist on that target**.

### 4. Strong-name literacy (not a crypto course)

**Strong naming** signs an assembly with a key so the runtime can identify a specific publisher identity for that assembly name/version. You will see it in older Framework libraries, GAC-oriented designs, and some enterprise policies.

Staff takeaways:

- Strong name is **identity**, not a substitute for **code review**, **least privilege**, or **secret hygiene**.
- Losing or rotating keys is an **ops/process** event; do not invent ad-hoc key sharing in chat.
- Modern .NET apps often care more about **NuGet authenticity, signing of packages, and CI provenance** than GAC strong-name theater—know both vocabularies for brownfield reviews.

### 5. Multi-targeting notes

A project may list multiple **Target Framework Monikers** (TFMs), e.g. `net8.0` and `net48`, when one library must serve modern and Framework consumers.

| Concern | Staff habit |
|---------|-------------|
| `#If NET` / API availability | Feature sets differ by TFM |
| Conditional PackageReference | Package only on frameworks that need it |
| Test matrix | Build/test each TFM in CI if you claim support |
| Honest scope | Multi-target is cost; prefer one TFM when possible |

VB syntax for conditional compilation exists; the *decision* is product and platform—not “more TFMs look senior.”

### 6. VB project file literacy vs C#

| Topic | VB track | Deeper shared .NET |
|-------|----------|--------------------|
| `.vbproj`, `RootNamespace`, Option defaults | Here | [C# SDK setup](../CSharp/2_Environment_Setup_And_DotNet_SDK.md) |
| PackageReference / restore / tests | Overview here | [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md) |
| Language Options (`Strict` / `Explicit`) | Earlier VB chapters | Security-adjacent discipline in ch **16** |

---

## 2. Advanced concepts

### 1. Transitive dependencies and surprise surface

You depend on A; A depends on B and C. Your app’s **attack and update surface** includes B and C even if you never `Imports` them. Review habits:

- Prefer **minimal** direct packages.
- Know how to list **transitive** packages in your toolchain.
- Treat “we only use one helper” as incomplete if the helper pulls a large graph.

### 2. Framework-dependent vs self-contained publish

Publishing choices change what ops installs:

| Mode | Idea | Ops angle |
|------|------|-----------|
| Framework-dependent | App + shared runtime on machine | Patch runtime centrally; smaller publish |
| Self-contained | Runtime bundled with app | Larger artifacts; per-app runtime versions |
| Single-file (door) | One primary executable payload | Convenient distribute; watch extract/debug and native/COM assumptions |
| ReadyToRun / trimming (door) | Faster startup / smaller size | Reflection, COM, and some serializers can break if trimmed aggressively |

Neither replaces secure config or dependency hygiene. Prefer documented `dotnet publish` profiles checked into the repo over tribal “publish from the designer PC” steps. See [C# track overview](../CSharp/README.md) for broader .NET deployment literacy.

### 3. Testing door (`dotnet test` from VB)

The same test runners used for C# work for VB: create a test project (xUnit / NUnit / MSTest templates when available with `-lang VB`), `ProjectReference` the library under test, and run:

```bash
dotnet test
```

Staff ceiling here: prove CI runs **`dotnet test`** on the VB solution. Deeper patterns (test doubles, coverage gates, snapshot policy) live in [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md)—apply them to `.vbproj` the same way.

### 4. Assembly binding redirects (Framework brownfield)

.NET Framework apps sometimes need **binding redirects** when different packages want different versions of the same assembly. Modern SDK-style multi-targeting reduces how often you hand-edit this—but LOB WinForms/services on Framework still hit it. Symptom: works on one machine, fails on another with load errors. Fix path: consistent restore, aligned versions, documented redirects—not “copy DLLs into bin by hand” as architecture.

### 5. InternalsVisibleTo and friend assemblies

Exposing internals to a test assembly is common. Review smell: broad friend lists to production apps, or shipping test-friend attributes into release builds without intent. Keep friend assemblies **named and justified**.

---

## 3. Applications and use cases

| Scenario | What “good” looks like |
|----------|------------------------|
| Internal VB class library | Clear ProjectReferences; one TFM unless forced |
| LOB app with JSON/HTTP helpers | PackageReference pinned; restore in CI |
| Shared package consumed by C# and VB | Same assembly metadata story; language-agnostic package |
| Brownfield Framework WinForms | Document packages.config vs PackageReference; plan migrate |
| Security review of a VB solution | Package inventory + strong-name policy understanding + no secrets in project |

Wrong hammer: treating NuGet as a dump of blog snippets without ownership of versions or licenses.

---

## 4. Staff-level review checklist

- Confirm every PackageReference is intentional, version-pinned or bounded, and justified in the PR/description.
- Prefer ProjectReference for first-party code you build together; prefer packages for versioned shared contracts.
- Run restore in CI the same way prod/build agents do—no “it works on my machine” private feeds without docs.
- Inventory transitive packages for high-risk or abandoned dependencies.
- Treat strong-name keys as secrets/process assets; do not commit private keys to the repo.
- For multi-targeting, verify each TFM builds and that `#If` / package conditions match claimed support.
- Reject hand-copied DLLs beside the project as a substitute for restore when PackageReference exists.
- Cross-check deeper NuGet/testing expectations against the [C# NuGet chapter](../CSharp/18_NuGet_And_Testing.md).
- Keep `Option Strict` / project defaults aligned with team policy (see ch **16**)—weak typing hides dependency misuse.
- Document Framework vs modern .NET TFM honestly for ops (runtime install, binding redirects, publish mode).
- CI runs `dotnet test` (or equivalent) for VB libraries you claim to maintain.
- Publish mode (FDD / SCD / single-file) is documented for ops—not only “Build → Publish” folklore.

---

## References

- [Visual Basic documentation (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
- [.NET project SDKs](https://learn.microsoft.com/en-us/dotnet/core/project-sdk/overview)
- [NuGet documentation](https://learn.microsoft.com/en-us/nuget/)
- [Assemblies in .NET](https://learn.microsoft.com/en-us/dotnet/standard/assembly/)
- [Strong-named assemblies](https://learn.microsoft.com/en-us/dotnet/standard/assembly/strong-named)
- [.NET application publishing](https://learn.microsoft.com/en-us/dotnet/core/deploying/)
- [Unit testing in .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)
- [C# — Environment setup and .NET SDK](../CSharp/2_Environment_Setup_And_DotNet_SDK.md)
- [C# — NuGet and testing](../CSharp/18_NuGet_And_Testing.md)
- [C# track README](../CSharp/README.md)
- [VB.NET README](./README.md)
