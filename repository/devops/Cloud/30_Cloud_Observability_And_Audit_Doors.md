# 30 — Managed observability on cloud (when which)

[← README](./README.md) · [IAM →](./15_Org_IAM_And_Identity_Federation.md) · [Landing zones →](./29_Landing_Zones_And_Org_Guardrails.md) · [FinOps →](./20_FinOps_And_Cost_Controls.md) · [Monitoring-And-Observability/](../Monitoring-And-Observability/README.md)

## Mental map

```text
Audit / control-plane trail     →  who changed IAM, VPC, buckets (security RCA)
Platform resource signals       →  managed metrics/logs/traces (CloudWatch / Monitoring / Monitor)
App / service telemetry         →  OTel → native sink OR Managed Prometheus OR SaaS APM
Paging / on-call                →  cloud alarms → PagerDuty-class ([Monitoring-And-Observability/PagerDuty](../Monitoring-And-Observability/PagerDuty/README.md))
```

*What to notice: **managed observability** is a cloud product family (like managed DB). SLO craft, PromQL, and OTel depth live in [Monitoring-And-Observability/](../Monitoring-And-Observability/README.md)—this chapter is **which product when** on a named cloud.*

## 1. Concepts

| Job | Meaning | Typical cloud fill |
|-----|---------|-------------------|
| **Audit / trail** | API and console mutations | CloudTrail / Cloud Audit Logs / Activity Log |
| **Infrastructure metrics** | CPU, disk, LB healthy hosts, quotas | CloudWatch Metrics / Cloud Monitoring / Azure Monitor Metrics |
| **Platform logs** | LB access, VPC flow, OS agents, service logs | CloudWatch Logs / Cloud Logging / Log Analytics |
| **Distributed traces** | Request spans across services | X-Ray / Cloud Trace / Application Insights |
| **Managed Prometheus** | Prom-compatible metrics without running Thanos yourself | AMP / Managed Service for Prometheus / Azure Monitor managed Prometheus |
| **Dashboards & alerts** | Graphs + fire conditions | Native consoles; Grafana Cloud / managed Grafana |
| **SaaS APM** | Vendor agents + UI (multi-cloud common) | Datadog / New Relic / … ([Named stack shapes](../Monitoring-And-Observability/25_Named_Stack_Shapes_ELK_PLG_LGTM.md)) |

### When which (durable decision table)

| If you need… | Prefer | Avoid |
|--------------|--------|-------|
| Answer “who opened that bucket / changed IAM?” | **Org-wide audit trail** first | Relying only on app APM |
| Default signal for VMs, LBs, managed DBs, functions | **Native cloud suite** (CloudWatch / Cloud Monitoring / Azure Monitor) | Ignoring native until an outage |
| PromQL + existing Grafana culture across clouds | **Managed Prometheus** (+ Grafana) | Standing a fragile self-hosted stack on day one without owners |
| Deep APM / multi-cloud one pane / rich UX budget | **SaaS APM** (Datadog, New Relic, …) | Buying SaaS *and* never turning on trails |
| Full control, open stack, platform team | Self-managed Prometheus/Grafana/Loki/Tempo ([Monitoring-And-Observability/](../Monitoring-And-Observability/README.md)) | Pretending “free” has no ops cost |
| Page a human | Alarm → notification channel → on-call tool | Email-only forever |

**Disconfirm:** A pretty dashboard is **not** an observability program. Managed Prometheus is **not** a substitute for CloudTrail. SaaS APM does **not** replace org audit logs.

**Confirm:** Where do IAM changes land? Where do app RED/USE metrics land? Who owns alarm noise and log spend ([20](./20_FinOps_And_Cost_Controls.md))?

Hall/plant screens are a different domain: [Datacenter Integration/11](../Datacenter/Integration/11_Aggregate_Telemetry_Reports_And_Steering.md).

## 2. Advanced concepts

### Cross-cloud product map

| Job | AWS | GCP | Azure | Others (examples) |
|-----|-----|-----|-------|-------------------|
| Audit | CloudTrail | Cloud Audit Logs | Activity Log | Provider audit; export to bucket/SIEM |
| Metrics | CloudWatch Metrics | Cloud Monitoring | Azure Monitor Metrics | OCI Monitoring; Aliyun/Tencent CMS-class |
| Logs | CloudWatch Logs | Cloud Logging | Log Analytics / Diagnostic settings | Provider log services |
| Traces | AWS X-Ray | Cloud Trace | Application Insights | Often OTel → backend |
| Managed Prometheus | Amazon Managed Service for Prometheus (AMP) | Managed Service for Prometheus | Azure Monitor managed service for Prometheus | Where offered |
| Managed Grafana | Amazon Managed Grafana | Grafana on GCP patterns / partner | Azure Managed Grafana | Where offered |
| Alarms | CloudWatch Alarms | Alerting | Metric alerts / Action groups | → SNS/Pub/Sub/Event Grid → Pager |

