# 04 — PromQL, Grafana, and HA dedup

[← Previous](./03_Multi_Tenancy_And_Limits.md) · [README](./README.md) · [Next →](./05_Ops_Compactor_And_Storage.md)

## 1. Concepts

Grafana’s Prometheus datasource points at Mimir’s query API (with tenant header via Grafana datasource config / proxy). **PromQL literacy transfers**—recordings/alerts may run in Mimir ruler or still in edge Prometheus.

### HA pairs

Run two Alloy/Prometheus writers scraping the same targets (HA). Enable distributor **HA tracker** so Mimir **deduplicates** identical series from the pair—writes survive one agent failure without double samples.

**Disconfirm:** Two writers without HA tracker ≠ clean doubling. Grafana alerts + Mimir ruler + edge AM all paging the same symptom ≠ OK ([Grafana/07](../Grafana/07_Alerting_OnCall_And_Boundaries.md)).

**Confirm:** Does Grafana explore the correct tenant? Are HA replicas labeled for the tracker?

## 2. Advanced

Retry on 429 may need `retry_on_http_429` on writers. Exemplars → Tempo when configured.

## 3. Applications

**Staff checklist:** datasource provisioned; HA pair documented; one alert path.

## References

- [Mimir query path](https://grafana.com/docs/mimir/latest/)  
- [05 Ops](./05_Ops_Compactor_And_Storage.md)
