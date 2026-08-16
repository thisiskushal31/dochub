# Expect: interactive automation

[← Back to Tcl](./README.md)

## What this chapter covers

**Expect** as interactive process automation: the **`spawn` / `expect` / `send`** mental model, **timeout** and **EOF** behavior, **`exp_continue`** and global **`expect_before` / `expect_after`** patterns, **`log_file` / `log_user`** ops logging habits, and the **DejaGnu** door for test suites. Focus is **ops and test** literacy—driving CLIs, installers, and device consoles that only speak interactively—not a credential-abuse playbook and not every Expect flag transcribed.

Default language narrative remains **Tcl 9.0.x**. Expect itself often appears on **older hosts** (classic **Expect 5.45.x** line on **Tcl 8.6** appliances). Always pin what your image actually runs and verify compatibility before assuming a greenfield Tcl 9 + Expect stack.

---

## 1. Concepts

### 1. What Expect is

**Expect** extends Tcl with commands that:

1. **Start** an interactive program (`spawn`).
2. **Wait** for patterns on that program’s output (`expect`).
3. **Type** input as if a human were at the keyboard (`send`).

It exists because many critical tools are **dialogue-shaped**: password prompts, confirmation questions, pager UIs, boot consoles, vendor CLIs. Batch `exec` fails when the child refuses to run without a tty-style conversation. Expect automates that conversation **deterministically** (when patterns and timeouts are honest).

Expect is still Tcl: substitution, lists, `catch`, packages, and quoting rules apply. Quoting mistakes in `expect` clauses are the same bug family as elsewhere—only louder when a device session hangs at 2 a.m.

### 2. Mental model: spawn → expect → send

```text
spawn  →  child process + pty-like session
expect →  match output (or timeout / eof)
send   →  deliver keystrokes / lines to the child
(repeat expect/send as the dialogue requires)
```

| Command | Job |
|---------|-----|
| **`spawn`** | Launch the program under Expect’s control; sets spawn id |
| **`expect`** | Block until a pattern matches, or timeout/EOF |
| **`send`** | Write to the spawned process |
| **`interact`** | Hand control back to a human (ops break-glass pattern) |

```tcl
# Shape only — illustrate the dialogue loop
package require Expect
spawn ssh example.invalid
expect {
    "password:" { send "REDACTED\n" }
    timeout     { error "prompt not seen" }
    eof         { error "remote closed early" }
}
```

The snippet is a **shape**, not a secrets recommendation. Real automation must not hard-code credentials (see §2 and chapter **16**).

### 3. Patterns: exact strings, globs, regex

`expect` can match literal strings, glob-style patterns, or regular expressions depending on how you write the clause. Staff literacy:

- Prefer the **most specific** pattern that remains stable across versions.
- Over-broad regexes match the wrong banner and “succeed” wrongly.
- Remember Tcl quoting: braces protect patterns from premature substitution; double quotes do not.

### 4. Timeout and EOF are first-class outcomes

Interactive automation fails in three common ways:

| Outcome | Meaning | Healthy response |
|---------|---------|------------------|
| **Match** | Expected dialogue step arrived | Continue script |
| **`timeout`** | Pattern not seen in time | Fail loudly, dump buffer, retry policy |
| **`eof`** | Child closed the session | Distinguish success-at-end vs crash |

Default timeouts that are too short flake under load; timeouts that are infinite hide deadlocks forever. Staff reviews should see an explicit timeout strategy per dialogue step—not one global “hopefully enough.”

```tcl
# Literacy — name the failure modes
set timeout 20
expect {
    -re {Prompt>} { # matched }
    timeout       { error "step N timed out" }
    eof           { error "unexpected EOF at step N" }
}
```

### 5. Buffers, logging, and debugging

When Expect “does nothing,” the child usually printed something you did not match. Habits:

- Enable Expect logging/diagnostics in **non-prod** to see the raw stream.
- Capture the unmatched buffer in error paths.
- Redact secrets from logs (passwords in `send` must not echo into CI artifacts).

Debugging without logging is guesswork; logging without redaction is an incident.

### 6. `exp_continue` — stay in the same `expect`

Sometimes one `expect` must match **multiple** interim patterns before the dialogue step is done (banners, “press return”, repeated prompts). **`exp_continue`** keeps the current `expect` command running after a clause fires, instead of returning:

```tcl
expect {
    -re {Press Return to continue} {
        send "\r"
        exp_continue
    }
    -re {Username:} {
        # fall out of expect — next send/expect handles auth shape
    }
    timeout { error "banner/login not seen" }
    eof     { error "session closed during banner" }
}
```

Use `exp_continue` for **benign interim** noise you must clear. Do not use it to silently retry forever without a timeout budget—pair with explicit `timeout` and bounded loops at the script level.

### 7. `expect_before` / `expect_after` — global pattern layers

**`expect_before`** and **`expect_after`** install patterns that apply around ordinary `expect` calls (before/after the patterns you write inline). Typical ops uses:

