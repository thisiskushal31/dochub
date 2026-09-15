# 14 — Impression data, analytics, impact, and Playground

[← Previous](./13_Change_Requests_Release_Management_And_Governance.md) · [README](./README.md) · [Next: Integrations →](./15_Integrations_Terraform_Webhooks_And_Chatops.md)

---

## 1. Concepts

Flags without feedback become superstition. Unleash surfaces:

| Tool | Job |
|------|-----|
| **Impression data** | SDK emits events when a flag is evaluated (opt-in per flag) |
| **Insights / analytics** | Product views of flag usage and trends |
| **Impact metrics** | Tie rollouts to business/tech signals (edition-dependent) |
| **Playground** | Simulate evaluation for a context before changing prod |

Enable impressions when you run experiments or need audit-like “who saw what.” Ship them to your analytics stack (Segment, Mixpanel, …) via guides — Unleash is not your warehouse.

---

## 2. Advanced concepts

### Cost and privacy

Impressions can be high-cardinality. Sample or enable only on experiment flags. Avoid stuffing PII into context just for analytics ([17](./17_Security_Privacy_And_Compliance.md)).

### Playground discipline

Use Playground to validate constraints/segments before a prod change request. It reduces “I thought user X was included” incidents.

### Signals and actions (adjacent)

Enterprise release automation may consume **signals** and fire **actions** (pause rollout, notify). Treat as governance extensions of metrics ([13](./13_Change_Requests_Release_Management_And_Governance.md)).

---

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

---

## References

- [Impression data](https://docs.getunleash.io/concepts/impression-data)  
- [Capture impression data](https://docs.getunleash.io/guides/how-to-capture-impression-data)  
- [Playground](https://docs.getunleash.io/concepts/playground)  
- [Insights](https://docs.getunleash.io/concepts/insights)  
- [Impact metrics](https://docs.getunleash.io/concepts/impact-metrics)  
