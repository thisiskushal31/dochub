# 03 — Deploy: self-managed, Cloud, and Serverless

[← Previous](./02_Architecture_Stack_And_Data_Plane.md) · [README](./README.md) · [Next →](./04_Agent_Fleet_Beats_And_Logstash.md)

## 1. Concepts — pick the ops burden you can staff

Elastic runs on infrastructure you choose. Deployment type decides **who patches Elasticsearch**, how scaling works, which product surfaces are available, and how you think about shards vs usage.

| Option | You get | You own |
|--------|---------|---------|
| **Self-managed** | Maximum control on VMs / bare metal | Install, upgrades, HA, backups, security, Fleet Server, shard sizing |
| **Elastic Cloud on Kubernetes (ECK)** | Operator-managed Stack on your K8s | Cluster lifecycle via CRDs; still your K8s platform |
| **Elastic Cloud Enterprise (ECE)** | Multi-deployment orchestration console | ECE control plane + underlying hosts |
| **Elastic Cloud Hosted (ECH)** | Dedicated managed cluster (AWS / GCP / Azure) | Sizing, versions, config knobs—not racking hardware |
| **Elastic Cloud Serverless** | Fully managed projects; usage-based | Project settings, ingest, feature tier—not nodes/shards |
| **Local Docker quickstart** | Fast laptop / CI smoke | Not production |

**Plain language:** Self-managed = you are the SRE for the observability platform. ECH = Elastic runs the cluster, you still size and configure. Serverless = you buy a project and ship data.

### Observability Serverless feature tiers

| Tier | Intent | Notable gaps |
|------|--------|--------------|
| **Logs Essentials** | Store/analyze logs at scale; Discover, dashboards, alerting, log-capable integrations | No APM, Hosts, Synthetics, SLOs, ML/AIOps, AI Assistant, Automatic Import, private connectivity / IP filtering |
| **Observability Complete** | Full stack: infra/hosts, APM, Synthetics, SLOs, ML/AIOps, AI Assistant, … | — |

Upgrade Essentials → Complete is **permanent**. Essentials search hides metrics-only integrations; metrics dashboards from packages may appear empty—expected ([01](./01_What_Is_Elastic_Observability_And_When.md)).

### When to choose what

| Fit | Prefer |
|-----|--------|
| Thin platform team, need APM+logs fast | ECH or Serverless Complete |
| Logs-only budget, grow later | Serverless Logs Essentials (know the one-way upgrade) |
| Air-gap / data residency on your metal | Self-managed or ECK |
| Already K8s-native platform | ECK |
| Many Elastic deployments to factory | ECE |
| Want latest features without version gates | Serverless |

**Disconfirm:** “Serverless” ≠ zero ownership of ingest quality. Self-managed ≠ free (people cost dominates). Logs Essentials ≠ Complete with features disabled temporarily. Laptop Docker ≠ prod seed.

**Confirm:** Which deployment for prod? Region(s)? Which Serverless tier (if any)? Who upgrades the Stack? Where does Fleet Server live (hosted on Cloud vs self-managed)? Snapshot/restore (or Serverless retention) owner?

## 2. Advanced — comparison traps and failure modes

**Feature parity is not total.** From Elastic’s deployment comparison (high-signal deltas):

| Area | Self-managed / ECK | ECH / ECE | Serverless |
|------|--------------------|-----------|------------|
| Nodes / shards / replicas | You manage | Available / limited hardware control | Managed by Elastic |
| Data tiers | ILM | ILM / tiers | No classic data tiers; data stream lifecycle |
| Snapshots | Custom | Available / custom | Managed by Elastic |
| Autoscaling | No (self); ECK/ECE available | Available | Automatic |
| Auth | ES realms | Realms + Cloud SSO | Cloud SSO only |
| Audit logging | Available | Available | No |
| Custom plugins / bundles | Available | Available (ECH/ECE) | No |
| Cross-cluster | CCS / CCR | CCS / CCR | Cross-project search; CCR planned |

Private connectivity, IP filtering, Universal Profiling, and tail-based sampling availability also vary—read current docs before promising executive demos. On Serverless/ECH, **mOTLP** is the preferred OTel intake for new work; self-managed needs an Agent/EDOT gateway ([10](./10_OpenTelemetry_To_Elastic.md)).

**Fleet Server.** On Elastic Cloud, hosted Fleet Server is typical. Self-managed needs an accessible Fleet Server before “central management” is real ([04](./04_Agent_Fleet_Beats_And_Logstash.md)).

**Version skew.** Stack components want compatible versions; Agent/EDOT matrices matter (EDOT prefers Stack 9.x, or supported 8.18/8.19 + Agent 9.x pairings; Serverless has no version gate). mOTLP on ECH requires deployment version **9.0+**.

**Cloud Connect.** Self-managed/ECE/ECK can consume some Elastic-managed cloud services without hosting that infra yourself—optional bridge, not a substitute for choosing a primary deploy shape.

**Regions and residency.** ECH/Serverless run on AWS, GCP, or Azure regions you pick at project/deployment create—document latency to agent fleets and data residency/legal constraints before multi-region “because we can.” Cross-cluster / cross-project search is a separate capability from active-active writes.

**Cost model reminder.** Serverless: pay for what you use. ECH: subscription + allocated resources. Self-managed/ECE/ECK: infra + people TCO. Undersizing ECH hot tiers to “save money” usually costs more in dig latency and SRE overtime.

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Undersized ECH hot tier | Indexing lag, search timeouts, angry digs |
| Self-managed without snapshot story | Unrecoverable after disk/node loss |
| Essentials project, expect APM | Empty Applications UI—wrong tier |
| Mixed “prod on Serverless, agents aimed at old cluster” | Silent wrong destination |
| Promise CCR / plugins on Serverless | Roadmap or unavailable—trust broken |

## 3. Applications — use cases

| Use case | Move |
|----------|------|
| Greenfield SaaS-friendly | Trial ECH or Serverless Complete; one region; document billing dims |
| Regulated on-prem | Self-managed/ECK; air-gapped Package/Artifact Registry plan ([04](./04_Agent_Fleet_Beats_And_Logstash.md)) |
| Migrate from laptop demo | Replace Docker quickstart; do not “grow” a single-node demo into prod |
| Cost experiment | Start Logs Essentials only if logs are the sole job; else Complete |
| Multi-cluster factory | ECE templates + deploy templates; separate obs vs security tenancy |

**Staff checklist:** write deployment choice + region + tier; name owners for upgrades and billing; confirm Fleet path; snapshot/restore (or Serverless retention) documented; network allowlists for Agent→ES/Fleet/mOTLP; version compatibility matrix pinned for Agent/EDOT.

## References

- [Deployment options](https://www.elastic.co/docs/get-started/deployment-options) · [Deploy](https://www.elastic.co/docs/deploy-manage/deploy) · [Deployment comparison](https://www.elastic.co/docs/deploy-manage/deploy/deployment-comparison) · [ECH](https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/cloud-hosted) · [Serverless](https://www.elastic.co/docs/deploy-manage/deploy/elastic-cloud/serverless) · [Serverless feature tiers](https://www.elastic.co/docs/solutions/observability/observability-serverless-feature-tiers) · [Self-managed](https://www.elastic.co/docs/deploy-manage/deploy/self-managed) · [ECK](https://www.elastic.co/docs/deploy-manage/deploy/cloud-on-k8s)  
- [02 Architecture](./02_Architecture_Stack_And_Data_Plane.md) · [04 Agent / Fleet](./04_Agent_Fleet_Beats_And_Logstash.md)
