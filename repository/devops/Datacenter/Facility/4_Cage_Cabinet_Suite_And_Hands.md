# 4 — Cage, cabinet, suite, and hands

[← Previous](./3_Rooms_Campus_And_Adjacencies.md) · [README](./README.md) · [Next: Campus vs building →](./5_Campus_Vs_Single_Building.md)

## 1. Concepts

What you **buy** in retail colo:

| SKU | Meaning |
|-----|---------|
| **Cabinet / rack** | One footprint + kW |
| **Cage** | Locked multi-cabinet space |
| **Suite / private hall** | Larger exclusive space |
| **Remote / Smart Hands** | Scoped physical labor product |

Contract jobs: [Provider-Use/2](../Provider-Use/2_Contract_Capacity.md). Hands tickets: [Provider-Use/5](../Provider-Use/5_Remote_Hands_Tickets.md).

## 2. Advanced concepts

### Failure modes

| Mistake | Impact |
|---------|--------|
| Undersized kW in cabinet | Trip/throttle |
| Unlimited hands assumption | Cost / delay |
| Suite without MMR plan | Isolated power box |

### How it connects

White-Space density [White-Space/3](../White-Space/3_Power_Density_And_Floor_Loading.md). Equinix-class [Markets/4](../Markets-And-Operators/4_Equinix_Class_Interconnection.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Start small | Cabinets + A+B + hands package |
| Grow | Cage when badge/ops need boundary |
| AI | Density zone SKU not classic 5 kW cabinet |

**Staff checklist**

- kW/U/hands explicit  
- A+B landing  
- Never verbal-only upgrades  

**Good:** clear SKU + SLA. **Bad:** hope-powered cabinets.

## References

- Official colo product catalogs (Equinix/Digital Realty/etc.)  
- [Provider-Use/](../Provider-Use/README.md)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- On-ramp [2](../2_Ownership_Colo_And_Contracts.md)  
