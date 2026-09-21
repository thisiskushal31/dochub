# 02 — Architecture, Agent, and data plane

[← Previous](./01_What_Is_Datadog_And_When.md) · [README](./README.md) · [Next →](./03_Install_Host_Container_And_Kubernetes.md)

## 1. Concepts — how data gets into Datadog

The **Datadog Agent** runs on hosts (or as a container / DaemonSet). It collects system metrics and events and—when enabled—logs, traces, and processes. Source is open ([DataDog/datadog-agent](https://github.com/DataDog/datadog-agent)).

```text
Default host checks ──────┐
Integrations / Autodiscovery ─┼──► Agent ──► Datadog intake (your site)
DogStatsD (custom metrics) ───┤
APM / OTLP receivers ─────────┘
```

| Piece | Job |
|-------|-----|
| **`datadog.yaml`** | Main config: **API key**, **site**, host tags, feature toggles |
| **`conf.d/`** | Per-integration check configs |
| **Integrations** | Built-in checks (OS, Docker, cloud, apps) |
| **DogStatsD** | Apps emit custom metrics (StatsD + Datadog extensions) |
| **APM libraries / SSI** | Spans in-process; Agent receives traces |
| **Fleet Automation** | In-app install, upgrade, config, flares at scale |

Out of the box the Agent reports on the order of ~75–100 system metrics every few seconds (CPU, disk, memory, network, …) plus health (`datadog.agent.running`, `datadog.agent.started`). **Logs, APM, and live processes are off until you enable them.**

### Unified service tagging (do this early)

Reserved tags **`env`**, **`service`**, **`version`** tie metrics, logs, and traces so digs work ([parent 21](../21_Correlation_And_Dig_Methodology.md)):

| Environment | How you set them |
|-------------|------------------|
| Kubernetes | Labels `tags.datadoghq.com/env|service|version` on workload **and** pod template; `DD_ENV` / `DD_SERVICE` / `DD_VERSION` for tracers (Admission Controller can inject) |
| Docker | `DD_*` env + `com.datadoghq.tags.*` labels |
| Host process | Export `DD_*` in the service unit / start script |
| OpenTelemetry | Map `service.name`, `service.version`, `deployment.environment.name` ([10](./10_OpenTelemetry_To_Datadog.md)) |

Needs Agent **6.19+ / 7.19+** and a recent language SDK. Change `version` on every deploy.

**Disconfirm:** Skipping unified tags then wondering why Explore cannot jump metric → trace → log. Metrics-only Agent forever, then expecting APM. High-cardinality IDs as host tags.

**Confirm:** API key + site correct? Who owns Agent upgrades? Are `env`/`service`/`version` the same string everywhere?

## 2. Advanced — host vs container, tags, overhead

**Host vs container config.** Hosts use YAML under `/etc/datadog-agent/` (Linux). Containers often use **`DD_API_KEY`**, **`DD_SITE`**, and Autodiscovery from labels/annotations instead of hand-edited checks.

**Host-level tags** in `datadog.yaml` / `DD_TAGS` attach to everything that Agent emits—good for `team:`, bad for `user_id:`. Cardinality rules still apply ([04](./04_Metrics_Tags_And_Cardinality_Cost.md)).

**Autodiscovery** configures integrations from pod/container metadata so Redis/NGINX checks follow the workload. Mis-labeled pods ⇒ missing or duplicated checks.

**Overhead.** Light configs are often on the order of ~0.1% CPU and ~1 GB disk—measure yours with logs/APM/NPM on. Fleet Automation and remote config reduce SSH snowflakes; still pin majors for review.

**DogStatsD** is the custom-metrics on-ramp. Prefer bounded tag keys; distributions when you need global percentiles.

## 3. Applications — use cases and verification

| Use case | Pattern |
|----------|---------|
| Brownfield VMs | One Agent per host; host tags for `env`/`team`; enable logs later |
| Kubernetes | DaemonSet + Cluster Agent; unified labels on Deployments |
| Custom business KPIs | DogStatsD behind an approved library wrapper |
| Dig drill | Break staging; jump Infrastructure → APM → Logs on the same `service` |

**Staff checklist**

1. After install, Metrics Summary → `datadog.agent.running` / `datadog.agent.started`.  
2. `sudo datadog-agent status` (Linux) — checks OK, no intake auth errors.  
3. Add one host tag; restart; confirm tag on those metrics.  
4. Document tag taxonomy before DogStatsD goes wide.

## References

- [Agent](https://docs.datadoghq.com/agent/) · [Getting started with the Agent](https://docs.datadoghq.com/getting_started/agent/)  
- [Unified service tagging](https://docs.datadoghq.com/getting_started/tagging/unified_service_tagging/)  
- [03 Install](./03_Install_Host_Container_And_Kubernetes.md)