| Hook | Common literacy use |
|------|---------------------|
| `expect_before` | Always treat `eof` / connection-reset as failure; catch dangerous banners once |
| `expect_after` | Last-chance logging or “unmatched buffer” dumps |

```tcl
# Shape — fail closed on unexpected EOF everywhere
expect_before {
    eof { error "remote EOF" }
}
# … many expect/send steps …
# Clear or reset globals when the dialogue phase ends (see Expect docs for exact reset forms).
```

Keep these layers **small and boring**. Over-broad `expect_before` regexes steal matches from specific steps and create “works until MOTD changes” flakes. Prefer state-machine procs (Advanced §9) over a giant global pattern soup.

### 8. `log_file` / `log_user` — ops logging habits

| Command | Role |
|---------|------|
| **`log_user`** | `1`/`0` — whether Expect echoes the dialogue to the controlling terminal / stdout |
| **`log_file`** | Capture the session stream to a file for post-mortems |

```tcl
log_user 0                    ;# quieter CI console
log_file -a /var/log/myjob/expect.log
# … spawn/expect/send …
log_file                      ;# stop/close per Expect’s documented form
```

Habits:

- Turn **`log_user` off** in shared CI when the stream is huge or secret-adjacent; keep step-level `puts` for human progress.
- Use **`log_file`** in lab/debug or controlled failure capture—not as an unredacted forever tape of production passwords.
- **Redact:** anything you `send` that is a secret will appear in Expect logs if logging is on. Treat log files like credential material: permissions, retention, scrubbing before tickets (ch **16**).
- Never paste full Expect logs containing authentication material into public issue trackers.

This handbook does **not** teach credential stuffing, password spraying, or bypass recipes—only safe automation of systems you are authorized to drive.

### 9. `interact` and human handoff

`interact` yields control to the operator while keeping the session open. Useful for break-glass diagnostics; dangerous if left in unattended CI. Review: unattended jobs should not rely on `interact`.

### 10. DejaGnu door

**DejaGnu** is a Tcl/Expect-based framework historically used to run tool test suites (compilers, debuggers, embedded targets). Mental model:

- Test descriptions drive Expect dialogues against a tool under test.
- Boards/targets and toolchains are configured as DejaGnu “board” / tool properties.
- Failures are pattern/timeout oriented—same literacy as raw Expect.

This handbook does not teach DejaGnu end-to-end. Know it exists when you inherit GCC/binutils-style or embedded test farms that speak `runtest`. Official DejaGnu docs are the next stop (References).

---

## 2. Advanced concepts

### 1. Version and host reality (Tcl 9 vs Expect deployments)

| Reality | Staff action |
|---------|--------------|
| Many appliances still ship **Tcl 8.6 + Expect 5.45.x** | Treat as brownfield; test on *that* stack |
| Greenfield Tcl **9** + Expect | Verify your distro/package actually builds/supports the pair before rewriting |
| “Works on my MacPorts Expect” | Irrelevant if production is an old network OS image |

Pin `info patchlevel`, Expect package version, and OS image together in the runbook.

### 2. PTY semantics and “why `exec` was not enough”

Expect’s power comes from driving a **pseudo-terminal**. Programs that change behavior when stdout is not a tty (prompt suppression, pager detection, libc line buffering) often only automate correctly under Expect. Conversely, some programs detect Expect/automation—know your target.

### 3. Multiple spawn ids

You can drive more than one child. Scripts that forget which spawn id is current send keystrokes to the wrong session. Advanced dialogues (two devices, or tool + debugger) must track spawn ids explicitly.

### 4. Timing races and “sleep” as design smell

`send` followed by blind `sleep` instead of `expect` is fragile. Prefer expect-on-prompt. Sleep remains occasionally necessary for hardware settle times—document why.

### 5. Exit status and overall job success

Matching a final prompt does not always mean the remote change applied. Pair Expect dialogue success with:

- explicit command exit codes when available,
- verification queries,
- idempotent retries with clear limits.

### 6. Secrets handling (review posture only)

Interactive automation often types passwords, enable secrets, API tokens, or one-time codes. Defense habits:

| Habit | Why |
|-------|-----|
| Pull secrets from a vault / CI secret store at runtime | Avoid committing credentials |
| Prefer key-based or cert auth when the platform allows | Fewer typed secrets |
| Redact logs and core dumps | Prevent secret spillage |
| Limit who can read automation that can `send` secrets | Same as any privileged runbook |
| Rotate after exposure | Treat leaked Expect logs as credential incidents |

Chapter **16** expands review questions. This chapter forbids exploit recipes and credential-stuffing playbooks—only safe handling patterns.

### 7. Failure injection for tests

Good Expect tests deliberately assert `timeout`/`eof` paths (wrong prompt, early close). Suites that only test the happy banner will green-merge until production latency doubles.

### 8. When not to use Expect

