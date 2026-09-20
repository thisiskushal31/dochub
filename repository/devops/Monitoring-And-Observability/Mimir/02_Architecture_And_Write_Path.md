# 02 — Architecture and write path

[← Previous](./01_What_Is_Mimir_And_When.md) · [README](./README.md) · [Next →](./03_Multi_Tenancy_And_Limits.md)

## 1. Concepts

High level (classic story):

```text
remote_write / OTLP
       ▼
  distributor  (validate, tenant limits, shard)
       ▼
  ingesters → blocks → object storage
       ▲
  query frontend / queriers  ◄── Grafana PromQL
```

**Distributor** is the write entrypoint: Prometheus remote write (v1/v2), OTLP, etc. Put an **L7 load balancer** in front of distributors; beware keep-alive sticky imbalance (docs suggest tuning remote_write `min_shards`).

Prometheus role: scrape locally, **push** via remote_write (same for Alloy).

**Disconfirm:** Pointing Grafana at a single ingester ≠ supported query path.

**Confirm:** What URL do writers use? What URL does Grafana query?

## 2. Advanced

Compactor, store-gateway, rulers (optional Prometheus-compatible rules) appear in full deployments. HA dedup of identical Prometheus pairs happens in distributor when HA tracker enabled ([04](./04_PromQL_Grafana_And_HA_Dedup.md)).

## 3. Applications

**Staff checklist:** LB in front of distributors; remote_write retries understood ([Prometheus remote write](../Prometheus/09_Storage_Remote_Write_Federation_And_HA.md)); meta-metrics on pending samples.

## References

- [Distributor](https://grafana.com/docs/mimir/latest/references/architecture/components/distributor/)  
- [03 Tenancy](./03_Multi_Tenancy_And_Limits.md)
