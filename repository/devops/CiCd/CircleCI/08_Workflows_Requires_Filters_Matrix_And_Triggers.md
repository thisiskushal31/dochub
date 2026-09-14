# 08 — Workflows, requires, filters, matrix, and triggers

[← Previous](./07_Self_Hosted_Runners.md) · [README](./README.md) · [Next: Caches →](./09_Caches_Workspaces_And_Artifacts.md)

---

## 1. Concepts

**Workflows** decide which jobs run and their dependencies.

```yaml
workflows:
  build-deploy:
    jobs:
      - test
      - build:
          requires:
            - test
      - deploy:
          requires:
            - build
          filters:
            branches:
              only: main
```

| Mechanism | Use |
|-----------|-----|
| **requires** | Job graph / ordering |
| **filters** | Branch/tag inclusion |
| **matrix** | Fan-out versions/parameters |
| **approval / hold** | Manual gate ([15](./15_Deployments_Approvals_And_Markers.md)) |
| **Schedule triggers** | Cron-like pipelines |
| **VCS / custom webhooks** | Push, PR, and custom events |

---

## 2. Advanced concepts

### Pipeline parameters

Pass parameters to select workflows or configure jobs — useful for “run nightly suite only” patterns.

### Serial execution / org controls

Docs cover controlling serial execution across an organization when deploys must not overlap.

### Automatic reruns

Configure careful reruns for infra flakes — don’t mask real test failures.

### Multiple config files

Advanced projects can use multiple configuration files / pipelines — keep ownership clear.

---

## 3. Applications and use cases

| Goal | Shape |
|------|-------|
| PR CI only | Filters on non-main + no deploy |
| Nightly | Schedule trigger |
| Version matrix | `matrix` jobs |
| Human promote | approval job |

**Good:** fail-fast test before expensive build. **Bad:** deploy job with no branch filter.

---

## References

- [Workflows](https://circleci.com/docs/guides/orchestrate/workflows/)  
- [Using branch filters](https://circleci.com/docs/guides/orchestrate/using-branch-filters/)  
- [Using matrix jobs](https://circleci.com/docs/guides/orchestrate/using-matrix-jobs/)  
- [Schedule triggers](https://circleci.com/docs/guides/orchestrate/schedule-triggers/)  
- [Pipelines](https://circleci.com/docs/guides/orchestrate/pipelines/)  
