# VB.NET

[← Back to Languages](../README.md)

**VB.NET** (Visual Basic on .NET) is a first-class **.NET language**. You write `.vb` sources; the compiler emits **IL**; the **CLR / .NET runtime** executes it. You share the same **BCL**, **NuGet** ecosystem, and (for modern work) **`dotnet` SDK** tooling as C# and F#. The surface syntax is Visual Basic; the execution model is **.NET**.

It still shows up in **legacy Windows and enterprise** apps, internal tools, and Windows services. Staff who operate, secure, maintain, or modernize those estates need to **read and reason about** VB—not only recite C#.

This track teaches **VB language + the .NET project/runtime surface you need for VB work**: Options and types, procedures and OOP, LINQ and async, files and assemblies, COM/P/Invoke literacy, Windows LOB doors, and security review habits. It is **not** Office VBA (see [VBA](../VBA/README.md)), **not** a full WinForms/WPF designer course, and **not** an ASP.NET web encyclopedia. Chapter **18** is the **compass** for those doors. For sibling C# depth on the same platform, use the [C#](../CSharp/README.md) track.

Staff hire VB.NET fluency for four practical pillars:

1. **Language honesty** — `Option Explicit` / `Strict` / `Infer`, types, `Nothing`, procedures, exceptions (chapters **02–08**).
2. **CLR / .NET surface** — projects, TFMs, assemblies, NuGet, BCL usage from VB (chapters **00**, **02**, **12–13**).
3. **Interop and legacy surface** — COM, P/Invoke, Framework vs modern .NET (chapters **14–15**).
4. **Security and ops** — secrets, dependency hygiene, least privilege, review of services and desktop apps (chapters **16–17**).

**New to VB.NET?** Start at chapter **01** (what it is), then **00** (SDK + hello), then **02** onward.

---

## After this track — what you can write

| You can write / do… | What “done” looks like | Spine chapters |
|---------------------|------------------------|----------------|
| A **VB console or class library** on modern .NET | SDK-style `.vbproj`, `Option Strict On`, honest errors | **00–08** |
| **Read and change** a brownfield VB solution | Modules/classes, Options, TFM/Framework literacy | **01–03**, **07**, **13** |
| A **file/config helper** without path/secrets disasters | `System.IO` habits; no secret-in-code | **12**, **16** |
| A **package and assembly review** | PackageReference inventory; restore understood | **13**, **16** |
| A **COM / P/Invoke review conversation** | Surfaces named; late binding risk understood | **14** |
| A **modernization / keep-or-migrate** decision | Windows doors + compass used honestly | **15**, **17–18** |

---

## What to learn next (complement paths)

VB.NET usually lands in **Windows LOB** (WinForms/services), **shared libraries**, and **brownfield Framework** estates. After this track, pick the next skill by the *host* you need—not by “more VB syntax.”

