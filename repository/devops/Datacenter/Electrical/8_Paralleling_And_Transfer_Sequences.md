# 8 — Paralleling and transfer sequences

[← Previous](./7_Generators_And_Fuel_Systems.md) · [README](./README.md) · [Next: Busway vs cable →](./9_Busway_Vs_Cable_Distribution.md)

---

## 1. Concepts

**Paralleling** connects multiple generators (or sources) onto a common bus with synchronized voltage, frequency, and phase. **Transfer sequences** are the timed steps from utility → UPS → generator → back to utility without stranding IT.

This chapter is the choreography. Devices live in [4](./4_ATS_And_STS.md), [5](./5_UPS_Topologies.md), and [7](./7_Generators_And_Fuel_Systems.md).

### Where it sits

Paralleling switchgear / generator control panels in the electrical plant; sequence logic in PLC/controller firmware; operator HMI in the electrical room or NOC.

### Sequence literacy (happy path)

1. Utility fails (or intentional test)  
2. UPS supports critical load from storage  
3. Generators start and reach rated voltage/frequency  
4. First genset closes to bus (or ATS transfers)  
5. Additional gensets sync and share load  
6. UPS sees stable alternate source; batteries recharge  
7. On utility return: qualify utility → retransfer → cool-down → stop gensets  

Timers and interlocks make or break this list.

---

## 2. Advanced concepts

### Black start and dead bus

| Idea | Meaning |
|------|---------|
| **Dead bus close** | First genset energizes a dark bus |
| **Sync close** | Later units match phase before closing |
| **Load share** | kW/kVAR sharing among paralleled sets |
| **Black start path** | How controls and pumps get power to start the plant |

If control power dies with utility, auto sequences fail—design must feed controls from a survivable source.

### Failure modes

| Failure | Symptom | Impact |
|---------|---------|--------|
| Fail to sync | Genset runs unloaded | UPS autonomy burns |
| Out-of-phase close | Violent electrical/mechanical event | Plant damage + outage |
| Load share imbalance | One set overload trips | Cascading drop |
| Retransfer fighting | Flicker loops | IT blips, battery cycling |
| Human manual mode left on | Auto sequence skipped | Surprise on real outage |
| Test vs emergency logic differ | “Works in test” fails live | Classic RCA finding |

### How it connects to concurrent maintainability

Tier/Rated language assumes you can take a generator or path out **without** dropping IT. That requires remaining capacity on the parallel bus and correct UPS redundancy—not a PDF claim.

### Global variants

Controller brands differ; the jobs do not: start, sync, share, transfer, retransfer, log. Always use **this site’s** sequence document during incidents.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| IST / commissioning | Integrated sequence under load ([18](./18_Commissioning_And_IST_Power.md)) |
| Monthly test | Follow approved script; capture waveforms/logs |
| Incident | Freeze timeline: utility → UPS → gen close → IT alarms |
| Change | Any timer/firmware change is a facilities CAB item |

**Staff checklist**

- Current sequence diagram posted/accessible  
- Know who may command manual transfer  
- Confirm auto mode after every test  
- Parallel capacity ≥ IT+mech peak with one set down (if N+1 claimed)  
- Never “bump sync” experimentally on a live bus  

**Good:** drilled sequences, logged tests, auto restored. **Bad:** tribal manual tricks; untested retransfer; N gensets for N load with no spare.

---

## References

- [NFPA 110](https://www.nfpa.org/codes-and-standards/nfpa-110-standard-development/110)  
- [IEEE](https://www.ieee.org/)  
- [ISO 8528](https://www.iso.org/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
