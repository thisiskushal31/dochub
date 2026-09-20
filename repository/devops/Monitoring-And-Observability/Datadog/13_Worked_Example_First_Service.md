# 13 — Worked example — first service

[← Previous](./12_Operations_Pitfalls_And_Staff_Checklist.md) · [README](./README.md) · [Next →](./14_What_To_Enable_Next_And_When_Not.md)

## 1. Concepts — run one service end-to-end

Goal: **RED**, **traces**, **logs**, one **SLO**, one **page** for a single service (e.g. `checkout`).

### Steps

1. **Account** — API key + site noted ([01](./01_What_Is_Datadog_And_When.md)).  
2. **Agent** — install on the host or K8s node pool ([03](./03_Install_Host_Container_And_Kubernetes.md)); confirm `datadog.agent.running`.  
3. **Unified tags** — `service:checkout`, `env:staging`, `version:<gitsha>` on process/pod and tracers ([02](./02_Architecture_Agent_And_Data_Plane.md)).  
4. **APM** — Single Step Instrumentation or language SDK; hit the app; open **APM → Traces** ([06](./06_APM_Tracing_And_Correlation.md)).  
5. **Logs** — `logs_enabled: true`; JSON logs; scrub secrets; confirm jump from trace → logs ([05](./05_Logs_Pipelines_And_Indexes.md)).  
6. **Metrics** — use runtime/integration metrics first; any DogStatsD custom metrics use **bounded** tags only ([04](./04_Metrics_Tags_And_Cardinality_Cost.md)).  
7. **Dashboard** — latency, traffic, errors filtered by `service:checkout`.  
8. **SLO** — availability or latency target for that service ([08](./08_Monitors_SLOs_And_Dashboards.md)).  
9. **Monitor** — symptom threshold → PagerDuty/Slack.  
10. **Drill** — break staging on purpose; page → monitor → dashboard → trace → log ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

### Done when

You can cause a failure in staging, get a page, and reach the offending span and log line in under fifteen minutes without guessing tag names.

## References

- [Getting started](https://docs.datadoghq.com/getting_started/) · [Getting started with APM](https://docs.datadoghq.com/getting_started/tracing/)  
- [14 What to enable next](./14_What_To_Enable_Next_And_When_Not.md)
