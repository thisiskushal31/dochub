# 1 — Operator taxonomy

[README](./README.md) · [Next: How operators build →](./2_How_Operators_Build_And_Run_Halls.md)

## Mental map

![Site product types](../../Assets/Datacenter/Facility/site-product-types.svg)

*What to notice: taxonomy starts with **what they sell** (space/power/XC vs shell vs cloud), not with who has the biggest logo. Qualify: [Provider-Use/1](../Provider-Use/1_Qualify_A_Site.md).*

**Operator experience (verify locally):** Sales decks collapse kinds; your RFP should not.

## 1. Concepts

Not every “data center company” sells the same product. Classify the logo before comparing it to Equinix, AWS, or a local colo.

| Kind | What they sell | Who typically owns BMC / ToR |
|------|----------------|------------------------------|
| **Interconnection colo** | Space, power, cross-connects, ecosystems | You own iron; they own plant |
| **Wholesale / hyperscale landlord** | Shells, powered shells, campuses | Often large tenant designs IT |
| **Regional colo** | Colo ± managed services | Mix |
| **Telco / cable-landing DC** | Colo + transport adjacency | Mix |
| **Bare-metal cloud** | Rented servers; they rack | They own iron; you get OS/BMC portal |
| **VPS / public cloud IaaS** | VMs/API | Provider owns plant + hypervisor |
| **Hyperscaler campus** | Multi-tenant cloud behind region/AZ | Provider |
| **Enterprise / owned** | Internal IT | You |
| **Edge / micro / content** | Small footprints near users | Mix |

**Equinix** is interconnection colo (plus wholesale-class products)—not a VPS peer of Linode. Living logo list: syllabus Part E.

## 2. Advanced concepts

### Failure modes of bad classification

| Mistake | Consequence |
|---------|-------------|
| Treating Linode like Equinix | Wrong order path (API vs Smart Hands) |
| Treating wholesale like retail colo | Expecting MMR ecosystems that aren’t sold |
| Assuming one Tier sticker = same product | Miss interconnect vs power+space |
| Ignoring who owns ToR | Support tickets bounce forever |

### How it connects

Research method: [3](./3_Research_Any_Operator.md). Architecture shapes: [16](./16_Architecture_Shapes_By_Operator_Class.md). Durable use jobs: [Provider-Use](../Provider-Use/README.md). API tenant use: [Cloud](../../Cloud/README.md).

### Global variants

Same kinds worldwide; which kind dominates a metro differs (Ashburn interconnection vs some markets that are wholesale-heavy).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New logo in a RFP | Map to one row in the table first |
| Hybrid design | Colo interconnect + cloud regions as different products |
| Interview / client call | Speak kinds, then names |
| Index update | Add logo to syllabus with taxonomy tag |

**Staff checklist**

- Kind named before SKU envy  
- BMC/ToR ownership stated  
- Interconnect vs API path chosen  
- Don’t compare PUE of a VPS to Fabric ports  
- Never say Equinox  

**Good:** taxonomy-first, then metro research. **Bad:** logo salad; Linode≈Equinix; Tier as personality.

## References

- [Equinix](https://www.equinix.com/) (interconnection colo archetype)  
- [Digital Realty](https://www.digitalrealty.com/)  
- [Uptime Institute](https://uptimeinstitute.com/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- Syllabus living operator index (Part E)  
