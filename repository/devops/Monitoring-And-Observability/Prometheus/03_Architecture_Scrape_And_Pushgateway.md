# 03 — Architecture, scrape, and Pushgateway

[← Previous](./02_Data_Model_Types_And_Labels.md) · [README](./README.md) · [Next →](./04_Configuration_Service_Discovery_And_Relabeling.md)

## 1. Concepts

### Pull path (default)

Prometheus **scrapes** targets over HTTP on `scrape_interval` (global default often `1m`; override per job). It stores samples in a local **TSDB** (WAL + blocks), evaluates **rule_files**, and sends alert *state* to **Alertmanager**.

```text
Instrumented job  (or exporter / Pushgateway)
        ▲
        │  GET /metrics  (pull)
Prometheus server
  ├─ TSDB (local samples)
  ├─ PromQL / HTTP API / UI
  ├─ Rule manager (record + alert)
  └─ → Alertmanager → receivers
```

On every successful scrape lifecycle you also get synthetic health: the **`up`** time series per target (`1` = scrape OK, `0` = fail)—first-class for “is the metrics path alive?”

| Knob | Role |
|------|------|
| `scrape_interval` | How often to pull |
| `scrape_timeout` | Must be **<** interval; slow targets fail the scrape |
| `metrics_path` / `scheme` | Usually `/metrics`, `http` or `https` |
| `honor_labels` | When federating / receiving pre-labeled data |

**Design intent (overview docs):** each server is **standalone**—you can still query local data when remote systems are down.

### Pushgateway — when (and when not)

Official guidance: the Pushgateway is an intermediary for metrics from jobs that **cannot be scraped**. Valid use is **narrow**.

**Usually valid:** capturing the **outcome of a service-level batch job** (not tied to a specific machine)—e.g. a nightly job that deletes users for the whole service. Avoid `instance`/machine labels on those pushes so stale lifecycle stays manageable.

**Official pitfalls if used as a general push bus:**

| Pitfall | Why it hurts |
|---------|--------------|
| SPOF / bottleneck | Many instances → one gateway |
| Lose automatic `up` | Push replaces pull health semantics |
| **Never forgets series** | Pushed series stay until **manually deleted** via API—renamed instances leave ghosts |

**Alternatives the docs recommend:**

- Firewall/NAT blocking scrape → move Prometheus closer, or use **PushProx**—not “push everything.”  
- Machine-related batch (patch cron, config-management client) → **node_exporter textfile collector**, not Pushgateway.

**Disconfirm:** Pushing long-running apps through Pushgateway ≠ Prometheus architecture. Longer scrape intervals alone ≠ “free” if alerts need fresh data and `for:` windows assume regular samples.

**Confirm:** Why does pull give you `up`? Name one batch that belongs on Pushgateway vs textfile vs normal `/metrics`.

## 2. Advanced

**Sample timing:** rates need enough points in the range vector. A common operational rule of thumb: range windows ≈ **4× scrape interval** (e.g. `[5m]` with `15s` scrapes) so `rate()` is stable—tune with eyes open, not cargo-cult.

**Compression / body size:** huge surfaces (unbounded histograms × high cardinality) blow scrape time and memory—fix at the source ([02](./02_Data_Model_Types_And_Labels.md)).

**HA is not “two scrapers” alone:** duplicate Prometheus replicas scrape the same targets by design in many setups; **Alertmanager clustering** prevents double notifications ([08](./08_Alerting_Rules_And_Alertmanager.md), [09](./09_Storage_Remote_Write_Federation_And_HA.md)).

**Failure mode:** Gateway full of stale `instance` label sets from dead CI runners → confusing graphs and alerts for ghosts.

## 3. Applications

**Staff checklist**

- Document scrape intervals by job class (app vs node vs expensive exporter)  
- Pushgateway allowlisted only for named service-level batch jobs + deletion/automation plan for stale metrics  
- Dashboards include `up` and scrape-duration for the metrics plane itself  
- Machine batch metrics via textfile collector where applicable  

## References

- [Overview — architecture](https://prometheus.io/docs/introduction/overview/)  
- [When to use the Pushgateway](https://prometheus.io/docs/practices/pushing/)  
- [04 Configuration / SD](./04_Configuration_Service_Discovery_And_Relabeling.md)
