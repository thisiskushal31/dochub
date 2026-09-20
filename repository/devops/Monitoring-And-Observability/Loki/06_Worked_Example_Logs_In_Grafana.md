# 06 — Worked example — logs in Grafana

[← Previous](./05_Multi_Tenant_Retention_And_Ops.md) · [README](./README.md)

## 1. Concepts

1. App emits **structured** JSON logs with `service`, `env`, `trace_id` (field, not index label).  
2. Alloy tails → sets bounded labels → `loki.write`.  
3. Grafana Loki datasource → Explore: `{app="checkout", env="prod"} |= "error"`.  
4. Derived field / link → Tempo by `trace_id`.  
5. Confirm stream count stays sane after load.

**Done when:** error line → Tempo waterfall in one click; no user-id labels.

## References

- [Grafana/08 Alloy example](../Grafana/08_Worked_Example_Alloy_To_Grafana.md)  
- [02 Labels](./02_Streams_Labels_And_Cardinality.md)
