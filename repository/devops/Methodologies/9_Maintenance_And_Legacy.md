# Maintenance and legacy systems

[← Back to Methodologies](./README.md)

Most of the world’s valuable software is **old**. DevOps on greenfield Kubernetes is only half the job. This file is how you keep shipping when the system is a mainframe integration, a CVS museum, or a Perl CGI box that still takes payments.

SWEBOK calls this **software maintenance**. Syntax for COBOL / Fortran / Perl / PHP / VB lives in [Languages/](../Languages/README.md) — here we own the **delivery and risk** posture.

---

## Types of maintenance

| Type | Meaning | Example |
|------|---------|--------|
| **Corrective** | Fix defects | Patch the batch job that double-charges |
| **Adaptive** | Survive environment change | New OS, TLS 1.2+, payment gateway API v2 |
| **Perfective** | Improve without new features | Faster batch window, better logging |
| **Preventive** | Reduce future risk | Add CI around a repo that had none |

All four appear in legacy estates. Ignoring adaptive work is how “sudden” compliance failures appear.

---

## When you meet old VCS and change systems

| System | What you do as DevOps |
|--------|------------------------|
| **Git** | Default paved road (this handbook) |
| **SVN** | Bridge: mirror or migrate; keep trunk discipline if stuck |
| **CVS** | Treat as archive + carefully planned migration; do not invent features there |
| **ChangeMan / mainframe SCM** | Respect enterprise change windows; automate *around* official promote paths |

Never force a hipster workflow that bypasses the system of record for regulated promote. Document the real path in a runbook ([7](./7_Docs_And_Runbooks.md)).

---

## Practical playbook for “we can’t rewrite it”

1. **Stabilize delivery** — scripted build, artifact, deploy; even if deploy is SSH + copy.  
2. **Add observability** — logs and a health check beat flying blind ([Observability/](../Observability/README.md)).  
3. **Wrap, don’t rewrite** — strangler facade, async sync, API front door ([System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts)).  
4. **Contain risk** — network segments, least privilege, immutable bastion patterns ([Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive), handbook [Security/](../Security/README.md)).  
5. **Plan retirement** — data escape hatch + date; maintenance without an exit is a career trap.  

---

## Language doors (syntax elsewhere)

| Legacy surface | Language notes |
|----------------|----------------|
| Mainframe business logic | [Languages/COBOL](../Languages/README.md) (and related) |
| Numeric / scientific | Fortran track under Languages |
| Old web / CGI | Perl, PHP |
| Windows line-of-business | VB.NET / VBA tracks |

Learn enough to **read logs and review changes**; you do not need to become a COBOL expert on day one.

---

## Pipelines on legacy

Even a “legacy” path deserves:

```text
build (or export artifact)
  → smoke test in non-prod
  → change ticket / approval if required
  → promote
  → verify
  → rollback notes in the runbook
```

Map that onto [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md) even if the implementation is Jenkins on a VM calling `scp`.

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| “Big bang rewrite” with no strangler | Incremental replacement |
| No CI because “repo is special” | Minimal CI is still CI |
| Heroes who know the one server | Document + cross-train + IaC where possible |
| Ignoring vendor freeze windows | Calendar-driven delivery |

## Trade-offs

Perfect cloud-native purity vs **business continuity**. Your job is safe change, not aesthetic purity. Measure with DORA *for that system’s constraints* ([5](./5_DORA_And_Delivery_Metrics.md)).

## Next

- Return to the on-ramp and pick a delivery chapter: [0_SE_Learning_DevOps_Start_Here](./0_SE_Learning_DevOps_Start_Here.md)  
- Or start filling CiCd concepts: [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md)

## Further reading

- SWEBOK — Software Maintenance knowledge area  
- Martin Fowler — Strangler Fig Application  
