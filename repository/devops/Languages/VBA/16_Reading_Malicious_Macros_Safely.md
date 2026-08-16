# Reading malicious macros safely

[← Back to VBA](./README.md)

## What this chapter covers

**Safe analysis literacy** for suspicious Office documents and macro projects: analyst workflow that **does not enable macros on the endpoint of record**, prefers an **isolated lab**, and emphasizes **static reading**—module lists, auto-open names, and high-signal strings such as `CreateObject`, `Shell`, and `Declare`. Includes recognition of social-engineering **“Enable Content”** lures, an **XLM** literacy door, and pointers to industry tooling by **common name only** (for example oletools) without making third-party docs your References. Prefer Microsoft macro-malware and AMSI materials for official links.

**Hard boundary:** teach what **defenders look for** and how to **avoid detonating** samples. Do **not** teach malware construction, obfuscation recipes, phishing-lure writing, or control bypass.

Pair with **11–14** (surfaces) and especially **15** (policy controls).

---

## 1. Concepts

### 1. The non-negotiable workflow rule

| Do | Do not |
|----|--------|
| Triage on an isolated lab VM / sandbox with snapshots | Enable macros on your daily laptop “just to see” |
| Prefer static extraction and reading first | Trust “Protected View is enough” while clicking Enable Content |
| Preserve MotW and original evidence hashes | “Unblock” files casually to make them run (**15**) |
| Document indicators for detections/IR | Replay the lure against real users |

Your **endpoint of record** (mail laptop, corp workstation) is for **tickets and notes**, not detonation.

### 2. Social engineering recognition — “Enable Content”

Hostile documents often pair a fake “document encrypted / preview unavailable” decoy with instructions to **Enable Editing** and **Enable Content**. Staff recognition cues:

- Urgent business pretext (invoice, HR, shipping).
- Blurry or sparse visible content until macros run.
- Branding that mimics internal templates.
- Delivery with MotW / email attachment path (**15**).

Training response: **report to security**, do not enable. This chapter describes the lure pattern for **recognition only**.

### 3. Static reading — what to inventory first

Without running VBA, analysts and reviewers still extract a useful map:

| Artifact | Why it matters |
|----------|----------------|
| **Module / form / class list** | Size of attack surface; hidden modules |
| **Auto-open and event names** | `Auto_Open`, `Workbook_Open`, `Document_Open`, `AutoExec`-style names (**12**) |
| **High-signal strings** | `CreateObject`, `GetObject`, `Shell`, `WScript.Shell`, `powershell`, `Declare` / `PtrSafe`, `URLDownload…`, `Environ` (**11**, **13**, **14**) |
| **External links / OLE hints** | Additional load paths |
| **File metadata** | Author, template paths, anomalous streams |

You are building a **capability hypothesis** (“this project can launch processes / call Win32 / write files”), not a how-to.

### 4. String and API literacy (defense lens)

Defenders look for combinations:

```text
auto-open entry
    → CreateObject("WScript.Shell") or Shell
    → or Declare into system DLLs
    → or FSO writing to Startup / temp + secondary script
```

Same tokens appear in **bad LOB** and **malware**. Context and policy decide response; **15** explains what enterprises block; here you **spot** the surface.

### 5. Isolated lab expectations

Minimum lab hygiene (organizational standards win over this list):

- Disposable VM, no corp SSO tokens mounted.
- Snapshot before opening samples.
- Controlled network (deny-by-default or simulated).
- Transfer samples via documented evidence process.
- Separate analysis account with no inbox access to production mail.

Dynamic detonation—if your org allows it—comes **after** static inventory and **inside** that lab, never as step one on a laptop.

### 6. Industry tooling — name only

Analysts often use community packages commonly referred to as **oletools** (and related Office forensic utilities) to list macros and streams. This handbook:

- Names them as **common industry vocabulary**.
- Does **not** require non-Microsoft links in References.
- Does **not** turn into a tool tutorial.

Prefer Microsoft documentation on macro malware behavior, MotW/internet macros, ASR, and AMSI for official grounding.

### 7. XLM literacy door

**Excel 4.0 (XLM)** macros are a legacy sheet-based macro system still seen in hostile samples. Staff posture:

