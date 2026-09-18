# 1 — Utility intake and service entrance

[README](./README.md) · [Next: Transformers →](./2_Transformers.md)

## Mental map

![Power path street to chip](../../Assets/Datacenter/Electrical/power-path-street-to-chip.svg)

*What to notice: this chapter is the **left edge**—utility and service entrance. Everything to the right (UPS, PDU, PSU) assumes feeds arrive clean and labeled. Whole-hall context: [0c](../0c_Whole_Hall_Mental_Map.md).*

**Operator experience (verify locally):** Night tickets often start with “is it us or the utility?”—know your demarcation sticker and who owns the first customer breaker before you page someone.

## 1. Concepts

**Utility intake** is where the public (or campus) grid becomes *your* site’s power. Everything downstream—transformers, switchgear, UPS, generators, PDUs—depends on what arrives here: how many feeds, at what voltage, with what metering and protection.

### Where it sits

| Element | Typical place |
|---------|----------------|
| Utility poles / underground ducts | Outside the fence or under the street |
| Utility transformer (utility-owned) | Pad or vault near the property line |
| **Service entrance** | First customer-owned gear after the utility demarcation |
| Main metering | Utility revenue meter; sometimes customer check meters |
| Main disconnect / main breaker | Service entrance switchgear |

**Demarcation** matters legally and for tickets: who owns the cable, who resets which breaker, who you call at 03:00.

### What “feeds” means for IT

| Pattern | Meaning for the hall |
|---------|----------------------|
| **Single utility feed** | One path from the grid; redundancy starts at generators/UPS |
| **Dual utility feeds** | Two utility sources (different substations or routes preferred); still not “cloud AZ” unless paths stay independent indoors |
| **Campus MV loop** | Medium-voltage loop feeding multiple buildings; one campus can still be one failure domain for fiber |

Voltage at the fence varies by metro: North America often **medium voltage** into a site transformer then **480/277 V** or **208/120 V** for IT; EU/Asia/ME often **400/230 V** (50 Hz) LV after site transformers; some large campuses take MV deep into the plant. Same *jobs*—different nameplates.

### Ratings language you will hear

- **kVA / MVA** at the service — capacity the utility agrees to deliver  
- **Demand** vs **connected load** — what you actually pull vs nameplate sum  
- **Power factor** — utility may bill or limit reactive power  
- **Redundant service** — marketing word; ask *where the two paths join*

## 2. Advanced concepts

### Independence is a drawing, not a sticker

Two cables into one switchboard that shares a single bus section are **not** two independent paths. Dual feeds that share one underground duct run can both die in one dig. Ask for:

1. Utility single-line (or redacted equivalent)  
2. Where A and B first become common  
3. Generator start assumptions if both feeds are lost  

Hyperscale campuses often have multiple substations and private MV; published customer docs stop at region/AZ. Colo one-lines are what you get for *your* cage feed—not the landlord’s wholesale campus secrets.

### Metering and capacity sales

Operators sell **kW** (and sometimes **kVA**). Utility meters measure energy and demand. EPMS ([15](./15_EPMS_BMS_And_Power_Monitoring.md)) is the ops view; the utility bill is the commercial view. Over-subscribing IT nameplate vs measured draw is how halls “find” capacity—and how breakers trip on simultaneous boot storms.

### Failure modes at the entrance

| Failure | Typical symptom | Downstream effect |
|---------|-----------------|-------------------|
| Utility outage (both feeds) | Transfer to generator or blackout | UPS bridges; generators must start and sync |
| One of two feeds lost | ATS/STS or board transfer | Should be no IT drop if designed and landed correctly |
| Utility voltage sag / flicker | UPS or STS reacts | Sensitive PSUs may ride through; bad eco-modes may not |
| Dig-in / cable fault | One path dead | Same as single-feed loss on that path |
| Metering / CT failure | Billing or EPMS wrong | Ops trusts a lie until IST or audit |

### How it connects

```text
Utility grid → (utility XFMR) → service entrance / main switchgear
       → site transformers ([2](./2_Transformers.md))
       → MV/LV switchgear ([3](./3_MV_And_LV_Switchgear.md))
       → ATS/STS ([4](./4_ATS_And_STS.md)) → UPS path …
```

Generators usually parallel or transfer at switchgear **after** or **beside** utility—not “at the rack.”

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Qualify a colo site | Ask feed count, substation diversity, historical outages, generator test culture |
| Survive utility loss | Confirm UPS runtime + generator auto-start + fuel ([7](./7_Generators_And_Fuel_Systems.md)) |
| Capacity conversation | Compare contracted kW vs utility demand headroom |
| Incident: “power event” | Start at EPMS/utility alarm time; do not blame the ToR first |

**Staff checklist**

- Know demarcation: utility vs site vs tenant gear  
- Know how many *independent* utility paths (drawing, not brochure)  
- Voltage/frequency of the site (480/208 vs 400/230; 50 vs 60 Hz)  
- Who holds the main disconnect authority (LOTO culture)  
- Subscribe to utility and landlord planned outage notices  
- Never treat “dual cord” at the rack as proof of dual utility  

**Good:** one-line reviewed, dual-feed independence understood, generator test on calendar. **Bad:** assuming two PDU colors mean two substations; ignoring dig risk on a shared duct.

## References

- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers) (site topology language)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [NFPA 70 — National Electrical Code](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70) (US service-entrance concepts; local code always wins)  
- [IEC](https://www.iec.ch/) (international LV/MV apparatus standards family)  
