# 13 — EPO and safety disconnects

[← Previous](./12_Grounding_Bonding_And_Surge.md) · [README](./README.md) · [Next: High density →](./14_High_Density_48V_HVDC_And_Busbar.md)

---

## 1. Concepts

**EPO (emergency power off)** is a control that sheds power to defined loads in an emergency—fire, flood, life safety, or procedure-driven shutdown. **Safety disconnects** are the lockable isolation points used for LOTO so people can work without unexpected energization.

These are not “big red myth buttons for IT reboots.” Wrong use is a hall-wide outage and a serious incident.

### Where it sits

| Element | Place |
|---------|--------|
| EPO stations | Exits, electrical rooms, sometimes white space (site-specific) |
| EPO logic / shunt trips | Tied to breakers/contactors per design |
| Lockable disconnects | UPS inputs/outputs, PDU mains, rack isolation where provided |
| Fire system interfaces | May trigger power actions per code/design |

**Critical:** what EPO drops varies by site. Some drop IT; some drop mechanical; some drop both; some are zone-based. Read **this** site’s matrix.

---

## 2. Advanced concepts

### Who may operate

| Action | Typical authority |
|--------|-------------------|
| EPO intentional use | Trained responders / defined roles only |
| LOTO disconnect | Authorized + trained; permit-to-work |
| Bypass / defeat EPO | Almost never; engineering + CAB level |
| Test EPO | Scheduled, with IT notification and risk plan |

### Failure modes

| Failure | Impact |
|---------|--------|
| Accidental EPO | Mass outage; long recovery |
| EPO fails to operate in fire | Life-safety / code failure |
| Disconnect without LOTO | Arc flash / electrocution risk |
| Partial LOTO (missed energy source) | Unexpected re-energize (UPS, generator, dual feed) |
| Undocumented EPO zones | Wrong assumptions during incident |

### How it connects

Dual-feed gear needs **all** sources locked out. UPS output can remain live when input is dead. Generators can start into a “cleared” bus. LOTO procedures must list every energy source—including batteries ([6](./6_Batteries_And_Energy_Storage.md)).

### Global variants

US NEC/NFPA EPO expectations for IT rooms have evolved; many modern designs minimize casual EPO in white space. IEC markets use different emergency switching language. Always follow posted site procedure over imported habits.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First week on site | Find EPO stations; read what they drop; never “test” casually |
| Rack work | Use approved isolation; landlord remote-hands SOP in colo |
| Fire drill coordination | Know whether EPO is simulated or live |
| Incident | If EPO fired, recover via facilities sequence—not ad-hoc breaker roulette |

**Staff checklist**

- EPO zone matrix understood for your hall  
- LOTO training current before touching power gear  
- Dual-source and battery sources listed on permits  
- IT change calendar aware of EPO tests  
- Never use EPO as a remote power cycle  

**Good:** clear authority, labeled zones, full-source LOTO. **Bad:** unlabeled mushroom buttons; “we hit EPO to kill the row”; incomplete lockout.

---

## References

- [NFPA 70](https://www.nfpa.org/codes-and-standards/nfpa-70-standard-development/70)  
- [NFPA 70E](https://www.nfpa.org/codes-and-standards/nfpa-70e-standard-development/70e)  
- [NFPA 75](https://www.nfpa.org/codes-and-standards/nfpa-75-standard-development/75) (IT equipment fire protection context)  
- [IEC](https://www.iec.ch/)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
