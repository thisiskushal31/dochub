# Security review of Tcl automation

[← Back to Tcl](./README.md)

## What this chapter covers

A **defense and review** posture for Tcl automation: **`eval` / double evaluation**, **`exec` injection**, **`open |` pipelines**, **Expect secrets**, **package/`load` trust**, and the **safe interpreter** door. Goal: staff can review a Tcl/Expect PR and say what is dangerous, what to change, and what to monitor—without turning this chapter into an exploit kit or credential-stuffing playbook.

Default narrative: **Tcl 9.0.x** behavior, with **8.6** brownfield called out where security-relevant defaults differ (encoding, path habits). Pair with chapters **03** (substitution), **08** (`exec`/channels), **10** (packages), **12** (interps), and **15** (Expect).

---

## 1. Concepts

### 1. Threat model for Tcl scripts (one breath)

Tcl automation usually runs with the **privileges of the user or service account** that launches `tclsh` / `wish` / Expect. Assume:

| Assumption | Design consequence |
|------------|--------------------|
| Scripts often glue OS tools | `exec` / pipes are a shell-adjacent attack surface |
| Inputs arrive from env, files, tickets, devices | Untrusted strings must not become code |
| CI logs are widely readable inside the company | Secrets in Expect buffers are incidents |
| Packages and `load` pull native code | Supply chain is your problem |
| “It’s just an internal script” | Internal attackers and malware still exist |

Most Tcl security failures are **confused deputies** and **injection**—not clever crypto bugs.

### 2. `eval` and accidental code

**`eval`** concatenates arguments and evaluates the result as a Tcl script. It is powerful for metaprogramming and disastrous when untrusted data participates in the concatenation.

Related footguns:

| Construct | Risk |
|-----------|------|
| **`eval $cmd`** | `$cmd` becomes code |
| Building callbacks with double quotes | Substitution creates commands earlier than you think |
| **`subst`** on untrusted templates | Controlled substitution can still yield code |
| **`uplevel`** with crafted scripts | Runs in another scope—still code execution |

Staff rule: prefer list-based command assembly (`{*}` with proper lists, or explicit arg vectors) over string-built scripts. If you must `eval`, prove every fragment is trusted or strictly validated.

```tcl
# Safer shape: invoke a known command with a list of arguments
set args [list $userArg1 $userArg2]
myproc {*}$args

# Dangerous shape (review smell): untrusted string becomes script
# eval $userProvidedScript
```

### 3. `exec` injection

**`exec`** runs subprocesses. Metacharacters and word-splitting habits from shell do not map 1:1, but **untrusted fragments inside an `exec` line** still cause argument injection or unexpected programs.

Review habits:

- Keep the program name fixed and literal when possible.
- Pass arguments as separate words from validated data—not one interpolated string that looks like a shell line.
- Treat filenames and hostnames from tickets as hostile until validated.
- Remember `exec` can still reach network tools, shells, and interpreters that amplify damage.

```tcl
# Literacy — fixed program, separate arguments (illustrative)
exec /usr/bin/logger -- $message
```

Validation belongs **before** `exec`: allowlists for hosts/commands, path canonicalization, reject control characters where inappropriate.

### 4. `open |` and pipeline channels

`open |command …` creates a channel to a pipeline. It is another path to the OS command layer. Reviews should treat `|` opens like `exec`: who controls the command string? Prefer fixed pipelines; do not assemble pipe lines from raw user text.

Reading from or writing to such channels also raises **blocking / hang** concerns (availability), not only confidentiality.

### 5. Files, `source`, and script integrity

**`source`** runs another file as Tcl. If an attacker can write that path (world-writable script dir, writable `auto_path` entry, compromised NFS), they own the automation account.

Habits:

- Ship scripts on read-only or integrity-controlled volumes where practical.
- Restrict write access to `auto_path` / package directories.
- Be careful with `source` of paths built from untrusted input.

### 6. Expect and secrets (safe handling patterns)

Expect types into interactive programs. Secrets enter via `send`, environment, vault agents, or files. Review-level patterns:

