# 16 — VPC and network constructs

[← Previous](./15_Org_IAM_And_Identity_Federation.md) · [README](./README.md) · [Next: Private connectivity →](./17_Private_Connectivity_And_On_Ramps.md)

---

## 1. Concepts

Every major cloud has a **virtual network** object (VPC/VNet) with subnets, route tables, gateways, and security filters.

| Job | Typical constructs |
|-----|--------------------|
| Isolate | VPC/VNet + subnets (public/private) |
| Egress | NAT gateway / Cloud NAT |
| Ingress | LB / gateway / ingress controller |
| Filter | Security groups / firewall rules / NSGs |
| DNS | Cloud DNS / Route 53 / Private DNS |

Packet deep → Networks-Deep-Dive. This is **tenant construct literacy**.

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Everything public subnet | Attack surface |
| One huge flat CIDR | Collision on peerings |
| NAT cost ignored | Bill shock ([20](./20_FinOps_And_Cost_Controls.md)) |
| Overlapping CIDRs vs on-prem | Hybrid broken |

### How it connects

Private connectivity [17](./17_Private_Connectivity_And_On_Ramps.md). Colo dual-home thinking still applies to dual AZs—not identical to dual PDUs ([Datacenter Jobs/12](../Datacenter/Jobs/12_Hyperscale_Ops_Honesty.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Web app | Public LB → private compute |
| Data tier | Private subnets; no public IPs |
| Multi-account | Shared services + hub VPC patterns |
| K8s | Private nodes; careful API endpoint exposure |

**Staff checklist**

- CIDR plan written  
- Private by default  
- Egress cost visible  
- Never 0.0.0.0/0 on SSH/RDP to the world  

**Good:** planned CIDRs, private compute. **Bad:** flat public estate; CIDR collisions.

---

## References

- [AWS VPC](https://docs.aws.amazon.com/vpc/)  
- [GCP VPC](https://cloud.google.com/vpc/docs)  
- [Azure VNet](https://learn.microsoft.com/azure/virtual-network/)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
