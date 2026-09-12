# Use cases and engineering perspectives

[← Back to VBA](./README.md)

## What this chapter covers

**Capstone applications lens** for the VBA track: what you can honestly write after chapters **00–16**, how **role lenses** (software engineering, operations, security, application owner) change the questions you ask, which **domains** still fit VBA, when VBA is the **wrong hammer**, personal **learning paths**, and **hiring signals** mapped to the README pillars. This is synthesis—not a second Excel modeling course and not a malware lab.

Default narrative remains **VBA in Microsoft 365 Apps on Windows** under enterprise macro policy (**15**). VBScript is brownfield only (**14**).

---

## 1. Concepts

### 1. What you can write (track outcomes)

| You can write / do… | “Done” looks like | Spine |
|---------------------|-------------------|-------|
| Signed, reviewed Excel/Word macro for a known business task | `Option Explicit`, clear errors, no casual `Shell`/`CreateObject` | **02–08**, **15** |
| Small cross-app Automation helper | Early/late binding understood; objects released | **07–09** |
| File/config helper inside Office | FSO or controlled paths; no secret-in-code | **11**, **15** |
| Policy/review conversation about macros | MotW, Trusted Locations, ASR named correctly | **15** |
| Read a suspicious macro safely | Static habits; no enable-all on analyst laptop | **16** |
| Read legacy `.vbs` | WSH objects recognized; PowerShell migration named | **14** |

If you cannot check the security column, you are not “done”—you are dangerous to yourself and your tenant.

### 2. Role lenses (same workbook, different questions)

| Role | Primary question | Failure that hurts them |
|------|------------------|-------------------------|
| **Software engineer** | Is this maintainable, tested, and OM-first? | Variant soup; undocumented `Shell`; no `Option Explicit` |
| **Operations** | Will this run under image policy at 2 a.m.? | ASR blocks Declares; MotW breaks email distribution |
| **Security** | What can this project do if content is hostile or abused? | Trusted Location sprawl; Enable Content culture |
| **Application owner** | Does VBA expand product power without eternal support hell? | Critical process trapped in one analyst’s `.xlsm` |
| **Systems / platform** | How do Office channel, bitness, and baseline interact? | 32→64-bit Declare debt (**13**) |

Read your real macros once through each lens.

### 3. Domain map (where VBA still appears)

```text
                    ┌─ Excel LOB ──── finance ops, reporting glue
                    ├─ Word LOB ──── document assembly (narrow)
VBA shows up as ────┼─ Outlook ────── mail/calendar automation (careful)
                    ├─ Access ────── desktop data apps (literacy)
                    ├─ Add-in-like .xlam / templates
                    └─ IR / brownfield ─ macros + .vbs samples (**14**, **16**)
```

Cloud-first Excel work increasingly belongs to **Office Scripts** and **Add-ins** (**18**). VBA remains strong where **Windows desktop Office** + **local OM** + **existing files** dominate.

### 4. Excel-centered use cases (honest scope)

Typical good fits:

- Repetitive formatting/transform pipelines on controlled workbooks.
- Guided data-entry helpers with validation (UserForms door **10**—keep thin).
- Export/import between sheets and known network paths under ACL (**11**).
- Lightweight Automation to Word/Outlook for controlled document packs (**09**).

Success looks like: reviewed code, prod-like macro policy, no lure-like “enable macros to view” UX, distribution that respects MotW (**15**).

### 5. When VBA is the wrong hammer

| Need | Prefer instead |
|------|----------------|
| Cross-platform / browser Excel | Office Scripts / web Add-ins (**18**) |
| Long-running unattended RPA across many UI apps | Power Automate desktop flows / proper RPA platform |
| Service-side scheduled ETL | PowerShell, Python, Azure jobs—not a hidden workbook on a desktop |
| Multi-user transactional system of record | Real backend + Access/SQL only with eyes open |
| Rich modern UX | Office Add-ins / web tech |
| OS administration | PowerShell (**14**, **18**) |
| Native Win32 product behavior | VB.NET / C# desktop (**13**, **18**) |

Wrong-hammer smell: “we put the company process in a macro because Excel was open.”

### 6. Personal learning paths

**Excel automator**

`00–08` → practice on non-prod files → **11** carefully → **15** before any shared distribution → **18** when cloud matters.

**Defender / analyst**

Track through **15–16** with **11–14** as surface literacy → ASR/AMSI official docs → org macro policy. Do not skip **16** workflow rules.

**Ops / packager**

**01**, **11**, **13–15**, plus image bitness and Trusted Location ownership. Migration plans for `.vbs` (**14**).

