# 07 — Workspaces, artifacts, and volumes

[← Previous](./06_Pipelines_Ordering_And_Finally.md) · [README](./README.md) · [Next: Auth →](./08_Auth_ServiceAccounts_And_RBAC.md)

## 1. Concepts

**Workspaces** declare filesystem inputs/outputs Tasks need. PipelineRuns bind them to `emptyDir`, PVC, ConfigMap, Secret, or volume claim templates.

```yaml
# Task snippet
spec:
  workspaces:
    - name: source
      description: Git checkout
  steps:
    - name: list
      image: alpine:3.20
      script: |
        #!/bin/sh
        ls -la $(workspaces.source.path)
```

```yaml
# PipelineRun binding sketch
spec:
  workspaces:
    - name: source
      volumeClaimTemplate:
        spec:
          accessModes: [ReadWriteOnce]
          resources: { requests: { storage: 1Gi } }
```

**Artifacts** (newer Pipelines surface) and classic volume mounts cover larger outputs than results. Prefer digest-addressed registry artifacts for deployables ([CiCd/4](../4_Artifacts_And_Registries.md)).

## 2. Advanced concepts

### Isolation and trust

Workspace isolation across steps/sidecars and trust boundaries matters when untrusted code shares a PVC. Isolated workspaces limit which steps see which mounts.

### Volume sources

| Source | Typical use |
|--------|-------------|
| `emptyDir` | Ephemeral compile |
| PVC / `volumeClaimTemplate` | Share across Tasks |
| ConfigMap / Secret | Config and credentials as files |
| CSI / projected | Platform-specific |

### Affinity assistants

When multiple Tasks share a PVC, affinity assistants help schedule onto the same node — see ([09](./09_Pod_Templates_Compute_And_Affinity.md)).

### Optional workspaces

Tasks can mark workspaces optional for Catalog reuse.

### Artifacts vs results vs workspaces

Results = small metadata; workspaces = filesystem; **Artifacts** = first-class larger outputs (confirm API maturity on your version). Prefer registry digests for deployables.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Git → build | PVC or claim template workspace |
| Secrets as files | Secret workspace (not env if avoidable) |
| Ephemeral compile | emptyDir |

**Staff checklist**

- Workspace names consistent Task ↔ Pipeline ↔ Run  
- Trust tiers do not share writable PVCs  
- Artifacts vs results roles clear  

**Good:** explicit bindings per Run. **Bad:** world-writable shared PVC across trust tiers.

## References

- [Workspaces](https://tekton.dev/docs/pipelines/workspaces/)  
- [Artifacts](https://tekton.dev/docs/pipelines/artifacts/)  
