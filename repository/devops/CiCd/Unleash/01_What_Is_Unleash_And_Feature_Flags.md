# 01 — What is Unleash and feature flags

[← README](./README.md) · [Next: Architecture →](./02_Architecture_Server_SDK_Edge_And_APIs.md)

---

## 1. Concepts

**Unleash** is an open-source **feature management** platform: you ship binaries on your deploy schedule, then control **who sees what behavior** at runtime via **feature flags** (toggles), activation strategies, and SDKs.

The non-negotiable rule: **deploy ≠ release**. Code can sit in production behind a flag that is off for everyone. Release means changing evaluation so some (or all) contexts see the new path — without another deploy.

```text
CI builds digest → deploy with flag default off
  → smoke / verify
  → enable strategies (5% → 50% → 100%) or kill-switch off
```

### What a flag is

At the application boundary a flag is usually a conditional: read config (from Unleash via SDK/Edge), then take path A or B. Unleash’s job is to make that config **remote, targeted, audited, and environment-scoped** — not a hand-edited YAML on a laptop.

Evaluation is designed to happen **locally in the SDK** (backend) or at **Edge** / Frontend API (frontend) — not as a synchronous round-trip to the Unleash server on every request. User data used for targeting stays in your app (or on Edge) for backend-style evaluation; it is not sent to Unleash for those checks ([privacy model](./02_Architecture_Server_SDK_Edge_And_APIs.md)).

### Flag types (lifecycle literacy)

| Type | Job | Typical lifespan |
|------|-----|------------------|
| Release | Ship incomplete/new product behind a gate | Weeks |
| Experiment | A/B / multivariate | Days–weeks |
| Operational | Swap implementations (library, path) safely | Days |
| Kill switch | Instantly degrade/disable a risky path | Long-lived |
| Permission | Entitlements / early access | Often long-lived |
| Sunset | Controlled retirement of an existing feature | Weeks–months |

Types are signals for cleanup and UI sorting — not separate runtime engines.

### Vs progressive delivery controllers

| Concern | Feature flags (Unleash) | Controllers (e.g. Argo Rollouts) |
|---------|-------------------------|----------------------------------|
| Unit of control | **Behavior** inside a process | **Traffic** to a Pod/Service revision |
| Rollback | Toggle / strategy change | Shift weight back / undo Rollout |
| Needs new binary? | No (code already deployed) | Usually yes (new ReplicaSet) |

They pair: ship a new digest under a Rollout **and** gate UX with a flag. Controllers alone do not answer “only beta users see checkout v2.” Flags alone do not answer “only 10% of cluster traffic hits revision B.” See [Argo_Rollouts/](../Argo_Rollouts/README.md) and [9](../9_Progressive_Delivery_Controllers.md).

### OpenFeature door

[OpenFeature](https://openfeature.dev/) is a **vendor-neutral app API** for flags. Unleash providers translate that API into Unleash evaluation. Use it when you want portable application code; use native Unleash SDKs when you need Unleash-specific surfaces (impression data, impact metrics, full strategy variants). Literacy: [09](./09_SDKs_Backend_Frontend_And_OpenFeature.md).

---

## 2. Advanced concepts

### FeatureOps vs “a boolean in Redis”

A boolean in config is a flag technique. Unleash (and FeatureOps practice) add: environments, strategies, stickiness, segments, governance (change requests, RBAC), metrics, and a client model that survives upstream outages via cache. Without lifecycle discipline, flags become permanent forks — technical debt Unleash itself surfaces as stale/potentially stale state.

### Trunk-based development

Flags make trunk-based development operational: merge unfinished work to main, keep it dark in production, light it for staff or a percentage. Feature branches still work with flags, but long-lived branches reintroduce merge risk flags were meant to reduce.

### Invert for kill switches

For kill switches, prefer **safe path when the flag is disabled** (or when the SDK cannot refresh). Enabling the flag then means “kill / degrade.” That way a cold start or outage fails open to the safe path.

### When not to use a flag

- Permanent product configuration that should be ordinary settings  
- Secrets or entitlements that belong in an auth/policy system alone  
- Replacing a proper migration plan (flags can **gate** migrations; they are not the migration)  
- Infinite accumulation — every release flag needs an owner and a remove-by date  

Judgment depth: [20](./20_Best_Practices_And_When_Not_Unleash.md) (later in track).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Ship continuously without big-bang UX | Release flag, default off; open after smoke |
| Reduce blast radius | Gradual rollout + stickiness |
| Incident response | Kill switch / disable strategy — no redeploy |
| Experiment | Experiment flag + strategy variants |
| Entitlements / beta | Permission flag + constraints/segments |
| Pair with canary Pods | Rollouts for binary risk + Unleash for behavior risk |

**Staff checklist**

- Team can state deploy ≠ release in one sentence  
- First flag has an owner and expected lifetime  
- Kill-switch polarity (safe when off) agreed before incidents  
- Spectrum door known: flags vs Rollouts vs both  

**Good:** digest in prod with flag off; release via Admin UI / change request.  
**Bad:** “we redeploy to turn the feature on.”

---

## References

- [What is a feature flag](https://docs.getunleash.io/get-started/what-is-a-feature-flag)  
- [Feature flags concept](https://docs.getunleash.io/concepts/feature-flags)  
- [Unleash docs](https://docs.getunleash.io/)  
- [OpenFeature](https://openfeature.dev/)  
- [Unleash on GitHub](https://github.com/Unleash/unleash)  
