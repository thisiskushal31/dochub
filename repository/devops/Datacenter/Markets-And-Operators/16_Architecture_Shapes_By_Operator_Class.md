# 16 — Architecture shapes by operator class

[← Previous](./15_Latin_America_And_Other_Hubs.md) · [README](./README.md)

---

## 1. Concepts

What each operator class **generally runs**—enough to orient, not enough to forge blueprints.

| Class | Typical shape |
|-------|----------------|
| **Interconnection colo** | Retail cages, dense MMR, customer ToR/BMC, hands product, XC catalog |
| **Wholesale landlord** | Large halls/campuses, tenant fit-out heavy, fewer walk-up ecosystems |
| **Regional colo** | Mix of colo + managed; variable MMR |
| **Telco DC** | Transport adjacency; sometimes on-net bias |
| **Bare-metal cloud** | Standardized server factories; portal rebuild; provider network |
| **Tenant cloud** | Regions/AZs; API; plant hidden |
| **Hyperscaler campus** | Unpublished internals; consume via region/AZ |
| **Enterprise** | Smaller scale; same physics jobs |
| **Edge** | Micro footprint; limited plant depth |

Device truth remains Electrical–Fabric. This is **product shape**.

---

## 2. Advanced concepts

### Honesty limits

| Topic | Limit |
|-------|-------|
| Hyperscale wiring | Published principles only—no invented diagrams |
| Portal UIs | Objects + official docs; UIs churn |
| Exact MW per campus | Dual-source; label market reporting |
| “Every building” | Impossible; living index instead |

### How it connects

Taxonomy [1](./1_Operator_Taxonomy.md). Integration diagrams later ([Integration](../Integration/README.md)). Provider-Use executes landlord jobs.

### Global variants

Shapes transfer; implementations differ by metro chapter.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Design review | Pick class shape before SKU shopping |
| Client workshop | Draw class table on whiteboard |
| Hybrid | Colo shape + cloud shape + on-ramp interface |
| Teaching | Pair with failure walks in plant tracks |

**Staff checklist**

- Class shape named in ADR/design  
- Secrets labeled secret  
- Jobs mapped to Provider-Use or Cloud  
- Index for logos  
- Never deliver fake floor plans as confidence  

**Good:** class-accurate expectations. **Bad:** one diagram for all operators; hyperscale fanfic.

---

## References

- [Uptime Institute](https://uptimeinstitute.com/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Equinix docs](https://docs.equinix.com/)  
- Cloud region docs (AWS/GCP/Azure)  
- Syllabus living operator index (Part E)  
