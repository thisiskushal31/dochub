# Mimir (Grafana Mimir)

[← Back to Monitoring & observability](../README.md) · [Grafana](../Grafana/README.md) · [Prometheus](../Prometheus/README.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md)

**Mimir** is Grafana’s **horizontally scalable, multi-tenant, long-term Prometheus-compatible metrics backend**. Prometheus or **Alloy** **remote_writes** samples in; you query with **PromQL** (often via Grafana). Evolved from the Cortex line of systems.

```text
Prometheus / Alloy ──remote_write──► Mimir ──PromQL──► Grafana
                         X-Scope-OrgID (tenant)
```

| | |
|--|--|
| **What for** | Central PromQL at scale; multi-tenant limits; object-store longevity |
| **When** | LGTM metrics plane; many Prometheus/Alloy writers; Grafana Cloud metrics DNA |
| **Why not** | Tiny estate happy with one local Prometheus; Thanos-sidecar model fits better if you must keep autonomous Proms without central push |

**Disconfirm:** Mimir ≠ Grafana UI. Mimir ≠ “replace learning PromQL.” Skipping tenants/limits ≠ safe multi-team platform.

### Progression

| Phase | Chapters | Outcome |
|-------|----------|---------|
| Foundation | [01](./01_What_Is_Mimir_And_When.md)–[02](./02_Architecture_And_Write_Path.md) | Fit; components |
| Tenancy & query | [03](./03_Multi_Tenancy_And_Limits.md)–[04](./04_PromQL_Grafana_And_HA_Dedup.md) | OrgID; HA pairs |
| Ops & ship | [05](./05_Ops_Compactor_And_Storage.md)–[06](./06_Worked_Example_Remote_Write.md) | Storage; e2e |

## Chapters

| # | File | Focus |
|---|------|--------|
| 01 | [What is Mimir and when](./01_What_Is_Mimir_And_When.md) | vs Prometheus vs Thanos |
| 02 | [Architecture and write path](./02_Architecture_And_Write_Path.md) | Distributor; remote_write; OTLP |
| 03 | [Multi-tenancy and limits](./03_Multi_Tenancy_And_Limits.md) | X-Scope-OrgID; fairness |
| 04 | [PromQL, Grafana, HA dedup](./04_PromQL_Grafana_And_HA_Dedup.md) | Query; HA tracker |
| 05 | [Ops, compactor, storage](./05_Ops_Compactor_And_Storage.md) | Object store; modes |
| 06 | [Worked example](./06_Worked_Example_Remote_Write.md) | Alloy/Prom → Mimir → Grafana |

## References

- [Mimir docs](https://grafana.com/docs/mimir/latest/) · [Architecture](https://grafana.com/docs/mimir/latest/get-started/about-grafana-mimir-architecture/)  
