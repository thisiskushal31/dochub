# Maintenance and legacy systems

[← Back to Methodologies](./README.md)

**Staircase:** Floor 5 — estate reality (with [20 — Full spectrum](./20_Delivery_Reality_Full_Spectrum.md)).

Most of the world’s valuable software is **already running**. DevOps that only works on greenfield clusters is incomplete. This file is the **posture** for brownfield: mainframes, classical VM estates, old VCS, long-lived languages — keep shipping safely without pretending the estate is something else.

SWEBOK calls this **software maintenance**. Syntax for COBOL / Fortran / Perl / PHP / VB lives in [Languages/](../Languages/README.md). Hands-on deploy adapters: [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md)–[21](../CiCd/21_Compose_And_Swarm_Delivery.md), [CiCd/19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md).

## Types of maintenance

| Type | Meaning | Example |
|------|---------|--------|
| **Corrective** | Fix defects | Patch the batch job that double-charges |
| **Adaptive** | Survive environment change | New OS, TLS requirements, payment API v2 |
| **Perfective** | Improve without new features | Faster batch window, better logging |
| **Preventive** | Reduce future risk | Add CI around a repo that had none |

All four appear in legacy estates. Ignoring adaptive work is how “sudden” compliance failures appear.

## The same DevOps questions (legacy edition)

| Question | Legacy-shaped answer |
|----------|----------------------|
| Integrate frequently? | As often as SoR and freeze windows allow — shrink *batch of change* inside the window |
| Always releasable? | Artifact + known promote path, even if promote is a ticketed job |
| Verify after change? | Smoke in non-prod; health after prod promote |
| Fast recovery? | Previous artifact + runbook; expand/contract for data |
| Shared ownership? | App + ops + SoR owners in one change story — not throw over wall |

If you cannot answer these, you do not yet have DevOps on that estate — you have hope.

## When you meet old VCS and change systems

| System | What you do as DevOps |
|--------|------------------------|
| **Git** | Default paved road (this handbook) |
| **SVN** | Bridge: mirror or migrate; keep trunk discipline if stuck |
| **CVS** | Archive + planned migration; do not invent features there |
| **ChangeMan / mainframe SCM** | Respect enterprise change windows; automate *around* official promote paths |

Never force a workflow that bypasses the **system of record** for regulated promote. Document the real path in a runbook ([7](./7_Docs_And_Runbooks.md)).

## Classical brownfield (still “legacy” to cloud-native teams)

Many estates are not mainframes — they are **Jenkins + Linux + Apache/Tomcat + Ansible** (the classical syllabus path). That is Floor 5 reality, not a footnote.

| Pattern | Mindset | CiCd door |
|---------|---------|-----------|
| Poll SCM / controller-agent Jenkins | Scripted CI still counts | [CiCd/20](../CiCd/20_Classical_Jenkins_Host_And_Web_Deploy.md) |
| SSH/package/systemd deploys | Prefer artifacts over snowflake hosts | [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md) |
| Compose / Swarm multi-tier | Containers without full K8s ops | [CiCd/21](../CiCd/21_Compose_And_Swarm_Delivery.md) |

Strangling toward GitOps/K8s is optional and incremental — not a moral requirement on day one.

## Practical playbook for “we can’t rewrite it”

1. **Stabilize delivery** — scripted build, artifact, deploy; even if deploy is SSH + copy.  
2. **Add observability** — logs and a health check beat flying blind ([Observability/](../Observability/README.md)).  
3. **Wrap, don’t rewrite** — strangler facade, async sync, API front door ([System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts)).  
4. **Contain risk** — network segments, least privilege ([Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive), [Security/](../Security/README.md)).  
5. **Plan retirement** — data escape hatch + date; maintenance without an exit is a career trap.  

## Language doors (syntax elsewhere)

| Legacy surface | Language notes |
|----------------|----------------|
| Mainframe business logic | COBOL (and related) under [Languages/](../Languages/README.md) |
| Numeric / scientific | Fortran track |
| Old web / CGI | Perl, PHP |
| Windows line-of-business | VB.NET / VBA tracks |

Learn enough to **read logs and review changes**; you do not need to become a COBOL expert on day one.

## Pipelines on legacy

```text
build (or export artifact)
  → smoke test in non-prod
  → change ticket / approval if required
  → promote (SoR path or scripted host deploy)
  → verify
  → rollback notes in the runbook
```

Map onto [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md). Full spectrum mindset: [20](./20_Delivery_Reality_Full_Spectrum.md).

## Pitfalls

| Pitfall | Better |
|---------|--------|
| “Big bang rewrite” with no strangler | Incremental replacement |
| No CI because “repo is special” | Minimal CI is still CI |
| Heroes who know the one server | Document + cross-train + IaC where possible |
| Ignoring vendor freeze windows | Calendar-aware delivery; shrink batches inside windows |
| Shame about classical stacks | Classical done well beats fashionable done poorly |

## Trade-offs

Cloud-native purity vs **business continuity**. Your job is safe change, not aesthetic purity. Measure with DORA *for that system’s constraints* ([5](./5_DORA_And_Delivery_Metrics.md)).

## Next on the staircase

- Widen the map: [20_Delivery_Reality_Full_Spectrum.md](./20_Delivery_Reality_Full_Spectrum.md)  
- Then amplifiers: [19](./19_Durable_Mindsets_And_Evolving_Toolsets.md)  
- Or implement: [CiCd staircase](../CiCd/README.md)

## Further reading

- SWEBOK — Software Maintenance knowledge area  
- Martin Fowler — Strangler Fig Application  
- [CiCd/23 Classical DevOps stack map](../CiCd/23_Classical_DevOps_Stack_Map.md)  
