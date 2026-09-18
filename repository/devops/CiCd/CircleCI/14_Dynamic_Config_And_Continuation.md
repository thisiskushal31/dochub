# 14 — Dynamic config and continuation

[← Previous](./13_OIDC_And_Cloud_Federation.md) · [README](./README.md) · [Next: Deployments →](./15_Deployments_Approvals_And_Markers.md)

## 1. Concepts

**Dynamic configuration** lets a pipeline generate or continue with additional config at runtime (path intelligence, generated matrices, conditional suites) instead of one enormous static YAML.

Typical pattern: a **setup** workflow decides what to run, then **continues** the pipeline with generated config. Exact enablement and continuation APIs are in current dynamic-config docs — treat generated config as still reviewable/auditable.

## 2. Advanced concepts

### When to use

| Fit | Why |
|-----|-----|
| Monorepo | Only build changed packages |
| Generated matrices | Version fan-out from code |
| Conditionally heavy suites | Nightly vs PR |

### Risks

Opaque generation hinders PR review. Prefer checked-in generators; log what continued. Keep secrets out of generated YAML.

### Related

Config templating / override guides and “using dynamic configuration” how-tos sit beside this feature — use the current recommended continuation path for your account.

## 3. Applications and use cases

| Estate | Pattern |
|--------|---------|
| 200-package monorepo | Dynamic path filters + continuation |
| Small repo | Static `config.yml` is enough |

**Good:** generator tested in CI itself. **Bad:** only one person understands the setup workflow.

## References

- [Dynamic config](https://circleci.com/docs/guides/orchestrate/dynamic-config/)  
- [Using dynamic configuration](https://circleci.com/docs/guides/orchestrate/using-dynamic-configuration/)  
