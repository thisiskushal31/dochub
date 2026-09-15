# 20 — Best practices and when not Unleash

[← Previous](./19_Worked_Example_Gradual_Rollout_In_CI_CD.md) · [README](./README.md) · [Next: Coverage map →](./21_Feature_And_Offering_Coverage_Map.md)

---

## 1. Concepts

Flags are leverage. Without hygiene they become a second tangled codebase.

### Practices that scale

| Practice | Why |
|----------|-----|
| Named owner + expiry | Stops immortal flags |
| Default safe | Fail closed for risky features |
| Backend enforcement | Frontend flags ≠ authz |
| Few overlapping flags | Combinatorial test explosion |
| Remove after 100% | Delete code paths and flag |
| Governance on prod | Change requests / Terraform rules |

Official “best practices” and “flags at scale” guides encode the same ideas — make them team policy, not bookmarks.

---

## 2. Advanced concepts

### When **not** to use Unleash (or flags)

| Situation | Prefer |
|-----------|--------|
| Binary/crash risk of new image | Progressive delivery controller / canary |
| Secret distribution | Secret manager |
| One-off config for ops only | App config / SCM — not a permanent flag |
| Incomplete DB migration alone | Expand/contract migration ([7](../7_DB_Migrations_In_Pipelines.md)) |
| Tiny script, no runtime control need | Ship normally |

### When Unleash is the wrong product

- You only need a boolean in one process with no UI/audit — a local config may suffice  
- Enterprise governance required but you only run OSS without process substitutes  
- You expected Unleash to shift mesh traffic — that is Rollouts/Flagger  

### Flag debt

Track stale flags via applications, tech-debt views, and scheduled cleanup. Debt is a delivery risk equal to flaky tests.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Healthy estate | Quarterly flag audit |
| Regulated | CR + SSO mandatory |
| Startup | Fewer flags, ruthless sunset |

**Staff checklist**

- Sunset SLA defined (e.g. 14 days after 100%)  
- Kill switches labeled and tested  
- “No secrets in flags” in review rubric  

**Good:** short-lived release flags. **Bad:** `use_new_system` forever with both code paths rotting.

---

## References

- [Feature flag best practices](https://docs.getunleash.io/guides/feature-flag-best-practices)  
- [Flags at scale](https://docs.getunleash.io/guides/best-practices-using-feature-flags-at-scale)  
- [Technical debt](https://docs.getunleash.io/concepts/technical-debt)  
- [Manage flags in code](https://docs.getunleash.io/guides/manage-feature-flags-in-code)  
