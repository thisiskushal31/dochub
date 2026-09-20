# 15 — Observability hooks and non-Azure targets

[← Previous](./14_Deploy_IaC_ARM_Bicep_Terraform_Ansible.md) · [README](./README.md) · [Next: Boards →](./16_Azure_Boards.md)

## 1. Concepts

Pipelines should **emit signals** and can deploy **beyond Azure**.

| Concern | Pipelines role |
|---------|----------------|
| Build/deploy notifications | Service hooks, Teams/Slack, email |
| Test / coverage results | Publish test results tasks |
| Azure Monitor / App Insights | Post-deploy checks; alert hooks (deep observability → [Monitoring-And-Observability/](../../Monitoring-And-Observability/README.md)) |
| Non-Azure clouds | Service connections / OIDC to AWS/GCP; generic SSH/K8s |
| GitOps handoff | Push image + open PR / commit digest; CD elsewhere |

## 2. Advanced concepts

### Language and mobile ecosystems

Pipelines ships first-party guidance for .NET, Java, JavaScript/Node, Python, Go, PHP, Ruby, **Android**, **Xcode/iOS**, containers, and Kubernetes. Same durable jobs (restore → test → package → deploy); tasks differ. This track does not duplicate each language cookbook — pick the ecosystem docs for task names, keep promotion rules from [CiCd/4](../4_Artifacts_And_Registries.md).

### Extra Azure targets

**Azure SQL** deployments and **Azure Stack** estates use the same connection → task → environment pattern ([25](./25_Platform_Management_Wiki_Analytics_Billing_Audit.md), [21](./21_Best_Practices_And_Delivery_Spectrum.md)).

### Checks that query health

Environment/resource checks can call HTTP endpoints, Azure Functions, Monitor, or Policy before continuing — progressive confidence without coupling to one APM vendor.

### Multi-cloud

Azure Pipelines is not Azure-only CI. Use appropriate service connections and tasks (or scripts). Keep digest promotion rules identical ([CiCd/4](../4_Artifacts_And_Registries.md)).

### On-prem and IIS classic

Still valid: deploy to non-Azure datacenters via self-hosted agents ([12](./12_Deploy_VMs_VMSS_And_Host_Patterns.md), [CiCd/20](../20_Classical_Jenkins_Host_And_Web_Deploy.md) for classical patterns).

### Assisted delivery

Assistants (including Azure DevOps MCP-style helpers) may draft YAML or queries; the **same gates** apply — PR review, environments, least privilege. No bypass of policy because a tool wrote the file.

## 3. Applications and use cases

| Scenario | Approach |
|----------|----------|
| Azure app + AWS DR | Two deploy stages; separate connections |
| Platform wants GitOps | Pipelines CI only; [Argo_CD/](../Argo_CD/README.md) for cluster |
| Nightly synthetic | Scheduled pipeline + results publish |

**Good:** deploy stage fails closed on failed smoke. **Bad:** green build while prod 5xx ignored.

## References

- [Service hooks](https://learn.microsoft.com/en-us/azure/devops/service-hooks/overview)  
- [Publish test results](https://learn.microsoft.com/en-us/azure/devops/pipelines/tasks/reference/publish-test-results-v2)  
- [Build ecosystems overview](https://learn.microsoft.com/en-us/azure/devops/pipelines/ecosystems/ecosystems)  
- [Observability handbook](../../Monitoring-And-Observability/README.md)  
