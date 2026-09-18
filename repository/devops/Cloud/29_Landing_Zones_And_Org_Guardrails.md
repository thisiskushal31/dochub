# 29 — Landing zones and org guardrails

[← README](./README.md) · [IAM →](./15_Org_IAM_And_Identity_Federation.md) · [VPC →](./16_VPC_And_Network_Constructs.md) · [FinOps →](./20_FinOps_And_Cost_Controls.md)

## Mental map

```text
Org root
  ├─ platform / shared services (IAM, network hub, logs, registry)
  ├─ prod app accounts/projects
  ├─ nonprod …
  └─ Sandbox (strong fences)
Guardrails: SCPs / org policies / Azure Policy — outer fence
```

*What to notice: a landing zone is a **repeatable baseline**, not a one-time console tour.*

## 1. Concepts

A **landing zone** is how you create many isolation units with the same:

- Identity patterns (SSO, roles, federation)  
- Network patterns (hub-spoke, DNS, egress)  
- Logging/audit baseline  
- Guardrails (what even admins cannot disable)  

| Role | Typical ownership |
|------|-------------------|
| **Platform account** | Shared VPC hub, centralized logs, registry, CI roles |
| **App account** | Workloads only; consume shared services |
| **Sandbox** | Experiment; hard spend and network fences |

**Disconfirm:** One fat account with folders named `prod` is **not** a landing zone. Buying Control Tower / Fabric without owning policies is **not** governance.

**Confirm:** What can an app admin *not* do? Where do audit logs land? How is a new env requested?

Vendor accelerators (Control Tower, Azure landing zones, Fabric) are **examples**—encode the jobs, don’t worship the brand.

## 2. Advanced concepts

### Guardrail catalog (durable)

| Guardrail | Intent |
|-----------|--------|
| Deny leave org / deny disable audit | Integrity |
| Region allow-list | Residency / risk |
| Require encryption / CMK tags | Data |
| Deny public object ACLs / public IPs on compute | Exposure |
| Budget / quota envelopes | FinOps ([20](./20_FinOps_And_Cost_Controls.md)) |

### Network baseline

Hub VPC / shared services + spokes ([16](./16_VPC_And_Network_Constructs.md)); private connectivity ([17](./17_Private_Connectivity_And_On_Ramps.md)). CIDR plan written before the 40th project.

### Failure modes

| Failure | Impact |
|---------|--------|
| No org fence | Shadow regions, disabled trails |
| Every team builds own hub | Peering spaghetti |
| Sandbox without spend cap | Bill shock |
| Break-glass = daily Admin | Landing zone fiction |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New product team | Issue account/project from pipeline; attach baseline |
| Regulated prod | Separate blast unit + CMK + private only |
| Hybrid | Landing zone accounts peer/on-ramp to colo ([22](./22_Hybrid_Colo_And_Cloud.md)) |

**Staff checklist**

- Isolation unit strategy written  
- Platform vs app ownership clear  
- Org policies/SCPs/Azure Policy enforced  
- Central audit destination ([30](./30_Cloud_Observability_And_Audit_Doors.md))  
- New-env path is a ticket/pipeline, not tribal knowledge  

**Good:** baseline as code + fences. **Bad:** snowflake accounts; trails off “to save money.”

## References

- [AWS Control Tower / Organizations](https://docs.aws.amazon.com/controltower/) · [GCP Resource Manager / org policy](https://cloud.google.com/resource-manager/docs) · [Azure landing zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/)  
- [15 IAM](./15_Org_IAM_And_Identity_Federation.md)  