| Pattern | Intent |
|---------|--------|
| Runtime secret injection from a vault / sealed CI secret | Avoid plaintext in git |
| Prefer key/cert auth over typed passwords when available | Shrink secret lifetime in buffers |
| Disable or redact logging around secret `send` | Stop CI artifact leaks |
| Separate privileged runners | Not every pipeline may drive enable-mode |
| Rotation runbook | Assume logs eventually leak |

Never document how to abuse login forms or spray credentials. Teach **storage, transport, redaction, rotation, and least privilege** only.

### 7. Package require and `load` trust

**`package require`** and **`load`** can execute Tcl index scripts and native libraries. Trust questions:

- Where did this package come from?
- Is `auto_path` unexpected in production?
- Are binary extensions signed/hashed/pinned in your supply-chain policy?
- Did CI fetch packages over insecure channels?

Treat binary `load` like shipping a shared object in any other language.

### 8. Safe interpreters (door)

Tcl can create **child interpreters** with reduced command sets (**safe** / restricted interps—see `interp` documentation). Use case: evaluate untrusted scripts or plugin code without granting `exec`, `open`, `load`, or filesystem reach.

Literacy—not a full sandbox course:

- Safe interps are a **reduction of Tcl surface**, not a substitute for OS isolation.
- Aliases back into a trusted master interp must not reintroduce confused-deputy holes.
- For true multi-tenant hostility, combine restricted interps with OS containers/VMs and least-privilege accounts.

---

## 2. Advanced concepts

### 1. Substitution is the root mechanism

Most injection bugs are **substitution bugs** (chapter **03**): data crossed into code because quotes/braces/`eval` were wrong. Security review of Tcl starts by tracing **where each untrusted byte becomes a Tcl word**.

### 2. Encoding and Unicode edge (8.6 vs 9)

Tcl 9 changes encoding defaults and string indexing relative to 8.6. Security-adjacent effects:

- Path and filename handling may differ across versions.
- Validation that assumed byte indices can miss characters.
- C extensions bridging bytes (chapter **14**) can disagree with script-level checks.

Pin versions when reviewing validation logic.

### 3. Channels to the network

`socket` / `http` scripts inherit TLS and trust problems like any client. Review: certificate validation, URL allowlists, and whether error messages leak tokens. This is not a networking deep-dive—flag missing TLS posture on production automation that leaves the machine.

### 4. `trace`, introspection, and information leaks

Powerful introspection (`info`, `trace`) helps debugging and can also reveal secrets in variables. Debug modes that dump full environments into tickets are a common spill path—gate them.

### 5. Denial of service

Unbounded `expect` without timeout, tight CPU loops, and recursive `eval` can hang operators and CI. Availability is part of security review for automation that gates releases or network changes.

### 6. Privilege and deployment topology

| Placement | Review emphasis |
|-----------|-----------------|
| Laptop runbook | User education; local secret stores |
| Shared jump host | Who can modify scripts; audit trails |
| CI runner | Secret masks; branch protection; untrusted PR isolation |
| Appliance on-box Tcl | Vendor update story; disable unused script entry points |

### 7. What this chapter will not teach

- Exploit chains, shell escapes as attack recipes, or bypass labs.
- Credential stuffing, password spraying, or social-engineering playbooks.
- How to defeat vaults, HSMs, or vendor secure boot.

If a PR needs hostile testing, use an approved security engagement—not handbook copy-paste.

### 8. Environment and argument surfaces

Automation often trusts `$env(...)` and `argv` too much:

| Input | Review move |
|-------|-------------|
| `env(PATH)` | Fixed absolute tool paths where privilege matters |
| `env` secrets | Prefer vault injection; scrub child environments |
| CLI args from wrappers | Validate early; never `eval` them |
| Files dropped in a spool dir | Treat contents as untrusted scripts/data |

A wrapper that builds a Tcl command line from a web form is a web app—review it like one.

### 9. Defense-in-depth matrix (practical)

| Layer | Control |
|-------|---------|
| Code | No stringy `eval`/`exec`; list APIs; allowlists |
| Secrets | Vault, redaction, rotation |
| Runtime | Least-privilege OS user; no shared writable script dirs |
| Interp | Safe/child interps for plugins |
| Host | Containers/VMs for multi-tenant or hostile input |
| Process | Code review + secret scanning + pinned packages |

