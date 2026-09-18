# 19 — Portals, CLI, and API patterns

[← Previous](./18_Compute_Instances_And_Autoscaling.md) · [README](./README.md) · [Next: FinOps →](./20_FinOps_And_Cost_Controls.md)

---

## 1. Concepts

Cloud day-2 surfaces share **objects**, not immortal UIs:

| Surface | Pattern |
|---------|---------|
| **Portal** | Click-ops; good for discovery, bad as only IaC |
| **CLI** | `aws` / `gcloud` / `az` / provider CLIs |
| **API / SDK** | Automation source of truth with IaC |
| **IaC** | Terraform/etc. ([IAC](../IAC/README.md)) |

Named CLI install/hello → Tooling `Cloud-Platform/` / Commands as ENTRY—not duplicated here.

Colo portals are a different product ([Datacenter Provider-Use/6](../Datacenter/Provider-Use/6_Customer_Portal_Patterns.md)).

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Click-only prod | Drift, no review |
| Long-lived CLI keys | Leak risk |
| Mixing accounts in one shell profile | Wrong-account outages |
| Ignoring API eventual consistency | Flaky automation |

### How it connects

OIDC for CI [15](./15_Org_IAM_And_Identity_Federation.md). IaC modules own repeatability.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Learn a SKU | Portal explore → CLI → IaC |
| Prod change | PR via IaC; portal break-glass only |
| Incident | CLI with MFA/SSO; log every mutating call |
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
