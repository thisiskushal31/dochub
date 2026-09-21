# 11 — Cost governance and account hygiene

[← Previous](./10_OpenTelemetry_To_Datadog.md) · [README](./README.md) · [Next →](./12_Operations_Pitfalls_And_Staff_Checklist.md)

## 1. Concepts — what you pay for

Datadog charges by product usage (hosts, custom metrics, log ingest/index, spans, RUM sessions, synthetic runs, security, AI credits, …). SKUs are contractual—**Usage page + order form** are the source of truth.

Highest DevOps failure modes:

1. **Unbounded custom metric tags** ([04](./04_Metrics_Tags_And_Cardinality_Cost.md))  
2. **Unfiltered log indexes** ([05](./05_Logs_Pipelines_And_Indexes.md))  
3. **100% trace ingest** with no retention plan ([06](./06_APM_Tracing_And_Correlation.md))  
4. **Every product enabled** with no owner ([14](./14_What_To_Enable_Next_And_When_Not.md))

| Control | Practice |
|---------|----------|
| Usage + budgets | Weekly review; alert before invoice shock |
| Tag policy | Allowlist for DogStatsD / custom checks |
| Log exclusions | Drop debug at collect or intake |
| API / app keys | Secrets manager; rotate; Fleet Automation shows Agent↔key |
| RBAC / Teams | Who can create high-cost config vs who pages |
| Cost allocation | `team` / `service` tags; Cloud Cost Management ([25](./25_Cloud_Cost_IDP_And_Platform_Services.md)) |

**Disconfirm:** “Infrastructure hosts are covered, so cardinality is free.” Multi-org sprawl with no owner. Cloud bill = Datadog bill.

**Confirm:** Who gets the monthly usage export? Cost center tags present? Budget alerts wired?

## 2. Advanced — Limits, AI credits, chargeback

**Metrics without Limits™** changes how custom metrics are counted when enabled—train FinOps and engineers together.

**Cloud Cost Management** ingests cloud provider bills *and* can show Datadog spend as a cost type—use both so teams do not confuse invoices.

**AI Credits / Bits AI / LLM Observability** add new dimensions ([23](./23_LLM_Observability_Bits_AI_And_MCP.md)). Treat like any other billable product: owner, budget, kill switch.

Commitment / on-demand mixes are contractual. Partners or MSPs may hide Subscription Details—know who invoices you.

## 3. Applications — use cases

| Use case | Moves |
|----------|-------|
| Invoice shock | Top custom metrics → remove high-card tag → exclusion filters on logs |
| Chargeback | Enforce `team` tag; Cloud Cost allocation rules |
| New product enable | Usage baseline → enable → delta review in 7 days |
| Key hygiene | Quarterly API/app key inventory; revoke orphans |

**Staff checklist:** tag policy signed; Usage anomaly monitor; quarterly integration audit; separate Datadog vs cloud FinOps dashboards.

## References

- [Billing](https://docs.datadoghq.com/account_management/billing/) · [Custom metrics billing](https://docs.datadoghq.com/account_management/billing/custom_metrics/) · [Cloud Cost](https://docs.datadoghq.com/cloud_cost_management/)  
- [12 Ops](./12_Operations_Pitfalls_And_Staff_Checklist.md)
