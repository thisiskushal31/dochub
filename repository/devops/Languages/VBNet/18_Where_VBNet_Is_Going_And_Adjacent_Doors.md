# Where VB.NET is going and adjacent doors

[← Back to VB.NET](./README.md)

## What this chapter covers

Where VB.NET work actually lives, how the language’s future usually plays out in enterprises, what you can already do after chapters **00–17**, and **what to learn next**—with concrete starting steps, role-based paths, and common wrong turns.

You should leave able to **maintain and review** VB.NET estates **and** pick a next skill without pretending every problem is another `.vb` form.

---

## 1. Concepts

### 1. What this track already owns

| You can… | Where it was built |
|----------|--------------------|
| Treat VB as a .NET language (not VBA) | Track intro + language spine |
| Build/restore SDK-style VB projects | Early chapters + **13** |
| Reason about assemblies and NuGet | **13** (+ [C# NuGet](../CSharp/18_NuGet_And_Testing.md)) |
| Review COM / P/Invoke safely | **14** |
| Recognize WinForms and Windows Services | **15** |
| Apply security hygiene and Strict discipline | **16** |
| Map roles and “done” definitions | **17** |

This track’s scope is **VB language + project/runtime literacy + Windows LOB doors + defense review**. It is not a WinForms designer encyclopedia, not Office macro mastery, and not the entire BCL catalog.

### 2. Where VB.NET usually goes (today)

```text
Most common homes
  ├─ Windows LOB WinForms (internal tools, shop-floor, back-office)
  ├─ Windows Services / always-on jobs on Windows servers
  ├─ Shared class libraries (often consumed by C# too)
  └─ Brownfield .NET Framework (net48-class) estates

Less common as the *default* greenfield choice
  ├─ New public web APIs / microservices  → usually C#
  ├─ Cross-platform mobile / modern UI    → other stacks
  └─ Cloud-native workers from templates → usually C#
```

**Direction of travel (practical, not slogans):**

| Trend | What it means for you |
|-------|------------------------|
| Feature gravity → **C#** | New syntax sugar and sample apps land in C# first |
| Estates still ship **VB** | Maintainers who can read `.vb` remain scarce and valuable |
| Mixed solutions normal | VB UI/library + C# services in one repo is common |
| Modernize by **strangler** | Extract domain libraries; retarget TFMs; replace UI last |
| “Rewrite everything in C# next sprint” | Usually underestimates COM, printers, and installers |

Keeping VB is a **risk/cost decision**, not a loyalty oath. Hiring and samples favor C# for greenfield; that does not erase WinForms LOB that still pays the bills.

### 3. The orientation sentence

> **Same CLR, different syntax and community gravity—pick the language your maintainers can carry, and the host your security model allows.**

VB.NET, C#, and F# all compile to IL. VBA does **not**. PowerShell is an automation host, not a substitute WinForms stack. Mixing them without naming the host is how estates get confused.

### 4. Owned here versus directed elsewhere

| Topic | In this track? | Where next |
|-------|----------------|------------|
| VB syntax, Options, idioms | **Yes** | Visual Basic language reference |
| Assemblies / PackageReference overview | **Yes** (**13**) | [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md) |
| COM / P/Invoke literacy | **Yes** (**14**) | .NET native interop docs |
| WinForms / Services doors | **Door** (**15**) | WinForms & Worker Service docs |
| Security review habits | **Yes** (**16**) | .NET secure coding + [C# security](../CSharp/20_Security_And_Best_Practices.md) |
| Full C# language / samples | **No** | [C# track](../CSharp/README.md) |
| F# / functional .NET | **Door** | F# docs |
| PowerShell ops automation | **Door** | PowerShell docs |
| Office VBA macros | **Boundary** | [VBA track](../VBA/README.md) |
| Malware / evasion recipes | **No** | Forbidden |

### 5. When to keep VB

| Keep VB when… | Reconsider when… |
|---------------|-------------------|
| Large WinForms surface works and is owned | No VB readers left; hiring blocked |
| Shared libraries already consume VB IL fine | Greenfield API with C#-only team norms |
| Migration budget is below COM/UI risk | Security findings require structural rewrite anyway |
| Incremental strangler is funded | Business wants cross-platform UI next quarter |

---

## 2. Advanced concepts

### 1. How to choose what to learn next

Ask three questions in order:

1. **What host am I actually touching?** (Windows desktop EXE, Windows service, Office document, shell, HTTP API, SQL)
2. **Is the gap language, platform, or product UI?** (VB syntax vs NuGet/CI vs WinForms designer vs ASP.NET)
3. **Am I maintaining, operating, securing, or greenfielding?** (role changes the next book)

Then pick **one** next path and finish its **starting step** before stacking three courses.

### 2. What to learn next

For each path: **what it is**, **when to choose it**, **what you bring from VB.NET**, **starting step**, and **what follows**.

#### A. C# (default sibling on the same runtime)

| | |
|--|--|
| **What** | Primary .NET language for most new samples, cloud templates, and hiring |
| **Choose when** | Greenfield services; you need the richest docs; shared SDK/NuGet/testing depth |
| **Bring from this track** | Assemblies, NuGet, `Option Strict` discipline as “don’t use `dynamic` casually,” interop review, async pitfalls |
| **Starting step** | Finish [C# SDK setup](../CSharp/2_Environment_Setup_And_DotNet_SDK.md); build/run a console; map one VB type you know to C# syntax |
| **Then** | [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md) → [C# use cases](../CSharp/19_Use_Cases_And_Applications.md) → [C# security](../CSharp/20_Security_And_Best_Practices.md) |
| **Done looks like** | You can read a mixed solution without translating every line in your head |

#### B. ASP.NET / web APIs (product host on .NET)

| | |
|--|--|
| **What** | HTTP APIs and web hosts on modern .NET |
| **Choose when** | New services, BFF layers, replacing a fat desktop “server” |
| **Bring from this track** | Async (**11**), secrets/config (**16**), NuGet (**13**); `ConfigureAwait` / sync-over-async caution |
| **Starting step** | Official ASP.NET “minimal API” or Web API tutorial in **C#** (org default); deploy config without secrets in source |
| **Then** | AuthN/AuthZ docs for your stack; observability; [C# track](../CSharp/README.md) for language depth |
| **Done looks like** | You stop proposing WinForms as the integration surface for every system |

#### C. WPF / WinUI (other Windows UI)

| | |
|--|--|
| **What** | Sibling desktop UI stacks to WinForms |
| **Choose when** | Solution already uses them, or modernization leaves WinForms |
| **Bring from this track** | TFM/Windows targeting (**15**), UI thread + async (**11**) |
| **Starting step** | Open a sample WPF/WinUI app; identify project SDK/TFM; find where UI thread rules show up |
| **Then** | Official WPF or WinUI docs—designer craft is **not** this handbook |
| **Done looks like** | You can classify a `.vbproj`/`.csproj` as WinForms vs WPF vs WinUI in one minute |

#### D. Data access (ADO.NET / EF)

| | |
|--|--|
| **What** | Parameterized SQL / EF as an `IQueryable` provider |
| **Choose when** | LOB already talks to SQL Server (or similar) |
| **Bring from this track** | LINQ honesty (**10**), secret connection strings (**16**) |
| **Starting step** | One parameterized query path; connection string from config/secret store—not source |
| **Then** | EF Core docs (or ADO.NET for brownfield); indexing/query-plan literacy with DBAs |
| **Done looks like** | You refuse string-concat SQL in review without a fight |

#### E. Testing culture (same runners as C#)

| | |
|--|--|
| **What** | `dotnet test` with xUnit/NUnit/MSTest against extracted logic |
| **Choose when** | You maintain libraries or want to strangler-extract from forms |
| **Bring from this track** | Testing door in **13**; Strict/types making tests honest |
| **Starting step** | VB or C# test project + `ProjectReference` + green `dotnet test` in CI |
| **Then** | [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md) for doubles, coverage policy, packaging |
| **Done looks like** | Business rules run without clicking every form |

#### F. PowerShell (ops host)

| | |
|--|--|
| **What** | First-line Windows/automation shell |
| **Choose when** | Glue, remote admin, install/verify scripts—not LOB UI |
| **Bring from this track** | Least privilege; “service that is a script ball of mud” smell |
| **Starting step** | Signed/reviewed script that checks service health or config without embedding secrets |
| **Then** | PowerShell docs; remoting and JEA as your org requires |
| **Done looks like** | Ops tasks leave the WinForms “admin button” era |

#### G. VBA (boundary — different product)

| | |
|--|--|
| **What** | Office-hosted macros |
| **Choose when** | Document-centric Automation inside Excel/Word/… |
| **Do not** | Assume VB.NET skills make unsafe macros safe |
| **Starting step** | [VBA](../VBA/README.md) chapter **01** + macro security chapters—before writing macros |
| **Done looks like** | You never open a `.xlsm` incident with a `.vbproj` mental model |

#### H. F# (functional sibling on the same runtime)

| | |
|--|--|
| **What** | Functional-first .NET language |
| **Choose when** | Domain modeling / analytical pipelines and the team wants F# |
| **Bring from this track** | Project/restore/NuGet literacy only—syntax does not transfer |
| **Starting step** | Official F# get-started; one small library consumed from C# or VB |
| **Done looks like** | You know when F# is a team choice, not a VB modernization silver bullet |

#### I. Azure / cloud .NET (platform door)

| | |
|--|--|
| **What** | Hosting .NET on Azure (Functions, App Service, Container Apps, …) |
| **Choose when** | LOB edges move off a single Windows box |
| **Bring from this track** | Secrets (**16**), publish modes (**13**), async (**11**) |
| **Starting step** | One official Azure .NET quickstart in the org’s default language (usually C#) |
| **Then** | [C# use cases](../CSharp/19_Use_Cases_And_Applications.md) + Azure product docs |
| **Done looks like** | You can name the host and identity model—not “put the EXE in a VM and pray” |

### 3. Paths by role

#### Maintainer / SE

```text
This track (through 13, 16)
  → C# SDK + NuGet/testing (shared depth)
  → Extract testable library from one WinForms form
  → Data access / EF only as the LOB needs it
  → WPF/WinUI only if the UI stack is changing
```

#### Operations

```text
This track (00, 13, 15, 16)
  → PowerShell for glue and health checks
  → Publish/runtime baselines (FDD vs SCD)
  → Azure/host docs if the workload leaves the box
```

#### Security reviewer

```text
This track (03, 12–14, 16)
  → C# security chapter + .NET secure coding
  → VBA track only for Office macro incidents
  → Do not invent “VB exploit courses”
```

#### Modernizer

```text
This track (14–18) + inventory
  → Strangler: domain library (VB or C#) first
  → Retarget TFM when tests allow
  → UI last (WinUI/WPF/web) — after COM/devices are named
  → C# for greenfield edges
```

### 4. Common wrong next steps

| You wanted… | Avoid | Learn instead |
|-------------|-----------------|------------------|
| Fix Excel macros | More VB.NET syntax | [VBA](../VBA/README.md) |
| Automate server patch checks | New WinForms admin tool | PowerShell |
| New public API | Deeper XML literals | ASP.NET + C# |
| Understand NuGet CVEs | Another VB tutorial site | [C# NuGet/testing](../CSharp/18_NuGet_And_Testing.md) |
| Cross-platform mobile UI | “Convert WinForms” slogans | Product UI stack docs (not this track) |
| Functional domain model | “Rewrite in F# next week” | Team skill + small F# library spike |

### 5. Modernization patterns (named stages)

```text
Keep VB UI ──► extract domain to netstandard / modern TFM library (C# or VB)
     │
     ├─► retarget Framework → modern Windows TFM when tests allow
     │
     ├─► replace install/update channel (MSI/MSIX/Intune) deliberately
     │
     └─► replace UI later (WinUI/WPF/web) once logic is free of forms
```

Strangler beats big-bang. COM and printers still dominate calendars (**14–15**).

### 6. What this track does not replace

- Full WinForms/WPF/WinUI designer mastery.
- ASP.NET / cloud architecture encyclopedia (use [C#](../CSharp/README.md) and product docs).
- Office security baselines and ASR macro policy ([VBA](../VBA/README.md)).
- Incident response playbooks for malware authoring—out of scope forever.

### 7. How to use this chapter

Read after **17**, or skim early to set direction. Revisit when:

- someone proposes “rewrite everything in C# next sprint,”
- Framework pressure hits a WinForms LOB,
- ops asks whether a VB service should become a Worker Service,
- a ticket confuses VBA macros with VB.NET executables,
- you finished the spine and need a **single** next skill.

---

## 3. Applications and use cases

| Situation | What to do |
|-----------|----------------|
| Stable VB LOB, skilled team | Keep; harden **16**; patch runtime; add tests on extracted logic |
| VB service + Excel Automation | Redesign reporting; do not “C#-ify” the anti-pattern |
| Library shared by C# apps | Language-agnostic package; new edge code in team’s primary language |
| Macro in `.xlsm` | Route to [VBA](../VBA/README.md)—wrong track |
| New microservice | Prefer C#/.NET templates unless VB is mandated |
| “What should I learn after VB.NET?” | One path from **What to learn next** above + finish that path’s **starting step** |

Learning-path sketch:

```text
VB spine → 13 NuGet literacy → 14–15 doors → 16 security → 17 roles → 18 (where next)
        ↘ C# for shared platform + greenfield
        ↘ PowerShell when the host is the shell
        ↘ VBA only for Office
        ↘ ASP.NET / WPF-WinUI / EF / Azure only when that host is the job
```

---

## 4. Staff-level review checklist

- State whether the workload is VB.NET, C#, F#, PowerShell, or VBA—before debating syntax.
- Pick **one** next path and its starting step; avoid three parallel “learn everything” plans.
- Prefer strangler extraction over big-bang UI rewrites when COM/devices are involved.
- Use [C# SDK](../CSharp/2_Environment_Setup_And_DotNet_SDK.md) and [NuGet/testing](../CSharp/18_NuGet_And_Testing.md) for shared platform depth.
- Keep VBA incidents on the [VBA](../VBA/README.md) security path; do not apply macro ASR lore blindly to .exe services.
- Record keep-vs-rewrite decisions with owners and TFM targets.
- Treat “VB has no future” as opinion until inventory and hiring data agree.
- Reject modernization plans that only rename `.vb` to `.cs` without tests or secret hygiene (**16**).
- Route ops glue to PowerShell; route Office documents to VBA/Add-ins/Scripts—not WinForms by default.
- Keep this track’s scope clear: maintain and review VB estates—this chapter does not replace every Microsoft learning path.
- Re-read **15** when someone confuses Worker Services with “hidden forms.”
- For greenfield HTTP, prefer ASP.NET + C# samples unless policy mandates VB.

---

## References

- [Visual Basic documentation (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
- [What's new for Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/whats-new/)
- [Annotated Visual Basic language strategy](https://learn.microsoft.com/en-us/dotnet/visual-basic/getting-started/strategy)
- [.NET documentation](https://learn.microsoft.com/en-us/dotnet/)
- [F# documentation](https://learn.microsoft.com/en-us/dotnet/fsharp/)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Windows Forms overview](https://learn.microsoft.com/en-us/dotnet/desktop/winforms/overview/)
- [WPF documentation](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/)
- [ASP.NET Core documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [Unit testing in .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)
- [Azure for .NET developers](https://learn.microsoft.com/en-us/dotnet/azure/)
- [C# track README](../CSharp/README.md)
- [C# — Environment setup and .NET SDK](../CSharp/2_Environment_Setup_And_DotNet_SDK.md)
- [C# — NuGet and testing](../CSharp/18_NuGet_And_Testing.md)
- [C# — Use cases and applications](../CSharp/19_Use_Cases_And_Applications.md)
- [C# — Security and best practices](../CSharp/20_Security_And_Best_Practices.md)
- [VBA track README](../VBA/README.md)
- [VB.NET README](./README.md)
