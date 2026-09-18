# 12 — Grounding, bonding, and surge

[← Previous](./11_Rack_PDU_A_And_B.md) · [README](./README.md) · [Next: EPO →](./13_EPO_And_Safety_Disconnects.md)

---

## 1. Concepts

**Grounding** and **bonding** create intentional low-impedance paths for fault current and keep exposed metal near the same potential. **Surge protective devices (SPDs)** clamp transient overvoltages from lightning and switching.

This is safety and uptime literacy—not optional “nice to have” for IT.

### Where it sits

| Element | Place |
|---------|--------|
| Grounding electrode system | Building earth / electrodes |
| Main bonding jumper / GECs | Service entrance |
| Equipment grounding conductors | With power circuits to racks |
| Rack bonding | Cabinets bonded to ground system |
| SPD stages | Service, board, and sometimes rack/UPS |

Signal reference and “clean ground” myths cause bad DIY. Follow the site design and local code—do not invent isolated ground trees for servers.

---

## 2. Advanced concepts

### Failure modes and symptoms

| Problem | What you see |
|---------|----------------|
| Open ground | Shock hazard; breakers may not clear faults |
| Ground loops / poor bonding | Noise, random NIC/storage errors (sometimes) |
| Missing rack bond | Floating chassis; ESD and fault risk |
| SPD end-of-life | No surge protection after events; indicators ignored |
| Neutral-ground reverse | Dangerous miswire—immediate facilities issue |

### How it connects to IT gear

PSUs, chassis, cable trays, and cable managers must be part of the bonding story. Carbon fiber / specialty racks still need a defined bond path. Cable shield practices belong with structured cabling ([White-Space](../White-Space/README.md)) but land on the same grounding system.

### Surge and sites

Lightning-prone and long utility feeder sites need SPD strategy at multiple stages. UPS helps some disturbances; it is not a substitute for SPD and bonding at the building.

### Global variants

IEC earthing systems (TN-S, TN-C-S, TT, IT) change *how* grounding is arranged. US NEC language differs. Learn the local system name on each site; do not force TN-S habits onto a TT site by folklore.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New rack install | Bond per site standard before energizing |
| Mystery shocks / tingles | Stop work; facilities measurement—not “IT ticket only” |
| After lightning event | Check SPD status flags; UPS logs |
| Audio/network noise chase | Measure bonding before blaming firmware |

**Staff checklist**

- Rack bond present and painted/labeled per standard  
- No lifted grounds on power strips  
- SPD indicator windows checked on rounds  
- Know earthing system type for the building  
- Never remove “extra” ground wires to “fix noise” without engineering  

**Good:** continuous bonding, staged SPD, documented earthing type. **Bad:** floating racks; spent SPDs; DIY isolated grounds.

---

## References

- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [IEC 60364](https://webstore.iec.ch/) (LV electrical installations family)  
- [IEEE](https://www.ieee.org/) (grounding and surge practice families)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