No single layer is enough for high-impact network or factory automation.

### 10. Incident cues (recognition, not exploitation)

| Cue | Likely class |
|-----|--------------|
| Unexpected subprocess in audit logs | `exec` / pipeline injection or compromised script |
| Password strings in CI artifacts | Expect/logging redaction failure |
| New `.so` loaded from odd path | `auto_path` / package trust failure |
| Plugin script reads `/etc` or SSH keys | Safe interp not actually safe / alias hole |

Respond with containment, rotation, and root-cause on the trust boundary—not with ad-hoc “one more regex.”

### 11. Safe patterns cheat-sheet (reviewer pocket card)

- Build commands as lists; expand with `{*}`.
- Keep program names literal.
- `catch`/`try` around OS edges; fail closed on validation errors.
- Timeouts on every `expect`.
- Secrets: inject late, log never, rotate on spill.
- Pin packages; read-only install trees in prod images.

---

## 3. Applications and use cases

### Operations

- Change automation that touches routers, firewalls, or cloud CLIs via Expect/`exec`.
- Cron/CI glue that must not become a lateral-movement helper after a repo compromise.

### Software engineering

- Package design: privileged operations behind narrow procs with validation.
- Test doubles so unit tests do not need live credentials.

### Application / embedding

- Hosts that `Tcl_Eval` customer scripts (chapter **14**) must assume malice and use restricted interps + OS isolation.

### Security engineering

- Code review checklists for Tcl/Expect.
- Secret scanning for `send` of password-like strings and vault misuse.
- Incident response: leaked CI logs containing Expect transcripts → rotate.

| Role | Review question |
|------|-----------------|
| Security | What is the trust boundary for each string? |
| Ops | Which account runs this, and what can that account do? |
| SE | Can we eliminate `eval` / stringy `exec` in this PR? |
| App | If plugins exist, are they safe-interp’d? |

### Mapping findings to severity (review language)

| Finding | Suggested severity posture |
|---------|----------------------------|
| Untrusted `eval` / dynamic `source` | Block merge |
| `exec` built from ticket text | Block merge until allowlisted/list-form |
| Hard-coded prod password | Block merge; rotate if ever pushed |
| Missing Expect timeout | High—fix before prod |
| Verbose logs may include secrets | High—fix before shared CI |
| Broad `auto_path` in prod image | Medium—harden in follow-up with owner |
| Safe interp missing for low-risk internal DSL | Context-dependent—document threat model |

Use severity to drive conversation; still require fixes for block-level issues.

---

## Staff-level review checklist

- [ ] Untrusted input never reaches `eval` / `subst` / dynamic `source` without a proven validator.
- [ ] `exec` / `open |` use fixed programs and discrete arguments; no shell-ish concatenation from tickets/users.
- [ ] File paths for `source` / packages are controlled; `auto_path` is intentional.
- [ ] Expect secrets come from a vault/CI secret mechanism; not committed; logs redacted.
- [ ] Timeouts exist on interactive waits; failure paths do not dump secrets.
- [ ] `package require` / `load` sources are pinned and trusted for the environment.
- [ ] Untrusted script evaluation uses restricted/safe interps **and** OS-level isolation where threat requires it.
- [ ] Privileged automation runs on least-privilege accounts with audited access to modify scripts.
- [ ] Tcl 9 vs 8.6 differences considered for encoding/path validation on brownfield hosts.
- [ ] No “test credentials” left in examples that match production patterns.

---

## References

- [Tcl/Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
- [eval](https://www.tcl-lang.org/man/tcl9.0/TclCmd/eval.html)
- [exec](https://www.tcl-lang.org/man/tcl9.0/TclCmd/exec.html)
- [open](https://www.tcl-lang.org/man/tcl9.0/TclCmd/open.html)
- [interp](https://www.tcl-lang.org/man/tcl9.0/TclCmd/interp.html)
- [load](https://www.tcl-lang.org/man/tcl9.0/TclCmd/load.html)
- [package](https://www.tcl-lang.org/man/tcl9.0/TclCmd/package.html)
- [Expect](https://core.tcl-lang.org/expect/)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
