# 06 — Metrics, infrastructure, and hosts

[← Previous](./05_Logs_Ingest_Discover_And_Streams.md) · [README](./README.md) · [Next →](./07_APM_Tracing_And_RUM.md)

## 1. Concepts — infra signals in Elastic

Infrastructure monitoring in Elastic Observability covers **hosts, containers, Kubernetes, and cloud** metrics (and often related logs) so you can spot resource pressure beside app traces. Collection is typically **Elastic Agent + integrations** or **EDOT / OpenTelemetry** for host and K8s signals.

| Surface | Job |
|---------|-----|
| **Infrastructure → Hosts** | Compare hosts, CPU/mem/disk/network, alert density, drill to problems |
| **Inventory** | Metrics-driven view grouped by resource type (host, pod, container, …) |
| **Integrations** | System, Kubernetes, Docker, cloud provider metrics packs |
| **Universal Profiling** | Whole-machine continuous profiling (where licensed/available)—pointer to [17](./17_Profiling_And_Network_Topology.md) |
| **Metrics reference / app fields** | Know which fields the UI expects (`host.name`, `cloud.*`, K8s labels, …) |

**Plain language:** Hosts UI answers “is the box/pod sick?” APM answers “is the request sick?” You want both with shared identity (`host.name`, K8s labels, `service.name` / `resource.attributes.service.name`).

### Minimal loop

1. **Add data** → Host or Kubernetes → **Elastic Agent: Logs & Metrics** or **OpenTelemetry: Full Observability**.  
2. Optionally choose **Classic ingestion** vs **Wired Streams** for logs (metrics/traces stay classic)—[05](./05_Logs_Ingest_Discover_And_Streams.md).  
3. Confirm metrics in **Infrastructure → Hosts** (or Inventory / cluster views).  
4. Open a noisy host → related logs / processes.  
5. Tie the same deploy/env to APM services ([07](./07_APM_Tracing_And_RUM.md)).

Default UI index patterns: `metrics-*` and `metricbeat-*` (configurable). System metrics quickstarts typically land under `metrics-system.*` streams via the System integration. Key host fields the UI expects include host identifiers, cloud metadata when present, and process/network series—custom metrics must map cleanly or Hosts charts stay empty for those series.

### System metrics minimal fields (mental model)

| Concern | Typical signals |
|---------|-----------------|
| CPU / load | System CPU %, load averages |
| Memory | Used / available / cached |
| Disk | Filesystem used %, IO |
| Network | Bytes/packets in/out |
| Identity | `host.name`, cloud instance id, K8s node name |

Serverless **Logs Essentials** does **not** include Infrastructure and hosts—need **Complete** ([03](./03_Deploy_Self_Managed_Cloud_And_Serverless.md)).

**Disconfirm:** Agent installed, System integration off ⇒ empty Hosts. Prometheus scraped elsewhere with no Elastic write path ⇒ Elastic Hosts stays blank. Profiling alone ≠ request-level SLOs. Metrics-only dashboards empty on Essentials ≠ “broken integration.” Metric anomaly on OTel hosts ≠ supported (use thresholds).

**Confirm:** Agent or EDOT for infra? Which integration policies cover prod nodes? Same env/service labels as APM? Capacity alerts on the monitored fleet *and* on the Elastic cluster itself? Who owns Universal Profiling license decision ([17](./17_Profiling_And_Network_Topology.md))?

## 2. Advanced — anomalies, K8s density, Prom coexistence

**Anomaly / ML rules.** From Infrastructure Inventory → **Anomaly detection**, enable ML jobs for **Hosts** or **Kubernetes Pods** (memory usage + inbound/outbound traffic). Jobs analyze roughly the last four weeks and keep running; partition fields (default `kubernetes.namespace` for K8s) matter. **Not available for OpenTelemetry hosts**—OTel infra digs use thresholds/custom metrics instead. Feature availability depends on tier/license (Serverless Complete; Editor+ to create jobs).

**Hosts dig literacy.** Compare hosts without new dashboards; sort by alert density; jump to related logs/processes. Inventory groups by resource type. Keep UI settings (`metrics-*` / `metricbeat-*` patterns) aligned with where Agent/EDOT actually writes.

