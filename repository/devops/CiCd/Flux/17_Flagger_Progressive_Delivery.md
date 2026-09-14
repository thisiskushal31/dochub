# 17 — Flagger: safer releases (canary / blue-green)

[← Previous](./16_Scale_Multitenancy_And_Platform_Config.md) · [README](./README.md) · [Next: Worked example →](./18_Worked_Example_Bootstrap_And_App.md)

---

## 1. Concepts

**Flux** makes the cluster match Git.  
**Flagger** (separate install, same Flux family) asks: *“Should this new version get more traffic — or should we roll back?”*

```text
Flux applies a new Deployment / Canary from Git
  → Flagger detects the change
  → shifts a little traffic
  → checks metrics / webhooks
  → promote or abort
```

| | Flux | Flagger |
|--|------|---------|
| Job | Match desired state | Make the *update* safe |
| Objects | Sources, Kustomization, HelmRelease | Canary (+ metrics templates, …) |
| Argo cousin | Argo CD | Argo Rollouts |

### Strategies (plain English)

| Strategy | Meaning | Needs L7 mesh/ingress? |
|----------|---------|-------------------------|
| **Canary** | Send a growing % of traffic to the new version | Usually yes |
| **A/B** | Route by header/cookie | Yes |
| **Blue/Green** | Flip all traffic when ready | No (CNI can work) |
| **Mirroring** | Shadow traffic to the candidate | Istio / Gateway API |

A canary run is often triggered by PodSpec / mounted ConfigMap / Secret changes.

```yaml
analysis:
  interval: 1m       # how often to measure
  threshold: 10      # failed checks before rollback
  maxWeight: 50      # max % to canary
  stepWeight: 2      # % to add each step
skipAnalysis: false  # true = emergency ship without analysis
```

Rough promote time ≈ `interval * (maxWeight / stepWeight)`.  
Rough fail time ≈ `interval * threshold`.

Install Flagger with Flux (GitOps the install) or Helm — see Flagger docs.

---

## 2. Advanced concepts

### Analysis loop

Webhooks (confirm / pre / during / post) + metric checks + weight steps + chat notifications. Non-2xx webhooks can halt promotion.

### Metrics

Wire SLOs users feel (errors, latency). Prometheus is common; other backends are supported. Without metrics, canaries are guesswork.

### Pick one traffic provider

Istio, Linkerd, Gateway API, NGINX, Contour, Traefik, … — standardize on **one**. Follow that tutorial on docs.flagger.app; this handbook does not reprint every mesh cookbook.

### vs Argo Rollouts

Same problem space, different CRDs — [Argo_Rollouts/](../Argo_Rollouts/README.md), [CiCd/9](../9_Progressive_Delivery_Controllers.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Safer prod web deploy | Canary + Prometheus + Gateway API/Istio |
| Compare two UX variants | A/B |
| No mesh yet | Blue/green |
| Hotfix now | Time-boxed `skipAnalysis` |

**Good:** Flagger + Flux with clear metric owners. **Bad:** canaries on everything with no metrics.

---

## References

- [Flagger docs](https://docs.flagger.app/main)  
- [Install with Flux](https://docs.flagger.app/main/install/flagger-install-with-flux)  
- [How it works](https://docs.flagger.app/main/usage/how-it-works)  
- [Deployment strategies](https://docs.flagger.app/main/usage/deployment-strategies)  