- Know they exist and may not live in the VBA project tree you expect.
- Do not author new LOB logic in XLM.
- Apply the same **no enable on endpoint of record** rule.
- Deeper formula-sheet forensics belong to specialized IR playbooks—not obfuscation lessons here.

---

## 2. Advanced concepts

### 1. Layered inspection vs “I read the code”

AMSI and antimalware may see runtime content Office feeds them (**15**). Static reading still matters because:

- You need human-understandable review for LOB PRs.
- Some investigations start from quarantined copies.
- Policy conversations need concrete surfaces (`Shell` vs pure `Range` logic).

### 2. Obfuscation — recognition without recipes

Hostile VBA may split strings, build ProgIDs at runtime, or bury logic across modules. **Recognition:** “this is intentionally hard to read” is already a severity signal for both malware and unreviewable LOB. **Forbidden here:** step-by-step deobfuscation-as-evasion teaching or encoding how-tos. Lab teams use private IR SOPs.

### 3. False confidence traps

| Trap | Better habit |
|------|--------------|
| “Macros are disabled so the file is safe to open casually” | Still use lab for unknown samples; preview phishing UX carefully |
| “Trusted Location copy for analysis” | Do not invent trusted paths for malware |
| “I’ll just disable network” on a corp laptop | Isolation is more than NIC off on the wrong machine |
| “Strings look clean” | Auto-open + late-built strings still happen—confirm module coverage |

### 4. Handoff language for IR / SOC

When you escalate, prefer:

- Hash / filename / delivery vector.
- Whether MotW was present.
- Static indicators (`Workbook_Open` + `WScript.Shell`, Declares, etc.).
- What you **did not** do (did not enable macros on endpoint of record).

Avoid pasting entire macro bodies into wide chat channels if they contain sensitive internal paths—use evidence stores.

### 5. Relationship to good engineering review

Chapter **16** is written for malware, but the same eyes improve LOB PRs: auto-open complexity, Shell/CreateObject/Declare, and “Enable Content” UX that trains users badly. Security and SE share a checklist vocabulary with **15**.

---

## 3. Applications and use cases

### Application

- Product/support teams receive customer workbooks: route unknowns through analysis, not personal Excel with macros on.

### Systems

- Provide approved sandbox images and evidence transfer paths so analysts are not tempted to use laptops.

### Security

- SOC playbooks: MotW + macro family + ASR alerts correlated with static indicators.
- Purple-team discussions use **detection** language, not lure kits.

### Operations

- Quarantine and restore procedures that preserve forensic value.
- Breakglass never equals “enable all macros domain-wide.”

### Software engineering

- Treat unreadable macro packs as merge blockers even when “benign.”
- Add CI greps for auto-open + dangerous APIs in first-party projects (**11**, **13**).

| Role | Success look |
|------|--------------|
| Analyst | Static map before any enablement; lab only |
| SE | Readable macros; no lure-like UX in LOB |
| Ops | Sandbox capacity; clear ticket path |
| Security | Indicators → detections; users taught to report |

---

## Staff-level review checklist

- Suspicious Office files are **not** macro-enabled on the endpoint of record.
- Isolated lab / sandbox with snapshots exists and is actually used.
- Static inventory covers modules, auto-open/event names, and `CreateObject` / `Shell` / `Declare` strings (**11–13**).
- “Enable Content” lure UX is recognized; response is report/escalate, not comply.
- MotW and internet-macro policy context from **15** informs triage (blocked vs unexpectedly runnable).
- XLM is considered as a possible legacy macro surface without becoming an authoring path.
- Tooling such as oletools may be used per org standard; official References stay on Microsoft macro/AMSI/ASR materials.
- No obfuscation, phishing, or bypass how-tos appear in team notes derived from this chapter.
- Evidence hashes and handling steps are recorded; wide-chat pastes avoided when sensitive.
- LOB reviews reuse the same high-signal API checklist as malware triage.

---

## References

- [Office VBA AMSI — Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2018/09/12/office-vba-amsi-parting-the-veil-on-malicious-macros/)
- [How AMSI helps](https://learn.microsoft.com/en-us/windows/win32/amsi/how-amsi-helps)
- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Trusted Locations](https://learn.microsoft.com/en-us/microsoft-365-apps/security/trusted-locations)
- [Attack surface reduction rules reference](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-reference)
- [Office VBA API overview](https://learn.microsoft.com/en-us/office/vba/api/overview/)
