# 17 — Power path failure walks

[← Previous](./16_Power_Quality_And_Harmonics.md) · [README](./README.md) · [Next: Commissioning →](./18_Commissioning_And_IST_Power.md)

## 1. Concepts

A **failure walk** traces what happens when a specific component dies—on the drawings and in the hall. This chapter practices the electrical spine:

```text
Utility → XFMR → switchgear → ATS/STS → UPS → batteries → generators
      → busway/cable → floor PDU → rack PDU → PSU
```

Use it in design reviews, tabletop drills, and live incidents. Integration track will extend walks across cooling and fabric; here the focus is power.

### How to walk (method)

1. Name the failed object  
2. Find it on the one-line  
3. List what loses energy immediately  
4. List what should transfer / ride through  
5. Name the alarm you expect on EPMS  
6. Name the human action if auto fails  
7. Name the IT symptom if dual-cord discipline was wrong  

## 2. Advanced concepts

### Walk library (electrical)

| Failure | Expected good outcome | Classic bad outcome |
|---------|----------------------|---------------------|
| **Lose utility feed A** (dual utility) | Transfer or ride on B; IT steady | Shared board → blip/outage |
| **Lose UPS A output** | Dual-PSU gear on B; single-cord drops | Both PSUs on A |
| **UPS forced to bypass** | IT on raw alternate; next sag hits hard | Unknown bypass for weeks |
| **Battery string open** | Alarm; short autonomy | Silent; genset late → outage |
| **Genset fail to start** | UPS holds; escalate fuel/start | Empty batteries |
| **ATS fail to transfer** | Same | Same |
| **Floor PDU A main trip** | B side carries dual-cord | Half rack dark if miswired |
| **Rack PDU B cord pull** | PSU redundancy lost alarm; still up | Nobody notices until A dies |
| **Branch breaker nuisance** | One whip; localized | Shared daisy chain takes many hosts |
| **EPO zone hit** | Defined shutdown; controlled recovery | Ad-hoc re-energize chaos |

### Independence checklist (repeat forever)

- Two colors ≠ two paths  
- Two UPS modules in one frame ≠ 2N plants  
- Two whips from one floor PDU ≠ A+B  
- Generator without fuel delivery plan ≠ endurance  

### How it connects to jobs

Facilities tech walks plant devices; bare-metal admin walks rack PDU/PSU/BMC; NOC correlates alarms. Role map: [Jobs](../Jobs/README.md). End-to-end multi-domain walks: [Integration](../Integration/README.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Design review | Walk every SPOF to IT impact before accept |
| Tabletop | Pick three failures; time the response |
| Live incident | Start at EPMS trip, not at Kubernetes node NotReady |
| Colo onboarding | Walk *your* cage A/B to landlord UPS labels |

**Staff checklist**

- One-line accessible during incidents  
- Dual-cord audit samples quarterly  
- After any power work: verify not left on bypass  
- Document actual vs brochure redundancy  
- Practice generator+UPS walks before storm season  

**Good:** written walks with expected alarms. **Bad:** first failure walk happens during the outage.

## References

- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [NFPA 110](https://www.nfpa.org/codes-and-standards/nfpa-110-standard-development/110)  
