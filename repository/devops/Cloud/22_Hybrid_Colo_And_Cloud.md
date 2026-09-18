# 22 — Hybrid colo and cloud

[← Previous](./21_Akamai_Linode_And_VPS_Kin.md) · [README](./README.md)

---

## 1. Concepts

**Hybrid** means deliberate interfaces between landlord colo / owned halls and tenant clouds—not accidental VPN spaghetti.

| Interface | Home |
|-----------|------|
| Cage, kW, hands, XC | [Datacenter Provider-Use](../Datacenter/Provider-Use/README.md) |
| IAM, VPC, instances, K8s SKUs | This `Cloud/` track |
| On-ramp physical+logical | [17](./17_Private_Connectivity_And_On_Ramps.md) + Provider-Use/7 |
| Packets/BGP | Networks-Deep-Dive |
| App delivery | CiCd / Servers |

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| No RACI across colo vs cloud teams | Ping-pong outages |
| Single on-ramp | Hybrid SPOF |
| CIDR overlap | Blackhole |
| Treating AZ = PDU A/B | Wrong independence story |
| Invented hyperscale floor plans | Integrity fail |

### Reference pattern

```text
Users → cloud LB/region
      ↘ on-ramp ← colo cages (latency-sensitive / regulated / interconnect)
Colo MMR ← carriers / IX / peers
```

### Honesty

Hyperscale internals stay secret ([Datacenter Jobs/12](../Datacenter/Jobs/12_Hyperscale_Ops_Honesty.md)). Document what you *do* control.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Regulated data local | Colo + private on-ramp to cloud burst |
| Peering-heavy | Equinix-class + cloud attach |
| DR | Second metro + second cloud region |
| Org design | Joint runbook: circuit IDs + cloud VIFs |

**Staff checklist**

- Interfaces named in ADR  
- Dual on-ramps for tier-1  
- Shared timeline in incidents  
- Never blur taxonomy in the design doc  

**Good:** explicit hybrid interfaces. **Bad:** hope VPN; one diagram for all logos.

---

## References

- [17](./17_Private_Connectivity_And_On_Ramps.md)  
- [Datacenter Provider-Use/7](../Datacenter/Provider-Use/7_Land_Cloud_On_Ramp.md)  
- [Datacenter Markets/8](../Datacenter/Markets-And-Operators/8_Tenant_Cloud_Vs_Landlord.md)  
- Cloud on-ramp docs (AWS/Azure/GCP)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
