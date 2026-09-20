# 06 — Worked example — remote_write to Mimir

[← Previous](./05_Ops_Compactor_And_Storage.md) · [README](./README.md)

## 1. Concepts

1. Prometheus or Alloy scrapes app `/metrics`.  
2. `remote_write` to Mimir distributor URL with `X-Scope-OrgID` (via proxy or headers).  
3. Optional: second HA writer + HA tracker.  
4. Grafana datasource → query; build RED panel.  
5. Confirm series appear only in expected tenant.

**Done when:** Explore shows rates; kill one HA writer and samples continue without doubling.

## References

- [Grafana/08](../Grafana/08_Worked_Example_Alloy_To_Grafana.md) · [Prometheus/09](../Prometheus/09_Storage_Remote_Write_Federation_And_HA.md)
