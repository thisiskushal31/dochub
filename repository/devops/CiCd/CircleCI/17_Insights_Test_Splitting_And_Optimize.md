# 17 — Insights, test splitting, and optimize

[← Previous](./16_Security_Permissions_SSO_And_Policies.md) · [README](./README.md) · [Next: Server & CLI →](./18_Server_CLI_API_And_Toolkit.md)

---

## 1. Concepts

| Surface | Job |
|---------|-----|
| **Insights** | Pipeline/workflow health and trends |
| **Insights tests** | Test-level flaky/slow signals |
| **Parallelism / test splitting** | Split one job’s tests across containers |
| **Concurrency** | Many jobs at once (plan limits) |
| **Docker layer caching** | Speed image builds when enabled |
| **Usage dashboard** | Credit/resource consumption literacy |

Parallelism ≠ concurrency ([01](./01_What_Is_CircleCI.md)).

---

## 2. Advanced concepts

CLI helpers exist to split tests. Store test results for UI. Optimize carefully — don’t disable failing tests to go green.

Credit usage and resource classes interact — right-size before buying more concurrency ([24](./24_Integrations_Migrate_Plans_And_Extras.md)).

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Slow suite | parallelism + split |
| Flaky hunt | Insights tests |
| Cost control | smaller resource_class; less DLC abuse |

**Good:** measure before scaling. **Bad:** max parallelism on a 10-second suite.

---

## References

- [Insights](https://circleci.com/docs/guides/insights/insights/)  
- [Insights tests](https://circleci.com/docs/guides/insights/insights-tests/)  
- [Parallelism](https://circleci.com/docs/guides/optimize/parallelism-faster-jobs/)  
- [Caching](https://circleci.com/docs/guides/optimize/caching/)  
- [Docker layer caching](https://circleci.com/docs/guides/optimize/docker-layer-caching/)  
