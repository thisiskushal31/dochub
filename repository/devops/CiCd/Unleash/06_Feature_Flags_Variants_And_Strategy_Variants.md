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

### State: active / potentially stale / stale

Unleash marks flags **potentially stale** after the type’s expected lifetime. You can also toggle stale by hand. Stale is a signal to stop using the flag in code; it does not tear down live config. `feature-stale-on` events can drive Slack, broken builds, or cleanup PRs ([15](./15_Integrations_Terraform_Webhooks_And_Chatops.md)).

### Lifecycle stages

Usage metrics move a flag through **Define → Develop → Production → Cleanup → Archived**. Stuck in Define often means no SDK metrics; Cleanup means you marked complete but production still evaluates. Revive starts a new Define cycle. Archive when SDKs no longer need the name; **do not delete** until the name is gone from code (reusing a name can resurrect old branches).

### Dependencies (Enterprise)

One parent, many children, **one level** (parent cannot itself have a parent); same project. Child evaluates only if parent condition is met (enabled / disabled / enabled with a variant). Needs Edge ≥ 13.1 and SDK variant support. Archive children before archiving a parent, or archive both together.

### Naming patterns, tags, links, unknown flags

Enterprise projects can require a **regex naming pattern** for new flags (UI and API). **Tags** (type + value) group flags and drive integrations (e.g. Slack channel). **External links** and project **link templates** attach Jira/metrics/repo search. **Unknown flags** lists names SDKs evaluated that do not exist — typos and stale code.

### Payloads vs config service

Variant payloads are convenient, not a full config-management platform. Keep secrets out. Prefer typed app config for large structured settings.

```text
blue.fast-checkout.64         # good: matches a project naming pattern
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

- Name stable (and pattern-valid) before wide SDK adoption  
- Variant weights sum to 100% as intended  
- Stickiness field chosen (userId vs session)  
- Lifecycle/stale reviewed; archive after code cleanup  
- Unknown-flags list checked for typos  

**Good:** variant payload is a public enum. **Bad:** payload embeds API keys.

---

## References

- [Feature flags](https://docs.getunleash.io/concepts/feature-flags)  
- [Strategy variants](https://docs.getunleash.io/concepts/strategy-variants)  
- [A/B testing guide](https://docs.getunleash.io/guides/a-b-testing)  
