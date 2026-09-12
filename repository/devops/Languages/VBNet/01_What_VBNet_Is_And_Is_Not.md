# What VB.NET is (and is not)

[← Back to VB.NET](./README.md)

## What this chapter covers

If you are **new to VB.NET**, start here—even before you memorize syntax. This chapter answers the questions that make every later lab click:

1. **What** VB.NET is (a CLR / .NET language).
2. **Why** it exists and where it still shows up.
3. **How** it relates to—and differs from—**VBA**, **C#**, and **classic VB6**.
4. **What it is not** (Office macros, a separate VM, “just old Windows UI”).
5. How this track sits next to the [C#](../CSharp/README.md) and [VBA](../VBA/README.md) tracks.

Chapter **[00](./00_First_Steps_SDK_DotNet_And_Hello.md)** is the hands-on smoke check (`dotnet`, hello). This chapter is the **map of the territory**. After this, chapter **[02](./02_Projects_Modules_Namespaces_And_Entry_Points.md)** covers projects, modules, and entry points.

Handbook default for *new* work: **Visual Basic on modern .NET** (VB ~**17.x** with VS **2022/2026**-era tooling). **.NET Framework 4.x** is brownfield literacy.

---

## 1. Concepts

### 1. What VB.NET is (plain language)

**VB.NET** (Visual Basic on .NET) is a programming language that compiles to **IL** and runs on the **CLR** / .NET runtime. You get the same **Base Class Library (BCL)**, **NuGet** ecosystem, and (for modern projects) **`dotnet` SDK** tooling as [C#](../CSharp/README.md) and F#. The surface syntax is Visual Basic; the execution model is **.NET**.

Hold this picture:

> `.vb` sources → VB compiler → IL in assemblies → CLR / .NET runtime → BCL / your dependencies

At runtime there is no separate “VB.exe VM” for app code. There is the **.NET runtime** executing IL, subject to the same GC, security, and interop rules as other .NET languages.

```vb
Imports System

Module Program
    Sub Main(args As String())
        Console.WriteLine(Runtime.InteropServices.RuntimeInformation.FrameworkDescription)
    End Sub
End Module
```

You do not need the full framework map yet. Hold: **VB.NET is a first-class .NET language with VB syntax.**

### 2. Why it exists

Visual Basic was a dominant Windows productivity language. .NET unified languages on one runtime and library stack. VB.NET exists so teams could:

| Need | What VB on .NET provides |
|------|---------------------------|
| Keep VB-shaped syntax | Familiar procedures, `Dim`, `If…Then`, readable line structure |
| Share the platform | Same BCL, same tooling story as C# |
| Modernize VB6 / early .NET estates | Path onto CLR without rewriting every line as C# on day one |
| Ship Windows LOB apps | WinForms/WPF and services in the Microsoft stack |

Today, **greenfield** .NET work often defaults to C#. VB remains important because **large estates still compile and ship it**—and because staff who only know C# still must **read** VB under incident pressure.

### 3. What you can do with VB.NET

| You can… | Typical shape |
|----------|----------------|
| **Console / worker / service apps** | SDK-style `.vbproj`, `dotnet` CI |
| **Windows desktop LOB** | WinForms / WPF (often Framework or Windows-targeted TFMs) |
| **Class libraries** | Shared logic consumed by C# or VB callers |
| **Interop-heavy internal tools** | COM / P/Invoke literacy (later chapters) |
| **Maintain brownfield** | net48 and older project systems |

What VB.NET is *usually not* hired to do alone today:

| Not the usual VB.NET job | Better mental model |
|--------------------------|---------------------|
| Excel/Word macros inside Office | **[VBA](../VBA/README.md)** — different host and runtime |
| “The only way to use .NET” | C# / F# are peer languages on the same runtime |
| Cross-platform UI by default | Many classic VB UI stacks are Windows-centric |
| Replace learning the BCL | Syntax ≠ platform literacy |

### 4. Where it lives

**Runtime homes.**

| Home | Notes |
|------|-------|
| **Modern .NET** (`net8.0` / `net9.0` / `net10.0`, …) | Default narrative for new console/libraries |
| **.NET Framework 4.x** (`net48`, …) | Brownfield Windows apps and services |
| **Libraries** | Often multi-targeted or consumed from mixed-language solutions |

**Team homes.** Enterprise Windows shops, ISVs with long-lived desktop products, internal tooling groups, and modernization programs that still compile VB while shifting edges to C#.

**CI.** The important “where” for staff work: the **SDK and TFM matrix** in the pipeline. If laptop Framework MSBuild ≠ agent SDK, you do not have one product definition.

### 5. Relationship to this handbook

| Track | Use it for |
|-------|------------|
| **This VB.NET track** | VB syntax, Options, projects, idioms, Windows/.NET literacy doors |
| **[C#](../CSharp/README.md)** | Shared SDK/NuGet/BCL depth; often the org’s greenfield default |
| **[VBA](../VBA/README.md)** | Office-hosted automation and macro security |

Prefer C# chapters when the question is “how do NuGet and TFMs work in general?” Prefer this track when the question is “what does this `.vb` file mean?”

---

## 2. Advanced concepts

### 1. VBA ≠ VB.NET (do not collapse them)

This is the most expensive confusion in Microsoft shops.

| Dimension | **VBA** | **VB.NET** |
|-----------|---------|------------|
| **Host** | Office apps (Excel, Word, …) | .NET process (app, service, library) |
| **Runtime** | VBA runtime inside the host | CLR / .NET runtime |
| **Delivery** | `.xlsm` / `.docm` / add-ins | Assemblies, installers, services |
| **Libraries** | Host object model + limited COM | Full BCL + NuGet |
| **Tooling** | VBE inside Office | `dotnet` / Visual Studio |
| **Security gate** | Macro / Trust Center / MotW policies | App identity, CAS history (legacy), modern sandbox/OS controls |

Shared *family resemblance* in syntax (`Sub`, `Dim`, `If`) is not shared *product identity*. A staff member who “knows VB” must say **which VB**.

### 2. VB.NET vs C#

| Dimension | VB.NET | C# |
|-----------|--------|-----|
| Runtime / BCL | Same | Same |
| Project system | `.vbproj` | `.csproj` |
| Syntax / idioms | VB keywords, `Option` directives | C# syntax, nullable annotations style |
| Ecosystem momentum | Strong in maintenance | Stronger in greenfield samples and hiring |
| Interop | First-class .NET citizen | First-class .NET citizen |

You can reference a VB library from C# and vice versa. Language choice is often **historical and team skill**, not capability ceiling.

### 3. Classic VB6 vs VB.NET

**VB6** is a pre-.NET native Windows development stack (COM-centric, its own forms model). **VB.NET** was a *new* language on the CLR—not a silent in-place upgrade of every VB6 binary.

| Habit | Why it matters |
|-------|----------------|
| Treat VB6 as archaeology + migration literacy | Different runtime, packaging, and error model |
| Do not assume line-by-line mechanical port | Controls, APIs, and `Variant` habits bite |
| Prefer documented modernization plans | Big-bang “upgrade” without tests is folklore |

If you meet `.vbp` / VB6 forms, escalate to a migration playbook—do not pretend chapter **00** hello covers it.

### 4. Language version without a museum

Pin literacy around **current Visual Basic on .NET** as shipped with recent Visual Studio / SDK bands (VB ~**17.x** era). You do not need a timeline of every language revision to review production code. When a feature surprises you, check the project’s language version / SDK—not tribal memory of VB 2005.

### 5. What “supported” means operationally

Microsoft’s support story for **.NET runtimes** and for **Visual Studio** is what ops and security care about. An app can compile in VB and still be **out of support** because its **TFM** or host OS is. Language romance does not extend patch windows.

---

## 3. Applications and use cases

| Angle | How identity shows up |
|-------|------------------------|
| **Application** | Choose VB to maintain an existing LOB surface; choose C# when greenfield and hiring say so—both can share libraries. |
| **Systems** | Mixed-language solutions are normal; build graphs must compile every project TFM. |
| **Security** | Macro malware reviews belong in [VBA](../VBA/README.md); .NET assembly reviews (deps, deserialization, CAS leftovers) belong here / C#. |
| **Ops** | Runtime installers and service accounts follow .NET deployment—not Office Trust Center. |
| **SE** | Interview and onboarding must separate VBA / VB.NET / VB6 explicitly or you hire the wrong skill. |

**Whole-engineering picture:** naming the language correctly prevents the wrong runbook, the wrong sandbox, and the wrong modernization plan.

---

## 4. Staff-level review checklist

- Speakers can explain **VB.NET = .NET language** in one sentence without mentioning Excel.
- **VBA** work is routed to the VBA track; not “fixed” with `dotnet`.
- **C#** is treated as a peer on the same runtime—not a moral upgrade by itself.
- **VB6** artifacts are labeled legacy/migration—not assumed to be VB.NET.
- Greenfield guidance names a **TFM** and SDK band, not only “use VB.”
- Brownfield Framework apps are inventoried by **runtime support**, not nostalgia.
- Docs and tickets say **VB.NET** or **Visual Basic (.NET)** when that is meant—never bare “VB” in mixed estates.
- Security reviews pick the right control plane (macros vs assemblies).

---

## References

- [Visual Basic documentation](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
- [Get started with Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/getting-started/)
- [.NET documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Office VBA language reference](https://learn.microsoft.com/en-us/office/vba/api/overview/language-reference)
- [C# language documentation](https://learn.microsoft.com/en-us/dotnet/csharp/)
