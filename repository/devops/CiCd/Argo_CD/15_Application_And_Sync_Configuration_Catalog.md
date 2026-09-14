# 15 — Application and sync configuration catalog

[← Previous](./14_Feature_And_Configuration_Coverage_Map.md) · [Argo CD](./README.md) · [Next: Control plane config →](./16_Control_Plane_Configuration_Catalog.md)

---

## 1. Concepts — every Application configuration surface

An Application is configured through:

1. **`spec`** fields (source(s), destination, project, syncPolicy, ignoreDifferences, …)  
2. **`metadata`** (name, namespace, finalizers, labels, annotations)  
3. **Resource annotations** on child manifests (hooks, sync-options, wave numbers)  
4. **Live operations** (sync, refresh, rollback, selective sync, terminate) via UI/CLI/API  

This chapter catalogs those surfaces so you can configure deliberately — not by folklore.

### Application `spec` map

| Field | Purpose | Practice notes |
|-------|---------|----------------|
| `project` | AppProject name | Never leave prod on wide `default` |
| `source` / `sources` | Desired manifests | Prefer GitOps repo; pin revision in prod |
| `destination.server` **or** `name` | Target cluster | Do not set both |
| `destination.namespace` | Default ns for namespaced objects | Pair with CreateNamespace or pre-create |
| `syncPolicy.automated` | Auto sync / prune / selfHeal / allowEmpty / enabled | DEV on; prod gated |
| `syncPolicy.syncOptions` | Sync behavior flags | See full list below |
| `syncPolicy.retry` | Backoff on failed sync | Set for flaky networks/CRD races |
| `syncPolicy.managedNamespaceMetadata` | Labels/annotations on auto-created ns | Only with CreateNamespace |
| `ignoreDifferences` | Diff ignore rules | Use RespectIgnoreDifferences on sync if needed |
| `revisionHistoryLimit` | History entries for rollback UI | Default ~10; 0 saves space, hurts rollback UX |
| `info` | Extra UI key/value links | Docs, dashboards |
| `sourceHydrator` | Dry → hydrated Git (beta) | Optional; needs hydrator install |

Finalizers on the Application control cascade delete of managed resources when the Application is removed.

### Sync policy quick reference

```yaml
syncPolicy:
  automated:
    enabled: true
    prune: true
    selfHeal: true
    allowEmpty: false
  syncOptions:
    - CreateNamespace=true
  retry:
    limit: 5
    backoff:
      duration: 5s
      factor: 2
      maxDuration: 3m
```

Omit `automated` for manual sync. Sync **windows** are defined on the Project or via sync window config (time-based allow/deny) — use for change freezes ([06](./06_Sync_Policies_Waves_Projects_And_RBAC.md)).

---

## 2. Advanced concepts — sync options, hooks, compare, ops

### Sync options (complete catalog)

Set on `spec.syncPolicy.syncOptions` and/or annotation `argocd.argoproj.io/sync-options` (comma-separated; resource-level overrides Application-level for prune/delete semantics).

| Option | Meaning | When |
|--------|---------|------|
| `Prune=false` | Do not prune this resource | Protect critical objects |
| `Prune=confirm` | Prune only after confirmation; sync waits | Namespaces / scary deletes |
| `Delete=false` | Do not delete on app delete cascade | Retain data stores carefully |
| `Delete=confirm` | Confirm before delete | Same |
| `Validate=false` | `kubectl apply --validate=false` | RawExtension / odd CRDs |
| `SkipDryRunOnMissingResource=true` | Skip dry-run when CRD not found yet | CRD created in-band or by another controller |
| `ApplyOutOfSyncOnly=true` | Apply only OutOfSync resources; hooks still run | Large apps; faster sync |
| `PrunePropagationPolicy=background\|foreground\|orphan` | How pruned objects delete | Match Kubernetes garbage-collection needs |
| `PruneLast=true` | Prune as last implicit wave | Dependencies need to go last |
| `Replace=true` | replace/create instead of apply | Immutable field changes |
| `Force=true` | Force (often with Replace) | Stuck deletes / immutable fights — dangerous |
| `ServerSideApply=true` | Server-side apply | Large CRDs; field ownership |
| `ClientSideApplyMigration=false` | Control SSA migration behavior | When adopting SSA |
| `FailOnSharedResource=true` | Fail if another Application owns resource | Prevent silent dual ownership |
| `RespectIgnoreDifferences=true` | Apply ignoreDifferences during sync patch | HPA replicas etc. |
| `CreateNamespace=true` | Create destination namespace if missing | App teams without cluster-admin |

