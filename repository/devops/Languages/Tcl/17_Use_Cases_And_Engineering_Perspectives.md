# Use cases and engineering perspectives

[← Back to Tcl](./README.md)

## What this chapter covers

Where Tcl **actually shows up**, and how **different roles** should think about it. Domains: **Expect automation**, **embedding**, **EDA / lab tooling**, **network gear**, **Tk tools**, and **testing (including DejaGnu)**. This is the applications lens after the language and runtime chapters—not a vendor CLI manual and not a second Expect course.

Default pin for new work remains **Tcl 9.0.x**; many domains below still run **8.6** in production. Name the pin when you inherit a system.

---

## 1. Concepts

### 1. Why Tcl persists

Tcl survives where three properties matter more than “modern language fashion”:

1. **Embeddability** — a small interpreter inside a large C/C++ product.
2. **Glue with dialogue** — Expect drives stubborn interactive programs.
3. **Long-lived automation** — scripts and packages that outlived the original authors.

Staff rarely choose Tcl to build a greenfield SaaS UI. Staff **do** choose (or inherit) Tcl to keep a control plane, test farm, or appliance programmable without rewriting the core.

### 2. Role lenses (same script, different questions)

| Role | Primary question | Failure that hurts them |
|------|------------------|-------------------------|
| **Software engineer** | Is this maintainable, packaged, tested? | Quoting/`eval` bugs; unversioned spaghetti |
| **Operations** | Will this run safely on the pinned image at 2 a.m.? | Timeouts, wrong binary, secret leaks in logs |
| **Security** | What can untrusted input make this script do? | `exec`/`eval` injection; Expect credential spills |
| **Application owner** | Does scripting expand product power without owning support hell? | Unbounded plugin surface; ABI breaks on upgrade |
| **Systems / platform** | How does Tcl share process, threads, channels, event loop? | Event-loop blocks; extension ABI mismatch |

Read the rest of this chapter once through each lens on your real repo.

### 3. Domain map (orientation)

```text
                    ┌─ Expect ─── ops dialogues, device CLIs
                    ├─ Embedding ─ product consoles, plugins
Tcl appears as ────┼─ EDA/lab ─── tool control, flows
                    ├─ Network ─── appliance / NMS glue
                    ├─ Tk ─────── small desktop tools
                    └─ Testing ── DejaGnu, CLI harnesses
```

Domains overlap: an EDA tool may embed Tcl **and** expose Tk **and** ship Expect-based regression packs.

### 4. Expect-centered use cases

Typical jobs:

- Drive vendor CLIs that only offer interactive configuration.
- Bootstrap devices over serial/console with prompt sequences.
- Automate installers that ask confirmation questions.
- Wrap flaky human runbooks into checked dialogues with timeouts.

Success looks like: pinned Expect/Tcl, explicit timeout/EOF handling, secrets from a vault, verification after “matched prompt” (chapter **15**–**16**).

### 5. Embedding-centered use cases

Typical jobs:

- Product exposes a Tcl command tree for power users and support.
- Plugins are Tcl packages loaded under policy.
- Test hooks and factory diagnostics call into the same interp.

Success looks like: documented command surface, intentional safe/restricted interps for untrusted scripts, C extensions rebuilt for the ship Tcl (chapters **12**, **14**).

### 6. EDA, lab, and instrument control

Hardware and design-automation environments historically grew Tcl (and Tk) because tools needed a **user-extensible command language** long before “everything is REST.” You meet Tcl as:

- Flow scripts stitching synthesis/simulation/implementation tools.
- Lab bench automation talking to instruments via CLIs.
- Small Tk panels for operator convenience.

Staff habit: treat vendor Tcl as **API surface**—pin tool versions with scripts; do not casually upgrade the embedded interpreter underneath a certified flow.

### 7. Network gear and infrastructure glue

Routers, switches, firewalls, and management systems often embed Tcl or accept Expect-driven sessions. Your automation may live **on-box**, **on a jump host**, or **in CI** talking to lab gear.

| Placement | Engineering emphasis |
|-----------|----------------------|
| On-box | Vendor update compatibility; minimal local packages |
| Jump host | Central secrets, audit, change windows |
| CI / NetDevOps | Non-interactive where possible; Expect only when forced |

Prefer vendor non-interactive APIs when they exist; keep Expect for the residue.

### 8. Tk tools

Desktop utilities: config editors, installers, status panels, educational IDEs. Chapter **13** literacy applies: `wish` vs `tclsh`, geometry managers, event-loop blocking. Product decision: Tk is fine for **internal** tools; customer-facing UI often moved elsewhere—know which battle you are fighting.

### 9. Testing perspectives

| Style | Tcl’s role |
|-------|------------|
| Unit-ish procs | `tcltest` and plain assertions on pure logic |
| CLI dialogue tests | Expect scripts |
| Tool-chain farms | **DejaGnu** driving compilers/debuggers/targets |
| Product soak | Embedded Tcl test commands in QA builds |

Separate **fast pure-Tcl tests** (CI every commit) from **hardware/dialogue tests** (nightly, lab runners).

---

## 2. Advanced concepts

### 1. Brownfield gravity (8.6 everywhere)

In these domains, **Tcl 8.6** remains common even when your laptop runs 9. Advanced practice:

- Dual-CI or containerized pins matching production.
- Migration as a project (chapter **02**), not a drive-by `tclsh` bump.
- Expect compatibility checked explicitly for Tcl 9 ambitions.

