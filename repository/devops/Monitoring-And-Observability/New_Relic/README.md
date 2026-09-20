# New Relic

[← Back to Monitoring & observability](../README.md) · [APM shape](../24_APM_As_A_Product_Shape.md) · [OSS/SaaS](../26_OSS_Managed_SaaS_And_Hybrid.md) · [Datadog](../Datadog/README.md)

## 1. Concepts

**New Relic** is a commercial **observability / APM SaaS**: application performance, metrics, logs, traces, dashboards, and alerting—agent- or OTLP-based instrumentation into New Relic’s platform.

**Plain language:** Another full rented cockpit—strong APM heritage; choose deliberately vs Datadog/OSS, don’t run both as primary.

**What for:** APM-first commercial observability with broad language support.  
**When:** Org standard is New Relic; need fast APM without self-hosting Tempo/Jaeger.  
**Why not:** Already all-in on Datadog or OSS Grafana stack; cost without ingest governance; never drop cloud audit ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)).

**Disconfirm:** Two SaaS APMs on one service is **not** “redundancy.” New Relic is **not** PagerDuty.

**Confirm:** Primary vs secondary tool? NRQL (or product query) owner for SLOs?

## 2. Advanced concepts

| Topic | Judgment |
|-------|----------|
| **APM agent vs OTel** | Prefer one path; OTel helps exit/migrate |
| **Cardinality / attribute rules** | Drop high-churn attributes at ingest |
| **Alert policies** | Symptom-based; link runbooks |
| **Vs Datadog** | Pick one primary SaaS ([3](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)) |

### Failure modes

| Failure | What you see |
|---------|----------------|
| Over-instrumented attributes | Cost + noisy UI |
| Missing change tracking | Hard RCA after deploy |
| Pages without ownership | Fatigue |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First app | Official agent or OTLP → New Relic; define golden signals |
| Migrate | OTel dual-export briefly; cut old agent |
| Pages | New Relic → [PagerDuty](../PagerDuty/README.md) |

**Staff checklist:** ingest budgets; attribute allowlist; one primary APM; audit logs remain in cloud.

## References

- [New Relic docs](https://docs.newrelic.com/)  
- [OpenTelemetry](../OpenTelemetry/README.md) · [Datadog](../Datadog/README.md) · [PagerDuty](../PagerDuty/README.md)  
