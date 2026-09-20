# 11 — Cost governance and account hygiene

[← Previous](./10_OpenTelemetry_To_Datadog.md) · [README](./README.md) · [Next →](./12_Operations_Pitfalls_And_Staff_Checklist.md)

## 1. Concepts

Datadog charges by product usage (hosts, custom metrics, log ingest/index, spans, RUM sessions, synthetic runs, …). SKUs are contractual—**Usage page + order form** are the source of truth.

Highest DevOps failure modes:

1. **Unbounded custom metric tags** ([04](./04_Metrics_Tags_And_Cardinality_Cost.md))  
2. **Unfiltered log indexes** ([05](./05_Logs_Pipelines_And_Indexes.md))  
3. **100% trace ingest** with no retention plan ([06](./06_APM_Tracing_And_Correlation.md))

| Control | Practice |
|---------|----------|
| Usage + budgets | Weekly review; alert before invoice shock |
| Tag policy | Allowlist for DogStatsD / custom checks |
| Log exclusions | Drop debug at collect or intake |
| API / app keys | Secrets manager; rotate; Fleet Automation shows which Agents use which key |
| RBAC / Teams | Who can create high-cost config vs who pages |
| Cost allocation | `team` / `service` tags for chargeback |

**Disconfirm:** “Infrastructure hosts are covered, so cardinality is free.” Multi-org sprawl with no owner.

**Confirm:** Who gets the monthly usage export? Cost center tags present?

## 2. Advanced

Cloud Cost Management features help Finance with cloud bills—don’t confuse them with the Datadog invoice. Metrics without Limits™ changes how custom metrics are counted when enabled on the account.

## 3. Applications — what to do

1. Screenshot / export top custom metrics; assign an owner to cut the top five.  
2. Add a monitor on usage anomalies.  
3. Quarterly: disable unused integrations and indexes.

## References

- [Billing](https://docs.datadoghq.com/account_management/billing/) · [Custom metrics billing](https://docs.datadoghq.com/account_management/billing/custom_metrics/)  
- [12 Ops](./12_Operations_Pitfalls_And_Staff_Checklist.md)
