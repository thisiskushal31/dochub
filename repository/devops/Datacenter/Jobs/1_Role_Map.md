# 1 — Role map

[README](./README.md) · [Next: Colo tech day →](./2_Day_In_The_Life_Colo_Tech.md)

---

## 1. Concepts

Who needs which Datacenter tracks:

| Role | Core tracks |
|------|-------------|
| **DC / facilities tech** | Electrical, Mechanical, White-Space, tickets, LOTO |
| **Critical facilities engineer** | Deeper Electrical+Mechanical, IST, capacity |
| **NOC analyst** | Alarms, escalation ([6](./6_Ticket_Taxonomy_And_Escalation.md)), change calendar |
| **Remote / Smart Hands** | White-Space, Provider-Use hands, photo discipline |
| **Structured cabling tech** | White-Space + Fabric physical |
| **Network engineer (DC fabric)** | Fabric-Physical + Networks-Deep-Dive |
| **Storage admin** | Storage-Physical |
| **Bare-metal / hypervisor admin** | Compute, Accelerators, imaging, on-ramp 7–10 |
| **Colo customer engineer** | Provider-Use, Markets, contracts |
| **Hyperscale / cloud DC ops** | Same vocabulary; different tooling/secrecy ([12](./12_Hyperscale_Ops_Honesty.md)) |

---

## 2. Advanced concepts

### Failure modes of role blur

| Blur | Risk |
|------|------|
| NOC doing LOTO | Safety |
| App on-call as only fabric owner | Slow MMR RCA |
| Hands without elevations | Wrong U |
| Bare-metal ignoring hall notices | Surprise outages |

### How it connects

Integration walks are shared literacy. Career paths: [10](./10_Career_Paths.md).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Hire | Map JD to this table |
| Train | Assign track staircase per role |
| Incident | RACI from taxonomy ([6](./6_Ticket_Taxonomy_And_Escalation.md)) |
| Interview | [9](./9_Interview_Pack.md) |

**Staff checklist**

- Role→track map posted for the team  
- Escalation owners named  
- Safety boundaries clear  
- Never assume one person owns plant+BGP+BMC  

**Good:** clear RACI + learning paths. **Bad:** hero culture; unsafe improvisation.

---

## References

- [Uptime Institute](https://uptimeinstitute.com/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [NFPA 70E](https://www.nfpa.org/codes-and-standards/nfpa-70e-standard-development/70e)  
- Datacenter track READMEs  
