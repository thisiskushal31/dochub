# 04 — Shippers — Alloy and pipeline

[← Previous](./03_LogQL_Essentials.md) · [README](./README.md) · [Next →](./05_Multi_Tenant_Retention_And_Ops.md)

## 1. Concepts

Logs must be **shipped**. Modern LGTM: **Grafana Alloy** tails files / K8s pods / journal, processes, writes to Loki. **Promtail** is the older dedicated agent—new setups prefer Alloy ([Grafana/03](../Grafana/03_Grafana_Alloy_Collector.md)).

```text
source → process (labels, drop, redact) → loki.write
```

| Job | Notes |
|-----|-------|
| Discover | K8s pods, files, systemd |
| Label | Static bounded labels only |
| Reduce | Drop debug in prod; sample if needed |
| Redact | PII/secrets before leave the node |
| Multi-tenant | Set tenant header/org as designed |

**Disconfirm:** Shipping raw secrets “temporarily” ≠ OK. Promtail forever on greenfield ≠ modern default.

**Confirm:** Which Alloy components own your log path? Where is redaction?

## 2. Advanced

Pipeline stages for JSON; drop high-volume noisy containers; align timestamps. Dual-ship during Agent→Alloy migration briefly.

## 3. Applications

**Staff checklist:** Alloy (not new Agent); label contract shared with metrics; PII policy.

## References

- [Alloy docs](https://grafana.com/docs/alloy/latest/)  
- [05 Ops](./05_Multi_Tenant_Retention_And_Ops.md)
