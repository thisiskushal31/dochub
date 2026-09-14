# 09 — Caches, workspaces, and artifacts

[← Previous](./08_Workflows_Requires_Filters_Matrix_And_Triggers.md) · [README](./README.md) · [Next: Orbs →](./10_Orbs_Use_And_Author_Literacy.md)

---

## 1. Concepts

| Mechanism | Job |
|-----------|-----|
| **Cache** | Speed restores across jobs/pipelines (`restore_cache` / `save_cache`) |
| **Workspace** | Pass files to **downstream jobs in the same workflow** |
| **Artifacts** | Persist outputs for humans / later download (`store_artifacts`) |
| **Test results** | `store_test_results` for UI insights |

Key caches on lockfiles (`checksum "package-lock.json"`). Workspaces are not a substitute for artifact registries for release bits ([CiCd/4](../4_Artifacts_And_Registries.md)).

---

## 2. Advanced concepts

Cache misses and corrupt caches cause mystery failures — know how to bust keys. Don’t cache secrets.

Large artifacts cost storage/transfer — prefer registries for releases; keep pipeline artifacts small.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Faster npm CI | cache on lockfile |
| Build → deploy same workflow | persist_to_workspace / attach_workspace |
| Share test report | store_test_results + artifacts |

**Good:** narrow cache paths. **Bad:** cache entire home directory.

---

## References

- [Caching dependencies](https://circleci.com/docs/guides/optimize/caching/)  
- [Persisting data (workspaces)](https://circleci.com/docs/guides/optimize/persist-data/)  
- [Storing artifacts](https://circleci.com/docs/guides/optimize/artifacts/)  
