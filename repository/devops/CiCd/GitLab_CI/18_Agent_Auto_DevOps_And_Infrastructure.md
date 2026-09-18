# 18 — Agent, Auto DevOps, and infrastructure

[← Previous](./17_Security_Scanning_And_Compliance_Literacy.md) · [README](./README.md) · [Next: Duo →](./19_Duo_And_AI_Literacy.md)

## 1. Concepts

| Offering | Plain meaning |
|----------|----------------|
| **GitLab Agent for Kubernetes (`agentk`)** | GitLab↔cluster connection for deploy/ops workflows |
| **Auto DevOps** | Opinionated default pipeline (build/test/deploy) — great for starts, often replaced by explicit YAML |
| **Infrastructure as Code features** | Terraform/OpenTofu integration, IaC scanning adjacent |
| **Workspaces** | Remote dev environments literacy |

CI still builds artifacts; Agent/GitOps often **apply** them. Compare [Flux/](../Flux/README.md) / [Argo_CD/](../Argo_CD/README.md) when cluster sync is the system of record.

## 2. Advanced concepts

### Agent vs kubectl-from-CI

| Pattern | Trade-off |
|---------|-----------|
| CI calls cloud API / kubectl | Simple; credentials in CI |
| Agent + GitOps | Clearer desired state; GitLab as control plane companion |

### Auto DevOps

Enable to learn; pin/replace with components when you outgrow defaults.

### Clusters UI (legacy/evolving)

Historically certificate-based cluster integration; Agent is the modern direction — confirm current docs for your version.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Deploy to GKE/EKS/… | OIDC build + Agent or GitOps reconcile |
| New team greenfield | Auto DevOps briefly, then explicit CI |
| Platform | Agent installs as a product with owners |

**Good:** CI builds digests; cluster pulls desired state. **Bad:** unbounded `kubectl apply` from every MR pipeline.

## References

- [Manage your infrastructure](https://docs.gitlab.com/user/infrastructure/)  
- [GitLab Agent for Kubernetes](https://docs.gitlab.com/user/clusters/agent/)  
- [Auto DevOps](https://docs.gitlab.com/topics/autodevops/)  
