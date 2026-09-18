# 14 — Impression data, analytics, impact, and Playground

[← Previous](./13_Change_Requests_Release_Management_And_Governance.md) · [README](./README.md) · [Next: Integrations →](./15_Integrations_Terraform_Webhooks_And_Chatops.md)

## 1. Concepts

Flags without feedback become superstition. Unleash surfaces:

| Tool | Job |
|------|-----|
| **Impression data** | SDK emits events when a flag is evaluated (opt-in per flag) |
| **Insights / analytics** | Product views of flag usage, debt, and trends |
| **Impact metrics** | Tie rollouts to SDK/custom metrics or Prometheus/VictoriaMetrics (edition-dependent) |
| **Playground** | Simulate evaluation for a context (including change-request preview) |
| **Events** | Audit trail: **Event Log** (full, filter/export CSV/JSON) vs **Event Timeline** (Enterprise, ~48h debug + Signals) |

Enable impressions when you run experiments or need “who saw what.” Ship them to your analytics stack — Unleash is not your warehouse. SDKs also **register** and send **usage metrics**; Client API has a custom-metrics path used by impact metrics.

## 2. Advanced concepts

### Events vs impressions

**Events** are Admin-side “what changed in Unleash” (who edited a strategy). **Impressions** are app-side “this context evaluated this flag.” Both can feed webhooks. Event schema includes `type`, `createdBy`, `data`/`preData`, and (Enterprise) client IP. Timeline groups nearby events for incident debug.

### Cost and privacy

Impressions can be high-cardinality. Sample or enable only on experiment flags. Avoid stuffing PII into context just for analytics ([17](./17_Security_Privacy_And_Compliance.md)).

### Playground discipline

Use Playground to validate constraints/segments before a prod change request. It reduces “I thought user X was included” incidents.

### Signals and actions (adjacent)

Enterprise release automation may consume **signals** and fire **actions** (pause rollout, notify). Treat as governance extensions of metrics ([13](./13_Change_Requests_Release_Management_And_Governance.md)).

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| A/B | Variants + impressions → analytics |
| Safe ramp | Impact/metrics gates before 100% |
| Support debug | Playground with reported user context |

**Staff checklist**

- Impression flags explicitly chosen  
- Analytics pipeline owned  
- Playground used before risky targeting changes  

**Good:** experiment flags emit impressions. **Bad:** every flag floods analytics at full cardinality.

## References

- [Events](https://docs.getunleash.io/concepts/events)  
- [Impression data](https://docs.getunleash.io/concepts/impression-data)  
- [Capture impression data](https://docs.getunleash.io/guides/how-to-capture-impression-data)  
- [Playground](https://docs.getunleash.io/concepts/playground)  
- [Insights](https://docs.getunleash.io/concepts/insights)  
- [Impact metrics](https://docs.getunleash.io/concepts/impact-metrics)  
