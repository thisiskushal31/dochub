# 07 — Self-hosted runners

[← Previous](./06_Managed_Executors_And_Resource_Classes.md) · [README](./README.md) · [Next: Workflows →](./08_Workflows_Requires_Filters_Matrix_And_Triggers.md)

---

## 1. Concepts

**Self-hosted runners** execute jobs on infrastructure you operate while CircleCI still orchestrates pipelines.

| Kind | Role |
|------|------|
| **Machine runner** | Agent on Linux/macOS/Windows/Docker hosts |
| **Container runner** | Runs jobs as containers in your Kubernetes (or similar) |

Target a runner from config with `machine: true` (or documented executor form) and a **resource_class** like `namespace/class-name` that you registered.

```yaml
jobs:
  on-prem:
    machine: true
    resource_class: my-namespace/my-runner
    steps:
      - run: echo "Hi from a runner"
```

---

## 2. Advanced concepts

### Lifecycle

Install machine runner 3.x per OS docs; configure auth token and API URL (Server installs point at your Server). Scale with autoscaling patterns / orchestrator docs.

### Container runner

Useful when you already run Kubernetes — compare feature matrix vs machine runner before choosing.

### Hygiene

Same as any CI agent: patch images, rotate tokens, isolate prod-capable runners, no standing cloud keys ([12](./12_Contexts_Env_Vars_And_Secrets.md), [13](./13_OIDC_And_Cloud_Federation.md)).

Legacy **launch agent** migrations to machine runner 3 are documented per OS — brownfield only.

---

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Reach private VPC services | Machine runner in VPC |
| K8s-native isolation | Container runner |
| Occasional special hardware | Dedicated resource class |

**Good:** separate resource classes for untrusted PR vs deploy. **Bad:** one shared runner with prod kubeconfig for all projects.

---

## References

- [Runner overview](https://circleci.com/docs/guides/execution-runner/runner-overview/)  
- [Runner concepts](https://circleci.com/docs/guides/execution-runner/runner-concepts/)  
- [Install machine runner 3 on Linux](https://circleci.com/docs/guides/execution-runner/install-machine-runner-3-on-linux/)  
- [Container runner](https://circleci.com/docs/guides/execution-runner/container-runner/)  