**Good practice:** start with `CreateNamespace=true` + normal apply; add Replace/Force only with a written reason. **Bad practice:** Force+Replace as default sync options on every app.

### Hooks and waves

| Annotation / idea | Role |
|-------------------|------|
| `argocd.argoproj.io/hook`: PreSync, Sync, PostSync, SyncFail, Skip, PreDelete, PostDelete | Phase |
| `argocd.argoproj.io/sync-wave`: integer | Order within phases (lower first; prune reverses) |
| `argocd.argoproj.io/hook-delete-policy` | HookSucceeded / HookFailed / BeforeHookCreation / … |

Hooks are Jobs/Pods/Workflows/any resource. Failed PreSync fails the sync. Do not replace CI test suites with hour-long PostSync hooks.

### Compare options & diff strategies

Application/system compare options control how live vs desired are compared (e.g. ignore aggregated roles noise). Diff strategies and `ignoreDifferences` (jsonPointers, jqPathExpressions, managedFieldsManagers) tame permanent OutOfSync. Prefer fixing Git; ignore is the escape hatch ([10](./10_Ownership_Diffing_Webhooks_And_Observability.md)).

### Selective sync vs ApplyOutOfSyncOnly

| | Selective sync | ApplyOutOfSyncOnly |
|--|----------------|--------------------|
| Intent | Operator picks resources this operation | Sync engine skips already-Synced objects |
| Hooks | May not run as full sync | Still run; history recorded |

### Skip reconcile

Annotation/flag to stop reconciling an Application temporarily (incident freeze). Always pair with an owner and expiry — forgotten skip-reconcile is silent drift.

### Sync via kubectl / server

Advanced: sync using kubectl mechanisms; prefer Argo’s sync API for audit. Server-side apply options interact with field managers — learn before enabling fleet-wide.

### AppProject configuration surfaces

| Area | Controls |
|------|----------|
| `sourceRepos` / negations / globs | Which Git/OCI/Helm repos |
| `destinations` | Cluster + namespace pairs |
| `sourceNamespaces` | Where Application CRs may live (apps-any-ns) |
| `destinationServiceAccounts` | Impersonation SA mapping |
| Cluster/namespace resource allow/deny lists | What kinds may be synced |
| Roles + JWT / OIDC groups | Who can sync/get/create |
| Sync windows | When sync allowed |

### Common resource annotations (beyond hooks)

| Annotation | Use |
|------------|-----|
| `argocd.argoproj.io/sync-options` | Per-resource sync options |
| `argocd.argoproj.io/tracking-id` | Ownership (annotation tracking) |
| `argocd.argoproj.io/compare-options` | Per-resource compare tweaks |
| Ignore health / restart-policy related | Health edge cases ([02](./02_Core_Concepts_Applications_Sync_And_Health.md), [11](./11_Security_Tenancy_Hydrator_And_Troubleshooting.md)) |

---

## 3. Applications and use cases — configuration recipes

| Goal | Configuration |
|------|----------------|
| Lab website auto-deploy | automated prune+selfHeal, CreateNamespace ([12](./12_Worked_Example_Simple_Website_GitOps.md)) |
| Prod freeze Friday | Sync windows deny |
| CRD + CR in one sync | Waves: CRD wave -1, CR wave 0; or SkipDryRunOnMissingResource |
| HPA owns scale | omit replicas; ignoreDifferences; RespectIgnoreDifferences |
| Prevent two apps claiming one Deployment | FailOnSharedResource |
| Safer namespace prune | Prune=confirm on Namespace |

---

## References

- [Application specification](https://argo-cd.readthedocs.io/en/stable/user-guide/application-specification/)  
- [Sync options](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-options/)  
- [Sync waves](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/)  
- [Compare options](https://argo-cd.readthedocs.io/en/stable/user-guide/compare-options/)  
- [Selective sync](https://argo-cd.readthedocs.io/en/stable/user-guide/selective_sync/)  
- [Project specification](https://argo-cd.readthedocs.io/en/stable/operator-manual/project-specification/)  
