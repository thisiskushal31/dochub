# 09 — Environments, approvals, checks, and classic releases

[← Previous](./08_Templates_Tasks_And_Extensions.md) · [README](./README.md) · [Next: Artifacts →](./10_Artifacts_Feeds_And_Packages.md)

## 1. Concepts

An **environment** is a named deployment target in Azure Pipelines (e.g. `staging`, `production`). **Deployment jobs** target environments so you get:

- Deployment history  
- **Approvals** and **checks** (gates) before/after deploy  
- Optional resource links (Kubernetes, VMs, …)

```yaml
jobs:
  - deployment: DeployWeb
    environment: production
    strategy:
      runOnce:
        deploy:
          steps:
            - script: echo deploy
```

Align with host-neutral promotion ideas in [CiCd/8](../8_Environments_Promotion_And_Approvals.md).

## 2. Advanced concepts

### Checks (YAML) and gates (classic)

**Checks** can be configured on **environments**, **service connections**, **variable groups**, **secure files**, **agent pools**, and **repositories**. A stage waits until every check on every resource it uses succeeds (approvals, branch control, business hours, exclusive locks, Azure Function / REST, Azure Monitor, Azure Policy, work-item queries, …).

Classic releases used **deployment gates** (pre/post) with similar signals — map them to environment/resource checks when migrating.

### Environments vs deployment groups

| | **Environments** (YAML) | **Deployment groups** (classic) |
|--|-------------------------|----------------------------------|
| Availability | Multi-stage YAML | Classic **release** pipelines only |
| Targets | Logical env; optional K8s / VM resources | Explicit machine agents tagged in a group |
| History / checks | First-class deployment history + checks | Per-machine logs; roles on the group |

Greenfield: environments. Brownfield classic VM fleets: deployment groups (or migrate VMs onto environment VM resources).

### Classic release pipelines (legacy)

Pattern: Build publishes artifacts → Release pipeline consumes them → Stages Dev → QA → Prod with pre/post deploy approvals/gates and optional deployment groups. Migration path:

1. Inventory stages, variables, gates, and deployment groups.  
2. Recreate as YAML stages + environments (+ VM/K8s resources as needed).  
3. Run dual-path until digests match.  
4. Freeze classic.

Do not delete classic mid-incident.

### Environment permissions

Who can deploy vs who can manage checks — separate from pipeline edit rights ([19](./19_Security_Permissions_And_Service_Connections.md)). Authorize which pipelines may use an environment.

## 3. Applications and use cases

| Need | Pattern |
|------|---------|
| Prod human gate | Environment approval on `production` |
| Automated health gate | Check that queries Azure Monitor / webhook / Policy |
| Classic VM estate | Deployment groups until YAML migration |
| Brownfield classic UI | Keep classic; document owners; plan YAML move |

**Good:** same artifact digest promoted across environments. **Bad:** rebuild for prod “to be safe.”

## References

- [Environments](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/environments)  
- [Approvals and checks](https://learn.microsoft.com/en-us/azure/devops/pipelines/process/approvals)  
- [Classic releases](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/)  
- [Deployment groups](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/deployment-groups/)  
- [Release gates](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/approvals/gates)  
