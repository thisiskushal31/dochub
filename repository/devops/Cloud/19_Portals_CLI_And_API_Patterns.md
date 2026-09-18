# 19 — Portals, CLI, and API patterns

[← Previous](./18_Compute_Instances_And_Autoscaling.md) · [README](./README.md) · [Next: FinOps →](./20_FinOps_And_Cost_Controls.md) · [IAM →](./15_Org_IAM_And_Identity_Federation.md)

---

## Mental map

```text
Portal  →  discover SKUs (not source of truth)
CLI     →  day-2 / incident (SSO)
API/SDK →  automation
IaC     →  lasting resources ([IAC/](../IAC/README.md))
```

*What to notice: UIs change; **objects and APIs** are what transfer across clouds.*

---

## 1. Concepts

Cloud day-2 surfaces share **objects**, not immortal UIs:

| Surface | Pattern |
|---------|---------|
| **Portal** | Click-ops; good for discovery, bad as only IaC |
| **CLI** | `aws` / `gcloud` / `az` / provider CLIs |
| **API / SDK** | Automation source of truth with IaC |
| **IaC** | Terraform/OpenTofu/Pulumi/… ([IAC](../IAC/README.md)) |

Named CLI install/hello → Tooling `Cloud-Platform/` / Commands as ENTRY—not duplicated here.

Colo portals are a different product ([Datacenter Provider-Use/6](../Datacenter/Provider-Use/6_Customer_Portal_Patterns.md)).

**Disconfirm:** Clicking prod together in a meeting is **not** change management. Long-lived access keys in a laptop profile are **not** SSO.

**Confirm:** How does your CLI authenticate? Where does a lasting VPC live (IaC vs portal)?

---

## 2. Advanced concepts

### Object-over-UI map

Learn Floor 1 jobs (IAM, VPC, LB, …) then find the object in each portal. Multi-cloud literacy is an **object map**, not a screenshot album ([1](./1_Shared_Cloud_Concepts.md)).

### Failure modes

| Failure | Impact |
|---------|--------|
| Click-only prod | Drift, no review |
| Long-lived CLI keys | Leak risk ([15](./15_Org_IAM_And_Identity_Federation.md)) |
| Mixing accounts in one shell profile | Wrong-account outages |
| Ignoring API eventual consistency | Flaky automation |
| Portal break-glass undocumented | Audit gaps ([30](./30_Cloud_Observability_And_Audit_Doors.md)) |

### How it connects

OIDC for CI [15](./15_Org_IAM_And_Identity_Federation.md). IaC modules own repeatability. Landing baselines [29](./29_Landing_Zones_And_Org_Guardrails.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Learn a SKU | Portal explore → CLI → IaC |
| Prod change | PR via IaC; portal break-glass only |
| Incident | CLI with MFA/SSO; log mutating calls |
| Multi-cloud | Object map, not UI map |

**Staff checklist**

- SSO-backed CLI  
- Default region/account explicit  
- IaC for lasting resources  
- Never paste access keys into chat  

**Good:** IaC + SSO CLI. **Bad:** click-ops estate; shared access keys.

---

## References

- [AWS CLI](https://docs.aws.amazon.com/cli/)  
- [gcloud CLI](https://cloud.google.com/sdk/gcloud)  
- [Azure CLI](https://learn.microsoft.com/cli/azure/)  
- [IAC/](../IAC/README.md)  
- Tooling Cloud-Platform / Commands (ENTRY)  
