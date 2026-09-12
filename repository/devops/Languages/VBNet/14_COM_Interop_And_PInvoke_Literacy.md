# COM interop and P/Invoke literacy

[← Back to VB.NET](./README.md)

## What this chapter covers

**Recognition and review literacy** for VB.NET code that crosses into **COM** (including Office Automation-style `CreateObject`) or **native DLLs** via **P/Invoke** (`Declare` / `DllImport`). Audience: maintainers, ops, and security reviewers who need to know what the boundary means—not how to weaponize it.

Office **VBA** macros are a different host and trust story—see the [VBA track](../VBA/README.md). Shared .NET runtime setup: [C# SDK chapter](../CSharp/2_Environment_Setup_And_DotNet_SDK.md). This chapter does **not** provide evasion, injection, or malware recipes.

---

## 1. Concepts

### 1. Two escape hatches off “pure managed”

| Hatch | Rough idea | Trust implication |
|-------|------------|-------------------|
| **COM interop** | Talk to COM servers / RCWs (often Office, legacy LOB) | Process identity + COM registration / permissions |
| **P/Invoke** | Call unmanaged exports in DLLs | Native ABI; memory and privilege of the process |

Mental model:

> Managed VB.NET = CLR types and BCL.  
> COM / P/Invoke = intentional leave of that sandbox into OS or another server’s rules.  
> Escape hatches are **review hotspots**.

### 2. Early binding vs late binding (COM)

| Style | Typical shape | Review notes |
|-------|---------------|--------------|
| **Early binding** | Reference a COM type library / interop assembly; typed objects | Clearer compile-time contracts; version coupling to installed server |
| **Late binding** | `CreateObject("ProgId")`, `CallByName`, `Object` | Flexible; weaker static review; easy to hide intent in strings |

Late binding is not “evil”—it is **opaque**. Staff habit: demand a business reason, ProgId inventory, and failure behavior when the COM server is missing.

Illustrative recognition only:

```vb
' Late binding smell: ProgId as string, Object receiver
Dim app As Object = CreateObject("Excel.Application")
```

Prefer documented interop assemblies and disposal/quit patterns for LOB—and keep Office automation **out of servers** when a file-format API or export pipeline would do.

### 3. P/Invoke literacy: `Declare` and `DllImport`

VB.NET can declare native entry points with **`Declare`** (VB-flavored) or attributes familiar from C# (**`DllImport`**). Same ABI risks as any .NET P/Invoke: wrong types, wrong `CharSet`, wrong `SetLastError` habits, and lifetime bugs.

| Token | Role |
|-------|------|
| Library name | Which DLL is loaded |
| Entry point / Alias | Which export |
| Marshaling | How .NET values become native |
| Calling convention | Must match the export |

Staff rule for LOB: **if the BCL or a supported library already does it, do not P/Invoke**. Copy-pasted `user32` / `kernel32` blocks from old forums are debt, not design.

### 4. Why defenders care

| Signal | Why it matters |
|--------|----------------|
| Many native Declares | Capability beyond the app’s stated job |
| String-built ProgIds or DLL names | Harder static review |
| COM + file drops + network in one module | Stacked trust boundaries |
| Automation of Office from a service account | Often fragile and over-privileged |
| No owner comment on why native/COM is required | Convenience over design |

This is **detection and maintenance literacy**, not a bypass guide. Prefer reducing surface: delete unused Declares; replace COM with managed libraries where honest.

### 5. VB.NET vs VBA vs VB6 nostalgia

| World | Runtime | COM story |
|-------|---------|-----------|
| **VBA** | Office host | OM + `CreateObject` inside documents—[VBA](../VBA/README.md) |
| **VB.NET** | CLR / .NET | Interop assemblies, RCW, optional late binding |
| Classic VB6 | Separate era | Migration sources; do not assume identical semantics |

Syntax familiarity does not mean the same security model. A VB.NET Windows service that `CreateObject`s Excel is not “just like a macro”—it is an **unattended automation** design with ops and licensing consequences.

---

## 2. Advanced concepts

### 1. RCW lifetime and “Excel won’t quit”

COM interop creates **Runtime Callable Wrappers**. Failing to release references (especially with UI apps) leaves orphan processes. Staff checklist: explicit Quit/Close where the OM requires it, avoid circular refs, and test under the **same bitness** as the COM server (32 vs 64).

### 2. Bitness and registration

COM servers and native DLLs are often **bitness-specific**. A 64-bit .NET process will not magically load a 32-bit in-proc server. Review smell: “works on my IIS / works on my laptop” without documenting **AnyCPU vs x86 vs x64** and registered ProgIds.

### 3. Marshaling pitfalls (literacy ceiling)

Wrong `ByRef`/`ByVal`, `IntPtr` vs `Integer`, and ANSI vs Unicode string modes cause crashes or data corruption—not polite VB exceptions. Platform-owned signatures beat tribal copy-paste. If the Declare needs complex structs, ask whether a supported managed API exists instead.

### 4. `ComVisible` and exposing .NET to COM

.NET assemblies can be exposed **to** COM consumers. That is a product decision: versioning, registration, and security boundaries change. Review: is `ComVisible` intentional? Are public APIs minimized? Is registration automated and least-privileged?

### 5. Safe review posture

- Prefer **read-only** inventory of ProgIds and DLL names in source.
- Run unknown samples only in **isolated** lab VMs with snapshots—not on an analyst’s daily driver.
- Do not “enable everything” to see what happens; instrument and reduce.

### 6. Adapter-layer habit

Keep COM and P/Invoke behind a **small adapter project** with a managed-facing API. Benefits:

- UI and domain code stay reviewable without native noise.
- You can swap a COM server for a managed library later without rewriting forms.
- Security reviewers get one folder to inventory instead of a scavenger hunt.

Smell: `DllImport` and `CreateObject` sprinkled through button click handlers.

---

## 3. Applications and use cases

| Legitimate door | Honest alternative when possible |
|-----------------|----------------------------------|
| Controlled Office document generation on a desktop helper | Open XML / file APIs; avoid live Excel UI on servers |
| Talking to a vendor COM component you own | Keep interop thin; version-pin the server |
| Thin P/Invoke to a vendor native SDK | Prefer official .NET bindings; isolate in one adapter project |
| Migrating VB6 COM-heavy LOB | Incremental; inventory ProgIds; plan bitness |

Wrong hammer: embedding unbounded Automation and native calls in the same UI event handlers with no adapter layer.

---

## 4. Staff-level review checklist

- Inventory every `CreateObject` / `GetObject` ProgId and justify each.
- Prefer early-bound interop for LOB you maintain; treat late binding as higher review cost.
- Flag P/Invoke / `Declare` / `DllImport` blocks: DLL name, entry point, and business reason required.
- Verify process bitness matches COM servers and native DLLs.
- Reject Office Automation inside long-running services unless architecture explicitly owns it.
- Ensure COM objects are released/Quit’d; watch for orphan native processes in test.
- Keep interop and P/Invoke behind a small adapter project—not sprinkled through UI code.
- Do not treat strong naming or “it’s internal” as a substitute for reducing native/COM surface.
- Separate VBA macro incidents ([VBA track](../VBA/README.md)) from VB.NET interop reviews—different hosts.
- Never expand review into malware authoring, ASR bypass, or evasion how-tos—reduce and contain only.

---

## References

- [Visual Basic documentation (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
- [COM interop in .NET](https://learn.microsoft.com/en-us/dotnet/standard/native-interop/cominterop)
- [Platform Invoke (P/Invoke)](https://learn.microsoft.com/en-us/dotnet/standard/native-interop/pinvoke)
- [CreateObject function (Visual Basic)](https://learn.microsoft.com/en-us/dotnet/api/microsoft.visualbasic.interaction.createobject)
- [VBA track README](../VBA/README.md)
- [C# — Environment setup and .NET SDK](../CSharp/2_Environment_Setup_And_DotNet_SDK.md)
- [VB.NET README](./README.md)
