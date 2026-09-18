# 18 — Results and Pruner

[← Previous](./17_Chains_Supply_Chain_Security.md) · [README](./README.md) · [Next: Operator →](./19_Operator_Platform_Config.md)

## 1. Concepts

| Component | Role |
|-----------|------|
| **Tekton Results** | Long-term API/storage for Run metadata (and related records) beyond etcd CR lifespan |
| **Watcher** | Ships completed Run data into Results (literacy) |
| **Pruner** | Event/config-driven cleanup of old PipelineRuns/TaskRuns / related objects |

Without pruning, CRDs and logs fill the API server. Without Results (or another archive), history vanishes when CRs are deleted — bad for audit and debugging.

```bash
kubectl get pipelineruns -A
# Install Results + Pruner per current docs or Operator CRs (TektonResult / TektonPruner)
```

## 2. Advanced concepts

### Results API

REST/gRPC APIs for records; **summary/aggregation** endpoints support totals, success/fail counts, durations, group-by namespace/pipeline/repository/time — useful for platform dashboards ([results API docs](https://tekton.dev/docs/results/)).

### Storage and scale

| Topic | Literacy |
|-------|----------|
| External database | Postgres (and upgrade notes) |
| Horizontal scaling | Results components under load |
| Retention agent | Keep Results store bounded |
| Logging support | How logs relate to stored records |
| TLS / custom CA | Securing API access |

### Pruner policies

Match compliance: keep N days and/or N Runs per Pipeline; prune failed lab namespaces aggressively; never prune without knowing whether Results already archived.

### Order of operations

Design **archive-then-prune** (or accept loss). Pruner without Results is amnesia with a cleaner etcd.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Busy CI namespace | Pruner keep last 20–50 Runs |
| Audit / SRE | Results API + summary queries |
| Cost control | Aggressive prune of ephemeral labs |

**Staff checklist**

- Pruner enabled in every non-lab cluster  
- Results (or approved alternate archive) if audit needs history  
- Retention numbers written in the platform runbook  
- DB backups if Results uses external Postgres  

**Good:** retention policy documented. **Bad:** infinite Run history in etcd.

## References

- [Results](https://tekton.dev/docs/results/)  
- [Pruner](https://tekton.dev/docs/pruner/)  
