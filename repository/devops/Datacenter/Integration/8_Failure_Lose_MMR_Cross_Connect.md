# 8 — Failure: lose MMR cross-connect

[← Previous](./7_Failure_Lose_CRAH_Row.md) · [README](./README.md) · [Next: Reading one-line →](./9_Reading_A_One_Line_And_Elevation.md)

## 1. Concepts

**Worked failure:** A meet-me cross-connect is cut, dark, or mispatched.

### Expected good outcome

| Design | Behavior |
|--------|----------|
| Dual diverse XCs | Traffic on surviving path |
| Monitoring on both circuits | Fast detect |
| Runbooks with circuit IDs | Fast provider ticket |
| Cloud on-ramp dual | Hybrid survives |

### Classic bad outcome

Single XC; “diverse” in same duct; logical BGP still up briefly then blackhole; wrong ticket to app team.

## 2. Advanced concepts

### Walk order

1. Light / DOM / interface down at border  
2. Circuit ID / panel strand  
3. Second path health  
4. Provider / landlord ticket with LOA refs  
5. Apps only after path confirmed  

Deep: [Fabric-Physical/5](../Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md), [Provider-Use/3](../Provider-Use/3_Order_Interconnect.md), [Provider-Use/9](../Provider-Use/9_Bandwidth_And_Cross_Connect_Lifecycle.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Design | Dual XC before production cutover |
| Test | Admin shut one circuit in window |
| Incident | Physical vs logical split in RCA  
| Colo | Hands for patch only with exact panel IDs |

**Staff checklist**

- Circuit inventory current  
- Diversity evidence on file  
- Border dual-home  
- Never cutover on single untested XC  

**Good:** one XC loss is an alert, not an outage. **Bad:** single strand; app restart storms.

## References

- [Fabric-Physical/5](../Fabric-Physical/5_MMR_And_Cross_Connect_Physical.md)  
- [Provider-Use/3](../Provider-Use/3_Order_Interconnect.md)  
- [Equinix docs](https://docs.equinix.com/)  
- [Networks-Deep-Dive](https://github.com/thisiskushal31/Networks-Deep-Dive)  
