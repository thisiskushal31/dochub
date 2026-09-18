# 9 — Busway vs cable distribution

[← Previous](./8_Paralleling_And_Transfer_Sequences.md) · [README](./README.md) · [Next: Floor and row PDUs →](./10_Floor_And_Row_PDUs.md)

## 1. Concepts

After UPS (or LV boards), power must reach rows and racks. Two dominant physical methods:

| Method | What it is | Typical use |
|--------|------------|-------------|
| **Cable** | Conductors in tray/conduit to panels and whips | Flexible, brownfield, mixed density |
| **Busway / busbar** | Prefabricated sandwich bus with tap-off boxes | High density, modular adds, overhead |

Both can be done well or poorly. Neither magically creates A+B independence.

### Where it sits

```text
UPS / LV gear → (busway or cable) → floor/row PDU or RPP → whips → rack PDU
```

Overhead busway above hot/cold aisles is common in modern high-density halls; underfloor cable remains common in raised-floor sites.

## 2. Advanced concepts

### Tradeoffs

| Factor | Cable | Busway |
|--------|-------|--------|
| Add a tap | Pull new run / use spare | Tap-off box where bus allows |
| Heat / ampacity | Derate in trays | Designed sections; still derate rules |
| Flexibility | High | High within bus layout |
| Finger / arc risk at taps | At terminations | At tap boxes—procedure matters |
| Retrofit | Familiar | Needs planned bus routes |

### Failure modes

| Failure | Symptom | Impact |
|---------|---------|--------|
| Loose lug / tap | Heat, eventual open | Local row/rack loss |
| Bus joint failure | Section loss | Multiple racks |
| Cable insulation damage | Ground fault trip | Breaker opens path |
| Overloaded section | Nuisance trip / heat | Capacity cliff |
| Wrong tap phase rotation | Equipment won’t run or trips | Commissioning catch if lucky |

### How it connects

Tap-off boxes feed [10](./10_Floor_And_Row_PDUs.md) or directly to rack whips ([11](./11_Rack_PDU_A_And_B.md)). Labeling of bus sections must match the one-line and EPMS feeder IDs.

### High-density variants

Overhead busbar and 415 V / 48 V distribution show up with dense compute—see [14](./14_High_Density_48V_HVDC_And_Busbar.md). Physics job is the same: ampacity, independence, touch-safe procedures.

### Global variants

Conductor standards (AWG vs mm²), bus brands, and IP ratings differ. Read local ampacity tables; do not copy US tray fill rules into an IEC site by memory.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Add racks | Spare tap positions vs new cable pulls in lead time |
| Thermal event | IR scan joints and lugs on maintenance windows |
| A/B audit | Separate busways or trays—not two cables in one basket pretending |
| Move/add/change | Update labels and EPMS when taps change |

**Staff checklist**

- Know whether your row is busway or cable  
- A and B physically segregated  
- Tap-off torque/inspection culture exists  
- Spare capacity on the section before PO of GPUs  
- Never open tap boxes without LOTO  

**Good:** segregated A/B bus, IR program, labeled taps. **Bad:** shared tray for “A and B”; unlabeled tap-offs; maxed bus sold as spare.

## References

- [IEC](https://www.iec.ch/) (busbar trunking / cable standards families)  
- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [IEEE](https://www.ieee.org/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
