# 23 — Classic ELK setup and monitoring placement

[← Previous](./22_CI_CD_Observability.md) · [README](./README.md)

## 1. Concepts — ELK as a shape, Observability as the job

**ELK** historically meant **E**lasticsearch + **L**ogstash + **K**ibana. **Beats** (Filebeat, Metricbeat, …) extended the shipper layer; today greenfield Observability prefers **Elastic Agent + Fleet** (and **EDOT**), with Logstash/Beats as brownfield literacy ([01](./01_What_Is_Elastic_Observability_And_When.md), [04](./04_Agent_Fleet_Beats_And_Logstash.md)).

This chapter answers two practical questions:

1. **How do you stand up a classic / Stack monitoring setup?**  
2. **Where does Elastic sit in a monitoring architecture** relative to Prometheus, Loki, Datadog, and pages?

### Minimal classic ELK (lab / brownfield)

| Step | What you run | Why |
|------|--------------|-----|
| 1 | **Elasticsearch** cluster (1+ nodes) | Index and search |
| 2 | **Kibana** pointed at that cluster | Dig UI |
| 3a | **Filebeat** (or Agent) on hosts | Ship logs |
| 3b | Optional **Logstash** | Parse/enrich/multi-dest when Beats/Agent aren’t enough |
| 4 | Index templates + **ILM** | Retention before disk fills ([11](./11_ILM_Data_Tiers_Retention_And_Cost.md)) |
| 5 | Discover saved search + one alert | Prove dig → page ([09](./09_Alerting_SLOs_And_Incident_Management.md), [21](./21_Discover_ESQL_And_Kibana_Digs.md)) |

**Modern equivalent (preferred greenfield):** deploy ECH / Serverless / ECK ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)) → **Fleet** policy with system/logs integrations → optional APM/EDOT ([07](./07_APM_Tracing_And_RUM.md), [10](./10_OpenTelemetry_To_Elastic.md)) → ILM → SLO/alert.

**Plain language:** ELK is the old wiring diagram; Observability is the job. Same warehouse—don’t invent a second dig plane.

### Where Elastic sits in monitoring setups

```text
  Apps / hosts / K8s / cloud
           │
    ┌──────┼──────────────────────┐
    │      │                      │
    ▼      ▼                      ▼
 Prometheus   Elastic (logs/APM)   Cloud audit
 (metrics)    Agent/EDOT/Logstash  (CloudTrail…)
    │              │
    ▼              ▼
 Alertmanager   Kibana rules
    │              │
    └──────┬───────┘
           ▼
     PagerDuty / chat
```

| Signal | Common primary | Elastic’s role |
|--------|----------------|----------------|
| **Metrics / PromQL SLOs** | [Prometheus](../Prometheus/README.md) (+ Grafana) | Optional; Hosts metrics when you standardize on Elastic |
| **Full-text logs** | Elastic **or** [Loki](../Loki/README.md) | Elastic when search/SIEM-adjacent wins |
| **Traces** | Elastic APM/EDOT **or** Tempo/Jaeger/SaaS | One primary ([07](./07_APM_Tracing_And_RUM.md)) |
| **Pages** | [PagerDuty](../PagerDuty/README.md) | Elastic alerts are detectors, not the router |
| **Cloud audit** | Cloud-native sinks | Selective ingest only ([15](./15_Cloud_Integrations.md)) |

**Disconfirm:** “We installed ELK” ≠ observability program. Running ELK **and** Loki **and** Datadog for the same logs ≠ HA. Kibana dashboards ≠ SLO ownership ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)).

**Confirm:** Is Elastic primary for logs, APM, or both? What’s explicitly *not* in Elastic? Who owns Stack upgrades vs app agents?

## 2. Advanced — setup pitfalls and hybrid estates

**Self-managed ELK checklist (ops).** JVM heap, disk watermarks, replica count, security (TLS + users), snapshot repo, Kibana encryption keys, Fleet Server if using Agent centrally ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md), [12](./12_Operations_Pitfalls_And_Staff_Checklist.md)).

**Logstash placement.** Use when you need Kafka bridges, multi-destination fan-out, or transforms no integration covers—not as the default for every file ([04](./04_Agent_Fleet_Beats_And_Logstash.md)).

**Beats → Agent.** Inventory Filebeat/Metricbeat; migrate per Fleet guides; dual-ship briefly then retire Beats.

**Hybrid with Prometheus.** Common healthy pattern: Prom for scrape-native RED/USE; Elastic for logs (+ optional APM). Publish the dig matrix so on-call doesn’t open three UIs guessing ([25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)).

**Hybrid with Datadog/AppD.** One primary APM/logs SaaS **or** Elastic—not two full agents on every JVM ([AppDynamics](../AppDynamics/README.md), [Datadog](../Datadog/README.md)).

**Security solution.** Elastic Security can share the cluster—separate RBAC and on-call ([18](./18_Security_SIEM_Literacy.md)).

**Failure modes**

| Failure | What you see |
|---------|----------------|
| No ILM on classic indices | Disk full; emergency deletes |
| Mapping explosion from Logstash JSON | Rejected docs; red cluster |
| Split digs (ELK + Loki) | Slow incidents |
| Alert in Kibana, no page route | Silent outages |

## 3. Applications — concrete setups

| Goal | Pattern |
|------|---------|
| Laptop lab | Docker Compose ES+Kibana → Filebeat → Discover (not prod) |
| Brownfield ELK | Freeze new Beats; add Fleet Agent beside; ILM; migrate |
| Greenfield Observability | ECH/Serverless Complete → Agent/EDOT → APM+logs → SLO ([13](./13_Worked_Example_First_Service.md)) |
| Metrics already on Prom | Keep Prom; Elastic for logs only; one page aggregator |
| Full Elastic stack monitoring | Agent + APM + synthetics; Prom optional |

**Staff checklist:** draw the monitoring topology (one page); name primary for logs/metrics/traces/pages; ELK vs Agent decision written; ILM before first prod load; upgrade owner for ES/Kibana; practice dig Discover → alert → PagerDuty.

## References

- [The Elastic Stack](https://www.elastic.co/docs/get-started/the-stack) · [Deployment options](https://www.elastic.co/docs/get-started/deployment-options) · [Self-managed](https://www.elastic.co/docs/deploy-manage/deploy/self-managed) · [Ingest tools](https://www.elastic.co/docs/manage-data/ingest) · [Named stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)  
- [03 Deploy](./03_Deploy_Self_Managed_Cloud_And_Serverless.md) · [04 Agent/Beats/Logstash](./04_Agent_Fleet_Beats_And_Logstash.md) · [13 Worked example](./13_Worked_Example_First_Service.md) · [README](./README.md)
