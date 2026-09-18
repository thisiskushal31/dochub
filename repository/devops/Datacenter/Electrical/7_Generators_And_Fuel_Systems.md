# 7 — Generators and fuel systems

[← Previous](./6_Batteries_And_Energy_Storage.md) · [README](./README.md) · [Next: Paralleling →](./8_Paralleling_And_Transfer_Sequences.md)

---

## 1. Concepts

**Generators** (gensets) replace utility power for sustained outages. UPS covers seconds-to-minutes; generators cover hours-to-days—*if* fuel, start systems, and transfer logic work.

### Where it sits

| Element | Place |
|---------|--------|
| Engine-generator set | Yard, roof, or dedicated generator hall |
| Day tank | Near genset |
| Bulk fuel storage | Yard tanks / bunkered fuel |
| Exhaust / radiator / cooling | Outdoor airflow path |
| Paralleling / transfer gear | Electrical room ([8](./8_Paralleling_And_Transfer_Sequences.md)) |

### Ratings literacy

| Term | Meaning |
|------|---------|
| **Standby / prime / continuous** | Duty rating—standby ≠ infinite baseload |
| **kW / kVA** | Real vs apparent; IT + mechanical load matter |
| **Auto-start** | Contactor/ATS on utility loss |
| **Load bank** | Artificial load for testing without IT risk |

Fuel is usually **diesel** for large halls; natural gas and other fuels appear by region and emissions rules. Same job: energy on site when the grid is gone.

---

## 2. Advanced concepts

### Fuel systems

| Piece | Failure if neglected |
|-------|----------------------|
| Bulk tank water/contamination | Filter clog, no start or limp power |
| Day tank transfer pumps | Genset starves mid-event |
| Polishing / filtration | Long-stored diesel goes bad |
| Fuel contracts / delivery SLA | Multi-day outage without refill |
| Spill containment | Environmental and shutdown risk |

### Failure modes

| Failure | Symptom | IT impact |
|---------|---------|-----------|
| Fail to crank / start | UPS drains | Outage after autonomy |
| Start but fail to take load | ATS doesn’t see good source | Same |
| Overload / under-frequency | Unstable bus | IT resets, UPS cycling |
| Radiator / cooling failure | Thermal shutdown | Mid-event loss |
| Exhaust / emissions trip | Forced stop (jurisdiction) | Same |
| Control battery dead | No crank | Silent until event |

### How it connects

```text
Utility loss → UPS on battery → genset start → ATS/paralleling → UPS on generator
Fuel bulk → day tank → engine
```

Mechanical plant often starts on generator too—cooling load is part of sizing. A genset that covers IT kW but not CRAHs cooks the hall.

### Global variants

Noise, emissions, and fuel sulfur rules differ (EU, California, India cities, Middle East). Roof vs yard placement follows climate and neighbors. Skills transfer; permits do not.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Monthly test | Auto-start under procedure; document; restore utility cleanly |
| Annual load bank | Prove kW without gambling production |
| Storm prep | Fuel level, polishing status, vendor on-call |
| Colo tenant | You rarely own gensets—you verify landlord test culture and notices |

**Staff checklist**

- Start battery and charger healthy  
- Fuel level vs multi-day policy  
- Last successful loaded test date  
- Which UPS/IT paths this genset plant covers  
- Never disable auto-start “temporarily” without ticket and restoration check  

**Good:** loaded tests, clean fuel, cooling sized for IT+mech. **Bad:** no-load monthly starts only; unknown fuel age; IT-only sizing.

---

## References

- [ISO 8528](https://www.iso.org/) (reciprocating engine driven generating sets — family)  
- [NFPA 110](https://www.nfpa.org/codes-and-standards/nfpa-110-standard-development/110) (emergency/standby power systems — US reference)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [IEC](https://www.iec.ch/)  