| Prefer something else when… | Alternative door |
|-----------------------------|------------------|
| Tool has a real API / non-interactive mode | Call the API; skip dialogue |
| Pure file transforms | Ordinary Tcl / other languages |
| GUI-only app without CLI | Not Expect’s sweet spot (Tk or vendor tooling) |
| You need browser automation | Different stack entirely |

Expect shines at **stubborn interactive CLIs**. Do not use it as a general orchestration engine when batch interfaces exist.

### 9. Designing a dialogue like a state machine

Treat each prompt as a state:

```text
S0 spawn → S1 banner → S2 auth → S3 ready prompt → S4 command → S5 verify → S6 exit
```

For each state document: expected patterns, timeout, success transition, failure transition, whether secrets are involved. Scripts written as flat “send/expect soup” become unreviewable; procs named after states review cleanly.

### 10. Logging levels for humans vs CI

| Audience | What to log |
|----------|-------------|
| Developer debugging | Full stream (local only), including unmatched buffers |
| CI | Step names, match/timeout/eof outcomes, redacted excerpts |
| Production change record | Command intent + verification result; never passwords |

`exp_internal` / verbose Expect tracing is a **dev tool**, not a default in shared runners. Prefer `log_file` with redaction over forever-on `log_user` in CI (Concepts §8).

### 11. Flakes: classifying them

| Flake class | Mitigation |
|-------------|------------|
| Slow banner | Longer timeout; wait for stable prompt regex |
| Extra MOTD / legal banner | Match optional blocks; avoid anchoring on first line only |
| Locale/encoding differences | Pin locale; watch Tcl 9 encoding defaults |
| Parallel lab contention | Serialize device locks; unique spawn per job |

If the only fix is “sleep longer,” keep looking for the real prompt.

### 12. DejaGnu structure (one level deeper)

When you open a DejaGnu tree, expect roughly:

- tool-specific Expect helpers,
- test cases that spawn the tool under test,
- board/site configuration describing how to reach targets.

Your job in a PR may be a single `.exp` case. Apply the same timeout/EOF/secret rules. Framework wiring changes deserve a reviewer who has run `runtest` on that farm once.

---

## 3. Applications and use cases

### Operations

- Network gear consoles, serial adapters, bootstrap wizards that ask questions.
- Legacy installers that require confirmation strings.
- Controlled remote shell dialogues where APIs do not exist yet.

### Testing / SE

- DejaGnu-style tool verification.
- Regression packs that assert prompt sequences after upgrades.
- Bringing non-interactive CI to tools that “always needed a human.”

### Application / embedding adjacent

- Product test harnesses that spawn the product CLI and validate dialogues.
- Manufacturing / lab benches driving instruments via serial CLIs.

### Security / compliance

- Privileged Expect jobs are **break-glass automation**—inventory them, restrict runners, audit logs with redaction.
- Separate “read-only show commands” automation from “config change” automation.

| Role | Expect question |
|------|-----------------|
| Ops | What prompt means success, and what do we do on timeout? |
| SE | Is this tested on the production image’s Expect/Tcl pin? |
| Security | Where do secrets enter, log, and expire? |
| App | Can we expose a non-interactive mode and delete this dialogue? |

### Sample ops acceptance criteria

A change-automation Expect job is acceptable when:

- It runs non-interactively on the pinned lab/prod image.
- Every step has timeout and EOF handling with actionable errors.
- Secrets never appear in git, CI logs, or failure tickets.
- A verification query proves the change (not only prompt match).
- Rollback or safe failure mode is documented for partial applies.
- Ownership and on-call path are listed in the repo README.

---

## Staff-level review checklist

- [ ] Expect is justified—no adequate non-interactive API.
- [ ] Tcl/Expect/OS versions pinned; brownfield **8.6** called out when relevant.
- [ ] Dialogue steps use `expect` with explicit **`timeout`** and **`eof`** handling.
- [ ] `exp_continue` only for bounded interim patterns; `expect_before`/`expect_after` stay small and reviewed.
- [ ] Patterns are stable and specific; not brittle whitespace junk *or* overly greedy regexes.
- [ ] No hard-coded production secrets in the script or repo history.
- [ ] CI/ops logs redact credentials and tokens from `send` / buffers; `log_file` / `log_user` choices match audience.
- [ ] Unattended jobs do not require `interact`.
- [ ] Success criteria include verification beyond “matched final prompt” when changes are mutating.
- [ ] Retries are bounded; failures surface actionable buffers.
- [ ] No credential-stuffing or unauthorized access patterns—authorized automation only.
- [ ] DejaGnu/tool-farm changes link to official DejaGnu docs when framework-specific.

---

## References

- [Expect](https://core.tcl-lang.org/expect/)
- [Tcl/Tk 9.0 manual pages](https://www.tcl-lang.org/man/tcl9.0/)
- [GNU DejaGnu](https://www.gnu.org/software/dejagnu/)
- [Migrating scripts to Tcl 9](https://core.tcl-lang.org/tcl/wiki?name=Migrating+scripts+to+Tcl+9)
