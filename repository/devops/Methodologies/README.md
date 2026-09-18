# DevOps Methodologies

**What this folder is:** the **mindset staircase** for DevOps — how to think before how to click tools.

You climb one floor at a time. Each floor deepens the same story: *safe, frequent change with shared ownership*. Nothing here is “old DevOps vs new DevOps by calendar.” The jobs are durable; only adapters change.

**Then go build:** [CiCd/](../CiCd/README.md) is the matching **delivery staircase** (pipelines and targets).

**Syllabus guardrail:** Part A — *Timeless and full-spectrum coverage* (legacy through assisted/AI delivery).

## The staircase (read in this order)

```text
Floor 0  Orient          →  who this is for, map of the handbook
Floor 1  Foundations     →  what DevOps is (Three Ways, CALMS, related frameworks)
Floor 2  Flow            →  value streams, continuous delivery vocabulary, toolchain stages
Floor 3  Human system    →  culture, daily practices, branching, roles/platforms
Floor 4  Operate         →  incidents, ChatOps, docs, measure (DORA), FinOps
Floor 5  Estate reality  →  legacy + full spectrum (mainframe → classical → modern → AI)
Floor 6  Amplifiers      →  platform, GitOps mindset, assisted delivery (after foundations)
         Hand-off        →  CiCd staircase (implement the loop)
```

| Floor | Step | File | You should leave able to… |
|-------|------|------|---------------------------|
| **0** | Orient | [0 — Start here](./0_SE_Learning_DevOps_Start_Here.md) | Know what this repo owns vs related doors |
| **1** | What DevOps is | [10 — Three Ways, CALMS, ToC](./10_Core_Principles_Three_Ways_CALMS.md) | Explain flow, feedback, learning without tool names |
| **1** | How frameworks fit | [12 — Agile, Lean, ITSM](./12_Agile_Lean_ITSM_And_DevOps.md) | Stop tribe wars; see complementary jobs |
| **2** | Continuous vocabulary | [13 — Continuous everything](./13_Continuous_Everything.md) | Separate CI / Delivery / Deployment correctly |
| **2** | Stages of the toolchain | [17 — Toolchain stages](./17_Toolchain_Stages.md) | Name plan→monitor without a vendor |
| **2** | See the work | [11 — Value streams](./11_Value_Streams_And_Lean_Flow.md) | Spot waits and constraints |
| **2** | Manage the stream | [18 — Value Stream Management](./18_Value_Stream_Management.md) | Treat flow as ongoing practice |
| **2** | Security as shared work | [14 — DevSecOps mindset](./14_DevSecOps_Mindset.md) | Own shift-left *and* shift-right |
| **3** | Culture | [1 — Culture and collaboration](./1_DevOps_Culture_And_Collaboration.md) | Use Westrum / safety language for real |
| **3** | Habits | [2 — Practices and workflows](./2_Practices_And_Workflows.md) | Tie Agile habits to shipping |
| **3** | How code integrates | [4 — Branching and PR/MR](./4_Branching_And_PR_Practices.md) | Trunk-friendly; host-neutral (any major forge) |
| **3** | Who does what | [16 — Roles, teams, platforms](./16_Roles_Teams_And_Platforms.md) | Read Team Topologies / platform as product |
| **4** | When it breaks | [3 — SRE and incident](./3_Team_Patterns_SRE_Incident.md) | Error budgets, blameless learning |
| **4** | Signal humans | [6 — ChatOps](./6_ChatOps_And_Notifications.md) | Notify without noise |
| **4** | Memory of the system | [7 — Docs and runbooks](./7_Docs_And_Runbooks.md) | Docs-as-code that ops can run |
| **4** | Prove improvement | [5 — DORA metrics](./5_DORA_And_Delivery_Metrics.md) → [15 — Capabilities map](./15_DORA_Capabilities_Map.md) | Measure outcomes, then capabilities |
| **4** | Cost awareness | [8 — FinOps literacy](./8_FinOps_Literacy.md) | Escalate waste early |
| **5** | Legacy & maintenance | [9 — Maintenance and legacy](./9_Maintenance_And_Legacy.md) | Keep shipping on brownfield / SoR systems |
| **5** | Full estate spectrum | [20 — Delivery reality: full spectrum](./20_Delivery_Reality_Full_Spectrum.md) | Same mindset from COBOL to distributed AI |
| **6** | Amplifiers | [19 — Durable mindsets & evolving toolsets](./19_Durable_Mindsets_And_Evolving_Toolsets.md) | Add platform/assisted levers *on* foundations |
| → | **Implement** | [CiCd staircase](../CiCd/README.md) | Turn mindset into pipelines and targets |

