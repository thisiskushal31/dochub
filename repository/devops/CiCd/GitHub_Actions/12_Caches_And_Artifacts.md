# 12 — Caches and artifacts

[← Previous](./11_Actions_Marketplace_And_Pinning.md) · [README](./README.md) · [Next: Reusable →](./13_Reusable_Workflows_And_Composites.md)

---

## 1. Concepts

Two different handoff tools:

| Tool | Purpose | Lifetime mindset |
|------|---------|------------------|
| **Cache** | Speed up dependency downloads across runs | Best-effort; can miss/evict |
| **Artifact** | Store build outputs for humans or later jobs | Retention policy; downloadable |

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}

- uses: actions/upload-artifact@v4
  with:
    name: coverage
    path: coverage/
```

Caches are keyed; restore can be partial via `restore-keys`. Artifacts pass between jobs in a run or persist after completion.

---

## 2. Advanced concepts

### Cache correctness

| Rule | Why |
|------|-----|
| Include OS in key | Avoid cross-OS corruption |
| Hash lockfiles | Invalidate on dependency change |
| Don’t cache build outputs you need for audit | Use artifacts / registries |

Rate limits exist on cache upload/download/delete per repository per minute — see [limits](https://docs.github.com/en/actions/reference/limits). Storage per repo is plan-capped (commonly discussed as **10 GB** cache storage per repository — confirm live).

### Artifacts vs registry

CI artifacts are for workflow plumbing and humans. **Release truth** for deployables belongs in an artifact registry with digests ([17](./17_Deploy_Environments_And_Promote.md), [CiCd/4](../4_Artifacts_And_Registries.md)).

### Management

UI/API can list/delete caches and artifacts to reclaim storage. Retention settings matter for compliance and cost ([18](./18_Monitor_Metrics_And_Billing_Literacy.md)).

---

## 3. Applications and use cases

| Goal | Use |
|------|-----|
| Faster npm/Go/Maven | Cache |
| Share junit/coverage | Artifact |
| Image to prod | Registry + digest, not cache |

**Good:** cache dependencies only. **Bad:** caching secrets or treating cache as a reliable artifact store.

---

## References

- [Dependency caching](https://docs.github.com/en/actions/concepts/workflows-and-actions/dependency-caching)  
- [Workflow artifacts](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflow-artifacts)  
- [Managing caches](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manage-caches)  
- [Dependency caching reference](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching)  
