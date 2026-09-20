# 05 — Logs, pipelines, and indexes

[← Previous](./04_Metrics_Tags_And_Cardinality_Cost.md) · [README](./README.md) · [Next →](./06_APM_Tracing_And_Correlation.md)

## 1. Concepts — how to get logs in

1. Install the Agent ([03](./03_Install_Host_Container_And_Kubernetes.md)).  
2. Set `logs_enabled: true` (or `DD_LOGS_ENABLED=true`) in Agent config.  
3. Configure sources:

| Source | Typical approach |
|--------|------------------|
| Host files | Tail paths; multiline rules |
| Docker / K8s | stdout/stderr via Agent; Autodiscovery labels |
| Cloud / Lambda | Forwarder / cloud integrations |
| Existing shippers | Fluent Bit, rsyslog, … → Datadog intake |

Then in the app: **pipelines** (processors → attributes/facets), **indexes** (retention, exclusion filters), and scrubbing for secrets/PII.

JSON logs get reserved-attribute handling (`timestamp`, `status`, `host`, `service`, `message`, …). Prefer structured JSON from the app ([parent 16](../16_Structured_Logging.md)).

Correlate with APM: inject `trace_id` / use SDK log injection + unified `service`/`env`/`version` ([02](./02_Architecture_Agent_And_Data_Plane.md)).

**Disconfirm:** Index everything at full retention. Fix PII after it lands in SaaS.

**Confirm:** Exclusion filters for debug noise? Who can edit pipelines (RBAC)?

## 2. Advanced

Keep pipelines lean (official guidance: on the order of ≤20 processors per pipeline and ≤10 grok rules per grok processor, or Datadog may disable abusive configs). Observability Pipelines can reshape or dual-ship before/alongside Datadog when you outgrow Agent-only collection ([14](./14_What_To_Enable_Next_And_When_Not.md)). Archives / rehydration support cold storage patterns—budget them ([parent 30](../30_Telemetry_Cost_And_FinOps.md)).

## 3. Applications — what to do

1. Enable logs on one service only.  
2. Add scrubbing rules before prod traffic.  
3. Set index retention + exclusion for `status:debug` (or equivalent).  
4. From a trace, jump to related logs and confirm tags match.

## References

- [Logs](https://docs.datadoghq.com/logs/) · [Log collection](https://docs.datadoghq.com/logs/log_collection/) · [Pipelines](https://docs.datadoghq.com/logs/log_configuration/pipelines/)  
- [06 APM](./06_APM_Tracing_And_Correlation.md)
