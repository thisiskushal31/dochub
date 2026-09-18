# 2 — ToR, EoR, and MoR

[← Previous](./1_Leaf_Spine_And_Classic_Three_Tier.md) · [README](./README.md) · [Next: OOB →](./3_OOB_Management_Network.md)

---

## 1. Concepts

Where the first switch sits relative to servers:

| Placement | Meaning |
|-----------|---------|
| **ToR** (top of rack) | Switch(es) in each rack; short DAC/patch |
| **EoR** (end of row) | Switches at row end; longer copper/fiber |
| **MoR** (middle of row) | Compromise placement |

### Where it sits

Cabinet U reserved for switches; dual ToR common for dual-home; power from A/B PDUs; uplinks via optics ([8](./8_Optics_And_Transceiver_Roles.md)).

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Single ToR | Whole rack soft SPOF if single-home |
| ToR both on PDU A | Power path kills net |
| Cable length exceeded for DAC | Flaps |
| No reserved U | Late fabric install horror |
| Shared ToR for OOB+prod without care | Blast radius |

### How it connects

Cabling: [White-Space/4](../White-Space/4_Structured_Cabling_Copper.md)–[6](../White-Space/6_Cable_Management_And_Pathways.md). Dual-home: [7](./7_Bonding_MLAG_And_Dual_Home.md).

### Global variants

ToR dominates dense modern halls; EoR remains in some enterprise copper plants. Pick per cable plant and density—not fashion alone.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Dense compute | Dual ToR per rack |
| Copper horizontal brownfield | EoR with certified runs |
| GPU rack | ToR + high-radix optics plan |
| Colo | Confirm who owns ToR (customer vs landlord rare) |

**Staff checklist**

- U reserved for switches  
- Dual ToR power A/B  
- Cable type matches distance  
- Label ToR A/B clearly  
- Never land both uplinks in one physical switch pretending HA  

**Good:** dual ToR, short known media, A/B power. **Bad:** one ToR; DAC over length; unlabeled A/B.

---

## References

- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
- Vendor ToR hardware guides  
- [Open Compute Project](https://www.opencompute.org/)  