### 2. Ownership boundaries

Clarify who owns:

| Artifact | Owner smell if unclear |
|----------|------------------------|
| Script repo | “Ops edited production copy by hand” |
| Embedded command ABI | App team vs script authors fighting upgrades |
| Secrets for Expect | Security vs ops ticket ping-pong |
| Lab images with Tcl | Platform drift vs developer laptops |

Write ownership into the README of the automation repo.

### 3. When to stop writing Tcl

| Signal | Move toward |
|--------|-------------|
| Rich web UX needed | Separate UI service; keep Tcl for device glue only |
| Team cannot hire Tcl literacy | Narrow the surface; wrap with APIs your team knows |
| Tool grew a first-class API | Delete Expect dialogues that the API replaces |
| Performance-critical data path | Native code; Tcl as control plane only |

Tcl as **control and glue** ages well. Tcl as **the entire product** needs an honest roadmap.

### 4. Cross-language handoffs in this handbook

| Need | Sibling door |
|------|--------------|
| Generic shell / CI YAML depth | Shell track |
| Heavy systems C | C/C++ track |
| Policy-as-code HCL | HCL track |
| Broader DevOps glue fashion | Other Languages index |

Do not force Tcl into jobs it no longer owns.

### 5. Compliance and audit

Change automation that alters production networks or factories needs:

- reviewed scripts (this track’s checklists),
- immutable version tags,
- execution logs with secret redaction,
- break-glass paths that are deliberate (`interact`, manual console)—not accidental.

### 6. Maturity model for a Tcl automation estate

| Level | What you see | Next upgrade |
|-------|--------------|--------------|
| **0** | Copy-paste scripts on a jump host | Version control + pin `info patchlevel` |
| **1** | Repo exists; still hard-coded secrets | Vault + redaction |
| **2** | Packages/namespaces; some tests | CI on production-like image |
| **3** | Expect state machines; API-first preference | Inventory of dialogues to delete |
| **4** | Embedding sandbox + extension SBOM | Tcl 9 migration with extension rebuilds |

Use the table in planning conversations—not as bureaucracy for a 20-line helper.

### 7. Hiring and knowledge transfer

Tcl literacy is uneven in modern hiring markets. Practical mitigations:

- Keep the bullseye small: substitution, lists, channels, Expect, security review.
- Document pins and runbooks in-repo.
- Prefer boring packages over clever metaprogramming.
- Pair new owners on one real dialogue and one real package before they own on-call.

### 8. Example estate (composite story)

A mid-size platform team might own:

1. A container image with Tcl **8.6** + Expect for network lab jobs.
2. An EDA flow repo with Tcl **8.6** scripts pinned to a tool train.
3. A product console embedding Tcl **9** for plugins (safe interp).
4. One internal `wish` tool for offline config editing.

The mistake is pretending these are one stack. The staff move is **four pins, four owners, shared review checklists**.

---

## 3. Applications and use cases

### By role — concrete scenarios

**Software engineer**

- Refactors a 2k-line Expect script into procs + packages; adds `tcltest` for pure helpers; leaves dialogue steps integration-tested on a lab image.

**Operations**

- Pins `tclsh`/Expect in an automation container; vault-injects credentials; alerts on timeout rates after a vendor banner change.

**Security**

- Reviews a PR that builds `exec` from ticket fields; requires allowlisted commands and removes `eval`; checks CI logs for password redaction.

**Application / product**

- Documents supported Tcl commands for plugins; runs customer scripts in a safe interp inside a container; schedules Tcl 9 + extension rebuild.

**Systems**

- Traces a hung GUI tool to a blocking `exec` on the Tk event loop; splits work onto a pipeline with `fileevent`.

### By domain — what “good” looks like

| Domain | Good outcome |
|--------|--------------|
| Expect ops | Deterministic dialogues, bounded retries, vault secrets |
| Embedding | Stable command ABI, tested extensions, clear sandbox story |
| EDA/lab | Flow scripts versioned with tool trains |
| Network | Least privilege, change windows, API-first with Expect fallback |
| Tk tools | Thin UI, testable logic, documented display needs |
| Testing | Fast unit layer + lab Expect/DejaGnu where needed |

### Anti-patterns (all domains)

- One global script directory writable by everyone.
- Copy-pasted passwords in examples that became production.
- “Sleep 5” instead of expect-on-prompt.
- Shipping `.so` extensions built against a different Tcl.
- Treating Tk and headless CI as the same environment.

---

## Staff-level review checklist

- Domain and role for the change are named (ops dialogue vs embed vs test vs Tk).
- Production Tcl/Expect/Tk pin documented (**9.0.x** vs brownfield **8.6**).
- Ownership of scripts, secrets, and images is clear.
- Prefer non-interactive APIs; Expect justified when used.
- Packaging/namespaces used for anything beyond a one-off.
- Tests exist at the right layer (pure vs lab).
- Security checklist from chapter **16** applied when automation is privileged.
- Embedding/C extensions considered if `load` or host eval is involved.
- Exit criteria include operator runbook updates, not only code merge.
- No vendor-manual dump—links point to official Tcl/Expect/DejaGnu hubs when depth is needed.

---

## References

- [Tcl Developer Xchange](https://www.tcl-lang.org/)
- [Where Tcl is used](https://www.tcl-lang.org/about/uses.html)
- [Tcl/Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
- [Expect](https://core.tcl-lang.org/expect/)
- [GNU DejaGnu](https://www.gnu.org/software/dejagnu/)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
