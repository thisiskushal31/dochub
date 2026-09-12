# WinForms and Windows Services doors

[← Back to VB.NET](./README.md)

## What this chapter covers

A **door**, not a designer textbook: where **VB.NET** still shows up in **Windows Forms (WinForms)** line-of-business apps and **Windows Services**, what ops and security staff should recognize, and which **migration doors** are honest. Default narrative for greenfield: **modern .NET**. Honest brownfield: many estates still run **.NET Framework** WinForms/services—say so in runbooks.

Designer depth, control galleries, and full service-recovery encyclopedias live in product docs. Shared SDK literacy: [C# environment setup](../CSharp/2_Environment_Setup_And_DotNet_SDK.md). Office macros are not this world—[VBA](../VBA/README.md).

---

## 1. Concepts

### 1. Why these doors matter for staff

VB.NET did not disappear with marketing cycles. Internal tools, manufacturing floor UIs, finance helpers, and long-running Windows Services still ship or linger in **VB WinForms** and **VB service** projects. Staff who only know web stacks miss:

- Desktop **identity and file** assumptions (user profile, mapped drives, interactive desktop).
- Service **session 0** isolation and account choice.
- Framework vs modern .NET **runtime install** on images.

### 2. WinForms LOB — recognition map

| Piece | Literacy |
|-------|----------|
| `.vbproj` + WinForms SDK/pack | Project type; TFM (`net48` vs `net8.0-windows`, etc.) |
| `Form` / designer `.Designer.vb` | Generated UI code; merge carefully |
| STA / UI thread | UI updates must marshal to the UI thread |
| `app.config` / `appsettings` | Config and connection strings—secret hygiene in ch **16** |
| ClickOnce / MSI / Intune | How the binary reaches the desktop |

WinForms is a **Windows desktop UI** stack. It is not a substitute for ASP.NET, and it is not VBA UserForms ([VBA UserForms door](../VBA/10_UserForms_And_Microsoft_Forms_Door.md) if present in that track—different host). **WPF** and **WinUI** are sibling Windows UI stacks—recognize them when you open a solution; this chapter does not teach their designers. Route deeper desktop UI craft to official WinForms/WPF/WinUI docs after you can read the project’s TFM and install story.

### 3. Windows Services — recognition map

| Piece | Literacy |
|-------|----------|
| Service process | No interactive desktop by default |
| Service account | Least privilege vs “LocalSystem because it worked” |
| Recovery options | Restart on failure—ops owns this |
| Dependencies | Start order vs SQL/network shares |
| Logging | Event Log / structured logs—not `MsgBox` |

Modern .NET prefers **Worker Service** / generic host patterns; brownfield Framework **`ServiceBase`** projects remain common. Name what you have; do not pretend every service is already a containerized worker.

### 4. Ops angles (what breaks at 2 a.m.)

| Symptom class | Typical door cause |
|---------------|--------------------|
| “Works when I double-click, fails as service” | Interactive vs service session; drive letters; UI assumptions |
| Access denied to path/share | Service account ACL, not “VB bug” |
| Crashes after Windows update | Runtime/Framework targeting; native/COM bitness (ch **14**) |
| Config works on one PC | Machine.config / transform / secret store mismatch |

### 5. Security angles (review, not exploit)

- Desktop apps inherit the **logged-on user**—powerful and dangerous for lateral paths if the app shells out or loads plugins.
- Services often over-privilege; demand **least privilege** accounts and scoped network rights.
- Auto-start services expand **persistence** surface—inventory and owners matter.
- Dependencies (NuGet, COM, native) still apply—chs **13–14**, **16**.

---

## 2. Advanced concepts

### 1. Framework brownfield vs modern .NET WinForms

| Topic | Framework LOB | Modern .NET |
|-------|---------------|-------------|
| TFM | `net48`-class | `net8.0-windows` (example pin—use your org’s LTS) |
| Install | .NET Framework on Windows image | Desktop runtime / hosting bundle as designed |
| APIs | Some Windows-only APIs assumed | Windows TFM still required for WinForms |
| Migration | In-place or strangler | Retarget + test UI and installers |

Migration is a **program**, not a checkbox. UI test debt, printer drivers, and COM add-ins dominate calendars—not VB syntax.

### 2. UI thread and async literacy

Async I/O in WinForms is valuable; blocking the UI thread freezes the app. Staff smell: `Thread.Sleep` on the UI thread, or updating controls from background threads without marshaling. Prefer documented patterns from .NET WinForms guidance; keep business logic out of event handlers when extracting for migration.

### 3. Packaging and update channels

ClickOnce, MSI/MSIX, ConfigMgr/Intune, and “share a folder of EXE” are different trust and update stories. Review: who signs the package, how secrets are deployed, and whether users can sideload unsigned builds.

### 4. Service hosting alternatives

When modernizing, ask whether the workload still needs a **Windows Service**:

| Need | Door |
|------|------|
| Always-on Windows box job | Worker Service / Windows Service |
| Scheduled batch | Task Scheduler / orchestrator—not a fake service |
| HTTP API | Web host / reverse proxy |
| Cross-platform daemon | Modern .NET worker—not WinForms |

### 5. Related handbook doors

- Assemblies and packages: ch **13**, [C# NuGet](../CSharp/18_NuGet_And_Testing.md)
- COM/P/Invoke in desktop helpers: ch **14**
- Security hygiene: ch **16**
- Role map and what to learn next: chapters **17–18**

### 6. What “door literacy” is enough to claim

You are done with this chapter when you can, from a repo and a runbook alone:

1. Name the project type (WinForms app vs Windows Service vs worker).
2. Name TFM / runtime and how it is installed on target machines.
3. Name the identity the process runs as and why that identity has its rights.
4. Point modernizers at extract-library-then-UI (ch **18**) instead of “redesign every control.”

You are **not** expected to memorize the WinForms designer property grid.

---

## 3. Applications and use cases

| Still fits | Migrate when |
|------------|--------------|
| Internal Windows-only LOB with local devices (scanners, label printers) | Users need browser/cross-platform access |
| Supervisory UI beside a machine | Logic should be a service/API with a thin client |
| Small ops utility with signed MSI | Unattended work stuffed into a hidden form |
| Owned Windows Service with clear account | LocalSystem + Excel Automation “because reporting” |

Success for this door: you can **classify** the project, name TFM and install channel, and point modernizers at the right next track—not paint every form control from memory.

---

## 4. Staff-level review checklist

- Identify TFM: Framework vs modern .NET Windows; document runtime prerequisites for ops images.
- Separate UI project concerns from business logic—note where logic is trapped in event handlers.
- For services: record service account, recovery settings, and dependencies in the runbook.
- Reject LocalSystem / admin service accounts without a written least-privilege exception.
- Check for UI or `CreateObject`/Office Automation inside service code (ch **14**)—usually a redesign flag.
- Confirm logging works non-interactively (no reliance on message boxes).
- Inventory installer/update channel and code signing expectations.
- Review config secret handling (ch **16**)—connection strings in cleartext `app.config` are a finding.
- Plan migration as product risk (UI + COM + printers), not “convert language only.”
- Cross-link shared SDK/NuGet depth to the [C# track](../CSharp/README.md) when the question is platform, not VB syntax.

---

## References

- [Windows Forms overview](https://learn.microsoft.com/en-us/dotnet/desktop/winforms/overview/)
- [Create Windows Service apps](https://learn.microsoft.com/en-us/dotnet/core/extensions/windows-service)
- [Worker Services in .NET](https://learn.microsoft.com/en-us/dotnet/core/extensions/workers)
- [.NET Framework Windows Services (legacy)](https://learn.microsoft.com/en-us/dotnet/framework/windows-services/introduction-to-windows-service-applications)
- [C# — Environment setup and .NET SDK](../CSharp/2_Environment_Setup_And_DotNet_SDK.md)
- [C# track README](../CSharp/README.md)
- [VBA track README](../VBA/README.md)
- [VB.NET README](./README.md)
