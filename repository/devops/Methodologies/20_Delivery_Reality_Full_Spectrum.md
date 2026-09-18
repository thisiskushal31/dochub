# Delivery reality: full spectrum

[← Back to Methodologies](./README.md)

**Staircase:** Floor 5 (after foundations and operate). Pair with [9 — Maintenance and legacy](./9_Maintenance_And_Legacy.md).

DevOps is not a single stack. It is a **posture** — small batches, automated verification, fast feedback, shared ownership — applied wherever value is trapped: a COBOL batch, a Jenkins+VM estate, a static site, a Kubernetes platform, or a distributed model-serving system.

This file is the **mindset**. Hand-on adapters live in [CiCd/](../CiCd/README.md) (especially [19](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md), [20](../CiCd/20_Classical_Jenkins_Host_And_Web_Deploy.md)–[23](../CiCd/23_Classical_DevOps_Stack_Map.md), [22](../CiCd/22_MLOps_And_AI_System_Delivery.md)).

## One mindset, many estates

```text
Same questions on every estate:
  Can we integrate frequently?
  Is every good change releasable?
  Do we verify after promote?
  Can we roll back or mitigate fast?
  Who owns the outcome together?
```

| Estate (examples) | Mindset still applies | Implementation door |
|-------------------|----------------------|---------------------|
| Mainframe / regulated SoR promote | Automate *around* SoR; don’t bypass audit | [9](./9_Maintenance_And_Legacy.md), CiCd/19 |
| Classical Jenkins + Linux + web/app servers | Poll SCM → build → deploy → smoke | [CiCd/20](../CiCd/20_Classical_Jenkins_Host_And_Web_Deploy.md) |
| VM fleets / MIG / ASG | Rolling, health, previous artifact | [CiCd/18](../CiCd/18_VM_MIG_And_Host_Based_Deploy.md) |
| Compose / Swarm | Multi-tier containers without full K8s | [CiCd/21](../CiCd/21_Compose_And_Swarm_Delivery.md) |
| Static + CDN | Build once, cache honesty, smoke URLs | [CiCd/17](../CiCd/17_Static_Sites_And_CDN_Deploy.md) |
| Kubernetes + GitOps | Progressive delivery, digests | [CiCd/9](../CiCd/9_Progressive_Delivery_Controllers.md) |
| ML / AI systems (single or distributed) | Model registry, eval gates, serve/monitor | [CiCd/22](../CiCd/22_MLOps_And_AI_System_Delivery.md) |
| Assisted coding on the loop | Same gates; small batches; human accountability | [19](./19_Durable_Mindsets_And_Evolving_Toolsets.md) |

## Why this floor exists on the staircase

Without it, readers finish Three Ways and assume “real DevOps” only means the newest orchestrator. Fintech and enterprises still run COBOL and change windows. Classical training (Jenkins, Ansible, Compose/Swarm) still matches a huge share of jobs. AI serving is still **delivery** — promote an artifact, verify, observe.

Climb: foundations → habits → **then** apply on the estate you actually have → then amplify.

## How to use this floor

1. Name your estate(s) honestly (often more than one).  
2. For each, answer the five questions above.  
3. Pick the CiCd adapter that matches — do not force K8s rituals onto a regulated mainframe promote.  
4. Measure with DORA *inside* real constraints ([5](./5_DORA_And_Delivery_Metrics.md)).  
5. Improve the constraint ([10](./10_Core_Principles_Three_Ways_CALMS.md)), not the fashion.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| “We can’t do DevOps; we’re legacy” | Minimal scripted pipeline + verify is still DevOps |
| “We only do K8s; VMs don’t count” | Same loop; different adapter |
| AI demos that skip eval/registry/monitor | Treat models as versioned releasable artifacts |
| Floor 6 amplifiers before Floor 1–5 | Foundations first |

## Next on the staircase

- Deepen brownfield craft: [9](./9_Maintenance_And_Legacy.md)  
- Amplifiers (only after foundations): [19](./19_Durable_Mindsets_And_Evolving_Toolsets.md)  
- **Implement:** [CiCd staircase](../CiCd/README.md) starting at [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md)

## Further reading

- SWEBOK — Software Maintenance  
- [CiCd/23 Classical stack map](../CiCd/23_Classical_DevOps_Stack_Map.md)  
- [CiCd/19 Delivery spectrum](../CiCd/19_Delivery_Spectrum_Legacy_Through_Modern.md)  
