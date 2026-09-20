# 01 — What is Grafana and when

[← README](./README.md) · [Next: LGTM stack →](./02_LGTM_Stack_And_Modern_Setup.md)

## 1. Concepts

**Grafana** is an open-source platform for **querying, visualizing, alerting on, and exploring** telemetry. It does **not** replace Prometheus, Loki, or Tempo as storage—it **connects** to them (and many other datasources) as a pane of glass.

**Plain language:** The glass cockpit. Engines (TSDB/log/trace stores) live elsewhere; Grafana is where humans look and click during digs.

| Piece | Job |
|-------|-----|
| **Data sources** | Connections to Prom/Mimir, Loki, Tempo, Elasticsearch, cloud metrics, … |
| **Dashboards** | Curated panels for known questions |
| **Explore** | Ad-hoc queries in incidents |
| **Folders / RBAC** | Team hygiene |
| **Alerting** (optional) | Grafana-managed alerts—or leave paging in Prometheus/Alertmanager |
| **Provisioning** | Dashboards/datasources as code |

### What for / when / why not

| | |
|--|--|
| **What for** | Unify RED/USE + logs + traces; share operational truth; Grafana Cloud UX |
| **When** | LGTM / PLG stacks; mixed backends; need Explore correlation |
| **Why not** | One SaaS APM already owns UI and you won’t run a second pane; “dashboard theatre” culture with no SLOs |

**Disconfirm:** Pretty boards ≠ monitoring program ([parent 1](../1_Paired_Practice_Monitoring_And_Observability.md)). Grafana is **not** a metrics database.

**Confirm:** Which datasource backs p99? Who owns the service folder?

## 2. Advanced

**OSS Grafana vs Grafana Cloud:** Cloud bundles hosted Grafana + often Mimir/Loki/Tempo (and Alloy agents). Same jobs—different who-runs-the-plane ([parent 26](../26_OSS_Managed_SaaS_And_Hybrid.md)).

**Plugins:** useful; each is supply-chain + upgrade surface—pin and review.

**Failure mode:** 400 unowned dashboards → nobody trusts any panel in an incident.

## 3. Applications

**Staff checklist**

- Grafana is the UI; storage owners named separately  
- Folder ownership per team/service  
- Prefer Explore+runbooks over screenshot archaeology  

## References

- [Grafana docs](https://grafana.com/docs/grafana/latest/)  
- [02 LGTM](./02_LGTM_Stack_And_Modern_Setup.md)
