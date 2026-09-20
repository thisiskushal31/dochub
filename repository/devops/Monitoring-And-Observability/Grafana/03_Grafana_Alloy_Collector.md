# 03 — Grafana Alloy collector

[← Previous](./02_LGTM_Stack_And_Modern_Setup.md) · [README](./README.md) · [Next: Topologies →](./04_Alloy_Topologies_And_LGTM_Pipelines.md)

## 1. Concepts

**Grafana Alloy** is Grafana’s open-source **telemetry collector**: a distribution of the **OpenTelemetry Collector** with **built-in Prometheus pipelines** and native paths for **Loki**, **Pyroscope**, and other backends. It collects **metrics, logs, traces, and profiles** in one binary so you are not forced to run a zoo of single-signal agents.

**Plain language:** One collector to scrape Prometheus endpoints, receive OTLP, tail logs, process/filter, and export to Mimir/Loki/Tempo/Pyroscope or Grafana Cloud.

### Why Alloy exists (fact-checked)

| Predecessor | Status (Grafana Labs) |
|-------------|------------------------|
| **Grafana Agent** / Agent Operator | Deprecated; LTS from **2024-04-09**; expected **EOL 2025-11-01** |
| **Alloy** | Successor—new features land here |

New setups should use **Alloy**, not Agent. Plan migrations if Agent remains.

### How configuration works

You build **pipelines** from **components** (building blocks):

```text
scrape / receive  →  process (relabel, filter, batch)  →  export
```

Each component does one job (e.g. Prometheus scrape, OTLP receive, batch, remote_write, Loki write). Outputs feed inputs. Alloy runs that graph continuously.

| Capability | Examples |
|------------|----------|
| Pull metrics | Prometheus scrape + SD (Prom-compatible) |
| Push receive | OTLP (traces/metrics/logs), sometimes others |
| Logs | File tail, journal, Kubernetes pod logs → Loki |
| Export | remote_write (Mimir/Prom), OTLP, Loki, Tempo, Pyroscope |
| Enterprise-ish | Clustering / fleet patterns; Vault-oriented secret patterns (see current docs) |

**Compatibility:** Alloy is **100% OTLP compatible** as an OTel Collector distribution and understands Prometheus agent-style collection. You can often migrate from OTel Collector, Prometheus Agent, or Grafana Agent configs (native or convert—see migrate docs).

**Disconfirm:** Alloy is **not** Grafana (the UI). Alloy is **not** Mimir. Running Alloy without backends ≠ observability. Keeping Agent “because it works” past EOL ≠ a strategy.

**Confirm:** Which signals does your Alloy config collect today? Where does each signal exit?

## 2. Advanced

### Alloy vs plain OTel Collector vs Prometheus

| Need | Prefer |
|------|--------|
| Strict upstream OTel only | OTel Collector |
| Prom scrape + OTLP + Loki in one agent | **Alloy** |
| Classic scrape-only into local Prometheus | Prometheus server / operator (may still pair with Alloy for logs/traces) |

### Resource thumb-rules (deploy docs)

Scraping scale is driven largely by **active series**. Grafana’s public deploy guidance cites on the order of **~10 KB RAM per active series** as a rule of thumb, and suggests planning horizontal scale around **~1M active series**—validate against your version and workload.

### Security

Treat Alloy like a production data plane: least privilege for K8s SA, secret handling, network egress allowlists to backends, no world-readable configs with tokens.

**Failure mode:** One mega-Alloy doing scrape+OTLP+tail with no resource limits → OOM → telemetry blackout during the app outage.

## 3. Applications

| Goal | Move |
|------|------|
| Replace Agent | Follow [migrate from Grafana Agent](https://grafana.com/docs/alloy/latest/) guides; dual-run briefly |
| First Alloy | Scrapes app `/metrics` + remote_write to Mimir/Prom |
| OTel apps | `otelcol.receiver.otlp` → processors → Tempo/Mimir |

**Staff checklist**

- New installs: Alloy only (no new Agent)  
- Config in Git; component graph documented  
- Meta-metrics for refused spans / failed exports watched  

## References

- [Alloy docs](https://grafana.com/docs/alloy/latest/)  
- [Introduction](https://grafana.com/docs/alloy/latest/introduction/)  
- [Agent → Alloy FAQ](https://grafana.com/blog/grafana-agent-to-grafana-alloy-opentelemetry-collector-faq/)  
- [04 Topologies](./04_Alloy_Topologies_And_LGTM_Pipelines.md)
