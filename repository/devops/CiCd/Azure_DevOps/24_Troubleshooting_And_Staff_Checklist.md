# 24 — Troubleshooting and staff checklist

[← Previous](./23_YAML_And_Task_Configuration_Catalog.md) · [README](./README.md) · [Next: Platform management →](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md)

## 1. Concepts — frequent failures

| Symptom | Likely cause | Where to look |
|---------|--------------|---------------|
| Pipeline never queues | Trigger/path filters; disabled pipeline | [07](./07_Triggers_Stages_Jobs_And_Strategies.md) |
| Waiting forever for agent | Pool empty; demands unmatched; parallelism | [05](./05_Agents_Hosted_And_Self_Hosted.md) |
| Auth errors to Azure | Service connection / federation / RBAC scope | [19](./19_Security_Permissions_And_Service_Connections.md) |
| Secret empty / not masked properly | Compile-time vs runtime variables | [06](./06_Variables_Secrets_And_Library.md) |
| Deploy succeeded, app wrong | Wrong slot; floating tag; config drift | [11](./11_Deploy_App_Service_Functions_And_Static_Web.md), [13](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md) |
| Classic release weirdness | UI definition drift | [09](./09_Environments_Approvals_Checks_And_Classic_Releases.md) |
| PR not blocked | Branch policy missing build validation | [17](./17_Azure_Repos_Git_And_TFVC.md) |

## 2. Advanced concepts — debug moves

- Re-run failed job with **system diagnostics** / verbose logs when needed.  
- Confirm **which commit** and **which artifact** deployed (build id, digest).  
- For Azure failures: check activity log + service connection identity role assignments.  
- Template compile errors: expand templates locally or use editor validation.  
- Server-only: verify version feature gates and agent compatibility.

## 3. Applications and use cases — staff checklist

- YAML pipelines in Git for new work; classic inventory owned if still present  
- Federated (or otherwise short-lived) Azure auth; no subscription Owner connection shared widely  
- Pipeline resources authorized; templates version-pinned for paved road  
- Environments for staging/prod with approvals on prod  
- Branch policies require CI on default branch  
- Artifacts promoted by digest/version; `latest` not the only prod pointer  
- Self-hosted agents patched and permission-scoped  
- Advanced Security (if licensed) enabled where secrets/deps matter; alerts triaged  
- Org structure documented (org vs project vs team); Entra groups mapped  
- Audit logging reviewed on a cadence; billing/parallelism owned  
- Wiki + dashboard for onboarding and build health ([25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md))  
- Spectrum row chosen deliberately (App Service vs VM vs AKS vs GitOps) — [21](./21_Best_Practices_And_Delivery_Spectrum.md)  
- Boards/Repos/Test Plans enabled only if the team actually uses them  
- Rollback path known (slot swap, previous revision, previous image digest, IaC revert)

## References

- [Troubleshoot Azure Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/troubleshooting/)  
- [Troubleshooting guides](https://learn.microsoft.com/en-us/azure/devops/user-guide/troubleshoot)  
- [Security overview](https://learn.microsoft.com/en-us/azure/devops/organizations/security/security-overview)  
