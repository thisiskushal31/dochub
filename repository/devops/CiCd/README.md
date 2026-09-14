# CI/CD

**What this folder is:** the **delivery staircase** — how software actually ships, on every estate you will meet.

Climb **[Methodologies](../Methodologies/README.md) first** (mindset). Then climb here (implementation). Same story: build confidence in a change, promote the same artifact, verify, recover fast.

This is not a pile of unrelated topics and not a timeline of “eras.” It is **one loop**, then **deeper layers**, then **target adapters** you pick for the estate you have.

**Syllabus guardrail:** Part A — *Timeless and full-spectrum coverage*.

Pipeline security detail: [Security/](../Security/README.md) (esp. [gate chain](../Security/4_Security_Gate_Chain.md)).  
Vocabulary: [Methodologies/13](../Methodologies/13_Continuous_Everything.md).

---

## The staircase (read in this order)

```text
Floor 1  The loop           →  what a deployment pipeline is
Floor 2  Quality in the pipe →  tests, artifact, config, version
Floor 3  Ship safely         →  environments (shared DEV default), strategies, verify
Floor 4  Harden              →  security gates, supply chain, DB migrations
Floor 5  Engine room         →  runners, monorepo, notifications, host CI automation, tools
Floor 6  Target adapters     →  map first, then classical → hosts → containers → static → K8s PD → AI
         Next spine          →  Security / IAC / Observability as needed
```

| Floor | Step | File | You should leave able to… |
|-------|------|------|---------------------------|
| **1** | Core narrative | [1 — Pipelines: build, test, deploy](./1_Pipelines_Build_Test_Deploy.md) | Draw the loop end-to-end |
| **2** | Tests in CI | [10 — Testing in the pipeline](./10_Testing_In_The_Pipeline.md) | Map unit→e2e→prod signals to stages |
| **2** | Immutable output | [4 — Artifacts and registries](./4_Artifacts_And_Registries.md) | Build once; promote by digest |
| **2** | Config vs artifact | [13 — Config, secrets, env parity](./13_Config_Secrets_And_Env_Parity.md) | Inject config; no bake-in secrets |
| **2** | Name releases | [12 — Versioning and changelogs](./12_Release_Versioning_And_Changelogs.md) | SemVer snapshot → RC → release |
| **3** | Promote path | [8 — Environments, promotion, approvals](./8_Environments_Promotion_And_Approvals.md) | Ladder; shared DEV; optional parallel DEVs |
| **3** | How traffic moves | [3 — Deployment strategies](./3_Deployment_Strategies.md) | Rolling / blue-green / canary / flags |
| **3** | Prove it worked | [5 — Verify, rollback, synthetics](./5_Verify_Rollback_And_Synthetic_Tests.md) | Smoke, rollback vs roll-forward |
| **4** | Security in the pipe | [15 — Pipeline security and gates](./15_Pipeline_Security_And_Gates.md) | Map gates → [Security/4](../Security/4_Security_Gate_Chain.md) |
| **4** | Provenance | [6 — Supply chain: SBOM and signing](./6_Supply_Chain_And_Signing.md) | SBOM, sign, SLSA literacy |
| **4** | Schema safely | [7 — DB migrations in pipelines](./7_DB_Migrations_In_Pipelines.md) | Expand/contract; ordering |
| **5** | How CI runs | [11 — Pipeline as code, runners, caching, matrix](./11_Pipeline_As_Code_Runners_Caching_Matrix.md) | Agents, cache, parallel |
| **5** | Repo shape | [14 — Monorepo and multi-repo CI](./14_Monorepo_And_Multi_Repo_CI.md) | Affected builds; contracts |
| **5** | Human signal | [16 — Notifications and ChatOps](./16_Notifications_Webhooks_And_ChatOps.md) | Alert without noise |
| **5** | Beyond PR CI | [24 — Scheduled jobs, reusable templates, promote](./24_Workflow_Automation_Beyond_PR_CI.md) | Cron; templates; RC→prod promote |
| **5** | Pick tools | [2 — CI/CD tools index](./2_CI_CD_Tools.md) | CI vs GitOps categories → one folder |
| **6** | Estate map | [19 — Delivery spectrum](./19_Delivery_Spectrum_Legacy_Through_Modern.md) + [23 — Classical stack map](./23_Classical_DevOps_Stack_Map.md) | Know which adapter you need |
| **6** | Classical host CI | [20 — Classical Jenkins / web deploy](./20_Classical_Jenkins_Host_And_Web_Deploy.md) | Poll SCM, agents, WAR/systemd |
| **6** | VM / MIG fleets | [18 — VM, MIG, host-based](./18_VM_MIG_And_Host_Based_Deploy.md) | Rolling hosts / templates |
| **6** | Compose / Swarm | [21 — Compose and Swarm](./21_Compose_And_Swarm_Delivery.md) | Multi-tier without full K8s |
| **6** | Static / CDN | [17 — Static sites and CDN](./17_Static_Sites_And_CDN_Deploy.md) | Hash assets; smoke URLs |
| **6** | K8s progressive | [9 — Progressive delivery controllers](./9_Progressive_Delivery_Controllers.md) | Rollouts / Flagger |
| **6** | AI / ML systems | [22 — MLOps and AI delivery](./22_MLOps_And_AI_System_Delivery.md) | Registry, batch/online, distributed |

**Floor 6 is choose-your-adapter after Floors 1–5** — not a chronological “history of industry.” Start with [19](./19_Delivery_Spectrum_Legacy_Through_Modern.md) + [23](./23_Classical_DevOps_Stack_Map.md), then open the one target you run.

