# 4 — Day in the life: NOC

[← Previous](./3_Day_In_The_Life_Critical_Facilities.md) · [README](./README.md) · [Next: Bare-metal admin →](./5_Day_In_The_Life_Bare_Metal_Admin.md)

---

## 1. Concepts

The **NOC** correlates alarms across facility, network, and customer IT—and escalates to the right owner fast.

### Typical loop

| Block | Work |
|-------|------|
| Watch | Alarm queues, camera/access as policy |
| Triage | Taxonomy ([6](./6_Ticket_Taxonomy_And_Escalation.md)) |
| Comms | Bridge calls; maintenance notices |
| Escalate | Facilities / network / compute / security |
| Document | Timeline for RCA |

---

## 2. Advanced concepts

### Failure modes

| Failure | Impact |
|---------|--------|
| Alarm storm without correlation | Miss real event |
| Wrong queue (app vs power) | Delay |
| No facility calendar | Surprise generator “incident” |
| Hero reboots | Mask root cause |

### How it connects

Integration failure chapters. EPMS [Electrical/15](../Electrical/15_EPMS_BMS_And_Power_Monitoring.md). Provider portals for colo tenants.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| New NOC analyst | Drill PDU A / ToR / CRAH tabletops |
| Maintenance night | Extra eyes; known inhibits |
| Major incident | Single timeline scribe |
| Metrics | MTTA by taxonomy class |

**Staff checklist**

- Runbooks per alarm class  
- On-call matrices current  
- Maintenance feed subscribed  
- Never page everyone for every SNMP flap  

**Good:** calm triage, right owner, clean timeline. **Bad:** reboot culture; ignored facility notices.

---

## References

- [Uptime Institute](https://uptimeinstitute.com/)  
- [Integration/](../Integration/README.md) failure chapters  
- Operator/NOC procedure templates (site-specific official)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