**Kubernetes density.** DaemonSets multiply time series; high-cardinality labels (pod UID as a metric dimension) hurt. Prefer stable workload identity (`k8s.deployment.name`, namespace, `service.name`). Autodiscover/hints miss silent pods until annotation/policy fix. Tutorial paths exist for observing K8s deployments and Nginx via Agent or OTel integrations.

**Custom metrics.** OTel custom metrics and Agent integrations both work; align names with how dashboards and SLOs will query. Install **OpenTelemetry Assets** / K8s OTel content packs when digging OTel-native infra ([10](./10_OpenTelemetry_To_Elastic.md)).

**Universal Profiling.** Separate continuous profiler path—not OTel-native, not available via mOTLP. Use for CPU efficiency and “expensive line of code” hunts; do not substitute for APM on critical request paths ([17](./17_Profiling_And_Network_Topology.md)).

**Vs Prometheus.** Many teams keep Prom for scrape-native SLOs and use Elastic for logs/APM—or dual-write carefully. Two sources of truth without a primary dig path splits incidents ([Prometheus](../Prometheus/README.md), [parent 20](../20_Sampling_Strategies.md)). Prefer one primary for on-call golden signals. If you remote-write Prom into Elastic, treat field mapping and cardinality like first-class design—not a weekend experiment.

**Cloud / CI / LLM add-ons.** Host Agent alone does not cover managed cloud services, CI pipelines, or LLM call economics—use official integrations / OTel frameworks when those surfaces matter ([15](./15_Cloud_Integrations.md), [22](./22_CI_CD_Observability.md)).

**Custom metrics hygiene.** Prefer bounded attribute sets; avoid user id / request id as metric dimensions. Name metrics so SLOs and Lens panels can find them without folklore. First dig from Hosts: sort by alerts → open host → related logs → jump to APM `service.name` if tagged.

**Inventory vs Hosts.** Inventory is the resource-type heatmap; Hosts is the detailed compare/drill UI. Learn both—on-call often starts in Inventory then lands in Hosts for one machine.

**Failure modes**

| Failure | What you see |
|---------|----------------|
| Clock / timezone skew | Spiky charts, misaligned deploys |
| Missing cloud integration | Blind managed services (RDS, etc.) while VMs look fine ([15](./15_Cloud_Integrations.md)) |
| Autodiscover miss | New pods silent until annotation/policy fix |
| Metrics-only dashboards on Essentials | Empty panels—tier limitation |
| Pod UID as metric dimension | Mapping / cardinality pain |
| Prom + Elastic, two owners | Conflicting “source of truth” during pages |

## 3. Applications — use cases

| Use case | What to do |
|----------|------------|
| First VM | System integration → Hosts healthy → disk/CPU inventory rule |
| K8s cluster | K8s integration or EDOT K8s quickstart; one namespace deep-dive |
| Noisy neighbor | Hosts compare + related APM service latency |
| Cloud managed DB | Official cloud integration—not only host agents |
| CPU hotspot without APM span | Universal Profiling ([17](./17_Profiling_And_Network_Topology.md)) if licensed |
| OTel K8s overview | Install OpenTelemetry Assets / K8s OTel dashboards; dig Hosts with `resource.attributes.*` |

**Staff checklist:** infra ship path per OS/K8s; Hosts shows prod; label contract with APM; inventory/threshold rules with destinations; cluster self-monitoring; document Universal Profiling only if licensed and useful; decide Prom coexistence policy in writing; note OTel hosts skip built-in metric anomaly jobs.

## References

- [Infrastructure and hosts](https://www.elastic.co/docs/solutions/observability/infra-and-hosts) · [Analyze host metrics](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/analyze-infrastructure-host-metrics) · [Analyze and compare hosts](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/analyze-compare-hosts) · [Detect metric anomalies](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/detect-metric-anomalies) · [System metrics get started](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/get-started-with-system-metrics) · [Metrics reference](https://www.elastic.co/docs/reference/observability/metrics-reference) · [Universal Profiling](https://www.elastic.co/docs/solutions/observability/infra-and-hosts/universal-profiling)  
- [05 Logs](./05_Logs_Ingest_Discover_And_Streams.md) · [07 APM](./07_APM_Tracing_And_RUM.md) · [17 Profiling](./17_Profiling_And_Network_Topology.md) · [Prometheus](../Prometheus/README.md)
