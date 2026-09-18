# 21 — Akamai Linode and VPS kin

[← Previous](./20_FinOps_And_Cost_Controls.md) · [README](./README.md) · [Next: Hybrid →](./22_Hybrid_Colo_And_Cloud.md) · [Full catalog](./Catalogs/Akamai_Linode_Products.md)

---

## 1. Concepts

**Akamai Linode**, DigitalOcean, Vultr, and similar brands are **tenant API / VPS clouds**—not interconnection colo peers of Equinix.

| You get | You typically do not get |
|---------|--------------------------|
| VMs, objects, K8s SKUs, APIs | Cage keys / Smart Hands as primary |
| Regions/PoPs | Customer-owned BMC in a colo sense |
| Simple portal/CLI | MMR cross-connect shopping |

Classify first: [Datacenter Markets/8](../Datacenter/Markets-And-Operators/8_Tenant_Cloud_Vs_Landlord.md).

---

## 2. Advanced concepts

### Failure modes

| Mistake | Impact |
|---------|--------|
| Designing Equinix ops on Linode | Wrong tickets |
| Assuming PoP = AZ math | DR fiction |
| Ignoring egress/network product | Bill + architecture surprise |

### How it connects

Shared IAM/VPC/LB/storage patterns still apply at smaller scale ([15](./15_Org_IAM_And_Identity_Federation.md)–[16](./16_VPC_And_Network_Constructs.md), [23](./23_Load_Balancing_Ingress_And_TLS.md)–[28](./28_Deployment_Shapes_On_Cloud.md)). Plant hosting them is Datacenter physics—you don’t operate it.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Simple app / lab | VPS kin |
| Interconnect ecosystem | Equinix-class colo instead |
| Hybrid | VPS + colo only with eyes open |
| Teach juniors | Taxonomy table first |

**Staff checklist**

- Kind = tenant cloud  
- Region list current from official docs  
- Backups/snapshots distinct  
- Don’t file LOA/XC on Linode  

**Good:** right product for the job. **Bad:** Linode≈Equinix; PoP folklore as AZ.

---

## References

- **Choose surface:** [Linode / VPS kin catalog (what / when / why not)](./Catalogs/Akamai_Linode_Products.md)  
- [Akamai Linode docs](https://www.linode.com/docs/) *(API depth after you chose)*  
- [DigitalOcean docs](https://docs.digitalocean.com/)  
- [Vultr docs](https://docs.vultr.com/)  
- [Datacenter Markets/8](../Datacenter/Markets-And-Operators/8_Tenant_Cloud_Vs_Landlord.md)  
