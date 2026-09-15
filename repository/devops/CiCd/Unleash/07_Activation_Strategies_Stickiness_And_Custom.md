# 07 — Activation strategies, stickiness, and custom strategies

[← Previous](./06_Feature_Flags_Variants_And_Strategy_Variants.md) · [README](./README.md) · [Next: Context →](./08_Context_Constraints_And_Segments.md)

---

## 1. Concepts

An **activation strategy** decides whether a flag is enabled for a given **Unleash context** in one environment.

- Multiple strategies → **OR** (any strategy that resolves true enables the flag).  
- Multiple **constraints on one strategy** → **AND** (every constraint must pass before that strategy is considered).  
- If you activate a flag in an environment without specifying a strategy, Unleash’s default is a **gradual rollout to 100%** — dark launches need an explicit off/0% (or disabled) strategy, not “no strategy.”  
- Strategies can carry **constraints**, **segments**, and **variants**.

### Predefined strategy types (literacy)

Exact labels evolve; learn the jobs:

| Job | Typical strategy shape |
|-----|------------------------|
| Everyone / kill switch | Flexible gradual rollout at 100% or 0% |
| Percentage rollout | Flexible gradual rollout + stickiness |
| Cohort / allowlist | Constraints / segments on `userId` (or custom fields) |
| Time window | Date operators on constraints (schedule releases) |
| Custom | Your code registered as a strategy type (SDK must implement it) |

Legacy `userWithId` / older gradual-rollout strategy names were removed or superseded for new installs — prefer **flexibleRollout + constraints**. **Stickiness** picks which context field buckets a user into a percentage or variant bucket (commonly `userId`, `sessionId`, or custom) so they do not flip every request.

---

## 2. Advanced concepts

### Constraints vs strategy type

Prefer **flexible rollout + constraints/segments** over inventing many custom strategy types. Custom strategies need SDK support everywhere you evaluate — a coordination cost.

### Gradual rollout craft

```text
0% → 5% → 25% → 50% → 100%
```

Advance only with signals (errors, latency, support). Pair with change requests in prod ([13](./13_Change_Requests_Release_Management_And_Governance.md)). Controllers like Rollouts still own **pod** canaries ([Argo_Rollouts/](../Argo_Rollouts/README.md)).

### Custom activation strategies

Use when built-ins cannot express a rule (complex entitlement). Document the contract; version carefully; test against the client specification mindset ([09](./09_SDKs_Backend_Frontend_And_OpenFeature.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Dark launch | 0% or disabled strategy in prod |
| Beta cohort | UserIDs / segment constraint |
| Ramp | Gradual rollout steps |
| Experiment | Rollout + strategy variants |

**Staff checklist**

- Stickiness field exists in context for % rollouts  
- Prod strategy changes go through governance you chose  
- Custom strategies justified and SDK-covered  

**Good:** percentage + segment. **Bad:** custom strategy only implemented in one language SDK.

---

## References

- [Activation strategies](https://docs.getunleash.io/concepts/activation-strategies)  
- [Predefined strategy types](https://docs.getunleash.io/concepts/predefined-strategy-types)  
- [Stickiness](https://docs.getunleash.io/concepts/stickiness)  
- [Gradual rollout](https://docs.getunleash.io/guides/gradual-rollout)  
- [Custom activation strategies](https://docs.getunleash.io/concepts/custom-activation-strategies)  
