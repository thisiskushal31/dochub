# 11 — Rack PDU A and B

[← Previous](./10_Floor_And_Row_PDUs.md) · [README](./README.md) · [Next: Grounding →](./12_Grounding_Bonding_And_Surge.md)

## 1. Concepts

**Rack PDUs** (power distribution units / “power strips” at datacenter grade) mount in the cabinet and present outlets to server PSUs. **A and B** means two PDUs fed from independent upstream paths so a dual-PSU server survives loss of one side.

### Where it sits

Vertical (0U) or horizontal in the rack; inlets from whips; outlets to C13/C19 (or regional equivalents); network port for metered/switched models to the management network (often OOB).

### Types

| Type | Capability |
|------|------------|
| **Basic** | Outlets only |
| **Metered** | Current/power visible (inlet and/or outlet) |
| **Monitored** | Networked metering |
| **Switched** | Per-outlet or bank on/off remote |
| **Outlet-metered switched** | Billing-grade / chargeback detail |

Switched PDUs are powerful and dangerous: a wrong click is an outage.

## 2. Advanced concepts

### Landing rules that actually matter

| Rule | Why |
|------|-----|
| PSU1 → PDU A, PSU2 → PDU B | Independence |
| Same color/path both PSUs | Fake redundancy |
| Load balance A vs B | Avoid tripping one side first |
| Inlet rating ≥ expected draw | C19/32A vs actual GPU load |
| Whip connector matches PDU inlet | No adapter folklore in production |

### Failure modes

| Failure | Symptom | Impact |
|---------|---------|--------|
| Branch breaker / whip loss | One PDU dark | Dual-PSU OK; single-PSU down |
| PDU inlet cord failure | Same | Same |
| Overload trip | Banks drop | Partial rack outage |
| Switched outlet mis-click | One host dark | App incident |
| Metering failure | Blind capacity | Overstuff until trip |
| Daisy-chain / power strips | Fire/trip risk | Against most site rules |

### How it connects

```text
Floor PDU A → whip → rack PDU A → PSU1
Floor PDU B → whip → rack PDU B → PSU2
```

BMC/OS may report PSU redundancy lost—treat as priority when A or B path degrades ([Compute track](../Compute/README.md)).

### Global variants

- **NEMA** vs **IEC** connectors  
- **208 V** single/three-phase vs **230/400 V**  
- Three-phase rack PDUs for dense rows—phase balance becomes an ops job  

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Install server | Dual cord correctly; photo for remote hands evidence |
| Capacity | Outlet and inlet metering vs breaker rating |
| Remote power cycle | Switched PDU with change ticket—not Slack dare |
| Audit | Random rack: both PSUs on same PDU? Fail |

**Staff checklist**

- A/B labeled at rack and at whip  
- No consumer power strips  
- Metering in EPMS or DCIM if required  
- Switched PDU access AAA-controlled  
- Single-PSU devices documented as N risk or on STS bus  

**Good:** balanced A/B, metered, dual-cord discipline. **Bad:** both cords in A; switched PDU with shared admin password; 20 A circuit at 19 A idle + boot storm.

## References

- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [IEC](https://www.iec.ch/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
