# Where VB.NET is going and adjacent doors

[← Back to VB.NET](./README.md)

## What this chapter covers

The **compass** for this track: what VB.NET literacy you already own after the spine and doors (**13–17**), what this handbook **does not replace**, and adjacent paths—**C#**, **F#**, **PowerShell**, and the **VBA** boundary—with guidance on **when to keep VB**. Modern .NET is the default future; Framework WinForms/services remain honest brownfield.

You should leave able to **maintain and review** VB.NET estates—and able to route the next deep topic without pretending every problem is another `.vb` form.

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

**Where VB.NET usually goes today:** Windows line-of-business (**WinForms**/services), shared **class libraries** in mixed C#/VB solutions, and **brownfield .NET Framework** estates—not the default greenfield web/API language in most orgs.

Bullseye: **VB language + project/runtime literacy + Windows LOB doors + defense review**. Not a WinForms designer encyclopedia, not Office macro mastery, not the entire BCL catalog.

### 2. Owned here versus directed elsewhere

| Topic | In this track? | Where next |
|-------|----------------|------------|
| VB syntax, Options, idioms | **Yes** | Visual Basic language reference |
| Assemblies / PackageReference overview | **Yes** (**13**) | [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md) |
| COM / P/Invoke literacy | **Yes** (**14**) | .NET native interop docs |
| WinForms / Services doors | **Door** (**15**) | WinForms & Worker Service docs |
| Security review habits | **Yes** (**16**) | .NET secure coding + [C# security](../CSharp/20_Security_And_Best_Practices.md) |
| Deep C# language / samples | **No** | [C# track](../CSharp/README.md) |
| F# / functional .NET | **Door** | F# docs |
| PowerShell ops automation | **Door** | PowerShell docs |
| Office VBA macros | **Boundary** | [VBA track](../VBA/README.md) |
| Malware / evasion recipes | **No** | Forbidden |

### 3. The orientation sentence

> **Same CLR, different syntax and community gravity—pick the language your maintainers can carry, and the host your security model allows.**

VB.NET, C#, and F# all compile to IL. VBA does **not**. PowerShell is an automation host, not a substitute WinForms stack. Mixing them without naming the host is how estates get confused.

### 4. Language future — practical reading

- VB.NET remains a **supported .NET language** for existing and many new library scenarios; feature cadence historically trails C# for brand-new syntax sugar.
- Hiring, samples, and blog gravity favor **C#** for greenfield services and cloud.
- Keeping VB is rational when **UI/COM debt**, team skill, and risk say rewrite cost exceeds keep cost (**17**).
- “VB is dead” as a slogan is not an architecture decision—**inventory and owners** are.

### 5. When to keep VB

| Keep VB when… | Reconsider when… |
|---------------|-------------------|
| Large WinForms surface works and is owned | No VB readers left; hiring blocked |
| Shared libraries already consume VB IL fine | Greenfield API with C#-only team norms |
| Migration budget is below COM/UI risk | Security findings require structural rewrite anyway |
| Incremental strangler is funded | Business wants cross-platform UI next quarter |

---

## 2. Advanced concepts

### 1. Adjacent doors (routing table)

#### C#

| Item | Literacy |
|------|----------|
| What | Primary .NET language for most new samples and cloud templates |
| Choose when | Greenfield services, team fluency, richest ecosystem examples |
| Bring from this track | Assemblies, NuGet, security, interop review habits |
| Start | [C# README](../CSharp/README.md), [SDK setup](../CSharp/2_Environment_Setup_And_DotNet_SDK.md) |

#### F#

| Item | Literacy |
|------|----------|
| What | Functional-first .NET language; same runtime |
| Choose when | Domain modeling, analytical pipelines, teams that want F# |
| Bring from this track | .NET project/restore literacy; do not assume VB syntax transfers |
| Start | F# documentation (References) |

#### PowerShell

| Item | Literacy |
|------|----------|
| What | First-line Windows/automation shell and scripting |
| Choose when | Ops tasks, glue, remote admin—not LOB UI |
| Bring from this track | Least privilege; avoid “service that is actually a script ball of mud” |
| Start | PowerShell documentation (References) |

#### VBA (boundary)

| Item | Literacy |
|------|----------|
| What | Office-hosted macros—**different runtime** |
| Choose when | Document-centric Automation inside Office |
| Do not | Assume VB.NET skills make unsafe macros safe |
| Start | [VBA README](../VBA/README.md) |

#### WPF / WinUI (desktop UI doors)

| Item | Literacy |
|------|----------|
| What | Other Windows UI stacks beside WinForms |
| Choose when | Solution already uses them, or UI modernization leaves WinForms |
| Bring from this track | TFM/Windows targeting honesty, UI-thread + async habits (**11**, **15**) |
| Start | Official WPF / WinUI docs (References)—not this track’s designer book |

#### ASP.NET / web APIs (door)

| Item | Literacy |
|------|----------|
| What | Web and API hosts on .NET; VB *can* participate |
| Choose when | Greenfield services where the org’s default is C# samples and hiring |
| Bring from this track | Async/`ConfigureAwait` literacy (**11**), secrets/config (**16**), NuGet (**13**) |
| Start | [C# track](../CSharp/README.md) + ASP.NET docs |

#### Data access (ADO.NET / EF literacy door)

| Item | Literacy |
|------|----------|
| What | Parameterized data access; EF/`IQueryable` as a LINQ provider |
| Choose when | LOB apps already talk to SQL Server / similar |
| Bring from this track | LINQ honesty (**10**), secret connection strings (**16**) |
| Start | EF / ADO.NET official docs—not a second database curriculum here |

#### Testing (same runners as C#)

| Item | Literacy |
|------|----------|
| What | `dotnet test` with VB test projects |
| Choose when | You maintain libraries or extract logic from forms |
| Bring from this track | **13** testing door |
| Start | [C# NuGet and testing](../CSharp/18_NuGet_And_Testing.md) for depth |

### 2. Modernization patterns (names only)

```text
Keep VB UI ──► extract domain to netstandard/net8 library (C# or VB)
     │
     ├─► retarget Framework → modern Windows TFM when tests allow
     │
     └─► replace UI later (WinUI/WPF/web) once logic is free of forms
```

Strangler beats big-bang. COM and printers still dominate calendars (**14–15**).

### 3. What this track does not replace

- Full WinForms/WPF/WinUI designer mastery.
- ASP.NET / cloud architecture encyclopedia (use [C#](../CSharp/README.md) and product docs).
- Office security baselines and ASR macro policy ([VBA](../VBA/README.md)).
- Incident response playbooks for malware authoring—out of scope forever.

### 4. How to use this chapter

Read after **17**, or skim early so the bullseye is clear. Revisit when:

- someone proposes “rewrite everything in C# next sprint,”
- Framework end-of-support pressure hits a WinForms LOB,
- ops asks whether a VB service should become a Worker Service,
- a ticket confuses VBA macros with VB.NET executables.

---

## 3. Applications and use cases

| Situation | Compass action |
|-----------|----------------|
| Stable VB LOB, skilled team | Keep; harden **16**; patch runtime |
| VB service + Excel Automation | Redesign reporting; do not “C#-ify” the anti-pattern |
| Library shared by C# apps | Language-agnostic package; new code in team’s primary language |
| Macro in `.xlsm` | Route to [VBA](../VBA/README.md)—wrong track |
| New microservice | Prefer C#/.NET templates unless VB is mandated |

Learning-path sketch:

```text
VB spine → 13 NuGet literacy → 14–15 doors → 16 security → 17 roles
        ↘ deepen SDK/NuGet/tests in C# track as needed
        ↘ F# / PowerShell / VBA only when the host matches
```

---

## 4. Staff-level review checklist

- State whether the workload is VB.NET, C#, F#, PowerShell, or VBA—before debating syntax.
- Prefer strangler extraction over big-bang UI rewrites when COM/devices are involved.
- Use [C# SDK](../CSharp/2_Environment_Setup_And_DotNet_SDK.md) and [NuGet/testing](../CSharp/18_NuGet_And_Testing.md) for shared platform depth—do not duplicate folklore here.
- Keep VBA incidents on the [VBA](../VBA/README.md) security path; do not apply macro ASR lore blindly to .exe services.
- Record keep-vs-rewrite decisions with owners and TFM targets.
- Treat “VB has no future” as opinion until inventory and hiring data agree.
- Reject modernization plans that only rename `.vb` to `.cs` without tests or secret hygiene (**16**).
- Route ops glue to PowerShell; route Office documents to VBA/Add-ins/Scripts—not WinForms by default.
- Confirm this track’s bullseye: maintain/review VB estates—not replace all Microsoft learning paths.
- Re-read **15** when someone confuses Worker Services with “hidden forms.”

---

## References

- [Visual Basic documentation (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
- [What's new for Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/whats-new/)
- [.NET documentation](https://learn.microsoft.com/en-us/dotnet/)
- [F# documentation](https://learn.microsoft.com/en-us/dotnet/fsharp/)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Windows Forms overview](https://learn.microsoft.com/en-us/dotnet/desktop/winforms/overview/)
- [WPF documentation](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/)
- [ASP.NET Core documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [Unit testing in .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/)
- [C# track README](../CSharp/README.md)
- [C# — Environment setup and .NET SDK](../CSharp/2_Environment_Setup_And_DotNet_SDK.md)
- [C# — NuGet and testing](../CSharp/18_NuGet_And_Testing.md)
- [C# — Security and best practices](../CSharp/20_Security_And_Best_Practices.md)
- [VBA track README](../VBA/README.md)
- [VB.NET README](./README.md)
