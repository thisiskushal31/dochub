# Macro security and enterprise defense

[← Back to VBA](./README.md)

## What this chapter covers

**Defense and policy literacy** for Office macros: why macros are **disabled or constrained by default**, **Mark of the Web (MotW)**, **blocking macros from the internet**, **Trusted Locations** (powerful—manage carefully), **Protected View**, VBA **macro notification** settings, relevant **attack surface reduction (ASR)** rules, and **AMSI** integration with Office VBA/XLM at a high level. Goal: staff can run a **policy/review conversation** using the right names—not “just enable macros.”

Pair with README security pillar, chapters **11–13** (Shell / CreateObject / Declare surfaces), **14** (VBScript/WSH), and **16** (safe reading of hostile samples).

**Hard boundary:** this chapter teaches what **defenders and policies block**. It does **not** teach how to build malware, craft phishing lures, obfuscate for evasion, or bypass controls.

---

## 1. Concepts

### 1. The macros-disabled-by-default story

Modern Microsoft 365 Apps defaults treat untrusted macro-enabled documents as **dangerous until proven otherwise**. Users often see notifications rather than silent execution. Enterprises tighten further with cloud policy, Intune/Group Policy, and Defender ASR.

Staff translation:

> “Enable Content” is a **trust decision**, not a UI inconvenience.

LOB macros that matter should be delivered through **known distribution**, **Trusted Locations or trusted publishers as policy allows**, and **review**—not through email attachments with MotW still attached.

### 2. Mark of the Web (MotW)

Files that arrive from the internet (browsers, email clients, many chat downloads) typically carry a **MotW** alternate data stream on NTFS. Office uses that signal when deciding whether to treat a file as internet-origin.

| Literacy point | Why it matters |
|----------------|----------------|
| MotW marks provenance | Policies can block macros in internet-marked files |
| Saving “locally” does not always clear MotW | Users may still be blocked—correctly |
| Removing MotW casually is a control bypass smell | Ops/security should own exceptions, not tribal tips |

Exact MotW mechanics evolve; rely on current Microsoft 365 Apps security docs for policy names.

### 3. Block macros from running in Office files from the Internet

Microsoft documents the policy posture commonly named **Block macros from running in Office files from the Internet** (Microsoft 365 Apps security). Net effect for users: macro-enabled files with internet provenance (MotW and related signals) **do not run**, even when older “Enable Content” habits would have applied.

Implications for LOB authors:

- Design distribution that does **not** depend on emailing `.xlsm` / `.docm` from the open internet.
- Prefer internal package shares, Intune/Company Portal, or managed templates already in Trusted Locations / trusted-publisher flows.
- Document how MotW interacts with your delivery path.
- Use the exact policy name in reviews and tickets—avoid vague “macros are blocked.”

### 4. Trusted Locations — powerful, manage carefully

A **Trusted Location** is a path Office treats as trusted for macro content (subject to policy). It is an **allowlist of filesystem trust**, not a substitute for code review.

