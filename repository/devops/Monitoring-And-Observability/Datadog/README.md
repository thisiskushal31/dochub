# Datadog

[← Back to Monitoring & observability](../README.md) · [APM shape](../24_APM_As_A_Product_Shape.md) · [OSS/SaaS](../26_OSS_Managed_SaaS_And_Hybrid.md) · [Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)

## 1. Concepts

**Datadog** is a commercial **observability SaaS**: metrics, logs, traces/APM, RUM, synthetics, dashboards, and alerting in one vendor UI—typically via a host/container **agent** and language integrations (also OTLP in modern setups).

**Plain language:** Rent the whole glass cockpit—fast to adopt, bill scales with volume and cardinality.

**What for:** Unified APM + infra + logs without running Prom/Loki/Tempo yourself.  
**When:** Small platform team, need speed, org already standardizes on Datadog.  
**Why not:** Cost/cardinality at scale without governance; want PromQL-native OSS skill path; still must keep cloud **audit** trails ([Cloud/30](../../Cloud/30_Cloud_Observability_And_Audit_Doors.md)).

**Disconfirm:** Datadog is **not** a replacement for SLOs you refuse to define. It is **not** your IAM audit log.

**Confirm:** What is billed (hosts, custom metrics, ingest)? Where do pages go ([PagerDuty](../PagerDuty/README.md))?

## 2. Advanced concepts

| Topic | Judgment |
|-------|----------|
| **Custom metrics / tags** | Tag explosion = bill explosion—same cardinality lesson as Prom |
| **Agent + OTel** | Prefer one instrumentation path; avoid double counting |
| **Monitors vs SLOs** | Use product SLO objects; wire to pages sparingly |
| **Sensitive data** | Scrubbing / exclusion rules before ship |

### Failure modes

| Failure | What you see |
|---------|----------------|
| Unbounded tags | Surprise invoice |
| Dual agent + full OSS export | Duplicate telemetry, confusion |
| All-warning monitors | Alert fatigue |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First service | Official language integration + standard service tags |
| Hybrid | OTel → Datadog exporter *or* agent—not both blindly |
| Exit ramp | Keep OTel; point collector elsewhere later ([OpenTelemetry](../OpenTelemetry/README.md)) |

**Staff checklist:** tag policy; budget alerts; monitor ownership; cloud audit still enabled.

## References

- [Datadog documentation](https://docs.datadoghq.com/)  
- [OpenTelemetry](../OpenTelemetry/README.md) · [New Relic](../New_Relic/README.md) · [PagerDuty](../PagerDuty/README.md)  
