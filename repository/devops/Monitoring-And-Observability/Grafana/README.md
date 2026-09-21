# Grafana

[← Back to Monitoring & observability](../README.md) · [Named stacks](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md) · [Prometheus](../Prometheus/README.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md) · [Mimir](../Mimir/README.md) · [OpenTelemetry](../OpenTelemetry/README.md) · [Datadog](../Datadog/README.md) · [PagerDuty](../PagerDuty/README.md)

**Grafana** is the **pane of glass**—query, visualize, explore, and optionally alert on metrics, logs, traces, and profiles **wherever they are stored**. It is **not** the metrics database. Collect with **Grafana Alloy** (greenfield) or still meet **Grafana Agent** (Static / Flow / Operator) on brownfield paths; store in **Mimir** / Prometheus, **Loki**, **Tempo** (+ optional **Pyroscope**); dig in Grafana.

```text
Apps · nodes · exporters · OTel SDKs
                 │
                 ▼
   Grafana Alloy  (preferred)     Grafana Agent (legacy / EOL)
   collect · process · export     Static | Flow | Operator
                 │
      ┌──────────┼──────────┬────────────┐
      ▼          ▼          ▼            ▼
   Mimir/Prom   Loki      Tempo     Pyroscope
      └──────────┼──────────┴────────────┘
                 ▼
              Grafana
   datasources · Explore · dashboards · alerting*
```

\\*Alerting may live in Grafana Alerting **or** Prometheus/Alertmanager—pick one page path per symptom ([08](./08_Alerting_Boundaries_And_Access_Model.md), [15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md)).

### How to use this folder

| Question | Start |
|----------|--------|
| What is Grafana / when? | [01](./01_What_Is_Grafana_And_When.md) → [03](./03_LGTM_Stack_And_Collector_Generations.md) |
| How does the UI / stack fit? | [02](./02_Architecture_UI_Datasources_And_Plugins.md) → [04](./04_Grafana_Alloy_Concepts.md)–[08](./08_Alerting_Boundaries_And_Access_Model.md) |
| How do I stand it up and dig? | [09](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md) → [12](./12_Worked_Example_First_Grafana_Dig.md) |
| Scale, migrate, as-code, access? | [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)–[15](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md) |
| What else after the core loop? | [16](./16_What_To_Enable_Next_And_When_Not.md) |

Parent `0–37` = monitoring/observability **jobs**. This folder = **Grafana the product** (UI + collectors). Backend depth: [Prometheus](../Prometheus/README.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md) · [Mimir](../Mimir/README.md). Pages: [PagerDuty](../PagerDuty/README.md). SaaS peer: [Datadog](../Datadog/README.md).

| | |
|--|--|
| **What for** | One Explore surface across PromQL / LogQL / TraceQL; LGTM or Grafana Cloud |
| **When** | Mixed backends, Grafana culture, or Cloud-hosted LGTM |
| **Why not** | Single SaaS APM already owns digs and you refuse a second pane; dashboard theatre with no SLOs |

**Spectrum note:** Prefer **Alloy** for all new work. **Grafana Agent reached EOL 2025-11-01**—teach Static/Flow/Operator for brownfield migrate, not greenfield.

### Progression (staircase across chapters)

| Phase | Chapters | Outcome |
|-------|----------|---------|
| **A. Basic concepts** | [01](./01_What_Is_Grafana_And_When.md)–[03](./03_LGTM_Stack_And_Collector_Generations.md) | Fit; UI model; LGTM + Alloy vs Agent generations |
| **B. Advanced concepts** | [04](./04_Grafana_Alloy_Concepts.md)–[08](./08_Alerting_Boundaries_And_Access_Model.md) | Collector/topology/dig/alert-access mental models |
| **C. Basic implementation** | [09](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md)–[12](./12_Worked_Example_First_Grafana_Dig.md) | Deploy; wire; first board/alert; worked dig |
| **D. Advanced implementation** | [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)–[16](./16_What_To_Enable_Next_And_When_Not.md) | Scale/migrate; GitOps; IRM/SSO/RBAC; enablement |