| Practice | Rationale |
|----------|-----------|
| Few locations, tightly ACL’d | Broad `C:\` or user Downloads destroys the model |
| No worldwide writable shares | Attackers love writable trusted paths |
| Change control on the list | Adding a path is a security change |
| Prefer publisher signing + review where policy supports it | Paths alone are blunt |

Misconfigured Trusted Locations are a classic enterprise self-own: malware or insider-written macros inherit trust by landing in the path.

### 5. Protected View

**Protected View** opens documents in a restricted read-only sandbox-like experience so users can inspect content before editing. Leaving Protected View is another trust step. Staff training: **reading** a document ≠ **enabling** active content.

### 6. VBA macro notification settings (ladder literacy)

Organizations configure **VBA Macro Notification Settings** (cloud policy / ADMX). Staff should recognize the ladder—not memorize every admin UI click:

| Setting (conceptual ladder) | Staff meaning |
|-----------------------------|---------------|
| Disable all without notification | Macros do not run; users may not even see a prompt |
| Disable all with notification | Common hardened default flavor—user can request enable where policy allows |
| **Disable all macros except digitally signed macros** | Unsigned projects blocked; signed macros gated by publisher trust |
| Enable all macros (not recommended) | Almost never an enterprise production answer |

Often paired with options such as **Require macros to be signed by a trusted publisher** (and related admin checkboxes documented in the internet-macros / trusted-publisher Learn hubs). Exact labels live in current Microsoft 365 Apps security docs—re-check after channel moves.

Staff skill:

- Know that **user-local “enable all macros”** is almost never an enterprise answer.
- Distinguish **signed-macro** trust vs **Trusted Locations** path trust vs **Block macros from running in Office files from the Internet**.
- Align developer machines with **prod-like** policy where practical so “works on my PC” is honest.

### 7. Digital signatures and Trusted Publishers

| Idea | Literacy |
|------|----------|
| **Code-sign the VBA project** | Ties the macro project to a publisher certificate so integrity/publisher policy can apply |
| **Trusted Publishers** | Certificates the org trusts for signed ActiveX/VBA content—managed via policy / cert stores |
| **Org / CA-issued code-signing certs** | Enterprise path: IT-issued or approved CA certificates + Trusted Publishers deployment |
| **SelfCert.exe** | Office tool for **lab / personal test** self-signed certs—**not** enterprise trust |

SelfCert proves signing UX in a sandbox; it does **not** make a macro trusted across the estate. Do not tell users to “just SelfCert and Enable Content” as a production control. Prefer org signing + Trusted Publishers + review (see Advanced §2).

### 8. ASR rules relevant to Office (high level)

**Attack surface reduction** rules in Microsoft Defender can block classes of behavior used by Office-based attacks. Literacy—not an exploit map:

| Theme (conceptual) | Why LOB authors care |
|--------------------|----------------------|
| Block Win32 API calls from Office macros | Declares may fail under policy (**13**) |
| Rules targeting child process / executable creation from Office | `Shell` / some Automation patterns become non-starters (**11**) |
| Rules around obfuscated / suspicious script behaviors | Overlap with WSH/VBScript estate (**14**) |

Read the official ASR reference for current rule IDs and audit-vs-block modes. Design macros that remain useful when ASR is **on**.

### 9. AMSI and Office VBA / XLM (high level)

**Antimalware Scan Interface (AMSI)** lets script and Office content providers present content to registered antimalware for inspection at runtime. Microsoft has documented AMSI integration for **Office VBA** (and related macro families including **XLM** literacy in the security narrative).

Staff takeaways:

- Runtime inspection complements MotW / policy / ASR—it is not a reason to disable other controls.
- Obfuscation that “hides from humans” is still in scope for modern defenders; do not treat encoding as a design tool (**16** refuses recipes).
- LOB macros should be **readable** for review; clever packing is a review fail even when “benign.”

### 10. Least privilege for LOB macros

| Habit | Intent |
|-------|--------|
| No casual `Shell` / `WScript.Shell` | Shrink process-creation surface (**11**) |
| No Declares without justification | Shrink native surface (**13**) |
| Narrow file paths | Avoid walking entire profiles |
| Signed + reviewed projects | Accountability |
| Separate highly privileged Automation accounts | Not every workbook runs as a domain admin |

Security is **policy + runtime + review**, matching the README semantic model.

---

## 2. Advanced concepts

### 1. Baselines and channels

Pin the **Microsoft 365 Apps channel** and security baseline your org ships. Policy names and default strengths differ across perpetual Office, LTSC, and M365 Apps. Re-verify after channel moves.

### 2. Trusted publishers vs Trusted Locations

Signing with a **Trusted Publisher** certificate and path-based **Trusted Locations** solve different operational problems:

| Control | Trusts… | Failure mode |
|---------|---------|--------------|
| Trusted Locations | A filesystem path | Writable / overly broad paths |
| Trusted Publishers | A code-signing identity | Stolen or casually trusted certs; SelfCert mistaken for enterprise trust |

Many estates combine them; neither replaces **content review**. SelfCert-signed projects are lab-only literacy (Concepts §7)—production LOB should use org-managed certificates deployed into Trusted Publishers per Learn guidance.

### 3. XLM (Excel 4.0 macros) as a defense topic

**XLM** is largely a **security literacy** door for modern staff: hostile sheets may still use legacy macro sheets. Treat enablement and analysis under the same “do not casually enable” posture; deeper static habits sit in **16**. New LOB work should not invent XLM features.

### 4. Coordination with identity and email security

Macro defense fails open if phishing delivers files into Trusted Locations or users are trained to clear MotW. Pair this chapter with org secure-email practices and user education that says **report**, not **enable**.

### 5. Developer friction is a feature

When policy blocks a bad pattern, the fix is **redesign** (OM-only, Power Automate, Add-in, server API)—not a wiki titled “how we bypass ASR.” Chapter **18** lists adjacent doors.

---

## 3. Applications and use cases

### Application

- Ship LOB workbooks via internal distribution that preserves a clear trust story.
- Replace “email me the `.xlsm`” with managed deployment.

### Systems

- Encode MotW / internet-macro / Trusted Location / ASR settings in the endpoint baseline.
- Audit Trusted Location lists like firewall rules.

### Security

- Tabletop: internet-marked macro attachment vs trusted-path implant.
- Ensure AMSI providers and Office versions in scope for your estate.
- IR handoff uses chapter **16** habits—not enable-on-laptop.

### Operations

- Break/fix playbooks when ASR moves from audit to block.
- Own exceptions with expiry dates.

### Software engineering

- CI or peer review checks for `Shell`, `CreateObject`, `Declare` in macro projects.
- Definition of done includes “runs under prod-like macro policy.”

| Role | Review question |
|------|-----------------|
| Security | Which control fails closed if the user clicks the wrong thing? |
| Ops | Where is the Trusted Location list managed? |
| SE | Does this feature require a blocked API surface? |
| App owner | Who signs and who may publish updates? |

---

## Staff-level review checklist

- Team can name **Block macros from running in Office files from the Internet** and explain MotW’s role without conflating it with Trusted Locations.
- Team can explain MotW, Protected View, and Trusted Locations as distinct controls.
- Trusted Locations are few, ACL’d, change-controlled, and not user-writable dumping grounds.
- Macro notification ladder is known, including **Disable all macros except digitally signed macros** (and trusted-publisher requirements when configured).
- Digital signatures use org/CA certificates + Trusted Publishers—SelfCert is lab-only, not enterprise trust.
- LOB distribution does not rely on clearing MotW or “enable all macros” on endpoints.
- Macro notification / disable policies match enterprise baselines—not developer convenience settings in production.
- ASR rules affecting Office are known in audit/block terms for the estate; Declare/`Shell`-heavy designs are challenged (**11**, **13**).
- AMSI + Office VBA/XLM is understood as layered runtime inspection—not a free pass to ship opaque macros.
- Least privilege: no unnecessary `CreateObject` / `Shell` / Win32 Declares in reviewed LOB code.
- VBScript/WSH dependencies are inventoried and on a migration path (**14**).
- Exceptions have owners and expiry; bypass instructions are forbidden in engineering wikis.
- Hostile samples are routed to **16** workflows, never “opened with macros on” on the endpoint of record.

---

## References

- [Macros from the internet blocked](https://learn.microsoft.com/en-us/microsoft-365-apps/security/internet-macros-blocked)
- [Trusted Locations](https://learn.microsoft.com/en-us/microsoft-365-apps/security/trusted-locations)
- [Trusted Publisher](https://learn.microsoft.com/en-us/microsoft-365-apps/security/trusted-publisher)
- [Digital signatures and code signing (Excel)](https://learn.microsoft.com/en-us/troubleshoot/microsoft-365-apps/excel/digital-signatures-code-signing)
- [Attack surface reduction rules reference](https://learn.microsoft.com/en-us/defender-endpoint/attack-surface-reduction-rules-reference)
- [How AMSI helps](https://learn.microsoft.com/en-us/windows/win32/amsi/how-amsi-helps)
- [Office VBA AMSI — Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2018/09/12/office-vba-amsi-parting-the-veil-on-malicious-macros/)
- [Office VBA API overview](https://learn.microsoft.com/en-us/office/vba/api/overview/)
