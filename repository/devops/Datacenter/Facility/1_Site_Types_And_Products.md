# 1 — Site types and products

[README](./README.md) · [Next: Tiers →](./2_Tiers_Ratings_And_Concurrent_Maintainability.md)

---

## Mental map

![Site product types](../../Assets/Datacenter/Facility/site-product-types.svg)

*What to notice: halls are **products**—retail colo ≠ wholesale shell ≠ edge POP. Buy the motion you need (cross-connects vs MW shells), not a logo. Markets: [Markets/1](../Markets-And-Operators/1_Operator_Taxonomy.md).*

**Operator experience (verify locally):** The wrong product conversation wastes a quarter before anyone racks a server.

## 1. Concepts

Halls are sold as **products**, not just buildings.

| Type | Product shape |
|------|----------------|
| **Enterprise / owned** | Internal IT hall |
| **Colo retail** | Cabinets/cages + interconnect |
| **Wholesale** | Large shells / campuses |
| **Hyperscale campus** | Provider or wholesale for few tenants |
| **Edge / micro** | Small footprint near users |
| **Telco POP / cable landing** | Transport adjacency |
| **CDN / content** | Cache/POP footprint |

Operator kinds: [Markets/1](../Markets-And-Operators/1_Operator_Taxonomy.md).

---

## 2. Advanced concepts

### Failure modes

| Mistake | Impact |
|---------|--------|
| Buying retail expecting wholesale MW | Wrong motion |
| Edge site treated as Tier IV campus | Over-design / under-connect |
| Ignoring product (XC vs power-only) | Missed requirement |

### How it connects

Rooms [3](./3_Rooms_Campus_And_Adjacencies.md). Buy units [4](./4_Cage_Cabinet_Suite_And_Hands.md). Qualify [Provider-Use/1](../Provider-Use/1_Qualify_A_Site.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Interconnect app | Retail colo in hub metro |
| AI campus | Wholesale / density zone |
| Branch | Edge/micro with honest limits |
| Mixed | Taxonomy first, then site |

**Staff checklist**

- Site type named in design  
- Product match verified  
- Never confuse campus MW with cage SKU  

**Good:** type→product clarity. **Bad:** “DC” as one noun.

---

## References

- [Uptime Institute](https://uptimeinstitute.com/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Markets-And-Operators/](../Markets-And-Operators/README.md)  
- On-ramp [3](../3_Facility_Power_Cooling_And_Rooms.md)  
