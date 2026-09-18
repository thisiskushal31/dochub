# 1 — Utility to DIMM

[README](./README.md) · [Next: NIC to MMR →](./2_NIC_To_MMR.md)

---

## Mental map

![Whole hall layers](../../Assets/Datacenter/Integration/whole-hall-layers.svg)

![Power path street to chip](../../Assets/Datacenter/Electrical/power-path-street-to-chip.svg)

*What to notice: this walk is the **power spine** of the hall. Layers above (cooling, fabric) fail differently—practice [5](./5_Failure_Lose_PDU_A.md) and Mechanical/Electrical failure chapters together.*

**Operator experience (verify locally):** The best RCA board is a printed path with “shared board?” checkboxes—not a slide full of logos.

## 1. Concepts

End-to-end **power path** from the grid to the silicon:

```text
Utility intake → transformer → MV/LV switchgear → ATS/STS
  → UPS + batteries → (generators on outage)
  → busway/cable → floor/row PDU → rack PDU A/B
  → PSU → VRM → CPU/DIMM
```

Chapter homes: [Electrical](../Electrical/README.md) device encyclopedia; [Compute/14](../Compute/14_Thermal_And_Power_Of_The_Box.md) at the box.

---

## 2. Advanced concepts

### Independence checkpoints

| Claim | Verify |
|-------|--------|
| Dual utility | Paths stay split indoors |
| 2N UPS | Separate plants to A/B |
| Dual cord | PSU1≠PSU2 same PDU |
| Generator covers | IT **and** cooling plant |

### Failure modes (integration view)

A single shared board under “redundant” stickers collapses the walk. Practice with [5](./5_Failure_Lose_PDU_A.md) and [Electrical/17](../Electrical/17_Power_Path_Failure_Walks.md).

### Global variants

120/208/480 vs 230/400 V; 50/60 Hz—same walk, different nameplates ([10](./10_Units_Voltage_Frequency_Literacy.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Design review | Trace one server’s A and B to utility on the one-line |
| Incident | Start at EPMS trip, walk toward DIMM |
| Onboarding | Draw the path for your cage |
| Colo | Landlord plant + your PDU landing boundary |

**Staff checklist**

- One-line available  
- A/B traced for a sample rack  
- Cooling on generator known  
- Never stop the walk at “dual cord”  

**Good:** full path literacy. **Bad:** PDU-only thinking.

---

## References

- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [Electrical/](../Electrical/README.md)  
- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