### Patterns that transfer

| Pattern | Why |
|---------|-----|
| Org/landing-zone baseline: trail ON → locked bucket | Tamper-resistant audit ([29](./29_Landing_Zones_And_Org_Guardrails.md)) |
| Native metrics for cloud SKUs + OTel for apps | Don’t scrape what the provider already emits poorly |
| Cardinality / retention budgets | Log and custom-metric spend is a top bill surprise |
| Alarm → ticket/page with owner | Orphan alarms = alert fatigue |
| Export trail + app logs to SIEM when security owns detection | [Security/](../Security/README.md) |

### Native vs managed Prom vs SaaS vs DIY

```text
Start simple:     Native suite + org trail + a few LB/ASG/Function alarms
Grow Prom culture: Managed Prometheus + Grafana (keep native for audit)
Multi-cloud APM:   SaaS agent (still keep trails per cloud)
Platform maturity: Self-hosted Observability stack with clear owners
```

### Failure modes

| Failure | Impact |
|---------|--------|
| Trail disabled / single-region only | Blind to attacks and bad changes |
| VPC flow / debug logs everywhere unbounded | Bill shock ([20](./20_FinOps_And_Cost_Controls.md)) |
| Metrics without owners | Alarm fatigue; ignored pages |
| Only SaaS APM, no audit | Cannot answer control-plane “who” |
| DIY Prometheus with no on-call for the stack | Observability outage during app outage |

### IAM for observability

Who may read logs/metrics, put metric filters, or disable trails is an IAM job ([15](./15_Org_IAM_And_Identity_Federation.md)). Least privilege: apps write telemetry; few humans can delete trails.

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| First production estate | Org trail + native metrics/logs + alarms on LB health and error rate |
| K8s-heavy platform | Managed Prometheus + Grafana; keep native for node/control-plane extras |
| Multi-cloud company | SaaS APM for apps; **per-cloud trails** still mandatory |
| Serverless / AI glue | Native function/service metrics + traces; watch token/GPU cost separately ([33](./33_AI_And_ML_Platforms_On_Cloud.md)) |
| Security RCA | Trail → identity → resource ([Security/](../Security/README.md)) |
| Deploy verify | LB/app signals gate rollout ([28](./28_Deployment_Shapes_On_Cloud.md), [34](./34_Multi_Tier_And_Reference_Topologies.md)) |

**Staff checklist**

- Org-level audit on and alerted if delivery fails  
- Native suite enabled for core SKUs (compute, LB, DB, functions)  
- When-which chosen: native vs Managed Prom vs SaaS vs DIY  
- Retention and log volume budgeted  
- Alarms owned; page path tested  
- Door to [Monitoring-And-Observability/](../Monitoring-And-Observability/README.md) for SLO/OTel/tool depth  

**Good:** locked trail + native platform signals + deliberate app telemetry sink. **Bad:** dashboards tourism; trails off; unbounded flow logs.

## References

- [CloudWatch](https://docs.aws.amazon.com/cloudwatch/) · [CloudTrail](https://docs.aws.amazon.com/cloudtrail/) · [X-Ray](https://docs.aws.amazon.com/xray/) · [AMP](https://docs.aws.amazon.com/prometheus/) · [Managed Grafana](https://docs.aws.amazon.com/grafana/)  
- [Cloud Monitoring](https://cloud.google.com/monitoring/docs) · [Cloud Logging](https://cloud.google.com/logging/docs) · [Cloud Trace](https://cloud.google.com/trace/docs) · [Cloud Audit Logs](https://cloud.google.com/logging/docs/audit) · [Managed Prometheus](https://cloud.google.com/stackdriver/docs/managed-prometheus)  
- [Azure Monitor](https://learn.microsoft.com/azure/azure-monitor/) · [Activity Log](https://learn.microsoft.com/azure/azure-monitor/essentials/activity-log) · [Application Insights](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview) · [Azure Managed Grafana](https://learn.microsoft.com/azure/managed-grafana/)  
- [Monitoring-And-Observability/](../Monitoring-And-Observability/README.md) · [Security/](../Security/README.md)  
