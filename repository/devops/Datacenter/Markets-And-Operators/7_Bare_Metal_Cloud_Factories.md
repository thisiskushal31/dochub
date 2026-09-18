# 7 — Bare-metal cloud factories

[← Previous](./6_Regional_Colo_And_Telco_DCs.md) · [README](./README.md) · [Next: Tenant cloud vs landlord →](./8_Tenant_Cloud_Vs_Landlord.md)

---

## 1. Concepts

**Bare-metal cloud** operators (OVHcloud, Hetzner, Leaseweb-class, and kin) sell **servers you rent**; they own the iron and usually the hall plant. You get OS/BMC-ish access via their portal/API—not a colo cage key.

This is not Equinix Smart Hands, and not a multi-tenant hypervisor VPS (though some firms sell both).

### Hall implications

| Topic | Typical shape |
|-------|----------------|
| Cooling | Often innovative (e.g. water-cooling factories—OVH narrative) |
| Density | High, standardized SKUs |
| Customization | Less than colo; more than VPS |
| Interconnect | Their network product, not your MMR XC shopping |

Intake job: [Provider-Use/8](../Provider-Use/8_Dedicated_Metal_Intake.md). API/SKU depth → Cloud later.

---

## 2. Advanced concepts

### Failure modes / confusion

| Mistake | Reality |
|---------|---------|
| Ordering “colo habits” | No personal ToR usually |
| Expecting arbitrary hardware | SKU catalog wins |
| Ignoring region codes | YNM/Mumbai etc. are first-class |
| Mixing with VPS support model | Different SLAs |

### How it connects

Taxonomy: [1](./1_Operator_Taxonomy.md). Physics still Electrical–Compute. India OVH note: [14](./14_India_Market.md).

### Global variants

EU strength (Hetzner/OVH home markets) vs expanding regions—check current region maps officially.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Fast dedicated servers | Bare-metal cloud SKU |
| Full hardware control in cage | Colo instead |
| Hybrid | Colo interconnect + bare-metal elsewhere as needed |
| Ops | Portal rebuild/rescue; limited remote hands |

**Staff checklist**

- Kind = bare-metal cloud  
- Region/SKU documented  
- Rescue/BMC path known  
- Network product understood  
- Don’t file Equinix-style XC tickets on Hetzner  

**Good:** SKU-first, region-clear, portal fluency. **Bad:** colo expectations; ignoring factory cooling constraints on custom cards.

---

## References

- [OVHcloud docs](https://docs.ovh.com/)  
- [Hetzner docs](https://docs.hetzner.com/)  
- [Leaseweb](https://www.leaseweb.com/)  
- [Cloud/](../../Cloud/README.md) (tenant API literacy home)  
