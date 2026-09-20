# 05 — Multi-tenant, retention, and ops

[← Previous](./04_Shippers_Alloy_And_Pipeline.md) · [README](./README.md) · [Next →](./06_Worked_Example_Logs_In_Grafana.md)

## 1. Concepts

| Concern | Practice |
|---------|----------|
| Object storage | Required for serious deployments |
| Retention | Per-tenant or global; cost owner ([parent 30](../30_Telemetry_Cost_And_FinOps.md)) |
| Limits | Stream count, ingestion rate, query parallelism |
| Multi-tenant | `X-Scope-OrgID`; gateway injects tenant |
| Compaction / index | TSDB index shipper path |

Monitor Loki itself (ingester lag, query errors). Don’t use hot Loki as eternal legal hold without a separate archive plan.

**Disconfirm:** Infinite retention on hot cluster ≠ free.

## 2. Advanced

Per-tenant limits protect noisy neighbors ([parent 29](../29_Multi_Env_And_Multi_Tenant_Patterns.md)). Quotas for debug log volume.

## 3. Applications

**Staff checklist:** retention matrix; ingestion alerts; tenant map for envs/teams.

## References

- [Loki operations](https://grafana.com/docs/loki/latest/operations/)  
- [06 Example](./06_Worked_Example_Logs_In_Grafana.md)
