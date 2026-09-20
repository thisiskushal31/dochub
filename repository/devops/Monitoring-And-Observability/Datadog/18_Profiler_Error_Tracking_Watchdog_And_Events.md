# 18 — Profiler, Error Tracking, Watchdog, and events

[← Previous](./17_Network_USM_And_GPU_Monitoring.md) · [README](./README.md) · [Next →](./19_Incident_Workflows_And_Collaboration.md)

## 1. Concepts

### Continuous Profiler

Always-on **code-level** CPU/memory profiles beside APM—find hot methods after Trace Explorer shows “this endpoint is slow.”

### Error Tracking

Groups exceptions across **APM, Logs, and RUM** into issues you can triage, assign, and trend—less “same stack trace 10k times in Explore.”

### Watchdog

Built-in **AI engine**: baselines, anomaly/forecast/outlier style insights, faulty deployment detection, investigation context in explorers. No separate install—tune algorithms when defaults page too often.

### Events

Change and system events (deploys, Agent, integrations) as a timeline to correlate with metric spikes. Feed meaningful deploy events from CI/CD.

**Disconfirm:** Profiler without a latency symptom to chase. Watchdog pages as the only alert strategy.

**Confirm:** Error Tracking ownership (SRE vs app team)? Deploy events emitted on every release?

## 2. Advanced

Dynamic Instrumentation (custom spans/probes from UI) pairs with profiler/APM for production digs—gate who can use it. Watchdog faulty deployment detection needs good `version` tags ([02](./02_Architecture_Agent_And_Data_Plane.md)).

## 3. Applications — what to do

1. For the slowest APM endpoint: open Profiler; fix one hot path.  
2. Enable Error Tracking for that service’s APM + logs.  
3. Review Watchdog insights weekly; promote durable ones into explicit monitors.

## References

- [Profiler](https://docs.datadoghq.com/profiler/) · [Error Tracking](https://docs.datadoghq.com/error_tracking/) · [Watchdog](https://docs.datadoghq.com/watchdog/) · [Events](https://docs.datadoghq.com/events/)  
- [19 Incident / workflows](./19_Incident_Workflows_And_Collaboration.md)
