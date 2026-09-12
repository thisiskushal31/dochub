# Files, FSO, Environ, and Shell

[← Back to VBA](./README.md)

## What this chapter covers

How VBA reaches the filesystem and process environment: **FileSystemObject (FSO)**, classic `Open` / `Close` / `Print` / `Input`, `Dir` / `Kill`, **`Environ`**, the **`Shell` function**, and late-bound **`WScript.Shell`** as a **review hotspot**. Path discipline and **secrets never in code** are first-class. Default: **Microsoft 365 Apps VBA on Windows**.

Framing for staff and defenders: these APIs enable legitimate LOB import/export and also appear in hostile macros. This chapter teaches **what they are and how to review them**—not how to build malware, bypass controls, or weaponize launchers. Policy depth is chapter **15**; safe sample reading is **16**. Object creation mechanics are chapter **07**.

---

## 1. Concepts

### 1. Path discipline first

Before any API:

- Prefer **allowlisted directories** (org data share, known `%LOCALAPPDATA%` app folder).
- Build paths with joining helpers—not raw concatenation of untrusted strings.
- Reject path traversal (`..\`) when any segment is user-supplied.
- Decide encoding (text vs binary) up front.

VBA will happily overwrite or delete if you tell it to. Treat file I/O as privileged.

### 2. FileSystemObject (FSO)

Late-bound shape (common when avoiding a Tools → References dependency):

```vb
Dim fso As Object
Set fso = CreateObject("Scripting.FileSystemObject")
If fso.FileExists(path) Then
    ' read or branch
End If
Set fso = Nothing
```

| Area | Typical members (literacy) |
|------|----------------------------|
| Paths | `BuildPath`, `GetParentFolderName`, `GetFileName`, `GetExtensionName` |
| Existence | `FileExists`, `FolderExists` |
| Create/delete | `CreateFolder`, `DeleteFile`, `DeleteFolder` (destructive—review hard) |
| Streams | `OpenTextFile` → `ReadLine` / `WriteLine` / `Close` |

FSO is the usual modern-ish choice for path work inside VBA. It is still COM (`CreateObject`)—justify it in review (chapter **07**).

### 3. Classic file I/O

```vb
Dim n As Integer
n = FreeFile
Open path For Input As #n
' Line Input #n, line
Close #n
```

| Mode | Use |
|------|-----|
| `For Input` | Read sequential text |
| `For Output` | Create/overwrite text |
| `For Append` | Append text |
| `For Binary` | Byte-oriented literacy |

Always `Close` in cleanup paths (chapter **05**). Classic I/O predates FSO; both appear in brownfield macros—pick one style per project.

### 4. `Dir` and `Kill`

| Function | Role |
|----------|------|
| `Dir(path)` | Existence / enumerate simple patterns |
| `Kill path` | Delete files matching a path/pattern |

`Kill` is destructive and pattern-capable—review any use that is not a tightly scoped temp cleanup. Prefer explicit single-file deletes with existence checks when possible.

### 5. `Environ` — environment variables (review smell)

```vb
Dim temp As String
temp = Environ$("TEMP")
```

Common legitimate reads: `TEMP`, `TMP`, `USERPROFILE`, `LOCALAPPDATA`, `USERNAME`. Environment values are **attacker-influenced** in some scenarios and **machine-specific**—do not assume they form a secret store. Never put credentials in environment variables and then hard-code the variable name as if that were security.

**Review smell (sharpened):** treat every `Environ` / `Environ$` as a trust input, not “just a path helper.”

| Smell | Why reviewers flag it |
|-------|------------------------|
| Building command lines from `Environ` + sheet text | Injection / unexpected executable roots |
| Assuming `TEMP` is private or trustworthy | Shared, predictable, often MotW-adjacent drop zones |
| Using env vars as a credential vault | Not confidentiality; visible to other processes under the same user |
| Odd names beyond known location vars | May be staging for another component—demand a comment |

Prefer org-known install roots or `ThisWorkbook.Path` (with empty-path guards) when the workbook owns the data. Expand strings only after allowlisting the variable name.

### 6. `Shell` function — review surface

VBA `Shell` starts a program asynchronously and returns a task ID:

```vb
' Legitimate shape — fixed executable path, no untrusted concatenation
' Dim tid As Double
' tid = Shell(Environ$("COMSPEC") & " /c echo hello", vbHide)
```

Staff rules:

- Prefer **not** shelling out when the Office OM or FSO can do the job.
- If you must, use **fixed** executables and **allowlisted** arguments.
- Never concatenate unsanitized worksheet cells into a command line (injection).
- Document why `vbHide` / window style is required—hidden launches are a defender signal.

This handbook does not teach payload construction, living-off-the-land chains, or evasion. If `Shell` appears in a sample you did not expect, escalate via chapter **16** habits and org IR—not by “trying it.”

### 7. `WScript.Shell` — late-bound hotspot

`CreateObject("WScript.Shell")` exposes a script-host automation object (expand environment strings, run, registry helpers, etc.). In LOB review it is a **red flag requiring justification**. In malicious macros it is a frequent pivot. Literacy:

- Recognize the ProgID.
- Demand a written business reason and least privilege.
- Prefer native VBA/`Environ`/`FSO` when they suffice.
- Pair with chapter **14** (VBScript/WSH deprecation) and **15** (ASR/AMSI/macro policy).

Do not expand this section into a how-to for Run/RegWrite abuse.

### 8. Lab — controlled text read

```vb
Sub ReadConfigLine()
    Dim fso As Object, ts As Object
    Dim path As String, line As String
    path = ThisWorkbook.Path & Application.PathSeparator & "config.txt"
    Set fso = CreateObject("Scripting.FileSystemObject")
    If Not fso.FileExists(path) Then Exit Sub
    Set ts = fso.OpenTextFile(path, 1) ' ForReading
    If Not ts.AtEndOfStream Then line = ts.ReadLine
    ts.Close
    Set ts = Nothing
    Set fso = Nothing
End Sub
```

**What just happened:** path anchored next to the workbook; existence checked; stream closed; references released.

---

## 2. Advanced concepts

### 1. `ThisWorkbook.Path` vs empty path

Unsaved workbooks have empty `Path`—concatenation then points at wrong places. Guard before building paths. Distributed add-ins may prefer known install directories under Program Files or a managed AppData root.

### 2. Mark of the Web and downloads

Writing executables or scripts into Temp from a macro is an ops/security incident waiting to happen—even if “the business asked for it.” Prefer data formats (CSV, approved report folders). Internet-origin Office files already face macro blocks (chapter **15**).

### 3. Secrets never in code

No passwords, API keys, connection strings, or tokens in VBA source, hidden sheets, or UserForm defaults (chapter **10**). Use org secret stores, SSO, or user-provided sessions. Review greps for `password`, `apikey`, `Bearer`, and `CreateObject("…Shell")` together.

### 4. Encoding and locale

Text files inherit encoding assumptions. FSO text streams have format arguments; classic I/O is easy to get wrong with UTF-8. Agree on UTF-8 with BOM/known adapters for cross-team CSV, or use Excel’s own import features when appropriate.

### 5. Network paths and credentials

UNC paths work when the user token can access them. Macros do not magically gain admin rights. Failures are often Kerberos/AuthZ—not VBA bugs. Do not embed alternate credentials in macros.

### 6. VBScript overlap

Many FSO/`WScript.Shell` patterns originated in `.vbs` (chapter **14**). Seeing them in VBA often means “ported script”—migrate capability to PowerShell or managed services when greenfield.

### 7. Defender / ASR view (literacy)

Attack surface reduction and AMSI-related controls may inspect or block Office processes that spawn child processes or use certain script behaviors. Legitimate LOB that shells out must be inventoried with security teams—do not “tune around” controls casually (chapter **15**). This chapter stops at **awareness**, not bypass technique.

### 8. FSO `TextStream` — Read / Write / Append modes

`OpenTextFile` takes an I/O mode (and optional create/format args). Literacy constants (Scripting runtime):

| Mode | Typical constant | Behavior |
|------|------------------|----------|
| Read | `ForReading` (`1`) | Read existing text; fail if missing unless you guard with `FileExists` |
| Write | `ForWriting` (`2`) | Create/overwrite |
| Append | `ForAppending` (`8`) | Append to end (create if allowed) |

```vb
Set ts = fso.OpenTextFile(path, 1)  ' ForReading
' ts.ReadLine / ReadAll / AtEndOfStream
ts.Close
```

Staff habits: pick one mode per open; always `Close`; prefer `FileExists` before read; treat Write/Append as destructive enough for review when paths are user-influenced. Encoding/format args matter for UTF-8 (Advanced §4)—agree team defaults.

### 9. Classic I/O depth — `Open For`, `Print #`, `Seek`, `FreeFile`

Beyond the Concepts sketch:

| Piece | Habit |
|-------|--------|
| `n = FreeFile` | Always allocate a free file number before `Open`—do not hard-code `#1` in shared code |
| `Open path For Input/Output/Append/Binary As #n` | Mode matches intent; Binary is rare and needs a documented reason |
| `Print #n, …` / `Write #n, …` | Text output variants—know which your importer expects |
| `Line Input #n, line` / `Input #n, …` | Sequential read literacy |
| `Seek` | Position in the open file—brownfield/binary literacy; prefer FSO text streams for new LOB text |

```vb
Dim n As Integer
n = FreeFile
Open path For Output As #n
Print #n, "version=1"
Close #n
```

Always `Close #n` on success and failure paths (chapter **05**). Mixing classic I/O and FSO on the same file without coordination is a review smell.

### 10. `FileCopy`, `ChDir` / `CurDir` — rare-use literacy

| API | Role | Staff posture |
|-----|------|----------------|
| `FileCopy source, dest` | Copy a file | Prefer FSO `CopyFile` with explicit overwrite policy; still a trust boundary |
| `ChDir` / `ChDrive` | Change process current directory | **Rare**—breaks assumptions for relative paths elsewhere in the session |
| `CurDir` | Read current directory | Literacy for debugging surprise relative opens |

Prefer absolute, allowlisted paths over mutating the current directory. If `ChDir` appears, demand why `ThisWorkbook.Path` / FSO absolute paths were insufficient—and restore cwd if you must change it.

### 11. `AppActivate` / `SendKeys` — review hotspots

These drive **another window’s UI** (activate by title, synthesize keystrokes). They are fragile (focus races, locale, timing) and a defender signal when paired with unexpected apps.

Staff rules:

- Prefer the **Office object model** (or approved Automation) over UI keystroke automation.
- Treat any `SendKeys` / `AppActivate` as a **review hotspot** requiring written justification and a failure mode that does not hang the user session.
- **Never** use them to instruct credential UI abuse, password-field stuffing, or bypass of security prompts—out of scope and reject in review.
- For desktop RPA-style needs, point to managed doors (Power Automate / chapter **18**), not ad-hoc keystrokes in LOB macros.

---

## 3. Applications and use cases

| Domain | Pattern |
|--------|---------|
| **Application** | Import/export CSV next to workbook; FSO existence checks; no Shell |
| **Systems** | Allowlisted roots; service accounts only via proper host identity—not hard-coded secrets |
| **Security** | `Shell` / `WScript.Shell` / odd ProgIDs require threat review; MotW/policy literate (ch **15**) |
| **Operations** | Temp cleanup with explicit paths; monitor orphaned child processes from jobs |
| **Software engineering** | One I/O helper module; errors surfaced (ch **05**); no copy-paste Kill patterns |

Legitimate: nightly export to a finance share, reading a version.json beside an add-in, expanding `%TEMP%` for a scratch CSV you delete after. Not legitimate: downloading and running binaries—out of scope and review-reject.

---

## Staff-level review checklist

- Paths are allowlisted / anchored; no unsanitized concatenation into commands or filesystem APIs.
- FSO or classic I/O—consistent style; streams always closed.
- FSO `OpenTextFile` mode (Read/Write/Append) matches intent; writes are justified.
- Classic I/O uses `FreeFile`; `Print #` / `Seek` / Binary modes have owners when present.
- `FileCopy` / deletes are tightly scoped; `ChDir` is rare and restored or avoided.
- `Kill` / delete APIs are tightly scoped and justified.
- `Environ` used for allowlisted location names only—not as a secret vault or command-builder raw material.
- `Shell` absent unless a written exception exists; arguments are fixed/allowlisted.
- `WScript.Shell` and similar ProgIDs have explicit owners and security sign-off.
- `AppActivate` / `SendKeys` absent unless justified; never for credential or security-prompt UI.
- No credentials, tokens, or connection secrets in VBA or adjacent files in the repo.
- Temp artifacts are deleted; failures do not leave partial sensitive files world-readable.
- Unsaved workbook empty-`Path` cases handled.
- Behavior aligns with org macro and ASR policy (ch **15**)—not “works on my laptop” alone.

---

## References

- [FileSystemObject object](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/filesystemobject-object)
- [OpenTextFile method](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/opentextfile-method)
- [TextStream object](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/textstream-object)
- [Open statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/open-statement)
- [Print statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/print-statement)
- [Seek function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/seek-function)
- [FreeFile function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/freefile-function)
- [FileCopy statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/filecopy-statement)
- [ChDir statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/chdir-statement)
- [CurDir function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/curdir-function)
- [Dir function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/dir-function)
- [Kill statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/kill-statement)
- [Environ function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/environ-function)
- [Shell function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/shell-function)
- [AppActivate statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/appactivate-statement)
- [SendKeys statement](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/sendkeys-statement)
- [CreateObject function](https://learn.microsoft.com/en-us/office/vba/language/reference/user-interface-help/createobject-function)
- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Attack surface reduction rules reference](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-reference)
