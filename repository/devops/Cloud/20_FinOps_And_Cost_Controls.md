# 20 — FinOps and cost controls

[← Previous](./19_Portals_CLI_And_API_Patterns.md) · [README](./README.md) · [Next: VPS kin →](./21_Akamai_Linode_And_VPS_Kin.md)

---

## 1. Concepts

Cloud bills are a **product surface**. FinOps literacy: visibility, allocation, optimization, governance—not spreadsheet heroics alone.

Program depth: [Methodologies/8](../Methodologies/8_FinOps_Literacy.md). This chapter is **tenant control levers**.

| Lever | Examples |
|-------|----------|
| Visibility | Billing export, cost explorer-class, labels/tags |
| Allocation | Showback/chargeback by tag/account |
| Commit | Savings Plans / CUDs / reserved (read current docs) |
| Waste | Idle disks, orphan IPs, oversize NAT |
| Guardrails | Budgets, quotas, org policy |

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| No tags | Unallocatable bill |
| NAT/egress surprise | Silent burn |
| Rightsizing as only strategy | Misses architecture waste |
| Commit without usage baseline | Bad lock-in |

### How it connects

Network constructs [16](./16_VPC_And_Network_Constructs.md). GPU quotas/cost in [18](./18_Compute_Instances_And_Autoscaling.md). Colo kW is a different capacity conversation ([Datacenter Jobs/8](../Datacenter/Jobs/8_Capacity_Conversation.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New org | Tag policy day-0 + budgets |
| Monthly | Top offenders review |
| Architecture | Prefer private + fewer NAT gateways when safe |
| Shared services | Clear allocation model |

**Staff checklist**

- Tags/labels enforced  
- Budgets alerting  
- Idle resource job  
- Never buy commits blind  

**Good:** tagged, budgeted, reviewed. **Bad:** surprise invoice; unowned resources.

---

## References

- [Methodologies/8 FinOps](../Methodologies/8_FinOps_Literacy.md)  
- [AWS Billing / Cost Management](https://docs.aws.amazon.com/cost-management/)  
- [GCP Cloud Billing](https://cloud.google.com/billing/docs)  
- [Azure Cost Management](https://learn.microsoft.com/azure/cost-management-billing/)  
- [FinOps Foundation](https://www.finops.org/)  
