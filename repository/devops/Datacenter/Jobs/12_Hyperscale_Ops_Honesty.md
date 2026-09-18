# 12 — Hyperscale ops honesty

[← Previous](./11_Reading_Foreign_Site_Docs.md) · [README](./README.md)

## 1. Concepts

Hyperscale / large cloud DC ops use the **same physics vocabulary** (power, cool, fabric, failure domains) with **different tooling, automation, and secrecy**.

| You can know | You often cannot know |
|--------------|----------------------|
| Region / AZ mental model | Exact floor plans |
| Published principles (e.g. redundancy ideas) | Internal bus/SKU maps |
| Your tenant on-ramps | Their full plant one-lines |
| Shared incident *classes* | Their internal dashboards |

Markets: [Markets/8](../Markets-And-Operators/8_Tenant_Cloud_Vs_Landlord.md), [Markets/16](../Markets-And-Operators/16_Architecture_Shapes_By_Operator_Class.md).

## 2. Advanced concepts

### Failure modes of dishonesty

| Failure | Impact |
|---------|--------|
| Invented campus diagrams | False confidence; integrity hit |
| Assuming colo Smart Hands inside AWS | Wrong product |
| Ignoring region/AZ as failure domains | Bad DR |
| Copying hyperscale secrecy as excuse to skip docs in enterprise | Opposite lesson |

### What transfers

Integration walks, taxonomy, capacity conversation, safety culture, dual-path thinking—even when the UI is internal.

### Global variants

Every hyperscaler differs; honesty rule is universal: **no fanfic floor plans**.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Cloud ops interview | Speak domains + limits of knowledge |
| Hybrid architect | Colo detail + cloud region abstraction |
| Teaching | Explicit “unknown” boxes on diagrams |
| Enterprise vs hyperscale move | Expect tooling shock; reuse vocabulary |

**Staff checklist**

- Label secrets as secrets  
- Use official region docs  
- Apply dual-path thinking to AZs carefully (not 1:1 with PDUs)  
- Never draw fake UPS rooms for AWS  

**Good:** portable vocabulary + humility. **Bad:** invented internals; colo metaphors forced onto API clouds.

## References

- Cloud region/AZ documentation (AWS/GCP/Azure official)  
- [Markets-And-Operators/8](../Markets-And-Operators/8_Tenant_Cloud_Vs_Landlord.md)  
- [Uptime Institute](https://uptimeinstitute.com/) (industry topology language—not hyperscale blueprints)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
