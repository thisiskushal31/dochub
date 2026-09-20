# 05 — Sampling, retention, and ops

[← Previous](./04_Metrics_Generator_And_Service_Graph.md) · [README](./README.md) · [Next →](./06_Worked_Example_Traces_In_Grafana.md)

## 1. Concepts

| Concern | Practice |
|---------|----------|
| Sampling | Head/tail at SDK or Alloy ([parent 20](../20_Sampling_Strategies.md)); keep errors/slow |
| Retention | Object-store lifecycle; cost owner |
| Compaction | Backend maintenance components |
| HA | Scale distributors/queriers per architecture mode |

Monitor refused spans / export failures on Alloy and Tempo.

## 2. Advanced

Tail sampling in Alloy/collector before Tempo to protect backend. Multi-tenant headers if used.

## 3. Applications

**Staff checklist:** sampling policy written; retention set; only one trace store per env.

## References

- [Tempo operations](https://grafana.com/docs/tempo/latest/operations/)  
- [06 Example](./06_Worked_Example_Traces_In_Grafana.md)
