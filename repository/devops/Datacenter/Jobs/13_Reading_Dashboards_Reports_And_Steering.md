# 13 — Reading dashboards, reports, and steering

[← Previous](./12_Hyperscale_Ops_Honesty.md) · [README](./README.md) · [Integration theory →](../Integration/11_Aggregate_Telemetry_Reports_And_Steering.md)

## 1. Concepts — the practical skill

Most people in DC work are not designing transformers. They are **practical**: they read screens and reports, then **steer**—approve an install, open a ticket class, freeze a deploy, call facilities, order a cross-connect.

This chapter is that job, step by step. Theory of aggregates: [Integration/11](../Integration/11_Aggregate_Telemetry_Reports_And_Steering.md).

### Three questions every screen must answer

1. **What changed?** (now vs baseline)  
2. **What is at risk?** (IT load, path, people)  
3. **Who acts?** (facilities / network / compute / landlord hands)

If a dashboard cannot support those three, it is decoration.

## 2. Advanced concepts — how to read without getting fooled

### A. Real-time pass (5 minutes)

| Look at | Healthy sign | Steer if unhealthy |
|---------|--------------|--------------------|
| Utility / UPS | On utility, batteries charged, not stuck on bypass | Page facilities; protect critical changes |
| Generators | Stopped (unless test), fuel OK | If running unexpectedly—investigate |
| CRAH / inlet | Inlets in policy band | Reduce load / fix containment / page facilities |
| A vs B amps | Roughly balanced for dual-cord rows | Hunt single-path cords |
| Inhibits | None left from yesterday’s work | Clear or escalate as incident |
| Tickets | No silent P1 aging | Escalate by [taxonomy](./6_Ticket_Taxonomy_And_Escalation.md) |

### B. Report pass (weekly)

| Report | How to read | Steering example |
|--------|-------------|------------------|
| Peak kW by row | Sort descending; mark >80% commit | Block new iron; plan kW add |
| Dual-path exceptions | List of single-PDU hosts | Hands tickets to remediate |
| Alarm top-N | Chronic vs new | Fix noise so real alarms matter |
| XC / port lead times | Anything due before install date | Order interconnect now |
| Backup/restore success | Last successful restore drill | Schedule drill if stale |

### C. Capacity meeting (steering forum)

Bring **one page**:

| Field | Source |
|-------|--------|
| Measured peak kW vs commit | EPMS/DCIM/portal |
| Cooling type + headroom | BMS / landlord |
| Free U and floor loading | DCIM / elevation |
| Ports / optics spares | Fabric inventory |
| XC lead time | Portal / carrier |
| Decision asked | Allow / delay / buy |

Vocabulary: [8](./8_Capacity_Conversation.md).

### D. Confirmation and disconfirmation in meetings

| Someone says | Disconfirm / check |
|--------------|-------------------|
| “We have Tier IV” | Show me *your* A/B landing on the one-line |
| “Row has spare capacity” | Show measured peak, not nameplate sum |
| “We’re redundant” | Pull one path in a window—or show last test |
| “DCIM says free” | Cross-check live PDU amps |
| “Cloud AZ = PDU A/B” | Different model ([12](./12_Hyperscale_Ops_Honesty.md)) |

**Confirm after steering:** “We blocked installs on Row 12.” → Next week peak should not rise from new iron; ticket queue for exceptions should exist.

### Failure modes (human)

| Failure | Fix |
|---------|-----|
| Reading averages only | Use peaks / percentiles for capacity |
| Ignoring timezones on reports | Align clocks; note maintenance overlays |
| Steering from memory | Attach screenshot/report ID to the decision |
| Panic on every yellow | Severity + taxonomy first |

## 3. Applications and use cases

| Role | Daily steer habit |
|------|-------------------|
| Colo tech | Rounds + photo evidence; glance EPMS for your areas |
| Critical facilities | Plant mimics + fuel/CHW trends; clear inhibits |
| NOC | Alarm correlation; right queue; timeline scribe |
| Bare-metal admin | BMC sensors + hall calendar; don’t fight facility events with reimages |
| Colo customer engineer | Portal kW + XC reports before PO |

**Staff checklist**

- Bookmark EPMS/BMS/DCIM/portal  
- Know which report is authoritative for kW  
- Bring peaks to capacity talks  
- Practice one “disconfirm” question per meeting  
- Close the loop: verify after decisions  

**Confirm**

1. What three questions must a screen answer?  
2. Why are peaks safer than averages for capacity steering?  
3. Give one disconfirm line for “we have spare power.”  
4. What proves a steering decision worked?

**Disconfirm**

- Being “data-driven” is **not** the same as trusting an uncalibrated meter.  
- A monthly PDF nobody owns is **not** a steering system.

**Good:** short real-time pass, weekly peaks, decisions with evidence, verify later. **Bad:** dashboard tourism; nameplate planning; no owner.

## References

- [Integration/11](../Integration/11_Aggregate_Telemetry_Reports_And_Steering.md)  
- [Electrical/15](../Electrical/15_EPMS_BMS_And_Power_Monitoring.md)  
- [8 Capacity conversation](./8_Capacity_Conversation.md)  
- [6 Ticket taxonomy](./6_Ticket_Taxonomy_And_Escalation.md)  
- [Uptime Institute](https://uptimeinstitute.com/)  
- [The Green Grid — PUE](https://www.thegreengrid.org/)  
