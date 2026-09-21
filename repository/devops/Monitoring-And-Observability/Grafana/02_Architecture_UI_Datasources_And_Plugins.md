# 02 — Architecture — UI, datasources, and plugins

[← Previous](./01_What_Is_Grafana_And_When.md) · [README](./README.md) · [Next →](./03_LGTM_Stack_And_Collector_Generations.md)

## 1. Concepts — UI + config plane over remote stores

Grafana’s operator architecture is mostly a **UI + config plane**. Telemetry stays in backends; Grafana holds **users, orgs, datasources, dashboards, folders, and alert rules** in its own database (sqlite / MySQL / Postgres—deploy detail in [09](./09_Deploy_Grafana_OSS_Enterprise_Cloud.md)).

**Plain language:** Orgs and folders organize people and boards. Datasources are dials to engines. Explore is the scratchpad; dashboards are runbooks you trust enough to pin.

| Concept | Job |
|---------|-----|
| **Organization** | Tenant-ish boundary for users, datasources, and dashboards |
| **User / team / role** | Who can see, edit, admin |
| **Data source** | Named connection (URL, auth, default query options) |
| **Explore** | Ad-hoc query UI; split panes; correlation entry |
| **Dashboard / panel** | Saved visualization of one or more queries |
| **Folder** | Permission and ownership unit for boards |
| **Plugin** | Panel, datasource, or app extension loaded into Grafana |
| **Provisioning** | YAML/API/Terraform that creates the above as code ([14](./14_Provisioning_As_Code_And_GitOps.md)) |

### Explore vs dashboards

| Mode | Use when |
|------|----------|
| **Explore** | Incident dig; unknown query; compare time ranges / datasources side by side |
| **Dashboard** | Known question; shared operational truth; variables for env/service |

Anti-pattern: screenshot archaeology from unowned boards instead of Explore + a runbook.

### Datasource mental model

```text
Browser → Grafana → (proxy) → Prometheus / Loki / Tempo / …
                              ↑
                    credentials & timeouts live here
```

Grafana usually **proxies** queries (server-side). Some plugins run in-browser. Backend depth for Prom/Loki/Tempo/Mimir lives in those tracks—not here.

### First-hour UI path

| Goal | Where |
|------|--------|
| Add engines | **Connections → Data sources** |
| Ad-hoc dig | **Explore** |
| Pin a known question | **Dashboards** → team **folder** |
| Wake a human | **Alerting** — only after digs work ([08](./08_Alerting_Boundaries_And_Access_Model.md)) |

**Disconfirm:** Treating Grafana’s DB as the metrics store. Skipping folders then expecting clean ownership. “Datasource works” ≠ labels/IDs correlate across signals.

**Confirm:** Which org is prod digs? Who owns each folder? Which datasources are golden for SLIs? Plugin allowlist?

## 2. Advanced — tenancy, plugins, query blast radius

**Multi-org.** Useful for hard separation (prod platform vs sandbox). Cost: users switch context; boards don’t magically cross orgs. Prefer folders + RBAC inside one org unless tenancy truly requires split ([08](./08_Alerting_Boundaries_And_Access_Model.md)).

**Teams and folders.** Folders are the practical ownership unit. Map folder → team → service list early; otherwise incident digs open “General” chaos.

**Plugin types.** Datasource plugins add engines; panel plugins add viz; app plugins add whole product surfaces. Unsigned / community plugins expand attack and upgrade surface—treat like third-party agents.

**Query path hazards.** Slow backends, huge time ranges, and high-cardinality Instant queries hammer both Grafana and the store. Timeouts and max-data-points are operational controls, not UI cosmetics.

**Correlation mindset.** Dig grammar is Explore-first: metric → labels → logs → trace ID (or reverse). Dashboards encode that grammar after it works once ([07](./07_Explore_Correlation_And_Dashboard_Model.md), [parent 21](../21_Correlation_And_Dig_Methodology.md)).

### Failure modes

| Failure | Symptom |
|---------|---------|
| Credentials only on laptop | “Datasource OK for me”; broken for others / provisioning |
| Prod + staging same org, no folders | Mixed edit rights; accidental deletes |
| Too many default datasources | Wrong engine selected in Explore under stress |
| Plugin pin drift across HA nodes | Panel missing / version skew after upgrade |

## 3. Applications — layout patterns (light)

| Use case | Pattern |
|----------|---------|
| Single team greenfield | One org; folder per service; Prom + Loki (+ Tempo later) |
| Platform + app teams | Platform owns shared datasources; app teams own folders |
| Hard tenancy | Separate orgs (or Cloud stacks)—document the switch tax |
| Dig drill | Break staging; Explore → save to folder board only after query proven |

**Staff checklist**

- Org strategy written (one org + folders vs multi-org)  
- Folder ownership map published before the tenth dashboard  
- Golden datasources named for metrics / logs / traces  
- Plugin allowlist + signed-only policy  
- Explore dig grammar written into one service runbook  
- Provisioning ownership assigned (human UI vs as-code—[14](./14_Provisioning_As_Code_And_GitOps.md))

## References

- [Introduction](https://grafana.com/docs/grafana/latest/introduction/) · [Data sources](https://grafana.com/docs/grafana/latest/datasources/) · [Dashboards](https://grafana.com/docs/grafana/latest/dashboards/) · [Explore](https://grafana.com/docs/grafana/latest/explore/) · [Plugins](https://grafana.com/docs/grafana/latest/administration/plugin-management/)  
- [03 LGTM + collectors](./03_LGTM_Stack_And_Collector_Generations.md) · [Correlation](../21_Correlation_And_Dig_Methodology.md)
