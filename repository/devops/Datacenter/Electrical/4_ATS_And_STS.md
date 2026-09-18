# 4 — ATS and STS

[← Previous](./3_MV_And_LV_Switchgear.md) · [README](./README.md) · [Next: UPS topologies →](./5_UPS_Topologies.md)

## 1. Concepts

Transfer switches choose **which source** feeds a load: utility vs generator, UPS vs bypass, or source A vs source B.

| Device | How it switches | Typical use |
|--------|-----------------|-------------|
| **ATS (automatic transfer switch)** | Electromechanical; break-before-make common | Utility ↔ generator; some board transfers |
| **STS (static transfer switch)** | Semiconductor (SCR) path; very fast | Critical IT buses; UPS output selection |

**Break-before-make** means a brief disconnect (ms to longer, design-dependent). **Make-before-break** overlaps sources—only where sources are synchronized and the design allows it.

### Where it sits

```text
Utility and generator → ATS → UPS input (common pattern)
UPS A and UPS B outputs → STS → critical bus → PDUs
Manual bypass switches → maintenance path around UPS
```

Not every site has STS. Many dual-cord servers skip STS and rely on **A+B rack PDUs** into dual PSUs ([11](./11_Rack_PDU_A_And_B.md)). STS appears when you need a single-cord critical bus or automatic preferred-source selection at the UPS output.

## 2. Advanced concepts

### Ratings and timers

| Setting / rating | Why it matters |
|------------------|----------------|
| Continuous current | Must cover load + growth |
| Withstand / short-circuit | Must survive fault until breaker clears |
| Transfer / retransfer timers | Too fast = nuisance; too slow = UPS battery drain |
| Preferred source | Which side is “normal” |
| In-phase monitor | Avoids out-of-phase closes on electromechanical ATS |

### Failure modes

| Failure | Symptom | IT impact |
|---------|---------|-----------|
| ATS fails to transfer | Generator up, load still dark or on dying UPS | Outage after battery |
| ATS false transfer | Momentary blip or wrong source | Resets if ride-through short |
| STS SCR fail / open | One source unavailable | Depends on dual-path downstream |
| STS prefers bad source | Alarms; degraded |
| Bypass left engaged after maintenance | UPS protection skipped | Next utility event hits IT raw |

### How it connects (jobs)

- **Order capacity / design review:** ask where ATS/STS sit relative to your A+B landing  
- **Commissioning:** transfer tests under load ([18](./18_Commissioning_And_IST_Power.md))  
- **Ops:** after generator tests, confirm retransfer completed and bypass is normal  

### Dual-cord vs STS

| Approach | Pros | Cons |
|----------|------|------|
| Dual PSU + A/B PDU | Simple; no STS SPOF on the bus | Needs dual-cord gear; human wiring errors |
| STS + single bus | Single-cord devices supported | STS is itself a critical device |
| Mix | Common in brownfield | Easy to misunderstand during incidents |

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Generator test | Watch ATS transfer and retransfer; UPS should not deep-discharge |
| Single-PSU appliance | Either STS-backed bus or accept N risk—document it |
| Incident “flicker” | Check ATS/STS event log vs utility sag |
| Colo cage | Usually you do not own ATS; you own cord discipline to dual PDUs |

**Staff checklist**

- Locate ATS/STS for your path on the one-line  
- Know preferred source and timer settings (or who owns them)  
- After maintenance: confirm not left on bypass  
- Dual-cord: PSU-A≠PSU-B same PDU color  
- Never force-transfer outside procedure  

**Good:** tested automatic transfer with logged results. **Bad:** bypass permanent; dual cords in one whip.

## References

- [IEEE](https://www.ieee.org/) (transfer switch guidance families)  
- [IEC](https://www.iec.ch/)  
- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
