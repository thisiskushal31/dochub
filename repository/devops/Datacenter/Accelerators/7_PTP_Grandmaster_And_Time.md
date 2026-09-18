# 7 — PTP grandmaster and time

[← Previous](./6_Optics_DAC_AOC_Transceivers.md) · [README](./README.md) · [Next: Serial console servers →](./8_Serial_Console_Servers.md)

## 1. Concepts

Some halls need **accurate, traceable time**—trading, telco, regulated workloads, distributed databases. **PTP** (Precision Time Protocol, IEEE 1588) and related stacks discipline clocks far tighter than NTP alone.

A **grandmaster** (GM) is the time source appliance (often GNSS/GPS-fed) that the timing network follows.

### Where it sits

| Element | Place |
|---------|--------|
| GNSS antenna / surge / cable | Roof → timing room (careful install) |
| Grandmaster appliance | Timing rack; dual power |
| Boundary / transparent clocks | Switches on the path |
| Host NICs with hardware timestamping | Servers that need ns-class sync |

Not every datacenter has this—recognize when you are in a timing-critical environment.

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| GNSS loss / jamming | Holdover then drift |
| Asymmetric network path | Time error |
| Untimed switches in path | PTP quality collapse |
| Single GM | SPOF for regulated apps |
| Ignoring leap seconds / smearing policy | App surprises |

### How it connects

```text
GNSS → GM → (PTP fabric) → NIC PHC → OS clock → apps
```

Network equipment must support the chosen PTP profile. Fabric physical roles still apply; protocol detail can live in Networks-Deep-Dive.

### Global variants

GNSS visibility, regulatory profiles (telecom/power/finance), and antenna permissions differ by site. Dual-GM and multi-constellation are common hardening patterns.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Trading / telco hall | Dual GM, monitored holdover, PTP-capable fabric |
| General enterprise | NTP stratum design may suffice—don’t overbuy |
| Incident “clock skew” | Check GM lock status before app restarts |
| Move/add | Don’t insert non-PTP switch into timing path |

**Staff checklist**

- Know if site is PTP-critical  
- GM power A+B; alarm to NOC  
- Antenna cable protected/surge-bonded  
- Holdover policy documented  
- Never treat consumer GPS USB dongles as GM  

**Good:** redundant GM, monitored lock/holdover, PTP-aware path. **Bad:** single GM; NTP hope for ns apps; antenna afterthought.

## References

- [IEEE 1588](https://standards.ieee.org/) (PTP — access via IEEE)  
- [NIST time services](https://www.nist.gov/pml/time-and-frequency-division)  
- Vendor grandmaster documentation for your appliance  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive) (protocol depth pointer)  
