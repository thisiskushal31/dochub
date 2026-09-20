# 06 — Worked example — traces in Grafana

[← Previous](./05_Sampling_Retention_And_Ops.md) · [README](./README.md)

## 1. Concepts

1. App SDK exports OTLP (or auto-instr).  
2. Alloy receives OTLP → exports to Tempo.  
3. Grafana Tempo datasource.  
4. Force an error; find trace; open Loki by `trace_id`.  
5. Optional: exemplars from Mimir histogram → Tempo.

**Done when:** metric/log → trace works without SSH.

## References

- [Grafana/08](../Grafana/08_Worked_Example_Alloy_To_Grafana.md) · [OpenTelemetry](../OpenTelemetry/README.md)
