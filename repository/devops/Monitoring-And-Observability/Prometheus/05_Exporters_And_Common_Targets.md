# 05 — Exporter ecosystem and common targets

[← Previous](./04_Configuration_Service_Discovery_And_Relabeling.md) · [README](./README.md) · [Next: PromQL →](./06_PromQL_Essentials.md) · [Writing exporters →](./13_Writing_Exporters_And_Native_Metrics.md)

## 1. Concepts — what an exporter is

An **exporter** is a process (or library surface) that takes metrics from a system that is **not** natively instrumented with a Prometheus client and exposes them on an HTTP `/metrics` endpoint for Prometheus to scrape.

```text
Thing you care about          Exporter                 Prometheus
(Linux, MySQL, SNMP, …)  →  translate / collect  →  scrape /metrics
```

**Three ways metrics enter Prometheus** (do not collapse them):

| Path | When | Examples |
|------|------|----------|
| **Direct instrumentation** | You own the code | Prom client / OTel in the app |
| **Exporter** | Third-party / OS / protocol | node, mysqld, blackbox, snmp |
| **Native Prometheus format** | Software already speaks Prom | Envoy, etcd, Kafka (some builds), Traefik, MinIO, … |

**Rule of thumb:** instrument code you ship; **export** infrastructure and dependencies you don’t. Prefer **native** exposure over a separate exporter when the vendor already does it well.

