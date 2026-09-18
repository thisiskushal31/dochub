# Deployment strategies

[← Back to CI/CD](./README.md)

How you **cut traffic** to a new version matters as much as how you **build** it. Same artifact ([4](./4_Artifacts_And_Registries.md)); different risk and rollback shapes.

These patterns apply on **VMs/MIGs and load balancers** as well as Kubernetes — see [18](./18_VM_MIG_And_Host_Based_Deploy.md). Static/CDN is a different adapter: [17](./17_Static_Sites_And_CDN_Deploy.md). Full spectrum: [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md).

Vocabulary: deploy (put bits in an environment) vs **release** (users see the change) — feature flags decouple them ([Methodologies/2](../Methodologies/2_Practices_And_Workflows.md)).

## Strategy comparison

| Strategy | Idea | Typical rollback | Cost / notes |
|----------|------|------------------|--------------|
| **Recreate** | Stop old, start new | Redeploy previous | Downtime — Kubernetes documents this as `Recreate` |
| **Rolling** | Gradually replace instances | Roll back revision / scale previous | Default for Kubernetes `Deployment` (`RollingUpdate`) |
| **Blue-green** | Two prod-like stacks; switch router when green is ready | Switch router back | Capacity for two environments; popularized in Continuous Delivery / Fowler |
| **Canary** | Small slice of users/servers get the new version first | Shift traffic back / remove canary | Needs metrics split canary vs control (Google SRE workbook) |
| **Feature flags** | Code is dark until flag on | Flip flag off (often faster than redeploy) | Deploy ≠ release; still need good tests |

Progressive delivery = controlled, often automated, increase of exposure (canary steps, analysis, pause, promote) — implemented by controllers like Argo Rollouts / Flagger on Kubernetes, or by mesh/gateway weight rules. Controller deep-dive: [9_Progressive_Delivery_Controllers.md](./9_Progressive_Delivery_Controllers.md).

## Rolling update (Kubernetes baseline)

Kubernetes `Deployment` default strategy is **RollingUpdate**:

- Scale up new ReplicaSet while scaling down old  
- Tunables: `maxUnavailable`, `maxSurge` (defaults commonly **25%** each in current Deployment docs)  
- `kubectl rollout undo` uses retained ReplicaSet history (`revisionHistoryLimit`)

Rolling replaces pods gradually; it does **not** by itself give precise *traffic* percentages the way a weighted gateway route does.

## Blue-green (Fowler / Continuous Delivery)

Martin Fowler’s summary (aligned with Humble & Farley’s Continuous Delivery treatment):

1. Keep two production environments as identical as practical (**blue** live, **green** idle — or vice versa).  
2. Deploy and test the new version on the idle environment.  
3. Switch the **router** so all traffic goes to the newly verified side.  
4. Keep the previous side ready for fast switch-back.

**Database caveat (Fowler):** schema changes that only work with one app version break the switch. Separate schema deploy from app upgrade — expand schema so **both** app versions work, then upgrade app, then contract old schema later ([7](./7_DB_Migrations_In_Pipelines.md), [Parallel Change](https://martinfowler.com/bliki/ParallelChange.html)).

## Canary

Kubernetes docs describe a common pattern: **stable** and **canary** Deployments sharing a Service (label subsets), tuning replica counts to approximate traffic share. For precise splits, use Gateway API / ingress **weighted backends** (or a progressive-delivery controller).

Google SRE canarying guidance (workbook):

- Compare **canary vs control** metrics (errors, latency, saturation) — whole-service averages hide canary failure  
- Automate advance / pause / rollback from those signals when mature  
- Synthetic / black-box checks help when user traffic is noisy

Post-deploy verify layer: [5](./5_Verify_Rollback_And_Synthetic_Tests.md).

## Feature flags

| Use | Effect |
|-----|--------|
| Dark launch | Code in prod, behavior off |
| Gradual release | Percent / cohort rollout independent of pod count |
| Kill switch | Disable bad behavior without waiting for a full redeploy |
| Experiment | A/B — product question, not only ops |

Flags are **not** a substitute for CI quality. Prefer flags + progressive delivery together for high-risk changes.

Tool entry in this handbook: [Unleash/](./Unleash/README.md) (one product among many).

## Choosing

| Constraint | Prefer |
|------------|--------|
| Need simplest K8s default | Rolling |
| Need near-instant cutover + easy switch-back | Blue-green (pay for duplicate capacity) |
| Need early production signal with limited blast radius | Canary + analysis |
| Need “ship code Monday, expose Friday” | Flags |
| Shared DB + zero downtime | Rolling/canary/blue-green **plus** expand/contract migrations |

## Pitfalls

| Pitfall | Better |
|---------|--------|
| Blue-green with incompatible schema | Parallel change / expand-contract first |
| Canary without separate metrics | Label/version dimensions in observability |
| Rolling with readiness probes that lie | Fix probes; otherwise you roll broken pods |
| Rollback that rebuilds from branch tip | Redeploy **known good digest** ([4](./4_Artifacts_And_Registries.md)) |

## Next

- Verify + rollback decisioning: [5](./5_Verify_Rollback_And_Synthetic_Tests.md)  
- Pipeline wiring: [1](./1_Pipelines_Build_Test_Deploy.md)

## Further reading

- [Martin Fowler — Blue Green Deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)  
- [Kubernetes — Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) (RollingUpdate, canary note)  
- [Kubernetes — Managing workloads / canary](https://kubernetes.io/docs/concepts/workloads/management/)  
- [Google SRE Workbook — Canarying releases](https://sre.google/workbook/canarying-releases/)  
- [Martin Fowler — Parallel Change](https://martinfowler.com/bliki/ParallelChange.html)  
