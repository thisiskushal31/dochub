# Declare and Win32 API literacy

[← Back to VBA](./README.md)

## What this chapter covers

**`Declare`** literacy for VBA on Windows: calling into DLLs (often Win32) from a macro, why **64-bit Office** requires **`PtrSafe`**, **`LongPtr`**, and careful pointer-sized types, and why **line-of-business (LOB) macros almost never need this**. Pair with chapters **07** (`CreateObject` / Automation), **11** (`Shell` / FSO), and **15** (ASR and macro policy). Goal: staff can **recognize**, **review**, and **refuse** casual API declarations—not invent a Win32 programming course inside Excel.

This track does **not** teach how to weaponize API calls, bypass ASR, or evade controls. Prefer host **object-model** methods whenever they exist.

---

## 1. Concepts

### 1. What `Declare` is

A **`Declare`** statement tells VBA that a procedure lives in an external DLL and how to marshal arguments. It is a **trust boundary**: the macro leaves the Office object model and enters native code with the privileges of the Office process.

Mental model:

> Host OM = intended power for documents.  
> `Declare` = optional escape hatch into OS/native APIs.  
> Escape hatches are review hotspots—for good macros and for malware (see **15–16**).

Staff rule for LOB work: **if Excel/Word/Outlook already expose the behavior, use the OM**—do not reach for `kernel32` / `user32` because a blog snippet did.

### 2. Why LOB rarely needs Win32 from VBA

Typical business macros need ranges, documents, mail items, files under known paths, or controlled Automation to another Office app. Those jobs live in chapters **08–11**. Win32 from VBA shows up when someone wants:

| Temptation | Prefer instead |
|------------|----------------|
| Message boxes / UI chrome | `MsgBox`, UserForms (**10**), host dialogs |
| File copy / folder ops | FSO / `Open` / host SaveAs (**11**) |
| Launch a helper process | Avoid; if required, ops-owned PowerShell/service—not ad-hoc `Shell`+API |
| “Read a registry key” | Config workbook, Group Policy, managed settings |
| Window handles / SendInput-style tricks | Almost always wrong hammer for LOB |

If the requirement is “talk to Windows like a desktop app,” you are usually past VBA’s honest scope—see chapter **18** (VB.NET, Add-ins, Power Automate).

### 3. 32-bit vs 64-bit Office (why `PtrSafe` exists)

Office VBA historically declared many APIs with **`Long`** for pointers and handles. On **64-bit Office**, pointers are 64-bit; those declarations are wrong and can crash or corrupt memory.

Modern literacy:

| Token | Role |
|-------|------|
| **`PtrSafe`** | Marks a Declare as safe for 64-bit VBA (required on 64-bit hosts for new Declares) |
| **`LongPtr`** | Pointer-sized integer (32-bit or 64-bit depending on host) |
| **`LongLong`** | 64-bit integer (64-bit VBA) |
| Conditional compilation | `#If VBA7` / `#If Win64` patterns to support mixed estates |

You will see dual blocks in brownfield code: one Declare for older VBA, one `PtrSafe` path for VBA7+. Staff habit: **do not copy Declares without knowing which Office bitness your org ships**.

Illustrative shape only (not a recipe to expand):

```vb
#If VBA7 Then
    Private Declare PtrSafe Function GetTickCount Lib "kernel32" () As Long
#Else
    Private Declare Function GetTickCount Lib "kernel32" () As Long
#End If
```

Even “harmless” examples still enlarge the native surface. Prefer deleting the Declare if the host already provides an equivalent.

### 4. Review smell — what defenders and reviewers look for

When scanning modules (including hostile samples in **16**), `Declare` / `PtrSafe` / DLL names are **high-signal**:

| Smell | Why it matters |
|-------|----------------|
| Many Declares into `kernel32`, `ntdll`, `urlmon`, etc. | Native capability beyond the workbook story |
| String-built DLL or alias names | Harder static review; often unnecessary for LOB |
| Mixing `Declare` with `CreateObject("WScript.Shell")` / `Shell` | Stacked escape hatches (**11**, **14**) |
| “Helper” modules that only wrap APIs | Often copy-pasted; ownership unclear |
| No comment tying Declare to a business requirement | Likely convenience, not design |

ASR includes rules that **block Win32 API calls from Office macros** in many enterprises (**15**). Even legitimate Declares may be **policy-blocked**—another reason LOB should stay on the OM.

### 5. Prefer object-model methods

Decision order for staff:

1. **Host OM** (Excel/Word/Outlook APIs).
2. **Documented Office Automation** to another host (`CreateObject` / early binding) with clear lifecycle (**07**).
3. **Controlled file I/O** under known paths (**11**)—still a trust boundary, but within VBA’s normal story.
4. **Out-of-proc tooling** owned by ops (scheduled task, approved script host)—not embedded Win32.
5. **`Declare`** only with written justification, bitness-correct signatures, and security sign-off.

---

## 2. Advanced concepts

### 1. Marshaling pitfalls (literacy, not a P/Invoke course)

Wrong types, wrong `ByRef`/`ByVal`, and wrong string modes (`Ansi` vs Unicode aliases) cause subtle failures. Staff takeaways:

- Treat every Declare as **ABI**: get it wrong and you risk instability, not just a VBA `Err`.
- Prefer **not** declaring APIs that need complex structs unless a platform team owns the signatures.
- Macros that “sometimes crash only on 64-bit Office” often have pre-`PtrSafe` debt.

### 2. Compatibility compilation flags (`#If VBA7` / `#If Win64`)

