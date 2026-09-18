# 11 — Aggregate telemetry, reports, and steering

[← Previous](./10_Units_Voltage_Frequency_Literacy.md) · [README](./README.md) · [Jobs reading dashboards →](../Jobs/13_Reading_Dashboards_Reports_And_Steering.md)

## Mental map

![Whole hall layers](../../Assets/Datacenter/Integration/whole-hall-layers.svg)

```text
sensors / meters / BMC / fabric counters
        ↓
   telemetry bus / historians
        ↓
  dashboards + scheduled reports   →   steering (capacity, change, tickets)
```

*What to notice: screens sit on the **people layer** but must tell the truth about power, cool, and packets. Jobs practice: [Jobs/13](../Jobs/13_Reading_Dashboards_Reports_And_Steering.md).*

## 1. Concepts — from sensor to decision

A hall produces thousands of measurements. **Nobody steers from raw sensor spam.** Practical ops works in two layers:

| Layer | What it is | Plain meaning |
|-------|------------|---------------|
| **Telemetry** | Points collected from devices | “UPS A load is 62%” |
| **Aggregate / report** | Roll-ups, trends, dashboards, scheduled reports | “Row 12 is at 90% of leased kW this week” |
| **Steering** | Decisions and actions from those aggregates | “No more GPU installs on Row 12 until we buy kW / move load” |

If you only learn equipment names but never how **reports drive steering**, you will freeze in a NOC or capacity meeting.

### The main systems (names vary; jobs do not)

| System | Collects | Typical users |
|--------|----------|---------------|
| **EPMS** | Electrical: breakers, UPS, gens, meters, often PDUs | Facilities, NOC |
| **BMS** | Building: temps, CRAHs, leaks, sometimes power overlap | Facilities |
| **DCIM** | Inventory (racks/U/assets) + capacity + sometimes tickets | Colo ops, customer engineers, planners |
| **Observability (IT)** | Host/app metrics, logs, traces | Bare-metal / SRE — *different plane* |
| **Portal reports** | Landlord billing kW, tickets, XC status | Colo tenants ([Provider-Use/6](../Provider-Use/6_Customer_Portal_Patterns.md)) |

Device-level EPMS literacy: [Electrical/15](../Electrical/15_EPMS_BMS_And_Power_Monitoring.md). Day job of reading screens: [Jobs/13](../Jobs/13_Reading_Dashboards_Reports_And_Steering.md).

### What “aggregate” means technically

| Aggregation | Example | Steering use |
|-------------|---------|--------------|
| **Latest value** | Breaker open/closed | Incident now |
| **Peak / percentile** | Peak kW this month | Capacity sales / risk |
| **Energy (kWh)** | Monthly energy | PUE / bill |
| **Balance** | A vs B path amps | Fake redundancy detect |
| **Count of alarms** | Inhibit left on, failed fans | Maintenance quality |
| **Inventory join** | kW by customer / rack / SKU | Chargeback, planning |
| **Trend** | Inlet temp rising over weeks | Filter/chemistry/plant health |

**Disconfirm:** A pretty dashboard is **not** truth if meters are wrong, clocks are skewed, or inhibits hide alarms. **Confirm:** Name one aggregate you would use before approving a 20 kW GPU rack on a row.

## 2. Advanced concepts — report types that actually steer

### A. Real-time mimics (steer *now*)

| Screen | Question it answers | Bad steering if misread |
|--------|---------------------|-------------------------|
| One-line live status | What path is dark? | Reboot apps for a PDU trip |
| UPS / battery | How many minutes left? | Delay generator escalation |
| CRAH / CHW | Is cooling failing? | RMA CPUs in a hot aisle |
| Leak map | Where is fluid? | Energize wet gear |

### B. Operational reports (steer *this week*)

| Report | Contents | Steering action |
|--------|----------|-----------------|
| Alarm summary | Top alarms, inhibits, MTTA | Fix chronic noise; clear inhibits |
| Maintenance calendar vs incidents | Overlaps | Stop blaming “random” blips |
| Path redundancy audit | Hosts with both PSUs on A | Dual-cord cleanup |
| Ticket aging | Hands / facilities aging | Staffing / process |

