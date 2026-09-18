# 6 — Ticket taxonomy and escalation

[← Previous](./5_Day_In_The_Life_Bare_Metal_Admin.md) · [README](./README.md) · [Next: Safety →](./7_Safety_LOTO_And_EPO.md)

---

## 1. Concepts

Sort tickets so the right skill arrives:

| Class | Examples | Typical owner |
|-------|----------|---------------|
| **Facility / critical facilities** | UPS, generator, CRAH, leak, EPO | Facilities |
| **Power delivery (cage)** | Whip, rack PDU, breaker | Tech / landlord per demarc |
| **Network / fabric** | ToR, optic, XC, BGP | Network |
| **Storage** | Multipath, LUN, array | Storage |
| **Compute / bare metal** | BMC, DIMM, image, hypervisor | Bare-metal |
| **Security / access** | Badge, mantrap, camera | Security |
| **Hands / colo product** | Smart Hands scope | Landlord hands + your SOP |

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Everything → app on-call | MTTA explodes |
| Facility alarm ignored as “IT” | Heat/power outage |
| Duplicate tickets no timeline | RCA mush |
| Priority inversion | Cosmetic before dark cage |

### How it connects

NOC day [4](./4_Day_In_The_Life_NOC.md). Integration failures suggest class quickly. Provider portals for colo classes.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| ITSM design | Classes + routing rules |
| Drill | Feed mixed alarms; score routing |
| RCA | Class + timeline mandatory |
| Colo | Know landlord vs customer demarc per class |

**Staff checklist**

- Taxonomy published  
- On-call per class  
- Demarc sheet for colo  
- Never open five tickets without a bridge scribe  

**Good:** fast correct routing. **Bad:** page-all; class roulette.

---

## References

- [Uptime Institute](https://uptimeinstitute.com/)  
- [Integration/](../Integration/README.md) failure chapters  
- Site RACI / ITSM official procedures  
- [Provider-Use/6](../Provider-Use/6_Customer_Portal_Patterns.md)  
