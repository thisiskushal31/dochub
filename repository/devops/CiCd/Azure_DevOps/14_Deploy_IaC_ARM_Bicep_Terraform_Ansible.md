# 14 — Deploy: IaC from Pipelines (ARM, Bicep, Terraform, Ansible)

[← Previous](./13_Deploy_Containers_ACR_Container_Apps_And_AKS.md) · [README](./README.md) · [Next: Observability & other →](./15_Observability_Hooks_And_Non_Azure_Targets.md)

## 1. Concepts

Pipelines often deploy **infrastructure** as well as applications. Common Azure-centric tools:

| Tool | Family | Depth home |
|------|--------|------------|
| **ARM templates** | Azure-native JSON IaC | [IAC/](../../IAC/README.md) |
| **Bicep** | ARM DSL | [IAC/](../../IAC/README.md) |
| **Terraform** | Multi-cloud declarative | [IAC/](../../IAC/README.md) |
| **Ansible** | Config management / push automation | [Automation/](../../Automation/README.md) |

This chapter is **how Azure Pipelines invokes them** — not a second Terraform book.

```text
PR → plan/validate
main → apply to non-prod
manual/approval environment → apply prod
```

## 2. Advanced concepts

### ARM / Bicep from Pipelines

Tasks / `az deployment group create` with service connection. Store templates in Git; parameter files per environment; never commit secrets — use Key Vault references.

### Terraform

- State in Azure Storage (backend) with locking  
- `terraform plan` on PR (publish plan artifact)  
- `apply` only on protected branches/environments  
- Service connection / federated identity for provider auth  

### Ansible

Self-hosted agents often required for SSH into private estates. Inventories and vault secrets need careful Library/Key Vault handling. Azure modules can provision or configure; prefer clear split: Terraform/Bicep for cloud resources, Ansible for guest config — or one tool, but don’t double-manage the same object.

### What about “Availability Sets” and Load Balancers?

Those resources belong in **IaC templates**, not ad-hoc portal clicks. Pipelines applies the template; architecture literacy stays in [Cloud/4](../../Cloud/4_Azure_Literacy.md).

## 3. Applications and use cases

| Goal | Pipeline shape |
|------|----------------|
| Greenfield Azure landing zone | Bicep/Terraform stages + approvals |
| Brownfield VM guest config | Ansible from self-hosted pool |
| App + infra in one product | Separate stages; infra before app; compatible versions |

**Good:** plan on PR; apply with approval. **Bad:** `apply` from developer laptops with personal cloud admin creds as the only path.

## References

- [Deploy ARM/Bicep with Azure Pipelines](https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/add-template-to-azure-pipelines)  
- [Terraform with Azure Pipelines](https://learn.microsoft.com/en-us/azure/developer/terraform/overview)  
- [IAC folder](../../IAC/README.md) · [Automation folder](../../Automation/README.md)  
