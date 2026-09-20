# 21 — Correlation and dig methodology

[← Previous](./20_Sampling_Strategies.md) · [README](./README.md) · [Next →](./22_Instrumentation_Collectors_And_Backends.md)

## 1. Concepts — how humans actually debug

**Correlation** joins telemetry for one incident: time, service, labels, `trace_id`, deploy version. **Dig methodology** is the practiced order responders use under stress.

**Default dig path (rehearse it):**

```text
1. Symptom / page (which SLI burned?)
2. Service overview dashboard (RED + recent change)
3. Narrow: route, version, region, peer
4. Exemplar or search → trace
5. Trace → slow/error span
6. Span → logs by trace_id
7. Confirm fix / mitigate; note signal gaps
```

| Join key | Use |
|----------|-----|
| Time window | Always start bounded |
| service + env | Scope |
| trace_id | Hard join across pillars |
| version / deploy | Change correlation |
| peer name | Dependency blame |

**Disconfirm:** Starting in raw logs for every page ≠ methodology. Three tools with no shared IDs ≠ correlated. “Hop between UIs randomly” ≠ dig path.

**Confirm:** From your last page, can you recite steps 1–6 without inventing? Where does the chain break on your estate?

## 2. Advanced — exemplars, wide events, and drills

**Exemplars:** metrics backends that store example trace IDs on buckets make step 4 instant.

**Wide events / structured logs as spans:** some teams enrich logs to reduce trace need—still need join discipline.

**Incident drills:** game days that force metric→trace→log beats slideware ([28](./28_Shape_Scorecard_Drills_And_Maturity.md)).

**Failure mode:** Clock skew across systems breaks time joins—prefer `trace_id` over “about 14:03.”

## 3. Applications

**Staff checklist**

- Written dig path in every critical runbook  
- Overview dashboards link to trace/log search with query templates  
- Postmortems list “signal gap” when dig stalled  

**Exercise:** Time an on-call engineer from page to root span. Target: minutes, not archaeological digs.

## References

- [OpenTelemetry — Correlation](https://opentelemetry.io/docs/concepts/signals/)  
- [9 Dashboards / pages](./9_Dashboards_Alerts_And_Pages.md) · [18 Tracing](./18_Distributed_Tracing.md) · [16 Logs](./16_Structured_Logging.md)
