# 02 — Architecture, Agent, and data plane

[← Previous](./01_What_Is_Datadog_And_When.md) · [README](./README.md) · [Next →](./03_Install_Host_Container_And_Kubernetes.md)

## 1. Concepts

The **Datadog Agent** runs on hosts (or as a container / DaemonSet). It collects system metrics and events, and—when you enable them—logs, traces, and processes. It is open source ([DataDog/datadog-agent](https://github.com/DataDog/datadog-agent)).

```text
Default host checks ──┐
Integrations / Autodiscovery ─┼──► Agent ──► Datadog intake
DogStatsD (custom metrics) ───┤
APM / OTLP receivers ─────────┘
```

| Piece | Job |
|-------|-----|
| **`datadog.yaml`** | Main config: **API key**, **site**, host tags, feature toggles |
| **`conf.d/`** | Per-integration check configs |
| **Integrations** | Built-in checks for OS, Docker, cloud, apps |
| **DogStatsD** | Apps emit custom metrics (StatsD + Datadog extensions) |
| **APM libraries / SSI** | Create spans in the app; Agent receives traces |
| **Fleet Automation** | In-app install, upgrade, config, flares at scale |

Out of the box the Agent reports ~75–100 system metrics every few seconds (CPU, disk, memory, network, …) plus Agent health (`datadog.agent.running`, `datadog.agent.started`). Logs, APM, and live processes are **off until you enable them**.

### Unified service tagging (do this early)

Reserved tags **`env`**, **`service`**, **`version`** tie metrics, logs, and traces so digs work ([parent 21](../21_Correlation_And_Dig_Methodology.md)):

- Change `version` on every deploy.  
- On Kubernetes: labels `tags.datadoghq.com/env|service|version` on workload **and** pod template; set `DD_ENV` / `DD_SERVICE` / `DD_VERSION` for tracers (Admission Controller can inject).  
- On Docker: same via `DD_*` env and `com.datadoghq.tags.*` labels.  
- Needs Agent **6.19+ / 7.19+** and a recent language SDK.

**Disconfirm:** Skipping unified tags then wondering why Explore can’t jump metric → trace → log. Metrics-only Agent forever, then expecting APM.

**Confirm:** API key + site correct? Who owns Agent upgrades?

## 2. Advanced

Host vs container: hosts use YAML; containers often use **`DD_API_KEY`**, **`DD_SITE`**, and Autodiscovery from labels/annotations. Rough ballpark overhead when lightly configured: on the order of ~0.1% CPU and ~1 GB disk—measure yours.

Host-level `tags:` in `datadog.yaml` (or `DD_TAGS`) attach to everything that Agent emits—use for `team:`, not for high-cardinality IDs ([04](./04_Metrics_Tags_And_Cardinality_Cost.md)).

## 3. Applications — how to verify

1. After install, wait a few minutes → Metrics Summary → `datadog.agent.running` / `datadog.agent.started`.  
2. `sudo datadog-agent status` (Linux) for check health.  
3. Add a host tag, restart Agent, confirm tag on those metrics.

## References

- [Agent](https://docs.datadoghq.com/agent/) · [Getting started with the Agent](https://docs.datadoghq.com/getting_started/agent/)  
- [Unified service tagging](https://docs.datadoghq.com/getting_started/tagging/unified_service_tagging/)  
- [03 Install](./03_Install_Host_Container_And_Kubernetes.md)