**SE inheriting a macro estate**

**02–07**, then **15** as merge gate, then carve extractable logic toward scripts/services (**18**).

### 7. Hiring signals from README pillars

| Pillar | Strong signal | Weak signal |
|--------|---------------|-------------|
| Language honesty | Insists on `Option Explicit`; explains Variant pitfalls | “Macros just work”; no error strategy |
| Host / Automation surface | Names OM limits; cautious `CreateObject` | Pastes Shell/Declare from forums |
| File / environment I/O | Controlled paths; no secrets in code | `Environ` + temp + Startup folder casual use |
| Security / defense | MotW, Trusted Locations, ASR, AMSI vocabulary; safe sample handling | “Tell users to enable content” as architecture |

Interview prompts that work: “How would you distribute an `.xlsm` under internet-macro blocking?” and “What do you look for before enabling macros on a sample?”

---

## 2. Advanced concepts

### 1. Ownership and bus factor

A macro with no repository, no code owner, and no policy alignment is an **operational incident waiting**. Capstone habit: macros live in source control (exported modules or documented workbook provenance), with review like any other code.

### 2. Testing without training users badly

Do not ship decoy sheets that say “enable macros to view.” That UX is indistinguishable from malware lures (**16**). Prefer signed add-ins, ribbon entry points, or clear internal IT distribution messaging.

### 3. Performance and reliability honesty

VBA is fine for interactive desktop tasks; it is a poor cluster scheduler. When runtimes grow, measure, then **extract**—do not deepen `DoEvents` folklore.

### 4. Access, Outlook, and PowerPoint

Literacy hosts (**09**): each expands COM and social-engineering surface (especially Outlook). Apply the same least-privilege and policy rules; do not assume Excel habits transfer cleanly.

### 5. Metrics for “should we keep VBA here?”

| Metric | Drift toward exit |
|--------|-------------------|
| Number of Declare / Shell call sites | Rising |
| Broken runs after ASR/channel change | Recurring |
| Users outside Windows desktop Office | Rising |
| Critical path depends on one workbook | True |
| Migration spike estimated | Smaller than another year of break/fix |

---

## 3. Applications and use cases

### Application

- Finance/ops teams: governed Excel macros with owners and Trusted Location hygiene.
- Document generation: Word OM with reviewed templates—not mail-merged malware lookalikes.

### Systems

- Package LOB macros like software: version, channel, bitness, baseline.
- Inventory `.vbs` and macro-enabled templates in the estate (**14**).

### Security

- Use **15–16** as onboarding for anyone who touches Office IR.
- Hiring and vendor reviews: demand policy literacy, not only Range tricks.

### Operations

- Change weekends: test macros under prod ASR/macro settings.
- Retire email distribution of macro-enabled files from the internet path.

### Software engineering

- Extract pure logic from sheets toward testable modules or external services.
- Refuse new Win32 Declares for convenience (**13**).

| Role | Capstone artifact |
|------|-------------------|
| SE | Reviewed `.xlsm`/add-in + ADR for any escape hatch |
| Ops | Runbook under real policy |
| Security | Tabletop with MotW + ASR + safe analysis |
| App owner | Exit criteria when VBA stops fitting |

---

## Staff-level review checklist

- Deliverable matches a README “what you can write” row—including the security column.
- Role lenses applied: SE maintainability, ops policy fit, security surface, app-owner support story.
- Domain is an honest VBA fit; wrong-hammer alternatives considered (**18**).
- No lure-like enable-macros UX in LOB documents (**16**).
- Escape hatches (`Shell`, `CreateObject`, `Declare`) justified or removed (**11**, **13**).
- Distribution respects MotW / internet-macro blocking / Trusted Location discipline (**15**).
- VBScript appears only as debt with a PowerShell plan (**14**).
- Ownership, source provenance, and bus factor addressed.
- Hiring/interview signals align with the four README pillars—not only demo macros.
- Adjacent doors named when the next increment leaves desktop VBA (**18**).

---

## References

- [Office VBA API overview](https://learn.microsoft.com/en-us/office/vba/api/overview/)
- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Trusted Locations](https://learn.microsoft.com/en-us/microsoft-365-apps/security/trusted-locations)
- [Office Scripts vs VBA](https://learn.microsoft.com/en-us/office/dev/scripts/resources/vba-differences)
- [PowerShell documentation](https://learn.microsoft.com/en-us/powershell/)
- [Visual Basic .NET documentation](https://learn.microsoft.com/en-us/dotnet/visual-basic/)
