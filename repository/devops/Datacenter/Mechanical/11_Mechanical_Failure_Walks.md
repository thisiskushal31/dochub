# 11 — Mechanical failure walks

[← Previous](./10_Humidity_Water_Treatment_And_Plumbing.md) · [README](./README.md) · [Next: Commissioning →](./12_Commissioning_Mechanical.md)

## 1. Concepts

A **mechanical failure walk** traces heat and fluid when a component fails—what alarms fire, what IT feels, and what humans do.

Pair with electrical walks ([Electrical/17](../Electrical/17_Power_Path_Failure_Walks.md)). Many “mystery” outages are power+cooling sequences.

### Method

1. Name the failed object  
2. Find zone served (racks/rows)  
3. Expected BMS alarms  
4. Time-to-throttle / shutdown estimate  
5. Auto actions (start lag CRAH, cutover)  
6. Human actions if auto fails  
7. Interaction with power (fans/pumps on generator?)  

## 2. Advanced concepts

### Walk library (mechanical)

| Failure | Expected good outcome | Classic bad outcome |
|---------|----------------------|---------------------|
| **Lose one CRAH in N+1 row** | Neighbors pick up load; inlets stable | Already at N; hot aisle spike |
| **CRAH fan fail** | Alarm; lag unit start | Alarm inhibited; silent heat |
| **Chiller trip** | Spare chiller starts; CHW recovers | No spare; hall warms in minutes–tens of minutes |
| **CHW pump fail** | Redundant pump auto | Manual-only; delay |
| **Tower cell fail in heat wave** | Remaining cells hold design | Design day exceeded; cascading chiller trips |
| **Containment door propped + CRAH down** | — | Accelerated inlet failure |
| **CDU pump fail** | Alarm; IT throttle or redundant CDU | No residual air budget; rapid GPU shutdown |
| **Liquid leak** | Detect → isolate → controlled power down | Energized soak |
| **Humidifier flood** | Pan switch trips water | Underfloor spread |
| **Fire alarm HVAC shutdown** | Smoke control as designed | Unexpected thermal event during drill |

### Independence checklist

- N+1 CRAHs on one chilled-water header is not full independence  
- Liquid row with zero air backup is a different risk profile—document it  
- Mechanical on utility-only power fails when generators forget pumps  

### How it connects

Jobs/NOC taxonomy: [Jobs](../Jobs/README.md). Multi-domain narratives: [Integration](../Integration/README.md).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Tabletop | Walk chiller trip + utility blip together |
| Dense GPU row | Walk CDU fail with measured residual CRAH kW |
| After maintenance | Walk “valve left closed” before declaring success |
| Colo | Walk landlord CRAH loss → your inlet alarms → ticket path |

**Staff checklist**

- Serving map: rack → CRAH/CDU → plant  
- Know which failures page NOC vs facilities only  
- Practice times: how fast inlets climb in *your* density  
- Verify lag equipment in auto after tests  
- Never prop doors during known mechanical work  

**Good:** written walks with time estimates and alarm IDs. **Bad:** first containment+chiller dual failure is live production.

## References

- [ASHRAE TC 9.9](https://www.ashrae.org/technical-resources/bookstore/datacom-series)  
- [Uptime Institute Tier Standard](https://uptimeinstitute.com/tiers)  
- [TIA-942](https://tiaonline.org/standard/tia-942/)  
- [The Green Grid — PUE](https://www.thegreengrid.org/)  
