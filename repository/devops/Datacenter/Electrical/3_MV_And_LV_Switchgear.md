# 3 — MV and LV switchgear

[← Previous](./2_Transformers.md) · [README](./README.md) · [Next: ATS and STS →](./4_ATS_And_STS.md)

---

## 1. Concepts

**Switchgear** is the assembly of breakers, bus, and controls that **connects, protects, and isolates** power paths. Medium-voltage (MV) gear handles site intake and large distribution; low-voltage (LV) gear feeds UPS, mechanical plant, and IT boards.

This is not a rack PDU. This is the room where a wrong breaker pull blacks out a hall.

### Where it sits

| Class | Typical role |
|-------|----------------|
| **MV switchgear** | Utility/site MV loops, feeds to transformers |
| **LV main switchgear** | After XFMR; main distribution |
| **Sub-boards / panelboards** | Branch to UPS, CRAHs, lighting, house loads |
| **Paralleling gear** | Generator sync and load share ([8](./8_Paralleling_And_Transfer_Sequences.md)) |

### Breaker literacy (ops, not PE exam)

| Idea | Why IT/facilities care |
|------|------------------------|
| **Frame / trip unit** | What can interrupt; how it is set |
| **Selectivity / coordination** | Downstream trip before upstream—or everything goes dark |
| **Arc flash / PPE boundaries** | Who may open doors; labeled approach limits |
| **Draw-out vs fixed** | Maintainability without full shutdown (design-dependent) |

---

## 2. Advanced concepts

### Redundancy and board topology

| Topology | Meaning |
|----------|---------|
| Single main board | Maintenance often means outage or careful temporary feeds |
| Main-tie-main | Two sources + tie; concurrent maintainability *if* operated correctly |
| Separate A/B switchgear | True path diversity when UPS and PDUs follow |

Marketing “N+1 switchgear” without a one-line is noise. Ask: *can I take this breaker out of service without dropping IT?*

### Failure modes

| Failure | Symptom | Impact |
|---------|---------|--------|
| Breaker trip (overcurrent/short) | Path dead; EPMS alarm | Local or hall-wide depending on which breaker |
| Mis-coordination | Upstream trip | Larger blast radius than the fault |
| Bus fault | Catastrophic path loss | Often both adjacent sections if not segregated |
| Control power loss | Breakers won’t close/trip logic fails | Stuck state; transfer sequences fail |
| Human error (wrong rack-out) | Immediate outage | Common root cause in RCAs |

### How it connects

```text
Utility → MV gear → XFMR → LV main gear → ATS/UPS / mechanical / IT distribution
                              ↘ generators via paralleling / ATS
```

EPO and safety disconnects relate here ([13](./13_EPO_And_Safety_Disconnects.md))—know what an EPO actually opens on *this* site.

### Global variants

IEC and ANSI/IEEE gear look different; bolt patterns and IP ratings differ. Procedure culture differs more than physics: LOTO, permit-to-work, and who holds keys are local. Transfer the *jobs*; do not transfer informal habits from another metro.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Walk a site | Find main LV gear, A/B segregation, generator tie points |
| Change window | Confirm which breakers are in the LOTO boundary |
| Incident | Read which trip unit operated; check coordination assumptions |
| Capacity add | New breakers/feeders need spare slots *and* upstream ampacity |

**Staff checklist**

- One-line matches physical labels (board IDs, breaker IDs)  
- Know A vs B boards for your cage/row  
- Arc-flash labels present; PPE rules known  
- Control power source identified  
- Never operate unlabeled or “temporary” unmarked gear  

**Good:** coordinated settings, clear labeling, main-tie-main procedures drilled. **Bad:** shared unlabeled breakers; “we always rack this one” tribal knowledge.

---

## References

- [IEEE](https://www.ieee.org/) (switchgear / coordination families)  
- [IEC](https://www.iec.ch/)  
- [NFPA 70E](https://www.nfpa.org/codes-and-standards/nfpa-70e-standard-development/70e) (electrical safety in the workplace — US reference point)  
- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