| If your goal is… | Learn next | Bring from this track |
|------------------|------------|------------------------|
| Deeper shared .NET SDK / NuGet / testing | [C#](../CSharp/README.md) track (esp. SDK + NuGet/testing topics) | VB project literacy; same runtime; `dotnet test` door (**13**) |
| Functional .NET | [F#](../FSharp/README.md) when present + official F# docs | CLR / NuGet habits |
| Office macros | [VBA](../VBA/README.md) | Syntax familiarity only—**different runtime** |
| Replace Windows scripting glue | [PowerShell](https://learn.microsoft.com/en-us/powershell/) | Ops habits; not a VB substitute for LOB UI |
| Greenfield web/API on .NET | ASP.NET docs + [C#](../CSharp/README.md) (chapter **18**) | Async, secrets, packages—when keeping VB is the wrong fight |
| Other Windows UI (WPF / WinUI) | Official WPF / WinUI docs (chapter **18**) | TFM and UI-thread habits from **11** / **15** |
| LOB data access depth | EF / ADO.NET docs + this track **10** / **16** | Parameterized access; secret connection strings |

**Suggested order for a maintainer:** **01 → 00 → 02–08 → 13 → 16**.  
**Suggested order for a security reviewer:** **01 → 03** (`Option Strict`) → **12–14** → **16**.

---

## Versions and brownfield (default narrative)

**Default for new work: Visual Basic on modern .NET**, language **17.13** with Visual Studio **2026**-era tooling (pin whatever SDK/VS band **your org actually ships**), targeting a supported TFM such as **`net8.0` / `net9.0` / `net10.0`**.

| Pin | Where it shows up | Handbook habit |
|-----|-------------------|----------------|
| Modern **.NET** + VB | New console/libraries | Default narrative |
| **.NET Framework 4.x** (`net48`, …) | Long-lived Windows LOB / services | Brownfield literacy |
| Mixed-language solutions (VB + C#) | Enterprise solutions | Normal; share TFMs carefully |
| Classic **VB6** | Ancient Win32 LOB | Door only—not this language |

```bash
command -v dotnet
dotnet --version
dotnet --list-sdks
```

---

## Chapter structure

Every chapter follows:

1. **Concepts** (basic mental model)
2. **Advanced concepts** (versions, platform nuance, gotchas)
3. **Applications and use cases** (app, systems, security, ops, SE)
4. **Staff-level review checklist**

Links live in each chapter’s **References** (official hubs only).

---

## Semantic model (six ideas)

1. **VB.NET is a .NET language.** Same IL/runtime/BCL story as C#; different syntax and idioms.
2. **`Option Strict On` is staff default.** Late binding and silent narrowing are review smells.
3. **Projects and TFMs are part of the language experience.** Wrong target framework feels like “VB is broken.”
4. **Interop is a trust boundary.** COM and P/Invoke expand what the process can touch.
5. **VBA is a different product.** Office-hosted macros are not this track.
6. **VB specialties still appear in brownfield.** XML literals/axis, `My`, and iterators are literacy—not optional trivia for maintainers.

| Idea | Review smell if missing | Home chapters |
|------|-------------------------|---------------|
| .NET identity | Treated as “Excel macros with a compiler” | **01**, **00** |
| Option Strict | Widespread `Object` + late calls | **03**, **16** |
| TFM honesty | Laptop Framework ≠ agent SDK | **02**, **13** |
| Interop surface | Undocumented `CreateObject` / `DllImport` | **14** |
| VBA boundary | Macro advice applied to `.vbproj` apps | **01**, **18** |
| VB specialty syntax | Surprise XML literals / `My` in a C#-heavy review | **10**, **12** |

---

## How to read this section

**Absolute beginners:** **01 → 00 → 02 → …**  
If you already open VB solutions daily: **00 → 02…**, but do **not** skip **03**, **08**, **13**, and **16**.

---

## Progression

| Stage | Chapters | What you will be able to do |
|-------|----------|------------------------------|
| **Orientation** | 01 | Explain VB.NET vs VBA vs C# vs VB6 |
| **Doorway** | 00 | Install/discover SDK, run hello |
| **Language core** | 02 → 08 | Projects, types, flow, procedures, OOP, exceptions |
| **Abstraction / runtime** | 09 → 12 | Generics, events, LINQ, async, files/`My` |
| **Platform / legacy** | 13 → 15 | Assemblies/NuGet, COM/P/Invoke, WinForms/services doors |
| **Security / synthesis** | 16 → 18 | Hardening habits, roles, complement paths |

---

## How this relates to .NET

There is **no separate “.NET language” folder** in this handbook. **.NET** is the **platform** under C#, VB.NET, and F#.

| Piece | Where it lives here |
|-------|---------------------|
| **VB syntax, Options, idioms, Windows LOB literacy** | **This track** |
| **.NET SDK, projects, assemblies, NuGet, BCL—as used from VB** | **This track** (woven through **00**, **02**, **12–13**, and later) |
| **Shared platform depth and common greenfield default** | [C#](../CSharp/README.md) |
| **Office macros** | [VBA](../VBA/README.md) |

---

## Chapters

| # | Topic | File |
|---|--------|------|
| 00 | First steps: .NET SDK, VB projects, and hello | [00_First_Steps_SDK_DotNet_And_Hello.md](./00_First_Steps_SDK_DotNet_And_Hello.md) |
| 01 | What VB.NET is (and is not) | [01_What_VBNet_Is_And_Is_Not.md](./01_What_VBNet_Is_And_Is_Not.md) |
| 02 | Projects, modules, namespaces, and entry points | [02_Projects_Modules_Namespaces_And_Entry_Points.md](./02_Projects_Modules_Namespaces_And_Entry_Points.md) |
| 03 | Types, variables, and Option directives | [03_Types_Variables_And_Option_Directives.md](./03_Types_Variables_And_Option_Directives.md) |
| 04 | Operators, control flow, and loops | [04_Operators_Control_Flow_And_Loops.md](./04_Operators_Control_Flow_And_Loops.md) |
| 05 | Procedures, parameters, properties, and overloads | [05_Procedures_Parameters_Properties_And_Overloads.md](./05_Procedures_Parameters_Properties_And_Overloads.md) |
| 06 | Strings, arrays, and collections | [06_Strings_Arrays_And_Collections.md](./06_Strings_Arrays_And_Collections.md) |
| 07 | Classes, structures, inheritance, and interfaces | [07_Classes_Structures_Inheritance_And_Interfaces.md](./07_Classes_Structures_Inheritance_And_Interfaces.md) |
| 08 | Exceptions and error handling | [08_Exceptions_And_Error_Handling.md](./08_Exceptions_And_Error_Handling.md) |
| 09 | Generics, delegates, events, and lambdas | [09_Generics_Delegates_Events_And_Lambdas.md](./09_Generics_Delegates_Events_And_Lambdas.md) |
| 10 | LINQ and query expressions | [10_LINQ_And_Query_Expressions.md](./10_LINQ_And_Query_Expressions.md) |
| 11 | Async and Task literacy | [11_Async_And_Task_Literacy.md](./11_Async_And_Task_Literacy.md) |
| 12 | File I/O, streams, and My | [12_File_IO_Streams_And_My.md](./12_File_IO_Streams_And_My.md) |
| 13 | Assemblies, references, and NuGet | [13_Assemblies_References_And_NuGet.md](./13_Assemblies_References_And_NuGet.md) |
| 14 | COM interop and P/Invoke literacy | [14_COM_Interop_And_PInvoke_Literacy.md](./14_COM_Interop_And_PInvoke_Literacy.md) |
| 15 | WinForms and Windows Services doors | [15_WinForms_And_Windows_Services_Doors.md](./15_WinForms_And_Windows_Services_Doors.md) |
| 16 | Security and best practices | [16_Security_And_Best_Practices.md](./16_Security_And_Best_Practices.md) |
| 17 | Use cases and engineering perspectives | [17_Use_Cases_And_Engineering_Perspectives.md](./17_Use_Cases_And_Engineering_Perspectives.md) |
| 18 | Where VB.NET is going and adjacent doors | [18_Where_VBNet_Is_Going_And_Adjacent_Doors.md](./18_Where_VBNet_Is_Going_And_Adjacent_Doors.md) |

---

## Further reading

- [Visual Basic documentation (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
- [Visual Basic language reference](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/)
- [.NET documentation](https://learn.microsoft.com/en-us/dotnet/)
- [Download .NET SDK](https://dotnet.microsoft.com/download)
