# 11 — Infrastructure and host monitoring

[← Previous](./10_Alert_Hygiene_And_Burn_Rates.md) · [README](./README.md) · [Next →](./12_Application_And_Service_Monitoring.md)

## 1. Concepts — USE on the machines underneath

Hosts, VMs, and node pools are **resources**. Monitor them with **USE** (utilization, saturation, errors) so you see starvation before apps tip over.

| Resource | Utilization | Saturation | Errors |
|----------|-------------|------------|--------|
| CPU | % busy / load vs cores | Run queue | NMI / throttle (where visible) |
| Memory | Used / cache vs total | OOM kills, reclaim pressure | Alloc failures |
| Disk | % full, IO util | Queue length, await | IO errors |
| Network | Throughput vs nic | Softnet drops, qdisc | Interface errors |

**Where it sits:** infrastructure monitoring supports application SLOs—it is rarely the only page. Prefer paging on user symptoms; use host signals for dig and capacity ([15](./15_Capacity_And_Saturation.md)).

```text
User SLO burn ──► dig into service RED ──► dig into node USE / neighbor noisy
```

**Disconfirm:** CPU page for every spike ≠ good monitoring. Ignoring disk fill because “apps are green today” ≠ safe. Container metrics without node context ≠ full story ([33](./33_Kubernetes_Workload_Observability_Patterns.md)).

**Confirm:** For a node running checkout, which USE signals do you collect? What tickets vs pages?

## 2. Advanced — agents, cloud instances, and noise

**Agents / exporters:** node exporter–class metrics, cloud instance metrics, or both. Know scrape vs push and label attachment (`instance`, `job`).

**Autoscaling interaction:** scale events should be visible as events; flappy host alerts during scale races need dampening.

**Noisy neighbors:** saturation on shared hosts explains latency that app metrics alone cannot.

**Golden images / fleet:** baseline expected utilization; alert on fleet outliers more than absolute magic numbers when possible.

**Failure mode:** Alerting on memory *cache* as if it were pressure → false pages on healthy Linux hosts.

## 3. Applications

**Staff checklist**

- Disk fill and inode tickets before hard fail  
- Node USE visible beside service dashboards  
- OOM / throttle signals tied into dig runbooks  

**Exercise:** Correlate one latency incident with node saturation. Was the host story in the first dashboard you opened?

## References

- [Linux performance — USE method](https://www.brendangregg.com/usemethod.html)  
- [4 Golden / USE](./4_Golden_Signals_RED_And_USE.md) · [15 Capacity](./15_Capacity_And_Saturation.md)
