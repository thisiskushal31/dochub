# Roles, teams, platforms, and leadership (literacy)

[← Back to Methodologies](./README.md)

DevOps is not one job description. Beginners get lost copying “DevOps Engineer” vacancy bingo. This file is **operating-model literacy**: who does what, how teams relate, what “platform” means, and what leaders owe the system.

Aligned with Foundation themes (roles, culture/operating models, enterprise adoption) and common Team Topologies language used in platform/VSM discussions.

---

## Common roles (overlap is normal)

| Role / hat | Focus | Not the same as |
|------------|--------|-----------------|
| **Software engineer (product)** | Features + owning what they ship | “Someone else deploys forever” |
| **DevOps / platform engineer** | Delivery paved road, CI/CD, env, reliability glue | Only writing app features |
| **SRE** | SLOs, error budgets, reliability engineering | Pure ticket ops with no engineering |
| **Security engineer** | Risk, AppSec, detections, policy | Only saying no at the end ([14](./14_DevSecOps_Mindset.md)) |
| **QA / quality** | Strategy for testing; automation with teams | Manual-only gate after coding |
| **Value stream / flow owner** (where named) | End-to-end constraint removal | Local team micromanagement |

Titles vary by company. Judge by **outcomes owned**, not LinkedIn labels.

---

## Team Topologies (enough to converse)

Four team types (Skelton/Pais — widely referenced in platform engineering):

| Type | Purpose |
|------|---------|
| **Stream-aligned** | Delivers customer value for a flow of work |
| **Platform** | Provides internal products that reduce cognitive load for stream teams |
| **Enabling** | Helps stream teams learn/adopt practices (temporary coaching) |
| **Complicated-subsystem** | Owns a hard specialty others should not all reinvent |

**Healthy pattern:** stream teams ship on a platform paved road.  
**Unhealthy pattern:** platform becomes a ticket queue for every YAML change ([12](./12_Agile_Lean_ITSM_And_DevOps.md)).

Handbook depth for platforms: [Cloud-Native/](../Cloud-Native/README.md).

---

## Cultural debt

**Cultural debt** = shortcuts in how people work (blame, heroics, hidden knowledge, “we’ll document later”) that accrue interest as outages, burnout, and slow delivery.

Like tech debt: sometimes intentional, always needs a paydown plan. Postmortems without actions, bus-factor-1 services, and chat-only tribal knowledge are cultural debt ([1](./1_DevOps_Culture_And_Collaboration.md), [7](./7_Docs_And_Runbooks.md)).

---

## Customer feedback (product capability)

DORA includes **gather and implement customer feedback**. DevOps delivery speed is wasted if you never learn whether the change helped users.

Beginner practice:

- Tie releases to a hypothesis (“this should reduce checkout drop-off”).  
- Use product analytics / support signals / interviews — not only CPU graphs.  
- Feed learning into backlog (Second and Third Ways).  

Deep product craft is outside this handbook; do not ignore the loop.

---

## Transformational leadership (what engineers should expect)

Leaders who enable DevOps:

- Fund improvement work and paved roads, not only features  
- Protect psychological safety ([1](./1_DevOps_Culture_And_Collaboration.md))  
- Ask for DORA/capability trends, not vanity heroics  
- Remove cross-team constraints they uniquely can unblock  

If leadership only demands “do DevOps by next quarter” with no capacity, you have a naming problem, not a toolchain problem.

---

## Beginner career note

Skill stack most roadmaps agree on **after** mindset: Linux, networking basics, Git, one cloud, containers, CI/CD, IaC, observability — in that spirit. This handbook’s [Operating-Systems/](../Operating-Systems/README.md), [Languages/](../Languages/README.md), [CiCd/](../CiCd/README.md), and related [Networks](https://github.com/thisiskushal31/Networks-Deep-Dive) / [Containerization](https://github.com/thisiskushal31/Containerization-Deep-Dive) repos are those doors. **Principles first** ([10](./10_Core_Principles_Three_Ways_CALMS.md)), then that stack.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| One “DevOps person” for eight product teams | Platform + shared ownership |
| Renaming Ops to SRE with no SLOs | Practice before title |
| Platform team with no product mindset | Treat IDP as a product with users |

## Next

- Capability checklist: [15_DORA_Capabilities_Map.md](./15_DORA_Capabilities_Map.md)  
- Security mindset: [14_DevSecOps_Mindset.md](./14_DevSecOps_Mindset.md)

## Further reading

- Team Topologies (Skelton, Pais) — team interaction modes  
- [DORA — transformational leadership / culture capabilities](https://dora.dev/capabilities/)  
- PeopleCert / DevOps Foundation — roles & operating models (syllabus level)  
