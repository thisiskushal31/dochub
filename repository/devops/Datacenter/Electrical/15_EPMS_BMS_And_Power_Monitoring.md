# 15 — EPMS, BMS, and power monitoring

[← Previous](./14_High_Density_48V_HVDC_And_Busbar.md) · [README](./README.md) · [Next: Harmonics →](./16_Power_Quality_And_Harmonics.md)

## 1. Concepts

**Plain language:** EPMS and BMS are the **instrument panels** of the building. EPMS focuses on electricity; BMS on cooling/leaks/temps (and sometimes power too). DCIM is often the **inventory + capacity clipboard** that joins racks to those numbers. Together they feed **reports** that people use to **steer** (allow installs, call facilities, shed load).

**EPMS** (electrical power monitoring system) watches electrical points: breakers, UPS, generators, meters, sometimes rack PDUs. **BMS** (building management system) watches broader facility: cooling, leaks, temps, sometimes overlaps power. **DCIM** tools may aggregate both for capacity and tickets.

You do not need every point—you need the **points that explain outages and capacity**. How aggregates become decisions: [Integration/11](../Integration/11_Aggregate_Telemetry_Reports_And_Steering.md).

### Where it sits

Metering **CTs/PTs** (current/voltage sensors) at boards; UPS/generator controllers; SNMP/Modbus/BACnet to servers; NOC dashboards; alarm servers with escalation.

### Points a tech actually watches

| Point | Why |
|-------|-----|
| Utility status / voltage | Incoming health |
| UPS load %, battery time, bypass | Autonomy and path |
| Generator run / fuel | Sustained outage readiness |
| Main and feeder breaker status | What tripped |
| Floor/row PDU kW | Row capacity |
| Rack PDU amps (if integrated) | Rack overload |
| Path A vs B imbalance | Hidden single-path stress |
| Alarm inhibit / maintenance flags | Blind spots during work |

**Disconfirm:** A green overview tile is **not** a dual-path proof. Nameplate kW in DCIM is **not** measured load.

**Confirm:** Which screen tells you minutes of battery left? Which aggregate (peak vs idle) should gate a new rack?

## 2. Advanced concepts

### Failure modes of monitoring itself

| Failure | Risk |
|---------|------|
| CT wiring wrong | Lies about load |
| Alarm storm | Real signal missed |
| Maintenance inhibit left on | No page on real fault |
| Clock skew | Impossible timelines in RCA |
| Only nameplate DCIM | Fiction capacity |

### How it connects to tickets and steering

Good ops maps alarms → **facility vs network vs customer IT**. Power alarms escalate to facilities/critical facilities; rack PDU outlet alarms may be customer or remote hands. Taxonomy: [Jobs/6](../Jobs/6_Ticket_Taxonomy_And_Escalation.md). Reading dashboards as a daily job: [Jobs/13](../Jobs/13_Reading_Dashboards_Reports_And_Steering.md).

**Steering examples from EPMS aggregates**

| Aggregate | Decision |
|-----------|----------|
| Peak row kW near commit | Block installs or buy power |
| A/B imbalance | Dual-cord audit |
| Bypass active after maintenance | Return to normal path before next utility event |
| Inhibit still on | Treat as incident until cleared |

### Redundancy claims vs telemetry

If the one-line says 2N but EPMS shows both PDUs on one UPS output meter, believe telemetry and investigate—not the brochure.

### Global variants

Protocols and platforms differ; the job is identical: accurate meters, actionable alarms, tested escalation, preserved history for RCA.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Capacity sale | Trend + peak, not instantaneous idle |
| Incident RCA | Align EPMS, UPS, and change tickets on one timeline |
| Rounds | Eye-readable critical mimics; know inhibit state |
| Colo customer | Request relevant metering in portal or reports |

**Staff checklist**

- Know primary EPMS/BMS login and who admins alarms  
- Verify A/B meters independently  
- After maintenance: clear inhibits  
- Retain event history per policy  
- Never trust a single green overview without drill-down  

**Good:** calibrated meters, clean alarm philosophy, tested pages. **Bad:** forever-inhibited points; decorative DCIM; no history.

## References

- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [IEC](https://www.iec.ch/) (metering / monitoring related standards families)  
- [The Green Grid — PUE](https://www.thegreengrid.org/)  
- [Integration/11 Aggregate telemetry, reports, and steering](../Integration/11_Aggregate_Telemetry_Reports_And_Steering.md)  
