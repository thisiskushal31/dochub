# DORA capabilities map (all 24 → where to learn them)

[← Back to Methodologies](./README.md)

DORA / *Accelerate* research identified **24 capabilities** that predict software delivery performance. Metrics ([5](./5_DORA_And_Delivery_Metrics.md)) tell you *how you are doing*. Capabilities tell you *what to improve*.

**Source:** [DORA capability catalog](https://dora.dev/capabilities/) and the *Accelerate* appendix list (also summarized by practitioners from the research). This file is a **map for beginners** — every capability gets a home in this handbook or a related repo. We do **not** re-teach Kubernetes inside Methodologies.

## How to use

1. Measure honestly ([5](./5_DORA_And_Delivery_Metrics.md)).  
2. Pick **one** weak capability that sits on your constraint ([11](./11_Value_Streams_And_Lean_Flow.md)).  
3. Follow the link. Improve. Remeasure.  

## Continuous delivery capabilities

| # | Capability | Learn here |
|---|------------|------------|
| 1 | Version control for **all** production artifacts (app + config + IaC + scripts) | [4](./4_Branching_And_PR_Practices.md) + [IAC/](../IAC/README.md) — not only application source |
| 2 | Deployment automation | [CiCd/1](../CiCd/1_Pipelines_Build_Test_Deploy.md), [CiCd/3](../CiCd/3_Deployment_Strategies.md) |
| 3 | Continuous integration | [13](./13_Continuous_Everything.md), [CiCd/](../CiCd/README.md), [4](./4_Branching_And_PR_Practices.md) |
| 4 | Trunk-based development | [4](./4_Branching_And_PR_Practices.md) |
| 5 | Test automation | [13](./13_Continuous_Everything.md); detail in CiCd verify + app test practice |
| 6 | Test data management | CiCd / QA practice — keep non-prod data safe and usable (pointer; expand when you own env strategy) |
| 7 | Shift-left on security | [14_DevSecOps_Mindset](./14_DevSecOps_Mindset.md), [Security/](../Security/README.md) |
| 8 | Continuous delivery | [13](./13_Continuous_Everything.md), [CiCd/](../CiCd/README.md) |

## Architecture capabilities

| # | Capability | Learn here |
|---|------------|------------|
| 9 | Loosely coupled architecture | [System-Design-Concepts](https://github.com/thisiskushal31/System-Design-Concepts) |
| 10 | Architect for empowered teams (teams can deploy independently) | System Design + [16_Roles](./16_Roles_Teams_And_Platforms.md) |

## Product and process capabilities

| # | Capability | Learn here |
|---|------------|------------|
| 11 | Gather and implement customer feedback | Product practice — tie releases to user outcomes; see [16](./16_Roles_Teams_And_Platforms.md) |
| 12 | Make flow of work visible (value stream) | [11](./11_Value_Streams_And_Lean_Flow.md) |
| 13 | Work in small batches | [11](./11_Value_Streams_And_Lean_Flow.md), [4](./4_Branching_And_PR_Practices.md) |
| 14 | Team experimentation | [10 Third Way](./10_Core_Principles_Three_Ways_CALMS.md), [1](./1_DevOps_Culture_And_Collaboration.md) |

## Lean management and monitoring

| # | Capability | Learn here |
|---|------------|------------|
| 15 | Lightweight change approval | [11](./11_Value_Streams_And_Lean_Flow.md), [12 ITSM](./12_Agile_Lean_ITSM_And_DevOps.md) |
| 16 | Monitor app + infrastructure for decisions | [Observability/](../Observability/README.md) |
| 17 | Proactive system health checks | Observability + synthetics ([CiCd/5](../CiCd/5_Verify_Rollback_And_Synthetic_Tests.md)) |
| 18 | WIP limits | [11](./11_Value_Streams_And_Lean_Flow.md) |
| 19 | Visualize work | [11](./11_Value_Streams_And_Lean_Flow.md) (board / stream) |

## Cultural capabilities

| # | Capability | Learn here |
|---|------------|------------|
| 20 | Generative culture (Westrum) | [1](./1_DevOps_Culture_And_Collaboration.md) |
| 21 | Support learning | [1](./1_DevOps_Culture_And_Collaboration.md), [10](./10_Core_Principles_Three_Ways_CALMS.md) |
| 22 | Collaboration among teams | [1](./1_DevOps_Culture_And_Collaboration.md), [16](./16_Roles_Teams_And_Platforms.md) |
| 23 | Tools/resources that make work meaningful | Platform paved road — [16](./16_Roles_Teams_And_Platforms.md), [Cloud-Native/](../Cloud-Native/README.md) |
| 24 | Transformational leadership | [16](./16_Roles_Teams_And_Platforms.md) (enough for engineers; leadership books optional) |

## Beginner honesty

You will not master all 24 in a month. Methodologies owns culture, flow, security mindset, and vocabulary. **CiCd / IAC / Observability / System Design / Security-Deep-Dive** own depth. Leaving a capability “mapped” is correct; leaving it **unnamed** would be the gap.

## Further reading

- [https://dora.dev/capabilities/](https://dora.dev/capabilities/)  
- *Accelerate* — Appendix on capabilities  
