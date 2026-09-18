# 19 — Operator and platform config

[← Previous](./18_Results_And_Pruner.md) · [README](./README.md) · [Next: Operate →](./20_Observability_HA_Debug_And_Windows.md)

## 1. Concepts

**Tekton Operator** installs and reconciles Tekton components via CRs such as:

| CR (literacy) | Manages |
|---------------|---------|
| `TektonConfig` / `TektonOperator` | Overall operator config |
| `TektonPipeline` | Pipelines component |
| `TektonTrigger` | Triggers |
| `TektonDashboard` | Dashboard |
| `TektonChain` | Chains |
| `TektonResult` | Results |
| `TektonPruner` | Pruner |
| Add-ons | PAC, Catalog add-ons, … (distro-dependent) |
| `TektonKueue` | Queue/fair-share scheduling literacy |
| `TektonScheduler` | Scheduler-related config literacy |
| Manual approval gate | Human gate CR literacy (where shipped) |
| NetworkPolicy / Proxy / Air-gap images | Locked-down / disconnected installs |
| SCC / OpenShift TLS | OpenShift platform edges |
| Syncer / multicluster proxy | Advanced multi-cluster literacy |

```yaml
# Illustrative — field names vary by Operator version; export yours
apiVersion: operator.tekton.dev/v1alpha1
kind: TektonConfig
metadata:
  name: config
spec:
  profile: all
  # pipeline:, trigger:, chain:, result:, pruner:, dashboard: …
```

Prefer GitOps of Operator CRs over click-ops.

## 2. Advanced concepts

**Air-gap** image configuration, **Proxy**, **NetworkPolicy**, OpenShift **SCC**, **OpenShift centralized TLS** management, **OpenShift Pipelines-as-Code** via Operator, **ManualApprovalGate**, **Kueue**, **TektonAddon**, Syncer/multicluster helpers — all are real Operator doc surfaces. Treat distro packs (OpenShift Pipelines + PAC) as the same product family with vendor CR names; still learn upstream Tekton CRDs.

**Staff checklist**

- `TektonConfig` (or equivalent) in Git  
- Component versions pinned and upgrade-tested  
- Air-gap/proxy documented if used  
- Approval/Kueue only with owners  

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Full platform | Operator profile including Triggers+Chains+Dashboard |
| Minimal | Pipelines-only profile |
| Multi-env | Separate clusters or namespaces + GitOps |

**Good:** versioned Operator CRs. **Bad:** hand-applied release YAML drifting from Operator desired state.

## References

- [Operator](https://tekton.dev/docs/operator/)  
- [Operator install](https://tekton.dev/docs/operator/)  
