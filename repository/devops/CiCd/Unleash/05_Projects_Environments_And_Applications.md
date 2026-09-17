# 05 — Projects, environments, and applications

[← Previous](./04_First_Flag_SDK_And_Toggle_Loop.md) · [README](./README.md) · [Next: Flags and variants →](./06_Feature_Flags_Variants_And_Strategy_Variants.md)

---

## 1. Concepts

Unleash organizes work so flags are not a flat global soup.

| Object | Role |
|--------|------|
| **Project** | Container for flags and which environments are active |
| **Environment** | Dev / staging / production (and custom); strategies differ per env |
| **Application** | Runtime identity SDKs report; helps ops see “who consumes flags” |

New instances get a **Default** project. Every project needs **at least one** active environment. Root-level environments are defined instance-wide; each project enables a **subset**.

### Why this matters

- Same flag name, different rollout rules per environment  
- Tokens and change requests scoped to the right blast radius  
- Teams can own projects without sharing every flag  

Open Source commonly centers on a single Default project; Enterprise unlocks multi-project organization at scale.

---

## 2. Advanced concepts

### Project collaboration mode

Default is **open** (instance members can see the project and open change requests). Tighten to protected/private so only assigned groups edit flags. Pair with RBAC and change requests ([12](./12_SSO_RBAC_SCIM_And_Provisioning.md), [13](./13_Change_Requests_Release_Management_And_Governance.md)).

### Organizing flags

| Pattern | Use |
|---------|-----|
| One project per product domain | Clear ownership |
| Shared “platform” project | Cross-cutting kill switches |
| Env parity (dev/stage/prod) | Promote strategies carefully — not copy-paste blindly |

Import/export and instance sync exist for moving definitions between instances ([18](./18_Scale_Upgrade_Operate_And_Troubleshoot.md)) — treat as deliberate ops, not chatops.

### Applications registry

Connected SDKs register as applications. Use that view to find orphan flags (no consumers) and stale clients on old SDK versions.

---

## 3. Applications and use cases

| Goal | Pattern |
|------|---------|
| Startup | Default project + dev/prod environments |
| Multi-team | Project per domain + RBAC groups |
| Find dead flags | Applications + technical-debt views ([20](./20_Best_Practices_And_When_Not_Unleash.md)) |

**Staff checklist**

- Environment list matches real deploy stages  
- Prod strategies never edited with a shared “god” habit without CR  
- Project ownership named in team docs  

**Good:** prod strategies stricter than dev. **Bad:** one environment named `prod` used by local laptops with a prod token.

---

## References

- [Projects](https://docs.getunleash.io/concepts/projects)  
- [Project collaboration mode](https://docs.getunleash.io/concepts/project-collaboration-mode)  
- [Environments](https://docs.getunleash.io/concepts/environments)  
- [Applications](https://docs.getunleash.io/concepts/applications)  
- [Organize feature flags](https://docs.getunleash.io/guides/organize-feature-flags)  
