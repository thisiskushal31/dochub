# Agile, Lean, ITSM, and DevOps — how they fit

[← Back to Methodologies](./README.md)

Beginners often hear “replace ITIL with DevOps” or “Agile is DevOps.” Both are wrong. Good teaching (DevOps Foundation curricula, Microsoft Learn, Handbook lineage) treats them as **related frameworks** that can reinforce or fight each other depending on how you apply them.

## One-sentence each

| Framework | Focus |
|-----------|--------|
| **Agile** | Build the *right* product iteratively; respond to change; cross-functional product teams |
| **Lean** | Maximize value / minimize waste; flow; small batches; pull |
| **ITSM / ITIL** | Run IT services with clear processes (incident, change, problem, request, SLAs) |
| **DevOps** | Unite build + run so delivery is fast *and* safe; culture + automation + measurement |
| **SRE** | Apply software engineering to operations problems; SLOs / error budgets (see [3](./3_Team_Patterns_SRE_Incident.md)) |

DevOps Institute / PeopleCert Foundation courses explicitly teach **DevOps relationship to Agile, Lean, and ITSM** — this file is that map for our handbook.

## Agile and DevOps

| Agile helps DevOps when… | Conflict when… |
|--------------------------|----------------|
| Small stories, frequent integration | “Done” means merged, not running in prod |
| Cross-functional teams | Dev finishes sprint; Ops gets a ticket next sprint |
| Continuous customer feedback | Feedback never includes ops/security |

**Rule of thumb:** Agile without a path to production is unfinished Agile. DevOps extends Agile into **deploy, operate, learn**.

Our practice notes: [2_Practices_And_Workflows](./2_Practices_And_Workflows.md).

## Lean and DevOps

Lean supplies much of DevOps’ flow language: waste, WIP, value streams, pull, quality at source.

- Value streams: [11](./11_Value_Streams_And_Lean_Flow.md)  
- CALMS **L**: [10](./10_Core_Principles_Three_Ways_CALMS.md)  

Kanban (visualize work, limit WIP) is a common Lean tool inside DevOps teams — not mandatory branding.

## ITSM / ITIL and DevOps

ITIL is a **service management** body of knowledge (incident, problem, change, release, configuration, …). It is not the enemy of DevOps. Anti-patterns appear when change management is only a slow committee.

| ITSM idea | Healthy DevOps version |
|-----------|-------------------------|
| Incident management | On-call, severities, restore first ([3](./3_Team_Patterns_SRE_Incident.md)) |
| Problem management | Postmortems + durable fixes ([1](./1_DevOps_Culture_And_Collaboration.md)) |
| Change management | Lightweight peer review + automated evidence; CAB for rare high-risk |
| Knowledge management | Runbooks as code ([7](./7_Docs_And_Runbooks.md)) |
| SLAs / SLOs | User-facing targets; SRE error budgets |

**Fact check:** High performers still manage risk — they push controls **into the pipeline** (required checks, progressive delivery, audit logs) instead of relying only on meeting theaters. That matches DORA’s lightweight change approval findings.

## Continuous funding (brief)

Annual project funding that freezes capacity mid-year fights DevOps flow. Product/platform teams need **ongoing funding** for run + improve, not only project launches. Enterprise topic — know the tension; escalate to leadership; do not “solve” it with more YAML.

## Platform engineering (door)

Many orgs now add an **internal platform** so product teams self-serve CI, environments, and observability (“paved road”). That is an operating model, not a replacement for DevOps culture.

- Handbook home for platform themes: [Cloud-Native/](../Cloud-Native/README.md) (platform engineering topic)  
- Team topologies ideas (stream-aligned vs platform teams) — learn when you scale; do not block beginner fundamentals  

## Organizational maturity (brief)

Foundation courses mention **maturity models** (how “advanced” practices are). Use them as a **mirror**, not a vanity score.

Beginner rule:

- Prefer **DORA metrics + one capability at a time** ([5](./5_DORA_And_Delivery_Metrics.md), [15](./15_DORA_Capabilities_Map.md)) over chasing “Level 5” badges.  
- Maturity without psychological safety and flow is theater ([1](./1_DevOps_Culture_And_Collaboration.md)).  

## Assisted coding and operations (literacy)

See the durable map: [19_Durable_Mindsets_And_Evolving_Toolsets](./19_Durable_Mindsets_And_Evolving_Toolsets.md) (assisted delivery, platform, control pillars).

**Assisted operations** (alert correlation, draft summaries) and **assisted coding** help when policy and paved roads exist.

| Healthy use | Unhealthy use |
|-------------|----------------|
| Fewer duplicate pages; faster triage | Blind auto-remediation with no ownership |
| Draft docs humans still review | Skipping blameless learning because “the bot said so” |
| Help write tests/pipelines | Shipping generated changes with no CI or review |

Assistants do **not** replace Three Ways, SLOs, or change control ([10](./10_Core_Principles_Three_Ways_CALMS.md), [3](./3_Team_Patterns_SRE_Incident.md)). They **amplify** existing strengths and weaknesses.

## Scrum (door)

**Scrum** is a common Agile framework (roles: Product Owner, Scrum Master, Developers; events; artifacts). DevOps does not require Scrum — but many teams use Scrum for *planning* while DevOps owns *path to prod*.

- If “Done” means merged but not releasable, Scrum + DevOps are misaligned ([12](./12_Agile_Lean_ITSM_And_DevOps.md), [13](./13_Continuous_Everything.md)).  
- Full Scrum guide lives with Agile coaching materials — not duplicated here.  

## Safety culture and learning organizations

- **Psychological safety** — people can raise risks and admit mistakes without punishment (Google Project Aristotle; DORA links this to performance).  
- **Westrum generative culture** — failure → inquiry; messengers trained; novelty welcomed — expand in [1](./1_DevOps_Culture_And_Collaboration.md).  
- **Learning organization** — improvement of daily work is scheduled (Third Way).  
- **Cultural debt** — [16](./16_Roles_Teams_And_Platforms.md).  

## Beginner takeaway

```text
Agile     → what to build, iterative learning with users
Lean      → how work flows, less waste
ITSM      → how services are governed when things break / change
DevOps    → how build+run become one system
SRE       → how reliability is engineered with SLOs
VSM       → how the end-to-end stream is managed over time ([18](./18_Value_Stream_Management.md))
```

You will use all of them in a real company. Do not pick a tribe; pick outcomes.

## Pitfalls

| Pitfall | Better |
|---------|--------|
| “We abolished ITIL” → chaos | Keep incident/change discipline; modernize the controls |
| Agile ceremonies + quarterly release | Finish the path to prod |
| Platform team as new ticket silo | Self-service + clear SLAs for the platform |

## Next

- CI vs CD vs continuous deployment: [13_Continuous_Everything.md](./13_Continuous_Everything.md)  
- Culture depth: [1_DevOps_Culture_And_Collaboration.md](./1_DevOps_Culture_And_Collaboration.md)

## Further reading

- DevOps Foundation syllabi (DevOps Institute / PeopleCert) — Agile, Lean, ITSM modules  
- [Microsoft Learn — What is DevOps?](https://learn.microsoft.com/en-us/devops/what-is-devops)  
- [DORA — Generative organizational culture](https://dora.dev/capabilities/generative-organizational-culture/)  
