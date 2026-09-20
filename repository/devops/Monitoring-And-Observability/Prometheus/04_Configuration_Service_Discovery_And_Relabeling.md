# 04 — Configuration, service discovery, and relabeling

[← Previous](./03_Architecture_Scrape_And_Pushgateway.md) · [README](./README.md) · [Next: Exporters →](./05_Exporters_And_Common_Targets.md)

## 1. Concepts

Prometheus is configured mainly through **`prometheus.yml`** plus rule files. Think in stanzas:

| Stanza | Job |
|--------|-----|
| `global` | Default scrape/evaluation intervals; **`external_labels`** |
| `scrape_configs` | How to find and scrape targets |
| `rule_files` | Recording + alerting ([07](./07_Recording_Rules_And_SLIs.md), [08](./08_Alerting_Rules_And_Alertmanager.md)) |
| `alerting` | Alertmanager targets — list **all** HA peers ([08](./08_Alerting_Rules_And_Alertmanager.md)) |
| `remote_write` | Optional long-term / global backends ([09](./09_Storage_Remote_Write_Federation_And_HA.md)) |

### Minimal mental scrape job

```yaml
scrape_configs:
  - job_name: checkout
    metrics_path: /metrics
    scrape_interval: 15s
    static_configs:
      - targets: ["checkout:8080"]
        labels:
          env: staging
```

On Kubernetes you usually do **not** hand-maintain hundreds of static targets—Operator **ServiceMonitor** objects generate equivalent scrape config ([10](./10_Kubernetes_Operator_And_Monitors.md)). Classical / VM estates often use **file_sd** dropped by config management ([parent 36](../36_Classical_Monolith_And_Distributed_Estates.md)).

### Service discovery → relabel → scrape → metric_relabel

```text
SD meta labels (__meta_kubernetes_…)
  → relabel_configs     (keep/drop targets; set job, instance, __address__)
  → HTTP scrape
  → metric_relabel_configs  (drop samples/labels after scrape)
  → TSDB
```

| Stage | Typical use |
|-------|-------------|
| **`relabel_configs`** | Keep pods with `prometheus.io/scrape=true`; rewrite scrape port; set `env` |
| **`metric_relabel_configs`** | Emergency-drop a bad `user_id` label; drop unused metric names |

**Seatbelt:** metric_relabel is how platform stops a bad app release from melting the TSDB while developers fix instrumentation ([02](./02_Data_Model_Types_And_Labels.md)).

**Staff confuse this constantly:** Kubernetes SD “is on” ≠ every pod is scraped. Selectors / keep rules decide.

**Disconfirm:** Greedy scrape-all ≠ production. Fixing cardinality only in Grafana ≠ protecting Prometheus. Forgetting `external_labels` with multiple servers ≠ debuggable federation.

**Confirm:** Where do pod meta labels become `app=`? Where do you drop a poison label at 3am?

## 2. Advanced concepts

### `external_labels`

Attached on federation and remote write—identify `cluster`, `replica`, `env`. Required mental model whenever more than one Prometheus exists.

### Auth

TLS, bearer tokens, basic auth, OAuth2 for scrape—rotate like app secrets.

### Reload safely

`promtool check config` / `check rules` in CI → `POST /-/reload` (lifecycle enabled) or controlled rollout. Never edit-prod-blind.

### Common relabel keep pattern (idea)

Keep only annotated workloads; map annotation port → `__address__`; set `job` from k8s label. Exact YAML evolves—copy from your platform template, don’t invent per-PR dialects.

**Failure mode:** Relabel drops `instance` → series collide; or keep-all → scrape storm and timeout flaps.

## 3. Applications and use cases

| Scenario | Config move |
|----------|-------------|
| New VM service | file_sd entry + job |
| New K8s service | ServiceMonitor matching platform selectors |
| Cardinality incident | metric_relabel drop → then fix app |
| Multi-cluster | distinct `external_labels.cluster` |

**Staff checklist**

- Config + rules in Git; `promtool` in CI  
- Explicit keep/drop on every dynamic SD job  
- `external_labels` set for multi-Prom / remote write  
- Documented reload owner  

## References

- [Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)  
- [Relabel_config](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config)  
- [05 Exporters](./05_Exporters_And_Common_Targets.md)
