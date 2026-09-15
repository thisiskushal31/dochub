# 06 — Feature flags, variants, and strategy variants

[← Previous](./05_Projects_Environments_And_Applications.md) · [README](./README.md) · [Next: Strategies →](./07_Activation_Strategies_Stickiness_And_Custom.md)

---

## 1. Concepts

A **feature flag** lives in a project and has **per-environment** activation strategies.

Properties that matter day one:

| Property | Notes |
|----------|-------|
| **Name** | URL-safe, unique per instance, stable in code |
| **Type** | e.g. Release (default) — signals intent / lifecycle |
| **Description** | Why it exists; owner hint |
| **Impression data** | Opt-in analytics of evaluations ([14](./14_Impression_Analytics_Impact_And_Playground.md)) |

To be “on” for a context in an environment, **at least one** activation strategy must match. Multiple strategies are combined with **OR** — any matching strategy enables the flag.

### Variants

Flags answer “on/off.” **Strategy variants** answer “which version of on?”

- Name + **weight** (traffic share)  
- **Stickiness** so the same user keeps the same variant  
- Optional **payload** (string / JSON / …) for config-ish values  

Classic use: A/B test checkout copy; experiment model prompts; multi-armed UI.

Environment-level **feature flag variants** are **deprecated**; use **strategy variants** for new work.

---

## 2. Advanced concepts

### Dependencies and lifecycle

Flags can participate in release workflows, dependencies, and technical-debt tracking depending on edition. Plan a **sunset**: remove flag and dead code paths after full rollout ([20](./20_Best_Practices_And_When_Not_Unleash.md)).

### Payloads vs config service

Variant payloads are convenient, not a full config-management platform. Keep secrets out. Prefer typed app config for large structured settings.

### Naming

```text
checkout.express-pay          # good: domain.intent
newThing2_final_FINAL         # bad: no owner, no meaning
```

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Boolean gate | Flag + gradual rollout strategy |
| A/B | Strategy variants + impression/analytics |
| Kill switch | Ops-typed flag; **safe path when flag is off**; enable only to degrade/kill |

**Staff checklist**

- Name stable before wide SDK adoption  
- Variant weights sum to 100% as intended  
- Stickiness field chosen (userId vs session)  
- Sunset ticket exists for release flags  

**Good:** variant payload is a public enum. **Bad:** payload embeds API keys.

---

## References

- [Feature flags](https://docs.getunleash.io/concepts/feature-flags)  
- [Strategy variants](https://docs.getunleash.io/concepts/strategy-variants)  
- [A/B testing guide](https://docs.getunleash.io/guides/a-b-testing)  
