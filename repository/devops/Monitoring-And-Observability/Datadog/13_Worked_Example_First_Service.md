# 13 — Worked example — first service

[← Previous](./12_Operations_Pitfalls_And_Staff_Checklist.md) · [README](./README.md) · [Next →](./14_What_To_Enable_Next_And_When_Not.md)

## 1. Concepts — run one service end-to-end

Goal: **RED**, **traces**, **logs**, one **SLO**, one **page** for a single service (example name: `checkout`).

### Lab steps

1. **Account** — API key + site noted ([01](./01_What_Is_Datadog_And_When.md)).  
2. **Agent** — install on the host or K8s node pool ([03](./03_Install_Host_Container_And_Kubernetes.md)); confirm `datadog.agent.running`.  
3. **Unified tags** — `service:checkout`, `env:staging`, `version:<gitsha>` on process/pod and tracers ([02](./02_Architecture_Agent_And_Data_Plane.md)).  
4. **APM** — Single Step Instrumentation or language SDK; hit the app; open **APM → Traces** ([06](./06_APM_Tracing_And_Correlation.md)).  
5. **Logs** — `logs_enabled: true`; JSON logs; scrub secrets; confirm jump from trace → logs ([05](./05_Logs_Pipelines_And_Indexes.md)).  
6. **Metrics** — prefer runtime/integration metrics; any DogStatsD custom metrics use **bounded** tags only ([04](./04_Metrics_Tags_And_Cardinality_Cost.md)).  
7. **Dashboard** — latency, traffic, errors filtered by `service:checkout`.  
8. **SLO** — availability or latency target for that service ([08](./08_Monitors_SLOs_And_Dashboards.md)).  
9. **Monitor** — symptom threshold → PagerDuty/Slack (test channel first).  
10. **Drill** — break staging on purpose; page → monitor → dashboard → trace → log ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

### Done when

You can cause a failure in staging, get a page, and reach the offending span and log line in under fifteen minutes without guessing tag names.

**Disconfirm:** Skipping tags “until later.” Shipping to prod before the dig drill works. DogStatsD with unbounded `user_id` in the lab.

**Confirm:** Same `service`/`env`/`version` on metrics, traces, and logs? Page lands with a human owner?

## 2. Advanced — pitfalls during the lab

| Pitfall | Fix |
|---------|-----|
| Wrong site | Fix `DD_SITE` / `site` before debugging instrumentation |
| Agent up, no traces | Enable APM / SSI / SDK; restart app under tracer |
| Traces without logs | `logs_enabled`; JSON + injection; check scrubbing did not drop `trace_id` |
| Empty Service Catalog | Wait a few minutes; filter correct `env`; verify traffic |
| Flappy monitor | Widen threshold; add `for`-style delay; use staging traffic first |
| Cost spike in “lab” | Bound tags; exclusion filters; short retention on staging index |

Optional next: one synthetic check on the same journey ([07](./07_RUM_Synthetics_And_Client_Signals.md)); Profiler on the slowest endpoint ([18](./18_Profiler_Error_Tracking_Watchdog_And_Events.md)).

## 3. Applications — variants of the same lab

| Variant | Change |
|---------|--------|
| Kubernetes | Helm/Operator Agent; labels on Deployment; Admission Controller injects `DD_*` |
| OpenTelemetry | OTel SDK → Agent+DDOT; map resource attributes ([10](./10_OpenTelemetry_To_Datadog.md)) |
| Serverless | Lambda Extension + tracing instead of host Agent ([15](./15_Serverless_And_Cloud_Integrations.md)) |
| Production cutover | Same steps in prod `env`; pages to real on-call; Usage review after 7 days |

**Staff checklist after the lab:** runbook linked on the monitor; tag taxonomy recorded; who upgrades Agents; when to enable the next product from [14](./14_What_To_Enable_Next_And_When_Not.md).

## References

- [Getting started](https://docs.datadoghq.com/getting_started/) · [Getting started with APM](https://docs.datadoghq.com/getting_started/tracing/)  
- [14 What to enable next](./14_What_To_Enable_Next_And_When_Not.md)
