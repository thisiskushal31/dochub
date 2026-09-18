# 16 — VPC and network constructs

[← Previous](./15_Org_IAM_And_Identity_Federation.md) · [README](./README.md) · [Next: Private connectivity →](./17_Private_Connectivity_And_On_Ramps.md) · [LB →](./23_Load_Balancing_Ingress_And_TLS.md)

## Mental map

```text
VPC / VNet / VCN
  ├─ subnets (public edge vs private compute)
  ├─ route tables → IGW / NAT / peering / on-ramp
  ├─ filters (SG / NSG / firewall rules)
  └─ private DNS
```

*What to notice: every cloud gives you a **virtual network object**. Scope quirks differ (GCP VPC can be global; AWS VPC is regional)—the jobs do not.*

## 1. Concepts

Every major cloud has a **virtual network** with subnets, route tables, gateways, and security filters.

| Job | Typical constructs |
|-----|--------------------|
| Isolate | VPC/VNet/VCN + subnets (public/private) |
| Egress | NAT gateway / Cloud NAT |
| Ingress | LB / gateway ([23](./23_Load_Balancing_Ingress_And_TLS.md)) |
| Filter | Security groups / firewall rules / NSGs |
| DNS in-network | Private zones / Resolver |
| Connect networks | Peering, shared VPC, hub-spoke |

Packet deep → [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive). This is **tenant construct literacy**.

**Disconfirm:** “Public subnet” does **not** mean every VM needs a public IP. Flat `10.0.0.0/8` for everything is **not** a plan.

**Confirm:** Which subnets are private? How does egress work? Who owns the CIDR plan?

## 2. Advanced concepts

### Cross-cloud quirks

| Topic | AWS | GCP | Azure | Others |
|-------|-----|-----|-------|--------|
| Network scope | VPC regional | VPC global; subnets regional | VNet regional | OCI VCN; Aliyun/Tencent/Huawei VPC |
| Filters | SG (+ optional NACL) | VPC firewall rules | NSG (+ ASG/Azure Firewall) | Provider firewall products |
| Shared net | Shared services / TGW patterns | Shared VPC | Hub-spoke + Virtual WAN | Similar hub patterns |

### CIDR and hub-spoke

Write non-overlapping CIDRs before peering or on-ramp ([17](./17_Private_Connectivity_And_On_Ramps.md)). Hub holds shared DNS/egress; spokes hold apps ([29](./29_Landing_Zones_And_Org_Guardrails.md)).

### Failure modes

| Failure | Impact |
|---------|--------|
| Everything public subnet | Attack surface |
| One huge flat CIDR | Collision on peerings / hybrid |
| NAT cost ignored | Bill shock ([20](./20_FinOps_And_Cost_Controls.md)) |
| Overlapping CIDRs vs on-prem | Hybrid broken |
| 0.0.0.0/0 SSH/RDP | Instant compromise path |

### How it connects

Private connectivity [17](./17_Private_Connectivity_And_On_Ramps.md). Colo dual-home thinking still applies to dual AZs—not identical to dual PDUs ([Datacenter Jobs/12](../Datacenter/Jobs/12_Hyperscale_Ops_Honesty.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Web app | Public LB → private compute ([23](./23_Load_Balancing_Ingress_And_TLS.md)) |
| Data tier | Private subnets; no public IPs |
| Multi-account | Shared services + hub VPC |
| K8s | Private nodes; careful API endpoint exposure |

**Staff checklist**

- CIDR plan written and conflict-checked  
- Private by default  
- Egress cost visible  
- Never 0.0.0.0/0 on SSH/RDP to the world  
- Filters allow LB→targets, not the internet→nodes  

**Good:** planned CIDRs, private compute. **Bad:** flat public estate; CIDR collisions.

## References

- [AWS VPC](https://docs.aws.amazon.com/vpc/)  
- [GCP VPC](https://cloud.google.com/vpc/docs)  
- [Azure VNet](https://learn.microsoft.com/azure/virtual-network/)  
- [OCI VCN](https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/overview.htm)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
