# 05 — Logs, pipelines, and indexes

[← Previous](./04_Metrics_Tags_And_Cardinality_Cost.md) · [README](./README.md) · [Next →](./06_APM_Tracing_And_Correlation.md)

## 1. Concepts — getting logs into Datadog

1. Install the Agent ([03](./03_Install_Host_Container_And_Kubernetes.md)).  
2. Set `logs_enabled: true` (or `DD_LOGS_ENABLED=true`).  
3. Configure sources, then process in the app.

| Source | Typical approach |
|--------|------------------|
| Host files | Tail paths; multiline rules |
| Docker / K8s | stdout/stderr via Agent; Autodiscovery labels |
| Cloud / Lambda | Forwarder / Extension / cloud integrations ([15](./15_Serverless_And_Cloud_Integrations.md)) |
| Existing shippers | Fluent Bit, rsyslog, … → Datadog intake |

In the UI: **pipelines** (processors → attributes/facets), **indexes** (retention, exclusion filters), scrubbing for secrets/PII.

JSON logs get reserved-attribute handling (`timestamp`, `status`, `host`, `service`, `message`, …). Prefer structured JSON from the app ([parent 16](../16_Structured_Logging.md)). Correlate with APM via SDK log injection + unified `service`/`env`/`version` ([02](./02_Architecture_Agent_And_Data_Plane.md)).

**Disconfirm:** Index everything at full retention. Fix PII after it lands in SaaS. Unstructured `fmt.Println` forever.

**Confirm:** Exclusion filters for debug noise? Who can edit pipelines (RBAC)? Scrubbing rules before prod?

## 2. Advanced — pipelines, volume, dual-ship

Keep pipelines lean (official guidance on the order of ≤20 processors per pipeline and ≤10 grok rules per grok processor—abusive configs can be disabled). Prefer JSON parse over heavy grok when you control the app.

**Exclusion filters** and sampling drop noise before index cost. Archives / rehydration support cold storage—budget restore ([parent 30](../30_Telemetry_Cost_And_FinOps.md)).

**Observability Pipelines** reshape or dual-ship before/alongside Datadog when Agent-side control is not enough ([22](./22_Observability_Pipelines.md)). **Sensitive Data Scanner** discovers/redacts sensitive fields at scale ([20](./20_Security_Products.md)).

In Kubernetes, a JSON `host`/`hostname` attribute can override Agent hostname for that log—know your schema.

## 3. Applications — use cases

| Use case | Pattern |
|----------|---------|
| First service logs | Enable Agent logs for one `service`; JSON + `trace_id`; staging only first |
| Cost control | Exclusion on `status:debug`; shorter retention for noisy indexes |
| Security / compliance | Scrub + SDS before broad ingest; dual-ship audit-critical logs if required |
| Dig path | From a failing trace, jump to logs; confirm same `service`/`env`/`version` |

**Staff checklist**

1. Scrubbing rules before prod traffic.  
2. Index retention + exclusion documented.  
3. Pipeline edit permissions limited.  
4. Standard `service`/`env`/`version` on every log line.

## References

- [Logs](https://docs.datadoghq.com/logs/) · [Log collection](https://docs.datadoghq.com/logs/log_collection/) · [Pipelines](https://docs.datadoghq.com/logs/log_configuration/pipelines/)  
- [06 APM](./06_APM_Tracing_And_Correlation.md)