Do not skip Floor 5. Most production value still lives on “boring” or legacy estates; Floor 6 without Floor 1–5 is faster chaos.

## How floors connect (one story)

```text
Mindset (Three Ways / CALMS)
  → vocabulary (CI / Delivery / Deploy)
  → see flow (value stream)
  → people & habits (culture, trunk, roles)
  → operate & measure (incident, DORA)
  → apply on every estate (legacy → classical → modern → AI)
  → amplify (platform, assisted) without abandoning the loop
  → CiCd: build the loop for real
```

## Full index (by number)

| # | Topic |
|---|--------|
| 0 | [SE learning DevOps — start here](./0_SE_Learning_DevOps_Start_Here.md) |
| 1 | [Culture and collaboration](./1_DevOps_Culture_And_Collaboration.md) |
| 2 | [Practices and workflows](./2_Practices_And_Workflows.md) |
| 3 | [SRE and incident](./3_Team_Patterns_SRE_Incident.md) |
| 4 | [Branching and PR/MR / trunk-based](./4_Branching_And_PR_Practices.md) (host-neutral; trunk vs env branches) |
| 5 | [DORA metrics](./5_DORA_And_Delivery_Metrics.md) |
| 6 | [ChatOps](./6_ChatOps_And_Notifications.md) |
| 7 | [Docs-as-code and runbooks](./7_Docs_And_Runbooks.md) |
| 8 | [FinOps literacy](./8_FinOps_Literacy.md) |
| 9 | [Maintenance and legacy](./9_Maintenance_And_Legacy.md) |
| 10 | [Three Ways, CALMS, ToC](./10_Core_Principles_Three_Ways_CALMS.md) |
| 11 | [Value streams and lean flow](./11_Value_Streams_And_Lean_Flow.md) |
| 12 | [Agile, Lean, ITSM, DevOps](./12_Agile_Lean_ITSM_And_DevOps.md) |
| 13 | [Continuous everything](./13_Continuous_Everything.md) |
| 14 | [DevSecOps mindset](./14_DevSecOps_Mindset.md) |
| 15 | [DORA 24 capabilities map](./15_DORA_Capabilities_Map.md) |
| 16 | [Roles, teams, platforms](./16_Roles_Teams_And_Platforms.md) |
| 17 | [Toolchain stages](./17_Toolchain_Stages.md) |
| 18 | [Value Stream Management](./18_Value_Stream_Management.md) |
| 19 | [Durable mindsets and evolving toolsets](./19_Durable_Mindsets_And_Evolving_Toolsets.md) |
| 20 | [Delivery reality: full spectrum](./20_Delivery_Reality_Full_Spectrum.md) |

Numbers are labels, not the climb order — **use the staircase table above**.

## Scope

| In Methodologies | Elsewhere |
|------------------|-----------|
| Principles, culture, flow, metrics, roles, DevSecOps *mindset*, estate *reality* | Pipeline/target *how-to* → [CiCd/](../CiCd/README.md) |
| CI/CD *definitions* | CI/CD *implementation* → CiCd |
| Legacy / full-spectrum *posture* | Target adapters → CiCd 17–23 |
| Assisted delivery *stance* | Model science → [Data-Science-AI](https://github.com/thisiskushal31/Data-Science-AI-Deep-Dive) |

## Authority we align to

*The DevOps Handbook* / Three Ways, CALMS, [DORA](https://dora.dev/), Foundation-style Agile/Lean/ITSM maps, [Microsoft Learn — What is DevOps?](https://learn.microsoft.com/en-us/devops/what-is-devops), [Red Hat — DevSecOps](https://www.redhat.com/en/topics/devops/what-is-devsecops), SWEBOK maintenance, Lean value-stream practice.