---

## How floors connect (one story)

```text
Mindset (Methodologies)
  → Floor 1: one deployment pipeline
  → Floor 2: trustworthy artifact
  → Floor 3: safe promote + prove
  → Floor 4: harden the path
  → Floor 5: scale the machine (CI mechanics + tools)
  → Floor 6: attach the estate (legacy → classical → K8s → AI)
```

---

## End-to-end loop (every floor returns here)

```text
PR → build → test → security gates → publish artifact
  → deploy (your adapter) → verify → promote
  → observe → notify
```

---

## Concept index (by number)

| # | Topic |
|---|--------|
| 1 | [Pipelines: build, test, deploy](./1_Pipelines_Build_Test_Deploy.md) |
| 2 | [CI/CD tools index](./2_CI_CD_Tools.md) |
| 3 | [Deployment strategies](./3_Deployment_Strategies.md) |
| 4 | [Artifacts and registries](./4_Artifacts_And_Registries.md) |
| 5 | [Verify, rollback, synthetic tests](./5_Verify_Rollback_And_Synthetic_Tests.md) |
| 6 | [Supply chain: SBOM and signing](./6_Supply_Chain_And_Signing.md) |
| 7 | [Database migrations in pipelines](./7_DB_Migrations_In_Pipelines.md) |
| 8 | [Environments, promotion, approvals](./8_Environments_Promotion_And_Approvals.md) |
| 9 | [Progressive delivery controllers](./9_Progressive_Delivery_Controllers.md) |
| 10 | [Testing in the pipeline](./10_Testing_In_The_Pipeline.md) |
| 11 | [Pipeline as code, runners, caching, matrix](./11_Pipeline_As_Code_Runners_Caching_Matrix.md) |
| 12 | [Release versioning and changelogs](./12_Release_Versioning_And_Changelogs.md) |
| 13 | [Config, secrets, and env parity](./13_Config_Secrets_And_Env_Parity.md) |
| 14 | [Monorepo and multi-repo CI](./14_Monorepo_And_Multi_Repo_CI.md) |
| 15 | [Pipeline security and gates](./15_Pipeline_Security_And_Gates.md) |
| 16 | [Notifications, webhooks, ChatOps](./16_Notifications_Webhooks_And_ChatOps.md) |
| 17 | [Static sites and CDN deploy](./17_Static_Sites_And_CDN_Deploy.md) |
| 18 | [VM, MIG, and host-based deploy](./18_VM_MIG_And_Host_Based_Deploy.md) |
| 19 | [Delivery spectrum: legacy through modern](./19_Delivery_Spectrum_Legacy_Through_Modern.md) |
| 20 | [Classical Jenkins, host, and web deploy](./20_Classical_Jenkins_Host_And_Web_Deploy.md) |
| 21 | [Compose and Swarm delivery](./21_Compose_And_Swarm_Delivery.md) |
| 22 | [MLOps and AI system delivery](./22_MLOps_And_AI_System_Delivery.md) |
| 23 | [Classical DevOps stack map](./23_Classical_DevOps_Stack_Map.md) |
| 24 | [Workflow automation beyond PR CI](./24_Workflow_Automation_Beyond_PR_CI.md) | Host-neutral cron + templates; SemVer RC→prod same digest |

Numbers are labels — **climb by floor table**, not by sorting `#` alone.

---

## Tools (after Floor 5)

| Tool | Role |
|------|------|
| [Jenkins](./Jenkins/README.md) | Classical + enterprise CI (see also [20](./20_Classical_Jenkins_Host_And_Web_Deploy.md)) |
| [GitHub Actions](./GitHub_Actions/README.md) | Workflows on GitHub (reusable paved road; cron + SemVer promote — [24](./24_Workflow_Automation_Beyond_PR_CI.md)) |
| [GitLab CI](./GitLab_CI/README.md) | `.gitlab-ci.yml` |
| [CircleCI](./CircleCI/README.md) | Full track **01–24** — Cloud config + runners (+ Server literacy) |
| [Tekton](./Tekton/README.md) | K8s-native pipelines |
| [Bitbucket](./Bitbucket/README.md) | Full track **01–21** — Cloud forge + Pipelines (+ Data Center literacy) |
| [Azure DevOps](./Azure_DevOps/README.md) | Full track **01–25** — suite + Pipelines + Azure deploy spectrum + platform ops |
| [Buildkite](./Buildkite/README.md) | Full track **01–26** — Pipelines + agents + full product surface |
| [Argo CD](./Argo_CD/README.md) | GitOps CD **full track** (01–18: concepts → website lab → best practices → feature/config catalogs) |
| [Flux](./Flux/README.md) | GitOps toolkit |
| [Argo Rollouts](./Argo_Rollouts/README.md) | Progressive delivery **full track** (01–16: strategies, traffic, analysis, GitOps, catalogs) |
| [Unleash](./Unleash/README.md) | Feature flags |

Pick **one** CI + the deploy adapter you need. Index: [2](./2_CI_CD_Tools.md).

---

## Coming from Methodologies

Finished Floor 5–6 there? Start **CiCd Floor 1:** [1_Pipelines_Build_Test_Deploy.md](./1_Pipelines_Build_Test_Deploy.md).

Mindset for all estates: [Methodologies/20](../Methodologies/20_Delivery_Reality_Full_Spectrum.md).

---

## Scope

- **Here:** Delivery loop + classical through AI target adapters.  
- **Else:** Container engines → Containerization · Prom/Grafana → Observability · Terraform/Ansible → IAC/Automation · Cloud VMs → Cloud · ML science → Data-Science-AI.  
