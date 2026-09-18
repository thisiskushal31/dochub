# 0 — How to read this Observability track

[README](./README.md) · [Metrics →](./1_Monitoring_And_Metrics.md)

## 1. Concepts — who this is for

You do **not** need an SRE title to learn this folder. You need the habit: **signals tell a story**; tools are how you store and query those signals.

**Observability** means you can ask new questions about a running system using the data it emits—metrics, logs, traces—and route humans when something needs a person ([PagerDuty](./PagerDuty/README.md)).

Managed cloud product *choice* (CloudWatch vs Managed Prometheus vs SaaS): [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md). On-call *practice* (schedules, blameless, fatigue): [Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md). Packet capture: Networks Observability. This folder is **SLO craft, signal design, and tool literacy**.

### How to read any chapter

1. **Concepts** — what the job is, why it exists, mental model.  
2. **Disconfirm** — myths (especially “more dashboards = more reliability”).  
3. **Advanced** — quirks, cardinality, failure modes.  
4. **Confirm** — if you cannot answer, re-read Concepts.  
5. **Applications** + staff checklist — practice.  
6. **References** — official docs, not blogs.

### The one rule

```text
Concept chapters (1–2)  →  learn the signal jobs once (metrics, logs, traces, SLO)
Tools index (3)         →  pick a stack shape (when / why not)
Tool folders            →  what / when / why not for THAT product
```

**What this folder is *not*:** a cert dump, an install encyclopedia, or a second home for cloud audit trails. **What it *is*:** enough judgment to choose signals and tools, then dig API depth in official docs.

**Disconfirm:** Buying Datadog *and* New Relic *and* a full Prometheus stack for the same services is **not** “mature.” Skipping SLOs because “we have dashboards” is **not** observability.

**Confirm:** Name the four golden signals. Say when a page should fire vs when a dashboard is enough. Point at where OTel ends and the backend begins.

### Suggested first stretch

| Step | Read |
|------|------|
| 1 | This file + [1 Metrics & SLO](./1_Monitoring_And_Metrics.md) |
| 2 | [2 Logs & traces](./2_Logging_And_Tracing.md) |
| 3 | [3 Tools index](./3_Observability_Tools.md) (stack when / why not) |
| 4 | [Prometheus](./Prometheus/README.md) → [Grafana](./Grafana/README.md) → [OpenTelemetry](./OpenTelemetry/README.md) |
| Then | Loki / Tempo / Jaeger / Elastic / SaaS as your estate uses them; [PagerDuty](./PagerDuty/README.md) for paging |

## 2. Quality bar

| Rule | Meaning |
|------|---------|
| **Define on first use** | Acronym + one plain sentence |
| **Signal first / tool second** | Job before logo |
| **Disconfirm / Confirm** | Myths explicit; self-checks short |
| **Failure mode** | What breaks and what you see (cardinality, missing spans, alert storms) |
| **Door, don’t duplicate** | Cloud/30, Methodologies/3, Networks, CiCd synthetics keep their depth |
| **What / when / why not** | Every tool folder; docs = API depth after you chose |
| **Official References** | Vendor / project docs hubs only |

### What this folder is not

Not kubeadm. Not Terraform tutorials. Not colo plant ops. Not synthetic/e2e encyclopedia (→ CiCd verify). Not “collect everything forever.”

## 3. Applications

**Staff checklist for newcomers**

- Can explain metric vs log vs trace for one user request  
- Can draft one SLI and one SLO for a service they own  
- Knows where pages go ([PagerDuty](./PagerDuty/README.md)) and where practice lives ([Methodologies/3](../Methodologies/3_Team_Patterns_SRE_Incident.md))  
- Knows managed cloud sinks are chosen in [Cloud/30](../Cloud/30_Cloud_Observability_And_Audit_Doors.md)  

**Good:** actionable alerts + correlated labels. **Bad:** screenshot tourism and unowned dashboards.

## References

- [Google SRE — Monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/)  
- [OpenTelemetry docs](https://opentelemetry.io/docs/)  
- [Cloud/30 — Managed observability doors](../Cloud/30_Cloud_Observability_And_Audit_Doors.md)  
