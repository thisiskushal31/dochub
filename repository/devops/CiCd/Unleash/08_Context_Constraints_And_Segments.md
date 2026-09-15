# 08 — Context, constraints, and segments

[← Previous](./07_Activation_Strategies_Stickiness_And_Custom.md) · [README](./README.md) · [Next: SDKs →](./09_SDKs_Backend_Frontend_And_OpenFeature.md)

---

## 1. Concepts

**Unleash context** is the bag of attributes the SDK passes into evaluation: who/what is asking.

Common fields:

| Field | Typical use |
|-------|-------------|
| `userId` | Sticky % rollout, allowlists |
| `sessionId` | Anonymous sticky bucketing |
| `remoteAddress` | IP-ish rules (use carefully) |
| `properties` / custom fields | plan tier, tenantId, appVersion, country |

**Constraints** attach to strategies: “only when `plan` ∈ {pro, enterprise}”. Multiple constraints on one strategy are **AND**.  
**Segments** are reusable constraint groups shared across flags (e.g. “internal staff”, “EU tenants”).

Together they implement targeting without hard-coding lists into every strategy. Flag-level multiple strategies remain **OR** ([07](./07_Activation_Strategies_Stickiness_And_Custom.md)).

---

## 2. Advanced concepts

### Custom context fields

Define at the instance root; populate in every SDK that must honor them. If a required context field is missing, constraint operators will not match as you expect — test the empty/missing case for each rule.

### Segment hygiene

| Practice | Why |
|----------|-----|
| Name segments by audience | Reuse without archaeology |
| Prefer segments over copy-paste constraints | One edit updates many flags |
| Review PII in context | Context can be sensitive ([17](./17_Security_Privacy_And_Compliance.md)) |

### Frontend vs backend context

Frontend SDKs send context to Frontend API / Edge for **server-side evaluation** of what the client may see. Backend SDKs evaluate locally with full config — never trust the browser as the only enforcement for security-sensitive flags.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Staff-only | Segment `employee` + constraint |
| Tenant rollout | custom `tenantId` allowlist / % |
| Version gates | `appVersion` semantic constraints |

**Staff checklist**

- Required context fields documented for app teams  
- Sensitive flags enforced on backend, not only SPA  
- Segments owned; orphan segments cleaned  

**Good:** backend enforces entitlement flags. **Bad:** “admin mode” only checked in React.

---

## References

- [Unleash context](https://docs.getunleash.io/concepts/unleash-context)  
- [Segments](https://docs.getunleash.io/concepts/segments)  
- [Managing constraints](https://docs.getunleash.io/guides/managing-constraints)  
