# DevOps culture and collaboration

[← Back to Methodologies](./README.md)

Tools do not create DevOps. **Shared ownership of the path from commit to production** does. Culture is the agreement about who feels pain when something breaks — and how you learn without fear.

---

## What “DevOps culture” means in practice

| Principle | Day-to-day signal |
|-----------|-------------------|
| **Shared ownership** | Devs and ops (or one platform team) jointly own deploy success, not “throw over the wall” |
| **Optimize for flow** | Small batches, fast feedback, fewer handoffs |
| **Feedback loops** | Prod signals reach the people who change the code |
| **Continuous learning** | Incidents become improvements, not theater |
| **Blameless by default** | Fix systems and incentives; still hold clear accountability for negligence |
| **Psychological safety** | People can raise risks, ask questions, and admit mistakes without punishment |

If your org still has a ticket queue for every config change and a separate “ops team” that only hears about failures, you have a collaboration problem — not a missing Jenkins plugin.

Principles behind this: [10 — Three Ways / CALMS](./10_Core_Principles_Three_Ways_CALMS.md). Research link: [DORA — generative organizational culture](https://dora.dev/capabilities/generative-organizational-culture/).

---

## Westrum culture types (used in DORA research)

Sociologist Ron Westrum described how organizations process information. DORA found **generative** (high-trust) culture predicts better software delivery performance.

| Type | Failure response | Information flow |
|------|------------------|------------------|
| **Pathological** | Fear / blame / shoot the messenger | Hidden, political |
| **Bureaucratic** | Follow the rules; narrow duties | Through channels only |
| **Generative** | Inquiry; fix the system | Sought and shared |

Generative behaviors to practice: high cooperation, train messengers (don’t punish bad news), share risks, encourage bridging across teams, failure → inquiry, implement novelty. Blameless postmortems below are the generative failure response — not “nobody is responsible for negligence.”

---

## Shared ownership

**Before:** Dev writes code → Ops deploys → Ops pages at 3am → Dev says “works in staging.”  
**After:** Same people who merge also see deploy health, own runbooks, and join incident channels for their services.

Practical moves:

- Service teams own the pipeline definition for their apps (platform provides paved roads).  
- On-call includes people who can change the code (or a clear escalation to them).  
- Definition of Done includes “observable and rollback-ready,” not only “merged.”

---

## Blameless postmortems

A postmortem answers: **what happened**, **what we learned**, **what we will change**. It does not answer “whose fault.”

### Template (copy)

```markdown
# Incident: <short title> — <date>

## Summary
(2–3 sentences: impact, duration, user-visible effect)

## Timeline (UTC)
- HH:MM — detection
- HH:MM — mitigation
- HH:MM — resolution

## Root cause(s)
(systems + contributing factors; not a person)

## What went well
## What went poorly
## Action items
| Action | Owner | Due | Done |
|--------|-------|-----|------|
|        |       |     | [ ]  |

## Lessons for others
```

### Rules of engagement

- Schedule within a few days while memory is fresh.  
- Invite people who were in the incident *and* people who own the follow-ups.  
- Action items without owners are decoration — assign and track.  
- Link from the alert / ticket; store next to runbooks ([7_Docs_And_Runbooks](./7_Docs_And_Runbooks.md)).

Accountability still exists: repeated reckless bypass of gates, ignoring known risks, or lying in timelines is a management issue. Blameless is about **learning from complex system failure**, not amnesty for everything.

---

## Collaboration patterns that matter for delivery

| Pattern | Use when | Avoid when |
|---------|----------|------------|
| **Platform team + paved road** | Many product teams, shared CI/CD/IaC patterns | Platform becomes a ticket bottleneck for every change |
| **You build it, you run it** | Clear service ownership | No platform support and every team reinvents clusters |
| **Guilds / chapters** | Cross-team standards (security, reliability) | Endless meetings with no decision rights |
| **ChatOps visibility** | Fast awareness of deploys/incidents | Approving prod with no audit trail ([6_ChatOps](./6_ChatOps_And_Notifications.md)) |

---

## Continuous learning

- Budget time for fixing toil discovered in incidents.  
- Rotate “improvement” work into sprints (gates, tests, docs).  
- Teach the delivery loop to new SEs via [0_SE_Learning_DevOps_Start_Here](./0_SE_Learning_DevOps_Start_Here.md).

---

## Pitfalls

| Pitfall | Better |
|---------|--------|
| “We do DevOps” = we installed Kubernetes | Measure flow and failure ([5_DORA](./5_DORA_And_Delivery_Metrics.md)) |
| Postmortems that never close actions | Track actions like product bugs |
| Blame culture → hidden outages | Reward early escalation and honesty |
| Platform team as human CI | Self-service + guardrails |

---

## Trade-offs

Culture change is slower than buying a tool. Tooling without ownership just automates the wall. Start with ownership of one service’s path to prod, then scale patterns.

## Next

- Practices that encode culture: [2_Practices_And_Workflows.md](./2_Practices_And_Workflows.md)  
- Incidents and on-call: [3_Team_Patterns_SRE_Incident.md](./3_Team_Patterns_SRE_Incident.md)

## Further reading

- [DORA — Generative organizational culture](https://dora.dev/capabilities/generative-organizational-culture/) (Westrum)  
- Google SRE book — chapters on postmortems and blameless culture  
- *Accelerate* — culture and performance research (pair with current dora.dev)  
