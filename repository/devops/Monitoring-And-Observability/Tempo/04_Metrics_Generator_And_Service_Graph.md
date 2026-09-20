# 04 — Metrics-generator and service graph

[← Previous](./03_TraceQL_And_Grafana.md) · [README](./README.md) · [Next →](./05_Sampling_Retention_And_Ops.md)

## 1. Concepts

Optional **metrics-generator** derives metrics from ingested traces (span RED, **service graph**, host info) and **remote_writes** to Prometheus/Mimir.

| Use TraceQL metrics | Use metrics-generator → Mimir |
|---------------------|-------------------------------|
| Ad-hoc investigation | Dashboards, alerting, long retention |
| Short windows (docs: constrained ranges) | Durable PromQL |

**Disconfirm:** Enabling generator with unbounded attributes ≠ free cardinality. Generator ≠ excuse to skip app RED instrumentation.

**Confirm:** Do you need service graph? Where do generated metrics land (tenant)?

## 2. Advanced

Processors configurable; cardinality of generated labels must be budgeted. Align with [Prometheus/02](../Prometheus/02_Data_Model_Types_And_Labels.md).

## 3. Applications

**Staff checklist:** generator on/off decision; remote_write target; label allowlist.

## References

- [Metrics-generator](https://grafana.com/docs/tempo/latest/metrics-from-traces/metrics-generator/)  
- [05 Ops](./05_Sampling_Retention_And_Ops.md)
