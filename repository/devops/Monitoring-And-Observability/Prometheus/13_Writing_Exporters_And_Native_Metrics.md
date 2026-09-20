# 13 — Writing exporters and native Prometheus metrics

[← Previous](./12_Worked_Example_First_Service.md) · [README](./README.md) · [Exporter map ←](./05_Exporters_And_Common_Targets.md)

## 1. Concepts — when you build or skip building

Use this chapter when:

- No good exporter exists, or  
- You must bridge a weird internal system, or  
- Software already exposes Prometheus metrics and you need to scrape it **without** a sidecar exporter.

Official guide: [Writing exporters](https://prometheus.io/docs/instrumenting/writing_exporters/). If you instrument **your own** code, prefer a **client library** (direct instrumentation) over inventing an “exporter” for yourself.

### Maintainability vs purity (official framing)

| Situation | Approach |
|-----------|----------|
| Few stable metrics (e.g. classic HAProxy exporter style) | Get metrics **perfect** |
| Hundreds of metrics that churn every vendor release (MySQL-class) | Accept transforms; expect ongoing work |
| Mixed (node_exporter modules) | Perfect where you hand-parse; lighter transform where kernels vary |

Do not sign up for perfect purity on a firehose API without staffing it.

### Configuration expectations

| Target type | Config burden |
|-------------|---------------|
| Application exporter | Prefer **zero config** beyond “where is the app”; optional filters for expensive metrics |
| Similar data model (CloudWatch, SNMP, collectd) | User selects which metrics to pull |
| Non-standard / JVM soup | User supplies transform config (**JMX**, Graphite, StatsD) |

YAML is the Prometheus-world default. Ship **examples** when transforms are required.

### Native exposure (no separate exporter)

Many systems speak Prometheus directly—scrape them as ordinary targets. Examples from the official “software exposing Prometheus metrics” list (non-exhaustive; check current docs):

| Kind | Examples |
|------|----------|
| Data / infra | etcd, Ceph, ClickHouse, CockroachDB, MinIO, ScyllaDB |
| Edge / mesh | Envoy, Traefik, Linkerd, Kong, Caddy |
| Platform | Kubernetes components, GitLab, Grafana, Docker daemon, Concourse |
| Messaging | RabbitMQ (with metrics enabled), Vector |

**Mark “direct”** in docs means instrumented with a Prometheus client. Still apply label contracts and scrape auth.

### Other utilities (not exporters)

Language helpers that wrap client libraries (django-prometheus, Micrometer registry, swagger-stats, …) are **instrumentation helpers**, not exporters. They belong in app code paths ([OpenTelemetry](../OpenTelemetry/README.md) / client libs).

**Disconfirm:** Writing an exporter for your own Go service ≠ better than the Go client. Scraping native **and** an exporter for the same process ≠ clever. Procedurally generated metric names ≠ maintainable.

**Confirm:** Are you bridging a third party, or avoiding client instrumentation? Is native `/metrics` already enough?

## 2. Advanced — exporter author rules (fact-checked)

### Naming

Follow [naming practices](https://prometheus.io/docs/practices/naming/) plus exporter-specific rules:

| Rule | Detail |
|------|--------|
| Prefix with exporter/system | e.g. `haproxy_…`, `mysqld_…` |
| Base units | seconds, bytes; ratios 0–1 not percents |
| No colons in exposed names | `:` reserved for **recording rules** |
| Avoid `_total` / `_sum` / `_count` / `_bucket` unless that type |
| Reserved prefixes | Care with `process_`, `scrape_`; exporter-local `jmx_scrape_duration_seconds` is a good pattern |
| Failures | Prefer `requests_total` + `failures_total` (or failed counter)—**not** a `result=success|fail` label that breaks ratios |
| snake_case | Convert camelCase when it stays readable |

### Labels

| Do | Don’t |
|----|-------|
| Minimal instrumentation labels | `type` as a meaningless label |
| Separate metrics for read vs write | Stuff everything under one prefix metric |
| Drop vendor “total” rows that break `sum()` | `my_metric{label="total"}` alongside parts |
| Put version on an **info** metric | Apply the same static label to every series |
| Let Prometheus set **target** labels (`env`, `cluster`) | Bake datacenter taxonomy into the exporter |

Avoid clashing with common target labels when possible (`env`, `cluster`, `region`, …)—unless the application’s own resource is literally named that.

### Types and collectors

Map foreign types carefully to Counter/Gauge/Histogram/Summary. Use custom collectors when you must scrape a remote API on each Prometheus scrape—expose scrape success/duration for the exporter itself.

### Textfile collector pattern

For machine-local batch (patch cron, config-management client): write a `.prom` file node_exporter’s textfile collector reads. Prefer this over Pushgateway for machine-tied jobs ([03](./03_Architecture_Scrape_And_Pushgateway.md), [05](./05_Exporters_And_Common_Targets.md)).

### Failure modes for authors

| Mistake | User impact |
|---------|-------------|
| Metric name includes label names (`by_type`) | Breaks when aggregated |
| Duplicate totals as labels | `sum()` double-counts or lies |
| Unbounded labels from upstream | Melts buyer’s Prometheus—your exporter gets blamed |
| Requires config, ships no examples | Nobody adopts it correctly |

## 3. Applications and use cases

| Scenario | Move |
|----------|------|
| Vendor app with `/metrics` | Scrape native; skip exporter |
| Internal binary, few gauges | Small custom exporter or textfile |
| JVM legacy | JMX exporter + tested YAML |
| “Just push from cron on the box” | textfile collector |
| Considering a new public exporter | Read writing-exporters guide; ask prometheus-developers if unsure |

**Staff checklist**

- Prefer client instrumentation / native / existing maintained exporter before writing  
- If writing: naming + label review against this chapter  
- Exporter exposes its own scrape health/duration  
- Examples + flags to disable expensive metrics  
- Version pin + owner in the platform catalog ([05](./05_Exporters_And_Common_Targets.md))  

**Good:** thin exporter, clear prefix, base units, no taxonomy labels.  
**Bad:** kitchen-sink bridge with procedurally generated names and `env` baked in.

## References

- [Writing exporters](https://prometheus.io/docs/instrumenting/writing_exporters/)  
- [Exporters and integrations](https://prometheus.io/docs/instrumenting/exporters/)  
- [Metric naming](https://prometheus.io/docs/practices/naming/)  
- [Client libraries](https://prometheus.io/docs/instrumenting/clientlibs/)  
- [05 Ecosystem map](./05_Exporters_And_Common_Targets.md) · [02 Data model](./02_Data_Model_Types_And_Labels.md)
