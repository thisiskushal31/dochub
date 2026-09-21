# 01 — What is Grafana and when

[← README](./README.md) · [Next →](./02_Architecture_UI_Datasources_And_Plugins.md)

## 1. Concepts — pane of glass, not the metrics DB

**Grafana** lets you **query, visualize, explore, and optionally alert on** metrics, logs, traces, and profiles **wherever they are stored**. It connects through **data sources**; it does **not** replace Prometheus, Mimir, Loki, Tempo, or Pyroscope as storage.

**Plain language:** The glass cockpit. Engines (TSDB / log / trace stores) live elsewhere; Grafana is where humans look and click during digs.

| Piece | Job |
|-------|-----|
| **Data sources** | Connections to Prom/Mimir, Loki, Tempo, Elasticsearch, cloud metrics, SQL, … |
| **Explore** | Ad-hoc queries in incidents |
| **Dashboards** | Curated panels for known questions |
| **Folders / orgs / RBAC** | Team hygiene and blast-radius control |
| **Alerting** (optional) | Grafana-managed rules—or leave paging in Prometheus/Alertmanager |
| **Plugins** | Extra panels, apps, and datasources (supply-chain surface) |
| **Collector plane** | **Alloy** (preferred) or legacy **Agent**—ships data *to* backends, not “into Grafana” |

### LGTM at high level

**LGTM** ≈ **L**oki + **G**rafana + **T**empo + **M**imir (or Prometheus), usually with **Alloy** collecting. **PLG** is the older metrics-first cousin (Prometheus + Loki + Grafana). Named shapes: [parent 25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md). Backend depth: [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md) · [Mimir](../Mimir/README.md) · [Prometheus](../Prometheus/README.md).

```text
Alloy / Agent  →  Mimir|Prom · Loki · Tempo  →  Grafana (Explore / boards)
```

### OSS vs Cloud vs Enterprise

| Edition | You get | You own |
|---------|---------|---------|
| **Grafana OSS** | Core UI, open plugins, self-managed | Install, HA, DB, upgrades, auth |
| **Grafana Enterprise** | Self-managed OSS core + enterprise plugins, reporting, finer access, support | Same ops plane + license |
| **Grafana Cloud** | Hosted Grafana + often hosted Mimir/Loki/Tempo (+ Alloy agents) | Tenancy, usage, dig culture—not racking the stack |

### When it fits / when it does not

| Fit | Usually not |
|-----|-------------|
| PromQL + LogQL + TraceQL culture | One SaaS APM already owns digs and you refuse a second pane → [Datadog](../Datadog/README.md) |
| Mixed backends, one Explore surface | Need full-text log analytics as center of gravity → [Elastic](../Elastic/README.md) / Kibana |
| Grafana Cloud or LGTM mandate | Provider console alone covers audit + managed metrics and you will not staff a second UI |
| Correlate across signals with shared labels/IDs | “Pretty boards” without SLOs or dig keys ([parent 8](../8_SLI_SLO_SLA_And_Error_Budgets.md)) |

**Disconfirm:** Dashboards ≠ monitoring program ([parent 1](../1_Paired_Practice_Monitoring_And_Observability.md)). “We have Grafana” ≠ telemetry is correct. Buying Cloud ≠ collectors and label contracts exist.

**Confirm:** Which datasource backs latency SLIs? Who owns folders per service? Alloy or Agent in prod? Cloud vs self-managed Grafana? Why not Datadog/Kibana/cloud console only?

## 2. Advanced — peers, collectors, lock-in

**Vs peers (honest).** Datadog wins turnkey product breadth. Kibana wins search-centric Elastic estates. CloudWatch / Cloud Monitoring / Azure Monitor win provider-native audit doors. Grafana wins when you want a vendor-neutral glass over Prometheus-family and LGTM backends—or Cloud as managed LGTM.

**Collector spectrum.** Greenfield → **Alloy**. Brownfield → you will still see **Agent Static / Flow / Operator** (EOL **2025-11-01**)—migrate, don’t extend ([04](./04_Grafana_Alloy_Concepts.md), [05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md)).

**Alert dual-homing.** Grafana Alerting *and* Prometheus Alertmanager both paging the same symptom = noise. Pick one path per class of alert ([08](./08_Alerting_Boundaries_And_Access_Model.md)).

**Plugin sprawl.** Each plugin is upgrade + supply-chain surface. Prefer first-party / signed plugins; pin versions.

**Mental-model lock-in.** Grafana unifies digs on **datasource + labels/IDs**. Peers unify on tags, BT names, or index search. Translating executives across tools without a shared dig grammar creates two “truths” in one war room ([parent 21](../21_Correlation_And_Dig_Methodology.md)).

### Failure modes that look like “Grafana doesn’t work”

| Failure | What you see |
|---------|----------------|
| Glass without backends | Empty Explore; “works on my laptop” myth |
| 400 unowned dashboards | Nobody trusts panels in incidents |
| Split IDs across signals | Trace without logs; metric without `service` label |
| Dual collectors forever | Double series, conflicting labels |
| Alert dual-home | Duplicate pages for one symptom |

## 3. Applications — first moves (keep light)

| Use case | What “good” looks like |
|----------|------------------------|
| First dig culture | One Prom/Mimir + one Loki datasource → Explore answer to a real symptom |
| Greenfield LGTM | Alloy → backends → Grafana; Agent never installed |
| Brownfield glass | Point datasources at existing Prom/Loki; migrate collectors later |
| Page path | One notifier chain per symptom class—not dual Grafana + Alertmanager |
| Peer decision | One ADR paragraph: why Grafana vs Datadog/Kibana/cloud console |

**Anti-patterns to refuse early**

- Dashboard theatre with no SLOs or dig keys.  
- New Agent installs after EOL.  
- Declaring “we’re on LGTM” with only Grafana and no Loki/Tempo/Mimir owners.

**Staff checklist**

- Grafana is the UI; storage owners named separately  
- Primary dig culture stated (PromQL-first vs log-search-first)  
- New collectors = Alloy only  
- Agent inventory exists if still in prod  
- Folder ownership per team/service  
- One peer decision paragraph written  
- Skip Cloud IRM / Assistant until Explore digs work ([16](./16_What_To_Enable_Next_And_When_Not.md))

## References

- [About Grafana](https://grafana.com/docs/grafana/latest/introduction/) · [Grafana Cloud](https://grafana.com/docs/grafana/latest/introduction/grafana-cloud/) · [Grafana Enterprise](https://grafana.com/docs/grafana/latest/introduction/grafana-enterprise/) · [Fundamentals](https://grafana.com/docs/grafana/latest/fundamentals/)  
- [02 Architecture](./02_Architecture_UI_Datasources_And_Plugins.md) · [Datadog when](../Datadog/01_What_Is_Datadog_And_When.md) · [Named stacks](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)
