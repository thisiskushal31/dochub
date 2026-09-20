# 23 — Continuous profiling and events

[← Previous](./22_Instrumentation_Collectors_And_Backends.md) · [README](./README.md) · [Next →](./24_APM_As_A_Product_Shape.md)

## 1. Concepts — two amplifiers beside the three pillars

Metrics, logs, and traces are the core explain/detect set. Two common amplifiers:

### Continuous profiling

**Profiles** sample stack traces over time (CPU, heap, alloc) so you see *which code* burns resources—not only which service.

| Use when | Example |
|----------|---------|
| Latency or cost mystery inside one process | Hot method after deploy |
| Memory growth | Alloc sites |
| Complement traces | Trace finds service; profile finds function |

### Change / deploy events

**Events** mark *what changed*: deploys, config flags, scaling, certificate rotation. Overlay on dashboards so digs start with “did we ship?”

```text
SLO burn → dashboard → deploy marker at T-3m → suspect build → trace/profile
```

**Disconfirm:** Profiling alone ≠ monitoring program. Event spam from every CI job ≠ useful markers. Profiles without service attribution ≠ actionable.

**Confirm:** Do overview dashboards show deploy events? Can you open a CPU profile for a hot pod/process?

## 2. Advanced — cost, privacy, and product bundles

**Overhead:** continuous profiling must be sampled; watch agent cost on tiny instances.

**PII:** stack traces can include sensitive strings—treat access like logs.

**APM bundles** often include profiling ([24](./24_APM_As_A_Product_Shape.md))—evaluate as a job, not a checkbox.

**Failure mode:** Markers only in Slack, not in the metrics UI → responders never see them during pages.

## 3. Applications

**Staff checklist**

- Deploy events on critical service dashboards  
- Profile access path documented for on-call  
- Profiling enabled first where CPU/$ pain is real  

**Exercise:** Pick a latency regression; try profile vs trace-only. Which found the line of code faster?

## References

- [OpenTelemetry — Profiles (signal)](https://opentelemetry.io/docs/concepts/signals/)  
- [21 Dig path](./21_Correlation_And_Dig_Methodology.md) · [24 APM shape](./24_APM_As_A_Product_Shape.md)