Brownfield estates may still run 32-bit Office beside 64-bit Microsoft 365 Apps. Conditional compilation keeps one codebase compiling on both—but it also **doubles review surface**. Migration preference: remove Declares rather than perfect the `#If` maze.

Official Declare-statement literacy matches this nested shape (sketch—not an API menu to expand):

```vb
#If VBA7 Then
    ' VBA7+: PtrSafe Declares; LongPtr for pointers/handles
    #If Win64 Then
        ' 64-bit Office VBA7 — pointers are 64-bit
        Private Declare PtrSafe Function GetActiveWindow Lib "user32" () As LongPtr
    #Else
        ' 32-bit Office VBA7 — still PtrSafe; LongPtr is 32-bit wide here
        Private Declare PtrSafe Function GetActiveWindow Lib "user32" () As LongPtr
    #End If
#Else
    ' Pre-VBA7 (legacy 32-bit VBA6-era Declares)
    Private Declare Function GetActiveWindow Lib "user32" () As Long
#End If
```

| Flag | Meaning (staff) |
|------|-----------------|
| `VBA7` | VBA7+ compiler (Office 2010-era onward)—use `PtrSafe` / `LongPtr` path |
| `Win64` | Host is 64-bit Office—confirm pointer-sized types truly hold 64-bit values |
| `PtrSafe` | Required on 64-bit Office Declares; not a substitute for fixing types |

`PtrSafe` alone is insufficient if parameters/returns that store pointers still say `Long` on Win64. Prefer deleting the Declare when the OM covers the need (Concepts §5).

### 3. Interaction with macro security and ASR

Even a correctly typed `PtrSafe` Declare can be irrelevant if:

- Macros from the internet are blocked (**15**).
- Trusted Locations / notification settings prevent the project from running.
- ASR **Block Win32 API calls from Office macros** is enabled in audit or block mode.

Design implication: **do not build LOB features that require Win32 Declares** if your baseline will block them. Build on OM + approved services instead.

### 4. Relation to VBScript / WSH

VBScript historically reached OS power via **COM** (`WScript.Shell`, FSO) more than VBA-style `Declare`. Chapter **14** covers that brownfield. Hostile documents sometimes combine VBA Declares **and** `CreateObject`—review both (**16**).

### 5. What this chapter refuses to teach

- How to pick APIs for process injection, credential theft, or sandbox escape.
- How to obfuscate Declare names or stage shellcode.
- How to bypass ASR, AMSI, or macro policies.

Literacy stops at **recognition, preference for OM, and policy awareness**.

---

## 3. Applications and use cases

### Application

- Legacy add-ins that once called Win32 for UI or timers—plan OM or Office Add-in replacements (**18**).
- Documented exceptions (rare): accessibility hooks owned by a desktop engineering team with PtrSafe standards.

### Systems

- Image baselines: 32-bit vs 64-bit Office dictates whether old Declares even load.
- AppLocker / WDAC / ASR posture may make Declare-dependent macros dead on arrival.

### Security

- Static hunts and PR review: flag `Declare` / `PtrSafe` / unusual `Lib` names.
- Correlate with MotW / macro block policies so “it works on my Trusted Location” is not the only story (**15**).

### Operations

- Break/fix when Office channel moves 32→64-bit and Declares were never updated.
- Prefer removing Declares during remediation windows rather than “fixing” them under time pressure.

### Software engineering

- Codeowners: no anonymous API modules.
- Tests on both bitnesses if Declares must remain.
- Written ADR: why OM was insufficient.

| Role | Question |
|------|----------|
| SE | Can this be an OM call or external approved tool? |
| Ops | Will ASR/bitness break this on next image? |
| Security | What native capability does this Declare unlock? |
| App owner | Is this exception worth support forever? |

---

## Staff-level review checklist

- Every `Declare` has a business justification; default outcome is **delete and use OM**.
- 64-bit path uses `PtrSafe` and pointer-sized types (`LongPtr` where appropriate); bitness of target Office is named.
- `#If VBA7` / `#If Win64` blocks match Declare-statement Learn guidance—not copy-paste folklore.
- Pre-VBA7 `#Else` Declares are intentional brownfield only; 64-bit Office pins cannot use them.
- Pointer/handle parameters are `LongPtr` (or documented equivalent)—not bare `Long` on Win64.
- No string-built or unnecessary DLL surface for LOB features.
- `Declare` modules are not combined casually with `Shell` / `WScript.Shell` / broad `CreateObject` (**11**, **14**).
- Authors know ASR may **block Win32 API calls from Office macros** (**15**); feature still works under org baseline.
- Alternatives considered: host APIs, Power Automate, Add-ins, PowerShell-owned helpers (**18**).
- Brownfield `#If VBA7` blocks reviewed for drift and dead 32-bit-only assumptions.
- Hostile-sample readers treat Declares as high-signal without enabling macros on the endpoint of record (**16**).
- No secret or token handling introduced “because the API can read memory/files.”
- Change reviewed by someone who can say “this is not needed” and make it stick.

---

## References

- [Declare statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/declare-statement)
- [PtrSafe keyword](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/ptrsafe-keyword)
- [LongPtr data type](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/longptr-data-type)
- [64-bit Visual Basic for Applications overview](https://learn.microsoft.com/en-us/office/vba/language/concepts/getting-started/64-bit-visual-basic-for-applications-overview)
- [Office VBA language reference / overview](https://learn.microsoft.com/en-us/office/vba/api/overview/)
- [VBA language reference](https://learn.microsoft.com/en-us/office/vba/api/overview/language-reference)
- [Attack surface reduction rules reference](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-reference)
- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
