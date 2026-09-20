# Grafana

[← Back to Monitoring & observability](../README.md) · [Prometheus](../Prometheus/README.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md) · [Stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)

## 1. Concepts

**Grafana** is a **visualization and exploration** platform: dashboards, Explore, alerting (optional), and plugins over many data sources (Prometheus, Loki, Tempo, Elasticsearch, cloud metrics, …).

**Plain language:** The glass cockpit—many instruments, one place to look.

| Piece | Job |
|-------|-----|
| **Data sources** | Connections to Prom, Loki, Tempo, … |
| **Dashboards** | Panels for humans |
| **Explore** | Ad-hoc query during incidents |
| **Alerting** | Can alert from Grafana or leave alerts in Prometheus/Alertmanager |
| **Folders / permissions** | Multi-team hygiene |

**What for:** Unify metrics/logs/traces views; share operational truth.  
**When:** OSS Grafana stack, or Grafana against Managed Prom / cloud metrics.  
**Why not:** Single SaaS APM already is the UI and you refuse a second pane; don’t build 200 unowned dashboards.

**Disconfirm:** Pretty dashboards are **not** SLOs. Grafana is **not** your metrics database.

**Confirm:** Which datasource backs latency panels? Who owns the folder?

## 2. Advanced concepts

| Topic | Judgment |
|-------|----------|
| **Variables** | Service/env dropdowns—keep cardinality of combos sane |
| **Library panels** | Reuse golden-signal rows |
| **Mixed datasources** | Correlate Prom ↔ Loki ↔ Tempo with shared labels ([2](../21_Correlation_And_Dig_Methodology.md)) |
| **Grafana OnCall** | Paging alternative/complement—practice still [Methodologies/3](../../Methodologies/3_Team_Patterns_SRE_Incident.md) |
| **Grafana Cloud** | Hosted Grafana + backends—still apply when/why-not vs self-host |

### Failure modes

| Failure | What you see |
|---------|----------------|
| Orphan dashboards | Nobody trusts the board |
| Alert in Grafana *and* Prometheus on same series | Double pages |
| Huge dashboard queries | Explore timeouts mid-incident |

## 3. Applications

| Goal | Pattern |
|------|---------|
| First board | Golden signals from Prom + links to Loki/Tempo |
| Multi-team | Folder per service; provision dashboards as code |
| Incident | Explore first; dashboards second |

**Staff checklist:** provision-as-code preferred; delete unused boards; one alert path per symptom.

## References

- [Grafana docs](https://grafana.com/docs/grafana/latest/)  
- [Prometheus](../Prometheus/README.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md)  
