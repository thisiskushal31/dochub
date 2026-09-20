# 05 — Ops, compactor, and storage

[← Previous](./04_PromQL_Grafana_And_HA_Dedup.md) · [README](./README.md) · [Next →](./06_Worked_Example_Remote_Write.md)

## 1. Concepts

| Concern | Practice |
|---------|----------|
| Object storage | Long-term blocks; IAM least privilege |
| Compactor | Merges blocks; critical for query cost |
| Retention | Per-tenant policies; FinOps ([parent 30](../30_Telemetry_Cost_And_FinOps.md)) |
| Upgrades | Follow Mimir release notes / deployment mode |
| Meta-monitoring | Distributor/ingester/querier health |

**Disconfirm:** Turning off compactor “to save CPU” ≠ sustainable.

## 2. Advanced

Ingest-storage (Kafka) vs classic—pick with current docs. Capacity: active series × tenants.

## 3. Applications

**Staff checklist:** bucket lifecycle; compactor alerts; dashboards for Mimir components.

## References

- [Mimir operators guide](https://grafana.com/docs/mimir/latest/manage/)  
- [06 Example](./06_Worked_Example_Remote_Write.md)
