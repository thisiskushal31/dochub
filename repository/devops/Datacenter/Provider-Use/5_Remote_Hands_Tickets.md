# 5 — Remote hands tickets

[← Previous](./4_Access_Badges_And_Change_Windows.md) · [README](./README.md) · [Next: Portal patterns →](./6_Customer_Portal_Patterns.md)

## 1. Concepts

**Remote / Smart Hands** executes scoped physical tasks: reseat, cable, photo, label, power cycle, install rails—per ticket, not open-ended labor.

### Ticket contents that work

| Field | Why |
|-------|-----|
| Cage / cabinet / **U** | Location |
| **Serial** / asset tag | Identity |
| Step-by-step | No improvisation |
| Before/after **photos** | Evidence |
| Parts arrival | Dock tracking |
| Rollback | If reseat fails |
| Outage window | Approval |

Elevations: [White-Space/7](../White-Space/7_Asset_Tags_Serials_And_Elevations.md).

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Vague “fix the server” | Wrong U / damage |
| No serial | Ambiguity |
| Scope creep mid-ticket | Delays/cost |
| Skipping photos | Disputes |
| Liquid/QD without procedure | Spill risk |

### How it connects

Equinix-class hands product: [Markets/4](../Markets-And-Operators/4_Equinix_Class_Interconnection.md). Crash cart: [White-Space/8](../White-Space/8_Crash_Cart_KVM_And_Serial_Aggregation.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Reseat optic | U, port, serial, clean instruction, photos |
| Rack new server | Rails, PDU A/B map, blanking, photos |
| Break/fix | Spares shipped + ticket mirrors install SOP |
| Audit quality | Spot-check photo standards |

**Staff checklist**

- Elevation accurate before ticket  
- Scope limits respected  
- Photos required  
- Timezone/window clear  
- Never assume hands will “figure out cabling”  

**Good:** precise tickets, photo evidence, tight scope. **Bad:** novel-length vagueness; wrong U; no serial.

## References

- Official Smart Hands / remote hands catalogs for your landlord  
- [Equinix Smart Hands](https://www.equinix.com/) (product pages/docs)  
- [White-Space/7](../White-Space/7_Asset_Tags_Serials_And_Elevations.md)  
- Operator ticket portal help (official)  
