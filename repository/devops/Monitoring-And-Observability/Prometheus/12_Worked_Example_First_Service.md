# 12 — Worked example — first service

[← Previous](./11_Operations_Pitfalls_And_Staff_Checklist.md) · [README](./README.md) · [Next: Exporters craft →](./13_Writing_Exporters_And_Native_Metrics.md)

## 1. Concepts — ship one thin vertical slice

Goal: one service goes **instrument → scrape → record → alert → notify** in staging. Language SDKs differ; control points do not.

```text
Developer                 Platform
─────────                 ────────
/metrics + labels   →     scrape / ServiceMonitor
                    →     recording rules (RED / SLI)
                    →     alerting rule + Alertmanager route
                    →     Grafana panels on recordings
```

### Step-by-step

**1. Instrument (app)**  
- Counter: `checkout_http_requests_total` with **bounded** labels (`method`, `code_class`).  
- Histogram: `checkout_http_request_duration_seconds` (unit **seconds**).  
- No raw path with IDs; no `:` in the metric name ([02](./02_Data_Model_Types_And_Labels.md)).  
- Client lib or OTel → Prometheus exposition.

**2. Prove exposition**  
```bash
curl -sS "http://127.0.0.1:8080/metrics" | grep checkout_http
```
You should see `# TYPE` and live series.

**3. Scrape**  
- VM/classical: static or file_sd job ([04](./04_Configuration_Service_Discovery_And_Relabeling.md)).  
- Kubernetes: ServiceMonitor whose labels match the Prometheus CR selectors ([10](./10_Kubernetes_Operator_And_Monitors.md)).  
- UI **Status → Targets**: state **UP**. Query: `up{job="checkout"}`.

**4. Record** ([07](./07_Recording_Rules_And_SLIs.md))  
```yaml
- record: job:checkout_http_requests:rate5m
  expr: sum by (job) (rate(checkout_http_requests_total[5m]))
- record: job:checkout_http_failures_per_requests:ratio_rate5m
  expr: |
    sum by (job) (rate(checkout_http_requests_total{code_class="5xx"}[5m]))
    /
    sum by (job) (rate(checkout_http_requests_total[5m]))
```
Run `promtool check rules` before apply.

**5. Alert** ([08](./08_Alerting_Rules_And_Alertmanager.md))  
```yaml
- alert: CheckoutHighErrorRatio
  expr: job:checkout_http_failures_per_requests:ratio_rate5m > 0.05
  for: 10m
  labels: { severity: page, service: checkout }
  annotations:
    summary: "Checkout error ratio high"
    runbook_url: "https://wiki.example/runbooks/checkout-errors"
```

**6. Notify**  
Alertmanager route `severity=page` → Slack (staging) or [PagerDuty](../PagerDuty/README.md) (prod). Prometheus must list **all** AM peers if clustered.

**7. Dashboard**  
Grafana panels query the **recorded** metrics—not 20-line raw PromQL ([Grafana](../Grafana/README.md)).

### Prove it with fault injection

| Inject | Expect |
|--------|--------|
| Kill process / break scrape | `up` → 0; optional targetDown after `for:` |
| Force ~10% 5xx for >10m | ratio rises → **pending** → **firing** → Slack/PD |
| Heal | Resolve; watch group timers / `keep_firing_for` if enabled |

**Disconfirm:** Grafana before Targets=UP ≠ debugging. CPU-only alert for this exercise ≠ learning Prometheus SLIs. Skipping Alertmanager “for later” ≠ finishing the slice.

**Confirm:** Can you narrate pending vs firing while watching the alert? Does the notification include the runbook URL?

## 2. Advanced — make it real for your estate

| Estate | Extra after the slice works |
|--------|-----------------------------|
| **Node.js** | Event-loop delay/utilization panels ([parent 35](../35_Runtime_And_Language_Specific_Signals.md)) |
| **JVM** | Heap / GC pause beside RED |
| **Classical VM** | file_sd + node_exporter; same rules ([parent 36](../36_Classical_Monolith_And_Distributed_Estates.md)) |
| **K8s** | Example ServiceMonitor + PrometheusRule in the service repo |
| **User journey** | blackbox/synthetic on the public URL ([05](./05_Exporters_And_Common_Targets.md)) |
| **Dependencies** | DB/queue exporters from the ecosystem map ([05](./05_Exporters_And_Common_Targets.md)); prefer native if available ([13](./13_Writing_Exporters_And_Native_Metrics.md)) |

Then: peer RED, burn-rate alerts, remote-write—**not** twenty random exporters.

## 3. Applications — definition of done

**Staff checklist**

- Target **UP**  
- Load: `rate` moves  
- Fault: pending → firing → human notification  
- Recordings named sanely (`level:metric:operations`)  
- No high-cardinality labels on new metrics  
- Runbook opens from the firing alert  
- Overview dashboard uses recordings  

**Good:** one service, quiet trustworthy page path.  
**Bad:** half-wired scrape and a screenshot of Grafana.

## References

- [Client libraries](https://prometheus.io/docs/instrumenting/clientlibs/)  
- [Naming practices](https://prometheus.io/docs/practices/naming/)  
- [Recording practices](https://prometheus.io/docs/practices/rules/)  
- [06 PromQL](./06_PromQL_Essentials.md) · [Parent 12](../12_Application_And_Service_Monitoring.md)
