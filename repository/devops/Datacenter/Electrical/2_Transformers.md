# 2 — Transformers

[← Previous](./1_Utility_Intake_And_Service_Entrance.md) · [README](./README.md) · [Next: Switchgear →](./3_MV_And_LV_Switchgear.md)

---

## 1. Concepts

A **transformer** steps voltage up or down and often provides galvanic isolation between primary and secondary. In a datacenter power path it is the bridge between utility/MV plant and the LV boards that feed UPS and IT distribution.

### Where it sits

| Role | Typical location |
|------|------------------|
| Utility padmount / vault XFMR | Outside / property line (often utility-owned) |
| Site MV→LV transformers | Electrical yard or electrical room |
| Isolation / UPS input XFMR | Near UPS modules |
| Step-down at row/floor PDU | Inside floor PDUs or RPPs ([10](./10_Floor_And_Row_PDUs.md)) |

### What you need to recognize

| Term | Meaning |
|------|---------|
| **Primary / secondary** | Input / output windings |
| **kVA rating** | Thermal capacity; overload is time-limited |
| **Δ / Y (delta / wye)** | Winding connection; affects grounding and harmonics |
| **Taps** | Fine voltage adjustment (±%) under load or no-load |
| **Dry-type vs oil-filled** | Indoor dry common in halls; oil needs fire/containment rules |
| **K-factor / harmonic-rated** | Built for non-linear IT loads |

IT loads are **switch-mode supplies**—they draw current in pulses. Undersized or wrong-type transformers run hot and can distort voltage for everyone on that secondary.

---

## 2. Advanced concepts

### Redundancy patterns

| Pattern | Ops meaning |
|---------|-------------|
| **N** | One XFMR feeds the board; failure = path loss |
| **N+1** | Spare unit or capacity for maintenance |
| **2N** | Separate transformers on A and B paths |

A “redundant transformer” that feeds a **shared** bus is not 2N for IT. Trace the secondary to the UPS and PDU.

### Failure modes

| Failure | Symptom | IT impact |
|---------|---------|-----------|
| Overtemperature / thermal trip | Alarm; eventual disconnect | Path loss; transfer if designed |
| Winding fault | Protection trip | Instant path loss |
| Tap wrong / under-voltage | UPS/input alarms; PSU stress | Intermittent resets, efficiency loss |
| Harmonic overheating | Hot XFMR, nuisance trips | Capacity derate or outage |
| Cooling fan failure (dry-type) | Temp rise | Same as overload risk |

### How it connects

```text
Utility / MV switchgear → transformer → LV switchgear / UPS input
```

Grounding of the secondary (solidly grounded wye, etc.) ties into [12](./12_Grounding_Bonding_And_Surge.md). Wrong grounding assumptions create touch hazards and nuisance trips—not “IT folklore.”

### Global variants

Same device job worldwide. Nameplates differ: **11 kV / 22 kV / 33 kV** primaries; secondaries **400 V**, **480 V**, **208 V**. Always read the one-line and the nameplate—do not assume US 480 V language in Frankfurt or Mumbai.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Dense GPU row | Confirm transformer and PDU kVA headroom vs simultaneous draw |
| Harmonics complaints | Check K-rating, UPS topology, and load mix ([16](./16_Power_Quality_And_Harmonics.md)) |
| Maintenance | Know which IT path rides on which XFMR before LOTO |
| New cage power | Ask secondary voltage and whether A/B have separate XFMRs |

**Staff checklist**

- Nameplate kVA vs measured load (not just breaker size)  
- Dry vs oil; fire/containment implications  
- Which UPS/PDU paths this secondary feeds  
- Temp/alarm points visible on EPMS ([15](./15_EPMS_BMS_And_Power_Monitoring.md))  
- Never “just bump the tap” without facilities procedure  

**Good:** separate A/B transformers with independent secondaries. **Bad:** one hot XFMR feeding both “redundant” UPS inputs.

---

## References

- [IEC](https://www.iec.ch/) (power transformer standards family)  
- [IEEE](https://www.ieee.org/) (transformer and harmonic guidance families)  
- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
