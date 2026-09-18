# 8 — Optics and transceiver roles

[← Previous](./7_Bonding_MLAG_And_Dual_Home.md) · [README](./README.md) · [Next: Load balancers →](./9_Load_Balancer_Appliances.md)

## 1. Concepts

Fabric optics are operational inventory: **right form factor, right reach, right coding, clean faces, spared**. Device-level DAC/AOC/transceiver literacy: [Accelerators/6](../Accelerators/6_Optics_DAC_AOC_Transceivers.md). Structured fiber: [White-Space/5](../White-Space/5_Structured_Cabling_Fiber_MPO_MTP.md).

### Roles in the hall

| Link class | Typical media |
|------------|---------------|
| NIC↔ToR short | DAC |
| Leaf↔spine | AOC or SR/DR optics + MMF/SMF |
| Border/long | LR/ER SMF |
| Breakout | 400G→4×100G etc. |

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Dirty MPO | Flaps at scale |
| Unapproved coded optic | Won’t enable |
| Spares wrong reach | Night failure |
| DOM ignored | Surprise death |
| Mix SM/MM | Dark |

### How it connects

Sparing kits per speed tier; CMDB of optic SKUs; clean/inspect before RMA. GPU clusters burn optics inventory ([Accelerators/10](../Accelerators/10_Accelerator_Failure_And_Spares.md)).

### Global variants

Same form factors; vendor allowlists differ. Keep site-approved BOM.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New leaf pair | Pre-stage optics + spares |
| Flap | Clean → DOM → replace |
| Breakout design | Document polarity/mapping |
| Audit | Random DOM sample |

**Staff checklist**

- Approved SKU list  
- Spares on site per critical link class  
- Clean before mate  
- Label trunks  
- Never “any QSFP” from a drawer  

**Good:** allowlisted optics, DOM alerts, labeled plant. **Bad:** dusty random optics; zero spares; unknown breakout maps.

## References

- [TIA](https://tiaonline.org/)  
- [IEC](https://www.iec.ch/)  
- Switch vendor transceiver matrices  
- [Accelerators/6](../Accelerators/6_Optics_DAC_AOC_Transceivers.md)  