### C. Capacity & commercial reports (steer *this quarter*)

| Report | Contents | Steering action |
|--------|----------|-----------------|
| kW commit vs measured | Headroom by row/cage | Allow/deny installs; buy power |
| U / port / XC lead-time | Space + interconnect critical path | Order XC before iron arrives |
| Cooling headroom | Tons/kW, liquid SKU free | Gate AI density |
| PUE / energy | Facility overhead trend | Efficiency projects (not a substitute for A+B) |

Capacity conversation vocabulary: [Jobs/8](../Jobs/8_Capacity_Conversation.md).

### D. Steering loops (how humans use aggregates)

```text
Sense (meters/sensors)
  → Collect (EPMS/BMS/DCIM)
  → Aggregate (dashboards + scheduled reports)
  → Decide (capacity, change window, load shed, ticket class)
  → Act (hands, LOTO, order kW, fail over, freeze deploys)
  → Verify (did the aggregate move the way we expected?)
```

**Verify** is the confirmation step. If you “added capacity” but measured kW did not change as expected, something is wrong (wrong meter, wrong row, silent trip).

### Failure modes of the report/steer plane

| Failure | What you see | Wrong outcome |
|---------|--------------|---------------|
| Bad CT / calibration | Fiction load | Oversell or false panic |
| Clock skew | Impossible RCA timelines | Blame the wrong team |
| Inhibit left on | Green board, dead plant | Outage without page |
| Nameplate-only DCIM | “Capacity free” lie | Breaker trip on boot storm |
| No owner for report | Orphan PDF | Nobody steers |
| Steering without taxonomy | App on-call for UPS | Delay ([Jobs/6](../Jobs/6_Ticket_Taxonomy_And_Escalation.md)) |

### Global variants

Tool brands differ (Schneider, Vertiv, Siemens, custom DCIM, cloud-only views for hyperscalers). **Jobs transfer:** peak vs average, A/B balance, inhibit hygiene, join inventory to kW.

Hyperscale honesty: you may not see their EPMS—you still use region/AZ and *your* on-ramp metrics ([Jobs/12](../Jobs/12_Hyperscale_Ops_Honesty.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Before GPU PO | Pull peak kW + cooling type + floor load + XC lead time into one one-pager |
| Morning NOC | Mimic health → overnight alarm rollup → calendar |
| Incident | Freeze timeline from EPMS/BMS *and* IT observability |
| Weekly steering | Capacity exceptions list (rows >80% peak) |
| Monthly commercial | Commit vs measured; forecast installs |
| After change | Verify aggregates (load moved, alarms clear, inhibits off) |

**Staff checklist**

- Know where EPMS / BMS / DCIM live and who admins them  
- Prefer **measured peak** over nameplate sums for steering  
- Check A/B balance monthly  
- Treat inhibits as incidents if left on  
- Every steering decision names the report/screenshot used  
- After action: confirm the numbers moved  

**Confirm**

1. What is the difference between telemetry and steering?  
2. Name two aggregates that gate a dense GPU install.  
3. Why can DCIM “free capacity” be a lie?  
4. What must you do after a steering action?

**Disconfirm**

- PUE improving is **not** proof your cage is dual-fed.  
- IT APM dashboards are **not** a substitute for EPMS during a power event.  
- A single green overview tile is **not** a redundancy audit.

**Good:** measured aggregates → explicit decision → verify. **Bad:** vibe-based capacity; decorative DCIM; steering without closing the loop.

## References

- [Electrical/15 EPMS/BMS](../Electrical/15_EPMS_BMS_And_Power_Monitoring.md)  
- [The Green Grid — PUE](https://www.thegreengrid.org/)  
- [Uptime Institute](https://uptimeinstitute.com/)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Jobs/13](../Jobs/13_Reading_Dashboards_Reports_And_Steering.md)  
