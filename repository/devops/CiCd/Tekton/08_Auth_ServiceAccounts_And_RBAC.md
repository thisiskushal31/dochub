# 08 — Auth: ServiceAccounts and RBAC

[← Previous](./07_Workspaces_Artifacts_And_Volumes.md) · [README](./README.md) · [Next: Pods →](./09_Pod_Templates_Compute_And_Affinity.md)

---

## 1. Concepts

PipelineRuns/TaskRuns run Pods as a **ServiceAccount**. That SA’s RBAC and image-pull / registry-push credentials define blast radius.

| Concern | Practice |
|---------|----------|
| Kubernetes API access | Least-privilege Role/RoleBinding — not cluster-admin |
| Pull base images | `imagePullSecrets` on SA |
| Push to registry | Workload identity / short-lived tokens preferred over long-lived `.dockerconfigjson` |
| Task secrets | Secret volumes/workspaces; avoid echoing |

```yaml
apiVersion: tekton.dev/v1
kind: PipelineRun
metadata:
  generateName: ci-
spec:
  serviceAccountName: ci-builder
  pipelineRef: { name: ci }
  # params / workspaces …
```

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ci-builder
# secrets: […]  # only if you must use static pull/push secrets
```

Official Pipelines **auth** docs cover Docker config, Google Cloud, and related patterns.

---

## 2. Advanced concepts

### Trusted Resources

**Trusted Resources** verify that Task/Pipeline definitions come from approved sources (signatures / policies) before execution — pair with resolvers and admission. Enable only after reading current trusted-resources docs for your version.

### Labels

Tekton and you can set **labels** on Runs for ownership, cost, and metrics cardinality — use a small controlled vocabulary ([using labels](https://tekton.dev/docs/pipelines/labels/)).

### Hermetic / SPIRE literacy

**Hermetic** execution and **SPIRE**-related identity are advanced isolation doors — confirm current docs before designing on them ([20](./20_Observability_HA_Debug_And_Windows.md)). Threat-model notes in Pipelines security docs frame attacker assumptions.

### Container contract literacy

Container contract / step execution contracts constrain what steps may do — literacy when hardening platforms.

### Untrusted PRs

Pipelines-as-Code / Triggers must not grant prod push to fork PRs ([13](./13_Pipelines_As_Code.md), [12](./12_Triggers_EventListeners_And_Interceptors.md)).

### Regulated crypto / FIPS literacy

Some estates require FIPS-oriented builds of Tekton components themselves — that is a **platform binary** concern (see Pipelines developer/FIPS guidance), not a PipelineRun YAML switch. Own it with your security team if obligated ([20](./20_Observability_HA_Debug_And_Windows.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| CI only | SA can pull + create Pods in ns; cannot mutate cluster-wide |
| Release push | Separate SA + environment gate / manual PipelineRun |
| Multi-tenant | Namespace per team + NetworkPolicy |

**Staff checklist**

- No cluster-admin on CI SAs  
- Pull/push secrets or workload identity scoped per env  
- Trusted Resources considered for remote Task sources  
- Fork/PR path cannot push prod  

**Good:** one SA purpose per trust tier. **Bad:** default SA with cluster-admin for convenience.

---

## References

- [Authentication](https://tekton.dev/docs/pipelines/auth/)  
- [Trusted Resources](https://tekton.dev/docs/pipelines/trusted-resources/)  
- [Labels](https://tekton.dev/docs/pipelines/labels/)  
- [Pipelines security](https://tekton.dev/docs/pipelines/)  