**Suggested core path:** `01 → 03 → 09 → 10 → 12`, open [05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md) if you inherit Agent, then [16](./16_What_To_Enable_Next_And_When_Not.md).

## Chapters

### A — Basic concepts

| # | File | Focus |
|---|------|--------|
| 01 | [What is Grafana and when](./01_What_Is_Grafana_And_When.md) | Fit; vs Datadog/Kibana/cloud consoles |
| 02 | [Architecture — UI, datasources, plugins](./02_Architecture_UI_Datasources_And_Plugins.md) | Orgs, Explore vs boards, folders |
| 03 | [LGTM stack and collector generations](./03_LGTM_Stack_And_Collector_Generations.md) | LGTM/PLG; Alloy vs Agent overview |

### B — Advanced concepts

| # | File | Focus |
|---|------|--------|
| 04 | [Grafana Alloy concepts](./04_Grafana_Alloy_Concepts.md) | Components; vs OTel Collector |
| 05 | [Grafana Agent legacy — Static / Flow / Operator](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md) | Brownfield generations; EOL |
| 06 | [Topologies and signal pipelines](./06_Topologies_And_Signal_Pipelines.md) | Edge vs gateway; signal routes |
| 07 | [Explore, correlation, and dashboard model](./07_Explore_Correlation_And_Dashboard_Model.md) | Dig model concepts |
| 08 | [Alerting boundaries and access model](./08_Alerting_Boundaries_And_Access_Model.md) | Page path; orgs/RBAC concepts |

### C — Basic implementation

| # | File | Focus |
|---|------|--------|
| 09 | [Deploy — OSS / Enterprise / Cloud](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md) | Install shapes; HA; sqlite vs DB |
| 10 | [Implement Alloy, datasources, Explore](./10_Implement_Alloy_Datasources_And_Explore.md) | First wire + dig |
| 11 | [Dashboards, variables, and first alert](./11_Dashboards_Variables_And_First_Alert.md) | Boards; one page path |
| 12 | [Worked example — first Grafana dig](./12_Worked_Example_First_Grafana_Dig.md) | End-to-end |

### D — Advanced implementation

| # | File | Focus |
|---|------|--------|
| 13 | [Scale topologies; migrate Agent → Alloy](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md) | Prod scale + migrate |
| 14 | [Provisioning, as-code, and GitOps](./14_Provisioning_As_Code_And_GitOps.md) | Dashboards/DS as code |
| 15 | [IRM / OnCall, SSO, and RBAC in practice](./15_IRM_OnCall_SSO_And_RBAC_In_Practice.md) | Pages + access deep |
| 16 | [What to enable next / when not](./16_What_To_Enable_Next_And_When_Not.md) | Offering map after core loop |

## References

- [Grafana docs](https://grafana.com/docs/grafana/latest/) · [Introduction](https://grafana.com/docs/grafana/latest/introduction/) · [Install](https://grafana.com/docs/grafana/latest/setup-grafana/installation/)  
- [Grafana Alloy](https://grafana.com/docs/alloy/latest/) · [Migrate to Alloy](https://grafana.com/docs/alloy/latest/set-up/migrate/)  
- [Grafana Agent](https://grafana.com/docs/agent/latest/) (legacy / EOL)  
- Official backends: [Mimir](https://grafana.com/docs/mimir/latest/) · [Loki](https://grafana.com/docs/loki/latest/) · [Tempo](https://grafana.com/docs/tempo/latest/) · [Pyroscope](https://grafana.com/docs/pyroscope/latest/)  
- Sibling tracks: [Prometheus](../Prometheus/README.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md) · [Mimir](../Mimir/README.md) · [OpenTelemetry](../OpenTelemetry/README.md) · [PagerDuty](../PagerDuty/README.md)
