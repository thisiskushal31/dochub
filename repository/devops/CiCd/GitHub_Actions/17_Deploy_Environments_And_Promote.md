# 17 — Deploy, environments, and promote-by-digest

[← Previous](./16_Security_Hardening_Permissions_And_Forks.md) · [README](./README.md) · [Next: Monitor →](./18_Monitor_Metrics_And_Billing_Literacy.md)

## 1. Concepts

Deployment in Actions is usually:

1. **Build** an immutable artifact (image/package).  
2. Record its **digest** (and ideally an **attestation**).  
3. **Gate** on an `environment:` (reviewers / protection rules).  
4. **Promote** that same digest to the next stage — do not rebuild “for prod.”

```yaml
jobs:
  promote:
    needs: build
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: ./promote.sh --digest "${{ needs.build.outputs.digest }}"
```

Cross-host promote ideas: [CiCd/8](../8_Environments_Promotion_And_Approvals.md), [CiCd/24](../24_Workflow_Automation_Beyond_PR_CI.md).

## 2. Advanced concepts

### Environment protection & history

| Capability | Role |
|------------|------|
| Required reviewers / wait timer | Human gate |
| Deployment branch policy | Only `main` / tags |
| Custom deployment protection rules | GitHub Apps as external gates (change tickets, scanners) |
| Deployment history | UI audit of who deployed what |

Concurrency groups on deploy workflows prevent stampedes.

### GitOps handoff

Many platforms stop at “write digest into a values file / OCI artifact and let Flux/Argo reconcile.” Actions should not be the long-term `kubectl apply` bot if GitOps is the source of truth ([Flux/](../Flux/README.md), [Argo_CD/](../Argo_CD/README.md)).

### Attestations in the promote policy

Generate provenance at build; verify before prod promote; optionally enforce with cluster admission. Cookbook pages (Azure App Service, ECS, GKE, …) stay **upstream** — same promote *job*, different deploy *API*.

### SemVer / RC lanes

Build on RC tags → promote digest to prod release channel — see [CiCd/12](../12_Release_Versioning_And_Changelogs.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Staging auto | `environment: staging` weak/no reviewers |
| Prod | reviewers + digest pin |
| Regulated | custom protection rule App + attestations |

**Good:** same bits in staging and prod. **Bad:** `docker build` again on the release tag and hope.

## References

- [Deploying with GitHub Actions](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments)  
- [Managing environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)  
- [Custom deployment protection rules](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/create-custom-protection-rules)  
- [Artifact attestations](https://docs.github.com/en/actions/concepts/security/artifact-attestations)  
