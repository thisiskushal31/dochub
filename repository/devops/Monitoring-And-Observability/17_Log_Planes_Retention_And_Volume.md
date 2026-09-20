# 17 — Log planes, retention, and volume

[← Previous](./16_Structured_Logging.md) · [README](./README.md) · [Next →](./18_Distributed_Tracing.md)

## 1. Concepts — where logs go and for how long

A **log plane** is the path from process → agent/collector → storage/index → query UI. **Retention** and **volume** decide cost, compliance, and whether digs still work next week.

| Concern | Decision |
|---------|----------|
| Ship | Agent vs sidecar vs platform scrape of stdout |
| Parse | Structured at source vs expensive parse later |
| Store | Hot index vs cold object storage |
| Retain | Debug days vs audit months (often different planes) |
| Access | Who can query PII-bearing streams |

```text
app stdout/files → collector → hot searchable → cold bucket
                      ↓
                 sample / drop / route by level
```

**App vs audit vs security:** product debug logs ≠ CloudTrail-class audit ([31](./31_Cloud_Managed_Sinks_And_Audit_Door.md)). Do not one-bucket everything for seven years.

**Disconfirm:** Infinite hot retention ≠ maturity. “We keep everything in Elasticsearch forever” ≠ a plan. Debug volume at 100% in prod ≠ free.

**Confirm:** Hot retention for app logs? Separate audit trail? Who pays the bill ([30](./30_Telemetry_Cost_And_FinOps.md))?

## 2. Advanced — routing, multi-tenancy, and disasters

**Route by level/service:** errors longer hot; info shorter; debug sampled.

**Multi-tenant:** isolate by tenant/org in indexes or labels; enforce quotas ([29](./29_Multi_Env_And_Multi_Tenant_Patterns.md)).

**Backpressure:** when the plane is saturated, prefer drop/sample policy over blocking request path—document the choice.

**Disaster:** lost collector → blind explain path; monitor the log pipeline itself (lag, drop rates).

**Failure mode:** One misconfigured verbose logger takes down the shared cluster (noisy neighbor).

## 3. Applications

**Staff checklist**

- Written retention matrix (app / audit / security)  
- Pipeline health metrics (ship lag, drops)  
- Cost owner named for hot storage  

**Exercise:** Estimate GB/day for one service; project cost at 30d hot. What drops first if budget is cut 50%?

## References

- [OpenTelemetry — Collectors](https://opentelemetry.io/docs/collector/)  
- [16 Structured logging](./16_Structured_Logging.md) · [30 FinOps](./30_Telemetry_Cost_And_FinOps.md)
