# 05 — Grafana Agent legacy — Static, Flow, and Operator

[← Previous](./04_Grafana_Alloy_Concepts.md) · [README](./README.md) · [Next →](./06_Topologies_And_Signal_Pipelines.md)

## 1. Concepts — three skins of a deprecated collector

**Grafana Agent** was Grafana Labs’ previous multi-signal collector. It is **deprecated**, entered **LTS** (critical/security fixes only) on **2024-04-09**, and reached **End-of-Life on 2025-11-01**. Prefer **Alloy** for all new work ([04](./04_Grafana_Alloy_Concepts.md)). This chapter is **brownfield literacy**—recognize and plan migrate, not deploy greenfield.

**Plain language:** Three variants of the old shipper. Learn them to read prod configs, then move to Alloy ([13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)).

| Variant | Config shape | Felt like |
|---------|--------------|-----------|
| **Static mode** | YAML (`metrics`, `logs`, `traces`, `integrations`) | Prometheus + Promtail-ish in one agent |
| **Flow mode** | Component blocks (Terraform-inspired) | Direct ancestor of Alloy’s model |
| **Operator** | K8s CRDs (`MetricsInstance`, `LogsInstance`, …) | Kubernetes-native Static management |

All three are EOL-scoped. Images/processes often named `grafana-agent` / `grafana-agent-operator`. Cloud docs historically said “agent”—verify whether the binary is Agent or Alloy before you “just upgrade.”

### Why Agent still appears in prod

- Fleets installed before Alloy GA (2024)  
- Helm/GitOps not retargeted  
- Stale “Cloud agent” bookmarks  
- Risk freeze during busy quarters  

None justify **new** Agent installs after EOL.

**Disconfirm:** “LTS” ≠ safe forever. Flow familiarity ≠ you already run Alloy. Operator installed ≠ auto-migrate. “Temporary Agent after EOL” ≠ supported.

**Confirm:** Which variant(s) where? Who owns the Helm release? Dated migration epic? Rollback for first Alloy canary? Dual-scrape forbidden?

## 2. Advanced — timeline, convert mental model, traps

**Timeline**

| Date | Meaning |
|------|---------|
| 2024-04-09 | Deprecation; LTS begins (no new features) |
| ~2025-10-31 | LTS commercial support window ends (per Grafana Labs) |
| **2025-11-01** | **EOL**—no security/bug fixes |

**Convert literacy (concepts).** Alloy offers converters and temporary `--config.format=static` for Static YAML; Flow is closest to native Alloy; Operator needs Helm/components—not a CRD rename. Treat convert stderr as blockers, not noise. Details and runbooks: [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md), [Migrate](https://grafana.com/docs/alloy/latest/set-up/migrate/).

**Jump size by variant**

| From | Conceptual jump | Main risk |
|------|-----------------|-----------|
| Flow → Alloy | Small | Renamed/removed components; data dirs |
| Static → Alloy | Medium | Section mapping; Agent Management leftovers |
| Operator → Alloy | Large | CRD ownership → component pipelines |

**Trap: dual scrape.** Agent + Alloy on the same targets doubles series and flaps alerts. Mutual exclusion per job is non-negotiable.

**Trap: Agent Management / exotic flags.** Some Static options don’t convert cleanly—schedule manual replacements.

**Trap: Operator orphan CRDs.** Deleting the Operator without retiring CRDs leaves zombie desired state.

**Trap: “temporary after EOL.”** Unpatched CVEs become accepted risk—calendar the decommission.

**How to recognize variants quickly**

| Clue | Likely variant |
|------|----------------|
| `agent.yaml` with `metrics:` / `integrations:` | Static |
| `.river` / component blocks / Flow UI | Flow |
| CRDs `MetricsInstance` / Agent Operator chart | Operator |
| Image `grafana/agent` vs `grafana/alloy` | Agent still present |

**Relationship to Alloy.** Flow → smallest jump; Static → convert; Operator → redesign on Helm/components. Implementation cutover: [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md).

## 3. Applications — inventory before you touch prod

| Use case | First move |
|----------|------------|
| Unknown estate | Inventory images, YAML vs Flow files, Operator CRDs |
| Static YAML shop | Mark convert path; freeze feature work on Agent |
| Flow shop | Expect small jump; still review component deltas |
| Operator shop | Map CRDs → Alloy Helm pipelines before deleting Operator |
| Leadership ask | One slide: EOL date + CVE exposure + migrate by cluster/service |
| Greenfield ask | Refuse Agent; ship Alloy ([04](./04_Grafana_Alloy_Concepts.md)) |

**Anti-patterns**

- Extending Static integrations “one more quarter.”  
- Canarying Alloy without freezing Agent scrapes on the same targets.  
- Assuming Cloud UI “agent” means Agent binary forever.

**Staff checklist**

- Variants inventoried (Static / Flow / Operator)  
- No new Agent installs allowed  
- Canary service nominated for Alloy ([12](./12_Worked_Example_First_Grafana_Dig.md), [13](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md))  
- Dual-scrape forbidden in runbooks  
- Decommission ticket dated  
- Convert warnings treated as blockers  

## References

- [Grafana Agent](https://grafana.com/docs/agent/latest/) · [Static](https://grafana.com/docs/agent/latest/static/) · [Flow](https://grafana.com/docs/agent/latest/flow/) · [Operator](https://grafana.com/docs/agent/latest/operator/) · [About Agent](https://grafana.com/docs/agent/latest/about/)  
- [Migrate to Alloy](https://grafana.com/docs/alloy/latest/set-up/migrate/) · [Agent → Alloy FAQ](https://grafana.com/blog/grafana-agent-to-grafana-alloy-opentelemetry-collector-faq/)  
- [04 Alloy](./04_Grafana_Alloy_Concepts.md) · [13 Scale/migrate](./13_Scale_Topologies_Migrate_Agent_To_Alloy.md)
