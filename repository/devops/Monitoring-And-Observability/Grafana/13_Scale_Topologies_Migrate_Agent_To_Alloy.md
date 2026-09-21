# 13 — Scale topologies; migrate Agent → Alloy

[← Previous](./12_Worked_Example_First_Grafana_Dig.md) · [README](./README.md) · [Next →](./14_Provisioning_As_Code_And_GitOps.md)

## 1. Concepts — grow the pipe, retire Agent

After the first dig works ([12](./12_Worked_Example_First_Grafana_Dig.md)), scale **where Alloy runs** and finish any **Grafana Agent → Alloy** cutover. Topology concepts: [06](./06_Topologies_And_Signal_Pipelines.md). Agent generations: [05](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md). Agent LTS ended **2025-11-01**—new work is Alloy ([04](./04_Grafana_Alloy_Concepts.md)).

| Move | When |
|------|------|
| **DaemonSet + gateway** | Node-local logs/metrics + central OTLP/scrape |
| **Clustering** | Multi-replica scrape without double-scrape |
| **Edge → proxy → backends** | Large fleets; consolidate egress / relabel |
| **Migrate Agent → Alloy** | Any remaining Static / Flow / Operator |

**Disconfirm:** Dual full collect forever ≠ migration. Extra hop “for cleanliness” on a small estate ≠ scale. Greenfield Agent install ≠ allowed.

**Confirm:** One scrape owner per target? Topology diagram matches prod? Migration owner + rollback window named?

## 2. Advanced — scale and migrate depth

**Topology scale patterns**

| Pattern | Scale lever | Watch |
|---------|-------------|-------|
| DaemonSet Alloy | Node density; log volume | Cardinality on every node; CPU steal |
| Gateway Deployment/StatefulSet | Replicas + HPA; WAL on StatefulSet for Prom scrape | Backend fan-out; receiver backlog |
| Proxy / aggregation tier | Central filter/relabel; fewer egress peers | Single point of failure—PDB + multi-AZ |
| Sidecar | Short-lived / push-only jobs | Shared lifecycle with app |

**Clustering / horizontal scrape.** Alloy clustering coordinates target ownership across replicas. Without it, N replicas scrape everything N times into [Mimir](../Mimir/README.md)/[Prometheus](../Prometheus/README.md). Enable clustering when you scale scrape gateways; verify shard metrics before calling it done.

**Meta-monitoring.** Scrape Alloy’s own metrics (`alloy_*`); alert on export failures, WAL growth, receiver refused—silent drop is worse than a loud page ([10](../10_Alert_Hygiene_And_Burn_Rates.md)).

**Migrate literacy (official convert / live migrate)**

| From | Primary move |
|------|----------------|
| Agent **Static** | `alloy convert --source-format=static` → review → run Alloy; or trial `--config.format=static` |
| Agent **Flow** | Same River shape; live migrate (match topology; Helm `agent` → `alloy`; `alloy_` metrics prefix; storage path) |
| Agent **Operator** | Follow Operator→Alloy migrate; do not dual-operate forever |
| Promtail / otelcol / Prom scrape-only | Dedicated Alloy migrate guides |

Convert output needs **human review** (`--report`; careful with `--bypass-errors`). Dual collect is a **migration window**, not steady state.

**Flow modules.** Replace classic `module.file` / similar with `import.*` before or during migrate. Pin Alloy version; treat experimental components as lab-only.

**Backend scale is separate.** Collector topology does not fix Mimir/Loki/Tempo hot partitions—see sibling tracks when remote_write or ingest lags ([Mimir](../Mimir/README.md) · [Loki](../Loki/README.md) · [Tempo](../Tempo/README.md) · [25](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)).

## 3. Applications — cutover and scale runbooks

### Migrate Agent → Alloy (staging first)

1. Inventory: Static YAML vs Flow River vs Operator CRDs; list scrape jobs and log targets.  
2. Convert or live-migrate per [Alloy migrate](https://grafana.com/docs/alloy/latest/set-up/migrate/).  
3. Diff: `--storage.path`, HTTP listen, clustering flags, stability level, modules → `import.*`.  
4. Deploy Alloy beside Agent in staging; compare series/log volume (short dual window).  
5. Point one canary service fully to Alloy; dig in Grafana ([12](./12_Worked_Example_First_Grafana_Dig.md)).  
6. Stop Agent for canary targets; confirm no scrape gap and no cardinality spike.  
7. Roll environment by environment; delete Agent DaemonSets/Operators when idle.  
8. Update runbooks: Alloy UI, `alloy_` metrics, config repo path.

### Scale DaemonSet + gateway

1. Keep DaemonSet for node metrics + pod/journal logs.  
2. Add gateway Alloy for OTLP receive and/or central app scrape.  
3. Enable clustering on scrape gateways before replica > 1.  
4. Optional proxy tier only when egress peer count or filter drift hurts.  
5. Meta-monitor both layers; page on export failure.

### Failure modes

| Symptom | Likely cause |
|---------|----------------|
| 2× series after “HA Alloy” | Clustering off; dual scrape |
| Helm still `agent:` keys | Rename values to `alloy` |
| WAL disk full on gateway | Undersized volume; remote_write backlog |
| Labels diverge after migrate | Relabel not ported—fix before more boards |

**Staff checklist**

- Topology diagram (DaemonSet / gateway / proxy) checked into Git  
- Agent inventory zero—or dated exceptions with owners  
- Clustering on multi-replica scrape; meta-metrics alerted  
- Staging migrate proven before prod cutover  
- Backend owners clear when ingest lags (not “more Alloy replicas” blindly)  

## References

- [Migrate to Alloy](https://grafana.com/docs/alloy/latest/set-up/migrate/) · [From Static](https://grafana.com/docs/alloy/latest/set-up/migrate/from-static/) · [From Flow](https://grafana.com/docs/alloy/latest/set-up/migrate/from-flow/) · [Clustering](https://grafana.com/docs/alloy/latest/configure/clustering/) · [Agent docs](https://grafana.com/docs/agent/latest/) (legacy)  
- [05 Agent legacy](./05_Grafana_Agent_Legacy_Static_Flow_Operator.md) · [06 Topologies](./06_Topologies_And_Signal_Pipelines.md) · [25 Stack shapes](../25_Named_Stack_Shapes_ELK_PLG_LGTM.md)
