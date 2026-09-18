# 5 — Failure: lose PDU A

[← Previous](./4_OOB_Plane_Walk.md) · [README](./README.md) · [Next: Lose ToR →](./6_Failure_Lose_ToR.md)

## 1. Concepts

**Worked failure:** Rack PDU A (or its upstream floor PDU/breaker) opens.

### Expected good outcome

| Layer | Behavior |
|-------|----------|
| Dual-PSU hosts | Stay up on B; BMC may alarm redundancy lost |
| Single-PSU devices | Down unless on STS bus |
| ToR if dual-powered | Survives if B feed OK |
| Cooling | CRAHs on A-only may degrade zone |

### Classic bad outcome

Both PSUs in A; both ToRs on A; “redundant” UPS that isn’t.

## 2. Advanced concepts

### Walk order

1. EPMS: which breaker/PDU  
2. Scope: which racks  
3. Host BMC: PSU redundancy  
4. Apps: actual impact  
5. Restore path / temporary load shed  

Deep device: [Electrical/11](../Electrical/11_Rack_PDU_A_And_B.md), [Electrical/17](../Electrical/17_Power_Path_Failure_Walks.md).

### How it connects

Tabletop with [6](./6_Failure_Lose_ToR.md) (combined power+net). Jobs escalation: [Jobs/6](../Jobs/6_Ticket_Taxonomy_And_Escalation.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Test window | Intentionally open A after dual-cord audit |
| Audit | Sample racks for dual-cord truth |
| Incident | Don’t reboot clusters before checking B health |
| Colo | Ticket landlord if upstream A; hands if whip |

**Staff checklist**

- Dual-cord audit current  
- Know A upstream identity  
- BMC alerts reach NOC  
- Never “fix” by moving both cords to B permanently  

**Good:** hosts ignore PDU A loss. **Bad:** silent single-path; chaos reboots.

## References

- [Electrical/17](../Electrical/17_Power_Path_Failure_Walks.md)  
- [Uptime Institute](https://uptimeinstitute.com/)  
- [DMTF Redfish](https://www.dmtf.org/standards/redfish)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
