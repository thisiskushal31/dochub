# 13 — Change requests, release management, and governance

[← Previous](./12_SSO_RBAC_SCIM_And_Provisioning.md) · [README](./README.md) · [Next: Impression and analytics →](./14_Impression_Analytics_Impact_And_Playground.md)

---

## 1. Concepts

**Deploy** puts a binary in an environment. **Release** opens behavior to users. Unleash governance sits on the release side: who may change a flag in prod, how many eyes must approve, and how a standard rollout sequence is reused.

### Change requests

**Change requests (CR)** require approval before flag/strategy changes land in a chosen environment (Enterprise). Enable per project environment (or globally for an environment). Require up to 10 approvers. States include draft → in review → approved → scheduled → applied (plus cancelled/rejected).

Anyone with project access can open a draft; **approve / apply / skip** need **custom project role** permissions — predefined roles do not include them ([12](./12_SSO_RBAC_SCIM_And_Provisioning.md)).

**Skip change requests** is the kill-switch door: environment-scoped enable/disable without the full CR path. It does **not** skip archive/delete of a flag across environments.

### Release management

**Release templates** define a reusable sequence of **milestones** (each with activation strategies). Applying a template to a flag/environment creates a **release plan**. Progression can be manual, time-based, or metric-gated via **impact metrics** and **safeguards** ([14](./14_Impression_Analytics_Impact_And_Playground.md)).

### Signals and actions

**Signals** are HTTP endpoints that external systems POST to (“something happened”). **Actions** in a project react to matching signal payloads (filters like strategy constraints) — e.g. disable an environment on an alert webhook. Pair with ChatOps/webhooks ([15](./15_Integrations_Terraform_Webhooks_And_Chatops.md)).

---

## 2. Advanced concepts

### Scheduling vs DATE_AFTER constraints

Scheduled CRs apply at a wall-clock time but can **suspend** on conflicts (archived flag, edited strategy, deleted scheduler). Prefer **DATE_AFTER** (or segment) constraints when SDKs must know the schedule in advance and survive temporary Unleash downtime.

### Four-eyes and Admin behavior

Admins still see the CR flow but can approve/apply their own changes — still audit, weaker separation. For regulated prod, use custom roles so author ≠ sole approver.

### ServiceNow and audit

Track CR state in ServiceNow via the official integration. Pair with event/audit retention expectations in compliance work ([17](./17_Security_Privacy_And_Compliance.md)).

### Templates vs ad-hoc strategies

Templates encode org standard (“internal → 10% → 50% → 100%”). Ad-hoc flexible rollout is fine for labs; prod should prefer one approved template family so operators do not invent percentages under pressure ([19](./19_Worked_Example_Gradual_Rollout_In_CI_CD.md)).

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Regulated prod toggle | CR on production; skip permission for on-call only |
| Standard rollout | Release template + optional automated progression |
| Alert-driven disable | Signal endpoint ← pager/Datadog → Action disable env |
| Maintenance window | Approved CR scheduled, or DATE_AFTER constraint |

**Staff checklist**

- CR enabled on every environment that must not be hot-edited  
- Custom roles for approve/apply/skip; skip holders documented  
- Kill-switch path rehearsed ([19](./19_Worked_Example_Gradual_Rollout_In_CI_CD.md))  
- Release templates owned by platform/product, not one-off per flag  
- Signal/action endpoints tokenized and least-privilege  

**Good:** four-eyes on prod strategies; skip for incident only. **Bad:** CR everywhere including local labs, or no skip path during outage.

---

## References

- [Change requests](https://docs.getunleash.io/concepts/change-requests)  
- [Release management overview](https://docs.getunleash.io/concepts/release-management-overview)  
- [Release templates](https://docs.getunleash.io/concepts/release-templates)  
- [Signals](https://docs.getunleash.io/concepts/signals)  
- [Actions](https://docs.getunleash.io/concepts/actions)  
- [Get started with release management](https://docs.getunleash.io/guides/getting-started-release-management)  
