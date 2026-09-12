# First steps: .NET SDK, VB projects, and hello

[← Back to VB.NET](./README.md)

## What this chapter covers

Your first **honest contact** with Visual Basic on .NET. By the end you should be able to:

1. Discover whether **`dotnet`** is on PATH and print a real SDK version.
2. List templates and confirm a **VB console** path exists (`-lang VB`)—or use Visual Studio when the CLI template is missing.
3. Create a tiny VB console project, run **hello**, and see IL-backed execution via `dotnet run`.
4. Know what “hello succeeded” proved—and what it did not.
5. Separate **modern .NET SDK** work from **.NET Framework 4.x** brownfield tooling.

If you do not yet know **what VB.NET is for**, skim chapter **[01](./01_What_VBNet_Is_And_Is_Not.md)**, then come back and *touch* the toolchain.

Handbook default for new work: **current Visual Basic on .NET** (language ~**17.x** era with Visual Studio **2022/2026**-class tooling) targeting a supported **`net8.0` / `net9.0` / `net10.0`** TFM. Discover your SDK; do not assume a laptop global matches CI. Shared SDK depth also lives in the [C# track’s environment chapter](../CSharp/2_Environment_Setup_And_DotNet_SDK.md).

Today’s picture: *one SDK + one `.vbproj` + something that prints*. Fuzzy PATH here makes every later chapter feel cursed.

---

## 1. Concepts

### 1. What you are about to start

VB.NET is not a host macro language and not a separate “VB runtime” you install alone. Starting modern VB means:

- installing a **.NET SDK** (compiler, runtime packs, `dotnet` CLI),
- creating a project that emits **IL** for the CLR / .NET runtime,
- writing `.vb` sources under an SDK-style **`.vbproj`**,
- building and running with **`dotnet build` / `dotnet run`** (or Visual Studio).

| Surface | Role |
|---------|------|
| **`dotnet` CLI** | Scaffold, restore, build, run, test |
| **`.vbproj`** | Project model: TFM, packages, compile items |
| **VB compiler** | Turns `.vb` into assemblies (via SDK) |
| **Runtime** | Executes IL (modern .NET or Framework on Windows) |

Same language family name as Office VBA—**different product**. See [VBA](../VBA/README.md) for macros; this track is for **.NET apps and services**.

### 2. Install sources (where `dotnet` comes from)

| Source | What to expect |
|--------|----------------|
| Official SDK installer / package | Preferred for CLI labs and CI agents |
| Visual Studio workload (Windows) | Ships SDK + designers; common for WinForms/WPF brownfield |
| Container / golden image | Whatever the image froze—verify with `dotnet --version` |
| Distro packages | Can lag; still print versions before trusting |

After install, **do not trust the marketing name alone**—ask the binary.

### 3. Discover what you actually have

```bash
command -v dotnet
type -a dotnet
dotnet --version
dotnet --list-sdks
dotnet --list-runtimes
```

| Habit | Why |
|-------|-----|
| `command -v dotnet` | Is anything on PATH? |
| `dotnet --version` | Default SDK the CLI will use |
| `dotnet --list-sdks` | Every installed SDK band |
| `dotnet --list-runtimes` | What can *run* (not just build) |

If `command -v dotnet` is empty, install an SDK from the official download hub (see **References**), then reopen the shell so PATH updates.

On Windows with Visual Studio only, open a **Developer PowerShell / Developer Command Prompt** if a plain terminal cannot see `dotnet`.

### 4. Confirm a VB console template exists

```bash
dotnet new list console
dotnet new console --help
```

Look for **Visual Basic** / `VB` among supported languages for the `console` template. Then try:

```bash
mkdir vb-hello && cd vb-hello
dotnet new console -lang VB -n VbHello
cd VbHello
dotnet run
```

Expect console output similar to `Hello World!` (wording varies slightly by SDK template vintage).

If `-lang VB` fails or VB is absent from `dotnet new list`:

| Path | When to use it |
|------|----------------|
| **Visual Studio** → create **Console App** with language **Visual Basic** | Windows desktop shops; workload may need **.NET desktop development** |
| Install / repair SDK so common templates include VB | CLI-first / Linux / macOS agents |
| Open an existing `.vbproj` and `dotnet build` | Brownfield literacy without scaffolding |

Honest rule: **the SDK you have is the source of truth**. Document which path your team actually uses.

### 5. Hello — read what the template gave you

Typical modern layout:

| Item | Role |
|------|------|
| `VbHello.vbproj` | SDK-style project; `TargetFramework` like `net8.0` / `net9.0` / `net10.0` |
| `Program.vb` | Module with `Sub Main` |
| `bin/` / `obj/` | Build outputs (do not hand-edit) |

Skeleton you should recognize:

```vb
Imports System

Module Program
    Sub Main(args As String())
        Console.WriteLine("Hello, VB.NET")
    End Sub
End Module
```

Run again after editing:

```bash
dotnet run
dotnet build
```

`dotnet run` restores if needed, builds, then executes. `dotnet build` stops at compile.

### 6. Pin the TFM you meant

```bash
dotnet new console -lang VB -n VbHelloNet8 --framework net8.0
```

| Habit | Why |
|-------|-----|
| Explicit `--framework` when org pins LTS | Laptop default ≠ support policy |
| Read `<TargetFramework>` in `.vbproj` | Ground truth for CI matrices |
| Match runtime pack on agents | Build SDK alone does not run older TFMs without packs |

Chapter **[02](./02_Projects_Modules_Namespaces_And_Entry_Points.md)** deepens projects, modules, and TFMs (`net8`/`net9`/`net10` vs `net48`).

### 7. Visual Studio path (when CLI is not your door)

On Windows:

1. Install Visual Studio with **.NET desktop development** (and/or ASP.NET workloads as needed).
2. **Create a new project** → filter **Visual Basic** → **Console App**.
3. Choose a modern .NET TFM for greenfield; use **.NET Framework** templates only for brownfield literacy.
4. **F5** / Start to run; use **Build** output for compiler errors.

You can still open the same folder in a terminal and run `dotnet build` if an SDK is installed—useful for CI parity.

---

## 2. Advanced concepts

### 1. SDK vs runtime vs language

| Piece | Question it answers |
|-------|---------------------|
| **SDK** | Can I *build* this project? |
| **Runtime / shared framework** | Can this machine *run* the built app? |
| **VB language version** | Which language features does the compiler accept? |

`dotnet --version` is not the same as “VB 17.x feature set,” but for staff onboarding it is the first reproducibility gate. Language version usually follows the SDK / Visual Studio toolset unless the project overrides it.

**Pin language version when features surprise you.** In the project file you can set `<LangVersion>` (for example a specific band, or `latest` / `default` per current tooling). “This keyword does not work” is often **LangVersion / SDK**, not “VB is broken.” Configure and document the version your CI compiles with—see official language-version guidance in References.

### 2. Multiple SDKs on one machine

`global.json` can pin an SDK band for a repo. Without it, the CLI picks a default—often the newest. CI that “just works” on a developer laptop may fail on an agent with only the LTS SDK. Print `dotnet --list-sdks` in the pipeline log.

### 3. .NET Framework 4.x brownfield

Legacy WinForms/WPF/services often target **`net48`** (or older `v4.x` non-SDK projects). Literacy notes:

| Modern SDK-style | Classic Framework |
|------------------|-------------------|
| `dotnet new` / SDK `.vbproj` | Older `.vbproj` / packages.config possible |
| Cross-platform TFMs | Windows-centric runtime |
| `dotnet run` everyday | Visual Studio + MSBuild still common |

Do not force a Framework LOB app onto `net9.0` in a hello lab. Learn Framework enough to **open, build, and review**—modernize deliberately later.

### 4. What “hello succeeded” actually proved

| Proved | Not proved |
|--------|------------|
| SDK + VB compile path works | Correct NuGet trust / supply chain |
| Entry point runs on this runtime | Thread-safety, config, secrets handling |
| Template language is VB | WinForms designer, COM, or service install |

First gate only—then deepen in later chapters.

### 5. Cron / CI / container gotchas (preview)

Jobs fail when:

- agents lack the SDK (runtime-only images),
- PATH points at a different `dotnet` than the job expects,
- TFM requires a runtime pack not present on the agent,
- working directory is wrong so the `.vbproj` is not found.

Always print `dotnet --version` / `--list-sdks` at the start of the build job.

### 6. Editors without Visual Studio

VS Code / Cursor + C# Dev Kit (or equivalent) can edit VB and invoke `dotnet`. IntelliSense quality varies; **CI `dotnet build`** remains the contract. Do not equate “editor is quiet” with “project builds.”

---

## 3. Applications and use cases

| Angle | How first steps show up |
|-------|-------------------------|
| **Application** | Feature branches build with the same `dotnet` band as release. |
| **Systems** | Images and build agents include SDK + needed runtimes for every TFM in the matrix. |
| **Security** | Writable global tool caches and random SDK drops on bastions are supply-chain footguns—prefer pinned images. |
| **Ops** | On-call: “which SDK built this artifact?” and “which runtime is on the box?” |
| **SE** | Onboarding without a printed `dotnet --version` wastes days on Framework vs modern .NET confusion. |

**Whole-engineering picture:** hello is the reproducibility gate. Types, procedures, and collections reviews all assume you can name the SDK that will compile the change.

---

## 4. Staff-level review checklist

- Runbook / README states how to get **`dotnet`** and prints expected SDK band.
- CI logs `dotnet --version` (and ideally `--list-sdks`) before build.
- Team documents **CLI `-lang VB`** *or* **Visual Studio** as the supported scaffold path—not folklore.
- Newcomers can run hello: create, `dotnet run`, see output.
- Greenfield TFM matches support policy (`net8`/`net9`/`net10`); Framework targets are **labeled** brownfield.
- Agents that only have runtimes are not asked to *build*.
- VBA / Office macro work is not mixed into this repo’s “VB” mental model—link [VBA](../VBA/README.md) when needed.
- Laptop SDK drift vs CI is treated as a defect, not a personality trait.
- When a language feature “is missing,” reviewers check **LangVersion** / SDK pin before blaming VB.

---

## References

- [Download .NET SDK](https://dotnet.microsoft.com/download)
- [.NET CLI overview](https://learn.microsoft.com/en-us/dotnet/core/tools/)
- [`dotnet new` templates](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-new-sdk-templates)
- [Create a .NET console app](https://learn.microsoft.com/en-us/dotnet/core/tutorials/with-visual-studio-code?pivots=vb)
- [Configure the Visual Basic language version](https://learn.microsoft.com/en-us/dotnet/visual-basic/language-reference/configure-language-version)
- [Visual Basic documentation](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
- [Visual Studio — VB console tutorial](https://learn.microsoft.com/en-us/visualstudio/get-started/visual-basic/tutorial-console)
- [What's new for Visual Basic](https://learn.microsoft.com/en-us/dotnet/visual-basic/whats-new/)
