# 20 — FinOps and cost controls

[← Previous](./19_Portals_CLI_And_API_Patterns.md) · [README](./README.md) · [Next: VPS kin →](./21_Akamai_Linode_And_VPS_Kin.md) · [Landing zones →](./29_Landing_Zones_And_Org_Guardrails.md)

## Mental map

```text
Usage → bill → allocate (tags/accounts) → optimize → guard (budgets/quotas)
Quotas are ops walls: scale into a limit looks like an outage
```

*What to notice: FinOps is a **control loop**, not a monthly spreadsheet panic. Program depth: [Methodologies/8](../Methodologies/8_FinOps_Literacy.md).*

## 1. Concepts

Cloud bills are a **product surface**. This chapter is **tenant control levers**.

| Lever | Examples |
|-------|----------|
| Visibility | Billing export, cost explorer-class, labels/tags |
| Allocation | Showback/chargeback by tag/account/project |
| Commit | Savings Plans / CUDs / reserved (read current docs) |
| Waste | Idle disks, orphan IPs, oversize NAT, unattached volumes |
| Guardrails | Budgets, quotas, org policy ([29](./29_Landing_Zones_And_Org_Guardrails.md)) |

**Disconfirm:** Rightsizing VMs alone is **not** FinOps. A commit purchase without a usage baseline is **not** savings—it is a bet.

**Confirm:** Can you allocate last month’s bill by team? What happens when a quota is hit ([18](./18_Compute_Instances_And_Autoscaling.md))?

## 2. Advanced concepts

### Quotas as failures

Autoscaling, GPU training jobs, and LB target growth all die at **service quotas**. Treat quota headroom as capacity—same instinct as colo kW ([Datacenter Jobs/8](../Datacenter/Jobs/8_Capacity_Conversation.md)), different meter.

### Common silent burners

| Item | Why |
|------|-----|
| NAT gateways + egress | Easy to ignore ([16](./16_VPC_And_Network_Constructs.md)) |
| Idle load balancers / idle disks | Leftover from deploys ([23](./23_Load_Balancing_Ingress_And_TLS.md), [24](./24_Object_Block_And_File_Storage.md)) |
| Multi-AZ over-provision without need | Reliability tax unpaid by design |
| Verbose flow/debug logs forever | Observability cost ([30](./30_Cloud_Observability_And_Audit_Doors.md)) |

### Failure modes

| Failure | Impact |
|---------|--------|
| No tags | Unallocatable bill |
| NAT/egress surprise | Silent burn |
| Rightsizing as only strategy | Misses architecture waste |
| Commit without usage baseline | Bad lock-in |
| Quotas ignored | Launch-day “outage” |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New org | Tag policy day-0 + budgets ([29](./29_Landing_Zones_And_Org_Guardrails.md)) |
| Monthly | Top offenders review |
| Architecture | Prefer private + fewer NAT gateways when safe |
| Shared services | Clear allocation model |

**Staff checklist**

- Tags/labels enforced  
- Budgets alerting  
- Idle resource job  
- Quota review before scale events  
- Never buy commits blind  

**Good:** tagged, budgeted, reviewed. **Bad:** surprise invoice; unowned resources.

## References

- [Methodologies/8 FinOps](../Methodologies/8_FinOps_Literacy.md)  
- [AWS Billing / Cost Management](https://docs.aws.amazon.com/cost-management/)  
- [GCP Cloud Billing](https://cloud.google.com/billing/docs)  
- [Azure Cost Management](https://learn.microsoft.com/azure/cost-management-billing/)  
- [FinOps Foundation](https://www.finops.org/)  