Official stance: the [exporters catalog](https://prometheus.io/docs/instrumenting/exporters/) lists many options. Some are **official** (Prometheus GitHub org); most are **community**. Prometheus cannot vet all community exporters for best practices—**you** own maintenance risk.

### Decision tree

```text
Do we own the code?
  yes → instrument (client / OTel)          [prefer]
  no  → Does it expose Prometheus natively?
          yes → scrape it directly
          no  → Is there a maintained exporter?
                  yes → run exporter; pin version; own it
                  no  → textfile / script / custom exporter ([13](./13_Writing_Exporters_And_Native_Metrics.md))
                        or accept black-box only
```

### Ecosystem map (by job — not an endless logo list)

Use categories to **choose**, then open the live catalog for exact project names.

| Category | Job | Common / notable | Official examples |
|----------|-----|------------------|-------------------|
| **Host / OS** | USE on machines | **node_exporter**, process-exporter, cAdvisor | node_exporter |
| **Probing** | Outside-in checks | **blackbox_exporter**, smokeping_prober | blackbox_exporter |
| **Kubernetes** | Objects / kubelet | **kube-state-metrics**, cAdvisor | (KSM widely standard) |
| **Databases** | Peer RED / USE | mysqld, postgres, redis, mongodb, elasticsearch, memcached | mysqld, memcached, consul |
| **Messaging** | Queue depth / lag | kafka, rabbitmq, nats | — |
| **HTTP / proxy** | Edge / LB | haproxy, nginx, apache, varnish, traefik (often native) | haproxy |
| **JVM zoo** | Brokers, app servers | **JMX exporter** (Kafka, Cassandra, …) | JMX exporter |
| **Other monitors → Prom** | Bridge estates | cloudwatch, stackdriver, snmp, statsd, graphite, collectd, influx | cloudwatch, snmp, statsd, graphite, collectd, influx, JMX |
| **Storage / infra** | Ceph, NetApp, … | ceph and vendor exporters | — |
| **CI / SaaS APIs** | Delivery & vendor health | jenkins, github, various cloud APIs | — |
| **Logging bridges** | Parse logs → metrics | mtail, grok_exporter | — |
| **Batch / local files** | Machine cron outcomes | **node_exporter textfile** | (pattern, not a separate product) |

Full lists change—treat the table as a **map**, the docs page as the **index**.

### Core exporters you will meet first

#### node_exporter (official)

Linux (and related) host metrics. Collectors are flag-gated—enable what you need. Map to USE ([parent 11](../11_Infrastructure_And_Host_Monitoring.md)). Machine-tied batch → **textfile collector**, not Pushgateway ([03](./03_Architecture_Scrape_And_Pushgateway.md)).

#### blackbox_exporter (official)

Prometheus scrapes blackbox with ` /probe` + target param; modules define HTTP/TCP/ICMP/DNS/TLS checks. Relabel so `instance` is the probed URL. Vantage point should resemble users ([parent 5](../5_Black_Box_White_Box_And_Synthetics.md)).

#### kube-state-metrics

Kubernetes object *state* (deployments desired/available, etc.)—not the same as app RED. Pair with node/cAdvisor and app metrics ([parent 33](../33_Kubernetes_Workload_Observability_Patterns.md)).

#### Database / cache exporters

mysqld_exporter (official), postgres_exporter, redis_exporter, memcached (official), elasticsearch_exporter, … Expose connections, replication lag, buffer/hit rates—wire as **peer** signals ([parent 13](../13_Dependency_And_Peer_Monitoring.md)). Prefer app-side query latency RED too.

#### JMX exporter (official)

Wide net for JVM apps (Kafka, Cassandra, …). Often needs **YAML transform config**—not zero-config. Budget time for mapping.

#### Bridge exporters (other monitoring systems)

| Bridge | Role |
|--------|------|
| **snmp_exporter** | Network gear via SNMP (needs generator config) |
| **statsd_exporter** / **graphite_exporter** | Legacy metric pipes |
| **cloudwatch_exporter** | AWS CloudWatch → Prom (cost/API limits) |
| **collectd_exporter** / **influxdb_exporter** | Ingest other agents’ models |

These are **translation layers**—cardinality and naming quality vary; expect configuration.

**Staff confuse this constantly:** “We installed exporters” ≠ application SLOs. Official ≠ automatic fit for your cardinality budget. Native `/metrics` on Envoy ≠ you can skip ServiceMonitors.

**Disconfirm:** Exporter tourism (one of each category) ≠ a program. Unmaintained GitHub exporter ≠ free. Healthz-only blackbox ≠ journey monitoring.

**Confirm:** For checkout, which metrics come from app vs node vs blackbox vs DB exporter vs native sidecars? Who owns each binary’s version?

## 2. Advanced concepts

### Official vs community

| | Meaning |
|--|---------|
| **Official** | Under prometheus org; still read release notes |
| **Community** | May be excellent or abandoned—check stars ≠ ownership; pin commits/tags; have a backup plan |

Default ports and overlapping exporters: see the community [default port wiki](https://github.com/prometheus/prometheus/wiki/Default-port-allocations)—useful to avoid collisions, not a quality badge.

### Placement and topology

| Pattern | Use |
|---------|-----|
| DaemonSet / host agent | node_exporter |
| Sidecar next to app | When scrape must share network namespace |
| Central blackbox | Probes from chosen regions/VPCs |
| One exporter per DB instance vs shared | Prefer clear `instance` labels; watch connection load on the DB |

### Cardinality and cost

Exporters inherit all label sins. Disable per-server or per-table metrics when estates are large (HAProxy-style filters; mysqld collector flags). Same seatbelts as apps: metric_relabel ([04](./04_Configuration_Service_Discovery_And_Relabeling.md)).

### Auth and security

Bind exporters to localhost + scrape via sidecar, or mTLS/network policy from Prometheus. Exporters that need DB passwords are **secret surfaces**—rotate like app credentials.

### Failure modes

| Failure | Symptom | Direction |
|---------|---------|-----------|
| Huge collector set | scrape timeout, flappy `up` | Disable collectors |
| Bridge misconfig | empty or nonsense series | Fix transform YAML |
| Dead community exporter | silent gaps | Replace or native path |
| Scraping exporter + native duplicate | double counting | Pick one source of truth |

## 3. Applications and use cases

| Estate need | Starter kit |
|-------------|-------------|
| Classical VMs | node + file_sd + app `/metrics` + blackbox |
| K8s platform | node (or equiv) + kube-state-metrics + app ServiceMonitors + blackbox |
| Data-heavy | postgres/mysql/redis exporters + app RED on queries |
| JVM brokers | JMX exporter with checked config |
| Network-heavy | snmp_exporter + blackbox |
| Brownfield StatsD/Graphite | statsd/graphite exporters as bridge—plan exit |
| Softwares with native Prom | scrape Envoy/Traefik/etcd directly—skip duplicate exporters |

**Staff checklist**

- Inventory: every scrape target classified (app / native / exporter / bridge)  
- Owner + pinned version per exporter  
- Collectors/filters documented for node and chatty DB exporters  
- No duplicate native+exporter for the same signal  
- Catalog bookmark: [exporters and integrations](https://prometheus.io/docs/instrumenting/exporters/)  
- Writing / custom path: [13](./13_Writing_Exporters_And_Native_Metrics.md)  

**Good:** small set of exporters with owners; apps instrumented; blackbox on user URLs.  
**Bad:** twenty random exporters, zero app RED, nobody knows who runs mysqld_exporter.

## References

- [Exporters and integrations](https://prometheus.io/docs/instrumenting/exporters/) (living catalog)  
- [Default port allocations (wiki)](https://github.com/prometheus/prometheus/wiki/Default-port-allocations)  
- [Writing exporters](https://prometheus.io/docs/instrumenting/writing_exporters/) → depth in [13](./13_Writing_Exporters_And_Native_Metrics.md)  
- [node_exporter](https://github.com/prometheus/node_exporter) · [blackbox_exporter](https://github.com/prometheus/blackbox_exporter)  
- [06 PromQL](./06_PromQL_Essentials.md)
