# 5 — UPS topologies

[← Previous](./4_ATS_And_STS.md) · [README](./README.md) · [Next: Batteries →](./6_Batteries_And_Energy_Storage.md)

## 1. Concepts

An **uninterruptible power supply (UPS)** bridges the gap between utility loss and generator steady power—and conditions power for IT. The topology tells you what happens on a sag, a surge, and a full outage.

### Common topologies (literacy)

| Topology | Idea | Typical DC use |
|----------|------|----------------|
| **Online double-conversion** | Rectify to DC, invert to AC always | Default for critical IT |
| **Eco / high-efficiency modes** | Bypass utility when “clean”; switch to inverter on event | Efficiency vs risk trade |
| **Line-interactive** | Regulates; battery on deeper events | Smaller / edge; less common for hall IT buses |
| **Modular UPS** | Hot-swappable power modules; N+1 frames | Scalable halls |
| **Rotary / diesel-rotary** | Kinetic + engine variants | Legacy / specialty |

### Where it sits

```text
LV board / ATS → UPS input → UPS output (critical bus) → floor/row PDU → rack PDU
                      ↘ static/maintenance bypass
Batteries or other energy store on the DC link ([6](./6_Batteries_And_Energy_Storage.md))
```

### Ratings language

| Term | Meaning |
|------|---------|
| **kVA / kW** | Apparent vs real power; IT cares about **kW** and power factor |
| **Runtime** | Minutes at stated load—not at empty hall |
| **Redundancy** | N, N+1 modules, or 2N UPS plants on A/B |
| **Efficiency** | Heat you must cool; eco modes raise efficiency |

## 2. Advanced concepts

### Eco mode honesty

Eco/high-efficiency modes reduce double-conversion losses by riding utility more directly. They need fast detection and transfer to inverter. Ask:

- What disturbances trigger inverter  
- Documented transfer time  
- Whether the site *actually* runs eco in production  

A brochure “online UPS” that lives in eco mode is an ops fact, not a sticker fact.

### Failure modes

| Failure | Symptom | IT impact |
|---------|---------|-----------|
| Inverter fault | Transfer to bypass or drop | Depends on bypass quality |
| Overload | Alarm; eventual shutdown | Path loss |
| Battery string open | Reduced runtime; alarm | Next outage is short |
| DC bus fault | Major UPS event | Often hard fail |
| Fans / thermal | Derate or shutdown | Capacity loss |
| Firmware / control fault | Odd transfers | Hard to diagnose without logs |

### How it connects to redundancy claims

| Claim | Check |
|-------|-------|
| “2N UPS” | Separate UPS plants feeding A and B—not two modules in one frame only |
| “N+1 modular” | Can you lose one module at peak IT load? |
| Dual-cord servers | Still need independent UPS outputs to A/B PDUs |

### Global variants

Voltage/frequency follow the site (208/480 60 Hz vs 400 V 50 Hz). Three-phase in, three-phase out is normal for hall UPS; rack gear may see single-phase branch circuits from PDUs.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Utility blip | Online UPS should ride through without generator |
| Generator start delay | Runtime must cover start + sync + transfer margin |
| Efficiency project | Model heat and risk before enabling eco |
| Incident | UPS log + EPMS timestamps before blaming OS |

**Staff checklist**

- Topology in use (online vs eco) documented  
- kW load vs UPS rating (not just “green LEDs”)  
- Bypass state known after every maintenance  
- A/B UPS independence verified on one-line  
- Alarms integrated to NOC ([15](./15_EPMS_BMS_And_Power_Monitoring.md))  

**Good:** double-conversion (or proven eco), tested bypass, clear A/B plants. **Bad:** unknown eco; both “redundant” UPS on one input breaker.

## References

- [IEC 62040](https://webstore.iec.ch/) (UPS family — search IEC webstore for current parts)  
- [IEEE](https://www.ieee.org/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series) (heat from UPS losses)  
